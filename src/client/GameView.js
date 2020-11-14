import React, { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Timer from './Timer';
import { gameState } from './GameState';
import './game.css';
import gameSocket from './gameSocket';

function getGuessButtonClasses(guess, answer) {
  const hisButtonClasses = [];
  const hersButtonClasses = [];

  if (answer === 'his') {
    hisButtonClasses.push('game-guess-button-correct');
    hersButtonClasses.push('game-guess-button-incorrect');
  } else if (answer === 'hers') {
    hisButtonClasses.push('game-guess-button-incorrect');
    hersButtonClasses.push('game-guess-button-correct');
  }

  if (guess === 'his') {
    hisButtonClasses.push('game-guess-button-active');
  } else if (guess === 'hers') {
    hersButtonClasses.push('game-guess-button-active');
  }

  return [hisButtonClasses.join(' '), hersButtonClasses.join(' ')];
}

export default function GameView() {
  const [{
    question,
    answer,
    time,
    guess,
    score,
    questionNum,
    questionTotal,
    theme,
    name,
  }, setGameState] = useRecoilState(gameState);

  const makeGuess = useCallback(newGuess => {
    if (answer !== null) return;
    gameSocket.emit('newGuess', newGuess, name);
    setGameState({
      newGuess,
    });
  }, [name, setGameState]);

  const [hisButtonClasses, hersButtonClasses] = getGuessButtonClasses(guess, answer);
  return (
    <div className={`game-background theme-bg-${theme}`}>
      <div className="game-block game-guess-buttons">
        <div className={`game-button game-guess-button theme-alt-${theme} ${hersButtonClasses}`} onClick={() => makeGuess('hers')}>
          <img className="game-face game-face-hers" src={require('./img/her-faces-lowtrace.png')} />
        </div>
        <div className={`game-button game-button-center game-guess-button theme-alt-${theme} ${hisButtonClasses}`} onClick={() => makeGuess('his')}>
          <img className="game-face game-face-his" src={require('./img/his-faces-lowtrace.png')} />
        </div>
      </div>
      <div className={`game-question-text theme-font-${theme} game-question-text-${theme}`}>
        {question}
      </div>
      <div className="game-block game-hud">
        <div className="game-msg-text game-score">
          Score: {score}
        </div>
        <div className="game-block game-timer">
          <Timer
            time={time}
            correct={answer !== null && guess === answer}
            wrong={answer !== null && guess !== answer}
            theme={theme}
          />
        </div>
        <div className="game-msg-text game-qnumber">
          <span>{questionNum}</span>
          <span className="game-qdenominator"> / {questionTotal}</span>
        </div>
      </div>
    </div>
  );
}
