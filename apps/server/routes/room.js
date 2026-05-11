// apps/server/routes/room.js
import { Router } from 'express';

const router = Router();

// create a new room (mock)
router.post('/', (req, res) => {
  const roomId = `room_${Date.now()}`;
  res.status(201).json({
    roomId,
    code: 'ABC123',
    status: 'created',
    playerCount: 0
  });
});

// join existing room (mock)
router.post('/:code', (req, res) => {
  const { code } = req.params;
  res.json({
    roomId: `mock-${code}`,
    code,
    status: 'joined',
    playerCount: 2
  });
});

export default router;
