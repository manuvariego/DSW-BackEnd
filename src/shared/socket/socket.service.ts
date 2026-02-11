import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export function initSocket(server: HttpServer): SocketServer {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket] Cliente conectado:', socket.id);

    socket.on('join:garage', (cuit: string) => {
      const room = `garage:${cuit}`;
      if (!socket.rooms.has(room)) {
        socket.join(room);
        console.log(`[Socket] ${socket.id} se unió a sala ${room}`);
      }
    });

    socket.on('join:user', (userId: string) => {
      const room = `user:${userId}`;
      if (!socket.rooms.has(room)) {
        socket.join(room);
        console.log(`[Socket] ${socket.id} se unió a sala ${room}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Cliente desconectado:', socket.id);
    });
  });

  console.log('[Socket] Inicializado');
  return io;
}

export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io no inicializado');
  return io;
}