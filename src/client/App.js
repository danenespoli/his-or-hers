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
} from 'recoil';
import './app.css';

import Home from './Home';
import Dashboard from './Dashboard';
import Game from './Game';
import HomePlaceholder from './HomePlaceholder';
import { gameState, defaultGameState } from './GameState';
import gameSocket from './gameSocket';

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

    gameSocket.on('join-success', () => {
      console.log('Joined game!');
      // this.setState({
      //   ...initialAppState,
      //   joined: true,
      // });
    });

    gameSocket.on('question', (question, questionNum, questionTotal, theme) => {
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

    gameSocket.on('answer', (answer) => {
      setGameState({
        answer,
      });
    });

    gameSocket.on('score', (score) => {
      setGameState({
        score,
      });
    });

    gameSocket.on('timer', (time) => {
      setGameState({
        time,
      });
    });

    gameSocket.on('top-scores', topScores => {
      console.log('Game has ended!');
      setGameState({
        topScores,
      });
    });

    gameSocket.on('final-score', finalScore => {
      console.log('Game has ended!');
      setGameState({
        finalScore,
      });
    });

    gameSocket.on('end-game', () => {
      console.log('Ending game!');
      // Reset to initial state.
      setGameState({
        ...defaultGameState,
        name,
      });
    });
  }

  joinGame(name) {
    gameSocket.emit('join', name);
    console.log(`Setting name to ${name}!`);
    const setGameState = useSetRecoilState(gameState);

    setGameState({
      name,
      joined: true,
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
              <Game />
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
