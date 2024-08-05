"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vector = /*#__PURE__*/function () {
  /**
   * Add a vector index call to the query
   * @param model {Neode.Model} Model to query
   * @param property {String} Vector property that has been indexed
   * @param nearestNeighbors {Number} Number of nearest neighbors to return
   * @param query {String | Array<Number>} Query, either as a property of a previous node (that is a vector) or a number array
   * @param [nodeAlias] {String} Alias of the node to return (Defaults to ${property}_node)
   * @param [scoreAlias] {String} Alias of the score to return (Defaults to ${property}_score)
   */
  function Vector(model, property, nearestNeighbors, query, nodeAlias, scoreAlias) {
    _classCallCheck(this, Vector);

    this._nearestNeighbors = nearestNeighbors;
    this._query = query;
    this._nodeAlias = nodeAlias;
    this._scoreAlias = scoreAlias;
    this._index = "idx_".concat(model.name(), "_").concat(property, "_vector");
  }

  _createClass(Vector, [{
    key: "toString",
    value: function toString() {
      return "CALL db.index.vector.queryNodes(\"".concat(this._index, "\", $").concat(this._index, "_neighbors, $").concat(this._index, "_query) YIELD node AS ").concat(this._nodeAlias, ", score AS ").concat(this._scoreAlias);
    }
  }, {
    key: "params",
    value: function params() {
      var params = {};
      params["".concat(this._index, "_neighbors")] = this._nearestNeighbors;
      params["".concat(this._index, "_query")] = this._query;
      return params;
    }
  }]);

  return Vector;
}();

exports["default"] = Vector;