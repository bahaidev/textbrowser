/*globals JsonRefs, getJSON, jml*/
(function () {'use strict';

// Todo: change $ref usages to utilize JSON Reference ( https://github.com/whitlockjc/json-refs ) + JSON Pointer-aware library ( https://github.com/manuelstofer/json-pointer ?)

document.title = "Sacred Writings Browser";

// Need for directionality even if language specified (and we don't want to require it as a param)
getJSON('languages.json', function (langData) {

var langs = langData.languages;

function getDirectionForLanguageCode (code) {
    return langs.find(function (lang) {
        return lang.code === code;
    }).direction;
}

function paramChange () {
    
    document.body.parentNode.replaceChild(document.createElement('body'), document.body);
    
    var params = new URLSearchParams(location.hash.slice(1));
    var language = params.get('lang');

    if (!language) {
        jml('div', {'class': 'focus'},
            [['select', {size: langs.length, $on: {change: function (e) {
                params.set('lang', e.target.selectedOptions[0].value);
                location.hash = '#' + params.toString();
            }}}, langs.map(function (lang) {
                return ['option', {value: lang.code}, [lang.name]];
            })]], document.body
            
            /* Works too:
            langs.map(function (lang) {
                return ['div', [
                    ['a', {href: '#', dataset: {code: lang.code}}, [lang.name]]
                ]];
            }), document.body
            */
        );
        return;
    }
    
    var lang = language.split('.');
    
    IMF({
        languages: lang,
        localeFileResolver: function (code) {
            return langData.localeFileBasePath + langs.find(function (lang) {
                return lang.code === code;
            }).locale.$ref; // Todo: We might instead resolve all $ref (as with https://github.com/whitlockjc/json-refs ) and replace IMF() loadLocales behavior with our own now resolved locales; see https://github.com/jdorn/json-editor/issues/132
        },
        callback: function (l, defineFormatter) {

            var ta = defineFormatter('tablealias');
            
            var direction = getDirectionForLanguageCode(lang[0]);

            getJSON('files.json', function (dbs) {
                var fileGroups = dbs.groups;
                jml(
                    'div',
                    {'class': 'focus ' + direction},
                    fileGroups.map(function (fileGroup, i) {
                        return ['div', [
                            (i > 0 ? ['br', 'br', 'br'] : ''),
                            ['div', [l(fileGroup.directions)]],
                            ['br'],
                            ['select', {'class': 'file', dataset: {name: fileGroup.name}, $on: {change: function (e) {
                                // Submit
                                // alert(e.target.dataset.name);
                                
                                // Use the following to dynamically add specific file schema in place of generic table schema if validating against files.jsonschema
                                // filesSchema.properties.groups.items.properties.files.items.properties.file.anyOf.splice(1, 1, {$ref: schemaFile});
                                
                                getJSON(
                                    e.target.selectedOptions[0].dataset.fileSchema, // Change fileSchema to JSON refs?
                                    function (schema) {
                                        alert(JSON.stringify(schema));
                                    }
                                );
                                
                                // todo: alias fields
                                
                                /*
                                getJSON(e.target.selectedOptions[0].dataset.file, function (fileJSON) {
                                    alert(JSON.stringify(fileJSON));
                                });
                                */
                            }}},
                                fileGroup.files.map(function (file) {
                                    return ['option', {value: file.name, dataset: {fileSchema: (dbs.schemaBaseDirectory || fileGroup.schemaBaseDirectory) + '/' + file.fileSchema, file: (dbs.baseDirectory || fileGroup.baseDirectory) + '/' + file.file.$ref}}, [ta(file.name)]];
                                })
                            ],
                            ['p', [
                                ['input', {type: 'button', value: "Go"}]
                            ]]
                        ]];
                    }),
                    document.body
                );
            });

            /*
            Add back to files.json when overcome memory issue when exporting to JSON from BL
            ,
            {
                "name": "Other Writings",
                "directions": "choosewritings_bahai_writingsotherdb",
                "baseDirectory": "other-works",
                "files": [
                    {"file": "Collins.json", "name": "collins"},
                    {"file": "lights.json", "name": "lights"}
                ]
            }
            */
            
        }
    });
    
    
}

// INIT/ADD EVENTS

paramChange();
window.addEventListener('hashchange', paramChange, false);


});




}());
