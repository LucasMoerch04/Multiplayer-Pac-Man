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
    if (players.length === 0) return; // nothing to do if no players

    const start = toCell(this.pacman.x, this.pacman.y);

    // Determine goal pixel depending on hunt/run mode
    const goalPixel =
      this.mode === "hunt"
        ? this.chooseNearestPlayer(players)
        : this.chooseSafeCorner(players);

    // Convert goal back into cell coordinates and pathfind
    const goalCell = toCell(goalPixel.x, goalPixel.y);
    // Pathfind and get the next cell
    const path = aStar(this.grid, start, goalCell);
    // Return if no path found
    if (!path || path.length < 2) return;

    // Compute the pixel target for the next cell center
    const nextCellCenter = toPixel(path[1]);

    // Calculate a direction vector from current pos to nextCellCenter
    const dx = nextCellCenter.x - this.pacman.x;
    const dy = nextCellCenter.y - this.pacman.y;
    const dist = Math.hypot(dx, dy);

    // If we are already nearly at the center, snap to it
    if (dist < this.pacman.speed) {
      this.pacman.x = nextCellCenter.x;
      this.pacman.y = nextCellCenter.y;
    } else {
      // Otherwise, move by exactly "speed" pixels along that vector
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
