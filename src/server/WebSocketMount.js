let io;

// * CONSTANTS *
const MAX_TIME = 30;

// * GLOBALS *
// These variables are kept in process memory
// throughout the duration of the game.
const gameState = {
  started: false,
  question: 0,
  time: MAX_TIME,
};
let timer = null;
let players = {};
let scores = {};

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
    players[id] = name;
    scores[id] = 0;

    console.log(players, scores);
  },

  removePlayer(id) {
    delete players[id];
    delete scores[id];

    console.log(players, scores);
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
    timer = setInterval(() => {
      io.emit('timer', gameState.time);
      gameState.time--;

      if (gameState.time === 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Send answer for question.
    io.emit('answer', 'his');
  },

  getGameState() {
    return gameState;
  },

  endGame() {
    console.log('Ending game!');

    this._resetGame();
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
    scores = {};
  },
};

module.exports = webSocketMount;
