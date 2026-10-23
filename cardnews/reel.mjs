// 릴스(1080x1920 mp4)를 만듭니다.
// 사용법: node reel.mjs catmail   → posts/catmail/reel/out/reel.mp4
// posts/<이름>/reel/voice/01.mp3 ... 가 있으면 장면 길이를 음성에 맞추고 음성을 넣습니다 (tts.mjs로 생성).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const post = process.argv[2];
if (!post) throw new Error('게시물 이름을 넣어주세요. 예: node reel.mjs catmail');
const dir = `${root}/posts/${post}/reel`;
const tmp = `${dir}/out/tmp`;
mkdirSync(tmp, { recursive: true });

const W = 1080, H = 1920, FPS = 30;
const BAND = { y: 690, h: 608 };     // reel.html의 영상 자리와 같아야 함
const SUB_DELAY = 0.15;              // 자막 첫 줄이 튀어 오르기 시작하는 시점
const LINE_GAP = 0.14;               // 다음 줄이 따라 오르는 간격

const ff = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
const probe = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();

// 1) 장면별 글자 레이어를 투명 PNG로 뽑기
const url = new URL(pathToFileURL(`${root}/reel.html`));
url.searchParams.set('render', '1');
url.searchParams.set('post', post);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => { console.error('템플릿 오류:', e.message); process.exitCode = 1; });
await page.goto(url.href);
await page.waitForSelector('.scene');
await page.evaluate(() => document.fonts.ready);
const scenes = await page.evaluate(() => REEL.scenes);
const els = await page.$$('.scene');
const layers = [];
for (const [i, el] of els.entries()) {
  const n = String(i + 1).padStart(2, '0');
  // 캡처하면 스크롤이 바뀌므로 위치는 장면 기준으로 먼저 다 재 둠
  const pos = await el.$$eval('.sub .line span', (spans, scene) => {
    const s = scene.getBoundingClientRect();
    return spans.map(e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x - s.x), y: Math.round(b.y - s.y) }; });
  }, el);
  const lines = pos.map((p, k) => ({ ...p, png: `${tmp}/${n}_sub${k}.png` }));
  for (const [k, line] of (await el.$$('.sub .line span')).entries())
    await line.screenshot({ path: lines[k].png, omitBackground: true });
  await el.$$eval('.sub', subs => subs.forEach(e => { e.style.visibility = 'hidden'; }));
  await el.screenshot({ path: `${tmp}/${n}_base.png`, omitBackground: true });
  layers.push({ n, lines });
}
await browser.close();

// 2) 장면별 영상 만들기
const parts = [];
for (const [i, s] of scenes.entries()) {
  const { n, lines } = layers[i];
  const voice = `${dir}/voice/${n}.mp3`;
  const hasVoice = existsSync(voice);
  const dur = hasVoice ? probe(voice) + 0.35 : s.dur;
  const out = `${tmp}/${n}.mp4`;

  const inputs = [];
  let bg;
  if (s.clip) {
    inputs.push('-stream_loop', '-1', '-ss', String(s.clipStart ?? 0), '-i', resolve(root, s.clip));
    bg = `[0:v]fps=${FPS},split[a][b];[a]scale=-2:${H},crop=${W}:${H},boxblur=30:2,eq=brightness=-0.18[back];[b]scale=${W}:${BAND.h}[front];[back][front]overlay=0:${BAND.y}[v0]`;
  } else if (s.image) {
    inputs.push('-loop', '1', '-i', resolve(root, s.image));
    const frames = Math.ceil(dur * FPS);
    bg = `[0:v]split[a][b];[a]scale=-2:${H},crop=${W}:${H},boxblur=30:2,eq=brightness=-0.18[back];` +
      `[b]scale=3840:-2,zoompan=z='1+0.06*on/${frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=${frames}:s=${W}x${BAND.h}:fps=${FPS}[front];[back][front]overlay=0:${BAND.y}[v0]`;
  } else {
    inputs.push('-f', 'lavfi', '-i', `color=c=0x2B1608:s=${W}x${H}:r=${FPS}`);
    bg = '[0:v]null[v0]';
  }
  inputs.push('-loop', '1', '-i', `${tmp}/${n}_base.png`);
  let fc = `${bg};[1:v]format=rgba,fade=in:st=0:d=0.2:alpha=1[base];[v0][base]overlay=0:0[v1]`;
  let last = 'v1', idx = 2;
  // 자막: 줄마다 아래에서 통통 튀어 올라 살짝 넘쳤다가 제자리에 안착 (감쇠 진동)
  // 뒷줄이 앞줄 아래로 깔리도록 마지막 줄부터 합성
  for (const [k, l] of [...lines.entries()].reverse()) {
    const st = +(SUB_DELAY + k * LINE_GAP).toFixed(2), t = `(t-${st})`;
    inputs.push('-loop', '1', '-i', l.png);
    fc += `;[${idx}:v]format=rgba,fade=in:st=${st}:d=0.06:alpha=1[s${k}];` +
      `[${last}][s${k}]overlay=x=${l.x}:y='${l.y}+if(gte(t,${st}),110*exp(-7*${t})*cos(16*${t}),110)':eval=frame[l${k}]`;
    last = `l${k}`; idx++;
  }
  if (hasVoice) inputs.push('-i', voice);
  else inputs.push('-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo');
  ff([...inputs, '-filter_complex', fc, '-map', `[${last}]`, '-map', `${idx}:a`, '-t', dur.toFixed(3),
    '-r', String(FPS), '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-ar', '44100', '-ac', '2', out]);
  parts.push(out);
  console.log(`장면 ${n} (${s.type}) ${dur.toFixed(1)}초`);
}

// 3) 이어 붙이기
writeFileSync(`${tmp}/list.txt`, parts.map(p => `file '${p}'`).join('\n'));
const final = `${dir}/out/reel.mp4`;
ff(['-f', 'concat', '-safe', '0', '-i', `${tmp}/list.txt`, '-c', 'copy', '-movflags', '+faststart', final]);
if (!process.env.KEEP_TMP) rmSync(tmp, { recursive: true });
console.log(`${final} (${probe(final).toFixed(1)}초)`);
