import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./CollisionBlocks";
import "./Collisionstext";
import "./Powers";
import "./Canvas";
import "./style.css";
import { SPlayer } from "../server/entities";
import { Pacman } from "../server/entities";
import { boundaryArray } from "./CollisionBlocks";
import {SpeedObjectCollision, speedObjects,
        teleportObject, teleportObjectObjectCollision} from "./Powers";
import { fgCtx } from "../client/Canvas";
import { fgCanvas } from "../client/Canvas";



const canvas: HTMLCanvasElement = document.getElementById(
  "gameState",) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export const socket = io(); // Connects to the server

// On connection to socket, prints socket id and emits newUser function
socket.on("connect", () => {
  console.log("Connected to server with id:", socket);
  socket.emit("newUser");
});

// After receiving updateCounter call, print the data given as argument
socket.on("updateCounter", (data) => {
  console.log("Users connected:", data.countUsers);
  (document.getElementById("userCounter") as HTMLElement).innerText =
    "Users Connected: " + data.countUsers; // change the innertext of the htmlElement with id of "userCounter" to show user count
});

//const player = new SPlayer(70,70, "red"); // Create a new player instance with x, y and color

const frontEndPlayers: { [key: string]: SPlayer } = {};
const frontEndPacMan: Pacman[] = [];

socket.on("updatePacMan", (backendPacMan) => {
  if (!frontEndPacMan[0]) {
    frontEndPacMan[0] = new Pacman(
      backendPacMan[0].x,
      backendPacMan[0].y,
      backendPacMan[0].color,
      backendPacMan[0].speed,
    );
  } else {
    const currentPacMan = frontEndPacMan[0];
    const updatedPacManX = backendPacMan[0].x;
    const updatedPacManY = backendPacMan[0].y;

    let direction: "up" | "down" | "left" | "right" | null = null;

    if (updatedPacManY < currentPacMan.y) direction = "up";
    else if (updatedPacManY > currentPacMan.y) direction = "down";
    else if (updatedPacManX < currentPacMan.x) direction = "left";
    else if (updatedPacManX > currentPacMan.x) direction = "right";

    if (direction && !currentPacMan.checkCollision(direction, boundaryArray)) {
      // Check for collision before updating position
      currentPacMan.x = updatedPacManX;
      currentPacMan.y = updatedPacManY;
    }
  }

  animate();
});

socket.on("pacManStatus", (backendPacMan) => {
  console.log("Pacman eaten!");
  frontEndPacMan[0].x = backendPacMan[0].x; // Update PacMan's position
  frontEndPacMan[0].y = backendPacMan[0].y; // Update PacMan's position
  animate(); // Opdater canvas med ny position
});

socket.on("updatePlayers", (backendPlayers) => {
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id];

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new SPlayer(
        backendPlayer.x,
        backendPlayer.y,
        backendPlayer.color,
        backendPlayer.speed,
      ); // Create a new player instance if it doesn't exist
    } else {
      if(id === socket.id) {
        // Update existing player instance
        frontEndPlayers[id].x = backendPlayer.x;
        frontEndPlayers[id].y = backendPlayer.y;
        frontEndPlayers[id].color = backendPlayer.color;
        frontEndPlayers[id].speed = backendPlayer.speed;
        
        const lastBackendInputIndex = playerInputs.findIndex(input => {
          return backendPlayer.sequenceNumber === input.sequenceNumber;
        })

        if (lastBackendInputIndex > -1) {
        playerInputs.splice(0, lastBackendInputIndex + 1); // Remove all inputs up to the last backend input

        playerInputs.forEach((input) => {
          frontEndPlayers[id].x += input.dx; // Update player position based on inputs
          frontEndPlayers[id].y += input.dy; // Update player position based on inputs
        
        });
        } else {
          // For all other players
          frontEndPlayers[id].x = backendPlayer.x; // Reset player position to backend position
          frontEndPlayers[id].y = backendPlayer.y; // Reset player position to backend position
        }
      }
    }
      for (const id in frontEndPlayers) {
        if (!backendPlayers[id]) {
          delete frontEndPlayers[id];
        }
      }
  }

  animate(); // Call the animate function to draw the players on the canvas
});
function animate() {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

  // Tegn PacMan
  if (frontEndPacMan[0]) {
    frontEndPacMan[0].draw();
    frontEndPacMan[0].initialize();
  }

  // Tegn spillere
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw();
    frontEndPlayers[id].initialize();
  }

  speedObjects.forEach((speedObject) => {
    speedObject.draw();
  });
}

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  }
};

const playerInputs: { sequenceNumber: number; dx: number; dy: number }[] = [];
let sequenceNumber = 0;

