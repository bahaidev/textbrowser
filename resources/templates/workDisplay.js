/* eslint-env browser */
import {jml, $, $$, nbsp} from 'jamilih';
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
  bdo ({fallbackDirection, message}) {
    // Displaying as div with inline display instead of span since
    //    Firefox puts punctuation at left otherwise (bdo dir
    //    seemed to have issues in Firefox)
    return ['div', {style: 'display: inline; direction: ' + fallbackDirection}, [message]];
  },
  columnsTable: ({
    lDirectional, fieldInfo, $p, lElement, lIndexedParam, l,
    // metadataObj, preferredLocale, schemaItems,
    fieldMatchesLocale
  }) => ['table', {
    border: '1', cellpadding: '5', align: 'center'
  }, [
    ['tr', [
      ['th', [
        lDirectional('fieldno')
      ]],
      ['th', {align: 'left', width: '20'}, [
        lDirectional('field_enabled')
      ]],
      ['th', [
        lDirectional('field_title')
      ]],
      ['th', [
        lDirectional('fieldinterlin')
      ]],
      ['th', [
        lDirectional('fieldcss')
      ]]
      /*
            Todo: Support search?
            ,
            ['th', [
                lDirectional('fieldsearch')
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
        lElement('check-columns-to-browse', 'td', 'title', {}, [
          lElement('yes', 'input', 'value', {
            class: 'fieldSelector',
            id: checkedIndex,
            name: lIndexedParam('checked') + idx,
            checked: $p.get(checkedIndex) !== l('no') &&
                            ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
            type: 'checkbox'
          })
        ]),
        lElement('check-sequence', 'td', 'title', {}, [
          ['select', {
            name: lIndexedParam('field') + idx,
            id: fieldIndex,
            size: '1'
          }, fieldInfo.map(({field, fieldAliasOrName}, j) => {
            const matchedFieldParam = fieldParam && fieldParam === fieldAliasOrName;
            return ['option', {
              dataset: {name: field},
              value: fieldAliasOrName,
              selected: (
                matchedFieldParam ||
                                  (j === i && !$p.has(fieldIndex))
              )
            }, [fieldAliasOrName]];
          })]
        ]),
        ['td', [ // Todo: Make as tag selector with fields as options
          lElement('interlinear-tips', 'input', 'title', {
            name: lIndexedParam('interlin') + idx,
            value: $p.get('interlin' + idx)
          }) // Todo: Could allow i18n of numbers here
        ]],
        ['td', [ // Todo: Make as CodeMirror-highlighted CSS
          ['input', {name: lIndexedParam('css') + idx, value: $p.get('css' + idx)}]
        ]]
        /*
                ,
                ['td', [ // Todo: Allow plain or regexp searching
                    ['input', {name: lIndexedParam('search') + idx, value: $p.get('search' + idx)}]
                ]]
                */
      ]];
    }),
    ['tr', [
      ['td', {colspan: 3}, [
        lElement('check_all', 'input', 'value', {
          type: 'button',
          $on: {
            click () {
              $$('.fieldSelector').forEach((checkbox) => {
                checkbox.checked = true;
              });
            }
          }
        }),
        lElement('uncheck_all', 'input', 'value', {
          type: 'button',
          $on: {
            click () {
              $$('.fieldSelector').forEach((checkbox) => {
                checkbox.checked = false;
              });
            }
          }
        }),
        lElement('checkmark_locale_fields_only', 'input', 'value', {
          type: 'button',
          $on: {
            click () {
              fieldInfo.forEach((/* {field} */_, i) => {
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
  advancedFormatting: ({lDirectional, lParam, l, lOption, lElement, $p, hideFormattingSection}) => ['td', {
    id: 'advancedformatting', style: {display: (hideFormattingSection ? 'none' : 'block')}
  }, [
    ['h3', [lDirectional('advancedformatting')]],
    ['label', [
      lDirectional('textcolor'), nbsp2,
      ['select', {name: lParam('colorName')}, colors.map((color, i) => {
        const atts = {
          value: l(['param_values', 'colors', color]),
          selected: null
        };
        if ($p.get('colorName') === l(['param_values', 'colors', color]) ||
                    (i === 1 && !$p.has('colorName'))) {
          atts.selected = 'selected';
        }
        return lOption(['param_values', 'colors', color], atts);
      })]
    ]],
    ['label', [
      nbsp, lDirectional('or_entercolor'), nbsp2,
      ['input', {
        name: lParam('color'),
        type: 'text',
        value: ($p.get('color') || '#'),
        size: '7',
        maxlength: '7'}]
    ]],
    ['br'], ['br'],
    ['label', [
      lDirectional('backgroundcolor'), nbsp2,
      ['select', {name: lParam('bgcolorName')}, colors.map((color, i) => {
        const atts = {
          value: l(['param_values', 'colors', color]),
          selected: null
        };
        if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) ||
                    (i === 14 && !$p.has('bgcolorName'))) {
          atts.selected = 'selected';
        }
        return lOption(['param_values', 'colors', color], atts);
      })]
    ]],
    ['label', [
      nbsp, lDirectional('or_entercolor'), nbsp2,
      ['input', {
        name: lParam('bgcolor'),
        type: 'text',
        value: ($p.get('bgcolor') || '#'),
        size: '7',
        maxlength: '7'}]
    ]],
    ['br'], ['br'],
    ['label', [
      lDirectional('text_font'), nbsp2,
      // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
      ['select', {name: lParam('fontSeq'), dir: 'ltr'}, fonts.map((fontSeq, i) => {
        const atts = {
          value: fontSeq,
          selected: null
        };
        if ($p.get('fontSeq') === fontSeq || (i === 7 && !$p.has('fontSeq'))) {
          atts.selected = 'selected';
        }
        return ['option', atts, [fontSeq]];
      })]
    ]],
    ['br'], ['br'],
    ['label', [
      lDirectional('font_style'), nbsp2,
      ['select', {name: lParam('fontstyle')}, [
        'italic',
        'normal',
        'oblique'
      ].map((fontstyle, i) => {
        const atts = {
          value: l(['param_values', 'fontstyle', fontstyle]),
          selected: null
        };
        if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) ||
                    (i === 1 && !$p.has('fontstyle'))) {
          atts.selected = 'selected';
        }
        return lOption(['param_values', 'fontstyle', fontstyle], atts);
      })]
    ]],
    ['br'],
    ['div', [
      lDirectional('font_variant'), nbsp3,
      ['label', [
        ['input', {
          name: lParam('fontvariant'),
          type: 'radio',
          value: l(['param_values', 'fontvariant', 'normal']),
          checked: $p.get('fontvariant') !==
                        lDirectional(['param_values', 'fontvariant', 'small-caps'])
        }],
        lDirectional(['param_values', 'fontvariant', 'normal']), nbsp
      ]],
      ['label', [
        ['input', {
          name: lParam('fontvariant'),
          type: 'radio',
          value: l(['param_values', 'fontvariant', 'small-caps']),
          checked: $p.get('fontvariant') ===
                        lDirectional(['param_values', 'fontvariant', 'small-caps'])
        }],
        lDirectional(['param_values', 'fontvariant', 'small-caps']), nbsp
      ]]
    ]],
    ['br'],
    ['label', [
      // Todo: i18n and allow for normal/bold pulldown and float input?
      lDirectional('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2,
      ['input', {
        name: lParam('fontweight'),
        type: 'text',
        value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
        size: '7',
        maxlength: '12'}]
    ]],
    ['br'],
    ['label', [
      lDirectional('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2,
      ['input', {
        name: lParam('fontsize'),
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
      lDirectional('font_stretch'), nbsp,
      ['select', {name: lParam('fontstretch')}, [
        'ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed',
        'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'
      ].map((stretch) => {
        const atts = {
          value: lDirectional(['param_values', 'font-stretch', stretch]),
          selected: null
        };
        if ($p.get('fontstretch') === stretch ||
                      (!$p.has('fontstretch') && stretch === 'normal')) {
          atts.selected = 'selected';
        }
        return ['option', atts, [lDirectional(['param_values', 'font-stretch', stretch])]];
      })]
    ]],
    /**/
    ['br'], ['br'],
    ['label', [
      lDirectional('letter_spacing'), ' (normal, .9em, -.05cm): ',
      ['input', {
        name: lParam('letterspacing'),
        type: 'text',
        value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
        size: '7',
        maxlength: '12'}]
    ]],
    ['br'],
    ['label', [
      lDirectional('line_height'), ' (normal, 1.5, 22px, 150%): ',
      ['input', {
        name: lParam('lineheight'),
        type: 'text',
        value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
        size: '7',
        maxlength: '12'}]
    ]],
    ['br'], ['br'],
    lElement('tableformatting_tips', 'h3', 'title', {}, [
      lDirectional('tableformatting')
    ]),
    ['div', [
      lDirectional('header_wstyles'), nbsp2,
      ...([
        ['yes', lDirectional(['param_values', 'y'])],
        ['no', lDirectional(['param_values', 'n'])],
        ['none', lDirectional(['param_values', '0'])]
      ].map(([key, val], i, arr) => {
        return ['label', [
          ['input', {
            name: lParam('header'),
            type: 'radio',
            value: val,
            checked: $p.get('header') === val ||
                            (!$p.has('header') && i === 1)
          }],
          lDirectional(key), (i === arr.length - 1 ? '' : nbsp3)
        ]];
      }))
    ]],
    ['div', [
      lDirectional('footer_wstyles'), nbsp2,
      ...([
        ['yes', lDirectional(['param_values', 'y'])],
        ['no', lDirectional(['param_values', 'n'])],
        ['none', lDirectional(['param_values', '0'])]
      ].map(([key, val], i, arr) => {
        return ['label', [
          ['input', {
            name: lParam('footer'),
            type: 'radio',
            value: val,
            checked: $p.get('footer') === val ||
                            (!$p.has('footer') && i === 2)
          }],
          lDirectional(key), (i === arr.length - 1 ? '' : nbsp3)
        ]];
      }))
    ]],
    ['label', [
      ['input', {
        name: lParam('headerfooterfixed'),
        type: 'checkbox',
        value: l('yes'),
        checked: $p.get('headerfooterfixed') === l('yes')
      }],
      nbsp2, lDirectional('headerfooterfixed-wishtoscroll')
    ]],
    ['br'],
    ['div', [
      lDirectional('caption_wstyles'), nbsp2,
      ...([
        ['yes', lDirectional(['param_values', 'y'])],
        ['no', lDirectional(['param_values', 'n'])],
        ['none', lDirectional(['param_values', '0'])]
      ].map(([key, val], i, arr) => {
        return ['label', [
          ['input', {
            name: lParam('caption'),
            type: 'radio',
            value: val,
            checked: $p.get('caption') === val ||
                            (!$p.has('caption') && i === 2)
          }],
          lDirectional(key), (i === arr.length - 1 ? '' : nbsp3)
        ]];
      }))
    ]],
    ['br'],
    ['div', [
      lDirectional('table_wborder'), nbsp2,
      ['label', [
        ['input', {
          name: lParam('border'),
          type: 'radio',
          value: '1',
          checked: $p.get('border') !== '0'
        }],
        lDirectional('yes'), nbsp3
      ]],
      ['label', [
        ['input', {
          name: lParam('border'),
          type: 'radio',
          value: '0',
          checked: $p.get('border') === '0'}],
        lDirectional('no')
      ]]
    ]],
    ['div', [
      lDirectional('interlin_repeat_field_names'), nbsp2,
      ['label', [
        ['input', {
          name: lParam('interlintitle'),
          type: 'radio',
          value: '1',
          checked: $p.get('interlintitle') !== '0'
        }],
        lDirectional('yes'), nbsp3
      ]],
      ['label', [
        ['input', {
          name: lParam('interlintitle'),
          type: 'radio',
          value: '0',
          checked: $p.get('interlintitle') === '0'
        }],
        lDirectional('no')
      ]]
    ]],
    ['label', [
      lDirectional('interlintitle_css'), nbsp2,
      ['input', {
        name: lParam('interlintitle_css'),
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
                name: lParam('transpose'),
                type: 'checkbox',
                value: l('yes'),
                checked: $p.get('transpose') === l('yes')
            }],
            nbsp2, lDirectional('transpose')
        ]],
        */
    ['br'],
    lElement('pageformatting_tips', 'h3', 'title', {}, [
      lDirectional('pageformatting')
    ]),
    /*
        ['label', [
            lDirectional('speech_controls'), nbsp2,
            ['label', [
                ['input', {
                    name: lParam('speech'),
                    type: 'radio',
                    value: '1',
                    checked: $p.get('speech') === '1'
                }],
                lDirectional('yes'), nbsp3
            ]],
            ['label', [
                ['input', {
                    name: lParam('speech'),
                    type: 'radio',
                    value: '0',
                    checked: $p.get('speech') !== '1'
                }],
                lDirectional('no')
            ]]
        ]],
        ['br'],
        */
    ['label', [
      lDirectional('page_css'), nbsp2,
      ['textarea', {
        name: lParam('pagecss'),
        title: l('page_css_tips'),
        value: $p.get('pagecss')
      }]
    ]],
    ['br'],
    lElement('outputmode_tips', 'label', 'title', {}, [
      lDirectional('outputmode'), nbsp2,
      // Todo: Could i18nize, but would need smaller values
      ['select', {name: lParam('outputmode')}, [
        'table',
        'div'
        // , 'json-array',
        // 'json-object'
      ].map((mode) => {
        const atts = {
          value: mode,
          selected: null
        };
        if ($p.get('outputmode') === mode) {
          atts.selected = 'selected';
        }
        return lOption(['param_values', 'outputmode', mode], atts);
      })]
    ])
  ]],
  addRandomFormFields ({
    lParam, lDirectional, l, lElement, $p, serializeParamsAsURL, content
  }) {
    const addRowContent = (rowContent) => {
      if (!rowContent || !rowContent.length) {
        return;
      }
      content.push(['tr', rowContent]);
    };
    [
      [
        ['td', {colspan: 12, align: 'center'}, [['br'], lDirectional('or'), ['br'], ['br']]]
      ],
      [
        ['td', {colspan: 12, align: 'center'}, [
          // Todo: Could allow random with fixed starting and/or ending range
          ['label', [
            lDirectional('rnd'), nbsp3,
            ['input', {
              id: 'rand',
              name: lParam('rand'),
              type: 'checkbox',
              value: l('yes'),
              checked: $p.get('rand') === l('yes')
            }]
          ]],
          nbsp3,
          ['label', [
            lDirectional('verses-context'), nbsp,
            ['input', {
              name: lParam('context'),
              type: 'number',
              min: 1,
              size: 4,
              value: $p.get('context')
            }]
          ]],
          nbsp3,
          lElement('view-random-URL', 'input', 'value', {
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
    // languageParam, workI18n, groups,
    paramsSetter, replaceHash,
    getFieldAliasOrNames, work,
    langs, languageI18n, l, localizeParamNames, namespace,
    hideFormattingSection, preferencesPlugin
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
              [...selectedOptions].map((opt) => {
                return opt.value;
              })
            ));
          }
        }
      }, langs.map((lan) => {
        let langCodes = localStorage.getItem(namespace + '-langCodes');
        langCodes = langCodes && JSON.parse(langCodes);
        const atts = {
          value: lan.code,
          selected: null
        };
        if (langCodes && langCodes.includes(lan.code)) {
          atts.selected = 'selected';
        }
        return ['option', atts, [
          languageI18n(lan.code)
        ]];
      })]
    ]],
    (preferencesPlugin
      ? preferencesPlugin({
        $, l, jml, paramsSetter, getDataForSerializingParamsAsURL, work,
        replaceHash, getFieldAliasOrNames
      })
      : ''
    )
  ]],
  addBrowseFields ({browseFields, fieldInfo, lDirectional, i, lIndexedParam, $p, content}) {
    const work = $p.get('work');
    const addRowContent = (rowContent) => {
      if (!rowContent || !rowContent.length) {
        return;
      }
      content.push(['tr', rowContent]);
    };
    [
      // Todo: Separate formatting to CSS
      i > 0
        ? [
          ['td', {colspan: 12, align: 'center'}, [['br'], lDirectional('or'), ['br'], ['br']]]
        ]
        : '',
      [
        ...(() => {
          const addBrowseFieldSet = (setType) => {
            return browseFields.reduce((rowContent, {
              fieldName, aliases, fieldSchema: {minimum, maximum}
            }, j) => {
              // Namespace by work for sake of browser auto-complete caching
              const name = work + '-' + lIndexedParam(setType) + (i + 1) + '-' + (j + 1);
              const id = name;
              rowContent['#'].push(
                ['td', [
                  ['label', {for: name}, [fieldName]]
                ]],
                ['td', [
                  aliases
                    ? ['datalist', {
                      id: 'dl-' + id
                    }, aliases.map((alias) => ['option', [alias]])]
                    : '',
                  aliases
                    ? ['input', {
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
                    }]
                    : ['input', {
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
          };
          return [
            addBrowseFieldSet('start'),
            ['td', [
              ['b', [lDirectional('to')]],
              nbsp3
            ]],
            addBrowseFieldSet('end')
          ];
        })(),
        ['td', [
          browseFields.length > 1 ? lDirectional('versesendingdataoptional') : ''
        ]]
      ],
      [
        ['td', {colspan: (4 * browseFields.length) + 2 + 1, align: 'center'}, [
          ['table', [
            ['tr', [
              browseFields.reduce((
                rowContent, {
                  fieldName, aliases, fieldSchema: {minimum, maximum}
                }, j
              ) => {
                // Namespace by work for sake of browser auto-complete caching
                const name = work + '-' + lIndexedParam('anchor') + (i + 1) + '-' + (j + 1);
                const id = name;
                rowContent['#'].push(
                  ['td', [
                    ['label', {for: name}, [fieldName]]
                  ]],
                  ['td', [
                    aliases
                      ? ['datalist', {
                        id: 'dl-' + id
                      }, aliases.map((alias) => ['option', [alias]])]
                      : '',
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
                  lDirectional('anchored-at') + nbsp3
                ]]
              ]}),
              ['td', [
                ['label', [
                  lDirectional('field') + nbsp2,
                  ['select', {
                    name: lIndexedParam('anchorfield') + (i + 1),
                    size: '1'
                  }, fieldInfo.map(({fieldAliasOrName}) => {
                    const val = $p.get(lIndexedParam('anchorfield') + (i + 1), true);
                    if (val === fieldAliasOrName) {
                      return ['option', {selected: true}, [fieldAliasOrName]];
                    }
                    return ['option', [fieldAliasOrName]];
                  })]
                ]]
              ]]
            ]]
          ]]
        ]]
      ]
    ].forEach(addRowContent);
  },
  main ({
    workI18n, languageParam,
    l, namespace, heading, // fallbackDirection,
    languageI18n, langs, fieldInfo, localizeParamNames,
    serializeParamsAsURL, paramsSetter, replaceHash,
    getFieldAliasOrNames,
    hideFormattingSection, $p,
    metadataObj, lParam, lElement, lDirectional, lIndexedParam, fieldMatchesLocale,
    preferredLocale, schemaItems, content, groups, preferencesPlugin
  }) {
    const work = $p.get('work');
    const serializeParamsAsURLWithData = ({type}) => {
      return serializeParamsAsURL(
        {...getDataForSerializingParamsAsURL(), type}
      );
    };
    const lOption = (key, atts) => {
      return ['option', atts, [
        l(
          key
          // Ensure `intl-dom` supports
          // , fallback ({message}) {
          //   atts.dir = fallbackDirection;
          //   return message;
          // }
        )
      ]];
    };
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
            languageParam, workI18n, paramsSetter, replaceHash,
            getFieldAliasOrNames, work,
            langs, languageI18n, l, localizeParamNames, namespace,
            groups, hideFormattingSection, preferencesPlugin
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
        }, name: lParam('browse')}, [
          ['table', {align: 'center'}, content],
          ['br'],
          ['div', {style: 'margin-left: 20px'}, [
            ['br'], ['br'],
            ['table', {border: '1', align: 'center', cellpadding: '5'}, [
              ['tr', {valign: 'top'}, [
                ['td', [
                  Templates.workDisplay.columnsTable({
                    lDirectional, fieldInfo, $p, lElement, lIndexedParam, l,
                    metadataObj, preferredLocale, schemaItems,
                    fieldMatchesLocale
                  }),
                  lElement('save-settings-URL', 'input', 'value', {
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
                  lDirectional, lParam, l, lOption, lElement, $p, hideFormattingSection
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
                                name: lParam('arw') + i,
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
            lElement('submitgo', 'input', 'value', {
              type: 'submit'
            })
          ]]
        ]]
      ],
      $('#main')
    );
  }
};
