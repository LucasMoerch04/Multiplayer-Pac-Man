import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupWebSocket } from "./websocket";

const app = express();
const server = http.createServer(app);

// Create server instance
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

console.log("Starting server..."); // Log here should only appear once

// Serve static files from the docs directory
app.use(express.static("dist"));

// Set up game-specific WebSocket event handling
setupWebSocket(io);

// Start server and listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

