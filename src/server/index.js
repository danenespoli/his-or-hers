const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const AWS = require('aws-sdk');
const gameManager = require('./gameManager');

const webServer = {
  enableRoutes(app) {
    app.use(bodyParser.json());
    app.use(express.static('dist'));

    app.get('/api/gameState', (req, res) => {
      const state = gameManager.getGameState();
      res.send(state);
    });

    app.post('/api/startGame', async (req, res) => {
      await gameManager.startGame();
      res.status(200);
    });

    app.post('/api/nextQuestion', (req, res) => {
      gameManager.nextQuestion();
      res.status(200);
    });

    app.post('/api/endGame', async (req, res) => {
      await gameManager.endGame();
      res.status(200);
    });

    app.post('/api/editQuestions', async (req, res) => {
      console.log(req.body);
      // await gameManager.updateQuestionData(body);
      res.status(200);
    });
  },

  enableWebSockets(httpServer) {
    gameManager.enableWebSockets(httpServer);
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
