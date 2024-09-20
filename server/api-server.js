const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servindo HTML para capturar a câmera
app.get('/stream', (req, res) => {
    res.sendFile(path.join(__dirname, 'stream.html'));
});

// Servindo HTML para visualizar o stream ao vivo
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'view.html'));
});

// WebSocket para sinalização WebRTC
io.on('connection', (socket) => {
    console.log('Novo cliente conectado.');

    socket.on('offer', (offer) => {
        console.log('Recebendo oferta...');
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('Recebendo resposta...');
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        console.log('Recebendo candidato ICE...');
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});

// Exportando a função para o Vercel
module.exports = (req, res) => {
    server(req, res, () => {
        io(req, res);
    });
};
