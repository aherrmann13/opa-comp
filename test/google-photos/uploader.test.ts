import {
  mockSignIn,
  mockUpload,
  reset as gphotosReset
} from '../__mocks__/upload-gphotos';
import {
  mockStat,
  reset as fsReset,
  mockCreateReadStream
} from '../__mocks__/fs-extra';

import * as path from 'path';

import { Uploader } from '../../src/google-photos/uploader';

describe('an Uploader', () => {
  beforeEach(() => {
    gphotosReset();
    fsReset();
  });
  describe('initialize', () => {
    it('should sign in', async () => {
      await Uploader.initialize('username', 'password');
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith({
        password: 'password',
        username: 'username'
      });
    });

    it('should throw error on bad sign in', async () => {
      const err = 'message';
      mockSignIn.mockImplementation(() => {
        throw new Error(err);
      });
      await expect(Uploader.initialize('u', 'p')).rejects.toThrowError(err);
    });
  });
  describe('upload', () => {
    const photo = { path: 'path', filename: 'filename' };
    const file = { size: 10 };

    it('should call stat on photo name', async () => {
      mockStat.mockImplementation(() => file);
      const uploader = await Uploader.initialize('u', 'p');

      await uploader.upload(photo);

      expect(mockStat).toHaveBeenCalledTimes(1);
      expect(mockStat).toHaveBeenLastCalledWith(
        path.join(photo.path, photo.filename)
      );
    });

    it('should throw error on stat error', async () => {
      const message = 'error';
      mockStat.mockImplementation(() => {
        throw new Error(message);
      });

      const uploader = await Uploader.initialize('u', 'p');

      await expect(uploader.upload(photo)).rejects.toThrowError(message);
    });

    it('should upload to gphotos', async () => {
      mockStat.mockImplementation(() => file);
      const readStream = 'this is hacky';
      mockCreateReadStream.mockImplementation(() => readStream);

      const uploader = await Uploader.initialize('u', 'p');
      await uploader.upload(photo);

      expect(mockUpload).toHaveBeenCalledTimes(1);
      expect(mockUpload).toHaveBeenCalledWith({
        stream: readStream,
        size: file.size,
        filename: path.join(photo.path, photo.filename)
      });
    });
  });
});
