import React, { Component } from 'react';
import { Button, TextInput, Select } from 'evergreen-ui';
import axios from 'axios';
import './timer.css';

export default function Timer(props) {
  return (
    <div>
      Timer: {props.time}
    </div>
  );
}
