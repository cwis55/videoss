// 냥냥 우체국 (Cat Mail Co.)
const P = 'posts/catmail/';

CARDS = [
  { type: 'cover', bg: P + 'images/s1.jpg', video: P + 'clips/cover.mp4',
    eyebrow: '📦 1~4인 힐링 협동 게임',
    headline: '고양이 되어서\n*우체국 알바* 함',
    bubble: '넘겨봐!' },

  { type: 'game', bg: P + 'images/s5.jpg',
    title: '냥냥 우체국',
    chips: ['Cat Mail Co.', '1~4인 협동', '힐링 경영'],
    price: { sale: '11,000원' },
    desc: '고양이가 되어 소포를 포장하고 분류하고\n배송하는 아늑한 우체국 운영 게임' },

  { type: 'point', bg: P + 'images/xray_poster.jpg', video: P + 'clips/xray.mp4',
    eyebrow: 'POINT 1 · 손맛',
    headline: '무게 재고 검사하고\n*척척 분류*',
    body: '소포를 하나하나 직접 들고 옮기며\n정리하는 손맛이 핵심이에요.' },

  { type: 'point', bg: P + 'images/stamp.jpg',
    eyebrow: 'POINT 2 · 꾸미기',
    headline: '우표·스티커 붙여\n*내 취향 소포* 완성',
    body: '특수 우표와 귀여운 스티커를 해금해서\n소포마다 내 감성을 담아요.' },

  { type: 'point', bg: P + 'images/s3.jpg',
    eyebrow: 'POINT 3 · 협동',
    headline: '친구랑 하면\n*배송 라인* 완성…?',
    body: '손발 척척 효율 플레이도 OK,\n소포 산더미 쌓고 장난치기도 OK.' },

  { type: 'point', bg: P + 'images/s4.jpg',
    eyebrow: 'POINT 4 · 밤의 우체국',
    headline: '밤이 되면\n*마법 소포*가 도착',
    body: '낮과 밤이 바뀌고, 우체국에 숨겨진\n따뜻한 비밀이 하나씩 밝혀져요.' },

  { type: 'point', bg: P + 'images/s2.jpg',
    eyebrow: 'POINT 5 · 힐링',
    headline: '시간 제한 0\n*실패 페널티 0*',
    body: '성과 압박 없이, 내 속도대로\n천천히 정리하면 돼요.' },

  { type: 'check',
    eyebrow: '📌 저장해두고 꺼내보기',
    headline: '이런 사람한테\n*딱* 맞아요',
    items: ['정리·분류하면 마음이 편해지는 사람', '고양이만 보면 못 참는 사람', '친구랑 디코 켜고 할 힐링 게임 찾는 중', '시간 제한 있는 게임은 스트레스인 사람'],
    tip: '주말 친구 모임 전에 저장 꾹 👆' },

  { type: 'cta',
    lead: '고양이 좋아하는 친구에게',
    headline: '*같이 알바 하자*고\n보내줘!' },
];
