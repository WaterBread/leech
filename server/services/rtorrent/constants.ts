import { dCommands } from './attributes';
import { InputParameter } from './interfaces';

function select<T, K extends keyof T> (obj: T, keys: K[]): InputParameter[] {
  const ret: any[] = [];
  keys.forEach((key) => {
    ret.push({ ...obj[key], apiName: key });
  });
  return ret;
}

export const defaultTorrentFieldNames: Array<keyof typeof dCommands & string> = [
  'baseFilename',
  'basePath',
  'bytesDone',
  'completedBytes',
  'createdTime',
  'directory',
  'directoryBase',
  'downloadRate',
  'downloaded',
  'hash',
  'isActive',
  'isComplete',
  'isHashChecking',
  'isHashing',
  'isOpen',
  'isPrivate',
  'isStarted',
  'message',
  'name',
  'peersConnected',
  'priority',
  'ratio',
  'sizeBytes',
  'stateChanged',
  'trackers',
  'uploadRate',
  'uploaded'
];

export const defaultTorrentFields = select(
  dCommands,
  defaultTorrentFieldNames
);
