#!/usr/bin/env node
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 *
 *
 * @author Jerry Bendy <jerry@icewingcc.com>
 * @licence MIT
 *
 */

(function (self) {

    var nativeURLSearchParams = self.URLSearchParams ? self.URLSearchParams : null,
        isSupportObjectConstructor = nativeURLSearchParams && new nativeURLSearchParams({ a: 1 }).toString() === 'a=1',

    // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
    decodesPlusesCorrectly = nativeURLSearchParams && new nativeURLSearchParams('s=%2B').get('s') === '+',
        __URLSearchParams__ = "__URLSearchParams__",

    // Fix bug in Edge which cannot encode ' &' correctly
    encodesAmpersandsCorrectly = nativeURLSearchParams ? function () {
        var ampersandTest = new nativeURLSearchParams();
        ampersandTest.append('s', ' &');
        return ampersandTest.toString() === 's=+%26';
    }() : true,
        prototype = URLSearchParamsPolyfill.prototype,
        iterable = !!(self.Symbol && self.Symbol.iterator);

    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
        return;
    }

    /**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */
    function URLSearchParamsPolyfill(search) {
        search = search || "";

        // support construct object with another URLSearchParams instance
        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
            search = search.toString();
        }
        this[__URLSearchParams__] = parseToDict(search);
    }

    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.append = function (name, value) {
        appendTo(this[__URLSearchParams__], name, value);
    };

    /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */
    prototype.delete = function (name) {
        delete this[__URLSearchParams__][name];
    };

    /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */
    prototype.get = function (name) {
        var dict = this[__URLSearchParams__];
        return name in dict ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */
    prototype.getAll = function (name) {
        var dict = this[__URLSearchParams__];
        return name in dict ? dict[name].slice(0) : [];
    };

    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    prototype.has = function (name) {
        return name in this[__URLSearchParams__];
    };

    /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.set = function set(name, value) {
        this[__URLSearchParams__][name] = ['' + value];
    };

    /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */
    prototype.toString = function () {
        var dict = this[__URLSearchParams__],
            query = [],
            i,
            key,
            name,
            value;
        for (key in dict) {
            name = encode(key);
            for (i = 0, value = dict[key]; i < value.length; i++) {
                query.push(name + '=' + encode(value[i]));
            }
        }
        return query.join('&');
    };

    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
    var forSureUsePolyfill = !decodesPlusesCorrectly;
    var useProxy = !forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy;
    /*
     * Apply polifill to global object and append other prototype into it
     */
    self.URLSearchParams = useProxy ?
    // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
    new Proxy(nativeURLSearchParams, {
        construct: function (target, args) {
            return new target(new URLSearchParamsPolyfill(args[0]).toString());
        }
    }) : URLSearchParamsPolyfill;

    var USPProto = self.URLSearchParams.prototype;

    USPProto.polyfill = true;

    /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */
    USPProto.forEach = USPProto.forEach || function (callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function (name) {
            dict[name].forEach(function (value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    /**
     * Sort all name-value pairs
     */
    USPProto.sort = USPProto.sort || function () {
        var dict = parseToDict(this.toString()),
            keys = [],
            k,
            i,
            j;
        for (k in dict) {
            keys.push(k);
        }
        keys.sort();

        for (i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i],
                values = dict[key];
            for (j = 0; j < values.length; j++) {
                this.append(key, values[j]);
            }
        }
    };

    /**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.keys = USPProto.keys || function () {
        var items = [];
        this.forEach(function (item, name) {
            items.push(name);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.values = USPProto.values || function () {
        var items = [];
        this.forEach(function (item) {
            items.push(item);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.entries = USPProto.entries || function () {
        var items = [];
        this.forEach(function (item, name) {
            items.push([name, item]);
        });
        return makeIterator(items);
    };

    if (iterable) {
        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
    }

    function encode(str) {
        var replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function (match) {
            return replace[match];
        });
    }

    function decode(str) {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    }

    function makeIterator(arr) {
        var iterator = {
            next: function () {
                var value = arr.shift();
                return { done: value === undefined, value: value };
            }
        };

        if (iterable) {
            iterator[self.Symbol.iterator] = function () {
                return iterator;
            };
        }

        return iterator;
    }

    function parseToDict(search) {
        var dict = {};

        if (typeof search === "object") {
            for (var key in search) {
                if (search.hasOwnProperty(key)) {
                    appendTo(dict, key, search[key]);
                }
            }
        } else {
            // remove first '?'
            if (search.indexOf("?") === 0) {
                search = search.slice(1);
            }

            var pairs = search.split("&");
            for (var j = 0; j < pairs.length; j++) {
                var value = pairs[j],
                    index = value.indexOf('=');

                if (-1 < index) {
                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));
                } else {
                    if (value) {
                        appendTo(dict, decode(value), '');
                    }
                }
            }
        }

        return dict;
    }

    function appendTo(dict, name, value) {
        var val = typeof value === 'string' ? value : value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value);

        if (name in dict) {
            dict[name].push(val);
        } else {
            dict[name] = [val];
        }
    }
})(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : commonjsGlobal);

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

// From https://github.com/brettz9/jamilih/blob/master/polyfills/XMLSerializer.js
/* globals DOMException */
/**
* Currently applying not only as a polyfill for IE but for other browsers in order to ensure consistent serialization. For example,
*  its serialization method is serializing attributes in alphabetical order despite Mozilla doing so in document order since
* IE does not appear to otherwise give a readily determinable order
* @license MIT, GPL, Do what you want
* @requires polyfill: Array.from
* @requires polyfill: Array.prototype.map
* @requires polyfill: Node.prototype.lookupNamespaceURI
* @todo NOT COMPLETE! Especially for namespaces
*/
const XMLSerializer$1 = function () {};
const xhtmlNS = 'http://www.w3.org/1999/xhtml';
const emptyElements = '|basefont|frame|isindex' + // Deprecated
'|area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|',
      nonEmptyElements = 'article|aside|audio|bdi|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|rp|rt|ruby|section|summary|time|video' + // new in HTML5
'html|body|p|h1|h2|h3|h4|h5|h6|form|button|fieldset|label|legend|select|option|optgroup|textarea|table|tbody|colgroup|tr|td|tfoot|thead|th|caption|abbr|acronym|address|b|bdo|big|blockquote|center|code|cite|del|dfn|em|font|i|ins|kbd|pre|q|s|samp|small|strike|strong|sub|sup|tt|u|var|ul|ol|li|dd|dl|dt|dir|menu|frameset|iframe|noframes|head|title|a|map|div|span|style|script|noscript|applet|object|',
      pubIdChar = /^(\u0020|\u000D|\u000A|[a-zA-Z0-9]|[-'()+,./:=?;!*#@$_%])*$/,
      // eslint-disable-line no-control-regex
xmlChars = /([\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/; // eslint-disable-line no-control-regex

const entify = function (str) {
    // FIX: this is probably too many replaces in some cases and a call to it may not be needed at all in some cases
    return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};
const clone = function (obj) {
    // We don't need a deep clone, so this should be sufficient without recursion
    let prop;
    const newObj = {};
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop] = obj[prop];
        }
    }
    return JSON.parse(JSON.stringify(newObj));
};
const invalidStateError = function () {
    // These are probably only necessary if working with text/html
    {
        // INVALID_STATE_ERR per section 9.3 XHTML 5: http://www.w3.org/TR/html5/the-xhtml-syntax.html
        throw window.DOMException && DOMException.create ? DOMException.create(11)
        // If the (nonstandard) polyfill plugin helper is not loaded (e.g., to reduce overhead and/or modifying a global's property), we'll throw our own light DOMException
        : { message: 'INVALID_STATE_ERR: DOM Exception 11', code: 11 };
    }
};
const addExternalID = function (node, all) {
    if (node.systemId.includes('"') && node.systemId.includes("'")) {
        invalidStateError();
    }
    let string = '';
    const publicId = node.publicId !== 'undefined' && node.publicId,
          systemId = node.systemId !== 'undefined' && node.systemId,
          publicQuote = publicId && publicId.includes("'") ? "'" : '"',
          // Don't need to check for quotes here, since not allowed with public
    systemQuote = systemId && systemId.includes("'") ? "'" : '"'; // If as "entity" inside, will it return quote or entity? If former, we need to entify here (should be an error per section 9.3 of http://www.w3.org/TR/html5/the-xhtml-syntax.html )
    if (systemId && publicId) {
        string += ' PUBLIC ' + publicQuote + publicId + publicQuote + ' ' + systemQuote + systemId + systemQuote;
    } else if (publicId) {
        string += ' PUBLIC ' + publicQuote + publicId + publicQuote;
    } else if (all || systemId) {
        string += ' SYSTEM ' + systemQuote + systemId + systemQuote;
    }
    return string;
};
const notIEInsertedAttributes = function (att, node, nameVals) {
    return nameVals.every(function (nameVal) {
        const name = Array.isArray(nameVal) ? nameVal[0] : nameVal,
              val = Array.isArray(nameVal) ? nameVal[1] : null;
        return att.name !== name || val && att.value !== val ||
        // (!node.outerHTML.match(new RegExp(' ' + name + '=')));
        node.outerHTML.match(new RegExp(' ' + name + '=' + val ? '"' + val + '"' : ''));
    });
};
const serializeToString = function (nodeArg) {
    // if (nodeArg.xml) { // If this is genuine XML, IE should be able to handle it (and anyways, I am not sure how to override the prototype of XML elements in IE as we must do to add the likes of lookupNamespaceURI)
    //   return nodeArg.xml;
    // }
    const that = this,

    // Todo: Detect (since built-in lookupNamespaceURI() appears to always return null now for HTML elements),
    namespaces = {},
          nodeType = nodeArg.nodeType;
    let emptyElement;
    let htmlElement = true; // Todo: Make conditional on namespace?
    let string = '';
    let children = {};
    let i = 0;

    function serializeDOM(node, namespaces) {
        let children,
            tagName,
            tagAttributes,
            tagAttLen,
            opt,
            optionsLen,
            prefix,
            val,
            content,
            i,
            textNode,
            string = '';
        const nodeValue = node.nodeValue,
              type = node.nodeType;
        namespaces = clone(namespaces) || {}; // Ensure we're working with a copy, so different levels in the hierarchy can treat it differently

        if (node.prefix && node.prefix.includes(':') || node.localName && node.localName.includes(':')) {
            invalidStateError();
        }

        if ((type === 3 || type === 4 || type === 7 || type === 8) && !xmlChars.test(nodeValue) || type === 2 && !xmlChars.test(node.value) // Attr.nodeValue is now deprecated, so we use Attr.value
        ) {
                invalidStateError();
            }

        switch (type) {
            case 1:
                // ELEMENT
                tagName = node.tagName;

                {
                    tagName = tagName.toLowerCase();
                }

                if (that.$formSerialize) {
                    // Firefox serializes certain properties even if only set via JavaScript ("disabled", "readonly") and it sometimes even adds the "value" property in certain cases (<input type=hidden>)
                    if ('|input|button|object|'.includes('|' + tagName + '|')) {
                        if (node.value !== node.defaultValue) {
                            // May be undefined for an object, or empty string for input, etc.
                            node.setAttribute('value', node.value);
                        }
                        if (tagName === 'input' && node.checked !== node.defaultChecked) {
                            if (node.checked) {
                                node.setAttribute('checked', 'checked');
                            } else {
                                node.removeAttribute('checked');
                            }
                        }
                    } else if (tagName === 'select') {
                        for (i = 0, optionsLen = node.options.length; i < optionsLen; i++) {
                            opt = node.options[i];
                            if (opt.selected !== opt.defaultSelected) {
                                if (opt.selected) {
                                    opt.setAttribute('selected', 'selected');
                                } else {
                                    opt.removeAttribute('selected');
                                }
                            }
                        }
                    }
                }

                // Make this consistent, e.g., so browsers can be reliable in serialization

                // Attr.nodeName and Attr.nodeValue are deprecated as of DOM4 as Attr no longer inherits from Node, but we can safely use name and value
                tagAttributes = [].slice.call(node.attributes);

                // Were formally alphabetical in some browsers
                /* .sort(function (attr1, attr2) {
                    return attr1.name > attr2.name ? 1 : -1;
                }); */

                prefix = node.prefix;

                string += '<' + tagName;
                /**/
                // Do the attributes above cover our namespaces ok? What if unused but in the DOM?
                if (namespaces[prefix || '$'] === undefined) {
                    namespaces[prefix || '$'] = node.namespaceURI || xhtmlNS;
                    string += ' xmlns' + (prefix ? ':' + prefix : '') + '="' + entify(namespaces[prefix || '$']) + '"';
                }
                // */
                tagAttLen = tagAttributes.length;
                // Todo: optimize this by joining the for loops together but inserting into an array to sort
                /*
                // Used to be serialized first
                for (i = 0; i < tagAttLen; i++) {
                    if (tagAttributes[i].name.match(/^xmlns:\w*$/)) {
                        string += ' ' + tagAttributes[i].name + // .toLowerCase() +
                            '="' + entify(tagAttributes[i].value) + '"'; // .toLowerCase()
                    }
                }
                */
                for (i = 0; i < tagAttLen; i++) {
                    if (
                    // IE includes attributes like type=text even if not explicitly added as such
                    // Todo: Maybe we should ALWAYS apply instead of never apply in the case of type=text?
                    // Todo: Does XMLSerializer serialize properties in any browsers as well (e.g., if after setting an input.value); it does not in Firefox, but I think this could be very useful (especially since we are
                    // changing native behavior in Firefox anyways in order to sort attributes in a consistent manner
                    // with IE
                    notIEInsertedAttributes(tagAttributes[i], node, [['type', 'text'], 'colSpan', 'rowSpan', 'cssText', 'shape']) &&
                    // Had to add before
                    // && !tagAttributes[i].name.match(/^xmlns:?\w*$/) // Avoid adding these (e.g., from Firefox) as we add above
                    tagAttributes[i].name !== 'xmlns') {
                        // value = tagAttributes[i].value.split(/;\s+/).sort().join(' ');
                        // else { */
                        string += ' ' + tagAttributes[i].name + // .toLowerCase() +
                        '="' + entify(tagAttributes[i].value) + '"'; // .toLowerCase()
                    }
                }

                emptyElement = emptyElements.includes('|' + tagName + '|');
                htmlElement = node.namespaceURI === xhtmlNS || nonEmptyElements.includes('|' + tagName + '|'); // || emptyElement;

                if (!node.firstChild && (emptyElement || !htmlElement)) {
                    // string += mode === 'xml' || node.namespaceURI !== xhtmlNS ? ' />' : '>';
                    string += (htmlElement ? ' ' : '') + '/>';
                } else {
                    string += '>';
                    children = node.childNodes;
                    // Todo: After text nodes are only entified in XML, could change this first block to insist on document.createStyleSheet
                    if (tagName === 'script' || tagName === 'style') {
                        if (tagName === 'script' && (node.type === '' || node.type === 'text/javascript')) {
                            string += document.createStyleSheet ? node.text : node.textContent;
                            // serializeDOM(document.createTextNode(node.text), namespaces);
                        } else if (tagName === 'style') {
                            // serializeDOM(document.createTextNode(node.cssText), namespaces);
                            string += document.createStyleSheet ? node.cssText : node.textContent;
                        }
                    } else {
                        if (that.$formSerialize && tagName === 'textarea') {
                            textNode = document.createTextNode(node.value);
                            children = [textNode];
                        }
                        for (i = 0; i < children.length; i++) {
                            string += serializeDOM(children[i], namespaces);
                        }
                    }
                    string += '</' + tagName + '>';
                }
                break;
            case 2:
                // ATTRIBUTE (should only get here if passing in an attribute node)
                return ' ' + node.name + // .toLowerCase() +
                '="' + entify(node.value) + '"'; // .toLowerCase()
            case 3:
                // TEXT
                return entify(nodeValue); // Todo: only entify for XML
            case 4:
                // CDATA
                if (nodeValue.includes(']]' + '>')) {
                    invalidStateError();
                }
                return '<' + '![CDATA[' + nodeValue + ']]' + '>';
            case 5:
                // ENTITY REFERENCE (probably not used in browsers since already resolved)
                return '&' + node.nodeName + ';';
            case 6:
                // ENTITY (would need to pass in directly)
                val = '';
                content = node.firstChild;

                if (node.xmlEncoding) {
                    // an external entity file?
                    string += '<?xml ';
                    if (node.xmlVersion) {
                        string += 'version="' + node.xmlVersion + '" ';
                    }
                    string += 'encoding="' + node.xmlEncoding + '"' + '?>';

                    if (!content) {
                        return '';
                    }
                    while (content) {
                        val += content.nodeValue; // FIX: allow for other entity types
                        content = content.nextSibling;
                    }
                    return string + content; // reconstruct external entity file, if this is that
                }
                string += '<' + '!ENTITY ' + node.nodeName + ' ';
                if (node.publicId || node.systemId) {
                    // External Entity?
                    string += addExternalID(node);
                    if (node.notationName) {
                        string += ' NDATA ' + node.notationName;
                    }
                    string += '>';
                    break;
                }

                if (!content) {
                    return '';
                }
                while (content) {
                    val += content.nodeValue; // FIX: allow for other entity types
                    content = content.nextSibling;
                }
                string += '"' + entify(val) + '">';
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
                return '<?' + node.target + ' ' + nodeValue + '?>';
            case 8:
                // COMMENT
                if (nodeValue.includes('--') || nodeValue.length && nodeValue.lastIndexOf('-') === nodeValue.length - 1) {
                    invalidStateError();
                }
                return '<' + '!--' + nodeValue + '-->';
            case 9:
                // DOCUMENT (handled earlier in script)
                break;
            case 10:
                // DOCUMENT TYPE
                string += '<' + '!DOCTYPE ' + node.name;
                if (!pubIdChar.test(node.publicId)) {
                    invalidStateError();
                }
                string += addExternalID(node) + (node.internalSubset ? '[\n' + node.internalSubset + '\n]' : '') + '>\n';
                /* Fit in internal subset along with entities?: probably don't need as these would only differ if from DTD, and we're not rebuilding the DTD
                var notations = node.notations;
                if (notations) {
                    for (i=0; i < notations.length; i++) {
                        serializeDOM(notations[0], namespaces);
                    }
                }
                */
                // UNFINISHED
                break;
            case 11:
                // DOCUMENT FRAGMENT (handled earlier in script)
                break;
            case 12:
                // NOTATION (would need to be passed in directly)
                return '<' + '!NOTATION ' + node.nodeName + addExternalID(node, true) + '>';
            default:
                throw new Error('Not an XML type');
        }
        return string;
    }

    if (document.xmlVersion && nodeType === 9) {
        // DOCUMENT - Faster to do it here without first calling serializeDOM
        string += '<?xml version="' + document.xmlVersion + '"';
        if (document.xmlEncoding !== undefined && document.xmlEncoding !== null) {
            string += ' encoding="' + document.xmlEncoding + '"';
        }
        if (document.xmlStandalone !== undefined) {
            // Could configure to only output if "yes"
            string += ' standalone="' + (document.xmlStandalone ? 'yes' : 'no') + '"';
        }
        string += '?>\n';
    }
    if (nodeType === 9 || nodeType === 11) {
        // DOCUMENT & DOCUMENT FRAGMENT - Faster to do it here without first calling serializeDOM
        children = nodeArg.childNodes;
        for (i = 0; i < children.length; i++) {
            string += serializeDOM(children[i], namespaces); // children[i].cloneNode(true)
        }
        return string;
    }
    // While safer to clone to avoid modifying original DOM, we need to iterate over properties to obtain textareas and select menu states (if they have been set dynamically) and these states are lost upon cloning (even though dynamic setting of input boxes is not lost to the DOM)
    // See http://stackoverflow.com/a/21060052/271577 and:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=197294
    // https://bugzilla.mozilla.org/show_bug.cgi?id=230307
    // https://bugzilla.mozilla.org/show_bug.cgi?id=237783
    // nodeArg = nodeArg.cloneNode(true);
    return serializeDOM(nodeArg, namespaces);
};

XMLSerializer$1.prototype.serializeToString = serializeToString;

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

const $ = sel => doc.querySelector(sel);
const $$ = sel => [...doc.querySelectorAll(sel)];

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
        const j = Array.isArray(childNodeJML) ? jml(...childNodeJML) : jml(childNodeJML);
        cn.parentNode.replaceChild(j, cn);
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
                                template = $(template);
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
                        // Todo: Conditionally create XML document
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
                            if (attVal.$DOCTYPE) {
                                const dt = { $DOCTYPE: attVal.$DOCTYPE };
                                const doctype = jml(dt);
                                node.firstChild.replaceWith(doctype);
                            }
                            const html = node.childNodes[1];
                            const head = html.childNodes[0];
                            const body = html.childNodes[1];
                            if (attVal.title || attVal.head) {
                                const meta = doc.createElement('meta');
                                meta.setAttribute('charset', 'utf-8');
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
                        nodes[nodes.length] = node;
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
                            node = doc.implementation.createDocumentType(attVal.name, attVal.publicId || '', attVal.systemId || '');
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
        elem = typeof elem === 'string' ? $(elem) : elem;
        return super.get.call(this, elem);
    }
    set(elem, value) {
        elem = typeof elem === 'string' ? $(elem) : elem;
        return super.set.call(this, elem, value);
    }
    invoke(elem, methodName, ...args) {
        elem = typeof elem === 'string' ? $(elem) : elem;
        return this.get(elem)[methodName](elem, ...args);
    }
}
class JamilihWeakMap extends WeakMap {
    get(elem) {
        elem = typeof elem === 'string' ? $(elem) : elem;
        return super.get(elem);
    }
    set(elem, value) {
        elem = typeof elem === 'string' ? $(elem) : elem;
        return super.set(elem, value);
    }
    invoke(elem, methodName, ...args) {
        elem = typeof elem === 'string' ? $(elem) : elem;
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
    elem = typeof elem === 'string' ? $(elem) : elem;
    return elem[typeof sym === 'symbol' ? sym : Symbol.for(sym)];
};

jml.command = function (elem, symOrMap, methodName, ...args) {
    elem = typeof elem === 'string' ? $(elem) : elem;
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
    if (docum && docum.body) {
        body = docum.body;
    }
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

let body = doc && doc.body;

const nbsp = '\u00a0'; // Very commonly needed in templates

/* eslint-env node */

// import {JSDOM} from 'jsdom';
const { JSDOM } = require('jsdom');

const win$1 = new JSDOM('').window;

jml.setWindow(win$1);
jml.setDocument(win$1.document);
// jml.setXMLSerializer(require('xmldom').XMLSerializer);
jml.setXMLSerializer(XMLSerializer$1);

// get successful control from form and assemble into object

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
        }, langs.map(({ code }) => ['option', { value: code }, [languages.getLanguageFromCode(code)]])]], body);
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
    ), body
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
    ]]), body);
    if (history.state && typeof history.state === 'object') {
        deserialize(document.querySelector('#workSelect'), history.state);
    }
    return form;
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
const fonts = ['Helvetica, sans-serif', 'Verdana, sans-serif', 'Gill Sans, sans-serif', 'Avantgarde, sans-serif', 'Helvetica Narrow, sans-serif', 'sans-serif', 'Times, serif', 'Times New Roman, serif', 'Palatino, serif', 'Bookman, serif', 'New Century Schoolbook, serif', 'serif', 'Andale Mono, monospace', 'Courier New, monospace', 'Courier, monospace', 'Lucidatypewriter, monospace', 'Fixed, monospace', 'monospace', 'Comic Sans, Comic Sans MS, cursive', 'Zapf Chancery, cursive', 'Coronetscript, cursive', 'Florence, cursive', 'Parkavenue, cursive', 'cursive', 'Impact, fantasy', 'Arnoldboecklin, fantasy', 'Oldtown, fantasy', 'Blippo, fantasy', 'Brushstroke, fantasy', 'fantasy'];

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

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
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
            checked: $p.get(checkedIndex) !== l('no') && ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
            type: 'checkbox'
        })]), le('check-sequence', 'td', 'title', {}, [['select', { name: iil('field') + idx, id: fieldIndex, size: '1' }, fieldInfo.map(({ field, fieldAliasOrName }, j) => {
            const matchedFieldParam = fieldParam && fieldParam === fieldAliasOrName;
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
                    const url = serializeParamsAsURL(_extends({}, getDataForSerializingParamsAsURL(), {
                        type: 'randomResult'
                    }));
                    $('#randomURL').value = url;
                }
            }
        }), ['input', { id: 'randomURL', type: 'text' }]]]]].forEach(addRowContent);
    },
    getPreferences: ({
        languageParam, lf, paramsSetter, replaceHash,
        getFieldAliasOrNames, work,
        langs, imfl, l, localizeParamNames, namespace,
        hideFormattingSection, groups
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
    })]]], ['div', [['button', {
        title: l('bookmark_generation_tooltip'),
        $on: {
            async click() {
                // Todo: Give option to edit (keywords and work URLs)
                const date = new Date().getTime();
                const ADD_DATE = date;
                const LAST_MODIFIED = date;
                const blob = new Blob([new XMLSerializer().serializeToString(jml({ $document: {
                        $DOCTYPE: { name: 'NETSCAPE-Bookmark-file-1' },
                        title: l('Bookmarks'),
                        body: [['h1', [l('Bookmarks_Menu')]], ...(await getFieldAliasOrNames()).flatMap(({ groupName, worksToFields }) => {
                            return [['dt', [['h3', {
                                ADD_DATE,
                                LAST_MODIFIED
                            }, [groupName]]]], ['dl', [['p'], ...worksToFields.map(({ fieldAliasOrNames, workName, shortcut: SHORTCUTURL }) => {
                                // Todo (low): Add anchor, etc. (until handled by `work-startEnd`); &aqdas-anchor1-1=2&anchorfield1=Paragraph
                                // Todo: option for additional browse field groups (startEnd2, etc.)
                                // Todo: For link text, use `heading` or `alias` from metadata files in place of workName (requires loading all metadata files though)
                                // Todo: Make Chrome NativeExt add-on to manipulate its search engines (to read a bookmarks file from Firefox properly, i.e., including keywords) https://www.makeuseof.com/answers/export-google-chrome-search-engines-address-bar/

                                const paramsCopy = paramsSetter(_extends({}, getDataForSerializingParamsAsURL(), {
                                    fieldAliasOrNames,
                                    workName: work, // Delete work of current page
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
                    } })).replace(
                // Chrome has a quirk that requires this (and not
                //   just any whitespace)
                // We're not getting the keywords with Chrome,
                //   but at least usable for bookmarks (though
                //   not the groups apparently)
                /<dt>/g, '\n<dt>')], { type: 'text/html' });
                const url = window.URL.createObjectURL(blob);
                const a = jml('a', {
                    hidden: true,
                    download: 'bookmarks.html',
                    href: url
                }, body);
                a.click();
                URL.revokeObjectURL(url);
            }
        }
    }, [l('Generate_bookmarks')]]]]]],
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
        lf, languageParam,
        l, namespace, heading, fallbackDirection, imfl, langs, fieldInfo, localizeParamNames,
        serializeParamsAsURL, paramsSetter, replaceHash,
        getFieldAliasOrNames,
        hideFormattingSection, $p,
        metadataObj, il, le, ld, iil, fieldMatchesLocale,
        preferredLocale, schemaItems, content, groups
    }) => {
        const work = $p.get('work');
        const serializeParamsAsURLWithData = ({ type }) => {
            return serializeParamsAsURL(_extends({}, getDataForSerializingParamsAsURL(), { type }));
        };
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
            languageParam, lf, paramsSetter, replaceHash,
            getFieldAliasOrNames, work,
            langs, imfl, l, localizeParamNames, namespace,
            groups, hideFormattingSection
        })]], ['h2', [heading]], ['br'], ['form', { id: 'browse', $custom: {
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
            }, $on: {
                keydown({ key, target }) {
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
            }, name: il('browse') }, [['table', { align: 'center' }, content], ['br'], ['div', { style: 'margin-left: 20px' }, [['br'], ['br'], ['table', { border: '1', align: 'center', cellpadding: '5' }, [['tr', { valign: 'top' }, [['td', [Templates.workDisplay.columnsTable({
            ld, fieldInfo, $p, le, iil, l,
            metadataObj, preferredLocale, schemaItems,
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
        }), ['input', { id: 'settings-URL' }], ['br'], ['button', {
            $on: {
                async click(e) {
                    e.preventDefault();
                    const paramsCopy = paramsSetter(_extends({}, getDataForSerializingParamsAsURL(), {
                        workName: work, // Delete work of current page
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
            type: 'submit'
        })]]]]], body);
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
        const tableWrap = children => tableWithFixedHeaderAndFooter ? ['div', { class: 'table-responsive anchor-table-header zupa' }, [['div', { class: 'table-responsive anchor-table-body' }, children]]] : ['div', { class: 'table-responsive' }, children];

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

const $$1 = sel => document.querySelector(sel);

const $e = (el, descendentsSel) => {
    el = typeof el === 'string' ? $$1(el) : el;
    return el.querySelector(descendentsSel);
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
        const dialog = jml('dialog', atts, children, body);
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
                    } } }, [this.localeStrings.ok]]]]] : [])], body);
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
                    } } }, [this.localeStrings.cancel]]]]], body);
            dialogPolyfill.registerDialog(dialog);
            dialog.showModal();
        });
    }
}
const dialogs = new Dialog();

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
        jml(...html, body);
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
        // We empty rather than `replaceWith` as our Jamilih `body` aliases
        //   expect the old instance
        while (body.hasChildNodes()) {
            body.firstChild.remove();
        }
        return jml(body, { style: 'height: 100%;' });
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
        jml('div', { id: 'dialogContainer', style: 'height: 100%' }, [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice], body);

        return [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice];
    }
};

