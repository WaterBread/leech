import { RequestAction } from 'interfaces/requestAction';

export const FETCH_STORAGE_SPACE = 'FETCH_STORAGE_SPACE';
export const FETCH_STORAGE_SPACE_SUCCESS = `${FETCH_STORAGE_SPACE}_SUCCESS`;
export const FETCH_STORAGE_SPACE_FAILED = `${FETCH_STORAGE_SPACE}_FAILED`;

export const fetchDiskSpace = (): RequestAction => {
  return {
    type: FETCH_STORAGE_SPACE,
    request: {
      method: 'get',
      endpoint: 'system/diskspace',
    },
  };
};
