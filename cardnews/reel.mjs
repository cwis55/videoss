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

const ff = args => { if (process.env.DEBUG) console.log(['ffmpeg', ...args].map(a => JSON.stringify(a)).join(' ')); return execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]); };
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
const { scenes, voice: VOICE = {} } = await page.evaluate(() => REEL);
// 음성 가공: 피치를 올리고(asetrate) 말 속도를 조절(atempo) → 길이는 pitch*speed 배로 줄어듦
const PITCH = VOICE.pitch ?? 1, SPEED = VOICE.speed ?? 1;
const voiceFx = `asetrate=44100*${PITCH},aresample=44100,atempo=${SPEED}`;
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
  await el.$$eval('.sub, .endcard', es => es.forEach(e => { e.style.visibility = 'hidden'; }));
  await el.screenshot({ path: `${tmp}/${n}_base.png`, omitBackground: true });
  // 엔드카드는 다른 요소를 다 숨기고 따로 캡처
  const end = await el.$('.endcard');
  if (end) {
    await el.evaluate(e => [...e.children].forEach(c => { c.style.visibility = c.classList.contains('endcard') ? 'visible' : 'hidden'; }));
    await el.screenshot({ path: `${tmp}/${n}_end.png`, omitBackground: true });
  }
  layers.push({ n, lines, end: !!end });
}
await browser.close();

// 효과음 (assets/sfx/에 파일이 있을 때만): whoosh=장면 전환, pop=장면마다 자막 첫 줄, end=엔드카드
const SFX_VOL = { whoosh: 0.4, pop: 0.35, end: 1.0 };
const SFX = Object.fromEntries(['whoosh', 'pop', 'end'].map(k => [k, `${root}/assets/sfx/${k}.mp3`]).filter(([, f]) => existsSync(f)));
const END_HOLD = 2.3;                // 엔드카드가 보이는 시간

// 2) 장면별 영상 만들기
const parts = [];
for (const [i, s] of scenes.entries()) {
  const { n, lines, end } = layers[i];
  if (!s.clip) throw new Error(`장면 ${n}: clip(영상)을 넣어주세요.`);
  const voice = `${dir}/voice/${n}.mp3`;
  const hasVoice = existsSync(voice);
  const dur = (hasVoice ? probe(voice) / (PITCH * SPEED) + 0.45 : s.dur) + (end ? END_HOLD : 0);
  const out = `${tmp}/${n}.mp4`;

  // 배경: 같은 영상을 흐리게 깔고, 가운데에 원본 가로 영상
  // blur: [{ x, y, w, h, from, to }] 원본(1920x1080) 기준 좌표·클립 기준 초 → 자막/알림창 가리기
  const inputs = ['-stream_loop', '-1', '-ss', String(s.clipStart ?? 0), '-i', resolve(root, s.clip)];
  // 클립이 장면보다 짧으면 되감기 대신 살짝 느리게 재생해서 길이를 맞춤
  const avail = probe(resolve(root, s.clip)) - (s.clipStart ?? 0);
  const slow = dur > avail ? `setpts=PTS*${(dur / avail + 0.01).toFixed(3)},` : '';
  let fc = `[0:v]${slow}fps=${FPS},scale=1920:1080[src0]`;
  for (const [k, b] of (s.blur ?? []).entries()) {
    fc += `;[src${k}]split[m${k}][c${k}];[c${k}]crop=${b.w}:${b.h}:${b.x}:${b.y},boxblur=25:3[bb${k}];` +
      `[m${k}][bb${k}]overlay=${b.x}:${b.y}:enable='between(t,${b.from},${b.to})'[src${k + 1}]`;
  }
  const src = `src${(s.blur ?? []).length}`;
  fc += `;[${src}]split[a][b];[a]scale=-2:${H},crop=${W}:${H},boxblur=30:2,eq=brightness=-0.18[back];` +
    `[b]scale=${W}:${BAND.h}[front];[back][front]overlay=0:${BAND.y}[v0]`;

  inputs.push('-loop', '1', '-i', `${tmp}/${n}_base.png`);
  fc += `;[1:v]format=rgba,fade=in:st=0:d=0.2:alpha=1[base];[v0][base]overlay=0:0[v1]`;
  let last = 'v1', idx = 2;
  const sfx = SFX.whoosh && i > 0 ? [['whoosh', 0]] : [];
  // 자막: 줄마다 아래에서 통통 튀어 올라 살짝 넘쳤다가 제자리에 안착 (감쇠 진동)
  // 뒷줄이 앞줄 아래로 깔리도록 마지막 줄부터 합성
  for (const [k, l] of [...lines.entries()].reverse()) {
    const st = +(SUB_DELAY + k * LINE_GAP).toFixed(2), t = `(t-${st})`;
    inputs.push('-loop', '1', '-i', l.png);
    fc += `;[${idx}:v]format=rgba,fade=in:st=${st}:d=0.06:alpha=1[s${k}];` +
      `[${last}][s${k}]overlay=x=${l.x}:y='${l.y}+if(gte(t,${st}),110*exp(-7*${t})*cos(16*${t}),110)':eval=frame[l${k}]`;
    last = `l${k}`; idx++;
    if (SFX.pop && k === 0) sfx.push(['pop', st]);
  }
  // 마지막 장면: 초코색으로 페이드아웃 → 생생 엔드카드
  if (end) {
    const fo = +(dur - END_HOLD).toFixed(2);
    inputs.push('-loop', '1', '-i', `${tmp}/${n}_end.png`);
    fc += `;[${last}]fade=out:st=${fo}:d=0.7:color=0x2B1608[fo];[${idx}:v]format=rgba,fade=in:st=${fo + 0.5}:d=0.5:alpha=1[ec];` +
      `[fo][ec]overlay=0:0:enable='gte(t,${fo})'[vend]`;
    last = 'vend'; idx++;
    if (SFX.end) sfx.push(['end', fo + 0.3]);
  }

  // 오디오: 음성(없으면 무음) + 효과음을 먼저 wav로 따로 만든 뒤 영상에 붙임
  // (영상과 한 번에 합성하면 ffmpeg가 서로 기다리다 멈춤)
  const ain = hasVoice ? ['-i', voice] : ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo'];
  let amix = `[0:a]aresample=44100,${hasVoice ? `${voiceFx},adelay=120|120,` : ''}aformat=channel_layouts=stereo,apad[a0]`;
  const aIn = ['[a0]'];
  for (const [k, [name, at]] of sfx.entries()) {
    ain.push('-i', SFX[name]);
    const ms = Math.round(at * 1000);
    amix += `;[${1 + k}:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${ms}|${ms},volume=${SFX_VOL[name]}[x${k}]`;
    aIn.push(`[x${k}]`);
  }
  amix += `;${aIn.join('')}amix=inputs=${aIn.length}:duration=first:normalize=0${end ? `,afade=out:st=${(dur - 0.6).toFixed(2)}:d=0.6` : ''}[aout]`;
  ff([...ain, '-filter_complex', amix, '-map', '[aout]', '-t', dur.toFixed(3), '-ar', '44100', '-ac', '2', `${tmp}/${n}.wav`]);

  inputs.push('-i', `${tmp}/${n}.wav`);
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
