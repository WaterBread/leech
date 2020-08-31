import { Router, NextFunction, Request, Response } from 'express';

import multer from 'multer';
import {
  addTorrents,
  getTorrentFileInfo,
  getAllTorrents,
  getFileList,
  hashTorrent,
  startTorrent,
  stopTorrent,
  deleteTorrents
} from '../controllers/torrent';

const torrentRouter = Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10000000 },
  storage: multer.memoryStorage()
});

torrentRouter.get('/', getAllTorrents);
torrentRouter.post('/', upload.array('torrents'), addTorrents);
torrentRouter.post('/fileinfo', upload.array('torrents'), getTorrentFileInfo);

torrentRouter.get('/:torrentHash/filelist', getFileList);
torrentRouter.post('/:torrentHash/recheck', hashTorrent);
torrentRouter.post('/:torrentHash/start', startTorrent);
torrentRouter.post('/:torrentHash/stop', stopTorrent);

torrentRouter.post('/delete', deleteTorrents);

torrentRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({});
});

export default torrentRouter;
