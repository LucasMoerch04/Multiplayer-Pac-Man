// mock canvas before any imports
const mockCanvas = {
  width: 1664,
  height: 1664,
  getContext: jest.fn().mockReturnValue({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
  }),
};
Object.defineProperty(global.document, "getElementById", {
  value: jest.fn().mockReturnValue(mockCanvas),
});

import { buildClientGrid } from "../../client/grid";
import { boundaryArray } from "../../client/CollisionBlocks";

test("should build a grid with walkable and non-walkable cells based on boundary data", () => {
  const grid = buildClientGrid();
  expect(grid.length).toBeGreaterThan(0);
  expect(grid[0].length).toBeGreaterThan(0);

  boundaryArray.forEach(({ x, y, width, height }) => {
    const startC = Math.floor(x / 32);
    const endC = Math.floor((x + width) / 32);
    const startR = Math.floor(y / 32);
    const endR = Math.floor((y + height) / 32);

    for (let r = startR; r < endR; r++)
      for (let c = startC; c < endC; c++) {
        expect(grid[r][c]).toBe(false);
      }
  });
});
