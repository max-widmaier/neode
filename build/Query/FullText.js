"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var FullText = exports["default"] = /*#__PURE__*/function () {
  /**
   * @param {String} index
   * @param {'nodeFulltext'|'relationshipFullText'} type
   * @param {String[]|{
   *     key?: string,
   *     value: string,
   *     operator: 'AND'|'OR'|'NOT'|'+'|'-'
   * }[]} searchTerms
   * @param {'AND'|'OR'|'NOT'|'+'|'-'} operator (optional)
   * @param {String} alias (optional)
   * @param {String} scoreAlias (optional)
   */
  function FullText(index, type, searchTerms) {
    var operator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'AND';
    var alias = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'res';
    var scoreAlias = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'score';
    _classCallCheck(this, FullText);
    this._index = index;
    this._type = type;
    this._searchTerms = searchTerms;
    this._operator = operator;
    this._alias = alias;
    this._scoreAlias = scoreAlias;
  }
  _createClass(FullText, [{
    key: "toString",
    value: function toString() {
      var procedure = "db.index.fulltext.".concat(this._type === 'nodeFulltext' ? 'queryNodes' : 'queryRelationships');
      return "CALL ".concat(procedure, "(").concat(this._index, ", ").concat(this.parseSearchTerm(), ") YIELD ").concat(this._alias, ", ").concat(this._scoreAlias);
    }
  }, {
    key: "parseSearchTerm",
    value: function parseSearchTerm() {
      var _this = this;
      if (Array.isArray(this._searchTerms)) {
        return this._searchTerms.map(function (term, index) {
          // Return parameterized search term along with operator
          var paramName = "$".concat(_this._index, "_");
          if (term.key) {
            paramName = "".concat(term.key, ":").concat(paramName);
          } else {
            paramName += index.toString();
          }
          if (index === 0) {
            return "".concat(paramName);
          } else {
            var operator = term.operator || _this._operator;
            return "".concat(operator, " ").concat(paramName);
          }
        }).join(' ');
      } else {
        return "$".concat(this._index, "_0");
      }
    }
  }, {
    key: "params",
    value: function params() {
      var _this2 = this;
      var params = {};
      if (!Array.isArray(this._searchTerms)) {
        params = _defineProperty({}, "".concat(this._index, "_0"), this._searchTerms);
      }
      this._searchTerms.forEach(function (term, index) {
        if (term.key) {
          params["".concat(_this2._index, "_").concat(term.key)] = term.value;
        } else {
          params["".concat(_this2._index, "_").concat(index)] = term.value;
        }
      });
      return params;
    }
  }]);
  return FullText;
}();