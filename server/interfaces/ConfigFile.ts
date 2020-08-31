export interface ConfigFile {
  downloadPath: string[]
  theme: {
    primaryColor: string
    secondaryColor: string
    darkMode: boolean
  }
}

export default ConfigFile;
