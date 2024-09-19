import {getJSON} from 'simple-get-json';

import {replaceHash, getParamsSetter, getSerializeParamsAsURL} from './utils/Params.js';
import {getMetaProp} from './utils/Metadata.js';
import {dialogs} from './utils/dialogs.js';

import Templates from './templates/index.js';

/**
 * @typedef {() => Promise<{
 *   groupName: string | Text | DocumentFragment,
 *   worksToFields: {
 *     workName: string | Text | DocumentFragment,
 *     shortcut: string,
 *     fieldAliasOrNames: (
 *       string|string[]|import('../server/main.js').LocalizationStrings
 *     )[]|undefined
 *   }[]
 * }[]>} GetFieldAliasOrNames
 */

/**
 * @typedef {(innerArg: {
 *   form: HTMLFormElement,
 *   random: {
 *     checked: boolean
 *   },
 *   checkboxes: HTMLInputElement[],
 *   type: string,
 *   fieldAliasOrNames?: string[],
 *   workName?: string,
 * }) => string} SerializeParamsAsURL
 */

/**
 * @typedef {(
 *   key: string|string[],
 *   substitutions?: Record<string, string>
 * ) => string|Text|DocumentFragment} LDirectional
 */

/**
 * @typedef {(
 *   key: string,
 *   tag: string,
 *   attr: string,
 *   atts: import('jamilih').JamilihAttributes,
 *   children?: import('jamilih').JamilihChildren
 * ) => import('jamilih').JamilihArray} LElement
 */

/**
 * @this {import('./index.js').default}
 * @param {{
 *   l: import('intl-dom').I18NCallback,
 *   languageParam: string,
 *   lang: string[],
 *   preferredLocale: string,
 *   languages: import('./utils/Languages.js').Languages,
 *   fallbackLanguages: string[],
 *   $p: import('./utils/IntlURLSearchParams.js').default
 * }} cfg
 */
