/**
 * @typedef {number} Integer
 */

/**
 * @param {string} pluginName
 */
export const escapePluginComponent = (pluginName) => {
  return pluginName.replaceAll('^', '^^'). // Escape our escape
    replaceAll('-', '^0');
};

/**
 * @param {string|undefined} pluginName
 */
export const unescapePluginComponent = (pluginName) => {
  if (!pluginName) {
    return pluginName;
  }
  return pluginName.replaceAll(
    /(\^+)0/g,
    (n0, esc) => {
      return esc.length % 2
        ? esc.slice(1) + '-'
        : n0;
    }
  ).replaceAll('^^', '^');
};

/**
 * @param {{
 *   pluginName: string,
 *   applicableField: string,
 *   targetLanguage: string
 * }} cfg
 */
export const escapePlugin = ({pluginName, applicableField, targetLanguage}) => {
  return escapePluginComponent(pluginName) +
        (applicableField ? '-' + escapePluginComponent(applicableField) : '-') +
        (targetLanguage ? '-' + escapePluginComponent(targetLanguage) : '');
};

/* eslint-disable jsdoc/reject-any-type -- How to resolve? */
/**
 * @typedef {any} MetaValue
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */

/**
 * @todo Complete
 * @typedef {{
 *   path: string,
 *   onByDefault?: boolean,
 *   lang?: string,
 *   meta?: {[key: string]: string}
 *   getCellData?: (info: {
 *     tr: (string|Integer)[],
 *     tableData: (string|Integer)[][],
 *     i: number,
 *     j: number,
 *     applicableField?: string,
 *     fieldInfo: import('../resultsDisplay.js').FieldInfo,
 *     applicableFieldIdx: number,
 *     applicableFieldText: string|Integer,
 *     fieldLang: string,
 *     getLangDir: (locale: string) => string,
 *     meta: {
 *       [key: string]: string
 *     }|undefined,
 *     metaApplicableField?: {
 *       [key: string]: string
 *     },
 *     $p: import('./IntlURLSearchParams.js').default,
 *     thisObj: import('../index.js').default|import('../../server/main.js').ResultsDisplayServerContext
 *   }) => string|Integer,
 *   done: (info: {
 *     $p: import('./IntlURLSearchParams.js').default,
 *     applicableField: string|undefined,
 *     meta?: {[key: string]: string}
 *     thisObj: import('../index.js').default
 *     j?: number
 *   }) => void,
 *   getTargetLanguage: (info: {
 *     applicableField: string,
 *     targetLanguage?: string,
 *     pluginLang: string,
 *     applicableFieldLang?: string
 *   }) => string,
 *   escapeColumn?: boolean,
 *   getFieldAliasOrName: (info: {
 *     locales: string[],
 *     workI18n: import('intl-dom').I18NCallback,
 *     targetLanguage: string,
 *     applicableField: string,
 *     applicableFieldI18N: string|string[]|import("../../server/main.js").LocalizationStrings,
 *     meta: MetaValue,
 *     metaApplicableField: {
 *       [key: string]: string
 *     },
 *     targetLanguageI18N: string
 *   }) => string
 * }} PluginObject
 */

/**
 * @typedef {{
 *   path: string,
 *   lang: string,
 *   meta: MetaValue,
 *   onByDefault: boolean
 * }} PluginInfo
 */

/**
 * @typedef {{
 *   placement: "end"|number,
 *   'applicable-fields': {
 *     [field: string]: {
 *       targetLanguage: string|string[],
 *       onByDefault: boolean,
 *       meta: {
 *         [key: string]: string
 *       },
 *       [args: string]: {}
 *     }
 *   },
 *   [fieldArgs: string]: {
 *   }
 * }} PluginFieldMappingForWork
 */

export class PluginsForWork {
  /**
   * @param {{
   *   pluginsInWork: [string, PluginInfo][],
   *   pluginFieldMappings: PluginFieldMappingForWork[],
   *   pluginObjects: PluginObject[]
   * }} cfg
   */
  constructor ({pluginsInWork, pluginFieldMappings, pluginObjects}) {
    this.pluginsInWork = pluginsInWork;
    this.pluginFieldMappings = pluginFieldMappings;
    this.pluginObjects = pluginObjects;
  }

  /**
   * @param {string} pluginName
   * @returns {PluginObject}
   */
  getPluginObject (pluginName) {
    const idx = this.pluginsInWork.findIndex(([name]) => {
      return name === pluginName;
    });
    const plugin = this.pluginObjects[idx];
    return plugin;
  }

  /**
   * @param {(cfg: {
   *   plugin: PluginObject,
   *   placement: "end"|number,
   *   applicableFields: {
   *     [applicableField: string]: {
   *       targetLanguage: string|string[],
   *       onByDefault: boolean,
   *       meta: MetaValue
   *     }
   *   },
   *   pluginName: string,
   *   pluginLang: string,
   *   onByDefaultDefault: boolean,
   *   meta: {}
   * }) => void} cb
   * @returns {void}
   */
  iterateMappings (cb) {
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
        onByDefault: onByDefaultDefault, lang: pluginLang, meta
      }] = this.pluginsInWork[i];
      const plugin = this.getPluginObject(pluginName);
      cb({
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

  /**
   * @param {{
   *   [applicableField: string]: {
   *     targetLanguage: string|string[],
   *     onByDefault: boolean,
   *     meta: MetaValue
   *   }
   * }} applicableFields
   * @param {(cfg: {
   *   applicableField: string,
   *   targetLanguage: string,
   *   onByDefault: boolean,
   *   metaApplicableField: {
   *     [key: string]: string
   *   }
   * }) => void} cb
   * @returns {boolean}
   */
  processTargetLanguages (applicableFields, cb) {
    if (!applicableFields) {
      return false;
    }
    Object.entries(applicableFields).forEach(([applicableField, {
      targetLanguage, onByDefault, meta: metaApplicableField
    }]) => {
      if (Array.isArray(targetLanguage)) {
        targetLanguage.forEach((targetLanguage) => {
          cb({applicableField, targetLanguage, onByDefault, metaApplicableField});
        });
      } else {
        cb({applicableField, targetLanguage, onByDefault, metaApplicableField});
      }
    });
    return true;
  }

  /**
   * @param {{
   *   namespace: string,
   *   field: string
   * }} cfg
   * @returns {boolean}
   */
  isPluginField ({namespace, field}) {
    return field.startsWith(`${namespace}-plugin-`);
  }

  /**
   * @param {{
   *   namespace: string,
   *   field: string
   * }} cfg
   * @returns {[string, string|undefined, string|undefined]}
   */
  getPluginFieldParts ({namespace, field}) {
    field = field.replace(`${namespace}-plugin-`, '');
    let pluginName, applicableField, targetLanguage;
    if (field.includes('-')) {
      ([pluginName, applicableField, targetLanguage] = field.split('-'));
    } else {
      pluginName = field;
    }
    return /** @type {[string, string|undefined, string|undefined]} */ (
      [pluginName, applicableField, targetLanguage].map(unescapePluginComponent)
    );
  }
}
