export const CELL_SIZE = 32;
export interface Cell { row: number; col: number; }
export type RectGrid = boolean[][];
// Map canvas coords and grid cells
export function toCell(x: number, y: number) {
    return { row: Math.floor(y / CELL_SIZE), col: Math.floor(x / CELL_SIZE) };
  }
  export function toPixel(cell: { row: number; col: number }) {
    return { x: cell.col * CELL_SIZE, y: cell.row * CELL_SIZE };
  }
  
  // Implement pathfinding
  interface Node {
    row: number;
    col: number;
    g: number;
    f: number;
    parent?: Node;
  }
  function heuristic(a: Node, b: Node) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }
  
  export function aStar(
    grid: boolean[][],
    startCell: { row: number; col: number },
    goalCell: { row: number; col: number },
  ): { row: number; col: number }[] | null {
    const rows = grid.length;
    const cols = grid[0].length;
    const openSet: Node[] = [];
    const closed = new Set<string>();
  
    const startNode: Node = {
      row: startCell.row,
      col: startCell.col,
      g: 0,
      f: heuristic(
        { row: startCell.row, col: startCell.col, g: 0, f: 0 },
        { row: goalCell.row, col: goalCell.col, g: 0, f: 0 },
      ),
    };
    openSet.push(startNode);
  
    while (openSet.length > 0) {
      // Sort by lowest f-score, pop best
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
  
      // Goal reached: reconstruct path
      if (current.row === goalCell.row && current.col === goalCell.col) {
        const path: { row: number; col: number }[] = [];
        let node: Node | undefined = current;
        while (node) {
          path.push({ row: node.row, col: node.col });
          node = node.parent;
        }
        return path.reverse();
      }
  
      closed.add(`${current.row},${current.col}`);
  
      // Explore neighbors: up, down, left, right
      const deltas = [
        { dr: -1, dc: 0 },
        { dr: 1, dc: 0 },
        { dr: 0, dc: -1 },
        { dr: 0, dc: 1 },
      ];
      for (const { dr, dc } of deltas) {
        const nr = current.row + dr;
        const nc = current.col + dc;
        if (
          nr < 0 ||
          nr >= rows ||
          nc < 0 ||
          nc >= cols ||
          !grid[nr][nc] ||
          closed.has(`${nr},${nc}`)
        )
          continue;
  
        const gScore = current.g + 1;
        const existing = openSet.find((n) => n.row === nr && n.col === nc);
        const hScore = heuristic(
          { row: nr, col: nc, g: 0, f: 0 },
          { row: goalCell.row, col: goalCell.col, g: 0, f: 0 },
        );
        const fScore = gScore + hScore;
  
        if (existing) {
          if (gScore < existing.g) {
            existing.g = gScore;
            existing.f = fScore;
            existing.parent = current;
          }
        } else {
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