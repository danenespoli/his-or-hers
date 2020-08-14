import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import './scoreboard.css';

export default function Scoreboard(props) {
  const { scores } = props;

  return (
    <div className="scoreboard">
      <table className="scoreboard-table" rules="none">
        <tbody>
          <ScoreHeader />
          {
            scores.map((scoreData, index) => (
              <ScoreTile
                key={`scoretile-${scoreData.id}`}
                rank={scoreData.rank}
                name={scoreData.name}
                score={scoreData.score}
                greyed={index % 2 !== 0}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

function ScoreHeader() {
  return (
    <tr className="scoreheader">
      <th>RANK</th>
      <th>NAME</th>
      <th>SCORE</th>
    </tr>
  );
}

function ScoreTile(props) {
  const {
    rank,
    name,
    score,
    greyed,
  } = props;

  const classes = [];
  if (greyed) {
    classes.push('scoretile-greyed');
  }

  return (
    <tr className={`scoretile ${classes.join(' ')}`}>
      <td>{rank}</td>
      <td>{name}</td>
      <td>{score}</td>
    </tr>
  );
}
