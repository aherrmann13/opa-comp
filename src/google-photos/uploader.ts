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

  async upload(photo: Photo): Promise<void> {
    const fileName = path.join(photo.path, photo.filename);
    const file = await fs.stat(fileName);
    await this.uploadInternal(fileName, file.size);
  }

  private async uploadInternal(filename: string, size: number): Promise<void> {
    await this._googlePhotos.upload({
      stream: fs.createReadStream(filename),
      size,
      filename
    });
  }
}
