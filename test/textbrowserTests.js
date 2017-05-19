/* globals __dirname, Ajv:true, JsonRefs:true, path:true, Promise, module, require */
/* exported textbrowserTests */

var Ajv, JsonRefs, __dirname, path; // eslint-disable-line no-var

let textbrowserTests;
(function () {
/* eslint-disable indent */
'use strict';

let appBase = '../';

if (typeof exports !== 'undefined') {
    Ajv = require('ajv');
    JsonRefs = require('json-refs');
    path = require('path');
} else {
    path = {
        join: (...args) => args.join('')
    };
    appBase = location.protocol + '//' + location.host + '/';
    __dirname = ''; // eslint-disable-line no-global-assign
}

const schemaBase = appBase + 'general-schemas/';
const localesBase = appBase + 'locales/';
const appdataBase = appBase + 'appdata/';

/**
* @param {object} schema Schema object
* @param {any} data Data object
* @param {string} testName Name of the current test
* @returns {boolean} Whether validation succeeded
*/
function validate (schema, data, testName) {
    const ajv = Ajv(); // eslint-disable-line new-cap
    let valid;
    try {
        valid = ajv.validate(schema, data);
    } catch (e) {
        console.log('(' + testName + ') ' + e); // eslint-disable-line no-console
    } finally {
        if (!valid) { console.log(JSON.stringify(ajv.errors)); } // eslint-disable-line no-console
    }
    return valid;
}

textbrowserTests = {
    'locales tests': function (test) {
        test.expect(4); // eslint-disable-line no-magic-numbers
        Promise.all(
            [
                'locale.jsonschema',
                'en-US.json',
                'ar.json',
                'fa.json',
                'ru.json'
            ].map((file, i) => JsonRefs.resolveRefsAt(
                path.join(__dirname, i ? localesBase : schemaBase, file)
            ))
        ).then(function ([{resolved: schema}, ...locales]) {
            locales.forEach(function ({resolved: locale}) {
                const valid = validate(schema, locale, 'locales tests');
                test.strictEqual(valid, true);
            });
            test.done();
        });
    },
    'languages.json test': function (test) {
        Promise.all([
            JsonRefs.resolveRefsAt(path.join(__dirname, schemaBase, 'languages.jsonschema')),
            JsonRefs.resolveRefsAt(path.join(__dirname, appdataBase, 'languages.json'))
        ]).then(function ([{resolved: schema}, {resolved: data}]) {
            const valid = validate(schema, data, 'languages.json test');
            test.strictEqual(valid, true);
            test.done();
        });
    }
};

if (typeof exports !== 'undefined') {
    module.exports = textbrowserTests;
}
/* eslint-enable indent */
}());
