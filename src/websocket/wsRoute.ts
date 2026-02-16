import { type FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { addConnection, removeConnection } from './websocketManager';
import { checkRequestJWT } from '../routes/hooks/checkJWT-FromReq';
import jwt from 'jsonwebtoken';

type JWTPayload = {
  sub: string;
};

export const wsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/ws', { websocket: true }, (socket, req) => {
    const url = new URL(req.url, `http:..${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token || !process.env.JWT_SECRET) {
      socket.close(4001, 'Unauthorized');
      return;
    }
    let userID: string;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      userID = payload.sub;
    } catch (err: any) {
      socket.close(4001, 'invalid token');
      return;
    }

    addConnection(userID, socket);

    socket.send(
      JSON.stringify({
        event: 'connected',
        data: { message: 'WebSocket connected successfully' },
      })
    );
    const heartbeat = setInterval(() => {
      if (socket.readyState === 1) {
        socket.ping();
      }
    }, 30000);

    socket.on('message', (raw: any) => {
      try {
        const msg = JSON.parse(raw.toString());
        console.log(`📨 WS mensagem de ${userID}:`, msg);
      } catch {}
    });
    socket.on('close', () => {
      clearInterval(heartbeat);
      removeConnection(userID, socket);
    });
    socket.on('error', (err: any) => {
      console.error(`Websocket ERROR (${userID}):`, err.message);
      clearInterval(heartbeat);
      removeConnection(userID, socket);
    });
  });
};
