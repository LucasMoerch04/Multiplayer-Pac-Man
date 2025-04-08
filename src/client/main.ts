import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./player";
import "./CollisionBlocks";
import "./Collisionstext";
import "./Canvas";
import "./style.css";
import { Player } from "../server/serverPlayer";

const canvas: HTMLCanvasElement = document.getElementById(
  "gameCanvas",
) as HTMLCanvasElement;
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

const player = new Player(100, 100, "red"); // Create a new player instance with x, y and color

const players: { [key: string]: Player } = {};

socket.on("updatePlayers", (backendPlayers) => {
  for (const id in backendPlayers){
    const backendPlayer = backendPlayers[id];

    if (!players[id]) {
      players[id] = new Player(backendPlayer.x, backendPlayer.y, backendPlayer.color);
    } 
    
    for (const id in players ){
      if(!backendPlayers[id]){
        delete players[id]
      }
    }
  }

  console.log(players);
});


function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all players
  for (const id in players) {
    players[id].draw();
  }
}
