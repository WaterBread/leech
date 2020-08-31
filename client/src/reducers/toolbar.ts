import {
  ADD_MODAL_VISIBLE,
  CHANGE_SEARCH_TERM,
  CHANGE_STATUS_FILTER,
  DELETE_MODAL_VISIBLE,
  CHANGE_SELECTED_TORRENT,
  CHANGE_TRACKER_FILTER,
  SETTINGS_MODAL_VISIBLE,
} from 'actions/toolbar';

import { TorrentStatues } from 'interfaces/torrentStatusSummary';

const initialState = {
  addModalVisible: false,
  searchTerm: '',
  status: TorrentStatues.ALL,
};

export default (state: {} = initialState, action: any) => {
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
    case CHANGE_SELECTED_TORRENT:
      return {
        ...state,
        selectedTorrentHash: action.hash,
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
