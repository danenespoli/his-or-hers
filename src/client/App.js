import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {
  RecoilRoot,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil';
import './app.css';

import Home from './Home';
import Dashboard from './Dashboard';
import Game from './Game';
import HomePlaceholder from './HomePlaceholder';
import { gameState, defaultGameState } from './GameState';

const io = require('socket.io-client');

let socket;
if (process.env.NODE_ENV === 'production') {
  console.log('PROD SOCKET.IO');
  socket = io();
} else {
  console.log('DEV SOCKET.IO');
  socket = io('localhost:8081');
}

/*
 * This variable controls whether the home page should display the name input
 * and Join button (if false), or a message to come check back later to play
 * the game (if true).
 */
const USE_HOME_PLACEHOLDER = false;


export default class App extends Component {
  constructor() {
    super();

    const [{ name }, setGameState] = useRecoilState(gameState);

    socket.on('join-success', () => {
      console.log('Joined game!');
      // this.setState({
      //   ...initialAppState,
      //   joined: true,
      // });
    });

    socket.on('question', (question, questionNum, questionTotal, theme) => {
      console.log(question);
      setGameState({
        question,
        questionNum,
        questionTotal,
        theme,
        answer: null,
        guess: null,
      });
    });

    socket.on('answer', (answer) => {
      setGameState({
        answer,
      });
    });

    socket.on('score', (score) => {
      setGameState({
        score,
      });
    });

    socket.on('timer', (time) => {
      setGameState({
        time,
      });
    });

    socket.on('top-scores', topScores => {
      console.log('Game has ended!');
      setGameState({
        topScores,
      });
    });

    socket.on('final-score', finalScore => {
      console.log('Game has ended!');
      setGameState({
        finalScore,
      });
    });

    socket.on('end-game', () => {
      console.log('Ending game!');
      // Reset to initial state.
      setGameState({
        ...defaultGameState,
        name,
      });
    });
  }

  joinGame(name) {
    socket.emit('join', name);
    console.log(`Setting name to ${name}!`);
    const setGameState = useSetRecoilState(gameState);

    setGameState({
      name,
      joined: true,
    });
  }

  makeGuess(guess, name) {
    const [{ answer }, setGameState] = useRecoilState(gameState);
    // Don't allow guessing on the client side if the answer has already been revealed.
    if (answer !== null) return;

    socket.emit('guess', guess, name);
    setGameState({
      guess,
    });
  }

  render() {
    const homeComponent = USE_HOME_PLACEHOLDER ? (
      <HomePlaceholder />
    ) : (
      <Home
        joinGame={(n) => this.joinGame(n)}
      />
    );

    return (
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/game">
            <RecoilRoot>
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
            </RecoilRoot>
          </Route>
          <Route path="/">
            {homeComponent}
          </Route>
        </Switch>
      </Router>
    );
  }
}
