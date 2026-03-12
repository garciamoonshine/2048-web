class Game2048 {
  constructor() {
    this.board = new Board2048();
    this.renderer = new Renderer2048(document.getElementById('board'));
    this.best = parseInt(localStorage.getItem('2048-best') || '0');
    this.history = [];
    this.won = false;
    this.over = false;
  }

  start() {
    this.board = new Board2048();
    this.board.spawnTile();
    this.board.spawnTile();
    this.history = [];
    this.won = false;
    this.over = false;
    this.renderer.hideGameOver();
    this.render();
  }

  move(dir) {
    if (this.over) return;
    const snapshot = this.board.clone();
    const moved = this.board.move(dir);
    if (!moved) return;
    this.history.push(snapshot);
    if (this.history.length > 10) this.history.shift();
    const newTile = this.board.spawnTile();
    this.updateBest();
    this.render(newTile);
    if (!this.won && this.board.hasWon()) {
      this.won = true;
      setTimeout(() => this.renderer.showGameOver(true), 300);
    } else if (!this.board.canMove()) {
      this.over = true;
      setTimeout(() => this.renderer.showGameOver(false), 300);
    }
  }

  undo() {
    if (!this.history.length) return;
    this.board = this.history.pop();
    this.over = false;
    this.renderer.hideGameOver();
    this.render();
  }

  updateBest() {
    if (this.board.score > this.best) {
      this.best = this.board.score;
      localStorage.setItem('2048-best', this.best);
    }
  }

  render(newTile = null) {
    this.renderer.render(this.board.grid, newTile);
    this.renderer.updateScore(this.board.score, this.best);
  }
}