import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const CORS_OPTIONS = {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Access-Control-Allow-Origin'],
    credentials: true,
  },
};

const server = createServer(app);
const io = new Server(server, CORS_OPTIONS);

app.use(cors(CORS_OPTIONS));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (msg) => {
    console.log('message', msg);
    io.emit('message', msg);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
