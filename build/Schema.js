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
function UniqueConstraintCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  if (mode === 'DROP') {
    return "DROP CONSTRAINT unique_".concat(label, "_").concat(property);
  }
  return "".concat(mode, " CONSTRAINT unique_").concat(label, "_").concat(property, " IF NOT EXISTS FOR (model:").concat(label, ") REQUIRE model.").concat(property, " IS UNIQUE");
}
function ExistsConstraintCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  if (mode === 'DROP') {
    return "DROP CONSTRAINT exists_".concat(label, "_").concat(property);
  }
  return "CREATE CONSTRAINT exists_".concat(label, "_").concat(property, " IF NOT EXISTS FOR (model:").concat(label, ") REQUIRE model.").concat(property, " IS NOT NULL");
}
function IndexCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  if (mode === 'DROP') {
    return "DROP INDEX idx_".concat(label, "_").concat(property);
  }
  return "CREATE INDEX idx_".concat(label, "_").concat(property, " IF NOT EXISTS FOR (n:").concat(label, ") ON (n.").concat(property, ")");
}
function FullTextIndexCypher(label, props, forLabel) {
  var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'CREATE';
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  if (mode === 'DROP') {
    return "DROP INDEX ".concat(label);
  }
  var optionsString = '';
  if (options.indexConfig) {
    optionsString = "\nOPTIONS {\n    indexConfig: {\n        ".concat(options.indexConfig['fulltext.analyzer'] ? '`fulltext.analyzer`: \'' + options.indexConfig['fulltext.analyzer'] + '\'' + (options.indexConfig['fulltext.eventually_consistent'] ? ',' : '') : '', "\n        ").concat(options.indexConfig['fulltext.eventually_consistent'] ? '`fulltext.eventually_consistent`: ' + options.indexConfig['fulltext.eventually_consistent'] : '', "\n    }       \n}");
  }
  return "CREATE FULLTEXT INDEX idx_".concat(label, "_fulltext IF NOT EXISTS FOR ").concat(forLabel, " ON EACH [").concat(props.map(function (p) {
    return "n.".concat(p);
  }).join(', '), "]").concat(optionsString);
}
function VectorIndexCypher(label, property) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'CREATE';
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (options === true) {
    options = {
      dimensions: 1536,
      similarity_function: 'cosine'
    };
  }
  var name = options.name || "idx_".concat(label, "_").concat(property, "_vector");
  if (mode === 'DROP') {
    return "DROP INDEX ".concat(name);
  }
  return "CREATE VECTOR INDEX ".concat(name, " IF NOT EXISTS FOR (n:").concat(label, ") ON (n.").concat(property, ") \n    OPTIONS {indexConfig: {\n        `vector.dimensions`: ").concat(options.dimensions || 1536, ",\n        `vector.similarity_function`: '").concat(options.similarity_function || 'cosine', "'\n    }\n}");
}
function runAsync(session, queries, resolve, reject) {
  var next = queries.pop();
  return session.run(next).then(function () {
    // If there is another query, let's run it
    if (queries.length) {
      return runAsync(session, queries, resolve, reject);
    }

    // Close Session and resolve
    session.close();
    resolve();
  })["catch"](function (e) {
    reject(e);
  });
}
function InstallSchema(neode) {
  var queries = [];
  neode.models.forEach(function (model, label) {
    model.properties().forEach(function (property) {
      // Constraints
      if (property.primary() || property.unique()) {
        queries.push(UniqueConstraintCypher(label, property.name()));
      }
      if (neode.enterprise() && property.required()) {
        queries.push(ExistsConstraintCypher(label, property.name()));
      }

      // Indexes
      if (property.indexed()) {
        queries.push(IndexCypher(label, property.name()));
      }

      // Full text indexes
      if (property.fullTextIndexed()) {
        var indexDef = property.fullTextIndexDefinition();
        var forLabel = '';
        if (property.type() === 'nodeFulltext') {
          forLabel = "(n:".concat(indexDef.models.join('|'), ")");
        } else if (property.type() === 'relationshipFulltext') {
          forLabel = "()-[n:".concat(indexDef.models.join('|'), "]-()");
        }
        queries.push(FullTextIndexCypher(property.name(), indexDef.properties, forLabel, 'CREATE', indexDef.options));
      }
      if (property.vectorIndexed()) {
        queries.push(VectorIndexCypher(label, property.name(), 'CREATE', property.vectorIndex()));
      }
    });
  });
  return neode.batch(queries);
}
function DropSchema(neode) {
  var queries = [];
  neode.models.forEach(function (model, label) {
    model.properties().forEach(function (property) {
      // Constraints
      if (property.unique()) {
        queries.push(UniqueConstraintCypher(label, property.name(), 'DROP'));
      }
      if (neode.enterprise() && property.required()) {
        // queries.push(ExistsConstraintCypher(label, property.name(), 'DROP'));
      }

      // Indexes
      if (property.indexed()) {
        queries.push(IndexCypher(label, property.name(), 'DROP'));
      }
      if (property.fullTextIndexed()) {
        queries.push(FullTextIndexCypher(property.name(), 'N/A', 'N/A', 'DROP'));
      }
      if (property.vectorIndexed()) {
        queries.push(VectorIndexCypher(label, property.name(), 'DROP', property.vectorIndex()));
      }
    });
  });
  var session = neode.writeSession();
  return new Promise(function (resolve, reject) {
    runAsync(session, queries, resolve, reject);
  });
}
var Schema = exports["default"] = /*#__PURE__*/function () {
  function Schema(neode) {
    _classCallCheck(this, Schema);
    this.neode = neode;
  }
  _createClass(Schema, [{
    key: "install",
    value: function install() {
      return InstallSchema(this.neode);
    }
  }, {
    key: "drop",
    value: function drop() {
      return DropSchema(this.neode);
    }
  }]);
  return Schema;
}();