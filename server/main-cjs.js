#!/usr/bin/env node
'use strict';

require('url-search-params-polyfill');
var simpleGetJson = require('simple-get-json');
var rtlDetect = require('rtl-detect');
var jamilih = require('jamilih');
var formSerialization = require('form-serialization');
var IMF = require('imf');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var IMF__default = /*#__PURE__*/_interopDefaultLegacy(IMF);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

/**
 *
 * @param {string} param
 * @param {boolean} skip
 * @this IntlURLSearchParams
 * @returns {string}
 */
function _prepareParam(param, skip) {
  if (skip || !this.localizeParamNames) {
    // (lang)
    return param;
  } // start, end, toggle


  const endNums = /\d+(-\d+)?$/; // eslint-disable-line unicorn/no-unsafe-regex

  const indexed = param.match(endNums);

  if (indexed) {
    // Todo: We could i18nize numbers as well
    return this.l10n(['params', 'indexed', param.replace(endNums, '')]) + indexed[0];
  }

  return this.l10n(['params', param]);
}

class IntlURLSearchParams {
  constructor({
    l10n,
    params
  } = {}) {
    this.l10n = l10n;

    if (!params) {
      params = location.hash.slice(1);
    }

    if (typeof params === 'string') {
      params = new URLSearchParams(params);
    }

    this.params = params;
  }

  get(param, skip) {
    return this.params.get(_prepareParam.call(this, param, skip));
  }

  getAll(param, skip) {
    return this.params.getAll(_prepareParam.call(this, param, skip));
  }

  has(param, skip) {
    return this.params.has(_prepareParam.call(this, param, skip));
  }

  delete(param, skip) {
    return this.params.delete(_prepareParam.call(this, param, skip));
  }

  set(param, value, skip) {
    return this.params.set(_prepareParam.call(this, param, skip), value);
  }

  append(param, value, skip) {
    return this.params.append(_prepareParam.call(this, param, skip), value);
  }

  toString() {
    return this.params.toString();
  }

}

/* eslint-env browser */
var languageSelect = {
  main({
    langs,
    languages,
    followParams,
    $p
  }) {
    jamilih.jml('form', {
      class: 'focus',
      id: 'languageSelectionContainer',
      $on: {
        submit(e) {
          e.preventDefault();
        }

      }
    }, [['select', {
      name: 'lang',
      size: langs.length,
      $on: {
        click({
          target: {
            parentNode: {
              selectedOptions
            }
          }
        }) {
          followParams('#languageSelectionContainer', () => {
            $p.set('lang', selectedOptions[0].value, true);
          });
        }

      }
    }, langs.map(({
      code
    }) => ['option', {
      value: code
    }, [languages.getLanguageFromCode(code)]])]], jamilih.$('#main'));

    if (history.state && typeof history.state === 'object') {
      formSerialization.deserialize(document.querySelector('#languageSelectionContainer'), history.state);
    }
  } // Todo: Add in Go button (with 'submitgo' localization string) to
  //   avoid need for pull-down if using first selection?

  /* Works too:
    langs.map(({code, name}) =>
        ['div', [
            ['a', {href: '#', dataset: {code}}, [name]]
        ]]
    ), $('#main')
    */


};

/* eslint-env browser */
var workSelect = (({
  groups,
  lf,
  getNextAlias,
  $p,
  followParams
}) => {
  const form = jamilih.jml('form', {
    id: 'workSelect',
    class: 'focus',
    $on: {
      submit(e) {
        e.preventDefault();
      }

    }
  }, groups.map((group, i) => ['div', [i > 0 ? ['br', 'br', 'br'] : '', ['div', [lf({
    key: group.directions.localeKey,
    fallback: true
  })]], ['br'], ['select', {
    class: 'file',
    name: 'work' + i,
    dataset: {
      name: group.name.localeKey
    },
    $on: {
      change({
        target: {
          value
        }
      }) {
        /*
                      // If using click, but click doesn't always fire
                      if (e.target.nodeName.toLowerCase() === 'select') {
                          return;
                      }
                      */
        followParams('#workSelect', () => {
          $p.set('work', value);
        });
      }

    }
  }, [['option', {
    value: ''
  }, ['--']], ...group.files.map(({
    name: fileName
  }) => ['option', {
    value: lf(['workNames', group.id, fileName])
  }, [getNextAlias()]])]] // Todo: Add in Go button (with 'submitgo' localization string) to
  //    avoid need for pull-down if using first selection?
  ]]), jamilih.$('#main'));

  if (history.state && typeof history.state === 'object') {
    formSerialization.deserialize(document.querySelector('#workSelect'), history.state);
  }

  return form;
});

const colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
const fonts = ['Helvetica, sans-serif', 'Verdana, sans-serif', 'Gill Sans, sans-serif', 'Avantgarde, sans-serif', 'Helvetica Narrow, sans-serif', 'sans-serif', 'Times, serif', 'Times New Roman, serif', 'Palatino, serif', 'Bookman, serif', 'New Century Schoolbook, serif', 'serif', 'Andale Mono, monospace', 'Courier New, monospace', 'Courier, monospace', 'Lucidatypewriter, monospace', 'Fixed, monospace', 'monospace', 'Comic Sans, Comic Sans MS, cursive', 'Zapf Chancery, cursive', 'Coronetscript, cursive', 'Florence, cursive', 'Parkavenue, cursive', 'cursive', 'Impact, fantasy', 'Arnoldboecklin, fantasy', 'Oldtown, fantasy', 'Blippo, fantasy', 'Brushstroke, fantasy', 'fantasy'];

const nbsp2 = jamilih.nbsp.repeat(2);
const nbsp3 = jamilih.nbsp.repeat(3);

const getDataForSerializingParamsAsURL = () => ({
  form: jamilih.$('form#browse'),
  // Todo: We don't need any default once random
  //    functionality is completed
  random: jamilih.$('#rand') || {},
  checkboxes: jamilih.$$('input[type=checkbox]')
});

