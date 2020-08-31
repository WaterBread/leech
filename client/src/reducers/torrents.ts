import {
  GET_TORRENT_LIST_SUCCESS,
  GET_TORRENT_LIST_FAILURE,
  FILE_INFO_SUCCESS,
  GET_FILE_LIST_SUCCESS,
  UPLOAD_TORRENTS_SUCCESS,
  UPLOAD_TORRENTS_FAILURE,
} from 'actions/torrents';
import { get, set } from 'lodash';
import { RequestActionData } from 'interfaces/requestAction';
import { Torrent, MappedTorrent } from 'interfaces/torrent';
import prettyBytes from 'pretty-bytes';
import { TorrentUploadSummary } from 'interfaces/torrentUploadSummary';

const initialState = {
  torrentList: [] as MappedTorrent[],
  filteredTorrentList: [],
  isLoading: true,
  fileList: {},
  fileInfo: {},
  uploadSummary: {},
};

const priorityMapping = {
  0: 'None',
  1: 'Low',
  2: 'Normal',
  3: 'High',
};

// TODO: Find a proper place for this
const torrentListMapper = (torrentList: Torrent[]) => {
  const summary = {
    all: 0,
    downloading: 0,
    uploading: 0,
    stopped: 0,
    completed: 0,
    rechecking: 0,
    error: 0,
  };

  const mappedList = torrentList.map(torrent => {
    const isUploading = torrent.uploadRate !== 0;
    const isDownloading = torrent.downloadRate !== 0;
    const isError = torrent.message.length > 0;

    const isStopped = torrent.state === 0;
    const isActive = isUploading || isDownloading || torrent.isHashing;

    if (isDownloading) summary.downloading++;
    if (isUploading) summary.uploading++;
    if (isStopped) summary.stopped++;
    if (torrent.isHashing) summary.rechecking++;
    if (torrent.isComplete) summary.completed++;
    if (isError) summary.error++;

    const uploadRate = torrent.uploadRate === 0 ? '-' : `${prettyBytes(torrent.uploadRate)}/s`;
    const downloadRate = torrent.downloadRate === 0 ? '-' : `${prettyBytes(torrent.downloadRate)}/s`;
    const percentComplete = torrent.completedBytes / torrent.sizeBytes;
    const status = priorityMapping[torrent.priority];
    const isPrivate = torrent.isPrivate ? 'Yes' : 'No';
    const sizeBytes = prettyBytes(torrent.sizeBytes);
    const completedBytes = prettyBytes(torrent.completedBytes);

    summary.all++;

    return {
      ...torrent,
      uploadRate,
      downloadRate,
      percentComplete,
      isUploading,
      isDownloading,
      isStopped,
      isActive,
      status,
      isPrivate,
      sizeBytes,
      completedBytes,
      isError,
    };
  });

  return {
    torrentList: mappedList,
    summary,
  };
};

export default (state = initialState, action: RequestActionData) => {
  switch (action.type) {
    case GET_TORRENT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ...torrentListMapper(action.payload),
      };
    // case GET_TORRENT_LIST_PENDING:
    //   return state;
    case GET_TORRENT_LIST_FAILURE:
      console.log('Got a failure chief');
      return state;
    case FILE_INFO_SUCCESS:
      const mapped = action.payload.response.reduce((prev: object, file: any) => {
        return set(prev, `["${file.filename}"]`, file);
      }, {});
      return {
        ...state,
        fileInfo: { ...state.fileInfo, ...mapped },
      };
    case GET_FILE_LIST_SUCCESS:
      return {
        ...state,
        fileList: {
          ...state.fileList,
          [action.payload.response.torrentHash]: action.payload.response,
        },
      };
    case UPLOAD_TORRENTS_SUCCESS:
      const response: TorrentUploadSummary = get(action, 'payload');
      return {
        ...state,
        uploadSummary: response,
      };
    default:
      return state;
  }
};
