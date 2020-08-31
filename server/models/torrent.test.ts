import * as TorrentModel from './torrent';
import { mocked } from 'ts-jest/utils';
import getAllTorrentsMock from './mocks/getAllTorrents';
import { firstCall, secondCall } from './mocks/getFileList';

import { readFileSync } from 'fs';
import { methodCall } from '../services/rtorrent';

jest.mock('../services/rtorrent');

const stringProperties = [
  'baseFilename',
  'basePath',
  'directory',
  'directoryBase',
  'filename',
  'hash',
  'stateChanged'
];
const numberProperties = [
  'bytesDone',
  'completedBytes',
  'createdTime',
  'downloadRate',
  'downloaded',
  'peersConnected',
  'priority',
  'ratio',
  'sizeBytes',
  'state',
  'uploadRate',
  'uploaded'
];
const booleanProperties = [
  'isActive',
  'isComplete',
  'isHashChecking',
  'isHashing',
  'isOpen',
  'isPrivate'
];
const arrayProperties = ['trackers'];

const toHaveProperties = (obj: any, props: string[]) => {
  props.forEach((prop) => {
    expect(obj).toHaveProperty(prop);
  });
};

describe('TorrentModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTorrents', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve(getAllTorrentsMock);
      });
    });

    it('the returned object should have all the expected properties', async () => {
      const torrentList = await TorrentModel.getAllTorrents();
      expect(methodCall).toHaveBeenCalledTimes(1);

      expect(torrentList).toHaveLength(2);

      toHaveProperties(torrentList[0], [
        ...stringProperties,
        ...numberProperties,
        ...booleanProperties,
        ...arrayProperties
      ]);
      toHaveProperties(torrentList[1], [
        ...stringProperties,
        ...numberProperties,
        ...booleanProperties,
        ...arrayProperties
      ]);
    });

    it('should return an object with the valid types in the response', async () => {
      const torrentList = await TorrentModel.getAllTorrents();
      expect(torrentList).toHaveLength(2);

      stringProperties.forEach(prop => {
        expect(typeof torrentList[0][prop]).toBe('string');
        expect(typeof torrentList[1][prop]).toBe('string');
      });

      numberProperties.forEach(prop => {
        expect(typeof torrentList[0][prop]).toBe('number');
        expect(typeof torrentList[1][prop]).toBe('number');
      });

      booleanProperties.forEach(prop => {
        expect(typeof torrentList[0][prop]).toBe('boolean');
        expect(typeof torrentList[1][prop]).toBe('boolean');
      });

      arrayProperties.forEach(prop => {
        expect(Array.isArray(torrentList[0][prop])).toBeTruthy();
        expect(Array.isArray(torrentList[1][prop])).toBeTruthy();
      });
    });

    it('should construct a valid systemcall command', async () => {
      await TorrentModel.getAllTorrents();
      expect(methodCall).toHaveBeenCalledTimes(1);

      expect(mocked(methodCall).mock.calls[0][0]).toBeTruthy();
    });
  });

  describe('addTorrent', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve(0);
      });
    });

    it('should throw an error from an invalid torrent file', async () => {
      const file = Buffer.from('');
      await expect(TorrentModel.addTorrent(file)).rejects.toThrow();
    });

    it('should return a successfully response from a valid torrent file', async () => {
      const realTorrentFile = readFileSync(
        'test-data/testing torrent - solus linux.torrent'
      );
      const addTorrentResponse = await TorrentModel.addTorrent(realTorrentFile);
      expect(methodCall).toHaveBeenCalledTimes(1);
      expect(addTorrentResponse.torrent).toBe(0);
    });

    it('should construct a valid xml command using a valid torrent', async () => {
      const realTorrentFile = readFileSync(
        'test-data/testing torrent - solus linux.torrent'
      );
      await TorrentModel.addTorrent(realTorrentFile);
      expect(mocked(methodCall).mock.calls[0][0]).toBeTruthy();
    });

    it('should construct a valid xml command using a valid torrent and a destination', async () => {
      const realTorrentFile = readFileSync(
        'test-data/testing torrent - solus linux.torrent'
      );
      await TorrentModel.addTorrent(realTorrentFile, ['some', 'destination']);
      expect(mocked(methodCall).mock.calls[0][0]).toBeTruthy();
    });
  });

  describe('getFileList', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementationOnce(async (_xml: string) => {
        return await Promise.resolve(firstCall);
      });

      mockedMethodCall.mockImplementationOnce(async (_xml: string) => {
        return await Promise.resolve(secondCall);
      });
    });

    it('should successfully return a file list', async () => {
      const fileList = await TorrentModel.getFileList('123');
      expect(methodCall).toHaveBeenCalledTimes(2);

      expect(fileList).toHaveProperty('basePath');
      expect(fileList).toHaveProperty('fileList');
      expect(Array.isArray(fileList.basePath)).toBe(true);
      expect(Array.isArray(fileList.fileList)).toBeTruthy();
      expect(fileList.fileList).toHaveLength(29);
    });
  });

  describe('startTorrent', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve([[0]]);
      });
    });

    it('should successfully start a torrent', async () => {
      const startResponse = await TorrentModel.startTorrent('123');
      expect(methodCall).toHaveBeenCalledTimes(1);

      expect(startResponse).toHaveProperty('123');
      expect(startResponse[123]).toBe(0);
    });
  });

  describe('stopTorrent', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve(0);
      });
    });

    it('should successfully stop a torrent', async () => {
      const stopResponse = await TorrentModel.stopTorrent('123');
      expect(methodCall).toHaveBeenCalledTimes(1);

      expect(stopResponse).toHaveProperty('123');
      expect(stopResponse[123]).toBe(0);
    });
  });

  describe('deleteTorrents', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve([[0]]);
      });
    });

    it('should successfully delete a torrent', async () => {
      const deleteResponse = await TorrentModel.deleteTorrents('123');
      expect(methodCall).toHaveBeenCalledTimes(1);

      expect(deleteResponse).toHaveProperty('123');
      expect(deleteResponse[123]).toBe(0);
    });
  });

  describe('recheckTorrent', () => {
    beforeAll(() => {
      const mockedMethodCall = mocked(methodCall, true);
      mockedMethodCall.mockImplementation(async (_xml: string) => {
        return await Promise.resolve([[0]]);
      });
    });
  });

  describe('getTorrentInfo', () => {});
});
