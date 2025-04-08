import { Server, Socket } from "socket.io";
import { SPlayer } from "./serverPlayer";
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
  const backEndPlayers: { [key: string]: { x: number; y: number; color: string } } = {};

  io.on('connection', (socket: Socket) => {  // listen for client connections
    console.log('A user connected', socket.id);
    
    backEndPlayers[socket.id] = {
      x: 500 * Math.random(),  // random x position
      y: 500 * Math.random(),  // random y position
      color: 'yellow' // Example color.
    };

    io.emit('updatePlayers', backEndPlayers);  // emit the new player to all clients

    console.log(backEndPlayers);

    socket.on('newUser', () => {  // listen for newUser emits from a client
      countUsers++;
      console.log(countUsers);
      io.emit('updateCounter', { countUsers });  // broadcast the updated user count to all client
    });

    socket.on('disconnect', (reason) => {  // listen for client disconnection
      countUsers--;
      console.log(reason);
      delete backEndPlayers[socket.id];  // remove the player from the players object

      io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

      io.emit('updateCounter', { countUsers });  // broadcast again
    });

    socket.on('keydown', (keycode) => {  // listen for keydown events from the client
      switch (keycode) {
        case "w":
        case "ArrowUp":
          backEndPlayers[socket.id].y -= 5;  // move player up

          break;
    
        case "a":
        case "ArrowLeft":
          backEndPlayers[socket.id].x -= 5;  // move player left

          break;
    
        case "s":
        case "ArrowDown":
          backEndPlayers[socket.id].y += 5;  // move player down

          break;
    
        case "d":
        case "ArrowRight":
          backEndPlayers[socket.id].x += 5;  // move player right
          
          break;
      }

  });
  });

  setInterval(() => {
    io.emit('updatePlayers', backEndPlayers);
  }, 15);
  }; 

