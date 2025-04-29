interface Rect { x:number; y:number; width:number; height:number; }
type Direction = "up"|"down"|"left"|"right";

export interface Entity {
  x: number; y: number;
  width: number; height: number;
  color: string; speed: number;

  updateBorders(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  checkCollision(dir: Direction, boundaries: Rect[]): boolean;
}

export class BaseEntity implements Entity {
  public left = 0; public right = 0;
  public top = 0; public bottom = 0;

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public speed: number,
    public width = 32,
    public height = 32
  ) {
    this.updateBorders();
  }

  updateBorders() {
    this.left   = this.x;
    this.right  = this.x + this.width;
    this.top    = this.y;
    this.bottom = this.y + this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.updateBorders();
  }

  checkCollision(dir: Direction, boundaries: Rect[]): boolean {
    const dx = dir === "left"  ? -this.speed
             : dir === "right" ?  this.speed
             : 0;
    const dy = dir === "up"    ? -this.speed
             : dir === "down"  ?  this.speed
             : 0;
    const next: Rect = {
      x: this.x + dx,
      y: this.y + dy,
      width: this.width,
      height: this.height
    };
    return boundaries.some(b =>
      next.x < b.x + b.width &&
      next.x + next.width > b.x &&
      next.y < b.y + b.height &&
      next.y + next.height > b.y
    );
  }
}

export class SPlayer extends BaseEntity {
  // Only overrides collision-with-Pacman
  checkCollisionWithPacman(p: Rect): boolean {
    return (
      this.x < p.x + p.width &&
      this.x + this.width > p.x &&
      this.y < p.y + p.height &&
      this.y + this.height > p.y
    );
  }
}

export class Pacman extends BaseEntity {
  private static texture = Object.assign(new Image(), {
    src: "../game-assets/Pacman.png"
  });

  draw(ctx: CanvasRenderingContext2D) {
    if (Pacman.texture.complete) {
      ctx.drawImage(
        Pacman.texture,
        this.x, this.y,
        this.width, this.height
      );
    } else {
      super.draw(ctx);
    }
  }
}

export class PowerUp extends BaseEntity {
  draw(ctx: CanvasRenderingContext2D) {
    // custom PowerUp rendering here
    super.draw(ctx);
  }
}
