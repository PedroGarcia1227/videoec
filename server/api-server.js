const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' })); // Ajuste o limite conforme necessário
app.use(cors()); // Habilita CORS

app.get('/', (req, res) => {
  res.status(200).send('API está funcionando');
});

app.post('/stream', (req, res) => {
  const { frame } = req.body;

  if (frame) {
    // Processar o frame recebido
    console.log('Frame recebido:', frame);

    // Aqui você pode adicionar lógica para processar o frame, se necessário
    res.status(200).json({ message: 'Frame recebido com sucesso' });
  } else {
    res.status(400).json({ message: 'Nenhum frame enviado' });
  }
});

// Rota para servir o HTML de visualização
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
                const response = await fetch('/stream'); // Use a URL relativa
                const data = await response.json();
                const image = document.getElementById('liveStream');
                if (data.frame) {
                    image.src = \`data:image/jpeg;base64,\${data.frame}\`;
                }
            }
            setInterval(fetchFrame, 100); // Atualiza o frame a cada 100ms
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
