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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
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


function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
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
      return _catch(function () {
        return _invoke(function () {
          if (Array.isArray(jsonURL)) {
            return _await(Promise.all(jsonURL.map(url => {
              return getJSON(url);
            })), function (arrResult) {
              if (cb) {
                // eslint-disable-next-line node/callback-return, standard/no-callback-literal, promise/prefer-await-to-callbacks
                cb(...arrResult);
              }

              _exit = true;
              return arrResult;
            });
          }
        }, function (_result) {
          return _exit ? _result : _await(fetch(jsonURL), function (resp) {
            return _await(resp.json(), function (result) {
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
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _await$1(value, then, direct) {
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

const setDirname = _async(function () {
  return _invokeIgnored(function () {
    if (!dirname) {
      return _await$1(Promise.resolve().then(() => _interopRequireWildcard(require('path'))), function (_import) {
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

function _await$2(value, then, direct) {
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

function _invoke$1(body, then) {
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

function buildGetJSON({
  baseURL,
  cwd: basePath
} = {}) {
  const _fetch = typeof fetch !== 'undefined' ? fetch : _async$1(function (jsonURL) {
    let _exit = false;
    return _invoke$1(function () {
      if (/^https?:/u.test(jsonURL)) {
        return _invoke$1(function () {
          if (!nodeFetch) {
            return _await$2(Promise.resolve().then(() => _interopRequireWildcard(require('node-fetch'))), function (_import) {
              nodeFetch = _import;
            });
          }
        }, function () {
          _exit = true;
          return nodeFetch.default(jsonURL);
        });
      }
    }, function (_result) {
      return _exit ? _result : _invoke$1(function () {
        if (!basePath) {
          return _call(setDirname, function () {
            basePath = baseURL ? getDirectoryForURL(baseURL) : typeof fetch === 'undefined' && process.cwd();
          });
        }
      }, function () {
        // Filed https://github.com/bergos/file-fetch/issues/12 to see
        //  about getting relative basePaths in `file-fetch` and using
        //  that better-tested package instead
        return _await$2(Promise.resolve().then(() => _interopRequireWildcard(require('local-xmlhttprequest'))), function (localXMLHttpRequest) {
          // eslint-disable-next-line no-shadow
          const XMLHttpRequest = localXMLHttpRequest.default({
            basePath
          }); // Don't change to an import as won't resolve for browser testing
          // eslint-disable-next-line promise/avoid-new

          return new Promise((resolve, reject) => {
            const r = new XMLHttpRequest();
            r.open('GET', jsonURL, true); // r.responseType = 'json';

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

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
  var sources = Array.prototype.slice.call(arguments, 1),
      i,
      len,
      source,
      key;

  for (i = 0, len = sources.length; i < len; i += 1) {
    source = sources[i];

    if (!source) {
      continue;
    }

    for (key in source) {
      if (hop.call(source, key)) {
        obj[key] = source[key];
      }
    }
  }

  return obj;
}
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
// Copyright 2013 Andy Earnshaw, MIT License


var realDefineProp = function () {
  try {
    return !!Object.defineProperty({}, 'a', {});
  } catch (e) {
    return false;
  }
}();

var defineProperty = realDefineProp ? Object.defineProperty : function (obj, name, desc) {
  if ('get' in desc && obj.__defineGetter__) {
    obj.__defineGetter__(name, desc.get);
  } else if (!hop.call(obj, name) || 'value' in desc) {
    obj[name] = desc.value;
  }
};

var objCreate = Object.create || function (proto, props) {
  var obj, k;

  function F() {}

  F.prototype = proto;
  obj = new F();

  for (k in props) {
    if (hop.call(props, k)) {
      defineProperty(obj, k, props[k]);
    }
  }

  return obj;
};
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/


function Compiler(locales, formats, pluralFn) {
  this.locales = locales;
  this.formats = formats;
  this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
  this.pluralStack = [];
  this.currentPlural = null;
  this.pluralNumberFormat = null;
  return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
  if (!(ast && ast.type === 'messageFormatPattern')) {
    throw new Error('Message AST is not of type: "messageFormatPattern"');
  }

  var elements = ast.elements,
      pattern = [];
  var i, len, element;

  for (i = 0, len = elements.length; i < len; i += 1) {
    element = elements[i];

    switch (element.type) {
      case 'messageTextElement':
        pattern.push(this.compileMessageText(element));
        break;

      case 'argumentElement':
        pattern.push(this.compileArgument(element));
        break;

      default:
        throw new Error('Message element does not have a valid type');
    }
  }

  return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
  // When this `element` is part of plural sub-pattern and its value contains
  // an unescaped '#', use a `PluralOffsetString` helper to properly output
  // the number with the correct offset in the string.
  if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
    // Create a cache a NumberFormat instance that can be reused for any
    // PluralOffsetString instance in this message.
    if (!this.pluralNumberFormat) {
      this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
    }

    return new PluralOffsetString(this.currentPlural.id, this.currentPlural.format.offset, this.pluralNumberFormat, element.value);
  } // Unescape the escaped '#'s in the message text.


  return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
  var format = element.format;

  if (!format) {
    return new StringFormat(element.id);
  }

  var formats = this.formats,
      locales = this.locales,
      pluralFn = this.pluralFn,
      options;

  switch (format.type) {
    case 'numberFormat':
      options = formats.number[format.style];
      return {
        id: element.id,
        format: new Intl.NumberFormat(locales, options).format
      };

    case 'dateFormat':
      options = formats.date[format.style];
      return {
        id: element.id,
        format: new Intl.DateTimeFormat(locales, options).format
      };

    case 'timeFormat':
      options = formats.time[format.style];
      return {
        id: element.id,
        format: new Intl.DateTimeFormat(locales, options).format
      };

    case 'pluralFormat':
      options = this.compileOptions(element);
      return new PluralFormat(element.id, format.ordinal, format.offset, options, pluralFn);

    case 'selectFormat':
      options = this.compileOptions(element);
      return new SelectFormat(element.id, options);

    default:
      throw new Error('Message element does not have a valid format type');
  }
};

Compiler.prototype.compileOptions = function (element) {
  var format = element.format,
      options = format.options,
      optionsHash = {}; // Save the current plural element, if any, then set it to a new value when
  // compiling the options sub-patterns. This conforms the spec's algorithm
  // for handling `"#"` syntax in message text.

  this.pluralStack.push(this.currentPlural);
  this.currentPlural = format.type === 'pluralFormat' ? element : null;
  var i, len, option;

  for (i = 0, len = options.length; i < len; i += 1) {
    option = options[i]; // Compile the sub-pattern and save it under the options's selector.

    optionsHash[option.selector] = this.compileMessage(option.value);
  } // Pop the plural stack to put back the original current plural value.


  this.currentPlural = this.pluralStack.pop();
  return optionsHash;
}; // -- Compiler Helper Classes --------------------------------------------------


function StringFormat(id) {
  this.id = id;
}

StringFormat.prototype.format = function (value) {
  if (!value && typeof value !== 'number') {
    return '';
  }

  return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
  this.id = id;
  this.useOrdinal = useOrdinal;
  this.offset = offset;
  this.options = options;
  this.pluralFn = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
  var options = this.options;
  var option = options['=' + value] || options[this.pluralFn(value - this.offset, this.useOrdinal)];
  return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
  this.id = id;
  this.offset = offset;
  this.numberFormat = numberFormat;
  this.string = string;
}

PluralOffsetString.prototype.format = function (value) {
  var number = this.numberFormat.format(value - this.offset);
  return this.string.replace(/(^|[^\\])#/g, '$1' + number).replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
  this.id = id;
  this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
  var options = this.options;
  return options[value] || options.other;
};

var parser = function () {
  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */
  function peg$subclass(child, parent) {
    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        peg$FAILED = {},
        peg$startRuleFunctions = {
      start: peg$parsestart
    },
        peg$startRuleFunction = peg$parsestart,
        peg$c0 = function (elements) {
      return {
        type: 'messageFormatPattern',
        elements: elements,
        location: location()
      };
    },
        peg$c1 = function (text) {
      var string = '',
          i,
          j,
          outerLen,
          inner,
          innerLen;

      for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
        inner = text[i];

        for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
          string += inner[j];
        }
      }

      return string;
    },
        peg$c2 = function (messageText) {
      return {
        type: 'messageTextElement',
        value: messageText,
        location: location()
      };
    },
        peg$c3 = /^[^ \t\n\r,.+={}#]/,
        peg$c4 = {
      type: "class",
      value: "[^ \\t\\n\\r,.+={}#]",
      description: "[^ \\t\\n\\r,.+={}#]"
    },
        peg$c5 = "{",
        peg$c6 = {
      type: "literal",
      value: "{",
      description: "\"{\""
    },
        peg$c7 = ",",
        peg$c8 = {
      type: "literal",
      value: ",",
      description: "\",\""
    },
        peg$c9 = "}",
        peg$c10 = {
      type: "literal",
      value: "}",
      description: "\"}\""
    },
        peg$c11 = function (id, format) {
      return {
        type: 'argumentElement',
        id: id,
        format: format && format[2],
        location: location()
      };
    },
        peg$c12 = "number",
        peg$c13 = {
      type: "literal",
      value: "number",
      description: "\"number\""
    },
        peg$c14 = "date",
        peg$c15 = {
      type: "literal",
      value: "date",
      description: "\"date\""
    },
        peg$c16 = "time",
        peg$c17 = {
      type: "literal",
      value: "time",
      description: "\"time\""
    },
        peg$c18 = function (type, style) {
      return {
        type: type + 'Format',
        style: style && style[2],
        location: location()
      };
    },
        peg$c19 = "plural",
        peg$c20 = {
      type: "literal",
      value: "plural",
      description: "\"plural\""
    },
        peg$c21 = function (pluralStyle) {
      return {
        type: pluralStyle.type,
        ordinal: false,
        offset: pluralStyle.offset || 0,
        options: pluralStyle.options,
        location: location()
      };
    },
        peg$c22 = "selectordinal",
        peg$c23 = {
      type: "literal",
      value: "selectordinal",
      description: "\"selectordinal\""
    },
        peg$c24 = function (pluralStyle) {
      return {
        type: pluralStyle.type,
        ordinal: true,
        offset: pluralStyle.offset || 0,
        options: pluralStyle.options,
        location: location()
      };
    },
        peg$c25 = "select",
        peg$c26 = {
      type: "literal",
      value: "select",
      description: "\"select\""
    },
        peg$c27 = function (options) {
      return {
        type: 'selectFormat',
        options: options,
        location: location()
      };
    },
        peg$c28 = "=",
        peg$c29 = {
      type: "literal",
      value: "=",
      description: "\"=\""
    },
        peg$c30 = function (selector, pattern) {
      return {
        type: 'optionalFormatPattern',
        selector: selector,
        value: pattern,
        location: location()
      };
    },
        peg$c31 = "offset:",
        peg$c32 = {
      type: "literal",
      value: "offset:",
      description: "\"offset:\""
    },
        peg$c33 = function (number) {
      return number;
    },
        peg$c34 = function (offset, options) {
      return {
        type: 'pluralFormat',
        offset: offset,
        options: options,
        location: location()
      };
    },
        peg$c35 = {
      type: "other",
      description: "whitespace"
    },
        peg$c36 = /^[ \t\n\r]/,
        peg$c37 = {
      type: "class",
      value: "[ \\t\\n\\r]",
      description: "[ \\t\\n\\r]"
    },
        peg$c38 = {
      type: "other",
      description: "optionalWhitespace"
    },
        peg$c39 = /^[0-9]/,
        peg$c40 = {
      type: "class",
      value: "[0-9]",
      description: "[0-9]"
    },
        peg$c41 = /^[0-9a-f]/i,
        peg$c42 = {
      type: "class",
      value: "[0-9a-f]i",
      description: "[0-9a-f]i"
    },
        peg$c43 = "0",
        peg$c44 = {
      type: "literal",
      value: "0",
      description: "\"0\""
    },
        peg$c45 = /^[1-9]/,
        peg$c46 = {
      type: "class",
      value: "[1-9]",
      description: "[1-9]"
    },
        peg$c47 = function (digits) {
      return parseInt(digits, 10);
    },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = {
      type: "class",
      value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]",
      description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]"
    },
        peg$c50 = "\\\\",
        peg$c51 = {
      type: "literal",
      value: "\\\\",
      description: "\"\\\\\\\\\""
    },
        peg$c52 = function () {
      return '\\';
    },
        peg$c53 = "\\#",
        peg$c54 = {
      type: "literal",
      value: "\\#",
      description: "\"\\\\#\""
    },
        peg$c55 = function () {
      return '\\#';
    },
        peg$c56 = "\\{",
        peg$c57 = {
      type: "literal",
      value: "\\{",
      description: "\"\\\\{\""
    },
        peg$c58 = function () {
      return '\u007B';
    },
        peg$c59 = "\\}",
        peg$c60 = {
      type: "literal",
      value: "\\}",
      description: "\"\\\\}\""
    },
        peg$c61 = function () {
      return '\u007D';
    },
        peg$c62 = "\\u",
        peg$c63 = {
      type: "literal",
      value: "\\u",
      description: "\"\\\\u\""
    },
        peg$c64 = function (digits) {
      return String.fromCharCode(parseInt(digits, 16));
    },
        peg$c65 = function (chars) {
      return chars.join('');
    },
        peg$currPos = 0,
        peg$savedPos = 0,
        peg$posDetailsCache = [{
      line: 1,
      column: 1,
      seenCR: false
    }],
        peg$maxFailPos = 0,
        peg$maxFailExpected = [],
        peg$silentFails = 0,
        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p,
          ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;

        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);

          if (ch === "\n") {
            if (!details.seenCR) {
              details.line++;
            }

            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails = peg$computePosDetails(endPos);
      return {
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) {
        return;
      }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;
        expected.sort(function (a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
          }

          return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
            return '\\x0' + hex(ch);
          }).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
            return '\\x' + hex(ch);
          }).replace(/[\u0100-\u0FFF]/g, function (ch) {
            return '\\u0' + hex(ch);
          }).replace(/[\u1000-\uFFFF]/g, function (ch) {
            return '\\u' + hex(ch);
          });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc,
            foundDesc,
            i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];
        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";
        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(message !== null ? message : buildMessage(expected, found), expected, found, location);
    }

    function peg$parsestart() {
      var s0;
      s0 = peg$parsemessageFormatPattern();
      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();

      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }

      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }

      s0 = s1;
      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;
      s0 = peg$parsemessageTextElement();

      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();

      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();

        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();

          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }

      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();

          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();

              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      } else {
        s1 = peg$FAILED;
      }

      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c1(s1);
      }

      s0 = s1;

      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;
      s0 = peg$currPos;
      s1 = peg$parsemessageText();

      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }

      s0 = s1;
      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;
      s0 = peg$parsenumber();

      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];

        if (peg$c3.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c4);
          }
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);

            if (peg$c3.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c4);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;
      s0 = peg$currPos;

      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c6);
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();

          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();

            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;

              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c7;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c8);
                }
              }

              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();

                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();

                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }

              if (s5 === peg$FAILED) {
                s5 = null;
              }

              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();

                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }

                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;
      s0 = peg$parsesimpleFormat();

      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();

        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();

          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;
      s0 = peg$currPos;

      if (input.substr(peg$currPos, 6) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c13);
        }
      }

      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c15);
          }
        }

        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c17);
            }
          }
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;

          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c7;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c8);
            }
          }

          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();

            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();

              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }

          if (s3 === peg$FAILED) {
            s3 = null;
          }

          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;
      s0 = peg$currPos;

      if (input.substr(peg$currPos, 6) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c20);
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c8);
            }
          }

          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();

            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();

              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;
      s0 = peg$currPos;

      if (input.substr(peg$currPos, 13) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c23);
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c8);
            }
          }

          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();

            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();

              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;
      s0 = peg$currPos;

      if (input.substr(peg$currPos, 6) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c26);
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c8);
            }
          }

          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();

            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();

              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$FAILED;
              }

              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;
      s0 = peg$currPos;
      s1 = peg$currPos;

      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c28;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c29);
        }
      }

      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();

        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }

      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }

      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;
      s0 = peg$currPos;
      s1 = peg$parse_();

      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();

        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();

          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c5;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c6);
              }
            }

            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();

              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();

                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();

                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c9;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;

                      if (peg$silentFails === 0) {
                        peg$fail(peg$c10);
                      }
                    }

                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c30(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;
      s0 = peg$currPos;

      if (input.substr(peg$currPos, 7) === peg$c31) {
        s1 = peg$c31;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c32);
        }
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();

          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;
      s0 = peg$currPos;
      s1 = peg$parseoffset();

      if (s1 === peg$FAILED) {
        s1 = null;
      }

      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();

        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();

          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$FAILED;
          }

          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c34(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;
      peg$silentFails++;
      s0 = [];

      if (peg$c36.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c37);
        }
      }

      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);

          if (peg$c36.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c37);
            }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      peg$silentFails--;

      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c35);
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;
      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();

      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }

      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }

      peg$silentFails--;

      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c38);
        }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c39.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c40);
        }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c41.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c42);
        }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;
      s0 = peg$currPos;

      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c43;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c44);
        }
      }

      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;

        if (peg$c45.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c46);
          }
        }

        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();

          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }

          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
      }

      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c47(s1);
      }

      s0 = s1;
      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c48.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;

        if (peg$silentFails === 0) {
          peg$fail(peg$c49);
        }
      }

      if (s0 === peg$FAILED) {
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 2) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c51);
          }
        }

        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c52();
        }

        s0 = s1;

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.substr(peg$currPos, 2) === peg$c53) {
            s1 = peg$c53;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c54);
            }
          }

          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55();
          }

          s0 = s1;

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;

            if (input.substr(peg$currPos, 2) === peg$c56) {
              s1 = peg$c56;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c57);
              }
            }

            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58();
            }

            s0 = s1;

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c60);
                }
              }

              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
              }

              s0 = s1;

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;

                if (input.substr(peg$currPos, 2) === peg$c62) {
                  s1 = peg$c62;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c63);
                  }
                }

                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$currPos;
                  s4 = peg$parsehexDigit();

                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsehexDigit();

                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsehexDigit();

                      if (s6 !== peg$FAILED) {
                        s7 = peg$parsehexDigit();

                        if (s7 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }

                  if (s3 !== peg$FAILED) {
                    s2 = input.substring(s2, peg$currPos);
                  } else {
                    s2 = s3;
                  }

                  if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();

      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }

      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c65(s1);
      }

      s0 = s1;
      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({
          type: "end",
          description: "end of input"
        });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
  };
}();
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/


function MessageFormat(message, locales, formats) {
  // Parse string messages into an AST.
  var ast = typeof message === 'string' ? MessageFormat.__parse(message) : message;

  if (!(ast && ast.type === 'messageFormatPattern')) {
    throw new TypeError('A message must be provided as a String or AST.');
  } // Creates a new object with the specified `formats` merged with the default
  // formats.


  formats = this._mergeFormats(MessageFormat.formats, formats); // Defined first because it's used to build the format pattern.

  defineProperty(this, '_locale', {
    value: this._resolveLocale(locales)
  }); // Compile the `ast` to a pattern that is highly optimized for repeated
  // `format()` invocations. **Note:** This passes the `locales` set provided
  // to the constructor instead of just the resolved locale.

  var pluralFn = this._findPluralRuleFunction(this._locale);

  var pattern = this._compilePattern(ast, locales, formats, pluralFn); // "Bind" `format()` method to `this` so it can be passed by reference like
  // the other `Intl` APIs.


  var messageFormat = this;

  this.format = function (values) {
    try {
      return messageFormat._format(pattern, values);
    } catch (e) {
      if (e.variableId) {
        throw new Error('The intl string context variable \'' + e.variableId + '\'' + ' was not provided to the string \'' + message + '\'');
      } else {
        throw e;
      }
    }
  };
} // Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.


defineProperty(MessageFormat, 'formats', {
  enumerable: true,
  value: {
    number: {
      'currency': {
        style: 'currency'
      },
      'percent': {
        style: 'percent'
      }
    },
    date: {
      'short': {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit'
      },
      'medium': {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      },
      'long': {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      },
      'full': {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    },
    time: {
      'short': {
        hour: 'numeric',
        minute: 'numeric'
      },
      'medium': {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      },
      'long': {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      },
      'full': {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
      }
    }
  }
}); // Define internal private properties for dealing with locale data.

defineProperty(MessageFormat, '__localeData__', {
  value: objCreate(null)
});
defineProperty(MessageFormat, '__addLocaleData', {
  value: function (data) {
    if (!(data && data.locale)) {
      throw new Error('Locale data provided to IntlMessageFormat is missing a ' + '`locale` property');
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
  }
}); // Defines `__parse()` static method as an exposed private.

defineProperty(MessageFormat, '__parse', {
  value: parser.parse
}); // Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.

defineProperty(MessageFormat, 'defaultLocale', {
  enumerable: true,
  writable: true,
  value: undefined
});

MessageFormat.prototype.resolvedOptions = function () {
  // TODO: Provide anything else?
  return {
    locale: this._locale
  };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
  var compiler = new Compiler(locales, formats, pluralFn);
  return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
  var localeData = MessageFormat.__localeData__;
  var data = localeData[locale.toLowerCase()]; // The locale data is de-duplicated, so we have to traverse the locale's
  // hierarchy until we find a `pluralRuleFunction` to return.

  while (data) {
    if (data.pluralRuleFunction) {
      return data.pluralRuleFunction;
    }

    data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
  }

  throw new Error('Locale data added to IntlMessageFormat is missing a ' + '`pluralRuleFunction` for :' + locale);
};

MessageFormat.prototype._format = function (pattern, values) {
  var result = '',
      i,
      len,
      part,
      id,
      value,
      err;

  for (i = 0, len = pattern.length; i < len; i += 1) {
    part = pattern[i]; // Exist early for string parts.

    if (typeof part === 'string') {
      result += part;
      continue;
    }

    id = part.id; // Enforce that all required values are provided by the caller.

    if (!(values && hop.call(values, id))) {
      err = new Error('A value must be provided for: ' + id);
      err.variableId = id;
      throw err;
    }

    value = values[id]; // Recursively format plural and select parts' option — which can be a
    // nested pattern structure. The choosing of the option to use is
    // abstracted-by and delegated-to the part helper object.

    if (part.options) {
      result += this._format(part.getOption(value), values);
    } else {
      result += part.format(value);
    }
  }

  return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
  var mergedFormats = {},
      type,
      mergedType;

  for (type in defaults) {
    if (!hop.call(defaults, type)) {
      continue;
    }

    mergedFormats[type] = mergedType = objCreate(defaults[type]);

    if (formats && hop.call(formats, type)) {
      extend(mergedType, formats[type]);
    }
  }

  return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
  if (typeof locales === 'string') {
    locales = [locales];
  } // Create a copy of the array so we can push on the default locale.


  locales = (locales || []).concat(MessageFormat.defaultLocale);
  var localeData = MessageFormat.__localeData__;
  var i, len, localeParts, data; // Using the set of locales + the default locale, we look for the first one
  // which that has been registered. When data does not exist for a locale, we
  // traverse its ancestors to find something that's been registered within
  // its hierarchy of locales. Since we lack the proper `parentLocale` data
  // here, we must take a naive approach to traversal.

  for (i = 0, len = locales.length; i < len; i += 1) {
    localeParts = locales[i].toLowerCase().split('-');

    while (localeParts.length) {
      data = localeData[localeParts.join('-')];

      if (data) {
        // Return the normalized locale string; e.g., we return "en-US",
        // instead of "en-us".
        return data.locale;
      }

      localeParts.pop();
    }
  }

  var defaultLocale = locales.pop();
  throw new Error('No locale data has been added to IntlMessageFormat for: ' + locales.join(', ') + ', or the default locale: ' + defaultLocale);
}; // GENERATED FILE


var defaultLocale = {
  "locale": "en",
  "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
    if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";
    return n == 1 && v0 ? "one" : "other";
  }
};
/* jslint esnext: true */

MessageFormat.__addLocaleData(defaultLocale);

MessageFormat.defaultLocale = 'en';

function _typeof(obj) {
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

function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator$1(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function getJSON$1(_x, _x2, _x3) {
  return _getJSON.apply(this, arguments);
}

function _getJSON() {
  _getJSON = _asyncToGenerator$1( /*#__PURE__*/regeneratorRuntime.mark(function _callee(jsonURL, cb, errBack) {
    var arrResult, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (!Array.isArray(jsonURL)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return Promise.all(jsonURL.map(function (url) {
              return getJSON$1(url);
            }));

          case 4:
            arrResult = _context.sent;

            if (cb) {
              cb.apply(null, arrResult);
            }

            return _context.abrupt("return", arrResult);

          case 7:
            _context.next = 9;
            return fetch(jsonURL).then(function (r) {
              return r.json();
            });

          case 9:
            result = _context.sent;
            return _context.abrupt("return", typeof cb === 'function' ? cb(result) : result);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            _context.t0.message += " (File: ".concat(jsonURL, ")");

            if (!errBack) {
              _context.next = 18;
              break;
            }

            return _context.abrupt("return", errBack(_context.t0, jsonURL));

          case 18:
            throw _context.t0;

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 13]]);
  }));
  return _getJSON.apply(this, arguments);
}
/* eslint-env node */


if (typeof fetch === 'undefined') {
  global.fetch = function (jsonURL) {
    return new Promise(function (resolve, reject) {
      var XMLHttpRequest = require('local-xmlhttprequest')({
        basePath: __dirname
      }); // Don't change to an import as won't resolve for browser testing


      var r = new XMLHttpRequest();
      r.open('GET', jsonURL, true); // r.responseType = 'json';

      r.onreadystatechange = function () {
        if (r.readyState !== 4) {
          return;
        }

        if (r.status === 200) {
          // var json = r.json;
          var response = r.responseText;
          resolve({
            json: function json() {
              return JSON.parse(response);
            }
          });
          return;
        }

        reject(new SyntaxError('Failed to fetch URL: ' + jsonURL + 'state: ' + r.readyState + '; status: ' + r.status));
      };

      r.send();
    });
  };
}

function IMFClass(opts) {
  var _this = this,
      _arguments = arguments;

  if (!(this instanceof IMFClass)) {
    return new IMFClass(opts);
  }

  opts = opts || {};
  this.defaultNamespace = opts.defaultNamespace || '';
  this.defaultSeparator = opts.defaultSeparator === undefined ? '.' : opts.defaultSeparator;
  this.basePath = opts.basePath || 'locales/';
  this.fallbackLanguages = opts.fallbackLanguages;

  this.localeFileResolver = opts.localeFileResolver || function (lang) {
    return this.basePath + lang + '.json';
  };

  this.locales = opts.locales || [];
  this.langs = opts.langs;
  this.fallbackLocales = opts.fallbackLocales || [];

  var loadFallbacks = function loadFallbacks(cb) {
    _this.loadLocales(_this.fallbackLanguages, function () {
      var _this$fallbackLocales;

      for (var _len = arguments.length, fallbackLocales = new Array(_len), _key = 0; _key < _len; _key++) {
        fallbackLocales[_key] = arguments[_key];
      }

      (_this$fallbackLocales = this.fallbackLocales).push.apply(_this$fallbackLocales, fallbackLocales);

      if (cb) {
        return cb(fallbackLocales);
      }
    }, true);
  };

  if (opts.languages || opts.callback) {
    this.loadLocales(opts.languages, function () {
      var locales = Array.from(_arguments);

      var runCallback = function runCallback(fallbackLocales) {
        if (opts.callback) {
          opts.callback.apply(_this, [_this.getFormatter(opts.namespace), _this.getFormatter.bind(_this), locales, fallbackLocales]);
        }
      };

      if (opts.hasOwnProperty('fallbackLanguages')) {
        loadFallbacks(runCallback);
      } else {
        runCallback();
      }
    });
  } else if (opts.hasOwnProperty('fallbackLanguages')) {
    loadFallbacks();
  }
}

IMFClass.prototype.getFormatter = function (ns, sep) {
  var _this2 = this;

  function messageForNSParts(locale, namesp, separator, key) {
    var loc = locale;
    var found = namesp.split(separator).every(function (nsPart) {
      loc = loc[nsPart];
      return loc && _typeof(loc) === 'object';
    });
    return found && loc[key] ? loc[key] : '';
  }

  var isArray = Array.isArray;
  ns = ns === undefined ? this.defaultNamespace : ns;
  sep = sep === undefined ? this.defaultSeparator : sep;
  ns = isArray(ns) ? ns.join(sep) : ns;
  return function (key, values, formats, fallback) {
    var message;
    var currNs = ns;

    if (key && !isArray(key) && _typeof(key) === 'object') {
      values = key.values;
      formats = key.formats;
      fallback = key.fallback;
      key = key.key;
    }

    if (isArray(key)) {
      // e.g., [ns1, ns2, key]
      var newKey = key.pop();
      currNs = key.join(sep);
      key = newKey;
    } else {
      var keyPos = key.indexOf(sep);

      if (!currNs && keyPos > -1) {
        // e.g., 'ns1.ns2.key'
        currNs = key.slice(0, keyPos);
        key = key.slice(keyPos + 1);
      }
    }

    function findMessage(locales) {
      locales.some(function (locale) {
        message = locale[(currNs ? currNs + sep : '') + key] || messageForNSParts(locale, currNs, sep, key);
        return message;
      });
      return message;
    }

    findMessage(_this2.locales);

    if (!message) {
      if (typeof fallback === 'function') {
        return fallback({
          message: _this2.fallbackLocales.length && findMessage(_this2.fallbackLocales),
          langs: _this2.langs,
          namespace: currNs,
          separator: sep,
          key: key,
          values: values,
          formats: formats
        });
      }

      if (fallback !== false) {
        return _this2.fallbackLocales.length && findMessage(_this2.fallbackLocales);
      }

      throw new Error('Message not found for locales ' + _this2.langs + (_this2.fallbackLanguages ? ' (with fallback languages ' + _this2.fallbackLanguages + ')' : '') + ' with key ' + key + ', namespace ' + currNs + ', and namespace separator ' + sep);
    }

    if (!values && !formats) {
      return message;
    }

    var msg = new MessageFormat(message, _this2.langs, formats);
    return msg.format(values);
  };
};

IMFClass.prototype.loadLocales = function (langs, cb, avoidSettingLocales) {
  var _this3 = this;

  langs = langs || navigator.language || 'en-US';
  langs = Array.isArray(langs) ? langs : [langs];

  if (!avoidSettingLocales) {
    this.langs = langs;
  }

  return getJSON$1(langs.map(this.localeFileResolver, this), function () {
    for (var _len2 = arguments.length, locales = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      locales[_key2] = arguments[_key2];
    }

    if (!avoidSettingLocales) {
      var _this3$locales;

      (_this3$locales = _this3.locales).push.apply(_this3$locales, locales);
    }

    if (cb) {
      cb.apply(_this3, locales);
    }
  });
};
/* eslint-env node */


if (typeof global !== 'undefined') {
  global.IntlMessageFormat = MessageFormat;
}

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
        // eslint-disable-next-line unicorn/prefer-node-append
        document.head.appendChild(link);
      }
    }

    const link = document.createElement('link'); // eslint-disable-next-line promise/avoid-new

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

function _typeof$1(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof$1 = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof$1(obj);
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
  if (_typeof$1(options) !== 'object') {
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

        if (!control || _typeof$1(control) !== 'object' || !('length' in control)) {
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

function getIMFFallbackResults({
  $p,
  lang,
  langs,
  langData,
  fallbackLanguages,
  resultsDisplay,
  basePath = '',
  localeCallback = false
}) {
  return new Promise((resolve, reject) => {
    const resultsCallback = (...args) => {
      const [l10n] = args;

      if (!$p.l10n) {
        $p.l10n = l10n;
      }

      return resultsDisplay({
        l: l10n,
        lang,
        fallbackLanguages,
        imfLocales: imf.locales,
        $p,
        basePath
      }, ...args);
    };

    const imf = IMFClass({
      languages: lang,
      fallbackLanguages,

      localeFileResolver(code) {
        // Todo: For editing of locales, we might instead resolve all
        //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
        //    replace IMF() loadLocales behavior with our own now resolved
        //    locales; see https://github.com/jdorn/json-editor/issues/132
        return basePath + langData.localeFileBasePath + langs.find(l => l.code === code).locale.$ref;
      },

      async callback(...args) {
        if (localeCallback && localeCallback(...args)) {
          resolve();
          return;
        }

        await resultsCallback(...args);
        resolve();
      }

    });
  });
}

// nb. This is for IE10 and lower _only_.
var supportCustomEvent = window.CustomEvent;

if (!supportCustomEvent || typeof supportCustomEvent === 'object') {
  supportCustomEvent = function CustomEvent(event, x) {
    x = x || {};
    var ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
    return ev;
  };

  supportCustomEvent.prototype = window.Event.prototype;
}
/**
 * Dispatches the passed event to both an "on<type>" handler as well as via the
 * normal dispatch operation. Does not bubble.
 *
 * @param {!EventTarget} target
 * @param {!Event} event
 * @return {boolean}
 */


function safeDispatchEvent(target, event) {
  var check = 'on' + event.type.toLowerCase();

  if (typeof target[check] === 'function') {
    target[check](event);
  }

  return target.dispatchEvent(event);
}
/**
 * @param {Element} el to check for stacking context
 * @return {boolean} whether this el or its parents creates a stacking context
 */


function createsStackingContext(el) {
  while (el && el !== document.body) {
    var s = window.getComputedStyle(el);

    var invalid = function (k, ok) {
      return !(s[k] === undefined || s[k] === ok);
    };

    if (s.opacity < 1 || invalid('zIndex', 'auto') || invalid('transform', 'none') || invalid('mixBlendMode', 'normal') || invalid('filter', 'none') || invalid('perspective', 'none') || s['isolation'] === 'isolate' || s.position === 'fixed' || s.webkitOverflowScrolling === 'touch') {
      return true;
    }

    el = el.parentElement;
  }

  return false;
}
/**
 * Finds the nearest <dialog> from the passed element.
 *
 * @param {Element} el to search from
 * @return {HTMLDialogElement} dialog found
 */


function findNearestDialog(el) {
  while (el) {
    if (el.localName === 'dialog') {
      return (
        /** @type {HTMLDialogElement} */
        el
      );
    }

    el = el.parentElement;
  }

  return null;
}
/**
 * Blur the specified element, as long as it's not the HTML body element.
 * This works around an IE9/10 bug - blurring the body causes Windows to
 * blur the whole application.
 *
 * @param {Element} el to blur
 */


function safeBlur(el) {
  // Find the actual focused element when the active element is inside a shadow root
  while (el && el.shadowRoot && el.shadowRoot.activeElement) {
    el = el.shadowRoot.activeElement;
  }

  if (el && el.blur && el !== document.body) {
    el.blur();
  }
}
/**
 * @param {!NodeList} nodeList to search
 * @param {Node} node to find
 * @return {boolean} whether node is inside nodeList
 */


function inNodeList(nodeList, node) {
  for (var i = 0; i < nodeList.length; ++i) {
    if (nodeList[i] === node) {
      return true;
    }
  }

  return false;
}
/**
 * @param {HTMLFormElement} el to check
 * @return {boolean} whether this form has method="dialog"
 */


function isFormMethodDialog(el) {
  if (!el || !el.hasAttribute('method')) {
    return false;
  }

  return el.getAttribute('method').toLowerCase() === 'dialog';
}
/**
 * @param {!DocumentFragment|!Element} hostElement
 * @return {?Element}
 */


function findFocusableElementWithin(hostElement) {
  // Note that this is 'any focusable area'. This list is probably not exhaustive, but the
  // alternative involves stepping through and trying to focus everything.
  var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
  var query = opts.map(function (el) {
    return el + ':not([disabled])';
  }); // TODO(samthor): tabindex values that are not numeric are not focusable.

  query.push('[tabindex]:not([disabled]):not([tabindex=""])'); // tabindex != "", not disabled

  var target = hostElement.querySelector(query.join(', '));

  if (!target && 'attachShadow' in Element.prototype) {
    // If we haven't found a focusable target, see if the host element contains an element
    // which has a shadowRoot.
    // Recursively search for the first focusable item in shadow roots.
    var elems = hostElement.querySelectorAll('*');

    for (var i = 0; i < elems.length; i++) {
      if (elems[i].tagName && elems[i].shadowRoot) {
        target = findFocusableElementWithin(elems[i].shadowRoot);

        if (target) {
          break;
        }
      }
    }
  }

  return target;
}
/**
 * Determines if an element is attached to the DOM.
 * @param {Element} element to check
 * @return {Boolean} whether the element is in DOM
 */


function isConnected(element) {
  return element.isConnected || document.body.contains(element);
}
/**
 * @param {!Event} event
 */


function findFormSubmitter(event) {
  if (event.submitter) {
    return event.submitter;
  }

  var form = event.target;

  if (!(form instanceof HTMLFormElement)) {
    return null;
  }

  var submitter = dialogPolyfill.formSubmitter;

  if (!submitter) {
    var target = event.target;
    var root = 'getRootNode' in target && target.getRootNode() || document;
    submitter = root.activeElement;
  }

  if (submitter.form !== form) {
    return null;
  }

  return submitter;
}
/**
 * @param {!Event} event
 */


function maybeHandleSubmit(event) {
  if (event.defaultPrevented) {
    return;
  }

  var form =
  /** @type {!HTMLFormElement} */
  event.target; // We'd have a value if we clicked on an imagemap.

  var value = dialogPolyfill.useValue;
  var submitter = findFormSubmitter(event);

  if (value === null && submitter) {
    value = submitter.value;
  } // There should always be a dialog as this handler is added specifically on them, but check just
  // in case.


  var dialog = findNearestDialog(form);

  if (!dialog) {
    return;
  } // Prefer formmethod on the button.


  var formmethod = submitter && submitter.getAttribute('formmethod') || form.getAttribute('method');

  if (formmethod !== 'dialog') {
    return;
  }

  event.preventDefault();

  if (submitter) {
    dialog.close(value);
  } else {
    dialog.close();
  }
}
/**
 * @param {!HTMLDialogElement} dialog to upgrade
 * @constructor
 */


function dialogPolyfillInfo(dialog) {
  this.dialog_ = dialog;
  this.replacedStyleTop_ = false;
  this.openAsModal_ = false; // Set a11y role. Browsers that support dialog implicitly know this already.

  if (!dialog.hasAttribute('role')) {
    dialog.setAttribute('role', 'dialog');
  }

  dialog.show = this.show.bind(this);
  dialog.showModal = this.showModal.bind(this);
  dialog.close = this.close.bind(this);
  dialog.addEventListener('submit', maybeHandleSubmit, false);

  if (!('returnValue' in dialog)) {
    dialog.returnValue = '';
  }

  if ('MutationObserver' in window) {
    var mo = new MutationObserver(this.maybeHideModal.bind(this));
    mo.observe(dialog, {
      attributes: true,
      attributeFilter: ['open']
    });
  } else {
    // IE10 and below support. Note that DOMNodeRemoved etc fire _before_ removal. They also
    // seem to fire even if the element was removed as part of a parent removal. Use the removed
    // events to force downgrade (useful if removed/immediately added).
    var removed = false;

    var cb = function () {
      removed ? this.downgradeModal() : this.maybeHideModal();
      removed = false;
    }.bind(this);

    var timeout;

    var delayModel = function (ev) {
      if (ev.target !== dialog) {
        return;
      } // not for a child element


      var cand = 'DOMNodeRemoved';
      removed |= ev.type.substr(0, cand.length) === cand;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(cb, 0);
    };

    ['DOMAttrModified', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument'].forEach(function (name) {
      dialog.addEventListener(name, delayModel);
    });
  } // Note that the DOM is observed inside DialogManager while any dialog
  // is being displayed as a modal, to catch modal removal from the DOM.


  Object.defineProperty(dialog, 'open', {
    set: this.setOpen.bind(this),
    get: dialog.hasAttribute.bind(dialog, 'open')
  });
  this.backdrop_ = document.createElement('div');
  this.backdrop_.className = 'backdrop';
  this.backdrop_.addEventListener('mouseup', this.backdropMouseEvent_.bind(this));
  this.backdrop_.addEventListener('mousedown', this.backdropMouseEvent_.bind(this));
  this.backdrop_.addEventListener('click', this.backdropMouseEvent_.bind(this));
}

dialogPolyfillInfo.prototype =
/** @type {HTMLDialogElement.prototype} */
{
  get dialog() {
    return this.dialog_;
  },

  /**
   * Maybe remove this dialog from the modal top layer. This is called when
   * a modal dialog may no longer be tenable, e.g., when the dialog is no
   * longer open or is no longer part of the DOM.
   */
  maybeHideModal: function () {
    if (this.dialog_.hasAttribute('open') && isConnected(this.dialog_)) {
      return;
    }

    this.downgradeModal();
  },

  /**
   * Remove this dialog from the modal top layer, leaving it as a non-modal.
   */
  downgradeModal: function () {
    if (!this.openAsModal_) {
      return;
    }

    this.openAsModal_ = false;
    this.dialog_.style.zIndex = ''; // This won't match the native <dialog> exactly because if the user set top on a centered
    // polyfill dialog, that top gets thrown away when the dialog is closed. Not sure it's
    // possible to polyfill this perfectly.

    if (this.replacedStyleTop_) {
      this.dialog_.style.top = '';
      this.replacedStyleTop_ = false;
    } // Clear the backdrop and remove from the manager.


    this.backdrop_.parentNode && this.backdrop_.parentNode.removeChild(this.backdrop_);
    dialogPolyfill.dm.removeDialog(this);
  },

  /**
   * @param {boolean} value whether to open or close this dialog
   */
  setOpen: function (value) {
    if (value) {
      this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
    } else {
      this.dialog_.removeAttribute('open');
      this.maybeHideModal(); // nb. redundant with MutationObserver
    }
  },

  /**
   * Handles mouse events ('mouseup', 'mousedown', 'click') on the fake .backdrop element, redirecting them as if
   * they were on the dialog itself.
   *
   * @param {!Event} e to redirect
   */
  backdropMouseEvent_: function (e) {
    if (!this.dialog_.hasAttribute('tabindex')) {
      // Clicking on the backdrop should move the implicit cursor, even if dialog cannot be
      // focused. Create a fake thing to focus on. If the backdrop was _before_ the dialog, this
      // would not be needed - clicks would move the implicit cursor there.
      var fake = document.createElement('div');
      this.dialog_.insertBefore(fake, this.dialog_.firstChild);
      fake.tabIndex = -1;
      fake.focus();
      this.dialog_.removeChild(fake);
    } else {
      this.dialog_.focus();
    }

    var redirectedEvent = document.createEvent('MouseEvents');
    redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
    this.dialog_.dispatchEvent(redirectedEvent);
    e.stopPropagation();
  },

  /**
   * Focuses on the first focusable element within the dialog. This will always blur the current
   * focus, even if nothing within the dialog is found.
   */
  focus_: function () {
    // Find element with `autofocus` attribute, or fall back to the first form/tabindex control.
    var target = this.dialog_.querySelector('[autofocus]:not([disabled])');

    if (!target && this.dialog_.tabIndex >= 0) {
      target = this.dialog_;
    }

    if (!target) {
      target = findFocusableElementWithin(this.dialog_);
    }

    safeBlur(document.activeElement);
    target && target.focus();
  },

  /**
   * Sets the zIndex for the backdrop and dialog.
   *
   * @param {number} dialogZ
   * @param {number} backdropZ
   */
  updateZIndex: function (dialogZ, backdropZ) {
    if (dialogZ < backdropZ) {
      throw new Error('dialogZ should never be < backdropZ');
    }

    this.dialog_.style.zIndex = dialogZ;
    this.backdrop_.style.zIndex = backdropZ;
  },

  /**
   * Shows the dialog. If the dialog is already open, this does nothing.
   */
  show: function () {
    if (!this.dialog_.open) {
      this.setOpen(true);
      this.focus_();
    }
  },

  /**
   * Show this dialog modally.
   */
  showModal: function () {
    if (this.dialog_.hasAttribute('open')) {
      throw new Error('Failed to execute \'showModal\' on dialog: The element is already open, and therefore cannot be opened modally.');
    }

    if (!isConnected(this.dialog_)) {
      throw new Error('Failed to execute \'showModal\' on dialog: The element is not in a Document.');
    }

    if (!dialogPolyfill.dm.pushDialog(this)) {
      throw new Error('Failed to execute \'showModal\' on dialog: There are too many open modal dialogs.');
    }

    if (createsStackingContext(this.dialog_.parentElement)) {
      console.warn('A dialog is being shown inside a stacking context. ' + 'This may cause it to be unusable. For more information, see this link: ' + 'https://github.com/GoogleChrome/dialog-polyfill/#stacking-context');
    }

    this.setOpen(true);
    this.openAsModal_ = true; // Optionally center vertically, relative to the current viewport.

    if (dialogPolyfill.needsCentering(this.dialog_)) {
      dialogPolyfill.reposition(this.dialog_);
      this.replacedStyleTop_ = true;
    } else {
      this.replacedStyleTop_ = false;
    } // Insert backdrop.


    this.dialog_.parentNode.insertBefore(this.backdrop_, this.dialog_.nextSibling); // Focus on whatever inside the dialog.

    this.focus_();
  },

  /**
   * Closes this HTMLDialogElement. This is optional vs clearing the open
   * attribute, however this fires a 'close' event.
   *
   * @param {string=} opt_returnValue to use as the returnValue
   */
  close: function (opt_returnValue) {
    if (!this.dialog_.hasAttribute('open')) {
      throw new Error('Failed to execute \'close\' on dialog: The element does not have an \'open\' attribute, and therefore cannot be closed.');
    }

    this.setOpen(false); // Leave returnValue untouched in case it was set directly on the element

    if (opt_returnValue !== undefined) {
      this.dialog_.returnValue = opt_returnValue;
    } // Triggering "close" event for any attached listeners on the <dialog>.


    var closeEvent = new supportCustomEvent('close', {
      bubbles: false,
      cancelable: false
    });
    safeDispatchEvent(this.dialog_, closeEvent);
  }
};
var dialogPolyfill = {};

dialogPolyfill.reposition = function (element) {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
  element.style.top = Math.max(scrollTop, topValue) + 'px';
};

dialogPolyfill.isInlinePositionSetByStylesheet = function (element) {
  for (var i = 0; i < document.styleSheets.length; ++i) {
    var styleSheet = document.styleSheets[i];
    var cssRules = null; // Some browsers throw on cssRules.

    try {
      cssRules = styleSheet.cssRules;
    } catch (e) {}

    if (!cssRules) {
      continue;
    }

    for (var j = 0; j < cssRules.length; ++j) {
      var rule = cssRules[j];
      var selectedNodes = null; // Ignore errors on invalid selector texts.

      try {
        selectedNodes = document.querySelectorAll(rule.selectorText);
      } catch (e) {}

      if (!selectedNodes || !inNodeList(selectedNodes, element)) {
        continue;
      }

      var cssTop = rule.style.getPropertyValue('top');
      var cssBottom = rule.style.getPropertyValue('bottom');

      if (cssTop && cssTop !== 'auto' || cssBottom && cssBottom !== 'auto') {
        return true;
      }
    }
  }

  return false;
};

dialogPolyfill.needsCentering = function (dialog) {
  var computedStyle = window.getComputedStyle(dialog);

  if (computedStyle.position !== 'absolute') {
    return false;
  } // We must determine whether the top/bottom specified value is non-auto.  In
  // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
  // Firefox returns the used value. So we do this crazy thing instead: check
  // the inline style and then go through CSS rules.


  if (dialog.style.top !== 'auto' && dialog.style.top !== '' || dialog.style.bottom !== 'auto' && dialog.style.bottom !== '') {
    return false;
  }

  return !dialogPolyfill.isInlinePositionSetByStylesheet(dialog);
};
/**
 * @param {!Element} element to force upgrade
 */


dialogPolyfill.forceRegisterDialog = function (element) {
  if (window.HTMLDialogElement || element.showModal) {
    console.warn('This browser already supports <dialog>, the polyfill ' + 'may not work correctly', element);
  }

  if (element.localName !== 'dialog') {
    throw new Error('Failed to register dialog: The element is not a dialog.');
  }

  new dialogPolyfillInfo(
  /** @type {!HTMLDialogElement} */
  element);
};
/**
 * @param {!Element} element to upgrade, if necessary
 */


dialogPolyfill.registerDialog = function (element) {
  if (!element.showModal) {
    dialogPolyfill.forceRegisterDialog(element);
  }
};
/**
 * @constructor
 */


dialogPolyfill.DialogManager = function () {
  /** @type {!Array<!dialogPolyfillInfo>} */
  this.pendingDialogStack = [];
  var checkDOM = this.checkDOM_.bind(this); // The overlay is used to simulate how a modal dialog blocks the document.
  // The blocking dialog is positioned on top of the overlay, and the rest of
  // the dialogs on the pending dialog stack are positioned below it. In the
  // actual implementation, the modal dialog stacking is controlled by the
  // top layer, where z-index has no effect.

  this.overlay = document.createElement('div');
  this.overlay.className = '_dialog_overlay';
  this.overlay.addEventListener('click', function (e) {
    this.forwardTab_ = undefined;
    e.stopPropagation();
    checkDOM([]); // sanity-check DOM
  }.bind(this));
  this.handleKey_ = this.handleKey_.bind(this);
  this.handleFocus_ = this.handleFocus_.bind(this);
  this.zIndexLow_ = 100000;
  this.zIndexHigh_ = 100000 + 150;
  this.forwardTab_ = undefined;

  if ('MutationObserver' in window) {
    this.mo_ = new MutationObserver(function (records) {
      var removed = [];
      records.forEach(function (rec) {
        for (var i = 0, c; c = rec.removedNodes[i]; ++i) {
          if (!(c instanceof Element)) {
            continue;
          } else if (c.localName === 'dialog') {
            removed.push(c);
          }

          removed = removed.concat(c.querySelectorAll('dialog'));
        }
      });
      removed.length && checkDOM(removed);
    });
  }
};
/**
 * Called on the first modal dialog being shown. Adds the overlay and related
 * handlers.
 */


dialogPolyfill.DialogManager.prototype.blockDocument = function () {
  document.documentElement.addEventListener('focus', this.handleFocus_, true);
  document.addEventListener('keydown', this.handleKey_);
  this.mo_ && this.mo_.observe(document, {
    childList: true,
    subtree: true
  });
};
/**
 * Called on the first modal dialog being removed, i.e., when no more modal
 * dialogs are visible.
 */


dialogPolyfill.DialogManager.prototype.unblockDocument = function () {
  document.documentElement.removeEventListener('focus', this.handleFocus_, true);
  document.removeEventListener('keydown', this.handleKey_);
  this.mo_ && this.mo_.disconnect();
};
/**
 * Updates the stacking of all known dialogs.
 */


dialogPolyfill.DialogManager.prototype.updateStacking = function () {
  var zIndex = this.zIndexHigh_;

  for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
    dpi.updateZIndex(--zIndex, --zIndex);

    if (i === 0) {
      this.overlay.style.zIndex = --zIndex;
    }
  } // Make the overlay a sibling of the dialog itself.


  var last = this.pendingDialogStack[0];

  if (last) {
    var p = last.dialog.parentNode || document.body;
    p.appendChild(this.overlay);
  } else if (this.overlay.parentNode) {
    this.overlay.parentNode.removeChild(this.overlay);
  }
};
/**
 * @param {Element} candidate to check if contained or is the top-most modal dialog
 * @return {boolean} whether candidate is contained in top dialog
 */


dialogPolyfill.DialogManager.prototype.containedByTopDialog_ = function (candidate) {
  while (candidate = findNearestDialog(candidate)) {
    for (var i = 0, dpi; dpi = this.pendingDialogStack[i]; ++i) {
      if (dpi.dialog === candidate) {
        return i === 0; // only valid if top-most
      }
    }

    candidate = candidate.parentElement;
  }

  return false;
};

dialogPolyfill.DialogManager.prototype.handleFocus_ = function (event) {
  var target = event.composedPath ? event.composedPath()[0] : event.target;

  if (this.containedByTopDialog_(target)) {
    return;
  }

  if (document.activeElement === document.documentElement) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  safeBlur(
  /** @type {Element} */
  target);

  if (this.forwardTab_ === undefined) {
    return;
  } // move focus only from a tab key


  var dpi = this.pendingDialogStack[0];
  var dialog = dpi.dialog;
  var position = dialog.compareDocumentPosition(target);

  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    if (this.forwardTab_) {
      // forward
      dpi.focus_();
    } else if (target !== document.documentElement) {
      // backwards if we're not already focused on <html>
      document.documentElement.focus();
    }
  }

  return false;
};

dialogPolyfill.DialogManager.prototype.handleKey_ = function (event) {
  this.forwardTab_ = undefined;

  if (event.keyCode === 27) {
    event.preventDefault();
    event.stopPropagation();
    var cancelEvent = new supportCustomEvent('cancel', {
      bubbles: false,
      cancelable: true
    });
    var dpi = this.pendingDialogStack[0];

    if (dpi && safeDispatchEvent(dpi.dialog, cancelEvent)) {
      dpi.dialog.close();
    }
  } else if (event.keyCode === 9) {
    this.forwardTab_ = !event.shiftKey;
  }
};
/**
 * Finds and downgrades any known modal dialogs that are no longer displayed. Dialogs that are
 * removed and immediately readded don't stay modal, they become normal.
 *
 * @param {!Array<!HTMLDialogElement>} removed that have definitely been removed
 */


dialogPolyfill.DialogManager.prototype.checkDOM_ = function (removed) {
  // This operates on a clone because it may cause it to change. Each change also calls
  // updateStacking, which only actually needs to happen once. But who removes many modal dialogs
  // at a time?!
  var clone = this.pendingDialogStack.slice();
  clone.forEach(function (dpi) {
    if (removed.indexOf(dpi.dialog) !== -1) {
      dpi.downgradeModal();
    } else {
      dpi.maybeHideModal();
    }
  });
};
/**
 * @param {!dialogPolyfillInfo} dpi
 * @return {boolean} whether the dialog was allowed
 */


dialogPolyfill.DialogManager.prototype.pushDialog = function (dpi) {
  var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;

  if (this.pendingDialogStack.length >= allowed) {
    return false;
  }

  if (this.pendingDialogStack.unshift(dpi) === 1) {
    this.blockDocument();
  }

  this.updateStacking();
  return true;
};
/**
 * @param {!dialogPolyfillInfo} dpi
 */


dialogPolyfill.DialogManager.prototype.removeDialog = function (dpi) {
  var index = this.pendingDialogStack.indexOf(dpi);

  if (index === -1) {
    return;
  }

  this.pendingDialogStack.splice(index, 1);

  if (this.pendingDialogStack.length === 0) {
    this.unblockDocument();
  }

  this.updateStacking();
};

dialogPolyfill.dm = new dialogPolyfill.DialogManager();
dialogPolyfill.formSubmitter = null;
dialogPolyfill.useValue = null;
/**
 * Installs global handlers, such as click listers and native method overrides. These are needed
 * even if a no dialog is registered, as they deal with <form method="dialog">.
 */

if (window.HTMLDialogElement === undefined) {
  /**
   * If HTMLFormElement translates method="DIALOG" into 'get', then replace the descriptor with
   * one that returns the correct value.
   */
  var testForm = document.createElement('form');
  testForm.setAttribute('method', 'dialog');

  if (testForm.method !== 'dialog') {
    var methodDescriptor = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, 'method');

    if (methodDescriptor) {
      // nb. Some older iOS and older PhantomJS fail to return the descriptor. Don't do anything
      // and don't bother to update the element.
      var realGet = methodDescriptor.get;

      methodDescriptor.get = function () {
        if (isFormMethodDialog(this)) {
          return 'dialog';
        }

        return realGet.call(this);
      };

      var realSet = methodDescriptor.set;
      /** @this {HTMLElement} */

      methodDescriptor.set = function (v) {
        if (typeof v === 'string' && v.toLowerCase() === 'dialog') {
          return this.setAttribute('method', v);
        }

        return realSet.call(this, v);
      };

      Object.defineProperty(HTMLFormElement.prototype, 'method', methodDescriptor);
    }
  }
  /**
   * Global 'click' handler, to capture the <input type="submit"> or <button> element which has
   * submitted a <form method="dialog">. Needed as Safari and others don't report this inside
   * document.activeElement.
   */


  document.addEventListener('click', function (ev) {
    dialogPolyfill.formSubmitter = null;
    dialogPolyfill.useValue = null;

    if (ev.defaultPrevented) {
      return;
    } // e.g. a submit which prevents default submission


    var target =
    /** @type {Element} */
    ev.target;

    if ('composedPath' in ev) {
      var path = ev.composedPath();
      target = path.shift() || target;
    }

    if (!target || !isFormMethodDialog(target.form)) {
      return;
    }

    var valid = target.type === 'submit' && ['button', 'input'].indexOf(target.localName) > -1;

    if (!valid) {
      if (!(target.localName === 'input' && target.type === 'image')) {
        return;
      } // this is a <input type="image">, which can submit forms


      dialogPolyfill.useValue = ev.offsetX + ',' + ev.offsetY;
    }

    var dialog = findNearestDialog(target);

    if (!dialog) {
      return;
    }

    dialogPolyfill.formSubmitter = target;
  }, false);
  /**
   * Global 'submit' handler. This handles submits of `method="dialog"` which are invalid, i.e.,
   * outside a dialog. They get prevented.
   */

  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    var dialog = findNearestDialog(form);

    if (dialog) {
      return; // ignore, handle there
    }

    var submitter = findFormSubmitter(ev);
    var formmethod = submitter && submitter.getAttribute('formmethod') || form.getAttribute('method');

    if (formmethod === 'dialog') {
      ev.preventDefault();
    }
  });
  /**
   * Replace the native HTMLFormElement.submit() method, as it won't fire the
   * submit event and give us a chance to respond.
   */

  var nativeFormSubmit = HTMLFormElement.prototype.submit;

  var replacementFormSubmit = function () {
    if (!isFormMethodDialog(this)) {
      return nativeFormSubmit.call(this);
    }

    var dialog = findNearestDialog(this);
    dialog && dialog.close();
  };

  HTMLFormElement.prototype.submit = replacementFormSubmit;
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

const possibleOptions = ['$plugins', // '$mode', // Todo (SVG/XML)
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

const BOOL_ATTS = ['checked', 'defaultChecked', 'defaultSelected', 'disabled', 'indeterminate', 'open', // Dialog elements
'readOnly', 'selected']; // From JsonML

const ATTR_DOM = BOOL_ATTS.concat(['accessKey', // HTMLElement
'async', 'autocapitalize', // HTMLElement
'autofocus', 'contentEditable', // HTMLElement through ElementContentEditable
'defaultValue', 'defer', 'draggable', // HTMLElement
'formnovalidate', 'hidden', // HTMLElement
'innerText', // HTMLElement
'inputMode', // HTMLElement through ElementContentEditable
'ismap', 'multiple', 'novalidate', 'pattern', 'required', 'spellcheck', // HTMLElement
'translate', // HTMLElement
'value', 'willvalidate']); // Todo: Add more to this as useful for templating
//   to avoid setting through nullish value

const NULLABLES = ['autocomplete', 'dir', // HTMLElement
'integrity', // script, link
'lang', // HTMLElement
'max', 'min', 'minLength', 'maxLength', 'title' // HTMLElement
];

const $ = sel => doc.querySelector(sel);

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
* @returns {Text} The text node of the resolved reference
*/


function _createSafeReference(type, prefix, arg) {
  // For security reasons related to innerHTML, we ensure this string only
  //  contains potential entity characters
  if (!arg.match(/^\w+$/u)) {
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
                if (_getType(template[0]) === 'object') {
                  // Has attributes
                  template = jml('template', ...template, doc.body);
                } else {
                  // Array is for the children
                  template = jml('template', template, doc.body);
                }
              } else if (typeof template === 'string') {
                template = $(template);
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
              } // eslint-disable-next-line unicorn/no-fn-reference-in-iterator


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
                  // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
                  attVal.head.forEach(_appendJML(head));
                }
              }

              if (attVal.body) {
                // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
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

                if (pastInitialProp) {
                  prop = startProp + key.replace(hyphenForCamelCase, _upperCase).replace(/^([a-z])/u, _upperCase);
                } else {
                  prop = startProp + key.replace(hyphenForCamelCase, _upperCase);
                }

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
      default:
        throw new TypeError(`Unexpected type: ${type}; arg: ${arg}; index ${i} on args: ${JSON.stringify(args)}`);

      case 'null':
        // null always indicates a place-holder (only needed for last argument if want array returned)
        if (i === argc - 1) {
          _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
          // Todo: Fix to allow application of stylesheets of style tags within fragments?


          return nodes.length <= 1 ? nodes[0] // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
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
                  procValue.push(p + '=' + '"' + // https://www.w3.org/TR/xml-stylesheet/#NT-PseudoAttValue
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
                } = atts; // istanbul ignore else

                if (doc.createElementNS) {
                  elem = doc.createElementNS(NS_HTML, elStr, {
                    is
                  });
                } else {
                  elem = doc.createElement(elStr, {
                    is
                  });
                }
              } else
                /* istanbul ignore else */
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
            let replacer;

            if (typeof atts.xmlns === 'object') {
              replacer = _replaceDefiner(atts.xmlns);
            } else {
              replacer = ' xmlns="' + atts.xmlns + '"';
            } // try {
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
    namespaces = { ...namespaces
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
    elem = typeof elem === 'string' ? $(elem) : elem;
    return super.get.call(this, elem);
  }
  /**
   * @param {string|Element} elem
   * @param {any} value
   * @returns {any}
   */


  set(elem, value) {
    elem = typeof elem === 'string' ? $(elem) : elem;
    return super.set.call(this, elem, value);
  }
  /**
   * @param {string|Element} elem
   * @param {string} methodName
   * @param {...any} args
   * @returns {any}
   */


  invoke(elem, methodName, ...args) {
    elem = typeof elem === 'string' ? $(elem) : elem;
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
    elem = typeof elem === 'string' ? $(elem) : elem;
    return super.get.call(this, elem);
  }
  /**
   * @param {string|Element} elem
   * @param {any} value
   * @returns {any}
   */


  set(elem, value) {
    elem = typeof elem === 'string' ? $(elem) : elem;
    return super.set.call(this, elem, value);
  }
  /**
   * @param {string|Element} elem
   * @param {string} methodName
   * @param {...any} args
   * @returns {any}
   */


  invoke(elem, methodName, ...args) {
    elem = typeof elem === 'string' ? $(elem) : elem;
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
  elem = typeof elem === 'string' ? $(elem) : elem;
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
  elem = typeof elem === 'string' ? $(elem) : elem;
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

const $$1 = sel => document.querySelector(sel);

const $e = (el, descendentsSel) => {
  el = typeof el === 'string' ? $$1(el) : el;
  return el.querySelector(descendentsSel);
};

const defaultLocale$1 = 'en';
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
    this.localeStrings = _objectSpread2(_objectSpread2(_objectSpread2({}, localeStrings[defaultLocale$1]), localeStrings[locale]), localeObject);
  }

  makeDialog({
    atts = {},
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

    const dialog = jml('dialog', atts, children, $('#main'));
    dialogPolyfill.registerDialog(dialog);
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
        args = _objectWithoutProperties(_ref, ["submit", "submitClass"]);

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
        args = _objectWithoutProperties(_ref2, ["submit", "cancel", "cancelClass", "submitClass"]);

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
      const dialog = jml('dialog', [msg, ...(includeOk ? [['br'], ['br'], ['div', {
        class: submitClass
      }, [['button', {
        $on: {
          click() {
            dialog.close();
            resolve();
          }

        }
      }, [this.localeStrings.ok]]]]] : [])], $('#main'));
      dialogPolyfill.registerDialog(dialog);
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
          submitArgs = _objectWithoutProperties(message, ["message", "submit"]);

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


      this.makeSubmitDialog(_objectSpread2(_objectSpread2({}, submitArgs), {}, {
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
      const dialog = jml('dialog', [msg, ['br'], ['br'], ['div', {
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
      }, [this.localeStrings.cancel]]]]], $('#main'));
      dialogPolyfill.registerDialog(dialog);
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

  localeFromLangData(lan) {
    return this.langData['localization-strings'][lan];
  }

  getLanguageFromCode(code) {
    return this.localeFromLangData(code).languages[code];
  }

  getFieldNameFromPluginNameAndLocales({
    pluginName,
    locales,
    lf,
    targetLanguage,
    applicableFieldI18N,
    meta,
    metaApplicableField
  }) {
    return lf(['plugins', pluginName, 'fieldname'], _objectSpread2(_objectSpread2(_objectSpread2({}, meta), metaApplicableField), {}, {
      applicableField: applicableFieldI18N,
      targetLanguage: targetLanguage ? this.getLanguageFromCode(targetLanguage) : ''
    }));
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

    const languageParam = $p.get('lang', true); // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice

    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length ? navLangs : [localePass(navigator.language) || 'en-US']; // We need a default to display a default title

    const language = languageParam || fallbackLanguages[0];
    const preferredLangs = language.split('.');
    const lang = preferredLangs.concat(fallbackLanguages);
    return {
      lang,
      langs,
      languageParam,
      fallbackLanguages
    };
  }

}

var JsonRefs = function (t) {
  var e = {};

  function n(r) {
    if (e[r]) return e[r].exports;
    var o = e[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
  }

  return n.m = t, n.c = e, n.d = function (t, e, r) {
    n.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: r
    });
  }, n.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, n.t = function (t, e) {
    if (1 & e && (t = n(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var r = Object.create(null);
    if (n.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: t
    }), 2 & e && "string" != typeof t) for (var o in t) n.d(r, o, function (e) {
      return t[e];
    }.bind(null, o));
    return r;
  }, n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return n.d(e, "a", e), e;
  }, n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, n.p = "", n(n.s = 20);
}([function (t, e, n) {

  var r;

  try {
    r = n(7);
  } catch (t) {}

  r || (r = window._), t.exports = r;
}, function (t, e, n) {

  var r,
      o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  };

  r = function () {
    return this;
  }();

  try {
    r = r || new Function("return this")();
  } catch (t) {
    "object" === ("undefined" == typeof window ? "undefined" : o(window)) && (r = window);
  }

  t.exports = r;
}, function (t, e, n) {

  var r,
      o,
      i = t.exports = {};

  function u() {
    throw new Error("setTimeout has not been defined");
  }

  function s() {
    throw new Error("clearTimeout has not been defined");
  }

  function a(t) {
    if (r === setTimeout) return setTimeout(t, 0);
    if ((r === u || !r) && setTimeout) return r = setTimeout, setTimeout(t, 0);

    try {
      return r(t, 0);
    } catch (e) {
      try {
        return r.call(null, t, 0);
      } catch (e) {
        return r.call(this, t, 0);
      }
    }
  }

  !function () {
    try {
      r = "function" == typeof setTimeout ? setTimeout : u;
    } catch (t) {
      r = u;
    }

    try {
      o = "function" == typeof clearTimeout ? clearTimeout : s;
    } catch (t) {
      o = s;
    }
  }();
  var c,
      f = [],
      l = !1,
      p = -1;

  function h() {
    l && c && (l = !1, c.length ? f = c.concat(f) : p = -1, f.length && d());
  }

  function d() {
    if (!l) {
      var t = a(h);
      l = !0;

      for (var e = f.length; e;) {
        for (c = f, f = []; ++p < e;) c && c[p].run();

        p = -1, e = f.length;
      }

      c = null, l = !1, function (t) {
        if (o === clearTimeout) return clearTimeout(t);
        if ((o === s || !o) && clearTimeout) return o = clearTimeout, clearTimeout(t);

        try {
          o(t);
        } catch (e) {
          try {
            return o.call(null, t);
          } catch (e) {
            return o.call(this, t);
          }
        }
      }(t);
    }
  }

  function v(t, e) {
    this.fun = t, this.array = e;
  }

  function y() {}

  i.nextTick = function (t) {
    var e = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
    f.push(new v(t, e)), 1 !== f.length || l || a(d);
  }, v.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = y, i.addListener = y, i.once = y, i.off = y, i.removeListener = y, i.removeAllListeners = y, i.emit = y, i.prependListener = y, i.prependOnceListener = y, i.listeners = function (t) {
    return [];
  }, i.binding = function (t) {
    throw new Error("process.binding is not supported");
  }, i.cwd = function () {
    return "/";
  }, i.chdir = function (t) {
    throw new Error("process.chdir is not supported");
  }, i.umask = function () {
    return 0;
  };
}, function (t, e) {
  (function (e) {
    t.exports = e;
  }).call(this, {});
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.SCHEMES = void 0, e.pctEncChar = c, e.pctDecChars = f, e.parse = d, e.removeDotSegments = m, e.serialize = b, e.resolveComponents = w, e.resolve = function (t, e, n) {
    return b(w(d(t, n), d(e, n), n, !0), n);
  }, e.normalize = function (t, e) {
    "string" == typeof t ? t = b(d(t, e), e) : "object" === (0, u.typeOf)(t) && (t = d(b(t, e), e));
    return t;
  }, e.equal = function (t, e, n) {
    "string" == typeof t ? t = b(d(t, n), n) : "object" === (0, u.typeOf)(t) && (t = b(t, n));
    "string" == typeof e ? e = b(d(e, n), n) : "object" === (0, u.typeOf)(e) && (e = b(e, n));
    return t === e;
  }, e.escapeComponent = function (t, e) {
    return t && t.toString().replace(e && e.iri ? o.default.ESCAPE : r.default.ESCAPE, c);
  }, e.unescapeComponent = function (t, e) {
    return t && t.toString().replace(e && e.iri ? o.default.PCT_ENCODED : r.default.PCT_ENCODED, f);
  };
  var r = s(n(17)),
      o = s(n(50)),
      i = s(n(18)),
      u = n(6);

  function s(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  var a = e.SCHEMES = {};

  function c(t) {
    var e = t.charCodeAt(0);
    return e < 16 ? "%0" + e.toString(16).toUpperCase() : e < 128 ? "%" + e.toString(16).toUpperCase() : e < 2048 ? "%" + (e >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase() : "%" + (e >> 12 | 224).toString(16).toUpperCase() + "%" + (e >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase();
  }

  function f(t) {
    for (var e = "", n = 0, r = t.length; n < r;) {
      var o = parseInt(t.substr(n + 1, 2), 16);
      if (o < 128) e += String.fromCharCode(o), n += 3;else if (o >= 194 && o < 224) {
        if (r - n >= 6) {
          var i = parseInt(t.substr(n + 4, 2), 16);
          e += String.fromCharCode((31 & o) << 6 | 63 & i);
        } else e += t.substr(n, 6);

        n += 6;
      } else if (o >= 224) {
        if (r - n >= 9) {
          var u = parseInt(t.substr(n + 4, 2), 16),
              s = parseInt(t.substr(n + 7, 2), 16);
          e += String.fromCharCode((15 & o) << 12 | (63 & u) << 6 | 63 & s);
        } else e += t.substr(n, 9);

        n += 9;
      } else e += t.substr(n, 3), n += 3;
    }

    return e;
  }

  function l(t, e) {
    function n(t) {
      var n = f(t);
      return n.match(e.UNRESERVED) ? n : t;
    }

    return t.scheme && (t.scheme = String(t.scheme).replace(e.PCT_ENCODED, n).toLowerCase().replace(e.NOT_SCHEME, "")), void 0 !== t.userinfo && (t.userinfo = String(t.userinfo).replace(e.PCT_ENCODED, n).replace(e.NOT_USERINFO, c).replace(e.PCT_ENCODED, u.toUpperCase)), void 0 !== t.host && (t.host = String(t.host).replace(e.PCT_ENCODED, n).toLowerCase().replace(e.NOT_HOST, c).replace(e.PCT_ENCODED, u.toUpperCase)), void 0 !== t.path && (t.path = String(t.path).replace(e.PCT_ENCODED, n).replace(t.scheme ? e.NOT_PATH : e.NOT_PATH_NOSCHEME, c).replace(e.PCT_ENCODED, u.toUpperCase)), void 0 !== t.query && (t.query = String(t.query).replace(e.PCT_ENCODED, n).replace(e.NOT_QUERY, c).replace(e.PCT_ENCODED, u.toUpperCase)), void 0 !== t.fragment && (t.fragment = String(t.fragment).replace(e.PCT_ENCODED, n).replace(e.NOT_FRAGMENT, c).replace(e.PCT_ENCODED, u.toUpperCase)), t;
  }

  var p = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[\dA-F:.]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,
      h = void 0 === "".match(/(){0}/)[1];

  function d(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = {},
        u = !1 !== e.iri ? o.default : r.default;
    "suffix" === e.reference && (t = (e.scheme ? e.scheme + ":" : "") + "//" + t);
    var s = t.match(p);

    if (s) {
      h ? (n.scheme = s[1], n.userinfo = s[3], n.host = s[4], n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = s[7], n.fragment = s[8], isNaN(n.port) && (n.port = s[5])) : (n.scheme = s[1] || void 0, n.userinfo = -1 !== t.indexOf("@") ? s[3] : void 0, n.host = -1 !== t.indexOf("//") ? s[4] : void 0, n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = -1 !== t.indexOf("?") ? s[7] : void 0, n.fragment = -1 !== t.indexOf("#") ? s[8] : void 0, isNaN(n.port) && (n.port = t.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? s[4] : void 0)), n.host && (n.host = n.host.replace(u.IPV6ADDRESS, "$1")), void 0 !== n.scheme || void 0 !== n.userinfo || void 0 !== n.host || void 0 !== n.port || n.path || void 0 !== n.query ? void 0 === n.scheme ? n.reference = "relative" : void 0 === n.fragment ? n.reference = "absolute" : n.reference = "uri" : n.reference = "same-document", e.reference && "suffix" !== e.reference && e.reference !== n.reference && (n.error = n.error || "URI is not a " + e.reference + " reference.");
      var c = a[(e.scheme || n.scheme || "").toLowerCase()];
      if (e.unicodeSupport || c && c.unicodeSupport) l(n, u);else {
        if (n.host && (e.domainHost || c && c.domainHost)) try {
          n.host = i.default.toASCII(n.host.replace(u.PCT_ENCODED, f).toLowerCase());
        } catch (t) {
          n.error = n.error || "Host's domain name can not be converted to ASCII via punycode: " + t;
        }
        l(n, r.default);
      }
      c && c.parse && c.parse(n, e);
    } else n.error = n.error || "URI can not be parsed.";

    return n;
  }

  var v = /^\.\.?\//,
      y = /^\/\.(\/|$)/,
      _ = /^\/\.\.(\/|$)/,
      g = /^\/?(?:.|\n)*?(?=\/|$)/;

  function m(t) {
    for (var e = []; t.length;) if (t.match(v)) t = t.replace(v, "");else if (t.match(y)) t = t.replace(y, "/");else if (t.match(_)) t = t.replace(_, "/"), e.pop();else if ("." === t || ".." === t) t = "";else {
      var n = t.match(g);
      if (!n) throw new Error("Unexpected dot segment condition");
      var r = n[0];
      t = t.slice(r.length), e.push(r);
    }

    return e.join("");
  }

  function b(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = e.iri ? o.default : r.default,
        u = [],
        s = a[(e.scheme || t.scheme || "").toLowerCase()];
    if (s && s.serialize && s.serialize(t, e), t.host) if (n.IPV6ADDRESS.test(t.host)) ;else if (e.domainHost || s && s.domainHost) try {
      t.host = e.iri ? i.default.toUnicode(t.host) : i.default.toASCII(t.host.replace(n.PCT_ENCODED, f).toLowerCase());
    } catch (n) {
      t.error = t.error || "Host's domain name can not be converted to " + (e.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
    }
    l(t, n), "suffix" !== e.reference && t.scheme && (u.push(t.scheme), u.push(":"));

    var c = function (t, e) {
      var n = !1 !== e.iri ? o.default : r.default,
          i = [];
      return void 0 !== t.userinfo && (i.push(t.userinfo), i.push("@")), void 0 !== t.host && i.push(String(t.host).replace(n.IPV6ADDRESS, "[$1]")), "number" == typeof t.port && (i.push(":"), i.push(t.port.toString(10))), i.length ? i.join("") : void 0;
    }(t, e);

    if (void 0 !== c && ("suffix" !== e.reference && u.push("//"), u.push(c), t.path && "/" !== t.path.charAt(0) && u.push("/")), void 0 !== t.path) {
      var p = t.path;
      e.absolutePath || s && s.absolutePath || (p = m(p)), void 0 === c && (p = p.replace(/^\/\//, "/%2F")), u.push(p);
    }

    return void 0 !== t.query && (u.push("?"), u.push(t.query)), void 0 !== t.fragment && (u.push("#"), u.push(t.fragment)), u.join("");
  }

  function w(t, e) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = {};
    return arguments[3] || (t = d(b(t, n), n), e = d(b(e, n), n)), !(n = n || {}).tolerant && e.scheme ? (r.scheme = e.scheme, r.userinfo = e.userinfo, r.host = e.host, r.port = e.port, r.path = m(e.path || ""), r.query = e.query) : (void 0 !== e.userinfo || void 0 !== e.host || void 0 !== e.port ? (r.userinfo = e.userinfo, r.host = e.host, r.port = e.port, r.path = m(e.path || ""), r.query = e.query) : (e.path ? ("/" === e.path.charAt(0) ? r.path = m(e.path) : (void 0 === t.userinfo && void 0 === t.host && void 0 === t.port || t.path ? t.path ? r.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : r.path = e.path : r.path = "/" + e.path, r.path = m(r.path)), r.query = e.query) : (r.path = t.path, void 0 !== e.query ? r.query = e.query : r.query = t.query), r.userinfo = t.userinfo, r.host = t.host, r.port = t.port), r.scheme = t.scheme), r.fragment = e.fragment, r;
  }
}, function (t, e, n) {

  var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  },
      o = n(0);
  t.exports = a;
  var i = "\0",
      u = "\0",
      s = "";

  function a(t) {
    this._isDirected = !o.has(t, "directed") || t.directed, this._isMultigraph = !!o.has(t, "multigraph") && t.multigraph, this._isCompound = !!o.has(t, "compound") && t.compound, this._label = void 0, this._defaultNodeLabelFn = o.constant(void 0), this._defaultEdgeLabelFn = o.constant(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children[u] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
  }

  function c(t, e) {
    t[e] ? t[e]++ : t[e] = 1;
  }

  function f(t, e) {
    --t[e] || delete t[e];
  }

  function l(t, e, n, r) {
    var u = "" + e,
        a = "" + n;

    if (!t && u > a) {
      var c = u;
      u = a, a = c;
    }

    return u + s + a + s + (o.isUndefined(r) ? i : r);
  }

  function p(t, e) {
    return l(t, e.v, e.w, e.name);
  }

  a.prototype._nodeCount = 0, a.prototype._edgeCount = 0, a.prototype.isDirected = function () {
    return this._isDirected;
  }, a.prototype.isMultigraph = function () {
    return this._isMultigraph;
  }, a.prototype.isCompound = function () {
    return this._isCompound;
  }, a.prototype.setGraph = function (t) {
    return this._label = t, this;
  }, a.prototype.graph = function () {
    return this._label;
  }, a.prototype.setDefaultNodeLabel = function (t) {
    return o.isFunction(t) || (t = o.constant(t)), this._defaultNodeLabelFn = t, this;
  }, a.prototype.nodeCount = function () {
    return this._nodeCount;
  }, a.prototype.nodes = function () {
    return o.keys(this._nodes);
  }, a.prototype.sources = function () {
    var t = this;
    return o.filter(this.nodes(), function (e) {
      return o.isEmpty(t._in[e]);
    });
  }, a.prototype.sinks = function () {
    var t = this;
    return o.filter(this.nodes(), function (e) {
      return o.isEmpty(t._out[e]);
    });
  }, a.prototype.setNodes = function (t, e) {
    var n = arguments,
        r = this;
    return o.each(t, function (t) {
      n.length > 1 ? r.setNode(t, e) : r.setNode(t);
    }), this;
  }, a.prototype.setNode = function (t, e) {
    return o.has(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = e), this) : (this._nodes[t] = arguments.length > 1 ? e : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = u, this._children[t] = {}, this._children[u][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }, a.prototype.node = function (t) {
    return this._nodes[t];
  }, a.prototype.hasNode = function (t) {
    return o.has(this._nodes, t);
  }, a.prototype.removeNode = function (t) {
    var e = this;

    if (o.has(this._nodes, t)) {
      var n = function (t) {
        e.removeEdge(e._edgeObjs[t]);
      };

      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], o.each(this.children(t), function (t) {
        e.setParent(t);
      }), delete this._children[t]), o.each(o.keys(this._in[t]), n), delete this._in[t], delete this._preds[t], o.each(o.keys(this._out[t]), n), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }

    return this;
  }, a.prototype.setParent = function (t, e) {
    if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
    if (o.isUndefined(e)) e = u;else {
      for (var n = e += ""; !o.isUndefined(n); n = this.parent(n)) if (n === t) throw new Error("Setting " + e + " as parent of " + t + " would create a cycle");

      this.setNode(e);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = e, this._children[e][t] = !0, this;
  }, a.prototype._removeFromParentsChildList = function (t) {
    delete this._children[this._parent[t]][t];
  }, a.prototype.parent = function (t) {
    if (this._isCompound) {
      var e = this._parent[t];
      if (e !== u) return e;
    }
  }, a.prototype.children = function (t) {
    if (o.isUndefined(t) && (t = u), this._isCompound) {
      var e = this._children[t];
      if (e) return o.keys(e);
    } else {
      if (t === u) return this.nodes();
      if (this.hasNode(t)) return [];
    }
  }, a.prototype.predecessors = function (t) {
    var e = this._preds[t];
    if (e) return o.keys(e);
  }, a.prototype.successors = function (t) {
    var e = this._sucs[t];
    if (e) return o.keys(e);
  }, a.prototype.neighbors = function (t) {
    var e = this.predecessors(t);
    if (e) return o.union(e, this.successors(t));
  }, a.prototype.isLeaf = function (t) {
    return 0 === (this.isDirected() ? this.successors(t) : this.neighbors(t)).length;
  }, a.prototype.filterNodes = function (t) {
    var e = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    e.setGraph(this.graph());
    var n = this;
    o.each(this._nodes, function (n, r) {
      t(r) && e.setNode(r, n);
    }), o.each(this._edgeObjs, function (t) {
      e.hasNode(t.v) && e.hasNode(t.w) && e.setEdge(t, n.edge(t));
    });
    var r = {};
    return this._isCompound && o.each(e.nodes(), function (t) {
      e.setParent(t, function t(o) {
        var i = n.parent(o);
        return void 0 === i || e.hasNode(i) ? (r[o] = i, i) : i in r ? r[i] : t(i);
      }(t));
    }), e;
  }, a.prototype.setDefaultEdgeLabel = function (t) {
    return o.isFunction(t) || (t = o.constant(t)), this._defaultEdgeLabelFn = t, this;
  }, a.prototype.edgeCount = function () {
    return this._edgeCount;
  }, a.prototype.edges = function () {
    return o.values(this._edgeObjs);
  }, a.prototype.setPath = function (t, e) {
    var n = this,
        r = arguments;
    return o.reduce(t, function (t, o) {
      return r.length > 1 ? n.setEdge(t, o, e) : n.setEdge(t, o), o;
    }), this;
  }, a.prototype.setEdge = function () {
    var t,
        e,
        n,
        i,
        u = !1,
        s = arguments[0];
    "object" === (void 0 === s ? "undefined" : r(s)) && null !== s && "v" in s ? (t = s.v, e = s.w, n = s.name, 2 === arguments.length && (i = arguments[1], u = !0)) : (t = s, e = arguments[1], n = arguments[3], arguments.length > 2 && (i = arguments[2], u = !0)), t = "" + t, e = "" + e, o.isUndefined(n) || (n = "" + n);
    var a = l(this._isDirected, t, e, n);
    if (o.has(this._edgeLabels, a)) return u && (this._edgeLabels[a] = i), this;
    if (!o.isUndefined(n) && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(e), this._edgeLabels[a] = u ? i : this._defaultEdgeLabelFn(t, e, n);

    var f = function (t, e, n, r) {
      var o = "" + e,
          i = "" + n;

      if (!t && o > i) {
        var u = o;
        o = i, i = u;
      }

      var s = {
        v: o,
        w: i
      };
      r && (s.name = r);
      return s;
    }(this._isDirected, t, e, n);

    return t = f.v, e = f.w, Object.freeze(f), this._edgeObjs[a] = f, c(this._preds[e], t), c(this._sucs[t], e), this._in[e][a] = f, this._out[t][a] = f, this._edgeCount++, this;
  }, a.prototype.edge = function (t, e, n) {
    var r = 1 === arguments.length ? p(this._isDirected, arguments[0]) : l(this._isDirected, t, e, n);
    return this._edgeLabels[r];
  }, a.prototype.hasEdge = function (t, e, n) {
    var r = 1 === arguments.length ? p(this._isDirected, arguments[0]) : l(this._isDirected, t, e, n);
    return o.has(this._edgeLabels, r);
  }, a.prototype.removeEdge = function (t, e, n) {
    var r = 1 === arguments.length ? p(this._isDirected, arguments[0]) : l(this._isDirected, t, e, n),
        o = this._edgeObjs[r];
    return o && (t = o.v, e = o.w, delete this._edgeLabels[r], delete this._edgeObjs[r], f(this._preds[e], t), f(this._sucs[t], e), delete this._in[e][r], delete this._out[t][r], this._edgeCount--), this;
  }, a.prototype.inEdges = function (t, e) {
    var n = this._in[t];

    if (n) {
      var r = o.values(n);
      return e ? o.filter(r, function (t) {
        return t.v === e;
      }) : r;
    }
  }, a.prototype.outEdges = function (t, e) {
    var n = this._out[t];

    if (n) {
      var r = o.values(n);
      return e ? o.filter(r, function (t) {
        return t.w === e;
      }) : r;
    }
  }, a.prototype.nodeEdges = function (t, e) {
    var n = this.inEdges(t, e);
    if (n) return n.concat(this.outEdges(t, e));
  };
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.merge = function () {
    for (var t = arguments.length, e = Array(t), n = 0; n < t; n++) e[n] = arguments[n];

    if (e.length > 1) {
      e[0] = e[0].slice(0, -1);

      for (var r = e.length - 1, o = 1; o < r; ++o) e[o] = e[o].slice(1, -1);

      return e[r] = e[r].slice(1), e.join("");
    }

    return e[0];
  }, e.subexp = function (t) {
    return "(?:" + t + ")";
  }, e.typeOf = function (t) {
    return void 0 === t ? "undefined" : null === t ? "null" : Object.prototype.toString.call(t).split(" ").pop().split("]").shift().toLowerCase();
  }, e.toUpperCase = function (t) {
    return t.toUpperCase();
  }, e.toArray = function (t) {
    return null != t ? t instanceof Array ? t : "number" != typeof t.length || t.split || t.setInterval || t.call ? [t] : Array.prototype.slice.call(t) : [];
  };
}, function (t, e, n) {

  (function (t, r) {
    var o,
        i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    };
    (function () {
      var u,
          s = 200,
          a = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",
          c = "Expected a function",
          f = "__lodash_hash_undefined__",
          l = 500,
          p = "__lodash_placeholder__",
          h = 1,
          d = 2,
          v = 4,
          y = 1,
          _ = 2,
          g = 1,
          m = 2,
          b = 4,
          w = 8,
          x = 16,
          E = 32,
          O = 64,
          C = 128,
          S = 256,
          T = 512,
          j = 30,
          A = "...",
          I = 800,
          P = 16,
          R = 1,
          k = 2,
          D = 1 / 0,
          U = 9007199254740991,
          N = 1.7976931348623157e308,
          F = NaN,
          L = 4294967295,
          q = L - 1,
          z = L >>> 1,
          M = [["ary", C], ["bind", g], ["bindKey", m], ["curry", w], ["curryRight", x], ["flip", T], ["partial", E], ["partialRight", O], ["rearg", S]],
          H = "[object Arguments]",
          $ = "[object Array]",
          B = "[object AsyncFunction]",
          W = "[object Boolean]",
          Z = "[object Date]",
          G = "[object DOMException]",
          V = "[object Error]",
          J = "[object Function]",
          X = "[object GeneratorFunction]",
          K = "[object Map]",
          Y = "[object Number]",
          Q = "[object Null]",
          tt = "[object Object]",
          et = "[object Proxy]",
          nt = "[object RegExp]",
          rt = "[object Set]",
          ot = "[object String]",
          it = "[object Symbol]",
          ut = "[object Undefined]",
          st = "[object WeakMap]",
          at = "[object WeakSet]",
          ct = "[object ArrayBuffer]",
          ft = "[object DataView]",
          lt = "[object Float32Array]",
          pt = "[object Float64Array]",
          ht = "[object Int8Array]",
          dt = "[object Int16Array]",
          vt = "[object Int32Array]",
          yt = "[object Uint8Array]",
          _t = "[object Uint8ClampedArray]",
          gt = "[object Uint16Array]",
          mt = "[object Uint32Array]",
          bt = /\b__p \+= '';/g,
          wt = /\b(__p \+=) '' \+/g,
          xt = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
          Et = /&(?:amp|lt|gt|quot|#39);/g,
          Ot = /[&<>"']/g,
          Ct = RegExp(Et.source),
          St = RegExp(Ot.source),
          Tt = /<%-([\s\S]+?)%>/g,
          jt = /<%([\s\S]+?)%>/g,
          At = /<%=([\s\S]+?)%>/g,
          It = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          Pt = /^\w*$/,
          Rt = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          kt = /[\\^$.*+?()[\]{}|]/g,
          Dt = RegExp(kt.source),
          Ut = /^\s+|\s+$/g,
          Nt = /^\s+/,
          Ft = /\s+$/,
          Lt = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
          qt = /\{\n\/\* \[wrapped with (.+)\] \*/,
          zt = /,? & /,
          Mt = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
          Ht = /\\(\\)?/g,
          $t = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
          Bt = /\w*$/,
          Wt = /^[-+]0x[0-9a-f]+$/i,
          Zt = /^0b[01]+$/i,
          Gt = /^\[object .+?Constructor\]$/,
          Vt = /^0o[0-7]+$/i,
          Jt = /^(?:0|[1-9]\d*)$/,
          Xt = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
          Kt = /($^)/,
          Yt = /['\n\r\u2028\u2029\\]/g,
          Qt = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
          te = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
          ee = "[\\ud800-\\udfff]",
          ne = "[" + te + "]",
          re = "[" + Qt + "]",
          oe = "\\d+",
          ie = "[\\u2700-\\u27bf]",
          ue = "[a-z\\xdf-\\xf6\\xf8-\\xff]",
          se = "[^\\ud800-\\udfff" + te + oe + "\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",
          ae = "\\ud83c[\\udffb-\\udfff]",
          ce = "[^\\ud800-\\udfff]",
          fe = "(?:\\ud83c[\\udde6-\\uddff]){2}",
          le = "[\\ud800-\\udbff][\\udc00-\\udfff]",
          pe = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
          he = "(?:" + ue + "|" + se + ")",
          de = "(?:" + pe + "|" + se + ")",
          ve = "(?:" + re + "|" + ae + ")" + "?",
          ye = "[\\ufe0e\\ufe0f]?" + ve + ("(?:\\u200d(?:" + [ce, fe, le].join("|") + ")[\\ufe0e\\ufe0f]?" + ve + ")*"),
          _e = "(?:" + [ie, fe, le].join("|") + ")" + ye,
          ge = "(?:" + [ce + re + "?", re, fe, le, ee].join("|") + ")",
          me = RegExp("['’]", "g"),
          be = RegExp(re, "g"),
          we = RegExp(ae + "(?=" + ae + ")|" + ge + ye, "g"),
          xe = RegExp([pe + "?" + ue + "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" + [ne, pe, "$"].join("|") + ")", de + "+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" + [ne, pe + he, "$"].join("|") + ")", pe + "?" + he + "+(?:['’](?:d|ll|m|re|s|t|ve))?", pe + "+(?:['’](?:D|LL|M|RE|S|T|VE))?", "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", oe, _e].join("|"), "g"),
          Ee = RegExp("[\\u200d\\ud800-\\udfff" + Qt + "\\ufe0e\\ufe0f]"),
          Oe = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
          Ce = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
          Se = -1,
          Te = {};

      Te[lt] = Te[pt] = Te[ht] = Te[dt] = Te[vt] = Te[yt] = Te[_t] = Te[gt] = Te[mt] = !0, Te[H] = Te[$] = Te[ct] = Te[W] = Te[ft] = Te[Z] = Te[V] = Te[J] = Te[K] = Te[Y] = Te[tt] = Te[nt] = Te[rt] = Te[ot] = Te[st] = !1;
      var je = {};
      je[H] = je[$] = je[ct] = je[ft] = je[W] = je[Z] = je[lt] = je[pt] = je[ht] = je[dt] = je[vt] = je[K] = je[Y] = je[tt] = je[nt] = je[rt] = je[ot] = je[it] = je[yt] = je[_t] = je[gt] = je[mt] = !0, je[V] = je[J] = je[st] = !1;

      var Ae = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      },
          Ie = parseFloat,
          Pe = parseInt,
          Re = "object" == (void 0 === t ? "undefined" : i(t)) && t && t.Object === Object && t,
          ke = "object" == ("undefined" == typeof self ? "undefined" : i(self)) && self && self.Object === Object && self,
          De = Re || ke || Function("return this")(),
          Ue = "object" == i(e) && e && !e.nodeType && e,
          Ne = Ue && "object" == i(r) && r && !r.nodeType && r,
          Fe = Ne && Ne.exports === Ue,
          Le = Fe && Re.process,
          qe = function () {
        try {
          var t = Ne && Ne.require && Ne.require("util").types;

          return t || Le && Le.binding && Le.binding("util");
        } catch (t) {}
      }(),
          ze = qe && qe.isArrayBuffer,
          Me = qe && qe.isDate,
          He = qe && qe.isMap,
          $e = qe && qe.isRegExp,
          Be = qe && qe.isSet,
          We = qe && qe.isTypedArray;

      function Ze(t, e, n) {
        switch (n.length) {
          case 0:
            return t.call(e);

          case 1:
            return t.call(e, n[0]);

          case 2:
            return t.call(e, n[0], n[1]);

          case 3:
            return t.call(e, n[0], n[1], n[2]);
        }

        return t.apply(e, n);
      }

      function Ge(t, e, n, r) {
        for (var o = -1, i = null == t ? 0 : t.length; ++o < i;) {
          var u = t[o];
          e(r, u, n(u), t);
        }

        return r;
      }

      function Ve(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t););

        return t;
      }

      function Je(t, e) {
        for (var n = null == t ? 0 : t.length; n-- && !1 !== e(t[n], n, t););

        return t;
      }

      function Xe(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) if (!e(t[n], n, t)) return !1;

        return !0;
      }

      function Ke(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, o = 0, i = []; ++n < r;) {
          var u = t[n];
          e(u, n, t) && (i[o++] = u);
        }

        return i;
      }

      function Ye(t, e) {
        return !!(null == t ? 0 : t.length) && cn(t, e, 0) > -1;
      }

      function Qe(t, e, n) {
        for (var r = -1, o = null == t ? 0 : t.length; ++r < o;) if (n(e, t[r])) return !0;

        return !1;
      }

      function tn(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length, o = Array(r); ++n < r;) o[n] = e(t[n], n, t);

        return o;
      }

      function en(t, e) {
        for (var n = -1, r = e.length, o = t.length; ++n < r;) t[o + n] = e[n];

        return t;
      }

      function nn(t, e, n, r) {
        var o = -1,
            i = null == t ? 0 : t.length;

        for (r && i && (n = t[++o]); ++o < i;) n = e(n, t[o], o, t);

        return n;
      }

      function rn(t, e, n, r) {
        var o = null == t ? 0 : t.length;

        for (r && o && (n = t[--o]); o--;) n = e(n, t[o], o, t);

        return n;
      }

      function on(t, e) {
        for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) if (e(t[n], n, t)) return !0;

        return !1;
      }

      var un = hn("length");

      function sn(t, e, n) {
        var r;
        return n(t, function (t, n, o) {
          if (e(t, n, o)) return r = n, !1;
        }), r;
      }

      function an(t, e, n, r) {
        for (var o = t.length, i = n + (r ? 1 : -1); r ? i-- : ++i < o;) if (e(t[i], i, t)) return i;

        return -1;
      }

      function cn(t, e, n) {
        return e == e ? function (t, e, n) {
          var r = n - 1,
              o = t.length;

          for (; ++r < o;) if (t[r] === e) return r;

          return -1;
        }(t, e, n) : an(t, ln, n);
      }

      function fn(t, e, n, r) {
        for (var o = n - 1, i = t.length; ++o < i;) if (r(t[o], e)) return o;

        return -1;
      }

      function ln(t) {
        return t != t;
      }

      function pn(t, e) {
        var n = null == t ? 0 : t.length;
        return n ? yn(t, e) / n : F;
      }

      function hn(t) {
        return function (e) {
          return null == e ? u : e[t];
        };
      }

      function dn(t) {
        return function (e) {
          return null == t ? u : t[e];
        };
      }

      function vn(t, e, n, r, o) {
        return o(t, function (t, o, i) {
          n = r ? (r = !1, t) : e(n, t, o, i);
        }), n;
      }

      function yn(t, e) {
        for (var n, r = -1, o = t.length; ++r < o;) {
          var i = e(t[r]);
          i !== u && (n = n === u ? i : n + i);
        }

        return n;
      }

      function _n(t, e) {
        for (var n = -1, r = Array(t); ++n < t;) r[n] = e(n);

        return r;
      }

      function gn(t) {
        return function (e) {
          return t(e);
        };
      }

      function mn(t, e) {
        return tn(e, function (e) {
          return t[e];
        });
      }

      function bn(t, e) {
        return t.has(e);
      }

      function wn(t, e) {
        for (var n = -1, r = t.length; ++n < r && cn(e, t[n], 0) > -1;);

        return n;
      }

      function xn(t, e) {
        for (var n = t.length; n-- && cn(e, t[n], 0) > -1;);

        return n;
      }

      var En = dn({
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
          On = dn({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      });

      function Cn(t) {
        return "\\" + Ae[t];
      }

      function Sn(t) {
        return Ee.test(t);
      }

      function Tn(t) {
        var e = -1,
            n = Array(t.size);
        return t.forEach(function (t, r) {
          n[++e] = [r, t];
        }), n;
      }

      function jn(t, e) {
        return function (n) {
          return t(e(n));
        };
      }

      function An(t, e) {
        for (var n = -1, r = t.length, o = 0, i = []; ++n < r;) {
          var u = t[n];
          u !== e && u !== p || (t[n] = p, i[o++] = n);
        }

        return i;
      }

      function In(t) {
        var e = -1,
            n = Array(t.size);
        return t.forEach(function (t) {
          n[++e] = t;
        }), n;
      }

      function Pn(t) {
        var e = -1,
            n = Array(t.size);
        return t.forEach(function (t) {
          n[++e] = [t, t];
        }), n;
      }

      function Rn(t) {
        return Sn(t) ? function (t) {
          var e = we.lastIndex = 0;

          for (; we.test(t);) ++e;

          return e;
        }(t) : un(t);
      }

      function kn(t) {
        return Sn(t) ? function (t) {
          return t.match(we) || [];
        }(t) : function (t) {
          return t.split("");
        }(t);
      }

      var Dn = dn({
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      });

      var Un = function t(e) {
        var n,
            r = (e = null == e ? De : Un.defaults(De.Object(), e, Un.pick(De, Ce))).Array,
            o = e.Date,
            Qt = e.Error,
            te = e.Function,
            ee = e.Math,
            ne = e.Object,
            re = e.RegExp,
            oe = e.String,
            ie = e.TypeError,
            ue = r.prototype,
            se = te.prototype,
            ae = ne.prototype,
            ce = e["__core-js_shared__"],
            fe = se.toString,
            le = ae.hasOwnProperty,
            pe = 0,
            he = (n = /[^.]+$/.exec(ce && ce.keys && ce.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "",
            de = ae.toString,
            ve = fe.call(ne),
            ye = De._,
            _e = re("^" + fe.call(le).replace(kt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
            ge = Fe ? e.Buffer : u,
            we = e.Symbol,
            Ee = e.Uint8Array,
            Ae = ge ? ge.allocUnsafe : u,
            Re = jn(ne.getPrototypeOf, ne),
            ke = ne.create,
            Ue = ae.propertyIsEnumerable,
            Ne = ue.splice,
            Le = we ? we.isConcatSpreadable : u,
            qe = we ? we.iterator : u,
            un = we ? we.toStringTag : u,
            dn = function () {
          try {
            var t = zi(ne, "defineProperty");
            return t({}, "", {}), t;
          } catch (t) {}
        }(),
            Nn = e.clearTimeout !== De.clearTimeout && e.clearTimeout,
            Fn = o && o.now !== De.Date.now && o.now,
            Ln = e.setTimeout !== De.setTimeout && e.setTimeout,
            qn = ee.ceil,
            zn = ee.floor,
            Mn = ne.getOwnPropertySymbols,
            Hn = ge ? ge.isBuffer : u,
            $n = e.isFinite,
            Bn = ue.join,
            Wn = jn(ne.keys, ne),
            Zn = ee.max,
            Gn = ee.min,
            Vn = o.now,
            Jn = e.parseInt,
            Xn = ee.random,
            Kn = ue.reverse,
            Yn = zi(e, "DataView"),
            Qn = zi(e, "Map"),
            tr = zi(e, "Promise"),
            er = zi(e, "Set"),
            nr = zi(e, "WeakMap"),
            rr = zi(ne, "create"),
            or = nr && new nr(),
            ir = {},
            ur = pu(Yn),
            sr = pu(Qn),
            ar = pu(tr),
            cr = pu(er),
            fr = pu(nr),
            lr = we ? we.prototype : u,
            pr = lr ? lr.valueOf : u,
            hr = lr ? lr.toString : u;

        function dr(t) {
          if (As(t) && !gs(t) && !(t instanceof gr)) {
            if (t instanceof _r) return t;
            if (le.call(t, "__wrapped__")) return hu(t);
          }

          return new _r(t);
        }

        var vr = function () {
          function t() {}

          return function (e) {
            if (!js(e)) return {};
            if (ke) return ke(e);
            t.prototype = e;
            var n = new t();
            return t.prototype = u, n;
          };
        }();

        function yr() {}

        function _r(t, e) {
          this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = u;
        }

        function gr(t) {
          this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = L, this.__views__ = [];
        }

        function mr(t) {
          var e = -1,
              n = null == t ? 0 : t.length;

          for (this.clear(); ++e < n;) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }

        function br(t) {
          var e = -1,
              n = null == t ? 0 : t.length;

          for (this.clear(); ++e < n;) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }

        function wr(t) {
          var e = -1,
              n = null == t ? 0 : t.length;

          for (this.clear(); ++e < n;) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }

        function xr(t) {
          var e = -1,
              n = null == t ? 0 : t.length;

          for (this.__data__ = new wr(); ++e < n;) this.add(t[e]);
        }

        function Er(t) {
          var e = this.__data__ = new br(t);
          this.size = e.size;
        }

        function Or(t, e) {
          var n = gs(t),
              r = !n && _s(t),
              o = !n && !r && xs(t),
              i = !n && !r && !o && Fs(t),
              u = n || r || o || i,
              s = u ? _n(t.length, oe) : [],
              a = s.length;

          for (var c in t) !e && !le.call(t, c) || u && ("length" == c || o && ("offset" == c || "parent" == c) || i && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || Gi(c, a)) || s.push(c);

          return s;
        }

        function Cr(t) {
          var e = t.length;
          return e ? t[Eo(0, e - 1)] : u;
        }

        function Sr(t, e) {
          return cu(oi(t), Ur(e, 0, t.length));
        }

        function Tr(t) {
          return cu(oi(t));
        }

        function jr(t, e, n) {
          (n === u || ds(t[e], n)) && (n !== u || e in t) || kr(t, e, n);
        }

        function Ar(t, e, n) {
          var r = t[e];
          le.call(t, e) && ds(r, n) && (n !== u || e in t) || kr(t, e, n);
        }

        function Ir(t, e) {
          for (var n = t.length; n--;) if (ds(t[n][0], e)) return n;

          return -1;
        }

        function Pr(t, e, n, r) {
          return zr(t, function (t, o, i) {
            e(r, t, n(t), i);
          }), r;
        }

        function Rr(t, e) {
          return t && ii(e, ia(e), t);
        }

        function kr(t, e, n) {
          "__proto__" == e && dn ? dn(t, e, {
            configurable: !0,
            enumerable: !0,
            value: n,
            writable: !0
          }) : t[e] = n;
        }

        function Dr(t, e) {
          for (var n = -1, o = e.length, i = r(o), s = null == t; ++n < o;) i[n] = s ? u : ta(t, e[n]);

          return i;
        }

        function Ur(t, e, n) {
          return t == t && (n !== u && (t = t <= n ? t : n), e !== u && (t = t >= e ? t : e)), t;
        }

        function Nr(t, e, n, r, o, i) {
          var s,
              a = e & h,
              c = e & d,
              f = e & v;
          if (n && (s = o ? n(t, r, o, i) : n(t)), s !== u) return s;
          if (!js(t)) return t;
          var l = gs(t);

          if (l) {
            if (s = function (t) {
              var e = t.length,
                  n = new t.constructor(e);
              return e && "string" == typeof t[0] && le.call(t, "index") && (n.index = t.index, n.input = t.input), n;
            }(t), !a) return oi(t, s);
          } else {
            var p = $i(t),
                y = p == J || p == X;
            if (xs(t)) return Yo(t, a);

            if (p == tt || p == H || y && !o) {
              if (s = c || y ? {} : Wi(t), !a) return c ? function (t, e) {
                return ii(t, Hi(t), e);
              }(t, function (t, e) {
                return t && ii(e, ua(e), t);
              }(s, t)) : function (t, e) {
                return ii(t, Mi(t), e);
              }(t, Rr(s, t));
            } else {
              if (!je[p]) return o ? t : {};

              s = function (t, e, n) {
                var r,
                    o,
                    i,
                    u = t.constructor;

                switch (e) {
                  case ct:
                    return Qo(t);

                  case W:
                  case Z:
                    return new u(+t);

                  case ft:
                    return function (t, e) {
                      var n = e ? Qo(t.buffer) : t.buffer;
                      return new t.constructor(n, t.byteOffset, t.byteLength);
                    }(t, n);

                  case lt:
                  case pt:
                  case ht:
                  case dt:
                  case vt:
                  case yt:
                  case _t:
                  case gt:
                  case mt:
                    return ti(t, n);

                  case K:
                    return new u();

                  case Y:
                  case ot:
                    return new u(t);

                  case nt:
                    return (i = new (o = t).constructor(o.source, Bt.exec(o))).lastIndex = o.lastIndex, i;

                  case rt:
                    return new u();

                  case it:
                    return r = t, pr ? ne(pr.call(r)) : {};
                }
              }(t, p, a);
            }
          }

          i || (i = new Er());

          var _ = i.get(t);

          if (_) return _;
          if (i.set(t, s), Ds(t)) return t.forEach(function (r) {
            s.add(Nr(r, e, n, r, t, i));
          }), s;
          if (Is(t)) return t.forEach(function (r, o) {
            s.set(o, Nr(r, e, n, o, t, i));
          }), s;
          var g = l ? u : (f ? c ? ki : Ri : c ? ua : ia)(t);
          return Ve(g || t, function (r, o) {
            g && (r = t[o = r]), Ar(s, o, Nr(r, e, n, o, t, i));
          }), s;
        }

        function Fr(t, e, n) {
          var r = n.length;
          if (null == t) return !r;

          for (t = ne(t); r--;) {
            var o = n[r],
                i = e[o],
                s = t[o];
            if (s === u && !(o in t) || !i(s)) return !1;
          }

          return !0;
        }

        function Lr(t, e, n) {
          if ("function" != typeof t) throw new ie(c);
          return iu(function () {
            t.apply(u, n);
          }, e);
        }

        function qr(t, e, n, r) {
          var o = -1,
              i = Ye,
              u = !0,
              a = t.length,
              c = [],
              f = e.length;
          if (!a) return c;
          n && (e = tn(e, gn(n))), r ? (i = Qe, u = !1) : e.length >= s && (i = bn, u = !1, e = new xr(e));

          t: for (; ++o < a;) {
            var l = t[o],
                p = null == n ? l : n(l);

            if (l = r || 0 !== l ? l : 0, u && p == p) {
              for (var h = f; h--;) if (e[h] === p) continue t;

              c.push(l);
            } else i(e, p, r) || c.push(l);
          }

          return c;
        }

        dr.templateSettings = {
          escape: Tt,
          evaluate: jt,
          interpolate: At,
          variable: "",
          imports: {
            _: dr
          }
        }, dr.prototype = yr.prototype, dr.prototype.constructor = dr, _r.prototype = vr(yr.prototype), _r.prototype.constructor = _r, gr.prototype = vr(yr.prototype), gr.prototype.constructor = gr, mr.prototype.clear = function () {
          this.__data__ = rr ? rr(null) : {}, this.size = 0;
        }, mr.prototype.delete = function (t) {
          var e = this.has(t) && delete this.__data__[t];
          return this.size -= e ? 1 : 0, e;
        }, mr.prototype.get = function (t) {
          var e = this.__data__;

          if (rr) {
            var n = e[t];
            return n === f ? u : n;
          }

          return le.call(e, t) ? e[t] : u;
        }, mr.prototype.has = function (t) {
          var e = this.__data__;
          return rr ? e[t] !== u : le.call(e, t);
        }, mr.prototype.set = function (t, e) {
          var n = this.__data__;
          return this.size += this.has(t) ? 0 : 1, n[t] = rr && e === u ? f : e, this;
        }, br.prototype.clear = function () {
          this.__data__ = [], this.size = 0;
        }, br.prototype.delete = function (t) {
          var e = this.__data__,
              n = Ir(e, t);
          return !(n < 0 || (n == e.length - 1 ? e.pop() : Ne.call(e, n, 1), --this.size, 0));
        }, br.prototype.get = function (t) {
          var e = this.__data__,
              n = Ir(e, t);
          return n < 0 ? u : e[n][1];
        }, br.prototype.has = function (t) {
          return Ir(this.__data__, t) > -1;
        }, br.prototype.set = function (t, e) {
          var n = this.__data__,
              r = Ir(n, t);
          return r < 0 ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
        }, wr.prototype.clear = function () {
          this.size = 0, this.__data__ = {
            hash: new mr(),
            map: new (Qn || br)(),
            string: new mr()
          };
        }, wr.prototype.delete = function (t) {
          var e = Li(this, t).delete(t);
          return this.size -= e ? 1 : 0, e;
        }, wr.prototype.get = function (t) {
          return Li(this, t).get(t);
        }, wr.prototype.has = function (t) {
          return Li(this, t).has(t);
        }, wr.prototype.set = function (t, e) {
          var n = Li(this, t),
              r = n.size;
          return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
        }, xr.prototype.add = xr.prototype.push = function (t) {
          return this.__data__.set(t, f), this;
        }, xr.prototype.has = function (t) {
          return this.__data__.has(t);
        }, Er.prototype.clear = function () {
          this.__data__ = new br(), this.size = 0;
        }, Er.prototype.delete = function (t) {
          var e = this.__data__,
              n = e.delete(t);
          return this.size = e.size, n;
        }, Er.prototype.get = function (t) {
          return this.__data__.get(t);
        }, Er.prototype.has = function (t) {
          return this.__data__.has(t);
        }, Er.prototype.set = function (t, e) {
          var n = this.__data__;

          if (n instanceof br) {
            var r = n.__data__;
            if (!Qn || r.length < s - 1) return r.push([t, e]), this.size = ++n.size, this;
            n = this.__data__ = new wr(r);
          }

          return n.set(t, e), this.size = n.size, this;
        };
        var zr = ai(Vr),
            Mr = ai(Jr, !0);

        function Hr(t, e) {
          var n = !0;
          return zr(t, function (t, r, o) {
            return n = !!e(t, r, o);
          }), n;
        }

        function $r(t, e, n) {
          for (var r = -1, o = t.length; ++r < o;) {
            var i = t[r],
                s = e(i);
            if (null != s && (a === u ? s == s && !Ns(s) : n(s, a))) var a = s,
                c = i;
          }

          return c;
        }

        function Br(t, e) {
          var n = [];
          return zr(t, function (t, r, o) {
            e(t, r, o) && n.push(t);
          }), n;
        }

        function Wr(t, e, n, r, o) {
          var i = -1,
              u = t.length;

          for (n || (n = Zi), o || (o = []); ++i < u;) {
            var s = t[i];
            e > 0 && n(s) ? e > 1 ? Wr(s, e - 1, n, r, o) : en(o, s) : r || (o[o.length] = s);
          }

          return o;
        }

        var Zr = ci(),
            Gr = ci(!0);

        function Vr(t, e) {
          return t && Zr(t, e, ia);
        }

        function Jr(t, e) {
          return t && Gr(t, e, ia);
        }

        function Xr(t, e) {
          return Ke(e, function (e) {
            return Cs(t[e]);
          });
        }

        function Kr(t, e) {
          for (var n = 0, r = (e = Vo(e, t)).length; null != t && n < r;) t = t[lu(e[n++])];

          return n && n == r ? t : u;
        }

        function Yr(t, e, n) {
          var r = e(t);
          return gs(t) ? r : en(r, n(t));
        }

        function Qr(t) {
          return null == t ? t === u ? ut : Q : un && un in ne(t) ? function (t) {
            var e = le.call(t, un),
                n = t[un];

            try {
              t[un] = u;
              var r = !0;
            } catch (t) {}

            var o = de.call(t);
            return r && (e ? t[un] = n : delete t[un]), o;
          }(t) : function (t) {
            return de.call(t);
          }(t);
        }

        function to(t, e) {
          return t > e;
        }

        function eo(t, e) {
          return null != t && le.call(t, e);
        }

        function no(t, e) {
          return null != t && e in ne(t);
        }

        function ro(t, e, n) {
          for (var o = n ? Qe : Ye, i = t[0].length, s = t.length, a = s, c = r(s), f = 1 / 0, l = []; a--;) {
            var p = t[a];
            a && e && (p = tn(p, gn(e))), f = Gn(p.length, f), c[a] = !n && (e || i >= 120 && p.length >= 120) ? new xr(a && p) : u;
          }

          p = t[0];
          var h = -1,
              d = c[0];

          t: for (; ++h < i && l.length < f;) {
            var v = p[h],
                y = e ? e(v) : v;

            if (v = n || 0 !== v ? v : 0, !(d ? bn(d, y) : o(l, y, n))) {
              for (a = s; --a;) {
                var _ = c[a];
                if (!(_ ? bn(_, y) : o(t[a], y, n))) continue t;
              }

              d && d.push(y), l.push(v);
            }
          }

          return l;
        }

        function oo(t, e, n) {
          var r = null == (t = nu(t, e = Vo(e, t))) ? t : t[lu(Ou(e))];
          return null == r ? u : Ze(r, t, n);
        }

        function io(t) {
          return As(t) && Qr(t) == H;
        }

        function uo(t, e, n, r, o) {
          return t === e || (null == t || null == e || !As(t) && !As(e) ? t != t && e != e : function (t, e, n, r, o, i) {
            var s = gs(t),
                a = gs(e),
                c = s ? $ : $i(t),
                f = a ? $ : $i(e),
                l = (c = c == H ? tt : c) == tt,
                p = (f = f == H ? tt : f) == tt,
                h = c == f;

            if (h && xs(t)) {
              if (!xs(e)) return !1;
              s = !0, l = !1;
            }

            if (h && !l) return i || (i = new Er()), s || Fs(t) ? Ii(t, e, n, r, o, i) : function (t, e, n, r, o, i, u) {
              switch (n) {
                case ft:
                  if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
                  t = t.buffer, e = e.buffer;

                case ct:
                  return !(t.byteLength != e.byteLength || !i(new Ee(t), new Ee(e)));

                case W:
                case Z:
                case Y:
                  return ds(+t, +e);

                case V:
                  return t.name == e.name && t.message == e.message;

                case nt:
                case ot:
                  return t == e + "";

                case K:
                  var s = Tn;

                case rt:
                  var a = r & y;
                  if (s || (s = In), t.size != e.size && !a) return !1;
                  var c = u.get(t);
                  if (c) return c == e;
                  r |= _, u.set(t, e);
                  var f = Ii(s(t), s(e), r, o, i, u);
                  return u.delete(t), f;

                case it:
                  if (pr) return pr.call(t) == pr.call(e);
              }

              return !1;
            }(t, e, c, n, r, o, i);

            if (!(n & y)) {
              var d = l && le.call(t, "__wrapped__"),
                  v = p && le.call(e, "__wrapped__");

              if (d || v) {
                var g = d ? t.value() : t,
                    m = v ? e.value() : e;
                return i || (i = new Er()), o(g, m, n, r, i);
              }
            }

            return !!h && (i || (i = new Er()), function (t, e, n, r, o, i) {
              var s = n & y,
                  a = Ri(t),
                  c = a.length,
                  f = Ri(e).length;
              if (c != f && !s) return !1;

              for (var l = c; l--;) {
                var p = a[l];
                if (!(s ? p in e : le.call(e, p))) return !1;
              }

              var h = i.get(t);
              if (h && i.get(e)) return h == e;
              var d = !0;
              i.set(t, e), i.set(e, t);

              for (var v = s; ++l < c;) {
                p = a[l];
                var _ = t[p],
                    g = e[p];
                if (r) var m = s ? r(g, _, p, e, t, i) : r(_, g, p, t, e, i);

                if (!(m === u ? _ === g || o(_, g, n, r, i) : m)) {
                  d = !1;
                  break;
                }

                v || (v = "constructor" == p);
              }

              if (d && !v) {
                var b = t.constructor,
                    w = e.constructor;
                b != w && "constructor" in t && "constructor" in e && !("function" == typeof b && b instanceof b && "function" == typeof w && w instanceof w) && (d = !1);
              }

              return i.delete(t), i.delete(e), d;
            }(t, e, n, r, o, i));
          }(t, e, n, r, uo, o));
        }

        function so(t, e, n, r) {
          var o = n.length,
              i = o,
              s = !r;
          if (null == t) return !i;

          for (t = ne(t); o--;) {
            var a = n[o];
            if (s && a[2] ? a[1] !== t[a[0]] : !(a[0] in t)) return !1;
          }

          for (; ++o < i;) {
            var c = (a = n[o])[0],
                f = t[c],
                l = a[1];

            if (s && a[2]) {
              if (f === u && !(c in t)) return !1;
            } else {
              var p = new Er();
              if (r) var h = r(f, l, c, t, e, p);
              if (!(h === u ? uo(l, f, y | _, r, p) : h)) return !1;
            }
          }

          return !0;
        }

        function ao(t) {
          return !(!js(t) || (e = t, he && he in e)) && (Cs(t) ? _e : Gt).test(pu(t));
          var e;
        }

        function co(t) {
          return "function" == typeof t ? t : null == t ? Pa : "object" == (void 0 === t ? "undefined" : i(t)) ? gs(t) ? yo(t[0], t[1]) : vo(t) : za(t);
        }

        function fo(t) {
          if (!Yi(t)) return Wn(t);
          var e = [];

          for (var n in ne(t)) le.call(t, n) && "constructor" != n && e.push(n);

          return e;
        }

        function lo(t) {
          if (!js(t)) return function (t) {
            var e = [];
            if (null != t) for (var n in ne(t)) e.push(n);
            return e;
          }(t);
          var e = Yi(t),
              n = [];

          for (var r in t) ("constructor" != r || !e && le.call(t, r)) && n.push(r);

          return n;
        }

        function po(t, e) {
          return t < e;
        }

        function ho(t, e) {
          var n = -1,
              o = bs(t) ? r(t.length) : [];
          return zr(t, function (t, r, i) {
            o[++n] = e(t, r, i);
          }), o;
        }

        function vo(t) {
          var e = qi(t);
          return 1 == e.length && e[0][2] ? tu(e[0][0], e[0][1]) : function (n) {
            return n === t || so(n, t, e);
          };
        }

        function yo(t, e) {
          return Ji(t) && Qi(e) ? tu(lu(t), e) : function (n) {
            var r = ta(n, t);
            return r === u && r === e ? ea(n, t) : uo(e, r, y | _);
          };
        }

        function _o(t, e, n, r, o) {
          t !== e && Zr(e, function (i, s) {
            if (js(i)) o || (o = new Er()), function (t, e, n, r, o, i, s) {
              var a = ru(t, n),
                  c = ru(e, n),
                  f = s.get(c);
              if (f) jr(t, n, f);else {
                var l = i ? i(a, c, n + "", t, e, s) : u,
                    p = l === u;

                if (p) {
                  var h = gs(c),
                      d = !h && xs(c),
                      v = !h && !d && Fs(c);
                  l = c, h || d || v ? gs(a) ? l = a : ws(a) ? l = oi(a) : d ? (p = !1, l = Yo(c, !0)) : v ? (p = !1, l = ti(c, !0)) : l = [] : Rs(c) || _s(c) ? (l = a, _s(a) ? l = Ws(a) : js(a) && !Cs(a) || (l = Wi(c))) : p = !1;
                }

                p && (s.set(c, l), o(l, c, r, i, s), s.delete(c)), jr(t, n, l);
              }
            }(t, e, s, n, _o, r, o);else {
              var a = r ? r(ru(t, s), i, s + "", t, e, o) : u;
              a === u && (a = i), jr(t, s, a);
            }
          }, ua);
        }

        function go(t, e) {
          var n = t.length;
          if (n) return Gi(e += e < 0 ? n : 0, n) ? t[e] : u;
        }

        function mo(t, e, n) {
          var r = -1;
          return e = tn(e.length ? e : [Pa], gn(Fi())), function (t, e) {
            var n = t.length;

            for (t.sort(e); n--;) t[n] = t[n].value;

            return t;
          }(ho(t, function (t, n, o) {
            return {
              criteria: tn(e, function (e) {
                return e(t);
              }),
              index: ++r,
              value: t
            };
          }), function (t, e) {
            return function (t, e, n) {
              for (var r = -1, o = t.criteria, i = e.criteria, u = o.length, s = n.length; ++r < u;) {
                var a = ei(o[r], i[r]);

                if (a) {
                  if (r >= s) return a;
                  var c = n[r];
                  return a * ("desc" == c ? -1 : 1);
                }
              }

              return t.index - e.index;
            }(t, e, n);
          });
        }

        function bo(t, e, n) {
          for (var r = -1, o = e.length, i = {}; ++r < o;) {
            var u = e[r],
                s = Kr(t, u);
            n(s, u) && jo(i, Vo(u, t), s);
          }

          return i;
        }

        function wo(t, e, n, r) {
          var o = r ? fn : cn,
              i = -1,
              u = e.length,
              s = t;

          for (t === e && (e = oi(e)), n && (s = tn(t, gn(n))); ++i < u;) for (var a = 0, c = e[i], f = n ? n(c) : c; (a = o(s, f, a, r)) > -1;) s !== t && Ne.call(s, a, 1), Ne.call(t, a, 1);

          return t;
        }

        function xo(t, e) {
          for (var n = t ? e.length : 0, r = n - 1; n--;) {
            var o = e[n];

            if (n == r || o !== i) {
              var i = o;
              Gi(o) ? Ne.call(t, o, 1) : zo(t, o);
            }
          }

          return t;
        }

        function Eo(t, e) {
          return t + zn(Xn() * (e - t + 1));
        }

        function Oo(t, e) {
          var n = "";
          if (!t || e < 1 || e > U) return n;

          do {
            e % 2 && (n += t), (e = zn(e / 2)) && (t += t);
          } while (e);

          return n;
        }

        function Co(t, e) {
          return uu(eu(t, e, Pa), t + "");
        }

        function So(t) {
          return Cr(da(t));
        }

        function To(t, e) {
          var n = da(t);
          return cu(n, Ur(e, 0, n.length));
        }

        function jo(t, e, n, r) {
          if (!js(t)) return t;

          for (var o = -1, i = (e = Vo(e, t)).length, s = i - 1, a = t; null != a && ++o < i;) {
            var c = lu(e[o]),
                f = n;

            if (o != s) {
              var l = a[c];
              (f = r ? r(l, c, a) : u) === u && (f = js(l) ? l : Gi(e[o + 1]) ? [] : {});
            }

            Ar(a, c, f), a = a[c];
          }

          return t;
        }

        var Ao = or ? function (t, e) {
          return or.set(t, e), t;
        } : Pa,
            Io = dn ? function (t, e) {
          return dn(t, "toString", {
            configurable: !0,
            enumerable: !1,
            value: ja(e),
            writable: !0
          });
        } : Pa;

        function Po(t) {
          return cu(da(t));
        }

        function Ro(t, e, n) {
          var o = -1,
              i = t.length;
          e < 0 && (e = -e > i ? 0 : i + e), (n = n > i ? i : n) < 0 && (n += i), i = e > n ? 0 : n - e >>> 0, e >>>= 0;

          for (var u = r(i); ++o < i;) u[o] = t[o + e];

          return u;
        }

        function ko(t, e) {
          var n;
          return zr(t, function (t, r, o) {
            return !(n = e(t, r, o));
          }), !!n;
        }

        function Do(t, e, n) {
          var r = 0,
              o = null == t ? r : t.length;

          if ("number" == typeof e && e == e && o <= z) {
            for (; r < o;) {
              var i = r + o >>> 1,
                  u = t[i];
              null !== u && !Ns(u) && (n ? u <= e : u < e) ? r = i + 1 : o = i;
            }

            return o;
          }

          return Uo(t, e, Pa, n);
        }

        function Uo(t, e, n, r) {
          e = n(e);

          for (var o = 0, i = null == t ? 0 : t.length, s = e != e, a = null === e, c = Ns(e), f = e === u; o < i;) {
            var l = zn((o + i) / 2),
                p = n(t[l]),
                h = p !== u,
                d = null === p,
                v = p == p,
                y = Ns(p);
            if (s) var _ = r || v;else _ = f ? v && (r || h) : a ? v && h && (r || !d) : c ? v && h && !d && (r || !y) : !d && !y && (r ? p <= e : p < e);
            _ ? o = l + 1 : i = l;
          }

          return Gn(i, q);
        }

        function No(t, e) {
          for (var n = -1, r = t.length, o = 0, i = []; ++n < r;) {
            var u = t[n],
                s = e ? e(u) : u;

            if (!n || !ds(s, a)) {
              var a = s;
              i[o++] = 0 === u ? 0 : u;
            }
          }

          return i;
        }

        function Fo(t) {
          return "number" == typeof t ? t : Ns(t) ? F : +t;
        }

        function Lo(t) {
          if ("string" == typeof t) return t;
          if (gs(t)) return tn(t, Lo) + "";
          if (Ns(t)) return hr ? hr.call(t) : "";
          var e = t + "";
          return "0" == e && 1 / t == -D ? "-0" : e;
        }

        function qo(t, e, n) {
          var r = -1,
              o = Ye,
              i = t.length,
              u = !0,
              a = [],
              c = a;
          if (n) u = !1, o = Qe;else if (i >= s) {
            var f = e ? null : Oi(t);
            if (f) return In(f);
            u = !1, o = bn, c = new xr();
          } else c = e ? [] : a;

          t: for (; ++r < i;) {
            var l = t[r],
                p = e ? e(l) : l;

            if (l = n || 0 !== l ? l : 0, u && p == p) {
              for (var h = c.length; h--;) if (c[h] === p) continue t;

              e && c.push(p), a.push(l);
            } else o(c, p, n) || (c !== a && c.push(p), a.push(l));
          }

          return a;
        }

        function zo(t, e) {
          return null == (t = nu(t, e = Vo(e, t))) || delete t[lu(Ou(e))];
        }

        function Mo(t, e, n, r) {
          return jo(t, e, n(Kr(t, e)), r);
        }

        function Ho(t, e, n, r) {
          for (var o = t.length, i = r ? o : -1; (r ? i-- : ++i < o) && e(t[i], i, t););

          return n ? Ro(t, r ? 0 : i, r ? i + 1 : o) : Ro(t, r ? i + 1 : 0, r ? o : i);
        }

        function $o(t, e) {
          var n = t;
          return n instanceof gr && (n = n.value()), nn(e, function (t, e) {
            return e.func.apply(e.thisArg, en([t], e.args));
          }, n);
        }

        function Bo(t, e, n) {
          var o = t.length;
          if (o < 2) return o ? qo(t[0]) : [];

          for (var i = -1, u = r(o); ++i < o;) for (var s = t[i], a = -1; ++a < o;) a != i && (u[i] = qr(u[i] || s, t[a], e, n));

          return qo(Wr(u, 1), e, n);
        }

        function Wo(t, e, n) {
          for (var r = -1, o = t.length, i = e.length, s = {}; ++r < o;) {
            var a = r < i ? e[r] : u;
            n(s, t[r], a);
          }

          return s;
        }

        function Zo(t) {
          return ws(t) ? t : [];
        }

        function Go(t) {
          return "function" == typeof t ? t : Pa;
        }

        function Vo(t, e) {
          return gs(t) ? t : Ji(t, e) ? [t] : fu(Zs(t));
        }

        var Jo = Co;

        function Xo(t, e, n) {
          var r = t.length;
          return n = n === u ? r : n, !e && n >= r ? t : Ro(t, e, n);
        }

        var Ko = Nn || function (t) {
          return De.clearTimeout(t);
        };

        function Yo(t, e) {
          if (e) return t.slice();
          var n = t.length,
              r = Ae ? Ae(n) : new t.constructor(n);
          return t.copy(r), r;
        }

        function Qo(t) {
          var e = new t.constructor(t.byteLength);
          return new Ee(e).set(new Ee(t)), e;
        }

        function ti(t, e) {
          var n = e ? Qo(t.buffer) : t.buffer;
          return new t.constructor(n, t.byteOffset, t.length);
        }

        function ei(t, e) {
          if (t !== e) {
            var n = t !== u,
                r = null === t,
                o = t == t,
                i = Ns(t),
                s = e !== u,
                a = null === e,
                c = e == e,
                f = Ns(e);
            if (!a && !f && !i && t > e || i && s && c && !a && !f || r && s && c || !n && c || !o) return 1;
            if (!r && !i && !f && t < e || f && n && o && !r && !i || a && n && o || !s && o || !c) return -1;
          }

          return 0;
        }

        function ni(t, e, n, o) {
          for (var i = -1, u = t.length, s = n.length, a = -1, c = e.length, f = Zn(u - s, 0), l = r(c + f), p = !o; ++a < c;) l[a] = e[a];

          for (; ++i < s;) (p || i < u) && (l[n[i]] = t[i]);

          for (; f--;) l[a++] = t[i++];

          return l;
        }

        function ri(t, e, n, o) {
          for (var i = -1, u = t.length, s = -1, a = n.length, c = -1, f = e.length, l = Zn(u - a, 0), p = r(l + f), h = !o; ++i < l;) p[i] = t[i];

          for (var d = i; ++c < f;) p[d + c] = e[c];

          for (; ++s < a;) (h || i < u) && (p[d + n[s]] = t[i++]);

          return p;
        }

        function oi(t, e) {
          var n = -1,
              o = t.length;

          for (e || (e = r(o)); ++n < o;) e[n] = t[n];

          return e;
        }

        function ii(t, e, n, r) {
          var o = !n;
          n || (n = {});

          for (var i = -1, s = e.length; ++i < s;) {
            var a = e[i],
                c = r ? r(n[a], t[a], a, n, t) : u;
            c === u && (c = t[a]), o ? kr(n, a, c) : Ar(n, a, c);
          }

          return n;
        }

        function ui(t, e) {
          return function (n, r) {
            var o = gs(n) ? Ge : Pr,
                i = e ? e() : {};
            return o(n, t, Fi(r, 2), i);
          };
        }

        function si(t) {
          return Co(function (e, n) {
            var r = -1,
                o = n.length,
                i = o > 1 ? n[o - 1] : u,
                s = o > 2 ? n[2] : u;

            for (i = t.length > 3 && "function" == typeof i ? (o--, i) : u, s && Vi(n[0], n[1], s) && (i = o < 3 ? u : i, o = 1), e = ne(e); ++r < o;) {
              var a = n[r];
              a && t(e, a, r, i);
            }

            return e;
          });
        }

        function ai(t, e) {
          return function (n, r) {
            if (null == n) return n;
            if (!bs(n)) return t(n, r);

            for (var o = n.length, i = e ? o : -1, u = ne(n); (e ? i-- : ++i < o) && !1 !== r(u[i], i, u););

            return n;
          };
        }

        function ci(t) {
          return function (e, n, r) {
            for (var o = -1, i = ne(e), u = r(e), s = u.length; s--;) {
              var a = u[t ? s : ++o];
              if (!1 === n(i[a], a, i)) break;
            }

            return e;
          };
        }

        function fi(t) {
          return function (e) {
            var n = Sn(e = Zs(e)) ? kn(e) : u,
                r = n ? n[0] : e.charAt(0),
                o = n ? Xo(n, 1).join("") : e.slice(1);
            return r[t]() + o;
          };
        }

        function li(t) {
          return function (e) {
            return nn(Ca(_a(e).replace(me, "")), t, "");
          };
        }

        function pi(t) {
          return function () {
            var e = arguments;

            switch (e.length) {
              case 0:
                return new t();

              case 1:
                return new t(e[0]);

              case 2:
                return new t(e[0], e[1]);

              case 3:
                return new t(e[0], e[1], e[2]);

              case 4:
                return new t(e[0], e[1], e[2], e[3]);

              case 5:
                return new t(e[0], e[1], e[2], e[3], e[4]);

              case 6:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5]);

              case 7:
                return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
            }

            var n = vr(t.prototype),
                r = t.apply(n, e);
            return js(r) ? r : n;
          };
        }

        function hi(t) {
          return function (e, n, r) {
            var o = ne(e);

            if (!bs(e)) {
              var i = Fi(n, 3);
              e = ia(e), n = function (t) {
                return i(o[t], t, o);
              };
            }

            var s = t(e, n, r);
            return s > -1 ? o[i ? e[s] : s] : u;
          };
        }

        function di(t) {
          return Pi(function (e) {
            var n = e.length,
                r = n,
                o = _r.prototype.thru;

            for (t && e.reverse(); r--;) {
              var i = e[r];
              if ("function" != typeof i) throw new ie(c);
              if (o && !s && "wrapper" == Ui(i)) var s = new _r([], !0);
            }

            for (r = s ? r : n; ++r < n;) {
              var a = Ui(i = e[r]),
                  f = "wrapper" == a ? Di(i) : u;
              s = f && Xi(f[0]) && f[1] == (C | w | E | S) && !f[4].length && 1 == f[9] ? s[Ui(f[0])].apply(s, f[3]) : 1 == i.length && Xi(i) ? s[a]() : s.thru(i);
            }

            return function () {
              var t = arguments,
                  r = t[0];
              if (s && 1 == t.length && gs(r)) return s.plant(r).value();

              for (var o = 0, i = n ? e[o].apply(this, t) : r; ++o < n;) i = e[o].call(this, i);

              return i;
            };
          });
        }

        function vi(t, e, n, o, i, s, a, c, f, l) {
          var p = e & C,
              h = e & g,
              d = e & m,
              v = e & (w | x),
              y = e & T,
              _ = d ? u : pi(t);

          return function g() {
            for (var m = arguments.length, b = r(m), w = m; w--;) b[w] = arguments[w];

            if (v) var x = Ni(g),
                E = function (t, e) {
              for (var n = t.length, r = 0; n--;) t[n] === e && ++r;

              return r;
            }(b, x);

            if (o && (b = ni(b, o, i, v)), s && (b = ri(b, s, a, v)), m -= E, v && m < l) {
              var O = An(b, x);
              return xi(t, e, vi, g.placeholder, n, b, O, c, f, l - m);
            }

            var C = h ? n : this,
                S = d ? C[t] : t;
            return m = b.length, c ? b = function (t, e) {
              for (var n = t.length, r = Gn(e.length, n), o = oi(t); r--;) {
                var i = e[r];
                t[r] = Gi(i, n) ? o[i] : u;
              }

              return t;
            }(b, c) : y && m > 1 && b.reverse(), p && f < m && (b.length = f), this && this !== De && this instanceof g && (S = _ || pi(S)), S.apply(C, b);
          };
        }

        function yi(t, e) {
          return function (n, r) {
            return function (t, e, n, r) {
              return Vr(t, function (t, o, i) {
                e(r, n(t), o, i);
              }), r;
            }(n, t, e(r), {});
          };
        }

        function _i(t, e) {
          return function (n, r) {
            var o;
            if (n === u && r === u) return e;

            if (n !== u && (o = n), r !== u) {
              if (o === u) return r;
              "string" == typeof n || "string" == typeof r ? (n = Lo(n), r = Lo(r)) : (n = Fo(n), r = Fo(r)), o = t(n, r);
            }

            return o;
          };
        }

        function gi(t) {
          return Pi(function (e) {
            return e = tn(e, gn(Fi())), Co(function (n) {
              var r = this;
              return t(e, function (t) {
                return Ze(t, r, n);
              });
            });
          });
        }

        function mi(t, e) {
          var n = (e = e === u ? " " : Lo(e)).length;
          if (n < 2) return n ? Oo(e, t) : e;
          var r = Oo(e, qn(t / Rn(e)));
          return Sn(e) ? Xo(kn(r), 0, t).join("") : r.slice(0, t);
        }

        function bi(t) {
          return function (e, n, o) {
            return o && "number" != typeof o && Vi(e, n, o) && (n = o = u), e = Ms(e), n === u ? (n = e, e = 0) : n = Ms(n), function (t, e, n, o) {
              for (var i = -1, u = Zn(qn((e - t) / (n || 1)), 0), s = r(u); u--;) s[o ? u : ++i] = t, t += n;

              return s;
            }(e, n, o = o === u ? e < n ? 1 : -1 : Ms(o), t);
          };
        }

        function wi(t) {
          return function (e, n) {
            return "string" == typeof e && "string" == typeof n || (e = Bs(e), n = Bs(n)), t(e, n);
          };
        }

        function xi(t, e, n, r, o, i, s, a, c, f) {
          var l = e & w;
          e |= l ? E : O, (e &= ~(l ? O : E)) & b || (e &= ~(g | m));
          var p = [t, e, o, l ? i : u, l ? s : u, l ? u : i, l ? u : s, a, c, f],
              h = n.apply(u, p);
          return Xi(t) && ou(h, p), h.placeholder = r, su(h, t, e);
        }

        function Ei(t) {
          var e = ee[t];
          return function (t, n) {
            if (t = Bs(t), n = null == n ? 0 : Gn(Hs(n), 292)) {
              var r = (Zs(t) + "e").split("e");
              return +((r = (Zs(e(r[0] + "e" + (+r[1] + n))) + "e").split("e"))[0] + "e" + (+r[1] - n));
            }

            return e(t);
          };
        }

        var Oi = er && 1 / In(new er([, -0]))[1] == D ? function (t) {
          return new er(t);
        } : Na;

        function Ci(t) {
          return function (e) {
            var n = $i(e);
            return n == K ? Tn(e) : n == rt ? Pn(e) : function (t, e) {
              return tn(e, function (e) {
                return [e, t[e]];
              });
            }(e, t(e));
          };
        }

        function Si(t, e, n, o, i, s, a, f) {
          var l = e & m;
          if (!l && "function" != typeof t) throw new ie(c);
          var h = o ? o.length : 0;

          if (h || (e &= ~(E | O), o = i = u), a = a === u ? a : Zn(Hs(a), 0), f = f === u ? f : Hs(f), h -= i ? i.length : 0, e & O) {
            var d = o,
                v = i;
            o = i = u;
          }

          var y = l ? u : Di(t),
              _ = [t, e, n, o, i, d, v, s, a, f];
          if (y && function (t, e) {
            var n = t[1],
                r = e[1],
                o = n | r,
                i = o < (g | m | C),
                u = r == C && n == w || r == C && n == S && t[7].length <= e[8] || r == (C | S) && e[7].length <= e[8] && n == w;
            if (!i && !u) return t;
            r & g && (t[2] = e[2], o |= n & g ? 0 : b);
            var s = e[3];

            if (s) {
              var a = t[3];
              t[3] = a ? ni(a, s, e[4]) : s, t[4] = a ? An(t[3], p) : e[4];
            }

            (s = e[5]) && (a = t[5], t[5] = a ? ri(a, s, e[6]) : s, t[6] = a ? An(t[5], p) : e[6]), (s = e[7]) && (t[7] = s), r & C && (t[8] = null == t[8] ? e[8] : Gn(t[8], e[8])), null == t[9] && (t[9] = e[9]), t[0] = e[0], t[1] = o;
          }(_, y), t = _[0], e = _[1], n = _[2], o = _[3], i = _[4], !(f = _[9] = _[9] === u ? l ? 0 : t.length : Zn(_[9] - h, 0)) && e & (w | x) && (e &= ~(w | x)), e && e != g) T = e == w || e == x ? function (t, e, n) {
            var o = pi(t);
            return function i() {
              for (var s = arguments.length, a = r(s), c = s, f = Ni(i); c--;) a[c] = arguments[c];

              var l = s < 3 && a[0] !== f && a[s - 1] !== f ? [] : An(a, f);
              return (s -= l.length) < n ? xi(t, e, vi, i.placeholder, u, a, l, u, u, n - s) : Ze(this && this !== De && this instanceof i ? o : t, this, a);
            };
          }(t, e, f) : e != E && e != (g | E) || i.length ? vi.apply(u, _) : function (t, e, n, o) {
            var i = e & g,
                u = pi(t);
            return function e() {
              for (var s = -1, a = arguments.length, c = -1, f = o.length, l = r(f + a), p = this && this !== De && this instanceof e ? u : t; ++c < f;) l[c] = o[c];

              for (; a--;) l[c++] = arguments[++s];

              return Ze(p, i ? n : this, l);
            };
          }(t, e, n, o);else var T = function (t, e, n) {
            var r = e & g,
                o = pi(t);
            return function e() {
              return (this && this !== De && this instanceof e ? o : t).apply(r ? n : this, arguments);
            };
          }(t, e, n);
          return su((y ? Ao : ou)(T, _), t, e);
        }

        function Ti(t, e, n, r) {
          return t === u || ds(t, ae[n]) && !le.call(r, n) ? e : t;
        }

        function ji(t, e, n, r, o, i) {
          return js(t) && js(e) && (i.set(e, t), _o(t, e, u, ji, i), i.delete(e)), t;
        }

        function Ai(t) {
          return Rs(t) ? u : t;
        }

        function Ii(t, e, n, r, o, i) {
          var s = n & y,
              a = t.length,
              c = e.length;
          if (a != c && !(s && c > a)) return !1;
          var f = i.get(t);
          if (f && i.get(e)) return f == e;
          var l = -1,
              p = !0,
              h = n & _ ? new xr() : u;

          for (i.set(t, e), i.set(e, t); ++l < a;) {
            var d = t[l],
                v = e[l];
            if (r) var g = s ? r(v, d, l, e, t, i) : r(d, v, l, t, e, i);

            if (g !== u) {
              if (g) continue;
              p = !1;
              break;
            }

            if (h) {
              if (!on(e, function (t, e) {
                if (!bn(h, e) && (d === t || o(d, t, n, r, i))) return h.push(e);
              })) {
                p = !1;
                break;
              }
            } else if (d !== v && !o(d, v, n, r, i)) {
              p = !1;
              break;
            }
          }

          return i.delete(t), i.delete(e), p;
        }

        function Pi(t) {
          return uu(eu(t, u, mu), t + "");
        }

        function Ri(t) {
          return Yr(t, ia, Mi);
        }

        function ki(t) {
          return Yr(t, ua, Hi);
        }

        var Di = or ? function (t) {
          return or.get(t);
        } : Na;

        function Ui(t) {
          for (var e = t.name + "", n = ir[e], r = le.call(ir, e) ? n.length : 0; r--;) {
            var o = n[r],
                i = o.func;
            if (null == i || i == t) return o.name;
          }

          return e;
        }

        function Ni(t) {
          return (le.call(dr, "placeholder") ? dr : t).placeholder;
        }

        function Fi() {
          var t = dr.iteratee || Ra;
          return t = t === Ra ? co : t, arguments.length ? t(arguments[0], arguments[1]) : t;
        }

        function Li(t, e) {
          var n,
              r,
              o = t.__data__;
          return ("string" == (r = void 0 === (n = e) ? "undefined" : i(n)) || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== n : null === n) ? o["string" == typeof e ? "string" : "hash"] : o.map;
        }

        function qi(t) {
          for (var e = ia(t), n = e.length; n--;) {
            var r = e[n],
                o = t[r];
            e[n] = [r, o, Qi(o)];
          }

          return e;
        }

        function zi(t, e) {
          var n = function (t, e) {
            return null == t ? u : t[e];
          }(t, e);

          return ao(n) ? n : u;
        }

        var Mi = Mn ? function (t) {
          return null == t ? [] : (t = ne(t), Ke(Mn(t), function (e) {
            return Ue.call(t, e);
          }));
        } : $a,
            Hi = Mn ? function (t) {
          for (var e = []; t;) en(e, Mi(t)), t = Re(t);

          return e;
        } : $a,
            $i = Qr;

        function Bi(t, e, n) {
          for (var r = -1, o = (e = Vo(e, t)).length, i = !1; ++r < o;) {
            var u = lu(e[r]);
            if (!(i = null != t && n(t, u))) break;
            t = t[u];
          }

          return i || ++r != o ? i : !!(o = null == t ? 0 : t.length) && Ts(o) && Gi(u, o) && (gs(t) || _s(t));
        }

        function Wi(t) {
          return "function" != typeof t.constructor || Yi(t) ? {} : vr(Re(t));
        }

        function Zi(t) {
          return gs(t) || _s(t) || !!(Le && t && t[Le]);
        }

        function Gi(t, e) {
          var n = void 0 === t ? "undefined" : i(t);
          return !!(e = null == e ? U : e) && ("number" == n || "symbol" != n && Jt.test(t)) && t > -1 && t % 1 == 0 && t < e;
        }

        function Vi(t, e, n) {
          if (!js(n)) return !1;
          var r = void 0 === e ? "undefined" : i(e);
          return !!("number" == r ? bs(n) && Gi(e, n.length) : "string" == r && e in n) && ds(n[e], t);
        }

        function Ji(t, e) {
          if (gs(t)) return !1;
          var n = void 0 === t ? "undefined" : i(t);
          return !("number" != n && "symbol" != n && "boolean" != n && null != t && !Ns(t)) || Pt.test(t) || !It.test(t) || null != e && t in ne(e);
        }

        function Xi(t) {
          var e = Ui(t),
              n = dr[e];
          if ("function" != typeof n || !(e in gr.prototype)) return !1;
          if (t === n) return !0;
          var r = Di(n);
          return !!r && t === r[0];
        }

        (Yn && $i(new Yn(new ArrayBuffer(1))) != ft || Qn && $i(new Qn()) != K || tr && "[object Promise]" != $i(tr.resolve()) || er && $i(new er()) != rt || nr && $i(new nr()) != st) && ($i = function (t) {
          var e = Qr(t),
              n = e == tt ? t.constructor : u,
              r = n ? pu(n) : "";
          if (r) switch (r) {
            case ur:
              return ft;

            case sr:
              return K;

            case ar:
              return "[object Promise]";

            case cr:
              return rt;

            case fr:
              return st;
          }
          return e;
        });
        var Ki = ce ? Cs : Ba;

        function Yi(t) {
          var e = t && t.constructor;
          return t === ("function" == typeof e && e.prototype || ae);
        }

        function Qi(t) {
          return t == t && !js(t);
        }

        function tu(t, e) {
          return function (n) {
            return null != n && n[t] === e && (e !== u || t in ne(n));
          };
        }

        function eu(t, e, n) {
          return e = Zn(e === u ? t.length - 1 : e, 0), function () {
            for (var o = arguments, i = -1, u = Zn(o.length - e, 0), s = r(u); ++i < u;) s[i] = o[e + i];

            i = -1;

            for (var a = r(e + 1); ++i < e;) a[i] = o[i];

            return a[e] = n(s), Ze(t, this, a);
          };
        }

        function nu(t, e) {
          return e.length < 2 ? t : Kr(t, Ro(e, 0, -1));
        }

        function ru(t, e) {
          if ("__proto__" != e) return t[e];
        }

        var ou = au(Ao),
            iu = Ln || function (t, e) {
          return De.setTimeout(t, e);
        },
            uu = au(Io);

        function su(t, e, n) {
          var r = e + "";
          return uu(t, function (t, e) {
            var n = e.length;
            if (!n) return t;
            var r = n - 1;
            return e[r] = (n > 1 ? "& " : "") + e[r], e = e.join(n > 2 ? ", " : " "), t.replace(Lt, "{\n/* [wrapped with " + e + "] */\n");
          }(r, function (t, e) {
            return Ve(M, function (n) {
              var r = "_." + n[0];
              e & n[1] && !Ye(t, r) && t.push(r);
            }), t.sort();
          }(function (t) {
            var e = t.match(qt);
            return e ? e[1].split(zt) : [];
          }(r), n)));
        }

        function au(t) {
          var e = 0,
              n = 0;
          return function () {
            var r = Vn(),
                o = P - (r - n);

            if (n = r, o > 0) {
              if (++e >= I) return arguments[0];
            } else e = 0;

            return t.apply(u, arguments);
          };
        }

        function cu(t, e) {
          var n = -1,
              r = t.length,
              o = r - 1;

          for (e = e === u ? r : e; ++n < e;) {
            var i = Eo(n, o),
                s = t[i];
            t[i] = t[n], t[n] = s;
          }

          return t.length = e, t;
        }

        var fu = function (t) {
          var e = as(t, function (t) {
            return n.size === l && n.clear(), t;
          }),
              n = e.cache;
          return e;
        }(function (t) {
          var e = [];
          return 46 === t.charCodeAt(0) && e.push(""), t.replace(Rt, function (t, n, r, o) {
            e.push(r ? o.replace(Ht, "$1") : n || t);
          }), e;
        });

        function lu(t) {
          if ("string" == typeof t || Ns(t)) return t;
          var e = t + "";
          return "0" == e && 1 / t == -D ? "-0" : e;
        }

        function pu(t) {
          if (null != t) {
            try {
              return fe.call(t);
            } catch (t) {}

            try {
              return t + "";
            } catch (t) {}
          }

          return "";
        }

        function hu(t) {
          if (t instanceof gr) return t.clone();
          var e = new _r(t.__wrapped__, t.__chain__);
          return e.__actions__ = oi(t.__actions__), e.__index__ = t.__index__, e.__values__ = t.__values__, e;
        }

        var du = Co(function (t, e) {
          return ws(t) ? qr(t, Wr(e, 1, ws, !0)) : [];
        }),
            vu = Co(function (t, e) {
          var n = Ou(e);
          return ws(n) && (n = u), ws(t) ? qr(t, Wr(e, 1, ws, !0), Fi(n, 2)) : [];
        }),
            yu = Co(function (t, e) {
          var n = Ou(e);
          return ws(n) && (n = u), ws(t) ? qr(t, Wr(e, 1, ws, !0), u, n) : [];
        });

        function _u(t, e, n) {
          var r = null == t ? 0 : t.length;
          if (!r) return -1;
          var o = null == n ? 0 : Hs(n);
          return o < 0 && (o = Zn(r + o, 0)), an(t, Fi(e, 3), o);
        }

        function gu(t, e, n) {
          var r = null == t ? 0 : t.length;
          if (!r) return -1;
          var o = r - 1;
          return n !== u && (o = Hs(n), o = n < 0 ? Zn(r + o, 0) : Gn(o, r - 1)), an(t, Fi(e, 3), o, !0);
        }

        function mu(t) {
          return null != t && t.length ? Wr(t, 1) : [];
        }

        function bu(t) {
          return t && t.length ? t[0] : u;
        }

        var wu = Co(function (t) {
          var e = tn(t, Zo);
          return e.length && e[0] === t[0] ? ro(e) : [];
        }),
            xu = Co(function (t) {
          var e = Ou(t),
              n = tn(t, Zo);
          return e === Ou(n) ? e = u : n.pop(), n.length && n[0] === t[0] ? ro(n, Fi(e, 2)) : [];
        }),
            Eu = Co(function (t) {
          var e = Ou(t),
              n = tn(t, Zo);
          return (e = "function" == typeof e ? e : u) && n.pop(), n.length && n[0] === t[0] ? ro(n, u, e) : [];
        });

        function Ou(t) {
          var e = null == t ? 0 : t.length;
          return e ? t[e - 1] : u;
        }

        var Cu = Co(Su);

        function Su(t, e) {
          return t && t.length && e && e.length ? wo(t, e) : t;
        }

        var Tu = Pi(function (t, e) {
          var n = null == t ? 0 : t.length,
              r = Dr(t, e);
          return xo(t, tn(e, function (t) {
            return Gi(t, n) ? +t : t;
          }).sort(ei)), r;
        });

        function ju(t) {
          return null == t ? t : Kn.call(t);
        }

        var Au = Co(function (t) {
          return qo(Wr(t, 1, ws, !0));
        }),
            Iu = Co(function (t) {
          var e = Ou(t);
          return ws(e) && (e = u), qo(Wr(t, 1, ws, !0), Fi(e, 2));
        }),
            Pu = Co(function (t) {
          var e = Ou(t);
          return e = "function" == typeof e ? e : u, qo(Wr(t, 1, ws, !0), u, e);
        });

        function Ru(t) {
          if (!t || !t.length) return [];
          var e = 0;
          return t = Ke(t, function (t) {
            if (ws(t)) return e = Zn(t.length, e), !0;
          }), _n(e, function (e) {
            return tn(t, hn(e));
          });
        }

        function ku(t, e) {
          if (!t || !t.length) return [];
          var n = Ru(t);
          return null == e ? n : tn(n, function (t) {
            return Ze(e, u, t);
          });
        }

        var Du = Co(function (t, e) {
          return ws(t) ? qr(t, e) : [];
        }),
            Uu = Co(function (t) {
          return Bo(Ke(t, ws));
        }),
            Nu = Co(function (t) {
          var e = Ou(t);
          return ws(e) && (e = u), Bo(Ke(t, ws), Fi(e, 2));
        }),
            Fu = Co(function (t) {
          var e = Ou(t);
          return e = "function" == typeof e ? e : u, Bo(Ke(t, ws), u, e);
        }),
            Lu = Co(Ru);
        var qu = Co(function (t) {
          var e = t.length,
              n = e > 1 ? t[e - 1] : u;
          return n = "function" == typeof n ? (t.pop(), n) : u, ku(t, n);
        });

        function zu(t) {
          var e = dr(t);
          return e.__chain__ = !0, e;
        }

        function Mu(t, e) {
          return e(t);
        }

        var Hu = Pi(function (t) {
          var e = t.length,
              n = e ? t[0] : 0,
              r = this.__wrapped__,
              o = function (e) {
            return Dr(e, t);
          };

          return !(e > 1 || this.__actions__.length) && r instanceof gr && Gi(n) ? ((r = r.slice(n, +n + (e ? 1 : 0))).__actions__.push({
            func: Mu,
            args: [o],
            thisArg: u
          }), new _r(r, this.__chain__).thru(function (t) {
            return e && !t.length && t.push(u), t;
          })) : this.thru(o);
        });
        var $u = ui(function (t, e, n) {
          le.call(t, n) ? ++t[n] : kr(t, n, 1);
        });
        var Bu = hi(_u),
            Wu = hi(gu);

        function Zu(t, e) {
          return (gs(t) ? Ve : zr)(t, Fi(e, 3));
        }

        function Gu(t, e) {
          return (gs(t) ? Je : Mr)(t, Fi(e, 3));
        }

        var Vu = ui(function (t, e, n) {
          le.call(t, n) ? t[n].push(e) : kr(t, n, [e]);
        });
        var Ju = Co(function (t, e, n) {
          var o = -1,
              i = "function" == typeof e,
              u = bs(t) ? r(t.length) : [];
          return zr(t, function (t) {
            u[++o] = i ? Ze(e, t, n) : oo(t, e, n);
          }), u;
        }),
            Xu = ui(function (t, e, n) {
          kr(t, n, e);
        });

        function Ku(t, e) {
          return (gs(t) ? tn : ho)(t, Fi(e, 3));
        }

        var Yu = ui(function (t, e, n) {
          t[n ? 0 : 1].push(e);
        }, function () {
          return [[], []];
        });

        var Qu = Co(function (t, e) {
          if (null == t) return [];
          var n = e.length;
          return n > 1 && Vi(t, e[0], e[1]) ? e = [] : n > 2 && Vi(e[0], e[1], e[2]) && (e = [e[0]]), mo(t, Wr(e, 1), []);
        }),
            ts = Fn || function () {
          return De.Date.now();
        };

        function es(t, e, n) {
          return e = n ? u : e, e = t && null == e ? t.length : e, Si(t, C, u, u, u, u, e);
        }

        function ns(t, e) {
          var n;
          if ("function" != typeof e) throw new ie(c);
          return t = Hs(t), function () {
            return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = u), n;
          };
        }

        var rs = Co(function (t, e, n) {
          var r = g;

          if (n.length) {
            var o = An(n, Ni(rs));
            r |= E;
          }

          return Si(t, r, e, n, o);
        }),
            os = Co(function (t, e, n) {
          var r = g | m;

          if (n.length) {
            var o = An(n, Ni(os));
            r |= E;
          }

          return Si(e, r, t, n, o);
        });

        function is(t, e, n) {
          var r,
              o,
              i,
              s,
              a,
              f,
              l = 0,
              p = !1,
              h = !1,
              d = !0;
          if ("function" != typeof t) throw new ie(c);

          function v(e) {
            var n = r,
                i = o;
            return r = o = u, l = e, s = t.apply(i, n);
          }

          function y(t) {
            var n = t - f;
            return f === u || n >= e || n < 0 || h && t - l >= i;
          }

          function _() {
            var t = ts();
            if (y(t)) return g(t);
            a = iu(_, function (t) {
              var n = e - (t - f);
              return h ? Gn(n, i - (t - l)) : n;
            }(t));
          }

          function g(t) {
            return a = u, d && r ? v(t) : (r = o = u, s);
          }

          function m() {
            var t = ts(),
                n = y(t);

            if (r = arguments, o = this, f = t, n) {
              if (a === u) return function (t) {
                return l = t, a = iu(_, e), p ? v(t) : s;
              }(f);
              if (h) return a = iu(_, e), v(f);
            }

            return a === u && (a = iu(_, e)), s;
          }

          return e = Bs(e) || 0, js(n) && (p = !!n.leading, i = (h = "maxWait" in n) ? Zn(Bs(n.maxWait) || 0, e) : i, d = "trailing" in n ? !!n.trailing : d), m.cancel = function () {
            a !== u && Ko(a), l = 0, r = f = o = a = u;
          }, m.flush = function () {
            return a === u ? s : g(ts());
          }, m;
        }

        var us = Co(function (t, e) {
          return Lr(t, 1, e);
        }),
            ss = Co(function (t, e, n) {
          return Lr(t, Bs(e) || 0, n);
        });

        function as(t, e) {
          if ("function" != typeof t || null != e && "function" != typeof e) throw new ie(c);

          var n = function n() {
            var r = arguments,
                o = e ? e.apply(this, r) : r[0],
                i = n.cache;
            if (i.has(o)) return i.get(o);
            var u = t.apply(this, r);
            return n.cache = i.set(o, u) || i, u;
          };

          return n.cache = new (as.Cache || wr)(), n;
        }

        function cs(t) {
          if ("function" != typeof t) throw new ie(c);
          return function () {
            var e = arguments;

            switch (e.length) {
              case 0:
                return !t.call(this);

              case 1:
                return !t.call(this, e[0]);

              case 2:
                return !t.call(this, e[0], e[1]);

              case 3:
                return !t.call(this, e[0], e[1], e[2]);
            }

            return !t.apply(this, e);
          };
        }

        as.Cache = wr;
        var fs = Jo(function (t, e) {
          var n = (e = 1 == e.length && gs(e[0]) ? tn(e[0], gn(Fi())) : tn(Wr(e, 1), gn(Fi()))).length;
          return Co(function (r) {
            for (var o = -1, i = Gn(r.length, n); ++o < i;) r[o] = e[o].call(this, r[o]);

            return Ze(t, this, r);
          });
        }),
            ls = Co(function (t, e) {
          var n = An(e, Ni(ls));
          return Si(t, E, u, e, n);
        }),
            ps = Co(function (t, e) {
          var n = An(e, Ni(ps));
          return Si(t, O, u, e, n);
        }),
            hs = Pi(function (t, e) {
          return Si(t, S, u, u, u, e);
        });

        function ds(t, e) {
          return t === e || t != t && e != e;
        }

        var vs = wi(to),
            ys = wi(function (t, e) {
          return t >= e;
        }),
            _s = io(function () {
          return arguments;
        }()) ? io : function (t) {
          return As(t) && le.call(t, "callee") && !Ue.call(t, "callee");
        },
            gs = r.isArray,
            ms = ze ? gn(ze) : function (t) {
          return As(t) && Qr(t) == ct;
        };

        function bs(t) {
          return null != t && Ts(t.length) && !Cs(t);
        }

        function ws(t) {
          return As(t) && bs(t);
        }

        var xs = Hn || Ba,
            Es = Me ? gn(Me) : function (t) {
          return As(t) && Qr(t) == Z;
        };

        function Os(t) {
          if (!As(t)) return !1;
          var e = Qr(t);
          return e == V || e == G || "string" == typeof t.message && "string" == typeof t.name && !Rs(t);
        }

        function Cs(t) {
          if (!js(t)) return !1;
          var e = Qr(t);
          return e == J || e == X || e == B || e == et;
        }

        function Ss(t) {
          return "number" == typeof t && t == Hs(t);
        }

        function Ts(t) {
          return "number" == typeof t && t > -1 && t % 1 == 0 && t <= U;
        }

        function js(t) {
          var e = void 0 === t ? "undefined" : i(t);
          return null != t && ("object" == e || "function" == e);
        }

        function As(t) {
          return null != t && "object" == (void 0 === t ? "undefined" : i(t));
        }

        var Is = He ? gn(He) : function (t) {
          return As(t) && $i(t) == K;
        };

        function Ps(t) {
          return "number" == typeof t || As(t) && Qr(t) == Y;
        }

        function Rs(t) {
          if (!As(t) || Qr(t) != tt) return !1;
          var e = Re(t);
          if (null === e) return !0;
          var n = le.call(e, "constructor") && e.constructor;
          return "function" == typeof n && n instanceof n && fe.call(n) == ve;
        }

        var ks = $e ? gn($e) : function (t) {
          return As(t) && Qr(t) == nt;
        };
        var Ds = Be ? gn(Be) : function (t) {
          return As(t) && $i(t) == rt;
        };

        function Us(t) {
          return "string" == typeof t || !gs(t) && As(t) && Qr(t) == ot;
        }

        function Ns(t) {
          return "symbol" == (void 0 === t ? "undefined" : i(t)) || As(t) && Qr(t) == it;
        }

        var Fs = We ? gn(We) : function (t) {
          return As(t) && Ts(t.length) && !!Te[Qr(t)];
        };
        var Ls = wi(po),
            qs = wi(function (t, e) {
          return t <= e;
        });

        function zs(t) {
          if (!t) return [];
          if (bs(t)) return Us(t) ? kn(t) : oi(t);
          if (qe && t[qe]) return function (t) {
            for (var e, n = []; !(e = t.next()).done;) n.push(e.value);

            return n;
          }(t[qe]());
          var e = $i(t);
          return (e == K ? Tn : e == rt ? In : da)(t);
        }

        function Ms(t) {
          return t ? (t = Bs(t)) === D || t === -D ? (t < 0 ? -1 : 1) * N : t == t ? t : 0 : 0 === t ? t : 0;
        }

        function Hs(t) {
          var e = Ms(t),
              n = e % 1;
          return e == e ? n ? e - n : e : 0;
        }

        function $s(t) {
          return t ? Ur(Hs(t), 0, L) : 0;
        }

        function Bs(t) {
          if ("number" == typeof t) return t;
          if (Ns(t)) return F;

          if (js(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = js(e) ? e + "" : e;
          }

          if ("string" != typeof t) return 0 === t ? t : +t;
          t = t.replace(Ut, "");
          var n = Zt.test(t);
          return n || Vt.test(t) ? Pe(t.slice(2), n ? 2 : 8) : Wt.test(t) ? F : +t;
        }

        function Ws(t) {
          return ii(t, ua(t));
        }

        function Zs(t) {
          return null == t ? "" : Lo(t);
        }

        var Gs = si(function (t, e) {
          if (Yi(e) || bs(e)) ii(e, ia(e), t);else for (var n in e) le.call(e, n) && Ar(t, n, e[n]);
        }),
            Vs = si(function (t, e) {
          ii(e, ua(e), t);
        }),
            Js = si(function (t, e, n, r) {
          ii(e, ua(e), t, r);
        }),
            Xs = si(function (t, e, n, r) {
          ii(e, ia(e), t, r);
        }),
            Ks = Pi(Dr);
        var Ys = Co(function (t, e) {
          t = ne(t);
          var n = -1,
              r = e.length,
              o = r > 2 ? e[2] : u;

          for (o && Vi(e[0], e[1], o) && (r = 1); ++n < r;) for (var i = e[n], s = ua(i), a = -1, c = s.length; ++a < c;) {
            var f = s[a],
                l = t[f];
            (l === u || ds(l, ae[f]) && !le.call(t, f)) && (t[f] = i[f]);
          }

          return t;
        }),
            Qs = Co(function (t) {
          return t.push(u, ji), Ze(aa, u, t);
        });

        function ta(t, e, n) {
          var r = null == t ? u : Kr(t, e);
          return r === u ? n : r;
        }

        function ea(t, e) {
          return null != t && Bi(t, e, no);
        }

        var na = yi(function (t, e, n) {
          null != e && "function" != typeof e.toString && (e = de.call(e)), t[e] = n;
        }, ja(Pa)),
            ra = yi(function (t, e, n) {
          null != e && "function" != typeof e.toString && (e = de.call(e)), le.call(t, e) ? t[e].push(n) : t[e] = [n];
        }, Fi),
            oa = Co(oo);

        function ia(t) {
          return bs(t) ? Or(t) : fo(t);
        }

        function ua(t) {
          return bs(t) ? Or(t, !0) : lo(t);
        }

        var sa = si(function (t, e, n) {
          _o(t, e, n);
        }),
            aa = si(function (t, e, n, r) {
          _o(t, e, n, r);
        }),
            ca = Pi(function (t, e) {
          var n = {};
          if (null == t) return n;
          var r = !1;
          e = tn(e, function (e) {
            return e = Vo(e, t), r || (r = e.length > 1), e;
          }), ii(t, ki(t), n), r && (n = Nr(n, h | d | v, Ai));

          for (var o = e.length; o--;) zo(n, e[o]);

          return n;
        });
        var fa = Pi(function (t, e) {
          return null == t ? {} : function (t, e) {
            return bo(t, e, function (e, n) {
              return ea(t, n);
            });
          }(t, e);
        });

        function la(t, e) {
          if (null == t) return {};
          var n = tn(ki(t), function (t) {
            return [t];
          });
          return e = Fi(e), bo(t, n, function (t, n) {
            return e(t, n[0]);
          });
        }

        var pa = Ci(ia),
            ha = Ci(ua);

        function da(t) {
          return null == t ? [] : mn(t, ia(t));
        }

        var va = li(function (t, e, n) {
          return e = e.toLowerCase(), t + (n ? ya(e) : e);
        });

        function ya(t) {
          return Oa(Zs(t).toLowerCase());
        }

        function _a(t) {
          return (t = Zs(t)) && t.replace(Xt, En).replace(be, "");
        }

        var ga = li(function (t, e, n) {
          return t + (n ? "-" : "") + e.toLowerCase();
        }),
            ma = li(function (t, e, n) {
          return t + (n ? " " : "") + e.toLowerCase();
        }),
            ba = fi("toLowerCase");
        var wa = li(function (t, e, n) {
          return t + (n ? "_" : "") + e.toLowerCase();
        });
        var xa = li(function (t, e, n) {
          return t + (n ? " " : "") + Oa(e);
        });
        var Ea = li(function (t, e, n) {
          return t + (n ? " " : "") + e.toUpperCase();
        }),
            Oa = fi("toUpperCase");

        function Ca(t, e, n) {
          return t = Zs(t), (e = n ? u : e) === u ? function (t) {
            return Oe.test(t);
          }(t) ? function (t) {
            return t.match(xe) || [];
          }(t) : function (t) {
            return t.match(Mt) || [];
          }(t) : t.match(e) || [];
        }

        var Sa = Co(function (t, e) {
          try {
            return Ze(t, u, e);
          } catch (t) {
            return Os(t) ? t : new Qt(t);
          }
        }),
            Ta = Pi(function (t, e) {
          return Ve(e, function (e) {
            e = lu(e), kr(t, e, rs(t[e], t));
          }), t;
        });

        function ja(t) {
          return function () {
            return t;
          };
        }

        var Aa = di(),
            Ia = di(!0);

        function Pa(t) {
          return t;
        }

        function Ra(t) {
          return co("function" == typeof t ? t : Nr(t, h));
        }

        var ka = Co(function (t, e) {
          return function (n) {
            return oo(n, t, e);
          };
        }),
            Da = Co(function (t, e) {
          return function (n) {
            return oo(t, n, e);
          };
        });

        function Ua(t, e, n) {
          var r = ia(e),
              o = Xr(e, r);
          null != n || js(e) && (o.length || !r.length) || (n = e, e = t, t = this, o = Xr(e, ia(e)));
          var i = !(js(n) && "chain" in n && !n.chain),
              u = Cs(t);
          return Ve(o, function (n) {
            var r = e[n];
            t[n] = r, u && (t.prototype[n] = function () {
              var e = this.__chain__;

              if (i || e) {
                var n = t(this.__wrapped__);
                return (n.__actions__ = oi(this.__actions__)).push({
                  func: r,
                  args: arguments,
                  thisArg: t
                }), n.__chain__ = e, n;
              }

              return r.apply(t, en([this.value()], arguments));
            });
          }), t;
        }

        function Na() {}

        var Fa = gi(tn),
            La = gi(Xe),
            qa = gi(on);

        function za(t) {
          return Ji(t) ? hn(lu(t)) : function (t) {
            return function (e) {
              return Kr(e, t);
            };
          }(t);
        }

        var Ma = bi(),
            Ha = bi(!0);

        function $a() {
          return [];
        }

        function Ba() {
          return !1;
        }

        var Wa = _i(function (t, e) {
          return t + e;
        }, 0),
            Za = Ei("ceil"),
            Ga = _i(function (t, e) {
          return t / e;
        }, 1),
            Va = Ei("floor");

        var Ja,
            Xa = _i(function (t, e) {
          return t * e;
        }, 1),
            Ka = Ei("round"),
            Ya = _i(function (t, e) {
          return t - e;
        }, 0);

        return dr.after = function (t, e) {
          if ("function" != typeof e) throw new ie(c);
          return t = Hs(t), function () {
            if (--t < 1) return e.apply(this, arguments);
          };
        }, dr.ary = es, dr.assign = Gs, dr.assignIn = Vs, dr.assignInWith = Js, dr.assignWith = Xs, dr.at = Ks, dr.before = ns, dr.bind = rs, dr.bindAll = Ta, dr.bindKey = os, dr.castArray = function () {
          if (!arguments.length) return [];
          var t = arguments[0];
          return gs(t) ? t : [t];
        }, dr.chain = zu, dr.chunk = function (t, e, n) {
          e = (n ? Vi(t, e, n) : e === u) ? 1 : Zn(Hs(e), 0);
          var o = null == t ? 0 : t.length;
          if (!o || e < 1) return [];

          for (var i = 0, s = 0, a = r(qn(o / e)); i < o;) a[s++] = Ro(t, i, i += e);

          return a;
        }, dr.compact = function (t) {
          for (var e = -1, n = null == t ? 0 : t.length, r = 0, o = []; ++e < n;) {
            var i = t[e];
            i && (o[r++] = i);
          }

          return o;
        }, dr.concat = function () {
          var t = arguments.length;
          if (!t) return [];

          for (var e = r(t - 1), n = arguments[0], o = t; o--;) e[o - 1] = arguments[o];

          return en(gs(n) ? oi(n) : [n], Wr(e, 1));
        }, dr.cond = function (t) {
          var e = null == t ? 0 : t.length,
              n = Fi();
          return t = e ? tn(t, function (t) {
            if ("function" != typeof t[1]) throw new ie(c);
            return [n(t[0]), t[1]];
          }) : [], Co(function (n) {
            for (var r = -1; ++r < e;) {
              var o = t[r];
              if (Ze(o[0], this, n)) return Ze(o[1], this, n);
            }
          });
        }, dr.conforms = function (t) {
          return function (t) {
            var e = ia(t);
            return function (n) {
              return Fr(n, t, e);
            };
          }(Nr(t, h));
        }, dr.constant = ja, dr.countBy = $u, dr.create = function (t, e) {
          var n = vr(t);
          return null == e ? n : Rr(n, e);
        }, dr.curry = function t(e, n, r) {
          var o = Si(e, w, u, u, u, u, u, n = r ? u : n);
          return o.placeholder = t.placeholder, o;
        }, dr.curryRight = function t(e, n, r) {
          var o = Si(e, x, u, u, u, u, u, n = r ? u : n);
          return o.placeholder = t.placeholder, o;
        }, dr.debounce = is, dr.defaults = Ys, dr.defaultsDeep = Qs, dr.defer = us, dr.delay = ss, dr.difference = du, dr.differenceBy = vu, dr.differenceWith = yu, dr.drop = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          return r ? Ro(t, (e = n || e === u ? 1 : Hs(e)) < 0 ? 0 : e, r) : [];
        }, dr.dropRight = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          return r ? Ro(t, 0, (e = r - (e = n || e === u ? 1 : Hs(e))) < 0 ? 0 : e) : [];
        }, dr.dropRightWhile = function (t, e) {
          return t && t.length ? Ho(t, Fi(e, 3), !0, !0) : [];
        }, dr.dropWhile = function (t, e) {
          return t && t.length ? Ho(t, Fi(e, 3), !0) : [];
        }, dr.fill = function (t, e, n, r) {
          var o = null == t ? 0 : t.length;
          return o ? (n && "number" != typeof n && Vi(t, e, n) && (n = 0, r = o), function (t, e, n, r) {
            var o = t.length;

            for ((n = Hs(n)) < 0 && (n = -n > o ? 0 : o + n), (r = r === u || r > o ? o : Hs(r)) < 0 && (r += o), r = n > r ? 0 : $s(r); n < r;) t[n++] = e;

            return t;
          }(t, e, n, r)) : [];
        }, dr.filter = function (t, e) {
          return (gs(t) ? Ke : Br)(t, Fi(e, 3));
        }, dr.flatMap = function (t, e) {
          return Wr(Ku(t, e), 1);
        }, dr.flatMapDeep = function (t, e) {
          return Wr(Ku(t, e), D);
        }, dr.flatMapDepth = function (t, e, n) {
          return n = n === u ? 1 : Hs(n), Wr(Ku(t, e), n);
        }, dr.flatten = mu, dr.flattenDeep = function (t) {
          return null != t && t.length ? Wr(t, D) : [];
        }, dr.flattenDepth = function (t, e) {
          return null != t && t.length ? Wr(t, e = e === u ? 1 : Hs(e)) : [];
        }, dr.flip = function (t) {
          return Si(t, T);
        }, dr.flow = Aa, dr.flowRight = Ia, dr.fromPairs = function (t) {
          for (var e = -1, n = null == t ? 0 : t.length, r = {}; ++e < n;) {
            var o = t[e];
            r[o[0]] = o[1];
          }

          return r;
        }, dr.functions = function (t) {
          return null == t ? [] : Xr(t, ia(t));
        }, dr.functionsIn = function (t) {
          return null == t ? [] : Xr(t, ua(t));
        }, dr.groupBy = Vu, dr.initial = function (t) {
          return null != t && t.length ? Ro(t, 0, -1) : [];
        }, dr.intersection = wu, dr.intersectionBy = xu, dr.intersectionWith = Eu, dr.invert = na, dr.invertBy = ra, dr.invokeMap = Ju, dr.iteratee = Ra, dr.keyBy = Xu, dr.keys = ia, dr.keysIn = ua, dr.map = Ku, dr.mapKeys = function (t, e) {
          var n = {};
          return e = Fi(e, 3), Vr(t, function (t, r, o) {
            kr(n, e(t, r, o), t);
          }), n;
        }, dr.mapValues = function (t, e) {
          var n = {};
          return e = Fi(e, 3), Vr(t, function (t, r, o) {
            kr(n, r, e(t, r, o));
          }), n;
        }, dr.matches = function (t) {
          return vo(Nr(t, h));
        }, dr.matchesProperty = function (t, e) {
          return yo(t, Nr(e, h));
        }, dr.memoize = as, dr.merge = sa, dr.mergeWith = aa, dr.method = ka, dr.methodOf = Da, dr.mixin = Ua, dr.negate = cs, dr.nthArg = function (t) {
          return t = Hs(t), Co(function (e) {
            return go(e, t);
          });
        }, dr.omit = ca, dr.omitBy = function (t, e) {
          return la(t, cs(Fi(e)));
        }, dr.once = function (t) {
          return ns(2, t);
        }, dr.orderBy = function (t, e, n, r) {
          return null == t ? [] : (gs(e) || (e = null == e ? [] : [e]), gs(n = r ? u : n) || (n = null == n ? [] : [n]), mo(t, e, n));
        }, dr.over = Fa, dr.overArgs = fs, dr.overEvery = La, dr.overSome = qa, dr.partial = ls, dr.partialRight = ps, dr.partition = Yu, dr.pick = fa, dr.pickBy = la, dr.property = za, dr.propertyOf = function (t) {
          return function (e) {
            return null == t ? u : Kr(t, e);
          };
        }, dr.pull = Cu, dr.pullAll = Su, dr.pullAllBy = function (t, e, n) {
          return t && t.length && e && e.length ? wo(t, e, Fi(n, 2)) : t;
        }, dr.pullAllWith = function (t, e, n) {
          return t && t.length && e && e.length ? wo(t, e, u, n) : t;
        }, dr.pullAt = Tu, dr.range = Ma, dr.rangeRight = Ha, dr.rearg = hs, dr.reject = function (t, e) {
          return (gs(t) ? Ke : Br)(t, cs(Fi(e, 3)));
        }, dr.remove = function (t, e) {
          var n = [];
          if (!t || !t.length) return n;
          var r = -1,
              o = [],
              i = t.length;

          for (e = Fi(e, 3); ++r < i;) {
            var u = t[r];
            e(u, r, t) && (n.push(u), o.push(r));
          }

          return xo(t, o), n;
        }, dr.rest = function (t, e) {
          if ("function" != typeof t) throw new ie(c);
          return Co(t, e = e === u ? e : Hs(e));
        }, dr.reverse = ju, dr.sampleSize = function (t, e, n) {
          return e = (n ? Vi(t, e, n) : e === u) ? 1 : Hs(e), (gs(t) ? Sr : To)(t, e);
        }, dr.set = function (t, e, n) {
          return null == t ? t : jo(t, e, n);
        }, dr.setWith = function (t, e, n, r) {
          return r = "function" == typeof r ? r : u, null == t ? t : jo(t, e, n, r);
        }, dr.shuffle = function (t) {
          return (gs(t) ? Tr : Po)(t);
        }, dr.slice = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          return r ? (n && "number" != typeof n && Vi(t, e, n) ? (e = 0, n = r) : (e = null == e ? 0 : Hs(e), n = n === u ? r : Hs(n)), Ro(t, e, n)) : [];
        }, dr.sortBy = Qu, dr.sortedUniq = function (t) {
          return t && t.length ? No(t) : [];
        }, dr.sortedUniqBy = function (t, e) {
          return t && t.length ? No(t, Fi(e, 2)) : [];
        }, dr.split = function (t, e, n) {
          return n && "number" != typeof n && Vi(t, e, n) && (e = n = u), (n = n === u ? L : n >>> 0) ? (t = Zs(t)) && ("string" == typeof e || null != e && !ks(e)) && !(e = Lo(e)) && Sn(t) ? Xo(kn(t), 0, n) : t.split(e, n) : [];
        }, dr.spread = function (t, e) {
          if ("function" != typeof t) throw new ie(c);
          return e = null == e ? 0 : Zn(Hs(e), 0), Co(function (n) {
            var r = n[e],
                o = Xo(n, 0, e);
            return r && en(o, r), Ze(t, this, o);
          });
        }, dr.tail = function (t) {
          var e = null == t ? 0 : t.length;
          return e ? Ro(t, 1, e) : [];
        }, dr.take = function (t, e, n) {
          return t && t.length ? Ro(t, 0, (e = n || e === u ? 1 : Hs(e)) < 0 ? 0 : e) : [];
        }, dr.takeRight = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          return r ? Ro(t, (e = r - (e = n || e === u ? 1 : Hs(e))) < 0 ? 0 : e, r) : [];
        }, dr.takeRightWhile = function (t, e) {
          return t && t.length ? Ho(t, Fi(e, 3), !1, !0) : [];
        }, dr.takeWhile = function (t, e) {
          return t && t.length ? Ho(t, Fi(e, 3)) : [];
        }, dr.tap = function (t, e) {
          return e(t), t;
        }, dr.throttle = function (t, e, n) {
          var r = !0,
              o = !0;
          if ("function" != typeof t) throw new ie(c);
          return js(n) && (r = "leading" in n ? !!n.leading : r, o = "trailing" in n ? !!n.trailing : o), is(t, e, {
            leading: r,
            maxWait: e,
            trailing: o
          });
        }, dr.thru = Mu, dr.toArray = zs, dr.toPairs = pa, dr.toPairsIn = ha, dr.toPath = function (t) {
          return gs(t) ? tn(t, lu) : Ns(t) ? [t] : oi(fu(Zs(t)));
        }, dr.toPlainObject = Ws, dr.transform = function (t, e, n) {
          var r = gs(t),
              o = r || xs(t) || Fs(t);

          if (e = Fi(e, 4), null == n) {
            var i = t && t.constructor;
            n = o ? r ? new i() : [] : js(t) && Cs(i) ? vr(Re(t)) : {};
          }

          return (o ? Ve : Vr)(t, function (t, r, o) {
            return e(n, t, r, o);
          }), n;
        }, dr.unary = function (t) {
          return es(t, 1);
        }, dr.union = Au, dr.unionBy = Iu, dr.unionWith = Pu, dr.uniq = function (t) {
          return t && t.length ? qo(t) : [];
        }, dr.uniqBy = function (t, e) {
          return t && t.length ? qo(t, Fi(e, 2)) : [];
        }, dr.uniqWith = function (t, e) {
          return e = "function" == typeof e ? e : u, t && t.length ? qo(t, u, e) : [];
        }, dr.unset = function (t, e) {
          return null == t || zo(t, e);
        }, dr.unzip = Ru, dr.unzipWith = ku, dr.update = function (t, e, n) {
          return null == t ? t : Mo(t, e, Go(n));
        }, dr.updateWith = function (t, e, n, r) {
          return r = "function" == typeof r ? r : u, null == t ? t : Mo(t, e, Go(n), r);
        }, dr.values = da, dr.valuesIn = function (t) {
          return null == t ? [] : mn(t, ua(t));
        }, dr.without = Du, dr.words = Ca, dr.wrap = function (t, e) {
          return ls(Go(e), t);
        }, dr.xor = Uu, dr.xorBy = Nu, dr.xorWith = Fu, dr.zip = Lu, dr.zipObject = function (t, e) {
          return Wo(t || [], e || [], Ar);
        }, dr.zipObjectDeep = function (t, e) {
          return Wo(t || [], e || [], jo);
        }, dr.zipWith = qu, dr.entries = pa, dr.entriesIn = ha, dr.extend = Vs, dr.extendWith = Js, Ua(dr, dr), dr.add = Wa, dr.attempt = Sa, dr.camelCase = va, dr.capitalize = ya, dr.ceil = Za, dr.clamp = function (t, e, n) {
          return n === u && (n = e, e = u), n !== u && (n = (n = Bs(n)) == n ? n : 0), e !== u && (e = (e = Bs(e)) == e ? e : 0), Ur(Bs(t), e, n);
        }, dr.clone = function (t) {
          return Nr(t, v);
        }, dr.cloneDeep = function (t) {
          return Nr(t, h | v);
        }, dr.cloneDeepWith = function (t, e) {
          return Nr(t, h | v, e = "function" == typeof e ? e : u);
        }, dr.cloneWith = function (t, e) {
          return Nr(t, v, e = "function" == typeof e ? e : u);
        }, dr.conformsTo = function (t, e) {
          return null == e || Fr(t, e, ia(e));
        }, dr.deburr = _a, dr.defaultTo = function (t, e) {
          return null == t || t != t ? e : t;
        }, dr.divide = Ga, dr.endsWith = function (t, e, n) {
          t = Zs(t), e = Lo(e);
          var r = t.length,
              o = n = n === u ? r : Ur(Hs(n), 0, r);
          return (n -= e.length) >= 0 && t.slice(n, o) == e;
        }, dr.eq = ds, dr.escape = function (t) {
          return (t = Zs(t)) && St.test(t) ? t.replace(Ot, On) : t;
        }, dr.escapeRegExp = function (t) {
          return (t = Zs(t)) && Dt.test(t) ? t.replace(kt, "\\$&") : t;
        }, dr.every = function (t, e, n) {
          var r = gs(t) ? Xe : Hr;
          return n && Vi(t, e, n) && (e = u), r(t, Fi(e, 3));
        }, dr.find = Bu, dr.findIndex = _u, dr.findKey = function (t, e) {
          return sn(t, Fi(e, 3), Vr);
        }, dr.findLast = Wu, dr.findLastIndex = gu, dr.findLastKey = function (t, e) {
          return sn(t, Fi(e, 3), Jr);
        }, dr.floor = Va, dr.forEach = Zu, dr.forEachRight = Gu, dr.forIn = function (t, e) {
          return null == t ? t : Zr(t, Fi(e, 3), ua);
        }, dr.forInRight = function (t, e) {
          return null == t ? t : Gr(t, Fi(e, 3), ua);
        }, dr.forOwn = function (t, e) {
          return t && Vr(t, Fi(e, 3));
        }, dr.forOwnRight = function (t, e) {
          return t && Jr(t, Fi(e, 3));
        }, dr.get = ta, dr.gt = vs, dr.gte = ys, dr.has = function (t, e) {
          return null != t && Bi(t, e, eo);
        }, dr.hasIn = ea, dr.head = bu, dr.identity = Pa, dr.includes = function (t, e, n, r) {
          t = bs(t) ? t : da(t), n = n && !r ? Hs(n) : 0;
          var o = t.length;
          return n < 0 && (n = Zn(o + n, 0)), Us(t) ? n <= o && t.indexOf(e, n) > -1 : !!o && cn(t, e, n) > -1;
        }, dr.indexOf = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          if (!r) return -1;
          var o = null == n ? 0 : Hs(n);
          return o < 0 && (o = Zn(r + o, 0)), cn(t, e, o);
        }, dr.inRange = function (t, e, n) {
          return e = Ms(e), n === u ? (n = e, e = 0) : n = Ms(n), function (t, e, n) {
            return t >= Gn(e, n) && t < Zn(e, n);
          }(t = Bs(t), e, n);
        }, dr.invoke = oa, dr.isArguments = _s, dr.isArray = gs, dr.isArrayBuffer = ms, dr.isArrayLike = bs, dr.isArrayLikeObject = ws, dr.isBoolean = function (t) {
          return !0 === t || !1 === t || As(t) && Qr(t) == W;
        }, dr.isBuffer = xs, dr.isDate = Es, dr.isElement = function (t) {
          return As(t) && 1 === t.nodeType && !Rs(t);
        }, dr.isEmpty = function (t) {
          if (null == t) return !0;
          if (bs(t) && (gs(t) || "string" == typeof t || "function" == typeof t.splice || xs(t) || Fs(t) || _s(t))) return !t.length;
          var e = $i(t);
          if (e == K || e == rt) return !t.size;
          if (Yi(t)) return !fo(t).length;

          for (var n in t) if (le.call(t, n)) return !1;

          return !0;
        }, dr.isEqual = function (t, e) {
          return uo(t, e);
        }, dr.isEqualWith = function (t, e, n) {
          var r = (n = "function" == typeof n ? n : u) ? n(t, e) : u;
          return r === u ? uo(t, e, u, n) : !!r;
        }, dr.isError = Os, dr.isFinite = function (t) {
          return "number" == typeof t && $n(t);
        }, dr.isFunction = Cs, dr.isInteger = Ss, dr.isLength = Ts, dr.isMap = Is, dr.isMatch = function (t, e) {
          return t === e || so(t, e, qi(e));
        }, dr.isMatchWith = function (t, e, n) {
          return n = "function" == typeof n ? n : u, so(t, e, qi(e), n);
        }, dr.isNaN = function (t) {
          return Ps(t) && t != +t;
        }, dr.isNative = function (t) {
          if (Ki(t)) throw new Qt(a);
          return ao(t);
        }, dr.isNil = function (t) {
          return null == t;
        }, dr.isNull = function (t) {
          return null === t;
        }, dr.isNumber = Ps, dr.isObject = js, dr.isObjectLike = As, dr.isPlainObject = Rs, dr.isRegExp = ks, dr.isSafeInteger = function (t) {
          return Ss(t) && t >= -U && t <= U;
        }, dr.isSet = Ds, dr.isString = Us, dr.isSymbol = Ns, dr.isTypedArray = Fs, dr.isUndefined = function (t) {
          return t === u;
        }, dr.isWeakMap = function (t) {
          return As(t) && $i(t) == st;
        }, dr.isWeakSet = function (t) {
          return As(t) && Qr(t) == at;
        }, dr.join = function (t, e) {
          return null == t ? "" : Bn.call(t, e);
        }, dr.kebabCase = ga, dr.last = Ou, dr.lastIndexOf = function (t, e, n) {
          var r = null == t ? 0 : t.length;
          if (!r) return -1;
          var o = r;
          return n !== u && (o = (o = Hs(n)) < 0 ? Zn(r + o, 0) : Gn(o, r - 1)), e == e ? function (t, e, n) {
            for (var r = n + 1; r--;) if (t[r] === e) return r;

            return r;
          }(t, e, o) : an(t, ln, o, !0);
        }, dr.lowerCase = ma, dr.lowerFirst = ba, dr.lt = Ls, dr.lte = qs, dr.max = function (t) {
          return t && t.length ? $r(t, Pa, to) : u;
        }, dr.maxBy = function (t, e) {
          return t && t.length ? $r(t, Fi(e, 2), to) : u;
        }, dr.mean = function (t) {
          return pn(t, Pa);
        }, dr.meanBy = function (t, e) {
          return pn(t, Fi(e, 2));
        }, dr.min = function (t) {
          return t && t.length ? $r(t, Pa, po) : u;
        }, dr.minBy = function (t, e) {
          return t && t.length ? $r(t, Fi(e, 2), po) : u;
        }, dr.stubArray = $a, dr.stubFalse = Ba, dr.stubObject = function () {
          return {};
        }, dr.stubString = function () {
          return "";
        }, dr.stubTrue = function () {
          return !0;
        }, dr.multiply = Xa, dr.nth = function (t, e) {
          return t && t.length ? go(t, Hs(e)) : u;
        }, dr.noConflict = function () {
          return De._ === this && (De._ = ye), this;
        }, dr.noop = Na, dr.now = ts, dr.pad = function (t, e, n) {
          t = Zs(t);
          var r = (e = Hs(e)) ? Rn(t) : 0;
          if (!e || r >= e) return t;
          var o = (e - r) / 2;
          return mi(zn(o), n) + t + mi(qn(o), n);
        }, dr.padEnd = function (t, e, n) {
          t = Zs(t);
          var r = (e = Hs(e)) ? Rn(t) : 0;
          return e && r < e ? t + mi(e - r, n) : t;
        }, dr.padStart = function (t, e, n) {
          t = Zs(t);
          var r = (e = Hs(e)) ? Rn(t) : 0;
          return e && r < e ? mi(e - r, n) + t : t;
        }, dr.parseInt = function (t, e, n) {
          return n || null == e ? e = 0 : e && (e = +e), Jn(Zs(t).replace(Nt, ""), e || 0);
        }, dr.random = function (t, e, n) {
          if (n && "boolean" != typeof n && Vi(t, e, n) && (e = n = u), n === u && ("boolean" == typeof e ? (n = e, e = u) : "boolean" == typeof t && (n = t, t = u)), t === u && e === u ? (t = 0, e = 1) : (t = Ms(t), e === u ? (e = t, t = 0) : e = Ms(e)), t > e) {
            var r = t;
            t = e, e = r;
          }

          if (n || t % 1 || e % 1) {
            var o = Xn();
            return Gn(t + o * (e - t + Ie("1e-" + ((o + "").length - 1))), e);
          }

          return Eo(t, e);
        }, dr.reduce = function (t, e, n) {
          var r = gs(t) ? nn : vn,
              o = arguments.length < 3;
          return r(t, Fi(e, 4), n, o, zr);
        }, dr.reduceRight = function (t, e, n) {
          var r = gs(t) ? rn : vn,
              o = arguments.length < 3;
          return r(t, Fi(e, 4), n, o, Mr);
        }, dr.repeat = function (t, e, n) {
          return e = (n ? Vi(t, e, n) : e === u) ? 1 : Hs(e), Oo(Zs(t), e);
        }, dr.replace = function () {
          var t = arguments,
              e = Zs(t[0]);
          return t.length < 3 ? e : e.replace(t[1], t[2]);
        }, dr.result = function (t, e, n) {
          var r = -1,
              o = (e = Vo(e, t)).length;

          for (o || (o = 1, t = u); ++r < o;) {
            var i = null == t ? u : t[lu(e[r])];
            i === u && (r = o, i = n), t = Cs(i) ? i.call(t) : i;
          }

          return t;
        }, dr.round = Ka, dr.runInContext = t, dr.sample = function (t) {
          return (gs(t) ? Cr : So)(t);
        }, dr.size = function (t) {
          if (null == t) return 0;
          if (bs(t)) return Us(t) ? Rn(t) : t.length;
          var e = $i(t);
          return e == K || e == rt ? t.size : fo(t).length;
        }, dr.snakeCase = wa, dr.some = function (t, e, n) {
          var r = gs(t) ? on : ko;
          return n && Vi(t, e, n) && (e = u), r(t, Fi(e, 3));
        }, dr.sortedIndex = function (t, e) {
          return Do(t, e);
        }, dr.sortedIndexBy = function (t, e, n) {
          return Uo(t, e, Fi(n, 2));
        }, dr.sortedIndexOf = function (t, e) {
          var n = null == t ? 0 : t.length;

          if (n) {
            var r = Do(t, e);
            if (r < n && ds(t[r], e)) return r;
          }

          return -1;
        }, dr.sortedLastIndex = function (t, e) {
          return Do(t, e, !0);
        }, dr.sortedLastIndexBy = function (t, e, n) {
          return Uo(t, e, Fi(n, 2), !0);
        }, dr.sortedLastIndexOf = function (t, e) {
          if (null != t && t.length) {
            var n = Do(t, e, !0) - 1;
            if (ds(t[n], e)) return n;
          }

          return -1;
        }, dr.startCase = xa, dr.startsWith = function (t, e, n) {
          return t = Zs(t), n = null == n ? 0 : Ur(Hs(n), 0, t.length), e = Lo(e), t.slice(n, n + e.length) == e;
        }, dr.subtract = Ya, dr.sum = function (t) {
          return t && t.length ? yn(t, Pa) : 0;
        }, dr.sumBy = function (t, e) {
          return t && t.length ? yn(t, Fi(e, 2)) : 0;
        }, dr.template = function (t, e, n) {
          var r = dr.templateSettings;
          n && Vi(t, e, n) && (e = u), t = Zs(t), e = Js({}, e, r, Ti);
          var o,
              i,
              s = Js({}, e.imports, r.imports, Ti),
              a = ia(s),
              c = mn(s, a),
              f = 0,
              l = e.interpolate || Kt,
              p = "__p += '",
              h = re((e.escape || Kt).source + "|" + l.source + "|" + (l === At ? $t : Kt).source + "|" + (e.evaluate || Kt).source + "|$", "g"),
              d = "//# sourceURL=" + ("sourceURL" in e ? e.sourceURL : "lodash.templateSources[" + ++Se + "]") + "\n";
          t.replace(h, function (e, n, r, u, s, a) {
            return r || (r = u), p += t.slice(f, a).replace(Yt, Cn), n && (o = !0, p += "' +\n__e(" + n + ") +\n'"), s && (i = !0, p += "';\n" + s + ";\n__p += '"), r && (p += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"), f = a + e.length, e;
          }), p += "';\n";
          var v = e.variable;
          v || (p = "with (obj) {\n" + p + "\n}\n"), p = (i ? p.replace(bt, "") : p).replace(wt, "$1").replace(xt, "$1;"), p = "function(" + (v || "obj") + ") {\n" + (v ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (i ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + p + "return __p\n}";
          var y = Sa(function () {
            return te(a, d + "return " + p).apply(u, c);
          });
          if (y.source = p, Os(y)) throw y;
          return y;
        }, dr.times = function (t, e) {
          if ((t = Hs(t)) < 1 || t > U) return [];
          var n = L,
              r = Gn(t, L);
          e = Fi(e), t -= L;

          for (var o = _n(r, e); ++n < t;) e(n);

          return o;
        }, dr.toFinite = Ms, dr.toInteger = Hs, dr.toLength = $s, dr.toLower = function (t) {
          return Zs(t).toLowerCase();
        }, dr.toNumber = Bs, dr.toSafeInteger = function (t) {
          return t ? Ur(Hs(t), -U, U) : 0 === t ? t : 0;
        }, dr.toString = Zs, dr.toUpper = function (t) {
          return Zs(t).toUpperCase();
        }, dr.trim = function (t, e, n) {
          if ((t = Zs(t)) && (n || e === u)) return t.replace(Ut, "");
          if (!t || !(e = Lo(e))) return t;
          var r = kn(t),
              o = kn(e);
          return Xo(r, wn(r, o), xn(r, o) + 1).join("");
        }, dr.trimEnd = function (t, e, n) {
          if ((t = Zs(t)) && (n || e === u)) return t.replace(Ft, "");
          if (!t || !(e = Lo(e))) return t;
          var r = kn(t);
          return Xo(r, 0, xn(r, kn(e)) + 1).join("");
        }, dr.trimStart = function (t, e, n) {
          if ((t = Zs(t)) && (n || e === u)) return t.replace(Nt, "");
          if (!t || !(e = Lo(e))) return t;
          var r = kn(t);
          return Xo(r, wn(r, kn(e))).join("");
        }, dr.truncate = function (t, e) {
          var n = j,
              r = A;

          if (js(e)) {
            var o = "separator" in e ? e.separator : o;
            n = "length" in e ? Hs(e.length) : n, r = "omission" in e ? Lo(e.omission) : r;
          }

          var i = (t = Zs(t)).length;

          if (Sn(t)) {
            var s = kn(t);
            i = s.length;
          }

          if (n >= i) return t;
          var a = n - Rn(r);
          if (a < 1) return r;
          var c = s ? Xo(s, 0, a).join("") : t.slice(0, a);
          if (o === u) return c + r;

          if (s && (a += c.length - a), ks(o)) {
            if (t.slice(a).search(o)) {
              var f,
                  l = c;

              for (o.global || (o = re(o.source, Zs(Bt.exec(o)) + "g")), o.lastIndex = 0; f = o.exec(l);) var p = f.index;

              c = c.slice(0, p === u ? a : p);
            }
          } else if (t.indexOf(Lo(o), a) != a) {
            var h = c.lastIndexOf(o);
            h > -1 && (c = c.slice(0, h));
          }

          return c + r;
        }, dr.unescape = function (t) {
          return (t = Zs(t)) && Ct.test(t) ? t.replace(Et, Dn) : t;
        }, dr.uniqueId = function (t) {
          var e = ++pe;
          return Zs(t) + e;
        }, dr.upperCase = Ea, dr.upperFirst = Oa, dr.each = Zu, dr.eachRight = Gu, dr.first = bu, Ua(dr, (Ja = {}, Vr(dr, function (t, e) {
          le.call(dr.prototype, e) || (Ja[e] = t);
        }), Ja), {
          chain: !1
        }), dr.VERSION = "4.17.11", Ve(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (t) {
          dr[t].placeholder = dr;
        }), Ve(["drop", "take"], function (t, e) {
          gr.prototype[t] = function (n) {
            n = n === u ? 1 : Zn(Hs(n), 0);
            var r = this.__filtered__ && !e ? new gr(this) : this.clone();
            return r.__filtered__ ? r.__takeCount__ = Gn(n, r.__takeCount__) : r.__views__.push({
              size: Gn(n, L),
              type: t + (r.__dir__ < 0 ? "Right" : "")
            }), r;
          }, gr.prototype[t + "Right"] = function (e) {
            return this.reverse()[t](e).reverse();
          };
        }), Ve(["filter", "map", "takeWhile"], function (t, e) {
          var n = e + 1,
              r = n == R || 3 == n;

          gr.prototype[t] = function (t) {
            var e = this.clone();
            return e.__iteratees__.push({
              iteratee: Fi(t, 3),
              type: n
            }), e.__filtered__ = e.__filtered__ || r, e;
          };
        }), Ve(["head", "last"], function (t, e) {
          var n = "take" + (e ? "Right" : "");

          gr.prototype[t] = function () {
            return this[n](1).value()[0];
          };
        }), Ve(["initial", "tail"], function (t, e) {
          var n = "drop" + (e ? "" : "Right");

          gr.prototype[t] = function () {
            return this.__filtered__ ? new gr(this) : this[n](1);
          };
        }), gr.prototype.compact = function () {
          return this.filter(Pa);
        }, gr.prototype.find = function (t) {
          return this.filter(t).head();
        }, gr.prototype.findLast = function (t) {
          return this.reverse().find(t);
        }, gr.prototype.invokeMap = Co(function (t, e) {
          return "function" == typeof t ? new gr(this) : this.map(function (n) {
            return oo(n, t, e);
          });
        }), gr.prototype.reject = function (t) {
          return this.filter(cs(Fi(t)));
        }, gr.prototype.slice = function (t, e) {
          t = Hs(t);
          var n = this;
          return n.__filtered__ && (t > 0 || e < 0) ? new gr(n) : (t < 0 ? n = n.takeRight(-t) : t && (n = n.drop(t)), e !== u && (n = (e = Hs(e)) < 0 ? n.dropRight(-e) : n.take(e - t)), n);
        }, gr.prototype.takeRightWhile = function (t) {
          return this.reverse().takeWhile(t).reverse();
        }, gr.prototype.toArray = function () {
          return this.take(L);
        }, Vr(gr.prototype, function (t, e) {
          var n = /^(?:filter|find|map|reject)|While$/.test(e),
              r = /^(?:head|last)$/.test(e),
              o = dr[r ? "take" + ("last" == e ? "Right" : "") : e],
              i = r || /^find/.test(e);
          o && (dr.prototype[e] = function () {
            var e = this.__wrapped__,
                s = r ? [1] : arguments,
                a = e instanceof gr,
                c = s[0],
                f = a || gs(e),
                l = function (t) {
              var e = o.apply(dr, en([t], s));
              return r && p ? e[0] : e;
            };

            f && n && "function" == typeof c && 1 != c.length && (a = f = !1);
            var p = this.__chain__,
                h = !!this.__actions__.length,
                d = i && !p,
                v = a && !h;

            if (!i && f) {
              e = v ? e : new gr(this);
              var y = t.apply(e, s);
              return y.__actions__.push({
                func: Mu,
                args: [l],
                thisArg: u
              }), new _r(y, p);
            }

            return d && v ? t.apply(this, s) : (y = this.thru(l), d ? r ? y.value()[0] : y.value() : y);
          });
        }), Ve(["pop", "push", "shift", "sort", "splice", "unshift"], function (t) {
          var e = ue[t],
              n = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
              r = /^(?:pop|shift)$/.test(t);

          dr.prototype[t] = function () {
            var t = arguments;

            if (r && !this.__chain__) {
              var o = this.value();
              return e.apply(gs(o) ? o : [], t);
            }

            return this[n](function (n) {
              return e.apply(gs(n) ? n : [], t);
            });
          };
        }), Vr(gr.prototype, function (t, e) {
          var n = dr[e];

          if (n) {
            var r = n.name + "";
            (ir[r] || (ir[r] = [])).push({
              name: e,
              func: n
            });
          }
        }), ir[vi(u, m).name] = [{
          name: "wrapper",
          func: u
        }], gr.prototype.clone = function () {
          var t = new gr(this.__wrapped__);
          return t.__actions__ = oi(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = oi(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = oi(this.__views__), t;
        }, gr.prototype.reverse = function () {
          if (this.__filtered__) {
            var t = new gr(this);
            t.__dir__ = -1, t.__filtered__ = !0;
          } else (t = this.clone()).__dir__ *= -1;

          return t;
        }, gr.prototype.value = function () {
          var t = this.__wrapped__.value(),
              e = this.__dir__,
              n = gs(t),
              r = e < 0,
              o = n ? t.length : 0,
              i = function (t, e, n) {
            for (var r = -1, o = n.length; ++r < o;) {
              var i = n[r],
                  u = i.size;

              switch (i.type) {
                case "drop":
                  t += u;
                  break;

                case "dropRight":
                  e -= u;
                  break;

                case "take":
                  e = Gn(e, t + u);
                  break;

                case "takeRight":
                  t = Zn(t, e - u);
              }
            }

            return {
              start: t,
              end: e
            };
          }(0, o, this.__views__),
              u = i.start,
              s = i.end,
              a = s - u,
              c = r ? s : u - 1,
              f = this.__iteratees__,
              l = f.length,
              p = 0,
              h = Gn(a, this.__takeCount__);

          if (!n || !r && o == a && h == a) return $o(t, this.__actions__);
          var d = [];

          t: for (; a-- && p < h;) {
            for (var v = -1, y = t[c += e]; ++v < l;) {
              var _ = f[v],
                  g = _.iteratee,
                  m = _.type,
                  b = g(y);
              if (m == k) y = b;else if (!b) {
                if (m == R) continue t;
                break t;
              }
            }

            d[p++] = y;
          }

          return d;
        }, dr.prototype.at = Hu, dr.prototype.chain = function () {
          return zu(this);
        }, dr.prototype.commit = function () {
          return new _r(this.value(), this.__chain__);
        }, dr.prototype.next = function () {
          this.__values__ === u && (this.__values__ = zs(this.value()));
          var t = this.__index__ >= this.__values__.length;
          return {
            done: t,
            value: t ? u : this.__values__[this.__index__++]
          };
        }, dr.prototype.plant = function (t) {
          for (var e, n = this; n instanceof yr;) {
            var r = hu(n);
            r.__index__ = 0, r.__values__ = u, e ? o.__wrapped__ = r : e = r;
            var o = r;
            n = n.__wrapped__;
          }

          return o.__wrapped__ = t, e;
        }, dr.prototype.reverse = function () {
          var t = this.__wrapped__;

          if (t instanceof gr) {
            var e = t;
            return this.__actions__.length && (e = new gr(this)), (e = e.reverse()).__actions__.push({
              func: Mu,
              args: [ju],
              thisArg: u
            }), new _r(e, this.__chain__);
          }

          return this.thru(ju);
        }, dr.prototype.toJSON = dr.prototype.valueOf = dr.prototype.value = function () {
          return $o(this.__wrapped__, this.__actions__);
        }, dr.prototype.first = dr.prototype.head, qe && (dr.prototype[qe] = function () {
          return this;
        }), dr;
      }();

      "object" == i(n(3)) && n(3) ? (De._ = Un, (o = function () {
        return Un;
      }.call(e, n, e, r)) === u || (r.exports = o)) : Ne ? ((Ne.exports = Un)._ = Un, Ue._ = Un) : De._ = Un;
    }).call(void 0);
  }).call(this, n(1), n(8)(t));
}, function (t, e, n) {

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
}, function (t, e, n) {

  var r = n(0),
      o = n(10);

  t.exports = function (t, e, n, r) {
    return function (t, e, n, r) {
      var i,
          u,
          s = {},
          a = new o(),
          c = function (t) {
        var e = t.v !== i ? t.v : t.w,
            r = s[e],
            o = n(t),
            c = u.distance + o;
        if (o < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + t + " Weight: " + o);
        c < r.distance && (r.distance = c, r.predecessor = i, a.decrease(e, c));
      };

      t.nodes().forEach(function (t) {
        var n = t === e ? 0 : Number.POSITIVE_INFINITY;
        s[t] = {
          distance: n
        }, a.add(t, n);
      });

      for (; a.size() > 0 && (i = a.removeMin(), (u = s[i]).distance !== Number.POSITIVE_INFINITY);) r(i).forEach(c);

      return s;
    }(t, String(e), n || i, r || function (e) {
      return t.outEdges(e);
    });
  };

  var i = r.constant(1);
}, function (t, e, n) {

  var r = n(0);

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
    return r.has(this._keyIndices, t);
  }, o.prototype.priority = function (t) {
    var e = this._keyIndices[t];
    if (void 0 !== e) return this._arr[e].priority;
  }, o.prototype.min = function () {
    if (0 === this.size()) throw new Error("Queue underflow");
    return this._arr[0].key;
  }, o.prototype.add = function (t, e) {
    var n = this._keyIndices;

    if (t = String(t), !r.has(n, t)) {
      var o = this._arr,
          i = o.length;
      return n[t] = i, o.push({
        key: t,
        priority: e
      }), this._decrease(i), !0;
    }

    return !1;
  }, o.prototype.removeMin = function () {
    this._swap(0, this._arr.length - 1);

    var t = this._arr.pop();

    return delete this._keyIndices[t.key], this._heapify(0), t.key;
  }, o.prototype.decrease = function (t, e) {
    var n = this._keyIndices[t];
    if (e > this._arr[n].priority) throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[n].priority + " New: " + e);
    this._arr[n].priority = e, this._decrease(n);
  }, o.prototype._heapify = function (t) {
    var e = this._arr,
        n = 2 * t,
        r = n + 1,
        o = t;
    n < e.length && (o = e[n].priority < e[o].priority ? n : o, r < e.length && (o = e[r].priority < e[o].priority ? r : o), o !== t && (this._swap(t, o), this._heapify(o)));
  }, o.prototype._decrease = function (t) {
    for (var e, n = this._arr, r = n[t].priority; 0 !== t && !(n[e = t >> 1].priority < r);) this._swap(t, e), t = e;
  }, o.prototype._swap = function (t, e) {
    var n = this._arr,
        r = this._keyIndices,
        o = n[t],
        i = n[e];
    n[t] = i, n[e] = o, r[i.key] = t, r[o.key] = e;
  };
}, function (t, e, n) {

  var r = n(0);

  t.exports = function (t) {
    var e = 0,
        n = [],
        o = {},
        i = [];
    return t.nodes().forEach(function (u) {
      r.has(o, u) || function u(s) {
        var a = o[s] = {
          onStack: !0,
          lowlink: e,
          index: e++
        };

        if (n.push(s), t.successors(s).forEach(function (t) {
          r.has(o, t) ? o[t].onStack && (a.lowlink = Math.min(a.lowlink, o[t].index)) : (u(t), a.lowlink = Math.min(a.lowlink, o[t].lowlink));
        }), a.lowlink === a.index) {
          var c,
              f = [];

          do {
            c = n.pop(), o[c].onStack = !1, f.push(c);
          } while (s !== c);

          i.push(f);
        }
      }(u);
    }), i;
  };
}, function (t, e, n) {

  var r = n(0);

  function o(t) {
    var e = {},
        n = {},
        o = [];
    if (r.each(t.sinks(), function u(s) {
      if (r.has(n, s)) throw new i();
      r.has(e, s) || (n[s] = !0, e[s] = !0, r.each(t.predecessors(s), u), delete n[s], o.push(s));
    }), r.size(e) !== t.nodeCount()) throw new i();
    return o;
  }

  function i() {}

  t.exports = o, o.CycleException = i;
}, function (t, e, n) {

  var r = n(0);

  t.exports = function (t, e, n) {
    r.isArray(e) || (e = [e]);
    var o = (t.isDirected() ? t.successors : t.neighbors).bind(t),
        i = [],
        u = {};
    return r.each(e, function (e) {
      if (!t.hasNode(e)) throw new Error("Graph does not have node: " + e);
      !function t(e, n, o, i, u, s) {
        r.has(i, n) || (i[n] = !0, o || s.push(n), r.each(u(n), function (n) {
          t(e, n, o, i, u, s);
        }), o && s.push(n));
      }(t, e, "post" === n, u, o, i);
    }), i;
  };
}, function (t, e, n) {

  (function (e) {
    var r = n(37),
        o = ["delete", "get", "head", "patch", "post", "put"];

    t.exports.load = function (t, n, i) {
      var u,
          s,
          a = n.method ? n.method.toLowerCase() : "get";

      function c(t, n) {
        t ? i(t) : ("[object process]" === Object.prototype.toString.call(void 0 !== e ? e : 0) && "function" == typeof n.buffer && n.buffer(!0), n.end(function (t, e) {
          t ? i(t) : i(void 0, e);
        }));
      }

      if (void 0 !== n.method ? "string" != typeof n.method ? u = new TypeError("options.method must be a string") : -1 === o.indexOf(n.method) && (u = new TypeError("options.method must be one of the following: " + o.slice(0, o.length - 1).join(", ") + " or " + o[o.length - 1])) : void 0 !== n.prepareRequest && "function" != typeof n.prepareRequest && (u = new TypeError("options.prepareRequest must be a function")), u) i(u);else if (s = r["delete" === a ? "del" : a](t), n.prepareRequest) try {
        n.prepareRequest(s, c);
      } catch (t) {
        i(t);
      } else c(void 0, s);
    };
  }).call(this, n(2));
}, function (t, e, n) {

  var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  };

  t.exports = function (t) {
    return null !== t && "object" === (void 0 === t ? "undefined" : r(t));
  };
}, function (t, e, n) {

  (function (r, o) {
    var i,
        u,
        s,
        a,
        c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    };
    /*! Native Promise Only
        v0.8.1 (c) Kyle Simpson
        MIT License: http://getify.mit-license.org
    */

    a = function () {
      var t,
          e,
          n,
          r = Object.prototype.toString,
          i = void 0 !== o ? function (t) {
        return o(t);
      } : setTimeout;

      try {
        Object.defineProperty({}, "x", {}), t = function (t, e, n, r) {
          return Object.defineProperty(t, e, {
            value: n,
            writable: !0,
            configurable: !1 !== r
          });
        };
      } catch (e) {
        t = function (t, e, n) {
          return t[e] = n, t;
        };
      }

      function u(t, r) {
        n.add(t, r), e || (e = i(n.drain));
      }

      function s(t) {
        var e,
            n = void 0 === t ? "undefined" : c(t);
        return null == t || "object" != n && "function" != n || (e = t.then), "function" == typeof e && e;
      }

      function a() {
        for (var t = 0; t < this.chain.length; t++) f(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);

        this.chain.length = 0;
      }

      function f(t, e, n) {
        var r, o;

        try {
          !1 === e ? n.reject(t.msg) : (r = !0 === e ? t.msg : e.call(void 0, t.msg)) === n.promise ? n.reject(TypeError("Promise-chain cycle")) : (o = s(r)) ? o.call(r, n.resolve, n.reject) : n.resolve(r);
        } catch (t) {
          n.reject(t);
        }
      }

      function l(t) {
        var e = this;
        e.triggered || (e.triggered = !0, e.def && (e = e.def), e.msg = t, e.state = 2, e.chain.length > 0 && u(a, e));
      }

      function p(t, e, n, r) {
        for (var o = 0; o < e.length; o++) !function (o) {
          t.resolve(e[o]).then(function (t) {
            n(o, t);
          }, r);
        }(o);
      }

      function h(t) {
        this.def = t, this.triggered = !1;
      }

      function d(t) {
        this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0;
      }

      function v(t) {
        if ("function" != typeof t) throw TypeError("Not a function");
        if (0 !== this.__NPO__) throw TypeError("Not a promise");
        this.__NPO__ = 1;
        var e = new d(this);
        this.then = function (t, n) {
          var r = {
            success: "function" != typeof t || t,
            failure: "function" == typeof n && n
          };
          return r.promise = new this.constructor(function (t, e) {
            if ("function" != typeof t || "function" != typeof e) throw TypeError("Not a function");
            r.resolve = t, r.reject = e;
          }), e.chain.push(r), 0 !== e.state && u(a, e), r.promise;
        }, this.catch = function (t) {
          return this.then(void 0, t);
        };

        try {
          t.call(void 0, function (t) {
            (function t(e) {
              var n,
                  r = this;

              if (!r.triggered) {
                r.triggered = !0, r.def && (r = r.def);

                try {
                  (n = s(e)) ? u(function () {
                    var o = new h(r);

                    try {
                      n.call(e, function () {
                        t.apply(o, arguments);
                      }, function () {
                        l.apply(o, arguments);
                      });
                    } catch (t) {
                      l.call(o, t);
                    }
                  }) : (r.msg = e, r.state = 1, r.chain.length > 0 && u(a, r));
                } catch (t) {
                  l.call(new h(r), t);
                }
              }
            }).call(e, t);
          }, function (t) {
            l.call(e, t);
          });
        } catch (t) {
          l.call(e, t);
        }
      }

      n = function () {
        var t, n, r;

        function o(t, e) {
          this.fn = t, this.self = e, this.next = void 0;
        }

        return {
          add: function (e, i) {
            r = new o(e, i), n ? n.next = r : t = r, n = r, r = void 0;
          },
          drain: function () {
            var r = t;

            for (t = n = e = void 0; r;) r.fn.call(r.self), r = r.next;
          }
        };
      }();

      var y = t({}, "constructor", v, !1);
      return v.prototype = y, t(y, "__NPO__", 0, !1), t(v, "resolve", function (t) {
        return t && "object" == (void 0 === t ? "undefined" : c(t)) && 1 === t.__NPO__ ? t : new this(function (e, n) {
          if ("function" != typeof e || "function" != typeof n) throw TypeError("Not a function");
          e(t);
        });
      }), t(v, "reject", function (t) {
        return new this(function (e, n) {
          if ("function" != typeof e || "function" != typeof n) throw TypeError("Not a function");
          n(t);
        });
      }), t(v, "all", function (t) {
        var e = this;
        return "[object Array]" != r.call(t) ? e.reject(TypeError("Not an array")) : 0 === t.length ? e.resolve([]) : new e(function (n, r) {
          if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");
          var o = t.length,
              i = Array(o),
              u = 0;
          p(e, t, function (t, e) {
            i[t] = e, ++u === o && n(i);
          }, r);
        });
      }), t(v, "race", function (t) {
        var e = this;
        return "[object Array]" != r.call(t) ? e.reject(TypeError("Not an array")) : new e(function (n, r) {
          if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");
          p(e, t, function (t, e) {
            n(e);
          }, r);
        });
      }), v;
    }, (s = void 0 !== r ? r : void 0)[u = "Promise"] = s[u] || a(), t.exports ? t.exports = s[u] : void 0 === (i = function () {
      return s[u];
    }.call(e, n, e, t)) || (t.exports = i);
  }).call(this, n(1), n(43).setImmediate);
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.buildExps = o;
  var r = n(6);

  function o(t) {
    var e = (0, r.merge)("[0-9]", "[A-Fa-f]"),
        n = (0, r.subexp)((0, r.subexp)("%[EFef]" + e + "%" + e + e + "%" + e + e) + "|" + (0, r.subexp)("%[89A-Fa-f]" + e + "%" + e + e) + "|" + (0, r.subexp)("%" + e + e)),
        o = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
        i = (0, r.merge)("[\\:\\/\\?\\#\\[\\]\\@]", o),
        u = t ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]",
        s = t ? "[\\uE000-\\uF8FF]" : "[]",
        a = (0, r.merge)("[A-Za-z]", "[0-9]", "[\\-\\.\\_\\~]", u),
        c = (0, r.subexp)("[A-Za-z]" + (0, r.merge)("[A-Za-z]", "[0-9]", "[\\+\\-\\.]") + "*"),
        f = (0, r.subexp)((0, r.subexp)(n + "|" + (0, r.merge)(a, o, "[\\:]")) + "*"),
        l = (0, r.subexp)((0, r.subexp)("25[0-5]") + "|" + (0, r.subexp)("2[0-4][0-9]") + "|" + (0, r.subexp)("1[0-9][0-9]") + "|" + (0, r.subexp)("[1-9][0-9]") + "|[0-9]"),
        p = (0, r.subexp)(l + "\\." + l + "\\." + l + "\\." + l),
        h = (0, r.subexp)(e + "{1,4}"),
        d = (0, r.subexp)((0, r.subexp)(h + "\\:" + h) + "|" + p),
        v = (0, r.subexp)((0, r.subexp)(h + "\\:") + "{6}" + d),
        y = (0, r.subexp)("\\:\\:" + (0, r.subexp)(h + "\\:") + "{5}" + d),
        _ = (0, r.subexp)((0, r.subexp)(h) + "?\\:\\:" + (0, r.subexp)(h + "\\:") + "{4}" + d),
        g = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,1}" + h) + "?\\:\\:" + (0, r.subexp)(h + "\\:") + "{3}" + d),
        m = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,2}" + h) + "?\\:\\:" + (0, r.subexp)(h + "\\:") + "{2}" + d),
        b = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,3}" + h) + "?\\:\\:" + h + "\\:" + d),
        w = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,4}" + h) + "?\\:\\:" + d),
        x = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,5}" + h) + "?\\:\\:" + h),
        E = (0, r.subexp)((0, r.subexp)((0, r.subexp)(h + "\\:") + "{0,6}" + h) + "?\\:\\:"),
        O = (0, r.subexp)([v, y, _, g, m, b, w, x, E].join("|")),
        C = (0, r.subexp)("[vV]" + e + "+\\." + (0, r.merge)(a, o, "[\\:]") + "+"),
        S = (0, r.subexp)("\\[" + (0, r.subexp)(O + "|" + C) + "\\]"),
        T = (0, r.subexp)((0, r.subexp)(n + "|" + (0, r.merge)(a, o)) + "*"),
        j = (0, r.subexp)(S + "|" + p + "(?!" + T + ")|" + T),
        A = (0, r.subexp)("[0-9]*"),
        I = (0, r.subexp)((0, r.subexp)(f + "@") + "?" + j + (0, r.subexp)("\\:" + A) + "?"),
        P = (0, r.subexp)(n + "|" + (0, r.merge)(a, o, "[\\:\\@]")),
        R = (0, r.subexp)(P + "*"),
        k = (0, r.subexp)(P + "+"),
        D = (0, r.subexp)((0, r.subexp)(n + "|" + (0, r.merge)(a, o, "[\\@]")) + "+"),
        U = (0, r.subexp)((0, r.subexp)("\\/" + R) + "*"),
        N = (0, r.subexp)("\\/" + (0, r.subexp)(k + U) + "?"),
        F = (0, r.subexp)(D + U),
        L = (0, r.subexp)(k + U),
        q = "(?!" + P + ")",
        z = ((0, r.subexp)(U + "|" + N + "|" + F + "|" + L + "|" + q), (0, r.subexp)((0, r.subexp)(P + "|" + (0, r.merge)("[\\/\\?]", s)) + "*")),
        M = (0, r.subexp)((0, r.subexp)(P + "|[\\/\\?]") + "*"),
        H = (0, r.subexp)((0, r.subexp)("\\/\\/" + I + U) + "|" + N + "|" + L + "|" + q),
        $ = (0, r.subexp)(c + "\\:" + H + (0, r.subexp)("\\?" + z) + "?" + (0, r.subexp)("\\#" + M) + "?"),
        B = (0, r.subexp)((0, r.subexp)("\\/\\/" + I + U) + "|" + N + "|" + F + "|" + q),
        W = (0, r.subexp)(B + (0, r.subexp)("\\?" + z) + "?" + (0, r.subexp)("\\#" + M) + "?");

    (0, r.subexp)($ + "|" + W), (0, r.subexp)(c + "\\:" + H + (0, r.subexp)("\\?" + z) + "?"), (0, r.subexp)((0, r.subexp)("\\/\\/(" + (0, r.subexp)("(" + f + ")@") + "?(" + j + ")" + (0, r.subexp)("\\:(" + A + ")") + "?)") + "?(" + U + "|" + N + "|" + L + "|" + q + ")"), (0, r.subexp)("\\?(" + z + ")"), (0, r.subexp)("\\#(" + M + ")"), (0, r.subexp)((0, r.subexp)("\\/\\/(" + (0, r.subexp)("(" + f + ")@") + "?(" + j + ")" + (0, r.subexp)("\\:(" + A + ")") + "?)") + "?(" + U + "|" + N + "|" + F + "|" + q + ")"), (0, r.subexp)("\\?(" + z + ")"), (0, r.subexp)("\\#(" + M + ")"), (0, r.subexp)((0, r.subexp)("\\/\\/(" + (0, r.subexp)("(" + f + ")@") + "?(" + j + ")" + (0, r.subexp)("\\:(" + A + ")") + "?)") + "?(" + U + "|" + N + "|" + L + "|" + q + ")"), (0, r.subexp)("\\?(" + z + ")"), (0, r.subexp)("\\#(" + M + ")"), (0, r.subexp)("(" + f + ")@"), (0, r.subexp)("\\:(" + A + ")");
    return {
      NOT_SCHEME: new RegExp((0, r.merge)("[^]", "[A-Za-z]", "[0-9]", "[\\+\\-\\.]"), "g"),
      NOT_USERINFO: new RegExp((0, r.merge)("[^\\%\\:]", a, o), "g"),
      NOT_HOST: new RegExp((0, r.merge)("[^\\%\\[\\]\\:]", a, o), "g"),
      NOT_PATH: new RegExp((0, r.merge)("[^\\%\\/\\:\\@]", a, o), "g"),
      NOT_PATH_NOSCHEME: new RegExp((0, r.merge)("[^\\%\\/\\@]", a, o), "g"),
      NOT_QUERY: new RegExp((0, r.merge)("[^\\%]", a, o, "[\\:\\@\\/\\?]", s), "g"),
      NOT_FRAGMENT: new RegExp((0, r.merge)("[^\\%]", a, o, "[\\:\\@\\/\\?]"), "g"),
      ESCAPE: new RegExp((0, r.merge)("[^]", a, o), "g"),
      UNRESERVED: new RegExp(a, "g"),
      OTHER_CHARS: new RegExp((0, r.merge)("[^\\%]", a, i), "g"),
      PCT_ENCODED: new RegExp(n, "g"),
      IPV6ADDRESS: new RegExp("\\[?(" + O + ")\\]?", "g")
    };
  }

  e.default = o(!1);
}, function (t, e, n) {

  (function (t, r) {
    var o,
        i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    };
    !function (u) {
      var s = "object" == i(e) && e && !e.nodeType && e,
          a = "object" == i(t) && t && !t.nodeType && t,
          c = "object" == (void 0 === r ? "undefined" : i(r)) && r;
      c.global !== c && c.window !== c && c.self !== c || (u = c);
      var f,
          l,
          p = 2147483647,
          h = 36,
          d = 1,
          v = 26,
          y = 38,
          _ = 700,
          g = 72,
          m = 128,
          b = "-",
          w = /^xn--/,
          x = /[^\x20-\x7E]/,
          E = /[\x2E\u3002\uFF0E\uFF61]/g,
          O = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      },
          C = h - d,
          S = Math.floor,
          T = String.fromCharCode;

      function j(t) {
        throw new RangeError(O[t]);
      }

      function A(t, e) {
        for (var n = t.length, r = []; n--;) r[n] = e(t[n]);

        return r;
      }

      function I(t, e) {
        var n = t.split("@"),
            r = "";
        return n.length > 1 && (r = n[0] + "@", t = n[1]), r + A((t = t.replace(E, ".")).split("."), e).join(".");
      }

      function P(t) {
        for (var e, n, r = [], o = 0, i = t.length; o < i;) (e = t.charCodeAt(o++)) >= 55296 && e <= 56319 && o < i ? 56320 == (64512 & (n = t.charCodeAt(o++))) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), o--) : r.push(e);

        return r;
      }

      function R(t) {
        return A(t, function (t) {
          var e = "";
          return t > 65535 && (e += T((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), e += T(t);
        }).join("");
      }

      function k(t, e) {
        return t + 22 + 75 * (t < 26) - ((0 != e) << 5);
      }

      function D(t, e, n) {
        var r = 0;

        for (t = n ? S(t / _) : t >> 1, t += S(t / e); t > C * v >> 1; r += h) t = S(t / C);

        return S(r + (C + 1) * t / (t + y));
      }

      function U(t) {
        var e,
            n,
            r,
            o,
            i,
            u,
            s,
            a,
            c,
            f,
            l,
            y = [],
            _ = t.length,
            w = 0,
            x = m,
            E = g;

        for ((n = t.lastIndexOf(b)) < 0 && (n = 0), r = 0; r < n; ++r) t.charCodeAt(r) >= 128 && j("not-basic"), y.push(t.charCodeAt(r));

        for (o = n > 0 ? n + 1 : 0; o < _;) {
          for (i = w, u = 1, s = h; o >= _ && j("invalid-input"), ((a = (l = t.charCodeAt(o++)) - 48 < 10 ? l - 22 : l - 65 < 26 ? l - 65 : l - 97 < 26 ? l - 97 : h) >= h || a > S((p - w) / u)) && j("overflow"), w += a * u, !(a < (c = s <= E ? d : s >= E + v ? v : s - E)); s += h) u > S(p / (f = h - c)) && j("overflow"), u *= f;

          E = D(w - i, e = y.length + 1, 0 == i), S(w / e) > p - x && j("overflow"), x += S(w / e), w %= e, y.splice(w++, 0, x);
        }

        return R(y);
      }

      function N(t) {
        var e,
            n,
            r,
            o,
            i,
            u,
            s,
            a,
            c,
            f,
            l,
            y,
            _,
            w,
            x,
            E = [];

        for (y = (t = P(t)).length, e = m, n = 0, i = g, u = 0; u < y; ++u) (l = t[u]) < 128 && E.push(T(l));

        for (r = o = E.length, o && E.push(b); r < y;) {
          for (s = p, u = 0; u < y; ++u) (l = t[u]) >= e && l < s && (s = l);

          for (s - e > S((p - n) / (_ = r + 1)) && j("overflow"), n += (s - e) * _, e = s, u = 0; u < y; ++u) if ((l = t[u]) < e && ++n > p && j("overflow"), l == e) {
            for (a = n, c = h; !(a < (f = c <= i ? d : c >= i + v ? v : c - i)); c += h) x = a - f, w = h - f, E.push(T(k(f + x % w, 0))), a = S(x / w);

            E.push(T(k(a, 0))), i = D(n, _, r == o), n = 0, ++r;
          }

          ++n, ++e;
        }

        return E.join("");
      }

      if (f = {
        version: "1.4.1",
        ucs2: {
          decode: P,
          encode: R
        },
        decode: U,
        encode: N,
        toASCII: function (t) {
          return I(t, function (t) {
            return x.test(t) ? "xn--" + N(t) : t;
          });
        },
        toUnicode: function (t) {
          return I(t, function (t) {
            return w.test(t) ? U(t.slice(4).toLowerCase()) : t;
          });
        }
      }, "object" == i(n(3)) && n(3)) void 0 === (o = function () {
        return f;
      }.call(e, n, e, t)) || (t.exports = o);else if (s && a) {
        if (t.exports == s) a.exports = f;else for (l in f) f.hasOwnProperty(l) && (s[l] = f[l]);
      } else u.punycode = f;
    }(void 0);
  }).call(this, n(8)(t), n(1));
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = {
    scheme: "http",
    domainHost: !0,
    parse: function (t, e) {
      return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
    },
    serialize: function (t, e) {
      return t.port !== ("https" !== String(t.scheme).toLowerCase() ? 80 : 443) && "" !== t.port || (t.port = void 0), t.path || (t.path = "/"), t;
    }
  };
}, function (t, e, n) {

  (function (e) {
    var r = n(7),
        o = n(21),
        i = n(34),
        u = n(35),
        s = n(45),
        a = n(48),
        c = n(49),
        f = /~(?:[^01]|$)/g,
        l = {},
        p = ["relative", "remote"],
        h = ["absolute", "uri"],
        d = {};

    function v(t, e) {
      r.isString(t) && (t = a(t)), r.isString(e) && (e = a(e));
      var n,
          o,
          u = C(r.isUndefined(e) ? "" : e);
      return h.indexOf(u.reference) > -1 ? o = u : (n = r.isUndefined(t) ? void 0 : C(t), r.isUndefined(n) ? o = u : ((o = n).path = a(i.join(n.path, u.path)), o.query = function (t, e) {
        var n = {};

        function o(t) {
          r.forOwn(t, function (t, e) {
            n[e] = t;
          });
        }

        return o(s.parse(t || "")), o(s.parse(e || "")), 0 === Object.keys(n).length ? void 0 : s.stringify(n);
      }(n.query, u.query))), o.fragment = void 0, (-1 === h.indexOf(o.reference) && 0 === o.path.indexOf("../") ? "../" : "") + c.serialize(o);
    }

    function y(t) {
      return p.indexOf(b(t)) > -1;
    }

    function _(t) {
      return r.isUndefined(t.error) && "invalid" !== t.type;
    }

    function g(t, e) {
      var n = t;
      return e.forEach(function (t) {
        if (!(t in n)) throw Error("JSON Pointer points to missing location: " + k(e));
        n = n[t];
      }), n;
    }

    function m(t) {
      return Object.keys(t).filter(function (t) {
        return "$ref" !== t;
      });
    }

    function b(t) {
      var e;

      switch (t.uriDetails.reference) {
        case "absolute":
        case "uri":
          e = "remote";
          break;

        case "same-document":
          e = "local";
          break;

        default:
          e = t.uriDetails.reference;
      }

      return e;
    }

    function w(t, e) {
      var n = l[t],
          o = Promise.resolve(),
          i = r.cloneDeep(e.loaderOptions || {});
      return r.isUndefined(n) ? (r.isUndefined(i.processContent) && (i.processContent = function (t, e) {
        e(void 0, JSON.parse(t.text));
      }), o = (o = u.load(decodeURI(t), i)).then(function (e) {
        return l[t] = {
          value: e
        }, e;
      }).catch(function (e) {
        throw l[t] = {
          error: e
        }, e;
      })) : o = o.then(function () {
        if (r.isError(n.error)) throw n.error;
        return n.value;
      }), o = o.then(function (t) {
        return r.cloneDeep(t);
      });
    }

    function x(t, e) {
      var n = !0;

      try {
        if (!r.isPlainObject(t)) throw new Error("obj is not an Object");
        if (!r.isString(t.$ref)) throw new Error("obj.$ref is not a String");
      } catch (t) {
        if (e) throw t;
        n = !1;
      }

      return n;
    }

    function E(t) {
      return -1 !== t.indexOf("://") || i.isAbsolute(t) ? t : i.resolve(e.cwd(), t);
    }

    function O(t, e) {
      t.error = e.message, t.missing = !0;
    }

    function C(t) {
      return c.parse(t);
    }

    function S(t, e) {
      var n, o;
      if (t = r.isUndefined(t) ? {} : r.cloneDeep(t), !r.isObject(t)) throw new TypeError("options must be an Object");
      if (!r.isUndefined(t.resolveCirculars) && !r.isBoolean(t.resolveCirculars)) throw new TypeError("options.resolveCirculars must be a Boolean");
      if (!(r.isUndefined(t.filter) || r.isArray(t.filter) || r.isFunction(t.filter) || r.isString(t.filter))) throw new TypeError("options.filter must be an Array, a Function of a String");
      if (!r.isUndefined(t.includeInvalid) && !r.isBoolean(t.includeInvalid)) throw new TypeError("options.includeInvalid must be a Boolean");
      if (!r.isUndefined(t.location) && !r.isString(t.location)) throw new TypeError("options.location must be a String");
      if (!r.isUndefined(t.refPreProcessor) && !r.isFunction(t.refPreProcessor)) throw new TypeError("options.refPreProcessor must be a Function");
      if (!r.isUndefined(t.refPostProcessor) && !r.isFunction(t.refPostProcessor)) throw new TypeError("options.refPostProcessor must be a Function");
      if (!r.isUndefined(t.subDocPath) && !r.isArray(t.subDocPath) && !P(t.subDocPath)) throw new TypeError("options.subDocPath must be an Array of path segments or a valid JSON Pointer");
      if (r.isUndefined(t.resolveCirculars) && (t.resolveCirculars = !1), t.filter = function (t) {
        var e, n;
        return r.isArray(t.filter) || r.isString(t.filter) ? (n = r.isString(t.filter) ? [t.filter] : t.filter, e = function (t) {
          return n.indexOf(t.type) > -1 || n.indexOf(b(t)) > -1;
        }) : r.isFunction(t.filter) ? e = t.filter : r.isUndefined(t.filter) && (e = function () {
          return !0;
        }), function (n, r) {
          return ("invalid" !== n.type || !0 === t.includeInvalid) && e(n, r);
        };
      }(t), r.isUndefined(t.location) && (t.location = E("./root.json")), (n = t.location.split("#")).length > 1 && (t.subDocPath = "#" + n[1]), o = decodeURI(t.location) === t.location, t.location = v(t.location, void 0), o && (t.location = decodeURI(t.location)), t.subDocPath = function (t) {
        var e;
        return r.isArray(t.subDocPath) ? e = t.subDocPath : r.isString(t.subDocPath) ? e = R(t.subDocPath) : r.isUndefined(t.subDocPath) && (e = []), e;
      }(t), !r.isUndefined(e)) try {
        g(e, t.subDocPath);
      } catch (t) {
        throw t.message = t.message.replace("JSON Pointer", "options.subDocPath"), t;
      }
      return t;
    }

    function T(t) {
      if (!r.isArray(t)) throw new TypeError("path must be an array");
      return t.map(function (t) {
        return r.isString(t) || (t = JSON.stringify(t)), t.replace(/~1/g, "/").replace(/~0/g, "~");
      });
    }

    function j(t) {
      if (!r.isArray(t)) throw new TypeError("path must be an array");
      return t.map(function (t) {
        return r.isString(t) || (t = JSON.stringify(t)), t.replace(/~/g, "~0").replace(/\//g, "~1");
      });
    }

    function A(t, e) {
      var n = {};
      if (!r.isArray(t) && !r.isObject(t)) throw new TypeError("obj must be an Array or an Object");
      return function t(e, n, o, i) {
        var u = !0;

        function s(n, r) {
          o.push(r), t(e, n, o, i), o.pop();
        }

        r.isFunction(i) && (u = i(e, n, o)), -1 === e.indexOf(n) && (e.push(n), !1 !== u && (r.isArray(n) ? n.forEach(function (t, e) {
          s(t, e.toString());
        }) : r.isObject(n) && r.forOwn(n, function (t, e) {
          s(t, e);
        })), e.pop());
      }(function (t, e) {
        var n,
            r = [];
        return e.length > 0 && (n = t, e.slice(0, e.length - 1).forEach(function (t) {
          t in n && (n = n[t], r.push(n));
        })), r;
      }(t, (e = S(e, t)).subDocPath), g(t, e.subDocPath), r.cloneDeep(e.subDocPath), function (t, o, i) {
        var u,
            s,
            a = !0;
        return x(o) && (r.isUndefined(e.refPreProcessor) || (o = e.refPreProcessor(r.cloneDeep(o), i)), u = I(o), r.isUndefined(e.refPostProcessor) || (u = e.refPostProcessor(u, i)), e.filter(u, i) && (s = k(i), n[s] = u), m(o).length > 0 && (a = !1)), a;
      }), n;
    }

    function I(t) {
      var e,
          n,
          o,
          i = {
        def: t
      };

      try {
        if (x(t, !0)) {
          if (e = t.$ref, o = d[e], r.isUndefined(o) && (o = d[e] = C(e)), i.uri = e, i.uriDetails = o, r.isUndefined(o.error)) {
            i.type = b(i);

            try {
              ["#", "/"].indexOf(e[0]) > -1 ? P(e, !0) : e.indexOf("#") > -1 && P(o.fragment, !0);
            } catch (t) {
              i.error = t.message, i.type = "invalid";
            }
          } else i.error = i.uriDetails.error, i.type = "invalid";

          (n = m(t)).length > 0 && (i.warning = "Extra JSON Reference properties will be ignored: " + n.join(", "));
        } else i.type = "invalid";
      } catch (t) {
        i.error = t.message, i.type = "invalid";
      }

      return i;
    }

    function P(t, e) {
      var n,
          o = !0;

      try {
        if (!r.isString(t)) throw new Error("ptr is not a String");

        if ("" !== t) {
          if (n = t.charAt(0), -1 === ["#", "/"].indexOf(n)) throw new Error("ptr must start with a / or #/");
          if ("#" === n && "#" !== t && "/" !== t.charAt(1)) throw new Error("ptr must start with a / or #/");
          if (t.match(f)) throw new Error("ptr has invalid token(s)");
        }
      } catch (t) {
        if (!0 === e) throw t;
        o = !1;
      }

      return o;
    }

    function R(t) {
      try {
        P(t, !0);
      } catch (t) {
        throw new Error("ptr must be a JSON Pointer: " + t.message);
      }

      var e = t.split("/");
      return e.shift(), T(e);
    }

    function k(t, e) {
      if (!r.isArray(t)) throw new Error("path must be an Array");
      return (!1 !== e ? "#" : "") + (t.length > 0 ? "/" : "") + j(t).join("/");
    }

    function D(t, e) {
      var n = Promise.resolve();
      return n = n.then(function () {
        if (!r.isArray(t) && !r.isObject(t)) throw new TypeError("obj must be an Array or an Object");
        e = S(e, t), t = r.cloneDeep(t);
      }).then(function () {
        var n = {
          deps: {},
          docs: {},
          refs: {}
        };
        return function t(e, n, o) {
          var u,
              s,
              a = Promise.resolve(),
              c = k(n.subDocPath),
              f = E(n.location),
              l = i.dirname(n.location),
              p = f + c;
          return r.isUndefined(o.docs[f]) && (o.docs[f] = e), r.isUndefined(o.deps[p]) && (o.deps[p] = {}, u = A(e, n), r.forOwn(u, function (i, u) {
            var f,
                h,
                d = E(n.location) + u,
                g = i.refdId = decodeURI(E(y(i) ? v(l, i.uri) : n.location) + "#" + (i.uri.indexOf("#") > -1 ? i.uri.split("#")[1] : ""));
            o.refs[d] = i, _(i) && (i.fqURI = g, o.deps[p][u === c ? "#" : u.replace(c + "/", "#/")] = g, 0 !== d.indexOf(g + "/") ? ((s = r.cloneDeep(n)).subDocPath = r.isUndefined(i.uriDetails.fragment) ? [] : R(decodeURI(i.uriDetails.fragment)), y(i) ? (delete s.filter, s.location = g.split("#")[0], a = a.then((f = o, h = s, function () {
              var t = E(h.location),
                  e = f.docs[t];
              return r.isUndefined(e) ? w(t, h).catch(function (e) {
                return f.docs[t] = e, e;
              }) : Promise.resolve().then(function () {
                return e;
              });
            }))) : a = a.then(function () {
              return e;
            }), a = a.then(function (e, n, o) {
              return function (i) {
                if (r.isError(i)) O(o, i);else try {
                  return t(i, n, e).catch(function (t) {
                    O(o, t);
                  });
                } catch (t) {
                  O(o, t);
                }
              };
            }(o, s, i))) : i.circular = !0);
          })), a;
        }(t, e, n).then(function () {
          return n;
        });
      }).then(function (t) {
        var n = {},
            u = [],
            s = [],
            a = new o.Graph(),
            c = E(e.location),
            f = c + k(e.subDocPath),
            l = i.dirname(c);
        return Object.keys(t.deps).forEach(function (t) {
          a.setNode(t);
        }), r.forOwn(t.deps, function (t, e) {
          r.forOwn(t, function (t) {
            a.setEdge(e, t);
          });
        }), (u = o.alg.findCycles(a)).forEach(function (t) {
          t.forEach(function (t) {
            -1 === s.indexOf(t) && s.push(t);
          });
        }), r.forOwn(t.deps, function (e, n) {
          r.forOwn(e, function (e, r) {
            var o,
                i = !1,
                a = n + r.slice(1),
                c = t.refs[n + r.slice(1)],
                f = y(c);
            s.indexOf(e) > -1 && u.forEach(function (t) {
              i || (o = t.indexOf(e)) > -1 && t.forEach(function (n) {
                i || 0 === a.indexOf(n + "/") && (f && o !== t.length - 1 && "#" === e[e.length - 1] || (i = !0));
              });
            }), i && (c.circular = !0);
          });
        }), r.forOwn(Object.keys(t.deps).reverse(), function (n) {
          var o = t.deps[n],
              i = n.split("#"),
              u = t.docs[i[0]],
              s = R(i[1]);
          r.forOwn(o, function (n, o) {
            var a,
                c,
                f,
                l = n.split("#"),
                p = t.docs[l[0]],
                h = s.concat(R(o)),
                d = t.refs[i[0] + k(h)];
            if (r.isUndefined(d.error) && r.isUndefined(d.missing)) if (!e.resolveCirculars && d.circular) d.value = d.def;else {
              try {
                d.value = g(p, R(l[1]));
              } catch (t) {
                return void O(d, t);
              }

              "" === i[1] && "#" === o ? t.docs[i[0]] = d.value : (a = u, c = h, f = d.value, g(a, c.slice(0, c.length - 1))[c[c.length - 1]] = f);
            }
          });
        }), Object.keys(t.refs).forEach(function (o) {
          var i,
              u,
              s = t.refs[o];
          "invalid" !== s.type && ("#" === s.fqURI[s.fqURI.length - 1] && "#" !== s.uri[s.uri.length - 1] && (s.fqURI = s.fqURI.substr(0, s.fqURI.length - 1)), i = s.fqURI.split("/"), u = s.uri.split("/"), r.times(u.length - 1, function (t) {
            var e = u[u.length - t - 1],
                n = i.length - t - 1,
                r = i[n];
            "." !== e && ".." !== e || (e = r), i[n] = e;
          }), s.fqURI = i.join("/"), 0 === s.fqURI.indexOf(c) ? s.fqURI = s.fqURI.replace(c, "") : 0 === s.fqURI.indexOf(l) && (s.fqURI = s.fqURI.replace(l, "")), "/" === s.fqURI[0] && (s.fqURI = "." + s.fqURI)), 0 === o.indexOf(f) && function r(o, i, u) {
            var s,
                a = i.split("#"),
                c = t.refs[i];
            n[a[0] === e.location ? "#" + a[1] : k(e.subDocPath.concat(u))] = c, !c.circular && _(c) ? (s = t.deps[c.refdId], 0 !== c.refdId.indexOf(o) && Object.keys(s).forEach(function (t) {
              r(c.refdId, c.refdId + t.substr(1), u.concat(R(t)));
            })) : !c.circular && c.error && (c.error = c.error.replace("options.subDocPath", "JSON Pointer"), c.error.indexOf("#") > -1 && (c.error = c.error.replace(c.uri.substr(c.uri.indexOf("#")), c.uri)), 0 !== c.error.indexOf("ENOENT:") && 0 !== c.error.indexOf("Not Found") || (c.error = "JSON Pointer points to missing location: " + c.uri));
          }(f, o, R(o.substr(f.length)));
        }), r.forOwn(t.refs, function (t) {
          delete t.refdId, t.missing && (t.error = t.error.split(": ")[0] + ": " + t.def.$ref);
        }), {
          refs: n,
          resolved: t.docs[c]
        };
      });
    }

    "undefined" == typeof Promise && n(16), t.exports.clearCache = function () {
      l = {};
    }, t.exports.decodePath = function (t) {
      return T(t);
    }, t.exports.encodePath = function (t) {
      return j(t);
    }, t.exports.findRefs = function (t, e) {
      return A(t, e);
    }, t.exports.findRefsAt = function (t, e) {
      return function (t, e) {
        var n = Promise.resolve();
        return n = n.then(function () {
          if (!r.isString(t)) throw new TypeError("location must be a string");
          return r.isUndefined(e) && (e = {}), r.isObject(e) && (e.location = t), w((e = S(e)).location, e);
        }).then(function (t) {
          var n = r.cloneDeep(l[e.location]),
              o = r.cloneDeep(e),
              i = C(e.location);
          return r.isUndefined(n.refs) && (delete o.filter, delete o.subDocPath, o.includeInvalid = !0, l[e.location].refs = A(t, o)), r.isUndefined(e.filter) || (o.filter = e.filter), r.isUndefined(i.fragment) ? r.isUndefined(i.subDocPath) || (o.subDocPath = e.subDocPath) : o.subDocPath = R(decodeURI(i.fragment)), {
            refs: A(t, o),
            value: t
          };
        });
      }(t, e);
    }, t.exports.getRefDetails = function (t) {
      return I(t);
    }, t.exports.isPtr = function (t, e) {
      return P(t, e);
    }, t.exports.isRef = function (t, e) {
      return function (t, e) {
        return x(t, e) && "invalid" !== I(t).type;
      }(t, e);
    }, t.exports.pathFromPtr = function (t) {
      return R(t);
    }, t.exports.pathToPtr = function (t, e) {
      return k(t, e);
    }, t.exports.resolveRefs = function (t, e) {
      return D(t, e);
    }, t.exports.resolveRefsAt = function (t, e) {
      return function (t, e) {
        var n = Promise.resolve();
        return n = n.then(function () {
          if (!r.isString(t)) throw new TypeError("location must be a string");
          return r.isUndefined(e) && (e = {}), r.isObject(e) && (e.location = t), w((e = S(e)).location, e);
        }).then(function (t) {
          var n = r.cloneDeep(e),
              o = C(e.location);
          return r.isUndefined(o.fragment) || (n.subDocPath = R(decodeURI(o.fragment))), D(t, n).then(function (e) {
            return {
              refs: e.refs,
              resolved: e.resolved,
              value: t
            };
          });
        });
      }(t, e);
    };
  }).call(this, n(2));
}, function (t, e, n) {

  var r = n(22);
  t.exports = {
    Graph: r.Graph,
    json: n(24),
    alg: n(25),
    version: r.version
  };
}, function (t, e, n) {

  t.exports = {
    Graph: n(5),
    version: n(23)
  };
}, function (t, e, n) {

  t.exports = "2.1.5";
}, function (t, e, n) {

  var r = n(0),
      o = n(5);

  function i(t) {
    return r.map(t.nodes(), function (e) {
      var n = t.node(e),
          o = t.parent(e),
          i = {
        v: e
      };
      return r.isUndefined(n) || (i.value = n), r.isUndefined(o) || (i.parent = o), i;
    });
  }

  function u(t) {
    return r.map(t.edges(), function (e) {
      var n = t.edge(e),
          o = {
        v: e.v,
        w: e.w
      };
      return r.isUndefined(e.name) || (o.name = e.name), r.isUndefined(n) || (o.value = n), o;
    });
  }

  t.exports = {
    write: function (t) {
      var e = {
        options: {
          directed: t.isDirected(),
          multigraph: t.isMultigraph(),
          compound: t.isCompound()
        },
        nodes: i(t),
        edges: u(t)
      };
      r.isUndefined(t.graph()) || (e.value = r.clone(t.graph()));
      return e;
    },
    read: function (t) {
      var e = new o(t.options).setGraph(t.value);
      return r.each(t.nodes, function (t) {
        e.setNode(t.v, t.value), t.parent && e.setParent(t.v, t.parent);
      }), r.each(t.edges, function (t) {
        e.setEdge({
          v: t.v,
          w: t.w,
          name: t.name
        }, t.value);
      }), e;
    }
  };
}, function (t, e, n) {

  t.exports = {
    components: n(26),
    dijkstra: n(9),
    dijkstraAll: n(27),
    findCycles: n(28),
    floydWarshall: n(29),
    isAcyclic: n(30),
    postorder: n(31),
    preorder: n(32),
    prim: n(33),
    tarjan: n(11),
    topsort: n(12)
  };
}, function (t, e, n) {

  var r = n(0);

  t.exports = function (t) {
    var e,
        n = {},
        o = [];

    function i(o) {
      r.has(n, o) || (n[o] = !0, e.push(o), r.each(t.successors(o), i), r.each(t.predecessors(o), i));
    }

    return r.each(t.nodes(), function (t) {
      e = [], i(t), e.length && o.push(e);
    }), o;
  };
}, function (t, e, n) {

  var r = n(9),
      o = n(0);

  t.exports = function (t, e, n) {
    return o.transform(t.nodes(), function (o, i) {
      o[i] = r(t, i, e, n);
    }, {});
  };
}, function (t, e, n) {

  var r = n(0),
      o = n(11);

  t.exports = function (t) {
    return r.filter(o(t), function (e) {
      return e.length > 1 || 1 === e.length && t.hasEdge(e[0], e[0]);
    });
  };
}, function (t, e, n) {

  var r = n(0);

  t.exports = function (t, e, n) {
    return function (t, e, n) {
      var r = {},
          o = t.nodes();
      return o.forEach(function (t) {
        r[t] = {}, r[t][t] = {
          distance: 0
        }, o.forEach(function (e) {
          t !== e && (r[t][e] = {
            distance: Number.POSITIVE_INFINITY
          });
        }), n(t).forEach(function (n) {
          var o = n.v === t ? n.w : n.v,
              i = e(n);
          r[t][o] = {
            distance: i,
            predecessor: t
          };
        });
      }), o.forEach(function (t) {
        var e = r[t];
        o.forEach(function (n) {
          var i = r[n];
          o.forEach(function (n) {
            var r = i[t],
                o = e[n],
                u = i[n],
                s = r.distance + o.distance;
            s < u.distance && (u.distance = s, u.predecessor = o.predecessor);
          });
        });
      }), r;
    }(t, e || o, n || function (e) {
      return t.outEdges(e);
    });
  };

  var o = r.constant(1);
}, function (t, e, n) {

  var r = n(12);

  t.exports = function (t) {
    try {
      r(t);
    } catch (t) {
      if (t instanceof r.CycleException) return !1;
      throw t;
    }

    return !0;
  };
}, function (t, e, n) {

  var r = n(13);

  t.exports = function (t, e) {
    return r(t, e, "post");
  };
}, function (t, e, n) {

  var r = n(13);

  t.exports = function (t, e) {
    return r(t, e, "pre");
  };
}, function (t, e, n) {

  var r = n(0),
      o = n(5),
      i = n(10);

  t.exports = function (t, e) {
    var n,
        u = new o(),
        s = {},
        a = new i();

    function c(t) {
      var r = t.v === n ? t.w : t.v,
          o = a.priority(r);

      if (void 0 !== o) {
        var i = e(t);
        i < o && (s[r] = n, a.decrease(r, i));
      }
    }

    if (0 === t.nodeCount()) return u;
    r.each(t.nodes(), function (t) {
      a.add(t, Number.POSITIVE_INFINITY), u.setNode(t);
    }), a.decrease(t.nodes()[0], 0);
    var f = !1;

    for (; a.size() > 0;) {
      if (n = a.removeMin(), r.has(s, n)) u.setEdge(n, s[n]);else {
        if (f) throw new Error("Input graph is not connected: " + t);
        f = !0;
      }
      t.nodeEdges(n).forEach(c);
    }

    return u;
  };
}, function (t, e, n) {

  (function (t) {
    function n(t, e) {
      for (var n = 0, r = t.length - 1; r >= 0; r--) {
        var o = t[r];
        "." === o ? t.splice(r, 1) : ".." === o ? (t.splice(r, 1), n++) : n && (t.splice(r, 1), n--);
      }

      if (e) for (; n--; n) t.unshift("..");
      return t;
    }

    var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
        o = function (t) {
      return r.exec(t).slice(1);
    };

    function i(t, e) {
      if (t.filter) return t.filter(e);

      for (var n = [], r = 0; r < t.length; r++) e(t[r], r, t) && n.push(t[r]);

      return n;
    }

    e.resolve = function () {
      for (var e = "", r = !1, o = arguments.length - 1; o >= -1 && !r; o--) {
        var u = o >= 0 ? arguments[o] : t.cwd();
        if ("string" != typeof u) throw new TypeError("Arguments to path.resolve must be strings");
        u && (e = u + "/" + e, r = "/" === u.charAt(0));
      }

      return (r ? "/" : "") + (e = n(i(e.split("/"), function (t) {
        return !!t;
      }), !r).join("/")) || ".";
    }, e.normalize = function (t) {
      var r = e.isAbsolute(t),
          o = "/" === u(t, -1);
      return (t = n(i(t.split("/"), function (t) {
        return !!t;
      }), !r).join("/")) || r || (t = "."), t && o && (t += "/"), (r ? "/" : "") + t;
    }, e.isAbsolute = function (t) {
      return "/" === t.charAt(0);
    }, e.join = function () {
      var t = Array.prototype.slice.call(arguments, 0);
      return e.normalize(i(t, function (t, e) {
        if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");
        return t;
      }).join("/"));
    }, e.relative = function (t, n) {
      function r(t) {
        for (var e = 0; e < t.length && "" === t[e]; e++);

        for (var n = t.length - 1; n >= 0 && "" === t[n]; n--);

        return e > n ? [] : t.slice(e, n - e + 1);
      }

      t = e.resolve(t).substr(1), n = e.resolve(n).substr(1);

      for (var o = r(t.split("/")), i = r(n.split("/")), u = Math.min(o.length, i.length), s = u, a = 0; a < u; a++) if (o[a] !== i[a]) {
        s = a;
        break;
      }

      var c = [];

      for (a = s; a < o.length; a++) c.push("..");

      return (c = c.concat(i.slice(s))).join("/");
    }, e.sep = "/", e.delimiter = ":", e.dirname = function (t) {
      var e = o(t),
          n = e[0],
          r = e[1];
      return n || r ? (r && (r = r.substr(0, r.length - 1)), n + r) : ".";
    }, e.basename = function (t, e) {
      var n = o(t)[2];
      return e && n.substr(-1 * e.length) === e && (n = n.substr(0, n.length - e.length)), n;
    }, e.extname = function (t) {
      return o(t)[3];
    };
    var u = "b" === "ab".substr(-1) ? function (t, e, n) {
      return t.substr(e, n);
    } : function (t, e, n) {
      return e < 0 && (e = t.length + e), t.substr(e, n);
    };
  }).call(this, n(2));
}, function (t, e, n) {

  var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  },
      o = {
    file: n(36),
    http: n(14),
    https: n(14)
  },
      i = "object" === ("undefined" == typeof window ? "undefined" : r(window)) || "function" == typeof importScripts ? o.http : o.file;
  "undefined" == typeof Promise && n(16), t.exports.load = function (t, e) {
    var n = Promise.resolve();
    return void 0 === e && (e = {}), n = (n = n.then(function () {
      if (void 0 === t) throw new TypeError("location is required");
      if ("string" != typeof t) throw new TypeError("location must be a string");

      if (void 0 !== e) {
        if ("object" !== (void 0 === e ? "undefined" : r(e))) throw new TypeError("options must be an object");
        if (void 0 !== e.processContent && "function" != typeof e.processContent) throw new TypeError("options.processContent must be a function");
      }
    })).then(function () {
      return new Promise(function (n, r) {
        (function (t) {
          var e = function (t) {
            return void 0 !== t && (t = -1 === t.indexOf("://") ? "" : t.split("://")[0]), t;
          }(t),
              n = o[e];

          if (void 0 === n) {
            if ("" !== e) throw new Error("Unsupported scheme: " + e);
            n = i;
          }

          return n;
        })(t).load(t, e || {}, function (t, e) {
          t ? r(t) : n(e);
        });
      });
    }).then(function (t) {
      return e.processContent ? new Promise(function (n, o) {
        e.processContent("object" === (void 0 === t ? "undefined" : r(t)) ? t : {
          text: t
        }, function (t, e) {
          t ? o(t) : n(e);
        });
      }) : "object" === (void 0 === t ? "undefined" : r(t)) ? t.text : t;
    });
  };
}, function (t, e, n) {

  var r = new TypeError("The 'file' scheme is not supported in the browser");
  t.exports.getBase = function () {
    throw r;
  }, t.exports.load = function () {
    var t = arguments[arguments.length - 1];
    if ("function" != typeof t) throw r;
    t(r);
  };
}, function (t, e, n) {

  var r,
      o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  };
  "undefined" != typeof window ? r = window : "undefined" != typeof self ? r = self : (console.warn("Using browser-only version of superagent in non-browser environment"), r = void 0);
  var i = n(38),
      u = n(39),
      s = n(15),
      a = n(40),
      c = n(42);

  function f() {}

  var l = e = t.exports = function (t, n) {
    return "function" == typeof n ? new e.Request("GET", t).end(n) : 1 == arguments.length ? new e.Request("GET", t) : new e.Request(t, n);
  };

  e.Request = g, l.getXHR = function () {
    if (!(!r.XMLHttpRequest || r.location && "file:" == r.location.protocol && r.ActiveXObject)) return new XMLHttpRequest();

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
    if (!s(t)) return t;
    var e = [];

    for (var n in t) d(e, n, t[n]);

    return e.join("&");
  }

  function d(t, e, n) {
    if (null != n) {
      if (Array.isArray(n)) n.forEach(function (n) {
        d(t, e, n);
      });else if (s(n)) for (var r in n) d(t, e + "[" + r + "]", n[r]);else t.push(encodeURIComponent(e) + "=" + encodeURIComponent(n));
    } else null === n && t.push(encodeURIComponent(e));
  }

  function v(t) {
    for (var e, n, r = {}, o = t.split("&"), i = 0, u = o.length; i < u; ++i) -1 == (n = (e = o[i]).indexOf("=")) ? r[decodeURIComponent(e)] = "" : r[decodeURIComponent(e.slice(0, n))] = decodeURIComponent(e.slice(n + 1));

    return r;
  }

  function y(t) {
    return /[\/+]json($|[^-\w])/.test(t);
  }

  function _(t) {
    this.req = t, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;
    var e = this.xhr.status;
    1223 === e && (e = 204), this._setStatusProperties(e), this.header = this.headers = function (t) {
      for (var e, n, r, o, i = t.split(/\r?\n/), u = {}, s = 0, a = i.length; s < a; ++s) -1 !== (e = (n = i[s]).indexOf(":")) && (r = n.slice(0, e).toLowerCase(), o = p(n.slice(e + 1)), u[r] = o);

      return u;
    }(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && t._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }

  function g(t, e) {
    var n = this;
    this._query = this._query || [], this.method = t, this.url = e, this.header = {}, this._header = {}, this.on("end", function () {
      var t,
          e = null,
          r = null;

      try {
        r = new _(n);
      } catch (t) {
        return (e = new Error("Parser is unable to parse the response")).parse = !0, e.original = t, n.xhr ? (e.rawResponse = void 0 === n.xhr.responseType ? n.xhr.responseText : n.xhr.response, e.status = n.xhr.status ? n.xhr.status : null, e.statusCode = e.status) : (e.rawResponse = null, e.status = null), n.callback(e);
      }

      n.emit("response", r);

      try {
        n._isResponseOK(r) || (t = new Error(r.statusText || "Unsuccessful HTTP response"));
      } catch (e) {
        t = e;
      }

      t ? (t.original = e, t.response = r, t.status = r.status, n.callback(t, r)) : n.callback(null, r);
    });
  }

  function m(t, e, n) {
    var r = l("DELETE", t);
    return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
  }

  l.serializeObject = h, l.parseString = v, l.types = {
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
    "application/x-www-form-urlencoded": v,
    "application/json": JSON.parse
  }, a(_.prototype), _.prototype._parseBody = function (t) {
    var e = l.parse[this.type];
    return this.req._parser ? this.req._parser(this, t) : (!e && y(this.type) && (e = l.parse["application/json"]), e && t && (t.length || t instanceof Object) ? e(t) : null);
  }, _.prototype.toError = function () {
    var t = this.req,
        e = t.method,
        n = t.url,
        r = "cannot " + e + " " + n + " (" + this.status + ")",
        o = new Error(r);
    return o.status = this.status, o.method = e, o.url = n, o;
  }, l.Response = _, i(g.prototype), u(g.prototype), g.prototype.type = function (t) {
    return this.set("Content-Type", l.types[t] || t), this;
  }, g.prototype.accept = function (t) {
    return this.set("Accept", l.types[t] || t), this;
  }, g.prototype.auth = function (t, e, n) {
    1 === arguments.length && (e = ""), "object" === (void 0 === e ? "undefined" : o(e)) && null !== e && (n = e, e = ""), n || (n = {
      type: "function" == typeof btoa ? "basic" : "auto"
    });
    return this._auth(t, e, n, function (t) {
      if ("function" == typeof btoa) return btoa(t);
      throw new Error("Cannot use basic auth, btoa is not a function");
    });
  }, g.prototype.query = function (t) {
    return "string" != typeof t && (t = h(t)), t && this._query.push(t), this;
  }, g.prototype.attach = function (t, e, n) {
    if (e) {
      if (this._data) throw Error("superagent can't mix .send() and .attach()");

      this._getFormData().append(t, e, n || e.name);
    }

    return this;
  }, g.prototype._getFormData = function () {
    return this._formData || (this._formData = new r.FormData()), this._formData;
  }, g.prototype.callback = function (t, e) {
    if (this._shouldRetry(t, e)) return this._retry();
    var n = this._callback;
    this.clearTimeout(), t && (this._maxRetries && (t.retries = this._retries - 1), this.emit("error", t)), n(t, e);
  }, g.prototype.crossDomainError = function () {
    var t = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
    t.crossDomain = !0, t.status = this.status, t.method = this.method, t.url = this.url, this.callback(t);
  }, g.prototype.buffer = g.prototype.ca = g.prototype.agent = function () {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, g.prototype.pipe = g.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
  }, g.prototype._isHost = function (t) {
    return t && "object" === (void 0 === t ? "undefined" : o(t)) && !Array.isArray(t) && "[object Object]" !== Object.prototype.toString.call(t);
  }, g.prototype.end = function (t) {
    return this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = t || f, this._finalizeQueryString(), this._end();
  }, g.prototype._end = function () {
    var t = this,
        e = this.xhr = l.getXHR(),
        n = this._formData || this._data;
    this._setTimeouts(), e.onreadystatechange = function () {
      var n = e.readyState;

      if (n >= 2 && t._responseTimeoutTimer && clearTimeout(t._responseTimeoutTimer), 4 == n) {
        var r;

        try {
          r = e.status;
        } catch (t) {
          r = 0;
        }

        if (!r) {
          if (t.timedout || t._aborted) return;
          return t.crossDomainError();
        }

        t.emit("end");
      }
    };

    var r = function (e, n) {
      n.total > 0 && (n.percent = n.loaded / n.total * 100), n.direction = e, t.emit("progress", n);
    };

    if (this.hasListeners("progress")) try {
      e.onprogress = r.bind(null, "download"), e.upload && (e.upload.onprogress = r.bind(null, "upload"));
    } catch (t) {}

    try {
      this.username && this.password ? e.open(this.method, this.url, !0, this.username, this.password) : e.open(this.method, this.url, !0);
    } catch (t) {
      return this.callback(t);
    }

    if (this._withCredentials && (e.withCredentials = !0), !this._formData && "GET" != this.method && "HEAD" != this.method && "string" != typeof n && !this._isHost(n)) {
      var o = this._header["content-type"],
          i = this._serializer || l.serialize[o ? o.split(";")[0] : ""];
      !i && y(o) && (i = l.serialize["application/json"]), i && (n = i(n));
    }

    for (var u in this.header) null != this.header[u] && this.header.hasOwnProperty(u) && e.setRequestHeader(u, this.header[u]);

    return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send(void 0 !== n ? n : null), this;
  }, l.agent = function () {
    return new c();
  }, ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (t) {
    c.prototype[t.toLowerCase()] = function (e, n) {
      var r = new l.Request(t, e);
      return this._setDefaults(r), n && r.end(n), r;
    };
  }), c.prototype.del = c.prototype.delete, l.get = function (t, e, n) {
    var r = l("GET", t);
    return "function" == typeof e && (n = e, e = null), e && r.query(e), n && r.end(n), r;
  }, l.head = function (t, e, n) {
    var r = l("HEAD", t);
    return "function" == typeof e && (n = e, e = null), e && r.query(e), n && r.end(n), r;
  }, l.options = function (t, e, n) {
    var r = l("OPTIONS", t);
    return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
  }, l.del = m, l.delete = m, l.patch = function (t, e, n) {
    var r = l("PATCH", t);
    return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
  }, l.post = function (t, e, n) {
    var r = l("POST", t);
    return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
  }, l.put = function (t, e, n) {
    var r = l("PUT", t);
    return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
  };
}, function (t, e, n) {

  function r(t) {
    if (t) return function (t) {
      for (var e in r.prototype) t[e] = r.prototype[e];

      return t;
    }(t);
  }

  t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
  }, r.prototype.once = function (t, e) {
    function n() {
      this.off(t, n), e.apply(this, arguments);
    }

    return n.fn = e, this.on(t, n), this;
  }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
    var n,
        r = this._callbacks["$" + t];
    if (!r) return this;
    if (1 == arguments.length) return delete this._callbacks["$" + t], this;

    for (var o = 0; o < r.length; o++) if ((n = r[o]) === e || n.fn === e) {
      r.splice(o, 1);
      break;
    }

    return this;
  }, r.prototype.emit = function (t) {
    this._callbacks = this._callbacks || {};
    var e = [].slice.call(arguments, 1),
        n = this._callbacks["$" + t];
    if (n) for (var r = 0, o = (n = n.slice(0)).length; r < o; ++r) n[r].apply(this, e);
    return this;
  }, r.prototype.listeners = function (t) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
  }, r.prototype.hasListeners = function (t) {
    return !!this.listeners(t).length;
  };
}, function (t, e, n) {

  var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  },
      o = n(15);

  function i(t) {
    if (t) return function (t) {
      for (var e in i.prototype) t[e] = i.prototype[e];

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
    if (!t || "object" !== (void 0 === t ? "undefined" : r(t))) return this._timeout = t, this._responseTimeout = 0, this;

    for (var e in t) switch (e) {
      case "deadline":
        this._timeout = t.deadline;
        break;

      case "response":
        this._responseTimeout = t.response;
        break;

      default:
        console.warn("Unknown timeout option", e);
    }

    return this;
  }, i.prototype.retry = function (t, e) {
    return 0 !== arguments.length && !0 !== t || (t = 1), t <= 0 && (t = 0), this._maxRetries = t, this._retries = 0, this._retryCallback = e, this;
  };
  var u = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];
  i.prototype._shouldRetry = function (t, e) {
    if (!this._maxRetries || this._retries++ >= this._maxRetries) return !1;
    if (this._retryCallback) try {
      var n = this._retryCallback(t, e);

      if (!0 === n) return !0;
      if (!1 === n) return !1;
    } catch (t) {
      console.error(t);
    }
    if (e && e.status && e.status >= 500 && 501 != e.status) return !0;

    if (t) {
      if (t.code && ~u.indexOf(t.code)) return !0;
      if (t.timeout && "ECONNABORTED" == t.code) return !0;
      if (t.crossDomain) return !0;
    }

    return !1;
  }, i.prototype._retry = function () {
    return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this._end();
  }, i.prototype.then = function (t, e) {
    if (!this._fullfilledPromise) {
      var n = this;
      this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function (t, e) {
        n.end(function (n, r) {
          n ? e(n) : t(r);
        });
      });
    }

    return this._fullfilledPromise.then(t, e);
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
  }, i.prototype.getHeader = i.prototype.get, i.prototype.set = function (t, e) {
    if (o(t)) {
      for (var n in t) this.set(n, t[n]);

      return this;
    }

    return this._header[t.toLowerCase()] = e, this.header[t] = e, this;
  }, i.prototype.unset = function (t) {
    return delete this._header[t.toLowerCase()], delete this.header[t], this;
  }, i.prototype.field = function (t, e) {
    if (null == t) throw new Error(".field(name, val) name can not be empty");

    if (this._data && console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"), o(t)) {
      for (var n in t) this.field(n, t[n]);

      return this;
    }

    if (Array.isArray(e)) {
      for (var r in e) this.field(t, e[r]);

      return this;
    }

    if (null == e) throw new Error(".field(name, val) val can not be empty");
    return "boolean" == typeof e && (e = "" + e), this._getFormData().append(t, e), this;
  }, i.prototype.abort = function () {
    return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
  }, i.prototype._auth = function (t, e, n, r) {
    switch (n.type) {
      case "basic":
        this.set("Authorization", "Basic " + r(t + ":" + e));
        break;

      case "auto":
        this.username = t, this.password = e;
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
    var e = o(t),
        n = this._header["content-type"];
    if (this._formData && console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"), e && !this._data) Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {});else if (t && this._data && this._isHost(this._data)) throw Error("Can't merge these send calls");
    if (e && o(this._data)) for (var r in t) this._data[r] = t[r];else "string" == typeof t ? (n || this.type("form"), n = this._header["content-type"], this._data = "application/x-www-form-urlencoded" == n ? this._data ? this._data + "&" + t : t : (this._data || "") + t) : this._data = t;
    return !e || this._isHost(t) ? this : (n || this.type("json"), this);
  }, i.prototype.sortQuery = function (t) {
    return this._sort = void 0 === t || t, this;
  }, i.prototype._finalizeQueryString = function () {
    var t = this._query.join("&");

    if (t && (this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + t), this._query.length = 0, this._sort) {
      var e = this.url.indexOf("?");

      if (e >= 0) {
        var n = this.url.substring(e + 1).split("&");
        "function" == typeof this._sort ? n.sort(this._sort) : n.sort(), this.url = this.url.substring(0, e) + "?" + n.join("&");
      }
    }
  }, i.prototype._appendQueryString = function () {
    console.trace("Unsupported");
  }, i.prototype._timeoutError = function (t, e, n) {
    if (!this._aborted) {
      var r = new Error(t + e + "ms exceeded");
      r.timeout = e, r.code = "ECONNABORTED", r.errno = n, this.timedout = !0, this.abort(), this.callback(r);
    }
  }, i.prototype._setTimeouts = function () {
    var t = this;
    this._timeout && !this._timer && (this._timer = setTimeout(function () {
      t._timeoutError("Timeout of ", t._timeout, "ETIME");
    }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
      t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
    }, this._responseTimeout));
  };
}, function (t, e, n) {

  var r = n(41);

  function o(t) {
    if (t) return function (t) {
      for (var e in o.prototype) t[e] = o.prototype[e];

      return t;
    }(t);
  }

  t.exports = o, o.prototype.get = function (t) {
    return this.header[t.toLowerCase()];
  }, o.prototype._setHeaderProperties = function (t) {
    var e = t["content-type"] || "";
    this.type = r.type(e);
    var n = r.params(e);

    for (var o in n) this[o] = n[o];

    this.links = {};

    try {
      t.link && (this.links = r.parseLinks(t.link));
    } catch (t) {}
  }, o.prototype._setStatusProperties = function (t) {
    var e = t / 100 | 0;
    this.status = this.statusCode = t, this.statusType = e, this.info = 1 == e, this.ok = 2 == e, this.redirect = 3 == e, this.clientError = 4 == e, this.serverError = 5 == e, this.error = (4 == e || 5 == e) && this.toError(), this.created = 201 == t, this.accepted = 202 == t, this.noContent = 204 == t, this.badRequest = 400 == t, this.unauthorized = 401 == t, this.notAcceptable = 406 == t, this.forbidden = 403 == t, this.notFound = 404 == t, this.unprocessableEntity = 422 == t;
  };
}, function (t, e, n) {

  e.type = function (t) {
    return t.split(/ *; */).shift();
  }, e.params = function (t) {
    return t.split(/ *; */).reduce(function (t, e) {
      var n = e.split(/ *= */),
          r = n.shift(),
          o = n.shift();
      return r && o && (t[r] = o), t;
    }, {});
  }, e.parseLinks = function (t) {
    return t.split(/ *, */).reduce(function (t, e) {
      var n = e.split(/ *; */),
          r = n[0].slice(1, -1);
      return t[n[1].split(/ *= */)[1].slice(1, -1)] = r, t;
    }, {});
  }, e.cleanHeader = function (t, e) {
    return delete t["content-type"], delete t["content-length"], delete t["transfer-encoding"], delete t.host, e && (delete t.authorization, delete t.cookie), t;
  };
}, function (t, e, n) {

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
    this._defaults.forEach(function (e) {
      t[e.fn].apply(t, e.arguments);
    });
  }, t.exports = r;
}, function (t, e, n) {

  (function (t) {
    var r = void 0 !== t && t || "undefined" != typeof self && self || window,
        o = Function.prototype.apply;

    function i(t, e) {
      this._id = t, this._clearFn = e;
    }

    e.setTimeout = function () {
      return new i(o.call(setTimeout, r, arguments), clearTimeout);
    }, e.setInterval = function () {
      return new i(o.call(setInterval, r, arguments), clearInterval);
    }, e.clearTimeout = e.clearInterval = function (t) {
      t && t.close();
    }, i.prototype.unref = i.prototype.ref = function () {}, i.prototype.close = function () {
      this._clearFn.call(r, this._id);
    }, e.enroll = function (t, e) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = e;
    }, e.unenroll = function (t) {
      clearTimeout(t._idleTimeoutId), t._idleTimeout = -1;
    }, e._unrefActive = e.active = function (t) {
      clearTimeout(t._idleTimeoutId);
      var e = t._idleTimeout;
      e >= 0 && (t._idleTimeoutId = setTimeout(function () {
        t._onTimeout && t._onTimeout();
      }, e));
    }, n(44), e.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || void 0, e.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || void 0;
  }).call(this, n(1));
}, function (t, e, n) {

  (function (t, e) {
    !function (t, n) {
      if (!t.setImmediate) {
        var r,
            o,
            i,
            u,
            s,
            a = 1,
            c = {},
            f = !1,
            l = t.document,
            p = Object.getPrototypeOf && Object.getPrototypeOf(t);
        p = p && p.setTimeout ? p : t, "[object process]" === {}.toString.call(t.process) ? r = function (t) {
          e.nextTick(function () {
            d(t);
          });
        } : !function () {
          if (t.postMessage && !t.importScripts) {
            var e = !0,
                n = t.onmessage;
            return t.onmessage = function () {
              e = !1;
            }, t.postMessage("", "*"), t.onmessage = n, e;
          }
        }() ? t.MessageChannel ? ((i = new MessageChannel()).port1.onmessage = function (t) {
          d(t.data);
        }, r = function (t) {
          i.port2.postMessage(t);
        }) : l && "onreadystatechange" in l.createElement("script") ? (o = l.documentElement, r = function (t) {
          var e = l.createElement("script");
          e.onreadystatechange = function () {
            d(t), e.onreadystatechange = null, o.removeChild(e), e = null;
          }, o.appendChild(e);
        }) : r = function (t) {
          setTimeout(d, 0, t);
        } : (u = "setImmediate$" + Math.random() + "$", s = function (e) {
          e.source === t && "string" == typeof e.data && 0 === e.data.indexOf(u) && d(+e.data.slice(u.length));
        }, t.addEventListener ? t.addEventListener("message", s, !1) : t.attachEvent("onmessage", s), r = function (e) {
          t.postMessage(u + e, "*");
        }), p.setImmediate = function (t) {
          "function" != typeof t && (t = new Function("" + t));

          for (var e = new Array(arguments.length - 1), n = 0; n < e.length; n++) e[n] = arguments[n + 1];

          var o = {
            callback: t,
            args: e
          };
          return c[a] = o, r(a), a++;
        }, p.clearImmediate = h;
      }

      function h(t) {
        delete c[t];
      }

      function d(t) {
        if (f) setTimeout(d, 0, t);else {
          var e = c[t];

          if (e) {
            f = !0;

            try {
              !function (t) {
                var e = t.callback,
                    r = t.args;

                switch (r.length) {
                  case 0:
                    e();
                    break;

                  case 1:
                    e(r[0]);
                    break;

                  case 2:
                    e(r[0], r[1]);
                    break;

                  case 3:
                    e(r[0], r[1], r[2]);
                    break;

                  default:
                    e.apply(n, r);
                }
              }(e);
            } finally {
              h(t), f = !1;
            }
          }
        }
      }
    }("undefined" == typeof self ? void 0 === t ? void 0 : t : self);
  }).call(this, n(1), n(2));
}, function (t, e, n) {

  e.decode = e.parse = n(46), e.encode = e.stringify = n(47);
}, function (t, e, n) {

  function r(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }

  t.exports = function (t, e, n, i) {
    e = e || "&", n = n || "=";
    var u = {};
    if ("string" != typeof t || 0 === t.length) return u;
    var s = /\+/g;
    t = t.split(e);
    var a = 1e3;
    i && "number" == typeof i.maxKeys && (a = i.maxKeys);
    var c = t.length;
    a > 0 && c > a && (c = a);

    for (var f = 0; f < c; ++f) {
      var l,
          p,
          h,
          d,
          v = t[f].replace(s, "%20"),
          y = v.indexOf(n);
      y >= 0 ? (l = v.substr(0, y), p = v.substr(y + 1)) : (l = v, p = ""), h = decodeURIComponent(l), d = decodeURIComponent(p), r(u, h) ? o(u[h]) ? u[h].push(d) : u[h] = [u[h], d] : u[h] = d;
    }

    return u;
  };

  var o = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };
}, function (t, e, n) {

  var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  },
      o = function (t) {
    switch (void 0 === t ? "undefined" : r(t)) {
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

  t.exports = function (t, e, n, a) {
    return e = e || "&", n = n || "=", null === t && (t = void 0), "object" === (void 0 === t ? "undefined" : r(t)) ? u(s(t), function (r) {
      var s = encodeURIComponent(o(r)) + n;
      return i(t[r]) ? u(t[r], function (t) {
        return s + encodeURIComponent(o(t));
      }).join(e) : s + encodeURIComponent(o(t[r]));
    }).join(e) : a ? encodeURIComponent(o(a)) + n + encodeURIComponent(o(t)) : "";
  };

  var i = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };

  function u(t, e) {
    if (t.map) return t.map(e);

    for (var n = [], r = 0; r < t.length; r++) n.push(e(t[r], r));

    return n;
  }

  var s = Object.keys || function (t) {
    var e = [];

    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.push(n);

    return e;
  };
}, function (t, e, n) {

  t.exports = function (t) {
    var e = /^\\\\\?\\/.test(t),
        n = /[^\x00-\x80]+/.test(t);
    return e || n ? t : t.replace(/\\/g, "/");
  };
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r = n(4);
  Object.keys(r).forEach(function (t) {
    "default" !== t && "__esModule" !== t && Object.defineProperty(e, t, {
      enumerable: !0,
      get: function () {
        return r[t];
      }
    });
  });
  var o = c(n(19)),
      i = c(n(51)),
      u = c(n(52)),
      s = c(n(53)),
      a = c(n(54));

  function c(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  r.SCHEMES.http = o.default, r.SCHEMES.https = i.default, r.SCHEMES.mailto = u.default, r.SCHEMES.urn = s.default, r.SCHEMES["urn:uuid"] = a.default;
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r = n(17);
  e.default = (0, r.buildExps)(!0);
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r,
      o = n(19),
      i = (r = o) && r.__esModule ? r : {
    default: r
  };
  e.default = {
    scheme: "https",
    domainHost: i.default.domainHost,
    parse: i.default.parse,
    serialize: i.default.serialize
  };
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r,
      o = n(4),
      i = n(18),
      u = (r = i) && r.__esModule ? r : {
    default: r
  },
      s = n(6);

  var a = {},
      c = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]",
      f = "[0-9A-Fa-f]",
      l = (0, s.subexp)((0, s.subexp)("%[EFef][0-9A-Fa-f]%" + f + f + "%" + f + f) + "|" + (0, s.subexp)("%[89A-Fa-f][0-9A-Fa-f]%" + f + f) + "|" + (0, s.subexp)("%" + f + f)),
      p = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]",
      h = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]",
      d = (0, s.merge)(h, '[\\"\\\\]'),
      v = (0, s.subexp)(p + "+" + (0, s.subexp)("\\." + p + "+") + "*"),
      y = (0, s.subexp)("\\\\" + d),
      _ = (0, s.subexp)(h + "|" + y),
      g = (0, s.subexp)('\\"' + _ + '*\\"'),
      m = (0, s.subexp)(c + "|" + l + "|[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"),
      b = (0, s.subexp)(v + "|\\[[\\x21-\\x5A\\x5E-\\x7E]*\\]"),
      w = (0, s.subexp)(v + "|" + g),
      x = (0, s.subexp)(w + "\\@" + b),
      E = (0, s.subexp)(x + (0, s.subexp)("\\," + x) + "*"),
      O = (0, s.subexp)(m + "*"),
      C = O,
      S = (0, s.subexp)(O + "\\=" + C),
      T = (0, s.subexp)(S + (0, s.subexp)("\\&" + S) + "*"),
      j = (0, s.subexp)("\\?" + T),
      A = (new RegExp(c, "g")),
      I = new RegExp(l, "g"),
      P = new RegExp((0, s.merge)("[^]", p, "[\\.]", '[\\"]', d), "g"),
      R = (new RegExp((0, s.merge)("[^]", p, "[\\.]", "[\\[]", "[\\x21-\\x5A\\x5E-\\x7E]", "[\\]]"), "g"), new RegExp((0, s.merge)("[^]", c, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g")),
      k = R;

  function D(t) {
    var e = (0, o.pctDecChars)(t);
    return e.match(A) ? e : t;
  }

  e.default = {
    scheme: "mailto",
    parse: function (t, e) {
      var n = t.to = t.path ? t.path.split(",") : [];

      if (t.path = void 0, t.query) {
        for (var r = !1, i = {}, s = t.query.split("&"), a = 0, c = s.length; a < c; ++a) {
          var f = s[a].split("=");

          switch (f[0]) {
            case "to":
              for (var l = f[1].split(","), p = 0, h = l.length; p < h; ++p) n.push(l[p]);

              break;

            case "subject":
              t.subject = (0, o.unescapeComponent)(f[1], e);
              break;

            case "body":
              t.body = (0, o.unescapeComponent)(f[1], e);
              break;

            default:
              r = !0, i[(0, o.unescapeComponent)(f[0], e)] = (0, o.unescapeComponent)(f[1], e);
          }
        }

        r && (t.headers = i);
      }

      t.query = void 0;

      for (var d = 0, v = n.length; d < v; ++d) {
        var y = n[d].split("@");
        if (y[0] = (0, o.unescapeComponent)(y[0]), e.unicodeSupport) y[1] = (0, o.unescapeComponent)(y[1], e).toLowerCase();else try {
          y[1] = u.default.toASCII((0, o.unescapeComponent)(y[1], e).toLowerCase());
        } catch (e) {
          t.error = t.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
        }
        n[d] = y.join("@");
      }

      return t;
    },
    serialize: function (t, e) {
      var n = (0, s.toArray)(t.to);

      if (n) {
        for (var r = 0, i = n.length; r < i; ++r) {
          var c = String(n[r]),
              f = c.lastIndexOf("@"),
              l = c.slice(0, f).replace(I, D).replace(I, s.toUpperCase).replace(P, o.pctEncChar),
              p = c.slice(f + 1);

          try {
            p = e.iri ? u.default.toUnicode(p) : u.default.toASCII((0, o.unescapeComponent)(p, e).toLowerCase());
          } catch (n) {
            t.error = t.error || "Email address's domain name can not be converted to " + (e.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
          }

          n[r] = l + "@" + p;
        }

        t.path = n.join(",");
      }

      var h = t.headers = t.headers || {};
      t.subject && (h.subject = t.subject), t.body && (h.body = t.body);
      var d = [];

      for (var v in h) h[v] !== a[v] && d.push(v.replace(I, D).replace(I, s.toUpperCase).replace(R, o.pctEncChar) + "=" + h[v].replace(I, D).replace(I, s.toUpperCase).replace(k, o.pctEncChar));

      return d.length && (t.query = d.join("&")), t;
    }
  };
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r = n(4),
      o = "(?:[0-9A-Za-z][0-9A-Za-z\\-]{1,31})",
      i = new RegExp("^urn\\:(" + o + ")$"),
      u = (/^([^\:]+)\:(.*)/),
      s = /[\x00-\x20\\\"\&\<\>\[\]\^\`\{\|\}\~\x7F-\xFF]/g;
  e.default = {
    scheme: "urn",
    parse: function (t, e) {
      var n = t.path && t.path.match(u);

      if (n) {
        var o = "urn:" + n[1].toLowerCase(),
            i = r.SCHEMES[o];
        i || (i = r.SCHEMES[o] = {
          scheme: o,
          parse: function (t, e) {
            return t;
          },
          serialize: r.SCHEMES.urn.serialize
        }), t.scheme = o, t.path = n[2], t = i.parse(t, e);
      } else t.error = t.error || "URN can not be parsed.";

      return t;
    },
    serialize: function (t, e) {
      var n = t.scheme || e.scheme;

      if (n && "urn" !== n) {
        var o = n.match(i) || ["urn:" + n, n];
        t.scheme = "urn", t.path = o[1] + ":" + (t.path ? t.path.replace(s, r.pctEncChar) : "");
      }

      return t;
    }
  };
}, function (t, e, n) {

  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  var r = n(4),
      o = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
  e.default = {
    scheme: "urn:uuid",
    parse: function (t, e) {
      return e.tolerant || t.path && t.path.match(o) || (t.error = t.error || "UUID is not valid."), t;
    },
    serialize: function (t, e) {
      return e.tolerant || t.path && t.path.match(o) ? t.path = (t.path || "").toLowerCase() : t.scheme = void 0, r.SCHEMES.urn.serialize(t, e);
    }
  };
}]);

/* eslint-env browser */

const getCurrDir = () => window.location.href.replace(/(index\.html)?#.*$/, '');

const getMetaProp = function getMetaProp(lang, metadataObj, properties, allowObjects) {
  let prop;
  properties = typeof properties === 'string' ? [properties] : properties;
  lang.some(lan => {
    const p = properties.slice(0);
    let strings = metadataObj['localization-strings'][lan];

    while (strings && p.length) {
      strings = strings[p.shift()];
    } // Todo: Fix this allowance for allowObjects (as it does not properly
    //        fallback if an object is returned from a language because
    //        that language is missing content and is only thus returning
    //        an object)


    prop = allowObjects || typeof strings === 'string' ? strings : undefined;
    return prop;
  });
  return prop;
}; // Use the following to dynamically add specific file schema in place of
//    generic table schema if validating against files.jsonschema
//  filesSchema.properties.groups.items.properties.files.items.properties.
//      file.anyOf.splice(1, 1, {$ref: schemaFile});
// Todo: Allow use of dbs and fileGroup together in base directories?

const getMetadata = async (file, property, basePath) => {
  return (await JsonRefs.resolveRefsAt((basePath || getCurrDir()) + file + (property ? '#/' + property : ''), {
    loaderOptions: {
      processContent(res, callback) {
        callback(undefined, JSON.parse(res.text || // `.metadata` not a recognized extension, so
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
  const ret = {
    // field,
    fieldName: getFieldAliasOrName(field)
  };
  const fieldInfo = metadataObj.fields[field];
  let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];

  if (fieldValueAliasMap) {
    if (fieldValueAliasMap.localeKey) {
      fieldValueAliasMap = getMetaProp(lang, metadataObj, fieldValueAliasMap.localeKey.split('/'), true);
    }

    ret.rawFieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
    ret.aliases = []; // Todo: We could use `prefer_alias` but algorithm below may cover
    //    needed cases

    if (fieldSchema.enum && fieldSchema.enum.length) {
      fieldSchema.enum.forEach(enm => {
        ret.aliases.push(getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true));

        if (enm in fieldValueAliasMap && // Todo: We could allow numbers here too, but crowds
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
        } // We'll assume the longest version is best for auto-complete


        ret.aliases.push(...aliases.filter(v => aliases.every(x => x === v || !x.toLowerCase().startsWith(v.toLowerCase()))).map(v => v + ' (' + key + ')') // Todo: i18nize
        );
      });
    }

    ret.fieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap)); // ret.aliases.sort();
  }

  ret.fieldSchema = fieldSchema;
  ret.fieldSchemaIndex = fieldSchemaIndex;
  ret.preferAlias = fieldInfo.prefer_alias;
  ret.lang = fieldInfo.lang;
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
    } = browseFieldSetObject; // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
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
    }); // eslint-disable-line node/no-callback-literal
  });
}; // Todo: Incorporate other methods into this class

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
      const localeStrings = metadataObj && metadataObj['localization-strings']; // If this is a localized field (e.g., enum), we don't want
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
        // eslint-disable-line node/no-callback-literal
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
          }); // eslint-disable-line node/no-callback-literal
        });
      } else {
        // eslint-disable-next-line node/callback-return
        cb({
          applicableField,
          targetLanguage,
          onByDefault,
          metaApplicableField
        }); // eslint-disable-line node/no-callback-literal
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

let path, babelRegister;

if (typeof process !== 'undefined') {
  /* eslint-disable node/global-require */
  path = require('path');
  babelRegister = require('@babel/register');
  /* eslint-enable node/global-require */
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

  const localeFromFileData = lan => filesObj['localization-strings'][lan];

  const imfFile = IMFClass({
    locales: lang.map(localeFromFileData),
    fallbackLocales: fallbackLanguages.map(localeFromFileData)
  });
  const lf = imfFile.getFormatter();
  let fileData;
  const fileGroup = filesObj.groups.find(fg => {
    fileData = fg.files.find(file => work === lf(['workNames', fg.id, file.name]));
    return Boolean(fileData);
  }); // This is not specific to the work, but we export it anyways

  const groupsToWorks = filesObj.groups.map(fg => {
    return {
      name: lf({
        key: fg.name.localeKey,
        fallback: true
      }),
      workNames: fg.files.map(file => {
        return lf(['workNames', fg.id, file.name]);
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
  const [schemaObj, pluginObjects] = await Promise.all([getMetadata(schemaFile, schemaProperty, basePath), getPlugins ? Promise.all(pluginPaths.map(pluginPath => {
    if (typeof process !== 'undefined') {
      pluginPath = path.resolve(path.join(process.cwd(), 'node_modules/textbrowser/server', pluginPath));
      babelRegister({
        presets: ['@babel/env']
      });
      return Promise.resolve().then(() => {
        return require(pluginPath); // eslint-disable-line node/global-require, import/no-dynamic-require
      }).catch(err => {
        // E.g., with tooltips plugin
        console.log('err', err);
      });
    } // eslint-disable-next-line node/no-unsupported-features/es-syntax, no-unsanitized/method


    return import(pluginPath);
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

  if (languages && // Avoid all this processing if this is not the specific call requiring
  pluginsForWork) {
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
          lf,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          lf,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice( // Todo: Allow default placement overriding for
        //    non-plugins
        placement === 'end' ? Number.POSITIVE_INFINITY // push
        : placement, 0, {
          field: `${this.namespace}-plugin-${field}`,
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
    lf,
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
  target.languages = source.languages || new URL('../appdata/languages.json', // Todo: Substitute with `import.meta.url`
  new URL('node_modules/textbrowser/resources/index.js', location)).href;
  target.serviceWorkerPath = source.serviceWorkerPath || `sw.js?pathToUserJSON=${encodeURIComponent(target.userJSON)}&stylesheets=${JSON.stringify(target.stylesheets || [])}`;
  target.files = source.files || 'files.json';
  target.namespace = source.namespace || 'textbrowser';
  return target;
}; // (Unless skipped in code, will wait between install
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
    const newWorker = r.installing; // statechange won't catch this installing event as already installing

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
          console.log('Installation status', state); // Todo: Try updating again if get redundant here

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
          }); // r.active is also available for mere "activating"
          //    as we are now

          return;

        case 'finishedActivate':
          logger.addLogEntry({
            text: 'Activate: Finished...'
          }); // Still not controlled even after activation is
          //    ready, so refresh page
          // Seems to be working (unlike `location.replace`),
          //  but if problems, could add `true` but as forces
          //  from server not cache, what will happen here? (also
          //  `controller` may be `null` with force-reload)

          location.reload(); // location.replace(location); // Avoids adding to browser history)
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
    const worker = r.installing || r.waiting || r.active; // Failed or new worker in use

    if (worker && worker.state === 'redundant') {
      // Todo: We could call `register()` below instead (on a timeout)?
      await dialogs.alert(`
There was likely an error installing. Click "ok" to try again.
(Error code: Service worker is redundant)
`);
      location.reload(); // listenForWorkerUpdate({r, logger});
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
      }); // We might just let the user go on without a reload, but
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
}; // Keep in this file as may wish to avoid using for server (while still
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
  console.log('--ready to register service worker', serviceWorkerPath); // `persist` will grandfather non-persisted caches, so if we don't end up
  //    using `install` event for dynamic items, we could put the service worker
  //    registration at the beginning of the file without waiting for persistence
  //    approval (or at least after rendering page to avoid visual "jankiness"/
  //    competititon for network for low-bandwidth sites); however,
  //    as we want to show a dialog about permissions first, we wait until here.

  let r;

  try {
    r = await navigator.serviceWorker.register(serviceWorkerPath);
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
  }); // Todo: Catch errors?

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
    }, [languages.getLanguageFromCode(code)]])]], $('#main'));

    if (history.state && typeof history.state === 'object') {
      deserialize(document.querySelector('#languageSelectionContainer'), history.state);
    }
  } // Todo: Add in Go button (with 'submitgo' localization string) to
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
var workSelect = (({
  groups,
  lf,
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
  }, groups.map((group, i) => ['div', [i > 0 ? ['br', 'br', 'br'] : '', ['div', [lf({
    key: group.directions.localeKey,
    fallback: true
  })]], ['br'], ['select', {
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
    value: lf(['workNames', group.id, fileName])
  }, [getNextAlias()]])]] // Todo: Add in Go button (with 'submitgo' localization string) to
  //    avoid need for pull-down if using first selection?
  ]]), $('#main'));

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
  form: $('form#browse'),
  // Todo: We don't need any default once random
  //    functionality is completed
  random: $('#rand') || {},
  checkboxes: $$('input[type=checkbox]')
});

var workDisplay = {
  bdo: ({
    fallbackDirection,
    message
  }) => // Displaying as div with inline display instead of span since
  //    Firefox puts punctuation at left otherwise (bdo dir
  //    seemed to have issues in Firefox)
  ['div', {
    style: 'display: inline; direction: ' + fallbackDirection
  }, [message]],
  columnsTable: ({
    ld,
    fieldInfo,
    $p,
    le,
    iil,
    l,
    metadataObj,
    preferredLocale,
    schemaItems,
    fieldMatchesLocale
  }) => ['table', {
    border: '1',
    cellpadding: '5',
    align: 'center'
  }, [['tr', [['th', [ld('fieldno')]], ['th', {
    align: 'left',
    width: '20'
  }, [ld('field_enabled')]], ['th', [ld('field_title')]], ['th', [ld('fieldinterlin')]], ['th', [ld('fieldcss')]]
  /*
        Todo: Support search?
        ,
        ['th', [
            ld('fieldsearch')
        ]]
        */
  ]], ...fieldInfo.map((fieldInfoItem, i) => {
    const idx = i + 1;
    const checkedIndex = 'checked' + idx;
    const fieldIndex = 'field' + idx;
    const fieldParam = $p.get(fieldIndex);
    return ['tr', [// Todo: Get Jamilih to accept numbers and
    //    booleans (`toString` is too dangerous)
    ['td', [String(idx)]], le('check-columns-to-browse', 'td', 'title', {}, [le('yes', 'input', 'value', {
      class: 'fieldSelector',
      id: checkedIndex,
      name: iil('checked') + idx,
      checked: $p.get(checkedIndex) !== l('no') && ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
      type: 'checkbox'
    })]), le('check-sequence', 'td', 'title', {}, [['select', {
      name: iil('field') + idx,
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
    })]]), ['td', [// Todo: Make as tag selector with fields as options
    le('interlinear-tips', 'input', 'title', {
      name: iil('interlin') + idx,
      value: $p.get('interlin' + idx)
    }) // Todo: Could allow i18n of numbers here
    ]], ['td', [// Todo: Make as CodeMirror-highlighted CSS
    ['input', {
      name: iil('css') + idx,
      value: $p.get('css' + idx)
    }]]]
    /*
            ,
            ['td', [ // Todo: Allow plain or regexp searching
                ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
            ]]
            */
    ]];
  }), ['tr', [['td', {
    colspan: 3
  }, [le('check_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        $$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = true;
        });
      }

    }
  }), le('uncheck_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        $$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = false;
        });
      }

    }
  }), le('checkmark_locale_fields_only', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        fieldInfo.forEach(({
          field
        }, i) => {
          const idx = i + 1; // The following is redundant with 'field' but may need to
          //     retrieve later out of order?

          const fld = $('#field' + idx).selectedOptions[0].dataset.name;
          $('#checked' + idx).checked = fieldMatchesLocale(fld);
        });
      }

    }
  })]]]]]],
  advancedFormatting: ({
    ld,
    il,
    l,
    lo,
    le,
    $p,
    hideFormattingSection
  }) => ['td', {
    id: 'advancedformatting',
    style: {
      display: hideFormattingSection ? 'none' : 'block'
    }
  }, [['h3', [ld('advancedformatting')]], ['label', [ld('textcolor'), nbsp2, ['select', {
    name: il('colorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color])
    };

    if ($p.get('colorName') === l(['param_values', 'colors', color]) || i === 1 && !$p.has('colorName')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'colors', color], atts);
  })]]], ['label', [nbsp, ld('or_entercolor'), nbsp2, ['input', {
    name: il('color'),
    type: 'text',
    value: $p.get('color') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [ld('backgroundcolor'), nbsp2, ['select', {
    name: il('bgcolorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color])
    };

    if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) || i === 14 && !$p.has('bgcolorName')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'colors', color], atts);
  })]]], ['label', [nbsp, ld('or_entercolor'), nbsp2, ['input', {
    name: il('bgcolor'),
    type: 'text',
    value: $p.get('bgcolor') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [ld('text_font'), nbsp2, // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
  ['select', {
    name: il('fontSeq'),
    dir: 'ltr'
  }, fonts.map((fontSeq, i) => {
    const atts = {
      value: fontSeq
    };

    if ($p.get('fontSeq') === fontSeq || i === 7 && !$p.has('fontSeq')) {
      atts.selected = 'selected';
    }

    return ['option', atts, [fontSeq]];
  })]]], ['br'], ['br'], ['label', [ld('font_style'), nbsp2, ['select', {
    name: il('fontstyle')
  }, ['italic', 'normal', 'oblique'].map((fontstyle, i) => {
    const atts = {
      value: l(['param_values', 'fontstyle', fontstyle])
    };

    if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) || i === 1 && !$p.has('fontstyle')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'fontstyle', fontstyle], atts);
  })]]], ['br'], ['div', [ld('font_variant'), nbsp3, ['label', [['input', {
    name: il('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'normal']),
    checked: $p.get('fontvariant') !== ld(['param_values', 'fontvariant', 'small-caps'])
  }], ld(['param_values', 'fontvariant', 'normal']), nbsp]], ['label', [['input', {
    name: il('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'small-caps']),
    checked: $p.get('fontvariant') === ld(['param_values', 'fontvariant', 'small-caps'])
  }], ld(['param_values', 'fontvariant', 'small-caps']), nbsp]]]], ['br'], ['label', [// Todo: i18n and allow for normal/bold pulldown and float input?
  ld('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2, ['input', {
    name: il('fontweight'),
    type: 'text',
    value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [ld('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2, ['input', {
    name: il('fontsize'),
    type: 'text',
    value: $p.get('fontsize'),
    size: '7',
    maxlength: '12'
  }]]], ['br'], // Todo: i18nize title and values?
  // Todo: remove hard-coded direction if i18nizing
  ['label', {
    dir: 'ltr'
  }, [ld('font_stretch'), nbsp, ['select', {
    name: il('fontstretch')
  }, ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(stretch => {
    const atts = {
      value: ld(['param_values', 'font-stretch', stretch])
    };

    if ($p.get('fontstretch') === stretch || !$p.has('fontstretch') && stretch === 'normal') {
      atts.selected = 'selected';
    }

    return ['option', atts, [ld(['param_values', 'font-stretch', stretch])]];
  })]]],
  /**/
  ['br'], ['br'], ['label', [ld('letter_spacing'), ' (normal, .9em, -.05cm): ', ['input', {
    name: il('letterspacing'),
    type: 'text',
    value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [ld('line_height'), ' (normal, 1.5, 22px, 150%): ', ['input', {
    name: il('lineheight'),
    type: 'text',
    value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['br'], le('tableformatting_tips', 'h3', 'title', {}, [ld('tableformatting')]), ['div', [ld('header_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('header'),
    type: 'radio',
    value: val,
    checked: $p.get('header') === val || !$p.has('header') && i === 1
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['div', [ld('footer_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('footer'),
    type: 'radio',
    value: val,
    checked: $p.get('footer') === val || !$p.has('footer') && i === 2
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['label', [['input', {
    name: il('headerfooterfixed'),
    type: 'checkbox',
    value: l('yes'),
    checked: $p.get('headerfooterfixed') === l('yes')
  }], nbsp2, ld('headerfooterfixed-wishtoscroll')]], ['br'], ['div', [ld('caption_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('caption'),
    type: 'radio',
    value: val,
    checked: $p.get('caption') === val || !$p.has('caption') && i === 2
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['br'], ['div', [ld('table_wborder'), nbsp2, ['label', [['input', {
    name: il('border'),
    type: 'radio',
    value: '1',
    checked: $p.get('border') !== '0'
  }], ld('yes'), nbsp3]], ['label', [['input', {
    name: il('border'),
    type: 'radio',
    value: '0',
    checked: $p.get('border') === '0'
  }], ld('no')]]]], ['div', [ld('interlin_repeat_field_names'), nbsp2, ['label', [['input', {
    name: il('interlintitle'),
    type: 'radio',
    value: '1',
    checked: $p.get('interlintitle') !== '0'
  }], ld('yes'), nbsp3]], ['label', [['input', {
    name: il('interlintitle'),
    type: 'radio',
    value: '0',
    checked: $p.get('interlintitle') === '0'
  }], ld('no')]]]], ['label', [ld('interlintitle_css'), nbsp2, ['input', {
    name: il('interlintitle_css'),
    type: 'text',
    value: $p.get('interlintitle_css') || '',
    size: '12'
  }]]], ['br'],
  /*
      ['br'],
      ['label', [
          ['input', {
              name: il('transpose'),
              type: 'checkbox',
              value: l('yes'),
              checked: $p.get('transpose') === l('yes')
          }],
          nbsp2, ld('transpose')
      ]],
      */
  ['br'], le('pageformatting_tips', 'h3', 'title', {}, [ld('pageformatting')]),
  /*
      ['label', [
          ld('speech_controls'), nbsp2,
          ['label', [
              ['input', {
                  name: il('speech'),
                  type: 'radio',
                  value: '1',
                  checked: $p.get('speech') === '1'
              }],
              ld('yes'), nbsp3
          ]],
          ['label', [
              ['input', {
                  name: il('speech'),
                  type: 'radio',
                  value: '0',
                  checked: $p.get('speech') !== '1'
              }],
              ld('no')
          ]]
      ]],
      ['br'],
      */
  ['label', [ld('page_css'), nbsp2, ['textarea', {
    name: il('pagecss'),
    title: l('page_css_tips'),
    value: $p.get('pagecss')
  }]]], ['br'], le('outputmode_tips', 'label', 'title', {}, [ld('outputmode'), nbsp2, // Todo: Could i18nize, but would need smaller values
  ['select', {
    name: il('outputmode')
  }, ['table', 'div' // , 'json-array',
  // 'json-object'
  ].map(mode => {
    const atts = {
      value: mode
    };

    if ($p.get('outputmode') === mode) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'outputmode', mode], atts);
  })]])]],

  addRandomFormFields({
    il,
    ld,
    l,
    le,
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
    }, [['br'], ld('or'), ['br'], ['br']]]], [['td', {
      colspan: 12,
      align: 'center'
    }, [// Todo: Could allow random with fixed starting and/or ending range
    ['label', [ld('rnd'), nbsp3, ['input', {
      id: 'rand',
      name: il('rand'),
      type: 'checkbox',
      value: l('yes'),
      checked: $p.get('rand') === l('yes')
    }]]], nbsp3, ['label', [ld('verses-context'), nbsp, ['input', {
      name: il('context'),
      type: 'number',
      min: 1,
      size: 4,
      value: $p.get('context')
    }]]], nbsp3, le('view-random-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURL(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
            type: 'randomResult'
          }));
          $('#randomURL').value = url;
        }

      }
    }), ['input', {
      id: 'randomURL',
      type: 'text'
    }]]]]].forEach(addRowContent);
  },

  getPreferences: ({
    languageParam,
    lf,
    paramsSetter,
    replaceHash,
    getFieldAliasOrNames,
    work,
    langs,
    imfl,
    l,
    localizeParamNames,
    namespace,
    hideFormattingSection,
    groups
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
        $('#advancedformatting').style.display = checked ? 'none' : 'block';
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
      value: lan.code
    };

    if (langCodes && langCodes.includes(lan.code)) {
      atts.selected = 'selected';
    }

    return ['option', atts, [imfl(['languages', lan.code])]];
  })]]], ['div', [['button', {
    title: l('bookmark_generation_tooltip'),
    $on: {
      async click() {
        // Todo: Give option to edit (keywords and work URLs)
        const date = Date.now();
        const ADD_DATE = date;
        const LAST_MODIFIED = date;
        const blob = new Blob([new XMLSerializer().serializeToString(jml({
          $document: {
            $DOCTYPE: {
              name: 'NETSCAPE-Bookmark-file-1'
            },
            title: l('Bookmarks'),
            body: [['h1', [l('Bookmarks_Menu')]], ...(await getFieldAliasOrNames()).flatMap(({
              groupName,
              worksToFields
            }) => {
              return [['dt', [['h3', {
                ADD_DATE,
                LAST_MODIFIED
              }, [groupName]]]], ['dl', [['p'], ...worksToFields.map(({
                fieldAliasOrNames,
                workName,
                shortcut: SHORTCUTURL
              }) => {
                // Todo (low): Add anchor, etc. (until handled by `work-startEnd`); &aqdas-anchor1-1=2&anchorfield1=Paragraph
                // Todo: option for additional browse field groups (startEnd2, etc.)
                // Todo: For link text, use `heading` or `alias` from metadata files in place of workName (requires loading all metadata files though)
                // Todo: Make Chrome NativeExt add-on to manipulate its search engines (to read a bookmarks file from Firefox properly, i.e., including keywords) https://www.makeuseof.com/answers/export-google-chrome-search-engines-address-bar/
                const paramsCopy = paramsSetter(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
                  fieldAliasOrNames,
                  workName: work,
                  // Delete work of current page
                  type: 'shortcutResult'
                }));
                const url = replaceHash(paramsCopy) + `&work=${workName}&${workName}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here

                return ['dt', [['a', {
                  href: url,
                  ADD_DATE,
                  LAST_MODIFIED,
                  SHORTCUTURL
                }, [workName]]]];
              })]]];
            })]
          }
        })).replace( // Chrome has a quirk that requires this (and not
        //   just any whitespace)
        // We're not getting the keywords with Chrome,
        //   but at least usable for bookmarks (though
        //   not the groups apparently)
        /<dt>/g, '\n<dt>')], {
          type: 'text/html'
        });
        const url = window.URL.createObjectURL(blob);
        const a = jml('a', {
          hidden: true,
          download: 'bookmarks.html',
          href: url
        }, $('#main'));
        a.click();
        URL.revokeObjectURL(url);
      }

    }
  }, [l('Generate_bookmarks')]]]]]],

  addBrowseFields({
    browseFields,
    fieldInfo,
    ld,
    i,
    iil,
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

    [// Todo: Separate formatting to CSS
    i > 0 ? [['td', {
      colspan: 12,
      align: 'center'
    }, [['br'], ld('or'), ['br'], ['br']]]] : '', [...(() => {
      const addBrowseFieldSet = setType => browseFields.reduce((rowContent, {
        fieldName,
        aliases,
        fieldSchema: {
          minimum,
          maximum
        }
      }, j) => {
        // Namespace by work for sake of browser auto-complete caching
        const name = work + '-' + iil(setType) + (i + 1) + '-' + (j + 1);
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

      return [addBrowseFieldSet('start'), ['td', [['b', [ld('to')]], nbsp3]], addBrowseFieldSet('end')];
    })(), ['td', [browseFields.length > 1 ? ld('versesendingdataoptional') : '']]], [['td', {
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
      const name = work + '-' + iil('anchor') + (i + 1) + '-' + (j + 1);
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
      }, [ld('anchored-at') + nbsp3]]]
    }), ['td', [['label', [ld('field') + nbsp2, ['select', {
      name: iil('anchorfield') + (i + 1),
      size: '1'
    }, fieldInfo.map(({
      fieldAliasOrName
    }) => {
      const val = $p.get(iil('anchorfield') + (i + 1), true);

      if (val === fieldAliasOrName) {
        return ['option', {
          selected: true
        }, [fieldAliasOrName]];
      }

      return ['option', [fieldAliasOrName]];
    })]]]]]]]]]]]]].forEach(addRowContent);
  },

  main({
    lf,
    languageParam,
    l,
    namespace,
    heading,
    fallbackDirection,
    imfl,
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
    il,
    le,
    ld,
    iil,
    fieldMatchesLocale,
    preferredLocale,
    schemaItems,
    content,
    groups
  }) {
    const work = $p.get('work');

    const serializeParamsAsURLWithData = ({
      type
    }) => {
      return serializeParamsAsURL(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
        type
      }));
    };

    const lo = (key, atts) => ['option', atts, [l({
      key,

      fallback({
        message
      }) {
        atts.dir = fallbackDirection;
        return message;
      }

    })]]; // Returns element with localized or fallback attribute value (as Jamilih);
    //   also adds direction


    jml('div', {
      class: 'focus'
    }, [['div', {
      style: 'float: left;'
    }, [['button', {
      $on: {
        click() {
          const prefs = $('#preferences');
          prefs.hidden = !prefs.hidden;
        }

      }
    }, [l('Preferences')]], Templates.workDisplay.getPreferences({
      languageParam,
      lf,
      paramsSetter,
      replaceHash,
      getFieldAliasOrNames,
      work,
      langs,
      imfl,
      l,
      localizeParamNames,
      namespace,
      groups,
      hideFormattingSection
    })]], ['h2', [heading]], ['br'], ['form', {
      id: 'browse',
      $custom: {
        $submit() {
          const thisParams = serializeParamsAsURLWithData({
            type: 'saveSettings'
          }).replace(/^[^#]*#/, ''); // Don't change the visible URL

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
      name: il('browse')
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
      ld,
      fieldInfo,
      $p,
      le,
      iil,
      l,
      metadataObj,
      preferredLocale,
      schemaItems,
      fieldMatchesLocale
    }), le('save-settings-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURLWithData({
            type: 'saveSettings'
          });
          $('#settings-URL').value = url;
        }

      }
    }), ['input', {
      id: 'settings-URL'
    }], ['br'], ['button', {
      $on: {
        async click(e) {
          e.preventDefault();
          const paramsCopy = paramsSetter(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
            workName: work,
            // Delete work of current page
            type: 'startEndResult'
          }));
          const url = replaceHash(paramsCopy) + `&work=${work}&${work}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here

          try {
            await navigator.clipboard.writeText(url);
          } catch (err) {// User rejected
          }
        }

      }
    }, [l('Copy_shortcut_URL')]]]], Templates.workDisplay.advancedFormatting({
      ld,
      il,
      l,
      lo,
      le,
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
                                    name: il('arw') + i,
                                    type: 'text',
                                    value: '',
                                    size: '7',
                                    maxlength: '12'
                                }]
                            ]}
                        )} :
                        ''
                    */
    ]]]]]], ['p', {
      align: 'center'
    }, [le('submitgo', 'input', 'value', {
      type: 'submit'
    })]]]]], $('#main'));
  }

};

var resultsDisplayServerOrClient = {
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
    return startRange + // l('to').toLowerCase() + ' ' +
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
      }], ['td'], // , {class: 'td'} // Too much data to add class to each
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
      }] // ['colgroup', {class: 'colgroup'}],
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
      }] // ['div', {class: 'colgroup', style: 'display: table-column-group;'}],
      // ['div', {class: 'col', style: 'display: table-column;'}]
      ],
      'json-array': 'json',
      'json-object': 'json'
    };
    const outputmode = $p.get('outputmode', true); // Why not $pRaw?

    const tableElems = tableOptions[Object.keys(tableOptions).includes(outputmode) // Exclude __proto__ or whatever
    ? outputmode : 'table' // Default
    ];

    if (tableElems === 'json') {
      throw new Error('JSON support is currently not available');
    }

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

    const addAtts = ([el, atts], newAtts) => [el, _objectSpread2(_objectSpread2({}, atts), newAtts)];

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

var resultsDisplayClient = {
  anchorRowCol({
    anchorRowCol
  }) {
    return $('#' + anchorRowCol);
  },

  anchors({
    escapedRow,
    escapedCol
  }) {
    const sel = 'tr[data-row="' + escapedRow + '"]' + (escapedCol ? '> td[data-col="' + escapedCol + '"]' : '');
    return $(sel);
  },

  main(...args) {
    let html;

    try {
      html = Templates.resultsDisplayServerOrClient.main(...args);
    } catch (err) {
      if (err.message === 'JSON support is currently not available') {
        dialogs.alert(err.message);
      }
    }

    jml(...html, $('#main'));
  }

};

/* eslint-env browser */
const Templates = {
  languageSelect,
  workSelect,
  workDisplay,
  resultsDisplayServerOrClient,
  resultsDisplayClient,

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
  }

};
Templates.permissions = {
  versionChange() {
    $('#versionChange').showModal();
  },

  addLogEntry({
    text
  }) {
    const installationDialog = $('#installationLogContainer');

    try {
      installationDialog.showModal();
      const container = $('#dialogContainer');
      container.hidden = false;
    } catch (err) {// May already be open
    }

    $('#installationLog').append(text + '\n');
  },

  exitDialogs() {
    const container = $('#dialogContainer');

    if (container) {
      container.hidden = true;
    }
  },

  dbError({
    type,
    escapedErrorMessage
  }) {
    if (type) {
      jml('span', [type, ' ', escapedErrorMessage], $('#dbError'));
    }

    $('#dbError').showModal();
  },

  errorRegistering(escapedErrorMessage) {
    if (escapedErrorMessage) {
      jml('span', [escapedErrorMessage], $('#errorRegistering'));
    }

    $('#errorRegistering').showModal();
  },

  browserNotGrantingPersistence() {
    $('#browserNotGrantingPersistence').showModal();
  },

  main({
    l,
    ok,
    refuse,
    close,
    closeBrowserNotGranting
  }) {
    const installationDialog = jml('dialog', {
      style: 'text-align: center; height: 100%',
      id: 'installationLogContainer',
      class: 'focus'
    }, [['p', [l('wait-installing')]], ['div', {
      style: 'height: 80%; overflow: auto;'
    }, [['pre', {
      id: 'installationLog'
    }, []]]] // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
    ]);
    let requestPermissionsDialog = '';

    if (ok) {
      requestPermissionsDialog = jml('dialog', {
        id: 'willRequestStoragePermissions',
        $on: {
          close
        }
      }, [['section', [l('will-request-storage-permissions')]], ['br'], ['div', {
        class: 'focus'
      }, [['button', {
        $on: {
          click: ok
        }
      }, [l('OK')]], ['br'], ['br'], ['button', {
        $on: {
          click: refuse
        }
      }, [l('refuse-request-storage-permissions')]]]]]);
    }

    const errorRegisteringNotice = jml('dialog', {
      id: 'errorRegistering'
    }, [['section', [l('errorRegistering')]]]);
    let browserNotGrantingPersistenceAlert = '';

    if (closeBrowserNotGranting) {
      browserNotGrantingPersistenceAlert = jml('dialog', {
        id: 'browserNotGrantingPersistence'
      }, [['section', [l('browser-not-granting-persistence')]], ['br'], ['div', {
        class: 'focus'
      }, [['button', {
        $on: {
          click: closeBrowserNotGranting
        }
      }, [l('OK')]]]]]);
    }

    const versionChangeNotice = jml('dialog', {
      id: 'versionChange'
    }, [['section', [l('versionChange')]]]);
    const dbErrorNotice = jml('dialog', {
      id: 'dbError'
    }, [['section', [l('dbError')]]]);
    jml('div', {
      id: 'dialogContainer',
      style: 'height: 100%'
    }, [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice], $('#main'));
    return [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice];
  }

};

/**
 *
 * @param {string} param
 * @param {boolean} skip
 * @this IntlURLSearchParams
 * @returns {string}
 */
function _prepareParam(param, skip) {
  if (skip || !this.localizeParamNames) {
    // (lang)
    return param;
  } // start, end, toggle


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
async function workSelect$1({
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
    const dbs = await getJSON(files);

    const localeFromFileData = lan => dbs['localization-strings'][lan];

    const metadataObjs = await getJSON(dbs.groups.reduce((arr, fileGroup) => {
      const metadataBaseDir = (dbs.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';
      return fileGroup.files.reduce((ar, fileData) => ar.concat(metadataBaseDir + fileData.metadataFile), arr);
    }, []));
    const imfFile = IMFClass({
      locales: lang.map(localeFromFileData),
      fallbackLocales: fallbackLanguages.map(localeFromFileData)
    });
    const lf = imfFile.getFormatter();
    document.title = lf({
      key: 'browserfile-workselect',
      fallback: true
    });
    /*
        function ld (key, values, formats) {
            return l({
                key: key, values: values, formats: formats, fallback: ({message}) =>
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
      groups: dbs.groups,
      lf,
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
  il,
  $p
}) {
  return function ({
    form,
    random = {},
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
    }); // Follow the same style (and order) for checkboxes

    paramsCopy.delete(il('rand'));
    paramsCopy.set(il('rand'), random.checked ? l('yes') : l('no')); // We want checkboxes to typically show by default, so we cannot use the
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
          paramsCopy.delete(il('rand'));
          break;
        }

      case 'shortcutResult':
        {
          paramsCopy.delete(il('rand'));
          let num = 1;

          while (paramsCopy.has(`anchorfield${num}`, true)) {
            paramsCopy.delete(`anchorfield${num}`, true);
            num++;
          }

          removeStartsEndsAndAnchors();
          num = 1; // Delete field-specific so we can add our own

          while (paramsCopy.has(`field${num}`, true)) {
            paramsCopy.delete(`field${num}`, true);
            paramsCopy.delete(`checked${num}`, true);
            paramsCopy.delete(`interlin${num}`, true);
            paramsCopy.delete(`css${num}`, true);
            num++;
          }

          fieldAliasOrNames.forEach((fieldAliasOrName, i) => {
            paramsCopy.set(`field${i + 1}`, fieldAliasOrName, true); // Todo: Restrict by content locale?

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
          } // In case it was added previously on this page,
          //    let's put random again toward the end.


          if (type === 'randomResult' || random.checked) {
            paramsCopy.delete(il('rand'));
            paramsCopy.set(il('rand'), l('yes'));
          }

          paramsCopy.set(il('result'), l('yes'));
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

async function workDisplay$1({
  l,
  languageParam,
  lang,
  preferredLocale,
  languages,
  fallbackLanguages,
  $p
}) {
  const langs = this.langData.languages;
  const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);
  const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
  const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
  const hideFormattingSection = $p.has('formatting', true) ? $p.get('formatting', true) === '0' : prefFormatting === 'true' || prefFormatting !== 'false' && this.hideFormattingSection;

  async function _displayWork({
    lf,
    metadataObj,
    getFieldAliasOrName,
    schemaObj,
    schemaItems,
    fieldInfo,
    metadata,
    pluginsForWork,
    groupsToWorks
  }) {
    const il = localizeParamNames ? key => l(['params', key]) : key => key;
    const iil = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;
    const localeFromLangData = languages.localeFromLangData.bind(languages);
    const imfLang = IMFClass({
      locales: lang.map(localeFromLangData),
      fallbackLocales: fallbackLanguages.map(localeFromLangData)
    });
    const imfl = imfLang.getFormatter(); // Returns option element with localized option text (as Jamilih), with
    //   optional fallback direction

    const le = (key, el, attToLocalize, atts, children = []) => {
      atts[attToLocalize] = l({
        key,

        fallback({
          message
        }) {
          atts.dir = fallbackDirection;
          return message;
        }

      });
      return [el, atts, children];
    }; // Returns plain text node or element (as Jamilih) with fallback direction


    const ld = (key, values, formats) => l({
      key,
      values,
      formats,
      fallback: ({
        message
      }) => Templates.workDisplay.bdo({
        fallbackDirection,
        message
      })
    });

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
          ld,
          i,
          iil,
          $p,
          content
        });
      }

    });
    /*
        Templates.workDisplay.addRandomFormFields({
            il, l, ld, le, $p, serializeParamsAsURL, content
        });
        */

    const serializeParamsAsURL = getSerializeParamsAsURL({
      l,
      il,
      $p
    });
    const paramsSetter = getParamsSetter({
      l,
      il,
      $p
    });
    const {
      groups
    } = await getJSON(this.files); // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically

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

    Templates.workDisplay.main({
      languageParam,
      lang,
      lf,
      l,
      namespace: this.namespace,
      groups,
      heading,
      imfl,
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
      il,
      le,
      ld,
      iil,
      fieldMatchesLocale,
      preferredLocale,
      schemaItems,
      content
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
      lf,
      fileData,
      metadataObj
    } = _await$this$getWorkDa,
          args = _objectWithoutProperties(_await$this$getWorkDa, ["lf", "fileData", "metadataObj"]);

    document.title = lf({
      key: 'browserfile-workdisplay',
      values: {
        work: fileData ? getMetaProp(lang, metadataObj, 'alias') : ''
      },
      fallback: true
    });
    await _displayWork.call(this, _objectSpread2({
      lf,
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
  // Private functions - star
  _escapeRegExpPattern: function (str) {
    if (typeof str !== 'string') {
      return str;
    }

    return str.replace(/([\.\*\+\^\$\[\]\\\(\)\|\{\}\,\-\:\?])/g, '\\$1'); // eslint-disable-line no-useless-escape
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
    }; // fix reserveReturnValue value


    if (typeof delimiter === 'boolean') {
      reserveReturnValue = delimiter;
      delimiter = null;
    }

    if (typeof str !== 'string') {
      return reserveReturnValue && str;
    } // Trim based on delimiter array values


    if (Array.isArray(delimiter)) {
      // Loop through delimiter array
      delimiter.map(function (item) {
        // Escape delimiter to be valid RegExp Pattern
        var pattern = self$1._escapeRegExpPattern(item); // Push pattern to patterns array


        addPatterns(pattern);
      });
    } // Trim based on delimiter string value


    if (typeof delimiter === 'string') {
      // Escape delimiter to be valid RegExp Pattern
      var patternDelimiter = self$1._escapeRegExpPattern(delimiter); // push pattern to patterns array


      addPatterns(patternDelimiter);
    } // If delimiter  is not defined, Trim white spaces


    if (!delimiter) {
      // Push white space pattern to patterns array
      addPatterns('\\s');
    } // Build RegExp pattern


    var pattern = '(' + patterns.join('|') + ')'; // Build RegExp object

    regexp = new RegExp(pattern, 'g'); // trim string for all patterns

    while (str.match(regexp)) {
      str = str.replace(regexp, '');
    } // Return trim string


    return str;
  },
  _parseLocale: function (strLocale) {
    // parse locale regex object
    var regex = /^([a-zA-Z]*)([_\-a-zA-Z]*)$/;
    var matches = regex.exec(strLocale); // exec regex

    var parsedLocale;
    var lang;
    var countryCode;

    if (!strLocale || !matches) {
      return;
    } // fix countryCode string by trimming '-' and '_'


    matches[2] = self$1._trim(matches[2], ['-', '_']);
    lang = self$1._toLowerCase(matches[1]);
    countryCode = self$1._toUpperCase(matches[2]) || countryCode; // object with lang, countryCode properties

    parsedLocale = {
      lang: lang,
      countryCode: countryCode
    }; // return parsed locale object

    return parsedLocale;
  },
  // Private functions - End
  // Public functions - star
  isRtlLang: function (strLocale) {
    var objLocale = self$1._parseLocale(strLocale);

    if (!objLocale) {
      return;
    } // return true if the intel string lang exists in the BID RTL LANGS array else return false


    return self$1._BIDI_RTL_LANGS.indexOf(objLocale.lang) >= 0;
  },
  getLangDir: function (strLocale) {
    // return 'rtl' if the intel string lang exists in the BID RTL LANGS array else return 'ltr'
    return self$1.isRtlLang(strLocale) ? 'rtl' : 'ltr';
  } // Public functions - End

}; // Const BIDI_RTL_LANGS Array
// BIDI_RTL_LANGS ref: http://en.wikipedia.org/wiki/Right-to-left
// Table of scripts in Unicode: https://en.wikipedia.org/wiki/Script_(Unicode)

Object.defineProperty(self$1, '_BIDI_RTL_LANGS', {
  value: ['ae',
  /* Avestan */
  'ar',
  /* 'العربية', Arabic */
  'arc',
  /* Aramaic */
  'bcc',
  /* 'بلوچی مکرانی', Southern Balochi */
  'bqi',
  /* 'بختياري', Bakthiari */
  'ckb',
  /* 'Soranî / کوردی', Sorani */
  'dv',
  /* Dhivehi */
  'fa',
  /* 'فارسی', Persian */
  'glk',
  /* 'گیلکی', Gilaki */
  'he',
  /* 'עברית', Hebrew */
  'ku',
  /* 'Kurdî / كوردی', Kurdish */
  'mzn',
  /* 'مازِرونی', Mazanderani */
  'nqo',
  /* N'Ko */
  'pnb',
  /* 'پنجابی', Western Punjabi */
  'ps',
  /* 'پښتو', Pashto, */
  'sd',
  /* 'سنڌي', Sindhi */
  'ug',
  /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
  'ur',
  /* 'اردو', Urdu */
  'yi'
  /* 'ייִדיש', Yiddish */
  ],
  writable: false,
  enumerable: true,
  configurable: false
});
var rtlDetect = RtlDetectLib;

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */



var rtlDetect_1 = {
  isRtlLang: rtlDetect.isRtlLang,
  getLangDir: rtlDetect.getLangDir
};

const fieldValueAliasRegex = /^.* \((.*?)\)$/;

const getRawFieldValue = v => {
  return typeof v === 'string' ? v.replace(fieldValueAliasRegex, '$1') : v;
};

const setAnchor = ({
  applicableBrowseFieldSet,
  fieldValueAliasMapPreferred,
  ilRaw,
  iil,
  max,
  $p
}) => {
  const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map(abfs => {
    return abfs.fieldSchemaIndex;
  }); // Check if user added this (e.g., even to end of URL with
  //   other anchor params)

  const work = $p.get('work');
  let anchor;
  const anchorRowCol = ilRaw('anchorrowcol');

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
          if (i === max || // No more field sets to check
          anchors.length // Already had anchors found
          ) {
              breakout = true;
            }

          break;
        }

        anchorField = $p.get(iil('anchorfield') + i, true);
        const x = applicableBrowseFieldSchemaIndexes[j - 1];
        const rawVal = getRawFieldValue(anchor);
        const raw = fieldValueAliasMapPreferred[x] && fieldValueAliasMapPreferred[x][rawVal];
        anchors.push(raw || anchor); // anchors.push({anchorText, anchor});
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

const resultsDisplayClient$1 = async function resultsDisplayClient(args) {
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
    lf,
    iil,
    ilRaw,
    templateArgs
  } = await resultsDisplayServerOrClient$1.call(this, _objectSpread2(_objectSpread2({}, args), {}, {
    skipIndexedDB,
    prefI18n
  }));
  document.title = lf({
    key: 'browserfile-resultsdisplay',
    values: {
      work: fileData ? getMetaProp(lang, metadataObj, 'alias') : ''
    },
    fallback: true
  });
  Templates.resultsDisplayClient.main(templateArgs);
  setAnchor({
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred,
    iil,
    ilRaw,
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
const resultsDisplayServerOrClient$1 = async function resultsDisplayServerOrClient({
  l,
  lang,
  fallbackLanguages,
  imfLocales,
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
      const idx = localizedFieldNames.indexOf(fieldName); // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book); we may wish to
      //   switch this (and also for other browse field-based
      //   items).

      if (fieldValueAliasMap[idx] !== undefined) {
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
      const idx = localizedFieldNames.indexOf(fieldName); // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book), and there could
      //   be multiple aliases for a value; we may wish to
      //   switch this (and also for other browse field-based
      //   items).

      if (fieldValueAliasMap[idx] !== undefined) {
        rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
      } else {
        rowIDPartsPreferred.push(tr[idx]);
      }

      return tr[idx];
    }); // Todo: Use schema to determine field type and use `Number.parseInt`
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
    } // This doesn't go in an `else` for the above in case the start is the end


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
      return interlin && interlin.split(/\s*,\s*/).map(col => // Todo: Avoid this when known to be integer or if string, though allow
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

    reverseLocaleLookup(imfLocales);

    if (!key && !avoidLog) {
      console.log('Bad param/value', param, '::', p);
    }

    return key; // || p; // $p.get(param, true);
  };

  const escapeCSS = escapeHTML;

  const $pRawEsc = param => escapeHTML($pRaw(param));

  const $pEscArbitrary = param => escapeHTML($p.get(param, true)); // Not currently in use


  const escapeQuotedCSS = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const {
    fileData,
    lf,
    getFieldAliasOrName,
    schemaObj,
    metadataObj,
    pluginsForWork
  } = await getWorkData({
    files: files || this.files,
    allowPlugins: allowPlugins || this.allowPlugins,
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
          lf,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          lf,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice( // Todo: Allow default placement overriding for
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
  }); // Todo: Repeats some code in workDisplay; probably need to reuse
  //   these functions more in `Templates.resultsDisplayServerOrClient` too

  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
  const il = localizeParamNames ? key => l(['params', key]) : key => key;
  const iil = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;
  const ilRaw = localizeParamNames ? (key, suffix = '') => $p.get(il(key) + suffix, true) : (key, suffix = '') => $p.get(key + suffix, true);
  const iilRaw = localizeParamNames ? (key, suffix = '') => $p.get($p.get('work') + '-' + iil(key) + suffix, true) : (key, suffix = '') => $p.get($p.get('work') + '-' + key + suffix, true); // Now that we know `browseFieldSets`, we can parse `startEnd`

  const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) => iilRaw('startEnd', i + 1));

  if (browseFieldSetStartEndIdx !== -1) {
    // Todo: i18nize (by work and/or by whole app?)
    const rangeSep = '-';
    const partSep = ':'; // Search box functionality (Todo: not yet in UI); should first
    //    avoid numeric startEnd and even work across book
    // Todo: At least avoid need for book text AND book number in Bible
    // Todo: Change query beginning at 0 to 1 if none present?
    // Todo: Support i18nized or canonical aliases (but don't
    //         over-trim in such cases)

    const rawSearch = (iilRaw('startEnd', browseFieldSetStartEndIdx + 1) || '').trim();
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
        startPartVals.push(...new Array(-startEndDiff).fill('1'));
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

  const browseFieldSetIdx = browseFieldSets.findIndex((item, i) => iilRaw('start', i + 1 + '-1'));
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
  console.log('rand', ilRaw('rand') === 'yes');

  const stripToRawFieldValue = (v, i) => {
    let val;

    if (v.match(/^\d+$/) || v.match(fieldValueAliasRegex)) {
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
      usingServerData = false; // Site owner may have configured to skip (e.g., testing)

  if (!skipIndexedDB && // User may have refused, not yet agreed, or are visiting the
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
        const store = trans.objectStore(storeName); // Get among browse field sets by index number within URL params

        const index = store.index('browseFields-' + applicableBrowseFieldSetName); // console.log('dbName', dbName);
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
    const presort = presorts[browseFieldSetIdx]; // Given that we are not currently wishing to add complexity to
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
      }); // Now safe to pass (and set) `j` value as tr array expanded

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
          getLangDir: rtlDetect_1.getLangDir,
          meta,
          metaApplicableField,
          $p,
          thisObj: this
        }) || applicableFieldText;
      });
      console.log('applicableFieldIdx', applicableFieldIdx);
    });
  }

  const localeDir = rtlDetect_1.getLangDir(preferredLocale);
  const fieldDirs = fieldLangs.map(langCode => {
    if (!langCode) {
      return null;
    }

    const langDir = rtlDetect_1.getLangDir(langCode);
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
    lf,
    iil,
    ilRaw,
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
  await new Promise((resolve, reject) => {
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

    const closeBrowserNotGranting = e => {
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
      } // denied|default|granted


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
          } // Has own error-handling


          await prepareForServiceWorker.call(this);
          break;

        default:
          console.error('Unexpected returnValue', requestPermissionsDialog.returnValue);
          break;
      }
    };

    const [, requestPermissionsDialog, browserNotGrantingPersistenceAlert] = // , errorRegisteringNotice
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
      stylesheets.splice(builtinIndex, 1, new URL('index.css', moduleURL).href, new URL('../../dialog-polyfill/dist/dialog-polyfill.css', moduleURL).href);
    }

    this.stylesheets = stylesheets;
    setServiceWorkerDefaults(this, options);
    this.allowPlugins = options.allowPlugins;
    this.dynamicBasePath = options.dynamicBasePath;
    this.trustFormatHTML = options.trustFormatHTML;
    this.requestPersistentStorage = options.requestPersistentStorage;
    this.localizeParamNames = options.localizeParamNames === undefined ? true : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.interlinearSeparator = options.interlinearSeparator; // Todo: Make these user facing options

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
      const p = this.paramChange(); // INIT/ADD EVENTS
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
      return getWorkData.call(this, _objectSpread2(_objectSpread2({}, opts), {}, {
        files: this.files,
        allowPlugins: this.allowPlugins
      }));
    } catch (err) {
      console.log('err', err);
      dialogs.alert('catch:' + err);
    }
  } // Need for directionality even if language specified (and we don't want
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
    return getFieldNameAndValueAliases(_objectSpread2(_objectSpread2({}, args), {}, {
      lang: this.lang
    }));
  }

  getBrowseFieldData(args) {
    return getBrowseFieldData(_objectSpread2(_objectSpread2({}, args), {}, {
      lang: this.lang
    }));
  }

  async paramChange() {
    Templates.defaultBody(); // Todo: Could give option to i18nize 'lang' or omit

    const $p = this.$p = typeof history.state === 'string' ? new IntlURLSearchParams({
      params: history.state
    }) : new IntlURLSearchParams(); // Uses URL hash for params

    const followParams = (formSelector, cb) => {
      const form = document.querySelector(formSelector); // Record current URL along with state

      const url = location.href.replace(/#.*$/, '') + '#' + $p.toString();
      history.replaceState(serialize(form, {
        hash: true,
        empty: true
      }), document.title, url); // Get and set new state within URL
      // eslint-disable-next-line node/callback-return

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

    const getSiteI18n = () => {
      const localeFromSiteData = lan => {
        return this.siteData['localization-strings'][lan];
      };

      const imfSite = IMFClass({
        locales: lang.map(localeFromSiteData),
        fallbackLocales: fallbackLanguages.map(localeFromSiteData)
      });
      return imfSite.getFormatter();
    };

    const siteI18n = getSiteI18n(); // Even if individual pages may end up changing, we need a
    //   title now for accessibility

    document.title = siteI18n('browser-title');
    const refusedIndexedDB = // User may have persistence via bookmarks, etc. but just not
    //     want commital on notification
    // Notification.permission === 'default' ||
    // We always expect a controller, so is probably first visit
    localStorage.getItem(this.namespace + '-refused'); // This check goes further than `Notification.permission === 'granted'`
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

      const tryRegistrationOrPersistence = !refusedIndexedDB && ( // Not show if refused before
      !navigator.serviceWorker.controller || // This is `null` on a force-refresh too
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
            l: siteI18n
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
        console.error('Unexpected error: worker registration received without a worker.'); // If anything, would probably need to register though

        await register();
        return;
      }

      Templates.permissions.main({
        l: siteI18n
      }); // "The browser checks for updates automatically after navigations and
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
          console.log('err', err); // Todo: We could auto-reload if we tracked whether this
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
          }); // Don't return as user may continue working until installed (though
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
          }); // finishActivate({r, logger, namespace, files});

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
      // Also could use l('chooselanguage'), but assumes locale
      //   as with page title
      $p.l10n = siteI18n; // Is this in use?

      document.title = siteI18n('languages-title');
      Templates.languageSelect.main({
        langs,
        languages,
        followParams,
        $p
      });
      return;
    }

    const localeCallback = (l
    /* defineFormatter */
    ) => {
      this.l10n = l;
      $p.l10n = l;
      const work = $p.get('work');

      if (!work) {
        workSelect$1({
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
          languages
        });
        return true;
      }

      return false;
    };

    return getIMFFallbackResults({
      $p,
      lang,
      langs,
      langData: this.langData,
      fallbackLanguages,
      resultsDisplay: opts => {
        const noIndexedDB = refusedIndexedDB || !navigator.serviceWorker.controller; // No worker from which IndexedDB is available;

        return this.resultsDisplayClient(_objectSpread2(_objectSpread2({
          langData: this.langData
        }, opts), {}, {
          noIndexedDB,
          dynamicBasePath: this.dynamicBasePath,
          files: this.files,
          allowPlugins: this.allowPlugins
        }));
      },
      localeCallback
    });
  }

} // Todo: Definable as public fields?


TextBrowser.prototype.workDisplay = workDisplay$1;
TextBrowser.prototype.resultsDisplayClient = resultsDisplayClient$1;
TextBrowser.prototype.getWorkFiles = getWorkFiles;

export default TextBrowser;
