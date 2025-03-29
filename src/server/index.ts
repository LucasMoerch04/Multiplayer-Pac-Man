import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { setupWebSocket } from './websocket'; 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

console.log("Starting server..."); // Log here should only appear once


// Serve static files from the public directory
app.use(express.static('public'));

// Set up game-specific WebSocket event handling
setupWebSocket(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
