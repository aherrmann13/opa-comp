"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uploader = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _uploadGphotos = require("upload-gphotos");

var fs = _interopRequireWildcard(require("fs-extra"));

var path = _interopRequireWildcard(require("path"));

var Uploader = /*#__PURE__*/function () {
  function Uploader() {
    (0, _classCallCheck2["default"])(this, Uploader);
    (0, _defineProperty2["default"])(this, "_googlePhotos", void 0);
    this._googlePhotos = new _uploadGphotos.GPhotos();
  }

  (0, _createClass2["default"])(Uploader, [{
    key: "signIn",
    value: function signIn(username, password) {
      return this._googlePhotos.signin({
        username: username,
        password: password
      });
    }
  }, {
    key: "upload",
    value: function () {
      var _upload = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(photos, callback) {
        var _i;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _i = 0;

              case 1:
                if (!(_i < photos.length)) {
                  _context.next = 8;
                  break;
                }

                _context.next = 4;
                return this.uploadInternal(photos[_i]);

              case 4:
                !!callback ? callback(photos[_i], _i) : undefined;

              case 5:
                _i++;
                _context.next = 1;
                break;

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function upload(_x, _x2) {
        return _upload.apply(this, arguments);
      }

      return upload;
    }()
  }, {
    key: "uploadInternal",
    value: function () {
      var _uploadInternal = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(photo) {
        var filename, file;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                filename = path.join(photo.path, photo.filename);
                _context2.next = 3;
                return fs.stat(filename);

              case 3:
                file = _context2.sent;
                _context2.next = 6;
                return this._googlePhotos.upload({
                  stream: fs.createReadStream(filename),
                  size: file.size,
                  filename: filename
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function uploadInternal(_x3) {
        return _uploadInternal.apply(this, arguments);
      }

      return uploadInternal;
    }()
  }], [{
    key: "initialize",
    value: function () {
      var _initialize = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username, password) {
        var uploader;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                uploader = new Uploader();
                _context3.next = 3;
                return uploader.signIn(username, password);

              case 3:
                return _context3.abrupt("return", uploader);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function initialize(_x4, _x5) {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }]);
  return Uploader;
}();

exports.Uploader = Uploader;