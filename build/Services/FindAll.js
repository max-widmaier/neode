"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = FindAll;
var _Builder = _interopRequireWildcard(require("../Query/Builder"));
var _EagerUtils = require("../Query/EagerUtils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function FindAll(neode, model, properties, order, limit, skip) {
  var alias = 'this';
  var builder = new _Builder["default"](neode);

  // Match
  builder.match(alias, model);

  // Where
  if (properties) {
    Object.keys(properties).forEach(function (key) {
      builder.where("".concat(alias, ".").concat(key), properties[key]);
    });
  }

  // Order
  if (typeof order == 'string') {
    builder.orderBy("".concat(alias, ".").concat(order));
  } else if (_typeof(order) == 'object') {
    Object.keys(order).forEach(function (key) {
      builder.orderBy("".concat(alias, ".").concat(key), order[key]);
    });
  }

  // Output
  var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model);
  return builder["return"](output).limit(limit).skip(skip).execute(_Builder.mode.READ).then(function (res) {
    return neode.hydrate(res, alias);
  });
}