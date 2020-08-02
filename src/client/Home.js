import React, { Component } from 'react';
import './home.css';
import { TextInput, Button } from 'evergreen-ui';
import { withRouter } from 'react-router-dom';

class Home extends Component {
  state = {
    name: '',
    errorMsg: null,
    backgroundNum: 0,
  };

  constructor() {
    super();
    // Background changes every 5 seconds.
    setInterval(() => {
      this.changeBackground();
    }, 5000);
  }

  changeBackground() {
    console.log('Changing');
    const { backgroundNum } = this.state;
    this.setState({
      backgroundNum: (backgroundNum + 1) % 5,
    });
  }

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
    const { name, errorMsg, backgroundNum } = this.state;

    return (
      <div className={`home-background home-background-${backgroundNum}`}>
        <div className={`home-text home-text-${backgroundNum}`}>
          Steph or Dustin
        </div>
        <div className="home-controls">
          <div className="home-controls-name">
            <input
              className="home-controls-name-input"
              type="text"
              value={name}
              placeholder="Enter your name..."
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>
          <div
            className={`home-controls-join home-controls-join-${backgroundNum}`}
            onClick={() => this.submitName()}
          >
            <div className="home-controls-join-text">
              Join
            </div>
          </div>
        </div>
        <div className="home-error">
          {errorMsg}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
