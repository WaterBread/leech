import * as fileService from '../services/files';

export const getAllFiles = async (directory: string[] | undefined) => {
  return await fileService.getFileList(directory);
};

export const checkFilesExist = (filepaths: string[][]) => {
  return fileService.checkFilesExist(filepaths);
};

export const deleteFiles = async (filepaths: string[][]) => {
  const deletedFiles = await fileService.deleteFiles(filepaths);

  const success = [];
  const failure = [];

  deletedFiles.forEach(item => {
    if (item.success) success.push(item.filepath);
    else failure.push(item.filepath);
  });

  return { success, failure };
};
