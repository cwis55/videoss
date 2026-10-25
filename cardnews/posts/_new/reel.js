// 새 게시물 릴스 (v2.1) — 초코 바탕 + 가운데 큰 게임 영상(1080x900), 글자는 최소. 모든 장면은 영상(가로 1920x1080 clip).
// 고정 순서: hook → info → point(3~4개) → outro. 15~20초 목표. 목소리·속도는 cardnews/voice.json
// hook: 제목 + say(읽기만). point: 이모지 태그 + 자막(sub) 한 줄. fx: 가로로 자를 위치(0~1)
// 날짜는 '내일' 말고 '10월 26일'처럼 실제 날짜로 (나중에 보는 사람도 있음)
// srcCrop: 트레일러에 박힌 자막은 블러 말고 원본에서 그 아래를 잘라냄 { y: 0, h: 815 }
const C = 'posts/_new/reel/clips/';

REEL = {
  layout: 'framed',
  endHold: 1.0,
  // srcCrop: { y: 0, h: 815 },
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3,
      headline: '짧은 후킹\n*강조 한 줄*',
      bubble: '10/26 출시!',
      say: '첫마디는 비교·궁금증·타이밍으로!' },

    { type: 'info', clip: C + 'info.mp4', dur: 3,
      headline: '게임 이름\n*두 번째 줄*',
      chips: ['출시일/가격', '한국어 지원 여부', '인원'],
      say: '이름은 게임 이름! 한 줄 정보!' },

    { type: 'point', clip: C + 'p1.mp4', dur: 3,
      eyebrow: '🍳 키워드',
      sub: '자막 한 줄 *강조*' },

    { type: 'outro', clip: C + 'outro.mp4', dur: 3,
      lead: '재밌어 보이면',
      headline: '같이 할 친구\n*태그*해줘!',
      say: '재밌어 보이면 같이 할 친구 태그해 줘!' },
  ],
};
