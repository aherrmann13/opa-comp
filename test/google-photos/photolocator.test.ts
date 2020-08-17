import { mockReaddirSync } from '../__mocks__/fs-extra';
import * as path from 'path';
import { Dirent } from 'fs-extra';

import { findPhotos } from '../../src/google-photos/photolocator';

/**
 * dir0
 * | --- photo0.jpeg
 * | --- photo1.png
 * | --- dir1
 *       | --- doc0.docx
 *       | --- photo2.gif
 * | --- dir2
 *       | --- dir3
 *             | --- photo3.tiff
 *             | --- doc1.xlsx
 */

const photo0 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'photo0.jpeg' } as Dirent;
const photo1 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'photo1.png' } as Dirent;
const photo2 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'photo2.gif' } as Dirent;
const photo3 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'photo3.tiff' } as Dirent;
const doc0 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'doc0.docx' } as Dirent;
const doc1 = { isDirectory: (): boolean => false, isFile: (): boolean => true, name: 'doc1.xlsx' } as Dirent;
const dir0 = { isDirectory: (): boolean => true, isFile: (): boolean => false, name: 'dir0' };
const dir1 = { isDirectory: (): boolean => true, isFile: (): boolean => false, name: 'dir1' };
const dir2 = { isDirectory: (): boolean => true, isFile: (): boolean => false, name: 'dir2' };
const dir3 = { isDirectory: (): boolean => true, isFile: (): boolean => false, name: 'dir3' };

mockReaddirSync.mockImplementation(dirName => {
  switch (dirName) {
    case dir0.name:
      return [photo0, photo1, dir1, dir2];
    case path.join(dir0.name, dir1.name):
      return [doc0, photo2];
    case path.join(dir0.name, dir2.name):
      return [dir3];
    case path.join(dir0.name, dir2.name, dir3.name):
      return [photo3, doc1];
  }
});

describe('photolocator', () => {
  it('should return all photos in directories recursively', () => {
    const result = findPhotos(dir0.name);
    const expected = [
      {
        path: dir0.name,
        filename: photo0.name
      },
      {
        path: dir0.name,
        filename: photo1.name
      },
      {
        path: path.join(dir0.name, dir1.name),
        filename: photo2.name
      },
      {
        path: path.join(dir0.name, dir2.name, dir3.name),
        filename: photo3.name
      }
    ];
    expected.forEach(x => expect(result).toContainEqual(x));
    expect(result).toHaveLength(expected.length);
  });
});
