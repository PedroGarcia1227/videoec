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
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Stream</title>
    <style>
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap; /* Adiciona wrap para responsividade */
            margin: 0 auto;
        }
        .camera {
            text-align: center;
            border: 1px solid #ddd; /* Adiciona uma borda ao redor das câmeras */
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 8px; /* Adiciona bordas arredondadas */
        }
        .camera img {
            width: 320px;
            height: 240px;
            object-fit: cover; /* Ajusta a imagem para não distorcer */
        }
        .camera h2 {
            margin: 0;
            font-size: 18px; /* Aumenta o tamanho da fonte do título */
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="camera">
            <h2>Camera 1</h2>
            <img id="camera1" />
        </div>
        <div class="camera">
            <h2>Camera 2</h2>
            <img id="camera2" />
        </div>
        <div class="camera">
            <h2>Camera 3</h2>
            <img id="camera3" />
        </div>
    </div>
    <script>
        async function fetchFrame(camera) {
            try {
                const response = await fetch(\`/latest-frame\${camera}\`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const image = document.getElementById(\`camera\${camera}\`);
                if (data.frame) {
                    image.src = \`data:image/jpeg;base64,\${data.frame}\`;
                }
            } catch (error) {
                console.error(\`Erro ao buscar o frame da câmera \${camera}:\`, error);
            }
        }

        function startFetchingFrames() {
            // Atualiza o frame de cada câmera a cada 100ms
            setInterval(() => fetchFrame(1), 100);
            setInterval(() => fetchFrame(2), 100);
            setInterval(() => fetchFrame(3), 100);
            
            // Carrega o frame inicial
            fetchFrame(1);
            fetchFrame(2);
            fetchFrame(3);
        }

        window.onload = startFetchingFrames;
    </script>
</body>
</html>
  `);
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
