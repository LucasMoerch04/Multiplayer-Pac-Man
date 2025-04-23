import { Server, Socket } from "socket.io";
import { boundaryArray } from "../client/CollisionBlocks";

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
  const backEndPlayers: {
    [key: string]: { x: number; y: number; color: string; speed: number };
  } = {};
  const pacMan: {
    [key: string]: { x: number; y: number; color: string; speed: number };
  } = {};

  io.on("connection", (socket: Socket) => {
    // listen for client connections
    console.log("A user connected", socket.id);

    backEndPlayers[socket.id] = {
      x: 1664/2-10, // random x position
      y: 1664/2-10, // random y position
      color: "yellow", // Example color.
      speed: 5, // Example speed.
    };

    io.emit("updatePlayers", backEndPlayers); // emit the new player to all clients

    //console.log(backEndPlayers);

    socket.on("newUser", () => {
      // listen for newUser emits from a client
      countUsers++;
      //console.log(countUsers);
      io.emit("updateCounter", { countUsers }); // broadcast the updated user count to all client
    });

    socket.on("disconnect", (reason) => {
      // listen for client disconnection
      countUsers--;
      console.log(reason);
      delete backEndPlayers[socket.id]; // remove the player from the players object

      io.emit("updatePlayers", backEndPlayers); // emit the updated players to all clients

      io.emit("updateCounter", { countUsers }); // broadcast again
    });

    pacMan[0] = {
      x: 70,
      y: 70,
      color: "red",
      speed: 6,
    };

    io.emit("updatePacMan", pacMan); // emit the powerUps to all clients

    socket.on("eatPacman", (playerId) => {
      console.log("eatPacman", playerId);

      // Reset position
      pacMan[0].x = 1200 * Math.random();
      pacMan[0].y = 1500 * Math.random();

      io.emit("updatePacMan", pacMan);
      io.emit("pacManStatus", pacMan);
    });

    setInterval(() => {
      if (pacMan[0]) {
        const direction = Math.floor(Math.random() * 4);
        switch (direction) {
          case 0:
            pacMan[0].y -= 5;
            break;
          case 1:
            pacMan[0].y += 5;
            break;
          case 2:
            pacMan[0].x -= 5;
            break;
          case 3:
            pacMan[0].x += 5;
            break;
        }

        // Emit til alle spillere
        io.emit("updatePacMan", pacMan);
      }
    }, 1000);

    socket.on("keydown", (keycode) => {
      // listen for keydown events from the client
      switch (keycode) {
        case "keyU":
          backEndPlayers[socket.id].y -= backEndPlayers[socket.id].speed; // move player up
          //console.log(backEndPlayers.y);
          io.emit("updatePlayers", backEndPlayers); // emit the updated players to all
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;

        case "keyL":
          backEndPlayers[socket.id].x -= backEndPlayers[socket.id].speed; // move player left
          io.emit("updatePlayers", backEndPlayers); // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;

        case "keyD":
          backEndPlayers[socket.id].y += backEndPlayers[socket.id].speed; // move player down
          io.emit("updatePlayers", backEndPlayers); // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;

        case "keyR":
          backEndPlayers[socket.id].x += backEndPlayers[socket.id].speed; // move player right
          io.emit("updatePlayers", backEndPlayers); // emit the updated players to all clients
          //io.emit('updatePacMan', pacMan);  // emit the powerUps to all clients

          break;
      }
    });
//The speed boost event 
    socket.on('speedBoost', (booleanValue) => {
      console.log('Received booleanEvent on server:', booleanValue);
      
  // Set speed to 10 for all players excluding the player who triggered the event
  for (const id in backEndPlayers) {
    if (id !== socket.id) { // Exclude the triggering player
      backEndPlayers[id].speed = 10;
    }
  }
  //The player who triggered the event has the speed lowered
  backEndPlayers[socket.id].speed = 2;
  io.emit('updatePlayers', backEndPlayers);//updates players after triggering the event

  // Reset speed to 5 for all players after 10 seconds
  setTimeout(() => {
    for (const id in backEndPlayers) {
      
        backEndPlayers[id].speed = 5;
      
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
  backEndPlayers[socket.id].speed = 2;
  io.emit('updatePlayers', backEndPlayers);//updates players after triggering the event

  // Reset speed to 5 for all players after 10 seconds
  setTimeout(() => {
   
      
        backEndPlayers[socket.id].speed = 5;
      
    //updating so the players speed is returned to 5
    io.emit('updatePlayers', backEndPlayers);
  }, 10000); // 10 seconds
});


   
  });
/*
  setInterval(() => {
    io.emit('updatePlayers', backEndPlayers);
  }, 15);
*/
};


