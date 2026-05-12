// apps/server/ws/index.js
// MJH PUBG Royale - Real WebSocket Server

import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 8080 });

// রুম ও প্লেয়ার ডাটা
const rooms = new Map(); // roomCode -> { players: Map(ws -> playerData), maxPlayers }
const clients = new Map(); // ws -> { playerId, roomCode, playerName }

console.log('🎮 WebSocket Server running on port 8080');

wss.on('connection', (ws) => {
  const playerId = uuidv4();
  clients.set(ws, { playerId, roomCode: null, playerName: null });
  
  console.log(`✅ Player connected: ${playerId}`);

  // সংযোগ নিশ্চিতকরণ
  ws.send(JSON.stringify({
    type: 'connected',
    playerId: playerId,
    message: 'Connected to MJH PUBG Royale Server'
  }));

  ws.on('message', (rawData) => {
    try {
      const data = JSON.parse(rawData.toString());
      const client = clients.get(ws);
      
      switch(data.type) {
        
        case 'quick_play':
          handleQuickPlay(ws, client);
          break;
          
        case 'create_room':
          handleCreateRoom(ws, client, data.roomName);
          break;
          
        case 'join_room':
          handleJoinRoom(ws, client, data.roomCode, data.playerName);
          break;
          
        case 'leave_room':
          handleLeaveRoom(ws, client);
          break;
          
        case 'player_ready':
          handlePlayerReady(ws, client);
          break;
          
        case 'update_position':
          handlePlayerPosition(ws, client, data.position);
          break;
          
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown command'
          }));
      }
    } catch(err) {
      console.error('Error parsing message:', err);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client && client.roomCode) {
      handleLeaveRoom(ws, client);
    }
    clients.delete(ws);
    console.log(`❌ Player disconnected: ${playerId}`);
  });
});

// ============= হ্যান্ডলার ফাংশন =============

function handleQuickPlay(ws, client) {
  // খালি রুম খোঁজা বা নতুন তৈরি
  let availableRoom = null;
  for (let [code, room] of rooms) {
    if (room.players.size < room.maxPlayers) {
      availableRoom = code;
      break;
    }
  }
  
  if (availableRoom) {
    joinRoomByCode(ws, client, availableRoom, `Player_${client.playerId.slice(0,6)}`);
  } else {
    const newRoomCode = generateRoomCode();
    createNewRoom(ws, client, newRoomCode, `Player_${client.playerId.slice(0,6)}`, 'Quick Match Room');
  }
}

function handleCreateRoom(ws, client, roomName) {
  const roomCode = generateRoomCode();
  const finalRoomName = roomName || `Room_${roomCode}`;
  createNewRoom(ws, client, roomCode, `Host_${client.playerId.slice(0,6)}`, finalRoomName);
}

function handleJoinRoom(ws, client, roomCode, playerName) {
  const finalName = playerName || `Soldier_${client.playerId.slice(0,6)}`;
  
  if (!rooms.has(roomCode)) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Room not found'
    }));
    return;
  }
  
  const room = rooms.get(roomCode);
  if (room.players.size >= room.maxPlayers) {
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Room is full'
    }));
    return;
  }
  
  joinRoomByCode(ws, client, roomCode, finalName);
}

function handleLeaveRoom(ws, client) {
  if (!client.roomCode) return;
  
  const room = rooms.get(client.roomCode);
  if (room) {
    room.players.delete(ws);
    
    // রুমে সবাইকে জানানো
    broadcastToRoom(client.roomCode, {
      type: 'player_left',
      playerId: client.playerId,
      playerName: client.playerName
    });
    
    // রুম খালি থাকলে ডিলিট
    if (room.players.size === 0) {
      rooms.delete(client.roomCode);
      console.log(`🗑️ Room deleted: ${client.roomCode}`);
    }
  }
  
  client.roomCode = null;
  client.playerName = null;
  
  ws.send(JSON.stringify({
    type: 'left_room',
    message: 'You left the room'
  }));
}

function handlePlayerReady(ws, client) {
  if (!client.roomCode) return;
  
  const room = rooms.get(client.roomCode);
  if (room) {
    const player = room.players.get(ws);
    if (player) {
      player.ready = true;
      
      // সবাই ready কিনা চেক
      const allReady = Array.from(room.players.values()).every(p => p.ready === true);
      
      broadcastToRoom(client.roomCode, {
        type: 'player_ready_update',
        playerId: client.playerId,
        playerName: client.playerName,
        ready: true,
        allReady: allReady
      });
      
      // সবাই ready হলে গেম স্টার্ট
      if (allReady && room.players.size >= 2) {
        broadcastToRoom(client.roomCode, {
          type: 'game_start',
          message: 'Match starting in 3...2...1...',
          timestamp: Date.now()
        });
      }
    }
  }
}

function handlePlayerPosition(ws, client, position) {
  if (!client.roomCode) return;
  
  broadcastToRoom(client.roomCode, {
    type: 'player_moved',
    playerId: client.playerId,
    playerName: client.playerName,
    position: position,
    timestamp: Date.now()
  }, ws); // নিজেকে ছাড়া broadcast
}

// ============= ইউটিলিটি ফাংশন =============

function generateRoomCode() {
  return 'MJH' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createNewRoom(ws, client, roomCode, playerName, roomDisplayName) {
  const room = {
    name: roomDisplayName,
    maxPlayers: 4,
    players: new Map(),
    createdAt: Date.now()
  };
  
  rooms.set(roomCode, room);
  
  // হোস্ট যোগ করা
  room.players.set(ws, {
    id: client.playerId,
    name: playerName,
    isHost: true,
    ready: false,
    position: { x: 0, y: 0, z: 0 }
  });
  
  client.roomCode = roomCode;
  client.playerName = playerName;
  
  ws.send(JSON.stringify({
    type: 'room_created',
    roomCode: roomCode,
    roomName: roomDisplayName,
    playerName: playerName,
    isHost: true,
    players: [{ id: client.playerId, name: playerName, isHost: true, ready: false }]
  }));
  
  console.log(`🏠 Room created: ${roomCode} by ${playerName}`);
}

function joinRoomByCode(ws, client, roomCode, playerName) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  const playerData = {
    id: client.playerId,
    name: playerName,
    isHost: false,
    ready: false,
    position: { x: 0, y: 0, z: 0 }
  };
  
  room.players.set(ws, playerData);
  client.roomCode = roomCode;
  client.playerName = playerName;
  
  // বর্তমান প্লেয়ারদের লিস্ট
  const playersList = Array.from(room.players.values()).map(p => ({
    id: p.id,
    name: p.name,
    isHost: p.isHost,
    ready: p.ready
  }));
  
  ws.send(JSON.stringify({
    type: 'room_joined',
    roomCode: roomCode,
    roomName: room.name,
    playerName: playerName,
    isHost: false,
    players: playersList
  }));
  
  // অন্যদের জানানো
  broadcastToRoom(roomCode, {
    type: 'player_joined',
    playerId: client.playerId,
    playerName: playerName,
    players: playersList
  });
  
  console.log(`👥 ${playerName} joined room ${roomCode}`);
}

function broadcastToRoom(roomCode, message, excludeWs = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  for (let [clientWs] of room.players) {
    if (clientWs !== excludeWs && clientWs.readyState === 1) {
      clientWs.send(messageStr);
    }
  }
}

// npm install ws uuid চালান
