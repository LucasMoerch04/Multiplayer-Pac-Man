import { aStar, toCell, toPixel } from "./grid";
import type { WalkableGrid } from "./grid";
import type { Pacman, SPlayer } from "../shared/entities";

type Mode = "hunt" | "run";

/**
 * PacmanAI is what controls pacman movement, in either "run"-away mode or "hunt" mode
 */
export class PacmanAI {
  // Hard-coded mode here for now:
  public mode: Mode = "run";


  /**
   * @param pacman - the Pac-Man entity to control
   * @param grid - boolean 2D grid of walkable cells
   */
  constructor(
    private pacman: Pacman,
    private grid: WalkableGrid,
  ) {}

  public setHuntMode() {
    this.mode = "hunt";
    console.log("Pacman is in hunt mode");
  }
  public setRunMode() {
    this.mode = "run";
    console.log("Pacman is in run mode");
  }

  /**
   * Called each frame: picks a target based on mode, runs A* to get next step.
   * @param players - array of all active player entities
   */
  tick(players: SPlayer[]) {
    const start = toCell(this.pacman.x, this.pacman.y);
  
    let goalPixel;
  
    if (players.length === 0) {
      // Random movement - look at four neighbors and pick one that’s walkable
      // He just shakes around quickly, but better than standing still
      const deltas = [
        { dr: -1, dc: 0 },
        { dr: 1,  dc: 0 },
        { dr: 0,  dc: -1 },
        { dr: 0,  dc: 1 },
      ];
      const valid = deltas
        .map(d => ({ row: start.row + d.dr, col: start.col + d.dc }))
        .filter(c =>
          c.row >= 0 && c.row < this.grid.length &&
          c.col >= 0 && c.col < this.grid[0].length &&
          this.grid[c.row][c.col]
        );
  
      // if we have at least one option, pick randomly, else stay in place
      if (valid.length > 0) {
        const choice = valid[Math.floor(Math.random() * valid.length)];
        goalPixel = toPixel(choice);
      } else {
        return; // nowhere to go
      }
  
    } else {
      // existing logic
      goalPixel = (this.mode === "hunt")
        ? this.chooseNearestPlayer(players)
        : this.chooseSafeCorner(players);
    }
  
    // Pathfind toward the chosen goal
    const goalCell = toCell(goalPixel.x, goalPixel.y);
    const path = aStar(this.grid, start, goalCell);
    if (!path || path.length < 2) return;
  
    // Move toward next cell center
    const nextCenter = toPixel(path[1]);
    const dx = nextCenter.x - this.pacman.x;
    const dy = nextCenter.y - this.pacman.y;
    const dist = Math.hypot(dx, dy);
  
    if (dist < this.pacman.speed) {
      this.pacman.x = nextCenter.x;
      this.pacman.y = nextCenter.y;
    } else {
      this.pacman.x += (dx / dist) * this.pacman.speed;
      this.pacman.y += (dy / dist) * this.pacman.speed;
    }
  }
  

  /**
   * Find the player nearest to PacMan (Manhattan distance)
   */
  private chooseNearestPlayer(players: SPlayer[]) {
    let closest = players[0];
    let minDist = Infinity;

    for (const p of players) {
      const dist =
        Math.abs(p.x - this.pacman.x) + Math.abs(p.y - this.pacman.y);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }
    return { x: closest.x, y: closest.y };
  }

  /**
   * Pick the corner cell (one tile inset) that maximizes the minimum distance
   * to all players (safest reachable corner)
   */
  private chooseSafeCorner(players: SPlayer[]) {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const maxRow = rows - 1;
    const maxCol = cols - 1;

    // Insets to avoid the outermost wall ring
    const corners = [
      { row: 1, col: 1 },
      { row: 1, col: maxCol - 1 },
      { row: maxRow - 1, col: 1 },
      { row: maxRow - 1, col: maxCol - 1 },
    ];

    let bestCorner = corners[0];
    let bestSafety = -Infinity;

    for (const cell of corners) {
      const { x, y } = toPixel(cell);
      // find the closest player to this corner
      const closestDist = Math.min(
        ...players.map((p) => Math.abs(p.x - x) + Math.abs(p.y - y)),
      );
      if (closestDist > bestSafety) {
        bestSafety = closestDist;
        bestCorner = cell;
      }
    }

    return toPixel(bestCorner);
  }
}
