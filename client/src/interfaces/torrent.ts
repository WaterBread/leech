export interface Torrent {
  baseFilename: string;
  basePath: string;
  bytesDone: number;
  completedBytes: number;
  createdTime: number;
  directory: string;
  directoryBase: string;
  downloadRate: number;
  downloaded: number;
  filename: string;
  hash: string;
  isComplete: boolean;
  isHashChecking: boolean;
  isHashing: boolean;
  isOpen: boolean;
  isPrivate: boolean;
  message: string;
  peersConnected: number;
  priority: 0 | 1 | 2 | 3; // off, low, normal, high
  ratio: number;
  sizeBytes: number;
  state: number;
  stateChanged: number;
  uploadRate: number;
  uploaded: number;
  trackers: string[];
}

export interface MappedTorrent extends Torrent {
  isUploading: boolean;
  isDownloading: boolean;
  isStopped: boolean;
  isActive: boolean;
  isError: boolean;
  percentComplete: number;
  status: string;
}
