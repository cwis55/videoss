// 냥냥 우체국 릴스
// clip: 가로 영상 / image: 가로 스크린샷 / 둘 다 없으면 배경 없음(outro)
// dur: 음성이 없을 때의 장면 길이(초). sub: 자막이자 TTS 대본, say: 자막 없이 읽기만 할 대본
const C = 'posts/catmail/reel/clips/', I = 'posts/catmail/images/';

REEL = {
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3.6,
      eyebrow: '📦 1~4인 힐링 협동 게임',
      headline: '고양이가 되어서\n*우체국 알바* 함',
      bubble: '끝까지 봐!',
      sub: '고양이가 돼서 *우체국*을 운영한다고?' },

    { type: 'info', image: I + 's5.jpg', dur: 3,
      headline: '냥냥 우체국\n*Cat Mail Co.*',
      chips: ['1~4인 협동', '힐링 경영'],
      price: { sale: '11,000원' },
      say: '이름은 냥냥 우체국, 가격은 만 천 원!' },

    { type: 'point', clip: C + 'xray.mp4', dur: 3.4,
      eyebrow: 'POINT 1 · 손맛',
      headline: '무게 재고 검사하고\n*척척 분류*',
      sub: '무게 재고, 엑스레이 검사하고\n*척척 분류*하는 손맛!' },

    { type: 'point', clip: C + 'stamp.mp4', clipStart: 3, dur: 3.2,
      eyebrow: 'POINT 2 · 꾸미기',
      headline: '우표·스티커 붙여\n*내 취향 소포*',
      sub: '우표랑 스티커로\n소포를 *내 맘대로* 꾸미고' },

    { type: 'point', image: I + 's3.jpg', dur: 3,
      eyebrow: 'POINT 3 · 협동',
      headline: '친구랑 하면\n*배송 라인 완성*…?',
      sub: '최대 *4명*이서 같이 일할 수 있어요' },

    { type: 'point', image: I + 's4.jpg', dur: 3,
      eyebrow: 'POINT 4 · 밤의 우체국',
      headline: '밤이 되면\n*마법 소포*가 도착',
      sub: '밤이 되면 신비한 *마법 소포*까지!' },

    { type: 'point', image: I + 's2.jpg', dur: 3.2,
      eyebrow: 'POINT 5 · 힐링',
      headline: '시간 제한 X\n*실패 페널티 X*',
      sub: '시간 제한도 페널티도 없는\n*완전 힐링 게임*' },

    { type: 'outro', dur: 3.5,
      lead: '고양이 좋아하는 친구',
      headline: '*태그*해서\n같이 알바 하자!',
      promo: '📌 자세한 정보는 카드뉴스에서',
      say: '고양이 좋아하는 친구 태그해서 같이 알바하자!' },
  ],
};
