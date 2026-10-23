// Light Up The Town (한국어 미지원)
const P = 'posts/lightup/';

CARDS = [
  { type: 'cover', bg: P + 'images/cover_poster.jpg', video: P + 'clips/cover.mp4',
    eyebrow: '🎄 크리스마스 꾸미기 게임',
    headline: '크리스마스 분위기\n*제대로*인 게임',
    bubble: '넘겨봐!' },

  { type: 'game', bg: P + 'images/s11.jpg',
    title: 'Light Up The Town',
    chips: ['체험판 무료', '18개+ 맵', '한국어 미지원'],
    price: { sale: '16,500원' },
    desc: '어린 페럿 \'빈\'이 되어 눈 내리는 마을에\n전구와 장식을 달아주는 아늑한 꾸미기 게임' },

  { type: 'point', bg: P + 'images/throw_poster.jpg', video: P + 'clips/throw.mp4',
    eyebrow: 'POINT 1 · 휙휙',
    headline: '아무 데나 클릭하면\n*전구가 휙*',
    body: '클릭한 곳으로 전구 줄이 날아가 걸려요.\n던지는 맛이 은근 중독적!' },

  { type: 'point', bg: P + 'images/s8.jpg',
    eyebrow: 'POINT 2 · 꾸미기',
    headline: '크기도 방향도\n*내 맘대로*',
    body: '전구, 지팡이 사탕, 선물 상자까지.\n상상하는 대로 마을을 꾸며요.' },

  { type: 'point', bg: P + 'images/s7.jpg',
    eyebrow: 'POINT 3 · 스토리',
    headline: '다친 아빠 대신\n*마을을 밝혀라*',
    body: '전기 기사 아빠가 다쳐서, 겨울 축제 전까지\n빈이 마을에 불을 켜야 해요.' },

  { type: 'point', bg: P + 'images/s10.jpg',
    eyebrow: 'POINT 4 · 수집',
    headline: '코인 모아서\n*장식 해금*',
    body: '마을 곳곳의 코인을 모으면\n더 많은 전구와 장식이 열려요.' },

  { type: 'point', bg: P + 'images/s9.jpg',
    eyebrow: 'POINT 5 · 힐링',
    headline: '다 꾸미고 나면\n*이 풍경*',
    body: '눈 내리는 마을이 하나씩 반짝반짝.\n보기만 해도 힐링돼요.' },

  { type: 'check',
    eyebrow: '📌 저장해두고 꺼내보기',
    headline: '이런 사람한테\n*딱* 맞아요',
    items: ['크리스마스 감성에 진심인 사람', '꾸미기·인테리어 게임 좋아하는 사람', '머리 비우고 힐링하고 싶은 사람', '영어 몰라도 클릭만 하면 되는 게임 찾는 중'],
    tip: '연말 전에 체험판부터 해보기 👆' },

  { type: 'cta',
    lead: '크리스마스 좋아하는 친구에게',
    headline: '*이 게임* 보내줘!' },
];
