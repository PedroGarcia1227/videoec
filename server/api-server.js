const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

const streams = new Map();

wss.on('connection', (ws, req) => {
  const streamId = new URL(req.url, 'http://localhost').searchParams.get('stream');
  
  if (streamId) {
    if (!streams.has(streamId)) {
      streams.set(streamId, new Set());
    }
    streams.get(streamId).add(ws);

    console.log(`Cliente conectado ao stream ${streamId}`);

    ws.on('message', (message) => {
      // Broadcast a mensagem para todos os clientes conectados a este stream
      streams.get(streamId).forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      streams.get(streamId).delete(ws);
      console.log(`Cliente desconectado do stream ${streamId}`);
    });
  }
});

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.get('/streams', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'streams.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'videos.html'));
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});