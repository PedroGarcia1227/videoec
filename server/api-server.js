const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const streams = new Map();

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.get('/streams', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'streams.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'videos.html'));
});

wss.on('connection', (ws, req) => {
  const streamId = req.url.split('/')[1];
  console.log(`Nova conexão para o stream ${streamId}`);

  if (!streams.has(streamId)) {
    streams.set(streamId, new Set());
  }
  streams.get(streamId).add(ws);

  ws.on('message', (message) => {
    const clients = streams.get(streamId);
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Conexão fechada para o stream ${streamId}`);
    streams.get(streamId).delete(ws);
    if (streams.get(streamId).size === 0) {
      streams.delete(streamId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});