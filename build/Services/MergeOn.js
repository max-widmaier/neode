"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MergeOn;
var _GenerateDefaultValues = _interopRequireDefault(require("./GenerateDefaultValues"));
var _Validator = _interopRequireDefault(require("./Validator"));
var _Builder = _interopRequireWildcard(require("../Query/Builder"));
var _EagerUtils = require("../Query/EagerUtils");
var _WriteUtils = require("./WriteUtils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*
import GenerateDefaultValues from './GenerateDefaultValues';
import Node from '../Node';
import Validator from './Validator';
import { DIRECTION_IN, DIRECTION_OUT } from '../RelationshipType';
import { eagerNode } from '../Query/EagerUtils';

const MAX_CREATE_DEPTH = 99;
const ORIGINAL_ALIAS = 'this';
*/

function MergeOn(neode, model, merge_on, properties) {
  return (0, _GenerateDefaultValues["default"])(neode, model, properties).then(function (properties) {
    return (0, _Validator["default"])(neode, model, properties);
  }).then(function (properties) {
    var alias = _WriteUtils.ORIGINAL_ALIAS;
    var builder = new _Builder["default"](neode);
    (0, _WriteUtils.addNodeToStatement)(neode, builder, alias, model, properties, [alias], 'merge', merge_on);

    // Output
    var output = (0, _EagerUtils.eagerNode)(neode, 1, alias, model);
    return builder["return"](output).execute(_Builder.mode.WRITE).then(function (res) {
      return neode.hydrateFirst(res, alias);
    });
  });
}