import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./CollisionBlocks";
import "./Collisionstext";
import "./Canvas";
import "./style.css";
import { SPlayer } from "./clientPlayer";
import { boundaryArray } from "./CollisionBlocks";
import { Pacman } from "./pacman";


const canvas: HTMLCanvasElement = document.getElementById(
  "gameState",) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const socket = io(); // Connects to the server

// On connection to socket, prints socket id and emits newUser function
socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
  socket.emit("newUser");
});

// After receiving updateCounter call, print the data given as argument
socket.on("updateCounter", (data) => {
  console.log("Users conneceted:", data.countUsers);
  (document.getElementById("userCounter") as HTMLElement).innerText = "Users Connected: " + data.countUsers; // change the innertext of the htmlElement with id of "userCounter" to show user count
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
      backendPacMan[0].speed
    );
  } else {
    const current = frontEndPacMan[0];
    const newX = backendPacMan[0].x;
    const newY = backendPacMan[0].y;

    let direction: "up" | "down" | "left" | "right" | null = null;

    if (newY < current.y) direction = "up";
    else if (newY > current.y) direction = "down";
    else if (newX < current.x) direction = "left";
    else if (newX > current.x) direction = "right";

    if (direction && !current.checkCollision(direction, boundaryArray)) {
      // Check for collision before updating position
      current.x = newX;
      current.y = newY;
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
  for (const id in backendPlayers){
    const backendPlayer = backendPlayers[id];

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new SPlayer(backendPlayer.x, backendPlayer.y, backendPlayer.color, backendPlayer.speed); // Create a new player instance if it doesn't exist
    } else {
      frontEndPlayers[id].x = backendPlayer.x;
      frontEndPlayers[id].y = backendPlayer.y;
      frontEndPlayers[id].color = backendPlayer.color;
    }
    
    for (const id in frontEndPlayers ){
      if(!backendPlayers[id]){
        delete frontEndPlayers[id]
      }
    }
  }
  

  animate(); // Call the animate function to draw the players on the canvas

  
  

//console.log(frontEndPlayers);
});
;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tegn PacMan
  if (frontEndPacMan[0]) {
    frontEndPacMan[0].draw();
    frontEndPacMan[0].drawCharacter();
  }

  // Tegn spillere
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw();
    frontEndPlayers[id].drawCharacter();
  }
}





window.addEventListener("keydown", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  //!!!!!Måske kunne man lave dette til en switch så det er mere tydeligt hvad der sker
  switch (event.key) {
    case "w":
    case "ArrowUp":

      if (frontEndPlayers[socket.id].checkCollision("up", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].y -= frontEndPlayers[socket.id].speed; // Move the player up by 5 pixels
        socket.emit('keydown', 'keyU'); // Emit the keydown event to the server with the direction and socket id
        if(frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])){
          socket.emit('eatPacman', socket.id);
        }
      }
      break;

    case "a":
    case "ArrowLeft":

      if (frontEndPlayers[socket.id].checkCollision("left", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].x -= frontEndPlayers[socket.id].speed; // Move the player left by 5 pixels
        socket.emit('keydown', 'keyL'); // Emit the keydown event to the server with the direction and socket id
        if(frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])){
          socket.emit('eatPacman', socket.id);
        }
      }
      break;

    case "s":
    case "ArrowDown":

      if (frontEndPlayers[socket.id].checkCollision("down", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].y += frontEndPlayers[socket.id].speed; // Move the player down by 5 pixels
        socket.emit('keydown', 'keyD'); // Emit the keydown event to the server with the direction and socket id
        if(frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])){
          socket.emit('eatPacman', socket.id);
        }
      }
      break;

    case "d":
    case "ArrowRight":
      if (frontEndPlayers[socket.id].checkCollision("right", boundaryArray)) {
        return;
      } else {
        frontEndPlayers[socket.id].x += frontEndPlayers[socket.id].speed; // Move the player right by 5 pixels
        socket.emit('keydown', 'keyR'); // Emit the keydown event to the server with the direction and socket id
        if(frontEndPlayers[socket.id].checkCollisionWithPacman(frontEndPacMan[0])){
          socket.emit('eatPacman', socket.id);
        }
      }
      break;
  }
});
