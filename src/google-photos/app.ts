#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs.options({
  username: {
    alias: 'u',
    defaultDescription: 'username of gmail acct',
    demandOption: true
  },
  password: {
    alias: 'p',
    defaultDescription: 'username of gmail acct',
    demandOption: true
  }
}).argv;
