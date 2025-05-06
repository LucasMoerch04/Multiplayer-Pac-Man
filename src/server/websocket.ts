import { Server, Socket } from "socket.io";

/**
 * Sets up WebSocket event handling for the game.
 * Acts as a relay - clients drive both player movement and Pac-Man AI.
 */
export function setupWebSocket(io: Server) {
  let countUsers = 0;

  // Track connected players
  const backEndPlayers: Record<
    string,
    {
      x: number;
      y: number;
      color: string;
      speed: number;
      sequenceNumber: number;
    }
  > = {};

  // Single Pac-Man instance
  let pacMan: { x: number; y: number; color: string; speed: number } = {
    x: 816,
    y: 816,
    color: "pacman",
    speed: 6,
  };

  io.on("connection", (socket: Socket) => {
    const id = socket.id;
    console.log("User connected:", id);

    // Initialize new player at center
    backEndPlayers[id] = {
      x: 1664 / 2 - 10,
      y: 1664 / 2 - 10,
      color: "yellow",
      speed: 5,
      sequenceNumber: 0,
    };
    io.emit("updatePlayers", backEndPlayers);
    io.emit("updatePacMan", pacMan);

    // New user announces themselves
    socket.on("newUser", () => {
      countUsers++;
      io.emit("updateCounter", { countUsers });
    });

    // Client-driven player movement
    socket.on(
      "keydown",
      (data: { keycode: string; sequenceNumber: number }) => {
        const p = backEndPlayers[id];
        if (!p) return;
        // update their sequenceNumber
        p.sequenceNumber = data.sequenceNumber;
        switch (data.keycode) {
          case "keyU":
            p.y -= p.speed;
            break;
          case "keyD":
            p.y += p.speed;
            break;
          case "keyL":
            p.x -= p.speed;
            break;
          case "keyR":
            p.x += p.speed;
            break;
        }
        io.emit("updatePlayers", backEndPlayers);
      },
    );

    // Pac-Man AI driven by one client
    socket.on("pacmanMove", (pos: { x: number; y: number }) => {
      pacMan.x = pos.x;
      pacMan.y = pos.y;
      io.emit("updatePacMan", pacMan);
    });

    // Pac-Man eaten event
    socket.on("eatPacman", (playerId: string) => {
      console.log("Pac-Man eaten by", playerId);
      // respawn in center
      pacMan.x = 816;
      pacMan.y = 816;
      io.emit("updatePacMan", pacMan);
      io.emit("pacManEaten", playerId);
    });

    // Speed boost relay
    socket.on("speedBoost", (flag: boolean, index: number) => {
      for (const pid in backEndPlayers) {
        backEndPlayers[pid].speed = pid === id ? 2 : 10;
      }
      io.emit("updatePlayers", backEndPlayers);

      io.emit("logMessage", `i got the index ${index}`);
      io.emit("deleteSpeedObject", index);
      setTimeout(() => {
        for (const pid in backEndPlayers) backEndPlayers[pid].speed = 5;
        io.emit("updatePlayers", backEndPlayers);
      }, 10_000);
    });

    socket.on("CherryCollision", (index: number) => {
      //write cherry code here


      io.emit("deleteCherryObject", index)
    })
    

    // Teleport relay
    socket.on("Teleport", (index: number) => {
      const p = backEndPlayers[id];
      if (!p) return;
      switch (index) {
        case 0:
        case 1:
          p.x = 928 - 32;
          p.y = 1350 + 32;
          break;
        case 2:
        case 3:
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

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", id, "reason:", reason);
      delete backEndPlayers[id];
      countUsers--;
      io.emit("updatePlayers", backEndPlayers);
      io.emit("updateCounter", { countUsers });
    });
  });
}
