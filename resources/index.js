/*globals formSerialize, JsonRefs, IMF, getJSON, jml, URLSearchParams*/
/*jslint vars:true, todo:true*/

/*
Todos
1. User-configured (and/or locale-based) hiding of content languages
1. Transpose columns
1. Random selection (and allow copying the URL)
1. Update about text in locales and utilize on popup or something?
1. Assistant file (for translating; needs server for password)

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
    var direction = getDirectionForLanguageCode(lang[0]);
    
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
        metadata.table.browse_fields.forEach(function (browse_field, i) {
            // Todo: Handle where browse_field is an object of form: {name:, set:}
            
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
                                    ['select', {name: 'toggle' + i}, enumerated.map(function (choice) {
                                        return ['option', {value: choice}, [choice]];
                                    })]
                                ] :
                                enumerated.map(function (choice, j, arr) {
                                    return {'#': [
                                        j > 0 ? nbsp.repeat(3) : '',
                                        ['label', [
                                            choice,
                                            ['input', {type: 'radio', name: 'toggle' + i, value: choice}]
                                        ]],
                                        j === arr.length - 1 ?
                                            {'#': [
                                                nbsp.repeat(4),
                                                ['label', [
                                                    l("both"),
                                                    ['input', {type: 'radio', name: 'toggle' + i, value: ''}]
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
        
        // Todo: Get the automated fields listed in drop-down menus
        // Todo: Add later option to "Search for any text you wish to find in that column:"
        
        var fields = schemaItems.map(function (schemaItem) {
            return fn(schemaItem.title);
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
                        ['input', {'class': 'fieldSelector', name: 'option' + i, type: 'checkbox', value: l("yes"), checked: 'checked'}]
                    ]],
                    ['td', {title: "Check the sequence (you can choose the same field twice if you wish)"}, [
                        ['select', {name: 'field' + i, id: 'field' + i, size: '1'},
                            fields.map(function (field, j) {
                                return (j !== i) ?
                                    ['option', {value: j}, [field]] :
                                    ['option', {value: j, selected: 'selected'}, [field]];
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
                ['div', [ // Todo: Change to form name=browse?
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [ // Todo: ok as blockquote?
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [columnsTable]],
                                ['td', [
                                    ['h3', [l("advancedformatting")]],
                                    ['label', [
                                        l("textcolor"),
                                        ['select', {id: 'color2'}, colors.map(function (color, i) {
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
                                        ['select', {id: 'bgcolor2'}, colors.map(function (color, i) {
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
                                        ['select', {id: 'font'}, fonts.map(function (fonts, i) {
                                            return (i === 7) ? ['option', {selected: 'selected'}, fonts] : ['option', fonts];
                                        })]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        l("font_style") + "(normal, italic, oblique): ",
                                        ['input', {name: 'fontstyle', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        "Font variant (normal, small-caps): ",
                                        ['input', {name: 'fontvariant', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        "Font weight (normal, bold, 100-900, etc.): ",
                                        ['input', {name: 'fontweight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        "Font size (14pt, 14px, small, 75%, etc.): ",
                                        ['input', {name: 'fontsize', type: 'text', value: '', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    /*
                                    This CSS attribute didn't work so it was removed in favor of letter-spacing (see the following) which can do the trick:
                                    */
                                    ['label', {title: "wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc."}, [
                                        "Font stretch: ",
                                        ['input', {name: 'fontstretch', type: 'text', value: 'normal', size: '12', maxlength: '16'}]
                                    ]],
                                    /**/
                                    ['br'],['br'],
                                    ['label', [
                                        "Letter-spacing (normal, .9em, -.05cm): ",
                                        ['input', {name: 'letterspacing', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        "Line height (normal, 1.5, 22px, 150%): ",
                                        ['input', {name: 'lineheight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],['br'],
                                    ['label', [
                                        "Headings (with Styles?): " + nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'y'}],
                                            "Yes" + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'n', checked: 'checked'}],
                                            "No" + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: '0'}],
                                            "None"
                                        ]]
                                    ]],
                                    ['br'],['br'],
                                    ['label', [
                                        "Table (with border?): " + nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '1', checked: 'checked'}],
                                            "Yes" + nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '0'}],
                                            "No"
                                        ]]
                                    ]],
                                    ['br'],['br']
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
