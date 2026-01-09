import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export type NextApiResponseServerIo = NextApiResponse & {
  socket: any & {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
        // console.log('Socket connected:', socket.id);
        socket.on('data_update', (data) => {
            // Broadcast the update to all other clients
            socket.broadcast.emit('data_update', data);
        });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
