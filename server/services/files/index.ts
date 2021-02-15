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

const unescapeSpecialCharacters = (value: string) => {
  // For now I just need to filter out the &amp; chars
  return value.replace(/&amp;/g, '&');
};

export const getFilePath = (directory: string[], fileName?: string) => {
  const fullPath = fileName ? [...directory, fileName] : directory;
  return fullPath.length === 0 ? sep : fullPath.reduce((prev, current) => {
    return `${prev}${sep}${unescapeSpecialCharacters(current)}`;
  }, '');
};

export const replaceFirstElementInArray = (arr: string[], stringToReplace: string, newString) => {
  const copiedPath = [...arr];
  const replacedPath = copiedPath[0].replace(stringToReplace, newString);
  copiedPath.shift();
  return [replacedPath, ...copiedPath];
};

export const getFileList = async (directory = [] as string[]): Promise<FileListResponse> => {
  const directoryPath = getFilePath(directory);
  const files = await promises.readdir(directoryPath);
  return {
    directory: directory,
    files: await Promise.all(files.map(async (file) => {
      try {
        const fileStats = await promises.stat(getFilePath(directory, file));

        return {
          name: file,
          path: [...directory, file],
          isDirectory: fileStats.isDirectory(),
          size: fileStats.size,
          hasPermission: true
        };
      } catch (err) {
        console.warn(err);
        return { name: file, path: [...directory, file], isDirectory: false, hasPermission: false };
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
    const joinedPath = getFilePath(filepath);
    return existsSync(joinedPath);
  });
};

interface DeleteFilesResponse { success: boolean, filepath: string[] }
export const deleteFiles = async (filePaths: string[][]): Promise<DeleteFilesResponse[]> => {
  return await Promise.all(filePaths.map(async filepath => {
    return await new Promise<DeleteFilesResponse>((resolve) => {
      const joinedPath = getFilePath(filepath);

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
