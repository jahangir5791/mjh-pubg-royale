// apps/server/routes/match.js
import { Router } from 'express';

const router = Router();

router.post('/start', (req, res) => {
  const startTime = new Date().toISOString();
  res.json({
    status: 'started',
    startedAt: startTime,
    players: 100
  });
});

router.get('/status/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    matchId: id,
    status: 'in-progress',
    remainingPlayers: 32,
    phase: 'mid-game'
  });
});

export default router;
