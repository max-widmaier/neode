"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
var _Entity2 = _interopRequireDefault(require("./Entity"));
var _UpdateNode = _interopRequireDefault(require("./Services/UpdateNode"));
var _DeleteNode = _interopRequireDefault(require("./Services/DeleteNode"));
var _RelateTo = _interopRequireDefault(require("./Services/RelateTo"));
var _DetachFrom = _interopRequireDefault(require("./Services/DetachFrom"));
var _RelationshipType = _interopRequireDefault(require("./RelationshipType"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
/**
 * Node Container
 */
var Node = exports["default"] = /*#__PURE__*/function (_Entity) {
  _inherits(Node, _Entity);
  /**
   * @constructor
   *
   * @param  {Neode}   neode        Neode Instance
   * @param  {Model}   model        Model definition
   * @param  {Integer} identity     Internal Node ID
   * @param  {Array}   labels       Node labels
   * @param  {Object}  properties   Property Map
   * @param  {Map}     eager        Eagerly loaded values
   * @return {Node}
   */
  function Node(neode, model, identity, labels, properties, eager) {
    var _this;
    _classCallCheck(this, Node);
    _this = _callSuper(this, Node);
    _this._neode = neode;
    _this._model = model;
    _this._identity = identity;
    _this._labels = labels;
    _this._properties = properties || new Map();
    _this._eager = eager || new Map();
    _this._deleted = false;
    return _this;
  }

  /**
   * Get the Model for this Node
   *
   * @return {Model}
   */
  _createClass(Node, [{
    key: "model",
    value: function model() {
      return this._model;
    }

    /**
     * Get Labels
     *
     * @return {Array}
     */
  }, {
    key: "labels",
    value: function labels() {
      return this._labels;
    }

    /**
     * Set an eager value on the fly
     *
     * @param  {String} key
     * @param  {Mixed}  value
     * @return {Node}
     */
  }, {
    key: "setEager",
    value: function setEager(key, value) {
      this._eager.set(key, value);
      return this;
    }

    /**
     * Delete this node from the Graph
     *
     * @param {Integer} to_depth    Depth to delete to (Defaults to 10)
     * @return {Promise}
     */
  }, {
    key: "delete",
    value: function _delete(to_depth) {
      var _this2 = this;
      return (0, _DeleteNode["default"])(this._neode, this._identity, this._model, to_depth).then(function () {
        _this2._deleted = true;
        return _this2;
      });
    }

    /**
     * Relate this node to another based on the type
     *
     * @param  {Node}   node            Node to relate to
     * @param  {String} type            Type of Relationship definition
     * @param  {Object} properties      Properties to set against the relationships
     * @param  {Boolean} force_create   Force the creation a new relationship? If false, the relationship will be merged
     * @return {Promise}
     */
  }, {
    key: "relateTo",
    value: function relateTo(node, type) {
      var _this3 = this;
      var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var force_create = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var relationship = this._model.relationships().get(type);
      if (!(relationship instanceof _RelationshipType["default"])) {
        return Promise.reject(new Error("Cannot find relationship with type ".concat(type)));
      }
      return (0, _RelateTo["default"])(this._neode, this, node, relationship, properties, force_create).then(function (rel) {
        _this3._eager["delete"](type);
        return rel;
      });
    }

    /**
     * Detach this node to another
     *
     * @param  {Node} node Node to detach from
     * @return {Promise}
     */
  }, {
    key: "detachFrom",
    value: function detachFrom(other) {
      if (!(other instanceof Node)) {
        return Promise.reject(new Error("Cannot find node with type ".concat(other)));
      }
      return (0, _DetachFrom["default"])(this._neode, this, other);
    }

    /**
     * Convert Node to a JSON friendly Object
     *
     * @return {Promise}
     */
  }, {
    key: "toJson",
    value: function toJson() {
      var _this4 = this;
      var output = {
        _id: this.id(),
        _labels: this.labels()
      };

      // Properties
      this._model.properties().forEach(function (property, key) {
        if (property.hidden()) {
          return;
        }
        if (_this4._properties.has(key)) {
          output[key] = _this4.valueToJson(property, _this4._properties.get(key));
        } else if (_neo4jDriver["default"].temporal.isDateTime(output[key])) {
          output[key] = new Date(output[key].toString());
        } else if (_neo4jDriver["default"].spatial.isPoint(output[key])) {
          switch (output[key].srid.toString()) {
            // SRID values: @https://neo4j.com/docs/developer-manual/current/cypher/functions/spatial/
            case '4326':
              // WGS 84 2D
              output[key] = {
                longitude: output[key].x,
                latitude: output[key].y
              };
              break;
            case '4979':
              // WGS 84 3D
              output[key] = {
                longitude: output[key].x,
                latitude: output[key].y,
                height: output[key].z
              };
              break;
            case '7203':
              // Cartesian 2D
              output[key] = {
                x: output[key].x,
                y: output[key].y
              };
              break;
            case '9157':
              // Cartesian 3D
              output[key] = {
                x: output[key].x,
                y: output[key].y,
                z: output[key].z
              };
              break;
          }
        }
      });

      // Eager Promises
      return Promise.all(this._model.eager().map(function (rel) {
        var key = rel.name();
        if (_this4._eager.has(rel.name())) {
          // Call internal toJson function on either a Node or NodeCollection
          return _this4._eager.get(rel.name()).toJson().then(function (value) {
            return {
              key: key,
              value: value
            };
          });
        }
      }))
      // Remove Empty
      .then(function (eager) {
        return eager.filter(function (e) {
          return !!e;
        });
      })

      // Assign to Output
      .then(function (eager) {
        eager.forEach(function (_ref) {
          var key = _ref.key,
            value = _ref.value;
          return output[key] = value;
        });
        return output;
      });
    }

    /**
     * Update the properties for this node
     *
     * @param {Object} properties  New properties
     * @return {Node}
     */
  }, {
    key: "update",
    value: function update(properties) {
      var _this5 = this;
      // TODO: Temporary fix, add the properties to the properties map
      // Sorry, but it's easier than hacking the validator
      this._model.properties().forEach(function (property) {
        var name = property.name();
        if (property.required() && !properties.hasOwnProperty(name)) {
          properties[name] = _this5._properties.get(name);
        }
      });
      return (0, _UpdateNode["default"])(this._neode, this._model, this._identity, properties).then(function (properties) {
        properties.map(function (_ref2) {
          var key = _ref2.key,
            value = _ref2.value;
          _this5._properties.set(key, value);
        });
      }).then(function () {
        return _this5;
      });
    }
  }]);
  return Node;
}(_Entity2["default"]);