import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import axios from 'axios';
import './timer.css';

const MAX_SIZE = 200;
const MIN_SIZE = 60;
// *** IF THIS VALUE CHANGES, MUST UPDATE GAMEMANAGER.JS ***
const MAX_TIME = 30;

export default function Timer(props) {
  const {
    time,
    theme,
    correct,
    wrong
  } = props;

  const size = (MAX_SIZE - MIN_SIZE) * (time / MAX_TIME) + MIN_SIZE;

  const dangerClass = time <= 5 ? 'timer-danger' : '';

  // If the answer has been revealed.
  let timerContents;
  if (correct || wrong) {
    timerContents = (
      <div
        className={`timer-circle theme-alt-${theme} timer-answer timer-answer-${correct ? 'correct' : 'incorrect'}`}
      >
        {correct && (
          <div className="timer-text timer-answer-text">
            Correct!
          </div>
        )}
        {!correct && (
          <div className="timer-text timer-answer-text">
            Incorrect
          </div>
        )}
      </div>
    );
  } else {
    timerContents = (
      <div
        className={`timer-circle theme-alt-${theme}`}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <div className={`timer-text ${dangerClass}`}>
          {time}
        </div>
      </div>
    );
  }

  return (
    <div className="timer">
      {timerContents}
    </div>
  );
}
