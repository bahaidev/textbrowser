var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var simpleGetJson = createCommonjsModule(function (module, exports) {
(function (global, factory) {
    module.exports = factory();
})(commonjsGlobal, function () {

    function __async(g) {
        return new Promise(function (s, j) {
            function c(a, x) {
                try {
                    var r = g[x ? "throw" : "next"](a);
                } catch (e) {
                    j(e);return;
                }r.done ? s(r.value) : Promise.resolve(r.value).then(c, d);
            }function d(e) {
                c(e, 1);
            }c();
        });
    }

    function getJSON(jsonURL, cb, errBack) {
        return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
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
                                return getJSON(url);
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

                            _context.t0.message += " (File: " + jsonURL + ")";

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
        })());
    }

    return getJSON;
});
});

var dist = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  module.exports = factory(simpleGetJson);
})(commonjsGlobal, function (getJSON) {

  getJSON = getJSON && getJSON.hasOwnProperty('default') ? getJSON['default'] : getJSON;

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

  // Purposely using the same implementation as the Intl.js `Intl` polyfill.
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
    }

    // Unescape the escaped '#'s in the message text.
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
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
      option = options[i];

      // Compile the sub-pattern and save it under the options's selector.
      optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
  };

  // -- Compiler Helper Classes --------------------------------------------------

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
          peg$startRuleFunctions = { start: peg$parsestart },
          peg$startRuleFunction = peg$parsestart,
          peg$c0 = function peg$c0(elements) {
        return {
          type: 'messageFormatPattern',
          elements: elements,
          location: location()
        };
      },
          peg$c1 = function peg$c1(text) {
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
          peg$c2 = function peg$c2(messageText) {
        return {
          type: 'messageTextElement',
          value: messageText,
          location: location()
        };
      },
          peg$c3 = /^[^ \t\n\r,.+={}#]/,
          peg$c4 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
          peg$c5 = "{",
          peg$c6 = { type: "literal", value: "{", description: "\"{\"" },
          peg$c7 = ",",
          peg$c8 = { type: "literal", value: ",", description: "\",\"" },
          peg$c9 = "}",
          peg$c10 = { type: "literal", value: "}", description: "\"}\"" },
          peg$c11 = function peg$c11(id, format) {
        return {
          type: 'argumentElement',
          id: id,
          format: format && format[2],
          location: location()
        };
      },
          peg$c12 = "number",
          peg$c13 = { type: "literal", value: "number", description: "\"number\"" },
          peg$c14 = "date",
          peg$c15 = { type: "literal", value: "date", description: "\"date\"" },
          peg$c16 = "time",
          peg$c17 = { type: "literal", value: "time", description: "\"time\"" },
          peg$c18 = function peg$c18(type, style) {
        return {
          type: type + 'Format',
          style: style && style[2],
          location: location()
        };
      },
          peg$c19 = "plural",
          peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
          peg$c21 = function peg$c21(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: false,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location()
        };
      },
          peg$c22 = "selectordinal",
          peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
          peg$c24 = function peg$c24(pluralStyle) {
        return {
          type: pluralStyle.type,
          ordinal: true,
          offset: pluralStyle.offset || 0,
          options: pluralStyle.options,
          location: location()
        };
      },
          peg$c25 = "select",
          peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
          peg$c27 = function peg$c27(options) {
        return {
          type: 'selectFormat',
          options: options,
          location: location()
        };
      },
          peg$c28 = "=",
          peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
          peg$c30 = function peg$c30(selector, pattern) {
        return {
          type: 'optionalFormatPattern',
          selector: selector,
          value: pattern,
          location: location()
        };
      },
          peg$c31 = "offset:",
          peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
          peg$c33 = function peg$c33(number) {
        return number;
      },
          peg$c34 = function peg$c34(offset, options) {
        return {
          type: 'pluralFormat',
          offset: offset,
          options: options,
          location: location()
        };
      },
          peg$c35 = { type: "other", description: "whitespace" },
          peg$c36 = /^[ \t\n\r]/,
          peg$c37 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
          peg$c38 = { type: "other", description: "optionalWhitespace" },
          peg$c39 = /^[0-9]/,
          peg$c40 = { type: "class", value: "[0-9]", description: "[0-9]" },
          peg$c41 = /^[0-9a-f]/i,
          peg$c42 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
          peg$c43 = "0",
          peg$c44 = { type: "literal", value: "0", description: "\"0\"" },
          peg$c45 = /^[1-9]/,
          peg$c46 = { type: "class", value: "[1-9]", description: "[1-9]" },
          peg$c47 = function peg$c47(digits) {
        return parseInt(digits, 10);
      },
          peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
          peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
          peg$c50 = "\\\\",
          peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
          peg$c52 = function peg$c52() {
        return '\\';
      },
          peg$c53 = "\\#",
          peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
          peg$c55 = function peg$c55() {
        return '\\#';
      },
          peg$c56 = "\\{",
          peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
          peg$c58 = function peg$c58() {
        return "{";
      },
          peg$c59 = "\\}",
          peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
          peg$c61 = function peg$c61() {
        return "}";
      },
          peg$c62 = "\\u",
          peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
          peg$c64 = function peg$c64(digits) {
        return String.fromCharCode(parseInt(digits, 16));
      },
          peg$c65 = function peg$c65(chars) {
        return chars.join('');
      },
          peg$currPos = 0,
          peg$savedPos = 0,
          peg$posDetailsCache = [{ line: 1, column: 1, seenCR: false }],
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
              return "\\u0" + hex(ch);
            }).replace(/[\u1000-\uFFFF]/g, function (ch) {
              return "\\u" + hex(ch);
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
          peg$fail({ type: "end", description: "end of input" });
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

  // -- MessageFormat --------------------------------------------------------

  function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ? MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
      throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    defineProperty(this, '_locale', { value: this._resolveLocale(locales) });

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
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
  }

  // Default format options used as the prototype of the `formats` provided to the
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
  });

  // Define internal private properties for dealing with locale data.
  defineProperty(MessageFormat, '__localeData__', { value: objCreate(null) });
  defineProperty(MessageFormat, '__addLocaleData', { value: function value(data) {
      if (!(data && data.locale)) {
        throw new Error('Locale data provided to IntlMessageFormat is missing a ' + '`locale` property');
      }

      MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
    } });

  // Defines `__parse()` static method as an exposed private.
  defineProperty(MessageFormat, '__parse', { value: parser.parse });

  // Define public `defaultLocale` property which defaults to English, but can be
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
    var data = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
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
      part = pattern[i];

      // Exist early for string parts.
      if (typeof part === 'string') {
        result += part;
        continue;
      }

      id = part.id;

      // Enforce that all required values are provided by the caller.
      if (!(values && hop.call(values, id))) {
        err = new Error('A value must be provided for: ' + id);
        err.variableId = id;
        throw err;
      }

      value = values[id];

      // Recursively format plural and select parts' option — which can be a
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
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
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
  };

  // GENERATED FILE
  var defaultLocale = { "locale": "en", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
      var s = String(n).split("."),
          v0 = !s[1],
          t0 = Number(s[0]) == n,
          n10 = t0 && s[0].slice(-1),
          n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
    } };

  /* jslint esnext: true */

  MessageFormat.__addLocaleData(defaultLocale);
  MessageFormat.defaultLocale = 'en';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // If strawman approved, this would only be

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
        var _fallbackLocales;

        for (var _len = arguments.length, fallbackLocales = Array(_len), _key = 0; _key < _len; _key++) {
          fallbackLocales[_key] = arguments[_key];
        }

        (_fallbackLocales = this.fallbackLocales).push.apply(_fallbackLocales, fallbackLocales);
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
        return loc && (typeof loc === 'undefined' ? 'undefined' : _typeof(loc)) === 'object';
      });
      return found && loc[key] ? loc[key] : '';
    }
    var isArray = Array.isArray;

    ns = ns === undefined ? this.defaultNamespace : ns;
    sep = sep === undefined ? this.defaultSeparator : sep;
    ns = isArray(ns) ? ns.join(sep) : ns;

    return function (key, values, formats, fallback) {
      var message = void 0;
      var currNs = ns;
      if (key && !isArray(key) && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') {
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
    return getJSON(langs.map(this.localeFileResolver, this), function () {
      for (var _len2 = arguments.length, locales = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        locales[_key2] = arguments[_key2];
      }

      if (!avoidSettingLocales) {
        var _locales;

        (_locales = _this3.locales).push.apply(_locales, locales);
      }
      if (cb) {
        cb.apply(_this3, locales);
      }
    });
  };

  return IMFClass;
});
});

function getIMFFallbackResults({
    $p,
    lang, langs, langData, fallbackLanguages,
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
        const imf = dist({
            languages: lang,
            fallbackLanguages,
            localeFileResolver: code => {
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

function loadStylesheets(stylesheets, {
    before: beforeDefault, after: afterDefault, favicon: faviconDefault,
    canvas: canvasDefault, image: imageDefault = true,
    acceptErrors
} = {}) {
    stylesheets = Array.isArray(stylesheets) ? stylesheets : [stylesheets];

    function setupLink(stylesheetURL) {
        let options = {};
        if (Array.isArray(stylesheetURL)) {
            [stylesheetURL, options = {}] = stylesheetURL;
        }
        let { favicon = faviconDefault } = options;
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
        return new Promise((resolve, reject) => {
            let rej = reject;
            if (acceptErrors) {
                rej = typeof acceptErrors === 'function' ? error => {
                    acceptErrors({ error, stylesheetURL, options, resolve, reject });
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

    return Promise.all(stylesheets.map(setupLink));
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

let win = typeof window !== 'undefined' && window;
let doc = typeof document !== 'undefined' && document;
let XmlSerializer = typeof XMLSerializer !== 'undefined' && XMLSerializer;

// STATIC PROPERTIES
const possibleOptions = ['$plugins', '$map' // Add any other options here
];

const NS_HTML = 'http://www.w3.org/1999/xhtml',
      hyphenForCamelCase = /-([a-z])/g;

const ATTR_MAP = {
    'readonly': 'readOnly'
};

// We define separately from ATTR_DOM for clarity (and parity with JsonML) but no current need
// We don't set attribute esp. for boolean atts as we want to allow setting of `undefined`
//   (e.g., from an empty variable) on templates to have no effect
const BOOL_ATTS = ['checked', 'defaultChecked', 'defaultSelected', 'disabled', 'indeterminate', 'open', // Dialog elements
'readOnly', 'selected'];
const ATTR_DOM = BOOL_ATTS.concat([// From JsonML
'accessKey', // HTMLElement
'async', 'autocapitalize', // HTMLElement
'autofocus', 'contentEditable', // HTMLElement through ElementContentEditable
'defaultValue', 'defer', 'draggable', // HTMLElement
'formnovalidate', 'hidden', // HTMLElement
'innerText', // HTMLElement
'inputMode', // HTMLElement through ElementContentEditable
'ismap', 'multiple', 'novalidate', 'pattern', 'required', 'spellcheck', // HTMLElement
'translate', // HTMLElement
'value', 'willvalidate']);
// Todo: Add more to this as useful for templating
//   to avoid setting through nullish value
const NULLABLES = ['dir', // HTMLElement
'lang', // HTMLElement
'max', 'min', 'title' // HTMLElement
];

/**
* Retrieve the (lower-cased) HTML name of a node
* @static
* @param {Node} node The HTML node
* @returns {String} The lower-cased node name
*/
function _getHTMLNodeName(node) {
    return node.nodeName && node.nodeName.toLowerCase();
}

/**
* Apply styles if this is a style tag
* @static
* @param {Node} node The element to check whether it is a style tag
*/
function _applyAnyStylesheet(node) {
    if (!doc.createStyleSheet) {
        return;
    }
    if (_getHTMLNodeName(node) === 'style') {
        // IE
        const ss = doc.createStyleSheet(); // Create a stylesheet to actually do something useful
        ss.cssText = node.cssText;
        // We continue to add the style tag, however
    }
}

/**
 * Need this function for IE since options weren't otherwise getting added
 * @private
 * @static
 * @param {DOMElement} parent The parent to which to append the element
 * @param {DOMNode} child The element or other node to append to the parent
 */
function _appendNode(parent, child) {
    const parentName = _getHTMLNodeName(parent);
    const childName = _getHTMLNodeName(child);

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
        parent.content.appendChild(child);
        return;
    }
    try {
        parent.appendChild(child); // IE9 is now ok with this
    } catch (e) {
        if (parentName === 'select' && childName === 'option') {
            try {
                // Since this is now DOM Level 4 standard behavior (and what IE7+ can handle), we try it first
                parent.add(child);
            } catch (err) {
                // DOM Level 2 did require a second argument, so we try it too just in case the user is using an older version of Firefox, etc.
                parent.add(child, null); // IE7 has a problem with this, but IE8+ is ok
            }
            return;
        }
        throw e;
    }
}

/**
 * Attach event in a cross-browser fashion
 * @static
 * @param {DOMElement} el DOM element to which to attach the event
 * @param {String} type The DOM event (without 'on') to attach to the element
 * @param {Function} handler The event handler to attach to the element
 * @param {Boolean} [capturing] Whether or not the event should be
 *                                                              capturing (W3C-browsers only); default is false; NOT IN USE
 */
function _addEvent(el, type, handler, capturing) {
    el.addEventListener(type, handler, !!capturing);
}

/**
* Creates a text node of the result of resolving an entity or character reference
* @param {'entity'|'decimal'|'hexadecimal'} type Type of reference
* @param {String} prefix Text to prefix immediately after the "&"
* @param {String} arg The body of the reference
* @returns {Text} The text node of the resolved reference
*/
function _createSafeReference(type, prefix, arg) {
    // For security reasons related to innerHTML, we ensure this string only contains potential entity characters
    if (!arg.match(/^\w+$/)) {
        throw new TypeError('Bad ' + type);
    }
    const elContainer = doc.createElement('div');
    // Todo: No workaround for XML?
    elContainer.innerHTML = '&' + prefix + arg + ';';
    return doc.createTextNode(elContainer.innerHTML);
}

/**
* @param {String} n0 Whole expression match (including "-")
* @param {String} n1 Lower-case letter match
* @returns {String} Uppercased letter
*/
function _upperCase(n0, n1) {
    return n1.toUpperCase();
}

/**
* @private
* @static
*/
function _getType(item) {
    if (typeof item === 'string') {
        return 'string';
    }
    if (typeof item === 'object') {
        if (item === null) {
            return 'null';
        }
        if (Array.isArray(item)) {
            return 'array';
        }
        if ('nodeType' in item) {
            if (item.nodeType === 1) {
                return 'element';
            }
            if (item.nodeType === 11) {
                return 'fragment';
            }
        }
        return 'object';
    }
    return undefined;
}

/**
* @private
* @static
*/
function _fragReducer(frag, node) {
    frag.appendChild(node);
    return frag;
}

/**
* @private
* @static
*/
function _replaceDefiner(xmlnsObj) {
    return function (n0) {
        let retStr = xmlnsObj[''] ? ' xmlns="' + xmlnsObj[''] + '"' : n0 || ''; // Preserve XHTML
        for (const ns in xmlnsObj) {
            if (xmlnsObj.hasOwnProperty(ns)) {
                if (ns !== '') {
                    retStr += ' xmlns:' + ns + '="' + xmlnsObj[ns] + '"';
                }
            }
        }
        return retStr;
    };
}

function _optsOrUndefinedJML(...args) {
    return jml(...(args[0] === undefined ? args.slice(1) : args));
}

/**
* @private
* @static
*/
function _jmlSingleArg(arg) {
    return jml(arg);
}

/**
* @private
* @static
*/
function _copyOrderedAtts(attArr) {
    const obj = {};
    // Todo: Fix if allow prefixed attributes
    obj[attArr[0]] = attArr[1]; // array of ordered attribute-value arrays
    return obj;
}

/**
* @private
* @static
*/
function _childrenToJML(node) {
    return function (childNodeJML, i) {
        const cn = node.childNodes[i];
        cn.parentNode.replaceChild(jml(...childNodeJML), cn);
    };
}

/**
* @private
* @static
*/
function _appendJML(node) {
    return function (childJML) {
        node.appendChild(jml(...childJML));
    };
}

/**
* @private
* @static
*/
function _appendJMLOrText(node) {
    return function (childJML) {
        if (typeof childJML === 'string') {
            node.appendChild(doc.createTextNode(childJML));
        } else {
            node.appendChild(jml(...childJML));
        }
    };
}

/**
* @private
* @static
function _DOMfromJMLOrString (childNodeJML) {
    if (typeof childNodeJML === 'string') {
        return doc.createTextNode(childNodeJML);
    }
    return jml(...childNodeJML);
}
*/

/**
 * Creates an XHTML or HTML element (XHTML is preferred, but only in browsers that support);
 * Any element after element can be omitted, and any subsequent type or types added afterwards
 * @requires polyfill: Array.isArray
 * @requires polyfill: Array.prototype.reduce For returning a document fragment
 * @requires polyfill: Element.prototype.dataset For dataset functionality (Will not work in IE <= 7)
 * @param {String} el The element to create (by lower-case name)
 * @param {Object} [atts] Attributes to add with the key as the attribute name and value as the
 *                                               attribute value; important for IE where the input element's type cannot
 *                                               be added later after already added to the page
 * @param {DOMElement[]} [children] The optional children of this element (but raw DOM elements
 *                                                                      required to be specified within arrays since
 *                                                                      could not otherwise be distinguished from siblings being added)
 * @param {DOMElement} [parent] The optional parent to which to attach the element (always the last
 *                                                                  unless followed by null, in which case it is the second-to-last)
 * @param {null} [returning] Can use null to indicate an array of elements should be returned
 * @returns {DOMElement} The newly created (and possibly already appended) element or array of elements
 */
const jml = function jml(...args) {
    let elem = doc.createDocumentFragment();
    function _checkAtts(atts) {
        let att;
        for (att in atts) {
            if (!atts.hasOwnProperty(att)) {
                continue;
            }
            const attVal = atts[att];
            att = att in ATTR_MAP ? ATTR_MAP[att] : att;
            if (NULLABLES.includes(att)) {
                if (attVal != null) {
                    elem[att] = attVal;
                }
                continue;
            } else if (ATTR_DOM.includes(att)) {
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
                        nodes[nodes.length] = _optsOrUndefinedJML(opts, attVal);
                        break;
                    }case '$shadow':
                    {
                        const { open, closed } = attVal;
                        let { content, template } = attVal;
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
                                template = doc.querySelector(template);
                            }
                            jml(template.content.cloneNode(true), shadowRoot);
                        } else {
                            if (!content) {
                                content = open || closed;
                            }
                            if (content && typeof content !== 'boolean') {
                                if (Array.isArray(content)) {
                                    jml({ '#': content }, shadowRoot);
                                } else {
                                    jml(content, shadowRoot);
                                }
                            }
                        }
                        break;
                    }case 'is':
                    {
                        // Not yet supported in browsers
                        // Handled during element creation
                        break;
                    }case '$custom':
                    {
                        Object.assign(elem, attVal);
                        break;
                    }case '$define':
                    {
                        const localName = elem.localName.toLowerCase();
                        // Note: customized built-ins sadly not working yet
                        const customizedBuiltIn = !localName.includes('-');

                        const def = customizedBuiltIn ? elem.getAttribute('is') : localName;
                        if (customElements.get(def)) {
                            break;
                        }
                        const getConstructor = cb => {
                            const baseClass = options && options.extends ? doc.createElement(options.extends).constructor : customizedBuiltIn ? doc.createElement(localName).constructor : HTMLElement;
                            return cb ? class extends baseClass {
                                constructor() {
                                    super();
                                    cb.call(this);
                                }
                            } : class extends baseClass {};
                        };

                        let constructor, options, prototype;
                        if (Array.isArray(attVal)) {
                            if (attVal.length <= 2) {
                                [constructor, options] = attVal;
                                if (typeof options === 'string') {
                                    options = { extends: options };
                                } else if (!options.hasOwnProperty('extends')) {
                                    prototype = options;
                                }
                                if (typeof constructor === 'object') {
                                    prototype = constructor;
                                    constructor = getConstructor();
                                }
                            } else {
                                [constructor, prototype, options] = attVal;
                                if (typeof options === 'string') {
                                    options = { extends: options };
                                }
                            }
                        } else if (typeof attVal === 'function') {
                            constructor = attVal;
                        } else {
                            prototype = attVal;
                            constructor = getConstructor();
                        }
                        if (!constructor.toString().startsWith('class')) {
                            constructor = getConstructor(constructor);
                        }
                        if (!options && customizedBuiltIn) {
                            options = { extends: localName };
                        }
                        if (prototype) {
                            Object.assign(constructor.prototype, prototype);
                        }
                        customElements.define(def, constructor, customizedBuiltIn ? options : undefined);
                        break;
                    }case '$symbol':
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
                    }case '$data':
                    {
                        setMap(attVal);
                        break;
                    }case '$attribute':
                    {
                        // Attribute node
                        const node = attVal.length === 3 ? doc.createAttributeNS(attVal[0], attVal[1]) : doc.createAttribute(attVal[0]);
                        node.value = attVal[attVal.length - 1];
                        nodes[nodes.length] = node;
                        break;
                    }case '$text':
                    {
                        // Todo: Also allow as jml(['a text node']) (or should that become a fragment)?
                        const node = doc.createTextNode(attVal);
                        nodes[nodes.length] = node;
                        break;
                    }case '$document':
                    {
                        const node = doc.implementation.createHTMLDocument();
                        if (attVal.childNodes) {
                            attVal.childNodes.forEach(_childrenToJML(node));
                            // Remove any extra nodes created by createHTMLDocument().
                            let j = attVal.childNodes.length;
                            while (node.childNodes[j]) {
                                const cn = node.childNodes[j];
                                cn.parentNode.removeChild(cn);
                                j++;
                            }
                        } else {
                            const html = node.childNodes[1];
                            const head = html.childNodes[0];
                            const body = html.childNodes[1];
                            if (attVal.title || attVal.head) {
                                const meta = doc.createElement('meta');
                                meta.charset = 'utf-8';
                                head.appendChild(meta);
                            }
                            if (attVal.title) {
                                node.title = attVal.title; // Appends after meta
                            }
                            if (attVal.head) {
                                attVal.head.forEach(_appendJML(head));
                            }
                            if (attVal.body) {
                                attVal.body.forEach(_appendJMLOrText(body));
                            }
                        }
                        break;
                    }case '$DOCTYPE':
                    {
                        /*
                        // Todo:
                        if (attVal.internalSubset) {
                            node = {};
                        }
                        else
                        */
                        let node;
                        if (attVal.entities || attVal.notations) {
                            node = {
                                name: attVal.name,
                                nodeName: attVal.name,
                                nodeValue: null,
                                nodeType: 10,
                                entities: attVal.entities.map(_jmlSingleArg),
                                notations: attVal.notations.map(_jmlSingleArg),
                                publicId: attVal.publicId,
                                systemId: attVal.systemId
                                // internalSubset: // Todo
                            };
                        } else {
                            node = doc.implementation.createDocumentType(attVal.name, attVal.publicId, attVal.systemId);
                        }
                        nodes[nodes.length] = node;
                        break;
                    }case '$ENTITY':
                    {
                        /*
                        // Todo: Should we auto-copy another node's properties/methods (like DocumentType) excluding or changing its non-entity node values?
                        const node = {
                            nodeName: attVal.name,
                            nodeValue: null,
                            publicId: attVal.publicId,
                            systemId: attVal.systemId,
                            notationName: attVal.notationName,
                            nodeType: 6,
                            childNodes: attVal.childNodes.map(_DOMfromJMLOrString)
                        };
                        */
                        break;
                    }case '$NOTATION':
                    {
                        // Todo: We could add further properties/methods, but unlikely to be used as is.
                        const node = { nodeName: attVal[0], publicID: attVal[1], systemID: attVal[2], nodeValue: null, nodeType: 12 };
                        nodes[nodes.length] = node;
                        break;
                    }case '$on':
                    {
                        // Events
                        for (const p2 in attVal) {
                            if (attVal.hasOwnProperty(p2)) {
                                let val = attVal[p2];
                                if (typeof val === 'function') {
                                    val = [val, false];
                                }
                                if (typeof val[0] === 'function') {
                                    _addEvent(elem, p2, val[0], val[1]); // element, event name, handler, capturing
                                }
                            }
                        }
                        break;
                    }case 'className':case 'class':
                    if (attVal != null) {
                        elem.className = attVal;
                    }
                    break;
                case 'dataset':
                    {
                        // Map can be keyed with hyphenated or camel-cased properties
                        const recurse = (attVal, startProp) => {
                            let prop = '';
                            const pastInitialProp = startProp !== '';
                            Object.keys(attVal).forEach(key => {
                                const value = attVal[key];
                                if (pastInitialProp) {
                                    prop = startProp + key.replace(hyphenForCamelCase, _upperCase).replace(/^([a-z])/, _upperCase);
                                } else {
                                    prop = startProp + key.replace(hyphenForCamelCase, _upperCase);
                                }
                                if (value === null || typeof value !== 'object') {
                                    if (value != null) {
                                        elem.dataset[prop] = value;
                                    }
                                    prop = startProp;
                                    return;
                                }
                                recurse(value, prop);
                            });
                        };
                        recurse(attVal, '');
                        break;
                        // Todo: Disable this by default unless configuration explicitly allows (for security)
                    }
                // #if IS_REMOVE
                // Don't remove this `if` block (for sake of no-innerHTML build)
                case 'innerHTML':
                    if (attVal != null) {
                        elem.innerHTML = attVal;
                    }
                    break;
                // #endif
                case 'htmlFor':case 'for':
                    if (elStr === 'label') {
                        if (attVal != null) {
                            elem.htmlFor = attVal;
                        }
                        break;
                    }
                    elem.setAttribute(att, attVal);
                    break;
                case 'xmlns':
                    // Already handled
                    break;
                default:
                    if (att.match(/^on/)) {
                        elem[att] = attVal;
                        // _addEvent(elem, att.slice(2), attVal, false); // This worked, but perhaps the user wishes only one event
                        break;
                    }
                    if (att === 'style') {
                        if (attVal == null) {
                            break;
                        }
                        if (typeof attVal === 'object') {
                            for (const p2 in attVal) {
                                if (attVal.hasOwnProperty(p2) && attVal[p2] != null) {
                                    // Todo: Handle aggregate properties like "border"
                                    if (p2 === 'float') {
                                        elem.style.cssFloat = attVal[p2];
                                        elem.style.styleFloat = attVal[p2]; // Harmless though we could make conditional on older IE instead
                                    } else {
                                        elem.style[p2.replace(hyphenForCamelCase, _upperCase)] = attVal[p2];
                                    }
                                }
                            }
                            break;
                        }
                        // setAttribute unfortunately erases any existing styles
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
                    const matchingPlugin = opts && opts.$plugins && opts.$plugins.find(p => {
                        return p.name === att;
                    });
                    if (matchingPlugin) {
                        matchingPlugin.set({ element: elem, attribute: { name: att, value: attVal } });
                        break;
                    }
                    elem.setAttribute(att, attVal);
                    break;
            }
        }
    }
    const nodes = [];
    let elStr;
    let opts;
    let isRoot = false;
    if (_getType(args[0]) === 'object' && Object.keys(args[0]).some(key => possibleOptions.includes(key))) {
        opts = args[0];
        if (opts.state !== 'child') {
            isRoot = true;
            opts.state = 'child';
        }
        if (opts.$map && !opts.$map.root && opts.$map.root !== false) {
            opts.$map = { root: opts.$map };
        }
        if ('$plugins' in opts) {
            if (!Array.isArray(opts.$plugins)) {
                throw new Error('$plugins must be an array');
            }
            opts.$plugins.forEach(pluginObj => {
                if (!pluginObj) {
                    throw new TypeError('Plugin must be an object');
                }
                if (!pluginObj.name || !pluginObj.name.startsWith('$_')) {
                    throw new TypeError('Plugin object name must be present and begin with `$_`');
                }
                if (typeof pluginObj.set !== 'function') {
                    throw new TypeError('Plugin object must have a `set` method');
                }
            });
        }
        args = args.slice(1);
    }
    const argc = args.length;
    const defaultMap = opts && opts.$map && opts.$map.root;
    const setMap = dataVal => {
        let map, obj;
        // Boolean indicating use of default map and object
        if (dataVal === true) {
            [map, obj] = defaultMap;
        } else if (Array.isArray(dataVal)) {
            // Array of strings mapping to default
            if (typeof dataVal[0] === 'string') {
                dataVal.forEach(dVal => {
                    setMap(opts.$map[dVal]);
                });
                // Array of Map and non-map data object
            } else {
                map = dataVal[0] || defaultMap[0];
                obj = dataVal[1] || defaultMap[1];
            }
            // Map
        } else if (/^\[object (?:Weak)?Map\]$/.test([].toString.call(dataVal))) {
            map = dataVal;
            obj = defaultMap[1];
            // Non-map data object
        } else {
            map = defaultMap[0];
            obj = dataVal;
        }
        map.set(elem, obj);
    };
    for (let i = 0; i < argc; i++) {
        let arg = args[i];
        switch (_getType(arg)) {
            case 'null':
                // null always indicates a place-holder (only needed for last argument if want array returned)
                if (i === argc - 1) {
                    _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
                    // Todo: Fix to allow application of stylesheets of style tags within fragments?
                    return nodes.length <= 1 ? nodes[0] : nodes.reduce(_fragReducer, doc.createDocumentFragment()); // nodes;
                }
                break;
            case 'string':
                // Strings indicate elements
                switch (arg) {
                    case '!':
                        nodes[nodes.length] = doc.createComment(args[++i]);
                        break;
                    case '?':
                        arg = args[++i];
                        let procValue = args[++i];
                        const val = procValue;
                        if (typeof val === 'object') {
                            procValue = [];
                            for (const p in val) {
                                if (val.hasOwnProperty(p)) {
                                    procValue.push(p + '=' + '"' + val[p].replace(/"/g, '\\"') + '"');
                                }
                            }
                            procValue = procValue.join(' ');
                        }
                        // Firefox allows instructions with ">" in this method, but not if placed directly!
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
                        break;
                    // Browsers don't support doc.createEntityReference, so we just use this as a convenience
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
                        nodes[nodes.length] = doc.createDocumentFragment();
                        break;
                    default:
                        {
                            // An element
                            elStr = arg;
                            const atts = args[i + 1];
                            // Todo: Fix this to depend on XML/config, not availability of methods
                            if (_getType(atts) === 'object' && atts.is) {
                                const { is } = atts;
                                if (doc.createElementNS) {
                                    elem = doc.createElementNS(NS_HTML, elStr, { is });
                                } else {
                                    elem = doc.createElement(elStr, { is });
                                }
                            } else {
                                if (doc.createElementNS) {
                                    elem = doc.createElementNS(NS_HTML, elStr);
                                } else {
                                    elem = doc.createElement(elStr);
                                }
                            }
                            nodes[nodes.length] = elem; // Add to parent
                            break;
                        }
                }
                break;
            case 'object':
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
                    }
                    // try {
                    // Also fix DOMParser to work with text/html
                    elem = nodes[nodes.length - 1] = new DOMParser().parseFromString(new XmlSerializer().serializeToString(elem)
                    // Mozilla adds XHTML namespace
                    .replace(' xmlns="' + NS_HTML + '"', replacer), 'application/xml').documentElement;
                    // }catch(e) {alert(elem.outerHTML);throw e;}
                }
                const orderedArr = atts.$a ? atts.$a.map(_copyOrderedAtts) : [atts];
                orderedArr.forEach(_checkAtts);
                break;
            case 'fragment':
            case 'element':
                /*
                1) Last element always the parent (put null if don't want parent and want to return array) unless only atts and children (no other elements)
                2) Individual elements (DOM elements or sequences of string[/object/array]) get added to parent first-in, first-added
                */
                if (i === 0) {
                    // Allow wrapping of element
                    elem = arg;
                }
                if (i === argc - 1 || i === argc - 2 && args[i + 1] === null) {
                    // parent
                    const elsl = nodes.length;
                    for (let k = 0; k < elsl; k++) {
                        _appendNode(arg, nodes[k]);
                    }
                    // Todo: Apply stylesheets if any style tags were added elsewhere besides the first element?
                    _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
                } else {
                    nodes[nodes.length] = arg;
                }
                break;
            case 'array':
                // Arrays or arrays of arrays indicate child nodes
                const child = arg;
                const cl = child.length;
                for (let j = 0; j < cl; j++) {
                    // Go through children array container to handle elements
                    const childContent = child[j];
                    const childContentType = typeof childContent;
                    if (childContent === undefined) {
                        throw String('Parent array:' + JSON.stringify(args) + '; child: ' + child + '; index:' + j);
                    }
                    switch (childContentType) {
                        // Todo: determine whether null or function should have special handling or be converted to text
                        case 'string':case 'number':case 'boolean':
                            _appendNode(elem, doc.createTextNode(childContent));
                            break;
                        default:
                            if (Array.isArray(childContent)) {
                                // Arrays representing child elements
                                _appendNode(elem, _optsOrUndefinedJML(opts, ...childContent));
                            } else if (childContent['#']) {
                                // Fragment
                                _appendNode(elem, _optsOrUndefinedJML(opts, childContent['#']));
                            } else {
                                // Single DOM element children
                                _appendNode(elem, childContent);
                            }
                            break;
                    }
                }
                break;
        }
    }
    const ret = nodes[0] || elem;
    if (opts && isRoot && opts.$map && opts.$map.root) {
        setMap(true);
    }
    return ret;
};

/**
* Converts a DOM object or a string of HTML into a Jamilih object (or string)
* @param {string|HTMLElement} [dom=document.documentElement] Defaults to converting the current document.
* @param {object} [config={stringOutput:false}] Configuration object
* @param {boolean} [config.stringOutput=false] Whether to output the Jamilih object as a string.
* @returns {array|string} Array containing the elements which represent a Jamilih object, or,
                            if `stringOutput` is true, it will be the stringified version of
                            such an object
*/
jml.toJML = function (dom, config) {
    config = config || { stringOutput: false };
    if (typeof dom === 'string') {
        dom = new DOMParser().parseFromString(dom, 'text/html'); // todo: Give option for XML once implemented and change JSDoc to allow for Element
    }

    const ret = [];
    let parent = ret;
    let parentIdx = 0;

    function invalidStateError() {
        // These are probably only necessary if working with text/html
        function DOMException() {
            return this;
        }
        {
            // INVALID_STATE_ERR per section 9.3 XHTML 5: http://www.w3.org/TR/html5/the-xhtml-syntax.html
            // Since we can't instantiate without this (at least in Mozilla), this mimicks at least (good idea?)
            const e = new DOMException();
            e.code = 11;
            throw e;
        }
    }

    function addExternalID(obj, node) {
        if (node.systemId.includes('"') && node.systemId.includes("'")) {
            invalidStateError();
        }
        const publicId = node.publicId;
        const systemId = node.systemId;
        if (systemId) {
            obj.systemId = systemId;
        }
        if (publicId) {
            obj.publicId = publicId;
        }
    }

    function set(val) {
        parent[parentIdx] = val;
        parentIdx++;
    }
    function setChildren() {
        set([]);
        parent = parent[parentIdx - 1];
        parentIdx = 0;
    }
    function setObj(prop1, prop2) {
        parent = parent[parentIdx - 1][prop1];
        parentIdx = 0;
        if (prop2) {
            parent = parent[prop2];
        }
    }

    function parseDOM(node, namespaces) {
        // namespaces = clone(namespaces) || {}; // Ensure we're working with a copy, so different levels in the hierarchy can treat it differently

        /*
        if ((node.prefix && node.prefix.includes(':')) || (node.localName && node.localName.includes(':'))) {
            invalidStateError();
        }
        */

        const type = 'nodeType' in node ? node.nodeType : null;
        namespaces = Object.assign({}, namespaces);

        const xmlChars = /([\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/; // eslint-disable-line no-control-regex
        if ([2, 3, 4, 7, 8].includes(type) && !xmlChars.test(node.nodeValue)) {
            invalidStateError();
        }

        let children, start, tmpParent, tmpParentIdx;
        function setTemp() {
            tmpParent = parent;
            tmpParentIdx = parentIdx;
        }
        function resetTemp() {
            parent = tmpParent;
            parentIdx = tmpParentIdx;
            parentIdx++; // Increment index in parent container of this element
        }
        switch (type) {
            case 1:
                // ELEMENT
                setTemp();
                const nodeName = node.nodeName.toLowerCase(); // Todo: for XML, should not lower-case

                setChildren(); // Build child array since elements are, except at the top level, encapsulated in arrays
                set(nodeName);

                start = {};
                let hasNamespaceDeclaration = false;

                if (namespaces[node.prefix || ''] !== node.namespaceURI) {
                    namespaces[node.prefix || ''] = node.namespaceURI;
                    if (node.prefix) {
                        start['xmlns:' + node.prefix] = node.namespaceURI;
                    } else if (node.namespaceURI) {
                        start.xmlns = node.namespaceURI;
                    }
                    hasNamespaceDeclaration = true;
                }
                if (node.attributes.length) {
                    set(Array.from(node.attributes).reduce(function (obj, att) {
                        obj[att.name] = att.value; // Attr.nodeName and Attr.nodeValue are deprecated as of DOM4 as Attr no longer inherits from Node, so we can safely use name and value
                        return obj;
                    }, start));
                } else if (hasNamespaceDeclaration) {
                    set(start);
                }

                children = node.childNodes;
                if (children.length) {
                    setChildren(); // Element children array container
                    Array.from(children).forEach(function (childNode) {
                        parseDOM(childNode, namespaces);
                    });
                }
                resetTemp();
                break;
            case undefined: // Treat as attribute node until this is fixed: https://github.com/tmpvar/jsdom/issues/1641 / https://github.com/tmpvar/jsdom/pull/1822
            case 2:
                // ATTRIBUTE (should only get here if passing in an attribute node)
                set({ $attribute: [node.namespaceURI, node.name, node.value] });
                break;
            case 3:
                // TEXT
                if (config.stripWhitespace && /^\s+$/.test(node.nodeValue)) {
                    return;
                }
                set(node.nodeValue);
                break;
            case 4:
                // CDATA
                if (node.nodeValue.includes(']]' + '>')) {
                    invalidStateError();
                }
                set(['![', node.nodeValue]);
                break;
            case 5:
                // ENTITY REFERENCE (probably not used in browsers since already resolved)
                set(['&', node.nodeName]);
                break;
            case 6:
                // ENTITY (would need to pass in directly)
                setTemp();
                start = {};
                if (node.xmlEncoding || node.xmlVersion) {
                    // an external entity file?
                    start.$ENTITY = { name: node.nodeName, version: node.xmlVersion, encoding: node.xmlEncoding };
                } else {
                    start.$ENTITY = { name: node.nodeName };
                    if (node.publicId || node.systemId) {
                        // External Entity?
                        addExternalID(start.$ENTITY, node);
                        if (node.notationName) {
                            start.$ENTITY.NDATA = node.notationName;
                        }
                    }
                }
                set(start);
                children = node.childNodes;
                if (children.length) {
                    start.$ENTITY.childNodes = [];
                    // Set position to $ENTITY's childNodes array children
                    setObj('$ENTITY', 'childNodes');

                    Array.from(children).forEach(function (childNode) {
                        parseDOM(childNode, namespaces);
                    });
                }
                resetTemp();
                break;
            case 7:
                // PROCESSING INSTRUCTION
                if (/^xml$/i.test(node.target)) {
                    invalidStateError();
                }
                if (node.target.includes('?>')) {
                    invalidStateError();
                }
                if (node.target.includes(':')) {
                    invalidStateError();
                }
                if (node.data.includes('?>')) {
                    invalidStateError();
                }
                set(['?', node.target, node.data]); // Todo: Could give option to attempt to convert value back into object if has pseudo-attributes
                break;
            case 8:
                // COMMENT
                if (node.nodeValue.includes('--') || node.nodeValue.length && node.nodeValue.lastIndexOf('-') === node.nodeValue.length - 1) {
                    invalidStateError();
                }
                set(['!', node.nodeValue]);
                break;
            case 9:
                // DOCUMENT
                setTemp();
                const docObj = { $document: { childNodes: [] } };

                if (config.xmlDeclaration) {
                    docObj.$document.xmlDeclaration = { version: doc.xmlVersion, encoding: doc.xmlEncoding, standAlone: doc.xmlStandalone };
                }

                set(docObj); // doc.implementation.createHTMLDocument

                // Set position to fragment's array children
                setObj('$document', 'childNodes');

                children = node.childNodes;
                if (!children.length) {
                    invalidStateError();
                }
                // set({$xmlDocument: []}); // doc.implementation.createDocument // Todo: use this conditionally

                Array.from(children).forEach(function (childNode) {
                    // Can't just do documentElement as there may be doctype, comments, etc.
                    // No need for setChildren, as we have already built the container array
                    parseDOM(childNode, namespaces);
                });
                resetTemp();
                break;
            case 10:
                // DOCUMENT TYPE
                setTemp();

                // Can create directly by doc.implementation.createDocumentType
                start = { $DOCTYPE: { name: node.name } };
                if (node.internalSubset) {
                    start.internalSubset = node.internalSubset;
                }
                const pubIdChar = /^(\u0020|\u000D|\u000A|[a-zA-Z0-9]|[-'()+,./:=?;!*#@$_%])*$/; // eslint-disable-line no-control-regex
                if (!pubIdChar.test(node.publicId)) {
                    invalidStateError();
                }
                addExternalID(start.$DOCTYPE, node);
                // Fit in internal subset along with entities?: probably don't need as these would only differ if from DTD, and we're not rebuilding the DTD
                set(start); // Auto-generate the internalSubset instead? Avoid entities/notations in favor of array to preserve order?

                const entities = node.entities; // Currently deprecated
                if (entities && entities.length) {
                    start.$DOCTYPE.entities = [];
                    setObj('$DOCTYPE', 'entities');
                    Array.from(entities).forEach(function (entity) {
                        parseDOM(entity, namespaces);
                    });
                    // Reset for notations
                    parent = tmpParent;
                    parentIdx = tmpParentIdx + 1;
                }

                const notations = node.notations; // Currently deprecated
                if (notations && notations.length) {
                    start.$DOCTYPE.notations = [];
                    setObj('$DOCTYPE', 'notations');
                    Array.from(notations).forEach(function (notation) {
                        parseDOM(notation, namespaces);
                    });
                }
                resetTemp();
                break;
            case 11:
                // DOCUMENT FRAGMENT
                setTemp();

                set({ '#': [] });

                // Set position to fragment's array children
                setObj('#');

                children = node.childNodes;
                Array.from(children).forEach(function (childNode) {
                    // No need for setChildren, as we have already built the container array
                    parseDOM(childNode, namespaces);
                });

                resetTemp();
                break;
            case 12:
                // NOTATION
                start = { $NOTATION: { name: node.nodeName } };
                addExternalID(start.$NOTATION, node, true);
                set(start);
                break;
            default:
                throw new TypeError('Not an XML type');
        }
    }

    parseDOM(dom, {});

    if (config.stringOutput) {
        return JSON.stringify(ret[0]);
    }
    return ret[0];
};
jml.toJMLString = function (dom, config) {
    return jml.toJML(dom, Object.assign(config || {}, { stringOutput: true }));
};
jml.toDOM = function (...args) {
    // Alias for jml()
    return jml(...args);
};
jml.toHTML = function (...args) {
    // Todo: Replace this with version of jml() that directly builds a string
    const ret = jml(...args);
    // Todo: deal with serialization of properties like 'selected', 'checked', 'value', 'defaultValue', 'for', 'dataset', 'on*', 'style'! (i.e., need to build a string ourselves)
    return ret.outerHTML;
};
jml.toDOMString = function (...args) {
    // Alias for jml.toHTML for parity with jml.toJMLString
    return jml.toHTML(...args);
};
jml.toXML = function (...args) {
    const ret = jml(...args);
    return new XmlSerializer().serializeToString(ret);
};
jml.toXMLDOMString = function (...args) {
    // Alias for jml.toXML for parity with jml.toJMLString
    return jml.toXML(...args);
};

class JamilihMap extends Map {
    get(elem) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.get.call(this, elem);
    }
    set(elem, value) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.set.call(this, elem, value);
    }
    invoke(elem, methodName, ...args) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return this.get(elem)[methodName](elem, ...args);
    }
}
class JamilihWeakMap extends WeakMap {
    get(elem) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.get(elem);
    }
    set(elem, value) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.set(elem, value);
    }
    invoke(elem, methodName, ...args) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return this.get(elem)[methodName](elem, ...args);
    }
}

jml.Map = JamilihMap;
jml.WeakMap = JamilihWeakMap;

jml.weak = function (obj, ...args) {
    const map = new JamilihWeakMap();
    const elem = jml({ $map: [map, obj] }, ...args);
    return [map, elem];
};

jml.strong = function (obj, ...args) {
    const map = new JamilihMap();
    const elem = jml({ $map: [map, obj] }, ...args);
    return [map, elem];
};

jml.symbol = jml.sym = jml.for = function (elem, sym) {
    elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
    return elem[typeof sym === 'symbol' ? sym : Symbol.for(sym)];
};

jml.command = function (elem, symOrMap, methodName, ...args) {
    elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
    let func;
    if (['symbol', 'string'].includes(typeof symOrMap)) {
        func = jml.sym(elem, symOrMap);
        if (typeof func === 'function') {
            return func(methodName, ...args); // Already has `this` bound to `elem`
        }
        return func[methodName](...args);
    } else {
        func = symOrMap.get(elem);
        if (typeof func === 'function') {
            return func.call(elem, methodName, ...args);
        }
        return func[methodName](elem, ...args);
    }
    // return func[methodName].call(elem, ...args);
};

jml.setWindow = wind => {
    win = wind;
};
jml.setDocument = docum => {
    doc = docum;
};
jml.setXMLSerializer = xmls => {
    XmlSerializer = xmls;
};

jml.getWindow = () => {
    return win;
};
jml.getDocument = () => {
    return doc;
};
jml.getXMLSerializer = () => {
    return XmlSerializer;
};

const nbsp = '\u00a0';
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

const $e = (el, descendentsSel) => {
    el = typeof el === 'string' ? $(el) : el;
    return el.querySelector(descendentsSel);
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/* globals dialogPolyfill */

const defaultLocale = 'en';
const localeStrings = {
    en: {
        submit: 'Submit',
        cancel: 'Cancel',
        ok: 'Ok'
    }
};

class Dialog {
    constructor({ locale, localeObject } = {}) {
        this.setLocale({ locale, localeObject });
    }
    setLocale({ locale = {}, localeObject = {} }) {
        this.localeStrings = Object.assign({}, localeStrings[defaultLocale], localeStrings[locale], localeObject);
    }
    makeDialog({ atts = {}, children = [], close, remove = true }) {
        if (close) {
            if (!atts.$on) {
                atts.$on = {};
            }
            if (!atts.$on.close) {
                atts.$on.close = close;
            }
        }
        const dialog = jml('dialog', atts, children, document.body);
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
            submit, // Don't pass this on to `args` if present
            submitClass = 'submit'
        } = _ref,
            args = objectWithoutProperties(_ref, ['submit', 'submitClass']);

        const dialog = this.makeCancelDialog(args);
        $e(dialog, `button.${args.cancelClass || 'cancel'}`).before(jml('button', {
            class: submitClass,
            $on: {
                click(e) {
                    if (submit) {
                        submit.call(this, { e, dialog });
                    }
                }
            }
        }, [this.localeStrings.submit]), nbsp.repeat(2));
        return dialog;
    }
    makeCancelDialog(_ref2) {
        let {
            submit, // Don't pass this on to `args` if present
            cancel,
            cancelClass = 'cancel', submitClass = 'submit'
        } = _ref2,
            args = objectWithoutProperties(_ref2, ['submit', 'cancel', 'cancelClass', 'submitClass']);

        const dialog = this.makeDialog(args);
        jml('div', { class: submitClass }, [['br'], ['br'], ['button', { class: cancelClass, $on: {
                click(e) {
                    e.preventDefault();
                    if (cancel) {
                        if (cancel.call(this, { e, dialog }) === false) {
                            return;
                        }
                    }
                    dialog.close();
                }
            } }, [this.localeStrings.cancel]]], dialog);
        return dialog;
    }
    alert(message, ok) {
        message = typeof message === 'string' ? { message } : message;
        const {
            ok: includeOk = typeof ok === 'object' ? ok.ok !== false : ok !== false,
            message: msg,
            submitClass = 'submit'
        } = message;
        return new Promise((resolve, reject) => {
            const dialog = jml('dialog', [msg, ...(includeOk ? [['br'], ['br'], ['div', { class: submitClass }, [['button', { $on: { click() {
                        dialog.close();
                        resolve();
                    } } }, [this.localeStrings.ok]]]]] : [])], document.body);
            dialogPolyfill.registerDialog(dialog);
            dialog.showModal();
        });
    }
    prompt(message) {
        message = typeof message === 'string' ? { message } : message;
        const { message: msg, submit: userSubmit } = message,
              submitArgs = objectWithoutProperties(message, ['message', 'submit']);
        return new Promise((resolve, reject) => {
            const submit = function ({ e, dialog }) {
                if (userSubmit) {
                    userSubmit.call(this, { e, dialog });
                }
                dialog.close();
                resolve($e(dialog, 'input').value);
            };
            /* const dialog = */this.makeSubmitDialog(_extends({}, submitArgs, {
                submit,
                cancel() {
                    reject(new Error('cancelled'));
                },
                children: [['label', [msg, nbsp.repeat(3), ['input']]]]
            }));
        });
    }
    confirm(message) {
        message = typeof message === 'string' ? { message } : message;
        const { message: msg, submitClass = 'submit' } = message;
        return new Promise((resolve, reject) => {
            const dialog = jml('dialog', [msg, ['br'], ['br'], ['div', { class: submitClass }, [['button', { $on: { click() {
                        dialog.close();
                        resolve();
                    } } }, [this.localeStrings.ok]], nbsp.repeat(2), ['button', { $on: { click() {
                        dialog.close();
                        reject(new Error('cancelled'));
                    } } }, [this.localeStrings.cancel]]]]], document.body);
            dialogPolyfill.registerDialog(dialog);
            dialog.showModal();
        });
    }
}
const dialogs = new Dialog();

/* eslint-env browser */
// Todo: remember this locales choice by cookie?
const getPreferredLanguages = ({ namespace, preferredLocale }) => {
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
    constructor({ langData }) {
        this.langData = langData;
    }
    localeFromLangData(lan) {
        return this.langData['localization-strings'][lan];
    }
    getLanguageFromCode(code) {
        return this.localeFromLangData(code).languages[code];
    }
    getFieldNameFromPluginNameAndLocales({
        pluginName, locales, lf, targetLanguage, applicableFieldI18N, meta, metaApplicableField
    }) {
        return lf(['plugins', pluginName, 'fieldname'], _extends({}, meta, metaApplicableField, {
            applicableField: applicableFieldI18N,
            targetLanguage: targetLanguage ? this.getLanguageFromCode(targetLanguage) : ''
        }));
    }
    getLanguageInfo({ $p }) {
        const langs = this.langData.languages;
        const localePass = lcl => langs.some(({ code }) => code === lcl) ? lcl : false;
        const languageParam = $p.get('lang', true);
        // Todo: We could (unless overridden by another button) assume the
        //         browser language based on fallbackLanguages instead
        //         of giving a choice
        const navLangs = navigator.languages.filter(localePass);
        const fallbackLanguages = navLangs.length ? navLangs : [localePass(navigator.language) || 'en-US'];
        // We need a default to display a default title
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

!function (t) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var e;e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.JsonRefs = t();
  }
}(function () {
  var t;return function t(e, n, r) {
    function i(u, s) {
      if (!n[u]) {
        if (!e[u]) {
          var a = "function" == typeof require && require;if (!s && a) return a(u, !0);if (o) return o(u, !0);var c = new Error("Cannot find module '" + u + "'");throw c.code = "MODULE_NOT_FOUND", c;
        }var f = n[u] = { exports: {} };e[u][0].call(f.exports, function (t) {
          var n = e[u][1][t];return i(n || t);
        }, f, f.exports, t, e, n, r);
      }return n[u].exports;
    }for (var o = "function" == typeof require && require, u = 0; u < r.length; u++) i(r[u]);return i;
  }({ 1: [function (t, e, n) {
      (function (n) {
        function r(t, e) {
          function n(t) {
            R.each(t, function (t, e) {
              r[e] = t;
            });
          }var r = {};return n(L.parse(t || "")), n(L.parse(e || "")), 0 === Object.keys(r).length ? void 0 : L.stringify(r);
        }function i(t, e) {
          R.isString(t) && (t = q(t)), R.isString(e) && (e = q(e));var n,
              i,
              o = y(R.isUndefined(e) ? "" : e);return B.indexOf(o.reference) > -1 ? i = o : (n = R.isUndefined(t) ? void 0 : y(t), R.isUndefined(n) ? i = o : (i = n, i.path = q(U.join(n.path, o.path)), i.query = r(n.query, o.query))), i.fragment = void 0, (-1 === B.indexOf(i.reference) && 0 === i.path.indexOf("../") ? "../" : "") + z.serialize(i);
        }function o(t, e) {
          var n,
              r = [];return e.length > 0 && (n = t, e.slice(0, e.length - 1).forEach(function (t) {
            t in n && (n = n[t], r.push(n));
          })), r;
        }function u(t) {
          return $.indexOf(f(t)) > -1;
        }function s(t) {
          return R.isUndefined(t.error) && "invalid" !== t.type;
        }function a(t, e) {
          var n = t;return e.forEach(function (t) {
            if (!((t = decodeURI(t)) in n)) throw Error("JSON Pointer points to missing location: " + P(e));n = n[t];
          }), n;
        }function c(t) {
          return Object.keys(t).filter(function (t) {
            return "$ref" !== t;
          });
        }function f(t) {
          var e;switch (t.uriDetails.reference) {case "absolute":case "uri":
              e = "remote";break;case "same-document":
              e = "local";break;default:
              e = t.uriDetails.reference;}return e;
        }function l(t, e) {
          var n = H[t],
              r = Promise.resolve(),
              i = R.cloneDeep(e.loaderOptions || {});return R.isUndefined(n) ? (R.isUndefined(i.processContent) && (i.processContent = function (t, e) {
            e(void 0, JSON.parse(t.text));
          }), r = F.load(decodeURI(t), i), r = r.then(function (e) {
            return H[t] = { value: e }, e;
          }).catch(function (e) {
            throw H[t] = { error: e }, e;
          })) : r = r.then(function () {
            if (R.isError(n.error)) throw n.error;return n.value;
          }), r = r.then(function (t) {
            return R.cloneDeep(t);
          });
        }function h(t, e) {
          var n = !0;try {
            if (!R.isPlainObject(t)) throw new Error("obj is not an Object");if (!R.isString(t.$ref)) throw new Error("obj.$ref is not a String");
          } catch (t) {
            if (e) throw t;n = !1;
          }return n;
        }function p(t) {
          return -1 !== t.indexOf("://") || U.isAbsolute(t) ? t : U.resolve(n.cwd(), t);
        }function d(t) {
          var e, n;return R.isArray(t.filter) || R.isString(t.filter) ? (n = R.isString(t.filter) ? [t.filter] : t.filter, e = function (t) {
            return n.indexOf(t.type) > -1 || n.indexOf(f(t)) > -1;
          }) : R.isFunction(t.filter) ? e = t.filter : R.isUndefined(t.filter) && (e = function () {
            return !0;
          }), function (n, r) {
            return ("invalid" !== n.type || !0 === t.includeInvalid) && e(n, r);
          };
        }function v(t) {
          var e;return R.isArray(t.subDocPath) ? e = t.subDocPath : R.isString(t.subDocPath) ? e = D(t.subDocPath) : R.isUndefined(t.subDocPath) && (e = []), e;
        }function _(t, e) {
          t.error = e.message, t.missing = !0;
        }function y(t) {
          return z.parse(encodeURI(decodeURI(t)));
        }function g(t, e, n) {
          var r,
              o,
              a = Promise.resolve(),
              c = P(e.subDocPath),
              f = p(e.location),
              h = U.dirname(e.location),
              d = f + c;return R.isUndefined(n.docs[f]) && (n.docs[f] = t), R.isUndefined(n.deps[d]) && (n.deps[d] = {}, r = O(t, e), R.each(r, function (r, f) {
            var v = p(e.location) + f,
                y = r.refdId = p(u(r) ? i(h, r.uri) : e.location) + "#" + (r.uri.indexOf("#") > -1 ? r.uri.split("#")[1] : "");if (n.refs[v] = r, s(r)) {
              if (n.deps[d][f === c ? "#" : f.replace(c + "/", "#/")] = y, 0 === v.indexOf(y + "/")) return void (r.circular = !0);o = R.cloneDeep(e), o.subDocPath = R.isUndefined(r.uriDetails.fragment) ? [] : D(decodeURI(r.uriDetails.fragment)), u(r) ? (delete o.filter, o.location = y.split("#")[0], a = a.then(function (t, e) {
                return function () {
                  var n = p(e.location),
                      r = t.docs[n];return R.isUndefined(r) ? l(n, e).catch(function (e) {
                    return t.docs[n] = e, e;
                  }) : Promise.resolve().then(function () {
                    return r;
                  });
                };
              }(n, o))) : a = a.then(function () {
                return t;
              }), a = a.then(function (t, e, n) {
                return function (r) {
                  if (R.isError(r)) _(n, r);else try {
                    return g(r, e, t).catch(function (t) {
                      _(n, t);
                    });
                  } catch (t) {
                    _(n, t);
                  }
                };
              }(n, o, r));
            }
          })), a;
        }function m(t, e, n) {
          a(t, e.slice(0, e.length - 1))[decodeURI(e[e.length - 1])] = n;
        }function b(t, e, n, r) {
          function i(e, i) {
            n.push(i), b(t, e, n, r), n.pop();
          }var o = !0;R.isFunction(r) && (o = r(t, e, n)), -1 === t.indexOf(e) && (t.push(e), !1 !== o && (R.isArray(e) ? e.forEach(function (t, e) {
            i(t, e.toString());
          }) : R.isObject(e) && R.each(e, function (t, e) {
            i(t, e);
          })), t.pop());
        }function w(t, e) {
          var n;if (t = R.isUndefined(t) ? {} : R.cloneDeep(t), !R.isObject(t)) throw new TypeError("options must be an Object");if (!R.isUndefined(t.resolveCirculars) && !R.isBoolean(t.resolveCirculars)) throw new TypeError("options.resolveCirculars must be a Boolean");if (!(R.isUndefined(t.filter) || R.isArray(t.filter) || R.isFunction(t.filter) || R.isString(t.filter))) throw new TypeError("options.filter must be an Array, a Function of a String");if (!R.isUndefined(t.includeInvalid) && !R.isBoolean(t.includeInvalid)) throw new TypeError("options.includeInvalid must be a Boolean");if (!R.isUndefined(t.location) && !R.isString(t.location)) throw new TypeError("options.location must be a String");if (!R.isUndefined(t.refPreProcessor) && !R.isFunction(t.refPreProcessor)) throw new TypeError("options.refPreProcessor must be a Function");if (!R.isUndefined(t.refPostProcessor) && !R.isFunction(t.refPostProcessor)) throw new TypeError("options.refPostProcessor must be a Function");if (!R.isUndefined(t.subDocPath) && !R.isArray(t.subDocPath) && !A(t.subDocPath)) throw new TypeError("options.subDocPath must be an Array of path segments or a valid JSON Pointer");if (R.isUndefined(t.resolveCirculars) && (t.resolveCirculars = !1), t.filter = d(t), R.isUndefined(t.location) && (t.location = p("./root.json")), n = t.location.split("#"), n.length > 1 && (t.subDocPath = "#" + n[1]), t.location = i(t.location, void 0), t.subDocPath = v(t), !R.isUndefined(e)) try {
            a(e, t.subDocPath);
          } catch (t) {
            throw t.message = t.message.replace("JSON Pointer", "options.subDocPath"), t;
          }return t;
        }function E() {
          H = {};
        }function x(t) {
          if (!R.isArray(t)) throw new TypeError("path must be an array");return t.map(function (t) {
            return R.isString(t) || (t = JSON.stringify(t)), decodeURI(t.replace(/~1/g, "/").replace(/~0/g, "~"));
          });
        }function j(t) {
          if (!R.isArray(t)) throw new TypeError("path must be an array");return t.map(function (t) {
            return R.isString(t) || (t = JSON.stringify(t)), t.replace(/~/g, "~0").replace(/\//g, "~1");
          });
        }function O(t, e) {
          var n = {};if (!R.isArray(t) && !R.isObject(t)) throw new TypeError("obj must be an Array or an Object");return e = w(e, t), b(o(t, e.subDocPath), a(t, e.subDocPath), R.cloneDeep(e.subDocPath), function (t, r, i) {
            var o,
                u,
                s = !0;return h(r) && (R.isUndefined(e.refPreProcessor) || (r = e.refPreProcessor(R.cloneDeep(r), i)), o = T(r), R.isUndefined(e.refPostProcessor) || (o = e.refPostProcessor(o, i)), e.filter(o, i) && (u = P(i), n[u] = o), c(r).length > 0 && (s = !1)), s;
          }), n;
        }function C(t, e) {
          var n = Promise.resolve();return n = n.then(function () {
            if (!R.isString(t)) throw new TypeError("location must be a string");return R.isUndefined(e) && (e = {}), R.isObject(e) && (e.location = t), e = w(e), l(e.location, e);
          }).then(function (t) {
            var n = R.cloneDeep(H[e.location]),
                r = R.cloneDeep(e),
                i = y(e.location);return R.isUndefined(n.refs) && (delete r.filter, delete r.subDocPath, r.includeInvalid = !0, H[e.location].refs = O(t, r)), R.isUndefined(e.filter) || (r.filter = e.filter), R.isUndefined(i.fragment) ? R.isUndefined(i.subDocPath) || (r.subDocPath = e.subDocPath) : r.subDocPath = D(decodeURI(i.fragment)), { refs: O(t, r), value: t };
          });
        }function T(t) {
          var e,
              n,
              r,
              i = { def: t };try {
            h(t, !0) ? (e = t.$ref, r = W[e], R.isUndefined(r) && (r = W[e] = y(e)), i.uri = e, i.uriDetails = r, R.isUndefined(r.error) ? i.type = f(i) : (i.error = i.uriDetails.error, i.type = "invalid"), n = c(t), n.length > 0 && (i.warning = "Extra JSON Reference properties will be ignored: " + n.join(", "))) : i.type = "invalid";
          } catch (t) {
            i.error = t.message, i.type = "invalid";
          }return i;
        }function A(t, e) {
          var n,
              r = !0;try {
            if (!R.isString(t)) throw new Error("ptr is not a String");if ("" !== t) {
              if (n = t.charAt(0), -1 === ["#", "/"].indexOf(n)) throw new Error("ptr must start with a / or #/");if ("#" === n && "#" !== t && "/" !== t.charAt(1)) throw new Error("ptr must start with a / or #/");if (t.match(M)) throw new Error("ptr has invalid token(s)");
            }
          } catch (t) {
            if (!0 === e) throw t;r = !1;
          }return r;
        }function S(t, e) {
          return h(t, e) && "invalid" !== T(t, e).type;
        }function D(t) {
          try {
            A(t, !0);
          } catch (t) {
            throw new Error("ptr must be a JSON Pointer: " + t.message);
          }var e = t.split("/");return e.shift(), x(e);
        }function P(t, e) {
          if (!R.isArray(t)) throw new Error("path must be an Array");return (!1 !== e ? "#" : "") + (t.length > 0 ? "/" : "") + j(t).join("/");
        }function I(t, e) {
          var n = Promise.resolve();return n = n.then(function () {
            if (!R.isArray(t) && !R.isObject(t)) throw new TypeError("obj must be an Array or an Object");e = w(e, t), t = R.cloneDeep(t);
          }).then(function () {
            var n = { deps: {}, docs: {}, refs: {} };return g(t, e, n).then(function () {
              return n;
            });
          }).then(function (t) {
            function n(i, o, u) {
              var a,
                  c = o.split("#"),
                  f = t.refs[o];if (r[c[0] === e.location ? "#" + c[1] : P(e.subDocPath.concat(u))] = f, f.circular || !s(f)) return void (!f.circular && f.error && (f.error = f.error.replace("options.subDocPath", "JSON Pointer"), f.error.indexOf("#") > -1 && (f.error = f.error.replace(f.uri.substr(f.uri.indexOf("#")), f.uri)), 0 !== f.error.indexOf("ENOENT:") && 0 !== f.error.indexOf("Not Found") || (f.error = "JSON Pointer points to missing location: " + f.uri)));a = t.deps[f.refdId], 0 !== f.refdId.indexOf(i) && Object.keys(a).forEach(function (t) {
                n(f.refdId, f.refdId + t.substr(1), u.concat(D(t)));
              });
            }var r = {},
                i = [],
                o = [],
                c = new N.Graph(),
                f = p(e.location),
                l = f + P(e.subDocPath);return Object.keys(t.deps).forEach(function (t) {
              c.setNode(t);
            }), R.each(t.deps, function (t, e) {
              R.each(t, function (t) {
                c.setEdge(e, t);
              });
            }), i = N.alg.findCycles(c), i.forEach(function (t) {
              t.forEach(function (t) {
                -1 === o.indexOf(t) && o.push(t);
              });
            }), R.each(t.deps, function (e, n) {
              R.each(e, function (e, r) {
                var s,
                    a = !1,
                    c = n + r.slice(1),
                    f = t.refs[n + r.slice(1)],
                    l = u(f);o.indexOf(e) > -1 && i.forEach(function (t) {
                  a || (s = t.indexOf(e)) > -1 && t.forEach(function (e) {
                    a || 0 === c.indexOf(e + "/") && (l && s === t.length - 1 || !l) && (a = !0);
                  });
                }), a && (f.circular = !0);
              });
            }), R.each(t.deps, function (n, r) {
              var i = r.split("#"),
                  o = t.docs[i[0]],
                  u = D(i[1]);R.each(n, function (n, r) {
                var s = n.split("#"),
                    c = t.docs[s[0]],
                    f = u.concat(D(r)),
                    l = t.refs[i[0] + P(f)];if (R.isUndefined(l.error) && R.isUndefined(l.missing)) if (!e.resolveCirculars && l.circular) l.value = l.def;else {
                  try {
                    l.value = a(c, D(s[1]));
                  } catch (t) {
                    return void _(l, t);
                  }"" === i[1] && "#" === r ? t.docs[i[0]] = l.value : m(o, f, l.value);
                }
              });
            }), Object.keys(t.refs).forEach(function (t) {
              0 === t.indexOf(l) && n(l, t, D(t.substr(l.length)));
            }), R.each(t.refs, function (t) {
              delete t.refdId;
            }), { refs: r, resolved: t.docs[f] };
          });
        }function k(t, e) {
          var n = Promise.resolve();return n = n.then(function () {
            if (!R.isString(t)) throw new TypeError("location must be a string");return R.isUndefined(e) && (e = {}), R.isObject(e) && (e.location = t), e = w(e), l(e.location, e);
          }).then(function (t) {
            var n = R.cloneDeep(e),
                r = y(e.location);return R.isUndefined(r.fragment) || (n.subDocPath = D(decodeURI(r.fragment))), I(t, n).then(function (e) {
              return { refs: e.refs, resolved: e.resolved, value: t };
            });
          });
        }var R = t("lodash"),
            N = t("graphlib"),
            U = t("path"),
            F = t("path-loader"),
            L = t("querystring"),
            q = t("slash"),
            z = t("uri-js"),
            M = /~(?:[^01]|$)/g,
            H = {},
            $ = ["relative", "remote"],
            B = ["absolute", "uri"],
            W = {};"undefined" == typeof Promise && t("native-promise-only"), e.exports.clearCache = E, e.exports.decodePath = x, e.exports.encodePath = j, e.exports.findRefs = O, e.exports.findRefsAt = C, e.exports.getRefDetails = T, e.exports.isPtr = A, e.exports.isRef = S, e.exports.pathFromPtr = D, e.exports.pathToPtr = P, e.exports.resolveRefs = I, e.exports.resolveRefsAt = k;
      }).call(this, t("_process"));
    }, { _process: 29, graphlib: 3, lodash: 23, "native-promise-only": 24, path: 25, "path-loader": 26, querystring: 32, slash: 33, "uri-js": 41 }], 2: [function (t, e, n) {
      function r(t) {
        if (t) return i(t);
      }function i(t) {
        for (var e in r.prototype) t[e] = r.prototype[e];return t;
      }void 0 !== e && (e.exports = r), r.prototype.on = r.prototype.addEventListener = function (t, e) {
        return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this;
      }, r.prototype.once = function (t, e) {
        function n() {
          this.off(t, n), e.apply(this, arguments);
        }return n.fn = e, this.on(t, n), this;
      }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
        if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;var n = this._callbacks["$" + t];if (!n) return this;if (1 == arguments.length) return delete this._callbacks["$" + t], this;for (var r, i = 0; i < n.length; i++) if ((r = n[i]) === e || r.fn === e) {
          n.splice(i, 1);break;
        }return this;
      }, r.prototype.emit = function (t) {
        this._callbacks = this._callbacks || {};var e = [].slice.call(arguments, 1),
            n = this._callbacks["$" + t];if (n) {
          n = n.slice(0);for (var r = 0, i = n.length; r < i; ++r) n[r].apply(this, e);
        }return this;
      }, r.prototype.listeners = function (t) {
        return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
      }, r.prototype.hasListeners = function (t) {
        return !!this.listeners(t).length;
      };
    }, {}], 3: [function (t, e, n) {
      var r = t("./lib");e.exports = { Graph: r.Graph, json: t("./lib/json"), alg: t("./lib/alg"), version: r.version };
    }, { "./lib": 19, "./lib/alg": 10, "./lib/json": 20 }], 4: [function (t, e, n) {
      function r(t) {
        function e(o) {
          i.has(r, o) || (r[o] = !0, n.push(o), i.each(t.successors(o), e), i.each(t.predecessors(o), e));
        }var n,
            r = {},
            o = [];return i.each(t.nodes(), function (t) {
          n = [], e(t), n.length && o.push(n);
        }), o;
      }var i = t("../lodash");e.exports = r;
    }, { "../lodash": 21 }], 5: [function (t, e, n) {
      function r(t, e, n) {
        o.isArray(e) || (e = [e]);var r = (t.isDirected() ? t.successors : t.neighbors).bind(t),
            u = [],
            s = {};return o.each(e, function (e) {
          if (!t.hasNode(e)) throw new Error("Graph does not have node: " + e);i(t, e, "post" === n, s, r, u);
        }), u;
      }function i(t, e, n, r, u, s) {
        o.has(r, e) || (r[e] = !0, n || s.push(e), o.each(u(e), function (e) {
          i(t, e, n, r, u, s);
        }), n && s.push(e));
      }var o = t("../lodash");e.exports = r;
    }, { "../lodash": 21 }], 6: [function (t, e, n) {
      function r(t, e, n) {
        return o.transform(t.nodes(), function (r, o) {
          r[o] = i(t, o, e, n);
        }, {});
      }var i = t("./dijkstra"),
          o = t("../lodash");e.exports = r;
    }, { "../lodash": 21, "./dijkstra": 7 }], 7: [function (t, e, n) {
      function r(t, e, n, r) {
        return i(t, String(e), n || s, r || function (e) {
          return t.outEdges(e);
        });
      }function i(t, e, n, r) {
        var i,
            o,
            s = {},
            a = new u(),
            c = function (t) {
          var e = t.v !== i ? t.v : t.w,
              r = s[e],
              u = n(t),
              c = o.distance + u;if (u < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + t + " Weight: " + u);c < r.distance && (r.distance = c, r.predecessor = i, a.decrease(e, c));
        };for (t.nodes().forEach(function (t) {
          var n = t === e ? 0 : Number.POSITIVE_INFINITY;s[t] = { distance: n }, a.add(t, n);
        }); a.size() > 0 && (i = a.removeMin(), o = s[i], o.distance !== Number.POSITIVE_INFINITY);) r(i).forEach(c);return s;
      }var o = t("../lodash"),
          u = t("../data/priority-queue");e.exports = r;var s = o.constant(1);
    }, { "../data/priority-queue": 17, "../lodash": 21 }], 8: [function (t, e, n) {
      function r(t) {
        return i.filter(o(t), function (e) {
          return e.length > 1 || 1 === e.length && t.hasEdge(e[0], e[0]);
        });
      }var i = t("../lodash"),
          o = t("./tarjan");e.exports = r;
    }, { "../lodash": 21, "./tarjan": 15 }], 9: [function (t, e, n) {
      function r(t, e, n) {
        return i(t, e || u, n || function (e) {
          return t.outEdges(e);
        });
      }function i(t, e, n) {
        var r = {},
            i = t.nodes();return i.forEach(function (t) {
          r[t] = {}, r[t][t] = { distance: 0 }, i.forEach(function (e) {
            t !== e && (r[t][e] = { distance: Number.POSITIVE_INFINITY });
          }), n(t).forEach(function (n) {
            var i = n.v === t ? n.w : n.v,
                o = e(n);r[t][i] = { distance: o, predecessor: t };
          });
        }), i.forEach(function (t) {
          var e = r[t];i.forEach(function (n) {
            var o = r[n];i.forEach(function (n) {
              var r = o[t],
                  i = e[n],
                  u = o[n],
                  s = r.distance + i.distance;s < u.distance && (u.distance = s, u.predecessor = i.predecessor);
            });
          });
        }), r;
      }var o = t("../lodash");e.exports = r;var u = o.constant(1);
    }, { "../lodash": 21 }], 10: [function (t, e, n) {
      e.exports = { components: t("./components"), dijkstra: t("./dijkstra"), dijkstraAll: t("./dijkstra-all"), findCycles: t("./find-cycles"), floydWarshall: t("./floyd-warshall"), isAcyclic: t("./is-acyclic"), postorder: t("./postorder"), preorder: t("./preorder"), prim: t("./prim"), tarjan: t("./tarjan"), topsort: t("./topsort") };
    }, { "./components": 4, "./dijkstra": 7, "./dijkstra-all": 6, "./find-cycles": 8, "./floyd-warshall": 9, "./is-acyclic": 11, "./postorder": 12, "./preorder": 13, "./prim": 14, "./tarjan": 15, "./topsort": 16 }], 11: [function (t, e, n) {
      function r(t) {
        try {
          i(t);
        } catch (t) {
          if (t instanceof i.CycleException) return !1;throw t;
        }return !0;
      }var i = t("./topsort");e.exports = r;
    }, { "./topsort": 16 }], 12: [function (t, e, n) {
      function r(t, e) {
        return i(t, e, "post");
      }var i = t("./dfs");e.exports = r;
    }, { "./dfs": 5 }], 13: [function (t, e, n) {
      function r(t, e) {
        return i(t, e, "pre");
      }var i = t("./dfs");e.exports = r;
    }, { "./dfs": 5 }], 14: [function (t, e, n) {
      function r(t, e) {
        function n(t) {
          var n = t.v === r ? t.w : t.v,
              i = c.priority(n);if (void 0 !== i) {
            var o = e(t);o < i && (a[n] = r, c.decrease(n, o));
          }
        }var r,
            s = new o(),
            a = {},
            c = new u();if (0 === t.nodeCount()) return s;i.each(t.nodes(), function (t) {
          c.add(t, Number.POSITIVE_INFINITY), s.setNode(t);
        }), c.decrease(t.nodes()[0], 0);for (var f = !1; c.size() > 0;) {
          if (r = c.removeMin(), i.has(a, r)) s.setEdge(r, a[r]);else {
            if (f) throw new Error("Input graph is not connected: " + t);f = !0;
          }t.nodeEdges(r).forEach(n);
        }return s;
      }var i = t("../lodash"),
          o = t("../graph"),
          u = t("../data/priority-queue");e.exports = r;
    }, { "../data/priority-queue": 17, "../graph": 18, "../lodash": 21 }], 15: [function (t, e, n) {
      function r(t) {
        function e(s) {
          var a = o[s] = { onStack: !0, lowlink: n, index: n++ };if (r.push(s), t.successors(s).forEach(function (t) {
            i.has(o, t) ? o[t].onStack && (a.lowlink = Math.min(a.lowlink, o[t].index)) : (e(t), a.lowlink = Math.min(a.lowlink, o[t].lowlink));
          }), a.lowlink === a.index) {
            var c,
                f = [];do {
              c = r.pop(), o[c].onStack = !1, f.push(c);
            } while (s !== c);u.push(f);
          }
        }var n = 0,
            r = [],
            o = {},
            u = [];return t.nodes().forEach(function (t) {
          i.has(o, t) || e(t);
        }), u;
      }var i = t("../lodash");e.exports = r;
    }, { "../lodash": 21 }], 16: [function (t, e, n) {
      function r(t) {
        function e(s) {
          if (o.has(r, s)) throw new i();o.has(n, s) || (r[s] = !0, n[s] = !0, o.each(t.predecessors(s), e), delete r[s], u.push(s));
        }var n = {},
            r = {},
            u = [];if (o.each(t.sinks(), e), o.size(n) !== t.nodeCount()) throw new i();return u;
      }function i() {}var o = t("../lodash");e.exports = r, r.CycleException = i;
    }, { "../lodash": 21 }], 17: [function (t, e, n) {
      function r() {
        this._arr = [], this._keyIndices = {};
      }var i = t("../lodash");e.exports = r, r.prototype.size = function () {
        return this._arr.length;
      }, r.prototype.keys = function () {
        return this._arr.map(function (t) {
          return t.key;
        });
      }, r.prototype.has = function (t) {
        return i.has(this._keyIndices, t);
      }, r.prototype.priority = function (t) {
        var e = this._keyIndices[t];if (void 0 !== e) return this._arr[e].priority;
      }, r.prototype.min = function () {
        if (0 === this.size()) throw new Error("Queue underflow");return this._arr[0].key;
      }, r.prototype.add = function (t, e) {
        var n = this._keyIndices;if (t = String(t), !i.has(n, t)) {
          var r = this._arr,
              o = r.length;return n[t] = o, r.push({ key: t, priority: e }), this._decrease(o), !0;
        }return !1;
      }, r.prototype.removeMin = function () {
        this._swap(0, this._arr.length - 1);var t = this._arr.pop();return delete this._keyIndices[t.key], this._heapify(0), t.key;
      }, r.prototype.decrease = function (t, e) {
        var n = this._keyIndices[t];if (e > this._arr[n].priority) throw new Error("New priority is greater than current priority. Key: " + t + " Old: " + this._arr[n].priority + " New: " + e);this._arr[n].priority = e, this._decrease(n);
      }, r.prototype._heapify = function (t) {
        var e = this._arr,
            n = 2 * t,
            r = n + 1,
            i = t;n < e.length && (i = e[n].priority < e[i].priority ? n : i, r < e.length && (i = e[r].priority < e[i].priority ? r : i), i !== t && (this._swap(t, i), this._heapify(i)));
      }, r.prototype._decrease = function (t) {
        for (var e, n = this._arr, r = n[t].priority; 0 !== t && (e = t >> 1, !(n[e].priority < r));) this._swap(t, e), t = e;
      }, r.prototype._swap = function (t, e) {
        var n = this._arr,
            r = this._keyIndices,
            i = n[t],
            o = n[e];n[t] = o, n[e] = i, r[o.key] = t, r[i.key] = e;
      };
    }, { "../lodash": 21 }], 18: [function (t, e, n) {
      function r(t) {
        this._isDirected = !c.has(t, "directed") || t.directed, this._isMultigraph = !!c.has(t, "multigraph") && t.multigraph, this._isCompound = !!c.has(t, "compound") && t.compound, this._label = void 0, this._defaultNodeLabelFn = c.constant(void 0), this._defaultEdgeLabelFn = c.constant(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children[l] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
      }function i(t, e) {
        t[e] ? t[e]++ : t[e] = 1;
      }function o(t, e) {
        --t[e] || delete t[e];
      }function u(t, e, n, r) {
        var i = "" + e,
            o = "" + n;if (!t && i > o) {
          var u = i;i = o, o = u;
        }return i + h + o + h + (c.isUndefined(r) ? f : r);
      }function s(t, e, n, r) {
        var i = "" + e,
            o = "" + n;if (!t && i > o) {
          var u = i;i = o, o = u;
        }var s = { v: i, w: o };return r && (s.name = r), s;
      }function a(t, e) {
        return u(t, e.v, e.w, e.name);
      }var c = t("./lodash");e.exports = r;var f = "\0",
          l = "\0",
          h = "";r.prototype._nodeCount = 0, r.prototype._edgeCount = 0, r.prototype.isDirected = function () {
        return this._isDirected;
      }, r.prototype.isMultigraph = function () {
        return this._isMultigraph;
      }, r.prototype.isCompound = function () {
        return this._isCompound;
      }, r.prototype.setGraph = function (t) {
        return this._label = t, this;
      }, r.prototype.graph = function () {
        return this._label;
      }, r.prototype.setDefaultNodeLabel = function (t) {
        return c.isFunction(t) || (t = c.constant(t)), this._defaultNodeLabelFn = t, this;
      }, r.prototype.nodeCount = function () {
        return this._nodeCount;
      }, r.prototype.nodes = function () {
        return c.keys(this._nodes);
      }, r.prototype.sources = function () {
        return c.filter(this.nodes(), c.bind(function (t) {
          return c.isEmpty(this._in[t]);
        }, this));
      }, r.prototype.sinks = function () {
        return c.filter(this.nodes(), c.bind(function (t) {
          return c.isEmpty(this._out[t]);
        }, this));
      }, r.prototype.setNodes = function (t, e) {
        var n = arguments;return c.each(t, c.bind(function (t) {
          n.length > 1 ? this.setNode(t, e) : this.setNode(t);
        }, this)), this;
      }, r.prototype.setNode = function (t, e) {
        return c.has(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = e), this) : (this._nodes[t] = arguments.length > 1 ? e : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = l, this._children[t] = {}, this._children[l][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
      }, r.prototype.node = function (t) {
        return this._nodes[t];
      }, r.prototype.hasNode = function (t) {
        return c.has(this._nodes, t);
      }, r.prototype.removeNode = function (t) {
        var e = this;if (c.has(this._nodes, t)) {
          var n = function (t) {
            e.removeEdge(e._edgeObjs[t]);
          };delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], c.each(this.children(t), c.bind(function (t) {
            this.setParent(t);
          }, this)), delete this._children[t]), c.each(c.keys(this._in[t]), n), delete this._in[t], delete this._preds[t], c.each(c.keys(this._out[t]), n), delete this._out[t], delete this._sucs[t], --this._nodeCount;
        }return this;
      }, r.prototype.setParent = function (t, e) {
        if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");if (c.isUndefined(e)) e = l;else {
          e += "";for (var n = e; !c.isUndefined(n); n = this.parent(n)) if (n === t) throw new Error("Setting " + e + " as parent of " + t + " would create create a cycle");this.setNode(e);
        }return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = e, this._children[e][t] = !0, this;
      }, r.prototype._removeFromParentsChildList = function (t) {
        delete this._children[this._parent[t]][t];
      }, r.prototype.parent = function (t) {
        if (this._isCompound) {
          var e = this._parent[t];if (e !== l) return e;
        }
      }, r.prototype.children = function (t) {
        if (c.isUndefined(t) && (t = l), this._isCompound) {
          var e = this._children[t];if (e) return c.keys(e);
        } else {
          if (t === l) return this.nodes();if (this.hasNode(t)) return [];
        }
      }, r.prototype.predecessors = function (t) {
        var e = this._preds[t];if (e) return c.keys(e);
      }, r.prototype.successors = function (t) {
        var e = this._sucs[t];if (e) return c.keys(e);
      }, r.prototype.neighbors = function (t) {
        var e = this.predecessors(t);if (e) return c.union(e, this.successors(t));
      }, r.prototype.filterNodes = function (t) {
        function e(t) {
          var o = r.parent(t);return void 0 === o || n.hasNode(o) ? (i[t] = o, o) : o in i ? i[o] : e(o);
        }var n = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });n.setGraph(this.graph()), c.each(this._nodes, c.bind(function (e, r) {
          t(r) && n.setNode(r, e);
        }, this)), c.each(this._edgeObjs, c.bind(function (t) {
          n.hasNode(t.v) && n.hasNode(t.w) && n.setEdge(t, this.edge(t));
        }, this));var r = this,
            i = {};return this._isCompound && c.each(n.nodes(), function (t) {
          n.setParent(t, e(t));
        }), n;
      }, r.prototype.setDefaultEdgeLabel = function (t) {
        return c.isFunction(t) || (t = c.constant(t)), this._defaultEdgeLabelFn = t, this;
      }, r.prototype.edgeCount = function () {
        return this._edgeCount;
      }, r.prototype.edges = function () {
        return c.values(this._edgeObjs);
      }, r.prototype.setPath = function (t, e) {
        var n = this,
            r = arguments;return c.reduce(t, function (t, i) {
          return r.length > 1 ? n.setEdge(t, i, e) : n.setEdge(t, i), i;
        }), this;
      }, r.prototype.setEdge = function () {
        var t,
            e,
            n,
            r,
            o = !1,
            a = arguments[0];"object" == typeof a && null !== a && "v" in a ? (t = a.v, e = a.w, n = a.name, 2 === arguments.length && (r = arguments[1], o = !0)) : (t = a, e = arguments[1], n = arguments[3], arguments.length > 2 && (r = arguments[2], o = !0)), t = "" + t, e = "" + e, c.isUndefined(n) || (n = "" + n);var f = u(this._isDirected, t, e, n);if (c.has(this._edgeLabels, f)) return o && (this._edgeLabels[f] = r), this;if (!c.isUndefined(n) && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(t), this.setNode(e), this._edgeLabels[f] = o ? r : this._defaultEdgeLabelFn(t, e, n);var l = s(this._isDirected, t, e, n);return t = l.v, e = l.w, Object.freeze(l), this._edgeObjs[f] = l, i(this._preds[e], t), i(this._sucs[t], e), this._in[e][f] = l, this._out[t][f] = l, this._edgeCount++, this;
      }, r.prototype.edge = function (t, e, n) {
        var r = 1 === arguments.length ? a(this._isDirected, arguments[0]) : u(this._isDirected, t, e, n);return this._edgeLabels[r];
      }, r.prototype.hasEdge = function (t, e, n) {
        var r = 1 === arguments.length ? a(this._isDirected, arguments[0]) : u(this._isDirected, t, e, n);return c.has(this._edgeLabels, r);
      }, r.prototype.removeEdge = function (t, e, n) {
        var r = 1 === arguments.length ? a(this._isDirected, arguments[0]) : u(this._isDirected, t, e, n),
            i = this._edgeObjs[r];return i && (t = i.v, e = i.w, delete this._edgeLabels[r], delete this._edgeObjs[r], o(this._preds[e], t), o(this._sucs[t], e), delete this._in[e][r], delete this._out[t][r], this._edgeCount--), this;
      }, r.prototype.inEdges = function (t, e) {
        var n = this._in[t];if (n) {
          var r = c.values(n);return e ? c.filter(r, function (t) {
            return t.v === e;
          }) : r;
        }
      }, r.prototype.outEdges = function (t, e) {
        var n = this._out[t];if (n) {
          var r = c.values(n);return e ? c.filter(r, function (t) {
            return t.w === e;
          }) : r;
        }
      }, r.prototype.nodeEdges = function (t, e) {
        var n = this.inEdges(t, e);if (n) return n.concat(this.outEdges(t, e));
      };
    }, { "./lodash": 21 }], 19: [function (t, e, n) {
      e.exports = { Graph: t("./graph"), version: t("./version") };
    }, { "./graph": 18, "./version": 22 }], 20: [function (t, e, n) {
      function r(t) {
        var e = { options: { directed: t.isDirected(), multigraph: t.isMultigraph(), compound: t.isCompound() }, nodes: i(t), edges: o(t) };return s.isUndefined(t.graph()) || (e.value = s.clone(t.graph())), e;
      }function i(t) {
        return s.map(t.nodes(), function (e) {
          var n = t.node(e),
              r = t.parent(e),
              i = { v: e };return s.isUndefined(n) || (i.value = n), s.isUndefined(r) || (i.parent = r), i;
        });
      }function o(t) {
        return s.map(t.edges(), function (e) {
          var n = t.edge(e),
              r = { v: e.v, w: e.w };return s.isUndefined(e.name) || (r.name = e.name), s.isUndefined(n) || (r.value = n), r;
        });
      }function u(t) {
        var e = new a(t.options).setGraph(t.value);return s.each(t.nodes, function (t) {
          e.setNode(t.v, t.value), t.parent && e.setParent(t.v, t.parent);
        }), s.each(t.edges, function (t) {
          e.setEdge({ v: t.v, w: t.w, name: t.name }, t.value);
        }), e;
      }var s = t("./lodash"),
          a = t("./graph");e.exports = { write: r, read: u };
    }, { "./graph": 18, "./lodash": 21 }], 21: [function (t, e, n) {
      var r;if ("function" == typeof t) try {
        r = t("lodash");
      } catch (t) {}r || (r = window._), e.exports = r;
    }, { lodash: 23 }], 22: [function (t, e, n) {
      e.exports = "2.1.1";
    }, {}], 23: [function (e, n, r) {
      (function (e) {
        (function () {
          function i(t, e) {
            return t.set(e[0], e[1]), t;
          }function o(t, e) {
            return t.add(e), t;
          }function u(t, e, n) {
            switch (n.length) {case 0:
                return t.call(e);case 1:
                return t.call(e, n[0]);case 2:
                return t.call(e, n[0], n[1]);case 3:
                return t.call(e, n[0], n[1], n[2]);}return t.apply(e, n);
          }function s(t, e, n, r) {
            for (var i = -1, o = null == t ? 0 : t.length; ++i < o;) {
              var u = t[i];e(r, u, n(u), t);
            }return r;
          }function a(t, e) {
            for (var n = -1, r = null == t ? 0 : t.length; ++n < r && !1 !== e(t[n], n, t););return t;
          }function c(t, e) {
            for (var n = null == t ? 0 : t.length; n-- && !1 !== e(t[n], n, t););return t;
          }function f(t, e) {
            for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) if (!e(t[n], n, t)) return !1;return !0;
          }function l(t, e) {
            for (var n = -1, r = null == t ? 0 : t.length, i = 0, o = []; ++n < r;) {
              var u = t[n];e(u, n, t) && (o[i++] = u);
            }return o;
          }function h(t, e) {
            return !!(null == t ? 0 : t.length) && x(t, e, 0) > -1;
          }function p(t, e, n) {
            for (var r = -1, i = null == t ? 0 : t.length; ++r < i;) if (n(e, t[r])) return !0;return !1;
          }function d(t, e) {
            for (var n = -1, r = null == t ? 0 : t.length, i = Array(r); ++n < r;) i[n] = e(t[n], n, t);return i;
          }function v(t, e) {
            for (var n = -1, r = e.length, i = t.length; ++n < r;) t[i + n] = e[n];return t;
          }function _(t, e, n, r) {
            var i = -1,
                o = null == t ? 0 : t.length;for (r && o && (n = t[++i]); ++i < o;) n = e(n, t[i], i, t);return n;
          }function y(t, e, n, r) {
            var i = null == t ? 0 : t.length;for (r && i && (n = t[--i]); i--;) n = e(n, t[i], i, t);return n;
          }function g(t, e) {
            for (var n = -1, r = null == t ? 0 : t.length; ++n < r;) if (e(t[n], n, t)) return !0;return !1;
          }function m(t) {
            return t.split("");
          }function b(t) {
            return t.match(Ue) || [];
          }function w(t, e, n) {
            var r;return n(t, function (t, n, i) {
              if (e(t, n, i)) return r = n, !1;
            }), r;
          }function E(t, e, n, r) {
            for (var i = t.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i;) if (e(t[o], o, t)) return o;return -1;
          }function x(t, e, n) {
            return e === e ? X(t, e, n) : E(t, O, n);
          }function j(t, e, n, r) {
            for (var i = n - 1, o = t.length; ++i < o;) if (r(t[i], e)) return i;return -1;
          }function O(t) {
            return t !== t;
          }function C(t, e) {
            var n = null == t ? 0 : t.length;return n ? P(t, e) / n : Rt;
          }function T(t) {
            return function (e) {
              return null == e ? rt : e[t];
            };
          }function A(t) {
            return function (e) {
              return null == t ? rt : t[e];
            };
          }function S(t, e, n, r, i) {
            return i(t, function (t, i, o) {
              n = r ? (r = !1, t) : e(n, t, i, o);
            }), n;
          }function D(t, e) {
            var n = t.length;for (t.sort(e); n--;) t[n] = t[n].value;return t;
          }function P(t, e) {
            for (var n, r = -1, i = t.length; ++r < i;) {
              var o = e(t[r]);o !== rt && (n = n === rt ? o : n + o);
            }return n;
          }function I(t, e) {
            for (var n = -1, r = Array(t); ++n < t;) r[n] = e(n);return r;
          }function k(t, e) {
            return d(e, function (e) {
              return [e, t[e]];
            });
          }function R(t) {
            return function (e) {
              return t(e);
            };
          }function N(t, e) {
            return d(e, function (e) {
              return t[e];
            });
          }function U(t, e) {
            return t.has(e);
          }function F(t, e) {
            for (var n = -1, r = t.length; ++n < r && x(e, t[n], 0) > -1;);return n;
          }function L(t, e) {
            for (var n = t.length; n-- && x(e, t[n], 0) > -1;);return n;
          }function q(t, e) {
            for (var n = t.length, r = 0; n--;) t[n] === e && ++r;return r;
          }function z(t) {
            return "\\" + wn[t];
          }function M(t, e) {
            return null == t ? rt : t[e];
          }function H(t) {
            return hn.test(t);
          }function $(t) {
            return pn.test(t);
          }function B(t) {
            for (var e, n = []; !(e = t.next()).done;) n.push(e.value);return n;
          }function W(t) {
            var e = -1,
                n = Array(t.size);return t.forEach(function (t, r) {
              n[++e] = [r, t];
            }), n;
          }function G(t, e) {
            return function (n) {
              return t(e(n));
            };
          }function Z(t, e) {
            for (var n = -1, r = t.length, i = 0, o = []; ++n < r;) {
              var u = t[n];u !== e && u !== ct || (t[n] = ct, o[i++] = n);
            }return o;
          }function V(t) {
            var e = -1,
                n = Array(t.size);return t.forEach(function (t) {
              n[++e] = t;
            }), n;
          }function J(t) {
            var e = -1,
                n = Array(t.size);return t.forEach(function (t) {
              n[++e] = [t, t];
            }), n;
          }function X(t, e, n) {
            for (var r = n - 1, i = t.length; ++r < i;) if (t[r] === e) return r;return -1;
          }function K(t, e, n) {
            for (var r = n + 1; r--;) if (t[r] === e) return r;return r;
          }function Y(t) {
            return H(t) ? tt(t) : Ln(t);
          }function Q(t) {
            return H(t) ? et(t) : m(t);
          }function tt(t) {
            for (var e = fn.lastIndex = 0; fn.test(t);) ++e;return e;
          }function et(t) {
            return t.match(fn) || [];
          }function nt(t) {
            return t.match(ln) || [];
          }
          var rt,
              it = 200,
              ot = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",
              ut = "Expected a function",
              st = "__lodash_hash_undefined__",
              at = 500,
              ct = "__lodash_placeholder__",
              ft = 1,
              lt = 2,
              ht = 4,
              pt = 1,
              dt = 2,
              vt = 1,
              _t = 2,
              yt = 4,
              gt = 8,
              mt = 16,
              bt = 32,
              wt = 64,
              Et = 128,
              xt = 256,
              jt = 512,
              Ot = 30,
              Ct = "...",
              Tt = 800,
              At = 16,
              St = 1,
              Dt = 2,
              Pt = 1 / 0,
              It = 9007199254740991,
              kt = 1.7976931348623157e308,
              Rt = NaN,
              Nt = 4294967295,
              Ut = Nt - 1,
              Ft = Nt >>> 1,
              Lt = [["ary", Et], ["bind", vt], ["bindKey", _t], ["curry", gt], ["curryRight", mt], ["flip", jt], ["partial", bt], ["partialRight", wt], ["rearg", xt]],
              qt = "[object Arguments]",
              zt = "[object Array]",
              Mt = "[object AsyncFunction]",
              Ht = "[object Boolean]",
              $t = "[object Date]",
              Bt = "[object DOMException]",
              Wt = "[object Error]",
              Gt = "[object Function]",
              Zt = "[object GeneratorFunction]",
              Vt = "[object Map]",
              Jt = "[object Number]",
              Xt = "[object Null]",
              Kt = "[object Object]",
              Yt = "[object Proxy]",
              Qt = "[object RegExp]",
              te = "[object Set]",
              ee = "[object String]",
              ne = "[object Symbol]",
              re = "[object Undefined]",
              ie = "[object WeakMap]",
              oe = "[object WeakSet]",
              ue = "[object ArrayBuffer]",
              se = "[object DataView]",
              ae = "[object Float32Array]",
              ce = "[object Float64Array]",
              fe = "[object Int8Array]",
              le = "[object Int16Array]",
              he = "[object Int32Array]",
              pe = "[object Uint8Array]",
              de = "[object Uint8ClampedArray]",
              ve = "[object Uint16Array]",
              _e = "[object Uint32Array]",
              ye = /\b__p \+= '';/g,
              ge = /\b(__p \+=) '' \+/g,
              me = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
              be = /&(?:amp|lt|gt|quot|#39);/g,
              we = /[&<>"']/g,
              Ee = RegExp(be.source),
              xe = RegExp(we.source),
              je = /<%=([\s\S]+?)%>/g,
              Oe = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
              Ce = /^\w*$/,
              Te = /^\./,
              Ae = /[\\^$.*+?()[\]{}|]/g,
              Se = RegExp(Ae.source),
              De = /^\s+|\s+$/g,
              Pe = /^\s+/,
              Ie = /\s+$/,
              ke = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
              Re = /\{\n\/\* \[wrapped with (.+)\] \*/,
              Ne = /,? & /,
              Ue = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
              Fe = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
              Le = /\w*$/,
              qe = /^[-+]0x[0-9a-f]+$/i,
              ze = /^0b[01]+$/i,
              Me = /^\[object .+?Constructor\]$/,
              He = /^0o[0-7]+$/i,
              $e = /^(?:0|[1-9]\d*)$/,
              Be = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
              We = /($^)/,
              Ge = /['\n\r\u2028\u2029\\]/g,
              Ze = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
              Ve = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
              Je = "[" + Ze + "]",
              Xe = "[a-z\\xdf-\\xf6\\xf8-\\xff]",
              Ke = "[^\\ud800-\\udfff" + Ve + "\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]",
              Ye = "\\ud83c[\\udffb-\\udfff]",
              Qe = "(?:\\ud83c[\\udde6-\\uddff]){2}",
              tn = "[\\ud800-\\udbff][\\udc00-\\udfff]",
              en = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
              nn = "(?:" + Je + "|" + Ye + ")?",
              rn = "(?:\\u200d(?:" + ["[^\\ud800-\\udfff]", Qe, tn].join("|") + ")[\\ufe0e\\ufe0f]?" + nn + ")*",
              on = "[\\ufe0e\\ufe0f]?" + nn + rn,
              un = "(?:" + ["[\\u2700-\\u27bf]", Qe, tn].join("|") + ")" + on,
              sn = "(?:" + ["[^\\ud800-\\udfff]" + Je + "?", Je, Qe, tn, "[\\ud800-\\udfff]"].join("|") + ")",
              an = RegExp("['’]", "g"),
              cn = RegExp(Je, "g"),
              fn = RegExp(Ye + "(?=" + Ye + ")|" + sn + on, "g"),
              ln = RegExp([en + "?" + Xe + "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" + ["[" + Ve + "]", en, "$"].join("|") + ")", "(?:" + en + "|" + Ke + ")+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" + ["[" + Ve + "]", en + "(?:" + Xe + "|" + Ke + ")", "$"].join("|") + ")", en + "?(?:" + Xe + "|" + Ke + ")+(?:['’](?:d|ll|m|re|s|t|ve))?", en + "+(?:['’](?:D|LL|M|RE|S|T|VE))?", "\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)", "\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)", "\\d+", un].join("|"), "g"),
              hn = RegExp("[\\u200d\\ud800-\\udfff" + Ze + "\\ufe0e\\ufe0f]"),
              pn = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
              dn = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
              vn = -1,
              _n = {};_n[ae] = _n[ce] = _n[fe] = _n[le] = _n[he] = _n[pe] = _n[de] = _n[ve] = _n[_e] = !0, _n[qt] = _n[zt] = _n[ue] = _n[Ht] = _n[se] = _n[$t] = _n[Wt] = _n[Gt] = _n[Vt] = _n[Jt] = _n[Kt] = _n[Qt] = _n[te] = _n[ee] = _n[ie] = !1;var yn = {};yn[qt] = yn[zt] = yn[ue] = yn[se] = yn[Ht] = yn[$t] = yn[ae] = yn[ce] = yn[fe] = yn[le] = yn[he] = yn[Vt] = yn[Jt] = yn[Kt] = yn[Qt] = yn[te] = yn[ee] = yn[ne] = yn[pe] = yn[de] = yn[ve] = yn[_e] = !0, yn[Wt] = yn[Gt] = yn[ie] = !1;var gn = { "À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A", "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "Ç": "C", "ç": "c", "Ð": "D", "ð": "d", "È": "E", "É": "E", "Ê": "E", "Ë": "E", "è": "e", "é": "e", "ê": "e", "ë": "e", "Ì": "I", "Í": "I", "Î": "I", "Ï": "I", "ì": "i", "í": "i", "î": "i", "ï": "i", "Ñ": "N", "ñ": "n", "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O", "Ø": "O", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U", "ù": "u", "ú": "u", "û": "u", "ü": "u", "Ý": "Y", "ý": "y", "ÿ": "y", "Æ": "Ae", "æ": "ae", "Þ": "Th", "þ": "th", "ß": "ss", "Ā": "A", "Ă": "A", "Ą": "A", "ā": "a", "ă": "a", "ą": "a", "Ć": "C", "Ĉ": "C", "Ċ": "C", "Č": "C", "ć": "c", "ĉ": "c", "ċ": "c", "č": "c", "Ď": "D", "Đ": "D", "ď": "d", "đ": "d", "Ē": "E", "Ĕ": "E", "Ė": "E", "Ę": "E", "Ě": "E", "ē": "e", "ĕ": "e", "ė": "e", "ę": "e", "ě": "e", "Ĝ": "G", "Ğ": "G", "Ġ": "G", "Ģ": "G", "ĝ": "g", "ğ": "g", "ġ": "g", "ģ": "g", "Ĥ": "H", "Ħ": "H", "ĥ": "h", "ħ": "h", "Ĩ": "I", "Ī": "I", "Ĭ": "I", "Į": "I", "İ": "I", "ĩ": "i", "ī": "i", "ĭ": "i", "į": "i", "ı": "i", "Ĵ": "J", "ĵ": "j", "Ķ": "K", "ķ": "k", "ĸ": "k", "Ĺ": "L", "Ļ": "L", "Ľ": "L", "Ŀ": "L", "Ł": "L", "ĺ": "l", "ļ": "l", "ľ": "l", "ŀ": "l", "ł": "l", "Ń": "N", "Ņ": "N", "Ň": "N", "Ŋ": "N", "ń": "n", "ņ": "n", "ň": "n", "ŋ": "n", "Ō": "O", "Ŏ": "O", "Ő": "O", "ō": "o", "ŏ": "o", "ő": "o", "Ŕ": "R", "Ŗ": "R", "Ř": "R", "ŕ": "r", "ŗ": "r", "ř": "r", "Ś": "S", "Ŝ": "S", "Ş": "S", "Š": "S", "ś": "s", "ŝ": "s", "ş": "s", "š": "s", "Ţ": "T", "Ť": "T", "Ŧ": "T", "ţ": "t", "ť": "t", "ŧ": "t", "Ũ": "U", "Ū": "U", "Ŭ": "U", "Ů": "U", "Ű": "U", "Ų": "U", "ũ": "u", "ū": "u", "ŭ": "u", "ů": "u", "ű": "u", "ų": "u", "Ŵ": "W", "ŵ": "w", "Ŷ": "Y", "ŷ": "y", "Ÿ": "Y", "Ź": "Z", "Ż": "Z", "Ž": "Z", "ź": "z", "ż": "z", "ž": "z", "Ĳ": "IJ", "ĳ": "ij", "Œ": "Oe", "œ": "oe", "ŉ": "'n", "ſ": "s" },
              mn = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" },
              bn = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" },
              wn = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" },
              En = parseFloat,
              xn = parseInt,
              jn = "object" == typeof e && e && e.Object === Object && e,
              On = "object" == typeof self && self && self.Object === Object && self,
              Cn = jn || On || Function("return this")(),
              Tn = "object" == typeof r && r && !r.nodeType && r,
              An = Tn && "object" == typeof n && n && !n.nodeType && n,
              Sn = An && An.exports === Tn,
              Dn = Sn && jn.process,
              Pn = function () {
            try {
              return Dn && Dn.binding && Dn.binding("util");
            } catch (t) {}
          }(),
              In = Pn && Pn.isArrayBuffer,
              kn = Pn && Pn.isDate,
              Rn = Pn && Pn.isMap,
              Nn = Pn && Pn.isRegExp,
              Un = Pn && Pn.isSet,
              Fn = Pn && Pn.isTypedArray,
              Ln = T("length"),
              qn = A(gn),
              zn = A(mn),
              Mn = A(bn),
              Hn = function t(e) {
            function n(t) {
              if (ea(t) && !ph(t) && !(t instanceof A)) {
                if (t instanceof m) return t;if (pf.call(t, "__wrapped__")) return Yo(t);
              }return new m(t);
            }function r() {}function m(t, e) {
              this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = rt;
            }function A(t) {
              this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Nt, this.__views__ = [];
            }function X() {
              var t = new A(this.__wrapped__);return t.__actions__ = ki(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = ki(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = ki(this.__views__), t;
            }function tt() {
              if (this.__filtered__) {
                var t = new A(this);t.__dir__ = -1, t.__filtered__ = !0;
              } else t = this.clone(), t.__dir__ *= -1;return t;
            }function et() {
              var t = this.__wrapped__.value(),
                  e = this.__dir__,
                  n = ph(t),
                  r = e < 0,
                  i = n ? t.length : 0,
                  o = xo(0, i, this.__views__),
                  u = o.start,
                  s = o.end,
                  a = s - u,
                  c = r ? s : u - 1,
                  f = this.__iteratees__,
                  l = f.length,
                  h = 0,
                  p = $f(a, this.__takeCount__);if (!n || !r && i == a && p == a) return di(t, this.__actions__);var d = [];t: for (; a-- && h < p;) {
                c += e;for (var v = -1, _ = t[c]; ++v < l;) {
                  var y = f[v],
                      g = y.iteratee,
                      m = y.type,
                      b = g(_);if (m == Dt) _ = b;else if (!b) {
                    if (m == St) continue t;break t;
                  }
                }d[h++] = _;
              }return d;
            }function Ue(t) {
              var e = -1,
                  n = null == t ? 0 : t.length;for (this.clear(); ++e < n;) {
                var r = t[e];this.set(r[0], r[1]);
              }
            }function Ze() {
              this.__data__ = Qf ? Qf(null) : {}, this.size = 0;
            }function Ve(t) {
              var e = this.has(t) && delete this.__data__[t];return this.size -= e ? 1 : 0, e;
            }function Je(t) {
              var e = this.__data__;if (Qf) {
                var n = e[t];return n === st ? rt : n;
              }return pf.call(e, t) ? e[t] : rt;
            }function Xe(t) {
              var e = this.__data__;return Qf ? e[t] !== rt : pf.call(e, t);
            }function Ke(t, e) {
              var n = this.__data__;return this.size += this.has(t) ? 0 : 1, n[t] = Qf && e === rt ? st : e, this;
            }function Ye(t) {
              var e = -1,
                  n = null == t ? 0 : t.length;for (this.clear(); ++e < n;) {
                var r = t[e];this.set(r[0], r[1]);
              }
            }function Qe() {
              this.__data__ = [], this.size = 0;
            }function tn(t) {
              var e = this.__data__,
                  n = Gn(e, t);return !(n < 0) && (n == e.length - 1 ? e.pop() : Tf.call(e, n, 1), --this.size, !0);
            }function en(t) {
              var e = this.__data__,
                  n = Gn(e, t);return n < 0 ? rt : e[n][1];
            }function nn(t) {
              return Gn(this.__data__, t) > -1;
            }function rn(t, e) {
              var n = this.__data__,
                  r = Gn(n, t);return r < 0 ? (++this.size, n.push([t, e])) : n[r][1] = e, this;
            }function on(t) {
              var e = -1,
                  n = null == t ? 0 : t.length;for (this.clear(); ++e < n;) {
                var r = t[e];this.set(r[0], r[1]);
              }
            }function un() {
              this.size = 0, this.__data__ = { hash: new Ue(), map: new (Jf || Ye)(), string: new Ue() };
            }function sn(t) {
              var e = mo(this, t).delete(t);return this.size -= e ? 1 : 0, e;
            }function fn(t) {
              return mo(this, t).get(t);
            }function ln(t) {
              return mo(this, t).has(t);
            }function hn(t, e) {
              var n = mo(this, t),
                  r = n.size;return n.set(t, e), this.size += n.size == r ? 0 : 1, this;
            }function pn(t) {
              var e = -1,
                  n = null == t ? 0 : t.length;for (this.__data__ = new on(); ++e < n;) this.add(t[e]);
            }function gn(t) {
              return this.__data__.set(t, st), this;
            }function mn(t) {
              return this.__data__.has(t);
            }function bn(t) {
              var e = this.__data__ = new Ye(t);this.size = e.size;
            }function wn() {
              this.__data__ = new Ye(), this.size = 0;
            }function jn(t) {
              var e = this.__data__,
                  n = e.delete(t);return this.size = e.size, n;
            }function On(t) {
              return this.__data__.get(t);
            }function Tn(t) {
              return this.__data__.has(t);
            }function An(t, e) {
              var n = this.__data__;if (n instanceof Ye) {
                var r = n.__data__;if (!Jf || r.length < it - 1) return r.push([t, e]), this.size = ++n.size, this;n = this.__data__ = new on(r);
              }return n.set(t, e), this.size = n.size, this;
            }function Dn(t, e) {
              var n = ph(t),
                  r = !n && hh(t),
                  i = !n && !r && vh(t),
                  o = !n && !r && !i && bh(t),
                  u = n || r || i || o,
                  s = u ? I(t.length, uf) : [],
                  a = s.length;for (var c in t) !e && !pf.call(t, c) || u && ("length" == c || i && ("offset" == c || "parent" == c) || o && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || Po(c, a)) || s.push(c);return s;
            }function Pn(t) {
              var e = t.length;return e ? t[Jr(0, e - 1)] : rt;
            }function Ln(t, e) {
              return Vo(ki(t), Yn(e, 0, t.length));
            }function $n(t) {
              return Vo(ki(t));
            }function Bn(t, e, n) {
              (n === rt || Ms(t[e], n)) && (n !== rt || e in t) || Xn(t, e, n);
            }function Wn(t, e, n) {
              var r = t[e];pf.call(t, e) && Ms(r, n) && (n !== rt || e in t) || Xn(t, e, n);
            }function Gn(t, e) {
              for (var n = t.length; n--;) if (Ms(t[n][0], e)) return n;return -1;
            }function Zn(t, e, n, r) {
              return ll(t, function (t, i, o) {
                e(r, t, n(t), o);
              }), r;
            }function Vn(t, e) {
              return t && Ri(e, Ua(e), t);
            }function Jn(t, e) {
              return t && Ri(e, Fa(e), t);
            }function Xn(t, e, n) {
              "__proto__" == e && Pf ? Pf(t, e, { configurable: !0, enumerable: !0, value: n, writable: !0 }) : t[e] = n;
            }function Kn(t, e) {
              for (var n = -1, r = e.length, i = Yc(r), o = null == t; ++n < r;) i[n] = o ? rt : ka(t, e[n]);return i;
            }function Yn(t, e, n) {
              return t === t && (n !== rt && (t = t <= n ? t : n), e !== rt && (t = t >= e ? t : e)), t;
            }function Qn(t, e, n, r, i, o) {
              var u,
                  s = e & ft,
                  c = e & lt,
                  f = e & ht;if (n && (u = i ? n(t, r, i, o) : n(t)), u !== rt) return u;if (!ta(t)) return t;var l = ph(t);if (l) {
                if (u = Co(t), !s) return ki(t, u);
              } else {
                var h = xl(t),
                    p = h == Gt || h == Zt;if (vh(t)) return wi(t, s);if (h == Kt || h == qt || p && !i) {
                  if (u = c || p ? {} : To(t), !s) return c ? Ui(t, Jn(u, t)) : Ni(t, Vn(u, t));
                } else {
                  if (!yn[h]) return i ? t : {};u = Ao(t, h, Qn, s);
                }
              }o || (o = new bn());var d = o.get(t);if (d) return d;o.set(t, u);var v = f ? c ? vo : po : c ? Fa : Ua,
                  _ = l ? rt : v(t);return a(_ || t, function (r, i) {
                _ && (i = r, r = t[i]), Wn(u, i, Qn(r, e, n, i, t, o));
              }), u;
            }function tr(t) {
              var e = Ua(t);return function (n) {
                return er(n, t, e);
              };
            }function er(t, e, n) {
              var r = n.length;if (null == t) return !r;for (t = rf(t); r--;) {
                var i = n[r],
                    o = e[i],
                    u = t[i];if (u === rt && !(i in t) || !o(u)) return !1;
              }return !0;
            }function nr(t, e, n) {
              if ("function" != typeof t) throw new sf(ut);return Cl(function () {
                t.apply(rt, n);
              }, e);
            }function rr(t, e, n, r) {
              var i = -1,
                  o = h,
                  u = !0,
                  s = t.length,
                  a = [],
                  c = e.length;if (!s) return a;n && (e = d(e, R(n))), r ? (o = p, u = !1) : e.length >= it && (o = U, u = !1, e = new pn(e));t: for (; ++i < s;) {
                var f = t[i],
                    l = null == n ? f : n(f);if (f = r || 0 !== f ? f : 0, u && l === l) {
                  for (var v = c; v--;) if (e[v] === l) continue t;a.push(f);
                } else o(e, l, r) || a.push(f);
              }return a;
            }function ir(t, e) {
              var n = !0;return ll(t, function (t, r, i) {
                return n = !!e(t, r, i);
              }), n;
            }function or(t, e, n) {
              for (var r = -1, i = t.length; ++r < i;) {
                var o = t[r],
                    u = e(o);if (null != u && (s === rt ? u === u && !ha(u) : n(u, s))) var s = u,
                    a = o;
              }return a;
            }function ur(t, e, n, r) {
              var i = t.length;for (n = ga(n), n < 0 && (n = -n > i ? 0 : i + n), r = r === rt || r > i ? i : ga(r), r < 0 && (r += i), r = n > r ? 0 : ma(r); n < r;) t[n++] = e;return t;
            }function sr(t, e) {
              var n = [];return ll(t, function (t, r, i) {
                e(t, r, i) && n.push(t);
              }), n;
            }function ar(t, e, n, r, i) {
              var o = -1,
                  u = t.length;for (n || (n = Do), i || (i = []); ++o < u;) {
                var s = t[o];e > 0 && n(s) ? e > 1 ? ar(s, e - 1, n, r, i) : v(i, s) : r || (i[i.length] = s);
              }return i;
            }function cr(t, e) {
              return t && pl(t, e, Ua);
            }function fr(t, e) {
              return t && dl(t, e, Ua);
            }function lr(t, e) {
              return l(e, function (e) {
                return Ks(t[e]);
              });
            }function hr(t, e) {
              e = mi(e, t);for (var n = 0, r = e.length; null != t && n < r;) t = t[Jo(e[n++])];return n && n == r ? t : rt;
            }function pr(t, e, n) {
              var r = e(t);return ph(t) ? r : v(r, n(t));
            }function dr(t) {
              return null == t ? t === rt ? re : Xt : Df && Df in rf(t) ? Eo(t) : Ho(t);
            }function vr(t, e) {
              return t > e;
            }function _r(t, e) {
              return null != t && pf.call(t, e);
            }function yr(t, e) {
              return null != t && e in rf(t);
            }function gr(t, e, n) {
              return t >= $f(e, n) && t < Hf(e, n);
            }function mr(t, e, n) {
              for (var r = n ? p : h, i = t[0].length, o = t.length, u = o, s = Yc(o), a = 1 / 0, c = []; u--;) {
                var f = t[u];u && e && (f = d(f, R(e))), a = $f(f.length, a), s[u] = !n && (e || i >= 120 && f.length >= 120) ? new pn(u && f) : rt;
              }f = t[0];var l = -1,
                  v = s[0];t: for (; ++l < i && c.length < a;) {
                var _ = f[l],
                    y = e ? e(_) : _;if (_ = n || 0 !== _ ? _ : 0, !(v ? U(v, y) : r(c, y, n))) {
                  for (u = o; --u;) {
                    var g = s[u];if (!(g ? U(g, y) : r(t[u], y, n))) continue t;
                  }v && v.push(y), c.push(_);
                }
              }return c;
            }function br(t, e, n, r) {
              return cr(t, function (t, i, o) {
                e(r, n(t), i, o);
              }), r;
            }function wr(t, e, n) {
              e = mi(e, t), t = Bo(t, e);var r = null == t ? t : t[Jo(yu(e))];return null == r ? rt : u(r, t, n);
            }function Er(t) {
              return ea(t) && dr(t) == qt;
            }function xr(t) {
              return ea(t) && dr(t) == ue;
            }function jr(t) {
              return ea(t) && dr(t) == $t;
            }function Or(t, e, n, r, i) {
              return t === e || (null == t || null == e || !ea(t) && !ea(e) ? t !== t && e !== e : Cr(t, e, n, r, Or, i));
            }function Cr(t, e, n, r, i, o) {
              var u = ph(t),
                  s = ph(e),
                  a = u ? zt : xl(t),
                  c = s ? zt : xl(e);a = a == qt ? Kt : a, c = c == qt ? Kt : c;var f = a == Kt,
                  l = c == Kt,
                  h = a == c;if (h && vh(t)) {
                if (!vh(e)) return !1;u = !0, f = !1;
              }if (h && !f) return o || (o = new bn()), u || bh(t) ? co(t, e, n, r, i, o) : fo(t, e, a, n, r, i, o);if (!(n & pt)) {
                var p = f && pf.call(t, "__wrapped__"),
                    d = l && pf.call(e, "__wrapped__");if (p || d) {
                  var v = p ? t.value() : t,
                      _ = d ? e.value() : e;return o || (o = new bn()), i(v, _, n, r, o);
                }
              }return !!h && (o || (o = new bn()), lo(t, e, n, r, i, o));
            }function Tr(t) {
              return ea(t) && xl(t) == Vt;
            }function Ar(t, e, n, r) {
              var i = n.length,
                  o = i,
                  u = !r;if (null == t) return !o;for (t = rf(t); i--;) {
                var s = n[i];if (u && s[2] ? s[1] !== t[s[0]] : !(s[0] in t)) return !1;
              }for (; ++i < o;) {
                s = n[i];var a = s[0],
                    c = t[a],
                    f = s[1];if (u && s[2]) {
                  if (c === rt && !(a in t)) return !1;
                } else {
                  var l = new bn();if (r) var h = r(c, f, a, t, e, l);if (!(h === rt ? Or(f, c, pt | dt, r, l) : h)) return !1;
                }
              }return !0;
            }function Sr(t) {
              return !(!ta(t) || Uo(t)) && (Ks(t) ? mf : Me).test(Xo(t));
            }function Dr(t) {
              return ea(t) && dr(t) == Qt;
            }function Pr(t) {
              return ea(t) && xl(t) == te;
            }function Ir(t) {
              return ea(t) && Qs(t.length) && !!_n[dr(t)];
            }function kr(t) {
              return "function" == typeof t ? t : null == t ? Cc : "object" == typeof t ? ph(t) ? qr(t[0], t[1]) : Lr(t) : Rc(t);
            }function Rr(t) {
              if (!Fo(t)) return Mf(t);var e = [];for (var n in rf(t)) pf.call(t, n) && "constructor" != n && e.push(n);return e;
            }function Nr(t) {
              if (!ta(t)) return Mo(t);var e = Fo(t),
                  n = [];for (var r in t) ("constructor" != r || !e && pf.call(t, r)) && n.push(r);return n;
            }function Ur(t, e) {
              return t < e;
            }function Fr(t, e) {
              var n = -1,
                  r = Hs(t) ? Yc(t.length) : [];return ll(t, function (t, i, o) {
                r[++n] = e(t, i, o);
              }), r;
            }function Lr(t) {
              var e = bo(t);return 1 == e.length && e[0][2] ? qo(e[0][0], e[0][1]) : function (n) {
                return n === t || Ar(n, t, e);
              };
            }function qr(t, e) {
              return ko(t) && Lo(e) ? qo(Jo(t), e) : function (n) {
                var r = ka(n, t);return r === rt && r === e ? Na(n, t) : Or(e, r, pt | dt);
              };
            }function zr(t, e, n, r, i) {
              t !== e && pl(e, function (o, u) {
                if (ta(o)) i || (i = new bn()), Mr(t, e, u, n, zr, r, i);else {
                  var s = r ? r(t[u], o, u + "", t, e, i) : rt;s === rt && (s = o), Bn(t, u, s);
                }
              }, Fa);
            }function Mr(t, e, n, r, i, o, u) {
              var s = t[n],
                  a = e[n],
                  c = u.get(a);if (c) return void Bn(t, n, c);var f = o ? o(s, a, n + "", t, e, u) : rt,
                  l = f === rt;if (l) {
                var h = ph(a),
                    p = !h && vh(a),
                    d = !h && !p && bh(a);f = a, h || p || d ? ph(s) ? f = s : $s(s) ? f = ki(s) : p ? (l = !1, f = wi(a, !0)) : d ? (l = !1, f = Ai(a, !0)) : f = [] : ca(a) || hh(a) ? (f = s, hh(s) ? f = wa(s) : (!ta(s) || r && Ks(s)) && (f = To(a))) : l = !1;
              }l && (u.set(a, f), i(f, a, r, o, u), u.delete(a)), Bn(t, n, f);
            }function Hr(t, e) {
              var n = t.length;if (n) return e += e < 0 ? n : 0, Po(e, n) ? t[e] : rt;
            }function $r(t, e, n) {
              var r = -1;return e = d(e.length ? e : [Cc], R(go())), D(Fr(t, function (t, n, i) {
                return { criteria: d(e, function (e) {
                    return e(t);
                  }), index: ++r, value: t };
              }), function (t, e) {
                return Di(t, e, n);
              });
            }function Br(t, e) {
              return Wr(t, e, function (e, n) {
                return Na(t, n);
              });
            }function Wr(t, e, n) {
              for (var r = -1, i = e.length, o = {}; ++r < i;) {
                var u = e[r],
                    s = hr(t, u);n(s, u) && ei(o, mi(u, t), s);
              }return o;
            }function Gr(t) {
              return function (e) {
                return hr(e, t);
              };
            }function Zr(t, e, n, r) {
              var i = r ? j : x,
                  o = -1,
                  u = e.length,
                  s = t;for (t === e && (e = ki(e)), n && (s = d(t, R(n))); ++o < u;) for (var a = 0, c = e[o], f = n ? n(c) : c; (a = i(s, f, a, r)) > -1;) s !== t && Tf.call(s, a, 1), Tf.call(t, a, 1);return t;
            }function Vr(t, e) {
              for (var n = t ? e.length : 0, r = n - 1; n--;) {
                var i = e[n];if (n == r || i !== o) {
                  var o = i;Po(i) ? Tf.call(t, i, 1) : li(t, i);
                }
              }return t;
            }function Jr(t, e) {
              return t + Uf(Gf() * (e - t + 1));
            }function Xr(t, e, n, r) {
              for (var i = -1, o = Hf(Nf((e - t) / (n || 1)), 0), u = Yc(o); o--;) u[r ? o : ++i] = t, t += n;return u;
            }function Kr(t, e) {
              var n = "";if (!t || e < 1 || e > It) return n;do {
                e % 2 && (n += t), (e = Uf(e / 2)) && (t += t);
              } while (e);return n;
            }function Yr(t, e) {
              return Tl($o(t, e, Cc), t + "");
            }function Qr(t) {
              return Pn(Ja(t));
            }function ti(t, e) {
              var n = Ja(t);return Vo(n, Yn(e, 0, n.length));
            }function ei(t, e, n, r) {
              if (!ta(t)) return t;e = mi(e, t);for (var i = -1, o = e.length, u = o - 1, s = t; null != s && ++i < o;) {
                var a = Jo(e[i]),
                    c = n;if (i != u) {
                  var f = s[a];c = r ? r(f, a, s) : rt, c === rt && (c = ta(f) ? f : Po(e[i + 1]) ? [] : {});
                }Wn(s, a, c), s = s[a];
              }return t;
            }function ni(t) {
              return Vo(Ja(t));
            }function ri(t, e, n) {
              var r = -1,
                  i = t.length;e < 0 && (e = -e > i ? 0 : i + e), n = n > i ? i : n, n < 0 && (n += i), i = e > n ? 0 : n - e >>> 0, e >>>= 0;for (var o = Yc(i); ++r < i;) o[r] = t[r + e];return o;
            }function ii(t, e) {
              var n;return ll(t, function (t, r, i) {
                return !(n = e(t, r, i));
              }), !!n;
            }function oi(t, e, n) {
              var r = 0,
                  i = null == t ? r : t.length;if ("number" == typeof e && e === e && i <= Ft) {
                for (; r < i;) {
                  var o = r + i >>> 1,
                      u = t[o];null !== u && !ha(u) && (n ? u <= e : u < e) ? r = o + 1 : i = o;
                }return i;
              }return ui(t, e, Cc, n);
            }function ui(t, e, n, r) {
              e = n(e);for (var i = 0, o = null == t ? 0 : t.length, u = e !== e, s = null === e, a = ha(e), c = e === rt; i < o;) {
                var f = Uf((i + o) / 2),
                    l = n(t[f]),
                    h = l !== rt,
                    p = null === l,
                    d = l === l,
                    v = ha(l);if (u) var _ = r || d;else _ = c ? d && (r || h) : s ? d && h && (r || !p) : a ? d && h && !p && (r || !v) : !p && !v && (r ? l <= e : l < e);_ ? i = f + 1 : o = f;
              }return $f(o, Ut);
            }function si(t, e) {
              for (var n = -1, r = t.length, i = 0, o = []; ++n < r;) {
                var u = t[n],
                    s = e ? e(u) : u;if (!n || !Ms(s, a)) {
                  var a = s;o[i++] = 0 === u ? 0 : u;
                }
              }return o;
            }function ai(t) {
              return "number" == typeof t ? t : ha(t) ? Rt : +t;
            }function ci(t) {
              if ("string" == typeof t) return t;if (ph(t)) return d(t, ci) + "";if (ha(t)) return cl ? cl.call(t) : "";var e = t + "";return "0" == e && 1 / t == -Pt ? "-0" : e;
            }function fi(t, e, n) {
              var r = -1,
                  i = h,
                  o = t.length,
                  u = !0,
                  s = [],
                  a = s;if (n) u = !1, i = p;else if (o >= it) {
                var c = e ? null : ml(t);if (c) return V(c);u = !1, i = U, a = new pn();
              } else a = e ? [] : s;t: for (; ++r < o;) {
                var f = t[r],
                    l = e ? e(f) : f;if (f = n || 0 !== f ? f : 0, u && l === l) {
                  for (var d = a.length; d--;) if (a[d] === l) continue t;e && a.push(l), s.push(f);
                } else i(a, l, n) || (a !== s && a.push(l), s.push(f));
              }return s;
            }function li(t, e) {
              return e = mi(e, t), null == (t = Bo(t, e)) || delete t[Jo(yu(e))];
            }function hi(t, e, n, r) {
              return ei(t, e, n(hr(t, e)), r);
            }function pi(t, e, n, r) {
              for (var i = t.length, o = r ? i : -1; (r ? o-- : ++o < i) && e(t[o], o, t););return n ? ri(t, r ? 0 : o, r ? o + 1 : i) : ri(t, r ? o + 1 : 0, r ? i : o);
            }function di(t, e) {
              var n = t;return n instanceof A && (n = n.value()), _(e, function (t, e) {
                return e.func.apply(e.thisArg, v([t], e.args));
              }, n);
            }function vi(t, e, n) {
              var r = t.length;if (r < 2) return r ? fi(t[0]) : [];for (var i = -1, o = Yc(r); ++i < r;) for (var u = t[i], s = -1; ++s < r;) s != i && (o[i] = rr(o[i] || u, t[s], e, n));return fi(ar(o, 1), e, n);
            }function _i(t, e, n) {
              for (var r = -1, i = t.length, o = e.length, u = {}; ++r < i;) {
                var s = r < o ? e[r] : rt;n(u, t[r], s);
              }return u;
            }function yi(t) {
              return $s(t) ? t : [];
            }function gi(t) {
              return "function" == typeof t ? t : Cc;
            }function mi(t, e) {
              return ph(t) ? t : ko(t, e) ? [t] : Al(xa(t));
            }function bi(t, e, n) {
              var r = t.length;return n = n === rt ? r : n, !e && n >= r ? t : ri(t, e, n);
            }function wi(t, e) {
              if (e) return t.slice();var n = t.length,
                  r = xf ? xf(n) : new t.constructor(n);return t.copy(r), r;
            }function Ei(t) {
              var e = new t.constructor(t.byteLength);return new Ef(e).set(new Ef(t)), e;
            }function xi(t, e) {
              var n = e ? Ei(t.buffer) : t.buffer;return new t.constructor(n, t.byteOffset, t.byteLength);
            }function ji(t, e, n) {
              return _(e ? n(W(t), ft) : W(t), i, new t.constructor());
            }function Oi(t) {
              var e = new t.constructor(t.source, Le.exec(t));return e.lastIndex = t.lastIndex, e;
            }function Ci(t, e, n) {
              return _(e ? n(V(t), ft) : V(t), o, new t.constructor());
            }function Ti(t) {
              return al ? rf(al.call(t)) : {};
            }function Ai(t, e) {
              var n = e ? Ei(t.buffer) : t.buffer;return new t.constructor(n, t.byteOffset, t.length);
            }function Si(t, e) {
              if (t !== e) {
                var n = t !== rt,
                    r = null === t,
                    i = t === t,
                    o = ha(t),
                    u = e !== rt,
                    s = null === e,
                    a = e === e,
                    c = ha(e);if (!s && !c && !o && t > e || o && u && a && !s && !c || r && u && a || !n && a || !i) return 1;if (!r && !o && !c && t < e || c && n && i && !r && !o || s && n && i || !u && i || !a) return -1;
              }return 0;
            }function Di(t, e, n) {
              for (var r = -1, i = t.criteria, o = e.criteria, u = i.length, s = n.length; ++r < u;) {
                var a = Si(i[r], o[r]);if (a) {
                  if (r >= s) return a;return a * ("desc" == n[r] ? -1 : 1);
                }
              }return t.index - e.index;
            }function Pi(t, e, n, r) {
              for (var i = -1, o = t.length, u = n.length, s = -1, a = e.length, c = Hf(o - u, 0), f = Yc(a + c), l = !r; ++s < a;) f[s] = e[s];for (; ++i < u;) (l || i < o) && (f[n[i]] = t[i]);for (; c--;) f[s++] = t[i++];return f;
            }function Ii(t, e, n, r) {
              for (var i = -1, o = t.length, u = -1, s = n.length, a = -1, c = e.length, f = Hf(o - s, 0), l = Yc(f + c), h = !r; ++i < f;) l[i] = t[i];for (var p = i; ++a < c;) l[p + a] = e[a];for (; ++u < s;) (h || i < o) && (l[p + n[u]] = t[i++]);return l;
            }function ki(t, e) {
              var n = -1,
                  r = t.length;for (e || (e = Yc(r)); ++n < r;) e[n] = t[n];return e;
            }function Ri(t, e, n, r) {
              var i = !n;n || (n = {});for (var o = -1, u = e.length; ++o < u;) {
                var s = e[o],
                    a = r ? r(n[s], t[s], s, n, t) : rt;a === rt && (a = t[s]), i ? Xn(n, s, a) : Wn(n, s, a);
              }return n;
            }function Ni(t, e) {
              return Ri(t, wl(t), e);
            }function Ui(t, e) {
              return Ri(t, El(t), e);
            }function Fi(t, e) {
              return function (n, r) {
                var i = ph(n) ? s : Zn,
                    o = e ? e() : {};return i(n, t, go(r, 2), o);
              };
            }function Li(t) {
              return Yr(function (e, n) {
                var r = -1,
                    i = n.length,
                    o = i > 1 ? n[i - 1] : rt,
                    u = i > 2 ? n[2] : rt;for (o = t.length > 3 && "function" == typeof o ? (i--, o) : rt, u && Io(n[0], n[1], u) && (o = i < 3 ? rt : o, i = 1), e = rf(e); ++r < i;) {
                  var s = n[r];s && t(e, s, r, o);
                }return e;
              });
            }function qi(t, e) {
              return function (n, r) {
                if (null == n) return n;if (!Hs(n)) return t(n, r);for (var i = n.length, o = e ? i : -1, u = rf(n); (e ? o-- : ++o < i) && !1 !== r(u[o], o, u););return n;
              };
            }function zi(t) {
              return function (e, n, r) {
                for (var i = -1, o = rf(e), u = r(e), s = u.length; s--;) {
                  var a = u[t ? s : ++i];if (!1 === n(o[a], a, o)) break;
                }return e;
              };
            }function Mi(t, e, n) {
              function r() {
                return (this && this !== Cn && this instanceof r ? o : t).apply(i ? n : this, arguments);
              }var i = e & vt,
                  o = Bi(t);return r;
            }function Hi(t) {
              return function (e) {
                e = xa(e);var n = H(e) ? Q(e) : rt,
                    r = n ? n[0] : e.charAt(0),
                    i = n ? bi(n, 1).join("") : e.slice(1);return r[t]() + i;
              };
            }function $i(t) {
              return function (e) {
                return _(wc(ec(e).replace(an, "")), t, "");
              };
            }function Bi(t) {
              return function () {
                var e = arguments;switch (e.length) {case 0:
                    return new t();case 1:
                    return new t(e[0]);case 2:
                    return new t(e[0], e[1]);case 3:
                    return new t(e[0], e[1], e[2]);case 4:
                    return new t(e[0], e[1], e[2], e[3]);case 5:
                    return new t(e[0], e[1], e[2], e[3], e[4]);case 6:
                    return new t(e[0], e[1], e[2], e[3], e[4], e[5]);case 7:
                    return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);}var n = fl(t.prototype),
                    r = t.apply(n, e);return ta(r) ? r : n;
              };
            }function Wi(t, e, n) {
              function r() {
                for (var o = arguments.length, s = Yc(o), a = o, c = yo(r); a--;) s[a] = arguments[a];var f = o < 3 && s[0] !== c && s[o - 1] !== c ? [] : Z(s, c);return (o -= f.length) < n ? no(t, e, Vi, r.placeholder, rt, s, f, rt, rt, n - o) : u(this && this !== Cn && this instanceof r ? i : t, this, s);
              }var i = Bi(t);return r;
            }function Gi(t) {
              return function (e, n, r) {
                var i = rf(e);if (!Hs(e)) {
                  var o = go(n, 3);e = Ua(e), n = function (t) {
                    return o(i[t], t, i);
                  };
                }var u = t(e, n, r);return u > -1 ? i[o ? e[u] : u] : rt;
              };
            }function Zi(t) {
              return ho(function (e) {
                var n = e.length,
                    r = n,
                    i = m.prototype.thru;for (t && e.reverse(); r--;) {
                  var o = e[r];if ("function" != typeof o) throw new sf(ut);if (i && !u && "wrapper" == _o(o)) var u = new m([], !0);
                }for (r = u ? r : n; ++r < n;) {
                  o = e[r];var s = _o(o),
                      a = "wrapper" == s ? bl(o) : rt;u = a && No(a[0]) && a[1] == (Et | gt | bt | xt) && !a[4].length && 1 == a[9] ? u[_o(a[0])].apply(u, a[3]) : 1 == o.length && No(o) ? u[s]() : u.thru(o);
                }return function () {
                  var t = arguments,
                      r = t[0];if (u && 1 == t.length && ph(r)) return u.plant(r).value();for (var i = 0, o = n ? e[i].apply(this, t) : r; ++i < n;) o = e[i].call(this, o);return o;
                };
              });
            }function Vi(t, e, n, r, i, o, u, s, a, c) {
              function f() {
                for (var y = arguments.length, g = Yc(y), m = y; m--;) g[m] = arguments[m];if (d) var b = yo(f),
                    w = q(g, b);if (r && (g = Pi(g, r, i, d)), o && (g = Ii(g, o, u, d)), y -= w, d && y < c) {
                  var E = Z(g, b);return no(t, e, Vi, f.placeholder, n, g, E, s, a, c - y);
                }var x = h ? n : this,
                    j = p ? x[t] : t;return y = g.length, s ? g = Wo(g, s) : v && y > 1 && g.reverse(), l && a < y && (g.length = a), this && this !== Cn && this instanceof f && (j = _ || Bi(j)), j.apply(x, g);
              }var l = e & Et,
                  h = e & vt,
                  p = e & _t,
                  d = e & (gt | mt),
                  v = e & jt,
                  _ = p ? rt : Bi(t);return f;
            }function Ji(t, e) {
              return function (n, r) {
                return br(n, t, e(r), {});
              };
            }function Xi(t, e) {
              return function (n, r) {
                var i;if (n === rt && r === rt) return e;if (n !== rt && (i = n), r !== rt) {
                  if (i === rt) return r;"string" == typeof n || "string" == typeof r ? (n = ci(n), r = ci(r)) : (n = ai(n), r = ai(r)), i = t(n, r);
                }return i;
              };
            }function Ki(t) {
              return ho(function (e) {
                return e = d(e, R(go())), Yr(function (n) {
                  var r = this;return t(e, function (t) {
                    return u(t, r, n);
                  });
                });
              });
            }function Yi(t, e) {
              e = e === rt ? " " : ci(e);var n = e.length;if (n < 2) return n ? Kr(e, t) : e;var r = Kr(e, Nf(t / Y(e)));return H(e) ? bi(Q(r), 0, t).join("") : r.slice(0, t);
            }function Qi(t, e, n, r) {
              function i() {
                for (var e = -1, a = arguments.length, c = -1, f = r.length, l = Yc(f + a), h = this && this !== Cn && this instanceof i ? s : t; ++c < f;) l[c] = r[c];for (; a--;) l[c++] = arguments[++e];return u(h, o ? n : this, l);
              }var o = e & vt,
                  s = Bi(t);return i;
            }function to(t) {
              return function (e, n, r) {
                return r && "number" != typeof r && Io(e, n, r) && (n = r = rt), e = ya(e), n === rt ? (n = e, e = 0) : n = ya(n), r = r === rt ? e < n ? 1 : -1 : ya(r), Xr(e, n, r, t);
              };
            }function eo(t) {
              return function (e, n) {
                return "string" == typeof e && "string" == typeof n || (e = ba(e), n = ba(n)), t(e, n);
              };
            }function no(t, e, n, r, i, o, u, s, a, c) {
              var f = e & gt,
                  l = f ? u : rt,
                  h = f ? rt : u,
                  p = f ? o : rt,
                  d = f ? rt : o;e |= f ? bt : wt, (e &= ~(f ? wt : bt)) & yt || (e &= ~(vt | _t));var v = [t, e, i, p, l, d, h, s, a, c],
                  _ = n.apply(rt, v);return No(t) && Ol(_, v), _.placeholder = r, Go(_, t, e);
            }function ro(t) {
              var e = nf[t];return function (t, n) {
                if (t = ba(t), n = null == n ? 0 : $f(ga(n), 292)) {
                  var r = (xa(t) + "e").split("e");return r = (xa(e(r[0] + "e" + (+r[1] + n))) + "e").split("e"), +(r[0] + "e" + (+r[1] - n));
                }return e(t);
              };
            }function io(t) {
              return function (e) {
                var n = xl(e);return n == Vt ? W(e) : n == te ? J(e) : k(e, t(e));
              };
            }function oo(t, e, n, r, i, o, u, s) {
              var a = e & _t;if (!a && "function" != typeof t) throw new sf(ut);var c = r ? r.length : 0;if (c || (e &= ~(bt | wt), r = i = rt), u = u === rt ? u : Hf(ga(u), 0), s = s === rt ? s : ga(s), c -= i ? i.length : 0, e & wt) {
                var f = r,
                    l = i;r = i = rt;
              }var h = a ? rt : bl(t),
                  p = [t, e, n, r, i, f, l, o, u, s];if (h && zo(p, h), t = p[0], e = p[1], n = p[2], r = p[3], i = p[4], s = p[9] = p[9] === rt ? a ? 0 : t.length : Hf(p[9] - c, 0), !s && e & (gt | mt) && (e &= ~(gt | mt)), e && e != vt) d = e == gt || e == mt ? Wi(t, e, s) : e != bt && e != (vt | bt) || i.length ? Vi.apply(rt, p) : Qi(t, e, n, r);else var d = Mi(t, e, n);return Go((h ? vl : Ol)(d, p), t, e);
            }function uo(t, e, n, r) {
              return t === rt || Ms(t, ff[n]) && !pf.call(r, n) ? e : t;
            }function so(t, e, n, r, i, o) {
              return ta(t) && ta(e) && (o.set(e, t), zr(t, e, rt, so, o), o.delete(e)), t;
            }function ao(t) {
              return ca(t) ? rt : t;
            }function co(t, e, n, r, i, o) {
              var u = n & pt,
                  s = t.length,
                  a = e.length;if (s != a && !(u && a > s)) return !1;var c = o.get(t);if (c && o.get(e)) return c == e;var f = -1,
                  l = !0,
                  h = n & dt ? new pn() : rt;for (o.set(t, e), o.set(e, t); ++f < s;) {
                var p = t[f],
                    d = e[f];if (r) var v = u ? r(d, p, f, e, t, o) : r(p, d, f, t, e, o);if (v !== rt) {
                  if (v) continue;l = !1;break;
                }if (h) {
                  if (!g(e, function (t, e) {
                    if (!U(h, e) && (p === t || i(p, t, n, r, o))) return h.push(e);
                  })) {
                    l = !1;break;
                  }
                } else if (p !== d && !i(p, d, n, r, o)) {
                  l = !1;break;
                }
              }return o.delete(t), o.delete(e), l;
            }function fo(t, e, n, r, i, o, u) {
              switch (n) {case se:
                  if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;t = t.buffer, e = e.buffer;case ue:
                  return !(t.byteLength != e.byteLength || !o(new Ef(t), new Ef(e)));case Ht:case $t:case Jt:
                  return Ms(+t, +e);case Wt:
                  return t.name == e.name && t.message == e.message;case Qt:case ee:
                  return t == e + "";case Vt:
                  var s = W;case te:
                  var a = r & pt;if (s || (s = V), t.size != e.size && !a) return !1;var c = u.get(t);if (c) return c == e;r |= dt, u.set(t, e);var f = co(s(t), s(e), r, i, o, u);return u.delete(t), f;case ne:
                  if (al) return al.call(t) == al.call(e);}return !1;
            }function lo(t, e, n, r, i, o) {
              var u = n & pt,
                  s = po(t),
                  a = s.length;if (a != po(e).length && !u) return !1;for (var c = a; c--;) {
                var f = s[c];if (!(u ? f in e : pf.call(e, f))) return !1;
              }var l = o.get(t);if (l && o.get(e)) return l == e;var h = !0;o.set(t, e), o.set(e, t);for (var p = u; ++c < a;) {
                f = s[c];var d = t[f],
                    v = e[f];if (r) var _ = u ? r(v, d, f, e, t, o) : r(d, v, f, t, e, o);if (!(_ === rt ? d === v || i(d, v, n, r, o) : _)) {
                  h = !1;break;
                }p || (p = "constructor" == f);
              }if (h && !p) {
                var y = t.constructor,
                    g = e.constructor;y != g && "constructor" in t && "constructor" in e && !("function" == typeof y && y instanceof y && "function" == typeof g && g instanceof g) && (h = !1);
              }return o.delete(t), o.delete(e), h;
            }function ho(t) {
              return Tl($o(t, rt, cu), t + "");
            }function po(t) {
              return pr(t, Ua, wl);
            }function vo(t) {
              return pr(t, Fa, El);
            }function _o(t) {
              for (var e = t.name + "", n = el[e], r = pf.call(el, e) ? n.length : 0; r--;) {
                var i = n[r],
                    o = i.func;if (null == o || o == t) return i.name;
              }return e;
            }function yo(t) {
              return (pf.call(n, "placeholder") ? n : t).placeholder;
            }function go() {
              var t = n.iteratee || Tc;return t = t === Tc ? kr : t, arguments.length ? t(arguments[0], arguments[1]) : t;
            }function mo(t, e) {
              var n = t.__data__;return Ro(e) ? n["string" == typeof e ? "string" : "hash"] : n.map;
            }function bo(t) {
              for (var e = Ua(t), n = e.length; n--;) {
                var r = e[n],
                    i = t[r];e[n] = [r, i, Lo(i)];
              }return e;
            }function wo(t, e) {
              var n = M(t, e);return Sr(n) ? n : rt;
            }function Eo(t) {
              var e = pf.call(t, Df),
                  n = t[Df];try {
                t[Df] = rt;
              } catch (t) {}var r = _f.call(t);return e ? t[Df] = n : delete t[Df], r;
            }function xo(t, e, n) {
              for (var r = -1, i = n.length; ++r < i;) {
                var o = n[r],
                    u = o.size;switch (o.type) {case "drop":
                    t += u;break;case "dropRight":
                    e -= u;break;case "take":
                    e = $f(e, t + u);break;case "takeRight":
                    t = Hf(t, e - u);}
              }return { start: t, end: e };
            }function jo(t) {
              var e = t.match(Re);return e ? e[1].split(Ne) : [];
            }function Oo(t, e, n) {
              e = mi(e, t);for (var r = -1, i = e.length, o = !1; ++r < i;) {
                var u = Jo(e[r]);if (!(o = null != t && n(t, u))) break;t = t[u];
              }return o || ++r != i ? o : !!(i = null == t ? 0 : t.length) && Qs(i) && Po(u, i) && (ph(t) || hh(t));
            }function Co(t) {
              var e = t.length,
                  n = t.constructor(e);return e && "string" == typeof t[0] && pf.call(t, "index") && (n.index = t.index, n.input = t.input), n;
            }function To(t) {
              return "function" != typeof t.constructor || Fo(t) ? {} : fl(jf(t));
            }function Ao(t, e, n, r) {
              var i = t.constructor;switch (e) {case ue:
                  return Ei(t);case Ht:case $t:
                  return new i(+t);case se:
                  return xi(t, r);case ae:case ce:case fe:case le:case he:case pe:case de:case ve:case _e:
                  return Ai(t, r);case Vt:
                  return ji(t, r, n);case Jt:case ee:
                  return new i(t);case Qt:
                  return Oi(t);case te:
                  return Ci(t, r, n);case ne:
                  return Ti(t);}
            }function So(t, e) {
              var n = e.length;if (!n) return t;var r = n - 1;return e[r] = (n > 1 ? "& " : "") + e[r], e = e.join(n > 2 ? ", " : " "), t.replace(ke, "{\n/* [wrapped with " + e + "] */\n");
            }function Do(t) {
              return ph(t) || hh(t) || !!(Af && t && t[Af]);
            }function Po(t, e) {
              return !!(e = null == e ? It : e) && ("number" == typeof t || $e.test(t)) && t > -1 && t % 1 == 0 && t < e;
            }function Io(t, e, n) {
              if (!ta(n)) return !1;var r = typeof e;return !!("number" == r ? Hs(n) && Po(e, n.length) : "string" == r && e in n) && Ms(n[e], t);
            }function ko(t, e) {
              if (ph(t)) return !1;var n = typeof t;return !("number" != n && "symbol" != n && "boolean" != n && null != t && !ha(t)) || Ce.test(t) || !Oe.test(t) || null != e && t in rf(e);
            }function Ro(t) {
              var e = typeof t;return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t;
            }function No(t) {
              var e = _o(t),
                  r = n[e];if ("function" != typeof r || !(e in A.prototype)) return !1;if (t === r) return !0;var i = bl(r);return !!i && t === i[0];
            }function Uo(t) {
              return !!vf && vf in t;
            }function Fo(t) {
              var e = t && t.constructor;return t === ("function" == typeof e && e.prototype || ff);
            }function Lo(t) {
              return t === t && !ta(t);
            }function qo(t, e) {
              return function (n) {
                return null != n && n[t] === e && (e !== rt || t in rf(n));
              };
            }function zo(t, e) {
              var n = t[1],
                  r = e[1],
                  i = n | r,
                  o = i < (vt | _t | Et),
                  u = r == Et && n == gt || r == Et && n == xt && t[7].length <= e[8] || r == (Et | xt) && e[7].length <= e[8] && n == gt;if (!o && !u) return t;r & vt && (t[2] = e[2], i |= n & vt ? 0 : yt);var s = e[3];if (s) {
                var a = t[3];t[3] = a ? Pi(a, s, e[4]) : s, t[4] = a ? Z(t[3], ct) : e[4];
              }return s = e[5], s && (a = t[5], t[5] = a ? Ii(a, s, e[6]) : s, t[6] = a ? Z(t[5], ct) : e[6]), s = e[7], s && (t[7] = s), r & Et && (t[8] = null == t[8] ? e[8] : $f(t[8], e[8])), null == t[9] && (t[9] = e[9]), t[0] = e[0], t[1] = i, t;
            }function Mo(t) {
              var e = [];if (null != t) for (var n in rf(t)) e.push(n);return e;
            }function Ho(t) {
              return _f.call(t);
            }function $o(t, e, n) {
              return e = Hf(e === rt ? t.length - 1 : e, 0), function () {
                for (var r = arguments, i = -1, o = Hf(r.length - e, 0), s = Yc(o); ++i < o;) s[i] = r[e + i];i = -1;for (var a = Yc(e + 1); ++i < e;) a[i] = r[i];return a[e] = n(s), u(t, this, a);
              };
            }function Bo(t, e) {
              return e.length < 2 ? t : hr(t, ri(e, 0, -1));
            }function Wo(t, e) {
              for (var n = t.length, r = $f(e.length, n), i = ki(t); r--;) {
                var o = e[r];t[r] = Po(o, n) ? i[o] : rt;
              }return t;
            }function Go(t, e, n) {
              var r = e + "";return Tl(t, So(r, Ko(jo(r), n)));
            }function Zo(t) {
              var e = 0,
                  n = 0;return function () {
                var r = Bf(),
                    i = At - (r - n);if (n = r, i > 0) {
                  if (++e >= Tt) return arguments[0];
                } else e = 0;return t.apply(rt, arguments);
              };
            }function Vo(t, e) {
              var n = -1,
                  r = t.length,
                  i = r - 1;for (e = e === rt ? r : e; ++n < e;) {
                var o = Jr(n, i),
                    u = t[o];t[o] = t[n], t[n] = u;
              }return t.length = e, t;
            }function Jo(t) {
              if ("string" == typeof t || ha(t)) return t;var e = t + "";return "0" == e && 1 / t == -Pt ? "-0" : e;
            }function Xo(t) {
              if (null != t) {
                try {
                  return hf.call(t);
                } catch (t) {}try {
                  return t + "";
                } catch (t) {}
              }return "";
            }function Ko(t, e) {
              return a(Lt, function (n) {
                var r = "_." + n[0];e & n[1] && !h(t, r) && t.push(r);
              }), t.sort();
            }function Yo(t) {
              if (t instanceof A) return t.clone();var e = new m(t.__wrapped__, t.__chain__);return e.__actions__ = ki(t.__actions__), e.__index__ = t.__index__, e.__values__ = t.__values__, e;
            }function Qo(t, e, n) {
              e = (n ? Io(t, e, n) : e === rt) ? 1 : Hf(ga(e), 0);var r = null == t ? 0 : t.length;if (!r || e < 1) return [];for (var i = 0, o = 0, u = Yc(Nf(r / e)); i < r;) u[o++] = ri(t, i, i += e);return u;
            }function tu(t) {
              for (var e = -1, n = null == t ? 0 : t.length, r = 0, i = []; ++e < n;) {
                var o = t[e];o && (i[r++] = o);
              }return i;
            }function eu() {
              var t = arguments.length;if (!t) return [];for (var e = Yc(t - 1), n = arguments[0], r = t; r--;) e[r - 1] = arguments[r];return v(ph(n) ? ki(n) : [n], ar(e, 1));
            }function nu(t, e, n) {
              var r = null == t ? 0 : t.length;return r ? (e = n || e === rt ? 1 : ga(e), ri(t, e < 0 ? 0 : e, r)) : [];
            }function ru(t, e, n) {
              var r = null == t ? 0 : t.length;return r ? (e = n || e === rt ? 1 : ga(e), e = r - e, ri(t, 0, e < 0 ? 0 : e)) : [];
            }function iu(t, e) {
              return t && t.length ? pi(t, go(e, 3), !0, !0) : [];
            }function ou(t, e) {
              return t && t.length ? pi(t, go(e, 3), !0) : [];
            }function uu(t, e, n, r) {
              var i = null == t ? 0 : t.length;return i ? (n && "number" != typeof n && Io(t, e, n) && (n = 0, r = i), ur(t, e, n, r)) : [];
            }function su(t, e, n) {
              var r = null == t ? 0 : t.length;if (!r) return -1;var i = null == n ? 0 : ga(n);return i < 0 && (i = Hf(r + i, 0)), E(t, go(e, 3), i);
            }function au(t, e, n) {
              var r = null == t ? 0 : t.length;if (!r) return -1;var i = r - 1;return n !== rt && (i = ga(n), i = n < 0 ? Hf(r + i, 0) : $f(i, r - 1)), E(t, go(e, 3), i, !0);
            }function cu(t) {
              return (null == t ? 0 : t.length) ? ar(t, 1) : [];
            }function fu(t) {
              return (null == t ? 0 : t.length) ? ar(t, Pt) : [];
            }function lu(t, e) {
              return (null == t ? 0 : t.length) ? (e = e === rt ? 1 : ga(e), ar(t, e)) : [];
            }function hu(t) {
              for (var e = -1, n = null == t ? 0 : t.length, r = {}; ++e < n;) {
                var i = t[e];r[i[0]] = i[1];
              }return r;
            }function pu(t) {
              return t && t.length ? t[0] : rt;
            }function du(t, e, n) {
              var r = null == t ? 0 : t.length;if (!r) return -1;var i = null == n ? 0 : ga(n);return i < 0 && (i = Hf(r + i, 0)), x(t, e, i);
            }function vu(t) {
              return (null == t ? 0 : t.length) ? ri(t, 0, -1) : [];
            }function _u(t, e) {
              return null == t ? "" : zf.call(t, e);
            }function yu(t) {
              var e = null == t ? 0 : t.length;return e ? t[e - 1] : rt;
            }function gu(t, e, n) {
              var r = null == t ? 0 : t.length;if (!r) return -1;var i = r;return n !== rt && (i = ga(n), i = i < 0 ? Hf(r + i, 0) : $f(i, r - 1)), e === e ? K(t, e, i) : E(t, O, i, !0);
            }function mu(t, e) {
              return t && t.length ? Hr(t, ga(e)) : rt;
            }function bu(t, e) {
              return t && t.length && e && e.length ? Zr(t, e) : t;
            }function wu(t, e, n) {
              return t && t.length && e && e.length ? Zr(t, e, go(n, 2)) : t;
            }function Eu(t, e, n) {
              return t && t.length && e && e.length ? Zr(t, e, rt, n) : t;
            }function xu(t, e) {
              var n = [];if (!t || !t.length) return n;var r = -1,
                  i = [],
                  o = t.length;for (e = go(e, 3); ++r < o;) {
                var u = t[r];e(u, r, t) && (n.push(u), i.push(r));
              }return Vr(t, i), n;
            }function ju(t) {
              return null == t ? t : Zf.call(t);
            }function Ou(t, e, n) {
              var r = null == t ? 0 : t.length;return r ? (n && "number" != typeof n && Io(t, e, n) ? (e = 0, n = r) : (e = null == e ? 0 : ga(e), n = n === rt ? r : ga(n)), ri(t, e, n)) : [];
            }function Cu(t, e) {
              return oi(t, e);
            }function Tu(t, e, n) {
              return ui(t, e, go(n, 2));
            }function Au(t, e) {
              var n = null == t ? 0 : t.length;if (n) {
                var r = oi(t, e);if (r < n && Ms(t[r], e)) return r;
              }return -1;
            }function Su(t, e) {
              return oi(t, e, !0);
            }function Du(t, e, n) {
              return ui(t, e, go(n, 2), !0);
            }function Pu(t, e) {
              if (null == t ? 0 : t.length) {
                var n = oi(t, e, !0) - 1;if (Ms(t[n], e)) return n;
              }return -1;
            }function Iu(t) {
              return t && t.length ? si(t) : [];
            }function ku(t, e) {
              return t && t.length ? si(t, go(e, 2)) : [];
            }function Ru(t) {
              var e = null == t ? 0 : t.length;return e ? ri(t, 1, e) : [];
            }function Nu(t, e, n) {
              return t && t.length ? (e = n || e === rt ? 1 : ga(e), ri(t, 0, e < 0 ? 0 : e)) : [];
            }function Uu(t, e, n) {
              var r = null == t ? 0 : t.length;return r ? (e = n || e === rt ? 1 : ga(e), e = r - e, ri(t, e < 0 ? 0 : e, r)) : [];
            }function Fu(t, e) {
              return t && t.length ? pi(t, go(e, 3), !1, !0) : [];
            }function Lu(t, e) {
              return t && t.length ? pi(t, go(e, 3)) : [];
            }function qu(t) {
              return t && t.length ? fi(t) : [];
            }function zu(t, e) {
              return t && t.length ? fi(t, go(e, 2)) : [];
            }function Mu(t, e) {
              return e = "function" == typeof e ? e : rt, t && t.length ? fi(t, rt, e) : [];
            }function Hu(t) {
              if (!t || !t.length) return [];var e = 0;return t = l(t, function (t) {
                if ($s(t)) return e = Hf(t.length, e), !0;
              }), I(e, function (e) {
                return d(t, T(e));
              });
            }function $u(t, e) {
              if (!t || !t.length) return [];var n = Hu(t);return null == e ? n : d(n, function (t) {
                return u(e, rt, t);
              });
            }function Bu(t, e) {
              return _i(t || [], e || [], Wn);
            }function Wu(t, e) {
              return _i(t || [], e || [], ei);
            }function Gu(t) {
              var e = n(t);return e.__chain__ = !0, e;
            }function Zu(t, e) {
              return e(t), t;
            }function Vu(t, e) {
              return e(t);
            }function Ju() {
              return Gu(this);
            }function Xu() {
              return new m(this.value(), this.__chain__);
            }function Ku() {
              this.__values__ === rt && (this.__values__ = _a(this.value()));var t = this.__index__ >= this.__values__.length;return { done: t, value: t ? rt : this.__values__[this.__index__++] };
            }function Yu() {
              return this;
            }function Qu(t) {
              for (var e, n = this; n instanceof r;) {
                var i = Yo(n);i.__index__ = 0, i.__values__ = rt, e ? o.__wrapped__ = i : e = i;var o = i;n = n.__wrapped__;
              }return o.__wrapped__ = t, e;
            }function ts() {
              var t = this.__wrapped__;if (t instanceof A) {
                var e = t;return this.__actions__.length && (e = new A(this)), e = e.reverse(), e.__actions__.push({ func: Vu, args: [ju], thisArg: rt }), new m(e, this.__chain__);
              }return this.thru(ju);
            }function es() {
              return di(this.__wrapped__, this.__actions__);
            }function ns(t, e, n) {
              var r = ph(t) ? f : ir;return n && Io(t, e, n) && (e = rt), r(t, go(e, 3));
            }function rs(t, e) {
              return (ph(t) ? l : sr)(t, go(e, 3));
            }function is(t, e) {
              return ar(fs(t, e), 1);
            }function os(t, e) {
              return ar(fs(t, e), Pt);
            }function us(t, e, n) {
              return n = n === rt ? 1 : ga(n), ar(fs(t, e), n);
            }function ss(t, e) {
              return (ph(t) ? a : ll)(t, go(e, 3));
            }function as(t, e) {
              return (ph(t) ? c : hl)(t, go(e, 3));
            }function cs(t, e, n, r) {
              t = Hs(t) ? t : Ja(t), n = n && !r ? ga(n) : 0;var i = t.length;return n < 0 && (n = Hf(i + n, 0)), la(t) ? n <= i && t.indexOf(e, n) > -1 : !!i && x(t, e, n) > -1;
            }function fs(t, e) {
              return (ph(t) ? d : Fr)(t, go(e, 3));
            }function ls(t, e, n, r) {
              return null == t ? [] : (ph(e) || (e = null == e ? [] : [e]), n = r ? rt : n, ph(n) || (n = null == n ? [] : [n]), $r(t, e, n));
            }function hs(t, e, n) {
              var r = ph(t) ? _ : S,
                  i = arguments.length < 3;return r(t, go(e, 4), n, i, ll);
            }function ps(t, e, n) {
              var r = ph(t) ? y : S,
                  i = arguments.length < 3;return r(t, go(e, 4), n, i, hl);
            }function ds(t, e) {
              return (ph(t) ? l : sr)(t, As(go(e, 3)));
            }function vs(t) {
              return (ph(t) ? Pn : Qr)(t);
            }function _s(t, e, n) {
              return e = (n ? Io(t, e, n) : e === rt) ? 1 : ga(e), (ph(t) ? Ln : ti)(t, e);
            }function ys(t) {
              return (ph(t) ? $n : ni)(t);
            }function gs(t) {
              if (null == t) return 0;if (Hs(t)) return la(t) ? Y(t) : t.length;var e = xl(t);return e == Vt || e == te ? t.size : Rr(t).length;
            }function ms(t, e, n) {
              var r = ph(t) ? g : ii;return n && Io(t, e, n) && (e = rt), r(t, go(e, 3));
            }function bs(t, e) {
              if ("function" != typeof e) throw new sf(ut);return t = ga(t), function () {
                if (--t < 1) return e.apply(this, arguments);
              };
            }function ws(t, e, n) {
              return e = n ? rt : e, e = t && null == e ? t.length : e, oo(t, Et, rt, rt, rt, rt, e);
            }function Es(t, e) {
              var n;if ("function" != typeof e) throw new sf(ut);return t = ga(t), function () {
                return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = rt), n;
              };
            }function xs(t, e, n) {
              e = n ? rt : e;var r = oo(t, gt, rt, rt, rt, rt, rt, e);return r.placeholder = xs.placeholder, r;
            }function js(t, e, n) {
              e = n ? rt : e;var r = oo(t, mt, rt, rt, rt, rt, rt, e);return r.placeholder = js.placeholder, r;
            }function Os(t, e, n) {
              function r(e) {
                var n = h,
                    r = p;return h = p = rt, g = e, v = t.apply(r, n);
              }function i(t) {
                return g = t, _ = Cl(s, e), m ? r(t) : v;
              }function o(t) {
                var n = t - y,
                    r = t - g,
                    i = e - n;return b ? $f(i, d - r) : i;
              }function u(t) {
                var n = t - y,
                    r = t - g;return y === rt || n >= e || n < 0 || b && r >= d;
              }function s() {
                var t = eh();if (u(t)) return a(t);_ = Cl(s, o(t));
              }function a(t) {
                return _ = rt, w && h ? r(t) : (h = p = rt, v);
              }function c() {
                _ !== rt && gl(_), g = 0, h = y = p = _ = rt;
              }function f() {
                return _ === rt ? v : a(eh());
              }function l() {
                var t = eh(),
                    n = u(t);if (h = arguments, p = this, y = t, n) {
                  if (_ === rt) return i(y);if (b) return _ = Cl(s, e), r(y);
                }return _ === rt && (_ = Cl(s, e)), v;
              }var h,
                  p,
                  d,
                  v,
                  _,
                  y,
                  g = 0,
                  m = !1,
                  b = !1,
                  w = !0;if ("function" != typeof t) throw new sf(ut);return e = ba(e) || 0, ta(n) && (m = !!n.leading, b = "maxWait" in n, d = b ? Hf(ba(n.maxWait) || 0, e) : d, w = "trailing" in n ? !!n.trailing : w), l.cancel = c, l.flush = f, l;
            }function Cs(t) {
              return oo(t, jt);
            }function Ts(t, e) {
              if ("function" != typeof t || null != e && "function" != typeof e) throw new sf(ut);var n = function () {
                var r = arguments,
                    i = e ? e.apply(this, r) : r[0],
                    o = n.cache;if (o.has(i)) return o.get(i);var u = t.apply(this, r);return n.cache = o.set(i, u) || o, u;
              };return n.cache = new (Ts.Cache || on)(), n;
            }function As(t) {
              if ("function" != typeof t) throw new sf(ut);return function () {
                var e = arguments;switch (e.length) {case 0:
                    return !t.call(this);case 1:
                    return !t.call(this, e[0]);case 2:
                    return !t.call(this, e[0], e[1]);case 3:
                    return !t.call(this, e[0], e[1], e[2]);}return !t.apply(this, e);
              };
            }function Ss(t) {
              return Es(2, t);
            }function Ds(t, e) {
              if ("function" != typeof t) throw new sf(ut);return e = e === rt ? e : ga(e), Yr(t, e);
            }function Ps(t, e) {
              if ("function" != typeof t) throw new sf(ut);return e = null == e ? 0 : Hf(ga(e), 0), Yr(function (n) {
                var r = n[e],
                    i = bi(n, 0, e);return r && v(i, r), u(t, this, i);
              });
            }function Is(t, e, n) {
              var r = !0,
                  i = !0;if ("function" != typeof t) throw new sf(ut);return ta(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), Os(t, e, { leading: r, maxWait: e, trailing: i });
            }function ks(t) {
              return ws(t, 1);
            }function Rs(t, e) {
              return sh(gi(e), t);
            }function Ns() {
              if (!arguments.length) return [];var t = arguments[0];return ph(t) ? t : [t];
            }function Us(t) {
              return Qn(t, ht);
            }function Fs(t, e) {
              return e = "function" == typeof e ? e : rt, Qn(t, ht, e);
            }function Ls(t) {
              return Qn(t, ft | ht);
            }function qs(t, e) {
              return e = "function" == typeof e ? e : rt, Qn(t, ft | ht, e);
            }function zs(t, e) {
              return null == e || er(t, e, Ua(e));
            }function Ms(t, e) {
              return t === e || t !== t && e !== e;
            }function Hs(t) {
              return null != t && Qs(t.length) && !Ks(t);
            }function $s(t) {
              return ea(t) && Hs(t);
            }function Bs(t) {
              return !0 === t || !1 === t || ea(t) && dr(t) == Ht;
            }function Ws(t) {
              return ea(t) && 1 === t.nodeType && !ca(t);
            }function Gs(t) {
              if (null == t) return !0;if (Hs(t) && (ph(t) || "string" == typeof t || "function" == typeof t.splice || vh(t) || bh(t) || hh(t))) return !t.length;var e = xl(t);if (e == Vt || e == te) return !t.size;if (Fo(t)) return !Rr(t).length;for (var n in t) if (pf.call(t, n)) return !1;return !0;
            }function Zs(t, e) {
              return Or(t, e);
            }function Vs(t, e, n) {
              n = "function" == typeof n ? n : rt;var r = n ? n(t, e) : rt;return r === rt ? Or(t, e, rt, n) : !!r;
            }function Js(t) {
              if (!ea(t)) return !1;var e = dr(t);return e == Wt || e == Bt || "string" == typeof t.message && "string" == typeof t.name && !ca(t);
            }function Xs(t) {
              return "number" == typeof t && qf(t);
            }function Ks(t) {
              if (!ta(t)) return !1;var e = dr(t);return e == Gt || e == Zt || e == Mt || e == Yt;
            }function Ys(t) {
              return "number" == typeof t && t == ga(t);
            }function Qs(t) {
              return "number" == typeof t && t > -1 && t % 1 == 0 && t <= It;
            }function ta(t) {
              var e = typeof t;return null != t && ("object" == e || "function" == e);
            }function ea(t) {
              return null != t && "object" == typeof t;
            }function na(t, e) {
              return t === e || Ar(t, e, bo(e));
            }function ra(t, e, n) {
              return n = "function" == typeof n ? n : rt, Ar(t, e, bo(e), n);
            }function ia(t) {
              return aa(t) && t != +t;
            }function oa(t) {
              if (jl(t)) throw new tf(ot);return Sr(t);
            }function ua(t) {
              return null === t;
            }function sa(t) {
              return null == t;
            }function aa(t) {
              return "number" == typeof t || ea(t) && dr(t) == Jt;
            }function ca(t) {
              if (!ea(t) || dr(t) != Kt) return !1;var e = jf(t);if (null === e) return !0;var n = pf.call(e, "constructor") && e.constructor;return "function" == typeof n && n instanceof n && hf.call(n) == yf;
            }function fa(t) {
              return Ys(t) && t >= -It && t <= It;
            }function la(t) {
              return "string" == typeof t || !ph(t) && ea(t) && dr(t) == ee;
            }function ha(t) {
              return "symbol" == typeof t || ea(t) && dr(t) == ne;
            }function pa(t) {
              return t === rt;
            }function da(t) {
              return ea(t) && xl(t) == ie;
            }function va(t) {
              return ea(t) && dr(t) == oe;
            }function _a(t) {
              if (!t) return [];if (Hs(t)) return la(t) ? Q(t) : ki(t);if (Sf && t[Sf]) return B(t[Sf]());var e = xl(t);return (e == Vt ? W : e == te ? V : Ja)(t);
            }function ya(t) {
              if (!t) return 0 === t ? t : 0;if ((t = ba(t)) === Pt || t === -Pt) {
                return (t < 0 ? -1 : 1) * kt;
              }return t === t ? t : 0;
            }function ga(t) {
              var e = ya(t),
                  n = e % 1;return e === e ? n ? e - n : e : 0;
            }function ma(t) {
              return t ? Yn(ga(t), 0, Nt) : 0;
            }function ba(t) {
              if ("number" == typeof t) return t;if (ha(t)) return Rt;if (ta(t)) {
                var e = "function" == typeof t.valueOf ? t.valueOf() : t;t = ta(e) ? e + "" : e;
              }if ("string" != typeof t) return 0 === t ? t : +t;t = t.replace(De, "");var n = ze.test(t);return n || He.test(t) ? xn(t.slice(2), n ? 2 : 8) : qe.test(t) ? Rt : +t;
            }function wa(t) {
              return Ri(t, Fa(t));
            }function Ea(t) {
              return t ? Yn(ga(t), -It, It) : 0 === t ? t : 0;
            }function xa(t) {
              return null == t ? "" : ci(t);
            }function ja(t, e) {
              var n = fl(t);return null == e ? n : Vn(n, e);
            }function Oa(t, e) {
              return w(t, go(e, 3), cr);
            }function Ca(t, e) {
              return w(t, go(e, 3), fr);
            }function Ta(t, e) {
              return null == t ? t : pl(t, go(e, 3), Fa);
            }function Aa(t, e) {
              return null == t ? t : dl(t, go(e, 3), Fa);
            }function Sa(t, e) {
              return t && cr(t, go(e, 3));
            }function Da(t, e) {
              return t && fr(t, go(e, 3));
            }function Pa(t) {
              return null == t ? [] : lr(t, Ua(t));
            }function Ia(t) {
              return null == t ? [] : lr(t, Fa(t));
            }function ka(t, e, n) {
              var r = null == t ? rt : hr(t, e);return r === rt ? n : r;
            }function Ra(t, e) {
              return null != t && Oo(t, e, _r);
            }function Na(t, e) {
              return null != t && Oo(t, e, yr);
            }function Ua(t) {
              return Hs(t) ? Dn(t) : Rr(t);
            }function Fa(t) {
              return Hs(t) ? Dn(t, !0) : Nr(t);
            }function La(t, e) {
              var n = {};return e = go(e, 3), cr(t, function (t, r, i) {
                Xn(n, e(t, r, i), t);
              }), n;
            }function qa(t, e) {
              var n = {};return e = go(e, 3), cr(t, function (t, r, i) {
                Xn(n, r, e(t, r, i));
              }), n;
            }function za(t, e) {
              return Ma(t, As(go(e)));
            }function Ma(t, e) {
              if (null == t) return {};var n = d(vo(t), function (t) {
                return [t];
              });return e = go(e), Wr(t, n, function (t, n) {
                return e(t, n[0]);
              });
            }function Ha(t, e, n) {
              e = mi(e, t);var r = -1,
                  i = e.length;for (i || (i = 1, t = rt); ++r < i;) {
                var o = null == t ? rt : t[Jo(e[r])];o === rt && (r = i, o = n), t = Ks(o) ? o.call(t) : o;
              }return t;
            }function $a(t, e, n) {
              return null == t ? t : ei(t, e, n);
            }function Ba(t, e, n, r) {
              return r = "function" == typeof r ? r : rt, null == t ? t : ei(t, e, n, r);
            }function Wa(t, e, n) {
              var r = ph(t),
                  i = r || vh(t) || bh(t);if (e = go(e, 4), null == n) {
                var o = t && t.constructor;n = i ? r ? new o() : [] : ta(t) && Ks(o) ? fl(jf(t)) : {};
              }return (i ? a : cr)(t, function (t, r, i) {
                return e(n, t, r, i);
              }), n;
            }function Ga(t, e) {
              return null == t || li(t, e);
            }function Za(t, e, n) {
              return null == t ? t : hi(t, e, gi(n));
            }function Va(t, e, n, r) {
              return r = "function" == typeof r ? r : rt, null == t ? t : hi(t, e, gi(n), r);
            }function Ja(t) {
              return null == t ? [] : N(t, Ua(t));
            }function Xa(t) {
              return null == t ? [] : N(t, Fa(t));
            }function Ka(t, e, n) {
              return n === rt && (n = e, e = rt), n !== rt && (n = ba(n), n = n === n ? n : 0), e !== rt && (e = ba(e), e = e === e ? e : 0), Yn(ba(t), e, n);
            }function Ya(t, e, n) {
              return e = ya(e), n === rt ? (n = e, e = 0) : n = ya(n), t = ba(t), gr(t, e, n);
            }function Qa(t, e, n) {
              if (n && "boolean" != typeof n && Io(t, e, n) && (e = n = rt), n === rt && ("boolean" == typeof e ? (n = e, e = rt) : "boolean" == typeof t && (n = t, t = rt)), t === rt && e === rt ? (t = 0, e = 1) : (t = ya(t), e === rt ? (e = t, t = 0) : e = ya(e)), t > e) {
                var r = t;t = e, e = r;
              }if (n || t % 1 || e % 1) {
                var i = Gf();return $f(t + i * (e - t + En("1e-" + ((i + "").length - 1))), e);
              }return Jr(t, e);
            }function tc(t) {
              return Gh(xa(t).toLowerCase());
            }function ec(t) {
              return (t = xa(t)) && t.replace(Be, qn).replace(cn, "");
            }function nc(t, e, n) {
              t = xa(t), e = ci(e);var r = t.length;n = n === rt ? r : Yn(ga(n), 0, r);var i = n;return (n -= e.length) >= 0 && t.slice(n, i) == e;
            }function rc(t) {
              return t = xa(t), t && xe.test(t) ? t.replace(we, zn) : t;
            }function ic(t) {
              return t = xa(t), t && Se.test(t) ? t.replace(Ae, "\\$&") : t;
            }function oc(t, e, n) {
              t = xa(t), e = ga(e);var r = e ? Y(t) : 0;if (!e || r >= e) return t;var i = (e - r) / 2;return Yi(Uf(i), n) + t + Yi(Nf(i), n);
            }function uc(t, e, n) {
              t = xa(t), e = ga(e);var r = e ? Y(t) : 0;return e && r < e ? t + Yi(e - r, n) : t;
            }function sc(t, e, n) {
              t = xa(t), e = ga(e);var r = e ? Y(t) : 0;return e && r < e ? Yi(e - r, n) + t : t;
            }function ac(t, e, n) {
              return n || null == e ? e = 0 : e && (e = +e), Wf(xa(t).replace(Pe, ""), e || 0);
            }function cc(t, e, n) {
              return e = (n ? Io(t, e, n) : e === rt) ? 1 : ga(e), Kr(xa(t), e);
            }function fc() {
              var t = arguments,
                  e = xa(t[0]);return t.length < 3 ? e : e.replace(t[1], t[2]);
            }function lc(t, e, n) {
              return n && "number" != typeof n && Io(t, e, n) && (e = n = rt), (n = n === rt ? Nt : n >>> 0) ? (t = xa(t), t && ("string" == typeof e || null != e && !gh(e)) && !(e = ci(e)) && H(t) ? bi(Q(t), 0, n) : t.split(e, n)) : [];
            }function hc(t, e, n) {
              return t = xa(t), n = null == n ? 0 : Yn(ga(n), 0, t.length), e = ci(e), t.slice(n, n + e.length) == e;
            }function pc(t, e, r) {
              var i = n.templateSettings;r && Io(t, e, r) && (e = rt), t = xa(t), e = Oh({}, e, i, uo);var o,
                  u,
                  s = Oh({}, e.imports, i.imports, uo),
                  a = Ua(s),
                  c = N(s, a),
                  f = 0,
                  l = e.interpolate || We,
                  h = "__p += '",
                  p = of((e.escape || We).source + "|" + l.source + "|" + (l === je ? Fe : We).source + "|" + (e.evaluate || We).source + "|$", "g"),
                  d = "//# sourceURL=" + ("sourceURL" in e ? e.sourceURL : "lodash.templateSources[" + ++vn + "]") + "\n";t.replace(p, function (e, n, r, i, s, a) {
                return r || (r = i), h += t.slice(f, a).replace(Ge, z), n && (o = !0, h += "' +\n__e(" + n + ") +\n'"), s && (u = !0, h += "';\n" + s + ";\n__p += '"), r && (h += "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"), f = a + e.length, e;
              }), h += "';\n";var v = e.variable;v || (h = "with (obj) {\n" + h + "\n}\n"), h = (u ? h.replace(ye, "") : h).replace(ge, "$1").replace(me, "$1;"), h = "function(" + (v || "obj") + ") {\n" + (v ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (u ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + h + "return __p\n}";var _ = Zh(function () {
                return ef(a, d + "return " + h).apply(rt, c);
              });if (_.source = h, Js(_)) throw _;return _;
            }function dc(t) {
              return xa(t).toLowerCase();
            }function vc(t) {
              return xa(t).toUpperCase();
            }function _c(t, e, n) {
              if ((t = xa(t)) && (n || e === rt)) return t.replace(De, "");if (!t || !(e = ci(e))) return t;var r = Q(t),
                  i = Q(e);return bi(r, F(r, i), L(r, i) + 1).join("");
            }function yc(t, e, n) {
              if ((t = xa(t)) && (n || e === rt)) return t.replace(Ie, "");if (!t || !(e = ci(e))) return t;var r = Q(t);return bi(r, 0, L(r, Q(e)) + 1).join("");
            }function gc(t, e, n) {
              if ((t = xa(t)) && (n || e === rt)) return t.replace(Pe, "");if (!t || !(e = ci(e))) return t;var r = Q(t);return bi(r, F(r, Q(e))).join("");
            }function mc(t, e) {
              var n = Ot,
                  r = Ct;if (ta(e)) {
                var i = "separator" in e ? e.separator : i;n = "length" in e ? ga(e.length) : n, r = "omission" in e ? ci(e.omission) : r;
              }t = xa(t);var o = t.length;if (H(t)) {
                var u = Q(t);o = u.length;
              }if (n >= o) return t;var s = n - Y(r);if (s < 1) return r;var a = u ? bi(u, 0, s).join("") : t.slice(0, s);if (i === rt) return a + r;if (u && (s += a.length - s), gh(i)) {
                if (t.slice(s).search(i)) {
                  var c,
                      f = a;for (i.global || (i = of(i.source, xa(Le.exec(i)) + "g")), i.lastIndex = 0; c = i.exec(f);) var l = c.index;a = a.slice(0, l === rt ? s : l);
                }
              } else if (t.indexOf(ci(i), s) != s) {
                var h = a.lastIndexOf(i);h > -1 && (a = a.slice(0, h));
              }return a + r;
            }function bc(t) {
              return t = xa(t), t && Ee.test(t) ? t.replace(be, Mn) : t;
            }function wc(t, e, n) {
              return t = xa(t), e = n ? rt : e, e === rt ? $(t) ? nt(t) : b(t) : t.match(e) || [];
            }function Ec(t) {
              var e = null == t ? 0 : t.length,
                  n = go();return t = e ? d(t, function (t) {
                if ("function" != typeof t[1]) throw new sf(ut);return [n(t[0]), t[1]];
              }) : [], Yr(function (n) {
                for (var r = -1; ++r < e;) {
                  var i = t[r];if (u(i[0], this, n)) return u(i[1], this, n);
                }
              });
            }function xc(t) {
              return tr(Qn(t, ft));
            }function jc(t) {
              return function () {
                return t;
              };
            }function Oc(t, e) {
              return null == t || t !== t ? e : t;
            }function Cc(t) {
              return t;
            }function Tc(t) {
              return kr("function" == typeof t ? t : Qn(t, ft));
            }function Ac(t) {
              return Lr(Qn(t, ft));
            }function Sc(t, e) {
              return qr(t, Qn(e, ft));
            }function Dc(t, e, n) {
              var r = Ua(e),
                  i = lr(e, r);null != n || ta(e) && (i.length || !r.length) || (n = e, e = t, t = this, i = lr(e, Ua(e)));var o = !(ta(n) && "chain" in n && !n.chain),
                  u = Ks(t);return a(i, function (n) {
                var r = e[n];t[n] = r, u && (t.prototype[n] = function () {
                  var e = this.__chain__;if (o || e) {
                    var n = t(this.__wrapped__);return (n.__actions__ = ki(this.__actions__)).push({ func: r, args: arguments, thisArg: t }), n.__chain__ = e, n;
                  }return r.apply(t, v([this.value()], arguments));
                });
              }), t;
            }function Pc() {
              return Cn._ === this && (Cn._ = gf), this;
            }function Ic() {}function kc(t) {
              return t = ga(t), Yr(function (e) {
                return Hr(e, t);
              });
            }function Rc(t) {
              return ko(t) ? T(Jo(t)) : Gr(t);
            }function Nc(t) {
              return function (e) {
                return null == t ? rt : hr(t, e);
              };
            }function Uc() {
              return [];
            }function Fc() {
              return !1;
            }function Lc() {
              return {};
            }function qc() {
              return "";
            }function zc() {
              return !0;
            }function Mc(t, e) {
              if ((t = ga(t)) < 1 || t > It) return [];var n = Nt,
                  r = $f(t, Nt);e = go(e), t -= Nt;for (var i = I(r, e); ++n < t;) e(n);return i;
            }function Hc(t) {
              return ph(t) ? d(t, Jo) : ha(t) ? [t] : ki(Al(xa(t)));
            }function $c(t) {
              var e = ++df;return xa(t) + e;
            }function Bc(t) {
              return t && t.length ? or(t, Cc, vr) : rt;
            }function Wc(t, e) {
              return t && t.length ? or(t, go(e, 2), vr) : rt;
            }function Gc(t) {
              return C(t, Cc);
            }function Zc(t, e) {
              return C(t, go(e, 2));
            }function Vc(t) {
              return t && t.length ? or(t, Cc, Ur) : rt;
            }function Jc(t, e) {
              return t && t.length ? or(t, go(e, 2), Ur) : rt;
            }function Xc(t) {
              return t && t.length ? P(t, Cc) : 0;
            }function Kc(t, e) {
              return t && t.length ? P(t, go(e, 2)) : 0;
            }e = null == e ? Cn : Hn.defaults(Cn.Object(), e, Hn.pick(Cn, dn));var Yc = e.Array,
                Qc = e.Date,
                tf = e.Error,
                ef = e.Function,
                nf = e.Math,
                rf = e.Object,
                of = e.RegExp,
                uf = e.String,
                sf = e.TypeError,
                af = Yc.prototype,
                cf = ef.prototype,
                ff = rf.prototype,
                lf = e["__core-js_shared__"],
                hf = cf.toString,
                pf = ff.hasOwnProperty,
                df = 0,
                vf = function () {
              var t = /[^.]+$/.exec(lf && lf.keys && lf.keys.IE_PROTO || "");return t ? "Symbol(src)_1." + t : "";
            }(),
                _f = ff.toString,
                yf = hf.call(rf),
                gf = Cn._,
                mf = of("^" + hf.call(pf).replace(Ae, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                bf = Sn ? e.Buffer : rt,
                wf = e.Symbol,
                Ef = e.Uint8Array,
                xf = bf ? bf.allocUnsafe : rt,
                jf = G(rf.getPrototypeOf, rf),
                Of = rf.create,
                Cf = ff.propertyIsEnumerable,
                Tf = af.splice,
                Af = wf ? wf.isConcatSpreadable : rt,
                Sf = wf ? wf.iterator : rt,
                Df = wf ? wf.toStringTag : rt,
                Pf = function () {
              try {
                var t = wo(rf, "defineProperty");return t({}, "", {}), t;
              } catch (t) {}
            }(),
                If = e.clearTimeout !== Cn.clearTimeout && e.clearTimeout,
                kf = Qc && Qc.now !== Cn.Date.now && Qc.now,
                Rf = e.setTimeout !== Cn.setTimeout && e.setTimeout,
                Nf = nf.ceil,
                Uf = nf.floor,
                Ff = rf.getOwnPropertySymbols,
                Lf = bf ? bf.isBuffer : rt,
                qf = e.isFinite,
                zf = af.join,
                Mf = G(rf.keys, rf),
                Hf = nf.max,
                $f = nf.min,
                Bf = Qc.now,
                Wf = e.parseInt,
                Gf = nf.random,
                Zf = af.reverse,
                Vf = wo(e, "DataView"),
                Jf = wo(e, "Map"),
                Xf = wo(e, "Promise"),
                Kf = wo(e, "Set"),
                Yf = wo(e, "WeakMap"),
                Qf = wo(rf, "create"),
                tl = Yf && new Yf(),
                el = {},
                nl = Xo(Vf),
                rl = Xo(Jf),
                il = Xo(Xf),
                ol = Xo(Kf),
                ul = Xo(Yf),
                sl = wf ? wf.prototype : rt,
                al = sl ? sl.valueOf : rt,
                cl = sl ? sl.toString : rt,
                fl = function () {
              function t() {}return function (e) {
                if (!ta(e)) return {};if (Of) return Of(e);t.prototype = e;var n = new t();return t.prototype = rt, n;
              };
            }();n.templateSettings = { escape: /<%-([\s\S]+?)%>/g, evaluate: /<%([\s\S]+?)%>/g, interpolate: je, variable: "", imports: { _: n } }, n.prototype = r.prototype, n.prototype.constructor = n, m.prototype = fl(r.prototype), m.prototype.constructor = m, A.prototype = fl(r.prototype), A.prototype.constructor = A, Ue.prototype.clear = Ze, Ue.prototype.delete = Ve, Ue.prototype.get = Je, Ue.prototype.has = Xe, Ue.prototype.set = Ke, Ye.prototype.clear = Qe, Ye.prototype.delete = tn, Ye.prototype.get = en, Ye.prototype.has = nn, Ye.prototype.set = rn, on.prototype.clear = un, on.prototype.delete = sn, on.prototype.get = fn, on.prototype.has = ln, on.prototype.set = hn, pn.prototype.add = pn.prototype.push = gn, pn.prototype.has = mn, bn.prototype.clear = wn, bn.prototype.delete = jn, bn.prototype.get = On, bn.prototype.has = Tn, bn.prototype.set = An;var ll = qi(cr),
                hl = qi(fr, !0),
                pl = zi(),
                dl = zi(!0),
                vl = tl ? function (t, e) {
              return tl.set(t, e), t;
            } : Cc,
                _l = Pf ? function (t, e) {
              return Pf(t, "toString", { configurable: !0, enumerable: !1, value: jc(e), writable: !0 });
            } : Cc,
                yl = Yr,
                gl = If || function (t) {
              return Cn.clearTimeout(t);
            },
                ml = Kf && 1 / V(new Kf([, -0]))[1] == Pt ? function (t) {
              return new Kf(t);
            } : Ic,
                bl = tl ? function (t) {
              return tl.get(t);
            } : Ic,
                wl = Ff ? function (t) {
              return null == t ? [] : (t = rf(t), l(Ff(t), function (e) {
                return Cf.call(t, e);
              }));
            } : Uc,
                El = Ff ? function (t) {
              for (var e = []; t;) v(e, wl(t)), t = jf(t);return e;
            } : Uc,
                xl = dr;(Vf && xl(new Vf(new ArrayBuffer(1))) != se || Jf && xl(new Jf()) != Vt || Xf && "[object Promise]" != xl(Xf.resolve()) || Kf && xl(new Kf()) != te || Yf && xl(new Yf()) != ie) && (xl = function (t) {
              var e = dr(t),
                  n = e == Kt ? t.constructor : rt,
                  r = n ? Xo(n) : "";if (r) switch (r) {case nl:
                  return se;case rl:
                  return Vt;case il:
                  return "[object Promise]";case ol:
                  return te;case ul:
                  return ie;}return e;
            });var jl = lf ? Ks : Fc,
                Ol = Zo(vl),
                Cl = Rf || function (t, e) {
              return Cn.setTimeout(t, e);
            },
                Tl = Zo(_l),
                Al = function (t) {
              var e = Ts(t, function (t) {
                return n.size === at && n.clear(), t;
              }),
                  n = e.cache;return e;
            }(function (t) {
              var e = [];return Te.test(t) && e.push(""), t.replace(/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, function (t, n, r, i) {
                e.push(r ? i.replace(/\\(\\)?/g, "$1") : n || t);
              }), e;
            }),
                Sl = Yr(function (t, e) {
              return $s(t) ? rr(t, ar(e, 1, $s, !0)) : [];
            }),
                Dl = Yr(function (t, e) {
              var n = yu(e);return $s(n) && (n = rt), $s(t) ? rr(t, ar(e, 1, $s, !0), go(n, 2)) : [];
            }),
                Pl = Yr(function (t, e) {
              var n = yu(e);return $s(n) && (n = rt), $s(t) ? rr(t, ar(e, 1, $s, !0), rt, n) : [];
            }),
                Il = Yr(function (t) {
              var e = d(t, yi);return e.length && e[0] === t[0] ? mr(e) : [];
            }),
                kl = Yr(function (t) {
              var e = yu(t),
                  n = d(t, yi);return e === yu(n) ? e = rt : n.pop(), n.length && n[0] === t[0] ? mr(n, go(e, 2)) : [];
            }),
                Rl = Yr(function (t) {
              var e = yu(t),
                  n = d(t, yi);return e = "function" == typeof e ? e : rt, e && n.pop(), n.length && n[0] === t[0] ? mr(n, rt, e) : [];
            }),
                Nl = Yr(bu),
                Ul = ho(function (t, e) {
              var n = null == t ? 0 : t.length,
                  r = Kn(t, e);return Vr(t, d(e, function (t) {
                return Po(t, n) ? +t : t;
              }).sort(Si)), r;
            }),
                Fl = Yr(function (t) {
              return fi(ar(t, 1, $s, !0));
            }),
                Ll = Yr(function (t) {
              var e = yu(t);return $s(e) && (e = rt), fi(ar(t, 1, $s, !0), go(e, 2));
            }),
                ql = Yr(function (t) {
              var e = yu(t);return e = "function" == typeof e ? e : rt, fi(ar(t, 1, $s, !0), rt, e);
            }),
                zl = Yr(function (t, e) {
              return $s(t) ? rr(t, e) : [];
            }),
                Ml = Yr(function (t) {
              return vi(l(t, $s));
            }),
                Hl = Yr(function (t) {
              var e = yu(t);return $s(e) && (e = rt), vi(l(t, $s), go(e, 2));
            }),
                $l = Yr(function (t) {
              var e = yu(t);return e = "function" == typeof e ? e : rt, vi(l(t, $s), rt, e);
            }),
                Bl = Yr(Hu),
                Wl = Yr(function (t) {
              var e = t.length,
                  n = e > 1 ? t[e - 1] : rt;return n = "function" == typeof n ? (t.pop(), n) : rt, $u(t, n);
            }),
                Gl = ho(function (t) {
              var e = t.length,
                  n = e ? t[0] : 0,
                  r = this.__wrapped__,
                  i = function (e) {
                return Kn(e, t);
              };return !(e > 1 || this.__actions__.length) && r instanceof A && Po(n) ? (r = r.slice(n, +n + (e ? 1 : 0)), r.__actions__.push({ func: Vu, args: [i], thisArg: rt }), new m(r, this.__chain__).thru(function (t) {
                return e && !t.length && t.push(rt), t;
              })) : this.thru(i);
            }),
                Zl = Fi(function (t, e, n) {
              pf.call(t, n) ? ++t[n] : Xn(t, n, 1);
            }),
                Vl = Gi(su),
                Jl = Gi(au),
                Xl = Fi(function (t, e, n) {
              pf.call(t, n) ? t[n].push(e) : Xn(t, n, [e]);
            }),
                Kl = Yr(function (t, e, n) {
              var r = -1,
                  i = "function" == typeof e,
                  o = Hs(t) ? Yc(t.length) : [];return ll(t, function (t) {
                o[++r] = i ? u(e, t, n) : wr(t, e, n);
              }), o;
            }),
                Yl = Fi(function (t, e, n) {
              Xn(t, n, e);
            }),
                Ql = Fi(function (t, e, n) {
              t[n ? 0 : 1].push(e);
            }, function () {
              return [[], []];
            }),
                th = Yr(function (t, e) {
              if (null == t) return [];var n = e.length;return n > 1 && Io(t, e[0], e[1]) ? e = [] : n > 2 && Io(e[0], e[1], e[2]) && (e = [e[0]]), $r(t, ar(e, 1), []);
            }),
                eh = kf || function () {
              return Cn.Date.now();
            },
                nh = Yr(function (t, e, n) {
              var r = vt;if (n.length) {
                var i = Z(n, yo(nh));r |= bt;
              }return oo(t, r, e, n, i);
            }),
                rh = Yr(function (t, e, n) {
              var r = vt | _t;if (n.length) {
                var i = Z(n, yo(rh));r |= bt;
              }return oo(e, r, t, n, i);
            }),
                ih = Yr(function (t, e) {
              return nr(t, 1, e);
            }),
                oh = Yr(function (t, e, n) {
              return nr(t, ba(e) || 0, n);
            });Ts.Cache = on;var uh = yl(function (t, e) {
              e = 1 == e.length && ph(e[0]) ? d(e[0], R(go())) : d(ar(e, 1), R(go()));var n = e.length;return Yr(function (r) {
                for (var i = -1, o = $f(r.length, n); ++i < o;) r[i] = e[i].call(this, r[i]);return u(t, this, r);
              });
            }),
                sh = Yr(function (t, e) {
              var n = Z(e, yo(sh));return oo(t, bt, rt, e, n);
            }),
                ah = Yr(function (t, e) {
              var n = Z(e, yo(ah));return oo(t, wt, rt, e, n);
            }),
                ch = ho(function (t, e) {
              return oo(t, xt, rt, rt, rt, e);
            }),
                fh = eo(vr),
                lh = eo(function (t, e) {
              return t >= e;
            }),
                hh = Er(function () {
              return arguments;
            }()) ? Er : function (t) {
              return ea(t) && pf.call(t, "callee") && !Cf.call(t, "callee");
            },
                ph = Yc.isArray,
                dh = In ? R(In) : xr,
                vh = Lf || Fc,
                _h = kn ? R(kn) : jr,
                yh = Rn ? R(Rn) : Tr,
                gh = Nn ? R(Nn) : Dr,
                mh = Un ? R(Un) : Pr,
                bh = Fn ? R(Fn) : Ir,
                wh = eo(Ur),
                Eh = eo(function (t, e) {
              return t <= e;
            }),
                xh = Li(function (t, e) {
              if (Fo(e) || Hs(e)) return void Ri(e, Ua(e), t);for (var n in e) pf.call(e, n) && Wn(t, n, e[n]);
            }),
                jh = Li(function (t, e) {
              Ri(e, Fa(e), t);
            }),
                Oh = Li(function (t, e, n, r) {
              Ri(e, Fa(e), t, r);
            }),
                Ch = Li(function (t, e, n, r) {
              Ri(e, Ua(e), t, r);
            }),
                Th = ho(Kn),
                Ah = Yr(function (t) {
              return t.push(rt, uo), u(Oh, rt, t);
            }),
                Sh = Yr(function (t) {
              return t.push(rt, so), u(Rh, rt, t);
            }),
                Dh = Ji(function (t, e, n) {
              t[e] = n;
            }, jc(Cc)),
                Ph = Ji(function (t, e, n) {
              pf.call(t, e) ? t[e].push(n) : t[e] = [n];
            }, go),
                Ih = Yr(wr),
                kh = Li(function (t, e, n) {
              zr(t, e, n);
            }),
                Rh = Li(function (t, e, n, r) {
              zr(t, e, n, r);
            }),
                Nh = ho(function (t, e) {
              var n = {};if (null == t) return n;var r = !1;e = d(e, function (e) {
                return e = mi(e, t), r || (r = e.length > 1), e;
              }), Ri(t, vo(t), n), r && (n = Qn(n, ft | lt | ht, ao));for (var i = e.length; i--;) li(n, e[i]);return n;
            }),
                Uh = ho(function (t, e) {
              return null == t ? {} : Br(t, e);
            }),
                Fh = io(Ua),
                Lh = io(Fa),
                qh = $i(function (t, e, n) {
              return e = e.toLowerCase(), t + (n ? tc(e) : e);
            }),
                zh = $i(function (t, e, n) {
              return t + (n ? "-" : "") + e.toLowerCase();
            }),
                Mh = $i(function (t, e, n) {
              return t + (n ? " " : "") + e.toLowerCase();
            }),
                Hh = Hi("toLowerCase"),
                $h = $i(function (t, e, n) {
              return t + (n ? "_" : "") + e.toLowerCase();
            }),
                Bh = $i(function (t, e, n) {
              return t + (n ? " " : "") + Gh(e);
            }),
                Wh = $i(function (t, e, n) {
              return t + (n ? " " : "") + e.toUpperCase();
            }),
                Gh = Hi("toUpperCase"),
                Zh = Yr(function (t, e) {
              try {
                return u(t, rt, e);
              } catch (t) {
                return Js(t) ? t : new tf(t);
              }
            }),
                Vh = ho(function (t, e) {
              return a(e, function (e) {
                e = Jo(e), Xn(t, e, nh(t[e], t));
              }), t;
            }),
                Jh = Zi(),
                Xh = Zi(!0),
                Kh = Yr(function (t, e) {
              return function (n) {
                return wr(n, t, e);
              };
            }),
                Yh = Yr(function (t, e) {
              return function (n) {
                return wr(t, n, e);
              };
            }),
                Qh = Ki(d),
                tp = Ki(f),
                ep = Ki(g),
                np = to(),
                rp = to(!0),
                ip = Xi(function (t, e) {
              return t + e;
            }, 0),
                op = ro("ceil"),
                up = Xi(function (t, e) {
              return t / e;
            }, 1),
                sp = ro("floor"),
                ap = Xi(function (t, e) {
              return t * e;
            }, 1),
                cp = ro("round"),
                fp = Xi(function (t, e) {
              return t - e;
            }, 0);return n.after = bs, n.ary = ws, n.assign = xh, n.assignIn = jh, n.assignInWith = Oh, n.assignWith = Ch, n.at = Th, n.before = Es, n.bind = nh, n.bindAll = Vh, n.bindKey = rh, n.castArray = Ns, n.chain = Gu, n.chunk = Qo, n.compact = tu, n.concat = eu, n.cond = Ec, n.conforms = xc, n.constant = jc, n.countBy = Zl, n.create = ja, n.curry = xs, n.curryRight = js, n.debounce = Os, n.defaults = Ah, n.defaultsDeep = Sh, n.defer = ih, n.delay = oh, n.difference = Sl, n.differenceBy = Dl, n.differenceWith = Pl, n.drop = nu, n.dropRight = ru, n.dropRightWhile = iu, n.dropWhile = ou, n.fill = uu, n.filter = rs, n.flatMap = is, n.flatMapDeep = os, n.flatMapDepth = us, n.flatten = cu, n.flattenDeep = fu, n.flattenDepth = lu, n.flip = Cs, n.flow = Jh, n.flowRight = Xh, n.fromPairs = hu, n.functions = Pa, n.functionsIn = Ia, n.groupBy = Xl, n.initial = vu, n.intersection = Il, n.intersectionBy = kl, n.intersectionWith = Rl, n.invert = Dh, n.invertBy = Ph, n.invokeMap = Kl, n.iteratee = Tc, n.keyBy = Yl, n.keys = Ua, n.keysIn = Fa, n.map = fs, n.mapKeys = La, n.mapValues = qa, n.matches = Ac, n.matchesProperty = Sc, n.memoize = Ts, n.merge = kh, n.mergeWith = Rh, n.method = Kh, n.methodOf = Yh, n.mixin = Dc, n.negate = As, n.nthArg = kc, n.omit = Nh, n.omitBy = za, n.once = Ss, n.orderBy = ls, n.over = Qh, n.overArgs = uh, n.overEvery = tp, n.overSome = ep, n.partial = sh, n.partialRight = ah, n.partition = Ql, n.pick = Uh, n.pickBy = Ma, n.property = Rc, n.propertyOf = Nc, n.pull = Nl, n.pullAll = bu, n.pullAllBy = wu, n.pullAllWith = Eu, n.pullAt = Ul, n.range = np, n.rangeRight = rp, n.rearg = ch, n.reject = ds, n.remove = xu, n.rest = Ds, n.reverse = ju, n.sampleSize = _s, n.set = $a, n.setWith = Ba, n.shuffle = ys, n.slice = Ou, n.sortBy = th, n.sortedUniq = Iu, n.sortedUniqBy = ku, n.split = lc, n.spread = Ps, n.tail = Ru, n.take = Nu, n.takeRight = Uu, n.takeRightWhile = Fu, n.takeWhile = Lu, n.tap = Zu, n.throttle = Is, n.thru = Vu, n.toArray = _a, n.toPairs = Fh, n.toPairsIn = Lh, n.toPath = Hc, n.toPlainObject = wa, n.transform = Wa, n.unary = ks, n.union = Fl, n.unionBy = Ll, n.unionWith = ql, n.uniq = qu, n.uniqBy = zu, n.uniqWith = Mu, n.unset = Ga, n.unzip = Hu, n.unzipWith = $u, n.update = Za, n.updateWith = Va, n.values = Ja, n.valuesIn = Xa, n.without = zl, n.words = wc, n.wrap = Rs, n.xor = Ml, n.xorBy = Hl, n.xorWith = $l, n.zip = Bl, n.zipObject = Bu, n.zipObjectDeep = Wu, n.zipWith = Wl, n.entries = Fh, n.entriesIn = Lh, n.extend = jh, n.extendWith = Oh, Dc(n, n), n.add = ip, n.attempt = Zh, n.camelCase = qh, n.capitalize = tc, n.ceil = op, n.clamp = Ka, n.clone = Us, n.cloneDeep = Ls, n.cloneDeepWith = qs, n.cloneWith = Fs, n.conformsTo = zs, n.deburr = ec, n.defaultTo = Oc, n.divide = up, n.endsWith = nc, n.eq = Ms, n.escape = rc, n.escapeRegExp = ic, n.every = ns, n.find = Vl, n.findIndex = su, n.findKey = Oa, n.findLast = Jl, n.findLastIndex = au, n.findLastKey = Ca, n.floor = sp, n.forEach = ss, n.forEachRight = as, n.forIn = Ta, n.forInRight = Aa, n.forOwn = Sa, n.forOwnRight = Da, n.get = ka, n.gt = fh, n.gte = lh, n.has = Ra, n.hasIn = Na, n.head = pu, n.identity = Cc, n.includes = cs, n.indexOf = du, n.inRange = Ya, n.invoke = Ih, n.isArguments = hh, n.isArray = ph, n.isArrayBuffer = dh, n.isArrayLike = Hs, n.isArrayLikeObject = $s, n.isBoolean = Bs, n.isBuffer = vh, n.isDate = _h, n.isElement = Ws, n.isEmpty = Gs, n.isEqual = Zs, n.isEqualWith = Vs, n.isError = Js, n.isFinite = Xs, n.isFunction = Ks, n.isInteger = Ys, n.isLength = Qs, n.isMap = yh, n.isMatch = na, n.isMatchWith = ra, n.isNaN = ia, n.isNative = oa, n.isNil = sa, n.isNull = ua, n.isNumber = aa, n.isObject = ta, n.isObjectLike = ea, n.isPlainObject = ca, n.isRegExp = gh, n.isSafeInteger = fa, n.isSet = mh, n.isString = la, n.isSymbol = ha, n.isTypedArray = bh, n.isUndefined = pa, n.isWeakMap = da, n.isWeakSet = va, n.join = _u, n.kebabCase = zh, n.last = yu, n.lastIndexOf = gu, n.lowerCase = Mh, n.lowerFirst = Hh, n.lt = wh, n.lte = Eh, n.max = Bc, n.maxBy = Wc, n.mean = Gc, n.meanBy = Zc, n.min = Vc, n.minBy = Jc, n.stubArray = Uc, n.stubFalse = Fc, n.stubObject = Lc, n.stubString = qc, n.stubTrue = zc, n.multiply = ap, n.nth = mu, n.noConflict = Pc, n.noop = Ic, n.now = eh, n.pad = oc, n.padEnd = uc, n.padStart = sc, n.parseInt = ac, n.random = Qa, n.reduce = hs, n.reduceRight = ps, n.repeat = cc, n.replace = fc, n.result = Ha, n.round = cp, n.runInContext = t, n.sample = vs, n.size = gs, n.snakeCase = $h, n.some = ms, n.sortedIndex = Cu, n.sortedIndexBy = Tu, n.sortedIndexOf = Au, n.sortedLastIndex = Su, n.sortedLastIndexBy = Du, n.sortedLastIndexOf = Pu, n.startCase = Bh, n.startsWith = hc, n.subtract = fp, n.sum = Xc, n.sumBy = Kc, n.template = pc, n.times = Mc, n.toFinite = ya, n.toInteger = ga, n.toLength = ma, n.toLower = dc, n.toNumber = ba, n.toSafeInteger = Ea, n.toString = xa, n.toUpper = vc, n.trim = _c, n.trimEnd = yc, n.trimStart = gc, n.truncate = mc, n.unescape = bc, n.uniqueId = $c, n.upperCase = Wh, n.upperFirst = Gh, n.each = ss, n.eachRight = as, n.first = pu, Dc(n, function () {
              var t = {};return cr(n, function (e, r) {
                pf.call(n.prototype, r) || (t[r] = e);
              }), t;
            }(), { chain: !1 }), n.VERSION = "4.17.4", a(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (t) {
              n[t].placeholder = n;
            }), a(["drop", "take"], function (t, e) {
              A.prototype[t] = function (n) {
                n = n === rt ? 1 : Hf(ga(n), 0);var r = this.__filtered__ && !e ? new A(this) : this.clone();return r.__filtered__ ? r.__takeCount__ = $f(n, r.__takeCount__) : r.__views__.push({ size: $f(n, Nt), type: t + (r.__dir__ < 0 ? "Right" : "") }), r;
              }, A.prototype[t + "Right"] = function (e) {
                return this.reverse()[t](e).reverse();
              };
            }), a(["filter", "map", "takeWhile"], function (t, e) {
              var n = e + 1,
                  r = n == St || 3 == n;A.prototype[t] = function (t) {
                var e = this.clone();return e.__iteratees__.push({ iteratee: go(t, 3), type: n }), e.__filtered__ = e.__filtered__ || r, e;
              };
            }), a(["head", "last"], function (t, e) {
              var n = "take" + (e ? "Right" : "");A.prototype[t] = function () {
                return this[n](1).value()[0];
              };
            }), a(["initial", "tail"], function (t, e) {
              var n = "drop" + (e ? "" : "Right");A.prototype[t] = function () {
                return this.__filtered__ ? new A(this) : this[n](1);
              };
            }), A.prototype.compact = function () {
              return this.filter(Cc);
            }, A.prototype.find = function (t) {
              return this.filter(t).head();
            }, A.prototype.findLast = function (t) {
              return this.reverse().find(t);
            }, A.prototype.invokeMap = Yr(function (t, e) {
              return "function" == typeof t ? new A(this) : this.map(function (n) {
                return wr(n, t, e);
              });
            }), A.prototype.reject = function (t) {
              return this.filter(As(go(t)));
            }, A.prototype.slice = function (t, e) {
              t = ga(t);var n = this;return n.__filtered__ && (t > 0 || e < 0) ? new A(n) : (t < 0 ? n = n.takeRight(-t) : t && (n = n.drop(t)), e !== rt && (e = ga(e), n = e < 0 ? n.dropRight(-e) : n.take(e - t)), n);
            }, A.prototype.takeRightWhile = function (t) {
              return this.reverse().takeWhile(t).reverse();
            }, A.prototype.toArray = function () {
              return this.take(Nt);
            }, cr(A.prototype, function (t, e) {
              var r = /^(?:filter|find|map|reject)|While$/.test(e),
                  i = /^(?:head|last)$/.test(e),
                  o = n[i ? "take" + ("last" == e ? "Right" : "") : e],
                  u = i || /^find/.test(e);o && (n.prototype[e] = function () {
                var e = this.__wrapped__,
                    s = i ? [1] : arguments,
                    a = e instanceof A,
                    c = s[0],
                    f = a || ph(e),
                    l = function (t) {
                  var e = o.apply(n, v([t], s));return i && h ? e[0] : e;
                };f && r && "function" == typeof c && 1 != c.length && (a = f = !1);var h = this.__chain__,
                    p = !!this.__actions__.length,
                    d = u && !h,
                    _ = a && !p;if (!u && f) {
                  e = _ ? e : new A(this);var y = t.apply(e, s);return y.__actions__.push({ func: Vu, args: [l], thisArg: rt }), new m(y, h);
                }return d && _ ? t.apply(this, s) : (y = this.thru(l), d ? i ? y.value()[0] : y.value() : y);
              });
            }), a(["pop", "push", "shift", "sort", "splice", "unshift"], function (t) {
              var e = af[t],
                  r = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru",
                  i = /^(?:pop|shift)$/.test(t);n.prototype[t] = function () {
                var t = arguments;if (i && !this.__chain__) {
                  var n = this.value();return e.apply(ph(n) ? n : [], t);
                }return this[r](function (n) {
                  return e.apply(ph(n) ? n : [], t);
                });
              };
            }), cr(A.prototype, function (t, e) {
              var r = n[e];if (r) {
                var i = r.name + "";(el[i] || (el[i] = [])).push({ name: e, func: r });
              }
            }), el[Vi(rt, _t).name] = [{ name: "wrapper", func: rt }], A.prototype.clone = X, A.prototype.reverse = tt, A.prototype.value = et, n.prototype.at = Gl, n.prototype.chain = Ju, n.prototype.commit = Xu, n.prototype.next = Ku, n.prototype.plant = Qu, n.prototype.reverse = ts, n.prototype.toJSON = n.prototype.valueOf = n.prototype.value = es, n.prototype.first = n.prototype.head, Sf && (n.prototype[Sf] = Yu), n;
          }();An ? ((An.exports = Hn)._ = Hn, Tn._ = Hn) : Cn._ = Hn;
        }).call(this);
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 24: [function (e, n, r) {
      (function (e) {
        !function (e, r, i) {
          r[e] = r[e] || i(), void 0 !== n && n.exports ? n.exports = r[e] : "function" == typeof t && t.amd && t(function () {
            return r[e];
          });
        }("Promise", void 0 !== e ? e : this, function () {
          function t(t, e) {
            h.add(t, e), l || (l = d(h.drain));
          }function e(t) {
            var e,
                n = typeof t;return null == t || "object" != n && "function" != n || (e = t.then), "function" == typeof e && e;
          }function n() {
            for (var t = 0; t < this.chain.length; t++) r(this, 1 === this.state ? this.chain[t].success : this.chain[t].failure, this.chain[t]);this.chain.length = 0;
          }function r(t, n, r) {
            var i, o;try {
              !1 === n ? r.reject(t.msg) : (i = !0 === n ? t.msg : n.call(void 0, t.msg), i === r.promise ? r.reject(TypeError("Promise-chain cycle")) : (o = e(i)) ? o.call(i, r.resolve, r.reject) : r.resolve(i));
            } catch (t) {
              r.reject(t);
            }
          }function i(r) {
            var u,
                a = this;if (!a.triggered) {
              a.triggered = !0, a.def && (a = a.def);try {
                (u = e(r)) ? t(function () {
                  var t = new s(a);try {
                    u.call(r, function () {
                      i.apply(t, arguments);
                    }, function () {
                      o.apply(t, arguments);
                    });
                  } catch (e) {
                    o.call(t, e);
                  }
                }) : (a.msg = r, a.state = 1, a.chain.length > 0 && t(n, a));
              } catch (t) {
                o.call(new s(a), t);
              }
            }
          }function o(e) {
            var r = this;r.triggered || (r.triggered = !0, r.def && (r = r.def), r.msg = e, r.state = 2, r.chain.length > 0 && t(n, r));
          }function u(t, e, n, r) {
            for (var i = 0; i < e.length; i++) !function (i) {
              t.resolve(e[i]).then(function (t) {
                n(i, t);
              }, r);
            }(i);
          }function s(t) {
            this.def = t, this.triggered = !1;
          }function a(t) {
            this.promise = t, this.state = 0, this.triggered = !1, this.chain = [], this.msg = void 0;
          }function c(e) {
            if ("function" != typeof e) throw TypeError("Not a function");if (0 !== this.__NPO__) throw TypeError("Not a promise");this.__NPO__ = 1;var r = new a(this);this.then = function (e, i) {
              var o = { success: "function" != typeof e || e, failure: "function" == typeof i && i };return o.promise = new this.constructor(function (t, e) {
                if ("function" != typeof t || "function" != typeof e) throw TypeError("Not a function");o.resolve = t, o.reject = e;
              }), r.chain.push(o), 0 !== r.state && t(n, r), o.promise;
            }, this.catch = function (t) {
              return this.then(void 0, t);
            };try {
              e.call(void 0, function (t) {
                i.call(r, t);
              }, function (t) {
                o.call(r, t);
              });
            } catch (t) {
              o.call(r, t);
            }
          }var f,
              l,
              h,
              p = Object.prototype.toString,
              d = "undefined" != typeof setImmediate ? function (t) {
            return setImmediate(t);
          } : setTimeout;try {
            Object.defineProperty({}, "x", {}), f = function (t, e, n, r) {
              return Object.defineProperty(t, e, { value: n, writable: !0, configurable: !1 !== r });
            };
          } catch (t) {
            f = function (t, e, n) {
              return t[e] = n, t;
            };
          }h = function () {
            function t(t, e) {
              this.fn = t, this.self = e, this.next = void 0;
            }var e, n, r;return { add: function (i, o) {
                r = new t(i, o), n ? n.next = r : e = r, n = r, r = void 0;
              }, drain: function () {
                var t = e;for (e = n = l = void 0; t;) t.fn.call(t.self), t = t.next;
              } };
          }();var v = f({}, "constructor", c, !1);return c.prototype = v, f(v, "__NPO__", 0, !1), f(c, "resolve", function (t) {
            var e = this;return t && "object" == typeof t && 1 === t.__NPO__ ? t : new e(function (e, n) {
              if ("function" != typeof e || "function" != typeof n) throw TypeError("Not a function");e(t);
            });
          }), f(c, "reject", function (t) {
            return new this(function (e, n) {
              if ("function" != typeof e || "function" != typeof n) throw TypeError("Not a function");n(t);
            });
          }), f(c, "all", function (t) {
            var e = this;return "[object Array]" != p.call(t) ? e.reject(TypeError("Not an array")) : 0 === t.length ? e.resolve([]) : new e(function (n, r) {
              if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");var i = t.length,
                  o = Array(i),
                  s = 0;u(e, t, function (t, e) {
                o[t] = e, ++s === i && n(o);
              }, r);
            });
          }), f(c, "race", function (t) {
            var e = this;return "[object Array]" != p.call(t) ? e.reject(TypeError("Not an array")) : new e(function (n, r) {
              if ("function" != typeof n || "function" != typeof r) throw TypeError("Not a function");u(e, t, function (t, e) {
                n(e);
              }, r);
            });
          }), c;
        });
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}], 25: [function (t, e, n) {
      (function (t) {
        function e(t, e) {
          for (var n = 0, r = t.length - 1; r >= 0; r--) {
            var i = t[r];"." === i ? t.splice(r, 1) : ".." === i ? (t.splice(r, 1), n++) : n && (t.splice(r, 1), n--);
          }if (e) for (; n--; n) t.unshift("..");return t;
        }function r(t, e) {
          if (t.filter) return t.filter(e);for (var n = [], r = 0; r < t.length; r++) e(t[r], r, t) && n.push(t[r]);return n;
        }var i = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
            o = function (t) {
          return i.exec(t).slice(1);
        };n.resolve = function () {
          for (var n = "", i = !1, o = arguments.length - 1; o >= -1 && !i; o--) {
            var u = o >= 0 ? arguments[o] : t.cwd();if ("string" != typeof u) throw new TypeError("Arguments to path.resolve must be strings");u && (n = u + "/" + n, i = "/" === u.charAt(0));
          }return n = e(r(n.split("/"), function (t) {
            return !!t;
          }), !i).join("/"), (i ? "/" : "") + n || ".";
        }, n.normalize = function (t) {
          var i = n.isAbsolute(t),
              o = "/" === u(t, -1);return t = e(r(t.split("/"), function (t) {
            return !!t;
          }), !i).join("/"), t || i || (t = "."), t && o && (t += "/"), (i ? "/" : "") + t;
        }, n.isAbsolute = function (t) {
          return "/" === t.charAt(0);
        }, n.join = function () {
          var t = Array.prototype.slice.call(arguments, 0);return n.normalize(r(t, function (t, e) {
            if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");return t;
          }).join("/"));
        }, n.relative = function (t, e) {
          function r(t) {
            for (var e = 0; e < t.length && "" === t[e]; e++);for (var n = t.length - 1; n >= 0 && "" === t[n]; n--);return e > n ? [] : t.slice(e, n - e + 1);
          }t = n.resolve(t).substr(1), e = n.resolve(e).substr(1);for (var i = r(t.split("/")), o = r(e.split("/")), u = Math.min(i.length, o.length), s = u, a = 0; a < u; a++) if (i[a] !== o[a]) {
            s = a;break;
          }for (var c = [], a = s; a < i.length; a++) c.push("..");return c = c.concat(o.slice(s)), c.join("/");
        }, n.sep = "/", n.delimiter = ":", n.dirname = function (t) {
          var e = o(t),
              n = e[0],
              r = e[1];return n || r ? (r && (r = r.substr(0, r.length - 1)), n + r) : ".";
        }, n.basename = function (t, e) {
          var n = o(t)[2];return e && n.substr(-1 * e.length) === e && (n = n.substr(0, n.length - e.length)), n;
        }, n.extname = function (t) {
          return o(t)[3];
        };var u = "b" === "ab".substr(-1) ? function (t, e, n) {
          return t.substr(e, n);
        } : function (t, e, n) {
          return e < 0 && (e = t.length + e), t.substr(e, n);
        };
      }).call(this, t("_process"));
    }, { _process: 29 }], 26: [function (t, e, n) {
      function r(t) {
        return void 0 !== t && (t = -1 === t.indexOf("://") ? "" : t.split("://")[0]), t;
      }function i(t) {
        var e = r(t),
            n = o[e];if (void 0 === n) {
          if ("" !== e) throw new Error("Unsupported scheme: " + e);n = u;
        }return n;
      }var o = { file: t("./lib/loaders/file"), http: t("./lib/loaders/http"), https: t("./lib/loaders/http") },
          u = "object" == typeof window || "function" == typeof importScripts ? o.http : o.file;"undefined" == typeof Promise && t("native-promise-only"), e.exports.load = function (t, e) {
        var n = Promise.resolve();return void 0 === e && (e = {}), n = n.then(function () {
          if (void 0 === t) throw new TypeError("location is required");if ("string" != typeof t) throw new TypeError("location must be a string");if (void 0 !== e) {
            if ("object" != typeof e) throw new TypeError("options must be an object");if (void 0 !== e.processContent && "function" != typeof e.processContent) throw new TypeError("options.processContent must be a function");
          }
        }), n = n.then(function () {
          return new Promise(function (n, r) {
            i(t).load(t, e || {}, function (t, e) {
              t ? r(t) : n(e);
            });
          });
        }).then(function (t) {
          return e.processContent ? new Promise(function (n, r) {
            e.processContent("object" == typeof t ? t : { text: t }, function (t, e) {
              t ? r(t) : n(e);
            });
          }) : "object" == typeof t ? t.text : t;
        });
      };
    }, { "./lib/loaders/file": 27, "./lib/loaders/http": 28, "native-promise-only": 24 }], 27: [function (t, e, n) {
      var r = new TypeError("The 'file' scheme is not supported in the browser");e.exports.getBase = function () {
        throw r;
      }, e.exports.load = function () {
        var t = arguments[arguments.length - 1];if ("function" != typeof t) throw r;t(r);
      };
    }, {}], 28: [function (t, e, n) {
      var r = t("superagent"),
          i = ["delete", "get", "head", "patch", "post", "put"];e.exports.load = function (t, e, n) {
        function o(t, e) {
          t ? n(t) : ("function" == typeof e.buffer && e.buffer(!0), e.end(function (t, e) {
            t ? n(t) : n(void 0, e);
          }));
        }var u,
            s,
            a = e.method ? e.method.toLowerCase() : "get";if (void 0 !== e.method ? "string" != typeof e.method ? u = new TypeError("options.method must be a string") : -1 === i.indexOf(e.method) && (u = new TypeError("options.method must be one of the following: " + i.slice(0, i.length - 1).join(", ") + " or " + i[i.length - 1])) : void 0 !== e.prepareRequest && "function" != typeof e.prepareRequest && (u = new TypeError("options.prepareRequest must be a function")), u) n(u);else if (s = r["delete" === a ? "del" : a](t), e.prepareRequest) try {
          e.prepareRequest(s, o);
        } catch (t) {
          n(t);
        } else o(void 0, s);
      };
    }, { superagent: 34 }], 29: [function (t, e, n) {
      function r() {
        throw new Error("setTimeout has not been defined");
      }function i() {
        throw new Error("clearTimeout has not been defined");
      }function o(t) {
        if (l === setTimeout) return setTimeout(t, 0);if ((l === r || !l) && setTimeout) return l = setTimeout, setTimeout(t, 0);try {
          return l(t, 0);
        } catch (e) {
          try {
            return l.call(null, t, 0);
          } catch (e) {
            return l.call(this, t, 0);
          }
        }
      }function u(t) {
        if (h === clearTimeout) return clearTimeout(t);if ((h === i || !h) && clearTimeout) return h = clearTimeout, clearTimeout(t);try {
          return h(t);
        } catch (e) {
          try {
            return h.call(null, t);
          } catch (e) {
            return h.call(this, t);
          }
        }
      }function s() {
        _ && d && (_ = !1, d.length ? v = d.concat(v) : y = -1, v.length && a());
      }function a() {
        if (!_) {
          var t = o(s);_ = !0;for (var e = v.length; e;) {
            for (d = v, v = []; ++y < e;) d && d[y].run();y = -1, e = v.length;
          }d = null, _ = !1, u(t);
        }
      }function c(t, e) {
        this.fun = t, this.array = e;
      }function f() {}var l,
          h,
          p = e.exports = {};!function () {
        try {
          l = "function" == typeof setTimeout ? setTimeout : r;
        } catch (t) {
          l = r;
        }try {
          h = "function" == typeof clearTimeout ? clearTimeout : i;
        } catch (t) {
          h = i;
        }
      }();var d,
          v = [],
          _ = !1,
          y = -1;p.nextTick = function (t) {
        var e = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];v.push(new c(t, e)), 1 !== v.length || _ || o(a);
      }, c.prototype.run = function () {
        this.fun.apply(null, this.array);
      }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = f, p.addListener = f, p.once = f, p.off = f, p.removeListener = f, p.removeAllListeners = f, p.emit = f, p.binding = function (t) {
        throw new Error("process.binding is not supported");
      }, p.cwd = function () {
        return "/";
      }, p.chdir = function (t) {
        throw new Error("process.chdir is not supported");
      }, p.umask = function () {
        return 0;
      };
    }, {}], 30: [function (t, e, n) {
      function r(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }e.exports = function (t, e, n, o) {
        e = e || "&", n = n || "=";var u = {};if ("string" != typeof t || 0 === t.length) return u;t = t.split(e);var s = 1e3;o && "number" == typeof o.maxKeys && (s = o.maxKeys);var a = t.length;s > 0 && a > s && (a = s);for (var c = 0; c < a; ++c) {
          var f,
              l,
              h,
              p,
              d = t[c].replace(/\+/g, "%20"),
              v = d.indexOf(n);v >= 0 ? (f = d.substr(0, v), l = d.substr(v + 1)) : (f = d, l = ""), h = decodeURIComponent(f), p = decodeURIComponent(l), r(u, h) ? i(u[h]) ? u[h].push(p) : u[h] = [u[h], p] : u[h] = p;
        }return u;
      };var i = Array.isArray || function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      };
    }, {}], 31: [function (t, e, n) {
      function r(t, e) {
        if (t.map) return t.map(e);for (var n = [], r = 0; r < t.length; r++) n.push(e(t[r], r));return n;
      }var i = function (t) {
        switch (typeof t) {case "string":
            return t;case "boolean":
            return t ? "true" : "false";case "number":
            return isFinite(t) ? t : "";default:
            return "";}
      };e.exports = function (t, e, n, s) {
        return e = e || "&", n = n || "=", null === t && (t = void 0), "object" == typeof t ? r(u(t), function (u) {
          var s = encodeURIComponent(i(u)) + n;return o(t[u]) ? r(t[u], function (t) {
            return s + encodeURIComponent(i(t));
          }).join(e) : s + encodeURIComponent(i(t[u]));
        }).join(e) : s ? encodeURIComponent(i(s)) + n + encodeURIComponent(i(t)) : "";
      };var o = Array.isArray || function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      },
          u = Object.keys || function (t) {
        var e = [];for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.push(n);return e;
      };
    }, {}], 32: [function (t, e, n) {
      n.decode = n.parse = t("./decode"), n.encode = n.stringify = t("./encode");
    }, { "./decode": 30, "./encode": 31 }], 33: [function (t, e, n) {
      e.exports = function (t) {
        var e = /^\\\\\?\\/.test(t),
            n = /[^\x00-\x80]+/.test(t);return e || n ? t : t.replace(/\\/g, "/");
      };
    }, {}], 34: [function (t, e, n) {
      function r() {}function i(t) {
        if (!v(t)) return t;var e = [];for (var n in t) o(e, n, t[n]);return e.join("&");
      }function o(t, e, n) {
        if (null != n) {
          if (Array.isArray(n)) n.forEach(function (n) {
            o(t, e, n);
          });else if (v(n)) for (var r in n) o(t, e + "[" + r + "]", n[r]);else t.push(encodeURIComponent(e) + "=" + encodeURIComponent(n));
        } else null === n && t.push(encodeURIComponent(e));
      }function u(t) {
        for (var e, n, r = {}, i = t.split("&"), o = 0, u = i.length; o < u; ++o) e = i[o], n = e.indexOf("="), -1 == n ? r[decodeURIComponent(e)] = "" : r[decodeURIComponent(e.slice(0, n))] = decodeURIComponent(e.slice(n + 1));return r;
      }function s(t) {
        var e,
            n,
            r,
            i,
            o = t.split(/\r?\n/),
            u = {};o.pop();for (var s = 0, a = o.length; s < a; ++s) n = o[s], e = n.indexOf(":"), r = n.slice(0, e).toLowerCase(), i = b(n.slice(e + 1)), u[r] = i;return u;
      }function a(t) {
        return (/[\/+]json\b/.test(t)
        );
      }function c(t) {
        this.req = t, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;var e = this.xhr.status;1223 === e && (e = 204), this._setStatusProperties(e), this.header = this.headers = s(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && t._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
      }function f(t, e) {
        var n = this;this._query = this._query || [], this.method = t, this.url = e, this.header = {}, this._header = {}, this.on("end", function () {
          var t = null,
              e = null;try {
            e = new c(n);
          } catch (e) {
            return t = new Error("Parser is unable to parse the response"), t.parse = !0, t.original = e, n.xhr ? (t.rawResponse = void 0 === n.xhr.responseType ? n.xhr.responseText : n.xhr.response, t.status = n.xhr.status ? n.xhr.status : null, t.statusCode = t.status) : (t.rawResponse = null, t.status = null), n.callback(t);
          }n.emit("response", e);var r;try {
            n._isResponseOK(e) || (r = new Error(e.statusText || "Unsuccessful HTTP response"), r.original = t, r.response = e, r.status = e.status);
          } catch (t) {
            r = t;
          }r ? n.callback(r, e) : n.callback(null, e);
        });
      }function l(t, e, n) {
        var r = m("DELETE", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      }var h;"undefined" != typeof window ? h = window : "undefined" != typeof self ? h = self : (console.warn("Using browser-only version of superagent in non-browser environment"), h = this);var p = t("component-emitter"),
          d = t("./request-base"),
          v = t("./is-object"),
          _ = t("./is-function"),
          y = t("./response-base"),
          g = t("./should-retry"),
          m = n = e.exports = function (t, e) {
        return "function" == typeof e ? new n.Request("GET", t).end(e) : 1 == arguments.length ? new n.Request("GET", t) : new n.Request(t, e);
      };n.Request = f, m.getXHR = function () {
        if (!(!h.XMLHttpRequest || h.location && "file:" == h.location.protocol && h.ActiveXObject)) return new XMLHttpRequest();try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (t) {}try {
          return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (t) {}try {
          return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (t) {}try {
          return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (t) {}throw Error("Browser-only verison of superagent could not find XHR");
      };var b = "".trim ? function (t) {
        return t.trim();
      } : function (t) {
        return t.replace(/(^\s*|\s*$)/g, "");
      };m.serializeObject = i, m.parseString = u, m.types = { html: "text/html", json: "application/json", xml: "application/xml", urlencoded: "application/x-www-form-urlencoded", form: "application/x-www-form-urlencoded", "form-data": "application/x-www-form-urlencoded" }, m.serialize = { "application/x-www-form-urlencoded": i, "application/json": JSON.stringify }, m.parse = { "application/x-www-form-urlencoded": u, "application/json": JSON.parse }, y(c.prototype), c.prototype._parseBody = function (t) {
        var e = m.parse[this.type];return this.req._parser ? this.req._parser(this, t) : (!e && a(this.type) && (e = m.parse["application/json"]), e && t && (t.length || t instanceof Object) ? e(t) : null);
      }, c.prototype.toError = function () {
        var t = this.req,
            e = t.method,
            n = t.url,
            r = "cannot " + e + " " + n + " (" + this.status + ")",
            i = new Error(r);return i.status = this.status, i.method = e, i.url = n, i;
      }, m.Response = c, p(f.prototype), d(f.prototype), f.prototype.type = function (t) {
        return this.set("Content-Type", m.types[t] || t), this;
      }, f.prototype.accept = function (t) {
        return this.set("Accept", m.types[t] || t), this;
      }, f.prototype.auth = function (t, e, n) {
        switch ("object" == typeof e && null !== e && (n = e), n || (n = { type: "function" == typeof btoa ? "basic" : "auto" }), n.type) {case "basic":
            this.set("Authorization", "Basic " + btoa(t + ":" + e));break;case "auto":
            this.username = t, this.password = e;break;case "bearer":
            this.set("Authorization", "Bearer " + t);}return this;
      }, f.prototype.query = function (t) {
        return "string" != typeof t && (t = i(t)), t && this._query.push(t), this;
      }, f.prototype.attach = function (t, e, n) {
        if (e) {
          if (this._data) throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t, e, n || e.name);
        }return this;
      }, f.prototype._getFormData = function () {
        return this._formData || (this._formData = new h.FormData()), this._formData;
      }, f.prototype.callback = function (t, e) {
        if (this._maxRetries && this._retries++ < this._maxRetries && g(t, e)) return this._retry();var n = this._callback;this.clearTimeout(), t && (this._maxRetries && (t.retries = this._retries - 1), this.emit("error", t)), n(t, e);
      }, f.prototype.crossDomainError = function () {
        var t = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain = !0, t.status = this.status, t.method = this.method, t.url = this.url, this.callback(t);
      }, f.prototype.buffer = f.prototype.ca = f.prototype.agent = function () {
        return console.warn("This is not supported in browser version of superagent"), this;
      }, f.prototype.pipe = f.prototype.write = function () {
        throw Error("Streaming is not supported in browser version of superagent");
      }, f.prototype._appendQueryString = function () {
        var t = this._query.join("&");if (t && (this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + t), this._sort) {
          var e = this.url.indexOf("?");if (e >= 0) {
            var n = this.url.substring(e + 1).split("&");_(this._sort) ? n.sort(this._sort) : n.sort(), this.url = this.url.substring(0, e) + "?" + n.join("&");
          }
        }
      }, f.prototype._isHost = function (t) {
        return t && "object" == typeof t && !Array.isArray(t) && "[object Object]" !== Object.prototype.toString.call(t);
      }, f.prototype.end = function (t) {
        return this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = t || r, this._appendQueryString(), this._end();
      }, f.prototype._end = function () {
        var t = this,
            e = this.xhr = m.getXHR(),
            n = this._formData || this._data;this._setTimeouts(), e.onreadystatechange = function () {
          var n = e.readyState;if (n >= 2 && t._responseTimeoutTimer && clearTimeout(t._responseTimeoutTimer), 4 == n) {
            var r;try {
              r = e.status;
            } catch (t) {
              r = 0;
            }if (!r) {
              if (t.timedout || t._aborted) return;return t.crossDomainError();
            }t.emit("end");
          }
        };var r = function (e, n) {
          n.total > 0 && (n.percent = n.loaded / n.total * 100), n.direction = e, t.emit("progress", n);
        };if (this.hasListeners("progress")) try {
          e.onprogress = r.bind(null, "download"), e.upload && (e.upload.onprogress = r.bind(null, "upload"));
        } catch (t) {}try {
          this.username && this.password ? e.open(this.method, this.url, !0, this.username, this.password) : e.open(this.method, this.url, !0);
        } catch (t) {
          return this.callback(t);
        }if (this._withCredentials && (e.withCredentials = !0), !this._formData && "GET" != this.method && "HEAD" != this.method && "string" != typeof n && !this._isHost(n)) {
          var i = this._header["content-type"],
              o = this._serializer || m.serialize[i ? i.split(";")[0] : ""];!o && a(i) && (o = m.serialize["application/json"]), o && (n = o(n));
        }for (var u in this.header) null != this.header[u] && this.header.hasOwnProperty(u) && e.setRequestHeader(u, this.header[u]);return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send(void 0 !== n ? n : null), this;
      }, m.get = function (t, e, n) {
        var r = m("GET", t);return "function" == typeof e && (n = e, e = null), e && r.query(e), n && r.end(n), r;
      }, m.head = function (t, e, n) {
        var r = m("HEAD", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      }, m.options = function (t, e, n) {
        var r = m("OPTIONS", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      }, m.del = l, m.delete = l, m.patch = function (t, e, n) {
        var r = m("PATCH", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      }, m.post = function (t, e, n) {
        var r = m("POST", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      }, m.put = function (t, e, n) {
        var r = m("PUT", t);return "function" == typeof e && (n = e, e = null), e && r.send(e), n && r.end(n), r;
      };
    }, { "./is-function": 35, "./is-object": 36, "./request-base": 37, "./response-base": 38, "./should-retry": 39, "component-emitter": 2 }], 35: [function (t, e, n) {
      function r(t) {
        return "[object Function]" === (i(t) ? Object.prototype.toString.call(t) : "");
      }var i = t("./is-object");e.exports = r;
    }, { "./is-object": 36 }], 36: [function (t, e, n) {
      function r(t) {
        return null !== t && "object" == typeof t;
      }e.exports = r;
    }, {}], 37: [function (t, e, n) {
      function r(t) {
        if (t) return i(t);
      }function i(t) {
        for (var e in r.prototype) t[e] = r.prototype[e];return t;
      }var o = t("./is-object");e.exports = r, r.prototype.clearTimeout = function () {
        return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, this;
      }, r.prototype.parse = function (t) {
        return this._parser = t, this;
      }, r.prototype.responseType = function (t) {
        return this._responseType = t, this;
      }, r.prototype.serialize = function (t) {
        return this._serializer = t, this;
      }, r.prototype.timeout = function (t) {
        if (!t || "object" != typeof t) return this._timeout = t, this._responseTimeout = 0, this;for (var e in t) switch (e) {case "deadline":
            this._timeout = t.deadline;break;case "response":
            this._responseTimeout = t.response;break;default:
            console.warn("Unknown timeout option", e);}return this;
      }, r.prototype.retry = function (t) {
        return 0 !== arguments.length && !0 !== t || (t = 1), t <= 0 && (t = 0), this._maxRetries = t, this._retries = 0, this;
      }, r.prototype._retry = function () {
        return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this._end();
      }, r.prototype.then = function (t, e) {
        if (!this._fullfilledPromise) {
          var n = this;this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function (t, e) {
            n.end(function (n, r) {
              n ? e(n) : t(r);
            });
          });
        }return this._fullfilledPromise.then(t, e);
      }, r.prototype.catch = function (t) {
        return this.then(void 0, t);
      }, r.prototype.use = function (t) {
        return t(this), this;
      }, r.prototype.ok = function (t) {
        if ("function" != typeof t) throw Error("Callback required");return this._okCallback = t, this;
      }, r.prototype._isResponseOK = function (t) {
        return !!t && (this._okCallback ? this._okCallback(t) : t.status >= 200 && t.status < 300);
      }, r.prototype.get = function (t) {
        return this._header[t.toLowerCase()];
      }, r.prototype.getHeader = r.prototype.get, r.prototype.set = function (t, e) {
        if (o(t)) {
          for (var n in t) this.set(n, t[n]);return this;
        }return this._header[t.toLowerCase()] = e, this.header[t] = e, this;
      }, r.prototype.unset = function (t) {
        return delete this._header[t.toLowerCase()], delete this.header[t], this;
      }, r.prototype.field = function (t, e) {
        if (null === t || void 0 === t) throw new Error(".field(name, val) name can not be empty");if (this._data && console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"), o(t)) {
          for (var n in t) this.field(n, t[n]);return this;
        }if (Array.isArray(e)) {
          for (var r in e) this.field(t, e[r]);return this;
        }if (null === e || void 0 === e) throw new Error(".field(name, val) val can not be empty");return "boolean" == typeof e && (e = "" + e), this._getFormData().append(t, e), this;
      }, r.prototype.abort = function () {
        return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
      }, r.prototype.withCredentials = function (t) {
        return void 0 == t && (t = !0), this._withCredentials = t, this;
      }, r.prototype.redirects = function (t) {
        return this._maxRedirects = t, this;
      }, r.prototype.toJSON = function () {
        return { method: this.method, url: this.url, data: this._data, headers: this._header };
      }, r.prototype.send = function (t) {
        var e = o(t),
            n = this._header["content-type"];if (this._formData && console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"), e && !this._data) Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {});else if (t && this._data && this._isHost(this._data)) throw Error("Can't merge these send calls");if (e && o(this._data)) for (var r in t) this._data[r] = t[r];else "string" == typeof t ? (n || this.type("form"), n = this._header["content-type"], this._data = "application/x-www-form-urlencoded" == n ? this._data ? this._data + "&" + t : t : (this._data || "") + t) : this._data = t;return !e || this._isHost(t) ? this : (n || this.type("json"), this);
      }, r.prototype.sortQuery = function (t) {
        return this._sort = void 0 === t || t, this;
      }, r.prototype._timeoutError = function (t, e, n) {
        if (!this._aborted) {
          var r = new Error(t + e + "ms exceeded");r.timeout = e, r.code = "ECONNABORTED", r.errno = n, this.timedout = !0, this.abort(), this.callback(r);
        }
      }, r.prototype._setTimeouts = function () {
        var t = this;this._timeout && !this._timer && (this._timer = setTimeout(function () {
          t._timeoutError("Timeout of ", t._timeout, "ETIME");
        }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
          t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
        }, this._responseTimeout));
      };
    }, { "./is-object": 36 }], 38: [function (t, e, n) {
      function r(t) {
        if (t) return i(t);
      }function i(t) {
        for (var e in r.prototype) t[e] = r.prototype[e];return t;
      }var o = t("./utils");e.exports = r, r.prototype.get = function (t) {
        return this.header[t.toLowerCase()];
      }, r.prototype._setHeaderProperties = function (t) {
        var e = t["content-type"] || "";this.type = o.type(e);var n = o.params(e);for (var r in n) this[r] = n[r];this.links = {};try {
          t.link && (this.links = o.parseLinks(t.link));
        } catch (t) {}
      }, r.prototype._setStatusProperties = function (t) {
        var e = t / 100 | 0;this.status = this.statusCode = t, this.statusType = e, this.info = 1 == e, this.ok = 2 == e, this.redirect = 3 == e, this.clientError = 4 == e, this.serverError = 5 == e, this.error = (4 == e || 5 == e) && this.toError(), this.accepted = 202 == t, this.noContent = 204 == t, this.badRequest = 400 == t, this.unauthorized = 401 == t, this.notAcceptable = 406 == t, this.forbidden = 403 == t, this.notFound = 404 == t;
      };
    }, { "./utils": 40 }], 39: [function (t, e, n) {
      var r = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"];e.exports = function (t, e) {
        return !!(t && t.code && ~r.indexOf(t.code)) || !!(e && e.status && e.status >= 500) || !!(t && "timeout" in t && "ECONNABORTED" == t.code) || !!(t && "crossDomain" in t);
      };
    }, {}], 40: [function (t, e, n) {
      n.type = function (t) {
        return t.split(/ *; */).shift();
      }, n.params = function (t) {
        return t.split(/ *; */).reduce(function (t, e) {
          var n = e.split(/ *= */),
              r = n.shift(),
              i = n.shift();return r && i && (t[r] = i), t;
        }, {});
      }, n.parseLinks = function (t) {
        return t.split(/ *, */).reduce(function (t, e) {
          var n = e.split(/ *; */),
              r = n[0].slice(1, -1);return t[n[1].split(/ *= */)[1].slice(1, -1)] = r, t;
        }, {});
      }, n.cleanHeader = function (t, e) {
        return delete t["content-type"], delete t["content-length"], delete t["transfer-encoding"], delete t.host, e && delete t.cookie, t;
      };
    }, {}], 41: [function (e, n, r) {
      !function (e, i) {
        "object" == typeof r && void 0 !== n ? i(r) : i(e.URI = e.URI || {});
      }(this, function (t) {
        function e() {
          for (var t = arguments.length, e = Array(t), n = 0; n < t; n++) e[n] = arguments[n];if (e.length > 1) {
            e[0] = e[0].slice(0, -1);for (var r = e.length - 1, i = 1; i < r; ++i) e[i] = e[i].slice(1, -1);return e[r] = e[r].slice(1), e.join("");
          }return e[0];
        }function n(t) {
          return "(?:" + t + ")";
        }function r(t) {
          return void 0 === t ? "undefined" : null === t ? "null" : Object.prototype.toString.call(t).split(" ").pop().split("]").shift().toLowerCase();
        }function i(t) {
          return t.toUpperCase();
        }function o(t) {
          return void 0 !== t && null !== t ? t instanceof Array ? t : "number" != typeof t.length || t.split || t.setInterval || t.call ? [t] : Array.prototype.slice.call(t) : [];
        }function u(t) {
          var r = e("[0-9]", "[A-Fa-f]"),
              i = n(n("%[EFef]" + r + "%" + r + r + "%" + r + r) + "|" + n("%[89A-Fa-f]" + r + "%" + r + r) + "|" + n("%" + r + r)),
              o = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
              u = e("[\\:\\/\\?\\#\\[\\]\\@]", o),
              s = t ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]",
              a = t ? "[\\uE000-\\uF8FF]" : "[]",
              c = e("[A-Za-z]", "[0-9]", "[\\-\\.\\_\\~]", s),
              f = n("[A-Za-z]" + e("[A-Za-z]", "[0-9]", "[\\+\\-\\.]") + "*"),
              l = n(n(i + "|" + e(c, o, "[\\:]")) + "*"),
              h = n(n("25[0-5]") + "|" + n("2[0-4][0-9]") + "|" + n("1[0-9][0-9]") + "|" + n("[1-9][0-9]") + "|[0-9]"),
              p = n(h + "\\." + h + "\\." + h + "\\." + h),
              d = n(r + "{1,4}"),
              v = n(n(d + "\\:" + d) + "|" + p),
              _ = n(n(d + "\\:") + "{6}" + v),
              y = n("\\:\\:" + n(d + "\\:") + "{5}" + v),
              g = n(n(d) + "?\\:\\:" + n(d + "\\:") + "{4}" + v),
              m = n(n(n(d + "\\:") + "{0,1}" + d) + "?\\:\\:" + n(d + "\\:") + "{3}" + v),
              b = n(n(n(d + "\\:") + "{0,2}" + d) + "?\\:\\:" + n(d + "\\:") + "{2}" + v),
              w = n(n(n(d + "\\:") + "{0,3}" + d) + "?\\:\\:" + d + "\\:" + v),
              E = n(n(n(d + "\\:") + "{0,4}" + d) + "?\\:\\:" + v),
              x = n(n(n(d + "\\:") + "{0,5}" + d) + "?\\:\\:" + d),
              j = n(n(n(d + "\\:") + "{0,6}" + d) + "?\\:\\:"),
              O = n([_, y, g, m, b, w, E, x, j].join("|")),
              C = n("[vV]" + r + "+\\." + e(c, o, "[\\:]") + "+"),
              A = n(n(i + "|" + e(c, o)) + "*"),
              I = n(i + "|" + e(c, o, "[\\:\\@]")),
              N = n(n(i + "|" + e(c, o, "[\\@]")) + "+"),
              M = (n(n(I + "|" + e("[\\/\\?]", a)) + "*"));
return { NOT_SCHEME: new RegExp(e("[^]", "[A-Za-z]", "[0-9]", "[\\+\\-\\.]"), "g"), NOT_USERINFO: new RegExp(e("[^\\%\\:]", c, o), "g"), NOT_HOST: new RegExp(e("[^\\%\\[\\]\\:]", c, o), "g"), NOT_PATH: new RegExp(e("[^\\%\\/\\:\\@]", c, o), "g"), NOT_PATH_NOSCHEME: new RegExp(e("[^\\%\\/\\@]", c, o), "g"), NOT_QUERY: new RegExp(e("[^\\%]", c, o, "[\\:\\@\\/\\?]", a), "g"), NOT_FRAGMENT: new RegExp(e("[^\\%]", c, o, "[\\:\\@\\/\\?]"), "g"), ESCAPE: new RegExp(e("[^]", c, o), "g"), UNRESERVED: new RegExp(c, "g"), OTHER_CHARS: new RegExp(e("[^\\%]", c, u), "g"), PCT_ENCODED: new RegExp(i, "g"), IPV6ADDRESS: new RegExp("\\[?(" + O + ")\\]?", "g") };
        }function s(t) {
          throw new RangeError(I[t]);
        }function a(t, e) {
          for (var n = [], r = t.length; r--;) n[r] = e(t[r]);return n;
        }function c(t, e) {
          var n = t.split("@"),
              r = "";return n.length > 1 && (r = n[0] + "@", t = n[1]), t = t.replace(P, "."), r + a(t.split("."), e).join(".");
        }function f(t) {
          for (var e = [], n = 0, r = t.length; n < r;) {
            var i = t.charCodeAt(n++);if (i >= 55296 && i <= 56319 && n < r) {
              var o = t.charCodeAt(n++);56320 == (64512 & o) ? e.push(((1023 & i) << 10) + (1023 & o) + 65536) : (e.push(i), n--);
            } else e.push(i);
          }return e;
        }function l(t) {
          var e = t.charCodeAt(0);return e < 16 ? "%0" + e.toString(16).toUpperCase() : e < 128 ? "%" + e.toString(16).toUpperCase() : e < 2048 ? "%" + (e >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase() : "%" + (e >> 12 | 224).toString(16).toUpperCase() + "%" + (e >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & e | 128).toString(16).toUpperCase();
        }function h(t) {
          for (var e = "", n = 0, r = t.length; n < r;) {
            var i = parseInt(t.substr(n + 1, 2), 16);if (i < 128) e += String.fromCharCode(i), n += 3;else if (i >= 194 && i < 224) {
              if (r - n >= 6) {
                var o = parseInt(t.substr(n + 4, 2), 16);e += String.fromCharCode((31 & i) << 6 | 63 & o);
              } else e += t.substr(n, 6);n += 6;
            } else if (i >= 224) {
              if (r - n >= 9) {
                var u = parseInt(t.substr(n + 4, 2), 16),
                    s = parseInt(t.substr(n + 7, 2), 16);e += String.fromCharCode((15 & i) << 12 | (63 & u) << 6 | 63 & s);
              } else e += t.substr(n, 9);n += 9;
            } else e += t.substr(n, 3), n += 3;
          }return e;
        }function p(t, e) {
          function n(t) {
            var n = h(t);return n.match(e.UNRESERVED) ? n : t;
          }return t.scheme && (t.scheme = String(t.scheme).replace(e.PCT_ENCODED, n).toLowerCase().replace(e.NOT_SCHEME, "")), void 0 !== t.userinfo && (t.userinfo = String(t.userinfo).replace(e.PCT_ENCODED, n).replace(e.NOT_USERINFO, l).replace(e.PCT_ENCODED, i)), void 0 !== t.host && (t.host = String(t.host).replace(e.PCT_ENCODED, n).toLowerCase().replace(e.NOT_HOST, l).replace(e.PCT_ENCODED, i)), void 0 !== t.path && (t.path = String(t.path).replace(e.PCT_ENCODED, n).replace(t.scheme ? e.NOT_PATH : e.NOT_PATH_NOSCHEME, l).replace(e.PCT_ENCODED, i)), void 0 !== t.query && (t.query = String(t.query).replace(e.PCT_ENCODED, n).replace(e.NOT_QUERY, l).replace(e.PCT_ENCODED, i)), void 0 !== t.fragment && (t.fragment = String(t.fragment).replace(e.PCT_ENCODED, n).replace(e.NOT_FRAGMENT, l).replace(e.PCT_ENCODED, i)), t;
        }function d(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              n = {},
              r = !1 !== e.iri ? C : O;"suffix" === e.reference && (t = (e.scheme ? e.scheme + ":" : "") + "//" + t);var i = t.match(W);if (i) {
            G ? (n.scheme = i[1], n.userinfo = i[3], n.host = i[4], n.port = parseInt(i[5], 10), n.path = i[6] || "", n.query = i[7], n.fragment = i[8], isNaN(n.port) && (n.port = i[5])) : (n.scheme = i[1] || void 0, n.userinfo = -1 !== t.indexOf("@") ? i[3] : void 0, n.host = -1 !== t.indexOf("//") ? i[4] : void 0, n.port = parseInt(i[5], 10), n.path = i[6] || "", n.query = -1 !== t.indexOf("?") ? i[7] : void 0, n.fragment = -1 !== t.indexOf("#") ? i[8] : void 0, isNaN(n.port) && (n.port = t.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? i[4] : void 0)), n.host && (n.host = n.host.replace(r.IPV6ADDRESS, "$1")), void 0 !== n.scheme || void 0 !== n.userinfo || void 0 !== n.host || void 0 !== n.port || n.path || void 0 !== n.query ? void 0 === n.scheme ? n.reference = "relative" : void 0 === n.fragment ? n.reference = "absolute" : n.reference = "uri" : n.reference = "same-document", e.reference && "suffix" !== e.reference && e.reference !== n.reference && (n.error = n.error || "URI is not a " + e.reference + " reference.");var o = B[(e.scheme || n.scheme || "").toLowerCase()];if (e.unicodeSupport || o && o.unicodeSupport) p(n, r);else {
              if (n.host && (e.domainHost || o && o.domainHost)) try {
                n.host = $.toASCII(n.host.replace(r.PCT_ENCODED, h).toLowerCase());
              } catch (t) {
                n.error = n.error || "Host's domain name can not be converted to ASCII via punycode: " + t;
              }p(n, O);
            }o && o.parse && o.parse(n, e);
          } else n.error = n.error || "URI can not be parsed.";return n;
        }function v(t, e) {
          var n = !1 !== e.iri ? C : O,
              r = [];return void 0 !== t.userinfo && (r.push(t.userinfo), r.push("@")), void 0 !== t.host && r.push(String(t.host).replace(n.IPV6ADDRESS, "[$1]")), "number" == typeof t.port && (r.push(":"), r.push(t.port.toString(10))), r.length ? r.join("") : void 0;
        }function _(t) {
          for (var e = []; t.length;) if (t.match(Z)) t = t.replace(Z, "");else if (t.match(V)) t = t.replace(V, "/");else if (t.match(J)) t = t.replace(J, "/"), e.pop();else if ("." === t || ".." === t) t = "";else {
            var n = t.match(X);if (!n) throw new Error("Unexpected dot segment condition");var r = n[0];t = t.slice(r.length), e.push(r);
          }return e.join("");
        }function y(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              n = e.iri ? C : O,
              r = [],
              i = B[(e.scheme || t.scheme || "").toLowerCase()];if (i && i.serialize && i.serialize(t, e), t.host) if (n.IPV6ADDRESS.test(t.host)) ;else if (e.domainHost || i && i.domainHost) try {
            t.host = e.iri ? $.toUnicode(t.host) : $.toASCII(t.host.replace(n.PCT_ENCODED, h).toLowerCase());
          } catch (n) {
            t.error = t.error || "Host's domain name can not be converted to " + (e.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
          }p(t, n), "suffix" !== e.reference && t.scheme && (r.push(t.scheme), r.push(":"));var o = v(t, e);if (void 0 !== o && ("suffix" !== e.reference && r.push("//"), r.push(o), t.path && "/" !== t.path.charAt(0) && r.push("/")), void 0 !== t.path) {
            var u = t.path;e.absolutePath || i && i.absolutePath || (u = _(u)), void 0 === o && (u = u.replace(/^\/\//, "/%2F")), r.push(u);
          }return void 0 !== t.query && (r.push("?"), r.push(t.query)), void 0 !== t.fragment && (r.push("#"), r.push(t.fragment)), r.join("");
        }function g(t, e) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
              r = arguments[3],
              i = {};return r || (t = d(y(t, n), n), e = d(y(e, n), n)), n = n || {}, !n.tolerant && e.scheme ? (i.scheme = e.scheme, i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = _(e.path || ""), i.query = e.query) : (void 0 !== e.userinfo || void 0 !== e.host || void 0 !== e.port ? (i.userinfo = e.userinfo, i.host = e.host, i.port = e.port, i.path = _(e.path || ""), i.query = e.query) : (e.path ? ("/" === e.path.charAt(0) ? i.path = _(e.path) : (void 0 === t.userinfo && void 0 === t.host && void 0 === t.port || t.path ? t.path ? i.path = t.path.slice(0, t.path.lastIndexOf("/") + 1) + e.path : i.path = e.path : i.path = "/" + e.path, i.path = _(i.path)), i.query = e.query) : (i.path = t.path, void 0 !== e.query ? i.query = e.query : i.query = t.query), i.userinfo = t.userinfo, i.host = t.host, i.port = t.port), i.scheme = t.scheme), i.fragment = e.fragment, i;
        }function m(t, e, n) {
          return y(g(d(t, n), d(e, n), n, !0), n);
        }function b(t, e) {
          return "string" == typeof t ? t = y(d(t, e), e) : "object" === r(t) && (t = d(y(t, e), e)), t;
        }function w(t, e, n) {
          return "string" == typeof t ? t = y(d(t, n), n) : "object" === r(t) && (t = y(t, n)), "string" == typeof e ? e = y(d(e, n), n) : "object" === r(e) && (e = y(e, n)), t === e;
        }function E(t, e) {
          return t && t.toString().replace(e && e.iri ? C.ESCAPE : O.ESCAPE, l);
        }function x(t, e) {
          return t && t.toString().replace(e && e.iri ? C.PCT_ENCODED : O.PCT_ENCODED, h);
        }function j(t) {
          var e = h(t);return e.match(it) ? e : t;
        }var O = u(!1),
            C = u(!0),
            T = function (t) {
          if (Array.isArray(t)) {
            for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];return n;
          }return Array.from(t);
        },
            A = 2147483647,
            S = /^xn--/,
            D = /[^\0-\x7E]/,
            P = /[\x2E\u3002\uFF0E\uFF61]/g,
            I = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },
            k = Math.floor,
            R = String.fromCharCode,
            N = function (t) {
          return String.fromCodePoint.apply(String, T(t));
        },
            U = function (t) {
          return t - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : 36;
        },
            F = function (t, e) {
          return t + 22 + 75 * (t < 26) - ((0 != e) << 5);
        },
            L = function (t, e, n) {
          var r = 0;for (t = n ? k(t / 700) : t >> 1, t += k(t / e); t > 455; r += 36) t = k(t / 35);return k(r + 36 * t / (t + 38));
        },
            q = function (t) {
          var e = [],
              n = t.length,
              r = 0,
              i = 128,
              o = 72,
              u = t.lastIndexOf("-");u < 0 && (u = 0);for (var a = 0; a < u; ++a) t.charCodeAt(a) >= 128 && s("not-basic"), e.push(t.charCodeAt(a));for (var c = u > 0 ? u + 1 : 0; c < n;) {
            for (var f = r, l = 1, h = 36;; h += 36) {
              c >= n && s("invalid-input");var p = U(t.charCodeAt(c++));(p >= 36 || p > k((A - r) / l)) && s("overflow"), r += p * l;var d = h <= o ? 1 : h >= o + 26 ? 26 : h - o;if (p < d) break;var v = 36 - d;l > k(A / v) && s("overflow"), l *= v;
            }var _ = e.length + 1;o = L(r - f, _, 0 == f), k(r / _) > A - i && s("overflow"), i += k(r / _), r %= _, e.splice(r++, 0, i);
          }return String.fromCodePoint.apply(String, e);
        },
            z = function (t) {
          var e = [];t = f(t);var n = t.length,
              r = 128,
              i = 0,
              o = 72,
              u = !0,
              a = !1,
              c = void 0;try {
            for (var l, h = t[Symbol.iterator](); !(u = (l = h.next()).done); u = !0) {
              var p = l.value;p < 128 && e.push(R(p));
            }
          } catch (t) {
            a = !0, c = t;
          } finally {
            try {
              !u && h.return && h.return();
            } finally {
              if (a) throw c;
            }
          }var d = e.length,
              v = d;for (d && e.push("-"); v < n;) {
            var _ = A,
                y = !0,
                g = !1,
                m = void 0;try {
              for (var b, w = t[Symbol.iterator](); !(y = (b = w.next()).done); y = !0) {
                var E = b.value;E >= r && E < _ && (_ = E);
              }
            } catch (t) {
              g = !0, m = t;
            } finally {
              try {
                !y && w.return && w.return();
              } finally {
                if (g) throw m;
              }
            }var x = v + 1;_ - r > k((A - i) / x) && s("overflow"), i += (_ - r) * x, r = _;var j = !0,
                O = !1,
                C = void 0;try {
              for (var T, S = t[Symbol.iterator](); !(j = (T = S.next()).done); j = !0) {
                var D = T.value;if (D < r && ++i > A && s("overflow"), D == r) {
                  for (var P = i, I = 36;; I += 36) {
                    var N = I <= o ? 1 : I >= o + 26 ? 26 : I - o;if (P < N) break;var U = P - N,
                        q = 36 - N;e.push(R(F(N + U % q, 0))), P = k(U / q);
                  }e.push(R(F(P, 0))), o = L(i, x, v == d), i = 0, ++v;
                }
              }
            } catch (t) {
              O = !0, C = t;
            } finally {
              try {
                !j && S.return && S.return();
              } finally {
                if (O) throw C;
              }
            }++i, ++r;
          }return e.join("");
        },
            M = function (t) {
          return c(t, function (t) {
            return S.test(t) ? q(t.slice(4).toLowerCase()) : t;
          });
        },
            H = function (t) {
          return c(t, function (t) {
            return D.test(t) ? "xn--" + z(t) : t;
          });
        },
            $ = { version: "2.1.0", ucs2: { decode: f, encode: N }, decode: q, encode: z, toASCII: H, toUnicode: M },
            B = {},
            W = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[\dA-F:.]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,
            G = void 0 === "".match(/(){0}/)[1],
            Z = /^\.\.?\//,
            V = /^\/\.(\/|$)/,
            J = /^\/\.\.(\/|$)/,
            X = /^\/?(?:.|\n)*?(?=\/|$)/,
            K = { scheme: "http", domainHost: !0, parse: function (t, e) {
            return t.host || (t.error = t.error || "HTTP URIs must have a host."), t;
          }, serialize: function (t, e) {
            return t.port !== ("https" !== String(t.scheme).toLowerCase() ? 80 : 443) && "" !== t.port || (t.port = void 0), t.path || (t.path = "/"), t;
          } },
            Y = { scheme: "https", domainHost: K.domainHost, parse: K.parse, serialize: K.serialize },
            Q = {},
            tt = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]",
            et = "[0-9A-Fa-f]",
            nt = n(n("%[EFef][0-9A-Fa-f]%" + et + et + "%" + et + et) + "|" + n("%[89A-Fa-f][0-9A-Fa-f]%" + et + et) + "|" + n("%" + et + et)),
            rt = e("[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", '[\\"\\\\]'),
            it = new RegExp(tt, "g"),
            ot = new RegExp(nt, "g"),
            ut = new RegExp(e("[^]", "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", "[\\.]", '[\\"]', rt), "g"),
            st = new RegExp(e("[^]", tt, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g"),
            at = st,
            ct = { scheme: "mailto", parse: function (t, e) {
            var n = t.to = t.path ? t.path.split(",") : [];if (t.path = void 0, t.query) {
              for (var r = !1, i = {}, o = t.query.split("&"), u = 0, s = o.length; u < s; ++u) {
                var a = o[u].split("=");switch (a[0]) {case "to":
                    for (var c = a[1].split(","), f = 0, l = c.length; f < l; ++f) n.push(c[f]);break;case "subject":
                    t.subject = x(a[1], e);break;case "body":
                    t.body = x(a[1], e);break;default:
                    r = !0, i[x(a[0], e)] = x(a[1], e);}
              }r && (t.headers = i);
            }t.query = void 0;for (var h = 0, p = n.length; h < p; ++h) {
              var d = n[h].split("@");if (d[0] = x(d[0]), e.unicodeSupport) d[1] = x(d[1], e).toLowerCase();else try {
                d[1] = $.toASCII(x(d[1], e).toLowerCase());
              } catch (e) {
                t.error = t.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
              }n[h] = d.join("@");
            }return t;
          }, serialize: function (t, e) {
            var n = o(t.to);if (n) {
              for (var r = 0, u = n.length; r < u; ++r) {
                var s = String(n[r]),
                    a = s.lastIndexOf("@"),
                    c = s.slice(0, a).replace(ot, j).replace(ot, i).replace(ut, l),
                    f = s.slice(a + 1);try {
                  f = e.iri ? $.toUnicode(f) : $.toASCII(x(f, e).toLowerCase());
                } catch (n) {
                  t.error = t.error || "Email address's domain name can not be converted to " + (e.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
                }n[r] = c + "@" + f;
              }t.path = n.join(",");
            }var h = t.headers = t.headers || {};t.subject && (h.subject = t.subject), t.body && (h.body = t.body);var p = [];for (var d in h) h[d] !== Q[d] && p.push(d.replace(ot, j).replace(ot, i).replace(st, l) + "=" + h[d].replace(ot, j).replace(ot, i).replace(at, l));return p.length && (t.query = p.join("&")), t;
          } },
            ft = new RegExp("^urn\\:((?:[0-9A-Za-z][0-9A-Za-z\\-]{1,31}))$"),
            lt = { scheme: "urn", parse: function (t, e) {
            var n = t.path && t.path.match(/^([^\:]+)\:(.*)/);if (n) {
              var r = "urn:" + n[1].toLowerCase(),
                  i = B[r];i || (i = B[r] = { scheme: r, parse: function (t, e) {
                  return t;
                }, serialize: B.urn.serialize }), t.scheme = r, t.path = n[2], t = i.parse(t, e);
            } else t.error = t.error || "URN can not be parsed.";return t;
          }, serialize: function (t, e) {
            var n = t.scheme || e.scheme;if (n && "urn" !== n) {
              var r = n.match(ft) || ["urn:" + n, n];t.scheme = "urn", t.path = r[1] + ":" + (t.path ? t.path.replace(/[\x00-\x20\\\"\&\<\>\[\]\^\`\{\|\}\~\x7F-\xFF]/g, l) : "");
            }return t;
          } },
            ht = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/,
            pt = { scheme: "urn:uuid", parse: function (t, e) {
            return e.tolerant || t.path && t.path.match(ht) || (t.error = t.error || "UUID is not valid."), t;
          }, serialize: function (t, e) {
            return e.tolerant || t.path && t.path.match(ht) ? t.path = (t.path || "").toLowerCase() : t.scheme = void 0, B.urn.serialize(t, e);
          } };B.http = K, B.https = Y, B.mailto = ct, B.urn = lt, B["urn:uuid"] = pt, t.SCHEMES = B, t.pctEncChar = l, t.pctDecChars = h, t.parse = d, t.removeDotSegments = _, t.serialize = y, t.resolveComponents = g, t.resolve = m, t.normalize = b, t.equal = w, t.escapeComponent = E, t.unescapeComponent = x, Object.defineProperty(t, "__esModule", { value: !0 });
      });
    }, {}] }, {}, [1])(1);
});

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
    try {
        return (await JsonRefs.resolveRefsAt((basePath || getCurrDir()) + file + (property ? '#/' + property : ''), {
            loaderOptions: {
                processContent(res, callback) {
                    callback(undefined, JSON.parse( // eslint-disable-line standard/no-callback-literal
                    res.text ||
                    // `.metadata` not a recognized extension, so
                    //    convert to string for JSON in Node
                    res.body.toString()));
                }
            }
        })).resolved;
    } catch (err) {
        throw err;
    }
};

const getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, lang
}) {
    const fieldSchemaIndex = schemaItems.findIndex(item => item.title === field);
    const fieldSchema = schemaItems[fieldSchemaIndex];

    const ret = {
        fieldName: getFieldAliasOrName(field)
    };

    const fieldInfo = metadataObj.fields[field];
    let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];
    if (fieldValueAliasMap) {
        if (fieldValueAliasMap.localeKey) {
            fieldValueAliasMap = getMetaProp(lang, metadataObj, fieldValueAliasMap.localeKey.split('/'), true);
        }
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
    ret.fieldSchema = fieldSchema;
    ret.fieldSchemaIndex = fieldSchemaIndex;
    ret.preferAlias = fieldInfo.prefer_alias;
    ret.lang = fieldInfo.lang;
    return ret;
};

const getBrowseFieldData = function ({
    metadataObj, schemaItems, getFieldAliasOrName, lang, callback
}) {
    metadataObj.table.browse_fields.forEach((browseFieldSetObject, i) => {
        if (typeof browseFieldSetObject === 'string') {
            browseFieldSetObject = { set: [browseFieldSetObject] };
        }
        if (!browseFieldSetObject.name) {
            browseFieldSetObject.name = browseFieldSetObject.set.join(',');
        }

        const setName = browseFieldSetObject.name;
        const fieldSets = browseFieldSetObject.set;
        const { presort } = browseFieldSetObject;
        // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
        //          as kind of fieldset

        const browseFields = fieldSets.map(field => getFieldNameAndValueAliases({
            lang,
            field, schemaItems, metadataObj,
            getFieldAliasOrName
        }));
        callback({ setName, browseFields, i, presort }); // eslint-disable-line standard/no-callback-literal
    });
};

// Todo: Incorporate other methods into this class
class Metadata {
    constructor({ metadataObj }) {
        this.metadataObj = metadataObj;
    }

    getFieldLang(field) {
        const { metadataObj } = this;
        const fields = metadataObj && metadataObj.fields;
        return fields && fields[field] && fields[field].lang;
    }

    getFieldMatchesLocale({
        namespace, preferredLocale, schemaItems,
        pluginsForWork
    }) {
        const { metadataObj } = this;
        return field => {
            const preferredLanguages = getPreferredLanguages({
                namespace, preferredLocale
            });
            if (pluginsForWork.isPluginField({ namespace, field })) {
                let [,, targetLanguage] = pluginsForWork.getPluginFieldParts({ namespace, field });
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
    return pluginName.replace(/(\^+)0/g, (n0, esc) => esc.length % 2 ? esc.slice(1) + '-' : n0).replace(/\^\^/g, '^');
};

const escapePlugin = ({ pluginName, applicableField, targetLanguage }) => {
    return escapePluginComponent(pluginName) + (applicableField ? '-' + escapePluginComponent(applicableField) : '-') + (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};

class PluginsForWork {
    constructor({ pluginsInWork, pluginFieldMappings, pluginObjects }) {
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
                onByDefault: onByDefaultDefault, lang: pluginLang, meta
            }] = this.pluginsInWork[i];
            const plugin = this.getPluginObject(pluginName);
            cb({ // eslint-disable-line standard/no-callback-literal
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
            targetLanguage, onByDefault, meta: metaApplicableField
        }]) => {
            if (Array.isArray(targetLanguage)) {
                targetLanguage.forEach(targetLanguage => {
                    cb({ applicableField, targetLanguage, onByDefault, metaApplicableField }); // eslint-disable-line standard/no-callback-literal
                });
            } else {
                cb({ applicableField, targetLanguage, onByDefault, metaApplicableField }); // eslint-disable-line standard/no-callback-literal
            }
        });
        return true;
    }
    isPluginField({ namespace, field }) {
        return field.startsWith(`${namespace}-plugin-`);
    }
    getPluginFieldParts({ namespace, field }) {
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
    const filesObj = await simpleGetJson(files);
    const dataFiles = [];
    filesObj.groups.forEach(fileGroup => {
        fileGroup.files.forEach(fileData => {
            const { file, schemaFile, metadataFile } = getFilePaths(filesObj, fileGroup, fileData);
            dataFiles.push(file, schemaFile, metadataFile);
        });
    });
    dataFiles.push(...Object.values(filesObj['plugins']).map(pl => pl.path));
    return dataFiles;
};

const getFilePaths = function getFilePaths(filesObj, fileGroup, fileData) {
    const baseDir = (filesObj.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
    const schemaBaseDir = (filesObj.schemaBaseDirectory || '') + (fileGroup.schemaBaseDirectory || '') + '/';
    const metadataBaseDir = (filesObj.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';

    const file = baseDir + fileData.file.$ref;
    const schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
    const metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';
    return { file, schemaFile, metadataFile };
};

const getWorkData = async function ({
    lang, fallbackLanguages, $p, files, allowPlugins, basePath
}) {
    const filesObj = await simpleGetJson(files);
    const localeFromFileData = lan => filesObj['localization-strings'][lan];
    const imfFile = dist({
        locales: lang.map(localeFromFileData),
        fallbackLocales: fallbackLanguages.map(localeFromFileData)
    });
    const lf = imfFile.getFormatter();

    let fileData;
    const work = $p.get('work');
    const fileGroup = filesObj.groups.find(fg => {
        fileData = fg.files.find(file => work === lf(['workNames', fg.id, file.name]));
        return Boolean(fileData);
    });

    const fp = getFilePaths(filesObj, fileGroup, fileData);
    const { file } = fp;
    let { schemaFile, metadataFile } = fp;

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

    if (typeof process !== 'undefined') {
        require('babel-polyfill');
    }
    const [schemaObj, pluginObjects] = await Promise.all([getMetadata(schemaFile, schemaProperty, basePath), getPlugins ? Promise.all(pluginPaths.map(pluginPath => {
        if (typeof process !== 'undefined') {
            pluginPath = require('path').resolve(require('path').join(process.cwd(), 'node_modules/textbrowser/server', pluginPath));
            require('babel-register')({
                presets: ['env']
            });
            return Promise.resolve().then(() => require(pluginPath));
        }
        return import(pluginPath);
    })) : null]);
    const pluginsForWork = new PluginsForWork({
        pluginsInWork, pluginFieldMappings, pluginObjects
    });
    return {
        fileData, lf, getFieldAliasOrName, metadataObj,
        schemaObj,
        pluginsForWork
    };
};

/* globals console, location, URL */

const setServiceWorkerDefaults = (target, source) => {
    target.userJSON = source.userJSON || 'resources/user.json';
    target.languages = source.languages || new URL('../appdata/languages.json',
    // Todo: Substitute with moduleURL once implemented
    new URL('node_modules/textbrowser/resources/index.js', location)).href;
    target.serviceWorkerPath = source.serviceWorkerPath || `sw.js?pathToUserJSON=${encodeURIComponent(target.userJSON)}`;
    target.files = source.files || 'files.json';
    target.namespace = source.namespace || 'textbrowser';
    return target;
};

// (Unless skipped in code, will wait between install
//    of new and activation of new or existing if still
//    some tabs open)

const listenForWorkerUpdate = ({
    r, logger
}) => {
    r.addEventListener('updatefound', e => {
        // New service worker has appeared
        // r.installing now available (though r.active is also,
        //    apparently due to prior activation; but not r.waiting)
        console.log('update found', e);
        const newWorker = r.installing;

        // statechange won't catch this installing event as already installing

        newWorker.addEventListener('statechange', async () => {
            const { state } = newWorker;
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
    r, logger
}) => {
    // We use this promise for rejecting (inside a listener)
    //    to a common catch and to prevent continuation by
    //    failing to return
    return new Promise(async (resolve, reject) => {
        navigator.serviceWorker.onmessage = ({ data }) => {
            const { message, type, name, errorType } = data;
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
            }
        };
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
`, { ok: false });
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
        r = await navigator.serviceWorker.register(serviceWorkerPath);
    } catch (err) {
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
        r, logger
    });
};

const escapeHTML = s => {
    return !s ? '' : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;');
};

// get successful control from form and assemble into object
// http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

// types which indicate a submit action and are not successful controls
// these will be ignored
const kRSubmitter = /^(?:submit|button|image|reset|file)$/i;

// node names which could be successful controls
const kRSuccessContrls = /^(?:input|select|textarea|keygen)/i;

// Matches bracket notation.
const brackets = /(\[[^[\]]*\])/g;

// serializes form fields
// @param form MUST be an HTMLForm element
// @param options is an optional argument to configure the serialization. Default output
// with no options specified is a url encoded string
//    - hash: [true | false] Configure the output type. If true, the output will
//    be a js object.
//    - serializer: [function] Optional serializer function to override the default one.
//    The function takes 3 arguments (result, key, value) and should return new result
//    hash and url encoded str serializers are provided with this module
//    - disabled: [true | false]. If true serialize disabled fields.
//    - empty: [true | false]. If true serialize empty fields
function serialize(form, options) {
    if (typeof options !== 'object') {
        options = { hash: !!options };
    } else if (options.hash === undefined) {
        options.hash = true;
    }

    let result = options.hash ? {} : '';
    const serializer = options.serializer || (options.hash ? hashSerializer : strSerialize);

    const elements = form && form.elements ? [...form.elements] : [];

    // Object store each radio and set if it's empty or not
    const radioStore = Object.create(null);

    elements.forEach(element => {
        // ignore disabled fields
        if (!options.disabled && element.disabled || !element.name) {
            return;
        }
        // ignore anything that is not considered a success field
        if (!kRSuccessContrls.test(element.nodeName) || kRSubmitter.test(element.type)) {
            return;
        }

        const { name: key, type, name, checked } = element;
        let { value } = element;

        // We can't just use element.value for checkboxes cause some browsers lie to us;
        // they say "on" for value when the box isn't checked
        if ((type === 'checkbox' || type === 'radio') && !checked) {
            value = undefined;
        }

        // If we want empty elements
        if (options.empty) {
            // for checkbox
            if (type === 'checkbox' && !checked) {
                value = '';
            }

            // for radio
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
        }

        // multi select boxes
        if (type === 'select-multiple') {
            value = [];

            let isSelectedOptions = false;
            [...element.options].forEach(option => {
                const allowedEmpty = options.empty && !option.value;
                const hasValue = option.value || allowedEmpty;
                if (option.selected && hasValue) {
                    isSelectedOptions = true;

                    // If using a hash serializer be sure to add the
                    // correct notation for an array in the multi-select
                    // context. Here the name attribute on the select element
                    // might be missing the trailing bracket pair. Both names
                    // "foo" and "foo[]" should be arrays.
                    if (options.hash && key.slice(key.length - 2) !== '[]') {
                        result = serializer(result, key + '[]', option.value);
                    } else {
                        result = serializer(result, key, option.value);
                    }
                }
            });

            // Serialize if no selected options and options.empty is true
            if (!isSelectedOptions && options.empty) {
                result = serializer(result, key, '');
            }

            return;
        }

        result = serializer(result, key, value);
    });

    // Check for all empty radio buttons and serialize them with key=""
    if (options.empty) {
        Object.entries(radioStore).forEach(([key, value]) => {
            if (!value) {
                result = serializer(result, key, '');
            }
        });
    }

    return result;
}

function parseKeys(string) {
    const keys = [];
    const prefix = /^([^[\]]*)/;
    const children = new RegExp(brackets);
    let match = prefix.exec(string);

    if (match[1]) {
        keys.push(match[1]);
    }

    while ((match = children.exec(string)) !== null) {
        keys.push(match[1]);
    }

    return keys;
}

function hashAssign(result, keys, value) {
    if (keys.length === 0) {
        return value;
    }

    const key = keys.shift();
    const between = key.match(/^\[(.+?)\]$/);

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
    }

    // Key is an attribute name and can be assigned directly.
    if (!between) {
        result[key] = hashAssign(result[key], keys, value);
    } else {
        const string = between[1];
        // +var converts the variable into a number
        // better than parseInt because it doesn't truncate away trailing
        // letters and actually fails if whole thing is not a number
        const index = +string;

        // If the characters between the brackets is not a number it is an
        // attribute name and can be assigned directly.
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

// Object/hash encoding serializer.
function hashSerializer(result, key, value) {
    const hasBrackets = key.match(brackets);

    // Has brackets? Use the recursive assignment function to walk the keys,
    // construct any missing objects in the result tree and make the assignment
    // at the end of the chain.
    if (hasBrackets) {
        const keys = parseKeys(key);
        hashAssign(result, keys, value);
    } else {
        // Non bracket notation can make assignments directly.
        const existing = result[key];

        // If the value has been assigned already (for instance when a radio and
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

// urlform encoding serializer
function strSerialize(result, key, value) {
    // encode newlines as \r\n cause the html spec says so
    value = value.replace(/(\r)?\n/g, '\r\n');
    value = encodeURIComponent(value);

    // spaces should be '+' rather than '%20'.
    value = value.replace(/%20/g, '+');
    return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
}

function deserialize(form, hash) {
    // input(text|radio|checkbox)|select(multiple)|textarea|keygen
    Object.entries(hash).forEach(([name, value]) => {
        let control = form[name];
        if (!form[name]) {
            control = form[name + '[]']; // We want this for RadioNodeList so setting value auto-disables other boxes
            if (!('length' in control)) {
                // The latter assignment only gets single
                //    elements, so if not a RadioNodeList, we get all values here
                control = form.querySelectorAll(`[name="${name}[]"]`);
            }
        }
        const { type } = control;
        if (type === 'checkbox') {
            control.checked = value !== '';
        }
        if (Array.isArray(value)) {
            if (type === 'select-multiple') {
                [...control.options].forEach(o => {
                    if (value.includes(o.value)) {
                        o.selected = true;
                    }
                });
                return;
            }
            value.forEach((v, i) => {
                const c = control[i];
                if (c.type === 'checkbox') {
                    const isMatch = c.value === v || v === 'on';
                    c.checked = isMatch;
                    return;
                }
                c.value = v;
            });
        } else {
            control.value = value;
        }
    });
}

/* eslint-env browser */
var languageSelect = {
    main({ langs, languages, followParams, $p }) {
        jml('form', { class: 'focus', id: 'languageSelectionContainer', $on: {
                submit(e) {
                    e.preventDefault();
                }
            } }, [['select', {
            name: 'lang',
            size: langs.length,
            $on: {
                click({ target: { parentNode: { selectedOptions } } }) {
                    followParams('#languageSelectionContainer', () => {
                        $p.set('lang', selectedOptions[0].value, true);
                    });
                }
            }
        }, langs.map(({ code }) => ['option', { value: code }, [languages.getLanguageFromCode(code)]])]], document.body);
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
    ), document.body
    */
};

/* eslint-env browser */

var workSelect = (({ groups, lf, getNextAlias, $p, followParams }) => {
    const form = jml('form', { id: 'workSelect', class: 'focus', $on: {
            submit(e) {
                e.preventDefault();
            }
        } }, groups.map((group, i) => ['div', [i > 0 ? ['br', 'br', 'br'] : '', ['div', [lf({ key: group.directions.localeKey, fallback: true })]], ['br'], ['select', {
        class: 'file',
        name: 'work' + i,
        dataset: {
            name: group.name.localeKey
        },
        $on: {
            change({ target: { value } }) {
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
    }, [['option', { value: '' }, ['--']], ...group.files.map(({ name: fileName }) => ['option', {
        value: lf(['workNames', group.id, fileName])
    }, [getNextAlias()]])]]
    // Todo: Add in Go button (with 'submitgo' localization string) to
    //    avoid need for pull-down if using first selection?
    ]]), document.body);
    if (history.state && typeof history.state === 'object') {
        deserialize(document.querySelector('#workSelect'), history.state);
    }
    return form;
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
const fonts = ['Helvetica, sans-serif', 'Verdana, sans-serif', 'Gill Sans, sans-serif', 'Avantgarde, sans-serif', 'Helvetica Narrow, sans-serif', 'sans-serif', 'Times, serif', 'Times New Roman, serif', 'Palatino, serif', 'Bookman, serif', 'New Century Schoolbook, serif', 'serif', 'Andale Mono, monospace', 'Courier New, monospace', 'Courier, monospace', 'Lucidatypewriter, monospace', 'Fixed, monospace', 'monospace', 'Comic Sans, Comic Sans MS, cursive', 'Zapf Chancery, cursive', 'Coronetscript, cursive', 'Florence, cursive', 'Parkavenue, cursive', 'cursive', 'Impact, fantasy', 'Arnoldboecklin, fantasy', 'Oldtown, fantasy', 'Blippo, fantasy', 'Brushstroke, fantasy', 'fantasy'];

/* eslint-env browser */

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
    bdo: ({ fallbackDirection, message }) =>
    // Displaying as div with inline display instead of span since
    //    Firefox puts punctuation at left otherwise (bdo dir
    //    seemed to have issues in Firefox)
    ['div', { style: 'display: inline; direction: ' + fallbackDirection }, [message]],
    columnsTable: ({
        ld, fieldInfo, $p, le, iil, l,
        metadataObj, preferredLocale, schemaItems,
        fieldMatchesLocale
    }) => ['table', {
        border: '1', cellpadding: '5', align: 'center'
    }, [['tr', [['th', [ld('fieldno')]], ['th', { align: 'left', width: '20' }, [ld('field_enabled')]], ['th', [ld('field_title')]], ['th', [ld('fieldinterlin')]], ['th', [ld('fieldcss')]]
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
        return ['tr', [
        // Todo: Get Jamilih to accept numbers and
        //    booleans (`toString` is too dangerous)
        ['td', [String(idx)]], le('check-columns-to-browse', 'td', 'title', {}, [le('yes', 'input', 'value', {
            class: 'fieldSelector',
            id: checkedIndex,
            name: iil('checked') + idx,
            checked: $p.get(checkedIndex) !== l('no') && fieldInfoItem.onByDefault !== false,
            type: 'checkbox'
        })]), le('check-sequence', 'td', 'title', {}, [['select', { name: iil('field') + idx, id: fieldIndex, size: '1' }, fieldInfo.map(({ field, fieldAliasOrName }, j) => {
            const matchedFieldParam = fieldParam && fieldParam === field;
            return ['option', {
                dataset: { name: field },
                value: fieldAliasOrName,
                selected: matchedFieldParam || j === i && !$p.has(fieldIndex)
            }, [fieldAliasOrName]];
        })]]), ['td', [// Todo: Make as tag selector with fields as options
        le('interlinear-tips', 'input', 'title', {
            name: iil('interlin') + idx,
            value: $p.get('interlin' + idx)
        }) // Todo: Could allow i18n of numbers here
        ]], ['td', [// Todo: Make as CodeMirror-highlighted CSS
        ['input', { name: iil('css') + idx, value: $p.get('css' + idx) }]]]
        /*
        ,
        ['td', [ // Todo: Allow plain or regexp searching
            ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
        ]]
        */
        ]];
    }), ['tr', [['td', { colspan: 3 }, [le('check_all', 'input', 'value', {
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
                fieldInfo.forEach(({ field }, i) => {
                    const idx = i + 1;
                    // The following is redundant with 'field' but may need to
                    //     retrieve later out of order?
                    const fld = $('#field' + idx).selectedOptions[0].dataset.name;
                    $('#checked' + idx).checked = fieldMatchesLocale(fld);
                });
            }
        }
    })]]]]]],
    advancedFormatting: ({ ld, il, l, lo, le, $p, hideFormattingSection }) => ['td', {
        id: 'advancedformatting', style: { display: hideFormattingSection ? 'none' : 'block' }
    }, [['h3', [ld('advancedformatting')]], ['label', [ld('textcolor'), nbsp2, ['select', { name: il('colorName') }, colors.map((color, i) => {
        const atts = { value: l(['param_values', 'colors', color]) };
        if ($p.get('colorName') === l(['param_values', 'colors', color]) || i === 1 && !$p.has('colorName')) {
            atts.selected = 'selected';
        }
        return lo(['param_values', 'colors', color], atts);
    })]]], ['label', [nbsp, ld('or_entercolor'), nbsp2, ['input', {
        name: il('color'),
        type: 'text',
        value: $p.get('color') || '#',
        size: '7',
        maxlength: '7' }]]], ['br'], ['br'], ['label', [ld('backgroundcolor'), nbsp2, ['select', { name: il('bgcolorName') }, colors.map((color, i) => {
        const atts = { value: l(['param_values', 'colors', color]) };
        if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) || i === 14 && !$p.has('bgcolorName')) {
            atts.selected = 'selected';
        }
        return lo(['param_values', 'colors', color], atts);
    })]]], ['label', [nbsp, ld('or_entercolor'), nbsp2, ['input', {
        name: il('bgcolor'),
        type: 'text',
        value: $p.get('bgcolor') || '#',
        size: '7',
        maxlength: '7' }]]], ['br'], ['br'], ['label', [ld('text_font'), nbsp2,
    // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
    ['select', { name: il('fontSeq'), dir: 'ltr' }, fonts.map((fontSeq, i) => {
        const atts = { value: fontSeq };
        if ($p.get('fontSeq') === fontSeq || i === 7 && !$p.has('fontSeq')) {
            atts.selected = 'selected';
        }
        return ['option', atts, [fontSeq]];
    })]]], ['br'], ['br'], ['label', [ld('font_style'), nbsp2, ['select', { name: il('fontstyle') }, ['italic', 'normal', 'oblique'].map((fontstyle, i) => {
        const atts = { value: l(['param_values', 'fontstyle', fontstyle]) };
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
    }], ld(['param_values', 'fontvariant', 'small-caps']), nbsp]]]], ['br'], ['label', [
    // Todo: i18n and allow for normal/bold pulldown and float input?
    ld('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2, ['input', {
        name: il('fontweight'),
        type: 'text',
        value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
        size: '7',
        maxlength: '12' }]]], ['br'], ['label', [ld('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2, ['input', {
        name: il('fontsize'),
        type: 'text',
        value: $p.get('fontsize'),
        size: '7',
        maxlength: '12' }]]], ['br'],
    // Todo: i18nize title and values?
    // Todo: remove hard-coded direction if i18nizing
    ['label', {
        dir: 'ltr'
    }, [ld('font_stretch'), nbsp, ['select', { name: il('fontstretch') }, ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(stretch => {
        const atts = { value: ld(['param_values', 'font-stretch', stretch]) };
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
        maxlength: '12' }]]], ['br'], ['label', [ld('line_height'), ' (normal, 1.5, 22px, 150%): ', ['input', {
        name: il('lineheight'),
        type: 'text',
        value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
        size: '7',
        maxlength: '12' }]]], ['br'], ['br'], le('tableformatting_tips', 'h3', 'title', {}, [ld('tableformatting')]), ['div', [ld('header_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
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
        checked: $p.get('border') === '0' }], ld('no')]]]], ['div', [ld('interlin_repeat_field_names'), nbsp2, ['label', [['input', {
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
    }]]], ['br'], le('outputmode_tips', 'label', 'title', {}, [ld('outputmode'), nbsp2,
    // Todo: Could i18nize, but would need smaller values
    ['select', { name: il('outputmode') }, ['table', 'div'
    // , 'json-array',
    // 'json-object'
    ].map(mode => {
        const atts = { value: mode };
        if ($p.get('outputmode') === mode) {
            atts.selected = 'selected';
        }
        return lo(['param_values', 'outputmode', mode], atts);
    })]])]],
    addRandomFormFields: ({
        il, ld, l, le, $p, serializeParamsAsURL, content
    }) => {
        const addRowContent = rowContent => {
            if (!rowContent || !rowContent.length) {
                return;
            }
            content.push(['tr', rowContent]);
        };
        [[['td', { colspan: 12, align: 'center' }, [['br'], ld('or'), ['br'], ['br']]]], [['td', { colspan: 12, align: 'center' }, [
        // Todo: Could allow random with fixed starting and/or ending range
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
                    const url = serializeParamsAsURL(getDataForSerializingParamsAsURL(), 'randomResult');
                    $('#randomURL').value = url;
                }
            }
        }), ['input', { id: 'randomURL', type: 'text' }]]]]].forEach(addRowContent);
    },
    getPreferences: ({
        langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
    }) => ['div', {
        style: { textAlign: 'left' }, id: 'preferences', hidden: 'true'
    }, [['div', { style: 'margin-top: 10px;' }, [['label', [l('localizeParamNames'), ['input', {
        id: 'localizeParamNames',
        type: 'checkbox',
        checked: localizeParamNames,
        $on: { change({ target: { checked } }) {
                localStorage.setItem(namespace + '-localizeParamNames', checked);
            } }
    }]]]]], ['div', [['label', [l('Hide formatting section'), ['input', {
        id: 'hideFormattingSection',
        type: 'checkbox',
        checked: hideFormattingSection,
        $on: { change({ target: { checked } }) {
                $('#advancedformatting').style.display = checked ? 'none' : 'block';
                localStorage.setItem(namespace + '-hideFormattingSection', checked);
            } }
    }]]]]], ['div', [['label', { for: 'prefLangs' }, [l('Preferred language(s)')]], ['br'], ['select', {
        id: 'prefLangs',
        multiple: 'multiple',
        size: langs.length,
        $on: {
            change({ target: { selectedOptions } }) {
                // Todo: EU disclaimer re: storage?
                localStorage.setItem(namespace + '-langCodes', JSON.stringify(Array.from(selectedOptions).map(opt => opt.value)));
            }
        }
    }, langs.map(lan => {
        let langCodes = localStorage.getItem(namespace + '-langCodes');
        langCodes = langCodes && JSON.parse(langCodes);
        const atts = { value: lan.code };
        if (langCodes && langCodes.includes(lan.code)) {
            atts.selected = 'selected';
        }
        return ['option', atts, [imfl(['languages', lan.code])]];
    })]]]]],
    addBrowseFields: ({ browseFields, fieldInfo, ld, i, iil, $p, content }) => {
        const work = $p.get('work');
        const addRowContent = rowContent => {
            if (!rowContent || !rowContent.length) {
                return;
            }
            content.push(['tr', rowContent]);
        };
        [
        // Todo: Separate formatting to CSS
        i > 0 ? [['td', { colspan: 12, align: 'center' }, [['br'], ld('or'), ['br'], ['br']]]] : '', [...(() => {
            const addBrowseFieldSet = setType => browseFields.reduce((rowContent, {
                fieldName, aliases, fieldSchema: { minimum, maximum }
            }, j) => {
                // Namespace by work for sake of browser auto-complete caching
                const name = work + '-' + iil(setType) + (i + 1) + '-' + (j + 1);
                const id = name;
                rowContent['#'].push(['td', [['label', { 'for': name }, [fieldName]]]], ['td', [aliases ? ['datalist', { id: 'dl-' + id }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
                    name, id, class: 'browseField',
                    list: 'dl-' + id,
                    value: $p.get(name, true),
                    $on: setType === 'start' ? { change(e) {
                            $$('input.browseField').forEach(bf => {
                                if (bf.id.includes(i + 1 + '-' + (j + 1))) {
                                    bf.value = e.target.value;
                                }
                            });
                        } } : undefined
                }] : ['input', {
                    name, id,
                    type: 'number',
                    min: minimum,
                    max: maximum,
                    value: $p.get(name, true)
                }], nbsp3]]);
                return rowContent;
            }, { '#': [] });
            return [addBrowseFieldSet('start'), ['td', [['b', [ld('to')]], nbsp3]], addBrowseFieldSet('end')];
        })(), ['td', [browseFields.length > 1 ? ld('versesendingdataoptional') : '']]], [['td', { colspan: 4 * browseFields.length + 2 + 1, align: 'center' }, [['table', [['tr', [browseFields.reduce((rowContent, {
            fieldName, aliases, fieldSchema: { minimum, maximum }
        }, j) => {
            // Namespace by work for sake of browser auto-complete caching
            const name = work + '-' + iil('anchor') + (i + 1) + '-' + (j + 1);
            const id = name;
            rowContent['#'].push(['td', [['label', { 'for': name }, [fieldName]]]], ['td', [aliases ? ['datalist', { id: 'dl-' + id }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
                name, id, class: 'browseField',
                list: 'dl-' + id,
                value: $p.get(name, true)
            }] : ['input', {
                name, id,
                type: 'number',
                min: minimum,
                max: maximum,
                value: $p.get(name, true)
            }], nbsp2]]);
            return rowContent;
        }, { '#': [['td', { style: 'font-weight: bold; vertical-align: bottom;' }, [ld('anchored-at') + nbsp3]]] }), ['td', [['label', [ld('field') + nbsp2, ['select', { name: iil('anchorfield') + (i + 1), size: '1' }, fieldInfo.map(({ fieldAliasOrName }) => {
            const val = $p.get(iil('anchorfield') + (i + 1), true);
            if (val === fieldAliasOrName) {
                return ['option', { selected: true }, [fieldAliasOrName]];
            }
            return ['option', [fieldAliasOrName]];
        })]]]]]]]]]]]]].forEach(addRowContent);
    },
    main: ({
        l, namespace, heading, fallbackDirection, imfl, langs, fieldInfo, localizeParamNames,
        serializeParamsAsURL,
        hideFormattingSection, $p,
        metadataObj, il, le, ld, iil, fieldMatchesLocale,
        preferredLocale, schemaItems, content
    }) => {
        const lo = (key, atts) => ['option', atts, [l({
            key,
            fallback({ message }) {
                atts.dir = fallbackDirection;
                return message;
            }
        })]];
        // Returns element with localized or fallback attribute value (as Jamilih);
        //   also adds direction
        jml('div', { class: 'focus' }, [['div', { style: 'float: left;' }, [['button', { $on: { click() {
                    const prefs = $('#preferences');
                    prefs.hidden = !prefs.hidden;
                } } }, [l('Preferences')]], Templates.workDisplay.getPreferences({
            langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
        })]], ['h2', [heading]], ['br'], ['form', { id: 'browse', $on: {
                submit(e) {
                    e.preventDefault();
                }
            }, name: il('browse') }, [['table', { align: 'center' }, content], ['br'], ['div', { style: 'margin-left: 20px' }, [['br'], ['br'], ['table', { border: '1', align: 'center', cellpadding: '5' }, [['tr', { valign: 'top' }, [['td', [Templates.workDisplay.columnsTable({
            ld, fieldInfo, $p, le, iil, l,
            metadataObj, preferredLocale, schemaItems,
            fieldMatchesLocale
        }), le('save-settings-URL', 'input', 'value', {
            type: 'button',
            $on: {
                click() {
                    const url = serializeParamsAsURL(getDataForSerializingParamsAsURL(), 'saveSettings');
                    $('#settings-URL').value = url;
                }
            }
        }), ['input', { id: 'settings-URL' }]]], Templates.workDisplay.advancedFormatting({
            ld, il, l, lo, le, $p, hideFormattingSection
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
        ]]]]]], ['p', { align: 'center' }, [le('submitgo', 'input', 'value', {
            type: 'submit',
            $on: {
                click() {
                    const data = getDataForSerializingParamsAsURL();
                    const thisParams = serializeParamsAsURL(data, 'saveSettings').replace(/^[^#]*#/, '');
                    // Don't change the visible URL
                    console.log('history thisParams', thisParams);
                    history.replaceState(thisParams, document.title, location.href);
                    const newURL = serializeParamsAsURL(data, 'result');
                    location.href = newURL;
                }
            }
        })]]]]], document.body);
    }
};

/* globals console, DOMParser */

var resultsDisplayServerOrClient = {
    caption({ heading, ranges }) {
        return heading + ' ' + ranges;
    },
    startSeparator({ l }) {
        return l('colon');
    },
    innerBrowseFieldSeparator({ l }) {
        return l('comma-space');
    },
    ranges({ l, startRange, endVals, rangeNames }) {
        return startRange +
        // l('to').toLowerCase() + ' ' +
        '-' + endVals.join(Templates.resultsDisplayServerOrClient.startSeparator({ l })) + ' (' + rangeNames + ')';
    },
    fieldValueAlias({ key, value }) {
        return value + ' (' + key + ')';
    },
    interlinearSegment({ lang, dir, html }) {
        return `<span${lang ? ` lang="${lang}"` : ''}${dir ? ` dir="${dir}"` : ''}>${html}</span>`;
    },
    interlinearTitle({ l, val }) {
        const colonSpace = l('colon-space');
        return `<span class="interlintitle">${val}</span>${colonSpace}`;
    },
    styles({
        $p, $pRaw, $pRawEsc, $pEscArbitrary, escapeQuotedCSS, escapeCSS,
        tableWithFixedHeaderAndFooter, checkedFieldIndexes, hasCaption
    }) {
        const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#' ? $pEscArbitrary('colorName') : $pEscArbitrary('color');
        const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#' ? $pEscArbitrary('bgcolorName') : $pEscArbitrary('bgcolor');

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
        return ['style', [($pRaw('caption') === 'y' ? tableWithFixedHeaderAndFooter ? '.caption div.inner-caption, ' : '.caption, ' : '') + ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.thead .th, .thead .th div.th-inner, ` // Problems at least in Chrome
        : `.thead .th, ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.tfoot .th, .tfoot .th div.th-inner, ` // Problems at least in Chrome
        : `.tfoot .th, ` : '') + '.tbody td' + ` {
    vertical-align: top;
    font-style: ${$pRawEsc('fontstyle')};
    font-variant: ${$pRawEsc('fontvariant')};
    font-weight: ${$pEscArbitrary('fontweight')};
    ${$pEscArbitrary('fontsize') ? `font-size: ${$pEscArbitrary('fontsize')};` : ''}
    font-family: ${$pEscArbitrary('fontSeq')};

    font-stretch: ${$pEscArbitrary('fontstretch')};
    letter-spacing: ${$pEscArbitrary('letterspacing')};
    line-height: ${$pEscArbitrary('lineheight')};
    ${colorEsc ? `color: ${escapeCSS(colorEsc)} !important;` : ''
        // Marked `!important` as will be overridden by default fixed table colors
        }
    ${bgcolorEsc ? `background-color: ${escapeCSS(bgcolorEsc)} !important;` : ''
        // Marked `!important` as will be overridden by default fixed table colors
        }
}
${escapeCSS($pEscArbitrary('pagecss') || '')}
` + (tableWithFixedHeaderAndFooter ? `
html, body, body > div {
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
` : '') + checkedFieldIndexes.map((idx, i) => ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `.thead .th:nth-child(${i + 1}) div.th-inner, ` : `.thead .th:nth-child(${i + 1}), ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, ` : `.tfoot .th:nth-child(${i + 1}), ` : '') + `.tbody td:nth-child(${i + 1}) ` + `{
    ${$pEscArbitrary('css' + (i + 1))}
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
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        // Todo: escaping should be done in business logic!
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs, fieldDirs,
        caption, hasCaption, showInterlinTitles,
        determineEnd, getCanonicalID, canonicalBrowseFieldSetName,
        getCellValue, checkedAndInterlinearFieldInfo,
        interlinearSeparator = '<br /><br />'
    }) {
        const tableOptions = {
            table: [['table', { class: 'table', border: $pRaw('border') || '0' }], ['tr', { class: 'tr' }], ['td'], // , {class: 'td'} // Too much data to add class to each
            ['th', { class: 'th' }], ['caption', { class: 'caption' }], ['thead', { class: 'thead' }], ['tbody', { class: 'tbody' }], ['tfoot', { class: 'tfoot' }]
            // ['colgroup', {class: 'colgroup'}],
            // ['col', {class: 'col'}]
            ],
            div: [['div', { class: 'table', style: 'display: table;' }], ['div', { class: 'tr', style: 'display: table-row;' }], ['div', { class: 'td', style: 'display: table-cell;' }], ['div', { class: 'th', style: 'display: table-cell;' }], ['div', { class: 'caption', style: 'display: table-caption;' }], ['div', { class: 'thead', style: 'display: table-header-group;' }], ['div', { class: 'tbody', style: 'display: table-row-group;' }], ['div', { class: 'tfoot', style: 'display: table-footer-group;' }]
            // ['div', {class: 'colgroup', style: 'display: table-column-group;'}],
            // ['div', {class: 'col', style: 'display: table-column;'}]
            ],
            'json-array': 'json',
            'json-object': 'json'
        };
        const outputmode = $p.get('outputmode', true); // Why not $pRaw?
        const tableElems = tableOptions[// eslint-disable-line standard/computed-property-even-spacing
        Object.keys(tableOptions).includes(outputmode) // Exclude __proto__ or whatever
        ? outputmode : 'table' // Default
        ];
        if (tableElems === 'json') {
            throw new Error('JSON support is currently not available');
        }
        const [tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem] = tableElems; // colgroupElem, colElem

        const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] = checkedAndInterlinearFieldInfo;

        const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';
        const tableWrap = children => tableWithFixedHeaderAndFooter ? ['div', { class: 'anchor-table-header zupa' }, [['div', { class: 'anchor-table-body' }, children]]] : ['div', children];

        const addChildren = (el, children) => {
            el = JSON.parse(JSON.stringify(el));
            el.push(children);
            return el;
        };
        const addAtts = ([el, atts], newAtts) => [el, Object.assign({}, atts, newAtts)];

        const foundState = {
            start: false,
            end: false
        };
        const outArr = [];

        const showEmptyInterlinear = this.showEmptyInterlinear;
        const showTitleOnSingleInterlinear = this.showTitleOnSingleInterlinear;

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
            const rowID = determineEnd({ tr, foundState });
            if (typeof rowID === 'boolean') {
                return rowID;
            }

            const canonicalID = getCanonicalID({ tr });

            outArr.push(addChildren(addAtts(trElem, {
                dataset: {
                    row: rowID,
                    'canonical-type': canonicalBrowseFieldSetName,
                    'canonical-id': canonicalID
                }
            }), checkedFieldIndexes.map((idx, j) => {
                const interlinearColIndexes = allInterlinearColIndexes[j];
                const showInterlins = interlinearColIndexes;
                const { tdVal, htmlEscaped } = getCellValue({ tr, idx });
                const interlins = showInterlins && interlinearColIndexes.map(idx => {
                    // Need to get a new one
                    const { tdVal, htmlEscaped } = getCellValue({ tr, idx });
                    let cellIsEmpty;
                    console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
                    const isEmpty = checkEmpty(tdVal, htmlEscaped);
                    if (isEmpty) {
                        return '';
                    }

                    return showInterlins && !cellIsEmpty ? Templates.resultsDisplayServerOrClient.interlinearSegment({
                        lang: fieldLangs[idx],
                        dir: fieldDirs[idx],
                        html: (showInterlinTitles ? Templates.resultsDisplayServerOrClient.interlinearTitle({
                            l, val: localizedFieldNames[idx]
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
                            l, val: localizedFieldNames[idx]
                        }) : '') + tdVal
                    }) : tdVal) + (interlinearColIndexes && interlins.length ? interlinearSeparator + interlins.join(interlinearSeparator) : '')
                });
            })));
        });

        return ['div', [Templates.resultsDisplayServerOrClient.styles({
            $p, $pRaw, $pRawEsc, $pEscArbitrary,
            escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter,
            checkedFieldIndexes, hasCaption
        }), tableWrap([addChildren(tableElem, [caption ? addChildren(captionElem, [caption, tableWithFixedHeaderAndFooter ? ['div', { class: 'zupa1' }, [['div', { class: 'inner-caption' }, [['span', [caption]]]]]] : '']) : '',
        /*
        // Works but quirky, e.g., `color` doesn't work (as also
        //  confirmed per https://quirksmode.org/css/css2/columns.html)
        addChildren(colgroupElem,
            checkedFieldIndexes.map((idx, i) =>
                addAtts(colElem, {style: $pRaw('css' + (i + 1))})
            )
        ),
        */
        $pRaw('header') !== '0' ? addChildren(theadElem, [addChildren(trElem, checkedFields.map((cf, i) => {
            const interlinearColIndexes = allInterlinearColIndexes[i];
            cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
            return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', { class: 'zupa1' }, [['div', { class: 'th-inner' }, [['span', [cf]]]]]] : '']);
        }))]) : '', $pRaw('footer') && $pRaw('footer') !== '0' ? addChildren(tfootElem, [addChildren(trElem, checkedFields.map((cf, i) => {
            const interlinearColIndexes = allInterlinearColIndexes[i];
            cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
            return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', { class: 'zupa1' }, [['div', { class: 'th-inner' }, [['span', [cf]]]]]] : '']);
        }))]) : '', addChildren(tbodyElem, outArr)])])]];
    }
};

var resultsDisplayClient = {
    anchorRowCol({ anchorRowCol }) {
        return $('#' + anchorRowCol);
    },
    anchors({ escapedRow, escapedCol }) {
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
        jml(...html, document.body);
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
        $('html').style.height = '100%'; // Todo: Set in CSS
        return jml('body', { style: 'height: 100%;' });
    }
};
Templates.permissions = {
    versionChange() {
        $('#versionChange').showModal();
    },
    addLogEntry({ text }) {
        const installationDialog = $('#installationLogContainer');
        try {
            installationDialog.showModal();
            const container = $('#dialogContainer');
            container.hidden = false;
        } catch (err) {
            // May already be open
        }
        $('#installationLog').append(text + '\n');
    },
    exitDialogs() {
        const container = $('#dialogContainer');
        if (container) {
            container.hidden = true;
        }
    },
    dbError({ type, escapedErrorMessage }) {
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
    main({ l, ok, refuse, close, closeBrowserNotGranting }) {
        const installationDialog = jml('dialog', {
            style: 'text-align: center; height: 100%',
            id: 'installationLogContainer',
            class: 'focus'
        }, [['p', [l('wait-installing')]], ['div', { style: 'height: 80%; overflow: auto;' }, [['pre', { id: 'installationLog' }, []]]]
        // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
        ]);
        let requestPermissionsDialog = '';
        if (ok) {
            requestPermissionsDialog = jml('dialog', {
                id: 'willRequestStoragePermissions',
                $on: { close }
            }, [['section', [l('will-request-storage-permissions')]], ['br'], ['div', { class: 'focus' }, [['button', { $on: { click: ok } }, [l('OK')]], ['br'], ['br'], ['button', { $on: { click: refuse } }, [l('refuse-request-storage-permissions')]]]]]);
        }
        const errorRegisteringNotice = jml('dialog', {
            id: 'errorRegistering'
        }, [['section', [l('errorRegistering')]]]);
        let browserNotGrantingPersistenceAlert = '';
        if (closeBrowserNotGranting) {
            browserNotGrantingPersistenceAlert = jml('dialog', {
                id: 'browserNotGrantingPersistence'
            }, [['section', [l('browser-not-granting-persistence')]], ['br'], ['div', { class: 'focus' }, [['button', { $on: { click: closeBrowserNotGranting } }, [l('OK')]]]]]);
        }
        const versionChangeNotice = jml('dialog', {
            id: 'versionChange'
        }, [['section', [l('versionChange')]]]);
        const dbErrorNotice = jml('dialog', {
            id: 'dbError'
        }, [['section', [l('dbError')]]]);
        jml('div', { id: 'dialogContainer', style: 'height: 100%' }, [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice], document.body);

        return [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice];
    }
};

function _prepareParam(param, skip) {
    if (skip || !this.localizeParamNames) {
        // (lang)
        return param;
    }

    const endNums = /\d+(-\d+)?$/; // start, end, toggle
    const indexed = param.match(endNums);
    if (indexed) {
        // Todo: We could i18nize numbers as well
        return this.l10n(['params', 'indexed', param.replace(endNums, '')]) + indexed[0];
    }
    return this.l10n(['params', param]);
}

function IntlURLSearchParams({ l10n, params } = {}) {
    this.l10n = l10n;
    if (!params) {
        params = location.hash.slice(1); // eslint-disable-line no-undef
    }
    if (typeof params === 'string') {
        params = new URLSearchParams(params); // eslint-disable-line no-undef
    }
    this.params = params;
}
IntlURLSearchParams.prototype.get = function (param, skip) {
    return this.params.get(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.getAll = function (param, skip) {
    return this.params.getAll(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.has = function (param, skip) {
    return this.params.has(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.delete = function (param, skip) {
    return this.params.delete(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.set = function (param, value, skip) {
    return this.params.set(_prepareParam.call(this, param, skip), value);
};
IntlURLSearchParams.prototype.append = function (param, value, skip) {
    return this.params.append(_prepareParam.call(this, param, skip), value);
};
IntlURLSearchParams.prototype.toString = function () {
    return this.params.toString();
};

/* eslint-env browser */

var workSelect = (async function workSelect({
    files, lang, fallbackLanguages, $p, followParams
    /* , l, defineFormatter */
}) {
    // We use getJSON instead of JsonRefs as we do not necessarily need to
    //    resolve the file contents here
    try {
        const dbs = await simpleGetJson(files);
        const localeFromFileData = lan => dbs['localization-strings'][lan];

        const metadataObjs = await simpleGetJson(dbs.groups.reduce((arr, fileGroup) => {
            const metadataBaseDir = (dbs.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';
            return fileGroup.files.reduce((ar, fileData) => ar.concat(metadataBaseDir + fileData.metadataFile), arr);
        }, []));
        const imfFile = dist({ // eslint-disable-line new-cap
            locales: lang.map(localeFromFileData),
            fallbackLocales: fallbackLanguages.map(localeFromFileData)
        });
        const lf = imfFile.getFormatter();
        document.title = lf({ key: 'browserfile-workselect', fallback: true });
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
        Templates.workSelect({ groups: dbs.groups, lf, getNextAlias, $p, followParams });
    } catch (err) {
        dialogs.alert(err);
    }
});

/* eslint-env browser */
function getSerializeParamsAsURL ({ l, il, $p }) {
    return function serializeParamsAsURL({ form, random, checkboxes }, type) {
        const paramsCopy = new URLSearchParams($p.params);
        const formParamsHash = serialize(form, { hash: true });

        Object.keys(formParamsHash).forEach(key => {
            paramsCopy.set(key, formParamsHash[key]);
        });

        // Follow the same style (and order) for checkboxes
        paramsCopy.delete(il('rand'));
        paramsCopy.set(il('rand'), random.checked ? l('yes') : l('no'));

        // We want checkboxes to typically show by default, so we cannot use the
        //    standard serialization
        checkboxes.forEach(checkbox => {
            // Let's ensure the checked items are all together (at the end)
            paramsCopy.delete(checkbox.name);
            paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
        });

        switch (type) {
            case 'saveSettings':
                {
                    // In case it was added previously on
                    //    this page, let's remove it.
                    paramsCopy.delete(il('rand'));
                    break;
                }
            case 'randomResult':
            case 'result':
                {
                    // In case it was added previously on this page,
                    //    let's put random again toward the end.
                    if (type === 'randomResult' || random.checked) {
                        paramsCopy.delete(il('rand'));
                        paramsCopy.set(il('rand'), l('yes'));
                    }
                    paramsCopy.set(il('result'), l('yes'));
                    break;
                }
        }
        return location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
    };
}

/* eslint-env browser */

var workDisplay = (async function workDisplay({
    l,
    lang, preferredLocale, languages, fallbackLanguages, $p
}) {
    const that = this;
    const langs = this.langData.languages;

    const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);

    const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;

    const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
    const hideFormattingSection = $p.has('formatting', true) ? $p.get('formatting', true) === '0' : prefFormatting === 'true' || prefFormatting !== 'false' && this.hideFormattingSection;

    function _displayWork({
        lf, metadataObj, getFieldAliasOrName, schemaObj,
        pluginsForWork
    }) {
        const il = localizeParamNames ? key => l(['params', key]) : key => key;
        const iil = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;

        const localeFromLangData = languages.localeFromLangData.bind(languages);
        const imfLang = dist({
            locales: lang.map(localeFromLangData),
            fallbackLocales: fallbackLanguages.map(localeFromLangData)
        }); // eslint-disable-line new-cap
        const imfl = imfLang.getFormatter();

        // Returns option element with localized option text (as Jamilih), with
        //   optional fallback direction
        const le = (key, el, attToLocalize, atts, children) => {
            atts[attToLocalize] = l({
                key,
                fallback: ({ message }) => {
                    atts.dir = fallbackDirection;
                    return message;
                }
            });
            return [el, atts, children];
        };

        // Returns plain text node or element (as Jamilih) with fallback direction
        const ld = (key, values, formats) => l({
            key,
            values,
            formats,
            fallback: ({ message }) => Templates.workDisplay.bdo({ fallbackDirection, message })
        });

        const schemaItems = schemaObj.items.items;

        const fieldInfo = schemaItems.map(({ title: field }) => {
            return {
                field,
                fieldAliasOrName: getFieldAliasOrName(field) || field
            };
        });

        const metadata = new Metadata({ metadataObj });
        if (pluginsForWork) {
            console.log('pluginsForWork', pluginsForWork);
            const { lang } = this; // array with first item as preferred
            pluginsForWork.iterateMappings(({
                plugin,
                pluginName, pluginLang,
                onByDefaultDefault,
                placement, applicableFields, meta
            }) => {
                const processField = ({ applicableField, targetLanguage, onByDefault, metaApplicableField } = {}) => {
                    const plugin = pluginsForWork.getPluginObject(pluginName);
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
                    fieldInfo.splice(
                    // Todo: Allow default placement overriding for
                    //    non-plugins
                    placement === 'end' ? Infinity // push
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

        const fieldMatchesLocale = metadata.getFieldMatchesLocale({
            namespace: this.namespace,
            preferredLocale, schemaItems,
            pluginsForWork
        });

        const content = [];
        this.getBrowseFieldData({
            metadataObj, schemaItems, getFieldAliasOrName,
            callback({ browseFields, i }) {
                Templates.workDisplay.addBrowseFields({
                    browseFields, fieldInfo,
                    ld, i, iil, $p, content
                });
            }
        });

        /*
        Templates.workDisplay.addRandomFormFields({
            il, l, ld, le, $p, serializeParamsAsURL, content
        });
        */
        const serializeParamsAsURL = getSerializeParamsAsURL({ l, il, $p });

        // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        const heading = getMetaProp(lang, metadataObj, 'heading');
        Templates.workDisplay.main({
            l, namespace: that.namespace, heading,
            imfl, fallbackDirection,
            langs, fieldInfo, localizeParamNames,
            serializeParamsAsURL, hideFormattingSection, $p,
            metadataObj, il, le, ld, iil,
            fieldMatchesLocale,
            preferredLocale, schemaItems, content
        });
    }

    try {
        const _ref = await this.getWorkData({
            lang, fallbackLanguages, $p
        }),
              { lf, fileData, metadataObj } = _ref,
              args = objectWithoutProperties(_ref, ['lf', 'fileData', 'metadataObj']);

        document.title = lf({
            key: 'browserfile-workdisplay',
            values: {
                work: fileData ? getMetaProp(lang, metadataObj, 'alias') : ''
            },
            fallback: true
        });
        _displayWork.call(this, _extends({ lf, metadataObj }, args));
    } catch (err) {
        dialogs.alert(err);
    }
});

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

var self$1;
var RtlDetectLib = self$1 = { // eslint-disable-line consistent-this

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
        // parse locale regex object
        var regex = /^([a-zA-Z]*)([_\-a-zA-Z]*)$/;
        var matches = regex.exec(strLocale); // exec regex
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
    'yi' /* 'ייִדיש', Yiddish */
    ],
    writable: false,
    enumerable: true,
    configurable: false
});

var rtlDetect = RtlDetectLib;

var rtlDetect_1 = {

  isRtlLang: rtlDetect.isRtlLang,

  getLangDir: rtlDetect.getLangDir

};
var rtlDetect_3 = rtlDetect_1.getLangDir;

/* eslint-env browser */

const getRawFieldValue = v => typeof v === 'string' ? v.replace(/^.* \((.*?)\)$/, '$1') : v;

const setAnchor = ({
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred, ilRaw, iil, max, $p
}) => {
    const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map(abfs => abfs.fieldSchemaIndex);
    // Check if user added this (e.g., even to end of URL with
    //   other anchor params)
    const work = $p.get('work');
    let anchor;
    const anchorRowCol = ilRaw('anchorrowcol');
    if (anchorRowCol) {
        anchor = Templates.resultsDisplayClient.anchorRowCol({ anchorRowCol });
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
                anchors.push(raw || anchor);
                // anchors.push({anchorText, anchor});
            }
        }
        if (anchors.length) {
            const escapeSelectorAttValue = str => (str || '').replace(/["\\]/g, '\\$&');
            const escapedRow = escapeSelectorAttValue(anchors.join('-'));
            const escapedCol = anchorField ? escapeSelectorAttValue(anchorField) : undefined;
            anchor = Templates.resultsDisplayClient.anchors({
                escapedRow, escapedCol
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
        fieldInfo, $p,
        browseFieldSets,
        applicableBrowseFieldSet,
        lang, metadataObj, fileData,
        fieldValueAliasMapPreferred, lf, iil, ilRaw,
        templateArgs
    } = await resultsDisplayServerOrClient$1.call(this, _extends({}, args, { skipIndexedDB, prefI18n
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
        fieldValueAliasMapPreferred, iil, ilRaw,
        $p: args.$p,
        max: browseFieldSets.length
    });
    fieldInfo.forEach(({ plugin, applicableField, meta, j }) => {
        if (!plugin) {
            return;
        }
        if (plugin.done) {
            plugin.done({ $p, applicableField, meta, j, thisObj: this });
        }
    });
};

const resultsDisplayServerOrClient$1 = async function resultsDisplayServerOrClient({
    l, lang, fallbackLanguages, imfLocales, $p, skipIndexedDB, noIndexedDB, prefI18n,
    files, allowPlugins, langData, basePath = '', dynamicBasePath = ''
}) {
    const languages = new Languages({ langData });
    const getCellValue = ({
        fieldValueAliasMapPreferred, escapeColumnIndexes
    }) => ({
        tr, idx
    }) => {
        let tdVal = fieldValueAliasMapPreferred[idx] !== undefined ? fieldValueAliasMapPreferred[idx][tr[idx]] : tr[idx];
        if (tdVal && typeof tdVal === 'object') {
            tdVal = Object.values(tdVal);
        }
        if (Array.isArray(tdVal)) {
            tdVal = tdVal.join(l('comma-space'));
        }
        return (escapeColumnIndexes[idx] || !this.trustFormatHTML) && typeof tdVal === 'string' ? { tdVal: escapeHTML(tdVal), htmlEscaped: true } : { tdVal };
    };
    const determineEnd = ({
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        canonicalBrowseFieldNames,
        applicableBrowseFieldNames, startsTextOnly, endsTextOnly
    }) => ({
        tr, foundState
    }) => {
        const rowIDPartsPreferred = [];
        const rowIDParts = (canonicalBrowseFieldNames || applicableBrowseFieldNames).map(fieldName => {
            const idx = localizedFieldNames.indexOf(fieldName);
            // This works to put alias in anchor but this includes
            //   our ending parenthetical, the alias may be harder
            //   to remember and/or automated than original (e.g.,
            //   for a number representing a book), and there could
            //   be multiple aliases for a value; we may wish to
            //   switch this (and also for other browse field-based
            //   items).
            if (fieldValueAliasMap[idx] !== undefined) {
                rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
                const val = fieldValueAliasMap[idx][tr[idx]];
                if ( // The original is text so supplied as such in start value
                typeof val === 'number' || Array.isArray(val) && val.every(v => typeof v === 'number')) {
                    return tr[idx];
                }
                return val;
            }
            rowIDPartsPreferred.push(tr[idx]);
            return tr[idx];
        });

        if (!canonicalBrowseFieldNames) {
            // Todo: Use schema to determine each and use `parseInt`
            //   on other value instead of `String` conversions
            if (!foundState.start) {
                if (startsTextOnly.some((part, i) => {
                    const rowIDPart = rowIDParts[i];
                    return Array.isArray(rowIDPart) ? !rowIDPart.some(rip => part === String(rip)) : rowIDPart && typeof rowIDPart === 'object' ? !Object.values(rowIDPart).some(rip => part === String(rip)) : part !== String(rowIDPart);
                })) {
                    return false;
                }
                foundState.start = true;
            }
            // This doesn't go in an `else` for the above in case the start is the end
            if (endsTextOnly.every((part, i) => {
                const rowIDPart = rowIDParts[i];
                return Array.isArray(rowIDPart) ? rowIDPart.some(rip => part === String(rip)) : rowIDPart && typeof rowIDPart === 'object' ? Object.values(rowIDPart).some(rip => part === String(rip)) : part === String(rowIDPart);
            })) {
                foundState.end = true;
            } else if (foundState.end) {
                // If no longer matching, return
                return true;
            }
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
            parseInt(col, 10) - 1).filter(n => !Number.isNaN(n));
        });
        return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
    };
    const getCaption = ({ starts, ends, applicableBrowseFieldNames, heading }) => {
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
            const startSep = Templates.resultsDisplayServerOrClient.startSeparator({ l });
            const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient.innerBrowseFieldSeparator({ l });

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
                return escapeHTML(Templates.resultsDisplayServerOrClient.ranges({ l, startRange, endVals, rangeNames }));
            };
            const ranges = buildRanges();
            caption = Templates.resultsDisplayServerOrClient.caption({ heading, ranges });
        }
        return [hasCaption, caption];
    };
    const runPresort = ({ presort, tableData, applicableBrowseFieldNames, localizedFieldNames }) => {
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
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias
    }) => {
        return fieldInfo.map(({ field, plugin }) => {
            if (plugin) {
                return;
            }
            const { preferAlias, fieldValueAliasMap } = getFieldNameAndValueAliases({
                field, schemaItems, metadataObj, getFieldAliasOrName, lang
            });
            if (!usePreferAlias) {
                return preferAlias !== false ? fieldValueAliasMap : undefined;
            }
            if (fieldValueAliasMap) {
                Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        fieldValueAliasMap[key] = val.map(value => Templates.resultsDisplayServerOrClient.fieldValueAlias({ key, value }));
                        return;
                    }
                    if (val && typeof val === 'object') {
                        if (usePreferAlias && typeof preferAlias === 'string') {
                            fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                key, value: val[preferAlias]
                            });
                        } else {
                            Object.entries(val).forEach(([k, value]) => {
                                fieldValueAliasMap[key][k] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                    key, value
                                });
                            });
                        }
                        return;
                    }
                    fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({ key, value: val });
                });
                return preferAlias !== false ? fieldValueAliasMap : undefined;
            }
        });
    };
    const $pRaw = (param, avoidLog) => {
        // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)
        let key;
        const p = $p.get(param, true);
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
            });
        }
        reverseLocaleLookup(imfLocales);
        if (!key && !avoidLog) {
            console.log('Bad param/value', param, '::', p);
        }
        return key; // || p; // $p.get(param, true);
    };
    const escapeQuotedCSS = s => s.replace(/"/g, '\\"');
    const escapeCSS = escapeHTML;
    const $pRawEsc = param => escapeHTML($pRaw(param));
    const $pEscArbitrary = param => escapeHTML($p.get(param, true));

    const {
        fileData, lf, getFieldAliasOrName, schemaObj, metadataObj,
        pluginsForWork
    } = await getWorkData({
        files: files || this.files,
        allowPlugins: allowPlugins || this.allowPlugins,
        lang, fallbackLanguages, $p,
        basePath
    });
    console.log('pluginsForWork', pluginsForWork);

    const heading = getMetaProp(lang, metadataObj, 'heading');
    const schemaItems = schemaObj.items.items;

    const setNames = [];
    const presorts = [];
    const browseFieldSets = [];
    getBrowseFieldData({
        metadataObj, schemaItems, getFieldAliasOrName, lang,
        callback({ setName, browseFields, presort }) {
            setNames.push(setName);
            presorts.push(presort);
            browseFieldSets.push(browseFields);
        }
    });

    const fieldInfo = schemaItems.map(({ title: field, format }) => {
        return {
            field,
            fieldAliasOrName: getFieldAliasOrName(field) || field,
            escapeColumn: format !== 'html',
            fieldLang: metadataObj.fields[field].lang
        };
    });

    const [preferredLocale] = lang;
    const metadata = new Metadata({ metadataObj });
    if (pluginsForWork) {
        console.log('pluginsForWork', pluginsForWork);
        const { lang } = this; // array with first item as preferred
        pluginsForWork.iterateMappings(({
            plugin,
            pluginName, pluginLang,
            onByDefaultDefault,
            placement, applicableFields, meta
        }) => {
            placement = placement === 'end' ? Infinity // push
            : placement;
            const processField = ({ applicableField, targetLanguage, onByDefault, metaApplicableField } = {}) => {
                const plugin = pluginsForWork.getPluginObject(pluginName);
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
    const fieldLangs = fieldInfo.map(({ fieldLang }) => {
        return fieldLang !== preferredLocale ? fieldLang : null;
    });
    const fieldValueAliasMap = getFieldValueAliasMap({
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: false
    });
    const fieldValueAliasMapPreferred = getFieldValueAliasMap({
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: true
    });

    // Todo: Repeats some code in workDisplay; probably need to reuse
    //   these functions more in `Templates.resultsDisplayServerOrClient` too
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
    const il = localizeParamNames ? key => l(['params', key]) : key => key;
    const iil = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;
    const ilRaw = localizeParamNames ? (key, suffix = '') => $p.get(il(key) + suffix, true) : (key, suffix = '') => $p.get(key + suffix, true);
    const iilRaw = localizeParamNames ? (key, suffix = '') => $p.get($p.get('work') + '-' + iil(key) + suffix, true) : (key, suffix = '') => $p.get($p.get('work') + '-' + key + suffix, true);

    // Now that we know `browseFieldSets`, we can parse `startEnd`
    const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) => typeof iilRaw('startEnd', i + 1) === 'string');
    if (browseFieldSetStartEndIdx !== -1) {
        // Todo: i18nize (by work and/or by whole app?)
        const rangeSep = '-';
        const partSep = ':';

        // Search box functionality (Todo: not yet in UI)
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
                startPartVals.push(...Array(-startEndDiff).fill('1'));
            }
            console.log('startPartVals', startPartVals);
            console.log('endPartVals', endPartVals);
            startPartVals.forEach((startPartVal, i) => {
                const endPartVal = endPartVals[i];
                $p.set(`start${browseFieldSetStartEndIdx + 1}-${i + 1}`, startPartVal, true);
                $p.set(`end${browseFieldSetStartEndIdx + 1}-${i + 1}`, endPartVal, true);
            });
        }
    }

    const browseFieldSetIdx = browseFieldSets.findIndex((item, i) => typeof iilRaw('start', i + 1 + '-1') === 'string');
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
        starts, ends, applicableBrowseFieldNames, heading
    });
    const showInterlinTitles = $pRaw('interlintitle') === '1';

    console.log('rand', ilRaw('rand') === 'yes');

    const stripToRawFieldValue = (v, i) => {
        const val = getRawFieldValue(v);
        return fieldSchemaTypes[i] === 'integer' ? parseInt(val, 10) : val;
    };
    const unlocalizedWorkName = fileData.name;

    const stripToTextOnly = part => {
        return part.replace(/ \(\d+\)$/, ''); // Remove that added to autocomplete aliases used for start/end values
    };
    const startsTextOnly = starts.map(stripToTextOnly);
    const endsTextOnly = ends.map(stripToTextOnly);

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
            req.onsuccess = ({ target: { result: db } }) => {
                const storeName = 'files-to-cache-' + unlocalizedWorkName;
                const trans = db.transaction(storeName);
                const store = trans.objectStore(storeName);
                // Get among browse field sets by index number within URL params
                const index = store.index('browseFields-' + applicableBrowseFieldSetName);

                // console.log('dbName', dbName);
                // console.log('storeName', storeName);
                // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

                const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));
                r.onsuccess = ({ target: { result } }) => {
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
                resolved: { data: tableData }
            } = await JsonRefs.resolveRefs(fileData.file));
            runPresort({ presort, tableData, applicableBrowseFieldNames, localizedFieldNames });
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
        fieldInfo.forEach(({ plugin, placement }, j) => {
            if (!plugin) {
                return;
            }
            tableData.forEach((tr, i) => {
                // Todo: We should pass on other arguments (like `meta` but on `applicableFields`)
                tr.splice(placement, 0, null // `${i}-${j}`);
                );
            });
        });
        fieldInfo.forEach(({ plugin, applicableField, fieldLang, meta, metaApplicableField }, j) => {
            if (!plugin) {
                return;
            }
            const applicableFieldIdx = fieldInfo.findIndex(({ field }) => {
                return field === applicableField;
            });
            // Now safe to pass (and set) `j` value as tr array expanded
            tableData.forEach((tr, i) => {
                const applicableFieldText = tr[applicableFieldIdx];
                tr[j] = plugin.getCellData({
                    tr, tableData, i, j, applicableField,
                    applicableFieldIdx, applicableFieldText, fieldLang,
                    meta, metaApplicableField, $p, thisObj: this
                });
            });
            console.log('applicableFieldIdx', applicableFieldIdx);
        });
    }

    const localeDir = rtlDetect_3(preferredLocale);
    const fieldDirs = fieldLangs.map(langCode => {
        if (!langCode) {
            return null;
        }
        const langDir = rtlDetect_3(langCode);
        return langDir !== localeDir ? langDir : null;
    });

    const templateArgs = {
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs, fieldDirs,
        caption, hasCaption, showInterlinTitles,
        determineEnd: determineEnd({
            applicableBrowseFieldNames,
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames,
            startsTextOnly, endsTextOnly
        }),
        canonicalBrowseFieldSetName,
        getCanonicalID: determineEnd({
            canonicalBrowseFieldNames,
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames,
            startsTextOnly, endsTextOnly
        }),
        getCellValue: getCellValue({
            fieldValueAliasMapPreferred, escapeColumnIndexes, escapeHTML
        }),
        checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
            localizedFieldNames
        }),
        interlinearSeparator: this.interlinearSeparator
    };
    return {
        fieldInfo,
        $p,
        applicableBrowseFieldSet, fieldValueAliasMapPreferred,
        lf, iil, ilRaw, browseFieldSets,
        lang, metadataObj, fileData,
        templateArgs
    };
};

/* eslint-env browser */

function TextBrowser(options) {
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    // Todo: Replace the `languages` default with `import.meta`
    //  (`new URL('../appdata/languages.json', moduleURL).href`?) once
    //  implemented; https://github.com/tc39/proposal-import-meta
    const moduleURL = new URL('node_modules/textbrowser/resources/index.js', location);
    this.site = options.site || 'site.json';

    setServiceWorkerDefaults(this, options);

    this.allowPlugins = options.allowPlugins;
    this.dynamicBasePath = options.dynamicBasePath;
    this.trustFormatHTML = options.trustFormatHTML;
    this.requestPersistentStorage = options.requestPersistentStorage;
    this.localizeParamNames = options.localizeParamNames === undefined ? true : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.interlinearSeparator = options.interlinearSeparator;
    // Todo: Make these user facing options
    this.showEmptyInterlinear = options.showEmptyInterlinear;
    this.showTitleOnSingleInterlinear = options.showTitleOnSingleInterlinear;
    this.noDynamic = options.noDynamic;
    this.skipIndexedDB = options.skipIndexedDB;
    this.stylesheets = (options.stylesheets || ['@builtin']).map(s => {
        return s === '@builtin' ? new URL('index.css', moduleURL).href : s;
    });
}

TextBrowser.prototype.workDisplay = workDisplay;
TextBrowser.prototype.resultsDisplayClient = resultsDisplayClient$1;

TextBrowser.prototype.init = async function () {
    this._stylesheetElements = await loadStylesheets(this.stylesheets);
    return this.displayLanguages();
};

TextBrowser.prototype.displayLanguages = async function () {
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    try {
        const [langData, siteData] = await simpleGetJson([this.languages, this.site]);
        this.langData = langData;
        this.siteData = siteData;

        const p = this.paramChange();

        // INIT/ADD EVENTS
        // With `hashchange` more generic than `popstate`, we use it
        //  and just check `history.state`
        window.addEventListener('hashchange', () => this.paramChange());

        return p;
    } catch (err) {
        dialogs.alert(err);
    }
};

TextBrowser.prototype.getWorkFiles = getWorkFiles;

TextBrowser.prototype.getWorkData = function (opts) {
    try {
        return getWorkData(_extends({}, opts, {
            files: this.files,
            allowPlugins: this.allowPlugins
        }));
    } catch (err) {
        dialogs.alert('catch:' + err);
    }
};

// Need for directionality even if language specified (and we don't want
//   to require it as a param)
// Todo: Use rtl-detect (already included)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    const langs = this.langData.languages;
    const exactMatch = langs.find(lang => lang.code === code);
    return exactMatch && exactMatch.direction || langs.find(lang => lang.code.startsWith(code + '-'));
};

TextBrowser.prototype.getFieldNameAndValueAliases = function (args) {
    return getFieldNameAndValueAliases(_extends({}, args, { lang: this.lang }));
};

TextBrowser.prototype.getBrowseFieldData = function (args) {
    return getBrowseFieldData(_extends({}, args, { lang: this.lang }));
};

async function prepareForServiceWorker(langs) {
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
            const { errorType } = err;
            if (errorType === 'versionChange') {
                Templates.permissions.versionChange();
                return;
            }
        }
        Templates.permissions.errorRegistering(escapeHTML(err && err.message));
    }
}

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
                case 'default':
                    resolve();
                    return;
                case 'granted':
                    if (navigator.serviceWorker.controller) {
                        resolve();
                        return;
                    }
                    // Has own error-handling
                    await prepareForServiceWorker.call(this, langs);
            }
        };
        const [, requestPermissionsDialog, browserNotGrantingPersistenceAlert] = // , errorRegisteringNotice
        Templates.permissions.main({
            l, ok, refuse, close, closeBrowserNotGranting
        });
        requestPermissionsDialog.showModal();
    });
}

TextBrowser.prototype.paramChange = async function () {
    document.body.replaceWith(Templates.defaultBody());

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = typeof history.state === 'string' ? new IntlURLSearchParams({ params: history.state }) : new IntlURLSearchParams(); // Uses URL hash for params

    const followParams = (formSelector, cb) => {
        const form = document.querySelector(formSelector);
        // Record current URL along with state
        const url = location.href.replace(/#.*$/, '') + '#' + $p.toString();
        history.replaceState(serialize(form, { hash: true }), document.title, url);
        // Get and set new state within URL
        cb();
        location.hash = '#' + $p.toString();
    };

    const languages = new Languages({
        langData: this.langData
    });

    const {
        lang, langs, languageParam, fallbackLanguages
    } = languages.getLanguageInfo({ $p });
    this.lang = lang;

    const [preferredLocale] = lang;
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    document.dir = direction;
    const refusedIndexedDB =
    // User may have persistence via bookmarks, etc. but just not
    //     want commital on notification
    // Notification.permission === 'default' ||

    // We always expect a controller, so is probably first visit
    localStorage.getItem(this.namespace + '-refused');

    // This check goes further than `Notification.permission === 'granted'`
    //   to see whether the browser actually considers the notification
    //   sufficient to grant persistence (as it is supposed to do).
    const getSiteI18n = () => {
        const localeFromSiteData = lan => this.siteData['localization-strings'][lan];
        const imfSite = dist({
            locales: lang.map(localeFromSiteData),
            fallbackLocales: fallbackLanguages.map(localeFromSiteData)
        });
        return imfSite.getFormatter();
    };

    let siteI18n;
    const result = $p.get('result');

    // Todo: For now, we won't give opportunity to store offline on
    //    results page. We could add a small button to open a dialog,
    //    but then it'd show up in each results window, making it less
    //    embed-friendly. Probably best to implement
    //    navigation bar/breadcrumbs, with option on work display page on
    //    whether to show or not; also ensure we have navigation
    //    bar/breadcrumbs on all non-results pages
    const persistent = await navigator.storage.persisted();

    const r = await navigator.serviceWorker.getRegistration(this.serviceWorkerPath);

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
            siteI18n = getSiteI18n();
            // Note: In Chrome on 127.0.0.1 (but not localhost!),
            //        this always appears to be `true`, despite having
            //        no notifications enabled or bookmarking 127.0.0.1,
            //        or being on the main page per
            //        https://developers.google.com/web/updates/2016/06/persistent-storage
            if (persistent) {
                // No need to ask permissions (e.g., if user bookmarked site instead),
                //   but we do need a worker
                Templates.permissions.main({ l: siteI18n });
                await prepareForServiceWorker.call(this, langs);
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
        siteI18n = getSiteI18n();
        const worker = r.installing || r.waiting || r.active;
        if (!worker) {
            // Todo: Why wouldn't there be a worker here?
            console.error('Unexpected error: worker registration received without a worker.');
            // If anything, would probably need to register though
            await register();
            return;
        }

        Templates.permissions.main({ l: siteI18n });

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
                    r, langs,
                    languages: this.languages,
                    logger: Templates.permissions
                });
            } catch (err) {
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
                // eslint-disable-line no-fallthrough
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
                navigator.serviceWorker.onmessage({ data: 'finishActivate' });
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
        }
    }

    Templates.permissions.exitDialogs();
    if (!languageParam) {
        const languageSelect = l => {
            $p.l10n = l;
            // Also can use l('chooselanguage'), but assumes locale
            //   as with page title
            document.title = l('browser-title');
            Templates.languageSelect.main({
                langs, languages, followParams, $p
            });
        };
        const l = siteI18n || getSiteI18n();
        languageSelect(l);
        return;
    }
    document.documentElement.lang = preferredLocale;

    const localeCallback = (l /* defineFormatter */) => {
        this.l10n = l;
        $p.l10n = l;

        const work = $p.get('work');
        if (!work) {
            workSelect({
                // l,
                files: this.files,
                lang, fallbackLanguages,
                $p, followParams
            });
            return true;
        }
        if (!result) {
            this.workDisplay({
                l,
                lang, preferredLocale,
                fallbackLanguages,
                $p, languages
            });
            return true;
        }
        return false;
    };
    return getIMFFallbackResults({
        $p,
        lang, langs,
        langData: this.langData,
        fallbackLanguages,
        resultsDisplay: opts => {
            const noIndexedDB = refusedIndexedDB || !navigator.serviceWorker.controller; // No worker from which IndexedDB is available;
            return this.resultsDisplayClient(_extends({
                langData: this.langData
            }, opts, {
                noIndexedDB,
                dynamicBasePath: this.dynamicBasePath,
                files: this.files,
                allowPlugins: this.allowPlugins
            }));
        },
        localeCallback
    });
};

export default TextBrowser;
