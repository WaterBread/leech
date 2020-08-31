import { promises as fs, existsSync } from 'fs';
import { set, get } from 'lodash';

import ConfigFile from '../interfaces/ConfigFile';

let configContents: ConfigFile;
const readConfigFile = async () => {
  if (!configFileExists()) {
    configContents = await createNewConfigFile();
  } else {
    try {
      const stringContents = (await fs.readFile(getConfigPath())).toString();
      configContents = JSON.parse(stringContents);
    } catch (e) {
      console.error(e);
      throw new Error('Could not parse config file, is it in the correct format?');
    }
  }
  return configContents;
};

const createNewConfigFile = async () => {
  const contents: ConfigFile = {
    theme: {
      primaryColor: '#ffffff',
      secondaryColor: '#ffffff',
      darkMode: false
    },
    downloadPath: ['/']
  };
  return await writeConfigFile(contents);
};

const getConfigPath = () => {
  return process.env.CONFIG_PATH;
};

const configFileExists = () => {
  return existsSync(getConfigPath());
};

const writeConfigFile = async (contents: ConfigFile) => {
  await fs.writeFile(getConfigPath(), JSON.stringify(contents));
  return contents;
};

export const getAllSettings = async () => {
  return await readConfigFile();
};

export const getSetting = async (settingName: string) => {
  const contents = await readConfigFile();
  return get(contents, settingName);
};

export const setSetting = async (settingName: string | undefined, value: any) => {
  const contents = await readConfigFile();
  if (settingName) {
    const updatedContents: ConfigFile = set(contents, settingName, value);
    return await writeConfigFile(updatedContents);
  } else {
    return await writeConfigFile(value);
  }
};
