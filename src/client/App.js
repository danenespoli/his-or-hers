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

const io = require('socket.io-client');

let socket;
if (process.env.NODE_ENV === 'production') {
  console.log('PROD SOCKET.IO');
  socket = io();
} else {
  console.log('DEV SOCKET.IO');
  socket = io('localhost:8081');
}

const initialAppState = {
  joined: false,
  question: null,
  questionNum: 1,
  questionTotal: 1,
  answer: null,
  guess: null,
  time: 30,
  score: 0,
  topScores: null,
  finalScore: null,
  theme: 4,
};


export default class App extends Component {
  state = {
    ...initialAppState,
    name: null,
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

    socket.on('final-score', finalScore => {
      console.log('Game has ended!');
      this.setState({
        finalScore,
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
    console.log(`Setting name to ${name}!`);
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
      topScores,
      finalScore,
      theme,
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
              finalScore={finalScore}
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
