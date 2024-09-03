const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

let latestFrame = null;

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.post('/stream', (req, res) => {
  const { frame } = req.body;

  if (frame) {
    latestFrame = frame;
    console.log('Frame recebido:', frame); // Mantenha os logs para depuração
    res.status(200).json({ message: 'Frame recebido com sucesso' });
  } else {
    res.status(400).json({ message: 'Nenhum frame enviado' });
  }
});

app.get('/video', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Stream</title>
    </head>
    <body>
        <img id="liveStream" width="640" height="480" />
        <script>
            const ws = new WebSocket('wss://videoec.vercel.app');
            const image = document.getElementById('liveStream');

            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.frame) {
                    image.src = \`data:image/jpeg;base64,\${data.frame}\`;
                }
            };

            ws.onerror = function(error) {
                console.error('WebSocket error:', error);
            };
        </script>
    </body>
    </html>
  `);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });

  setInterval(() => {
    if (latestFrame) {
      ws.send(JSON.stringify({ frame: latestFrame }));
    }
  }, 100); // Envia o frame a cada 100ms
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
