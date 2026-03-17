// 2048 - Enhanced Phase 2
let N = 4, grid = [], prev = null, score = 0, best = 0, moveCount = 0;

const COLORS = {
  0:['#ccc0b4','#776e65'], 2:['#eee4da','#776e65'], 4:['#ede0c8','#776e65'],
  8:['#f2b179','#f9f6f2'], 16:['#f59563','#f9f6f2'], 32:['#f67c5f','#f9f6f2'],
  64:['#f65e3b','#f9f6f2'], 128:['#edcf72','#f9f6f2'], 256:['#edcc61','#f9f6f2'],
  512:['#edc850','#f9f6f2'], 1024:['#edc53f','#f9f6f2'], 2048:['#edc22e','#f9f6f2'],
  4096:['#3c3a32','#f9f6f2'], 8192:['#3c3a32','#f9f6f2']
};

function init() {
  N = parseInt(document.getElementById('grid-select').value);
  grid = Array.from({length:N}, () => Array(N).fill(0));
  score = 0; moveCount = 0; prev = null;
  best = parseInt(localStorage.getItem('2048best_'+N)) || 0;
  addTile(); addTile();
  render();
  document.getElementById('hint-display').textContent = '';
}

function addTile() {
  const empty = [];
  for (let r=0;r<N;r++) for (let c=0;c<N;c++) if (!grid[r][c]) empty.push([r,c]);
  if (!empty.length) return false;
  const [r,c] = empty[Math.floor(Math.random()*empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function render() {
  const board = document.getElementById('game-board');
  const tileSize = Math.min(90, Math.floor(360/N));
  board.style.gridTemplateColumns = `repeat(${N},${tileSize}px)`;
  board.innerHTML = '';
  for (let r=0;r<N;r++) for (let c=0;c<N;c++) {
    const v = grid[r][c];
    const [bg,fg] = COLORS[Math.min(v,8192)] || ['#3c3a32','#f9f6f2'];
    const fs = tileSize > 70 ? (v > 512 ? 20 : v > 64 ? 24 : 28) : (v > 512 ? 14 : v > 64 ? 16 : 20);
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.cssText = `width:${tileSize}px;height:${tileSize}px;background:${bg};color:${fg};font-size:${fs}px;`;
    tile.textContent = v || '';
    board.appendChild(tile);
  }
  document.getElementById('score').textContent = score;
  if (score > best) { best = score; localStorage.setItem('2048best_'+N, best); }
  document.getElementById('best').textContent = best;
  document.getElementById('move-counter').textContent = 'Moves: ' + moveCount;
}

function slideLeft(row) {
  let r = row.filter(x=>x), gained = 0;
  for (let i=0;i<r.length-1;i++) if(r[i]===r[i+1]){ gained+=r[i]*2; r[i]*=2; r[i+1]=0; }
  r = r.filter(x=>x);
  while(r.length<N) r.push(0);
  return {row:r, gained};
}

function move(dir) {
  prev = grid.map(r=>[...r]);
  let prevScore = score;
  let moved = false;
  const g = grid.map(r=>[...r]);
  if (dir==='left')  { g.forEach((row,i)=>{ const {row:nr,gained}=slideLeft(row); if(nr.join()!==row.join())moved=true; g[i]=nr; score+=gained; }); }
  if (dir==='right') { g.forEach((row,i)=>{ const rev=row.slice().reverse(); const {row:nr,gained}=slideLeft(rev); if(nr.join()!==rev.join())moved=true; g[i]=nr.reverse(); score+=gained; }); }
  if (dir==='up')    { for(let c=0;c<N;c++){ const col=g.map(r=>r[c]); const {row:nr,gained}=slideLeft(col); nr.forEach((v,r)=>{ if(v!==col[r])moved=true; g[r][c]=v; }); score+=gained; } }
  if (dir==='down')  { for(let c=0;c<N;c++){ const col=g.map(r=>r[c]).reverse(); const {row:nr,gained}=slideLeft(col); nr.reverse().forEach((v,r)=>{ if(v!==g[r][c])moved=true; g[r][c]=v; }); score+=gained; } }
  if (!moved) { prev = null; return; }
  grid = g; moveCount++;
  if (!addTile()) checkGameOver();
  document.getElementById('hint-display').textContent = '';
  render();
}

function undo() {
  if (!prev) return;
  grid = prev; prev = null; render();
}

function checkGameOver() {
  for (let r=0;r<N;r++) for (let c=0;c<N;c++) {
    if (!grid[r][c]) return;
    if (c+1<N && grid[r][c]===grid[r][c+1]) return;
    if (r+1<N && grid[r][c]===grid[r+1][c]) return;
  }
  setTimeout(()=>alert(`Game Over! Score: ${score}`), 100);
}

document.getElementById('grid-select').addEventListener('change', init);
document.getElementById('newBtn').addEventListener('click', init);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('hintBtn').addEventListener('click', () => {
  const hint = getBestHint(grid);
  const arrows = {left:'←',right:'→',up:'↑',down:'↓'};
  document.getElementById('hint-display').textContent = hint ? `💡 Suggested: ${arrows[hint]} ${hint.toUpperCase()}` : 'No moves available!';
});

document.addEventListener('keydown', e => {
  const map = {ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
  if (map[e.key]) { move(map[e.key]); e.preventDefault(); }
});

// Touch swipe
let tx0, ty0;
document.getElementById('game-board').addEventListener('touchstart', e => { tx0=e.touches[0].clientX; ty0=e.touches[0].clientY; }, {passive:true});
document.getElementById('game-board').addEventListener('touchend', e => {
  const dx=e.changedTouches[0].clientX-tx0, dy=e.changedTouches[0].clientY-ty0;
  if (Math.abs(dx)>Math.abs(dy)) move(dx>0?'right':'left');
  else move(dy>0?'down':'up');
});

init();