export default async function workDisplay ({
  l, languageParam,
  lang, preferredLocale, languages, fallbackLanguages, $p
}) {
  const {preferencesPlugin} = this;
  const langs = this.langData.languages;

  // const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);

  const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
  const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
    ? $p.get('i18n', true) === '1'
    : prefI18n === 'true' || (
      prefI18n !== 'false' && this.localizeParamNames
    );

  const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
  const hideFormattingSection = $p.has('formatting', true)
    ? $p.get('formatting', true) === '0'
    : prefFormatting === 'true' || (
      prefFormatting !== 'false' && this.hideFormattingSection
    );

  /**
   * @this {import('./index.js').default}
   * @param {{
   *   workI18n: import('intl-dom').I18NCallback,
   *   metadataObj: import('./utils/Metadata.js').MetadataObj,
   *   getFieldAliasOrName: (field: string) => string|string[]|import('../server/main.js').LocalizationStrings,
   *   schemaItems: {title: string, type: string}[],
   *   fieldInfo: import('./utils/WorkInfo.js').FieldInfo,
   *   metadata: import('./utils/Metadata.js').Metadata,
   *   pluginsForWork: import('./utils/Plugin.js').PluginsForWork|null,
   *   groupsToWorks: {
   *     name: string | Text | DocumentFragment,
   *     workNames: (string | Text | DocumentFragment)[],
   *     shortcuts: string[]
   *   }[]
   * }} cfg
   * @returns {Promise<void>}
   */
  async function _displayWork ({
    workI18n, metadataObj, getFieldAliasOrName, schemaItems, // schemaObj,
    fieldInfo, metadata, pluginsForWork, groupsToWorks
  }) {
    const lParam = localizeParamNames
      // eslint-disable-next-line @stylistic/operator-linebreak -- TS
      ?
      /**
      * @param {string} key
      * @returns {string}
      */ (key) => /** @type {string} */ (l(['params', key]))
      // eslint-disable-next-line @stylistic/operator-linebreak -- TS
      :
      /**
       * @param {string} key
       * @returns {string}
       */
      (key) => key;
    const lIndexedParam = localizeParamNames
      // eslint-disable-next-line @stylistic/operator-linebreak -- TS
      ?
      /**
       * @param {string} key
       * @returns {string}
       */
      (key) => /** @type {string} */ (l(['params', 'indexed', key]))
      // eslint-disable-next-line @stylistic/operator-linebreak -- TS
      :
      /**
       * @param {string} key
       * @returns {string}
       */
      (key) => key;

    // Returns element with localized option text (as Jamilih), with
    //   optional fallback direction
    /**
     * @type {LElement}
     */
    const lElement = (key, el, attToLocalize, atts, children = []) => {
      atts[attToLocalize] = l(
        key
        // Restore this if `intl-dom` supports
        // fallback ({message}) {
        //   atts.dir = fallbackDirection;
        //   return message;
        // }
      );
      return [el, atts, children];
    };

    // Returns plain text node or element (as Jamilih) with fallback direction

    /**
     * @type {LDirectional}
     */
    const lDirectional = (key, substitutions) => l(
      key,
      substitutions
      // formats
      // Restore if `intl-dom` supports
      // fallback: ({message}) =>
      //   Templates.workDisplay.bdo({fallbackDirection, message})
    );

    const fieldMatchesLocale = metadata.getFieldMatchesLocale({
      namespace: this.namespace,
      preferredLocale, schemaItems,
      // eslint-disable-next-line object-shorthand -- TS
      pluginsForWork: /** @type {import('./utils/Plugin.js').PluginsForWork} */ (
        pluginsForWork
      )
    });

    /** @type {import('jamilih').JamilihArray[]} */
    const content = [];
    this.getBrowseFieldData({
      metadataObj, schemaItems, getFieldAliasOrName,
      callback ({browseFields, i}) {
        Templates.workDisplay.addBrowseFields({
          browseFields,
          fieldInfo,
          lDirectional, i, lIndexedParam, $p, content
        });
      }
    });

    /*
      Templates.workDisplay.addRandomFormFields({
          lParam, l, lDirectional, lElement, $p, serializeParamsAsURL, content
      });
    */
    const serializeParamsAsURL = getSerializeParamsAsURL({l, lParam, $p});
    const paramsSetter = getParamsSetter({l, lParam, $p});

    const {groups} = /** @type {import('./utils/WorkInfo.js').FilesObject} */ (
      await getJSON(this.files)
    );

    // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
    const heading = /** @type {string} */ (
      getMetaProp(lang, metadataObj, 'heading')
    );

    const getFieldAliasOrNames = (() => {
      // Avoid blocking but start now
      // Let this run in the background to avoid blocking
      const all = Promise.all(
        groupsToWorks.map(async ({name, workNames, shortcuts}) => {
          const worksToFields = await Promise.all(workNames.map(async (workName, i) => {
            return {
              workName, shortcut: shortcuts[i],
              fieldAliasOrNames: (
                await this.getWorkData({
                  lang, fallbackLanguages, preferredLocale,
                  languages, work: /** @type {string} */ (workName)
                })
              )?.fieldInfo?.map(({fieldAliasOrName}) => fieldAliasOrName)
            };
          }));
          return {
            groupName: name,
            worksToFields
          };
        })
      );
      return async () => {
        return all; // May not be finished by now
      };
    })();

    const displayNames = new Intl.DisplayNames(
      [...lang, ...fallbackLanguages],
      {
        type: 'language',
        // Dialect: "American English"
        // Standard: "English (United States)"
        languageDisplay: 'standard' // 'dialect'
      }
    );

    /**
     * @param {string} code
     */
    const languageI18n = (code) => {
      return /** @type {string} */ (displayNames.of(code));
    };

    Templates.workDisplay.main({
      languageParam,
      // lang,
      workI18n,
      l, namespace: this.namespace, groups, heading,
      languageI18n,
      // fallbackDirection,
      langs, fieldInfo, localizeParamNames,
      serializeParamsAsURL, paramsSetter, replaceHash,
      getFieldAliasOrNames,
      hideFormattingSection, $p,
      metadataObj, lParam, lElement, lDirectional, lIndexedParam,
      fieldMatchesLocale,
      preferredLocale, schemaItems,
      content,
      preferencesPlugin
    });
  }

  try {
    const {workI18n, fileData, metadataObj, ...args} =
      /** @type {import('./utils/WorkInfo.js').GetWorkDataReturn} */ (
        await this.getWorkData({
          lang, fallbackLanguages, preferredLocale,
          languages,
          work: /** @type {string} */ ($p.get('work'))
        }));

    document.title = /** @type {string} */ (workI18n(
      'browserfile-workdisplay',
      {
        work: fileData
          ? /** @type {string} */ (getMetaProp(lang, metadataObj, 'alias'))
          : ''
      }
    ));
    await _displayWork.call(this, {workI18n, metadataObj, ...args});
  } catch (error) {
    const err = /** @type {Error} */ (error);
    console.log('err', err);
    dialogs.alert(err);
  }
}
