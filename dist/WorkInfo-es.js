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

  return path.slice( // https://github.com/bcoe/c8/issues/135

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

function _invoke(body, then) {
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
    return _invoke(function () {
      if (/^https?:/u.test(jsonURL)) {
        return _invoke(function () {
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
      return _exit ? _result : _invoke(function () {
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
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
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
      _match2 = _slicedToArray(_match, 2),
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
    onMatch.apply(void 0, _toConsumableArray(match));
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
  var placeholderArray = _toConsumableArray(arrayOfItems).map(function (_, i) {
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
      var _object = _slicedToArray(object, 4),
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
    var _object2 = _slicedToArray(object, 3),
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
  if (typeof value === 'string' || value && _typeof(value) === 'object' && 'nodeType' in value) {
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
        _arg$split2 = _slicedToArray(_arg$split, 3),
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
  if (value && _typeof(value) === 'object' && !Array.isArray(value)) {
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
          }))).formatRange.apply(_Intl$DateTimeFormat, _toConsumableArray([value, opts].map(function (val) {
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
    if (_typeof(value) === 'object' && typeof value.getTime === 'function') {
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
    }))).formatRange.apply(_Intl$DateTimeFormat2, _toConsumableArray(value.slice(0, 2).map(function (val) {
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
        _this$getMatch2 = _slicedToArray(_this$getMatch, 3),
        objKey = _this$getMatch2[0],
        body = _this$getMatch2[1],
        keySegment = _this$getMatch2[2];
      usedKeys.push(keySegment);
      var type, opts;
      if (objKey && objKey.includes('|')) {
        var _objKey$split = objKey.split('|');
        var _objKey$split2 = _slicedToArray(_objKey$split, 3);
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
      } else if (formatterValue && _typeof(formatterValue) === 'object') {
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
          var _ref5 = _slicedToArray(_ref4, 1),
            switchKey = _ref5[0];
          return k === _this4.constructor.getKey(switchKey);
        });
        return ret ? [].concat(_toConsumableArray(ret), [k]) : [];
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
      var _ref3 = _slicedToArray(_ref2, 2),
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
        returnsDOM = returnsDOM || substitution && _typeof(substitution) === 'object' && 'nodeType' in substitution;
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
            push.apply(void 0, _toConsumableArray(substitution));
          } else if (
          // Clone so that multiple instances may be added (and no
          // side effects to user code)
          substitution && _typeof(substitution) === 'object' && 'nodeType' in substitution) {
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
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;
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
      if (!currObj || _typeof(currObj) !== 'object') {
        return true;
      }
      if (
      // If specified key is too deep, we should fail
      i === kys.length - 1 && ky in currObj && currObj[ky] && _typeof(currObj[ky]) === 'object' && 'message' in currObj[ky] &&
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
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && _typeof(obj[key]) === 'object' && 'message' in obj[key] &&
    // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
    typeof obj[key].message === 'string') {
      return {
        value: obj[key].message,
        info: obj[key]
      };
    }
    return false;
  } : messageStyle === 'plain' ? function (mainObj, key) {
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && typeof obj[key] === 'string') {
      return {
        value: obj[key]
      };
    }
    return false;
  } : messageStyle === 'plainNested' ? function (mainObj, key) {
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;
    if (obj && _typeof(obj) === 'object') {
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
  } else if (defaults && _typeof(defaults) === 'object') {
    str = messageForKey({
      body: defaults
    }, key);
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
  container.append.apply(container, _toConsumableArray(nodes));
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
  return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)), getLocale, 'No matching locale found!');
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
  if (!strings || _typeof(strings) !== 'object') {
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
  } catch (e) {
    return Promise.reject(e);
  }
};

/* eslint-env browser */
// Todo: remember this locales choice by cookie?
const getPreferredLanguages = ({namespace, preferredLocale}) => {
  // Todo: Add to this optionally with one-off tag input box
  // Todo: Switch to fallbackLanguages so can default to
  //    navigator.languages?
  const langCodes = localStorage.getItem(namespace + '-langCodes');
  const lngs = (langCodes && JSON.parse(langCodes)) || [preferredLocale];
  const langArr = [];
  lngs.forEach((lng) => {
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

var JsonRefs=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=20)}([function(t,e,n){var r;try{r=n(7);}catch(t){}r||(r=window._),t.exports=r;},function(t,e,n){var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r=function(){return this}();try{r=r||new Function("return this")();}catch(t){"object"===("undefined"==typeof window?"undefined":o(window))&&(r=window);}t.exports=r;},function(t,e,n){var r,o,i=t.exports={};function u(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(t){if(r===setTimeout)return setTimeout(t,0);if((r===u||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:u;}catch(t){r=u;}try{o="function"==typeof clearTimeout?clearTimeout:s;}catch(t){o=s;}}();var c,f=[],l=!1,p=-1;function h(){l&&c&&(l=!1,c.length?f=c.concat(f):p=-1,f.length&&d());}function d(){if(!l){var t=a(h);l=!0;for(var e=f.length;e;){for(c=f,f=[];++p<e;)c&&c[p].run();p=-1,e=f.length;}c=null,l=!1,function(t){if(o===clearTimeout)return clearTimeout(t);if((o===s||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(t);try{o(t);}catch(e){try{return o.call(null,t)}catch(e){return o.call(this,t)}}}(t);}}function v(t,e){this.fun=t,this.array=e;}function y(){}i.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];f.push(new v(t,e)),1!==f.length||l||a(d);},v.prototype.run=function(){this.fun.apply(null,this.array);},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=y,i.addListener=y,i.once=y,i.off=y,i.removeListener=y,i.removeAllListeners=y,i.emit=y,i.prependListener=y,i.prependOnceListener=y,i.listeners=function(t){return []},i.binding=function(t){throw new Error("process.binding is not supported")},i.cwd=function(){return "/"},i.chdir=function(t){throw new Error("process.chdir is not supported")},i.umask=function(){return 0};},function(t,e){(function(e){t.exports=e;}).call(this,{});},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.SCHEMES=void 0,e.pctEncChar=c,e.pctDecChars=f,e.parse=d,e.removeDotSegments=m,e.serialize=b,e.resolveComponents=w,e.resolve=function(t,e,n){return b(w(d(t,n),d(e,n),n,!0),n)},e.normalize=function(t,e){"string"==typeof t?t=b(d(t,e),e):"object"===(0, u.typeOf)(t)&&(t=d(b(t,e),e));return t},e.equal=function(t,e,n){"string"==typeof t?t=b(d(t,n),n):"object"===(0, u.typeOf)(t)&&(t=b(t,n));"string"==typeof e?e=b(d(e,n),n):"object"===(0, u.typeOf)(e)&&(e=b(e,n));return t===e},e.escapeComponent=function(t,e){return t&&t.toString().replace(e&&e.iri?o.default.ESCAPE:r.default.ESCAPE,c)},e.unescapeComponent=function(t,e){return t&&t.toString().replace(e&&e.iri?o.default.PCT_ENCODED:r.default.PCT_ENCODED,f)};var r=s(n(17)),o=s(n(50)),i=s(n(18)),u=n(6);function s(t){return t&&t.__esModule?t:{default:t}}var a=e.SCHEMES={};function c(t){var e=t.charCodeAt(0);return e<16?"%0"+e.toString(16).toUpperCase():e<128?"%"+e.toString(16).toUpperCase():e<2048?"%"+(e>>6|192).toString(16).toUpperCase()+"%"+(63&e|128).toString(16).toUpperCase():"%"+(e>>12|224).toString(16).toUpperCase()+"%"+(e>>6&63|128).toString(16).toUpperCase()+"%"+(63&e|128).toString(16).toUpperCase()}function f(t){for(var e="",n=0,r=t.length;n<r;){var o=parseInt(t.substr(n+1,2),16);if(o<128)e+=String.fromCharCode(o),n+=3;else if(o>=194&&o<224){if(r-n>=6){var i=parseInt(t.substr(n+4,2),16);e+=String.fromCharCode((31&o)<<6|63&i);}else e+=t.substr(n,6);n+=6;}else if(o>=224){if(r-n>=9){var u=parseInt(t.substr(n+4,2),16),s=parseInt(t.substr(n+7,2),16);e+=String.fromCharCode((15&o)<<12|(63&u)<<6|63&s);}else e+=t.substr(n,9);n+=9;}else e+=t.substr(n,3),n+=3;}return e}function l(t,e){function n(t){var n=f(t);return n.match(e.UNRESERVED)?n:t}return t.scheme&&(t.scheme=String(t.scheme).replace(e.PCT_ENCODED,n).toLowerCase().replace(e.NOT_SCHEME,"")),void 0!==t.userinfo&&(t.userinfo=String(t.userinfo).replace(e.PCT_ENCODED,n).replace(e.NOT_USERINFO,c).replace(e.PCT_ENCODED,u.toUpperCase)),void 0!==t.host&&(t.host=String(t.host).replace(e.PCT_ENCODED,n).toLowerCase().replace(e.NOT_HOST,c).replace(e.PCT_ENCODED,u.toUpperCase)),void 0!==t.path&&(t.path=String(t.path).replace(e.PCT_ENCODED,n).replace(t.scheme?e.NOT_PATH:e.NOT_PATH_NOSCHEME,c).replace(e.PCT_ENCODED,u.toUpperCase)),void 0!==t.query&&(t.query=String(t.query).replace(e.PCT_ENCODED,n).replace(e.NOT_QUERY,c).replace(e.PCT_ENCODED,u.toUpperCase)),void 0!==t.fragment&&(t.fragment=String(t.fragment).replace(e.PCT_ENCODED,n).replace(e.NOT_FRAGMENT,c).replace(e.PCT_ENCODED,u.toUpperCase)),t}var p=/^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[\dA-F:.]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,h=void 0==="".match(/(){0}/)[1];function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={},u=!1!==e.iri?o.default:r.default;"suffix"===e.reference&&(t=(e.scheme?e.scheme+":":"")+"//"+t);var s=t.match(p);if(s){h?(n.scheme=s[1],n.userinfo=s[3],n.host=s[4],n.port=parseInt(s[5],10),n.path=s[6]||"",n.query=s[7],n.fragment=s[8],isNaN(n.port)&&(n.port=s[5])):(n.scheme=s[1]||void 0,n.userinfo=-1!==t.indexOf("@")?s[3]:void 0,n.host=-1!==t.indexOf("//")?s[4]:void 0,n.port=parseInt(s[5],10),n.path=s[6]||"",n.query=-1!==t.indexOf("?")?s[7]:void 0,n.fragment=-1!==t.indexOf("#")?s[8]:void 0,isNaN(n.port)&&(n.port=t.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/)?s[4]:void 0)),n.host&&(n.host=n.host.replace(u.IPV6ADDRESS,"$1")),void 0!==n.scheme||void 0!==n.userinfo||void 0!==n.host||void 0!==n.port||n.path||void 0!==n.query?void 0===n.scheme?n.reference="relative":void 0===n.fragment?n.reference="absolute":n.reference="uri":n.reference="same-document",e.reference&&"suffix"!==e.reference&&e.reference!==n.reference&&(n.error=n.error||"URI is not a "+e.reference+" reference.");var c=a[(e.scheme||n.scheme||"").toLowerCase()];if(e.unicodeSupport||c&&c.unicodeSupport)l(n,u);else {if(n.host&&(e.domainHost||c&&c.domainHost))try{n.host=i.default.toASCII(n.host.replace(u.PCT_ENCODED,f).toLowerCase());}catch(t){n.error=n.error||"Host's domain name can not be converted to ASCII via punycode: "+t;}l(n,r.default);}c&&c.parse&&c.parse(n,e);}else n.error=n.error||"URI can not be parsed.";return n}var v=/^\.\.?\//,y=/^\/\.(\/|$)/,_=/^\/\.\.(\/|$)/,g=/^\/?(?:.|\n)*?(?=\/|$)/;function m(t){for(var e=[];t.length;)if(t.match(v))t=t.replace(v,"");else if(t.match(y))t=t.replace(y,"/");else if(t.match(_))t=t.replace(_,"/"),e.pop();else if("."===t||".."===t)t="";else {var n=t.match(g);if(!n)throw new Error("Unexpected dot segment condition");var r=n[0];t=t.slice(r.length),e.push(r);}return e.join("")}function b(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.iri?o.default:r.default,u=[],s=a[(e.scheme||t.scheme||"").toLowerCase()];if(s&&s.serialize&&s.serialize(t,e),t.host)if(n.IPV6ADDRESS.test(t.host));else if(e.domainHost||s&&s.domainHost)try{t.host=e.iri?i.default.toUnicode(t.host):i.default.toASCII(t.host.replace(n.PCT_ENCODED,f).toLowerCase());}catch(n){t.error=t.error||"Host's domain name can not be converted to "+(e.iri?"Unicode":"ASCII")+" via punycode: "+n;}l(t,n),"suffix"!==e.reference&&t.scheme&&(u.push(t.scheme),u.push(":"));var c=function(t,e){var n=!1!==e.iri?o.default:r.default,i=[];return void 0!==t.userinfo&&(i.push(t.userinfo),i.push("@")),void 0!==t.host&&i.push(String(t.host).replace(n.IPV6ADDRESS,"[$1]")),"number"==typeof t.port&&(i.push(":"),i.push(t.port.toString(10))),i.length?i.join(""):void 0}(t,e);if(void 0!==c&&("suffix"!==e.reference&&u.push("//"),u.push(c),t.path&&"/"!==t.path.charAt(0)&&u.push("/")),void 0!==t.path){var p=t.path;e.absolutePath||s&&s.absolutePath||(p=m(p)),void 0===c&&(p=p.replace(/^\/\//,"/%2F")),u.push(p);}return void 0!==t.query&&(u.push("?"),u.push(t.query)),void 0!==t.fragment&&(u.push("#"),u.push(t.fragment)),u.join("")}function w(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},r={};return arguments[3]||(t=d(b(t,n),n),e=d(b(e,n),n)),!(n=n||{}).tolerant&&e.scheme?(r.scheme=e.scheme,r.userinfo=e.userinfo,r.host=e.host,r.port=e.port,r.path=m(e.path||""),r.query=e.query):(void 0!==e.userinfo||void 0!==e.host||void 0!==e.port?(r.userinfo=e.userinfo,r.host=e.host,r.port=e.port,r.path=m(e.path||""),r.query=e.query):(e.path?("/"===e.path.charAt(0)?r.path=m(e.path):(void 0===t.userinfo&&void 0===t.host&&void 0===t.port||t.path?t.path?r.path=t.path.slice(0,t.path.lastIndexOf("/")+1)+e.path:r.path=e.path:r.path="/"+e.path,r.path=m(r.path)),r.query=e.query):(r.path=t.path,void 0!==e.query?r.query=e.query:r.query=t.query),r.userinfo=t.userinfo,r.host=t.host,r.port=t.port),r.scheme=t.scheme),r.fragment=e.fragment,r}},function(t,e,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=n(0);t.exports=a;var i="\0",u="\0",s="";function a(t){this._isDirected=!o.has(t,"directed")||t.directed,this._isMultigraph=!!o.has(t,"multigraph")&&t.multigraph,this._isCompound=!!o.has(t,"compound")&&t.compound,this._label=void 0,this._defaultNodeLabelFn=o.constant(void 0),this._defaultEdgeLabelFn=o.constant(void 0),this._nodes={},this._isCompound&&(this._parent={},this._children={},this._children[u]={}),this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={};}function c(t,e){t[e]?t[e]++:t[e]=1;}function f(t,e){--t[e]||delete t[e];}function l(t,e,n,r){var u=""+e,a=""+n;if(!t&&u>a){var c=u;u=a,a=c;}return u+s+a+s+(o.isUndefined(r)?i:r)}function p(t,e){return l(t,e.v,e.w,e.name)}a.prototype._nodeCount=0,a.prototype._edgeCount=0,a.prototype.isDirected=function(){return this._isDirected},a.prototype.isMultigraph=function(){return this._isMultigraph},a.prototype.isCompound=function(){return this._isCompound},a.prototype.setGraph=function(t){return this._label=t,this},a.prototype.graph=function(){return this._label},a.prototype.setDefaultNodeLabel=function(t){return o.isFunction(t)||(t=o.constant(t)),this._defaultNodeLabelFn=t,this},a.prototype.nodeCount=function(){return this._nodeCount},a.prototype.nodes=function(){return o.keys(this._nodes)},a.prototype.sources=function(){var t=this;return o.filter(this.nodes(),function(e){return o.isEmpty(t._in[e])})},a.prototype.sinks=function(){var t=this;return o.filter(this.nodes(),function(e){return o.isEmpty(t._out[e])})},a.prototype.setNodes=function(t,e){var n=arguments,r=this;return o.each(t,function(t){n.length>1?r.setNode(t,e):r.setNode(t);}),this},a.prototype.setNode=function(t,e){return o.has(this._nodes,t)?(arguments.length>1&&(this._nodes[t]=e),this):(this._nodes[t]=arguments.length>1?e:this._defaultNodeLabelFn(t),this._isCompound&&(this._parent[t]=u,this._children[t]={},this._children[u][t]=!0),this._in[t]={},this._preds[t]={},this._out[t]={},this._sucs[t]={},++this._nodeCount,this)},a.prototype.node=function(t){return this._nodes[t]},a.prototype.hasNode=function(t){return o.has(this._nodes,t)},a.prototype.removeNode=function(t){var e=this;if(o.has(this._nodes,t)){var n=function(t){e.removeEdge(e._edgeObjs[t]);};delete this._nodes[t],this._isCompound&&(this._removeFromParentsChildList(t),delete this._parent[t],o.each(this.children(t),function(t){e.setParent(t);}),delete this._children[t]),o.each(o.keys(this._in[t]),n),delete this._in[t],delete this._preds[t],o.each(o.keys(this._out[t]),n),delete this._out[t],delete this._sucs[t],--this._nodeCount;}return this},a.prototype.setParent=function(t,e){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(o.isUndefined(e))e=u;else {for(var n=e+="";!o.isUndefined(n);n=this.parent(n))if(n===t)throw new Error("Setting "+e+" as parent of "+t+" would create a cycle");this.setNode(e);}return this.setNode(t),this._removeFromParentsChildList(t),this._parent[t]=e,this._children[e][t]=!0,this},a.prototype._removeFromParentsChildList=function(t){delete this._children[this._parent[t]][t];},a.prototype.parent=function(t){if(this._isCompound){var e=this._parent[t];if(e!==u)return e}},a.prototype.children=function(t){if(o.isUndefined(t)&&(t=u),this._isCompound){var e=this._children[t];if(e)return o.keys(e)}else {if(t===u)return this.nodes();if(this.hasNode(t))return []}},a.prototype.predecessors=function(t){var e=this._preds[t];if(e)return o.keys(e)},a.prototype.successors=function(t){var e=this._sucs[t];if(e)return o.keys(e)},a.prototype.neighbors=function(t){var e=this.predecessors(t);if(e)return o.union(e,this.successors(t))},a.prototype.isLeaf=function(t){return 0===(this.isDirected()?this.successors(t):this.neighbors(t)).length},a.prototype.filterNodes=function(t){var e=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});e.setGraph(this.graph());var n=this;o.each(this._nodes,function(n,r){t(r)&&e.setNode(r,n);}),o.each(this._edgeObjs,function(t){e.hasNode(t.v)&&e.hasNode(t.w)&&e.setEdge(t,n.edge(t));});var r={};return this._isCompound&&o.each(e.nodes(),function(t){e.setParent(t,function t(o){var i=n.parent(o);return void 0===i||e.hasNode(i)?(r[o]=i,i):i in r?r[i]:t(i)}(t));}),e},a.prototype.setDefaultEdgeLabel=function(t){return o.isFunction(t)||(t=o.constant(t)),this._defaultEdgeLabelFn=t,this},a.prototype.edgeCount=function(){return this._edgeCount},a.prototype.edges=function(){return o.values(this._edgeObjs)},a.prototype.setPath=function(t,e){var n=this,r=arguments;return o.reduce(t,function(t,o){return r.length>1?n.setEdge(t,o,e):n.setEdge(t,o),o}),this},a.prototype.setEdge=function(){var t,e,n,i,u=!1,s=arguments[0];"object"===(void 0===s?"undefined":r(s))&&null!==s&&"v"in s?(t=s.v,e=s.w,n=s.name,2===arguments.length&&(i=arguments[1],u=!0)):(t=s,e=arguments[1],n=arguments[3],arguments.length>2&&(i=arguments[2],u=!0)),t=""+t,e=""+e,o.isUndefined(n)||(n=""+n);var a=l(this._isDirected,t,e,n);if(o.has(this._edgeLabels,a))return u&&(this._edgeLabels[a]=i),this;if(!o.isUndefined(n)&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(t),this.setNode(e),this._edgeLabels[a]=u?i:this._defaultEdgeLabelFn(t,e,n);var f=function(t,e,n,r){var o=""+e,i=""+n;if(!t&&o>i){var u=o;o=i,i=u;}var s={v:o,w:i};r&&(s.name=r);return s}(this._isDirected,t,e,n);return t=f.v,e=f.w,Object.freeze(f),this._edgeObjs[a]=f,c(this._preds[e],t),c(this._sucs[t],e),this._in[e][a]=f,this._out[t][a]=f,this._edgeCount++,this},a.prototype.edge=function(t,e,n){var r=1===arguments.length?p(this._isDirected,arguments[0]):l(this._isDirected,t,e,n);return this._edgeLabels[r]},a.prototype.hasEdge=function(t,e,n){var r=1===arguments.length?p(this._isDirected,arguments[0]):l(this._isDirected,t,e,n);return o.has(this._edgeLabels,r)},a.prototype.removeEdge=function(t,e,n){var r=1===arguments.length?p(this._isDirected,arguments[0]):l(this._isDirected,t,e,n),o=this._edgeObjs[r];return o&&(t=o.v,e=o.w,delete this._edgeLabels[r],delete this._edgeObjs[r],f(this._preds[e],t),f(this._sucs[t],e),delete this._in[e][r],delete this._out[t][r],this._edgeCount--),this},a.prototype.inEdges=function(t,e){var n=this._in[t];if(n){var r=o.values(n);return e?o.filter(r,function(t){return t.v===e}):r}},a.prototype.outEdges=function(t,e){var n=this._out[t];if(n){var r=o.values(n);return e?o.filter(r,function(t){return t.w===e}):r}},a.prototype.nodeEdges=function(t,e){var n=this.inEdges(t,e);if(n)return n.concat(this.outEdges(t,e))};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.merge=function(){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];if(e.length>1){e[0]=e[0].slice(0,-1);for(var r=e.length-1,o=1;o<r;++o)e[o]=e[o].slice(1,-1);return e[r]=e[r].slice(1),e.join("")}return e[0]},e.subexp=function(t){return "(?:"+t+")"},e.typeOf=function(t){return void 0===t?"undefined":null===t?"null":Object.prototype.toString.call(t).split(" ").pop().split("]").shift().toLowerCase()},e.toUpperCase=function(t){return t.toUpperCase()},e.toArray=function(t){return null!=t?t instanceof Array?t:"number"!=typeof t.length||t.split||t.setInterval||t.call?[t]:Array.prototype.slice.call(t):[]};},function(t,e,n){(function(t,r){var o,i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};(function(){var u,s=200,a="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",c="Expected a function",f="__lodash_hash_undefined__",l=500,p="__lodash_placeholder__",h=1,d=2,v=4,y=1,_=2,g=1,m=2,b=4,w=8,x=16,E=32,O=64,C=128,S=256,T=512,j=30,A="...",I=800,P=16,R=1,k=2,D=1/0,U=9007199254740991,N=1.7976931348623157e308,F=NaN,L=4294967295,q=L-1,z=L>>>1,M=[["ary",C],["bind",g],["bindKey",m],["curry",w],["curryRight",x],["flip",T],["partial",E],["partialRight",O],["rearg",S]],H="[object Arguments]",$="[object Array]",B="[object AsyncFunction]",W="[object Boolean]",Z="[object Date]",G="[object DOMException]",V="[object Error]",J="[object Function]",X="[object GeneratorFunction]",K="[object Map]",Y="[object Number]",Q="[object Null]",tt="[object Object]",et="[object Proxy]",nt="[object RegExp]",rt="[object Set]",ot="[object String]",it="[object Symbol]",ut="[object Undefined]",st="[object WeakMap]",at="[object WeakSet]",ct="[object ArrayBuffer]",ft="[object DataView]",lt="[object Float32Array]",pt="[object Float64Array]",ht="[object Int8Array]",dt="[object Int16Array]",vt="[object Int32Array]",yt="[object Uint8Array]",_t="[object Uint8ClampedArray]",gt="[object Uint16Array]",mt="[object Uint32Array]",bt=/\b__p \+= '';/g,wt=/\b(__p \+=) '' \+/g,xt=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Et=/&(?:amp|lt|gt|quot|#39);/g,Ot=/[&<>"']/g,Ct=RegExp(Et.source),St=RegExp(Ot.source),Tt=/<%-([\s\S]+?)%>/g,jt=/<%([\s\S]+?)%>/g,At=/<%=([\s\S]+?)%>/g,It=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Pt=/^\w*$/,Rt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,kt=/[\\^$.*+?()[\]{}|]/g,Dt=RegExp(kt.source),Ut=/^\s+|\s+$/g,Nt=/^\s+/,Ft=/\s+$/,Lt=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,qt=/\{\n\/\* \[wrapped with (.+)\] \*/,zt=/,? & /,Mt=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,Ht=/\\(\\)?/g,$t=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Bt=/\w*$/,Wt=/^[-+]0x[0-9a-f]+$/i,Zt=/^0b[01]+$/i,Gt=/^\[object .+?Constructor\]$/,Vt=/^0o[0-7]+$/i,Jt=/^(?:0|[1-9]\d*)$/,Xt=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Kt=/($^)/,Yt=/['\n\r\u2028\u2029\\]/g,Qt="\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",te="\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",ee="[\\ud800-\\udfff]",ne="["+te+"]",re="["+Qt+"]",oe="\\d+",ie="[\\u2700-\\u27bf]",ue="[a-z\\xdf-\\xf6\\xf8-\\xff]",se="[^\\ud800-\\udfff"+te+oe+"\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",ae="\\ud83c[\\udffb-\\udfff]",ce="[^\\ud800-\\udfff]",fe="(?:\\ud83c[\\udde6-\\uddff]){2}",le="[\\ud800-\\udbff][\\udc00-\\udfff]",pe="[A-Z\\xc0-\\xd6\\xd8-\\xde]",he="(?:"+ue+"|"+se+")",de="(?:"+pe+"|"+se+")",ve="(?:"+re+"|"+ae+")"+"?",ye="[\\ufe0e\\ufe0f]?"+ve+("(?:\\u200d(?:"+[ce,fe,le].join("|")+")[\\ufe0e\\ufe0f]?"+ve+")*"),_e="(?:"+[ie,fe,le].join("|")+")"+ye,ge="(?:"+[ce+re+"?",re,fe,le,ee].join("|")+")",me=RegExp("['’]","g"),be=RegExp(re,"g"),we=RegExp(ae+"(?="+ae+")|"+ge+ye,"g"),xe=RegExp([pe+"?"+ue+"+(?:['’](?:d|ll|m|re|s|t|ve))?(?="+[ne,pe,"$"].join("|")+")",de+"+(?:['’](?:D|LL|M|RE|S|T|VE))?(?="+[ne,pe+he,"$"].join("|")+")",pe+"?"+he+"+(?:['’](?:d|ll|m|re|s|t|ve))?",pe+"+(?:['’](?:D|LL|M|RE|S|T|VE))?","\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])","\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",oe,_e].join("|"),"g"),Ee=RegExp("[\\u200d\\ud800-\\udfff"+Qt+"\\ufe0e\\ufe0f]"),Oe=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Ce=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Se=-1,Te={};Te[lt]=Te[pt]=Te[ht]=Te[dt]=Te[vt]=Te[yt]=Te[_t]=Te[gt]=Te[mt]=!0,Te[H]=Te[$]=Te[ct]=Te[W]=Te[ft]=Te[Z]=Te[V]=Te[J]=Te[K]=Te[Y]=Te[tt]=Te[nt]=Te[rt]=Te[ot]=Te[st]=!1;var je={};je[H]=je[$]=je[ct]=je[ft]=je[W]=je[Z]=je[lt]=je[pt]=je[ht]=je[dt]=je[vt]=je[K]=je[Y]=je[tt]=je[nt]=je[rt]=je[ot]=je[it]=je[yt]=je[_t]=je[gt]=je[mt]=!0,je[V]=je[J]=je[st]=!1;var Ae={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Ie=parseFloat,Pe=parseInt,Re="object"==(void 0===t?"undefined":i(t))&&t&&t.Object===Object&&t,ke="object"==("undefined"==typeof self?"undefined":i(self))&&self&&self.Object===Object&&self,De=Re||ke||Function("return this")(),Ue="object"==i(e)&&e&&!e.nodeType&&e,Ne=Ue&&"object"==i(r)&&r&&!r.nodeType&&r,Fe=Ne&&Ne.exports===Ue,Le=Fe&&Re.process,qe=function(){try{var t=Ne&&Ne.require&&Ne.require("util").types;return t||Le&&Le.binding&&Le.binding("util")}catch(t){}}(),ze=qe&&qe.isArrayBuffer,Me=qe&&qe.isDate,He=qe&&qe.isMap,$e=qe&&qe.isRegExp,Be=qe&&qe.isSet,We=qe&&qe.isTypedArray;function Ze(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function Ge(t,e,n,r){for(var o=-1,i=null==t?0:t.length;++o<i;){var u=t[o];e(r,u,n(u),t);}return r}function Ve(t,e){for(var n=-1,r=null==t?0:t.length;++n<r&&!1!==e(t[n],n,t););return t}function Je(t,e){for(var n=null==t?0:t.length;n--&&!1!==e(t[n],n,t););return t}function Xe(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(!e(t[n],n,t))return !1;return !0}function Ke(t,e){for(var n=-1,r=null==t?0:t.length,o=0,i=[];++n<r;){var u=t[n];e(u,n,t)&&(i[o++]=u);}return i}function Ye(t,e){return !!(null==t?0:t.length)&&cn(t,e,0)>-1}function Qe(t,e,n){for(var r=-1,o=null==t?0:t.length;++r<o;)if(n(e,t[r]))return !0;return !1}function tn(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}function en(t,e){for(var n=-1,r=e.length,o=t.length;++n<r;)t[o+n]=e[n];return t}function nn(t,e,n,r){var o=-1,i=null==t?0:t.length;for(r&&i&&(n=t[++o]);++o<i;)n=e(n,t[o],o,t);return n}function rn(t,e,n,r){var o=null==t?0:t.length;for(r&&o&&(n=t[--o]);o--;)n=e(n,t[o],o,t);return n}function on(t,e){for(var n=-1,r=null==t?0:t.length;++n<r;)if(e(t[n],n,t))return !0;return !1}var un=hn("length");function sn(t,e,n){var r;return n(t,function(t,n,o){if(e(t,n,o))return r=n,!1}),r}function an(t,e,n,r){for(var o=t.length,i=n+(r?1:-1);r?i--:++i<o;)if(e(t[i],i,t))return i;return -1}function cn(t,e,n){return e==e?function(t,e,n){var r=n-1,o=t.length;for(;++r<o;)if(t[r]===e)return r;return -1}(t,e,n):an(t,ln,n)}function fn(t,e,n,r){for(var o=n-1,i=t.length;++o<i;)if(r(t[o],e))return o;return -1}function ln(t){return t!=t}function pn(t,e){var n=null==t?0:t.length;return n?yn(t,e)/n:F}function hn(t){return function(e){return null==e?u:e[t]}}function dn(t){return function(e){return null==t?u:t[e]}}function vn(t,e,n,r,o){return o(t,function(t,o,i){n=r?(r=!1,t):e(n,t,o,i);}),n}function yn(t,e){for(var n,r=-1,o=t.length;++r<o;){var i=e(t[r]);i!==u&&(n=n===u?i:n+i);}return n}function _n(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}function gn(t){return function(e){return t(e)}}function mn(t,e){return tn(e,function(e){return t[e]})}function bn(t,e){return t.has(e)}function wn(t,e){for(var n=-1,r=t.length;++n<r&&cn(e,t[n],0)>-1;);return n}function xn(t,e){for(var n=t.length;n--&&cn(e,t[n],0)>-1;);return n}var En=dn({"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss","Ā":"A","Ă":"A","Ą":"A","ā":"a","ă":"a","ą":"a","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","ć":"c","ĉ":"c","ċ":"c","č":"c","Ď":"D","Đ":"D","ď":"d","đ":"d","Ē":"E","Ĕ":"E","Ė":"E","Ę":"E","Ě":"E","ē":"e","ĕ":"e","ė":"e","ę":"e","ě":"e","Ĝ":"G","Ğ":"G","Ġ":"G","Ģ":"G","ĝ":"g","ğ":"g","ġ":"g","ģ":"g","Ĥ":"H","Ħ":"H","ĥ":"h","ħ":"h","Ĩ":"I","Ī":"I","Ĭ":"I","Į":"I","İ":"I","ĩ":"i","ī":"i","ĭ":"i","į":"i","ı":"i","Ĵ":"J","ĵ":"j","Ķ":"K","ķ":"k","ĸ":"k","Ĺ":"L","Ļ":"L","Ľ":"L","Ŀ":"L","Ł":"L","ĺ":"l","ļ":"l","ľ":"l","ŀ":"l","ł":"l","Ń":"N","Ņ":"N","Ň":"N","Ŋ":"N","ń":"n","ņ":"n","ň":"n","ŋ":"n","Ō":"O","Ŏ":"O","Ő":"O","ō":"o","ŏ":"o","ő":"o","Ŕ":"R","Ŗ":"R","Ř":"R","ŕ":"r","ŗ":"r","ř":"r","Ś":"S","Ŝ":"S","Ş":"S","Š":"S","ś":"s","ŝ":"s","ş":"s","š":"s","Ţ":"T","Ť":"T","Ŧ":"T","ţ":"t","ť":"t","ŧ":"t","Ũ":"U","Ū":"U","Ŭ":"U","Ů":"U","Ű":"U","Ų":"U","ũ":"u","ū":"u","ŭ":"u","ů":"u","ű":"u","ų":"u","Ŵ":"W","ŵ":"w","Ŷ":"Y","ŷ":"y","Ÿ":"Y","Ź":"Z","Ż":"Z","Ž":"Z","ź":"z","ż":"z","ž":"z","Ĳ":"IJ","ĳ":"ij","Œ":"Oe","œ":"oe","ŉ":"'n","ſ":"s"}),On=dn({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"});function Cn(t){return "\\"+Ae[t]}function Sn(t){return Ee.test(t)}function Tn(t){var e=-1,n=Array(t.size);return t.forEach(function(t,r){n[++e]=[r,t];}),n}function jn(t,e){return function(n){return t(e(n))}}function An(t,e){for(var n=-1,r=t.length,o=0,i=[];++n<r;){var u=t[n];u!==e&&u!==p||(t[n]=p,i[o++]=n);}return i}function In(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=t;}),n}function Pn(t){var e=-1,n=Array(t.size);return t.forEach(function(t){n[++e]=[t,t];}),n}function Rn(t){return Sn(t)?function(t){var e=we.lastIndex=0;for(;we.test(t);)++e;return e}(t):un(t)}function kn(t){return Sn(t)?function(t){return t.match(we)||[]}(t):function(t){return t.split("")}(t)}var Dn=dn({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});var Un=function t(e){var n,r=(e=null==e?De:Un.defaults(De.Object(),e,Un.pick(De,Ce))).Array,o=e.Date,Qt=e.Error,te=e.Function,ee=e.Math,ne=e.Object,re=e.RegExp,oe=e.String,ie=e.TypeError,ue=r.prototype,se=te.prototype,ae=ne.prototype,ce=e["__core-js_shared__"],fe=se.toString,le=ae.hasOwnProperty,pe=0,he=(n=/[^.]+$/.exec(ce&&ce.keys&&ce.keys.IE_PROTO||""))?"Symbol(src)_1."+n:"",de=ae.toString,ve=fe.call(ne),ye=De._,_e=re("^"+fe.call(le).replace(kt,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),ge=Fe?e.Buffer:u,we=e.Symbol,Ee=e.Uint8Array,Ae=ge?ge.allocUnsafe:u,Re=jn(ne.getPrototypeOf,ne),ke=ne.create,Ue=ae.propertyIsEnumerable,Ne=ue.splice,Le=we?we.isConcatSpreadable:u,qe=we?we.iterator:u,un=we?we.toStringTag:u,dn=function(){try{var t=zi(ne,"defineProperty");return t({},"",{}),t}catch(t){}}(),Nn=e.clearTimeout!==De.clearTimeout&&e.clearTimeout,Fn=o&&o.now!==De.Date.now&&o.now,Ln=e.setTimeout!==De.setTimeout&&e.setTimeout,qn=ee.ceil,zn=ee.floor,Mn=ne.getOwnPropertySymbols,Hn=ge?ge.isBuffer:u,$n=e.isFinite,Bn=ue.join,Wn=jn(ne.keys,ne),Zn=ee.max,Gn=ee.min,Vn=o.now,Jn=e.parseInt,Xn=ee.random,Kn=ue.reverse,Yn=zi(e,"DataView"),Qn=zi(e,"Map"),tr=zi(e,"Promise"),er=zi(e,"Set"),nr=zi(e,"WeakMap"),rr=zi(ne,"create"),or=nr&&new nr,ir={},ur=pu(Yn),sr=pu(Qn),ar=pu(tr),cr=pu(er),fr=pu(nr),lr=we?we.prototype:u,pr=lr?lr.valueOf:u,hr=lr?lr.toString:u;function dr(t){if(As(t)&&!gs(t)&&!(t instanceof gr)){if(t instanceof _r)return t;if(le.call(t,"__wrapped__"))return hu(t)}return new _r(t)}var vr=function(){function t(){}return function(e){if(!js(e))return {};if(ke)return ke(e);t.prototype=e;var n=new t;return t.prototype=u,n}}();function yr(){}function _r(t,e){this.__wrapped__=t,this.__actions__=[],this.__chain__=!!e,this.__index__=0,this.__values__=u;}function gr(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=L,this.__views__=[];}function mr(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}function br(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}function wr(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1]);}}function xr(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new wr;++e<n;)this.add(t[e]);}function Er(t){var e=this.__data__=new br(t);this.size=e.size;}function Or(t,e){var n=gs(t),r=!n&&_s(t),o=!n&&!r&&xs(t),i=!n&&!r&&!o&&Fs(t),u=n||r||o||i,s=u?_n(t.length,oe):[],a=s.length;for(var c in t)!e&&!le.call(t,c)||u&&("length"==c||o&&("offset"==c||"parent"==c)||i&&("buffer"==c||"byteLength"==c||"byteOffset"==c)||Gi(c,a))||s.push(c);return s}function Cr(t){var e=t.length;return e?t[Eo(0,e-1)]:u}function Sr(t,e){return cu(oi(t),Ur(e,0,t.length))}function Tr(t){return cu(oi(t))}function jr(t,e,n){(n===u||ds(t[e],n))&&(n!==u||e in t)||kr(t,e,n);}function Ar(t,e,n){var r=t[e];le.call(t,e)&&ds(r,n)&&(n!==u||e in t)||kr(t,e,n);}function Ir(t,e){for(var n=t.length;n--;)if(ds(t[n][0],e))return n;return -1}function Pr(t,e,n,r){return zr(t,function(t,o,i){e(r,t,n(t),i);}),r}function Rr(t,e){return t&&ii(e,ia(e),t)}function kr(t,e,n){"__proto__"==e&&dn?dn(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n;}function Dr(t,e){for(var n=-1,o=e.length,i=r(o),s=null==t;++n<o;)i[n]=s?u:ta(t,e[n]);return i}function Ur(t,e,n){return t==t&&(n!==u&&(t=t<=n?t:n),e!==u&&(t=t>=e?t:e)),t}function Nr(t,e,n,r,o,i){var s,a=e&h,c=e&d,f=e&v;if(n&&(s=o?n(t,r,o,i):n(t)),s!==u)return s;if(!js(t))return t;var l=gs(t);if(l){if(s=function(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&le.call(t,"index")&&(n.index=t.index,n.input=t.input),n}(t),!a)return oi(t,s)}else {var p=$i(t),y=p==J||p==X;if(xs(t))return Yo(t,a);if(p==tt||p==H||y&&!o){if(s=c||y?{}:Wi(t),!a)return c?function(t,e){return ii(t,Hi(t),e)}(t,function(t,e){return t&&ii(e,ua(e),t)}(s,t)):function(t,e){return ii(t,Mi(t),e)}(t,Rr(s,t))}else {if(!je[p])return o?t:{};s=function(t,e,n){var r,o,i,u=t.constructor;switch(e){case ct:return Qo(t);case W:case Z:return new u(+t);case ft:return function(t,e){var n=e?Qo(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}(t,n);case lt:case pt:case ht:case dt:case vt:case yt:case _t:case gt:case mt:return ti(t,n);case K:return new u;case Y:case ot:return new u(t);case nt:return (i=new(o=t).constructor(o.source,Bt.exec(o))).lastIndex=o.lastIndex,i;case rt:return new u;case it:return r=t,pr?ne(pr.call(r)):{}}}(t,p,a);}}i||(i=new Er);var _=i.get(t);if(_)return _;if(i.set(t,s),Ds(t))return t.forEach(function(r){s.add(Nr(r,e,n,r,t,i));}),s;if(Is(t))return t.forEach(function(r,o){s.set(o,Nr(r,e,n,o,t,i));}),s;var g=l?u:(f?c?ki:Ri:c?ua:ia)(t);return Ve(g||t,function(r,o){g&&(r=t[o=r]),Ar(s,o,Nr(r,e,n,o,t,i));}),s}function Fr(t,e,n){var r=n.length;if(null==t)return !r;for(t=ne(t);r--;){var o=n[r],i=e[o],s=t[o];if(s===u&&!(o in t)||!i(s))return !1}return !0}function Lr(t,e,n){if("function"!=typeof t)throw new ie(c);return iu(function(){t.apply(u,n);},e)}function qr(t,e,n,r){var o=-1,i=Ye,u=!0,a=t.length,c=[],f=e.length;if(!a)return c;n&&(e=tn(e,gn(n))),r?(i=Qe,u=!1):e.length>=s&&(i=bn,u=!1,e=new xr(e));t:for(;++o<a;){var l=t[o],p=null==n?l:n(l);if(l=r||0!==l?l:0,u&&p==p){for(var h=f;h--;)if(e[h]===p)continue t;c.push(l);}else i(e,p,r)||c.push(l);}return c}dr.templateSettings={escape:Tt,evaluate:jt,interpolate:At,variable:"",imports:{_:dr}},dr.prototype=yr.prototype,dr.prototype.constructor=dr,_r.prototype=vr(yr.prototype),_r.prototype.constructor=_r,gr.prototype=vr(yr.prototype),gr.prototype.constructor=gr,mr.prototype.clear=function(){this.__data__=rr?rr(null):{},this.size=0;},mr.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},mr.prototype.get=function(t){var e=this.__data__;if(rr){var n=e[t];return n===f?u:n}return le.call(e,t)?e[t]:u},mr.prototype.has=function(t){var e=this.__data__;return rr?e[t]!==u:le.call(e,t)},mr.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=rr&&e===u?f:e,this},br.prototype.clear=function(){this.__data__=[],this.size=0;},br.prototype.delete=function(t){var e=this.__data__,n=Ir(e,t);return !(n<0||(n==e.length-1?e.pop():Ne.call(e,n,1),--this.size,0))},br.prototype.get=function(t){var e=this.__data__,n=Ir(e,t);return n<0?u:e[n][1]},br.prototype.has=function(t){return Ir(this.__data__,t)>-1},br.prototype.set=function(t,e){var n=this.__data__,r=Ir(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this},wr.prototype.clear=function(){this.size=0,this.__data__={hash:new mr,map:new(Qn||br),string:new mr};},wr.prototype.delete=function(t){var e=Li(this,t).delete(t);return this.size-=e?1:0,e},wr.prototype.get=function(t){return Li(this,t).get(t)},wr.prototype.has=function(t){return Li(this,t).has(t)},wr.prototype.set=function(t,e){var n=Li(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},xr.prototype.add=xr.prototype.push=function(t){return this.__data__.set(t,f),this},xr.prototype.has=function(t){return this.__data__.has(t)},Er.prototype.clear=function(){this.__data__=new br,this.size=0;},Er.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},Er.prototype.get=function(t){return this.__data__.get(t)},Er.prototype.has=function(t){return this.__data__.has(t)},Er.prototype.set=function(t,e){var n=this.__data__;if(n instanceof br){var r=n.__data__;if(!Qn||r.length<s-1)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new wr(r);}return n.set(t,e),this.size=n.size,this};var zr=ai(Vr),Mr=ai(Jr,!0);function Hr(t,e){var n=!0;return zr(t,function(t,r,o){return n=!!e(t,r,o)}),n}function $r(t,e,n){for(var r=-1,o=t.length;++r<o;){var i=t[r],s=e(i);if(null!=s&&(a===u?s==s&&!Ns(s):n(s,a)))var a=s,c=i;}return c}function Br(t,e){var n=[];return zr(t,function(t,r,o){e(t,r,o)&&n.push(t);}),n}function Wr(t,e,n,r,o){var i=-1,u=t.length;for(n||(n=Zi),o||(o=[]);++i<u;){var s=t[i];e>0&&n(s)?e>1?Wr(s,e-1,n,r,o):en(o,s):r||(o[o.length]=s);}return o}var Zr=ci(),Gr=ci(!0);function Vr(t,e){return t&&Zr(t,e,ia)}function Jr(t,e){return t&&Gr(t,e,ia)}function Xr(t,e){return Ke(e,function(e){return Cs(t[e])})}function Kr(t,e){for(var n=0,r=(e=Vo(e,t)).length;null!=t&&n<r;)t=t[lu(e[n++])];return n&&n==r?t:u}function Yr(t,e,n){var r=e(t);return gs(t)?r:en(r,n(t))}function Qr(t){return null==t?t===u?ut:Q:un&&un in ne(t)?function(t){var e=le.call(t,un),n=t[un];try{t[un]=u;var r=!0;}catch(t){}var o=de.call(t);return r&&(e?t[un]=n:delete t[un]),o}(t):function(t){return de.call(t)}(t)}function to(t,e){return t>e}function eo(t,e){return null!=t&&le.call(t,e)}function no(t,e){return null!=t&&e in ne(t)}function ro(t,e,n){for(var o=n?Qe:Ye,i=t[0].length,s=t.length,a=s,c=r(s),f=1/0,l=[];a--;){var p=t[a];a&&e&&(p=tn(p,gn(e))),f=Gn(p.length,f),c[a]=!n&&(e||i>=120&&p.length>=120)?new xr(a&&p):u;}p=t[0];var h=-1,d=c[0];t:for(;++h<i&&l.length<f;){var v=p[h],y=e?e(v):v;if(v=n||0!==v?v:0,!(d?bn(d,y):o(l,y,n))){for(a=s;--a;){var _=c[a];if(!(_?bn(_,y):o(t[a],y,n)))continue t}d&&d.push(y),l.push(v);}}return l}function oo(t,e,n){var r=null==(t=nu(t,e=Vo(e,t)))?t:t[lu(Ou(e))];return null==r?u:Ze(r,t,n)}function io(t){return As(t)&&Qr(t)==H}function uo(t,e,n,r,o){return t===e||(null==t||null==e||!As(t)&&!As(e)?t!=t&&e!=e:function(t,e,n,r,o,i){var s=gs(t),a=gs(e),c=s?$:$i(t),f=a?$:$i(e),l=(c=c==H?tt:c)==tt,p=(f=f==H?tt:f)==tt,h=c==f;if(h&&xs(t)){if(!xs(e))return !1;s=!0,l=!1;}if(h&&!l)return i||(i=new Er),s||Fs(t)?Ii(t,e,n,r,o,i):function(t,e,n,r,o,i,u){switch(n){case ft:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return !1;t=t.buffer,e=e.buffer;case ct:return !(t.byteLength!=e.byteLength||!i(new Ee(t),new Ee(e)));case W:case Z:case Y:return ds(+t,+e);case V:return t.name==e.name&&t.message==e.message;case nt:case ot:return t==e+"";case K:var s=Tn;case rt:var a=r&y;if(s||(s=In),t.size!=e.size&&!a)return !1;var c=u.get(t);if(c)return c==e;r|=_,u.set(t,e);var f=Ii(s(t),s(e),r,o,i,u);return u.delete(t),f;case it:if(pr)return pr.call(t)==pr.call(e)}return !1}(t,e,c,n,r,o,i);if(!(n&y)){var d=l&&le.call(t,"__wrapped__"),v=p&&le.call(e,"__wrapped__");if(d||v){var g=d?t.value():t,m=v?e.value():e;return i||(i=new Er),o(g,m,n,r,i)}}return !!h&&(i||(i=new Er),function(t,e,n,r,o,i){var s=n&y,a=Ri(t),c=a.length,f=Ri(e).length;if(c!=f&&!s)return !1;for(var l=c;l--;){var p=a[l];if(!(s?p in e:le.call(e,p)))return !1}var h=i.get(t);if(h&&i.get(e))return h==e;var d=!0;i.set(t,e),i.set(e,t);for(var v=s;++l<c;){p=a[l];var _=t[p],g=e[p];if(r)var m=s?r(g,_,p,e,t,i):r(_,g,p,t,e,i);if(!(m===u?_===g||o(_,g,n,r,i):m)){d=!1;break}v||(v="constructor"==p);}if(d&&!v){var b=t.constructor,w=e.constructor;b!=w&&"constructor"in t&&"constructor"in e&&!("function"==typeof b&&b instanceof b&&"function"==typeof w&&w instanceof w)&&(d=!1);}return i.delete(t),i.delete(e),d}(t,e,n,r,o,i))}(t,e,n,r,uo,o))}function so(t,e,n,r){var o=n.length,i=o,s=!r;if(null==t)return !i;for(t=ne(t);o--;){var a=n[o];if(s&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return !1}for(;++o<i;){var c=(a=n[o])[0],f=t[c],l=a[1];if(s&&a[2]){if(f===u&&!(c in t))return !1}else {var p=new Er;if(r)var h=r(f,l,c,t,e,p);if(!(h===u?uo(l,f,y|_,r,p):h))return !1}}return !0}function ao(t){return !(!js(t)||(e=t,he&&he in e))&&(Cs(t)?_e:Gt).test(pu(t));var e;}function co(t){return "function"==typeof t?t:null==t?Pa:"object"==(void 0===t?"undefined":i(t))?gs(t)?yo(t[0],t[1]):vo(t):za(t)}function fo(t){if(!Yi(t))return Wn(t);var e=[];for(var n in ne(t))le.call(t,n)&&"constructor"!=n&&e.push(n);return e}function lo(t){if(!js(t))return function(t){var e=[];if(null!=t)for(var n in ne(t))e.push(n);return e}(t);var e=Yi(t),n=[];for(var r in t)("constructor"!=r||!e&&le.call(t,r))&&n.push(r);return n}function po(t,e){return t<e}function ho(t,e){var n=-1,o=bs(t)?r(t.length):[];return zr(t,function(t,r,i){o[++n]=e(t,r,i);}),o}function vo(t){var e=qi(t);return 1==e.length&&e[0][2]?tu(e[0][0],e[0][1]):function(n){return n===t||so(n,t,e)}}function yo(t,e){return Ji(t)&&Qi(e)?tu(lu(t),e):function(n){var r=ta(n,t);return r===u&&r===e?ea(n,t):uo(e,r,y|_)}}function _o(t,e,n,r,o){t!==e&&Zr(e,function(i,s){if(js(i))o||(o=new Er),function(t,e,n,r,o,i,s){var a=ru(t,n),c=ru(e,n),f=s.get(c);if(f)jr(t,n,f);else {var l=i?i(a,c,n+"",t,e,s):u,p=l===u;if(p){var h=gs(c),d=!h&&xs(c),v=!h&&!d&&Fs(c);l=c,h||d||v?gs(a)?l=a:ws(a)?l=oi(a):d?(p=!1,l=Yo(c,!0)):v?(p=!1,l=ti(c,!0)):l=[]:Rs(c)||_s(c)?(l=a,_s(a)?l=Ws(a):js(a)&&!Cs(a)||(l=Wi(c))):p=!1;}p&&(s.set(c,l),o(l,c,r,i,s),s.delete(c)),jr(t,n,l);}}(t,e,s,n,_o,r,o);else {var a=r?r(ru(t,s),i,s+"",t,e,o):u;a===u&&(a=i),jr(t,s,a);}},ua);}function go(t,e){var n=t.length;if(n)return Gi(e+=e<0?n:0,n)?t[e]:u}function mo(t,e,n){var r=-1;return e=tn(e.length?e:[Pa],gn(Fi())),function(t,e){var n=t.length;for(t.sort(e);n--;)t[n]=t[n].value;return t}(ho(t,function(t,n,o){return {criteria:tn(e,function(e){return e(t)}),index:++r,value:t}}),function(t,e){return function(t,e,n){for(var r=-1,o=t.criteria,i=e.criteria,u=o.length,s=n.length;++r<u;){var a=ei(o[r],i[r]);if(a){if(r>=s)return a;var c=n[r];return a*("desc"==c?-1:1)}}return t.index-e.index}(t,e,n)})}function bo(t,e,n){for(var r=-1,o=e.length,i={};++r<o;){var u=e[r],s=Kr(t,u);n(s,u)&&jo(i,Vo(u,t),s);}return i}function wo(t,e,n,r){var o=r?fn:cn,i=-1,u=e.length,s=t;for(t===e&&(e=oi(e)),n&&(s=tn(t,gn(n)));++i<u;)for(var a=0,c=e[i],f=n?n(c):c;(a=o(s,f,a,r))>-1;)s!==t&&Ne.call(s,a,1),Ne.call(t,a,1);return t}function xo(t,e){for(var n=t?e.length:0,r=n-1;n--;){var o=e[n];if(n==r||o!==i){var i=o;Gi(o)?Ne.call(t,o,1):zo(t,o);}}return t}function Eo(t,e){return t+zn(Xn()*(e-t+1))}function Oo(t,e){var n="";if(!t||e<1||e>U)return n;do{e%2&&(n+=t),(e=zn(e/2))&&(t+=t);}while(e);return n}function Co(t,e){return uu(eu(t,e,Pa),t+"")}function So(t){return Cr(da(t))}function To(t,e){var n=da(t);return cu(n,Ur(e,0,n.length))}function jo(t,e,n,r){if(!js(t))return t;for(var o=-1,i=(e=Vo(e,t)).length,s=i-1,a=t;null!=a&&++o<i;){var c=lu(e[o]),f=n;if(o!=s){var l=a[c];(f=r?r(l,c,a):u)===u&&(f=js(l)?l:Gi(e[o+1])?[]:{});}Ar(a,c,f),a=a[c];}return t}var Ao=or?function(t,e){return or.set(t,e),t}:Pa,Io=dn?function(t,e){return dn(t,"toString",{configurable:!0,enumerable:!1,value:ja(e),writable:!0})}:Pa;function Po(t){return cu(da(t))}function Ro(t,e,n){var o=-1,i=t.length;e<0&&(e=-e>i?0:i+e),(n=n>i?i:n)<0&&(n+=i),i=e>n?0:n-e>>>0,e>>>=0;for(var u=r(i);++o<i;)u[o]=t[o+e];return u}function ko(t,e){var n;return zr(t,function(t,r,o){return !(n=e(t,r,o))}),!!n}function Do(t,e,n){var r=0,o=null==t?r:t.length;if("number"==typeof e&&e==e&&o<=z){for(;r<o;){var i=r+o>>>1,u=t[i];null!==u&&!Ns(u)&&(n?u<=e:u<e)?r=i+1:o=i;}return o}return Uo(t,e,Pa,n)}function Uo(t,e,n,r){e=n(e);for(var o=0,i=null==t?0:t.length,s=e!=e,a=null===e,c=Ns(e),f=e===u;o<i;){var l=zn((o+i)/2),p=n(t[l]),h=p!==u,d=null===p,v=p==p,y=Ns(p);if(s)var _=r||v;else _=f?v&&(r||h):a?v&&h&&(r||!d):c?v&&h&&!d&&(r||!y):!d&&!y&&(r?p<=e:p<e);_?o=l+1:i=l;}return Gn(i,q)}function No(t,e){for(var n=-1,r=t.length,o=0,i=[];++n<r;){var u=t[n],s=e?e(u):u;if(!n||!ds(s,a)){var a=s;i[o++]=0===u?0:u;}}return i}function Fo(t){return "number"==typeof t?t:Ns(t)?F:+t}function Lo(t){if("string"==typeof t)return t;if(gs(t))return tn(t,Lo)+"";if(Ns(t))return hr?hr.call(t):"";var e=t+"";return "0"==e&&1/t==-D?"-0":e}function qo(t,e,n){var r=-1,o=Ye,i=t.length,u=!0,a=[],c=a;if(n)u=!1,o=Qe;else if(i>=s){var f=e?null:Oi(t);if(f)return In(f);u=!1,o=bn,c=new xr;}else c=e?[]:a;t:for(;++r<i;){var l=t[r],p=e?e(l):l;if(l=n||0!==l?l:0,u&&p==p){for(var h=c.length;h--;)if(c[h]===p)continue t;e&&c.push(p),a.push(l);}else o(c,p,n)||(c!==a&&c.push(p),a.push(l));}return a}function zo(t,e){return null==(t=nu(t,e=Vo(e,t)))||delete t[lu(Ou(e))]}function Mo(t,e,n,r){return jo(t,e,n(Kr(t,e)),r)}function Ho(t,e,n,r){for(var o=t.length,i=r?o:-1;(r?i--:++i<o)&&e(t[i],i,t););return n?Ro(t,r?0:i,r?i+1:o):Ro(t,r?i+1:0,r?o:i)}function $o(t,e){var n=t;return n instanceof gr&&(n=n.value()),nn(e,function(t,e){return e.func.apply(e.thisArg,en([t],e.args))},n)}function Bo(t,e,n){var o=t.length;if(o<2)return o?qo(t[0]):[];for(var i=-1,u=r(o);++i<o;)for(var s=t[i],a=-1;++a<o;)a!=i&&(u[i]=qr(u[i]||s,t[a],e,n));return qo(Wr(u,1),e,n)}function Wo(t,e,n){for(var r=-1,o=t.length,i=e.length,s={};++r<o;){var a=r<i?e[r]:u;n(s,t[r],a);}return s}function Zo(t){return ws(t)?t:[]}function Go(t){return "function"==typeof t?t:Pa}function Vo(t,e){return gs(t)?t:Ji(t,e)?[t]:fu(Zs(t))}var Jo=Co;function Xo(t,e,n){var r=t.length;return n=n===u?r:n,!e&&n>=r?t:Ro(t,e,n)}var Ko=Nn||function(t){return De.clearTimeout(t)};function Yo(t,e){if(e)return t.slice();var n=t.length,r=Ae?Ae(n):new t.constructor(n);return t.copy(r),r}function Qo(t){var e=new t.constructor(t.byteLength);return new Ee(e).set(new Ee(t)),e}function ti(t,e){var n=e?Qo(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)}function ei(t,e){if(t!==e){var n=t!==u,r=null===t,o=t==t,i=Ns(t),s=e!==u,a=null===e,c=e==e,f=Ns(e);if(!a&&!f&&!i&&t>e||i&&s&&c&&!a&&!f||r&&s&&c||!n&&c||!o)return 1;if(!r&&!i&&!f&&t<e||f&&n&&o&&!r&&!i||a&&n&&o||!s&&o||!c)return -1}return 0}function ni(t,e,n,o){for(var i=-1,u=t.length,s=n.length,a=-1,c=e.length,f=Zn(u-s,0),l=r(c+f),p=!o;++a<c;)l[a]=e[a];for(;++i<s;)(p||i<u)&&(l[n[i]]=t[i]);for(;f--;)l[a++]=t[i++];return l}function ri(t,e,n,o){for(var i=-1,u=t.length,s=-1,a=n.length,c=-1,f=e.length,l=Zn(u-a,0),p=r(l+f),h=!o;++i<l;)p[i]=t[i];for(var d=i;++c<f;)p[d+c]=e[c];for(;++s<a;)(h||i<u)&&(p[d+n[s]]=t[i++]);return p}function oi(t,e){var n=-1,o=t.length;for(e||(e=r(o));++n<o;)e[n]=t[n];return e}function ii(t,e,n,r){var o=!n;n||(n={});for(var i=-1,s=e.length;++i<s;){var a=e[i],c=r?r(n[a],t[a],a,n,t):u;c===u&&(c=t[a]),o?kr(n,a,c):Ar(n,a,c);}return n}function ui(t,e){return function(n,r){var o=gs(n)?Ge:Pr,i=e?e():{};return o(n,t,Fi(r,2),i)}}function si(t){return Co(function(e,n){var r=-1,o=n.length,i=o>1?n[o-1]:u,s=o>2?n[2]:u;for(i=t.length>3&&"function"==typeof i?(o--,i):u,s&&Vi(n[0],n[1],s)&&(i=o<3?u:i,o=1),e=ne(e);++r<o;){var a=n[r];a&&t(e,a,r,i);}return e})}function ai(t,e){return function(n,r){if(null==n)return n;if(!bs(n))return t(n,r);for(var o=n.length,i=e?o:-1,u=ne(n);(e?i--:++i<o)&&!1!==r(u[i],i,u););return n}}function ci(t){return function(e,n,r){for(var o=-1,i=ne(e),u=r(e),s=u.length;s--;){var a=u[t?s:++o];if(!1===n(i[a],a,i))break}return e}}function fi(t){return function(e){var n=Sn(e=Zs(e))?kn(e):u,r=n?n[0]:e.charAt(0),o=n?Xo(n,1).join(""):e.slice(1);return r[t]()+o}}function li(t){return function(e){return nn(Ca(_a(e).replace(me,"")),t,"")}}function pi(t){return function(){var e=arguments;switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])}var n=vr(t.prototype),r=t.apply(n,e);return js(r)?r:n}}function hi(t){return function(e,n,r){var o=ne(e);if(!bs(e)){var i=Fi(n,3);e=ia(e),n=function(t){return i(o[t],t,o)};}var s=t(e,n,r);return s>-1?o[i?e[s]:s]:u}}function di(t){return Pi(function(e){var n=e.length,r=n,o=_r.prototype.thru;for(t&&e.reverse();r--;){var i=e[r];if("function"!=typeof i)throw new ie(c);if(o&&!s&&"wrapper"==Ui(i))var s=new _r([],!0);}for(r=s?r:n;++r<n;){var a=Ui(i=e[r]),f="wrapper"==a?Di(i):u;s=f&&Xi(f[0])&&f[1]==(C|w|E|S)&&!f[4].length&&1==f[9]?s[Ui(f[0])].apply(s,f[3]):1==i.length&&Xi(i)?s[a]():s.thru(i);}return function(){var t=arguments,r=t[0];if(s&&1==t.length&&gs(r))return s.plant(r).value();for(var o=0,i=n?e[o].apply(this,t):r;++o<n;)i=e[o].call(this,i);return i}})}function vi(t,e,n,o,i,s,a,c,f,l){var p=e&C,h=e&g,d=e&m,v=e&(w|x),y=e&T,_=d?u:pi(t);return function g(){for(var m=arguments.length,b=r(m),w=m;w--;)b[w]=arguments[w];if(v)var x=Ni(g),E=function(t,e){for(var n=t.length,r=0;n--;)t[n]===e&&++r;return r}(b,x);if(o&&(b=ni(b,o,i,v)),s&&(b=ri(b,s,a,v)),m-=E,v&&m<l){var O=An(b,x);return xi(t,e,vi,g.placeholder,n,b,O,c,f,l-m)}var C=h?n:this,S=d?C[t]:t;return m=b.length,c?b=function(t,e){for(var n=t.length,r=Gn(e.length,n),o=oi(t);r--;){var i=e[r];t[r]=Gi(i,n)?o[i]:u;}return t}(b,c):y&&m>1&&b.reverse(),p&&f<m&&(b.length=f),this&&this!==De&&this instanceof g&&(S=_||pi(S)),S.apply(C,b)}}function yi(t,e){return function(n,r){return function(t,e,n,r){return Vr(t,function(t,o,i){e(r,n(t),o,i);}),r}(n,t,e(r),{})}}function _i(t,e){return function(n,r){var o;if(n===u&&r===u)return e;if(n!==u&&(o=n),r!==u){if(o===u)return r;"string"==typeof n||"string"==typeof r?(n=Lo(n),r=Lo(r)):(n=Fo(n),r=Fo(r)),o=t(n,r);}return o}}function gi(t){return Pi(function(e){return e=tn(e,gn(Fi())),Co(function(n){var r=this;return t(e,function(t){return Ze(t,r,n)})})})}function mi(t,e){var n=(e=e===u?" ":Lo(e)).length;if(n<2)return n?Oo(e,t):e;var r=Oo(e,qn(t/Rn(e)));return Sn(e)?Xo(kn(r),0,t).join(""):r.slice(0,t)}function bi(t){return function(e,n,o){return o&&"number"!=typeof o&&Vi(e,n,o)&&(n=o=u),e=Ms(e),n===u?(n=e,e=0):n=Ms(n),function(t,e,n,o){for(var i=-1,u=Zn(qn((e-t)/(n||1)),0),s=r(u);u--;)s[o?u:++i]=t,t+=n;return s}(e,n,o=o===u?e<n?1:-1:Ms(o),t)}}function wi(t){return function(e,n){return "string"==typeof e&&"string"==typeof n||(e=Bs(e),n=Bs(n)),t(e,n)}}function xi(t,e,n,r,o,i,s,a,c,f){var l=e&w;e|=l?E:O,(e&=~(l?O:E))&b||(e&=~(g|m));var p=[t,e,o,l?i:u,l?s:u,l?u:i,l?u:s,a,c,f],h=n.apply(u,p);return Xi(t)&&ou(h,p),h.placeholder=r,su(h,t,e)}function Ei(t){var e=ee[t];return function(t,n){if(t=Bs(t),n=null==n?0:Gn(Hs(n),292)){var r=(Zs(t)+"e").split("e");return +((r=(Zs(e(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return e(t)}}var Oi=er&&1/In(new er([,-0]))[1]==D?function(t){return new er(t)}:Na;function Ci(t){return function(e){var n=$i(e);return n==K?Tn(e):n==rt?Pn(e):function(t,e){return tn(e,function(e){return [e,t[e]]})}(e,t(e))}}function Si(t,e,n,o,i,s,a,f){var l=e&m;if(!l&&"function"!=typeof t)throw new ie(c);var h=o?o.length:0;if(h||(e&=~(E|O),o=i=u),a=a===u?a:Zn(Hs(a),0),f=f===u?f:Hs(f),h-=i?i.length:0,e&O){var d=o,v=i;o=i=u;}var y=l?u:Di(t),_=[t,e,n,o,i,d,v,s,a,f];if(y&&function(t,e){var n=t[1],r=e[1],o=n|r,i=o<(g|m|C),u=r==C&&n==w||r==C&&n==S&&t[7].length<=e[8]||r==(C|S)&&e[7].length<=e[8]&&n==w;if(!i&&!u)return t;r&g&&(t[2]=e[2],o|=n&g?0:b);var s=e[3];if(s){var a=t[3];t[3]=a?ni(a,s,e[4]):s,t[4]=a?An(t[3],p):e[4];}(s=e[5])&&(a=t[5],t[5]=a?ri(a,s,e[6]):s,t[6]=a?An(t[5],p):e[6]),(s=e[7])&&(t[7]=s),r&C&&(t[8]=null==t[8]?e[8]:Gn(t[8],e[8])),null==t[9]&&(t[9]=e[9]),t[0]=e[0],t[1]=o;}(_,y),t=_[0],e=_[1],n=_[2],o=_[3],i=_[4],!(f=_[9]=_[9]===u?l?0:t.length:Zn(_[9]-h,0))&&e&(w|x)&&(e&=~(w|x)),e&&e!=g)T=e==w||e==x?function(t,e,n){var o=pi(t);return function i(){for(var s=arguments.length,a=r(s),c=s,f=Ni(i);c--;)a[c]=arguments[c];var l=s<3&&a[0]!==f&&a[s-1]!==f?[]:An(a,f);return (s-=l.length)<n?xi(t,e,vi,i.placeholder,u,a,l,u,u,n-s):Ze(this&&this!==De&&this instanceof i?o:t,this,a)}}(t,e,f):e!=E&&e!=(g|E)||i.length?vi.apply(u,_):function(t,e,n,o){var i=e&g,u=pi(t);return function e(){for(var s=-1,a=arguments.length,c=-1,f=o.length,l=r(f+a),p=this&&this!==De&&this instanceof e?u:t;++c<f;)l[c]=o[c];for(;a--;)l[c++]=arguments[++s];return Ze(p,i?n:this,l)}}(t,e,n,o);else var T=function(t,e,n){var r=e&g,o=pi(t);return function e(){return (this&&this!==De&&this instanceof e?o:t).apply(r?n:this,arguments)}}(t,e,n);return su((y?Ao:ou)(T,_),t,e)}function Ti(t,e,n,r){return t===u||ds(t,ae[n])&&!le.call(r,n)?e:t}function ji(t,e,n,r,o,i){return js(t)&&js(e)&&(i.set(e,t),_o(t,e,u,ji,i),i.delete(e)),t}function Ai(t){return Rs(t)?u:t}function Ii(t,e,n,r,o,i){var s=n&y,a=t.length,c=e.length;if(a!=c&&!(s&&c>a))return !1;var f=i.get(t);if(f&&i.get(e))return f==e;var l=-1,p=!0,h=n&_?new xr:u;for(i.set(t,e),i.set(e,t);++l<a;){var d=t[l],v=e[l];if(r)var g=s?r(v,d,l,e,t,i):r(d,v,l,t,e,i);if(g!==u){if(g)continue;p=!1;break}if(h){if(!on(e,function(t,e){if(!bn(h,e)&&(d===t||o(d,t,n,r,i)))return h.push(e)})){p=!1;break}}else if(d!==v&&!o(d,v,n,r,i)){p=!1;break}}return i.delete(t),i.delete(e),p}function Pi(t){return uu(eu(t,u,mu),t+"")}function Ri(t){return Yr(t,ia,Mi)}function ki(t){return Yr(t,ua,Hi)}var Di=or?function(t){return or.get(t)}:Na;function Ui(t){for(var e=t.name+"",n=ir[e],r=le.call(ir,e)?n.length:0;r--;){var o=n[r],i=o.func;if(null==i||i==t)return o.name}return e}function Ni(t){return (le.call(dr,"placeholder")?dr:t).placeholder}function Fi(){var t=dr.iteratee||Ra;return t=t===Ra?co:t,arguments.length?t(arguments[0],arguments[1]):t}function Li(t,e){var n,r,o=t.__data__;return ("string"==(r=void 0===(n=e)?"undefined":i(n))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof e?"string":"hash"]:o.map}function qi(t){for(var e=ia(t),n=e.length;n--;){var r=e[n],o=t[r];e[n]=[r,o,Qi(o)];}return e}function zi(t,e){var n=function(t,e){return null==t?u:t[e]}(t,e);return ao(n)?n:u}var Mi=Mn?function(t){return null==t?[]:(t=ne(t),Ke(Mn(t),function(e){return Ue.call(t,e)}))}:$a,Hi=Mn?function(t){for(var e=[];t;)en(e,Mi(t)),t=Re(t);return e}:$a,$i=Qr;function Bi(t,e,n){for(var r=-1,o=(e=Vo(e,t)).length,i=!1;++r<o;){var u=lu(e[r]);if(!(i=null!=t&&n(t,u)))break;t=t[u];}return i||++r!=o?i:!!(o=null==t?0:t.length)&&Ts(o)&&Gi(u,o)&&(gs(t)||_s(t))}function Wi(t){return "function"!=typeof t.constructor||Yi(t)?{}:vr(Re(t))}function Zi(t){return gs(t)||_s(t)||!!(Le&&t&&t[Le])}function Gi(t,e){var n=void 0===t?"undefined":i(t);return !!(e=null==e?U:e)&&("number"==n||"symbol"!=n&&Jt.test(t))&&t>-1&&t%1==0&&t<e}function Vi(t,e,n){if(!js(n))return !1;var r=void 0===e?"undefined":i(e);return !!("number"==r?bs(n)&&Gi(e,n.length):"string"==r&&e in n)&&ds(n[e],t)}function Ji(t,e){if(gs(t))return !1;var n=void 0===t?"undefined":i(t);return !("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=t&&!Ns(t))||Pt.test(t)||!It.test(t)||null!=e&&t in ne(e)}function Xi(t){var e=Ui(t),n=dr[e];if("function"!=typeof n||!(e in gr.prototype))return !1;if(t===n)return !0;var r=Di(n);return !!r&&t===r[0]}(Yn&&$i(new Yn(new ArrayBuffer(1)))!=ft||Qn&&$i(new Qn)!=K||tr&&"[object Promise]"!=$i(tr.resolve())||er&&$i(new er)!=rt||nr&&$i(new nr)!=st)&&($i=function(t){var e=Qr(t),n=e==tt?t.constructor:u,r=n?pu(n):"";if(r)switch(r){case ur:return ft;case sr:return K;case ar:return "[object Promise]";case cr:return rt;case fr:return st}return e});var Ki=ce?Cs:Ba;function Yi(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||ae)}function Qi(t){return t==t&&!js(t)}function tu(t,e){return function(n){return null!=n&&n[t]===e&&(e!==u||t in ne(n))}}function eu(t,e,n){return e=Zn(e===u?t.length-1:e,0),function(){for(var o=arguments,i=-1,u=Zn(o.length-e,0),s=r(u);++i<u;)s[i]=o[e+i];i=-1;for(var a=r(e+1);++i<e;)a[i]=o[i];return a[e]=n(s),Ze(t,this,a)}}function nu(t,e){return e.length<2?t:Kr(t,Ro(e,0,-1))}function ru(t,e){if("__proto__"!=e)return t[e]}var ou=au(Ao),iu=Ln||function(t,e){return De.setTimeout(t,e)},uu=au(Io);function su(t,e,n){var r=e+"";return uu(t,function(t,e){var n=e.length;if(!n)return t;var r=n-1;return e[r]=(n>1?"& ":"")+e[r],e=e.join(n>2?", ":" "),t.replace(Lt,"{\n/* [wrapped with "+e+"] */\n")}(r,function(t,e){return Ve(M,function(n){var r="_."+n[0];e&n[1]&&!Ye(t,r)&&t.push(r);}),t.sort()}(function(t){var e=t.match(qt);return e?e[1].split(zt):[]}(r),n)))}function au(t){var e=0,n=0;return function(){var r=Vn(),o=P-(r-n);if(n=r,o>0){if(++e>=I)return arguments[0]}else e=0;return t.apply(u,arguments)}}function cu(t,e){var n=-1,r=t.length,o=r-1;for(e=e===u?r:e;++n<e;){var i=Eo(n,o),s=t[i];t[i]=t[n],t[n]=s;}return t.length=e,t}var fu=function(t){var e=as(t,function(t){return n.size===l&&n.clear(),t}),n=e.cache;return e}(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(Rt,function(t,n,r,o){e.push(r?o.replace(Ht,"$1"):n||t);}),e});function lu(t){if("string"==typeof t||Ns(t))return t;var e=t+"";return "0"==e&&1/t==-D?"-0":e}function pu(t){if(null!=t){try{return fe.call(t)}catch(t){}try{return t+""}catch(t){}}return ""}function hu(t){if(t instanceof gr)return t.clone();var e=new _r(t.__wrapped__,t.__chain__);return e.__actions__=oi(t.__actions__),e.__index__=t.__index__,e.__values__=t.__values__,e}var du=Co(function(t,e){return ws(t)?qr(t,Wr(e,1,ws,!0)):[]}),vu=Co(function(t,e){var n=Ou(e);return ws(n)&&(n=u),ws(t)?qr(t,Wr(e,1,ws,!0),Fi(n,2)):[]}),yu=Co(function(t,e){var n=Ou(e);return ws(n)&&(n=u),ws(t)?qr(t,Wr(e,1,ws,!0),u,n):[]});function _u(t,e,n){var r=null==t?0:t.length;if(!r)return -1;var o=null==n?0:Hs(n);return o<0&&(o=Zn(r+o,0)),an(t,Fi(e,3),o)}function gu(t,e,n){var r=null==t?0:t.length;if(!r)return -1;var o=r-1;return n!==u&&(o=Hs(n),o=n<0?Zn(r+o,0):Gn(o,r-1)),an(t,Fi(e,3),o,!0)}function mu(t){return null!=t&&t.length?Wr(t,1):[]}function bu(t){return t&&t.length?t[0]:u}var wu=Co(function(t){var e=tn(t,Zo);return e.length&&e[0]===t[0]?ro(e):[]}),xu=Co(function(t){var e=Ou(t),n=tn(t,Zo);return e===Ou(n)?e=u:n.pop(),n.length&&n[0]===t[0]?ro(n,Fi(e,2)):[]}),Eu=Co(function(t){var e=Ou(t),n=tn(t,Zo);return (e="function"==typeof e?e:u)&&n.pop(),n.length&&n[0]===t[0]?ro(n,u,e):[]});function Ou(t){var e=null==t?0:t.length;return e?t[e-1]:u}var Cu=Co(Su);function Su(t,e){return t&&t.length&&e&&e.length?wo(t,e):t}var Tu=Pi(function(t,e){var n=null==t?0:t.length,r=Dr(t,e);return xo(t,tn(e,function(t){return Gi(t,n)?+t:t}).sort(ei)),r});function ju(t){return null==t?t:Kn.call(t)}var Au=Co(function(t){return qo(Wr(t,1,ws,!0))}),Iu=Co(function(t){var e=Ou(t);return ws(e)&&(e=u),qo(Wr(t,1,ws,!0),Fi(e,2))}),Pu=Co(function(t){var e=Ou(t);return e="function"==typeof e?e:u,qo(Wr(t,1,ws,!0),u,e)});function Ru(t){if(!t||!t.length)return [];var e=0;return t=Ke(t,function(t){if(ws(t))return e=Zn(t.length,e),!0}),_n(e,function(e){return tn(t,hn(e))})}function ku(t,e){if(!t||!t.length)return [];var n=Ru(t);return null==e?n:tn(n,function(t){return Ze(e,u,t)})}var Du=Co(function(t,e){return ws(t)?qr(t,e):[]}),Uu=Co(function(t){return Bo(Ke(t,ws))}),Nu=Co(function(t){var e=Ou(t);return ws(e)&&(e=u),Bo(Ke(t,ws),Fi(e,2))}),Fu=Co(function(t){var e=Ou(t);return e="function"==typeof e?e:u,Bo(Ke(t,ws),u,e)}),Lu=Co(Ru);var qu=Co(function(t){var e=t.length,n=e>1?t[e-1]:u;return n="function"==typeof n?(t.pop(),n):u,ku(t,n)});function zu(t){var e=dr(t);return e.__chain__=!0,e}function Mu(t,e){return e(t)}var Hu=Pi(function(t){var e=t.length,n=e?t[0]:0,r=this.__wrapped__,o=function(e){return Dr(e,t)};return !(e>1||this.__actions__.length)&&r instanceof gr&&Gi(n)?((r=r.slice(n,+n+(e?1:0))).__actions__.push({func:Mu,args:[o],thisArg:u}),new _r(r,this.__chain__).thru(function(t){return e&&!t.length&&t.push(u),t})):this.thru(o)});var $u=ui(function(t,e,n){le.call(t,n)?++t[n]:kr(t,n,1);});var Bu=hi(_u),Wu=hi(gu);function Zu(t,e){return (gs(t)?Ve:zr)(t,Fi(e,3))}function Gu(t,e){return (gs(t)?Je:Mr)(t,Fi(e,3))}var Vu=ui(function(t,e,n){le.call(t,n)?t[n].push(e):kr(t,n,[e]);});var Ju=Co(function(t,e,n){var o=-1,i="function"==typeof e,u=bs(t)?r(t.length):[];return zr(t,function(t){u[++o]=i?Ze(e,t,n):oo(t,e,n);}),u}),Xu=ui(function(t,e,n){kr(t,n,e);});function Ku(t,e){return (gs(t)?tn:ho)(t,Fi(e,3))}var Yu=ui(function(t,e,n){t[n?0:1].push(e);},function(){return [[],[]]});var Qu=Co(function(t,e){if(null==t)return [];var n=e.length;return n>1&&Vi(t,e[0],e[1])?e=[]:n>2&&Vi(e[0],e[1],e[2])&&(e=[e[0]]),mo(t,Wr(e,1),[])}),ts=Fn||function(){return De.Date.now()};function es(t,e,n){return e=n?u:e,e=t&&null==e?t.length:e,Si(t,C,u,u,u,u,e)}function ns(t,e){var n;if("function"!=typeof e)throw new ie(c);return t=Hs(t),function(){return --t>0&&(n=e.apply(this,arguments)),t<=1&&(e=u),n}}var rs=Co(function(t,e,n){var r=g;if(n.length){var o=An(n,Ni(rs));r|=E;}return Si(t,r,e,n,o)}),os=Co(function(t,e,n){var r=g|m;if(n.length){var o=An(n,Ni(os));r|=E;}return Si(e,r,t,n,o)});function is(t,e,n){var r,o,i,s,a,f,l=0,p=!1,h=!1,d=!0;if("function"!=typeof t)throw new ie(c);function v(e){var n=r,i=o;return r=o=u,l=e,s=t.apply(i,n)}function y(t){var n=t-f;return f===u||n>=e||n<0||h&&t-l>=i}function _(){var t=ts();if(y(t))return g(t);a=iu(_,function(t){var n=e-(t-f);return h?Gn(n,i-(t-l)):n}(t));}function g(t){return a=u,d&&r?v(t):(r=o=u,s)}function m(){var t=ts(),n=y(t);if(r=arguments,o=this,f=t,n){if(a===u)return function(t){return l=t,a=iu(_,e),p?v(t):s}(f);if(h)return a=iu(_,e),v(f)}return a===u&&(a=iu(_,e)),s}return e=Bs(e)||0,js(n)&&(p=!!n.leading,i=(h="maxWait"in n)?Zn(Bs(n.maxWait)||0,e):i,d="trailing"in n?!!n.trailing:d),m.cancel=function(){a!==u&&Ko(a),l=0,r=f=o=a=u;},m.flush=function(){return a===u?s:g(ts())},m}var us=Co(function(t,e){return Lr(t,1,e)}),ss=Co(function(t,e,n){return Lr(t,Bs(e)||0,n)});function as(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new ie(c);var n=function n(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var u=t.apply(this,r);return n.cache=i.set(o,u)||i,u};return n.cache=new(as.Cache||wr),n}function cs(t){if("function"!=typeof t)throw new ie(c);return function(){var e=arguments;switch(e.length){case 0:return !t.call(this);case 1:return !t.call(this,e[0]);case 2:return !t.call(this,e[0],e[1]);case 3:return !t.call(this,e[0],e[1],e[2])}return !t.apply(this,e)}}as.Cache=wr;var fs=Jo(function(t,e){var n=(e=1==e.length&&gs(e[0])?tn(e[0],gn(Fi())):tn(Wr(e,1),gn(Fi()))).length;return Co(function(r){for(var o=-1,i=Gn(r.length,n);++o<i;)r[o]=e[o].call(this,r[o]);return Ze(t,this,r)})}),ls=Co(function(t,e){var n=An(e,Ni(ls));return Si(t,E,u,e,n)}),ps=Co(function(t,e){var n=An(e,Ni(ps));return Si(t,O,u,e,n)}),hs=Pi(function(t,e){return Si(t,S,u,u,u,e)});function ds(t,e){return t===e||t!=t&&e!=e}var vs=wi(to),ys=wi(function(t,e){return t>=e}),_s=io(function(){return arguments}())?io:function(t){return As(t)&&le.call(t,"callee")&&!Ue.call(t,"callee")},gs=r.isArray,ms=ze?gn(ze):function(t){return As(t)&&Qr(t)==ct};function bs(t){return null!=t&&Ts(t.length)&&!Cs(t)}function ws(t){return As(t)&&bs(t)}var xs=Hn||Ba,Es=Me?gn(Me):function(t){return As(t)&&Qr(t)==Z};function Os(t){if(!As(t))return !1;var e=Qr(t);return e==V||e==G||"string"==typeof t.message&&"string"==typeof t.name&&!Rs(t)}function Cs(t){if(!js(t))return !1;var e=Qr(t);return e==J||e==X||e==B||e==et}function Ss(t){return "number"==typeof t&&t==Hs(t)}function Ts(t){return "number"==typeof t&&t>-1&&t%1==0&&t<=U}function js(t){var e=void 0===t?"undefined":i(t);return null!=t&&("object"==e||"function"==e)}function As(t){return null!=t&&"object"==(void 0===t?"undefined":i(t))}var Is=He?gn(He):function(t){return As(t)&&$i(t)==K};function Ps(t){return "number"==typeof t||As(t)&&Qr(t)==Y}function Rs(t){if(!As(t)||Qr(t)!=tt)return !1;var e=Re(t);if(null===e)return !0;var n=le.call(e,"constructor")&&e.constructor;return "function"==typeof n&&n instanceof n&&fe.call(n)==ve}var ks=$e?gn($e):function(t){return As(t)&&Qr(t)==nt};var Ds=Be?gn(Be):function(t){return As(t)&&$i(t)==rt};function Us(t){return "string"==typeof t||!gs(t)&&As(t)&&Qr(t)==ot}function Ns(t){return "symbol"==(void 0===t?"undefined":i(t))||As(t)&&Qr(t)==it}var Fs=We?gn(We):function(t){return As(t)&&Ts(t.length)&&!!Te[Qr(t)]};var Ls=wi(po),qs=wi(function(t,e){return t<=e});function zs(t){if(!t)return [];if(bs(t))return Us(t)?kn(t):oi(t);if(qe&&t[qe])return function(t){for(var e,n=[];!(e=t.next()).done;)n.push(e.value);return n}(t[qe]());var e=$i(t);return (e==K?Tn:e==rt?In:da)(t)}function Ms(t){return t?(t=Bs(t))===D||t===-D?(t<0?-1:1)*N:t==t?t:0:0===t?t:0}function Hs(t){var e=Ms(t),n=e%1;return e==e?n?e-n:e:0}function $s(t){return t?Ur(Hs(t),0,L):0}function Bs(t){if("number"==typeof t)return t;if(Ns(t))return F;if(js(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=js(e)?e+"":e;}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(Ut,"");var n=Zt.test(t);return n||Vt.test(t)?Pe(t.slice(2),n?2:8):Wt.test(t)?F:+t}function Ws(t){return ii(t,ua(t))}function Zs(t){return null==t?"":Lo(t)}var Gs=si(function(t,e){if(Yi(e)||bs(e))ii(e,ia(e),t);else for(var n in e)le.call(e,n)&&Ar(t,n,e[n]);}),Vs=si(function(t,e){ii(e,ua(e),t);}),Js=si(function(t,e,n,r){ii(e,ua(e),t,r);}),Xs=si(function(t,e,n,r){ii(e,ia(e),t,r);}),Ks=Pi(Dr);var Ys=Co(function(t,e){t=ne(t);var n=-1,r=e.length,o=r>2?e[2]:u;for(o&&Vi(e[0],e[1],o)&&(r=1);++n<r;)for(var i=e[n],s=ua(i),a=-1,c=s.length;++a<c;){var f=s[a],l=t[f];(l===u||ds(l,ae[f])&&!le.call(t,f))&&(t[f]=i[f]);}return t}),Qs=Co(function(t){return t.push(u,ji),Ze(aa,u,t)});function ta(t,e,n){var r=null==t?u:Kr(t,e);return r===u?n:r}function ea(t,e){return null!=t&&Bi(t,e,no)}var na=yi(function(t,e,n){null!=e&&"function"!=typeof e.toString&&(e=de.call(e)),t[e]=n;},ja(Pa)),ra=yi(function(t,e,n){null!=e&&"function"!=typeof e.toString&&(e=de.call(e)),le.call(t,e)?t[e].push(n):t[e]=[n];},Fi),oa=Co(oo);function ia(t){return bs(t)?Or(t):fo(t)}function ua(t){return bs(t)?Or(t,!0):lo(t)}var sa=si(function(t,e,n){_o(t,e,n);}),aa=si(function(t,e,n,r){_o(t,e,n,r);}),ca=Pi(function(t,e){var n={};if(null==t)return n;var r=!1;e=tn(e,function(e){return e=Vo(e,t),r||(r=e.length>1),e}),ii(t,ki(t),n),r&&(n=Nr(n,h|d|v,Ai));for(var o=e.length;o--;)zo(n,e[o]);return n});var fa=Pi(function(t,e){return null==t?{}:function(t,e){return bo(t,e,function(e,n){return ea(t,n)})}(t,e)});function la(t,e){if(null==t)return {};var n=tn(ki(t),function(t){return [t]});return e=Fi(e),bo(t,n,function(t,n){return e(t,n[0])})}var pa=Ci(ia),ha=Ci(ua);function da(t){return null==t?[]:mn(t,ia(t))}var va=li(function(t,e,n){return e=e.toLowerCase(),t+(n?ya(e):e)});function ya(t){return Oa(Zs(t).toLowerCase())}function _a(t){return (t=Zs(t))&&t.replace(Xt,En).replace(be,"")}var ga=li(function(t,e,n){return t+(n?"-":"")+e.toLowerCase()}),ma=li(function(t,e,n){return t+(n?" ":"")+e.toLowerCase()}),ba=fi("toLowerCase");var wa=li(function(t,e,n){return t+(n?"_":"")+e.toLowerCase()});var xa=li(function(t,e,n){return t+(n?" ":"")+Oa(e)});var Ea=li(function(t,e,n){return t+(n?" ":"")+e.toUpperCase()}),Oa=fi("toUpperCase");function Ca(t,e,n){return t=Zs(t),(e=n?u:e)===u?function(t){return Oe.test(t)}(t)?function(t){return t.match(xe)||[]}(t):function(t){return t.match(Mt)||[]}(t):t.match(e)||[]}var Sa=Co(function(t,e){try{return Ze(t,u,e)}catch(t){return Os(t)?t:new Qt(t)}}),Ta=Pi(function(t,e){return Ve(e,function(e){e=lu(e),kr(t,e,rs(t[e],t));}),t});function ja(t){return function(){return t}}var Aa=di(),Ia=di(!0);function Pa(t){return t}function Ra(t){return co("function"==typeof t?t:Nr(t,h))}var ka=Co(function(t,e){return function(n){return oo(n,t,e)}}),Da=Co(function(t,e){return function(n){return oo(t,n,e)}});function Ua(t,e,n){var r=ia(e),o=Xr(e,r);null!=n||js(e)&&(o.length||!r.length)||(n=e,e=t,t=this,o=Xr(e,ia(e)));var i=!(js(n)&&"chain"in n&&!n.chain),u=Cs(t);return Ve(o,function(n){var r=e[n];t[n]=r,u&&(t.prototype[n]=function(){var e=this.__chain__;if(i||e){var n=t(this.__wrapped__);return (n.__actions__=oi(this.__actions__)).push({func:r,args:arguments,thisArg:t}),n.__chain__=e,n}return r.apply(t,en([this.value()],arguments))});}),t}function Na(){}var Fa=gi(tn),La=gi(Xe),qa=gi(on);function za(t){return Ji(t)?hn(lu(t)):function(t){return function(e){return Kr(e,t)}}(t)}var Ma=bi(),Ha=bi(!0);function $a(){return []}function Ba(){return !1}var Wa=_i(function(t,e){return t+e},0),Za=Ei("ceil"),Ga=_i(function(t,e){return t/e},1),Va=Ei("floor");var Ja,Xa=_i(function(t,e){return t*e},1),Ka=Ei("round"),Ya=_i(function(t,e){return t-e},0);return dr.after=function(t,e){if("function"!=typeof e)throw new ie(c);return t=Hs(t),function(){if(--t<1)return e.apply(this,arguments)}},dr.ary=es,dr.assign=Gs,dr.assignIn=Vs,dr.assignInWith=Js,dr.assignWith=Xs,dr.at=Ks,dr.before=ns,dr.bind=rs,dr.bindAll=Ta,dr.bindKey=os,dr.castArray=function(){if(!arguments.length)return [];var t=arguments[0];return gs(t)?t:[t]},dr.chain=zu,dr.chunk=function(t,e,n){e=(n?Vi(t,e,n):e===u)?1:Zn(Hs(e),0);var o=null==t?0:t.length;if(!o||e<1)return [];for(var i=0,s=0,a=r(qn(o/e));i<o;)a[s++]=Ro(t,i,i+=e);return a},dr.compact=function(t){for(var e=-1,n=null==t?0:t.length,r=0,o=[];++e<n;){var i=t[e];i&&(o[r++]=i);}return o},dr.concat=function(){var t=arguments.length;if(!t)return [];for(var e=r(t-1),n=arguments[0],o=t;o--;)e[o-1]=arguments[o];return en(gs(n)?oi(n):[n],Wr(e,1))},dr.cond=function(t){var e=null==t?0:t.length,n=Fi();return t=e?tn(t,function(t){if("function"!=typeof t[1])throw new ie(c);return [n(t[0]),t[1]]}):[],Co(function(n){for(var r=-1;++r<e;){var o=t[r];if(Ze(o[0],this,n))return Ze(o[1],this,n)}})},dr.conforms=function(t){return function(t){var e=ia(t);return function(n){return Fr(n,t,e)}}(Nr(t,h))},dr.constant=ja,dr.countBy=$u,dr.create=function(t,e){var n=vr(t);return null==e?n:Rr(n,e)},dr.curry=function t(e,n,r){var o=Si(e,w,u,u,u,u,u,n=r?u:n);return o.placeholder=t.placeholder,o},dr.curryRight=function t(e,n,r){var o=Si(e,x,u,u,u,u,u,n=r?u:n);return o.placeholder=t.placeholder,o},dr.debounce=is,dr.defaults=Ys,dr.defaultsDeep=Qs,dr.defer=us,dr.delay=ss,dr.difference=du,dr.differenceBy=vu,dr.differenceWith=yu,dr.drop=function(t,e,n){var r=null==t?0:t.length;return r?Ro(t,(e=n||e===u?1:Hs(e))<0?0:e,r):[]},dr.dropRight=function(t,e,n){var r=null==t?0:t.length;return r?Ro(t,0,(e=r-(e=n||e===u?1:Hs(e)))<0?0:e):[]},dr.dropRightWhile=function(t,e){return t&&t.length?Ho(t,Fi(e,3),!0,!0):[]},dr.dropWhile=function(t,e){return t&&t.length?Ho(t,Fi(e,3),!0):[]},dr.fill=function(t,e,n,r){var o=null==t?0:t.length;return o?(n&&"number"!=typeof n&&Vi(t,e,n)&&(n=0,r=o),function(t,e,n,r){var o=t.length;for((n=Hs(n))<0&&(n=-n>o?0:o+n),(r=r===u||r>o?o:Hs(r))<0&&(r+=o),r=n>r?0:$s(r);n<r;)t[n++]=e;return t}(t,e,n,r)):[]},dr.filter=function(t,e){return (gs(t)?Ke:Br)(t,Fi(e,3))},dr.flatMap=function(t,e){return Wr(Ku(t,e),1)},dr.flatMapDeep=function(t,e){return Wr(Ku(t,e),D)},dr.flatMapDepth=function(t,e,n){return n=n===u?1:Hs(n),Wr(Ku(t,e),n)},dr.flatten=mu,dr.flattenDeep=function(t){return null!=t&&t.length?Wr(t,D):[]},dr.flattenDepth=function(t,e){return null!=t&&t.length?Wr(t,e=e===u?1:Hs(e)):[]},dr.flip=function(t){return Si(t,T)},dr.flow=Aa,dr.flowRight=Ia,dr.fromPairs=function(t){for(var e=-1,n=null==t?0:t.length,r={};++e<n;){var o=t[e];r[o[0]]=o[1];}return r},dr.functions=function(t){return null==t?[]:Xr(t,ia(t))},dr.functionsIn=function(t){return null==t?[]:Xr(t,ua(t))},dr.groupBy=Vu,dr.initial=function(t){return null!=t&&t.length?Ro(t,0,-1):[]},dr.intersection=wu,dr.intersectionBy=xu,dr.intersectionWith=Eu,dr.invert=na,dr.invertBy=ra,dr.invokeMap=Ju,dr.iteratee=Ra,dr.keyBy=Xu,dr.keys=ia,dr.keysIn=ua,dr.map=Ku,dr.mapKeys=function(t,e){var n={};return e=Fi(e,3),Vr(t,function(t,r,o){kr(n,e(t,r,o),t);}),n},dr.mapValues=function(t,e){var n={};return e=Fi(e,3),Vr(t,function(t,r,o){kr(n,r,e(t,r,o));}),n},dr.matches=function(t){return vo(Nr(t,h))},dr.matchesProperty=function(t,e){return yo(t,Nr(e,h))},dr.memoize=as,dr.merge=sa,dr.mergeWith=aa,dr.method=ka,dr.methodOf=Da,dr.mixin=Ua,dr.negate=cs,dr.nthArg=function(t){return t=Hs(t),Co(function(e){return go(e,t)})},dr.omit=ca,dr.omitBy=function(t,e){return la(t,cs(Fi(e)))},dr.once=function(t){return ns(2,t)},dr.orderBy=function(t,e,n,r){return null==t?[]:(gs(e)||(e=null==e?[]:[e]),gs(n=r?u:n)||(n=null==n?[]:[n]),mo(t,e,n))},dr.over=Fa,dr.overArgs=fs,dr.overEvery=La,dr.overSome=qa,dr.partial=ls,dr.partialRight=ps,dr.partition=Yu,dr.pick=fa,dr.pickBy=la,dr.property=za,dr.propertyOf=function(t){return function(e){return null==t?u:Kr(t,e)}},dr.pull=Cu,dr.pullAll=Su,dr.pullAllBy=function(t,e,n){return t&&t.length&&e&&e.length?wo(t,e,Fi(n,2)):t},dr.pullAllWith=function(t,e,n){return t&&t.length&&e&&e.length?wo(t,e,u,n):t},dr.pullAt=Tu,dr.range=Ma,dr.rangeRight=Ha,dr.rearg=hs,dr.reject=function(t,e){return (gs(t)?Ke:Br)(t,cs(Fi(e,3)))},dr.remove=function(t,e){var n=[];if(!t||!t.length)return n;var r=-1,o=[],i=t.length;for(e=Fi(e,3);++r<i;){var u=t[r];e(u,r,t)&&(n.push(u),o.push(r));}return xo(t,o),n},dr.rest=function(t,e){if("function"!=typeof t)throw new ie(c);return Co(t,e=e===u?e:Hs(e))},dr.reverse=ju,dr.sampleSize=function(t,e,n){return e=(n?Vi(t,e,n):e===u)?1:Hs(e),(gs(t)?Sr:To)(t,e)},dr.set=function(t,e,n){return null==t?t:jo(t,e,n)},dr.setWith=function(t,e,n,r){return r="function"==typeof r?r:u,null==t?t:jo(t,e,n,r)},dr.shuffle=function(t){return (gs(t)?Tr:Po)(t)},dr.slice=function(t,e,n){var r=null==t?0:t.length;return r?(n&&"number"!=typeof n&&Vi(t,e,n)?(e=0,n=r):(e=null==e?0:Hs(e),n=n===u?r:Hs(n)),Ro(t,e,n)):[]},dr.sortBy=Qu,dr.sortedUniq=function(t){return t&&t.length?No(t):[]},dr.sortedUniqBy=function(t,e){return t&&t.length?No(t,Fi(e,2)):[]},dr.split=function(t,e,n){return n&&"number"!=typeof n&&Vi(t,e,n)&&(e=n=u),(n=n===u?L:n>>>0)?(t=Zs(t))&&("string"==typeof e||null!=e&&!ks(e))&&!(e=Lo(e))&&Sn(t)?Xo(kn(t),0,n):t.split(e,n):[]},dr.spread=function(t,e){if("function"!=typeof t)throw new ie(c);return e=null==e?0:Zn(Hs(e),0),Co(function(n){var r=n[e],o=Xo(n,0,e);return r&&en(o,r),Ze(t,this,o)})},dr.tail=function(t){var e=null==t?0:t.length;return e?Ro(t,1,e):[]},dr.take=function(t,e,n){return t&&t.length?Ro(t,0,(e=n||e===u?1:Hs(e))<0?0:e):[]},dr.takeRight=function(t,e,n){var r=null==t?0:t.length;return r?Ro(t,(e=r-(e=n||e===u?1:Hs(e)))<0?0:e,r):[]},dr.takeRightWhile=function(t,e){return t&&t.length?Ho(t,Fi(e,3),!1,!0):[]},dr.takeWhile=function(t,e){return t&&t.length?Ho(t,Fi(e,3)):[]},dr.tap=function(t,e){return e(t),t},dr.throttle=function(t,e,n){var r=!0,o=!0;if("function"!=typeof t)throw new ie(c);return js(n)&&(r="leading"in n?!!n.leading:r,o="trailing"in n?!!n.trailing:o),is(t,e,{leading:r,maxWait:e,trailing:o})},dr.thru=Mu,dr.toArray=zs,dr.toPairs=pa,dr.toPairsIn=ha,dr.toPath=function(t){return gs(t)?tn(t,lu):Ns(t)?[t]:oi(fu(Zs(t)))},dr.toPlainObject=Ws,dr.transform=function(t,e,n){var r=gs(t),o=r||xs(t)||Fs(t);if(e=Fi(e,4),null==n){var i=t&&t.constructor;n=o?r?new i:[]:js(t)&&Cs(i)?vr(Re(t)):{};}return (o?Ve:Vr)(t,function(t,r,o){return e(n,t,r,o)}),n},dr.unary=function(t){return es(t,1)},dr.union=Au,dr.unionBy=Iu,dr.unionWith=Pu,dr.uniq=function(t){return t&&t.length?qo(t):[]},dr.uniqBy=function(t,e){return t&&t.length?qo(t,Fi(e,2)):[]},dr.uniqWith=function(t,e){return e="function"==typeof e?e:u,t&&t.length?qo(t,u,e):[]},dr.unset=function(t,e){return null==t||zo(t,e)},dr.unzip=Ru,dr.unzipWith=ku,dr.update=function(t,e,n){return null==t?t:Mo(t,e,Go(n))},dr.updateWith=function(t,e,n,r){return r="function"==typeof r?r:u,null==t?t:Mo(t,e,Go(n),r)},dr.values=da,dr.valuesIn=function(t){return null==t?[]:mn(t,ua(t))},dr.without=Du,dr.words=Ca,dr.wrap=function(t,e){return ls(Go(e),t)},dr.xor=Uu,dr.xorBy=Nu,dr.xorWith=Fu,dr.zip=Lu,dr.zipObject=function(t,e){return Wo(t||[],e||[],Ar)},dr.zipObjectDeep=function(t,e){return Wo(t||[],e||[],jo)},dr.zipWith=qu,dr.entries=pa,dr.entriesIn=ha,dr.extend=Vs,dr.extendWith=Js,Ua(dr,dr),dr.add=Wa,dr.attempt=Sa,dr.camelCase=va,dr.capitalize=ya,dr.ceil=Za,dr.clamp=function(t,e,n){return n===u&&(n=e,e=u),n!==u&&(n=(n=Bs(n))==n?n:0),e!==u&&(e=(e=Bs(e))==e?e:0),Ur(Bs(t),e,n)},dr.clone=function(t){return Nr(t,v)},dr.cloneDeep=function(t){return Nr(t,h|v)},dr.cloneDeepWith=function(t,e){return Nr(t,h|v,e="function"==typeof e?e:u)},dr.cloneWith=function(t,e){return Nr(t,v,e="function"==typeof e?e:u)},dr.conformsTo=function(t,e){return null==e||Fr(t,e,ia(e))},dr.deburr=_a,dr.defaultTo=function(t,e){return null==t||t!=t?e:t},dr.divide=Ga,dr.endsWith=function(t,e,n){t=Zs(t),e=Lo(e);var r=t.length,o=n=n===u?r:Ur(Hs(n),0,r);return (n-=e.length)>=0&&t.slice(n,o)==e},dr.eq=ds,dr.escape=function(t){return (t=Zs(t))&&St.test(t)?t.replace(Ot,On):t},dr.escapeRegExp=function(t){return (t=Zs(t))&&Dt.test(t)?t.replace(kt,"\\$&"):t},dr.every=function(t,e,n){var r=gs(t)?Xe:Hr;return n&&Vi(t,e,n)&&(e=u),r(t,Fi(e,3))},dr.find=Bu,dr.findIndex=_u,dr.findKey=function(t,e){return sn(t,Fi(e,3),Vr)},dr.findLast=Wu,dr.findLastIndex=gu,dr.findLastKey=function(t,e){return sn(t,Fi(e,3),Jr)},dr.floor=Va,dr.forEach=Zu,dr.forEachRight=Gu,dr.forIn=function(t,e){return null==t?t:Zr(t,Fi(e,3),ua)},dr.forInRight=function(t,e){return null==t?t:Gr(t,Fi(e,3),ua)},dr.forOwn=function(t,e){return t&&Vr(t,Fi(e,3))},dr.forOwnRight=function(t,e){return t&&Jr(t,Fi(e,3))},dr.get=ta,dr.gt=vs,dr.gte=ys,dr.has=function(t,e){return null!=t&&Bi(t,e,eo)},dr.hasIn=ea,dr.head=bu,dr.identity=Pa,dr.includes=function(t,e,n,r){t=bs(t)?t:da(t),n=n&&!r?Hs(n):0;var o=t.length;return n<0&&(n=Zn(o+n,0)),Us(t)?n<=o&&t.indexOf(e,n)>-1:!!o&&cn(t,e,n)>-1},dr.indexOf=function(t,e,n){var r=null==t?0:t.length;if(!r)return -1;var o=null==n?0:Hs(n);return o<0&&(o=Zn(r+o,0)),cn(t,e,o)},dr.inRange=function(t,e,n){return e=Ms(e),n===u?(n=e,e=0):n=Ms(n),function(t,e,n){return t>=Gn(e,n)&&t<Zn(e,n)}(t=Bs(t),e,n)},dr.invoke=oa,dr.isArguments=_s,dr.isArray=gs,dr.isArrayBuffer=ms,dr.isArrayLike=bs,dr.isArrayLikeObject=ws,dr.isBoolean=function(t){return !0===t||!1===t||As(t)&&Qr(t)==W},dr.isBuffer=xs,dr.isDate=Es,dr.isElement=function(t){return As(t)&&1===t.nodeType&&!Rs(t)},dr.isEmpty=function(t){if(null==t)return !0;if(bs(t)&&(gs(t)||"string"==typeof t||"function"==typeof t.splice||xs(t)||Fs(t)||_s(t)))return !t.length;var e=$i(t);if(e==K||e==rt)return !t.size;if(Yi(t))return !fo(t).length;for(var n in t)if(le.call(t,n))return !1;return !0},dr.isEqual=function(t,e){return uo(t,e)},dr.isEqualWith=function(t,e,n){var r=(n="function"==typeof n?n:u)?n(t,e):u;return r===u?uo(t,e,u,n):!!r},dr.isError=Os,dr.isFinite=function(t){return "number"==typeof t&&$n(t)},dr.isFunction=Cs,dr.isInteger=Ss,dr.isLength=Ts,dr.isMap=Is,dr.isMatch=function(t,e){return t===e||so(t,e,qi(e))},dr.isMatchWith=function(t,e,n){return n="function"==typeof n?n:u,so(t,e,qi(e),n)},dr.isNaN=function(t){return Ps(t)&&t!=+t},dr.isNative=function(t){if(Ki(t))throw new Qt(a);return ao(t)},dr.isNil=function(t){return null==t},dr.isNull=function(t){return null===t},dr.isNumber=Ps,dr.isObject=js,dr.isObjectLike=As,dr.isPlainObject=Rs,dr.isRegExp=ks,dr.isSafeInteger=function(t){return Ss(t)&&t>=-U&&t<=U},dr.isSet=Ds,dr.isString=Us,dr.isSymbol=Ns,dr.isTypedArray=Fs,dr.isUndefined=function(t){return t===u},dr.isWeakMap=function(t){return As(t)&&$i(t)==st},dr.isWeakSet=function(t){return As(t)&&Qr(t)==at},dr.join=function(t,e){return null==t?"":Bn.call(t,e)},dr.kebabCase=ga,dr.last=Ou,dr.lastIndexOf=function(t,e,n){var r=null==t?0:t.length;if(!r)return -1;var o=r;return n!==u&&(o=(o=Hs(n))<0?Zn(r+o,0):Gn(o,r-1)),e==e?function(t,e,n){for(var r=n+1;r--;)if(t[r]===e)return r;return r}(t,e,o):an(t,ln,o,!0)},dr.lowerCase=ma,dr.lowerFirst=ba,dr.lt=Ls,dr.lte=qs,dr.max=function(t){return t&&t.length?$r(t,Pa,to):u},dr.maxBy=function(t,e){return t&&t.length?$r(t,Fi(e,2),to):u},dr.mean=function(t){return pn(t,Pa)},dr.meanBy=function(t,e){return pn(t,Fi(e,2))},dr.min=function(t){return t&&t.length?$r(t,Pa,po):u},dr.minBy=function(t,e){return t&&t.length?$r(t,Fi(e,2),po):u},dr.stubArray=$a,dr.stubFalse=Ba,dr.stubObject=function(){return {}},dr.stubString=function(){return ""},dr.stubTrue=function(){return !0},dr.multiply=Xa,dr.nth=function(t,e){return t&&t.length?go(t,Hs(e)):u},dr.noConflict=function(){return De._===this&&(De._=ye),this},dr.noop=Na,dr.now=ts,dr.pad=function(t,e,n){t=Zs(t);var r=(e=Hs(e))?Rn(t):0;if(!e||r>=e)return t;var o=(e-r)/2;return mi(zn(o),n)+t+mi(qn(o),n)},dr.padEnd=function(t,e,n){t=Zs(t);var r=(e=Hs(e))?Rn(t):0;return e&&r<e?t+mi(e-r,n):t},dr.padStart=function(t,e,n){t=Zs(t);var r=(e=Hs(e))?Rn(t):0;return e&&r<e?mi(e-r,n)+t:t},dr.parseInt=function(t,e,n){return n||null==e?e=0:e&&(e=+e),Jn(Zs(t).replace(Nt,""),e||0)},dr.random=function(t,e,n){if(n&&"boolean"!=typeof n&&Vi(t,e,n)&&(e=n=u),n===u&&("boolean"==typeof e?(n=e,e=u):"boolean"==typeof t&&(n=t,t=u)),t===u&&e===u?(t=0,e=1):(t=Ms(t),e===u?(e=t,t=0):e=Ms(e)),t>e){var r=t;t=e,e=r;}if(n||t%1||e%1){var o=Xn();return Gn(t+o*(e-t+Ie("1e-"+((o+"").length-1))),e)}return Eo(t,e)},dr.reduce=function(t,e,n){var r=gs(t)?nn:vn,o=arguments.length<3;return r(t,Fi(e,4),n,o,zr)},dr.reduceRight=function(t,e,n){var r=gs(t)?rn:vn,o=arguments.length<3;return r(t,Fi(e,4),n,o,Mr)},dr.repeat=function(t,e,n){return e=(n?Vi(t,e,n):e===u)?1:Hs(e),Oo(Zs(t),e)},dr.replace=function(){var t=arguments,e=Zs(t[0]);return t.length<3?e:e.replace(t[1],t[2])},dr.result=function(t,e,n){var r=-1,o=(e=Vo(e,t)).length;for(o||(o=1,t=u);++r<o;){var i=null==t?u:t[lu(e[r])];i===u&&(r=o,i=n),t=Cs(i)?i.call(t):i;}return t},dr.round=Ka,dr.runInContext=t,dr.sample=function(t){return (gs(t)?Cr:So)(t)},dr.size=function(t){if(null==t)return 0;if(bs(t))return Us(t)?Rn(t):t.length;var e=$i(t);return e==K||e==rt?t.size:fo(t).length},dr.snakeCase=wa,dr.some=function(t,e,n){var r=gs(t)?on:ko;return n&&Vi(t,e,n)&&(e=u),r(t,Fi(e,3))},dr.sortedIndex=function(t,e){return Do(t,e)},dr.sortedIndexBy=function(t,e,n){return Uo(t,e,Fi(n,2))},dr.sortedIndexOf=function(t,e){var n=null==t?0:t.length;if(n){var r=Do(t,e);if(r<n&&ds(t[r],e))return r}return -1},dr.sortedLastIndex=function(t,e){return Do(t,e,!0)},dr.sortedLastIndexBy=function(t,e,n){return Uo(t,e,Fi(n,2),!0)},dr.sortedLastIndexOf=function(t,e){if(null!=t&&t.length){var n=Do(t,e,!0)-1;if(ds(t[n],e))return n}return -1},dr.startCase=xa,dr.startsWith=function(t,e,n){return t=Zs(t),n=null==n?0:Ur(Hs(n),0,t.length),e=Lo(e),t.slice(n,n+e.length)==e},dr.subtract=Ya,dr.sum=function(t){return t&&t.length?yn(t,Pa):0},dr.sumBy=function(t,e){return t&&t.length?yn(t,Fi(e,2)):0},dr.template=function(t,e,n){var r=dr.templateSettings;n&&Vi(t,e,n)&&(e=u),t=Zs(t),e=Js({},e,r,Ti);var o,i,s=Js({},e.imports,r.imports,Ti),a=ia(s),c=mn(s,a),f=0,l=e.interpolate||Kt,p="__p += '",h=re((e.escape||Kt).source+"|"+l.source+"|"+(l===At?$t:Kt).source+"|"+(e.evaluate||Kt).source+"|$","g"),d="//# sourceURL="+("sourceURL"in e?e.sourceURL:"lodash.templateSources["+ ++Se+"]")+"\n";t.replace(h,function(e,n,r,u,s,a){return r||(r=u),p+=t.slice(f,a).replace(Yt,Cn),n&&(o=!0,p+="' +\n__e("+n+") +\n'"),s&&(i=!0,p+="';\n"+s+";\n__p += '"),r&&(p+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),f=a+e.length,e}),p+="';\n";var v=e.variable;v||(p="with (obj) {\n"+p+"\n}\n"),p=(i?p.replace(bt,""):p).replace(wt,"$1").replace(xt,"$1;"),p="function("+(v||"obj")+") {\n"+(v?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(i?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+p+"return __p\n}";var y=Sa(function(){return te(a,d+"return "+p).apply(u,c)});if(y.source=p,Os(y))throw y;return y},dr.times=function(t,e){if((t=Hs(t))<1||t>U)return [];var n=L,r=Gn(t,L);e=Fi(e),t-=L;for(var o=_n(r,e);++n<t;)e(n);return o},dr.toFinite=Ms,dr.toInteger=Hs,dr.toLength=$s,dr.toLower=function(t){return Zs(t).toLowerCase()},dr.toNumber=Bs,dr.toSafeInteger=function(t){return t?Ur(Hs(t),-U,U):0===t?t:0},dr.toString=Zs,dr.toUpper=function(t){return Zs(t).toUpperCase()},dr.trim=function(t,e,n){if((t=Zs(t))&&(n||e===u))return t.replace(Ut,"");if(!t||!(e=Lo(e)))return t;var r=kn(t),o=kn(e);return Xo(r,wn(r,o),xn(r,o)+1).join("")},dr.trimEnd=function(t,e,n){if((t=Zs(t))&&(n||e===u))return t.replace(Ft,"");if(!t||!(e=Lo(e)))return t;var r=kn(t);return Xo(r,0,xn(r,kn(e))+1).join("")},dr.trimStart=function(t,e,n){if((t=Zs(t))&&(n||e===u))return t.replace(Nt,"");if(!t||!(e=Lo(e)))return t;var r=kn(t);return Xo(r,wn(r,kn(e))).join("")},dr.truncate=function(t,e){var n=j,r=A;if(js(e)){var o="separator"in e?e.separator:o;n="length"in e?Hs(e.length):n,r="omission"in e?Lo(e.omission):r;}var i=(t=Zs(t)).length;if(Sn(t)){var s=kn(t);i=s.length;}if(n>=i)return t;var a=n-Rn(r);if(a<1)return r;var c=s?Xo(s,0,a).join(""):t.slice(0,a);if(o===u)return c+r;if(s&&(a+=c.length-a),ks(o)){if(t.slice(a).search(o)){var f,l=c;for(o.global||(o=re(o.source,Zs(Bt.exec(o))+"g")),o.lastIndex=0;f=o.exec(l);)var p=f.index;c=c.slice(0,p===u?a:p);}}else if(t.indexOf(Lo(o),a)!=a){var h=c.lastIndexOf(o);h>-1&&(c=c.slice(0,h));}return c+r},dr.unescape=function(t){return (t=Zs(t))&&Ct.test(t)?t.replace(Et,Dn):t},dr.uniqueId=function(t){var e=++pe;return Zs(t)+e},dr.upperCase=Ea,dr.upperFirst=Oa,dr.each=Zu,dr.eachRight=Gu,dr.first=bu,Ua(dr,(Ja={},Vr(dr,function(t,e){le.call(dr.prototype,e)||(Ja[e]=t);}),Ja),{chain:!1}),dr.VERSION="4.17.11",Ve(["bind","bindKey","curry","curryRight","partial","partialRight"],function(t){dr[t].placeholder=dr;}),Ve(["drop","take"],function(t,e){gr.prototype[t]=function(n){n=n===u?1:Zn(Hs(n),0);var r=this.__filtered__&&!e?new gr(this):this.clone();return r.__filtered__?r.__takeCount__=Gn(n,r.__takeCount__):r.__views__.push({size:Gn(n,L),type:t+(r.__dir__<0?"Right":"")}),r},gr.prototype[t+"Right"]=function(e){return this.reverse()[t](e).reverse()};}),Ve(["filter","map","takeWhile"],function(t,e){var n=e+1,r=n==R||3==n;gr.prototype[t]=function(t){var e=this.clone();return e.__iteratees__.push({iteratee:Fi(t,3),type:n}),e.__filtered__=e.__filtered__||r,e};}),Ve(["head","last"],function(t,e){var n="take"+(e?"Right":"");gr.prototype[t]=function(){return this[n](1).value()[0]};}),Ve(["initial","tail"],function(t,e){var n="drop"+(e?"":"Right");gr.prototype[t]=function(){return this.__filtered__?new gr(this):this[n](1)};}),gr.prototype.compact=function(){return this.filter(Pa)},gr.prototype.find=function(t){return this.filter(t).head()},gr.prototype.findLast=function(t){return this.reverse().find(t)},gr.prototype.invokeMap=Co(function(t,e){return "function"==typeof t?new gr(this):this.map(function(n){return oo(n,t,e)})}),gr.prototype.reject=function(t){return this.filter(cs(Fi(t)))},gr.prototype.slice=function(t,e){t=Hs(t);var n=this;return n.__filtered__&&(t>0||e<0)?new gr(n):(t<0?n=n.takeRight(-t):t&&(n=n.drop(t)),e!==u&&(n=(e=Hs(e))<0?n.dropRight(-e):n.take(e-t)),n)},gr.prototype.takeRightWhile=function(t){return this.reverse().takeWhile(t).reverse()},gr.prototype.toArray=function(){return this.take(L)},Vr(gr.prototype,function(t,e){var n=/^(?:filter|find|map|reject)|While$/.test(e),r=/^(?:head|last)$/.test(e),o=dr[r?"take"+("last"==e?"Right":""):e],i=r||/^find/.test(e);o&&(dr.prototype[e]=function(){var e=this.__wrapped__,s=r?[1]:arguments,a=e instanceof gr,c=s[0],f=a||gs(e),l=function(t){var e=o.apply(dr,en([t],s));return r&&p?e[0]:e};f&&n&&"function"==typeof c&&1!=c.length&&(a=f=!1);var p=this.__chain__,h=!!this.__actions__.length,d=i&&!p,v=a&&!h;if(!i&&f){e=v?e:new gr(this);var y=t.apply(e,s);return y.__actions__.push({func:Mu,args:[l],thisArg:u}),new _r(y,p)}return d&&v?t.apply(this,s):(y=this.thru(l),d?r?y.value()[0]:y.value():y)});}),Ve(["pop","push","shift","sort","splice","unshift"],function(t){var e=ue[t],n=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",r=/^(?:pop|shift)$/.test(t);dr.prototype[t]=function(){var t=arguments;if(r&&!this.__chain__){var o=this.value();return e.apply(gs(o)?o:[],t)}return this[n](function(n){return e.apply(gs(n)?n:[],t)})};}),Vr(gr.prototype,function(t,e){var n=dr[e];if(n){var r=n.name+"";(ir[r]||(ir[r]=[])).push({name:e,func:n});}}),ir[vi(u,m).name]=[{name:"wrapper",func:u}],gr.prototype.clone=function(){var t=new gr(this.__wrapped__);return t.__actions__=oi(this.__actions__),t.__dir__=this.__dir__,t.__filtered__=this.__filtered__,t.__iteratees__=oi(this.__iteratees__),t.__takeCount__=this.__takeCount__,t.__views__=oi(this.__views__),t},gr.prototype.reverse=function(){if(this.__filtered__){var t=new gr(this);t.__dir__=-1,t.__filtered__=!0;}else (t=this.clone()).__dir__*=-1;return t},gr.prototype.value=function(){var t=this.__wrapped__.value(),e=this.__dir__,n=gs(t),r=e<0,o=n?t.length:0,i=function(t,e,n){for(var r=-1,o=n.length;++r<o;){var i=n[r],u=i.size;switch(i.type){case"drop":t+=u;break;case"dropRight":e-=u;break;case"take":e=Gn(e,t+u);break;case"takeRight":t=Zn(t,e-u);}}return {start:t,end:e}}(0,o,this.__views__),u=i.start,s=i.end,a=s-u,c=r?s:u-1,f=this.__iteratees__,l=f.length,p=0,h=Gn(a,this.__takeCount__);if(!n||!r&&o==a&&h==a)return $o(t,this.__actions__);var d=[];t:for(;a--&&p<h;){for(var v=-1,y=t[c+=e];++v<l;){var _=f[v],g=_.iteratee,m=_.type,b=g(y);if(m==k)y=b;else if(!b){if(m==R)continue t;break t}}d[p++]=y;}return d},dr.prototype.at=Hu,dr.prototype.chain=function(){return zu(this)},dr.prototype.commit=function(){return new _r(this.value(),this.__chain__)},dr.prototype.next=function(){this.__values__===u&&(this.__values__=zs(this.value()));var t=this.__index__>=this.__values__.length;return {done:t,value:t?u:this.__values__[this.__index__++]}},dr.prototype.plant=function(t){for(var e,n=this;n instanceof yr;){var r=hu(n);r.__index__=0,r.__values__=u,e?o.__wrapped__=r:e=r;var o=r;n=n.__wrapped__;}return o.__wrapped__=t,e},dr.prototype.reverse=function(){var t=this.__wrapped__;if(t instanceof gr){var e=t;return this.__actions__.length&&(e=new gr(this)),(e=e.reverse()).__actions__.push({func:Mu,args:[ju],thisArg:u}),new _r(e,this.__chain__)}return this.thru(ju)},dr.prototype.toJSON=dr.prototype.valueOf=dr.prototype.value=function(){return $o(this.__wrapped__,this.__actions__)},dr.prototype.first=dr.prototype.head,qe&&(dr.prototype[qe]=function(){return this}),dr}();"object"==i(n(3))&&n(3)?(De._=Un,(o=function(){return Un}.call(e,n,e,r))===u||(r.exports=o)):Ne?((Ne.exports=Un)._=Un,Ue._=Un):De._=Un;}).call(void 0);}).call(this,n(1),n(8)(t));},function(t,e,n){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t};},function(t,e,n){var r=n(0),o=n(10);t.exports=function(t,e,n,r){return function(t,e,n,r){var i,u,s={},a=new o,c=function(t){var e=t.v!==i?t.v:t.w,r=s[e],o=n(t),c=u.distance+o;if(o<0)throw new Error("dijkstra does not allow negative edge weights. Bad edge: "+t+" Weight: "+o);c<r.distance&&(r.distance=c,r.predecessor=i,a.decrease(e,c));};t.nodes().forEach(function(t){var n=t===e?0:Number.POSITIVE_INFINITY;s[t]={distance:n},a.add(t,n);});for(;a.size()>0&&(i=a.removeMin(),(u=s[i]).distance!==Number.POSITIVE_INFINITY);)r(i).forEach(c);return s}(t,String(e),n||i,r||function(e){return t.outEdges(e)})};var i=r.constant(1);},function(t,e,n){var r=n(0);function o(){this._arr=[],this._keyIndices={};}t.exports=o,o.prototype.size=function(){return this._arr.length},o.prototype.keys=function(){return this._arr.map(function(t){return t.key})},o.prototype.has=function(t){return r.has(this._keyIndices,t)},o.prototype.priority=function(t){var e=this._keyIndices[t];if(void 0!==e)return this._arr[e].priority},o.prototype.min=function(){if(0===this.size())throw new Error("Queue underflow");return this._arr[0].key},o.prototype.add=function(t,e){var n=this._keyIndices;if(t=String(t),!r.has(n,t)){var o=this._arr,i=o.length;return n[t]=i,o.push({key:t,priority:e}),this._decrease(i),!0}return !1},o.prototype.removeMin=function(){this._swap(0,this._arr.length-1);var t=this._arr.pop();return delete this._keyIndices[t.key],this._heapify(0),t.key},o.prototype.decrease=function(t,e){var n=this._keyIndices[t];if(e>this._arr[n].priority)throw new Error("New priority is greater than current priority. Key: "+t+" Old: "+this._arr[n].priority+" New: "+e);this._arr[n].priority=e,this._decrease(n);},o.prototype._heapify=function(t){var e=this._arr,n=2*t,r=n+1,o=t;n<e.length&&(o=e[n].priority<e[o].priority?n:o,r<e.length&&(o=e[r].priority<e[o].priority?r:o),o!==t&&(this._swap(t,o),this._heapify(o)));},o.prototype._decrease=function(t){for(var e,n=this._arr,r=n[t].priority;0!==t&&!(n[e=t>>1].priority<r);)this._swap(t,e),t=e;},o.prototype._swap=function(t,e){var n=this._arr,r=this._keyIndices,o=n[t],i=n[e];n[t]=i,n[e]=o,r[i.key]=t,r[o.key]=e;};},function(t,e,n){var r=n(0);t.exports=function(t){var e=0,n=[],o={},i=[];return t.nodes().forEach(function(u){r.has(o,u)||function u(s){var a=o[s]={onStack:!0,lowlink:e,index:e++};if(n.push(s),t.successors(s).forEach(function(t){r.has(o,t)?o[t].onStack&&(a.lowlink=Math.min(a.lowlink,o[t].index)):(u(t),a.lowlink=Math.min(a.lowlink,o[t].lowlink));}),a.lowlink===a.index){var c,f=[];do{c=n.pop(),o[c].onStack=!1,f.push(c);}while(s!==c);i.push(f);}}(u);}),i};},function(t,e,n){var r=n(0);function o(t){var e={},n={},o=[];if(r.each(t.sinks(),function u(s){if(r.has(n,s))throw new i;r.has(e,s)||(n[s]=!0,e[s]=!0,r.each(t.predecessors(s),u),delete n[s],o.push(s));}),r.size(e)!==t.nodeCount())throw new i;return o}function i(){}t.exports=o,o.CycleException=i;},function(t,e,n){var r=n(0);t.exports=function(t,e,n){r.isArray(e)||(e=[e]);var o=(t.isDirected()?t.successors:t.neighbors).bind(t),i=[],u={};return r.each(e,function(e){if(!t.hasNode(e))throw new Error("Graph does not have node: "+e);!function t(e,n,o,i,u,s){r.has(i,n)||(i[n]=!0,o||s.push(n),r.each(u(n),function(n){t(e,n,o,i,u,s);}),o&&s.push(n));}(t,e,"post"===n,u,o,i);}),i};},function(t,e,n){(function(e){var r=n(37),o=["delete","get","head","patch","post","put"];t.exports.load=function(t,n,i){var u,s,a=n.method?n.method.toLowerCase():"get";function c(t,n){t?i(t):("[object process]"===Object.prototype.toString.call(void 0!==e?e:0)&&"function"==typeof n.buffer&&n.buffer(!0),n.end(function(t,e){t?i(t):i(void 0,e);}));}if(void 0!==n.method?"string"!=typeof n.method?u=new TypeError("options.method must be a string"):-1===o.indexOf(n.method)&&(u=new TypeError("options.method must be one of the following: "+o.slice(0,o.length-1).join(", ")+" or "+o[o.length-1])):void 0!==n.prepareRequest&&"function"!=typeof n.prepareRequest&&(u=new TypeError("options.prepareRequest must be a function")),u)i(u);else if(s=r["delete"===a?"del":a](t),n.prepareRequest)try{n.prepareRequest(s,c);}catch(t){i(t);}else c(void 0,s);};}).call(this,n(2));},function(t,e,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports=function(t){return null!==t&&"object"===(void 0===t?"undefined":r(t))};},function(t,e,n){(function(r,o){var i,u,s,a,c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};
/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
a=function(){var t,e,n,r=Object.prototype.toString,i=void 0!==o?function(t){return o(t)}:setTimeout;try{Object.defineProperty({},"x",{}),t=function(t,e,n,r){return Object.defineProperty(t,e,{value:n,writable:!0,configurable:!1!==r})};}catch(e){t=function(t,e,n){return t[e]=n,t};}function u(t,r){n.add(t,r),e||(e=i(n.drain));}function s(t){var e,n=void 0===t?"undefined":c(t);return null==t||"object"!=n&&"function"!=n||(e=t.then),"function"==typeof e&&e}function a(){for(var t=0;t<this.chain.length;t++)f(this,1===this.state?this.chain[t].success:this.chain[t].failure,this.chain[t]);this.chain.length=0;}function f(t,e,n){var r,o;try{!1===e?n.reject(t.msg):(r=!0===e?t.msg:e.call(void 0,t.msg))===n.promise?n.reject(TypeError("Promise-chain cycle")):(o=s(r))?o.call(r,n.resolve,n.reject):n.resolve(r);}catch(t){n.reject(t);}}function l(t){var e=this;e.triggered||(e.triggered=!0,e.def&&(e=e.def),e.msg=t,e.state=2,e.chain.length>0&&u(a,e));}function p(t,e,n,r){for(var o=0;o<e.length;o++)!function(o){t.resolve(e[o]).then(function(t){n(o,t);},r);}(o);}function h(t){this.def=t,this.triggered=!1;}function d(t){this.promise=t,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0;}function v(t){if("function"!=typeof t)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var e=new d(this);this.then=function(t,n){var r={success:"function"!=typeof t||t,failure:"function"==typeof n&&n};return r.promise=new this.constructor(function(t,e){if("function"!=typeof t||"function"!=typeof e)throw TypeError("Not a function");r.resolve=t,r.reject=e;}),e.chain.push(r),0!==e.state&&u(a,e),r.promise},this.catch=function(t){return this.then(void 0,t)};try{t.call(void 0,function(t){(function t(e){var n,r=this;if(!r.triggered){r.triggered=!0,r.def&&(r=r.def);try{(n=s(e))?u(function(){var o=new h(r);try{n.call(e,function(){t.apply(o,arguments);},function(){l.apply(o,arguments);});}catch(t){l.call(o,t);}}):(r.msg=e,r.state=1,r.chain.length>0&&u(a,r));}catch(t){l.call(new h(r),t);}}}).call(e,t);},function(t){l.call(e,t);});}catch(t){l.call(e,t);}}n=function(){var t,n,r;function o(t,e){this.fn=t,this.self=e,this.next=void 0;}return {add:function(e,i){r=new o(e,i),n?n.next=r:t=r,n=r,r=void 0;},drain:function(){var r=t;for(t=n=e=void 0;r;)r.fn.call(r.self),r=r.next;}}}();var y=t({},"constructor",v,!1);return v.prototype=y,t(y,"__NPO__",0,!1),t(v,"resolve",function(t){return t&&"object"==(void 0===t?"undefined":c(t))&&1===t.__NPO__?t:new this(function(e,n){if("function"!=typeof e||"function"!=typeof n)throw TypeError("Not a function");e(t);})}),t(v,"reject",function(t){return new this(function(e,n){if("function"!=typeof e||"function"!=typeof n)throw TypeError("Not a function");n(t);})}),t(v,"all",function(t){var e=this;return "[object Array]"!=r.call(t)?e.reject(TypeError("Not an array")):0===t.length?e.resolve([]):new e(function(n,r){if("function"!=typeof n||"function"!=typeof r)throw TypeError("Not a function");var o=t.length,i=Array(o),u=0;p(e,t,function(t,e){i[t]=e,++u===o&&n(i);},r);})}),t(v,"race",function(t){var e=this;return "[object Array]"!=r.call(t)?e.reject(TypeError("Not an array")):new e(function(n,r){if("function"!=typeof n||"function"!=typeof r)throw TypeError("Not a function");p(e,t,function(t,e){n(e);},r);})}),v},(s=void 0!==r?r:void 0)[u="Promise"]=s[u]||a(),t.exports?t.exports=s[u]:void 0===(i=function(){return s[u]}.call(e,n,e,t))||(t.exports=i);}).call(this,n(1),n(43).setImmediate);},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.buildExps=o;var r=n(6);function o(t){var e=(0, r.merge)("[0-9]","[A-Fa-f]"),n=(0, r.subexp)((0, r.subexp)("%[EFef]"+e+"%"+e+e+"%"+e+e)+"|"+(0, r.subexp)("%[89A-Fa-f]"+e+"%"+e+e)+"|"+(0, r.subexp)("%"+e+e)),o="[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",i=(0, r.merge)("[\\:\\/\\?\\#\\[\\]\\@]",o),u=t?"[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]":"[]",s=t?"[\\uE000-\\uF8FF]":"[]",a=(0, r.merge)("[A-Za-z]","[0-9]","[\\-\\.\\_\\~]",u),c=(0, r.subexp)("[A-Za-z]"+(0, r.merge)("[A-Za-z]","[0-9]","[\\+\\-\\.]")+"*"),f=(0, r.subexp)((0, r.subexp)(n+"|"+(0, r.merge)(a,o,"[\\:]"))+"*"),l=(0, r.subexp)((0, r.subexp)("25[0-5]")+"|"+(0, r.subexp)("2[0-4][0-9]")+"|"+(0, r.subexp)("1[0-9][0-9]")+"|"+(0, r.subexp)("[1-9][0-9]")+"|[0-9]"),p=(0, r.subexp)(l+"\\."+l+"\\."+l+"\\."+l),h=(0, r.subexp)(e+"{1,4}"),d=(0, r.subexp)((0, r.subexp)(h+"\\:"+h)+"|"+p),v=(0, r.subexp)((0, r.subexp)(h+"\\:")+"{6}"+d),y=(0, r.subexp)("\\:\\:"+(0, r.subexp)(h+"\\:")+"{5}"+d),_=(0, r.subexp)((0, r.subexp)(h)+"?\\:\\:"+(0, r.subexp)(h+"\\:")+"{4}"+d),g=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,1}"+h)+"?\\:\\:"+(0, r.subexp)(h+"\\:")+"{3}"+d),m=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,2}"+h)+"?\\:\\:"+(0, r.subexp)(h+"\\:")+"{2}"+d),b=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,3}"+h)+"?\\:\\:"+h+"\\:"+d),w=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,4}"+h)+"?\\:\\:"+d),x=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,5}"+h)+"?\\:\\:"+h),E=(0, r.subexp)((0, r.subexp)((0, r.subexp)(h+"\\:")+"{0,6}"+h)+"?\\:\\:"),O=(0, r.subexp)([v,y,_,g,m,b,w,x,E].join("|")),C=(0, r.subexp)("[vV]"+e+"+\\."+(0, r.merge)(a,o,"[\\:]")+"+"),S=(0, r.subexp)("\\["+(0, r.subexp)(O+"|"+C)+"\\]"),T=(0, r.subexp)((0, r.subexp)(n+"|"+(0, r.merge)(a,o))+"*"),j=(0, r.subexp)(S+"|"+p+"(?!"+T+")|"+T),A=(0, r.subexp)("[0-9]*"),I=(0, r.subexp)((0, r.subexp)(f+"@")+"?"+j+(0, r.subexp)("\\:"+A)+"?"),P=(0, r.subexp)(n+"|"+(0, r.merge)(a,o,"[\\:\\@]")),R=(0, r.subexp)(P+"*"),k=(0, r.subexp)(P+"+"),D=(0, r.subexp)((0, r.subexp)(n+"|"+(0, r.merge)(a,o,"[\\@]"))+"+"),U=(0, r.subexp)((0, r.subexp)("\\/"+R)+"*"),N=(0, r.subexp)("\\/"+(0, r.subexp)(k+U)+"?"),F=(0, r.subexp)(D+U),L=(0, r.subexp)(k+U),q="(?!"+P+")",z=((0, r.subexp)(U+"|"+N+"|"+F+"|"+L+"|"+q),(0, r.subexp)((0, r.subexp)(P+"|"+(0, r.merge)("[\\/\\?]",s))+"*")),M=(0, r.subexp)((0, r.subexp)(P+"|[\\/\\?]")+"*"),H=(0, r.subexp)((0, r.subexp)("\\/\\/"+I+U)+"|"+N+"|"+L+"|"+q),$=(0, r.subexp)(c+"\\:"+H+(0, r.subexp)("\\?"+z)+"?"+(0, r.subexp)("\\#"+M)+"?"),B=(0, r.subexp)((0, r.subexp)("\\/\\/"+I+U)+"|"+N+"|"+F+"|"+q),W=(0, r.subexp)(B+(0, r.subexp)("\\?"+z)+"?"+(0, r.subexp)("\\#"+M)+"?");(0, r.subexp)($+"|"+W),(0, r.subexp)(c+"\\:"+H+(0, r.subexp)("\\?"+z)+"?"),(0, r.subexp)((0, r.subexp)("\\/\\/("+(0, r.subexp)("("+f+")@")+"?("+j+")"+(0, r.subexp)("\\:("+A+")")+"?)")+"?("+U+"|"+N+"|"+L+"|"+q+")"),(0, r.subexp)("\\?("+z+")"),(0, r.subexp)("\\#("+M+")"),(0, r.subexp)((0, r.subexp)("\\/\\/("+(0, r.subexp)("("+f+")@")+"?("+j+")"+(0, r.subexp)("\\:("+A+")")+"?)")+"?("+U+"|"+N+"|"+F+"|"+q+")"),(0, r.subexp)("\\?("+z+")"),(0, r.subexp)("\\#("+M+")"),(0, r.subexp)((0, r.subexp)("\\/\\/("+(0, r.subexp)("("+f+")@")+"?("+j+")"+(0, r.subexp)("\\:("+A+")")+"?)")+"?("+U+"|"+N+"|"+L+"|"+q+")"),(0, r.subexp)("\\?("+z+")"),(0, r.subexp)("\\#("+M+")"),(0, r.subexp)("("+f+")@"),(0, r.subexp)("\\:("+A+")");return {NOT_SCHEME:new RegExp((0, r.merge)("[^]","[A-Za-z]","[0-9]","[\\+\\-\\.]"),"g"),NOT_USERINFO:new RegExp((0, r.merge)("[^\\%\\:]",a,o),"g"),NOT_HOST:new RegExp((0, r.merge)("[^\\%\\[\\]\\:]",a,o),"g"),NOT_PATH:new RegExp((0, r.merge)("[^\\%\\/\\:\\@]",a,o),"g"),NOT_PATH_NOSCHEME:new RegExp((0, r.merge)("[^\\%\\/\\@]",a,o),"g"),NOT_QUERY:new RegExp((0, r.merge)("[^\\%]",a,o,"[\\:\\@\\/\\?]",s),"g"),NOT_FRAGMENT:new RegExp((0, r.merge)("[^\\%]",a,o,"[\\:\\@\\/\\?]"),"g"),ESCAPE:new RegExp((0, r.merge)("[^]",a,o),"g"),UNRESERVED:new RegExp(a,"g"),OTHER_CHARS:new RegExp((0, r.merge)("[^\\%]",a,i),"g"),PCT_ENCODED:new RegExp(n,"g"),IPV6ADDRESS:new RegExp("\\[?("+O+")\\]?","g")}}e.default=o(!1);},function(t,e,n){(function(t,r){var o,i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(u){var s="object"==i(e)&&e&&!e.nodeType&&e,a="object"==i(t)&&t&&!t.nodeType&&t,c="object"==(void 0===r?"undefined":i(r))&&r;c.global!==c&&c.window!==c&&c.self!==c||(u=c);var f,l,p=2147483647,h=36,d=1,v=26,y=38,_=700,g=72,m=128,b="-",w=/^xn--/,x=/[^\x20-\x7E]/,E=/[\x2E\u3002\uFF0E\uFF61]/g,O={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},C=h-d,S=Math.floor,T=String.fromCharCode;function j(t){throw new RangeError(O[t])}function A(t,e){for(var n=t.length,r=[];n--;)r[n]=e(t[n]);return r}function I(t,e){var n=t.split("@"),r="";return n.length>1&&(r=n[0]+"@",t=n[1]),r+A((t=t.replace(E,".")).split("."),e).join(".")}function P(t){for(var e,n,r=[],o=0,i=t.length;o<i;)(e=t.charCodeAt(o++))>=55296&&e<=56319&&o<i?56320==(64512&(n=t.charCodeAt(o++)))?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--):r.push(e);return r}function R(t){return A(t,function(t){var e="";return t>65535&&(e+=T((t-=65536)>>>10&1023|55296),t=56320|1023&t),e+=T(t)}).join("")}function k(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function D(t,e,n){var r=0;for(t=n?S(t/_):t>>1,t+=S(t/e);t>C*v>>1;r+=h)t=S(t/C);return S(r+(C+1)*t/(t+y))}function U(t){var e,n,r,o,i,u,s,a,c,f,l,y=[],_=t.length,w=0,x=m,E=g;for((n=t.lastIndexOf(b))<0&&(n=0),r=0;r<n;++r)t.charCodeAt(r)>=128&&j("not-basic"),y.push(t.charCodeAt(r));for(o=n>0?n+1:0;o<_;){for(i=w,u=1,s=h;o>=_&&j("invalid-input"),((a=(l=t.charCodeAt(o++))-48<10?l-22:l-65<26?l-65:l-97<26?l-97:h)>=h||a>S((p-w)/u))&&j("overflow"),w+=a*u,!(a<(c=s<=E?d:s>=E+v?v:s-E));s+=h)u>S(p/(f=h-c))&&j("overflow"),u*=f;E=D(w-i,e=y.length+1,0==i),S(w/e)>p-x&&j("overflow"),x+=S(w/e),w%=e,y.splice(w++,0,x);}return R(y)}function N(t){var e,n,r,o,i,u,s,a,c,f,l,y,_,w,x,E=[];for(y=(t=P(t)).length,e=m,n=0,i=g,u=0;u<y;++u)(l=t[u])<128&&E.push(T(l));for(r=o=E.length,o&&E.push(b);r<y;){for(s=p,u=0;u<y;++u)(l=t[u])>=e&&l<s&&(s=l);for(s-e>S((p-n)/(_=r+1))&&j("overflow"),n+=(s-e)*_,e=s,u=0;u<y;++u)if((l=t[u])<e&&++n>p&&j("overflow"),l==e){for(a=n,c=h;!(a<(f=c<=i?d:c>=i+v?v:c-i));c+=h)x=a-f,w=h-f,E.push(T(k(f+x%w,0))),a=S(x/w);E.push(T(k(a,0))),i=D(n,_,r==o),n=0,++r;}++n,++e;}return E.join("")}if(f={version:"1.4.1",ucs2:{decode:P,encode:R},decode:U,encode:N,toASCII:function(t){return I(t,function(t){return x.test(t)?"xn--"+N(t):t})},toUnicode:function(t){return I(t,function(t){return w.test(t)?U(t.slice(4).toLowerCase()):t})}},"object"==i(n(3))&&n(3))void 0===(o=function(){return f}.call(e,n,e,t))||(t.exports=o);else if(s&&a)if(t.exports==s)a.exports=f;else for(l in f)f.hasOwnProperty(l)&&(s[l]=f[l]);else u.punycode=f;}(void 0);}).call(this,n(8)(t),n(1));},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default={scheme:"http",domainHost:!0,parse:function(t,e){return t.host||(t.error=t.error||"HTTP URIs must have a host."),t},serialize:function(t,e){return t.port!==("https"!==String(t.scheme).toLowerCase()?80:443)&&""!==t.port||(t.port=void 0),t.path||(t.path="/"),t}};},function(t,e,n){(function(e){var r=n(7),o=n(21),i=n(34),u=n(35),s=n(45),a=n(48),c=n(49),f=/~(?:[^01]|$)/g,l={},p=["relative","remote"],h=["absolute","uri"],d={};function v(t,e){r.isString(t)&&(t=a(t)),r.isString(e)&&(e=a(e));var n,o,u=C(r.isUndefined(e)?"":e);return h.indexOf(u.reference)>-1?o=u:(n=r.isUndefined(t)?void 0:C(t),r.isUndefined(n)?o=u:((o=n).path=a(i.join(n.path,u.path)),o.query=function(t,e){var n={};function o(t){r.forOwn(t,function(t,e){n[e]=t;});}return o(s.parse(t||"")),o(s.parse(e||"")),0===Object.keys(n).length?void 0:s.stringify(n)}(n.query,u.query))),o.fragment=void 0,(-1===h.indexOf(o.reference)&&0===o.path.indexOf("../")?"../":"")+c.serialize(o)}function y(t){return p.indexOf(b(t))>-1}function _(t){return r.isUndefined(t.error)&&"invalid"!==t.type}function g(t,e){var n=t;return e.forEach(function(t){if(!(t in n))throw Error("JSON Pointer points to missing location: "+k(e));n=n[t];}),n}function m(t){return Object.keys(t).filter(function(t){return "$ref"!==t})}function b(t){var e;switch(t.uriDetails.reference){case"absolute":case"uri":e="remote";break;case"same-document":e="local";break;default:e=t.uriDetails.reference;}return e}function w(t,e){var n=l[t],o=Promise.resolve(),i=r.cloneDeep(e.loaderOptions||{});return r.isUndefined(n)?(r.isUndefined(i.processContent)&&(i.processContent=function(t,e){e(void 0,JSON.parse(t.text));}),o=(o=u.load(decodeURI(t),i)).then(function(e){return l[t]={value:e},e}).catch(function(e){throw l[t]={error:e},e})):o=o.then(function(){if(r.isError(n.error))throw n.error;return n.value}),o=o.then(function(t){return r.cloneDeep(t)})}function x(t,e){var n=!0;try{if(!r.isPlainObject(t))throw new Error("obj is not an Object");if(!r.isString(t.$ref))throw new Error("obj.$ref is not a String")}catch(t){if(e)throw t;n=!1;}return n}function E(t){return -1!==t.indexOf("://")||i.isAbsolute(t)?t:i.resolve(e.cwd(),t)}function O(t,e){t.error=e.message,t.missing=!0;}function C(t){return c.parse(t)}function S(t,e){var n,o;if(t=r.isUndefined(t)?{}:r.cloneDeep(t),!r.isObject(t))throw new TypeError("options must be an Object");if(!r.isUndefined(t.resolveCirculars)&&!r.isBoolean(t.resolveCirculars))throw new TypeError("options.resolveCirculars must be a Boolean");if(!(r.isUndefined(t.filter)||r.isArray(t.filter)||r.isFunction(t.filter)||r.isString(t.filter)))throw new TypeError("options.filter must be an Array, a Function of a String");if(!r.isUndefined(t.includeInvalid)&&!r.isBoolean(t.includeInvalid))throw new TypeError("options.includeInvalid must be a Boolean");if(!r.isUndefined(t.location)&&!r.isString(t.location))throw new TypeError("options.location must be a String");if(!r.isUndefined(t.refPreProcessor)&&!r.isFunction(t.refPreProcessor))throw new TypeError("options.refPreProcessor must be a Function");if(!r.isUndefined(t.refPostProcessor)&&!r.isFunction(t.refPostProcessor))throw new TypeError("options.refPostProcessor must be a Function");if(!r.isUndefined(t.subDocPath)&&!r.isArray(t.subDocPath)&&!P(t.subDocPath))throw new TypeError("options.subDocPath must be an Array of path segments or a valid JSON Pointer");if(r.isUndefined(t.resolveCirculars)&&(t.resolveCirculars=!1),t.filter=function(t){var e,n;return r.isArray(t.filter)||r.isString(t.filter)?(n=r.isString(t.filter)?[t.filter]:t.filter,e=function(t){return n.indexOf(t.type)>-1||n.indexOf(b(t))>-1}):r.isFunction(t.filter)?e=t.filter:r.isUndefined(t.filter)&&(e=function(){return !0}),function(n,r){return ("invalid"!==n.type||!0===t.includeInvalid)&&e(n,r)}}(t),r.isUndefined(t.location)&&(t.location=E("./root.json")),(n=t.location.split("#")).length>1&&(t.subDocPath="#"+n[1]),o=decodeURI(t.location)===t.location,t.location=v(t.location,void 0),o&&(t.location=decodeURI(t.location)),t.subDocPath=function(t){var e;return r.isArray(t.subDocPath)?e=t.subDocPath:r.isString(t.subDocPath)?e=R(t.subDocPath):r.isUndefined(t.subDocPath)&&(e=[]),e}(t),!r.isUndefined(e))try{g(e,t.subDocPath);}catch(t){throw t.message=t.message.replace("JSON Pointer","options.subDocPath"),t}return t}function T(t){if(!r.isArray(t))throw new TypeError("path must be an array");return t.map(function(t){return r.isString(t)||(t=JSON.stringify(t)),t.replace(/~1/g,"/").replace(/~0/g,"~")})}function j(t){if(!r.isArray(t))throw new TypeError("path must be an array");return t.map(function(t){return r.isString(t)||(t=JSON.stringify(t)),t.replace(/~/g,"~0").replace(/\//g,"~1")})}function A(t,e){var n={};if(!r.isArray(t)&&!r.isObject(t))throw new TypeError("obj must be an Array or an Object");return function t(e,n,o,i){var u=!0;function s(n,r){o.push(r),t(e,n,o,i),o.pop();}r.isFunction(i)&&(u=i(e,n,o)),-1===e.indexOf(n)&&(e.push(n),!1!==u&&(r.isArray(n)?n.forEach(function(t,e){s(t,e.toString());}):r.isObject(n)&&r.forOwn(n,function(t,e){s(t,e);})),e.pop());}(function(t,e){var n,r=[];return e.length>0&&(n=t,e.slice(0,e.length-1).forEach(function(t){t in n&&(n=n[t],r.push(n));})),r}(t,(e=S(e,t)).subDocPath),g(t,e.subDocPath),r.cloneDeep(e.subDocPath),function(t,o,i){var u,s,a=!0;return x(o)&&(r.isUndefined(e.refPreProcessor)||(o=e.refPreProcessor(r.cloneDeep(o),i)),u=I(o),r.isUndefined(e.refPostProcessor)||(u=e.refPostProcessor(u,i)),e.filter(u,i)&&(s=k(i),n[s]=u),m(o).length>0&&(a=!1)),a}),n}function I(t){var e,n,o,i={def:t};try{if(x(t,!0)){if(e=t.$ref,o=d[e],r.isUndefined(o)&&(o=d[e]=C(e)),i.uri=e,i.uriDetails=o,r.isUndefined(o.error)){i.type=b(i);try{["#","/"].indexOf(e[0])>-1?P(e,!0):e.indexOf("#")>-1&&P(o.fragment,!0);}catch(t){i.error=t.message,i.type="invalid";}}else i.error=i.uriDetails.error,i.type="invalid";(n=m(t)).length>0&&(i.warning="Extra JSON Reference properties will be ignored: "+n.join(", "));}else i.type="invalid";}catch(t){i.error=t.message,i.type="invalid";}return i}function P(t,e){var n,o=!0;try{if(!r.isString(t))throw new Error("ptr is not a String");if(""!==t){if(n=t.charAt(0),-1===["#","/"].indexOf(n))throw new Error("ptr must start with a / or #/");if("#"===n&&"#"!==t&&"/"!==t.charAt(1))throw new Error("ptr must start with a / or #/");if(t.match(f))throw new Error("ptr has invalid token(s)")}}catch(t){if(!0===e)throw t;o=!1;}return o}function R(t){try{P(t,!0);}catch(t){throw new Error("ptr must be a JSON Pointer: "+t.message)}var e=t.split("/");return e.shift(),T(e)}function k(t,e){if(!r.isArray(t))throw new Error("path must be an Array");return (!1!==e?"#":"")+(t.length>0?"/":"")+j(t).join("/")}function D(t,e){var n=Promise.resolve();return n=n.then(function(){if(!r.isArray(t)&&!r.isObject(t))throw new TypeError("obj must be an Array or an Object");e=S(e,t),t=r.cloneDeep(t);}).then(function(){var n={deps:{},docs:{},refs:{}};return function t(e,n,o){var u,s,a=Promise.resolve(),c=k(n.subDocPath),f=E(n.location),l=i.dirname(n.location),p=f+c;return r.isUndefined(o.docs[f])&&(o.docs[f]=e),r.isUndefined(o.deps[p])&&(o.deps[p]={},u=A(e,n),r.forOwn(u,function(i,u){var f,h,d=E(n.location)+u,g=i.refdId=decodeURI(E(y(i)?v(l,i.uri):n.location)+"#"+(i.uri.indexOf("#")>-1?i.uri.split("#")[1]:""));o.refs[d]=i,_(i)&&(i.fqURI=g,o.deps[p][u===c?"#":u.replace(c+"/","#/")]=g,0!==d.indexOf(g+"/")?((s=r.cloneDeep(n)).subDocPath=r.isUndefined(i.uriDetails.fragment)?[]:R(decodeURI(i.uriDetails.fragment)),y(i)?(delete s.filter,s.location=g.split("#")[0],a=a.then((f=o,h=s,function(){var t=E(h.location),e=f.docs[t];return r.isUndefined(e)?w(t,h).catch(function(e){return f.docs[t]=e,e}):Promise.resolve().then(function(){return e})}))):a=a.then(function(){return e}),a=a.then(function(e,n,o){return function(i){if(r.isError(i))O(o,i);else try{return t(i,n,e).catch(function(t){O(o,t);})}catch(t){O(o,t);}}}(o,s,i))):i.circular=!0);})),a}(t,e,n).then(function(){return n})}).then(function(t){var n={},u=[],s=[],a=new o.Graph,c=E(e.location),f=c+k(e.subDocPath),l=i.dirname(c);return Object.keys(t.deps).forEach(function(t){a.setNode(t);}),r.forOwn(t.deps,function(t,e){r.forOwn(t,function(t){a.setEdge(e,t);});}),(u=o.alg.findCycles(a)).forEach(function(t){t.forEach(function(t){-1===s.indexOf(t)&&s.push(t);});}),r.forOwn(t.deps,function(e,n){r.forOwn(e,function(e,r){var o,i=!1,a=n+r.slice(1),c=t.refs[n+r.slice(1)],f=y(c);s.indexOf(e)>-1&&u.forEach(function(t){i||(o=t.indexOf(e))>-1&&t.forEach(function(n){i||0===a.indexOf(n+"/")&&(f&&o!==t.length-1&&"#"===e[e.length-1]||(i=!0));});}),i&&(c.circular=!0);});}),r.forOwn(Object.keys(t.deps).reverse(),function(n){var o=t.deps[n],i=n.split("#"),u=t.docs[i[0]],s=R(i[1]);r.forOwn(o,function(n,o){var a,c,f,l=n.split("#"),p=t.docs[l[0]],h=s.concat(R(o)),d=t.refs[i[0]+k(h)];if(r.isUndefined(d.error)&&r.isUndefined(d.missing))if(!e.resolveCirculars&&d.circular)d.value=d.def;else {try{d.value=g(p,R(l[1]));}catch(t){return void O(d,t)}""===i[1]&&"#"===o?t.docs[i[0]]=d.value:(a=u,c=h,f=d.value,g(a,c.slice(0,c.length-1))[c[c.length-1]]=f);}});}),Object.keys(t.refs).forEach(function(o){var i,u,s=t.refs[o];"invalid"!==s.type&&("#"===s.fqURI[s.fqURI.length-1]&&"#"!==s.uri[s.uri.length-1]&&(s.fqURI=s.fqURI.substr(0,s.fqURI.length-1)),i=s.fqURI.split("/"),u=s.uri.split("/"),r.times(u.length-1,function(t){var e=u[u.length-t-1],n=i.length-t-1,r=i[n];"."!==e&&".."!==e||(e=r),i[n]=e;}),s.fqURI=i.join("/"),0===s.fqURI.indexOf(c)?s.fqURI=s.fqURI.replace(c,""):0===s.fqURI.indexOf(l)&&(s.fqURI=s.fqURI.replace(l,"")),"/"===s.fqURI[0]&&(s.fqURI="."+s.fqURI)),0===o.indexOf(f)&&function r(o,i,u){var s,a=i.split("#"),c=t.refs[i];n[a[0]===e.location?"#"+a[1]:k(e.subDocPath.concat(u))]=c,!c.circular&&_(c)?(s=t.deps[c.refdId],0!==c.refdId.indexOf(o)&&Object.keys(s).forEach(function(t){r(c.refdId,c.refdId+t.substr(1),u.concat(R(t)));})):!c.circular&&c.error&&(c.error=c.error.replace("options.subDocPath","JSON Pointer"),c.error.indexOf("#")>-1&&(c.error=c.error.replace(c.uri.substr(c.uri.indexOf("#")),c.uri)),0!==c.error.indexOf("ENOENT:")&&0!==c.error.indexOf("Not Found")||(c.error="JSON Pointer points to missing location: "+c.uri));}(f,o,R(o.substr(f.length)));}),r.forOwn(t.refs,function(t){delete t.refdId,t.missing&&(t.error=t.error.split(": ")[0]+": "+t.def.$ref);}),{refs:n,resolved:t.docs[c]}})}"undefined"==typeof Promise&&n(16),t.exports.clearCache=function(){l={};},t.exports.decodePath=function(t){return T(t)},t.exports.encodePath=function(t){return j(t)},t.exports.findRefs=function(t,e){return A(t,e)},t.exports.findRefsAt=function(t,e){return function(t,e){var n=Promise.resolve();return n=n.then(function(){if(!r.isString(t))throw new TypeError("location must be a string");return r.isUndefined(e)&&(e={}),r.isObject(e)&&(e.location=t),w((e=S(e)).location,e)}).then(function(t){var n=r.cloneDeep(l[e.location]),o=r.cloneDeep(e),i=C(e.location);return r.isUndefined(n.refs)&&(delete o.filter,delete o.subDocPath,o.includeInvalid=!0,l[e.location].refs=A(t,o)),r.isUndefined(e.filter)||(o.filter=e.filter),r.isUndefined(i.fragment)?r.isUndefined(i.subDocPath)||(o.subDocPath=e.subDocPath):o.subDocPath=R(decodeURI(i.fragment)),{refs:A(t,o),value:t}})}(t,e)},t.exports.getRefDetails=function(t){return I(t)},t.exports.isPtr=function(t,e){return P(t,e)},t.exports.isRef=function(t,e){return function(t,e){return x(t,e)&&"invalid"!==I(t).type}(t,e)},t.exports.pathFromPtr=function(t){return R(t)},t.exports.pathToPtr=function(t,e){return k(t,e)},t.exports.resolveRefs=function(t,e){return D(t,e)},t.exports.resolveRefsAt=function(t,e){return function(t,e){var n=Promise.resolve();return n=n.then(function(){if(!r.isString(t))throw new TypeError("location must be a string");return r.isUndefined(e)&&(e={}),r.isObject(e)&&(e.location=t),w((e=S(e)).location,e)}).then(function(t){var n=r.cloneDeep(e),o=C(e.location);return r.isUndefined(o.fragment)||(n.subDocPath=R(decodeURI(o.fragment))),D(t,n).then(function(e){return {refs:e.refs,resolved:e.resolved,value:t}})})}(t,e)};}).call(this,n(2));},function(t,e,n){var r=n(22);t.exports={Graph:r.Graph,json:n(24),alg:n(25),version:r.version};},function(t,e,n){t.exports={Graph:n(5),version:n(23)};},function(t,e,n){t.exports="2.1.5";},function(t,e,n){var r=n(0),o=n(5);function i(t){return r.map(t.nodes(),function(e){var n=t.node(e),o=t.parent(e),i={v:e};return r.isUndefined(n)||(i.value=n),r.isUndefined(o)||(i.parent=o),i})}function u(t){return r.map(t.edges(),function(e){var n=t.edge(e),o={v:e.v,w:e.w};return r.isUndefined(e.name)||(o.name=e.name),r.isUndefined(n)||(o.value=n),o})}t.exports={write:function(t){var e={options:{directed:t.isDirected(),multigraph:t.isMultigraph(),compound:t.isCompound()},nodes:i(t),edges:u(t)};r.isUndefined(t.graph())||(e.value=r.clone(t.graph()));return e},read:function(t){var e=new o(t.options).setGraph(t.value);return r.each(t.nodes,function(t){e.setNode(t.v,t.value),t.parent&&e.setParent(t.v,t.parent);}),r.each(t.edges,function(t){e.setEdge({v:t.v,w:t.w,name:t.name},t.value);}),e}};},function(t,e,n){t.exports={components:n(26),dijkstra:n(9),dijkstraAll:n(27),findCycles:n(28),floydWarshall:n(29),isAcyclic:n(30),postorder:n(31),preorder:n(32),prim:n(33),tarjan:n(11),topsort:n(12)};},function(t,e,n){var r=n(0);t.exports=function(t){var e,n={},o=[];function i(o){r.has(n,o)||(n[o]=!0,e.push(o),r.each(t.successors(o),i),r.each(t.predecessors(o),i));}return r.each(t.nodes(),function(t){e=[],i(t),e.length&&o.push(e);}),o};},function(t,e,n){var r=n(9),o=n(0);t.exports=function(t,e,n){return o.transform(t.nodes(),function(o,i){o[i]=r(t,i,e,n);},{})};},function(t,e,n){var r=n(0),o=n(11);t.exports=function(t){return r.filter(o(t),function(e){return e.length>1||1===e.length&&t.hasEdge(e[0],e[0])})};},function(t,e,n){var r=n(0);t.exports=function(t,e,n){return function(t,e,n){var r={},o=t.nodes();return o.forEach(function(t){r[t]={},r[t][t]={distance:0},o.forEach(function(e){t!==e&&(r[t][e]={distance:Number.POSITIVE_INFINITY});}),n(t).forEach(function(n){var o=n.v===t?n.w:n.v,i=e(n);r[t][o]={distance:i,predecessor:t};});}),o.forEach(function(t){var e=r[t];o.forEach(function(n){var i=r[n];o.forEach(function(n){var r=i[t],o=e[n],u=i[n],s=r.distance+o.distance;s<u.distance&&(u.distance=s,u.predecessor=o.predecessor);});});}),r}(t,e||o,n||function(e){return t.outEdges(e)})};var o=r.constant(1);},function(t,e,n){var r=n(12);t.exports=function(t){try{r(t);}catch(t){if(t instanceof r.CycleException)return !1;throw t}return !0};},function(t,e,n){var r=n(13);t.exports=function(t,e){return r(t,e,"post")};},function(t,e,n){var r=n(13);t.exports=function(t,e){return r(t,e,"pre")};},function(t,e,n){var r=n(0),o=n(5),i=n(10);t.exports=function(t,e){var n,u=new o,s={},a=new i;function c(t){var r=t.v===n?t.w:t.v,o=a.priority(r);if(void 0!==o){var i=e(t);i<o&&(s[r]=n,a.decrease(r,i));}}if(0===t.nodeCount())return u;r.each(t.nodes(),function(t){a.add(t,Number.POSITIVE_INFINITY),u.setNode(t);}),a.decrease(t.nodes()[0],0);var f=!1;for(;a.size()>0;){if(n=a.removeMin(),r.has(s,n))u.setEdge(n,s[n]);else {if(f)throw new Error("Input graph is not connected: "+t);f=!0;}t.nodeEdges(n).forEach(c);}return u};},function(t,e,n){(function(t){function n(t,e){for(var n=0,r=t.length-1;r>=0;r--){var o=t[r];"."===o?t.splice(r,1):".."===o?(t.splice(r,1),n++):n&&(t.splice(r,1),n--);}if(e)for(;n--;n)t.unshift("..");return t}var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,o=function(t){return r.exec(t).slice(1)};function i(t,e){if(t.filter)return t.filter(e);for(var n=[],r=0;r<t.length;r++)e(t[r],r,t)&&n.push(t[r]);return n}e.resolve=function(){for(var e="",r=!1,o=arguments.length-1;o>=-1&&!r;o--){var u=o>=0?arguments[o]:t.cwd();if("string"!=typeof u)throw new TypeError("Arguments to path.resolve must be strings");u&&(e=u+"/"+e,r="/"===u.charAt(0));}return (r?"/":"")+(e=n(i(e.split("/"),function(t){return !!t}),!r).join("/"))||"."},e.normalize=function(t){var r=e.isAbsolute(t),o="/"===u(t,-1);return (t=n(i(t.split("/"),function(t){return !!t}),!r).join("/"))||r||(t="."),t&&o&&(t+="/"),(r?"/":"")+t},e.isAbsolute=function(t){return "/"===t.charAt(0)},e.join=function(){var t=Array.prototype.slice.call(arguments,0);return e.normalize(i(t,function(t,e){if("string"!=typeof t)throw new TypeError("Arguments to path.join must be strings");return t}).join("/"))},e.relative=function(t,n){function r(t){for(var e=0;e<t.length&&""===t[e];e++);for(var n=t.length-1;n>=0&&""===t[n];n--);return e>n?[]:t.slice(e,n-e+1)}t=e.resolve(t).substr(1),n=e.resolve(n).substr(1);for(var o=r(t.split("/")),i=r(n.split("/")),u=Math.min(o.length,i.length),s=u,a=0;a<u;a++)if(o[a]!==i[a]){s=a;break}var c=[];for(a=s;a<o.length;a++)c.push("..");return (c=c.concat(i.slice(s))).join("/")},e.sep="/",e.delimiter=":",e.dirname=function(t){var e=o(t),n=e[0],r=e[1];return n||r?(r&&(r=r.substr(0,r.length-1)),n+r):"."},e.basename=function(t,e){var n=o(t)[2];return e&&n.substr(-1*e.length)===e&&(n=n.substr(0,n.length-e.length)),n},e.extname=function(t){return o(t)[3]};var u="b"==="ab".substr(-1)?function(t,e,n){return t.substr(e,n)}:function(t,e,n){return e<0&&(e=t.length+e),t.substr(e,n)};}).call(this,n(2));},function(t,e,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o={file:n(36),http:n(14),https:n(14)},i="object"===("undefined"==typeof window?"undefined":r(window))||"function"==typeof importScripts?o.http:o.file;"undefined"==typeof Promise&&n(16),t.exports.load=function(t,e){var n=Promise.resolve();return void 0===e&&(e={}),n=(n=n.then(function(){if(void 0===t)throw new TypeError("location is required");if("string"!=typeof t)throw new TypeError("location must be a string");if(void 0!==e){if("object"!==(void 0===e?"undefined":r(e)))throw new TypeError("options must be an object");if(void 0!==e.processContent&&"function"!=typeof e.processContent)throw new TypeError("options.processContent must be a function")}})).then(function(){return new Promise(function(n,r){(function(t){var e=function(t){return void 0!==t&&(t=-1===t.indexOf("://")?"":t.split("://")[0]),t}(t),n=o[e];if(void 0===n){if(""!==e)throw new Error("Unsupported scheme: "+e);n=i;}return n})(t).load(t,e||{},function(t,e){t?r(t):n(e);});})}).then(function(t){return e.processContent?new Promise(function(n,o){e.processContent("object"===(void 0===t?"undefined":r(t))?t:{text:t},function(t,e){t?o(t):n(e);});}):"object"===(void 0===t?"undefined":r(t))?t.text:t})};},function(t,e,n){var r=new TypeError("The 'file' scheme is not supported in the browser");t.exports.getBase=function(){throw r},t.exports.load=function(){var t=arguments[arguments.length-1];if("function"!=typeof t)throw r;t(r);};},function(t,e,n){var r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};"undefined"!=typeof window?r=window:"undefined"!=typeof self?r=self:(console.warn("Using browser-only version of superagent in non-browser environment"),r=void 0);var i=n(38),u=n(39),s=n(15),a=n(40),c=n(42);function f(){}var l=e=t.exports=function(t,n){return "function"==typeof n?new e.Request("GET",t).end(n):1==arguments.length?new e.Request("GET",t):new e.Request(t,n)};e.Request=g,l.getXHR=function(){if(!(!r.XMLHttpRequest||r.location&&"file:"==r.location.protocol&&r.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}throw Error("Browser-only version of superagent could not find XHR")};var p="".trim?function(t){return t.trim()}:function(t){return t.replace(/(^\s*|\s*$)/g,"")};function h(t){if(!s(t))return t;var e=[];for(var n in t)d(e,n,t[n]);return e.join("&")}function d(t,e,n){if(null!=n)if(Array.isArray(n))n.forEach(function(n){d(t,e,n);});else if(s(n))for(var r in n)d(t,e+"["+r+"]",n[r]);else t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));else null===n&&t.push(encodeURIComponent(e));}function v(t){for(var e,n,r={},o=t.split("&"),i=0,u=o.length;i<u;++i)-1==(n=(e=o[i]).indexOf("="))?r[decodeURIComponent(e)]="":r[decodeURIComponent(e.slice(0,n))]=decodeURIComponent(e.slice(n+1));return r}function y(t){return /[\/+]json($|[^-\w])/.test(t)}function _(t){this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;var e=this.xhr.status;1223===e&&(e=204),this._setStatusProperties(e),this.header=this.headers=function(t){for(var e,n,r,o,i=t.split(/\r?\n/),u={},s=0,a=i.length;s<a;++s)-1!==(e=(n=i[s]).indexOf(":"))&&(r=n.slice(0,e).toLowerCase(),o=p(n.slice(e+1)),u[r]=o);return u}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&t._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null;}function g(t,e){var n=this;this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",function(){var t,e=null,r=null;try{r=new _(n);}catch(t){return (e=new Error("Parser is unable to parse the response")).parse=!0,e.original=t,n.xhr?(e.rawResponse=void 0===n.xhr.responseType?n.xhr.responseText:n.xhr.response,e.status=n.xhr.status?n.xhr.status:null,e.statusCode=e.status):(e.rawResponse=null,e.status=null),n.callback(e)}n.emit("response",r);try{n._isResponseOK(r)||(t=new Error(r.statusText||"Unsuccessful HTTP response"));}catch(e){t=e;}t?(t.original=e,t.response=r,t.status=r.status,n.callback(t,r)):n.callback(null,r);});}function m(t,e,n){var r=l("DELETE",t);return "function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r}l.serializeObject=h,l.parseString=v,l.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},l.serialize={"application/x-www-form-urlencoded":h,"application/json":JSON.stringify},l.parse={"application/x-www-form-urlencoded":v,"application/json":JSON.parse},a(_.prototype),_.prototype._parseBody=function(t){var e=l.parse[this.type];return this.req._parser?this.req._parser(this,t):(!e&&y(this.type)&&(e=l.parse["application/json"]),e&&t&&(t.length||t instanceof Object)?e(t):null)},_.prototype.toError=function(){var t=this.req,e=t.method,n=t.url,r="cannot "+e+" "+n+" ("+this.status+")",o=new Error(r);return o.status=this.status,o.method=e,o.url=n,o},l.Response=_,i(g.prototype),u(g.prototype),g.prototype.type=function(t){return this.set("Content-Type",l.types[t]||t),this},g.prototype.accept=function(t){return this.set("Accept",l.types[t]||t),this},g.prototype.auth=function(t,e,n){1===arguments.length&&(e=""),"object"===(void 0===e?"undefined":o(e))&&null!==e&&(n=e,e=""),n||(n={type:"function"==typeof btoa?"basic":"auto"});return this._auth(t,e,n,function(t){if("function"==typeof btoa)return btoa(t);throw new Error("Cannot use basic auth, btoa is not a function")})},g.prototype.query=function(t){return "string"!=typeof t&&(t=h(t)),t&&this._query.push(t),this},g.prototype.attach=function(t,e,n){if(e){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t,e,n||e.name);}return this},g.prototype._getFormData=function(){return this._formData||(this._formData=new r.FormData),this._formData},g.prototype.callback=function(t,e){if(this._shouldRetry(t,e))return this._retry();var n=this._callback;this.clearTimeout(),t&&(this._maxRetries&&(t.retries=this._retries-1),this.emit("error",t)),n(t,e);},g.prototype.crossDomainError=function(){var t=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain=!0,t.status=this.status,t.method=this.method,t.url=this.url,this.callback(t);},g.prototype.buffer=g.prototype.ca=g.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},g.prototype.pipe=g.prototype.write=function(){throw Error("Streaming is not supported in browser version of superagent")},g.prototype._isHost=function(t){return t&&"object"===(void 0===t?"undefined":o(t))&&!Array.isArray(t)&&"[object Object]"!==Object.prototype.toString.call(t)},g.prototype.end=function(t){return this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=t||f,this._finalizeQueryString(),this._end()},g.prototype._end=function(){var t=this,e=this.xhr=l.getXHR(),n=this._formData||this._data;this._setTimeouts(),e.onreadystatechange=function(){var n=e.readyState;if(n>=2&&t._responseTimeoutTimer&&clearTimeout(t._responseTimeoutTimer),4==n){var r;try{r=e.status;}catch(t){r=0;}if(!r){if(t.timedout||t._aborted)return;return t.crossDomainError()}t.emit("end");}};var r=function(e,n){n.total>0&&(n.percent=n.loaded/n.total*100),n.direction=e,t.emit("progress",n);};if(this.hasListeners("progress"))try{e.onprogress=r.bind(null,"download"),e.upload&&(e.upload.onprogress=r.bind(null,"upload"));}catch(t){}try{this.username&&this.password?e.open(this.method,this.url,!0,this.username,this.password):e.open(this.method,this.url,!0);}catch(t){return this.callback(t)}if(this._withCredentials&&(e.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof n&&!this._isHost(n)){var o=this._header["content-type"],i=this._serializer||l.serialize[o?o.split(";")[0]:""];!i&&y(o)&&(i=l.serialize["application/json"]),i&&(n=i(n));}for(var u in this.header)null!=this.header[u]&&this.header.hasOwnProperty(u)&&e.setRequestHeader(u,this.header[u]);return this._responseType&&(e.responseType=this._responseType),this.emit("request",this),e.send(void 0!==n?n:null),this},l.agent=function(){return new c},["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(function(t){c.prototype[t.toLowerCase()]=function(e,n){var r=new l.Request(t,e);return this._setDefaults(r),n&&r.end(n),r};}),c.prototype.del=c.prototype.delete,l.get=function(t,e,n){var r=l("GET",t);return "function"==typeof e&&(n=e,e=null),e&&r.query(e),n&&r.end(n),r},l.head=function(t,e,n){var r=l("HEAD",t);return "function"==typeof e&&(n=e,e=null),e&&r.query(e),n&&r.end(n),r},l.options=function(t,e,n){var r=l("OPTIONS",t);return "function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},l.del=m,l.delete=m,l.patch=function(t,e,n){var r=l("PATCH",t);return "function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},l.post=function(t,e,n){var r=l("POST",t);return "function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r},l.put=function(t,e,n){var r=l("PUT",t);return "function"==typeof e&&(n=e,e=null),e&&r.send(e),n&&r.end(n),r};},function(t,e,n){function r(t){if(t)return function(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}(t)}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments);}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n,r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<r.length;o++)if((n=r[o])===e||n.fn===e){r.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n)for(var r=0,o=(n=n.slice(0)).length;r<o;++r)n[r].apply(this,e);return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return !!this.listeners(t).length};},function(t,e,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=n(15);function i(t){if(t)return function(t){for(var e in i.prototype)t[e]=i.prototype[e];return t}(t)}t.exports=i,i.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},i.prototype.parse=function(t){return this._parser=t,this},i.prototype.responseType=function(t){return this._responseType=t,this},i.prototype.serialize=function(t){return this._serializer=t,this},i.prototype.timeout=function(t){if(!t||"object"!==(void 0===t?"undefined":r(t)))return this._timeout=t,this._responseTimeout=0,this;for(var e in t)switch(e){case"deadline":this._timeout=t.deadline;break;case"response":this._responseTimeout=t.response;break;default:console.warn("Unknown timeout option",e);}return this},i.prototype.retry=function(t,e){return 0!==arguments.length&&!0!==t||(t=1),t<=0&&(t=0),this._maxRetries=t,this._retries=0,this._retryCallback=e,this};var u=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];i.prototype._shouldRetry=function(t,e){if(!this._maxRetries||this._retries++>=this._maxRetries)return !1;if(this._retryCallback)try{var n=this._retryCallback(t,e);if(!0===n)return !0;if(!1===n)return !1}catch(t){console.error(t);}if(e&&e.status&&e.status>=500&&501!=e.status)return !0;if(t){if(t.code&&~u.indexOf(t.code))return !0;if(t.timeout&&"ECONNABORTED"==t.code)return !0;if(t.crossDomain)return !0}return !1},i.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},i.prototype.then=function(t,e){if(!this._fullfilledPromise){var n=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise(function(t,e){n.end(function(n,r){n?e(n):t(r);});});}return this._fullfilledPromise.then(t,e)},i.prototype.catch=function(t){return this.then(void 0,t)},i.prototype.use=function(t){return t(this),this},i.prototype.ok=function(t){if("function"!=typeof t)throw Error("Callback required");return this._okCallback=t,this},i.prototype._isResponseOK=function(t){return !!t&&(this._okCallback?this._okCallback(t):t.status>=200&&t.status<300)},i.prototype.get=function(t){return this._header[t.toLowerCase()]},i.prototype.getHeader=i.prototype.get,i.prototype.set=function(t,e){if(o(t)){for(var n in t)this.set(n,t[n]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},i.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},i.prototype.field=function(t,e){if(null==t)throw new Error(".field(name, val) name can not be empty");if(this._data&&console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"),o(t)){for(var n in t)this.field(n,t[n]);return this}if(Array.isArray(e)){for(var r in e)this.field(t,e[r]);return this}if(null==e)throw new Error(".field(name, val) val can not be empty");return "boolean"==typeof e&&(e=""+e),this._getFormData().append(t,e),this},i.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},i.prototype._auth=function(t,e,n,r){switch(n.type){case"basic":this.set("Authorization","Basic "+r(t+":"+e));break;case"auto":this.username=t,this.password=e;break;case"bearer":this.set("Authorization","Bearer "+t);}return this},i.prototype.withCredentials=function(t){return null==t&&(t=!0),this._withCredentials=t,this},i.prototype.redirects=function(t){return this._maxRedirects=t,this},i.prototype.maxResponseSize=function(t){if("number"!=typeof t)throw TypeError("Invalid argument");return this._maxResponseSize=t,this},i.prototype.toJSON=function(){return {method:this.method,url:this.url,data:this._data,headers:this._header}},i.prototype.send=function(t){var e=o(t),n=this._header["content-type"];if(this._formData&&console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"),e&&!this._data)Array.isArray(t)?this._data=[]:this._isHost(t)||(this._data={});else if(t&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(e&&o(this._data))for(var r in t)this._data[r]=t[r];else "string"==typeof t?(n||this.type("form"),n=this._header["content-type"],this._data="application/x-www-form-urlencoded"==n?this._data?this._data+"&"+t:t:(this._data||"")+t):this._data=t;return !e||this._isHost(t)?this:(n||this.type("json"),this)},i.prototype.sortQuery=function(t){return this._sort=void 0===t||t,this},i.prototype._finalizeQueryString=function(){var t=this._query.join("&");if(t&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+t),this._query.length=0,this._sort){var e=this.url.indexOf("?");if(e>=0){var n=this.url.substring(e+1).split("&");"function"==typeof this._sort?n.sort(this._sort):n.sort(),this.url=this.url.substring(0,e)+"?"+n.join("&");}}},i.prototype._appendQueryString=function(){console.trace("Unsupported");},i.prototype._timeoutError=function(t,e,n){if(!this._aborted){var r=new Error(t+e+"ms exceeded");r.timeout=e,r.code="ECONNABORTED",r.errno=n,this.timedout=!0,this.abort(),this.callback(r);}},i.prototype._setTimeouts=function(){var t=this;this._timeout&&!this._timer&&(this._timer=setTimeout(function(){t._timeoutError("Timeout of ",t._timeout,"ETIME");},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(function(){t._timeoutError("Response timeout of ",t._responseTimeout,"ETIMEDOUT");},this._responseTimeout));};},function(t,e,n){var r=n(41);function o(t){if(t)return function(t){for(var e in o.prototype)t[e]=o.prototype[e];return t}(t)}t.exports=o,o.prototype.get=function(t){return this.header[t.toLowerCase()]},o.prototype._setHeaderProperties=function(t){var e=t["content-type"]||"";this.type=r.type(e);var n=r.params(e);for(var o in n)this[o]=n[o];this.links={};try{t.link&&(this.links=r.parseLinks(t.link));}catch(t){}},o.prototype._setStatusProperties=function(t){var e=t/100|0;this.status=this.statusCode=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.redirect=3==e,this.clientError=4==e,this.serverError=5==e,this.error=(4==e||5==e)&&this.toError(),this.created=201==t,this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.forbidden=403==t,this.notFound=404==t,this.unprocessableEntity=422==t;};},function(t,e,n){e.type=function(t){return t.split(/ *; */).shift()},e.params=function(t){return t.split(/ *; */).reduce(function(t,e){var n=e.split(/ *= */),r=n.shift(),o=n.shift();return r&&o&&(t[r]=o),t},{})},e.parseLinks=function(t){return t.split(/ *, */).reduce(function(t,e){var n=e.split(/ *; */),r=n[0].slice(1,-1);return t[n[1].split(/ *= */)[1].slice(1,-1)]=r,t},{})},e.cleanHeader=function(t,e){return delete t["content-type"],delete t["content-length"],delete t["transfer-encoding"],delete t.host,e&&(delete t.authorization,delete t.cookie),t};},function(t,e,n){function r(){this._defaults=[];}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(function(t){r.prototype[t]=function(){return this._defaults.push({fn:t,arguments:arguments}),this};}),r.prototype._setDefaults=function(t){this._defaults.forEach(function(e){t[e.fn].apply(t,e.arguments);});},t.exports=r;},function(t,e,n){(function(t){var r=void 0!==t&&t||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;function i(t,e){this._id=t,this._clearFn=e;}e.setTimeout=function(){return new i(o.call(setTimeout,r,arguments),clearTimeout)},e.setInterval=function(){return new i(o.call(setInterval,r,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close();},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(r,this._id);},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e;},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1;},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout();},e));},n(44),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||void 0,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||void 0;}).call(this,n(1));},function(t,e,n){(function(t,e){!function(t,n){if(!t.setImmediate){var r,o,i,u,s,a=1,c={},f=!1,l=t.document,p=Object.getPrototypeOf&&Object.getPrototypeOf(t);p=p&&p.setTimeout?p:t,"[object process]"==={}.toString.call(t.process)?r=function(t){e.nextTick(function(){d(t);});}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1;},t.postMessage("","*"),t.onmessage=n,e}}()?t.MessageChannel?((i=new MessageChannel).port1.onmessage=function(t){d(t.data);},r=function(t){i.port2.postMessage(t);}):l&&"onreadystatechange"in l.createElement("script")?(o=l.documentElement,r=function(t){var e=l.createElement("script");e.onreadystatechange=function(){d(t),e.onreadystatechange=null,o.removeChild(e),e=null;},o.appendChild(e);}):r=function(t){setTimeout(d,0,t);}:(u="setImmediate$"+Math.random()+"$",s=function(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(u)&&d(+e.data.slice(u.length));},t.addEventListener?t.addEventListener("message",s,!1):t.attachEvent("onmessage",s),r=function(e){t.postMessage(u+e,"*");}),p.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var o={callback:t,args:e};return c[a]=o,r(a),a++},p.clearImmediate=h;}function h(t){delete c[t];}function d(t){if(f)setTimeout(d,0,t);else {var e=c[t];if(e){f=!0;try{!function(t){var e=t.callback,r=t.args;switch(r.length){case 0:e();break;case 1:e(r[0]);break;case 2:e(r[0],r[1]);break;case 3:e(r[0],r[1],r[2]);break;default:e.apply(n,r);}}(e);}finally{h(t),f=!1;}}}}}("undefined"==typeof self?void 0===t?void 0:t:self);}).call(this,n(1),n(2));},function(t,e,n){e.decode=e.parse=n(46),e.encode=e.stringify=n(47);},function(t,e,n){function r(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,n,i){e=e||"&",n=n||"=";var u={};if("string"!=typeof t||0===t.length)return u;var s=/\+/g;t=t.split(e);var a=1e3;i&&"number"==typeof i.maxKeys&&(a=i.maxKeys);var c=t.length;a>0&&c>a&&(c=a);for(var f=0;f<c;++f){var l,p,h,d,v=t[f].replace(s,"%20"),y=v.indexOf(n);y>=0?(l=v.substr(0,y),p=v.substr(y+1)):(l=v,p=""),h=decodeURIComponent(l),d=decodeURIComponent(p),r(u,h)?o(u[h])?u[h].push(d):u[h]=[u[h],d]:u[h]=d;}return u};var o=Array.isArray||function(t){return "[object Array]"===Object.prototype.toString.call(t)};},function(t,e,n){var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(t){switch(void 0===t?"undefined":r(t)){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return ""}};t.exports=function(t,e,n,a){return e=e||"&",n=n||"=",null===t&&(t=void 0),"object"===(void 0===t?"undefined":r(t))?u(s(t),function(r){var s=encodeURIComponent(o(r))+n;return i(t[r])?u(t[r],function(t){return s+encodeURIComponent(o(t))}).join(e):s+encodeURIComponent(o(t[r]))}).join(e):a?encodeURIComponent(o(a))+n+encodeURIComponent(o(t)):""};var i=Array.isArray||function(t){return "[object Array]"===Object.prototype.toString.call(t)};function u(t,e){if(t.map)return t.map(e);for(var n=[],r=0;r<t.length;r++)n.push(e(t[r],r));return n}var s=Object.keys||function(t){var e=[];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.push(n);return e};},function(t,e,n){t.exports=function(t){var e=/^\\\\\?\\/.test(t),n=/[^\x00-\x80]+/.test(t);return e||n?t:t.replace(/\\/g,"/")};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n(4);Object.keys(r).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(e,t,{enumerable:!0,get:function(){return r[t]}});});var o=c(n(19)),i=c(n(51)),u=c(n(52)),s=c(n(53)),a=c(n(54));function c(t){return t&&t.__esModule?t:{default:t}}r.SCHEMES.http=o.default,r.SCHEMES.https=i.default,r.SCHEMES.mailto=u.default,r.SCHEMES.urn=s.default,r.SCHEMES["urn:uuid"]=a.default;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n(17);e.default=(0, r.buildExps)(!0);},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r,o=n(19),i=(r=o)&&r.__esModule?r:{default:r};e.default={scheme:"https",domainHost:i.default.domainHost,parse:i.default.parse,serialize:i.default.serialize};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r,o=n(4),i=n(18),u=(r=i)&&r.__esModule?r:{default:r},s=n(6);var a={},c="[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]",f="[0-9A-Fa-f]",l=(0, s.subexp)((0, s.subexp)("%[EFef][0-9A-Fa-f]%"+f+f+"%"+f+f)+"|"+(0, s.subexp)("%[89A-Fa-f][0-9A-Fa-f]%"+f+f)+"|"+(0, s.subexp)("%"+f+f)),p="[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]",h="[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]",d=(0, s.merge)(h,'[\\"\\\\]'),v=(0, s.subexp)(p+"+"+(0, s.subexp)("\\."+p+"+")+"*"),y=(0, s.subexp)("\\\\"+d),_=(0, s.subexp)(h+"|"+y),g=(0, s.subexp)('\\"'+_+'*\\"'),m=(0, s.subexp)(c+"|"+l+"|[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"),b=(0, s.subexp)(v+"|\\[[\\x21-\\x5A\\x5E-\\x7E]*\\]"),w=(0, s.subexp)(v+"|"+g),x=(0, s.subexp)(w+"\\@"+b);(0, s.subexp)(x+(0, s.subexp)("\\,"+x)+"*");var O=(0, s.subexp)(m+"*"),C=O,S=(0, s.subexp)(O+"\\="+C),T=(0, s.subexp)(S+(0, s.subexp)("\\&"+S)+"*");(0, s.subexp)("\\?"+T);var A=(new RegExp(c,"g")),I=new RegExp(l,"g"),P=new RegExp((0, s.merge)("[^]",p,"[\\.]",'[\\"]',d),"g"),R=(new RegExp((0, s.merge)("[^]",p,"[\\.]","[\\[]","[\\x21-\\x5A\\x5E-\\x7E]","[\\]]"),"g"),new RegExp((0, s.merge)("[^]",c,"[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"),"g")),k=R;function D(t){var e=(0, o.pctDecChars)(t);return e.match(A)?e:t}e.default={scheme:"mailto",parse:function(t,e){var n=t.to=t.path?t.path.split(","):[];if(t.path=void 0,t.query){for(var r=!1,i={},s=t.query.split("&"),a=0,c=s.length;a<c;++a){var f=s[a].split("=");switch(f[0]){case"to":for(var l=f[1].split(","),p=0,h=l.length;p<h;++p)n.push(l[p]);break;case"subject":t.subject=(0, o.unescapeComponent)(f[1],e);break;case"body":t.body=(0, o.unescapeComponent)(f[1],e);break;default:r=!0,i[(0, o.unescapeComponent)(f[0],e)]=(0, o.unescapeComponent)(f[1],e);}}r&&(t.headers=i);}t.query=void 0;for(var d=0,v=n.length;d<v;++d){var y=n[d].split("@");if(y[0]=(0, o.unescapeComponent)(y[0]),e.unicodeSupport)y[1]=(0, o.unescapeComponent)(y[1],e).toLowerCase();else try{y[1]=u.default.toASCII((0,o.unescapeComponent)(y[1],e).toLowerCase());}catch(e){t.error=t.error||"Email address's domain name can not be converted to ASCII via punycode: "+e;}n[d]=y.join("@");}return t},serialize:function(t,e){var n=(0, s.toArray)(t.to);if(n){for(var r=0,i=n.length;r<i;++r){var c=String(n[r]),f=c.lastIndexOf("@"),l=c.slice(0,f).replace(I,D).replace(I,s.toUpperCase).replace(P,o.pctEncChar),p=c.slice(f+1);try{p=e.iri?u.default.toUnicode(p):u.default.toASCII((0,o.unescapeComponent)(p,e).toLowerCase());}catch(n){t.error=t.error||"Email address's domain name can not be converted to "+(e.iri?"Unicode":"ASCII")+" via punycode: "+n;}n[r]=l+"@"+p;}t.path=n.join(",");}var h=t.headers=t.headers||{};t.subject&&(h.subject=t.subject),t.body&&(h.body=t.body);var d=[];for(var v in h)h[v]!==a[v]&&d.push(v.replace(I,D).replace(I,s.toUpperCase).replace(R,o.pctEncChar)+"="+h[v].replace(I,D).replace(I,s.toUpperCase).replace(k,o.pctEncChar));return d.length&&(t.query=d.join("&")),t}};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n(4),o="(?:[0-9A-Za-z][0-9A-Za-z\\-]{1,31})",i=new RegExp("^urn\\:("+o+")$"),u=(/^([^\:]+)\:(.*)/),s=/[\x00-\x20\\\"\&\<\>\[\]\^\`\{\|\}\~\x7F-\xFF]/g;e.default={scheme:"urn",parse:function(t,e){var n=t.path&&t.path.match(u);if(n){var o="urn:"+n[1].toLowerCase(),i=r.SCHEMES[o];i||(i=r.SCHEMES[o]={scheme:o,parse:function(t,e){return t},serialize:r.SCHEMES.urn.serialize}),t.scheme=o,t.path=n[2],t=i.parse(t,e);}else t.error=t.error||"URN can not be parsed.";return t},serialize:function(t,e){var n=t.scheme||e.scheme;if(n&&"urn"!==n){var o=n.match(i)||["urn:"+n,n];t.scheme="urn",t.path=o[1]+":"+(t.path?t.path.replace(s,r.pctEncChar):"");}return t}};},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n(4),o=/^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;e.default={scheme:"urn:uuid",parse:function(t,e){return e.tolerant||t.path&&t.path.match(o)||(t.error=t.error||"UUID is not valid."),t},serialize:function(t,e){return e.tolerant||t.path&&t.path.match(o)?t.path=(t.path||"").toLowerCase():t.scheme=void 0,r.SCHEMES.urn.serialize(t,e)}};}]);

/* eslint-env browser */

const getCurrDir = () =>
  window.location.href.replace(/(index\.html)?#.*$/, '');

const getMetaProp = function getMetaProp (lang, metadataObj, properties, allowObjects) {
  let prop;
  properties = typeof properties === 'string' ? [properties] : properties;
  lang.some((lan) => {
    const p = [...properties];
    let strings = metadataObj['localization-strings'][lan];
    while (strings && p.length) {
      strings = strings[p.shift()];
    }
    // Todo: Fix this allowance for allowObjects (as it does not properly
    //        fallback if an object is returned from a language because
    //        that language is missing content and is only thus returning
    //        an object)
    prop = (allowObjects || typeof strings === 'string')
      ? strings
      : undefined;
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

  return (await JsonRefs
    .resolveRefsAt(
      url.toString(),
      {
        loaderOptions: {
          processContent (res, callback) {
            callback(undefined, JSON.parse(
              res.text ||
                            // `.metadata` not a recognized extension, so
                            //    convert to string for JSON in Node
                            res.body.toString()
            ));
          }
        }
      }
    )).resolved;
};

// Todo: Incorporate other methods into this class
class Metadata {
  constructor ({metadataObj}) {
    this.metadataObj = metadataObj;
  }

  getFieldLang (field) {
    const {metadataObj} = this;
    const fields = metadataObj && metadataObj.fields;
    return fields && fields[field] && fields[field].lang;
  }

  getFieldMatchesLocale ({
    namespace, preferredLocale, schemaItems,
    pluginsForWork
  }) {
    const {metadataObj} = this;
    return (field) => {
      const preferredLanguages = getPreferredLanguages({
        namespace, preferredLocale
      });
      if (pluginsForWork.isPluginField({namespace, field})) {
        let [, , targetLanguage] = pluginsForWork.getPluginFieldParts({namespace, field});
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        return !targetLanguage ||
                    preferredLanguages.includes(targetLanguage);
      }
      const metaLang = this.getFieldLang(field);
      const localeStrings = metadataObj &&
                metadataObj['localization-strings'];

      // If this is a localized field (e.g., enum), we don't want
      //  to avoid as may be translated (should check though)
      const hasFieldValue = localeStrings &&
                Object.keys(localeStrings).some(lng => {
                  const fv = localeStrings[lng] &&
                        localeStrings[lng].fieldvalue;
                  return fv && fv[field];
                });

      return hasFieldValue ||
                (metaLang && preferredLanguages.includes(metaLang)) ||
                schemaItems.some(item =>
                  item.title === field && item.type !== 'string'
                );
    };
  }
}

const escapePluginComponent = (pluginName) => {
  return pluginName.replace(/\^/g, '^^') // Escape our escape
    .replace(/-/g, '^0');
};

const unescapePluginComponent = (pluginName) => {
  if (!pluginName) {
    return pluginName;
  }
  return pluginName.replace(
    /(\^+)0/g,
    (n0, esc) => {
      return esc.length % 2
        ? esc.slice(1) + '-'
        : n0;
    }
  ).replace(/\^\^/g, '^');
};

const escapePlugin = ({pluginName, applicableField, targetLanguage}) => {
  return escapePluginComponent(pluginName) +
        (applicableField ? '-' + escapePluginComponent(applicableField) : '-') +
        (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};

class PluginsForWork {
  constructor ({pluginsInWork, pluginFieldMappings, pluginObjects}) {
    this.pluginsInWork = pluginsInWork;
    this.pluginFieldMappings = pluginFieldMappings;
    this.pluginObjects = pluginObjects;
  }
  getPluginObject (pluginName) {
    const idx = this.pluginsInWork.findIndex(([name]) => {
      return name === pluginName;
    });
    const plugin = this.pluginObjects[idx];
    return plugin;
  }
  iterateMappings (cb) {
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
        onByDefault: onByDefaultDefault, lang: pluginLang, meta
      }] = this.pluginsInWork[i];
      const plugin = this.getPluginObject(pluginName);
      cb({ // eslint-disable-line n/no-callback-literal
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
  processTargetLanguages (applicableFields, cb) {
    if (!applicableFields) {
      return false;
    }
    Object.entries(applicableFields).forEach(([applicableField, {
      targetLanguage, onByDefault, meta: metaApplicableField
    }]) => {
      if (Array.isArray(targetLanguage)) {
        targetLanguage.forEach((targetLanguage) => {
          cb({applicableField, targetLanguage, onByDefault, metaApplicableField}); // eslint-disable-line n/no-callback-literal
        });
      } else {
        // eslint-disable-next-line n/callback-return
        cb({applicableField, targetLanguage, onByDefault, metaApplicableField}); // eslint-disable-line n/no-callback-literal
      }
    });
    return true;
  }
  isPluginField ({namespace, field}) {
    return field.startsWith(`${namespace}-plugin-`);
  }
  getPluginFieldParts ({namespace, field}) {
    field = field.replace(`${namespace}-plugin-`, '');
    let pluginName, applicableField, targetLanguage;
    if (field.includes('-')) {
      ([pluginName, applicableField, targetLanguage] = field.split('-'));
    } else {
      pluginName = field;
    }
    return [pluginName, applicableField, targetLanguage].map(unescapePluginComponent);
  }
}

const getWorkFiles = async function getWorkFiles (files = this.files) {
  const filesObj = await getJSON(files);
  const dataFiles = [];
  filesObj.groups.forEach((fileGroup) => {
    fileGroup.files.forEach((fileData) => {
      const {file, schemaFile, metadataFile} =
                getFilePaths(filesObj, fileGroup, fileData);
      dataFiles.push(file, schemaFile, metadataFile);
    });
  });
  dataFiles.push(
    ...Object.values(filesObj.plugins).map((pl) => pl.path)
  );
  return dataFiles;
};

const getFilePaths = function getFilePaths (filesObj, fileGroup, fileData) {
  const baseDir = (filesObj.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
  const schemaBaseDir = (filesObj.schemaBaseDirectory || '') +
        (fileGroup.schemaBaseDirectory || '') + '/';
  const metadataBaseDir = (filesObj.metadataBaseDirectory || '') +
        (fileGroup.metadataBaseDirectory || '') + '/';

  const file = baseDir + fileData.file.$ref;
  const schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
  const metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';
  return {file, schemaFile, metadataFile};
};

const getWorkData = async function ({
  lang, fallbackLanguages, work, files, allowPlugins, basePath,
  languages, preferredLocale
}) {
  const filesObj = await getJSON(files);
  const localizationStrings = filesObj['localization-strings'];

  const workI18n = await i18n({
    messageStyle: 'plainNested',
    locales: lang,
    defaultLocales: fallbackLanguages,
    // Todo: Could at least share this with `index.js`
    localeStringFinder ({
      locales, defaultLocales
    }) {
      const locale = [...locales, ...defaultLocales].find((language) => {
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
  const fileGroup = filesObj.groups.find((fg) => {
    fileData = fg.files.find((file) =>
      work === workI18n(['workNames', fg.id, file.name])
    );
    return Boolean(fileData);
  });
    // This is not specific to the work, but we export it anyways
  const groupsToWorks = filesObj.groups.map((fg) => {
    return {
      name: workI18n(fg.name.localeKey),
      workNames: fg.files.map((file) => {
        return workI18n(['workNames', fg.id, file.name]);
      }),
      shortcuts: fg.files.map((file) => file.shortcut)
    };
  });

  const fp = getFilePaths(filesObj, fileGroup, fileData);
  const {file} = fp;
  let {schemaFile, metadataFile} = fp;

  let schemaProperty = '', metadataProperty = '';

  if (!schemaFile) {
    schemaFile = file;
    schemaProperty = 'schema';
  }
  if (!metadataFile) {
    metadataFile = file;
    metadataProperty = 'metadata';
  }

  let getPlugins, pluginsInWork, pluginFieldsForWork,
    pluginPaths, pluginFieldMappingForWork = [];
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
  const getFieldAliasOrName = function getFieldAliasOrName (field) {
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
    } else { // No alias
      fieldName = fieldObj.name;
      if (typeof fieldName === 'object') {
        fieldName = fieldName.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldName.split('/'));
      }
    }
    return fieldName;
  };
  const pluginFieldMappings = pluginFieldMappingForWork;

  const cwd = (typeof process === 'undefined'
    ? location.href.slice(0, location.href.lastIndexOf('/') + 1)
    : process.cwd() + '/'
  );

  const [schemaObj, pluginObjects] = await Promise.all([
    getMetadata(schemaFile, schemaProperty, basePath),
    getPlugins
      ? Promise.all(
        pluginPaths.map((pluginPath) => {
          // eslint-disable-next-line no-unsanitized/method
          return import(
            cwd +
            pluginPath
          );
        })
      )
      : null
  ]);
  const pluginsForWork = new PluginsForWork({
    pluginsInWork, pluginFieldMappings, pluginObjects
  });
  const schemaItems = schemaObj.items.items;
  const fieldInfo = schemaItems.map(({title: field}) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field
    };
  });
  const metadata = new Metadata({metadataObj});
  if (languages && // Avoid all this processing if this is not the specific call requiring
        pluginsForWork
  ) {
    console.log('pluginsForWork', pluginsForWork);
    const {lang, namespace} = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      plugin,
      pluginName, pluginLang,
      onByDefaultDefault,
      placement, applicableFields, meta
    }) => {
      const processField = ({applicableField, targetLanguage, onByDefault, metaApplicableField} = {}) => {
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
          targetLanguage: targetLanguage || pluginLang ||
                        applicableFieldLang
        });
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName
          ? plugin.getFieldAliasOrName({
            locales: lang,
            workI18n,
            targetLanguage,
            applicableField,
            applicableFieldI18N,
            meta,
            metaApplicableField,
            targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
          })
          : languages.getFieldNameFromPluginNameAndLocales({
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
          placement === 'end'
            ? Number.POSITIVE_INFINITY // push
            : placement,
          0,
          {
            field: `${namespace}-plugin-${field}`,
            fieldAliasOrName,
            // Plug-in specific (todo: allow specifying
            //    for non-plugins)
            onByDefault: typeof onByDefault === 'boolean'
              ? onByDefault
              : (onByDefaultDefault || false),
            // Three conventions for use by plug-ins but
            //     textbrowser only passes on (might
            //     not need here)
            applicableField,
            metaApplicableField,
            fieldLang: targetLanguage
          }
        );
      };
      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }
  return {
    fileData, workI18n, getFieldAliasOrName, metadataObj,
    schemaObj, schemaItems, fieldInfo,
    pluginsForWork, groupsToWorks, metadata
  };
};

export { getFilePaths, getWorkData, getWorkFiles };
