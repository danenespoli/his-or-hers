import React from 'react';
import { Spinner } from 'evergreen-ui';
import { useRecoilValue } from 'recoil';
import { gameState } from './GameState';

export default function GameWaitView() {
  const { theme } = useRecoilValue(gameState);

  return (
    <div className={`game-background theme-bg-${theme}`}>
      <div className="game-msg-text">
        You're in!
      </div>
      <div className="game-msg-small-text game-msg-text-small">
        The game will be starting shortly...
      </div>
      <Spinner size={24} />
    </div>
  );
}
