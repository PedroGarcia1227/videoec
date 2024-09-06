const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

let latestFrame1 = null;
let latestFrame2 = null;
let latestFrame3 = null;

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.post('/stream1', (req, res) => {
  const { frame } = req.body;

  if (frame) {
    latestFrame1 = frame;
    console.log('Frame recebido:', frame);
    res.status(200).json({ message: 'Frame1 recebido com sucesso' });
  } else {
    res.status(400).json({ message: 'Frame1 frame enviado' });
  }
});

app.post('/stream2', (req, res) => {
  const { frame } = req.body;

  if (frame) {
    latestFrame2 = frame;
    console.log('Frame recebido:', frame);
    res.status(200).json({ message: 'Frame2 recebido com sucesso' });
  } else {
    res.status(400).json({ message: 'Frame2 frame enviado' });
  }
});

app.post('/stream3', (req, res) => {
  const { frame } = req.body;

  if (frame) {
    latestFrame3 = frame;
    console.log('Frame recebido:', frame);
    res.status(200).json({ message: 'Frame3 recebido com sucesso' });
  } else {
    res.status(400).json({ message: 'Frame3 frame enviado' });
  }
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'videos.html'));
});


app.get('/latest-frame1', (req, res) => {
  if (latestFrame1) {
    res.status(200).json({ frame: latestFrame1 });
  } else {
    res.status(404).json({ message: 'Frame1 não encontrado' });
  }
});

app.get('/latest-frame2', (req, res) => {
  if (latestFrame2) {
    res.status(200).json({ frame: latestFrame2 });
  } else {
    res.status(404).json({ message: 'Frame2 não encontrado' });
  }
});

app.get('/latest-frame3', (req, res) => {
  if (latestFrame3) {
    res.status(200).json({ frame: latestFrame3 });
  } else {
    res.status(404).json({ message: 'Frame3 não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
