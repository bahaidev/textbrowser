/* globals Ajv:true, JsonRefs:true, Promise, module, require */
/* exported textbrowserTests */

var Ajv, JsonRefs; // eslint-disable-line no-var
if (typeof exports !== 'undefined') {
    Ajv = require('ajv');
    JsonRefs = require('json-refs');
}

let textbrowserTests;
(function () {
/* eslint-disable indent */
'use strict';

const appBase = '/';
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
        Promise.all([
            JsonRefs.resolveRefsAt('locale.jsonschema', {location: schemaBase}),
            JsonRefs.resolveRefsAt('en-US.json', {location: localesBase}),
            JsonRefs.resolveRefsAt('ar.json', {location: localesBase}),
            JsonRefs.resolveRefsAt('fa.json', {location: localesBase}),
            JsonRefs.resolveRefsAt('ru.json', {location: localesBase})
        ]).then(function ([{resolved: schema}, ...locales]) {
            locales.forEach(function ({resolved: locale}) {
                const valid = validate(schema, locale, 'locales tests');
                test.strictEqual(valid, true);
            });
            test.done();
        });
    },
    'languages.json test': function (test) { // See TextBrowser to-dos on what must be fixed for this to work
        Promise.all([
            JsonRefs.resolveRefsAt('languages.jsonschema', {location: schemaBase}),
            JsonRefs.resolveRefsAt('languages.json', {location: appdataBase})
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
