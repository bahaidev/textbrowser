import {getPreferredLanguages} from './Languages.js';
// Keep this as the last import for Rollup
import JsonRefs from 'json-refs'; // // eslint-disable-line import/order

const getCurrDir = () => {
  return window.location.href.replace(/(index\.html)?#.*$/, '');
};

/**
 * @typedef {{
 *   [key: string]: string|Integer|(string|Integer)[]|{
 *     [key: string]: string|Integer
 *   }
 * }} FieldValueAliases
 */

/**
 * @typedef {{
 *   "localization-strings": import('../../server/main.js').LocalizationStrings
 *   table: {browse_fields: (string|{
 *     name?: string,
 *     set: string[],
 *     presort?: boolean
 *   })[]}
 *   fields: {
 *     [key: string]: {
 *       prefer_alias: boolean|string,
 *       name: string|{localeKey: string},
 *       alias: string|{localeKey: string},
 *       lang: string,
 *       'fieldvalue-aliases': FieldValueAliases
 *     }
 *   }
* }} MetadataObj
 */

/**
 * @param {string[]} lang
 * @param {MetadataObj} metadataObj
 * @param {string|string[]} properties
 * @param {boolean} [allowObjects]
 * @returns {string|string[]|import('../../server/main.js').LocalizationStrings}
 */
export const getMetaProp = function getMetaProp (lang, metadataObj, properties, allowObjects) {
  let prop;
  properties = typeof properties === 'string' ? [properties] : properties;
  for (const lan of lang) {
    const p = [...properties];
    let strings = /** @type {string|string[]|import('../../server/main.js').LocalizationStrings} */ (
      metadataObj['localization-strings'][lan]
    );
    while (strings && p.length) {
      strings = /** @type {import('../../server/main.js').LocalizationStrings} */ (
        strings
      )[/** @type {string} */ (p.shift())];
    }
    // Todo: Fix this allowance for allowObjects (as it does not properly
    //        fallback if an object is returned from a language because
    //        that language is missing content and is only thus returning
    //        an object)
    prop = (allowObjects || typeof strings === 'string')
      ? strings
      : undefined;
    if (prop) {
      break;
    }
  }
  return /** @type {string|string[]|import('../../server/main.js').LocalizationStrings} */ (
    prop
  );
};

// Use the following to dynamically add specific file schema in place of
//    generic table schema if validating against files.jsonschema
//  filesSchema.properties.groups.items.properties.files.items.properties.
//      file.anyOf.splice(1, 1, {$ref: schemaFile});
// Todo: Allow use of dbs and fileGroup together in base directories?

/**
 * @typedef {{
 *   items: {
 *     items: {
 *       title: string,
 *       type: string
 *       format?: string
 *     }[]
 *   }
 * }} SchemaObj
 */

/**
 * @param {string} file
 * @param {string} property
 * @param {string} [basePath]
 * @returns {Promise<MetadataObj|SchemaObj>}
 */
export const getMetadata = async (file, property, basePath) => {
  const url = new URL(basePath || getCurrDir());
  url.search = ''; // Clear out query string, e.g., `?fbclid` from Facebook
  url.pathname = file;
  url.hash = property ? '#/' + property : '';

  return /** @type {MetadataObj} */ ((await JsonRefs.
    resolveRefsAt(
      url.toString(),
      {
        loaderOptions: {
          /**
           * @param {{
           *   text: string,
           *   body: any
           * }} res
           * @param {(err?: Error, cbValue: any) => void} callback
           */
          processContent (res, callback) {
            callback(undefined, JSON.parse(
              res.text ||
                            // `.metadata` not a recognized extension, so
                            //    convert to string for JSON in Node
                            res.body.toString()
            ));
          }
        }
      }
    )).resolved);
};

/**
 * @typedef {{
 *   field: string,
 *   schemaItems: {
 *     title: string,
 *     type: string,
 *     enum?: string[]
 *   }[],
 *   metadataObj: MetadataObj,
 *   getFieldAliasOrName: (field: string) => string|string[]|import('../../server/main.js').LocalizationStrings,
 *   lang: string[]
 * }} GetFieldNameAndValueAliasesOptions
 */

/**
 * @param {GetFieldNameAndValueAliasesOptions} cfg
 * @returns {{
 *   aliases: string[]|null,
 *   fieldValueAliasMap: FieldValueAliases|null,
 *   rawFieldValueAliasMap: FieldValueAliases|null,
 *   fieldName: string,
 *   fieldSchema: {
 *     title: string,
 *     type: string
 *   },
 *   fieldSchemaIndex: number,
 *   preferAlias: boolean|string,
 *   lang: string
 * }}
 */
export const getFieldNameAndValueAliases = function ({
  field, schemaItems, metadataObj, getFieldAliasOrName, lang
}) {
  const fieldSchemaIndex = schemaItems.findIndex((item) => {
    return item.title === field;
  });
  const fieldSchema = schemaItems[fieldSchemaIndex];

  const fieldInfo = metadataObj.fields[field];

  /**
   * @type {{
   *   aliases: string[]|null,
   *   fieldValueAliasMap: FieldValueAliases|null,
   *   rawFieldValueAliasMap: FieldValueAliases|null,
   *   fieldName: string,
   *   fieldSchema: {
   *     title: string,
   *     type: string
   *   },
   *   fieldSchemaIndex: number,
   *   preferAlias: boolean|string,
   *   lang: string
   * }}
   */
  const ret = {
    // field,
    aliases: null,
    fieldValueAliasMap: null,
    rawFieldValueAliasMap: null,
    fieldName: /** @type {string} */ (getFieldAliasOrName(field)),
    fieldSchema,
    fieldSchemaIndex,
    preferAlias: fieldInfo.prefer_alias,
    lang: fieldInfo.lang
  };

  /** @type {FieldValueAliases} */
  let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];

  if (fieldValueAliasMap) {
    if (fieldValueAliasMap.localeKey) {
      fieldValueAliasMap = /** @type {FieldValueAliases} */ (
        getMetaProp(
          lang,
          metadataObj,
          /** @type {string} */
          (fieldValueAliasMap.localeKey).split('/'),
          true
        )
      );
    }
    // eslint-disable-next-line unicorn/prefer-structured-clone -- Expecting JSON
    ret.rawFieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
    ret.aliases = [];
    // Todo: We could use `prefer_alias` but algorithm below may cover
    //    needed cases
    if (fieldSchema.enum && fieldSchema.enum.length) {
      fieldSchema.enum.forEach((enm) => {
        /** @type {string[]} */
        (ret.aliases).push(
          /** @type {string} */ (
            getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true)
          )
        );
        if (enm in fieldValueAliasMap &&
                    // Todo: We could allow numbers here too, but crowds
                    //         pull-down
                    typeof fieldValueAliasMap[enm] === 'string') {
          /** @type {string[]} */
          (ret.aliases).push(...fieldValueAliasMap[enm]);
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
          aliases = /** @type {string[]} */ (
            Object.values(/** @type {import('../../server/main.js').LocalizationStrings} */ (
              aliases
            ))
          );
        }
        // We'll assume the longest version is best for auto-complete
        /** @type {string[]} */
        (ret.aliases).push(
          ...(
            aliases.filter((v) => {
              return aliases.every((x) => {
                return x === v || !(
                  /** @type {string} */
                  (x).toLowerCase().startsWith(
                    /** @type {string} */
                    (v).toLowerCase()
                  )
                );
              });
            }).map((v) => v + ' (' + key + ')') // Todo: i18nize
          )
        );
      });
    }
    // eslint-disable-next-line unicorn/prefer-structured-clone -- Expecting JSON
    ret.fieldValueAliasMap = /** @type {FieldValueAliases} */ (JSON.parse(JSON.stringify(fieldValueAliasMap)));
    // ret.aliases.sort();
  }
  return ret;
};

