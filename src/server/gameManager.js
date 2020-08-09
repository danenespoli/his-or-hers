const AWS = require('aws-sdk');

// * CONSTANTS *
// *** IF THIS VALUE CHANGES, MUST UPDATE TIMER.JS ***
const MAX_TIME = 30;

// * GLOBALS *
// These variables are kept in process memory
// throughout the duration of the game.
const s3 = new AWS.S3();
let io;
const gameState = {
  started: false,
  question: 0,
  time: MAX_TIME,
};
const players = {};
let timer = null;
let questionData = null;
let theme = null;
const themeHistory = new Set();


const gameManager = {
  enableWebSockets(httpServer) {
    io = require('socket.io')(httpServer);

    io.on('connection', socket => {
      console.log('User connected!');

      socket.on('join', name => {
        console.log(`User "${name}" joining.`);
        if (!gameState.started) {
          this.addPlayer(socket.id, name);
          socket.emit('join-success');
        }
      });

      socket.on('guess', (guess, name) => {
        this.acceptGuess(socket.id, guess, name);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
        this.removePlayer(socket.id);
      });
    });
  },

  /*
    All subsequent functions assume enableWebSockets has been called.
  */

  addPlayer(id, name) {
    const guesses = [];
    const didGuess = [];
    for (let i = 0; i < questionData.length; i++) {
      guesses.push(0);
      didGuess.push(false);
    }

    players[id] = {
      name,
      guesses,
      didGuess,
    };

    console.log(players);
  },

  removePlayer(id) {
    delete players[id];

    console.log(players);
  },

  async startGame() {
    console.log('Starting game!');

    await this._resetGame();
    gameState.started = true;

    this._sendQuestion();
  },

  nextQuestion() {
    gameState.question++;
    if (gameState.question < questionData.length) {
      // Send the next question.
      this._sendQuestion();
      this._sendIndividualScores();
    } else {
      // Otherwise, all questions have been sent, so signal game to end.
      this._computeAndEmitScores();
    }
  },

  // This function handles the whole question flow.
  // It does the following:
  //    - Sends a question
  //    - Counts down the timer
  //    - Sends the answer after the timer expires
  _sendQuestion() {
    const q = questionData[gameState.question];

    // Send a new theme for this question.
    this._setNextTheme();

    // Send question, question number, total number of questions, and theme.
    io.emit('question', q.question, gameState.question + 1, questionData.length, theme);

    // Count down from 30!
    gameState.time = MAX_TIME;
    io.emit('timer', gameState.time--);
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      io.emit('timer', gameState.time--);

      if (gameState.time < 0 || this._allPlayersAnswered()) {
        clearInterval(timer);
        // Send answer for question.
        io.emit('answer', q.answer);
        // Send each player their updated score.
        this._sendIndividualScores();
      }
    }, 1000);
  },

  _allPlayersAnswered() {
    return false;
  },

  // This function will randomly select a theme for each question, but will also
  // ensure that all 5 themes are used before the same theme is selected again.
  _setNextTheme() {
    const allOptions = [0, 1, 2, 3, 4, 5];
    let currentOptions = allOptions.filter(o => (
      !themeHistory.has(o)
    ));

    // Already used all options, so reset the history.
    if (currentOptions.length === 0) {
      currentOptions = allOptions;
      themeHistory.clear();
    }

    // Random number out of available numbers.
    const randomIndex = Math.floor(Math.random() * Math.floor(currentOptions.length));
    theme = currentOptions[randomIndex];
    themeHistory.add(theme);
  },

  _sendIndividualScores() {
    for (let i = 0; i < Object.entries(players).length; i++) {
      const [socketId, player] = Object.entries(players)[i];
      const score = this._getScoreForPlayer(player);
      io.to(socketId).emit('score', score);
    }
  },

  _getScoreForPlayer(player) {
    let score = 0;
    for (let j = 0; j < player.guesses.length; j++) {
      score += player.guesses[j];
    }
    return score;
  },

  _computeAndEmitScores() {
    const playerEntries = Object.entries(players);
    const scores = {};

    // Tally scores for all players.
    for (let i = 0; i < playerEntries.length; i++) {
      const [socketId, player] = playerEntries[i];
      const score = this._getScoreForPlayer(player);

      scores[socketId] = {
        id: socketId,
        name: player.name,
        score,
      };
    }

    // Get top 5 scores.
    const topScores = Object.values(scores).sort((a, b) => (
      a.score > b.score
    )).slice(0, 5);

    // Emit own score and top 5 scores to each player.
    io.emit('top-scores', topScores);
    this._sendIndividualScores();
  },

  acceptGuess(id, guess, name) {
    // Make sure user can still guess.
    if (gameState.time <= 0) {
      console.log('No time left to guess!');
      return;
    }

    const q = questionData[gameState.question];
    const player = players[id];
    if (!player) {
      // Handle error - add the player anyways, with a bunch of 0s for their previous guesses!
      this.addPlayer(id, name);
    }

    // Update name if this websocket changed theirs.
    if (player.name !== name) {
      console.log(`Updating player name from ${player.name} to ${name}`);
      player.name = name;
    }

    const score = guess === q.answer ? 1 : 0;
    if (player.guesses.length - 1 < gameState.question) {
      player.guesses.push(score);
    } else {
      player.guesses[gameState.question] = score;
    }

    console.log(players);
  },

  getGameState() {
    return gameState;
  },

  async endGame() {
    console.log('Ending game!');
    io.emit('end-game');

    await this._resetGame();
    for (let i = 0; i < Object.values(players).length; i++) {
      const player = Object.values(players)[i];
      player.guesses = [];
    }
  },

  async fetchQuestionData() {
    const data = await s3.getObject({
      Bucket: 'his-or-hers',
      Key: 'questions.json',
    }).promise();
    questionData = JSON.parse(data.Body);
    console.log(questionData);
    return questionData;
  },

  async updateQuestionData(body) {
    const data = await s3.putObject({
      Bucket: 'his-or-hers',
      Key: 'questions.json',
      ContentType: 'application/json',
      Body: JSON.stringify(body),
    }).promise();
    questionData = body;
    console.log(questionData);
  },

  async _resetGame() {
    gameState.question = 0;
    gameState.started = false;
    gameState.time = MAX_TIME;

    if (timer) {
      clearInterval(timer);
    }
    timer = null;
    theme = null;
    themeHistory.clear();

    await this.fetchQuestionData();
  },
};

module.exports = gameManager;
