import { Request, Response, NextFunction } from 'express';
import InputTorrent from 'interfaces/InputTorrent';
import {
  getAllTorrents as getAllTorrentsModel,
  addTorrent as addTorrentModel,
  addMagnet as addMagnetModel,
  getFileList as getFileListModel,
  recheckTorrent as recheckTorrentModel,
  startTorrent as startTorrentModel,
  stopTorrent as stopTorrentModel,
  deleteTorrents as deleteTorrentsModel,
  getTorrentInfo as getTorrentInfoModel
} from '../models/torrent';

export const getAllTorrents = async (_req: Request, res: Response) => {
  try {
    const torrents = await getAllTorrentsModel();

    res.status(200).send(torrents);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const addTorrents = async (req: Request, res: Response) => {
  const inputFiles = req.files as Express.Multer.File[] || []; // Default empty

  console.log(inputFiles);
  const { destination } = req.body;
  const parsedDestination: string[] | undefined = destination ? JSON.parse(destination) : undefined;

  const inputTorrents: InputTorrent[] = [...inputFiles];

  const fileUploads = inputTorrents.map(async (file: InputTorrent) => {
    let filename: string;
    let uploadError: Error;

    try {
      if (typeof file === 'string') {
        // It's a magnet link
        filename = file;
        await addMagnetModel(file, parsedDestination);
      } else {
        // It's a torrent file
        filename = file.originalname;
        await addTorrentModel(file.buffer, parsedDestination);
      }
    } catch (error) {
      console.error(error);
      uploadError = error;
    }
    return { name: filename, error: uploadError };
  });

  const uploadResult = await Promise.all(fileUploads);

  const isOverallFailure = uploadResult.some(result => !!result.error);

  const statusCode = isOverallFailure ? 500 : 200;

  const fileResults = uploadResult.map(result => ({
    success: !result.error,
    file: result.name
  }));

  res
    .status(statusCode)
    .send({ success: !isOverallFailure, files: fileResults });
};

export const getFileList = async (req: Request, res: Response) => {
  const { torrentHash } = req.params;

  const fileResponse = await getFileListModel(torrentHash);

  res.status(200).send({ response: { ...fileResponse, torrentHash } });
};

export const hashTorrent = async (req: Request, res: Response) => {
  const { torrentHash } = req.params;

  const hashResponse = await recheckTorrentModel(torrentHash);

  res.status(200).send({ response: hashResponse });
};

export const startTorrent = async (req: Request, res: Response) => {
  const { torrentHash } = req.params;

  const hashResponse = await startTorrentModel(torrentHash);

  res.status(200).send({ response: hashResponse });
};

export const stopTorrent = async (req: Request, res: Response) => {
  const { torrentHash } = req.params;

  const hashResponse = await stopTorrentModel(torrentHash);

  res.status(200).send({ response: hashResponse });
};

interface deleteTorrents { torrents: string[], withData: boolean }
export const deleteTorrents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { torrents = [], withData = false }: deleteTorrents = req.body;

    const [result] = await Promise.all(torrents.map((torrent) => deleteTorrentsModel(torrent, withData)));
    res.status(200).send({ response: result });
  } catch (err) {
    next(err);
  }
};

export const getTorrentFileInfo = (req: Request, res: Response) => {
  const inputFiles = req.files as Express.Multer.File[] || [];

  console.log(inputFiles);
  const mappedTorrents = inputFiles.map(f => ({
    ...getTorrentInfoModel(f.buffer),
    filename: f.originalname
  }));

  res.status(200).send({ response: mappedTorrents });
};
