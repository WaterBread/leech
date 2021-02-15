import {
  getAllTorrents,
  stopTorrents,
  // startTorrents,
  addTorrents,
  // deleteTorrents,
  deleteTorrent,
  startTorrent,
  // addMagnet,
  getFiles,
  getPeers,
  // kickPeer,
  recheckTorrent
} from './queries';
import { readFileSync } from 'fs';

const addTestTorrent = async () => {
  const torrentFile = readFileSync('test-data/test-torrent.torrent');
  return await addTorrents([torrentFile], ['downloads']);
};

describe('rtorrent', () => {
  beforeAll(() => {
    // nock.recorder.rec();
    process.env.SOCK_HOST = 'localhost';
    process.env.SOCK_PORT = '1234';
  });
  describe('Query Smoke Test', () => {
    afterAll(async () => {
      // Clean it up
      // await deleteTorrent('627310A842897A6730F4F8624DB50B5E0594BF87');
    });
    it('should add a torrent', async () => {
      const added = await addTestTorrent();

      expect(added).toHaveLength(1);
      expect(added[0]).toBeTruthy();
    });

    it('should get all torrents', async () => {
      const torrents = await getAllTorrents();

      expect(torrents).toHaveLength(1);
      expect(torrents[0].name).toBe('a folder');
      expect(torrents[0].hash).toBe('627310A842897A6730F4F8624DB50B5E0594BF87');
      expect(torrents[0].isStarted).toBe(true);
    });

    it('should delete a torrent', async () => {
      const deleted = await deleteTorrent(
        '627310A842897A6730F4F8624DB50B5E0594BF87'
      );

      expect(deleted).toBeTruthy();
      const torrents = await getAllTorrents();
      expect(torrents).toHaveLength(0);
    });

    it('should re-add the torrent', async () => {
      const added = await addTestTorrent();

      expect(added).toHaveLength(1);
      expect(added[0]).toBeTruthy();
    });

    it('should stop a torrent', async () => {
      const stopped = await stopTorrents([
        '627310A842897A6730F4F8624DB50B5E0594BF87'
      ]);
      expect(stopped).toHaveLength(1);
      expect(stopped[0]).toBeTruthy();

      const torrents = await getAllTorrents();
      expect(torrents[0].isStarted).toBeFalsy();
    });

    it('should start a torrent', async () => {
      const started = await startTorrent(
        '627310A842897A6730F4F8624DB50B5E0594BF87'
      );
      expect(started).toBeTruthy();

      const torrents = await getAllTorrents();
      expect(torrents[0].isStarted).toBeTruthy();
    });

    it('should recheck a torrent', async () => {
      const rechecked = await recheckTorrent('627310A842897A6730F4F8624DB50B5E0594BF87');

      expect(rechecked).toBeTruthy();

      const torrents = await getAllTorrents();
      expect(torrents[0].isHashChecking).toBeTruthy(); // Uhhh race condition
    });

    it('should list all the torrent files', async () => {
      const files = await getFiles('627310A842897A6730F4F8624DB50B5E0594BF87');

      expect(files).toHaveLength(2);
      expect(files).toMatchInlineSnapshot(`
        Array [
          Object {
            "completedChunks": 1,
            "filePath": "test file 1.txt",
            "filePathComponents": Array [
              "test file 1.txt",
            ],
            "priority": 1,
            "sizeBytes": 13,
            "sizeChunks": 1,
          },
          Object {
            "completedChunks": 1,
            "filePath": "test file 2.txt",
            "filePathComponents": Array [
              "test file 2.txt",
            ],
            "priority": 1,
            "sizeBytes": 13,
            "sizeChunks": 1,
          },
        ]
      `);
    });

    it('should list all the peers', async () => {
      const peers = await getPeers('627310A842897A6730F4F8624DB50B5E0594BF87');
      // TODO: I have no idea how to test this without it being really lame
      expect(peers).toHaveLength(0);
    });
  });
});
