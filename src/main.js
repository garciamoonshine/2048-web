window.addEventListener('DOMContentLoaded', () => {
  const game = new Game2048();
  const input = new InputHandler2048(game);
  game.start();

  document.getElementById('new-btn').addEventListener('click', () => game.start());
  document.getElementById('undo-btn').addEventListener('click', () => game.undo());
  document.getElementById('retry-btn').addEventListener('click', () => game.start());
});