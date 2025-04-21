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

export const powerObjects: PowerObject[] = Array.from({ length: 3 }, () => {
  const randomX = Math.floor(Math.random() * (canvas.width - 32)); // Ensure it fits within canvas
  const randomY = Math.floor(Math.random() * (canvas.height - 32)); // Ensure it fits within canvas
  return new PowerObject(randomX, randomY, "blue");
});
//this function returns the index of the object that the player is colliding with
export function getCollidingPowerObjectIndex(playerX: number, playerY: number, playerWidth: number, playerHeight: number): number | null {
  for (let i = 0; i < powerObjects.length; i++) {
    if (powerObjects[i].isColliding(playerX, playerY, playerWidth, playerHeight)) {
      return i; // Returnere det index spilleren rammer
    }
  }
  return null; // hvis intet er ramt returneres null
}

//This function removes the object that the player is colliding with
export function removePowerObjectAtIndex(index: number): void {
  if (index >= 0 && index < powerObjects.length) {
    powerObjects.splice(index, 1); // Fjerner det object spilleren har ramt
  }
}

