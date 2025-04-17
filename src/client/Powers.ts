const canvas: HTMLCanvasElement = document.getElementById(
    "gameState",) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;


class PowerObject {
  public leftBorder: number = 0;
  public rightBorder: number = 0;
  public topBorder: number = 0;
  public bottomBorder: number = 0;
  public width: number = 32;
  public height: number = 32;
  public x: number;
  public y: number;
  public color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  drawObject() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  // Collision detection method
  isColliding(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }
}

// Ensure canvas dimensions are set

const canvasWidth = 1664; // Define canvas dimensions
const canvasHeight = 1664;

export const powerObjects: PowerObject[] = Array.from({ length: 3 }, () => {
  const randomX = Math.floor(Math.random() * (canvasWidth - 32)); // Ensure it fits within canvas
  const randomY = Math.floor(Math.random() * (canvasHeight - 32)); // Ensure it fits within canvas
  return new PowerObject(randomX, randomY, "blue");
});