const escapeHTML = s => {
    return !s ? '' : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;');
};

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

/* eslint-env browser */
// Keep this as the last import for Rollup
const JsonRefs = require('json-refs');

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

var getJSON = (async function getJSON(jsonURL, cb, errBack) {
    try {
        if (Array.isArray(jsonURL)) {
            const arrResult = await Promise.all(jsonURL.map(url => getJSON(url)));
            if (cb) {
                cb.apply(null, arrResult);
            }
            return arrResult;
        }
        const result = await fetch(jsonURL).then(r => r.json());
        return typeof cb === 'function' ? cb(result) : result;
    } catch (e) {
        e.message += ` (File: ${jsonURL})`;
        if (errBack) {
            return errBack(e, jsonURL);
        }
        throw e;
    }
});

/* globals global, require */
if (typeof fetch === 'undefined') {
    global.fetch = jsonURL => {
        return new Promise((resolve, reject) => {
            const { XMLHttpRequest } = require('local-xmlhttprequest'); // Don't change to an import as won't resolve for browser testing
            const r = new XMLHttpRequest();
            r.open('GET', jsonURL, true);
            // r.responseType = 'json';
            r.onreadystatechange = function () {
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
            r.send();
        });
    };
}

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

var extend_1 = extend;
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
var hop_1 = hop;



var utils = {
	extend: extend_1,
	hop: hop_1
};

var es5 = createCommonjsModule(function (module, exports) {



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
    } else if (!utils.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (utils.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate;


});
var es5_1 = es5.defineProperty;
var es5_2 = es5.objCreate;

var compiler = createCommonjsModule(function (module, exports) {

exports["default"] = Compiler;

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


});

var parser = createCommonjsModule(function (module, exports) {

exports["default"] = function () {

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
        peg$c4 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c5 = "{",
        peg$c6 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c7 = ",",
        peg$c8 = { type: "literal", value: ",", description: "\",\"" },
        peg$c9 = "}",
        peg$c10 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c11 = function (id, format) {
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
        peg$c18 = function (type, style) {
      return {
        type: type + 'Format',
        style: style && style[2],
        location: location()
      };
    },
        peg$c19 = "plural",
        peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
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
        peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
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
        peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c27 = function (options) {
      return {
        type: 'selectFormat',
        options: options,
        location: location()
      };
    },
        peg$c28 = "=",
        peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c30 = function (selector, pattern) {
      return {
        type: 'optionalFormatPattern',
        selector: selector,
        value: pattern,
        location: location()
      };
    },
        peg$c31 = "offset:",
        peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
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
        peg$c47 = function (digits) {
      return parseInt(digits, 10);
    },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c50 = "\\\\",
        peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c52 = function () {
      return '\\';
    },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function () {
      return '\\#';
    },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function () {
      return '\u007B';
    },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function () {
      return '\u007D';
    },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function (digits) {
      return String.fromCharCode(parseInt(digits, 16));
    },
        peg$c65 = function (chars) {
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


});

var intlMessageformatParser = createCommonjsModule(function (module, exports) {

exports = module.exports = parser['default'];
exports['default'] = exports;
});

var core = createCommonjsModule(function (module, exports) {


exports["default"] = MessageFormat;

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
    es5.defineProperty(this, '_locale', { value: this._resolveLocale(locales) });

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
es5.defineProperty(MessageFormat, 'formats', {
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
es5.defineProperty(MessageFormat, '__localeData__', { value: es5.objCreate(null) });
es5.defineProperty(MessageFormat, '__addLocaleData', { value: function (data) {
        if (!(data && data.locale)) {
            throw new Error('Locale data provided to IntlMessageFormat is missing a ' + '`locale` property');
        }

        MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
    } });

// Defines `__parse()` static method as an exposed private.
es5.defineProperty(MessageFormat, '__parse', { value: intlMessageformatParser["default"].parse });

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
es5.defineProperty(MessageFormat, 'defaultLocale', {
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
    var compiler$$1 = new compiler["default"](locales, formats, pluralFn);
    return compiler$$1.compile(ast);
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
        if (!(values && utils.hop.call(values, id))) {
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
        if (!utils.hop.call(defaults, type)) {
            continue;
        }

        mergedFormats[type] = mergedType = es5.objCreate(defaults[type]);

        if (formats && utils.hop.call(formats, type)) {
            utils.extend(mergedType, formats[type]);
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


});

var en = createCommonjsModule(function (module, exports) {

exports["default"] = { "locale": "en", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
  } };


});

var main = createCommonjsModule(function (module, exports) {



core["default"].__addLocaleData(en["default"]);
core["default"].defaultLocale = 'en';

exports["default"] = core["default"];


});

// GENERATED FILE
var IntlMessageFormat = core["default"];

IntlMessageFormat.__addLocaleData({ "locale": "af", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "af-NA", "parentLocale": "af" });
IntlMessageFormat.__addLocaleData({ "locale": "agq", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ak", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "am", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ar", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);if (ord) return "other";return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 99 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ar-AE", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-BH", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-DJ", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-DZ", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-EG", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-EH", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-ER", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-IL", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-IQ", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-JO", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-KM", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-KW", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-LB", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-LY", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-MA", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-MR", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-OM", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-PS", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-QA", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-SA", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-SD", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-SO", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-SS", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-SY", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-TD", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-TN", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "ar-YE", "parentLocale": "ar" });
IntlMessageFormat.__addLocaleData({ "locale": "as", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "asa", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ast", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "az", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        i1000 = i.slice(-3);if (ord) return i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8 || i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80 ? "one" : i10 == 3 || i10 == 4 || i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900 ? "few" : i == 0 || i10 == 6 || i100 == 40 || i100 == 60 || i100 == 90 ? "many" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "az-Arab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "az-Cyrl", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "az-Latn", "parentLocale": "az" });
IntlMessageFormat.__addLocaleData({ "locale": "bas", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "be", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? "few" : "other";return n10 == 1 && n100 != 11 ? "one" : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? "few" : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bem", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bez", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bm", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bm-Nkoo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bn", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bn-IN", "parentLocale": "bn" });
IntlMessageFormat.__addLocaleData({ "locale": "bo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bo-IN", "parentLocale": "bo" });
IntlMessageFormat.__addLocaleData({ "locale": "br", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        n1000000 = t0 && s[0].slice(-6);if (ord) return "other";return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? "one" : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? "two" : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? "few" : n != 0 && t0 && n1000000 == 0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "brx", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bs", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bs-Cyrl", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "bs-Latn", "parentLocale": "bs" });
IntlMessageFormat.__addLocaleData({ "locale": "ca", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return n == 1 || n == 3 ? "one" : n == 2 ? "two" : n == 4 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ca-AD", "parentLocale": "ca" });
IntlMessageFormat.__addLocaleData({ "locale": "ca-ES-VALENCIA", "parentLocale": "ca-ES" });
IntlMessageFormat.__addLocaleData({ "locale": "ca-ES", "parentLocale": "ca" });
IntlMessageFormat.__addLocaleData({ "locale": "ca-FR", "parentLocale": "ca" });
IntlMessageFormat.__addLocaleData({ "locale": "ca-IT", "parentLocale": "ca" });
IntlMessageFormat.__addLocaleData({ "locale": "ce", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "cgg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "chr", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ckb", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ckb-IR", "parentLocale": "ckb" });
IntlMessageFormat.__addLocaleData({ "locale": "cs", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : i >= 2 && i <= 4 && v0 ? "few" : !v0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "cu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "cy", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 0 || n == 7 || n == 8 || n == 9 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n == 3 || n == 4 ? "few" : n == 5 || n == 6 ? "many" : "other";return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n == 3 ? "few" : n == 6 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "da", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        t0 = Number(s[0]) == n;if (ord) return "other";return n == 1 || !t0 && (i == 0 || i == 1) ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "da-GL", "parentLocale": "da" });
IntlMessageFormat.__addLocaleData({ "locale": "dav", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "de", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "de-AT", "parentLocale": "de" });
IntlMessageFormat.__addLocaleData({ "locale": "de-BE", "parentLocale": "de" });
IntlMessageFormat.__addLocaleData({ "locale": "de-CH", "parentLocale": "de" });
IntlMessageFormat.__addLocaleData({ "locale": "de-LI", "parentLocale": "de" });
IntlMessageFormat.__addLocaleData({ "locale": "de-LU", "parentLocale": "de" });
IntlMessageFormat.__addLocaleData({ "locale": "dje", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "dsb", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "dua", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "dv", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "dyo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "dz", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ebu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ee", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ee-TG", "parentLocale": "ee" });
IntlMessageFormat.__addLocaleData({ "locale": "el", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "el-CY", "parentLocale": "el" });
IntlMessageFormat.__addLocaleData({ "locale": "en", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "en-001", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-150", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-AG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-AI", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-AS", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-AT", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-AU", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BB", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BE", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BI", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BS", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BW", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-BZ", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CA", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CC", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CH", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CK", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CX", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-CY", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-DE", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-DG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-DK", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-DM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-Dsrt", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "en-ER", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-FI", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-FJ", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-FK", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-FM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GB", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GD", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GH", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GI", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GU", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-GY", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-HK", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-IE", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-IL", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-IM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-IN", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-IO", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-JE", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-JM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-KE", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-KI", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-KN", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-KY", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-LC", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-LR", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-LS", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MH", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MO", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MP", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MS", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MT", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MU", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MW", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-MY", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NA", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NF", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NL", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NR", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NU", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-NZ", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PH", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PK", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PN", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PR", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-PW", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-RW", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SB", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SC", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SD", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SE", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SH", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SI", "parentLocale": "en-150" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SL", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SS", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SX", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-SZ", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-Shaw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "en-TC", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-TK", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-TO", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-TT", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-TV", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-TZ", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-UG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-UM", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-US", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-VC", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-VG", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-VI", "parentLocale": "en" });
IntlMessageFormat.__addLocaleData({ "locale": "en-VU", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-WS", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-ZA", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-ZM", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "en-ZW", "parentLocale": "en-001" });
IntlMessageFormat.__addLocaleData({ "locale": "eo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "es", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "es-419", "parentLocale": "es" });
IntlMessageFormat.__addLocaleData({ "locale": "es-AR", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-BO", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-CL", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-CO", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-CR", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-CU", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-DO", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-EA", "parentLocale": "es" });
IntlMessageFormat.__addLocaleData({ "locale": "es-EC", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-GQ", "parentLocale": "es" });
IntlMessageFormat.__addLocaleData({ "locale": "es-GT", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-HN", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-IC", "parentLocale": "es" });
IntlMessageFormat.__addLocaleData({ "locale": "es-MX", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-NI", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-PA", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-PE", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-PH", "parentLocale": "es" });
IntlMessageFormat.__addLocaleData({ "locale": "es-PR", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-PY", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-SV", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-US", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-UY", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "es-VE", "parentLocale": "es-419" });
IntlMessageFormat.__addLocaleData({ "locale": "et", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "eu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ewo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fa", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fa-AF", "parentLocale": "fa" });
IntlMessageFormat.__addLocaleData({ "locale": "ff", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n < 2 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ff-CM", "parentLocale": "ff" });
IntlMessageFormat.__addLocaleData({ "locale": "ff-GN", "parentLocale": "ff" });
IntlMessageFormat.__addLocaleData({ "locale": "ff-MR", "parentLocale": "ff" });
IntlMessageFormat.__addLocaleData({ "locale": "fi", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fil", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);if (ord) return n == 1 ? "one" : "other";return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fo-DK", "parentLocale": "fo" });
IntlMessageFormat.__addLocaleData({ "locale": "fr", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : "other";return n >= 0 && n < 2 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fr-BE", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-BF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-BI", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-BJ", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-BL", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CA", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CD", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CG", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CH", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CI", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-CM", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-DJ", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-DZ", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-GA", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-GF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-GN", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-GP", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-GQ", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-HT", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-KM", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-LU", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MA", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MC", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MG", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-ML", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MQ", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MR", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-MU", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-NC", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-NE", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-PF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-PM", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-RE", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-RW", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-SC", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-SN", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-SY", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-TD", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-TG", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-TN", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-VU", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-WF", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fr-YT", "parentLocale": "fr" });
IntlMessageFormat.__addLocaleData({ "locale": "fur", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "fy", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ga", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return n == 1 ? "one" : "other";return n == 1 ? "one" : n == 2 ? "two" : t0 && n >= 3 && n <= 6 ? "few" : t0 && n >= 7 && n <= 10 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "gd", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return "other";return n == 1 || n == 11 ? "one" : n == 2 || n == 12 ? "two" : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "gl", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "gsw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "gsw-FR", "parentLocale": "gsw" });
IntlMessageFormat.__addLocaleData({ "locale": "gsw-LI", "parentLocale": "gsw" });
IntlMessageFormat.__addLocaleData({ "locale": "gu", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "guw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "guz", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "gv", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);if (ord) return "other";return v0 && i10 == 1 ? "one" : v0 && i10 == 2 ? "two" : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? "few" : !v0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ha", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ha-Arab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ha-GH", "parentLocale": "ha" });
IntlMessageFormat.__addLocaleData({ "locale": "ha-NE", "parentLocale": "ha" });
IntlMessageFormat.__addLocaleData({ "locale": "haw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "he", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);if (ord) return "other";return n == 1 && v0 ? "one" : i == 2 && v0 ? "two" : v0 && (n < 0 || n > 10) && t0 && n10 == 0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "hi", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "hr", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "hr-BA", "parentLocale": "hr" });
IntlMessageFormat.__addLocaleData({ "locale": "hsb", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i100 = i.slice(-2),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "hu", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 || n == 5 ? "one" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "hy", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : "other";return n >= 0 && n < 2 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "id", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ig", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ii", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "in", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "is", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        t0 = Number(s[0]) == n,
        i10 = i.slice(-1),
        i100 = i.slice(-2);if (ord) return "other";return t0 && i10 == 1 && i100 != 11 || !t0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "it", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? "many" : "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "it-CH", "parentLocale": "it" });
IntlMessageFormat.__addLocaleData({ "locale": "it-SM", "parentLocale": "it" });
IntlMessageFormat.__addLocaleData({ "locale": "iu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "iu-Latn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "iw", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);if (ord) return "other";return n == 1 && v0 ? "one" : i == 2 && v0 ? "two" : v0 && (n < 0 || n > 10) && t0 && n10 == 0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ja", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "jbo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "jgo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ji", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "jmc", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "jv", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "jw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ka", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        i100 = i.slice(-2);if (ord) return i == 1 ? "one" : i == 0 || i100 >= 2 && i100 <= 20 || i100 == 40 || i100 == 60 || i100 == 80 ? "many" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n < 2 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kaj", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kam", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kcg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kde", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kea", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "khq", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ki", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kk", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1);if (ord) return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? "many" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kkj", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kl", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kln", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "km", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ko", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ko-KP", "parentLocale": "ko" });
IntlMessageFormat.__addLocaleData({ "locale": "kok", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ks", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ksb", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ksf", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ksh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 ? "zero" : n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ku", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "kw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ky", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lag", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0];if (ord) return "other";return n == 0 ? "zero" : (i == 0 || i == 1) && n != 0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lb", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lkt", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ln", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ln-AO", "parentLocale": "ln" });
IntlMessageFormat.__addLocaleData({ "locale": "ln-CF", "parentLocale": "ln" });
IntlMessageFormat.__addLocaleData({ "locale": "ln-CG", "parentLocale": "ln" });
IntlMessageFormat.__addLocaleData({ "locale": "lo", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lrc", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lrc-IQ", "parentLocale": "lrc" });
IntlMessageFormat.__addLocaleData({ "locale": "lt", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        f = s[1] || "",
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return "other";return n10 == 1 && (n100 < 11 || n100 > 19) ? "one" : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? "few" : f != 0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "luo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "luy", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "lv", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        f = s[1] || "",
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);if (ord) return "other";return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mas", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mas-TZ", "parentLocale": "mas" });
IntlMessageFormat.__addLocaleData({ "locale": "mer", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mfe", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mgh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mgo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mk", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1);if (ord) return i10 == 1 && i100 != 11 ? "one" : i10 == 2 && i100 != 12 ? "two" : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? "many" : "other";return v0 && i10 == 1 || f10 == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ml", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mn-Mong", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mo", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);if (ord) return n == 1 ? "one" : "other";return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mr", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ms", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ms-Arab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ms-BN", "parentLocale": "ms" });
IntlMessageFormat.__addLocaleData({ "locale": "ms-SG", "parentLocale": "ms" });
IntlMessageFormat.__addLocaleData({ "locale": "mt", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);if (ord) return "other";return n == 1 ? "one" : n == 0 || n100 >= 2 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 19 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mua", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "my", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "mzn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nah", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "naq", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nb", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nb-SJ", "parentLocale": "nb" });
IntlMessageFormat.__addLocaleData({ "locale": "nd", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ne", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return t0 && n >= 1 && n <= 4 ? "one" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ne-IN", "parentLocale": "ne" });
IntlMessageFormat.__addLocaleData({ "locale": "nl", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nl-AW", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nl-BE", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nl-BQ", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nl-CW", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nl-SR", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nl-SX", "parentLocale": "nl" });
IntlMessageFormat.__addLocaleData({ "locale": "nmg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nnh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "no", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nqo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nr", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nso", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nus", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ny", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "nyn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "om", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "om-KE", "parentLocale": "om" });
IntlMessageFormat.__addLocaleData({ "locale": "or", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "os", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "os-RU", "parentLocale": "os" });
IntlMessageFormat.__addLocaleData({ "locale": "pa", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pa-Arab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pa-Guru", "parentLocale": "pa" });
IntlMessageFormat.__addLocaleData({ "locale": "pap", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pl", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);if (ord) return "other";return n == 1 && v0 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "prg", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        f = s[1] || "",
        v = f.length,
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        f100 = f.slice(-2),
        f10 = f.slice(-1);if (ord) return "other";return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ps", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pt", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return "other";return t0 && n >= 0 && n <= 2 && n != 2 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pt-AO", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-PT", "parentLocale": "pt", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "pt-CV", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-GW", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-MO", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-MZ", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-ST", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "pt-TL", "parentLocale": "pt-PT" });
IntlMessageFormat.__addLocaleData({ "locale": "qu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "qu-BO", "parentLocale": "qu" });
IntlMessageFormat.__addLocaleData({ "locale": "qu-EC", "parentLocale": "qu" });
IntlMessageFormat.__addLocaleData({ "locale": "rm", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "rn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ro", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n100 = t0 && s[0].slice(-2);if (ord) return n == 1 ? "one" : "other";return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ro-MD", "parentLocale": "ro" });
IntlMessageFormat.__addLocaleData({ "locale": "rof", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ru", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2);if (ord) return "other";return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ru-BY", "parentLocale": "ru" });
IntlMessageFormat.__addLocaleData({ "locale": "ru-KG", "parentLocale": "ru" });
IntlMessageFormat.__addLocaleData({ "locale": "ru-KZ", "parentLocale": "ru" });
IntlMessageFormat.__addLocaleData({ "locale": "ru-MD", "parentLocale": "ru" });
IntlMessageFormat.__addLocaleData({ "locale": "ru-UA", "parentLocale": "ru" });
IntlMessageFormat.__addLocaleData({ "locale": "rw", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "rwk", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sah", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "saq", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sbp", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sdh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "se", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "se-FI", "parentLocale": "se" });
IntlMessageFormat.__addLocaleData({ "locale": "se-SE", "parentLocale": "se" });
IntlMessageFormat.__addLocaleData({ "locale": "seh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ses", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sg", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sh", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "shi", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return "other";return n >= 0 && n <= 1 ? "one" : t0 && n >= 2 && n <= 10 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "shi-Latn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "shi-Tfng", "parentLocale": "shi" });
IntlMessageFormat.__addLocaleData({ "locale": "si", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "";if (ord) return "other";return n == 0 || n == 1 || i == 0 && f == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sk", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : i >= 2 && i <= 4 && v0 ? "few" : !v0 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sl", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        i100 = i.slice(-2);if (ord) return "other";return v0 && i100 == 1 ? "one" : v0 && i100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || !v0 ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sma", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "smi", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "smj", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "smn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sms", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : n == 2 ? "two" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "so", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "so-DJ", "parentLocale": "so" });
IntlMessageFormat.__addLocaleData({ "locale": "so-ET", "parentLocale": "so" });
IntlMessageFormat.__addLocaleData({ "locale": "so-KE", "parentLocale": "so" });
IntlMessageFormat.__addLocaleData({ "locale": "sq", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return n == 1 ? "one" : n10 == 4 && n100 != 14 ? "many" : "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sq-MK", "parentLocale": "sq" });
IntlMessageFormat.__addLocaleData({ "locale": "sq-XK", "parentLocale": "sq" });
IntlMessageFormat.__addLocaleData({ "locale": "sr", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        i100 = i.slice(-2),
        f10 = f.slice(-1),
        f100 = f.slice(-2);if (ord) return "other";return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Cyrl", "parentLocale": "sr" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Cyrl-BA", "parentLocale": "sr-Cyrl" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Cyrl-ME", "parentLocale": "sr-Cyrl" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Cyrl-XK", "parentLocale": "sr-Cyrl" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Latn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Latn-BA", "parentLocale": "sr-Latn" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Latn-ME", "parentLocale": "sr-Latn" });
IntlMessageFormat.__addLocaleData({ "locale": "sr-Latn-XK", "parentLocale": "sr-Latn" });
IntlMessageFormat.__addLocaleData({ "locale": "ss", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ssy", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "st", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sv", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? "one" : "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sv-AX", "parentLocale": "sv" });
IntlMessageFormat.__addLocaleData({ "locale": "sv-FI", "parentLocale": "sv" });
IntlMessageFormat.__addLocaleData({ "locale": "sw", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "sw-CD", "parentLocale": "sw" });
IntlMessageFormat.__addLocaleData({ "locale": "sw-KE", "parentLocale": "sw" });
IntlMessageFormat.__addLocaleData({ "locale": "sw-UG", "parentLocale": "sw" });
IntlMessageFormat.__addLocaleData({ "locale": "syr", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ta", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ta-LK", "parentLocale": "ta" });
IntlMessageFormat.__addLocaleData({ "locale": "ta-MY", "parentLocale": "ta" });
IntlMessageFormat.__addLocaleData({ "locale": "ta-SG", "parentLocale": "ta" });
IntlMessageFormat.__addLocaleData({ "locale": "te", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "teo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "teo-KE", "parentLocale": "teo" });
IntlMessageFormat.__addLocaleData({ "locale": "th", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ti", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ti-ER", "parentLocale": "ti" });
IntlMessageFormat.__addLocaleData({ "locale": "tig", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tk", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tl", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        f = s[1] || "",
        v0 = !s[1],
        i10 = i.slice(-1),
        f10 = f.slice(-1);if (ord) return n == 1 ? "one" : "other";return v0 && (i == 1 || i == 2 || i == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "to", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tr", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tr-CY", "parentLocale": "tr" });
IntlMessageFormat.__addLocaleData({ "locale": "ts", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "twq", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "tzm", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        t0 = Number(s[0]) == n;if (ord) return "other";return n == 0 || n == 1 || t0 && n >= 11 && n <= 99 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ug", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "uk", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2),
        i10 = i.slice(-1),
        i100 = i.slice(-2);if (ord) return n10 == 3 && n100 != 13 ? "few" : "other";return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ur", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "ur-IN", "parentLocale": "ur" });
IntlMessageFormat.__addLocaleData({ "locale": "uz", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "uz-Arab", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "uz-Cyrl", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "uz-Latn", "parentLocale": "uz" });
IntlMessageFormat.__addLocaleData({ "locale": "vai", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "vai-Latn", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "vai-Vaii", "parentLocale": "vai" });
IntlMessageFormat.__addLocaleData({ "locale": "ve", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "vi", "pluralRuleFunction": function (n, ord) {
    if (ord) return n == 1 ? "one" : "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "vo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "vun", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "wa", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 0 || n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "wae", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "wo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "xh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "xog", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n == 1 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "yav", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "yi", "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."),
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "yo", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "yo-BJ", "parentLocale": "yo" });
IntlMessageFormat.__addLocaleData({ "locale": "zgh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "zh", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hans", "parentLocale": "zh" });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hans-HK", "parentLocale": "zh-Hans" });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hans-MO", "parentLocale": "zh-Hans" });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hans-SG", "parentLocale": "zh-Hans" });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hant", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return "other";
  } });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hant-HK", "parentLocale": "zh-Hant" });
IntlMessageFormat.__addLocaleData({ "locale": "zh-Hant-MO", "parentLocale": "zh-Hant-HK" });
IntlMessageFormat.__addLocaleData({ "locale": "zu", "pluralRuleFunction": function (n, ord) {
    if (ord) return "other";return n >= 0 && n <= 1 ? "one" : "other";
  } });

var intlMessageformat = createCommonjsModule(function (module, exports) {

var IntlMessageFormat = main['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.


// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;
});

// If strawman approved, this would only be

function IMFClass(opts) {
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

    const loadFallbacks = cb => {
        this.loadLocales(this.fallbackLanguages, function (...fallbackLocales) {
            this.fallbackLocales.push(...fallbackLocales);
            if (cb) {
                return cb(fallbackLocales);
            }
        }, true);
    };

    if (opts.languages || opts.callback) {
        this.loadLocales(opts.languages, () => {
            const locales = Array.from(arguments);
            const runCallback = fallbackLocales => {
                if (opts.callback) {
                    opts.callback.apply(this, [this.getFormatter(opts.namespace), this.getFormatter.bind(this), locales, fallbackLocales]);
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
    function messageForNSParts(locale, namesp, separator, key) {
        let loc = locale;
        const found = namesp.split(separator).every(function (nsPart) {
            loc = loc[nsPart];
            return loc && typeof loc === 'object';
        });
        return found && loc[key] ? loc[key] : '';
    }
    const isArray = Array.isArray;

    ns = ns === undefined ? this.defaultNamespace : ns;
    sep = sep === undefined ? this.defaultSeparator : sep;
    ns = isArray(ns) ? ns.join(sep) : ns;

    return (key, values, formats, fallback) => {
        let message;
        let currNs = ns;
        if (key && !isArray(key) && typeof key === 'object') {
            values = key.values;
            formats = key.formats;
            fallback = key.fallback;
            key = key.key;
        }
        if (isArray(key)) {
            // e.g., [ns1, ns2, key]
            const newKey = key.pop();
            currNs = key.join(sep);
            key = newKey;
        } else {
            const keyPos = key.indexOf(sep);
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
        findMessage(this.locales);
        if (!message) {
            if (typeof fallback === 'function') {
                return fallback({
                    message: this.fallbackLocales.length && findMessage(this.fallbackLocales),
                    langs: this.langs,
                    namespace: currNs,
                    separator: sep,
                    key,
                    values,
                    formats
                });
            }
            if (fallback !== false) {
                return this.fallbackLocales.length && findMessage(this.fallbackLocales);
            }
            throw new Error('Message not found for locales ' + this.langs + (this.fallbackLanguages ? ' (with fallback languages ' + this.fallbackLanguages + ')' : '') + ' with key ' + key + ', namespace ' + currNs + ', and namespace separator ' + sep);
        }
        if (!values && !formats) {
            return message;
        }
        const msg = new intlMessageformat(message, this.langs, formats);
        return msg.format(values);
    };
};

IMFClass.prototype.loadLocales = function (langs, cb, avoidSettingLocales) {
    langs = langs || navigator.language || 'en-US';
    langs = Array.isArray(langs) ? langs : [langs];
    if (!avoidSettingLocales) {
        this.langs = langs;
    }
    return getJSON(langs.map(this.localeFileResolver, this), (...locales) => {
        if (!avoidSettingLocales) {
            this.locales.push(...locales);
        }
        if (cb) {
            cb.apply(this, locales);
        }
    });
};

/* eslint-env node */

if (typeof global !== 'undefined') {
    global.IntlMessageFormat = intlMessageformat;
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
    lang, fallbackLanguages, work, files, allowPlugins, basePath,
    languages, preferredLocale
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
    });
    // This is not specific to the work, but we export it anyways
    const groupsToWorks = filesObj.groups.map(fg => {
        return {
            name: lf({ key: fg.name.localeKey, fallback: true }),
            workNames: fg.files.map(file => {
                return lf(['workNames', fg.id, file.name]);
            }),
            shortcuts: fg.files.map(file => file.shortcut)
        };
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
            return Promise.resolve().then(() => require(pluginPath)).catch(err => {
                // E.g., with tooltips plugin
                console.log('err', err);
            });
        }
        return Promise.resolve().then(() => interopRequireWildcard(require(`${pluginPath}`)));
    })) : null]);
    const pluginsForWork = new PluginsForWork({
        pluginsInWork, pluginFieldMappings, pluginObjects
    });
    const schemaItems = schemaObj.items.items;
    const fieldInfo = schemaItems.map(({ title: field }) => {
        return {
            field,
            fieldAliasOrName: getFieldAliasOrName(field) || field
        };
    });
    const metadata = new Metadata({ metadataObj });
    if (languages && // Avoid all this processing if this is not the specific call requiring
    pluginsForWork) {
        console.log('pluginsForWork', pluginsForWork);
        const { lang } = this; // array with first item as preferred
        pluginsForWork.iterateMappings(({
            plugin,
            pluginName, pluginLang,
            onByDefaultDefault,
            placement, applicableFields, meta
        }) => {
            const processField = ({ applicableField, targetLanguage, onByDefault, metaApplicableField } = {}) => {
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
    return {
        fileData, lf, getFieldAliasOrName, metadataObj,
        schemaObj, schemaItems, fieldInfo,
        pluginsForWork, groupsToWorks, metadata
    };
};

/* eslint-env browser */
// Keep this as the last import for Rollup
const JsonRefs$1 = require('json-refs');

const fieldValueAliasRegex = /^.* \((.*?)\)$/;

const getRawFieldValue = v => typeof v === 'string' ? v.replace(fieldValueAliasRegex, '$1') : v;

const resultsDisplayServer = async function resultsDisplayServer(args) {
    const {
        templateArgs
    } = await resultsDisplayServerOrClient$1.call(this, _extends({}, args));
    // Todo: Should really reconcile this with client-side output options
    //         (as should also have option there to get JSON, Jamilih, etc.
    //         output)
    switch (args.serverOutput) {
        case 'json':default:
            return templateArgs.tableData;
        case 'jamilih':
            return Templates.resultsDisplayServerOrClient.main(templateArgs);
        case 'html':
            const jamilih = Templates.resultsDisplayServerOrClient.main(templateArgs);
            return jml.toHTML(...jamilih);
    }
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
    const getCanonicalID = ({
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        canonicalBrowseFieldNames
    }) => ({
        tr, foundState
    }) => {
        return canonicalBrowseFieldNames.map(fieldName => {
            const idx = localizedFieldNames.indexOf(fieldName);
            // This works to put alias in anchor but this includes
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
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        applicableBrowseFieldNames, startsRaw, endsRaw
    }) => ({
        tr, foundState
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
            if (fieldValueAliasMap[idx] !== undefined) {
                rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
            }
            rowIDPartsPreferred.push(tr[idx]);
            return tr[idx];
        });

        // Todo: Use schema to determine field type and use `parseInt`
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
                        if (typeof preferAlias === 'string') {
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
        lang, fallbackLanguages,
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

        // Search box functionality (Todo: not yet in UI); should first
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
                startPartVals.push(...Array(-startEndDiff).fill('1'));
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
        let val;
        if (v.match(/^\d+$/) || v.match(fieldValueAliasRegex)) {
            val = getRawFieldValue(v);
        } else {
            const rawFieldValueAliasMap = applicableBrowseFieldSet[i].rawFieldValueAliasMap;
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
                    });
                } else {
                    fvEntries.some(([key, obj]) => {
                        const arr = Object.values(obj);
                        if (arr.includes(v)) {
                            dealiased = key;
                            return true;
                        }
                    });
                }
            }
            val = dealiased === undefined ? v : dealiased;
        }
        return fieldSchemaTypes[i] === 'integer' ? parseInt(val, 10) : val;
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
            } = await JsonRefs$1.resolveRefs(fileData.file));
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
                tr[j] = plugin.getCellData && plugin.getCellData({
                    tr, tableData, i, j, applicableField, fieldInfo,
                    applicableFieldIdx, applicableFieldText, fieldLang,
                    meta, metaApplicableField, $p, thisObj: this
                }) || applicableFieldText;
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
            startsRaw, endsRaw
        }),
        canonicalBrowseFieldSetName,
        getCanonicalID: getCanonicalID({
            canonicalBrowseFieldNames,
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames
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
        const imf = IMFClass({
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

/* eslint-env node */
// import activateCallback from '../resources/activateCallback.js';

const fetch$1 = require('node-fetch'); // Problems as `import` since 2.1.2
const setGlobalVars = require('indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node.js');

// Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event

const optionDefinitions = [
// Node-server-specific
{ name: 'nodeActivate', type: Boolean }, { name: 'port', type: Number },

// Results display (main)
//      `namespace`: (but set below)
//      `skipIndexedDB`: set to `false` below (and the default anyways)
//      `noDynamic`: not used
//      `prefI18n`: will instead be set dynamically per user query
//      `files`: Already set below for service worker
{ name: 'interlinearSeparator', type: String }, { name: 'localizeParamNames', type: Boolean }, { name: 'trustFormatHTML', type: Boolean }, { name: 'allowPlugins', type: Boolean },

// Results display (template)
{ name: 'showEmptyInterlinear', type: Boolean }, { name: 'showTitleOnSingleInterlinear', type: Boolean },

// Service worker
{ name: 'domain', type: String }, { name: 'serviceWorkerPath', type: String, defaultOption: true }, { name: 'userJSON', type: String }, { name: 'languages', type: String }, { name: 'files', type: String }, { name: 'namespace', type: String }];
const userParams = require('command-line-args')(optionDefinitions);

const port = 'port' in userParams ? userParams.port : 8000;
const domain = userParams.domain || `localhost`;
const basePath = `http://${domain}${port ? ':' + port : ''}/`;

const userParamsWithDefaults = _extends({}, userParams, setServiceWorkerDefaults(_extends({}, userParams), {
    namespace: 'bahaiwritings',
    files: userParams.files || `${basePath}files.json`, // `files` must be absolute path for node-fetch
    languages: userParams.languages || `${basePath}node_modules/textbrowser/appdata/languages.json`,
    serviceWorkerPath: userParams.serviceWorkerPath || `${basePath}sw.js?pathToUserJSON=${encodeURIComponent(userParams.userJSON)}`
}), {
    log(...args) {
        console.log(...args);
    },
    basePath,
    nodeActivate: undefined,
    port: undefined,
    skipIndexedDB: false, // Not relevant here
    noDynamic: false // Not relevant here
    /*
    Not in use:
    logger: {
        addLogEntry ({text}) {
            console.log(`Log: ${text}`);
        },
        dbError ({
            type,
            escapedErrorMessage
        }) {
            throw new Error(`Worker aborted: error type ${type}; ${escapedErrorMessage}`);
        }
    } */
});
console.log('userParamsWithDefaults', userParamsWithDefaults);

setGlobalVars(null, {
    checkOrigin: false
}); // Adds `indexedDB` and `IDBKeyRange` to global in Node

if (userParams.nodeActivate) {
    global.fetch = fetch$1;
    // const activateCallback = require('../resources/activateCallback.js');
    const activateCallback = require('../dist/activateCallback-umd.js');
    (async () => {
        await activateCallback(userParamsWithDefaults);
        console.log('Activated');
    })();
}
console.log('past activate check');

const http = require('http');
const url = require('url');

global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const statik = require('node-static');
const fileServer = new statik.Server(); // Pass path; otherwise uses current directory

let langData, languagesInstance;
(async () => {
    langData = await getJSON(userParamsWithDefaults.languages);
    languagesInstance = new Languages({ langData });
})();

const srv = http.createServer(async (req, res) => {
    // console.log('URL::', url.parse(req.url));
    const { pathname, query } = url.parse(req.url);
    if (pathname !== '/textbrowser' || !query) {
        req.addListener('end', function () {
            if (pathname.includes('.git')) {
                req.url = '/index.html';
            }
            fileServer.serve(req, res);
        }).resume();
        /*
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>File not found</h1>');
        */
        return;
    }
    const languages = req.headers['accept-language'].replace(/;q=.*?$/, '').split(',');
    global.navigator = {
        language: languages[0],
        languages
    };
    const $p = new IntlURLSearchParams({
        params: query
    });

    const { lang, langs, fallbackLanguages } = languagesInstance.getLanguageInfo({ $p });

    getIMFFallbackResults({
        $p,
        basePath,
        lang, langs, fallbackLanguages,
        langData,
        async resultsDisplay(resultsArgs, ...args) {
            const serverOutput = $p.get('serverOutput', true);
            const isHTML = serverOutput === 'html';
            res.writeHead(200, { 'Content-Type': isHTML ? 'text/html;charset=utf8' : 'application/json;charset=utf8'
            });
            resultsArgs = _extends({}, resultsArgs, {
                skipIndexedDB: false,
                serverOutput,
                langData,
                prefI18n: $p.get('prefI18n', true)
            });
            // Todo: Move sw-sample.js to bahaiwritings and test
            const result = await resultsDisplayServer.call(_extends({}, userParamsWithDefaults, { lang, langs, fallbackLanguages
            }), resultsArgs, ...args);
            res.end(isHTML ? result : JSON.stringify(result));
        }
    });
});
if (!userParams.domain) {
    srv.listen(port);
} else {
    srv.listen(port, userParams.domain);
}
