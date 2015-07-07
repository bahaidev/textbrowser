/*globals formSerialize, JsonRefs, IMF, getJSON, jml, URLSearchParams*/
/*jslint vars:true, todo:true*/

/*
Todos (higher priority)

1. Incorporate and modify usage of alias_fielding1, alias_fielding2
1. Handle where browse_field is an object of form: {name:, set:} (line 126) then delete browse.php
1. Option to bookmark view (and utilize this for defaults before search)

1. Get the automated fields listed in drop-down menus
    1. Reverse engineer missing work by using bahai_locales database (which contains more than localization info: automated column data, alternative field names, etc.)

Todos (for browse9.php)
1. Handle defaults for empty boxes if not already


Todos (lower priority)
1. filetypes.json for app and schema association? (files.json for permitted files - a file which could be auto-created, e.g., if server permits all in a directory); especially potentially useful with JSONEditor to allow editing of these files, app types:
    1. langs + locale / locale only
    1. files/dbs->file (supply language choice)->file contents
    1. schemas
1. Note-taking (local/remote and wiki WYSIWYG with Git version control?)
1. Node.js (or PHP) for serving JSON files immediately and then injecting config for index.js to avoid reloading
1. Update "about" text in locales and utilize on popup or something?
1. Assistant file (for translating; needs server for password)
1. Add tooltips and table summaries, etc. back (see locale file for these and reapply any other unused)
*/

