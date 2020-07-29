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

    io.emit('question', {
      question: 'This is the first question!',
    });
  }
};

module.exports = webSocketMount;
