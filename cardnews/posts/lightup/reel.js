// Light Up The Town 릴스 — 목소리·속도는 voice.json 고정값
const C = 'posts/lightup/reel/clips/';

REEL = {
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3,
      eyebrow: '🎄 크리스마스 꾸미기 게임',
      headline: '크리스마스 분위기\n*제대로*인 게임',
      bubble: '끝까지 봐!',
      sub: '크리스마스 분위기 *제대로*인\n게임이 있어요' },

    { type: 'info', clip: C + 'info.mp4', dur: 3,
      headline: 'Light Up\n*The Town*',
      chips: ['체험판 무료', '한국어 미지원'],
      price: { sale: '16,500원' },
      say: '게임 이름은 라이트업타운! 가격은 만 육천오백 원, 체험판은 무료예요!' },

    { type: 'point', clip: C + 'throw.mp4', dur: 3,
      eyebrow: 'POINT 1 · 휙휙',
      headline: '아무 데나 클릭하면\n*전구가 휙*',
      sub: '아무 데나 클릭하면\n*전구가 휙* 날아가요' },

    { type: 'point', clip: C + 'deco.mp4', dur: 3,
      eyebrow: 'POINT 2 · 꾸미기',
      headline: '선물·장식도\n*내 맘대로*',
      sub: '선물이랑 장식도\n*내 맘대로* 꾸미고' },

    { type: 'point', clip: C + 'story.mp4', dur: 3,
      eyebrow: 'POINT 3 · 스토리',
      headline: '다친 아빠 대신\n*마을을 밝혀라*',
      sub: '다친 아빠 대신\n축제 전까지 *마을을 밝혀야* 해요' },

    { type: 'point', clip: C + 'view.mp4', dur: 3,
      eyebrow: 'POINT 4 · 힐링',
      headline: '다 꾸미고 나면\n*이 풍경*',
      sub: '다 꾸미고 나면\n*이런 풍경*이 펼쳐져요' },

    { type: 'outro', clip: C + 'outro.mp4', dur: 3,
      lead: '재밌어 보이면',
      headline: '같이 할 친구\n*태그*해줘!',
      say: '재밌어 보이면 같이 할 친구 태그해 줘!' },
  ],
};
