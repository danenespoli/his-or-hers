import React, { Component } from 'react';
import './home.css';
import { TextInput } from 'evergreen-ui';

export default class Home extends Component {
  state = { username: null };

  render() {
    return (
      <div>
        Enter your name below:
        <div>
          <TextInput
            name="text-input-name"
            placeholder="Text input placeholder..."
          />
        </div>
      </div>
    );
  }
}
