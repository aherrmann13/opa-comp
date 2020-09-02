import { mockSignIn, mockUpload, reset as gphotosReset } from '../__mocks__/upload-gphotos';
import { mockStat, reset as fsReset, mockCreateReadStream } from '../__mocks__/fs-extra';
import * as path from 'path';
import { Uploader } from '../../src/google-photos/uploader';

describe('an Uploader', () => {
  beforeEach(() => {
    gphotosReset();
    fsReset();
  });
  describe('initialize', () => {
    it('should sign in', async () => {
      await Uploader.initialize('username', 'password', 10);
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
      await expect(Uploader.initialize('u', 'p', 10)).rejects.toThrowError(err);
    });
  });
  describe('upload', () => {
    const photo0 = { path: 'path0', filename: 'filename0' };
    const photo1 = { path: 'path1', filename: 'filename1' };
    const file = { size: 10 };

    it('should call stat on photo name', async () => {
      mockStat.mockImplementation(() => file);
      const uploader = await Uploader.initialize('u', 'p', 10);

      await uploader.upload([photo0, photo1]);

      expect(mockStat).toHaveBeenCalledTimes(2);
      expect(mockStat).toHaveBeenCalledWith(path.join(photo0.path, photo0.filename));
      expect(mockStat).toHaveBeenCalledWith(path.join(photo1.path, photo1.filename));
    });

    it('should upload to gphotos', async () => {
      mockStat.mockImplementation(() => file);
      const readStream = 'this is hacky';
      mockCreateReadStream.mockImplementation(() => readStream);

      const uploader = await Uploader.initialize('u', 'p', 10);
      await uploader.upload([photo0, photo1]);

      expect(mockUpload).toHaveBeenCalledTimes(2);
      expect(mockUpload).toHaveBeenCalledWith({
        stream: readStream,
        size: file.size,
        filename: photo0.filename
      });
      expect(mockUpload).toHaveBeenCalledWith({
        stream: readStream,
        size: file.size,
        filename: photo1.filename
      });
    });

    it('should execute callback for each photo', async () => {
      mockStat.mockImplementation(() => file);
      const callback = jest.fn();
      mockCreateReadStream.mockImplementation(() => 'this is hacky');

      const uploader = await Uploader.initialize('u', 'p', 10);
      await uploader.upload([photo0, photo1], callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(photo0);
      expect(callback).toHaveBeenCalledWith(photo1);
    });

    it('should skip upload if photo size is 0', async () => {
      mockStat.mockImplementationOnce(() => ({ ...file, size: 0 })).mockImplementationOnce(() => file);
      const callback = jest.fn();
      mockCreateReadStream.mockImplementation(() => 'this is hacky');

      const uploader = await Uploader.initialize('u', 'p', 10);
      await uploader.upload([photo0, photo1], callback);

      expect(mockUpload).toHaveBeenCalledTimes(1);
      expect(mockUpload).toHaveBeenCalledWith({ stream: 'this is hacky', size: file.size, filename: photo1.filename });
    });

    it('should batch properly', async () => {
      mockStat.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 2000)));
      const callTime: Date[] = [];
      const callback: () => void = () => callTime.push(new Date());
      mockCreateReadStream.mockImplementation(() => 'this is hacky');

      const uploader = await Uploader.initialize('u', 'p', 2);

      await uploader.upload([photo0, photo1, photo0], callback);

      expect(callTime).toHaveLength(3);
      console.log(callTime);
      expect(callTime[0].getTime() + 2000).toBeLessThanOrEqual(callTime[2].getTime());
      expect(callTime[1].getTime() + 2000).toBeLessThanOrEqual(callTime[2].getTime());
    });
  });
});
