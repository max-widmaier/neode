"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _EntityCollection = _interopRequireDefault(require("./EntityCollection"));
var _Node = _interopRequireDefault(require("./Node"));
var _Relationship = _interopRequireDefault(require("./Relationship"));
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
var _EagerUtils = require("./Query/EagerUtils");
var _RelationshipType = require("./RelationshipType");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Factory = exports["default"] = /*#__PURE__*/function () {
  /**
   * @constuctor
   *
   * @param Neode neode
   */
  function Factory(neode) {
    _classCallCheck(this, Factory);
    this._neode = neode;
  }

  /**
   * Hydrate the first record in a result set
   *
   * @param  {Object} res    Neo4j Result
   * @param  {String} alias  Alias of Node to pluck
   * @return {Node}
   */
  _createClass(Factory, [{
    key: "hydrateFirst",
    value: function hydrateFirst(res, alias, definition) {
      if (!res || !res.records.length) {
        return false;
      }
      return this.hydrateNode(res.records[0].get(alias), definition);
    }

    /**
     * Hydrate a set of nodes and return a Collection
     *
     * @param  {Object}          res            Neo4j result set
     * @param  {String}          alias          Alias of node to pluck
     * @param  {Definition|null} definition     Force Definition
     * @return {EntityCollection}
     */
  }, {
    key: "hydrate",
    value: function hydrate(res, alias, definition) {
      var _this = this;
      if (!res) {
        return false;
      }
      var nodes = res.records.map(function (row) {
        return _this.hydrateNode(row.get(alias), definition);
      });
      return new _EntityCollection["default"](this._neode, nodes);
    }

    /**
     * Get the definition by a set of labels
     *
     * @param  {Array} labels
     * @return {Model}
     */
  }, {
    key: "getDefinition",
    value: function getDefinition(labels) {
      return this._neode.models.getByLabels(labels);
    }

    /**
     * Take a result object and convert it into a Model
     *
     * @param {Object}              record
     * @param {Model|String|null}   definition
     * @return {Node}
     */
  }, {
    key: "hydrateNode",
    value: function hydrateNode(record, definition) {
      var _this2 = this;
      // Is there no better way to check this?!
      if (_neo4jDriver["default"].isInt(record.identity) && Array.isArray(record.labels)) {
        record = Object.assign({}, record.properties, _defineProperty(_defineProperty({}, _EagerUtils.EAGER_ID, record.identity), _EagerUtils.EAGER_LABELS, record.labels));
      }

      // Get Internals
      var identity = record[_EagerUtils.EAGER_ID];
      var labels = record[_EagerUtils.EAGER_LABELS];

      // Get Definition from
      if (!definition) {
        definition = this.getDefinition(labels);
      } else if (typeof definition === 'string') {
        definition = this._neode.models.get(definition);
      }

      // Helpful error message if nothing could be found
      if (!definition) {
        throw new Error("No model definition found for labels ".concat(JSON.stringify(labels)));
      }

      // Get Properties
      var properties = new Map();
      definition.properties().forEach(function (value, key) {
        if (record.hasOwnProperty(key)) {
          properties.set(key, record[key]);
        }
      });

      // Create Node Instance
      var node = new _Node["default"](this._neode, definition, identity, labels, properties);

      // Add eagerly loaded props
      definition.eager().forEach(function (eager) {
        var name = eager.name();
        if (!record[name]) {
          return;
        }
        switch (eager.type()) {
          case 'node':
            node.setEager(name, _this2.hydrateNode(record[name]));
            break;
          case 'nodes':
            node.setEager(name, new _EntityCollection["default"](_this2._neode, record[name].map(function (value) {
              return _this2.hydrateNode(value);
            })));
            break;
          case 'relationship':
            node.setEager(name, _this2.hydrateRelationship(eager, record[name], node));
            break;
          case 'relationships':
            node.setEager(name, new _EntityCollection["default"](_this2._neode, record[name].map(function (value) {
              return _this2.hydrateRelationship(eager, value, node);
            })));
            break;
        }
      });
      return node;
    }

    /**
     * Take a result object and convert it into a Relationship
     *
     * @param  {RelationshipType}  definition  Relationship type
     * @param  {Object}            record      Record object
     * @param  {Node}              this_node   'This' node in the current  context
     * @return {Relationship}
     */
  }, {
    key: "hydrateRelationship",
    value: function hydrateRelationship(definition, record, this_node) {
      // Get Internals
      var identity = record[_EagerUtils.EAGER_ID];
      var type = record[_EagerUtils.EAGER_TYPE];

      // Get Definition from
      // const definition = this.getDefinition(labels);

      // Get Properties
      var properties = new Map();
      definition.properties().forEach(function (value, key) {
        if (record.hasOwnProperty(key)) {
          properties.set(key, record[key]);
        }
      });

      // Start & End Nodes
      var other_node = this.hydrateNode(record[definition.nodeAlias()]);

      // Calculate Start & End Nodes
      var start_node = definition.direction() == _RelationshipType.DIRECTION_IN ? other_node : this_node;
      var end_node = definition.direction() == _RelationshipType.DIRECTION_IN ? this_node : other_node;
      return new _Relationship["default"](this._neode, definition, identity, type, properties, start_node, end_node);
    }
  }]);
  return Factory;
}();