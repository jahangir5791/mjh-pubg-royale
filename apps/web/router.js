function updateStatus(text) {
  const $status = document.getElementById('status');
  if ($status) $status.textContent = text;
}

function handleRoute(path) {
  if (path === '/' || path === '') {
    updateStatus('Ready to battle! 💥');
    return;
  }

  if (path.startsWith('/room/')) {
    const roomCode = path.split('/').pop();
    updateStatus(`Playing in room ${roomCode}`);
    return;
  }

  updateStatus('Page not found');
}

export function init() {
  const handlePopstate = () => {
    handleRoute(window.location.pathname);
  };

  window.addEventListener('popstate', handlePopstate);
  handlePopstate();
}

export function navigate(href) {
  history.pushState(null, '', href);
  handleRoute(window.location.pathname);
}
