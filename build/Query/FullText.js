"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FullText = /*#__PURE__*/function () {
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
      return "CALL ".concat(procedure, "(\"idx_").concat(this._index, "_fulltext\", '").concat(this.parseSearchTerm(), "') YIELD node AS ").concat(this._alias, ", score AS ").concat(this._scoreAlias);
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
            paramName += term.key;
            paramName = "".concat(term.key, ":\"").concat(paramName, "\"");
          } else {
            paramName += index.toString();
            paramName = "\"".concat(paramName, "\"");
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

exports["default"] = FullText;