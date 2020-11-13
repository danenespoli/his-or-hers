const AWS = require('aws-sdk');

// * CONSTANTS *
// *** IF THIS VALUE CHANGES, MUST UPDATE TIMER.JS ***
const MAX_TIME = 30;
// If true, will automatically go to next question after answer has been revealed.
const AUTO_NEXT = true;

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
  async enableWebSockets(httpServer) {
    await this.fetchQuestionData();
    io = require('socket.io')(httpServer);

    io.on('connection', socket => {
      // TODO: add connection to player array now? Caused issues with dashboard user being in game,
      // or even just tabs on the home screen.

      socket.on('join', name => {
        this.addPlayer(socket.id, name);
        socket.emit('join-success');
      });

      socket.on('guess', (guess, name) => {
        this.acceptGuess(socket.id, guess, name);
      });

      socket.on('disconnect', () => {
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

    console.log(`* PLAYER JOINED * \t ${id}, ${name}`);
    // console.log(Object.values(players).map(p => p.name));
  },

  removePlayer(id) {
    if (!players[id]) return;

    console.log(`* PLAYER LEFT * \t ${players[id].name}`);
    delete players[id];
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

    // The server will wait `allPlayersAnswerSeconds` after everyone has
    // answered to send the answer data, instead of sending it right away.
    let allPlayersAnswerSeconds = 2;

    timer = setInterval(() => {
      io.emit('timer', gameState.time--);

      if (this._allPlayersAnswered()) {
        allPlayersAnswerSeconds--;
      }

      if (gameState.time < 0 || allPlayersAnswerSeconds === 0) {
        clearInterval(timer);
        // Send answer for question.
        io.emit('answer', q.answer);
        // Send each player their updated score.
        this._sendIndividualScores();

        if (AUTO_NEXT) {
          setTimeout(() => {
            if (gameState.question < questionData.length - 1) {
              this.nextQuestion();
            }
          }, 5000);
        }
      }
    }, 1000);
  },

  _allPlayersAnswered() {
    const playerValues = Object.values(players);
    for (let i = 0; i < playerValues.length; i++) {
      const player = playerValues[i];
      if (!player.didGuess[gameState.question]) {
        return false;
      }
    }
    return true;
  },

  // This function will randomly select a theme for each question, but will also
  // ensure that all 5 themes are used before the same theme is selected again.
  _setNextTheme() {
    const allOptions = [0, 1, 2, 3, 4, 5];
    let currentOptions = allOptions.filter(o => (
      !themeHistory.has(o)
    ));

    // Already used all options, so reset the history.
    // However, keep the current theme in history, so that we don't
    // get the same theme twice in a row.
    if (currentOptions.length === 0) {
      currentOptions = allOptions.filter(o => (
        o !== theme
      ));
      themeHistory.clear();
      themeHistory.add(theme);
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
    console.log('* SENDING FINAL SCORES *');
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

    console.log('COMPUTING AND EMITTING SCORES');
    console.log('SCORES', scores);

    // Sort scores.
    const sortedScores = Object.values(scores).sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });
    console.log('SORTED SCORES', sortedScores);

    // Augment score objects with rank.
    for (let i = 0; i < sortedScores.length; i++) {
      sortedScores[i].rank = i + 1;
    }
    console.log('AUGMENTED SORTED SCORES', sortedScores);

    // Emit top 5 scores to everyone.
    const topScores = sortedScores.slice(0, 5);
    io.emit('top-scores', topScores);
    console.log('TOP 5 SCORES', topScores);

    // Emit own score with rank to each player.
    for (let i = 0; i < playerEntries.length; i++) {
      const [socketId, player] = playerEntries[i];
      const finalScore = scores[socketId];
      io.to(socketId).emit('final-score', finalScore);
    }

    this._sendIndividualScores();
  },

  acceptGuess(id, guess, name) {
    console.log('* PLAYER GUESSED *');

    // Make sure user can still guess.
    if (gameState.time <= 0) {
      console.log('No time left to guess!');
      return;
    }

    const q = questionData[gameState.question];
    if (!players[id]) {
      // Handle error - add the player anyways, with a bunch of 0s for their previous guesses!
      this.addPlayer(id, name);
    }
    const player = players[id];

    // Update name if this websocket changed theirs.
    if (player.name !== name) {
      console.log(`Updating player name from ${player.name} to ${name}`);
      player.name = name;
    }

    // Figure out if the guess is correct.
    const score = guess === q.answer ? 1 : 0;
    player.guesses[gameState.question] = score;
    player.didGuess[gameState.question] = true;

    console.log(player);
  },

  getGameState() {
    return gameState;
  },

  async endGame() {
    console.log('* ENDING GAME *');
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
    console.log('* FETCHED QUESTION DATA *');
    // console.log(questionData);
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
    console.log('* UPDATED QUESTION DATA: *');
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
