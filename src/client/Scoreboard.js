import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';

export default function Scoreboard(props) {
  const { topScores } = props;

  return (
    <div className="scoreboard">
      <ScoreHeader />
      {
        topScores.map((scoreData, index) => (
          <ScoreTile
            rank={index + 1}
            name={scoreData.name}
            score={scoreData.score}
          />
        ))
      }
    </div>
  );
}

function ScoreHeader() {
  return (
    <div>
      Hello
    </div>
  );
}

function ScoreTile(props) {
  const { rank, name, score } = props;
}
