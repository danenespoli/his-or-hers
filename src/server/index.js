const express = require('express');
const http = require('http');
const AWS = require('aws-sdk');
const webSocketMount = require('./WebSocketMount');

const webServer = {
  enableRoutes(app) {
    app.use(express.static('dist'));

    app.get('/api/gameState', (req, res) => {
      const state = webSocketMount.getGameState();
      res.send(state);
    });

    app.post('/api/startGame', (req, res) => {
      webSocketMount.startGame();
      res.status(200);
    });

    app.post('/api/nextQuestion', (req, res) => {
      webSocketMount.nextQuestion();
      res.status(200);
    });

    app.post('/api/endGame', (req, res) => {
      webSocketMount.endGame();
      res.status(200);
    });

    app.post('/api/editQuestions', async (req, res) => {
      // const s3 = new AWS.S3();
      // const data = await s3.getObject({
      //   Bucket: 'his-or-hers',
      //   Key: 'questions.json',
      // }).promise();
      // const questions = JSON.parse(data.Body);
      // console.log(questions);

      // TODO: edit questions in S3...
      webSocketMount.setQuestionData();
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
