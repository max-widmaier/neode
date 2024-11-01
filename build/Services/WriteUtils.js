"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ORIGINAL_ALIAS = exports.MAX_CREATE_DEPTH = void 0;
exports.addNodeRelationshipToStatement = addNodeRelationshipToStatement;
exports.addNodeToStatement = addNodeToStatement;
exports.addRelationshipToStatement = addRelationshipToStatement;
var _GenerateDefaultValues = _interopRequireDefault(require("./GenerateDefaultValues"));
var _Node = _interopRequireDefault(require("../Node"));
var _Entity = require("../Entity");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var MAX_CREATE_DEPTH = exports.MAX_CREATE_DEPTH = 99;
var ORIGINAL_ALIAS = exports.ORIGINAL_ALIAS = 'this';

/**
 * Split properties into
 *
 * @param  {String}  mode        'create' or 'merge'
 * @param  {Model}   model        Model to merge on
 * @param  {Object}  properties   Map of properties
 * @param  {Array}   merge_on     Array of properties explicitly stated to merge on
 * @return {Object}               { inline, set, on_create, on_match }
 */
function splitProperties(mode, model, properties) {
  var merge_on = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var inline = {};
  var set = {};
  var on_create = {};
  var on_match = {};

  // Calculate Set Properties
  model.properties().forEach(function (property) {
    var name = property.name();

    // Skip if not set
    if (!properties.hasOwnProperty(name)) {
      return;
    }
    var value = (0, _Entity.valueToCypher)(property, properties[name]);

    // If mode is create, go ahead and set everything
    if (mode == 'create') {
      inline[name] = value;
    } else if (merge_on.indexOf(name) > -1) {
      inline[name] = value;
    }

    // Only set protected properties on creation
    else if (property["protected"]() || property.primary()) {
      on_create[name] = value;
    }

    // Read-only property?
    else if (!property.readonly()) {
      set[name] = value;
    }
  });
  return {
    inline: inline,
    on_create: on_create,
    on_match: on_match,
    set: set
  };
}

/**
 * Add a node to the current statement
 *
 * @param {Neode}   neode       Neode instance
 * @param {Builder} builder     Query builder
 * @param {String}  alias       Alias
 * @param {Model}   model       Model
 * @param {Object}  properties  Map of properties
 * @param {Array}   aliases     Aliases to carry through in with statement
 * @param {String}  mode        'create' or 'merge'
 * @param {Array}   merge_on    Which properties should we merge on?
 */
function addNodeToStatement(neode, builder, alias, model, properties) {
  var aliases = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var mode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'create';
  var merge_on = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [];
  // Split Properties
  var _splitProperties = splitProperties(mode, model, properties, merge_on),
    inline = _splitProperties.inline,
    on_create = _splitProperties.on_create,
    on_match = _splitProperties.on_match,
    set = _splitProperties.set;

  // Add alias
  if (aliases.indexOf(alias) == -1) {
    aliases.push(alias);
  }

  // Create
  builder[mode](alias, model, inline);

  // On create set
  if (Object.keys(on_create).length) {
    Object.entries(on_create).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      builder.onCreateSet("".concat(alias, ".").concat(key), value);
    });
  }

  // On Match Set
  if (Object.keys(on_match).length) {
    Object.entries(on_match).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      builder.onCreateSet("".concat(alias, ".").concat(key), value);
    });
  }

  // Set
  if (Object.keys(set).length) {
    Object.entries(set).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];
      builder.set("".concat(alias, ".").concat(key), value);
    });
  }

  // Relationships
  model.relationships().forEach(function (relationship, key) {
    if (properties.hasOwnProperty(key)) {
      var value = properties[key];
      var rel_alias = "".concat(alias, "_").concat(key, "_rel");
      var target_alias = "".concat(alias, "_").concat(key, "_node");

      // Carry alias through
      builder["with"].apply(builder, _toConsumableArray(aliases));
      if (!relationship.target()) {
        throw new Error("A target defintion must be defined for ".concat(key, " on model ").concat(model.name()));
      } else if (Array.isArray(relationship.target())) {
        throw new Error("You cannot create a node with the ambiguous relationship: ".concat(key, " on model ").concat(model.name()));
      }
      switch (relationship.type()) {
        // Single Relationship
        case 'relationship':
          addRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode);
          break;

        // Array of Relationships
        case 'relationships':
          if (!Array.isArray(value)) value = [value];
          value.forEach(function (value, idx) {
            // Carry alias through
            addRelationshipToStatement(neode, builder, alias, rel_alias + idx, target_alias + idx, relationship, value, aliases, mode);
          });
          break;

        // Single Node
        case 'node':
          addNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode);
          break;

        // Array of Nodes
        case 'nodes':
          if (!Array.isArray(value)) value = [value];
          value.forEach(function (value, idx) {
            addNodeRelationshipToStatement(neode, builder, alias, rel_alias + idx, target_alias + idx, relationship, value, aliases, mode);
          });
          break;
      }
    }
  });
  return builder;
}

