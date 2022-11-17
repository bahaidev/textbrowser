function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

/* eslint-disable node/no-unsupported-features/es-syntax */

/**
 * @callback getJSONCallback
 * @param {string|string[]} jsonURL
 * @param {SimpleJSONCallback} cb
 * @param {SimpleJSONErrback} errBack
 * @returns {Promise<JSON>}
 */

/**
 * @param {PlainObject} cfg
 * @param {fetch} cfg.fetch
 * @returns {getJSONCallback}
 */
function _await$2$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _invoke$1(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
function _catch$2(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
function buildGetJSONWithFetch({
  // eslint-disable-next-line no-shadow
  fetch = typeof window !== 'undefined' ? window.fetch : self.fetch
} = {}) {
  /**
  * @callback SimpleJSONCallback
  * @param {JSON} json
  * @returns {void}
  */

  /**
  * @callback SimpleJSONErrback
  * @param {Error} err
  * @param {string|string[]} jsonURL
  * @returns {void}
  */

  /**
  * @type {getJSONCallback}
  */
  return function getJSON(jsonURL, cb, errBack) {
    try {
      let _exit = false;
      return _await$2$1(_catch$2(function () {
        return _invoke$1(function () {
          if (Array.isArray(jsonURL)) {
            return _await$2$1(Promise.all(jsonURL.map(url => {
              return getJSON(url);
            })), function (arrResult) {
              if (cb) {
                // eslint-disable-next-line node/callback-return, node/no-callback-literal, promise/prefer-await-to-callbacks
                cb(...arrResult);
              }
              _exit = true;
              return arrResult;
            });
          }
        }, function (_result) {
          return _exit ? _result : _await$2$1(fetch(jsonURL), function (resp) {
            return _await$2$1(resp.json(), function (result) {
              return typeof cb === 'function' // eslint-disable-next-line promise/prefer-await-to-callbacks
              ? cb(result) : result; // https://github.com/bcoe/c8/issues/135

              /* c8 ignore next */
            });
          });
        });
      }, function (e) {
        e.message += ` (File: ${jsonURL})`;
        if (errBack) {
          return errBack(e, jsonURL);
        }
        throw e; // https://github.com/bcoe/c8/issues/135

        /* c8 ignore next */
      }));
      /* c8 ignore next */
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function _await$1$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}

/* eslint-disable node/no-unsupported-features/node-builtins,
  node/no-unsupported-features/es-syntax, compat/compat */
// Needed for polyglot support (no `path` in browser); even if
//  polyglot using dynamic `import` not supported by Rollup (complaining
//  of inability to do tree-shaking in UMD builds), still useful to delay
//  path import for our testing, so that test can import this file in
//  the browser without compilation without it choking
let dirname, isWindows;
function _empty() {}
/**
 * @param {string} path
 * @returns {string}
 */

function _invokeIgnored(body) {
  var result = body();
  if (result && result.then) {
    return result.then(_empty);
  }
}
function _async$1$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
const setDirname = _async$1$1(function () {
  return _invokeIgnored(function () {
    if (!dirname) {
      return _await$1$1(import('path'), function (_import) {
        ({
          dirname
        } = _import);
      });
    }
  });
});
function fixWindowsPath(path) {
  if (!isWindows) {
    isWindows = process.platform === 'win32';
  }
  return path.slice(
  // https://github.com/bcoe/c8/issues/135

  /* c8 ignore next */
  isWindows ? 1 : 0);
}
/**
 * @param {string} url
 * @returns {string}
 */

function getDirectoryForURL(url) {
  // Node should be ok with this, but transpiling
  //  to `require` doesn't work, so detect Windows
  //  to remove slash instead
  // "file://" +
  return fixWindowsPath(dirname(new URL(url).pathname));
}

/* eslint-disable node/no-unsupported-features/es-syntax */

function _await$3(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
let nodeFetch;
/**
 * @param {PlainObject} cfg
 * @param {string} cfg.baseURL
 * @param {string} cfg.cwd
 * @returns {getJSONCallback}
 */

function _invoke$2(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
function _call(body, then, direct) {
  if (direct) {
    return then ? then(body()) : body();
  }
  try {
    var result = Promise.resolve(body());
    return then ? result.then(then) : result;
  } catch (e) {
    return Promise.reject(e);
  }
}
function _async$2(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function buildGetJSON({
  baseURL,
  cwd: basePath
} = {}) {
  const _fetch = typeof fetch !== 'undefined' ? fetch : _async$2(function (jsonURL) {
    let _exit = false;
    return _invoke$2(function () {
      if (/^https?:/u.test(jsonURL)) {
        return _invoke$2(function () {
          if (!nodeFetch) {
            return _await$3(import('node-fetch'), function (_import) {
              nodeFetch = _import;
            });
          }
        }, function () {
          const _nodeFetch$default = nodeFetch.default(jsonURL);
          _exit = true;
          return _nodeFetch$default;
        });
      }
    }, function (_result) {
      return _exit ? _result : _invoke$2(function () {
        if (!basePath) {
          return _call(setDirname, function () {
            basePath = baseURL ? getDirectoryForURL(baseURL) : typeof fetch === 'undefined' && process.cwd();
          });
        }
      }, function () {
        // Filed https://github.com/bergos/file-fetch/issues/12 to see
        //  about getting relative basePaths in `file-fetch` and using
        //  that better-tested package instead
        return _await$3(import('local-xmlhttprequest'), function (localXMLHttpRequest) {
          // eslint-disable-next-line no-shadow
          const XMLHttpRequest = localXMLHttpRequest.default({
            basePath
          }); // Don't change to an import as won't resolve for browser testing
          // eslint-disable-next-line promise/avoid-new

          return new Promise((resolve, reject) => {
            const r = new XMLHttpRequest();
            r.open('GET', jsonURL, true); // r.responseType = 'json';
            // eslint-disable-next-line unicorn/prefer-add-event-listener -- May not be available

            r.onreadystatechange = function () {
              // Not sure how to simulate `if`

              /* c8 ignore next */
              if (r.readyState !== 4) {
                return;
              }
              if (r.status === 200) {
                // var json = r.json;
                const response = r.responseText;
                resolve({
                  json: () => JSON.parse(response)
                });
                return;
              }
              reject(new SyntaxError('Failed to fetch URL: ' + jsonURL + 'state: ' + r.readyState + '; status: ' + r.status));
            };
            r.send(); // https://github.com/bcoe/c8/issues/135

            /* c8 ignore next */
          });
          /* c8 ignore next */
        });
      });
    });
  });

  const ret = buildGetJSONWithFetch({
    fetch: _fetch
  });
  ret._fetch = _fetch;
  ret.hasURLBasePath = Boolean(baseURL);
  ret.basePath = basePath;
  return ret;
}
const getJSON = buildGetJSON();

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";

  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof$1(obj);
}
function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };
  var _super = RegExp.prototype,
    _groups = new WeakMap();
  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);
    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
  }
  function buildGroups(result, re) {
    var g = _groups.get(re);
    return Object.keys(g).reduce(function (groups, name) {
      var i = g[name];
      if ("number" == typeof i) groups[name] = result[i];else {
        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;
        groups[name] = result[i[k]];
      }
      return groups;
    }, Object.create(null));
  }
  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);
    if (result) {
      result.groups = buildGroups(result, this);
      var indices = result.indices;
      indices && (indices.groups = buildGroups(indices, this));
    }
    return result;
  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);
      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        var group = groups[name];
        return "$" + (Array.isArray(group) ? group.join("$") : group);
      }));
    }
    if ("function" == typeof substitution) {
      var _this = this;
      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;
        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
      });
    }
    return _super[Symbol.replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
}
function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit$1(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';

var _jsonExtra = globalThis.jsonExtra;
var unescapeBackslashes = function unescapeBackslashes(str) {
  return str.replace(/\\+/g, function (esc) {
    return esc.slice(0, esc.length / 2);
  });
};
var parseJSONExtra = function parseJSONExtra(args) {
  return _jsonExtra.parse(
  // Doesn't actually currently allow explicit brackets,
  //  but in case we change our regex to allow inner brackets
  '{' + (args || '').replace(/^\{/, '').replace(/\}$/, '') + '}');
};

// Todo: Extract to own library (RegExtras?)
var processRegex = function processRegex(regex, str, _ref) {
  var onMatch = _ref.onMatch,
    extra = _ref.extra,
    betweenMatches = _ref.betweenMatches,
    afterMatch = _ref.afterMatch,
    escapeAtOne = _ref.escapeAtOne;
  var match;
  var previousIndex = 0;
  if (extra) {
    betweenMatches = extra;
    afterMatch = extra;
    escapeAtOne = extra;
  }
  while ((match = regex.exec(str)) !== null) {
    var _match = match,
      _match2 = _slicedToArray$1(_match, 2),
      _ = _match2[0],
      esc = _match2[1];
    var lastIndex = regex.lastIndex;
    var startMatchPos = lastIndex - _.length;
    if (startMatchPos > previousIndex) {
      betweenMatches(str.slice(previousIndex, startMatchPos));
    }
    if (escapeAtOne && esc.length % 2) {
      previousIndex = lastIndex;
      escapeAtOne(_);
      continue;
    }
    onMatch.apply(void 0, _toConsumableArray$1(match));
    previousIndex = lastIndex;
  }
  if (previousIndex !== str.length) {
    // Get text at end
    afterMatch(str.slice(previousIndex));
  }
};

/* globals fetch, document */
var _fetch = typeof fetch !== 'undefined' ? fetch
/* c8 ignore next */ : null;

/**
 * @returns {fetch}
 */
var getFetch = function getFetch() {
  return _fetch;
};
var _doc = typeof document !== 'undefined'
/* c8 ignore next */ ? document : null;

/**
 * @returns {document}
 */
var getDocument = function getDocument() {
  return _doc;
};

/**
 *
 * @returns {string}
 */
function generateUUID() {
  //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
  var d = Date.now();
  /* c8 ignore next 5 */
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    /* eslint-disable no-bitwise */
    var r = Math.trunc((d + Math.random() * 16) % 16);
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    /* eslint-enable no-bitwise */
  });
}

var sort = function sort(locale, arrayOfItems, options) {
  return arrayOfItems.sort(new Intl.Collator(locale, options).compare);
};
var list = function list(locale, arrayOfItems, options) {
  return new Intl.ListFormat(locale, options).format(arrayOfItems);
};
var sortListSimple = function sortListSimple(locale, arrayOfItems, listOptions, collationOptions) {
  sort(locale, arrayOfItems, collationOptions);
  return list(locale, arrayOfItems, listOptions);
};
var sortList = function sortList(locale, arrayOfItems, map, listOptions, collationOptions) {
  if (typeof map !== 'function') {
    return sortListSimple(locale, arrayOfItems, map, listOptions);
  }
  sort(locale, arrayOfItems, collationOptions);
  var randomId = generateUUID();
  var placeholderArray = _toConsumableArray$1(arrayOfItems).map(function (_, i) {
    return "<<".concat(randomId).concat(i, ">>");
  });
  var nodes = [];
  var push = function push() {
    nodes.push.apply(nodes, arguments);
  };
  processRegex(
  // // eslint-disable-next-line prefer-named-capture-group
  new RegExp("<<".concat(randomId, "(\\d)>>"), 'gu'), list(locale, placeholderArray, listOptions), {
    betweenMatches: push,
    afterMatch: push,
    onMatch: function onMatch(_, idx) {
      push(map(arrayOfItems[idx], idx));
    }
  });
  var _doc = getDocument();
  var container = _doc.createDocumentFragment();
  container.append.apply(container, nodes);
  return container;
};
var getFormatterInfo = function getFormatterInfo(_ref) {
  var object = _ref.object;
  if (Array.isArray(object)) {
    if (typeof object[1] === 'function') {
      var _object = _slicedToArray$1(object, 4),
        _value = _object[0],
        callback = _object[1],
        _options = _object[2],
        _extraOpts = _object[3];
      return {
        value: _value,
        callback: callback,
        options: _options,
        extraOpts: _extraOpts
      };
    }
    var _object2 = _slicedToArray$1(object, 3),
      value = _object2[0],
      options = _object2[1],
      extraOpts = _object2[2];
    return {
      value: value,
      options: options,
      extraOpts: extraOpts
    };
  }
  return {
    value: object
  };
};

/* eslint-disable max-len */
/**
 * Callback to give replacement text based on a substitution value.
 * @callback AllSubstitutionCallback
 * @param {PlainObject} cfg
 * @param {string|Node|number|Date|RelativeTimeInfo|ListInfo|NumberInfo|DateInfo} cfg.value Contains
 *   the value returned by the individual substitution
 * @param {string} cfg.arg See `cfg.arg` of {@link SubstitutionCallback}.
 * @param {string} cfg.key The substitution key Not currently in use
 * @param {string} cfg.locale The locale
 * @returns {string|Element} The replacement text or element
*/
/* eslint-enable max-len */

/**
 * @type {AllSubstitutionCallback}
 */
var defaultAllSubstitutions = function defaultAllSubstitutions(_ref2) {
  var _Intl$DateTimeFormat;
  var value = _ref2.value,
    arg = _ref2.arg;
  _ref2.key;
  var locale = _ref2.locale;
  // Strings or DOM Nodes
  if (typeof value === 'string' || value && _typeof$1(value) === 'object' && 'nodeType' in value) {
    return value;
  }
  var opts;
  var applyArgs = function applyArgs(_ref3) {
    var type = _ref3.type,
      _ref3$options = _ref3.options,
      options = _ref3$options === void 0 ? opts : _ref3$options,
      _ref3$checkArgOptions = _ref3.checkArgOptions,
      checkArgOptions = _ref3$checkArgOptions === void 0 ? false : _ref3$checkArgOptions;
    if (typeof arg === 'string') {
      var _arg$split = arg.split('|'),
        _arg$split2 = _slicedToArray$1(_arg$split, 3),
        userType = _arg$split2[0],
        extraArgs = _arg$split2[1],
        argOptions = _arg$split2[2];
      // Alias
      if (userType === 'DATE') {
        userType = 'DATETIME';
      }
      if (userType === type) {
        if (!extraArgs) {
          options = {};
        } else if (!checkArgOptions || argOptions) {
          // Todo: Allow escaping and restoring of pipe symbol
          options = _objectSpread2(_objectSpread2({}, options), parseJSONExtra(checkArgOptions && argOptions ? argOptions : extraArgs));
        }
      }
    }
    return options;
  };
  var expectsDatetime = false;
  if (value && _typeof$1(value) === 'object' && !Array.isArray(value)) {
    var singleKey = Object.keys(value)[0];
    if (['number', 'date', 'datetime', 'dateRange', 'datetimeRange', 'relative', 'region', 'language', 'script', 'currency', 'list', 'plural'].includes(singleKey)) {
      var extraOpts, callback;
      var _getFormatterInfo = getFormatterInfo({
        object: value[singleKey]
      });
      value = _getFormatterInfo.value;
      opts = _getFormatterInfo.options;
      extraOpts = _getFormatterInfo.extraOpts;
      callback = _getFormatterInfo.callback;
      switch (singleKey) {
        case 'date':
        case 'datetime':
          expectsDatetime = true;
          break;
        case 'dateRange':
        case 'datetimeRange':
          return (_Intl$DateTimeFormat = new Intl.DateTimeFormat(locale, applyArgs({
            type: 'DATERANGE',
            options: extraOpts
          }))).formatRange.apply(_Intl$DateTimeFormat, _toConsumableArray$1([value, opts].map(function (val) {
            return typeof val === 'number' ? new Date(val) : val;
          })));
        case 'region':
        case 'language':
        case 'script':
        case 'currency':
          return new Intl.DisplayNames(locale, _objectSpread2(_objectSpread2({}, applyArgs({
            type: singleKey.toUpperCase()
          })), {}, {
            type: singleKey
          })).of(value);
        case 'relative':
          // The second argument actually contains the primary options, so swap
          var _ref4 = [opts, extraOpts];
          extraOpts = _ref4[0];
          opts = _ref4[1];
          return new Intl.RelativeTimeFormat(locale, applyArgs({
            type: 'RELATIVE'
          })).format(value, extraOpts);

        // ListFormat (with Collator)
        case 'list':
          if (callback) {
            return sortList(locale, value, callback, applyArgs({
              type: 'LIST'
            }), applyArgs({
              type: 'LIST',
              options: extraOpts,
              checkArgOptions: true
            }));
          }
          return sortList(locale, value, applyArgs({
            type: 'LIST'
          }), applyArgs({
            type: 'LIST',
            options: extraOpts,
            checkArgOptions: true
          }));
      }
    }
  }

  // Dates
  if (value) {
    if (typeof value === 'number' && (expectsDatetime || /^DATE(?:TIME)(?:\||$)/.test(arg))) {
      value = new Date(value);
    }
    if (_typeof$1(value) === 'object' && typeof value.getTime === 'function') {
      return new Intl.DateTimeFormat(locale, applyArgs({
        type: 'DATETIME'
      })).format(value);
    }
  }

  // Date range
  if (Array.isArray(value)) {
    var _Intl$DateTimeFormat2;
    var _extraOpts2 = value[2];
    return (_Intl$DateTimeFormat2 = new Intl.DateTimeFormat(locale, applyArgs({
      type: 'DATERANGE',
      options: _extraOpts2
    }))).formatRange.apply(_Intl$DateTimeFormat2, _toConsumableArray$1(value.slice(0, 2).map(function (val) {
      return typeof val === 'number' ? new Date(val) : val;
    })));
  }

  // Numbers
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, applyArgs({
      type: 'NUMBER'
    })).format(value);
  }

  // console.log('value', value);
  throw new TypeError('Unknown formatter');
};

/**
 * Base class for formatting.
 */
var Formatter = /*#__PURE__*/_createClass(function Formatter() {
  _classCallCheck(this, Formatter);
});

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.key
 * @param {LocaleBody} cfg.body
 * @param {string} cfg.type
 * @param {"richNested"|"rich"|"plain"|
 *   "plainNested"|MessageStyleCallback} cfg.messageStyle
 * @returns {string|Element}
 */
var _getSubstitution = function getSubstitution(_ref) {
  var key = _ref.key,
    body = _ref.body,
    type = _ref.type,
    _ref$messageStyle = _ref.messageStyle,
    messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle;
  var messageForKey = getMessageForKeyByStyle({
    messageStyle: messageStyle
  });
  var substitution = messageForKey({
    body: body
  }, key);
  if (!substitution) {
    throw new Error("Key value not found for ".concat(type, " key: (").concat(key, ")"));
  }
  // We don't allow a substitution function here or below as comes
  //  from locale and locale content should not pose security concerns
  return substitution.value;
};

/**
 * Formatter for local variables.
 */
var LocalFormatter = /*#__PURE__*/function (_Formatter) {
  _inherits(LocalFormatter, _Formatter);
  var _super = _createSuper(LocalFormatter);
  /**
   * @param {LocalObject} locals
   */
  function LocalFormatter(locals) {
    var _this;
    _classCallCheck(this, LocalFormatter);
    _this = _super.call(this);
    _this.locals = locals;
    return _this;
  }
  /**
   * @param {string} key
   * @returns {string|Element}
   */
  _createClass(LocalFormatter, [{
    key: "getSubstitution",
    value: function getSubstitution(key) {
      return _getSubstitution({
        key: key.slice(1),
        body: this.locals,
        type: 'local'
      });
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
  }, {
    key: "isMatch",
    value: function isMatch(key) {
      var components = key.slice(1).split('.');
      var parent = this.locals;
      return this.constructor.isMatchingKey(key) && components.every(function (cmpt) {
        var result = (cmpt in parent);
        parent = parent[cmpt];
        return result;
      });
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
      return key.startsWith('-');
    }
  }]);
  return LocalFormatter;
}(Formatter);

/**
 * Formatter for regular variables.
 */
var RegularFormatter = /*#__PURE__*/function (_Formatter2) {
  _inherits(RegularFormatter, _Formatter2);
  var _super2 = _createSuper(RegularFormatter);
  /**
   * @param {SubstitutionObject} substitutions
   */
  function RegularFormatter(substitutions) {
    var _this2;
    _classCallCheck(this, RegularFormatter);
    _this2 = _super2.call(this);
    _this2.substitutions = substitutions;
    return _this2;
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  _createClass(RegularFormatter, [{
    key: "isMatch",
    value: function isMatch(key) {
      return this.constructor.isMatchingKey(key) && key in this.substitutions;
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
      return /^[0-9A-Z_a-z]/.test(key);
    }
  }]);
  return RegularFormatter;
}(Formatter);

/**
 * Formatter for switch variables.
 */
var SwitchFormatter = /*#__PURE__*/function (_Formatter3) {
  _inherits(SwitchFormatter, _Formatter3);
  var _super3 = _createSuper(SwitchFormatter);
  /**
   * @param {Switches} switches
   * @param {SubstitutionObject} substitutions
   */
  function SwitchFormatter(switches, _ref2) {
    var _this3;
    var substitutions = _ref2.substitutions;
    _classCallCheck(this, SwitchFormatter);
    _this3 = _super3.call(this);
    _this3.switches = switches;
    _this3.substitutions = substitutions;
    return _this3;
  }

  /**
   * @param {string} key
   * @param {PlainObject} cfg
   * @param {string} cfg.locale
   * @param {string[]} cfg.usedKeys
   * @param {string} cfg.arg
   * @param {MissingSuppliedFormattersCallback} cfg.missingSuppliedFormatters
   * @returns {string}
   */
  _createClass(SwitchFormatter, [{
    key: "getSubstitution",
    value: function getSubstitution(key, _ref3) {
      var locale = _ref3.locale,
        usedKeys = _ref3.usedKeys,
        arg = _ref3.arg,
        missingSuppliedFormatters = _ref3.missingSuppliedFormatters;
      var ky = this.constructor.getKey(key).slice(1);
      // Expression might not actually use formatter, e.g., for singular,
      //  the conditional might just write out "one"

      var _this$getMatch = this.getMatch(ky),
        _this$getMatch2 = _slicedToArray$1(_this$getMatch, 3),
        objKey = _this$getMatch2[0],
        body = _this$getMatch2[1],
        keySegment = _this$getMatch2[2];
      usedKeys.push(keySegment);
      var type, opts;
      if (objKey && objKey.includes('|')) {
        var _objKey$split = objKey.split('|');
        var _objKey$split2 = _slicedToArray$1(_objKey$split, 3);
        type = _objKey$split2[1];
        opts = _objKey$split2[2];
      }
      if (!body) {
        missingSuppliedFormatters({
          key: key,
          formatter: this
        });
        return '\\{' + key + '}';
      }

      /*
      if (!(ky in this.substitutions)) {
        throw new Error(`Switch expecting formatter: ${ky}`);
      }
      */

      var getNumberFormat = function getNumberFormat(value, defaultOptions) {
        var numberOpts = parseJSONExtra(opts);
        return new Intl.NumberFormat(locale, _objectSpread2(_objectSpread2({}, defaultOptions), numberOpts)).format(value);
      };
      var getPluralFormat = function getPluralFormat(value, defaultOptions) {
        var pluralOpts = parseJSONExtra(opts);
        return new Intl.PluralRules(locale, _objectSpread2(_objectSpread2({}, defaultOptions), pluralOpts)).select(value);
      };
      var formatterValue = this.substitutions[keySegment];
      var match = formatterValue;
      if (typeof formatterValue === 'number') {
        switch (type) {
          case 'NUMBER':
            match = getNumberFormat(formatterValue);
            break;
          case 'PLURAL':
            match = getPluralFormat(formatterValue);
            break;
          default:
            match = new Intl.PluralRules(locale).select(formatterValue);
            break;
        }
      } else if (formatterValue && _typeof$1(formatterValue) === 'object') {
        var singleKey = Object.keys(formatterValue)[0];
        if (['number', 'plural'].includes(singleKey)) {
          var _getFormatterInfo = getFormatterInfo({
              object: formatterValue[singleKey]
            }),
            value = _getFormatterInfo.value,
            options = _getFormatterInfo.options;
          if (!type) {
            type = singleKey.toUpperCase();
          }
          var typeMatches = singleKey.toUpperCase() === type;
          if (!typeMatches) {
            throw new TypeError("Expecting type \"".concat(type.toLowerCase(), "\"; instead found \"").concat(singleKey, "\"."));
          }
          // eslint-disable-next-line default-case
          switch (type) {
            case 'NUMBER':
              match = getNumberFormat(value, options);
              break;
            case 'PLURAL':
              match = getPluralFormat(value, options);
              break;
          }
        }
      }

      // We do not want the default `richNested` here as that will split
      //  up the likes of `0.0`
      var messageStyle = 'richNested';
      var preventNesting = function preventNesting(s) {
        return s.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
      };
      try {
        return _getSubstitution({
          messageStyle: messageStyle,
          key: match ? preventNesting(match) : arg,
          body: body,
          type: 'switch'
        });
      } catch (err) {
        try {
          return _getSubstitution({
            messageStyle: messageStyle,
            key: '*' + preventNesting(match),
            body: body,
            type: 'switch'
          });
        } catch (error) {
          var k = Object.keys(body).find(function (switchKey) {
            return switchKey.startsWith('*');
          });
          if (!k) {
            throw new Error("No defaults found for switch ".concat(ky));
          }
          return _getSubstitution({
            messageStyle: messageStyle,
            key: preventNesting(k),
            body: body,
            type: 'switch'
          });
        }
      }
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
  }, {
    key: "isMatch",
    value: function isMatch(key) {
      return key && this.constructor.isMatchingKey(key) && Boolean(this.getMatch(key.slice(1)).length);
    }

    /**
    * @typedef {GenericArray} SwitchMatch
    * @property {string} 0 objKey
    * @property {LocaleBody} 1 body
    * @property {string} 2 keySegment
    */

    /**
     * @param {string} ky
     * @returns {SwitchMatch}
     */
  }, {
    key: "getMatch",
    value: function getMatch(ky) {
      var _this4 = this;
      var ks = ky.split('.');
      return ks.reduce(function (obj, k, i) {
        if (i < ks.length - 1) {
          if (!(k in obj)) {
            throw new Error("Switch key \"".concat(k, "\" not found (from \"~").concat(ky, "\")"));
          }
          return obj[k];
        }
        // Todo: Should throw on encountering duplicate fundamental keys (even
        //  if there are different arguments, that should not be allowed)
        var ret = Object.entries(obj).find(function (_ref4) {
          var _ref5 = _slicedToArray$1(_ref4, 1),
            switchKey = _ref5[0];
          return k === _this4.constructor.getKey(switchKey);
        });
        return ret ? [].concat(_toConsumableArray$1(ret), [k]) : [];
      }, this.switches);
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
      return key.startsWith('~');
    }
    /**
     * @param {string} key
     * @returns {string}
     */
  }, {
    key: "getKey",
    value: function getKey(key) {
      var match = key.match(/^(?:(?!\|)[\s\S])*/);
      return match && match[0];
    }
  }]);
  return SwitchFormatter;
}(Formatter);

/**
* @callback PromiseChainErrback
* @param {(value: any) => Promise<any>} errBack
* @returns {Promise<any>|any}
*/

/**
 * The given array will have its items processed in series; if the supplied
 *  `errBack` (which is guaranteed to run at least once), when passed the
 *  current item, returns a `Promise` or value that resolves, that value will
 *  be used for the return result of this function and no other items in
 *  the array will continue to be processed; if it rejects, however, the
 *  next item will be processed with `errBack`.
 * Accept an array of values to pass to an errback which should return
 *  a promise (or final result value) which resolves to a result or which
 *  rejects so that the next item in the array can be checked in series.
 * @param {Array<any>} values Array of values
 * @param {PromiseChainErrback} errBack Accepts an item of the array as its
 *   single argument
 * @param {string} [errorMessage="Reached end of values array."]
 * @returns {Promise<any>} Either resolves to a value derived from an item in
 *  the array or rejects if all items reject
 * @example
promiseChainForValues(['a', 'b', 'c'], (val) => {
  return new Promise(function (resolve, reject) {
    if (val === 'a') {
      reject(new Error('missing'));
    }
    setTimeout(() => {
      resolve(val);
    }, 100);
  });
});
 */

function _await$2(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _catch$1(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }
        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }
    pact.s = state;
    pact.v = value;
    var observer = pact.o;
    if (observer) {
      observer(pact);
    }
  }
}
var _Pact = /*#__PURE__*/function () {
  function _Pact() {}
  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;
    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;
      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }
        return result;
      } else {
        return this;
      }
    }
    this.o = function (_this) {
      try {
        var value = _this.v;
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };
    return result;
  };
  return _Pact;
}();
function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}
function _for(test, update, body) {
  var stage;
  for (;;) {
    var shouldContinue = test();
    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }
    if (!shouldContinue) {
      return result;
    }
    if (shouldContinue.then) {
      stage = 0;
      break;
    }
    var result = body();
    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }
    if (update) {
      var updateValue = update();
      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }
  var pact = new _Pact();
  var reject = _settle.bind(null, pact, 2);
  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;
  function _resumeAfterBody(value) {
    result = value;
    do {
      if (update) {
        updateValue = update();
        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }
      shouldContinue = test();
      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);
        return;
      }
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }
      result = body();
      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);
    result.then(_resumeAfterBody).then(void 0, reject);
  }
  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();
      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}
function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}
function _async$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
var promiseChainForValues = function promiseChainForValues(values, errBack) {
  var errorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Reached end of values array.';
  if (!Array.isArray(values)) {
    throw new TypeError('The `values` argument to `promiseChainForValues` must be an array.');
  }
  if (typeof errBack !== 'function') {
    throw new TypeError('The `errBack` argument to `promiseChainForValues` must be a function.');
  }
  return _async$1(function () {
    var _exit = false,
      _interrupt = false;
    var ret;
    var p = Promise.reject(new Error('Intentionally reject so as to begin checking chain'));
    var breaking;
    return _continue(_for(function () {
      return !(_interrupt || _exit);
    }, void 0, function () {
      var value = values.shift();
      return _catch$1(function () {
        // eslint-disable-next-line no-await-in-loop
        return _await$2(p, function (_p) {
          ret = _p;
          _interrupt = true;
        });
      }, function () {
        if (breaking) {
          throw new Error(errorMessage);
        }
        // We allow one more try
        if (!values.length) {
          breaking = true;
        }
        // // eslint-disable-next-line no-await-in-loop
        p = errBack(value);
      });
    }), function (_result2) {
      return ret;
    });
  })();
};

/**
* @callback SubstitutionCallback
* @param {PlainObject} cfg
* @param {string} cfg.arg By default, accepts the third portion of the
*   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
*   supply arguments back to the calling script.
* @param {string} cfg.key The substitution key
* @returns {string|Element} The replacement text or element
*/

/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * @typedef {GenericArray} ValueArray
 * @property {string|Node|number|Date} 0 The main value
 * @property {PlainObject} [1] The options related to the main value
 * @property {PlainObject} [2] Any additional options
*/

/**
* @typedef {PlainObject} RelativeTimeInfo
* @property {ValueArray} relative
*/

/**
* @typedef {PlainObject} ListInfo
* @property {ValueArray} list
*/

/**
* @typedef {PlainObject} NumberInfo
* @property {ValueArray} number
*/

/**
* @typedef {PlainObject} DateInfo
* @property {ValueArray} date
*/

/**
* @typedef {Object<string, string>} PlainLocaleStringBodyObject
*/

/**
* @typedef {PlainObject} SwitchCaseInfo
* @property {boolean} [default=false] Whether this conditional is the default
*/

/**
* @typedef {GenericArray} SwitchCase
* @property {string} 0 The type
* @property {string} 1 The message
* @property {SwitchCaseInfo} [2] Info about the switch case
*/

/**
* @typedef {PlainObject<string, SwitchCase>} Switch
*/

/**
* @typedef {PlainObject<{string, Switch}>} Switches
*/

/**
* @typedef {PlainObject} LocaleStringSubObject
* @property {string} [message] The locale message with any formatting
*   place-holders; defaults to use of any single conditional
* @property {string} [description] A description to add translators
* @property {Switches} [switches] Conditionals
*/

/**
* @typedef {PlainObject<string, LocaleStringSubObject>} LocaleStringBodyObject
*/

/**
 * Takes a base path and locale and gives a URL.
 * @callback LocaleResolver
 * @param {string} localesBasePath (Trailing slash optional)
 * @param {string} locale BCP-47 language string
 * @returns {string} URL of the locale file to be fetched
*/

/**
* @typedef {PlainObject<string, string|Element|
* SubstitutionCallback>} SubstitutionObject
*/

/**
 * @type {LocaleResolver}
 */
var defaultLocaleResolver = function defaultLocaleResolver(localesBasePath, locale) {
  if (typeof localesBasePath !== 'string') {
    throw new TypeError('`defaultLocaleResolver` expects a string `localesBasePath`.');
  }
  if (typeof locale !== 'string') {
    throw new TypeError('`defaultLocaleResolver` expects a string `locale`.');
  }
  if (/[\.\/\\]/.test(locale)) {
    throw new TypeError('Locales cannot use file-reserved characters, `.`, `/` or `\\`');
  }
  return "".concat(localesBasePath.replace(/\/$/, ''), "/_locales/").concat(locale, "/messages.json");
};

/* eslint-disable max-len */
/**
 * Callback to return a string or array of nodes and strings based on a localized
 * string, substitutions object, and other metadata.
 * @callback InsertNodesCallback
 * @param {PlainObject} cfg
 * @param {string} cfg.string The localized string
 * @param {boolean} [cfg.dom] If substitutions known to contain DOM, can be set
 *   to `true` to optimize
 * @param {string[]} [cfg.usedKeys=[]] Array for tracking which keys have been used
 * @param {SubstitutionObject} cfg.substitutions The formatting substitutions object
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions] The
 *   callback or array composed thereof for applying to each substitution.
 * @param {string} locale The successfully resolved locale
 * @param {Integer} [maximumLocalNestingDepth=3] Depth of local variable resolution to
 *   check before reporting a recursion error
 * @param {MissingSuppliedFormattersCallback} [cfg.missingSuppliedFormatters] Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * @param {CheckExtraSuppliedFormattersCallback} [cfg.checkExtraSuppliedFormatters] No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @returns {string|Array<Node|string>}
 */

/**
 * @type {InsertNodesCallback}
 */
var defaultInsertNodes = function defaultInsertNodes(_ref) {
  var string = _ref.string,
    dom = _ref.dom,
    usedKeys = _ref.usedKeys,
    substitutions = _ref.substitutions,
    allSubstitutions = _ref.allSubstitutions,
    locale = _ref.locale,
    locals = _ref.locals,
    switches = _ref.switches,
    _ref$maximumLocalNest = _ref.maximumLocalNestingDepth,
    maximumLocalNestingDepth = _ref$maximumLocalNest === void 0 ? 3 : _ref$maximumLocalNest,
    missingSuppliedFormatters = _ref.missingSuppliedFormatters,
    checkExtraSuppliedFormatters = _ref.checkExtraSuppliedFormatters;
  if (typeof maximumLocalNestingDepth !== 'number') {
    throw new TypeError('`maximumLocalNestingDepth` must be a number.');
  }
  var addFunctionKeys = function addFunctionKeys() {
    Object.entries(substitutions).forEach(function (_ref2) {
      var _ref3 = _slicedToArray$1(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];
      if (typeof value === 'function') {
        usedKeys.push(key);
      }
    });
  };
  addFunctionKeys();
  var localFormatter = new LocalFormatter(locals);
  var regularFormatter = new RegularFormatter(substitutions);
  var switchFormatter = new SwitchFormatter(switches, {
    substitutions: substitutions
  });

  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
  var formattingRegex = /(\\*)\{((?:(?:(?!\})[\s\S])|\\\})*?)(?:(\|)((?:(?!\})[\s\S])*))?\}/g;
  if (allSubstitutions) {
    allSubstitutions = Array.isArray(allSubstitutions) ? allSubstitutions : [allSubstitutions];
  }
  var getSubstitution = function getSubstitution(_ref4) {
    var key = _ref4.key,
      arg = _ref4.arg,
      substs = _ref4.substs;
    var substitution;
    var isLocalKey = localFormatter.constructor.isMatchingKey(key);
    if (isLocalKey) {
      substitution = localFormatter.getSubstitution(key);
    } else if (switchFormatter.constructor.isMatchingKey(key)) {
      substitution = switchFormatter.getSubstitution(key, {
        locale: locale,
        usedKeys: usedKeys,
        arg: arg,
        missingSuppliedFormatters: missingSuppliedFormatters
      });
    } else {
      substitution = substs[key];
      if (typeof substitution === 'function') {
        substitution = substitution({
          arg: arg,
          key: key
        });
      }
    }
    // Todo: Could support resolving locals within arguments
    // Todo: Even for `null` `allSubstitutions`, we could have
    //  a mode to throw for non-string/non-DOM (non-numbers?),
    //  or whatever is not likely intended as a target for `toString()`.
    if (allSubstitutions) {
      substitution = allSubstitutions.reduce(function (subst, allSubst) {
        return allSubst({
          value: subst,
          arg: arg,
          key: key,
          locale: locale
        });
      }, substitution);
    } else if (arg && /^(?:NUMBER|DATE(?:TIME|RANGE|TIMERANGE)?|REGION|LANGUAGE|SCRIPT|CURRENCY|RELATIVE|LIST)(?:\||$)/.test(arg)) {
      substitution = defaultAllSubstitutions({
        value: substitution,
        arg: arg,
        key: key,
        locale: locale
      });
    }
    return substitution;
  };
  var recursiveLocalCount = 1;
  var checkLocalVars = function checkLocalVars(_ref5) {
    var substitution = _ref5.substitution,
      ky = _ref5.ky,
      arg = _ref5.arg,
      processSubsts = _ref5.processSubsts;
    if (typeof substitution === 'string' && substitution.includes('{')) {
      if (recursiveLocalCount++ > maximumLocalNestingDepth) {
        throw new TypeError('Too much recursion in local variables.');
      }
      if (localFormatter.constructor.isMatchingKey(ky)) {
        var extraSubsts = substitutions;
        var localFormatters;
        if (arg) {
          localFormatters = parseJSONExtra(arg);
          extraSubsts = _objectSpread2(_objectSpread2({}, substitutions), localFormatters);
        }
        substitution = processSubsts({
          str: substitution,
          substs: extraSubsts,
          formatter: localFormatter
        });
        if (localFormatters) {
          checkExtraSuppliedFormatters({
            substitutions: localFormatters
          });
        }
      } else if (switchFormatter.constructor.isMatchingKey(ky)) {
        substitution = processSubsts({
          str: substitution
        });
      }
    }
    return substitution;
  };

  // Give chance to avoid this block when known to contain DOM
  if (!dom) {
    // Run this block to optimize non-DOM substitutions
    var returnsDOM = false;
    var replace = function replace(_ref6) {
      var str = _ref6.str,
        _ref6$substs = _ref6.substs,
        substs = _ref6$substs === void 0 ? substitutions : _ref6$substs,
        _ref6$formatter = _ref6.formatter,
        formatter = _ref6$formatter === void 0 ? regularFormatter : _ref6$formatter;
      return str.replace(formattingRegex, function (_, esc, ky, pipe, arg) {
        if (esc.length % 2) {
          return _;
        }
        if (missingSuppliedFormatters({
          key: ky,
          formatter: formatter
        })) {
          return _;
        }
        var substitution = getSubstitution({
          key: ky,
          arg: arg,
          substs: substs
        });
        substitution = checkLocalVars({
          substitution: substitution,
          ky: ky,
          arg: arg,
          processSubsts: replace
        });
        returnsDOM = returnsDOM || substitution && _typeof$1(substitution) === 'object' && 'nodeType' in substitution;
        usedKeys.push(ky);
        return esc + substitution;
      });
    };
    var ret = replace({
      str: string
    });
    if (!returnsDOM) {
      checkExtraSuppliedFormatters({
        substitutions: substitutions
      });
      usedKeys.length = 0;
      addFunctionKeys();
      return unescapeBackslashes(ret);
    }
    usedKeys.length = 0;
    addFunctionKeys();
  }
  recursiveLocalCount = 1;
  var processSubstitutions = function processSubstitutions(_ref7) {
    var str = _ref7.str,
      _ref7$substs = _ref7.substs,
      substs = _ref7$substs === void 0 ? substitutions : _ref7$substs,
      _ref7$formatter = _ref7.formatter,
      formatter = _ref7$formatter === void 0 ? regularFormatter : _ref7$formatter;
    var nodes = [];

    // Copy to ensure we are resetting index on each instance (manually
    // resetting on `formattingRegex` is problematic with recursion that
    // uses the same regex copy)
    var regex = new RegExp(formattingRegex, 'gu');
    var push = function push() {
      nodes.push.apply(nodes, arguments);
    };
    processRegex(regex, str, {
      extra: push,
      onMatch: function onMatch(_, esc, ky, pipe, arg) {
        if (missingSuppliedFormatters({
          key: ky,
          formatter: formatter
        })) {
          push(_);
        } else {
          if (esc.length) {
            push(esc);
          }
          var substitution = getSubstitution({
            key: ky,
            arg: arg,
            substs: substs
          });
          substitution = checkLocalVars({
            substitution: substitution,
            ky: ky,
            arg: arg,
            processSubsts: processSubstitutions
          });
          if (Array.isArray(substitution)) {
            push.apply(void 0, _toConsumableArray$1(substitution));
          } else if (
          // Clone so that multiple instances may be added (and no
          // side effects to user code)
          substitution && _typeof$1(substitution) === 'object' && 'nodeType' in substitution) {
            push(substitution.cloneNode(true));
          } else {
            push(substitution);
          }
        }
        usedKeys.push(ky);
      }
    });
    return nodes;
  };
  var nodes = processSubstitutions({
    str: string
  });
  checkExtraSuppliedFormatters({
    substitutions: substitutions
  });
  usedKeys.length = 0;
  return nodes.map(function (node) {
    if (typeof node === 'string') {
      return unescapeBackslashes(node);
    }
    return node;
  });
};

/**
 * @callback KeyCheckerConverterCallback
 * @param {string|string[]} key By default may be an array (if the type ends
 *   with "Nested") or a string, but a non-default validator may do otherwise.
 * @param {"plain"|"plainNested"|"rich"|
 *   "richNested"|MessageStyleCallback} messageStyle
 * @throws {TypeError}
 * @returns {string} The converted (or unconverted) key
 */

/**
 * @type {KeyCheckerConverterCallback}
 */
function defaultKeyCheckerConverter(key, messageStyle) {
  if (Array.isArray(key) && key.every(function (k) {
    return typeof k === 'string';
  }) && typeof messageStyle === 'string' && messageStyle.endsWith('Nested')) {
    return key.map(function (k) {
      return k.replace( /*#__PURE__*/_wrapRegExp(/(\\+)/g, {
        backslashes: 1
      }), '\\$<backslashes>').replace(/\./g, '\\.');
    }).join('.');
  }
  if (typeof key !== 'string') {
    throw new TypeError('`key` is expected to be a string (or array of strings for nested style)');
  }
  return key;
}

/**
* @typedef {LocaleBody} LocalObject
*/

/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 * @typedef {PlainObject} LocaleHead
 * @property {LocalObject} locals
*/

/**
* @typedef {LocaleStringBodyObject|
* PlainLocaleStringBodyObject|PlainObject} LocaleBody
*/

/**
* @typedef {PlainObject} LocaleObject
* @property {LocaleHead} [head]
* @property {LocaleBody} body
*/

/**
* @typedef {PlainObject} MessageStyleCallbackResult
* @property {string} value Regardless of message style, will contain the
*   string result
* @property {LocaleStringSubObject} [info] Full info on the localized item
*   (for rich message styles only)
*/

/**
* @callback MessageStyleCallback
* @param {LocaleObject} obj The exact
*   format depends on the `cfg.defaults` of `i18n`
* @param {string} key
* @returns {false|MessageStyleCallbackResult} If `false`, will resort to default
*/

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @returns {MessageStyleCallback}
 */
var getMessageForKeyByStyle = function getMessageForKeyByStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$messageStyle = _ref.messageStyle,
    messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle;
  return typeof messageStyle === 'function' ? messageStyle : messageStyle === 'richNested' ? function (mainObj, key) {
    var obj = mainObj && _typeof$1(mainObj) === 'object' && mainObj.body;
    var keys = [];
    // eslint-disable-next-line prefer-named-capture-group
    var possiblyEscapedCharPattern = /(\\*)\./g;
    var mergeWithPreviousOrStart = function mergeWithPreviousOrStart(val) {
      if (!keys.length) {
        keys[0] = '';
      }
      keys[keys.length - 1] += val;
    };
    processRegex(possiblyEscapedCharPattern, key, {
      // If odd, this is just an escaped dot, so merge content with
      //   any previous
      extra: mergeWithPreviousOrStart,
      onMatch: function onMatch(_, esc) {
        // If even, there are no backslashes, or they are just escaped
        //  backslashes and not an escaped dot, so start anew, though
        //  first merge any backslashes
        mergeWithPreviousOrStart(esc);
        keys.push('');
      }
    });
    var keysUnescaped = keys.map(function (ky) {
      return unescapeBackslashes(ky);
    });
    var ret = false;
    var currObj = obj;
    keysUnescaped.some(function (ky, i, kys) {
      if (!currObj || _typeof$1(currObj) !== 'object') {
        return true;
      }
      if (
      // If specified key is too deep, we should fail
      i === kys.length - 1 && ky in currObj && currObj[ky] && _typeof$1(currObj[ky]) === 'object' && 'message' in currObj[ky] &&
      // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
      typeof currObj[ky].message === 'string') {
        ret = {
          value: currObj[ky].message,
          info: currObj[ky]
        };
      }
      currObj = currObj[ky];
      return false;
    });
    return ret;
  } : messageStyle === 'rich' ? function (mainObj, key) {
    var obj = mainObj && _typeof$1(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof$1(obj) === 'object' && key in obj && obj[key] && _typeof$1(obj[key]) === 'object' && 'message' in obj[key] &&
    // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
    typeof obj[key].message === 'string') {
      return {
        value: obj[key].message,
        info: obj[key]
      };
    }
    return false;
  } : messageStyle === 'plain' ? function (mainObj, key) {
    var obj = mainObj && _typeof$1(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof$1(obj) === 'object' && key in obj && obj[key] && typeof obj[key] === 'string') {
      return {
        value: obj[key]
      };
    }
    return false;
  } : messageStyle === 'plainNested' ? function (mainObj, key) {
    var obj = mainObj && _typeof$1(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof$1(obj) === 'object') {
      // Should really be counting that it is an odd number
      //  of backslashes only
      var keys = key.split(/(?<!\\)\./);
      var value = keys.reduce(function (o, k) {
        if (o && o[k]) {
          return o[k];
        }
        return null;
      }, obj);
      if (value && typeof value === 'string') {
        return {
          value: value
        };
      }
    }
    return false;
  } : function () {
    throw new TypeError("Unknown `messageStyle` ".concat(messageStyle));
  }();
};

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {string} [cfg.message] If present, this string will be the return value.
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings; used to find a default if no string `message` is provided.
 * @returns {string}
 */
var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    message = _ref.message,
    defaults = _ref.defaults,
    messageStyle = _ref.messageStyle,
    _ref$messageForKey = _ref.messageForKey,
    messageForKey = _ref$messageForKey === void 0 ? getMessageForKeyByStyle({
      messageStyle: messageStyle
    }) : _ref$messageForKey,
    key = _ref.key;
  // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
  var str;
  if (typeof message === 'string') {
    str = message;
  } else if (defaults === false || defaults === undefined || defaults === null) {
    str = false;
  } else if (defaults && _typeof$1(defaults) === 'object') {
    str = messageForKey(defaults, key);
    if (str) {
      str = str.value;
    }
  } else {
    throw new TypeError("Default locale strings must resolve to `false`, " + "nullish, or an object!");
  }
  if (str === false) {
    throw new Error("Key value not found for key: (".concat(key, ")"));
  }
  return str;
};

/* eslint-disable max-len */
/**
 *
 * @param {PlainObject} cfg
 * @param {string} cfg.string
 * @param {string} cfg.locale The (possibly already resolved) locale for use by
 *   configuring formatters
 * @param {LocalObject} [cfg.locals]
 * @param {LocalObject} [cfg.switches]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|SubstitutionObject} [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {string|DocumentFragment}
 */
var getDOMForLocaleString = function getDOMForLocaleString() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    string = _ref.string,
    locale = _ref.locale,
    locals = _ref.locals,
    switches = _ref.switches;
  _ref.maximumLocalNestingDepth;
  var _ref$allSubstitutions = _ref.allSubstitutions,
    allSubstitutions = _ref$allSubstitutions === void 0 ? [defaultAllSubstitutions] : _ref$allSubstitutions,
    _ref$insertNodes = _ref.insertNodes,
    insertNodes = _ref$insertNodes === void 0 ? defaultInsertNodes : _ref$insertNodes,
    _ref$substitutions = _ref.substitutions,
    substitutions = _ref$substitutions === void 0 ? false : _ref$substitutions,
    _ref$dom = _ref.dom,
    dom = _ref$dom === void 0 ? false : _ref$dom,
    _ref$forceNodeReturn = _ref.forceNodeReturn,
    forceNodeReturn = _ref$forceNodeReturn === void 0 ? false : _ref$forceNodeReturn,
    _ref$throwOnMissingSu = _ref.throwOnMissingSuppliedFormatters,
    throwOnMissingSuppliedFormatters = _ref$throwOnMissingSu === void 0 ? true : _ref$throwOnMissingSu,
    _ref$throwOnExtraSupp = _ref.throwOnExtraSuppliedFormatters,
    throwOnExtraSuppliedFormatters = _ref$throwOnExtraSupp === void 0 ? true : _ref$throwOnExtraSupp;
  if (typeof string !== 'string') {
    throw new TypeError('An options object with a `string` property set to a string must ' + 'be provided for `getDOMForLocaleString`.');
  }
  var stringOrTextNode = function stringOrTextNode(str) {
    var _doc = getDocument();
    return forceNodeReturn ? _doc.createTextNode(str) : str;
  };
  var usedKeys = [];

  /**
  * @callback CheckExtraSuppliedFormattersCallback
  * @param {SubstitutionObject} substs
  * @throws {Error} Upon an extra formatting key being found
  * @returns {void}
  */

  /**
   * @type {CheckExtraSuppliedFormattersCallback}
   */
  var checkExtraSuppliedFormatters = function checkExtraSuppliedFormatters(_ref2) {
    var substs = _ref2.substitutions;
    if (throwOnExtraSuppliedFormatters) {
      Object.keys(substs).forEach(function (key) {
        if (!usedKeys.includes(key)) {
          throw new Error("Extra formatting key: ".concat(key));
        }
      });
    }
  };

  /**
  * @callback MissingSuppliedFormattersCallback
  * @param {string} key
  * @param {SubstitutionObject} substs
  * @throws {Error} If missing formatting key
  * @returns {boolean}
  */
  /**
   * @type {MissingSuppliedFormattersCallback}
   */
  var missingSuppliedFormatters = function missingSuppliedFormatters(_ref3) {
    var key = _ref3.key,
      formatter = _ref3.formatter;
    var matching = formatter.isMatch(key);
    if (formatter.constructor.isMatchingKey(key) && !matching) {
      if (throwOnMissingSuppliedFormatters) {
        throw new Error("Missing formatting key: ".concat(key));
      }
      return true;
    }
    return false;
  };
  if (!substitutions && !allSubstitutions && !throwOnMissingSuppliedFormatters) {
    return stringOrTextNode(string);
  }
  if (!substitutions) {
    substitutions = {};
  }
  var nodes = insertNodes({
    string: string,
    dom: dom,
    usedKeys: usedKeys,
    substitutions: substitutions,
    allSubstitutions: allSubstitutions,
    locale: locale,
    locals: locals,
    switches: switches,
    missingSuppliedFormatters: missingSuppliedFormatters,
    checkExtraSuppliedFormatters: checkExtraSuppliedFormatters
  });
  if (typeof nodes === 'string') {
    return stringOrTextNode(nodes);
  }
  var _doc = getDocument();
  var container = _doc.createDocumentFragment();
  container.append.apply(container, _toConsumableArray$1(nodes));
  return container;
};
function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
} /**
   * Takes a locale and returns a new locale to check.
   * @callback LocaleMatcher
   * @param {string} locale The failed locale
   * @throws {Error} If there are no further hyphens left to check
   * @returns {string|Promise<string>} The new locale to check
  */

/**
 * @type {LocaleMatcher}
 */

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
var defaultLocaleMatcher = function defaultLocaleMatcher(locale) {
  if (!locale.includes('-')) {
    throw new Error('Locale not available');
  }
  // Try without hyphen, i.e., the "lookup" algorithm:
  // See https://tools.ietf.org/html/rfc4647#section-3.4 and
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
  return locale.replace(/\x2D(?:(?!\x2D)[\s\S])*$/, '');
};

/**
* @typedef {PlainObject} LocaleObjectInfo
* @property {LocaleObject} strings The successfully retrieved locale strings
* @property {string} locale The successfully resolved locale
*/

/**
 * @callback LocaleStringFinder
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {string} [cfg.localesBasePath="."]
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher]
 * @returns {Promise<LocaleObjectInfo>}
 */

/**
 *
 * @type {LocaleStringFinder}
 */
var findLocaleStrings = function findLocaleStrings() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    locales = _ref2.locales,
    defaultLocales = _ref2.defaultLocales,
    localeResolver = _ref2.localeResolver,
    localesBasePath = _ref2.localesBasePath,
    localeMatcher = _ref2.localeMatcher;
  return _findLocale({
    locales: locales,
    defaultLocales: defaultLocales,
    localeResolver: localeResolver,
    localesBasePath: localesBasePath,
    localeMatcher: localeMatcher
  });
};

/**
 * @type {LocaleStringFinder|LocaleFinder} Also has a `headOnly` boolean
 *  property to determine whether to make a simple HEAD and resolve to
 *  the locale rather than locale and contents
 */
var _findLocale = _async(function (_ref4) {
  /**
   * @callback getLocale
   * @throws {SyntaxError|TypeError|Error}
   * @param {string} locale
   * @returns {Promise<LocaleObjectInfo>}
   */
  var getLocale = _async(function (locale) {
    if (typeof locale !== 'string') {
      throw new TypeError('Non-string locale type');
    }
    var url = localeResolver(localesBasePath, locale);
    if (typeof url !== 'string') {
      throw new TypeError('`localeResolver` expected to resolve to (URL) string.');
    }
    return _catch(function () {
      var _fetch = getFetch();
      return _await$1(headOnly ? _fetch(url, {
        method: 'HEAD'
      }) : _fetch(url), function (resp) {
        if (resp.status === 404) {
          // Don't allow browser (tested in Firefox) to continue
          //  and give `SyntaxError` with missing file or we won't be
          //  able to try without the hyphen
          throw new Error('Trying again');
        }
        return headOnly ? locale : _await$1(resp.json(), function (strings) {
          return {
            locale: locale,
            strings: strings
          };
        });
      });
    }, function (err) {
      if (err.name === 'SyntaxError') {
        throw err;
      }
      return _await$1(localeMatcher(locale), getLocale);
    });
  });
  var _ref4$locales = _ref4.locales,
    locales = _ref4$locales === void 0 ? typeof intlDomLocale !== 'undefined' ? [intlDomLocale] : typeof navigator === 'undefined' ? [] : navigator.languages : _ref4$locales,
    _ref4$defaultLocales = _ref4.defaultLocales,
    defaultLocales = _ref4$defaultLocales === void 0 ? ['en-US'] : _ref4$defaultLocales,
    _ref4$localeResolver = _ref4.localeResolver,
    localeResolver = _ref4$localeResolver === void 0 ? defaultLocaleResolver : _ref4$localeResolver,
    _ref4$localesBasePath = _ref4.localesBasePath,
    localesBasePath = _ref4$localesBasePath === void 0 ? '.' : _ref4$localesBasePath,
    _ref4$localeMatcher = _ref4.localeMatcher,
    localeMatcher = _ref4$localeMatcher === void 0 ? 'lookup' : _ref4$localeMatcher,
    _ref4$headOnly = _ref4.headOnly,
    headOnly = _ref4$headOnly === void 0 ? false : _ref4$headOnly;
  if (localeMatcher === 'lookup') {
    localeMatcher = defaultLocaleMatcher;
  } else if (typeof localeMatcher !== 'function') {
    throw new TypeError('`localeMatcher` must be "lookup" or a function!');
  }
  return promiseChainForValues([].concat(_toConsumableArray$1(locales), _toConsumableArray$1(defaultLocales)), getLocale, 'No matching locale found for ' + [].concat(_toConsumableArray$1(locales), _toConsumableArray$1(defaultLocales)).join(', '));
});

/**
 * Checks a key (against an object of strings). Optionally
 *  accepts an object of substitutions which are used when finding text
 *  within curly brackets (pipe symbol not allowed in its keys); the
 *  substitutions may be DOM elements as well as strings and may be
 *  functions which return the same (being provided the text after the
 *  pipe within brackets as the single argument).) Optionally accepts a
 *  config object, with the optional key "dom" which if set to `true`
 *  optimizes when DOM elements are (known to be) present.
 * @callback I18NCallback
 * @param {string} key Key to check against object of strings
 * @param {false|SubstitutionObject} [substitutions=false]
 * @param {PlainObject} [cfg={}]
 * @param {boolean} [cfg.dom=false]
 * @returns {string|DocumentFragment}
*/

/* eslint-disable max-len */
/**
 * @param {PlainObject} cfg
 * @param {LocaleObject} cfg.strings
 * @param {string} cfg.resolvedLocale
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?AllSubstitutionCallback|AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {false|SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}

/* eslint-disable max-len */
/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {LocaleStringFinder} [cfg.localeStringFinder=findLocaleStrings]
 * @param {string} [cfg.localesBasePath="."]
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher="lookup"]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?AllSubstitutionCallback|AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {false|SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */

function _invoke(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
var i18nServer = function i18nServer(_ref) {
  var strings = _ref.strings,
    resolvedLocale = _ref.resolvedLocale,
    _ref$messageStyle = _ref.messageStyle,
    messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle,
    defaultAllSubstitutionsValue = _ref.allSubstitutions,
    insertNodes = _ref.insertNodes,
    _ref$keyCheckerConver = _ref.keyCheckerConverter,
    keyCheckerConverter = _ref$keyCheckerConver === void 0 ? defaultKeyCheckerConverter : _ref$keyCheckerConver,
    defaultDefaults = _ref.defaults,
    defaultSubstitutions = _ref.substitutions,
    maximumLocalNestingDepth = _ref.maximumLocalNestingDepth,
    _ref$dom = _ref.dom,
    domDefaults = _ref$dom === void 0 ? false : _ref$dom,
    _ref$forceNodeReturn = _ref.forceNodeReturn,
    forceNodeReturnDefault = _ref$forceNodeReturn === void 0 ? false : _ref$forceNodeReturn,
    _ref$throwOnMissingSu = _ref.throwOnMissingSuppliedFormatters,
    throwOnMissingSuppliedFormattersDefault = _ref$throwOnMissingSu === void 0 ? true : _ref$throwOnMissingSu,
    _ref$throwOnExtraSupp = _ref.throwOnExtraSuppliedFormatters,
    throwOnExtraSuppliedFormattersDefault = _ref$throwOnExtraSupp === void 0 ? true : _ref$throwOnExtraSupp;
  if (!strings || _typeof$1(strings) !== 'object') {
    throw new TypeError("Locale strings must be an object!");
  }
  var messageForKey = getMessageForKeyByStyle({
    messageStyle: messageStyle
  });
  var formatter = function formatter(key, substitutions) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$allSubstitution = _ref2.allSubstitutions,
      allSubstitutions = _ref2$allSubstitution === void 0 ? defaultAllSubstitutionsValue : _ref2$allSubstitution,
      _ref2$defaults = _ref2.defaults,
      defaults = _ref2$defaults === void 0 ? defaultDefaults : _ref2$defaults,
      _ref2$dom = _ref2.dom,
      dom = _ref2$dom === void 0 ? domDefaults : _ref2$dom,
      _ref2$forceNodeReturn = _ref2.forceNodeReturn,
      forceNodeReturn = _ref2$forceNodeReturn === void 0 ? forceNodeReturnDefault : _ref2$forceNodeReturn,
      _ref2$throwOnMissingS = _ref2.throwOnMissingSuppliedFormatters,
      throwOnMissingSuppliedFormatters = _ref2$throwOnMissingS === void 0 ? throwOnMissingSuppliedFormattersDefault : _ref2$throwOnMissingS,
      _ref2$throwOnExtraSup = _ref2.throwOnExtraSuppliedFormatters,
      throwOnExtraSuppliedFormatters = _ref2$throwOnExtraSup === void 0 ? throwOnExtraSuppliedFormattersDefault : _ref2$throwOnExtraSup;
    key = keyCheckerConverter(key, messageStyle);
    var message = messageForKey(strings, key);
    var string = getStringFromMessageAndDefaults({
      message: message && typeof message.value === 'string' ? message.value : false,
      defaults: defaults,
      messageForKey: messageForKey,
      key: key
    });
    return getDOMForLocaleString({
      string: string,
      locals: strings.head && strings.head.locals,
      switches: strings.head && strings.head.switches,
      locale: resolvedLocale,
      maximumLocalNestingDepth: maximumLocalNestingDepth,
      allSubstitutions: allSubstitutions,
      insertNodes: insertNodes,
      substitutions: _objectSpread2(_objectSpread2({}, defaultSubstitutions), substitutions),
      dom: dom,
      forceNodeReturn: forceNodeReturn,
      throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
      throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters
    });
  };
  formatter.resolvedLocale = resolvedLocale;
  formatter.strings = strings;
  formatter.sort = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return sort.apply(void 0, [resolvedLocale].concat(args));
  };
  formatter.sortList = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return sortList.apply(void 0, [resolvedLocale].concat(args));
  };
  formatter.list = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return list.apply(void 0, [resolvedLocale].concat(args));
  };
  return formatter;
};
var i18n = function i18n() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    locales = _ref3.locales,
    defaultLocales = _ref3.defaultLocales,
    _ref3$localeStringFin = _ref3.localeStringFinder,
    localeStringFinder = _ref3$localeStringFin === void 0 ? findLocaleStrings : _ref3$localeStringFin,
    localesBasePath = _ref3.localesBasePath,
    localeResolver = _ref3.localeResolver,
    localeMatcher = _ref3.localeMatcher,
    messageStyle = _ref3.messageStyle,
    allSubstitutions = _ref3.allSubstitutions,
    insertNodes = _ref3.insertNodes,
    keyCheckerConverter = _ref3.keyCheckerConverter,
    defaults = _ref3.defaults,
    substitutions = _ref3.substitutions,
    maximumLocalNestingDepth = _ref3.maximumLocalNestingDepth,
    dom = _ref3.dom,
    forceNodeReturn = _ref3.forceNodeReturn,
    throwOnMissingSuppliedFormatters = _ref3.throwOnMissingSuppliedFormatters,
    throwOnExtraSuppliedFormatters = _ref3.throwOnExtraSuppliedFormatters;
  try {
    return _await(localeStringFinder({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher
    }), function (_ref4) {
      var strings = _ref4.strings,
        resolvedLocale = _ref4.locale;
      return _invoke(function () {
        if (!defaults && defaultLocales) {
          var defaultLocale;
          return _await(localeStringFinder({
            locales: defaultLocales,
            defaultLocales: [],
            localeResolver: localeResolver,
            localesBasePath: localesBasePath,
            localeMatcher: localeMatcher
          }), function (_localeStringFinder) {
            defaults = _localeStringFinder.strings;
            defaultLocale = _localeStringFinder.locale;
            if (defaultLocale === resolvedLocale) {
              defaults = null; // No need to fall back
            }
          });
        }
      }, function () {
        return i18nServer({
          strings: strings,
          resolvedLocale: resolvedLocale,
          messageStyle: messageStyle,
          allSubstitutions: allSubstitutions,
          insertNodes: insertNodes,
          keyCheckerConverter: keyCheckerConverter,
          defaults: defaults,
          substitutions: substitutions,
          maximumLocalNestingDepth: maximumLocalNestingDepth,
          dom: dom,
          forceNodeReturn: forceNodeReturn,
          throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
          throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

function loadStylesheets(stylesheets, {
  before: beforeDefault,
  after: afterDefault,
  favicon: faviconDefault,
  canvas: canvasDefault,
  image: imageDefault = true,
  acceptErrors
} = {}) {
  stylesheets = Array.isArray(stylesheets) ? stylesheets : [stylesheets];
  function setupLink(stylesheetURL) {
    let options = {};
    if (Array.isArray(stylesheetURL)) {
      [stylesheetURL, options = {}] = stylesheetURL;
    }
    let {
      favicon = faviconDefault
    } = options;
    const {
      before = beforeDefault,
      after = afterDefault,
      canvas = canvasDefault,
      image = imageDefault
    } = options;
    function addLink() {
      if (before) {
        before.before(link);
      } else if (after) {
        after.after(link);
      } else {
        document.head.appendChild(link);
      }
    }
    const link = document.createElement('link');

    // eslint-disable-next-line promise/avoid-new -- No native option
    return new Promise((resolve, reject) => {
      let rej = reject;
      if (acceptErrors) {
        rej = typeof acceptErrors === 'function' ? error => {
          acceptErrors({
            error,
            stylesheetURL,
            options,
            resolve,
            reject
          });
        } : resolve;
      }
      if (stylesheetURL.endsWith('.css')) {
        favicon = false;
      } else if (stylesheetURL.endsWith('.ico')) {
        favicon = true;
      }
      if (favicon) {
        link.rel = 'shortcut icon';
        link.type = 'image/x-icon';
        if (image === false) {
          link.href = stylesheetURL;
          addLink();
          resolve(link);
          return;
        }
        const cnv = document.createElement('canvas');
        cnv.width = 16;
        cnv.height = 16;
        const context = cnv.getContext('2d');
        const img = document.createElement('img');
        // eslint-disable-next-line promise/prefer-await-to-callbacks -- No API
        img.addEventListener('error', error => {
          reject(error);
        });
        img.addEventListener('load', () => {
          context.drawImage(img, 0, 0);
          link.href = canvas ? cnv.toDataURL('image/x-icon') : stylesheetURL;
          addLink();
          resolve(link);
        });
        img.src = stylesheetURL;
        return;
      }
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = stylesheetURL;
      addLink();
      // eslint-disable-next-line promise/prefer-await-to-callbacks -- No API
      link.addEventListener('error', error => {
        rej(error);
      });
      link.addEventListener('load', () => {
        resolve(link);
      });
    });
  }
  return Promise.all(stylesheets.map(stylesheetURL => setupLink(stylesheetURL)));
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 *
 * Get successful control from form and assemble into object.
 * @see {@link http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2}
 * @module FormSerialization
 */
// types which indicate a submit action and are not successful controls
// these will be ignored
var kRSubmitter = /^(?:submit|button|image|reset|file)$/i; // node names which could be successful controls

var kRSuccessContrls = /^(?:input|select|textarea|keygen)/i; // Matches bracket notation.

var brackets = /(\[[^[\]]*])/g;
/**
 * @callback module:FormSerialization.Serializer
 * @param {PlainObject|string|any} result
 * @param {string} key
 * @param {string} value
 * @returns {PlainObject|string|any} New result
*/

/**
 * @typedef {PlainObject} module:FormSerialization.Options
 * @property {boolean} [hash] Configure the output type. If true, the
 *  output will be a JavaScript object.
 * @property {module:FormSerialization.Serializer} [serializer] Optional
 *   serializer function to override the default one. Otherwise, hash
 *   and URL-encoded string serializers are provided with this module,
 *   depending on the setting of `hash`.
 * @property {boolean} [disabled] If true serialize disabled fields.
 * @property {boolean} [empty] If true serialize empty fields
*/

/**
 * Serializes form fields.
 * @function module:FormSerialization.serialize
 * @param {HTMLFormElement} form MUST be an `HTMLFormElement`
 * @param {module:FormSerialization.Options} options is an optional argument
 *   to configure the serialization.
 * @returns {any|string|PlainObject} Default output with no options specified is
 *   a url encoded string
 */

function serialize(form, options) {
  if (_typeof(options) !== 'object') {
    options = {
      hash: Boolean(options)
    };
  } else if (options.hash === undefined) {
    options.hash = true;
  }
  var result = options.hash ? {} : '';
  var serializer = options.serializer || (options.hash ? hashSerializer : strSerialize);
  var elements = form && form.elements ? _toConsumableArray(form.elements) : []; // Object store each radio and set if it's empty or not

  var radioStore = Object.create(null);
  elements.forEach(function (element) {
    // ignore disabled fields
    if (!options.disabled && element.disabled || !element.name) {
      return;
    } // ignore anything that is not considered a success field

    if (!kRSuccessContrls.test(element.nodeName) || kRSubmitter.test(element.type)) {
      return;
    }
    var key = element.name,
      type = element.type,
      name = element.name,
      checked = element.checked;
    var value = element.value; // We can't just use element.value for checkboxes cause some
    //   browsers lie to us; they say "on" for value when the
    //   box isn't checked

    if ((type === 'checkbox' || type === 'radio') && !checked) {
      value = undefined;
    } // If we want empty elements

    if (options.empty) {
      // for checkbox
      if (type === 'checkbox' && !checked) {
        value = '';
      } // for radio

      if (type === 'radio') {
        if (!radioStore[name] && !checked) {
          radioStore[name] = false;
        } else if (checked) {
          radioStore[name] = true;
        }
        if (value === undefined) {
          return;
        }
      }
    } else if (!value) {
      // value-less fields are ignored unless options.empty is true
      return;
    } // multi select boxes

    if (type === 'select-multiple') {
      var isSelectedOptions = false;
      _toConsumableArray(element.options).forEach(function (option) {
        var allowedEmpty = options.empty && !option.value;
        var hasValue = option.value || allowedEmpty;
        if (option.selected && hasValue) {
          isSelectedOptions = true; // If using a hash serializer be sure to add the
          // correct notation for an array in the multi-select
          // context. Here the name attribute on the select element
          // might be missing the trailing bracket pair. Both names
          // "foo" and "foo[]" should be arrays.

          if (options.hash && key.slice(-2) !== '[]') {
            result = serializer(result, key + '[]', option.value);
          } else {
            result = serializer(result, key, option.value);
          }
        }
      }); // Serialize if no selected options and options.empty is true

      if (!isSelectedOptions && options.empty) {
        result = serializer(result, key, '');
      }
      return;
    }
    result = serializer(result, key, value);
  }); // Check for all empty radio buttons and serialize them with key=""

  if (options.empty) {
    Object.entries(radioStore).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      if (!value) {
        result = serializer(result, key, '');
      }
    });
  }
  return result;
}
/**
 *
 * @param {string} string
 * @returns {string[]}
 */

function parseKeys(string) {
  var keys = [];
  var prefix = /^([^[\]]*)/;
  var children = new RegExp(brackets);
  var match = prefix.exec(string);
  if (match[1]) {
    keys.push(match[1]);
  }
  while ((match = children.exec(string)) !== null) {
    keys.push(match[1]);
  }
  return keys;
}
/**
* @typedef {GenericArray} ResultArray
*/

/**
 *
 * @param {PlainObject|ResultArray} result
 * @param {string[]} keys
 * @param {string} value
 * @returns {string|PlainObject|ResultArray}
 */

function hashAssign(result, keys, value) {
  if (keys.length === 0) {
    return value;
  }
  var key = keys.shift();
  var between = key.match(/^\[(.+?)]$/);
  if (key === '[]') {
    result = result || [];
    if (Array.isArray(result)) {
      result.push(hashAssign(null, keys, value));
    } else {
      // This might be the result of bad name attributes like "[][foo]",
      // in this case the original `result` object will already be
      // assigned to an object literal. Rather than coerce the object to
      // an array, or cause an exception the attribute "_values" is
      // assigned as an array.
      result._values = result._values || [];
      result._values.push(hashAssign(null, keys, value));
    }
    return result;
  } // Key is an attribute name and can be assigned directly.

  if (!between) {
    result[key] = hashAssign(result[key], keys, value);
  } else {
    var string = between[1]; // +var converts the variable into a number
    // better than parseInt because it doesn't truncate away trailing
    // letters and actually fails if whole thing is not a number

    var index = Number(string); // If the characters between the brackets is not a number it is an
    // attribute name and can be assigned directly.
    // Switching to Number.isNaN would require a polyfill for IE11
    // eslint-disable-next-line unicorn/prefer-number-properties

    if (isNaN(index)) {
      result = result || {};
      result[string] = hashAssign(result[string], keys, value);
    } else {
      result = result || [];
      result[index] = hashAssign(result[index], keys, value);
    }
  }
  return result;
}
/**
 * Object/hash encoding serializer.
 * @param {PlainObject} result
 * @param {string} key
 * @param {string} value
 * @returns {PlainObject}
 */

function hashSerializer(result, key, value) {
  var hasBrackets = key.match(brackets); // Has brackets? Use the recursive assignment function to walk the keys,
  // construct any missing objects in the result tree and make the assignment
  // at the end of the chain.

  if (hasBrackets) {
    var keys = parseKeys(key);
    hashAssign(result, keys, value);
  } else {
    // Non bracket notation can make assignments directly.
    var existing = result[key]; // If the value has been assigned already (for instance when a radio and
    // a checkbox have the same name attribute) convert the previous value
    // into an array before pushing into it.
    //
    // NOTE: If this requirement were removed all hash creation and
    // assignment could go through `hashAssign`.

    if (existing) {
      if (!Array.isArray(existing)) {
        result[key] = [existing];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
/**
 * URL form encoding serializer.
 * @param {string} result
 * @param {string} key
 * @param {string} value
 * @returns {string} New result
 */

function strSerialize(result, key, value) {
  // encode newlines as \r\n cause the html spec says so
  value = value.replace(/(\r)?\n/g, '\r\n');
  value = encodeURIComponent(value); // spaces should be '+' rather than '%20'.

  value = value.replace(/%20/g, '+');
  return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}
/**
 * @function module:FormSerialization.deserialize
 * @param {HTMLFormElement} form
 * @param {PlainObject} hash
 * @returns {void}
 */

function deserialize(form, hash) {
  // input(text|radio|checkbox)|select(multiple)|textarea|keygen
  Object.entries(hash).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      name = _ref4[0],
      value = _ref4[1];
    var control = form[name];
    var hasBrackets = false; // istanbul ignore else

    if (!control) {
      // Try again for jsdom
      control = form.querySelector("[name=\"".concat(name, "\"]"));
      if (!control) {
        // We want this for `RadioNodeList` so setting value
        //  auto-disables other boxes
        control = form[name + '[]']; // istanbul ignore next

        if (!control || _typeof(control) !== 'object' || !('length' in control)) {
          // The latter query would only get a single
          //  element, so if not a `RadioNodeList`, we get
          //  all values here
          control = form.querySelectorAll("[name=\"".concat(name, "[]\"]"));
          if (!control.length) {
            throw new Error("Name not found ".concat(name));
          }
        }
        hasBrackets = true;
      }
    }
    var _control = control,
      type = _control.type;
    if (type === 'checkbox') {
      control.checked = value !== '';
    }
    if (type === 'radio' || control[0] && control[0].type === 'radio') {
      _toConsumableArray(form.querySelectorAll("[name=\"".concat(name + (hasBrackets ? '[]' : ''), "\"]"))).forEach(function (radio) {
        radio.checked = value === radio.value;
      });
    }
    if (control[0] && control[0].type === 'select-multiple') {
      _toConsumableArray(control[0].options).forEach(function (o) {
        if (value.includes(o.value)) {
          o.selected = true;
        }
      });
      return;
    }
    if (Array.isArray(value)) {
      // options on a multiple select
      if (type === 'select-multiple') {
        _toConsumableArray(control.options).forEach(function (o) {
          if (value.includes(o.value)) {
            o.selected = true;
          }
        });
        return;
      }
      value.forEach(function (v, i) {
        var c = control[i];
        if (c.type === 'checkbox') {
          var isMatch = c.value === v || v === 'on';
          c.checked = isMatch;
          return;
        }
        if (c.type === 'select-multiple') {
          _toConsumableArray(c.options).forEach(function (o) {
            if (v.includes(o.value)) {
              o.selected = true;
            }
          });
          return;
        }
        c.value = v;
      });
    } else {
      control.value = value;
    }
  });
}

async function getLocaleFallbackResults({
  $p,
  lang,
  langs,
  langData,
  fallbackLanguages,
  basePath = ''
}) {
  const l = await i18n({
    messageStyle: 'plainNested',
    locales: lang,
    defaultLocales: fallbackLanguages,
    localeResolver(localesBasePath, code) {
      // Todo: For editing of locales, we might instead resolve all
      //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
      //    replace `loadLocales` behavior with our own now resolved
      //    locales; see https://github.com/jdorn/json-editor/issues/132
      return basePath + langData.localeFileBasePath + langs.find(l => l.code === code).locale.$ref;
    }
  });
  if (!$p.l10n) {
    $p.l10n = l;
  }
  return l;
}

/*
Possible todos:
0. Add XSLT to JML-string stylesheet (or even vice versa)
0. IE problem: Add JsonML code to handle name attribute (during element creation)
0. Element-specific: IE object-param handling

Todos inspired by JsonML: https://github.com/mckamey/jsonml/blob/master/jsonml-html.js

0. duplicate attributes?
0. expand ATTR_MAP
0. equivalent of markup, to allow strings to be embedded within an object (e.g., {$value: '<div>id</div>'}); advantage over innerHTML in that it wouldn't need to work as the entire contents (nor destroy any existing content or handlers)
0. More validation?
0. JsonML DOM Level 0 listener
0. Whitespace trimming?

JsonML element-specific:
0. table appending
0. canHaveChildren necessary? (attempts to append to script and img)

Other Todos:
0. Note to self: Integrate research from other jml notes
0. Allow Jamilih to be seeded with an existing element, so as to be able to add/modify attributes and children
0. Allow array as single first argument
0. Settle on whether need to use null as last argument to return array (or fragment) or other way to allow appending? Options object at end instead to indicate whether returning array, fragment, first element, etc.?
0. Allow building of generic XML (pass configuration object)
0. Allow building content internally as a string (though allowing DOM methods, etc.?)
0. Support JsonML empty string element name to represent fragments?
0. Redo browser testing of jml (including ensuring IE7 can work even if test framework can't work)
*/
// istanbul ignore next
let win = typeof window !== 'undefined' && window; // istanbul ignore next

let doc = typeof document !== 'undefined' && document || win && win.document; // STATIC PROPERTIES

const possibleOptions = ['$plugins',
// '$mode', // Todo (SVG/XML)
// '$state', // Used internally
'$map' // Add any other options here
];

const NS_HTML = 'http://www.w3.org/1999/xhtml',
  hyphenForCamelCase = /-([a-z])/gu;
const ATTR_MAP = {
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly'
}; // We define separately from ATTR_DOM for clarity (and parity with JsonML) but no current need
// We don't set attribute esp. for boolean atts as we want to allow setting of `undefined`
//   (e.g., from an empty variable) on templates to have no effect

const BOOL_ATTS = ['checked', 'defaultChecked', 'defaultSelected', 'disabled', 'indeterminate', 'open',
// Dialog elements
'readOnly', 'selected']; // From JsonML

const ATTR_DOM = BOOL_ATTS.concat(['accessKey',
// HTMLElement
'async', 'autocapitalize',
// HTMLElement
'autofocus', 'contentEditable',
// HTMLElement through ElementContentEditable
'defaultValue', 'defer', 'draggable',
// HTMLElement
'formnovalidate', 'hidden',
// HTMLElement
'innerText',
// HTMLElement
'inputMode',
// HTMLElement through ElementContentEditable
'ismap', 'multiple', 'novalidate', 'pattern', 'required', 'spellcheck',
// HTMLElement
'translate',
// HTMLElement
'value', 'willvalidate']); // Todo: Add more to this as useful for templating
//   to avoid setting through nullish value

const NULLABLES = ['autocomplete', 'dir',
// HTMLElement
'integrity',
// script, link
'lang',
// HTMLElement
'max', 'min', 'minLength', 'maxLength', 'title' // HTMLElement
];

const $$1 = sel => doc.querySelector(sel);
const $$ = sel => [...doc.querySelectorAll(sel)];
/**
* Retrieve the (lower-cased) HTML name of a node.
* @static
* @param {Node} node The HTML node
* @returns {string} The lower-cased node name
*/

function _getHTMLNodeName(node) {
  return node.nodeName && node.nodeName.toLowerCase();
}
/**
* Apply styles if this is a style tag.
* @static
* @param {Node} node The element to check whether it is a style tag
* @returns {void}
*/

function _applyAnyStylesheet(node) {
  // Only used in IE
  // istanbul ignore else
  if (!doc.createStyleSheet) {
    return;
  } // istanbul ignore next

  if (_getHTMLNodeName(node) === 'style') {
    // IE
    const ss = doc.createStyleSheet(); // Create a stylesheet to actually do something useful

    ss.cssText = node.cssText; // We continue to add the style tag, however
  }
}
/**
 * Need this function for IE since options weren't otherwise getting added.
 * @private
 * @static
 * @param {Element} parent The parent to which to append the element
 * @param {Node} child The element or other node to append to the parent
 * @throws {Error} Rethrow if problem with `append` and unhandled
 * @returns {void}
 */

function _appendNode(parent, child) {
  const parentName = _getHTMLNodeName(parent); // IE only
  // istanbul ignore if

  if (doc.createStyleSheet) {
    if (parentName === 'script') {
      parent.text = child.nodeValue;
      return;
    }
    if (parentName === 'style') {
      parent.cssText = child.nodeValue; // This will not apply it--just make it available within the DOM cotents

      return;
    }
  }
  if (parentName === 'template') {
    parent.content.append(child);
    return;
  }
  try {
    parent.append(child); // IE9 is now ok with this
  } catch (e) {
    // istanbul ignore next
    const childName = _getHTMLNodeName(child); // istanbul ignore next

    if (parentName === 'select' && childName === 'option') {
      try {
        // Since this is now DOM Level 4 standard behavior (and what IE7+ can handle), we try it first
        parent.add(child);
      } catch (err) {
        // DOM Level 2 did require a second argument, so we try it too just in case the user is using an older version of Firefox, etc.
        parent.add(child, null); // IE7 has a problem with this, but IE8+ is ok
      }

      return;
    } // istanbul ignore next

    throw e;
  }
}
/**
 * Attach event in a cross-browser fashion.
 * @static
 * @param {Element} el DOM element to which to attach the event
 * @param {string} type The DOM event (without 'on') to attach to the element
 * @param {EventListener} handler The event handler to attach to the element
 * @param {boolean} [capturing] Whether or not the event should be
 *   capturing (W3C-browsers only); default is false; NOT IN USE
 * @returns {void}
 */

function _addEvent(el, type, handler, capturing) {
  el.addEventListener(type, handler, Boolean(capturing));
}
/**
* Creates a text node of the result of resolving an entity or character reference.
* @param {'entity'|'decimal'|'hexadecimal'} type Type of reference
* @param {string} prefix Text to prefix immediately after the "&"
* @param {string} arg The body of the reference
* @throws {TypeError}
* @returns {Text} The text node of the resolved reference
*/

function _createSafeReference(type, prefix, arg) {
  // For security reasons related to innerHTML, we ensure this string only
  //  contains potential entity characters
  if (!/^\w+$/u.test(arg)) {
    throw new TypeError(`Bad ${type} reference; with prefix "${prefix}" and arg "${arg}"`);
  }
  const elContainer = doc.createElement('div'); // Todo: No workaround for XML?
  // eslint-disable-next-line no-unsanitized/property

  elContainer.innerHTML = '&' + prefix + arg + ';';
  return doc.createTextNode(elContainer.innerHTML);
}
/**
* @param {string} n0 Whole expression match (including "-")
* @param {string} n1 Lower-case letter match
* @returns {string} Uppercased letter
*/

function _upperCase(n0, n1) {
  return n1.toUpperCase();
} // Todo: Make as public utility

/**
 * @param {any} o
 * @returns {boolean}
 */

function _isNullish(o) {
  return o === null || o === undefined;
} // Todo: Make as public utility, but also return types for undefined, boolean, number, document, etc.

/**
* @private
* @static
* @param {string|JamilihAttributes|JamilihArray|Element|DocumentFragment} item
* @returns {"string"|"null"|"array"|"element"|"fragment"|"object"|"symbol"|"function"|"number"|"boolean"}
*/

function _getType(item) {
  const type = typeof item;
  switch (type) {
    case 'object':
      if (item === null) {
        return 'null';
      }
      if (Array.isArray(item)) {
        return 'array';
      }
      if ('nodeType' in item) {
        switch (item.nodeType) {
          case 1:
            return 'element';
          case 9:
            return 'document';
          case 11:
            return 'fragment';
          default:
            return 'non-container node';
        }
      }

    // Fallthrough

    default:
      return type;
  }
}
/**
* @private
* @static
* @param {DocumentFragment} frag
* @param {Node} node
* @returns {DocumentFragment}
*/

function _fragReducer(frag, node) {
  frag.append(node);
  return frag;
}
/**
* @private
* @static
* @param {Object<{string:string}>} xmlnsObj
* @returns {string}
*/

function _replaceDefiner(xmlnsObj) {
  return function (n0) {
    let retStr = xmlnsObj[''] ? ' xmlns="' + xmlnsObj[''] + '"' : n0; // Preserve XHTML

    for (const [ns, xmlnsVal] of Object.entries(xmlnsObj)) {
      if (ns !== '') {
        retStr += ' xmlns:' + ns + '="' + xmlnsVal + '"';
      }
    }
    return retStr;
  };
}
/**
* @typedef {JamilihAttributes} AttributeArray
* @property {string} 0 The key
* @property {string} 1 The value
*/

/**
* @callback ChildrenToJMLCallback
* @param {JamilihArray|Jamilih} childNodeJML
* @param {Integer} i
* @returns {void}
*/

/**
* @private
* @static
* @param {Node} node
* @returns {ChildrenToJMLCallback}
*/

function _childrenToJML(node) {
  return function (childNodeJML, i) {
    const cn = node.childNodes[i];
    const j = Array.isArray(childNodeJML) ? jml(...childNodeJML) : jml(childNodeJML);
    cn.replaceWith(j);
  };
}
/**
* @callback JamilihAppender
* @param {JamilihArray} childJML
* @returns {void}
*/

/**
* @private
* @static
* @param {Node} node
* @returns {JamilihAppender}
*/

function _appendJML(node) {
  return function (childJML) {
    if (Array.isArray(childJML)) {
      node.append(jml(...childJML));
    } else {
      node.append(jml(childJML));
    }
  };
}
/**
* @callback appender
* @param {string|JamilihArray} childJML
* @returns {void}
*/

/**
* @private
* @static
* @param {Node} node
* @returns {appender}
*/

function _appendJMLOrText(node) {
  return function (childJML) {
    if (typeof childJML === 'string') {
      node.append(childJML);
    } else if (Array.isArray(childJML)) {
      node.append(jml(...childJML));
    } else {
      node.append(jml(childJML));
    }
  };
}
/**
* @private
* @static
*/

/*
function _DOMfromJMLOrString (childNodeJML) {
  if (typeof childNodeJML === 'string') {
    return doc.createTextNode(childNodeJML);
  }
  return jml(...childNodeJML);
}
*/

/**
* @typedef {Element|DocumentFragment} JamilihReturn
*/

/**
* @typedef {PlainObject<string, string>} JamilihAttributes
*/

/**
* @typedef {GenericArray} JamilihArray
* @property {string} 0 The element to create (by lower-case name)
* @property {JamilihAttributes} [1] Attributes to add with the key as the
*   attribute name and value as the attribute value; important for IE where
*   the input element's type cannot be added later after already added to the page
* @param {Element[]} [children] The optional children of this element
*   (but raw DOM elements required to be specified within arrays since
*   could not otherwise be distinguished from siblings being added)
* @param {Element} [parent] The optional parent to which to attach the element
*   (always the last unless followed by null, in which case it is the
*   second-to-last)
* @param {null} [returning] Can use null to indicate an array of elements
*   should be returned
*/

/**
* @typedef {PlainObject} JamilihOptions
* @property {"root"|"attributeValue"|"fragment"|"children"|"fragmentChildren"} $state
*/

/**
 * @param {Element} elem
 * @param {string} att
 * @param {string} attVal
 * @param {JamilihOptions} opts
 * @returns {void}
 */

function checkPluginValue(elem, att, attVal, opts) {
  opts.$state = 'attributeValue';
  if (attVal && typeof attVal === 'object') {
    const matchingPlugin = getMatchingPlugin(opts, Object.keys(attVal)[0]);
    if (matchingPlugin) {
      return matchingPlugin.set({
        opts,
        element: elem,
        attribute: {
          name: att,
          value: attVal
        }
      });
    }
  }
  return attVal;
}
/**
 * @param {JamilihOptions} opts
 * @param {string} item
 * @returns {JamilihPlugin}
 */

function getMatchingPlugin(opts, item) {
  return opts.$plugins && opts.$plugins.find(p => {
    return p.name === item;
  });
}
/**
 * Creates an XHTML or HTML element (XHTML is preferred, but only in browsers
 * that support); any element after element can be omitted, and any subsequent
 * type or types added afterwards.
 * @param {...JamilihArray} args
 * @returns {JamilihReturn} The newly created (and possibly already appended)
 *   element or array of elements
 */

const jml = function jml(...args) {
  let elem = doc.createDocumentFragment();
  /**
   *
   * @param {Object<{string: string}>} atts
   * @throws {TypeError}
   * @returns {void}
   */

  function _checkAtts(atts) {
    for (let [att, attVal] of Object.entries(atts)) {
      att = att in ATTR_MAP ? ATTR_MAP[att] : att;
      if (NULLABLES.includes(att)) {
        attVal = checkPluginValue(elem, att, attVal, opts);
        if (!_isNullish(attVal)) {
          elem[att] = attVal;
        }
        continue;
      } else if (ATTR_DOM.includes(att)) {
        attVal = checkPluginValue(elem, att, attVal, opts);
        elem[att] = attVal;
        continue;
      }
      switch (att) {
        /*
        Todos:
        0. JSON mode to prevent event addition
         0. {$xmlDocument: []} // doc.implementation.createDocument
         0. Accept array for any attribute with first item as prefix and second as value?
        0. {$: ['xhtml', 'div']} for prefixed elements
          case '$': // Element with prefix?
            nodes[nodes.length] = elem = doc.createElementNS(attVal[0], attVal[1]);
            break;
        */
        case '#':
          {
            // Document fragment
            opts.$state = 'fragmentChilden';
            nodes[nodes.length] = jml(opts, attVal);
            break;
          }
        case '$shadow':
          {
            const {
              open,
              closed
            } = attVal;
            let {
              content,
              template
            } = attVal;
            const shadowRoot = elem.attachShadow({
              mode: closed || open === false ? 'closed' : 'open'
            });
            if (template) {
              if (Array.isArray(template)) {
                template = _getType(template[0]) === 'object' ? jml('template', ...template, doc.body) : jml('template', template, doc.body);
              } else if (typeof template === 'string') {
                template = $$1(template);
              }
              jml(template.content.cloneNode(true), shadowRoot);
            } else {
              if (!content) {
                content = open || closed;
              }
              if (content && typeof content !== 'boolean') {
                if (Array.isArray(content)) {
                  jml({
                    '#': content
                  }, shadowRoot);
                } else {
                  jml(content, shadowRoot);
                }
              }
            }
            break;
          }
        case '$state':
          {
            // Handled internally
            break;
          }
        case 'is':
          {
            // Currently only in Chrome
            // Handled during element creation
            break;
          }
        case '$custom':
          {
            Object.assign(elem, attVal);
            break;
          }

        /* istanbul ignore next */

        case '$define':
          {
            const localName = elem.localName.toLowerCase(); // Note: customized built-ins sadly not working yet

            const customizedBuiltIn = !localName.includes('-'); // We check attribute in case this is a preexisting DOM element
            // const {is} = atts;

            let is;
            if (customizedBuiltIn) {
              is = elem.getAttribute('is');
              if (!is) {
                if (!{}.hasOwnProperty.call(atts, 'is')) {
                  throw new TypeError(`Expected \`is\` with \`$define\` on built-in; args: ${JSON.stringify(args)}`);
                }
                atts.is = checkPluginValue(elem, 'is', atts.is, opts);
                elem.setAttribute('is', atts.is);
                ({
                  is
                } = atts);
              }
            }
            const def = customizedBuiltIn ? is : localName;
            if (window.customElements.get(def)) {
              break;
            }
            const getConstructor = cnstrct => {
              const baseClass = options && options.extends ? doc.createElement(options.extends).constructor : customizedBuiltIn ? doc.createElement(localName).constructor : window.HTMLElement;
              /**
               * Class wrapping base class.
               */

              return cnstrct ? class extends baseClass {
                /**
                 * Calls user constructor.
                 */
                constructor() {
                  super();
                  cnstrct.call(this);
                }
              } : class extends baseClass {};
            };
            let cnstrctr, options, mixin;
            if (Array.isArray(attVal)) {
              if (attVal.length <= 2) {
                [cnstrctr, options] = attVal;
                if (typeof options === 'string') {
                  // Todo: Allow creating a definition without using it;
                  //  that may be the only reason to have a string here which
                  //  differs from the `localName` anyways
                  options = {
                    extends: options
                  };
                } else if (options && !{}.hasOwnProperty.call(options, 'extends')) {
                  mixin = options;
                }
                if (typeof cnstrctr === 'object') {
                  mixin = cnstrctr;
                  cnstrctr = getConstructor();
                }
              } else {
                [cnstrctr, mixin, options] = attVal;
                if (typeof options === 'string') {
                  options = {
                    extends: options
                  };
                }
              }
            } else if (typeof attVal === 'function') {
              cnstrctr = attVal;
            } else {
              mixin = attVal;
              cnstrctr = getConstructor();
            }
            if (!cnstrctr.toString().startsWith('class')) {
              cnstrctr = getConstructor(cnstrctr);
            }
            if (!options && customizedBuiltIn) {
              options = {
                extends: localName
              };
            }
            if (mixin) {
              Object.entries(mixin).forEach(([methodName, method]) => {
                cnstrctr.prototype[methodName] = method;
              });
            } // console.log('def', def, '::', typeof options === 'object' ? options : undefined);

            window.customElements.define(def, cnstrctr, typeof options === 'object' ? options : undefined);
            break;
          }
        case '$symbol':
          {
            const [symbol, func] = attVal;
            if (typeof func === 'function') {
              const funcBound = func.bind(elem);
              if (typeof symbol === 'string') {
                elem[Symbol.for(symbol)] = funcBound;
              } else {
                elem[symbol] = funcBound;
              }
            } else {
              const obj = func;
              obj.elem = elem;
              if (typeof symbol === 'string') {
                elem[Symbol.for(symbol)] = obj;
              } else {
                elem[symbol] = obj;
              }
            }
            break;
          }
        case '$data':
          {
            setMap(attVal);
            break;
          }
        case '$attribute':
          {
            // Attribute node
            const node = attVal.length === 3 ? doc.createAttributeNS(attVal[0], attVal[1]) : doc.createAttribute(attVal[0]);
            node.value = attVal[attVal.length - 1];
            nodes[nodes.length] = node;
            break;
          }
        case '$text':
          {
            // Todo: Also allow as jml(['a text node']) (or should that become a fragment)?
            const node = doc.createTextNode(attVal);
            nodes[nodes.length] = node;
            break;
          }
        case '$document':
          {
            // Todo: Conditionally create XML document
            const node = doc.implementation.createHTMLDocument();
            if (attVal.childNodes) {
              // Remove any extra nodes created by createHTMLDocument().
              const j = attVal.childNodes.length;
              while (node.childNodes[j]) {
                const cn = node.childNodes[j];
                cn.remove(); // `j` should stay the same as removing will cause node to be present
              }

              attVal.childNodes.forEach(_childrenToJML(node));
            } else {
              if (attVal.$DOCTYPE) {
                const dt = {
                  $DOCTYPE: attVal.$DOCTYPE
                };
                const doctype = jml(dt);
                node.firstChild.replaceWith(doctype);
              }
              const html = node.childNodes[1];
              const head = html.childNodes[0];
              const body = html.childNodes[1];
              if (attVal.title || attVal.head) {
                const meta = doc.createElement('meta');
                meta.setAttribute('charset', 'utf-8');
                head.append(meta);
                if (attVal.title) {
                  node.title = attVal.title; // Appends after meta
                }

                if (attVal.head) {
                  attVal.head.forEach(_appendJML(head));
                }
              }
              if (attVal.body) {
                attVal.body.forEach(_appendJMLOrText(body));
              }
            }
            nodes[nodes.length] = node;
            break;
          }
        case '$DOCTYPE':
          {
            const node = doc.implementation.createDocumentType(attVal.name, attVal.publicId || '', attVal.systemId || '');
            nodes[nodes.length] = node;
            break;
          }
        case '$on':
          {
            // Events
            // Allow for no-op by defaulting to `{}`
            for (let [p2, val] of Object.entries(attVal || {})) {
              if (typeof val === 'function') {
                val = [val, false];
              }
              if (typeof val[0] !== 'function') {
                throw new TypeError(`Expect a function for \`$on\`; args: ${JSON.stringify(args)}`);
              }
              _addEvent(elem, p2, val[0], val[1]); // element, event name, handler, capturing
            }

            break;
          }
        case 'className':
        case 'class':
          attVal = checkPluginValue(elem, att, attVal, opts);
          if (!_isNullish(attVal)) {
            elem.className = attVal;
          }
          break;
        case 'dataset':
          {
            // Map can be keyed with hyphenated or camel-cased properties
            const recurse = (atVal, startProp) => {
              let prop = '';
              const pastInitialProp = startProp !== '';
              Object.keys(atVal).forEach(key => {
                const value = atVal[key];
                prop = pastInitialProp ? startProp + key.replace(hyphenForCamelCase, _upperCase).replace(/^([a-z])/u, _upperCase) : startProp + key.replace(hyphenForCamelCase, _upperCase);
                if (value === null || typeof value !== 'object') {
                  if (!_isNullish(value)) {
                    elem.dataset[prop] = value;
                  }
                  prop = startProp;
                  return;
                }
                recurse(value, prop);
              });
            };
            recurse(attVal, '');
            break; // Todo: Disable this by default unless configuration explicitly allows (for security)
          }
        // #if IS_REMOVE
        // Don't remove this `if` block (for sake of no-innerHTML build)

        case 'innerHTML':
          if (!_isNullish(attVal)) {
            // eslint-disable-next-line no-unsanitized/property
            elem.innerHTML = attVal;
          }
          break;
        // #endif

        case 'htmlFor':
        case 'for':
          if (elStr === 'label') {
            attVal = checkPluginValue(elem, att, attVal, opts);
            if (!_isNullish(attVal)) {
              elem.htmlFor = attVal;
            }
            break;
          }
          attVal = checkPluginValue(elem, att, attVal, opts);
          elem.setAttribute(att, attVal);
          break;
        case 'xmlns':
          // Already handled
          break;
        default:
          {
            if (att.startsWith('on')) {
              attVal = checkPluginValue(elem, att, attVal, opts);
              elem[att] = attVal; // _addEvent(elem, att.slice(2), attVal, false); // This worked, but perhaps the user wishes only one event

              break;
            }
            if (att === 'style') {
              attVal = checkPluginValue(elem, att, attVal, opts);
              if (_isNullish(attVal)) {
                break;
              }
              if (typeof attVal === 'object') {
                for (const [p2, styleVal] of Object.entries(attVal)) {
                  if (!_isNullish(styleVal)) {
                    // Todo: Handle aggregate properties like "border"
                    if (p2 === 'float') {
                      elem.style.cssFloat = styleVal;
                      elem.style.styleFloat = styleVal; // Harmless though we could make conditional on older IE instead
                    } else {
                      elem.style[p2.replace(hyphenForCamelCase, _upperCase)] = styleVal;
                    }
                  }
                }
                break;
              } // setAttribute unfortunately erases any existing styles

              elem.setAttribute(att, attVal);
              /*
              // The following reorders which is troublesome for serialization, e.g., as used in our testing
              if (elem.style.cssText !== undefined) {
                elem.style.cssText += attVal;
              } else { // Opera
                elem.style += attVal;
              }
              */

              break;
            }
            const matchingPlugin = getMatchingPlugin(opts, att);
            if (matchingPlugin) {
              matchingPlugin.set({
                opts,
                element: elem,
                attribute: {
                  name: att,
                  value: attVal
                }
              });
              break;
            }
            attVal = checkPluginValue(elem, att, attVal, opts);
            elem.setAttribute(att, attVal);
            break;
          }
      }
    }
  }
  const nodes = [];
  let elStr;
  let opts;
  let isRoot = false;
  if (_getType(args[0]) === 'object' && Object.keys(args[0]).some(key => possibleOptions.includes(key))) {
    opts = args[0];
    if (opts.$state === undefined) {
      isRoot = true;
      opts.$state = 'root';
    }
    if (opts.$map && !opts.$map.root && opts.$map.root !== false) {
      opts.$map = {
        root: opts.$map
      };
    }
    if ('$plugins' in opts) {
      if (!Array.isArray(opts.$plugins)) {
        throw new TypeError(`\`$plugins\` must be an array; args: ${JSON.stringify(args)}`);
      }
      opts.$plugins.forEach(pluginObj => {
        if (!pluginObj || typeof pluginObj !== 'object') {
          throw new TypeError(`Plugin must be an object; args: ${JSON.stringify(args)}`);
        }
        if (!pluginObj.name || !pluginObj.name.startsWith('$_')) {
          throw new TypeError(`Plugin object name must be present and begin with \`$_\`; args: ${JSON.stringify(args)}`);
        }
        if (typeof pluginObj.set !== 'function') {
          throw new TypeError(`Plugin object must have a \`set\` method; args: ${JSON.stringify(args)}`);
        }
      });
    }
    args = args.slice(1);
  } else {
    opts = {
      $state: undefined
    };
  }
  const argc = args.length;
  const defaultMap = opts.$map && opts.$map.root;
  const setMap = dataVal => {
    let map, obj; // Boolean indicating use of default map and object

    if (dataVal === true) {
      [map, obj] = defaultMap;
    } else if (Array.isArray(dataVal)) {
      // Array of strings mapping to default
      if (typeof dataVal[0] === 'string') {
        dataVal.forEach(dVal => {
          setMap(opts.$map[dVal]);
        });
        return; // Array of Map and non-map data object
      }

      map = dataVal[0] || defaultMap[0];
      obj = dataVal[1] || defaultMap[1]; // Map
    } else if (/^\[object (?:Weak)?Map\]$/u.test([].toString.call(dataVal))) {
      map = dataVal;
      obj = defaultMap[1]; // Non-map data object
    } else {
      map = defaultMap[0];
      obj = dataVal;
    }
    map.set(elem, obj);
  };
  for (let i = 0; i < argc; i++) {
    let arg = args[i];
    const type = _getType(arg);
    switch (type) {
      case 'null':
        // null always indicates a place-holder (only needed for last argument if want array returned)
        if (i === argc - 1) {
          _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
          // Todo: Fix to allow application of stylesheets of style tags within fragments?

          return nodes.length <= 1 ? nodes[0] // eslint-disable-next-line unicorn/no-array-callback-reference
          : nodes.reduce(_fragReducer, doc.createDocumentFragment()); // nodes;
        }

        throw new TypeError(`\`null\` values not allowed except as final Jamilih argument; index ${i} on args: ${JSON.stringify(args)}`);
      case 'string':
        // Strings normally indicate elements
        switch (arg) {
          case '!':
            nodes[nodes.length] = doc.createComment(args[++i]);
            break;
          case '?':
            {
              arg = args[++i];
              let procValue = args[++i];
              const val = procValue;
              if (val && typeof val === 'object') {
                procValue = [];
                for (const [p, procInstVal] of Object.entries(val)) {
                  procValue.push(p + '=' + '"' +
                  // https://www.w3.org/TR/xml-stylesheet/#NT-PseudoAttValue
                  procInstVal.replace(/"/gu, '&quot;') + '"');
                }
                procValue = procValue.join(' ');
              } // Firefox allows instructions with ">" in this method, but not if placed directly!

              try {
                nodes[nodes.length] = doc.createProcessingInstruction(arg, procValue);
              } catch (e) {
                // Getting NotSupportedError in IE, so we try to imitate a processing instruction with a comment
                // innerHTML didn't work
                // var elContainer = doc.createElement('div');
                // elContainer.innerHTML = '<?' + doc.createTextNode(arg + ' ' + procValue).nodeValue + '?>';
                // nodes[nodes.length] = elContainer.innerHTML;
                // Todo: any other way to resolve? Just use XML?
                nodes[nodes.length] = doc.createComment('?' + arg + ' ' + procValue + '?');
              }
              break; // Browsers don't support doc.createEntityReference, so we just use this as a convenience
            }

          case '&':
            nodes[nodes.length] = _createSafeReference('entity', '', args[++i]);
            break;
          case '#':
            // // Decimal character reference - ['#', '01234'] // &#01234; // probably easier to use JavaScript Unicode escapes
            nodes[nodes.length] = _createSafeReference('decimal', arg, String(args[++i]));
            break;
          case '#x':
            // Hex character reference - ['#x', '123a'] // &#x123a; // probably easier to use JavaScript Unicode escapes
            nodes[nodes.length] = _createSafeReference('hexadecimal', arg, args[++i]);
            break;
          case '![':
            // '![', ['escaped <&> text'] // <![CDATA[escaped <&> text]]>
            // CDATA valid in XML only, so we'll just treat as text for mutual compatibility
            // Todo: config (or detection via some kind of doc.documentType property?) of whether in XML
            try {
              nodes[nodes.length] = doc.createCDATASection(args[++i]);
            } catch (e2) {
              nodes[nodes.length] = doc.createTextNode(args[i]); // i already incremented
            }

            break;
          case '':
            nodes[nodes.length] = elem = doc.createDocumentFragment(); // Todo: Report to plugins

            opts.$state = 'fragment';
            break;
          default:
            {
              // An element
              elStr = arg;
              const atts = args[i + 1];
              if (_getType(atts) === 'object' && atts.is) {
                const {
                  is
                } = atts; // istanbul ignore next

                elem = doc.createElementNS ? doc.createElementNS(NS_HTML, elStr, {
                  is
                }) : doc.createElement(elStr, {
                  is
                });
              } else /* istanbul ignore else */
                if (doc.createElementNS) {
                  elem = doc.createElementNS(NS_HTML, elStr);
                } else {
                  elem = doc.createElement(elStr);
                } // Todo: Report to plugins

              opts.$state = 'element';
              nodes[nodes.length] = elem; // Add to parent

              break;
            }
        }
        break;
      case 'object':
        {
          // Non-DOM-element objects indicate attribute-value pairs
          const atts = arg;
          if (atts.xmlns !== undefined) {
            // We handle this here, as otherwise may lose events, etc.
            // As namespace of element already set as XHTML, we need to change the namespace
            // elem.setAttribute('xmlns', atts.xmlns); // Doesn't work
            // Can't set namespaceURI dynamically, renameNode() is not supported, and setAttribute() doesn't work to change the namespace, so we resort to this hack
            const replacer = typeof atts.xmlns === 'object' ? _replaceDefiner(atts.xmlns) : ' xmlns="' + atts.xmlns + '"'; // try {
            // Also fix DOMParser to work with text/html

            elem = nodes[nodes.length - 1] = new win.DOMParser().parseFromString(new win.XMLSerializer().serializeToString(elem) // Mozilla adds XHTML namespace
            .replace(' xmlns="' + NS_HTML + '"', replacer), 'application/xml').documentElement; // Todo: Report to plugins

            opts.$state = 'element'; // }catch(e) {alert(elem.outerHTML);throw e;}
          }

          _checkAtts(atts);
          break;
        }
      case 'document':
      case 'fragment':
      case 'element':
        /*
        1) Last element always the parent (put null if don't want parent and want to return array) unless only atts and children (no other elements)
        2) Individual elements (DOM elements or sequences of string[/object/array]) get added to parent first-in, first-added
        */
        if (i === 0) {
          // Allow wrapping of element, fragment, or document
          elem = arg; // Todo: Report to plugins

          opts.$state = 'element';
        }
        if (i === argc - 1 || i === argc - 2 && args[i + 1] === null) {
          // parent
          const elsl = nodes.length;
          for (let k = 0; k < elsl; k++) {
            _appendNode(arg, nodes[k]);
          } // Todo: Apply stylesheets if any style tags were added elsewhere besides the first element?

          _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
        } else {
          nodes[nodes.length] = arg;
        }
        break;
      case 'array':
        {
          // Arrays or arrays of arrays indicate child nodes
          const child = arg;
          const cl = child.length;
          for (let j = 0; j < cl; j++) {
            // Go through children array container to handle elements
            const childContent = child[j];
            const childContentType = typeof childContent;
            if (_isNullish(childContent)) {
              throw new TypeError(`Bad children (parent array: ${JSON.stringify(args)}; index ${j} of child: ${JSON.stringify(child)})`);
            }
            switch (childContentType) {
              // Todo: determine whether null or function should have special handling or be converted to text
              case 'string':
              case 'number':
              case 'boolean':
                _appendNode(elem, doc.createTextNode(childContent));
                break;
              default:
                if (Array.isArray(childContent)) {
                  // Arrays representing child elements
                  opts.$state = 'children';
                  _appendNode(elem, jml(opts, ...childContent));
                } else if (childContent['#']) {
                  // Fragment
                  opts.$state = 'fragmentChildren';
                  _appendNode(elem, jml(opts, childContent['#']));
                } else {
                  // Single DOM element children
                  const newChildContent = checkPluginValue(elem, null, childContent, opts);
                  _appendNode(elem, newChildContent);
                }
                break;
            }
          }
          break;
        }
      default:
        throw new TypeError(`Unexpected type: ${type}; arg: ${arg}; index ${i} on args: ${JSON.stringify(args)}`);
    }
  }
  const ret = nodes[0] || elem;
  if (isRoot && opts.$map && opts.$map.root) {
    setMap(true);
  }
  return ret;
};
/**
* Converts a DOM object or a string of HTML into a Jamilih object (or string).
* @param {string|HTMLElement} dom If a string, will parse as document
* @param {PlainObject} [config] Configuration object
* @param {boolean} [config.stringOutput=false] Whether to output the Jamilih object as a string.
* @param {boolean} [config.reportInvalidState=true] If true (the default), will report invalid state errors
* @param {boolean} [config.stripWhitespace=false] Strip whitespace for text nodes
* @throws {TypeError}
* @returns {JamilihArray|string} Array containing the elements which represent
* a Jamilih object, or, if `stringOutput` is true, it will be the stringified
* version of such an object
*/

jml.toJML = function (dom, {
  stringOutput = false,
  reportInvalidState = true,
  stripWhitespace = false
} = {}) {
  if (typeof dom === 'string') {
    dom = new win.DOMParser().parseFromString(dom, 'text/html'); // todo: Give option for XML once implemented and change JSDoc to allow for Element
  }

  const ret = [];
  let parent = ret;
  let parentIdx = 0;
  /**
   * @param {string} msg
   * @throws {DOMException}
   * @returns {void}
   */

  function invalidStateError(msg) {
    // These are probably only necessary if working with text/html

    /* eslint-disable no-shadow, unicorn/custom-error-definition */

    /**
     * Polyfill for `DOMException`.
     */
    class DOMException extends Error {
      /* eslint-enable no-shadow, unicorn/custom-error-definition */

      /**
       * @param {string} message
       * @param {string} name
       */
      constructor(message, name) {
        super(message); // eslint-disable-next-line unicorn/custom-error-definition

        this.name = name;
      }
    }
    if (reportInvalidState) {
      // INVALID_STATE_ERR per section 9.3 XHTML 5: http://www.w3.org/TR/html5/the-xhtml-syntax.html
      const e = new DOMException(msg, 'INVALID_STATE_ERR');
      e.code = 11;
      throw e;
    }
  }
  /**
   *
   * @param {DocumentType|Entity} obj
   * @param {Node} node
   * @returns {void}
   */

  function addExternalID(obj, node) {
    if (node.systemId.includes('"') && node.systemId.includes("'")) {
      invalidStateError('systemId cannot have both single and double quotes.');
    }
    const {
      publicId,
      systemId
    } = node;
    if (systemId) {
      obj.systemId = systemId;
    }
    if (publicId) {
      obj.publicId = publicId;
    }
  }
  /**
   *
   * @param {any} val
   * @returns {void}
   */

  function set(val) {
    parent[parentIdx] = val;
    parentIdx++;
  }
  /**
   * @returns {void}
   */

  function setChildren() {
    set([]);
    parent = parent[parentIdx - 1];
    parentIdx = 0;
  }
  /**
   *
   * @param {string} prop1
   * @param {string} prop2
   * @returns {void}
   */

  function setObj(prop1, prop2) {
    parent = parent[parentIdx - 1][prop1];
    parentIdx = 0;
    if (prop2) {
      parent = parent[prop2];
    }
  }
  /**
   *
   * @param {Node} node
   * @param {object<{string: string}>} namespaces
   * @throws {TypeError}
   * @returns {void}
   */

  function parseDOM(node, namespaces) {
    // namespaces = clone(namespaces) || {}; // Ensure we're working with a copy, so different levels in the hierarchy can treat it differently

    /*
    if ((node.prefix && node.prefix.includes(':')) || (node.localName && node.localName.includes(':'))) {
      invalidStateError('Prefix cannot have a colon');
    }
    */
    const type = 'nodeType' in node ? node.nodeType : null;
    namespaces = {
      ...namespaces
    };
    const xmlChars = /^([\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/u; // eslint-disable-line no-control-regex

    if ([2, 3, 4, 7, 8].includes(type) && !xmlChars.test(node.nodeValue)) {
      invalidStateError('Node has bad XML character value');
    }
    let tmpParent, tmpParentIdx;
    /**
     * @returns {void}
     */

    function setTemp() {
      tmpParent = parent;
      tmpParentIdx = parentIdx;
    }
    /**
     * @returns {void}
     */

    function resetTemp() {
      parent = tmpParent;
      parentIdx = tmpParentIdx;
      parentIdx++; // Increment index in parent container of this element
    }

    switch (type) {
      case 1:
        {
          // ELEMENT
          setTemp();
          const nodeName = node.nodeName.toLowerCase(); // Todo: for XML, should not lower-case

          setChildren(); // Build child array since elements are, except at the top level, encapsulated in arrays

          set(nodeName);
          const start = {};
          let hasNamespaceDeclaration = false;
          if (namespaces[node.prefix || ''] !== node.namespaceURI) {
            namespaces[node.prefix || ''] = node.namespaceURI;
            if (node.prefix) {
              start['xmlns:' + node.prefix] = node.namespaceURI;
            } else if (node.namespaceURI) {
              start.xmlns = node.namespaceURI;
            } else {
              start.xmlns = null;
            }
            hasNamespaceDeclaration = true;
          }
          if (node.attributes.length) {
            set([...node.attributes].reduce(function (obj, att) {
              obj[att.name] = att.value; // Attr.nodeName and Attr.nodeValue are deprecated as of DOM4 as Attr no longer inherits from Node, so we can safely use name and value

              return obj;
            }, start));
          } else if (hasNamespaceDeclaration) {
            set(start);
          }
          const {
            childNodes
          } = node;
          if (childNodes.length) {
            setChildren(); // Element children array container

            [...childNodes].forEach(function (childNode) {
              parseDOM(childNode, namespaces);
            });
          }
          resetTemp();
          break;
        }
      case undefined: // Treat as attribute node until this is fixed: https://github.com/jsdom/jsdom/issues/1641 / https://github.com/jsdom/jsdom/pull/1822

      case 2:
        // ATTRIBUTE (should only get here if passing in an attribute node)
        set({
          $attribute: [node.namespaceURI, node.name, node.value]
        });
        break;
      case 3:
        // TEXT
        if (stripWhitespace && /^\s+$/u.test(node.nodeValue)) {
          set('');
          return;
        }
        set(node.nodeValue);
        break;
      case 4:
        // CDATA
        if (node.nodeValue.includes(']]' + '>')) {
          invalidStateError('CDATA cannot end with closing ]]>');
        }
        set(['![', node.nodeValue]);
        break;
      case 5:
        // ENTITY REFERENCE (though not in browsers (was already resolved
        //  anyways), ok to keep for parity with our "entity" shorthand)
        set(['&', node.nodeName]);
        break;
      case 7:
        // PROCESSING INSTRUCTION
        if (/^xml$/iu.test(node.target)) {
          invalidStateError('Processing instructions cannot be "xml".');
        }
        if (node.target.includes('?>')) {
          invalidStateError('Processing instruction targets cannot include ?>');
        }
        if (node.target.includes(':')) {
          invalidStateError('The processing instruction target cannot include ":"');
        }
        if (node.data.includes('?>')) {
          invalidStateError('Processing instruction data cannot include ?>');
        }
        set(['?', node.target, node.data]); // Todo: Could give option to attempt to convert value back into object if has pseudo-attributes

        break;
      case 8:
        // COMMENT
        if (node.nodeValue.includes('--') || node.nodeValue.length && node.nodeValue.lastIndexOf('-') === node.nodeValue.length - 1) {
          invalidStateError('Comments cannot include --');
        }
        set(['!', node.nodeValue]);
        break;
      case 9:
        {
          // DOCUMENT
          setTemp();
          const docObj = {
            $document: {
              childNodes: []
            }
          };
          set(docObj); // doc.implementation.createHTMLDocument
          // Set position to fragment's array children

          setObj('$document', 'childNodes');
          const {
            childNodes
          } = node;
          if (!childNodes.length) {
            invalidStateError('Documents must have a child node');
          } // set({$xmlDocument: []}); // doc.implementation.createDocument // Todo: use this conditionally

          [...childNodes].forEach(function (childNode) {
            // Can't just do documentElement as there may be doctype, comments, etc.
            // No need for setChildren, as we have already built the container array
            parseDOM(childNode, namespaces);
          });
          resetTemp();
          break;
        }
      case 10:
        {
          // DOCUMENT TYPE
          setTemp(); // Can create directly by doc.implementation.createDocumentType

          const start = {
            $DOCTYPE: {
              name: node.name
            }
          };
          const pubIdChar = /^(\u0020|\u000D|\u000A|[a-zA-Z0-9]|[-'()+,./:=?;!*#@$_%])*$/u; // eslint-disable-line no-control-regex

          if (!pubIdChar.test(node.publicId)) {
            invalidStateError('A publicId must have valid characters.');
          }
          addExternalID(start.$DOCTYPE, node); // Fit in internal subset along with entities?: probably don't need as these would only differ if from DTD, and we're not rebuilding the DTD

          set(start); // Auto-generate the internalSubset instead?

          resetTemp();
          break;
        }
      case 11:
        {
          // DOCUMENT FRAGMENT
          setTemp();
          set({
            '#': []
          }); // Set position to fragment's array children

          setObj('#');
          const {
            childNodes
          } = node;
          [...childNodes].forEach(function (childNode) {
            // No need for setChildren, as we have already built the container array
            parseDOM(childNode, namespaces);
          });
          resetTemp();
          break;
        }
      default:
        throw new TypeError('Not an XML type');
    }
  }
  parseDOM(dom, {});
  if (stringOutput) {
    return JSON.stringify(ret[0]);
  }
  return ret[0];
};
jml.toJMLString = function (dom, config) {
  return jml.toJML(dom, Object.assign(config || {}, {
    stringOutput: true
  }));
};
/**
 *
 * @param {...JamilihArray} args
 * @returns {JamilihReturn}
 */

jml.toDOM = function (...args) {
  // Alias for jml()
  return jml(...args);
};
/**
 *
 * @param {...JamilihArray} args
 * @returns {string}
 */

jml.toHTML = function (...args) {
  // Todo: Replace this with version of jml() that directly builds a string
  const ret = jml(...args); // Todo: deal with serialization of properties like 'selected',
  //  'checked', 'value', 'defaultValue', 'for', 'dataset', 'on*',
  //  'style'! (i.e., need to build a string ourselves)

  return ret.outerHTML;
};
/**
 *
 * @param {...JamilihArray} args
 * @returns {string}
 */

jml.toDOMString = function (...args) {
  // Alias for jml.toHTML for parity with jml.toJMLString
  return jml.toHTML(...args);
};
/**
 *
 * @param {...JamilihArray} args
 * @returns {string}
 */

jml.toXML = function (...args) {
  const ret = jml(...args);
  return new win.XMLSerializer().serializeToString(ret);
};
/**
 *
 * @param {...JamilihArray} args
 * @returns {string}
 */

jml.toXMLDOMString = function (...args) {
  // Alias for jml.toXML for parity with jml.toJMLString
  return jml.toXML(...args);
};
/**
 * Element-aware wrapper for `Map`.
 */

class JamilihMap extends Map {
  /**
   * @param {string|Element} elem
   * @returns {any}
   */
  get(elem) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return super.get.call(this, elem);
  }
  /**
   * @param {string|Element} elem
   * @param {any} value
   * @returns {any}
   */

  set(elem, value) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return super.set.call(this, elem, value);
  }
  /**
   * @param {string|Element} elem
   * @param {string} methodName
   * @param {...any} args
   * @returns {any}
   */

  invoke(elem, methodName, ...args) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return this.get(elem)[methodName](elem, ...args);
  }
}
/**
 * Element-aware wrapper for `WeakMap`.
 */

class JamilihWeakMap extends WeakMap {
  /**
   * @param {string|Element} elem
   * @returns {any}
   */
  get(elem) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return super.get.call(this, elem);
  }
  /**
   * @param {string|Element} elem
   * @param {any} value
   * @returns {any}
   */

  set(elem, value) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return super.set.call(this, elem, value);
  }
  /**
   * @param {string|Element} elem
   * @param {string} methodName
   * @param {...any} args
   * @returns {any}
   */

  invoke(elem, methodName, ...args) {
    elem = typeof elem === 'string' ? $$1(elem) : elem;
    return this.get(elem)[methodName](elem, ...args);
  }
}
jml.Map = JamilihMap;
jml.WeakMap = JamilihWeakMap;
/**
* @typedef {GenericArray} MapAndElementArray
* @property {JamilihWeakMap|JamilihMap} 0
* @property {Element} 1
*/

/**
 * @param {GenericObject} obj
 * @param {...JamilihArray} args
 * @returns {MapAndElementArray}
 */

jml.weak = function (obj, ...args) {
  const map = new JamilihWeakMap();
  const elem = jml({
    $map: [map, obj]
  }, ...args);
  return [map, elem];
};
/**
 * @param {any} obj
 * @param {...JamilihArray} args
 * @returns {MapAndElementArray}
 */

jml.strong = function (obj, ...args) {
  const map = new JamilihMap();
  const elem = jml({
    $map: [map, obj]
  }, ...args);
  return [map, elem];
};
/**
 * @param {string|Element} elem If a string, will be interpreted as a selector
 * @param {symbol|string} sym If a string, will be used with `Symbol.for`
 * @returns {any} The value associated with the symbol
 */

jml.symbol = jml.sym = jml.for = function (elem, sym) {
  elem = typeof elem === 'string' ? $$1(elem) : elem;
  return elem[typeof sym === 'symbol' ? sym : Symbol.for(sym)];
};
/**
 * @param {string|Element} elem If a string, will be interpreted as a selector
 * @param {symbol|string|Map|WeakMap} symOrMap If a string, will be used with `Symbol.for`
 * @param {string|any} methodName Can be `any` if the symbol or map directly
 *   points to a function (it is then used as the first argument).
 * @param {any[]} args
 * @returns {any}
 */

jml.command = function (elem, symOrMap, methodName, ...args) {
  elem = typeof elem === 'string' ? $$1(elem) : elem;
  let func;
  if (['symbol', 'string'].includes(typeof symOrMap)) {
    func = jml.sym(elem, symOrMap);
    if (typeof func === 'function') {
      return func(methodName, ...args); // Already has `this` bound to `elem`
    }

    return func[methodName](...args);
  }
  func = symOrMap.get(elem);
  if (typeof func === 'function') {
    return func.call(elem, methodName, ...args);
  }
  return func[methodName](elem, ...args); // return func[methodName].call(elem, ...args);
};
/**
 * Expects properties `document`, `XMLSerializer`, and `DOMParser`.
 * Also updates `body` with `document.body`.
 * @param {Window} wind
 * @returns {void}
 */

jml.setWindow = wind => {
  win = wind;
  doc = win.document;
  if (doc && doc.body) {
    ({
      body
    } = doc);
  }
};
/**
 * @returns {Window}
 */

jml.getWindow = () => {
  return win;
};

let body = doc && doc.body; // eslint-disable-line import/no-mutable-exports

const nbsp = '\u00A0'; // Very commonly needed in templates

const $ = sel => document.querySelector(sel);
const $e = (el, descendentsSel) => {
  el = typeof el === 'string' ? $(el) : el;
  return el.querySelector(descendentsSel);
};

const _excluded$1 = ["submit", "submitClass"],
  _excluded2 = ["submit", "cancel", "cancelClass", "submitClass"],
  _excluded3 = ["message", "submit"];
const defaultLocale = 'en';
const localeStrings = {
  en: {
    submit: 'Submit',
    cancel: 'Cancel',
    ok: 'Ok'
  }
};
class Dialog {
  constructor({
    locale,
    localeObject
  } = {}) {
    this.setLocale({
      locale,
      localeObject
    });
  }
  setLocale({
    locale = {},
    localeObject = {}
  }) {
    this.localeStrings = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, localeStrings[defaultLocale]), localeStrings[locale]), localeObject);
  }
  makeDialog({
    atts = {
      $on: null
    },
    children = [],
    close,
    remove = true
  }) {
    if (close) {
      if (!atts.$on) {
        atts.$on = {};
      }
      if (!atts.$on.close) {
        atts.$on.close = close;
      }
    }
    const dialog = /** @type {HTMLDialogElement} */jml('dialog', atts, children, $$1('#main'));
    dialog.showModal();
    if (remove) {
      dialog.addEventListener('close', () => {
        dialog.remove();
      });
    }
    return dialog;
  }
  makeSubmitDialog(_ref) {
    let {
        submit,
        // Don't pass this on to `args` if present
        submitClass = 'submit'
      } = _ref,
      args = _objectWithoutProperties(_ref, _excluded$1);
    const dialog = this.makeCancelDialog(args);
    $e(dialog, `button.${args.cancelClass || 'cancel'}`).before(jml('button', {
      class: submitClass,
      $on: {
        click(e) {
          if (submit) {
            submit.call(this, {
              e,
              dialog
            });
          }
        }
      }
    }, [this.localeStrings.submit]), nbsp.repeat(2));
    return dialog;
  }
  makeCancelDialog(_ref2) {
    let {
        submit,
        // Don't pass this on to `args` if present
        cancel,
        cancelClass = 'cancel',
        submitClass = 'submit'
      } = _ref2,
      args = _objectWithoutProperties(_ref2, _excluded2);
    const dialog = this.makeDialog(args);
    jml('div', {
      class: submitClass
    }, [['br'], ['br'], ['button', {
      class: cancelClass,
      $on: {
        click(e) {
          e.preventDefault();
          if (cancel) {
            if (cancel.call(this, {
              e,
              dialog
            }) === false) {
              return;
            }
          }
          dialog.close();
        }
      }
    }, [this.localeStrings.cancel]]], dialog);
    return dialog;
  }
  alert(message, ok) {
    message = typeof message === 'string' ? {
      message
    } : message;
    const {
      ok: includeOk = typeof ok === 'object' ? ok.ok !== false : ok !== false,
      message: msg,
      submitClass = 'submit'
    } = message;
    return new Promise((resolve, reject) => {
      const dialog = /** @type {HTMLDialogElement} */jml('dialog', [msg, ...(includeOk ? [['br'], ['br'], ['div', {
        class: submitClass
      }, [['button', {
        $on: {
          click() {
            dialog.close();
            resolve();
          }
        }
      }, [this.localeStrings.ok]]]]] : [])], $$1('#main'));
      dialog.showModal();
    });
  }
  prompt(message) {
    message = typeof message === 'string' ? {
      message
    } : message;
    const {
        message: msg,
        submit: userSubmit
      } = message,
      submitArgs = _objectWithoutProperties(message, _excluded3);
    return new Promise((resolve, reject) => {
      const submit = function ({
        e,
        dialog
      }) {
        if (userSubmit) {
          userSubmit.call(this, {
            e,
            dialog
          });
        }
        dialog.close();
        resolve($e(dialog, 'input').value);
      };
      /* const dialog = */
      this.makeSubmitDialog(_objectSpread2$1(_objectSpread2$1({}, submitArgs), {}, {
        submit,
        cancel() {
          reject(new Error('cancelled'));
        },
        children: [['label', [msg, nbsp.repeat(3), ['input']]]]
      }));
    });
  }
  confirm(message) {
    message = typeof message === 'string' ? {
      message
    } : message;
    const {
      message: msg,
      submitClass = 'submit'
    } = message;
    return new Promise((resolve, reject) => {
      const dialog = /** @type {HTMLDialogElement} */jml('dialog', [msg, ['br'], ['br'], ['div', {
        class: submitClass
      }, [['button', {
        $on: {
          click() {
            dialog.close();
            resolve();
          }
        }
      }, [this.localeStrings.ok]], nbsp.repeat(2), ['button', {
        $on: {
          click() {
            dialog.close();
            reject(new Error('cancelled'));
          }
        }
      }, [this.localeStrings.cancel]]]]], $$1('#main'));
      dialog.showModal();
    });
  }
}
const dialogs = new Dialog();

/* eslint-env browser */
// Todo: remember this locales choice by cookie?
const getPreferredLanguages = ({
  namespace,
  preferredLocale
}) => {
  // Todo: Add to this optionally with one-off tag input box
  // Todo: Switch to fallbackLanguages so can default to
  //    navigator.languages?
  const langCodes = localStorage.getItem(namespace + '-langCodes');
  const lngs = langCodes && JSON.parse(langCodes) || [preferredLocale];
  const langArr = [];
  lngs.forEach(lng => {
    // Todo: Check for multiple separate hyphenated
    //   groupings (for each supplied language)
    const higherLocale = lng.replace(/-.*$/, '');
    if (higherLocale === lng) {
      langArr.push(lng);
    } else {
      langArr.push(lng, higherLocale);
    }
  });
  return langArr;
};
class Languages {
  constructor({
    langData
  }) {
    this.langData = langData;
  }
  localeFromLangData(langCode) {
    return this.langData['localization-strings'][langCode];
  }
  getLanguageFromCode(code) {
    return this.localeFromLangData(code).languages[code];
    // Could add something like this in place or as fallback, though need to pass in locale
    // || new Intl.DisplayNames([locale], {type: 'language'}).of(code);
  }

  getFieldNameFromPluginNameAndLocales({
    pluginName,
    locales,
    workI18n,
    targetLanguage,
    applicableFieldI18N,
    meta,
    metaApplicableField
  }) {
    return workI18n(['plugins', pluginName, 'fieldname'], _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, meta), metaApplicableField), {}, {
      applicableField: applicableFieldI18N,
      targetLanguage: targetLanguage ? this.getLanguageFromCode(targetLanguage) : ''
    }), {
      // We provide more than may be desired by the plugin
      throwOnExtraSuppliedFormatters: false
    });
  }
  getLanguageInfo({
    $p
  }) {
    const langs = this.langData.languages;
    const localePass = lcl => {
      return langs.some(({
        code
      }) => code === lcl) ? lcl : false;
    };
    const languageParam = $p.get('lang', true);
    // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice
    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length ? navLangs : [localePass(navigator.language) || 'en-US'];
    // We need a default to display a default title
    const language = languageParam || fallbackLanguages[0];
    const preferredLangs = language.split('.');
    const lang = [...preferredLangs, ...fallbackLanguages];
    return {
      lang,
      langs,
      languageParam,
      fallbackLanguages
    };
  }
}

var JsonRefs = function (t) {
  var n = {};
  function r(e) {
    if (n[e]) return n[e].exports;
    var o = n[e] = {
      i: e,
      l: !1,
      exports: {}
    };
    return t[e].call(o.exports, o, o.exports, r), o.l = !0, o.exports;
  }
  return r.m = t, r.c = n, r.d = function (t, n, e) {
    r.o(t, n) || Object.defineProperty(t, n, {
      enumerable: !0,
      get: e
    });
  }, r.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, r.t = function (t, n) {
    if (1 & n && (t = r(t)), 8 & n) return t;
    if (4 & n && "object" == typeof t && t && t.__esModule) return t;
    var e = Object.create(null);
    if (r.r(e), Object.defineProperty(e, "default", {
      enumerable: !0,
      value: t
    }), 2 & n && "string" != typeof t) for (var o in t) r.d(e, o, function (n) {
      return t[n];
    }.bind(null, o));
    return e;
  }, r.n = function (t) {
    var n = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return r.d(n, "a", n), n;
  }, r.o = function (t, n) {
    return Object.prototype.hasOwnProperty.call(t, n);
  }, r.p = "", r(r.s = 84);
}([function (t, n) {
  var r = Array.isArray;
  t.exports = r;
}, function (t, n, r) {
  var e;
  try {
    e = {
      clone: r(88),
      constant: r(64),
      each: r(146),
      filter: r(152),
      has: r(175),
      isArray: r(0),
      isEmpty: r(177),
      isFunction: r(17),
      isUndefined: r(178),
      keys: r(6),
      map: r(179),
      reduce: r(181),
      size: r(184),
      transform: r(190),
      union: r(191),
      values: r(210)
    };
  } catch (t) {}
  e || (e = window._), t.exports = e;
}, function (t, n, r) {
  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(47),
    i = "object" == ("undefined" == typeof self ? "undefined" : e(self)) && self && self.Object === Object && self,
    u = o || i || Function("return this")();
  t.exports = u;
}, function (t, n) {
  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  t.exports = function (t) {
    return null != t && "object" == r(t);
  };
}, function (t, n, r) {
  var e = r(100),
    o = r(105);
  t.exports = function (t, n) {
    var r = o(t, n);
    return e(r) ? r : void 0;
  };
}, function (t, n) {
  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  t.exports = function (t) {
    var n = r(t);
    return null != t && ("object" == n || "function" == n);
  };
}, function (t, n, r) {
  var e = r(52),
    o = r(37),
    i = r(7);
  t.exports = function (t) {
    return i(t) ? e(t) : o(t);
  };
}, function (t, n, r) {
  var e = r(17),
    o = r(34);
  t.exports = function (t) {
    return null != t && o(t.length) && !e(t);
  };
}, function (t, n, r) {
  var e = r(9),
    o = r(101),
    i = r(102),
    u = e ? e.toStringTag : void 0;
  t.exports = function (t) {
    return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : u && u in Object(t) ? o(t) : i(t);
  };
}, function (t, n, r) {
  var e = r(2).Symbol;
  t.exports = e;
}, function (t, n, r) {
  var e = r(132),
    o = r(31),
    i = r(133),
    u = r(61),
    c = r(134),
    a = r(8),
    s = r(48),
    f = s(e),
    l = s(o),
    p = s(i),
    h = s(u),
    v = s(c),
    d = a;
  (e && "[object DataView]" != d(new e(new ArrayBuffer(1))) || o && "[object Map]" != d(new o()) || i && "[object Promise]" != d(i.resolve()) || u && "[object Set]" != d(new u()) || c && "[object WeakMap]" != d(new c())) && (d = function (t) {
    var n = a(t),
      r = "[object Object]" == n ? t.constructor : void 0,
      e = r ? s(r) : "";
    if (e) switch (e) {
      case f:
        return "[object DataView]";
      case l:
        return "[object Map]";
      case p:
        return "[object Promise]";
      case h:
        return "[object Set]";
      case v:
        return "[object WeakMap]";
    }
    return n;
  }), t.exports = d;
}, function (t, n) {
  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var e;
  e = function () {
    return this;
  }();
  try {
    e = e || new Function("return this")();
  } catch (t) {
    "object" === ("undefined" == typeof window ? "undefined" : r(window)) && (e = window);
  }
  t.exports = e;
}, function (t, n, r) {
  (function (t) {
    function e(t) {
      return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    var o = r(2),
      i = r(121),
      u = "object" == e(n) && n && !n.nodeType && n,
      c = u && "object" == e(t) && t && !t.nodeType && t,
      a = c && c.exports === u ? o.Buffer : void 0,
      s = (a ? a.isBuffer : void 0) || i;
    t.exports = s;
  }).call(this, r(14)(t));
}, function (t, n) {
  var r,
    e,
    o = t.exports = {};
  function i() {
    throw new Error("setTimeout has not been defined");
  }
  function u() {
    throw new Error("clearTimeout has not been defined");
  }
  function c(t) {
    if (r === setTimeout) return setTimeout(t, 0);
    if ((r === i || !r) && setTimeout) return r = setTimeout, setTimeout(t, 0);
    try {
      return r(t, 0);
    } catch (n) {
      try {
        return r.call(null, t, 0);
      } catch (n) {
        return r.call(this, t, 0);
      }
    }
  }
  !function () {
    try {
      r = "function" == typeof setTimeout ? setTimeout : i;
    } catch (t) {
      r = i;
    }
    try {
      e = "function" == typeof clearTimeout ? clearTimeout : u;
    } catch (t) {
      e = u;
    }
  }();
  var a,
    s = [],
    f = !1,
    l = -1;
  function p() {
    f && a && (f = !1, a.length ? s = a.concat(s) : l = -1, s.length && h());
  }
  function h() {
    if (!f) {
      var t = c(p);
      f = !0;
      for (var n = s.length; n;) {
        for (a = s, s = []; ++l < n;) a && a[l].run();
        l = -1, n = s.length;
      }
      a = null, f = !1, function (t) {
        if (e === clearTimeout) return clearTimeout(t);
        if ((e === u || !e) && clearTimeout) return e = clearTimeout, clearTimeout(t);
        try {
          e(t);
        } catch (n) {
          try {
            return e.call(null, t);
          } catch (n) {
            return e.call(this, t);
          }
        }
      }(t);
    }
  }
  function v(t, n) {
    this.fun = t, this.array = n;
  }
  function d() {}
  o.nextTick = function (t) {
    var n = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
    s.push(new v(t, n)), 1 !== s.length || f || c(h);
  }, v.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = d, o.addListener = d, o.once = d, o.off = d, o.removeListener = d, o.removeAllListeners = d, o.emit = d, o.prependListener = d, o.prependOnceListener = d, o.listeners = function (t) {
    return [];
  }, o.binding = function (t) {
    throw new Error("process.binding is not supported");
  }, o.cwd = function () {
    return "/";
  }, o.chdir = function (t) {
    throw new Error("process.chdir is not supported");
  }, o.umask = function () {
    return 0;
  };
}, function (t, n) {
  t.exports = function (t) {
    return t.webpackPolyfill || (t.deprecate = function () {}, t.paths = [], t.children || (t.children = []), Object.defineProperty(t, "loaded", {
      enumerable: !0,
      get: function () {
        return t.l;
      }
    }), Object.defineProperty(t, "id", {
      enumerable: !0,
      get: function () {
        return t.i;
      }
    }), t.webpackPolyfill = 1), t;
  };
}, function (t, n, r) {
  var e = r(90),
    o = r(91),
    i = r(92),
    u = r(93),
    c = r(94);
  function a(t) {
    var n = -1,
      r = null == t ? 0 : t.length;
    for (this.clear(); ++n < r;) {
      var e = t[n];
      this.set(e[0], e[1]);
    }
  }
  a.prototype.clear = e, a.prototype.delete = o, a.prototype.get = i, a.prototype.has = u, a.prototype.set = c, t.exports = a;
}, function (t, n, r) {
  var e = r(30);
  t.exports = function (t, n) {
    for (var r = t.length; r--;) if (e(t[r][0], n)) return r;
    return -1;
  };
}, function (t, n, r) {
  var e = r(8),
    o = r(5);
  t.exports = function (t) {
    if (!o(t)) return !1;
    var n = e(t);
    return "[object Function]" == n || "[object GeneratorFunction]" == n || "[object AsyncFunction]" == n || "[object Proxy]" == n;
  };
}, function (t, n, r) {
  var e = r(4)(Object, "create");
  t.exports = e;
}, function (t, n, r) {
  var e = r(114);
  t.exports = function (t, n) {
    var r = t.__data__;
    return e(n) ? r["string" == typeof n ? "string" : "hash"] : r.map;
  };
}, function (t, n, r) {
  var e = r(49),
    o = r(50);
  t.exports = function (t, n, r, i) {
    var u = !r;
    r || (r = {});
    for (var c = -1, a = n.length; ++c < a;) {
      var s = n[c],
        f = i ? i(r[s], t[s], s, r, t) : void 0;
      void 0 === f && (f = t[s]), u ? o(r, s, f) : e(r, s, f);
    }
    return r;
  };
}, function (t, n, r) {
  var e = r(120),
    o = r(3),
    i = Object.prototype,
    u = i.hasOwnProperty,
    c = i.propertyIsEnumerable,
    a = e(function () {
      return arguments;
    }()) ? e : function (t) {
      return o(t) && u.call(t, "callee") && !c.call(t, "callee");
    };
  t.exports = a;
}, function (t, n, r) {
  var e = r(122),
    o = r(35),
    i = r(36),
    u = i && i.isTypedArray,
    c = u ? o(u) : e;
  t.exports = c;
}, function (t, n) {
  var r = Object.prototype;
  t.exports = function (t) {
    var n = t && t.constructor;
    return t === ("function" == typeof n && n.prototype || r);
  };
}, function (t, n, r) {
  var e = r(65),
    o = r(150)(e);
  t.exports = o;
}, function (t, n) {
  t.exports = function (t) {
    return t;
  };
}, function (t, n, r) {
  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(154),
    i = r(164),
    u = r(25),
    c = r(0),
    a = r(173);
  t.exports = function (t) {
    return "function" == typeof t ? t : null == t ? u : "object" == e(t) ? c(t) ? i(t[0], t[1]) : o(t) : a(t);
  };
}, function (t, n, r) {
  var e = r(44);
  t.exports = function (t) {
    if ("string" == typeof t || e(t)) return t;
    var n = t + "";
    return "0" == n && 1 / t == -1 / 0 ? "-0" : n;
  };
}, function (t, n, r) {

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(1);
  t.exports = i;
  function i(t) {
    this._isDirected = !o.has(t, "directed") || t.directed, this._isMultigraph = !!o.has(t, "multigraph") && t.multigraph, this._isCompound = !!o.has(t, "compound") && t.compound, this._label = void 0, this._defaultNodeLabelFn = o.constant(void 0), this._defaultEdgeLabelFn = o.constant(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children["\0"] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
  }
  function u(t, n) {
    t[n] ? t[n]++ : t[n] = 1;
  }
  function c(t, n) {
    --t[n] || delete t[n];
  }
  function a(t, n, r, e) {
    var i = "" + n,
      u = "" + r;
    if (!t && i > u) {
      var c = i;
      i = u, u = c;
    }
    return i + "" + u + "" + (o.isUndefined(e) ? "\0" : e);
  }
  function s(t, n, r, e) {
    var o = "" + n,
      i = "" + r;
    if (!t && o > i) {
      var u = o;
      o = i, i = u;
    }
    var c = {
      v: o,
      w: i
    };
    return e && (c.name = e), c;
  }
  function f(t, n) {
    return a(t, n.v, n.w, n.name);
  }
  i.prototype._nodeCount = 0, i.prototype._edgeCount = 0, i.prototype.isDirected = function () {
    return this._isDirected;
  }, i.prototype.isMultigraph = function () {
    return this._isMultigraph;
  }, i.prototype.isCompound = function () {
    return this._isCompound;
  }, i.prototype.setGraph = function (t) {
    return this._label = t, this;
  }, i.prototype.graph = function () {
    return this._label;
  }, i.prototype.setDefaultNodeLabel = function (t) {
    return o.isFunction(t) || (t = o.constant(t)), this._defaultNodeLabelFn = t, this;
  }, i.prototype.nodeCount = function () {
    return this._nodeCount;
  }, i.prototype.nodes = function () {
    return o.keys(this._nodes);
  }, i.prototype.sources = function () {
    var t = this;
    return o.filter(this.nodes(), function (n) {
      return o.isEmpty(t._in[n]);
    });
  }, i.prototype.sinks = function () {
    var t = this;
    return o.filter(this.nodes(), function (n) {
      return o.isEmpty(t._out[n]);
    });
  }, i.prototype.setNodes = function (t, n) {
    var r = arguments,
      e = this;
    return o.each(t, function (t) {
      r.length > 1 ? e.setNode(t, n) : e.setNode(t);
    }), this;
  }, i.prototype.setNode = function (t, n) {
    return o.has(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = n), this) : (this._nodes[t] = arguments.length > 1 ? n : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = "\0", this._children[t] = {}, this._children["\0"][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }, i.prototype.node = function (t) {
    return this._nodes[t];
  }, i.prototype.hasNode = function (t) {
    return o.has(this._nodes, t);
  }, i.prototype.removeNode = function (t) {
    var n = this;
    if (o.has(this._nodes, t)) {
      var r = function (t) {
        n.removeEdge(n._edgeObjs[t]);
      };
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], o.each(this.children(t), function (t) {
        n.setParent(t);
      }), delete this._children[t]), o.each(o.keys(this._in[t]), r), delete this._in[t], delete this._preds[t], o.each(o.keys(this._out[t]), r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }, i.prototype.setParent = function (t, n) {
    if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
    if (o.isUndefined(n)) n = "\0";else {
      for (var r = n += ""; !o.isUndefined(r); r = this.parent(r)) if (r === t) throw new Error("Setting " + n + " as parent of " + t + " would create a cycle");
      this.setNode(n);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = n, this._children[n][t] = !0, this;
  }, i.prototype._removeFromParentsChildList = function (t) {
    delete this._children[this._parent[t]][t];
  }, i.prototype.parent = function (t) {
    if (this._isCompound) {
      var n = this._parent[t];
      if ("\0" !== n) return n;
    }
  }, i.prototype.children = function (t) {
    if (o.isUndefined(t) && (t = "\0"), this._isCompound) {
      var n = this._children[t];
      if (n) return o.keys(n);
    } else {
      if ("\0" === t) return this.nodes();
      if (this.hasNode(t)) return [];
    }
  }, i.prototype.predecessors = function (t) {
    var n = this._preds[t];
    if (n) return o.keys(n);
  }, i.prototype.successors = function (t) {
    var n = this._sucs[t];
    if (n) return o.keys(n);
  }, i.prototype.neighbors = function (t) {
    var n = this.predecessors(t);
    if (n) return o.union(n, this.successors(t));
  }, i.prototype.isLeaf = function (t) {
    return 0 === (this.isDirected() ? this.successors(t) : this.neighbors(t)).length;
  }, i.prototype.filterNodes = function (t) {
    var n = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    n.setGraph(this.graph());
    var r = this;
    o.each(this._nodes, function (r, e) {
      t(e) && n.setNode(e, r);
    }), o.each(this._edgeObjs, function (t) {
      n.hasNode(t.v) && n.hasNode(t.w) && n.setEdge(t, r.edge(t));
    });
    var e = {};
    return this._isCompound && o.each(n.nodes(), function (t) {
      n.setParent(t, function t(o) {
        var i = r.parent(o);
        return void 0 === i || n.hasNode(i) ? (e[o] = i, i) : i in e ? e[i] : t(i);
      }(t));
    }), n;
  }, i.prototype.setDefaultEdgeLabel = function (t) {
    return o.isFunction(t) || (t = o.constant(t)), this._defaultEdgeLabelFn = t, this;
  }, i.prototype.edgeCount = function () {
    return this._edgeCount;
  }, i.prototype.edges = function () {
    return o.values(this._edgeObjs);
  }, i.prototype.setPath = function (t, n) {
    var r = this,
      e = arguments;
    return o.reduce(t, function (t, o) {
      return e.length > 1 ? r.setEdge(t, o, n) : r.setEdge(t, o), o;
    }), this;
  }, i.prototype.setEdge = function () {
    var t,
      n,
      r,
      i,
      c = !1,
      f = arguments[0];
    "object" === e(f) && null !== f && "v" in f ? (t = f.v, n = f.w, r = f.name, 2 === arguments.length && (i = arguments[1], c = !0)) : (t = f, n = arguments[1], r = arguments[3], arguments.length > 2 && (i = arguments[2], c = !0)), t = "" + t, n = "" + n, o.isUndefined(r) || (r = "" + r);
    var l = a(this._isDirected, t, n, r);
    if (o.has(this._edgeLabels, l)) return c && (this._edgeLabels[l] = i), this;
    if (!o.isUndefined(r) && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(n), this._edgeLabels[l] = c ? i : this._defaultEdgeLabelFn(t, n, r);
    var p = s(this._isDirected, t, n, r);
    return t = p.v, n = p.w, Object.freeze(p), this._edgeObjs[l] = p, u(this._preds[n], t), u(this._sucs[t], n), this._in[n][l] = p, this._out[t][l] = p, this._edgeCount++, this;
  }, i.prototype.edge = function (t, n, r) {
    var e = 1 === arguments.length ? f(this._isDirected, arguments[0]) : a(this._isDirected, t, n, r);
    return this._edgeLabels[e];
  }, i.prototype.hasEdge = function (t, n, r) {
    var e = 1 === arguments.length ? f(this._isDirected, arguments[0]) : a(this._isDirected, t, n, r);
    return o.has(this._edgeLabels, e);
  }, i.prototype.removeEdge = function (t, n, r) {
    var e = 1 === arguments.length ? f(this._isDirected, arguments[0]) : a(this._isDirected, t, n, r),
      o = this._edgeObjs[e];
    return o && (t = o.v, n = o.w, delete this._edgeLabels[e], delete this._edgeObjs[e], c(this._preds[n], t), c(this._sucs[t], n), delete this._in[n][e], delete this._out[t][e], this._edgeCount--), this;
  }, i.prototype.inEdges = function (t, n) {
    var r = this._in[t];
    if (r) {
      var e = o.values(r);
      return n ? o.filter(e, function (t) {
        return t.v === n;
      }) : e;
    }
  }, i.prototype.outEdges = function (t, n) {
    var r = this._out[t];
    if (r) {
      var e = o.values(r);
      return n ? o.filter(e, function (t) {
        return t.w === n;
      }) : e;
    }
  }, i.prototype.nodeEdges = function (t, n) {
    var r = this.inEdges(t, n);
    if (r) return r.concat(this.outEdges(t, n));
  };
}, function (t, n, r) {
  var e = r(15),
    o = r(95),
    i = r(96),
    u = r(97),
    c = r(98),
    a = r(99);
  function s(t) {
    var n = this.__data__ = new e(t);
    this.size = n.size;
  }
  s.prototype.clear = o, s.prototype.delete = i, s.prototype.get = u, s.prototype.has = c, s.prototype.set = a, t.exports = s;
}, function (t, n) {
  t.exports = function (t, n) {
    return t === n || t != t && n != n;
  };
}, function (t, n, r) {
  var e = r(4)(r(2), "Map");
  t.exports = e;
}, function (t, n, r) {
  var e = r(106),
    o = r(113),
    i = r(115),
    u = r(116),
    c = r(117);
  function a(t) {
    var n = -1,
      r = null == t ? 0 : t.length;
    for (this.clear(); ++n < r;) {
      var e = t[n];
      this.set(e[0], e[1]);
    }
  }
  a.prototype.clear = e, a.prototype.delete = o, a.prototype.get = i, a.prototype.has = u, a.prototype.set = c, t.exports = a;
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = null == t ? 0 : t.length; ++r < e && !1 !== n(t[r], r, t););
    return t;
  };
}, function (t, n) {
  t.exports = function (t) {
    return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
  };
}, function (t, n) {
  t.exports = function (t) {
    return function (n) {
      return t(n);
    };
  };
}, function (t, n, r) {
  (function (t) {
    function e(t) {
      return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    var o = r(47),
      i = "object" == e(n) && n && !n.nodeType && n,
      u = i && "object" == e(t) && t && !t.nodeType && t,
      c = u && u.exports === i && o.process,
      a = function () {
        try {
          var t = u && u.require && u.require("util").types;
          return t || c && c.binding && c.binding("util");
        } catch (t) {}
      }();
    t.exports = a;
  }).call(this, r(14)(t));
}, function (t, n, r) {
  var e = r(23),
    o = r(123),
    i = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    if (!e(t)) return o(t);
    var n = [];
    for (var r in Object(t)) i.call(t, r) && "constructor" != r && n.push(r);
    return n;
  };
}, function (t, n, r) {
  var e = r(56),
    o = r(57),
    i = Object.prototype.propertyIsEnumerable,
    u = Object.getOwnPropertySymbols,
    c = u ? function (t) {
      return null == t ? [] : (t = Object(t), e(u(t), function (n) {
        return i.call(t, n);
      }));
    } : o;
  t.exports = c;
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = n.length, o = t.length; ++r < e;) t[o + r] = n[r];
    return t;
  };
}, function (t, n, r) {
  var e = r(54)(Object.getPrototypeOf, Object);
  t.exports = e;
}, function (t, n, r) {
  var e = r(62);
  t.exports = function (t) {
    var n = new t.constructor(t.byteLength);
    return new e(n).set(new e(t)), n;
  };
}, function (t, n) {
  t.exports = function (t) {
    var n = -1,
      r = Array(t.size);
    return t.forEach(function (t) {
      r[++n] = t;
    }), r;
  };
}, function (t, n, r) {
  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(0),
    i = r(44),
    u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    c = /^\w*$/;
  t.exports = function (t, n) {
    if (o(t)) return !1;
    var r = e(t);
    return !("number" != r && "symbol" != r && "boolean" != r && null != t && !i(t)) || c.test(t) || !u.test(t) || null != n && t in Object(n);
  };
}, function (t, n, r) {
  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(8),
    i = r(3);
  t.exports = function (t) {
    return "symbol" == e(t) || i(t) && "[object Symbol]" == o(t);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = null == t ? 0 : t.length, o = Array(e); ++r < e;) o[r] = n(t[r], r, t);
    return o;
  };
}, function (t, n) {
  (function (n) {
    t.exports = n;
  }).call(this, {});
}, function (t, n, r) {
  (function (n) {
    function r(t) {
      return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    var e = "object" == (void 0 === n ? "undefined" : r(n)) && n && n.Object === Object && n;
    t.exports = e;
  }).call(this, r(11));
}, function (t, n) {
  var r = Function.prototype.toString;
  t.exports = function (t) {
    if (null != t) {
      try {
        return r.call(t);
      } catch (t) {}
      try {
        return t + "";
      } catch (t) {}
    }
    return "";
  };
}, function (t, n, r) {
  var e = r(50),
    o = r(30),
    i = Object.prototype.hasOwnProperty;
  t.exports = function (t, n, r) {
    var u = t[n];
    i.call(t, n) && o(u, r) && (void 0 !== r || n in t) || e(t, n, r);
  };
}, function (t, n, r) {
  var e = r(51);
  t.exports = function (t, n, r) {
    "__proto__" == n && e ? e(t, n, {
      configurable: !0,
      enumerable: !0,
      value: r,
      writable: !0
    }) : t[n] = r;
  };
}, function (t, n, r) {
  var e = r(4),
    o = function () {
      try {
        var t = e(Object, "defineProperty");
        return t({}, "", {}), t;
      } catch (t) {}
    }();
  t.exports = o;
}, function (t, n, r) {
  var e = r(119),
    o = r(21),
    i = r(0),
    u = r(12),
    c = r(53),
    a = r(22),
    s = Object.prototype.hasOwnProperty;
  t.exports = function (t, n) {
    var r = i(t),
      f = !r && o(t),
      l = !r && !f && u(t),
      p = !r && !f && !l && a(t),
      h = r || f || l || p,
      v = h ? e(t.length, String) : [],
      d = v.length;
    for (var y in t) !n && !s.call(t, y) || h && ("length" == y || l && ("offset" == y || "parent" == y) || p && ("buffer" == y || "byteLength" == y || "byteOffset" == y) || c(y, d)) || v.push(y);
    return v;
  };
}, function (t, n) {
  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var e = /^(?:0|[1-9]\d*)$/;
  t.exports = function (t, n) {
    var o = r(t);
    return !!(n = null == n ? 9007199254740991 : n) && ("number" == o || "symbol" != o && e.test(t)) && t > -1 && t % 1 == 0 && t < n;
  };
}, function (t, n) {
  t.exports = function (t, n) {
    return function (r) {
      return t(n(r));
    };
  };
}, function (t, n, r) {
  var e = r(52),
    o = r(125),
    i = r(7);
  t.exports = function (t) {
    return i(t) ? e(t, !0) : o(t);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = null == t ? 0 : t.length, o = 0, i = []; ++r < e;) {
      var u = t[r];
      n(u, r, t) && (i[o++] = u);
    }
    return i;
  };
}, function (t, n) {
  t.exports = function () {
    return [];
  };
}, function (t, n, r) {
  var e = r(39),
    o = r(40),
    i = r(38),
    u = r(57),
    c = Object.getOwnPropertySymbols ? function (t) {
      for (var n = []; t;) e(n, i(t)), t = o(t);
      return n;
    } : u;
  t.exports = c;
}, function (t, n, r) {
  var e = r(60),
    o = r(38),
    i = r(6);
  t.exports = function (t) {
    return e(t, i, o);
  };
}, function (t, n, r) {
  var e = r(39),
    o = r(0);
  t.exports = function (t, n, r) {
    var i = n(t);
    return o(t) ? i : e(i, r(t));
  };
}, function (t, n, r) {
  var e = r(4)(r(2), "Set");
  t.exports = e;
}, function (t, n, r) {
  var e = r(2).Uint8Array;
  t.exports = e;
}, function (t, n, r) {
  var e = r(5),
    o = Object.create,
    i = function () {
      function t() {}
      return function (n) {
        if (!e(n)) return {};
        if (o) return o(n);
        t.prototype = n;
        var r = new t();
        return t.prototype = void 0, r;
      };
    }();
  t.exports = i;
}, function (t, n) {
  t.exports = function (t) {
    return function () {
      return t;
    };
  };
}, function (t, n, r) {
  var e = r(148),
    o = r(6);
  t.exports = function (t, n) {
    return t && e(t, n, o);
  };
}, function (t, n, r) {
  var e = r(156),
    o = r(3);
  t.exports = function t(n, r, i, u, c) {
    return n === r || (null == n || null == r || !o(n) && !o(r) ? n != n && r != r : e(n, r, i, u, t, c));
  };
}, function (t, n, r) {
  var e = r(68),
    o = r(159),
    i = r(69);
  t.exports = function (t, n, r, u, c, a) {
    var s = 1 & r,
      f = t.length,
      l = n.length;
    if (f != l && !(s && l > f)) return !1;
    var p = a.get(t);
    if (p && a.get(n)) return p == n;
    var h = -1,
      v = !0,
      d = 2 & r ? new e() : void 0;
    for (a.set(t, n), a.set(n, t); ++h < f;) {
      var y = t[h],
        _ = n[h];
      if (u) var g = s ? u(_, y, h, n, t, a) : u(y, _, h, t, n, a);
      if (void 0 !== g) {
        if (g) continue;
        v = !1;
        break;
      }
      if (d) {
        if (!o(n, function (t, n) {
          if (!i(d, n) && (y === t || c(y, t, r, u, a))) return d.push(n);
        })) {
          v = !1;
          break;
        }
      } else if (y !== _ && !c(y, _, r, u, a)) {
        v = !1;
        break;
      }
    }
    return a.delete(t), a.delete(n), v;
  };
}, function (t, n, r) {
  var e = r(32),
    o = r(157),
    i = r(158);
  function u(t) {
    var n = -1,
      r = null == t ? 0 : t.length;
    for (this.__data__ = new e(); ++n < r;) this.add(t[n]);
  }
  u.prototype.add = u.prototype.push = o, u.prototype.has = i, t.exports = u;
}, function (t, n) {
  t.exports = function (t, n) {
    return t.has(n);
  };
}, function (t, n, r) {
  var e = r(5);
  t.exports = function (t) {
    return t == t && !e(t);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    return function (r) {
      return null != r && r[t] === n && (void 0 !== n || t in Object(r));
    };
  };
}, function (t, n, r) {
  var e = r(73),
    o = r(27);
  t.exports = function (t, n) {
    for (var r = 0, i = (n = e(n, t)).length; null != t && r < i;) t = t[o(n[r++])];
    return r && r == i ? t : void 0;
  };
}, function (t, n, r) {
  var e = r(0),
    o = r(43),
    i = r(166),
    u = r(169);
  t.exports = function (t, n) {
    return e(t) ? t : o(t, n) ? [t] : i(u(t));
  };
}, function (t, n, r) {
  var e = r(73),
    o = r(21),
    i = r(0),
    u = r(53),
    c = r(34),
    a = r(27);
  t.exports = function (t, n, r) {
    for (var s = -1, f = (n = e(n, t)).length, l = !1; ++s < f;) {
      var p = a(n[s]);
      if (!(l = null != t && r(t, p))) break;
      t = t[p];
    }
    return l || ++s != f ? l : !!(f = null == t ? 0 : t.length) && c(f) && u(p, f) && (i(t) || o(t));
  };
}, function (t, n) {
  t.exports = function (t) {
    return function (n) {
      return null == n ? void 0 : n[t];
    };
  };
}, function (t, n, r) {
  var e = r(1),
    o = r(77);
  t.exports = function (t, n, r, e) {
    return function (t, n, r, e) {
      var i,
        u,
        c = {},
        a = new o(),
        s = function (t) {
          var n = t.v !== i ? t.v : t.w,
            e = c[n],
            o = r(t),
            s = u.distance + o;
          if (o < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + t + " Weight: " + o);
          s < e.distance && (e.distance = s, e.predecessor = i, a.decrease(n, s));
        };
      t.nodes().forEach(function (t) {
        var r = t === n ? 0 : Number.POSITIVE_INFINITY;
        c[t] = {
          distance: r
        }, a.add(t, r);
      });
      for (; a.size() > 0 && (i = a.removeMin(), (u = c[i]).distance !== Number.POSITIVE_INFINITY);) e(i).forEach(s);
      return c;
    }(t, String(n), r || i, e || function (n) {
      return t.outEdges(n);
    });
  };
  var i = e.constant(1);
}, function (t, n, r) {
  var e = r(1);
  function o() {
    this._arr = [], this._keyIndices = {};
  }
  t.exports = o, o.prototype.size = function () {
    return this._arr.length;
  }, o.prototype.keys = function () {
    return this._arr.map(function (t) {
      return t.key;
    });
  }, o.prototype.has = function (t) {
    return e.has(this._keyIndices, t);
  }, o.prototype.priority = function (t) {
    var n = this._keyIndices[t];
    if (void 0 !== n) return this._arr[n].priority;
  }, o.prototype.min = function () {
    if (0 === this.size()) throw new Error("Queue underflow");
    return this._arr[0].key;
  }, o.prototype.add = function (t, n) {
    var r = this._keyIndices;
    if (t = String(t), !e.has(r, t)) {
      var o = this._arr,
        i = o.length;
      return r[t] = i, o.push({
        key: t,
        priority: n
      }), this._decrease(i), !0;
    }
    return !1;
  }, o.prototype.removeMin = function () {
    this._swap(0, this._arr.length - 1);
    var t = this._arr.pop();
    return delete this._keyIndices[t.key], this._heapify(0), t.key;
  }, o.prototype.decrease = function (t, n) {
    var r = this._keyIndices[t];
    if (n > this._arr[r].priority) throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[r].priority + " New: " + n);
    this._arr[r].priority = n, this._decrease(r);
  }, o.prototype._heapify = function (t) {
    var n = this._arr,
      r = 2 * t,
      e = r + 1,
      o = t;
    r < n.length && (o = n[r].priority < n[o].priority ? r : o, e < n.length && (o = n[e].priority < n[o].priority ? e : o), o !== t && (this._swap(t, o), this._heapify(o)));
  }, o.prototype._decrease = function (t) {
    for (var n, r = this._arr, e = r[t].priority; 0 !== t && !(r[n = t >> 1].priority < e);) this._swap(t, n), t = n;
  }, o.prototype._swap = function (t, n) {
    var r = this._arr,
      e = this._keyIndices,
      o = r[t],
      i = r[n];
    r[t] = i, r[n] = o, e[i.key] = t, e[o.key] = n;
  };
}, function (t, n, r) {
  var e = r(1);
  t.exports = function (t) {
    var n = 0,
      r = [],
      o = {},
      i = [];
    return t.nodes().forEach(function (u) {
      e.has(o, u) || function u(c) {
        var a = o[c] = {
          onStack: !0,
          lowlink: n,
          index: n++
        };
        if (r.push(c), t.successors(c).forEach(function (t) {
          e.has(o, t) ? o[t].onStack && (a.lowlink = Math.min(a.lowlink, o[t].index)) : (u(t), a.lowlink = Math.min(a.lowlink, o[t].lowlink));
        }), a.lowlink === a.index) {
          var s,
            f = [];
          do {
            s = r.pop(), o[s].onStack = !1, f.push(s);
          } while (c !== s);
          i.push(f);
        }
      }(u);
    }), i;
  };
}, function (t, n, r) {
  var e = r(1);
  function o(t) {
    var n = {},
      r = {},
      o = [];
    if (e.each(t.sinks(), function u(c) {
      if (e.has(r, c)) throw new i();
      e.has(n, c) || (r[c] = !0, n[c] = !0, e.each(t.predecessors(c), u), delete r[c], o.push(c));
    }), e.size(n) !== t.nodeCount()) throw new i();
    return o;
  }
  function i() {}
  t.exports = o, o.CycleException = i, i.prototype = new Error();
}, function (t, n, r) {
  var e = r(1);
  t.exports = function (t, n, r) {
    e.isArray(n) || (n = [n]);
    var o = (t.isDirected() ? t.successors : t.neighbors).bind(t),
      i = [],
      u = {};
    return e.each(n, function (n) {
      if (!t.hasNode(n)) throw new Error("Graph does not have node: " + n);
      !function t(n, r, o, i, u, c) {
        e.has(i, r) || (i[r] = !0, o || c.push(r), e.each(u(r), function (r) {
          t(n, r, o, i, u, c);
        }), o && c.push(r));
      }(t, n, "post" === r, u, o, i);
    }), i;
  };
}, function (t, n, r) {

  (function (n) {
    var e = r(226),
      o = ["delete", "get", "head", "patch", "post", "put"];
    t.exports.load = function (t, r, i) {
      var u,
        c,
        a = r.method ? r.method.toLowerCase() : "get";
      function s(t, r) {
        t ? i(t) : ("[object process]" === Object.prototype.toString.call(void 0 !== n ? n : 0) && "function" == typeof r.buffer && r.buffer(!0), r.end(function (t, n) {
          t ? i(t) : i(void 0, n);
        }));
      }
      if (void 0 !== r.method ? "string" != typeof r.method ? u = new TypeError("options.method must be a string") : -1 === o.indexOf(r.method) && (u = new TypeError("options.method must be one of the following: " + o.slice(0, o.length - 1).join(", ") + " or " + o[o.length - 1])) : void 0 !== r.prepareRequest && "function" != typeof r.prepareRequest && (u = new TypeError("options.prepareRequest must be a function")), u) i(u);else if (c = e["delete" === a ? "del" : a](t), r.prepareRequest) try {
        r.prepareRequest(c, s);
      } catch (t) {
        i(t);
      } else s(void 0, c);
    };
  }).call(this, r(13));
}, function (t, n, r) {

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  t.exports = function (t) {
    return null !== t && "object" === e(t);
  };
}, function (t, n, r) {
  (function (e, o) {
    var i, u, c, a;
    function s(t) {
      return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    /*! Native Promise Only
        v0.8.1 (c) Kyle Simpson
        MIT License: http://getify.mit-license.org
    */
    a = function () {

      var t,
        n,
        r,
        e = Object.prototype.toString,
        i = void 0 !== o ? function (t) {
          return o(t);
        } : setTimeout;
      try {
        Object.defineProperty({}, "x", {}), t = function (t, n, r, e) {
          return Object.defineProperty(t, n, {
            value: r,
            writable: !0,
            configurable: !1 !== e
          });
        };
      } catch (n) {
        t = function (t, n, r) {
          return t[n] = r, t;
        };
      }
      function u(t, e) {
        r.add(t, e), n || (n = i(r.drain));
      }
      function c(t) {
        var n,
          r = s(t);
        return null == t || "object" != r && "function" != r || (n = t.then), "function" == typeof n && n;
      }
      function a() {
        for (var t = 0; t < this.chain.length; t++) f(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);
        this.chain.length = 0;
      }
      function f(t, n, r) {
        var e, o;
        try {
          !1 === n ? r.reject(t.msg) : (e = !0 === n ? t.msg : n.call(void 0, t.msg)) === r.promise ? r.reject(TypeError("Promise-chain cycle")) : (o = c(e)) ? o.call(e, r.resolve, r.reject) : r.resolve(e);
        } catch (t) {
          r.reject(t);
        }
      }
      function l(t) {
        var n,
          r = this;
        if (!r.triggered) {
          r.triggered = !0, r.def && (r = r.def);
          try {
            (n = c(t)) ? u(function () {
              var e = new v(r);
              try {
                n.call(t, function () {
                  l.apply(e, arguments);
                }, function () {
                  p.apply(e, arguments);
                });
              } catch (t) {
                p.call(e, t);
              }
            }) : (r.msg = t, r.state = 1, r.chain.length > 0 && u(a, r));
          } catch (t) {
            p.call(new v(r), t);
          }
        }
      }
      function p(t) {
        var n = this;
        n.triggered || (n.triggered = !0, n.def && (n = n.def), n.msg = t, n.state = 2, n.chain.length > 0 && u(a, n));
      }
      function h(t, n, r, e) {
        for (var o = 0; o < n.length; o++) !function (o) {
          t.resolve(n[o]).then(function (t) {
            r(o, t);
          }, e);
        }(o);
      }
      function v(t) {
        this.def = t, this.triggered = !1;
      }
      function d(t) {
        this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0;
      }
      function y(t) {
        if ("function" != typeof t) throw TypeError("Not a function");
        if (0 !== this.__NPO__) throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var n = new d(this);
        this.then = function (t, r) {
          var e = {
            success: "function" != typeof t || t,
            failure: "function" == typeof r && r
          };
          return e.promise = new this.constructor(function (t, n) {
            if ("function" != typeof t || "function" != typeof n) throw TypeError("Not a function");
            e.resolve = t, e.reject = n;
          }), n.chain.push(e), 0 !== n.state && u(a, n), e.promise;
        }, this.catch = function (t) {
          return this.then(void 0, t);
        };
        try {
          t.call(void 0, function (t) {
            l.call(n, t);
          }, function (t) {
            p.call(n, t);
          });
        } catch (t) {
          p.call(n, t);
        }
      }
      r = function () {
        var t, r, e;
        function o(t, n) {
          this.fn = t, this.self = n, this.next = void 0;
        }
        return {
          add: function (n, i) {
            e = new o(n, i), r ? r.next = e : t = e, r = e, e = void 0;
          },
          drain: function () {
            var e = t;
            for (t = r = n = void 0; e;) e.fn.call(e.self), e = e.next;
          }
        };
      }();
      var _ = t({}, "constructor", y, !1);
      return y.prototype = _, t(_, "__NPO__", 0, !1), t(y, "resolve", function (t) {
        return t && "object" == s(t) && 1 === t.__NPO__ ? t : new this(function (n, r) {
          if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");
          n(t);
        });
      }), t(y, "reject", function (t) {
        return new this(function (n, r) {
          if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");
          r(t);
        });
      }), t(y, "all", function (t) {
        var n = this;
        return "[object Array]" != e.call(t) ? n.reject(TypeError("Not an array")) : 0 === t.length ? n.resolve([]) : new n(function (r, e) {
          if ("function" != typeof r || "function" != typeof e) throw TypeError("Not a function");
          var o = t.length,
            i = Array(o),
            u = 0;
          h(n, t, function (t, n) {
            i[t] = n, ++u === o && r(i);
          }, e);
        });
      }), t(y, "race", function (t) {
        var n = this;
        return "[object Array]" != e.call(t) ? n.reject(TypeError("Not an array")) : new n(function (r, e) {
          if ("function" != typeof r || "function" != typeof e) throw TypeError("Not a function");
          h(n, t, function (t, n) {
            r(n);
          }, e);
        });
      }), y;
    }, (c = void 0 !== e ? e : this)[u = "Promise"] = c[u] || a(), t.exports ? t.exports = c[u] : void 0 === (i = function () {
      return c[u];
    }.call(n, r, n, t)) || (t.exports = i);
  }).call(this, r(11), r(232).setImmediate);
}, function (t, n, r) {

  (function (n) {
    var e = r(85),
      o = r(86),
      i = r(223),
      u = r(224),
      c = r(234),
      a = r(237),
      s = r(238),
      f = /~(?:[^01]|$)/g,
      l = {},
      p = ["relative", "remote"],
      h = ["absolute", "uri"],
      v = {};
    function d(t, n) {
      e.isString(t) && (t = a(t)), e.isString(n) && (n = a(n));
      var r,
        o,
        u = S(e.isUndefined(n) ? "" : n);
      return h.indexOf(u.reference) > -1 ? o = u : (r = e.isUndefined(t) ? void 0 : S(t), e.isUndefined(r) ? o = u : ((o = r).path = a(i.join(r.path, u.path)), o.query = function (t, n) {
        var r = {};
        function o(t) {
          e.forOwn(t, function (t, n) {
            r[n] = t;
          });
        }
        return o(c.parse(t || "")), o(c.parse(n || "")), 0 === Object.keys(r).length ? void 0 : c.stringify(r);
      }(r.query, u.query))), o.fragment = void 0, (-1 === h.indexOf(o.reference) && 0 === o.path.indexOf("../") ? "../" : "") + s.serialize(o);
    }
    function y(t) {
      return p.indexOf(m(t)) > -1;
    }
    function _(t) {
      return e.isUndefined(t.error) && "invalid" !== t.type;
    }
    function g(t, n) {
      var r = t;
      return n.forEach(function (t) {
        if (!(t in r)) throw Error("JSON Pointer points to missing location: " + D(n));
        r = r[t];
      }), r;
    }
    function b(t) {
      return Object.keys(t).filter(function (t) {
        return "$ref" !== t;
      });
    }
    function m(t) {
      var n;
      switch (t.uriDetails.reference) {
        case "absolute":
        case "uri":
          n = "remote";
          break;
        case "same-document":
          n = "local";
          break;
        default:
          n = t.uriDetails.reference;
      }
      return n;
    }
    function w(t, n) {
      var r = l[t],
        o = Promise.resolve(),
        i = e.cloneDeep(n.loaderOptions || {});
      return e.isUndefined(r) ? (e.isUndefined(i.processContent) && (i.processContent = function (t, n) {
        n(void 0, JSON.parse(t.text));
      }), o = (o = u.load(decodeURI(t), i)).then(function (n) {
        return l[t] = {
          value: n
        }, n;
      }).catch(function (n) {
        throw l[t] = {
          error: n
        }, n;
      })) : o = o.then(function () {
        if (e.isError(r.error)) throw r.error;
        return r.value;
      }), o = o.then(function (t) {
        return e.cloneDeep(t);
      });
    }
    function x(t, n) {
      var r = !0;
      try {
        if (!e.isPlainObject(t)) throw new Error("obj is not an Object");
        if (!e.isString(t.$ref)) throw new Error("obj.$ref is not a String");
      } catch (t) {
        if (n) throw t;
        r = !1;
      }
      return r;
    }
    function j(t) {
      return -1 !== t.indexOf("://") || i.isAbsolute(t) ? t : i.resolve(n.cwd(), t);
    }
    function E(t, n) {
      t.error = n.message, t.missing = !0;
    }
    function S(t) {
      return s.parse(t);
    }
    function O(t, n, r) {
      g(t, n.slice(0, n.length - 1))[n[n.length - 1]] = r;
    }
    function A(t, n) {
      var r, o;
      if (t = e.isUndefined(t) ? {} : e.cloneDeep(t), !e.isObject(t)) throw new TypeError("options must be an Object");
      if (!e.isUndefined(t.resolveCirculars) && !e.isBoolean(t.resolveCirculars)) throw new TypeError("options.resolveCirculars must be a Boolean");
      if (!(e.isUndefined(t.filter) || e.isArray(t.filter) || e.isFunction(t.filter) || e.isString(t.filter))) throw new TypeError("options.filter must be an Array, a Function of a String");
      if (!e.isUndefined(t.includeInvalid) && !e.isBoolean(t.includeInvalid)) throw new TypeError("options.includeInvalid must be a Boolean");
      if (!e.isUndefined(t.location) && !e.isString(t.location)) throw new TypeError("options.location must be a String");
      if (!e.isUndefined(t.refPreProcessor) && !e.isFunction(t.refPreProcessor)) throw new TypeError("options.refPreProcessor must be a Function");
      if (!e.isUndefined(t.refPostProcessor) && !e.isFunction(t.refPostProcessor)) throw new TypeError("options.refPostProcessor must be a Function");
      if (!e.isUndefined(t.subDocPath) && !e.isArray(t.subDocPath) && !k(t.subDocPath)) throw new TypeError("options.subDocPath must be an Array of path segments or a valid JSON Pointer");
      if (e.isUndefined(t.resolveCirculars) && (t.resolveCirculars = !1), t.filter = function (t) {
        var n, r;
        return e.isArray(t.filter) || e.isString(t.filter) ? (r = e.isString(t.filter) ? [t.filter] : t.filter, n = function (t) {
          return r.indexOf(t.type) > -1 || r.indexOf(m(t)) > -1;
        }) : e.isFunction(t.filter) ? n = t.filter : e.isUndefined(t.filter) && (n = function () {
          return !0;
        }), function (r, e) {
          return ("invalid" !== r.type || !0 === t.includeInvalid) && n(r, e);
        };
      }(t), e.isUndefined(t.location) && (t.location = j("./root.json")), (r = t.location.split("#")).length > 1 && (t.subDocPath = "#" + r[1]), o = decodeURI(t.location) === t.location, t.location = d(t.location, void 0), o && (t.location = decodeURI(t.location)), t.subDocPath = function (t) {
        var n;
        return e.isArray(t.subDocPath) ? n = t.subDocPath : e.isString(t.subDocPath) ? n = R(t.subDocPath) : e.isUndefined(t.subDocPath) && (n = []), n;
      }(t), !e.isUndefined(n)) try {
        g(n, t.subDocPath);
      } catch (t) {
        throw t.message = t.message.replace("JSON Pointer", "options.subDocPath"), t;
      }
      return t;
    }
    function T(t) {
      if (!e.isArray(t)) throw new TypeError("path must be an array");
      return t.map(function (t) {
        return e.isString(t) || (t = JSON.stringify(t)), t.replace(/~1/g, "/").replace(/~0/g, "~");
      });
    }
    function C(t) {
      if (!e.isArray(t)) throw new TypeError("path must be an array");
      return t.map(function (t) {
        return e.isString(t) || (t = JSON.stringify(t)), t.replace(/~/g, "~0").replace(/\//g, "~1");
      });
    }
    function I(t, n) {
      var r = {};
      if (!e.isArray(t) && !e.isObject(t)) throw new TypeError("obj must be an Array or an Object");
      return function t(n, r, o, i) {
        var u = !0;
        function c(r, e) {
          o.push(e), t(n, r, o, i), o.pop();
        }
        e.isFunction(i) && (u = i(n, r, o)), -1 === n.indexOf(r) && (n.push(r), !1 !== u && (e.isArray(r) ? r.forEach(function (t, n) {
          c(t, n.toString());
        }) : e.isObject(r) && e.forOwn(r, function (t, n) {
          c(t, n);
        })), n.pop());
      }(function (t, n) {
        var r,
          e = [];
        return n.length > 0 && (r = t, n.slice(0, n.length - 1).forEach(function (t) {
          t in r && (r = r[t], e.push(r));
        })), e;
      }(t, (n = A(n, t)).subDocPath), g(t, n.subDocPath), e.cloneDeep(n.subDocPath), function (t, o, i) {
        var u,
          c,
          a = !0;
        return x(o) && (e.isUndefined(n.refPreProcessor) || (o = n.refPreProcessor(e.cloneDeep(o), i)), u = P(o), e.isUndefined(n.refPostProcessor) || (u = n.refPostProcessor(u, i)), n.filter(u, i) && (c = D(i), r[c] = u), b(o).length > 0 && (a = !1)), a;
      }), r;
    }
    function P(t) {
      var n,
        r,
        o,
        i = {
          def: t
        };
      try {
        if (x(t, !0), n = t.$ref, o = v[n], e.isUndefined(o) && (o = v[n] = S(n)), i.uri = n, i.uriDetails = o, e.isUndefined(o.error)) {
          i.type = m(i);
          try {
            ["#", "/"].indexOf(n[0]) > -1 ? k(n, !0) : n.indexOf("#") > -1 && k(o.fragment, !0);
          } catch (t) {
            i.error = t.message, i.type = "invalid";
          }
        } else i.error = i.uriDetails.error, i.type = "invalid";
        (r = b(t)).length > 0 && (i.warning = "Extra JSON Reference properties will be ignored: " + r.join(", "));
      } catch (t) {
        i.error = t.message, i.type = "invalid";
      }
      return i;
    }
    function k(t, n) {
      var r,
        o = !0;
      try {
        if (!e.isString(t)) throw new Error("ptr is not a String");
        if ("" !== t) {
          if (r = t.charAt(0), -1 === ["#", "/"].indexOf(r)) throw new Error("ptr must start with a / or #/");
          if ("#" === r && "#" !== t && "/" !== t.charAt(1)) throw new Error("ptr must start with a / or #/");
          if (t.match(f)) throw new Error("ptr has invalid token(s)");
        }
      } catch (t) {
        if (!0 === n) throw t;
        o = !1;
      }
      return o;
    }
    function R(t) {
      try {
        k(t, !0);
      } catch (t) {
        throw new Error("ptr must be a JSON Pointer: " + t.message);
      }
      var n = t.split("/");
      return n.shift(), T(n);
    }
    function D(t, n) {
      if (!e.isArray(t)) throw new Error("path must be an Array");
      return (!1 !== n ? "#" : "") + (t.length > 0 ? "/" : "") + C(t).join("/");
    }
    function U(t, n) {
      var r = Promise.resolve();
      return r = r.then(function () {
        if (!e.isArray(t) && !e.isObject(t)) throw new TypeError("obj must be an Array or an Object");
        n = A(n, t), t = e.cloneDeep(t);
      }).then(function () {
        var r = {
          deps: {},
          docs: {},
          refs: {}
        };
        return function t(n, r, o) {
          var u,
            c,
            a = Promise.resolve(),
            s = D(r.subDocPath),
            f = j(r.location),
            l = i.dirname(r.location),
            p = f + s;
          return e.isUndefined(o.docs[f]) && (o.docs[f] = n), e.isUndefined(o.deps[p]) && (o.deps[p] = {}, u = I(n, r), e.forOwn(u, function (i, u) {
            var f,
              h,
              v = j(r.location) + u,
              g = i.refdId = decodeURI(j(y(i) ? d(l, i.uri) : r.location) + "#" + (i.uri.indexOf("#") > -1 ? i.uri.split("#")[1] : ""));
            (o.refs[v] = i, _(i)) && (i.fqURI = g, o.deps[p][u === s ? "#" : u.replace(s + "/", "#/")] = g, 0 !== v.indexOf(g + "/") && v !== g ? ((c = e.cloneDeep(r)).subDocPath = e.isUndefined(i.uriDetails.fragment) ? [] : R(decodeURI(i.uriDetails.fragment)), y(i) ? (delete c.filter, c.location = g.split("#")[0], a = a.then((f = o, h = c, function () {
              var t = j(h.location),
                n = f.docs[t];
              return e.isUndefined(n) ? w(t, h).catch(function (n) {
                return f.docs[t] = n, n;
              }) : Promise.resolve().then(function () {
                return n;
              });
            }))) : a = a.then(function () {
              return n;
            }), a = a.then(function (n, r, o) {
              return function (i) {
                if (e.isError(i)) E(o, i);else try {
                  return t(i, r, n).catch(function (t) {
                    E(o, t);
                  });
                } catch (t) {
                  E(o, t);
                }
              };
            }(o, c, i))) : i.circular = !0);
          })), a;
        }(t, n, r).then(function () {
          return r;
        });
      }).then(function (t) {
        var r = {},
          u = [],
          c = [],
          a = new o.Graph(),
          s = j(n.location),
          f = s + D(n.subDocPath),
          l = i.dirname(s);
        return Object.keys(t.deps).forEach(function (t) {
          a.setNode(t);
        }), e.forOwn(t.deps, function (t, n) {
          e.forOwn(t, function (t) {
            a.setEdge(n, t);
          });
        }), (u = o.alg.findCycles(a)).forEach(function (t) {
          t.forEach(function (t) {
            -1 === c.indexOf(t) && c.push(t);
          });
        }), e.forOwn(t.deps, function (n, r) {
          e.forOwn(n, function (n, e) {
            var o,
              i = !1,
              a = r + e.slice(1),
              s = t.refs[r + e.slice(1)],
              f = y(s);
            c.indexOf(n) > -1 && u.forEach(function (t) {
              i || (o = t.indexOf(n)) > -1 && t.forEach(function (r) {
                i || 0 === a.indexOf(r + "/") && (f && o !== t.length - 1 && "#" === n[n.length - 1] || (i = !0));
              });
            }), i && (s.circular = !0);
          });
        }), e.forOwn(Object.keys(t.deps).reverse(), function (r) {
          var o = t.deps[r],
            i = r.split("#"),
            u = t.docs[i[0]],
            c = R(i[1]);
          e.forOwn(o, function (r, o) {
            var a = r.split("#"),
              s = t.docs[a[0]],
              f = c.concat(R(o)),
              l = t.refs[i[0] + D(f)];
            if (e.isUndefined(l.error) && e.isUndefined(l.missing)) if (!n.resolveCirculars && l.circular) l.value = e.cloneDeep(l.def);else {
              try {
                l.value = g(s, R(a[1]));
              } catch (t) {
                return void E(l, t);
              }
              "" === i[1] && "#" === o ? t.docs[i[0]] = l.value : O(u, f, l.value);
            }
          });
        }), Object.keys(t.refs).forEach(function (o) {
          var i,
            u,
            c = t.refs[o];
          "invalid" !== c.type && ("#" === c.fqURI[c.fqURI.length - 1] && "#" !== c.uri[c.uri.length - 1] && (c.fqURI = c.fqURI.substr(0, c.fqURI.length - 1)), i = c.fqURI.split("/"), u = c.uri.split("/"), e.times(u.length - 1, function (t) {
            var n = u[u.length - t - 1],
              r = u[u.length - t],
              e = i.length - t - 1;
            "." !== n && ".." !== n && ".." !== r && (i[e] = n);
          }), c.fqURI = i.join("/"), 0 === c.fqURI.indexOf(s) ? c.fqURI = c.fqURI.replace(s, "") : 0 === c.fqURI.indexOf(l) && (c.fqURI = c.fqURI.replace(l, "")), "/" === c.fqURI[0] && (c.fqURI = "." + c.fqURI)), 0 === o.indexOf(f) && function e(o, i, u) {
            var c,
              a = i.split("#"),
              s = t.refs[i];
            r[a[0] === n.location ? "#" + a[1] : D(n.subDocPath.concat(u))] = s, !s.circular && _(s) ? (c = t.deps[s.refdId], 0 !== s.refdId.indexOf(o) && Object.keys(c).forEach(function (t) {
              e(s.refdId, s.refdId + t.substr(1), u.concat(R(t)));
            })) : !s.circular && s.error && (s.error = s.error.replace("options.subDocPath", "JSON Pointer"), s.error.indexOf("#") > -1 && (s.error = s.error.replace(s.uri.substr(s.uri.indexOf("#")), s.uri)), 0 !== s.error.indexOf("ENOENT:") && 0 !== s.error.indexOf("Not Found") || (s.error = "JSON Pointer points to missing location: " + s.uri));
          }(f, o, R(o.substr(f.length)));
        }), e.forOwn(r, function (n, r) {
          delete n.refdId, n.circular && "local" === n.type && (n.value.$ref = n.fqURI, O(t.docs[s], R(r), n.value)), n.missing && (n.error = n.error.split(": ")[0] + ": " + n.def.$ref);
        }), {
          refs: r,
          resolved: t.docs[s]
        };
      });
    }
    "undefined" == typeof Promise && r(83), t.exports.clearCache = function () {
      l = {};
    }, t.exports.decodePath = function (t) {
      return T(t);
    }, t.exports.encodePath = function (t) {
      return C(t);
    }, t.exports.findRefs = function (t, n) {
      return I(t, n);
    }, t.exports.findRefsAt = function (t, n) {
      return function (t, n) {
        var r = Promise.resolve();
        return r = r.then(function () {
          if (!e.isString(t)) throw new TypeError("location must be a string");
          return e.isUndefined(n) && (n = {}), e.isObject(n) && (n.location = t), w((n = A(n)).location, n);
        }).then(function (t) {
          var r = e.cloneDeep(l[n.location]),
            o = e.cloneDeep(n);
          return e.isUndefined(r.refs) && (delete o.filter, delete o.subDocPath, o.includeInvalid = !0, l[n.location].refs = I(t, o)), e.isUndefined(n.filter) || (o.filter = n.filter), {
            refs: I(t, o),
            value: t
          };
        });
      }(t, n);
    }, t.exports.getRefDetails = function (t) {
      return P(t);
    }, t.exports.isPtr = function (t, n) {
      return k(t, n);
    }, t.exports.isRef = function (t, n) {
      return function (t, n) {
        return x(t, n) && "invalid" !== P(t).type;
      }(t, n);
    }, t.exports.pathFromPtr = function (t) {
      return R(t);
    }, t.exports.pathToPtr = function (t, n) {
      return D(t, n);
    }, t.exports.resolveRefs = function (t, n) {
      return U(t, n);
    }, t.exports.resolveRefsAt = function (t, n) {
      return function (t, n) {
        var r = Promise.resolve();
        return r = r.then(function () {
          if (!e.isString(t)) throw new TypeError("location must be a string");
          return e.isUndefined(n) && (n = {}), e.isObject(n) && (n.location = t), w((n = A(n)).location, n);
        }).then(function (t) {
          return U(t, n).then(function (n) {
            return {
              refs: n.refs,
              resolved: n.resolved,
              value: t
            };
          });
        });
      }(t, n);
    };
  }).call(this, r(13));
}, function (t, n, r) {
  (function (t, e) {
    var o;
    function i(t) {
      return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    /**
     * @license
     * Lodash <https://lodash.com/>
     * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    (function () {
      var u = "Expected a function",
        c = "__lodash_placeholder__",
        a = [["ary", 128], ["bind", 1], ["bindKey", 2], ["curry", 8], ["curryRight", 16], ["flip", 512], ["partial", 32], ["partialRight", 64], ["rearg", 256]],
        s = "[object Arguments]",
        f = "[object Array]",
        l = "[object Boolean]",
        p = "[object Date]",
        h = "[object Error]",
        v = "[object Function]",
        d = "[object GeneratorFunction]",
        y = "[object Map]",
        _ = "[object Number]",
        g = "[object Object]",
        b = "[object RegExp]",
        m = "[object Set]",
        w = "[object String]",
        x = "[object Symbol]",
        j = "[object WeakMap]",
        E = "[object ArrayBuffer]",
        S = "[object DataView]",
        O = "[object Float32Array]",
        A = "[object Float64Array]",
        T = "[object Int8Array]",
        C = "[object Int16Array]",
        I = "[object Int32Array]",
        P = "[object Uint8Array]",
        k = "[object Uint16Array]",
        R = "[object Uint32Array]",
        D = /\b__p \+= '';/g,
        U = /\b(__p \+=) '' \+/g,
        N = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
        z = /&(?:amp|lt|gt|quot|#39);/g,
        F = /[&<>"']/g,
        L = RegExp(z.source),
        q = RegExp(F.source),
        M = /<%-([\s\S]+?)%>/g,
        $ = /<%([\s\S]+?)%>/g,
        B = /<%=([\s\S]+?)%>/g,
        H = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        W = /^\w*$/,
        V = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        G = /[\\^$.*+?()[\]{}|]/g,
        Z = RegExp(G.source),
        J = /^\s+|\s+$/g,
        X = /^\s+/,
        K = /\s+$/,
        Y = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
        Q = /\{\n\/\* \[wrapped with (.+)\] \*/,
        tt = /,? & /,
        nt = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
        rt = /\\(\\)?/g,
        et = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
        ot = /\w*$/,
        it = /^[-+]0x[0-9a-f]+$/i,
        ut = /^0b[01]+$/i,
        ct = /^\[object .+?Constructor\]$/,
        at = /^0o[0-7]+$/i,
        st = /^(?:0|[1-9]\d*)$/,
        ft = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
        lt = /($^)/,
        pt = /['\n\r\u2028\u2029\\]/g,
        ht = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
        vt = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        dt = "[\\ud800-\\udfff]",
        yt = "[" + vt + "]",
        _t = "[" + ht + "]",
        gt = "\\d+",
        bt = "[\\u2700-\\u27bf]",
        mt = "[a-z\\xdf-\\xf6\\xf8-\\xff]",
        wt = "[^\\ud800-\\udfff" + vt + gt + "\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",
        xt = "\\ud83c[\\udffb-\\udfff]",
        jt = "[^\\ud800-\\udfff]",
        Et = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        St = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        Ot = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
        At = "(?:" + mt + "|" + wt + ")",
        Tt = "(?:" + Ot + "|" + wt + ")",
        Ct = "(?:" + _t + "|" + xt + ")" + "?",
        It = "[\\ufe0e\\ufe0f]?" + Ct + ("(?:\\u200d(?:" + [jt, Et, St].join("|") + ")[\\ufe0e\\ufe0f]?" + Ct + ")*"),
        Pt = "(?:" + [bt, Et, St].join("|") + ")" + It,
        kt = "(?:" + [jt + _t + "?", _t, Et, St, dt].join("|") + ")",
        Rt = RegExp("['’]", "g"),
        Dt = RegExp(_t, "g"),
        Ut = RegExp(xt + "(?=" + xt + ")|" + kt + It, "g"),
        Nt = RegExp([Ot + "?" + mt + "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" + [yt, Ot, "$"].join("|") + ")", Tt + "+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" + [yt, Ot + At, "$"].join("|") + ")", Ot + "?" + At + "+(?:['’](?:d|ll|m|re|s|t|ve))?", Ot + "+(?:['’](?:D|LL|M|RE|S|T|VE))?", "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", gt, Pt].join("|"), "g"),
        zt = RegExp("[\\u200d\\ud800-\\udfff" + ht + "\\ufe0e\\ufe0f]"),
        Ft = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
        Lt = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
        qt = -1,
        Mt = {};
      Mt[O] = Mt[A] = Mt[T] = Mt[C] = Mt[I] = Mt[P] = Mt["[object Uint8ClampedArray]"] = Mt[k] = Mt[R] = !0, Mt[s] = Mt[f] = Mt[E] = Mt[l] = Mt[S] = Mt[p] = Mt[h] = Mt[v] = Mt[y] = Mt[_] = Mt[g] = Mt[b] = Mt[m] = Mt[w] = Mt[j] = !1;
      var $t = {};
      $t[s] = $t[f] = $t[E] = $t[S] = $t[l] = $t[p] = $t[O] = $t[A] = $t[T] = $t[C] = $t[I] = $t[y] = $t[_] = $t[g] = $t[b] = $t[m] = $t[w] = $t[x] = $t[P] = $t["[object Uint8ClampedArray]"] = $t[k] = $t[R] = !0, $t[h] = $t[v] = $t[j] = !1;
      var Bt = {
          "\\": "\\",
          "'": "'",
          "\n": "n",
          "\r": "r",
          "\u2028": "u2028",
          "\u2029": "u2029"
        },
        Ht = parseFloat,
        Wt = parseInt,
        Vt = "object" == (void 0 === t ? "undefined" : i(t)) && t && t.Object === Object && t,
        Gt = "object" == ("undefined" == typeof self ? "undefined" : i(self)) && self && self.Object === Object && self,
        Zt = Vt || Gt || Function("return this")(),
        Jt = "object" == i(n) && n && !n.nodeType && n,
        Xt = Jt && "object" == i(e) && e && !e.nodeType && e,
        Kt = Xt && Xt.exports === Jt,
        Yt = Kt && Vt.process,
        Qt = function () {
          try {
            var t = Xt && Xt.require && Xt.require("util").types;
            return t || Yt && Yt.binding && Yt.binding("util");
          } catch (t) {}
        }(),
        tn = Qt && Qt.isArrayBuffer,
        nn = Qt && Qt.isDate,
        rn = Qt && Qt.isMap,
        en = Qt && Qt.isRegExp,
        on = Qt && Qt.isSet,
        un = Qt && Qt.isTypedArray;
      function cn(t, n, r) {
        switch (r.length) {
          case 0:
            return t.call(n);
          case 1:
            return t.call(n, r[0]);
          case 2:
            return t.call(n, r[0], r[1]);
          case 3:
            return t.call(n, r[0], r[1], r[2]);
        }
        return t.apply(n, r);
      }
      function an(t, n, r, e) {
        for (var o = -1, i = null == t ? 0 : t.length; ++o < i;) {
          var u = t[o];
          n(e, u, r(u), t);
        }
        return e;
      }
      function sn(t, n) {
        for (var r = -1, e = null == t ? 0 : t.length; ++r < e && !1 !== n(t[r], r, t););
        return t;
      }
      function fn(t, n) {
        for (var r = null == t ? 0 : t.length; r-- && !1 !== n(t[r], r, t););
        return t;
      }
      function ln(t, n) {
        for (var r = -1, e = null == t ? 0 : t.length; ++r < e;) if (!n(t[r], r, t)) return !1;
        return !0;
      }
      function pn(t, n) {
        for (var r = -1, e = null == t ? 0 : t.length, o = 0, i = []; ++r < e;) {
          var u = t[r];
          n(u, r, t) && (i[o++] = u);
        }
        return i;
      }
      function hn(t, n) {
        return !!(null == t ? 0 : t.length) && jn(t, n, 0) > -1;
      }
      function vn(t, n, r) {
        for (var e = -1, o = null == t ? 0 : t.length; ++e < o;) if (r(n, t[e])) return !0;
        return !1;
      }
      function dn(t, n) {
        for (var r = -1, e = null == t ? 0 : t.length, o = Array(e); ++r < e;) o[r] = n(t[r], r, t);
        return o;
      }
      function yn(t, n) {
        for (var r = -1, e = n.length, o = t.length; ++r < e;) t[o + r] = n[r];
        return t;
      }
      function _n(t, n, r, e) {
        var o = -1,
          i = null == t ? 0 : t.length;
        for (e && i && (r = t[++o]); ++o < i;) r = n(r, t[o], o, t);
        return r;
      }
      function gn(t, n, r, e) {
        var o = null == t ? 0 : t.length;
        for (e && o && (r = t[--o]); o--;) r = n(r, t[o], o, t);
        return r;
      }
      function bn(t, n) {
        for (var r = -1, e = null == t ? 0 : t.length; ++r < e;) if (n(t[r], r, t)) return !0;
        return !1;
      }
      var mn = An("length");
      function wn(t, n, r) {
        var e;
        return r(t, function (t, r, o) {
          if (n(t, r, o)) return e = r, !1;
        }), e;
      }
      function xn(t, n, r, e) {
        for (var o = t.length, i = r + (e ? 1 : -1); e ? i-- : ++i < o;) if (n(t[i], i, t)) return i;
        return -1;
      }
      function jn(t, n, r) {
        return n == n ? function (t, n, r) {
          var e = r - 1,
            o = t.length;
          for (; ++e < o;) if (t[e] === n) return e;
          return -1;
        }(t, n, r) : xn(t, Sn, r);
      }
      function En(t, n, r, e) {
        for (var o = r - 1, i = t.length; ++o < i;) if (e(t[o], n)) return o;
        return -1;
      }
      function Sn(t) {
        return t != t;
      }
      function On(t, n) {
        var r = null == t ? 0 : t.length;
        return r ? In(t, n) / r : NaN;
      }
      function An(t) {
        return function (n) {
          return null == n ? void 0 : n[t];
        };
      }
      function Tn(t) {
        return function (n) {
          return null == t ? void 0 : t[n];
        };
      }
      function Cn(t, n, r, e, o) {
        return o(t, function (t, o, i) {
          r = e ? (e = !1, t) : n(r, t, o, i);
        }), r;
      }
      function In(t, n) {
        for (var r, e = -1, o = t.length; ++e < o;) {
          var i = n(t[e]);
          void 0 !== i && (r = void 0 === r ? i : r + i);
        }
        return r;
      }
      function Pn(t, n) {
        for (var r = -1, e = Array(t); ++r < t;) e[r] = n(r);
        return e;
      }
      function kn(t) {
        return function (n) {
          return t(n);
        };
      }
      function Rn(t, n) {
        return dn(n, function (n) {
          return t[n];
        });
      }
      function Dn(t, n) {
        return t.has(n);
      }
      function Un(t, n) {
        for (var r = -1, e = t.length; ++r < e && jn(n, t[r], 0) > -1;);
        return r;
      }
      function Nn(t, n) {
        for (var r = t.length; r-- && jn(n, t[r], 0) > -1;);
        return r;
      }
      function zn(t, n) {
        for (var r = t.length, e = 0; r--;) t[r] === n && ++e;
        return e;
      }
      var Fn = Tn({
          "À": "A",
          "Á": "A",
          "Â": "A",
          "Ã": "A",
          "Ä": "A",
          "Å": "A",
          "à": "a",
          "á": "a",
          "â": "a",
          "ã": "a",
          "ä": "a",
          "å": "a",
          "Ç": "C",
          "ç": "c",
          "Ð": "D",
          "ð": "d",
          "È": "E",
          "É": "E",
          "Ê": "E",
          "Ë": "E",
          "è": "e",
          "é": "e",
          "ê": "e",
          "ë": "e",
          "Ì": "I",
          "Í": "I",
          "Î": "I",
          "Ï": "I",
          "ì": "i",
          "í": "i",
          "î": "i",
          "ï": "i",
          "Ñ": "N",
          "ñ": "n",
          "Ò": "O",
          "Ó": "O",
          "Ô": "O",
          "Õ": "O",
          "Ö": "O",
          "Ø": "O",
          "ò": "o",
          "ó": "o",
          "ô": "o",
          "õ": "o",
          "ö": "o",
          "ø": "o",
          "Ù": "U",
          "Ú": "U",
          "Û": "U",
          "Ü": "U",
          "ù": "u",
          "ú": "u",
          "û": "u",
          "ü": "u",
          "Ý": "Y",
          "ý": "y",
          "ÿ": "y",
          "Æ": "Ae",
          "æ": "ae",
          "Þ": "Th",
          "þ": "th",
          "ß": "ss",
          "Ā": "A",
          "Ă": "A",
          "Ą": "A",
          "ā": "a",
          "ă": "a",
          "ą": "a",
          "Ć": "C",
          "Ĉ": "C",
          "Ċ": "C",
          "Č": "C",
          "ć": "c",
          "ĉ": "c",
          "ċ": "c",
          "č": "c",
          "Ď": "D",
          "Đ": "D",
          "ď": "d",
          "đ": "d",
          "Ē": "E",
          "Ĕ": "E",
          "Ė": "E",
          "Ę": "E",
          "Ě": "E",
          "ē": "e",
          "ĕ": "e",
          "ė": "e",
          "ę": "e",
          "ě": "e",
          "Ĝ": "G",
          "Ğ": "G",
          "Ġ": "G",
          "Ģ": "G",
          "ĝ": "g",
          "ğ": "g",
          "ġ": "g",
          "ģ": "g",
          "Ĥ": "H",
          "Ħ": "H",
          "ĥ": "h",
          "ħ": "h",
          "Ĩ": "I",
          "Ī": "I",
          "Ĭ": "I",
          "Į": "I",
          "İ": "I",
          "ĩ": "i",
          "ī": "i",
          "ĭ": "i",
          "į": "i",
          "ı": "i",
          "Ĵ": "J",
          "ĵ": "j",
          "Ķ": "K",
          "ķ": "k",
          "ĸ": "k",
          "Ĺ": "L",
          "Ļ": "L",
          "Ľ": "L",
          "Ŀ": "L",
          "Ł": "L",
          "ĺ": "l",
          "ļ": "l",
          "ľ": "l",
          "ŀ": "l",
          "ł": "l",
          "Ń": "N",
          "Ņ": "N",
          "Ň": "N",
          "Ŋ": "N",
          "ń": "n",
          "ņ": "n",
          "ň": "n",
          "ŋ": "n",
          "Ō": "O",
          "Ŏ": "O",
          "Ő": "O",
          "ō": "o",
          "ŏ": "o",
          "ő": "o",
          "Ŕ": "R",
          "Ŗ": "R",
          "Ř": "R",
          "ŕ": "r",
          "ŗ": "r",
          "ř": "r",
          "Ś": "S",
          "Ŝ": "S",
          "Ş": "S",
          "Š": "S",
          "ś": "s",
          "ŝ": "s",
          "ş": "s",
          "š": "s",
          "Ţ": "T",
          "Ť": "T",
          "Ŧ": "T",
          "ţ": "t",
          "ť": "t",
          "ŧ": "t",
          "Ũ": "U",
          "Ū": "U",
          "Ŭ": "U",
          "Ů": "U",
          "Ű": "U",
          "Ų": "U",
          "ũ": "u",
          "ū": "u",
          "ŭ": "u",
          "ů": "u",
          "ű": "u",
          "ų": "u",
          "Ŵ": "W",
          "ŵ": "w",
          "Ŷ": "Y",
          "ŷ": "y",
          "Ÿ": "Y",
          "Ź": "Z",
          "Ż": "Z",
          "Ž": "Z",
          "ź": "z",
          "ż": "z",
          "ž": "z",
          "Ĳ": "IJ",
          "ĳ": "ij",
          "Œ": "Oe",
          "œ": "oe",
          "ŉ": "'n",
          "ſ": "s"
        }),
        Ln = Tn({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        });
      function qn(t) {
        return "\\" + Bt[t];
      }
      function Mn(t) {
        return zt.test(t);
      }
      function $n(t) {
        var n = -1,
          r = Array(t.size);
        return t.forEach(function (t, e) {
          r[++n] = [e, t];
        }), r;
      }
      function Bn(t, n) {
        return function (r) {
          return t(n(r));
        };
      }
      function Hn(t, n) {
        for (var r = -1, e = t.length, o = 0, i = []; ++r < e;) {
          var u = t[r];
          u !== n && u !== c || (t[r] = c, i[o++] = r);
        }
        return i;
      }
      function Wn(t) {
        var n = -1,
          r = Array(t.size);
        return t.forEach(function (t) {
          r[++n] = t;
        }), r;
      }
      function Vn(t) {
        var n = -1,
          r = Array(t.size);
        return t.forEach(function (t) {
          r[++n] = [t, t];
        }), r;
      }
      function Gn(t) {
        return Mn(t) ? function (t) {
          var n = Ut.lastIndex = 0;
          for (; Ut.test(t);) ++n;
          return n;
        }(t) : mn(t);
      }
      function Zn(t) {
        return Mn(t) ? function (t) {
          return t.match(Ut) || [];
        }(t) : function (t) {
          return t.split("");
        }(t);
      }
      var Jn = Tn({
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      });
      var Xn = function t(n) {
        var r,
          e = (n = null == n ? Zt : Xn.defaults(Zt.Object(), n, Xn.pick(Zt, Lt))).Array,
          o = n.Date,
          ht = n.Error,
          vt = n.Function,
          dt = n.Math,
          yt = n.Object,
          _t = n.RegExp,
          gt = n.String,
          bt = n.TypeError,
          mt = e.prototype,
          wt = vt.prototype,
          xt = yt.prototype,
          jt = n["__core-js_shared__"],
          Et = wt.toString,
          St = xt.hasOwnProperty,
          Ot = 0,
          At = (r = /[^.]+$/.exec(jt && jt.keys && jt.keys.IE_PROTO || "")) ? "Symbol(src)_1." + r : "",
          Tt = xt.toString,
          Ct = Et.call(yt),
          It = Zt._,
          Pt = _t("^" + Et.call(St).replace(G, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
          kt = Kt ? n.Buffer : void 0,
          Ut = n.Symbol,
          zt = n.Uint8Array,
          Bt = kt ? kt.allocUnsafe : void 0,
          Vt = Bn(yt.getPrototypeOf, yt),
          Gt = yt.create,
          Jt = xt.propertyIsEnumerable,
          Xt = mt.splice,
          Yt = Ut ? Ut.isConcatSpreadable : void 0,
          Qt = Ut ? Ut.iterator : void 0,
          mn = Ut ? Ut.toStringTag : void 0,
          Tn = function () {
            try {
              var t = ni(yt, "defineProperty");
              return t({}, "", {}), t;
            } catch (t) {}
          }(),
          Kn = n.clearTimeout !== Zt.clearTimeout && n.clearTimeout,
          Yn = o && o.now !== Zt.Date.now && o.now,
          Qn = n.setTimeout !== Zt.setTimeout && n.setTimeout,
          tr = dt.ceil,
          nr = dt.floor,
          rr = yt.getOwnPropertySymbols,
          er = kt ? kt.isBuffer : void 0,
          or = n.isFinite,
          ir = mt.join,
          ur = Bn(yt.keys, yt),
          cr = dt.max,
          ar = dt.min,
          sr = o.now,
          fr = n.parseInt,
          lr = dt.random,
          pr = mt.reverse,
          hr = ni(n, "DataView"),
          vr = ni(n, "Map"),
          dr = ni(n, "Promise"),
          yr = ni(n, "Set"),
          _r = ni(n, "WeakMap"),
          gr = ni(yt, "create"),
          br = _r && new _r(),
          mr = {},
          wr = Ti(hr),
          xr = Ti(vr),
          jr = Ti(dr),
          Er = Ti(yr),
          Sr = Ti(_r),
          Or = Ut ? Ut.prototype : void 0,
          Ar = Or ? Or.valueOf : void 0,
          Tr = Or ? Or.toString : void 0;
        function Cr(t) {
          if (Wu(t) && !Du(t) && !(t instanceof Rr)) {
            if (t instanceof kr) return t;
            if (St.call(t, "__wrapped__")) return Ci(t);
          }
          return new kr(t);
        }
        var Ir = function () {
          function t() {}
          return function (n) {
            if (!Hu(n)) return {};
            if (Gt) return Gt(n);
            t.prototype = n;
            var r = new t();
            return t.prototype = void 0, r;
          };
        }();
        function Pr() {}
        function kr(t, n) {
          this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!n, this.__index__ = 0, this.__values__ = void 0;
        }
        function Rr(t) {
          this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = 4294967295, this.__views__ = [];
        }
        function Dr(t) {
          var n = -1,
            r = null == t ? 0 : t.length;
          for (this.clear(); ++n < r;) {
            var e = t[n];
            this.set(e[0], e[1]);
          }
        }
        function Ur(t) {
          var n = -1,
            r = null == t ? 0 : t.length;
          for (this.clear(); ++n < r;) {
            var e = t[n];
            this.set(e[0], e[1]);
          }
        }
        function Nr(t) {
          var n = -1,
            r = null == t ? 0 : t.length;
          for (this.clear(); ++n < r;) {
            var e = t[n];
            this.set(e[0], e[1]);
          }
        }
        function zr(t) {
          var n = -1,
            r = null == t ? 0 : t.length;
          for (this.__data__ = new Nr(); ++n < r;) this.add(t[n]);
        }
        function Fr(t) {
          var n = this.__data__ = new Ur(t);
          this.size = n.size;
        }
        function Lr(t, n) {
          var r = Du(t),
            e = !r && Ru(t),
            o = !r && !e && Fu(t),
            i = !r && !e && !o && Qu(t),
            u = r || e || o || i,
            c = u ? Pn(t.length, gt) : [],
            a = c.length;
          for (var s in t) !n && !St.call(t, s) || u && ("length" == s || o && ("offset" == s || "parent" == s) || i && ("buffer" == s || "byteLength" == s || "byteOffset" == s) || ai(s, a)) || c.push(s);
          return c;
        }
        function qr(t) {
          var n = t.length;
          return n ? t[ze(0, n - 1)] : void 0;
        }
        function Mr(t, n) {
          return Si(bo(t), Xr(n, 0, t.length));
        }
        function $r(t) {
          return Si(bo(t));
        }
        function Br(t, n, r) {
          (void 0 === r || Iu(t[n], r)) && (void 0 !== r || n in t) || Zr(t, n, r);
        }
        function Hr(t, n, r) {
          var e = t[n];
          St.call(t, n) && Iu(e, r) && (void 0 !== r || n in t) || Zr(t, n, r);
        }
        function Wr(t, n) {
          for (var r = t.length; r--;) if (Iu(t[r][0], n)) return r;
          return -1;
        }
        function Vr(t, n, r, e) {
          return ne(t, function (t, o, i) {
            n(e, t, r(t), i);
          }), e;
        }
        function Gr(t, n) {
          return t && mo(n, wc(n), t);
        }
        function Zr(t, n, r) {
          "__proto__" == n && Tn ? Tn(t, n, {
            configurable: !0,
            enumerable: !0,
            value: r,
            writable: !0
          }) : t[n] = r;
        }
        function Jr(t, n) {
          for (var r = -1, o = n.length, i = e(o), u = null == t; ++r < o;) i[r] = u ? void 0 : yc(t, n[r]);
          return i;
        }
        function Xr(t, n, r) {
          return t == t && (void 0 !== r && (t = t <= r ? t : r), void 0 !== n && (t = t >= n ? t : n)), t;
        }
        function Kr(t, n, r, e, o, i) {
          var u,
            c = 1 & n,
            a = 2 & n,
            f = 4 & n;
          if (r && (u = o ? r(t, e, o, i) : r(t)), void 0 !== u) return u;
          if (!Hu(t)) return t;
          var h = Du(t);
          if (h) {
            if (u = function (t) {
              var n = t.length,
                r = new t.constructor(n);
              n && "string" == typeof t[0] && St.call(t, "index") && (r.index = t.index, r.input = t.input);
              return r;
            }(t), !c) return bo(t, u);
          } else {
            var j = oi(t),
              D = j == v || j == d;
            if (Fu(t)) return po(t, c);
            if (j == g || j == s || D && !o) {
              if (u = a || D ? {} : ui(t), !c) return a ? function (t, n) {
                return mo(t, ei(t), n);
              }(t, function (t, n) {
                return t && mo(n, xc(n), t);
              }(u, t)) : function (t, n) {
                return mo(t, ri(t), n);
              }(t, Gr(u, t));
            } else {
              if (!$t[j]) return o ? t : {};
              u = function (t, n, r) {
                var e = t.constructor;
                switch (n) {
                  case E:
                    return ho(t);
                  case l:
                  case p:
                    return new e(+t);
                  case S:
                    return function (t, n) {
                      var r = n ? ho(t.buffer) : t.buffer;
                      return new t.constructor(r, t.byteOffset, t.byteLength);
                    }(t, r);
                  case O:
                  case A:
                  case T:
                  case C:
                  case I:
                  case P:
                  case "[object Uint8ClampedArray]":
                  case k:
                  case R:
                    return vo(t, r);
                  case y:
                    return new e();
                  case _:
                  case w:
                    return new e(t);
                  case b:
                    return function (t) {
                      var n = new t.constructor(t.source, ot.exec(t));
                      return n.lastIndex = t.lastIndex, n;
                    }(t);
                  case m:
                    return new e();
                  case x:
                    return o = t, Ar ? yt(Ar.call(o)) : {};
                }
                var o;
              }(t, j, c);
            }
          }
          i || (i = new Fr());
          var U = i.get(t);
          if (U) return U;
          i.set(t, u), Xu(t) ? t.forEach(function (e) {
            u.add(Kr(e, n, r, e, t, i));
          }) : Vu(t) && t.forEach(function (e, o) {
            u.set(o, Kr(e, n, r, o, t, i));
          });
          var N = h ? void 0 : (f ? a ? Zo : Go : a ? xc : wc)(t);
          return sn(N || t, function (e, o) {
            N && (e = t[o = e]), Hr(u, o, Kr(e, n, r, o, t, i));
          }), u;
        }
        function Yr(t, n, r) {
          var e = r.length;
          if (null == t) return !e;
          for (t = yt(t); e--;) {
            var o = r[e],
              i = n[o],
              u = t[o];
            if (void 0 === u && !(o in t) || !i(u)) return !1;
          }
          return !0;
        }
        function Qr(t, n, r) {
          if ("function" != typeof t) throw new bt(u);
          return wi(function () {
            t.apply(void 0, r);
          }, n);
        }
        function te(t, n, r, e) {
          var o = -1,
            i = hn,
            u = !0,
            c = t.length,
            a = [],
            s = n.length;
          if (!c) return a;
          r && (n = dn(n, kn(r))), e ? (i = vn, u = !1) : n.length >= 200 && (i = Dn, u = !1, n = new zr(n));
          t: for (; ++o < c;) {
            var f = t[o],
              l = null == r ? f : r(f);
            if (f = e || 0 !== f ? f : 0, u && l == l) {
              for (var p = s; p--;) if (n[p] === l) continue t;
              a.push(f);
            } else i(n, l, e) || a.push(f);
          }
          return a;
        }
        Cr.templateSettings = {
          escape: M,
          evaluate: $,
          interpolate: B,
          variable: "",
          imports: {
            _: Cr
          }
        }, Cr.prototype = Pr.prototype, Cr.prototype.constructor = Cr, kr.prototype = Ir(Pr.prototype), kr.prototype.constructor = kr, Rr.prototype = Ir(Pr.prototype), Rr.prototype.constructor = Rr, Dr.prototype.clear = function () {
          this.__data__ = gr ? gr(null) : {}, this.size = 0;
        }, Dr.prototype.delete = function (t) {
          var n = this.has(t) && delete this.__data__[t];
          return this.size -= n ? 1 : 0, n;
        }, Dr.prototype.get = function (t) {
          var n = this.__data__;
          if (gr) {
            var r = n[t];
            return "__lodash_hash_undefined__" === r ? void 0 : r;
          }
          return St.call(n, t) ? n[t] : void 0;
        }, Dr.prototype.has = function (t) {
          var n = this.__data__;
          return gr ? void 0 !== n[t] : St.call(n, t);
        }, Dr.prototype.set = function (t, n) {
          var r = this.__data__;
          return this.size += this.has(t) ? 0 : 1, r[t] = gr && void 0 === n ? "__lodash_hash_undefined__" : n, this;
        }, Ur.prototype.clear = function () {
          this.__data__ = [], this.size = 0;
        }, Ur.prototype.delete = function (t) {
          var n = this.__data__,
            r = Wr(n, t);
          return !(r < 0) && (r == n.length - 1 ? n.pop() : Xt.call(n, r, 1), --this.size, !0);
        }, Ur.prototype.get = function (t) {
          var n = this.__data__,
            r = Wr(n, t);
          return r < 0 ? void 0 : n[r][1];
        }, Ur.prototype.has = function (t) {
          return Wr(this.__data__, t) > -1;
        }, Ur.prototype.set = function (t, n) {
          var r = this.__data__,
            e = Wr(r, t);
          return e < 0 ? (++this.size, r.push([t, n])) : r[e][1] = n, this;
        }, Nr.prototype.clear = function () {
          this.size = 0, this.__data__ = {
            hash: new Dr(),
            map: new (vr || Ur)(),
            string: new Dr()
          };
        }, Nr.prototype.delete = function (t) {
          var n = Qo(this, t).delete(t);
          return this.size -= n ? 1 : 0, n;
        }, Nr.prototype.get = function (t) {
          return Qo(this, t).get(t);
        }, Nr.prototype.has = function (t) {
          return Qo(this, t).has(t);
        }, Nr.prototype.set = function (t, n) {
          var r = Qo(this, t),
            e = r.size;
          return r.set(t, n), this.size += r.size == e ? 0 : 1, this;
        }, zr.prototype.add = zr.prototype.push = function (t) {
          return this.__data__.set(t, "__lodash_hash_undefined__"), this;
        }, zr.prototype.has = function (t) {
          return this.__data__.has(t);
        }, Fr.prototype.clear = function () {
          this.__data__ = new Ur(), this.size = 0;
        }, Fr.prototype.delete = function (t) {
          var n = this.__data__,
            r = n.delete(t);
          return this.size = n.size, r;
        }, Fr.prototype.get = function (t) {
          return this.__data__.get(t);
        }, Fr.prototype.has = function (t) {
          return this.__data__.has(t);
        }, Fr.prototype.set = function (t, n) {
          var r = this.__data__;
          if (r instanceof Ur) {
            var e = r.__data__;
            if (!vr || e.length < 199) return e.push([t, n]), this.size = ++r.size, this;
            r = this.__data__ = new Nr(e);
          }
          return r.set(t, n), this.size = r.size, this;
        };
        var ne = jo(se),
          re = jo(fe, !0);
        function ee(t, n) {
          var r = !0;
          return ne(t, function (t, e, o) {
            return r = !!n(t, e, o);
          }), r;
        }
        function oe(t, n, r) {
          for (var e = -1, o = t.length; ++e < o;) {
            var i = t[e],
              u = n(i);
            if (null != u && (void 0 === c ? u == u && !Yu(u) : r(u, c))) var c = u,
              a = i;
          }
          return a;
        }
        function ie(t, n) {
          var r = [];
          return ne(t, function (t, e, o) {
            n(t, e, o) && r.push(t);
          }), r;
        }
        function ue(t, n, r, e, o) {
          var i = -1,
            u = t.length;
          for (r || (r = ci), o || (o = []); ++i < u;) {
            var c = t[i];
            n > 0 && r(c) ? n > 1 ? ue(c, n - 1, r, e, o) : yn(o, c) : e || (o[o.length] = c);
          }
          return o;
        }
        var ce = Eo(),
          ae = Eo(!0);
        function se(t, n) {
          return t && ce(t, n, wc);
        }
        function fe(t, n) {
          return t && ae(t, n, wc);
        }
        function le(t, n) {
          return pn(n, function (n) {
            return Mu(t[n]);
          });
        }
        function pe(t, n) {
          for (var r = 0, e = (n = ao(n, t)).length; null != t && r < e;) t = t[Ai(n[r++])];
          return r && r == e ? t : void 0;
        }
        function he(t, n, r) {
          var e = n(t);
          return Du(t) ? e : yn(e, r(t));
        }
        function ve(t) {
          return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : mn && mn in yt(t) ? function (t) {
            var n = St.call(t, mn),
              r = t[mn];
            try {
              t[mn] = void 0;
              var e = !0;
            } catch (t) {}
            var o = Tt.call(t);
            e && (n ? t[mn] = r : delete t[mn]);
            return o;
          }(t) : function (t) {
            return Tt.call(t);
          }(t);
        }
        function de(t, n) {
          return t > n;
        }
        function ye(t, n) {
          return null != t && St.call(t, n);
        }
        function _e(t, n) {
          return null != t && n in yt(t);
        }
        function ge(t, n, r) {
          for (var o = r ? vn : hn, i = t[0].length, u = t.length, c = u, a = e(u), s = 1 / 0, f = []; c--;) {
            var l = t[c];
            c && n && (l = dn(l, kn(n))), s = ar(l.length, s), a[c] = !r && (n || i >= 120 && l.length >= 120) ? new zr(c && l) : void 0;
          }
          l = t[0];
          var p = -1,
            h = a[0];
          t: for (; ++p < i && f.length < s;) {
            var v = l[p],
              d = n ? n(v) : v;
            if (v = r || 0 !== v ? v : 0, !(h ? Dn(h, d) : o(f, d, r))) {
              for (c = u; --c;) {
                var y = a[c];
                if (!(y ? Dn(y, d) : o(t[c], d, r))) continue t;
              }
              h && h.push(d), f.push(v);
            }
          }
          return f;
        }
        function be(t, n, r) {
          var e = null == (t = _i(t, n = ao(n, t))) ? t : t[Ai(qi(n))];
          return null == e ? void 0 : cn(e, t, r);
        }
        function me(t) {
          return Wu(t) && ve(t) == s;
        }
        function we(t, n, r, e, o) {
          return t === n || (null == t || null == n || !Wu(t) && !Wu(n) ? t != t && n != n : function (t, n, r, e, o, i) {
            var u = Du(t),
              c = Du(n),
              a = u ? f : oi(t),
              v = c ? f : oi(n),
              d = (a = a == s ? g : a) == g,
              j = (v = v == s ? g : v) == g,
              O = a == v;
            if (O && Fu(t)) {
              if (!Fu(n)) return !1;
              u = !0, d = !1;
            }
            if (O && !d) return i || (i = new Fr()), u || Qu(t) ? Wo(t, n, r, e, o, i) : function (t, n, r, e, o, i, u) {
              switch (r) {
                case S:
                  if (t.byteLength != n.byteLength || t.byteOffset != n.byteOffset) return !1;
                  t = t.buffer, n = n.buffer;
                case E:
                  return !(t.byteLength != n.byteLength || !i(new zt(t), new zt(n)));
                case l:
                case p:
                case _:
                  return Iu(+t, +n);
                case h:
                  return t.name == n.name && t.message == n.message;
                case b:
                case w:
                  return t == n + "";
                case y:
                  var c = $n;
                case m:
                  var a = 1 & e;
                  if (c || (c = Wn), t.size != n.size && !a) return !1;
                  var s = u.get(t);
                  if (s) return s == n;
                  e |= 2, u.set(t, n);
                  var f = Wo(c(t), c(n), e, o, i, u);
                  return u.delete(t), f;
                case x:
                  if (Ar) return Ar.call(t) == Ar.call(n);
              }
              return !1;
            }(t, n, a, r, e, o, i);
            if (!(1 & r)) {
              var A = d && St.call(t, "__wrapped__"),
                T = j && St.call(n, "__wrapped__");
              if (A || T) {
                var C = A ? t.value() : t,
                  I = T ? n.value() : n;
                return i || (i = new Fr()), o(C, I, r, e, i);
              }
            }
            if (!O) return !1;
            return i || (i = new Fr()), function (t, n, r, e, o, i) {
              var u = 1 & r,
                c = Go(t),
                a = c.length,
                s = Go(n).length;
              if (a != s && !u) return !1;
              var f = a;
              for (; f--;) {
                var l = c[f];
                if (!(u ? l in n : St.call(n, l))) return !1;
              }
              var p = i.get(t);
              if (p && i.get(n)) return p == n;
              var h = !0;
              i.set(t, n), i.set(n, t);
              var v = u;
              for (; ++f < a;) {
                l = c[f];
                var d = t[l],
                  y = n[l];
                if (e) var _ = u ? e(y, d, l, n, t, i) : e(d, y, l, t, n, i);
                if (!(void 0 === _ ? d === y || o(d, y, r, e, i) : _)) {
                  h = !1;
                  break;
                }
                v || (v = "constructor" == l);
              }
              if (h && !v) {
                var g = t.constructor,
                  b = n.constructor;
                g != b && "constructor" in t && "constructor" in n && !("function" == typeof g && g instanceof g && "function" == typeof b && b instanceof b) && (h = !1);
              }
              return i.delete(t), i.delete(n), h;
            }(t, n, r, e, o, i);
          }(t, n, r, e, we, o));
        }
        function xe(t, n, r, e) {
          var o = r.length,
            i = o,
            u = !e;
          if (null == t) return !i;
          for (t = yt(t); o--;) {
            var c = r[o];
            if (u && c[2] ? c[1] !== t[c[0]] : !(c[0] in t)) return !1;
          }
          for (; ++o < i;) {
            var a = (c = r[o])[0],
              s = t[a],
              f = c[1];
            if (u && c[2]) {
              if (void 0 === s && !(a in t)) return !1;
            } else {
              var l = new Fr();
              if (e) var p = e(s, f, a, t, n, l);
              if (!(void 0 === p ? we(f, s, 3, e, l) : p)) return !1;
            }
          }
          return !0;
        }
        function je(t) {
          return !(!Hu(t) || (n = t, At && At in n)) && (Mu(t) ? Pt : ct).test(Ti(t));
          var n;
        }
        function Ee(t) {
          return "function" == typeof t ? t : null == t ? Gc : "object" == i(t) ? Du(t) ? Ie(t[0], t[1]) : Ce(t) : ra(t);
        }
        function Se(t) {
          if (!hi(t)) return ur(t);
          var n = [];
          for (var r in yt(t)) St.call(t, r) && "constructor" != r && n.push(r);
          return n;
        }
        function Oe(t) {
          if (!Hu(t)) return function (t) {
            var n = [];
            if (null != t) for (var r in yt(t)) n.push(r);
            return n;
          }(t);
          var n = hi(t),
            r = [];
          for (var e in t) ("constructor" != e || !n && St.call(t, e)) && r.push(e);
          return r;
        }
        function Ae(t, n) {
          return t < n;
        }
        function Te(t, n) {
          var r = -1,
            o = Nu(t) ? e(t.length) : [];
          return ne(t, function (t, e, i) {
            o[++r] = n(t, e, i);
          }), o;
        }
        function Ce(t) {
          var n = ti(t);
          return 1 == n.length && n[0][2] ? di(n[0][0], n[0][1]) : function (r) {
            return r === t || xe(r, t, n);
          };
        }
        function Ie(t, n) {
          return fi(t) && vi(n) ? di(Ai(t), n) : function (r) {
            var e = yc(r, t);
            return void 0 === e && e === n ? _c(r, t) : we(n, e, 3);
          };
        }
        function Pe(t, n, r, e, o) {
          t !== n && ce(n, function (i, u) {
            if (o || (o = new Fr()), Hu(i)) !function (t, n, r, e, o, i, u) {
              var c = bi(t, r),
                a = bi(n, r),
                s = u.get(a);
              if (s) return void Br(t, r, s);
              var f = i ? i(c, a, r + "", t, n, u) : void 0,
                l = void 0 === f;
              if (l) {
                var p = Du(a),
                  h = !p && Fu(a),
                  v = !p && !h && Qu(a);
                f = a, p || h || v ? Du(c) ? f = c : zu(c) ? f = bo(c) : h ? (l = !1, f = po(a, !0)) : v ? (l = !1, f = vo(a, !0)) : f = [] : Zu(a) || Ru(a) ? (f = c, Ru(c) ? f = cc(c) : Hu(c) && !Mu(c) || (f = ui(a))) : l = !1;
              }
              l && (u.set(a, f), o(f, a, e, i, u), u.delete(a));
              Br(t, r, f);
            }(t, n, u, r, Pe, e, o);else {
              var c = e ? e(bi(t, u), i, u + "", t, n, o) : void 0;
              void 0 === c && (c = i), Br(t, u, c);
            }
          }, xc);
        }
        function ke(t, n) {
          var r = t.length;
          if (r) return ai(n += n < 0 ? r : 0, r) ? t[n] : void 0;
        }
        function Re(t, n, r) {
          var e = -1;
          return n = dn(n.length ? n : [Gc], kn(Yo())), function (t, n) {
            var r = t.length;
            for (t.sort(n); r--;) t[r] = t[r].value;
            return t;
          }(Te(t, function (t, r, o) {
            return {
              criteria: dn(n, function (n) {
                return n(t);
              }),
              index: ++e,
              value: t
            };
          }), function (t, n) {
            return function (t, n, r) {
              var e = -1,
                o = t.criteria,
                i = n.criteria,
                u = o.length,
                c = r.length;
              for (; ++e < u;) {
                var a = yo(o[e], i[e]);
                if (a) {
                  if (e >= c) return a;
                  var s = r[e];
                  return a * ("desc" == s ? -1 : 1);
                }
              }
              return t.index - n.index;
            }(t, n, r);
          });
        }
        function De(t, n, r) {
          for (var e = -1, o = n.length, i = {}; ++e < o;) {
            var u = n[e],
              c = pe(t, u);
            r(c, u) && $e(i, ao(u, t), c);
          }
          return i;
        }
        function Ue(t, n, r, e) {
          var o = e ? En : jn,
            i = -1,
            u = n.length,
            c = t;
          for (t === n && (n = bo(n)), r && (c = dn(t, kn(r))); ++i < u;) for (var a = 0, s = n[i], f = r ? r(s) : s; (a = o(c, f, a, e)) > -1;) c !== t && Xt.call(c, a, 1), Xt.call(t, a, 1);
          return t;
        }
        function Ne(t, n) {
          for (var r = t ? n.length : 0, e = r - 1; r--;) {
            var o = n[r];
            if (r == e || o !== i) {
              var i = o;
              ai(o) ? Xt.call(t, o, 1) : to(t, o);
            }
          }
          return t;
        }
        function ze(t, n) {
          return t + nr(lr() * (n - t + 1));
        }
        function Fe(t, n) {
          var r = "";
          if (!t || n < 1 || n > 9007199254740991) return r;
          do {
            n % 2 && (r += t), (n = nr(n / 2)) && (t += t);
          } while (n);
          return r;
        }
        function Le(t, n) {
          return xi(yi(t, n, Gc), t + "");
        }
        function qe(t) {
          return qr(Ic(t));
        }
        function Me(t, n) {
          var r = Ic(t);
          return Si(r, Xr(n, 0, r.length));
        }
        function $e(t, n, r, e) {
          if (!Hu(t)) return t;
          for (var o = -1, i = (n = ao(n, t)).length, u = i - 1, c = t; null != c && ++o < i;) {
            var a = Ai(n[o]),
              s = r;
            if (o != u) {
              var f = c[a];
              void 0 === (s = e ? e(f, a, c) : void 0) && (s = Hu(f) ? f : ai(n[o + 1]) ? [] : {});
            }
            Hr(c, a, s), c = c[a];
          }
          return t;
        }
        var Be = br ? function (t, n) {
            return br.set(t, n), t;
          } : Gc,
          He = Tn ? function (t, n) {
            return Tn(t, "toString", {
              configurable: !0,
              enumerable: !1,
              value: Hc(n),
              writable: !0
            });
          } : Gc;
        function We(t) {
          return Si(Ic(t));
        }
        function Ve(t, n, r) {
          var o = -1,
            i = t.length;
          n < 0 && (n = -n > i ? 0 : i + n), (r = r > i ? i : r) < 0 && (r += i), i = n > r ? 0 : r - n >>> 0, n >>>= 0;
          for (var u = e(i); ++o < i;) u[o] = t[o + n];
          return u;
        }
        function Ge(t, n) {
          var r;
          return ne(t, function (t, e, o) {
            return !(r = n(t, e, o));
          }), !!r;
        }
        function Ze(t, n, r) {
          var e = 0,
            o = null == t ? e : t.length;
          if ("number" == typeof n && n == n && o <= 2147483647) {
            for (; e < o;) {
              var i = e + o >>> 1,
                u = t[i];
              null !== u && !Yu(u) && (r ? u <= n : u < n) ? e = i + 1 : o = i;
            }
            return o;
          }
          return Je(t, n, Gc, r);
        }
        function Je(t, n, r, e) {
          n = r(n);
          for (var o = 0, i = null == t ? 0 : t.length, u = n != n, c = null === n, a = Yu(n), s = void 0 === n; o < i;) {
            var f = nr((o + i) / 2),
              l = r(t[f]),
              p = void 0 !== l,
              h = null === l,
              v = l == l,
              d = Yu(l);
            if (u) var y = e || v;else y = s ? v && (e || p) : c ? v && p && (e || !h) : a ? v && p && !h && (e || !d) : !h && !d && (e ? l <= n : l < n);
            y ? o = f + 1 : i = f;
          }
          return ar(i, 4294967294);
        }
        function Xe(t, n) {
          for (var r = -1, e = t.length, o = 0, i = []; ++r < e;) {
            var u = t[r],
              c = n ? n(u) : u;
            if (!r || !Iu(c, a)) {
              var a = c;
              i[o++] = 0 === u ? 0 : u;
            }
          }
          return i;
        }
        function Ke(t) {
          return "number" == typeof t ? t : Yu(t) ? NaN : +t;
        }
        function Ye(t) {
          if ("string" == typeof t) return t;
          if (Du(t)) return dn(t, Ye) + "";
          if (Yu(t)) return Tr ? Tr.call(t) : "";
          var n = t + "";
          return "0" == n && 1 / t == -1 / 0 ? "-0" : n;
        }
        function Qe(t, n, r) {
          var e = -1,
            o = hn,
            i = t.length,
            u = !0,
            c = [],
            a = c;
          if (r) u = !1, o = vn;else if (i >= 200) {
            var s = n ? null : Lo(t);
            if (s) return Wn(s);
            u = !1, o = Dn, a = new zr();
          } else a = n ? [] : c;
          t: for (; ++e < i;) {
            var f = t[e],
              l = n ? n(f) : f;
            if (f = r || 0 !== f ? f : 0, u && l == l) {
              for (var p = a.length; p--;) if (a[p] === l) continue t;
              n && a.push(l), c.push(f);
            } else o(a, l, r) || (a !== c && a.push(l), c.push(f));
          }
          return c;
        }
        function to(t, n) {
          return null == (t = _i(t, n = ao(n, t))) || delete t[Ai(qi(n))];
        }
        function no(t, n, r, e) {
          return $e(t, n, r(pe(t, n)), e);
        }
        function ro(t, n, r, e) {
          for (var o = t.length, i = e ? o : -1; (e ? i-- : ++i < o) && n(t[i], i, t););
          return r ? Ve(t, e ? 0 : i, e ? i + 1 : o) : Ve(t, e ? i + 1 : 0, e ? o : i);
        }
        function eo(t, n) {
          var r = t;
          return r instanceof Rr && (r = r.value()), _n(n, function (t, n) {
            return n.func.apply(n.thisArg, yn([t], n.args));
          }, r);
        }
        function oo(t, n, r) {
          var o = t.length;
          if (o < 2) return o ? Qe(t[0]) : [];
          for (var i = -1, u = e(o); ++i < o;) for (var c = t[i], a = -1; ++a < o;) a != i && (u[i] = te(u[i] || c, t[a], n, r));
          return Qe(ue(u, 1), n, r);
        }
        function io(t, n, r) {
          for (var e = -1, o = t.length, i = n.length, u = {}; ++e < o;) {
            var c = e < i ? n[e] : void 0;
            r(u, t[e], c);
          }
          return u;
        }
        function uo(t) {
          return zu(t) ? t : [];
        }
        function co(t) {
          return "function" == typeof t ? t : Gc;
        }
        function ao(t, n) {
          return Du(t) ? t : fi(t, n) ? [t] : Oi(ac(t));
        }
        var so = Le;
        function fo(t, n, r) {
          var e = t.length;
          return r = void 0 === r ? e : r, !n && r >= e ? t : Ve(t, n, r);
        }
        var lo = Kn || function (t) {
          return Zt.clearTimeout(t);
        };
        function po(t, n) {
          if (n) return t.slice();
          var r = t.length,
            e = Bt ? Bt(r) : new t.constructor(r);
          return t.copy(e), e;
        }
        function ho(t) {
          var n = new t.constructor(t.byteLength);
          return new zt(n).set(new zt(t)), n;
        }
        function vo(t, n) {
          var r = n ? ho(t.buffer) : t.buffer;
          return new t.constructor(r, t.byteOffset, t.length);
        }
        function yo(t, n) {
          if (t !== n) {
            var r = void 0 !== t,
              e = null === t,
              o = t == t,
              i = Yu(t),
              u = void 0 !== n,
              c = null === n,
              a = n == n,
              s = Yu(n);
            if (!c && !s && !i && t > n || i && u && a && !c && !s || e && u && a || !r && a || !o) return 1;
            if (!e && !i && !s && t < n || s && r && o && !e && !i || c && r && o || !u && o || !a) return -1;
          }
          return 0;
        }
        function _o(t, n, r, o) {
          for (var i = -1, u = t.length, c = r.length, a = -1, s = n.length, f = cr(u - c, 0), l = e(s + f), p = !o; ++a < s;) l[a] = n[a];
          for (; ++i < c;) (p || i < u) && (l[r[i]] = t[i]);
          for (; f--;) l[a++] = t[i++];
          return l;
        }
        function go(t, n, r, o) {
          for (var i = -1, u = t.length, c = -1, a = r.length, s = -1, f = n.length, l = cr(u - a, 0), p = e(l + f), h = !o; ++i < l;) p[i] = t[i];
          for (var v = i; ++s < f;) p[v + s] = n[s];
          for (; ++c < a;) (h || i < u) && (p[v + r[c]] = t[i++]);
          return p;
        }
        function bo(t, n) {
          var r = -1,
            o = t.length;
          for (n || (n = e(o)); ++r < o;) n[r] = t[r];
          return n;
        }
        function mo(t, n, r, e) {
          var o = !r;
          r || (r = {});
          for (var i = -1, u = n.length; ++i < u;) {
            var c = n[i],
              a = e ? e(r[c], t[c], c, r, t) : void 0;
            void 0 === a && (a = t[c]), o ? Zr(r, c, a) : Hr(r, c, a);
          }
          return r;
        }
        function wo(t, n) {
          return function (r, e) {
            var o = Du(r) ? an : Vr,
              i = n ? n() : {};
            return o(r, t, Yo(e, 2), i);
          };
        }
        function xo(t) {
          return Le(function (n, r) {
            var e = -1,
              o = r.length,
              i = o > 1 ? r[o - 1] : void 0,
              u = o > 2 ? r[2] : void 0;
            for (i = t.length > 3 && "function" == typeof i ? (o--, i) : void 0, u && si(r[0], r[1], u) && (i = o < 3 ? void 0 : i, o = 1), n = yt(n); ++e < o;) {
              var c = r[e];
              c && t(n, c, e, i);
            }
            return n;
          });
        }
        function jo(t, n) {
          return function (r, e) {
            if (null == r) return r;
            if (!Nu(r)) return t(r, e);
            for (var o = r.length, i = n ? o : -1, u = yt(r); (n ? i-- : ++i < o) && !1 !== e(u[i], i, u););
            return r;
          };
        }
        function Eo(t) {
          return function (n, r, e) {
            for (var o = -1, i = yt(n), u = e(n), c = u.length; c--;) {
              var a = u[t ? c : ++o];
              if (!1 === r(i[a], a, i)) break;
            }
            return n;
          };
        }
        function So(t) {
          return function (n) {
            var r = Mn(n = ac(n)) ? Zn(n) : void 0,
              e = r ? r[0] : n.charAt(0),
              o = r ? fo(r, 1).join("") : n.slice(1);
            return e[t]() + o;
          };
        }
        function Oo(t) {
          return function (n) {
            return _n(Mc(Rc(n).replace(Rt, "")), t, "");
          };
        }
        function Ao(t) {
          return function () {
            var n = arguments;
            switch (n.length) {
              case 0:
                return new t();
              case 1:
                return new t(n[0]);
              case 2:
                return new t(n[0], n[1]);
              case 3:
                return new t(n[0], n[1], n[2]);
              case 4:
                return new t(n[0], n[1], n[2], n[3]);
              case 5:
                return new t(n[0], n[1], n[2], n[3], n[4]);
              case 6:
                return new t(n[0], n[1], n[2], n[3], n[4], n[5]);
              case 7:
                return new t(n[0], n[1], n[2], n[3], n[4], n[5], n[6]);
            }
            var r = Ir(t.prototype),
              e = t.apply(r, n);
            return Hu(e) ? e : r;
          };
        }
        function To(t) {
          return function (n, r, e) {
            var o = yt(n);
            if (!Nu(n)) {
              var i = Yo(r, 3);
              n = wc(n), r = function (t) {
                return i(o[t], t, o);
              };
            }
            var u = t(n, r, e);
            return u > -1 ? o[i ? n[u] : u] : void 0;
          };
        }
        function Co(t) {
          return Vo(function (n) {
            var r = n.length,
              e = r,
              o = kr.prototype.thru;
            for (t && n.reverse(); e--;) {
              var i = n[e];
              if ("function" != typeof i) throw new bt(u);
              if (o && !c && "wrapper" == Xo(i)) var c = new kr([], !0);
            }
            for (e = c ? e : r; ++e < r;) {
              var a = Xo(i = n[e]),
                s = "wrapper" == a ? Jo(i) : void 0;
              c = s && li(s[0]) && 424 == s[1] && !s[4].length && 1 == s[9] ? c[Xo(s[0])].apply(c, s[3]) : 1 == i.length && li(i) ? c[a]() : c.thru(i);
            }
            return function () {
              var t = arguments,
                e = t[0];
              if (c && 1 == t.length && Du(e)) return c.plant(e).value();
              for (var o = 0, i = r ? n[o].apply(this, t) : e; ++o < r;) i = n[o].call(this, i);
              return i;
            };
          });
        }
        function Io(t, n, r, o, i, u, c, a, s, f) {
          var l = 128 & n,
            p = 1 & n,
            h = 2 & n,
            v = 24 & n,
            d = 512 & n,
            y = h ? void 0 : Ao(t);
          return function _() {
            for (var g = arguments.length, b = e(g), m = g; m--;) b[m] = arguments[m];
            if (v) var w = Ko(_),
              x = zn(b, w);
            if (o && (b = _o(b, o, i, v)), u && (b = go(b, u, c, v)), g -= x, v && g < f) {
              var j = Hn(b, w);
              return zo(t, n, Io, _.placeholder, r, b, j, a, s, f - g);
            }
            var E = p ? r : this,
              S = h ? E[t] : t;
            return g = b.length, a ? b = gi(b, a) : d && g > 1 && b.reverse(), l && s < g && (b.length = s), this && this !== Zt && this instanceof _ && (S = y || Ao(S)), S.apply(E, b);
          };
        }
        function Po(t, n) {
          return function (r, e) {
            return function (t, n, r, e) {
              return se(t, function (t, o, i) {
                n(e, r(t), o, i);
              }), e;
            }(r, t, n(e), {});
          };
        }
        function ko(t, n) {
          return function (r, e) {
            var o;
            if (void 0 === r && void 0 === e) return n;
            if (void 0 !== r && (o = r), void 0 !== e) {
              if (void 0 === o) return e;
              "string" == typeof r || "string" == typeof e ? (r = Ye(r), e = Ye(e)) : (r = Ke(r), e = Ke(e)), o = t(r, e);
            }
            return o;
          };
        }
        function Ro(t) {
          return Vo(function (n) {
            return n = dn(n, kn(Yo())), Le(function (r) {
              var e = this;
              return t(n, function (t) {
                return cn(t, e, r);
              });
            });
          });
        }
        function Do(t, n) {
          var r = (n = void 0 === n ? " " : Ye(n)).length;
          if (r < 2) return r ? Fe(n, t) : n;
          var e = Fe(n, tr(t / Gn(n)));
          return Mn(n) ? fo(Zn(e), 0, t).join("") : e.slice(0, t);
        }
        function Uo(t) {
          return function (n, r, o) {
            return o && "number" != typeof o && si(n, r, o) && (r = o = void 0), n = ec(n), void 0 === r ? (r = n, n = 0) : r = ec(r), function (t, n, r, o) {
              for (var i = -1, u = cr(tr((n - t) / (r || 1)), 0), c = e(u); u--;) c[o ? u : ++i] = t, t += r;
              return c;
            }(n, r, o = void 0 === o ? n < r ? 1 : -1 : ec(o), t);
          };
        }
        function No(t) {
          return function (n, r) {
            return "string" == typeof n && "string" == typeof r || (n = uc(n), r = uc(r)), t(n, r);
          };
        }
        function zo(t, n, r, e, o, i, u, c, a, s) {
          var f = 8 & n;
          n |= f ? 32 : 64, 4 & (n &= ~(f ? 64 : 32)) || (n &= -4);
          var l = [t, n, o, f ? i : void 0, f ? u : void 0, f ? void 0 : i, f ? void 0 : u, c, a, s],
            p = r.apply(void 0, l);
          return li(t) && mi(p, l), p.placeholder = e, ji(p, t, n);
        }
        function Fo(t) {
          var n = dt[t];
          return function (t, r) {
            if (t = uc(t), (r = null == r ? 0 : ar(oc(r), 292)) && or(t)) {
              var e = (ac(t) + "e").split("e");
              return +((e = (ac(n(e[0] + "e" + (+e[1] + r))) + "e").split("e"))[0] + "e" + (+e[1] - r));
            }
            return n(t);
          };
        }
        var Lo = yr && 1 / Wn(new yr([, -0]))[1] == 1 / 0 ? function (t) {
          return new yr(t);
        } : Yc;
        function qo(t) {
          return function (n) {
            var r = oi(n);
            return r == y ? $n(n) : r == m ? Vn(n) : function (t, n) {
              return dn(n, function (n) {
                return [n, t[n]];
              });
            }(n, t(n));
          };
        }
        function Mo(t, n, r, o, i, a, s, f) {
          var l = 2 & n;
          if (!l && "function" != typeof t) throw new bt(u);
          var p = o ? o.length : 0;
          if (p || (n &= -97, o = i = void 0), s = void 0 === s ? s : cr(oc(s), 0), f = void 0 === f ? f : oc(f), p -= i ? i.length : 0, 64 & n) {
            var h = o,
              v = i;
            o = i = void 0;
          }
          var d = l ? void 0 : Jo(t),
            y = [t, n, r, o, i, h, v, a, s, f];
          if (d && function (t, n) {
            var r = t[1],
              e = n[1],
              o = r | e,
              i = o < 131,
              u = 128 == e && 8 == r || 128 == e && 256 == r && t[7].length <= n[8] || 384 == e && n[7].length <= n[8] && 8 == r;
            if (!i && !u) return t;
            1 & e && (t[2] = n[2], o |= 1 & r ? 0 : 4);
            var a = n[3];
            if (a) {
              var s = t[3];
              t[3] = s ? _o(s, a, n[4]) : a, t[4] = s ? Hn(t[3], c) : n[4];
            }
            (a = n[5]) && (s = t[5], t[5] = s ? go(s, a, n[6]) : a, t[6] = s ? Hn(t[5], c) : n[6]);
            (a = n[7]) && (t[7] = a);
            128 & e && (t[8] = null == t[8] ? n[8] : ar(t[8], n[8]));
            null == t[9] && (t[9] = n[9]);
            t[0] = n[0], t[1] = o;
          }(y, d), t = y[0], n = y[1], r = y[2], o = y[3], i = y[4], !(f = y[9] = void 0 === y[9] ? l ? 0 : t.length : cr(y[9] - p, 0)) && 24 & n && (n &= -25), n && 1 != n) _ = 8 == n || 16 == n ? function (t, n, r) {
            var o = Ao(t);
            return function i() {
              for (var u = arguments.length, c = e(u), a = u, s = Ko(i); a--;) c[a] = arguments[a];
              var f = u < 3 && c[0] !== s && c[u - 1] !== s ? [] : Hn(c, s);
              if ((u -= f.length) < r) return zo(t, n, Io, i.placeholder, void 0, c, f, void 0, void 0, r - u);
              var l = this && this !== Zt && this instanceof i ? o : t;
              return cn(l, this, c);
            };
          }(t, n, f) : 32 != n && 33 != n || i.length ? Io.apply(void 0, y) : function (t, n, r, o) {
            var i = 1 & n,
              u = Ao(t);
            return function n() {
              for (var c = -1, a = arguments.length, s = -1, f = o.length, l = e(f + a), p = this && this !== Zt && this instanceof n ? u : t; ++s < f;) l[s] = o[s];
              for (; a--;) l[s++] = arguments[++c];
              return cn(p, i ? r : this, l);
            };
          }(t, n, r, o);else var _ = function (t, n, r) {
            var e = 1 & n,
              o = Ao(t);
            return function n() {
              var i = this && this !== Zt && this instanceof n ? o : t;
              return i.apply(e ? r : this, arguments);
            };
          }(t, n, r);
          return ji((d ? Be : mi)(_, y), t, n);
        }
        function $o(t, n, r, e) {
          return void 0 === t || Iu(t, xt[r]) && !St.call(e, r) ? n : t;
        }
        function Bo(t, n, r, e, o, i) {
          return Hu(t) && Hu(n) && (i.set(n, t), Pe(t, n, void 0, Bo, i), i.delete(n)), t;
        }
        function Ho(t) {
          return Zu(t) ? void 0 : t;
        }
        function Wo(t, n, r, e, o, i) {
          var u = 1 & r,
            c = t.length,
            a = n.length;
          if (c != a && !(u && a > c)) return !1;
          var s = i.get(t);
          if (s && i.get(n)) return s == n;
          var f = -1,
            l = !0,
            p = 2 & r ? new zr() : void 0;
          for (i.set(t, n), i.set(n, t); ++f < c;) {
            var h = t[f],
              v = n[f];
            if (e) var d = u ? e(v, h, f, n, t, i) : e(h, v, f, t, n, i);
            if (void 0 !== d) {
              if (d) continue;
              l = !1;
              break;
            }
            if (p) {
              if (!bn(n, function (t, n) {
                if (!Dn(p, n) && (h === t || o(h, t, r, e, i))) return p.push(n);
              })) {
                l = !1;
                break;
              }
            } else if (h !== v && !o(h, v, r, e, i)) {
              l = !1;
              break;
            }
          }
          return i.delete(t), i.delete(n), l;
        }
        function Vo(t) {
          return xi(yi(t, void 0, Ui), t + "");
        }
        function Go(t) {
          return he(t, wc, ri);
        }
        function Zo(t) {
          return he(t, xc, ei);
        }
        var Jo = br ? function (t) {
          return br.get(t);
        } : Yc;
        function Xo(t) {
          for (var n = t.name + "", r = mr[n], e = St.call(mr, n) ? r.length : 0; e--;) {
            var o = r[e],
              i = o.func;
            if (null == i || i == t) return o.name;
          }
          return n;
        }
        function Ko(t) {
          return (St.call(Cr, "placeholder") ? Cr : t).placeholder;
        }
        function Yo() {
          var t = Cr.iteratee || Zc;
          return t = t === Zc ? Ee : t, arguments.length ? t(arguments[0], arguments[1]) : t;
        }
        function Qo(t, n) {
          var r,
            e,
            o = t.__data__;
          return ("string" == (e = i(r = n)) || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== r : null === r) ? o["string" == typeof n ? "string" : "hash"] : o.map;
        }
        function ti(t) {
          for (var n = wc(t), r = n.length; r--;) {
            var e = n[r],
              o = t[e];
            n[r] = [e, o, vi(o)];
          }
          return n;
        }
        function ni(t, n) {
          var r = function (t, n) {
            return null == t ? void 0 : t[n];
          }(t, n);
          return je(r) ? r : void 0;
        }
        var ri = rr ? function (t) {
            return null == t ? [] : (t = yt(t), pn(rr(t), function (n) {
              return Jt.call(t, n);
            }));
          } : ia,
          ei = rr ? function (t) {
            for (var n = []; t;) yn(n, ri(t)), t = Vt(t);
            return n;
          } : ia,
          oi = ve;
        function ii(t, n, r) {
          for (var e = -1, o = (n = ao(n, t)).length, i = !1; ++e < o;) {
            var u = Ai(n[e]);
            if (!(i = null != t && r(t, u))) break;
            t = t[u];
          }
          return i || ++e != o ? i : !!(o = null == t ? 0 : t.length) && Bu(o) && ai(u, o) && (Du(t) || Ru(t));
        }
        function ui(t) {
          return "function" != typeof t.constructor || hi(t) ? {} : Ir(Vt(t));
        }
        function ci(t) {
          return Du(t) || Ru(t) || !!(Yt && t && t[Yt]);
        }
        function ai(t, n) {
          var r = i(t);
          return !!(n = null == n ? 9007199254740991 : n) && ("number" == r || "symbol" != r && st.test(t)) && t > -1 && t % 1 == 0 && t < n;
        }
        function si(t, n, r) {
          if (!Hu(r)) return !1;
          var e = i(n);
          return !!("number" == e ? Nu(r) && ai(n, r.length) : "string" == e && n in r) && Iu(r[n], t);
        }
        function fi(t, n) {
          if (Du(t)) return !1;
          var r = i(t);
          return !("number" != r && "symbol" != r && "boolean" != r && null != t && !Yu(t)) || W.test(t) || !H.test(t) || null != n && t in yt(n);
        }
        function li(t) {
          var n = Xo(t),
            r = Cr[n];
          if ("function" != typeof r || !(n in Rr.prototype)) return !1;
          if (t === r) return !0;
          var e = Jo(r);
          return !!e && t === e[0];
        }
        (hr && oi(new hr(new ArrayBuffer(1))) != S || vr && oi(new vr()) != y || dr && "[object Promise]" != oi(dr.resolve()) || yr && oi(new yr()) != m || _r && oi(new _r()) != j) && (oi = function (t) {
          var n = ve(t),
            r = n == g ? t.constructor : void 0,
            e = r ? Ti(r) : "";
          if (e) switch (e) {
            case wr:
              return S;
            case xr:
              return y;
            case jr:
              return "[object Promise]";
            case Er:
              return m;
            case Sr:
              return j;
          }
          return n;
        });
        var pi = jt ? Mu : ua;
        function hi(t) {
          var n = t && t.constructor;
          return t === ("function" == typeof n && n.prototype || xt);
        }
        function vi(t) {
          return t == t && !Hu(t);
        }
        function di(t, n) {
          return function (r) {
            return null != r && r[t] === n && (void 0 !== n || t in yt(r));
          };
        }
        function yi(t, n, r) {
          return n = cr(void 0 === n ? t.length - 1 : n, 0), function () {
            for (var o = arguments, i = -1, u = cr(o.length - n, 0), c = e(u); ++i < u;) c[i] = o[n + i];
            i = -1;
            for (var a = e(n + 1); ++i < n;) a[i] = o[i];
            return a[n] = r(c), cn(t, this, a);
          };
        }
        function _i(t, n) {
          return n.length < 2 ? t : pe(t, Ve(n, 0, -1));
        }
        function gi(t, n) {
          for (var r = t.length, e = ar(n.length, r), o = bo(t); e--;) {
            var i = n[e];
            t[e] = ai(i, r) ? o[i] : void 0;
          }
          return t;
        }
        function bi(t, n) {
          if (("constructor" !== n || "function" != typeof t[n]) && "__proto__" != n) return t[n];
        }
        var mi = Ei(Be),
          wi = Qn || function (t, n) {
            return Zt.setTimeout(t, n);
          },
          xi = Ei(He);
        function ji(t, n, r) {
          var e = n + "";
          return xi(t, function (t, n) {
            var r = n.length;
            if (!r) return t;
            var e = r - 1;
            return n[e] = (r > 1 ? "& " : "") + n[e], n = n.join(r > 2 ? ", " : " "), t.replace(Y, "{\n/* [wrapped with " + n + "] */\n");
          }(e, function (t, n) {
            return sn(a, function (r) {
              var e = "_." + r[0];
              n & r[1] && !hn(t, e) && t.push(e);
            }), t.sort();
          }(function (t) {
            var n = t.match(Q);
            return n ? n[1].split(tt) : [];
          }(e), r)));
        }
        function Ei(t) {
          var n = 0,
            r = 0;
          return function () {
            var e = sr(),
              o = 16 - (e - r);
            if (r = e, o > 0) {
              if (++n >= 800) return arguments[0];
            } else n = 0;
            return t.apply(void 0, arguments);
          };
        }
        function Si(t, n) {
          var r = -1,
            e = t.length,
            o = e - 1;
          for (n = void 0 === n ? e : n; ++r < n;) {
            var i = ze(r, o),
              u = t[i];
            t[i] = t[r], t[r] = u;
          }
          return t.length = n, t;
        }
        var Oi = function (t) {
          var n = Eu(t, function (t) {
              return 500 === r.size && r.clear(), t;
            }),
            r = n.cache;
          return n;
        }(function (t) {
          var n = [];
          return 46 === t.charCodeAt(0) && n.push(""), t.replace(V, function (t, r, e, o) {
            n.push(e ? o.replace(rt, "$1") : r || t);
          }), n;
        });
        function Ai(t) {
          if ("string" == typeof t || Yu(t)) return t;
          var n = t + "";
          return "0" == n && 1 / t == -1 / 0 ? "-0" : n;
        }
        function Ti(t) {
          if (null != t) {
            try {
              return Et.call(t);
            } catch (t) {}
            try {
              return t + "";
            } catch (t) {}
          }
          return "";
        }
        function Ci(t) {
          if (t instanceof Rr) return t.clone();
          var n = new kr(t.__wrapped__, t.__chain__);
          return n.__actions__ = bo(t.__actions__), n.__index__ = t.__index__, n.__values__ = t.__values__, n;
        }
        var Ii = Le(function (t, n) {
            return zu(t) ? te(t, ue(n, 1, zu, !0)) : [];
          }),
          Pi = Le(function (t, n) {
            var r = qi(n);
            return zu(r) && (r = void 0), zu(t) ? te(t, ue(n, 1, zu, !0), Yo(r, 2)) : [];
          }),
          ki = Le(function (t, n) {
            var r = qi(n);
            return zu(r) && (r = void 0), zu(t) ? te(t, ue(n, 1, zu, !0), void 0, r) : [];
          });
        function Ri(t, n, r) {
          var e = null == t ? 0 : t.length;
          if (!e) return -1;
          var o = null == r ? 0 : oc(r);
          return o < 0 && (o = cr(e + o, 0)), xn(t, Yo(n, 3), o);
        }
        function Di(t, n, r) {
          var e = null == t ? 0 : t.length;
          if (!e) return -1;
          var o = e - 1;
          return void 0 !== r && (o = oc(r), o = r < 0 ? cr(e + o, 0) : ar(o, e - 1)), xn(t, Yo(n, 3), o, !0);
        }
        function Ui(t) {
          return (null == t ? 0 : t.length) ? ue(t, 1) : [];
        }
        function Ni(t) {
          return t && t.length ? t[0] : void 0;
        }
        var zi = Le(function (t) {
            var n = dn(t, uo);
            return n.length && n[0] === t[0] ? ge(n) : [];
          }),
          Fi = Le(function (t) {
            var n = qi(t),
              r = dn(t, uo);
            return n === qi(r) ? n = void 0 : r.pop(), r.length && r[0] === t[0] ? ge(r, Yo(n, 2)) : [];
          }),
          Li = Le(function (t) {
            var n = qi(t),
              r = dn(t, uo);
            return (n = "function" == typeof n ? n : void 0) && r.pop(), r.length && r[0] === t[0] ? ge(r, void 0, n) : [];
          });
        function qi(t) {
          var n = null == t ? 0 : t.length;
          return n ? t[n - 1] : void 0;
        }
        var Mi = Le($i);
        function $i(t, n) {
          return t && t.length && n && n.length ? Ue(t, n) : t;
        }
        var Bi = Vo(function (t, n) {
          var r = null == t ? 0 : t.length,
            e = Jr(t, n);
          return Ne(t, dn(n, function (t) {
            return ai(t, r) ? +t : t;
          }).sort(yo)), e;
        });
        function Hi(t) {
          return null == t ? t : pr.call(t);
        }
        var Wi = Le(function (t) {
            return Qe(ue(t, 1, zu, !0));
          }),
          Vi = Le(function (t) {
            var n = qi(t);
            return zu(n) && (n = void 0), Qe(ue(t, 1, zu, !0), Yo(n, 2));
          }),
          Gi = Le(function (t) {
            var n = qi(t);
            return n = "function" == typeof n ? n : void 0, Qe(ue(t, 1, zu, !0), void 0, n);
          });
        function Zi(t) {
          if (!t || !t.length) return [];
          var n = 0;
          return t = pn(t, function (t) {
            if (zu(t)) return n = cr(t.length, n), !0;
          }), Pn(n, function (n) {
            return dn(t, An(n));
          });
        }
        function Ji(t, n) {
          if (!t || !t.length) return [];
          var r = Zi(t);
          return null == n ? r : dn(r, function (t) {
            return cn(n, void 0, t);
          });
        }
        var Xi = Le(function (t, n) {
            return zu(t) ? te(t, n) : [];
          }),
          Ki = Le(function (t) {
            return oo(pn(t, zu));
          }),
          Yi = Le(function (t) {
            var n = qi(t);
            return zu(n) && (n = void 0), oo(pn(t, zu), Yo(n, 2));
          }),
          Qi = Le(function (t) {
            var n = qi(t);
            return n = "function" == typeof n ? n : void 0, oo(pn(t, zu), void 0, n);
          }),
          tu = Le(Zi);
        var nu = Le(function (t) {
          var n = t.length,
            r = n > 1 ? t[n - 1] : void 0;
          return r = "function" == typeof r ? (t.pop(), r) : void 0, Ji(t, r);
        });
        function ru(t) {
          var n = Cr(t);
          return n.__chain__ = !0, n;
        }
        function eu(t, n) {
          return n(t);
        }
        var ou = Vo(function (t) {
          var n = t.length,
            r = n ? t[0] : 0,
            e = this.__wrapped__,
            o = function (n) {
              return Jr(n, t);
            };
          return !(n > 1 || this.__actions__.length) && e instanceof Rr && ai(r) ? ((e = e.slice(r, +r + (n ? 1 : 0))).__actions__.push({
            func: eu,
            args: [o],
            thisArg: void 0
          }), new kr(e, this.__chain__).thru(function (t) {
            return n && !t.length && t.push(void 0), t;
          })) : this.thru(o);
        });
        var iu = wo(function (t, n, r) {
          St.call(t, r) ? ++t[r] : Zr(t, r, 1);
        });
        var uu = To(Ri),
          cu = To(Di);
        function au(t, n) {
          return (Du(t) ? sn : ne)(t, Yo(n, 3));
        }
        function su(t, n) {
          return (Du(t) ? fn : re)(t, Yo(n, 3));
        }
        var fu = wo(function (t, n, r) {
          St.call(t, r) ? t[r].push(n) : Zr(t, r, [n]);
        });
        var lu = Le(function (t, n, r) {
            var o = -1,
              i = "function" == typeof n,
              u = Nu(t) ? e(t.length) : [];
            return ne(t, function (t) {
              u[++o] = i ? cn(n, t, r) : be(t, n, r);
            }), u;
          }),
          pu = wo(function (t, n, r) {
            Zr(t, r, n);
          });
        function hu(t, n) {
          return (Du(t) ? dn : Te)(t, Yo(n, 3));
        }
        var vu = wo(function (t, n, r) {
          t[r ? 0 : 1].push(n);
        }, function () {
          return [[], []];
        });
        var du = Le(function (t, n) {
            if (null == t) return [];
            var r = n.length;
            return r > 1 && si(t, n[0], n[1]) ? n = [] : r > 2 && si(n[0], n[1], n[2]) && (n = [n[0]]), Re(t, ue(n, 1), []);
          }),
          yu = Yn || function () {
            return Zt.Date.now();
          };
        function _u(t, n, r) {
          return n = r ? void 0 : n, Mo(t, 128, void 0, void 0, void 0, void 0, n = t && null == n ? t.length : n);
        }
        function gu(t, n) {
          var r;
          if ("function" != typeof n) throw new bt(u);
          return t = oc(t), function () {
            return --t > 0 && (r = n.apply(this, arguments)), t <= 1 && (n = void 0), r;
          };
        }
        var bu = Le(function (t, n, r) {
            var e = 1;
            if (r.length) {
              var o = Hn(r, Ko(bu));
              e |= 32;
            }
            return Mo(t, e, n, r, o);
          }),
          mu = Le(function (t, n, r) {
            var e = 3;
            if (r.length) {
              var o = Hn(r, Ko(mu));
              e |= 32;
            }
            return Mo(n, e, t, r, o);
          });
        function wu(t, n, r) {
          var e,
            o,
            i,
            c,
            a,
            s,
            f = 0,
            l = !1,
            p = !1,
            h = !0;
          if ("function" != typeof t) throw new bt(u);
          function v(n) {
            var r = e,
              i = o;
            return e = o = void 0, f = n, c = t.apply(i, r);
          }
          function d(t) {
            return f = t, a = wi(_, n), l ? v(t) : c;
          }
          function y(t) {
            var r = t - s;
            return void 0 === s || r >= n || r < 0 || p && t - f >= i;
          }
          function _() {
            var t = yu();
            if (y(t)) return g(t);
            a = wi(_, function (t) {
              var r = n - (t - s);
              return p ? ar(r, i - (t - f)) : r;
            }(t));
          }
          function g(t) {
            return a = void 0, h && e ? v(t) : (e = o = void 0, c);
          }
          function b() {
            var t = yu(),
              r = y(t);
            if (e = arguments, o = this, s = t, r) {
              if (void 0 === a) return d(s);
              if (p) return lo(a), a = wi(_, n), v(s);
            }
            return void 0 === a && (a = wi(_, n)), c;
          }
          return n = uc(n) || 0, Hu(r) && (l = !!r.leading, i = (p = "maxWait" in r) ? cr(uc(r.maxWait) || 0, n) : i, h = "trailing" in r ? !!r.trailing : h), b.cancel = function () {
            void 0 !== a && lo(a), f = 0, e = s = o = a = void 0;
          }, b.flush = function () {
            return void 0 === a ? c : g(yu());
          }, b;
        }
        var xu = Le(function (t, n) {
            return Qr(t, 1, n);
          }),
          ju = Le(function (t, n, r) {
            return Qr(t, uc(n) || 0, r);
          });
        function Eu(t, n) {
          if ("function" != typeof t || null != n && "function" != typeof n) throw new bt(u);
          var r = function r() {
            var e = arguments,
              o = n ? n.apply(this, e) : e[0],
              i = r.cache;
            if (i.has(o)) return i.get(o);
            var u = t.apply(this, e);
            return r.cache = i.set(o, u) || i, u;
          };
          return r.cache = new (Eu.Cache || Nr)(), r;
        }
        function Su(t) {
          if ("function" != typeof t) throw new bt(u);
          return function () {
            var n = arguments;
            switch (n.length) {
              case 0:
                return !t.call(this);
              case 1:
                return !t.call(this, n[0]);
              case 2:
                return !t.call(this, n[0], n[1]);
              case 3:
                return !t.call(this, n[0], n[1], n[2]);
            }
            return !t.apply(this, n);
          };
        }
        Eu.Cache = Nr;
        var Ou = so(function (t, n) {
            var r = (n = 1 == n.length && Du(n[0]) ? dn(n[0], kn(Yo())) : dn(ue(n, 1), kn(Yo()))).length;
            return Le(function (e) {
              for (var o = -1, i = ar(e.length, r); ++o < i;) e[o] = n[o].call(this, e[o]);
              return cn(t, this, e);
            });
          }),
          Au = Le(function (t, n) {
            return Mo(t, 32, void 0, n, Hn(n, Ko(Au)));
          }),
          Tu = Le(function (t, n) {
            return Mo(t, 64, void 0, n, Hn(n, Ko(Tu)));
          }),
          Cu = Vo(function (t, n) {
            return Mo(t, 256, void 0, void 0, void 0, n);
          });
        function Iu(t, n) {
          return t === n || t != t && n != n;
        }
        var Pu = No(de),
          ku = No(function (t, n) {
            return t >= n;
          }),
          Ru = me(function () {
            return arguments;
          }()) ? me : function (t) {
            return Wu(t) && St.call(t, "callee") && !Jt.call(t, "callee");
          },
          Du = e.isArray,
          Uu = tn ? kn(tn) : function (t) {
            return Wu(t) && ve(t) == E;
          };
        function Nu(t) {
          return null != t && Bu(t.length) && !Mu(t);
        }
        function zu(t) {
          return Wu(t) && Nu(t);
        }
        var Fu = er || ua,
          Lu = nn ? kn(nn) : function (t) {
            return Wu(t) && ve(t) == p;
          };
        function qu(t) {
          if (!Wu(t)) return !1;
          var n = ve(t);
          return n == h || "[object DOMException]" == n || "string" == typeof t.message && "string" == typeof t.name && !Zu(t);
        }
        function Mu(t) {
          if (!Hu(t)) return !1;
          var n = ve(t);
          return n == v || n == d || "[object AsyncFunction]" == n || "[object Proxy]" == n;
        }
        function $u(t) {
          return "number" == typeof t && t == oc(t);
        }
        function Bu(t) {
          return "number" == typeof t && t > -1 && t % 1 == 0 && t <= 9007199254740991;
        }
        function Hu(t) {
          var n = i(t);
          return null != t && ("object" == n || "function" == n);
        }
        function Wu(t) {
          return null != t && "object" == i(t);
        }
        var Vu = rn ? kn(rn) : function (t) {
          return Wu(t) && oi(t) == y;
        };
        function Gu(t) {
          return "number" == typeof t || Wu(t) && ve(t) == _;
        }
        function Zu(t) {
          if (!Wu(t) || ve(t) != g) return !1;
          var n = Vt(t);
          if (null === n) return !0;
          var r = St.call(n, "constructor") && n.constructor;
          return "function" == typeof r && r instanceof r && Et.call(r) == Ct;
        }
        var Ju = en ? kn(en) : function (t) {
          return Wu(t) && ve(t) == b;
        };
        var Xu = on ? kn(on) : function (t) {
          return Wu(t) && oi(t) == m;
        };
        function Ku(t) {
          return "string" == typeof t || !Du(t) && Wu(t) && ve(t) == w;
        }
        function Yu(t) {
          return "symbol" == i(t) || Wu(t) && ve(t) == x;
        }
        var Qu = un ? kn(un) : function (t) {
          return Wu(t) && Bu(t.length) && !!Mt[ve(t)];
        };
        var tc = No(Ae),
          nc = No(function (t, n) {
            return t <= n;
          });
        function rc(t) {
          if (!t) return [];
          if (Nu(t)) return Ku(t) ? Zn(t) : bo(t);
          if (Qt && t[Qt]) return function (t) {
            for (var n, r = []; !(n = t.next()).done;) r.push(n.value);
            return r;
          }(t[Qt]());
          var n = oi(t);
          return (n == y ? $n : n == m ? Wn : Ic)(t);
        }
        function ec(t) {
          return t ? (t = uc(t)) === 1 / 0 || t === -1 / 0 ? 17976931348623157e292 * (t < 0 ? -1 : 1) : t == t ? t : 0 : 0 === t ? t : 0;
        }
        function oc(t) {
          var n = ec(t),
            r = n % 1;
          return n == n ? r ? n - r : n : 0;
        }
        function ic(t) {
          return t ? Xr(oc(t), 0, 4294967295) : 0;
        }
        function uc(t) {
          if ("number" == typeof t) return t;
          if (Yu(t)) return NaN;
          if (Hu(t)) {
            var n = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = Hu(n) ? n + "" : n;
          }
          if ("string" != typeof t) return 0 === t ? t : +t;
          t = t.replace(J, "");
          var r = ut.test(t);
          return r || at.test(t) ? Wt(t.slice(2), r ? 2 : 8) : it.test(t) ? NaN : +t;
        }
        function cc(t) {
          return mo(t, xc(t));
        }
        function ac(t) {
          return null == t ? "" : Ye(t);
        }
        var sc = xo(function (t, n) {
            if (hi(n) || Nu(n)) mo(n, wc(n), t);else for (var r in n) St.call(n, r) && Hr(t, r, n[r]);
          }),
          fc = xo(function (t, n) {
            mo(n, xc(n), t);
          }),
          lc = xo(function (t, n, r, e) {
            mo(n, xc(n), t, e);
          }),
          pc = xo(function (t, n, r, e) {
            mo(n, wc(n), t, e);
          }),
          hc = Vo(Jr);
        var vc = Le(function (t, n) {
            t = yt(t);
            var r = -1,
              e = n.length,
              o = e > 2 ? n[2] : void 0;
            for (o && si(n[0], n[1], o) && (e = 1); ++r < e;) for (var i = n[r], u = xc(i), c = -1, a = u.length; ++c < a;) {
              var s = u[c],
                f = t[s];
              (void 0 === f || Iu(f, xt[s]) && !St.call(t, s)) && (t[s] = i[s]);
            }
            return t;
          }),
          dc = Le(function (t) {
            return t.push(void 0, Bo), cn(Ec, void 0, t);
          });
        function yc(t, n, r) {
          var e = null == t ? void 0 : pe(t, n);
          return void 0 === e ? r : e;
        }
        function _c(t, n) {
          return null != t && ii(t, n, _e);
        }
        var gc = Po(function (t, n, r) {
            null != n && "function" != typeof n.toString && (n = Tt.call(n)), t[n] = r;
          }, Hc(Gc)),
          bc = Po(function (t, n, r) {
            null != n && "function" != typeof n.toString && (n = Tt.call(n)), St.call(t, n) ? t[n].push(r) : t[n] = [r];
          }, Yo),
          mc = Le(be);
        function wc(t) {
          return Nu(t) ? Lr(t) : Se(t);
        }
        function xc(t) {
          return Nu(t) ? Lr(t, !0) : Oe(t);
        }
        var jc = xo(function (t, n, r) {
            Pe(t, n, r);
          }),
          Ec = xo(function (t, n, r, e) {
            Pe(t, n, r, e);
          }),
          Sc = Vo(function (t, n) {
            var r = {};
            if (null == t) return r;
            var e = !1;
            n = dn(n, function (n) {
              return n = ao(n, t), e || (e = n.length > 1), n;
            }), mo(t, Zo(t), r), e && (r = Kr(r, 7, Ho));
            for (var o = n.length; o--;) to(r, n[o]);
            return r;
          });
        var Oc = Vo(function (t, n) {
          return null == t ? {} : function (t, n) {
            return De(t, n, function (n, r) {
              return _c(t, r);
            });
          }(t, n);
        });
        function Ac(t, n) {
          if (null == t) return {};
          var r = dn(Zo(t), function (t) {
            return [t];
          });
          return n = Yo(n), De(t, r, function (t, r) {
            return n(t, r[0]);
          });
        }
        var Tc = qo(wc),
          Cc = qo(xc);
        function Ic(t) {
          return null == t ? [] : Rn(t, wc(t));
        }
        var Pc = Oo(function (t, n, r) {
          return n = n.toLowerCase(), t + (r ? kc(n) : n);
        });
        function kc(t) {
          return qc(ac(t).toLowerCase());
        }
        function Rc(t) {
          return (t = ac(t)) && t.replace(ft, Fn).replace(Dt, "");
        }
        var Dc = Oo(function (t, n, r) {
            return t + (r ? "-" : "") + n.toLowerCase();
          }),
          Uc = Oo(function (t, n, r) {
            return t + (r ? " " : "") + n.toLowerCase();
          }),
          Nc = So("toLowerCase");
        var zc = Oo(function (t, n, r) {
          return t + (r ? "_" : "") + n.toLowerCase();
        });
        var Fc = Oo(function (t, n, r) {
          return t + (r ? " " : "") + qc(n);
        });
        var Lc = Oo(function (t, n, r) {
            return t + (r ? " " : "") + n.toUpperCase();
          }),
          qc = So("toUpperCase");
        function Mc(t, n, r) {
          return t = ac(t), void 0 === (n = r ? void 0 : n) ? function (t) {
            return Ft.test(t);
          }(t) ? function (t) {
            return t.match(Nt) || [];
          }(t) : function (t) {
            return t.match(nt) || [];
          }(t) : t.match(n) || [];
        }
        var $c = Le(function (t, n) {
            try {
              return cn(t, void 0, n);
            } catch (t) {
              return qu(t) ? t : new ht(t);
            }
          }),
          Bc = Vo(function (t, n) {
            return sn(n, function (n) {
              n = Ai(n), Zr(t, n, bu(t[n], t));
            }), t;
          });
        function Hc(t) {
          return function () {
            return t;
          };
        }
        var Wc = Co(),
          Vc = Co(!0);
        function Gc(t) {
          return t;
        }
        function Zc(t) {
          return Ee("function" == typeof t ? t : Kr(t, 1));
        }
        var Jc = Le(function (t, n) {
            return function (r) {
              return be(r, t, n);
            };
          }),
          Xc = Le(function (t, n) {
            return function (r) {
              return be(t, r, n);
            };
          });
        function Kc(t, n, r) {
          var e = wc(n),
            o = le(n, e);
          null != r || Hu(n) && (o.length || !e.length) || (r = n, n = t, t = this, o = le(n, wc(n)));
          var i = !(Hu(r) && "chain" in r && !r.chain),
            u = Mu(t);
          return sn(o, function (r) {
            var e = n[r];
            t[r] = e, u && (t.prototype[r] = function () {
              var n = this.__chain__;
              if (i || n) {
                var r = t(this.__wrapped__),
                  o = r.__actions__ = bo(this.__actions__);
                return o.push({
                  func: e,
                  args: arguments,
                  thisArg: t
                }), r.__chain__ = n, r;
              }
              return e.apply(t, yn([this.value()], arguments));
            });
          }), t;
        }
        function Yc() {}
        var Qc = Ro(dn),
          ta = Ro(ln),
          na = Ro(bn);
        function ra(t) {
          return fi(t) ? An(Ai(t)) : function (t) {
            return function (n) {
              return pe(n, t);
            };
          }(t);
        }
        var ea = Uo(),
          oa = Uo(!0);
        function ia() {
          return [];
        }
        function ua() {
          return !1;
        }
        var ca = ko(function (t, n) {
            return t + n;
          }, 0),
          aa = Fo("ceil"),
          sa = ko(function (t, n) {
            return t / n;
          }, 1),
          fa = Fo("floor");
        var la,
          pa = ko(function (t, n) {
            return t * n;
          }, 1),
          ha = Fo("round"),
          va = ko(function (t, n) {
            return t - n;
          }, 0);
        return Cr.after = function (t, n) {
          if ("function" != typeof n) throw new bt(u);
          return t = oc(t), function () {
            if (--t < 1) return n.apply(this, arguments);
          };
        }, Cr.ary = _u, Cr.assign = sc, Cr.assignIn = fc, Cr.assignInWith = lc, Cr.assignWith = pc, Cr.at = hc, Cr.before = gu, Cr.bind = bu, Cr.bindAll = Bc, Cr.bindKey = mu, Cr.castArray = function () {
          if (!arguments.length) return [];
          var t = arguments[0];
          return Du(t) ? t : [t];
        }, Cr.chain = ru, Cr.chunk = function (t, n, r) {
          n = (r ? si(t, n, r) : void 0 === n) ? 1 : cr(oc(n), 0);
          var o = null == t ? 0 : t.length;
          if (!o || n < 1) return [];
          for (var i = 0, u = 0, c = e(tr(o / n)); i < o;) c[u++] = Ve(t, i, i += n);
          return c;
        }, Cr.compact = function (t) {
          for (var n = -1, r = null == t ? 0 : t.length, e = 0, o = []; ++n < r;) {
            var i = t[n];
            i && (o[e++] = i);
          }
          return o;
        }, Cr.concat = function () {
          var t = arguments.length;
          if (!t) return [];
          for (var n = e(t - 1), r = arguments[0], o = t; o--;) n[o - 1] = arguments[o];
          return yn(Du(r) ? bo(r) : [r], ue(n, 1));
        }, Cr.cond = function (t) {
          var n = null == t ? 0 : t.length,
            r = Yo();
          return t = n ? dn(t, function (t) {
            if ("function" != typeof t[1]) throw new bt(u);
            return [r(t[0]), t[1]];
          }) : [], Le(function (r) {
            for (var e = -1; ++e < n;) {
              var o = t[e];
              if (cn(o[0], this, r)) return cn(o[1], this, r);
            }
          });
        }, Cr.conforms = function (t) {
          return function (t) {
            var n = wc(t);
            return function (r) {
              return Yr(r, t, n);
            };
          }(Kr(t, 1));
        }, Cr.constant = Hc, Cr.countBy = iu, Cr.create = function (t, n) {
          var r = Ir(t);
          return null == n ? r : Gr(r, n);
        }, Cr.curry = function t(n, r, e) {
          var o = Mo(n, 8, void 0, void 0, void 0, void 0, void 0, r = e ? void 0 : r);
          return o.placeholder = t.placeholder, o;
        }, Cr.curryRight = function t(n, r, e) {
          var o = Mo(n, 16, void 0, void 0, void 0, void 0, void 0, r = e ? void 0 : r);
          return o.placeholder = t.placeholder, o;
        }, Cr.debounce = wu, Cr.defaults = vc, Cr.defaultsDeep = dc, Cr.defer = xu, Cr.delay = ju, Cr.difference = Ii, Cr.differenceBy = Pi, Cr.differenceWith = ki, Cr.drop = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          return e ? Ve(t, (n = r || void 0 === n ? 1 : oc(n)) < 0 ? 0 : n, e) : [];
        }, Cr.dropRight = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          return e ? Ve(t, 0, (n = e - (n = r || void 0 === n ? 1 : oc(n))) < 0 ? 0 : n) : [];
        }, Cr.dropRightWhile = function (t, n) {
          return t && t.length ? ro(t, Yo(n, 3), !0, !0) : [];
        }, Cr.dropWhile = function (t, n) {
          return t && t.length ? ro(t, Yo(n, 3), !0) : [];
        }, Cr.fill = function (t, n, r, e) {
          var o = null == t ? 0 : t.length;
          return o ? (r && "number" != typeof r && si(t, n, r) && (r = 0, e = o), function (t, n, r, e) {
            var o = t.length;
            for ((r = oc(r)) < 0 && (r = -r > o ? 0 : o + r), (e = void 0 === e || e > o ? o : oc(e)) < 0 && (e += o), e = r > e ? 0 : ic(e); r < e;) t[r++] = n;
            return t;
          }(t, n, r, e)) : [];
        }, Cr.filter = function (t, n) {
          return (Du(t) ? pn : ie)(t, Yo(n, 3));
        }, Cr.flatMap = function (t, n) {
          return ue(hu(t, n), 1);
        }, Cr.flatMapDeep = function (t, n) {
          return ue(hu(t, n), 1 / 0);
        }, Cr.flatMapDepth = function (t, n, r) {
          return r = void 0 === r ? 1 : oc(r), ue(hu(t, n), r);
        }, Cr.flatten = Ui, Cr.flattenDeep = function (t) {
          return (null == t ? 0 : t.length) ? ue(t, 1 / 0) : [];
        }, Cr.flattenDepth = function (t, n) {
          return (null == t ? 0 : t.length) ? ue(t, n = void 0 === n ? 1 : oc(n)) : [];
        }, Cr.flip = function (t) {
          return Mo(t, 512);
        }, Cr.flow = Wc, Cr.flowRight = Vc, Cr.fromPairs = function (t) {
          for (var n = -1, r = null == t ? 0 : t.length, e = {}; ++n < r;) {
            var o = t[n];
            e[o[0]] = o[1];
          }
          return e;
        }, Cr.functions = function (t) {
          return null == t ? [] : le(t, wc(t));
        }, Cr.functionsIn = function (t) {
          return null == t ? [] : le(t, xc(t));
        }, Cr.groupBy = fu, Cr.initial = function (t) {
          return (null == t ? 0 : t.length) ? Ve(t, 0, -1) : [];
        }, Cr.intersection = zi, Cr.intersectionBy = Fi, Cr.intersectionWith = Li, Cr.invert = gc, Cr.invertBy = bc, Cr.invokeMap = lu, Cr.iteratee = Zc, Cr.keyBy = pu, Cr.keys = wc, Cr.keysIn = xc, Cr.map = hu, Cr.mapKeys = function (t, n) {
          var r = {};
          return n = Yo(n, 3), se(t, function (t, e, o) {
            Zr(r, n(t, e, o), t);
          }), r;
        }, Cr.mapValues = function (t, n) {
          var r = {};
          return n = Yo(n, 3), se(t, function (t, e, o) {
            Zr(r, e, n(t, e, o));
          }), r;
        }, Cr.matches = function (t) {
          return Ce(Kr(t, 1));
        }, Cr.matchesProperty = function (t, n) {
          return Ie(t, Kr(n, 1));
        }, Cr.memoize = Eu, Cr.merge = jc, Cr.mergeWith = Ec, Cr.method = Jc, Cr.methodOf = Xc, Cr.mixin = Kc, Cr.negate = Su, Cr.nthArg = function (t) {
          return t = oc(t), Le(function (n) {
            return ke(n, t);
          });
        }, Cr.omit = Sc, Cr.omitBy = function (t, n) {
          return Ac(t, Su(Yo(n)));
        }, Cr.once = function (t) {
          return gu(2, t);
        }, Cr.orderBy = function (t, n, r, e) {
          return null == t ? [] : (Du(n) || (n = null == n ? [] : [n]), Du(r = e ? void 0 : r) || (r = null == r ? [] : [r]), Re(t, n, r));
        }, Cr.over = Qc, Cr.overArgs = Ou, Cr.overEvery = ta, Cr.overSome = na, Cr.partial = Au, Cr.partialRight = Tu, Cr.partition = vu, Cr.pick = Oc, Cr.pickBy = Ac, Cr.property = ra, Cr.propertyOf = function (t) {
          return function (n) {
            return null == t ? void 0 : pe(t, n);
          };
        }, Cr.pull = Mi, Cr.pullAll = $i, Cr.pullAllBy = function (t, n, r) {
          return t && t.length && n && n.length ? Ue(t, n, Yo(r, 2)) : t;
        }, Cr.pullAllWith = function (t, n, r) {
          return t && t.length && n && n.length ? Ue(t, n, void 0, r) : t;
        }, Cr.pullAt = Bi, Cr.range = ea, Cr.rangeRight = oa, Cr.rearg = Cu, Cr.reject = function (t, n) {
          return (Du(t) ? pn : ie)(t, Su(Yo(n, 3)));
        }, Cr.remove = function (t, n) {
          var r = [];
          if (!t || !t.length) return r;
          var e = -1,
            o = [],
            i = t.length;
          for (n = Yo(n, 3); ++e < i;) {
            var u = t[e];
            n(u, e, t) && (r.push(u), o.push(e));
          }
          return Ne(t, o), r;
        }, Cr.rest = function (t, n) {
          if ("function" != typeof t) throw new bt(u);
          return Le(t, n = void 0 === n ? n : oc(n));
        }, Cr.reverse = Hi, Cr.sampleSize = function (t, n, r) {
          return n = (r ? si(t, n, r) : void 0 === n) ? 1 : oc(n), (Du(t) ? Mr : Me)(t, n);
        }, Cr.set = function (t, n, r) {
          return null == t ? t : $e(t, n, r);
        }, Cr.setWith = function (t, n, r, e) {
          return e = "function" == typeof e ? e : void 0, null == t ? t : $e(t, n, r, e);
        }, Cr.shuffle = function (t) {
          return (Du(t) ? $r : We)(t);
        }, Cr.slice = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          return e ? (r && "number" != typeof r && si(t, n, r) ? (n = 0, r = e) : (n = null == n ? 0 : oc(n), r = void 0 === r ? e : oc(r)), Ve(t, n, r)) : [];
        }, Cr.sortBy = du, Cr.sortedUniq = function (t) {
          return t && t.length ? Xe(t) : [];
        }, Cr.sortedUniqBy = function (t, n) {
          return t && t.length ? Xe(t, Yo(n, 2)) : [];
        }, Cr.split = function (t, n, r) {
          return r && "number" != typeof r && si(t, n, r) && (n = r = void 0), (r = void 0 === r ? 4294967295 : r >>> 0) ? (t = ac(t)) && ("string" == typeof n || null != n && !Ju(n)) && !(n = Ye(n)) && Mn(t) ? fo(Zn(t), 0, r) : t.split(n, r) : [];
        }, Cr.spread = function (t, n) {
          if ("function" != typeof t) throw new bt(u);
          return n = null == n ? 0 : cr(oc(n), 0), Le(function (r) {
            var e = r[n],
              o = fo(r, 0, n);
            return e && yn(o, e), cn(t, this, o);
          });
        }, Cr.tail = function (t) {
          var n = null == t ? 0 : t.length;
          return n ? Ve(t, 1, n) : [];
        }, Cr.take = function (t, n, r) {
          return t && t.length ? Ve(t, 0, (n = r || void 0 === n ? 1 : oc(n)) < 0 ? 0 : n) : [];
        }, Cr.takeRight = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          return e ? Ve(t, (n = e - (n = r || void 0 === n ? 1 : oc(n))) < 0 ? 0 : n, e) : [];
        }, Cr.takeRightWhile = function (t, n) {
          return t && t.length ? ro(t, Yo(n, 3), !1, !0) : [];
        }, Cr.takeWhile = function (t, n) {
          return t && t.length ? ro(t, Yo(n, 3)) : [];
        }, Cr.tap = function (t, n) {
          return n(t), t;
        }, Cr.throttle = function (t, n, r) {
          var e = !0,
            o = !0;
          if ("function" != typeof t) throw new bt(u);
          return Hu(r) && (e = "leading" in r ? !!r.leading : e, o = "trailing" in r ? !!r.trailing : o), wu(t, n, {
            leading: e,
            maxWait: n,
            trailing: o
          });
        }, Cr.thru = eu, Cr.toArray = rc, Cr.toPairs = Tc, Cr.toPairsIn = Cc, Cr.toPath = function (t) {
          return Du(t) ? dn(t, Ai) : Yu(t) ? [t] : bo(Oi(ac(t)));
        }, Cr.toPlainObject = cc, Cr.transform = function (t, n, r) {
          var e = Du(t),
            o = e || Fu(t) || Qu(t);
          if (n = Yo(n, 4), null == r) {
            var i = t && t.constructor;
            r = o ? e ? new i() : [] : Hu(t) && Mu(i) ? Ir(Vt(t)) : {};
          }
          return (o ? sn : se)(t, function (t, e, o) {
            return n(r, t, e, o);
          }), r;
        }, Cr.unary = function (t) {
          return _u(t, 1);
        }, Cr.union = Wi, Cr.unionBy = Vi, Cr.unionWith = Gi, Cr.uniq = function (t) {
          return t && t.length ? Qe(t) : [];
        }, Cr.uniqBy = function (t, n) {
          return t && t.length ? Qe(t, Yo(n, 2)) : [];
        }, Cr.uniqWith = function (t, n) {
          return n = "function" == typeof n ? n : void 0, t && t.length ? Qe(t, void 0, n) : [];
        }, Cr.unset = function (t, n) {
          return null == t || to(t, n);
        }, Cr.unzip = Zi, Cr.unzipWith = Ji, Cr.update = function (t, n, r) {
          return null == t ? t : no(t, n, co(r));
        }, Cr.updateWith = function (t, n, r, e) {
          return e = "function" == typeof e ? e : void 0, null == t ? t : no(t, n, co(r), e);
        }, Cr.values = Ic, Cr.valuesIn = function (t) {
          return null == t ? [] : Rn(t, xc(t));
        }, Cr.without = Xi, Cr.words = Mc, Cr.wrap = function (t, n) {
          return Au(co(n), t);
        }, Cr.xor = Ki, Cr.xorBy = Yi, Cr.xorWith = Qi, Cr.zip = tu, Cr.zipObject = function (t, n) {
          return io(t || [], n || [], Hr);
        }, Cr.zipObjectDeep = function (t, n) {
          return io(t || [], n || [], $e);
        }, Cr.zipWith = nu, Cr.entries = Tc, Cr.entriesIn = Cc, Cr.extend = fc, Cr.extendWith = lc, Kc(Cr, Cr), Cr.add = ca, Cr.attempt = $c, Cr.camelCase = Pc, Cr.capitalize = kc, Cr.ceil = aa, Cr.clamp = function (t, n, r) {
          return void 0 === r && (r = n, n = void 0), void 0 !== r && (r = (r = uc(r)) == r ? r : 0), void 0 !== n && (n = (n = uc(n)) == n ? n : 0), Xr(uc(t), n, r);
        }, Cr.clone = function (t) {
          return Kr(t, 4);
        }, Cr.cloneDeep = function (t) {
          return Kr(t, 5);
        }, Cr.cloneDeepWith = function (t, n) {
          return Kr(t, 5, n = "function" == typeof n ? n : void 0);
        }, Cr.cloneWith = function (t, n) {
          return Kr(t, 4, n = "function" == typeof n ? n : void 0);
        }, Cr.conformsTo = function (t, n) {
          return null == n || Yr(t, n, wc(n));
        }, Cr.deburr = Rc, Cr.defaultTo = function (t, n) {
          return null == t || t != t ? n : t;
        }, Cr.divide = sa, Cr.endsWith = function (t, n, r) {
          t = ac(t), n = Ye(n);
          var e = t.length,
            o = r = void 0 === r ? e : Xr(oc(r), 0, e);
          return (r -= n.length) >= 0 && t.slice(r, o) == n;
        }, Cr.eq = Iu, Cr.escape = function (t) {
          return (t = ac(t)) && q.test(t) ? t.replace(F, Ln) : t;
        }, Cr.escapeRegExp = function (t) {
          return (t = ac(t)) && Z.test(t) ? t.replace(G, "\\$&") : t;
        }, Cr.every = function (t, n, r) {
          var e = Du(t) ? ln : ee;
          return r && si(t, n, r) && (n = void 0), e(t, Yo(n, 3));
        }, Cr.find = uu, Cr.findIndex = Ri, Cr.findKey = function (t, n) {
          return wn(t, Yo(n, 3), se);
        }, Cr.findLast = cu, Cr.findLastIndex = Di, Cr.findLastKey = function (t, n) {
          return wn(t, Yo(n, 3), fe);
        }, Cr.floor = fa, Cr.forEach = au, Cr.forEachRight = su, Cr.forIn = function (t, n) {
          return null == t ? t : ce(t, Yo(n, 3), xc);
        }, Cr.forInRight = function (t, n) {
          return null == t ? t : ae(t, Yo(n, 3), xc);
        }, Cr.forOwn = function (t, n) {
          return t && se(t, Yo(n, 3));
        }, Cr.forOwnRight = function (t, n) {
          return t && fe(t, Yo(n, 3));
        }, Cr.get = yc, Cr.gt = Pu, Cr.gte = ku, Cr.has = function (t, n) {
          return null != t && ii(t, n, ye);
        }, Cr.hasIn = _c, Cr.head = Ni, Cr.identity = Gc, Cr.includes = function (t, n, r, e) {
          t = Nu(t) ? t : Ic(t), r = r && !e ? oc(r) : 0;
          var o = t.length;
          return r < 0 && (r = cr(o + r, 0)), Ku(t) ? r <= o && t.indexOf(n, r) > -1 : !!o && jn(t, n, r) > -1;
        }, Cr.indexOf = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          if (!e) return -1;
          var o = null == r ? 0 : oc(r);
          return o < 0 && (o = cr(e + o, 0)), jn(t, n, o);
        }, Cr.inRange = function (t, n, r) {
          return n = ec(n), void 0 === r ? (r = n, n = 0) : r = ec(r), function (t, n, r) {
            return t >= ar(n, r) && t < cr(n, r);
          }(t = uc(t), n, r);
        }, Cr.invoke = mc, Cr.isArguments = Ru, Cr.isArray = Du, Cr.isArrayBuffer = Uu, Cr.isArrayLike = Nu, Cr.isArrayLikeObject = zu, Cr.isBoolean = function (t) {
          return !0 === t || !1 === t || Wu(t) && ve(t) == l;
        }, Cr.isBuffer = Fu, Cr.isDate = Lu, Cr.isElement = function (t) {
          return Wu(t) && 1 === t.nodeType && !Zu(t);
        }, Cr.isEmpty = function (t) {
          if (null == t) return !0;
          if (Nu(t) && (Du(t) || "string" == typeof t || "function" == typeof t.splice || Fu(t) || Qu(t) || Ru(t))) return !t.length;
          var n = oi(t);
          if (n == y || n == m) return !t.size;
          if (hi(t)) return !Se(t).length;
          for (var r in t) if (St.call(t, r)) return !1;
          return !0;
        }, Cr.isEqual = function (t, n) {
          return we(t, n);
        }, Cr.isEqualWith = function (t, n, r) {
          var e = (r = "function" == typeof r ? r : void 0) ? r(t, n) : void 0;
          return void 0 === e ? we(t, n, void 0, r) : !!e;
        }, Cr.isError = qu, Cr.isFinite = function (t) {
          return "number" == typeof t && or(t);
        }, Cr.isFunction = Mu, Cr.isInteger = $u, Cr.isLength = Bu, Cr.isMap = Vu, Cr.isMatch = function (t, n) {
          return t === n || xe(t, n, ti(n));
        }, Cr.isMatchWith = function (t, n, r) {
          return r = "function" == typeof r ? r : void 0, xe(t, n, ti(n), r);
        }, Cr.isNaN = function (t) {
          return Gu(t) && t != +t;
        }, Cr.isNative = function (t) {
          if (pi(t)) throw new ht("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
          return je(t);
        }, Cr.isNil = function (t) {
          return null == t;
        }, Cr.isNull = function (t) {
          return null === t;
        }, Cr.isNumber = Gu, Cr.isObject = Hu, Cr.isObjectLike = Wu, Cr.isPlainObject = Zu, Cr.isRegExp = Ju, Cr.isSafeInteger = function (t) {
          return $u(t) && t >= -9007199254740991 && t <= 9007199254740991;
        }, Cr.isSet = Xu, Cr.isString = Ku, Cr.isSymbol = Yu, Cr.isTypedArray = Qu, Cr.isUndefined = function (t) {
          return void 0 === t;
        }, Cr.isWeakMap = function (t) {
          return Wu(t) && oi(t) == j;
        }, Cr.isWeakSet = function (t) {
          return Wu(t) && "[object WeakSet]" == ve(t);
        }, Cr.join = function (t, n) {
          return null == t ? "" : ir.call(t, n);
        }, Cr.kebabCase = Dc, Cr.last = qi, Cr.lastIndexOf = function (t, n, r) {
          var e = null == t ? 0 : t.length;
          if (!e) return -1;
          var o = e;
          return void 0 !== r && (o = (o = oc(r)) < 0 ? cr(e + o, 0) : ar(o, e - 1)), n == n ? function (t, n, r) {
            for (var e = r + 1; e--;) if (t[e] === n) return e;
            return e;
          }(t, n, o) : xn(t, Sn, o, !0);
        }, Cr.lowerCase = Uc, Cr.lowerFirst = Nc, Cr.lt = tc, Cr.lte = nc, Cr.max = function (t) {
          return t && t.length ? oe(t, Gc, de) : void 0;
        }, Cr.maxBy = function (t, n) {
          return t && t.length ? oe(t, Yo(n, 2), de) : void 0;
        }, Cr.mean = function (t) {
          return On(t, Gc);
        }, Cr.meanBy = function (t, n) {
          return On(t, Yo(n, 2));
        }, Cr.min = function (t) {
          return t && t.length ? oe(t, Gc, Ae) : void 0;
        }, Cr.minBy = function (t, n) {
          return t && t.length ? oe(t, Yo(n, 2), Ae) : void 0;
        }, Cr.stubArray = ia, Cr.stubFalse = ua, Cr.stubObject = function () {
          return {};
        }, Cr.stubString = function () {
          return "";
        }, Cr.stubTrue = function () {
          return !0;
        }, Cr.multiply = pa, Cr.nth = function (t, n) {
          return t && t.length ? ke(t, oc(n)) : void 0;
        }, Cr.noConflict = function () {
          return Zt._ === this && (Zt._ = It), this;
        }, Cr.noop = Yc, Cr.now = yu, Cr.pad = function (t, n, r) {
          t = ac(t);
          var e = (n = oc(n)) ? Gn(t) : 0;
          if (!n || e >= n) return t;
          var o = (n - e) / 2;
          return Do(nr(o), r) + t + Do(tr(o), r);
        }, Cr.padEnd = function (t, n, r) {
          t = ac(t);
          var e = (n = oc(n)) ? Gn(t) : 0;
          return n && e < n ? t + Do(n - e, r) : t;
        }, Cr.padStart = function (t, n, r) {
          t = ac(t);
          var e = (n = oc(n)) ? Gn(t) : 0;
          return n && e < n ? Do(n - e, r) + t : t;
        }, Cr.parseInt = function (t, n, r) {
          return r || null == n ? n = 0 : n && (n = +n), fr(ac(t).replace(X, ""), n || 0);
        }, Cr.random = function (t, n, r) {
          if (r && "boolean" != typeof r && si(t, n, r) && (n = r = void 0), void 0 === r && ("boolean" == typeof n ? (r = n, n = void 0) : "boolean" == typeof t && (r = t, t = void 0)), void 0 === t && void 0 === n ? (t = 0, n = 1) : (t = ec(t), void 0 === n ? (n = t, t = 0) : n = ec(n)), t > n) {
            var e = t;
            t = n, n = e;
          }
          if (r || t % 1 || n % 1) {
            var o = lr();
            return ar(t + o * (n - t + Ht("1e-" + ((o + "").length - 1))), n);
          }
          return ze(t, n);
        }, Cr.reduce = function (t, n, r) {
          var e = Du(t) ? _n : Cn,
            o = arguments.length < 3;
          return e(t, Yo(n, 4), r, o, ne);
        }, Cr.reduceRight = function (t, n, r) {
          var e = Du(t) ? gn : Cn,
            o = arguments.length < 3;
          return e(t, Yo(n, 4), r, o, re);
        }, Cr.repeat = function (t, n, r) {
          return n = (r ? si(t, n, r) : void 0 === n) ? 1 : oc(n), Fe(ac(t), n);
        }, Cr.replace = function () {
          var t = arguments,
            n = ac(t[0]);
          return t.length < 3 ? n : n.replace(t[1], t[2]);
        }, Cr.result = function (t, n, r) {
          var e = -1,
            o = (n = ao(n, t)).length;
          for (o || (o = 1, t = void 0); ++e < o;) {
            var i = null == t ? void 0 : t[Ai(n[e])];
            void 0 === i && (e = o, i = r), t = Mu(i) ? i.call(t) : i;
          }
          return t;
        }, Cr.round = ha, Cr.runInContext = t, Cr.sample = function (t) {
          return (Du(t) ? qr : qe)(t);
        }, Cr.size = function (t) {
          if (null == t) return 0;
          if (Nu(t)) return Ku(t) ? Gn(t) : t.length;
          var n = oi(t);
          return n == y || n == m ? t.size : Se(t).length;
        }, Cr.snakeCase = zc, Cr.some = function (t, n, r) {
          var e = Du(t) ? bn : Ge;
          return r && si(t, n, r) && (n = void 0), e(t, Yo(n, 3));
        }, Cr.sortedIndex = function (t, n) {
          return Ze(t, n);
        }, Cr.sortedIndexBy = function (t, n, r) {
          return Je(t, n, Yo(r, 2));
        }, Cr.sortedIndexOf = function (t, n) {
          var r = null == t ? 0 : t.length;
          if (r) {
            var e = Ze(t, n);
            if (e < r && Iu(t[e], n)) return e;
          }
          return -1;
        }, Cr.sortedLastIndex = function (t, n) {
          return Ze(t, n, !0);
        }, Cr.sortedLastIndexBy = function (t, n, r) {
          return Je(t, n, Yo(r, 2), !0);
        }, Cr.sortedLastIndexOf = function (t, n) {
          if (null == t ? 0 : t.length) {
            var r = Ze(t, n, !0) - 1;
            if (Iu(t[r], n)) return r;
          }
          return -1;
        }, Cr.startCase = Fc, Cr.startsWith = function (t, n, r) {
          return t = ac(t), r = null == r ? 0 : Xr(oc(r), 0, t.length), n = Ye(n), t.slice(r, r + n.length) == n;
        }, Cr.subtract = va, Cr.sum = function (t) {
          return t && t.length ? In(t, Gc) : 0;
        }, Cr.sumBy = function (t, n) {
          return t && t.length ? In(t, Yo(n, 2)) : 0;
        }, Cr.template = function (t, n, r) {
          var e = Cr.templateSettings;
          r && si(t, n, r) && (n = void 0), t = ac(t), n = lc({}, n, e, $o);
          var o,
            i,
            u = lc({}, n.imports, e.imports, $o),
            c = wc(u),
            a = Rn(u, c),
            s = 0,
            f = n.interpolate || lt,
            l = "__p += '",
            p = _t((n.escape || lt).source + "|" + f.source + "|" + (f === B ? et : lt).source + "|" + (n.evaluate || lt).source + "|$", "g"),
            h = "//# sourceURL=" + (St.call(n, "sourceURL") ? (n.sourceURL + "").replace(/[\r\n]/g, " ") : "lodash.templateSources[" + ++qt + "]") + "\n";
          t.replace(p, function (n, r, e, u, c, a) {
            return e || (e = u), l += t.slice(s, a).replace(pt, qn), r && (o = !0, l += "' +\n__e(" + r + ") +\n'"), c && (i = !0, l += "';\n" + c + ";\n__p += '"), e && (l += "' +\n((__t = (" + e + ")) == null ? '' : __t) +\n'"), s = a + n.length, n;
          }), l += "';\n";
          var v = St.call(n, "variable") && n.variable;
          v || (l = "with (obj) {\n" + l + "\n}\n"), l = (i ? l.replace(D, "") : l).replace(U, "$1").replace(N, "$1;"), l = "function(" + (v || "obj") + ") {\n" + (v ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (i ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + l + "return __p\n}";
          var d = $c(function () {
            return vt(c, h + "return " + l).apply(void 0, a);
          });
          if (d.source = l, qu(d)) throw d;
          return d;
        }, Cr.times = function (t, n) {
          if ((t = oc(t)) < 1 || t > 9007199254740991) return [];
          var r = 4294967295,
            e = ar(t, 4294967295);
          t -= 4294967295;
          for (var o = Pn(e, n = Yo(n)); ++r < t;) n(r);
          return o;
        }, Cr.toFinite = ec, Cr.toInteger = oc, Cr.toLength = ic, Cr.toLower = function (t) {
          return ac(t).toLowerCase();
        }, Cr.toNumber = uc, Cr.toSafeInteger = function (t) {
          return t ? Xr(oc(t), -9007199254740991, 9007199254740991) : 0 === t ? t : 0;
        }, Cr.toString = ac, Cr.toUpper = function (t) {
          return ac(t).toUpperCase();
        }, Cr.trim = function (t, n, r) {
          if ((t = ac(t)) && (r || void 0 === n)) return t.replace(J, "");
          if (!t || !(n = Ye(n))) return t;
          var e = Zn(t),
            o = Zn(n);
          return fo(e, Un(e, o), Nn(e, o) + 1).join("");
        }, Cr.trimEnd = function (t, n, r) {
          if ((t = ac(t)) && (r || void 0 === n)) return t.replace(K, "");
          if (!t || !(n = Ye(n))) return t;
          var e = Zn(t);
          return fo(e, 0, Nn(e, Zn(n)) + 1).join("");
        }, Cr.trimStart = function (t, n, r) {
          if ((t = ac(t)) && (r || void 0 === n)) return t.replace(X, "");
          if (!t || !(n = Ye(n))) return t;
          var e = Zn(t);
          return fo(e, Un(e, Zn(n))).join("");
        }, Cr.truncate = function (t, n) {
          var r = 30,
            e = "...";
          if (Hu(n)) {
            var o = "separator" in n ? n.separator : o;
            r = "length" in n ? oc(n.length) : r, e = "omission" in n ? Ye(n.omission) : e;
          }
          var i = (t = ac(t)).length;
          if (Mn(t)) {
            var u = Zn(t);
            i = u.length;
          }
          if (r >= i) return t;
          var c = r - Gn(e);
          if (c < 1) return e;
          var a = u ? fo(u, 0, c).join("") : t.slice(0, c);
          if (void 0 === o) return a + e;
          if (u && (c += a.length - c), Ju(o)) {
            if (t.slice(c).search(o)) {
              var s,
                f = a;
              for (o.global || (o = _t(o.source, ac(ot.exec(o)) + "g")), o.lastIndex = 0; s = o.exec(f);) var l = s.index;
              a = a.slice(0, void 0 === l ? c : l);
            }
          } else if (t.indexOf(Ye(o), c) != c) {
            var p = a.lastIndexOf(o);
            p > -1 && (a = a.slice(0, p));
          }
          return a + e;
        }, Cr.unescape = function (t) {
          return (t = ac(t)) && L.test(t) ? t.replace(z, Jn) : t;
        }, Cr.uniqueId = function (t) {
          var n = ++Ot;
          return ac(t) + n;
        }, Cr.upperCase = Lc, Cr.upperFirst = qc, Cr.each = au, Cr.eachRight = su, Cr.first = Ni, Kc(Cr, (la = {}, se(Cr, function (t, n) {
          St.call(Cr.prototype, n) || (la[n] = t);
        }), la), {
          chain: !1
        }), Cr.VERSION = "4.17.15", sn(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (t) {
          Cr[t].placeholder = Cr;
        }), sn(["drop", "take"], function (t, n) {
          Rr.prototype[t] = function (r) {
            r = void 0 === r ? 1 : cr(oc(r), 0);
            var e = this.__filtered__ && !n ? new Rr(this) : this.clone();
            return e.__filtered__ ? e.__takeCount__ = ar(r, e.__takeCount__) : e.__views__.push({
              size: ar(r, 4294967295),
              type: t + (e.__dir__ < 0 ? "Right" : "")
            }), e;
          }, Rr.prototype[t + "Right"] = function (n) {
            return this.reverse()[t](n).reverse();
          };
        }), sn(["filter", "map", "takeWhile"], function (t, n) {
          var r = n + 1,
            e = 1 == r || 3 == r;
          Rr.prototype[t] = function (t) {
            var n = this.clone();
            return n.__iteratees__.push({
              iteratee: Yo(t, 3),
              type: r
            }), n.__filtered__ = n.__filtered__ || e, n;
          };
        }), sn(["head", "last"], function (t, n) {
          var r = "take" + (n ? "Right" : "");
          Rr.prototype[t] = function () {
            return this[r](1).value()[0];
          };
        }), sn(["initial", "tail"], function (t, n) {
          var r = "drop" + (n ? "" : "Right");
          Rr.prototype[t] = function () {
            return this.__filtered__ ? new Rr(this) : this[r](1);
          };
        }), Rr.prototype.compact = function () {
          return this.filter(Gc);
        }, Rr.prototype.find = function (t) {
          return this.filter(t).head();
        }, Rr.prototype.findLast = function (t) {
          return this.reverse().find(t);
        }, Rr.prototype.invokeMap = Le(function (t, n) {
          return "function" == typeof t ? new Rr(this) : this.map(function (r) {
            return be(r, t, n);
          });
        }), Rr.prototype.reject = function (t) {
          return this.filter(Su(Yo(t)));
        }, Rr.prototype.slice = function (t, n) {
          t = oc(t);
          var r = this;
          return r.__filtered__ && (t > 0 || n < 0) ? new Rr(r) : (t < 0 ? r = r.takeRight(-t) : t && (r = r.drop(t)), void 0 !== n && (r = (n = oc(n)) < 0 ? r.dropRight(-n) : r.take(n - t)), r);
        }, Rr.prototype.takeRightWhile = function (t) {
          return this.reverse().takeWhile(t).reverse();
        }, Rr.prototype.toArray = function () {
          return this.take(4294967295);
        }, se(Rr.prototype, function (t, n) {
          var r = /^(?:filter|find|map|reject)|While$/.test(n),
            e = /^(?:head|last)$/.test(n),
            o = Cr[e ? "take" + ("last" == n ? "Right" : "") : n],
            i = e || /^find/.test(n);
          o && (Cr.prototype[n] = function () {
            var n = this.__wrapped__,
              u = e ? [1] : arguments,
              c = n instanceof Rr,
              a = u[0],
              s = c || Du(n),
              f = function (t) {
                var n = o.apply(Cr, yn([t], u));
                return e && l ? n[0] : n;
              };
            s && r && "function" == typeof a && 1 != a.length && (c = s = !1);
            var l = this.__chain__,
              p = !!this.__actions__.length,
              h = i && !l,
              v = c && !p;
            if (!i && s) {
              n = v ? n : new Rr(this);
              var d = t.apply(n, u);
              return d.__actions__.push({
                func: eu,
                args: [f],
                thisArg: void 0
              }), new kr(d, l);
            }
            return h && v ? t.apply(this, u) : (d = this.thru(f), h ? e ? d.value()[0] : d.value() : d);
          });
        }), sn(["pop", "push", "shift", "sort", "splice", "unshift"], function (t) {
          var n = mt[t],
            r = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
            e = /^(?:pop|shift)$/.test(t);
          Cr.prototype[t] = function () {
            var t = arguments;
            if (e && !this.__chain__) {
              var o = this.value();
              return n.apply(Du(o) ? o : [], t);
            }
            return this[r](function (r) {
              return n.apply(Du(r) ? r : [], t);
            });
          };
        }), se(Rr.prototype, function (t, n) {
          var r = Cr[n];
          if (r) {
            var e = r.name + "";
            St.call(mr, e) || (mr[e] = []), mr[e].push({
              name: n,
              func: r
            });
          }
        }), mr[Io(void 0, 2).name] = [{
          name: "wrapper",
          func: void 0
        }], Rr.prototype.clone = function () {
          var t = new Rr(this.__wrapped__);
          return t.__actions__ = bo(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = bo(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = bo(this.__views__), t;
        }, Rr.prototype.reverse = function () {
          if (this.__filtered__) {
            var t = new Rr(this);
            t.__dir__ = -1, t.__filtered__ = !0;
          } else (t = this.clone()).__dir__ *= -1;
          return t;
        }, Rr.prototype.value = function () {
          var t = this.__wrapped__.value(),
            n = this.__dir__,
            r = Du(t),
            e = n < 0,
            o = r ? t.length : 0,
            i = function (t, n, r) {
              var e = -1,
                o = r.length;
              for (; ++e < o;) {
                var i = r[e],
                  u = i.size;
                switch (i.type) {
                  case "drop":
                    t += u;
                    break;
                  case "dropRight":
                    n -= u;
                    break;
                  case "take":
                    n = ar(n, t + u);
                    break;
                  case "takeRight":
                    t = cr(t, n - u);
                }
              }
              return {
                start: t,
                end: n
              };
            }(0, o, this.__views__),
            u = i.start,
            c = i.end,
            a = c - u,
            s = e ? c : u - 1,
            f = this.__iteratees__,
            l = f.length,
            p = 0,
            h = ar(a, this.__takeCount__);
          if (!r || !e && o == a && h == a) return eo(t, this.__actions__);
          var v = [];
          t: for (; a-- && p < h;) {
            for (var d = -1, y = t[s += n]; ++d < l;) {
              var _ = f[d],
                g = _.iteratee,
                b = _.type,
                m = g(y);
              if (2 == b) y = m;else if (!m) {
                if (1 == b) continue t;
                break t;
              }
            }
            v[p++] = y;
          }
          return v;
        }, Cr.prototype.at = ou, Cr.prototype.chain = function () {
          return ru(this);
        }, Cr.prototype.commit = function () {
          return new kr(this.value(), this.__chain__);
        }, Cr.prototype.next = function () {
          void 0 === this.__values__ && (this.__values__ = rc(this.value()));
          var t = this.__index__ >= this.__values__.length;
          return {
            done: t,
            value: t ? void 0 : this.__values__[this.__index__++]
          };
        }, Cr.prototype.plant = function (t) {
          for (var n, r = this; r instanceof Pr;) {
            var e = Ci(r);
            e.__index__ = 0, e.__values__ = void 0, n ? o.__wrapped__ = e : n = e;
            var o = e;
            r = r.__wrapped__;
          }
          return o.__wrapped__ = t, n;
        }, Cr.prototype.reverse = function () {
          var t = this.__wrapped__;
          if (t instanceof Rr) {
            var n = t;
            return this.__actions__.length && (n = new Rr(this)), (n = n.reverse()).__actions__.push({
              func: eu,
              args: [Hi],
              thisArg: void 0
            }), new kr(n, this.__chain__);
          }
          return this.thru(Hi);
        }, Cr.prototype.toJSON = Cr.prototype.valueOf = Cr.prototype.value = function () {
          return eo(this.__wrapped__, this.__actions__);
        }, Cr.prototype.first = Cr.prototype.head, Qt && (Cr.prototype[Qt] = function () {
          return this;
        }), Cr;
      }();
      "object" == i(r(46)) && r(46) ? (Zt._ = Xn, void 0 === (o = function () {
        return Xn;
      }.call(n, r, n, e)) || (e.exports = o)) : Xt ? ((Xt.exports = Xn)._ = Xn, Jt._ = Xn) : Zt._ = Xn;
    }).call(this);
  }).call(this, r(11), r(14)(t));
}, function (t, n, r) {
  var e = r(87);
  t.exports = {
    Graph: e.Graph,
    json: r(213),
    alg: r(214),
    version: e.version
  };
}, function (t, n, r) {
  t.exports = {
    Graph: r(28),
    version: r(212)
  };
}, function (t, n, r) {
  var e = r(89);
  t.exports = function (t) {
    return e(t, 4);
  };
}, function (t, n, r) {
  var e = r(29),
    o = r(33),
    i = r(49),
    u = r(118),
    c = r(124),
    a = r(127),
    s = r(128),
    f = r(129),
    l = r(130),
    p = r(59),
    h = r(131),
    v = r(10),
    d = r(135),
    y = r(136),
    _ = r(141),
    g = r(0),
    b = r(12),
    m = r(142),
    w = r(5),
    x = r(144),
    j = r(6),
    E = {};
  E["[object Arguments]"] = E["[object Array]"] = E["[object ArrayBuffer]"] = E["[object DataView]"] = E["[object Boolean]"] = E["[object Date]"] = E["[object Float32Array]"] = E["[object Float64Array]"] = E["[object Int8Array]"] = E["[object Int16Array]"] = E["[object Int32Array]"] = E["[object Map]"] = E["[object Number]"] = E["[object Object]"] = E["[object RegExp]"] = E["[object Set]"] = E["[object String]"] = E["[object Symbol]"] = E["[object Uint8Array]"] = E["[object Uint8ClampedArray]"] = E["[object Uint16Array]"] = E["[object Uint32Array]"] = !0, E["[object Error]"] = E["[object Function]"] = E["[object WeakMap]"] = !1, t.exports = function t(n, r, S, O, A, T) {
    var C,
      I = 1 & r,
      P = 2 & r,
      k = 4 & r;
    if (S && (C = A ? S(n, O, A, T) : S(n)), void 0 !== C) return C;
    if (!w(n)) return n;
    var R = g(n);
    if (R) {
      if (C = d(n), !I) return s(n, C);
    } else {
      var D = v(n),
        U = "[object Function]" == D || "[object GeneratorFunction]" == D;
      if (b(n)) return a(n, I);
      if ("[object Object]" == D || "[object Arguments]" == D || U && !A) {
        if (C = P || U ? {} : _(n), !I) return P ? l(n, c(C, n)) : f(n, u(C, n));
      } else {
        if (!E[D]) return A ? n : {};
        C = y(n, D, I);
      }
    }
    T || (T = new e());
    var N = T.get(n);
    if (N) return N;
    T.set(n, C), x(n) ? n.forEach(function (e) {
      C.add(t(e, r, S, e, n, T));
    }) : m(n) && n.forEach(function (e, o) {
      C.set(o, t(e, r, S, o, n, T));
    });
    var z = k ? P ? h : p : P ? keysIn : j,
      F = R ? void 0 : z(n);
    return o(F || n, function (e, o) {
      F && (e = n[o = e]), i(C, o, t(e, r, S, o, n, T));
    }), C;
  };
}, function (t, n) {
  t.exports = function () {
    this.__data__ = [], this.size = 0;
  };
}, function (t, n, r) {
  var e = r(16),
    o = Array.prototype.splice;
  t.exports = function (t) {
    var n = this.__data__,
      r = e(n, t);
    return !(r < 0) && (r == n.length - 1 ? n.pop() : o.call(n, r, 1), --this.size, !0);
  };
}, function (t, n, r) {
  var e = r(16);
  t.exports = function (t) {
    var n = this.__data__,
      r = e(n, t);
    return r < 0 ? void 0 : n[r][1];
  };
}, function (t, n, r) {
  var e = r(16);
  t.exports = function (t) {
    return e(this.__data__, t) > -1;
  };
}, function (t, n, r) {
  var e = r(16);
  t.exports = function (t, n) {
    var r = this.__data__,
      o = e(r, t);
    return o < 0 ? (++this.size, r.push([t, n])) : r[o][1] = n, this;
  };
}, function (t, n, r) {
  var e = r(15);
  t.exports = function () {
    this.__data__ = new e(), this.size = 0;
  };
}, function (t, n) {
  t.exports = function (t) {
    var n = this.__data__,
      r = n.delete(t);
    return this.size = n.size, r;
  };
}, function (t, n) {
  t.exports = function (t) {
    return this.__data__.get(t);
  };
}, function (t, n) {
  t.exports = function (t) {
    return this.__data__.has(t);
  };
}, function (t, n, r) {
  var e = r(15),
    o = r(31),
    i = r(32);
  t.exports = function (t, n) {
    var r = this.__data__;
    if (r instanceof e) {
      var u = r.__data__;
      if (!o || u.length < 199) return u.push([t, n]), this.size = ++r.size, this;
      r = this.__data__ = new i(u);
    }
    return r.set(t, n), this.size = r.size, this;
  };
}, function (t, n, r) {
  var e = r(17),
    o = r(103),
    i = r(5),
    u = r(48),
    c = /^\[object .+?Constructor\]$/,
    a = Function.prototype,
    s = Object.prototype,
    f = a.toString,
    l = s.hasOwnProperty,
    p = RegExp("^" + f.call(l).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  t.exports = function (t) {
    return !(!i(t) || o(t)) && (e(t) ? p : c).test(u(t));
  };
}, function (t, n, r) {
  var e = r(9),
    o = Object.prototype,
    i = o.hasOwnProperty,
    u = o.toString,
    c = e ? e.toStringTag : void 0;
  t.exports = function (t) {
    var n = i.call(t, c),
      r = t[c];
    try {
      t[c] = void 0;
      var e = !0;
    } catch (t) {}
    var o = u.call(t);
    return e && (n ? t[c] = r : delete t[c]), o;
  };
}, function (t, n) {
  var r = Object.prototype.toString;
  t.exports = function (t) {
    return r.call(t);
  };
}, function (t, n, r) {
  var e,
    o = r(104),
    i = (e = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "")) ? "Symbol(src)_1." + e : "";
  t.exports = function (t) {
    return !!i && i in t;
  };
}, function (t, n, r) {
  var e = r(2)["__core-js_shared__"];
  t.exports = e;
}, function (t, n) {
  t.exports = function (t, n) {
    return null == t ? void 0 : t[n];
  };
}, function (t, n, r) {
  var e = r(107),
    o = r(15),
    i = r(31);
  t.exports = function () {
    this.size = 0, this.__data__ = {
      hash: new e(),
      map: new (i || o)(),
      string: new e()
    };
  };
}, function (t, n, r) {
  var e = r(108),
    o = r(109),
    i = r(110),
    u = r(111),
    c = r(112);
  function a(t) {
    var n = -1,
      r = null == t ? 0 : t.length;
    for (this.clear(); ++n < r;) {
      var e = t[n];
      this.set(e[0], e[1]);
    }
  }
  a.prototype.clear = e, a.prototype.delete = o, a.prototype.get = i, a.prototype.has = u, a.prototype.set = c, t.exports = a;
}, function (t, n, r) {
  var e = r(18);
  t.exports = function () {
    this.__data__ = e ? e(null) : {}, this.size = 0;
  };
}, function (t, n) {
  t.exports = function (t) {
    var n = this.has(t) && delete this.__data__[t];
    return this.size -= n ? 1 : 0, n;
  };
}, function (t, n, r) {
  var e = r(18),
    o = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    var n = this.__data__;
    if (e) {
      var r = n[t];
      return "__lodash_hash_undefined__" === r ? void 0 : r;
    }
    return o.call(n, t) ? n[t] : void 0;
  };
}, function (t, n, r) {
  var e = r(18),
    o = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    var n = this.__data__;
    return e ? void 0 !== n[t] : o.call(n, t);
  };
}, function (t, n, r) {
  var e = r(18);
  t.exports = function (t, n) {
    var r = this.__data__;
    return this.size += this.has(t) ? 0 : 1, r[t] = e && void 0 === n ? "__lodash_hash_undefined__" : n, this;
  };
}, function (t, n, r) {
  var e = r(19);
  t.exports = function (t) {
    var n = e(this, t).delete(t);
    return this.size -= n ? 1 : 0, n;
  };
}, function (t, n) {
  function r(t) {
    return (r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  t.exports = function (t) {
    var n = r(t);
    return "string" == n || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== t : null === t;
  };
}, function (t, n, r) {
  var e = r(19);
  t.exports = function (t) {
    return e(this, t).get(t);
  };
}, function (t, n, r) {
  var e = r(19);
  t.exports = function (t) {
    return e(this, t).has(t);
  };
}, function (t, n, r) {
  var e = r(19);
  t.exports = function (t, n) {
    var r = e(this, t),
      o = r.size;
    return r.set(t, n), this.size += r.size == o ? 0 : 1, this;
  };
}, function (t, n, r) {
  var e = r(20),
    o = r(6);
  t.exports = function (t, n) {
    return t && e(n, o(n), t);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = Array(t); ++r < t;) e[r] = n(r);
    return e;
  };
}, function (t, n, r) {
  var e = r(8),
    o = r(3);
  t.exports = function (t) {
    return o(t) && "[object Arguments]" == e(t);
  };
}, function (t, n) {
  t.exports = function () {
    return !1;
  };
}, function (t, n, r) {
  var e = r(8),
    o = r(34),
    i = r(3),
    u = {};
  u["[object Float32Array]"] = u["[object Float64Array]"] = u["[object Int8Array]"] = u["[object Int16Array]"] = u["[object Int32Array]"] = u["[object Uint8Array]"] = u["[object Uint8ClampedArray]"] = u["[object Uint16Array]"] = u["[object Uint32Array]"] = !0, u["[object Arguments]"] = u["[object Array]"] = u["[object ArrayBuffer]"] = u["[object Boolean]"] = u["[object DataView]"] = u["[object Date]"] = u["[object Error]"] = u["[object Function]"] = u["[object Map]"] = u["[object Number]"] = u["[object Object]"] = u["[object RegExp]"] = u["[object Set]"] = u["[object String]"] = u["[object WeakMap]"] = !1, t.exports = function (t) {
    return i(t) && o(t.length) && !!u[e(t)];
  };
}, function (t, n, r) {
  var e = r(54)(Object.keys, Object);
  t.exports = e;
}, function (t, n, r) {
  var e = r(20),
    o = r(55);
  t.exports = function (t, n) {
    return t && e(n, o(n), t);
  };
}, function (t, n, r) {
  var e = r(5),
    o = r(23),
    i = r(126),
    u = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    if (!e(t)) return i(t);
    var n = o(t),
      r = [];
    for (var c in t) ("constructor" != c || !n && u.call(t, c)) && r.push(c);
    return r;
  };
}, function (t, n) {
  t.exports = function (t) {
    var n = [];
    if (null != t) for (var r in Object(t)) n.push(r);
    return n;
  };
}, function (t, n, r) {
  (function (t) {
    function e(t) {
      return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t;
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
      })(t);
    }
    var o = r(2),
      i = "object" == e(n) && n && !n.nodeType && n,
      u = i && "object" == e(t) && t && !t.nodeType && t,
      c = u && u.exports === i ? o.Buffer : void 0,
      a = c ? c.allocUnsafe : void 0;
    t.exports = function (t, n) {
      if (n) return t.slice();
      var r = t.length,
        e = a ? a(r) : new t.constructor(r);
      return t.copy(e), e;
    };
  }).call(this, r(14)(t));
}, function (t, n) {
  t.exports = function (t, n) {
    var r = -1,
      e = t.length;
    for (n || (n = Array(e)); ++r < e;) n[r] = t[r];
    return n;
  };
}, function (t, n, r) {
  var e = r(20),
    o = r(38);
  t.exports = function (t, n) {
    return e(t, o(t), n);
  };
}, function (t, n, r) {
  var e = r(20),
    o = r(58);
  t.exports = function (t, n) {
    return e(t, o(t), n);
  };
}, function (t, n, r) {
  var e = r(60),
    o = r(58),
    i = r(55);
  t.exports = function (t) {
    return e(t, i, o);
  };
}, function (t, n, r) {
  var e = r(4)(r(2), "DataView");
  t.exports = e;
}, function (t, n, r) {
  var e = r(4)(r(2), "Promise");
  t.exports = e;
}, function (t, n, r) {
  var e = r(4)(r(2), "WeakMap");
  t.exports = e;
}, function (t, n) {
  var r = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    var n = t.length,
      e = new t.constructor(n);
    return n && "string" == typeof t[0] && r.call(t, "index") && (e.index = t.index, e.input = t.input), e;
  };
}, function (t, n, r) {
  var e = r(41),
    o = r(137),
    i = r(138),
    u = r(139),
    c = r(140);
  t.exports = function (t, n, r) {
    var a = t.constructor;
    switch (n) {
      case "[object ArrayBuffer]":
        return e(t);
      case "[object Boolean]":
      case "[object Date]":
        return new a(+t);
      case "[object DataView]":
        return o(t, r);
      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object Int8Array]":
      case "[object Int16Array]":
      case "[object Int32Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Uint16Array]":
      case "[object Uint32Array]":
        return c(t, r);
      case "[object Map]":
        return new a();
      case "[object Number]":
      case "[object String]":
        return new a(t);
      case "[object RegExp]":
        return i(t);
      case "[object Set]":
        return new a();
      case "[object Symbol]":
        return u(t);
    }
  };
}, function (t, n, r) {
  var e = r(41);
  t.exports = function (t, n) {
    var r = n ? e(t.buffer) : t.buffer;
    return new t.constructor(r, t.byteOffset, t.byteLength);
  };
}, function (t, n) {
  var r = /\w*$/;
  t.exports = function (t) {
    var n = new t.constructor(t.source, r.exec(t));
    return n.lastIndex = t.lastIndex, n;
  };
}, function (t, n, r) {
  var e = r(9),
    o = e ? e.prototype : void 0,
    i = o ? o.valueOf : void 0;
  t.exports = function (t) {
    return i ? Object(i.call(t)) : {};
  };
}, function (t, n, r) {
  var e = r(41);
  t.exports = function (t, n) {
    var r = n ? e(t.buffer) : t.buffer;
    return new t.constructor(r, t.byteOffset, t.length);
  };
}, function (t, n, r) {
  var e = r(63),
    o = r(40),
    i = r(23);
  t.exports = function (t) {
    return "function" != typeof t.constructor || i(t) ? {} : e(o(t));
  };
}, function (t, n, r) {
  var e = r(143),
    o = r(35),
    i = r(36),
    u = i && i.isMap,
    c = u ? o(u) : e;
  t.exports = c;
}, function (t, n, r) {
  var e = r(10),
    o = r(3);
  t.exports = function (t) {
    return o(t) && "[object Map]" == e(t);
  };
}, function (t, n, r) {
  var e = r(145),
    o = r(35),
    i = r(36),
    u = i && i.isSet,
    c = u ? o(u) : e;
  t.exports = c;
}, function (t, n, r) {
  var e = r(10),
    o = r(3);
  t.exports = function (t) {
    return o(t) && "[object Set]" == e(t);
  };
}, function (t, n, r) {
  t.exports = r(147);
}, function (t, n, r) {
  var e = r(33),
    o = r(24),
    i = r(151),
    u = r(0);
  t.exports = function (t, n) {
    return (u(t) ? e : o)(t, i(n));
  };
}, function (t, n, r) {
  var e = r(149)();
  t.exports = e;
}, function (t, n) {
  t.exports = function (t) {
    return function (n, r, e) {
      for (var o = -1, i = Object(n), u = e(n), c = u.length; c--;) {
        var a = u[t ? c : ++o];
        if (!1 === r(i[a], a, i)) break;
      }
      return n;
    };
  };
}, function (t, n, r) {
  var e = r(7);
  t.exports = function (t, n) {
    return function (r, o) {
      if (null == r) return r;
      if (!e(r)) return t(r, o);
      for (var i = r.length, u = n ? i : -1, c = Object(r); (n ? u-- : ++u < i) && !1 !== o(c[u], u, c););
      return r;
    };
  };
}, function (t, n, r) {
  var e = r(25);
  t.exports = function (t) {
    return "function" == typeof t ? t : e;
  };
}, function (t, n, r) {
  var e = r(56),
    o = r(153),
    i = r(26),
    u = r(0);
  t.exports = function (t, n) {
    return (u(t) ? e : o)(t, i(n, 3));
  };
}, function (t, n, r) {
  var e = r(24);
  t.exports = function (t, n) {
    var r = [];
    return e(t, function (t, e, o) {
      n(t, e, o) && r.push(t);
    }), r;
  };
}, function (t, n, r) {
  var e = r(155),
    o = r(163),
    i = r(71);
  t.exports = function (t) {
    var n = o(t);
    return 1 == n.length && n[0][2] ? i(n[0][0], n[0][1]) : function (r) {
      return r === t || e(r, t, n);
    };
  };
}, function (t, n, r) {
  var e = r(29),
    o = r(66);
  t.exports = function (t, n, r, i) {
    var u = r.length,
      c = u,
      a = !i;
    if (null == t) return !c;
    for (t = Object(t); u--;) {
      var s = r[u];
      if (a && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1;
    }
    for (; ++u < c;) {
      var f = (s = r[u])[0],
        l = t[f],
        p = s[1];
      if (a && s[2]) {
        if (void 0 === l && !(f in t)) return !1;
      } else {
        var h = new e();
        if (i) var v = i(l, p, f, t, n, h);
        if (!(void 0 === v ? o(p, l, 3, i, h) : v)) return !1;
      }
    }
    return !0;
  };
}, function (t, n, r) {
  var e = r(29),
    o = r(67),
    i = r(160),
    u = r(162),
    c = r(10),
    a = r(0),
    s = r(12),
    f = r(22),
    l = "[object Object]",
    p = Object.prototype.hasOwnProperty;
  t.exports = function (t, n, r, h, v, d) {
    var y = a(t),
      _ = a(n),
      g = y ? "[object Array]" : c(t),
      b = _ ? "[object Array]" : c(n),
      m = (g = "[object Arguments]" == g ? l : g) == l,
      w = (b = "[object Arguments]" == b ? l : b) == l,
      x = g == b;
    if (x && s(t)) {
      if (!s(n)) return !1;
      y = !0, m = !1;
    }
    if (x && !m) return d || (d = new e()), y || f(t) ? o(t, n, r, h, v, d) : i(t, n, g, r, h, v, d);
    if (!(1 & r)) {
      var j = m && p.call(t, "__wrapped__"),
        E = w && p.call(n, "__wrapped__");
      if (j || E) {
        var S = j ? t.value() : t,
          O = E ? n.value() : n;
        return d || (d = new e()), v(S, O, r, h, d);
      }
    }
    return !!x && (d || (d = new e()), u(t, n, r, h, v, d));
  };
}, function (t, n) {
  t.exports = function (t) {
    return this.__data__.set(t, "__lodash_hash_undefined__"), this;
  };
}, function (t, n) {
  t.exports = function (t) {
    return this.__data__.has(t);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    for (var r = -1, e = null == t ? 0 : t.length; ++r < e;) if (n(t[r], r, t)) return !0;
    return !1;
  };
}, function (t, n, r) {
  var e = r(9),
    o = r(62),
    i = r(30),
    u = r(67),
    c = r(161),
    a = r(42),
    s = e ? e.prototype : void 0,
    f = s ? s.valueOf : void 0;
  t.exports = function (t, n, r, e, s, l, p) {
    switch (r) {
      case "[object DataView]":
        if (t.byteLength != n.byteLength || t.byteOffset != n.byteOffset) return !1;
        t = t.buffer, n = n.buffer;
      case "[object ArrayBuffer]":
        return !(t.byteLength != n.byteLength || !l(new o(t), new o(n)));
      case "[object Boolean]":
      case "[object Date]":
      case "[object Number]":
        return i(+t, +n);
      case "[object Error]":
        return t.name == n.name && t.message == n.message;
      case "[object RegExp]":
      case "[object String]":
        return t == n + "";
      case "[object Map]":
        var h = c;
      case "[object Set]":
        var v = 1 & e;
        if (h || (h = a), t.size != n.size && !v) return !1;
        var d = p.get(t);
        if (d) return d == n;
        e |= 2, p.set(t, n);
        var y = u(h(t), h(n), e, s, l, p);
        return p.delete(t), y;
      case "[object Symbol]":
        if (f) return f.call(t) == f.call(n);
    }
    return !1;
  };
}, function (t, n) {
  t.exports = function (t) {
    var n = -1,
      r = Array(t.size);
    return t.forEach(function (t, e) {
      r[++n] = [e, t];
    }), r;
  };
}, function (t, n, r) {
  var e = r(59),
    o = Object.prototype.hasOwnProperty;
  t.exports = function (t, n, r, i, u, c) {
    var a = 1 & r,
      s = e(t),
      f = s.length;
    if (f != e(n).length && !a) return !1;
    for (var l = f; l--;) {
      var p = s[l];
      if (!(a ? p in n : o.call(n, p))) return !1;
    }
    var h = c.get(t);
    if (h && c.get(n)) return h == n;
    var v = !0;
    c.set(t, n), c.set(n, t);
    for (var d = a; ++l < f;) {
      var y = t[p = s[l]],
        _ = n[p];
      if (i) var g = a ? i(_, y, p, n, t, c) : i(y, _, p, t, n, c);
      if (!(void 0 === g ? y === _ || u(y, _, r, i, c) : g)) {
        v = !1;
        break;
      }
      d || (d = "constructor" == p);
    }
    if (v && !d) {
      var b = t.constructor,
        m = n.constructor;
      b != m && "constructor" in t && "constructor" in n && !("function" == typeof b && b instanceof b && "function" == typeof m && m instanceof m) && (v = !1);
    }
    return c.delete(t), c.delete(n), v;
  };
}, function (t, n, r) {
  var e = r(70),
    o = r(6);
  t.exports = function (t) {
    for (var n = o(t), r = n.length; r--;) {
      var i = n[r],
        u = t[i];
      n[r] = [i, u, e(u)];
    }
    return n;
  };
}, function (t, n, r) {
  var e = r(66),
    o = r(165),
    i = r(171),
    u = r(43),
    c = r(70),
    a = r(71),
    s = r(27);
  t.exports = function (t, n) {
    return u(t) && c(n) ? a(s(t), n) : function (r) {
      var u = o(r, t);
      return void 0 === u && u === n ? i(r, t) : e(n, u, 3);
    };
  };
}, function (t, n, r) {
  var e = r(72);
  t.exports = function (t, n, r) {
    var o = null == t ? void 0 : e(t, n);
    return void 0 === o ? r : o;
  };
}, function (t, n, r) {
  var e = r(167),
    o = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    i = /\\(\\)?/g,
    u = e(function (t) {
      var n = [];
      return 46 === t.charCodeAt(0) && n.push(""), t.replace(o, function (t, r, e, o) {
        n.push(e ? o.replace(i, "$1") : r || t);
      }), n;
    });
  t.exports = u;
}, function (t, n, r) {
  var e = r(168);
  t.exports = function (t) {
    var n = e(t, function (t) {
        return 500 === r.size && r.clear(), t;
      }),
      r = n.cache;
    return n;
  };
}, function (t, n, r) {
  var e = r(32);
  function o(t, n) {
    if ("function" != typeof t || null != n && "function" != typeof n) throw new TypeError("Expected a function");
    var r = function r() {
      var e = arguments,
        o = n ? n.apply(this, e) : e[0],
        i = r.cache;
      if (i.has(o)) return i.get(o);
      var u = t.apply(this, e);
      return r.cache = i.set(o, u) || i, u;
    };
    return r.cache = new (o.Cache || e)(), r;
  }
  o.Cache = e, t.exports = o;
}, function (t, n, r) {
  var e = r(170);
  t.exports = function (t) {
    return null == t ? "" : e(t);
  };
}, function (t, n, r) {
  var e = r(9),
    o = r(45),
    i = r(0),
    u = r(44),
    c = e ? e.prototype : void 0,
    a = c ? c.toString : void 0;
  t.exports = function t(n) {
    if ("string" == typeof n) return n;
    if (i(n)) return o(n, t) + "";
    if (u(n)) return a ? a.call(n) : "";
    var r = n + "";
    return "0" == r && 1 / n == -1 / 0 ? "-0" : r;
  };
}, function (t, n, r) {
  var e = r(172),
    o = r(74);
  t.exports = function (t, n) {
    return null != t && o(t, n, e);
  };
}, function (t, n) {
  t.exports = function (t, n) {
    return null != t && n in Object(t);
  };
}, function (t, n, r) {
  var e = r(75),
    o = r(174),
    i = r(43),
    u = r(27);
  t.exports = function (t) {
    return i(t) ? e(u(t)) : o(t);
  };
}, function (t, n, r) {
  var e = r(72);
  t.exports = function (t) {
    return function (n) {
      return e(n, t);
    };
  };
}, function (t, n, r) {
  var e = r(176),
    o = r(74);
  t.exports = function (t, n) {
    return null != t && o(t, n, e);
  };
}, function (t, n) {
  var r = Object.prototype.hasOwnProperty;
  t.exports = function (t, n) {
    return null != t && r.call(t, n);
  };
}, function (t, n, r) {
  var e = r(37),
    o = r(10),
    i = r(21),
    u = r(0),
    c = r(7),
    a = r(12),
    s = r(23),
    f = r(22),
    l = Object.prototype.hasOwnProperty;
  t.exports = function (t) {
    if (null == t) return !0;
    if (c(t) && (u(t) || "string" == typeof t || "function" == typeof t.splice || a(t) || f(t) || i(t))) return !t.length;
    var n = o(t);
    if ("[object Map]" == n || "[object Set]" == n) return !t.size;
    if (s(t)) return !e(t).length;
    for (var r in t) if (l.call(t, r)) return !1;
    return !0;
  };
}, function (t, n) {
  t.exports = function (t) {
    return void 0 === t;
  };
}, function (t, n, r) {
  var e = r(45),
    o = r(26),
    i = r(180),
    u = r(0);
  t.exports = function (t, n) {
    return (u(t) ? e : i)(t, o(n, 3));
  };
}, function (t, n, r) {
  var e = r(24),
    o = r(7);
  t.exports = function (t, n) {
    var r = -1,
      i = o(t) ? Array(t.length) : [];
    return e(t, function (t, e, o) {
      i[++r] = n(t, e, o);
    }), i;
  };
}, function (t, n, r) {
  var e = r(182),
    o = r(24),
    i = r(26),
    u = r(183),
    c = r(0);
  t.exports = function (t, n, r) {
    var a = c(t) ? e : u,
      s = arguments.length < 3;
    return a(t, i(n, 4), r, s, o);
  };
}, function (t, n) {
  t.exports = function (t, n, r, e) {
    var o = -1,
      i = null == t ? 0 : t.length;
    for (e && i && (r = t[++o]); ++o < i;) r = n(r, t[o], o, t);
    return r;
  };
}, function (t, n) {
  t.exports = function (t, n, r, e, o) {
    return o(t, function (t, o, i) {
      r = e ? (e = !1, t) : n(r, t, o, i);
    }), r;
  };
}, function (t, n, r) {
  var e = r(37),
    o = r(10),
    i = r(7),
    u = r(185),
    c = r(186);
  t.exports = function (t) {
    if (null == t) return 0;
    if (i(t)) return u(t) ? c(t) : t.length;
    var n = o(t);
    return "[object Map]" == n || "[object Set]" == n ? t.size : e(t).length;
  };
}, function (t, n, r) {
  var e = r(8),
    o = r(0),
    i = r(3);
  t.exports = function (t) {
    return "string" == typeof t || !o(t) && i(t) && "[object String]" == e(t);
  };
}, function (t, n, r) {
  var e = r(187),
    o = r(188),
    i = r(189);
  t.exports = function (t) {
    return o(t) ? i(t) : e(t);
  };
}, function (t, n, r) {
  var e = r(75)("length");
  t.exports = e;
}, function (t, n) {
  var r = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
  t.exports = function (t) {
    return r.test(t);
  };
}, function (t, n) {
  var r = "[\\ud800-\\udfff]",
    e = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
    o = "\\ud83c[\\udffb-\\udfff]",
    i = "[^\\ud800-\\udfff]",
    u = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    c = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    a = "(?:" + e + "|" + o + ")" + "?",
    s = "[\\ufe0e\\ufe0f]?" + a + ("(?:\\u200d(?:" + [i, u, c].join("|") + ")[\\ufe0e\\ufe0f]?" + a + ")*"),
    f = "(?:" + [i + e + "?", e, u, c, r].join("|") + ")",
    l = RegExp(o + "(?=" + o + ")|" + f + s, "g");
  t.exports = function (t) {
    for (var n = l.lastIndex = 0; l.test(t);) ++n;
    return n;
  };
}, function (t, n, r) {
  var e = r(33),
    o = r(63),
    i = r(65),
    u = r(26),
    c = r(40),
    a = r(0),
    s = r(12),
    f = r(17),
    l = r(5),
    p = r(22);
  t.exports = function (t, n, r) {
    var h = a(t),
      v = h || s(t) || p(t);
    if (n = u(n, 4), null == r) {
      var d = t && t.constructor;
      r = v ? h ? new d() : [] : l(t) && f(d) ? o(c(t)) : {};
    }
    return (v ? e : i)(t, function (t, e, o) {
      return n(r, t, e, o);
    }), r;
  };
}, function (t, n, r) {
  var e = r(192),
    o = r(194),
    i = r(200),
    u = r(209),
    c = o(function (t) {
      return i(e(t, 1, u, !0));
    });
  t.exports = c;
}, function (t, n, r) {
  var e = r(39),
    o = r(193);
  t.exports = function t(n, r, i, u, c) {
    var a = -1,
      s = n.length;
    for (i || (i = o), c || (c = []); ++a < s;) {
      var f = n[a];
      r > 0 && i(f) ? r > 1 ? t(f, r - 1, i, u, c) : e(c, f) : u || (c[c.length] = f);
    }
    return c;
  };
}, function (t, n, r) {
  var e = r(9),
    o = r(21),
    i = r(0),
    u = e ? e.isConcatSpreadable : void 0;
  t.exports = function (t) {
    return i(t) || o(t) || !!(u && t && t[u]);
  };
}, function (t, n, r) {
  var e = r(25),
    o = r(195),
    i = r(197);
  t.exports = function (t, n) {
    return i(o(t, n, e), t + "");
  };
}, function (t, n, r) {
  var e = r(196),
    o = Math.max;
  t.exports = function (t, n, r) {
    return n = o(void 0 === n ? t.length - 1 : n, 0), function () {
      for (var i = arguments, u = -1, c = o(i.length - n, 0), a = Array(c); ++u < c;) a[u] = i[n + u];
      u = -1;
      for (var s = Array(n + 1); ++u < n;) s[u] = i[u];
      return s[n] = r(a), e(t, this, s);
    };
  };
}, function (t, n) {
  t.exports = function (t, n, r) {
    switch (r.length) {
      case 0:
        return t.call(n);
      case 1:
        return t.call(n, r[0]);
      case 2:
        return t.call(n, r[0], r[1]);
      case 3:
        return t.call(n, r[0], r[1], r[2]);
    }
    return t.apply(n, r);
  };
}, function (t, n, r) {
  var e = r(198),
    o = r(199)(e);
  t.exports = o;
}, function (t, n, r) {
  var e = r(64),
    o = r(51),
    i = r(25),
    u = o ? function (t, n) {
      return o(t, "toString", {
        configurable: !0,
        enumerable: !1,
        value: e(n),
        writable: !0
      });
    } : i;
  t.exports = u;
}, function (t, n) {
  var r = Date.now;
  t.exports = function (t) {
    var n = 0,
      e = 0;
    return function () {
      var o = r(),
        i = 16 - (o - e);
      if (e = o, i > 0) {
        if (++n >= 800) return arguments[0];
      } else n = 0;
      return t.apply(void 0, arguments);
    };
  };
}, function (t, n, r) {
  var e = r(68),
    o = r(201),
    i = r(206),
    u = r(69),
    c = r(207),
    a = r(42);
  t.exports = function (t, n, r) {
    var s = -1,
      f = o,
      l = t.length,
      p = !0,
      h = [],
      v = h;
    if (r) p = !1, f = i;else if (l >= 200) {
      var d = n ? null : c(t);
      if (d) return a(d);
      p = !1, f = u, v = new e();
    } else v = n ? [] : h;
    t: for (; ++s < l;) {
      var y = t[s],
        _ = n ? n(y) : y;
      if (y = r || 0 !== y ? y : 0, p && _ == _) {
        for (var g = v.length; g--;) if (v[g] === _) continue t;
        n && v.push(_), h.push(y);
      } else f(v, _, r) || (v !== h && v.push(_), h.push(y));
    }
    return h;
  };
}, function (t, n, r) {
  var e = r(202);
  t.exports = function (t, n) {
    return !!(null == t ? 0 : t.length) && e(t, n, 0) > -1;
  };
}, function (t, n, r) {
  var e = r(203),
    o = r(204),
    i = r(205);
  t.exports = function (t, n, r) {
    return n == n ? i(t, n, r) : e(t, o, r);
  };
}, function (t, n) {
  t.exports = function (t, n, r, e) {
    for (var o = t.length, i = r + (e ? 1 : -1); e ? i-- : ++i < o;) if (n(t[i], i, t)) return i;
    return -1;
  };
}, function (t, n) {
  t.exports = function (t) {
    return t != t;
  };
}, function (t, n) {
  t.exports = function (t, n, r) {
    for (var e = r - 1, o = t.length; ++e < o;) if (t[e] === n) return e;
    return -1;
  };
}, function (t, n) {
  t.exports = function (t, n, r) {
    for (var e = -1, o = null == t ? 0 : t.length; ++e < o;) if (r(n, t[e])) return !0;
    return !1;
  };
}, function (t, n, r) {
  var e = r(61),
    o = r(208),
    i = r(42),
    u = e && 1 / i(new e([, -0]))[1] == 1 / 0 ? function (t) {
      return new e(t);
    } : o;
  t.exports = u;
}, function (t, n) {
  t.exports = function () {};
}, function (t, n, r) {
  var e = r(7),
    o = r(3);
  t.exports = function (t) {
    return o(t) && e(t);
  };
}, function (t, n, r) {
  var e = r(211),
    o = r(6);
  t.exports = function (t) {
    return null == t ? [] : e(t, o(t));
  };
}, function (t, n, r) {
  var e = r(45);
  t.exports = function (t, n) {
    return e(n, function (n) {
      return t[n];
    });
  };
}, function (t, n) {
  t.exports = "2.1.8";
}, function (t, n, r) {
  var e = r(1),
    o = r(28);
  function i(t) {
    return e.map(t.nodes(), function (n) {
      var r = t.node(n),
        o = t.parent(n),
        i = {
          v: n
        };
      return e.isUndefined(r) || (i.value = r), e.isUndefined(o) || (i.parent = o), i;
    });
  }
  function u(t) {
    return e.map(t.edges(), function (n) {
      var r = t.edge(n),
        o = {
          v: n.v,
          w: n.w
        };
      return e.isUndefined(n.name) || (o.name = n.name), e.isUndefined(r) || (o.value = r), o;
    });
  }
  t.exports = {
    write: function (t) {
      var n = {
        options: {
          directed: t.isDirected(),
          multigraph: t.isMultigraph(),
          compound: t.isCompound()
        },
        nodes: i(t),
        edges: u(t)
      };
      e.isUndefined(t.graph()) || (n.value = e.clone(t.graph()));
      return n;
    },
    read: function (t) {
      var n = new o(t.options).setGraph(t.value);
      return e.each(t.nodes, function (t) {
        n.setNode(t.v, t.value), t.parent && n.setParent(t.v, t.parent);
      }), e.each(t.edges, function (t) {
        n.setEdge({
          v: t.v,
          w: t.w,
          name: t.name
        }, t.value);
      }), n;
    }
  };
}, function (t, n, r) {
  t.exports = {
    components: r(215),
    dijkstra: r(76),
    dijkstraAll: r(216),
    findCycles: r(217),
    floydWarshall: r(218),
    isAcyclic: r(219),
    postorder: r(220),
    preorder: r(221),
    prim: r(222),
    tarjan: r(78),
    topsort: r(79)
  };
}, function (t, n, r) {
  var e = r(1);
  t.exports = function (t) {
    var n,
      r = {},
      o = [];
    function i(o) {
      e.has(r, o) || (r[o] = !0, n.push(o), e.each(t.successors(o), i), e.each(t.predecessors(o), i));
    }
    return e.each(t.nodes(), function (t) {
      n = [], i(t), n.length && o.push(n);
    }), o;
  };
}, function (t, n, r) {
  var e = r(76),
    o = r(1);
  t.exports = function (t, n, r) {
    return o.transform(t.nodes(), function (o, i) {
      o[i] = e(t, i, n, r);
    }, {});
  };
}, function (t, n, r) {
  var e = r(1),
    o = r(78);
  t.exports = function (t) {
    return e.filter(o(t), function (n) {
      return n.length > 1 || 1 === n.length && t.hasEdge(n[0], n[0]);
    });
  };
}, function (t, n, r) {
  var e = r(1);
  t.exports = function (t, n, r) {
    return function (t, n, r) {
      var e = {},
        o = t.nodes();
      return o.forEach(function (t) {
        e[t] = {}, e[t][t] = {
          distance: 0
        }, o.forEach(function (n) {
          t !== n && (e[t][n] = {
            distance: Number.POSITIVE_INFINITY
          });
        }), r(t).forEach(function (r) {
          var o = r.v === t ? r.w : r.v,
            i = n(r);
          e[t][o] = {
            distance: i,
            predecessor: t
          };
        });
      }), o.forEach(function (t) {
        var n = e[t];
        o.forEach(function (r) {
          var i = e[r];
          o.forEach(function (r) {
            var e = i[t],
              o = n[r],
              u = i[r],
              c = e.distance + o.distance;
            c < u.distance && (u.distance = c, u.predecessor = o.predecessor);
          });
        });
      }), e;
    }(t, n || o, r || function (n) {
      return t.outEdges(n);
    });
  };
  var o = e.constant(1);
}, function (t, n, r) {
  var e = r(79);
  t.exports = function (t) {
    try {
      e(t);
    } catch (t) {
      if (t instanceof e.CycleException) return !1;
      throw t;
    }
    return !0;
  };
}, function (t, n, r) {
  var e = r(80);
  t.exports = function (t, n) {
    return e(t, n, "post");
  };
}, function (t, n, r) {
  var e = r(80);
  t.exports = function (t, n) {
    return e(t, n, "pre");
  };
}, function (t, n, r) {
  var e = r(1),
    o = r(28),
    i = r(77);
  t.exports = function (t, n) {
    var r,
      u = new o(),
      c = {},
      a = new i();
    function s(t) {
      var e = t.v === r ? t.w : t.v,
        o = a.priority(e);
      if (void 0 !== o) {
        var i = n(t);
        i < o && (c[e] = r, a.decrease(e, i));
      }
    }
    if (0 === t.nodeCount()) return u;
    e.each(t.nodes(), function (t) {
      a.add(t, Number.POSITIVE_INFINITY), u.setNode(t);
    }), a.decrease(t.nodes()[0], 0);
    var f = !1;
    for (; a.size() > 0;) {
      if (r = a.removeMin(), e.has(c, r)) u.setEdge(r, c[r]);else {
        if (f) throw new Error("Input graph is not connected: " + t);
        f = !0;
      }
      t.nodeEdges(r).forEach(s);
    }
    return u;
  };
}, function (t, n, r) {
  (function (t) {
    function r(t, n) {
      for (var r = 0, e = t.length - 1; e >= 0; e--) {
        var o = t[e];
        "." === o ? t.splice(e, 1) : ".." === o ? (t.splice(e, 1), r++) : r && (t.splice(e, 1), r--);
      }
      if (n) for (; r--; r) t.unshift("..");
      return t;
    }
    function e(t, n) {
      if (t.filter) return t.filter(n);
      for (var r = [], e = 0; e < t.length; e++) n(t[e], e, t) && r.push(t[e]);
      return r;
    }
    n.resolve = function () {
      for (var n = "", o = !1, i = arguments.length - 1; i >= -1 && !o; i--) {
        var u = i >= 0 ? arguments[i] : t.cwd();
        if ("string" != typeof u) throw new TypeError("Arguments to path.resolve must be strings");
        u && (n = u + "/" + n, o = "/" === u.charAt(0));
      }
      return (o ? "/" : "") + (n = r(e(n.split("/"), function (t) {
        return !!t;
      }), !o).join("/")) || ".";
    }, n.normalize = function (t) {
      var i = n.isAbsolute(t),
        u = "/" === o(t, -1);
      return (t = r(e(t.split("/"), function (t) {
        return !!t;
      }), !i).join("/")) || i || (t = "."), t && u && (t += "/"), (i ? "/" : "") + t;
    }, n.isAbsolute = function (t) {
      return "/" === t.charAt(0);
    }, n.join = function () {
      var t = Array.prototype.slice.call(arguments, 0);
      return n.normalize(e(t, function (t, n) {
        if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");
        return t;
      }).join("/"));
    }, n.relative = function (t, r) {
      function e(t) {
        for (var n = 0; n < t.length && "" === t[n]; n++);
        for (var r = t.length - 1; r >= 0 && "" === t[r]; r--);
        return n > r ? [] : t.slice(n, r - n + 1);
      }
      t = n.resolve(t).substr(1), r = n.resolve(r).substr(1);
      for (var o = e(t.split("/")), i = e(r.split("/")), u = Math.min(o.length, i.length), c = u, a = 0; a < u; a++) if (o[a] !== i[a]) {
        c = a;
        break;
      }
      var s = [];
      for (a = c; a < o.length; a++) s.push("..");
      return (s = s.concat(i.slice(c))).join("/");
    }, n.sep = "/", n.delimiter = ":", n.dirname = function (t) {
      if ("string" != typeof t && (t += ""), 0 === t.length) return ".";
      for (var n = t.charCodeAt(0), r = 47 === n, e = -1, o = !0, i = t.length - 1; i >= 1; --i) if (47 === (n = t.charCodeAt(i))) {
        if (!o) {
          e = i;
          break;
        }
      } else o = !1;
      return -1 === e ? r ? "/" : "." : r && 1 === e ? "/" : t.slice(0, e);
    }, n.basename = function (t, n) {
      var r = function (t) {
        "string" != typeof t && (t += "");
        var n,
          r = 0,
          e = -1,
          o = !0;
        for (n = t.length - 1; n >= 0; --n) if (47 === t.charCodeAt(n)) {
          if (!o) {
            r = n + 1;
            break;
          }
        } else -1 === e && (o = !1, e = n + 1);
        return -1 === e ? "" : t.slice(r, e);
      }(t);
      return n && r.substr(-1 * n.length) === n && (r = r.substr(0, r.length - n.length)), r;
    }, n.extname = function (t) {
      "string" != typeof t && (t += "");
      for (var n = -1, r = 0, e = -1, o = !0, i = 0, u = t.length - 1; u >= 0; --u) {
        var c = t.charCodeAt(u);
        if (47 !== c) -1 === e && (o = !1, e = u + 1), 46 === c ? -1 === n ? n = u : 1 !== i && (i = 1) : -1 !== n && (i = -1);else if (!o) {
          r = u + 1;
          break;
        }
      }
      return -1 === n || -1 === e || 0 === i || 1 === i && n === e - 1 && n === r + 1 ? "" : t.slice(n, e);
    };
    var o = "b" === "ab".substr(-1) ? function (t, n, r) {
      return t.substr(n, r);
    } : function (t, n, r) {
      return n < 0 && (n = t.length + n), t.substr(n, r);
    };
  }).call(this, r(13));
}, function (t, n, r) {

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = {
      file: r(225),
      http: r(81),
      https: r(81)
    },
    i = "object" === ("undefined" == typeof window ? "undefined" : e(window)) || "function" == typeof importScripts ? o.http : o.file;
  "undefined" == typeof Promise && r(83), t.exports.load = function (t, n) {
    var r = Promise.resolve();
    return void 0 === n && (n = {}), r = (r = r.then(function () {
      if (void 0 === t) throw new TypeError("location is required");
      if ("string" != typeof t) throw new TypeError("location must be a string");
      if (void 0 !== n) {
        if ("object" !== e(n)) throw new TypeError("options must be an object");
        if (void 0 !== n.processContent && "function" != typeof n.processContent) throw new TypeError("options.processContent must be a function");
      }
    })).then(function () {
      return new Promise(function (r, e) {
        (function (t) {
          var n = function (t) {
              return void 0 !== t && (t = -1 === t.indexOf("://") ? "" : t.split("://")[0]), t;
            }(t),
            r = o[n];
          if (void 0 === r) {
            if ("" !== n) throw new Error("Unsupported scheme: " + n);
            r = i;
          }
          return r;
        })(t).load(t, n || {}, function (t, n) {
          t ? e(t) : r(n);
        });
      });
    }).then(function (r) {
      return n.processContent ? new Promise(function (o, i) {
        "object" !== e(r) && (r = {
          text: r
        }), r.location = t, n.processContent(r, function (t, n) {
          t ? i(t) : o(n);
        });
      }) : "object" === e(r) ? r.text : r;
    });
  };
}, function (t, n, r) {

  var e = new TypeError("The 'file' scheme is not supported in the browser");
  t.exports.getBase = function () {
    throw e;
  }, t.exports.load = function () {
    var t = arguments[arguments.length - 1];
    if ("function" != typeof t) throw e;
    t(e);
  };
}, function (t, n, r) {
  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o;
  "undefined" != typeof window ? o = window : "undefined" != typeof self ? o = self : (console.warn("Using browser-only version of superagent in non-browser environment"), o = this);
  var i = r(227),
    u = r(228),
    c = r(82),
    a = r(229),
    s = r(231);
  function f() {}
  var l = n = t.exports = function (t, r) {
    return "function" == typeof r ? new n.Request("GET", t).end(r) : 1 == arguments.length ? new n.Request("GET", t) : new n.Request(t, r);
  };
  n.Request = g, l.getXHR = function () {
    if (!(!o.XMLHttpRequest || o.location && "file:" == o.location.protocol && o.ActiveXObject)) return new XMLHttpRequest();
    try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (t) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (t) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (t) {}
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (t) {}
    throw Error("Browser-only version of superagent could not find XHR");
  };
  var p = "".trim ? function (t) {
    return t.trim();
  } : function (t) {
    return t.replace(/(^\s*|\s*$)/g, "");
  };
  function h(t) {
    if (!c(t)) return t;
    var n = [];
    for (var r in t) v(n, r, t[r]);
    return n.join("&");
  }
  function v(t, n, r) {
    if (null != r) {
      if (Array.isArray(r)) r.forEach(function (r) {
        v(t, n, r);
      });else if (c(r)) for (var e in r) v(t, n + "[" + e + "]", r[e]);else t.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
    } else null === r && t.push(encodeURIComponent(n));
  }
  function d(t) {
    for (var n, r, e = {}, o = t.split("&"), i = 0, u = o.length; i < u; ++i) -1 == (r = (n = o[i]).indexOf("=")) ? e[decodeURIComponent(n)] = "" : e[decodeURIComponent(n.slice(0, r))] = decodeURIComponent(n.slice(r + 1));
    return e;
  }
  function y(t) {
    return /[\/+]json($|[^-\w])/.test(t);
  }
  function _(t) {
    this.req = t, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
    var n = this.xhr.status;
    1223 === n && (n = 204), this._setStatusProperties(n), this.header = this.headers = function (t) {
      for (var n, r, e, o, i = t.split(/\r?\n/), u = {}, c = 0, a = i.length; c < a; ++c) -1 !== (n = (r = i[c]).indexOf(":")) && (e = r.slice(0, n).toLowerCase(), o = p(r.slice(n + 1)), u[e] = o);
      return u;
    }(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && t._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }
  function g(t, n) {
    var r = this;
    this._query = this._query || [], this.method = t, this.url = n, this.header = {}, this._header = {}, this.on("end", function () {
      var t,
        n = null,
        e = null;
      try {
        e = new _(r);
      } catch (t) {
        return (n = new Error("Parser is unable to parse the response")).parse = !0, n.original = t, r.xhr ? (n.rawResponse = void 0 === r.xhr.responseType ? r.xhr.responseText : r.xhr.response, n.status = r.xhr.status ? r.xhr.status : null, n.statusCode = n.status) : (n.rawResponse = null, n.status = null), r.callback(n);
      }
      r.emit("response", e);
      try {
        r._isResponseOK(e) || (t = new Error(e.statusText || "Unsuccessful HTTP response"));
      } catch (n) {
        t = n;
      }
      t ? (t.original = n, t.response = e, t.status = e.status, r.callback(t, e)) : r.callback(null, e);
    });
  }
  function b(t, n, r) {
    var e = l("DELETE", t);
    return "function" == typeof n && (r = n, n = null), n && e.send(n), r && e.end(r), e;
  }
  l.serializeObject = h, l.parseString = d, l.types = {
    html: "text/html",
    json: "application/json",
    xml: "text/xml",
    urlencoded: "application/x-www-form-urlencoded",
    form: "application/x-www-form-urlencoded",
    "form-data": "application/x-www-form-urlencoded"
  }, l.serialize = {
    "application/x-www-form-urlencoded": h,
    "application/json": JSON.stringify
  }, l.parse = {
    "application/x-www-form-urlencoded": d,
    "application/json": JSON.parse
  }, a(_.prototype), _.prototype._parseBody = function (t) {
    var n = l.parse[this.type];
    return this.req._parser ? this.req._parser(this, t) : (!n && y(this.type) && (n = l.parse["application/json"]), n && t && (t.length || t instanceof Object) ? n(t) : null);
  }, _.prototype.toError = function () {
    var t = this.req,
      n = t.method,
      r = t.url,
      e = "cannot " + n + " " + r + " (" + this.status + ")",
      o = new Error(e);
    return o.status = this.status, o.method = n, o.url = r, o;
  }, l.Response = _, i(g.prototype), u(g.prototype), g.prototype.type = function (t) {
    return this.set("Content-Type", l.types[t] || t), this;
  }, g.prototype.accept = function (t) {
    return this.set("Accept", l.types[t] || t), this;
  }, g.prototype.auth = function (t, n, r) {
    1 === arguments.length && (n = ""), "object" === e(n) && null !== n && (r = n, n = ""), r || (r = {
      type: "function" == typeof btoa ? "basic" : "auto"
    });
    var o = function (t) {
      if ("function" == typeof btoa) return btoa(t);
      throw new Error("Cannot use basic auth, btoa is not a function");
    };
    return this._auth(t, n, r, o);
  }, g.prototype.query = function (t) {
    return "string" != typeof t && (t = h(t)), t && this._query.push(t), this;
  }, g.prototype.attach = function (t, n, r) {
    if (n) {
      if (this._data) throw Error("superagent can't mix .send() and .attach()");
      this._getFormData().append(t, n, r || n.name);
    }
    return this;
  }, g.prototype._getFormData = function () {
    return this._formData || (this._formData = new o.FormData()), this._formData;
  }, g.prototype.callback = function (t, n) {
    if (this._shouldRetry(t, n)) return this._retry();
    var r = this._callback;
    this.clearTimeout(), t && (this._maxRetries && (t.retries = this._retries - 1), this.emit("error", t)), r(t, n);
  }, g.prototype.crossDomainError = function () {
    var t = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
    t.crossDomain = !0, t.status = this.status, t.method = this.method, t.url = this.url, this.callback(t);
  }, g.prototype.buffer = g.prototype.ca = g.prototype.agent = function () {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, g.prototype.pipe = g.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
  }, g.prototype._isHost = function (t) {
    return t && "object" === e(t) && !Array.isArray(t) && "[object Object]" !== Object.prototype.toString.call(t);
  }, g.prototype.end = function (t) {
    return this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = t || f, this._finalizeQueryString(), this._end();
  }, g.prototype._end = function () {
    var t = this,
      n = this.xhr = l.getXHR(),
      r = this._formData || this._data;
    this._setTimeouts(), n.onreadystatechange = function () {
      var r = n.readyState;
      if (r >= 2 && t._responseTimeoutTimer && clearTimeout(t._responseTimeoutTimer), 4 == r) {
        var e;
        try {
          e = n.status;
        } catch (t) {
          e = 0;
        }
        if (!e) {
          if (t.timedout || t._aborted) return;
          return t.crossDomainError();
        }
        t.emit("end");
      }
    };
    var e = function (n, r) {
      r.total > 0 && (r.percent = r.loaded / r.total * 100), r.direction = n, t.emit("progress", r);
    };
    if (this.hasListeners("progress")) try {
      n.onprogress = e.bind(null, "download"), n.upload && (n.upload.onprogress = e.bind(null, "upload"));
    } catch (t) {}
    try {
      this.username && this.password ? n.open(this.method, this.url, !0, this.username, this.password) : n.open(this.method, this.url, !0);
    } catch (t) {
      return this.callback(t);
    }
    if (this._withCredentials && (n.withCredentials = !0), !this._formData && "GET" != this.method && "HEAD" != this.method && "string" != typeof r && !this._isHost(r)) {
      var o = this._header["content-type"],
        i = this._serializer || l.serialize[o ? o.split(";")[0] : ""];
      !i && y(o) && (i = l.serialize["application/json"]), i && (r = i(r));
    }
    for (var u in this.header) null != this.header[u] && this.header.hasOwnProperty(u) && n.setRequestHeader(u, this.header[u]);
    return this._responseType && (n.responseType = this._responseType), this.emit("request", this), n.send(void 0 !== r ? r : null), this;
  }, l.agent = function () {
    return new s();
  }, ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (t) {
    s.prototype[t.toLowerCase()] = function (n, r) {
      var e = new l.Request(t, n);
      return this._setDefaults(e), r && e.end(r), e;
    };
  }), s.prototype.del = s.prototype.delete, l.get = function (t, n, r) {
    var e = l("GET", t);
    return "function" == typeof n && (r = n, n = null), n && e.query(n), r && e.end(r), e;
  }, l.head = function (t, n, r) {
    var e = l("HEAD", t);
    return "function" == typeof n && (r = n, n = null), n && e.query(n), r && e.end(r), e;
  }, l.options = function (t, n, r) {
    var e = l("OPTIONS", t);
    return "function" == typeof n && (r = n, n = null), n && e.send(n), r && e.end(r), e;
  }, l.del = b, l.delete = b, l.patch = function (t, n, r) {
    var e = l("PATCH", t);
    return "function" == typeof n && (r = n, n = null), n && e.send(n), r && e.end(r), e;
  }, l.post = function (t, n, r) {
    var e = l("POST", t);
    return "function" == typeof n && (r = n, n = null), n && e.send(n), r && e.end(r), e;
  }, l.put = function (t, n, r) {
    var e = l("PUT", t);
    return "function" == typeof n && (r = n, n = null), n && e.send(n), r && e.end(r), e;
  };
}, function (t, n, r) {
  function e(t) {
    if (t) return function (t) {
      for (var n in e.prototype) t[n] = e.prototype[n];
      return t;
    }(t);
  }
  t.exports = e, e.prototype.on = e.prototype.addEventListener = function (t, n) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(n), this;
  }, e.prototype.once = function (t, n) {
    function r() {
      this.off(t, r), n.apply(this, arguments);
    }
    return r.fn = n, this.on(t, r), this;
  }, e.prototype.off = e.prototype.removeListener = e.prototype.removeAllListeners = e.prototype.removeEventListener = function (t, n) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
    var r,
      e = this._callbacks["$" + t];
    if (!e) return this;
    if (1 == arguments.length) return delete this._callbacks["$" + t], this;
    for (var o = 0; o < e.length; o++) if ((r = e[o]) === n || r.fn === n) {
      e.splice(o, 1);
      break;
    }
    return this;
  }, e.prototype.emit = function (t) {
    this._callbacks = this._callbacks || {};
    var n = [].slice.call(arguments, 1),
      r = this._callbacks["$" + t];
    if (r) for (var e = 0, o = (r = r.slice(0)).length; e < o; ++e) r[e].apply(this, n);
    return this;
  }, e.prototype.listeners = function (t) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
  }, e.prototype.hasListeners = function (t) {
    return !!this.listeners(t).length;
  };
}, function (t, n, r) {

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = r(82);
  function i(t) {
    if (t) return function (t) {
      for (var n in i.prototype) t[n] = i.prototype[n];
      return t;
    }(t);
  }
  t.exports = i, i.prototype.clearTimeout = function () {
    return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, this;
  }, i.prototype.parse = function (t) {
    return this._parser = t, this;
  }, i.prototype.responseType = function (t) {
    return this._responseType = t, this;
  }, i.prototype.serialize = function (t) {
    return this._serializer = t, this;
  }, i.prototype.timeout = function (t) {
    if (!t || "object" !== e(t)) return this._timeout = t, this._responseTimeout = 0, this;
    for (var n in t) switch (n) {
      case "deadline":
        this._timeout = t.deadline;
        break;
      case "response":
        this._responseTimeout = t.response;
        break;
      default:
        console.warn("Unknown timeout option", n);
    }
    return this;
  }, i.prototype.retry = function (t, n) {
    return 0 !== arguments.length && !0 !== t || (t = 1), t <= 0 && (t = 0), this._maxRetries = t, this._retries = 0, this._retryCallback = n, this;
  };
  var u = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];
  i.prototype._shouldRetry = function (t, n) {
    if (!this._maxRetries || this._retries++ >= this._maxRetries) return !1;
    if (this._retryCallback) try {
      var r = this._retryCallback(t, n);
      if (!0 === r) return !0;
      if (!1 === r) return !1;
    } catch (t) {
      console.error(t);
    }
    if (n && n.status && n.status >= 500 && 501 != n.status) return !0;
    if (t) {
      if (t.code && ~u.indexOf(t.code)) return !0;
      if (t.timeout && "ECONNABORTED" == t.code) return !0;
      if (t.crossDomain) return !0;
    }
    return !1;
  }, i.prototype._retry = function () {
    return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this._end();
  }, i.prototype.then = function (t, n) {
    if (!this._fullfilledPromise) {
      var r = this;
      this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function (t, n) {
        r.end(function (r, e) {
          r ? n(r) : t(e);
        });
      });
    }
    return this._fullfilledPromise.then(t, n);
  }, i.prototype.catch = function (t) {
    return this.then(void 0, t);
  }, i.prototype.use = function (t) {
    return t(this), this;
  }, i.prototype.ok = function (t) {
    if ("function" != typeof t) throw Error("Callback required");
    return this._okCallback = t, this;
  }, i.prototype._isResponseOK = function (t) {
    return !!t && (this._okCallback ? this._okCallback(t) : t.status >= 200 && t.status < 300);
  }, i.prototype.get = function (t) {
    return this._header[t.toLowerCase()];
  }, i.prototype.getHeader = i.prototype.get, i.prototype.set = function (t, n) {
    if (o(t)) {
      for (var r in t) this.set(r, t[r]);
      return this;
    }
    return this._header[t.toLowerCase()] = n, this.header[t] = n, this;
  }, i.prototype.unset = function (t) {
    return delete this._header[t.toLowerCase()], delete this.header[t], this;
  }, i.prototype.field = function (t, n) {
    if (null == t) throw new Error(".field(name, val) name can not be empty");
    if (this._data && console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"), o(t)) {
      for (var r in t) this.field(r, t[r]);
      return this;
    }
    if (Array.isArray(n)) {
      for (var e in n) this.field(t, n[e]);
      return this;
    }
    if (null == n) throw new Error(".field(name, val) val can not be empty");
    return "boolean" == typeof n && (n = "" + n), this._getFormData().append(t, n), this;
  }, i.prototype.abort = function () {
    return this._aborted || (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort")), this;
  }, i.prototype._auth = function (t, n, r, e) {
    switch (r.type) {
      case "basic":
        this.set("Authorization", "Basic " + e(t + ":" + n));
        break;
      case "auto":
        this.username = t, this.password = n;
        break;
      case "bearer":
        this.set("Authorization", "Bearer " + t);
    }
    return this;
  }, i.prototype.withCredentials = function (t) {
    return null == t && (t = !0), this._withCredentials = t, this;
  }, i.prototype.redirects = function (t) {
    return this._maxRedirects = t, this;
  }, i.prototype.maxResponseSize = function (t) {
    if ("number" != typeof t) throw TypeError("Invalid argument");
    return this._maxResponseSize = t, this;
  }, i.prototype.toJSON = function () {
    return {
      method: this.method,
      url: this.url,
      data: this._data,
      headers: this._header
    };
  }, i.prototype.send = function (t) {
    var n = o(t),
      r = this._header["content-type"];
    if (this._formData && console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"), n && !this._data) Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {});else if (t && this._data && this._isHost(this._data)) throw Error("Can't merge these send calls");
    if (n && o(this._data)) for (var e in t) this._data[e] = t[e];else "string" == typeof t ? (r || this.type("form"), r = this._header["content-type"], this._data = "application/x-www-form-urlencoded" == r ? this._data ? this._data + "&" + t : t : (this._data || "") + t) : this._data = t;
    return !n || this._isHost(t) || r || this.type("json"), this;
  }, i.prototype.sortQuery = function (t) {
    return this._sort = void 0 === t || t, this;
  }, i.prototype._finalizeQueryString = function () {
    var t = this._query.join("&");
    if (t && (this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + t), this._query.length = 0, this._sort) {
      var n = this.url.indexOf("?");
      if (n >= 0) {
        var r = this.url.substring(n + 1).split("&");
        "function" == typeof this._sort ? r.sort(this._sort) : r.sort(), this.url = this.url.substring(0, n) + "?" + r.join("&");
      }
    }
  }, i.prototype._appendQueryString = function () {
    console.trace("Unsupported");
  }, i.prototype._timeoutError = function (t, n, r) {
    if (!this._aborted) {
      var e = new Error(t + n + "ms exceeded");
      e.timeout = n, e.code = "ECONNABORTED", e.errno = r, this.timedout = !0, this.abort(), this.callback(e);
    }
  }, i.prototype._setTimeouts = function () {
    var t = this;
    this._timeout && !this._timer && (this._timer = setTimeout(function () {
      t._timeoutError("Timeout of ", t._timeout, "ETIME");
    }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
      t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
    }, this._responseTimeout));
  };
}, function (t, n, r) {

  var e = r(230);
  function o(t) {
    if (t) return function (t) {
      for (var n in o.prototype) t[n] = o.prototype[n];
      return t;
    }(t);
  }
  t.exports = o, o.prototype.get = function (t) {
    return this.header[t.toLowerCase()];
  }, o.prototype._setHeaderProperties = function (t) {
    var n = t["content-type"] || "";
    this.type = e.type(n);
    var r = e.params(n);
    for (var o in r) this[o] = r[o];
    this.links = {};
    try {
      t.link && (this.links = e.parseLinks(t.link));
    } catch (t) {}
  }, o.prototype._setStatusProperties = function (t) {
    var n = t / 100 | 0;
    this.status = this.statusCode = t, this.statusType = n, this.info = 1 == n, this.ok = 2 == n, this.redirect = 3 == n, this.clientError = 4 == n, this.serverError = 5 == n, this.error = (4 == n || 5 == n) && this.toError(), this.created = 201 == t, this.accepted = 202 == t, this.noContent = 204 == t, this.badRequest = 400 == t, this.unauthorized = 401 == t, this.notAcceptable = 406 == t, this.forbidden = 403 == t, this.notFound = 404 == t, this.unprocessableEntity = 422 == t;
  };
}, function (t, n, r) {

  n.type = function (t) {
    return t.split(/ *; */).shift();
  }, n.params = function (t) {
    return t.split(/ *; */).reduce(function (t, n) {
      var r = n.split(/ *= */),
        e = r.shift(),
        o = r.shift();
      return e && o && (t[e] = o), t;
    }, {});
  }, n.parseLinks = function (t) {
    return t.split(/ *, */).reduce(function (t, n) {
      var r = n.split(/ *; */),
        e = r[0].slice(1, -1);
      return t[r[1].split(/ *= */)[1].slice(1, -1)] = e, t;
    }, {});
  }, n.cleanHeader = function (t, n) {
    return delete t["content-type"], delete t["content-length"], delete t["transfer-encoding"], delete t.host, n && (delete t.authorization, delete t.cookie), t;
  };
}, function (t, n) {
  function r() {
    this._defaults = [];
  }
  ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function (t) {
    r.prototype[t] = function () {
      return this._defaults.push({
        fn: t,
        arguments: arguments
      }), this;
    };
  }), r.prototype._setDefaults = function (t) {
    this._defaults.forEach(function (n) {
      t[n.fn].apply(t, n.arguments);
    });
  }, t.exports = r;
}, function (t, n, r) {
  (function (t) {
    var e = void 0 !== t && t || "undefined" != typeof self && self || window,
      o = Function.prototype.apply;
    function i(t, n) {
      this._id = t, this._clearFn = n;
    }
    n.setTimeout = function () {
      return new i(o.call(setTimeout, e, arguments), clearTimeout);
    }, n.setInterval = function () {
      return new i(o.call(setInterval, e, arguments), clearInterval);
    }, n.clearTimeout = n.clearInterval = function (t) {
      t && t.close();
    }, i.prototype.unref = i.prototype.ref = function () {}, i.prototype.close = function () {
      this._clearFn.call(e, this._id);
    }, n.enroll = function (t, n) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = n;
    }, n.unenroll = function (t) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = -1;
    }, n._unrefActive = n.active = function (t) {
      clearTimeout(t._idleTimeoutId);
      var n = t._idleTimeout;
      n >= 0 && (t._idleTimeoutId = setTimeout(function () {
        t._onTimeout && t._onTimeout();
      }, n));
    }, r(233), n.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || this && this.setImmediate, n.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || this && this.clearImmediate;
  }).call(this, r(11));
}, function (t, n, r) {
  (function (t, n) {
    !function (t, r) {

      if (!t.setImmediate) {
        var e,
          o,
          i,
          u,
          c,
          a = 1,
          s = {},
          f = !1,
          l = t.document,
          p = Object.getPrototypeOf && Object.getPrototypeOf(t);
        p = p && p.setTimeout ? p : t, "[object process]" === {}.toString.call(t.process) ? e = function (t) {
          n.nextTick(function () {
            v(t);
          });
        } : !function () {
          if (t.postMessage && !t.importScripts) {
            var n = !0,
              r = t.onmessage;
            return t.onmessage = function () {
              n = !1;
            }, t.postMessage("", "*"), t.onmessage = r, n;
          }
        }() ? t.MessageChannel ? ((i = new MessageChannel()).port1.onmessage = function (t) {
          v(t.data);
        }, e = function (t) {
          i.port2.postMessage(t);
        }) : l && "onreadystatechange" in l.createElement("script") ? (o = l.documentElement, e = function (t) {
          var n = l.createElement("script");
          n.onreadystatechange = function () {
            v(t), n.onreadystatechange = null, o.removeChild(n), n = null;
          }, o.appendChild(n);
        }) : e = function (t) {
          setTimeout(v, 0, t);
        } : (u = "setImmediate$" + Math.random() + "$", c = function (n) {
          n.source === t && "string" == typeof n.data && 0 === n.data.indexOf(u) && v(+n.data.slice(u.length));
        }, t.addEventListener ? t.addEventListener("message", c, !1) : t.attachEvent("onmessage", c), e = function (n) {
          t.postMessage(u + n, "*");
        }), p.setImmediate = function (t) {
          "function" != typeof t && (t = new Function("" + t));
          for (var n = new Array(arguments.length - 1), r = 0; r < n.length; r++) n[r] = arguments[r + 1];
          var o = {
            callback: t,
            args: n
          };
          return s[a] = o, e(a), a++;
        }, p.clearImmediate = h;
      }
      function h(t) {
        delete s[t];
      }
      function v(t) {
        if (f) setTimeout(v, 0, t);else {
          var n = s[t];
          if (n) {
            f = !0;
            try {
              !function (t) {
                var n = t.callback,
                  r = t.args;
                switch (r.length) {
                  case 0:
                    n();
                    break;
                  case 1:
                    n(r[0]);
                    break;
                  case 2:
                    n(r[0], r[1]);
                    break;
                  case 3:
                    n(r[0], r[1], r[2]);
                    break;
                  default:
                    n.apply(void 0, r);
                }
              }(n);
            } finally {
              h(t), f = !1;
            }
          }
        }
      }
    }("undefined" == typeof self ? void 0 === t ? this : t : self);
  }).call(this, r(11), r(13));
}, function (t, n, r) {

  n.decode = n.parse = r(235), n.encode = n.stringify = r(236);
}, function (t, n, r) {

  function e(t, n) {
    return Object.prototype.hasOwnProperty.call(t, n);
  }
  t.exports = function (t, n, r, i) {
    n = n || "&", r = r || "=";
    var u = {};
    if ("string" != typeof t || 0 === t.length) return u;
    var c = /\+/g;
    t = t.split(n);
    var a = 1e3;
    i && "number" == typeof i.maxKeys && (a = i.maxKeys);
    var s = t.length;
    a > 0 && s > a && (s = a);
    for (var f = 0; f < s; ++f) {
      var l,
        p,
        h,
        v,
        d = t[f].replace(c, "%20"),
        y = d.indexOf(r);
      y >= 0 ? (l = d.substr(0, y), p = d.substr(y + 1)) : (l = d, p = ""), h = decodeURIComponent(l), v = decodeURIComponent(p), e(u, h) ? o(u[h]) ? u[h].push(v) : u[h] = [u[h], v] : u[h] = v;
    }
    return u;
  };
  var o = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };
}, function (t, n, r) {

  function e(t) {
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  var o = function (t) {
    switch (e(t)) {
      case "string":
        return t;
      case "boolean":
        return t ? "true" : "false";
      case "number":
        return isFinite(t) ? t : "";
      default:
        return "";
    }
  };
  t.exports = function (t, n, r, a) {
    return n = n || "&", r = r || "=", null === t && (t = void 0), "object" === e(t) ? u(c(t), function (e) {
      var c = encodeURIComponent(o(e)) + r;
      return i(t[e]) ? u(t[e], function (t) {
        return c + encodeURIComponent(o(t));
      }).join(n) : c + encodeURIComponent(o(t[e]));
    }).join(n) : a ? encodeURIComponent(o(a)) + r + encodeURIComponent(o(t)) : "";
  };
  var i = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };
  function u(t, n) {
    if (t.map) return t.map(n);
    for (var r = [], e = 0; e < t.length; e++) r.push(n(t[e], e));
    return r;
  }
  var c = Object.keys || function (t) {
    var n = [];
    for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && n.push(r);
    return n;
  };
}, function (t, n, r) {

  t.exports = function (t) {
    var n = /^\\\\\?\\/.test(t),
      r = /[^\u0000-\u0080]+/.test(t);
    return n || r ? t : t.replace(/\\/g, "/");
  };
}, function (t, n, r) {
  var e, o, i, u;
  function c(t) {
    return (c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }
  /** @license URI.js v4.2.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
  u = function (t) {

    function n() {
      for (var t = arguments.length, n = Array(t), r = 0; r < t; r++) n[r] = arguments[r];
      if (n.length > 1) {
        n[0] = n[0].slice(0, -1);
        for (var e = n.length - 1, o = 1; o < e; ++o) n[o] = n[o].slice(1, -1);
        return n[e] = n[e].slice(1), n.join("");
      }
      return n[0];
    }
    function r(t) {
      return "(?:" + t + ")";
    }
    function e(t) {
      return void 0 === t ? "undefined" : null === t ? "null" : Object.prototype.toString.call(t).split(" ").pop().split("]").shift().toLowerCase();
    }
    function o(t) {
      return t.toUpperCase();
    }
    function i(t) {
      var e = n("[0-9]", "[A-Fa-f]"),
        o = r(r("%[EFef]" + e + "%" + e + e + "%" + e + e) + "|" + r("%[89A-Fa-f]" + e + "%" + e + e) + "|" + r("%" + e + e)),
        i = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
        u = n("[\\:\\/\\?\\#\\[\\]\\@]", i),
        c = t ? "[\\uE000-\\uF8FF]" : "[]",
        a = n("[A-Za-z]", "[0-9]", "[\\-\\.\\_\\~]", t ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]");
        r("[A-Za-z]" + n("[A-Za-z]", "[0-9]", "[\\+\\-\\.]") + "*");
        r(r(o + "|" + n(a, i, "[\\:]")) + "*");
        var l = (r(r("25[0-5]") + "|" + r("2[0-4][0-9]") + "|" + r("1[0-9][0-9]") + "|" + r("0?[1-9][0-9]") + "|0?0?[0-9]")),
        p = r(l + "\\." + l + "\\." + l + "\\." + l),
        h = r(e + "{1,4}"),
        v = r(r(h + "\\:" + h) + "|" + p),
        d = r(r(h + "\\:") + "{6}" + v),
        y = r("\\:\\:" + r(h + "\\:") + "{5}" + v),
        _ = r(r(h) + "?\\:\\:" + r(h + "\\:") + "{4}" + v),
        g = r(r(r(h + "\\:") + "{0,1}" + h) + "?\\:\\:" + r(h + "\\:") + "{3}" + v),
        b = r(r(r(h + "\\:") + "{0,2}" + h) + "?\\:\\:" + r(h + "\\:") + "{2}" + v),
        m = r(r(r(h + "\\:") + "{0,3}" + h) + "?\\:\\:" + h + "\\:" + v),
        w = r(r(r(h + "\\:") + "{0,4}" + h) + "?\\:\\:" + v),
        x = r(r(r(h + "\\:") + "{0,5}" + h) + "?\\:\\:" + h),
        j = r(r(r(h + "\\:") + "{0,6}" + h) + "?\\:\\:"),
        E = r([d, y, _, g, b, m, w, x, j].join("|")),
        S = r(r(a + "|" + o) + "+");
        r("[vV]" + e + "+\\." + n(a, i, "[\\:]") + "+");
        r(r(o + "|" + n(a, i)) + "*");
        var R = r(o + "|" + n(a, i, "[\\:\\@]"));
        r(r(o + "|" + n(a, i, "[\\@]")) + "+");
        (r(r(R + "|" + n("[\\/\\?]", c)) + "*"));
      return {
        NOT_SCHEME: new RegExp(n("[^]", "[A-Za-z]", "[0-9]", "[\\+\\-\\.]"), "g"),
        NOT_USERINFO: new RegExp(n("[^\\%\\:]", a, i), "g"),
        NOT_HOST: new RegExp(n("[^\\%\\[\\]\\:]", a, i), "g"),
        NOT_PATH: new RegExp(n("[^\\%\\/\\:\\@]", a, i), "g"),
        NOT_PATH_NOSCHEME: new RegExp(n("[^\\%\\/\\@]", a, i), "g"),
        NOT_QUERY: new RegExp(n("[^\\%]", a, i, "[\\:\\@\\/\\?]", c), "g"),
        NOT_FRAGMENT: new RegExp(n("[^\\%]", a, i, "[\\:\\@\\/\\?]"), "g"),
        ESCAPE: new RegExp(n("[^]", a, i), "g"),
        UNRESERVED: new RegExp(a, "g"),
        OTHER_CHARS: new RegExp(n("[^\\%]", a, u), "g"),
        PCT_ENCODED: new RegExp(o, "g"),
        IPV4ADDRESS: new RegExp("^(" + p + ")$"),
        IPV6ADDRESS: new RegExp("^\\[?(" + E + ")" + r(r("\\%25|\\%(?!" + e + "{2})") + "(" + S + ")") + "?\\]?$")
      };
    }
    var u = i(!1),
      c = i(!0),
      a = function (t, n) {
        if (Array.isArray(t)) return t;
        if (Symbol.iterator in Object(t)) return function (t, n) {
          var r = [],
            e = !0,
            o = !1,
            i = void 0;
          try {
            for (var u, c = t[Symbol.iterator](); !(e = (u = c.next()).done) && (r.push(u.value), !n || r.length !== n); e = !0);
          } catch (t) {
            o = !0, i = t;
          } finally {
            try {
              !e && c.return && c.return();
            } finally {
              if (o) throw i;
            }
          }
          return r;
        }(t, n);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      },
      s = 2147483647,
      f = /^xn--/,
      l = /[^\0-\x7E]/,
      p = /[\x2E\u3002\uFF0E\uFF61]/g,
      h = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      },
      v = Math.floor,
      d = String.fromCharCode;
    function y(t) {
      throw new RangeError(h[t]);
    }
    function _(t, n) {
      var r = t.split("@"),
        e = "";
      r.length > 1 && (e = r[0] + "@", t = r[1]);
      var o = function (t, n) {
        for (var r = [], e = t.length; e--;) r[e] = n(t[e]);
        return r;
      }((t = t.replace(p, ".")).split("."), n).join(".");
      return e + o;
    }
    function g(t) {
      for (var n = [], r = 0, e = t.length; r < e;) {
        var o = t.charCodeAt(r++);
        if (o >= 55296 && o <= 56319 && r < e) {
          var i = t.charCodeAt(r++);
          56320 == (64512 & i) ? n.push(((1023 & o) << 10) + (1023 & i) + 65536) : (n.push(o), r--);
        } else n.push(o);
      }
      return n;
    }
    var b = function (t, n) {
        return t + 22 + 75 * (t < 26) - ((0 != n) << 5);
      },
      m = function (t, n, r) {
        var e = 0;
        for (t = r ? v(t / 700) : t >> 1, t += v(t / n); t > 455; e += 36) t = v(t / 35);
        return v(e + 36 * t / (t + 38));
      },
      w = function (t) {
        var n,
          r = [],
          e = t.length,
          o = 0,
          i = 128,
          u = 72,
          c = t.lastIndexOf("-");
        c < 0 && (c = 0);
        for (var a = 0; a < c; ++a) t.charCodeAt(a) >= 128 && y("not-basic"), r.push(t.charCodeAt(a));
        for (var f = c > 0 ? c + 1 : 0; f < e;) {
          for (var l = o, p = 1, h = 36;; h += 36) {
            f >= e && y("invalid-input");
            var d = (n = t.charCodeAt(f++)) - 48 < 10 ? n - 22 : n - 65 < 26 ? n - 65 : n - 97 < 26 ? n - 97 : 36;
            (d >= 36 || d > v((s - o) / p)) && y("overflow"), o += d * p;
            var _ = h <= u ? 1 : h >= u + 26 ? 26 : h - u;
            if (d < _) break;
            var g = 36 - _;
            p > v(s / g) && y("overflow"), p *= g;
          }
          var b = r.length + 1;
          u = m(o - l, b, 0 == l), v(o / b) > s - i && y("overflow"), i += v(o / b), o %= b, r.splice(o++, 0, i);
        }
        return String.fromCodePoint.apply(String, r);
      },
      x = function (t) {
        var n = [],
          r = (t = g(t)).length,
          e = 128,
          o = 0,
          i = 72,
          u = !0,
          c = !1,
          a = void 0;
        try {
          for (var f, l = t[Symbol.iterator](); !(u = (f = l.next()).done); u = !0) {
            var p = f.value;
            p < 128 && n.push(d(p));
          }
        } catch (t) {
          c = !0, a = t;
        } finally {
          try {
            !u && l.return && l.return();
          } finally {
            if (c) throw a;
          }
        }
        var h = n.length,
          _ = h;
        for (h && n.push("-"); _ < r;) {
          var w = s,
            x = !0,
            j = !1,
            E = void 0;
          try {
            for (var S, O = t[Symbol.iterator](); !(x = (S = O.next()).done); x = !0) {
              var A = S.value;
              A >= e && A < w && (w = A);
            }
          } catch (t) {
            j = !0, E = t;
          } finally {
            try {
              !x && O.return && O.return();
            } finally {
              if (j) throw E;
            }
          }
          var T = _ + 1;
          w - e > v((s - o) / T) && y("overflow"), o += (w - e) * T, e = w;
          var C = !0,
            I = !1,
            P = void 0;
          try {
            for (var k, R = t[Symbol.iterator](); !(C = (k = R.next()).done); C = !0) {
              var D = k.value;
              if (D < e && ++o > s && y("overflow"), D == e) {
                for (var U = o, N = 36;; N += 36) {
                  var z = N <= i ? 1 : N >= i + 26 ? 26 : N - i;
                  if (U < z) break;
                  var F = U - z,
                    L = 36 - z;
                  n.push(d(b(z + F % L, 0))), U = v(F / L);
                }
                n.push(d(b(U, 0))), i = m(o, T, _ == h), o = 0, ++_;
              }
            }
          } catch (t) {
            I = !0, P = t;
          } finally {
            try {
              !C && R.return && R.return();
            } finally {
              if (I) throw P;
            }
          }
          ++o, ++e;
        }
        return n.join("");
      },
      j = function (t) {
        return _(t, function (t) {
          return l.test(t) ? "xn--" + x(t) : t;
        });
      },
      E = function (t) {
        return _(t, function (t) {
          return f.test(t) ? w(t.slice(4).toLowerCase()) : t;
        });
      },
      S = {};
    function O(t) {
      var n = t.charCodeAt(0);
      return n < 16 ? "%0" + n.toString(16).toUpperCase() : n < 128 ? "%" + n.toString(16).toUpperCase() : n < 2048 ? "%" + (n >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & n | 128).toString(16).toUpperCase() : "%" + (n >> 12 | 224).toString(16).toUpperCase() + "%" + (n >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & n | 128).toString(16).toUpperCase();
    }
    function A(t) {
      for (var n = "", r = 0, e = t.length; r < e;) {
        var o = parseInt(t.substr(r + 1, 2), 16);
        if (o < 128) n += String.fromCharCode(o), r += 3;else if (o >= 194 && o < 224) {
          if (e - r >= 6) {
            var i = parseInt(t.substr(r + 4, 2), 16);
            n += String.fromCharCode((31 & o) << 6 | 63 & i);
          } else n += t.substr(r, 6);
          r += 6;
        } else if (o >= 224) {
          if (e - r >= 9) {
            var u = parseInt(t.substr(r + 4, 2), 16),
              c = parseInt(t.substr(r + 7, 2), 16);
            n += String.fromCharCode((15 & o) << 12 | (63 & u) << 6 | 63 & c);
          } else n += t.substr(r, 9);
          r += 9;
        } else n += t.substr(r, 3), r += 3;
      }
      return n;
    }
    function T(t, n) {
      function r(t) {
        var r = A(t);
        return r.match(n.UNRESERVED) ? r : t;
      }
      return t.scheme && (t.scheme = String(t.scheme).replace(n.PCT_ENCODED, r).toLowerCase().replace(n.NOT_SCHEME, "")), void 0 !== t.userinfo && (t.userinfo = String(t.userinfo).replace(n.PCT_ENCODED, r).replace(n.NOT_USERINFO, O).replace(n.PCT_ENCODED, o)), void 0 !== t.host && (t.host = String(t.host).replace(n.PCT_ENCODED, r).toLowerCase().replace(n.NOT_HOST, O).replace(n.PCT_ENCODED, o)), void 0 !== t.path && (t.path = String(t.path).replace(n.PCT_ENCODED, r).replace(t.scheme ? n.NOT_PATH : n.NOT_PATH_NOSCHEME, O).replace(n.PCT_ENCODED, o)), void 0 !== t.query && (t.query = String(t.query).replace(n.PCT_ENCODED, r).replace(n.NOT_QUERY, O).replace(n.PCT_ENCODED, o)), void 0 !== t.fragment && (t.fragment = String(t.fragment).replace(n.PCT_ENCODED, r).replace(n.NOT_FRAGMENT, O).replace(n.PCT_ENCODED, o)), t;
    }
    function C(t) {
      return t.replace(/^0*(.*)/, "$1") || "0";
    }
    function I(t, n) {
      var r = t.match(n.IPV4ADDRESS) || [],
        e = a(r, 2)[1];
      return e ? e.split(".").map(C).join(".") : t;
    }
    function P(t, n) {
      var r = t.match(n.IPV6ADDRESS) || [],
        e = a(r, 3),
        o = e[1],
        i = e[2];
      if (o) {
        for (var u = o.toLowerCase().split("::").reverse(), c = a(u, 2), s = c[0], f = c[1], l = f ? f.split(":").map(C) : [], p = s.split(":").map(C), h = n.IPV4ADDRESS.test(p[p.length - 1]), v = h ? 7 : 8, d = p.length - v, y = Array(v), _ = 0; _ < v; ++_) y[_] = l[_] || p[d + _] || "";
        h && (y[v - 1] = I(y[v - 1], n));
        var g = y.reduce(function (t, n, r) {
            if (!n || "0" === n) {
              var e = t[t.length - 1];
              e && e.index + e.length === r ? e.length++ : t.push({
                index: r,
                length: 1
              });
            }
            return t;
          }, []).sort(function (t, n) {
            return n.length - t.length;
          })[0],
          b = void 0;
        if (g && g.length > 1) {
          var m = y.slice(0, g.index),
            w = y.slice(g.index + g.length);
          b = m.join(":") + "::" + w.join(":");
        } else b = y.join(":");
        return i && (b += "%" + i), b;
      }
      return t;
    }
    var k = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,
      R = void 0 === "".match(/(){0}/)[1];
    function D(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        r = {},
        e = !1 !== n.iri ? c : u;
      "suffix" === n.reference && (t = (n.scheme ? n.scheme + ":" : "") + "//" + t);
      var o = t.match(k);
      if (o) {
        R ? (r.scheme = o[1], r.userinfo = o[3], r.host = o[4], r.port = parseInt(o[5], 10), r.path = o[6] || "", r.query = o[7], r.fragment = o[8], isNaN(r.port) && (r.port = o[5])) : (r.scheme = o[1] || void 0, r.userinfo = -1 !== t.indexOf("@") ? o[3] : void 0, r.host = -1 !== t.indexOf("//") ? o[4] : void 0, r.port = parseInt(o[5], 10), r.path = o[6] || "", r.query = -1 !== t.indexOf("?") ? o[7] : void 0, r.fragment = -1 !== t.indexOf("#") ? o[8] : void 0, isNaN(r.port) && (r.port = t.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? o[4] : void 0)), r.host && (r.host = P(I(r.host, e), e)), void 0 !== r.scheme || void 0 !== r.userinfo || void 0 !== r.host || void 0 !== r.port || r.path || void 0 !== r.query ? void 0 === r.scheme ? r.reference = "relative" : void 0 === r.fragment ? r.reference = "absolute" : r.reference = "uri" : r.reference = "same-document", n.reference && "suffix" !== n.reference && n.reference !== r.reference && (r.error = r.error || "URI is not a " + n.reference + " reference.");
        var i = S[(n.scheme || r.scheme || "").toLowerCase()];
        if (n.unicodeSupport || i && i.unicodeSupport) T(r, e);else {
          if (r.host && (n.domainHost || i && i.domainHost)) try {
            r.host = j(r.host.replace(e.PCT_ENCODED, A).toLowerCase());
          } catch (t) {
            r.error = r.error || "Host's domain name can not be converted to ASCII via punycode: " + t;
          }
          T(r, u);
        }
        i && i.parse && i.parse(r, n);
      } else r.error = r.error || "URI can not be parsed.";
      return r;
    }
    function U(t, n) {
      var r = !1 !== n.iri ? c : u,
        e = [];
      return void 0 !== t.userinfo && (e.push(t.userinfo), e.push("@")), void 0 !== t.host && e.push(P(I(String(t.host), r), r).replace(r.IPV6ADDRESS, function (t, n, r) {
        return "[" + n + (r ? "%25" + r : "") + "]";
      })), "number" == typeof t.port && (e.push(":"), e.push(t.port.toString(10))), e.length ? e.join("") : void 0;
    }
    var N = /^\.\.?\//,
      z = /^\/\.(\/|$)/,
      F = /^\/\.\.(\/|$)/,
      L = /^\/?(?:.|\n)*?(?=\/|$)/;
    function q(t) {
      for (var n = []; t.length;) if (t.match(N)) t = t.replace(N, "");else if (t.match(z)) t = t.replace(z, "/");else if (t.match(F)) t = t.replace(F, "/"), n.pop();else if ("." === t || ".." === t) t = "";else {
        var r = t.match(L);
        if (!r) throw new Error("Unexpected dot segment condition");
        var e = r[0];
        t = t.slice(e.length), n.push(e);
      }
      return n.join("");
    }
    function M(t) {
      var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        r = n.iri ? c : u,
        e = [],
        o = S[(n.scheme || t.scheme || "").toLowerCase()];
      if (o && o.serialize && o.serialize(t, n), t.host) if (r.IPV6ADDRESS.test(t.host)) ;else if (n.domainHost || o && o.domainHost) try {
        t.host = n.iri ? E(t.host) : j(t.host.replace(r.PCT_ENCODED, A).toLowerCase());
      } catch (r) {
        t.error = t.error || "Host's domain name can not be converted to " + (n.iri ? "Unicode" : "ASCII") + " via punycode: " + r;
      }
      T(t, r), "suffix" !== n.reference && t.scheme && (e.push(t.scheme), e.push(":"));
      var i = U(t, n);
      if (void 0 !== i && ("suffix" !== n.reference && e.push("//"), e.push(i), t.path && "/" !== t.path.charAt(0) && e.push("/")), void 0 !== t.path) {
        var a = t.path;
        n.absolutePath || o && o.absolutePath || (a = q(a)), void 0 === i && (a = a.replace(/^\/\//, "/%2F")), e.push(a);
      }
      return void 0 !== t.query && (e.push("?"), e.push(t.query)), void 0 !== t.fragment && (e.push("#"), e.push(t.fragment)), e.join("");
    }
    function $(t, n) {
      var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        e = arguments[3],
        o = {};
      return e || (t = D(M(t, r), r), n = D(M(n, r), r)), !(r = r || {}).tolerant && n.scheme ? (o.scheme = n.scheme, o.userinfo = n.userinfo, o.host = n.host, o.port = n.port, o.path = q(n.path || ""), o.query = n.query) : (void 0 !== n.userinfo || void 0 !== n.host || void 0 !== n.port ? (o.userinfo = n.userinfo, o.host = n.host, o.port = n.port, o.path = q(n.path || ""), o.query = n.query) : (n.path ? ("/" === n.path.charAt(0) ? o.path = q(n.path) : (void 0 === t.userinfo && void 0 === t.host && void 0 === t.port || t.path ? t.path ? o.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + n.path : o.path = n.path : o.path = "/" + n.path, o.path = q(o.path)), o.query = n.query) : (o.path = t.path, void 0 !== n.query ? o.query = n.query : o.query = t.query), o.userinfo = t.userinfo, o.host = t.host, o.port = t.port), o.scheme = t.scheme), o.fragment = n.fragment, o;
    }
    function B(t, n) {
      return t && t.toString().replace(n && n.iri ? c.PCT_ENCODED : u.PCT_ENCODED, A);
    }
    var H = {
        scheme: "http",
        domainHost: !0,
        parse: function (t, n) {
          return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
        },
        serialize: function (t, n) {
          return t.port !== ("https" !== String(t.scheme).toLowerCase() ? 80 : 443) && "" !== t.port || (t.port = void 0), t.path || (t.path = "/"), t;
        }
      },
      W = {
        scheme: "https",
        domainHost: H.domainHost,
        parse: H.parse,
        serialize: H.serialize
      },
      V = {},
      G = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]",
      Z = "[0-9A-Fa-f]",
      J = r(r("%[EFef][0-9A-Fa-f]%" + Z + Z + "%" + Z + Z) + "|" + r("%[89A-Fa-f][0-9A-Fa-f]%" + Z + Z) + "|" + r("%" + Z + Z)),
      X = n("[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", '[\\"\\\\]'),
      K = new RegExp(G, "g"),
      Y = new RegExp(J, "g"),
      Q = new RegExp(n("[^]", "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", "[\\.]", '[\\"]', X), "g"),
      tt = new RegExp(n("[^]", G, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g"),
      nt = tt;
    function rt(t) {
      var n = A(t);
      return n.match(K) ? n : t;
    }
    var et = {
        scheme: "mailto",
        parse: function (t, n) {
          var r = t,
            e = r.to = r.path ? r.path.split(",") : [];
          if (r.path = void 0, r.query) {
            for (var o = !1, i = {}, u = r.query.split("&"), c = 0, a = u.length; c < a; ++c) {
              var s = u[c].split("=");
              switch (s[0]) {
                case "to":
                  for (var f = s[1].split(","), l = 0, p = f.length; l < p; ++l) e.push(f[l]);
                  break;
                case "subject":
                  r.subject = B(s[1], n);
                  break;
                case "body":
                  r.body = B(s[1], n);
                  break;
                default:
                  o = !0, i[B(s[0], n)] = B(s[1], n);
              }
            }
            o && (r.headers = i);
          }
          r.query = void 0;
          for (var h = 0, v = e.length; h < v; ++h) {
            var d = e[h].split("@");
            if (d[0] = B(d[0]), n.unicodeSupport) d[1] = B(d[1], n).toLowerCase();else try {
              d[1] = j(B(d[1], n).toLowerCase());
            } catch (t) {
              r.error = r.error || "Email address's domain name can not be converted to ASCII via punycode: " + t;
            }
            e[h] = d.join("@");
          }
          return r;
        },
        serialize: function (t, n) {
          var r,
            e = t,
            i = null != (r = t.to) ? r instanceof Array ? r : "number" != typeof r.length || r.split || r.setInterval || r.call ? [r] : Array.prototype.slice.call(r) : [];
          if (i) {
            for (var u = 0, c = i.length; u < c; ++u) {
              var a = String(i[u]),
                s = a.lastIndexOf("@"),
                f = a.slice(0, s).replace(Y, rt).replace(Y, o).replace(Q, O),
                l = a.slice(s + 1);
              try {
                l = n.iri ? E(l) : j(B(l, n).toLowerCase());
              } catch (t) {
                e.error = e.error || "Email address's domain name can not be converted to " + (n.iri ? "Unicode" : "ASCII") + " via punycode: " + t;
              }
              i[u] = f + "@" + l;
            }
            e.path = i.join(",");
          }
          var p = t.headers = t.headers || {};
          t.subject && (p.subject = t.subject), t.body && (p.body = t.body);
          var h = [];
          for (var v in p) p[v] !== V[v] && h.push(v.replace(Y, rt).replace(Y, o).replace(tt, O) + "=" + p[v].replace(Y, rt).replace(Y, o).replace(nt, O));
          return h.length && (e.query = h.join("&")), e;
        }
      },
      ot = /^([^\:]+)\:(.*)/,
      it = {
        scheme: "urn",
        parse: function (t, n) {
          var r = t.path && t.path.match(ot),
            e = t;
          if (r) {
            var o = n.scheme || e.scheme || "urn",
              i = r[1].toLowerCase(),
              u = r[2],
              c = o + ":" + (n.nid || i),
              a = S[c];
            e.nid = i, e.nss = u, e.path = void 0, a && (e = a.parse(e, n));
          } else e.error = e.error || "URN can not be parsed.";
          return e;
        },
        serialize: function (t, n) {
          var r = n.scheme || t.scheme || "urn",
            e = t.nid,
            o = r + ":" + (n.nid || e),
            i = S[o];
          i && (t = i.serialize(t, n));
          var u = t,
            c = t.nss;
          return u.path = (e || n.nid) + ":" + c, u;
        }
      },
      ut = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/,
      ct = {
        scheme: "urn:uuid",
        parse: function (t, n) {
          var r = t;
          return r.uuid = r.nss, r.nss = void 0, n.tolerant || r.uuid && r.uuid.match(ut) || (r.error = r.error || "UUID is not valid."), r;
        },
        serialize: function (t, n) {
          var r = t;
          return r.nss = (t.uuid || "").toLowerCase(), r;
        }
      };
    S[H.scheme] = H, S[W.scheme] = W, S[et.scheme] = et, S[it.scheme] = it, S[ct.scheme] = ct, t.SCHEMES = S, t.pctEncChar = O, t.pctDecChars = A, t.parse = D, t.removeDotSegments = q, t.serialize = M, t.resolveComponents = $, t.resolve = function (t, n, r) {
      var e = function (t, n) {
        var r = t;
        if (n) for (var e in n) r[e] = n[e];
        return r;
      }({
        scheme: "null"
      }, r);
      return M($(D(t, e), D(n, e), e, !0), e);
    }, t.normalize = function (t, n) {
      return "string" == typeof t ? t = M(D(t, n), n) : "object" === e(t) && (t = D(M(t, n), n)), t;
    }, t.equal = function (t, n, r) {
      return "string" == typeof t ? t = M(D(t, r), r) : "object" === e(t) && (t = M(t, r)), "string" == typeof n ? n = M(D(n, r), r) : "object" === e(n) && (n = M(n, r)), t === n;
    }, t.escapeComponent = function (t, n) {
      return t && t.toString().replace(n && n.iri ? c.ESCAPE : u.ESCAPE, O);
    }, t.unescapeComponent = B, Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, "object" === c(n) && void 0 !== t ? u(n) : (o = [n], void 0 === (i = "function" == typeof (e = u) ? e.apply(n, o) : e) || (t.exports = i));
}]);

/* eslint-env browser */

const getCurrDir = () => window.location.href.replace(/(index\.html)?#.*$/, '');
const getMetaProp = function getMetaProp(lang, metadataObj, properties, allowObjects) {
  let prop;
  properties = typeof properties === 'string' ? [properties] : properties;
  lang.some(lan => {
    const p = [...properties];
    let strings = metadataObj['localization-strings'][lan];
    while (strings && p.length) {
      strings = strings[p.shift()];
    }
    // Todo: Fix this allowance for allowObjects (as it does not properly
    //        fallback if an object is returned from a language because
    //        that language is missing content and is only thus returning
    //        an object)
    prop = allowObjects || typeof strings === 'string' ? strings : undefined;
    return prop;
  });
  return prop;
};

// Use the following to dynamically add specific file schema in place of
//    generic table schema if validating against files.jsonschema
//  filesSchema.properties.groups.items.properties.files.items.properties.
//      file.anyOf.splice(1, 1, {$ref: schemaFile});
// Todo: Allow use of dbs and fileGroup together in base directories?
const getMetadata = async (file, property, basePath) => {
  const url = new URL(basePath || getCurrDir());
  url.search = ''; // Clear out query string, e.g., `?fbclid` from Facebook
  url.pathname = file;
  url.hash = property ? '#/' + property : '';
  return (await JsonRefs.resolveRefsAt(url.toString(), {
    loaderOptions: {
      processContent(res, callback) {
        callback(undefined, JSON.parse(res.text ||
        // `.metadata` not a recognized extension, so
        //    convert to string for JSON in Node
        res.body.toString()));
      }
    }
  })).resolved;
};
const getFieldNameAndValueAliases = function ({
  field,
  schemaItems,
  metadataObj,
  getFieldAliasOrName,
  lang
}) {
  const fieldSchemaIndex = schemaItems.findIndex(item => item.title === field);
  const fieldSchema = schemaItems[fieldSchemaIndex];
  const fieldInfo = metadataObj.fields[field];
  const ret = {
    // field,
    aliases: null,
    fieldValueAliasMap: null,
    rawFieldValueAliasMap: null,
    fieldName: getFieldAliasOrName(field),
    fieldSchema,
    fieldSchemaIndex,
    preferAlias: fieldInfo.prefer_alias,
    lang: fieldInfo.lang
  };
  let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];
  if (fieldValueAliasMap) {
    if (fieldValueAliasMap.localeKey) {
      fieldValueAliasMap = getMetaProp(lang, metadataObj, fieldValueAliasMap.localeKey.split('/'), true);
    }
    ret.rawFieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
    ret.aliases = [];
    // Todo: We could use `prefer_alias` but algorithm below may cover
    //    needed cases
    if (fieldSchema.enum && fieldSchema.enum.length) {
      fieldSchema.enum.forEach(enm => {
        ret.aliases.push(getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true));
        if (enm in fieldValueAliasMap &&
        // Todo: We could allow numbers here too, but crowds
        //         pull-down
        typeof fieldValueAliasMap[enm] === 'string') {
          ret.aliases.push(...fieldValueAliasMap[enm]);
        }
      });
    } else {
      // Todo: We might iterate over all values (in case some not
      //         included in fv map)
      // Todo: Check `fieldSchema` for integer or string type
      Object.entries(fieldValueAliasMap).forEach(([key, aliases]) => {
        // We'll preserve the numbers since probably more useful if
        //   stored with data (as opposed to enums)
        if (!Array.isArray(aliases)) {
          aliases = Object.values(aliases);
        }
        // We'll assume the longest version is best for auto-complete
        ret.aliases.push(...aliases.filter(v => aliases.every(x => x === v || !x.toLowerCase().startsWith(v.toLowerCase()))).map(v => v + ' (' + key + ')') // Todo: i18nize
        );
      });
    }

    ret.fieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
    // ret.aliases.sort();
  }

  return ret;
};
const getBrowseFieldData = function ({
  metadataObj,
  schemaItems,
  getFieldAliasOrName,
  lang,
  callback
}) {
  metadataObj.table.browse_fields.forEach((browseFieldSetObject, i) => {
    if (typeof browseFieldSetObject === 'string') {
      browseFieldSetObject = {
        set: [browseFieldSetObject]
      };
    }
    if (!browseFieldSetObject.name) {
      browseFieldSetObject.name = browseFieldSetObject.set.join(',');
    }
    const setName = browseFieldSetObject.name;
    const fieldSets = browseFieldSetObject.set;
    const {
      presort
    } = browseFieldSetObject;
    // Todo: Deal with ['td', [['h3', [lDirectional(browseFieldObject.name)]]]]
    //          as kind of fieldset

    const browseFields = fieldSets.map(field => getFieldNameAndValueAliases({
      lang,
      field,
      schemaItems,
      metadataObj,
      getFieldAliasOrName
    }));
    callback({
      setName,
      browseFields,
      i,
      presort
    }); // eslint-disable-line n/no-callback-literal
  });
};

// Todo: Incorporate other methods into this class
class Metadata {
  constructor({
    metadataObj
  }) {
    this.metadataObj = metadataObj;
  }
  getFieldLang(field) {
    const {
      metadataObj
    } = this;
    const fields = metadataObj && metadataObj.fields;
    return fields && fields[field] && fields[field].lang;
  }
  getFieldMatchesLocale({
    namespace,
    preferredLocale,
    schemaItems,
    pluginsForWork
  }) {
    const {
      metadataObj
    } = this;
    return field => {
      const preferredLanguages = getPreferredLanguages({
        namespace,
        preferredLocale
      });
      if (pluginsForWork.isPluginField({
        namespace,
        field
      })) {
        let [,, targetLanguage] = pluginsForWork.getPluginFieldParts({
          namespace,
          field
        });
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        return !targetLanguage || preferredLanguages.includes(targetLanguage);
      }
      const metaLang = this.getFieldLang(field);
      const localeStrings = metadataObj && metadataObj['localization-strings'];

      // If this is a localized field (e.g., enum), we don't want
      //  to avoid as may be translated (should check though)
      const hasFieldValue = localeStrings && Object.keys(localeStrings).some(lng => {
        const fv = localeStrings[lng] && localeStrings[lng].fieldvalue;
        return fv && fv[field];
      });
      return hasFieldValue || metaLang && preferredLanguages.includes(metaLang) || schemaItems.some(item => item.title === field && item.type !== 'string');
    };
  }
}

const escapePluginComponent = pluginName => {
  return pluginName.replace(/\^/g, '^^') // Escape our escape
  .replace(/-/g, '^0');
};
const unescapePluginComponent = pluginName => {
  if (!pluginName) {
    return pluginName;
  }
  return pluginName.replace(/(\^+)0/g, (n0, esc) => {
    return esc.length % 2 ? esc.slice(1) + '-' : n0;
  }).replace(/\^\^/g, '^');
};
const escapePlugin = ({
  pluginName,
  applicableField,
  targetLanguage
}) => {
  return escapePluginComponent(pluginName) + (applicableField ? '-' + escapePluginComponent(applicableField) : '-') + (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};
class PluginsForWork {
  constructor({
    pluginsInWork,
    pluginFieldMappings,
    pluginObjects
  }) {
    this.pluginsInWork = pluginsInWork;
    this.pluginFieldMappings = pluginFieldMappings;
    this.pluginObjects = pluginObjects;
  }
  getPluginObject(pluginName) {
    const idx = this.pluginsInWork.findIndex(([name]) => {
      return name === pluginName;
    });
    const plugin = this.pluginObjects[idx];
    return plugin;
  }
  iterateMappings(cb) {
    this.pluginFieldMappings.forEach(({
      placement,
      /*
            {fieldXYZ: {
                targetLanguage: "en"|["en"], // E.g., translating from Persian to English
                onByDefault: true // Overrides plugin default
            }}
            */
      'applicable-fields': applicableFields
    }, i) => {
      const [pluginName, {
        onByDefault: onByDefaultDefault,
        lang: pluginLang,
        meta
      }] = this.pluginsInWork[i];
      const plugin = this.getPluginObject(pluginName);
      cb({
        // eslint-disable-line n/no-callback-literal
        plugin,
        placement,
        applicableFields,
        pluginName,
        pluginLang,
        onByDefaultDefault,
        meta
      });
    });
  }
  processTargetLanguages(applicableFields, cb) {
    if (!applicableFields) {
      return false;
    }
    Object.entries(applicableFields).forEach(([applicableField, {
      targetLanguage,
      onByDefault,
      meta: metaApplicableField
    }]) => {
      if (Array.isArray(targetLanguage)) {
        targetLanguage.forEach(targetLanguage => {
          cb({
            applicableField,
            targetLanguage,
            onByDefault,
            metaApplicableField
          }); // eslint-disable-line n/no-callback-literal
        });
      } else {
        // eslint-disable-next-line n/callback-return
        cb({
          applicableField,
          targetLanguage,
          onByDefault,
          metaApplicableField
        }); // eslint-disable-line n/no-callback-literal
      }
    });

    return true;
  }
  isPluginField({
    namespace,
    field
  }) {
    return field.startsWith(`${namespace}-plugin-`);
  }
  getPluginFieldParts({
    namespace,
    field
  }) {
    field = field.replace(`${namespace}-plugin-`, '');
    let pluginName, applicableField, targetLanguage;
    if (field.includes('-')) {
      [pluginName, applicableField, targetLanguage] = field.split('-');
    } else {
      pluginName = field;
    }
    return [pluginName, applicableField, targetLanguage].map(unescapePluginComponent);
  }
}

const getWorkFiles = async function getWorkFiles(files = this.files) {
  const filesObj = await getJSON(files);
  const dataFiles = [];
  filesObj.groups.forEach(fileGroup => {
    fileGroup.files.forEach(fileData => {
      const {
        file,
        schemaFile,
        metadataFile
      } = getFilePaths(filesObj, fileGroup, fileData);
      dataFiles.push(file, schemaFile, metadataFile);
    });
  });
  dataFiles.push(...Object.values(filesObj.plugins).map(pl => pl.path));
  return dataFiles;
};
const getFilePaths = function getFilePaths(filesObj, fileGroup, fileData) {
  const baseDir = (filesObj.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
  const schemaBaseDir = (filesObj.schemaBaseDirectory || '') + (fileGroup.schemaBaseDirectory || '') + '/';
  const metadataBaseDir = (filesObj.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';
  const file = baseDir + fileData.file.$ref;
  const schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
  const metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';
  return {
    file,
    schemaFile,
    metadataFile
  };
};
const getWorkData = async function ({
  lang,
  fallbackLanguages,
  work,
  files,
  allowPlugins,
  basePath,
  languages,
  preferredLocale
}) {
  const filesObj = await getJSON(files);
  const localizationStrings = filesObj['localization-strings'];
  const workI18n = await i18n({
    messageStyle: 'plainNested',
    locales: lang,
    defaultLocales: fallbackLanguages,
    // Todo: Could at least share this with `index.js`
    localeStringFinder({
      locales,
      defaultLocales
    }) {
      const locale = [...locales, ...defaultLocales].find(language => {
        return language in localizationStrings;
      });
      return {
        locale,
        strings: {
          head: {},
          body: localizationStrings[locale]
        }
      };
    }
  });
  let fileData;
  const fileGroup = filesObj.groups.find(fg => {
    fileData = fg.files.find(file => work === workI18n(['workNames', fg.id, file.name]));
    return Boolean(fileData);
  });
  // This is not specific to the work, but we export it anyways
  const groupsToWorks = filesObj.groups.map(fg => {
    return {
      name: workI18n(fg.name.localeKey),
      workNames: fg.files.map(file => {
        return workI18n(['workNames', fg.id, file.name]);
      }),
      shortcuts: fg.files.map(file => file.shortcut)
    };
  });
  const fp = getFilePaths(filesObj, fileGroup, fileData);
  const {
    file
  } = fp;
  let {
    schemaFile,
    metadataFile
  } = fp;
  let schemaProperty = '',
    metadataProperty = '';
  if (!schemaFile) {
    schemaFile = file;
    schemaProperty = 'schema';
  }
  if (!metadataFile) {
    metadataFile = file;
    metadataProperty = 'metadata';
  }
  let getPlugins,
    pluginsInWork,
    pluginFieldsForWork,
    pluginPaths,
    pluginFieldMappingForWork = [];
  if (allowPlugins) {
    const pluginFieldMapping = filesObj['plugin-field-mapping'];
    const pluginFieldMappingID = pluginFieldMapping[fileGroup.id];
    const possiblePluginFieldMappingForWork = pluginFieldMappingID[fileData.name];
    if (possiblePluginFieldMappingForWork) {
      pluginFieldsForWork = Object.keys(possiblePluginFieldMappingForWork);
      pluginsInWork = Object.entries(filesObj.plugins).filter(([p]) => {
        return pluginFieldsForWork.includes(p);
      });
      pluginFieldMappingForWork = pluginsInWork.map(([p]) => {
        return possiblePluginFieldMappingForWork[p];
      });
      pluginPaths = pluginsInWork.map(([, pluginObj]) => pluginObj.path);
      getPlugins = pluginsInWork;
    }
  }
  const metadataObj = await getMetadata(metadataFile, metadataProperty, basePath);
  const getFieldAliasOrName = function getFieldAliasOrName(field) {
    const fieldObj = metadataObj.fields && metadataObj.fields[field];
    let fieldName;
    let fieldAlias;
    if (fieldObj) {
      fieldAlias = fieldObj.alias;
    }
    if (fieldAlias) {
      if (typeof fieldAlias === 'string') {
        fieldName = fieldAlias;
      } else {
        fieldAlias = fieldAlias.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldAlias.split('/'));
      }
    } else {
      // No alias
      fieldName = fieldObj.name;
      if (typeof fieldName === 'object') {
        fieldName = fieldName.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldName.split('/'));
      }
    }
    return fieldName;
  };
  const pluginFieldMappings = pluginFieldMappingForWork;
  const cwd = typeof process === 'undefined' ? location.href.slice(0, location.href.lastIndexOf('/') + 1) : process.cwd() + '/';
  const [schemaObj, pluginObjects] = await Promise.all([getMetadata(schemaFile, schemaProperty, basePath), getPlugins ? Promise.all(pluginPaths.map(pluginPath => {
    // eslint-disable-next-line no-unsanitized/method
    return import(cwd + pluginPath);
  })) : null]);
  const pluginsForWork = new PluginsForWork({
    pluginsInWork,
    pluginFieldMappings,
    pluginObjects
  });
  const schemaItems = schemaObj.items.items;
  const fieldInfo = schemaItems.map(({
    title: field
  }) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field
    };
  });
  const metadata = new Metadata({
    metadataObj
  });
  if (languages &&
  // Avoid all this processing if this is not the specific call requiring
  pluginsForWork) {
    console.log('pluginsForWork', pluginsForWork);
    const {
      lang,
      namespace
    } = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      plugin,
      pluginName,
      pluginLang,
      onByDefaultDefault,
      placement,
      applicableFields,
      meta
    }) => {
      const processField = ({
        applicableField,
        targetLanguage,
        onByDefault,
        metaApplicableField
      } = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(applicableField);
        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            applicableField,
            targetLanguage,
            // Default lang for plug-in (from files.json)
            pluginLang,
            // Default lang when no target language or
            //   plugin lang; using the lang of the applicable
            //   field
            applicableFieldLang
          });
        }
        const field = escapePlugin({
          pluginName,
          applicableField,
          targetLanguage: targetLanguage || pluginLang || applicableFieldLang
        });
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName ? plugin.getFieldAliasOrName({
          locales: lang,
          workI18n,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          workI18n,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice(
        // Todo: Allow default placement overriding for
        //    non-plugins
        placement === 'end' ? Number.POSITIVE_INFINITY // push
        : placement, 0, {
          field: `${namespace}-plugin-${field}`,
          fieldAliasOrName,
          // Plug-in specific (todo: allow specifying
          //    for non-plugins)
          onByDefault: typeof onByDefault === 'boolean' ? onByDefault : onByDefaultDefault || false,
          // Three conventions for use by plug-ins but
          //     textbrowser only passes on (might
          //     not need here)
          applicableField,
          metaApplicableField,
          fieldLang: targetLanguage
        });
      };
      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }
  return {
    fileData,
    workI18n,
    getFieldAliasOrName,
    metadataObj,
    schemaObj,
    schemaItems,
    fieldInfo,
    pluginsForWork,
    groupsToWorks,
    metadata
  };
};

/* globals console, location, URL */
const setServiceWorkerDefaults = (target, source) => {
  target.userJSON = source.userJSON || 'resources/user.json';
  target.languages = source.languages || new URL('../appdata/languages.json',
  // Todo: Substitute with `import.meta.url`
  new URL('node_modules/textbrowser/resources/index.js', location)).href;
  target.serviceWorkerPath = source.serviceWorkerPath || `sw.js?pathToUserJSON=${encodeURIComponent(target.userJSON)}&stylesheets=${encodeURIComponent(JSON.stringify(target.stylesheets || []))}`;
  target.files = source.files || 'files.json';
  target.namespace = source.namespace || 'textbrowser';
  return target;
};

// (Unless skipped in code, will wait between install
//    of new and activation of new or existing if still
//    some tabs open)

const listenForWorkerUpdate = ({
  r,
  logger
}) => {
  r.addEventListener('updatefound', e => {
    // New service worker has appeared
    // r.installing now available (though r.active is also,
    //    apparently due to prior activation; but not r.waiting)
    console.log('update found', e);
    const newWorker = r.installing;

    // statechange won't catch this installing event as already installing

    newWorker.addEventListener('statechange', async () => {
      const {
        state
      } = newWorker;
      switch (state) {
        case 'installing':
          console.log('Installing new worker');
          break;
        case 'installed':
          console.log('Installation status', state);
          await dialogs.alert(`
A new version of this offlinable app has been downloaded.

If you have work to complete in this tab, you can dismiss
this dialog now and continue working with the old version.

However, when you are finished, you should close this tab
and any other old tabs for this site in order to be able to
begin using the new version.
`);
          break;
        case 'redundant':
          // discarded. Either failed install, or it's been
          //                replaced by a newer version
          // Shouldn't be replaced since we aren't skipping waiting/claiming,
          console.log('Installation status', state);
          // Todo: Try updating again if get redundant here
          await dialogs.alert(`
There was an error during installation (to allow offline/speeded
cache use).

If you have work to complete in this tab, you can dismiss
this dialog now and continue working with the old version.

However, when you are finished, you may wish to close this tab
and any other old tabs for this site in order to try again
for offline installation.
`);
          break;
        // These shouldn't occur as we are not skipping waiting (?)
        case 'activating':
          console.log('Activating new worker');
          break;
        case 'activated':
          console.log('Activated new worker');
          break;
        default:
          throw new Error(`Unknown worker update state: ${state}`);
      }
    });
  });
};
const respondToState = async ({
  r,
  logger
}) => {
  // We use this promise for rejecting (inside a listener)
  //    to a common catch and to prevent continuation by
  //    failing to return
  return new Promise(async (resolve, reject) => {
    // eslint-disable-line no-async-promise-executor
    navigator.serviceWorker.addEventListener('message', ({
      data
    }) => {
      const {
        message,
        type,
        name,
        errorType
      } = data;
      console.log('msg1', message, r);
      switch (type) {
        case 'log':
          logger.addLogEntry({
            text: message
          });
          return;
        case 'beginInstall':
          logger.addLogEntry({
            text: 'Install: Begun...'
          });
          return;
        case 'finishedInstall':
          logger.addLogEntry({
            text: 'Install: Finished...'
          });
          return;
        case 'beginActivate':
          // Just use `e.source`?
          logger.addLogEntry({
            text: 'Activate: Caching finished'
          });
          logger.addLogEntry({
            text: 'Activate: Begin database resources storage...'
          });
          // r.active is also available for mere "activating"
          //    as we are now
          return;
        case 'finishedActivate':
          logger.addLogEntry({
            text: 'Activate: Finished...'
          });
          // Still not controlled even after activation is
          //    ready, so refresh page

          // Seems to be working (unlike `location.replace`),
          //  but if problems, could add `true` but as forces
          //  from server not cache, what will happen here? (also
          //  `controller` may be `null` with force-reload)
          location.reload();
          // location.replace(location); // Avoids adding to browser history)

          // This will cause jankiness and unnecessarily show languages selection
          // resolve();
          return;
        case 'error':
          logger.addLogEntry({
            text: message + `${errorType === 'dbError' ? `Database error ${name}` : ''}; trying again...`
          });
          /*
                  if (errorType === 'dbError') {
                      logger.dbError({
                          type: name || errorType,
                          escapedErrorMessage: escapeHTML(message)
                      });
                  }
                  */
          // Todo: auto-close any dbError dialog if retrying
          // No longer rejecting as should auto-retry
          /*
                  const err = new Error(message);
                  err.type = type;
                  reject(err);
                  */
          break;
        default:
          console.error('Unexpected type', type);
          break;
      }
    });
    const worker = r.installing || r.waiting || r.active;
    // Failed or new worker in use
    if (worker && worker.state === 'redundant') {
      // Todo: We could call `register()` below instead (on a timeout)?
      await dialogs.alert(`
There was likely an error installing. Click "ok" to try again.
(Error code: Service worker is redundant)
`);
      location.reload();
      // listenForWorkerUpdate({r, logger});
    } else if (r.installing) {
      // No need to expect a message from the installing event,
      //   as the `register` call seems to get called if ready
      console.log('INSTALLING');
    } else if (r.waiting) {
      // Todo: Any way to auto-refresh (didn't seem to work
      //    even as only tab)
      await dialogs.alert(`
An update is in progress. After finishing any work
you have in them, please close this and any other existing tabs
running this web application and then open the site again.
Please note it may take some time to install and may not show
any indication it is installing.
`, {
        ok: false
      });
      // We might just let the user go on without a reload, but
      //   as fetch operations would apparently wait to execute,
      //   it wouldn't be much use, so just reload (to get same
      //   message again until other tabs closed)
      // If state has changed, handle below
      /*
            if (!r.installing && !r.active) {
                location.reload();
                return;
            }
            resolve();
            */
    }
  });
};

// Keep in this file as may wish to avoid using for server (while still
//   doing other service worker work)
const registerServiceWorker = async ({
  serviceWorkerPath,
  logger
}) => {
  // Todo: We might wish to allow avoiding the other locale files
  //   and if only one chosen, switch to the work selection page
  //   in that language
  /*
    Todo: (Configurable) Strategy options
     - Wait and put everything in an `install` `waitUntil` after we've retrieved
    the user JSON, informing the user that they must wait for everything to
    download and ensure they can go completely offline (especially for sites
    which don't have that much offline content).
    - A safer bet (especially for non-hardcore users) is to pre-cache the
    necessary files for this app, and download the rest as available. However,
    if the user attempts to download while they are offline before
    they got all files, we'll need to show a notice. The *TextBrowser* source
    files, the user's files list and locales should be enough.
     For either option, we might possibly (and user-optionally) send a notice
    (whose approval we've asked for already) when all files are complete
    instead of just a dialog. We could also skip waiting if we disabled offline
    on previously controlled clients (until refresh would get new app files
    and database queries wouldn't be broken)
    */

  console.log('--ready to register service worker', serviceWorkerPath);
  // `persist` will grandfather non-persisted caches, so if we don't end up
  //    using `install` event for dynamic items, we could put the service worker
  //    registration at the beginning of the file without waiting for persistence
  //    approval (or at least after rendering page to avoid visual "jankiness"/
  //    competititon for network for low-bandwidth sites); however,
  //    as we want to show a dialog about permissions first, we wait until here.
  let r;
  try {
    r = await navigator.serviceWorker.register(serviceWorkerPath, {
      type: 'module'
    });
  } catch (err) {
    console.log('serviceWorkerPath', serviceWorkerPath);
    await dialogs.alert(`
There was an error during registration (for offline ability).
Please refresh the page if you wish to reattempt.
`);
    return;
  }
  logger.addLogEntry({
    text: 'Worker registration: Complete'
  });

  // Todo: Catch errors?
  return respondToState({
    r,
    logger
  });
};

const escapeHTML = s => {
  return !s ? '' : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/* eslint-env browser */
var languageSelect = {
  main({
    langs,
    languages,
    followParams,
    $p
  }) {
    jml('form', {
      class: 'focus',
      id: 'languageSelectionContainer',
      $on: {
        submit(e) {
          e.preventDefault();
        }
      }
    }, [['select', {
      name: 'lang',
      size: langs.length,
      $on: {
        click({
          target: {
            parentNode: {
              selectedOptions
            }
          }
        }) {
          followParams('#languageSelectionContainer', () => {
            $p.set('lang', selectedOptions[0].value, true);
          });
        }
      }
    }, langs.map(({
      code
    }) => ['option', {
      value: code
    }, [languages.getLanguageFromCode(code)]])]], $$1('#main'));
    if (history.state && typeof history.state === 'object') {
      deserialize(document.querySelector('#languageSelectionContainer'), history.state);
    }
  }

  // Todo: Add in Go button (with 'submitgo' localization string) to
  //   avoid need for pull-down if using first selection?
  /* Works too:
    langs.map(({code, name}) =>
        ['div', [
            ['a', {href: '#', dataset: {code}}, [name]]
        ]]
    ), $('#main')
    */
};

/* eslint-env browser */
var workSelect$1 = (({
  groups,
  workI18n,
  getNextAlias,
  $p,
  followParams
}) => {
  const form = jml('form', {
    id: 'workSelect',
    class: 'focus',
    $on: {
      submit(e) {
        e.preventDefault();
      }
    }
  }, groups.map((group, i) => {
    return ['div', [i > 0 ? ['br', 'br', 'br'] : '', ['div', [workI18n(group.directions.localeKey)]], ['br'], ['select', {
      class: 'file',
      name: 'work' + i,
      dataset: {
        name: group.name.localeKey
      },
      $on: {
        change({
          target: {
            value
          }
        }) {
          /*
                        // If using click, but click doesn't always fire
                        if (e.target.nodeName.toLowerCase() === 'select') {
                            return;
                        }
                        */
          followParams('#workSelect', () => {
            $p.set('work', value);
          });
        }
      }
    }, [['option', {
      value: ''
    }, ['--']], ...group.files.map(({
      name: fileName
    }) => ['option', {
      value: workI18n(['workNames', group.id, fileName])
    }, [getNextAlias()]])]]
    // Todo: Add in Go button (with 'submitgo' localization string) to
    //    avoid need for pull-down if using first selection?
    ]];
  }), $$1('#main'));
  if (history.state && typeof history.state === 'object') {
    deserialize(document.querySelector('#workSelect'), history.state);
  }
  return form;
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
const fonts = ['Helvetica, sans-serif', 'Verdana, sans-serif', 'Gill Sans, sans-serif', 'Avantgarde, sans-serif', 'Helvetica Narrow, sans-serif', 'sans-serif', 'Times, serif', 'Times New Roman, serif', 'Palatino, serif', 'Bookman, serif', 'New Century Schoolbook, serif', 'serif', 'Andale Mono, monospace', 'Courier New, monospace', 'Courier, monospace', 'Lucidatypewriter, monospace', 'Fixed, monospace', 'monospace', 'Comic Sans, Comic Sans MS, cursive', 'Zapf Chancery, cursive', 'Coronetscript, cursive', 'Florence, cursive', 'Parkavenue, cursive', 'cursive', 'Impact, fantasy', 'Arnoldboecklin, fantasy', 'Oldtown, fantasy', 'Blippo, fantasy', 'Brushstroke, fantasy', 'fantasy'];

const nbsp2 = nbsp.repeat(2);
const nbsp3 = nbsp.repeat(3);
const getDataForSerializingParamsAsURL = () => ({
  form: $$1('form#browse'),
  // Todo: We don't need any default once random
  //    functionality is completed
  random: $$1('#rand') || {},
  checkboxes: $$('input[type=checkbox]')
});
var workDisplay$1 = {
  bdo: ({
    fallbackDirection,
    message
  }) =>
  // Displaying as div with inline display instead of span since
  //    Firefox puts punctuation at left otherwise (bdo dir
  //    seemed to have issues in Firefox)
  ['div', {
    style: 'display: inline; direction: ' + fallbackDirection
  }, [message]],
  columnsTable: ({
    lDirectional,
    fieldInfo,
    $p,
    lElement,
    lIndexedParam,
    l,
    metadataObj,
    preferredLocale,
    schemaItems,
    fieldMatchesLocale
  }) => ['table', {
    border: '1',
    cellpadding: '5',
    align: 'center'
  }, [['tr', [['th', [lDirectional('fieldno')]], ['th', {
    align: 'left',
    width: '20'
  }, [lDirectional('field_enabled')]], ['th', [lDirectional('field_title')]], ['th', [lDirectional('fieldinterlin')]], ['th', [lDirectional('fieldcss')]]
  /*
        Todo: Support search?
        ,
        ['th', [
            lDirectional('fieldsearch')
        ]]
        */]], ...fieldInfo.map((fieldInfoItem, i) => {
    const idx = i + 1;
    const checkedIndex = 'checked' + idx;
    const fieldIndex = 'field' + idx;
    const fieldParam = $p.get(fieldIndex);
    return ['tr', [
    // Todo: Get Jamilih to accept numbers and
    //    booleans (`toString` is too dangerous)
    ['td', [String(idx)]], lElement('check-columns-to-browse', 'td', 'title', {}, [lElement('yes', 'input', 'value', {
      class: 'fieldSelector',
      id: checkedIndex,
      name: lIndexedParam('checked') + idx,
      checked: $p.get(checkedIndex) !== l('no') && ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
      type: 'checkbox'
    })]), lElement('check-sequence', 'td', 'title', {}, [['select', {
      name: lIndexedParam('field') + idx,
      id: fieldIndex,
      size: '1'
    }, fieldInfo.map(({
      field,
      fieldAliasOrName
    }, j) => {
      const matchedFieldParam = fieldParam && fieldParam === fieldAliasOrName;
      return ['option', {
        dataset: {
          name: field
        },
        value: fieldAliasOrName,
        selected: matchedFieldParam || j === i && !$p.has(fieldIndex)
      }, [fieldAliasOrName]];
    })]]), ['td', [
    // Todo: Make as tag selector with fields as options
    lElement('interlinear-tips', 'input', 'title', {
      name: lIndexedParam('interlin') + idx,
      value: $p.get('interlin' + idx)
    }) // Todo: Could allow i18n of numbers here
    ]], ['td', [
    // Todo: Make as CodeMirror-highlighted CSS
    ['input', {
      name: lIndexedParam('css') + idx,
      value: $p.get('css' + idx)
    }]]]
    /*
            ,
            ['td', [ // Todo: Allow plain or regexp searching
                ['input', {name: lIndexedParam('search') + idx, value: $p.get('search' + idx)}]
            ]]
            */]];
  }), ['tr', [['td', {
    colspan: 3
  }, [lElement('check_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        $$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = true;
        });
      }
    }
  }), lElement('uncheck_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        $$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = false;
        });
      }
    }
  }), lElement('checkmark_locale_fields_only', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        fieldInfo.forEach(({
          field
        }, i) => {
          const idx = i + 1;
          // The following is redundant with 'field' but may need to
          //     retrieve later out of order?
          const fld = $$1('#field' + idx).selectedOptions[0].dataset.name;
          $$1('#checked' + idx).checked = fieldMatchesLocale(fld);
        });
      }
    }
  })]]]]]],
  advancedFormatting: ({
    lDirectional,
    lParam,
    l,
    lOption,
    lElement,
    $p,
    hideFormattingSection
  }) => ['td', {
    id: 'advancedformatting',
    style: {
      display: hideFormattingSection ? 'none' : 'block'
    }
  }, [['h3', [lDirectional('advancedformatting')]], ['label', [lDirectional('textcolor'), nbsp2, ['select', {
    name: lParam('colorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color]),
      selected: null
    };
    if ($p.get('colorName') === l(['param_values', 'colors', color]) || i === 1 && !$p.has('colorName')) {
      atts.selected = 'selected';
    }
    return lOption(['param_values', 'colors', color], atts);
  })]]], ['label', [nbsp, lDirectional('or_entercolor'), nbsp2, ['input', {
    name: lParam('color'),
    type: 'text',
    value: $p.get('color') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [lDirectional('backgroundcolor'), nbsp2, ['select', {
    name: lParam('bgcolorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color]),
      selected: null
    };
    if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) || i === 14 && !$p.has('bgcolorName')) {
      atts.selected = 'selected';
    }
    return lOption(['param_values', 'colors', color], atts);
  })]]], ['label', [nbsp, lDirectional('or_entercolor'), nbsp2, ['input', {
    name: lParam('bgcolor'),
    type: 'text',
    value: $p.get('bgcolor') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [lDirectional('text_font'), nbsp2,
  // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
  ['select', {
    name: lParam('fontSeq'),
    dir: 'ltr'
  }, fonts.map((fontSeq, i) => {
    const atts = {
      value: fontSeq,
      selected: null
    };
    if ($p.get('fontSeq') === fontSeq || i === 7 && !$p.has('fontSeq')) {
      atts.selected = 'selected';
    }
    return ['option', atts, [fontSeq]];
  })]]], ['br'], ['br'], ['label', [lDirectional('font_style'), nbsp2, ['select', {
    name: lParam('fontstyle')
  }, ['italic', 'normal', 'oblique'].map((fontstyle, i) => {
    const atts = {
      value: l(['param_values', 'fontstyle', fontstyle]),
      selected: null
    };
    if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) || i === 1 && !$p.has('fontstyle')) {
      atts.selected = 'selected';
    }
    return lOption(['param_values', 'fontstyle', fontstyle], atts);
  })]]], ['br'], ['div', [lDirectional('font_variant'), nbsp3, ['label', [['input', {
    name: lParam('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'normal']),
    checked: $p.get('fontvariant') !== lDirectional(['param_values', 'fontvariant', 'small-caps'])
  }], lDirectional(['param_values', 'fontvariant', 'normal']), nbsp]], ['label', [['input', {
    name: lParam('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'small-caps']),
    checked: $p.get('fontvariant') === lDirectional(['param_values', 'fontvariant', 'small-caps'])
  }], lDirectional(['param_values', 'fontvariant', 'small-caps']), nbsp]]]], ['br'], ['label', [
  // Todo: i18n and allow for normal/bold pulldown and float input?
  lDirectional('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2, ['input', {
    name: lParam('fontweight'),
    type: 'text',
    value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [lDirectional('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2, ['input', {
    name: lParam('fontsize'),
    type: 'text',
    value: $p.get('fontsize'),
    size: '7',
    maxlength: '12'
  }]]], ['br'],
  // Todo: i18nize title and values?
  // Todo: remove hard-coded direction if i18nizing
  ['label', {
    dir: 'ltr'
  }, [lDirectional('font_stretch'), nbsp, ['select', {
    name: lParam('fontstretch')
  }, ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(stretch => {
    const atts = {
      value: lDirectional(['param_values', 'font-stretch', stretch]),
      selected: null
    };
    if ($p.get('fontstretch') === stretch || !$p.has('fontstretch') && stretch === 'normal') {
      atts.selected = 'selected';
    }
    return ['option', atts, [lDirectional(['param_values', 'font-stretch', stretch])]];
  })]]], /**/
  ['br'], ['br'], ['label', [lDirectional('letter_spacing'), ' (normal, .9em, -.05cm): ', ['input', {
    name: lParam('letterspacing'),
    type: 'text',
    value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [lDirectional('line_height'), ' (normal, 1.5, 22px, 150%): ', ['input', {
    name: lParam('lineheight'),
    type: 'text',
    value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['br'], lElement('tableformatting_tips', 'h3', 'title', {}, [lDirectional('tableformatting')]), ['div', [lDirectional('header_wstyles'), nbsp2, ...[['yes', lDirectional(['param_values', 'y'])], ['no', lDirectional(['param_values', 'n'])], ['none', lDirectional(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: lParam('header'),
    type: 'radio',
    value: val,
    checked: $p.get('header') === val || !$p.has('header') && i === 1
  }], lDirectional(key), i === arr.length - 1 ? '' : nbsp3]])]], ['div', [lDirectional('footer_wstyles'), nbsp2, ...[['yes', lDirectional(['param_values', 'y'])], ['no', lDirectional(['param_values', 'n'])], ['none', lDirectional(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: lParam('footer'),
    type: 'radio',
    value: val,
    checked: $p.get('footer') === val || !$p.has('footer') && i === 2
  }], lDirectional(key), i === arr.length - 1 ? '' : nbsp3]])]], ['label', [['input', {
    name: lParam('headerfooterfixed'),
    type: 'checkbox',
    value: l('yes'),
    checked: $p.get('headerfooterfixed') === l('yes')
  }], nbsp2, lDirectional('headerfooterfixed-wishtoscroll')]], ['br'], ['div', [lDirectional('caption_wstyles'), nbsp2, ...[['yes', lDirectional(['param_values', 'y'])], ['no', lDirectional(['param_values', 'n'])], ['none', lDirectional(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: lParam('caption'),
    type: 'radio',
    value: val,
    checked: $p.get('caption') === val || !$p.has('caption') && i === 2
  }], lDirectional(key), i === arr.length - 1 ? '' : nbsp3]])]], ['br'], ['div', [lDirectional('table_wborder'), nbsp2, ['label', [['input', {
    name: lParam('border'),
    type: 'radio',
    value: '1',
    checked: $p.get('border') !== '0'
  }], lDirectional('yes'), nbsp3]], ['label', [['input', {
    name: lParam('border'),
    type: 'radio',
    value: '0',
    checked: $p.get('border') === '0'
  }], lDirectional('no')]]]], ['div', [lDirectional('interlin_repeat_field_names'), nbsp2, ['label', [['input', {
    name: lParam('interlintitle'),
    type: 'radio',
    value: '1',
    checked: $p.get('interlintitle') !== '0'
  }], lDirectional('yes'), nbsp3]], ['label', [['input', {
    name: lParam('interlintitle'),
    type: 'radio',
    value: '0',
    checked: $p.get('interlintitle') === '0'
  }], lDirectional('no')]]]], ['label', [lDirectional('interlintitle_css'), nbsp2, ['input', {
    name: lParam('interlintitle_css'),
    type: 'text',
    value: $p.get('interlintitle_css') || '',
    size: '12'
  }]]], ['br'],
  /*
      ['br'],
      ['label', [
          ['input', {
              name: lParam('transpose'),
              type: 'checkbox',
              value: l('yes'),
              checked: $p.get('transpose') === l('yes')
          }],
          nbsp2, lDirectional('transpose')
      ]],
      */
  ['br'], lElement('pageformatting_tips', 'h3', 'title', {}, [lDirectional('pageformatting')]),
  /*
      ['label', [
          lDirectional('speech_controls'), nbsp2,
          ['label', [
              ['input', {
                  name: lParam('speech'),
                  type: 'radio',
                  value: '1',
                  checked: $p.get('speech') === '1'
              }],
              lDirectional('yes'), nbsp3
          ]],
          ['label', [
              ['input', {
                  name: lParam('speech'),
                  type: 'radio',
                  value: '0',
                  checked: $p.get('speech') !== '1'
              }],
              lDirectional('no')
          ]]
      ]],
      ['br'],
      */
  ['label', [lDirectional('page_css'), nbsp2, ['textarea', {
    name: lParam('pagecss'),
    title: l('page_css_tips'),
    value: $p.get('pagecss')
  }]]], ['br'], lElement('outputmode_tips', 'label', 'title', {}, [lDirectional('outputmode'), nbsp2,
  // Todo: Could i18nize, but would need smaller values
  ['select', {
    name: lParam('outputmode')
  }, ['table', 'div'
  // , 'json-array',
  // 'json-object'
  ].map(mode => {
    const atts = {
      value: mode,
      selected: null
    };
    if ($p.get('outputmode') === mode) {
      atts.selected = 'selected';
    }
    return lOption(['param_values', 'outputmode', mode], atts);
  })]])]],
  addRandomFormFields({
    lParam,
    lDirectional,
    l,
    lElement,
    $p,
    serializeParamsAsURL,
    content
  }) {
    const addRowContent = rowContent => {
      if (!rowContent || !rowContent.length) {
        return;
      }
      content.push(['tr', rowContent]);
    };
    [[['td', {
      colspan: 12,
      align: 'center'
    }, [['br'], lDirectional('or'), ['br'], ['br']]]], [['td', {
      colspan: 12,
      align: 'center'
    }, [
    // Todo: Could allow random with fixed starting and/or ending range
    ['label', [lDirectional('rnd'), nbsp3, ['input', {
      id: 'rand',
      name: lParam('rand'),
      type: 'checkbox',
      value: l('yes'),
      checked: $p.get('rand') === l('yes')
    }]]], nbsp3, ['label', [lDirectional('verses-context'), nbsp, ['input', {
      name: lParam('context'),
      type: 'number',
      min: 1,
      size: 4,
      value: $p.get('context')
    }]]], nbsp3, lElement('view-random-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURL(_objectSpread2$1(_objectSpread2$1({}, getDataForSerializingParamsAsURL()), {}, {
            type: 'randomResult'
          }));
          $$1('#randomURL').value = url;
        }
      }
    }), ['input', {
      id: 'randomURL',
      type: 'text'
    }]]]]].forEach(addRowContent);
  },
  getPreferences: ({
    languageParam,
    workI18n,
    paramsSetter,
    replaceHash,
    getFieldAliasOrNames,
    work,
    langs,
    languageI18n,
    l,
    localizeParamNames,
    namespace,
    hideFormattingSection,
    groups,
    preferencesPlugin
  }) => ['div', {
    style: {
      textAlign: 'left'
    },
    id: 'preferences',
    hidden: 'true'
  }, [['div', {
    style: 'margin-top: 10px;'
  }, [['label', [l('localizeParamNames'), ['input', {
    id: 'localizeParamNames',
    type: 'checkbox',
    checked: localizeParamNames,
    $on: {
      change({
        target: {
          checked
        }
      }) {
        localStorage.setItem(namespace + '-localizeParamNames', checked);
      }
    }
  }]]]]], ['div', [['label', [l('Hide formatting section'), ['input', {
    id: 'hideFormattingSection',
    type: 'checkbox',
    checked: hideFormattingSection,
    $on: {
      change({
        target: {
          checked
        }
      }) {
        $$1('#advancedformatting').style.display = checked ? 'none' : 'block';
        localStorage.setItem(namespace + '-hideFormattingSection', checked);
      }
    }
  }]]]]], ['div', [['label', {
    for: 'prefLangs'
  }, [l('Preferred language(s)')]], ['br'], ['select', {
    id: 'prefLangs',
    multiple: 'multiple',
    size: langs.length,
    $on: {
      change({
        target: {
          selectedOptions
        }
      }) {
        // Todo: EU disclaimer re: storage?
        localStorage.setItem(namespace + '-langCodes', JSON.stringify([...selectedOptions].map(opt => opt.value)));
      }
    }
  }, langs.map(lan => {
    let langCodes = localStorage.getItem(namespace + '-langCodes');
    langCodes = langCodes && JSON.parse(langCodes);
    const atts = {
      value: lan.code,
      selected: null
    };
    if (langCodes && langCodes.includes(lan.code)) {
      atts.selected = 'selected';
    }
    return ['option', atts, [languageI18n(lan.code)]];
  })]]], preferencesPlugin ? preferencesPlugin({
    $: $$1,
    l,
    jml,
    paramsSetter,
    getDataForSerializingParamsAsURL,
    work,
    replaceHash,
    getFieldAliasOrNames
  }) : '']],
  addBrowseFields({
    browseFields,
    fieldInfo,
    lDirectional,
    i,
    lIndexedParam,
    $p,
    content
  }) {
    const work = $p.get('work');
    const addRowContent = rowContent => {
      if (!rowContent || !rowContent.length) {
        return;
      }
      content.push(['tr', rowContent]);
    };
    [
    // Todo: Separate formatting to CSS
    i > 0 ? [['td', {
      colspan: 12,
      align: 'center'
    }, [['br'], lDirectional('or'), ['br'], ['br']]]] : '', [...(() => {
      const addBrowseFieldSet = setType => browseFields.reduce((rowContent, {
        fieldName,
        aliases,
        fieldSchema: {
          minimum,
          maximum
        }
      }, j) => {
        // Namespace by work for sake of browser auto-complete caching
        const name = work + '-' + lIndexedParam(setType) + (i + 1) + '-' + (j + 1);
        const id = name;
        rowContent['#'].push(['td', [['label', {
          for: name
        }, [fieldName]]]], ['td', [aliases ? ['datalist', {
          id: 'dl-' + id
        }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
          name,
          id,
          class: 'browseField',
          list: 'dl-' + id,
          value: $p.get(name, true),
          $on: setType === 'start' ? {
            change(e) {
              $$('input.browseField').forEach(bf => {
                if (bf.id.includes(i + 1 + '-' + (j + 1))) {
                  bf.value = e.target.value;
                }
              });
            }
          } : undefined
        }] : ['input', {
          name,
          id,
          type: 'number',
          min: minimum,
          max: maximum,
          value: $p.get(name, true)
        }], nbsp3]]);
        return rowContent;
      }, {
        '#': []
      });
      return [addBrowseFieldSet('start'), ['td', [['b', [lDirectional('to')]], nbsp3]], addBrowseFieldSet('end')];
    })(), ['td', [browseFields.length > 1 ? lDirectional('versesendingdataoptional') : '']]], [['td', {
      colspan: 4 * browseFields.length + 2 + 1,
      align: 'center'
    }, [['table', [['tr', [browseFields.reduce((rowContent, {
      fieldName,
      aliases,
      fieldSchema: {
        minimum,
        maximum
      }
    }, j) => {
      // Namespace by work for sake of browser auto-complete caching
      const name = work + '-' + lIndexedParam('anchor') + (i + 1) + '-' + (j + 1);
      const id = name;
      rowContent['#'].push(['td', [['label', {
        for: name
      }, [fieldName]]]], ['td', [aliases ? ['datalist', {
        id: 'dl-' + id
      }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
        name,
        id,
        class: 'browseField',
        list: 'dl-' + id,
        value: $p.get(name, true)
      }] : ['input', {
        name,
        id,
        type: 'number',
        min: minimum,
        max: maximum,
        value: $p.get(name, true)
      }], nbsp2]]);
      return rowContent;
    }, {
      '#': [['td', {
        style: 'font-weight: bold; vertical-align: bottom;'
      }, [lDirectional('anchored-at') + nbsp3]]]
    }), ['td', [['label', [lDirectional('field') + nbsp2, ['select', {
      name: lIndexedParam('anchorfield') + (i + 1),
      size: '1'
    }, fieldInfo.map(({
      fieldAliasOrName
    }) => {
      const val = $p.get(lIndexedParam('anchorfield') + (i + 1), true);
      if (val === fieldAliasOrName) {
        return ['option', {
          selected: true
        }, [fieldAliasOrName]];
      }
      return ['option', [fieldAliasOrName]];
    })]]]]]]]]]]]]].forEach(addRowContent);
  },
  main({
    workI18n,
    languageParam,
    l,
    namespace,
    heading,
    fallbackDirection,
    languageI18n,
    langs,
    fieldInfo,
    localizeParamNames,
    serializeParamsAsURL,
    paramsSetter,
    replaceHash,
    getFieldAliasOrNames,
    hideFormattingSection,
    $p,
    metadataObj,
    lParam,
    lElement,
    lDirectional,
    lIndexedParam,
    fieldMatchesLocale,
    preferredLocale,
    schemaItems,
    content,
    groups,
    preferencesPlugin
  }) {
    const work = $p.get('work');
    const serializeParamsAsURLWithData = ({
      type
    }) => {
      return serializeParamsAsURL(_objectSpread2$1(_objectSpread2$1({}, getDataForSerializingParamsAsURL()), {}, {
        type
      }));
    };
    const lOption = (key, atts) => ['option', atts, [l(key
    // Ensure `intl-dom` supports
    // , fallback ({message}) {
    //   atts.dir = fallbackDirection;
    //   return message;
    // }
    )]];
    // Returns element with localized or fallback attribute value (as Jamilih);
    //   also adds direction
    jml('div', {
      class: 'focus'
    }, [['div', {
      style: 'float: left;'
    }, [['button', {
      $on: {
        click() {
          const prefs = $$1('#preferences');
          prefs.hidden = !prefs.hidden;
        }
      }
    }, [l('Preferences')]], Templates.workDisplay.getPreferences({
      languageParam,
      workI18n,
      paramsSetter,
      replaceHash,
      getFieldAliasOrNames,
      work,
      langs,
      languageI18n,
      l,
      localizeParamNames,
      namespace,
      groups,
      hideFormattingSection,
      preferencesPlugin
    })]], ['h2', [heading]], ['br'], ['form', {
      id: 'browse',
      $custom: {
        $submit() {
          const thisParams = serializeParamsAsURLWithData({
            type: 'saveSettings'
          }).replace(/^[^#]*#/, '');
          // Don't change the visible URL
          console.log('history thisParams', thisParams);
          history.replaceState(thisParams, document.title, location.href);
          const newURL = serializeParamsAsURLWithData({
            type: 'result'
          });
          location.href = newURL;
        }
      },
      $on: {
        keydown({
          key,
          target
        }) {
          // Chrome is not having submit event triggered now with enter key
          //   presses on inputs, despite having a `type=submit` input in the
          //   form, and despite not using `preventDefault`
          if (key === 'Enter' && target.localName.toLowerCase() !== 'textarea') {
            this.$submit();
          }
        },
        submit(e) {
          e.preventDefault();
          this.$submit();
        }
      },
      name: lParam('browse')
    }, [['table', {
      align: 'center'
    }, content], ['br'], ['div', {
      style: 'margin-left: 20px'
    }, [['br'], ['br'], ['table', {
      border: '1',
      align: 'center',
      cellpadding: '5'
    }, [['tr', {
      valign: 'top'
    }, [['td', [Templates.workDisplay.columnsTable({
      lDirectional,
      fieldInfo,
      $p,
      lElement,
      lIndexedParam,
      l,
      metadataObj,
      preferredLocale,
      schemaItems,
      fieldMatchesLocale
    }), lElement('save-settings-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURLWithData({
            type: 'saveSettings'
          });
          $$1('#settings-URL').value = url;
        }
      }
    }), ['input', {
      id: 'settings-URL'
    }], ['br'], ['button', {
      $on: {
        async click(e) {
          e.preventDefault();
          const paramsCopy = paramsSetter(_objectSpread2$1(_objectSpread2$1({}, getDataForSerializingParamsAsURL()), {}, {
            workName: work,
            // Delete work of current page
            type: 'startEndResult'
          }));
          const url = replaceHash(paramsCopy) + `&work=${work}&${work}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here
          try {
            await navigator.clipboard.writeText(url);
          } catch (err) {
            // User rejected
          }
        }
      }
    }, [l('Copy_shortcut_URL')]]]], Templates.workDisplay.advancedFormatting({
      lDirectional,
      lParam,
      l,
      lOption,
      lElement,
      $p,
      hideFormattingSection
    })
    /*
    // Todo: Is this still the case? No way to control with CSS?
    ,arabicContent ?
        // If there is Arabic content, a text box will be created for
        //    each field with such content to allow the user to choose
        //    how wide the field should be (since the Arabic is smaller).
        // Todo: Allow naming of the field differently for Persian?
        //    Allowing any column to be resized would probably be most
        //    consistent with this project's aim to not make arbitrary
        //    decisions on what should be customizable, but rather make
        //    as much as possible customizable. It may also be helpful
        //    for Chinese, etc. If adding, also need $p.get() for
        //    defaulting behavior
        {'#': arabicContent.map((item, i) =>
            {'#': [
                'Width of Arabic column: ', // Todo: i18n
                ['input', {
                    name: lParam('arw') + i,
                    type: 'text',
                    value: '',
                    size: '7',
                    maxlength: '12'
                }]
            ]}
        )} :
        ''
    */]]]]]], ['p', {
      align: 'center'
    }, [lElement('submitgo', 'input', 'value', {
      type: 'submit'
    })]]]]], $$1('#main'));
  }
};

var resultsDisplayServerOrClient$1 = {
  caption({
    heading,
    ranges
  }) {
    return heading + ' ' + ranges;
  },
  startSeparator({
    l
  }) {
    return l('colon');
  },
  innerBrowseFieldSeparator({
    l
  }) {
    return l('comma-space');
  },
  ranges({
    l,
    startRange,
    endVals,
    rangeNames
  }) {
    return startRange +
    // l('to').toLowerCase() + ' ' +
    '-' + endVals.join(Templates.resultsDisplayServerOrClient.startSeparator({
      l
    })) + ' (' + rangeNames + ')';
  },
  fieldValueAlias({
    key,
    value
  }) {
    return value + ' (' + key + ')';
  },
  interlinearSegment({
    lang,
    dir,
    html
  }) {
    return `<span${lang ? ` lang="${lang}"` : ''}${dir ? ` dir="${dir}"` : ''}>${html}</span>`;
  },
  interlinearTitle({
    l,
    val
  }) {
    const colonSpace = l('colon-space');
    return `<span class="interlintitle">${val}</span>${colonSpace}`;
  },
  styles({
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    escapeQuotedCSS,
    escapeCSS,
    tableWithFixedHeaderAndFooter,
    checkedFieldIndexes,
    hasCaption
  }) {
    const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#' ? $pRawEsc('colorName') : $pEscArbitrary('color');
    const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#' ? $pRawEsc('bgcolorName') : $pEscArbitrary('bgcolor');
    const tableHeight = '100%';
    const topToCaptionStart = 1;
    const captionSizeDelta = (hasCaption ? 2 : 0) + 0;
    const topToHeadingsStart = topToCaptionStart + captionSizeDelta;
    const headingsDelta = 1;
    const topToBodyStart = topToHeadingsStart + headingsDelta + 'em';
    const footerHeight = '2em';
    const bodyToFooterPadding = '0.5em';
    const topToBodyEnd = `100% - ${topToBodyStart} - ${footerHeight} - ${bodyToFooterPadding}`;
    const topToBodyEndCalc = `calc(${topToBodyEnd})`;
    const topToFooter = `calc(${topToBodyEnd} + ${bodyToFooterPadding})`;
    return ['style', [(tableWithFixedHeaderAndFooter ? `
html, body, #main, #main > div {
    height: 100%; /* Needed to ensure descendent heights retain 100%; could be avoided if didn't want percent on table height */
    overflow-y: hidden; /* Not sure why we're getting extra here, but... */
}
.anchor-table-header {
    background-color: ${bgcolorEsc || 'white'}; /* Header background (not just for div text inside header, but for whole header area) */
    overflow-x: hidden; /* Not sure why we're getting extra here, but... */
    position: relative; /* Ensures we are still flowing, but provides anchor for absolutely positioned thead below (absolute positioning positions relative to nearest non-static ancestor; clear demo at https://www.w3schools.com/cssref/playit.asp?filename=playcss_position&preval=fixed ) */
    padding-top: ${topToBodyStart}; /* Provides space for the header (and caption) (the one that is absolutely positioned below relative to here) */
    height: ${tableHeight}; /* Percent of the whole screen taken by the table */
}
.anchor-table-body {
    overflow-y: auto; /* Provides scrollbars when text fills up beyond the height */
    height: ${topToBodyEndCalc}; /* If < 100%, the header anchor background color will seep below table */
}

.caption, .thead .th, .tfoot .th {
    line-height: 0; /* th div will have own line-height; reducing here avoids fattening it by an inner div */
    color: transparent; /* Hides the non-div duplicated header text */
    white-space: nowrap; /* Ensures column header text uses up full width without overlap (esp. wrap no longer seems to work); this must be applied outside of the div */
    border: none; /* We don't want a border for this invisible section */
}
div.inner-caption, .thead .th div.th-inner, .tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    position: absolute; /* Puts relative to nearest non-static ancestor (our relative header anchor) */
    color: initial; /* Header must have an explicit color or it will get transparent container color */
    line-height: normal; /* Revert ancestor line height of 0 */
}
.thead .th div.th-inner {
    top: ${topToHeadingsStart}em; /* Ensures our header stays fixed at top outside of normal flow of table */
}
div.inner-caption {
    top: ${topToCaptionStart}em;
}
.tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    top: ${topToFooter}; /* Ensures our header stays fixed at top outside of normal flow of table */
}
.zupa div.zupa1 {
    margin: 0 auto !important;
    width: 0 !important;
}
.zupa div.th-inner, .zupa div.inner-caption {
    width: 100%;
    margin-left: -50%;
    text-align: center;
}
` : '') + ($pRaw('caption') === 'y' ? tableWithFixedHeaderAndFooter ? '.caption div.inner-caption, ' : '.caption, ' : '') + ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.thead .th, .thead .th div.th-inner, ` // Problems at least in Chrome
    : `.thead .th, ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.tfoot .th, .tfoot .th div.th-inner, ` // Problems at least in Chrome
    : `.tfoot .th, ` : '') + '.tbody td' + ` {
    vertical-align: top;
    font-style: ${$pRawEsc('fontstyle')};
    font-variant: ${$pRawEsc('fontvariant')};
    font-weight: ${$pEscArbitrary('fontweight')};
    ${$pEscArbitrary('fontsize') ? `font-size: ${$pEscArbitrary('fontsize')};` : ''}
    font-family: ${$pEscArbitrary('fontSeq')};

    font-stretch: ${$pRawEsc('fontstretch')};
    letter-spacing: ${$pEscArbitrary('letterspacing')};
    line-height: ${$pEscArbitrary('lineheight')};
    ${colorEsc ? `color: ${escapeCSS(colorEsc)};` : ''}
    ${bgcolorEsc ? `background-color: ${escapeCSS(bgcolorEsc)};` : ''}
}
${escapeCSS($pEscArbitrary('pagecss') || '')}
` + checkedFieldIndexes.map((idx, i) => ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `.thead .th:nth-child(${i + 1}) div.th-inner, ` : `.thead .th:nth-child(${i + 1}), ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, ` : `.tfoot .th:nth-child(${i + 1}), ` : '') + `.tbody td:nth-child(${i + 1}) ` + `{
    ${$pEscArbitrary('css' + (idx + 1))}
}
`).join('') + ($pEscArbitrary('interlintitle_css') ? `
/* http://salzerdesign.com/test/fixedTable.html */
.interlintitle {
    ${escapeCSS($pEscArbitrary('interlintitle_css'))}
}
` : '') + (bgcolorEsc ? `
body {
    background-color: ${bgcolorEsc};
}
` : '')]];
  },
  main({
    tableData,
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    // Todo: escaping should be done in business logic!
    escapeQuotedCSS,
    escapeCSS,
    escapeHTML,
    l,
    localizedFieldNames,
    fieldLangs,
    fieldDirs,
    caption,
    hasCaption,
    showInterlinTitles,
    determineEnd,
    getCanonicalID,
    canonicalBrowseFieldSetName,
    getCellValue,
    checkedAndInterlinearFieldInfo,
    interlinearSeparator = '<br /><br />'
  }) {
    const tableOptions = {
      table: [['table', {
        class: 'table',
        border: $pRaw('border') || '0'
      }], ['tr', {
        class: 'tr'
      }], ['td'],
      // , {class: 'td'} // Too much data to add class to each
      ['th', {
        class: 'th'
      }], ['caption', {
        class: 'caption'
      }], ['thead', {
        class: 'thead'
      }], ['tbody', {
        class: 'tbody'
      }], ['tfoot', {
        class: 'tfoot'
      }]
      // ['colgroup', {class: 'colgroup'}],
      // ['col', {class: 'col'}]
      ],

      div: [['div', {
        class: 'table',
        style: 'display: table;'
      }], ['div', {
        class: 'tr',
        style: 'display: table-row;'
      }], ['div', {
        class: 'td',
        style: 'display: table-cell;'
      }], ['div', {
        class: 'th',
        style: 'display: table-cell;'
      }], ['div', {
        class: 'caption',
        style: 'display: table-caption;'
      }], ['div', {
        class: 'thead',
        style: 'display: table-header-group;'
      }], ['div', {
        class: 'tbody',
        style: 'display: table-row-group;'
      }], ['div', {
        class: 'tfoot',
        style: 'display: table-footer-group;'
      }]
      // ['div', {class: 'colgroup', style: 'display: table-column-group;'}],
      // ['div', {class: 'col', style: 'display: table-column;'}]
      ],

      'json-array': 'json',
      'json-object': 'json'
    };
    const outputmode = $p.get('outputmode', true); // Why not $pRaw?

    switch (outputmode) {
      case 'json-object': // Can later fall through if supporting
      case 'json-array':
        // tableOptions[outputmode] = tableOptions.table;
        // break;
        throw new Error('JSON object support is currently not available');
    }
    const tableElems = tableOptions[Object.prototype.hasOwnProperty.call(tableOptions, outputmode) ? outputmode : 'table' // Default
    ];

    const [tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem] = tableElems; // colgroupElem, colElem

    const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] = checkedAndInterlinearFieldInfo;
    const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';
    const tableWrap = children => {
      return tableWithFixedHeaderAndFooter ? ['div', {
        class: 'table-responsive anchor-table-header zupa'
      }, [['div', {
        class: 'table-responsive anchor-table-body'
      }, children]]] : ['div', {
        class: 'table-responsive'
      }, children];
    };
    const addChildren = (el, children) => {
      el = JSON.parse(JSON.stringify(el));
      el.push(children);
      return el;
    };
    const addAtts = ([el, atts], newAtts) => [el, _objectSpread2$1(_objectSpread2$1({}, atts), newAtts)];
    const foundState = {
      start: false,
      end: false
    };
    const outArr = [];
    const {
      showEmptyInterlinear,
      showTitleOnSingleInterlinear
    } = this;
    const checkEmpty = (tdVal, htmlEscaped) => {
      if (!showEmptyInterlinear) {
        if (!htmlEscaped) {
          tdVal = new DOMParser().parseFromString(tdVal, 'text/html').body;
          [...tdVal.querySelectorAll('br')].forEach(br => {
            br.remove();
          });
          tdVal = tdVal.innerHTML;
        }
        if (!tdVal.trim()) {
          return true;
        }
      }
    };
    tableData.some((tr, i) => {
      const rowID = determineEnd({
        tr,
        foundState
      });
      if (typeof rowID === 'boolean') {
        return rowID;
      }
      const canonicalID = getCanonicalID({
        tr
      });
      outArr.push(addChildren(addAtts(trElem, {
        dataset: {
          row: rowID,
          'canonical-type': canonicalBrowseFieldSetName,
          'canonical-id': canonicalID
        }
      }), checkedFieldIndexes.map((idx, j) => {
        const interlinearColIndexes = allInterlinearColIndexes[j];
        const showInterlins = interlinearColIndexes;
        const {
          tdVal,
          htmlEscaped
        } = getCellValue({
          tr,
          idx
        });
        const interlins = showInterlins && interlinearColIndexes.map(idx => {
          // Need to get a new one
          const {
            tdVal,
            htmlEscaped
          } = getCellValue({
            tr,
            idx
          });
          console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
          const isEmpty = checkEmpty(tdVal, htmlEscaped);
          if (isEmpty) {
            return '';
          }
          return showInterlins ? Templates.resultsDisplayServerOrClient.interlinearSegment({
            lang: fieldLangs[idx],
            dir: fieldDirs[idx],
            html: (showInterlinTitles ? Templates.resultsDisplayServerOrClient.interlinearTitle({
              l,
              val: localizedFieldNames[idx]
            }) : '') + tdVal
          }) : tdVal;
        }).filter(cell => cell !== '');
        return addAtts(tdElem, {
          // We could remove these (and add to <col>) for optimizing delivery,
          //    but non-table output couldn't use unless on a hidden element
          // Can't have unique IDs if user duplicates a column
          id: 'row' + (i + 1) + 'col' + (j + 1),
          lang: fieldLangs[idx],
          dir: fieldDirs[idx],
          dataset: {
            col: localizedFieldNames[idx]
          },
          innerHTML: (showInterlins && !checkEmpty(tdVal, htmlEscaped) && (showTitleOnSingleInterlinear || interlins.length) ? Templates.resultsDisplayServerOrClient.interlinearSegment({
            lang: fieldLangs[idx],
            html: (showInterlinTitles ? Templates.resultsDisplayServerOrClient.interlinearTitle({
              l,
              val: localizedFieldNames[idx]
            }) : '') + tdVal
          }) : tdVal) + (interlinearColIndexes && interlins.length ? interlinearSeparator + interlins.join(interlinearSeparator) : '')
        });
      })));
      return false;
    });
    return ['div', [Templates.resultsDisplayServerOrClient.styles({
      $p,
      $pRaw,
      $pRawEsc,
      $pEscArbitrary,
      escapeQuotedCSS,
      escapeCSS,
      tableWithFixedHeaderAndFooter,
      checkedFieldIndexes,
      hasCaption
    }), tableWrap([addChildren(tableElem, [caption ? addChildren(captionElem, [caption, tableWithFixedHeaderAndFooter ? ['div', {
      class: 'zupa1'
    }, [['div', {
      class: 'inner-caption'
    }, [['span', [caption]]]]]] : '']) : '',
    /*
              // Works but quirky, e.g., `color` doesn't work (as also
              //  confirmed per https://quirksmode.org/css/css2/columns.html)
              addChildren(colgroupElem,
                  checkedFieldIndexes.map((idx, i) =>
                      addAtts(colElem, {style: $pRaw('css' + (idx + 1))})
                  )
              ),
              */
    $pRaw('header') !== '0' ? addChildren(theadElem, [addChildren(trElem, checkedFields.map((cf, i) => {
      const interlinearColIndexes = allInterlinearColIndexes[i];
      cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
      return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', {
        class: 'zupa1'
      }, [['div', {
        class: 'th-inner'
      }, [['span', [cf]]]]]] : '']);
    }))]) : '', $pRaw('footer') && $pRaw('footer') !== '0' ? addChildren(tfootElem, [addChildren(trElem, checkedFields.map((cf, i) => {
      const interlinearColIndexes = allInterlinearColIndexes[i];
      cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
      return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', {
        class: 'zupa1'
      }, [['div', {
        class: 'th-inner'
      }, [['span', [cf]]]]]] : '']);
    }))]) : '', addChildren(tbodyElem, outArr)])])]];
  }
};

var resultsDisplayClient$1 = {
  anchorRowCol({
    anchorRowCol
  }) {
    return $$1('#' + anchorRowCol);
  },
  anchors({
    escapedRow,
    escapedCol
  }) {
    const sel = 'tr[data-row="' + escapedRow + '"]' + (escapedCol ? '> td[data-col="' + escapedCol + '"]' : '');
    return $$1(sel);
  },
  main(...args) {
    let html;
    try {
      html = Templates.resultsDisplayServerOrClient.main(...args);
    } catch (err) {
      if (err.message === 'JSON support is currently not available') {
        dialogs.alert(err.message);
      } else {
        console.error(err);
      }
    }
    jml(...html, $$1('#main'));
  }
};

/* eslint-env browser */
const Templates = {
  languageSelect,
  workSelect: workSelect$1,
  workDisplay: workDisplay$1,
  resultsDisplayServerOrClient: resultsDisplayServerOrClient$1,
  resultsDisplayClient: resultsDisplayClient$1,
  defaultBody() {
    // We empty rather than `replaceWith` as our Jamilih `body`
    //   aliases expect the old instance
    while (body.hasChildNodes()) {
      body.firstChild.remove();
    }
    return jml('div', {
      id: 'main',
      role: 'main'
    }, body);
  },
  permissions: {
    versionChange() {
      $$1('#versionChange').showModal();
    },
    addLogEntry({
      text
    }) {
      const installationDialog = $$1('#installationLogContainer');
      try {
        installationDialog.showModal();
        const container = $$1('#dialogContainer');
        container.hidden = false;
      } catch (err) {
        // May already be open
      }
      $$1('#installationLog').append(text + '\n');
    },
    exitDialogs() {
      const container = $$1('#dialogContainer');
      if (container) {
        container.hidden = true;
      }
    },
    dbError({
      type,
      escapedErrorMessage
    }) {
      if (type) {
        jml('span', [type, ' ', escapedErrorMessage], $$1('#dbError'));
      }
      $$1('#dbError').showModal();
    },
    errorRegistering(escapedErrorMessage) {
      if (escapedErrorMessage) {
        jml('span', [escapedErrorMessage], $$1('#errorRegistering'));
      }
      $$1('#errorRegistering').showModal();
    },
    browserNotGrantingPersistence() {
      $$1('#browserNotGrantingPersistence').showModal();
    },
    /**
     * @param {PlainObject} cfg
     * @param {I18NCallback} cfg.siteI18n
     * @param {() => Promise<void>} cfg.ok
     * @param {() => void} cfg.refuse
     * @param {() => Promise<void>} cfg.close
     * @param {() => void} cfg.closeBrowserNotGranting
     * @returns {[
     *   HTMLDialogElement, HTMLDialogElement, HTMLDialogElement,
     *   HTMLDialogElement, HTMLDialogElement, HTMLDialogElement
     * ]}
     */
    main({
      siteI18n,
      ok,
      refuse,
      close,
      closeBrowserNotGranting
    }) {
      const installationDialog = jml('dialog', {
        style: 'text-align: center; height: 100%',
        id: 'installationLogContainer',
        class: 'focus'
      }, [['p', [siteI18n('wait-installing')]], ['div', {
        style: 'height: 80%; overflow: auto;'
      }, [['pre', {
        id: 'installationLog'
      }, []]]]
      // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
      ]);

      let requestPermissionsDialog = '';
      if (ok) {
        requestPermissionsDialog = jml('dialog', {
          id: 'willRequestStoragePermissions',
          $on: {
            close
          }
        }, [['section', [siteI18n('will-request-storage-permissions')]], ['br'], ['div', {
          class: 'focus'
        }, [['button', {
          $on: {
            click: ok
          }
        }, [siteI18n('OK')]], ['br'], ['br'], ['button', {
          $on: {
            click: refuse
          }
        }, [siteI18n('refuse-request-storage-permissions')]]]]]);
      }
      const errorRegisteringNotice = jml('dialog', {
        id: 'errorRegistering'
      }, [['section', [siteI18n('errorRegistering')]]]);
      let browserNotGrantingPersistenceAlert = '';
      if (closeBrowserNotGranting) {
        browserNotGrantingPersistenceAlert = jml('dialog', {
          id: 'browserNotGrantingPersistence'
        }, [['section', [siteI18n('browser-not-granting-persistence')]], ['br'], ['div', {
          class: 'focus'
        }, [['button', {
          $on: {
            click: closeBrowserNotGranting
          }
        }, [siteI18n('OK')]]]]]);
      }
      const versionChangeNotice = jml('dialog', {
        id: 'versionChange'
      }, [['section', [siteI18n('versionChange')]]]);
      const dbErrorNotice = jml('dialog', {
        id: 'dbError'
      }, [['section', [siteI18n('dbError')]]]);
      jml('div', {
        id: 'dialogContainer',
        style: 'height: 100%'
      }, [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice], $$1('#main'));
      return [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice];
    }
  }
};

/**
 *
 * @param {string} param
 * @param {boolean} skip
 * @this {IntlURLSearchParams}
 * @returns {string}
 */
function _prepareParam(param, skip) {
  if (skip || !this.localizeParamNames) {
    // (lang)
    return param;
  }

  // start, end, toggle
  const endNums = /\d+(-\d+)?$/; // eslint-disable-line unicorn/no-unsafe-regex
  const indexed = param.match(endNums);
  if (indexed) {
    // Todo: We could i18nize numbers as well
    return this.l10n(['params', 'indexed', param.replace(endNums, '')]) + indexed[0];
  }
  return this.l10n(['params', param]);
}
class IntlURLSearchParams {
  constructor({
    l10n,
    params
  } = {}) {
    this.l10n = l10n;
    if (!params) {
      params = location.hash.slice(1);
    }
    if (typeof params === 'string') {
      params = new URLSearchParams(params);
    }
    this.params = params;
  }
  get(param, skip) {
    return this.params.get(_prepareParam.call(this, param, skip));
  }
  getAll(param, skip) {
    return this.params.getAll(_prepareParam.call(this, param, skip));
  }
  has(param, skip) {
    return this.params.has(_prepareParam.call(this, param, skip));
  }
  delete(param, skip) {
    return this.params.delete(_prepareParam.call(this, param, skip));
  }
  set(param, value, skip) {
    return this.params.set(_prepareParam.call(this, param, skip), value);
  }
  append(param, value, skip) {
    return this.params.append(_prepareParam.call(this, param, skip), value);
  }
  toString() {
    return this.params.toString();
  }
}

/* eslint-env browser */
async function workSelect({
  files,
  lang,
  fallbackLanguages,
  $p,
  followParams
  /* , l, defineFormatter */
}) {
  // We use getJSON instead of JsonRefs as we do not necessarily need to
  //    resolve the file contents here
  try {
    const works = await getJSON(files);
    const localizationStrings = works['localization-strings'];
    const metadataObjs = await getJSON(works.groups.reduce((arr, fileGroup) => {
      const metadataBaseDir = (works.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';
      return fileGroup.files.reduce((ar, fileData) => [...ar, metadataBaseDir + fileData.metadataFile], arr);
    }, []));
    const workI18n = await i18n({
      messageStyle: 'plainNested',
      locales: lang,
      defaultLocales: fallbackLanguages,
      // Todo: Could at least share this with `index.js`
      localeStringFinder({
        locales,
        defaultLocales
      }) {
        const locale = [...locales, ...defaultLocales].find(language => {
          return language in localizationStrings;
        });
        return {
          locale,
          strings: {
            head: {},
            body: localizationStrings[locale]
          }
        };
      }
    });
    document.title = workI18n('browserfile-workselect');
    /*
    // Would need adapting now that not using IMF
    function lDirectional (key, substitutions, formats) {
      return workI18n(
        key, substitutions,
        formats,
        fallback: ({message}) =>
          // Displaying as div with inline display instead of span since
          //    Firefox puts punctuation at left otherwise
          ['div', {
              style: 'display: inline;direction: ' + fallbackDirection
          }, [message]]
      });
    }
    */

    const metadataObjsIter = metadataObjs[Symbol.iterator]();
    const getNextAlias = () => {
      const metadataObj = metadataObjsIter.next().value;
      return getMetaProp(lang, metadataObj, 'alias');
    };
    Templates.workSelect({
      groups: works.groups,
      workI18n,
      getNextAlias,
      $p,
      followParams
    });
  } catch (err) {
    console.log('Error', err);
    dialogs.alert(err);
  }
}

/* eslint-env browser */
const replaceHash = paramsCopy => {
  return location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
};
const getSerializeParamsAsURL = function (...args) {
  const setter = getParamsSetter(...args);
  return function (...innerArgs) {
    const paramsCopy = setter(...innerArgs);
    return replaceHash(paramsCopy);
  };
};
const getParamsSetter = function ({
  l,
  lParam,
  $p
}) {
  return function ({
    form,
    random = {
      checked: false
    },
    checkboxes,
    type,
    fieldAliasOrNames = [],
    workName
  }) {
    const paramsCopy = new URLSearchParams($p.params);
    const formParamsHash = serialize(form, {
      hash: true,
      empty: true
    });
    Object.keys(formParamsHash).forEach(key => {
      paramsCopy.set(key, formParamsHash[key]);
    });

    // Follow the same style (and order) for checkboxes
    paramsCopy.delete(lParam('rand'));
    paramsCopy.set(lParam('rand'), random.checked ? l('yes') : l('no'));

    // We want checkboxes to typically show by default, so we cannot use the
    //    standard serialization
    checkboxes.forEach(checkbox => {
      // Let's ensure the checked items are all together (at the end)
      paramsCopy.delete(checkbox.name);
      if (checkbox.name) {
        // We don't want, e.g., preference controls added to URL
        paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
      }
    });

    /**
         *
         * @returns {void}
         */
    function removeStartsEndsAndAnchors() {
      let num = 1;
      let num2 = 1;
      while (paramsCopy.has(`${workName}-start${num}-${num2}`, true)) {
        while (paramsCopy.has(`${workName}-start${num}-${num2}`, true)) {
          paramsCopy.delete(`${workName}-start${num}-${num2}`, true);
          paramsCopy.delete(`${workName}-end${num}-${num2}`, true);
          paramsCopy.delete(`${workName}-anchor${num}-${num2}`, true);
          num2++;
        }
        num2 = 1;
        num++;
      }
    }
    switch (type) {
      case 'saveSettings':
        {
          // In case it was added previously on
          //    this page, let's remove it.
          paramsCopy.delete(lParam('rand'));
          break;
        }
      case 'shortcutResult':
        {
          paramsCopy.delete(lParam('rand'));
          let num = 1;
          while (paramsCopy.has(`anchorfield${num}`, true)) {
            paramsCopy.delete(`anchorfield${num}`, true);
            num++;
          }
          removeStartsEndsAndAnchors();
          num = 1;
          // Delete field-specific so we can add our own
          while (paramsCopy.has(`field${num}`, true)) {
            paramsCopy.delete(`field${num}`, true);
            paramsCopy.delete(`checked${num}`, true);
            paramsCopy.delete(`interlin${num}`, true);
            paramsCopy.delete(`css${num}`, true);
            num++;
          }
          fieldAliasOrNames.forEach((fieldAliasOrName, i) => {
            paramsCopy.set(`field${i + 1}`, fieldAliasOrName, true);
            // Todo: Restrict by content locale?
            paramsCopy.set(`checked${i + 1}`, l('yes'), true);
            paramsCopy.set(`interlin${i + 1}`, '');
            paramsCopy.set(`css${i + 1}`, '');
          });
          paramsCopy.delete('work', true);
        }
      // Fallthrough
      case 'startEndResult':
      case 'randomResult':
      case 'result':
        {
          if (type === 'startEndResult') {
            removeStartsEndsAndAnchors();
          }
          // In case it was added previously on this page,
          //    let's put random again toward the end.
          if (type === 'randomResult' || random.checked) {
            paramsCopy.delete(lParam('rand'));
            paramsCopy.set(lParam('rand'), l('yes'));
          }
          paramsCopy.set(lParam('result'), l('yes'));
          break;
        }
      default:
        {
          console.error('Unexpected type', type);
        }
    }
    return paramsCopy;
  };
};

const _excluded = ["workI18n", "fileData", "metadataObj"];
async function workDisplay({
  l,
  languageParam,
  lang,
  preferredLocale,
  languages,
  fallbackLanguages,
  $p
}) {
  const {
    preferencesPlugin
  } = this;
  const langs = this.langData.languages;
  const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);
  const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
  const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
  const hideFormattingSection = $p.has('formatting', true) ? $p.get('formatting', true) === '0' : prefFormatting === 'true' || prefFormatting !== 'false' && this.hideFormattingSection;
  async function _displayWork({
    workI18n,
    metadataObj,
    getFieldAliasOrName,
    schemaObj,
    schemaItems,
    fieldInfo,
    metadata,
    pluginsForWork,
    groupsToWorks
  }) {
    const lParam = localizeParamNames ? key => l(['params', key]) : key => key;
    const lIndexedParam = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;

    // Returns element with localized option text (as Jamilih), with
    //   optional fallback direction
    const lElement = (key, el, attToLocalize, atts, children = []) => {
      atts[attToLocalize] = l(key
      // Restore this if `intl-dom` supports
      // fallback ({message}) {
      //   atts.dir = fallbackDirection;
      //   return message;
      // }
      );

      return [el, atts, children];
    };

    // Returns plain text node or element (as Jamilih) with fallback direction
    const lDirectional = (key, substitutions) => l(key, substitutions
    // formats
    // Restore if `intl-dom` supports
    // fallback: ({message}) =>
    //   Templates.workDisplay.bdo({fallbackDirection, message})
    );

    const fieldMatchesLocale = metadata.getFieldMatchesLocale({
      namespace: this.namespace,
      preferredLocale,
      schemaItems,
      pluginsForWork
    });
    const content = [];
    this.getBrowseFieldData({
      metadataObj,
      schemaItems,
      getFieldAliasOrName,
      callback({
        browseFields,
        i
      }) {
        Templates.workDisplay.addBrowseFields({
          browseFields,
          fieldInfo,
          lDirectional,
          i,
          lIndexedParam,
          $p,
          content
        });
      }
    });

    /*
      Templates.workDisplay.addRandomFormFields({
          lParam, l, lDirectional, lElement, $p, serializeParamsAsURL, content
      });
    */
    const serializeParamsAsURL = getSerializeParamsAsURL({
      l,
      lParam,
      $p
    });
    const paramsSetter = getParamsSetter({
      l,
      lParam,
      $p
    });
    const {
      groups
    } = await getJSON(this.files);

    // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
    const heading = getMetaProp(lang, metadataObj, 'heading');
    const getFieldAliasOrNames = (() => {
      // Avoid blocking but start now
      // Let this run in the background to avoid blocking
      const all = Promise.all(groupsToWorks.map(async ({
        name,
        workNames,
        shortcuts
      }) => {
        const worksToFields = await Promise.all(workNames.map(async (workName, i) => {
          return {
            workName,
            shortcut: shortcuts[i],
            fieldAliasOrNames: (await this.getWorkData({
              lang,
              fallbackLanguages,
              preferredLocale,
              languages,
              work: workName
            })).fieldInfo.map(({
              fieldAliasOrName
            }) => fieldAliasOrName)
          };
        }));
        return {
          groupName: name,
          worksToFields
        };
      }));
      return async () => {
        return all; // May not be finished by now
      };
    })();

    const displayNames = new Intl.DisplayNames([...lang, ...fallbackLanguages], {
      type: 'language',
      // Dialect: "American English"
      // Standard: "English (United States)"
      languageDisplay: 'standard' // 'dialect'
    });

    const languageI18n = code => {
      return displayNames.of(code);
    };
    Templates.workDisplay.main({
      languageParam,
      lang,
      workI18n,
      l,
      namespace: this.namespace,
      groups,
      heading,
      languageI18n,
      fallbackDirection,
      langs,
      fieldInfo,
      localizeParamNames,
      serializeParamsAsURL,
      paramsSetter,
      replaceHash,
      getFieldAliasOrNames,
      hideFormattingSection,
      $p,
      metadataObj,
      lParam,
      lElement,
      lDirectional,
      lIndexedParam,
      fieldMatchesLocale,
      preferredLocale,
      schemaItems,
      content,
      preferencesPlugin
    });
  }
  try {
    const _await$this$getWorkDa = await this.getWorkData({
        lang,
        fallbackLanguages,
        preferredLocale,
        languages,
        work: $p.get('work')
      }),
      {
        workI18n,
        fileData,
        metadataObj
      } = _await$this$getWorkDa,
      args = _objectWithoutProperties(_await$this$getWorkDa, _excluded);
    document.title = workI18n('browserfile-workdisplay', {
      work: fileData ? getMetaProp(lang, metadataObj, 'alias') : ''
    });
    await _displayWork.call(this, _objectSpread2$1({
      workI18n,
      metadataObj
    }, args));
  } catch (err) {
    console.log('err', err);
    dialogs.alert(err);
  }
}

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var self$1;
var RtlDetectLib = self$1 = {
  // eslint-disable-line consistent-this
  // Private vars - star
  _regexEscape: /([\.\*\+\^\$\[\]\\\(\)\|\{\}\,\-\:\?])/g,
  // eslint-disable-line no-useless-escape
  _regexParseLocale: /^([a-zA-Z]*)([_\-a-zA-Z]*)$/,
  // Private vars - end

  // Private functions - star
  _escapeRegExpPattern: function (str) {
    if (typeof str !== 'string') {
      return str;
    }
    return str.replace(self$1._regexEscape, '\\$1');
  },
  _toLowerCase: function (str, reserveReturnValue) {
    if (typeof str !== 'string') {
      return reserveReturnValue && str;
    }
    return str.toLowerCase();
  },
  _toUpperCase: function (str, reserveReturnValue) {
    if (typeof str !== 'string') {
      return reserveReturnValue && str;
    }
    return str.toUpperCase();
  },
  _trim: function (str, delimiter, reserveReturnValue) {
    var patterns = [];
    var regexp;
    var addPatterns = function (pattern) {
      // Build trim RegExp pattern and push it to patterns array
      patterns.push('^' + pattern + '+|' + pattern + '+$');
    };

    // fix reserveReturnValue value
    if (typeof delimiter === 'boolean') {
      reserveReturnValue = delimiter;
      delimiter = null;
    }
    if (typeof str !== 'string') {
      return reserveReturnValue && str;
    }

    // Trim based on delimiter array values
    if (Array.isArray(delimiter)) {
      // Loop through delimiter array
      delimiter.map(function (item) {
        // Escape delimiter to be valid RegExp Pattern
        var pattern = self$1._escapeRegExpPattern(item);
        // Push pattern to patterns array
        addPatterns(pattern);
      });
    }

    // Trim based on delimiter string value
    if (typeof delimiter === 'string') {
      // Escape delimiter to be valid RegExp Pattern
      var patternDelimiter = self$1._escapeRegExpPattern(delimiter);
      // push pattern to patterns array
      addPatterns(patternDelimiter);
    }

    // If delimiter  is not defined, Trim white spaces
    if (!delimiter) {
      // Push white space pattern to patterns array
      addPatterns('\\s');
    }

    // Build RegExp pattern
    var pattern = '(' + patterns.join('|') + ')';
    // Build RegExp object
    regexp = new RegExp(pattern, 'g');

    // trim string for all patterns
    while (str.match(regexp)) {
      str = str.replace(regexp, '');
    }

    // Return trim string
    return str;
  },
  _parseLocale: function (strLocale) {
    var matches = self$1._regexParseLocale.exec(strLocale); // exec regex
    var parsedLocale;
    var lang;
    var countryCode;
    if (!strLocale || !matches) {
      return;
    }

    // fix countryCode string by trimming '-' and '_'
    matches[2] = self$1._trim(matches[2], ['-', '_']);
    lang = self$1._toLowerCase(matches[1]);
    countryCode = self$1._toUpperCase(matches[2]) || countryCode;

    // object with lang, countryCode properties
    parsedLocale = {
      lang: lang,
      countryCode: countryCode
    };

    // return parsed locale object
    return parsedLocale;
  },
  // Private functions - End

  // Public functions - star
  isRtlLang: function (strLocale) {
    var objLocale = self$1._parseLocale(strLocale);
    if (!objLocale) {
      return;
    }
    // return true if the intel string lang exists in the BID RTL LANGS array else return false
    return self$1._BIDI_RTL_LANGS.indexOf(objLocale.lang) >= 0;
  },
  getLangDir: function (strLocale) {
    // return 'rtl' if the intel string lang exists in the BID RTL LANGS array else return 'ltr'
    return self$1.isRtlLang(strLocale) ? 'rtl' : 'ltr';
  }

  // Public functions - End
};

// Const BIDI_RTL_LANGS Array
// BIDI_RTL_LANGS ref: http://en.wikipedia.org/wiki/Right-to-left
// Table of scripts in Unicode: https://en.wikipedia.org/wiki/Script_(Unicode)
Object.defineProperty(self$1, '_BIDI_RTL_LANGS', {
  value: ['ae', /* Avestan */
  'ar', /* 'العربية', Arabic */
  'arc', /* Aramaic */
  'bcc', /* 'بلوچی مکرانی', Southern Balochi */
  'bqi', /* 'بختياري', Bakthiari */
  'ckb', /* 'Soranî / کوردی', Sorani */
  'dv', /* Dhivehi */
  'fa', /* 'فارسی', Persian */
  'glk', /* 'گیلکی', Gilaki */
  'he', /* 'עברית', Hebrew */
  'ku', /* 'Kurdî / كوردی', Kurdish */
  'mzn', /* 'مازِرونی', Mazanderani */
  'nqo', /* N'Ko */
  'pnb', /* 'پنجابی', Western Punjabi */
  'ps', /* 'پښتو', Pashto, */
  'sd', /* 'سنڌي', Sindhi */
  'ug', /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
  'ur', /* 'اردو', Urdu */
  'yi' /* 'ייִדיש', Yiddish */],

  writable: false,
  enumerable: true,
  configurable: false
});
var rtlDetect$1 = RtlDetectLib;

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var rtlDetect = rtlDetect$1;
var rtlDetect_1 = {
  isRtlLang: rtlDetect.isRtlLang,
  getLangDir: rtlDetect.getLangDir
};

// Keep this as the last import for Rollup

const {
  getLangDir
} = rtlDetect_1;
const fieldValueAliasRegex = /^.* \((.*?)\)$/;
const getRawFieldValue = v => {
  return typeof v === 'string' ? v.replace(fieldValueAliasRegex, '$1') : v;
};
const setAnchor = ({
  applicableBrowseFieldSet,
  fieldValueAliasMapPreferred,
  lParamRaw,
  lIndexedParam,
  max,
  $p
}) => {
  const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map(abfs => {
    return abfs.fieldSchemaIndex;
  });
  // Check if user added this (e.g., even to end of URL with
  //   other anchor params)
  const work = $p.get('work');
  let anchor;
  const anchorRowCol = lParamRaw('anchorrowcol');
  if (anchorRowCol) {
    anchor = Templates.resultsDisplayClient.anchorRowCol({
      anchorRowCol
    });
  }
  if (!anchor) {
    const anchors = [];
    let anchorField = '';
    for (let i = 1, breakout; !breakout && !anchors.length; i++) {
      for (let j = 1;; j++) {
        const anchorText = work + '-' + 'anchor' + i + '-' + j;
        const anchor = $p.get(anchorText, true);
        if (!anchor) {
          if (i === max ||
          // No more field sets to check
          anchors.length // Already had anchors found
          ) {
            breakout = true;
          }
          break;
        }
        anchorField = $p.get(lIndexedParam('anchorfield') + i, true);
        const x = applicableBrowseFieldSchemaIndexes[j - 1];
        const rawVal = getRawFieldValue(anchor);
        const raw = fieldValueAliasMapPreferred[x] && fieldValueAliasMapPreferred[x][rawVal];
        anchors.push(raw || anchor);
        // anchors.push({anchorText, anchor});
      }
    }

    if (anchors.length) {
      const escapeSelectorAttValue = str => (str || '').replace(/["\\]/g, '\\$&');
      const escapedRow = escapeSelectorAttValue(anchors.join('-'));
      const escapedCol = anchorField ? escapeSelectorAttValue(anchorField) : undefined;
      anchor = Templates.resultsDisplayClient.anchors({
        escapedRow,
        escapedCol
      });
    }
  }
  if (anchor) {
    anchor.scrollIntoView();
  }
};
const resultsDisplayClient = async function resultsDisplayClient(args) {
  const persistent = await navigator.storage.persisted();
  const skipIndexedDB = this.skipIndexedDB || !persistent || !navigator.serviceWorker.controller;
  const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
  const {
    fieldInfo,
    $p,
    browseFieldSets,
    applicableBrowseFieldSet,
    lang,
    metadataObj,
    fileData,
    fieldValueAliasMapPreferred,
    workI18n,
    lIndexedParam,
    lParamRaw,
    templateArgs
  } = await resultsDisplayServerOrClient.call(this, _objectSpread2$1(_objectSpread2$1({}, args), {}, {
    skipIndexedDB,
    prefI18n
  }));
  document.title = workI18n('browserfile-resultsdisplay', {
    work: fileData ? getMetaProp(lang, metadataObj, 'alias') : ''
  });
  Templates.resultsDisplayClient.main(templateArgs);
  setAnchor({
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred,
    lIndexedParam,
    lParamRaw,
    $p: args.$p,
    max: browseFieldSets.length
  });
  fieldInfo.forEach(({
    plugin,
    applicableField,
    meta,
    j
  }) => {
    if (!plugin) {
      return;
    }
    if (plugin.done) {
      plugin.done({
        $p,
        applicableField,
        meta,
        j,
        thisObj: this
      });
    }
  });
};
const resultsDisplayServerOrClient = async function resultsDisplayServerOrClient({
  l,
  lang,
  fallbackLanguages,
  locales,
  $p,
  skipIndexedDB,
  noIndexedDB,
  prefI18n,
  files,
  allowPlugins,
  langData,
  basePath = '',
  dynamicBasePath = ''
}) {
  const languages = new Languages({
    langData
  });
  const getCellValue = ({
    fieldValueAliasMapPreferred,
    escapeColumnIndexes
  }) => ({
    tr,
    idx
  }) => {
    let tdVal = fieldValueAliasMapPreferred[idx] !== undefined ? fieldValueAliasMapPreferred[idx][tr[idx]] : tr[idx];
    if (tdVal && typeof tdVal === 'object') {
      tdVal = Object.values(tdVal);
    }
    if (Array.isArray(tdVal)) {
      tdVal = tdVal.join(l('comma-space'));
    }
    return (escapeColumnIndexes[idx] || !this.trustFormatHTML) && typeof tdVal === 'string' ? {
      tdVal: escapeHTML(tdVal),
      htmlEscaped: true
    } : {
      tdVal
    };
  };
  const getCanonicalID = ({
    fieldValueAliasMap,
    fieldValueAliasMapPreferred,
    localizedFieldNames,
    canonicalBrowseFieldNames
  }) => ({
    tr,
    foundState
  }) => {
    return canonicalBrowseFieldNames.map(fieldName => {
      const idx = localizedFieldNames.indexOf(fieldName);
      // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book); we may wish to
      //   switch this (and also for other browse field-based
      //   items).
      if (fieldValueAliasMap[idx] !== undefined &&
      // Added this condition after imf->intl-dom conversion; concealing a
      //   bug?
      fieldValueAliasMap[idx] !== null) {
        return fieldValueAliasMapPreferred[idx][tr[idx]];
      }
      return tr[idx];
    }).join('-'); // rowID;
  };

  const determineEnd = ({
    fieldValueAliasMap,
    fieldValueAliasMapPreferred,
    localizedFieldNames,
    applicableBrowseFieldNames,
    startsRaw,
    endsRaw
  }) => ({
    tr,
    foundState
  }) => {
    const rowIDPartsPreferred = [];
    const rowIDParts = applicableBrowseFieldNames.map(fieldName => {
      const idx = localizedFieldNames.indexOf(fieldName);
      // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book), and there could
      //   be multiple aliases for a value; we may wish to
      //   switch this (and also for other browse field-based
      //   items).
      if (fieldValueAliasMap[idx] !== undefined &&
      // Added this condition after imf->intl-dom conversion; concealing a
      //   bug?
      fieldValueAliasMap[idx] !== null) {
        rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
      } else {
        rowIDPartsPreferred.push(tr[idx]);
      }
      return tr[idx];
    });

    // Todo: Use schema to determine field type and use `Number.parseInt`
    //   on other value instead of `String` conversions
    if (!foundState.start) {
      if (startsRaw.some((part, i) => {
        const rowIDPart = rowIDParts[i];
        return part !== rowIDPart;
      })) {
        // Trigger skip of this row
        return false;
      }
      foundState.start = true;
    }
    // This doesn't go in an `else` for the above in case the start is the end
    if (endsRaw.every((part, i) => {
      const rowIDPart = rowIDParts[i];
      return part === rowIDPart;
    })) {
      foundState.end = true;
    } else if (foundState.end) {
      // If no longer matching, trigger end of the table
      return true;
    }
    return rowIDPartsPreferred.join('-'); // rowID;
  };

  const getCheckedAndInterlinearFieldInfo = ({
    localizedFieldNames
  }) => {
    let i = 1;
    let field, checked;
    let checkedFields = [];
    do {
      field = $p.get('field' + i, true);
      checked = $p.get('checked' + i, true);
      i++;
      if (field && (checked === l('yes') || checked === null // Default to "on"
      )) {
        checkedFields.push(field);
      }
    } while (field);
    checkedFields = checkedFields.filter(cf => localizedFieldNames.includes(cf));
    const checkedFieldIndexes = checkedFields.map(cf => localizedFieldNames.indexOf(cf));
    const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
      const interlin = $p.get('interlin' + (cfi + 1), true);
      return interlin && interlin.split(/\s*,\s*/).map(col =>
      // Todo: Avoid this when known to be integer or if string, though allow
      //    string to be treated as number if config is set.
      Number.parseInt(col) - 1).filter(n => !Number.isNaN(n));
    });
    return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
  };
  const getCaption = ({
    starts,
    ends,
    applicableBrowseFieldNames,
    heading
  }) => {
    let caption;
    const hasCaption = $pRaw('caption') !== '0';
    if (hasCaption) {
      /*
            // Works but displays in parentheses browse fields which
            //  may be non-applicable
            const buildRangePoint = (startOrEnd) => escapeHTML(
                browseFieldSets.reduce((txt, bfs, i) =>
                    (txt ? txt + ' (' : '') + bfs.map((bf, j) =>
                        (j > 0 ? l('comma-space') : '') + bf + ' ' +
                            $pRaw(startOrEnd + (i + 1) + '-' + (j + 1))
                    ).join('') + (txt ? ')' : ''), '')
            );
            */
      /*
            // Works but overly long
            const buildRangePoint = (startOrEnd) => escapeHTML(
                applicableBrowseFieldSet.map((bf, j) =>
                    (j > 0 ? l('comma-space') : '') + bf + ' ' +
                        $pRaw(startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1))
                ).join('')
            );
            */
      const startSep = Templates.resultsDisplayServerOrClient.startSeparator({
        l
      });
      const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient.innerBrowseFieldSeparator({
        l
      });
      const buildRanges = () => {
        const endVals = [];
        const startRange = starts.reduce((str, startFieldValue, i) => {
          const ret = str + startFieldValue;
          if (startFieldValue === ends[i]) {
            // We abbreviate as start/end share same Book, etc.
            return ret + (i > 0 ? innerBrowseFieldSeparator // e.g., for "Genesis 7, 5-8"
            : ' ' // e.g., for 2nd space in "Surah 2 5-8"
            );
          }

          endVals.push(ends[i]);
          return ret + startSep;
        }, '').slice(0, -startSep.length);
        const rangeNames = applicableBrowseFieldNames.join(innerBrowseFieldSeparator);
        return escapeHTML(Templates.resultsDisplayServerOrClient.ranges({
          l,
          startRange,
          endVals,
          rangeNames
        }));
      };
      const ranges = buildRanges();
      caption = Templates.resultsDisplayServerOrClient.caption({
        heading,
        ranges
      });
    }
    return [hasCaption, caption];
  };
  const runPresort = ({
    presort,
    tableData,
    applicableBrowseFieldNames,
    localizedFieldNames
  }) => {
    // Todo: Ought to be checking against an aliased table
    if (presort) {
      tableData.sort((rowA, rowB) => {
        let precedence;
        applicableBrowseFieldNames.some(fieldName => {
          const idx = localizedFieldNames.indexOf(fieldName);
          const rowAFirst = rowA[idx] < rowB[idx];
          const rowBFirst = rowA[idx] > rowB[idx];
          precedence = rowBFirst ? 1 : -1;
          return rowAFirst || rowBFirst; // Keep going if 0
        });

        return precedence;
      });
    }
  };
  const getFieldValueAliasMap = ({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias
  }) => {
    return fieldInfo.map(({
      field,
      plugin
    }) => {
      if (plugin) {
        return undefined;
      }
      const {
        preferAlias,
        fieldValueAliasMap
      } = getFieldNameAndValueAliases({
        field,
        schemaItems,
        metadataObj,
        getFieldAliasOrName,
        lang
      });
      if (!usePreferAlias) {
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }
      if (fieldValueAliasMap) {
        Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            fieldValueAliasMap[key] = val.map(value => Templates.resultsDisplayServerOrClient.fieldValueAlias({
              key,
              value
            }));
            return;
          }
          if (val && typeof val === 'object') {
            if (typeof preferAlias === 'string') {
              fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                key,
                value: val[preferAlias]
              });
            } else {
              Object.entries(val).forEach(([k, value]) => {
                fieldValueAliasMap[key][k] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                  key,
                  value
                });
              });
            }
            return;
          }
          fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
            key,
            value: val
          });
        });
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }
      return undefined;
    });
  };
  const $pRaw = (param, avoidLog) => {
    // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)
    let key;
    const p = $p.get(param, true);
    /**
         *
         * @param {GenericArray|PlainObject} locale
         * @returns {boolean}
         */
    function reverseLocaleLookup(locale) {
      if (Array.isArray(locale)) {
        return locale.some(reverseLocaleLookup);
      }
      const localeValues = Object.values(locale);
      return localeValues.some((val, i) => {
        if (typeof val !== 'string') {
          return reverseLocaleLookup(val);
        }
        if (val === p) {
          key = Object.keys(locale)[i];
          return true;
        }
        return false;
      });
    }
    reverseLocaleLookup(locales);
    if (!key && !avoidLog) {
      console.log('Bad param/value', param, '::', p);
    }
    return key; // || p; // $p.get(param, true);
  };

  const escapeCSS = escapeHTML;
  const $pRawEsc = param => escapeHTML($pRaw(param));
  const $pEscArbitrary = param => escapeHTML($p.get(param, true));

  // Not currently in use
  const escapeQuotedCSS = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const {
    fileData,
    workI18n,
    getFieldAliasOrName,
    schemaObj,
    metadataObj,
    pluginsForWork
  } = await getWorkData({
    files: files || this.files,
    allowPlugins: typeof allowPlugins === 'boolean' ? allowPlugins : this.allowPlugins,
    lang,
    fallbackLanguages,
    work: $p.get('work'),
    basePath
  });
  console.log('pluginsForWork', pluginsForWork);
  const heading = getMetaProp(lang, metadataObj, 'heading');
  const schemaItems = schemaObj.items.items;
  const setNames = [];
  const presorts = [];
  const browseFieldSets = [];
  getBrowseFieldData({
    metadataObj,
    schemaItems,
    getFieldAliasOrName,
    lang,
    callback({
      setName,
      browseFields,
      presort
    }) {
      setNames.push(setName);
      presorts.push(presort);
      browseFieldSets.push(browseFields);
    }
  });
  const fieldInfo = schemaItems.map(({
    title: field,
    format
  }) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field,
      escapeColumn: format !== 'html',
      fieldLang: metadataObj.fields[field].lang
    };
  });
  const [preferredLocale] = lang;
  const metadata = new Metadata({
    metadataObj
  });
  if (pluginsForWork) {
    console.log('pluginsForWork', pluginsForWork);
    const {
      lang
    } = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      plugin,
      pluginName,
      pluginLang,
      onByDefaultDefault,
      placement,
      applicableFields,
      meta
    }) => {
      placement = placement === 'end' ? Number.POSITIVE_INFINITY // push
      : placement;
      const processField = ({
        applicableField,
        targetLanguage,
        onByDefault,
        metaApplicableField
      } = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(applicableField);
        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            applicableField,
            targetLanguage,
            // Default lang for plug-in (from files.json)
            pluginLang,
            // Default lang when no target language or
            //   plugin lang; using the lang of the applicable
            //   field
            applicableFieldLang
          });
        }
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName ? plugin.getFieldAliasOrName({
          locales: lang,
          workI18n,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          workI18n,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice(
        // Todo: Allow default placement overriding for
        //    non-plugins
        placement, 0, {
          plugin,
          meta,
          placement,
          // field: `${this.namespace}-plugin-${field}`,
          fieldAliasOrName,
          escapeColumn: plugin.escapeColumn !== false,
          // Plug-in specific (todo: allow specifying
          //    for non-plugins)
          onByDefault: typeof onByDefault === 'boolean' ? onByDefault : onByDefaultDefault || false,
          // Three conventions for use by plug-ins but
          //     textbrowser only passes on (might
          //     not need here)
          applicableField,
          metaApplicableField,
          fieldLang: targetLanguage
        });
      };
      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }
  const localizedFieldNames = fieldInfo.map(fi => fi.fieldAliasOrName);
  const escapeColumnIndexes = fieldInfo.map(fi => fi.escapeColumn);
  const fieldLangs = fieldInfo.map(({
    fieldLang
  }) => {
    return fieldLang !== preferredLocale ? fieldLang : null;
  });
  const fieldValueAliasMap = getFieldValueAliasMap({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias: false
  });
  const fieldValueAliasMapPreferred = getFieldValueAliasMap({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias: true
  });

  // Todo: Repeats some code in workDisplay; probably need to reuse
  //   these functions more in `Templates.resultsDisplayServerOrClient` too
  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
  const lParam = localizeParamNames ? key => l(['params', key]) : key => key;
  const lIndexedParam = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;
  const lParamRaw = localizeParamNames ? (key, suffix = '') => $p.get(lParam(key) + suffix, true) : (key, suffix = '') => $p.get(key + suffix, true);
  const lIndexedParamRaw = localizeParamNames ? (key, suffix = '') => $p.get($p.get('work') + '-' + lIndexedParam(key) + suffix, true) : (key, suffix = '') => $p.get($p.get('work') + '-' + key + suffix, true);

  // Now that we know `browseFieldSets`, we can parse `startEnd`
  const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) => lIndexedParamRaw('startEnd', i + 1));
  if (browseFieldSetStartEndIdx !== -1) {
    // Todo: i18nize (by work and/or by whole app?)
    const rangeSep = '-';
    const partSep = ':';

    // Search box functionality (Todo: not yet in UI); should first
    //    avoid numeric startEnd and even work across book
    // Todo: At least avoid need for book text AND book number in Bible
    // Todo: Change query beginning at 0 to 1 if none present?
    // Todo: Support i18nized or canonical aliases (but don't
    //         over-trim in such cases)
    const rawSearch = (lIndexedParamRaw('startEnd', browseFieldSetStartEndIdx + 1) || '').trim();
    const [startFull, endFull] = rawSearch.split(rangeSep);
    if (endFull !== undefined) {
      const startPartVals = startFull.split(partSep);
      const endPartVals = endFull.split(partSep);
      const startEndDiff = startPartVals.length - endPartVals.length;
      if (startEndDiff > 0) {
        // e.g., 5:42:7 - 8 only gets verses 7-8
        endPartVals.unshift(...startPartVals.slice(0, startEndDiff));
      } else if (startEndDiff < 0) {
        // e.g., 5 - 6:2:1 gets all of book 5 to 6:2:1
        // Todo: We should fill with '0' but since that often
        //    doesn't find anything, we default for now to '1'.
        startPartVals.push(...Array.from({
          length: -startEndDiff
        }).fill('1'));
      }
      console.log('startPartVals', startPartVals);
      console.log('endPartVals', endPartVals);
      startPartVals.forEach((startPartVal, i) => {
        const endPartVal = endPartVals[i];
        $p.set(`${$p.get('work')}-start${browseFieldSetStartEndIdx + 1}-${i + 1}`, startPartVal, true);
        $p.set(`${$p.get('work')}-end${browseFieldSetStartEndIdx + 1}-${i + 1}`, endPartVal, true);
      });
    }
  }
  const browseFieldSetIdx = browseFieldSets.findIndex((item, i) => lIndexedParamRaw('start', i + 1 + '-1'));
  const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
  const applicableBrowseFieldSetName = setNames[browseFieldSetIdx];
  const applicableBrowseFieldNames = applicableBrowseFieldSet.map(abfs => abfs.fieldName);
  const canonicalBrowseFieldSet = browseFieldSets[0];
  const canonicalBrowseFieldSetName = setNames[0];
  const canonicalBrowseFieldNames = canonicalBrowseFieldSet.map(abfs => abfs.fieldName);
  const fieldSchemaTypes = applicableBrowseFieldSet.map(abfs => abfs.fieldSchema.type);
  const buildRangePoint = startOrEnd => applicableBrowseFieldNames.map((bfn, j) => $p.get($p.get('work') + '-' + startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1), true));
  const starts = buildRangePoint('start');
  const ends = buildRangePoint('end');
  const [hasCaption, caption] = getCaption({
    starts,
    ends,
    applicableBrowseFieldNames,
    heading
  });
  const showInterlinTitles = $pRaw('interlintitle') === '1';
  console.log('rand', lParamRaw('rand') === 'yes');
  const stripToRawFieldValue = (v, i) => {
    let val;
    if (/^\d+$/.test(v) || fieldValueAliasRegex.test(v)) {
      val = getRawFieldValue(v);
    } else {
      const {
        rawFieldValueAliasMap
      } = applicableBrowseFieldSet[i];
      let dealiased;
      if (rawFieldValueAliasMap) {
        // Look to dealias
        const fvEntries = Object.entries(rawFieldValueAliasMap);
        if (Array.isArray(fvEntries[0][1])) {
          fvEntries.some(([key, arr]) => {
            if (arr.includes(v)) {
              dealiased = key;
              return true;
            }
            return false;
          });
        } else {
          fvEntries.some(([key, obj]) => {
            const arr = Object.values(obj);
            if (arr.includes(v)) {
              dealiased = key;
              return true;
            }
            return false;
          });
        }
      }
      val = dealiased === undefined ? v : dealiased;
    }
    return fieldSchemaTypes[i] === 'integer' ? Number.parseInt(val) : val;
  };
  const unlocalizedWorkName = fileData.name;
  const startsRaw = starts.map(stripToRawFieldValue);
  const endsRaw = ends.map(stripToRawFieldValue);
  let tableData,
    usingServerData = false;
  // Site owner may have configured to skip (e.g., testing)
  if (!skipIndexedDB &&
  // User may have refused, not yet agreed, or are visiting the
  //   results page directly where we don't ask for the permissions
  //   needed for persistent IndexedDB currently so that people can
  //   be brought to a results page without needing to agree to persist
  //   through notifications (or however)
  !noIndexedDB) {
    tableData = await new Promise((resolve, reject) => {
      // Todo: Fetch the work in code based on the non-localized `datafileName`
      const dbName = this.namespace + '-textbrowser-cache-data';
      const req = indexedDB.open(dbName);
      req.onsuccess = ({
        target: {
          result: db
        }
      }) => {
        const storeName = 'files-to-cache-' + unlocalizedWorkName;
        const trans = db.transaction(storeName);
        const store = trans.objectStore(storeName);
        // Get among browse field sets by index number within URL params
        const index = store.index('browseFields-' + applicableBrowseFieldSetName);

        // console.log('dbName', dbName);
        // console.log('storeName', storeName);
        // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

        const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));
        r.onsuccess = ({
          target: {
            result
          }
        }) => {
          const converted = result.map(r => r.value);
          resolve(converted);
        };
      };
    });
  } else {
    // No need for presorting in indexedDB, given indexes
    const presort = presorts[browseFieldSetIdx];
    // Given that we are not currently wishing to add complexity to
    //   our PHP code (though it is not a problem with Node.js),
    //   we retrieve the whole file and then sort where presorting is
    //   needed
    // if (presort || this.noDynamic) {
    if (this.noDynamic) {
      ({
        resolved: {
          data: tableData
        }
      } = await JsonRefs.resolveRefs(fileData.file));
      runPresort({
        presort,
        tableData,
        applicableBrowseFieldNames,
        localizedFieldNames
      });
    } else {
      /*
            const jsonURL = Object.entries({
                prefI18n, unlocalizedWorkName, startsRaw, endsRaw
            }).reduce((url, [arg, argVal]) => {
                return url + '&' + arg + '=' + encodeURIComponent((argVal));
            }, `${dynamicBasePath}textbrowser?`);
            */
      const jsonURL = `${dynamicBasePath}textbrowser?${$p.toString()}`;
      tableData = await (await fetch(jsonURL)).json();
      usingServerData = true;
    }
  }
  if (!usingServerData && pluginsForWork) {
    fieldInfo.forEach(({
      plugin,
      placement
    }, j) => {
      if (!plugin) {
        return;
      }
      tableData.forEach((tr, i) => {
        // Todo: We should pass on other arguments (like `meta` but on `applicableFields`)
        tr.splice(placement, 0, null // `${i}-${j}`);
        );
      });
    });

    fieldInfo.forEach(({
      plugin,
      applicableField,
      fieldLang,
      meta,
      metaApplicableField
    }, j) => {
      if (!plugin) {
        return;
      }
      const applicableFieldIdx = fieldInfo.findIndex(({
        field
      }) => {
        return field === applicableField;
      });
      // Now safe to pass (and set) `j` value as tr array expanded
      tableData.forEach((tr, i) => {
        const applicableFieldText = tr[applicableFieldIdx];
        tr[j] = plugin.getCellData && plugin.getCellData({
          tr,
          tableData,
          i,
          j,
          applicableField,
          fieldInfo,
          applicableFieldIdx,
          applicableFieldText,
          fieldLang,
          getLangDir,
          meta,
          metaApplicableField,
          $p,
          thisObj: this
        }) || applicableFieldText;
      });
      console.log('applicableFieldIdx', applicableFieldIdx);
    });
  }
  const localeDir = getLangDir(preferredLocale);
  const fieldDirs = fieldLangs.map(langCode => {
    if (!langCode) {
      return null;
    }
    const langDir = getLangDir(langCode);
    return langDir !== localeDir ? langDir : null;
  });
  const templateArgs = {
    tableData,
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    escapeQuotedCSS,
    escapeCSS,
    escapeHTML,
    l,
    localizedFieldNames,
    fieldLangs,
    fieldDirs,
    caption,
    hasCaption,
    showInterlinTitles,
    determineEnd: determineEnd({
      applicableBrowseFieldNames,
      fieldValueAliasMap,
      fieldValueAliasMapPreferred,
      localizedFieldNames,
      startsRaw,
      endsRaw
    }),
    canonicalBrowseFieldSetName,
    getCanonicalID: getCanonicalID({
      canonicalBrowseFieldNames,
      fieldValueAliasMap,
      fieldValueAliasMapPreferred,
      localizedFieldNames
    }),
    getCellValue: getCellValue({
      fieldValueAliasMapPreferred,
      escapeColumnIndexes,
      escapeHTML
    }),
    checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
      localizedFieldNames
    }),
    interlinearSeparator: this.interlinearSeparator
  };
  return {
    fieldInfo,
    $p,
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred,
    workI18n,
    lIndexedParam,
    lParamRaw,
    browseFieldSets,
    lang,
    metadataObj,
    fileData,
    templateArgs
  };
};

/* eslint-enable no-unused-vars */

/**
 *
 * @returns {Promise<void>}
 */
async function prepareForServiceWorker() {
  try {
    // Todo: No possible resolving after this point? (except
    //          to reload or if worker somehow active already)
    Templates.permissions.addLogEntry({
      text: 'Worker registration: Beginning...'
    });
    const persistent = await navigator.storage.persist();
    if (!persistent) {
      Templates.permissions.browserNotGrantingPersistence();
      return;
    }
    /*
        Templates.permissions.addLogEntry({
            text: 'Install: received work files'
        });
        */
    await registerServiceWorker({
      serviceWorkerPath: this.serviceWorkerPath,
      logger: Templates.permissions
    });
  } catch (err) {
    console.log('err', err);
    if (err && typeof err === 'object') {
      const {
        errorType
      } = err;
      if (errorType === 'versionChange') {
        Templates.permissions.versionChange();
        return;
      }
    }
    Templates.permissions.errorRegistering(escapeHTML(err && err.message));
  }
}

/**
* @typedef {PlainObject} Langs
* @property {string} code
* @property {string} direction
* @property {PlainObject} locale
*/

/**
 *
 * @param {Langs} langs
 * @param {Logger} l
 * @returns {Promise<void>}
 */
async function requestPermissions(langs, l) {
  return await new Promise((resolve, reject) => {
    // Todo: We could run the dialog code below for every page if
    //    `Notification.permission === 'default'` (i.e., not choice
    //    yet made by user), but user may avoid denying with intent
    //    of seeing how it goes. But for users who come directly to
    //    the work or results page, the slow performance will be
    //    unexplained so probably better to force a decision.
    const ok = async () => {
      // Notification request to be directly in response to user action for Chrome
      const permissionStatus = await Notification.requestPermission();
      requestPermissionsDialog.close(permissionStatus);
    };
    const refuse = () => {
      requestPermissionsDialog.close();
    };
    const closeBrowserNotGranting = () => {
      browserNotGrantingPersistenceAlert.close();
    };
    const close = async () => {
      /**
       *
       * @returns {void}
       */
      function rememberRefusal() {
        // Todo: We could go forward with worker, caching files, and
        //    indexedDB regardless of permissions, but this way
        //    we can continue to gauge performance differences for now
        localStorage.setItem(this.namespace + '-refused', 'true');
      }
      try {
        if (!requestPermissionsDialog.returnValue) {
          rememberRefusal();
          return;
        }
      } catch (err) {
        console.log('err', err);
        Templates.permissions.errorRegistering(escapeHTML(err && err.message));
      }

      // denied|default|granted
      switch (requestPermissionsDialog.returnValue) {
        case 'denied':
          // User may not want notifications but may look into another way
          //   to persist (e.g., adding to bookmark), so we don't remember
          //   the refusal unless they refuse in *our* dialog
          // rememberRefusal();
          resolve();
          return;
        // eslint-disable-next-line sonarjs/no-duplicated-branches
        case 'default':
          resolve();
          return;
        case 'granted':
          if (navigator.serviceWorker.controller) {
            resolve();
            return;
          }
          // Has own error-handling
          await prepareForServiceWorker.call(this);
          break;
        default:
          console.error('Unexpected returnValue', requestPermissionsDialog.returnValue);
          break;
      }
    };
    const [, requestPermissionsDialog, browserNotGrantingPersistenceAlert] =
    // , errorRegisteringNotice
    Templates.permissions.main({
      l,
      ok,
      refuse,
      close,
      closeBrowserNotGranting
    });
    requestPermissionsDialog.showModal();
  });
}
class TextBrowser {
  constructor(options) {
    // Todo: Replace the `languages` default with `import.meta.url`
    //  (`new URL('../appdata/languages.json', import.meta.url).href`?)
    //  https://github.com/tc39/proposal-import-meta
    const moduleURL = new URL('node_modules/textbrowser/resources/index.js', location);
    this.site = options.site || 'site.json';
    const stylesheets = options.stylesheets || ['@builtin'];
    const builtinIndex = stylesheets.indexOf('@builtin');
    if (builtinIndex !== -1) {
      stylesheets.splice(builtinIndex, 1, new URL('index.css', moduleURL).href);
    }
    this.stylesheets = stylesheets;
    setServiceWorkerDefaults(this, options);
    this.allowPlugins = options.allowPlugins;
    this.dynamicBasePath = options.dynamicBasePath;
    this.trustFormatHTML = options.trustFormatHTML;
    this.requestPersistentStorage = options.requestPersistentStorage;
    this.localizeParamNames = options.localizeParamNames === undefined ? true : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.preferencesPlugin = options.preferencesPlugin;
    this.interlinearSeparator = options.interlinearSeparator;
    // Todo: Make these user facing options
    this.showEmptyInterlinear = options.showEmptyInterlinear;
    this.showTitleOnSingleInterlinear = options.showTitleOnSingleInterlinear;
    this.noDynamic = options.noDynamic;
    this.skipIndexedDB = options.skipIndexedDB;
  }
  async init() {
    this._stylesheetElements = await loadStylesheets(this.stylesheets);
    return this.displayLanguages();
  }
  async displayLanguages() {
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    try {
      const [langData, siteData] = await getJSON([this.languages, this.site]);
      this.langData = langData;
      this.siteData = siteData;
      const p = this.paramChange();

      // INIT/ADD EVENTS
      // With `hashchange` more generic than `popstate`, we use it
      //  and just check `history.state`
      window.addEventListener('hashchange', () => this.paramChange());
      return p;
    } catch (err) {
      console.log('err', err);
      dialogs.alert(err);
    }
  }
  getWorkData(opts) {
    try {
      return getWorkData.call(this, _objectSpread2$1(_objectSpread2$1({}, opts), {}, {
        files: this.files,
        allowPlugins: this.allowPlugins
      }));
    } catch (err) {
      console.log('err', err);
      dialogs.alert('catch:' + err);
    }
  }

  // Need for directionality even if language specified (and we don't want
  //   to require it as a param)
  // Todo: Use rtl-detect (already included)
  getDirectionForLanguageCode(code) {
    const langs = this.langData.languages;
    const exactMatch = langs.find(lang => {
      return lang.code === code;
    });
    return exactMatch && exactMatch.direction || langs.find(lang => {
      return lang.code.startsWith(code + '-');
    });
  }
  getFieldNameAndValueAliases(args) {
    return getFieldNameAndValueAliases(_objectSpread2$1(_objectSpread2$1({}, args), {}, {
      lang: this.lang
    }));
  }
  getBrowseFieldData(args) {
    return getBrowseFieldData(_objectSpread2$1(_objectSpread2$1({}, args), {}, {
      lang: this.lang
    }));
  }
  async paramChange() {
    Templates.defaultBody();

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = typeof history.state === 'string' ? new IntlURLSearchParams({
      params: history.state
    }) : new IntlURLSearchParams(); // Uses URL hash for params

    const followParams = (formSelector, cb) => {
      const form = document.querySelector(formSelector);
      // Record current URL along with state
      const url = location.href.replace(/#.*$/, '') + '#' + $p.toString();
      history.replaceState(serialize(form, {
        hash: true,
        empty: true
      }), document.title, url);
      // Get and set new state within URL
      // eslint-disable-next-line n/callback-return
      cb();
      location.hash = '#' + $p.toString();
    };
    const languages = new Languages({
      langData: this.langData
    });
    const {
      lang,
      langs,
      languageParam,
      fallbackLanguages
    } = languages.getLanguageInfo({
      $p
    });
    this.lang = lang;
    const [preferredLocale] = lang;
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    document.documentElement.lang = preferredLocale;
    document.dir = direction;
    const localizationStrings = this.siteData['localization-strings'];
    const siteI18n = await i18n({
      messageStyle: 'plainNested',
      locales: lang,
      defaultLocales: fallbackLanguages,
      localeStringFinder({
        locales,
        defaultLocales
      }) {
        const locale = [...locales, ...defaultLocales].find(language => {
          return language in localizationStrings;
        });
        return {
          locale,
          strings: {
            head: {},
            body: localizationStrings[locale]
          }
        };
      }
    });

    // Even if individual pages may end up changing, we need a
    //   title now for accessibility
    document.title = siteI18n('browser-title');
    const refusedIndexedDB =
    // User may have persistence via bookmarks, etc. but just not
    //     want commital on notification
    // Notification.permission === 'default' ||
    // We always expect a controller, so is probably first visit
    localStorage.getItem(this.namespace + '-refused');

    // This check goes further than `Notification.permission === 'granted'`
    //   to see whether the browser actually considers the notification
    //   sufficient to grant persistence (as it is supposed to do).

    // Todo: For now, we won't give opportunity to store offline on
    //    results page. We could add a small button to open a dialog,
    //    but then it'd show up in each results window, making it less
    //    embed-friendly. Probably best to implement
    //    navigation bar/breadcrumbs, with option on work display page on
    //    whether to show or not; also ensure we have navigation
    //    bar/breadcrumbs on all non-results pages
    const persistent = await navigator.storage.persisted();
    const r = await navigator.serviceWorker.getRegistration(this.serviceWorkerPath);
    const result = $p.get('result');
    const register = async () => {
      /*
      console.log(
          'navigator.serviceWorker.controller',
          navigator.serviceWorker.controller
      );
      */
      if (result) {
        return;
      }
      const tryRegistrationOrPersistence = !refusedIndexedDB && (
      // Not show if refused before
      !navigator.serviceWorker.controller ||
      // This is `null` on a force-refresh too
      !persistent);
      if (tryRegistrationOrPersistence) {
        // Note: In Chrome on 127.0.0.1 (but not localhost!),
        //        this always appears to be `true`, despite having
        //        no notifications enabled or bookmarking 127.0.0.1,
        //        or being on the main page per
        //        https://developers.google.com/web/updates/2016/06/persistent-storage
        if (persistent) {
          // No need to ask permissions (e.g., if user bookmarked site instead),
          //   but we do need a worker
          Templates.permissions.main({
            siteI18n
          });
          await prepareForServiceWorker.call(this);
        } else {
          // Keep asking if not persistent (unless refused)
          await requestPermissions.call(this, langs, siteI18n);
        }
        Templates.permissions.exitDialogs();
      }
    };

    /*
        try {
            // Waits indefinitely without rejecting until active worker
            const {active} = await navigator.serviceWorker.ready;
        } catch (err) {
        }
    */
    /*
        // Present normally if activated, but will be `null` if force-reload
        const {controller} = navigator.serviceWorker;
    */

    if (!r) {
      await register();
    } else {
      const worker = r.installing || r.waiting || r.active;
      if (!worker) {
        // Todo: Why wouldn't there be a worker here?
        console.error('Unexpected error: worker registration received without a worker.');
        // If anything, would probably need to register though
        await register();
        return;
      }
      Templates.permissions.main({
        siteI18n
      });

      // "The browser checks for updates automatically after navigations and
      //  functional events, but you can also trigger them manually"
      //  -- https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates
      const hourly = 60 * 60 * 1000;
      setInterval(() => {
        r.update();
      }, hourly);
      console.log('worker.state', worker.state);
      const respondToStateOfWorker = async () => {
        try {
          return respondToState({
            r,
            langs,
            languages: this.languages,
            logger: Templates.permissions
          });
        } catch (err) {
          console.log('err', err);
          // Todo: We could auto-reload if we tracked whether this
          //   error occurs immediately upon attempting registration or
          //   not, but probably would occur after some time
          return dialogs.alert(`
        There was an unexpected error activating the new version;
        please save any unfinished work, close this tab, and try
        opening this site again.

        Please contact a service administrator if the problem
        persists (Error type: worker activation).
        `);
        }
      };
      switch (worker.state) {
        case 'installing':
          // If it fails, will instead be `redundant`; but will try again:
          //     1. automatically (?) per https://developers.google.com/web/fundamentals/primers/service-workers/#the_service_worker_life_cycle
          //     2. upon reattempting registration (?) per https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
          // Supply file paths in case not completed and no
          //    other tabs open to do so (assuming this is possible)
          // Will use `r.installing`
          // We don't await the fulfillment of this promise
          respondToStateOfWorker();
          listenForWorkerUpdate({
            r,
            logger: {
              addLogEntry(s) {
                // We don't put the log in the page as user using
                console.log(s);
              }
            }
          });
          // Don't return as user may continue working until installed (though
          //    will get message to close tab)
          break;
        case 'installed':
          // Waiting ensures only one version of our service worker active
          // No dedicated "waiting" state so handle here
          // Will use `r.waiting`
          // Show dialog that currently waiting for old tabs (and
          //         this one) to close so install can proceed
          // Wait for activation to begin and then push as in activating
          await respondToStateOfWorker();
          break;
        // Now fetching will be beyond first service worker and not yet with first
        case 'activating':
          // May be called more than once in case fails?
          // May not be activated but only activating so pass in
          //   callback in case no other tabs open to do so (assuming
          //   this is possible)
          // Will use `r.active`
          await dialogs.alert(`
    Please wait for a short while as we work to update to a new version.
    `);
          respondToStateOfWorker();
          navigator.serviceWorker.onmessage({
            data: 'finishActivate'
          });
          // finishActivate({r, logger, namespace, files});
          return;
        case 'activated':
          // Will use `r.active`
          // We should be able to use the following to distinguish when
          //    active but force-reloaded (will be `null` unlike `r.active` apparently)
          // const {controller} = navigator.serviceWorker;
          // Todo: Prevent from getting here as we should handle this differently
          // May need to pass in arguments if new service worker appears and
          //    it needs arguments for update
          listenForWorkerUpdate({
            r,
            logger: {
              addLogEntry(s) {
                // We don't put the log in the page as user using
                console.log(s);
              }
            }
          });
          break;
        case 'redundant':
          // Either:
          // 1. A new service worker is replacing the current service worker (though
          //    presumably only if `skipWaiting`)
          // 2. The current service worker is being discarded due to an install failure
          // May have been `r.installing` (?)
          // Todo: Could try registering again later (this will reload after an alert)
          await respondToStateOfWorker();
          return;
        default:
          console.log('Unexpected worker.state', worker.state);
          break;
      }
    }
    Templates.permissions.exitDialogs();
    if (!languageParam) {
      // Also could use siteI18n('chooselanguage'), but assumes locale
      //   as with page title
      // $p.l10n = siteI18n; // Is this in use? No `params`, so not currently
      document.title = siteI18n('languages-title');
      Templates.languageSelect.main({
        langs,
        languages,
        followParams,
        $p
      });
      return;
    }
    const l = await getLocaleFallbackResults({
      $p,
      lang,
      langs,
      langData: this.langData,
      fallbackLanguages
    });
    const localeCallback = () => {
      this.l10n = l;
      $p.l10n = l;
      const work = $p.get('work');
      if (!work) {
        workSelect({
          // l,
          files: this.files,
          lang,
          fallbackLanguages,
          $p,
          followParams
        });
        return true;
      }
      if (!result) {
        this.workDisplay({
          l,
          lang,
          preferredLocale,
          fallbackLanguages,
          languageParam,
          $p,
          languages,
          preferencesPlugin: this.preferencesPlugin
        });
        return true;
      }
      return false;
    };
    if (localeCallback()) {
      return;
    }
    const resultsDisplay = async () => {
      const noIndexedDB = refusedIndexedDB ||
      // No worker from which IndexedDB is available;
      !navigator.serviceWorker.controller;
      return await this.resultsDisplayClient({
        langData: this.langData,
        l,
        lang,
        fallbackLanguages,
        locales: l.strings,
        $p,
        basePath: '',
        noIndexedDB,
        dynamicBasePath: this.dynamicBasePath,
        files: this.files,
        allowPlugins: this.allowPlugins
      });
    };
    return await resultsDisplay();
  }
}

// Todo: Definable as public fields?
TextBrowser.prototype.workDisplay = workDisplay;
TextBrowser.prototype.resultsDisplayClient = resultsDisplayClient;
TextBrowser.prototype.getWorkFiles = getWorkFiles;

export { TextBrowser as default };
