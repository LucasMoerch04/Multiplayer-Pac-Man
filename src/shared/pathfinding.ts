export const CELL_SIZE = 32;

// Single grid cell coordinate
export interface Cell {
  row: number;
  col: number;
}

/**
 * 2D boolean grid - "true" = walkable, "false" = blocked
 */
export type RectGrid = boolean[][];

/**
 * Convert pixel coordinates to grid cell indices
 */
export function toCell(x: number, y: number): Cell {
  return {
    row: Math.floor(y / CELL_SIZE),
    col: Math.floor(x / CELL_SIZE),
  };
}

/**
 * Convert a grid cell to the top‑left pixel of that cell
 */
export function toPixel(cell: Cell): { x: number; y: number } {
  return {
    x: cell.col * CELL_SIZE,
    y: cell.row * CELL_SIZE,
  };
}

/**
 * Predefined "inner" corners to avoid outer walls: one cell inset
 */
export function getInnerCorners(grid: RectGrid): Cell[] {
  const rows = grid.length;
  const cols = grid[0].length;
  return [
    { row: 1, col: 1 },
    { row: 1, col: cols - 2 },
    { row: rows - 2, col: 1 },
    { row: rows - 2, col: cols - 2 },
  ];
}

// A* pathfinding implementation

interface Node {
  row: number;
  col: number;
  g: number; // cost from start
  f: number; // g + heuristic
  parent?: Node; // previous node in path
}

/**
 * Manhattan distance heuristic
 */
function heuristic(a: Node, b: Node): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Find a shortest path from startCell to goalCell on a RectGrid
 * Returns an array of Cells (including start and goal), or null if no path.
 */
export function aStar(
  grid: RectGrid,
  startCell: Cell,
  goalCell: Cell,
): Cell[] | null {
  const rows = grid.length;
  const cols = grid[0].length;
  const openSet: Node[] = [];
  const closed = new Set<string>();

  // Initialize start node
  openSet.push({
    row: startCell.row,
    col: startCell.col,
    g: 0,
    f: heuristic(
      { row: startCell.row, col: startCell.col, g: 0, f: 0 },
      { row: goalCell.row, col: goalCell.col, g: 0, f: 0 },
    ),
  });

  while (openSet.length > 0) {
    // Pick node with lowest f
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    // If we've reached the goal, reconstruct path
    if (current.row === goalCell.row && current.col === goalCell.col) {
      const path: Cell[] = [];
      let node: Node | undefined = current;
      while (node) {
        path.push({ row: node.row, col: node.col });
        node = node.parent;
      }
      return path.reverse();
    }

    closed.add(`${current.row},${current.col}`);

    // Explore four neighbors
    for (const { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ]) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      const key = `${nr},${nc}`;

      // Skip out-of-bounds, non-walkable, or already closed
      if (
        nr < 0 ||
        nr >= rows ||
        nc < 0 ||
        nc >= cols ||
        !grid[nr][nc] ||
        closed.has(key)
      )
        continue;

      const gScore = current.g + 1;
      const hScore = heuristic(
        { row: nr, col: nc, g: 0, f: 0 },
        { row: goalCell.row, col: goalCell.col, g: 0, f: 0 },
      );
      const fScore = gScore + hScore;

      const existing = openSet.find((n) => n.row === nr && n.col === nc);
      if (existing) {
        // If this path to neighbor is better, update
        if (gScore < existing.g) {
          existing.g = gScore;
          existing.f = fScore;
          existing.parent = current;
        }
      } else {
        // Otherwise add new neighbor
        openSet.push({
          row: nr,
          col: nc,
          g: gScore,
          f: fScore,
          parent: current,
        });
      }
    }
  }

  // No path found
  return null;
}
