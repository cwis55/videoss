// 카드뉴스를 1080x1350 PNG로 저장합니다.
// 사용법: node render.mjs [template.html] [출력폴더]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const src = resolve(process.argv[2] ?? 'template.html');
const out = resolve(process.argv[3] ?? 'out');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 1400 } });
page.on('pageerror', e => { console.error('템플릿 오류:', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(src).href);
await page.evaluate(() => document.fonts.ready);

const cards = await page.$$('.card');
if (!cards.length) throw new Error('카드를 찾지 못했어요. template.html의 CARDS 내용을 확인하세요.');
for (const [i, card] of cards.entries()) {
  const file = `${out}/${String(i + 1).padStart(2, '0')}.png`;
  await card.screenshot({ path: file });
  console.log(file);
}
await browser.close();
