interface FileStatus {
  success: boolean;
  file: string;
}

export interface TorrentUploadSummary {
  files: FileStatus[];
  success: boolean;
}
