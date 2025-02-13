const grid = [
  [true, false, true, false, false],
  [true, false, false, false,false],
  [true, false, true, false, true],
  [true, false, false, true, false],
];

const visited: boolean[][] = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));

// 8방향 탐색 (상하좌우 + 대각선)
const dx = [-1, -1, -1, 0, 0, 1, 1, 1];
const dy = [-1, 0, 1, -1, 1, -1, 0, 1];

function dfs(grid: boolean[][], visited: boolean[][], x: number, y: number) {
  const n = grid.length;
  const m = grid[0].length;

  visited[x][y] = true;

  // 8방향 탐색
  for (let i = 0; i < 8; i++) {
      const nx = x + dx[i];
      const ny = y + dy[i];

      if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;

      if (!visited[nx][ny] && grid[nx][ny]) {
          dfs(grid, visited, nx, ny);
      }
  }
}

function getNumberOfIsland() {
  let islands = 0;
  const n = grid.length;
  const m = grid[0].length;

  // 1을 만나면 시작
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (grid[i][j] && !visited[i][j]) {
                dfs(grid, visited, i, j);
                islands++;
            }
        }
    }
    return islands;
}

console.log('result: ', getNumberOfIsland());
