/* eslint-disable no-param-reassign */
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
import { useRecoilValue } from 'recoil';
import { gameState, scoresShowingSelector } from './GameState';

export default function Dashboard() {
  const [editQuestionMode, setEditQuestionMode] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [modified, setModified] = useState(false);

  // TODO: needs to only happen on componentDidMount?
  useEffect(() => {
    this.fetchQuestionData();
  });

  render() {
    const gameState = useRecoilValue(gameState);
    const scoresShowing = useRecoilValue(scoresShowingSelector);

    const {question} = gameState;

    // If the game has started, show End Game options.
    if (question !== null) {
      return <DashboardDuringGame
        rawState={{...gameState, scoresShowing}}
      />;
    }

    // Before the game starts.
    if (editQuestionMode) {
      return <DashboardEditQuestions
        questionData={questionData}
        modified={modified}
        setEditQuestionMode={setEditQuestionMode}
      />;
    }

    return (
      <div className="dash-background">
        <div className="dash-element">
          <Button className="dash-element" onClick={() => axios.post('/api/startGame')}>
            Start Game!
          </Button>
          <Button className="dash-element" onClick={() => setEditQuestionMode(true)}>
            Edit Questions
          </Button>
        </div>
      </div>
    );
  }
}

function arraySwap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}


function DashboardEditQuestions(props) {
  const { questionData, modified, setEditQuestionMode } = this.props;

  function editQuestion(index, question, answer) {
    questionData[index] = {
      question,
      answer,
    };

    setQuestionData(questionData);
    setModified(true);
  }

  function removeQuestion(index) {
    questionData.splice(index, 1);

    setQuestionData(questionData);
    setModified(true);
  }

  function addQuestion() {
    questionData.push({
      question: '',
      answer: 'his',
    });

    setQuestionData(questionData);
    setModified(true);
  }

  function moveQuestionUp(index) {
    if (index === 0) return;
    arraySwap(questionData, index, index - 1);

    setQuestionData(questionData);
    setModified(true);
  }

  function moveQuestionDown(index) {
    if (index === questionData.length - 1) return;
    arraySwap(questionData, index, index + 1);

    setQuestionData(questionData);
    setModified(true);
  }

  function saveQuestions() {
    console.log('Saving questions...');
    axios.post('/api/questionData', questionData).then(() => {
      console.log('Saved.');
      setModified(false);
    });
  }

  function fetchQuestionData() {
    console.log('Fetching question data...');
    axios.get('/api/questionData').then(({ data: questionData }) => {
      setQuestionData(questionData);
      setModified(false);
    });
  }

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
          onChange={e => editQuestion(index, e.target.value, q.answer)}
        />
        <Select
          value={q.answer}
          onChange={e => editQuestion(index, q.question, e.target.value)}
        >
          <option value="his">Dustin</option>
          <option value="hers">Steph</option>
        </Select>
        <Button onClick={() => removeQuestion(index)}>
          Remove
        </Button>
        <IconButton
          style={{ display: 'inline-block' }}
          icon={ArrowUpIcon}
          onClick={() => moveQuestionUp(index)}
          disabled={index === 0}
        />
        <IconButton
          style={{ display: 'inline-block' }}
          icon={ArrowDownIcon}
          onClick={() => moveQuestionDown(index)}
          disabled={index === questionData.length - 1}
        />
      </div>
    ));
  }

  return (
    <div className="dash-background">
      <Button onClick={() => setEditQuestionMode(false)}>
        Back
      </Button>
      <div>
        {questionRows}
      </div>
      <div>
        <Button onClick={() => addQuestion()}>
          Add question
        </Button>
      </div>
      <div className="dash-element">
        {modified && (
          <>
            <Button onClick={() => fetchQuestionData()}>
              Cancel
            </Button>
            <Button onClick={() => saveQuestions()}>
              Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
}


function DashboardDuringGame(props) {
  const {rawState} = props;

  const stateInfo = Object.entries(rawState).map(([key, value]) => (
    <tr>
      <td className="dash-table-key">{key}:</td>
      <td className="dash-table-value">{value}</td>
    </tr>
  ));

  return (
    <div className="dash-background">
      <div className="dash-element">
        <Button onClick={() => axios.post('/api/endGame')}>
          End Game
        </Button>
        <Button onClick={() => axios.post('/api/nextQuestion')}>
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
