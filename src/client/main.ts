import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import "./player";
import "./style.css";
const socket = io(); // Connects to the server

socket.on("connect", () => {
  console.log("Connected to server via WebSocket");
});

// Listen for game updates from the server
socket.on("game-update", (data) => {
  console.log("Game update received:", data);
});

function sendGameEvent(eventData: GamepadEvent) {
  socket.emit("game-event", eventData);
}

// Expose function for testing or game logic
(window as any).sendGameEvent = sendGameEvent;
