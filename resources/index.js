/*global formSerialize, JsonRefs, IMF, getJSON, jml, URLSearchParams, window, alert, document, location*/
/*eslint max-len: 0, require-jsdoc: 0, no-alert: 0, no-warning-comments: 0, no-magic-numbers: 0, no-extra-parens: 0, lines-around-comment: 0*/
/* exported TextBrowser*/

var TextBrowser = (function () {'use strict';

/* eslint-disable indent */
var nbsp = '\u00a0';

function s (obj) {alert(JSON.stringify(obj));} // eslint-disable-line no-unused-vars

function TextBrowser (options) { // eslint-disable-line
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    this.languages = options.languages || 'bower_components/textbrowser/appdata/languages.json';
    this.site = options.site || 'site.json';
    this.files = options.files || 'files.json';
}

TextBrowser.prototype.init = function () {
    this.displayLanguages();
};

TextBrowser.prototype.displayLanguages = function () {
    var that = this;
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    getJSON([this.languages, this.site], function (langData, siteData) {
        that.langData = langData;
        that.siteData = siteData;
        that.paramChange();

        // INIT/ADD EVENTS
        window.addEventListener('hashchange', that.paramChange.bind(that), false);
    }, function (err) {
        alert(err);
    });
};

// Need for directionality even if language specified (and we don't want to require it as a param)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    var langs = this.langData.languages;
    return langs.find(function (lang) {
        return lang.code === code;
    }).direction;
};

// Todo: Break this up further
TextBrowser.prototype.paramChange = function () {
    var that = this;
    var langs = this.langData.languages;

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
    var preferredLangs = language.split('.');
    var lang = preferredLangs.concat(fallbackLanguages);
    var preferredLocale = lang[0];
    var direction = this.getDirectionForLanguageCode(preferredLocale);
    var fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);
    document.dir = direction;

    var work = $p('work');
    var result = $p('result');

    function localeFromLangData (lan) {
        return that.langData['localization-strings'][lan];
    }
    function localeFromFileData (lan) {
        return that.fileData['localization-strings'][lan];
    }
    function languageSelect (l) {
        // Also can use l("chooselanguage"), but assumes locale as with page title
        document.title = l("browser-title");

        jml('div', {'class': 'focus'}, [
              ['select', {size: langs.length, $on: {change: function (e) {
                  params.set('lang', e.target.selectedOptions[0].value);
                  followParams();
              }}}, langs.map(function (lan) {
                  return ['option', {value: lan.code}, [localeFromLangData(lan.code).languages[lan.code]]];
              })]
          ], document.body

          // Todo: Add in Go button (with "submitgo" localization string) to avoid need for pull-down if using first selection?
          /* Works too:
          langs.map(function (lang) {
              return ['div', [
                  ['a', {href: '#', dataset: {code: lang.code}}, [lang.name]]
              ]];
          }), document.body
          */
        );
    }


    function getCurrDir () {
      return window.location.href.replace(/(index\.html)?#.*$/, '');
    }
    function getMetaProp (metadataObj, properties, allowObjects) {
        var prop;
        properties = typeof properties === 'string' ? [properties] : properties;
        lang.some(function (lan) {
            var p = properties.slice(0);
            var strings = metadataObj['localization-strings'][lan];
            while (strings && p.length) {
                strings = strings[p.shift()];
            }
            // Todo: Fix this allowance for allowObjects (as it does not properly
            //        fallback if an object is returned from a language because
            //        that language is missing content and is only thus returning
            //        an object)
            prop = allowObjects || typeof strings === 'string' ? strings : false;
            return prop;
        });
        return prop;
    }

    function workSelect (l/*, defineFormatter*/) {
        // We use getJSON instead of JsonRefs as we do not necessarily need to resolve the file contents here
        getJSON(that.files, function (dbs) {
            that.fileData = dbs;
            var imfFile = IMF({locales: lang.map(localeFromFileData), fallbackLocales: fallbackLanguages.map(localeFromFileData)}); // eslint-disable-line new-cap
            var lf = imfFile.getFormatter();
            document.title = lf({key: "browserfile-workselect", fallback: true});

            function ld (key, values, formats) {
                return l({key: key, values: values, formats: formats, fallback: function (obj) {
                    // Displaying as div with inline display instead of span since Firefox puts punctuation at left otherwise
                    return ['div', {style: 'display: inline;direction: ' + fallbackDirection}, [obj.message]];
                }});
            }

            var map = {};
            getJSON(dbs.groups.reduce(function (arr, fileGroup, i) {
                var metadataBaseDir = (dbs.metadataBaseDirectory || '') +
                    (fileGroup.metadataBaseDirectory || '') + '/';
                return fileGroup.files.reduce(function (arr, fileData) {
                    return arr.concat(metadataBaseDir + fileData.metadataFile);
                }, arr);
            }, [])).then(function (metadataObjs) {
                function lo (metadataObj, atts) {
                    return ['option', atts, [getMetaProp(metadataObj, 'alias')]];
                }
                var fileCtr = -1;
                jml(
                    'div',
                    {'class': 'focus'},
                    dbs.groups.map(function (fileGroup, i) {
                        return ['div', [
                            i > 0 ? ['br', 'br', 'br'] : '',
                            ['div', [
                                lf({key: fileGroup.directions.localeKey, fallback: true})
                            ]],
                            ['br'],
                            ['select', {'class': 'file', dataset: {name: fileGroup.name.localeKey}, $on: {
                                click: [(function (e) {
                                    if (e.target.nodeName.toLowerCase() === 'select') {
                                        return;
                                    }
                                    params.set('work', e.target.value);
                                    followParams();
                                }), true]
                            }}, fileGroup.files.map(function (file, i) {
                                fileCtr++;
                                return lo(metadataObjs[fileCtr], {value: file.name});
                            })]
                            // Todo: Add in Go button (with "submitgo" localization string) to avoid need for pull-down if using first selection?
                        ]];
                    }),
                    document.body
                );
            }, function (err) {
                alert('Error: ' + err);
            });
        }, function (err) {
            alert(err);
        });
    }

    function _displayWork (l, defineFormatter, schemaObj, metadataObj) {

        // Returns plain text node or element (as Jamilih) with fallback direction
        function ld (key, values, formats) {
            return l({key: key, values: values, formats: formats, fallback: function (obj) {
                // Displaying as div with inline display instead of span since Firefox puts punctuation at left otherwise (bdo dir seemed to have issues in Firefox)
                return ['div', {style: 'display: inline;direction: ' + fallbackDirection}, [obj.message]];
            }});
        }
        // Returns option element with localized option text (as Jamilih), with optional fallback direction
        function lo (key, atts) {
            return ['option', atts, [
                l({key: key, fallback: function (obj) {
                    atts.dir = fallbackDirection;
                    return obj.message;
                }})
            ]];
        }
        // Returns element with localized or fallback attribute value (as Jamilih); also adds direction
        function le (key, el, attToLocalize, atts, children) {
            atts[attToLocalize] = l({key: key, fallback: function (obj) {
                atts.dir = fallbackDirection;
                return obj.message;
            }});
            return [el, atts, children];
        }

        var schemaItems = schemaObj.items.items;
        var content = [];

        function serializeParamsAsURL (cb) {
            var paramsCopy = new URLSearchParams(params);
            var formParamsHash = formSerialize(document.querySelector('form[name=browse]'), {hash: true});

            Object.keys(formParamsHash).forEach(function (key) {
                paramsCopy.set(key, formParamsHash[key]);
            });

            // Follow the same style (and order) for checkboxes
            paramsCopy.delete('rand');
            paramsCopy.set('rand', document.querySelector('#rand').checked ? 'Yes' : 'No');

            Array.from(document.querySelectorAll('input[type=checkbox]')).forEach(function (checkbox) { // We want checkboxes to typically show by default, so we cannot use the standard serialization
                paramsCopy.delete(checkbox.name); // Let's ensure the checked items are all together (at the end)
                paramsCopy.set(checkbox.name, checkbox.checked ? 'Yes' : 'No');
            });

            cb(paramsCopy);
            return window.location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
        }
        function getFieldAliasOrName (field) {
            var fieldObj = metadataObj.fields && metadataObj.fields[field];
            var fieldName, fieldAlias;
            if (fieldObj) {
                fieldAlias = fieldObj.alias;
            }
            if (fieldAlias) {
                if (typeof fieldAlias === 'string') {
                    fieldName = fieldAlias;
                }
                else {
                    fieldAlias = fieldAlias.localeKey;
                    fieldName = getMetaProp(metadataObj, fieldAlias.split('/'));
                }
            }
            else { // No alias
                fieldName = fieldObj.name;
                if (typeof fieldName === 'object') {
                    fieldName = fieldName.localeKey;
                    fieldName = getMetaProp(metadataObj, fieldName.split('/'));
                }
            }
            return fieldName;
        }
        function addRowContent (rowContent) {
            if (!rowContent || !rowContent.length) {return;}
            content.push(['tr', rowContent]);
        }
        var enumFvs = {};
        var enumerateds = {};
        metadataObj.table.browse_fields.forEach(function (browseFieldObject, i) {

            if (typeof browseFieldObject === 'string') {
                browseFieldObject = {set: [browseFieldObject]};
            }


            var fieldSets = browseFieldObject.set;
            // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]] as kind of fieldset

            var browseFields = fieldSets.map(function (browseField, j) {
                var fieldSchema = schemaItems.find(function (item) {
                    return item.title === browseField;
                });

                // Todo: Check fieldSchema for integer or string?

                var enumerated = metadataObj.fields && metadataObj.fields[browseField] && metadataObj.fields[browseField].sequentialEnum && fieldSchema.enum;
                if (enumerated) {
                    enumerateds[j] = enumerated;
                    enumFvs[j] = getMetaProp(metadataObj, ['fieldvalue', browseField], true);
                }

                return getFieldAliasOrName(browseField);
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
                        var name = 'start' + (i + 1) + '-' + fieldSets[j];
                        rowContent['#'].push(
                            ['td', [
                                ['label', {'for': name}, [browseField]]
                            ]],
                            ['td', [
                                ['input', {id: name, name: name, type: 'text', size: '7', value: $p(name)}],
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
                        var name = 'end' + (i + 1) + '-' + fieldSets[j];
                        rowContent['#'].push(
                            ['td', [
                                ['label', {'for': name}, [browseField]]
                            ]],
                            ['td', [
                                ['input', {id: name, name: name, type: 'text', size: '7', value: $p(name)}],
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
            Object.keys(enumFvs).reduce(function (arr, enumFv, i) {
                var fv = enumFvs[enumFv];
                var enumerated = enumerateds[enumFv];

                var name = 'toggle' + (i + 1);
                arr.push(
                    ['td', {colspan: 12}, [
                        ['br'],
                        ['table', {align: 'center'}, [['tr', [['td',
                            enumerated.length > 2 ? [
                                ['select', {name: name}, enumerated.concat('All').map(function (choice) {
                                    choice = choice === 'All' ? '' : choice;
                                    var atts = {value: choice};
                                    if ($p(name) === choice) {
                                        atts.selected = 'selected';
                                    }
                                    if (choice === '') {
                                        atts.value = '';
                                        return ['option', atts, [ld("enum-all")]];
                                    }
                                    return ['option', atts, [fv[choice]]];
                                })]
                            ] :
                            enumerated.map(function (choice, j, a) {
                                var atts = {name: name, type: 'radio', value: choice};
                                var allAtts = {name: name, type: 'radio', value: ''};
                                if ($p(name) === choice) {
                                    atts.checked = 'checked';
                                }
                                else if (params.has(name) && $p(name) === '') {
                                    allAtts.checked = 'checked';
                                }
                                return {'#': [
                                    j > 0 ? nbsp.repeat(3) : '',
                                    ['label', [
                                        fv[choice],
                                        ['input', atts]
                                    ]],
                                    j === a.length - 1 ?
                                        {'#': [
                                            nbsp.repeat(4),
                                            ['label', [
                                                ld("both"),
                                                ['input', allAtts]
                                            ]]
                                        ]} :
                                        ''
                                ]};
                            })
                        ]]]]]
                    ]]
                );
                return arr;
            }, []),
            [
                ['td', {colspan: 12, align: 'center'}, [['br'], ld("or"), ['br'], ['br']]]
            ],
            [
                ['td', {colspan: 12, align: 'center'}, [
                    // Todo: Could allow random with fixed starting and/or ending range
                    ['label', [
                        ['input', {id: 'rand', name: 'rand', type: 'checkbox', value: 'Yes', checked: ($p('rand') === 'Yes' ? 'checked' : undefined)}],
                        ld("rnd"), nbsp.repeat(3)
                    ]],
                    ['label', [
                        ld("verses-context"), nbsp,
                        ['input', {name: 'context', type: 'text', size: 4, value: $p('context')}]
                    ]],
                    nbsp.repeat(3),
                    le("view-random-URL", 'input', 'value', {type: 'button', $on: {click: function () {
                        var url = serializeParamsAsURL(function (paramsCopy) {
                            paramsCopy.delete('random'); // In case it was added previously on this page, let's put random again toward the end
                            paramsCopy.set('random', 'Yes');
                            paramsCopy.set('result', 'Yes');
                        });
                        document.querySelector('#randomURL').value = url;
                    }}}),
                    ['input', {id: 'randomURL', type: 'text'}]
                ]]
            ]
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
            'Helvetica, sans-serif',
            'Verdana, sans-serif',
            'Gill Sans, sans-serif',
            'Avantgarde, sans-serif',
            'Helvetica Narrow, sans-serif',
            'sans-serif',
            'Times, serif',
            'Times New Roman, serif',
            'Palatino, serif',
            'Bookman, serif',
            'New Century Schoolbook, serif',
            'serif',
            'Andale Mono, monospace',
            'Courier New, monospace',
            'Courier, monospace',
            'Lucidatypewriter, monospace',
            'Fixed, monospace',
            'monospace',
            'Comic Sans, Comic Sans MS, cursive',
            'Zapf Chancery, cursive',
            'Coronetscript, cursive',
            'Florence, cursive',
            'Parkavenue, cursive',
            'cursive',
            'Impact, fantasy',
            'Arnoldboecklin, fantasy',
            'Oldtown, fantasy',
            'Blippo, fantasy',
            'Brushstroke, fantasy',
            'fantasy'
        ];

        var fields = schemaItems.map(function (schemaItem) {
            return schemaItem.title;
        });

        var columnsTable = ['table', {border: '1', cellpadding: '5', align: 'center'}, [
            ['tr', [
                ['th', [
                    ld("fieldno")
                ]],
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
                var idx = i + 1;
                var checkedIndex = 'checked' + idx;
                var fieldIndex = 'field' + idx;
                var fieldParam = $p(fieldIndex);
                return ['tr', [
                    ['td', [String(idx)]],
                    le("check-columns-to-browse", 'td', 'title', {}, [
                        le("yes", 'input', 'value', {'class': 'fieldSelector', id: checkedIndex, name: checkedIndex, checked: $p(checkedIndex) === 'No' ? undefined : 'checked', type: 'checkbox'})
                    ]),
                    le("check-sequence", 'td', 'title', {}, [
                        ['select', {name: fieldIndex, id: fieldIndex, size: '1'},
                            fields.map(function (field, j) {
                                var fn = getFieldAliasOrName(field) || field;
                                var matchedFieldParam = fieldParam && fieldParam === field;
                                return (matchedFieldParam || (!params.has(fieldIndex) && j === i)) ? // Todo: Localize field names in params too?
                                    ['option', {value: fn, selected: 'selected'}, [fn]] :
                                    ['option', {value: fn}, [fn]];
                            })
                        ]
                    ]),
                    ['td', [ // Todo: Make as tag selector with fields as options
                        le("interlinear-tips", 'input', 'title', {name: 'interlin' + idx, value: $p('interlin' + idx)})
                    ]],
                    ['td', [ // Todo: Make as CodeMirror-highlighted CSS
                        ['input', {name: 'css' + idx, value: $p('css' + idx)}]
                    ]],
                    ['td', [ // Todo: Allow plain or regexp searching
                        ['input', {name: 'search' + idx, value: $p('search' + idx)}]
                    ]]
                ]];
            })},
            ['tr', [
                ['td', {colspan: 3}, [
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
                        fields.forEach(function (fld, i) {
                            var idx = i + 1;
                            var field = document.querySelector('#field' + idx).value;

                            var metaFieldInfo = metadataObj && metadataObj.fields && metadataObj.fields[field];
                            var metaLang;
                            if (metaFieldInfo) {
                                metaLang = metadataObj.fields[field].lang;
                            }
                            var higherLocale = preferredLocale.replace(/\-.*$/, '');

                            if ((metaFieldInfo && metaFieldInfo.hasFieldvalue) || // If this is a localized field (e.g., enum), we don't want to avoid as may be translated (should check though)
                                [preferredLocale, higherLocale].indexOf(metaLang) > -1
                            ) {
                                document.querySelector('#checked' + idx).checked = true;
                            }
                            else if (schemaItems.some(function (item) {
                                return item.title === field && item.type !== 'string';
                            })) {
                                document.querySelector('#checked' + idx).checked = true;
                            }
                            else {
                                document.querySelector('#checked' + idx).checked = false;
                            }
                        });
                    }}})
                ]]
            ]]
        ]];


        // var arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically

        jml(
            'div',
            {'class': 'focus'},
            [
                ['h2', [getMetaProp(metadataObj, 'heading')]],
                ['br'],
                ['form', {name: 'browse'}, [
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [
                                    columnsTable,
                                    le("save-settings-URL", 'input', 'value', {type: 'button', $on: {click: function () {
                                        var url = serializeParamsAsURL(function (paramsCopy) {
                                            paramsCopy.delete('random'); // In case it was added previously on this page, let's remove it
                                        });
                                        document.querySelector('#settings-URL').value = url;
                                    }}}),
                                    ['input', {id: 'settings-URL'}]
                                ]],
                                ['td', [
                                    ['h3', [ld("advancedformatting")]],
                                    ['label', [
                                        ld("textcolor"),
                                        ['select', {name: 'colorName'}, colors.map(function (color, i) {
                                            var atts = {value: color};
                                            if ($p('colorName') === color || (i === 1 && !params.has('colorName'))) {
                                                atts.selected = 'selected';
                                            }
                                            return lo(color, atts);
                                        })]
                                    ]],

                                    ['label', [
                                        nbsp, ld("or_entercolor"),
                                        ['input', {name: 'color', type: 'text', value: ($p('color') || '#'), size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("backgroundcolor"),
                                        ['select', {name: 'bgcolorName'}, colors.map(function (color, i) {
                                            var atts = {value: color};
                                            if ($p('bgcolorName') === color || (i === 14 && !params.has('bgcolorName'))) {
                                                atts.selected = 'selected';
                                            }
                                            return lo(color, atts);
                                        })]
                                    ]],
                                    ['label', [
                                        nbsp, ld("or_entercolor"),
                                        ['input', {name: 'bgcolor', type: 'text', value: ($p('bgcolor') || '#'), size: '7', maxlength: '7'}]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("text_font"),
                                        // Todo: remove hard-coded direction if i81nizing
                                        ['select', {name: 'fontSeq', dir: 'ltr'}, fonts.map(function (fontSeq, i) {
                                            var atts = {value: fontSeq};
                                            if ($p('fontSeq') === fontSeq || (i === 7 && !params.has('fontSeq'))) {
                                                atts.selected = 'selected';
                                            }
                                            return ['option', atts, [fontSeq]];
                                        })]
                                    ]],
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("font_style"), nbsp,
                                        ['select', {name: 'fontstyle'}, [
                                            'italic',
                                            'normal',
                                            'oblique'
                                        ].map(function (fontstyle, i) {
                                            var atts = {value: fontstyle};
                                            if ($p('fontstyle') === fontstyle || (i === 1 && !params.has('fontstyle'))) {
                                                atts.selected = 'selected';
                                            }
                                            return lo("fontstyle_" + fontstyle, atts);
                                        })]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_variant"), nbsp.repeat(3),
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'normal', checked: $p('fontvariant') === 'small-caps' ? undefined : 'checked'}],
                                            ld("fontvariant_normal"), nbsp
                                        ]],
                                        ['label', [
                                            ['input', {name: 'fontvariant', type: 'radio', value: 'small-caps', checked: $p('fontvariant') === 'small-caps' ? 'checked' : undefined}],
                                            ld("smallcaps"), nbsp
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_weight"), " (normal, bold, 100-900, etc.): ", // Todo: i18n and allow for normal/bold pulldown and float input?
                                        ['input', {name: 'fontweight', type: 'text', value: params.has('fontweight') ? $p('fontweight') : 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("font_size"), " (14pt, 14px, small, 75%, etc.): ",
                                        ['input', {name: 'fontsize', type: 'text', value: $p('fontsize'), size: '7', maxlength: '12'}]
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
                                                if ($p('fontstretch') === stretch || (!params.has('fontstretch') && stretch === 'normal')) {
                                                    atts.selected = 'selected';
                                                }
                                                return ['option', atts, [stretch]];
                                            })
                                        ]
                                    ]],
                                    /**/
                                    ['br'], ['br'],
                                    ['label', [
                                        ld("letter_spacing"), " (normal, .9em, -.05cm): ",
                                        ['input', {name: 'letterspacing', type: 'text', value: params.has('letterspacing') ? $p('letterspacing') : 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("line_height"), " (normal, 1.5, 22px, 150%): ",
                                        ['input', {name: 'lineheight', type: 'text', value: params.has('lineheight') ? $p('lineheight') : 'normal', size: '7', maxlength: '12'}]
                                    ]],
                                    ['br'], ['br'],
                                    le("tableformatting_tips", 'h3', 'title', {}, [
                                        ld("tableformatting")
                                    ]),
                                    ['div', [
                                        ld("header_wstyles"), nbsp.repeat(2),
                                        {'#': [
                                            ['yes', 'y'],
                                            ['no', 'n'],
                                            ['none', '0']
                                        ].map(function (headings, i, arr) {
                                            return ['label', [
                                                ['input', {name: 'headings', type: 'radio', value: headings[1], checked: $p('headings') === headings[1] || (!params.has('headings') && i === 1) ? 'checked' : undefined}],
                                                ld(headings[0]), (i === arr.length - 1 ? '' : nbsp.repeat(3))
                                            ]];
                                        })}
                                    ]],
                                    ['label', [
                                        ['input', {name: 'wishcaption', type: 'checkbox', value: 'Yes', checked: $p('wishcaption') === 'Yes' ? 'checked' : undefined}],
                                        nbsp.repeat(2), ld("wishcaption")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'headerfixed', type: 'checkbox', value: 'Yes', checked: $p('headerfixed') === 'Yes' ? 'checked' : undefined}],
                                        nbsp.repeat(2), ld("headerfixed-wishtoscroll")
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ld("table_wborder"), nbsp.repeat(2),
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '1', checked: $p('border') === '0' ? undefined : 'checked'}],
                                            ld("yes"), nbsp.repeat(3)
                                        ]],
                                        ['label', [
                                            ['input', {name: 'border', type: 'radio', value: '0', checked: $p('border') === '0' ? 'checked' : undefined}],
                                            ld("no")
                                        ]]
                                    ]],
                                    ['br'],
                                    ['label', [
                                        ['input', {name: 'transpose', type: 'checkbox', value: 'Yes', checked: $p('transpose') === 'Yes' ? 'checked' : undefined}],
                                        nbsp.repeat(2), ld("transpose")
                                    ]],
                                    ['br'], ['br'],
                                    le("pageformatting_tips", 'h3', 'title', {}, [
                                        ld("pageformatting")
                                    ]),
                                    le("outputmode_tips", 'label', 'title', {}, [
                                        ld("outputmode"),
                                        ['select', {name: 'outputmode'}, [
                                            'table',
                                            'div',
                                            'json-array',
                                            'json-object'
                                        ].map(function (mode) {
                                            var atts = {value: mode};
                                            if ($p('outputmode') === mode) {
                                                atts.selected = 'selected';
                                            }
                                            return lo("outputmode_" + mode, atts);
                                        })]
                                    ])
                                ]]
                                /*
                                ,arabicContent ?
                                    // If there is Arabic content, a text box will be created for each field with such content to allow the user to choose how wide the field should be (since the Arabic is smaller).
                                    // Todo: Allow naming of the field differently for Persian? Allowing any column to be resized would probably be most consistent with this project's aim to not make arbitrary decisions on what should be customizable, but rather make as much as possible customizable. It may also be helpful for Chinese, etc. If adding, also need $p() for defaulting behavior
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
                        le("submitgo", 'input', 'value', {type: 'button'})
                    ]]
                ]]
            ],
            document.body
        );
    }

    function workDisplay (l, defineFormatter) {
        getJSON(that.files, function (dbs) {
            that.fileData = dbs;
            // Use the following to dynamically add specific file schema in place of generic table schema if validating against files.jsonschema
            // filesSchema.properties.groups.items.properties.files.items.properties.file.anyOf.splice(1, 1, {$ref: schemaFile});
            // Todo: Allow use of dbs and fileGroup together in base directories?
            function getMetadata (file, property, cb) {
                var currDir = getCurrDir();
                JsonRefs.resolveRefs({$ref: currDir + file + (property ? '#/' + property : '')}, {
                    // Temporary fix for lack of resolution of relative references: https://github.com/whitlockjc/json-refs/issues/11
                    processContent: function (content) {
                        var json = JSON.parse(content);
                        Object.keys(JsonRefs.findRefs(json)).forEach(function (path) {
                            var lastParent;
                            var value = JsonRefs.pathFromPointer(path).reduce(function (j, pathSeg) {
                                lastParent = j;
                                return j[pathSeg];
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
            var fileGroup = dbs.groups.find(function (fg) {
                fileData = fg.files.find(function (file) {
                    return work === file.name;
                });
                return Boolean(fileData);
            });

            var baseDir = (dbs.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
            var schemaBaseDir = (dbs.schemaBaseDirectory || '') + (fileGroup.schemaBaseDirectory || '') + '/';
            var metadataBaseDir = (dbs.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';

            var file = baseDir + fileData.file.$ref;
            var schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
            var metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';

            var schemaProperty = '', metadataProperty = '';

            if (!schemaFile) {
                schemaFile = file;
                schemaProperty = 'schema';
            }
            if (!metadataFile) {
                metadataFile = file;
                metadataProperty = 'metadata';
            }

            getMetadata(schemaFile, schemaProperty, function (schemaObj) {
                getMetadata(metadataFile, metadataProperty, function (metadataObj) {
                      var imfFile = IMF({locales: lang.map(localeFromFileData), fallbackLocales: fallbackLanguages.map(localeFromFileData)}); // eslint-disable-line new-cap
                      var lf = imfFile.getFormatter();
                      document.title = lf({key: "browserfile-workdisplay", values: {work: fileData ?
                          getMetaProp(metadataObj, 'alias') : ''
                      }, fallback: true});
                    _displayWork(l, defineFormatter, schemaObj, metadataObj);
                });
            });

        }, function (err) {
            alert(err);
        });
    }

    function resultsDisplay (/* l, defineFormatter*/) {
        // Will need to retrieve fileData as above (abstract?)
        // document.title = l({key: "browserfile-resultsdisplay", values: {work: fileData ?
        //    l({key: ["tablealias", work], fallback: true}) : ''
        // }, fallback: true});
    }

    function localeFromSiteData (lan) {
        return that.siteData['localization-strings'][lan];
    }
    if (!languageParam) {
        var imfSite = IMF({locales: lang.map(localeFromSiteData), fallbackLocales: fallbackLanguages.map(localeFromSiteData)}); // eslint-disable-line new-cap
        var imfLang = IMF({locales: lang.map(localeFromLangData), fallbackLocales: fallbackLanguages.map(localeFromLangData)}); // eslint-disable-line new-cap
        languageSelect(imfSite.getFormatter(), imfLang.getFormatter());
        return;
    }

    function localeCallback (/* l, defineFormatter*/) {
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

    IMF({ // eslint-disable-line new-cap
        languages: lang,
        fallbackLanguages: fallbackLanguages,
        localeFileResolver: function (code) {
            return that.langData.localeFileBasePath + langs.find(function (l) {
                return l.code === code;
            }).locale.$ref; // Todo: For editing of locales, we might instead resolve all $ref (as with https://github.com/whitlockjc/json-refs ) and replace IMF() loadLocales behavior with our own now resolved locales; see https://github.com/jdorn/json-editor/issues/132
        },
        callback: localeCallback
    });


};

return TextBrowser;


}());
