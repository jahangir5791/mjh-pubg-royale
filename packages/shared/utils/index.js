// packages/shared/utils/index.js

/**
 * Shared utilities used by both web and server
 */

// very simple UUID v4 style id (for demo, not crypto‑safe)
export function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9);
}

export function makeError(code, message, extra = {}) {
  const err = new Error(message);
  err.code = code;
  Object.assign(err, extra);
  return err;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function log(...args) {
  console.log('[shared]', ...args);
}
