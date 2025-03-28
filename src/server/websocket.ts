import { Server, Socket } from "socket.io";

export function setupWebSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    // Handle a sample game event
    socket.on("game-event", (data) => {
      console.log("Received game event:", data);
      // Broadcast the game update to all connected clients
      io.emit("game-update", { data });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
