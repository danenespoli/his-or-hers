const io = require('socket.io-client');
const prompt = require('prompt-sync')();

class TestSocket {
  constructor() {
    this.socket = io('http://localhost:8081');
  }

  joinGame(name) {
    console.log(`Joining with name: ${name}`);
    this.socket.emit('join', name);
  }

  makeGuess(guess, name) {
    this.socket.emit('guess', guess, name);
  }
}

class SocketTester {
  constructor(numSockets) {
    this.sockets = [];
    for (let i = 0; i < numSockets; i++) {
      this.sockets.push(new TestSocket());
    }
  }

  joinAll() {
    this._forAllSockets((socket, idx) => {
      socket.joinGame(`Player ${idx}`);
    });
  }

  _forAllSockets(fn) {
    for (let i = 0; i < this.sockets.length; i++) {
      fn(this.sockets[i], i);
    }
  }
}

function repl() {
  console.log('Starting...');
  const tester = new SocketTester(10);
  tester.joinAll();
  console.log('Done.');
}
