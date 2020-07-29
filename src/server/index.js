const express = require('express');
const http = require('http');
const webSocketMount = require('./WebSocketMount');

const webServer = {
  enableRoutes(app) {
    app.use(express.static('dist'));

    app.get('/api/getUsername', (req, res) => {
      res.send({ username: '12345' });
    });

    app.post('/api/startGame', (req, res) => {
      webSocketMount.startGame();
      res.status(200);
    });
  },

  enableWebSockets(httpServer) {
    webSocketMount.enableWebSockets(httpServer);
  },

  startWebServer(PORT_NUMBER = process.env.PORT || 8080) {
    const app = express();
    const httpServer = http.Server(app);

    this.enableRoutes(app);
    this.enableWebSockets(httpServer);

    httpServer.listen(PORT_NUMBER);
    console.log(`Web server started on port ${PORT_NUMBER}`);
  },
};

webServer.startWebServer();
