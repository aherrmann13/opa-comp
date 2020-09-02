#!/usr/bin/env node
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _yargs = _interopRequireDefault(require("yargs"));

var _uploader = require("./uploader");

var _photolocator = require("./photolocator");

var path = _interopRequireWildcard(require("path"));

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
  batch: {
    alias: 'b',
    description: 'the amount of photos to upload at once',
    "default": 10,
    type: 'number'
  },
  dryrun: {
    alias: 'd',
    description: 'prints file name without upload',
    "boolean": true,
    "default": false
  }
}).argv;

if (!argv.dryrun) {
  _uploader.Uploader.initialize(argv.username, argv.password, argv.batch).then(function (uploader) {
    var photos = (0, _photolocator.findPhotos)(argv.startingpath);
    var done = 1;
    uploader.upload(photos, function (p) {
      return console.log("".concat(done++, "/").concat(photos.length, ": ").concat(path.join(p.path, p.filename)));
    })["catch"](function (e) {
      return console.error(e);
    });
  });
} else {
  (0, _photolocator.findPhotos)(argv.startingpath).forEach(function (x) {
    return console.log(x);
  });
}