var workDisplay = {
  bdo: ({
    fallbackDirection,
    message
  }) => // Displaying as div with inline display instead of span since
  //    Firefox puts punctuation at left otherwise (bdo dir
  //    seemed to have issues in Firefox)
  ['div', {
    style: 'display: inline; direction: ' + fallbackDirection
  }, [message]],
  columnsTable: ({
    ld,
    fieldInfo,
    $p,
    le,
    iil,
    l,
    metadataObj,
    preferredLocale,
    schemaItems,
    fieldMatchesLocale
  }) => ['table', {
    border: '1',
    cellpadding: '5',
    align: 'center'
  }, [['tr', [['th', [ld('fieldno')]], ['th', {
    align: 'left',
    width: '20'
  }, [ld('field_enabled')]], ['th', [ld('field_title')]], ['th', [ld('fieldinterlin')]], ['th', [ld('fieldcss')]]
  /*
        Todo: Support search?
        ,
        ['th', [
            ld('fieldsearch')
        ]]
        */
  ]], ...fieldInfo.map((fieldInfoItem, i) => {
    const idx = i + 1;
    const checkedIndex = 'checked' + idx;
    const fieldIndex = 'field' + idx;
    const fieldParam = $p.get(fieldIndex);
    return ['tr', [// Todo: Get Jamilih to accept numbers and
    //    booleans (`toString` is too dangerous)
    ['td', [String(idx)]], le('check-columns-to-browse', 'td', 'title', {}, [le('yes', 'input', 'value', {
      class: 'fieldSelector',
      id: checkedIndex,
      name: iil('checked') + idx,
      checked: $p.get(checkedIndex) !== l('no') && ($p.has(checkedIndex) || fieldInfoItem.onByDefault !== false),
      type: 'checkbox'
    })]), le('check-sequence', 'td', 'title', {}, [['select', {
      name: iil('field') + idx,
      id: fieldIndex,
      size: '1'
    }, fieldInfo.map(({
      field,
      fieldAliasOrName
    }, j) => {
      const matchedFieldParam = fieldParam && fieldParam === fieldAliasOrName;
      return ['option', {
        dataset: {
          name: field
        },
        value: fieldAliasOrName,
        selected: matchedFieldParam || j === i && !$p.has(fieldIndex)
      }, [fieldAliasOrName]];
    })]]), ['td', [// Todo: Make as tag selector with fields as options
    le('interlinear-tips', 'input', 'title', {
      name: iil('interlin') + idx,
      value: $p.get('interlin' + idx)
    }) // Todo: Could allow i18n of numbers here
    ]], ['td', [// Todo: Make as CodeMirror-highlighted CSS
    ['input', {
      name: iil('css') + idx,
      value: $p.get('css' + idx)
    }]]]
    /*
            ,
            ['td', [ // Todo: Allow plain or regexp searching
                ['input', {name: iil('search') + idx, value: $p.get('search' + idx)}]
            ]]
            */
    ]];
  }), ['tr', [['td', {
    colspan: 3
  }, [le('check_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        jamilih.$$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = true;
        });
      }

    }
  }), le('uncheck_all', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        jamilih.$$('.fieldSelector').forEach(checkbox => {
          checkbox.checked = false;
        });
      }

    }
  }), le('checkmark_locale_fields_only', 'input', 'value', {
    type: 'button',
    $on: {
      click() {
        fieldInfo.forEach(({
          field
        }, i) => {
          const idx = i + 1; // The following is redundant with 'field' but may need to
          //     retrieve later out of order?

          const fld = jamilih.$('#field' + idx).selectedOptions[0].dataset.name;
          jamilih.$('#checked' + idx).checked = fieldMatchesLocale(fld);
        });
      }

    }
  })]]]]]],
  advancedFormatting: ({
    ld,
    il,
    l,
    lo,
    le,
    $p,
    hideFormattingSection
  }) => ['td', {
    id: 'advancedformatting',
    style: {
      display: hideFormattingSection ? 'none' : 'block'
    }
  }, [['h3', [ld('advancedformatting')]], ['label', [ld('textcolor'), nbsp2, ['select', {
    name: il('colorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color])
    };

    if ($p.get('colorName') === l(['param_values', 'colors', color]) || i === 1 && !$p.has('colorName')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'colors', color], atts);
  })]]], ['label', [jamilih.nbsp, ld('or_entercolor'), nbsp2, ['input', {
    name: il('color'),
    type: 'text',
    value: $p.get('color') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [ld('backgroundcolor'), nbsp2, ['select', {
    name: il('bgcolorName')
  }, colors.map((color, i) => {
    const atts = {
      value: l(['param_values', 'colors', color])
    };

    if ($p.get('bgcolorName') === l(['param_values', 'colors', color]) || i === 14 && !$p.has('bgcolorName')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'colors', color], atts);
  })]]], ['label', [jamilih.nbsp, ld('or_entercolor'), nbsp2, ['input', {
    name: il('bgcolor'),
    type: 'text',
    value: $p.get('bgcolor') || '#',
    size: '7',
    maxlength: '7'
  }]]], ['br'], ['br'], ['label', [ld('text_font'), nbsp2, // Todo: remove hard-coded direction if i81nizing; also i18nize fontSeq param
  ['select', {
    name: il('fontSeq'),
    dir: 'ltr'
  }, fonts.map((fontSeq, i) => {
    const atts = {
      value: fontSeq
    };

    if ($p.get('fontSeq') === fontSeq || i === 7 && !$p.has('fontSeq')) {
      atts.selected = 'selected';
    }

    return ['option', atts, [fontSeq]];
  })]]], ['br'], ['br'], ['label', [ld('font_style'), nbsp2, ['select', {
    name: il('fontstyle')
  }, ['italic', 'normal', 'oblique'].map((fontstyle, i) => {
    const atts = {
      value: l(['param_values', 'fontstyle', fontstyle])
    };

    if ($p.get('fontstyle') === l(['param_values', 'fontstyle', fontstyle]) || i === 1 && !$p.has('fontstyle')) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'fontstyle', fontstyle], atts);
  })]]], ['br'], ['div', [ld('font_variant'), nbsp3, ['label', [['input', {
    name: il('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'normal']),
    checked: $p.get('fontvariant') !== ld(['param_values', 'fontvariant', 'small-caps'])
  }], ld(['param_values', 'fontvariant', 'normal']), jamilih.nbsp]], ['label', [['input', {
    name: il('fontvariant'),
    type: 'radio',
    value: l(['param_values', 'fontvariant', 'small-caps']),
    checked: $p.get('fontvariant') === ld(['param_values', 'fontvariant', 'small-caps'])
  }], ld(['param_values', 'fontvariant', 'small-caps']), jamilih.nbsp]]]], ['br'], ['label', [// Todo: i18n and allow for normal/bold pulldown and float input?
  ld('font_weight'), ' (normal, bold, 100-900, etc.):', nbsp2, ['input', {
    name: il('fontweight'),
    type: 'text',
    value: $p.has('fontweight') ? $p.get('fontweight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [ld('font_size'), ' (14pt, 14px, small, 75%, etc.):', nbsp2, ['input', {
    name: il('fontsize'),
    type: 'text',
    value: $p.get('fontsize'),
    size: '7',
    maxlength: '12'
  }]]], ['br'], // Todo: i18nize title and values?
  // Todo: remove hard-coded direction if i18nizing
  ['label', {
    dir: 'ltr'
  }, [ld('font_stretch'), jamilih.nbsp, ['select', {
    name: il('fontstretch')
  }, ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded'].map(stretch => {
    const atts = {
      value: ld(['param_values', 'font-stretch', stretch])
    };

    if ($p.get('fontstretch') === stretch || !$p.has('fontstretch') && stretch === 'normal') {
      atts.selected = 'selected';
    }

    return ['option', atts, [ld(['param_values', 'font-stretch', stretch])]];
  })]]],
  /**/
  ['br'], ['br'], ['label', [ld('letter_spacing'), ' (normal, .9em, -.05cm): ', ['input', {
    name: il('letterspacing'),
    type: 'text',
    value: $p.has('letterspacing') ? $p.get('letterspacing') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['label', [ld('line_height'), ' (normal, 1.5, 22px, 150%): ', ['input', {
    name: il('lineheight'),
    type: 'text',
    value: $p.has('lineheight') ? $p.get('lineheight') : 'normal',
    size: '7',
    maxlength: '12'
  }]]], ['br'], ['br'], le('tableformatting_tips', 'h3', 'title', {}, [ld('tableformatting')]), ['div', [ld('header_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('header'),
    type: 'radio',
    value: val,
    checked: $p.get('header') === val || !$p.has('header') && i === 1
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['div', [ld('footer_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('footer'),
    type: 'radio',
    value: val,
    checked: $p.get('footer') === val || !$p.has('footer') && i === 2
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['label', [['input', {
    name: il('headerfooterfixed'),
    type: 'checkbox',
    value: l('yes'),
    checked: $p.get('headerfooterfixed') === l('yes')
  }], nbsp2, ld('headerfooterfixed-wishtoscroll')]], ['br'], ['div', [ld('caption_wstyles'), nbsp2, ...[['yes', ld(['param_values', 'y'])], ['no', ld(['param_values', 'n'])], ['none', ld(['param_values', '0'])]].map(([key, val], i, arr) => ['label', [['input', {
    name: il('caption'),
    type: 'radio',
    value: val,
    checked: $p.get('caption') === val || !$p.has('caption') && i === 2
  }], ld(key), i === arr.length - 1 ? '' : nbsp3]])]], ['br'], ['div', [ld('table_wborder'), nbsp2, ['label', [['input', {
    name: il('border'),
    type: 'radio',
    value: '1',
    checked: $p.get('border') !== '0'
  }], ld('yes'), nbsp3]], ['label', [['input', {
    name: il('border'),
    type: 'radio',
    value: '0',
    checked: $p.get('border') === '0'
  }], ld('no')]]]], ['div', [ld('interlin_repeat_field_names'), nbsp2, ['label', [['input', {
    name: il('interlintitle'),
    type: 'radio',
    value: '1',
    checked: $p.get('interlintitle') !== '0'
  }], ld('yes'), nbsp3]], ['label', [['input', {
    name: il('interlintitle'),
    type: 'radio',
    value: '0',
    checked: $p.get('interlintitle') === '0'
  }], ld('no')]]]], ['label', [ld('interlintitle_css'), nbsp2, ['input', {
    name: il('interlintitle_css'),
    type: 'text',
    value: $p.get('interlintitle_css') || '',
    size: '12'
  }]]], ['br'],
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
  ['br'], le('pageformatting_tips', 'h3', 'title', {}, [ld('pageformatting')]),
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
  ['label', [ld('page_css'), nbsp2, ['textarea', {
    name: il('pagecss'),
    title: l('page_css_tips'),
    value: $p.get('pagecss')
  }]]], ['br'], le('outputmode_tips', 'label', 'title', {}, [ld('outputmode'), nbsp2, // Todo: Could i18nize, but would need smaller values
  ['select', {
    name: il('outputmode')
  }, ['table', 'div' // , 'json-array',
  // 'json-object'
  ].map(mode => {
    const atts = {
      value: mode
    };

    if ($p.get('outputmode') === mode) {
      atts.selected = 'selected';
    }

    return lo(['param_values', 'outputmode', mode], atts);
  })]])]],

  addRandomFormFields({
    il,
    ld,
    l,
    le,
    $p,
    serializeParamsAsURL,
    content
  }) {
    const addRowContent = rowContent => {
      if (!rowContent || !rowContent.length) {
        return;
      }

      content.push(['tr', rowContent]);
    };

    [[['td', {
      colspan: 12,
      align: 'center'
    }, [['br'], ld('or'), ['br'], ['br']]]], [['td', {
      colspan: 12,
      align: 'center'
    }, [// Todo: Could allow random with fixed starting and/or ending range
    ['label', [ld('rnd'), nbsp3, ['input', {
      id: 'rand',
      name: il('rand'),
      type: 'checkbox',
      value: l('yes'),
      checked: $p.get('rand') === l('yes')
    }]]], nbsp3, ['label', [ld('verses-context'), jamilih.nbsp, ['input', {
      name: il('context'),
      type: 'number',
      min: 1,
      size: 4,
      value: $p.get('context')
    }]]], nbsp3, le('view-random-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURL(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
            type: 'randomResult'
          }));
          jamilih.$('#randomURL').value = url;
        }

      }
    }), ['input', {
      id: 'randomURL',
      type: 'text'
    }]]]]].forEach(addRowContent);
  },

  getPreferences: ({
    languageParam,
    lf,
    paramsSetter,
    replaceHash,
    getFieldAliasOrNames,
    work,
    langs,
    imfl,
    l,
    localizeParamNames,
    namespace,
    hideFormattingSection,
    groups
  }) => ['div', {
    style: {
      textAlign: 'left'
    },
    id: 'preferences',
    hidden: 'true'
  }, [['div', {
    style: 'margin-top: 10px;'
  }, [['label', [l('localizeParamNames'), ['input', {
    id: 'localizeParamNames',
    type: 'checkbox',
    checked: localizeParamNames,
    $on: {
      change({
        target: {
          checked
        }
      }) {
        localStorage.setItem(namespace + '-localizeParamNames', checked);
      }

    }
  }]]]]], ['div', [['label', [l('Hide formatting section'), ['input', {
    id: 'hideFormattingSection',
    type: 'checkbox',
    checked: hideFormattingSection,
    $on: {
      change({
        target: {
          checked
        }
      }) {
        jamilih.$('#advancedformatting').style.display = checked ? 'none' : 'block';
        localStorage.setItem(namespace + '-hideFormattingSection', checked);
      }

    }
  }]]]]], ['div', [['label', {
    for: 'prefLangs'
  }, [l('Preferred language(s)')]], ['br'], ['select', {
    id: 'prefLangs',
    multiple: 'multiple',
    size: langs.length,
    $on: {
      change({
        target: {
          selectedOptions
        }
      }) {
        // Todo: EU disclaimer re: storage?
        localStorage.setItem(namespace + '-langCodes', JSON.stringify([...selectedOptions].map(opt => opt.value)));
      }

    }
  }, langs.map(lan => {
    let langCodes = localStorage.getItem(namespace + '-langCodes');
    langCodes = langCodes && JSON.parse(langCodes);
    const atts = {
      value: lan.code
    };

    if (langCodes && langCodes.includes(lan.code)) {
      atts.selected = 'selected';
    }

    return ['option', atts, [imfl(['languages', lan.code])]];
  })]]], ['div', [['button', {
    title: l('bookmark_generation_tooltip'),
    $on: {
      async click() {
        // Todo: Give option to edit (keywords and work URLs)
        const date = Date.now();
        const ADD_DATE = date;
        const LAST_MODIFIED = date;
        const blob = new Blob([new XMLSerializer().serializeToString(jamilih.jml({
          $document: {
            $DOCTYPE: {
              name: 'NETSCAPE-Bookmark-file-1'
            },
            title: l('Bookmarks'),
            body: [['h1', [l('Bookmarks_Menu')]], ...(await getFieldAliasOrNames()).flatMap(({
              groupName,
              worksToFields
            }) => {
              return [['dt', [['h3', {
                ADD_DATE,
                LAST_MODIFIED
              }, [groupName]]]], ['dl', [['p'], ...worksToFields.map(({
                fieldAliasOrNames,
                workName,
                shortcut: SHORTCUTURL
              }) => {
                // Todo (low): Add anchor, etc. (until handled by `work-startEnd`); &aqdas-anchor1-1=2&anchorfield1=Paragraph
                // Todo: option for additional browse field groups (startEnd2, etc.)
                // Todo: For link text, use `heading` or `alias` from metadata files in place of workName (requires loading all metadata files though)
                // Todo: Make Chrome NativeExt add-on to manipulate its search engines (to read a bookmarks file from Firefox properly, i.e., including keywords) https://www.makeuseof.com/answers/export-google-chrome-search-engines-address-bar/
                const paramsCopy = paramsSetter(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
                  fieldAliasOrNames,
                  workName: work,
                  // Delete work of current page
                  type: 'shortcutResult'
                }));
                const url = replaceHash(paramsCopy) + `&work=${workName}&${workName}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here

                return ['dt', [['a', {
                  href: url,
                  ADD_DATE,
                  LAST_MODIFIED,
                  SHORTCUTURL
                }, [workName]]]];
              })]]];
            })]
          }
        })).replace( // Chrome has a quirk that requires this (and not
        //   just any whitespace)
        // We're not getting the keywords with Chrome,
        //   but at least usable for bookmarks (though
        //   not the groups apparently)
        /<dt>/g, '\n<dt>')], {
          type: 'text/html'
        });
        const url = window.URL.createObjectURL(blob);
        const a = jamilih.jml('a', {
          hidden: true,
          download: 'bookmarks.html',
          href: url
        }, jamilih.$('#main'));
        a.click();
        URL.revokeObjectURL(url);
      }

    }
  }, [l('Generate_bookmarks')]]]]]],

  addBrowseFields({
    browseFields,
    fieldInfo,
    ld,
    i,
    iil,
    $p,
    content
  }) {
    const work = $p.get('work');

    const addRowContent = rowContent => {
      if (!rowContent || !rowContent.length) {
        return;
      }

      content.push(['tr', rowContent]);
    };

    [// Todo: Separate formatting to CSS
    i > 0 ? [['td', {
      colspan: 12,
      align: 'center'
    }, [['br'], ld('or'), ['br'], ['br']]]] : '', [...(() => {
      const addBrowseFieldSet = setType => browseFields.reduce((rowContent, {
        fieldName,
        aliases,
        fieldSchema: {
          minimum,
          maximum
        }
      }, j) => {
        // Namespace by work for sake of browser auto-complete caching
        const name = work + '-' + iil(setType) + (i + 1) + '-' + (j + 1);
        const id = name;
        rowContent['#'].push(['td', [['label', {
          for: name
        }, [fieldName]]]], ['td', [aliases ? ['datalist', {
          id: 'dl-' + id
        }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
          name,
          id,
          class: 'browseField',
          list: 'dl-' + id,
          value: $p.get(name, true),
          $on: setType === 'start' ? {
            change(e) {
              jamilih.$$('input.browseField').forEach(bf => {
                if (bf.id.includes(i + 1 + '-' + (j + 1))) {
                  bf.value = e.target.value;
                }
              });
            }

          } : undefined
        }] : ['input', {
          name,
          id,
          type: 'number',
          min: minimum,
          max: maximum,
          value: $p.get(name, true)
        }], nbsp3]]);
        return rowContent;
      }, {
        '#': []
      });

      return [addBrowseFieldSet('start'), ['td', [['b', [ld('to')]], nbsp3]], addBrowseFieldSet('end')];
    })(), ['td', [browseFields.length > 1 ? ld('versesendingdataoptional') : '']]], [['td', {
      colspan: 4 * browseFields.length + 2 + 1,
      align: 'center'
    }, [['table', [['tr', [browseFields.reduce((rowContent, {
      fieldName,
      aliases,
      fieldSchema: {
        minimum,
        maximum
      }
    }, j) => {
      // Namespace by work for sake of browser auto-complete caching
      const name = work + '-' + iil('anchor') + (i + 1) + '-' + (j + 1);
      const id = name;
      rowContent['#'].push(['td', [['label', {
        for: name
      }, [fieldName]]]], ['td', [aliases ? ['datalist', {
        id: 'dl-' + id
      }, aliases.map(alias => ['option', [alias]])] : '', aliases ? ['input', {
        name,
        id,
        class: 'browseField',
        list: 'dl-' + id,
        value: $p.get(name, true)
      }] : ['input', {
        name,
        id,
        type: 'number',
        min: minimum,
        max: maximum,
        value: $p.get(name, true)
      }], nbsp2]]);
      return rowContent;
    }, {
      '#': [['td', {
        style: 'font-weight: bold; vertical-align: bottom;'
      }, [ld('anchored-at') + nbsp3]]]
    }), ['td', [['label', [ld('field') + nbsp2, ['select', {
      name: iil('anchorfield') + (i + 1),
      size: '1'
    }, fieldInfo.map(({
      fieldAliasOrName
    }) => {
      const val = $p.get(iil('anchorfield') + (i + 1), true);

      if (val === fieldAliasOrName) {
        return ['option', {
          selected: true
        }, [fieldAliasOrName]];
      }

      return ['option', [fieldAliasOrName]];
    })]]]]]]]]]]]]].forEach(addRowContent);
  },

  main({
    lf,
    languageParam,
    l,
    namespace,
    heading,
    fallbackDirection,
    imfl,
    langs,
    fieldInfo,
    localizeParamNames,
    serializeParamsAsURL,
    paramsSetter,
    replaceHash,
    getFieldAliasOrNames,
    hideFormattingSection,
    $p,
    metadataObj,
    il,
    le,
    ld,
    iil,
    fieldMatchesLocale,
    preferredLocale,
    schemaItems,
    content,
    groups
  }) {
    const work = $p.get('work');

    const serializeParamsAsURLWithData = ({
      type
    }) => {
      return serializeParamsAsURL(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
        type
      }));
    };

    const lo = (key, atts) => ['option', atts, [l({
      key,

      fallback({
        message
      }) {
        atts.dir = fallbackDirection;
        return message;
      }

    })]]; // Returns element with localized or fallback attribute value (as Jamilih);
    //   also adds direction


    jamilih.jml('div', {
      class: 'focus'
    }, [['div', {
      style: 'float: left;'
    }, [['button', {
      $on: {
        click() {
          const prefs = jamilih.$('#preferences');
          prefs.hidden = !prefs.hidden;
        }

      }
    }, [l('Preferences')]], Templates.workDisplay.getPreferences({
      languageParam,
      lf,
      paramsSetter,
      replaceHash,
      getFieldAliasOrNames,
      work,
      langs,
      imfl,
      l,
      localizeParamNames,
      namespace,
      groups,
      hideFormattingSection
    })]], ['h2', [heading]], ['br'], ['form', {
      id: 'browse',
      $custom: {
        $submit() {
          const thisParams = serializeParamsAsURLWithData({
            type: 'saveSettings'
          }).replace(/^[^#]*#/, ''); // Don't change the visible URL

          console.log('history thisParams', thisParams);
          history.replaceState(thisParams, document.title, location.href);
          const newURL = serializeParamsAsURLWithData({
            type: 'result'
          });
          location.href = newURL;
        }

      },
      $on: {
        keydown({
          key,
          target
        }) {
          // Chrome is not having submit event triggered now with enter key
          //   presses on inputs, despite having a `type=submit` input in the
          //   form, and despite not using `preventDefault`
          if (key === 'Enter' && target.localName.toLowerCase() !== 'textarea') {
            this.$submit();
          }
        },

        submit(e) {
          e.preventDefault();
          this.$submit();
        }

      },
      name: il('browse')
    }, [['table', {
      align: 'center'
    }, content], ['br'], ['div', {
      style: 'margin-left: 20px'
    }, [['br'], ['br'], ['table', {
      border: '1',
      align: 'center',
      cellpadding: '5'
    }, [['tr', {
      valign: 'top'
    }, [['td', [Templates.workDisplay.columnsTable({
      ld,
      fieldInfo,
      $p,
      le,
      iil,
      l,
      metadataObj,
      preferredLocale,
      schemaItems,
      fieldMatchesLocale
    }), le('save-settings-URL', 'input', 'value', {
      type: 'button',
      $on: {
        click() {
          const url = serializeParamsAsURLWithData({
            type: 'saveSettings'
          });
          jamilih.$('#settings-URL').value = url;
        }

      }
    }), ['input', {
      id: 'settings-URL'
    }], ['br'], ['button', {
      $on: {
        async click(e) {
          e.preventDefault();
          const paramsCopy = paramsSetter(_objectSpread2(_objectSpread2({}, getDataForSerializingParamsAsURL()), {}, {
            workName: work,
            // Delete work of current page
            type: 'startEndResult'
          }));
          const url = replaceHash(paramsCopy) + `&work=${work}&${work}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here

          try {
            await navigator.clipboard.writeText(url);
          } catch (err) {// User rejected
          }
        }

      }
    }, [l('Copy_shortcut_URL')]]]], Templates.workDisplay.advancedFormatting({
      ld,
      il,
      l,
      lo,
      le,
      $p,
      hideFormattingSection
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
    ]]]]]], ['p', {
      align: 'center'
    }, [le('submitgo', 'input', 'value', {
      type: 'submit'
    })]]]]], jamilih.$('#main'));
  }

};

var resultsDisplayServerOrClient = {
  caption({
    heading,
    ranges
  }) {
    return heading + ' ' + ranges;
  },

  startSeparator({
    l
  }) {
    return l('colon');
  },

  innerBrowseFieldSeparator({
    l
  }) {
    return l('comma-space');
  },

  ranges({
    l,
    startRange,
    endVals,
    rangeNames
  }) {
    return startRange + // l('to').toLowerCase() + ' ' +
    '-' + endVals.join(Templates.resultsDisplayServerOrClient.startSeparator({
      l
    })) + ' (' + rangeNames + ')';
  },

  fieldValueAlias({
    key,
    value
  }) {
    return value + ' (' + key + ')';
  },

  interlinearSegment({
    lang,
    dir,
    html
  }) {
    return `<span${lang ? ` lang="${lang}"` : ''}${dir ? ` dir="${dir}"` : ''}>${html}</span>`;
  },

  interlinearTitle({
    l,
    val
  }) {
    const colonSpace = l('colon-space');
    return `<span class="interlintitle">${val}</span>${colonSpace}`;
  },

  styles({
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    escapeQuotedCSS,
    escapeCSS,
    tableWithFixedHeaderAndFooter,
    checkedFieldIndexes,
    hasCaption
  }) {
    const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#' ? $pRawEsc('colorName') : $pEscArbitrary('color');
    const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#' ? $pRawEsc('bgcolorName') : $pEscArbitrary('bgcolor');
    const tableHeight = '100%';
    const topToCaptionStart = 1;
    const captionSizeDelta = (hasCaption ? 2 : 0) + 0;
    const topToHeadingsStart = topToCaptionStart + captionSizeDelta;
    const headingsDelta = 1;
    const topToBodyStart = topToHeadingsStart + headingsDelta + 'em';
    const footerHeight = '2em';
    const bodyToFooterPadding = '0.5em';
    const topToBodyEnd = `100% - ${topToBodyStart} - ${footerHeight} - ${bodyToFooterPadding}`;
    const topToBodyEndCalc = `calc(${topToBodyEnd})`;
    const topToFooter = `calc(${topToBodyEnd} + ${bodyToFooterPadding})`;
    return ['style', [(tableWithFixedHeaderAndFooter ? `
html, body, #main, #main > div {
    height: 100%; /* Needed to ensure descendent heights retain 100%; could be avoided if didn't want percent on table height */
    overflow-y: hidden; /* Not sure why we're getting extra here, but... */
}
.anchor-table-header {
    background-color: ${bgcolorEsc || 'white'}; /* Header background (not just for div text inside header, but for whole header area) */
    overflow-x: hidden; /* Not sure why we're getting extra here, but... */
    position: relative; /* Ensures we are still flowing, but provides anchor for absolutely positioned thead below (absolute positioning positions relative to nearest non-static ancestor; clear demo at https://www.w3schools.com/cssref/playit.asp?filename=playcss_position&preval=fixed ) */
    padding-top: ${topToBodyStart}; /* Provides space for the header (and caption) (the one that is absolutely positioned below relative to here) */
    height: ${tableHeight}; /* Percent of the whole screen taken by the table */
}
.anchor-table-body {
    overflow-y: auto; /* Provides scrollbars when text fills up beyond the height */
    height: ${topToBodyEndCalc}; /* If < 100%, the header anchor background color will seep below table */
}

.caption, .thead .th, .tfoot .th {
    line-height: 0; /* th div will have own line-height; reducing here avoids fattening it by an inner div */
    color: transparent; /* Hides the non-div duplicated header text */
    white-space: nowrap; /* Ensures column header text uses up full width without overlap (esp. wrap no longer seems to work); this must be applied outside of the div */
    border: none; /* We don't want a border for this invisible section */
}
div.inner-caption, .thead .th div.th-inner, .tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    position: absolute; /* Puts relative to nearest non-static ancestor (our relative header anchor) */
    color: initial; /* Header must have an explicit color or it will get transparent container color */
    line-height: normal; /* Revert ancestor line height of 0 */
}
.thead .th div.th-inner {
    top: ${topToHeadingsStart}em; /* Ensures our header stays fixed at top outside of normal flow of table */
}
div.inner-caption {
    top: ${topToCaptionStart}em;
}
.tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    top: ${topToFooter}; /* Ensures our header stays fixed at top outside of normal flow of table */
}
.zupa div.zupa1 {
    margin: 0 auto !important;
    width: 0 !important;
}
.zupa div.th-inner, .zupa div.inner-caption {
    width: 100%;
    margin-left: -50%;
    text-align: center;
}
` : '') + ($pRaw('caption') === 'y' ? tableWithFixedHeaderAndFooter ? '.caption div.inner-caption, ' : '.caption, ' : '') + ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.thead .th, .thead .th div.th-inner, ` // Problems at least in Chrome
    : `.thead .th, ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `` // `.tfoot .th, .tfoot .th div.th-inner, ` // Problems at least in Chrome
    : `.tfoot .th, ` : '') + '.tbody td' + ` {
    vertical-align: top;
    font-style: ${$pRawEsc('fontstyle')};
    font-variant: ${$pRawEsc('fontvariant')};
    font-weight: ${$pEscArbitrary('fontweight')};
    ${$pEscArbitrary('fontsize') ? `font-size: ${$pEscArbitrary('fontsize')};` : ''}
    font-family: ${$pEscArbitrary('fontSeq')};

    font-stretch: ${$pRawEsc('fontstretch')};
    letter-spacing: ${$pEscArbitrary('letterspacing')};
    line-height: ${$pEscArbitrary('lineheight')};
    ${colorEsc ? `color: ${escapeCSS(colorEsc)};` : ''}
    ${bgcolorEsc ? `background-color: ${escapeCSS(bgcolorEsc)};` : ''}
}
${escapeCSS($pEscArbitrary('pagecss') || '')}
` + checkedFieldIndexes.map((idx, i) => ($pRaw('header') === 'y' ? tableWithFixedHeaderAndFooter ? `.thead .th:nth-child(${i + 1}) div.th-inner, ` : `.thead .th:nth-child(${i + 1}), ` : '') + ($pRaw('footer') === 'y' ? tableWithFixedHeaderAndFooter ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, ` : `.tfoot .th:nth-child(${i + 1}), ` : '') + `.tbody td:nth-child(${i + 1}) ` + `{
    ${$pEscArbitrary('css' + (idx + 1))}
}
`).join('') + ($pEscArbitrary('interlintitle_css') ? `
/* http://salzerdesign.com/test/fixedTable.html */
.interlintitle {
    ${escapeCSS($pEscArbitrary('interlintitle_css'))}
}
` : '') + (bgcolorEsc ? `
body {
    background-color: ${bgcolorEsc};
}
` : '')]];
  },

  main({
    tableData,
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    // Todo: escaping should be done in business logic!
    escapeQuotedCSS,
    escapeCSS,
    escapeHTML,
    l,
    localizedFieldNames,
    fieldLangs,
    fieldDirs,
    caption,
    hasCaption,
    showInterlinTitles,
    determineEnd,
    getCanonicalID,
    canonicalBrowseFieldSetName,
    getCellValue,
    checkedAndInterlinearFieldInfo,
    interlinearSeparator = '<br /><br />'
  }) {
    const tableOptions = {
      table: [['table', {
        class: 'table',
        border: $pRaw('border') || '0'
      }], ['tr', {
        class: 'tr'
      }], ['td'], // , {class: 'td'} // Too much data to add class to each
      ['th', {
        class: 'th'
      }], ['caption', {
        class: 'caption'
      }], ['thead', {
        class: 'thead'
      }], ['tbody', {
        class: 'tbody'
      }], ['tfoot', {
        class: 'tfoot'
      }] // ['colgroup', {class: 'colgroup'}],
      // ['col', {class: 'col'}]
      ],
      div: [['div', {
        class: 'table',
        style: 'display: table;'
      }], ['div', {
        class: 'tr',
        style: 'display: table-row;'
      }], ['div', {
        class: 'td',
        style: 'display: table-cell;'
      }], ['div', {
        class: 'th',
        style: 'display: table-cell;'
      }], ['div', {
        class: 'caption',
        style: 'display: table-caption;'
      }], ['div', {
        class: 'thead',
        style: 'display: table-header-group;'
      }], ['div', {
        class: 'tbody',
        style: 'display: table-row-group;'
      }], ['div', {
        class: 'tfoot',
        style: 'display: table-footer-group;'
      }] // ['div', {class: 'colgroup', style: 'display: table-column-group;'}],
      // ['div', {class: 'col', style: 'display: table-column;'}]
      ],
      'json-array': 'json',
      'json-object': 'json'
    };
    const outputmode = $p.get('outputmode', true); // Why not $pRaw?

    const tableElems = tableOptions[Object.keys(tableOptions).includes(outputmode) // Exclude __proto__ or whatever
    ? outputmode : 'table' // Default
    ];

    if (tableElems === 'json') {
      throw new Error('JSON support is currently not available');
    }

    const [tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem] = tableElems; // colgroupElem, colElem

    const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] = checkedAndInterlinearFieldInfo;
    const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';

    const tableWrap = children => {
      return tableWithFixedHeaderAndFooter ? ['div', {
        class: 'table-responsive anchor-table-header zupa'
      }, [['div', {
        class: 'table-responsive anchor-table-body'
      }, children]]] : ['div', {
        class: 'table-responsive'
      }, children];
    };

    const addChildren = (el, children) => {
      el = JSON.parse(JSON.stringify(el));
      el.push(children);
      return el;
    };

    const addAtts = ([el, atts], newAtts) => [el, _objectSpread2(_objectSpread2({}, atts), newAtts)];

    const foundState = {
      start: false,
      end: false
    };
    const outArr = [];
    const {
      showEmptyInterlinear,
      showTitleOnSingleInterlinear
    } = this;

    const checkEmpty = (tdVal, htmlEscaped) => {
      if (!showEmptyInterlinear) {
        if (!htmlEscaped) {
          tdVal = new DOMParser().parseFromString(tdVal, 'text/html').body;
          [...tdVal.querySelectorAll('br')].forEach(br => {
            br.remove();
          });
          tdVal = tdVal.innerHTML;
        }

        if (!tdVal.trim()) {
          return true;
        }
      }
    };

    tableData.some((tr, i) => {
      const rowID = determineEnd({
        tr,
        foundState
      });

      if (typeof rowID === 'boolean') {
        return rowID;
      }

      const canonicalID = getCanonicalID({
        tr
      });
      outArr.push(addChildren(addAtts(trElem, {
        dataset: {
          row: rowID,
          'canonical-type': canonicalBrowseFieldSetName,
          'canonical-id': canonicalID
        }
      }), checkedFieldIndexes.map((idx, j) => {
        const interlinearColIndexes = allInterlinearColIndexes[j];
        const showInterlins = interlinearColIndexes;
        const {
          tdVal,
          htmlEscaped
        } = getCellValue({
          tr,
          idx
        });
        const interlins = showInterlins && interlinearColIndexes.map(idx => {
          // Need to get a new one
          const {
            tdVal,
            htmlEscaped
          } = getCellValue({
            tr,
            idx
          });
          console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
          const isEmpty = checkEmpty(tdVal, htmlEscaped);

          if (isEmpty) {
            return '';
          }

          return showInterlins ? Templates.resultsDisplayServerOrClient.interlinearSegment({
            lang: fieldLangs[idx],
            dir: fieldDirs[idx],
            html: (showInterlinTitles ? Templates.resultsDisplayServerOrClient.interlinearTitle({
              l,
              val: localizedFieldNames[idx]
            }) : '') + tdVal
          }) : tdVal;
        }).filter(cell => cell !== '');
        return addAtts(tdElem, {
          // We could remove these (and add to <col>) for optimizing delivery,
          //    but non-table output couldn't use unless on a hidden element
          // Can't have unique IDs if user duplicates a column
          id: 'row' + (i + 1) + 'col' + (j + 1),
          lang: fieldLangs[idx],
          dir: fieldDirs[idx],
          dataset: {
            col: localizedFieldNames[idx]
          },
          innerHTML: (showInterlins && !checkEmpty(tdVal, htmlEscaped) && (showTitleOnSingleInterlinear || interlins.length) ? Templates.resultsDisplayServerOrClient.interlinearSegment({
            lang: fieldLangs[idx],
            html: (showInterlinTitles ? Templates.resultsDisplayServerOrClient.interlinearTitle({
              l,
              val: localizedFieldNames[idx]
            }) : '') + tdVal
          }) : tdVal) + (interlinearColIndexes && interlins.length ? interlinearSeparator + interlins.join(interlinearSeparator) : '')
        });
      })));
      return false;
    });
    return ['div', [Templates.resultsDisplayServerOrClient.styles({
      $p,
      $pRaw,
      $pRawEsc,
      $pEscArbitrary,
      escapeQuotedCSS,
      escapeCSS,
      tableWithFixedHeaderAndFooter,
      checkedFieldIndexes,
      hasCaption
    }), tableWrap([addChildren(tableElem, [caption ? addChildren(captionElem, [caption, tableWithFixedHeaderAndFooter ? ['div', {
      class: 'zupa1'
    }, [['div', {
      class: 'inner-caption'
    }, [['span', [caption]]]]]] : '']) : '',
    /*
              // Works but quirky, e.g., `color` doesn't work (as also
              //  confirmed per https://quirksmode.org/css/css2/columns.html)
              addChildren(colgroupElem,
                  checkedFieldIndexes.map((idx, i) =>
                      addAtts(colElem, {style: $pRaw('css' + (idx + 1))})
                  )
              ),
              */
    $pRaw('header') !== '0' ? addChildren(theadElem, [addChildren(trElem, checkedFields.map((cf, i) => {
      const interlinearColIndexes = allInterlinearColIndexes[i];
      cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
      return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', {
        class: 'zupa1'
      }, [['div', {
        class: 'th-inner'
      }, [['span', [cf]]]]]] : '']);
    }))]) : '', $pRaw('footer') && $pRaw('footer') !== '0' ? addChildren(tfootElem, [addChildren(trElem, checkedFields.map((cf, i) => {
      const interlinearColIndexes = allInterlinearColIndexes[i];
      cf = escapeHTML(cf) + (interlinearColIndexes ? l('comma-space') + interlinearColIndexes.map(idx => localizedFieldNames[idx]).join(l('comma-space')) : '');
      return addChildren(thElem, [cf, tableWithFixedHeaderAndFooter ? ['div', {
        class: 'zupa1'
      }, [['div', {
        class: 'th-inner'
      }, [['span', [cf]]]]]] : '']);
    }))]) : '', addChildren(tbodyElem, outArr)])])]];
  }

};

const $ = sel => document.querySelector(sel);

const $e = (el, descendentsSel) => {
  el = typeof el === 'string' ? $(el) : el;
  return el.querySelector(descendentsSel);
};

const dialogPolyfill = {
  registerDialog() {}

};
const defaultLocale = 'en';
const localeStrings = {
  en: {
    submit: 'Submit',
    cancel: 'Cancel',
    ok: 'Ok'
  }
};

class Dialog {
  constructor({
    locale,
    localeObject
  } = {}) {
    this.setLocale({
      locale,
      localeObject
    });
  }

  setLocale({
    locale = {},
    localeObject = {}
  }) {
    this.localeStrings = _objectSpread2(_objectSpread2(_objectSpread2({}, localeStrings[defaultLocale]), localeStrings[locale]), localeObject);
  }

  makeDialog({
    atts = {},
    children = [],
    close,
    remove = true
  }) {
    if (close) {
      if (!atts.$on) {
        atts.$on = {};
      }

      if (!atts.$on.close) {
        atts.$on.close = close;
      }
    }

    const dialog = jamilih.jml('dialog', atts, children, jamilih.$('#main'));
    dialogPolyfill.registerDialog(dialog);
    dialog.showModal();

    if (remove) {
      dialog.addEventListener('close', () => {
        dialog.remove();
      });
    }

    return dialog;
  }

  makeSubmitDialog(_ref) {
    let {
      submit,
      // Don't pass this on to `args` if present
      submitClass = 'submit'
    } = _ref,
        args = _objectWithoutProperties(_ref, ["submit", "submitClass"]);

    const dialog = this.makeCancelDialog(args);
    $e(dialog, `button.${args.cancelClass || 'cancel'}`).before(jamilih.jml('button', {
      class: submitClass,
      $on: {
        click(e) {
          if (submit) {
            submit.call(this, {
              e,
              dialog
            });
          }
        }

      }
    }, [this.localeStrings.submit]), jamilih.nbsp.repeat(2));
    return dialog;
  }

  makeCancelDialog(_ref2) {
    let {
      submit,
      // Don't pass this on to `args` if present
      cancel,
      cancelClass = 'cancel',
      submitClass = 'submit'
    } = _ref2,
        args = _objectWithoutProperties(_ref2, ["submit", "cancel", "cancelClass", "submitClass"]);

    const dialog = this.makeDialog(args);
    jamilih.jml('div', {
      class: submitClass
    }, [['br'], ['br'], ['button', {
      class: cancelClass,
      $on: {
        click(e) {
          e.preventDefault();

          if (cancel) {
            if (cancel.call(this, {
              e,
              dialog
            }) === false) {
              return;
            }
          }

          dialog.close();
        }

      }
    }, [this.localeStrings.cancel]]], dialog);
    return dialog;
  }

  alert(message, ok) {
    message = typeof message === 'string' ? {
      message
    } : message;
    const {
      ok: includeOk = typeof ok === 'object' ? ok.ok !== false : ok !== false,
      message: msg,
      submitClass = 'submit'
    } = message;
    return new Promise((resolve, reject) => {
      const dialog = jamilih.jml('dialog', [msg, ...(includeOk ? [['br'], ['br'], ['div', {
        class: submitClass
      }, [['button', {
        $on: {
          click() {
            dialog.close();
            resolve();
          }

        }
      }, [this.localeStrings.ok]]]]] : [])], jamilih.$('#main'));
      dialogPolyfill.registerDialog(dialog);
      dialog.showModal();
    });
  }

  prompt(message) {
    message = typeof message === 'string' ? {
      message
    } : message;

    const {
      message: msg,
      submit: userSubmit
    } = message,
          submitArgs = _objectWithoutProperties(message, ["message", "submit"]);

    return new Promise((resolve, reject) => {
      const submit = function ({
        e,
        dialog
      }) {
        if (userSubmit) {
          userSubmit.call(this, {
            e,
            dialog
          });
        }

        dialog.close();
        resolve($e(dialog, 'input').value);
      };
      /* const dialog = */


      this.makeSubmitDialog(_objectSpread2(_objectSpread2({}, submitArgs), {}, {
        submit,

        cancel() {
          reject(new Error('cancelled'));
        },

        children: [['label', [msg, jamilih.nbsp.repeat(3), ['input']]]]
      }));
    });
  }

  confirm(message) {
    message = typeof message === 'string' ? {
      message
    } : message;
    const {
      message: msg,
      submitClass = 'submit'
    } = message;
    return new Promise((resolve, reject) => {
      const dialog = jamilih.jml('dialog', [msg, ['br'], ['br'], ['div', {
        class: submitClass
      }, [['button', {
        $on: {
          click() {
            dialog.close();
            resolve();
          }

        }
      }, [this.localeStrings.ok]], jamilih.nbsp.repeat(2), ['button', {
        $on: {
          click() {
            dialog.close();
            reject(new Error('cancelled'));
          }

        }
      }, [this.localeStrings.cancel]]]]], jamilih.$('#main'));
      dialogPolyfill.registerDialog(dialog);
      dialog.showModal();
    });
  }

}

const dialogs = new Dialog();

var resultsDisplayClient = {
  anchorRowCol({
    anchorRowCol
  }) {
    return jamilih.$('#' + anchorRowCol);
  },

  anchors({
    escapedRow,
    escapedCol
  }) {
    const sel = 'tr[data-row="' + escapedRow + '"]' + (escapedCol ? '> td[data-col="' + escapedCol + '"]' : '');
    return jamilih.$(sel);
  },

  main(...args) {
    let html;

    try {
      html = Templates.resultsDisplayServerOrClient.main(...args);
    } catch (err) {
      if (err.message === 'JSON support is currently not available') {
        dialogs.alert(err.message);
      }
    }

    jamilih.jml(...html, jamilih.$('#main'));
  }

};

/* eslint-env browser */
const Templates = {
  languageSelect,
  workSelect,
  workDisplay,
  resultsDisplayServerOrClient,
  resultsDisplayClient,

  defaultBody() {
    // We empty rather than `replaceWith` as our Jamilih `body`
    //   aliases expect the old instance
    while (jamilih.body.hasChildNodes()) {
      jamilih.body.firstChild.remove();
    }

    return jamilih.jml('div', {
      id: 'main',
      role: 'main'
    }, jamilih.body);
  }

};
Templates.permissions = {
  versionChange() {
    jamilih.$('#versionChange').showModal();
  },

  addLogEntry({
    text
  }) {
    const installationDialog = jamilih.$('#installationLogContainer');

    try {
      installationDialog.showModal();
      const container = jamilih.$('#dialogContainer');
      container.hidden = false;
    } catch (err) {// May already be open
    }

    jamilih.$('#installationLog').append(text + '\n');
  },

  exitDialogs() {
    const container = jamilih.$('#dialogContainer');

    if (container) {
      container.hidden = true;
    }
  },

  dbError({
    type,
    escapedErrorMessage
  }) {
    if (type) {
      jamilih.jml('span', [type, ' ', escapedErrorMessage], jamilih.$('#dbError'));
    }

    jamilih.$('#dbError').showModal();
  },

  errorRegistering(escapedErrorMessage) {
    if (escapedErrorMessage) {
      jamilih.jml('span', [escapedErrorMessage], jamilih.$('#errorRegistering'));
    }

    jamilih.$('#errorRegistering').showModal();
  },

  browserNotGrantingPersistence() {
    jamilih.$('#browserNotGrantingPersistence').showModal();
  },

  main({
    l,
    ok,
    refuse,
    close,
    closeBrowserNotGranting
  }) {
    const installationDialog = jamilih.jml('dialog', {
      style: 'text-align: center; height: 100%',
      id: 'installationLogContainer',
      class: 'focus'
    }, [['p', [l('wait-installing')]], ['div', {
      style: 'height: 80%; overflow: auto;'
    }, [['pre', {
      id: 'installationLog'
    }, []]]] // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
    ]);
    let requestPermissionsDialog = '';

    if (ok) {
      requestPermissionsDialog = jamilih.jml('dialog', {
        id: 'willRequestStoragePermissions',
        $on: {
          close
        }
      }, [['section', [l('will-request-storage-permissions')]], ['br'], ['div', {
        class: 'focus'
      }, [['button', {
        $on: {
          click: ok
        }
      }, [l('OK')]], ['br'], ['br'], ['button', {
        $on: {
          click: refuse
        }
      }, [l('refuse-request-storage-permissions')]]]]]);
    }

    const errorRegisteringNotice = jamilih.jml('dialog', {
      id: 'errorRegistering'
    }, [['section', [l('errorRegistering')]]]);
    let browserNotGrantingPersistenceAlert = '';

    if (closeBrowserNotGranting) {
      browserNotGrantingPersistenceAlert = jamilih.jml('dialog', {
        id: 'browserNotGrantingPersistence'
      }, [['section', [l('browser-not-granting-persistence')]], ['br'], ['div', {
        class: 'focus'
      }, [['button', {
        $on: {
          click: closeBrowserNotGranting
        }
      }, [l('OK')]]]]]);
    }

    const versionChangeNotice = jamilih.jml('dialog', {
      id: 'versionChange'
    }, [['section', [l('versionChange')]]]);
    const dbErrorNotice = jamilih.jml('dialog', {
      id: 'dbError'
    }, [['section', [l('dbError')]]]);
    jamilih.jml('div', {
      id: 'dialogContainer',
      style: 'height: 100%'
    }, [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice], jamilih.$('#main'));
    return [installationDialog, requestPermissionsDialog, browserNotGrantingPersistenceAlert, errorRegisteringNotice, versionChangeNotice, dbErrorNotice];
  }

};

const escapeHTML = s => {
  return !s ? '' : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/* eslint-env browser */
// Todo: remember this locales choice by cookie?
const getPreferredLanguages = ({
  namespace,
  preferredLocale
}) => {
  // Todo: Add to this optionally with one-off tag input box
  // Todo: Switch to fallbackLanguages so can default to
  //    navigator.languages?
  const langCodes = localStorage.getItem(namespace + '-langCodes');
  const lngs = langCodes && JSON.parse(langCodes) || [preferredLocale];
  const langArr = [];
  lngs.forEach(lng => {
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
class Languages {
  constructor({
    langData
  }) {
    this.langData = langData;
  }

  localeFromLangData(lan) {
    return this.langData['localization-strings'][lan];
  }

  getLanguageFromCode(code) {
    return this.localeFromLangData(code).languages[code];
  }

  getFieldNameFromPluginNameAndLocales({
    pluginName,
    locales,
    lf,
    targetLanguage,
    applicableFieldI18N,
    meta,
    metaApplicableField
  }) {
    return lf(['plugins', pluginName, 'fieldname'], _objectSpread2(_objectSpread2(_objectSpread2({}, meta), metaApplicableField), {}, {
      applicableField: applicableFieldI18N,
      targetLanguage: targetLanguage ? this.getLanguageFromCode(targetLanguage) : ''
    }));
  }

  getLanguageInfo({
    $p
  }) {
    const langs = this.langData.languages;

    const localePass = lcl => {
      return langs.some(({
        code
      }) => code === lcl) ? lcl : false;
    };

    const languageParam = $p.get('lang', true); // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice

    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length ? navLangs : [localePass(navigator.language) || 'en-US']; // We need a default to display a default title

    const language = languageParam || fallbackLanguages[0];
    const preferredLangs = language.split('.');
    const lang = preferredLangs.concat(fallbackLanguages);
    return {
      lang,
      langs,
      languageParam,
      fallbackLanguages
    };
  }

}

/* eslint-env browser */

const JsonRefs = require('json-refs'); // eslint-disable-line import/order


const getCurrDir = () => window.location.href.replace(/(index\.html)?#.*$/, '');

const getMetaProp = function getMetaProp(lang, metadataObj, properties, allowObjects) {
  let prop;
  properties = typeof properties === 'string' ? [properties] : properties;
  lang.some(lan => {
    const p = properties.slice(0);
    let strings = metadataObj['localization-strings'][lan];

    while (strings && p.length) {
      strings = strings[p.shift()];
    } // Todo: Fix this allowance for allowObjects (as it does not properly
    //        fallback if an object is returned from a language because
    //        that language is missing content and is only thus returning
    //        an object)


    prop = allowObjects || typeof strings === 'string' ? strings : undefined;
    return prop;
  });
  return prop;
}; // Use the following to dynamically add specific file schema in place of
//    generic table schema if validating against files.jsonschema
//  filesSchema.properties.groups.items.properties.files.items.properties.
//      file.anyOf.splice(1, 1, {$ref: schemaFile});
// Todo: Allow use of dbs and fileGroup together in base directories?

const getMetadata = async (file, property, basePath) => {
  return (await JsonRefs.resolveRefsAt((basePath || getCurrDir()) + file + (property ? '#/' + property : ''), {
    loaderOptions: {
      processContent(res, callback) {
        callback(undefined, JSON.parse(res.text || // `.metadata` not a recognized extension, so
        //    convert to string for JSON in Node
        res.body.toString()));
      }

    }
  })).resolved;
};
const getFieldNameAndValueAliases = function ({
  field,
  schemaItems,
  metadataObj,
  getFieldAliasOrName,
  lang
}) {
  const fieldSchemaIndex = schemaItems.findIndex(item => item.title === field);
  const fieldSchema = schemaItems[fieldSchemaIndex];
  const ret = {
    // field,
    fieldName: getFieldAliasOrName(field)
  };
  const fieldInfo = metadataObj.fields[field];
  let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];

  if (fieldValueAliasMap) {
    if (fieldValueAliasMap.localeKey) {
      fieldValueAliasMap = getMetaProp(lang, metadataObj, fieldValueAliasMap.localeKey.split('/'), true);
    }

    ret.rawFieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
    ret.aliases = []; // Todo: We could use `prefer_alias` but algorithm below may cover
    //    needed cases

    if (fieldSchema.enum && fieldSchema.enum.length) {
      fieldSchema.enum.forEach(enm => {
        ret.aliases.push(getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true));

        if (enm in fieldValueAliasMap && // Todo: We could allow numbers here too, but crowds
        //         pull-down
        typeof fieldValueAliasMap[enm] === 'string') {
          ret.aliases.push(...fieldValueAliasMap[enm]);
        }
      });
    } else {
      // Todo: We might iterate over all values (in case some not
      //         included in fv map)
      // Todo: Check `fieldSchema` for integer or string type
      Object.entries(fieldValueAliasMap).forEach(([key, aliases]) => {
        // We'll preserve the numbers since probably more useful if
        //   stored with data (as opposed to enums)
        if (!Array.isArray(aliases)) {
          aliases = Object.values(aliases);
        } // We'll assume the longest version is best for auto-complete


        ret.aliases.push(...aliases.filter(v => aliases.every(x => x === v || !x.toLowerCase().startsWith(v.toLowerCase()))).map(v => v + ' (' + key + ')') // Todo: i18nize
        );
      });
    }

    ret.fieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap)); // ret.aliases.sort();
  }

  ret.fieldSchema = fieldSchema;
  ret.fieldSchemaIndex = fieldSchemaIndex;
  ret.preferAlias = fieldInfo.prefer_alias;
  ret.lang = fieldInfo.lang;
  return ret;
};
const getBrowseFieldData = function ({
  metadataObj,
  schemaItems,
  getFieldAliasOrName,
  lang,
  callback
}) {
  metadataObj.table.browse_fields.forEach((browseFieldSetObject, i) => {
    if (typeof browseFieldSetObject === 'string') {
      browseFieldSetObject = {
        set: [browseFieldSetObject]
      };
    }

    if (!browseFieldSetObject.name) {
      browseFieldSetObject.name = browseFieldSetObject.set.join(',');
    }

    const setName = browseFieldSetObject.name;
    const fieldSets = browseFieldSetObject.set;
    const {
      presort
    } = browseFieldSetObject; // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
    //          as kind of fieldset

    const browseFields = fieldSets.map(field => getFieldNameAndValueAliases({
      lang,
      field,
      schemaItems,
      metadataObj,
      getFieldAliasOrName
    }));
    callback({
      setName,
      browseFields,
      i,
      presort
    }); // eslint-disable-line node/no-callback-literal
  });
}; // Todo: Incorporate other methods into this class

class Metadata {
  constructor({
    metadataObj
  }) {
    this.metadataObj = metadataObj;
  }

  getFieldLang(field) {
    const {
      metadataObj
    } = this;
    const fields = metadataObj && metadataObj.fields;
    return fields && fields[field] && fields[field].lang;
  }

  getFieldMatchesLocale({
    namespace,
    preferredLocale,
    schemaItems,
    pluginsForWork
  }) {
    const {
      metadataObj
    } = this;
    return field => {
      const preferredLanguages = getPreferredLanguages({
        namespace,
        preferredLocale
      });

      if (pluginsForWork.isPluginField({
        namespace,
        field
      })) {
        let [,, targetLanguage] = pluginsForWork.getPluginFieldParts({
          namespace,
          field
        });

        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }

        return !targetLanguage || preferredLanguages.includes(targetLanguage);
      }

      const metaLang = this.getFieldLang(field);
      const localeStrings = metadataObj && metadataObj['localization-strings']; // If this is a localized field (e.g., enum), we don't want
      //  to avoid as may be translated (should check though)

      const hasFieldValue = localeStrings && Object.keys(localeStrings).some(lng => {
        const fv = localeStrings[lng] && localeStrings[lng].fieldvalue;
        return fv && fv[field];
      });
      return hasFieldValue || metaLang && preferredLanguages.includes(metaLang) || schemaItems.some(item => item.title === field && item.type !== 'string');
    };
  }

}

const escapePluginComponent = pluginName => {
  return pluginName.replace(/\^/g, '^^') // Escape our escape
  .replace(/-/g, '^0');
};
const unescapePluginComponent = pluginName => {
  if (!pluginName) {
    return pluginName;
  }

  return pluginName.replace(/(\^+)0/g, (n0, esc) => {
    return esc.length % 2 ? esc.slice(1) + '-' : n0;
  }).replace(/\^\^/g, '^');
};
const escapePlugin = ({
  pluginName,
  applicableField,
  targetLanguage
}) => {
  return escapePluginComponent(pluginName) + (applicableField ? '-' + escapePluginComponent(applicableField) : '-') + (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};
class PluginsForWork {
  constructor({
    pluginsInWork,
    pluginFieldMappings,
    pluginObjects
  }) {
    this.pluginsInWork = pluginsInWork;
    this.pluginFieldMappings = pluginFieldMappings;
    this.pluginObjects = pluginObjects;
  }

  getPluginObject(pluginName) {
    const idx = this.pluginsInWork.findIndex(([name]) => {
      return name === pluginName;
    });
    const plugin = this.pluginObjects[idx];
    return plugin;
  }

  iterateMappings(cb) {
    this.pluginFieldMappings.forEach(({
      placement,

      /*
            {fieldXYZ: {
                targetLanguage: "en"|["en"], // E.g., translating from Persian to English
                onByDefault: true // Overrides plugin default
            }}
            */
      'applicable-fields': applicableFields
    }, i) => {
      const [pluginName, {
        onByDefault: onByDefaultDefault,
        lang: pluginLang,
        meta
      }] = this.pluginsInWork[i];
      const plugin = this.getPluginObject(pluginName);
      cb({
        // eslint-disable-line node/no-callback-literal
        plugin,
        placement,
        applicableFields,
        pluginName,
        pluginLang,
        onByDefaultDefault,
        meta
      });
    });
  }

  processTargetLanguages(applicableFields, cb) {
    if (!applicableFields) {
      return false;
    }

    Object.entries(applicableFields).forEach(([applicableField, {
      targetLanguage,
      onByDefault,
      meta: metaApplicableField
    }]) => {
      if (Array.isArray(targetLanguage)) {
        targetLanguage.forEach(targetLanguage => {
          cb({
            applicableField,
            targetLanguage,
            onByDefault,
            metaApplicableField
          }); // eslint-disable-line node/no-callback-literal
        });
      } else {
        // eslint-disable-next-line node/callback-return
        cb({
          applicableField,
          targetLanguage,
          onByDefault,
          metaApplicableField
        }); // eslint-disable-line node/no-callback-literal
      }
    });
    return true;
  }

  isPluginField({
    namespace,
    field
  }) {
    return field.startsWith(`${namespace}-plugin-`);
  }

  getPluginFieldParts({
    namespace,
    field
  }) {
    field = field.replace(`${namespace}-plugin-`, '');
    let pluginName, applicableField, targetLanguage;

    if (field.includes('-')) {
      [pluginName, applicableField, targetLanguage] = field.split('-');
    } else {
      pluginName = field;
    }

    return [pluginName, applicableField, targetLanguage].map(unescapePluginComponent);
  }

}

let path, babelRegister;

if (typeof process !== 'undefined') {
  /* eslint-disable node/global-require */
  path = require('path');
  babelRegister = require('@babel/register');
  /* eslint-enable node/global-require */
}
const getFilePaths = function getFilePaths(filesObj, fileGroup, fileData) {
  const baseDir = (filesObj.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
  const schemaBaseDir = (filesObj.schemaBaseDirectory || '') + (fileGroup.schemaBaseDirectory || '') + '/';
  const metadataBaseDir = (filesObj.metadataBaseDirectory || '') + (fileGroup.metadataBaseDirectory || '') + '/';
  const file = baseDir + fileData.file.$ref;
  const schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
  const metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';
  return {
    file,
    schemaFile,
    metadataFile
  };
};
const getWorkData = async function ({
  lang,
  fallbackLanguages,
  work,
  files,
  allowPlugins,
  basePath,
  languages,
  preferredLocale
}) {
  const filesObj = await simpleGetJson.getJSON(files);

  const localeFromFileData = lan => filesObj['localization-strings'][lan];

  const imfFile = IMF__default['default']({
    locales: lang.map(localeFromFileData),
    fallbackLocales: fallbackLanguages.map(localeFromFileData)
  });
  const lf = imfFile.getFormatter();
  let fileData;
  const fileGroup = filesObj.groups.find(fg => {
    fileData = fg.files.find(file => work === lf(['workNames', fg.id, file.name]));
    return Boolean(fileData);
  }); // This is not specific to the work, but we export it anyways

  const groupsToWorks = filesObj.groups.map(fg => {
    return {
      name: lf({
        key: fg.name.localeKey,
        fallback: true
      }),
      workNames: fg.files.map(file => {
        return lf(['workNames', fg.id, file.name]);
      }),
      shortcuts: fg.files.map(file => file.shortcut)
    };
  });
  const fp = getFilePaths(filesObj, fileGroup, fileData);
  const {
    file
  } = fp;
  let {
    schemaFile,
    metadataFile
  } = fp;
  let schemaProperty = '',
      metadataProperty = '';

  if (!schemaFile) {
    schemaFile = file;
    schemaProperty = 'schema';
  }

  if (!metadataFile) {
    metadataFile = file;
    metadataProperty = 'metadata';
  }

  let getPlugins,
      pluginsInWork,
      pluginFieldsForWork,
      pluginPaths,
      pluginFieldMappingForWork = [];

  if (allowPlugins) {
    const pluginFieldMapping = filesObj['plugin-field-mapping'];
    const pluginFieldMappingID = pluginFieldMapping[fileGroup.id];
    const possiblePluginFieldMappingForWork = pluginFieldMappingID[fileData.name];

    if (possiblePluginFieldMappingForWork) {
      pluginFieldsForWork = Object.keys(possiblePluginFieldMappingForWork);
      pluginsInWork = Object.entries(filesObj.plugins).filter(([p]) => {
        return pluginFieldsForWork.includes(p);
      });
      pluginFieldMappingForWork = pluginsInWork.map(([p]) => {
        return possiblePluginFieldMappingForWork[p];
      });
      pluginPaths = pluginsInWork.map(([, pluginObj]) => pluginObj.path);
      getPlugins = pluginsInWork;
    }
  }

  const metadataObj = await getMetadata(metadataFile, metadataProperty, basePath);

  const getFieldAliasOrName = function getFieldAliasOrName(field) {
    const fieldObj = metadataObj.fields && metadataObj.fields[field];
    let fieldName;
    let fieldAlias;

    if (fieldObj) {
      fieldAlias = fieldObj.alias;
    }

    if (fieldAlias) {
      if (typeof fieldAlias === 'string') {
        fieldName = fieldAlias;
      } else {
        fieldAlias = fieldAlias.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldAlias.split('/'));
      }
    } else {
      // No alias
      fieldName = fieldObj.name;

      if (typeof fieldName === 'object') {
        fieldName = fieldName.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldName.split('/'));
      }
    }

    return fieldName;
  };

  const pluginFieldMappings = pluginFieldMappingForWork;
  const [schemaObj, pluginObjects] = await Promise.all([getMetadata(schemaFile, schemaProperty, basePath), getPlugins ? Promise.all(pluginPaths.map(pluginPath => {
    if (typeof process !== 'undefined') {
      pluginPath = path.resolve(path.join(process.cwd(), 'node_modules/textbrowser/server', pluginPath));
      babelRegister({
        presets: ['@babel/env']
      });
      return Promise.resolve().then(() => {
        return require(pluginPath); // eslint-disable-line node/global-require, import/no-dynamic-require
      }).catch(err => {
        // E.g., with tooltips plugin
        console.log('err', err);
      });
    } // eslint-disable-next-line node/no-unsupported-features/es-syntax, no-unsanitized/method


    return Promise.resolve(`${pluginPath}`).then(s => _interopRequireWildcard(require(s)));
  })) : null]);
  const pluginsForWork = new PluginsForWork({
    pluginsInWork,
    pluginFieldMappings,
    pluginObjects
  });
  const schemaItems = schemaObj.items.items;
  const fieldInfo = schemaItems.map(({
    title: field
  }) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field
    };
  });
  const metadata = new Metadata({
    metadataObj
  });

  if (languages && // Avoid all this processing if this is not the specific call requiring
  pluginsForWork) {
    console.log('pluginsForWork', pluginsForWork);
    const {
      lang
    } = this; // array with first item as preferred

    pluginsForWork.iterateMappings(({
      plugin,
      pluginName,
      pluginLang,
      onByDefaultDefault,
      placement,
      applicableFields,
      meta
    }) => {
      const processField = ({
        applicableField,
        targetLanguage,
        onByDefault,
        metaApplicableField
      } = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(applicableField);

        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            applicableField,
            targetLanguage,
            // Default lang for plug-in (from files.json)
            pluginLang,
            // Default lang when no target language or
            //   plugin lang; using the lang of the applicable
            //   field
            applicableFieldLang
          });
        }

        const field = escapePlugin({
          pluginName,
          applicableField,
          targetLanguage: targetLanguage || pluginLang || applicableFieldLang
        });

        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }

        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName ? plugin.getFieldAliasOrName({
          locales: lang,
          lf,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          lf,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice( // Todo: Allow default placement overriding for
        //    non-plugins
        placement === 'end' ? Number.POSITIVE_INFINITY // push
        : placement, 0, {
          field: `${this.namespace}-plugin-${field}`,
          fieldAliasOrName,
          // Plug-in specific (todo: allow specifying
          //    for non-plugins)
          onByDefault: typeof onByDefault === 'boolean' ? onByDefault : onByDefaultDefault || false,
          // Three conventions for use by plug-ins but
          //     textbrowser only passes on (might
          //     not need here)
          applicableField,
          metaApplicableField,
          fieldLang: targetLanguage
        });
      };

      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }

  return {
    fileData,
    lf,
    getFieldAliasOrName,
    metadataObj,
    schemaObj,
    schemaItems,
    fieldInfo,
    pluginsForWork,
    groupsToWorks,
    metadata
  };
};

const JsonRefs$1 = require('json-refs');

const fieldValueAliasRegex = /^.* \((.*?)\)$/;

const getRawFieldValue = v => {
  return typeof v === 'string' ? v.replace(fieldValueAliasRegex, '$1') : v;
};
const resultsDisplayServer = async function resultsDisplayServer(args) {
  const {
    templateArgs
  } = await resultsDisplayServerOrClient$1.call(this, _objectSpread2({}, args)); // Todo: Should really reconcile this with client-side output options
  //         (as should also have option there to get JSON, Jamilih, etc.
  //         output)

  switch (args.serverOutput) {
    case 'jamilih':
      return Templates.resultsDisplayServerOrClient.main(templateArgs);

    case 'html':
      {
        const jamilih$1 = Templates.resultsDisplayServerOrClient.main(templateArgs);
        return jamilih.jml.toHTML(...jamilih$1);
      }

    case 'json':
    default:
      return templateArgs.tableData;
  }
};
const resultsDisplayServerOrClient$1 = async function resultsDisplayServerOrClient({
  l,
  lang,
  fallbackLanguages,
  imfLocales,
  $p,
  skipIndexedDB,
  noIndexedDB,
  prefI18n,
  files,
  allowPlugins,
  langData,
  basePath = '',
  dynamicBasePath = ''
}) {
  const languages = new Languages({
    langData
  });

  const getCellValue = ({
    fieldValueAliasMapPreferred,
    escapeColumnIndexes
  }) => ({
    tr,
    idx
  }) => {
    let tdVal = fieldValueAliasMapPreferred[idx] !== undefined ? fieldValueAliasMapPreferred[idx][tr[idx]] : tr[idx];

    if (tdVal && typeof tdVal === 'object') {
      tdVal = Object.values(tdVal);
    }

    if (Array.isArray(tdVal)) {
      tdVal = tdVal.join(l('comma-space'));
    }

    return (escapeColumnIndexes[idx] || !this.trustFormatHTML) && typeof tdVal === 'string' ? {
      tdVal: escapeHTML(tdVal),
      htmlEscaped: true
    } : {
      tdVal
    };
  };

  const getCanonicalID = ({
    fieldValueAliasMap,
    fieldValueAliasMapPreferred,
    localizedFieldNames,
    canonicalBrowseFieldNames
  }) => ({
    tr,
    foundState
  }) => {
    return canonicalBrowseFieldNames.map(fieldName => {
      const idx = localizedFieldNames.indexOf(fieldName); // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book); we may wish to
      //   switch this (and also for other browse field-based
      //   items).

      if (fieldValueAliasMap[idx] !== undefined) {
        return fieldValueAliasMapPreferred[idx][tr[idx]];
      }

      return tr[idx];
    }).join('-'); // rowID;
  };

  const determineEnd = ({
    fieldValueAliasMap,
    fieldValueAliasMapPreferred,
    localizedFieldNames,
    applicableBrowseFieldNames,
    startsRaw,
    endsRaw
  }) => ({
    tr,
    foundState
  }) => {
    const rowIDPartsPreferred = [];
    const rowIDParts = applicableBrowseFieldNames.map(fieldName => {
      const idx = localizedFieldNames.indexOf(fieldName); // This works to put alias in anchor but this includes
      //   our ending parenthetical, the alias may be harder
      //   to remember and/or automated than original (e.g.,
      //   for a number representing a book), and there could
      //   be multiple aliases for a value; we may wish to
      //   switch this (and also for other browse field-based
      //   items).

      if (fieldValueAliasMap[idx] !== undefined) {
        rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
      } else {
        rowIDPartsPreferred.push(tr[idx]);
      }

      return tr[idx];
    }); // Todo: Use schema to determine field type and use `Number.parseInt`
    //   on other value instead of `String` conversions

    if (!foundState.start) {
      if (startsRaw.some((part, i) => {
        const rowIDPart = rowIDParts[i];
        return part !== rowIDPart;
      })) {
        // Trigger skip of this row
        return false;
      }

      foundState.start = true;
    } // This doesn't go in an `else` for the above in case the start is the end


    if (endsRaw.every((part, i) => {
      const rowIDPart = rowIDParts[i];
      return part === rowIDPart;
    })) {
      foundState.end = true;
    } else if (foundState.end) {
      // If no longer matching, trigger end of the table
      return true;
    }

    return rowIDPartsPreferred.join('-'); // rowID;
  };

  const getCheckedAndInterlinearFieldInfo = ({
    localizedFieldNames
  }) => {
    let i = 1;
    let field, checked;
    let checkedFields = [];

    do {
      field = $p.get('field' + i, true);
      checked = $p.get('checked' + i, true);
      i++;

      if (field && (checked === l('yes') || checked === null // Default to "on"
      )) {
        checkedFields.push(field);
      }
    } while (field);

    checkedFields = checkedFields.filter(cf => localizedFieldNames.includes(cf));
    const checkedFieldIndexes = checkedFields.map(cf => localizedFieldNames.indexOf(cf));
    const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
      const interlin = $p.get('interlin' + (cfi + 1), true);
      return interlin && interlin.split(/\s*,\s*/).map(col => // Todo: Avoid this when known to be integer or if string, though allow
      //    string to be treated as number if config is set.
      Number.parseInt(col) - 1).filter(n => !Number.isNaN(n));
    });
    return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
  };

  const getCaption = ({
    starts,
    ends,
    applicableBrowseFieldNames,
    heading
  }) => {
    let caption;
    const hasCaption = $pRaw('caption') !== '0';

    if (hasCaption) {
      /*
            // Works but displays in parentheses browse fields which
            //  may be non-applicable
            const buildRangePoint = (startOrEnd) => escapeHTML(
                browseFieldSets.reduce((txt, bfs, i) =>
                    (txt ? txt + ' (' : '') + bfs.map((bf, j) =>
                        (j > 0 ? l('comma-space') : '') + bf + ' ' +
                            $pRaw(startOrEnd + (i + 1) + '-' + (j + 1))
                    ).join('') + (txt ? ')' : ''), '')
            );
            */

      /*
            // Works but overly long
            const buildRangePoint = (startOrEnd) => escapeHTML(
                applicableBrowseFieldSet.map((bf, j) =>
                    (j > 0 ? l('comma-space') : '') + bf + ' ' +
                        $pRaw(startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1))
                ).join('')
            );
            */
      const startSep = Templates.resultsDisplayServerOrClient.startSeparator({
        l
      });
      const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient.innerBrowseFieldSeparator({
        l
      });

      const buildRanges = () => {
        const endVals = [];
        const startRange = starts.reduce((str, startFieldValue, i) => {
          const ret = str + startFieldValue;

          if (startFieldValue === ends[i]) {
            // We abbreviate as start/end share same Book, etc.
            return ret + (i > 0 ? innerBrowseFieldSeparator // e.g., for "Genesis 7, 5-8"
            : ' ' // e.g., for 2nd space in "Surah 2 5-8"
            );
          }

          endVals.push(ends[i]);
          return ret + startSep;
        }, '').slice(0, -startSep.length);
        const rangeNames = applicableBrowseFieldNames.join(innerBrowseFieldSeparator);
        return escapeHTML(Templates.resultsDisplayServerOrClient.ranges({
          l,
          startRange,
          endVals,
          rangeNames
        }));
      };

      const ranges = buildRanges();
      caption = Templates.resultsDisplayServerOrClient.caption({
        heading,
        ranges
      });
    }

    return [hasCaption, caption];
  };

  const runPresort = ({
    presort,
    tableData,
    applicableBrowseFieldNames,
    localizedFieldNames
  }) => {
    // Todo: Ought to be checking against an aliased table
    if (presort) {
      tableData.sort((rowA, rowB) => {
        let precedence;
        applicableBrowseFieldNames.some(fieldName => {
          const idx = localizedFieldNames.indexOf(fieldName);
          const rowAFirst = rowA[idx] < rowB[idx];
          const rowBFirst = rowA[idx] > rowB[idx];
          precedence = rowBFirst ? 1 : -1;
          return rowAFirst || rowBFirst; // Keep going if 0
        });
        return precedence;
      });
    }
  };

  const getFieldValueAliasMap = ({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias
  }) => {
    return fieldInfo.map(({
      field,
      plugin
    }) => {
      if (plugin) {
        return undefined;
      }

      const {
        preferAlias,
        fieldValueAliasMap
      } = getFieldNameAndValueAliases({
        field,
        schemaItems,
        metadataObj,
        getFieldAliasOrName,
        lang
      });

      if (!usePreferAlias) {
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }

      if (fieldValueAliasMap) {
        Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            fieldValueAliasMap[key] = val.map(value => Templates.resultsDisplayServerOrClient.fieldValueAlias({
              key,
              value
            }));
            return;
          }

          if (val && typeof val === 'object') {
            if (typeof preferAlias === 'string') {
              fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                key,
                value: val[preferAlias]
              });
            } else {
              Object.entries(val).forEach(([k, value]) => {
                fieldValueAliasMap[key][k] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
                  key,
                  value
                });
              });
            }

            return;
          }

          fieldValueAliasMap[key] = Templates.resultsDisplayServerOrClient.fieldValueAlias({
            key,
            value: val
          });
        });
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }

      return undefined;
    });
  };

  const $pRaw = (param, avoidLog) => {
    // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)
    let key;
    const p = $p.get(param, true);
    /**
         *
         * @param {GenericArray|PlainObject} locale
         * @returns {boolean}
         */

    function reverseLocaleLookup(locale) {
      if (Array.isArray(locale)) {
        return locale.some(reverseLocaleLookup);
      }

      const localeValues = Object.values(locale);
      return localeValues.some((val, i) => {
        if (typeof val !== 'string') {
          return reverseLocaleLookup(val);
        }

        if (val === p) {
          key = Object.keys(locale)[i];
          return true;
        }

        return false;
      });
    }

    reverseLocaleLookup(imfLocales);

    if (!key && !avoidLog) {
      console.log('Bad param/value', param, '::', p);
    }

    return key; // || p; // $p.get(param, true);
  };

  const escapeCSS = escapeHTML;

  const $pRawEsc = param => escapeHTML($pRaw(param));

  const $pEscArbitrary = param => escapeHTML($p.get(param, true)); // Not currently in use


  const escapeQuotedCSS = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  const {
    fileData,
    lf,
    getFieldAliasOrName,
    schemaObj,
    metadataObj,
    pluginsForWork
  } = await getWorkData({
    files: files || this.files,
    allowPlugins: allowPlugins || this.allowPlugins,
    lang,
    fallbackLanguages,
    work: $p.get('work'),
    basePath
  });
  console.log('pluginsForWork', pluginsForWork);
  const heading = getMetaProp(lang, metadataObj, 'heading');
  const schemaItems = schemaObj.items.items;
  const setNames = [];
  const presorts = [];
  const browseFieldSets = [];
  getBrowseFieldData({
    metadataObj,
    schemaItems,
    getFieldAliasOrName,
    lang,

    callback({
      setName,
      browseFields,
      presort
    }) {
      setNames.push(setName);
      presorts.push(presort);
      browseFieldSets.push(browseFields);
    }

  });
  const fieldInfo = schemaItems.map(({
    title: field,
    format
  }) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field,
      escapeColumn: format !== 'html',
      fieldLang: metadataObj.fields[field].lang
    };
  });
  const [preferredLocale] = lang;
  const metadata = new Metadata({
    metadataObj
  });

  if (pluginsForWork) {
    console.log('pluginsForWork', pluginsForWork);
    const {
      lang
    } = this; // array with first item as preferred

    pluginsForWork.iterateMappings(({
      plugin,
      pluginName,
      pluginLang,
      onByDefaultDefault,
      placement,
      applicableFields,
      meta
    }) => {
      placement = placement === 'end' ? Number.POSITIVE_INFINITY // push
      : placement;

      const processField = ({
        applicableField,
        targetLanguage,
        onByDefault,
        metaApplicableField
      } = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(applicableField);

        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            applicableField,
            targetLanguage,
            // Default lang for plug-in (from files.json)
            pluginLang,
            // Default lang when no target language or
            //   plugin lang; using the lang of the applicable
            //   field
            applicableFieldLang
          });
        }

        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }

        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName ? plugin.getFieldAliasOrName({
          locales: lang,
          lf,
          targetLanguage,
          applicableField,
          applicableFieldI18N,
          meta,
          metaApplicableField,
          targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
        }) : languages.getFieldNameFromPluginNameAndLocales({
          pluginName,
          locales: lang,
          lf,
          targetLanguage,
          applicableFieldI18N,
          // Todo: Should have formal way to i18nize meta
          meta,
          metaApplicableField
        });
        fieldInfo.splice( // Todo: Allow default placement overriding for
        //    non-plugins
        placement, 0, {
          plugin,
          meta,
          placement,
          // field: `${this.namespace}-plugin-${field}`,
          fieldAliasOrName,
          escapeColumn: plugin.escapeColumn !== false,
          // Plug-in specific (todo: allow specifying
          //    for non-plugins)
          onByDefault: typeof onByDefault === 'boolean' ? onByDefault : onByDefaultDefault || false,
          // Three conventions for use by plug-ins but
          //     textbrowser only passes on (might
          //     not need here)
          applicableField,
          metaApplicableField,
          fieldLang: targetLanguage
        });
      };

      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }

  const localizedFieldNames = fieldInfo.map(fi => fi.fieldAliasOrName);
  const escapeColumnIndexes = fieldInfo.map(fi => fi.escapeColumn);
  const fieldLangs = fieldInfo.map(({
    fieldLang
  }) => {
    return fieldLang !== preferredLocale ? fieldLang : null;
  });
  const fieldValueAliasMap = getFieldValueAliasMap({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias: false
  });
  const fieldValueAliasMapPreferred = getFieldValueAliasMap({
    schemaItems,
    fieldInfo,
    metadataObj,
    getFieldAliasOrName,
    usePreferAlias: true
  }); // Todo: Repeats some code in workDisplay; probably need to reuse
  //   these functions more in `Templates.resultsDisplayServerOrClient` too

  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true) ? $p.get('i18n', true) === '1' : prefI18n === 'true' || prefI18n !== 'false' && this.localizeParamNames;
  const il = localizeParamNames ? key => l(['params', key]) : key => key;
  const iil = localizeParamNames ? key => l(['params', 'indexed', key]) : key => key;
  const ilRaw = localizeParamNames ? (key, suffix = '') => $p.get(il(key) + suffix, true) : (key, suffix = '') => $p.get(key + suffix, true);
  const iilRaw = localizeParamNames ? (key, suffix = '') => $p.get($p.get('work') + '-' + iil(key) + suffix, true) : (key, suffix = '') => $p.get($p.get('work') + '-' + key + suffix, true); // Now that we know `browseFieldSets`, we can parse `startEnd`

  const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) => iilRaw('startEnd', i + 1));

  if (browseFieldSetStartEndIdx !== -1) {
    // Todo: i18nize (by work and/or by whole app?)
    const rangeSep = '-';
    const partSep = ':'; // Search box functionality (Todo: not yet in UI); should first
    //    avoid numeric startEnd and even work across book
    // Todo: At least avoid need for book text AND book number in Bible
    // Todo: Change query beginning at 0 to 1 if none present?
    // Todo: Support i18nized or canonical aliases (but don't
    //         over-trim in such cases)

    const rawSearch = (iilRaw('startEnd', browseFieldSetStartEndIdx + 1) || '').trim();
    const [startFull, endFull] = rawSearch.split(rangeSep);

    if (endFull !== undefined) {
      const startPartVals = startFull.split(partSep);
      const endPartVals = endFull.split(partSep);
      const startEndDiff = startPartVals.length - endPartVals.length;

      if (startEndDiff > 0) {
        // e.g., 5:42:7 - 8 only gets verses 7-8
        endPartVals.unshift(...startPartVals.slice(0, startEndDiff));
      } else if (startEndDiff < 0) {
        // e.g., 5 - 6:2:1 gets all of book 5 to 6:2:1
        // Todo: We should fill with '0' but since that often
        //    doesn't find anything, we default for now to '1'.
        startPartVals.push(...new Array(-startEndDiff).fill('1'));
      }

      console.log('startPartVals', startPartVals);
      console.log('endPartVals', endPartVals);
      startPartVals.forEach((startPartVal, i) => {
        const endPartVal = endPartVals[i];
        $p.set(`${$p.get('work')}-start${browseFieldSetStartEndIdx + 1}-${i + 1}`, startPartVal, true);
        $p.set(`${$p.get('work')}-end${browseFieldSetStartEndIdx + 1}-${i + 1}`, endPartVal, true);
      });
    }
  }

  const browseFieldSetIdx = browseFieldSets.findIndex((item, i) => iilRaw('start', i + 1 + '-1'));
  const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
  const applicableBrowseFieldSetName = setNames[browseFieldSetIdx];
  const applicableBrowseFieldNames = applicableBrowseFieldSet.map(abfs => abfs.fieldName);
  const canonicalBrowseFieldSet = browseFieldSets[0];
  const canonicalBrowseFieldSetName = setNames[0];
  const canonicalBrowseFieldNames = canonicalBrowseFieldSet.map(abfs => abfs.fieldName);
  const fieldSchemaTypes = applicableBrowseFieldSet.map(abfs => abfs.fieldSchema.type);

  const buildRangePoint = startOrEnd => applicableBrowseFieldNames.map((bfn, j) => $p.get($p.get('work') + '-' + startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1), true));

  const starts = buildRangePoint('start');
  const ends = buildRangePoint('end');
  const [hasCaption, caption] = getCaption({
    starts,
    ends,
    applicableBrowseFieldNames,
    heading
  });
  const showInterlinTitles = $pRaw('interlintitle') === '1';
  console.log('rand', ilRaw('rand') === 'yes');

  const stripToRawFieldValue = (v, i) => {
    let val;

    if (v.match(/^\d+$/) || v.match(fieldValueAliasRegex)) {
      val = getRawFieldValue(v);
    } else {
      const {
        rawFieldValueAliasMap
      } = applicableBrowseFieldSet[i];
      let dealiased;

      if (rawFieldValueAliasMap) {
        // Look to dealias
        const fvEntries = Object.entries(rawFieldValueAliasMap);

        if (Array.isArray(fvEntries[0][1])) {
          fvEntries.some(([key, arr]) => {
            if (arr.includes(v)) {
              dealiased = key;
              return true;
            }

            return false;
          });
        } else {
          fvEntries.some(([key, obj]) => {
            const arr = Object.values(obj);

            if (arr.includes(v)) {
              dealiased = key;
              return true;
            }

            return false;
          });
        }
      }

      val = dealiased === undefined ? v : dealiased;
    }

    return fieldSchemaTypes[i] === 'integer' ? Number.parseInt(val) : val;
  };

  const unlocalizedWorkName = fileData.name;
  const startsRaw = starts.map(stripToRawFieldValue);
  const endsRaw = ends.map(stripToRawFieldValue);
  let tableData,
      usingServerData = false; // Site owner may have configured to skip (e.g., testing)

  if (!skipIndexedDB && // User may have refused, not yet agreed, or are visiting the
  //   results page directly where we don't ask for the permissions
  //   needed for persistent IndexedDB currently so that people can
  //   be brought to a results page without needing to agree to persist
  //   through notifications (or however)
  !noIndexedDB) {
    tableData = await new Promise((resolve, reject) => {
      // Todo: Fetch the work in code based on the non-localized `datafileName`
      const dbName = this.namespace + '-textbrowser-cache-data';
      const req = indexedDB.open(dbName);

      req.onsuccess = ({
        target: {
          result: db
        }
      }) => {
        const storeName = 'files-to-cache-' + unlocalizedWorkName;
        const trans = db.transaction(storeName);
        const store = trans.objectStore(storeName); // Get among browse field sets by index number within URL params

        const index = store.index('browseFields-' + applicableBrowseFieldSetName); // console.log('dbName', dbName);
        // console.log('storeName', storeName);
        // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

        const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));

        r.onsuccess = ({
          target: {
            result
          }
        }) => {
          const converted = result.map(r => r.value);
          resolve(converted);
        };
      };
    });
  } else {
    // No need for presorting in indexedDB, given indexes
    const presort = presorts[browseFieldSetIdx]; // Given that we are not currently wishing to add complexity to
    //   our PHP code (though it is not a problem with Node.js),
    //   we retrieve the whole file and then sort where presorting is
    //   needed
    // if (presort || this.noDynamic) {

    if (this.noDynamic) {
      ({
        resolved: {
          data: tableData
        }
      } = await JsonRefs$1.resolveRefs(fileData.file));
      runPresort({
        presort,
        tableData,
        applicableBrowseFieldNames,
        localizedFieldNames
      });
    } else {
      /*
            const jsonURL = Object.entries({
                prefI18n, unlocalizedWorkName, startsRaw, endsRaw
            }).reduce((url, [arg, argVal]) => {
                return url + '&' + arg + '=' + encodeURIComponent((argVal));
            }, `${dynamicBasePath}textbrowser?`);
            */
      const jsonURL = `${dynamicBasePath}textbrowser?${$p.toString()}`;
      tableData = await (await fetch(jsonURL)).json();
      usingServerData = true;
    }
  }

  if (!usingServerData && pluginsForWork) {
    fieldInfo.forEach(({
      plugin,
      placement
    }, j) => {
      if (!plugin) {
        return;
      }

      tableData.forEach((tr, i) => {
        // Todo: We should pass on other arguments (like `meta` but on `applicableFields`)
        tr.splice(placement, 0, null // `${i}-${j}`);
        );
      });
    });
    fieldInfo.forEach(({
      plugin,
      applicableField,
      fieldLang,
      meta,
      metaApplicableField
    }, j) => {
      if (!plugin) {
        return;
      }

      const applicableFieldIdx = fieldInfo.findIndex(({
        field
      }) => {
        return field === applicableField;
      }); // Now safe to pass (and set) `j` value as tr array expanded

      tableData.forEach((tr, i) => {
        const applicableFieldText = tr[applicableFieldIdx];
        tr[j] = plugin.getCellData && plugin.getCellData({
          tr,
          tableData,
          i,
          j,
          applicableField,
          fieldInfo,
          applicableFieldIdx,
          applicableFieldText,
          fieldLang,
          getLangDir: rtlDetect.getLangDir,
          meta,
          metaApplicableField,
          $p,
          thisObj: this
        }) || applicableFieldText;
      });
      console.log('applicableFieldIdx', applicableFieldIdx);
    });
  }

  const localeDir = rtlDetect.getLangDir(preferredLocale);
  const fieldDirs = fieldLangs.map(langCode => {
    if (!langCode) {
      return null;
    }

    const langDir = rtlDetect.getLangDir(langCode);
    return langDir !== localeDir ? langDir : null;
  });
  const templateArgs = {
    tableData,
    $p,
    $pRaw,
    $pRawEsc,
    $pEscArbitrary,
    escapeQuotedCSS,
    escapeCSS,
    escapeHTML,
    l,
    localizedFieldNames,
    fieldLangs,
    fieldDirs,
    caption,
    hasCaption,
    showInterlinTitles,
    determineEnd: determineEnd({
      applicableBrowseFieldNames,
      fieldValueAliasMap,
      fieldValueAliasMapPreferred,
      localizedFieldNames,
      startsRaw,
      endsRaw
    }),
    canonicalBrowseFieldSetName,
    getCanonicalID: getCanonicalID({
      canonicalBrowseFieldNames,
      fieldValueAliasMap,
      fieldValueAliasMapPreferred,
      localizedFieldNames
    }),
    getCellValue: getCellValue({
      fieldValueAliasMapPreferred,
      escapeColumnIndexes,
      escapeHTML
    }),
    checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
      localizedFieldNames
    }),
    interlinearSeparator: this.interlinearSeparator
  };
  return {
    fieldInfo,
    $p,
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred,
    lf,
    iil,
    ilRaw,
    browseFieldSets,
    lang,
    metadataObj,
    fileData,
    templateArgs
  };
};

function getIMFFallbackResults({
  $p,
  lang,
  langs,
  langData,
  fallbackLanguages,
  resultsDisplay,
  basePath = '',
  localeCallback = false
}) {
  return new Promise((resolve, reject) => {
    const resultsCallback = (...args) => {
      const [l10n] = args;

      if (!$p.l10n) {
        $p.l10n = l10n;
      }

      return resultsDisplay({
        l: l10n,
        lang,
        fallbackLanguages,
        imfLocales: imf.locales,
        $p,
        basePath
      }, ...args);
    };

    const imf = IMF__default['default']({
      languages: lang,
      fallbackLanguages,

      localeFileResolver(code) {
        // Todo: For editing of locales, we might instead resolve all
        //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
        //    replace IMF() loadLocales behavior with our own now resolved
        //    locales; see https://github.com/jdorn/json-editor/issues/132
        return basePath + langData.localeFileBasePath + langs.find(l => l.code === code).locale.$ref;
      },

      async callback(...args) {
        if (localeCallback && localeCallback(...args)) {
          resolve();
          return;
        }

        await resultsCallback(...args);
        resolve();
      }

    });
  });
}

/* globals console, location, URL */
const setServiceWorkerDefaults = (target, source) => {
  target.userJSON = source.userJSON || 'resources/user.json';
  target.languages = source.languages || new URL('../appdata/languages.json', // Todo: Substitute with `import.meta.url`
  new URL('node_modules/textbrowser/resources/index.js', location)).href;
  target.serviceWorkerPath = source.serviceWorkerPath || `sw.js?pathToUserJSON=${encodeURIComponent(target.userJSON)}&stylesheets=${JSON.stringify(target.stylesheets || [])}`;
  target.files = source.files || 'files.json';
  target.namespace = source.namespace || 'textbrowser';
  return target;
}; // (Unless skipped in code, will wait between install

/* eslint-disable import/no-commonjs */

const http = require('http');

const fetch$1 = require('node-fetch'); // Problems as `import` since 2.1.2


const setGlobalVars = require('indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node.js'); // Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event


const optionDefinitions = [// Node-server-specific
{
  name: 'nodeActivate',
  type: Boolean
}, {
  name: 'port',
  type: Number
}, {
  name: 'domain',
  type: String
}, {
  name: 'basePath',
  type: String
}, // Results display (main)
//      `namespace`: (but set below)
//      `skipIndexedDB`: set to `false` below (and the default anyways)
//      `noDynamic`: not used
//      `prefI18n`: will instead be set dynamically per user query
//      `files`: Already set below for service worker
{
  name: 'interlinearSeparator',
  type: String
}, {
  name: 'localizeParamNames',
  type: Boolean
}, {
  name: 'trustFormatHTML',
  type: Boolean
}, {
  name: 'allowPlugins',
  type: Boolean
}, // Results display (template)
{
  name: 'showEmptyInterlinear',
  type: Boolean
}, {
  name: 'showTitleOnSingleInterlinear',
  type: Boolean
}, // Service worker
{
  name: 'serviceWorkerPath',
  type: String,
  defaultOption: true
}, {
  name: 'userJSON',
  type: String
}, {
  name: 'languages',
  type: String
}, {
  name: 'files',
  type: String
}, {
  name: 'namespace',
  type: String
}];

const userParams = require('command-line-args')(optionDefinitions);

const port = 'port' in userParams ? userParams.port : 8000;
const domain = userParams.domain || `localhost`;
const basePath = userParams.basePath || `http://${domain}${port ? ':' + port : ''}/`;

const userParamsWithDefaults = _objectSpread2(_objectSpread2(_objectSpread2({}, setServiceWorkerDefaults({}, {
  namespace: 'textbrowser',
  files: `${basePath}files.json`,
  // `files` must be absolute path for node-fetch
  languages: `${basePath}node_modules/textbrowser/appdata/languages.json`,
  serviceWorkerPath: `${basePath}sw.js?pathToUserJSON=${encodeURIComponent(userParams.userJSON || '')}`
})), userParams), {}, {
  log(...args) {
    console.log(...args);
  },

  nodeActivate: undefined,
  port: undefined,
  skipIndexedDB: false,
  // Not relevant here
  noDynamic: false // Not relevant here

  /*
    Not in use:
    logger: {
        addLogEntry ({text}) {
            console.log(`Log: ${text}`);
        },
        dbError ({
            type,
            escapedErrorMessage
        }) {
            throw new Error(`Worker aborted: error type ${type}; ${escapedErrorMessage}`);
        }
    } */

});

console.log('userParamsWithDefaults', userParamsWithDefaults);
setGlobalVars(null, {
  checkOrigin: false
}); // Adds `indexedDB` and `IDBKeyRange` to global in Node

if (userParams.nodeActivate) {
  global.fetch = fetch$1; // const activateCallback = require('../resources/activateCallback.js');

  const activateCallback = require('../dist/activateCallback-umd.js'); // eslint-disable-line node/global-require


  (async () => {
    await activateCallback(userParamsWithDefaults);
    console.log('Activated');
  })();
}

console.log('past activate check');
global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const statik = require('node-static');
/* eslint-enable import/no-commonjs */


const fileServer = new statik.Server(); // Pass path; otherwise uses current directory

let langData, languagesInstance;

(async () => {
  langData = await simpleGetJson.getJSON(userParamsWithDefaults.languages);
  languagesInstance = new Languages({
    langData
  });
})();

const srv = http.createServer(async (req, res) => {
  // console.log('URL::', new URL(req.url));
  const {
    pathname,
    search
  } = new URL(req.url, basePath);

  if (pathname !== '/textbrowser' || !search) {
    req.addListener('end', function () {
      if (pathname.includes('.git')) {
        req.url = '/index.html';
      }

      fileServer.serve(req, res);
    }).resume();
    /*
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>File not found</h1>');
        */

    return;
  }

  const languages = req.headers['accept-language'].replace(/;q=.*?$/, '').split(',');
  global.navigator = {
    language: languages[0],
    languages
  };
  const $p = new IntlURLSearchParams({
    params: search
  });
  const {
    lang,
    langs,
    fallbackLanguages
  } = languagesInstance.getLanguageInfo({
    $p
  });
  getIMFFallbackResults({
    $p,
    basePath,
    lang,
    langs,
    fallbackLanguages,
    langData,

    async resultsDisplay(resultsArgs, ...args) {
      const serverOutput = $p.get('serverOutput', true);
      const isHTML = serverOutput === 'html';
      res.writeHead(200, {
        'Content-Type': isHTML ? 'text/html;charset=utf8' : 'application/json;charset=utf8'
      });
      resultsArgs = _objectSpread2(_objectSpread2({}, resultsArgs), {}, {
        skipIndexedDB: false,
        serverOutput,
        langData,
        prefI18n: $p.get('prefI18n', true)
      }); // Todo: Move sw-sample.js to bahaiwritings and test

      const result = await resultsDisplayServer.call(_objectSpread2(_objectSpread2({}, userParamsWithDefaults), {}, {
        lang,
        langs,
        fallbackLanguages
      }), resultsArgs, ...args);
      res.end(isHTML ? result : JSON.stringify(result));
    }

  });
});

if (!userParams.domain) {
  srv.listen(port);
} else {
  srv.listen(port, userParams.domain);
}
