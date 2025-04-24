import { redbull } from "./Canvas";
import { fgCtx } from "./Canvas";
import { BaseEntity } from "../server/entities";

enum PowerType {
  SPEED = "speed",
  TELEPORT = "teleport",
}

class PowerObject extends BaseEntity {
  type: PowerType;

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

// Create new power items on the map
export const speedObjects: PowerObject[] = [
  new PowerObject(560, 620, "blue", PowerType.SPEED),
  new PowerObject(50, 1420, "blue", PowerType.SPEED),
  new PowerObject(1550, 370, "blue", PowerType.SPEED),
  // new PowerObject(canvas.width/2, canvas.width/2-100, "blue"),
];

export const teleportObject: PowerObject[] = [
  new PowerObject(290, 710, "blue", PowerType.TELEPORT),
  new PowerObject(290 + 32, 710, "blue", PowerType.TELEPORT),
  new PowerObject(928, 1350, "blue", PowerType.TELEPORT),
  new PowerObject(928 + 32, 1350, "blue", PowerType.TELEPORT),
];

// This function returns the index of the object that the player is colliding with
export function SpeedObjectCollision(player: {
  x: number;
  y: number;
  width: number;
  height: number;
}): number | null {
  for (let i = 0; i < speedObjects.length; i++) {
    if (speedObjects[i].checkPlayerCollision(player)) {
      speedObjects.splice(i, 1);
      return i;
    }
  }
  return -1; // If nothing is hit, return null
}

export function teleportObjectObjectCollision(player: {
  x: number;
  y: number;
  width: number;
  height: number;
}): number | null {
  for (let i = 0; i < teleportObject.length; i++) {
    if (teleportObject[i].checkPlayerCollision(player)) {
      console.log(`Colliding with teleport object at index ${i}:`, i);
      return i;
    }
  }
  return -1;
}
