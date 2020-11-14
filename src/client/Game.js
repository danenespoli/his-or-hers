import React from 'react';
import { withRouter } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { gameState } from './GameState';
import GameScoresView from './GameScoresView';
import GameWaitView from './GameWaitView';
import GameView from './GameView';
import './game.css';

function Game(props) {
  const {
    joined,
    question,
    answer,
    topScores,
    finalScore,
  } = useRecoilValue(gameState);

  if (topScores && finalScore) {
    return <GameScoresView />;
  }

  // Failed to join.
  if (!joined) {
    // Go to game page.
    const { history } = props;
    history.push('/');
  }

  // Waiting to start game.
  if (question === null) {
    return <GameWaitView />;
  }

  // Main question/answer view.
  return <GameView />;
}

export default withRouter(Game);
