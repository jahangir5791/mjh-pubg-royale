export const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  fire: false,
  mouseX: 0,
  mouseY: 0,
  locked: false,
};

export function initInput(canvas) {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') inputState.forward = true;
    if (e.code === 'KeyS') inputState.backward = true;
    if (e.code === 'KeyA') inputState.left = true;
    if (e.code === 'KeyD') inputState.right = true;
    if (e.code === 'Space') inputState.fire = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') inputState.forward = false;
    if (e.code === 'KeyS') inputState.backward = false;
    if (e.code === 'KeyA') inputState.left = false;
    if (e.code === 'KeyD') inputState.right = false;
    if (e.code === 'Space') inputState.fire = false;
  });

  canvas.addEventListener('click', () => {
    canvas.requestPointerLock?.();
  });

  document.addEventListener('pointerlockchange', () => {
    inputState.locked = document.pointerLockElement === canvas;
  });

  document.addEventListener('mousemove', (e) => {
    if (!inputState.locked) return;
    inputState.mouseX += e.movementX;
    inputState.mouseY += e.movementY;
  });
}