(function () {'use strict';

var nbsp = '\u00a0';

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

    var languageParam = $p('lang');
    var language = languageParam || 'en-US'; // We need a default to display a default title
    var lang = language.split('.');
    var preferredLocale = lang[0];
    var direction = getDirectionForLanguageCode(preferredLocale);
    
    var work = $p('work');
    var result = $p('result');

    function languageSelect (l, defineFormatter) {
        document.title = l("browserfile");
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
    }
    
    function workSelect (l, defineFormatter) {
        document.title = l("browserfile-workselect");

        // We use getJSON instead of JsonRefs as we do not necessarily need to resolve the file contents here
        getJSON('appdata/files.json', function (dbs) {
            var ta = defineFormatter('tablealias');
            jml(
                'div',
                {'class': 'focus ' + direction},
                dbs.groups.map(function (fileGroup, i) {
                    return ['div', [
                        (i > 0 ? ['br', 'br', 'br'] : ''),
                        ['div', [l(fileGroup.directions)]],
                        ['br'],
                        ['select', {'class': 'file', dataset: {name: fileGroup.name}, $on: {
                            click: [function (e) {
                                if (e.target.nodeName.toLowerCase() === 'select') {
                                    return;
                                }
                                params.set('work', e.target.value);
                                followParams();
                            }, true]
                        }}, fileGroup.files.map(function (file) {
                            return ['option', {value: file.name}, [ta(file.name)]];
                        })]
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
    
    function _displayWork (l, defineFormatter, schema, metadata) {
        var ta = defineFormatter('tablealias');
        var th = defineFormatter('tableheading');
        var fn = defineFormatter(['fieldname', work]);
        
        var schemaItems = schema.items.items;
        var content = [];
        metadata.table.browse_fields.forEach(function (browse_field, i, arr) {
            
            if (browse_field && typeof browse_field === 'object') {
                // Todo: Could use browse_field.name for a fieldset around the field set
                browse_field = browse_field.set;
            }
            
            var browseField;
            if (metadata.fields && metadata.fields[browse_field] && metadata.fields[browse_field].alias) {
                var fa = defineFormatter(['fieldalias', work]);
                browseField = fa(metadata.fields[browse_field].alias);
            }
            else {
                browseField = fn(browse_field);
            }

            var fieldSchema = schemaItems.find(function (item) {
                return item.title === browse_field;
            });
            
            // Todo: Check fieldSchema for integer or string?
            var enumerated = fieldSchema['enum'];

            var fv;
            if (enumerated) {
                fv = defineFormatter(['fieldvalue', work, browse_field]);
            }

            [
                // Todo: Fix formatting
                i > 0 ?
                    [
                        ['td', {colspan: 12, align: 'center'}, [['br'], l("or"), ['br'], ['br']]]
                    ] :
                    '',
                (enumerated ?
                    [
                        ['td', {colspan: 12}, [
                            ['table', {align: 'center'}, [['tr', [['td',
                                (enumerated.length > 2) ? [
                                    ['select', {name: 'toggle' + i}, enumerated.concat('All').map(function (choice) {
                                        if (choice === 'All') {
                                            return ['option', {value: ''}, [l("enum-all")]];
                                        }
                                        return ['option', {value: choice}, [fv(choice)]];
                                    })]
                                ] :
                                enumerated.map(function (choice, j, arr) {
                                    return {'#': [
                                        j > 0 ? nbsp.repeat(3) : '',
                                        ['label', [
                                            fv(choice),
                                            ['input', {name: 'toggle' + i, type: 'radio', value: choice}]
                                        ]],
                                        j === arr.length - 1 ?
                                            {'#': [
                                                nbsp.repeat(4),
                                                ['label', [
                                                    l("both"),
                                                    ['input', {name: 'toggle' + i, type: 'radio', value: ''}]
                                                ]]
                                            ]} :
                                            ''
                                    ]};
                                })
                            ]]]]]
                        ]]
                    ] :
                    [
                        ['td', [
                            ['label', [browseField, ': ']]
                        ]],
                        ['td', [
                            ['input', {name: 'start' + i, type: 'text', size: '7'}],
                            nbsp.repeat(3)
                        ]],
                        ['td', [
                            ['b', [l("to")]],
                            ':' + nbsp.repeat(3)
                        ]],
                        ['td', [browseField, ': ']],
                        ['td', [
                            ['input', {name: 'end' + i, type: 'text', size: '7'}],
                            nbsp.repeat(2)
                        ]],
                        ['td', [l("numbers-only")]]
                    ]
                ),
                (i === arr.length -1 ?
                    [
                        ['td', {colspan: 12, align: 'center'}, [['br'], l("or"), ['br'], ['br']]]
                    ] :
                    ''
                ),
                (i === arr.length -1 ?
                    [
                        ['td', {colspan: 12, align: 'center'}, [
                            ['label', [
                                ['input', {name: 'random', type: 'checkbox'}],
                                l("rnd") + nbsp.repeat(3)
                            ]],
                            ['label', [
                                l("verses-context") + nbsp,
                                ['input', {name: 'context', type: 'text', size: 4}]
                            ]],
                            nbsp.repeat(3),
                            ['input', {type: 'button', value: l("view-random-URL"), $on: {click: function () {
                                var paramsCopy = new URLSearchParams(params);
                                var formParamsHash = formSerialize(document.querySelector('form[name=browse]'), {hash:true});
                                Object.keys(formParamsHash).forEach(function (key) {
                                    paramsCopy.set(key, formParamsHash[key]);
                                });
                                paramsCopy.set('random', 'on');
                                paramsCopy.set('result', 'true');
                                document.querySelector('#randomURL').value = window.location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
                            }}}],
                            ['input', {id: 'randomURL', type: 'text'}]
                        ]]
                    ] :
                    ''
                )
            ].forEach(function (rowContent) {
                if (!rowContent) {return;}
                content.push(['tr', rowContent]);
            });
        });
        var colors = [
            'aqua',
            'black',
            'blue',
            'fuchsia',
            'gray',
            'green',
            'lime',
            'maroon',
            'navy',
            'olive',
            'purple',
            'red',
            'silver',
            'teal',
            'white',
            'yellow'
        ];
        var fonts = [
            ['Helvetica, sans-serif'],
            ['Verdana, sans-serif'],
            ['Gill Sans, sans-serif'],
            ['Avantgarde, sans-serif'],
            ['Helvetica Narrow, sans-serif'],
            ['sans-serif'],
            ['Times, serif'],
            ['Times New Roman, serif'],
            ['Palatino, serif'],
            ['Bookman, serif'],
            ['New Century Schoolbook, serif'],
            ['serif'],
            ['Andale Mono, monospace'],
            ['Courier New, monospace'],
            ['Courier, monospace'],
            ['Lucidatypewriter, monospace'],
            ['Fixed, monospace'],
            ['monospace'],
            ['Comic Sans, Comic Sans MS, cursive'],
            ['Zapf Chancery, cursive'],
            ['Coronetscript, cursive'],
            ['Florence, cursive'],
            ['Parkavenue, cursive'],
            ['cursive'],
            ['Impact, fantasy'],
            ['Arnoldboecklin, fantasy'],
            ['Oldtown, fantasy'],
            ['Blippo, fantasy'],
            ['Brushstroke, fantasy'],
            ['fantasy']
        ];
                
        var fields = schemaItems.map(function (schemaItem) {
            return schemaItem.title;
        });

        var columnsTable = ['table', {border: '1', cellpadding: '5', align: 'center'}, [
            ['tr', [
                ['th', {align: 'left', width: '20'}, [
                    l("field_enabled")
                ]],
                ['th', [
                    l("field_title")
                ]],
                ['th', [
                    l("fieldinterlin")
                ]],
                ['th', [
                    l("fieldcss")
                ]],
                ['th', [
                    l("fieldsearch")
                ]]
            ]],
            {'#': fields.map(function (fieldName, i) {
                return ['tr', [
                    ['td', {title: "Check the columns you wish to browse"}, [
                        ['input', {'class': 'fieldSelector', id: 'option' + i, name: 'option' + i, type: 'checkbox', value: l("yes"), checked: 'checked'}]
                    ]],
                    ['td', {title: "Check the sequence (you can choose the same field twice if you wish)"}, [
                        ['select', {name: 'field' + i, id: 'field' + i, size: '1'},
                            fields.map(function (field, j) {
                                return (j !== i) ?
                                    ['option', {value: j}, [fn(field)]] :
                                    ['option', {value: j, selected: 'selected'}, [fn(field)]];
                            })
                        ]
                    ]],
                    ['td', [ // Todo: Make as tag selector with fields as options
                        ['input', {name: 'interlin' + i}]
                    ]],
                    ['td', [ // Todo: Make as CodeMirror-highlighted CSS
                        ['input', {name: 'css' + i}]
                    ]],
                    ['td', [ // Todo: Allow plain or regexp searching
                        ['input', {name: 'search' + i}]
                    ]]
                ]];
            })},
            ['tr', [
                ['td', {colspan: 2}, [
                    ['input', {value: l("check_all"), type: 'button', $on: {click: function () {
                        Array.from(document.querySelectorAll('.fieldSelector')).forEach(function (checkbox) {
                            checkbox.checked = true;
                        });
                    }}}],
                    ['input', {value: l("uncheck_all"), type: 'button', $on: {click: function () {
                        Array.from(document.querySelectorAll('.fieldSelector')).forEach(function (checkbox) {
                            checkbox.checked = false;
                        });
                    }}}],
                    ['input', {value: l("checkmark_locale_fields_only"), type: 'button', $on: {click: function () {
                        // Todo: remember this locales choice by cookie?
                        fields.forEach(function (field, i) {
                            var currFieldValue = fields[document.querySelector('#field' + i).value];
                            var metaLang = metadata && metadata.fields && metadata.fields[currFieldValue] && metadata.fields[currFieldValue].lang;
                            var higherLocale = preferredLocale.replace(/\-.*$/, '');

                            if ([preferredLocale, higherLocale].indexOf(metaLang) > -1) {
                                document.querySelector('#option' + i).checked = true;
                            }
                            else if (!schemaItems.some(function (item) {
                                return item.title === currFieldValue && item.type !== 'string';
                            })) {
                                document.querySelector('#option' + i).checked = false;
                            }
                        });
                    }}}]
                ]]
            ]]
        ]];

        
        var arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        
        jml(
            'div',
            {'class': 'focus ' + direction},
            [
                ['h2', [th(work)]],
                ['br'],
                ['form', {name: 'browse'}, [
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [columnsTable]],
                                ['td', [
                                    ['h3', [l("advancedformatting")]],
                                    ['label', [
                                        l("textcolor"),
                                        ['select', {name: 'color2'}, colors.map(function (color, i) {
                                            return i === 1 ? ['option', {selected: 'selected', value: color}, [l(color)]] : ['option', {value: color}, [l(color)]];
                                        })]
                                    ]],
                                    
                                    ['label', [
                                        nbsp + l("or_entercolor"),
                                        ['input', {name: 'color', type: 'text', value: '#', size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        l("backgroundcolor"),
                                        ['select', {name: 'bgcolor'}, colors.map(function (color, i) {
                                            return i === 14 ? ['option', {selected: 'selected', value: color}, [l(color)]] : ['option', {value: color}, [l(color)]];
                                        })]
                                    ]],
                                    ['label', [
                                        nbsp + l("or_entercolor"),
                                        ['input', {name: 'bgcolor', type: 'text', value: '#', size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        l("text_font"),
                                        ['select', {name: 'font'}, fonts.map(function (fonts, i) {
                                            return (i === 7) ? ['option', {selected: 'selected'}, fonts] : ['option', fonts];
                                        })]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        l("font_style") + nbsp,
                                        ['select', {name: 'fontstyle'}, [
                                            ['option', {value: 'italic'}, [l("italic")]],
                                            ['option', {value: 'normal', selected: 'selected'}, [l("fontstyle_normal")]],
                                            ['option', {value: 'oblique'}, [l("oblique")]]
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        l("font_variant") + nbsp.repeat(3),
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'normal'}],
                                            l("fontvariant_normal") + nbsp
                                        ]],
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'small-caps'}],
                                            l("smallcaps") + nbsp
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        l("font_weight") + " (normal, bold, 100-900, etc.): ", // Todo: i18n and allow for normal/bold pulldown and float input?
                                        ['input', {name: 'fontweight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        l("font_size") + " (14pt, 14px, small, 75%, etc.): ",
                                        ['input', {name: 'fontsize', type: 'text', value: '', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    /*
                                    This CSS attribute didn't work so it was removed in favor of letter-spacing (see the following) which can do the trick:
                                    */
                                    ['label', {title: "wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc."}, [
                                        "Font stretch: ",
                                        ['select', {name: 'fontstretch'},
                                            ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(function (stretch) {
                                                var atts = {value: stretch};
                                                if (stretch === 'normal') {
                                                    atts.selected = 'selected';
                                                }
                                                return ['option', atts, [stretch]]; // Todo: i18nize?
                                            })
                                        ]
                                    ]],
                                    /**/
                                    ['br'],['br'],
                                    ['label', [
                                        l("letter_spacing") + " (normal, .9em, -.05cm): ",
                                        ['input', {name: 'letterspacing', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        l("line_height") + " (normal, 1.5, 22px, 150%): ",
                                        ['input', {name: 'lineheight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],['br'],
                                    ['h3', {title: l("tableformatting_tips")}, [
                                        l("tableformatting")
                                    ]],
                                    ['div', [
                                        l("header_wstyles") + nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'y'}],
                                            l("yes") + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'n', checked: 'checked'}],
                                            l("no") + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: '0'}],
                                            l("none")
                                        ]]
                                    ]],
                                    ['label', [
                                        ['input', {name: 'wishcaption', type: 'checkbox'}],
                                        nbsp.repeat(2) + l("wishcaption")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'headerfixed', type: 'checkbox'}],
                                        nbsp.repeat(2) + l("headerfixed-wishtoscroll")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        l("table_wborder") + nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '1', checked: 'checked'}],
                                            l("yes") + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '0'}],
                                            l("no")
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'trnsps', type: 'checkbox', value: '1'}],
                                        nbsp.repeat(2) + l("trnsps")
                                    ]],
                                    ['br'],['br'],
                                    ['h3', {title: l("pageformatting_tips")}, [
                                        l("pageformatting")
                                    ]],
                                    ['label', {title: "outputmode_tips"}, [
                                        l("outputmode"),
                                        ['select', [
                                            'table',
                                            'div',
                                            'json'
                                        ].map(function (mode) {
                                            return ['option', {value: mode}, [l("outputmode_" + mode)]];
                                        })]
                                    ]]
                                ]]
                                /*
                                ,arabicContent ?
                                    // If there is Arabic content, a text box will be created for each field with such content to allow the user to choose how wide the field should be (since the Arabic is smaller).
                                    // Todo: Allow naming of the field differently for Persian? Allowing any column to be resized would probably be most consistent with this project's aim to not make arbitrary decisions on what should be customizable, but rather make as much as possible customizable. It may also be helpful for Chinese, etc.
                                    {'#': arabicContent.map(function (item, i) {
                                        return {'#': [
                                            "Width of Arabic column: ",
                                            ['input', {name: "arw" + i, type: 'text', value: '', size: '7', maxlength: '12'}]
                                        ]};
                                    })} :
                                    ''
                                */
                            ]]
                        ]]
                    ]],
                    ['p', {align: 'center'}, [['input', {type: 'button', value: l("Go")}]]]
                ]]
            ],
            document.body
        );
    }
    
    function workDisplay (l, defineFormatter) {
        var ta = defineFormatter('tablealias');
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
            
            document.title = l("browserfile-workdisplay", {work: fileData ? ta(work) : ''});
            
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
                    _displayWork(l, defineFormatter, schema, metadata);
                });
            });
        
            
        }, function (err) {
            alert(err);
        });
    }
    
    function resultsDisplay (l, defineFormatter) {
        // Will need to retrieve fileData as above (abstract?)
        // var ta = defineFormatter('tablealias');
        // document.title = l("browserfile-resultsdisplay", {work: fileData ? ta(work) : ''});
        
    }

    function localeCallback (l) {
        if (!languageParam) {
            languageSelect.apply(null, arguments);
            return;
        }
        if (!work) {
            workSelect.apply(null, arguments);
            return;
        }
        if (!result) {
            workDisplay.apply(null, arguments);
            return;
        }
        resultsDisplay.apply(null, arguments);
    }
    
    IMF({
        languages: lang,
        localeFileResolver: function (code) {
            return langData.localeFileBasePath + langs.find(function (lang) {
                return lang.code === code;
            }).locale.$ref; // Todo: For editing of locales, we might instead resolve all $ref (as with https://github.com/whitlockjc/json-refs ) and replace IMF() loadLocales behavior with our own now resolved locales; see https://github.com/jdorn/json-editor/issues/132
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
