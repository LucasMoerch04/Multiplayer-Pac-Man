import { Server, Socket } from 'socket.io';

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
  io.on('connection', (socket: Socket) => {  // listen for client connections
    console.log('A user connected', socket.id);

    socket.on('newUser', () => {  // listen for newUser emits from a client
      countUsers++;
      console.log(countUsers);
      io.emit('updateCounter', { countUsers });  // broadcast the updated user count to all client
    });

    socket.on('disconnect', () => {  // listen for client disconnection
      countUsers--;
      console.log('User disconnected');
      io.emit('updateCounter', { countUsers });  // broadcast again

    });
  });
}
