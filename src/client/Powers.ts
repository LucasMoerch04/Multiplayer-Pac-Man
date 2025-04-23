import { redbull } from "./Canvas";
import { fgCtx } from "./Canvas";


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
    // Ensure the image is loaded before drawing
    fgCtx.drawImage(redbull, this.x, this.y, this.width, this.height);
  }

  // Collision detection method
  isColliding(
    playerX: number,
    playerY: number,
    playerWidth: number,
    playerHeight: number
  ): boolean {
    return (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    );
  }
}

export const speedObjects: PowerObject[] = [
  new PowerObject(560, 620, "blue"),
  new PowerObject(50, 1420, "blue"),
  new PowerObject(1550, 370, "blue"),
  // new PowerObject(canvas.width/2, canvas.width/2-100, "blue"),
];

// This function returns the index of the object that the player is colliding with
export function SpeedObjectCollision(
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number
): number | null {
  for (let i = 0; i < speedObjects.length; i++) {
    if (speedObjects[i].isColliding(playerX, playerY, playerWidth, playerHeight)) {
      speedObjects.splice(i, 1);
      return i;
    }
  }
  return -1; // If nothing is hit, return null
}


export const teleportObject: PowerObject[] = [
  new PowerObject(290, 710, "blue"),
  new PowerObject(290+32, 710, "blue"),
  new PowerObject(928, 1350, "blue"),
  new PowerObject(928+32, 1350, "blue"),
];
export function teleportObjectObjectCollision(
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number
): number | null {
  for (let i = 0; i < teleportObject.length; i++) {
    if (teleportObject[i].isColliding(playerX, playerY, playerWidth, playerHeight)) {
      console.log(`Colliding with teleport object at index ${i}:`, i);
      return i;
    }
  }
  return -1;
}





