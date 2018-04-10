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

(function(self) {

    var nativeURLSearchParams = self.URLSearchParams ? self.URLSearchParams : null,
        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
        __URLSearchParams__ = "__URLSearchParams__",
        prototype = URLSearchParamsPolyfill.prototype,
        iterable = !!(self.Symbol && self.Symbol.iterator);

    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly) {
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
        this [__URLSearchParams__] = parseToDict(search);
    }


    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.append = function(name, value) {
        appendTo(this [__URLSearchParams__], name, value);
    };

    /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */
    prototype.delete = function(name) {
        delete this [__URLSearchParams__] [name];
    };

    /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */
    prototype.get = function(name) {
        var dict = this [__URLSearchParams__];
        return name in dict ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */
    prototype.getAll = function(name) {
        var dict = this [__URLSearchParams__];
        return name in dict ? dict [name].slice(0) : [];
    };

    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    prototype.has = function(name) {
        return name in this [__URLSearchParams__];
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
        this [__URLSearchParams__][name] = ['' + value];
    };

    /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */
    prototype.toString = function() {
        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
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
    var useProxy = (!forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy);
    /*
     * Apply polifill to global object and append other prototype into it
     */
    self.URLSearchParams = useProxy ?
        // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
        new Proxy(nativeURLSearchParams, {
            construct: function(target, args) {
                return new target((new URLSearchParamsPolyfill(args[0]).toString()));
            }
        }) :
        URLSearchParamsPolyfill;


    var USPProto = self.URLSearchParams.prototype;

    USPProto.polyfill = true;

    /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */
    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function(name) {
            dict[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    /**
     * Sort all name-value pairs
     */
    USPProto.sort = USPProto.sort || function() {
        var dict = parseToDict(this.toString()), keys = [], k, i, j;
        for (k in dict) {
            keys.push(k);
        }
        keys.sort();

        for (i = 0; i < keys.length; i++) {
            this.delete(keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i], values = dict[key];
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
    USPProto.keys = USPProto.keys || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push([name]);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.values = USPProto.values || function() {
        var items = [];
        this.forEach(function(item) {
            items.push([item]);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.entries = USPProto.entries || function() {
        var items = [];
        this.forEach(function(item, name) {
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
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
            return replace[match];
        });
    }

    function decode(str) {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    }

    function makeIterator(arr) {
        var iterator = {
            next: function() {
                var value = arr.shift();
                return {done: value === undefined, value: value};
            }
        };

        if (iterable) {
            iterator[self.Symbol.iterator] = function() {
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
                var value = pairs [j],
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
        var val = typeof value === 'string' ? value : (
            value !== null && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
        );

        if (name in dict) {
            dict[name].push(val);
        } else {
            dict[name] = [val];
        }
    }

})(typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : (typeof window !== 'undefined' ? window : commonjsGlobal));

function _prepareParam (param, skip) {
    if (skip || !this.localizeParamNames) { // (lang)
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

function IntlURLSearchParams (config) {
    config = config || {};
    this.l10n = config.l10n;
    let params = config.params;
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
const prohibitHTMLOnly = true,
    emptyElements = '|basefont|frame|isindex' + // Deprecated
    '|area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|',
    nonEmptyElements = 'article|aside|audio|bdi|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|rp|rt|ruby|section|summary|time|video' + // new in HTML5
    'html|body|p|h1|h2|h3|h4|h5|h6|form|button|fieldset|label|legend|select|option|optgroup|textarea|table|tbody|colgroup|tr|td|tfoot|thead|th|caption|abbr|acronym|address|b|bdo|big|blockquote|center|code|cite|del|dfn|em|font|i|ins|kbd|pre|q|s|samp|small|strike|strong|sub|sup|tt|u|var|ul|ol|li|dd|dl|dt|dir|menu|frameset|iframe|noframes|head|title|a|map|div|span|style|script|noscript|applet|object|',
    pubIdChar = /^(\u0020|\u000D|\u000A|[a-zA-Z0-9]|[-'()+,./:=?;!*#@$_%])*$/, // eslint-disable-line no-control-regex
    xmlChars = /([\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/; // eslint-disable-line no-control-regex

const entify = function (str) { // FIX: this is probably too many replaces in some cases and a call to it may not be needed at all in some cases
    return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};
const clone = function (obj) { // We don't need a deep clone, so this should be sufficient without recursion
    let prop;
    const newObj = {};
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop] = obj[prop];
        }
    }
    return JSON.parse(JSON.stringify(newObj));
};
const invalidStateError = function () { // These are probably only necessary if working with text/html
    if (prohibitHTMLOnly) {
        // INVALID_STATE_ERR per section 9.3 XHTML 5: http://www.w3.org/TR/html5/the-xhtml-syntax.html
        throw window.DOMException && DOMException.create
            ? DOMException.create(11)
            // If the (nonstandard) polyfill plugin helper is not loaded (e.g., to reduce overhead and/or modifying a global's property), we'll throw our own light DOMException
            : {message: 'INVALID_STATE_ERR: DOM Exception 11', code: 11};
    }
};
const addExternalID = function (node, all) {
    if (node.systemId.indexOf('"') !== -1 && node.systemId.indexOf("'") !== -1) {
        invalidStateError();
    }
    let string = '';
    const
        publicId = node.publicId,
        systemId = node.systemId,
        publicQuote = publicId && publicId.indexOf("'") !== -1 ? "'" : '"', // Don't need to check for quotes here, since not allowed with public
        systemQuote = systemId && systemId.indexOf("'") !== -1 ? "'" : '"'; // If as "entity" inside, will it return quote or entity? If former, we need to entify here (should be an error per section 9.3 of http://www.w3.org/TR/html5/the-xhtml-syntax.html )
    if (systemId !== null && publicId !== null) {
        string += ' PUBLIC ' + publicQuote + publicId + publicQuote + ' ' + systemQuote + systemId + systemQuote;
    } else if (publicId !== null) {
        string += ' PUBLIC ' + publicQuote + publicId + publicQuote;
    } else if (all || systemId !== null) {
        string += ' SYSTEM ' + systemQuote + systemId + systemQuote;
    }
    return string;
};
const notIEInsertedAttributes = function (att, node, nameVals) {
    return nameVals.every(function (nameVal) {
        const name = Array.isArray(nameVal) ? nameVal[0] : nameVal,
            val = Array.isArray(nameVal) ? nameVal[1] : null;
        return att.name !== name ||
            (val && att.value !== val) ||
            // (!node.outerHTML.match(new RegExp(' ' + name + '=')));
            (node.outerHTML.match(new RegExp(' ' + name + '=' + val ? '"' + val + '"' : '')));
    });
};
const serializeToString = function (nodeArg) {
    // if (nodeArg.xml) { // If this is genuine XML, IE should be able to handle it (and anyways, I am not sure how to override the prototype of XML elements in IE as we must do to add the likes of lookupNamespaceURI)
    //   return nodeArg.xml;
    // }
    const that = this,
        // mode = this.$mode || 'html',
        ieFix = true, // Todo: Make conditional on IE and processing of HTML
        mozilla = true, // Todo: Detect (since built-in lookupNamespaceURI() appears to always return null now for HTML elements),
        namespaces = {},
        xmlDeclaration = true,
        nodeType = nodeArg.nodeType;
    let emptyElement;
    let htmlElement = true; // Todo: Make conditional on namespace?
    let string = '';
    let children = {};
    let i = 0;

    function serializeDOM (node, namespaces) {
        let children, tagName, tagAttributes, tagAttLen, opt, optionsLen, prefix, val, content, i, textNode,
            string = '';
        const nodeValue = node.nodeValue,
            type = node.nodeType;
        namespaces = clone(namespaces) || {}; // Ensure we're working with a copy, so different levels in the hierarchy can treat it differently

        if ((node.prefix && node.prefix.indexOf(':') !== -1) || (node.localName && node.localName.indexOf(':') !== -1)) {
            invalidStateError();
        }

        if (
            ((type === 3 || type === 4 || type === 7 || type === 8) &&
                !xmlChars.test(nodeValue)) ||
            ((type === 2) && !xmlChars.test(node.value)) // Attr.nodeValue is now deprecated, so we use Attr.value
        ) {
            invalidStateError();
        }

        switch (type) {
        case 1: // ELEMENT
            tagName = node.tagName;

            if (ieFix) {
                tagName = tagName.toLowerCase();
            }

            if (that.$formSerialize) {
                // Firefox serializes certain properties even if only set via JavaScript ("disabled", "readonly") and it sometimes even adds the "value" property in certain cases (<input type=hidden>)
                if ('|input|button|object|'.indexOf('|' + tagName + '|') > -1) {
                    if (node.value !== node.defaultValue) { // May be undefined for an object, or empty string for input, etc.
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
            if ((mozilla || !node.lookupNamespaceURI || node.lookupNamespaceURI(prefix) !== null) && namespaces[prefix || '$'] === undefined) {
                namespaces[prefix || '$'] = node.namespaceURI || xhtmlNS;
                string += ' xmlns' + (prefix ? ':' + prefix : '') +
                            '="' + entify(namespaces[prefix || '$']) + '"';
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
                    notIEInsertedAttributes(tagAttributes[i], node, [
                        ['type', 'text'], 'colSpan', 'rowSpan', 'cssText', 'shape'
                    ]) &&
                    // Had to add before
                    // && !tagAttributes[i].name.match(/^xmlns:?\w*$/) // Avoid adding these (e.g., from Firefox) as we add above
                    tagAttributes[i].name !== 'xmlns'
                ) {
                    // value = tagAttributes[i].value.split(/;\s+/).sort().join(' ');
                    // else { */
                    string += ' ' + tagAttributes[i].name + // .toLowerCase() +
                        '="' + entify(tagAttributes[i].value) + '"'; // .toLowerCase()
                }
            }

            // Todo: Faster to use array with Array.prototype.indexOf polyfill?
            emptyElement = emptyElements.indexOf('|' + tagName + '|') > -1;
            htmlElement = node.namespaceURI === xhtmlNS || nonEmptyElements.indexOf('|' + tagName + '|') > -1; // || emptyElement;

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
        case 2: // ATTRIBUTE (should only get here if passing in an attribute node)
            return ' ' + node.name + // .toLowerCase() +
                            '="' + entify(node.value) + '"'; // .toLowerCase()
        case 3: // TEXT
            return entify(nodeValue); // Todo: only entify for XML
        case 4: // CDATA
            if (nodeValue.indexOf(']]' + '>') !== -1) {
                invalidStateError();
            }
            return '<' + '![CDATA[' +
                            nodeValue +
                            ']]' + '>';
        case 5: // ENTITY REFERENCE (probably not used in browsers since already resolved)
            return '&' + node.nodeName + ';';
        case 6: // ENTITY (would need to pass in directly)
            val = '';
            content = node.firstChild;

            if (node.xmlEncoding) { // an external entity file?
                string += '<?xml ';
                if (node.xmlVersion) {
                    string += 'version="' + node.xmlVersion + '" ';
                }
                string += 'encoding="' + node.xmlEncoding + '"' +
                                '?>';

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
            if (node.publicId || node.systemId) { // External Entity?
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
        case 7: // PROCESSING INSTRUCTION
            if (/^xml$/i.test(node.target)) {
                invalidStateError();
            }
            if (node.target.indexOf('?>') !== -1) {
                invalidStateError();
            }
            if (node.target.indexOf(':') !== -1) {
                invalidStateError();
            }
            if (node.data.indexOf('?>') !== -1) {
                invalidStateError();
            }
            return '<?' + node.target + ' ' + nodeValue + '?>';
        case 8: // COMMENT
            if (nodeValue.indexOf('--') !== -1 ||
                (nodeValue.length && nodeValue.lastIndexOf('-') === nodeValue.length - 1)
            ) {
                invalidStateError();
            }
            return '<' + '!--' + nodeValue + '-->';
        case 9: // DOCUMENT (handled earlier in script)
            break;
        case 10: // DOCUMENT TYPE
            string += '<' + '!DOCTYPE ' + node.name;
            if (!pubIdChar.test(node.publicId)) {
                invalidStateError();
            }
            string += addExternalID(node) +
                            (node.internalSubset ? '[\n' + node.internalSubset + '\n]' : '') +
                            '>\n';
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
        case 11: // DOCUMENT FRAGMENT (handled earlier in script)
            break;
        case 12: // NOTATION (would need to be passed in directly)
            return '<' + '!NOTATION ' + node.nodeName +
                            addExternalID(node, true) +
                            '>';
        default:
            throw new Error('Not an XML type');
        }
        return string;
    }

    if (xmlDeclaration && document.xmlVersion && nodeType === 9) { // DOCUMENT - Faster to do it here without first calling serializeDOM
        string += '<?xml version="' + document.xmlVersion + '"';
        if (document.xmlEncoding !== undefined && document.xmlEncoding !== null) {
            string += ' encoding="' + document.xmlEncoding + '"';
        }
        if (document.xmlStandalone !== undefined) { // Could configure to only output if "yes"
            string += ' standalone="' + (document.xmlStandalone ? 'yes' : 'no') + '"';
        }
        string += '?>\n';
    }
    if (nodeType === 9 || nodeType === 11) { // DOCUMENT & DOCUMENT FRAGMENT - Faster to do it here without first calling serializeDOM
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
const possibleOptions = [
    '$plugins',
    '$map' // Add any other options here
];

const NS_HTML = 'http://www.w3.org/1999/xhtml',
    hyphenForCamelCase = /-([a-z])/g;

const ATTR_MAP = {
    'readonly': 'readOnly'
};

// We define separately from ATTR_DOM for clarity (and parity with JsonML) but no current need
// We don't set attribute esp. for boolean atts as we want to allow setting of `undefined`
//   (e.g., from an empty variable) on templates to have no effect
const BOOL_ATTS = [
    'checked',
    'defaultChecked',
    'defaultSelected',
    'disabled',
    'indeterminate',
    'open', // Dialog elements
    'readOnly',
    'selected'
];
const ATTR_DOM = BOOL_ATTS.concat([ // From JsonML
    'async',
    'autofocus',
    'defaultValue',
    'defer',
    'formnovalidate',
    'hidden',
    'ismap',
    'multiple',
    'novalidate',
    'pattern',
    'required',
    'spellcheck',
    'value',
    'willvalidate'
]);
// Todo: Add more to this as useful for templating
//   to avoid setting with nullish value
const NULLABLES = [
    'lang',
    'max',
    'min'
];

/**
* Retrieve the (lower-cased) HTML name of a node
* @static
* @param {Node} node The HTML node
* @returns {String} The lower-cased node name
*/
function _getHTMLNodeName (node) {
    return node.nodeName && node.nodeName.toLowerCase();
}

/**
* Apply styles if this is a style tag
* @static
* @param {Node} node The element to check whether it is a style tag
*/
function _applyAnyStylesheet (node) {
    if (!doc.createStyleSheet) {
        return;
    }
    if (_getHTMLNodeName(node) === 'style') { // IE
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
function _appendNode (parent, child) {
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
            try { // Since this is now DOM Level 4 standard behavior (and what IE7+ can handle), we try it first
                parent.add(child);
            } catch (err) { // DOM Level 2 did require a second argument, so we try it too just in case the user is using an older version of Firefox, etc.
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
function _addEvent (el, type, handler, capturing) {
    el.addEventListener(type, handler, !!capturing);
}

/**
* Creates a text node of the result of resolving an entity or character reference
* @param {'entity'|'decimal'|'hexadecimal'} type Type of reference
* @param {String} prefix Text to prefix immediately after the "&"
* @param {String} arg The body of the reference
* @returns {Text} The text node of the resolved reference
*/
function _createSafeReference (type, prefix, arg) {
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
function _upperCase (n0, n1) {
    return n1.toUpperCase();
}

/**
* @private
* @static
*/
function _getType (item) {
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
        if (item.nodeType === 1) {
            return 'element';
        }
        if (item.nodeType === 11) {
            return 'fragment';
        }
        return 'object';
    }
    return undefined;
}

/**
* @private
* @static
*/
function _fragReducer (frag, node) {
    frag.appendChild(node);
    return frag;
}

/**
* @private
* @static
*/
function _replaceDefiner (xmlnsObj) {
    return function (n0) {
        let retStr = xmlnsObj[''] ? ' xmlns="' + xmlnsObj[''] + '"' : (n0 || ''); // Preserve XHTML
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

function _optsOrUndefinedJML (...args) {
    return jml(...(
        args[0] === undefined
            ? args.slice(1)
            : args
    ));
}

/**
* @private
* @static
*/
function _jmlSingleArg (arg) {
    return jml(arg);
}

/**
* @private
* @static
*/
function _copyOrderedAtts (attArr) {
    const obj = {};
    // Todo: Fix if allow prefixed attributes
    obj[attArr[0]] = attArr[1]; // array of ordered attribute-value arrays
    return obj;
}

/**
* @private
* @static
*/
function _childrenToJML (node) {
    return function (childNodeJML, i) {
        const cn = node.childNodes[i];
        cn.parentNode.replaceChild(jml(...childNodeJML), cn);
    };
}

/**
* @private
* @static
*/
function _appendJML (node) {
    return function (childJML) {
        node.appendChild(jml(...childJML));
    };
}

/**
* @private
* @static
*/
function _appendJMLOrText (node) {
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
const jml = function jml (...args) {
    let elem = doc.createDocumentFragment();
    function _checkAtts (atts) {
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
            case '#': { // Document fragment
                nodes[nodes.length] = _optsOrUndefinedJML(opts, attVal);
                break;
            } case '$shadow': {
                const {open, closed} = attVal;
                let {content, template} = attVal;
                const shadowRoot = elem.attachShadow({
                    mode: closed || open === false ? 'closed' : 'open'
                });
                if (template) {
                    if (Array.isArray(template)) {
                        if (_getType(template[0]) === 'object') { // Has attributes
                            template = jml('template', ...template, doc.body);
                        } else { // Array is for the children
                            template = jml('template', template, doc.body);
                        }
                    } else if (typeof template === 'string') {
                        template = doc.querySelector(template);
                    }
                    jml(
                        template.content.cloneNode(true),
                        shadowRoot
                    );
                } else {
                    if (!content) {
                        content = open || closed;
                    }
                    if (content && typeof content !== 'boolean') {
                        if (Array.isArray(content)) {
                            jml({'#': content}, shadowRoot);
                        } else {
                            jml(content, shadowRoot);
                        }
                    }
                }
                break;
            } case 'is': { // Not yet supported in browsers
                // Handled during element creation
                break;
            } case '$custom': {
                Object.assign(elem, attVal);
                break;
            } case '$define': {
                const localName = elem.localName.toLowerCase();
                // Note: customized built-ins sadly not working yet
                const customizedBuiltIn = !localName.includes('-');

                const def = customizedBuiltIn ? elem.getAttribute('is') : localName;
                if (customElements.get(def)) {
                    break;
                }
                const getConstructor = (cb) => {
                    const baseClass = options && options.extends
                        ? doc.createElement(options.extends).constructor
                        : customizedBuiltIn
                            ? doc.createElement(localName).constructor
                            : HTMLElement;
                    return cb
                        ? class extends baseClass {
                            constructor () {
                                super();
                                cb.call(this);
                            }
                        }
                        : class extends baseClass {};
                };

                let constructor, options, prototype;
                if (Array.isArray(attVal)) {
                    if (attVal.length <= 2) {
                        [constructor, options] = attVal;
                        if (typeof options === 'string') {
                            options = {extends: options};
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
                            options = {extends: options};
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
                    options = {extends: localName};
                }
                if (prototype) {
                    Object.assign(constructor.prototype, prototype);
                }
                customElements.define(def, constructor, customizedBuiltIn ? options : undefined);
                break;
            } case '$symbol': {
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
            } case '$data' : {
                setMap(attVal);
                break;
            } case '$attribute': { // Attribute node
                const node = attVal.length === 3 ? doc.createAttributeNS(attVal[0], attVal[1]) : doc.createAttribute(attVal[0]);
                node.value = attVal[attVal.length - 1];
                nodes[nodes.length] = node;
                break;
            } case '$text': { // Todo: Also allow as jml(['a text node']) (or should that become a fragment)?
                const node = doc.createTextNode(attVal);
                nodes[nodes.length] = node;
                break;
            } case '$document': {
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
            } case '$DOCTYPE': {
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
            } case '$ENTITY': {
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
            } case '$NOTATION': {
                // Todo: We could add further properties/methods, but unlikely to be used as is.
                const node = {nodeName: attVal[0], publicID: attVal[1], systemID: attVal[2], nodeValue: null, nodeType: 12};
                nodes[nodes.length] = node;
                break;
            } case '$on': { // Events
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
            } case 'className': case 'class':
                if (attVal != null) {
                    elem.className = attVal;
                }
                break;
            case 'dataset': {
                // Map can be keyed with hyphenated or camel-cased properties
                const recurse = (attVal, startProp) => {
                    let prop = '';
                    const pastInitialProp = startProp !== '';
                    Object.keys(attVal).forEach((key) => {
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
            case 'htmlFor': case 'for':
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
                const matchingPlugin = opts && opts.$plugins && opts.$plugins.find((p) => {
                    return p.name === att;
                });
                if (matchingPlugin) {
                    matchingPlugin.set({element: elem, attribute: {name: att, value: attVal}});
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
    if (_getType(args[0]) === 'object' &&
        Object.keys(args[0]).some((key) => possibleOptions.includes(key))) {
        opts = args[0];
        if (opts.state !== 'child') {
            isRoot = true;
            opts.state = 'child';
        }
        if (opts.$map && !opts.$map.root && opts.$map.root !== false) {
            opts.$map = {root: opts.$map};
        }
        if ('$plugins' in opts) {
            if (!Array.isArray(opts.$plugins)) {
                throw new Error('$plugins must be an array');
            }
            opts.$plugins.forEach((pluginObj) => {
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
    const setMap = (dataVal) => {
        let map, obj;
        // Boolean indicating use of default map and object
        if (dataVal === true) {
            [map, obj] = defaultMap;
        } else if (Array.isArray(dataVal)) {
            // Array of strings mapping to default
            if (typeof dataVal[0] === 'string') {
                dataVal.forEach((dVal) => {
                    setMap(opts.$map[dVal]);
                });
            // Array of Map and non-map data object
            } else {
                map = dataVal[0] || defaultMap[0];
                obj = dataVal[1] || defaultMap[1];
            }
        // Map
        } else if ((/^\[object (?:Weak)?Map\]$/).test([].toString.call(dataVal))) {
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
        case 'null': // null always indicates a place-holder (only needed for last argument if want array returned)
            if (i === argc - 1) {
                _applyAnyStylesheet(nodes[0]); // We have to execute any stylesheets even if not appending or otherwise IE will never apply them
                // Todo: Fix to allow application of stylesheets of style tags within fragments?
                return nodes.length <= 1 ? nodes[0] : nodes.reduce(_fragReducer, doc.createDocumentFragment()); // nodes;
            }
            break;
        case 'string': // Strings indicate elements
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
                } catch (e) { // Getting NotSupportedError in IE, so we try to imitate a processing instruction with a comment
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
            case '#': // // Decimal character reference - ['#', '01234'] // &#01234; // probably easier to use JavaScript Unicode escapes
                nodes[nodes.length] = _createSafeReference('decimal', arg, String(args[++i]));
                break;
            case '#x': // Hex character reference - ['#x', '123a'] // &#x123a; // probably easier to use JavaScript Unicode escapes
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
            default: { // An element
                elStr = arg;
                const atts = args[i + 1];
                // Todo: Fix this to depend on XML/config, not availability of methods
                if (_getType(atts) === 'object' && atts.is) {
                    const {is} = atts;
                    if (doc.createElementNS) {
                        elem = doc.createElementNS(NS_HTML, elStr, {is});
                    } else {
                        elem = doc.createElement(elStr, {is});
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
        case 'object': // Non-DOM-element objects indicate attribute-value pairs
            const atts = arg;

            if (atts.xmlns !== undefined) { // We handle this here, as otherwise may lose events, etc.
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
                elem = nodes[nodes.length - 1] = new DOMParser().parseFromString(
                    new XmlSerializer().serializeToString(elem)
                        // Mozilla adds XHTML namespace
                        .replace(' xmlns="' + NS_HTML + '"', replacer),
                    'application/xml'
                ).documentElement;
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
            if (i === 0) { // Allow wrapping of element
                elem = arg;
            }
            if (i === argc - 1 || (i === argc - 2 && args[i + 1] === null)) { // parent
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
        case 'array': // Arrays or arrays of arrays indicate child nodes
            const child = arg;
            const cl = child.length;
            for (let j = 0; j < cl; j++) { // Go through children array container to handle elements
                const childContent = child[j];
                const childContentType = typeof childContent;
                if (childContent === undefined) {
                    throw String('Parent array:' + JSON.stringify(args) + '; child: ' + child + '; index:' + j);
                }
                switch (childContentType) {
                // Todo: determine whether null or function should have special handling or be converted to text
                case 'string': case 'number': case 'boolean':
                    _appendNode(elem, doc.createTextNode(childContent));
                    break;
                default:
                    if (Array.isArray(childContent)) { // Arrays representing child elements
                        _appendNode(elem, _optsOrUndefinedJML(opts, ...childContent));
                    } else if (childContent['#']) { // Fragment
                        _appendNode(elem, _optsOrUndefinedJML(opts, childContent['#']));
                    } else { // Single DOM element children
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
    config = config || {stringOutput: false};
    if (typeof dom === 'string') {
        dom = new DOMParser().parseFromString(dom, 'text/html'); // todo: Give option for XML once implemented and change JSDoc to allow for Element
    }

    const prohibitHTMLOnly = true;

    const ret = [];
    let parent = ret;
    let parentIdx = 0;

    function invalidStateError () { // These are probably only necessary if working with text/html
        function DOMException () { return this; }
        if (prohibitHTMLOnly) {
            // INVALID_STATE_ERR per section 9.3 XHTML 5: http://www.w3.org/TR/html5/the-xhtml-syntax.html
            // Since we can't instantiate without this (at least in Mozilla), this mimicks at least (good idea?)
            const e = new DOMException();
            e.code = 11;
            throw e;
        }
    }

    function addExternalID (obj, node) {
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

    function set (val) {
        parent[parentIdx] = val;
        parentIdx++;
    }
    function setChildren () {
        set([]);
        parent = parent[parentIdx - 1];
        parentIdx = 0;
    }
    function setObj (prop1, prop2) {
        parent = parent[parentIdx - 1][prop1];
        parentIdx = 0;
        if (prop2) {
            parent = parent[prop2];
        }
    }

    function parseDOM (node, namespaces) {
        // namespaces = clone(namespaces) || {}; // Ensure we're working with a copy, so different levels in the hierarchy can treat it differently

        /*
        if ((node.prefix && node.prefix.includes(':')) || (node.localName && node.localName.includes(':'))) {
            invalidStateError();
        }
        */

        const type = node.nodeType;
        namespaces = Object.assign({}, namespaces);

        const xmlChars = /([\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/; // eslint-disable-line no-control-regex
        if ([2, 3, 4, 7, 8].includes(type) && !xmlChars.test(node.nodeValue)) {
            invalidStateError();
        }

        let children, start, tmpParent, tmpParentIdx;
        function setTemp () {
            tmpParent = parent;
            tmpParentIdx = parentIdx;
        }
        function resetTemp () {
            parent = tmpParent;
            parentIdx = tmpParentIdx;
            parentIdx++; // Increment index in parent container of this element
        }
        switch (type) {
        case 1: // ELEMENT
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
        case 2: // ATTRIBUTE (should only get here if passing in an attribute node)
            set({$attribute: [node.namespaceURI, node.name, node.value]});
            break;
        case 3: // TEXT
            if (config.stripWhitespace && (/^\s+$/).test(node.nodeValue)) {
                return;
            }
            set(node.nodeValue);
            break;
        case 4: // CDATA
            if (node.nodeValue.includes(']]' + '>')) {
                invalidStateError();
            }
            set(['![', node.nodeValue]);
            break;
        case 5: // ENTITY REFERENCE (probably not used in browsers since already resolved)
            set(['&', node.nodeName]);
            break;
        case 6: // ENTITY (would need to pass in directly)
            setTemp();
            start = {};
            if (node.xmlEncoding || node.xmlVersion) { // an external entity file?
                start.$ENTITY = {name: node.nodeName, version: node.xmlVersion, encoding: node.xmlEncoding};
            } else {
                start.$ENTITY = {name: node.nodeName};
                if (node.publicId || node.systemId) { // External Entity?
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
        case 7: // PROCESSING INSTRUCTION
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
        case 8: // COMMENT
            if (node.nodeValue.includes('--') ||
                (node.nodeValue.length && node.nodeValue.lastIndexOf('-') === node.nodeValue.length - 1)) {
                invalidStateError();
            }
            set(['!', node.nodeValue]);
            break;
        case 9: // DOCUMENT
            setTemp();
            const docObj = {$document: {childNodes: []}};

            if (config.xmlDeclaration) {
                docObj.$document.xmlDeclaration = {version: doc.xmlVersion, encoding: doc.xmlEncoding, standAlone: doc.xmlStandalone};
            }

            set(docObj); // doc.implementation.createHTMLDocument

            // Set position to fragment's array children
            setObj('$document', 'childNodes');

            children = node.childNodes;
            if (!children.length) {
                invalidStateError();
            }
            // set({$xmlDocument: []}); // doc.implementation.createDocument // Todo: use this conditionally

            Array.from(children).forEach(function (childNode) { // Can't just do documentElement as there may be doctype, comments, etc.
                // No need for setChildren, as we have already built the container array
                parseDOM(childNode, namespaces);
            });
            resetTemp();
            break;
        case 10: // DOCUMENT TYPE
            setTemp();

            // Can create directly by doc.implementation.createDocumentType
            start = {$DOCTYPE: {name: node.name}};
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
        case 11: // DOCUMENT FRAGMENT
            setTemp();

            set({'#': []});

            // Set position to fragment's array children
            setObj('#');

            children = node.childNodes;
            Array.from(children).forEach(function (childNode) {
                // No need for setChildren, as we have already built the container array
                parseDOM(childNode, namespaces);
            });

            resetTemp();
            break;
        case 12: // NOTATION
            start = {$NOTATION: {name: node.nodeName}};
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
    return jml.toJML(dom, Object.assign(config || {}, {stringOutput: true}));
};
jml.toDOM = function (...args) { // Alias for jml()
    return jml(...args);
};
jml.toHTML = function (...args) { // Todo: Replace this with version of jml() that directly builds a string
    const ret = jml(...args);
    // Todo: deal with serialization of properties like 'selected', 'checked', 'value', 'defaultValue', 'for', 'dataset', 'on*', 'style'! (i.e., need to build a string ourselves)
    return ret.outerHTML;
};
jml.toDOMString = function (...args) { // Alias for jml.toHTML for parity with jml.toJMLString
    return jml.toHTML(...args);
};
jml.toXML = function (...args) {
    const ret = jml(...args);
    return new XmlSerializer().serializeToString(ret);
};
jml.toXMLDOMString = function (...args) { // Alias for jml.toXML for parity with jml.toJMLString
    return jml.toXML(...args);
};

class JamilihMap extends Map {
    get (elem) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.get.call(this, elem);
    }
    set (elem, value) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.set.call(this, elem, value);
    }
    invoke (elem, methodName, ...args) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return this.get(elem)[methodName](elem, ...args);
    }
}
class JamilihWeakMap extends WeakMap {
    get (elem) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.get(elem);
    }
    set (elem, value) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return super.set(elem, value);
    }
    invoke (elem, methodName, ...args) {
        elem = typeof elem === 'string' ? doc.querySelector(elem) : elem;
        return this.get(elem)[methodName](elem, ...args);
    }
}

jml.Map = JamilihMap;
jml.WeakMap = JamilihWeakMap;

jml.weak = function (obj, ...args) {
    const map = new JamilihWeakMap();
    const elem = jml({$map: [map, obj]}, ...args);
    return [map, elem];
};

jml.strong = function (obj, ...args) {
    const map = new JamilihMap();
    const elem = jml({$map: [map, obj]}, ...args);
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

jml.setWindow = (wind) => {
    win = wind;
};
jml.setDocument = (docum) => {
    doc = docum;
};
jml.setXMLSerializer = (xmls) => {
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

/* eslint-env node */

// import {JSDOM} from 'jsdom';
const {JSDOM} = require('jsdom');

const win$1 = new JSDOM('').window;

jml.setWindow(win$1);
jml.setDocument(win$1.document);
// jml.setXMLSerializer(require('xmldom').XMLSerializer);
jml.setXMLSerializer(XMLSerializer$1);

var languageSelect = {
    main ({langs, getLanguageFromCode, followParams, $p}) {
        jml('div', {'class': 'focus', id: 'languageSelectionContainer'}, [
            ['select', {
                size: langs.length,
                $on: {
                    change: ({target: {selectedOptions}}) => {
                        $p.set('lang', selectedOptions[0].value, true);
                        followParams();
                    }
                }
            }, langs.map(({code}) =>
                ['option', {value: code}, [getLanguageFromCode(code)]]
            )]
        ], document.body);
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

var workSelect = ({groups, lf, getNextAlias, $p, followParams}) =>
    jml(
        'div',
        {'class': 'focus'},
        groups.map((group, i) =>
            ['div', [
                i > 0 ? ['br', 'br', 'br'] : '',
                ['div', [
                    lf({key: group.directions.localeKey, fallback: true})
                ]],
                ['br'],
                ['select', {
                    'class': 'file',
                    dataset: {
                        name: group.name.localeKey
                    },
                    $on: {
                        change: ({target: {value}}) => {
                            /*
                            // If using click, but click doesn't always fire
                            if (e.target.nodeName.toLowerCase() === 'select') {
                                return;
                            }
                            */
                            $p.set('work', value);
                            followParams();
                        }
                    }
                }, [
                    ['option', {value: ''}, ['--']],
                    ...group.files.map(({name: fileName}) =>
                        ['option', {
                            value: lf(['workNames', group.id, fileName])
                        }, [getNextAlias()]]
                    )
                ]]
                // Todo: Add in Go button (with 'submitgo' localization string) to
                //    avoid need for pull-down if using first selection?
            ]]
        ),
        document.body
    );

const colors = [
    'aqua',
    'black',
    'blue',
    'fuchsia',
    'gray',
    'green',
    'lime',
    'maroon',
    'navy',
    'olive',
    'purple',
    'red',
    'silver',
    'teal',
    'white',
    'yellow'
];
const fonts = [
    'Helvetica, sans-serif',
    'Verdana, sans-serif',
    'Gill Sans, sans-serif',
    'Avantgarde, sans-serif',
    'Helvetica Narrow, sans-serif',
    'sans-serif',
    'Times, serif',
    'Times New Roman, serif',
    'Palatino, serif',
    'Bookman, serif',
    'New Century Schoolbook, serif',
    'serif',
    'Andale Mono, monospace',
    'Courier New, monospace',
    'Courier, monospace',
    'Lucidatypewriter, monospace',
    'Fixed, monospace',
    'monospace',
    'Comic Sans, Comic Sans MS, cursive',
    'Zapf Chancery, cursive',
    'Coronetscript, cursive',
    'Florence, cursive',
    'Parkavenue, cursive',
    'cursive',
    'Impact, fantasy',
    'Arnoldboecklin, fantasy',
    'Oldtown, fantasy',
    'Blippo, fantasy',
    'Brushstroke, fantasy',
    'fantasy'
];

const nbsp = '\u00a0';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* eslint-env browser */

const getDataForSerializingParamsAsURL = () => ({
    form: $('form#browse'),
    random: $('#rand') || {}, // Todo: We don't need any default once random functionality is completed
    checkboxes: $$('input[type=checkbox]')
});

var workDisplay = {
    bdo: ({fallbackDirection, message}) =>
        // Displaying as div with inline display instead of span since
        //    Firefox puts punctuation at left otherwise (bdo dir
        //    seemed to have issues in Firefox)
        ['div', {style: 'display: inline; direction: ' + fallbackDirection}, [message]],
    columnsTable: ({
        ld, fields, $p, le, iil, l, getFieldAliasOrName,
        metadataObj, preferredLocale, schemaItems, getPreferredLanguages,
        fieldMatchesLocale
    }) => ['table', {
        border: '1', cellpadding: '5', align: 'center'
    }, [
        ['tr', [
            ['th', [
                ld('fieldno')
            ]],
            ['th', {align: 'left', width: '20'}, [
                ld('field_enabled')
            ]],
            ['th', [
                ld('field_title')
            ]],
            ['th', [
                ld('fieldinterlin')
            ]],
            ['th', [
                ld('fieldcss')
            ]]
            /*
            Todo: Support search?
            ,
            ['th', [
                ld('fieldsearch')
            ]]
            */
        ]],
        ...fields.map((fieldName, i) => {
            const idx = i + 1;
            const checkedIndex = 'checked' + idx;
            const fieldIndex = 'field' + idx;
            const fieldParam = $p.get(fieldIndex);
            return ['tr', [
                // Todo: Get Jamilih to accept numbers and
                //    booleans (`toString` is too dangerous)
                ['td', [String(idx)]],
                le('check-columns-to-browse', 'td', 'title', {}, [
                    le('yes', 'input', 'value', {
                        'class': 'fieldSelector',
                        id: checkedIndex,
                        name: iil('checked') + idx,
                        checked: $p.get(checkedIndex) === l('no')
                            ? undefined
                            : 'checked',
                        type: 'checkbox'
                    })
                ]),
                le('check-sequence', 'td', 'title', {}, [
                    ['select', {name: iil('field') + idx, id: fieldIndex, size: '1'},
                        fields.map((field, j) => {
                            const fn = getFieldAliasOrName(field) || field;
                            const matchedFieldParam = fieldParam && fieldParam === field;
                            return (matchedFieldParam || (!$p.has(fieldIndex) && j === i))
                                ? ['option', {
                                    dataset: {name: field}, value: fn, selected: 'selected'
                                }, [fn]]
                                : ['option', {dataset: {name: field}, value: fn}, [fn]];
                        })
                    ]
                ]),
                ['td', [ // Todo: Make as tag selector with fields as options
                    le('interlinear-tips', 'input', 'title', {
                        name: iil('interlin') + idx,
                        value: $p.get('interlin' + idx)
                    }) // Todo: Could allow i18n of numbers here
                ]],
                ['td', [ // Todo: Make as CodeMirror-highlighted CSS
                    ['input', {name: iil('css') + idx, value: $p.get('css' + idx)}]
                ]]
                /*
                ,
                ['td', [ // Todo: Allow plain or regexp searching
                    ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
                ]]
                */
            ]];
        }),
        ['tr', [
            ['td', {colspan: 3}, [
                le('check_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = true;
                            });
                        }
                    }
                }),
                le('uncheck_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = false;
                            });
                        }
                    }
                }),
                le('checkmark_locale_fields_only', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            fields.forEach((fld, i) => {
                                const idx = i + 1;
                                // The following is redundant with 'fld' but may need to
                                //     retrieve later out of order?
                                const field = $('#field' + idx).selectedOptions[0].dataset.name;
                                $('#checked' + idx).checked = fieldMatchesLocale(field);
                            });
                        }
                    }
                })
            ]]
        ]]
    ]],
    advancedFormatting: ({ld, il, l, lo, le, $p, hideFormattingSection}) => ['td', {
        id: 'advancedformatting', style: {display: (hideFormattingSection ? 'none' : 'block')}
    }, [
        ['h3', [ld('advancedformatting')]],
        ['label', [
            ld('textcolor'), nbsp.repeat(2),
            ['select', {name: il('colorName')}, colors.map((color, i) => {
                const atts = {value: l(['param_values', 'colors', color])};
                if ($p.get('colorName') === l(['param_values', 'colors', color]) ||
                    (i === 1 && !$p.has('colorName'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'colors', color], atts);
            })]
        ]],
        ['label', [
            nbsp, ld('or_entercolor'), nbsp.repeat(2),
            ['input', {
                name: il('color'),
                type: 'text',
                value: ($p.get('color') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('backgroundcolor'), nbsp.repeat(2),
            ['select', {name: il('bgcolorName')}, colors.map((color, i) => {
                const atts = {value: l(['param_values', 'colors', color])};
                if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) ||
                    (i === 14 && !$p.has('bgcolorName'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'colors', color], atts);
            })]
        ]],
        ['label', [
            nbsp, ld('or_entercolor'), nbsp.repeat(2),
            ['input', {
                name: il('bgcolor'),
                type: 'text',
                value: ($p.get('bgcolor') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('text_font'), nbsp.repeat(2),
            // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
            ['select', {name: il('fontSeq'), dir: 'ltr'}, fonts.map((fontSeq, i) => {
                const atts = {value: fontSeq};
                if ($p.get('fontSeq') === fontSeq || (i === 7 && !$p.has('fontSeq'))) {
                    atts.selected = 'selected';
                }
                return ['option', atts, [fontSeq]];
            })]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('font_style'), nbsp.repeat(2),
            ['select', {name: il('fontstyle')}, [
                'italic',
                'normal',
                'oblique'
            ].map((fontstyle, i) => {
                const atts = {value: l(['param_values', 'fontstyle', fontstyle])};
                if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) ||
                    (i === 1 && !$p.has('fontstyle'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'fontstyle', fontstyle], atts);
            })]
        ]],
        ['br'],
        ['div', [
            ld('font_variant'), nbsp.repeat(3),
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l('normal'),
                    checked: $p.get('fontvariant') === ld(['param_values', 'fontvariant', 'smallcaps']) ? undefined : 'checked'}],
                ld(['param_values', 'fontvariant', 'normal']), nbsp
            ]],
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l('smallcaps'),
                    checked: $p.get('fontvariant') === ld(['param_values', 'fontvariant', 'smallcaps']) ? 'checked' : undefined}],
                ld(['param_values', 'fontvariant', 'smallcaps']), nbsp
            ]]
        ]],
        ['br'],
        ['label', [
            // Todo: i18n and allow for normal/bold pulldown and float input?
            ld('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp.repeat(2),
            ['input', {
                name: il('fontweight'),
                type: 'text',
                value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        ['label', [
            ld('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp.repeat(2),
            ['input', {
                name: il('fontsize'),
                type: 'text',
                value: $p.get('fontsize'),
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        // Todo: i18nize title and values?
        // Todo: remove hard-coded direction if i18nizing
        ['label', {
            dir: 'ltr'
        }, [
            ld('font_stretch'), nbsp,
            ['select', {name: il('fontstretch')},
                [
                    'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed',
                    'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'
                ].map((stretch) => {
                    const atts = {value: ld(['param_values', 'font-stretch', stretch])};
                    if ($p.get('fontstretch') === stretch ||
                        (!$p.has('fontstretch') && stretch === 'normal')) {
                        atts.selected = 'selected';
                    }
                    return ['option', atts, [ld(['param_values', 'font-stretch', stretch])]];
                })
            ]
        ]],
        /**/
        ['br'], ['br'],
        ['label', [
            ld('letter_spacing'), ' (normal, .9em, -.05cm): ',
            ['input', {
                name: il('letterspacing'),
                type: 'text',
                value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        ['label', [
            ld('line_height'), ' (normal, 1.5, 22px, 150%): ',
            ['input', {
                name: il('lineheight'),
                type: 'text',
                value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'], ['br'],
        le('tableformatting_tips', 'h3', 'title', {}, [
            ld('tableformatting')
        ]),
        ['div', [
            ld('header_wstyles'), nbsp.repeat(2),
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('header'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('header') === val ||
                            (!$p.has('header') && i === 1) ? 'checked' : undefined}],
                    ld(key), (i === arr.length - 1 ? '' : nbsp.repeat(3))
                ]]
            ))
        ]],
        ['div', [
            ld('footer_wstyles'), nbsp.repeat(2),
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('footer'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('footer') === val ||
                            (!$p.has('footer') && i === 2) ? 'checked' : undefined}],
                    ld(key), (i === arr.length - 1 ? '' : nbsp.repeat(3))
                ]]
            ))
        ]],
        ['label', [
            ['input', {
                name: il('headerfooterfixed'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('headerfooterfixed') === l('yes') ? 'checked' : undefined}],
            nbsp.repeat(2), ld('headerfooterfixed-wishtoscroll')
        ]],
        ['br'],
        ['div', [
            ld('caption_wstyles'), nbsp.repeat(2),
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('caption'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('caption') === val ||
                            (!$p.has('caption') && i === 2) ? 'checked' : undefined}],
                    ld(key), (i === arr.length - 1 ? '' : nbsp.repeat(3))
                ]]
            ))
        ]],
        ['br'],
        ['div', [
            ld('table_wborder'), nbsp.repeat(2),
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('border') === '0' ? undefined : 'checked'}],
                ld('yes'), nbsp.repeat(3)
            ]],
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('border') === '0' ? 'checked' : undefined}],
                ld('no')
            ]]
        ]],
        ['div', [
            ld('interlin_repeat_field_names'), nbsp.repeat(2),
            ['label', [
                ['input', {
                    name: il('interlintitle'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('interlintitle') === '0' ? undefined : 'checked'}],
                ld('yes'), nbsp.repeat(3)
            ]],
            ['label', [
                ['input', {
                    name: il('interlintitle'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('interlintitle') === '0' ? 'checked' : undefined}],
                ld('no')
            ]]
        ]],
        ['label', [
            ld('interlintitle_css'), nbsp.repeat(2),
            ['input', {
                name: il('interlintitle_css'),
                type: 'text',
                value: $p.get('interlintitle_css') || '',
                size: '12'
            }]
        ]],
        ['br'],
        /*
        ['br'],
        ['label', [
            ['input', {
                name: il('transpose'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('transpose') === l('yes') ? 'checked' : undefined}],
            nbsp.repeat(2), ld('transpose')
        ]],
        */
        ['br'],
        le('pageformatting_tips', 'h3', 'title', {}, [
            ld('pageformatting')
        ]),
        /*
        ['label', [
            ld('speech_controls'), nbsp.repeat(2),
            ['label', [
                ['input', {
                    name: il('speech'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('speech') === '1' ? 'checked' : undefined}],
                ld('yes'), nbsp.repeat(3)
            ]],
            ['label', [
                ['input', {
                    name: il('speech'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('speech') === '1' ? undefined : 'checked'}],
                ld('no')
            ]]
        ]],
        ['br'],
        */
        ['label', [
            ld('page_css'), nbsp.repeat(2),
            ['textarea', {
                name: il('pagecss'),
                title: l('page_css_tips'),
                value: $p.get('pagecss')
            }]
        ]],
        ['br'],
        le('outputmode_tips', 'label', 'title', {}, [
            ld('outputmode'), nbsp.repeat(2),
            // Todo: Could i18nize, but would need smaller values
            ['select', {name: il('outputmode')}, [
                'table',
                'div'
                // , 'json-array',
                // 'json-object'
            ].map((mode) => {
                const atts = {value: mode};
                if ($p.get('outputmode') === mode) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'outputmode', mode], atts);
            })]
        ])
    ]],
    addRandomFormFields: ({
        il, ld, l, le, $p, serializeParamsAsURL, content
    }) => {
        const addRowContent = (rowContent) => {
            if (!rowContent || !rowContent.length) { return; }
            content.push(['tr', rowContent]);
        };
        [
            [
                ['td', {colspan: 12, align: 'center'}, [['br'], ld('or'), ['br'], ['br']]]
            ],
            [
                ['td', {colspan: 12, align: 'center'}, [
                    // Todo: Could allow random with fixed starting and/or ending range
                    ['label', [
                        ld('rnd'), nbsp.repeat(3),
                        ['input', {
                            id: 'rand',
                            name: il('rand'),
                            type: 'checkbox',
                            value: l('yes'),
                            checked: ($p.get('rand') === l('yes') ? 'checked' : undefined)
                        }]
                    ]],
                    nbsp.repeat(3),
                    ['label', [
                        ld('verses-context'), nbsp,
                        ['input', {
                            name: il('context'),
                            type: 'number',
                            min: 1,
                            size: 4,
                            value: $p.get('context')
                        }]
                    ]],
                    nbsp.repeat(3),
                    le('view-random-URL', 'input', 'value', {
                        type: 'button',
                        $on: {
                            click: () => {
                                const url = serializeParamsAsURL(
                                    getDataForSerializingParamsAsURL(),
                                    'randomResult'
                                );
                                $('#randomURL').value = url;
                            }
                        }
                    }),
                    ['input', {id: 'randomURL', type: 'text'}]
                ]]
            ]
        ].forEach(addRowContent);
    },
    getPreferences: ({
        langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
    }) => ['div', {
        style: {textAlign: 'left'}, id: 'preferences', hidden: 'true'
    }, [
        ['div', {style: 'margin-top: 10px;'}, [
            ['label', [
                l('localizeParamNames'),
                ['input', {
                    id: 'localizeParamNames',
                    type: 'checkbox',
                    checked: localizeParamNames,
                    $on: {change: ({target: {checked}}) => {
                        localStorage.setItem(
                            namespace + '-localizeParamNames', checked
                        );
                    }}
                }]
            ]]
        ]],
        ['div', [
            ['label', [
                l('Hide formatting section'),
                ['input', {
                    id: 'hideFormattingSection',
                    type: 'checkbox',
                    checked: hideFormattingSection,
                    $on: {change: ({target: {checked}}) => {
                        $('#advancedformatting').style.display = checked
                            ? 'none'
                            : 'block';
                        localStorage.setItem(namespace + '-hideFormattingSection', checked);
                    }}
                }]
            ]]
        ]],
        ['div', [
            ['label', {for: 'prefLangs'}, [l('Preferred language(s)')]],
            ['br'],
            ['select', {
                id: 'prefLangs',
                multiple: 'multiple',
                size: langs.length,
                $on: {
                    change: ({target: {selectedOptions}}) => {
                        // Todo: EU disclaimer re: storage?
                        localStorage.setItem(namespace + '-langCodes', JSON.stringify(
                            Array.from(selectedOptions).map((opt) =>
                                opt.value
                            )
                        ));
                    }
                }
            }, langs.map((lan) => {
                let langCodes = localStorage.getItem(namespace + '-langCodes');
                langCodes = langCodes && JSON.parse(langCodes);
                const atts = {value: lan.code};
                if (langCodes && langCodes.includes(lan.code)) {
                    atts.selected = 'selected';
                }
                return ['option', atts, [
                    imfl(['languages', lan.code])
                ]];
            })]
        ]]
    ]],
    addBrowseFields: ({browseFields, fields, getFieldAliasOrName, ld, i, iil, $p, content}) => {
        const addRowContent = (rowContent) => {
            if (!rowContent || !rowContent.length) { return; }
            content.push(['tr', rowContent]);
        };
        [
            // Todo: Separate formatting to CSS
            i > 0
                ? [
                    ['td', {colspan: 12, align: 'center'}, [['br'], ld('or'), ['br'], ['br']]]
                ]
                : '',
            [
                ...(function () {
                    const addBrowseFieldSet = (setType) =>
                        browseFields.reduce((rowContent, {fieldName, aliases, fieldSchema: {minimum, maximum}}, j) => {
                            const name = iil(setType) + (i + 1) + '-' + (j + 1);
                            const id = name;
                            rowContent['#'].push(
                                ['td', [
                                    ['label', {'for': name}, [fieldName]]
                                ]],
                                ['td', [
                                    aliases ? ['datalist', {id: 'dl-' + id},
                                        aliases.map((alias) => ['option', [alias]])
                                    ] : '',
                                    aliases
                                        ? ['input', {
                                            name, id, class: 'browseField',
                                            list: 'dl-' + id, value: $p.get(name),
                                            $on: setType === 'start'
                                                ? {
                                                    change: function (e) {
                                                        $$('input.browseField').forEach((bf) => {
                                                            if (bf.id.includes((i + 1) + '-' + (j + 1))) {
                                                                bf.value = e.target.value;
                                                            }
                                                        });
                                                    }
                                                }
                                                : undefined
                                        }]
                                        : ['input', {
                                            name, id,
                                            type: 'number',
                                            min: minimum,
                                            max: maximum,
                                            value: $p.get(name)
                                        }],
                                    nbsp.repeat(3)
                                ]]
                            );
                            return rowContent;
                        }, {'#': []});
                    return [
                        addBrowseFieldSet('start'),
                        ['td', [
                            ['b', [ld('to')]],
                            nbsp.repeat(3)
                        ]],
                        addBrowseFieldSet('end')
                    ];
                }()),
                ['td', [
                    browseFields.length > 1 ? ld('versesendingdataoptional') : ''
                ]]
            ],
            [
                ['td', {colspan: 4 * browseFields.length + 2 + 1, align: 'center'}, [
                    ['table', [
                        ['tr', [
                            browseFields.reduce((rowContent, {fieldName, aliases, fieldSchema: {minimum, maximum}}, j) => {
                                const name = iil('anchor') + (i + 1) + '-' + (j + 1);
                                const id = name;
                                rowContent['#'].push(
                                    ['td', [
                                        ['label', {'for': name}, [fieldName]]
                                    ]],
                                    ['td', [
                                        aliases ? ['datalist', {id: 'dl-' + id},
                                            aliases.map((alias) => ['option', [alias]])
                                        ] : '',
                                        aliases
                                            ? ['input', {
                                                name, id, class: 'browseField',
                                                list: 'dl-' + id, value: $p.get(name)
                                            }]
                                            : ['input', {
                                                name, id,
                                                type: 'number',
                                                min: minimum,
                                                max: maximum,
                                                value: $p.get(name)
                                            }],
                                        nbsp.repeat(2)
                                    ]]
                                );
                                return rowContent;
                            }, {'#': [
                                ['td', {style: 'font-weight: bold; vertical-align: bottom;'}, [
                                    ld('anchored-at') + nbsp.repeat(3)
                                ]]
                            ]}),
                            ['td', [
                                ['label', [
                                    ld('field') + nbsp.repeat(2),
                                    ['select', {name: iil('anchorfield') + (i + 1), size: '1'},
                                        fields.map((field, j) => {
                                            const fn = getFieldAliasOrName(field) || field;
                                            return ['option', [fn]];
                                        })
                                    ]
                                ]]
                            ]]
                        ]]
                    ]]
                ]]
            ]
        ].forEach(addRowContent);
    },
    main: ({
        l, namespace, heading, fallbackDirection, imfl, langs, fields, localizeParamNames,
        serializeParamsAsURL,
        hideFormattingSection, $p,
        metadataObj, il, le, ld, iil, getPreferredLanguages, fieldMatchesLocale,
        getFieldAliasOrName, preferredLocale, schemaItems, content
    }) => {
        const lo = (key, atts) =>
            ['option', atts, [
                l({
                    key,
                    fallback: ({message}) => {
                        atts.dir = fallbackDirection;
                        return message;
                    }
                })
            ]];
        // Returns element with localized or fallback attribute value (as Jamilih);
        //   also adds direction
        jml(
            'div',
            {'class': 'focus'},
            [
                ['div', {style: 'float: left;'}, [
                    ['button', {$on: {click: () => {
                        const prefs = $('#preferences');
                        prefs.hidden = !prefs.hidden;
                    }}}, [l('Preferences')]],
                    Templates.workDisplay.getPreferences({
                        langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
                    })
                ]],
                ['h2', [heading]],
                ['br'],
                ['form', {id: 'browse', $on: {
                    submit: function (e) {
                        e.preventDefault();
                    }
                }, name: il('browse')}, [
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [
                                    Templates.workDisplay.columnsTable({
                                        ld, fields, $p, le, iil, l, getFieldAliasOrName,
                                        metadataObj, preferredLocale, schemaItems, getPreferredLanguages,
                                        fieldMatchesLocale
                                    }),
                                    le('save-settings-URL', 'input', 'value', {
                                        type: 'button',
                                        $on: {
                                            click: () => {
                                                const url = serializeParamsAsURL(
                                                    getDataForSerializingParamsAsURL(),
                                                    'saveSettings'
                                                );
                                                $('#settings-URL').value = url;
                                            }
                                        }
                                    }),
                                    ['input', {id: 'settings-URL'}]
                                ]],
                                Templates.workDisplay.advancedFormatting({
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
                            ]]
                        ]]
                    ]],
                    ['p', {align: 'center'}, [
                        le('submitgo', 'input', 'value', {
                            type: 'submit',
                            $on: {
                                click: () => {
                                    // Todo:
                                    const url = serializeParamsAsURL(
                                        getDataForSerializingParamsAsURL(),
                                        'result'
                                    );
                                    window.location.href = url;
                                }
                            }
                        })
                    ]]
                ]]
            ],
            document.body
        );
    }
};

/* globals console, DOMParser */

var resultsDisplayServerOrClient = {
    caption ({heading, ranges}) {
        return heading + ' ' + ranges;
    },
    startSeparator ({l}) {
        return l('colon');
    },
    innerBrowseFieldSeparator ({l}) {
        return l('comma-space');
    },
    ranges ({l, startRange, endVals, rangeNames}) {
        return startRange +
            // l('to').toLowerCase() + ' ' +
            '-' +
            endVals.join(
                Templates.resultsDisplayServerOrClient.startSeparator({l})
            ) + ' (' + rangeNames + ')';
    },
    fieldValueAlias ({key, value}) {
        return value + ' (' + key + ')';
    },
    interlinearSegment ({lang, html}) {
        return `<span lang="${lang}">${html}</span>`;
    },
    interlinearTitle ({l, val}) {
        const colonSpace = l('colon-space');
        return '<span class="interlintitle">' +
            val +
            '</span>' + colonSpace;
    },
    styles ({
        $p, $pRaw, $pRawEsc, $pEscArbitrary, escapeQuotedCSS, escapeCSS,
        tableWithFixedHeaderAndFooter, checkedFieldIndexes, hasCaption
    }) {
        const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#'
            ? $pEscArbitrary('colorName')
            : $pEscArbitrary('color');
        const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#'
            ? $pEscArbitrary('bgcolorName')
            : $pEscArbitrary('bgcolor');

        const tableHeight = '100%';

        const topToCaptionStart = 1;
        const captionSizeDelta = (hasCaption ? 2 : 0) + 0;
        const topToHeadingsStart = topToCaptionStart + captionSizeDelta;
        const headingsDelta = 1;

        const topToBodyStart = (topToHeadingsStart + headingsDelta) + 'em';
        const footerHeight = '2em';
        const bodyToFooterPadding = '0.5em';
        const topToBodyEnd = `100% - ${topToBodyStart} - ${footerHeight} - ${bodyToFooterPadding}`;
        const topToBodyEndCalc = `calc(${topToBodyEnd})`;
        const topToFooter = `calc(${topToBodyEnd} + ${bodyToFooterPadding})`;
        return ['style', [
            ($pRaw('caption') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? '.caption div.inner-caption, '
                    : '.caption, ')
                : ''
            ) +
            ($pRaw('header') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? `` // `.thead .th, .thead .th div.th-inner, ` // Problems at least in Chrome
                    : `.thead .th, `)
                : '') +
            ($pRaw('footer') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? `` // `.tfoot .th, .tfoot .th div.th-inner, ` // Problems at least in Chrome
                    : `.tfoot .th, `)
                : '') +
            ('.tbody .td') + ` {
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
` +
            (tableWithFixedHeaderAndFooter
                ? `
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
`
                : '') +
            checkedFieldIndexes.map((idx, i) =>
                ($pRaw('header') === 'y'
                    ? (tableWithFixedHeaderAndFooter
                        ? `.thead .th:nth-child(${i + 1}) div.th-inner, `
                        : `.thead .th:nth-child(${i + 1}), `)
                    : '') +
                ($pRaw('footer') === 'y'
                    ? (tableWithFixedHeaderAndFooter
                        ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, `
                        : `.tfoot .th:nth-child(${i + 1}), `)
                    : '') +
                `.tbody .td:nth-child(${i + 1}) ` +
`{
    ${$pEscArbitrary('css' + (i + 1))}
}
`).join('') +

($pEscArbitrary('interlintitle_css') ? `
/* http://salzerdesign.com/test/fixedTable.html */
.interlintitle {
    ${escapeCSS($pEscArbitrary('interlintitle_css'))}
}
` : '') +
            (bgcolorEsc
                ? `
body {
    background-color: ${bgcolorEsc};
}
`
                : '')
        ]];
    },
    main ({
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        // Todo: escaping should be done in business logic!
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs,
        caption, hasCaption, showInterlinTitles,
        determineEnd, getCellValue, checkedAndInterlinearFieldInfo,
        interlinearSeparator = '<br /><br />'
    }) {
        const tableElems = ({
            table: [
                ['table', {'class': 'table', border: $pRaw('border') || '0'}],
                ['tr', {'class': 'tr'}],
                ['td', {'class': 'td'}],
                ['th', {'class': 'th'}],
                ['caption', {'class': 'caption'}],
                ['thead', {'class': 'thead'}],
                ['tbody', {'class': 'tbody'}],
                ['tfoot', {'class': 'tfoot'}]
                // ['colgroup', {'class': 'colgroup'}],
                // ['col', {'class': 'col'}]
            ],
            div: [
                ['div', {'class': 'table', style: 'display: table;'}],
                ['div', {'class': 'tr', style: 'display: table-row;'}],
                ['div', {'class': 'td', style: 'display: table-cell;'}],
                ['div', {'class': 'th', style: 'display: table-cell;'}],
                ['div', {'class': 'caption', style: 'display: table-caption;'}],
                ['div', {'class': 'thead', style: 'display: table-header-group;'}],
                ['div', {'class': 'tbody', style: 'display: table-row-group;'}],
                ['div', {'class': 'tfoot', style: 'display: table-footer-group;'}]
                // ['div', {'class': 'colgroup', style: 'display: table-column-group;'}],
                // ['div', {'class': 'col', style: 'display: table-column;'}]
            ],
            'json-array': 'json',
            'json-object': 'json'
        }[$pRaw('outputmode')]);
        if (tableElems === 'json') {
            throw new Error('JSON support is currently not available');
        }
        const [
            tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem
        ] = tableElems; // colgroupElem, colElem

        const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] =
            checkedAndInterlinearFieldInfo;

        const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';
        const tableWrap = (children) =>
            tableWithFixedHeaderAndFooter
                ? ['div', {'class': 'anchor-table-header zupa'}, [
                    ['div', {'class': 'anchor-table-body'}, children]
                ]]
                : ['div', children];

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
                    [...tdVal.querySelectorAll('br')].forEach((br) => {
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
            const rowID = determineEnd({tr, foundState});
            if (typeof rowID === 'boolean') {
                return rowID;
            }

            outArr.push(addChildren(trElem,
                checkedFieldIndexes.map((idx, j) => {
                    const interlinearColIndexes = allInterlinearColIndexes[j];
                    const showInterlins = showInterlinTitles &&
                        interlinearColIndexes;
                    const {tdVal, htmlEscaped} = getCellValue({tr, idx});
                    const interlins = showInterlins && interlinearColIndexes.map((idx) => {
                        // Need to get a new one
                        const {tdVal, htmlEscaped} = getCellValue({tr, idx});
                        let cellIsEmpty;
                        console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
                        const isEmpty = checkEmpty(tdVal, htmlEscaped);
                        if (isEmpty) {
                            return '';
                        }

                        return (showInterlins && !cellIsEmpty
                            ? Templates.resultsDisplayServerOrClient.interlinearSegment({
                                lang: fieldLangs[idx],
                                html: Templates.resultsDisplayServerOrClient.interlinearTitle({
                                    l, val: localizedFieldNames[idx]
                                }) + tdVal
                            })
                            : tdVal);
                    }).filter((cell) => cell !== '');
                    return addAtts(tdElem, {
                        // Can't have unique IDs if user duplicates a column
                        id: 'row' + (i + 1) + 'col' + (j + 1),
                        lang: fieldLangs[idx],
                        dataset: {
                            col: localizedFieldNames[idx],
                            row: rowID
                        },
                        innerHTML:
                            (showInterlins && !checkEmpty(tdVal, htmlEscaped) &&
                                (showTitleOnSingleInterlinear || interlins.length)
                                ? Templates.resultsDisplayServerOrClient.interlinearSegment({
                                    lang: fieldLangs[idx],
                                    html: Templates.resultsDisplayServerOrClient.interlinearTitle({
                                        l, val: localizedFieldNames[idx]
                                    }) + tdVal
                                })
                                : tdVal
                            ) +
                            (interlinearColIndexes && interlins.length
                                ? interlinearSeparator +
                                    interlins.join(interlinearSeparator)
                                : ''
                            )
                    });
                })
            ));
        });

        return ['div', [
            Templates.resultsDisplayServerOrClient.styles({
                $p, $pRaw, $pRawEsc, $pEscArbitrary,
                escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter,
                checkedFieldIndexes, hasCaption
            }),
            tableWrap([
                addChildren(tableElem, [
                    (caption ? addChildren(captionElem, [
                        caption,
                        tableWithFixedHeaderAndFooter
                            ? ['div', {class: 'zupa1'}, [
                                ['div', {class: 'inner-caption'}, [
                                    ['span', [caption]]
                                ]]
                            ]]
                            : ''
                    ]) : ''),
                    /*
                    // Works but quirky, e.g., `color` doesn't work (as also
                    //  confirmed per https://quirksmode.org/css/css2/columns.html)
                    addChildren(colgroupElem,
                        checkedFieldIndexes.map((idx, i) =>
                            addAtts(colElem, {style: $pRaw('css' + (i + 1))})
                        )
                    ),
                    */
                    ($pRaw('header') !== '0' ? addChildren(theadElem, [
                        addChildren(trElem,
                            checkedFields.map((cf, i) => {
                                const interlinearColIndexes = allInterlinearColIndexes[i];
                                cf = escapeHTML(cf) + (interlinearColIndexes
                                    ? l('comma-space') + interlinearColIndexes.map((idx) =>
                                        localizedFieldNames[idx]
                                    ).join(l('comma-space'))
                                    : ''
                                );
                                return addChildren(thElem, [
                                    cf,
                                    (tableWithFixedHeaderAndFooter
                                        ? ['div', {class: 'zupa1'}, [
                                            ['div', {class: 'th-inner'}, [
                                                ['span', [cf]]
                                            ]]
                                        ]]
                                        : ''
                                    )
                                ]);
                            })
                        )
                    ]) : ''),
                    ($pRaw('footer') !== '0' ? addChildren(tfootElem, [
                        addChildren(trElem,
                            checkedFields.map((cf, i) => {
                                const interlinearColIndexes = allInterlinearColIndexes[i];
                                cf = escapeHTML(cf) + (interlinearColIndexes
                                    ? l('comma-space') + interlinearColIndexes.map((idx) =>
                                        localizedFieldNames[idx]
                                    ).join(l('comma-space'))
                                    : ''
                                );
                                return addChildren(thElem, [
                                    cf,
                                    (tableWithFixedHeaderAndFooter
                                        ? ['div', {class: 'zupa1'}, [
                                            ['div', {class: 'th-inner'}, [
                                                ['span', [cf]]
                                            ]]
                                        ]]
                                        : ''
                                    )
                                ]);
                            })
                        )
                    ]) : ''),
                    addChildren(tbodyElem, outArr)
                ])
            ])
        ]];
    }
};

/* eslint-env browser */

var resultsDisplayClient = {
    anchorRowCol ({anchorRowCol}) {
        return $('#' + anchorRowCol);
    },
    anchors ({escapedRow, escapedCol}) {
        const sel = 'td[data-row="' + escapedRow + '"]' +
            (escapedCol
                ? ('[data-col="' + escapedCol + '"]')
                : '');
        return $(sel);
    },
    main (...args) {
        let html;
        try {
            html = Templates.resultsDisplayServerOrClient.main(...args);
        } catch (err) {
            if (err.message === 'JSON support is currently not available') {
                alert(err.message);
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
    defaultBody () {
        $('html').style.height = '100%'; // Todo: Set in CSS
        return jml('body', {style: 'height: 100%;'});
    }
};
Templates.permissions = {
    versionChange () {
        $('#versionChange').showModal();
    },
    addLogEntry ({text}) {
        const container = $('#installationLogContainer');
        container.hidden = false;
        $('#installationLog').append(text + '\n');
    },
    exitDialogs () {
        const container = $('#dialogContainer');
        console.log('container', container);
        if (container) {
            container.hidden = true;
        }
    },
    dbError ({errorType, escapedErrorMessage}) {
        if (errorType) {
            jml('span', [
                errorType, ' ',
                escapedErrorMessage
            ], $('#dbError'));
        }
        $('#dbError').showModal();
    },
    errorRegistering (escapedErrorMessage) {
        if (escapedErrorMessage) {
            jml('span', [escapedErrorMessage], $('#errorRegistering'));
        }
        $('#errorRegistering').showModal();
    },
    browserNotGrantingPersistence () {
        $('#browserNotGrantingPersistence').showModal();
    },
    main ({l, ok, refuse, close, closeBrowserNotGranting}) {
        let requestPermissionsDialog = '';
        if (ok) {
            requestPermissionsDialog = jml(
                'dialog', {
                    id: 'willRequestStoragePermissions',
                    $on: {close}
                }, [
                    ['section', [
                        l('will-request-storage-permissions')
                    ]],
                    ['br'],
                    ['div', {class: 'focus'}, [
                        ['button', {$on: {click: ok}}, [
                            l('OK')
                        ]],
                        ['br'], ['br'],
                        ['button', {$on: {click: refuse}}, [
                            l('refuse-request-storage-permissions')
                        ]]
                    ]]
                ]
            );
        }
        const errorRegisteringNotice = jml(
            'dialog', {
                id: 'errorRegistering'
            }, [
                ['section', [
                    l('errorRegistering')
                ]]
            ]
        );
        let browserNotGrantingPersistenceAlert = '';
        if (closeBrowserNotGranting) {
            browserNotGrantingPersistenceAlert = jml(
                'dialog', {
                    id: 'browserNotGrantingPersistence'
                }, [
                    ['section', [
                        l('browser-not-granting-persistence')
                    ]],
                    ['br'],
                    ['div', {class: 'focus'}, [
                        ['button', {$on: {click: closeBrowserNotGranting}}, [
                            l('OK')
                        ]]
                    ]]
                ]
            );
        }
        const versionChangeNotice = jml(
            'dialog', {
                id: 'versionChange'
            }, [
                ['section', [
                    l('versionChange')
                ]]
            ]
        );
        const dbErrorNotice = jml(
            'dialog', {
                id: 'dbError'
            }, [
                ['section', [
                    l('dbError')
                ]]
            ]
        );
        jml('div', {id: 'dialogContainer', style: 'height: 100%'}, [
            ['div', {
                style: 'text-align: center; height: 100%',
                id: 'installationLogContainer',
                class: 'focus',
                hidden: true
            }, [
                ['p', [
                    l('wait-installing')
                ]],
                ['div', {style: 'height: 80%; overflow: auto;'}, [
                    ['pre', {id: 'installationLog'}, [
                    ]]
                ]]
                // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
            ]],
            requestPermissionsDialog,
            browserNotGrantingPersistenceAlert,
            errorRegisteringNotice,
            versionChangeNotice,
            dbErrorNotice
        ], document.body);

        return [
            requestPermissionsDialog, browserNotGrantingPersistenceAlert,
            errorRegisteringNotice, versionChangeNotice, dbErrorNotice
        ];
    }
};

const escapeHTML = (s) => {
    return !s
        ? ''
        : s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/, '&gt;');
};

// Keep this as the last import for Rollup
const JsonRefs = require('json-refs');

const getCurrDir = () =>
    window.location.href.replace(/(index\.html)?#.*$/, '');

const getMetaProp = function getMetaProp (lang, metadataObj, properties, allowObjects) {
    let prop;
    properties = typeof properties === 'string' ? [properties] : properties;
    lang.some((lan) => {
        const p = properties.slice(0);
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
const getMetadata = async (file, property, cb) => {
    try {
        return (await JsonRefs
            .resolveRefsAt(
                getCurrDir() + file + (property ? '#/' + property : '')
            )).resolved;
    } catch (err) {
        throw err;
    }
};

const getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, lang
}) {
    const fieldSchemaIndex = schemaItems.findIndex((item) =>
        item.title === field
    );
    const fieldSchema = schemaItems[fieldSchemaIndex];

    const ret = {
        fieldName: getFieldAliasOrName(field)
    };

    const fieldInfo = metadataObj.fields[field];
    let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];
    if (fieldValueAliasMap) {
        if (fieldValueAliasMap.localeKey) {
            fieldValueAliasMap = getMetaProp(
                lang,
                metadataObj,
                fieldValueAliasMap.localeKey.split('/'),
                true
            );
        }
        ret.aliases = [];
        // Todo: We could use `prefer_alias` but algorithm below may cover
        //    needed cases
        if (fieldSchema.enum && fieldSchema.enum.length) {
            fieldSchema.enum.forEach((enm) => {
                ret.aliases.push(
                    getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true)
                );
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
                ret.aliases.push(
                    ...(
                        aliases.filter((v) =>
                            aliases.every((x) =>
                                x === v || !(
                                    x.toLowerCase().startsWith(v.toLowerCase())
                                )
                            )
                        ).map((v) => v + ' (' + key + ')')
                    )
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
            browseFieldSetObject = {set: [browseFieldSetObject]};
        }
        if (!browseFieldSetObject.name) {
            browseFieldSetObject.name = browseFieldSetObject.set.join(',');
        }

        const setName = browseFieldSetObject.name;
        const fieldSets = browseFieldSetObject.set;
        const {presort} = browseFieldSetObject;
        // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
        //          as kind of fieldset

        const browseFields = fieldSets.map((field) =>
            getFieldNameAndValueAliases({
                lang,
                field, schemaItems, metadataObj,
                getFieldAliasOrName
            })
        );
        callback({setName, browseFields, i, presort}); // eslint-disable-line standard/no-callback-literal
    });
};

async function getJSON (jsonURL, cb, errBack) {
    try {
        if (Array.isArray(jsonURL)) {
            const arrResult = await Promise.all(jsonURL.map((url) => getJSON(url)));
            if (cb) {
                cb.apply(null, arrResult);
            }
            return arrResult;
        }
        const result = await fetch(jsonURL).then((r) => r.json());
        return typeof cb === 'function' ? cb(result) : result;
    } catch (e) {
        e.message += ` (File: ${jsonURL})`;
        if (errBack) {
            return errBack(e, jsonURL);
        }
        throw e;
    }
}

/* globals global, require */
if (typeof fetch === 'undefined') {
    global.fetch = (jsonURL) => {
        return new Promise((resolve, reject) => {
            const {XMLHttpRequest} = require('local-xmlhttprequest'); // Don't change to an import as won't resolve for browser testing
            const r = new XMLHttpRequest();
            r.open('GET', jsonURL, true);
            // r.responseType = 'json';
            r.onreadystatechange = function () {
                if (r.readyState !== 4) { return; }
                if (r.status === 200) {
                    // var json = r.json;
                    const response = r.responseText;
                    resolve({
                        json: () => JSON.parse(response)
                    });
                    return;
                }
                reject(new SyntaxError(
                    'Failed to fetch URL: ' + jsonURL + 'state: ' +
                    r.readyState + '; status: ' + r.status
                ));
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
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

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

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

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
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

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

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
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
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};


});

var parser = createCommonjsModule(function (module, exports) {

exports["default"] = (function() {

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements,
                    location: location()
                };
            },
        peg$c1 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c2 = function(messageText) {
                return {
                    type : 'messageTextElement',
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
        peg$c11 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
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
        peg$c18 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2],
                    location: location()
                };
            },
        peg$c19 = "plural",
        peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c21 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                };
            },
        peg$c22 = "selectordinal",
        peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                }
            },
        peg$c25 = "select",
        peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c27 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options,
                    location: location()
                };
            },
        peg$c28 = "=",
        peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c30 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern,
                    location: location()
                };
            },
        peg$c31 = "offset:",
        peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c33 = function(number) {
                return number;
            },
        peg$c34 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
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
        peg$c47 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c50 = "\\\\",
        peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c52 = function() { return '\\'; },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function() { return '\\#'; },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function() { return '\u007B'; },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function() { return '\u007D'; },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c65 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

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
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
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
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
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
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
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
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c3.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
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
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
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
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
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
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
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
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
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
                      if (peg$silentFails === 0) { peg$fail(peg$c10); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c36.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c37); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c45.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
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
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
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
              if (peg$silentFails === 0) { peg$fail(peg$c57); }
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
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
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
                  if (peg$silentFails === 0) { peg$fail(peg$c63); }
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

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();


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
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    es5.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
      try {
        return messageFormat._format(pattern, values);
      } catch (e) {
        if (e.variableId) {
          throw new Error(
            'The intl string context variable \'' + e.variableId + '\'' +
            ' was not provided to the string \'' + message + '\''
          );
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
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
es5.defineProperty(MessageFormat, '__localeData__', {value: es5.objCreate(null)});
es5.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
es5.defineProperty(MessageFormat, '__parse', {value: intlMessageformatParser["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
es5.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
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
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value, err;

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
        type, mergedType;

    for (type in defaults) {
        if (!utils.hop.call(defaults, type)) { continue; }

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
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};


});

var en = createCommonjsModule(function (module, exports) {
exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};


});

var main = createCommonjsModule(function (module, exports) {


core["default"].__addLocaleData(en["default"]);
core["default"].defaultLocale = 'en';

exports["default"] = core["default"];


});

// GENERATED FILE
var IntlMessageFormat = core["default"];

IntlMessageFormat.__addLocaleData({"locale":"af","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"af-NA","parentLocale":"af"});
IntlMessageFormat.__addLocaleData({"locale":"agq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ak","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"am","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ar","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return"other";return n==0?"zero":n==1?"one":n==2?"two":n100>=3&&n100<=10?"few":n100>=11&&n100<=99?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ar-AE","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-BH","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-DJ","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-DZ","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-EG","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-EH","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-ER","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-IL","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-IQ","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-JO","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-KM","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-KW","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-LB","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-LY","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-MA","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-MR","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-OM","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-PS","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-QA","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-SA","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-SD","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-SO","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-SS","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-SY","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-TD","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-TN","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"ar-YE","parentLocale":"ar"});
IntlMessageFormat.__addLocaleData({"locale":"as","pluralRuleFunction":function (n,ord){if(ord)return n==1||n==5||n==7||n==8||n==9||n==10?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"asa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ast","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"az","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],i10=i.slice(-1),i100=i.slice(-2),i1000=i.slice(-3);if(ord)return i10==1||i10==2||i10==5||i10==7||i10==8||(i100==20||i100==50||i100==70||i100==80)?"one":i10==3||i10==4||(i1000==100||i1000==200||i1000==300||i1000==400||i1000==500||i1000==600||i1000==700||i1000==800||i1000==900)?"few":i==0||i10==6||(i100==40||i100==60||i100==90)?"many":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"az-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"az-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"az-Latn","parentLocale":"az"});
IntlMessageFormat.__addLocaleData({"locale":"bas","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"be","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return(n10==2||n10==3)&&n100!=12&&n100!=13?"few":"other";return n10==1&&n100!=11?"one":n10>=2&&n10<=4&&(n100<12||n100>14)?"few":t0&&n10==0||n10>=5&&n10<=9||n100>=11&&n100<=14?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bem","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bez","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bm","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bm-Nkoo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bn","pluralRuleFunction":function (n,ord){if(ord)return n==1||n==5||n==7||n==8||n==9||n==10?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bn-IN","parentLocale":"bn"});
IntlMessageFormat.__addLocaleData({"locale":"bo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bo-IN","parentLocale":"bo"});
IntlMessageFormat.__addLocaleData({"locale":"br","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),n1000000=t0&&s[0].slice(-6);if(ord)return"other";return n10==1&&n100!=11&&n100!=71&&n100!=91?"one":n10==2&&n100!=12&&n100!=72&&n100!=92?"two":(n10==3||n10==4||n10==9)&&(n100<10||n100>19)&&(n100<70||n100>79)&&(n100<90||n100>99)?"few":n!=0&&t0&&n1000000==0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"brx","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bs","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bs-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"bs-Latn","parentLocale":"bs"});
IntlMessageFormat.__addLocaleData({"locale":"ca","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return n==1||n==3?"one":n==2?"two":n==4?"few":"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ca-AD","parentLocale":"ca"});
IntlMessageFormat.__addLocaleData({"locale":"ca-ES-VALENCIA","parentLocale":"ca-ES"});
IntlMessageFormat.__addLocaleData({"locale":"ca-ES","parentLocale":"ca"});
IntlMessageFormat.__addLocaleData({"locale":"ca-FR","parentLocale":"ca"});
IntlMessageFormat.__addLocaleData({"locale":"ca-IT","parentLocale":"ca"});
IntlMessageFormat.__addLocaleData({"locale":"ce","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"cgg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"chr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ckb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ckb-IR","parentLocale":"ckb"});
IntlMessageFormat.__addLocaleData({"locale":"cs","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1];if(ord)return"other";return n==1&&v0?"one":i>=2&&i<=4&&v0?"few":!v0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"cu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"cy","pluralRuleFunction":function (n,ord){if(ord)return n==0||n==7||n==8||n==9?"zero":n==1?"one":n==2?"two":n==3||n==4?"few":n==5||n==6?"many":"other";return n==0?"zero":n==1?"one":n==2?"two":n==3?"few":n==6?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"da","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],t0=Number(s[0])==n;if(ord)return"other";return n==1||!t0&&(i==0||i==1)?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"da-GL","parentLocale":"da"});
IntlMessageFormat.__addLocaleData({"locale":"dav","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"de","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"de-AT","parentLocale":"de"});
IntlMessageFormat.__addLocaleData({"locale":"de-BE","parentLocale":"de"});
IntlMessageFormat.__addLocaleData({"locale":"de-CH","parentLocale":"de"});
IntlMessageFormat.__addLocaleData({"locale":"de-LI","parentLocale":"de"});
IntlMessageFormat.__addLocaleData({"locale":"de-LU","parentLocale":"de"});
IntlMessageFormat.__addLocaleData({"locale":"dje","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"dsb","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i100=i.slice(-2),f100=f.slice(-2);if(ord)return"other";return v0&&i100==1||f100==1?"one":v0&&i100==2||f100==2?"two":v0&&(i100==3||i100==4)||(f100==3||f100==4)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"dua","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"dv","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"dyo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"dz","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ebu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ee","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ee-TG","parentLocale":"ee"});
IntlMessageFormat.__addLocaleData({"locale":"el","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"el-CY","parentLocale":"el"});
IntlMessageFormat.__addLocaleData({"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"en-001","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-150","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-AG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-AI","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-AS","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-AT","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-AU","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BB","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BE","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BI","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-BM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BS","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BW","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-BZ","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CA","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CC","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CH","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-CK","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CX","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-CY","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-DE","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-DG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-DK","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-DM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-Dsrt","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"en-ER","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-FI","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-FJ","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-FK","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-FM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GB","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GD","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GH","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GI","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-GU","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-GY","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-HK","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-IE","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-IL","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-IM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-IN","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-IO","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-JE","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-JM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-KE","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-KI","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-KN","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-KY","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-LC","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-LR","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-LS","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MH","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-MO","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MP","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-MS","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MT","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MU","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MW","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-MY","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NA","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NF","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NL","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-NR","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NU","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-NZ","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-PG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-PH","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-PK","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-PN","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-PR","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-PW","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-RW","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SB","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SC","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SD","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SE","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-SG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SH","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SI","parentLocale":"en-150"});
IntlMessageFormat.__addLocaleData({"locale":"en-SL","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SS","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SX","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-SZ","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-Shaw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"en-TC","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-TK","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-TO","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-TT","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-TV","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-TZ","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-UG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-UM","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-US","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-VC","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-VG","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-VI","parentLocale":"en"});
IntlMessageFormat.__addLocaleData({"locale":"en-VU","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-WS","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-ZA","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-ZM","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"en-ZW","parentLocale":"en-001"});
IntlMessageFormat.__addLocaleData({"locale":"eo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"es","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"es-419","parentLocale":"es"});
IntlMessageFormat.__addLocaleData({"locale":"es-AR","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-BO","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-CL","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-CO","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-CR","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-CU","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-DO","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-EA","parentLocale":"es"});
IntlMessageFormat.__addLocaleData({"locale":"es-EC","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-GQ","parentLocale":"es"});
IntlMessageFormat.__addLocaleData({"locale":"es-GT","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-HN","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-IC","parentLocale":"es"});
IntlMessageFormat.__addLocaleData({"locale":"es-MX","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-NI","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-PA","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-PE","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-PH","parentLocale":"es"});
IntlMessageFormat.__addLocaleData({"locale":"es-PR","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-PY","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-SV","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-US","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-UY","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"es-VE","parentLocale":"es-419"});
IntlMessageFormat.__addLocaleData({"locale":"et","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"eu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ewo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fa-AF","parentLocale":"fa"});
IntlMessageFormat.__addLocaleData({"locale":"ff","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<2?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ff-CM","parentLocale":"ff"});
IntlMessageFormat.__addLocaleData({"locale":"ff-GN","parentLocale":"ff"});
IntlMessageFormat.__addLocaleData({"locale":"ff-MR","parentLocale":"ff"});
IntlMessageFormat.__addLocaleData({"locale":"fi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fil","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),f10=f.slice(-1);if(ord)return n==1?"one":"other";return v0&&(i==1||i==2||i==3)||v0&&i10!=4&&i10!=6&&i10!=9||!v0&&f10!=4&&f10!=6&&f10!=9?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fo-DK","parentLocale":"fo"});
IntlMessageFormat.__addLocaleData({"locale":"fr","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return n>=0&&n<2?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fr-BE","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-BF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-BI","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-BJ","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-BL","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CA","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CD","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CG","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CH","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CI","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-CM","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-DJ","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-DZ","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-GA","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-GF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-GN","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-GP","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-GQ","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-HT","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-KM","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-LU","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MA","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MC","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MG","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-ML","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MQ","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MR","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-MU","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-NC","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-NE","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-PF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-PM","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-RE","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-RW","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-SC","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-SN","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-SY","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-TD","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-TG","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-TN","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-VU","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-WF","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fr-YT","parentLocale":"fr"});
IntlMessageFormat.__addLocaleData({"locale":"fur","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"fy","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ga","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return n==1?"one":"other";return n==1?"one":n==2?"two":t0&&n>=3&&n<=6?"few":t0&&n>=7&&n<=10?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"gd","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n==1||n==11?"one":n==2||n==12?"two":t0&&n>=3&&n<=10||t0&&n>=13&&n<=19?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"gl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"gsw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"gsw-FR","parentLocale":"gsw"});
IntlMessageFormat.__addLocaleData({"locale":"gsw-LI","parentLocale":"gsw"});
IntlMessageFormat.__addLocaleData({"locale":"gu","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"guw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"guz","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"gv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return v0&&i10==1?"one":v0&&i10==2?"two":v0&&(i100==0||i100==20||i100==40||i100==60||i100==80)?"few":!v0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ha","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ha-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ha-GH","parentLocale":"ha"});
IntlMessageFormat.__addLocaleData({"locale":"ha-NE","parentLocale":"ha"});
IntlMessageFormat.__addLocaleData({"locale":"haw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"he","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return"other";return n==1&&v0?"one":i==2&&v0?"two":v0&&(n<0||n>10)&&t0&&n10==0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"hi","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":n==6?"many":"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"hr","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"hr-BA","parentLocale":"hr"});
IntlMessageFormat.__addLocaleData({"locale":"hsb","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i100=i.slice(-2),f100=f.slice(-2);if(ord)return"other";return v0&&i100==1||f100==1?"one":v0&&i100==2||f100==2?"two":v0&&(i100==3||i100==4)||(f100==3||f100==4)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"hu","pluralRuleFunction":function (n,ord){if(ord)return n==1||n==5?"one":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"hy","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return n>=0&&n<2?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"id","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ig","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ii","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"in","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"is","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],t0=Number(s[0])==n,i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return t0&&i10==1&&i100!=11||!t0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"it","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return n==11||n==8||n==80||n==800?"many":"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"it-CH","parentLocale":"it"});
IntlMessageFormat.__addLocaleData({"locale":"it-SM","parentLocale":"it"});
IntlMessageFormat.__addLocaleData({"locale":"iu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"iu-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"iw","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return"other";return n==1&&v0?"one":i==2&&v0?"two":v0&&(n<0||n>10)&&t0&&n10==0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ja","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"jbo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"jgo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ji","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"jmc","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"jv","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"jw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ka","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],i100=i.slice(-2);if(ord)return i==1?"one":i==0||(i100>=2&&i100<=20||i100==40||i100==60||i100==80)?"many":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kab","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<2?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kaj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kam","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kcg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kde","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kea","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"khq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ki","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1);if(ord)return n10==6||n10==9||t0&&n10==0&&n!=0?"many":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kkj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kl","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kln","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"km","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ko","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ko-KP","parentLocale":"ko"});
IntlMessageFormat.__addLocaleData({"locale":"kok","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ks","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ksb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ksf","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ksh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0?"zero":n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ku","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"kw","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ky","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lag","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0];if(ord)return"other";return n==0?"zero":(i==0||i==1)&&n!=0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lkt","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ln","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ln-AO","parentLocale":"ln"});
IntlMessageFormat.__addLocaleData({"locale":"ln-CF","parentLocale":"ln"});
IntlMessageFormat.__addLocaleData({"locale":"ln-CG","parentLocale":"ln"});
IntlMessageFormat.__addLocaleData({"locale":"lo","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lrc","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lrc-IQ","parentLocale":"lrc"});
IntlMessageFormat.__addLocaleData({"locale":"lt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return"other";return n10==1&&(n100<11||n100>19)?"one":n10>=2&&n10<=9&&(n100<11||n100>19)?"few":f!=0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"luo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"luy","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"lv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",v=f.length,t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),f100=f.slice(-2),f10=f.slice(-1);if(ord)return"other";return t0&&n10==0||n100>=11&&n100<=19||v==2&&(f100>=11&&f100<=19)?"zero":n10==1&&n100!=11||v==2&&f10==1&&f100!=11||v!=2&&f10==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mas","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mas-TZ","parentLocale":"mas"});
IntlMessageFormat.__addLocaleData({"locale":"mer","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mfe","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mg","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mgh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mgo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1);if(ord)return i10==1&&i100!=11?"one":i10==2&&i100!=12?"two":(i10==7||i10==8)&&i100!=17&&i100!=18?"many":"other";return v0&&i10==1||f10==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ml","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mn-Mong","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mo","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":"other";return n==1&&v0?"one":!v0||n==0||n!=1&&(n100>=1&&n100<=19)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mr","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":n==2||n==3?"two":n==4?"few":"other";return n>=0&&n<=1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ms","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ms-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ms-BN","parentLocale":"ms"});
IntlMessageFormat.__addLocaleData({"locale":"ms-SG","parentLocale":"ms"});
IntlMessageFormat.__addLocaleData({"locale":"mt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return"other";return n==1?"one":n==0||n100>=2&&n100<=10?"few":n100>=11&&n100<=19?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mua","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"my","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"mzn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nah","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"naq","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nb","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nb-SJ","parentLocale":"nb"});
IntlMessageFormat.__addLocaleData({"locale":"nd","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ne","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return t0&&n>=1&&n<=4?"one":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ne-IN","parentLocale":"ne"});
IntlMessageFormat.__addLocaleData({"locale":"nl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nl-AW","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nl-BE","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nl-BQ","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nl-CW","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nl-SR","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nl-SX","parentLocale":"nl"});
IntlMessageFormat.__addLocaleData({"locale":"nmg","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nnh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"no","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nqo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nso","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nus","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ny","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"nyn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"om","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"om-KE","parentLocale":"om"});
IntlMessageFormat.__addLocaleData({"locale":"or","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"os","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"os-RU","parentLocale":"os"});
IntlMessageFormat.__addLocaleData({"locale":"pa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pa-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pa-Guru","parentLocale":"pa"});
IntlMessageFormat.__addLocaleData({"locale":"pap","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return n==1&&v0?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i!=1&&(i10==0||i10==1)||v0&&(i10>=5&&i10<=9)||v0&&(i100>=12&&i100<=14)?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"prg","pluralRuleFunction":function (n,ord){var s=String(n).split("."),f=s[1]||"",v=f.length,t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),f100=f.slice(-2),f10=f.slice(-1);if(ord)return"other";return t0&&n10==0||n100>=11&&n100<=19||v==2&&(f100>=11&&f100<=19)?"zero":n10==1&&n100!=11||v==2&&f10==1&&f100!=11||v!=2&&f10==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ps","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return t0&&n>=0&&n<=2&&n!=2?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pt-AO","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-PT","parentLocale":"pt","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"pt-CV","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-GW","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-MO","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-MZ","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-ST","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"pt-TL","parentLocale":"pt-PT"});
IntlMessageFormat.__addLocaleData({"locale":"qu","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"qu-BO","parentLocale":"qu"});
IntlMessageFormat.__addLocaleData({"locale":"qu-EC","parentLocale":"qu"});
IntlMessageFormat.__addLocaleData({"locale":"rm","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"rn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ro","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":"other";return n==1&&v0?"one":!v0||n==0||n!=1&&(n100>=1&&n100<=19)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ro-MD","parentLocale":"ro"});
IntlMessageFormat.__addLocaleData({"locale":"rof","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ru","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i10=i.slice(-1),i100=i.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i10==0||v0&&(i10>=5&&i10<=9)||v0&&(i100>=11&&i100<=14)?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ru-BY","parentLocale":"ru"});
IntlMessageFormat.__addLocaleData({"locale":"ru-KG","parentLocale":"ru"});
IntlMessageFormat.__addLocaleData({"locale":"ru-KZ","parentLocale":"ru"});
IntlMessageFormat.__addLocaleData({"locale":"ru-MD","parentLocale":"ru"});
IntlMessageFormat.__addLocaleData({"locale":"ru-UA","parentLocale":"ru"});
IntlMessageFormat.__addLocaleData({"locale":"rw","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"rwk","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sah","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"saq","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sbp","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sdh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"se","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"se-FI","parentLocale":"se"});
IntlMessageFormat.__addLocaleData({"locale":"se-SE","parentLocale":"se"});
IntlMessageFormat.__addLocaleData({"locale":"seh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ses","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sg","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sh","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"shi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n>=0&&n<=1?"one":t0&&n>=2&&n<=10?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"shi-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"shi-Tfng","parentLocale":"shi"});
IntlMessageFormat.__addLocaleData({"locale":"si","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"";if(ord)return"other";return n==0||n==1||i==0&&f==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1];if(ord)return"other";return n==1&&v0?"one":i>=2&&i<=4&&v0?"few":!v0?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],i100=i.slice(-2);if(ord)return"other";return v0&&i100==1?"one":v0&&i100==2?"two":v0&&(i100==3||i100==4)||!v0?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sma","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"smi","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"smj","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"smn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sms","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":n==2?"two":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"so","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"so-DJ","parentLocale":"so"});
IntlMessageFormat.__addLocaleData({"locale":"so-ET","parentLocale":"so"});
IntlMessageFormat.__addLocaleData({"locale":"so-KE","parentLocale":"so"});
IntlMessageFormat.__addLocaleData({"locale":"sq","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n==1?"one":n10==4&&n100!=14?"many":"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sq-MK","parentLocale":"sq"});
IntlMessageFormat.__addLocaleData({"locale":"sq-XK","parentLocale":"sq"});
IntlMessageFormat.__addLocaleData({"locale":"sr","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),i100=i.slice(-2),f10=f.slice(-1),f100=f.slice(-2);if(ord)return"other";return v0&&i10==1&&i100!=11||f10==1&&f100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)||f10>=2&&f10<=4&&(f100<12||f100>14)?"few":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sr-Cyrl","parentLocale":"sr"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Cyrl-BA","parentLocale":"sr-Cyrl"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Cyrl-ME","parentLocale":"sr-Cyrl"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Cyrl-XK","parentLocale":"sr-Cyrl"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sr-Latn-BA","parentLocale":"sr-Latn"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Latn-ME","parentLocale":"sr-Latn"});
IntlMessageFormat.__addLocaleData({"locale":"sr-Latn-XK","parentLocale":"sr-Latn"});
IntlMessageFormat.__addLocaleData({"locale":"ss","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ssy","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"st","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sv","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return(n10==1||n10==2)&&n100!=11&&n100!=12?"one":"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sv-AX","parentLocale":"sv"});
IntlMessageFormat.__addLocaleData({"locale":"sv-FI","parentLocale":"sv"});
IntlMessageFormat.__addLocaleData({"locale":"sw","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"sw-CD","parentLocale":"sw"});
IntlMessageFormat.__addLocaleData({"locale":"sw-KE","parentLocale":"sw"});
IntlMessageFormat.__addLocaleData({"locale":"sw-UG","parentLocale":"sw"});
IntlMessageFormat.__addLocaleData({"locale":"syr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ta","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ta-LK","parentLocale":"ta"});
IntlMessageFormat.__addLocaleData({"locale":"ta-MY","parentLocale":"ta"});
IntlMessageFormat.__addLocaleData({"locale":"ta-SG","parentLocale":"ta"});
IntlMessageFormat.__addLocaleData({"locale":"te","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"teo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"teo-KE","parentLocale":"teo"});
IntlMessageFormat.__addLocaleData({"locale":"th","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ti","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ti-ER","parentLocale":"ti"});
IntlMessageFormat.__addLocaleData({"locale":"tig","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tk","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tl","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],f=s[1]||"",v0=!s[1],i10=i.slice(-1),f10=f.slice(-1);if(ord)return n==1?"one":"other";return v0&&(i==1||i==2||i==3)||v0&&i10!=4&&i10!=6&&i10!=9||!v0&&f10!=4&&f10!=6&&f10!=9?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tn","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"to","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tr","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tr-CY","parentLocale":"tr"});
IntlMessageFormat.__addLocaleData({"locale":"ts","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"twq","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"tzm","pluralRuleFunction":function (n,ord){var s=String(n).split("."),t0=Number(s[0])==n;if(ord)return"other";return n==0||n==1||t0&&n>=11&&n<=99?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ug","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"uk","pluralRuleFunction":function (n,ord){var s=String(n).split("."),i=s[0],v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2),i10=i.slice(-1),i100=i.slice(-2);if(ord)return n10==3&&n100!=13?"few":"other";return v0&&i10==1&&i100!=11?"one":v0&&(i10>=2&&i10<=4)&&(i100<12||i100>14)?"few":v0&&i10==0||v0&&(i10>=5&&i10<=9)||v0&&(i100>=11&&i100<=14)?"many":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ur","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"ur-IN","parentLocale":"ur"});
IntlMessageFormat.__addLocaleData({"locale":"uz","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"uz-Arab","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"uz-Cyrl","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"uz-Latn","parentLocale":"uz"});
IntlMessageFormat.__addLocaleData({"locale":"vai","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"vai-Latn","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"vai-Vaii","parentLocale":"vai"});
IntlMessageFormat.__addLocaleData({"locale":"ve","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"vi","pluralRuleFunction":function (n,ord){if(ord)return n==1?"one":"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"vo","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"vun","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"wa","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==0||n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"wae","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"wo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"xh","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"xog","pluralRuleFunction":function (n,ord){if(ord)return"other";return n==1?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"yav","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"yi","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1];if(ord)return"other";return n==1&&v0?"one":"other"}});
IntlMessageFormat.__addLocaleData({"locale":"yo","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"yo-BJ","parentLocale":"yo"});
IntlMessageFormat.__addLocaleData({"locale":"zgh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"zh","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hans","parentLocale":"zh"});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hans-HK","parentLocale":"zh-Hans"});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hans-MO","parentLocale":"zh-Hans"});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hans-SG","parentLocale":"zh-Hans"});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hant","pluralRuleFunction":function (n,ord){if(ord)return"other";return"other"}});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hant-HK","parentLocale":"zh-Hant"});
IntlMessageFormat.__addLocaleData({"locale":"zh-Hant-MO","parentLocale":"zh-Hant-HK"});
IntlMessageFormat.__addLocaleData({"locale":"zu","pluralRuleFunction":function (n,ord){if(ord)return"other";return n>=0&&n<=1?"one":"other"}});

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

function IMFClass (opts) {
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

    const loadFallbacks = (cb) => {
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
            const runCallback = (fallbackLocales) => {
                if (opts.callback) {
                    opts.callback.apply(this, [
                        this.getFormatter(opts.namespace),
                        this.getFormatter.bind(this),
                        locales,
                        fallbackLocales
                    ]);
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
    function messageForNSParts (locale, namesp, separator, key) {
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
        if (isArray(key)) { // e.g., [ns1, ns2, key]
            const newKey = key.pop();
            currNs = key.join(sep);
            key = newKey;
        } else {
            const keyPos = key.indexOf(sep);
            if (!currNs && keyPos > -1) { // e.g., 'ns1.ns2.key'
                currNs = key.slice(0, keyPos);
                key = key.slice(keyPos + 1);
            }
        }
        function findMessage (locales) {
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
            throw new Error(
                'Message not found for locales ' + this.langs +
                (this.fallbackLanguages
                    ? ' (with fallback languages ' + this.fallbackLanguages + ')'
                    : ''
                ) +
                ' with key ' + key + ', namespace ' + currNs +
                ', and namespace separator ' + sep
            );
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
    return getJSON(
        langs.map(this.localeFileResolver, this),
        (...locales) => {
            if (!avoidSettingLocales) {
                this.locales.push(...locales);
            }
            if (cb) {
                cb.apply(this, locales);
            }
        }
    );
};

/* eslint-env node */

if (typeof global !== 'undefined') {
    global.IntlMessageFormat = intlMessageformat;
}

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
    lang, fallbackLanguages, $p, files, allowPlugins
}) {
    const filesObj = await getJSON(files);
    const localeFromFileData = (lan) =>
        filesObj['localization-strings'][lan];
    const imfFile = IMFClass({
        locales: lang.map(localeFromFileData),
        fallbackLocales: fallbackLanguages.map(localeFromFileData)
    });
    const lf = imfFile.getFormatter();

    let fileData;
    const work = $p.get('work');
    const fileGroup = filesObj.groups.find((fg) => {
        fileData = fg.files.find((file) =>
            work === lf(['workNames', fg.id, file.name])
        );
        return Boolean(fileData);
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
        pluginPaths, pluginFieldMappingForWork;
    if (allowPlugins) {
        const pluginFieldMapping = filesObj['plugin-field-mapping'];
        const pluginFieldMappingID = pluginFieldMapping[fileGroup.id];
        const possiblePluginFieldMappingForWork = pluginFieldMappingID[fileData.name];
        if (possiblePluginFieldMappingForWork) {
            pluginFieldsForWork = Object.keys(possiblePluginFieldMappingForWork);
            pluginsInWork = Object.keys(filesObj.plugins).filter((p) => {
                return pluginFieldsForWork.includes(p);
            });
            pluginFieldMappingForWork = pluginsInWork.map((p) => {
                return possiblePluginFieldMappingForWork[p];
            });
            pluginPaths = pluginsInWork.map((p) => filesObj.plugins[p].path);
            getPlugins = pluginsInWork;
        }
    }
    const metadataObj = await getMetadata(metadataFile, metadataProperty);
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
    return Promise.all([
        fileData, lf, getFieldAliasOrName, // Pass on non-promises
        getMetadata(schemaFile, schemaProperty),
        metadataObj,
        ...(getPlugins
            ? [
                pluginsInWork, // Non-promise
                pluginFieldMappingForWork, // Non-promise
                Promise.all(
                    pluginPaths.map((pluginPath) => {
                        return window.importer(pluginPath);
                    })
                )
            ]
            : Array(3).fill(null)
        )
    ]);
};

/* eslint-env browser */
// Keep this as the last import for Rollup
const JsonRefs$1 = require('json-refs');

const resultsDisplayServerOrClient$1 = async function resultsDisplayServerOrClient ({
    l, lang, fallbackLanguages, imfLocales, $p, skipIndexedDB, prefI18n,
    files, allowPlugins
}) {
    const getCellValue = ({
        fieldValueAliasMapPreferred, escapeColumnIndexes
    }) => ({
        tr, idx
    }) => {
        let tdVal = (fieldValueAliasMapPreferred[idx] !== undefined
            ? fieldValueAliasMapPreferred[idx][tr[idx]]
            : tr[idx]
        );
        if (tdVal && typeof tdVal === 'object') {
            tdVal = Object.values(tdVal);
        }
        if (Array.isArray(tdVal)) {
            tdVal = tdVal.join(l('comma-space'));
        }
        return ((escapeColumnIndexes[idx] || !this.trustFormatHTML) &&
            typeof tdVal === 'string')
            ? {tdVal: escapeHTML(tdVal), htmlEscaped: true}
            : {tdVal};
    };
    const determineEnd = ({
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        applicableBrowseFieldNames, starts, ends
    }) => ({
        tr, foundState
    }) => {
        const rowIDPartsPreferred = [];
        const rowIDParts = applicableBrowseFieldNames.map((fieldName) => {
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
                return fieldValueAliasMap[idx][tr[idx]];
            }
            rowIDPartsPreferred.push(tr[idx]);
            return tr[idx];
        });

        // Todo: Use schema to determine each and use `parseInt`
        //   on other value instead of `String` conversions
        if (!foundState.start) {
            if (starts.some((part, i) => {
                const rowIDPart = rowIDParts[i];
                return Array.isArray(rowIDPart)
                    ? !rowIDPart.some((rip) => part === String(rip))
                    : (rowIDPart && typeof rowIDPart === 'object'
                        ? !Object.values(rowIDPart).some((rip) => part === String(rip))
                        : part !== String(rowIDPart)
                    );
            })) {
                return false;
            }
            foundState.start = true;
        }
        // This doesn't go in an `else` for the above in case the start is the end
        if (ends.every((part, i) => {
            const rowIDPart = rowIDParts[i];
            return Array.isArray(rowIDPart)
                ? rowIDPart.some((rip) => part === String(rip))
                : (rowIDPart && typeof rowIDPart === 'object'
                    ? Object.values(rowIDPart).some((rip) => part === String(rip))
                    : part === String(rowIDPart)
                );
        })) {
            foundState.end = true;
        } else if (foundState.end) { // If no longer matching, return
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
            if (field && checked === l('yes')) {
                checkedFields.push(field);
            }
        } while (field);
        checkedFields = checkedFields.filter((cf) => localizedFieldNames.includes(cf));
        const checkedFieldIndexes = checkedFields.map((cf) => localizedFieldNames.indexOf(cf));
        const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
            const interlin = $p.get('interlin' + (cfi + 1), true);
            return interlin && interlin.split(/\s*,\s*/).map((col) =>
                // Todo: Avoid this when known to be integer or if string, though allow
                //    string to be treated as number if config is set.
                parseInt(col, 10) - 1
            ).filter((n) => !Number.isNaN(n));
        });
        return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
    };
    const getCaption = ({starts, ends, applicableBrowseFieldNames, heading}) => {
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
            const startSep = Templates.resultsDisplayServerOrClient.startSeparator({l});
            const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient
                .innerBrowseFieldSeparator({l});

            const buildRanges = () => {
                const endVals = [];
                const startRange = starts.reduce((str, startFieldValue, i) => {
                    const ret = str + startFieldValue;
                    if (startFieldValue === ends[i]) { // We abbreviate as start/end share same Book, etc.
                        return ret +
                            (i > 0
                                ? innerBrowseFieldSeparator // e.g., for "Genesis 7, 5-8"
                                : ' ' // e.g., for 2nd space in "Surah 2 5-8"
                            );
                    }
                    endVals.push(ends[i]);
                    return ret + startSep;
                }, '').slice(0, -(startSep.length));

                const rangeNames = applicableBrowseFieldNames.join(innerBrowseFieldSeparator);
                return escapeHTML(
                    Templates.resultsDisplayServerOrClient.ranges({l, startRange, endVals, rangeNames})
                );
            };
            const ranges = buildRanges();
            caption = Templates.resultsDisplayServerOrClient.caption({heading, ranges});
        }
        return [hasCaption, caption];
    };
    const setAnchor = ({
        applicableBrowseFieldSchemaIndexes, getRawFieldValue,
        fieldValueAliasMapPreferred, ilRaw, iil, max
    }) => {
        // Check if user added this (e.g., even to end of URL with
        //   other anchor params)
        let anchor;
        const anchorRowCol = ilRaw('anchorrowcol');
        if (anchorRowCol) {
            anchor = Templates.resultsDisplayClient.anchorRowCol({anchorRowCol});
        }
        if (!anchor) {
            const anchors = [];
            let anchorField = '';
            for (let i = 1, breakout; !breakout && !anchors.length; i++) {
                for (let j = 1; ; j++) {
                    const anchorText = 'anchor' + i + '-' + j;
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
                    const raw = fieldValueAliasMapPreferred[x] &&
                        fieldValueAliasMapPreferred[x][rawVal];
                    anchors.push(raw || anchor);
                    // anchors.push({anchorText, anchor});
                }
            }
            if (anchors.length) {
                const escapeSelectorAttValue = (str) => (str || '').replace(/["\\]/g, '\\$&');
                const escapedRow = escapeSelectorAttValue(anchors.join('-'));
                const escapedCol = anchorField
                    ? escapeSelectorAttValue(anchorField)
                    : undefined;
                anchor = Templates.resultsDisplayClient.anchors({
                    escapedRow, escapedCol
                });
            }
        }
        if (anchor) {
            anchor.scrollIntoView();
        }
    };
    const runPresort = ({presort, tableData, applicableBrowseFieldNames, localizedFieldNames}) => {
        // Todo: Ought to be checking against an aliased table
        if (presort) {
            tableData.sort((rowA, rowB) => {
                let precedence;
                applicableBrowseFieldNames.some((fieldName) => {
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
        schemaItems, metadataObj, getFieldAliasOrName, usePreferAlias
    }) => {
        return schemaItems.map(({title: field}) => {
            const {preferAlias, fieldValueAliasMap} = getFieldNameAndValueAliases({
                field, schemaItems, metadataObj, getFieldAliasOrName, lang
            });
            if (fieldValueAliasMap) {
                Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        fieldValueAliasMap[key] = val.map((value) =>
                            Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value})
                        );
                        return;
                    }
                    if (val && typeof val === 'object') {
                        if (usePreferAlias && typeof preferAlias === 'string') {
                            fieldValueAliasMap[key] =
                                Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                    key, value: val[preferAlias]
                                });
                        } else {
                            Object.entries(val).forEach(([k, value]) => {
                                fieldValueAliasMap[key][k] =
                                    Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                        key, value
                                    });
                            });
                        }
                        return;
                    }
                    fieldValueAliasMap[key] =
                        Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value: val});
                });
                return preferAlias !== false ? fieldValueAliasMap : undefined;
            }
        });
    };
    const $pRaw = (param, avoidLog) => {
        // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)
        let key;
        const p = $p.get(param, true);
        function reverseLocaleLookup (locale) {
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
    const escapeQuotedCSS = (s) => s.replace(/"/g, '\\"');
    const escapeCSS = escapeHTML;
    const $pRawEsc = (param) => escapeHTML($pRaw(param));
    const $pEscArbitrary = (param) => escapeHTML($p.get(param, true));
    const getRawFieldValue = (v) => typeof v === 'string'
        ? v.replace(/^.* \((.*?)\)$/, '$1')
        : v;

    const [
        fileData, lf, getFieldAliasOrName, schemaObj, metadataObj,
        pluginKeys, pluginFieldMappings, pluginObjects
    ] = await getWorkData({
        files, allowPlugins,
        lang, fallbackLanguages, $p
    });
    console.log('pluginKeys', pluginKeys);
    console.log('pluginFieldMappings', pluginFieldMappings);
    console.log('pluginObjects', pluginObjects);
    document.title = lf({
        key: 'browserfile-resultsdisplay',
        values: {
            work: fileData
                ? getMetaProp(lang, metadataObj, 'alias')
                : ''
        },
        fallback: true
    });

    const heading = getMetaProp(lang, metadataObj, 'heading');
    const schemaItems = schemaObj.items.items;
    const setNames = [];
    const presorts = [];
    const browseFieldSets = [];
    getBrowseFieldData({
        metadataObj, schemaItems, getFieldAliasOrName, lang,
        callback ({setName, browseFields, presort}) {
            setNames.push(setName);
            presorts.push(presort);
            browseFieldSets.push(browseFields);
        }
    });

    const fieldValueAliasMap = getFieldValueAliasMap({
        schemaItems, metadataObj, getFieldAliasOrName, usePreferAlias: false
    });
    const fieldValueAliasMapPreferred = getFieldValueAliasMap({
        schemaItems, metadataObj, getFieldAliasOrName, usePreferAlias: true
    });

    const localizedFieldNames = schemaItems.map((si) => getFieldAliasOrName(si.title));
    const escapeColumnIndexes = schemaItems.map((si) => si.format !== 'html');
    const fieldLangs = schemaItems.map((si) => metadataObj.fields[si.title].lang);

    // Todo: Repeats some code in workDisplay; probably need to reuse
    //   these functions more in `Templates.resultsDisplayServerOrClient` too
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
        ? $p.get('i18n', true) === '1'
        : prefI18n === 'true' || (
            prefI18n !== 'false' && this.localizeParamNames
        );
    const il = localizeParamNames
        ? key => l(['params', key])
        : key => key;
    const iil = localizeParamNames
        ? key => l(['params', 'indexed', key])
        : key => key;
    const ilRaw = localizeParamNames
        ? (key, suffix = '') => $p.get(il(key) + suffix, true)
        : (key, suffix = '') => $p.get(key + suffix, true);
    const iilRaw = localizeParamNames
        ? (key, suffix = '') => $p.get(iil(key) + suffix, true)
        : (key, suffix = '') => $p.get(key + suffix, true);

    const browseFieldSetIdx = browseFieldSets.findIndex((item, i) =>
        typeof iilRaw('start', (i + 1) + '-1') === 'string'
    );
    const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
    const applicableBrowseFieldSetName = setNames[browseFieldSetIdx];
    const applicableBrowseFieldNames = applicableBrowseFieldSet.map((abfs) =>
        abfs.fieldName
    );
    const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map((abfs) =>
        abfs.fieldSchemaIndex
    );

    const fieldSchemaTypes = applicableBrowseFieldSet.map((abfs) => abfs.fieldSchema.type);
    const buildRangePoint = (startOrEnd) =>
        applicableBrowseFieldNames.map((bfn, j) =>
            // Todo: i18nize?
            $p.get(
                startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1),
                true
            )
        );
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
    const startsRaw = starts.map(stripToRawFieldValue);
    const endsRaw = ends.map(stripToRawFieldValue);

    let tableData;
    if (!skipIndexedDB) {
        tableData = await new Promise((resolve, reject) => {
            // Todo: Fetch the work in code based on the non-localized `datafileName`
            const dbName = this.namespace + '-textbrowser-cache-data';
            const req = indexedDB.open(dbName);
            req.onsuccess = ({target: {result: db}}) => {
                const storeName = 'files-to-cache-' + unlocalizedWorkName;
                const trans = db.transaction(storeName);
                const store = trans.objectStore(storeName);
                // Get among browse field sets by index number within URL params
                const index = store.index(
                    'browseFields-' + applicableBrowseFieldSetName
                );

                // console.log('dbName', dbName);
                // console.log('storeName', storeName);
                // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

                const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));
                r.onsuccess = ({target: {result}}) => {
                    const converted = result.map((r) => r.value);
                    resolve(converted);
                };
            };
        });
    } else {
        // No need for presorting in indexedDB, given indexes
        const presort = presorts[browseFieldSetIdx];
        // Given that we are not currently wishing to add complexity to
        //   our server-side code (though should be easy if using Node.js),
        //   we retrieve the whole file and then sort where presorting is
        //   needed
        if (presort || this.noDynamic) {
            ({
                resolved: {data: tableData}
            } = await JsonRefs$1.resolveRefs(fileData.file));
            runPresort({presort, tableData, applicableBrowseFieldNames, localizedFieldNames});
        } else {
            tableData = (await fetch(
                Object.entries({
                    unlocalizedWorkName, startsRaw, endsRaw
                }).reduce((url, [arg, argVal]) => {
                    return url + '&' + arg + '=' + encodeURIComponent(
                        JSON.stringify(argVal)
                    );
                }, 'textbrowser?prefI18n=' + encodeURIComponent(prefI18n))
            )).json();
        }
    }
    Templates.resultsDisplayClient.main({
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs,
        caption, hasCaption, showInterlinTitles,
        determineEnd: determineEnd({
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames, applicableBrowseFieldNames,
            starts, ends
        }),
        getCellValue: getCellValue({
            fieldValueAliasMapPreferred, escapeColumnIndexes, escapeHTML
        }),
        checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
            localizedFieldNames
        }),
        interlinearSeparator: this.interlinearSeparator
    });
    setAnchor({
        applicableBrowseFieldSchemaIndexes, getRawFieldValue,
        fieldValueAliasMapPreferred, ilRaw, iil,
        max: browseFieldSets.length
    });
};

function getLanguageInfo ({langData, $p}) {
    const langs = langData.languages;
    const localePass = (lcl) =>
        langs.some(({code}) => code === lcl) ? lcl : false;
    const languageParam = $p.get('lang', true);
    // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice
    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length
        ? navLangs
        : [localePass(navigator.language) || 'en-US'];
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

function getIMFFallbackResults ({
    $p,
    lang, langs, langData, fallbackLanguages,
    resultsDisplay,
    localeCallback = false
}) {
    if (!lang) {
        ({lang, langs, fallbackLanguages} = getLanguageInfo({$p, langData}));
    }
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
                $p
            }, ...args);
        };
        const imf = IMFClass({
            languages: lang,
            fallbackLanguages,
            localeFileResolver: (code) => {
                // Todo: For editing of locales, we might instead resolve all
                //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
                //    replace IMF() loadLocales behavior with our own now resolved
                //    locales; see https://github.com/jdorn/json-editor/issues/132
                return langData.localeFileBasePath + langs.find((l) =>
                    l.code === code
                ).locale.$ref;
            },
            async callback (...args) {
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
    target.languages = source.languages || (typeof __dirname !== 'undefined')
        ? require('path').resolve(__dirname, '../../appdata/languages.json') // eslint-disable-line no-undef
        : new URL(
            '../appdata/languages.json',
            // Todo: Substitute with moduleURL once implemented
            new URL('node_modules/textbrowser/resources/index.js', location)
        ).href;
    target.serviceWorkerPath = source.serviceWorkerPath || 'sw.js';
    target.files = source.files || 'files.json';
    target.namespace = source.namespace || 'textbrowser';
    target.staticFilesToCache = source.staticFilesToCache; // Defaults in worker file (as `userStaticFiles`)
};

let ShimDOMException;
const phases = {
    NONE: 0,
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
};

if (typeof DOMException === 'undefined') {
    // Todo: Better polyfill (if even needed here)
    ShimDOMException = function DOMException (msg, name) { // No need for `toString` as same as for `Error`
        const err = new Error(msg);
        err.name = name;
        return err;
    };
} else {
    ShimDOMException = DOMException;
}

const ev = new WeakMap();
const evCfg = new WeakMap();

// Todo: Set _ev argument outside of this function
/**
* We use an adapter class rather than a proxy not only for compatibility but also since we have to clone
* native event properties anyways in order to properly set `target`, etc.
* @note The regular DOM method `dispatchEvent` won't work with this polyfill as it expects a native event
*/
const ShimEvent = function Event (type) { // eslint-disable-line no-native-reassign
    // For WebIDL checks of function's `length`, we check `arguments` for the optional arguments
    this[Symbol.toStringTag] = 'Event';
    this.toString = () => {
        return '[object Event]';
    };
    let evInit = arguments[1];
    let _ev = arguments[2];
    if (!arguments.length) {
        throw new TypeError("Failed to construct 'Event': 1 argument required, but only 0 present.");
    }
    evInit = evInit || {};
    _ev = _ev || {};

    const _evCfg = {};
    if ('composed' in evInit) {
        _evCfg.composed = evInit.composed;
    }

    // _evCfg.isTrusted = true; // We are not always using this for user-created events
    // _evCfg.timeStamp = new Date().valueOf(); // This is no longer a timestamp, but monotonic (elapsed?)

    ev.set(this, _ev);
    evCfg.set(this, _evCfg);
    this.initEvent(type, evInit.bubbles, evInit.cancelable);
    Object.defineProperties(this,
        ['target', 'currentTarget', 'eventPhase', 'defaultPrevented'].reduce((obj, prop) => {
            obj[prop] = {
                get () {
                    return (/* prop in _evCfg && */ _evCfg[prop] !== undefined) ? _evCfg[prop] : (
                        prop in _ev ? _ev[prop] : (
                            // Defaults
                            prop === 'eventPhase' ? 0 : (prop === 'defaultPrevented' ? false : null)
                        )
                    );
                }
            };
            return obj;
        }, {})
    );
    const props = [
        // Event
        'type',
        'bubbles', 'cancelable', // Defaults to false
        'isTrusted', 'timeStamp',
        'initEvent',
        // Other event properties (not used by our code)
        'composedPath', 'composed'
    ];
    if (this.toString() === '[object CustomEvent]') {
        props.push('detail', 'initCustomEvent');
    }

    Object.defineProperties(this, props.reduce((obj, prop) => {
        obj[prop] = {
            get () {
                return prop in _evCfg ? _evCfg[prop] : (prop in _ev ? _ev[prop] : (
                    ['bubbles', 'cancelable', 'composed'].includes(prop) ? false : undefined
                ));
            }
        };
        return obj;
    }, {}));
};

ShimEvent.prototype.preventDefault = function () {
    if (!(this instanceof ShimEvent)) {
        throw new TypeError('Illegal invocation');
    }
    const _ev = ev.get(this);
    const _evCfg = evCfg.get(this);
    if (this.cancelable && !_evCfg._passive) {
        _evCfg.defaultPrevented = true;
        if (typeof _ev.preventDefault === 'function') { // Prevent any predefined defaults
            _ev.preventDefault();
        }
    }};
ShimEvent.prototype.stopImmediatePropagation = function () {
    const _evCfg = evCfg.get(this);
    _evCfg._stopImmediatePropagation = true;
};
ShimEvent.prototype.stopPropagation = function () {
    const _evCfg = evCfg.get(this);
    _evCfg._stopPropagation = true;
};
ShimEvent.prototype.initEvent = function (type, bubbles, cancelable) { // Chrome currently has function length 1 only but WebIDL says 3
    // const bubbles = arguments[1];
    // const cancelable = arguments[2];
    const _evCfg = evCfg.get(this);

    if (_evCfg._dispatched) {
        return;
    }

    _evCfg.type = type;
    if (bubbles !== undefined) {
        _evCfg.bubbles = bubbles;
    }
    if (cancelable !== undefined) {
        _evCfg.cancelable = cancelable;
    }
};
['type', 'target', 'currentTarget'].forEach((prop) => {
    Object.defineProperty(ShimEvent.prototype, prop, {
        enumerable: true,
        configurable: true,
        get () {
            throw new TypeError('Illegal invocation');
        }
    });
});
['eventPhase', 'defaultPrevented', 'bubbles', 'cancelable', 'timeStamp'].forEach((prop) => {
    Object.defineProperty(ShimEvent.prototype, prop, {
        enumerable: true,
        configurable: true,
        get () {
            throw new TypeError('Illegal invocation');
        }
    });
});
['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'].forEach((prop, i) => {
    Object.defineProperty(ShimEvent, prop, {
        enumerable: true,
        writable: false,
        value: i
    });
    Object.defineProperty(ShimEvent.prototype, prop, {
        writable: false,
        value: i
    });
});
ShimEvent[Symbol.toStringTag] = 'Function';
ShimEvent.prototype[Symbol.toStringTag] = 'EventPrototype';
Object.defineProperty(ShimEvent, 'prototype', {
    writable: false
});

const ShimCustomEvent = function CustomEvent (type) {
    let evInit = arguments[1];
    const _ev = arguments[2];
    ShimEvent.call(this, type, evInit, _ev);
    this[Symbol.toStringTag] = 'CustomEvent';
    this.toString = () => {
        return '[object CustomEvent]';
    };
    // var _evCfg = evCfg.get(this);
    evInit = evInit || {};
    this.initCustomEvent(
        type,
        evInit.bubbles,
        evInit.cancelable,
        'detail' in evInit ? evInit.detail : null
    );
};
Object.defineProperty(ShimCustomEvent.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: ShimCustomEvent
});
ShimCustomEvent.prototype.initCustomEvent = function (type, bubbles, cancelable, detail) {
    if (!(this instanceof ShimCustomEvent)) {
        throw new TypeError('Illegal invocation');
    }
    const _evCfg = evCfg.get(this);
    ShimCustomEvent.call(this, type, {
        bubbles: bubbles, cancelable: cancelable, detail: detail
    }, arguments[4]);

    if (_evCfg._dispatched) {
        return;
    }

    if (detail !== undefined) {
        _evCfg.detail = detail;
    }
    Object.defineProperty(this, 'detail', {
        get () {
            return _evCfg.detail;
        }
    });
};
ShimCustomEvent[Symbol.toStringTag] = 'Function';
ShimCustomEvent.prototype[Symbol.toStringTag] = 'CustomEventPrototype';

Object.defineProperty(ShimCustomEvent.prototype, 'detail', {
    enumerable: true,
    configurable: true,
    get () {
        throw new TypeError('Illegal invocation');
    }
});
Object.defineProperty(ShimCustomEvent, 'prototype', {
    writable: false
});

function copyEvent (ev) {
    if ('detail' in ev) {
        return new ShimCustomEvent(
            ev.type, {bubbles: ev.bubbles, cancelable: ev.cancelable, detail: ev.detail}, ev
        );
    }
    return new ShimEvent(ev.type, {bubbles: ev.bubbles, cancelable: ev.cancelable}, ev);
}

function getListenersOptions (listeners, type, options) {
    let listenersByType = listeners[type];
    if (listenersByType === undefined) listeners[type] = listenersByType = [];
    options = typeof options === 'boolean' ? {capture: options} : (options || {});
    const stringifiedOptions = JSON.stringify(options);
    const listenersByTypeOptions = listenersByType.filter((obj) => {
        return stringifiedOptions === JSON.stringify(obj.options);
    });
    return {listenersByTypeOptions: listenersByTypeOptions, options: options, listenersByType: listenersByType};
}

const methods = {
    addListener (listeners, listener, type, options) {
        const listenerOptions = getListenersOptions(listeners, type, options);
        const listenersByTypeOptions = listenerOptions.listenersByTypeOptions;
        options = listenerOptions.options;
        const listenersByType = listenerOptions.listenersByType;

        if (listenersByTypeOptions.some((l) => {
            return l.listener === listener;
        })) return;
        listenersByType.push({listener: listener, options: options});
    },

    removeListener (listeners, listener, type, options) {
        const listenerOptions = getListenersOptions(listeners, type, options);
        const listenersByType = listenerOptions.listenersByType;
        const stringifiedOptions = JSON.stringify(listenerOptions.options);

        listenersByType.some((l, i) => {
            if (l.listener === listener && stringifiedOptions === JSON.stringify(l.options)) {
                listenersByType.splice(i, 1);
                if (!listenersByType.length) delete listeners[type];
                return true;
            }
        });
    },

    hasListener (listeners, listener, type, options) {
        const listenerOptions = getListenersOptions(listeners, type, options);
        const listenersByTypeOptions = listenerOptions.listenersByTypeOptions;
        return listenersByTypeOptions.some((l) => {
            return l.listener === listener;
        });
    }
};

function EventTarget () {
    throw new TypeError('Illegal constructor');
}

Object.assign(EventTarget.prototype, ['Early', '', 'Late', 'Default'].reduce(function (obj, listenerType) {
    ['add', 'remove', 'has'].forEach(function (method) {
        obj[method + listenerType + 'EventListener'] = function (type, listener) {
            const options = arguments[2]; // We keep the listener `length` as per WebIDL
            if (arguments.length < 2) throw new TypeError('2 or more arguments required');
            if (typeof type !== 'string') {
                throw new ShimDOMException('UNSPECIFIED_EVENT_TYPE_ERR', 'UNSPECIFIED_EVENT_TYPE_ERR');
            }
            if (listener.handleEvent) { listener = listener.handleEvent.bind(listener); }
            const arrStr = '_' + listenerType.toLowerCase() + (listenerType === '' ? 'l' : 'L') + 'isteners';
            if (!this[arrStr]) {
                Object.defineProperty(this, arrStr, {value: {}});
            }
            return methods[method + 'Listener'](this[arrStr], listener, type, options);
        };
    });
    return obj;
}, {}));

Object.assign(EventTarget.prototype, {
    __setOptions (customOptions) {
        customOptions = customOptions || {};
        // Todo: Make into event properties?
        this._defaultSync = customOptions.defaultSync;
        this._extraProperties = customOptions.extraProperties || [];
        if (customOptions.legacyOutputDidListenersThrowFlag) { // IndexedDB
            this._legacyOutputDidListenersThrowCheck = true;
            this._extraProperties.push('__legacyOutputDidListenersThrowError');
        }
    },
    dispatchEvent (ev) {
        return this._dispatchEvent(ev, true);
    },
    _dispatchEvent (ev, setTarget) {
        ['early', '', 'late', 'default'].forEach((listenerType) => {
            const arrStr = '_' + listenerType + (listenerType === '' ? 'l' : 'L') + 'isteners';
            if (!this[arrStr]) {
                Object.defineProperty(this, arrStr, {value: {}});
            }
        });

        let _evCfg = evCfg.get(ev);
        if (_evCfg && setTarget && _evCfg._dispatched) {
            throw new ShimDOMException('The object is in an invalid state.', 'InvalidStateError');
        }

        let eventCopy;
        if (_evCfg) {
            eventCopy = ev;
        } else {
            eventCopy = copyEvent(ev);
            _evCfg = evCfg.get(eventCopy);
            _evCfg._dispatched = true;
            this._extraProperties.forEach((prop) => {
                if (prop in ev) {
                    eventCopy[prop] = ev[prop]; // Todo: Put internal to `ShimEvent`?
                }
            });
        }
        const {type} = eventCopy;

        function finishEventDispatch () {
            _evCfg.eventPhase = phases.NONE;
            _evCfg.currentTarget = null;
            delete _evCfg._children;
        }
        function invokeDefaults () {
            // Ignore stopPropagation from defaults
            _evCfg._stopImmediatePropagation = undefined;
            _evCfg._stopPropagation = undefined;
            // We check here for whether we should invoke since may have changed since timeout (if late listener prevented default)
            if (!eventCopy.defaultPrevented || !_evCfg.cancelable) { // 2nd check should be redundant
                _evCfg.eventPhase = phases.AT_TARGET; // Temporarily set before we invoke default listeners
                eventCopy.target.invokeCurrentListeners(eventCopy.target._defaultListeners, eventCopy, type);
            }
            finishEventDispatch();
        }
        const continueEventDispatch = () => {
            // Ignore stop propagation of user now
            _evCfg._stopImmediatePropagation = undefined;
            _evCfg._stopPropagation = undefined;
            if (!this._defaultSync) {
                setTimeout(invokeDefaults, 0);
            } else invokeDefaults();

            _evCfg.eventPhase = phases.AT_TARGET; // Temporarily set before we invoke late listeners
            // Sync default might have stopped
            if (!_evCfg._stopPropagation) {
                _evCfg._stopImmediatePropagation = undefined;
                _evCfg._stopPropagation = undefined;
                // We could allow stopPropagation by only executing upon (_evCfg._stopPropagation)
                eventCopy.target.invokeCurrentListeners(eventCopy.target._lateListeners, eventCopy, type);
            }
            finishEventDispatch();

            return !eventCopy.defaultPrevented;
        };

        if (setTarget) _evCfg.target = this;

        switch (eventCopy.eventPhase) {
        default: case phases.NONE:

            _evCfg.eventPhase = phases.AT_TARGET; // Temporarily set before we invoke early listeners
            this.invokeCurrentListeners(this._earlyListeners, eventCopy, type);
            if (!this.__getParent) {
                _evCfg.eventPhase = phases.AT_TARGET;
                return this._dispatchEvent(eventCopy, false);
            }

            let par = this;
            let root = this;
            while (par.__getParent && (par = par.__getParent()) !== null) {
                if (!_evCfg._children) {
                    _evCfg._children = [];
                }
                _evCfg._children.push(root);
                root = par;
            }
            root._defaultSync = this._defaultSync;
            _evCfg.eventPhase = phases.CAPTURING_PHASE;
            return root._dispatchEvent(eventCopy, false);
        case phases.CAPTURING_PHASE:
            if (_evCfg._stopPropagation) {
                return continueEventDispatch();
            }
            this.invokeCurrentListeners(this._listeners, eventCopy, type);
            const child = _evCfg._children && _evCfg._children.length && _evCfg._children.pop();
            if (!child || child === eventCopy.target) {
                _evCfg.eventPhase = phases.AT_TARGET;
            }
            if (child) child._defaultSync = this._defaultSync;
            return (child || this)._dispatchEvent(eventCopy, false);
        case phases.AT_TARGET:
            if (_evCfg._stopPropagation) {
                return continueEventDispatch();
            }
            this.invokeCurrentListeners(this._listeners, eventCopy, type, true);
            if (!_evCfg.bubbles) {
                return continueEventDispatch();
            }
            _evCfg.eventPhase = phases.BUBBLING_PHASE;
            return this._dispatchEvent(eventCopy, false);
        case phases.BUBBLING_PHASE:
            if (_evCfg._stopPropagation) {
                return continueEventDispatch();
            }
            const parent = this.__getParent && this.__getParent();
            if (!parent) {
                return continueEventDispatch();
            }
            parent.invokeCurrentListeners(parent._listeners, eventCopy, type, true);
            parent._defaultSync = this._defaultSync;
            return parent._dispatchEvent(eventCopy, false);
        }
    },
    invokeCurrentListeners (listeners, eventCopy, type, checkOnListeners) {
        const _evCfg = evCfg.get(eventCopy);
        _evCfg.currentTarget = this;

        const listOpts = getListenersOptions(listeners, type, {});
        const listenersByType = listOpts.listenersByType.concat();
        const dummyIPos = listenersByType.length ? 1 : 0;

        listenersByType.some((listenerObj, i) => {
            const onListener = checkOnListeners ? this['on' + type] : null;
            if (_evCfg._stopImmediatePropagation) return true;
            if (i === dummyIPos && typeof onListener === 'function') {
                // We don't splice this in as could be overwritten; executes here per
                //    https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-attributes:event-handlers-14
                this.tryCatch(eventCopy, () => {
                    const ret = onListener.call(eventCopy.currentTarget, eventCopy);
                    if (ret === false) {
                        eventCopy.preventDefault();
                    }
                });
            }
            const options = listenerObj.options;
            const {
                once, // Remove listener after invoking once
                passive, // Don't allow `preventDefault`
                capture // Use `_children` and set `eventPhase`
            } = options;

            _evCfg._passive = passive;

            if ((capture && eventCopy.target !== eventCopy.currentTarget && eventCopy.eventPhase === phases.CAPTURING_PHASE) ||
                (eventCopy.eventPhase === phases.AT_TARGET ||
                (!capture && eventCopy.target !== eventCopy.currentTarget && eventCopy.eventPhase === phases.BUBBLING_PHASE))
            ) {
                const listener = listenerObj.listener;
                this.tryCatch(eventCopy, () => {
                    listener.call(eventCopy.currentTarget, eventCopy);
                });
                if (once) {
                    this.removeEventListener(type, listener, options);
                }
            }
        });
        this.tryCatch(eventCopy, () => {
            const onListener = checkOnListeners ? this['on' + type] : null;
            if (typeof onListener === 'function' && listenersByType.length < 2) {
                const ret = onListener.call(eventCopy.currentTarget, eventCopy); // Won't have executed if too short
                if (ret === false) {
                    eventCopy.preventDefault();
                }
            }
        });

        return !eventCopy.defaultPrevented;
    },
    tryCatch (ev, cb) {
        try {
            // Per MDN: Exceptions thrown by event handlers are reported
            //    as uncaught exceptions; the event handlers run on a nested
            //    callstack: they block the caller until they complete, but
            //    exceptions do not propagate to the caller.
            cb();
        } catch (err) {
            this.triggerErrorEvent(err, ev);
        }
    },
    triggerErrorEvent (err, ev) {
        let error = err;
        if (typeof err === 'string') {
            error = new Error('Uncaught exception: ' + err);
        }

        let triggerGlobalErrorEvent;
        let useNodeImpl = false;
        if (typeof window === 'undefined' || typeof ErrorEvent === 'undefined' || (
            window && typeof window === 'object' && !window.dispatchEvent
        )) {
            useNodeImpl = true;
            triggerGlobalErrorEvent = () => {
                setTimeout(() => { // Node won't be able to catch in this way if we throw in the main thread
                    // console.log(err); // Should we auto-log for user?
                    throw error; // Let user listen to `process.on('uncaughtException', (err) => {});`
                });
            };
        } else {
            triggerGlobalErrorEvent = () => {
                // See https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
                //     and https://github.com/w3c/IndexedDB/issues/49

                // Note that a regular Event will properly trigger
                //     `window.addEventListener('error')` handlers, but it will not trigger
                //     `window.onerror` as per https://html.spec.whatwg.org/multipage/webappapis.html#handler-onerror
                // Note also that the following line won't handle `window.addEventListener` handlers
                //        if (window.onerror) window.onerror(error.message, err.fileName, err.lineNumber, error.columnNumber, error);

                // `ErrorEvent` properly triggers `window.onerror` and `window.addEventListener('error')` handlers
                const errEv = new ErrorEvent('error', {
                    error: err,
                    message: error.message || '',
                    // We can't get the actually useful user's values!
                    filename: error.fileName || '',
                    lineno: error.lineNumber || 0,
                    colno: error.columnNumber || 0
                });
                window.dispatchEvent(errEv);
                // console.log(err); // Should we auto-log for user?
            };
        }

        // Todo: This really should always run here but as we can't set the global
        //     `window` (e.g., using jsdom) since `setGlobalVars` becomes unable to
        //     shim `indexedDB` in such a case currently (apparently due to
        //     <https://github.com/axemclion/IndexedDBShim/issues/280>), we can't
        //     avoid the above Node implementation (which, while providing some
        //     fallback mechanism, is unstable)
        if (!useNodeImpl || !this._legacyOutputDidListenersThrowCheck) triggerGlobalErrorEvent();

        // See https://dom.spec.whatwg.org/#concept-event-listener-inner-invoke and
        //    https://github.com/w3c/IndexedDB/issues/140 (also https://github.com/w3c/IndexedDB/issues/49 )
        if (this._legacyOutputDidListenersThrowCheck) {
            ev.__legacyOutputDidListenersThrowError = error;
        }
    }
});
EventTarget.prototype[Symbol.toStringTag] = 'EventTargetPrototype';

Object.defineProperty(EventTarget, 'prototype', {
    writable: false
});

const ShimEventTarget = EventTarget;
const EventTargetFactory = {
    createInstance (customOptions) {
        function EventTarget () {
            this.__setOptions(customOptions);
        }
        EventTarget.prototype = ShimEventTarget.prototype;
        return new EventTarget();
    }
};

EventTarget.ShimEvent = ShimEvent;
EventTarget.ShimCustomEvent = ShimCustomEvent;
EventTarget.ShimDOMException = ShimDOMException;
EventTarget.ShimEventTarget = EventTarget;
EventTarget.EventTargetFactory = EventTargetFactory;

function setPrototypeOfCustomEvent () {
    // TODO: IDL needs but reported as slow!
    Object.setPrototypeOf(ShimCustomEvent, ShimEvent);
    Object.setPrototypeOf(ShimCustomEvent.prototype, ShimEvent.prototype);
}

const map = {};
const CFG = {};

[
    // Boolean for verbose reporting
    'DEBUG', // Effectively defaults to false (ignored unless `true`)

    'cacheDatabaseInstances', // Boolean (effectively defaults to true) on whether to cache WebSQL `openDatabase` instances

    // Boolean on whether to auto-name databases (based on an auto-increment) when
    //   the empty string is supplied; useful with `memoryDatabase`; defaults to `false`
    //   which means the empty string will be used as the (valid) database name
    'autoName',

    // Determines whether the slow-performing `Object.setPrototypeOf` calls required
    //    for full WebIDL compliance will be used. Probably only needed for testing
    //    or environments where full introspection on class relationships is required;
    //    see http://stackoverflow.com/questions/41927589/rationales-consequences-of-webidl-class-inheritance-requirements
    'fullIDLSupport', // Effectively defaults to false (ignored unless `true`)

    // Boolean on whether to perform origin checks in `IDBFactory` methods
    'checkOrigin', // Effectively defaults to `true` (must be set to `false` to cancel checks)

    // Used by `IDBCursor` continue methods for number of records to cache;
    'cursorPreloadPackSize', //  Defaults to 100

    // See optional API (`shimIndexedDB.__setUnicodeIdentifiers`);
    //    or just use the Unicode builds which invoke this method
    //    automatically using the large, fully spec-compliant, regular
    //    expression strings of `src/UnicodeIdentifiers.js`)
    'UnicodeIDStart', // In the non-Unicode builds, defaults to /[$A-Z_a-z]/
    'UnicodeIDContinue', // In the non-Unicode builds, defaults to /[$0-9A-Z_a-z]/

    // BROWSER-SPECIFIC CONFIG
    'avoidAutoShim', // Where WebSQL is detected but where `indexedDB` is
    //    missing or poor support is known (non-Chrome Android or
    //    non-Safari iOS9), the shim will be auto-applied without
    //   `shimIndexedDB.__useShim()`. Set this to `true` to avoid forcing
    //    the shim for such cases.

    // -----------SQL CONFIG----------
    // Object (`window` in the browser) on which there may be an
    //  `openDatabase` method (if any) for WebSQL. (The browser
    //  throws if attempting to call `openDatabase` without the window
    //  so this is why the config doesn't just allow the function.)
    // Defaults to `window` or `self` in browser builds or
    //  a singleton object with the `openDatabase` method set to
    //  the "websql" package in Node.
    'win',

    // For internal `openDatabase` calls made by `IDBFactory` methods;
    //  per the WebSQL spec, "User agents are expected to use the display name
    //  and the estimated database size to optimize the user experience.
    //  For example, a user agent could use the estimated size to suggest an
    //  initial quota to the user. This allows a site that is aware that it
    //  will try to use hundreds of megabytes to declare this upfront, instead
    //  of the user agent prompting the user for permission to increase the
    //  quota every five megabytes."
    'DEFAULT_DB_SIZE', // Defaults to (4 * 1024 * 1024) or (25 * 1024 * 1024) in Safari
    // Whether to create indexes on SQLite tables (and also whether to try dropping)
    'useSQLiteIndexes', // Effectively defaults to `false` (ignored unless `true`)

    // NODE-IMPINGING SETTINGS (created for sake of limitations in Node or desktop file
    //    system implementation but applied by default in browser for parity)

    // Used when setting global shims to determine whether to try to add
    //   other globals shimmed by the library (`ShimDOMException`, `ShimDOMStringList`,
    //   `ShimEvent`, `ShimCustomEvent`, `ShimEventTarget`)
    'addNonIDBGlobals', // Effectively defaults to `false` (ignored unless `true`)
    // Used when setting global shims to determine whether to try to overwrite
    //   other globals shimmed by the library (`DOMException`, `DOMStringList`,
    //   `Event`, `CustomEvent`, `EventTarget`)
    'replaceNonIDBGlobals', // Effectively defaults to `false` (ignored unless `true`)

    // Overcoming limitations with node-sqlite3/storing database name on file systems
    // https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words
    // Defaults to prefixing database with `D_`, escaping
    //   `databaseCharacterEscapeList`, escaping NUL, and
    //   escaping upper case letters, as well as enforcing
    //   `databaseNameLengthLimit`
    'escapeDatabaseName',
    'unescapeDatabaseName', // Not used internally; usable as a convenience method

    // Defaults to global regex representing the following
    //   (characters nevertheless commonly reserved in modern, Unicode-supporting
    //   systems): 0x00-0x1F 0x7F " * / : < > ? \ |
    'databaseCharacterEscapeList',
    'databaseNameLengthLimit', // Defaults to 254 (shortest typical modern file length limit)

    // Boolean defaulting to true on whether to escape NFD-escaping
    //   characters to avoid clashes on MacOS which performs NFD on files
    'escapeNFDForDatabaseNames',

    // Boolean on whether to add the `.sqlite` extension to file names;
    //   defaults to `true`
    'addSQLiteExtension',
    ['memoryDatabase', (val) => { // Various types of in-memory databases that can auto-delete
        if (!(/^(?::memory:|file::memory:(\?[^#]*)?(#.*)?)?$/).test(val)) {
            throw new TypeError('`memoryDatabase` must be the empty string, ":memory:", or a "file::memory:[?queryString][#hash] URL".');
        }
    }],

    // NODE-SPECIFIC CONFIG
    // Boolean on whether to delete the database file itself after `deleteDatabase`;
    //   defaults to `true` as the database will be empty
    'deleteDatabaseFiles',
    'databaseBasePath',
    'sysDatabaseBasePath',

    // NODE-SPECIFIC WEBSQL CONFIG
    'sqlBusyTimeout', // Defaults to 1000
    'sqlTrace', // Callback not used by default
    'sqlProfile' // Callback not used by default
].forEach((prop) => {
    let validator;
    if (Array.isArray(prop)) {
        validator = prop[1];
        prop = prop[0];
    }
    Object.defineProperty(CFG, prop, {
        get: function () {
            return map[prop];
        },
        set: function (val) {
            if (validator) {
                validator(val);
            }
            map[prop] = val;
        }
    });
});

var regex=/[\xC0-\xC5\xC7-\xCF\xD1-\xD6\xD9-\xDD\xE0-\xE5\xE7-\xEF\xF1-\xF6\xF9-\xFD\xFF-\u010F\u0112-\u0125\u0128-\u0130\u0134-\u0137\u0139-\u013E\u0143-\u0148\u014C-\u0151\u0154-\u0165\u0168-\u017E\u01A0\u01A1\u01AF\u01B0\u01CD-\u01DC\u01DE-\u01E3\u01E6-\u01F0\u01F4\u01F5\u01F8-\u021B\u021E\u021F\u0226-\u0233\u0344\u0385\u0386\u0388-\u038A\u038C\u038E-\u0390\u03AA-\u03B0\u03CA-\u03CE\u03D3\u03D4\u0400\u0401\u0403\u0407\u040C-\u040E\u0419\u0439\u0450\u0451\u0453\u0457\u045C-\u045E\u0476\u0477\u04C1\u04C2\u04D0-\u04D3\u04D6\u04D7\u04DA-\u04DF\u04E2-\u04E7\u04EA-\u04F5\u04F8\u04F9\u0622-\u0626\u06C0\u06C2\u06D3\u0929\u0931\u0934\u0958-\u095F\u09CB\u09CC\u09DC\u09DD\u09DF\u0A33\u0A36\u0A59-\u0A5B\u0A5E\u0B48\u0B4B\u0B4C\u0B5C\u0B5D\u0B94\u0BCA-\u0BCC\u0C48\u0CC0\u0CC7\u0CC8\u0CCA\u0CCB\u0D4A-\u0D4C\u0DDA\u0DDC-\u0DDE\u0F43\u0F4D\u0F52\u0F57\u0F5C\u0F69\u0F73\u0F75\u0F76\u0F78\u0F81\u0F93\u0F9D\u0FA2\u0FA7\u0FAC\u0FB9\u1026\u1B06\u1B08\u1B0A\u1B0C\u1B0E\u1B12\u1B3B\u1B3D\u1B40\u1B41\u1B43\u1E00-\u1E99\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FC1-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEE\u1FF2-\u1FF4\u1FF6-\u1FFC\u212B\u219A\u219B\u21AE\u21CD-\u21CF\u2204\u2209\u220C\u2224\u2226\u2241\u2244\u2247\u2249\u2260\u2262\u226D-\u2271\u2274\u2275\u2278\u2279\u2280\u2281\u2284\u2285\u2288\u2289\u22AC-\u22AF\u22E0-\u22E3\u22EA-\u22ED\u2ADC\u304C\u304E\u3050\u3052\u3054\u3056\u3058\u305A\u305C\u305E\u3060\u3062\u3065\u3067\u3069\u3070\u3071\u3073\u3074\u3076\u3077\u3079\u307A\u307C\u307D\u3094\u309E\u30AC\u30AE\u30B0\u30B2\u30B4\u30B6\u30B8\u30BA\u30BC\u30BE\u30C0\u30C2\u30C5\u30C7\u30C9\u30D0\u30D1\u30D3\u30D4\u30D6\u30D7\u30D9\u30DA\u30DC\u30DD\u30F4\u30F7-\u30FA\u30FE\uAC00-\uD7A3\uFB1D\uFB1F\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4E]|\uD804[\uDC9A\uDC9C\uDCAB\uDD2E\uDD2F\uDF4B\uDF4C]|\uD805[\uDCBB\uDCBC\uDCBE\uDDBA\uDDBB]|\uD834[\uDD5E-\uDD64\uDDBB-\uDDC0]/;

function escapeUnmatchedSurrogates (arg) {
    // http://stackoverflow.com/a/6701665/271577
    return arg.replace(/([\uD800-\uDBFF])(?![\uDC00-\uDFFF])|(^|[^\uD800-\uDBFF])([\uDC00-\uDFFF])/g, function (_, unmatchedHighSurrogate, precedingLow, unmatchedLowSurrogate) {
        // Could add a corresponding surrogate for compatibility with `node-sqlite3`: http://bugs.python.org/issue12569 and http://stackoverflow.com/a/6701665/271577
        //   but Chrome having problems
        if (unmatchedHighSurrogate) {
            return '^2' + padStart(unmatchedHighSurrogate.charCodeAt().toString(16), 4, '0');
        }
        return (precedingLow || '') + '^3' + padStart(unmatchedLowSurrogate.charCodeAt().toString(16), 4, '0');
    });
}

function escapeNameForSQLiteIdentifier (arg) {
    // http://stackoverflow.com/a/6701665/271577
    return '_' + // Prevent empty string
        escapeUnmatchedSurrogates(
            arg.replace(/\^/g, '^^') // Escape our escape
                // http://www.sqlite.org/src/tktview?name=57c971fc74
                .replace(/\0/g, '^0')
                // We need to avoid identifiers being treated as duplicates based on SQLite's ASCII-only case-insensitive table and column names
                // (For SQL in general, however, see http://stackoverflow.com/a/17215009/271577
                // See also https://www.sqlite.org/faq.html#q18 re: Unicode (non-ASCII) case-insensitive not working
                .replace(/([A-Z])/g, '^$1')
        );
}

// The escaping of unmatched surrogates was needed by Chrome but not Node
function escapeSQLiteStatement (arg) {
    return escapeUnmatchedSurrogates(arg.replace(/\^/g, '^^').replace(/\0/g, '^0'));
}
function unescapeSQLiteResponse (arg) {
    return unescapeUnmatchedSurrogates(arg).replace(/\^0/g, '\0').replace(/\^\^/g, '^');
}

function sqlEscape (arg) {
    // https://www.sqlite.org/lang_keywords.html
    // http://stackoverflow.com/a/6701665/271577
    // There is no need to escape ', `, or [], as
    //   we should always be within double quotes
    // NUL should have already been stripped
    return arg.replace(/"/g, '""');
}

function sqlQuote (arg) {
    return '"' + sqlEscape(arg) + '"';
}

function escapeDatabaseNameForSQLAndFiles (db) {
    if (CFG.escapeDatabaseName) {
        // We at least ensure NUL is escaped by default, but we need to still
        //   handle empty string and possibly also length (potentially
        //   throwing if too long), escaping casing (including Unicode?),
        //   and escaping special characters depending on file system
        return CFG.escapeDatabaseName(escapeSQLiteStatement(db));
    }
    db = 'D' + escapeNameForSQLiteIdentifier(db);
    if (CFG.escapeNFDForDatabaseNames !== false) {
        // ES6 copying of regex with different flags
        // Todo: Remove `.source` when
        //   https://github.com/babel/babel/issues/5978 completed (see also
        //   https://github.com/axemclion/IndexedDBShim/issues/311#issuecomment-316090147 )
        db = db.replace(new RegExp(regex.source, 'g'), function (expandable) {
            return '^4' + padStart(expandable.codePointAt().toString(16), 6, '0');
        });
    }
    if (CFG.databaseCharacterEscapeList !== false) {
        db = db.replace(
            (CFG.databaseCharacterEscapeList
                ? new RegExp(CFG.databaseCharacterEscapeList, 'g')
                : /[\u0000-\u001F\u007F"*/:<>?\\|]/g),
            function (n0) {
                return '^1' + padStart(n0.charCodeAt().toString(16), 2, '0');
            }
        );
    }
    if (CFG.databaseNameLengthLimit !== false &&
        db.length >= ((CFG.databaseNameLengthLimit || 254) - (CFG.addSQLiteExtension !== false ? 7 /* '.sqlite'.length */ : 0))) {
        throw new Error(
            'Unexpectedly long database name supplied; length limit required for Node compatibility; passed length: ' +
            db.length + '; length limit setting: ' + (CFG.databaseNameLengthLimit || 254) + '.');
    }
    return db + (CFG.addSQLiteExtension !== false ? '.sqlite' : ''); // Shouldn't have quoting (do we even need NUL/case escaping here?)
}

function unescapeUnmatchedSurrogates (arg) {
    return arg
        .replace(/(\^+)3(d[0-9a-f]{3})/g, (_, esc, lowSurr) => esc.length % 2 ? String.fromCharCode(parseInt(lowSurr, 16)) : _)
        .replace(/(\^+)2(d[0-9a-f]{3})/g, (_, esc, highSurr) => esc.length % 2 ? String.fromCharCode(parseInt(highSurr, 16)) : _);
}

function escapeStoreNameForSQL (store) {
    return sqlQuote('S' + escapeNameForSQLiteIdentifier(store));
}

function escapeIndexNameForSQL (index) {
    return sqlQuote('I' + escapeNameForSQLiteIdentifier(index));
}

function escapeIndexNameForSQLKeyColumn (index) {
    return 'I' + escapeNameForSQLiteIdentifier(index);
}

function sqlLIKEEscape (str) {
    // https://www.sqlite.org/lang_expr.html#like
    return sqlEscape(str).replace(/\^/g, '^^');
}

// Babel doesn't seem to provide a means of using the `instanceof` operator with Symbol.hasInstance (yet?)
function instanceOf (obj, Clss) {
    return Clss[Symbol.hasInstance](obj);
}

function isObj (obj) {
    return obj && typeof obj === 'object';
}

function isDate (obj) {
    return isObj(obj) && typeof obj.getDate === 'function';
}

function isBlob (obj) {
    return isObj(obj) && typeof obj.size === 'number' && typeof obj.slice === 'function' && !('lastModified' in obj);
}

function isFile (obj) {
    return isObj(obj) && typeof obj.name === 'string' && typeof obj.slice === 'function' && 'lastModified' in obj;
}

function isBinary (obj) {
    return isObj(obj) && typeof obj.byteLength === 'number' && (
        typeof obj.slice === 'function' || // `TypedArray` (view on buffer) or `ArrayBuffer`
        typeof obj.getFloat64 === 'function' // `DataView` (view on buffer)
    );
}

function isIterable (obj) {
    return isObj(obj) && typeof obj[Symbol.iterator] === 'function';
}

function defineReadonlyProperties (obj, props) {
    props = typeof props === 'string' ? [props] : props;
    props.forEach(function (prop) {
        Object.defineProperty(obj, '__' + prop, {
            enumerable: false,
            configurable: false,
            writable: true
        });
        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this['__' + prop];
            }
        });
    });
}

function isIdentifier (item) {
    // For load-time and run-time performance, we don't provide the complete regular
    //   expression for identifiers, but these can be passed in, using the expressions
    //   found at https://gist.github.com/brettz9/b4cd6821d990daa023b2e604de371407
    // ID_Start (includes Other_ID_Start)
    const UnicodeIDStart = CFG.UnicodeIDStart || '[$A-Z_a-z]';
    // ID_Continue (includes Other_ID_Continue)
    const UnicodeIDContinue = CFG.UnicodeIDContinue || '[$0-9A-Z_a-z]';
    const IdentifierStart = '(?:' + UnicodeIDStart + '|[$_])';
    const IdentifierPart = '(?:' + UnicodeIDContinue + '|[$_\u200C\u200D])';
    return (new RegExp('^' + IdentifierStart + IdentifierPart + '*$')).test(item);
}

function isValidKeyPathString (keyPathString) {
    return typeof keyPathString === 'string' &&
        (keyPathString === '' || isIdentifier(keyPathString) || keyPathString.split('.').every(isIdentifier));
}

function isValidKeyPath (keyPath) {
    return isValidKeyPathString(keyPath) || (
        Array.isArray(keyPath) && keyPath.length &&
            // Convert array from sparse to dense http://www.2ality.com/2012/06/dense-arrays.html
            Array.apply(null, keyPath).every(function (kpp) {
                // See also https://heycam.github.io/webidl/#idl-DOMString
                return isValidKeyPathString(kpp); // Should already be converted to string by here
            })
    );
}

function enforceRange (number, type) {
    number = Math.floor(Number(number));
    let max, min;
    switch (type) {
    case 'unsigned long long': {
        max = 0x1FFFFFFFFFFFFF; // 2^53 - 1
        min = 0;
        break;
    }
    case 'unsigned long': {
        max = 0xFFFFFFFF; // 2^32 - 1
        min = 0;
        break;
    }
    default:
        throw new Error('Unrecognized type supplied to enforceRange');
    }
    if (isNaN(number) || !isFinite(number) ||
        number > max ||
        number < min) {
        throw new TypeError('Invalid range: ' + number);
    }
    return number;
}

function convertToDOMString (v, treatNullAs) {
    return v === null && treatNullAs ? '' : ToString(v);
}

function ToString (o) { // Todo: See `es-abstract/es7`
    return '' + o; // `String()` will not throw with Symbols
}

function convertToSequenceDOMString (val) {
    // Per <https://heycam.github.io/webidl/#idl-sequence>, converting to a sequence works with iterables
    if (isIterable(val)) { // We don't want conversion to array to convert primitives
        // Per <https://heycam.github.io/webidl/#es-DOMString>, converting to a `DOMString` to be via `ToString`: https://tc39.github.io/ecma262/#sec-tostring
        return [...val].map(ToString);
    }
    return ToString(val);
}

// Todo: Replace with `String.prototype.padStart` when targeting supporting Node version
function padStart (str, ct, fill) {
    return new Array(ct - (String(str)).length + 1).join(fill) + str;
}

function createEvent (type, debug, evInit) {
    const ev = new ShimEvent(type, evInit);
    ev.debug = debug;
    return ev;
}

// We don't add within polyfill repo as might not always be the desired implementation
Object.defineProperty(ShimEvent, Symbol.hasInstance, {
    value: obj => isObj(obj) && 'target' in obj && typeof obj.bubbles === 'boolean'
});

const readonlyProperties = ['oldVersion', 'newVersion'];

// Babel apparently having a problem adding `hasInstance` to a class, so we are redefining as a function
function IDBVersionChangeEvent (type /* , eventInitDict */) { // eventInitDict is a IDBVersionChangeEventInit (but is not defined as a global)
    ShimEvent.call(this, type);
    this[Symbol.toStringTag] = 'IDBVersionChangeEvent';
    this.toString = function () {
        return '[object IDBVersionChangeEvent]';
    };
    this.__eventInitDict = arguments[1] || {};
}

IDBVersionChangeEvent.prototype = Object.create(ShimEvent.prototype);

IDBVersionChangeEvent.prototype[Symbol.toStringTag] = 'IDBVersionChangeEventPrototype';

readonlyProperties.forEach((prop) => {
    Object.defineProperty(IDBVersionChangeEvent.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (!(this instanceof IDBVersionChangeEvent)) {
                throw new TypeError('Illegal invocation');
            }
            return (this.__eventInitDict && this.__eventInitDict[prop]) || (prop === 'oldVersion' ? 0 : null);
        }
    });
});

Object.defineProperty(IDBVersionChangeEvent, Symbol.hasInstance, {
    value: obj => isObj(obj) && 'oldVersion' in obj && typeof obj.defaultPrevented === 'boolean'
});

Object.defineProperty(IDBVersionChangeEvent.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBVersionChangeEvent
});

Object.defineProperty(IDBVersionChangeEvent, 'prototype', {
    writable: false
});

/* globals DOMException */

/**
 * Creates a native DOMException, for browsers that support it
 * @returns {DOMException}
 */
function createNativeDOMException (name, message) {
    return new DOMException.prototype.constructor(message, name || 'DOMException');
}

const codes = { // From web-platform-tests testharness.js name_code_map (though not in new spec)
    IndexSizeError: 1,
    HierarchyRequestError: 3,
    WrongDocumentError: 4,
    InvalidCharacterError: 5,
    NoModificationAllowedError: 7,
    NotFoundError: 8,
    NotSupportedError: 9,
    InUseAttributeError: 10,
    InvalidStateError: 11,
    SyntaxError: 12,
    InvalidModificationError: 13,
    NamespaceError: 14,
    InvalidAccessError: 15,
    TypeMismatchError: 17,
    SecurityError: 18,
    NetworkError: 19,
    AbortError: 20,
    URLMismatchError: 21,
    QuotaExceededError: 22,
    TimeoutError: 23,
    InvalidNodeTypeError: 24,
    DataCloneError: 25,

    EncodingError: 0,
    NotReadableError: 0,
    UnknownError: 0,
    ConstraintError: 0,
    DataError: 0,
    TransactionInactiveError: 0,
    ReadOnlyError: 0,
    VersionError: 0,
    OperationError: 0,
    NotAllowedError: 0
};

const legacyCodes = {
    INDEX_SIZE_ERR: 1,
    DOMSTRING_SIZE_ERR: 2,
    HIERARCHY_REQUEST_ERR: 3,
    WRONG_DOCUMENT_ERR: 4,
    INVALID_CHARACTER_ERR: 5,
    NO_DATA_ALLOWED_ERR: 6,
    NO_MODIFICATION_ALLOWED_ERR: 7,
    NOT_FOUND_ERR: 8,
    NOT_SUPPORTED_ERR: 9,
    INUSE_ATTRIBUTE_ERR: 10,
    INVALID_STATE_ERR: 11,
    SYNTAX_ERR: 12,
    INVALID_MODIFICATION_ERR: 13,
    NAMESPACE_ERR: 14,
    INVALID_ACCESS_ERR: 15,
    VALIDATION_ERR: 16,
    TYPE_MISMATCH_ERR: 17,
    SECURITY_ERR: 18,
    NETWORK_ERR: 19,
    ABORT_ERR: 20,
    URL_MISMATCH_ERR: 21,
    QUOTA_EXCEEDED_ERR: 22,
    TIMEOUT_ERR: 23,
    INVALID_NODE_TYPE_ERR: 24,
    DATA_CLONE_ERR: 25
};

function createNonNativeDOMExceptionClass () {
    function DOMException (message, name) {
        // const err = Error.prototype.constructor.call(this, message); // Any use to this? Won't set this.message
        this[Symbol.toStringTag] = 'DOMException';
        this._code = name in codes ? codes[name] : (legacyCodes[name] || 0);
        this._name = name || 'Error';
        this._message = message === undefined ? '' : ('' + message); // Not String() which converts Symbols
        Object.defineProperty(this, 'code', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: this._code
        });
        if (name !== undefined) {
            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: this._name
            });
        }
        if (message !== undefined) {
            Object.defineProperty(this, 'message', {
                configurable: true,
                enumerable: false,
                writable: true,
                value: this._message
            });
        }
    }

    // Necessary for W3C tests which complains if `DOMException` has properties on its "own" prototype

    // class DummyDOMException extends Error {}; // Sometimes causing problems in Node
    const DummyDOMException = function DOMException () {};
    DummyDOMException.prototype = Object.create(Error.prototype); // Intended for subclassing
    ['name', 'message'].forEach((prop) => {
        Object.defineProperty(DummyDOMException.prototype, prop, {
            enumerable: true,
            get: function () {
                if (!(this instanceof DOMException ||
                    this instanceof DummyDOMException ||
                    this instanceof Error)) {
                    throw new TypeError('Illegal invocation');
                }
                return this['_' + prop];
            }
        });
    });
    // DOMException uses the same `toString` as `Error`
    Object.defineProperty(DummyDOMException.prototype, 'code', {
        configurable: true,
        enumerable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
    DOMException.prototype = new DummyDOMException();

    DOMException.prototype[Symbol.toStringTag] = 'DOMExceptionPrototype';
    Object.defineProperty(DOMException, 'prototype', {
        writable: false
    });

    Object.keys(codes).forEach((codeName) => {
        Object.defineProperty(DOMException.prototype, codeName, {
            enumerable: true,
            configurable: false,
            value: codes[codeName]
        });
        Object.defineProperty(DOMException, codeName, {
            enumerable: true,
            configurable: false,
            value: codes[codeName]
        });
    });
    Object.keys(legacyCodes).forEach((codeName) => {
        Object.defineProperty(DOMException.prototype, codeName, {
            enumerable: true,
            configurable: false,
            value: legacyCodes[codeName]
        });
        Object.defineProperty(DOMException, codeName, {
            enumerable: true,
            configurable: false,
            value: legacyCodes[codeName]
        });
    });
    Object.defineProperty(DOMException.prototype, 'constructor', {
        writable: true,
        configurable: true,
        enumerable: false,
        value: DOMException
    });

    return DOMException;
}

const ShimNonNativeDOMException = createNonNativeDOMExceptionClass();

/**
 * Creates a generic Error object
 * @returns {Error}
 */
function createNonNativeDOMException (name, message) {
    return new ShimNonNativeDOMException(message, name);
}

/**
 * Logs detailed error information to the console.
 * @param {string} name
 * @param {string} message
 * @param {string|Error|null} error
 */
function logError (name, message, error) {
    if (CFG.DEBUG) {
        if (error && error.message) {
            error = error.message;
        }

        const method = typeof (console.error) === 'function' ? 'error' : 'log';
        console[method](name + ': ' + message + '. ' + (error || ''));
        console.trace && console.trace();
    }
}

function isErrorOrDOMErrorOrDOMException (obj) {
    return obj && typeof obj === 'object' && // We don't use util.isObj here as mutual dependency causing problems in Babel with browser
        typeof obj.name === 'string';
}

/**
 * Finds the error argument.  This is useful because some WebSQL callbacks
 * pass the error as the first argument, and some pass it as the second argument.
 * @param {array} args
 * @returns {Error|DOMException|undefined}
 */
function findError (args) {
    let err;
    if (args) {
        if (args.length === 1) {
            return args[0];
        }
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (isErrorOrDOMErrorOrDOMException(arg)) {
                return arg;
            }
            if (arg && typeof arg.message === 'string') {
                err = arg;
            }
        }
    }
    return err;
}

function webSQLErrback (webSQLErr) {
    let name, message;
    switch (webSQLErr.code) {
    case 4: { // SQLError.QUOTA_ERR
        name = 'QuotaExceededError';
        message = 'The operation failed because there was not enough remaining storage space, or the storage quota was reached and the user declined to give more space to the database.';
        break;
    }
    /*
    // Should a WebSQL timeout treat as IndexedDB `TransactionInactiveError` or `UnknownError`?
    case 7: { // SQLError.TIMEOUT_ERR
        // All transaction errors abort later, so no need to mark inactive
        name = 'TransactionInactiveError';
        message = 'A request was placed against a transaction which is currently not active, or which is finished (Internal SQL Timeout).';
        break;
    }
    */
    default: {
        name = 'UnknownError';
        message = 'The operation failed for reasons unrelated to the database itself and not covered by any other errors.';
        break;
    }
    }
    message += ' (' + webSQLErr.message + ')--(' + webSQLErr.code + ')';
    const err = createDOMException(name, message);
    err.sqlError = webSQLErr;
    return err;
}

let test, useNativeDOMException = false;

// Test whether we can use the browser's native DOMException class
try {
    test = createNativeDOMException('test name', 'test message');
    if (isErrorOrDOMErrorOrDOMException(test) && test.name === 'test name' && test.message === 'test message') {
        // Native DOMException works as expected
        useNativeDOMException = true;
    }
} catch (e) {}

let createDOMException, ShimDOMException$1;
if (useNativeDOMException) {
    ShimDOMException$1 = DOMException;
    createDOMException = function (name, message, error) {
        logError(name, message, error);
        return createNativeDOMException(name, message);
    };
} else {
    ShimDOMException$1 = ShimNonNativeDOMException;
    createDOMException = function (name, message, error) {
        logError(name, message, error);
        return createNonNativeDOMException(name, message);
    };
}

const listeners = ['onsuccess', 'onerror'];
const readonlyProperties$1 = ['source', 'transaction', 'readyState'];
const doneFlagGetters = ['result', 'error'];

/**
 * The IDBRequest Object that is returns for all async calls
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#request-api
 */
function IDBRequest () {
    throw new TypeError('Illegal constructor');
}
IDBRequest.__super = function IDBRequest () {
    this[Symbol.toStringTag] = 'IDBRequest';
    this.__setOptions({
        legacyOutputDidListenersThrowFlag: true // Event hook for IndexedB
    });
    doneFlagGetters.forEach(function (prop) {
        Object.defineProperty(this, '__' + prop, {
            enumerable: false,
            configurable: false,
            writable: true
        });
        Object.defineProperty(this, prop, {
            enumerable: true,
            configurable: true,
            get: function () {
                if (this.__readyState !== 'done') {
                    throw createDOMException('InvalidStateError', "Can't get " + prop + '; the request is still pending.');
                }
                return this['__' + prop];
            }
        });
    }, this);
    defineReadonlyProperties(this, readonlyProperties$1);
    listeners.forEach((listener) => {
        Object.defineProperty(this, listener, {
            configurable: true, // Needed by support.js in W3C IndexedDB tests
            get: function () {
                return this['__' + listener];
            },
            set: function (val) {
                this['__' + listener] = val;
            }
        });
    }, this);
    listeners.forEach((l) => {
        this[l] = null;
    });
    this.__result = undefined;
    this.__error = this.__source = this.__transaction = null;
    this.__readyState = 'pending';
};

IDBRequest.__createInstance = function () {
    return new IDBRequest.__super();
};

IDBRequest.prototype = EventTargetFactory.createInstance({extraProperties: ['debug']});
IDBRequest.prototype[Symbol.toStringTag] = 'IDBRequestPrototype';

IDBRequest.prototype.__getParent = function () {
    if (this.toString() === '[object IDBOpenDBRequest]') {
        return null;
    }
    return this.__transaction;
};

// Illegal invocations
readonlyProperties$1.forEach((prop) => {
    Object.defineProperty(IDBRequest.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});

doneFlagGetters.forEach(function (prop) {
    Object.defineProperty(IDBRequest.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});

listeners.forEach((listener) => {
    Object.defineProperty(IDBRequest.prototype, listener, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        },
        set: function (val) {
            throw new TypeError('Illegal invocation');
        }
    });
});

Object.defineProperty(IDBRequest.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBRequest
});
IDBRequest.__super.prototype = IDBRequest.prototype;

Object.defineProperty(IDBRequest, 'prototype', {
    writable: false
});

const openListeners = ['onblocked', 'onupgradeneeded'];

/**
 * The IDBOpenDBRequest called when a database is opened
 */
function IDBOpenDBRequest () {
    throw new TypeError('Illegal constructor');
}
IDBOpenDBRequest.prototype = Object.create(IDBRequest.prototype);

Object.defineProperty(IDBOpenDBRequest.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBOpenDBRequest
});

const IDBOpenDBRequestAlias = IDBOpenDBRequest;
IDBOpenDBRequest.__createInstance = function () {
    function IDBOpenDBRequest () {
        IDBRequest.__super.call(this);

        this[Symbol.toStringTag] = 'IDBOpenDBRequest';
        this.__setOptions({
            legacyOutputDidListenersThrowFlag: true, // Event hook for IndexedB
            extraProperties: ['oldVersion', 'newVersion', 'debug']
        }); // Ensure EventTarget preserves our properties
        openListeners.forEach((listener) => {
            Object.defineProperty(this, listener, {
                configurable: true, // Needed by support.js in W3C IndexedDB tests
                get: function () {
                    return this['__' + listener];
                },
                set: function (val) {
                    this['__' + listener] = val;
                }
            });
        }, this);
        openListeners.forEach((l) => {
            this[l] = null;
        });
    }
    IDBOpenDBRequest.prototype = IDBOpenDBRequestAlias.prototype;
    return new IDBOpenDBRequest();
};

openListeners.forEach((listener) => {
    Object.defineProperty(IDBOpenDBRequest.prototype, listener, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        },
        set: function (val) {
            throw new TypeError('Illegal invocation');
        }
    });
});

IDBOpenDBRequest.prototype[Symbol.toStringTag] = 'IDBOpenDBRequestPrototype';

Object.defineProperty(IDBOpenDBRequest, 'prototype', {
    writable: false
});

/**
 * Compares two keys
 * @param key1
 * @param key2
 * @returns {number}
 */
function cmp (first, second) {
    const encodedKey1 = encode(first);
    const encodedKey2 = encode(second);
    const result = encodedKey1 > encodedKey2 ? 1 : encodedKey1 === encodedKey2 ? 0 : -1;

    if (CFG.DEBUG) {
        // verify that the keys encoded correctly
        let decodedKey1 = decode(encodedKey1);
        let decodedKey2 = decode(encodedKey2);
        if (typeof first === 'object') {
            first = JSON.stringify(first);
            decodedKey1 = JSON.stringify(decodedKey1);
        }
        if (typeof second === 'object') {
            second = JSON.stringify(second);
            decodedKey2 = JSON.stringify(decodedKey2);
        }

        // encoding/decoding mismatches are usually due to a loss of floating-point precision
        if (decodedKey1 !== first) {
            console.warn(first + ' was incorrectly encoded as ' + decodedKey1);
        }
        if (decodedKey2 !== second) {
            console.warn(second + ' was incorrectly encoded as ' + decodedKey2);
        }
    }

    return result;
}

/**
 * Encodes the keys based on their types. This is required to maintain collations
 * We leave space for future keys
 */
const keyTypeToEncodedChar = {
    invalid: 100,
    number: 200,
    date: 300,
    string: 400,
    binary: 500,
    array: 600
};
const keyTypes = Object.keys(keyTypeToEncodedChar);
keyTypes.forEach((k) => {
    keyTypeToEncodedChar[k] = String.fromCharCode(keyTypeToEncodedChar[k]);
});

const encodedCharToKeyType = keyTypes.reduce((o, k) => {
    o[keyTypeToEncodedChar[k]] = k;
    return o;
}, {});

/**
 * The sign values for numbers, ordered from least to greatest.
 *  - "negativeInfinity": Sorts below all other values.
 *  - "bigNegative": Negative values less than or equal to negative one.
 *  - "smallNegative": Negative values between negative one and zero, noninclusive.
 *  - "smallPositive": Positive values between zero and one, including zero but not one.
 *  - "largePositive": Positive values greater than or equal to one.
 *  - "positiveInfinity": Sorts above all other values.
 */
const signValues = ['negativeInfinity', 'bigNegative', 'smallNegative', 'smallPositive', 'bigPositive', 'positiveInfinity'];

const types = {
    invalid: {
        encode: function (key) {
            return keyTypeToEncodedChar.invalid + '-';
        },
        decode: function (key) {
            return undefined;
        }
    },

    // Numbers are represented in a lexically sortable base-32 sign-exponent-mantissa
    // notation.
    //
    // sign: takes a value between zero and five, inclusive. Represents infinite cases
    //     and the signs of both the exponent and the fractional part of the number.
    // exponent: padded to two base-32 digits, represented by the 32's compliment in the
    //     "smallPositive" and "bigNegative" cases to ensure proper lexical sorting.
    // mantissa: also called the fractional part. Normed 11-digit base-32 representation.
    //     Represented by the 32's compliment in the "smallNegative" and "bigNegative"
    //     cases to ensure proper lexical sorting.
    number: {
        // The encode step checks for six numeric cases and generates 14-digit encoded
        // sign-exponent-mantissa strings.
        encode: function (key) {
            let key32 = key === Number.MIN_VALUE
                // Mocha test `IDBFactory/cmp-spec.js` exposed problem for some
                //   Node (and Chrome) versions with `Number.MIN_VALUE` being treated
                //   as 0
                // https://stackoverflow.com/questions/43305403/number-min-value-and-tostring
                ? '0.' + '0'.repeat(214) + '2'
                : Math.abs(key).toString(32);
            // Get the index of the decimal.
            const decimalIndex = key32.indexOf('.');
            // Remove the decimal.
            key32 = (decimalIndex !== -1) ? key32.replace('.', '') : key32;
            // Get the index of the first significant digit.
            const significantDigitIndex = key32.search(/[^0]/);
            // Truncate leading zeros.
            key32 = key32.slice(significantDigitIndex);
            let sign, exponent, mantissa;

            // Finite cases:
            if (isFinite(key)) {
                // Negative cases:
                if (key < 0) {
                    // Negative exponent case:
                    if (key > -1) {
                        sign = signValues.indexOf('smallNegative');
                        exponent = padBase32Exponent(significantDigitIndex);
                        mantissa = flipBase32(padBase32Mantissa(key32));
                    // Non-negative exponent case:
                    } else {
                        sign = signValues.indexOf('bigNegative');
                        exponent = flipBase32(padBase32Exponent(
                            (decimalIndex !== -1) ? decimalIndex : key32.length
                        ));
                        mantissa = flipBase32(padBase32Mantissa(key32));
                    }
                // Non-negative cases:
                } else {
                    // Negative exponent case:
                    if (key < 1) {
                        sign = signValues.indexOf('smallPositive');
                        exponent = flipBase32(padBase32Exponent(significantDigitIndex));
                        mantissa = padBase32Mantissa(key32);
                    // Non-negative exponent case:
                    } else {
                        sign = signValues.indexOf('bigPositive');
                        exponent = padBase32Exponent(
                            (decimalIndex !== -1) ? decimalIndex : key32.length
                        );
                        mantissa = padBase32Mantissa(key32);
                    }
                }
            // Infinite cases:
            } else {
                exponent = zeros(2);
                mantissa = zeros(11);
                sign = signValues.indexOf(
                    key > 0 ? 'positiveInfinity' : 'negativeInfinity'
                );
            }

            return keyTypeToEncodedChar.number + '-' + sign + exponent + mantissa;
        },
        // The decode step must interpret the sign, reflip values encoded as the 32's complements,
        // apply signs to the exponent and mantissa, do the base-32 power operation, and return
        // the original JavaScript number values.
        decode: function (key) {
            const sign = +key.substr(2, 1);
            let exponent = key.substr(3, 2);
            let mantissa = key.substr(5, 11);

            switch (signValues[sign]) {
            case 'negativeInfinity':
                return -Infinity;
            case 'positiveInfinity':
                return Infinity;
            case 'bigPositive':
                return pow32(mantissa, exponent);
            case 'smallPositive':
                exponent = negate(flipBase32(exponent));
                return pow32(mantissa, exponent);
            case 'smallNegative':
                exponent = negate(exponent);
                mantissa = flipBase32(mantissa);
                return -pow32(mantissa, exponent);
            case 'bigNegative':
                exponent = flipBase32(exponent);
                mantissa = flipBase32(mantissa);
                return -pow32(mantissa, exponent);
            default:
                throw new Error('Invalid number.');
            }
        }
    },

    // Strings are encoded as JSON strings (with quotes and unicode characters escaped).
    //
    // If the strings are in an array, then some extra encoding is done to make sorting work correctly:
    // Since we can't force all strings to be the same length, we need to ensure that characters line-up properly
    // for sorting, while also accounting for the extra characters that are added when the array itself is encoded as JSON.
    // To do this, each character of the string is prepended with a dash ("-"), and a space is added to the end of the string.
    // This effectively doubles the size of every string, but it ensures that when two arrays of strings are compared,
    // the indexes of each string's characters line up with each other.
    string: {
        encode: function (key, inArray) {
            if (inArray) {
                // prepend each character with a dash, and append a space to the end
                key = key.replace(/(.)/g, '-$1') + ' ';
            }
            return keyTypeToEncodedChar.string + '-' + key;
        },
        decode: function (key, inArray) {
            key = key.slice(2);
            if (inArray) {
                // remove the space at the end, and the dash before each character
                key = key.substr(0, key.length - 1).replace(/-(.)/g, '$1');
            }
            return key;
        }
    },

    // Arrays are encoded as JSON strings.
    // An extra, value is added to each array during encoding to make empty arrays sort correctly.
    array: {
        encode: function (key) {
            const encoded = [];
            for (let i = 0; i < key.length; i++) {
                const item = key[i];
                const encodedItem = encode(item, true);        // encode the array item
                encoded[i] = encodedItem;
            }
            encoded.push(keyTypeToEncodedChar.invalid + '-');            // append an extra item, so empty arrays sort correctly
            return keyTypeToEncodedChar.array + '-' + JSON.stringify(encoded);
        },
        decode: function (key) {
            const decoded = JSON.parse(key.slice(2));
            decoded.pop();                                                  // remove the extra item
            for (let i = 0; i < decoded.length; i++) {
                const item = decoded[i];
                const decodedItem = decode(item, true);        // decode the item
                decoded[i] = decodedItem;
            }
            return decoded;
        }
    },

    // Dates are encoded as ISO 8601 strings, in UTC time zone.
    date: {
        encode: function (key) {
            return keyTypeToEncodedChar.date + '-' + key.toJSON();
        },
        decode: function (key) {
            return new Date(key.slice(2));
        }
    },
    binary: { // `ArrayBuffer`/Views on buffers (`TypedArray` or `DataView`)
        encode: function (key) {
            return keyTypeToEncodedChar.binary + '-' + (key.byteLength
                ? [...getCopyBytesHeldByBufferSource(key)].map((b) => padStart(b, 3, '0')) // e.g., '255,005,254,000,001,033'
                : '');
        },
        decode: function (key) {
            // Set the entries in buffer's [[ArrayBufferData]] to those in `value`
            const k = key.slice(2);
            const arr = k.length ? k.split(',').map((s) => parseInt(s, 10)) : [];
            const buffer = new ArrayBuffer(arr.length);
            const uint8 = new Uint8Array(buffer);
            uint8.set(arr);
            return buffer;
        }
    }
};

/**
 * Return a padded base-32 exponent value.
 * @param {number}
 * @return {string}
 */
function padBase32Exponent (n) {
    n = n.toString(32);
    return (n.length === 1) ? '0' + n : n;
}

/**
 * Return a padded base-32 mantissa.
 * @param {string}
 * @return {string}
 */
function padBase32Mantissa (s) {
    return (s + zeros(11)).slice(0, 11);
}

/**
 * Flips each digit of a base-32 encoded string.
 * @param {string} encoded
 */
function flipBase32 (encoded) {
    let flipped = '';
    for (let i = 0; i < encoded.length; i++) {
        flipped += (31 - parseInt(encoded[i], 32)).toString(32);
    }
    return flipped;
}

/**
 * Base-32 power function.
 * RESEARCH: This function does not precisely decode floats because it performs
 * floating point arithmetic to recover values. But can the original values be
 * recovered exactly?
 * Someone may have already figured out a good way to store JavaScript floats as
 * binary strings and convert back. Barring a better method, however, one route
 * may be to generate decimal strings that `parseFloat` decodes predictably.
 * @param {string}
 * @param {string}
 * @return {number}
 */
function pow32 (mantissa, exponent) {
    exponent = parseInt(exponent, 32);
    if (exponent < 0) {
        return roundToPrecision(
            parseInt(mantissa, 32) * Math.pow(32, exponent - 10)
        );
    } else {
        if (exponent < 11) {
            let whole = mantissa.slice(0, exponent);
            whole = parseInt(whole, 32);
            let fraction = mantissa.slice(exponent);
            fraction = parseInt(fraction, 32) * Math.pow(32, exponent - 11);
            return roundToPrecision(whole + fraction);
        } else {
            const expansion = mantissa + zeros(exponent - 11);
            return parseInt(expansion, 32);
        }
    }
}

/**
 *
 */
function roundToPrecision (num, precision) {
    precision = precision || 16;
    return parseFloat(num.toPrecision(precision));
}

/**
 * Returns a string of n zeros.
 * @param {number}
 * @return {string}
 */
function zeros (n) {
    return '0'.repeat(n);
}

/**
 * Negates numeric strings.
 * @param {string}
 * @return {string}
 */
function negate (s) {
    return '-' + s;
}

/**
 * Returns the string "number", "date", "string", "binary", or "array"
 */
function getKeyType (key) {
    if (Array.isArray(key)) return 'array';
    if (isDate(key)) return 'date';
    if (isBinary(key)) return 'binary';
    const keyType = typeof key;
    return ['string', 'number'].includes(keyType) ? keyType : 'invalid';
}

/**
 * Keys must be strings, numbers (besides NaN), Dates (if value is not NaN),
 *   binary objects or Arrays
 * @param input The key input
 * @param seen An array of already seen keys
 */
function convertValueToKey (input, seen) {
    return convertValueToKeyValueDecoded(input, seen, false, true);
}

/**
* Currently not in use
*/
function convertValueToMultiEntryKey (input) {
    return convertValueToKeyValueDecoded(input, null, true, true);
}

// https://heycam.github.io/webidl/#ref-for-dfn-get-buffer-source-copy-2
function getCopyBytesHeldByBufferSource (O) {
    let offset = 0;
    let length = 0;
    if (ArrayBuffer.isView(O)) { // Has [[ViewedArrayBuffer]] internal slot
        const arrayBuffer = O.buffer;
        if (arrayBuffer === undefined) {
            throw new TypeError('Could not copy the bytes held by a buffer source as the buffer was undefined.');
        }
        offset = O.byteOffset; // [[ByteOffset]] (will also throw as desired if detached)
        length = O.byteLength; // [[ByteLength]] (will also throw as desired if detached)
    } else {
        length = O.byteLength; // [[ArrayBufferByteLength]] on ArrayBuffer (will also throw as desired if detached)
    }
    // const octets = new Uint8Array(input);
    // const octets = types.binary.decode(types.binary.encode(input));
    return new Uint8Array(O.buffer || O, offset, length);
}

/**
* Shortcut utility to avoid returning full keys from `convertValueToKey`
*   and subsequent need to process in calling code unless `fullKeys` is
*   set; may throw
*/
function convertValueToKeyValueDecoded (input, seen, multiEntry, fullKeys) {
    seen = seen || [];
    if (seen.includes(input)) return {type: 'array', invalid: true, message: 'An array key cannot be circular'};
    const type = getKeyType(input);
    const ret = {type, value: input};
    switch (type) {
    case 'number': {
        if (Number.isNaN(input)) {
            return {type: 'NaN', invalid: true}; // List as 'NaN' type for convenience of consumers in reporting errors
        }
        return ret;
    } case 'string': {
        return ret;
    } case 'binary': { // May throw (if detached)
        // Get a copy of the bytes held by the buffer source
        // https://heycam.github.io/webidl/#ref-for-dfn-get-buffer-source-copy-2
        const octets = getCopyBytesHeldByBufferSource(input);
        return {type: 'binary', value: octets};
    } case 'array': { // May throw (from binary)
        const len = input.length;
        seen.push(input);
        const keys = [];
        for (let i = 0; i < len; i++) { // We cannot iterate here with array extras as we must ensure sparse arrays are invalidated
            if (!multiEntry && !Object.prototype.hasOwnProperty.call(input, i)) {
                return {type, invalid: true, message: 'Does not have own index property'};
            }
            try {
                const entry = input[i];
                const key = convertValueToKeyValueDecoded(entry, seen, false, fullKeys); // Though steps do not list rethrowing, the next is returnifabrupt when not multiEntry
                if (key.invalid) {
                    if (multiEntry) {
                        continue;
                    }
                    return {type, invalid: true, message: 'Bad array entry value-to-key conversion'};
                }
                if (!multiEntry ||
                    (!fullKeys && keys.every((k) => cmp(k, key.value) !== 0)) ||
                    (fullKeys && keys.every((k) => cmp(k, key) !== 0))
                ) {
                    keys.push(fullKeys ? key : key.value);
                }
            } catch (err) {
                if (!multiEntry) {
                    throw err;
                }
            }
        }
        return {type, value: keys};
    } case 'date': {
        if (!Number.isNaN(input.getTime())) {
            return fullKeys ? {type, value: input.getTime()} : {type, value: new Date(input.getTime())};
        }
        return {type, invalid: true, message: 'Not a valid date'};
        // Falls through
    } case 'invalid': default: {
        // Other `typeof` types which are not valid keys:
        //    'undefined', 'boolean', 'object' (including `null`), 'symbol', 'function
        const type = input === null ? 'null' : typeof input; // Convert `null` for convenience of consumers in reporting errors
        return {type, invalid: true, message: 'Not a valid key; type ' + type};
    }
    }
}
function convertValueToMultiEntryKeyDecoded (key, fullKeys) {
    return convertValueToKeyValueDecoded(key, null, true, fullKeys);
}

/**
* An internal utility
*/
function convertValueToKeyRethrowingAndIfInvalid (input, seen) {
    const key = convertValueToKey(input, seen);
    if (key.invalid) {
        throw createDOMException('DataError', key.message || 'Not a valid key; type: ' + key.type);
    }
    return key;
}

function extractKeyFromValueUsingKeyPath (value, keyPath, multiEntry) {
    return extractKeyValueDecodedFromValueUsingKeyPath(value, keyPath, multiEntry, true);
}
/**
* Not currently in use
*/
function evaluateKeyPathOnValue (value, keyPath, multiEntry) {
    return evaluateKeyPathOnValueToDecodedValue(value, keyPath, multiEntry, true);
}

/**
* May throw, return `{failure: true}` (e.g., non-object on keyPath resolution)
*    or `{invalid: true}` (e.g., `NaN`)
*/
function extractKeyValueDecodedFromValueUsingKeyPath (value, keyPath, multiEntry, fullKeys) {
    const r = evaluateKeyPathOnValueToDecodedValue(value, keyPath, multiEntry, fullKeys);
    if (r.failure) {
        return r;
    }
    if (!multiEntry) {
        return convertValueToKeyValueDecoded(r.value, null, false, fullKeys);
    }
    return convertValueToMultiEntryKeyDecoded(r.value, fullKeys);
}

/**
 * Returns the value of an inline key based on a key path (wrapped in an object with key `value`)
 *   or `{failure: true}`
 * @param {object} value
 * @param {string|array} keyPath
 * @param {boolean} multiEntry
 * @returns {undefined|array|string}
 */
function evaluateKeyPathOnValueToDecodedValue (value, keyPath, multiEntry, fullKeys) {
    if (Array.isArray(keyPath)) {
        const result = [];
        return keyPath.some((item) => {
            const key = evaluateKeyPathOnValueToDecodedValue(value, item, multiEntry, fullKeys);
            if (key.failure) {
                return true;
            }
            result.push(key.value);
        }, []) ? {failure: true} : {value: result};
    }
    if (keyPath === '') {
        return {value};
    }
    const identifiers = keyPath.split('.');
    return identifiers.some((idntfr, i) => {
        if (idntfr === 'length' && (
            typeof value === 'string' || Array.isArray(value)
        )) {
            value = value.length;
        } else if (isBlob(value)) {
            switch (idntfr) {
            case 'size': case 'type':
                value = value[idntfr];
                break;
            }
        } else if (isFile(value)) {
            switch (idntfr) {
            case 'name': case 'lastModified':
                value = value[idntfr];
                break;
            case 'lastModifiedDate':
                value = new Date(value.lastModified);
                break;
            }
        } else if (!isObj(value) || !Object.prototype.hasOwnProperty.call(value, idntfr)) {
            return true;
        } else {
            value = value[idntfr];
            return value === undefined;
        }
    }) ? {failure: true} : {value};
}

/**
 * Sets the inline key value
 * @param {object} value
 * @param {*} key
 * @param {string} keyPath
 */
function injectKeyIntoValueUsingKeyPath (value, key, keyPath) {
    const identifiers = keyPath.split('.');
    const last = identifiers.pop();
    for (let i = 0; i < identifiers.length; i++) {
        const identifier = identifiers[i];
        const hop = Object.prototype.hasOwnProperty.call(value, identifier);
        if (!hop) {
            value[identifier] = {};
        }
        value = value[identifier];
    }
    value[last] = key; // key is already a `keyValue` in our processing so no need to convert
}

// See https://github.com/w3c/IndexedDB/pull/146
function checkKeyCouldBeInjectedIntoValue (value, keyPath) {
    const identifiers = keyPath.split('.');
    identifiers.pop();
    for (let i = 0; i < identifiers.length; i++) {
        if (!isObj(value)) {
            return false;
        }
        const identifier = identifiers[i];
        const hop = Object.prototype.hasOwnProperty.call(value, identifier);
        if (!hop) {
            return true;
        }
        value = value[identifier];
    }
    return isObj(value);
}

function isKeyInRange (key, range, checkCached) {
    let lowerMatch = range.lower === undefined;
    let upperMatch = range.upper === undefined;
    const encodedKey = encode(key, true);
    const lower = checkCached ? range.__lowerCached : encode(range.lower, true);
    const upper = checkCached ? range.__upperCached : encode(range.upper, true);

    if (range.lower !== undefined) {
        if (range.lowerOpen && encodedKey > lower) {
            lowerMatch = true;
        }
        if (!range.lowerOpen && encodedKey >= lower) {
            lowerMatch = true;
        }
    }
    if (range.upper !== undefined) {
        if (range.upperOpen && encodedKey < upper) {
            upperMatch = true;
        }
        if (!range.upperOpen && encodedKey <= upper) {
            upperMatch = true;
        }
    }

    return lowerMatch && upperMatch;
}

/**
 * Determines whether an index entry matches a multi-entry key value.
 * @param {string} encodedEntry     The entry value (already encoded)
 * @param {string} encodedKey       The full index key (already encoded)
 * @returns {boolean}
 */
function isMultiEntryMatch (encodedEntry, encodedKey) {
    const keyType = encodedCharToKeyType[encodedKey.slice(0, 1)];

    if (keyType === 'array') {
        return encodedKey.indexOf(encodedEntry) > 1;
    } else {
        return encodedKey === encodedEntry;
    }
}

function findMultiEntryMatches (keyEntry, range) {
    const matches = [];

    if (Array.isArray(keyEntry)) {
        for (let i = 0; i < keyEntry.length; i++) {
            let key = keyEntry[i];

            if (Array.isArray(key)) {
                if (range && range.lower === range.upper) {
                    continue;
                }
                if (key.length === 1) {
                    key = key[0];
                } else {
                    const nested = findMultiEntryMatches(key, range);
                    if (nested.length > 0) {
                        matches.push(key);
                    }
                    continue;
                }
            }

            if (range == null || isKeyInRange(key, range, true)) {
                matches.push(key);
            }
        }
    } else {
        if (range == null || isKeyInRange(keyEntry, range, true)) {
            matches.push(keyEntry);
        }
    }
    return matches;
}

/**
* Not currently in use but keeping for spec parity
*/
function convertKeyToValue (key) {
    const type = key.type;
    const value = key.value;
    switch (type) {
    case 'number': case 'string': {
        return value;
    } case 'array': {
        const array = [];
        const len = value.length;
        let index = 0;
        while (index < len) {
            const entry = convertKeyToValue(value[index]);
            array[index] = entry;
            index++;
        }
        return array;
    } case 'date': {
        return new Date(value);
    } case 'binary': {
        const len = value.length;
        const buffer = new ArrayBuffer(len);
        // Set the entries in buffer's [[ArrayBufferData]] to those in `value`
        const uint8 = new Uint8Array(buffer, value.byteOffset || 0, value.byteLength);
        uint8.set(value);
        return buffer;
    } case 'invalid': default:
        throw new Error('Bad key');
    }
}

function encode (key, inArray) {
    // Bad keys like `null`, `object`, `boolean`, 'function', 'symbol' should not be passed here due to prior validation
    if (key === undefined) {
        return null;
    }
    // array, date, number, string, binary (should already have detected "invalid")
    return types[getKeyType(key)].encode(key, inArray);
}
function decode (key, inArray) {
    if (typeof key !== 'string') {
        return undefined;
    }
    return types[encodedCharToKeyType[key.slice(0, 1)]].decode(key, inArray);
}

function roundTrip (key, inArray) {
    return decode(encode(key, inArray), inArray);
}

const MAX_ALLOWED_CURRENT_NUMBER = 9007199254740992; // 2 ^ 53 (Also equal to `Number.MAX_SAFE_INTEGER + 1`)

function getCurrentNumber (tx, store, callback, sqlFailCb) {
    tx.executeSql('SELECT "currNum" FROM __sys__ WHERE "name" = ?', [escapeSQLiteStatement(store.__currentName)], function (tx, data) {
        if (data.rows.length !== 1) {
            callback(1); // eslint-disable-line standard/no-callback-literal
        } else {
            callback(data.rows.item(0).currNum);
        }
    }, function (tx, error) {
        sqlFailCb(createDOMException('DataError', 'Could not get the auto increment value for key', error));
    });
}

function assignCurrentNumber (tx, store, num, successCb, failCb) {
    const sql = 'UPDATE __sys__ SET "currNum" = ? WHERE "name" = ?';
    const sqlValues = [num, escapeSQLiteStatement(store.__currentName)];
    CFG.DEBUG && console.log(sql, sqlValues);
    tx.executeSql(sql, sqlValues, function (tx, data) {
        successCb(num);
    }, function (tx, err) {
        failCb(createDOMException('UnknownError', 'Could not set the auto increment value for key', err));
    });
}

// Bump up the auto-inc counter if the key path-resolved value is valid (greater than old value and >=1) OR
//  if a manually passed in key is valid (numeric and >= 1) and >= any primaryKey
function setCurrentNumber (tx, store, num, successCb, failCb) {
    num = num === MAX_ALLOWED_CURRENT_NUMBER
        ? num + 2 // Since incrementing by one will have no effect in JavaScript on this unsafe max, we represent the max as a number incremented by two. The getting of the current number is never returned to the user and is only used in safe comparisons, so it is safe for us to represent it in this manner
        : num + 1;
    return assignCurrentNumber(tx, store, num, successCb, failCb);
}

function generateKeyForStore (tx, store, cb, sqlFailCb) {
    getCurrentNumber(tx, store, function (key) {
        if (key > MAX_ALLOWED_CURRENT_NUMBER) { // 2 ^ 53 (See <https://github.com/w3c/IndexedDB/issues/147>)
            return cb('failure'); // eslint-disable-line standard/no-callback-literal
        }
        // Increment current number by 1 (we cannot leverage SQLite's
        //  autoincrement (and decrement when not needed), as decrementing
        //  will be overwritten/ignored upon the next insert)
        setCurrentNumber(tx, store, key,
            function () {
                cb(null, key, key);
            },
            sqlFailCb
        );
    }, sqlFailCb);
}

// Fractional or numbers exceeding the max do not get changed in the result
//     per https://github.com/w3c/IndexedDB/issues/147
//     so we do not return a key
function possiblyUpdateKeyGenerator (tx, store, key, successCb, sqlFailCb) {
    // Per https://github.com/w3c/IndexedDB/issues/147 , non-finite numbers
    //   (or numbers larger than the max) are now to have the explicit effect of
    //   setting the current number (up to the max), so we do not optimize them
    //   out here
    if (typeof key !== 'number' || key < 1) { // Optimize with no need to get the current number
        // Auto-increment attempted with a bad key;
        //   we are not to change the current number, but the steps don't call for failure
        // Numbers < 1 are optimized out as they will never be greater than the current number which must be at least 1
        successCb();
    } else {
        // If auto-increment and the keyPath item is a valid numeric key, get the old auto-increment to compare if the new is higher
        //  to determine which to use and whether to update the current number
        getCurrentNumber(tx, store, function (cn) {
            const value = Math.floor(
                Math.min(key, MAX_ALLOWED_CURRENT_NUMBER)
            );
            const useNewKeyForAutoInc = value >= cn;
            if (useNewKeyForAutoInc) {
                setCurrentNumber(tx, store, value, function () {
                    successCb(cn); // Supply old current number in case needs to be reverted
                }, sqlFailCb);
            } else { // Not updated
                successCb();
            }
        }, sqlFailCb);
    }
}

var Key = /*#__PURE__*/Object.freeze({
	encode: encode,
	decode: decode,
	roundTrip: roundTrip,
	convertKeyToValue: convertKeyToValue,
	convertValueToKeyValueDecoded: convertValueToKeyValueDecoded,
	convertValueToMultiEntryKeyDecoded: convertValueToMultiEntryKeyDecoded,
	convertValueToKey: convertValueToKey,
	convertValueToMultiEntryKey: convertValueToMultiEntryKey,
	convertValueToKeyRethrowingAndIfInvalid: convertValueToKeyRethrowingAndIfInvalid,
	extractKeyFromValueUsingKeyPath: extractKeyFromValueUsingKeyPath,
	evaluateKeyPathOnValue: evaluateKeyPathOnValue,
	extractKeyValueDecodedFromValueUsingKeyPath: extractKeyValueDecodedFromValueUsingKeyPath,
	injectKeyIntoValueUsingKeyPath: injectKeyIntoValueUsingKeyPath,
	checkKeyCouldBeInjectedIntoValue: checkKeyCouldBeInjectedIntoValue,
	isMultiEntryMatch: isMultiEntryMatch,
	isKeyInRange: isKeyInRange,
	findMultiEntryMatches: findMultiEntryMatches,
	assignCurrentNumber: assignCurrentNumber,
	generateKeyForStore: generateKeyForStore,
	possiblyUpdateKeyGenerator: possiblyUpdateKeyGenerator
});

const readonlyProperties$2 = ['lower', 'upper', 'lowerOpen', 'upperOpen'];

/**
 * The IndexedDB KeyRange object
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#dfn-key-range
 * @param {Object} lower
 * @param {Object} upper
 * @param {Object} lowerOpen
 * @param {Object} upperOpen
 */
function IDBKeyRange$1 () {
    throw new TypeError('Illegal constructor');
}
const IDBKeyRangeAlias = IDBKeyRange$1;
IDBKeyRange$1.__createInstance = function (lower, upper, lowerOpen, upperOpen) {
    function IDBKeyRange () {
        this[Symbol.toStringTag] = 'IDBKeyRange';
        if (lower === undefined && upper === undefined) {
            throw createDOMException('DataError', 'Both arguments to the key range method cannot be undefined');
        }
        let lowerConverted, upperConverted;
        if (lower !== undefined) {
            lowerConverted = roundTrip(lower); // Todo: does this make the "conversions" redundant
            convertValueToKeyRethrowingAndIfInvalid(lower);
        }
        if (upper !== undefined) {
            upperConverted = roundTrip(upper); // Todo: does this make the "conversions" redundant
            convertValueToKeyRethrowingAndIfInvalid(upper);
        }
        if (lower !== undefined && upper !== undefined && lower !== upper) {
            if (encode(lower) > encode(upper)) {
                throw createDOMException('DataError', '`lower` must not be greater than `upper` argument in `bound()` call.');
            }
        }

        this.__lower = lowerConverted;
        this.__upper = upperConverted;
        this.__lowerOpen = !!lowerOpen;
        this.__upperOpen = !!upperOpen;
    }
    IDBKeyRange.prototype = IDBKeyRangeAlias.prototype;
    return new IDBKeyRange();
};
IDBKeyRange$1.prototype.includes = function (key) {
    // We can't do a regular instanceof check as it will create a loop given our hasInstance implementation
    if (!isObj(this) || typeof this.__lowerOpen !== 'boolean') {
        throw new TypeError('Illegal invocation');
    }
    if (!arguments.length) {
        throw new TypeError('IDBKeyRange.includes requires a key argument');
    }
    convertValueToKeyRethrowingAndIfInvalid(key);
    return isKeyInRange(key, this);
};

IDBKeyRange$1.only = function (value) {
    if (!arguments.length) {
        throw new TypeError('IDBKeyRange.only requires a value argument');
    }
    return IDBKeyRange$1.__createInstance(value, value, false, false);
};

IDBKeyRange$1.lowerBound = function (value /*, open */) {
    if (!arguments.length) {
        throw new TypeError('IDBKeyRange.lowerBound requires a value argument');
    }
    return IDBKeyRange$1.__createInstance(value, undefined, arguments[1], true);
};
IDBKeyRange$1.upperBound = function (value /*, open */) {
    if (!arguments.length) {
        throw new TypeError('IDBKeyRange.upperBound requires a value argument');
    }
    return IDBKeyRange$1.__createInstance(undefined, value, true, arguments[1]);
};
IDBKeyRange$1.bound = function (lower, upper /* , lowerOpen, upperOpen */) {
    if (arguments.length <= 1) {
        throw new TypeError('IDBKeyRange.bound requires lower and upper arguments');
    }
    return IDBKeyRange$1.__createInstance(lower, upper, arguments[2], arguments[3]);
};
IDBKeyRange$1.prototype[Symbol.toStringTag] = 'IDBKeyRangePrototype';

readonlyProperties$2.forEach((prop) => {
    Object.defineProperty(IDBKeyRange$1.prototype, '__' + prop, {
        enumerable: false,
        configurable: false,
        writable: true
    });
    Object.defineProperty(IDBKeyRange$1.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            // We can't do a regular instanceof check as it will create a loop given our hasInstance implementation
            if (!isObj(this) || typeof this.__lowerOpen !== 'boolean') {
                throw new TypeError('Illegal invocation');
            }
            return this['__' + prop];
        }
    });
});

Object.defineProperty(IDBKeyRange$1, Symbol.hasInstance, {
    value: obj => isObj(obj) && 'upper' in obj && typeof obj.lowerOpen === 'boolean'
});

Object.defineProperty(IDBKeyRange$1, 'prototype', {
    writable: false
});

function setSQLForKeyRange (range, quotedKeyColumnName, sql, sqlValues, addAnd, checkCached) {
    if (range && (range.lower !== undefined || range.upper !== undefined)) {
        if (addAnd) sql.push('AND');
        let encodedLowerKey, encodedUpperKey;
        const hasLower = range.lower !== undefined;
        const hasUpper = range.upper !== undefined;
        if (hasLower) {
            encodedLowerKey = checkCached ? range.__lowerCached : encode(range.lower);
        }
        if (hasUpper) {
            encodedUpperKey = checkCached ? range.__upperCached : encode(range.upper);
        }
        if (hasLower) {
            sqlValues.push(escapeSQLiteStatement(encodedLowerKey));
            if (hasUpper && encodedLowerKey === encodedUpperKey && !range.lowerOpen && !range.upperOpen) {
                sql.push(quotedKeyColumnName, '=', '?');
                return;
            }
            sql.push(quotedKeyColumnName, (range.lowerOpen ? '>' : '>='), '?');
        }
        (hasLower && hasUpper) && sql.push('AND');
        if (hasUpper) {
            sql.push(quotedKeyColumnName, (range.upperOpen ? '<' : '<='), '?');
            sqlValues.push(escapeSQLiteStatement(encodedUpperKey));
        }
    }
}

function convertValueToKeyRange (value, nullDisallowed) {
    if (instanceOf(value, IDBKeyRange$1)) {
        // We still need to validate IDBKeyRange-like objects (the above check is based on loose duck-typing)
        if (!value.toString() !== '[object IDBKeyRange]') {
            return IDBKeyRange$1.__createInstance(value.lower, value.upper, value.lowerOpen, value.upperOpen);
        }
        return value;
    }
    if (value == null) {
        if (nullDisallowed) {
            throw createDOMException('DataError', 'No key or range was specified');
        }
        return undefined; // Represents unbounded
    }
    convertValueToKeyRethrowingAndIfInvalid(value);
    return IDBKeyRange$1.only(value);
}

let cleanInterface = false;

const testObject = {test: true};
// Test whether Object.defineProperty really works.
if (Object.defineProperty) {
    try {
        Object.defineProperty(testObject, 'test', { enumerable: false });
        if (testObject.test) {
            cleanInterface = true;
        }
    } catch (e) {
    // Object.defineProperty does not work as intended.
    }
}

/**
 * Shim the DOMStringList object.
 *
 */
const DOMStringList = function () {
    throw new TypeError('Illegal constructor');
};
DOMStringList.prototype = {
    constructor: DOMStringList,
    // Interface.
    contains: function (str) {
        if (!arguments.length) {
            throw new TypeError('DOMStringList.contains must be supplied a value');
        }
        return this._items.includes(str);
    },
    item: function (key) {
        if (!arguments.length) {
            throw new TypeError('DOMStringList.item must be supplied a value');
        }
        if (key < 0 || key >= this.length || !Number.isInteger(key)) {
            return null;
        }
        return this._items[key];
    },

    // Helpers. Should only be used internally.
    clone: function () {
        const stringList = DOMStringList.__createInstance();
        stringList._items = this._items.slice();
        stringList._length = this.length;
        stringList.addIndexes();
        return stringList;
    },
    addIndexes: function () {
        for (let i = 0; i < this._items.length; i++) {
            this[i] = this._items[i];
        }
    },
    sortList: function () {
        // http://w3c.github.io/IndexedDB/#sorted-list
        // https://tc39.github.io/ecma262/#sec-abstract-relational-comparison
        this._items.sort();
        this.addIndexes();
        return this._items;
    },
    forEach: function (cb, thisArg) {
        this._items.forEach(cb, thisArg);
    },
    map: function (cb, thisArg) {
        return this._items.map(cb, thisArg);
    },
    indexOf: function (str) {
        return this._items.indexOf(str);
    },
    push: function (item) {
        this._items.push(item);
        this._length++;
        this.sortList();
    },
    splice: function (...args /* index, howmany, item1, ..., itemX */) {
        this._items.splice(...args);
        this._length = this._items.length;
        for (const i in this) {
            if (i === String(parseInt(i, 10))) {
                delete this[i];
            }
        }
        this.sortList();
    },
    [Symbol.toStringTag]: 'DOMStringListPrototype',
    // At least because `DOMStringList`, as a [list](https://infra.spec.whatwg.org/#list)
    //    can be converted to a sequence per https://infra.spec.whatwg.org/#list-iterate
    //    and particularly as some methods, e.g., `IDBDatabase.transaction`
    //    expect such sequence<DOMString> (or DOMString), we need an iterator (some of
    //    the Mocha tests rely on these)
    [Symbol.iterator]: function * () {
        let i = 0;
        while (i < this._items.length) {
            yield this._items[i++];
        }
    }
};
Object.defineProperty(DOMStringList, Symbol.hasInstance, {
    value: function (obj) {
        return ({}.toString.call(obj) === 'DOMStringListPrototype');
    }
});
const DOMStringListAlias = DOMStringList;
Object.defineProperty(DOMStringList, '__createInstance', {
    value: function () {
        const DOMStringList = function DOMStringList () {
            this.toString = function () {
                return '[object DOMStringList]';
            };
            // Internal functions on the prototype have been made non-enumerable below.
            Object.defineProperty(this, 'length', {
                enumerable: true,
                get: function () {
                    return this._length;
                }
            });
            this._items = [];
            this._length = 0;
        };
        DOMStringList.prototype = DOMStringListAlias.prototype;
        return new DOMStringList();
    }
});

if (cleanInterface) {
    Object.defineProperty(DOMStringList, 'prototype', {
        writable: false
    });

    const nonenumerableReadonly = ['addIndexes', 'sortList', 'forEach', 'map', 'indexOf', 'push', 'splice', 'constructor', '__createInstance'];
    nonenumerableReadonly.forEach((nonenumerableReadonly) => {
        Object.defineProperty(DOMStringList.prototype, nonenumerableReadonly, {
            enumerable: false
        });
    });

    // Illegal invocations
    Object.defineProperty(DOMStringList.prototype, 'length', {
        configurable: true,
        enumerable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });

    const nonenumerableWritable = ['_items', '_length'];
    nonenumerableWritable.forEach((nonenumerableWritable) => {
        Object.defineProperty(DOMStringList.prototype, nonenumerableWritable, {
            enumerable: false,
            writable: true
        });
    });
}

// Since [immediate](https://github.com/calvinmetcalf/immediate) is
//   not doing the trick for our WebSQL transactions (at least in Node),
//   we are forced to make the promises run fully synchronously.

function isPromise(p) {
  return p && typeof p.then === 'function';
}
function addReject(prom, reject) {
  prom.then(null, reject); // Use this style for sake of non-Promise thenables (e.g., jQuery Deferred)
}

// States
var PENDING = 2,
    FULFILLED = 0, // We later abuse these as array indices
    REJECTED = 1;

function SyncPromise(fn) {
  var self = this;
  self.v = 0; // Value, this will be set to either a resolved value or rejected reason
  self.s = PENDING; // State of the promise
  self.c = [[],[]]; // Callbacks c[0] is fulfillment and c[1] contains rejection callbacks
  function transist(val, state) {
    self.v = val;
    self.s = state;
    self.c[state].forEach(function(fn) { fn(val); });
    // Release memory, but if no handlers have been added, as we
    //   assume that we will resolve/reject (truly) synchronously
    //   and thus we avoid flagging checks about whether we've
    //   already resolved/rejected.
    if (self.c[state].length) self.c = null;
  }
  function resolve(val) {
    if (!self.c) {
      // Already resolved (or will be resolved), do nothing.
    } else if (isPromise(val)) {
      addReject(val.then(resolve), reject);
    } else {
      transist(val, FULFILLED);
    }
  }
  function reject(reason) {
    if (!self.c) {
      // Already resolved (or will be resolved), do nothing.
    } else if (isPromise(reason)) {
      addReject(reason.then(reject), reject);
    } else {
      transist(reason, REJECTED);
    }
  }
  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

var prot = SyncPromise.prototype;

prot.then = function(cb, errBack) {
  var self = this;
  return new SyncPromise(function(resolve, reject) {
    var rej = typeof errBack === 'function' ? errBack : reject;
    function settle() {
      try {
        resolve(cb ? cb(self.v) : self.v);
      } catch(e) {
        rej(e);
      }
    }
    if (self.s === FULFILLED) {
      settle();
    } else if (self.s === REJECTED) {
      rej(self.v);
    } else {
      self.c[FULFILLED].push(settle);
      self.c[REJECTED].push(rej);
    }
  });
};

prot.catch = function(cb) {
  var self = this;
  return new SyncPromise(function(resolve, reject) {
    function settle() {
      try {
        resolve(cb(self.v));
      } catch(e) {
        reject(e);
      }
    }
    if (self.s === REJECTED) {
      settle();
    } else if (self.s === FULFILLED) {
      resolve(self.v);
    } else {
      self.c[REJECTED].push(settle);
      self.c[FULFILLED].push(resolve);
    }
  });
};

SyncPromise.all = function(promises) {
  return new SyncPromise(function(resolve, reject, l) {
    l = promises.length;
    var newPromises = [];
    if (!l) {
        resolve(newPromises);
        return;
    }
    promises.forEach(function(p, i) {
      if (isPromise(p)) {
        addReject(p.then(function(res) {
          newPromises[i] = res;
          --l || resolve(newPromises);
        }), reject);
      } else {
        newPromises[i] = p;
        --l || resolve(promises);
      }
    });
  });
};

SyncPromise.race = function(promises) {
  var resolved = false;
  return new SyncPromise(function(resolve, reject) {
    promises.some(function(p, i) {
      if (isPromise(p)) {
        addReject(p.then(function(res) {
          if (resolved) {
            return;
          }
          resolve(res);
          resolved = true;
        }), reject);
      } else {
        resolve(p);
        resolved = true;
        return true;
      }
    });
  });
};

SyncPromise.resolve = function(val) {
  return new SyncPromise(function(resolve, reject) {
    resolve(val);
  });
};

SyncPromise.reject = function(val) {
  return new SyncPromise(function(resolve, reject) {
    reject(val);
  });
};
var syncPromiseCommonjs = SyncPromise;

let uniqueID = 0;
const listeners$1 = ['onabort', 'oncomplete', 'onerror'];
const readonlyProperties$3 = ['objectStoreNames', 'mode', 'db', 'error'];

/**
 * The IndexedDB Transaction
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBTransaction
 * @param {IDBDatabase} db
 * @param {string[]} storeNames
 * @param {string} mode
 * @constructor
 */
function IDBTransaction () {
    throw new TypeError('Illegal constructor');
}
const IDBTransactionAlias = IDBTransaction;
IDBTransaction.__createInstance = function (db, storeNames, mode) {
    function IDBTransaction () {
        const me = this;
        me[Symbol.toStringTag] = 'IDBTransaction';
        defineReadonlyProperties(me, readonlyProperties$3);
        me.__id = ++uniqueID; // for debugging simultaneous transactions
        me.__active = true;
        me.__running = false;
        me.__errored = false;
        me.__requests = [];
        me.__objectStoreNames = storeNames;
        me.__mode = mode;
        me.__db = db;
        me.__error = null;
        me.__setOptions({
            legacyOutputDidListenersThrowFlag: true // Event hook for IndexedB
        });

        readonlyProperties$3.forEach((readonlyProp) => {
            Object.defineProperty(this, readonlyProp, {
                configurable: true
            });
        });
        listeners$1.forEach((listener) => {
            Object.defineProperty(this, listener, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this['__' + listener];
                },
                set: function (val) {
                    this['__' + listener] = val;
                }
            });
        });
        listeners$1.forEach((l) => {
            this[l] = null;
        });
        me.__storeHandles = {};

        // Kick off the transaction as soon as all synchronous code is done
        setTimeout(() => { me.__executeRequests(); }, 0);
    }
    IDBTransaction.prototype = IDBTransactionAlias.prototype;
    return new IDBTransaction();
};

IDBTransaction.prototype = EventTargetFactory.createInstance({defaultSync: true, extraProperties: ['complete']}); // Ensure EventTarget preserves our properties
IDBTransaction.prototype.__transFinishedCb = function (err, cb) {
    if (err) {
        cb(true); // eslint-disable-line standard/no-callback-literal
        return;
    }
    cb();
};
IDBTransaction.prototype.__executeRequests = function () {
    const me = this;
    if (me.__running) {
        CFG.DEBUG && console.log('Looks like the request set is already running', me.mode);
        return;
    }

    me.__running = true;

    me.db.__db[me.mode === 'readonly' ? 'readTransaction' : 'transaction']( // `readTransaction` is optimized, at least in `node-websql`
        function executeRequests (tx) {
            me.__tx = tx;
            let q = null, i = -1;

            function success (result, req) {
                if (me.__errored || me.__requestsFinished) {
                    // We've already called "onerror", "onabort", or thrown within the transaction, so don't do it again.
                    return;
                }
                if (req) {
                    q.req = req; // Need to do this in case of cursors
                }
                if (q.req.__readyState === 'done') { // Avoid continuing with aborted requests
                    return;
                }
                q.req.__readyState = 'done';
                q.req.__result = result;
                q.req.__error = null;

                me.__active = true;
                const e = createEvent('success');
                q.req.dispatchEvent(e);
                // Do not set __active flag to false yet: https://github.com/w3c/IndexedDB/issues/87
                if (e.__legacyOutputDidListenersThrowError) {
                    logError('Error', 'An error occurred in a success handler attached to request chain', e.__legacyOutputDidListenersThrowError); // We do nothing else with this error as per spec
                    me.__abortTransaction(createDOMException('AbortError', 'A request was aborted (in user handler after success).'));
                    return;
                }
                executeNextRequest();
            }

            function error (...args /* tx, err */) {
                if (me.__errored || me.__requestsFinished) {
                    // We've already called "onerror", "onabort", or thrown within the transaction, so don't do it again.
                    return;
                }
                if (q.req && q.req.__readyState === 'done') { // Avoid continuing with aborted requests
                    return;
                }
                const err = findError(args);
                if (!q.req) {
                    me.__abortTransaction(err);
                    return;
                }
                // Fire an error event for the current IDBRequest
                q.req.__readyState = 'done';
                q.req.__error = err;
                q.req.__result = undefined; // Must be undefined if an error per `result` getter
                q.req.addLateEventListener('error', function (e) {
                    if (e.cancelable && e.defaultPrevented && !e.__legacyOutputDidListenersThrowError) {
                        executeNextRequest();
                    }
                });
                q.req.addDefaultEventListener('error', function () {
                    me.__abortTransaction(q.req.__error);
                });

                me.__active = true;
                const e = createEvent('error', err, {bubbles: true, cancelable: true});
                q.req.dispatchEvent(e);
                // Do not set __active flag to false yet: https://github.com/w3c/IndexedDB/issues/87
                if (e.__legacyOutputDidListenersThrowError) {
                    logError('Error', 'An error occurred in an error handler attached to request chain', e.__legacyOutputDidListenersThrowError); // We do nothing else with this error as per spec
                    e.preventDefault(); // Prevent 'error' default as steps indicate we should abort with `AbortError` even without cancellation
                    me.__abortTransaction(createDOMException('AbortError', 'A request was aborted (in user handler after error).'));
                }
            }

            function executeNextRequest () {
                if (me.__errored || me.__requestsFinished) {
                    // We've already called "onerror", "onabort", or thrown within the transaction, so don't do it again.
                    return;
                }
                i++;
                if (i >= me.__requests.length) {
                    // All requests in the transaction are done
                    me.__requests = [];
                    if (me.__active) {
                        requestsFinished();
                    }
                } else {
                    try {
                        q = me.__requests[i];
                        if (!q.req) {
                            q.op(tx, q.args, executeNextRequest, error);
                            return;
                        }
                        if (q.req.__readyState === 'done') { // Avoid continuing with aborted requests
                            return;
                        }
                        q.op(tx, q.args, success, error, executeNextRequest);
                    } catch (e) {
                        error(e);
                    }
                }
            }

            executeNextRequest();
        },
        function webSQLError (webSQLErr) {
            if (webSQLErr === true) { // Not a genuine SQL error
                return;
            }
            const err = webSQLErrback(webSQLErr);
            me.__abortTransaction(err);
        },
        function () {
            // For Node, we don't need to try running here as we can keep
            //   the transaction running long enough to rollback (in the
            //   next (non-standard) callback for this transaction call)
            if (me.__transFinishedCb !== IDBTransaction.prototype.__transFinishedCb) { // Node
                return;
            }
            if (!me.__transactionEndCallback && !me.__requestsFinished) {
                me.__transactionFinished = true;
                return;
            }
            if (me.__transactionEndCallback && !me.__completed) {
                me.__transFinishedCb(me.__errored, me.__transactionEndCallback);
            }
        },
        function (currentTask, err, done, rollback, commit) {
            if (currentTask.readOnly || err) {
                return true;
            }
            me.__transFinishedCb = function (err, cb) {
                if (err) {
                    rollback(err, cb);
                } else {
                    commit(cb);
                }
            };
            if (me.__transactionEndCallback && !me.__completed) {
                me.__transFinishedCb(me.__errored, me.__transactionEndCallback);
            }
            return false;
        }
    );

    function requestsFinished () {
        me.__active = false;
        me.__requestsFinished = true;

        function complete () {
            me.__completed = true;
            CFG.DEBUG && console.log('Transaction completed');
            const evt = createEvent('complete');
            try {
                me.__internal = true;
                me.dispatchEvent(evt);
                me.__internal = false;
                me.dispatchEvent(createEvent('__complete'));
            } catch (e) {
                me.__internal = false;
                // An error occurred in the "oncomplete" handler.
                // It's too late to call "onerror" or "onabort". Throw a global error instead.
                // (this may seem odd/bad, but it's how all native IndexedDB implementations work)
                me.__errored = true;
                throw e;
            } finally {
                me.__storeHandles = {};
            }
        }
        if (me.mode === 'readwrite') {
            if (me.__transactionFinished) {
                complete();
                return;
            }
            me.__transactionEndCallback = complete;
            return;
        }
        if (me.mode === 'readonly') {
            complete();
            return;
        }
        const ev = createEvent('__beforecomplete');
        ev.complete = complete;
        me.dispatchEvent(ev);
    }
};

/**
 * Creates a new IDBRequest for the transaction.
 * NOTE: The transaction is not queued until you call {@link IDBTransaction#__pushToQueue}
 * @returns {IDBRequest}
 * @protected
 */
IDBTransaction.prototype.__createRequest = function (source) {
    const me = this;
    const request = IDBRequest.__createInstance();
    request.__source = source !== undefined ? source : me.db;
    request.__transaction = me;
    return request;
};

/**
 * Adds a callback function to the transaction queue
 * @param {function} callback
 * @param {*} args
 * @returns {IDBRequest}
 * @protected
 */
IDBTransaction.prototype.__addToTransactionQueue = function (callback, args, source) {
    const request = this.__createRequest(source);
    this.__pushToQueue(request, callback, args);
    return request;
};

/**
 * Adds a callback function to the transaction queue without generating a request
 * @param {function} callback
 * @param {*} args
 * @returns {IDBRequest}
 * @protected
 */
IDBTransaction.prototype.__addNonRequestToTransactionQueue = function (callback, args, source) {
    this.__pushToQueue(null, callback, args);
};

/**
 * Adds an IDBRequest to the transaction queue
 * @param {IDBRequest} request
 * @param {function} callback
 * @param {*} args
 * @protected
 */
IDBTransaction.prototype.__pushToQueue = function (request, callback, args) {
    this.__assertActive();
    this.__requests.push({
        'op': callback,
        'args': args,
        'req': request
    });
};

IDBTransaction.prototype.__assertActive = function () {
    if (!this.__active) {
        throw createDOMException('TransactionInactiveError', 'A request was placed against a transaction which is currently not active, or which is finished');
    }
};

IDBTransaction.prototype.__assertWritable = function () {
    if (this.mode === 'readonly') {
        throw createDOMException('ReadOnlyError', 'The transaction is read only');
    }
};

IDBTransaction.prototype.__assertVersionChange = function () {
    IDBTransaction.__assertVersionChange(this);
};

/**
 * Returns the specified object store.
 * @param {string} objectStoreName
 * @returns {IDBObjectStore}
 */
IDBTransaction.prototype.objectStore = function (objectStoreName) {
    const me = this;
    if (!(me instanceof IDBTransaction)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No object store name was specified');
    }
    IDBTransaction.__assertNotFinished(me);
    if (me.__objectStoreNames.indexOf(objectStoreName) === -1) {
        throw createDOMException('NotFoundError', objectStoreName + ' is not participating in this transaction');
    }
    const store = me.db.__objectStores[objectStoreName];
    if (!store) {
        throw createDOMException('NotFoundError', objectStoreName + ' does not exist in ' + me.db.name);
    }

    if (!me.__storeHandles[objectStoreName] ||
        // These latter conditions are to allow store
        //   recreation to create new clone object
        me.__storeHandles[objectStoreName].__pendingDelete ||
        me.__storeHandles[objectStoreName].__deleted) {
        me.__storeHandles[objectStoreName] = IDBObjectStore.__clone(store, me);
    }
    return me.__storeHandles[objectStoreName];
};

IDBTransaction.prototype.__abortTransaction = function (err) {
    const me = this;
    logError('Error', 'An error occurred in a transaction', err);
    if (me.__errored) {
        // We've already called "onerror", "onabort", or thrown, so don't do it again.
        return;
    }
    me.__errored = true;

    if (me.mode === 'versionchange') { // Steps for aborting an upgrade transaction
        me.db.__version = me.db.__oldVersion;
        me.db.__objectStoreNames = me.db.__oldObjectStoreNames;
        me.__objectStoreNames = me.db.__oldObjectStoreNames;
        Object.values(me.db.__objectStores).concat(Object.values(me.__storeHandles)).forEach(function (store) {
            if ('__pendingName' in store && me.db.__oldObjectStoreNames.indexOf(store.__pendingName) > -1) { // Store was already created so we restore to name before the rename
                store.__name = store.__originalName;
            }
            store.__indexNames = store.__oldIndexNames;
            delete store.__pendingDelete;
            Object.values(store.__indexes).concat(Object.values(store.__indexHandles)).forEach(function (index) {
                if ('__pendingName' in index && store.__oldIndexNames.indexOf(index.__pendingName) > -1) { // Index was already created so we restore to name before the rename
                    index.__name = index.__originalName;
                }
                delete index.__pendingDelete;
            });
        });
    }
    me.__active = false; // Setting here and in requestsFinished for https://github.com/w3c/IndexedDB/issues/87

    if (err !== null) {
        me.__error = err;
    }

    if (me.__requestsFinished) {
        // The transaction has already completed, so we can't call "onerror" or "onabort".
        // So throw the error instead.
        setTimeout(() => {
            throw err;
        }, 0);
    }

    function abort (tx, errOrResult) {
        if (!tx) {
            CFG.DEBUG && console.log('Rollback not possible due to missing transaction', me);
        } else if (errOrResult && typeof errOrResult.code === 'number') {
            CFG.DEBUG && console.log('Rollback erred; feature is probably not supported as per WebSQL', me);
        } else {
            CFG.DEBUG && console.log('Rollback succeeded', me);
        }

        me.dispatchEvent(createEvent('__preabort'));
        me.__requests.filter(function (q, i, arr) {
            return q.req && q.req.__readyState !== 'done' && [i, -1].includes(
                arr.map((q) => q.req).lastIndexOf(q.req)
            );
        }).reduce(function (promises, q) {
            // We reduce to a chain of promises to be queued in order, so we cannot use `Promise.all`,
            //  and I'm unsure whether `setTimeout` currently behaves first-in-first-out with the same timeout
            //  so we could just use a `forEach`.
            return promises.then(function () {
                q.req.__readyState = 'done';
                q.req.__result = undefined;
                q.req.__error = createDOMException('AbortError', 'A request was aborted (an unfinished request).');
                const reqEvt = createEvent('error', q.req.__error, {bubbles: true, cancelable: true});
                return new syncPromiseCommonjs(function (resolve) {
                    setTimeout(() => {
                        q.req.dispatchEvent(reqEvt); // No need to catch errors
                        resolve();
                    });
                });
            });
        }, syncPromiseCommonjs.resolve()).then(function () { // Also works when there are no pending requests
            const evt = createEvent('abort', err, {bubbles: true, cancelable: false});
            setTimeout(() => {
                me.__abortFinished = true;
                me.dispatchEvent(evt);
                me.__storeHandles = {};
                me.dispatchEvent(createEvent('__abort'));
            });
        });
    }

    me.__transFinishedCb(true, function (rollback) {
        if (rollback && me.__tx) { // Not supported in standard SQL (and WebSQL errors should
            //   rollback automatically), but for Node.js, etc., we give chance for
            //   manual aborts which would otherwise not work.
            if (me.mode === 'readwrite') {
                if (me.__transactionFinished) {
                    abort();
                    return;
                }
                me.__transactionEndCallback = abort;
                return;
            }
            try {
                me.__tx.executeSql('ROLLBACK', [], abort, abort); // Not working in some circumstances, even in Node
            } catch (err) {
                // Browser errs when transaction has ended and since it most likely already erred here,
                //   we call to abort
                abort();
            }
        } else {
            abort(null, {code: 0});
        }
    });
};

IDBTransaction.prototype.abort = function () {
    const me = this;
    if (!(me instanceof IDBTransaction)) {
        throw new TypeError('Illegal invocation');
    }
    CFG.DEBUG && console.log('The transaction was aborted', me);
    IDBTransaction.__assertNotFinished(me);
    me.__abortTransaction(null);
};
IDBTransaction.prototype[Symbol.toStringTag] = 'IDBTransactionPrototype';

IDBTransaction.__assertVersionChange = function (tx) {
    if (!tx || tx.mode !== 'versionchange') {
        throw createDOMException('InvalidStateError', 'Not a version transaction');
    }
};
IDBTransaction.__assertNotVersionChange = function (tx) {
    if (tx && tx.mode === 'versionchange') {
        throw createDOMException('InvalidStateError', 'Cannot be called during a version transaction');
    }
};

IDBTransaction.__assertNotFinished = function (tx) {
    if (!tx || tx.__completed || tx.__abortFinished || tx.__errored) {
        throw createDOMException('InvalidStateError', 'Transaction finished by commit or abort');
    }
};

// object store methods behave differently: see https://github.com/w3c/IndexedDB/issues/192
IDBTransaction.__assertNotFinishedObjectStoreMethod = function (tx) {
    try {
        IDBTransaction.__assertNotFinished(tx);
    } catch (err) {
        if (tx && !tx.__completed && !tx.__abortFinished) {
            throw createDOMException('TransactionInactiveError', 'A request was placed against a transaction which is currently not active, or which is finished');
        }
        throw err;
    }
};

IDBTransaction.__assertActive = function (tx) {
    if (!tx || !tx.__active) {
        throw createDOMException('TransactionInactiveError', 'A request was placed against a transaction which is currently not active, or which is finished');
    }
};

/**
* Used by our EventTarget.prototype library to implement bubbling/capturing
*/
IDBTransaction.prototype.__getParent = function () {
    return this.db;
};

listeners$1.forEach((listener) => {
    Object.defineProperty(IDBTransaction.prototype, listener, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        },
        set: function (val) {
            throw new TypeError('Illegal invocation');
        }
    });
});

// Illegal invocations
readonlyProperties$3.forEach((prop) => {
    Object.defineProperty(IDBTransaction.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});

Object.defineProperty(IDBTransaction.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBTransaction
});

Object.defineProperty(IDBTransaction, 'prototype', {
    writable: false
});

const keys = Object.keys,
    isArray = Array.isArray,
    toString = ({}.toString),
    getProto = Object.getPrototypeOf,
    hasOwn = ({}.hasOwnProperty),
    fnToString = hasOwn.toString,
    internalStateObjPropsToIgnore = ['type', 'replaced', 'iterateIn', 'iterateUnsetNumeric'];

function isThenable (v, catchCheck) {
    return Typeson.isObject(v) && typeof v.then === 'function' && (!catchCheck || typeof v.catch === 'function');
}

function toStringTag (val) {
    return toString.call(val).slice(8, -1);
}

// This function is dependent on both constructors
//   being identical so any minimization is expected of both
function hasConstructorOf (a, b) {
    if (!a || typeof a !== 'object') {
        return false;
    }
    const proto = getProto(a);
    if (!proto) {
        return false;
    }
    const Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    if (typeof Ctor !== 'function') {
        return b === null;
    }
    return typeof Ctor === 'function' && b !== null && fnToString.call(Ctor) === fnToString.call(b);
}

function isPlainObject (val) { // Mirrors jQuery's
    if (!val || toStringTag(val) !== 'Object') {
        return false;
    }

    const proto = getProto(val);
    if (!proto) { // `Object.create(null)`
        return true;
    }

    return hasConstructorOf(val, Object);
}

function isUserObject (val) {
    if (!val || toStringTag(val) !== 'Object') {
        return false;
    }

    const proto = getProto(val);
    if (!proto) { // `Object.create(null)`
        return true;
    }
    return hasConstructorOf(val, Object) || isUserObject(proto);
}

function isObject (v) {
    return v && typeof v === 'object';
}

/* Typeson - JSON with types
    * License: The MIT License (MIT)
    * Copyright (c) 2016 David Fahlander
    */

/** An instance of this class can be used to call stringify() and parse().
 * Typeson resolves cyclic references by default. Can also be extended to
 * support custom types using the register() method.
 *
 * @constructor
 * @param {{cyclic: boolean}} [options] - if cyclic (default true), cyclic references will be handled gracefully.
 */
function Typeson (options) {
    // Replacers signature: replace (value). Returns falsy if not replacing. Otherwise ['Date', value.getTime()]
    const plainObjectReplacers = [];
    const nonplainObjectReplacers = [];
    // Revivers: map {type => reviver}. Sample: {'Date': value => new Date(value)}
    const revivers = {};

    /** Types registered via register() */
    const regTypes = this.types = {};

    /** Serialize given object to Typeson.
     *
     * Arguments works identical to those of JSON.stringify().
     */
    const stringify = this.stringify = function (obj, replacer, space, opts) { // replacer here has nothing to do with our replacers.
        opts = Object.assign({}, options, opts, {stringification: true});
        const encapsulated = encapsulate(obj, null, opts);
        if (isArray(encapsulated)) {
            return JSON.stringify(encapsulated[0], replacer, space);
        }
        return encapsulated.then((res) => {
            return JSON.stringify(res, replacer, space);
        });
    };

    // Also sync but throws on non-sync result
    this.stringifySync = function (obj, replacer, space, opts) {
        return stringify(obj, replacer, space, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: true}));
    };
    this.stringifyAsync = function (obj, replacer, space, opts) {
        return stringify(obj, replacer, space, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: false}));
    };

    /** Parse Typeson back into an obejct.
     *
     * Arguments works identical to those of JSON.parse().
     */
    const parse = this.parse = function (text, reviver, opts) {
        opts = Object.assign({}, options, opts, {parse: true});
        return revive(JSON.parse(text, reviver), opts); // This reviver has nothing to do with our revivers.
    };

    // Also sync but throws on non-sync result
    this.parseSync = function (text, reviver, opts) {
        return parse(text, reviver, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: true})); // This reviver has nothing to do with our revivers.
    };
    this.parseAsync = function (text, reviver, opts) {
        return parse(text, reviver, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: false})); // This reviver has nothing to do with our revivers.
    };

    this.specialTypeNames = function (obj, stateObj, opts = {}) {
        opts.returnTypeNames = true;
        return this.encapsulate(obj, stateObj, opts);
    };
    this.rootTypeName = function (obj, stateObj, opts = {}) {
        opts.iterateNone = true;
        return this.encapsulate(obj, stateObj, opts);
    };

    /** Encapsulate a complex object into a plain Object by replacing registered types with
     * plain objects representing the types data.
     *
     * This method is used internally by Typeson.stringify().
     * @param {Object} obj - Object to encapsulate.
     */
    const encapsulate = this.encapsulate = function (obj, stateObj, opts) {
        opts = Object.assign({sync: true}, options, opts);
        const sync = opts.sync;
        const types = {},
            refObjs = [], // For checking cyclic references
            refKeys = [], // For checking cyclic references
            promisesDataRoot = [];
        // Clone the object deeply while at the same time replacing any special types or cyclic reference:
        const cyclic = opts && ('cyclic' in opts) ? opts.cyclic : true;
        const encapsulateObserver = opts.encapsulateObserver;
        const ret = _encapsulate('', obj, cyclic, stateObj || {}, promisesDataRoot);
        function finish (ret) {
            // Add $types to result only if we ever bumped into a special type (or special case where object has own `$types`)
            const typeNames = Object.values(types);
            if (opts.iterateNone) {
                if (typeNames.length) {
                    return typeNames[0];
                }
                return Typeson.getJSONType(ret);
            }
            if (typeNames.length) {
                if (opts.returnTypeNames) {
                    return [...new Set(typeNames)];
                }
                if (!ret || !isPlainObject(ret) || // Special if array (or a primitive) was serialized because JSON would ignore custom `$types` prop on it
                    ret.hasOwnProperty('$types') // Also need to handle if this is an object with its own `$types` property (to avoid ambiguity)
                ) {
                    ret = {$: ret, $types: {$: types}};
                } else {
                    ret.$types = types;
                }
            } else if (isObject(ret) && ret.hasOwnProperty('$types')) { // No special types
                ret = {$: ret, $types: true};
            }
            if (opts.returnTypeNames) {
                return false;
            }
            return ret;
        }
        function checkPromises (ret, promisesData) {
            return Promise.all(
                promisesData.map((pd) => { return pd[1].p; })
            ).then(function (promResults) {
                return Promise.all(
                    promResults.map(function (promResult) {
                        const newPromisesData = [];
                        const prData = promisesData.splice(0, 1)[0];
                        const [keyPath, , cyclic, stateObj, parentObj, key, detectedType] = prData;

                        const encaps = _encapsulate(keyPath, promResult, cyclic, stateObj, newPromisesData, true, detectedType);
                        const isTypesonPromise = hasConstructorOf(encaps, TypesonPromise);
                        if (keyPath && isTypesonPromise) { // Handle case where an embedded custom type itself returns a `Typeson.Promise`
                            return encaps.p.then(function (encaps2) {
                                parentObj[key] = encaps2;
                                return checkPromises(ret, newPromisesData);
                            });
                        }
                        if (keyPath) parentObj[key] = encaps;
                        else if (isTypesonPromise) {
                            ret = encaps.p;
                        } else ret = encaps; // If this is itself a `Typeson.Promise` (because the original value supplied was a promise or because the supplied custom type value resolved to one), returning it below will be fine since a promise is expected anyways given current config (and if not a promise, it will be ready as the resolve value)
                        return checkPromises(ret, newPromisesData);
                    })
                );
            }).then(() => ret);
        }        return promisesDataRoot.length
            ? sync && opts.throwOnBadSyncType
                ? (() => {
                    throw new TypeError('Sync method requested but async result obtained');
                })()
                : Promise.resolve(checkPromises(ret, promisesDataRoot)).then(finish)
            : !sync && opts.throwOnBadSyncType
                ? (() => {
                    throw new TypeError('Async method requested but sync result obtained');
                })()
                : (opts.stringification && sync // If this is a synchronous request for stringification, yet a promise is the result, we don't want to resolve leading to an async result, so we return an array to avoid ambiguity
                    ? [finish(ret)]
                    : (sync
                        ? finish(ret)
                        : Promise.resolve(finish(ret))
                    ));

        function _adaptBuiltinStateObjectProperties (stateObj, ownKeysObj, cb) {
            Object.assign(stateObj, ownKeysObj);
            const vals = internalStateObjPropsToIgnore.map((prop) => {
                const tmp = stateObj[prop];
                delete stateObj[prop];
                return tmp;
            });
            cb();
            internalStateObjPropsToIgnore.forEach((prop, i) => {
                stateObj[prop] = vals[i];
            });
        }
        function _encapsulate (keypath, value, cyclic, stateObj, promisesData, resolvingTypesonPromise, detectedType) {
            let ret;
            let observerData = {};
            const $typeof = typeof value;
            const runObserver = encapsulateObserver ? function (obj) {
                const type = detectedType || stateObj.type || (
                    Typeson.getJSONType(value)
                );
                encapsulateObserver(Object.assign(obj || observerData, {
                    keypath,
                    value,
                    cyclic,
                    stateObj,
                    promisesData,
                    resolvingTypesonPromise,
                    awaitingTypesonPromise: hasConstructorOf(value, TypesonPromise)
                }, type !== undefined ? {type} : {}));
            } : null;
            if ($typeof in {string: 1, boolean: 1, number: 1, undefined: 1}) {
                if (value === undefined || ($typeof === 'number' &&
                    (isNaN(value) || value === -Infinity || value === Infinity))) {
                    ret = replace(keypath, value, stateObj, promisesData, false, resolvingTypesonPromise, runObserver);
                    if (ret !== value) {
                        observerData = {replaced: ret};
                    }
                } else {
                    ret = value;
                }
                if (runObserver) runObserver();
                return ret;
            }
            if (value === null) {
                if (runObserver) runObserver();
                return value;
            }
            if (cyclic && !stateObj.iterateIn && !stateObj.iterateUnsetNumeric) {
                // Options set to detect cyclic references and be able to rewrite them.
                const refIndex = refObjs.indexOf(value);
                if (refIndex < 0) {
                    if (cyclic === true) {
                        refObjs.push(value);
                        refKeys.push(keypath);
                    }
                } else {
                    types[keypath] = '#';
                    if (runObserver) {
                        runObserver({
                            cyclicKeypath: refKeys[refIndex]
                        });
                    }
                    return '#' + refKeys[refIndex];
                }
            }
            const isPlainObj = isPlainObject(value);
            const isArr = isArray(value);
            const replaced = (
                ((isPlainObj || isArr) && (!plainObjectReplacers.length || stateObj.replaced)) ||
                stateObj.iterateIn // Running replace will cause infinite loop as will test positive again
            )
                // Optimization: if plain object and no plain-object replacers, don't try finding a replacer
                ? value
                : replace(keypath, value, stateObj, promisesData, isPlainObj || isArr, null, runObserver);
            let clone;
            if (replaced !== value) {
                ret = replaced;
                observerData = {replaced: replaced};
            } else {
                if (isArr || stateObj.iterateIn === 'array') {
                    clone = new Array(value.length);
                    observerData = {clone: clone};
                } else if (isPlainObj || stateObj.iterateIn === 'object') {
                    clone = {};
                    observerData = {clone: clone};
                } else if (keypath === '' && hasConstructorOf(value, TypesonPromise)) {
                    promisesData.push([keypath, value, cyclic, stateObj, undefined, undefined, stateObj.type]);
                    ret = value;
                } else {
                    ret = value; // Only clone vanilla objects and arrays
                }
            }
            if (runObserver) runObserver();

            if (opts.iterateNone) {
                return clone || ret;
            }

            if (!clone) {
                return ret;
            }

            // Iterate object or array
            if (stateObj.iterateIn) {
                for (const key in value) {
                    const ownKeysObj = {ownKeys: value.hasOwnProperty(key)};
                    _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, () => {
                        const kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);
                        const val = _encapsulate(kp, value[key], !!cyclic, stateObj, promisesData, resolvingTypesonPromise);
                        if (hasConstructorOf(val, TypesonPromise)) {
                            promisesData.push([kp, val, !!cyclic, stateObj, clone, key, stateObj.type]);
                        } else if (val !== undefined) clone[key] = val;
                    });
                }
                if (runObserver) runObserver({endIterateIn: true, end: true});
            } else { // Note: Non-indexes on arrays won't survive stringify so somewhat wasteful for arrays, but so too is iterating all numeric indexes on sparse arrays when not wanted or filtering own keys for positive integers
                keys(value).forEach(function (key) {
                    const kp = keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key);
                    const ownKeysObj = {ownKeys: true};
                    _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, () => {
                        const val = _encapsulate(kp, value[key], !!cyclic, stateObj, promisesData, resolvingTypesonPromise);
                        if (hasConstructorOf(val, TypesonPromise)) {
                            promisesData.push([kp, val, !!cyclic, stateObj, clone, key, stateObj.type]);
                        } else if (val !== undefined) clone[key] = val;
                    });
                });
                if (runObserver) runObserver({endIterateOwn: true, end: true});
            }
            // Iterate array for non-own numeric properties (we can't replace the prior loop though as it iterates non-integer keys)
            if (stateObj.iterateUnsetNumeric) {
                const vl = value.length;
                for (let i = 0; i < vl; i++) {
                    if (!(i in value)) {
                        const kp = keypath + (keypath ? '.' : '') + i; // No need to escape numeric
                        const ownKeysObj = {ownKeys: false};
                        _adaptBuiltinStateObjectProperties(stateObj, ownKeysObj, () => {
                            const val = _encapsulate(kp, undefined, !!cyclic, stateObj, promisesData, resolvingTypesonPromise);
                            if (hasConstructorOf(val, TypesonPromise)) {
                                promisesData.push([kp, val, !!cyclic, stateObj, clone, i, stateObj.type]);
                            } else if (val !== undefined) clone[i] = val;
                        });
                    }
                }
                if (runObserver) runObserver({endIterateUnsetNumeric: true, end: true});
            }
            return clone;
        }

        function replace (keypath, value, stateObj, promisesData, plainObject, resolvingTypesonPromise, runObserver) {
            // Encapsulate registered types
            const replacers = plainObject ? plainObjectReplacers : nonplainObjectReplacers;
            let i = replacers.length;
            while (i--) {
                const replacer = replacers[i];
                if (replacer.test(value, stateObj)) {
                    const type = replacer.type;
                    if (revivers[type]) {
                        // Record the type only if a corresponding reviver exists.
                        // This is to support specs where only replacement is done.
                        // For example ensuring deep cloning of the object, or
                        // replacing a type to its equivalent without the need to revive it.
                        const existing = types[keypath];
                        // type can comprise an array of types (see test shouldSupportIntermediateTypes)
                        types[keypath] = existing ? [type].concat(existing) : type;
                    }
                    // Now, also traverse the result in case it contains its own types to replace
                    Object.assign(stateObj, {type, replaced: true});
                    if ((sync || !replacer.replaceAsync) && !replacer.replace) {
                        if (runObserver) runObserver({typeDetected: true});
                        return _encapsulate(keypath, value, cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
                    }
                    if (runObserver) runObserver({replacing: true});

                    const replaceMethod = sync || !replacer.replaceAsync ? 'replace' : 'replaceAsync';
                    return _encapsulate(keypath, replacer[replaceMethod](value, stateObj), cyclic && 'readonly', stateObj, promisesData, resolvingTypesonPromise, type);
                }
            }
            return value;
        }
    };

    // Also sync but throws on non-sync result
    this.encapsulateSync = function (obj, stateObj, opts) {
        return encapsulate(obj, stateObj, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: true}));
    };
    this.encapsulateAsync = function (obj, stateObj, opts) {
        return encapsulate(obj, stateObj, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: false}));
    };

    /** Revive an encapsulated object.
     * This method is used internally by Typeson.parse().
     * @param {Object} obj - Object to revive. If it has $types member, the properties that are listed there
     * will be replaced with its true type instead of just plain objects.
     */
    const revive = this.revive = function (obj, opts) {
        opts = Object.assign({sync: true}, options, opts);
        const sync = opts.sync;
        let types = obj && obj.$types,
            ignore$Types = true;
        if (!types) return obj; // No type info added. Revival not needed.
        if (types === true) return obj.$; // Object happened to have own `$types` property but with no actual types, so we unescape and return that object
        if (types.$ && isPlainObject(types.$)) {
            // Special when root object is not a trivial Object, it will be encapsulated in $. It will also be encapsulated in $ if it has its own `$` property to avoid ambiguity
            obj = obj.$;
            types = types.$;
            ignore$Types = false;
        }
        const keyPathResolutions = [];
        const stateObj = {};
        let ret = _revive('', obj, null, opts);
        ret = hasConstructorOf(ret, Undefined) ? undefined : ret;
        return isThenable(ret)
            ? sync && opts.throwOnBadSyncType
                ? (() => {
                    throw new TypeError('Sync method requested but async result obtained');
                })()
                : ret
            : !sync && opts.throwOnBadSyncType
                ? (() => {
                    throw new TypeError('Async method requested but sync result obtained');
                })()
                : sync
                    ? ret
                    : Promise.resolve(ret);

        function _revive (keypath, value, target, opts, clone, key) {
            if (ignore$Types && keypath === '$types') return;
            const type = types[keypath];
            if (isArray(value) || isPlainObject(value)) {
                const clone = isArray(value) ? new Array(value.length) : {};
                // Iterate object or array
                keys(value).forEach((key) => {
                    const val = _revive(
                        keypath + (keypath ? '.' : '') + escapeKeyPathComponent(key), value[key],
                        target || clone,
                        opts,
                        clone,
                        key
                    );
                    if (hasConstructorOf(val, Undefined)) clone[key] = undefined;
                    else if (val !== undefined) clone[key] = val;
                });
                value = clone;
                while (keyPathResolutions.length) { // Try to resolve cyclic reference as soon as available
                    const [[target, keyPath, clone, key]] = keyPathResolutions;
                    const val = getByKeyPath(target, keyPath);
                    if (hasConstructorOf(val, Undefined)) clone[key] = undefined;
                    else if (val !== undefined) clone[key] = val;
                    else break;
                    keyPathResolutions.splice(0, 1);
                }
            }
            if (!type) return value;
            if (type === '#') {
                const ret = getByKeyPath(target, value.substr(1));
                if (ret === undefined) { // Cyclic reference not yet available
                    keyPathResolutions.push([target, value.substr(1), clone, key]);
                }
                return ret;
            }
            const sync = opts.sync;
            return [].concat(type).reduce((val, type) => {
                const reviver = revivers[type];
                if (!reviver) throw new Error('Unregistered type: ' + type);
                return reviver[ // eslint-disable-line standard/computed-property-even-spacing
                    sync && reviver.revive
                        ? 'revive'
                        : !sync && reviver.reviveAsync
                            ? 'reviveAsync'
                            : 'revive'
                ](val, stateObj);
            }, value);
        }
    };

    // Also sync but throws on non-sync result
    this.reviveSync = function (obj, opts) {
        return revive(obj, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: true}));
    };
    this.reviveAsync = function (obj, opts) {
        return revive(obj, Object.assign({}, {throwOnBadSyncType: true}, opts, {sync: false}));
    };

    /** Register types.
     * For examples how to use this method, see https://github.com/dfahlander/typeson-registry/tree/master/types
     * @param {Array.<Object.<string,Function[]>>} typeSpec - Types and their functions [test, encapsulate, revive];
     */
    this.register = function (typeSpecSets, opts) {
        opts = opts || {};
        [].concat(typeSpecSets).forEach(function R (typeSpec) {
            if (isArray(typeSpec)) return typeSpec.map(R); // Allow arrays of arrays of arrays...
            typeSpec && keys(typeSpec).forEach(function (typeId) {
                if (typeId === '#') {
                    throw new TypeError('# cannot be used as a type name as it is reserved for cyclic objects');
                } else if (Typeson.JSON_TYPES.includes(typeId)) {
                    throw new TypeError('Plain JSON object types are reserved as type names');
                }
                let spec = typeSpec[typeId];
                const replacers = spec.testPlainObjects ? plainObjectReplacers : nonplainObjectReplacers;
                const existingReplacer = replacers.filter(function (r) { return r.type === typeId; });
                if (existingReplacer.length) {
                    // Remove existing spec and replace with this one.
                    replacers.splice(replacers.indexOf(existingReplacer[0]), 1);
                    delete revivers[typeId];
                    delete regTypes[typeId];
                }
                if (spec) {
                    if (typeof spec === 'function') {
                        // Support registering just a class without replacer/reviver
                        const Class = spec;
                        spec = {
                            test: (x) => x && x.constructor === Class,
                            replace: (x) => assign({}, x),
                            revive: (x) => assign(Object.create(Class.prototype), x)
                        };
                    } else if (isArray(spec)) {
                        spec = {
                            test: spec[0],
                            replace: spec[1],
                            revive: spec[2]
                        };
                    }
                    const replacerObj = {
                        type: typeId,
                        test: spec.test.bind(spec)
                    };
                    if (spec.replace) {
                        replacerObj.replace = spec.replace.bind(spec);
                    }
                    if (spec.replaceAsync) {
                        replacerObj.replaceAsync = spec.replaceAsync.bind(spec);
                    }
                    const start = typeof opts.fallback === 'number' ? opts.fallback : (opts.fallback ? 0 : Infinity);
                    if (spec.testPlainObjects) {
                        plainObjectReplacers.splice(start, 0, replacerObj);
                    } else {
                        nonplainObjectReplacers.splice(start, 0, replacerObj);
                    }
                    // Todo: We might consider a testAsync type
                    if (spec.revive || spec.reviveAsync) {
                        const reviverObj = {};
                        if (spec.revive) reviverObj.revive = spec.revive.bind(spec);
                        if (spec.reviveAsync) reviverObj.reviveAsync = spec.reviveAsync.bind(spec);
                        revivers[typeId] = reviverObj;
                    }

                    regTypes[typeId] = spec; // Record to be retrieved via public types property.
                }
            });
        });
        return this;
    };
}

function assign (t, s) {
    keys(s).map((k) => { t[k] = s[k]; });
    return t;
}

/** escapeKeyPathComponent() utility */
function escapeKeyPathComponent (keyPathComponent) {
    return keyPathComponent.replace(/~/g, '~0').replace(/\./g, '~1');
}

/** unescapeKeyPathComponent() utility */
function unescapeKeyPathComponent (keyPathComponent) {
    return keyPathComponent.replace(/~1/g, '.').replace(/~0/g, '~');
}

/** getByKeyPath() utility */
function getByKeyPath (obj, keyPath) {
    if (keyPath === '') return obj;
    const period = keyPath.indexOf('.');
    if (period > -1) {
        const innerObj = obj[unescapeKeyPathComponent(keyPath.substr(0, period))];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return obj[unescapeKeyPathComponent(keyPath)];
}

// We keep these two functions minimized so if using two instances of this
//   library, where one is minimized and one is not, it will still work
function Undefined(){} // eslint-disable-line space-before-function-paren, space-before-blocks
// With ES6 classes, we may be able to simply use `class TypesonPromise extends Promise` and add a string tag for detection
function TypesonPromise(f){this.p=new Promise(f);} // eslint-disable-line block-spacing, space-before-function-paren, space-before-blocks, space-infix-ops, semi

TypesonPromise.prototype.then = function (onFulfilled, onRejected) {
    return new TypesonPromise((typesonResolve, typesonReject) => {
        this.p.then(function (res) {
            typesonResolve(onFulfilled ? onFulfilled(res) : res);
        }, (r) => {
            this.p['catch'](function (res) {
                return onRejected ? onRejected(res) : Promise.reject(res);
            }).then(typesonResolve, typesonReject);
        });
    });
};
TypesonPromise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
};
TypesonPromise.resolve = function (v) {
    return new TypesonPromise((typesonResolve) => {
        typesonResolve(v);
    });
};
TypesonPromise.reject = function (v) {
    return new TypesonPromise((typesonResolve, typesonReject) => {
        typesonReject(v);
    });
};
['all', 'race'].map(function (meth) {
    TypesonPromise[meth] = function (promArr) {
        return new TypesonPromise(function (typesonResolve, typesonReject) {
            Promise[meth](promArr.map((prom) => { return prom.p; })).then(typesonResolve, typesonReject);
        });
    };
});

// The following provide classes meant to avoid clashes with other values
Typeson.Undefined = Undefined; // To insist `undefined` should be added
Typeson.Promise = TypesonPromise; // To support async encapsulation/stringification

// Some fundamental type-checking utilities
Typeson.isThenable = isThenable;
Typeson.toStringTag = toStringTag;
Typeson.hasConstructorOf = hasConstructorOf;
Typeson.isObject = isObject;
Typeson.isPlainObject = isPlainObject;
Typeson.isUserObject = isUserObject;

Typeson.escapeKeyPathComponent = escapeKeyPathComponent;
Typeson.unescapeKeyPathComponent = unescapeKeyPathComponent;
Typeson.getByKeyPath = getByKeyPath;
Typeson.getJSONType = (value) =>
    value === null ? 'null' : (
        isArray(value)
            ? 'array'
            : typeof value);
Typeson.JSON_TYPES = [
    'null', 'boolean', 'number', 'string', 'array', 'object'
];

var structuredCloningThrowing = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function sliceIterator(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=e[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value), !t||n.length!==t);r=!0);}catch(e){i=!0, o=e;}finally{try{!r&&a.return&&a.return();}finally{if(i)throw o}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},r=Object.keys,i=Array.isArray,o={}.toString,s=Object.getPrototypeOf,a={}.hasOwnProperty,c=a.toString,u=["type","replaced","iterateIn","iterateUnsetNumeric"];function isThenable(e,t){return Typeson.isObject(e)&&"function"==typeof e.then&&(!t||"function"==typeof e.catch)}function toStringTag(e){return o.call(e).slice(8,-1)}function hasConstructorOf(t,n){if(!t||"object"!==(void 0===t?"undefined":e(t)))return!1;var r=s(t);if(!r)return!1;var i=a.call(r,"constructor")&&r.constructor;return"function"!=typeof i?null===n:"function"==typeof i&&null!==n&&c.call(i)===c.call(n)}function isPlainObject(e){return!(!e||"Object"!==toStringTag(e))&&(!s(e)||hasConstructorOf(e,Object))}function isObject(t){return t&&"object"===(void 0===t?"undefined":e(t))}function Typeson(o){var s=[],a=[],c={},f=this.types={},p=this.stringify=function(e,t,n,r){r=Object.assign({},o,r,{stringification:!0});var s=y(e,null,r);return i(s)?JSON.stringify(s[0],t,n):s.then(function(e){return JSON.stringify(e,t,n)})};this.stringifySync=function(e,t,n,r){return p(e,t,n,Object.assign({},{throwOnBadSyncType:!0},r,{sync:!0}))}, this.stringifyAsync=function(e,t,n,r){return p(e,t,n,Object.assign({},{throwOnBadSyncType:!0},r,{sync:!1}))};var l=this.parse=function(e,t,n){return n=Object.assign({},o,n,{parse:!0}), v(JSON.parse(e,t),n)};this.parseSync=function(e,t,n){return l(e,t,Object.assign({},{throwOnBadSyncType:!0},n,{sync:!0}))}, this.parseAsync=function(e,t,n){return l(e,t,Object.assign({},{throwOnBadSyncType:!0},n,{sync:!1}))}, this.specialTypeNames=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return n.returnTypeNames=!0, this.encapsulate(e,t,n)}, this.rootTypeName=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return n.iterateNone=!0, this.encapsulate(e,t,n)};var y=this.encapsulate=function(f,p,l){var y=(l=Object.assign({sync:!0},o,l)).sync,v={},d=[],h=[],b=[],g=!(l&&"cyclic"in l)||l.cyclic,m=l.encapsulateObserver,T=_encapsulate("",f,g,p||{},b);function finish(e){var t=Object.values(v);if(l.iterateNone)return t.length?t[0]:Typeson.getJSONType(e);if(t.length){if(l.returnTypeNames)return[].concat(n(new Set(t)));e&&isPlainObject(e)&&!e.hasOwnProperty("$types")?e.$types=v:e={$:e,$types:{$:v}};}else isObject(e)&&e.hasOwnProperty("$types")&&(e={$:e,$types:!0});return!l.returnTypeNames&&e}return b.length?y&&l.throwOnBadSyncType?function(){throw new TypeError("Sync method requested but async result obtained")}():Promise.resolve(function checkPromises(e,n){return Promise.all(n.map(function(e){return e[1].p})).then(function(r){return Promise.all(r.map(function(r){var i=[],o=n.splice(0,1)[0],s=t(o,7),a=s[0],c=s[2],u=s[3],f=s[4],p=s[5],l=s[6],y=_encapsulate(a,r,c,u,i,!0,l),v=hasConstructorOf(y,TypesonPromise);return a&&v?y.p.then(function(t){return f[p]=t, checkPromises(e,i)}):(a?f[p]=y:e=v?y.p:y, checkPromises(e,i))}))}).then(function(){return e})}(T,b)).then(finish):!y&&l.throwOnBadSyncType?function(){throw new TypeError("Async method requested but sync result obtained")}():l.stringification&&y?[finish(T)]:y?finish(T):Promise.resolve(finish(T));function _adaptBuiltinStateObjectProperties(e,t,n){Object.assign(e,t);var r=u.map(function(t){var n=e[t];return delete e[t], n});n(), u.forEach(function(t,n){e[t]=r[n];});}function _encapsulate(t,n,o,a,c,u,f){var p=void 0,y={},b=void 0===n?"undefined":e(n),g=m?function(e){var r=f||a.type||Typeson.getJSONType(n);m(Object.assign(e||y,{keypath:t,value:n,cyclic:o,stateObj:a,promisesData:c,resolvingTypesonPromise:u,awaitingTypesonPromise:hasConstructorOf(n,TypesonPromise)},void 0!==r?{type:r}:{}));}:null;if(b in{string:1,boolean:1,number:1,undefined:1})return void 0===n||"number"===b&&(isNaN(n)||n===-1/0||n===1/0)?(p=replace(t,n,a,c,!1,u,g))!==n&&(y={replaced:p}):p=n, g&&g(), p;if(null===n)return g&&g(), n;if(o&&!a.iterateIn&&!a.iterateUnsetNumeric){var T=d.indexOf(n);if(!(T<0))return v[t]="#", g&&g({cyclicKeypath:h[T]}), "#"+h[T];!0===o&&(d.push(n), h.push(t));}var O=isPlainObject(n),w=i(n),S=(O||w)&&(!s.length||a.replaced)||a.iterateIn?n:replace(t,n,a,c,O||w,null,g),P=void 0;if(S!==n?(p=S, y={replaced:S}):w||"array"===a.iterateIn?(P=new Array(n.length), y={clone:P}):O||"object"===a.iterateIn?y={clone:P={}}:""===t&&hasConstructorOf(n,TypesonPromise)?(c.push([t,n,o,a,void 0,void 0,a.type]), p=n):p=n, g&&g(), l.iterateNone)return P||p;if(!P)return p;if(a.iterateIn){var j=function _loop(e){var r={ownKeys:n.hasOwnProperty(e)};_adaptBuiltinStateObjectProperties(a,r,function(){var r=t+(t?".":"")+escapeKeyPathComponent(e),i=_encapsulate(r,n[e],!!o,a,c,u);hasConstructorOf(i,TypesonPromise)?c.push([r,i,!!o,a,P,e,a.type]):void 0!==i&&(P[e]=i);});};for(var A in n)j(A);g&&g({endIterateIn:!0,end:!0});}else r(n).forEach(function(e){var r=t+(t?".":"")+escapeKeyPathComponent(e);_adaptBuiltinStateObjectProperties(a,{ownKeys:!0},function(){var t=_encapsulate(r,n[e],!!o,a,c,u);hasConstructorOf(t,TypesonPromise)?c.push([r,t,!!o,a,P,e,a.type]):void 0!==t&&(P[e]=t);});}), g&&g({endIterateOwn:!0,end:!0});if(a.iterateUnsetNumeric){for(var C=n.length,N=function _loop2(e){if(!(e in n)){var r=t+(t?".":"")+e;_adaptBuiltinStateObjectProperties(a,{ownKeys:!1},function(){var t=_encapsulate(r,void 0,!!o,a,c,u);hasConstructorOf(t,TypesonPromise)?c.push([r,t,!!o,a,P,e,a.type]):void 0!==t&&(P[e]=t);});}},B=0;B<C;B++)N(B);g&&g({endIterateUnsetNumeric:!0,end:!0});}return P}function replace(e,t,n,r,i,o,u){for(var f=i?s:a,p=f.length;p--;){var l=f[p];if(l.test(t,n)){var d=l.type;if(c[d]){var h=v[e];v[e]=h?[d].concat(h):d;}return Object.assign(n,{type:d,replaced:!0}), !y&&l.replaceAsync||l.replace?(u&&u({replacing:!0}), _encapsulate(e,l[y||!l.replaceAsync?"replace":"replaceAsync"](t,n),g&&"readonly",n,r,o,d)):(u&&u({typeDetected:!0}), _encapsulate(e,t,g&&"readonly",n,r,o,d))}}return t}};this.encapsulateSync=function(e,t,n){return y(e,t,Object.assign({},{throwOnBadSyncType:!0},n,{sync:!0}))}, this.encapsulateAsync=function(e,t,n){return y(e,t,Object.assign({},{throwOnBadSyncType:!0},n,{sync:!1}))};var v=this.revive=function(e,n){var s=(n=Object.assign({sync:!0},o,n)).sync,a=e&&e.$types,u=!0;if(!a)return e;if(!0===a)return e.$;a.$&&isPlainObject(a.$)&&(e=e.$, a=a.$, u=!1);var f=[],p={},l=function _revive(e,n,o,s,l,y){if(u&&"$types"===e)return;var v=a[e];if(i(n)||isPlainObject(n)){var d=i(n)?new Array(n.length):{};for(r(n).forEach(function(t){var r=_revive(e+(e?".":"")+escapeKeyPathComponent(t),n[t],o||d,s,d,t);hasConstructorOf(r,Undefined)?d[t]=void 0:void 0!==r&&(d[t]=r);}), n=d;f.length;){var h=t(f[0],4),b=h[0],g=h[1],m=h[2],T=h[3],O=getByKeyPath(b,g);if(hasConstructorOf(O,Undefined))m[T]=void 0;else{if(void 0===O)break;m[T]=O;}f.splice(0,1);}}if(!v)return n;if("#"===v){var w=getByKeyPath(o,n.substr(1));return void 0===w&&f.push([o,n.substr(1),l,y]), w}var S=s.sync;return[].concat(v).reduce(function(e,t){var n=c[t];if(!n)throw new Error("Unregistered type: "+t);return n[S&&n.revive?"revive":!S&&n.reviveAsync?"reviveAsync":"revive"](e,p)},n)}("",e,null,n);return isThenable(l=hasConstructorOf(l,Undefined)?void 0:l)?s&&n.throwOnBadSyncType?function(){throw new TypeError("Sync method requested but async result obtained")}():l:!s&&n.throwOnBadSyncType?function(){throw new TypeError("Async method requested but sync result obtained")}():s?l:Promise.resolve(l)};this.reviveSync=function(e,t){return v(e,Object.assign({},{throwOnBadSyncType:!0},t,{sync:!0}))}, this.reviveAsync=function(e,t){return v(e,Object.assign({},{throwOnBadSyncType:!0},t,{sync:!1}))}, this.register=function(e,t){return t=t||{}, [].concat(e).forEach(function R(e){if(i(e))return e.map(R);e&&r(e).forEach(function(n){if("#"===n)throw new TypeError("# cannot be used as a type name as it is reserved for cyclic objects");if(Typeson.JSON_TYPES.includes(n))throw new TypeError("Plain JSON object types are reserved as type names");var r=e[n],o=r.testPlainObjects?s:a,u=o.filter(function(e){return e.type===n});if(u.length&&(o.splice(o.indexOf(u[0]),1), delete c[n], delete f[n]), r){if("function"==typeof r){var p=r;r={test:function test(e){return e&&e.constructor===p},replace:function replace(e){return assign({},e)},revive:function revive(e){return assign(Object.create(p.prototype),e)}};}else i(r)&&(r={test:r[0],replace:r[1],revive:r[2]});var l={type:n,test:r.test.bind(r)};r.replace&&(l.replace=r.replace.bind(r)), r.replaceAsync&&(l.replaceAsync=r.replaceAsync.bind(r));var y="number"==typeof t.fallback?t.fallback:t.fallback?0:1/0;if(r.testPlainObjects?s.splice(y,0,l):a.splice(y,0,l), r.revive||r.reviveAsync){var v={};r.revive&&(v.revive=r.revive.bind(r)), r.reviveAsync&&(v.reviveAsync=r.reviveAsync.bind(r)), c[n]=v;}f[n]=r;}});}), this};}function assign(e,t){return r(t).map(function(n){e[n]=t[n];}), e}function escapeKeyPathComponent(e){return e.replace(/~/g,"~0").replace(/\./g,"~1")}function unescapeKeyPathComponent(e){return e.replace(/~1/g,".").replace(/~0/g,"~")}function getByKeyPath(e,t){if(""===t)return e;var n=t.indexOf(".");if(n>-1){var r=e[unescapeKeyPathComponent(t.substr(0,n))];return void 0===r?void 0:getByKeyPath(r,t.substr(n+1))}return e[unescapeKeyPathComponent(t)]}function Undefined(){}function TypesonPromise(e){this.p=new Promise(e);}TypesonPromise.prototype.then=function(e,t){var n=this;return new TypesonPromise(function(r,i){n.p.then(function(t){r(e?e(t):t);},function(e){n.p.catch(function(e){return t?t(e):Promise.reject(e)}).then(r,i);});})}, TypesonPromise.prototype.catch=function(e){return this.then(null,e)}, TypesonPromise.resolve=function(e){return new TypesonPromise(function(t){t(e);})}, TypesonPromise.reject=function(e){return new TypesonPromise(function(t,n){n(e);})}, ["all","race"].map(function(e){TypesonPromise[e]=function(t){return new TypesonPromise(function(n,r){Promise[e](t.map(function(e){return e.p})).then(n,r);})};}), Typeson.Undefined=Undefined, Typeson.Promise=TypesonPromise, Typeson.isThenable=isThenable, Typeson.toStringTag=toStringTag, Typeson.hasConstructorOf=hasConstructorOf, Typeson.isObject=isObject, Typeson.isPlainObject=isPlainObject, Typeson.isUserObject=function isUserObject(e){if(!e||"Object"!==toStringTag(e))return!1;var t=s(e);return!t||hasConstructorOf(e,Object)||isUserObject(t)}, Typeson.escapeKeyPathComponent=escapeKeyPathComponent, Typeson.unescapeKeyPathComponent=unescapeKeyPathComponent, Typeson.getByKeyPath=getByKeyPath, Typeson.getJSONType=function(t){return null===t?"null":i(t)?"array":void 0===t?"undefined":e(t)}, Typeson.JSON_TYPES=["null","boolean","number","string","array","object"];for(var f={userObject:{test:function test(e,t){return Typeson.isUserObject(e)},replace:function replace(e){return Object.assign({},e)},revive:function revive(e){return e}}},p=[[{sparseArrays:{testPlainObjects:!0,test:function test(e){return Array.isArray(e)},replace:function replace(e,t){return t.iterateUnsetNumeric=!0, e}}},{sparseUndefined:{test:function test(e,t){return void 0===e&&!1===t.ownKeys},replace:function replace(e){return null},revive:function revive(e){}}}],{undef:{test:function test(e,t){return void 0===e&&(t.ownKeys||!("ownKeys"in t))},replace:function replace(e){return null},revive:function revive(e){return new Typeson.Undefined}}}],l={StringObject:{test:function test(t){return"String"===Typeson.toStringTag(t)&&"object"===(void 0===t?"undefined":e(t))},replace:function replace(e){return String(e)},revive:function revive(e){return new String(e)}},BooleanObject:{test:function test(t){return"Boolean"===Typeson.toStringTag(t)&&"object"===(void 0===t?"undefined":e(t))},replace:function replace(e){return Boolean(e)},revive:function revive(e){return new Boolean(e)}},NumberObject:{test:function test(t){return"Number"===Typeson.toStringTag(t)&&"object"===(void 0===t?"undefined":e(t))},replace:function replace(e){return Number(e)},revive:function revive(e){return new Number(e)}}},y=[{nan:{test:function test(e){return"number"==typeof e&&isNaN(e)},replace:function replace(e){return"NaN"},revive:function revive(e){return NaN}}},{infinity:{test:function test(e){return e===1/0},replace:function replace(e){return"Infinity"},revive:function revive(e){return 1/0}}},{negativeInfinity:{test:function test(e){return e===-1/0},replace:function replace(e){return"-Infinity"},revive:function revive(e){return-1/0}}}],v={date:{test:function test(e){return"Date"===Typeson.toStringTag(e)},replace:function replace(e){var t=e.getTime();return isNaN(t)?"NaN":t},revive:function revive(e){return"NaN"===e?new Date(NaN):new Date(e)}}},d={regexp:{test:function test(e){return"RegExp"===Typeson.toStringTag(e)},replace:function replace(e){return{source:e.source,flags:(e.global?"g":"")+(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.sticky?"y":"")+(e.unicode?"u":"")}},revive:function revive(e){var t=e.source,n=e.flags;return new RegExp(t,n)}}},h={map:{test:function test(e){return"Map"===Typeson.toStringTag(e)},replace:function replace(e){return Array.from(e.entries())},revive:function revive(e){return new Map(e)}}},b={set:{test:function test(e){return"Set"===Typeson.toStringTag(e)},replace:function replace(e){return Array.from(e.values())},revive:function revive(e){return new Set(e)}}},g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",m=new Uint8Array(256),T=0;T<g.length;T++)m[g.charCodeAt(T)]=T;var O=function encode(e,t,n){for(var r=new Uint8Array(e,t,n),i=r.length,o="",s=0;s<i;s+=3)o+=g[r[s]>>2], o+=g[(3&r[s])<<4|r[s+1]>>4], o+=g[(15&r[s+1])<<2|r[s+2]>>6], o+=g[63&r[s+2]];return i%3==2?o=o.substring(0,o.length-1)+"=":i%3==1&&(o=o.substring(0,o.length-2)+"=="), o},w=function decode(e){var t=e.length,n=.75*e.length,r=0,i=void 0,o=void 0,s=void 0,a=void 0;"="===e[e.length-1]&&(n--, "="===e[e.length-2]&&n--);for(var c=new ArrayBuffer(n),u=new Uint8Array(c),f=0;f<t;f+=4)i=m[e.charCodeAt(f)], o=m[e.charCodeAt(f+1)], s=m[e.charCodeAt(f+2)], a=m[e.charCodeAt(f+3)], u[r++]=i<<2|o>>4, u[r++]=(15&o)<<4|s>>2, u[r++]=(3&s)<<6|63&a;return c},S={arraybuffer:{test:function test(e){return"ArrayBuffer"===Typeson.toStringTag(e)},replace:function replace(e,t){t.buffers||(t.buffers=[]);var n=t.buffers.indexOf(e);return n>-1?{index:n}:(t.buffers.push(e), O(e))},revive:function revive(t,n){if(n.buffers||(n.buffers=[]), "object"===(void 0===t?"undefined":e(t)))return n.buffers[t.index];var r=w(t);return n.buffers.push(r), r}}},P="undefined"==typeof self?commonjsGlobal:self,j={};["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"].forEach(function(e){var t=e,n=P[t];n&&(j[e.toLowerCase()]={test:function test(e){return Typeson.toStringTag(e)===t},replace:function replace(e,t){var n=e.buffer,r=e.byteOffset,i=e.length;t.buffers||(t.buffers=[]);var o=t.buffers.indexOf(n);return o>-1?{index:o,byteOffset:r,length:i}:(t.buffers.push(n), {encoded:O(n),byteOffset:r,length:i})},revive:function revive(e,t){t.buffers||(t.buffers=[]);var r=e.byteOffset,i=e.length,o=e.encoded,s=e.index,a=void 0;return"index"in e?a=t.buffers[s]:(a=w(o), t.buffers.push(a)), new n(a,r,i)}});});var A={dataview:{test:function test(e){return"DataView"===Typeson.toStringTag(e)},replace:function replace(e,t){var n=e.buffer,r=e.byteOffset,i=e.byteLength;t.buffers||(t.buffers=[]);var o=t.buffers.indexOf(n);return o>-1?{index:o,byteOffset:r,byteLength:i}:(t.buffers.push(n), {encoded:O(n),byteOffset:r,byteLength:i})},revive:function revive(e,t){t.buffers||(t.buffers=[]);var n=e.byteOffset,r=e.byteLength,i=e.encoded,o=e.index,s=void 0;return"index"in e?s=t.buffers[o]:(s=w(i), t.buffers.push(s)), new DataView(s,n,r)}}},C={IntlCollator:{test:function test(e){return Typeson.hasConstructorOf(e,Intl.Collator)},replace:function replace(e){return e.resolvedOptions()},revive:function revive(e){return new Intl.Collator(e.locale,e)}},IntlDateTimeFormat:{test:function test(e){return Typeson.hasConstructorOf(e,Intl.DateTimeFormat)},replace:function replace(e){return e.resolvedOptions()},revive:function revive(e){return new Intl.DateTimeFormat(e.locale,e)}},IntlNumberFormat:{test:function test(e){return Typeson.hasConstructorOf(e,Intl.NumberFormat)},replace:function replace(e){return e.resolvedOptions()},revive:function revive(e){return new Intl.NumberFormat(e.locale,e)}}},N={file:{test:function test(e){return"File"===Typeson.toStringTag(e)},replace:function replace(e){var t=new XMLHttpRequest;if(t.open("GET",URL.createObjectURL(e),!1), 200!==t.status&&0!==t.status)throw new Error("Bad Blob access: "+t.status);return t.send(), {type:e.type,stringContents:t.responseText,name:e.name,lastModified:e.lastModified}},revive:function revive(e){var t=e.name,n=e.type,r=e.stringContents,i=e.lastModified;return new File([r],t,{type:n,lastModified:i})},replaceAsync:function replaceAsync(e){return new Typeson.Promise(function(t,n){if(e.isClosed)n(new Error("The File is closed"));else{var r=new FileReader;r.addEventListener("load",function(){t({type:e.type,stringContents:r.result,name:e.name,lastModified:e.lastModified});}), r.addEventListener("error",function(){n(r.error);}), r.readAsText(e);}})}}};return[f,p,l,y,v,d,{imagedata:{test:function test(e){return"ImageData"===Typeson.toStringTag(e)},replace:function replace(e){return{array:Array.from(e.data),width:e.width,height:e.height}},revive:function revive(e){return new ImageData(new Uint8ClampedArray(e.array),e.width,e.height)}}},{imagebitmap:{test:function test(e){return"ImageBitmap"===Typeson.toStringTag(e)||e&&e.dataset&&"ImageBitmap"===e.dataset.toStringTag},replace:function replace(e){var t=document.createElement("canvas");return t.getContext("2d").drawImage(e,0,0), t.toDataURL()},revive:function revive(e){var t=document.createElement("canvas"),n=t.getContext("2d"),r=document.createElement("img");return r.onload=function(){n.drawImage(r,0,0);}, r.src=e, t},reviveAsync:function reviveAsync(e){var t=document.createElement("canvas"),n=t.getContext("2d"),r=document.createElement("img");return r.onload=function(){n.drawImage(r,0,0);}, r.src=e, createImageBitmap(t)}}},N,{file:N.file,filelist:{test:function test(e){return"FileList"===Typeson.toStringTag(e)},replace:function replace(e){for(var t=[],n=0;n<e.length;n++)t[n]=e.item(n);return t},revive:function revive(e){function FileList(){this._files=arguments[0], this.length=this._files.length;}return FileList.prototype.item=function(e){return this._files[e]}, FileList.prototype[Symbol.toStringTag]="FileList", new FileList(e)}}},{blob:{test:function test(e){return"Blob"===Typeson.toStringTag(e)},replace:function replace(e){var t=new XMLHttpRequest;if(t.open("GET",URL.createObjectURL(e),!1), 200!==t.status&&0!==t.status)throw new Error("Bad Blob access: "+t.status);return t.send(), {type:e.type,stringContents:t.responseText}},revive:function revive(e){var t=e.type,n=e.stringContents;return new Blob([n],{type:t})},replaceAsync:function replaceAsync(e){return new Typeson.Promise(function(t,n){if(e.isClosed)n(new Error("The Blob is closed"));else{var r=new FileReader;r.addEventListener("load",function(){t({type:e.type,stringContents:r.result});}), r.addEventListener("error",function(){n(r.error);}), r.readAsText(e);}})}}}].concat("function"==typeof Map?h:[],"function"==typeof Set?b:[],"function"==typeof ArrayBuffer?S:[],"function"==typeof Uint8Array?j:[],"function"==typeof DataView?A:[],"undefined"!=typeof Intl?C:[]).concat({checkDataCloneException:[function(t){var n={}.toString.call(t).slice(8,-1);if(["symbol","function"].includes(void 0===t?"undefined":e(t))||["Arguments","Module","Error","Promise","WeakMap","WeakSet"].includes(n)||t===Object.prototype||("Blob"===n||"File"===n)&&t.isClosed||t&&"object"===(void 0===t?"undefined":e(t))&&"number"==typeof t.nodeType&&"function"==typeof t.insertBefore)throw new DOMException("The object cannot be cloned.","DataCloneError");return!1}]})});

});

// Todo: Register `ImageBitmap` and add `Blob`/`File`/`FileList`
// Todo: add a proper polyfill for `ImageData` using node-canvas
// See also: http://stackoverflow.com/questions/42170826/categories-for-rejection-by-the-structured-cloning-algorithm

function traverseMapToRevertToLegacyTypeNames (obj) {
    if (Array.isArray(obj)) {
        return obj.forEach(traverseMapToRevertToLegacyTypeNames);
    }
    if (obj && typeof obj === 'object') { // Should be all
        Object.entries(obj).forEach(([prop, val]) => {
            if (prop in newTypeNamesToLegacy) {
                const legacyProp = newTypeNamesToLegacy[prop];
                delete obj[prop];
                obj[legacyProp] = val;
            }
        });
    }
}

const structuredCloning = structuredCloningThrowing;
const newTypeNamesToLegacy = {
    IntlCollator: 'Intl.Collator',
    IntlDateTimeFormat: 'Intl.DateTimeFormat',
    IntlNumberFormat: 'Intl.NumberFormat',
    userObject: 'userObjects',
    undef: 'undefined',
    negativeInfinity: 'NegativeInfinity',
    nonbuiltinIgnore: 'nonBuiltInIgnore',
    arraybuffer: 'ArrayBuffer',
    blob: 'Blob',
    dataview: 'DataView',
    date: 'Date',
    error: 'Error',
    file: 'File',
    filelist: 'FileList',
    imagebitmap: 'ImageBitmap',
    imagedata: 'ImageData',
    infinity: 'Infinity',
    map: 'Map',
    nan: 'NaN',
    regexp: 'RegExp',
    set: 'Set',
    int8array: 'Int8Array',
    uint8array: 'Uint8Array',
    uint8clampedarray: 'Uint8ClampedArray',
    int16array: 'Int16Array',
    uint16array: 'Uint16Array',
    int32array: 'Int32Array',
    uint32array: 'Uint32Array',
    float32array: 'Float32Array',
    float64array: 'Float64Array'
};

// Todo: We should make this conditional on CONFIG and deprecate the legacy
//   names, but for compatibility with data created under this major version,
//   we need the legacy now

// console.log('StructuredCloning1', JSON.stringify(structuredCloning));
traverseMapToRevertToLegacyTypeNames(structuredCloning);
// console.log('StructuredCloning2', JSON.stringify(structuredCloning));

const typeson = new Typeson().register(structuredCloning);

// We are keeping the callback approach for now in case we wish to reexpose Blob, File, FileList
function encode$1 (obj, cb) {
    let ret;
    try {
        ret = typeson.stringifySync(obj);
    } catch (err) {
        // SCA in typeson-registry using `DOMException` which is not defined (e.g., in Node)
        if (Typeson.hasConstructorOf(err, ReferenceError) ||
            // SCA in typeson-registry threw a cloning error and we are in a
            //   supporting environment (e.g., the browser) where `ShimDOMException` is
            //   an alias for `DOMException`; if typeson-registry ever uses our shim
            //   to throw, we can use this condition alone.
            Typeson.hasConstructorOf(err, ShimDOMException$1)) {
            throw createDOMException('DataCloneError', 'The object cannot be cloned.');
        }
        // We should rethrow non-cloning exceptions like from
        //  throwing getters (as in the W3C test, key-conversion-exceptions.htm)
        throw err;
    }
    if (cb) cb(ret);
    return ret;
}

function decode$1 (obj) {
    return typeson.parse(obj);
}

function clone$1 (val) {
    // We don't return the intermediate `encode` as we'll need to reencode the clone as it may differ
    return decode$1(encode$1(val));
}

var Sca = /*#__PURE__*/Object.freeze({
	encode: encode$1,
	decode: decode$1,
	clone: clone$1
});

const readonlyProperties$4 = ['objectStore', 'keyPath', 'multiEntry', 'unique'];

/**
 * IDB Index
 * http://www.w3.org/TR/IndexedDB/#idl-def-IDBIndex
 * @param {IDBObjectStore} store
 * @param {IDBIndexProperties} indexProperties
 * @constructor
 */
function IDBIndex () {
    throw new TypeError('Illegal constructor');
}
const IDBIndexAlias = IDBIndex;
IDBIndex.__createInstance = function (store, indexProperties) {
    function IDBIndex () {
        const me = this;
        me[Symbol.toStringTag] = 'IDBIndex';
        defineReadonlyProperties(me, readonlyProperties$4);
        me.__objectStore = store;
        me.__name = me.__originalName = indexProperties.columnName;
        me.__keyPath = Array.isArray(indexProperties.keyPath) ? indexProperties.keyPath.slice() : indexProperties.keyPath;
        const optionalParams = indexProperties.optionalParams;
        me.__multiEntry = !!(optionalParams && optionalParams.multiEntry);
        me.__unique = !!(optionalParams && optionalParams.unique);
        me.__deleted = !!indexProperties.__deleted;
        me.__objectStore.__cursors = indexProperties.cursors || [];
        Object.defineProperty(me, '__currentName', {
            get: function () {
                return '__pendingName' in me ? me.__pendingName : me.name;
            }
        });
        Object.defineProperty(me, 'name', {
            enumerable: false,
            configurable: false,
            get: function () {
                return this.__name;
            },
            set: function (newName) {
                const me = this;
                newName = convertToDOMString(newName);
                const oldName = me.name;
                IDBTransaction.__assertVersionChange(me.objectStore.transaction);
                IDBTransaction.__assertActive(me.objectStore.transaction);
                IDBIndexAlias.__invalidStateIfDeleted(me);
                IDBObjectStore.__invalidStateIfDeleted(me);
                if (newName === oldName) {
                    return;
                }

                if (me.objectStore.__indexes[newName] && !me.objectStore.__indexes[newName].__deleted &&
                    !me.objectStore.__indexes[newName].__pendingDelete) {
                    throw createDOMException('ConstraintError', 'Index "' + newName + '" already exists on ' + me.objectStore.__currentName);
                }

                me.__name = newName;

                const objectStore = me.objectStore;
                delete objectStore.__indexes[oldName];
                objectStore.__indexes[newName] = me;
                objectStore.indexNames.splice(objectStore.indexNames.indexOf(oldName), 1, newName);

                const storeHandle = objectStore.transaction.__storeHandles[objectStore.name];
                const oldIndexHandle = storeHandle.__indexHandles[oldName];
                oldIndexHandle.__name = newName; // Fix old references
                storeHandle.__indexHandles[newName] = oldIndexHandle; // Ensure new reference accessible
                me.__pendingName = oldName;

                const colInfoToPreserveArr = [
                    ['key', 'BLOB ' + (objectStore.autoIncrement ? 'UNIQUE, inc INTEGER PRIMARY KEY AUTOINCREMENT' : 'PRIMARY KEY')],
                    ['value', 'BLOB']
                ].concat(
                    [...objectStore.indexNames]
                        .filter((indexName) => indexName !== newName)
                        .map((indexName) => [escapeIndexNameForSQL(indexName), 'BLOB'])
                );

                me.__renameIndex(objectStore, oldName, newName, colInfoToPreserveArr, function (tx, success) {
                    IDBIndexAlias.__updateIndexList(store, tx, function (store) {
                        delete storeHandle.__pendingName;
                        success(store);
                    });
                });
            }
        });
    }
    IDBIndex.prototype = IDBIndexAlias.prototype;
    return new IDBIndex();
};

IDBIndex.__invalidStateIfDeleted = function (index, msg) {
    if (index.__deleted || index.__pendingDelete || (
        index.__pendingCreate && index.objectStore.transaction && index.objectStore.transaction.__errored
    )) {
        throw createDOMException('InvalidStateError', msg || 'This index has been deleted');
    }
};

/**
 * Clones an IDBIndex instance for a different IDBObjectStore instance.
 * @param {IDBIndex} index
 * @param {IDBObjectStore} store
 * @protected
 */
IDBIndex.__clone = function (index, store) {
    const idx = IDBIndex.__createInstance(store, {
        columnName: index.name,
        keyPath: index.keyPath,
        optionalParams: {
            multiEntry: index.multiEntry,
            unique: index.unique
        }
    });
    ['__pendingCreate', '__pendingDelete', '__deleted', '__originalName', '__recreated'].forEach((p) => {
        idx[p] = index[p];
    });
    return idx;
};

/**
 * Creates a new index on an object store.
 * @param {IDBObjectStore} store
 * @param {IDBIndex} index
 * @returns {IDBIndex}
 * @protected
 */
IDBIndex.__createIndex = function (store, index) {
    const indexName = index.name;
    const storeName = store.__currentName;
    const idx = store.__indexes[indexName];

    index.__pendingCreate = true;

    // Add the index to the IDBObjectStore
    store.indexNames.push(indexName);
    store.__indexes[indexName] = index; // We add to indexes as needs to be available, e.g., if there is a subsequent deleteIndex call

    let indexHandle = store.__indexHandles[indexName];
    if (!indexHandle ||
        index.__pendingDelete ||
        index.__deleted ||
        indexHandle.__pendingDelete ||
        indexHandle.__deleted
    ) {
        indexHandle = store.__indexHandles[indexName] = IDBIndex.__clone(index, store);
    }

    // Create the index in WebSQL
    const transaction = store.transaction;
    transaction.__addNonRequestToTransactionQueue(function createIndex (tx, args, success, failure) {
        const columnExists = idx && (idx.__deleted || idx.__recreated); // This check must occur here rather than earlier as properties may not have been set yet otherwise
        let indexValues = {};

        function error (tx, err) {
            failure(createDOMException('UnknownError', 'Could not create index "' + indexName + '"' + err.code + '::' + err.message, err));
        }

        function applyIndex (tx) {
            // Update the object store's index list
            IDBIndex.__updateIndexList(store, tx, function () {
                // Add index entries for all existing records
                tx.executeSql('SELECT "key", "value" FROM ' + escapeStoreNameForSQL(storeName), [], function (tx, data) {
                    CFG.DEBUG && console.log('Adding existing ' + storeName + ' records to the ' + indexName + ' index');
                    addIndexEntry(0);

                    function addIndexEntry (i) {
                        if (i < data.rows.length) {
                            try {
                                const value = decode$1(unescapeSQLiteResponse(data.rows.item(i).value));
                                let indexKey = extractKeyValueDecodedFromValueUsingKeyPath(value, index.keyPath, index.multiEntry); // Todo: Do we need this stricter error checking?
                                if (indexKey.invalid || indexKey.failure) { // Todo: Do we need invalid checks and should we instead treat these as being duplicates?
                                    throw new Error('Go to catch; ignore bad indexKey');
                                }
                                indexKey = encode(indexKey.value, index.multiEntry);
                                if (index.unique) {
                                    if (indexValues[indexKey]) {
                                        indexValues = {};
                                        failure(createDOMException(
                                            'ConstraintError',
                                            'Duplicate values already exist within the store'
                                        ));
                                        return;
                                    }
                                    indexValues[indexKey] = true;
                                }

                                tx.executeSql(
                                    'UPDATE ' + escapeStoreNameForSQL(storeName) + ' SET ' +
                                        escapeIndexNameForSQL(indexName) + ' = ? WHERE "key" = ?',
                                    [escapeSQLiteStatement(indexKey), data.rows.item(i).key],
                                    function (tx, data) {
                                        addIndexEntry(i + 1);
                                    }, error
                                );
                            } catch (e) {
                                // Not a valid value to insert into index, so just continue
                                addIndexEntry(i + 1);
                            }
                        } else {
                            delete index.__pendingCreate;
                            delete indexHandle.__pendingCreate;
                            if (index.__deleted) {
                                delete index.__deleted;
                                delete indexHandle.__deleted;
                                index.__recreated = true;
                                indexHandle.__recreated = true;
                            }
                            indexValues = {};
                            success(store);
                        }
                    }
                }, error);
            }, error);
        }

        const escapedStoreNameSQL = escapeStoreNameForSQL(storeName);
        const escapedIndexNameSQL = escapeIndexNameForSQL(index.name);

        function addIndexSQL (tx) {
            if (!CFG.useSQLiteIndexes) {
                applyIndex(tx);
                return;
            }
            tx.executeSql(
                'CREATE INDEX IF NOT EXISTS "' +
                    // The escaped index name must be unique among indexes in the whole database;
                    //    so we prefix with store name; as prefixed, will also not conflict with
                    //    index on `key`
                    // Avoid quotes and separate with special escape sequence
                    escapedStoreNameSQL.slice(1, -1) + '^5' + escapedIndexNameSQL.slice(1, -1) +
                    '" ON ' + escapedStoreNameSQL + '(' + escapedIndexNameSQL + ')',
                [],
                applyIndex,
                error
            );
        }

        if (columnExists) {
            // For a previously existing index, just update the index entries in the existing column;
            //   no need to add SQLite index to it either as should already exist
            applyIndex(tx);
        } else {
            // For a new index, add a new column to the object store, then apply the index
            const sql = ['ALTER TABLE', escapedStoreNameSQL, 'ADD', escapedIndexNameSQL, 'BLOB'].join(' ');
            CFG.DEBUG && console.log(sql);
            tx.executeSql(sql, [], addIndexSQL, error);
        }
    }, undefined, store);
};

/**
 * Deletes an index from an object store.
 * @param {IDBObjectStore} store
 * @param {IDBIndex} index
 * @protected
 */
IDBIndex.__deleteIndex = function (store, index) {
    // Remove the index from the IDBObjectStore
    index.__pendingDelete = true;
    const indexHandle = store.__indexHandles[index.name];
    if (indexHandle) {
        indexHandle.__pendingDelete = true;
    }

    store.indexNames.splice(store.indexNames.indexOf(index.name), 1);

    // Remove the index in WebSQL
    const transaction = store.transaction;
    transaction.__addNonRequestToTransactionQueue(function deleteIndex (tx, args, success, failure) {
        function error (tx, err) {
            failure(createDOMException('UnknownError', 'Could not delete index "' + index.name + '"', err));
        }

        function finishDeleteIndex () {
            // Update the object store's index list
            IDBIndex.__updateIndexList(store, tx, function (store) {
                delete index.__pendingDelete;
                delete index.__recreated;
                index.__deleted = true;
                if (indexHandle) {
                    indexHandle.__deleted = true;
                    delete indexHandle.__pendingDelete;
                }
                success(store);
            }, error);
        }

        if (!CFG.useSQLiteIndexes) {
            finishDeleteIndex();
            return;
        }
        tx.executeSql(
            'DROP INDEX IF EXISTS ' +
                sqlQuote(
                    escapeStoreNameForSQL(store.name).slice(1, -1) + '^5' +
                    escapeIndexNameForSQL(index.name).slice(1, -1)
                ),
            [],
            finishDeleteIndex,
            error
        );
    }, undefined, store);
};

/**
 * Updates index list for the given object store.
 * @param {IDBObjectStore} store
 * @param {object} tx
 * @param {function} success
 * @param {function} failure
 */
IDBIndex.__updateIndexList = function (store, tx, success, failure) {
    const indexList = {};
    for (let i = 0; i < store.indexNames.length; i++) {
        const idx = store.__indexes[store.indexNames[i]];
        /** @type {IDBIndexProperties} **/
        indexList[idx.name] = {
            columnName: idx.name,
            keyPath: idx.keyPath,
            optionalParams: {
                unique: idx.unique,
                multiEntry: idx.multiEntry
            },
            deleted: !!idx.deleted
        };
    }

    CFG.DEBUG && console.log('Updating the index list for ' + store.__currentName, indexList);
    tx.executeSql('UPDATE __sys__ SET "indexList" = ? WHERE "name" = ?', [JSON.stringify(indexList), escapeSQLiteStatement(store.__currentName)], function () {
        success(store);
    }, failure);
};

/**
 * Retrieves index data for the given key
 * @param {*|IDBKeyRange} range
 * @param {string} opType
 * @param {boolean} nullDisallowed
 * @param {number} count
 * @returns {IDBRequest}
 * @private
 */
IDBIndex.prototype.__fetchIndexData = function (range, opType, nullDisallowed, count) {
    const me = this;
    if (count !== undefined) {
        count = enforceRange(count, 'unsigned long');
    }

    IDBIndex.__invalidStateIfDeleted(me);
    IDBObjectStore.__invalidStateIfDeleted(me.objectStore);
    if (me.objectStore.__deleted) {
        throw createDOMException('InvalidStateError', "This index's object store has been deleted");
    }
    IDBTransaction.__assertActive(me.objectStore.transaction);

    if (nullDisallowed && range == null) {
        throw createDOMException('DataError', 'No key or range was specified');
    }

    const fetchArgs = buildFetchIndexDataSQL(nullDisallowed, me, range, opType, false);
    return me.objectStore.transaction.__addToTransactionQueue(function (...args) {
        executeFetchIndexData(count, ...fetchArgs, ...args);
    }, undefined, me);
};

/**
 * Opens a cursor over the given key range.
 * @param {*|IDBKeyRange} query
 * @param {string} direction
 * @returns {IDBRequest}
 */
IDBIndex.prototype.openCursor = function (/* query, direction */) {
    const me = this;
    const [query, direction] = arguments;
    const cursor = IDBCursorWithValue.__createInstance(query, direction, me.objectStore, me, escapeIndexNameForSQLKeyColumn(me.name), 'value');
    me.__objectStore.__cursors.push(cursor);
    return cursor.__req;
};

/**
 * Opens a cursor over the given key range.  The cursor only includes key values, not data.
 * @param {*|IDBKeyRange} query
 * @param {string} direction
 * @returns {IDBRequest}
 */
IDBIndex.prototype.openKeyCursor = function (/* query, direction */) {
    const me = this;
    const [query, direction] = arguments;
    const cursor = IDBCursor.__createInstance(query, direction, me.objectStore, me, escapeIndexNameForSQLKeyColumn(me.name), 'key');
    me.__objectStore.__cursors.push(cursor);
    return cursor.__req;
};

IDBIndex.prototype.get = function (query) {
    if (!arguments.length) { // Per https://heycam.github.io/webidl/
        throw new TypeError('A parameter was missing for `IDBIndex.get`.');
    }
    return this.__fetchIndexData(query, 'value', true);
};

IDBIndex.prototype.getKey = function (query) {
    if (!arguments.length) { // Per https://heycam.github.io/webidl/
        throw new TypeError('A parameter was missing for `IDBIndex.getKey`.');
    }
    return this.__fetchIndexData(query, 'key', true);
};

IDBIndex.prototype.getAll = function (/* query, count */) {
    const [query, count] = arguments;
    return this.__fetchIndexData(query, 'value', false, count);
};

IDBIndex.prototype.getAllKeys = function (/* query, count */) {
    const [query, count] = arguments;
    return this.__fetchIndexData(query, 'key', false, count);
};

IDBIndex.prototype.count = function (/* query */) {
    const me = this;
    const query = arguments[0];
    // With the exception of needing to check whether the index has been
    //  deleted, we could, for greater spec parity (if not accuracy),
    //  just call:
    //  `return me.__objectStore.count(query);`

    if (instanceOf(query, IDBKeyRange$1)) { // Todo: Do we need this block?
        // We don't need to add to cursors array since has the count parameter which won't cache
        return IDBCursorWithValue.__createInstance(query, 'next', me.objectStore, me, escapeIndexNameForSQLKeyColumn(me.name), 'value', true).__req;
    }
    return me.__fetchIndexData(query, 'count', false);
};

IDBIndex.prototype.__renameIndex = function (store, oldName, newName, colInfoToPreserveArr = [], cb = null) {
    const newNameType = 'BLOB';
    const storeName = store.__currentName;
    const escapedStoreNameSQL = escapeStoreNameForSQL(storeName);
    const escapedNewIndexNameSQL = escapeIndexNameForSQL(newName);
    const escapedTmpStoreNameSQL = sqlQuote('tmp_' + escapeStoreNameForSQL(storeName).slice(1, -1));
    const colNamesToPreserve = colInfoToPreserveArr.map((colInfo) => colInfo[0]);
    const colInfoToPreserve = colInfoToPreserveArr.map((colInfo) => colInfo.join(' '));
    const listColInfoToPreserve = (colInfoToPreserve.length ? (colInfoToPreserve.join(', ') + ', ') : '');
    const listColsToPreserve = (colNamesToPreserve.length ? (colNamesToPreserve.join(', ') + ', ') : '');

    // We could adapt the approach at http://stackoverflow.com/a/8430746/271577
    //    to make the approach reusable without passing column names, but it is a bit fragile
    store.transaction.__addNonRequestToTransactionQueue(function renameIndex (tx, args, success, error) {
        function sqlError (tx, err) {
            error(err);
        }
        function finish () {
            if (cb) {
                cb(tx, success);
                return;
            }
            success();
        }
        // See https://www.sqlite.org/lang_altertable.html#otheralter
        // We don't query for indexes as we already have the info
        // This approach has the advantage of auto-deleting indexes via the DROP TABLE
        const sql = 'CREATE TABLE ' + escapedTmpStoreNameSQL +
            '(' + listColInfoToPreserve + escapedNewIndexNameSQL + ' ' + newNameType + ')';
        CFG.DEBUG && console.log(sql);
        tx.executeSql(sql, [], function () {
            const sql = 'INSERT INTO ' + escapedTmpStoreNameSQL + '(' +
                listColsToPreserve + escapedNewIndexNameSQL +
                ') SELECT ' + listColsToPreserve + escapeIndexNameForSQL(oldName) + ' FROM ' + escapedStoreNameSQL;
            CFG.DEBUG && console.log(sql);
            tx.executeSql(sql, [], function () {
                const sql = 'DROP TABLE ' + escapedStoreNameSQL;
                CFG.DEBUG && console.log(sql);
                tx.executeSql(sql, [], function () {
                    const sql = 'ALTER TABLE ' + escapedTmpStoreNameSQL + ' RENAME TO ' + escapedStoreNameSQL;
                    CFG.DEBUG && console.log(sql);
                    tx.executeSql(sql, [], function (tx, data) {
                        if (!CFG.useSQLiteIndexes) {
                            finish();
                            return;
                        }
                        const indexCreations = colNamesToPreserve
                            .slice(2) // Doing `key` separately and no need for index on `value`
                            .map((escapedIndexNameSQL) => new syncPromiseCommonjs(function (resolve, reject) {
                                const escapedIndexToRecreate = sqlQuote(
                                    escapedStoreNameSQL.slice(1, -1) + '^5' + escapedIndexNameSQL.slice(1, -1)
                                );
                                // const sql = 'DROP INDEX IF EXISTS ' + escapedIndexToRecreate;
                                // CFG.DEBUG && console.log(sql);
                                // tx.executeSql(sql, [], function () {
                                const sql = 'CREATE INDEX ' +
                                    escapedIndexToRecreate + ' ON ' + escapedStoreNameSQL + '(' + escapedIndexNameSQL + ')';
                                CFG.DEBUG && console.log(sql);
                                tx.executeSql(sql, [], resolve, function (tx, err) {
                                    reject(err);
                                });
                                // }, function (tx, err) {
                                //    reject(err);
                                // });
                            }));
                        indexCreations.push(
                            new syncPromiseCommonjs(function (resolve, reject) {
                                const escapedIndexToRecreate = sqlQuote('sk_' + escapedStoreNameSQL.slice(1, -1));
                                // Chrome erring here if not dropped first; Node does not
                                const sql = 'DROP INDEX IF EXISTS ' + escapedIndexToRecreate;
                                CFG.DEBUG && console.log(sql);
                                tx.executeSql(sql, [], function () {
                                    const sql = 'CREATE INDEX ' + escapedIndexToRecreate +
                                        ' ON ' + escapedStoreNameSQL + '("key")';
                                    CFG.DEBUG && console.log(sql);
                                    tx.executeSql(sql, [], resolve, function (tx, err) {
                                        reject(err);
                                    });
                                }, function (tx, err) {
                                    reject(err);
                                });
                            })
                        );
                        syncPromiseCommonjs.all(indexCreations).then(finish, error);
                    }, sqlError);
                }, sqlError);
            }, sqlError);
        }, sqlError);
    });
};

Object.defineProperty(IDBIndex, Symbol.hasInstance, {
    value: obj => isObj(obj) && typeof obj.openCursor === 'function' && typeof obj.multiEntry === 'boolean'
});

readonlyProperties$4.forEach((prop) => {
    Object.defineProperty(IDBIndex.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});
Object.defineProperty(IDBIndex.prototype, 'name', {
    enumerable: true,
    configurable: true,
    get: function () {
        throw new TypeError('Illegal invocation');
    },
    set: function (val) {
        throw new TypeError('Illegal invocation');
    }
});
IDBIndex.prototype[Symbol.toStringTag] = 'IDBIndexPrototype';

Object.defineProperty(IDBIndex, 'prototype', {
    writable: false
});

function executeFetchIndexData (count, unboundedDisallowed, index, hasKey, range, opType, multiChecks, sql, sqlValues, tx, args, success, error) {
    if (unboundedDisallowed) {
        count = 1;
    }
    if (count) {
        sql.push('LIMIT', count);
    }
    const isCount = opType === 'count';
    CFG.DEBUG && console.log('Trying to fetch data for Index', sql.join(' '), sqlValues);
    tx.executeSql(sql.join(' '), sqlValues, function (tx, data) {
        const records = [];
        let recordCount = 0;
        const decode$$1 = isCount ? () => {} : (opType === 'key' ? (record) => {
            // Key.convertValueToKey(record.key); // Already validated before storage
            return decode(unescapeSQLiteResponse(record.key));
        } : (record) => { // when opType is value
            return decode$1(unescapeSQLiteResponse(record.value));
        });
        if (index.multiEntry) {
            const escapedIndexNameForKeyCol = escapeIndexNameForSQLKeyColumn(index.name);
            const encodedKey = encode(range, index.multiEntry);
            for (let i = 0; i < data.rows.length; i++) {
                const row = data.rows.item(i);
                const rowKey = decode(row[escapedIndexNameForKeyCol]);
                let record;
                if (hasKey && (
                    (multiChecks && range.some((check) => rowKey.includes(check))) || // More precise than our SQL
                    isMultiEntryMatch(encodedKey, row[escapedIndexNameForKeyCol])
                )) {
                    recordCount++;
                    record = row;
                } else if (!hasKey && !multiChecks) {
                    if (rowKey !== undefined) {
                        recordCount += (Array.isArray(rowKey) ? rowKey.length : 1);
                        record = row;
                    }
                }
                if (record) {
                    records.push(decode$$1(record));
                    if (unboundedDisallowed) {
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < data.rows.length; i++) {
                const record = data.rows.item(i);
                if (record) {
                    records.push(decode$$1(record));
                }
            }
            recordCount = records.length;
        }
        if (isCount) {
            success(recordCount);
        } else if (recordCount === 0) {
            success(unboundedDisallowed ? undefined : []);
        } else {
            success(unboundedDisallowed ? records[0] : records);
        }
    }, error);
}

function buildFetchIndexDataSQL (nullDisallowed, index, range, opType, multiChecks) {
    const hasRange = nullDisallowed || range != null;
    const col = opType === 'count' ? 'key' : opType; // It doesn't matter which column we use for 'count' as long as it is valid
    const sql = [
        'SELECT', sqlQuote(col) + (
            index.multiEntry ? ', ' + escapeIndexNameForSQL(index.name) : ''
        ),
        'FROM', escapeStoreNameForSQL(index.objectStore.__currentName),
        'WHERE', escapeIndexNameForSQL(index.name), 'NOT NULL'
    ];
    const sqlValues = [];
    if (hasRange) {
        if (multiChecks) {
            sql.push('AND (');
            range.forEach((innerKey, i) => {
                if (i > 0) sql.push('OR');
                sql.push(escapeIndexNameForSQL(index.name), "LIKE ? ESCAPE '^' ");
                sqlValues.push('%' + sqlLIKEEscape(encode(innerKey, index.multiEntry)) + '%');
            });
            sql.push(')');
        } else if (index.multiEntry) {
            sql.push('AND', escapeIndexNameForSQL(index.name), "LIKE ? ESCAPE '^'");
            sqlValues.push('%' + sqlLIKEEscape(encode(range, index.multiEntry)) + '%');
        } else {
            const convertedRange = convertValueToKeyRange(range, nullDisallowed);
            setSQLForKeyRange(convertedRange, escapeIndexNameForSQL(index.name), sql, sqlValues, true, false);
        }
    }
    return [nullDisallowed, index, hasRange, range, opType, multiChecks, sql, sqlValues];
}

const readonlyProperties$5 = ['keyPath', 'indexNames', 'transaction', 'autoIncrement'];

/**
 * IndexedDB Object Store
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBObjectStore
 * @param {IDBObjectStoreProperties} storeProperties
 * @param {IDBTransaction} transaction
 * @constructor
 */
function IDBObjectStore () {
    throw new TypeError('Illegal constructor');
}
const IDBObjectStoreAlias = IDBObjectStore;
IDBObjectStore.__createInstance = function (storeProperties, transaction) {
    function IDBObjectStore () {
        const me = this;
        me[Symbol.toStringTag] = 'IDBObjectStore';
        defineReadonlyProperties(this, readonlyProperties$5);
        me.__name = me.__originalName = storeProperties.name;
        me.__keyPath = Array.isArray(storeProperties.keyPath) ? storeProperties.keyPath.slice() : storeProperties.keyPath;
        me.__transaction = transaction;
        me.__idbdb = storeProperties.idbdb;
        me.__cursors = storeProperties.cursors || [];

        // autoInc is numeric (0/1) on WinPhone
        me.__autoIncrement = !!storeProperties.autoInc;

        me.__indexes = {};
        me.__indexHandles = {};
        me.__indexNames = DOMStringList.__createInstance();
        const indexList = storeProperties.indexList;
        for (const indexName in indexList) {
            if (indexList.hasOwnProperty(indexName)) {
                const index = IDBIndex.__createInstance(me, indexList[indexName]);
                me.__indexes[index.name] = index;
                if (!index.__deleted) {
                    me.indexNames.push(index.name);
                }
            }
        }
        me.__oldIndexNames = me.indexNames.clone();
        Object.defineProperty(this, '__currentName', {
            get: function () {
                return '__pendingName' in this ? this.__pendingName : this.name;
            }
        });
        Object.defineProperty(this, 'name', {
            enumerable: false,
            configurable: false,
            get: function () {
                return this.__name;
            },
            set: function (name) {
                const me = this;
                name = convertToDOMString(name);
                const oldName = me.name;
                IDBObjectStoreAlias.__invalidStateIfDeleted(me);
                IDBTransaction.__assertVersionChange(me.transaction);
                IDBTransaction.__assertActive(me.transaction);
                if (oldName === name) {
                    return;
                }
                if (me.__idbdb.__objectStores[name] && !me.__idbdb.__objectStores[name].__pendingDelete) {
                    throw createDOMException('ConstraintError', 'Object store "' + name + '" already exists in ' + me.__idbdb.name);
                }

                me.__name = name;

                const oldStore = me.__idbdb.__objectStores[oldName];
                oldStore.__name = name; // Fix old references
                me.__idbdb.__objectStores[name] = oldStore; // Ensure new reference accessible
                delete me.__idbdb.__objectStores[oldName]; // Ensure won't be found

                me.__idbdb.objectStoreNames.splice(me.__idbdb.objectStoreNames.indexOf(oldName), 1, name);

                const oldHandle = me.transaction.__storeHandles[oldName];
                oldHandle.__name = name; // Fix old references
                me.transaction.__storeHandles[name] = oldHandle; // Ensure new reference accessible

                me.__pendingName = oldName;

                const sql = 'UPDATE __sys__ SET "name" = ? WHERE "name" = ?';
                const sqlValues = [escapeSQLiteStatement(name), escapeSQLiteStatement(oldName)];
                CFG.DEBUG && console.log(sql, sqlValues);
                me.transaction.__addNonRequestToTransactionQueue(function objectStoreClear (tx, args, success, error) {
                    tx.executeSql(sql, sqlValues, function (tx, data) {
                        // This SQL preserves indexes per https://www.sqlite.org/lang_altertable.html
                        const sql = 'ALTER TABLE ' + escapeStoreNameForSQL(oldName) + ' RENAME TO ' + escapeStoreNameForSQL(name);
                        CFG.DEBUG && console.log(sql);
                        tx.executeSql(sql, [], function (tx, data) {
                            delete me.__pendingName;
                            success();
                        });
                    }, function (tx, err) {
                        error(err);
                    });
                });
            }
        });
    }
    IDBObjectStore.prototype = IDBObjectStoreAlias.prototype;
    return new IDBObjectStore();
};

/**
 * Clones an IDBObjectStore instance for a different IDBTransaction instance.
 * @param {IDBObjectStore} store
 * @param {IDBTransaction} transaction
 * @protected
 */
IDBObjectStore.__clone = function (store, transaction) {
    const newStore = IDBObjectStore.__createInstance({
        name: store.__currentName,
        keyPath: Array.isArray(store.keyPath) ? store.keyPath.slice() : store.keyPath,
        autoInc: store.autoIncrement,
        indexList: {},
        idbdb: store.__idbdb,
        cursors: store.__cursors
    }, transaction);

    ['__indexes', '__indexNames', '__oldIndexNames', '__deleted', '__pendingDelete', '__pendingCreate', '__originalName'].forEach((p) => {
        newStore[p] = store[p];
    });
    return newStore;
};

IDBObjectStore.__invalidStateIfDeleted = function (store, msg) {
    if (store.__deleted || store.__pendingDelete || (store.__pendingCreate && (store.transaction && store.transaction.__errored))) {
        throw createDOMException('InvalidStateError', msg || 'This store has been deleted');
    }
};

/**
 * Creates a new object store in the database.
 * @param {IDBDatabase} db
 * @param {IDBObjectStore} store
 * @protected
 */
IDBObjectStore.__createObjectStore = function (db, store) {
    // Add the object store to the IDBDatabase
    const storeName = store.__currentName;
    store.__pendingCreate = true;
    db.__objectStores[storeName] = store;
    db.objectStoreNames.push(storeName);

    // Add the object store to WebSQL
    const transaction = db.__versionTransaction;

    const storeHandles = transaction.__storeHandles;
    if (!storeHandles[storeName] ||
        // These latter conditions are to allow store
        //   recreation to create new clone object
        storeHandles[storeName].__pendingDelete ||
        storeHandles[storeName].__deleted) {
        storeHandles[storeName] = IDBObjectStore.__clone(store, transaction);
    }

    transaction.__addNonRequestToTransactionQueue(function createObjectStore (tx, args, success, failure) {
        function error (tx, err) {
            CFG.DEBUG && console.log(err);
            failure(createDOMException('UnknownError', 'Could not create object store "' + storeName + '"', err));
        }

        const escapedStoreNameSQL = escapeStoreNameForSQL(storeName);
        // key INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE
        const sql = ['CREATE TABLE', escapedStoreNameSQL, '(key BLOB', store.autoIncrement ? 'UNIQUE, inc INTEGER PRIMARY KEY AUTOINCREMENT' : 'PRIMARY KEY', ', value BLOB)'].join(' ');
        CFG.DEBUG && console.log(sql);
        tx.executeSql(sql, [], function (tx, data) {
            function insertStoreInfo () {
                const encodedKeyPath = JSON.stringify(store.keyPath);
                tx.executeSql('INSERT INTO __sys__ VALUES (?,?,?,?,?)', [escapeSQLiteStatement(storeName), encodedKeyPath, store.autoIncrement, '{}', 1], function () {
                    delete store.__pendingCreate;
                    delete store.__deleted;
                    success(store);
                }, error);
            }
            if (!CFG.useSQLiteIndexes) {
                insertStoreInfo();
                return;
            }
            tx.executeSql('CREATE INDEX IF NOT EXISTS ' + (
                sqlQuote('sk_' + escapedStoreNameSQL.slice(1, -1))
            ) + ' ON ' + escapedStoreNameSQL + '("key")', [], insertStoreInfo, error);
        }, error);
    });
    return storeHandles[storeName];
};

/**
 * Deletes an object store from the database.
 * @param {IDBDatabase} db
 * @param {IDBObjectStore} store
 * @protected
 */
IDBObjectStore.__deleteObjectStore = function (db, store) {
    // Remove the object store from the IDBDatabase
    store.__pendingDelete = true;
    // We don't delete the other index holders in case need reversion
    store.__indexNames = DOMStringList.__createInstance();

    db.objectStoreNames.splice(db.objectStoreNames.indexOf(store.__currentName), 1);

    const storeHandle = db.__versionTransaction.__storeHandles[store.__currentName];
    if (storeHandle) {
        storeHandle.__indexNames = DOMStringList.__createInstance();
        storeHandle.__pendingDelete = true;
    }

    // Remove the object store from WebSQL
    const transaction = db.__versionTransaction;
    transaction.__addNonRequestToTransactionQueue(function deleteObjectStore (tx, args, success, failure) {
        function error (tx, err) {
            CFG.DEBUG && console.log(err);
            failure(createDOMException('UnknownError', 'Could not delete ObjectStore', err));
        }

        tx.executeSql('SELECT "name" FROM __sys__ WHERE "name" = ?', [escapeSQLiteStatement(store.__currentName)], function (tx, data) {
            if (data.rows.length > 0) {
                tx.executeSql('DROP TABLE ' + escapeStoreNameForSQL(store.__currentName), [], function () {
                    tx.executeSql('DELETE FROM __sys__ WHERE "name" = ?', [escapeSQLiteStatement(store.__currentName)], function () {
                        delete store.__pendingDelete;
                        store.__deleted = true;
                        if (storeHandle) {
                            delete storeHandle.__pendingDelete;
                            storeHandle.__deleted = true;
                        }
                        success();
                    }, error);
                }, error);
            }
        });
    });
};

// Todo: Although we may end up needing to do cloning genuinely asynchronously (for Blobs and FileLists),
//   and we'll want to ensure the queue starts up synchronously, we nevertheless do the cloning
//   before entering the queue and its callback since the encoding we do is preceded by validation
//   which we must do synchronously anyways. If we reimplement Blobs and FileLists asynchronously,
//   we can detect these types (though validating synchronously as possible) and once entering the
//   queue callback, ensure they load before triggering success or failure (perhaps by returning and
//   a `SyncPromise` from the `Sca.clone` operation and later detecting and ensuring it is resolved
//   before continuing).
/**
 * Determines whether the given inline or out-of-line key is valid, according to the object store's schema.
 * @param {*} value     Used for inline keys
 * @param {*} key       Used for out-of-line keys
 * @private
 */
IDBObjectStore.prototype.__validateKeyAndValueAndCloneValue = function (value, key, cursorUpdate) {
    const me = this;
    if (me.keyPath !== null) {
        if (key !== undefined) {
            throw createDOMException('DataError', 'The object store uses in-line keys and the key parameter was provided', me);
        }
        // Todo Binary: Avoid blobs loading async to ensure cloning (and errors therein)
        //   occurs sync; then can make cloning and this method without callbacks (except where ok
        //   to be async)
        const clonedValue = clone$1(value);
        key = extractKeyValueDecodedFromValueUsingKeyPath(clonedValue, me.keyPath); // May throw so "rethrow"
        if (key.invalid) {
            throw createDOMException('DataError', 'KeyPath was specified, but key was invalid.');
        }
        if (key.failure) {
            if (!cursorUpdate) {
                if (!me.autoIncrement) {
                    throw createDOMException('DataError', 'Could not evaluate a key from keyPath and there is no key generator');
                }
                if (!checkKeyCouldBeInjectedIntoValue(clonedValue, me.keyPath)) {
                    throw createDOMException('DataError', 'A key could not be injected into a value');
                }
                // A key will be generated
                return [undefined, clonedValue];
            }
            throw createDOMException('DataError', 'Could not evaluate a key from keyPath');
        }
        // An `IDBCursor.update` call will also throw if not equal to the cursor’s effective key
        return [key.value, clonedValue];
    }
    if (key === undefined) {
        if (!me.autoIncrement) {
            throw createDOMException('DataError', 'The object store uses out-of-line keys and has no key generator and the key parameter was not provided.', me);
        }
        // A key will be generated
        key = undefined;
    } else {
        convertValueToKeyRethrowingAndIfInvalid(key);
    }
    const clonedValue = clone$1(value);
    return [key, clonedValue];
};

/**
 * From the store properties and object, extracts the value for the key in the object store
 * If the table has auto increment, get the current number (unless it has a keyPath leading to a
 *  valid but non-numeric or < 1 key)
 * @param {Object} tx
 * @param {Object} value
 * @param {Object} key
 * @param {function} success
 * @param {function} failure
 */
IDBObjectStore.prototype.__deriveKey = function (tx, value, key, success, failCb) {
    const me = this;

    // Only run if cloning is needed
    function keyCloneThenSuccess (oldCn) { // We want to return the original key, so we don't need to accept an argument here
        encode$1(key, function (key) {
            key = decode$1(key);
            success(key, oldCn);
        });
    }

    if (me.autoIncrement) {
        // If auto-increment and no valid primaryKey found on the keyPath, get and set the new value, and use
        if (key === undefined) {
            generateKeyForStore(tx, me, function (failure, key, oldCn) {
                if (failure) {
                    failCb(createDOMException('ConstraintError', 'The key generator\'s current number has reached the maximum safe integer limit'));
                    return;
                }
                if (me.keyPath !== null) {
                    // Should not throw now as checked earlier
                    injectKeyIntoValueUsingKeyPath(value, key, me.keyPath);
                }
                success(key, oldCn);
            }, failCb);
        } else {
            possiblyUpdateKeyGenerator(tx, me, key, keyCloneThenSuccess, failCb);
        }
    // Not auto-increment
    } else {
        keyCloneThenSuccess();
    }
};

IDBObjectStore.prototype.__insertData = function (tx, encoded, value, clonedKeyOrCurrentNumber, oldCn, success, error) {
    const me = this;
    // The `ConstraintError` to occur for `add` upon a duplicate will occur naturally in attempting an insert
    // We process the index information first as it will stored in the same table as the store
    const paramMap = {};
    const indexPromises = Object.keys(
        // We do not iterate `indexNames` as those can be modified synchronously (e.g.,
        //   `deleteIndex` could, by its synchronous removal from `indexNames`, prevent
        //   iteration here of an index though per IndexedDB test
        //   `idbobjectstore_createIndex4-deleteIndex-event_order.js`, `createIndex`
        //   should be allowed to first fail even in such a case).
        me.__indexes
    ).map((indexName) => {
        // While this may sometimes resolve sync and sometimes async, the
        //   idea is to avoid, where possible, unnecessary delays (and
        //   consuming code ought to only see a difference in the browser
        //   where we can't control the transaction timeout anyways).
        return new syncPromiseCommonjs((resolve, reject) => {
            const index = me.__indexes[indexName];
            if (
                // `createIndex` was called synchronously after the current insertion was added to
                //  the transaction queue so although it was added to `__indexes`, it is not yet
                //  ready to be checked here for the insertion as it will be when running the
                //  `createIndex` operation (e.g., if two items with the same key were added and
                //  *then* a unique index was created, it should not continue to err and abort
                //  yet, as we're still handling the insertions which must be processed (e.g., to
                //  add duplicates which then cause a unique index to fail))
                index.__pendingCreate ||
                // If already deleted (and not just slated for deletion (by `__pendingDelete`
                //  after this add), we avoid checks
                index.__deleted
            ) {
                resolve();
                return;
            }
            let indexKey;
            try {
                indexKey = extractKeyValueDecodedFromValueUsingKeyPath(value, index.keyPath, index.multiEntry); // Add as necessary to this and skip past this index if exceptions here)
                if (indexKey.invalid || indexKey.failure) {
                    throw new Error('Go to catch');
                }
            } catch (err) {
                resolve();
                return;
            }
            indexKey = indexKey.value;
            function setIndexInfo (index) {
                if (indexKey === undefined) {
                    return;
                }
                paramMap[index.__currentName] = encode(indexKey, index.multiEntry);
            }
            if (index.unique) {
                const multiCheck = index.multiEntry && Array.isArray(indexKey);
                const fetchArgs = buildFetchIndexDataSQL(true, index, indexKey, 'key', multiCheck);
                executeFetchIndexData(null, ...fetchArgs, tx, null, function success (key) {
                    if (key === undefined) {
                        setIndexInfo(index);
                        resolve();
                        return;
                    }
                    reject(createDOMException(
                        'ConstraintError',
                        'Index already contains a record equal to ' +
                            (multiCheck ? 'one of the subkeys of' : '') +
                            '`indexKey`'
                    ));
                }, reject);
            } else {
                setIndexInfo(index);
                resolve();
            }
        });
    });
    syncPromiseCommonjs.all(indexPromises).then(() => {
        const sqlStart = ['INSERT INTO', escapeStoreNameForSQL(me.__currentName), '('];
        const sqlEnd = [' VALUES ('];
        const insertSqlValues = [];
        if (clonedKeyOrCurrentNumber !== undefined) {
            // Key.convertValueToKey(primaryKey); // Already run
            sqlStart.push(sqlQuote('key'), ',');
            sqlEnd.push('?,');
            insertSqlValues.push(escapeSQLiteStatement(encode(clonedKeyOrCurrentNumber)));
        }
        for (const key in paramMap) {
            sqlStart.push(escapeIndexNameForSQL(key) + ',');
            sqlEnd.push('?,');
            insertSqlValues.push(escapeSQLiteStatement(paramMap[key]));
        }
        // removing the trailing comma
        sqlStart.push(sqlQuote('value') + ' )');
        sqlEnd.push('?)');
        insertSqlValues.push(escapeSQLiteStatement(encoded));

        const insertSql = sqlStart.join(' ') + sqlEnd.join(' ');
        CFG.DEBUG && console.log('SQL for adding', insertSql, insertSqlValues);

        tx.executeSql(insertSql, insertSqlValues, function (tx, data) {
            success(clonedKeyOrCurrentNumber);
        }, function (tx, err) {
            // Should occur for `add` operation
            error(createDOMException('ConstraintError', err.message, err));
        });
    }).catch(function (err) {
        function fail () {
            // Todo: Add a different error object here if `assignCurrentNumber` fails in reverting?
            error(err);
        }
        if (typeof oldCn === 'number') {
            assignCurrentNumber(tx, me, oldCn, fail, fail);
            return;
        }
        fail();
    });
};

IDBObjectStore.prototype.add = function (value /* , key */) {
    const me = this;
    const key = arguments[1];
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No value was specified');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    me.transaction.__assertWritable();

    const request = me.transaction.__createRequest(me);
    const [ky, clonedValue] = me.__validateKeyAndValueAndCloneValue(value, key, false);
    IDBObjectStore.__storingRecordObjectStore(request, me, true, clonedValue, true, ky);
    return request;
};

IDBObjectStore.prototype.put = function (value /*, key */) {
    const me = this;
    const key = arguments[1];
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No value was specified');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    me.transaction.__assertWritable();

    const request = me.transaction.__createRequest(me);
    const [ky, clonedValue] = me.__validateKeyAndValueAndCloneValue(value, key, false);
    IDBObjectStore.__storingRecordObjectStore(request, me, true, clonedValue, false, ky);
    return request;
};

IDBObjectStore.prototype.__overwrite = function (tx, key, cb, error) {
    const me = this;
    // First try to delete if the record exists
    // Key.convertValueToKey(key); // Already run
    const sql = 'DELETE FROM ' + escapeStoreNameForSQL(me.__currentName) + ' WHERE "key" = ?';
    const encodedKey = encode(key);
    tx.executeSql(sql, [escapeSQLiteStatement(encodedKey)], function (tx, data) {
        CFG.DEBUG && console.log('Did the row with the', key, 'exist? ', data.rowsAffected);
        cb(tx);
    }, function (tx, err) {
        error(err);
    });
};

IDBObjectStore.__storingRecordObjectStore = function (request, store, invalidateCache, value, noOverwrite /* , key */) {
    const key = arguments[5];
    store.transaction.__pushToQueue(request, function (tx, args, success, error) {
        store.__deriveKey(tx, value, key, function (clonedKeyOrCurrentNumber, oldCn) {
            encode$1(value, function (encoded) {
                function insert (tx) {
                    store.__insertData(tx, encoded, value, clonedKeyOrCurrentNumber, oldCn, function (...args) {
                        if (invalidateCache) {
                            store.__cursors.forEach((cursor) => {
                                cursor.__invalidateCache();
                            });
                        }
                        success(...args);
                    }, error);
                }
                if (!noOverwrite) {
                    store.__overwrite(tx, clonedKeyOrCurrentNumber, insert, error);
                    return;
                }
                insert(tx);
            });
        }, error);
    });
};

IDBObjectStore.prototype.__get = function (query, getKey, getAll, count) {
    const me = this;
    if (count !== undefined) {
        count = enforceRange(count, 'unsigned long');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);

    const range = convertValueToKeyRange(query, !getAll);

    const col = getKey ? 'key' : 'value';
    let sql = ['SELECT', sqlQuote(col), 'FROM', escapeStoreNameForSQL(me.__currentName)];
    const sqlValues = [];
    if (range !== undefined) {
        sql.push('WHERE');
        setSQLForKeyRange(range, sqlQuote('key'), sql, sqlValues);
    }
    if (!getAll) {
        count = 1;
    }
    if (count) {
        if (typeof count !== 'number' || isNaN(count) || !isFinite(count)) {
            throw new TypeError('The count parameter must be a finite number');
        }
        sql.push('LIMIT', count);
    }
    sql = sql.join(' ');
    return me.transaction.__addToTransactionQueue(function objectStoreGet (tx, args, success, error) {
        CFG.DEBUG && console.log('Fetching', me.__currentName, sqlValues);
        tx.executeSql(sql, sqlValues, function (tx, data) {
            CFG.DEBUG && console.log('Fetched data', data);
            let ret;
            try {
                // Opera can't deal with the try-catch here.
                if (data.rows.length === 0) {
                    return getAll ? success([]) : success();
                }
                ret = [];
                if (getKey) {
                    for (let i = 0; i < data.rows.length; i++) {
                        // Key.convertValueToKey(data.rows.item(i).key); // Already validated before storage
                        ret.push(
                            decode(unescapeSQLiteResponse(data.rows.item(i).key), false)
                        );
                    }
                } else {
                    for (let i = 0; i < data.rows.length; i++) {
                        ret.push(
                            decode$1(unescapeSQLiteResponse(data.rows.item(i).value))
                        );
                    }
                }
                if (!getAll) {
                    ret = ret[0];
                }
            } catch (e) {
                // If no result is returned, or error occurs when parsing JSON
                CFG.DEBUG && console.log(e);
            }
            success(ret);
        }, function (tx, err) {
            error(err);
        });
    }, undefined, me);
};

IDBObjectStore.prototype.get = function (query) {
    if (!arguments.length) {
        throw new TypeError('A parameter was missing for `IDBObjectStore.get`.');
    }
    return this.__get(query);
};

IDBObjectStore.prototype.getKey = function (query) {
    if (!arguments.length) {
        throw new TypeError('A parameter was missing for `IDBObjectStore.getKey`.');
    }
    return this.__get(query, true);
};

IDBObjectStore.prototype.getAll = function (/* query, count */) {
    const [query, count] = arguments;
    return this.__get(query, false, true, count);
};

IDBObjectStore.prototype.getAllKeys = function (/* query, count */) {
    const [query, count] = arguments;
    return this.__get(query, true, true, count);
};

IDBObjectStore.prototype['delete'] = function (query) {
    const me = this;
    if (!(this instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    if (!arguments.length) {
        throw new TypeError('A parameter was missing for `IDBObjectStore.delete`.');
    }

    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    me.transaction.__assertWritable();

    const range = convertValueToKeyRange(query, true);

    const sqlArr = ['DELETE FROM', escapeStoreNameForSQL(me.__currentName), 'WHERE'];
    const sqlValues = [];
    setSQLForKeyRange(range, sqlQuote('key'), sqlArr, sqlValues);
    const sql = sqlArr.join(' ');

    return me.transaction.__addToTransactionQueue(function objectStoreDelete (tx, args, success, error) {
        CFG.DEBUG && console.log('Deleting', me.__currentName, sqlValues);
        tx.executeSql(sql, sqlValues, function (tx, data) {
            CFG.DEBUG && console.log('Deleted from database', data.rowsAffected);
            me.__cursors.forEach((cursor) => {
                cursor.__invalidateCache(); // Delete
            });
            success();
        }, function (tx, err) {
            error(err);
        });
    }, undefined, me);
};

IDBObjectStore.prototype.clear = function () {
    const me = this;
    if (!(this instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    me.transaction.__assertWritable();

    return me.transaction.__addToTransactionQueue(function objectStoreClear (tx, args, success, error) {
        tx.executeSql('DELETE FROM ' + escapeStoreNameForSQL(me.__currentName), [], function (tx, data) {
            CFG.DEBUG && console.log('Cleared all records from database', data.rowsAffected);
            me.__cursors.forEach((cursor) => {
                cursor.__invalidateCache(); // Clear
            });
            success();
        }, function (tx, err) {
            error(err);
        });
    }, undefined, me);
};

IDBObjectStore.prototype.count = function (/* query */) {
    const me = this;
    const query = arguments[0];
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);

    // We don't need to add to cursors array since has the count parameter which won't cache
    return IDBCursorWithValue.__createInstance(query, 'next', me, me, 'key', 'value', true).__req;
};

IDBObjectStore.prototype.openCursor = function (/* query, direction */) {
    const me = this;
    const [query, direction] = arguments;
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    const cursor = IDBCursorWithValue.__createInstance(query, direction, me, me, 'key', 'value');
    me.__cursors.push(cursor);
    return cursor.__req;
};

IDBObjectStore.prototype.openKeyCursor = function (/* query, direction */) {
    const me = this;
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    const [query, direction] = arguments;
    const cursor = IDBCursor.__createInstance(query, direction, me, me, 'key', 'key');
    me.__cursors.push(cursor);
    return cursor.__req;
};

IDBObjectStore.prototype.index = function (indexName) {
    const me = this;
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No index name was specified');
    }
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertNotFinished(me.transaction);
    const index = me.__indexes[indexName];
    if (!index || index.__deleted) {
        throw createDOMException('NotFoundError', 'Index "' + indexName + '" does not exist on ' + me.__currentName);
    }

    if (!me.__indexHandles[indexName] ||
        me.__indexes[indexName].__pendingDelete ||
        me.__indexes[indexName].__deleted
    ) {
        me.__indexHandles[indexName] = IDBIndex.__clone(index, me);
    }
    return me.__indexHandles[indexName];
};

/**
 * Creates a new index on the object store.
 * @param {string} indexName
 * @param {string} keyPath
 * @param {object} optionalParameters
 * @returns {IDBIndex}
 */
IDBObjectStore.prototype.createIndex = function (indexName, keyPath /* , optionalParameters */) {
    const me = this;
    let optionalParameters = arguments[2];
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    indexName = String(indexName); // W3C test within IDBObjectStore.js seems to accept string conversion
    if (arguments.length === 0) {
        throw new TypeError('No index name was specified');
    }
    if (arguments.length === 1) {
        throw new TypeError('No key path was specified');
    }
    IDBTransaction.__assertVersionChange(me.transaction);
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    if (me.__indexes[indexName] && !me.__indexes[indexName].__deleted && !me.__indexes[indexName].__pendingDelete) {
        throw createDOMException('ConstraintError', 'Index "' + indexName + '" already exists on ' + me.__currentName);
    }

    keyPath = convertToSequenceDOMString(keyPath);
    if (!isValidKeyPath(keyPath)) {
        throw createDOMException('SyntaxError', 'A valid keyPath must be supplied');
    }
    if (Array.isArray(keyPath) && optionalParameters && optionalParameters.multiEntry) {
        throw createDOMException('InvalidAccessError', 'The keyPath argument was an array and the multiEntry option is true.');
    }

    optionalParameters = optionalParameters || {};
    /** @name IDBIndexProperties **/
    const indexProperties = {
        columnName: indexName,
        keyPath,
        optionalParams: {
            unique: !!optionalParameters.unique,
            multiEntry: !!optionalParameters.multiEntry
        }
    };
    const index = IDBIndex.__createInstance(me, indexProperties);
    IDBIndex.__createIndex(me, index);
    return index;
};

IDBObjectStore.prototype.deleteIndex = function (name) {
    const me = this;
    if (!(me instanceof IDBObjectStore)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No index name was specified');
    }
    IDBTransaction.__assertVersionChange(me.transaction);
    IDBObjectStore.__invalidStateIfDeleted(me);
    IDBTransaction.__assertActive(me.transaction);
    const index = me.__indexes[name];
    if (!index) {
        throw createDOMException('NotFoundError', 'Index "' + name + '" does not exist on ' + me.__currentName);
    }

    IDBIndex.__deleteIndex(me, index);
};

readonlyProperties$5.forEach((prop) => {
    Object.defineProperty(IDBObjectStore.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});
Object.defineProperty(IDBObjectStore.prototype, 'name', {
    enumerable: true,
    configurable: true,
    get: function () {
        throw new TypeError('Illegal invocation');
    },
    set: function (val) {
        throw new TypeError('Illegal invocation');
    }
});

IDBObjectStore.prototype[Symbol.toStringTag] = 'IDBObjectStorePrototype';

Object.defineProperty(IDBObjectStore, 'prototype', {
    writable: false
});

const listeners$2 = ['onabort', 'onclose', 'onerror', 'onversionchange'];
const readonlyProperties$6 = ['name', 'version', 'objectStoreNames'];

/**
 * IDB Database Object
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#database-interface
 * @constructor
 */
function IDBDatabase () {
    throw new TypeError('Illegal constructor');
}
const IDBDatabaseAlias = IDBDatabase;
IDBDatabase.__createInstance = function (db, name, oldVersion, version, storeProperties) {
    function IDBDatabase () {
        this[Symbol.toStringTag] = 'IDBDatabase';
        defineReadonlyProperties(this, readonlyProperties$6);
        this.__db = db;
        this.__closed = false;
        this.__oldVersion = oldVersion;
        this.__version = version;
        this.__name = name;
        this.__upgradeTransaction = null;
        listeners$2.forEach((listener) => {
            Object.defineProperty(this, listener, {
                enumerable: true,
                configurable: true,
                get: function () {
                    return this['__' + listener];
                },
                set: function (val) {
                    this['__' + listener] = val;
                }
            });
        });
        listeners$2.forEach((l) => {
            this[l] = null;
        });
        this.__setOptions({
            legacyOutputDidListenersThrowFlag: true // Event hook for IndexedB
        });

        this.__transactions = [];
        this.__objectStores = {};
        this.__objectStoreNames = DOMStringList.__createInstance();
        const itemCopy = {};
        for (let i = 0; i < storeProperties.rows.length; i++) {
            const item = storeProperties.rows.item(i);
            // Safari implements `item` getter return object's properties
            //  as readonly, so we copy all its properties (except our
            //  custom `currNum` which we don't need) onto a new object
            itemCopy.name = item.name;
            itemCopy.keyPath = JSON.parse(item.keyPath);
            ['autoInc', 'indexList'].forEach(function (prop) {
                itemCopy[prop] = JSON.parse(item[prop]);
            });
            itemCopy.idbdb = this;
            const store = IDBObjectStore.__createInstance(itemCopy);
            this.__objectStores[store.name] = store;
            this.objectStoreNames.push(store.name);
        }
        this.__oldObjectStoreNames = this.objectStoreNames.clone();
    }
    IDBDatabase.prototype = IDBDatabaseAlias.prototype;
    return new IDBDatabase();
};

IDBDatabase.prototype = EventTargetFactory.createInstance();
IDBDatabase.prototype[Symbol.toStringTag] = 'IDBDatabasePrototype';

/**
 * Creates a new object store.
 * @param {string} storeName
 * @param {object} [createOptions]
 * @returns {IDBObjectStore}
 */
IDBDatabase.prototype.createObjectStore = function (storeName /* , createOptions */) {
    let createOptions = arguments[1];
    storeName = String(storeName); // W3C test within IDBObjectStore.js seems to accept string conversion
    if (!(this instanceof IDBDatabase)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No object store name was specified');
    }
    IDBTransaction.__assertVersionChange(this.__versionTransaction); // this.__versionTransaction may not exist if called mistakenly by user in onsuccess
    this.throwIfUpgradeTransactionNull();
    IDBTransaction.__assertActive(this.__versionTransaction);

    createOptions = Object.assign({}, createOptions);
    let keyPath = createOptions.keyPath;
    keyPath = keyPath === undefined ? null : keyPath = convertToSequenceDOMString(keyPath);
    if (keyPath !== null && !isValidKeyPath(keyPath)) {
        throw createDOMException('SyntaxError', 'The keyPath argument contains an invalid key path.');
    }

    if (this.__objectStores[storeName] && !this.__objectStores[storeName].__pendingDelete) {
        throw createDOMException('ConstraintError', 'Object store "' + storeName + '" already exists in ' + this.name);
    }

    const autoInc = createOptions.autoIncrement;
    if (autoInc && (keyPath === '' || Array.isArray(keyPath))) {
        throw createDOMException('InvalidAccessError', 'With autoIncrement set, the keyPath argument must not be an array or empty string.');
    }

    /** @name IDBObjectStoreProperties **/
    const storeProperties = {
        name: storeName,
        keyPath,
        autoInc,
        indexList: {},
        idbdb: this
    };
    const store = IDBObjectStore.__createInstance(storeProperties, this.__versionTransaction);
    return IDBObjectStore.__createObjectStore(this, store);
};

/**
 * Deletes an object store.
 * @param {string} storeName
 */
IDBDatabase.prototype.deleteObjectStore = function (storeName) {
    if (!(this instanceof IDBDatabase)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('No object store name was specified');
    }
    IDBTransaction.__assertVersionChange(this.__versionTransaction);
    this.throwIfUpgradeTransactionNull();
    IDBTransaction.__assertActive(this.__versionTransaction);

    const store = this.__objectStores[storeName];
    if (!store) {
        throw createDOMException('NotFoundError', 'Object store "' + storeName + '" does not exist in ' + this.name);
    }

    IDBObjectStore.__deleteObjectStore(this, store);
};

IDBDatabase.prototype.close = function () {
    if (!(this instanceof IDBDatabase)) {
        throw new TypeError('Illegal invocation');
    }
    this.__closed = true;
    if (this.__unblocking) {
        this.__unblocking.check();
    }
};

/**
 * Starts a new transaction.
 * @param {string|string[]} storeNames
 * @param {string} mode
 * @returns {IDBTransaction}
 */
IDBDatabase.prototype.transaction = function (storeNames /* , mode */) {
    if (arguments.length === 0) {
        throw new TypeError('You must supply a valid `storeNames` to `IDBDatabase.transaction`');
    }
    let mode = arguments[1];
    storeNames = isIterable(storeNames)
        ? [ // Creating new array also ensures sequence is passed by value: https://heycam.github.io/webidl/#idl-sequence
            ...new Set( // to be unique
                convertToSequenceDOMString(storeNames) // iterables have `ToString` applied (and we convert to array for convenience)
            )
        ].sort() // must be sorted
        : [convertToDOMString(storeNames)];

    /* (function () {
        throw new TypeError('You must supply a valid `storeNames` to `IDBDatabase.transaction`');
    }())); */

    // Since SQLite (at least node-websql and definitely WebSQL) requires
    //   locking of the whole database, to allow simultaneous readwrite
    //   operations on transactions without overlapping stores, we'd probably
    //   need to save the stores in separate databases (we could also consider
    //   prioritizing readonly but not starving readwrite).
    // Even for readonly transactions, due to [issue 17](https://github.com/nolanlawson/node-websql/issues/17),
    //   we're not currently actually running the SQL requests in parallel.
    if (typeof mode === 'number') {
        mode = mode === 1 ? 'readwrite' : 'readonly';
        CFG.DEBUG && console.log('Mode should be a string, but was specified as ', mode); // Todo Deprecated: Remove this option as no longer in spec
    } else {
        mode = mode || 'readonly';
    }

    IDBTransaction.__assertNotVersionChange(this.__versionTransaction);
    if (this.__closed) {
        throw createDOMException('InvalidStateError', 'An attempt was made to start a new transaction on a database connection that is not open');
    }

    const objectStoreNames = DOMStringList.__createInstance();
    storeNames.forEach((storeName) => {
        if (!this.objectStoreNames.contains(storeName)) {
            throw createDOMException('NotFoundError', 'The "' + storeName + '" object store does not exist');
        }
        objectStoreNames.push(storeName);
    });

    if (storeNames.length === 0) {
        throw createDOMException('InvalidAccessError', 'No valid object store names were specified');
    }

    if (mode !== 'readonly' && mode !== 'readwrite') {
        throw new TypeError('Invalid transaction mode: ' + mode);
    }

    // Do not set __active flag to false yet: https://github.com/w3c/IndexedDB/issues/87

    const trans = IDBTransaction.__createInstance(this, objectStoreNames, mode);
    this.__transactions.push(trans);
    return trans;
};

// See https://github.com/w3c/IndexedDB/issues/192
IDBDatabase.prototype.throwIfUpgradeTransactionNull = function () {
    if (this.__upgradeTransaction === null) {
        throw createDOMException('InvalidStateError', 'No upgrade transaction associated with database.');
    }
};

// Todo __forceClose: Add tests for `__forceClose`
IDBDatabase.prototype.__forceClose = function (msg) {
    const me = this;
    me.close();
    let ct = 0;
    me.__transactions.forEach(function (trans) {
        trans.on__abort = function () {
            ct++;
            if (ct === me.__transactions.length) {
                // Todo __forceClose: unblock any pending `upgradeneeded` or `deleteDatabase` calls
                const evt = createEvent('close');
                setTimeout(() => {
                    me.dispatchEvent(evt);
                });
            }
        };
        trans.__abortTransaction(createDOMException('AbortError', 'The connection was force-closed: ' + (msg || '')));
    });
};

listeners$2.forEach((listener) => {
    Object.defineProperty(IDBDatabase.prototype, listener, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        },
        set: function (val) {
            throw new TypeError('Illegal invocation');
        }
    });
});

readonlyProperties$6.forEach((prop) => {
    Object.defineProperty(IDBDatabase.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});

Object.defineProperty(IDBDatabase.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBDatabase
});

Object.defineProperty(IDBDatabase, 'prototype', {
    writable: false
});

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}
// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}
// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* globals location, Event */

const getOrigin = () => (typeof location !== 'object' || !location) ? 'null' : location.origin;
const hasNullOrigin = () => CFG.checkOrigin !== false && (getOrigin() === 'null');

// Todo: This really should be process and tab-independent so the
//  origin could vary; in the browser, this might be through a
//  `SharedWorker`
const connectionQueue = {};

function processNextInConnectionQueue (name, origin = getOrigin()) {
    const queueItems = connectionQueue[origin][name];
    if (!queueItems[0]) { // Nothing left to process
        return;
    }
    const {req, cb} = queueItems[0]; // Keep in queue to prevent continuation
    function removeFromQueue () {
        queueItems.shift();
        processNextInConnectionQueue(name, origin);
    }
    req.addEventListener('success', removeFromQueue);
    req.addEventListener('error', removeFromQueue);
    cb(req);
}

function addRequestToConnectionQueue (req, name, origin = getOrigin(), cb) {
    if (!connectionQueue[origin][name]) {
        connectionQueue[origin][name] = [];
    }
    connectionQueue[origin][name].push({req, cb});

    if (connectionQueue[origin][name].length === 1) { // If there are no items in the queue, we have to start it
        processNextInConnectionQueue(name, origin);
    }
}

function triggerAnyVersionChangeAndBlockedEvents (openConnections, req, oldVersion, newVersion) {
    // Todo: For Node (and in browser using service workers if available?) the
    //    connections ought to involve those in any process; should also
    //    auto-close if unloading
    const connectionIsClosed = (connection) => connection.__closed;
    const connectionsClosed = () => openConnections.every(connectionIsClosed);
    return openConnections.reduce(function (promises, entry) {
        if (connectionIsClosed(entry)) {
            return promises;
        }
        return promises.then(function () {
            if (connectionIsClosed(entry)) {
                // Prior onversionchange must have caused this connection to be closed
                return;
            }
            const e = new IDBVersionChangeEvent('versionchange', {oldVersion, newVersion});
            return new syncPromiseCommonjs(function (resolve$$1) {
                setTimeout(() => {
                    entry.dispatchEvent(e); // No need to catch errors
                    resolve$$1();
                });
            });
        });
    }, syncPromiseCommonjs.resolve()).then(function () {
        if (!connectionsClosed()) {
            return new syncPromiseCommonjs(function (resolve$$1) {
                const unblocking = {
                    check: function check () {
                        if (connectionsClosed()) {
                            resolve$$1();
                        }
                    }
                };
                const e = new IDBVersionChangeEvent('blocked', {oldVersion, newVersion});
                setTimeout(() => {
                    req.dispatchEvent(e); // No need to catch errors
                    if (!connectionsClosed()) {
                        openConnections.forEach((connection) => {
                            if (!connectionIsClosed(connection)) {
                                connection.__unblocking = unblocking;
                            }
                        });
                    } else {
                        resolve$$1();
                    }
                });
            });
        }
    });
}

const websqlDBCache = {};
let sysdb;
let nameCounter = 0;

function getLatestCachedWebSQLVersion (name) {
    return Object.keys(websqlDBCache[name]).map(Number).reduce(
        (prev, curr) => curr > prev ? curr : prev, 0
    );
}

function getLatestCachedWebSQLDB (name) {
    return websqlDBCache[name] && websqlDBCache[name][ // eslint-disable-line standard/computed-property-even-spacing
        getLatestCachedWebSQLVersion()
    ];
}

function cleanupDatabaseResources (__openDatabase, name, escapedDatabaseName, databaseDeleted, dbError) {
    const useMemoryDatabase = typeof CFG.memoryDatabase === 'string';
    if (useMemoryDatabase) {
        const latestSQLiteDBCached = websqlDBCache[name] ? getLatestCachedWebSQLDB(name) : null;
        if (!latestSQLiteDBCached) {
            console.warn('Could not find a memory database instance to delete.');
            databaseDeleted();
            return;
        }
        const sqliteDB = latestSQLiteDBCached._db && latestSQLiteDBCached._db._db;
        if (!sqliteDB || !sqliteDB.close) {
            console.error('The `openDatabase` implementation does not have the expected `._db._db.close` method for closing the database');
            return;
        }
        sqliteDB.close(function (err) {
            if (err) {
                console.warn('Error closing (destroying) memory database');
                return;
            }
            databaseDeleted();
        });
        return;
    }
    if (CFG.deleteDatabaseFiles !== false && ({}.toString.call(process) === '[object process]')) {
        require('fs').unlink(require('path').resolve(escapedDatabaseName), (err) => {
            if (err && err.code !== 'ENOENT') { // Ignore if file is already deleted
                dbError({code: 0, message: 'Error removing database file: ' + escapedDatabaseName + ' ' + err});
                return;
            }
            databaseDeleted();
        });
        return;
    }

    const sqliteDB = __openDatabase(
        path.join(CFG.databaseBasePath || '', escapedDatabaseName),
        1,
        name,
        CFG.DEFAULT_DB_SIZE
    );
    sqliteDB.transaction(function (tx) {
        tx.executeSql('SELECT "name" FROM __sys__', [], function (tx, data) {
            const tables = data.rows;
            (function deleteTables (i) {
                if (i >= tables.length) {
                    // If all tables are deleted, delete the housekeeping tables
                    tx.executeSql('DROP TABLE IF EXISTS __sys__', [], function () {
                        databaseDeleted();
                    }, dbError);
                } else {
                    // Delete all tables in this database, maintained in the sys table
                    tx.executeSql('DROP TABLE ' + escapeStoreNameForSQL(
                        unescapeSQLiteResponse( // Avoid double-escaping
                            tables.item(i).name
                        )
                    ), [], function () {
                        deleteTables(i + 1);
                    }, function () {
                        deleteTables(i + 1);
                    });
                }
            }(0));
        }, function (e) {
            // __sys__ table does not exist, but that does not mean delete did not happen
            databaseDeleted();
        });
    });
}

/**
 * Creates the sysDB to keep track of version numbers for databases
 **/
function createSysDB (__openDatabase, success, failure) {
    function sysDbCreateError (tx, err) {
        err = webSQLErrback(err || tx);
        CFG.DEBUG && console.log('Error in sysdb transaction - when creating dbVersions', err);
        failure(err);
    }

    if (sysdb) {
        success();
    } else {
        sysdb = __openDatabase(
            typeof CFG.memoryDatabase === 'string'
                ? CFG.memoryDatabase
                : path.join(
                    (typeof CFG.sysDatabaseBasePath === 'string'
                        ? CFG.sysDatabaseBasePath
                        : (CFG.databaseBasePath || '')),
                    '__sysdb__' + (CFG.addSQLiteExtension !== false ? '.sqlite' : '')
                ),
            1,
            'System Database',
            CFG.DEFAULT_DB_SIZE
        );
        sysdb.transaction(function (systx) {
            systx.executeSql('CREATE TABLE IF NOT EXISTS dbVersions (name BLOB, version INT);', [], function (systx) {
                if (!CFG.useSQLiteIndexes) {
                    success();
                    return;
                }
                systx.executeSql('CREATE INDEX IF NOT EXISTS dbvname ON dbVersions(name)', [], success, sysDbCreateError);
            }, sysDbCreateError);
        }, sysDbCreateError);
    }
}

/**
 * IDBFactory Class
 * https://w3c.github.io/IndexedDB/#idl-def-IDBFactory
 * @constructor
 */
function IDBFactory () {
    throw new TypeError('Illegal constructor');
}
const IDBFactoryAlias = IDBFactory;
IDBFactory.__createInstance = function () {
    function IDBFactory () {
        this[Symbol.toStringTag] = 'IDBFactory';
        this.modules = { // Export other shims (especially for testing)
            Event: typeof Event !== 'undefined' ? Event : ShimEvent,
            Error, // For test comparisons
            ShimEvent,
            ShimCustomEvent,
            ShimEventTarget: EventTarget,
            ShimDOMException: ShimDOMException$1,
            ShimDOMStringList: DOMStringList,
            IDBFactory: IDBFactoryAlias
        };
        this.utils = {createDOMException}; // Expose for ease in simulating such exceptions during testing
        this.__connections = {};
    }
    IDBFactory.prototype = IDBFactoryAlias.prototype;
    return new IDBFactory();
};

/**
 * The IndexedDB Method to create a new database and return the DB
 * @param {string} name
 * @param {number} version
 */
IDBFactory.prototype.open = function (name /* , version */) {
    const me = this;
    if (!(me instanceof IDBFactory)) {
        throw new TypeError('Illegal invocation');
    }
    let version = arguments[1];

    if (arguments.length === 0) {
        throw new TypeError('Database name is required');
    }
    if (version !== undefined) {
        version = enforceRange(version, 'unsigned long long');
        if (version === 0) {
            throw new TypeError('Version cannot be 0');
        }
    }
    if (hasNullOrigin()) {
        throw createDOMException('SecurityError', 'Cannot open an IndexedDB database from an opaque origin.');
    }

    const req = IDBOpenDBRequest.__createInstance();
    let calledDbCreateError = false;

    if (CFG.autoName && name === '') {
        name = 'autoNamedDatabase_' + nameCounter++;
    }
    name = String(name); // cast to a string
    const sqlSafeName = escapeSQLiteStatement(name);

    const useMemoryDatabase = typeof CFG.memoryDatabase === 'string';
    const useDatabaseCache = CFG.cacheDatabaseInstances !== false || useMemoryDatabase;

    let escapedDatabaseName;
    try {
        escapedDatabaseName = escapeDatabaseNameForSQLAndFiles(name);
    } catch (err) {
        throw err; // new TypeError('You have supplied a database name which does not match the currently supported configuration, possibly due to a length limit enforced for Node compatibility.');
    }

    function dbCreateError (tx, err) {
        if (calledDbCreateError) {
            return;
        }
        err = err ? webSQLErrback(err) : tx;
        calledDbCreateError = true;
        // Re: why bubbling here (and how cancelable is only really relevant for `window.onerror`) see: https://github.com/w3c/IndexedDB/issues/86
        const evt = createEvent('error', err, {bubbles: true, cancelable: true});
        req.__readyState = 'done';
        req.__error = err;
        req.__result = undefined; // Must be undefined if an error per `result` getter
        req.dispatchEvent(evt);
    }

    function setupDatabase (tx, db, oldVersion) {
        tx.executeSql('SELECT "name", "keyPath", "autoInc", "indexList" FROM __sys__', [], function (tx, data) {
            function finishRequest () {
                req.__result = connection;
                req.__readyState = 'done'; // https://github.com/w3c/IndexedDB/pull/202
            }
            const connection = IDBDatabase.__createInstance(db, name, oldVersion, version, data);
            if (!me.__connections[name]) {
                me.__connections[name] = [];
            }
            me.__connections[name].push(connection);

            if (oldVersion < version) {
                const openConnections = me.__connections[name].slice(0, -1);
                triggerAnyVersionChangeAndBlockedEvents(openConnections, req, oldVersion, version).then(function () {
                    // DB Upgrade in progress
                    let sysdbFinishedCb = function (systx, err, cb) {
                        if (err) {
                            try {
                                systx.executeSql('ROLLBACK', [], cb, cb);
                            } catch (er) {
                                // Browser may fail with expired transaction above so
                                //     no choice but to manually revert
                                sysdb.transaction(function (systx) {
                                    function reportError (msg) {
                                        throw new Error('Unable to roll back upgrade transaction!' + (msg || ''));
                                    }

                                    // Attempt to revert
                                    if (oldVersion === 0) {
                                        systx.executeSql('DELETE FROM dbVersions WHERE "name" = ?', [sqlSafeName], function () {
                                            cb(reportError);
                                        }, reportError);
                                    } else {
                                        systx.executeSql('UPDATE dbVersions SET "version" = ? WHERE "name" = ?', [oldVersion, sqlSafeName], cb, reportError);
                                    }
                                });
                            }
                            return;
                        }
                        cb(); // In browser, should auto-commit
                    };

                    sysdb.transaction(function (systx) {
                        function versionSet () {
                            const e = new IDBVersionChangeEvent('upgradeneeded', {oldVersion, newVersion: version});
                            req.__result = connection;
                            connection.__upgradeTransaction = req.__transaction = req.__result.__versionTransaction = IDBTransaction.__createInstance(req.__result, req.__result.objectStoreNames, 'versionchange');
                            req.__readyState = 'done';
                            req.transaction.__addNonRequestToTransactionQueue(function onupgradeneeded (tx, args, finished, error) {
                                req.dispatchEvent(e);
                                if (e.__legacyOutputDidListenersThrowError) {
                                    logError('Error', 'An error occurred in an upgradeneeded handler attached to request chain', e.__legacyOutputDidListenersThrowError); // We do nothing else with this error as per spec
                                    req.transaction.__abortTransaction(createDOMException('AbortError', 'A request was aborted.'));
                                    return;
                                }
                                finished();
                            });
                            req.transaction.on__beforecomplete = function (ev) {
                                connection.__upgradeTransaction = null;
                                req.__result.__versionTransaction = null;
                                sysdbFinishedCb(systx, false, function () {
                                    req.transaction.__transFinishedCb(false, function () {
                                        if (useDatabaseCache) {
                                            if (name in websqlDBCache) {
                                                delete websqlDBCache[name][version];
                                            }
                                        }
                                        ev.complete();
                                        req.__transaction = null;
                                    });
                                });
                            };
                            req.transaction.on__preabort = function () {
                                connection.__upgradeTransaction = null;
                                // We ensure any cache is deleted before any request error events fire and try to reopen
                                if (useDatabaseCache) {
                                    if (name in websqlDBCache) {
                                        delete websqlDBCache[name][version];
                                    }
                                }
                            };
                            req.transaction.on__abort = function () {
                                req.__transaction = null;
                                // `readyState` and `result` will be reset anyways by `dbCreateError` but we follow spec:
                                //    see https://github.com/w3c/IndexedDB/issues/161 and
                                //    https://github.com/w3c/IndexedDB/pull/202
                                req.__result = undefined;
                                req.__readyState = 'pending';

                                connection.close();
                                setTimeout(() => {
                                    const err = createDOMException('AbortError', 'The upgrade transaction was aborted.');
                                    sysdbFinishedCb(systx, err, function (reportError) {
                                        if (oldVersion === 0) {
                                            cleanupDatabaseResources(me.__openDatabase, name, escapedDatabaseName, dbCreateError.bind(null, err), reportError || dbCreateError);
                                            return;
                                        }
                                        dbCreateError(err);
                                    });
                                });
                            };
                            req.transaction.on__complete = function () {
                                if (req.__result.__closed) {
                                    req.__transaction = null;
                                    const err = createDOMException('AbortError', 'The connection has been closed.');
                                    dbCreateError(err);
                                    return;
                                }
                                // Since this is running directly after `IDBTransaction.complete`,
                                //   there should be a new task. However, while increasing the
                                //   timeout 1ms in `IDBTransaction.__executeRequests` can allow
                                //   `IDBOpenDBRequest.onsuccess` to trigger faster than a new
                                //   transaction as required by "transaction-create_in_versionchange" in
                                //   w3c/Transaction.js (though still on a timeout separate from this
                                //   preceding `IDBTransaction.oncomplete`), this causes a race condition
                                //   somehow with old transactions (e.g., for the Mocha test,
                                //   in `IDBObjectStore.deleteIndex`, "should delete an index that was
                                //   created in a previous transaction").
                                // setTimeout(() => {

                                finishRequest();

                                req.__transaction = null;
                                const e = createEvent('success');
                                req.dispatchEvent(e);
                                // });
                            };
                        }
                        if (oldVersion === 0) {
                            systx.executeSql('INSERT INTO dbVersions VALUES (?,?)', [sqlSafeName, version], versionSet, dbCreateError);
                        } else {
                            systx.executeSql('UPDATE dbVersions SET "version" = ? WHERE "name" = ?', [version, sqlSafeName], versionSet, dbCreateError);
                        }
                    }, dbCreateError, null, function (currentTask, err, done, rollback, commit) {
                        if (currentTask.readOnly || err) {
                            return true;
                        }
                        sysdbFinishedCb = function (systx, err, cb) {
                            if (err) {
                                rollback(err, cb);
                            } else {
                                commit(cb);
                            }
                        };
                        return false;
                    });
                });
            } else {
                finishRequest();

                const e = createEvent('success');
                req.dispatchEvent(e);
            }
        }, dbCreateError);
    }

    function openDB (oldVersion) {
        let db;
        if ((useMemoryDatabase || useDatabaseCache) && name in websqlDBCache && websqlDBCache[name][version]) {
            db = websqlDBCache[name][version];
        } else {
            db = me.__openDatabase(
                useMemoryDatabase ? CFG.memoryDatabase : path.join(CFG.databaseBasePath || '', escapedDatabaseName),
                1,
                name,
                CFG.DEFAULT_DB_SIZE
            );
            if (useDatabaseCache) {
                websqlDBCache[name][version] = db;
            }
        }

        if (version === undefined) {
            version = oldVersion || 1;
        }
        if (oldVersion > version) {
            const err = createDOMException('VersionError', 'An attempt was made to open a database using a lower version than the existing version.', version);
            dbCreateError(err);
            return;
        }

        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS __sys__ (name BLOB, keyPath BLOB, autoInc BOOLEAN, indexList BLOB, currNum INTEGER)', [], function () {
                function setup () {
                    setupDatabase(tx, db, oldVersion);
                }
                if (!CFG.createIndexes) {
                    setup();
                    return;
                }
                tx.executeSql('CREATE INDEX IF NOT EXISTS sysname ON __sys__(name)', [], setup, dbCreateError);
            }, dbCreateError);
        }, dbCreateError);
    }

    addRequestToConnectionQueue(req, name, /* origin */ undefined, function (req) {
        let latestCachedVersion;
        if (useDatabaseCache) {
            if (!(name in websqlDBCache)) {
                websqlDBCache[name] = {};
            }
            if (version === undefined) {
                latestCachedVersion = getLatestCachedWebSQLVersion(name);
            } else if (websqlDBCache[name][version]) {
                latestCachedVersion = version;
            }
        }
        if (latestCachedVersion) {
            openDB(latestCachedVersion);
        } else {
            createSysDB(me.__openDatabase, function () {
                sysdb.readTransaction(function (sysReadTx) {
                    sysReadTx.executeSql('SELECT "version" FROM dbVersions WHERE "name" = ?', [sqlSafeName], function (sysReadTx, data) {
                        if (data.rows.length === 0) {
                            // Database with this name does not exist
                            openDB(0);
                        } else {
                            openDB(data.rows.item(0).version);
                        }
                    }, dbCreateError);
                }, dbCreateError);
            }, dbCreateError);
        }
    });

    return req;
};

/**
 * Deletes a database
 * @param {string} name
 * @returns {IDBOpenDBRequest}
 */
IDBFactory.prototype.deleteDatabase = function (name) {
    const me = this;
    if (!(me instanceof IDBFactory)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length === 0) {
        throw new TypeError('Database name is required');
    }
    if (hasNullOrigin()) {
        throw createDOMException('SecurityError', 'Cannot delete an IndexedDB database from an opaque origin.');
    }

    name = String(name); // cast to a string
    const sqlSafeName = escapeSQLiteStatement(name);

    let escapedDatabaseName;
    try {
        escapedDatabaseName = escapeDatabaseNameForSQLAndFiles(name);
    } catch (err) {
        throw err; // throw new TypeError('You have supplied a database name which does not match the currently supported configuration, possibly due to a length limit enforced for Node compatibility.');
    }

    const useMemoryDatabase = typeof CFG.memoryDatabase === 'string';
    const useDatabaseCache = CFG.cacheDatabaseInstances !== false || useMemoryDatabase;

    const req = IDBOpenDBRequest.__createInstance();
    let calledDBError = false;
    let version = 0;

    let sysdbFinishedCbDelete = function (err, cb) {
        cb(err);
    };

    // Although the spec has no specific conditions where an error
    //  may occur in `deleteDatabase`, it does provide for
    //  `UnknownError` as we may require upon a SQL deletion error
    function dbError (tx, err) {
        if (calledDBError || err === true) {
            return;
        }
        err = webSQLErrback(err || tx);
        sysdbFinishedCbDelete(true, function () {
            req.__readyState = 'done';
            req.__error = err;
            req.__result = undefined; // Must be undefined if an error per `result` getter
            // Re: why bubbling here (and how cancelable is only really relevant for `window.onerror`) see: https://github.com/w3c/IndexedDB/issues/86
            const e = createEvent('error', err, {bubbles: true, cancelable: true});
            req.dispatchEvent(e);
            calledDBError = true;
        });
    }

    addRequestToConnectionQueue(req, name, /* origin */ undefined, function (req) {
        createSysDB(me.__openDatabase, function () {
            // function callback (cb) { cb(); }
            // callback(function () {

            function completeDatabaseDelete () {
                req.__result = undefined;
                req.__readyState = 'done'; // https://github.com/w3c/IndexedDB/pull/202
                const e = new IDBVersionChangeEvent('success', {oldVersion: version, newVersion: null});
                req.dispatchEvent(e);
            }

            function databaseDeleted () {
                sysdbFinishedCbDelete(false, function () {
                    if (useDatabaseCache && name in websqlDBCache) {
                        delete websqlDBCache[name]; // New calls will treat as though never existed
                    }
                    delete me.__connections[name];

                    completeDatabaseDelete();
                });
            }
            sysdb.readTransaction(function (sysReadTx) {
                sysReadTx.executeSql('SELECT "version" FROM dbVersions WHERE "name" = ?', [sqlSafeName], function (sysReadTx, data) {
                    if (data.rows.length === 0) {
                        completeDatabaseDelete();
                        return;
                    }
                    version = data.rows.item(0).version;

                    const openConnections = me.__connections[name] || [];
                    triggerAnyVersionChangeAndBlockedEvents(openConnections, req, version, null).then(function () {
                        // Since we need two databases which can't be in a single transaction, we
                        //  do this deleting from `dbVersions` first since the `__sys__` deleting
                        //  only impacts file memory whereas this one is critical for avoiding it
                        //  being found via `open` or `webkitGetDatabaseNames`; however, we will
                        //  avoid committing anyways until all deletions are made and rollback the
                        //  `dbVersions` change if they fail
                        sysdb.transaction(function (systx) {
                            systx.executeSql('DELETE FROM dbVersions WHERE "name" = ? ', [sqlSafeName], function () {
                                // Todo: We should also check whether `dbVersions` is empty and if so, delete upon
                                //    `deleteDatabaseFiles` config. We also ought to do this when aborting (see
                                //    above code with `DELETE FROM dbVersions`)
                                cleanupDatabaseResources(me.__openDatabase, name, escapedDatabaseName, databaseDeleted, dbError);
                            }, dbError);
                        }, dbError, null, function (currentTask, err, done, rollback, commit) {
                            if (currentTask.readOnly || err) {
                                return true;
                            }
                            sysdbFinishedCbDelete = function (err, cb) {
                                if (err) {
                                    rollback(err, cb);
                                } else {
                                    commit(cb);
                                }
                            };
                            return false;
                        });
                    }, dbError);
                }, dbError);
            });
        }, dbError);
    });

    return req;
};

IDBFactory.prototype.cmp = function (key1, key2) {
    if (!(this instanceof IDBFactory)) {
        throw new TypeError('Illegal invocation');
    }
    if (arguments.length < 2) {
        throw new TypeError('You must provide two keys to be compared');
    }
    // We use encoding facilities already built for proper sorting;
    //   the following "conversions" are for validation only
    convertValueToKeyRethrowingAndIfInvalid(key1);
    convertValueToKeyRethrowingAndIfInvalid(key2);
    return cmp(key1, key2);
};

/**
* NON-STANDARD!! (Also may return outdated information if a database has since been deleted)
* @link https://www.w3.org/Bugs/Public/show_bug.cgi?id=16137
* @link http://lists.w3.org/Archives/Public/public-webapps/2011JulSep/1537.html
*/
IDBFactory.prototype.webkitGetDatabaseNames = function () {
    const me = this;
    if (!(me instanceof IDBFactory)) {
        throw new TypeError('Illegal invocation');
    }
    if (hasNullOrigin()) {
        throw createDOMException('SecurityError', 'Cannot get IndexedDB database names from an opaque origin.');
    }

    let calledDbCreateError = false;
    function dbGetDatabaseNamesError (tx, err) {
        if (calledDbCreateError) {
            return;
        }
        err = err ? webSQLErrback(err) : tx;
        calledDbCreateError = true;
        // Re: why bubbling here (and how cancelable is only really relevant for `window.onerror`) see: https://github.com/w3c/IndexedDB/issues/86
        const evt = createEvent('error', err, {bubbles: true, cancelable: true}); // http://stackoverflow.com/questions/40165909/to-where-do-idbopendbrequest-error-events-bubble-up/40181108#40181108
        req.__readyState = 'done';
        req.__error = err;
        req.__result = undefined; // Must be undefined if an error per `result` getter
        req.dispatchEvent(evt);
    }
    const req = IDBRequest.__createInstance();
    createSysDB(me.__openDatabase, function () {
        sysdb.readTransaction(function (sysReadTx) {
            sysReadTx.executeSql('SELECT "name" FROM dbVersions', [], function (sysReadTx, data) {
                const dbNames = DOMStringList.__createInstance();
                for (let i = 0; i < data.rows.length; i++) {
                    dbNames.push(unescapeSQLiteResponse(data.rows.item(i).name));
                }
                req.__result = dbNames;
                req.__readyState = 'done'; // https://github.com/w3c/IndexedDB/pull/202
                const e = createEvent('success'); // http://stackoverflow.com/questions/40165909/to-where-do-idbopendbrequest-error-events-bubble-up/40181108#40181108
                req.dispatchEvent(e);
            }, dbGetDatabaseNamesError);
        }, dbGetDatabaseNamesError);
    }, dbGetDatabaseNamesError);
    return req;
};

/**
* @Todo __forceClose: Test
* This is provided to facilitate unit-testing of the
*  closing of a database connection with a forced flag:
* <http://w3c.github.io/IndexedDB/#steps-for-closing-a-database-connection>
*/
IDBFactory.prototype.__forceClose = function (dbName, connIdx, msg) {
    const me = this;
    function forceClose (conn) {
        conn.__forceClose(msg);
    }
    if (dbName == null) {
        Object.values(me.__connections).forEach((conn) => conn.forEach(forceClose));
    } else if (!me.__connections[dbName]) {
        console.log('No database connections with that name to force close');
    } else if (connIdx == null) {
        me.__connections[dbName].forEach(forceClose);
    } else if (!Number.isInteger(connIdx) || connIdx < 0 || connIdx > me.__connections[dbName].length - 1) {
        throw new TypeError(
            'If providing an argument, __forceClose must be called with a ' +
            'numeric index to indicate a specific connection to lose'
        );
    } else {
        forceClose(me.__connections[dbName][connIdx]);
    }
};

IDBFactory.prototype.__setConnectionQueueOrigin = function (origin = getOrigin()) {
    connectionQueue[origin] = {};
};

IDBFactory.prototype[Symbol.toStringTag] = 'IDBFactoryPrototype';

Object.defineProperty(IDBFactory, 'prototype', {
    writable: false
});

const shimIndexedDB = IDBFactory.__createInstance();

/**
 * The IndexedDB Cursor Object
 * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBCursor
 * @param {IDBKeyRange} range
 * @param {string} direction
 * @param {IDBObjectStore} store
 * @param {IDBObjectStore|IDBIndex} source
 * @param {string} keyColumnName
 * @param {string} valueColumnName
 * @param {boolean} count
 */
function IDBCursor () {
    throw new TypeError('Illegal constructor');
}
const IDBCursorAlias = IDBCursor;
IDBCursor.__super = function IDBCursor (query, direction, store, source, keyColumnName, valueColumnName, count) {
    this[Symbol.toStringTag] = 'IDBCursor';
    defineReadonlyProperties(this, ['key', 'primaryKey']);
    IDBObjectStore.__invalidStateIfDeleted(store);
    this.__indexSource = instanceOf(source, IDBIndex);
    if (this.__indexSource) IDBIndex.__invalidStateIfDeleted(source);
    IDBTransaction.__assertActive(store.transaction);
    const range = convertValueToKeyRange(query);
    if (direction !== undefined && !(['next', 'prev', 'nextunique', 'prevunique'].includes(direction))) {
        throw new TypeError(direction + 'is not a valid cursor direction');
    }

    Object.defineProperties(this, {
        // Babel is not respecting default writable false here, so make explicit
        source: {writable: false, value: source},
        direction: {writable: false, value: direction || 'next'}
    });
    this.__key = undefined;
    this.__primaryKey = undefined;

    this.__store = store;
    this.__range = range;
    this.__req = IDBRequest.__createInstance();
    this.__req.__source = source;
    this.__req.__transaction = this.__store.transaction;
    this.__keyColumnName = keyColumnName;
    this.__valueColumnName = valueColumnName;
    this.__keyOnly = valueColumnName === 'key';
    this.__valueDecoder = this.__keyOnly ? Key : Sca;
    this.__count = count;
    this.__prefetchedIndex = -1;
    this.__multiEntryIndex = this.__indexSource ? source.multiEntry : false;
    this.__unique = this.direction.includes('unique');
    this.__sqlDirection = ['prev', 'prevunique'].includes(this.direction) ? 'DESC' : 'ASC';

    if (range !== undefined) {
        // Encode the key range and cache the encoded values, so we don't have to re-encode them over and over
        range.__lowerCached = range.lower !== undefined && encode(range.lower, this.__multiEntryIndex);
        range.__upperCached = range.upper !== undefined && encode(range.upper, this.__multiEntryIndex);
    }
    this.__gotValue = true;
    this['continue']();
};

IDBCursor.__createInstance = function (...args) {
    const IDBCursor = IDBCursorAlias.__super;
    IDBCursor.prototype = IDBCursorAlias.prototype;
    return new IDBCursor(...args);
};

IDBCursor.prototype.__find = function (...args /* key, tx, success, error, recordsToLoad */) {
    if (this.__multiEntryIndex) {
        this.__findMultiEntry(...args);
    } else {
        this.__findBasic(...args);
    }
};

IDBCursor.prototype.__findBasic = function (key, primaryKey, tx, success, error, recordsToLoad) {
    const continueCall = recordsToLoad !== undefined;
    recordsToLoad = recordsToLoad || 1;

    const me = this;
    const quotedKeyColumnName = sqlQuote(me.__keyColumnName);
    const quotedKey = sqlQuote('key');
    let sql = ['SELECT * FROM', escapeStoreNameForSQL(me.__store.__currentName)];
    const sqlValues = [];
    sql.push('WHERE', quotedKeyColumnName, 'NOT NULL');
    setSQLForKeyRange(me.__range, quotedKeyColumnName, sql, sqlValues, true, true);

    // Determine the ORDER BY direction based on the cursor.
    const direction = me.__sqlDirection;
    const op = direction === 'ASC' ? '>' : '<';

    if (primaryKey !== undefined) {
        sql.push('AND', quotedKey, op + '= ?');
        // Key.convertValueToKey(primaryKey); // Already checked by `continuePrimaryKey`
        sqlValues.push(encode(primaryKey));
    }
    if (key !== undefined) {
        sql.push('AND', quotedKeyColumnName, op + '= ?');
        // Key.convertValueToKey(key); // Already checked by `continue` or `continuePrimaryKey`
        sqlValues.push(encode(key));
    } else if (continueCall && me.__key !== undefined) {
        sql.push('AND', quotedKeyColumnName, op + ' ?');
        // Key.convertValueToKey(me.__key); // Already checked when stored
        sqlValues.push(encode(me.__key));
    }

    if (!me.__count) {
        // 1. Sort by key
        sql.push('ORDER BY', quotedKeyColumnName, direction);

        if (me.__keyColumnName !== 'key') { // Avoid adding 'key' twice
            if (!me.__unique) {
                // 2. Sort by primaryKey (if defined and not unique)
                // 3. Sort by position (if defined)
                sql.push(',', quotedKey, direction);
            } else if (me.direction === 'prevunique') {
                // Sort by first record with key matching
                sql.push(',', quotedKey, 'ASC');
            }
        }

        if (!me.__unique && me.__indexSource) {
            // 4. Sort by object store position (if defined and not unique)
            sql.push(',', sqlQuote(me.__valueColumnName), direction);
        }
        sql.push('LIMIT', recordsToLoad);
    }
    sql = sql.join(' ');
    CFG.DEBUG && console.log(sql, sqlValues);

    tx.executeSql(sql, sqlValues, function (tx, data) {
        if (me.__count) {
            success(undefined, data.rows.length, undefined);
        } else if (data.rows.length > 1) {
            me.__prefetchedIndex = 0;
            me.__prefetchedData = data.rows;
            CFG.DEBUG && console.log('Preloaded ' + me.__prefetchedData.length + ' records for cursor');
            me.__decode(data.rows.item(0), success);
        } else if (data.rows.length === 1) {
            me.__decode(data.rows.item(0), success);
        } else {
            CFG.DEBUG && console.log('Reached end of cursors');
            success(undefined, undefined, undefined);
        }
    }, function (tx, err) {
        CFG.DEBUG && console.log('Could not execute Cursor.continue', sql, sqlValues);
        error(err);
    });
};

IDBCursor.prototype.__findMultiEntry = function (key, primaryKey, tx, success, error) {
    const me = this;

    if (me.__prefetchedData && me.__prefetchedData.length === me.__prefetchedIndex) {
        CFG.DEBUG && console.log('Reached end of multiEntry cursor');
        success(undefined, undefined, undefined);
        return;
    }

    const quotedKeyColumnName = sqlQuote(me.__keyColumnName);
    let sql = ['SELECT * FROM', escapeStoreNameForSQL(me.__store.__currentName)];
    const sqlValues = [];
    sql.push('WHERE', quotedKeyColumnName, 'NOT NULL');
    if (me.__range && (me.__range.lower !== undefined && Array.isArray(me.__range.upper))) {
        if (me.__range.upper.indexOf(me.__range.lower) === 0) {
            sql.push('AND', quotedKeyColumnName, "LIKE ? ESCAPE '^'");
            sqlValues.push('%' + sqlLIKEEscape(me.__range.__lowerCached.slice(0, -1)) + '%');
        }
    }

    // Determine the ORDER BY direction based on the cursor.
    const direction = me.__sqlDirection;
    const op = direction === 'ASC' ? '>' : '<';
    const quotedKey = sqlQuote('key');

    if (primaryKey !== undefined) {
        sql.push('AND', quotedKey, op + '= ?');
        // Key.convertValueToKey(primaryKey); // Already checked by `continuePrimaryKey`
        sqlValues.push(encode(primaryKey));
    }
    if (key !== undefined) {
        sql.push('AND', quotedKeyColumnName, op + '= ?');
        // Key.convertValueToKey(key); // Already checked by `continue` or `continuePrimaryKey`
        sqlValues.push(encode(key));
    } else if (me.__key !== undefined) {
        sql.push('AND', quotedKeyColumnName, op + ' ?');
        // Key.convertValueToKey(me.__key); // Already checked when entered
        sqlValues.push(encode(me.__key));
    }

    if (!me.__count) {
        // 1. Sort by key
        sql.push('ORDER BY', quotedKeyColumnName, direction);

        // 2. Sort by primaryKey (if defined and not unique)
        if (!me.__unique && me.__keyColumnName !== 'key') { // Avoid adding 'key' twice
            sql.push(',', sqlQuote('key'), direction);
        }

        // 3. Sort by position (if defined)

        if (!me.__unique && me.__indexSource) {
            // 4. Sort by object store position (if defined and not unique)
            sql.push(',', sqlQuote(me.__valueColumnName), direction);
        }
    }
    sql = sql.join(' ');
    CFG.DEBUG && console.log(sql, sqlValues);

    tx.executeSql(sql, sqlValues, function (tx, data) {
        if (data.rows.length > 0) {
            if (me.__count) { // Avoid caching and other processing below
                let ct = 0;
                for (let i = 0; i < data.rows.length; i++) {
                    const rowItem = data.rows.item(i);
                    const rowKey = decode(rowItem[me.__keyColumnName], true);
                    const matches = findMultiEntryMatches(rowKey, me.__range);
                    ct += matches.length;
                }
                success(undefined, ct, undefined);
                return;
            }
            const rows = [];
            for (let i = 0; i < data.rows.length; i++) {
                const rowItem = data.rows.item(i);
                const rowKey = decode(rowItem[me.__keyColumnName], true);
                const matches = findMultiEntryMatches(rowKey, me.__range);

                for (let j = 0; j < matches.length; j++) {
                    const matchingKey = matches[j];
                    const clone = {
                        matchingKey: encode(matchingKey, true),
                        key: rowItem.key
                    };
                    clone[me.__keyColumnName] = rowItem[me.__keyColumnName];
                    clone[me.__valueColumnName] = rowItem[me.__valueColumnName];
                    rows.push(clone);
                }
            }
            const reverse = me.direction.indexOf('prev') === 0;
            rows.sort(function (a, b) {
                if (a.matchingKey.replace('[', 'z') < b.matchingKey.replace('[', 'z')) {
                    return reverse ? 1 : -1;
                }
                if (a.matchingKey.replace('[', 'z') > b.matchingKey.replace('[', 'z')) {
                    return reverse ? -1 : 1;
                }
                if (a.key < b.key) {
                    return me.direction === 'prev' ? 1 : -1;
                }
                if (a.key > b.key) {
                    return me.direction === 'prev' ? -1 : 1;
                }
                return 0;
            });

            if (rows.length > 1) {
                me.__prefetchedIndex = 0;
                me.__prefetchedData = {
                    data: rows,
                    length: rows.length,
                    item: function (index) {
                        return this.data[index];
                    }
                };
                CFG.DEBUG && console.log('Preloaded ' + me.__prefetchedData.length + ' records for multiEntry cursor');
                me.__decode(rows[0], success);
            } else if (rows.length === 1) {
                CFG.DEBUG && console.log('Reached end of multiEntry cursor');
                me.__decode(rows[0], success);
            } else {
                CFG.DEBUG && console.log('Reached end of multiEntry cursor');
                success(undefined, undefined, undefined);
            }
        } else {
            CFG.DEBUG && console.log('Reached end of multiEntry cursor');
            success(undefined, undefined, undefined);
        }
    }, function (tx, err) {
        CFG.DEBUG && console.log('Could not execute Cursor.continue', sql, sqlValues);
        error(err);
    });
};

/**
 * Creates an "onsuccess" callback
 * @private
 */
IDBCursor.prototype.__onsuccess = function (success) {
    const me = this;
    return function (key, value, primaryKey) {
        if (me.__count) {
            success(value, me.__req);
        } else {
            if (key !== undefined) {
                me.__gotValue = true;
            }
            me.__key = key === undefined ? null : key;
            me.__primaryKey = primaryKey === undefined ? null : primaryKey;
            me.__value = value === undefined ? null : value;
            const result = key === undefined ? null : me;
            success(result, me.__req);
        }
    };
};

IDBCursor.prototype.__decode = function (rowItem, callback) {
    const me = this;
    if (me.__multiEntryIndex && me.__unique) {
        if (!me.__matchedKeys) {
            me.__matchedKeys = {};
        }
        if (me.__matchedKeys[rowItem.matchingKey]) {
            callback(undefined, undefined, undefined); // eslint-disable-line standard/no-callback-literal
            return;
        }
        me.__matchedKeys[rowItem.matchingKey] = true;
    }
    const encKey = unescapeSQLiteResponse(me.__multiEntryIndex
        ? rowItem.matchingKey
        : rowItem[me.__keyColumnName]
    );
    const encVal = unescapeSQLiteResponse(rowItem[me.__valueColumnName]);
    const encPrimaryKey = unescapeSQLiteResponse(rowItem.key);

    const key = decode(
        encKey,
        me.__multiEntryIndex
    );
    const val = me.__valueDecoder.decode(encVal);
    const primaryKey = decode(encPrimaryKey);
    callback(key, val, primaryKey, encKey /*, encVal, encPrimaryKey */);
};

IDBCursor.prototype.__sourceOrEffectiveObjStoreDeleted = function () {
    IDBObjectStore.__invalidStateIfDeleted(this.__store, "The cursor's effective object store has been deleted");
    if (this.__indexSource) IDBIndex.__invalidStateIfDeleted(this.source, "The cursor's index source has been deleted");
};

IDBCursor.prototype.__invalidateCache = function () {
    this.__prefetchedData = null;
};

IDBCursor.prototype.__continue = function (key, advanceContinue) {
    const me = this;
    const advanceState = me.__advanceCount !== undefined;
    IDBTransaction.__assertActive(me.__store.transaction);
    me.__sourceOrEffectiveObjStoreDeleted();
    if (!me.__gotValue && !advanceContinue) {
        throw createDOMException('InvalidStateError', 'The cursor is being iterated or has iterated past its end.');
    }
    if (key !== undefined) {
        convertValueToKeyRethrowingAndIfInvalid(key);
        const cmpResult = cmp(key, me.key);
        if (cmpResult === 0 ||
            (me.direction.includes('next') && cmpResult === -1) ||
            (me.direction.includes('prev') && cmpResult === 1)
        ) {
            throw createDOMException('DataError', 'Cannot ' + (advanceState ? 'advance' : 'continue') + ' the cursor in an unexpected direction');
        }
    }
    this.__continueFinish(key, undefined, advanceState);
};

IDBCursor.prototype.__continueFinish = function (key, primaryKey, advanceState) {
    const me = this;
    const recordsToPreloadOnContinue = me.__advanceCount || CFG.cursorPreloadPackSize || 100;
    me.__gotValue = false;
    me.__req.__readyState = 'pending'; // Unset done flag

    me.__store.transaction.__pushToQueue(me.__req, function cursorContinue (tx, args, success, error, executeNextRequest) {
        function triggerSuccess (k, val, primKey) {
            if (advanceState) {
                if (me.__advanceCount >= 2 && k !== undefined) {
                    me.__advanceCount--;
                    me.__key = k;
                    me.__continue(undefined, true);
                    executeNextRequest(); // We don't call success yet but do need to advance the transaction queue
                    return;
                }
                me.__advanceCount = undefined;
            }
            me.__onsuccess(success)(k, val, primKey);
        }
        if (me.__prefetchedData) {
            // We have pre-loaded data for the cursor
            me.__prefetchedIndex++;
            if (me.__prefetchedIndex < me.__prefetchedData.length) {
                me.__decode(me.__prefetchedData.item(me.__prefetchedIndex), function (k, val, primKey, encKey) {
                    function checkKey () {
                        const cmpResult = key === undefined || cmp(k, key);
                        if (cmpResult > 0 || (
                            cmpResult === 0 && (
                                me.__unique || primaryKey === undefined || cmp(primKey, primaryKey) >= 0
                            )
                        )) {
                            triggerSuccess(k, val, primKey);
                            return;
                        }
                        cursorContinue(tx, args, success, error);
                    }
                    if (me.__unique && !me.__multiEntryIndex &&
                        encKey === encode(me.key, me.__multiEntryIndex)) {
                        cursorContinue(tx, args, success, error);
                        return;
                    }
                    checkKey();
                });
                return;
            }
        }

        // No (or not enough) pre-fetched data, do query
        me.__find(key, primaryKey, tx, triggerSuccess, function (...args) {
            me.__advanceCount = undefined;
            error(...args);
        }, recordsToPreloadOnContinue);
    });
};

IDBCursor.prototype['continue'] = function (/* key */) {
    this.__continue(arguments[0]);
};

IDBCursor.prototype.continuePrimaryKey = function (key, primaryKey) {
    const me = this;
    IDBTransaction.__assertActive(me.__store.transaction);
    me.__sourceOrEffectiveObjStoreDeleted();
    if (!me.__indexSource) {
        throw createDOMException('InvalidAccessError', '`continuePrimaryKey` may only be called on an index source.');
    }
    if (!['next', 'prev'].includes(me.direction)) {
        throw createDOMException('InvalidAccessError', '`continuePrimaryKey` may not be called with unique cursors.');
    }
    if (!me.__gotValue) {
        throw createDOMException('InvalidStateError', 'The cursor is being iterated or has iterated past its end.');
    }
    convertValueToKeyRethrowingAndIfInvalid(key);
    convertValueToKeyRethrowingAndIfInvalid(primaryKey);

    const cmpResult = cmp(key, me.key);
    if (
        (me.direction === 'next' && cmpResult === -1) ||
        (me.direction === 'prev' && cmpResult === 1)
    ) {
        throw createDOMException('DataError', 'Cannot continue the cursor in an unexpected direction');
    }
    function noErrors () {
        me.__continueFinish(key, primaryKey, false);
    }
    if (cmpResult === 0) {
        encode$1(primaryKey, function (encPrimaryKey) {
            encode$1(me.primaryKey, function (encObjectStorePos) {
                if (encPrimaryKey === encObjectStorePos ||
                    (me.direction === 'next' && encPrimaryKey < encObjectStorePos) ||
                    (me.direction === 'prev' && encPrimaryKey > encObjectStorePos)
                ) {
                    throw createDOMException('DataError', 'Cannot continue the cursor in an unexpected direction');
                }
                noErrors();
            });
        });
    } else {
        noErrors();
    }
};

IDBCursor.prototype.advance = function (count) {
    const me = this;
    count = enforceRange(count, 'unsigned long');
    if (count === 0) {
        throw new TypeError('Calling advance() with count argument 0');
    }
    if (me.__gotValue) { // Only set the count if not running in error (otherwise will override earlier good advance calls)
        me.__advanceCount = count;
    }
    me.__continue();
};

IDBCursor.prototype.update = function (valueToUpdate) {
    const me = this;
    if (!arguments.length) throw new TypeError('A value must be passed to update()');
    IDBTransaction.__assertActive(me.__store.transaction);
    me.__store.transaction.__assertWritable();
    me.__sourceOrEffectiveObjStoreDeleted();
    if (!me.__gotValue) {
        throw createDOMException('InvalidStateError', 'The cursor is being iterated or has iterated past its end.');
    }
    if (me.__keyOnly) {
        throw createDOMException('InvalidStateError', 'This cursor method cannot be called when the key only flag has been set.');
    }
    const request = me.__store.transaction.__createRequest(me);
    const key = me.primaryKey;
    function addToQueue (clonedValue) {
        // We set the `invalidateCache` argument to `false` since the old value shouldn't be accessed
        IDBObjectStore.__storingRecordObjectStore(request, me.__store, false, clonedValue, false, key);
    }
    if (me.__store.keyPath !== null) {
        const [evaluatedKey, clonedValue] = me.__store.__validateKeyAndValueAndCloneValue(valueToUpdate, undefined, true);
        if (cmp(me.primaryKey, evaluatedKey) !== 0) {
            throw createDOMException('DataError', 'The key of the supplied value to `update` is not equal to the cursor\'s effective key');
        }
        addToQueue(clonedValue);
    } else {
        const clonedValue = clone$1(valueToUpdate);
        addToQueue(clonedValue);
    }
    return request;
};

IDBCursor.prototype['delete'] = function () {
    const me = this;
    IDBTransaction.__assertActive(me.__store.transaction);
    me.__store.transaction.__assertWritable();
    me.__sourceOrEffectiveObjStoreDeleted();
    if (!me.__gotValue) {
        throw createDOMException('InvalidStateError', 'The cursor is being iterated or has iterated past its end.');
    }
    if (me.__keyOnly) {
        throw createDOMException('InvalidStateError', 'This cursor method cannot be called when the key only flag has been set.');
    }
    return this.__store.transaction.__addToTransactionQueue(function cursorDelete (tx, args, success, error) {
        me.__find(undefined, undefined, tx, function (key, value, primaryKey) {
            const sql = 'DELETE FROM  ' + escapeStoreNameForSQL(me.__store.__currentName) + ' WHERE "key" = ?';
            CFG.DEBUG && console.log(sql, key, primaryKey);
            // Key.convertValueToKey(primaryKey); // Already checked when entered
            tx.executeSql(sql, [escapeSQLiteStatement(encode(primaryKey))], function (tx, data) {
                if (data.rowsAffected === 1) {
                    // We don't invalidate the cache (as we don't access it anymore
                    //    and it will set the index off)
                    success(undefined);
                } else {
                    error('No rows with key found' + key);
                }
            }, function (tx, data) {
                error(data);
            });
        }, error);
    }, undefined, me);
};

IDBCursor.prototype[Symbol.toStringTag] = 'IDBCursorPrototype';

['source', 'direction', 'key', 'primaryKey'].forEach((prop) => {
    Object.defineProperty(IDBCursor.prototype, prop, {
        enumerable: true,
        configurable: true,
        get: function () {
            throw new TypeError('Illegal invocation');
        }
    });
});
Object.defineProperty(IDBCursor, 'prototype', {
    writable: false
});

function IDBCursorWithValue () {
    throw new TypeError('Illegal constructor');
}

IDBCursorWithValue.prototype = Object.create(IDBCursor.prototype);
Object.defineProperty(IDBCursorWithValue.prototype, 'constructor', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: IDBCursorWithValue
});

const IDBCursorWithValueAlias = IDBCursorWithValue;
IDBCursorWithValue.__createInstance = function (...args) {
    function IDBCursorWithValue () {
        IDBCursor.__super.call(this, ...args);
        this[Symbol.toStringTag] = 'IDBCursorWithValue';
        defineReadonlyProperties(this, 'value');
    }
    IDBCursorWithValue.prototype = IDBCursorWithValueAlias.prototype;
    return new IDBCursorWithValue();
};

Object.defineProperty(IDBCursorWithValue.prototype, 'value', {
    enumerable: true,
    configurable: true,
    get: function () {
        throw new TypeError('Illegal invocation');
    }
});

IDBCursorWithValue.prototype[Symbol.toStringTag] = 'IDBCursorWithValuePrototype';

Object.defineProperty(IDBCursorWithValue, 'prototype', {
    writable: false
});

/* globals self */

function setConfig (prop, val) {
    if (prop && typeof prop === 'object') {
        for (const p in prop) {
            setConfig(p, prop[p]);
        }
        return;
    }
    if (!(prop in CFG)) {
        throw new Error(prop + ' is not a valid configuration property');
    }
    CFG[prop] = val;
}

function setGlobalVars (idb, initialConfig) {
    if (initialConfig) {
        setConfig(initialConfig);
    }
    const IDB = idb || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : (typeof global !== 'undefined' ? global : {})));
    function shim (name, value, propDesc) {
        if (!propDesc || !Object.defineProperty) {
            try {
                // Try setting the property. This will fail if the property is read-only.
                IDB[name] = value;
            } catch (e) {
                console.log(e);
            }
        }
        if (IDB[name] !== value && Object.defineProperty) {
            // Setting a read-only property failed, so try re-defining the property
            try {
                const desc = propDesc || {};
                if (!('get' in desc)) {
                    if (!('value' in desc)) {
                        desc.value = value;
                    }
                    if (!('writable' in desc)) {
                        desc.writable = true;
                    }
                }
                Object.defineProperty(IDB, name, desc);
            } catch (e) {
                // With `indexedDB`, PhantomJS fails here and below but
                //  not above, while Chrome is reverse (and Firefox doesn't
                //  get here since no WebSQL to use for shimming)
            }
        }
        if (IDB[name] !== value) {
            typeof console !== 'undefined' && console.warn && console.warn('Unable to shim ' + name);
        }
    }
    if (CFG.win.openDatabase !== undefined) {
        shim('shimIndexedDB', shimIndexedDB, {
            enumerable: false,
            configurable: true
        });
    }
    if (IDB.shimIndexedDB) {
        IDB.shimIndexedDB.__useShim = function () {
            function setNonIDBGlobals (prefix = '') {
                shim(prefix + 'DOMException', IDB.indexedDB.modules.ShimDOMException);
                shim(prefix + 'DOMStringList', IDB.indexedDB.modules.ShimDOMStringList, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: IDB.indexedDB.modules.ShimDOMStringList
                });
                shim(prefix + 'Event', IDB.indexedDB.modules.ShimEvent, {
                    configurable: true,
                    writable: true,
                    value: IDB.indexedDB.modules.ShimEvent,
                    enumerable: false
                });
                shim(prefix + 'CustomEvent', IDB.indexedDB.modules.ShimCustomEvent, {
                    configurable: true,
                    writable: true,
                    value: IDB.indexedDB.modules.ShimCustomEvent,
                    enumerable: false
                });
                shim(prefix + 'EventTarget', IDB.indexedDB.modules.ShimEventTarget, {
                    configurable: true,
                    writable: true,
                    value: IDB.indexedDB.modules.ShimEventTarget,
                    enumerable: false
                });
            }
            const shimIDBFactory = IDB.shimIndexedDB.modules.IDBFactory;
            if (CFG.win.openDatabase !== undefined) {
                shimIndexedDB.__openDatabase = CFG.win.openDatabase.bind(CFG.win); // We cache here in case the function is overwritten later as by the IndexedDB support promises tests
                // Polyfill ALL of IndexedDB, using WebSQL
                shim('indexedDB', shimIndexedDB, {
                    enumerable: true,
                    configurable: true,
                    get () {
                        if (this !== IDB && this != null && !this.shimNS) { // Latter is hack for test environment
                            throw new TypeError('Illegal invocation');
                        }
                        return shimIndexedDB;
                    }
                });
                [
                    ['IDBFactory', shimIDBFactory],
                    ['IDBDatabase', IDBDatabase],
                    ['IDBObjectStore', IDBObjectStore],
                    ['IDBIndex', IDBIndex],
                    ['IDBTransaction', IDBTransaction],
                    ['IDBCursor', IDBCursor],
                    ['IDBCursorWithValue', IDBCursorWithValue],
                    ['IDBKeyRange', IDBKeyRange$1],
                    ['IDBRequest', IDBRequest],
                    ['IDBOpenDBRequest', IDBOpenDBRequest],
                    ['IDBVersionChangeEvent', IDBVersionChangeEvent]
                ].forEach(([prop, obj]) => {
                    shim(prop, obj, {
                        enumerable: false,
                        configurable: true
                    });
                });
                if (CFG.fullIDLSupport) {
                    // Slow per MDN so off by default! Though apparently needed for WebIDL: http://stackoverflow.com/questions/41927589/rationales-consequences-of-webidl-class-inheritance-requirements
                    Object.setPrototypeOf(IDB.IDBOpenDBRequest, IDB.IDBRequest);
                    Object.setPrototypeOf(IDB.IDBCursorWithValue, IDB.IDBCursor);

                    const ShimEvent$$1 = IDB.shimIndexedDB.modules.ShimEvent;
                    const ShimEventTarget = IDB.shimIndexedDB.modules.ShimEventTarget;
                    Object.setPrototypeOf(IDBDatabase, ShimEventTarget);
                    Object.setPrototypeOf(IDBRequest, ShimEventTarget);
                    Object.setPrototypeOf(IDBTransaction, ShimEventTarget);
                    Object.setPrototypeOf(IDBVersionChangeEvent, ShimEvent$$1);
                    Object.setPrototypeOf(ShimDOMException$1, Error);
                    Object.setPrototypeOf(ShimDOMException$1.prototype, Error.prototype);
                    setPrototypeOfCustomEvent();
                }
                if (IDB.indexedDB && IDB.indexedDB.modules) {
                    if (CFG.addNonIDBGlobals) {
                        // As `DOMStringList` exists per IDL (and Chrome) in the global
                        //   thread (but not in workers), we prefix the name to avoid
                        //   shadowing or conflicts
                        setNonIDBGlobals('Shim');
                    }
                    if (CFG.replaceNonIDBGlobals) {
                        setNonIDBGlobals();
                    }
                }
                IDB.shimIndexedDB.__setConnectionQueueOrigin();
            }
        };

        IDB.shimIndexedDB.__debug = function (val) {
            CFG.DEBUG = val;
        };
        IDB.shimIndexedDB.__setConfig = setConfig;
        IDB.shimIndexedDB.__getConfig = function (prop) {
            if (!(prop in CFG)) {
                throw new Error(prop + ' is not a valid configuration property');
            }
            return CFG[prop];
        };
        IDB.shimIndexedDB.__setUnicodeIdentifiers = function ({UnicodeIDStart, UnicodeIDContinue}) {
            setConfig({UnicodeIDStart, UnicodeIDContinue});
        };
    } else {
        // We no-op the harmless set-up properties and methods with a warning; the `IDBFactory` methods,
        //    however (including our non-standard methods), are not stubbed as they ought
        //    to fail earlier rather than potentially having side effects.
        IDB.shimIndexedDB = {
            modules: ['DOMException', 'DOMStringList', 'Event', 'CustomEvent', 'EventTarget'].reduce((o, prop) => {
                o['Shim' + prop] = IDB[prop]; // Just alias
                return o;
            }, {})
        };
        ['__useShim', '__debug', '__setConfig', '__getConfig', '__setUnicodeIdentifiers'].forEach((prop) => {
            IDB.shimIndexedDB[prop] = function () {
                console.warn('This browser does not have WebSQL to shim.');
            };
        });
    }

    // Workaround to prevent an error in Firefox
    if (!('indexedDB' in IDB) && typeof window !== 'undefined') { // 2nd condition avoids problems in Node
        IDB.indexedDB = IDB.indexedDB || IDB.webkitIndexedDB || IDB.mozIndexedDB || IDB.oIndexedDB || IDB.msIndexedDB;
    }

    // Detect browsers with known IndexedDB issues (e.g. Android pre-4.4)
    let poorIndexedDbSupport = false;
    if (typeof navigator !== 'undefined' && ( // Ignore Node or other environments
        (
            // Bad non-Chrome Android support
            (/Android (?:2|3|4\.[0-3])/).test(navigator.userAgent) &&
            !navigator.userAgent.includes('Chrome')
        ) ||
        (
            // Bad non-Safari iOS9 support (see <https://github.com/axemclion/IndexedDBShim/issues/252>)
            (!navigator.userAgent.includes('Safari') || navigator.userAgent.includes('Chrome')) && // Exclude genuine Safari: http://stackoverflow.com/a/7768006/271577
            // Detect iOS: http://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
            // and detect version 9: http://stackoverflow.com/a/26363560/271577
            (/(iPad|iPhone|iPod).* os 9_/i).test(navigator.userAgent) &&
            !window.MSStream // But avoid IE11
        )
    )) {
        poorIndexedDbSupport = true;
    }
    if (!CFG.DEFAULT_DB_SIZE) {
        CFG.DEFAULT_DB_SIZE = (
            ( // Safari currently requires larger size: (We don't need a larger size for Node as node-websql doesn't use this info)
                // https://github.com/axemclion/IndexedDBShim/issues/41
                // https://github.com/axemclion/IndexedDBShim/issues/115
                typeof navigator !== 'undefined' &&
                navigator.userAgent.includes('Safari') &&
                !navigator.userAgent.includes('Chrome')
            ) ? 25 : 4
        ) * 1024 * 1024;
    }
    if (!CFG.avoidAutoShim &&
        (!IDB.indexedDB || poorIndexedDbSupport) &&
        CFG.win.openDatabase !== undefined
    ) {
        IDB.shimIndexedDB.__useShim();
    } else {
        IDB.IDBDatabase = IDB.IDBDatabase || IDB.webkitIDBDatabase;
        IDB.IDBTransaction = IDB.IDBTransaction || IDB.webkitIDBTransaction || {};
        IDB.IDBCursor = IDB.IDBCursor || IDB.webkitIDBCursor;
        IDB.IDBKeyRange = IDB.IDBKeyRange || IDB.webkitIDBKeyRange;
    }
    return IDB;
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
// (MIT licensed)

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob$1 {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob$1) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob$1([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob$1.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob$1.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

/**
 * body.js
 *
 * Body interface provides common methods for Request and Response
 */

const Stream = require('stream');

var _require = require('stream');

const PassThrough = _require.PassThrough;


let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (typeof body === 'string') {
		// body is string
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
	} else if (body instanceof Blob$1) {
		// body is blob
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is array buffer
	} else if (body instanceof Stream) {
		// body is stream
	} else {
		// none of the above
		// coerce to string
		body = String(body);
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			_this[INTERNALS].error = new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob$1([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}

};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	// body is null
	if (this.body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is string
	if (typeof this.body === 'string') {
		return Body.Promise.resolve(Buffer.from(this.body));
	}

	// body is blob
	if (this.body instanceof Blob$1) {
		return Body.Promise.resolve(this.body[BUFFER]);
	}

	// body is buffer
	if (Buffer.isBuffer(this.body)) {
		return Body.Promise.resolve(this.body);
	}

	// body is buffer
	if (Object.prototype.toString.call(this.body) === '[object ArrayBuffer]') {
		return Body.Promise.resolve(Buffer.from(this.body));
	}

	// istanbul ignore if: should never happen
	if (!(this.body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream error, such as incorrect content-encoding
		_this4.body.on('error', function (err) {
			reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
		});

		_this4.body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		_this4.body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone$2(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Response or Request instance
 */
function extractContentType(instance) {
	const body = instance.body;

	// istanbul ignore if: Currently, because of a guard in Request, body
	// can never be null. Included here for completeness.

	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (body instanceof Blob$1) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is array buffer
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else {
		// body is stream
		// can't really do much about this
		return null;
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;

	// istanbul ignore if: included for completion

	if (body === null) {
		// body is null
		return 0;
	} else if (typeof body === 'string') {
		// body is string
		return Buffer.byteLength(body);
	} else if (isURLSearchParams(body)) {
		// body is URLSearchParams
		return Buffer.byteLength(String(body));
	} else if (body instanceof Blob$1) {
		// body is blob
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is array buffer
		return body.byteLength;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		// can't really do much about this
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (typeof body === 'string') {
		// body is string
		dest.write(body);
		dest.end();
	} else if (isURLSearchParams(body)) {
		// body is URLSearchParams
		dest.write(Buffer.from(String(body)));
		dest.end();
	} else if (body instanceof Blob$1) {
		// body is blob
		dest.write(body[BUFFER]);
		dest.end();
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is array buffer
		dest.write(Buffer.from(body));
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name)) {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) {
			// no op
		} else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

/**
 * response.js
 *
 * Response class provides content decoding
 */

var _require$1 = require('http');

const STATUS_CODES = _require$1.STATUS_CODES;


const INTERNALS$1 = Symbol('Response internals');

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers: new Headers(opts.headers)
		};
	}

	get url() {
		return this[INTERNALS$1].url;
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone$2(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * request.js
 *
 * Request class contains server only options
 *
 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
 */

var _require$2 = require('url');

const format_url = _require$2.format;
const parse_url = _require$2.parse;


const INTERNALS$2 = Symbol('Request internals');

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone$2(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (init.body != null) {
			const contentType = extractContentType(this);
			if (contentType !== null && !headers.has('Content-Type')) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}
	if (!headers.has('Connection') && !request.agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent: request.agent
	});
}

/**
 * index.js
 *
 * a request API compatible with window.fetch
 *
 * All spec algorithm step numbers are based on https://fetch.spec.whatwg.org/commit-snapshots/ae716822cb3a61843226cd090eefc6589446c1d2/.
 */

const http = require('http');
const https = require('https');

var _require$3 = require('stream');

const PassThrough$1 = _require$3.PassThrough;

var _require2 = require('url');

const resolve_url = _require2.resolve;

const zlib = require('zlib');

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch$1(url, opts) {

	// allow custom promise
	if (!fetch$1.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch$1.Promise;

	// wrap http.request into fetch
	return new fetch$1.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;

		// send request
		const req = send(options);
		let reqTimeout;

		function finalize() {
			req.abort();
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch$1.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							headers.set('Location', locationURL);
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch$1(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			let body = res.pipe(new PassThrough$1());
			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				resolve(new Response(body, response_options));
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				resolve(new Response(body, response_options));
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					resolve(new Response(body, response_options));
				});
				return;
			}

			// otherwise, use response as-is
			resolve(new Response(body, response_options));
		});

		writeToStream(req, request);
	});
}

/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch$1.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// Needed for TypeScript.
fetch$1.default = fetch$1;

// expose Promise
fetch$1.Promise = global.Promise;

/* eslint-env node */

// Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event

const optionDefinitions = [
    // Node-server-specific
    {name: 'nodeActivate', type: Boolean},
    {name: 'port', type: Number},
    {name: 'domain', type: String},

    // Results display (main)
    //      `namespace`: (but set below)
    //      `skipIndexedDB`: set to `false` below (and the default anyways)
    //      `noDynamic`: not used
    //      `prefI18n`: will instead be set dynamically per user query
    //      `files`: Already set below for service worker
    {name: 'interlinearSeparator', type: String},
    {name: 'localizeParamNames', type: Boolean},
    {name: 'trustFormatHTML', type: Boolean},
    {name: 'allowPlugins', type: Boolean},

    // Results display (template)
    {name: 'showEmptyInterlinear', type: Boolean},
    {name: 'showTitleOnSingleInterlinear', type: Boolean},

    // Service worker
    {name: 'serviceWorkerPath', type: String, defaultOption: true},
    {name: 'languages', type: String},
    {name: 'files', type: String},
    {name: 'namespace', type: String},
    {name: 'staticFilesToCache', type: String, multiple: true}
];
const userParams = require('command-line-args')(optionDefinitions);

const domain = userParams.domain || 'localhost';
const port = userParams.port || 8000;

const userParamsWithDefaults = setServiceWorkerDefaults(userParams, {
    files: `http://${domain}{port === 80 ? '' : ':' + port}/files.json`, // `files` must be absolute path for node-fetch
    nodeActivate: undefined,
    port: undefined,
    domain: undefined,
    skipIndexedDB: false, // Not relevant here
    noDynamic: false, // Not relevant here
    logger: {
        addLogEntry ({text}) {
            console.log(`Log: ${text}`);
        },
        dbError ({
            errorType,
            escapedErrorMessage
        }) {
            throw new Error(`Worker aborted: error type ${errorType}; ${escapedErrorMessage}`);
        }
    }
});

if (userParams.nodeActivate) {
    global.fetch = fetch$1;
    setGlobalVars(); // Adds `indexedDB` and `IDBKeyRange` to global in Node
    const activateCallback = require('resources/activateCallback.js');
    activateCallback(userParamsWithDefaults);
}

const http$1 = require('http');
const url = require('url');

global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const srv = http$1.createServer(async (req, res) => {
    const $p = new IntlURLSearchParams({
        params: url.parse(req.url).query
    });

    getIMFFallbackResults({
        $p,
        langData: await getJSON(userParamsWithDefaults.languages),
        resultsDisplay (resultsArgs, ...args) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            resultsArgs = {
                ...resultsArgs,
                skipIndexedDB: false,
                prefI18n: $p.get('prefI18n', true)
            };
            // Todo: Move sw-sample.js to bahaiwritings and test
            resultsDisplayServerOrClient$1.call(userParamsWithDefaults, resultsArgs, ...args);
            res.end('okay');
        }
    });
});
srv.listen(port);
