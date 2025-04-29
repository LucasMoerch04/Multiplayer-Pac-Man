// src/client/pacman_ai.ts

import { aStar, toCell, toPixel } from "./grid";
import type { WalkableGrid } from "./grid";
import type { Pacman, SPlayer } from "../shared/entities";

type Mode = "hunt" | "run";

export class PacmanAI {
  private mode: Mode = "run";

  constructor(
    private pacman: Pacman,
    private grid: WalkableGrid
  ) {}

  /** Enter run mode for durationMs milliseconds */
  setRunMode() {
    this.mode = "run";
  }

  private updateMode() {
    // insert update here
  }

  /** Advance Pac-Man one grid step */
  tick(players: SPlayer[]) {
    this.updateMode();

    const start = toCell(this.pacman.x, this.pacman.y);

    // Choose target pixel
    let goalPixel = { x: this.pacman.x, y: this.pacman.y };
    if (this.mode === "hunt") {
      // nearest player
      let best = players[0], bestD = Infinity;
      for (const p of players) {
        const d = Math.abs(p.x - this.pacman.x) + Math.abs(p.y - this.pacman.y);
        if (d < bestD) { bestD = d; best = p; }
      }
      goalPixel = { x: best.x, y: best.y };
    } else {
      // farthest corner
      const rows = this.grid.length, cols = this.grid[0].length;
      const corners = [
        toPixel({ row: 0,        col: 0        }),
        toPixel({ row: 0,        col: cols - 1 }),
        toPixel({ row: rows - 1, col: 0        }),
        toPixel({ row: rows - 1, col: cols - 1 }),
      ];
      let bestC = corners[0], bestMin = -Infinity;
      for (const c of corners) {
        const minD = Math.min(
          ...players.map(p => Math.abs(p.x - c.x) + Math.abs(p.y - c.y))
        );
        if (minD > bestMin) { bestMin = minD; bestC = c; }
      }
      goalPixel = bestC;
    }

    const goal = toCell(goalPixel.x, goalPixel.y);
    const path = aStar(this.grid, start, goal);
    if (path && path.length > 1) {
      const next = toPixel(path[1]);
      this.pacman.x = next.x;
      this.pacman.y = next.y;
    }
  }
}
