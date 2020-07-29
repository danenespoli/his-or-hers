const socket = require('socket.io-client')(process.env.WEBSOCKET_URL || 'localhost:8080');

export default socket;
