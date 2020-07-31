import React, { Component } from 'react';
import './dashboard.css';
import { Button, TextInput, Select } from 'evergreen-ui';
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

  editQuestion(index, question, answer) {
    const { questionData } = this.state;
    questionData[index] = {
      question,
      answer,
    };

    this.setState({
      questionData,
    });
  }

  removeQuestion(index) {
    const { questionData } = this.state;
    questionData.splice(index, 1);

    this.setState({
      questionData,
    });
  }

  addQuestion() {
    const { questionData } = this.state;
    questionData.push({
      question: '',
      answer: 'his',
    });

    this.setState({
      questionData,
    });
  }

  saveQuestions() {
    const { questionData } = this.state;
    axios.post('/api/questionData', questionData);
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
      questionRows = questionData.map((q, index) => (
        <div>
          <TextInput
            value={q.question}
            onChange={e => this.editQuestion(index, e.target.value, q.answer)}
          />
          <Select
            value={q.answer}
            onChange={e => this.editQuestion(index, q.question, e.target.value)}
          >
            <option value="his">Dustin</option>
            <option value="hers">Steph</option>
          </Select>
          <Button onClick={() => this.removeQuestion(index)}>
            Remove
          </Button>
        </div>
      ));
    }

    return (
      <div>
        <Button onClick={() => this.setState({ editQuestionMode: false })}>
          Back
        </Button>
        <div>
          {questionRows}
        </div>
        <div>
        <Button onClick={() => this.addQuestion()}>
            Add question
          </Button>
        </div>
        <div>
          <Button onClick={() => this.fetchQuestionData()}>
            Cancel
          </Button>
          <Button onClick={() => this.saveQuestions()}>
            Save
          </Button>
        </div>
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
