export interface ModelSetting {
  [key: string]: ModelSetting | { validate: (value: any) => string[], default? : any }
}

export interface ErrorType {
  path: string
  errors: string[]
}

export interface PathMapping {
  sourcePath: string[]
  destinationPath: string[]
}
