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
    const photo0 = { path: 'path0', filename: 'filename0' };
    const photo1 = { path: 'path1', filename: 'filename1' };
    const file = { size: 10 };

    it('should call stat on photo name', async () => {
      mockStat.mockImplementation(() => file);
      const uploader = await Uploader.initialize('u', 'p');

      await uploader.upload([photo0, photo1]);

      expect(mockStat).toHaveBeenCalledTimes(2);
      expect(mockStat).toHaveBeenCalledWith(
        path.join(photo0.path, photo0.filename)
      );
      expect(mockStat).toHaveBeenCalledWith(
        path.join(photo1.path, photo1.filename)
      );
    });

    it('should upload to gphotos', async () => {
      mockStat.mockImplementation(() => file);
      const readStream = 'this is hacky';
      mockCreateReadStream.mockImplementation(() => readStream);

      const uploader = await Uploader.initialize('u', 'p');
      await uploader.upload([photo0, photo1]);

      expect(mockUpload).toHaveBeenCalledTimes(2);
      expect(mockUpload).toHaveBeenCalledWith({
        stream: readStream,
        size: file.size,
        filename: path.join(photo0.path, photo0.filename)
      });
      expect(mockUpload).toHaveBeenCalledWith({
        stream: readStream,
        size: file.size,
        filename: path.join(photo1.path, photo1.filename)
      });
    });

    it('should execute callback for each photo', async () => {
      mockStat.mockImplementation(() => file);
      const callback = jest.fn();
      mockCreateReadStream.mockImplementation(() => 'this is hacky');

      const uploader = await Uploader.initialize('u', 'p');
      await uploader.upload([photo0, photo1], callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(photo0, 0);
      expect(callback).toHaveBeenCalledWith(photo1, 1);
    });
  });
});
