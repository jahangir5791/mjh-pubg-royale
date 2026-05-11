// apps/web/apiClient.js

const API_BASE = '/api';  // server apps/server এর টার্গেট

export async function createRoom() {
  const res = await fetch(`${API_BASE}/room`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Room create failed: ${res.status}`);
  return await res.json();
}

export async function joinRoom(roomCode) {
  const res = await fetch(`${API_BASE}/room/${roomCode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`Join room failed: ${res.status}`);
  return await res.json();
}

// placeholder for game/match endpoint
export async function startMatch() {
  const res = await fetch(`${API_BASE}/match/start`, { method: 'POST' });
  if (!res.ok) throw new Error(`Start match failed: ${res.status}`);
  return await res.json();
}
