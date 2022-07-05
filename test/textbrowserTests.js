/* eslint-disable no-console -- Test file */
'use strict';

// eslint-disable-next-line no-var, no-shadow -- Polyglot
var JsonRefs, chai, assert, jsonpatch, Ajv, getJSON, __dirname, path;

/**
 *
 * @param {null|number|string|GenericArray|PlainObject} obj
 * @returns {null|number|string|GenericArray|PlainObject}
 */
function cloneJSON (obj) {
  return JSON.parse(JSON.stringify(obj));
}

let appBase = '../';

// eslint-disable-next-line n/exports-style -- Check
if (typeof exports !== 'undefined') {
  /* eslint-disable n/global-require -- For Node */
  Ajv = require('ajv').default;
  JsonRefs = require('json-refs');
  jsonpatch = require('fast-json-patch');
  ({getJSON} = require('simple-get-json'));
  assert = require('assert');
  path = require('path');
  /* eslint-enable n/global-require -- For Node */
} else {
  ({assert} = chai);
  path = {
    join: (...args) => args.join('')
  };
  appBase = location.protocol + '//' + location.host + '/';
  __dirname = '';
}

const schemaBase = appBase + 'general-schemas/';
const localesBase = appBase + 'locales/';
const appdataBase = appBase + 'appdata/';
const jsonSchemaSpec = 'node_modules/json-metaschema/draft-07-schema.json';

/**
* @external JSONSchema
*/

/**
* @external AJVOptions
*/

/**
* @param {string} testName Name of the current test
* @param {JSONSchema} schema Schema object
* @param {PlainObject} data Data object
* @param {string[][]} extraSchemas
* @param {AJVOptions} additionalOptions
* @returns {boolean} Whether validation succeeded
*/
function validate (
  testName, schema, data, extraSchemas = [], additionalOptions = {}
) {
  const ajv = new Ajv({...additionalOptions});
  let valid;
  try {
    extraSchemas.forEach(([key, val]) => {
      ajv.addSchema(val, key);
    });
    valid = ajv.validate(schema, data);
    assert(valid, 'Valid schema');
  } catch (e) {
    console.log('(' + testName + ') ' + e);
  } finally {
    if (!valid) { console.log(JSON.stringify(ajv.errors, null, 2)); }
  }
  return valid;
}

describe('textbrowser tests', function () {
  it('locales tests', async () => {
    const [jsonSchema, schema, ...locales] = await Promise.all([
      getJSON(path.join(
        __dirname,
        appBase + jsonSchemaSpec
      )),
      ...[
        'locale.jsonschema',
        'en-US.json',
        'ar.json',
        'fa.json',
        'ru.json'
      ].map((file, i) => getJSON(
        path.join(__dirname, i ? localesBase : schemaBase, file)
      ))
    ]);
    locales.forEach(function (locale) {
      const valid = validate('locales tests', schema, locale);
      assert.strictEqual(valid, true);
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
    assert.strictEqual(diff.length, 0);
  });
  it('languages.json test', async () => {
    const results = await Promise.all([
      JsonRefs.resolveRefsAt(
        path.join(__dirname, appdataBase, 'languages.json')
      ),
      getJSON(path.join(__dirname, appBase + jsonSchemaSpec)),
      getJSON(path.join(__dirname, schemaBase, 'languages.jsonschema')),
      getJSON(path.join(__dirname, schemaBase, 'locale.jsonschema'))
    ]);
    const [{resolved: data}, jsonSchema, schema, localeSchema] = results;
    const extraSchemas = [['locale.jsonschema', localeSchema]];
    const valid = validate('languages.json test', schema, data, extraSchemas);
    assert.strictEqual(valid, true);

    const schemas = results.slice(2);
    schemas.forEach((schma, i) => {
      validate('Schema test', jsonSchema, schma, undefined, {
        validateSchema: false
      });

      const schema2 = cloneJSON(schma);
      validate('Schema test 2', jsonSchema, schema2, extraSchemas, {
        removeAdditional: 'all',
        validateSchema: false
      });
      const diff = jsonpatch.compare(schma, schema2);
      if (diff.length) {
        console.log(`diff for schema at index ${i}`, diff);
      }
      assert.strictEqual(diff.length, 0);
    });
  });
  it('userJSON tests', async () => {
    const [jsonSchema, userJSONSchema, userJSON] = await getJSON([
      path.join(
        __dirname,
        appBase + jsonSchemaSpec
      ),
      path.join(
        __dirname,
        schemaBase,
        'user-json.jsonschema'
      ),
      path.join(
        __dirname,
        appBase + 'resources/user-sample.json'
      )
    ]);

    const userJSONSchema2 = cloneJSON(userJSONSchema);
    validate('Schema test', jsonSchema, userJSONSchema, undefined, {
      validateSchema: false
    });
    const diff = jsonpatch.compare(userJSONSchema, userJSONSchema2);
    if (diff.length) {
      console.log(`diff for data file`, diff);
    }
    assert.strictEqual(diff.length, 0);

    const userJSON2 = cloneJSON(userJSON);
    validate('Schema test', userJSONSchema, userJSON, undefined, {
      validateSchema: false
    });
    const diff2 = jsonpatch.compare(userJSON, userJSON2);
    if (diff2.length) {
      console.log(`diff for data file`, diff2);
    }
    assert.strictEqual(diff2.length, 0);
  });
});
