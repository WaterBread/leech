import { Request, Response, NextFunction } from 'express';
import * as fileListModel from '../models/filelist';

export const getDirectoryList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { directory } = req.body;

    const files = await fileListModel.getAllFiles(directory);

    res.status(200).send({ response: files });
  } catch (err) {
    next(err);
  }
};

export const checkFilesExist = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filepaths } = req.body;

    if (filepaths && Array.isArray(filepaths)) {
      res.status(200).send({ response: fileListModel.checkFilesExist(filepaths) });
    } else {
      res.status(400).send({ response: 'filepaths must be an array' });
    }
  } catch (err) {
    next(err);
  }
};

export const deleteFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filepaths } = req.body;

    const deletedFiles = await fileListModel.deleteFiles(filepaths);

    if (filepaths && Array.isArray(filepaths)) {
      res.status(200).send({ response: deletedFiles });
    } else {
      res.status(400).send({ response: 'filepaths must be an array' });
    }
  } catch (err) {
    next(err);
  }
};
