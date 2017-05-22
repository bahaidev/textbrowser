/* globals Templates, jml */
const nbsp = '\u00a0';
const colors = [
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
const fonts = [
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

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

Templates.workDisplay = {
    columnsTable: ({
        ld, namespace, fields, $p, le, iil, l, getFieldAliasOrName,
        metadataObj, preferredLocale, schemaItems
    }) => ['table', {
        border: '1', cellpadding: '5', align: 'center'
    }, [
        ['tr', [
            ['th', [
                ld('fieldno')
            ]],
            ['th', {align: 'left', width: '20'}, [
                ld('field_enabled')
            ]],
            ['th', [
                ld('field_title')
            ]],
            ['th', [
                ld('fieldinterlin')
            ]],
            ['th', [
                ld('fieldcss')
            ]],
            ['th', [
                ld('fieldsearch')
            ]]
        ]],
        ...fields.map((fieldName, i) => {
            const idx = i + 1;
            const checkedIndex = 'checked' + idx;
            const fieldIndex = 'field' + idx;
            const fieldParam = $p.get(fieldIndex);
            return ['tr', [
                // Todo: Get Jamilih to accept numbers and
                //    booleans (`toString` is too dangerous)
                ['td', [String(idx)]],
                le('check-columns-to-browse', 'td', 'title', {}, [
                    le('yes', 'input', 'value', {
                        'class': 'fieldSelector',
                        id: checkedIndex,
                        name: iil('checked') + idx,
                        checked: $p.get(checkedIndex) === l('no')
                            ? undefined
                            : 'checked',
                        type: 'checkbox'
                    })
                ]),
                le('check-sequence', 'td', 'title', {}, [
                    ['select', {name: iil('field') + idx, id: fieldIndex, size: '1'},
                        fields.map((field, j) => {
                            const fn = getFieldAliasOrName(field) || field;
                            const matchedFieldParam = fieldParam && fieldParam === field;
                            return (matchedFieldParam || (!$p.has(fieldIndex) && j === i))
                                ? ['option', {
                                    dataset: {name: field}, value: fn, selected: 'selected'
                                }, [fn]]
                                : ['option', {dataset: {name: field}, value: fn}, [fn]];
                        })
                    ]
                ]),
                ['td', [ // Todo: Make as tag selector with fields as options
                    le('interlinear-tips', 'input', 'title', {
                        name: iil('interlin') + idx,
                        value: $p.get('interlin' + idx)
                    }) // Todo: Could allow i18n of numbers here
                ]],
                ['td', [ // Todo: Make as CodeMirror-highlighted CSS
                    ['input', {name: iil('css') + idx, value: $p.get('css' + idx)}]
                ]],
                ['td', [ // Todo: Allow plain or regexp searching
                    ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
                ]]
            ]];
        }),
        ['tr', [
            ['td', {colspan: 3}, [
                le('check_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = true;
                            });
                        }
                    }
                }),
                le('uncheck_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = false;
                            });
                        }
                    }
                }),
                le('checkmark_locale_fields_only', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click: () => {
                            // Todo: remember this locales choice by cookie?
                            const getPreferredLanguages = (lngs) => {
                                const langArr = [];
                                lngs.forEach((lng) => {
                                    // Todo: Check for multiple separate hyphenated
                                    //   groupings (for each supplied language)
                                    const higherLocale = lng.replace(/-.*$/, '');
                                    if (higherLocale === lng) {
                                        langArr.push(lng);
                                    } else {
                                        langArr.push(lng, higherLocale);
                                    }
                                });
                                return langArr;
                            };
                            fields.forEach((fld, i) => {
                                const idx = i + 1;
                                // The following is redundant with 'fld' but may need to
                                //     retrieve later out of order?
                                const field = $('#field' + idx).selectedOptions[0].dataset.name;

                                const metaFieldInfo = metadataObj && metadataObj.fields &&
                                    metadataObj.fields[field];
                                let metaLang;
                                if (metaFieldInfo) {
                                    metaLang = metadataObj.fields[field].lang;
                                }
                                const localeStrings = metadataObj &&
                                    metadataObj['localization-strings'];

                                // If this is a localized field (e.g., enum), we don't want
                                //  to avoid as may be translated (should check though)
                                const hasFieldValue = localeStrings &&
                                    Object.keys(localeStrings).some(lng => {
                                        const fv = localeStrings[lng] &&
                                            localeStrings[lng].fieldvalue;
                                        return fv && fv[field];
                                    });

                                // Todo: Add to this optionally with one-off tag input box
                                // Todo: Switch to fallbackLanguages so can default to
                                //    navigator.languages?
                                const langCodes = localStorage.getItem(namespace + '-langCodes');
                                const preferredLanguages = getPreferredLanguages(
                                    (langCodes && JSON.parse(langCodes)) || [preferredLocale]
                                );
                                $('#checked' + idx).checked =
                                    hasFieldValue ||
                                    (metaLang && preferredLanguages.includes(metaLang)) ||
                                    schemaItems.some(item =>
                                        item.title === field && item.type !== 'string'
                                    );
                            });
                        }
                    }
                })
            ]]
        ]]
    ]],
    advancedFormatting: ({ld, il, l, lo, le, $p, hideFormattingSection}) => ['td', {
        id: 'advancedformatting', style: {display: (hideFormattingSection ? 'none' : 'block')}
    }, [
        ['h3', [ld('advancedformatting')]],
        ['label', [
            ld('textcolor'),
            ['select', {name: il('colorName')}, colors.map((color, i) => {
                const atts = {value: l(color)};
                if ($p.get('colorName') === l(color) || (i === 1 && !$p.has('colorName'))) {
                    atts.selected = 'selected';
                }
                return lo(color, atts);
            })]
        ]],

        ['label', [
            nbsp, ld('or_entercolor'),
            ['input', {
                name: il('color'),
                type: 'text',
                value: ($p.get('color') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('backgroundcolor'),
            ['select', {name: il('bgcolorName')}, colors.map((color, i) => {
                const atts = {value: l(color)};
                if ($p.get('bgcolorName') === l(color) || (i === 14 && !$p.has('bgcolorName'))) {
                    atts.selected = 'selected';
                }
                return lo(color, atts);
            })]
        ]],
        ['label', [
            nbsp, ld('or_entercolor'),
            ['input', {
                name: il('bgcolor'),
                type: 'text',
                value: ($p.get('bgcolor') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('text_font'),
            // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
            ['select', {name: il('fontSeq'), dir: 'ltr'}, fonts.map((fontSeq, i) => {
                const atts = {value: fontSeq};
                if ($p.get('fontSeq') === fontSeq || (i === 7 && !$p.has('fontSeq'))) {
                    atts.selected = 'selected';
                }
                return ['option', atts, [fontSeq]];
            })]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('font_style'), nbsp,
            ['select', {name: il('fontstyle')}, [
                'italic',
                'normal',
                'oblique'
            ].map((fontstyle, i) => {
                const i18nFS = 'fontstyle_' + fontstyle;
                const atts = {value: l(i18nFS)};
                if ($p.get('fontstyle') === l(i18nFS) || (i === 1 && !$p.has('fontstyle'))) {
                    atts.selected = 'selected';
                }
                return lo(i18nFS, atts);
            })]
        ]],
        ['br'],
        ['label', [
            ld('font_variant'), nbsp.repeat(3),
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l('normal'),
                    checked: $p.get('fontvariant') === l('smallcaps') ? undefined : 'checked'}],
                ld('fontvariant_normal'), nbsp
            ]],
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l('smallcaps'),
                    checked: $p.get('fontvariant') === l('smallcaps') ? 'checked' : undefined}],
                ld('smallcaps'), nbsp
            ]]
        ]],
        ['br'],
        ['label', [
            // Todo: i18n and allow for normal/bold pulldown and float input?
            ld('font_weight'), ' (normal, bold, 100-900, etc.): ',
            ['input', {
                name: il('fontweight'),
                type: 'text',
                value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        ['label', [
            ld('font_size'), ' (14pt, 14px, small, 75%, etc.): ',
            ['input', {
                name: il('fontsize'),
                type: 'text',
                value: $p.get('fontsize'),
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        /*
        This CSS attribute didn't work so it was removed in favor of letter-spacing (see the
        following) which can do the trick:
        */
        // Todo: i18nize title and values?
        // Todo: remove hard-coded direction if i81nizing
        ['label', {
            dir: 'ltr',
            title: 'wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc.'
        }, [
            ld('font_stretch'), nbsp,
            ['select', {name: il('fontstretch')},
                [
                    'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed',
                    'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'
                ].map((stretch) => {
                    const atts = {value: stretch};
                    if ($p.get('fontstretch') === stretch ||
                        (!$p.has('fontstretch') && stretch === 'normal')) {
                        atts.selected = 'selected';
                    }
                    return ['option', atts, [stretch]];
                })
            ]
        ]],
        /**/
        ['br'], ['br'],
        ['label', [
            ld('letter_spacing'), ' (normal, .9em, -.05cm): ',
            ['input', {
                name: il('letterspacing'),
                type: 'text',
                value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        ['label', [
            ld('line_height'), ' (normal, 1.5, 22px, 150%): ',
            ['input', {
                name: il('lineheight'),
                type: 'text',
                value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'], ['br'],
        le('tableformatting_tips', 'h3', 'title', {}, [
            ld('tableformatting')
        ]),
        ['div', [
            ld('header_wstyles'), nbsp.repeat(2),
            ...([
                ['yes', 'y'],
                ['no', 'n'],
                ['none', '0']
            ].map((headings, i, arr) =>
                ['label', [
                    ['input', {
                        name: il('headings'),
                        type: 'radio',
                        value: headings[1],
                        checked: $p.get('headings') === headings[1] ||
                            (!$p.has('headings') && i === 1) ? 'checked' : undefined}],
                    ld(headings[0]), (i === arr.length - 1 ? '' : nbsp.repeat(3))
                ]]
            ))
        ]],
        ['label', [
            ['input', {
                name: il('wishcaption'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('wishcaption') === l('yes') ? 'checked' : undefined}],
            nbsp.repeat(2), ld('wishcaption')
        ]],
        ['br'],
        ['label', [
            ['input', {
                name: il('headerfixed'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('headerfixed') === l('yes') ? 'checked' : undefined}],
            nbsp.repeat(2), ld('headerfixed-wishtoscroll')
        ]],
        ['br'],
        ['label', [
            ld('table_wborder'), nbsp.repeat(2),
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('border') === '0' ? undefined : 'checked'}],
                ld('yes'), nbsp.repeat(3)
            ]],
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('border') === '0' ? 'checked' : undefined}],
                ld('no')
            ]]
        ]],
        ['br'],
        ['label', [
            ['input', {
                name: il('transpose'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('transpose') === l('yes') ? 'checked' : undefined}],
            nbsp.repeat(2), ld('transpose')
        ]],
        ['br'], ['br'],
        le('pageformatting_tips', 'h3', 'title', {}, [
            ld('pageformatting')
        ]),
        le('outputmode_tips', 'label', 'title', {}, [
            ld('outputmode'),
            // Todo: Could i18nize, but would need smaller values
            ['select', {name: il('outputmode')}, [
                'table',
                'div',
                'json-array',
                'json-object'
            ].map((mode) => {
                const atts = {value: mode};
                if ($p.get('outputmode') === mode) {
                    atts.selected = 'selected';
                }
                return lo('outputmode_' + mode, atts);
            })]
        ])
    ]],
    addEnumFieldValues: ({
        enumFvs, enumerateds, fallbackDirection, iil, il, ld, l, le, $p, serializeParamsAsURL, content
    }) => {
        const addRowContent = (rowContent) => {
            if (!rowContent || !rowContent.length) { return; }
            content.push(['tr', rowContent]);
        };
        [
            // Enums must be in consistent iteration order in
            //   meta-data (otherwise will need to sort here)!
            Object.keys(enumFvs).reduce((arr, enumFv, i) => {
                const fv = enumFvs[enumFv];
                const enumerated = enumerateds[enumFv];

                const name = iil('toggle') + (i + 1);
                arr.push(
                    ['td', {colspan: 12}, [
                        ['br'],
                        ['table', {align: 'center'}, [['tr', [['td',
                            enumerated.length > 2
                                ? [
                                    ['select', {name: name}, enumerated.concat('All').map(
                                        (choice) => {
                                            choice = choice === 'All' ? '' : choice;
                                            const atts = {value: choice};
                                            if ($p.get(name) === choice) {
                                                atts.selected = 'selected';
                                            }
                                            if (choice === '') {
                                                atts.value = '';
                                                return ['option', atts, [ld('enum-all')]];
                                            }
                                            return ['option', atts, [fv[choice]]];
                                        }
                                    )]
                                ]
                                : enumerated.map((choice, j, a) => {
                                    const atts = {name: name, type: 'radio', value: choice};
                                    const allAtts = {name: name, type: 'radio', value: ''};
                                    if ($p.get(name) === choice) {
                                        atts.checked = 'checked';
                                    } else if ($p.has(name) && $p.get(name) === '') {
                                        allAtts.checked = 'checked';
                                    }
                                    return {'#': [
                                        j > 0 ? nbsp.repeat(3) : '',
                                        ['label', [
                                            fv[choice],
                                            ['input', atts]
                                        ]],
                                        j === a.length - 1
                                            ? {'#': [
                                                nbsp.repeat(4),
                                                ['label', [
                                                    ld('both'),
                                                    ['input', allAtts]
                                                ]]
                                            ]}
                                            : ''
                                    ]};
                                })
                        ]]]]]
                    ]]
                );
                return arr;
            }, []),
            [
                ['td', {colspan: 12, align: 'center'}, [['br'], ld('or'), ['br'], ['br']]]
            ],
            [
                ['td', {colspan: 12, align: 'center'}, [
                    // Todo: Could allow random with fixed starting and/or ending range
                    ['label', [
                        ld('rnd'), nbsp.repeat(3),
                        ['input', {
                            id: 'rand',
                            name: il('rand'),
                            type: 'checkbox',
                            value: l('yes'),
                            checked: ($p.get('rand') === l('yes') ? 'checked' : undefined)
                        }]
                    ]],
                    ['label', [
                        ld('verses-context'), nbsp,
                        ['input', {
                            name: il('context'),
                            type: 'number',
                            size: 4,
                            value: $p.get('context')
                        }]
                    ]],
                    nbsp.repeat(3),
                    le('view-random-URL', 'input', 'value', {
                        type: 'button',
                        $on: {
                            click: () => {
                                const url = serializeParamsAsURL((paramsCopy) => {
                                    // In case it was added previously on this page,
                                    //    let's put random again toward the end.
                                    paramsCopy.delete(il('random'));
                                    paramsCopy.set(il('random'), l('yes'));
                                    paramsCopy.set(il('result'), l('yes'));
                                });
                                document.querySelector('#randomURL').value = url;
                            }
                        }
                    }),
                    ['input', {id: 'randomURL', type: 'text'}]
                ]]
            ]
        ].forEach(addRowContent);
    },
    getPreferences: ({
        langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
    }) => ['div', {
        style: {textAlign: 'left'}, id: 'preferences', hidden: 'true'
    }, [
        ['div', {style: 'margin-top: 10px;'}, [
            ['label', [
                l('localizeParamNames'),
                ['input', {
                    id: 'localizeParamNames',
                    type: 'checkbox',
                    checked: localizeParamNames,
                    $on: {change: ({target: {checked}}) => {
                        localStorage.setItem(
                            namespace + '-localizeParamNames', checked
                        );
                    }}
                }]
            ]]
        ]],
        ['div', [
            ['label', [
                l('Hide formatting section'),
                ['input', {
                    id: 'hideFormattingSection',
                    type: 'checkbox',
                    checked: hideFormattingSection,
                    $on: {change: ({target: {checked}}) => {
                        $('#advancedformatting').style.display = checked
                            ? 'none'
                            : 'block';
                        localStorage.setItem(namespace + '-hideFormattingSection', checked);
                    }}
                }]
            ]]
        ]],
        ['div', [
            ['label', {for: 'prefLangs'}, [l('Preferred language(s)')]],
            ['br'],
            ['select', {
                id: 'prefLangs',
                multiple: 'multiple',
                size: langs.length,
                $on: {
                    change: ({target: {selectedOptions}}) => {
                        // Todo: EU disclaimer re: storage?
                        localStorage.setItem(namespace + '-langCodes', JSON.stringify(
                            Array.from(selectedOptions).map((opt) =>
                                opt.value
                            )
                        ));
                    }
                }
            }, langs.map((lan) => {
                let langCodes = localStorage.getItem(namespace + '-langCodes');
                langCodes = langCodes && JSON.parse(langCodes);
                const atts = {value: lan.code};
                if (langCodes && langCodes.includes(lan.code)) {
                    atts.selected = 'selected';
                }
                return ['option', atts, [
                    imfl(['languages', lan.code])
                ]];
            })]
        ]]
    ]],
    addBrowseFields: ({browseFields, ld, i, iil, $p, content}) => {
        const addRowContent = (rowContent) => {
            if (!rowContent || !rowContent.length) { return; }
            content.push(['tr', rowContent]);
        };
        [
            // Todo: Separate formatting to CSS
            i > 0
                ? [
                    ['td', {colspan: 12, align: 'center'}, [['br'], ld('or'), ['br'], ['br']]]
                ]
                : '',
            [
                browseFields.reduce((rowContent, browseField, j) => {
                    const name = iil('start') + (i + 1) + '-' + (j + 1);
                    rowContent['#'].push(
                        ['td', [
                            ['label', {'for': name}, [browseField]]
                        ]],
                        ['td', [
                            ['input', {name, id: name, type: 'number', value: $p.get(name)}],
                            nbsp.repeat(3)
                        ]]
                    );
                    return rowContent;
                }, {'#': []}),
                ['td', [
                    ['b', [ld('to')]],
                    nbsp.repeat(3)
                ]],
                browseFields.reduce((rowContent, browseField, j) => {
                    const name = iil('end') + (i + 1) + '-' + (j + 1);
                    rowContent['#'].push(
                        ['td', [
                            ['label', {'for': name}, [browseField]]
                        ]],
                        ['td', [
                            ['input', {name, id: name, type: 'number', value: $p.get(name)}],
                            nbsp.repeat(2)
                        ]]
                    );
                    return rowContent;
                }, {'#': []}),
                ['td', [
                    ld('numbers-only'), ' ', browseFields > 1 ? ld('versesendingdataoptional') : ''
                ]]
            ]
        ].forEach(addRowContent);
    },
    main: ({
        l, namespace, heading, fallbackDirection, imfl, langs, fields, localizeParamNames,
        serializeParamsAsURL,
        hideFormattingSection, $p,
        getMetaProp, metadataObj, il, le, ld,
        iil, getFieldAliasOrName, preferredLocale, schemaItems, content
    }) => {
        const lo = (key, atts) =>
            ['option', atts, [
                l({
                    key: key,
                    fallback: ({message}) => {
                        atts.dir = fallbackDirection;
                        return message;
                    }
                })
            ]];
        // Returns element with localized or fallback attribute value (as Jamilih);
        //   also adds direction
        jml(
            'div',
            {'class': 'focus'},
            [
                ['div', {style: 'float: left;'}, [
                    ['button', {$on: {click: () => {
                        const prefs = $('#preferences');
                        prefs.hidden = !prefs.hidden;
                    }}}, [l('Preferences')]],
                    Templates.workDisplay.getPreferences({
                        langs, imfl, l, localizeParamNames, namespace, hideFormattingSection
                    })
                ]],
                ['h2', [heading]],
                ['br'],
                ['form', {id: 'browse', name: il('browse')}, [
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [
                                    Templates.workDisplay.columnsTable({
                                        /* eslint-disable object-property-newline */
                                        ld, namespace, fields, $p, le, iil, l, getFieldAliasOrName,
                                        metadataObj, preferredLocale, schemaItems
                                        /* eslint-enable object-property-newline */
                                    }),
                                    le('save-settings-URL', 'input', 'value', {
                                        type: 'button',
                                        $on: {
                                            click: () => {
                                                const url = serializeParamsAsURL((paramsCopy) => {
                                                    // In case it was added previously on
                                                    //    this page, let's remove it
                                                    paramsCopy.delete(il('random'));
                                                });
                                                $('#settings-URL').value = url;
                                            }
                                        }
                                    }),
                                    ['input', {id: 'settings-URL'}]
                                ]],
                                Templates.workDisplay.advancedFormatting({
                                    ld, il, l, lo, le, $p, hideFormattingSection
                                })
                                /*
                                ,arabicContent ?
                                    // If there is Arabic content, a text box will be created for
                                    //    each field with such content to allow the user to choose
                                    //    how wide the field should be (since the Arabic is smaller).
                                    // Todo: Allow naming of the field differently for Persian?
                                    //    Allowing any column to be resized would probably be most
                                    //    consistent with this project's aim to not make arbitrary
                                    //    decisions on what should be customizable, but rather make
                                    //    as much as possible customizable. It may also be helpful
                                    //    for Chinese, etc. If adding, also need $p.get() for
                                    //    defaulting behavior
                                    {'#': arabicContent.map((item, i) =>
                                        {'#': [
                                            'Width of Arabic column: ', // Todo: i18n
                                            ['input', {
                                                name: il('arw') + i,
                                                type: 'text',
                                                value: '',
                                                size: '7',
                                                maxlength: '12'
                                            }]
                                        ]}
                                    )} :
                                    ''
                                */
                            ]]
                        ]]
                    ]],
                    ['p', {align: 'center'}, [
                        le('submitgo', 'input', 'value', {
                            type: 'button',
                            $on: {
                                click: () => {
                                    // Todo:
                                    const url = serializeParamsAsURL((paramsCopy) => {
                                        // In case it was added previously on this page,
                                        //    let's put random again toward the end
                                        paramsCopy.delete(il('random'));
                                        paramsCopy.set(il('random'), l('yes'));
                                        paramsCopy.set(il('result'), l('yes'));
                                    });
                                    window.location.href = url;
                                }
                            }
                        })
                    ]]
                ]]
            ],
            document.body
        );
    }
};
