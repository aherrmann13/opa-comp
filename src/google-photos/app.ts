#!/usr/bin/env node
import yargs from 'yargs';
import { Uploader } from './uploader';
import { findPhotos } from './photolocator';
import * as path from 'path';

const argv = yargs.options({
  username: {
    alias: 'u',
    description: 'username of gmail acct',
    demandOption: true,
    type: 'string'
  },
  password: {
    alias: 'p',
    description: 'username of gmail acct',
    demandOption: true,
    type: 'string'
  },
  startingpath: {
    alias: 's',
    description: 'starting path to search for photos',
    demandOption: true,
    type: 'string'
  },
  batch: {
    alias: 'b',
    description: 'the amount of photos to upload at once',
    default: 10,
    type: 'number'
  },
  dryrun: {
    alias: 'd',
    description: 'prints file name without upload',
    boolean: true,
    default: false
  }
}).argv;

if (!argv.dryrun) {
  Uploader.initialize(argv.username, argv.password, argv.batch).then(uploader => {
    const photos = findPhotos(argv.startingpath);
    let done = 1;
    uploader
      .upload(photos, p => console.log(`${done++}/${photos.length}: ${path.join(p.path, p.filename)}`))
      .catch(e => console.error(e));
  });
} else {
  findPhotos(argv.startingpath).forEach(x => console.log(x));
}
