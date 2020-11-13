import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import './app.css';

import Home from './Home';
import Dashboard from './Dashboard';
import Game from './Game';
import HomePlaceholder from './HomePlaceholder';

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

    socket.on('join-success', () => {
      console.log('Joined game!');
      // this.setState({
      //   ...initialAppState,
      //   joined: true,
      // });
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
      joined: true,
    });
  }

  makeGuess(guess, name) {
    const { answer } = this.state;
    // Don't allow guessing on the client side if the answer has already been revealed.
    if (answer !== null) return;

    socket.emit('guess', guess, name);
    this.setState({
      guess,
    });
  }

  render() {
    const joined = useRecoilValue(joined);
    const name = useRecoilValue(name);
    const question = useRecoilValue(question);
    const questionNum = useRecoilValue(questionNum);
    const questionTotal = useRecoilValue(questionTotal);
    const answer = useRecoilValue(answer);
    const guess = useRecoilValue(guess);
    const time = useRecoilValue(time);
    const ended = useRecoilValue(ended);
    const score = useRecoilValue(score);
    const topScores = useRecoilValue(topScores);
    const finalScore = useRecoilValue(finalScore);
    const theme = useRecoilValue(theme);

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
            <Dashboard
              question={question}
              answer={answer}
              time={time}
              rawState={{
                question,
                questionNum,
                questionTotal,
                answer,
                time,
                scoresShowing: (topScores || finalScore) ? 'Yes!' : 'No',
              }}
            />
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
