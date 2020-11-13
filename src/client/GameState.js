import { atom } from 'recoil';

export default atom({
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
});
