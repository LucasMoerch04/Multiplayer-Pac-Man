"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
function setupWebSocket(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
        // Handle a sample game event
        socket.on('game-event', (data) => {
            console.log('Received game event:', data);
            // Broadcast the game update to all connected clients
            io.emit('game-update', { data });
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}
