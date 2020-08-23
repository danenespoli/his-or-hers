const io = require('socket.io-client');
const prompt = require('prompt-sync')();

class TestSocket {
  constructor() {
    this.socket = io('http://steph-or-dustin-staging.herokuapp.com/');

    this.socket.on('question', (question, questionNum, questionTotal, theme) => {
      // Answer after a few seconds.
      this.makeGuessAfterTime();
    });
  }

  makeGuessAfterTime() {
    const timeToWait = Math.random() * (15000 - 1000) + 1000;
    const guess = Math.random() > 0.5 ? 'his' : 'hers';

    setTimeout(() => {
      this.socket.emit('guess', 'his', this.name);
    }, timeToWait);
  }

  joinGame(name) {
    this.name = name;
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

// Repl is currently broken because prompt-sync waits and the
// websockets on this process can't function in the meantime.
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

function runTest() {
  const players = 50;
  const tester = new SocketTester(players);

  tester.joinAll();

  // tester.quit();
}

// repl();
runTest();
