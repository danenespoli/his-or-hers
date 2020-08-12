import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import './scoreboard.css';

export default function Scoreboard(props) {
  const { topScores } = props;

  return (
    <div className="scoreboard">
      <table className="scoreboard-table" rules="none">
        <tbody>
          <ScoreHeader />
          {
            topScores.map((scoreData, index) => (
              <ScoreTile
                key={`scoretile-${scoreData.id}`}
                rank={index + 1}
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
  const { rank, name, score, greyed } = props;

  return (
    <tr className={`scoretile ${greyed ? 'scoretile-greyed' : ''}`}>
      <td>{rank}</td>
      <td>{name}</td>
      <td>{score}</td>
    </tr>
  )
}
