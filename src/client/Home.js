import React, { Component } from 'react';
import './home.css';
import { TextInput, Button } from 'evergreen-ui';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  state = {
    name: '',
    errorMsg: null,
  };

  submitName() {
    const { name } = this.state;
    const { joinGame } = this.props;

    // Handle name validation errors.
    const errorMsg = this.validateName();
    this.setState({
      errorMsg,
    });
    if (errorMsg !== null) return;

    // Join game.
    this.setState({
      errorMsg: null,
    });

    console.log(`Joining with name: ${name}`);
    joinGame(name);

    // Go to game page.
    const { history } = this.props;
    history.push('/game');
  }

  validateName() {
    const { name } = this.state;
    if (name === '' || /^\s*$/.test(name)) {
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
          <Button onClick={() => this.submitName()}>
            Play!
          </Button>
        </div>
        <div className="home-error">
          {errorMsg}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
