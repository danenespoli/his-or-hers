import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './app.css';

import Home from './Home';
import Dashboard from './Dashboard';
import Game from './Game';

const socket = require('socket.io-client')(process.env.WEBSOCKET_URL || 'localhost:8080');


export default class App extends Component {
  state = {
    joined: false,
    question: null,
    answer: null,
    time: 30,
    scores: null,
  };

  constructor() {
    super();

    socket.on('join-success', () => {
      console.log('Joined game!');
      this.setState({
        joined: true,
      });
    });

    socket.on('question', (question) => {
      console.log(question);
      this.setState({
        question,
        answer: null,
      });
    });

    socket.on('answer', (answer) => {
      console.log(answer);
      this.setState({
        answer,
      });
    });

    socket.on('timer', (time) => {
      console.log(time);
      this.setState({
        time,
      });
    });

    socket.on('show-scores', scores => {
      console.log('Game has ended!');
      this.setState({
        scores,
      });
    });

    socket.on('end-game', () => {
      console.log('Ending game!');
      // Reset to initial state.
      this.setState({
        question: null,
        answer: null,
        time: 30,
        scores: null,
      });
    });
  }

  joinGame(name) {
    socket.emit('join', name);
  }

  makeGuess(guess) {
    socket.emit('guess', guess);
  }

  render() {
    const {
      joined,
      question,
      answer,
      time,
      ended,
      scores,
    } = this.state;

    return (
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Dashboard
              question={question}
              answer={answer}
              time={time}
            />
          </Route>
          <Route path="/game">
            <Game
              joined={joined}
              question={question}
              answer={answer}
              time={time}
              ended={ended}
              scores={scores}
              makeGuess={(guess) => this.makeGuess(guess)}
            />
          </Route>
          <Route path="/">
            <Home
              joinGame={(name) => this.joinGame(name)}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}
