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
//The speed boost event 
    socket.on('speedBoost', (booleanValue) => {
      console.log('Received booleanEvent on server:', booleanValue);
      
  // Set velocity to 10 for all players excluding the player who triggered the event
  for (const id in backEndPlayers) {
    if (id !== socket.id) { // Exclude the triggering player
      backEndPlayers[id].velocity = 10;
    }
  }
  //The player who triggered the event has the velocity lowered
  backEndPlayers[socket.id].velocity = 2;
  io.emit('updatePlayers', backEndPlayers);//updates players after triggering the event

  // Reset velocity to 5 for all players after 10 seconds
  setTimeout(() => {
    for (const id in backEndPlayers) {
      
        backEndPlayers[id].velocity = 5;
      
    }
    io.emit('updatePlayers', backEndPlayers);//Lowering the velocity after the event is over
  }, 10000); // 10 seconds
});
//Teleporter event
socket.on('Teleport', (number) => {
  switch(number){
    //if the player collides with either of the left teleporter blocks their coordinats is set to the right teleporter
    case 0:
    case 1:
      backEndPlayers[socket.id].x = 928-32;
      backEndPlayers[socket.id].y = 1350 + 32;
      io.emit('updatePlayers', backEndPlayers);
      break;
      //if the player collides with either of the right teleporter blocks their coordinats is set to the left teleporter
    case 2:
    case 3:
      backEndPlayers[socket.id].x = 290- 32;
      backEndPlayers[socket.id].y = 710 + 32;
      io.emit('updatePlayers', backEndPlayers);
      break;
  }

  // This is a penalty for taking the teleport
  backEndPlayers[socket.id].velocity = 2;
  io.emit('updatePlayers', backEndPlayers);//updates players after triggering the event

  // Reset velocity to 5 for all players after 10 seconds
  setTimeout(() => {
   
      
        backEndPlayers[socket.id].velocity = 5;
      
    //updating so the players velocity is returned to 5
    io.emit('updatePlayers', backEndPlayers);
  }, 10000); // 10 seconds
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


