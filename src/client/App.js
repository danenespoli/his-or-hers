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

const socket = require('socket.io-client')();

const initialAppState = {
  joined: false,
  name: null,
  question: null,
  questionNum: 1,
  questionTotal: 1,
  answer: null,
  guess: null,
  time: 30,
  score: 0,
  theme: 4,
  topScores: null,
};


export default class App extends Component {
  state = {
    ...initialAppState,
  };

  constructor() {
    super();

    socket.on('join-success', () => {
      console.log('Joined game!');
      this.setState({
        ...initialAppState,
        joined: true,
      });
    });

    socket.on('question', (question, questionNum, questionTotal, theme) => {
      console.log(question);
      this.setState({
        question,
        questionNum,
        questionTotal,
        theme,
        answer: null,
        guess: null,
      });
    });

    socket.on('answer', (answer) => {
      this.setState({
        answer,
      });
    });

    socket.on('score', (score) => {
      this.setState({
        score,
      });
    });

    socket.on('timer', (time) => {
      this.setState({
        time,
      });
    });

    socket.on('top-scores', topScores => {
      console.log('Game has ended!');
      this.setState({
        topScores,
      });
    });

    socket.on('end-game', () => {
      console.log('Ending game!');
      // Reset to initial state.
      this.setState({
        ...initialAppState,
      });
    });
  }

  joinGame(name) {
    socket.emit('join', name);
    this.setState({
      name,
    });
  }

  makeGuess(guess, name) {
    socket.emit('guess', guess, name);
    this.setState({
      guess,
    });
  }

  render() {
    const {
      joined,
      name,
      question,
      questionNum,
      questionTotal,
      answer,
      guess,
      time,
      ended,
      score,
      theme,
      topScores,
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
              name={name}
              question={question}
              answer={answer}
              guess={guess}
              time={time}
              ended={ended}
              score={score}
              theme={theme}
              questionNum={questionNum}
              questionTotal={questionTotal}
              topScores={topScores}
              makeGuess={(g, n) => this.makeGuess(g, n)}
            />
          </Route>
          <Route path="/">
            <Home
              joinGame={(n) => this.joinGame(n)}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}
