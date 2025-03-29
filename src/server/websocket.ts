import { Server, Socket } from 'socket.io';

let countUsers: number = 0;

export function setupWebSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected', socket.id);

    socket.on('newUser', () => {
      countUsers++;
      console.log(countUsers);
      io.emit('updateCounter', { countUsers });
    });

    socket.on('disconnect', () => {
      countUsers--;
      console.log('User disconnected');
      io.emit('updateCounter', { countUsers });

    });
  });
}
