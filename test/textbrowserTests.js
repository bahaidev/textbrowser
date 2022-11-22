/* eslint-disable import/unambiguous -- Imports are boostrapped */
/* globals path, appBase, JsonRefs, Ajv,
    getJSON, __dirname -- Polyglot */

/* eslint-disable no-console -- Test file */

const schemaBase = appBase + 'general-schemas/';
const localesBase = appBase + 'locales/';
const appdataBase = appBase + 'appdata/';
// const jsonSchemaSpec = 'node_modules/json-metaschema/draft-07-schema.json';

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
    if (!valid && ajv.errors?.length) {
      console.log(JSON.stringify(ajv.errors, null, 2));
    }
  }
  return valid;
}

describe('textbrowser tests', function () {
  it('locales tests', async () => {
    const [
      // jsonSchema,
      schema,
      ...locales
    ] = await getJSON([
      '../node_modules/textbrowser-data-schemas/schemas/locale.jsonschema',
      'en-US.json',
      'ar.json',
      'fa.json',
      'ru.json'
    ].map(
      (file, i) => path.join(__dirname, i ? localesBase : schemaBase, file)
    ));

    locales.forEach(function (locale) {
      const valid = validate('locales tests', schema, locale);
      assert.strictEqual(valid, true);
    });

    // This doesn't remove all as hoped as don't have
    //   `additionalProperties: false` set; see
    //   https://github.com/ajv-validator/ajv/issues/2170
    // validate('Schema test', jsonSchema, schema, undefined, {
    //   validateSchema: false
    // });
    //
    // const schema2 = cloneJSON(schema);
    // validate('Schema test 2', jsonSchema, schema2, undefined, {
    //   removeAdditional: 'all',
    //   validateSchema: false
    // });
    //
    // const diff = jsonpatch.compare(schema, schema2);
    // if (diff.length) {
    //   console.log('diff', diff);
    // }
    // assert.strictEqual(diff.length, 0);
  });
  it('languages.json test', async () => {
    const results = await Promise.all([
      JsonRefs.resolveRefsAt(
        path.join(__dirname, appdataBase, 'languages.json')
      ),
      // getJSON(path.join(__dirname, appBase + jsonSchemaSpec)),
      JsonRefs.resolveRefsAt(
        path.join(__dirname, schemaBase, 'languages.jsonschema'),
        {
          refPreProcessor (obj, pth) {
            // Need to fix given that we are not in the expected
            //   app project of a web project
            if (
              obj.$ref ===
                '../../textbrowser-data-schemas/schemas/locale.jsonschema'
            ) {
              obj.$ref = '../node_modules/textbrowser-data-schemas/' +
                'schemas/locale.jsonschema';
            }
            return obj;
          }
        }
      )
    ]);
    const [
      {resolved: data},
      // jsonSchema,
      {resolved: schema}
    ] = results;

    // JsonRefs doesn't handle circular references the way we want here:
    schema.properties.languages.items.properties
      .locale.patternProperties['.*'].anyOf[2].$ref = JsonRefs.pathToPtr([
        'properties', 'languages', 'items', 'properties', 'locale'
      ]);

    const valid = validate('languages.json test', schema, data);
    assert.strictEqual(valid, true);

    // This doesn't remove all as hoped as don't have
    //   `additionalProperties: false` set; see
    //   https://github.com/ajv-validator/ajv/issues/2170
    // const schemas = results.slice(2);
    // schemas.forEach((schma, i) => {
    //   validate('Schema test', jsonSchema, schma, undefined, {
    //     validateSchema: false
    //   });
    //
    //   const schema2 = cloneJSON(schma);
    //   validate('Schema test 2', jsonSchema, schema2, extraSchemas, {
    //     removeAdditional: 'all',
    //     validateSchema: false
    //   });
    //   const diff = jsonpatch.compare(schma, schema2);
    //   if (diff.length) {
    //     console.log(`diff for schema at index ${i}`, diff);
    //   }
    //   assert.strictEqual(diff.length, 0);
    // });
  });
});
