#!/usr/bin/env node
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _yargs = _interopRequireDefault(require("yargs"));

var _uploader = require("./uploader");

var _photolocator = require("./photolocator");

var argv = _yargs["default"].options({
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
  dryrun: {
    alias: 'd',
    description: 'prints file name without upload',
    "boolean": true,
    "default": false
  }
}).argv;

if (!argv.dryrun) {
  _uploader.Uploader.initialize(argv.username, argv.password).then(function (uploader) {
    uploader.upload((0, _photolocator.findPhotos)(argv.startingpath)).then(function () {
      return console.log('completed');
    })["catch"](function (e) {
      return console.error(e);
    });
  });
} else {
  (0, _photolocator.findPhotos)(argv.startingpath).forEach(function (x) {
    return console.log(x);
  });
}