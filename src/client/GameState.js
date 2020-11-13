import { atom, selector } from 'recoil';

export const defaultGameState = {
  joined: false,
  question: null,
  questionNum: 1,
  questionTotal: 1,
  answer: null,
  guess: null,
  time: 30,
  score: 0,
  topScores: null,
  finalScore: null,
  theme: 4,
  name: null,
};

export const gameState = atom({
  key: 'gameState',
  default: { ...defaultGameState },
});

export const scoresShowingSelector = selector({
  key: 'scoresShowing',
  get: ({ get }) => {
    const { topScores, finalScore } = get(gameState);
    return (topScores || finalScore) ? 'Yes!' : 'No';
  }
});
