import { Request, Response } from 'express';
import * as queries from '../services/rtorrent/queries';

export const getAllTorrents = async (req: Request, res: Response) => {
  try {
    const { fields } = req.body;
    const torrents = await queries.getAllTorrents(fields);

    res.status(200).send({ torrents });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const stopTorrents = async (req: Request, res: Response) => {
  try {
    const { hashes } = req.body;
    const response = await queries.stopTorrents(hashes);

    res.status(200).send({ response });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const startTorrents = async (req: Request, res: Response) => {
  try {
    const { hashes } = req.body;
    const response = await queries.startTorrents(hashes);

    res.status(200).send({ response });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
