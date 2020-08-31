import { Router, NextFunction, Request, Response } from 'express';
import {
  getDirectoryList,
  checkFilesExist,
  deleteFiles
} from '../controllers/filelist';

const filelistRouter = Router();

filelistRouter.post('/list', getDirectoryList);
filelistRouter.post('/check', checkFilesExist);
filelistRouter.post('/delete', deleteFiles);

filelistRouter.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({});
});

export default filelistRouter;
