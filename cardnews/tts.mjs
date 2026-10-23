// ElevenLabs로 릴스 장면별 음성을 만듭니다.
// 사용법: NODE_USE_ENV_PROXY=1 node tts.mjs catmail   (목소리는 voice.json, 게시물 reel.js의 voice로 덮어쓰기 가능)
//  (키는 환경의 Network secrets로 자동으로 붙음. 직접 넣으려면 ELEVENLABS_API_KEY)
//  → posts/catmail/reel/voice/01.mp3 ... 생성 후 node reel.mjs catmail 하면 음성 길이에 맞춰 릴스가 만들어집니다.
// 장면의 say(없으면 sub)를 읽습니다. 둘 다 없는 장면은 음성 없이 dur 길이로 나옵니다.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url));
const post = process.argv[2];
const key = process.env.ELEVENLABS_API_KEY;
if (!post) throw new Error('게시물 이름을 넣어주세요. 예: node tts.mjs catmail');

const ctx = {};
vm.runInNewContext(readFileSync(`${root}/posts/${post}/reel.js`, 'utf8'), ctx);
const out = `${root}/posts/${post}/reel/voice`;
mkdirSync(out, { recursive: true });
const v = { ...JSON.parse(readFileSync(`${root}/voice.json`, 'utf8')), ...ctx.REEL.voice };
const voiceId = v.id ?? process.env.ELEVENLABS_VOICE_ID;
if (!voiceId) throw new Error('reel.js의 voice.id 나 ELEVENLABS_VOICE_ID 가 필요해요.');

// 세 번째 인자로 장면 번호를 주면 그 장면만 다시 뽑음. 예: node tts.mjs lightup 1,2
const only = process.argv[3]?.split(',').map(Number);
for (const [i, s] of ctx.REEL.scenes.entries()) {
  if (only && !only.includes(i + 1)) continue;
  const text = (s.say ?? s.sub ?? '').replace(/\*/g, '').replace(/\n/g, ' ').trim();
  if (!text) continue;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { ...(key && { 'xi-api-key': key }), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: v.model ?? 'eleven_v4',
      language_code: v.language ?? 'ko',   // 한국어 모드: 영어 이름도 한국어 발음으로
      voice_settings: { stability: v.stability ?? 0.5, similarity_boost: v.similarity ?? 0.75, ...(v.style != null && { style: v.style }) },
    }),
  });
  if (!res.ok) throw new Error(`장면 ${i + 1} 음성 생성 실패 (${res.status}): ${await res.text()}`);
  const file = `${out}/${String(i + 1).padStart(2, '0')}.mp3`;
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(file, text);
}
