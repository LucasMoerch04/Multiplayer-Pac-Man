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
  const backEndPlayers: { [key: string]: { x: number; y: number; color: string } } = {};
  const pacMan: { [key: string]: { x: number; y: number; color: string } } = {};

  io.on('connection', (socket: Socket) => {  // listen for client connections
    console.log('A user connected', socket.id);
    
    backEndPlayers[socket.id] = {
      x: 500 * Math.random(),  // random x position
      y: 500 * Math.random(),  // random y position
      color: 'yellow' // Example color.
    };

    io.emit('updatePlayers', backEndPlayers);  // emit the new player to all clients

    //console.log(backEndPlayers);

    socket.on('newUser', () => {  // listen for newUser emits from a client
      countUsers++;
      //console.log(countUsers);
      io.emit('updateCounter', { countUsers });  // broadcast the updated user count to all client
    });

    socket.on('disconnect', (reason) => {  // listen for client disconnection
      countUsers--;
      console.log(reason);
      delete backEndPlayers[socket.id];  // remove the player from the players object

      io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients

      io.emit('updateCounter', { countUsers });  // broadcast again
    });

    pacMan[0] = {
      x: 70,
      y: 70,
      color: 'red'
    }

    io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

    socket.on('eatPacman', (player) => {  // listen for eatPacman emits from a client
      console.log("eatPacman", player);

      //Output to all players that pac man is eaten
      io.emit('pacManStatus');  // emit the updated players to all clients

      }
    );

      setInterval(() => {
        if(pacMan[0]){
          const randomDirection = Math.floor(Math.random() * 4); // 0: up, 1: down, 2: left, 3: right
          switch (randomDirection) {
            case 0:
              pacMan[0].y -= 5; // Move up
              break;
            case 1:
              pacMan[0].y += 5; // Move down
              break;
            case 2:
              pacMan[0].x -= 5; // Move left
              break;
            case 3:
              pacMan[0].x += 5; // Move right
              break;
          }
        }
        io.emit('updatePacMan', pacMan); // Emit the updated PacMan position to all clients
      }, 1000); // Adjust the interval as needed (currently set to 1 second)
    

    socket.on('keydown', (keycode) => {  // listen for keydown events from the client
      switch (keycode) {
        case "keyU":
          backEndPlayers[socket.id].y -= 5;  // move player up
          console.log(backEndPlayers.y);
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all 
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;

        case "keyL":
          backEndPlayers[socket.id].x -= 5;  // move player left
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;
    
        case "keyD":
          backEndPlayers[socket.id].y += 5;  // move player down
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;
    
        case "keyR":
          backEndPlayers[socket.id].x += 5;  // move player right
          io.emit('updatePlayers', backEndPlayers);  // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;
      }

  });
  });

  function randomPacManMovement(){
    // Randomly move PacMan every 1000ms (1 second)
    setInterval(() => {
      const randomDirection = Math.floor(Math.random() * 4); // 0: up, 1: down, 2: left, 3: right
      switch (randomDirection) {
        case 0:
          pacMan[0].y -= 5; // Move up
          break;
        case 1:
          pacMan[0].y += 5; // Move down
          break;
        case 2:
          pacMan[0].x -= 5; // Move left
          break;
        case 3:
          pacMan[0].x += 5; // Move right
          break;
      }
      io.emit('updatePacMan', pacMan); // Emit the updated PacMan position to all clients
    }, 1000); // Adjust the interval as needed (currently set to 1 second)
  }


  }; 



