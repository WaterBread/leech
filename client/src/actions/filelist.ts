import { RequestAction } from 'interfaces/requestAction';

export const REQUEST_FILE_LIST = 'REQUEST_FILE_LIST';
export const REQUEST_FILE_LIST_SUCCESS = `${REQUEST_FILE_LIST}_SUCCESS`;
export const REQUEST_FILE_LIST_PENDING = `${REQUEST_FILE_LIST}_PENDING`;
export const REQUEST_FILE_LIST_FAILURE = `${REQUEST_FILE_LIST}_FAILED`;

export const REQUEST_CHECK_FILES_EXIST = 'REQUEST_CHECK_FILES_EXIST';
export const REQUEST_CHECK_FILES_EXIST_SUCCESS = `${REQUEST_CHECK_FILES_EXIST}_SUCCESS`;
export const REQUEST_CHECK_FILES_EXIST_PENDING = `${REQUEST_CHECK_FILES_EXIST}_PENDING`;
export const REQUEST_CHECK_FILES_EXIST_FAILURE = `${REQUEST_CHECK_FILES_EXIST}_FAILED`;

export const REQUEST_FILE_DELETE = 'REQUEST_FILE_DELETE';

export const getDirectoryFileList = (directory: string[] | undefined): RequestAction => {
  return {
    type: REQUEST_FILE_LIST,
    request: {
      method: 'post',
      endpoint: 'filelist/list',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        directory: directory,
      }),
    },
  };
};

export const checkFilesExist = (filepaths: string[][]): RequestAction => {
  return {
    type: REQUEST_CHECK_FILES_EXIST,
    request: {
      method: 'post',
      endpoint: 'filelist/check',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        filepaths,
      }),
    },
  };
};

export const deleteFiles = (filepaths: string[][]): RequestAction => {
  return {
    type: REQUEST_FILE_DELETE,
    request: {
      method: 'post',
      endpoint: 'filelist/delete',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        filepaths,
      }),
    },
  };
};
