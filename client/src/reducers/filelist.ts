import * as FileListActions from 'actions/filelist';
import { get, isEmpty } from 'lodash';
import { RequestActionData } from 'interfaces/requestAction';
import { FileListState } from 'interfaces/filelist';

export const initialState: FileListState = {
  currentDirectory: { files: [], currentDirectory: '/', hasFailed: false, isLoading: false },
  existingFiles: [],
};

export default (state = initialState, action: RequestActionData) => {
  switch (action.type) {
    case FileListActions.REQUEST_FILE_LIST_SUCCESS:
      const fileResponse = get(action, 'payload.response');
      const files = isEmpty(fileResponse) ? initialState.currentDirectory : fileResponse;
      return {
        ...state,
        currentDirectory: {
          ...files,
          hasFailed: false,
          isLoading: false,
        },
      };
    case FileListActions.REQUEST_FILE_LIST_FAILURE:
      return { ...state, currentDirectory: { ...state.currentDirectory, hasFailed: true, isLoading: false } };
    case FileListActions.REQUEST_FILE_LIST_PENDING:
      return { ...state, currentDirectory: { ...state.currentDirectory, hasFailed: false, isLoading: true } };

    case FileListActions.REQUEST_CHECK_FILES_EXIST_SUCCESS:
      return { ...state, existingFiles: get(action, 'payload.response', {}) };
    default:
      return state;
  }
};
