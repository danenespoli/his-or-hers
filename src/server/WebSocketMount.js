let io;

const MAX_TIME = 30;

const gameState = {
  started: false,
  question: 0,
  time: MAX_TIME,
};
let timer = null;


const webSocketMount = {
  enableWebSockets(httpServer) {
    io = require('socket.io')(httpServer);

    io.on('connection', socket => {
      console.log('User connected!');

      socket.on('message', message => {
        console.log(`User sent: ${message}`);
        io.emit('message', message);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  },

  /*
    All subsequent functions assume enableWebSockets has been called.
  */

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
    if (timer) {
      clearInterval(timer);
    }
    gameState.question = 0;
    gameState.started = false;
    gameState.time = MAX_TIME;
    timer = null;
  },
};

module.exports = webSocketMount;
