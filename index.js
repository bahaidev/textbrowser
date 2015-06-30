/*globals getJSON, jml*/
(function () {'use strict';

document.title = "Sacred Writings Browser";

// Need for directionality even if language specified (and we don't want to require it as a param)
getJSON('langs.json', function (langData) {

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
            }).locale.$ref; // Todo: We might instead resolve all $ref (as with https://github.com/whitlockjc/json-refs ) and replace IMF() loadLocales behavior with our own now resolved locales
        },
        callback: function (l, defineFormatter) {

            var ta = defineFormatter('tablealias');
            
            var direction = getDirectionForLanguageCode(lang[0]);

            getJSON('databases.json', function (dbs) {
                jml(
                    'div',
                    {'class': 'focus ' + direction},
                    dbs.map(function (db, i) {
                        return ['div', [
                            (i > 0 ? ['br', 'br', 'br'] : ''),
                            ['div', [l(db.directions)]],
                            ['br'],
                            ['select', {'class': 'file', dataset: {name: db.name}, $on: {change: function (e) {
                                // Submit
                                // alert(e.target.dataset.name);
                                
                                
                                getJSON(e.target.selectedOptions[0].dataset.file, function (fileJSON) {
                                    alert(JSON.stringify(fileJSON));
                                });
                                
                                
                            }}},
                                db.files.map(function (file) {
                                    return ['option', {value: file.name, dataset: {file: db.baseDirectory + '/' + file.file}}, [ta(file.name)]];
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
            Add back to databases.json when overcome memory issue
            ,
            {"name": "Other Writings", "directions": "choosewritings_bahai_writingsotherdb", "baseDirectory": "other-works", "files": [
                {"file": "Collins.json", "name": "collins"},
                {"file": "lights.json", "name": "lights"}
            ]}
            */
            
        }
    });
    
    
}

// INIT/ADD EVENTS

paramChange();
window.addEventListener('hashchange', paramChange, false);


});




}());
