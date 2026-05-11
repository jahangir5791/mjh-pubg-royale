// packages/shared/types/index.js

/**
 * Shared game types used by both web and server
 */

export const PLAYER_STATUS = {
  ONLINE: 'online',
  DEAD: 'dead',
  SPECTATING: 'spectating'
};

export const GAME_STATUS = {
  WAITING: 'waiting',
  STARTING: 'starting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished'
};

export const MATCH_PHASE = {
  SAFE_ZONE: 'safe-zone',
  MID_GAME: 'mid-game',
  FINAL_CIRCLE: 'final-circle'
};

export const MESSAGE_TYPE = {
  PLAYER_JOIN: 'player-join',
  PLAYER_LEAVE: 'player-leave',
  MATCH_START: 'match-start',
  MATCH_UPDATE: 'match-update',
  CHAT_MESSAGE: 'chat-message'
};

/**
 * Example rich types; can be refined later
 */
export function definePlayer(id, name, status = PLAYER_STATUS.ONLINE) {
  return { id, name, status };
}

export function defineRoom(id, code, playerCount = 0) {
  return { id, code, playerCount };
}

export function defineGameStatus(status = GAME_STATUS.WAITING, phase = null) {
  return { status, phase };
}

export function defineMatchUpdate(playersRemaining, phase) {
  return { playersRemaining, phase };
}
