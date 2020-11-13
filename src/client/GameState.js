import { atom } from 'recoil';

const joinedState = atom({
  key: 'joined',
  default: false,
});

const questionState = atom({
  key: 'question',
  default: null,
});

const questionNumState = atom({
  key: 'questionNum',
  default: 1,
});

const questionTotalState = atom({
  key: 'questionTotal',
  default: 1,
});

const answerState = atom({
  key: 'answer',
  default: null,
});

const guessState = atom({
  key: 'guess',
  default: null,
});

const timeState = atom({
  key: 'time',
  default: 30,
});

const scoreState = atom({
  key: 'score',
  default: 0,
});

const topScoresState = atom({
  key: 'topScores',
  default: null,
});

const finalScoreState = atom({
  key: 'finalScore',
  default: null,
});

const themeState = atom({
  key: 'theme',
  default: 4,
});

const nameState = atom({
  key: 'name',
  default: null,
});

export {
  joinedState,
  questionState,
  questionNumState,
  questionTotalState,
  answerState,
  guessState,
  timeState,
  scoreState,
  topScoresState,
  finalScoreState,
  themeState,
  nameState,
};
