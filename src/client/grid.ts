// src/client/grid.ts

import { boundaryArray, Boundaries } from "./CollisionBlocks";
import { toCell, toPixel, aStar, CELL_SIZE } from "../shared/pathfinding";
import { canvasHeight, canvasWidth } from "./Canvas";

export type WalkableGrid = boolean[][];

// Construct a walkable grid from collision blocks
export function buildClientGrid(): WalkableGrid {
  const cols = Math.floor(canvasWidth / CELL_SIZE);
  const rows = Math.floor(canvasHeight / CELL_SIZE);
  const grid: WalkableGrid = Array(rows)
    .fill(0)
    .map(() => Array(cols).fill(true));

  for (const b of boundaryArray as Boundaries[]) {
    const startC = Math.floor(b.x / CELL_SIZE);
    const endC = Math.floor((b.x + b.width) / CELL_SIZE);
    const startR = Math.floor(b.y / CELL_SIZE);
    const endR = Math.floor((b.y + b.height) / CELL_SIZE);
    for (let r = startR; r < endR; r++) {
      for (let c = startC; c < endC; c++) {
        grid[r][c] = false;
      }
    }
  }
  console.log("grid size:", rows, "x", cols);

  return grid;
}

export { toCell, toPixel, aStar, CELL_SIZE };
