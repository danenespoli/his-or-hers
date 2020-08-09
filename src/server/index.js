const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
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
      res.sendStatus(200);
    });

    app.post('/api/nextQuestion', (req, res) => {
      gameManager.nextQuestion();
      res.sendStatus(200);
    });

    app.post('/api/endGame', async (req, res) => {
      await gameManager.endGame();
      res.sendStatus(200);
    });

    app.post('/api/questionData', async (req, res) => {
      const { body } = req;
      console.log(body);
      await gameManager.updateQuestionData(body);
      res.sendStatus(200);
    });

    app.get('/api/questionData', async (req, res) => {
      const questionData = await gameManager.fetchQuestionData();
      console.log(questionData);
      res.send(questionData);
    });
  },

  async enableWebSockets(httpServer) {
    await gameManager.enableWebSockets(httpServer);
  },

  async startWebServer(PORT_NUMBER = process.env.PORT || 8081) {
    const app = express();
    const httpServer = http.Server(app);

    this.enableRoutes(app);
    await this.enableWebSockets(httpServer);

    httpServer.listen(PORT_NUMBER);
    console.log(`Web server started on port ${PORT_NUMBER}`);
  },
};

webServer.startWebServer();
