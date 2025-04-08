import { Server, Socket } from "socket.io";
import { Player } from "./serverPlayer";
// Initiate counter
let countUsers: number = 0;

/**
 * Sets up WebSocket event handling for the game
 * This function registers event listeners for new connections,
 * disconnections, and other user-related events
 *
 * @param io - The Socket.IO server instance
 */
/**
* 'socket' is for specific user
* 'io' is for all users
*/
export function setupWebSocket(io: Server) {
  const players: { [key: string]: { x: number; y: number; color: string } } = {};

  io.on('connection', (socket: Socket) => {  // listen for client connections
    console.log('A user connected', socket.id);
    
    players[socket.id] = {
      x: 500 * Math.random(),  // random x position
      y: 500 * Math.random(),  // random y position
      color: 'yellow' // Example color.
    };

    io.emit('updatePlayers', players);  // emit the new player to all clients

    console.log(players);

    socket.on('newUser', () => {  // listen for newUser emits from a client
      countUsers++;
      console.log(countUsers);
      io.emit('updateCounter', { countUsers });  // broadcast the updated user count to all client
    });

    socket.on('disconnect', (reason) => {  // listen for client disconnection
      countUsers--;
      console.log(reason);
      delete players[socket.id];  // remove the player from the players object

      io.emit('updatePlayers', players);  // emit the updated players to all clients

      io.emit('updateCounter', { countUsers });  // broadcast again
    });
  });
}
