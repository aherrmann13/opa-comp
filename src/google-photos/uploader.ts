import { GPhotos } from 'upload-gphotos';
import * as fs from 'fs-extra';
import * as path from 'path';

import { Photo } from './photo';

export class Uploader {
  private _googlePhotos: GPhotos;
  private _batch: number;

  private constructor(batch: number) {
    this._googlePhotos = new GPhotos();
    this._batch = batch;
  }

  private signIn(username: string, password: string): Promise<void> {
    return this._googlePhotos.signin({ username, password });
  }

  static async initialize(username: string, password: string, batch: number): Promise<Uploader> {
    const uploader = new Uploader(batch);
    await uploader.signIn(username, password);
    return uploader;
  }

  async upload(photos: Photo[], callback?: (photo: Photo) => void): Promise<void> {
    // forEach does not handle async
    for (let i = 0; i < photos.length; i += this._batch) {
      await Promise.all(
        photos
          .slice(i, i + this._batch)
          .map(p => this.uploadInternal(p).then(() => (!!callback ? callback(p) : undefined)))
      );
    }
  }

  private async uploadInternal(photo: Photo): Promise<void> {
    const filename = path.join(photo.path, photo.filename);
    const file = await fs.stat(filename);
    try {
      file.size > 0
        ? await this._googlePhotos.upload({
            stream: fs.createReadStream(filename),
            size: file.size,
            filename: photo.filename
          })
        : Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }
}
