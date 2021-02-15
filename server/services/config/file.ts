import { promises as fs, existsSync } from 'fs';

const getConfigPath = () => {
  return process.env.CONFIG_PATH;
};

export const read = async () => {
  try {
    const stringContents = (await fs.readFile(getConfigPath())).toString();
    return JSON.parse(stringContents);
  } catch (e) {
    console.error(e);
    throw new Error('Could not parse config file, is it in the correct format?');
  }
};

export const configExists = () => {
  return existsSync(getConfigPath());
};

export const write = async (contents: any) => {
  await fs.writeFile(getConfigPath(), JSON.stringify(contents));
  return contents;
};
