import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./CollisionBlocks";
import "./Collisionstext";
import"./Powers";
import "./Canvas";
import "./style.css";
import { SPlayer } from "./clientPlayer";
import { characterTexture } from "./Canvas";
import { boundaryArray } from "./CollisionBlocks";
import { powerObjects} from "./Powers";

const canvas: HTMLCanvasElement = document.getElementById(
  "gameState",) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

export const socket = io(); // Connects to the server

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
  

  console.log(frontEndPlayers);
});

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all players
  for (const id in frontEndPlayers) {
    const player = frontEndPlayers[id];
    ctx.drawImage(characterTexture, player.x, player.y, player.width, player.height);
  }
  powerObjects.forEach((powerObject) => {
    powerObject.drawObject();
  });
  
  // Request the next frame
  requestAnimationFrame(animate);
}

// Start the animation loop
requestAnimationFrame(animate);

window.addEventListener("keydown", function (event) {
  if (!socket.id || !frontEndPlayers[socket.id]) return; // Check if socket.id is defined and the player exists in the frontEndPlayers object
  //!!!!!Måske kunne man lave dette til en switch så det er mere tydeligt hvad der sker
  switch (event.key) {
    case "w":
    case "ArrowUp":

      if (frontEndPlayers[socket.id].checkCollision("up", boundaryArray)) {
        console.log("colliding up");
        return;
      } else {
        if ((frontEndPlayers[socket.id].checkCollision("up", powerObjects))){
          console.log("colliding with PO");
          //Skal indsætte en funktion som returnere index på hvilke object spilleren collider med
        };
        socket.emit('keydown', 'keyU'); // Emit the keydown event to the server with the direction and socket id
      }
      break;

    case "a":
    case "ArrowLeft":

      if (frontEndPlayers[socket.id].checkCollision("left", boundaryArray)) {
        console.log("colliding left");
        return;
      } else {
        if ((frontEndPlayers[socket.id].checkCollision("left", powerObjects))){
          console.log("colliding with PO");
          //Skal indsætte en funktion som returnere index på hvilke object spilleren collider med
        };
        socket.emit('keydown', 'keyL'); // Emit the keydown event to the server with the direction and socket id
      }
      break;

    case "s":
    case "ArrowDown":

      if (frontEndPlayers[socket.id].checkCollision("down", boundaryArray)) {
        console.log("colliding down");
        return;
      } else {
        if ((frontEndPlayers[socket.id].checkCollision("down", powerObjects))){
          console.log("colliding with PO");
          //Skal indsætte en funktion som returnere index på hvilke object spilleren collider med
        };
        socket.emit('keydown', 'keyD'); // Emit the keydown event to the server with the direction and socket id
      }
      break;

    case "d":
    case "ArrowRight":
      if (frontEndPlayers[socket.id].checkCollision("right", boundaryArray)) {
        console.log("colliding right");
        return;
      }
      else {
         if ((frontEndPlayers[socket.id].checkCollision("right", powerObjects))){
          console.log("colliding with PO");
          //Skal indsætte en funktion som returnere index på hvilke object spilleren collider med
         };
        socket.emit('keydown', 'keyR'); // Emit the keydown event to the server with the direction and socket id
      }
      break;
  }
});
