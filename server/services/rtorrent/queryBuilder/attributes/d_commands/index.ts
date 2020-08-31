import Attribute from 'interfaces/Attribute';

const toNumber = (val: any) => Number(val);
const toBoolean = (val: any) => Boolean(Number(val));

function asAttributes<T extends { [key: string]: Attribute }> (list: T): T {
  return list;
}

const urlExpr = /(?:https?|udp):\/\/(?:www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,18}\b)*(\/[/\d\w.-]*)*(?:[?])*(.+)*/i;

export const parseTracker = (tracker: string) => {
  const domain = urlExpr.exec(tracker);
  return domain[1];
};

export const Attributes = asAttributes({
  name: { xmlName: 'd.name=', apiName: 'filename' },
  hash: { xmlName: 'd.hash=', apiName: 'hash' },
  message: { xmlName: 'd.message=', apiName: 'message' },
  state: { xmlName: 'd.state=', apiName: 'state', formatResponse: toNumber },
  priority: { xmlName: 'd.priority=', apiName: 'priority', formatResponse: toNumber },
  stateChanged: { xmlName: 'd.state_changed=', apiName: 'stateChanged' },
  basePath: { xmlName: 'd.base_path=', apiName: 'basePath' },
  directoryBase: { xmlName: 'd.directory_base=', apiName: 'directoryBase' },
  baseFilename: { xmlName: 'd.base_filename=', apiName: 'baseFilename' },
  directory: { xmlName: 'd.directory=', apiName: 'directory' },
  completedBytes: { xmlName: 'd.completed_bytes=', apiName: 'completedBytes', formatResponse: toNumber },
  sizeBytes: { xmlName: 'd.size_bytes=', apiName: 'sizeBytes', formatResponse: toNumber },
  downloaded: { xmlName: 'd.down.total=', apiName: 'downloaded', formatResponse: toNumber },
  uploaded: { xmlName: 'd.up.total=', apiName: 'uploaded', formatResponse: toNumber },
  downloadRate: { xmlName: 'd.down.rate=', apiName: 'downloadRate', formatResponse: toNumber },
  uploadRate: { xmlName: 'd.up.rate=', apiName: 'uploadRate', formatResponse: toNumber },
  createdTime: { xmlName: 'd.creation_date=', apiName: 'createdTime', formatResponse: toNumber },
  isPrivate: { xmlName: 'd.is_private=', apiName: 'isPrivate', formatResponse: toBoolean },
  ratio: { xmlName: 'd.ratio=', apiName: 'ratio', formatResponse: toNumber },
  peersConnected: { xmlName: 'd.peers_connected=', apiName: 'peersConnected', formatResponse: toNumber },
  bytesDone: { xmlName: 'd.bytes_done=', apiName: 'bytesDone', formatResponse: toNumber },
  isActive: { xmlName: 'd.is_active=', apiName: 'isActive', formatResponse: toBoolean },
  isComplete: { xmlName: 'd.complete=', apiName: 'isComplete', formatResponse: toBoolean },
  isHashing: { xmlName: 'd.hashing=', apiName: 'isHashing', formatResponse: toBoolean },
  isHashChecking: { xmlName: 'd.is_hash_checking=', apiName: 'isHashChecking', formatResponse: toBoolean },
  isOpen: { xmlName: 'd.is_open=', apiName: 'isOpen', formatResponse: toBoolean },
  trackers: {
    xmlName: 'cat="$t.multicall=d.hash=,t.url=,cat={#}"',
    apiName: 'trackers',
    formatResponse: (response) => {
      const trackers: string[] = response.split('#');
      trackers.pop();
      return trackers.reduce((prev, tracker) => {
        return [...prev, parseTracker(tracker)];
      }, []);
    }
  }
});

export const Commands = asAttributes({
  directorySet: { xmlName: 'd.directory.set=', apiName: 'directorySet' }
});
