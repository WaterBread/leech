import WebSocket from 'ws';
import { Server } from 'http';

export default (server: Server, path: string) => {
  const wss = new WebSocket.Server({
    server,
    path
  });

  return wss;
};