/**
 * Add a relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String}          mode        'create' or 'merge'
 */
function addRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode) {
  if (aliases.length > MAX_CREATE_DEPTH) {
    return;
  }

  // Extract Node
  var node_alias = relationship.nodeAlias();
  var node_value = value[node_alias];
  delete value[node_alias];

  // Create Node

  // If Node is passed, attempt to create a relationship to that specific node
  if (node_value instanceof _Node["default"]) {
    builder.match(target_alias).whereId(target_alias, node_value.identity());
  }

  // If Primary key is passed then try to match on that
  else if (typeof node_value == 'string' || typeof node_value == 'number') {
    var model = neode.model(relationship.target());
    builder.merge(target_alias, model, _defineProperty({}, model.primaryKey(), node_value));
  }

  // If Map is passed, attempt to create that node and then relate
  else if (Object.keys(node_value).length) {
    var _model = neode.model(relationship.target());
    if (!_model) {
      throw new Error("Couldn't find a target model for ".concat(relationship.target(), " in ").concat(relationship.name(), ".  Did you use module.exports?"));
    }
    node_value = _GenerateDefaultValues["default"].async(neode, _model, node_value);
    addNodeToStatement(neode, builder, target_alias, _model, node_value, aliases, mode, _model.mergeFields());
  }

  // Create the Relationship
  builder[mode](alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias);

  // Set Relationship Properties
  relationship.properties().forEach(function (property) {
    var name = property.name();
    if (value.hasOwnProperty(name)) {
      builder.set("".concat(rel_alias, ".").concat(name), value[name]);
    }
  });
}

/**
 * Add a node relationship to the current statement
 *
 * @param {Neode}           neode           Neode instance
 * @param {Builder}         builder         Query builder
 * @param {String}          alias           Current node alias
 * @param {String}          rel_alias       Generated alias for the relationship
 * @param {String}          target_alias    Generated alias for the relationship
 * @param {Relationship}    relationship    Model
 * @param {Object}          value           Value map
 * @param {Array}           aliases         Aliases to carry through in with statement
 * @param {String}  mode        'create' or 'merge'
 */
function addNodeRelationshipToStatement(neode, builder, alias, rel_alias, target_alias, relationship, value, aliases, mode) {
  if (aliases.length > MAX_CREATE_DEPTH) {
    return;
  }

  // If Node is passed, attempt to create a relationship to that specific node
  if (value instanceof _Node["default"]) {
    builder.match(target_alias).whereId(target_alias, value.identity());
  }
  // If Primary key is passed then try to match on that
  else if (typeof value == 'string' || typeof value == 'number') {
    var model = neode.model(relationship.target());
    builder.merge(target_alias, model, _defineProperty({}, model.primaryKey(), value));
  }
  // If Map is passed, attempt to create that node and then relate
  // TODO: What happens when we need to validate this?
  // TODO: Is mergeFields() the right option here?
  else if (Object.keys(value).length) {
    var _model2 = neode.model(relationship.target());
    if (!_model2) {
      throw new Error("Couldn't find a target model for ".concat(relationship.target(), " in ").concat(relationship.name(), ".  Did you use module.exports?"));
    }
    value = _GenerateDefaultValues["default"].async(neode, _model2, value);
    addNodeToStatement(neode, builder, target_alias, _model2, value, aliases, mode, _model2.mergeFields());
  }

  // Create the Relationship
  builder[mode](alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(target_alias);
}