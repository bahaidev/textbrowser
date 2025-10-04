import Locale from 'intl-locale-textinfo-polyfill';
import JsonRefs from 'json-refs';
import {jml} from 'jamilih';

import Templates from './templates/index.js';
import {escapeHTML} from './utils/sanitize.js';
import {
  getMetaProp, Metadata, getFieldNameAndValueAliases, getBrowseFieldData
} from './utils/Metadata.js';
import {Languages} from './utils/Languages.js';
import {getWorkData} from './utils/WorkInfo.js';

/**
 * @callback GetCanonicalID
 * @param {{
 *   tr: (string|Integer)[]
 * }} cfg
 * @returns {string}
 */
/**
 * @callback DetermineEnd
 * @param {{
 *   tr: (string|Integer)[]
 *   foundState: {
 *     start: boolean,
 *     end: boolean
 *   }
 * }} cfg
 * @returns {string|boolean}
 */

/**
 * @typedef {import('./utils/Plugin.js').PluginObject} Plugin
 */

/**
 * @typedef {{
 *   field?: string,
 *   fieldAliasOrName: string|string[]|import('../server/main.js').LocalizationStrings,
 *   escapeColumn: boolean,
 *   fieldLang: string,
 *   plugin?: Plugin,
 *   applicableField?: string,
 *   meta?: {[key: string]: string},
 *   j?: number,
 *   placement?: number
 *   metaApplicableField?: {
 *     [key: string]: string
 *   },
 *   onByDefault?: boolean
 * }[]} FieldInfo
 */

/**
 * @typedef {import('./utils/Metadata.js').FieldValueAliases} FieldValueAliases
 */
/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @typedef {any} AnyValue
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */
/**
 * @param {AnyValue} val
 * @returns {val is null | undefined}
 */
const isNullish = (val) => {
  return val === null || val === undefined;
};

/**
 * @typedef {number} Integer
 */
/**
 * @param {string} locale
 */
const getLangDir = (locale) => {
  const {direction} = new Locale(locale).getTextInfo();
  return direction;
};

const fieldValueAliasRegex = /^.* \((.*?)\)$/;

/**
 * @param {string} v
 */
const getRawFieldValue = (v) => {
  return typeof v === 'string'
    ? v.replace(fieldValueAliasRegex, '$1')
    : v;
};

/**
 * @param {{
 *   applicableBrowseFieldSet: import('./utils/Metadata.js').BrowseFields,
 *   fieldValueAliasMapPreferred: (FieldValueAliases|null|undefined)[],
 *   lParamRaw: (key: string, suffix?: string) => string,
 *   lIndexedParam: (key: string) => string,
 *   max: number,
 *   $p: import('./utils/IntlURLSearchParams.js').default
 * }} cfg
 */
