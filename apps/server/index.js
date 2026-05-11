// apps/server/index.js
import express from 'express';
import cors from 'cors';

import roomRouter from './routes/room.js';
import matchRouter from './routes/match.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/room', roomRouter);
app.use('/api/match', matchRouter);

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[server] MJH PUBG Royale server listening on http://localhost:${PORT}`);
});
