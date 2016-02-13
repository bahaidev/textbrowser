
var appBase = '/textbrowser/';
var schemaBase = appBase + 'general-schemas/';
var localesBase = appBase + 'locales/';
var appdataBase = appBase + 'appdata/';

function validate (schema, data) {
    var ajv = Ajv();
    var valid;
    try {
        valid = ajv.validate(schema, data);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (!valid) {console.log(JSON.stringify(ajv.errors));}
    }
    return valid;
}

var textbrowserTests = {
    'locales tests': function (test) {
        test.expect(4);
        Promise.all([
            JsonRefs.resolveRefsAt('locale.jsonschema', {relativeBase: schemaBase}),
            JsonRefs.resolveRefsAt('en-US.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('ar.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('fa.json', {relativeBase: localesBase}),
            JsonRefs.resolveRefsAt('ru.json', {relativeBase: localesBase})
        ]).then(function ([{resolved: schema}, {resolved: enUS}, {resolved: ar}, {resolved: fa}, {resolved: ru}]) {
            [enUS, ar, fa, ru].forEach(function (locale) {
                valid = validate(schema, locale);
                test.strictEqual(valid, true);
            });
            test.done();
        });
    },
    'languages.json test': function (test) { // See TextBrowser to-dos on what must be fixed for this to work
        Promise.all([
            JsonRefs.resolveRefsAt('languages.jsonschema', {relativeBase: schemaBase}),
            JsonRefs.resolveRefsAt('languages.json', {relativeBase: localesBase})
        ]).then(function ([{resolved: schema}, {resolved: data}]) {
            valid = validate(schema, data);
            test.strictEqual(valid, true);
            test.done();
        });
    }
};

if (typeof exports !== 'undefined') {
    module.exports = bahaiwritingsTests;
}
