"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Validator;
var _joi = _interopRequireDefault(require("joi"));
var _Model = _interopRequireDefault(require("../Model"));
var _Node = _interopRequireDefault(require("../Node"));
var _RelationshipType = _interopRequireWildcard(require("../RelationshipType"));
var _ValidationError = _interopRequireDefault(require("../ValidationError"));
var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable no-case-declarations */
var joi_options = {
  allowUnknown: true,
  abortEarly: false
};

// TODO: Move these to constants and validate the model schemas a bit better
var ignore = ['labels', 'type', 'default', 'alias', 'properties', 'primary', 'relationship', 'target', 'direction', 'eager', 'hidden', 'readonly', 'index', 'unique', 'cascade',
// For full text indexes
'models', 'options',
// For vectors
'vectorIndex', 'dtype'];
var booleans = ['optional', 'forbidden', 'strip', 'positive', 'negative', 'port', 'integer', 'iso', 'isoDate', 'insensitive', 'required', 'truncate', 'creditCard', 'alphanum', 'token', 'hex', 'hostname', 'lowercase', 'uppercase'];
var booleanOrOptions = ['email', 'ip', 'uri', 'base64', 'normalize', 'hex'];
var temporal = _joi["default"].extend({
  base: _joi["default"].object(),
  name: 'temporal',
  language: {
    before: 'Value before minimum expected value',
    after: 'Value after minimum expected value'
  },
  rules: [{
    name: 'after',
    params: {
      after: _joi["default"].alternatives([_joi["default"].date(), _joi["default"].string()])
    },
    validate: function validate(params, value, state, options) {
      if (params.after === 'now') {
        params.after = new Date();
      }
      if (params.after > new Date(value.toString())) {
        return this.createError('temporal.after', {
          v: value
        }, state, options);
      }
      return value;
    }
  }, {
    name: 'before',
    params: {
      after: _joi["default"].alternatives([_joi["default"].date(), _joi["default"].string()])
    },
    validate: function validate(params, value, state, options) {
      if (params.after === 'now') {
        params.after = new Date();
      }
      if (params.after < new Date(value.toString())) {
        return this.createError('temporal.after', {
          v: value
        }, state, options);
      }
      return value;
    }
  }]
});

