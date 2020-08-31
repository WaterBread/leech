import get from 'lodash/get';
import { MappedTorrent } from 'interfaces/torrent';
import TorrentStatusSummary from 'interfaces/torrentStatusSummary';
import TorrentFileList from 'interfaces/torrentFileList';
import { TorrentUploadSummary } from 'interfaces/torrentUploadSummary';

export const getAllTorrents = (state: any): MappedTorrent[] => {
  return get(state, 'torrents.torrentList', []);
};

export const isTorrentsLoading = (state: any): MappedTorrent[] => {
  return get(state, 'torrents.isLoading', true);
};

export const isDeletePending = (state: any): MappedTorrent[] => {
  return get(state, 'torrents.torrentList', []);
};

export const getPendingTorrentInfo = (state: any): any[] => {
  return get(state, 'torrents.fileInfo');
};

export const getTorrentStatusSummary = (state: any): TorrentStatusSummary => {
  return get(state, 'torrents.summary', {});
};

export const getTorrentFileList = (torrentHash: string): ((state: any) => TorrentFileList) => {
  return (state: any) => {
    console.log(torrentHash);
    console.log(get(state, `torrents.fileList.${torrentHash}`));
    return get(state, `torrents.fileList.${torrentHash}`, {});
  };
};

export const getTorrentUploadSummary = (state: any): TorrentUploadSummary => {
  const summary = get(state, 'torrents.uploadSummary');
  return summary;
};
