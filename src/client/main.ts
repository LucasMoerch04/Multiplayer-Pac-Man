import { io } from "socket.io-client";
import "./CollisionBlocks";
import "./Collisionstext";
import "./Powers";
import "./Canvas";
import "./style.css";

import { SPlayer, Pacman } from "../shared/entities";
import { boundaryArray } from "./CollisionBlocks";
import { fgCtx, fgCanvas } from "./Canvas";
import {
  SpeedObjectCollision,
  speedObjects,
  teleportObjectCollision,
  cherryObjects,
  cherryObjectCollision
} from "./Powers";

import { buildClientGrid } from "./grid";
import { PacmanAI } from "./pacmanAI";

export const socket = io();

// On connect, announce and register
socket.on("connect", () => {
  console.log("Connected with id", socket.id);
  socket.emit("newUser");
});

// Show connected count
socket.on("updateCounter", (data) => {
  (document.getElementById("userCounter")! as HTMLElement).innerText =
    `Users Connected: ${data.countUsers}`;
});

// Store all remote players and Pac-Man
const frontEndPlayers: { [key: string]: SPlayer } = {};
const frontEndPacMan: Pacman[] = [];

// Build collision grid & instantiate local Pac-Man + AI
const walkableGrid = buildClientGrid();
const localPac = new Pacman(816, 816, "pacman", 5);
frontEndPacMan[0] = localPac;
const pacmanAI = new PacmanAI(localPac, walkableGrid);

// If server forces Pac-Man position, override AI
socket.on("updatePacMan", (pos: { x: number; y: number }) => {
  if (!frontEndPacMan[0]) {
    frontEndPacMan[0] = new Pacman(pos.x, pos.y, "pacman", 5);
  } else {
    frontEndPacMan[0].x = pos.x;
    frontEndPacMan[0].y = pos.y;
  }
});

// Log when Pac-Man is eaten globally
socket.on("pacManEaten", (playerId: string) => {
  console.log(`Server: Pac-Man eaten by ${playerId}`);
});

// Keep remote players up to date
socket.on(
  "updatePlayers",
  (
    backendPlayers: Record<
      string,
      { x: number; y: number; color: string; speed: number }
    >,
  ) => {
    for (const id in backendPlayers) {
      const p = backendPlayers[id];
      if (!frontEndPlayers[id]) {
        frontEndPlayers[id] = new SPlayer(p.x, p.y, p.color, p.speed);
      } else {
        frontEndPlayers[id].x = p.x;
        frontEndPlayers[id].y = p.y;
        frontEndPlayers[id].speed = p.speed;
      }
    }
    for (const id in frontEndPlayers) {
      if (!(id in backendPlayers)) delete frontEndPlayers[id];
    }
  },
);

// Main AI loop: step AI, emit its move, redraw
setInterval(() => {
  pacmanAI.tick(Object.values(frontEndPlayers));
  socket.emit("pacmanMove", { x: localPac.x, y: localPac.y });
  animate();
}, 1000 / 60);

// Local Pac-Man eat detection
window.addEventListener("pacmanEatenLocally", () => {
  socket.emit("eatPacman", socket.id);
});

// Continuous player‐movement setup
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      currentDirection = "up";
      break;
    case "s":
    case "ArrowDown":
      currentDirection = "down";
      break;
    case "a":
    case "ArrowLeft":
      currentDirection = "left";
      break;
    case "d":
    case "ArrowRight":
      currentDirection = "right";
      break;
    case "0":
      currentDirection = null;
      break;
  }
});

let currentDirection: "up" | "down" | "left" | "right" | null = null;
let sequenceNumber = 0;

setInterval(() => {
  if (!socket.id) return;
  const player = frontEndPlayers[socket.id];
  if (!player) return;

  if (currentDirection) {
    // compute dx, dy for exactly one step in that direction
    let dx = 0,
      dy = 0;
    switch (currentDirection) {
      case "up":
        dy = -player.speed;
        break;
      case "down":
        dy = player.speed;
        break;
      case "left":
        dx = -player.speed;
        break;
      case "right":
        dx = player.speed;
        break;
    }

    // if the next step collides, stop continuous movement
    if (player.checkCollision(currentDirection, boundaryArray)) {
      currentDirection = null;
      return;
    }

    if (player.checkCollisionWithPacman(frontEndPacMan[0])) {
      socket.emit("eatPacman", socket.id);
    }

    //This is constantly checking if a player has collided with a object and if so it returns the index of the object
    const collidingSpeedObjectIndex = SpeedObjectCollision(player);
    if (collidingSpeedObjectIndex !== null && collidingSpeedObjectIndex >= 0) {
      socket.emit("speedBoost", true, collidingSpeedObjectIndex);
      
    }
    
    //Returns the index of the Teleporter Object the player is colliding with
    const collidingTeleportObjectIndex = teleportObjectCollision(player);
    if (
      collidingTeleportObjectIndex !== null && collidingTeleportObjectIndex >= 0) {
      socket.emit("Teleport", collidingTeleportObjectIndex);
    }
    const collidingCherryObjectIndex = cherryObjectCollision(player);
    if (
      collidingCherryObjectIndex !== null && collidingCherryObjectIndex >= 0) {
      socket.emit("CherryCollision", collidingCherryObjectIndex);
    }

    // otherwise move, emit, redraw
    player.x += dx;
    player.y += dy;
    socket.emit("keydown", {
      keycode: "key" + currentDirection[0].toUpperCase(),
      sequenceNumber: ++sequenceNumber,
    });
    animate();
  }
}, 1000 / 60);

export function animate() {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

  // Draw Pac-Man
  const pacman = frontEndPacMan[0];
  if (pacman) {
    pacman.draw();
  }

  // Draw players
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw();
    frontEndPlayers[id].draw();
  }

  // Draw power-ups
  speedObjects.forEach((o) => o.draw());
  cherryObjects.forEach((o) => o.draw());
}

socket.on("deleteSpeedObject", (index: number) => {
  console.log("Received deleteSpeedObject event with index:", index);

  // Remove the speed object from the array
  speedObjects.splice(index, 1);
});

socket.on("deleteCherryObject", (index: number) => {
  console.log("Received deleteCherryObject event with index:", index);

  // Remove the speed object from the array
  cherryObjects.splice(index, 1);
});