const setAnchor = ({
  applicableBrowseFieldSet,
  fieldValueAliasMapPreferred, lParamRaw, lIndexedParam, max, $p
}) => {
  const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map((abfs) => {
    return abfs.fieldSchemaIndex;
  });
    // Check if user added this (e.g., even to end of URL with
    //   other anchor params)
  const work = $p.get('work');
  let anchor;
  const anchorRowCol = lParamRaw('anchorrowcol');
  if (anchorRowCol) {
    anchor = Templates.resultsDisplayClient.anchorRowCol({anchorRowCol});
  }
  if (!anchor) {
    const anchors = [];

    /** @type {string|null} */
    let anchorField = '';
    // eslint-disable-next-line sonarjs/misplaced-loop-counter -- Ok
    for (let i = 1, breakout; !breakout && !anchors.length; i++) {
      for (let j = 1; ; j++) {
        const anchorText = work + '-' + 'anchor' + i + '-' + j;
        const anchor = $p.get(anchorText, true);
        if (!anchor) {
          if (i === max || // No more field sets to check
                        anchors.length // Already had anchors found
          ) {
            breakout = true;
          }
          break;
        }
        anchorField = $p.get(lIndexedParam('anchorfield') + i, true);

        const x = applicableBrowseFieldSchemaIndexes[j - 1];
        const rawVal = getRawFieldValue(anchor);
        const raw = fieldValueAliasMapPreferred[x] &&
                    fieldValueAliasMapPreferred[x][rawVal];
        anchors.push(raw || anchor);
        // anchors.push({anchorText, anchor});
      }
    }
    if (anchors.length) {
      /**
       * @param {string} str
       */
      const escapeSelectorAttValue = (str) => (str || '').replaceAll(
        /["\\]/g, String.raw`\$&`
      );
      const escapedRow = escapeSelectorAttValue(anchors.join('-'));
      const escapedCol = anchorField
        ? escapeSelectorAttValue(anchorField)
        : undefined;
      anchor = Templates.resultsDisplayClient.anchors({
        escapedRow, escapedCol
      });
    }
  }
  if (anchor) {
    anchor.scrollIntoView();
  }
};

/**
 * @this {import('./index.js').default}
 * @param {Omit<ResultsDisplayServerOrClientArg, "skipIndexedDB"|"prefI18n">} args
 */
export const resultsDisplayClient = async function resultsDisplayClient (args) {
  const persistent = await navigator.storage.persisted();
  const skipIndexedDB = this.skipIndexedDB || !persistent ||
    !navigator.serviceWorker.controller;
  const prefI18n = /** @type {"true"|"false"|null} */ (
    localStorage.getItem(this.namespace + '-localizeParamNames')
  );

  const {
    fieldInfo, $p,
    browseFieldSets,
    applicableBrowseFieldSet,
    lang, metadataObj, fileData,
    fieldValueAliasMapPreferred, workI18n, lIndexedParam, lParamRaw,
    templateArgs
  } = await resultsDisplayServerOrClient.call(this, {
    ...args, skipIndexedDB, prefI18n
  });
  document.title = /** @type {string} */ (workI18n(
    'browserfile-resultsdisplay',
    {
      work: fileData
        ? /** @type {string} */ (getMetaProp(lang, metadataObj, 'alias'))
        : ''
    }
  ));
  Templates.resultsDisplayClient.main(templateArgs);
  setAnchor({
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred, lIndexedParam, lParamRaw,
    $p: args.$p,
    max: browseFieldSets.length
  });
  fieldInfo.forEach(({plugin, applicableField, meta, j}) => {
    if (!plugin) {
      return;
    }
    if (plugin.done) {
      plugin.done({$p, applicableField, meta, j, thisObj: this});
    }
  });
};

/**
 * @this {import('../server/main.js').ResultsDisplayServerContext}
 * This is server-only code, but kept here as the function is similar.
 * @param {ResultsDisplayServerOrClientArg & {
 *   serverOutput?: "jamilih"|"html"|"json"|null
 * }} args
 * @returns {Promise<import('jamilih').JamilihArray|string|(string | number)[][]>}
 */
export const resultsDisplayServer = async function resultsDisplayServer (args) {
  const {
    templateArgs
  } = await resultsDisplayServerOrClient.call(this, {
    ...args
  });
    // Todo: Should really reconcile this with client-side output options
    //         (as should also have option there to get JSON, Jamilih, etc.
    //         output)
  switch (args.serverOutput) {
  case 'jamilih':
    return Templates.resultsDisplayServerOrClient.main(templateArgs);
  case 'html': {
    const jamilih = Templates.resultsDisplayServerOrClient.main(templateArgs);
    return jml.toHTML(...jamilih);
  }
  // case 'json':
  default:
    return templateArgs.tableData;
  }
};

/**
 * @typedef {(info: {
 *   tr: (string|Integer)[],
 *   idx: number,
 * }) => {
 *   tdVal: string|Integer,
 *   htmlEscaped: boolean
 * }|{
 *   tdVal: string|Integer,
 *   htmlEscaped?: undefined
 * }} GetCellValue
 */

/**
 * @todo For `locales`, should export `LocaleObject` from intl-dom
 * @typedef {{
 *   l: import('intl-dom').I18NCallback,
 *   lang: string[],
 *   fallbackLanguages: string[]|undefined,
 *   locales: {head?: AnyValue, body: AnyValue},
 *   $p: import('./utils/IntlURLSearchParams.js').default,
 *   skipIndexedDB: boolean,
 *   noIndexedDB?: boolean,
 *   prefI18n: "true"|"false"|null,
 *   files?: string,
 *   allowPlugins?: boolean,
 *   langData: import('../server/main.js').LanguagesData,
 *   basePath: string,
 *   dynamicBasePath?: string
 * }} ResultsDisplayServerOrClientArg
 */

/**
 * @this {import('../server/main.js').ResultsDisplayServerContext|import('./index.js').default}
 * @param {ResultsDisplayServerOrClientArg} cfg
 */
export const resultsDisplayServerOrClient = async function resultsDisplayServerOrClient ({
  l, lang, fallbackLanguages, locales, $p, skipIndexedDB, noIndexedDB, prefI18n,
  files, allowPlugins, langData, basePath = '', dynamicBasePath = ''
}) {
  const languages = new Languages({langData});

  /**
   * @param {{
   *   fieldValueAliasMapPreferred: (FieldValueAliases|null|undefined)[],
   *   escapeColumnIndexes: boolean[]
   * }} cfg
   * @returns {GetCellValue}
   */
  const getCellValue = ({
    fieldValueAliasMapPreferred, escapeColumnIndexes
  }) => ({
    tr, idx
  }) => {
    let tdVal = (!isNullish(fieldValueAliasMapPreferred[idx])
      ? fieldValueAliasMapPreferred[idx][tr[idx]]
      : tr[idx]
    );
    if (tdVal && typeof tdVal === 'object') {
      tdVal = Object.values(tdVal);
    }
    if (Array.isArray(tdVal)) {
      tdVal = tdVal.join(/** @type {string} */ (l('comma-space')));
    }
    return ((escapeColumnIndexes[idx] || !this.trustFormatHTML) &&
            typeof tdVal === 'string')
      ? {tdVal: escapeHTML(tdVal), htmlEscaped: true}
      : {tdVal};
  };

  /**
   * @param {{
   *   fieldValueAliasMap: (FieldValueAliases|null|undefined)[],
   *   fieldValueAliasMapPreferred: (FieldValueAliases|null|undefined)[],
   *   localizedFieldNames: (string | string[]|import('../server/main.js').LocalizationStrings)[],
   *   canonicalBrowseFieldNames: string[]
   * }} cfg
   */
  const getCanonicalID = ({
    fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
    canonicalBrowseFieldNames
  }) =>
    /** @type {GetCanonicalID} */
    // eslint-disable-next-line @stylistic/implicit-arrow-linebreak -- Ok
    ({
      tr // , foundState
    }) => {
      return canonicalBrowseFieldNames.map((fieldName) => {
        const idx = localizedFieldNames.indexOf(fieldName);
        // This works to put alias in anchor but this includes
        //   our ending parenthetical, the alias may be harder
        //   to remember and/or automated than original (e.g.,
        //   for a number representing a book); we may wish to
        //   switch this (and also for other browse field-based
        //   items).
        if (
          fieldValueAliasMap[idx] !== undefined &&
          // Added this condition after imf->intl-dom conversion; concealing a
          //   bug?
          fieldValueAliasMap[idx] !== null
        ) {
          return /** @type {FieldValueAliases} */ (
            fieldValueAliasMapPreferred[idx]
          )[tr[idx]];
        }
        return tr[idx];
      }).join('-'); // rowID;
    };

  /**
   * @param {{
   *   fieldValueAliasMap: (FieldValueAliases|null|undefined)[],
   *   fieldValueAliasMapPreferred: (FieldValueAliases|null|undefined)[],
   *   localizedFieldNames: (string|string[]|import('../server/main.js').LocalizationStrings)[],
   *   applicableBrowseFieldNames: string[],
   *   startsRaw: (string|Integer)[],
   *   endsRaw: (string|Integer)[]
   * }} cfg
   */
  const determineEnd = ({
    fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
    applicableBrowseFieldNames, startsRaw, endsRaw
  }) =>
    /** @type {DetermineEnd} */
    // eslint-disable-next-line @stylistic/implicit-arrow-linebreak -- Ok
    ({
      tr, foundState
    }) => {
      const rowIDPartsPreferred = /** @type {(string|Integer)[]} */ ([]);
      const rowIDParts = applicableBrowseFieldNames.map((fieldName) => {
        const idx = localizedFieldNames.indexOf(fieldName);
        // This works to put alias in anchor but this includes
        //   our ending parenthetical, the alias may be harder
        //   to remember and/or automated than original (e.g.,
        //   for a number representing a book), and there could
        //   be multiple aliases for a value; we may wish to
        //   switch this (and also for other browse field-based
        //   items).
        if (
          fieldValueAliasMap[idx] !== undefined &&
          // Added this condition after imf->intl-dom conversion; concealing a
          //   bug?
          fieldValueAliasMap[idx] !== null
        ) {
          rowIDPartsPreferred.push(
            /** @type {string|Integer} */
            (fieldValueAliasMapPreferred[idx]?.[tr[idx]])
          );
        } else {
          rowIDPartsPreferred.push(tr[idx]);
        }
        return tr[idx];
      });

      // Todo: Use schema to determine field type and use `Number.parseInt`
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
      }
      // This doesn't go in an `else` for the above in case the start is the end
      if (endsRaw.every((part, i) => {
        const rowIDPart = rowIDParts[i];
        return part === rowIDPart;
      })) {
        foundState.end = true;
      } else if (foundState.end) { // If no longer matching, trigger end of the table
        return true;
      }
      return rowIDPartsPreferred.join('-'); // rowID;
    };

  /**
   * @param {{
   *   localizedFieldNames: (
   *     string|string[]|import('../server/main.js').LocalizationStrings
   *   )[],
   * }} cfg
   * @returns {[string[], number[], ("" | number[] | null)[]]}
   */
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
      if (field && (
        checked === l('yes') || checked === null // Default to "on"
      )) {
        checkedFields.push(field);
      }
    } while (field);
    checkedFields = checkedFields.filter((cf) => localizedFieldNames.includes(cf));
    const checkedFieldIndexes = checkedFields.map((cf) => localizedFieldNames.indexOf(cf));
    const allInterlinearColIndexes = checkedFieldIndexes.map((cfi) => {
      const interlin = $p.get('interlin' + (cfi + 1), true);
      return interlin && interlin.split(/\s*,\s*/).map((col) => {
      // Todo: Avoid this when known to be integer or if string, though allow
      //    string to be treated as number if config is set.
        return Number.parseInt(col) - 1;
      }).filter((n) => !Number.isNaN(n));
    });
    return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
  };

  /**
   * @param {{
   *   starts: string[],
   *   ends: string[],
   *   applicableBrowseFieldNames: string[],
   *   heading: string
   * }} cfg
   * @returns {[boolean, string|undefined]}
   */
  const getCaption = ({starts, ends, applicableBrowseFieldNames, heading}) => {
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
      const startSep = Templates.resultsDisplayServerOrClient.startSeparator({l});
      const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient.
        innerBrowseFieldSeparator({l});

      const buildRanges = () => {
        /** @type {string[]} */
        const endVals = [];
        const startRange = starts.reduce((str, startFieldValue, i) => {
          const ret = str + startFieldValue;
          if (startFieldValue === ends[i]) { // We abbreviate as start/end share same Book, etc.
            return ret +
                            (i > 0
                              ? innerBrowseFieldSeparator // e.g., for "Genesis 7, 5-8"
                              : ' ' // e.g., for 2nd space in "Surah 2 5-8"
                            );
          }
          endVals.push(ends[i]);
          return ret + startSep;
        }, '').slice(0, -(startSep.length));

        const rangeNames = applicableBrowseFieldNames.join(innerBrowseFieldSeparator);
        return escapeHTML(
          Templates.resultsDisplayServerOrClient.ranges({l, startRange, endVals, rangeNames})
        );
      };
      const ranges = buildRanges();
      caption = Templates.resultsDisplayServerOrClient.caption({heading, ranges});
    }
    return [hasCaption, caption];
  };

  /**
   * @param {{
   *   presort: boolean|undefined,
   *   tableData: (string|Integer)[][],
   *   applicableBrowseFieldNames: string[],
   *   localizedFieldNames: (string|string[]|import('../server/main.js').LocalizationStrings)[]
   * }} cfg
   */
  const runPresort = ({presort, tableData, applicableBrowseFieldNames, localizedFieldNames}) => {
    // Todo: Ought to be checking against an aliased table
    if (presort) {
      tableData.sort((rowA, rowB) => {
        let precedence = 0;
        applicableBrowseFieldNames.some((fieldName) => {
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

  /**
   * @param {{
   *   schemaItems: {title: string, type: string}[],
   *   fieldInfo: FieldInfo,
   *   metadataObj: import('./utils/Metadata.js').MetadataObj,
   *   getFieldAliasOrName: (
   *     field: string
   *   ) => string|string[]|import('../server/main.js').LocalizationStrings,
   *   usePreferAlias: boolean
   * }} cfg
   */
  const getFieldValueAliasMap = ({
    schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias
  }) => {
    return fieldInfo.map(({field, plugin}) => {
      if (plugin) {
        return undefined;
      }
      const {preferAlias, fieldValueAliasMap} = getFieldNameAndValueAliases({
        // eslint-disable-next-line object-shorthand -- TS
        field: /** @type {string} */ (field),
        schemaItems, metadataObj, getFieldAliasOrName, lang
      });
      if (!usePreferAlias) {
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }
      if (fieldValueAliasMap) {
        Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
          if (Array.isArray(val)) {
            fieldValueAliasMap[key] = val.map((value) => {
              return Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value});
            });
            return;
          }
          if (val && typeof val === 'object') {
            if (typeof preferAlias === 'string') {
              fieldValueAliasMap[key] =
                Templates.resultsDisplayServerOrClient.fieldValueAlias({
                  key, value: val[preferAlias]
                });
            } else {
              Object.entries(val).forEach(([k, value]) => {
                /** @type {{[key: string]: string|number}} */
                (fieldValueAliasMap[key])[k] =
                  Templates.resultsDisplayServerOrClient.fieldValueAlias({
                    key, value
                  });
              });
            }
            return;
          }
          fieldValueAliasMap[key] =
            Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value: val});
        });
        return preferAlias !== false ? fieldValueAliasMap : undefined;
      }
      return undefined;
    });
  };

  /**
   * @param {string} param
   * @param {boolean} [avoidLog]
   */
  const $pRaw = (param, avoidLog) => {
    // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)

    /** @type {string} */
    let key;
    const p = $p.get(param, true);
    /**
     * @typedef {{
     *   [key: string]: string|LocaleObj
     * }} LocaleObj
     */
    /**
     *
     * @param {LocaleObj[]|LocaleObj} locale
     * @returns {boolean}
     */
    function reverseLocaleLookup (locale) {
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
    reverseLocaleLookup(locales);
    // @ts-expect-error TS defect
    if (!key && !avoidLog) {
      console.log('Bad param/value', param, '::', p);
    }
    // @ts-expect-error TS defect
    return key; // || p; // $p.get(param, true);
  };

  const escapeCSS = escapeHTML;

  /**
   * @param {string} param
   */
  const $pRawEsc = (param) => escapeHTML($pRaw(param));
  /**
   * @param {string} param
   */
  const $pEscArbitrary = (param) => escapeHTML(
    /** @type {string} */
    ($p.get(param, true))
  );

  // Not currently in use

  /**
   * @param {string} s
   */
  const escapeQuotedCSS = (s) => s.replaceAll('\\', '\\\\').replaceAll(
    '"', String.raw`\"`
  );

  const {
    fileData, workI18n, getFieldAliasOrName, schemaObj, metadataObj,
    pluginsForWork
    // @ts-expect-error Not using `this` given no `languages` arg is passed
  } = await getWorkData({
    files: files || this.files,
    allowPlugins: typeof allowPlugins === 'boolean' ? allowPlugins : this.allowPlugins,
    lang, fallbackLanguages,
    work: $p.get('work'),
    basePath
  });
  console.log('pluginsForWork', pluginsForWork);

  const heading = /** @type {string} */ (getMetaProp(lang, metadataObj, 'heading'));
  const schemaItems = schemaObj.items.items;

  /** @type {string[]} */
  const setNames = [];
  /** @type {(boolean|undefined)[]} */
  const presorts = [];

  /** @type {import('./utils/Metadata.js').BrowseFields[]} */
  const browseFieldSets = [];
  getBrowseFieldData({
    metadataObj, schemaItems, getFieldAliasOrName, lang,
    callback ({setName, browseFields, presort}) {
      setNames.push(setName);
      presorts.push(presort);
      browseFieldSets.push(browseFields);
    }
  });

  /** @type {FieldInfo} */
  const fieldInfo = schemaItems.map(({title: field, format}) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field,
      escapeColumn: format !== 'html',
      fieldLang: metadataObj.fields[field].lang
    };
  });

  const [preferredLocale] = lang;
  const metadata = new Metadata({metadataObj});
  if (pluginsForWork) {
    console.log('pluginsForWork', pluginsForWork);
    const {lang} = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      // plugin,
      pluginName, pluginLang,
      onByDefaultDefault,
      placement, applicableFields, meta
    }) => {
      placement = placement === 'end'
        ? Number.POSITIVE_INFINITY // push
        : placement;

      /**
       * @param {{
       *   applicableField?: string,
       *   targetLanguage?: string,
       *   onByDefault?: boolean,
       *   metaApplicableField?: {
       *     [key: string]: string
       *   },
       * }} [cfg]
       */
      const processField = ({applicableField, targetLanguage, onByDefault, metaApplicableField} = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(
          /** @type {string} */ (applicableField)
        );
        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            // eslint-disable-next-line object-shorthand -- TS
            applicableField: /** @type {string} */ (applicableField),
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
        const applicableFieldI18N = getMetaProp(
          lang,
          metadataObj,
          [
            'fieldnames',
            /** @type {string} */
            (applicableField)
          ]
        );
        const fieldAliasOrName = plugin.getFieldAliasOrName
          ? plugin.getFieldAliasOrName({
            locales: lang,
            workI18n,
            // eslint-disable-next-line object-shorthand -- TS
            targetLanguage: /** @type {string} */ (targetLanguage),
            // eslint-disable-next-line object-shorthand -- TS
            applicableField: /** @type {string} */ (applicableField),
            applicableFieldI18N,
            meta,
            // eslint-disable-next-line object-shorthand -- TS
            metaApplicableField: /** @type {{[key: string]: string }} */ (
              metaApplicableField
            ),
            targetLanguageI18N: languages.getLanguageFromCode(
              /** @type {string} */ (targetLanguage)
            )
          })
          : languages.getFieldNameFromPluginNameAndLocales({
            pluginName,
            // locales: lang,
            workI18n,
            // eslint-disable-next-line object-shorthand -- TS
            targetLanguage: /** @type {string} */ (targetLanguage),
            // eslint-disable-next-line object-shorthand -- TS
            applicableFieldI18N: /** @type {string|string[]} */ (applicableFieldI18N),
            // Todo: Should have formal way to i18nize meta
            meta,
            // eslint-disable-next-line object-shorthand -- TS
            metaApplicableField: /** @type {{[key: string]: string }} */ (
              metaApplicableField
            )
          });
        fieldInfo.splice(
          // Todo: Allow default placement overriding for
          //    non-plugins
          placement,
          0,
          {
            plugin,
            meta,
            placement,
            // field: `${this.namespace}-plugin-${field}`,
            fieldAliasOrName,
            escapeColumn: plugin.escapeColumn !== false,
            // Plug-in specific (todo: allow specifying
            //    for non-plugins)
            onByDefault: typeof onByDefault === 'boolean'
              ? onByDefault
              : (onByDefaultDefault || false),
            // Three conventions for use by plug-ins but
            //     textbrowser only passes on (might
            //     not need here)
            applicableField,
            metaApplicableField,
            fieldLang: /** @type {string} */ (targetLanguage)
          }
        );
      };
      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }

  const localizedFieldNames = fieldInfo.map((fi) => fi.fieldAliasOrName);
  const escapeColumnIndexes = fieldInfo.map((fi) => fi.escapeColumn);
  const fieldLangs = fieldInfo.map(({fieldLang}) => {
    return fieldLang !== preferredLocale ? fieldLang : null;
  });
  const fieldValueAliasMap = getFieldValueAliasMap({
    schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: false
  });
  const fieldValueAliasMapPreferred = getFieldValueAliasMap({
    schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: true
  });

  // Todo: Repeats some code in workDisplay; probably need to reuse
  //   these functions more in `Templates.resultsDisplayServerOrClient` too
  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
    ? $p.get('i18n', true) === '1'
    : prefI18n === 'true' || (
      prefI18n !== 'false' && this.localizeParamNames
    );
  const lParam = localizeParamNames
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    ?
    /**
     * @param {string} key
     * @returns {string}
     */
    (key) => /** @type {string} */ (l(['params', key]))
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    :
    /**
     * @param {string} key
     * @returns {string}
     */
    (key) => key;
  const lIndexedParam = localizeParamNames
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    ?
    /**
     * @param {string} key
     * @returns {string}
     */
    (key) => /** @type {string} */ (l(['params', 'indexed', key]))
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    :
    /**
     * @param {string} key
     * @returns {string}
     */
    (key) => key;
  const lParamRaw = localizeParamNames
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    ?
    /**
     * @param {string} key
     * @param {string} [suffix]
     * @returns {string}
     */
    (key, suffix = '') => /** @type {string} */ (
      $p.get(lParam(key) + suffix, true)
    )
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    :
    /**
     * @param {string} key
     * @param {string} [suffix]
     * @returns {string}
     */
    (key, suffix = '') => /** @type {string} */ (
      $p.get(key + suffix, true)
    );
  const lIndexedParamRaw = localizeParamNames
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    ?
    /**
     * @param {string} key
     * @param {string} [suffix]
     * @returns {string}
     */
    (key, suffix = '') => /** @type {string} */ (
      $p.get($p.get('work') + '-' + lIndexedParam(key) + suffix, true)
    )
    // eslint-disable-next-line @stylistic/operator-linebreak -- Ok
    :
    /**
     * @param {string} key
     * @param {string} [suffix]
     * @returns {string}
     */
    (key, suffix = '') => /** @type {string} */ (
      $p.get($p.get('work') + '-' + key + suffix, true)
    );

  // Now that we know `browseFieldSets`, we can parse `startEnd`
  const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) => {
    return lIndexedParamRaw('startEnd', String(i + 1));
  });
  if (browseFieldSetStartEndIdx !== -1) {
    // Todo: i18nize (by work and/or by whole app?)
    const rangeSep = '-';
    const partSep = ':';

    // Search box functionality (Todo: not yet in UI); should first
    //    avoid numeric startEnd and even work across book
    // Todo: At least avoid need for book text AND book number in Bible
    // Todo: Change query beginning at 0 to 1 if none present?
    // Todo: Support i18nized or canonical aliases (but don't
    //         over-trim in such cases)
    const rawSearch = (lIndexedParamRaw('startEnd', String(browseFieldSetStartEndIdx + 1)) || '').trim();
    const [startFull, endFull] = rawSearch.split(rangeSep);
    if (endFull !== undefined) {
      const startPartVals = startFull.split(partSep);
      const endPartVals = endFull.split(partSep);
      const startEndDiff = startPartVals.length - endPartVals.length;
      if (startEndDiff > 0) { // e.g., 5:42:7 - 8 only gets verses 7-8
        endPartVals.unshift(...startPartVals.slice(0, startEndDiff));
      } else if (startEndDiff < 0) { // e.g., 5 - 6:2:1 gets all of book 5 to 6:2:1
        // Todo: We should fill with '0' but since that often
        //    doesn't find anything, we default for now to '1'.
        startPartVals.push(...Array.from({length: -startEndDiff}).fill('1'));
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

  const browseFieldSetIdx = browseFieldSets.findIndex((item, i) => {
    return lIndexedParamRaw('start', (i + 1) + '-1');
  });
  const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
  const applicableBrowseFieldSetName = setNames[browseFieldSetIdx];
  const applicableBrowseFieldNames = applicableBrowseFieldSet.map((abfs) => {
    return abfs.fieldName;
  });

  const canonicalBrowseFieldSet = browseFieldSets[0];
  const canonicalBrowseFieldSetName = setNames[0];
  const canonicalBrowseFieldNames = canonicalBrowseFieldSet.map((abfs) => {
    return abfs.fieldName;
  });

  const fieldSchemaTypes = applicableBrowseFieldSet.map((abfs) => abfs.fieldSchema.type);

  /**
   * @param {"start"|"end"} startOrEnd
   */
  const buildRangePoint = (startOrEnd) => {
    return applicableBrowseFieldNames.map((bfn, j) => {
      return /** @type {string} */ ($p.get(
        $p.get('work') + '-' + startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1),
        true
      ));
    });
  };
  const starts = buildRangePoint('start');
  const ends = buildRangePoint('end');

  const [hasCaption, caption] = getCaption({
    starts, ends, applicableBrowseFieldNames, heading
  });
  const showInterlinTitles = $pRaw('interlintitle') === '1';

  console.log('rand', lParamRaw('rand') === 'yes');

  /**
   * @param {string} v
   * @param {Integer} i
   * @returns {Integer|string}
   */
  const stripToRawFieldValue = (v, i) => {
    let val;
    if ((/^\d+$/).test(v) || fieldValueAliasRegex.test(v)) {
      val = getRawFieldValue(v);
    } else {
      const {rawFieldValueAliasMap} = applicableBrowseFieldSet[i];
      let dealiased;
      if (rawFieldValueAliasMap) {
        // Look to dealias
        const fvEntries = Object.entries(rawFieldValueAliasMap);
        if (Array.isArray(fvEntries[0][1])) {
          fvEntries.some(([key, arr]) => {
            if (/** @type {(string | number)[]} */ (arr).includes(v)) {
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

  /** @type {(string|Integer)[][]} */
  let tableData;
  let usingServerData = false;
  // Site owner may have configured to skip (e.g., testing)
  if (!skipIndexedDB &&
        // User may have refused, not yet agreed, or are visiting the
        //   results page directly where we don't ask for the permissions
        //   needed for persistent IndexedDB currently so that people can
        //   be brought to a results page without needing to agree to persist
        //   through notifications (or however)
        !noIndexedDB
  ) {
    tableData = await new Promise((resolve) => {
      // Todo: Fetch the work in code based on the non-localized `datafileName`
      const dbName = this.namespace + '-textbrowser-cache-data';
      const req = indexedDB.open(dbName);
      req.onsuccess = (e) => {
        const db = /** @type {EventTarget & {result: IDBDatabase}} */ (e.target).result;
        const storeName = 'files-to-cache-' + unlocalizedWorkName;
        const trans = db.transaction(storeName);
        const store = trans.objectStore(storeName);
        // Get among browse field sets by index number within URL params
        const index = store.index(
          'browseFields-' + applicableBrowseFieldSetName
        );

        // console.log('dbName', dbName);
        // console.log('storeName', storeName);
        // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

        const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));
        r.addEventListener(
          'success',
          /**
           * @param {Event} e
           * @returns {void}
           */
          (e) => {
            // eslint-disable-next-line prefer-destructuring -- TS
            const result =
            /** @type {EventTarget & {result: {value: (string|Integer)[]}[]}} */ (
                e.target
              ).result;
            const converted = result.map((r) => r.value);
            resolve(converted);
          }
        );
      };
    });
  } else {
    // No need for presorting in indexedDB, given indexes
    const presort = presorts[browseFieldSetIdx];
    // Given that we are not currently wishing to add complexity to
    //   our PHP code (though it is not a problem with Node.js),
    //   we retrieve the whole file and then sort where presorting is
    //   needed
    // if (presort || this.noDynamic) {
    if (this.noDynamic) {
      const {
        resolved
      } = await JsonRefs.resolveRefs(fileData.file);
      (tableData = /** @type {{data: (string|Integer)[][]}} */ (resolved).data);
      runPresort({presort, tableData, applicableBrowseFieldNames, localizedFieldNames});
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
    fieldInfo.forEach(({plugin, placement}) => {
      if (!plugin) {
        return;
      }
      tableData.forEach((tr) => {
        // Todo: We should pass on other arguments (like `meta` but on `applicableFields`)
        tr.splice(
          placement ?? 0,
          0,
          // @ts-expect-error Only used for `plugin` type?
          null // `${i}-${j}`);
        );
      });
    });
    fieldInfo.forEach(({plugin, applicableField, fieldLang, meta, metaApplicableField}, j) => {
      if (!plugin) {
        return;
      }
      const applicableFieldIdx = fieldInfo.findIndex(({field}) => {
        return field === applicableField;
      });
      // Now safe to pass (and set) `j` value as tr array expanded
      tableData.forEach((tr, i) => {
        const applicableFieldText = tr[applicableFieldIdx];
        tr[j] = (plugin.getCellData && plugin.getCellData({
          tr, tableData, i, j, applicableField, fieldInfo,
          applicableFieldIdx, applicableFieldText, fieldLang,
          getLangDir,
          meta, metaApplicableField, $p, thisObj: this
        })) || applicableFieldText;
      });
      console.log('applicableFieldIdx', applicableFieldIdx);
    });
  }

  const localeDir = getLangDir(preferredLocale);
  const fieldDirs = fieldLangs.map((langCode) => {
    if (!langCode) {
      return null;
    }
    const langDir = getLangDir(langCode);
    return langDir !== localeDir ? langDir : null;
  });

  const templateArgs = {
    tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
    escapeQuotedCSS, escapeCSS, escapeHTML,
    l, localizedFieldNames, fieldLangs, fieldDirs,
    caption, hasCaption, showInterlinTitles,
    showEmptyInterlinear: this.showEmptyInterlinear,
    showTitleOnSingleInterlinear: this.showTitleOnSingleInterlinear,
    determineEnd: determineEnd({
      applicableBrowseFieldNames,
      fieldValueAliasMap, fieldValueAliasMapPreferred,
      localizedFieldNames,
      startsRaw, endsRaw
    }),
    canonicalBrowseFieldSetName,
    getCanonicalID: getCanonicalID({
      canonicalBrowseFieldNames,
      fieldValueAliasMap, fieldValueAliasMapPreferred,
      localizedFieldNames
    }),
    getCellValue: getCellValue({
      fieldValueAliasMapPreferred, escapeColumnIndexes
      // escapeHTML
    }),
    checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
      localizedFieldNames
    }),
    interlinearSeparator: this.interlinearSeparator
  };
  return {
    fieldInfo,
    $p,
    applicableBrowseFieldSet, fieldValueAliasMapPreferred,
    workI18n, lIndexedParam, lParamRaw, browseFieldSets,
    lang, metadataObj, fileData,
    templateArgs
  };
};
