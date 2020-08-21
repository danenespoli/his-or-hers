import React, { Component } from 'react';
import {
  Button,
  IconButton,
  TextInput,
  Select,
  ArrowUpIcon,
  ArrowDownIcon
} from 'evergreen-ui';
import axios from 'axios';
import './dashboard.css';

export default class Dashboard extends Component {
  state = {
    editQuestionMode: false,
    questionData: null,
    modified: false,
  }

  componentDidMount() {
    this.fetchQuestionData();
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
      modified: true,
    });
  }

  removeQuestion(index) {
    const { questionData } = this.state;

    questionData.splice(index, 1);

    this.setState({
      questionData,
      modified: true,
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
      modified: true,
    });
  }

  _swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  moveQuestionUp(index) {
    const { questionData } = this.state;

    if (index === 0) {
      return;
    }

    this._swap(questionData, index, index - 1);

    this.setState({
      questionData,
      modified: true,
    });
  }

  moveQuestionDown(index) {
    const { questionData } = this.state;

    if (index === questionData.length - 1) {
      return;
    }

    this._swap(questionData, index, index + 1);

    this.setState({
      questionData,
      modified: true,
    });
  }

  saveQuestions() {
    const { questionData } = this.state;
    console.log('Saving questions...');
    axios.post('/api/questionData', questionData).then(() => {
      console.log('Saved.');
      this.setState({
        modified: false,
      });
    });
  }

  fetchQuestionData() {
    console.log('Fetching question data...');
    axios.get('/api/questionData').then(({ data: questionData }) => {
      this.setState({
        questionData,
        modified: false,
      });
    });
  }

  enterEditQuestionMode() {
    this.setState({
      editQuestionMode: true,
    });
  }

  renderDefaultControls() {
    return (
      <div className="dash-background">
        <div className="dash-element">
          <Button className="dash-element" onClick={() => this.startGame()}>
            Start Game!
          </Button>
          <Button className="dash-element" onClick={() => this.enterEditQuestionMode()}>
            Edit Questions
          </Button>
        </div>
      </div>
    );
  }

  renderEditQuestionMode() {
    const { questionData, modified } = this.state;

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
          <IconButton
            style={{ display: 'inline-block' }}
            icon={ArrowUpIcon}
            onClick={() => this.moveQuestionUp(index)}
            disabled={index === 0}
          />
          <IconButton
            style={{ display: 'inline-block' }}
            icon={ArrowDownIcon}
            onClick={() => this.moveQuestionDown(index)}
            disabled={index === questionData.length - 1}
          />
        </div>
      ));
    }

    return (
      <div className="dash-background">
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
        <div className="dash-element">
          {modified && (
            <>
              <Button onClick={() => this.fetchQuestionData()}>
                Cancel
              </Button>
              <Button onClick={() => this.saveQuestions()}>
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  renderDuringGame() {
    const { rawState } = this.props;

    const stateInfo = Object.entries(rawState).map(([key, value]) => (
      <tr>
        <td className="dash-table-key">{key}:</td>
        <td className="dash-table-value">{value}</td>
      </tr>
    ));
    return (
      <div className="dash-background">
        <div className="dash-element">
          <Button onClick={() => this.endGame()}>
            End Game
          </Button>
          <Button onClick={() => this.nextQuestion()}>
            Next Question
          </Button>
        </div>
        <div className="dash-element">
          <table className="dash-table">
            {stateInfo}
          </table>
        </div>
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
