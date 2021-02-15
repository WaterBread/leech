import get from 'lodash/get';
import { TorrentStatues } from 'interfaces/torrentStatusSummary';
import { MappedTorrent } from 'interfaces/torrent';

export const isAddModalOpen = (state: any) => {
  return get(state, 'toolbar.addModalVisible', false);
};

export const isDeleteModalOpen = (state: any) => {
  return get(state, 'toolbar.deleteModalVisible', false);
};

export const getSelectedTorrents = (state: any): MappedTorrent[] => {
  const hashes: string[] = get(state, 'toolbar.selectedTorrentHashes');
  const allTorrents: MappedTorrent[] = get(state, 'torrents.torrentList', []);

  const selectedTorrents = allTorrents.filter(torrent => hashes.includes(torrent.hash));
  return selectedTorrents;
};

export const getSearchTerm = (state: any) => {
  return get(state, 'toolbar.searchTerm', '');
};

export const getTorrentStatusFilter = (state: any) => {
  return get(state, 'toolbar.status', TorrentStatues.ALL);
};

export const getTorrentTrackerFilter = (state: any) => {
  return get(state, 'toolbar.trackerFilter');
};
