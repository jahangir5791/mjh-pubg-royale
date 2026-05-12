import * as apiClient from './apiClient.js';
import * as router from './router.js';

let $status = null;
let $loading = null;
let $quickPlay = null;
let $createRoom = null;
let $joinRoom = null;

function showLoading() {
  if ($loading) $loading.style.display = 'block';
}

function hideLoading() {
  if ($loading) $loading.style.display = 'none';
}

async function startGame() {
  showLoading();
  try {
    const result = await apiClient.startMatch();
    if ($status) $status.textContent = `Match started: ${result.matchId || 'OK'}`;
  } catch (err) {
    if ($status) $status.textContent = `Start failed: ${err.message}`;
  } finally {
    hideLoading();
  }
}

async function createRoom() {
  showLoading();
  try {
    const result = await apiClient.createRoom();
    if ($status) $status.textContent = `Room created: ${result.roomCode || 'OK'}`;
  } catch (err) {
    if ($status) $status.textContent = `Create room failed: ${err.message}`;
  } finally {
    hideLoading();
  }
}

async function joinRoom() {
  const code = prompt('Enter room code:');
  if (!code) return;

  showLoading();
  try {
    const result = await apiClient.joinRoom(code.trim());
    if ($status) $status.textContent = `Joined room: ${result.roomCode || code.trim()}`;
  } catch (err) {
    if ($status) $status.textContent = `Join room failed: ${err.message}`;
  } finally {
    hideLoading();
  }
}

function initApp() {
  $status = document.getElementById('status');
  $loading = document.getElementById('loading');
  $quickPlay = document.getElementById('quick-play');
  $createRoom = document.getElementById('create-room');
  $joinRoom = document.getElementById('join-room');

  if ($quickPlay) $quickPlay.addEventListener('click', startGame);
  if ($createRoom) $createRoom.addEventListener('click', createRoom);
  if ($joinRoom) $joinRoom.addEventListener('click', joinRoom);

  window.addEventListener('online', () => {
    if ($status) $status.textContent = 'Online - Ready to play!';
  });

  window.addEventListener('offline', () => {
    if ($status) $status.innerHTML = 'Offline mode <br><small>Game will load when online</small>';
  });

  router.init();
}

document.addEventListener('DOMContentLoaded', initApp);
