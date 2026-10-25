// 동물 마을 레스토랑 이야기 릴스 — v2 레이아웃(세로 전체 화면, 글자 최소)
// fx: 가로 영상에서 세로로 자를 위치 (0 왼쪽 ~ 0.5 가운데 ~ 1 오른쪽)
const C = 'posts/animalresto/reel/clips/';

REEL = {
  layout: 'full',
  endHold: 1.0,
  // 트레일러 아래에 박힌 한국어·영어 자막 (모든 장면)
  blur: [{ x: 280, y: 820, w: 1360, h: 220 }],
  scenes: [
    { type: 'hook', clip: C + 'hook.mp4', dur: 3,
      headline: '동물의 숲 + 오버쿡\n*합친 게임* 나옴',
      bubble: '내일 출시!',
      say: '동물의 숲이랑 오버쿡을 합친 게임이 내일 나와요!' },

    { type: 'info', clip: C + 'info.mp4', dur: 3,
      headline: '동물 마을\n*레스토랑 이야기*',
      chips: ['10/26 출시', '한국어 지원', '1~4인 협동'],
      say: '이름은 동물 마을 레스토랑 이야기! 한국어도 지원해요!' },

    { type: 'point', clip: C + 'cook.mp4', dur: 3,
      eyebrow: '🍳 요리',
      sub: '손님 오면 *요리해서 서빙*하고' },

    { type: 'point', clip: C + 'coop.mp4', dur: 3,
      eyebrow: '👫 협동',
      sub: '친구 셋이랑 같이하면 *대환장 파티*' },

    { type: 'point', clip: C + 'life.mp4', dur: 3,
      eyebrow: '🎣 마을 생활',
      sub: '일 끝나면 *농사짓고 낚시*까지' },

    { type: 'point', clip: C + 'season.mp4', dur: 3,
      eyebrow: '🍂 사계절',
      sub: '계절 따라 바뀌는 *아늑한 마을*' },

    { type: 'outro', clip: C + 'outro.mp4', fx: 0.45, dur: 3,
      lead: '재밌어 보이면',
      headline: '같이 할 친구\n*태그*해줘!',
      say: '재밌어 보이면 같이 할 친구 태그해 줘!' },
  ],
};
