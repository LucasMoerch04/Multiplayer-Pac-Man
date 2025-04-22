const canvas: HTMLCanvasElement = document.getElementById(
  "gameState",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export class Pacman {
  public leftBorder: number = 0;
  public rightBorder: number = 0;
  public topBorder: number = 0;
  public bottomBorder: number = 0;
  public width: number = 32;
  public height: number = 32;
  public x: number;
  public y: number;
  public color: string;
  public speed: number = 5; // Default speed, can be changed later

  constructor(x: number, y: number, color: string, speed: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = speed;
    this.updateBorders();
  }

  updateBorders() {
    // Update the borders to match the position and size of Pacman
    this.leftBorder = this.x;
    this.rightBorder = this.x + this.width;
    this.topBorder = this.y;
    this.bottomBorder = this.y + this.height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.updateBorders();
  }

  drawCharacter() {
    const characterTexture = new Image();
    characterTexture.src = "../game-assets/inky.png";
    if (characterTexture.complete) {
      ctx.drawImage(characterTexture, this.x, this.y, this.width, this.height);
    } else {
      characterTexture.onload = () => {
        ctx.drawImage(
          characterTexture,
          this.x,
          this.y,
          this.width,
          this.height,
        );
      };
    }
  }

  // Check for collisions with the boundaries in a specific direction
  checkCollision(
    direction: "up" | "down" | "left" | "right",
    boundaries: { x: number; y: number; width: number; height: number }[],
  ): boolean {
    for (const boundary of boundaries) {
      switch (direction) {
        case "up":
          if (
            this.y - this.speed < boundary.y + boundary.height &&
            this.y > boundary.y &&
            this.x + this.width > boundary.x &&
            this.x < boundary.x + boundary.width
          ) {
            return true;
          }
          break;

        case "down":
          if (
            this.y + this.height + this.speed > boundary.y &&
            this.y + this.height < boundary.y + boundary.height &&
            this.x + this.width > boundary.x &&
            this.x < boundary.x + boundary.width
          ) {
            return true;
          }
          break;

        case "left":
          if (
            this.x - this.speed < boundary.x + boundary.width &&
            this.x > boundary.x &&
            this.y + this.height > boundary.y &&
            this.y < boundary.y + boundary.height
          ) {
            return true;
          }
          break;

        case "right":
          if (
            this.x + this.width + this.speed > boundary.x &&
            this.x + this.width < boundary.x + boundary.width &&
            this.y + this.height > boundary.y &&
            this.y < boundary.y + boundary.height
          ) {
            return true;
          }
          break;
      }
    }
    return false;
  }
}
