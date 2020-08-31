import { TorrentStatues } from 'interfaces/torrentStatusSummary';

export const ADD_MODAL_VISIBLE = 'ADD_MODAL_VISIBLE';
export const DELETE_MODAL_VISIBLE = 'DELETE_MODAL_VISIBLE';
export const SETTINGS_MODAL_VISIBLE = 'SETTINGS_MODAL_VISIBLE';

export const CHANGE_SELECTED_TORRENT = 'CHANGE_SELECTED_TORRENT';
export const CHANGE_SEARCH_TERM = 'CHANGE_SEARCH_TERM';
export const CHANGE_STATUS_FILTER = 'CHANGE_STATUS_FILTER';
export const CHANGE_TRACKER_FILTER = 'CHANGE_TRACKER_FILTER';

export const toggleAddModal = (isOpen = true) => {
  return {
    type: ADD_MODAL_VISIBLE,
    isOpen,
  };
};

export const toggleDeleteModal = (isOpen = true) => {
  return {
    type: DELETE_MODAL_VISIBLE,
    isOpen,
  };
};

export const toggleSettingsModal = (isOpen = true) => {
  return {
    type: SETTINGS_MODAL_VISIBLE,
    isOpen,
  };
};

export const changeSelectedTorrent = (hash: string | undefined) => {
  return {
    type: CHANGE_SELECTED_TORRENT,
    hash,
  };
};

export const changeSearchText = (searchTerm: string) => {
  return {
    type: CHANGE_SEARCH_TERM,
    searchTerm,
  };
};

export const changeStatusFilter = (status: TorrentStatues) => {
  return {
    type: CHANGE_STATUS_FILTER,
    status,
  };
};

export const changeTrackerFilter = (tracker: string) => {
  return {
    type: CHANGE_TRACKER_FILTER,
    tracker,
  };
};
