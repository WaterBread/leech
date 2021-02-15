export interface TorrentResponse {
  baseFilename: string
  basePath: string[]
  bytesDone: number
  completedBytes: number
  createdTime: number
  directory: string[]
  directoryBase: string[]
  downloadRate: number
  downloaded: number
  hash: string
  isActive: boolean
  isComplete: boolean
  isHashChecking: boolean
  isHashing: boolean
  isOpen: boolean
  isPrivate: boolean
  message: string
  name: string
  peersConnected: number
  priority: number
  ratio: number
  sizeBytes: number
  isStarted: boolean
  stateChanged: number
  trackers: string[]
  uploadRate: number
  uploaded: number
}

export interface FilesResponse {
  filePath: string
  filePathComponents: string[]
  priority: number
  sizeBytes: number
  sizeChunks: number
  completedChunks: number
}

export interface StopStartResponse {
  [hash: string]: boolean
}

export interface Parameter {
  apiName?: string
  xmlName: string | Buffer
  formatResponse?: (resp: string) => any
  expectResponse: boolean
}

export interface FaultResponse {
  faultCode: number
  faultString: string
}

export type InputParameter = Omit<Parameter, 'expectResponse'>;
