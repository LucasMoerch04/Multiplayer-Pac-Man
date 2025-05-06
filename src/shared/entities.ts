// src/shared/entities.ts
import { fgCtx } from "../client/Canvas";
import { Boundaries } from "../client/CollisionBlocks";

type Direction = "up" | "down" | "left" | "right";

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;

  updateBorders(): void;
  draw(): void;
  checkCollision(direction: Direction, boundaries: Boundaries[]): boolean;
}

// preload all textures into a map
const textures: Record<string, HTMLImageElement> = {
  yellow: Object.assign(new Image(), { src: "/game-assets/ghostYellow.png" }),
  blue: Object.assign(new Image(), { src: "/game-assets/ghostBlue.png" }),
  aqua: Object.assign(new Image(), { src: "/game-assets/ghostAqua.png" }),
  pink: Object.assign(new Image(), { src: "/game-assets/ghostPink.png" }),
  white: Object.assign(new Image(), { src: "/game-assets/ghostWhite.png" }),
  pacman: Object.assign(new Image(), { src: "/game-assets/pacMan.png" }),
  red: Object.assign(new Image(), { src: "/game-assets/ghostRed.png" }),
};

export class BaseEntity implements Entity {
  public left = 0;
  public right = 0;
  public top = 0;
  public bottom = 0;

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public speed: number,
    public width: number = 32,
    public height: number = 32,
  ) {
    this.updateBorders();
  }

  updateBorders() {
    this.left = this.x;
    this.right = this.x + this.width;
    this.top = this.y;
    this.bottom = this.y + this.height;
  }

  draw() {
    // update our bounding box first
    this.updateBorders();

    // pick the right texture (or fallback to a solid fill)
    const img = textures[this.color];
    if (img && img.complete) {
      fgCtx.drawImage(img, this.x, this.y, this.width, this.height);
    } else {
      // fallback rectangle
      fgCtx.fillStyle = this.color;
      fgCtx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  checkCollision(dir: Direction, boundaries: Boundaries[]): boolean {
    let dx = 0;
    let dy = 0;
    
    if (dir === "left") {
      dx = -this.speed;
    } else if (dir === "right") {
      dx = this.speed;
    }
    
    if (dir === "up") {
      dy = -this.speed;
    } else if (dir === "down") {
      dy = this.speed;
    }
    

    // simulate next frame's box
    const next = {
      x: this.x + dx,
      y: this.y + dy,
      width: this.width,
      height: this.height,
    };

    return boundaries.some(
      (b) =>
        next.x < b.x + b.width &&
        next.x + next.width > b.x &&
        next.y < b.y + b.height &&
        next.y + next.height > b.y,
    );
  }
}

export class SPlayer extends BaseEntity {
  constructor(x: number, y: number, color: string, speed: number) {
    super(x, y, color, speed);
  }

  checkCollisionWithPacman(p: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    return (
      this.x < p.x + p.width &&
      this.x + this.width > p.x &&
      this.y < p.y + p.height &&
      this.y + this.height > p.y
    );
  }
}

export class Pacman extends BaseEntity {
  constructor(x: number, y: number, color: "pacman", speed: number) {
    super(x, y, color, speed);
  }
}

export class PowerUp extends BaseEntity {
  constructor(x: number, y: number, color: string, speed: number) {
    super(x, y, color, speed);
  }
}
