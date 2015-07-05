/*globals formSerialize, JsonRefs, IMF, getJSON, jml, URLSearchParams*/
/*jslint vars:true, todo:true*/
(function () {'use strict';

// Todo: change $ref usages to utilize JSON Reference ( https://github.com/whitlockjc/json-refs ) + JSON Pointer-aware library ( https://github.com/manuelstofer/json-pointer ?)

document.title = "Sacred Writings Browser";


// We use getJSON instead of JsonRefs as we do not need to resolve the locales here
// Need for directionality even if language specified (and we don't want to require it as a param)
getJSON('appdata/languages.json', function (langData) {

var langs = langData.languages;

function getDirectionForLanguageCode (code) {
    return langs.find(function (lang) {
        return lang.code === code;
    }).direction;
}

function paramChange () {
    
    document.body.parentNode.replaceChild(document.createElement('body'), document.body);
    
    var params = new URLSearchParams(location.hash.slice(1));
    function $p (param) {
        return params.get(param);
    }
    function followParams () {
        location.hash = '#' + params.toString();
    }

    var language = $p('lang');
    
    if (!language) {
        jml('div', {'class': 'focus'},
            [['select', {size: langs.length, $on: {change: function (e) {
                params.set('lang', e.target.selectedOptions[0].value);
                followParams();
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
    
    var work = $p('work');
    var result = $p('result');

    function workSelect (l, defineFormatter) {

        var direction = getDirectionForLanguageCode(lang[0]);

        // We use getJSON instead of JsonRefs as we do not necessarily need to resolve the file contents here
        getJSON('appdata/files.json', function (dbs) {
            var fileGroups = dbs.groups;
            
            var ta = defineFormatter('tablealias');
            jml(
                'div',
                {'class': 'focus ' + direction},
                fileGroups.map(function (fileGroup, i) {
                    return ['div', [
                        (i > 0 ? ['br', 'br', 'br'] : ''),
                        ['div', [l(fileGroup.directions)]],
                        ['br'],
                        ['select', {'class': 'file', dataset: {name: fileGroup.name}, $on: {change: function (e) {
                            params.set('work', e.target.value);
                            followParams();
                        }}}, fileGroup.files.map(function (file) {
                            return ['option', {value: file.name}, [ta(file.name)]];
                        })],
                        ['p', [
                            ['input', {type: 'button', value: "Go"}]
                        ]]
                    ]];
                }),
                document.body
            );
        }, function (err) {
            alert(err);
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
    
    function displayWork (l, defineFormatter) {
        getJSON('appdata/files.json', function (dbs) {
            
            // Use the following to dynamically add specific file schema in place of generic table schema if validating against files.jsonschema
            // filesSchema.properties.groups.items.properties.files.items.properties.file.anyOf.splice(1, 1, {$ref: schemaFile});
            // Todo: Allow use of dbs and fileGroup together in base directories?
            function getMetadata (file, property, cb) {
                var currDir = window.location.href.replace(/(index\.html)?#.*$/, '');
                JsonRefs.resolveRefs({$ref: currDir + file + (property ? '#/' + property : '') }, {
                    // Temporary fix for lack of resolution of relative references: https://github.com/whitlockjc/json-refs/issues/11
                    processContent: function (content) {
                        var json = JSON.parse(content);
                        Object.keys(JsonRefs.findRefs(json)).forEach(function (path) {
                            var lastParent;
                            var value = JsonRefs.pathFromPointer(path).reduce(function (json, pathSeg) {
                                lastParent = json;
                                return json[pathSeg];
                            }, json);
                            lastParent.$ref = currDir + file.slice(0, file.lastIndexOf('/') + 1) + value;
                        });
                        return json;
                    }
                },
                function (err, rJson, metadata) {
                    if (err) {throw err;}
                    cb(rJson, metadata);
                });
            }

            var fileData;
            var fileGroup = dbs.groups.find(function (fileGroup) {
                fileData = fileGroup.files.find(function (file) {
                    return work === file.name;
                });
                return !!fileData;
            });
            
            
            var baseDir = (dbs.baseDirectory || fileGroup.baseDirectory) + '/';
            var schemaBaseDir = (dbs.schemaBaseDirectory || fileGroup.schemaBaseDirectory) + '/';
            var metadataBaseDir = (dbs.schemaBaseDirectory || fileGroup.schemaBaseDirectory) + '/';
            
            var file = baseDir + fileData.file.$ref;
            var schemaFile = fileData.schemaFile ? (schemaBaseDir + fileData.schemaFile) : '';
            var metadataFile = fileData.metadataFile ? (metadataBaseDir + fileData.metadataFile) : '';

            var schemaProperty = '', metadataProperty = '';
            
            if (!schemaFile) {
                schemaFile = file;
                schemaProperty = 'schema';
            }
            if (!metadataFile) {
                metadataFile = file;
                metadataProperty = 'metadata';
            }
            
            getMetadata(schemaFile, schemaProperty, function (schema) {
                getMetadata(metadataFile, metadataProperty, function (metadata) {
                    
                    // todo: alias fields
                    
                    alert('1:'+JSON.stringify(schema));
                    alert('2:'+JSON.stringify(metadata));
                    
                    
                });
            });
        
            
        }, function (err) {
            alert(err);
        });
    }
    
    function displayResults (l, defineFormatter) {
        
    }
    
    function localeCallback () {
        if (!work) {
            workSelect.apply(null, arguments);
            return;
        }
        if (!result) {
            displayWork.apply(null, arguments);
            return;
        }
        
        displayResults.apply(null, arguments);
    }
    
    IMF({
        languages: lang,
        localeFileResolver: function (code) {
            return langData.localeFileBasePath + langs.find(function (lang) {
                return lang.code === code;
            }).locale.$ref; // Todo: We might instead resolve all $ref (as with https://github.com/whitlockjc/json-refs ) and replace IMF() loadLocales behavior with our own now resolved locales; see https://github.com/jdorn/json-editor/issues/132
        },
        callback: localeCallback
    });
    
    
}

// INIT/ADD EVENTS

paramChange();
window.addEventListener('hashchange', paramChange, false);


}, function (err) {
    alert(err);
});




}());
