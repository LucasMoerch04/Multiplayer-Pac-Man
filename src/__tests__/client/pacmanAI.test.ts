// Mock document.getElementById for any Canvas imports
const fakeCtx = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
};
const mockCanvas = {
  width: 10,
  height: 10,
  getContext: jest.fn().mockReturnValue(fakeCtx),
};
Object.defineProperty(global.document, "getElementById", {
  value: jest.fn().mockReturnValue(mockCanvas),
});

// Stub non-JS imports so they don’t break on import
jest.mock("../../client/style.css", () => ({}));
jest.mock("../../client/Collisionstext", () => ({
  collisions: [] as number[],
}));

// import the AI and its dependencies
import { PacmanAI } from "../../client/pacmanAI";
import type { WalkableGrid } from "../../client/grid";

interface DummyPacman {
  x: number;
  y: number;
  speed: number;
}
interface DummyPlayer {
  x: number;
  y: number;
}

describe("PacmanAI", () => {
  let grid: WalkableGrid;
  let pac: DummyPacman;
  let ai: PacmanAI;

  beforeEach(() => {
    // 3×3 grid, all cells walkable
    grid = Array(3)
      .fill(0)
      .map(() => Array(3).fill(true));
    // Place Pac-Man at center cell (1,1) → pixel (32,32)
    pac = { x: 32, y: 32, speed: 100 };
    ai = new PacmanAI(pac as any, grid);
  });

  it('defaults to "run" mode', () => {
    expect(ai.mode).toBe("run");
  });

  it('setHuntMode switches to "hunt"', () => {
    ai.setHuntMode();
    expect(ai.mode).toBe("hunt");
  });

  it('setRunMode switches to "run"', () => {
    ai.setHuntMode();
    ai.setRunMode();
    expect(ai.mode).toBe("run");
  });

  it("chooseNearestPlayer returns the nearest player", () => {
    const players: DummyPlayer[] = [
      { x: 64, y: 32 }, // distance = 32
      { x: 32, y: 96 }, // distance = 64
    ];
    const nearest = (ai as any).chooseNearestPlayer(players as any);
    expect(nearest).toEqual({ x: 64, y: 32 });
  });

  it("chooseSafeCorner picks the farthest inset corner", () => {
    // 5×5 grid for corners at (1,1),(1,3),(3,1),(3,3)
    const bigGrid = Array(5)
      .fill(0)
      .map(() => Array(5).fill(true));
    ai = new PacmanAI(pac as any, bigGrid);
    // One player at top-left pixel
    const players: DummyPlayer[] = [{ x: 32, y: 32 }];
    const safe = (ai as any).chooseSafeCorner(players as any);
    // The farthest corner should be (3,3) which is pixel (96,96)
    expect(safe).toEqual({ x: 96, y: 96 });
  });

  it("tick does nothing when no players", () => {
    const before = { x: pac.x, y: pac.y };
    ai.tick([]);
    expect(pac.x).toBe(before.x);
    expect(pac.y).toBe(before.y);
  });

  it("tick does not move when no path exists", () => {
    // block neighbors so A* finds no path
    const blocked: WalkableGrid = [
      [false, false, false],
      [false, true, false],
      [false, false, false],
    ];
    ai = new PacmanAI(pac as any, blocked);
    ai.setHuntMode();
    ai.tick([{ x: 64, y: 32 } as any]);
    expect(pac.x).toBe(32);
    expect(pac.y).toBe(32);
  });

  it("tick moves toward nearest player in hunt mode", () => {
    ai.setHuntMode();
    ai.tick([{ x: 64, y: 32 } as any]);
    expect(pac.x).toBe(64);
    expect(pac.y).toBe(32);
  });

  it("tick moves incrementally when speed < distance", () => {
    pac.speed = 10;
    ai.setHuntMode();
    ai.tick([{ x: 64, y: 32 } as any]);
    expect(pac.x).toBeCloseTo(42);
    expect(pac.y).toBe(32);
  });
});
