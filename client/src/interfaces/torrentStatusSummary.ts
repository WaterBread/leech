export enum TorrentStatues {
  ALL = 'all',
  DOWNLOADING = 'downloading',
  UPLOADING = 'uploading',
  STOPPED = 'stopped',
  COMPLETED = 'completed',
  RECHECKING = 'rechecking',
  ERROR = 'error',
}

export default interface TorrentStatusSummary {
  [TorrentStatues.ALL]: number;
  [TorrentStatues.DOWNLOADING]: number;
  [TorrentStatues.UPLOADING]: number;
  [TorrentStatues.STOPPED]: number;
  [TorrentStatues.COMPLETED]: number;
  [TorrentStatues.RECHECKING]: number;
  [TorrentStatues.ERROR]: number;
}
