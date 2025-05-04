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

// On connection to socket, prints socket id and emits newUser function
socket.on("connect", () => {
  console.log("Connected with id", socket.id);
  socket.emit("newUser");
});

// After receiving updateCounter call, show the data given as argument
socket.on("updateCounter", (data) => {
  (document.getElementById("userCounter")! as HTMLElement).innerText =
    `Users Connected: ${data.countUsers}`;
});

// Data stores
const frontEndPlayers: Record<string, SPlayer> = {};
const frontEndPacMan: Pacman[] = [];

// Build grid & instantiate Pac-Man locally
const walkableGrid = buildClientGrid();
const localPac = new Pacman(816, 816, "red", 5);
frontEndPacMan[0] = localPac;
const pacmanAI = new PacmanAI(localPac, walkableGrid);

// Handle updates from server to override AI if needed
socket.on("updatePacMan", (pos: { x: number; y: number }) => {
  // pos now single object instead of array
  if (!frontEndPacMan[0]) {
    frontEndPacMan[0] = new Pacman(pos.x, pos.y, "red", 1);
  } else {
    frontEndPacMan[0].x = pos.x;
    frontEndPacMan[0].y = pos.y;
  }
});
socket.on("pacManEaten", (playerId: string) => {
  console.log(`Server: Pac-Man eaten by ${playerId}`);
});

// Player list updates
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

// Main loop, advance AI, emit to server, render
setInterval(() => {
  pacmanAI.tick(Object.values(frontEndPlayers));
  // Emit AI-driven position
  socket.emit("pacmanMove", { x: localPac.x, y: localPac.y });

  animate();
}, 15);

// Handle local eat detection
window.addEventListener("pacmanEatenLocally", () => {
  socket.emit("eatPacman", socket.id);
});

// Handle player input locally, send to server
window.addEventListener("keydown", (event) => {
  const socketID = socket.id;
  if (!socketID) return; // Check if socket.id is defined and the player exists in the frontEndPlayers objec
  const player = frontEndPlayers[socketID];
  if (!player) return;

  //This is constantly checking if a player has collided with a object and if so it returns the index of the object
  const collidingSpeed = SpeedObjectCollision(player);
  if (collidingSpeed !== -1) {
    console.log("Emitting Speed with value: true");
    socket.emit("speedBoost", true);
  }

  //Returns the index of the Teleporter Object the player is colliding with
  const collidingTeleport = teleportObjectObjectCollision(player);
  if (collidingTeleport !== -1) {
    console.log(
      `Emitting teleport with value: ${collidingTeleport}:`,
      collidingTeleport,
    );
    socket.emit("Teleport", collidingTeleport);
  }

  switch (event.key) {
    case "w":
    case "ArrowUp":
      if (frontEndPlayers[socketID].checkCollision("up", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socketID].y -= frontEndPlayers[socketID].speed; // Move the player up by 5 pixels
        socket.emit("keydown", "keyU"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socketID].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socketID);
        }
        animate();
      }
      break;

    case "a":
    case "ArrowLeft":
      if (frontEndPlayers[socketID].checkCollision("left", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socketID].x -= frontEndPlayers[socketID].speed; // Move the player left by 5 pixels
        socket.emit("keydown", "keyL"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socketID].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socketID);
        }
        animate();
      }
      break;

    case "s":
    case "ArrowDown":
      if (frontEndPlayers[socketID].checkCollision("down", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socketID].y += frontEndPlayers[socketID].speed; // Move the player down by 5 pixels
        socket.emit("keydown", "keyD"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socketID].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socketID);
        }
        animate();
      }
      break;

    case "d":
    case "ArrowRight":
      if (frontEndPlayers[socketID].checkCollision("right", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socketID].x += frontEndPlayers[socketID].speed; // Move the player right by 5 pixels
        socket.emit("keydown", "keyR"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socketID].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socketID);
        }
        animate();
      }
      break;
  }
});

// Draw everything
export function animate() {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

  // Tegn PacMan
  if (frontEndPacMan[0]) {
    frontEndPacMan[0].draw(fgCtx);
  }

  // Tegn spillere
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw(fgCtx);
  }

  speedObjects.forEach((speedObject) => {
    speedObject.draw();
  });
}
