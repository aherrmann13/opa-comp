"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPhotos = findPhotos;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var fs = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var _trampoline = require("../core/trampoline");

var photoRegex = /.*\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

function isPicture(filename) {
  return filename.match(photoRegex) !== null;
} // worried about getting into appdata or something like that so trampoline
// tail recursion would be easier but it seems it is not implemented in most browsers
// https://stackoverflow.com/questions/37224520/are-functions-in-javascript-tail-call-optimized
// https://stackoverflow.com/questions/42788139/es6-tail-recursion-optimisation-stack-overflow/42788286#42788286


function findPhotosTrampoline(paths) {
  if (paths.length === 0) {
    return new _trampoline.Done([]);
  } else {
    var files = fs.readdirSync(paths[0], {
      withFileTypes: true
    });
    var newPaths = [].concat((0, _toConsumableArray2["default"])(files.filter(function (x) {
      return x.isDirectory();
    }).map(function (x) {
      return path.join(paths[0], x.name);
    })), (0, _toConsumableArray2["default"])(paths.slice(1, paths.length)));
    var newPhotos = files.filter(function (x) {
      return x.isFile() && isPicture(x.name);
    }).map(function (x) {
      return {
        path: paths[0],
        filename: x.name
      };
    });
    return new _trampoline.More(function () {
      return findPhotosTrampoline(newPaths);
    }).map(function (x) {
      return [].concat((0, _toConsumableArray2["default"])(x), (0, _toConsumableArray2["default"])(newPhotos));
    });
  }
}

function findPhotos(filepath) {
  return (0, _trampoline.execute)(findPhotosTrampoline([filepath]));
}