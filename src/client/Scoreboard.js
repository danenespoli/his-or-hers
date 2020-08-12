import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import './scoreboard.css';

export default function Scoreboard(props) {
  const { topScores } = props;

  return (
    <div className="scoreboard">
      <table>
        <ScoreHeader />
        {
          topScores.map((scoreData, index) => (
            <ScoreTile
              key={`scoretile-${scoreData.id}`}
              rank={index + 1}
              name={scoreData.name}
              score={scoreData.score}
            />
          ))
        }
      </table>
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

  return (
    <tr></tr>
  )
}
