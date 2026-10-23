// 새 게시물 카드뉴스 — 이 폴더를 posts/<이름>/ 으로 복사하고 P를 바꿔서 씁니다.
// 고정 순서: cover → game → point(2~5장) → check → cta  (페이지 번호는 자동)
const P = 'posts/_new/';

CARDS = [
  { type: 'cover', bg: P + 'images/cover.jpg', video: P + 'clips/cover.mp4',   // video는 선택 (1080x1350 mp4)
    eyebrow: '📦 장르 한 줄',
    headline: '첫 줄 후킹\n*두 번째 줄 강조*',
    bubble: '넘겨봐!' },

  { type: 'game', bg: P + 'images/game.jpg',
    title: '게임 이름',
    chips: ['영문 이름', '인원', '장르'],            // 확인된 정보만
    price: { sale: '00,000원' },                     // 할인이면 { orig: '정가', sale: '할인가', off: '-30%' }
    desc: '게임 소개 두 줄\n두 번째 줄' },

  { type: 'point', bg: P + 'images/p1.jpg',
    eyebrow: 'POINT 1 · 키워드',
    headline: '포인트 제목\n*강조*',
    body: '설명 두 줄\n두 번째 줄' },

  { type: 'check',
    eyebrow: '📌 저장해두고 꺼내보기',
    headline: '이런 사람한테\n*딱* 맞아요',
    items: ['추천 대상 1', '추천 대상 2', '추천 대상 3', '추천 대상 4'],
    tip: '저장 유도 한 줄 👆' },

  { type: 'cta',
    lead: '○○ 좋아하는 친구에게',
    headline: '*이 게임* 보내줘!' },
];
