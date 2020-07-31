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
    console.log('Fetching question data...');
    axios.get('/api/questionData').then(({ data: questionData }) => {
      this.setState({
        questionData,
      });
    });
  }

  enterEditQuestionMode() {
    this.setState({
      editQuestionMode: true,
    });
    this.fetchQuestionData();
  }

  renderDefaultControls() {
    return (
      <div>
        <Button onClick={() => this.startGame()}>
          Start Game!
        </Button>
        <Button onClick={() => this.enterEditQuestionMode()}>
          Edit Questions
        </Button>
      </div>
    );
  }

  renderEditQuestionMode() {
    const { questionData } = this.state;

    let questionRows;
    if (!questionData) {
      questionRows = (
        <div>
          Loading questions...
        </div>
      );
    } else {
      questionRows = questionData.map(q => (
        <div>
          {q.question} {q.answer}
        </div>
      ));
    }

    return (
      <div>
        <Button onClick={() => this.setState({ editQuestionMode: false })}>
          Back
        </Button>
        {questionRows}
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
