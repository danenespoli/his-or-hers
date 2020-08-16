import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextInput, Button } from 'evergreen-ui';
import './home.css';

class Home extends Component {
  state = {
    name: '',
    errorMsg: null,
    backgroundNum: 0,
    interval: null,
  };

  componentWillMount() {
    // Background changes every 5 seconds.
    const interval = setInterval(() => {
      this.changeBackground();
    }, 3000);
    this.setState({
      interval,
    });
  }

  componentDidMount() {
    this.textInput.focus();
  }

  componentWillUnmount() {
    const { interval } = this.state;

    if (interval) {
      clearInterval(interval);
      this.setState({
        interval: null,
      });
    }
  }

  changeBackground() {
    const { backgroundNum } = this.state;
    this.setState({
      backgroundNum: (backgroundNum + 1) % 6,
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
        <div className="home-images">
          <img className="home-image-hers" src={require('./img/her-faces-02-pix.png')} />
          {/* <img className="home-image-his" src={require('./img/tego-faces-01-pix.png')} /> */}
          <img className="home-image-his" src={require('./img/his-faces-05-pix.png')} />
        </div>
        <div className="home-text-container">
          <div className={`home-text home-text-${backgroundNum}`}>Steph or Dustin</div>
        </div>
        <div className="home-controls">
          <div className="home-controls-name">
            <input
              ref={elem => { this.textInput = elem; }}
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
