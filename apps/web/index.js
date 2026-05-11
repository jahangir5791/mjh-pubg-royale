// apps/web/index.js

// DOM এলিমেন্ট ধরি
const $status = document.getElementById('status');
const $loading = document.getElementById('loading');

// apiClient এবং router import (যখন file তৈরি হবে)
import * as apiClient from './apiClient.js';
import * as router from './router.js';

// শুরুতে UI সাজাই
function initApp() {
  // online/offline এর event
  window.addEventListener('online', () => {
    $status.textContent = 'Online - Ready to play!';
  });

  window.addEventListener('offline', () => {
    $status.innerHTML = 'Offline mode <br><small>Game will load when online</small>';
  });

  // রাউটার চালু করি
  router.init();
}

// DOM লোড হলে initApp কল
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
