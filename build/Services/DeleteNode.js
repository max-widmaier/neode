"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_EAGER_DEPTH = void 0;
exports["default"] = DeleteNode;
var _Builder = _interopRequireWildcard(require("../Query/Builder"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var MAX_EAGER_DEPTH = exports.MAX_EAGER_DEPTH = 10;

/**
 * Add a recursive cascade deletion
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           alias          Alias of node
 * @param {RelationshipType} relationship   relationship type definition
 * @param {Array}            aliases        Current aliases
 * @param {Integer}          to_depth       Maximum depth to delete to
 */
function addCascadeDeleteNode(neode, builder, from_alias, relationship, aliases, to_depth) {
  if (aliases.length > to_depth) return;
  var rel_alias = from_alias + relationship.name() + '_rel';
  var node_alias = from_alias + relationship.name() + '_node';
  var target = neode.model(relationship.target());

  // Optional Match
  builder.optionalMatch(from_alias).relationship(relationship.relationship(), relationship.direction(), rel_alias).to(node_alias, relationship.target());

  // Check for cascade deletions
  target.relationships().forEach(function (relationship) {
    switch (relationship.cascade()) {
      case 'delete':
        addCascadeDeleteNode(neode, builder, node_alias, relationship, aliases.concat(node_alias), to_depth);
        break;

      // case 'detach':
      //     addDetachNode(neode, builder, node_alias, relationship, aliases);
      //     break;
    }
  });

  // Delete it
  builder.detachDelete(node_alias);
}

/**
 * Delete the relationship to the other node
 *
 * @param {Neode}            neode          Neode instance
 * @param {Builder}          builder        Query Builder
 * @param {String}           from_alias     Alias of node at start of the match
 * @param {RelationshipType} relationship   model definition
 * @param {Array}            aliases        Current aliases
 * /
function addDetachNode(neode, builder, from_alias, relationship, aliases) {
    // builder.withDistinct(aliases);

    const rel_alias = from_alias + relationship.name() + '_rel';

    builder.optionalMatch(from_alias)
        .relationship(relationship.relationship(), relationship.direction(), rel_alias)
        .toAnything()
        .delete(rel_alias);

    // builder.withDistinct( aliases );
}
 */

/**
 * Cascade Delete a Node
 *
 * @param {Neode}   neode       Neode instance
 * @param {Integer} identity    Neo4j internal ID of node to delete
 * @param {Model}   model       Model definition
 * @param {Integer} to_depth    Maximum deletion depth
 */
function DeleteNode(neode, identity, model) {
  var to_depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : MAX_EAGER_DEPTH;
  var alias = 'this';
  // const to_delete = [];
  var aliases = [alias];
  // const depth = 1;

  var builder = new _Builder["default"](neode).match(alias, model).whereId(alias, identity);

  // Cascade delete to relationships
  model.relationships().forEach(function (relationship) {
    switch (relationship.cascade()) {
      case 'delete':
        addCascadeDeleteNode(neode, builder, alias, relationship, aliases, to_depth);
        break;

      // case 'detach':
      //     addDetachNode(neode, builder, alias, relationship, aliases);
      //     break;
    }
  });

  // Detach Delete target node
  builder.detachDelete(alias);
  return builder.execute(_Builder.mode.WRITE);
}