// TODO: Ugly
var neoInteger = _joi["default"].extend({
  // base: Joi.number(),
  base: _joi["default"].alternatives()["try"]([_joi["default"].number().integer(), _joi["default"].object().type(_neo4jDriver["default"].types.Integer)]),
  name: 'integer',
  language: {
    before: 'Value before minimum expected value',
    after: 'Value after minimum expected value'
  },
  rules: [{
    name: 'min',
    params: {
      min: _joi["default"].number()
    },
    validate: function validate(params, value, state, options) {
      var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
      if (params.min > compare) {
        return this.createError('number.min', {
          limit: params.min
        }, state, options);
      }
      return value;
    }
  }, {
    name: 'max',
    params: {
      max: _joi["default"].number()
    },
    validate: function validate(params, value, state, options) {
      var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
      if (params.max < compare) {
        return this.createError('number.max', {
          limit: params.max
        }, state, options);
      }
      return value;
    }
  }, {
    name: 'multiple',
    params: {
      multiple: _joi["default"].number()
    },
    validate: function validate(params, value, state, options) {
      var compare = value instanceof _neo4jDriver["default"].types.Integer ? value.toNumber() : value;
      if (compare % params.multiple != 0) {
        return this.createError('number.multiple', {
          multiple: params.max
        }, state, options);
      }
      return value;
    }
  }]
});
var point = _joi["default"].extend({
  base: _joi["default"].object().type(_neo4jDriver["default"].types.Point),
  name: 'point'
});
function nodeSchema() {
  return _joi["default"].alternatives([_joi["default"].object().type(_Node["default"]), _joi["default"].string(), _joi["default"].number(), _joi["default"].object()]);
}
function relationshipSchema(alias) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _joi["default"].object().keys(Object.assign({}, _defineProperty({}, alias, nodeSchema().required()), BuildValidationSchema(properties)));
}
function BuildValidationSchema(schema) {
  if (schema instanceof _Model["default"] || schema instanceof _RelationshipType["default"]) {
    schema = schema.schema();
  }
  var output = {};
  Object.keys(schema).forEach(function (key) {
    // Ignore Labels
    if (key == 'labels') return;
    var config = typeof schema[key] == 'string' ? {
      type: schema[key]
    } : schema[key];
    var validation = false;
    switch (config.type) {
      // TODO: Recursive creation, validate nodes and relationships
      case 'node':
        validation = nodeSchema();
        break;
      case 'nodes':
        validation = _joi["default"].array().items(nodeSchema());
        break;
      case 'relationship':
        // TODO: Clean up... This should probably be an object
        validation = relationshipSchema(config.alias || _RelationshipType.DEFAULT_ALIAS, config.properties);
        break;
      case 'relationships':
        validation = _joi["default"].array().items(relationshipSchema(config.alias || _RelationshipType.DEFAULT_ALIAS, config.properties));
        break;
      case 'uuid':
        validation = _joi["default"].string().guid({
          version: 'uuidv4'
        });
        break;
      case 'string':
      case 'number':
      case 'boolean':
        validation = _joi["default"][config.type]();
        break;
      case 'datetime':
        validation = temporal.temporal().type(_neo4jDriver["default"].types.DateTime);
        break;
      case 'date':
        validation = temporal.temporal().type(_neo4jDriver["default"].types.Date);
        break;
      case 'time':
        validation = temporal.temporal().type(_neo4jDriver["default"].types.Time);
        break;
      case 'localdate':
        validation = temporal.temporal().type(_neo4jDriver["default"].types.LocalDate);
        break;
      case 'localtime':
        validation = temporal.temporal().type(_neo4jDriver["default"].types.LocalTime);
        break;
      case 'point':
        validation = point.point().type(_neo4jDriver["default"].types.Point);
        break;
      case 'int':
      case 'integer':
        validation = neoInteger.integer();
        break;
      case 'float':
        validation = _joi["default"].number();
        break;
      case 'vector':
        validation = _joi["default"].array().items(_joi["default"].number());
        break;
      default:
        validation = _joi["default"].any();
        break;
    }
    if (!config.required) {
      validation = validation.allow(null);
    }

    // Apply additional Validation
    Object.keys(config).forEach(function (validator) {
      var options = config[validator];
      if (validator == 'regex') {
        if (options instanceof RegExp) {
          validation = validation.regex(options);
        } else {
          var pattern = options.pattern;
          delete options.pattern;
          validation = validation.regex(pattern, options);
        }
      } else if (validator == 'replace') {
        validation = validation.replace(options.pattern, options.replace);
      } else if (booleanOrOptions.indexOf(validator) > -1) {
        if (_typeof(options) == 'object') {
          validation = validation[validator](options);
        } else if (options) {
          validation = validation[validator]();
        }
      } else if (booleans.indexOf(validator) > -1) {
        if (options === true) {
          validation = validation[validator](options);
        }
      } else if (ignore.indexOf(validator) == -1 && validation[validator]) {
        validation = validation[validator](options);
      } else if (ignore.indexOf(validator) == -1 && booleans.indexOf(validator) == -1) {
        throw new Error("Not sure how to validate ".concat(validator, " on ").concat(key));
      }
    });
    output[key] = validation;
  });
  return output;
}

/**
 * Run Validation
 *
 * TODO: Recursive Validation
 *
 * @param  {Neode} neode
 * @param  {Model} model
 * @param  {Object} properties
 * @return {Promise}
 */
function Validator(neode, model, properties) {
  var schema = BuildValidationSchema(model, properties);
  return new Promise(function (resolve, reject) {
    _joi["default"].validate(properties, schema, joi_options, function (err, validated) {
      if (err) {
        return reject(new _ValidationError["default"](err.details, properties, err));
      }
      return resolve(validated);
    });
  });
}