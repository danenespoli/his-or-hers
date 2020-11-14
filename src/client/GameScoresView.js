import React from 'react';
import { useRecoilValue } from 'recoil';
import { gameState } from './GameState';
import Scoreboard from './Scoreboard';

export default function ScoresView() {
  const {
    topScores,
    finalScore,
    theme
  } = useRecoilValue(gameState);

  return (
    <div className={`game-background theme-bg-${theme}`}>
      <div className="game-block game-scorefaces">
        {/* <img className="game-face-hers-sm" src={require('./img/her-faces-lowtrace.png')} /> */}
        <img className="game-face-tego-sm" src={require('./img/tego-faces-lowtrace.png')} />
        <div className={`game-thanks-text theme-font-${theme} game-question-text-${theme}`}>
          Thanks for playing!
        </div>
        <img className="game-face-tego-sm" src={require('./img/tego-faces-lowtrace.png')} />
        {/* <img className="game-face-his-sm" src={require('./img/his-faces-lowtrace.png')} /> */}
      </div>
      <div className="game-block game-scoreboard-text">
        Top Scores
      </div>
      <div className="game-block game-scoreboard">
        <Scoreboard
          scores={topScores}
        />
      </div>
      <div className="game-block game-scoreboard-text game-scoreboard-text-small">
        Your Score
      </div>
      <div className="game-block game-scoreboard">
        <Scoreboard
          scores={[finalScore]}
        />
      </div>
    </div>
  );
}
