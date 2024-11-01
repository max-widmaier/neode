"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mode = exports["default"] = void 0;
var _Match = _interopRequireDefault(require("./Match"));
var _Order = _interopRequireDefault(require("./Order"));
var _Statement = _interopRequireDefault(require("./Statement"));
var _Property = _interopRequireDefault(require("./Property"));
var _WhereStatement = _interopRequireDefault(require("./WhereStatement"));
var _Where = _interopRequireWildcard(require("./Where"));
var _WhereBetween = _interopRequireDefault(require("./WhereBetween"));
var _WhereId = _interopRequireDefault(require("./WhereId"));
var _WhereRaw = _interopRequireDefault(require("./WhereRaw"));
var _WithStatement = _interopRequireDefault(require("./WithStatement"));
var _WithDistinctStatement = _interopRequireDefault(require("./WithDistinctStatement"));
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
var _FullText = _interopRequireDefault(require("./FullText"));
var _Vector = _interopRequireDefault(require("./Vector"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // import Return from './Return';
var mode = exports.mode = {
  READ: "READ",
  WRITE: "WRITE"
};
var Builder = exports["default"] = /*#__PURE__*/function () {
  function Builder(neode) {
    _classCallCheck(this, Builder);
    this._neode = neode;
    this._params = {};
    this._statements = [];
    this._current;
    this._where;
    this._set_count = 0;
  }

  /**
   * Start a new Query segment and set the current statement
   *
   * @return {Builder}
   */
  _createClass(Builder, [{
    key: "statement",
    value: function statement(prefix) {
      if (this._current) {
        this._statements.push(this._current);
      }
      this._current = new _Statement["default"](prefix);
      return this;
    }

    /**
     * Start a new Where Segment
     *
     * @param  {String} prefix
     * @param {String} [connector]
     * @return {Builder}
     */
  }, {
    key: "whereStatement",
    value: function whereStatement(prefix, connector) {
      if (this._where) {
        this._current.where(this._where);
      }
      this._where = new _WhereStatement["default"](prefix, connector);
      return this;
    }

    /**
     * Match a Node by a definition
     *
     * @param  {String} alias           Alias in query
     * @param  {Model|String}  model    Model definition
     * @param  {Object|null}   properties   Inline Properties
     * @return {Builder}                Builder
     */
  }, {
    key: "match",
    value: function match(alias, model, properties) {
      this.whereStatement('WHERE');
      this.statement();
      this._current.match(new _Match["default"](alias, model, this._convertPropertyMap(alias, properties)));
      return this;
    }
  }, {
    key: "optionalMatch",
    value: function optionalMatch(alias, model) {
      this.whereStatement('WHERE');
      this.statement('OPTIONAL MATCH');
      this._current.match(new _Match["default"](alias, model));
      return this;
    }

    /**
     * Add a 'with' statement to the query
     *
     * @param  {...String} args Variables/aliases to carry through
     * @return {Builder}
     */
  }, {
    key: "with",
    value: function _with() {
      this.whereStatement('WHERE');
      this.statement();
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this._statements.push(_construct(_WithStatement["default"], args));
      return this;
    }

    /**
     * Add a 'with distinct' statement to the query
     *
     * @param  {...String} args Variables/aliases to carry through
     * @return {Builder}
     */
  }, {
    key: "withDistinct",
    value: function withDistinct() {
      this.whereStatement('WHERE');
      this.statement();
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      this._statements.push(_construct(_WithDistinctStatement["default"], args));
      return this;
    }

    /**
     * Create a new WhereSegment
     * @param  {...mixed} args
     * @return {Builder}
     */
  }, {
    key: "or",
    value: function or() {
      this.whereStatement('OR');
      return this.where.apply(this, arguments);
    }

    /**
     * Create a new WhereSegment
     * @param  {...mixed} args
     * @return {Builder}
     */
  }, {
    key: "and",
    value: function and() {
      this.whereStatement('AND');
      return this.where.apply(this, arguments);
    }

    /**
     * Generate a unique key and add the value to the params object
     *
     * @param {String} key
     * @param {Mixed} value
     */
  }, {
    key: "_addWhereParameter",
    value: function _addWhereParameter(key, value) {
      var attempt = 1;
      var base = "where_".concat(key.replace(/[^a-z0-9]+/g, '_'));

      // Try to create a unique key
      var variable = base;
      while (typeof this._params[variable] != "undefined") {
        attempt++;
        variable = "".concat(base, "_").concat(attempt);
      }
      this._params[variable] = value;
      return variable;
    }

    /**
     * Add a where condition to the current statement.
     *
     * @param  {...mixed} args Arguments
     * @return {Builder}
     */
  }, {
    key: "where",
    value: function where() {
      var _this = this;
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      if (!args.length || !args[0]) return this;

      // If 2 character length, it should be straight forward where
      if (args.length == 2) {
        args = [args[0], _Where.OPERATOR_EQUALS, args[1]];
      }

      // If only one argument, treat it as a single string
      if (args.length == 1) {
        var _args = args,
          _args2 = _slicedToArray(_args, 1),
          arg = _args2[0];
        if (Array.isArray(arg)) {
          arg.forEach(function (inner) {
            _this.where.apply(_this, _toConsumableArray(inner));
          });
        } else if (_typeof(arg) == 'object') {
          Object.keys(arg).forEach(function (key) {
            _this.where(key, arg[key]);
          });
        } else {
          this._where.append(new _WhereRaw["default"](args[0]));
        }
      } else {
        var _args3 = args,
          _args4 = _slicedToArray(_args3, 3),
          left = _args4[0],
          operator = _args4[1],
          value = _args4[2];
        var right = this._addWhereParameter(left, value);
        this._params[right] = value;
        this._where.append(new _Where["default"](left, operator, "$".concat(right)));
      }
      return this;
    }

    /**
     * Add a where condition to the current statement, specifically comparing a property to a date value
     * @param {String} arg Node property to compare
     * @param {String} operator Comparison operator
     * @param {Date} date Date to compare to
     * @param {String} type Date type (datetime, date, time)
     * @return {Builder}
     */
  }, {
    key: "whereDate",
    value: function whereDate(arg, operator, date) {
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'datetime';
      var dateString = date.toISOString();
      var right;
      switch (type) {
        case 'datetime':
          right = this._addWhereParameter(arg, date.toISOString());
          break;
        case 'date':
          right = this._addWhereParameter(arg, date.toISOString().split('T')[0]);
          break;
        case 'time':
          right = this._addWhereParameter(arg, date.toISOString().split('T')[1]);
          break;
        default:
          throw new Error('Invalid date type');
      }
      this._params[right] = dateString;

      // Becomes WHERE arg operator datetime($right), date($right), or time($right)
      this._where.append(new _Where["default"](arg, operator, "".concat(type, "($").concat(right, ")")));
      return this;
    }

    /**
     * Query on Internal ID
     *
     * @param  {String} alias
     * @param  {Int}    value
     * @return {Builder}
     */
  }, {
    key: "whereId",
    value: function whereId(alias, value) {
      var param = this._addWhereParameter("".concat(alias, "_id"), _neo4jDriver["default"]["int"](value));
      this._where.append(new _WhereId["default"](alias, param));
      return this;
    }

    /**
     * Add a raw where clause
     *
     * @param  {String} clause
     * @return {Builder}
     */
  }, {
    key: "whereRaw",
    value: function whereRaw(clause) {
      this._where.append(new _WhereRaw["default"](clause));
      return this;
    }

    /**
     * A negative where clause
     *
     * @param {*} args
     * @return {Builder}
     */
  }, {
    key: "whereNot",
    value: function whereNot() {
      this.where.apply(this, arguments);
      this._where.last().setNegative();
      return this;
    }

    /**
     * Between clause
     *
     * @param {String} alias
     * @param {Mixed} floor
     * @param {Mixed} ceiling
     * @return {Builder}
     */
  }, {
    key: "whereBetween",
    value: function whereBetween(alias, floor, ceiling) {
      var floor_alias = this._addWhereParameter("".concat(alias, "_floor"), floor);
      var ceiling_alias = this._addWhereParameter("".concat(alias, "_ceiling"), ceiling);
      this._where.append(new _WhereBetween["default"](alias, floor_alias, ceiling_alias));
      return this;
    }

    /**
     * Negative Between clause
     *
     * @param {String} alias
     * @param {Mixed} floor
     * @param {Mixed} ceiling
     * @return {Builder}
     */
  }, {
    key: "whereNotBetween",
    value: function whereNotBetween(alias, floor, ceiling) {
      this.whereBetween(alias, floor, ceiling);
      this._where.last().setNegative();
      return this;
    }

    /**
     * Set Delete fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
  }, {
    key: "delete",
    value: function _delete() {
      var _this$_current;
      (_this$_current = this._current)["delete"].apply(_this$_current, arguments);
      return this;
    }

    /**
     * Set Detach Delete fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
  }, {
    key: "detachDelete",
    value: function detachDelete() {
      var _this$_current2;
      (_this$_current2 = this._current).detachDelete.apply(_this$_current2, arguments);
      return this;
    }

    /**
     * Start a Create Statement by alias/definition
     *
     * @param  {String} alias               Alias in query
     * @param  {Model|String}  model        Model definition
     * @param  {Object|null}   properties   Inline Properties
     * @return {Builder}                    Builder
     */
  }, {
    key: "create",
    value: function create(alias, model, properties) {
      this.whereStatement('WHERE');
      this.statement('CREATE');
      this._current.match(new _Match["default"](alias, model, this._convertPropertyMap(alias, properties)));
      return this;
    }

    /**
     * Convert a map of properties into an Array of
     *
     * @param {Object|null} properties
     */
  }, {
    key: "_convertPropertyMap",
    value: function _convertPropertyMap(alias, properties) {
      var _this2 = this;
      if (properties) {
        return Object.keys(properties).map(function (key) {
          var property_alias = "".concat(alias, "_").concat(key);
          _this2._params[property_alias] = properties[key];
          return new _Property["default"](key, property_alias);
        });
      }
      return [];
    }

    /**
     * Start a Merge Statement by alias/definition
     *
     * @param  {String}        alias        Alias in query
     * @param  {Model|String}  model        Model definition
     * @param  {Object|null}   properties   Inline Properties
     * @return {Builder}                    Builder
     */
  }, {
    key: "merge",
    value: function merge(alias, model, properties) {
      this.whereStatement('WHERE');
      this.statement('MERGE');
      this._current.match(new _Match["default"](alias, model, this._convertPropertyMap(alias, properties)));
      return this;
    }

    /**
     * Set a property
     *
     * @param {String|Object} property   Property in {alias}.{property} format
     * @param {Mixed}         value      Value
     * @param {String}        operator   Operator
     */
  }, {
    key: "set",
    value: function set(property, value) {
      var _this3 = this;
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      // Support a map of properties
      if (!value && property instanceof Object) {
        Object.keys(property).forEach(function (key) {
          _this3.set(key, property[key]);
        });
      } else {
        if (value !== undefined) {
          var alias = "set_".concat(this._set_count);
          this._params[alias] = value;
          this._set_count++;
          this._current.set(property, alias, operator);
        } else {
          this._current.setRaw(property);
        }
      }
      return this;
    }

    /**
     * Set a property
     *
     * @param {String|Object} property   Property in {alias}.{property} format
     * @param {Mixed}         value      Value
     * @param {String}        operator   Operator
     */
  }, {
    key: "onCreateSet",
    value: function onCreateSet(property, value) {
      var _this4 = this;
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      // Support a map of properties
      if (value === undefined && property instanceof Object) {
        Object.keys(property).forEach(function (key) {
          _this4.onCreateSet(key, property[key]);
        });
      } else {
        var alias = "set_".concat(this._set_count);
        this._params[alias] = value;
        this._set_count++;
        this._current.onCreateSet(property, alias, operator);
      }
      return this;
    }

    /**
     * Set a property
     *
     * @param {String|Object} property   Property in {alias}.{property} format
     * @param {Mixed}         value      Value
     * @param {String}        operator   Operator
     */
  }, {
    key: "onMatchSet",
    value: function onMatchSet(property, value) {
      var _this5 = this;
      var operator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '=';
      // Support a map of properties
      if (value === undefined && property instanceof Object) {
        Object.keys(property).forEach(function (key) {
          _this5.onMatchSet(key, property[key]);
        });
      } else {
        var alias = "set_".concat(this._set_count);
        this._params[alias] = value;
        this._set_count++;
        this._current.onMatchSet(property, alias, operator);
      }
      return this;
    }

    /**
     * Remove properties or labels in {alias}.{property}
     * or {alias}:{Label} format
     *
     * @param {[String]} items
     */
  }, {
    key: "remove",
    value: function remove() {
      for (var _len4 = arguments.length, items = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        items[_key4] = arguments[_key4];
      }
      this._current.remove(items);
      return this;
    }

    /**
     * Set Return fields
     *
     * @param  {...mixed} args
     * @return {Builder}
     */
  }, {
    key: "return",
    value: function _return() {
      var _this$_current3;
      (_this$_current3 = this._current)["return"].apply(_this$_current3, arguments);
      return this;
    }

    /**
     * Set Return distinct fields
     * @param args {...string} Fields to return
     * @returns {Builder}
     */
  }, {
    key: "returnDistinct",
    value: function returnDistinct() {
      var _this$_current4;
      (_this$_current4 = this._current).returnDistinct.apply(_this$_current4, arguments);
      return this;
    }

    /**
     * Set Record Limit
     *
     * @param  {Int} limit
     * @return {Builder}
     */
  }, {
    key: "limit",
    value: function limit(_limit) {
      this._current.limit(_limit);
      return this;
    }

    /**
     * Set Records to Skip
     *
     * @param  {Int} skip
     * @return {Builder}
     */
  }, {
    key: "skip",
    value: function skip(_skip) {
      this._current.skip(_skip);
      return this;
    }

    /**
     * Add an order by statement
     *
     * @param  {...String|object} args  Order by statements
     * @return {Builder}
     */
  }, {
    key: "orderBy",
    value: function orderBy() {
      var _this6 = this;
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      var order_by;
      if (args.length == 2) {
        // Assume orderBy(what, how)
        order_by = new _Order["default"](args[0], args[1]);
      } else if (Array.isArray(args[0])) {
        // Handle array of where's
        args[0].forEach(function (arg) {
          _this6.orderBy(arg);
        });
      }
      // TODO: Ugly, stop supporting this
      else if (_typeof(args[0]) == 'object' && args[0].field) {
        // Assume orderBy(args[0].field, args[0].order)
        order_by = new _Order["default"](args[0].field, args[0].order);
      } else if (_typeof(args[0]) == 'object') {
        // Assume {key: order}
        Object.keys(args[0]).forEach(function (key) {
          _this6.orderBy(key, args[0][key]);
        });
      } else if (args[0]) {
        // Assume orderBy(what, 'ASC')
        order_by = new _Order["default"](args[0]);
      }
      if (order_by) {
        this._current.order(order_by);
      }
      return this;
    }

    /**
     * Query a full text index
     * @param {String} index (required) Index name as defined in the schema
     * @param {'nodeFulltext'|'relationshipFullText'} type (required) Type of FullText index (e.g. 'nodeFulltext' or 'relationshipFullText')
     * @param {String[]|{
     *     key?: string,
     *     value: string,
     *     operator: 'AND'|'OR'|'NOT'|'+'|'-'
     * }[]} searchTerms (required) Search terms to query or an object of properties to search on
     *
     * @param {'AND'|'OR'|'NOT'|'+'|'-'} operator (optional) Operator to use for the search assuming the type of search term is a string array.
     * Defaults to 'AND'.
     * AND: Matches all terms
     * OR: Matches any term
     * NOT: Matches none of the terms, must be used with more than one term.
     * +: Requires the term to be present
     * -: Requires the term to not be present
     *
     * See more at https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boolean%20operators
     * @param {String} alias (optional) Defaults to ${index name}
     * @param {String} scoreAlias (optional) Defaults to ${index name}_score
     */
  }, {
    key: "fullText",
    value: function fullText(index, type, searchTerms) {
      var operator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'AND';
      var alias = arguments.length > 4 ? arguments[4] : undefined;
      var scoreAlias = arguments.length > 5 ? arguments[5] : undefined;
      var fullText = new _FullText["default"](index, type, searchTerms, operator, alias, scoreAlias);
      this._current.fullText(fullText);

      // Add parameters to the params object
      var params = fullText.params();
      for (var key in fullText.params) {
        this._params[key] = params[key];
      }
      return this;
    }

    /**
     * Add a vector index call to the query
     * @param model {Neode.Model} Model to query
     * @param property {String} Vector property that has been indexed
     * @param nearestNeighbors {Number} Number of nearest neighbors to return
     * @param query {String | Array<Number>} Query, either as a property of a previous node (that is a vector) or a number array
     * @param [nodeAlias] {String} Alias of the node to return (Defaults to ${property}_node)
     * @param [scoreAlias] {String} Alias of the score to return (Defaults to ${property}_score)
     */
  }, {
    key: "vector",
    value: function vector(model, property, nearestNeighbors, query, nodeAlias, scoreAlias) {
      var _nodeAlias = nodeAlias || "".concat(property, "_node");
      var _scoreAlias = scoreAlias || "".concat(property, "_score");
      if (model.schema()[property].vectorIndex == null) {
        throw new Error("Property ".concat(property, " is not a vector index"));
      }
      var vector = new _Vector["default"](model, property, nearestNeighbors, query, _nodeAlias, _scoreAlias);
      this._current.vector(vector);

      // Add parameters to the params object
      var params = vector.params();
      for (var key in vector.params) {
        this._params[key] = params[key];
      }
      return this;
    }

    /**
     * Add a relationship to the query
     *
     * @param  {String|RelationshipType} relationship  Relationship name or RelationshipType object
     * @param  {String}                  direction     Direction of relationship DIRECTION_IN, DIRECTION_OUT
     * @param  {String|null}             alias         Relationship alias
     * @param  {Int|String}              degrees        Number of traversdegreesals (1, "1..2", "0..2", "..3")
     * @return {Builder}
     */
  }, {
    key: "relationship",
    value: function relationship(_relationship, direction, alias, degrees) {
      this._current.relationship(_relationship, direction, alias, degrees);
      return this;
    }

    /**
     * Complete a relationship
     * @param  {String} alias       Alias
     * @param  {Model | false}  model       Model definition
     * @param  {Object} properties  Properties
     * @return {Builder}
     */
  }, {
    key: "to",
    value: function to(alias, model, properties) {
      this._current.match(new _Match["default"](alias, model, this._convertPropertyMap(alias, properties)));
      return this;
    }

    /**
     * Complete the relationship statement to point to anything
     *
     * @return {Builder}
     */
  }, {
    key: "toAnything",
    value: function toAnything() {
      this._current.match(new _Match["default"]());
      return this;
    }

    /**
     * Build the pattern without any keywords
     *
     * @return {String}
     */
  }, {
    key: "pattern",
    value: function pattern() {
      this.whereStatement();
      this.statement();
      return this._statements.map(function (statement) {
        return statement.toString(false);
      }).join('\n');
    }

    /**
     * Build the Query
     *
     * @param  {...String} output References to output
     * @return {Object}           Object containing `query` and `params` property
     */
  }, {
    key: "build",
    value: function build() {
      // Append Statement to Statements
      this.whereStatement();
      this.statement();
      var query = this._statements.map(function (statement) {
        return statement.toString();
      }).join('\n');
      return {
        query: query,
        params: this._params
      };
    }

    /**
     * Execute the query
     *
     * @param  {String}  query_mode
     * @return {Promise}
     */
  }, {
    key: "execute",
    value: function execute() {
      var query_mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mode.WRITE;
      var _this$build = this.build(),
        query = _this$build.query,
        params = _this$build.params;
      var session;
      switch (query_mode) {
        case mode.WRITE:
          session = this._neode.writeSession();
          return session.writeTransaction(function (tx) {
            return tx.run(query, params);
          }).then(function (res) {
            session.close();
            return res;
          });
        default:
          session = this._neode.readSession();
          return session.readTransaction(function (tx) {
            return tx.run(query, params);
          }).then(function (res) {
            session.close();
            return res;
          });
      }
    }
  }]);
  return Builder;
}();