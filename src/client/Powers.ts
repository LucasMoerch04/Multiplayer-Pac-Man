import { redbullImage, cherryImage } from "./Canvas";
import { fgCtx } from "./Canvas";
import { BaseEntity } from "../shared/entities";

enum PowerType {
  SPEED = "speed",
  TELEPORT = "teleport",
  CHERRY = "cherry",
}

class PowerObject extends BaseEntity {
  type: PowerType;
  image?: HTMLImageElement;

  constructor(x: number, y: number, type: PowerType, image?: HTMLImageElement) {
    super(x, y, "", 0); // Pass an empty string for color in BaseEntity
    this.type = type;
    this.image = image;
  }

  draw() {
    if (this.image) {
      fgCtx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Optionally, draw a placeholder or do nothing if no image is provided
      fgCtx.fillStyle = "gray"; // Default placeholder color
      fgCtx.fillRect(this.x, this.y, this.width, this.height);
    }
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
  new PowerObject(560, 620, PowerType.SPEED, redbullImage),
  new PowerObject(50, 1420, PowerType.SPEED, redbullImage),
  new PowerObject(1550, 370, PowerType.SPEED, redbullImage),
];

export const teleportObjects: PowerObject[] = [
  new PowerObject(290, 710, PowerType.TELEPORT),
  new PowerObject(290 + 32, 710, PowerType.TELEPORT),
  new PowerObject(928, 1350, PowerType.TELEPORT),
  new PowerObject(928 + 32, 1350, PowerType.TELEPORT),
];
const firstBlock = 32;
const lastBlock = 32 * 50;
export const cherryObjects: PowerObject[] = [
  new PowerObject(firstBlock, firstBlock, PowerType.CHERRY, cherryImage),
  new PowerObject(lastBlock, firstBlock, PowerType.CHERRY, cherryImage),
  new PowerObject(firstBlock, lastBlock, PowerType.CHERRY, cherryImage),
  new PowerObject(lastBlock, lastBlock, PowerType.CHERRY, cherryImage),
];

export const teleportObject: PowerObject[] = [
  new PowerObject(290, 710, PowerType.TELEPORT),
  new PowerObject(290 + 32, 710, PowerType.TELEPORT),
  new PowerObject(928, 1350, PowerType.TELEPORT),
  new PowerObject(928 + 32, 1350, PowerType.TELEPORT),
];

// This function returns the index of the object that the player is colliding with
export function SpeedObjectCollision(player: {
  x: number;
  y: number;
  width: number;
  height: number;
}): number {
  for (let i = 0; i < speedObjects.length; i++) {
    if (speedObjects[i].checkPlayerCollision(player)) {
      return i;
    }
  }
  return -1; // If nothing is hit, return -1
}

export function teleportObjectCollision(player: {
  x: number;
  y: number;
  width: number;
  height: number;
}): number {
  for (let i = 0; i < teleportObjects.length; i++) {
    if (teleportObjects[i].checkPlayerCollision(player)) {
      return i;
    }
  }
  return -1;
}

export function cherryObjectCollision(pacman: {
  x: number;
  y: number;
  width: number;
  height: number;
}): number {
  for (let i = 0; i < cherryObjects.length; i++) {
    if (cherryObjects[i].checkPlayerCollision(pacman)) {
      console.log(`Colliding with cherry object at index ${i}:`, i);
      return i;
    }
  }
  return -1; // If nothing is hit, return -1
}