setInterval(() => {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  if(keys.w.pressed) {
    sequenceNumber++;
    playerInputs.push({sequenceNumber, dx: 0 , dy: -frontEndPlayers[socket.id].speed});
    if (frontEndPlayers[socket.id].checkCollision("up", boundaryArray)) {
      return;
    } else {
      frontEndPlayers[socket.id].y -= frontEndPlayers[socket.id].speed; // Move the player up by 5 pixels
      socket.emit("keydown", {keycode: "keyU", sequenceNumber}); // Emit the keydown event to the server with the direction and socket id
      if (
        frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
      ) {
        socket.emit("eatPacman", socket.id);
      }
      animate();
    }
  } 
  
  if(keys.a.pressed) {
    sequenceNumber++;
    playerInputs.push({sequenceNumber, dx: -frontEndPlayers[socket.id].speed, dy: 0});
    if (frontEndPlayers[socket.id].checkCollision("left", boundaryArray)) {
      return;
    } else {
      frontEndPlayers[socket.id].x -= frontEndPlayers[socket.id].speed; // Move the player left by 5 pixels
      socket.emit("keydown", {keycode: "keyL", sequenceNumber}); // Emit the keydown event to the server with the direction and socket id
      if (
        frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
      ) {
        socket.emit("eatPacman", socket.id);
      }
      animate();
    }
  } 
  
  if(keys.s.pressed) {
    sequenceNumber++;
    playerInputs.push({sequenceNumber, dx: 0, dy: frontEndPlayers[socket.id].speed});
    if (frontEndPlayers[socket.id].checkCollision("down", boundaryArray)) {
      return;
    } else {
      frontEndPlayers[socket.id].y += frontEndPlayers[socket.id].speed; // Move the player down by 5 pixels
      socket.emit("keydown", {keycode: "keyD", sequenceNumber}); // Emit the keydown event to the server with the direction and socket id
      if (
        frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
      ) {
        socket.emit("eatPacman", socket.id);
      }
      animate();
    }
  } 
  
  if(keys.d.pressed) {
    sequenceNumber++;
    playerInputs.push({sequenceNumber, dx: frontEndPlayers[socket.id].speed, dy: 0});
    if (frontEndPlayers[socket.id].checkCollision("right", boundaryArray)) {
      return;
    } else {
      frontEndPlayers[socket.id].x += frontEndPlayers[socket.id].speed; // Move the player right by 5 pixels
      socket.emit("keydown", {keycode: "keyR", sequenceNumber}); // Emit the keydown event to the server with the direction and socket id
      if (
        frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
      ) {
        socket.emit("eatPacman", socket.id);
      }
      animate();
    }
  }
}, 15);

window.addEventListener("keydown", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  const player = frontEndPlayers[socket.id];
  //This is constantly checking if a player has collided with a object and if so it returns the index of the object
  const collidingSpeed = SpeedObjectCollision(player);
  if (collidingSpeed !== null && collidingSpeed >= 0) {
    console.log("Emitting Speed with value: true");
    socket.emit("speedBoost", true);
  }
  //Returns the index of the Teleporter Object the player is colliding with
  const collidingTeleport = teleportObjectObjectCollision(player);
  //Emits the index if the player is colliding with a teleporter
  if (collidingTeleport !== null && collidingTeleport >= 0) {
    console.log(
      `Emitting teleport with value: ${collidingTeleport}:`,
      collidingTeleport,
    );
    socket.emit("Teleport", collidingTeleport);
  }

  switch (event.key) {
    case "w":
    case "ArrowUp":
      keys.w.pressed = true; // Set the pressed state to true for the "w" key
      break;

    case "a":
    case "ArrowLeft":
      keys.a.pressed = true; // Set the pressed state to true for the "a" key
      break;

    case "s":
    case "ArrowDown":
      keys.s.pressed = true; // Set the pressed state to true for the "s" key
      break;

    case "d":
    case "ArrowRight":
      keys.d.pressed = true; // Set the pressed state to true for the "d" key
      break;
  }
});

window.addEventListener("keyup", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  switch (event.key) {
    case "w":
    case "ArrowUp":
      keys.w.pressed = false; // Set the pressed state to false for the "w" key
      break;

    case "a":
    case "ArrowLeft":
      keys.a.pressed = false; // Set the pressed state to false for the "a" key
      break;

    case "s":
    case "ArrowDown":
      keys.s.pressed = false; // Set the pressed state to false for the "s" key
      break;

    case "d":
    case "ArrowRight":
      keys.d.pressed = false; // Set the pressed state to false for the "d" key
      break;
  }
});
