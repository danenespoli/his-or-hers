const webSocketMount = {
  enableWebSockets(httpServer) {
    const io = require('socket.io')(httpServer);

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
};

module.exports = webSocketMount;
