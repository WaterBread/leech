import get from 'lodash/get';
import { FileListState } from 'interfaces/filelist';

interface File {
  name: string;
  path: string[];
  isDirectory: boolean;
  hasPermission: boolean;
  size?: number;
}

export interface CurrentDirectory {
  directory: string[];
  files: File[];
  hasFailed: boolean;
  isLoading: boolean;
}

export const getCurrentFileList = (state: { filelist: FileListState }): CurrentDirectory => {
  return get(state, 'filelist.currentDirectory', {});
};

export const getExistingFiles = (state: { filelist: FileListState }): boolean[] => {
  return get(state, 'filelist.existingFiles', []);
};
