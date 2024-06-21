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
 * Collection of Nodes/Relationships
 */
var EntityCollection = exports["default"] = /*#__PURE__*/function (_Symbol$iterator) {
  /**
   * @constructor
   * @param  {Neode} neode    Neode Instance
   * @param  {Entity[]} values  Array of Nodes or Relationships
   * @return {EntityCollection}
   */
  function EntityCollection(neode, values) {
    _classCallCheck(this, EntityCollection);
    this._neode = neode;
    this._values = values || [];
  }

  /**
   * Get length property
   *
   * @return {Int}
   */
  _createClass(EntityCollection, [{
    key: "length",
    get: function get() {
      return this._values.length;
    }

    /**
     * Iterator
     */
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this._values.values();
    }

    /**
     * Get a value by its index
     *
     * @param  {Int} index
     * @return {Node}
     */
  }, {
    key: "get",
    value: function get(index) {
      return this._values[index];
    }

    /**
     * Get the first Node in the Collection
     *
     * @return {Node}
     */
  }, {
    key: "first",
    value: function first() {
      return this._values[0];
    }

    /**
     * Map a function to all values
     *
     * @param  {Function} fn
     * @return {mixed}
     */
  }, {
    key: "map",
    value: function map(fn) {
      return this._values.map(fn);
    }

    /**
     * Find value in collection
     *
     * @param  {Function} fn
     * @return {mixed}
     */
  }, {
    key: "find",
    value: function find(fn) {
      return this._values.find(fn);
    }

    /**
     * Run a function on all values
     * @param  {Function} fn
     * @return {mixed}
     */
  }, {
    key: "forEach",
    value: function forEach(fn) {
      return this._values.forEach(fn);
    }

    /**
     * Map the 'toJson' function on all values
     *
     * @return {Promise}
     */
  }, {
    key: "toJson",
    value: function toJson() {
      return Promise.all(this._values.map(function (value) {
        return value.toJson();
      }));
    }
  }]);
  return EntityCollection;
}(Symbol.iterator);