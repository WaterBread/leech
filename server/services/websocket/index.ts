import WebSocket from 'ws';
import { Server } from 'http';

import isEqual from 'lodash/isEqual';
import { getAllTorrents } from '../../services/rtorrent/queries';

const webSocket = (server: Server, path: string) => {
  const wss = new WebSocket.Server({
    server,
    path
  });

  return wss;
};

export const torrentListSocket = (server: Server) => {
  const wss = webSocket(server, '/torrentlist');

  let previousTorrents;
  wss.on('connection', () => {
    previousTorrents = undefined;
  });

  const clientLoop = () => {
    setTimeout(() => {
      if (wss.clients.size !== 0) {
        getAllTorrents()
          .then((torrentList) => {
            if (!isEqual(previousTorrents, torrentList)) {
              console.log('Torrent list changed, pushing changes');
              const torrentsPayload = JSON.stringify(torrentList);
              wss.clients.forEach((client) => {
                client.send(torrentsPayload);
              });
            }

            previousTorrents = torrentList;
            clientLoop();
          })
          .catch((err) => {
            console.error(err);
            clientLoop();
          });
      } else {
        console.log('No one listening...');
        clientLoop();
      }
    }, 3000);
  };

  clientLoop();
};
