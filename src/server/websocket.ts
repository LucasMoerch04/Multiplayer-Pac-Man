import { Server, Socket } from "socket.io";
import { Boundaries, boundaryArray } from '../client/CollisionBlocks';

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
  const backEndPlayers: { [key: string]: { x: number; y: number; color: string; velocity: number} } = {};

  io.on('connection', (socket: Socket) => {  // listen for client connections
    console.log('A user connected', socket.id);
    
    backEndPlayers[socket.id] = {
      x: 1664/2-10,  // random x position
      y: 1664/2-10,  // random y position
      color: 'yellow', // Example color.
      velocity: 5
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
        case "keyU":
          backEndPlayers[socket.id].y -= backEndPlayers[socket.id].velocity;  // move player up
          console.log(backEndPlayers.y);
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

          break;

        case "keyL":
          backEndPlayers[socket.id].x -= backEndPlayers[socket.id].velocity;  // move player left
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

          break;
    
        case "keyD":
          backEndPlayers[socket.id].y += backEndPlayers[socket.id].velocity;  // move player down
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

          break;
    
        case "keyR":
          backEndPlayers[socket.id].x += backEndPlayers[socket.id].velocity;  // move player right
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

          
          break;
      }

  });
  });
/*
  setInterval(() => {
    io.emit('updatePlayers', backEndPlayers);
  }, 15);
*/
  }; 


