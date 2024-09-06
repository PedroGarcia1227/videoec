const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const frames = {
  stream1: null,
  stream2: null,
  stream3: null
};

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.post('/stream/:id', (req, res) => {
  const { id } = req.params;
  const { frame } = req.body;

  if (frames.hasOwnProperty(id)) {
    if (frame) {
      frames[id] = frame;
      console.log(`Frame recebido para ${id}:`, frame);
      res.status(200).json({ message: `${id} frame recebido com sucesso` });
    } else {
      res.status(400).json({ message: `Nenhum frame enviado para ${id}` });
    }
  } else {
    res.status(404).json({ message: 'Stream não encontrada' });
  }
});

app.get('/streams', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'streams.html'));
});

app.get('/videos', (req, res) => {
  res.sendFile(path.join(__dirname, '..','public', 'videos.html'));
});

app.get('/latest-frame/:id', (req, res) => {
  const { id } = req.params;

  if (frames.hasOwnProperty(id)) {
    if (frames[id]) {
      res.status(200).json({ frame: frames[id] });
    } else {
      res.status(404).json({ message: `${id} frame não encontrado` });
    }
  } else {
    res.status(404).json({ message: 'Stream não encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
