import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import axios from 'axios';
import './timer.css';

const MAX_SIZE = 200;
const MIN_SIZE = 60;
// *** IF THIS VALUE CHANGES, MUST UPDATE GAMEMANAGER.JS ***
const MAX_TIME = 30;

export default function Timer(props) {
  const { time } = props;
  const size = (MAX_SIZE - MIN_SIZE) * (time / MAX_TIME) + MIN_SIZE;

  const dangerClass = time <= 5 ? 'timer-danger' : '';

  return (
    <div className="timer">
      <div
        className="timer-circle"
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <div className={`timer-text ${dangerClass}`}>
          {time}
        </div>
      </div>
    </div>
  );
}
