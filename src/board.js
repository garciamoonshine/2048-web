class Board2048 {
  constructor(size = SIZE) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(0));
    this.score = 0;
    this.moved = false;
  }

  clone() {
    const b = new Board2048(this.size);
    b.grid = this.grid.map(r => [...r]);
    b.score = this.score;
    return b;
  }

  spawnTile() {
    const empty = [];
    this.grid.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
    if (!empty.length) return null;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c, val: this.grid[r][c], isNew: true };
  }

  slideRow(row) {
    let arr = row.filter(v => v);
    const merged = [];
    let gained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i+1]) {
        arr[i] *= 2;
        gained += arr[i];
        arr[i+1] = 0;
        merged.push(i);
        i++;
      }
    }
    arr = arr.filter(v => v);
    while (arr.length < this.size) arr.push(0);
    return { row: arr, gained, merged };
  }

  move(dir) {
    let totalGained = 0;
    let changed = false;
    const rotate = (g) => g[0].map((_, c) => g.map(row => row[c]).reverse());
    const rotations = { left: 0, up: 1, right: 2, down: 3 };
    let g = this.grid.map(r => [...r]);
    const times = rotations[dir];
    for (let t = 0; t < times; t++) g = rotate(g);
    g = g.map(row => {
      const res = this.slideRow(row);
      if (res.row.join(',') !== row.join(',')) changed = true;
      totalGained += res.gained;
      return res.row;
    });
    const backTimes = (4 - times) % 4;
    for (let t = 0; t < backTimes; t++) g = rotate(g);
    if (changed) {
      this.grid = g;
      this.score += totalGained;
    }
    this.moved = changed;
    return changed;
  }

  hasWon() {
    return this.grid.some(row => row.some(v => v >= 2048));
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) return true;
        if (c+1 < this.size && this.grid[r][c] === this.grid[r][c+1]) return true;
        if (r+1 < this.size && this.grid[r][c] === this.grid[r+1][c]) return true;
      }
    }
    return false;
  }
}