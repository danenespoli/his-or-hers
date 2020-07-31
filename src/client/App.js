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
    question: null,
    answer: null,
    time: 30,
    joined: false,
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
      });
    });

    socket.on('timer', (time) => {
      console.log(time);
      this.setState({
        time,
      });
    });
  }

  joinGame(name) {
    socket.emit('join', name);
  }

  render() {
    const {
      question,
      answer,
      time,
      joined,
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
              question={question}
              answer={answer}
              time={time}
              joined={joined}
            />
          </Route>
          <Route path="/">
            <Home
              question={question}
              answer={answer}
              time={time}
              joinGame={(name) => this.joinGame(name)}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}
