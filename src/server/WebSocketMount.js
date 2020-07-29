let io;
let question = 0;

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

    this.sendQuestion();
  },

  sendQuestion() {
    // Send first question!
    io.emit('question', 'This is the first question!');

    // Count down from 30!
    let time = 30;
    const timer = setInterval(() => {
      io.emit('timer', time);
      time--;

      if (time <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    // Send answer for question.
    io.emit('answer', 'his');
  }
};

module.exports = webSocketMount;