/**
 * @typedef {number} Integer
 */

/**
 * @typedef {{
 *   aliases: string[]|null,
 *   fieldValueAliasMap: FieldValueAliases|null,
 *   rawFieldValueAliasMap: FieldValueAliases|null,
 *   fieldName: string,
 *   fieldSchema: {
 *     title: string,
 *     type: string,
 *     minimum?: Integer,
 *     maximum?: Integer
 *   },
 *   fieldSchemaIndex: number,
 *   preferAlias: boolean|string,
 *   lang: string
 * }[]} BrowseFields
 */

/**
 * @typedef {{
 *   metadataObj: MetadataObj,
 *   schemaItems: {
 *     title: string,
 *     type: string
 *   }[],
 *   getFieldAliasOrName: (field: string) => string|string[]|import('../../server/main.js').LocalizationStrings,
 *   lang: string[],
 *   callback: (cfg: {
 *     setName: string,
 *     browseFields: BrowseFields,
 *     i: number,
 *     presort: boolean|undefined
 *   }) => void
 * }} GetBrowseFieldDataOptions
 */

/**
 * @param {GetBrowseFieldDataOptions} cfg
 */
export const getBrowseFieldData = function ({
  metadataObj, schemaItems, getFieldAliasOrName, lang, callback
}) {
  metadataObj.table.browse_fields.forEach((browseFieldSetObject, i) => {
    if (typeof browseFieldSetObject === 'string') {
      browseFieldSetObject = {set: [browseFieldSetObject]};
    }
    if (!browseFieldSetObject.name) {
      browseFieldSetObject.name = browseFieldSetObject.set.join(',');
    }

    const setName = browseFieldSetObject.name;
    const fieldSets = browseFieldSetObject.set;
    const {presort} = browseFieldSetObject;
    // Todo: Deal with ['td', [['h3', [lDirectional(browseFieldObject.name)]]]]
    //          as kind of fieldset

    const browseFields = fieldSets.map((field) => {
      return getFieldNameAndValueAliases({
        lang,
        field, schemaItems, metadataObj,
        getFieldAliasOrName
      });
    });
    callback({setName, browseFields, i, presort});
  });
};

