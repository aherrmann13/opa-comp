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
  function Uploader(batch) {
    (0, _classCallCheck2["default"])(this, Uploader);
    (0, _defineProperty2["default"])(this, "_googlePhotos", void 0);
    (0, _defineProperty2["default"])(this, "_batch", void 0);
    this._googlePhotos = new _uploadGphotos.GPhotos();
    this._batch = batch;
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
        var _this = this;

        var i;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i = 0;

              case 1:
                if (!(i < photos.length)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return Promise.all(photos.slice(i, i + this._batch).map(function (p) {
                  return _this.uploadInternal(p).then(function () {
                    return !!callback ? callback(p) : undefined;
                  });
                }));

              case 4:
                i += this._batch;
                _context.next = 1;
                break;

              case 7:
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
                _context2.prev = 4;

                if (!(file.size > 0)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 8;
                return this._googlePhotos.upload({
                  stream: fs.createReadStream(filename),
                  size: file.size,
                  filename: photo.filename
                });

              case 8:
                _context2.next = 11;
                break;

              case 10:
                Promise.resolve();

              case 11:
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](4);
                return _context2.abrupt("return", Promise.resolve());

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 13]]);
      }));

      function uploadInternal(_x3) {
        return _uploadInternal.apply(this, arguments);
      }

      return uploadInternal;
    }()
  }], [{
    key: "initialize",
    value: function () {
      var _initialize = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(username, password, batch) {
        var uploader;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                uploader = new Uploader(batch);
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

      function initialize(_x4, _x5, _x6) {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }]);
  return Uploader;
}();

exports.Uploader = Uploader;