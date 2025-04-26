import { fgCtx, fgCanvas } from "../client/Canvas";
import { Boundaries } from "../client/CollisionBlocks";

type Direction = 'up' | 'down' | 'left' | 'right';


interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  updateBorders(): void;
  draw(): void;
  initialize(): void;
  checkCollision(direction: Direction, boundaries: Boundaries[]): boolean;
}

export class BaseEntity implements Entity {
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
    fgCtx.fillStyle = this.color;
    fgCtx.fillRect(this.x, this.y, this.width, this.height);
    this.updateBorders();
  }

  initialize() {
    const characterTexture = new Image();
    characterTexture.src = "../game-assets/inky.png";
    if (characterTexture.complete) {
      fgCtx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
    } else {
      characterTexture.onload = () => {
        fgCtx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
      };
    }
  }

  checkCollision(direction: Direction, boundaries: Boundaries[]): boolean {
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
  public camerabox: { x: number; y: number; width: number; height: number };

  constructor(x: number, y: number, color: string, speed: number,
              camerabox: { x: number; y: number, width: number, height: number}) {
    super(x, y, color, speed);
    this.camerabox = {
      x: this.x,
      y: this.y,
      width: 80,
      height: 80,
    };
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
export class cameraBox extends BaseEntity {
  constructor(x: number, y: number) {
    super(x, y, "rgba(0,0,255,0.2)", 0); // Initialize at (0, 0) with a transparent blue color
    
    this.width = 500; // Set width to 80
    this.height = 320; // Set height to 80
  }

  
}


  