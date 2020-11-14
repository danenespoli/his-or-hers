const io = require('socket.io-client');

const gameSocket = (process.env.NODE_ENV === 'production')
  ? io()
  : io('localhost:8081');

export default gameSocket;
