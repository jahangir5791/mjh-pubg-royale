// apps/web/router.js

// খুব সিম্পল client-side router ডমিন
function handleRoute(path) {
  const $status = document.getElementById('status');

  if (path === '/' || path === '') {
    $status.textContent = 'Home page';
  } else if (path.startsWith('/room/')) {
    const roomCode = path.split('/').pop();
    $status.textContent = `Playing in room ${roomCode}`;
  } else {
    $status.textContent = 'Page not found';
  }
}

export function init() {
  const handlePopstate = () => {
    handleRoute(window.location.pathname);
  };
  window.addEventListener('popstate', handlePopstate);
  handlePopstate(); // initial load
}

// লিঙ্ক ক্লিকের সময় pushState করে
export function navigate(href) {
  history.pushState(null, null, href);
  handleRoute(window.location.pathname);
}
