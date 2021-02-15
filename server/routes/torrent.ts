import { Router, NextFunction, Request, Response } from 'express';
import stopStartSchema from '../schemas/stopStartSchema';
import { validate } from '../schemas';

import multer from 'multer';
import {
  getAllTorrents,
  stopTorrents,
  startTorrents
} from '../controllers/torrent';

const torrentRouter = Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10000000 },
  storage: multer.memoryStorage()
});

torrentRouter.get('/', getAllTorrents);
torrentRouter.post('/stop', stopStartSchema, validate, stopTorrents);
torrentRouter.post('/start', stopStartSchema, validate, startTorrents);

// Break this out into separate magnet endpoint
// torrentRouter.post('/', upload.array('torrents'), addTorrents);
// torrentRouter.post('/fileinfo', upload.array('torrents'), getTorrentFileInfo);

torrentRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({});
});

export default torrentRouter;
