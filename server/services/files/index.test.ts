import * as files from './index';
import { mocked } from 'ts-jest/utils';

import { sep } from 'path';
import rimraf from 'rimraf';

const readdirMock = jest.fn();
jest.mock('fs', () => ({
  promises: {
    readdir: async (path: string, options: any) => await Promise.resolve(readdirMock())
  }
}));
jest.mock('rimraf');

describe('FilesService', () => {
  describe('getFilePath', () => {
    it('should create a environment specific filepath from a string array', () => {
      const path = files.getFilePath(['first', 'second']);
      expect(path).toBe(`first${sep}second`);
    });

    it('should append the filename to the given path', () => {
      const path = files.getFilePath(['first', 'second'], 'third');
      expect(path).toBe(`first${sep}second${sep}third`);
    });
  });
  describe('replaceFirstElementInArray', () => {
    it('should replace the first element of a path array with a new string', () => {
      const arr = files.replaceFirstElementInArray(
        ['oldString', 'notReplaceThis'],
        'oldString',
        'newString'
      );
      expect(arr).toStrictEqual(['newString', 'notReplaceThis']);
    });

    it('should not replace first element if the element does not exist', () => {
      const arr = files.replaceFirstElementInArray(
        ['oldString', 'notReplaceThis'],
        'dontExist',
        'newString'
      );
      expect(arr).toStrictEqual(['oldString', 'notReplaceThis']);
    });

    it('should not replace first element if it does not exist in the first element', () => {
      const arr = files.replaceFirstElementInArray(
        ['oldString', 'notReplaceThis'],
        'notReplaceThis',
        'newString'
      );
      expect(arr).toStrictEqual(['oldString', 'notReplaceThis']);
    });
  });
  describe('checkFilesExist', () => {});
  describe('getFilePath', () => {});
  describe('deleteFiles', () => {
    const rimrafMock = mocked(rimraf);
    beforeAll(() => {
      rimrafMock.mockImplementation((somepath: string, callback: (error?: Error) => void) => callback());
    });
    it('should delete all files', async () => {
      const filelist = await files.deleteFiles([['some', 'path']]);
      expect(rimrafMock).toHaveBeenCalledTimes(1);
      expect(rimrafMock.mock.calls[0][0]).toBe('some\\path');
      expect(filelist).toBeDefined();
    });
  });
  describe('getFileList', () => {
    it('should return all files', async () => {
      readdirMock.mockImplementation(() => []);
      const filelist = await files.getFileList();
      expect(filelist).toBeDefined();
    });
  });
  describe('getAllFiles', () => {
    it('should return a list of all files', async () => {
      const allFiles = await files.getAllFilesList();
      expect(allFiles).toBeDefined();
    });
  });
});
