import { redbull } from "./Canvas";
import { fgCtx } from "./Canvas";
import { BaseEntity } from "../server/entities";

enum PowerType {
  SPEED = "speed",
  TELEPORT = "teleport"
}

class PowerObject extends BaseEntity{
  type: PowerType

  constructor(x: number, y: number, color: string, type: PowerType) {
    super(x, y, color, 0); // speed = 0, as power objects dont move
    this.type = type;
  }

  draw() {
    // Ensure the image is loaded before drawing
    fgCtx.drawImage(redbull, this.x, this.y, this.width, this.height);
  }

  checkPlayerCollision(player: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

export const speedObjects: PowerObject[] = [
  new PowerObject(560, 620, "blue", PowerType.SPEED),
  new PowerObject(50, 1420, "blue", PowerType.SPEED),
  new PowerObject(1550, 370, "blue", PowerType.SPEED),
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





