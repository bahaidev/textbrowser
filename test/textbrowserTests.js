/*global Ajv, JsonRefs, Promise, module*/
/*exported textbrowserTests, bahaiwritingsTests*/

var textbrowserTests, bahaiwritingsTests;
(function () {

/* eslint-disable indent*/
'use strict';

var appBase = '/';
var schemaBase = appBase + 'general-schemas/';
var localesBase = appBase + 'locales/';
var appdataBase = appBase + 'appdata/';

/**
* @param {object} schema Schema object
* @param {any} data Data object
* @returns {boolean} Whether validation succeeded
*/
function validate (schema, data) {
    var ajv = Ajv(); // eslint-disable-line new-cap
    var valid;
    try {
        valid = ajv.validate(schema, data);
    }
    catch (e) {
        console.log(e); // eslint-disable-line no-console
    }
    finally {
        if (!valid) {console.log(JSON.stringify(ajv.errors));} // eslint-disable-line no-console
    }
    return valid;
}

textbrowserTests = {
    'locales tests': function (test) {
        test.expect(4); // eslint-disable-line no-magic-numbers
        Promise.all([
            JsonRefs.resolveRefsAt('locale.jsonschema', {relativeBase: schemaBase}),
            JsonRefs.resolveRefsAt('en-US.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('ar.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('fa.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('ru.json', {relativeBase: localesBase})
        ]).then(function ([{resolved: schema}, ...locales]) {
            locales.forEach(function ({resolved: locale}) {
                var valid = validate(schema, locale);
                test.strictEqual(valid, true);
            });
            test.done();
        });
    },
    'languages.json test': function (test) { // See TextBrowser to-dos on what must be fixed for this to work
        Promise.all([
            JsonRefs.resolveRefsAt('languages.jsonschema', {relativeBase: schemaBase}),
            JsonRefs.resolveRefsAt('languages.json', {relativeBase: appdataBase})
        ]).then(function ([{resolved: schema}, {resolved: data}]) {
            var valid = validate(schema, data);
            test.strictEqual(valid, true);
            test.done();
        });
    }
};

if (typeof exports !== 'undefined') {
    module.exports = bahaiwritingsTests;
}

}());
