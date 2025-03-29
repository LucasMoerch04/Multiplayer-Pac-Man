import { io } from "socket.io-client";
//Man skal huske at skrive sin fil her hvis man skal bruge den
import './player';
import './style.css';
const socket = io(); // Connects to the server

socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
  socket.emit("newUser");
});

socket.on("updateCounter", (data) => {
  console.log("Users conneceted:", data.countUsers);
  (document.getElementById("userCounter") as HTMLElement).innerText = "Users Connected: " + data.countUsers;
});