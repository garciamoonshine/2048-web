class InputHandler2048 {
  constructor(game) {
    this.game = game;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.swipeMin = 30;
    this.init();
  }

  init() {
    document.addEventListener('keydown', e => {
      const dirs = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
      if (dirs[e.key]) { e.preventDefault(); this.game.move(dirs[e.key]); }
      if (e.key === 'z' || e.key === 'Z') this.game.undo();
    });

    const board = document.getElementById('board-wrap');
    board.addEventListener('touchstart', e => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    board.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      const dy = e.changedTouches[0].clientY - this.touchStartY;
      const absDx = Math.abs(dx), absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < this.swipeMin) return;
      if (absDx > absDy) this.game.move(dx > 0 ? 'right' : 'left');
      else this.game.move(dy > 0 ? 'down' : 'up');
    }, { passive: true });
  }
}