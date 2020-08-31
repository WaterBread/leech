import { promises, existsSync } from 'fs';
import { sep } from 'path';
import rimraf from 'rimraf';

interface File {
  name: string
  path: string[]
  isDirectory: boolean
  hasPermission: boolean
  size?: number
}

interface FileListResponse {
  directory: string[]
  files: File[]
}

export const getFilePath = (directory: string[], fileName?: string) => {
  const fullPath = fileName ? [...directory, fileName] : directory;
  return fullPath.length === 0 ? sep : fullPath.reduce((prev, current) => {
    if (!prev) return `${current}`;
    else return `${prev}${sep}${current}`;
  }, '');
};

export const replaceFirstElementInArray = (arr: string[], stringToReplace: string, newString) => {
  const copiedPath = [...arr];
  const replacedPath = copiedPath[0].replace(stringToReplace, newString);
  copiedPath.shift();
  return [replacedPath, ...copiedPath];
};

interface MappedDirectory { torrentPath: string[], serverPath: string[] }
export const getMappedDirectory = (pathToReplace: string[]): MappedDirectory => {
  const LOCAL_ROOT = process.env.LOCAL_ROOT;
  const REMOTE_ROOT = process.env.REMOTE_ROOT;

  const nonBlankPath = pathToReplace.filter(path => path !== '');

  if (nonBlankPath.length > 0) {
    if (LOCAL_ROOT && REMOTE_ROOT) {
      if (nonBlankPath[0].includes(LOCAL_ROOT)) {
        const replacedPath = replaceFirstElementInArray(nonBlankPath, LOCAL_ROOT, REMOTE_ROOT);
        return { torrentPath: replacedPath, serverPath: nonBlankPath };
      }

      if (nonBlankPath[0].includes(REMOTE_ROOT)) {
        const replacedPath = replaceFirstElementInArray(nonBlankPath, REMOTE_ROOT, LOCAL_ROOT);
        return { torrentPath: nonBlankPath, serverPath: replacedPath };
      }
    }
  }

  const torrentPath = REMOTE_ROOT ? [REMOTE_ROOT, ...nonBlankPath] : nonBlankPath;
  const serverPath = LOCAL_ROOT ? [LOCAL_ROOT, ...nonBlankPath] : nonBlankPath;

  return { torrentPath, serverPath };
};

export const getFileList = async (directory = [] as string[]): Promise<FileListResponse> => {
  const rootPath = getMappedDirectory(directory);
  const directoryPath = getFilePath(rootPath.serverPath);

  const files = await promises.readdir(directoryPath);
  return {
    directory: directory,
    files: await Promise.all(files.map(async (file) => {
      try {
        const fileStats = await promises.stat(getFilePath(rootPath.serverPath, file));

        return {
          name: file,
          path: [...rootPath.torrentPath, file],
          isDirectory: fileStats.isDirectory(),
          size: fileStats.size,
          hasPermission: true
        };
      } catch (err) {
        console.warn(err);
        return { name: file, path: [...rootPath.torrentPath, file], isDirectory: false, hasPermission: false };
      }
    }))
  };
};

export const getAllFilesList = async (directory = [] as string[]) => {
  const directoryFileList = await getFileList(directory);

  const fileList = [];
  for (const file of directoryFileList.files) {
    if (file.isDirectory) {
      fileList.push(...(await getAllFilesList(file.path)));
    } else {
      fileList.push(file.path);
    }
  }

  return fileList;
};

export const checkFilesExist = (filePaths: string[][]) => {
  return filePaths.map((filepath) => {
    const rootPath = getMappedDirectory(filepath);
    const joinedPath = getFilePath(rootPath.serverPath);
    return existsSync(joinedPath);
  });
};

interface DeleteFilesResponse { success: boolean, filepath: string[] }
export const deleteFiles = async (filePaths: string[][]): Promise<DeleteFilesResponse[]> => {
  return await Promise.all(filePaths.map(async filepath => {
    return await new Promise<DeleteFilesResponse>((resolve) => {
      const rootPath = getMappedDirectory(filepath);
      const joinedPath = getFilePath(rootPath.serverPath);

      console.log('rimraf', joinedPath);
      rimraf(joinedPath, (err) => {
        console.log(err);
        if (err) {
          // Don't want to reject as it'll blow up the rest of the Promise.all
          console.error(err);
          resolve({ success: false, filepath });
        } else resolve({ success: true, filepath });
      });
    });
  })
  );
};
