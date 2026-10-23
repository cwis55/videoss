// 카드뉴스를 1080x1350 PNG(영상 슬라이드는 MP4도)로 저장합니다.
// 사용법: node render.mjs [게시물 이름] [출력폴더]
//   node render.mjs            → template.html 샘플 → out/
//   node render.mjs catmail    → posts/catmail/content.js → posts/catmail/out/
import { chromium } from 'playwright';
import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const post = process.argv[2];
const out = resolve(process.argv[3] ?? (post ? `${root}/posts/${post}/out` : `${root}/out`));
mkdirSync(out, { recursive: true });

const url = new URL(pathToFileURL(`${root}/template.html`));
url.searchParams.set('render', '1');
if (post) url.searchParams.set('post', post);

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 } });
page.on('pageerror', e => { console.error('템플릿 오류:', e.message); process.exitCode = 1; });
await page.goto(url.href);
await page.waitForSelector('.card', { timeout: 10000 }).catch(() => {
  throw new Error('카드를 찾지 못했어요. CARDS 내용을 확인하세요.');
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(100);   // 제목 글자 크기 자동 맞춤이 끝나도록
// 배경 이미지까지 다 불러온 뒤 캡처
await page.evaluate(() => Promise.all([...document.querySelectorAll('.bg')].map(el => {
  const m = getComputedStyle(el).backgroundImage.match(/url\("(.+)"\)/);
  if (!m) return null;
  const img = new Image();
  img.src = m[1];
  return img.decode().catch(() => null);
})));

const cards = await page.$$('.card');
for (const [i, card] of cards.entries()) {
  const name = `${out}/${String(i + 1).padStart(2, '0')}`;
  await card.screenshot({ path: `${name}.png` });
  console.log(`${name}.png`);

  const video = await card.getAttribute('data-video');
  if (!video) continue;
  // 글자·장식만 투명 PNG로 뽑아서 영상 위에 합성
  await card.evaluate(el => el.classList.add('overlay-only'));
  await card.screenshot({ path: `${name}_overlay.png`, omitBackground: true });
  await card.evaluate(el => el.classList.remove('overlay-only'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', resolve(root, video), '-i', `${name}_overlay.png`,
    '-filter_complex', '[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350[v];[v][1:v]overlay',
    '-an', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${name}.mp4`]);
  rmSync(`${name}_overlay.png`);
  console.log(`${name}.mp4`);
}
await browser.close();
