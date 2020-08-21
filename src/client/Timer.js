import React, { Component } from 'react';
import { useMediaQuery } from 'react-responsive';
import './timer.css';

// *** IF THIS VALUE CHANGES, MUST UPDATE GAMEMANAGER.JS ***
const MAX_TIME = 15;

export default function Timer(props) {
  const {
    time,
    theme,
    correct,
    wrong
  } = props;

  const isMobile = useMediaQuery({ query: 'only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)' });
  const MAX_SIZE = isMobile ? 100 : 200;
  const MIN_SIZE = isMobile ? 30 : 60;

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
