import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./player";
import "./CollisionBlocks";
import "./Collisionstext";
import "./Canvas";
import "./style.css";
import { SPlayer } from "../server/serverPlayer";


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

socket.on("updatePlayers", (backendPlayers) => {
  for (const id in backendPlayers){
    const backendPlayer = backendPlayers[id];

    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = new SPlayer(backendPlayer.x, backendPlayer.y, backendPlayer.color);
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

  

console.log(frontEndPlayers);
});
;

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all players
  for (const id in frontEndPlayers) {
    frontEndPlayers[id].draw();
    
  }
}


window.addEventListener("keydown", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  //!!!!!Måske kunne man lave dette til en switch så det er mere tydeligt hvad der sker
  switch (event.key) {
    case "w":
    case "ArrowUp":
     socket.emit('keydown', 'keyU'); // Emit the keydown event to the server with the direction and socket id
      break;

    case "a":
    case "ArrowLeft":
     socket.emit('keydown', 'keyL'); // Emit the keydown event to the server with the direction and socket id
      break;

    case "s":
    case "ArrowDown":
      socket.emit('keydown', 'keyD'); // Emit the keydown event to the server with the direction and socket id
      break;

    case "d":
    case "ArrowRight":
      socket.emit('keydown', 'keyR'); // Emit the keydown event to the server with the direction and socket id
      break;
  }
});