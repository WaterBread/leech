import { InputParameter } from 'services/rtorrent/interfaces';
import { toBoolean, splitStringBySeparator, parseTracker } from '../formatters';

const Attributes: { [name: string]: InputParameter } = {
  name: { xmlName: 'd.name=' },
  hash: { xmlName: 'd.hash=' },
  message: { xmlName: 'd.message=' },
  isStarted: { xmlName: 'd.state=', formatResponse: toBoolean },
  priority: { xmlName: 'd.priority=' },
  stateChanged: { xmlName: 'd.state_changed=' },

  baseFilename: { xmlName: 'd.base_filename=' },
  basePath: { xmlName: 'd.base_path=', formatResponse: splitStringBySeparator },
  directoryBase: { xmlName: 'd.directory_base=', formatResponse: splitStringBySeparator },
  directory: { xmlName: 'd.directory=', formatResponse: splitStringBySeparator },

  completedBytes: { xmlName: 'd.completed_bytes=' },
  sizeBytes: { xmlName: 'd.size_bytes=' },
  downloaded: { xmlName: 'd.down.total=' },
  uploaded: { xmlName: 'd.up.total=' },
  downloadRate: { xmlName: 'd.down.rate=' },
  uploadRate: { xmlName: 'd.up.rate=' },
  createdTime: { xmlName: 'd.creation_date=' },
  isPrivate: { xmlName: 'd.is_private=', formatResponse: toBoolean },
  ratio: { xmlName: 'd.ratio=' },
  peersConnected: { xmlName: 'd.peers_connected=' },
  bytesDone: { xmlName: 'd.bytes_done=' },
  isActive: { xmlName: 'd.is_active=', formatResponse: toBoolean },
  isComplete: { xmlName: 'd.complete=', formatResponse: toBoolean },
  isHashing: { xmlName: 'd.hashing=', formatResponse: toBoolean },
  isHashChecking: { xmlName: 'd.is_hash_checking=', formatResponse: toBoolean },
  isOpen: { xmlName: 'd.is_open=', formatResponse: toBoolean },
  directorySet: { xmlName: 'd.directory.set=' },
  trackers: {
    xmlName: 'cat="$t.multicall=d.hash=,t.url=,cat={#}"',
    formatResponse: (response: string) => {
      const trackers: string[] = response.split('#');
      trackers.pop();
      return trackers.reduce((prev, tracker) => {
        return [...prev, parseTracker(tracker)];
      }, []);
    }
  }
};

export default Attributes;
