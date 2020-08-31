import http from 'http';
import dotenv from 'dotenv';

import isEqual from 'lodash/isEqual';
import { getAllTorrents } from './models/torrent';
import websocket from './services/websocket';
import app from './app';

dotenv.config();

const server = http.createServer();
const torrentListSocket = websocket(server, '/torrentlist');

server.on('request', app);

let previousTorrents;

torrentListSocket.on('connection', () => {
  previousTorrents = undefined;
});

const pollRate = 3000;
const clientLoop = () => {
  setTimeout(() => {
    if (torrentListSocket.clients.size !== 0) {
      getAllTorrents().then(torrentList => {
        if (!isEqual(previousTorrents, torrentList)) {
          console.log('Torrent list changed, pushing changes');
          const torrentsPayload = JSON.stringify(torrentList);
          torrentListSocket.clients.forEach(client => {
            client.send(torrentsPayload);
          });
        }

        previousTorrents = torrentList;
        clientLoop();
      }).catch(err => {
        console.error(err);
        clientLoop();
      });
    } else {
      console.log('No one listening...');
      clientLoop();
    }
  }, pollRate);
};

console.log(`Polling rtorrent at rate of ${pollRate}`);
clientLoop();

server.listen(process.env.PORT, () => {
  console.log(`http/ws server listening on ${process.env.PORT}`);
});
