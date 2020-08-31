import parseTorrent from 'parse-torrent';
import { methodCall } from '../services/rtorrent';

import parser from '../services/rtorrent/queryBuilder/parser';

import {
  MultiCommand, Command,
  MethodTypes
} from '../services/rtorrent/queryBuilder/methods';

import * as dCommands from '../services/rtorrent/queryBuilder/attributes/d_commands';
import * as fCommands from '../services/rtorrent/queryBuilder/attributes/f_commands';

export const getAllTorrents = async () => {
  const command = new MultiCommand();
  const method = new Command(MethodTypes.dmulticall);

  method.addParameter('');
  method.addParameter('main');

  Object.values(dCommands.Attributes).forEach((attr) => {
    method.addParameter(attr);
  });

  command.addCommand(method);
  const response = await methodCall(command.serializeMethod());

  // Systemcall 0, multicall 0
  return parser(response[0][0], method.parameters);
};

export const addTorrent = async (torrentFile: Buffer, destination?: string[]) => {
  const method = new Command(MethodTypes.loadRaw);

  method.addParameter('');
  method.addParameter({ xmlName: torrentFile, apiName: 'torrent' }, true);

  if (destination) {
    // TODO: Does this need to be mapped???
    const filteredDestination = destination.filter(path => !!path);
    const joinedDestination = filteredDestination.join('/');
    method.addParameter(
      { xmlName: `${dCommands.Commands.directorySet.xmlName}"${joinedDestination}"` }, // TODO: Fix this
      false
    );
  }

  const response = await methodCall(method.serialize());
  return parser(response, method.parameters);
};

export const addMagnet = async (magnetLink: string, destination?: string[]) => {
  // parseTorrent(magnetLink);
  const method = new Command(MethodTypes.loadNormal);

  method.addParameter('');
  method.addParameter({ xmlName: magnetLink, apiName: magnetLink }, true);

  if (destination) {
    // TODO: Does this need to be mapped???
    const filteredDestination = destination.filter(path => !!path);
    const joinedDestination = filteredDestination.join('/');
    method.addParameter(
      { xmlName: `${dCommands.Commands.directorySet.xmlName}${joinedDestination}` },
      false
    );
  }

  const response = await methodCall(method.serialize());
  return parser(response, method.parameters);
};

interface GetFileListResponse { basePath: string[], fileList: string[] }
export const getFileList = async (torrentHash: string): Promise<GetFileListResponse> => {
  const fileListCommand = new Command(MethodTypes.fmulticall);
  fileListCommand.addParameter(torrentHash);
  fileListCommand.addParameter('');

  fileListCommand.addParameter(fCommands.pathComponents, true);

  const response = await methodCall(fileListCommand.serialize());

  const parsed = parser(response, fileListCommand.parameters);
  const fileList = parsed.map(file => file.filePathComponents);

  const basePathCommand = new Command(MethodTypes.directoryBase);
  basePathCommand.addParameter({ xmlName: torrentHash, apiName: 'basePath' });

  const basePathResponse = await methodCall(basePathCommand.serialize());
  const basePathParsed = parser(basePathResponse, basePathCommand.parameters);

  const splitBasePath: string[] = basePathParsed.basePath.split('/');
  console.log(splitBasePath);
  splitBasePath.shift();
  // const basePath = getMappedDirectory(splitBasePath);

  return { basePath: splitBasePath, fileList };
};

export const startTorrent = async (torrentHash: string) => {
  const command = new MultiCommand();
  const method = new Command(MethodTypes.tryStart);

  method.addParameter({ xmlName: torrentHash, apiName: torrentHash });

  command.addCommand(method);
  const [response] = await methodCall(command.serializeMethod());
  return parser(response[0], method.parameters);
};

export const stopTorrent = async (torrentHash: string) => {
  const method = new Command(MethodTypes.tryStop);

  console.log(torrentHash);
  method.addParameter({ xmlName: torrentHash, apiName: torrentHash });

  const response = await methodCall(method.serialize());
  return parser(response, method.parameters);
};

export const deleteTorrents = async (torrentHash: string, withData = false) => {
  const command = new MultiCommand();
  const method = new Command(MethodTypes.erase);

  method.addParameter({ xmlName: torrentHash, apiName: torrentHash });
  command.addCommand(method);

  const [response] = await methodCall(command.serializeMethod());
  return parser(response[0], method.parameters);
};

export const recheckTorrent = async (torrentHash: string) => {
  const command = new MultiCommand();
  const method = new Command(MethodTypes.checkHash);

  method.addParameter({ xmlName: torrentHash, apiName: torrentHash });
  command.addCommand(method);

  const [response] = await methodCall(command.serializeMethod());
  return parser(response[0], method.parameters);
};

export const getTorrentInfo = (torrent: Buffer) => {
  const parsedTorrent: any = parseTorrent(torrent);
  return {
    hash: parsedTorrent.infoHash,
    filesize: parsedTorrent.length,
    files: parsedTorrent.files,
    announceUrls: parsedTorrent.announce
  };
};

// export const getAllTrackers = () => {
//   const method = new Method(MethodTypes.dmulticall);

// }
