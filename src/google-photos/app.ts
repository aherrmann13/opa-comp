#!/usr/bin/env node
import yargs from 'yargs';
import { Uploader } from './uploader';
import { findPhotos } from './photolocator';

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
    alias: 'p',
    description: 'starting path to search for photos',
    demandOption: true,
    type: 'string'
  },
  dryrun: {
    alias: 'd',
    description: 'prints file name without upload',
    boolean: true,
    default: false
  }
}).argv;

if (!argv.dryrun) {
  Uploader.initialize(argv.username, argv.password).then(uploader => {
    uploader
      .upload(findPhotos(argv.startingpath))
      .then(() => console.log('completed'))
      .catch(e => console.error(e));
  });
} else {
  findPhotos(argv.startingpath).forEach(x => console.log(x));
}
