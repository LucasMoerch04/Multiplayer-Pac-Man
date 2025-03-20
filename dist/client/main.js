"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
require("./player");
const socket = (0, socket_io_client_1.io)(); // Connects to the server
socket.on('connect', () => {
    console.log('Connected to server via WebSocket');
});
// Listen for game updates from the server
socket.on('game-update', (data) => {
    console.log('Game update received:', data);
});
function sendGameEvent(eventData) {
    socket.emit('game-event', eventData);
}
// Expose function for testing or game logic
window.sendGameEvent = sendGameEvent;
