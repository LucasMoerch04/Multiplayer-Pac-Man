import { io } from "socket.io-client";
import "./CollisionBlocks";
import "./Collisionstext";
import "./Powers";
import "./Canvas";
import "./style.css";
import "./menu";

import { SPlayer, Pacman } from "../shared/entities";
import { boundaryArray } from "./CollisionBlocks";
import { fgCtx, fgCanvas, drawBackground } from "./Canvas";
import {
  SpeedObjectCollision,
  speedObjects,
  teleportObjectCollision,
  cherryObjects,
  cherryObjectCollision,
} from "./Powers";

import { buildClientGrid } from "./grid";
import { PacmanAI } from "./pacmanAI";
import { PACMAN_SPEED } from "../shared/constants";
import { initializeCanvases } from "./menu";

//export const socket = io("https://ghosts-revenge-eater-be-eaten.onrender.com/");
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

socket.on("startGame", () => {
  initializeCanvases();
  drawBackground();
  animate();
  console.log(frontEndPlayers)
});

// Store all remote players and Pac-Man
export const frontEndPlayers: { [key: string]: SPlayer } = {};
export const frontEndPacMan: Pacman[] = [];

// Build collision grid & instantiate local Pac-Man + AI
const walkableGrid = buildClientGrid();
const localPac = new Pacman(816, 816, "pacman", PACMAN_SPEED);
frontEndPacMan[0] = localPac;
const pacmanAI = new PacmanAI(localPac, walkableGrid);

// If server forces Pac-Man position, override AI
socket.on("updatePacMan", (pos: { x: number; y: number }) => {
  if (!frontEndPacMan[0]) {
    frontEndPacMan[0] = new Pacman(pos.x, pos.y, "pacman", PACMAN_SPEED);
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
      if (pacmanAI.mode === "run") {
        socket.emit("eatPacman", socket.id);
      } else {
        socket.emit("eatGhost", socket.id);
      }
    }

    //This is constantly checking if a player has collided with a object and if so it returns the index of the object
    const collidingSpeedObjectIndex = SpeedObjectCollision(player);
    if (collidingSpeedObjectIndex !== null && collidingSpeedObjectIndex >= 0) {
      socket.emit("speedBoost", true, collidingSpeedObjectIndex);
    }

    //Returns the index of the Teleporter Object the player is colliding with
    const collidingTeleportObjectIndex = teleportObjectCollision(player);
    if (
      collidingTeleportObjectIndex !== null &&
      collidingTeleportObjectIndex >= 0
    ) {
      socket.emit("Teleport", collidingTeleportObjectIndex);
    }

    // This checks if pacman is colliding with a cherry object and sets into hunt mode for 10 seconds
    const collidingCherryObjectIndex = cherryObjectCollision(
      frontEndPacMan[0]!,
    );
    if (collidingCherryObjectIndex !== -1) {
      socket.emit("CherryCollision", collidingCherryObjectIndex);
      pacmanAI.setHuntMode();

      setTimeout(() => pacmanAI.setRunMode(), 10000);
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
      
//const player = new SPlayer(70,70, "red"); // Create a new player instance with x, y and color

let selectedColor: string = 'green'; // Global Starting color

function chooseColor(color: string) {
  selectedColor = color;
  console.log(`Selected color: ${color}`);


  // Update the color of the local player
  if (socket.id && frontEndPlayers[socket.id]) {
    frontEndPlayers[socket.id].color = selectedColor;
    animate(); 
  }

  socket.emit("changeColor", selectedColor);
}

// handle server broadcast
socket.on("changeTeamColor", (color: string) => {
  // apply to all remote players
  Object.values(frontEndPlayers).forEach((player) => {
    player.color = color
  })
  const colorDisplay = document.getElementById("color");
  if (colorDisplay) {
    colorDisplay.textContent = `Current Color: ${color}`;
  }

  animate()
})
function setupColorButtons() {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".color-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;
      if (color) {
        chooseColor(color);
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupColorButtons();
});
