/*globals formSerialize, JsonRefs, IMF, getJSON, jml, URLSearchParams*/
/*jslint vars:true, todo:true*/

/*
Todos (higher priority)

1. Add other Writings piecemeal (e.g., Qur'an/Bible)

1. Option to bookmark view (and utilize this for defaults before search)

1. Split Baha'i texts into a separate repo and add todo there: Suggest API to Baha'i World Centre to automatically (and periodically) parse their texts into JSON here to ensure we have the most up-to-date and corrected translations
1. Choose clearer naming/structure for locale table/field keys
    1. Consider tablealias and default to table or something (as fieldalias defaults to fieldname); aliased heading (also used as the title of the page)
    1. Consider using prefer_alias for field alias use and optionally show both?
    1. Consider moving table-specific/field-specific locale data to metadata file for modularity; then avoid unchecking when clicking button re: matching current locale if fieldvalue is present (i.e., replace hasFieldvalue functionality)
1. Remove "numbers only" strings (including from locale files?) if allowing for aliased searches (e.g., "Gen")
1. Once updated, add and make use of updated json-refs to make single resolveRef call and try relative refs.
1. Review code for readability

1. Get the automated fields listed in drop-down menus; also new overlay type (See README todos)

Todos (for browse9.php)
1. Handle defaults for empty boxes if not already
1. Test all locales and works and combos
1. Utilize prefer_alias

Todos (lower priority)
1. Might support arbitary JSON and JSON Reference querying (if files.json configured to indicate "*" or something)
1. filetypes.json for app and schema association? (files.json for permitted files - a file which could be auto-created, e.g., if server permits all in a directory); especially potentially useful with JSONEditor to allow editing of these files, app types:
    1. langs + locale / locale only
    1. files/dbs->file (supply language choice)->file contents
    1. schemas
1. Note-taking (local/remote and wiki WYSIWYG with Git version control?)
1. Node.js (or PHP) for serving JSON files immediately and then injecting config for index.js to avoid reloading
1. Update "about" text in locales and utilize on popup or something?
1. Assistant file (for translating; needs server for password)
1. Add tooltips and table summaries, etc. back (see locale file for these and reapply any other unused)
1. Add any other reasonable browse_options (e.g., to Collins esp.)
1. Add "By page" for the Aqdas (once parsed by page)
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
    var fallbackLanguages = ['en-US'];
    var language = languageParam || fallbackLanguages[0]; // We need a default to display a default title
    var lang = language.split('.');
    var preferredLocale = lang[0];
    var direction = getDirectionForLanguageCode(preferredLocale);
    var fallbackDirection = getDirectionForLanguageCode(fallbackLanguages[0]);
    document.dir = direction;
    
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
        document.title = l({key: "browserfile-workselect", fallback: true});

        // We use getJSON instead of JsonRefs as we do not necessarily need to resolve the file contents here
        getJSON('appdata/files.json', function (dbs) {
            var lo = function (key, atts) {
                return ['option', atts, [
                    l({key: key, fallback: function (obj) {
                        atts.dir = fallbackDirection;
                        return obj.message;
                    }})
                ]];
            };
            var ld = function (key, values, formats) {
                return l({key: key, values: values, formats: formats, fallback: function (obj) {
                    // Displaying as div with inline display instead of span since Firefox puts punctuation at left otherwise
                    return ['div', {style: 'display: inline;direction: ' + fallbackDirection}, [obj.message]];
                }});
            };
            jml(
                'div',
                {'class': 'focus'},
                dbs.groups.map(function (fileGroup, i) {
                    return ['div', [
                        (i > 0 ? ['br', 'br', 'br'] : ''),
                        ['div', [ld(fileGroup.directions)]],
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
                            return lo(['tablealias', file.name], {value: file.name});
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

        // Returns plain text node or element (as Jamilih) with fallback direction
        var ld = function (key, values, formats) {
            return l({key: key, values: values, formats: formats, fallback: function (obj) {
                // Displaying as div with inline display instead of span since Firefox puts punctuation at left otherwise (bdo dir seemed to have issues in Firefox)
                return ['div', {style: 'display: inline;direction: ' + fallbackDirection}, [obj.message]];
            }});
        };
        // Returns option element with localized option text (as Jamilih), with optional fallback direction
        var lo = function (key, atts) {
            return ['option', atts, [
                l({key: key, fallback: function (obj) {
                    atts.dir = fallbackDirection;
                    return obj.message;
                }})
            ]];
        };
        // Returns element with localized or fallback attribute value (as Jamilih); also adds direction
        var le = function (key, el, attToLocalize, atts, children) {
            atts[attToLocalize] = l({key: key, fallback: function (obj) {
                atts.dir = fallbackDirection;
                return obj.message;
            }});
            return [el, atts, children];
        };

        var schemaItems = schema.items.items;
        var content = [];
        
        function getFieldAliasOrName (field) {
            var fieldName;
            var fieldAlias = metadata.fields && metadata.fields[field] && metadata.fields[field].alias;
            if (fieldAlias) {
                fieldName = ld(['fieldalias', work, fieldAlias]);
            }
            if (!fieldAlias || !fieldName[2][0]) { // No alias
                fieldName = ld(['fieldname', work, field]);
            }
            return fieldName;
        }
        function addRowContent (rowContent) {
            if (!rowContent || !rowContent.length) {return;}
            content.push(['tr', rowContent]);
        }
        var enumFvs = {};
        var enumerateds = {};
        metadata.table.browse_fields.forEach(function (browseFieldObject, i) {
            
            if (typeof browseFieldObject === 'string') {
                browseFieldObject = {set: [browseFieldObject]};
            }
            
            
            var fieldSets = browseFieldObject.set;
            // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]] as kind of fieldset

            var browseFields = fieldSets.map(function (browse_field, j) {
                var fieldSchema = schemaItems.find(function (item) {
                    return item.title === browse_field;
                });
                
                // Todo: Check fieldSchema for integer or string?
                
                var enumerated = metadata.fields && metadata.fields[browse_field] && metadata.fields[browse_field].sequentialEnum && fieldSchema['enum'];
                if (enumerated) {
                    enumerateds[j] = enumerated;
                    enumFvs[j] = defineFormatter(['fieldvalue', work, browse_field]);
                }
                
                return getFieldAliasOrName(browse_field);
            });
            
            [
                // Todo: Separate formatting to CSS
                i > 0 ?
                    [
                        ['td', {colspan: 12, align: 'center'}, [['br'], ld("or"), ['br'], ['br']]]
                    ] :
                    '',
                [
                    browseFields.reduce(function (rowContent, browseField, j) {
                        rowContent['#'].push(
                            ['td', [
                                ['label', [browseField]]
                            ]],
                            ['td', [
                                ['input', {name: 'start' + i + '-' + fieldSets[j], type: 'text', size: '7'}],
                                nbsp.repeat(3)
                            ]]
                        );
                        return rowContent;
                    }, {'#': []}),
                    ['td', [
                        ['b', [ld("to")]],
                        nbsp.repeat(3)
                    ]],
                    browseFields.reduce(function (rowContent, browseField, j) {
                        rowContent['#'].push(
                            ['td', [browseField]],
                            ['td', [
                                ['input', {name: 'end' + i + '-' + fieldSets[j], type: 'text', size: '7'}],
                                nbsp.repeat(2)
                            ]]
                        );
                        return rowContent;
                    }, {'#': []}),
                    ['td', [ld("numbers-only"), ' ', browseFields > 1 ? ld("versesendingdataoptional") : '']]
                ]
            ].forEach(addRowContent);
        });
        
        [
            [
                ['td', {colspan: 12, align: 'center'}, [['br'], ld("or"), ['br'], ['br']]]
            ],
            [
                ['td', {colspan: 12, align: 'center'}, [
                    // Todo: Could allow random with fixed starting and/or ending range
                    ['label', [
                        ['input', {name: 'random', type: 'checkbox'}],
                        ld("rnd"), nbsp.repeat(3)
                    ]],
                    ['label', [
                        ld("verses-context"), nbsp,
                        ['input', {name: 'context', type: 'text', size: 4}]
                    ]],
                    nbsp.repeat(3),
                    le("view-random-URL", 'input', 'value', {type: 'button', $on: {click: function () {
                        var paramsCopy = new URLSearchParams(params);
                        var formParamsHash = formSerialize(document.querySelector('form[name=browse]'), {hash:true});
                        Object.keys(formParamsHash).forEach(function (key) {
                            paramsCopy.set(key, formParamsHash[key]);
                        });
                        paramsCopy.set('random', 'on');
                        paramsCopy.set('result', 'true');
                        document.querySelector('#randomURL').value = window.location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
                    }}}),
                    ['input', {id: 'randomURL', type: 'text'}]
                ]]
            ],
            Object.keys(enumFvs).reduce(function (arr, enumFv, i) {
                var fv = enumFvs[enumFv];
                var enumerated = enumerateds[enumFv];
                
                arr.push(
                    ['td', {colspan: 12}, [
                        ['table', {align: 'center'}, [['tr', [['td',
                            (enumerated.length > 2) ? [
                                ['select', {name: 'toggle' + i}, enumerated.concat('All').map(function (choice) {
                                    if (choice === 'All') {
                                        return ['option', {value: ''}, [ld("enum-all")]];
                                    }
                                    return ['option', {value: choice}, [fv({key: choice, fallback: true})]];
                                })]
                            ] :
                            enumerated.map(function (choice, j, arr) {
                                return {'#': [
                                    j > 0 ? nbsp.repeat(3) : '',
                                    ['label', [
                                        fv({key: choice, fallback: true}),
                                        ['input', {name: 'toggle' + i, type: 'radio', value: choice}]
                                    ]],
                                    j === arr.length - 1 ?
                                        {'#': [
                                            nbsp.repeat(4),
                                            ['label', [
                                                ld("both"),
                                                ['input', {name: 'toggle' + i, type: 'radio', value: ''}]
                                            ]]
                                        ]} :
                                        ''
                                ]};
                            })
                        ]]]]]
                    ]]
                );
                return arr;
            }, [])
        ].forEach(addRowContent);
        
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
                    ld("field_enabled")
                ]],
                ['th', [
                    ld("field_title")
                ]],
                ['th', [
                    ld("fieldinterlin")
                ]],
                ['th', [
                    ld("fieldcss")
                ]],
                ['th', [
                    ld("fieldsearch")
                ]]
            ]],
            {'#': fields.map(function (fieldName, i) {
                return ['tr', [
                    le("check-columns-to-browse", 'td', 'title', {}, [
                        le("yes", 'input', 'value', {'class': 'fieldSelector', id: 'option' + i, name: 'option' + i, type: 'checkbox', checked: 'checked'})
                    ]),
                    le("check-sequence", 'td', 'title', {}, [
                        ['select', {name: 'field' + i, id: 'field' + i, size: '1'},
                            fields.map(function (field, j) {
                                var fn = getFieldAliasOrName(field);
                                return (j !== i) ?
                                    ['option', {value: j}, [fn]] :
                                    ['option', {value: j, selected: 'selected'}, [fn]];
                            })
                        ]
                    ]),
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
                    le("check_all", 'input', 'value', {type: 'button', $on: {click: function () {
                        Array.from(document.querySelectorAll('.fieldSelector')).forEach(function (checkbox) {
                            checkbox.checked = true;
                        });
                    }}}),
                    le("uncheck_all", 'input', 'value', {type: 'button', $on: {click: function () {
                        Array.from(document.querySelectorAll('.fieldSelector')).forEach(function (checkbox) {
                            checkbox.checked = false;
                        });
                    }}}),
                    le("checkmark_locale_fields_only", 'input', 'value', {type: 'button', $on: {click: function () {
                        // Todo: remember this locales choice by cookie?
                        fields.forEach(function (field, i) {
                            var currFieldValue = fields[document.querySelector('#field' + i).value];
                            var metaFieldInfo = metadata && metadata.fields && metadata.fields[currFieldValue];
                            var metaLang;
                            if (metaFieldInfo) {
                                metaLang = metadata.fields[currFieldValue].lang;
                            }
                            var higherLocale = preferredLocale.replace(/\-.*$/, '');

                            if ((metaFieldInfo && metaFieldInfo.hasFieldvalue) || // If this is a localized field (e.g., enum), we don't want to avoid as may be translated (should check though)
                                [preferredLocale, higherLocale].indexOf(metaLang) > -1
                            ) {
                                document.querySelector('#option' + i).checked = true;
                            }
                            else if (!schemaItems.some(function (item) {
                                return item.title === currFieldValue && item.type !== 'string';
                            })) {
                                document.querySelector('#option' + i).checked = false;
                            }
                        });
                    }}})
                ]]
            ]]
        ]];

        
        var arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        
        jml(
            'div',
            {'class': 'focus'},
            [
                ['h2', [ld(['tableheading', work])]],
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
                                    ['h3', [ld("advancedformatting")]],
                                    ['label', [
                                        ld("textcolor"),
                                        ['select', {name: 'color2'}, colors.map(function (color, i) {
                                            return i === 1 ? lo(color, {selected: 'selected', value: color}) : lo(color, {value: color});
                                        })]
                                    ]],
                                    
                                    ['label', [
                                        nbsp, ld("or_entercolor"),
                                        ['input', {name: 'color', type: 'text', value: '#', size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("backgroundcolor"),
                                        ['select', {name: 'bgcolor'}, colors.map(function (color, i) {
                                            return i === 14 ? lo(color, {selected: 'selected', value: color}) : lo(color, {value: color});
                                        })]
                                    ]],
                                    ['label', [
                                        nbsp, ld("or_entercolor"),
                                        ['input', {name: 'bgcolor', type: 'text', value: '#', size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("text_font"),
                                        // Todo: remove hard-coded direction if i81nizing
                                        ['select', {name: 'font', dir: 'ltr'}, fonts.map(function (fonts, i) {
                                            return (i === 7) ? ['option', {selected: 'selected'}, fonts] : ['option', fonts];
                                        })]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("font_style"), nbsp,
                                        ['select', {name: 'fontstyle'}, [
                                            lo("italic", {value: 'italic'}),
                                            lo("fontstyle_normal", {value: 'normal', selected: 'selected'}),
                                            lo("oblique", {value: 'oblique'})
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_variant"), nbsp.repeat(3),
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'normal'}],
                                            ld("fontvariant_normal"), nbsp
                                        ]],
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'small-caps'}],
                                            ld("smallcaps"), nbsp
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_weight"), " (normal, bold, 100-900, etc.): ", // Todo: i18n and allow for normal/bold pulldown and float input?
                                        ['input', {name: 'fontweight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_size"), " (14pt, 14px, small, 75%, etc.): ",
                                        ['input', {name: 'fontsize', type: 'text', value: '', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    /*
                                    This CSS attribute didn't work so it was removed in favor of letter-spacing (see the following) which can do the trick:
                                    */
                                    // Todo: i18nize title and values?
                                    // Todo: remove hard-coded direction if i81nizing
                                    ['label', {dir: 'ltr', title: "wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc."}, [
                                        ld("font_stretch"), nbsp,
                                        ['select', {name: 'fontstretch'},
                                            ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(function (stretch) {
                                                var atts = {value: stretch};
                                                if (stretch === 'normal') {
                                                    atts.selected = 'selected';
                                                }
                                                return ['option', atts, [stretch]];
                                            })
                                        ]
                                    ]],
                                    /**/
                                    ['br'],['br'],
                                    ['label', [
                                        ld("letter_spacing"), " (normal, .9em, -.05cm): ",
                                        ['input', {name: 'letterspacing', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("line_height"), " (normal, 1.5, 22px, 150%): ",
                                        ['input', {name: 'lineheight', type: 'text', value: 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],['br'],
                                    le("tableformatting_tips", 'h3', 'title', {}, [
                                        ld("tableformatting")
                                    ]),
                                    ['div', [
                                        ld("header_wstyles"), nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'y'}],
                                            ld("yes"), nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: 'n', checked: 'checked'}],
                                            ld("no"), nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'headings', type: 'radio', value: '0'}],
                                            ld("none")
                                        ]]
                                    ]],
                                    ['label', [
                                        ['input', {name: 'wishcaption', type: 'checkbox'}],
                                        nbsp.repeat(2), ld("wishcaption")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'headerfixed', type: 'checkbox'}],
                                        nbsp.repeat(2), ld("headerfixed-wishtoscroll")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("table_wborder"), nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '1', checked: 'checked'}],
                                            ld("yes"), nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '0'}],
                                            ld("no")
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'transpose', type: 'checkbox', value: '1'}],
                                        nbsp.repeat(2), ld("transpose")
                                    ]],
                                    ['br'],['br'],
                                    le("pageformatting_tips", 'h3', 'title', {}, [
                                        ld("pageformatting")
                                    ]),
                                    le("outputmode_tips", 'label', 'title', {}, [
                                        ld("outputmode"),
                                        ['select', [
                                            'table',
                                            'div',
                                            'json-array',
                                            'json-object'
                                        ].map(function (mode) {
                                            return lo("outputmode_" + mode, {value: mode});
                                        })]
                                    ])
                                ]]
                                /*
                                ,arabicContent ?
                                    // If there is Arabic content, a text box will be created for each field with such content to allow the user to choose how wide the field should be (since the Arabic is smaller).
                                    // Todo: Allow naming of the field differently for Persian? Allowing any column to be resized would probably be most consistent with this project's aim to not make arbitrary decisions on what should be customizable, but rather make as much as possible customizable. It may also be helpful for Chinese, etc.
                                    {'#': arabicContent.map(function (item, i) {
                                        return {'#': [
                                            "Width of Arabic column: ", // Todo: i18n
                                            ['input', {name: "arw" + i, type: 'text', value: '', size: '7', maxlength: '12'}]
                                        ]};
                                    })} :
                                    ''
                                */
                            ]]
                        ]]
                    ]],
                    ['p', {align: 'center'}, [
                        le("Go", 'input', 'value', {type: 'button'})
                    ]]
                ]]
            ],
            document.body
        );
    }
    
    function workDisplay (l, defineFormatter) {
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
            
            document.title = l({key: "browserfile-workdisplay", values: {work: fileData ?
                l({key: ["tablealias", work], fallback: true}) : ''
            }, fallback: true});
            
            var baseDir = (dbs.baseDirectory || fileGroup.baseDirectory) + '/';
            var schemaBaseDir = (dbs.schemaBaseDirectory || fileGroup.schemaBaseDirectory) + '/';
            var metadataBaseDir = (dbs.metadataBaseDir || fileGroup.metadataBaseDir) + '/';
            
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
        // document.title = l({key: "browserfile-resultsdisplay", values: {work: fileData ?
        //    l({key: ["tablealias", work], fallback: true}) : ''
        //}, fallback: true});
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
        fallbackLanguages: fallbackLanguages,
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
