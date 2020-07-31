const AWS = require('aws-sdk');

// * CONSTANTS *
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
let timer = null;
let questionData = null;
let players = {};


const webSocketMount = {
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
    players[id] = {
      name,
      score: 0,
    };

    console.log(players);
  },

  removePlayer(id) {
    delete players[id];

    console.log(players);
  },

  startGame() {
    console.log('Starting game!');

    this._resetGame();
    gameState.started = true;

    this.sendNextQuestion();
  },

  sendNextQuestion() {
    // Send first question!
    io.emit('question', 'This is the first question!');

    // Count down from 30!
    gameState.time = MAX_TIME;
    io.emit('timer', gameState.time--);
    timer = setInterval(() => {
      io.emit('timer', gameState.time--);

      if (gameState.time < 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Send answer for question.
    io.emit('answer', 'his');
  },

  acceptGuess(id, guess) {
    // Make sure user can still guess.
    if (gameState.time <= 0) {
      console.log('No time left to guess!');
      return;
    }

    console.log(`${players[id].name} guessed ${guess}!`);
  },

  getGameState() {
    return gameState;
  },

  endGame() {
    console.log('Ending game!');
    io.emit('end-game');

    this._resetGame();
  },

  setQuestionData() {
    s3.getObject({
      Bucket: 'his-or-hers',
      Key: 'questions.json',
    }).promise().then(data => {
      console.log(data);
      questionData = JSON.parse(data.Body);
    });
  },

  _resetGame() {
    gameState.question = 0;
    gameState.started = false;
    gameState.time = MAX_TIME;

    if (timer) {
      clearInterval(timer);
    }
    timer = null;
    players = {};

    this.setQuestionData();
  },
};

module.exports = webSocketMount;
