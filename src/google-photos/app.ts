#!/usr/bin/env node
import yargs from 'yargs';
import { findPhotos } from './photolocator';
import { Uploader } from './uploader';

const toString: (x: unknown) => string = x => `${x}`;

const argv = yargs.options({
  username: {
    alias: 'u',
    defaultDescription: 'username of gmail acct',
    demandOption: true,
    coerce: toString
  },
  password: {
    alias: 'p',
    defaultDescription: 'username of gmail acct',
    demandOption: true,
    coerce: toString
  }
}).argv;

Uploader.initialize(argv.username, argv.password).then(uploader => {
  uploader
    .upload(findPhotos())
    .then(() => console.log('completed'))
    .catch(e => console.error(e));
});
