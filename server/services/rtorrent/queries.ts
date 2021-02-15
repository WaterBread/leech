import { MultiCommand, Command, CommandTypes, MultiCall, MulticallCommandTypes } from './';
import { FilesResponse, TorrentResponse } from './interfaces';
import { dCommands, fCommands, pCommands } from './attributes';
import parseTorrent from 'parse-torrent';
import { defaultTorrentFieldNames } from './constants';
import { get } from 'lodash';
import { sep } from 'path';
import { getValidFields } from './utils';

export * as Client from './client';

export const getAllTorrents = async (
  fields = defaultTorrentFieldNames
): Promise<TorrentResponse[]> => {
  const validFields = getValidFields(fields);

  // DMulticall should be handled like a MultiCall type :'(
  const command = new MultiCall(MulticallCommandTypes.dmulticall);

  command.addParameter('', false);
  command.addParameter('main', false);
  command.addParameters(validFields, true);

  return (await command.execute())[0];
};

const changeTorrentStatues = async (
  torrentHash: string[],
  enabled: boolean
): Promise<boolean[]> => {
  const methodType = enabled ? CommandTypes.tryStart : CommandTypes.tryStop;
  const command = new MultiCommand();

  // Add each torrent hash
  torrentHash.forEach((hash) => {
    const cmd = new Command(methodType);
    cmd.addParameter(hash, true);
    command.addCommand(cmd);
  });

  // Map response to sensible object
  const [result] = await command.execute();
  return result.map((status: any, idx: number) => get(status, torrentHash[idx], -1) === 0);
};

export const stopTorrents = async (
  torrentHash: string[]
): Promise<boolean[]> => {
  return await changeTorrentStatues(torrentHash, false);
};

export const stopTorrent = async (torrentHash: string) => {
  return (await stopTorrents([torrentHash]))[0];
};

export const startTorrents = async (
  torrentHash: string[]
): Promise<boolean[]> => {
  return await changeTorrentStatues(torrentHash, true);
};

export const startTorrent = async (torrentHash: string) => {
  return (await startTorrents([torrentHash]))[0];
};

export const addTorrents = async (
  torrentFiles: Buffer[],
  destination?: string[]
): Promise<boolean[]> => {
  const multiMethod = new MultiCommand();
  for (const torrentFile of torrentFiles) {
    // Throw if not a valid torrent file
    const { announce } = parseTorrent(torrentFile);

    // RTorrent HATES torrents without at least 1 announce url, but still accepts them?
    if (announce.length === 0) {
      throw new Error('Torrent must have at least 1 announce url');
    }

    const cmd = new Command(CommandTypes.loadRaw);
    cmd.addParameter('', false);
    cmd.addParameter({ xmlName: torrentFile, apiName: 'torrent' }, true);

    if (destination) {
      const joinedDestination = destination.join(sep);
      const xmlName = dCommands.directorySet.xmlName as string;
      cmd.addParameter(
        {
          xmlName: `${xmlName}"${joinedDestination}"`
        },
        false
      );
    }

    multiMethod.addCommand(cmd);
  }

  const response = await multiMethod.execute();

  return response.map((item: any) => get(item, [0, 'torrent'], -1) === 0);
};

export const addTorrent = async (torrent: Buffer) => {
  return (await addTorrents([torrent]))[0];
};

export const addMagnet = async (magnetLink: string, destination?: string) => {
  const command = new Command(CommandTypes.loadStart);

  command.addParameter('', false);
  command.addParameter(magnetLink, true);

  if (destination) {
    command.addParameter(`directorySet=${destination}`, false);
  }

  return await command.execute();
};

export const deleteTorrents = async (
  torrentHashes: string[]
): Promise<boolean[]> => {
  const multiCommand = new MultiCommand();

  for (const hash of torrentHashes) {
    const command = new Command(CommandTypes.erase);
    command.addParameter({ xmlName: hash, apiName: 'torrent' }, true);

    multiCommand.addCommand(command);
  }

  const response = await multiCommand.execute();
  return response.map((item: any) => get(item, [0, 'torrent'], -1) === 0);
};

export const deleteTorrent = async (torrentHash: string) => {
  return (await deleteTorrents([torrentHash]))[0];
};

export const recheckTorrents = async (
  torrentHashes: string[]
): Promise<boolean[]> => {
  const multiCommand = new MultiCommand();
  for (const hash of torrentHashes) {
    const command = new Command(CommandTypes.checkHash);
    command.addParameter({ xmlName: hash, apiName: 'torrent' }, true);

    multiCommand.addCommand(command);
  }

  const response = await multiCommand.execute();
  return response.map((item: any) => get(item, [0, 'torrent'], -1) === 0);
};

export const recheckTorrent = async (torrentHash: string) => {
  return (await recheckTorrents([torrentHash]))[0];
};

export const getFiles = async (torrentHash: string): Promise<FilesResponse[]> => {
  const command = new MultiCall(MulticallCommandTypes.fmulticall);

  command.addParameter(torrentHash, false);
  command.addParameter('', false);

  Object.values(fCommands).forEach(param => command.addParameter(param, true));

  return (await command.execute())[0];
};

export const getPeers = async (torrentHash: string) => {
  const command = new MultiCall(MulticallCommandTypes.pmulticall);

  command.addParameter(torrentHash, false);
  command.addParameter('', false);

  command.addParameter(pCommands.id, true);
  command.addParameter(pCommands.port, true);
  command.addParameter(pCommands.address, true);
  command.addParameter(pCommands.clientVersion, true);

  command.addParameter(pCommands.downRate, true);
  command.addParameter(pCommands.downTotal, true);
  command.addParameter(pCommands.upRate, true);
  command.addParameter(pCommands.upTotal, true);

  command.addParameter(pCommands.banned, true);
  return (await command.execute())[0];
};

export const banPeer = async (torrentHash: string, peerId: string) => {
// TODO
};

export const kickPeer = async (torrentHash: string, peerId: string) => {
  const command = new Command(CommandTypes.disconnectPeer);

  command.addParameter(`${torrentHash}:p${peerId}`, true);

  return (await command.execute())[0] === 0;
};
