// AI Hint System for 2048 - Phase 2
// Uses expectimax-inspired greedy evaluation

function evaluateBoard(grid) {
  let score = 0;
  const n = grid.length;
  // Monotonicity: reward boards where values decrease from corner
  const weights = [];
  for (let r = 0; r < n; r++) {
    weights.push([]);
    for (let c = 0; c < n; c++) {
      weights[r].push(Math.pow(0.25, r + c));
    }
  }
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      score += (grid[r][c] || 0) * weights[r][c];
  // Mergeability bonus
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n - 1; c++)
      if (grid[r][c] && grid[r][c] === grid[r][c+1]) score += grid[r][c];
  for (let r = 0; r < n - 1; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] && grid[r][c] === grid[r+1][c]) score += grid[r][c];
  // Empty cells bonus
  let empty = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!grid[r][c]) empty++;
  score += empty * 50;
  return score;
}

function cloneGrid(g) { return g.map(r => [...r]); }

function simulateMove(grid, dir) {
  const n = grid.length;
  let g = cloneGrid(grid);
  let moved = false;
  function slideRow(row) {
    let r = row.filter(x => x);
    for (let i = 0; i < r.length - 1; i++) {
      if (r[i] === r[i+1]) { r[i] *= 2; r[i+1] = 0; moved = true; }
    }
    r = r.filter(x => x);
    while (r.length < n) r.push(0);
    return r;
  }
  if (dir === 'left')  { g = g.map(row => { const s = slideRow(row); if (s.join() !== row.join()) moved=true; return s; }); }
  if (dir === 'right') { g = g.map(row => { const rev = row.slice().reverse(); const s = slideRow(rev); if (s.join() !== rev.join()) moved=true; return s.reverse(); }); }
  if (dir === 'up' || dir === 'down') {
    for (let c = 0; c < n; c++) {
      let col = g.map(r => r[c]);
      if (dir === 'down') col.reverse();
      const s = slideRow(col);
      if (dir === 'down') s.reverse();
      for (let r = 0; r < n; r++) g[r][c] = s[r];
    }
  }
  return { grid: g, moved };
}

function getBestHint(grid) {
  const dirs = ['left','right','up','down'];
  let best = null, bestScore = -Infinity;
  dirs.forEach(dir => {
    const { grid: ng, moved } = simulateMove(grid, dir);
    if (moved) {
      const sc = evaluateBoard(ng);
      if (sc > bestScore) { bestScore = sc; best = dir; }
    }
  });
  return best;
}
