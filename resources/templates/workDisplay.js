/* eslint-env browser */
import {jml, $, $$, nbsp, body} from 'jamilih';
import Templates from './index.js';
import {colors, fonts} from './utils/html.js';

const nbsp2 = nbsp.repeat(2);
const nbsp3 = nbsp.repeat(3);

const getDataForSerializingParamsAsURL = () => ({
    form: $('form#browse'),
    // Todo: We don't need any default once random
    //    functionality is completed
    random: $('#rand') || {},
    checkboxes: $$('input[type=checkbox]')
});

export default {
    bdo: ({fallbackDirection, message}) =>
        // Displaying as div with inline display instead of span since
        //    Firefox puts punctuation at left otherwise (bdo dir
        //    seemed to have issues in Firefox)
        ['div', {style: 'display: inline; direction: ' + fallbackDirection}, [message]],
    columnsTable: ({
        ld, fieldInfo, $p, le, iil, l,
        metadataObj, preferredLocale, schemaItems,
        fieldMatchesLocale
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
            ]]
            /*
            Todo: Support search?
            ,
            ['th', [
                ld('fieldsearch')
            ]]
            */
        ]],
        ...fieldInfo.map((fieldInfoItem, i) => {
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
                        class: 'fieldSelector',
                        id: checkedIndex,
                        name: iil('checked') + idx,
                        checked: $p.get(checkedIndex) !== l('no') &&
                            ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
                        type: 'checkbox'
                    })
                ]),
                le('check-sequence', 'td', 'title', {}, [
                    ['select', {name: iil('field') + idx, id: fieldIndex, size: '1'},
                        fieldInfo.map(({field, fieldAliasOrName}, j) => {
                            const matchedFieldParam = fieldParam && fieldParam === fieldAliasOrName;
                            return ['option', {
                                dataset: {name: field},
                                value: fieldAliasOrName,
                                selected: (
                                    matchedFieldParam ||
                                    (j === i && !$p.has(fieldIndex))
                                )
                            }, [fieldAliasOrName]];
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
                ]]
                /*
                ,
                ['td', [ // Todo: Allow plain or regexp searching
                    ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
                ]]
                */
            ]];
        }),
        ['tr', [
            ['td', {colspan: 3}, [
                le('check_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click () {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = true;
                            });
                        }
                    }
                }),
                le('uncheck_all', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click () {
                            $$('.fieldSelector').forEach((checkbox) => {
                                checkbox.checked = false;
                            });
                        }
                    }
                }),
                le('checkmark_locale_fields_only', 'input', 'value', {
                    type: 'button',
                    $on: {
                        click () {
                            fieldInfo.forEach(({field}, i) => {
                                const idx = i + 1;
                                // The following is redundant with 'field' but may need to
                                //     retrieve later out of order?
                                const fld = $('#field' + idx).selectedOptions[0].dataset.name;
                                $('#checked' + idx).checked = fieldMatchesLocale(fld);
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
            ld('textcolor'), nbsp2,
            ['select', {name: il('colorName')}, colors.map((color, i) => {
                const atts = {value: l(['param_values', 'colors', color])};
                if ($p.get('colorName') === l(['param_values', 'colors', color]) ||
                    (i === 1 && !$p.has('colorName'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'colors', color], atts);
            })]
        ]],
        ['label', [
            nbsp, ld('or_entercolor'), nbsp2,
            ['input', {
                name: il('color'),
                type: 'text',
                value: ($p.get('color') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('backgroundcolor'), nbsp2,
            ['select', {name: il('bgcolorName')}, colors.map((color, i) => {
                const atts = {value: l(['param_values', 'colors', color])};
                if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) ||
                    (i === 14 && !$p.has('bgcolorName'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'colors', color], atts);
            })]
        ]],
        ['label', [
            nbsp, ld('or_entercolor'), nbsp2,
            ['input', {
                name: il('bgcolor'),
                type: 'text',
                value: ($p.get('bgcolor') || '#'),
                size: '7',
                maxlength: '7'}]
        ]],
        ['br'], ['br'],
        ['label', [
            ld('text_font'), nbsp2,
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
            ld('font_style'), nbsp2,
            ['select', {name: il('fontstyle')}, [
                'italic',
                'normal',
                'oblique'
            ].map((fontstyle, i) => {
                const atts = {value: l(['param_values', 'fontstyle', fontstyle])};
                if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) ||
                    (i === 1 && !$p.has('fontstyle'))) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'fontstyle', fontstyle], atts);
            })]
        ]],
        ['br'],
        ['div', [
            ld('font_variant'), nbsp3,
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l(['param_values', 'fontvariant', 'normal']),
                    checked: $p.get('fontvariant') !==
                        ld(['param_values', 'fontvariant', 'small-caps'])
                }],
                ld(['param_values', 'fontvariant', 'normal']), nbsp
            ]],
            ['label', [
                ['input', {
                    name: il('fontvariant'),
                    type: 'radio',
                    value: l(['param_values', 'fontvariant', 'small-caps']),
                    checked: $p.get('fontvariant') ===
                        ld(['param_values', 'fontvariant', 'small-caps'])
                }],
                ld(['param_values', 'fontvariant', 'small-caps']), nbsp
            ]]
        ]],
        ['br'],
        ['label', [
            // Todo: i18n and allow for normal/bold pulldown and float input?
            ld('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2,
            ['input', {
                name: il('fontweight'),
                type: 'text',
                value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        ['label', [
            ld('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2,
            ['input', {
                name: il('fontsize'),
                type: 'text',
                value: $p.get('fontsize'),
                size: '7',
                maxlength: '12'}]
        ]],
        ['br'],
        // Todo: i18nize title and values?
        // Todo: remove hard-coded direction if i18nizing
        ['label', {
            dir: 'ltr'
        }, [
            ld('font_stretch'), nbsp,
            ['select', {name: il('fontstretch')},
                [
                    'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed',
                    'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'
                ].map((stretch) => {
                    const atts = {value: ld(['param_values', 'font-stretch', stretch])};
                    if ($p.get('fontstretch') === stretch ||
                        (!$p.has('fontstretch') && stretch === 'normal')) {
                        atts.selected = 'selected';
                    }
                    return ['option', atts, [ld(['param_values', 'font-stretch', stretch])]];
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
            ld('header_wstyles'), nbsp2,
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('header'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('header') === val ||
                            (!$p.has('header') && i === 1)
                    }],
                    ld(key), (i === arr.length - 1 ? '' : nbsp3)
                ]]
            ))
        ]],
        ['div', [
            ld('footer_wstyles'), nbsp2,
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('footer'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('footer') === val ||
                            (!$p.has('footer') && i === 2)
                    }],
                    ld(key), (i === arr.length - 1 ? '' : nbsp3)
                ]]
            ))
        ]],
        ['label', [
            ['input', {
                name: il('headerfooterfixed'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('headerfooterfixed') === l('yes')
            }],
            nbsp2, ld('headerfooterfixed-wishtoscroll')
        ]],
        ['br'],
        ['div', [
            ld('caption_wstyles'), nbsp2,
            ...([
                ['yes', ld(['param_values', 'y'])],
                ['no', ld(['param_values', 'n'])],
                ['none', ld(['param_values', '0'])]
            ].map(([key, val], i, arr) =>
                ['label', [
                    ['input', {
                        name: il('caption'),
                        type: 'radio',
                        value: val,
                        checked: $p.get('caption') === val ||
                            (!$p.has('caption') && i === 2)
                    }],
                    ld(key), (i === arr.length - 1 ? '' : nbsp3)
                ]]
            ))
        ]],
        ['br'],
        ['div', [
            ld('table_wborder'), nbsp2,
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('border') !== '0'
                }],
                ld('yes'), nbsp3
            ]],
            ['label', [
                ['input', {
                    name: il('border'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('border') === '0'}],
                ld('no')
            ]]
        ]],
        ['div', [
            ld('interlin_repeat_field_names'), nbsp2,
            ['label', [
                ['input', {
                    name: il('interlintitle'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('interlintitle') !== '0'
                }],
                ld('yes'), nbsp3
            ]],
            ['label', [
                ['input', {
                    name: il('interlintitle'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('interlintitle') === '0'
                }],
                ld('no')
            ]]
        ]],
        ['label', [
            ld('interlintitle_css'), nbsp2,
            ['input', {
                name: il('interlintitle_css'),
                type: 'text',
                value: $p.get('interlintitle_css') || '',
                size: '12'
            }]
        ]],
        ['br'],
        /*
        ['br'],
        ['label', [
            ['input', {
                name: il('transpose'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('transpose') === l('yes')
            }],
            nbsp2, ld('transpose')
        ]],
        */
        ['br'],
        le('pageformatting_tips', 'h3', 'title', {}, [
            ld('pageformatting')
        ]),
        /*
        ['label', [
            ld('speech_controls'), nbsp2,
            ['label', [
                ['input', {
                    name: il('speech'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('speech') === '1'
                }],
                ld('yes'), nbsp3
            ]],
            ['label', [
                ['input', {
                    name: il('speech'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('speech') !== '1'
                }],
                ld('no')
            ]]
        ]],
        ['br'],
        */
        ['label', [
            ld('page_css'), nbsp2,
            ['textarea', {
                name: il('pagecss'),
                title: l('page_css_tips'),
                value: $p.get('pagecss')
            }]
        ]],
        ['br'],
        le('outputmode_tips', 'label', 'title', {}, [
            ld('outputmode'), nbsp2,
            // Todo: Could i18nize, but would need smaller values
            ['select', {name: il('outputmode')}, [
                'table',
                'div'
                // , 'json-array',
                // 'json-object'
            ].map((mode) => {
                const atts = {value: mode};
                if ($p.get('outputmode') === mode) {
                    atts.selected = 'selected';
                }
                return lo(['param_values', 'outputmode', mode], atts);
            })]
        ])
    ]],
    addRandomFormFields: ({
        il, ld, l, le, $p, serializeParamsAsURL, content
    }) => {
        const addRowContent = (rowContent) => {
            if (!rowContent || !rowContent.length) { return; }
            content.push(['tr', rowContent]);
        };
        [
            [
                ['td', {colspan: 12, align: 'center'}, [['br'], ld('or'), ['br'], ['br']]]
            ],
            [
                ['td', {colspan: 12, align: 'center'}, [
                    // Todo: Could allow random with fixed starting and/or ending range
                    ['label', [
                        ld('rnd'), nbsp3,
                        ['input', {
                            id: 'rand',
                            name: il('rand'),
                            type: 'checkbox',
                            value: l('yes'),
                            checked: $p.get('rand') === l('yes')
                        }]
                    ]],
                    nbsp3,
                    ['label', [
                        ld('verses-context'), nbsp,
                        ['input', {
                            name: il('context'),
                            type: 'number',
                            min: 1,
                            size: 4,
                            value: $p.get('context')
                        }]
                    ]],
                    nbsp3,
                    le('view-random-URL', 'input', 'value', {
                        type: 'button',
                        $on: {
                            click () {
                                const url = serializeParamsAsURL({
                                    ...getDataForSerializingParamsAsURL(),
                                    type: 'randomResult'
                                });
                                $('#randomURL').value = url;
                            }
                        }
                    }),
                    ['input', {id: 'randomURL', type: 'text'}]
                ]]
            ]
        ].forEach(addRowContent);
    },
    getPreferences: ({
        languageParam, lf, paramsSetter, replaceHash,
        getFieldAliasOrNames, work,
        langs, imfl, l, localizeParamNames, namespace,
        hideFormattingSection, groups
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
                    $on: {change ({target: {checked}}) {
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
                    $on: {change ({target: {checked}}) {
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
                    change ({target: {selectedOptions}}) {
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
        ]],
        ['div', [
            ['button', {
                title: l('bookmark_generation_tooltip'),
                $on: {
                    async click () { // Todo: Give option to edit (keywords and work URLs)
                        const date = new Date().getTime();
                        const ADD_DATE = date;
                        const LAST_MODIFIED = date;
                        const blob = new Blob([
                            new XMLSerializer().serializeToString(
                                jml({$document: {
                                    $DOCTYPE: {name: 'NETSCAPE-Bookmark-file-1'},
                                    title: l('Bookmarks'),
                                    body: [
                                        ['h1', [l('Bookmarks_Menu')]],
                                        ...(await getFieldAliasOrNames()).flatMap(({groupName, worksToFields}) => {
                                            return [
                                                ['dt', [
                                                    ['h3', {
                                                        ADD_DATE,
                                                        LAST_MODIFIED
                                                    }, [
                                                        groupName
                                                    ]]
                                                ]],
                                                ['dl', [
                                                    ['p'],
                                                    ...worksToFields.map(({fieldAliasOrNames, workName, shortcut: SHORTCUTURL}) => {
                                                        // Todo (low): Add anchor, etc. (until handled by `work-startEnd`); &aqdas-anchor1-1=2&anchorfield1=Paragraph
                                                        // Todo: option for additional browse field groups (startEnd2, etc.)
                                                        // Todo: For link text, use `heading` or `alias` from metadata files in place of workName (requires loading all metadata files though)
                                                        // Todo: Make Chrome NativeExt add-on to manipulate its search engines (to read a bookmarks file from Firefox properly, i.e., including keywords) https://www.makeuseof.com/answers/export-google-chrome-search-engines-address-bar/

                                                        const paramsCopy = paramsSetter({
                                                            ...getDataForSerializingParamsAsURL(),
                                                            fieldAliasOrNames,
                                                            workName: work, // Delete work of current page
                                                            type: 'shortcutResult'
                                                        });
                                                        const url = replaceHash(paramsCopy) + `&work=${workName}&${workName}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here

                                                        return ['dt', [
                                                            ['a', {
                                                                href: url,
                                                                ADD_DATE,
                                                                LAST_MODIFIED,
                                                                SHORTCUTURL
                                                            }, [
                                                                workName
                                                            ]]
                                                        ]];
                                                    })
                                                ]]
                                            ];
                                        })
                                    ]
                                }})
                            ).replace(
                                // Chrome has a quirk that requires this (and not
                                //   just any whitespace)
                                // We're not getting the keywords with Chrome,
                                //   but at least usable for bookmarks (though
                                //   not the groups apparently)
                                /<dt>/g,
                                '\n<dt>'
                            )
                        ], {type: 'text/html'});
                        const url = window.URL.createObjectURL(blob);
                        const a = jml('a', {
                            hidden: true,
                            download: 'bookmarks.html',
                            href: url
                        }, body);
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                }
            }, [l('Generate_bookmarks')]]
        ]]
    ]],
    addBrowseFields: ({browseFields, fieldInfo, ld, i, iil, $p, content}) => {
        const work = $p.get('work');
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
                ...(() => {
                    const addBrowseFieldSet = (setType) =>
                        browseFields.reduce((rowContent, {
                            fieldName, aliases, fieldSchema: {minimum, maximum}
                        }, j) => {
                            // Namespace by work for sake of browser auto-complete caching
                            const name = work + '-' + iil(setType) + (i + 1) + '-' + (j + 1);
                            const id = name;
                            rowContent['#'].push(
                                ['td', [
                                    ['label', {'for': name}, [fieldName]]
                                ]],
                                ['td', [
                                    aliases ? ['datalist', {id: 'dl-' + id},
                                        aliases.map((alias) => ['option', [alias]])
                                    ] : '',
                                    aliases ? ['input', {
                                        name, id, class: 'browseField',
                                        list: 'dl-' + id,
                                        value: $p.get(name, true),
                                        $on: setType === 'start'
                                            ? {change (e) {
                                                $$('input.browseField').forEach((bf) => {
                                                    if (bf.id.includes((i + 1) + '-' +
                                                        (j + 1))
                                                    ) {
                                                        bf.value = e.target.value;
                                                    }
                                                });
                                            }}
                                            : undefined
                                    }] : ['input', {
                                        name, id,
                                        type: 'number',
                                        min: minimum,
                                        max: maximum,
                                        value: $p.get(name, true)
                                    }],
                                    nbsp3
                                ]]
                            );
                            return rowContent;
                        }, {'#': []});
                    return [
                        addBrowseFieldSet('start'),
                        ['td', [
                            ['b', [ld('to')]],
                            nbsp3
                        ]],
                        addBrowseFieldSet('end')
                    ];
                })(),
                ['td', [
                    browseFields.length > 1 ? ld('versesendingdataoptional') : ''
                ]]
            ],
            [
                ['td', {colspan: 4 * browseFields.length + 2 + 1, align: 'center'}, [
                    ['table', [
                        ['tr', [
                            browseFields.reduce((
                                rowContent, {
                                    fieldName, aliases, fieldSchema: {minimum, maximum}
                                }, j
                            ) => {
                                // Namespace by work for sake of browser auto-complete caching
                                const name = work + '-' + iil('anchor') + (i + 1) + '-' + (j + 1);
                                const id = name;
                                rowContent['#'].push(
                                    ['td', [
                                        ['label', {'for': name}, [fieldName]]
                                    ]],
                                    ['td', [
                                        aliases ? ['datalist', {id: 'dl-' + id},
                                            aliases.map((alias) => ['option', [alias]])
                                        ] : '',
                                        aliases
                                            ? ['input', {
                                                name, id, class: 'browseField',
                                                list: 'dl-' + id,
                                                value: $p.get(name, true)
                                            }]
                                            : ['input', {
                                                name, id,
                                                type: 'number',
                                                min: minimum,
                                                max: maximum,
                                                value: $p.get(name, true)
                                            }],
                                        nbsp2
                                    ]]
                                );
                                return rowContent;
                            }, {'#': [
                                ['td', {style: 'font-weight: bold; vertical-align: bottom;'}, [
                                    ld('anchored-at') + nbsp3
                                ]]
                            ]}),
                            ['td', [
                                ['label', [
                                    ld('field') + nbsp2,
                                    ['select', {name: iil('anchorfield') + (i + 1), size: '1'},
                                        fieldInfo.map(({fieldAliasOrName}) => {
                                            const val = $p.get(iil('anchorfield') + (i + 1), true);
                                            if (val === fieldAliasOrName) {
                                                return ['option', {selected: true}, [fieldAliasOrName]];
                                            }
                                            return ['option', [fieldAliasOrName]];
                                        })
                                    ]
                                ]]
                            ]]
                        ]]
                    ]]
                ]]
            ]
        ].forEach(addRowContent);
    },
    main: ({
        lf, languageParam,
        l, namespace, heading, fallbackDirection, imfl, langs, fieldInfo, localizeParamNames,
        serializeParamsAsURL, paramsSetter, replaceHash,
        getFieldAliasOrNames,
        hideFormattingSection, $p,
        metadataObj, il, le, ld, iil, fieldMatchesLocale,
        preferredLocale, schemaItems, content, groups
    }) => {
        const work = $p.get('work');
        const serializeParamsAsURLWithData = ({type}) => {
            return serializeParamsAsURL(
                {...getDataForSerializingParamsAsURL(), type}
            );
        };
        const lo = (key, atts) =>
            ['option', atts, [
                l({
                    key,
                    fallback ({message}) {
                        atts.dir = fallbackDirection;
                        return message;
                    }
                })
            ]];
        // Returns element with localized or fallback attribute value (as Jamilih);
        //   also adds direction
        jml(
            'div',
            {class: 'focus'},
            [
                ['div', {style: 'float: left;'}, [
                    ['button', {$on: {click () {
                        const prefs = $('#preferences');
                        prefs.hidden = !prefs.hidden;
                    }}}, [l('Preferences')]],
                    Templates.workDisplay.getPreferences({
                        languageParam, lf, paramsSetter, replaceHash,
                        getFieldAliasOrNames, work,
                        langs, imfl, l, localizeParamNames, namespace,
                        groups, hideFormattingSection
                    })
                ]],
                ['h2', [heading]],
                ['br'],
                ['form', {id: 'browse', $custom: {
                    $submit () {
                        const thisParams = serializeParamsAsURLWithData({
                            type: 'saveSettings'
                        }).replace(/^[^#]*#/, '');
                        // Don't change the visible URL
                        console.log('history thisParams', thisParams);
                        history.replaceState(thisParams, document.title, location.href);
                        const newURL = serializeParamsAsURLWithData({
                            type: 'result'
                        });
                        location.href = newURL;
                    }
                }, $on: {
                    keydown ({key, target}) {
                        // Chrome is not having submit event triggered now with enter key
                        //   presses on inputs, despite having a `type=submit` input in the
                        //   form, and despite not using `preventDefault`
                        if (key === 'Enter' && target.localName.toLowerCase() !== 'textarea') {
                            this.$submit();
                        }
                    },
                    submit (e) {
                        e.preventDefault();
                        this.$submit();
                    }
                }, name: il('browse')}, [
                    ['table', {align: 'center'}, content],
                    ['br'],
                    ['div', {style: 'margin-left: 20px'}, [
                        ['br'], ['br'],
                        ['table', {border: '1', align: 'center', cellpadding: '5'}, [
                            ['tr', {valign: 'top'}, [
                                ['td', [
                                    Templates.workDisplay.columnsTable({
                                        ld, fieldInfo, $p, le, iil, l,
                                        metadataObj, preferredLocale, schemaItems,
                                        fieldMatchesLocale
                                    }),
                                    le('save-settings-URL', 'input', 'value', {
                                        type: 'button',
                                        $on: {
                                            click () {
                                                const url = serializeParamsAsURLWithData({
                                                    type: 'saveSettings'
                                                });
                                                $('#settings-URL').value = url;
                                            }
                                        }
                                    }),
                                    ['input', {id: 'settings-URL'}],
                                    ['br'],
                                    ['button', {
                                        $on: {
                                            async click (e) {
                                                e.preventDefault();
                                                const paramsCopy = paramsSetter({
                                                    ...getDataForSerializingParamsAsURL(),
                                                    workName: work, // Delete work of current page
                                                    type: 'startEndResult'
                                                });
                                                const url = replaceHash(paramsCopy) + `&work=${work}&${work}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here
                                                try {
                                                    await navigator.clipboard.writeText(url);
                                                } catch (err) {
                                                    // User rejected
                                                }
                                            }
                                        }
                                    }, [l('Copy_shortcut_URL')]]
                                ]],
                                Templates.workDisplay.advancedFormatting({
                                    ld, il, l, lo, le, $p, hideFormattingSection
                                })
                                /*
                                // Todo: Is this still the case? No way to control with CSS?
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
                            type: 'submit'
                        })
                    ]]
                ]]
            ],
            body
        );
    }
};
