"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Relationship = _interopRequireDefault(require("./Relationship"));
var _RelationshipType = _interopRequireDefault(require("../RelationshipType"));
var _Property = _interopRequireDefault(require("./Property"));
var _FullText = _interopRequireDefault(require("./FullText"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Statement = exports["default"] = /*#__PURE__*/function () {
  function Statement(prefix) {
    _classCallCheck(this, Statement);
    this._prefix = prefix || 'MATCH';
    this._pattern = [];
    this._where = [];
    this._order = [];
    this._detach_delete = [];
    this._delete = [];
    this._return = [];
    this._distinct_return = [];
    this._set = [];
    this._on_create_set = [];
    this._on_match_set = [];
    this._remove = [];
    this._fullText = [];
    this._vector = [];
  }
  _createClass(Statement, [{
    key: "fullText",
    value: function fullText(_fullText) {
      this._fullText.push(_fullText);
      return this;
    }
  }, {
    key: "vector",
    value: function vector(_vector) {
      this._vector.push(_vector);
      return this;
    }
  }, {
    key: "match",
    value: function match(_match) {
      this._pattern.push(_match);
      return this;
    }
  }, {
    key: "where",
    value: function where(_where) {
      this._where.push(_where);
      return this;
    }
  }, {
    key: "limit",
    value: function limit(_limit) {
      this._limit = _limit;
    }
  }, {
    key: "skip",
    value: function skip(_skip) {
      this._skip = _skip;
    }
  }, {
    key: "order",
    value: function order(_order) {
      this._order.push(_order);
    }
  }, {
    key: "delete",
    value: function _delete() {
      for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }
      this._delete = this._delete.concat(values);
      return this;
    }
  }, {
    key: "detachDelete",
    value: function detachDelete() {
      for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
      }
      this._detach_delete = this._detach_delete.concat(values);
      return this;
    }
  }, {
    key: "return",
    value: function _return() {
      for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        values[_key3] = arguments[_key3];
      }
      this._return = this._return.concat(values);
      return this;
    }
  }, {
    key: "returnDistinct",
    value: function returnDistinct() {
      for (var _len4 = arguments.length, values = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        values[_key4] = arguments[_key4];
      }
      this._distinct_return = this._distinct_return.concat(values);
      return this;
    }
  }, {
    key: "relationship",
    value: function relationship(_relationship, direction, alias, degrees) {
      if (_relationship instanceof _RelationshipType["default"]) {
        var rel = _relationship;
        _relationship = rel.relationship();
        direction = rel.direction();
      }
      this._pattern.push(new _Relationship["default"](_relationship, direction, alias, degrees));
      return this;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      this._set.push(new _Property["default"](key, value, operator));
      return this;
    }
  }, {
    key: "setRaw",
    value: function setRaw(items) {
      this._set = this._set.concat(items);
      return this;
    }
  }, {
    key: "onCreateSet",
    value: function onCreateSet(key, value) {
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      this._on_create_set.push(new _Property["default"](key, value, operator));
      return this;
    }
  }, {
    key: "onMatchSet",
    value: function onMatchSet(key, value) {
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      this._on_match_set.push(new _Property["default"](key, value, operator));
      return this;
    }

    /**
     * 
     * @param {Array} items 
     */
  }, {
    key: "remove",
    value: function remove(items) {
      this._remove = this._remove.concat(items);
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      var includePrefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var output = [];
      if (this._fullText.length) {
        output.push(this._fullText.map(function (statement) {
          return statement.toString();
        }).join('\n'));
      }
      if (this._pattern.length) {
        if (includePrefix) output.push(this._prefix);
        output.push(this._pattern.map(function (statement) {
          return statement.toString();
        }).join(''));
      }
      if (this._where.length) {
        output.push(this._where.map(function (statement) {
          return statement.toString();
        }).join(''));
      }
      if (this._vector.length) {
        output.push(this._vector.map(function (statement) {
          return statement.toString();
        }).join('\n'));
      }
      if (this._remove.length) {
        output.push('REMOVE');
        output.push(this._remove.join(', '));
      }
      if (this._on_create_set.length) {
        output.push('ON CREATE SET');
        output.push(this._on_create_set.map(function (output) {
          return output.toString();
        }).join(', '));
      }
      if (this._on_match_set.length) {
        output.push('ON MATCH SET');
        output.push(this._on_match_set.map(function (output) {
          return output.toString();
        }).join(', '));
      }
      if (this._set.length) {
        output.push('SET');
        output.push(this._set.map(function (output) {
          return output.toString();
        }).join(', '));
      }
      if (this._delete.length) {
        output.push('DELETE');
        output.push(this._delete.map(function (output) {
          return output.toString();
        }));
      }
      if (this._detach_delete.length) {
        output.push('DETACH DELETE');
        output.push(this._detach_delete.map(function (output) {
          return output.toString();
        }));
      }
      if (this._return.length) {
        output.push('RETURN');
        output.push(this._return.map(function (output) {
          return output.toString();
        }));
      }
      if (this._distinct_return.length) {
        output.push('RETURN DISTINCT');
        output.push(this._distinct_return.map(function (output) {
          return output.toString();
        }));
      }
      if (this._order.length) {
        output.push('ORDER BY');
        output.push(this._order.map(function (output) {
          return output.toString();
        }));
      }
      if (this._skip) {
        output.push("SKIP ".concat(this._skip));
      }
      if (this._limit) {
        output.push("LIMIT ".concat(this._limit));
      }
      return output.join('\n');
    }
  }]);
  return Statement;
}();