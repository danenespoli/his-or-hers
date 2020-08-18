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
    this.players = [];
    for (let i = 0; i < numSockets; i++) {
      this.players.push(new TestSocket());
    }
  }

  quit() {
    this._forAllPlayers((player, idx) => {
      player.socket.disconnect();
    });
  }

  joinAll() {
    this._forAllPlayers((player, idx) => {
      player.joinGame(`Player ${idx}`);
    });
  }

  _forAllPlayers(fn) {
    for (let i = 0; i < this.players.length; i++) {
      fn(this.players[i], i);
    }
  }
}


function repl() {
  const players = prompt('Number of players to start: ');
  const tester = new SocketTester(players);

  while (true) {
    const cmd = prompt('Command: ');
    switch (cmd) {
      case 'help':
        console.log(`
          joinAll: Joins with all sockets
        `);
        break;
      case 'joinAll':
        tester.joinAll();
        break;
      default:
        tester.quit();
        return;
    }
  }
}

repl();
