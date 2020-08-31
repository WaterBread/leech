export interface FileList {
  name: string;
  path: string[];
  isDirectory: boolean;
  hasPermission: boolean;
  size?: number;
}

export interface FileListResponse {
  directory: string[];
  files: FileList[];
}

export interface CurrentDirectory {
  files: FileList[];
  currentDirectory: string;
  hasFailed: boolean;
  isLoading: boolean;
}

export interface FileListState {
  currentDirectory: CurrentDirectory;
  existingFiles: boolean[];
}
