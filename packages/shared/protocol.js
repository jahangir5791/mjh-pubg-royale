import io from 'socket.io-client';
import { initInput, inputState } from './input.js';
import { EVENTS, DEFAULT_ROOM } from '../../packages/shared/protocol.js';

const socket = io('http://localhost:3000');
initInput(canvas);

socket.on('connect', () => {
  socket.emit(EVENTS.JOIN_ROOM, { roomId: DEFAULT_ROOM });
});

setInterval(() => {
  socket.emit(EVENTS.PLAYER_INPUT, {
    forward: inputState.forward,
    backward: inputState.backward,
    left: inputState.left,
    right: inputState.right,
    rotY: player.rotation.y,
  });
}, 50);
