import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';
import axios from 'axios';

export default class Dashboard extends Component {
  state = {
    editQuestionMode: false,
    questionData: null,
  }

  startGame() {
    axios.post('/api/startGame');
  }

  nextQuestion() {
    axios.post('/api/nextQuestion');
  }

  endGame() {
    axios.post('/api/endGame');
  }

  editQuestions(index, newQuestion, newAnswer) {
    axios.post('/api/questionData', [
      {
        question: 'Who did blah blah first?',
        answer: 'hers',
      },
    ]);
  }

  fetchQuestionData() {
    axios.get('/api/questionData')
  }

  renderDefaultControls() {
    return (
      <div>
        <Button onClick={() => this.startGame()}>
          Start Game!
        </Button>
        <Button onClick={() => this.setState({ editQuestionMode: true })}>
          Edit Questions
        </Button>
      </div>
    );
  }

  renderEditQuestionMode() {
    return (
      <div>
        <Button onClick={() => this.setState({ editQuestionMode: false })}>
          Back
        </Button>
        {}
      </div>
    );
  }

  renderDuringGame() {
    return (
      <div>
        <Button onClick={() => this.endGame()}>
          End Game
        </Button>
        <Button onClick={() => this.nextQuestion()}>
          Next Question
        </Button>
      </div>
    );
  }

  render() {
    const { question } = this.props;

    // If the game has started, show End Game options.
    if (question !== null) {
      return this.renderDuringGame();
    }

    const { editQuestionMode } = this.state;

    // Before the game starts.
    if (editQuestionMode) {
      return this.renderEditQuestionMode();
    }

    return this.renderDefaultControls();
  }
}
