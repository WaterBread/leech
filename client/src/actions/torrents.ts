import { RequestAction } from 'interfaces/requestAction';
import { Torrent } from 'interfaces/torrent';

export const GET_TORRENT_LIST = 'GET_TORRENT_LIST';

export const GET_TORRENT_LIST_PENDING = `${GET_TORRENT_LIST}_PENDING`;
export const GET_TORRENT_LIST_SUCCESS = `${GET_TORRENT_LIST}_SUCCESS`;
export const GET_TORRENT_LIST_FAILURE = `${GET_TORRENT_LIST}_FAILED`;

export const DELETE_TORRENT = 'DELETE_TORRENT';
export const DELETE_TORRENT_PENDING = `${DELETE_TORRENT}_PENDING`;
export const DELETE_TORRENT_FAILED = `${DELETE_TORRENT}_FAILED`;
export const DELETE_TORRENT_SUCCESS = `${DELETE_TORRENT}_SUCCESS`;

export const FILE_INFO = 'FILE_INFO';
export const FILE_INFO_PENDING = `${FILE_INFO}_PENDING`;
export const FILE_INFO_FAILED = `${FILE_INFO}_FAILED`;
export const FILE_INFO_SUCCESS = `${FILE_INFO}_SUCCESS`;

export const STOP_TORRENT = 'STOP_TORRENT';
export const START_TORRENT = 'START_TORRENT';

export const UPLOAD_TORRENTS = 'UPLOAD_TORRENTS';
export const UPLOAD_TORRENTS_SUCCESS = `${UPLOAD_TORRENTS}_SUCCESS`;
export const UPLOAD_TORRENTS_FAILURE = `${UPLOAD_TORRENTS}_FAILURE`;

export const RECHECK_TORRENT = 'RECHECK_TORRENT';

export const GET_FILE_LIST = 'FILE_LIST';
export const GET_FILE_LIST_SUCCESS = `${GET_FILE_LIST}_SUCCESS`;

export const getTorrentList = (): RequestAction => {
  return {
    type: GET_TORRENT_LIST,
    request: {
      method: 'get',
      endpoint: 'torrent',
    },
  };
};

export const deleteTorrent = (torrentHash: string, withData = false): RequestAction => {
  return {
    type: DELETE_TORRENT,
    request: {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `torrent/delete`,
      payload: JSON.stringify({
        torrents: [torrentHash],
        withData,
      }),
    },
  };
};

export const stopTorrent = (torrentHash: string): RequestAction => {
  return {
    type: STOP_TORRENT,
    request: {
      method: 'post',
      endpoint: `torrent/${torrentHash}/stop`,
    },
  };
};

export const startTorrent = (torrentHash: string): RequestAction => {
  return {
    type: START_TORRENT,
    request: {
      method: 'post',
      endpoint: `torrent/${torrentHash}/start`,
    },
  };
};

export const uploadTorrents = (torrentList: Array<File | string>, destination?: string[]): RequestAction => {
  const data = new FormData();
  torrentList.forEach(torrent => {
    if (typeof torrent !== 'string') {
      data.append('torrents', torrent);
    }
  });

  // TODO: Make this better lmao
  torrentList.forEach(torrent => {
    if (typeof torrent === 'string') {
      data.append('torrents', torrent);
    }
  });

  if (destination) {
    data.append('destination', JSON.stringify(destination));
  }

  return {
    type: UPLOAD_TORRENTS,
    request: {
      method: 'post',
      // headers: { 'Content-Type': 'multipart/form-data' },
      endpoint: `torrent`,
      payload: data,
    },
  };
};

export const getTorrentFileInfo = (torrents: File[]): RequestAction => {
  const formData = new FormData();
  torrents.forEach(torrent => formData.append('torrents', torrent));

  return {
    type: FILE_INFO,
    request: {
      method: 'post',
      endpoint: `torrent/fileinfo`,
      payload: formData,
    },
  };
};

export const recheckTorrent = (torrentHash: string): RequestAction => {
  return {
    type: RECHECK_TORRENT,
    request: {
      method: 'post',
      endpoint: `torrent/${torrentHash}/recheck`,
    },
  };
};

export const getTorrentFileList = (torrentHash: string): RequestAction => {
  return {
    type: GET_FILE_LIST,
    request: {
      method: 'get',
      endpoint: `torrent/${torrentHash}/filelist`,
    },
  };
};
