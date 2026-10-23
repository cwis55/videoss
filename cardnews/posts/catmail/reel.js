// 냥냥 우체국 릴스 — 모든 장면이 트레일러 영상
// clip: 가로 영상(1920x1080), clipStart: 클립 안 시작 초, dur: 음성이 없을 때 장면 길이(초)
// sub: 자막이자 TTS 대본, say: 자막 없이 읽기만 할 대본
// blur: [{ x, y, w, h, from, to }] 클립 기준 좌표·초 → 화면 속 글자 가리기
const C = 'posts/catmail/reel/clips/';

REEL = {
  // TTS 목소리 (ElevenLabs JY - 밝은 브이로그 톤) + 귀엽게 가공: pitch 피치 배율, speed 말 속도 배율
  voice: { id: 'bQlkYuipD5BHEhntA5iz', pitch: 1.07, speed: 1.06 },
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3.6,
      eyebrow: '📦 1~4인 힐링 협동 게임',
      headline: '고양이가 되어서\n*우체국 알바* 함',
      bubble: '끝까지 봐!',
      sub: '고양이가 돼서 *우체국*을 운영한다고?' },

    { type: 'info', clip: C + 'info.mp4', dur: 3,
      headline: '냥냥 우체국\n*Cat Mail Co.*',
      chips: ['1~4인 협동', '힐링 경영'],
      price: { sale: '11,000원' },
      say: '이름은 냥냥 우체국, 가격은 만 천 원!' },

    { type: 'point', clip: C + 'xray.mp4', dur: 3.4,
      eyebrow: 'POINT 1 · 손맛',
      headline: '무게 재고 검사하고\n*척척 분류*',
      sub: '무게 재고, 엑스레이 검사하고\n*척척 분류*하는 손맛!' },

    { type: 'point', clip: C + 'stamp.mp4', dur: 3.2,
      eyebrow: 'POINT 2 · 꾸미기',
      headline: '우표·스티커 붙여\n*내 취향 소포*',
      sub: '우표랑 스티커로\n소포를 *내 맘대로* 꾸미고' },

    { type: 'point', clip: C + 'coop.mp4', dur: 3.2,
      eyebrow: 'POINT 3 · 협동',
      headline: '친구랑 하면\n*배송 라인 완성*…?',
      sub: '최대 *4명*이서 같이 일할 수 있어요',
      say: '최대 네 명이서 같이 일할 수 있어요!' },

    { type: 'point', clip: C + 'night.mp4', dur: 3.4,
      eyebrow: 'POINT 4 · 밤의 우체국',
      headline: '밤이 되면\n*마법 소포*가 도착',
      sub: '밤이 되면 신비한 *마법 소포*까지!',
      // 1.7초쯤 오른쪽 위에 뜨는 "The Captain has arrived" 알림창
      blur: [{ x: 1150, y: 30, w: 770, h: 230, from: 1.4, to: 2.6 }] },

    { type: 'point', clip: C + 'heal.mp4', dur: 3.2,
      eyebrow: 'POINT 5 · 힐링',
      headline: '시간 제한 X\n*실패 페널티 X*',
      sub: '시간 제한도 페널티도 없는\n*완전 힐링 게임*' },

    { type: 'outro', clip: C + 'outro.mp4', dur: 3.2,
      lead: '재밌어 보이면',
      headline: '같이 할 친구\n*태그*해줘!',
      say: '재밌어 보이면 같이 할 친구 태그해 줘!' },
  ],
};
