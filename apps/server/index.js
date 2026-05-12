import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const rooms = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..')));

function makePlayer(id) {
  return {
    id,
    x: 0,
    y: 1,
    z: 0,
    rotY: 0,
    hp: 100,
    ammo: 30
  };
}

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

app.post('/api/room', (_, res) => {
  const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
  if (!rooms.has(roomCode)) rooms.set(roomCode, new Map());
  res.json({ ok: true, roomCode });
});

app.post('/api/room/:roomCode', (req, res) => {
  const roomCode = String(req.params.roomCode || '').toUpperCase();
  if (!rooms.has(roomCode)) rooms.set(roomCode, new Map());
  res.json({ ok: true, roomCode });
});

app.post('/api/match/start', (_, res) => {
  res.json({ ok: true, matchId: `M-${Date.now()}` });
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId }) => {
    const room = roomId || 'lobby';
    socket.join(room);

    if (!rooms.has(room)) {
      rooms.set(room, new Map());
    }

    const players = rooms.get(room);
    players.set(socket.id, makePlayer(socket.id));

    socket.data.roomId = room;

    socket.emit('roomJoined', {
      roomId: room,
      players: Array.from(players.values())
    });

    socket.to(room).emit('playerJoined', makePlayer(socket.id));
  });

  socket.on('playerInput', (input) => {
    const room = socket.data.roomId;
    if (!room || !rooms.has(room)) return;

    const players = rooms.get(room);
    const p = players.get(socket.id);
    if (!p) return;

    const speed = 0.12;
    if (input.forward) p.z -= speed;
    if (input.backward) p.z += speed;
    if (input.left) p.x -= speed;
    if (input.right) p.x += speed;
    p.rotY = input.rotY ?? p.rotY;

    socket.to(room).emit('playerState', p);
  });

  socket.on('disconnect', () => {
    const room = socket.data.roomId;
    if (!room || !rooms.has(room)) return;

    const players = rooms.get(room);
    players.delete(socket.id);
    socket.to(room).emit('playerLeft', { id: socket.id });
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
