import get from 'lodash/get';
import { TorrentStatues } from 'interfaces/torrentStatusSummary';
import { MappedTorrent } from 'interfaces/torrent';

export const isAddModalOpen = (state: any) => {
  return get(state, 'toolbar.addModalVisible', false);
};

export const isDeleteModalOpen = (state: any) => {
  return get(state, 'toolbar.deleteModalVisible', false);
};

interface SelectedTorrent {
  hash: string;
  torrent: MappedTorrent | undefined;
}
export const getSelectedTorrent = (state: any): SelectedTorrent => {
  const hash = get(state, 'toolbar.selectedTorrentHash');
  const torrents: MappedTorrent[] = get(state, 'torrents.torrentList', []);

  const torrent = torrents.find(torrent => torrent.hash === hash);

  return { hash, torrent };
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
