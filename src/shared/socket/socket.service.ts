import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export function initSocket(server: HttpServer): SocketServer {
  io = new SocketServer(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('[Socket] Cliente conectado:', socket.id);

    socket.on('join:garage', (cuit: string) => {
      socket.join(`garage:${cuit}`);
      console.log(`[Socket] ${socket.id} se unió a sala garage:${cuit}`);
    });

    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket] ${socket.id} se unió a sala user:${userId}`);
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