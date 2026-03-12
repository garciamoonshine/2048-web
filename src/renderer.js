class Renderer2048 {
  constructor(boardEl) {
    this.boardEl = boardEl;
    this.tileSize = 0;
  }

  render(grid, newPos = null, mergedPositions = []) {
    this.boardEl.innerHTML = '';
    const wrap = this.boardEl.parentElement;
    const sz = Math.floor((wrap.offsetWidth - 20) / SIZE) - 10;
    this.tileSize = sz;

    grid.forEach((row, r) => {
      row.forEach((val, c) => {
        // background cell
        const cell = document.createElement('div');
        cell.className = 'cell';
        this.boardEl.appendChild(cell);

        if (!val) return;
        const tile = document.createElement('div');
        tile.className = 'tile';
        const { bg, fg } = tileColor(val);
        tile.style.cssText = `
          background:${bg};
          color:${fg};
          font-size:${tileFontSize(val)};
          width:${sz}px;height:${sz}px;
          left:${c*(sz+10)+10}px;
          top:${r*(sz+10)+10}px;
        `;
        tile.textContent = val;
        const isNew = newPos && newPos.r===r && newPos.c===c;
        const isMerged = mergedPositions.some(p => p.r===r && p.c===c);
        if (isNew) tile.classList.add('new');
        if (isMerged) tile.classList.add('merged');
        this.boardEl.appendChild(tile);
      });
    });
  }

  updateScore(score, best) {
    document.getElementById('score').textContent = score;
    document.getElementById('best').textContent = best;
  }

  showGameOver(won) {
    document.getElementById('over-title').textContent = won ? '🎉 You Win!' : 'Game Over!';
    document.getElementById('over-score').textContent = won ? 'You reached 2048!' : 'No more moves!';
    document.getElementById('game-over').classList.remove('hidden');
  }

  hideGameOver() {
    document.getElementById('game-over').classList.add('hidden');
  }
}