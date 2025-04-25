const canvas: HTMLCanvasElement = document.getElementById(
  "gameState",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  updateBorders(): void;
  draw(): void;
  initialize(): void;
  checkCollision(direction: string, boundaries: any[]): boolean;
}

abstract class BaseEntity implements Entity {
  public x: number;
  public y: number;
  public width: number = 32;
  public height: number = 32;
  public color: string;
  public speed: number;
  public leftBorder: number = 0;
  public rightBorder: number = 0;
  public topBorder: number = 0;
  public bottomBorder: number = 0;

  constructor(x: number, y: number, color: string, speed: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.updateBorders();
  }

  updateBorders() {
    this.leftBorder = this.x;
    this.rightBorder = this.x + this.width;
    this.topBorder = this.y;
    this.bottomBorder = this.y + this.height;
  }

  draw() {
    this.updateBorders();
  }

  initialize() {
    const characterTexture = new Image();
      switch (this.color) {
        case "yellow":
          characterTexture.src = "../game-assets/ghostYellow.png";
          break;
        case "blue":
          characterTexture.src = "../game-assets/ghostBlue.png";
          break;
        case "aqua":
          characterTexture.src = "../game-assets/ghostAqua.png";
          break;
        case "pink":
          characterTexture.src = "../game-assets/ghostPink.png";
          break;
        case "white":
          characterTexture.src = "../game-assets/ghostWhite.png";
          break;
        case "pacman":
          characterTexture.src = "../game-assets/pacMan.png";
          break;
        default:
          characterTexture.src = "../game-assets/ghostRed.png";
          break;
      }
    if (characterTexture.complete) {
      ctx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
    } else {
      characterTexture.onload = () => {
        ctx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
      };
    }
  }

  checkCollision(direction: string, boundaries: any[]): boolean {
    for (const boundary of boundaries) {
      switch (direction) {
        case "right":
          if (
            this.x + this.width + this.speed >= boundary.x &&
            this.x <= boundary.x + boundary.width &&
            this.y + this.height >= boundary.y &&
            this.y <= boundary.y + boundary.height
          )
            return true;
          break;
        case "left":
          if (
            this.x - this.speed <= boundary.x + boundary.width &&
            this.x + this.width >= boundary.x &&
            this.y + this.height >= boundary.y &&
            this.y <= boundary.y + boundary.height
          )
            return true;
          break;
        case "up":
          if (
            this.y - this.speed <= boundary.y + boundary.height &&
            this.y + this.height >= boundary.y &&
            this.x + this.width >= boundary.x &&
            this.x <= boundary.x + boundary.width
          )
            return true;
          break;
        case "down":
          if (
            this.y + this.height + this.speed >= boundary.y &&
            this.y <= boundary.y + boundary.height &&
            this.x + this.width >= boundary.x &&
            this.x <= boundary.x + boundary.width
          )
            return true;
          break;
      }
    }
    return false;
  }
}

export class SPlayer extends BaseEntity {
  constructor(x: number, y: number, color: string, speed: number) {
    super(x, y, color, speed);
  }

  checkCollisionWithPacman(pacman: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return (
      this.x < pacman.x + pacman.width &&
      this.x + this.width > pacman.x &&
      this.y < pacman.y + pacman.height &&
      this.y + this.height > pacman.y
    );
  }
}

export class Pacman extends BaseEntity {
  constructor(x: number, y: number, color: string, speed: number) {
    super(x, y, color, speed);
  }
}

export class powerUps extends BaseEntity {
  constructor(x: number, y: number, color: string, speed: number) {
    super(x, y, color, speed);

    
  }
}