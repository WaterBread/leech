import { Request, Response } from 'express';
import * as systemModal from '../models/system';

export const getDiskSpaceSummary = async (req: Request, res: Response) => {
  try {
    const diskSpace = await systemModal.getUsedDiskSpaceSummary();
    res.status(200).send({ diskSpace });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
};
