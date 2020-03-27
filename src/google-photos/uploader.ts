import { GPhotos } from 'upload-gphotos';
import * as fs from 'fs-extra';
import * as path from 'path';

import { Photo } from './photo';

export class Uploader {
  private _googlePhotos: GPhotos;

  private constructor() {
    this._googlePhotos = new GPhotos();
  }

  private signIn(username: string, password: string): Promise<void> {
    return this._googlePhotos.signin({ username, password });
  }

  static async initialize(
    username: string,
    password: string
  ): Promise<Uploader> {
    const uploader = new Uploader();
    await uploader.signIn(username, password);
    return uploader;
  }

  async upload(
    photos: Photo[],
    callback?: (photo: Photo, i: number) => void
  ): Promise<void> {
    // forEach does not handle async
    for (let i = 0; i < photos.length; i++) {
      await this.uploadInternal(photos[i]);
      !!callback ? callback(photos[i], i) : undefined;
    }
  }

  private async uploadInternal(photo: Photo): Promise<void> {
    const filename = path.join(photo.path, photo.filename);
    const file = await fs.stat(filename);
    await this._googlePhotos.upload({
      stream: fs.createReadStream(filename),
      size: file.size,
      filename
    });
  }
}
