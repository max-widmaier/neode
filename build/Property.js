"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 *  Container holding information for a property.
 *
 * TODO: Schema validation to enforce correct data types
 */
var Property = exports["default"] = /*#__PURE__*/function () {
  function Property(name, schema) {
    var _this = this;
    _classCallCheck(this, Property);
    if (typeof schema == 'string') {
      schema = {
        type: schema
      };
    }
    this._name = name;
    this._schema = schema;

    // TODO: Clean Up
    Object.keys(schema).forEach(function (key) {
      _this['_' + key] = schema[key];
    });
  }
  _createClass(Property, [{
    key: "name",
    value: function name() {
      return this._name;
    }
  }, {
    key: "type",
    value: function type() {
      return this._schema.type;
    }
  }, {
    key: "primary",
    value: function primary() {
      return this._primary || false;
    }
  }, {
    key: "unique",
    value: function unique() {
      return this._unique || false;
    }
  }, {
    key: "exists",
    value: function exists() {
      return this._exists || false;
    }
  }, {
    key: "required",
    value: function required() {
      return this._exists || this._required || false;
    }
  }, {
    key: "indexed",
    value: function indexed() {
      return this._index || false;
    }
  }, {
    key: "fullTextIndexed",
    value: function fullTextIndexed() {
      return this.type() === 'nodeFulltext' || this.type() === 'relationshipFulltext';
    }

    /**
     * Gets the full text index definition for this property.
     * If the type is nodeFulltext, the models field will be populated with the labels of the nodes that this property is indexed on.
     * If the type is relationshipFulltext, the relations field will be populated with the names of the relationships that this property is indexed on.
     *
     * @return {{
     *     type: 'nodeFulltext'|'relationshipFulltext',
     *     models?: string[],
     *     relations?: string[],
     *     properties: string[],
     *     options: {
     *         indexConfig: {
     *             `fulltext.analyzer`: 'english' | 'standard' | 'simple' | 'whitespace' | 'stop' | 'keyword' | 'standard-folding',
     *             `fulltext.eventually_consistent`: boolean,
     *         }
     *     }
     * }|null}
     */
  }, {
    key: "fullTextIndexDefinition",
    value: function fullTextIndexDefinition() {
      if (!this.fullTextIndexed()) {
        return null;
      }
      return this._schema || null;
    }
  }, {
    key: "protected",
    value: function _protected() {
      return this._primary || this._protected;
    }
  }, {
    key: "hidden",
    value: function hidden() {
      return this._hidden;
    }
  }, {
    key: "readonly",
    value: function readonly() {
      return this._readonly || false;
    }
  }, {
    key: "convertToInteger",
    value: function convertToInteger() {
      return this._type == 'int' || this._type == 'integer';
    }
  }]);
  return Property;
}();