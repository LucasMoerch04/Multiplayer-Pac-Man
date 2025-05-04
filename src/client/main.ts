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
  teleportObjectObjectCollision,
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
const localPac = new Pacman(816, 816, "red", 5);
frontEndPacMan[0] = localPac;
const pacmanAI = new PacmanAI(localPac, walkableGrid);

// If server ever forces Pac-Man position, override AI
socket.on("updatePacMan", (pos: { x: number; y: number }) => {
  if (!frontEndPacMan[0]) {
    frontEndPacMan[0] = new Pacman(pos.x, pos.y, "red", 5);
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

// Main loop: step AI, emit its move, redraw
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
const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
window.addEventListener("keydown", (e) => {
  if (["w","a","s","d","ArrowUp","ArrowLeft","ArrowDown","ArrowRight"].includes(e.key)) {
    keys[e.key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (["w","a","s","d","ArrowUp","ArrowLeft","ArrowDown","ArrowRight"].includes(e.key)) {
    keys[e.key] = false;
  }
});

let currentDirection: "up" | "down" | "left" | "right" | null = null;
const playerInputs: { sequenceNumber: number; dx: number; dy: number }[] = [];
let sequenceNumber = 0;

setInterval(() => {
  const socketID = socket.id;
  if (!socketID) return;
  const me = frontEndPlayers[socketID];
  if (!me) return;

  // Determine direction from keys
  if (keys.w || keys.ArrowUp) currentDirection = "up";
  else if (keys.s || keys.ArrowDown) currentDirection = "down";
  else if (keys.a || keys.ArrowLeft) currentDirection = "left";
  else if (keys.d || keys.ArrowRight) currentDirection = "right";
  else currentDirection = null;

  if (currentDirection) {
    let dx = 0, dy = 0;
    switch (currentDirection) {
      case "up":
        if (!me.checkCollision("up", boundaryArray)) dy = -me.speed;
        break;
      case "down":
        if (!me.checkCollision("down", boundaryArray)) dy = me.speed;
        break;
      case "left":
        if (!me.checkCollision("left", boundaryArray)) dx = -me.speed;
        break;
      case "right":
        if (!me.checkCollision("right", boundaryArray)) dx = me.speed;
        break;
    }

    if (dx !== 0 || dy !== 0) {
      sequenceNumber++;
      playerInputs.push({ sequenceNumber, dx, dy });
      me.x += dx;
      me.y += dy;
      socket.emit("keydown", {
        keycode: "key" + currentDirection.charAt(0).toUpperCase(),
        sequenceNumber,
      });

      // local collision‐with‐PacMan check
      const pac = frontEndPacMan[0];
      if (pac && me.checkCollisionWithPacman(pac)) {
        socket.emit("eatPacman", socket.id);
      }

      animate();
    }
  }
}, 1000 / 30);

// Final render pass
export function animate() {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

  // Draw Pac-Man
  const pac = frontEndPacMan[0];
  if (pac) pac.draw(fgCtx);

  // Draw players
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw(fgCtx);
  }

  // Draw power-ups
  speedObjects.forEach((o) => o.draw());
}
