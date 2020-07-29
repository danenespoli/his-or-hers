import React, { Component } from 'react';
import './home.css';
import { TextInput, Button } from 'evergreen-ui';

export default class Home extends Component {
  state = {
    name: '',
    errorMsg: null,
  };

  submitName() {
    const { name } = this.state;
    const errorMsg = this.isValidName();
    this.setState({
      errorMsg,
    });

    if (errorMsg !== null) {
      this.setState({
        errorMsg: null,
      });
      // TODO: send message over websocket.
      console.log(`Sending name: ${name}`);
    }
  }

  isValidName() {
    const { name } = this.state;
    if (name === '' || /\s*/.test(name)) {
      return 'Name cannot be empty!';
    }
    if (!/^[a-zA-Z0-9\s]*$/.test(name)) {
      return 'Name must only consist of letters, numbers, and spaces!';
    }

    return null;
  }

  render() {
    const { errorMsg } = this.state;

    return (
      <div>
        Enter your name below:
        <div>
          <TextInput
            placeholder="Enter your name..."
            onChange={e => this.setState({ name: e.target.value })}
          />
          <Button onChange={() => this.submitName()}>Play!</Button>
        </div>
        <div className="home-error">
          {errorMsg}
        </div>
      </div>
    );
  }
}
