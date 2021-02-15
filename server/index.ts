import http from 'http';
import dotenv from 'dotenv';

import { torrentListSocket } from './services/websocket';
import app from './app';

dotenv.config();

const server = http.createServer();

torrentListSocket(server);

server.on('request', app);

server.listen(process.env.PORT, () => {
  console.log(`http/ws server listening on ${process.env.PORT}`);
});
