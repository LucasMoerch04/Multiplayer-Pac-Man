import { Server, Socket } from "socket.io";

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
  let countUsers: number = 0;

  // Track connected players
  const backEndPlayers: Record<string, { x: number; y: number; color: string; speed: number }> = {};

  // Single Pac-Man instance
  let pacMan: { x: number; y: number; color: string; speed: number } | null = null;

  // listen for client connections
  io.on("connection", (socket: Socket) => {
    const id = socket.id;
    console.log("User connected:", id);

    // Initialize player at center
    backEndPlayers[id] = {
      x: 1664 / 2 - 16,
      y: 1664 / 2 - 16,
      color: "yellow",
      speed: 5,
    };

    // Ensure Pac-Man exists
    if (!pacMan) {
      pacMan = { x: 70, y: 70, color: "red", speed: 1 };
    }

    // Send initial state
    io.emit("updatePlayers", backEndPlayers);
    io.emit("updatePacMan", pacMan);

    // New user count
    socket.on("newUser", () => {
      countUsers++;
      io.emit("updateCounter", { countUsers });
    });

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

    // Pac-Man position from client AI
    socket.on("pacmanMove", (pos: { x: number; y: number }) => {
      if (!pacMan) return;
      pacMan.x = pos.x;
      pacMan.y = pos.y;
      io.emit("updatePacMan", pacMan);
    });

    // when pacman eaten, reset Pac-Man and broadcast status
    socket.on("eatPacman", (playerId: string) => {
      if (!pacMan) return;
      console.log("Pac-Man eaten by", playerId);
      // Random respawn
      pacMan.x = 1200 * Math.random();
      pacMan.y = 1500 * Math.random();
      io.emit("updatePacMan", pacMan);
      io.emit("pacManEaten", playerId);
    });

    // Speed boost relay
    socket.on("speedBoost", (flag: boolean) => {
      for (const pid in backEndPlayers) {
        backEndPlayers[pid].speed = pid === id ? 2 : 10;
      }
      console.log("Speed boost activated by", id);
      io.emit("updatePlayers", backEndPlayers);
      setTimeout(() => {
        for (const pid in backEndPlayers) backEndPlayers[pid].speed = 5;
        io.emit("updatePlayers", backEndPlayers);
      }, 10000);
    });

    // Teleport relay
    socket.on("Teleport", (teleIndex: number) => {
      const p = backEndPlayers[id];
      if (!p) return;
      switch (teleIndex) {
        case 0: case 1:
          p.x = 928 - 32;
          p.y = 1350 + 32;
          break;
        case 2: case 3:
          p.x = 290 - 32;
          p.y = 710 + 32;
          break;
      }
      p.speed = 2;
      io.emit("updatePlayers", backEndPlayers);
      setTimeout(() => {
        p.speed = 5;
        io.emit("updatePlayers", backEndPlayers);
      }, 10000);
    });

    // Disconnect
    socket.on("disconnect", (reason) => {
      delete backEndPlayers[id];
      countUsers--;
      io.emit("updatePlayers", backEndPlayers);
      io.emit("updateCounter", { countUsers });
      console.log("User disconnected:", id, "reason: ", reason);
    });
  });
}
