import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./CollisionBlocks";
import "./Collisionstext";
import"./Powers";
import "./Canvas";
import "./style.css";
import { SPlayer, cameraBox } from "../server/entities";
import { Pacman } from "../server/entities";
import { boundaryArray } from "./CollisionBlocks";
import {SpeedObjectCollision, speedObjects,
        teleportObject, teleportObjectObjectCollision} from "./Powers";
import { fgCtx, fgCanvas, bgCtx, drawBackground, bgCanvas} from "./Canvas";



export const socket = io(); // Connects to the server
let camera: cameraBox
// On connection to socket, prints socket id and emits newUser function
socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
  socket.emit("newUser");

  // Initialize the camera after the socket.id is available
  
});

// After receiving updateCounter call, print the data given as argument
socket.on("updateCounter", (data) => {
  console.log("Users connected:", data.countUsers);
  (document.getElementById("userCounter") as HTMLElement).innerText =
    "Users Connected: " + data.countUsers; // change the innertext of the htmlElement with id of "userCounter" to show user count
    //Creates a new camerabox for each player that connects
    if (socket.id && frontEndPlayers[socket.id]) {
      camera = new cameraBox(frontEndPlayers[socket.id].x, frontEndPlayers[socket.id].y);
      console.log("Camerabox initialized at:", camera.x, camera.y);
    }
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
        backendPlayer.camerabox,
      ); // Create a new player instance if it doesn't exist
    } else {
      frontEndPlayers[id].x = backendPlayer.x;
      frontEndPlayers[id].y = backendPlayer.y;
      frontEndPlayers[id].color = backendPlayer.color;
      frontEndPlayers[id].speed = backendPlayer.speed;
      frontEndPlayers[id].camerabox = backendPlayer.camerabox
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

  // Update the camera position
  if (camera && socket.id && frontEndPlayers[socket.id]) {
    const player = frontEndPlayers[socket.id];
    //This is to get the camerabox placed with the player in the middle
    camera.x = player.x + player.width / 2 - camera.width / 2+20;
    camera.y = player.y + player.height / 2 - camera.height / 2+20;
  }

  // Gets canvas as html element
  const gameStateCanvas = document.getElementById("gameState") as HTMLCanvasElement;
  const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  //Translates the camera whenever the camerabox moves
  gameStateCanvas.style.transform = `translate(${-camera.x}px, ${-camera.y}px)`;
  gameCanvas.style.transform = `translate(${-camera.x}px, ${-camera.y}px)`;

  // Draw PacMan
  if (frontEndPacMan[0]) {
    frontEndPacMan[0].draw();
    frontEndPacMan[0].initialize();
  }

  // Draw players
  for (const id in frontEndPlayers) {
    // frontEndPlayers[id].draw();
    frontEndPlayers[id].initialize();
  }

  // Draw speed objects
  speedObjects.forEach((speedObject) => {
    speedObject.draw();
  });

  
}


window.addEventListener("keydown", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  const player = frontEndPlayers[socket.id];
  //This is constantly checking if a player has collided with a object and if so it returns the index of the object
  const collidingSpeed = SpeedObjectCollision(player);
  if (collidingSpeed !== null && collidingSpeed >= 0) {
    console.log("Emitting Speed with value: true");
    socket.emit('speedBoost', true);
  }
  //Returns the index of the Teleporter Object the player is colliding with
  const collidingTeleport = teleportObjectObjectCollision(player);
  //Emits the index if the player is colliding with a teleporter
  if (collidingTeleport !== null && collidingTeleport >= 0){
    console.log(`Emitting teleport with value: ${collidingTeleport}:`,collidingTeleport);
    socket.emit('Teleport', collidingTeleport);
  }


  switch (event.key) {
    case "w":
    case "ArrowUp":
      if (frontEndPlayers[socket.id].checkCollision("up", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].y -= frontEndPlayers[socket.id].speed; // Move the player up by 5 pixels
        socket.emit("keydown", "keyU"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socket.id);
        }
        
        animate();
      }
      break;

    case "a":
    case "ArrowLeft":
      if (frontEndPlayers[socket.id].checkCollision("left", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].x -= frontEndPlayers[socket.id].speed; // Move the player left by 5 pixels
        socket.emit("keydown", "keyL"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socket.id);
        }
        animate();
      }
      break;

    case "s":
    case "ArrowDown":
      if (frontEndPlayers[socket.id].checkCollision("down", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].y += frontEndPlayers[socket.id].speed; // Move the player down by 5 pixels
        socket.emit("keydown", "keyD"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socket.id);
        }
        animate();
      }
      break;

    case "d":
    case "ArrowRight":
     
      if (frontEndPlayers[socket.id].checkCollision("right", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].x += frontEndPlayers[socket.id].speed; // Move the player right by 5 pixels
        socket.emit("keydown", "keyR"); // Emit the keydown event to the server with the direction and socket id
        if (
          frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])
        ) {
          socket.emit("eatPacman", socket.id);
        }
        animate();
      }
      break;
  }


});
//const player = new SPlayer(70,70, "red"); // Create a new player instance with x, y and color

