const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
            async function fetchFrame() {
                try {
                    const response = await fetch('/latest-frame');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    const image = document.getElementById('liveStream');
                    if (data.frame) {
                        image.src = \`data:image/jpeg;base64,\${data.frame}\`;
                    }
                } catch (error) {
                    console.error('Erro ao buscar o frame:', error);
                }
            }
            setInterval(fetchFrame, 100); // Atualiza o frame a cada 100ms
            fetchFrame(); // Carrega o frame inicial
        </script>
    </body>
    </html>
  `);
});

app.get('/latest-frame', (req, res) => {
  if (latestFrame) {
    res.status(200).json({ frame: latestFrame });
  } else {
    res.status(404).json({ message: 'Nenhum frame encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
