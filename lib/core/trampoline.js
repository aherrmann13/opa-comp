"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.More = exports.Done = exports.Trampoline = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

// https://medium.com/@olxc/trampolining-and-stack-safety-in-scala-d8e86474ddfa
// https://gist.github.com/tusharmath/f1eaa6e0bdb3cc2c37835497a85c0b60
var Trampoline = function Trampoline() {
  (0, _classCallCheck2["default"])(this, Trampoline);
};

exports.Trampoline = Trampoline;

var Done = /*#__PURE__*/function (_Trampoline) {
  (0, _inherits2["default"])(Done, _Trampoline);

  var _super = _createSuper(Done);

  function Done(val) {
    var _this;

    (0, _classCallCheck2["default"])(this, Done);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "_val", void 0);
    _this._val = val;
    return _this;
  }

  (0, _createClass2["default"])(Done, [{
    key: "map",
    value: function map(ab) {
      return new Done(ab(this._val));
    }
  }, {
    key: "flatMap",
    value: function flatMap(ab) {
      return ab(this._val);
    }
  }]);
  return Done;
}(Trampoline);

exports.Done = Done;

var FlatMap = /*#__PURE__*/function (_Trampoline2) {
  (0, _inherits2["default"])(FlatMap, _Trampoline2);

  var _super2 = _createSuper(FlatMap);

  function FlatMap(sub, cont) {
    var _this2;

    (0, _classCallCheck2["default"])(this, FlatMap);
    _this2 = _super2.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_sub", void 0);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this2), "_cont", void 0);
    _this2._sub = sub;
    _this2._cont = cont;
    return _this2;
  }

  (0, _createClass2["default"])(FlatMap, [{
    key: "map",
    value: function map(bc) {
      return new FlatMap(this, function (b) {
        return new Done(bc(b));
      });
    }
  }, {
    key: "flatMap",
    value: function flatMap(bc) {
      return new FlatMap(this, bc);
    }
  }]);
  return FlatMap;
}(Trampoline);

var More = /*#__PURE__*/function (_Trampoline3) {
  (0, _inherits2["default"])(More, _Trampoline3);

  var _super3 = _createSuper(More);

  function More(fn) {
    var _this3;

    (0, _classCallCheck2["default"])(this, More);
    _this3 = _super3.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "_fn", void 0);
    _this3._fn = fn;
    return _this3;
  }

  (0, _createClass2["default"])(More, [{
    key: "map",
    value: function map(ab) {
      return new FlatMap(this, function (a) {
        return new Done(ab(a));
      });
    }
  }, {
    key: "flatMap",
    value: function flatMap(ab) {
      return new FlatMap(this, ab);
    }
  }]);
  return More;
}(Trampoline); // this has to be in a separate imperative function because we dont have tail recursion


exports.More = More;

function execute(a) {
  var result = a;

  while (true) {
    if (result instanceof More) {
      result = result['_fn']();
    } else if (result instanceof Done) {
      return result['_val'];
    }
    /* istanbul ignore next line */
    else if (result instanceof FlatMap) {
        (function () {
          var cont = result['_cont'];
          var sub = result['_sub'];

          if (sub instanceof Done) {
            result = result['_cont'](sub['_val']);
          } else if (sub instanceof More) {
            result = new FlatMap(sub['_fn'](), cont);
          }
          /* istanbul ignore next line */
          else if (sub instanceof FlatMap) {
              result = new FlatMap(sub['_sub'], function (a) {
                return new FlatMap(sub['_cont'](a), cont);
              });
            }
        })();
      }
  }
}