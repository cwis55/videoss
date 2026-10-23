// 새 게시물 릴스 — 모든 장면은 영상(가로 1920x1080 clip). 멈춘 화면 금지.
// 고정 순서: hook → info → point(3~5개) → outro.  목소리·속도는 cardnews/voice.json 고정값을 씀
// sub: 자막이자 TTS 대본 / say: 자막 없이 읽기만 / blur: 화면 속 글자 가리기 [{ x, y, w, h, from, to }]
const C = 'posts/_new/reel/clips/';

REEL = {
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3,
      eyebrow: '📦 장르 한 줄',
      headline: '첫 줄 후킹\n*두 번째 줄 강조*',
      bubble: '끝까지 봐!',
      sub: '첫마디 질문형 한 줄?' },

    { type: 'info', clip: C + 'info.mp4', dur: 3,
      headline: '게임 이름\n*영문 이름*',
      chips: ['인원', '장르'],
      price: { sale: '00,000원' },
      say: '이름은, 게임 이름! 가격은 ○○원!' },

    { type: 'point', clip: C + 'p1.mp4', dur: 3,
      eyebrow: 'POINT 1 · 키워드',
      headline: '포인트 제목\n*강조*',
      sub: '자막 한두 줄\n*강조*' },

    { type: 'outro', clip: C + 'outro.mp4', dur: 3,
      lead: '재밌어 보이면',
      headline: '같이 할 친구\n*태그*해줘!',
      say: '재밌어 보이면 같이 할 친구 태그해 줘!' },
  ],
};