// Todo: Incorporate other methods into this class
export class Metadata {
  /**
   * @param {{
   *   metadataObj: MetadataObj
   * }} cfg
   */
  constructor ({metadataObj}) {
    this.metadataObj = metadataObj;
  }

  /**
   * @param {string} field
   * @returns {string|undefined}
   */
  getFieldLang (field) {
    const {metadataObj} = this;
    const fields = metadataObj && metadataObj.fields;
    return fields && fields[field] && fields[field].lang;
  }

  /**
   * @param {{
   *   namespace: string,
   *   preferredLocale: string,
   *   schemaItems: {
   *     title: string,
   *     type: string
   *   }[],
   *   pluginsForWork: import('./Plugin.js').PluginsForWork
   * }} cfg
   * @returns {(field: string) => boolean}
   */
  getFieldMatchesLocale ({
    namespace, preferredLocale, schemaItems,
    pluginsForWork
  }) {
    const {metadataObj} = this;
    return (field) => {
      const preferredLanguages = getPreferredLanguages({
        namespace, preferredLocale
      });
      if (pluginsForWork.isPluginField({namespace, field})) {
        let [, , targetLanguage] = pluginsForWork.getPluginFieldParts({namespace, field});
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        return !targetLanguage ||
                    preferredLanguages.includes(targetLanguage);
      }
      const metaLang = this.getFieldLang(field);
      const localeStrings = metadataObj &&
                metadataObj['localization-strings'];

      // If this is a localized field (e.g., enum), we don't want
      //  to avoid as may be translated (should check though)
      const hasFieldValue = localeStrings &&
                Object.keys(localeStrings).some((lng) => {
                  const fv = localeStrings[lng] &&
                        /** @type {import('../../server/main.js').LocalizationStrings} */
                        (/** @type {import('../../server/main.js').LocalizationStrings} */
                          (localeStrings[lng]).fieldvalue);
                  return fv && fv[field];
                });

      return hasFieldValue ||
                (metaLang && preferredLanguages.includes(metaLang)) ||
                schemaItems.some((item) => {
                  return item.title === field && item.type !== 'string';
                });
    };
  }
}
