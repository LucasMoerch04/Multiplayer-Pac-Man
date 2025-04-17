import { characterTexture } from "./Canvas";
const canvas: HTMLCanvasElement = document.getElementById(
    "gameState",) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  
  export class SPlayer {
    public leftBorder: number = 0;
    public rightBorder: number = 0;
    public topBorder: number = 0;
    public bottomBorder: number = 0;
    public width: number = 32;
    public height: number = 32;
    public x: number;
    public y: number;
    public color: string;
    public velocity: number = 5;
  
    constructor(x: number, y: number, color: string) {
      this.x = x;
      this.y = y;
      this.color = color;
    }
  
    updateBorders() {
      this.leftBorder = this.x;
      this.rightBorder = this.x + this.width;
      this.topBorder = this.y;
      this.bottomBorder = this.y + this.height;
    }
  
    // draw() {
    //   ctx.fillStyle = this.color;
    //   ctx.fillRect(this.x, this.y, this.width, this.height);
    //   this.updateBorders();
    // }
  
    drawCharacter() {
      characterTexture.onload = () => {
        ctx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
      }
    }
  
    checkCollision(direction: string, boundaries: any[]): boolean {
      for (const boundary of boundaries) {
        switch (direction) {
          case 'right':
            if (
              this.x + this.width + this.velocity >= boundary.x &&
              this.x <= boundary.x + boundary.width &&
              this.y + this.height >= boundary.y &&
              this.y <= boundary.y + boundary.height
            ) return true;
            break;
          case 'left':
            if (
              this.x - this.velocity <= boundary.x + boundary.width &&
              this.x + this.width >= boundary.x &&
              this.y + this.height >= boundary.y &&
              this.y <= boundary.y + boundary.height
            ) return true;
            break;
          case 'up':
            if (
              this.y - this.velocity <= boundary.y + boundary.height &&
              this.y + this.height >= boundary.y &&
              this.x + this.width >= boundary.x &&
              this.x <= boundary.x + boundary.width
            ) return true;
            break;
          case 'down':
            if (
              this.y + this.height + this.velocity >= boundary.y &&
              this.y <= boundary.y + boundary.height &&
              this.x + this.width >= boundary.x &&
              this.x <= boundary.x + boundary.width
            ) return true;
            break;
        }
      }
      return false;
    }
  }
  
  