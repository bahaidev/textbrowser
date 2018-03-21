/* eslint-env node */
/* exported textbrowserTests */
var JsonRefs, jsonpatch, Ajv, getJSON, __dirname, path; // eslint-disable-line no-var

(function () {
'use strict';

function cloneJSON (obj) {
    return JSON.parse(JSON.stringify(obj));
}

let appBase = '../';

if (typeof exports !== 'undefined') {
    require('babel-polyfill');
    Ajv = require('ajv');
    JsonRefs = require('json-refs');
    jsonpatch = require('fast-json-patch');
    getJSON = require('simple-get-json');
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
function validate (testName, schema, data, extraSchemas = [], additionalOptions = {}) {
    const ajv = new Ajv(Object.assign({}, {extendRefs: 'fail'}, additionalOptions));
    let valid;
    try {
        extraSchemas.forEach(([key, val]) => {
            ajv.addSchema(val, key);
        });
        valid = ajv.validate(schema, data);
    } catch (e) {
        console.log('(' + testName + ') ' + e); // eslint-disable-line no-console
    } finally {
        if (!valid) { console.log(JSON.stringify(ajv.errors, null, 2)); } // eslint-disable-line no-console
    }
    return valid;
}

const textbrowserTests = {
    'locales tests' (test) {
        test.expect(5); // eslint-disable-line no-magic-numbers
        Promise.all(
            [getJSON(path.join(__dirname, appBase + 'node_modules/json-metaschema/draft-07-schema.json'))].concat(
                [
                    'locale.jsonschema',
                    'en-US.json',
                    'ar.json',
                    'fa.json',
                    'ru.json'
                ].map((file, i) => getJSON(
                    path.join(__dirname, i ? localesBase : schemaBase, file)
                ))
            )
        ).then(function ([jsonSchema, schema, ...locales]) {
            locales.forEach(function (locale) {
                const valid = validate('locales tests', schema, locale);
                test.strictEqual(valid, true);
            });

            validate('Schema test', jsonSchema, schema, undefined, {
                validateSchema: false
            });

            const schema2 = cloneJSON(schema);
            validate('Schema test 2', jsonSchema, schema2, undefined, {
                removeAdditional: 'all',
                validateSchema: false
            });

            const diff = jsonpatch.compare(schema, schema2);
            if (diff.length) {
                console.log('diff', diff);
            }
            test.strictEqual(diff.length, 0);

            test.done();
        });
    },
    'languages.json test' (test) {
        test.expect(3); // eslint-disable-line no-magic-numbers
        Promise.all([
            JsonRefs.resolveRefsAt(path.join(__dirname, appdataBase, 'languages.json')),
            getJSON(path.join(__dirname, appBase + 'node_modules/json-metaschema/draft-07-schema.json')),
            getJSON(path.join(__dirname, schemaBase, 'languages.jsonschema')),
            getJSON(path.join(__dirname, schemaBase, 'locale.jsonschema'))
        ]).then(function ([{resolved: data}, jsonSchema, schema, localeSchema]) {
            const extraSchemas = [['locale.jsonschema', localeSchema]];
            const valid = validate('languages.json test', schema, data, extraSchemas);
            test.strictEqual(valid, true);

            const schemas = arguments[0].slice(2);
            schemas.forEach((schema, i) => {
                validate('Schema test', jsonSchema, schema, undefined, {
                    validateSchema: false
                });

                const schema2 = cloneJSON(schema);
                validate('Schema test 2', jsonSchema, schema2, extraSchemas, {
                    removeAdditional: 'all',
                    validateSchema: false
                });
                const diff = jsonpatch.compare(schema, schema2);
                if (diff.length) {
                    console.log(`diff for schema at index ${i}`, diff);
                }
                test.strictEqual(diff.length, 0);
            });
            test.done();
        });
    }
};

if (typeof exports !== 'undefined') {
    module.exports = textbrowserTests;
} else {
    window.textbrowserTests = textbrowserTests;
}
}());
