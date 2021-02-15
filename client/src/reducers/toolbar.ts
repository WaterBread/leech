import {
  ADD_MODAL_VISIBLE,
  CHANGE_SEARCH_TERM,
  CHANGE_STATUS_FILTER,
  DELETE_MODAL_VISIBLE,
  CHANGE_SELECTED_TORRENTS,
  CHANGE_TRACKER_FILTER,
  SETTINGS_MODAL_VISIBLE,
  ADD_SELECTED_TORRENTS,
  REMOVE_SELECTED_TORRENTS,
} from 'actions/toolbar';

import { TorrentStatues } from 'interfaces/torrentStatusSummary';

const initialState = {
  addModalVisible: false,
  searchTerm: '',
  status: TorrentStatues.ALL,
  selectedTorrentHashes: [],
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_MODAL_VISIBLE:
      return {
        ...state,
        addModalVisible: action.isOpen,
      };
    case DELETE_MODAL_VISIBLE:
      return {
        ...state,
        deleteModalVisible: action.isOpen,
      };
    case SETTINGS_MODAL_VISIBLE:
      return {
        ...state,
        settingsModalVisible: action.isOpen,
      };
    case CHANGE_SELECTED_TORRENTS:
      return {
        ...state,
        selectedTorrentHashes: action.hashes,
      };
    case ADD_SELECTED_TORRENTS:
      return {
        ...state,
        selectedTorrentHashes: [...state.selectedTorrentHashes, ...action.hashes],
      };
    case REMOVE_SELECTED_TORRENTS:
      return {
        ...state,
        selectedTorrentHashes: state.selectedTorrentHashes.filter(hash => !action.hashes.includes(hash)),
      };
    case CHANGE_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };

    case CHANGE_STATUS_FILTER:
      return {
        ...state,
        status: action.status,
      };

    case CHANGE_TRACKER_FILTER:
      return {
        ...state,
        trackerFilter: action.tracker,
      };

    default:
      return state;
  }
};
