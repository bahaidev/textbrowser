/* globals process -- Node polyglot */
import {getJSON} from 'simple-get-json';
import {i18n} from 'intl-dom';
import {getMetaProp, getMetadata, Metadata} from './Metadata.js';
import {PluginsForWork, escapePlugin} from './Plugin.js';

/**
 * @typedef {number} Integer
 */

/**
 * @typedef {{
 *   field: string,
 *   fieldAliasOrName: string | string[] | import('../../server/main.js').LocalizationStrings,
 *   onByDefault?: boolean,
 *   applicableField?: string,
 *   metaApplicableField?: {
 *     [key: string]: string
 *   },
 *   fieldLang?: string
 * }[]} FieldInfo
 */

/**
 * @typedef {{
 *   schema: {$ref: string},
 *   metadata: {$ref: string},
 *   data: (Integer|string)[]
 * }} WorkTableContainer
 */

/**
 * @typedef {{
 *   file: {
 *     $ref: string
 *   },
 *   schemaFile: string,
 *   metadataFile: string,
 *   name: string,
 *   shortcut: string
 * }} FileData
 */

/**
 * @typedef {{
 *   id: string,
 *   name: {
 *     localeKey: "string"
 *   },
 *   files: FileData[],
 *   baseDirectory?: string,
 *   schemaBaseDirectory?: string,
 *   metadataBaseDirectory?: string,
 *   directions: {
 *     localeKey: "string"
 *   }
 * }} FileGroup
 */

/**
 * INCOMPLETE typing.
 * @typedef {{
 *   "localization-strings": {
 *     [key: string]: {}
 *   }
 *   groups: FileGroup[],
 *   plugins: {[key: string]: import('./Plugin.js').PluginInfo},
 *   baseDirectory?: string,
 *   schemaBaseDirectory?: string,
 *   metadataBaseDirectory?: string,
 *   'plugin-field-mapping': PluginFieldMapping
 * }} FilesObject
 */

/**
 * @typedef {{
*   [groups: string]: {
*     [works: string]: {
*       [fields: string]: import('./Plugin.js').PluginFieldMappingForWork
*     }
*   }
* }} PluginFieldMapping
*/

/**
 * Imported by the `dist/sw-helper.js`
 * @param {string} files The files.json file path
 * @returns {Promise<string[]>}
 */
export const getWorkFiles = async function getWorkFiles (files) {
  const filesObj = /** @type {FilesObject} */ (await getJSON(files));
  const dataFiles = /** @type {string[]} */ ([]);
  filesObj.groups.forEach((fileGroup) => {
    fileGroup.files.forEach((fileData) => {
      const {file, schemaFile, metadataFile} =
        getFilePaths(filesObj, fileGroup, fileData);
      dataFiles.push(file, schemaFile, metadataFile);
    });
  });
  dataFiles.push(
    ...Object.values(filesObj.plugins).map((pl) => pl.path)
  );
  return dataFiles;
};

/**
 * @param {FilesObject} filesObj
 * @param {FileGroup} fileGroup
 * @param {FileData} fileData
 */
export const getFilePaths = function getFilePaths (filesObj, fileGroup, fileData) {
  const baseDir = (filesObj.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
  const schemaBaseDir = (filesObj.schemaBaseDirectory || '') +
        (fileGroup.schemaBaseDirectory || '') + '/';
  const metadataBaseDir = (filesObj.metadataBaseDirectory || '') +
        (fileGroup.metadataBaseDirectory || '') + '/';

  const file = baseDir + fileData.file.$ref;
  const schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
  const metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';
  return {file, schemaFile, metadataFile};
};

/**
 * @typedef {{
 *   lang: string[],
 *   fallbackLanguages: string[]|undefined,
 *   work: string,
 *   files: string,
 *   allowPlugins: boolean|undefined,
 *   basePath?: string,
 *   languages: import('./Languages.js').Languages,
 *   preferredLocale: string
 * }} GetWorkDataOptions
 */

/**
 * @typedef {{
 *   fileData: FileData,
 *   workI18n: import('intl-dom').I18NCallback,
 *   getFieldAliasOrName: (field: string) => string|string[]|import('../../server/main.js').LocalizationStrings,
 *   metadataObj: import('./Metadata.js').MetadataObj,
 *   schemaObj: import('./Metadata.js').SchemaObj,
 *   schemaItems: { title: string, type: string }[],
 *   fieldInfo: FieldInfo,
 *   pluginsForWork: PluginsForWork|null,
 *   groupsToWorks: {
 *     name: string | Text | DocumentFragment,
 *     workNames: (string | Text | DocumentFragment)[],
 *     shortcuts: string[]
 *   }[],
 *   metadata: Metadata
 * }} GetWorkDataReturn
 */

/**
 * @this {import('../index.js').default}
 * @param {GetWorkDataOptions} cfg
 * @returns {Promise<GetWorkDataReturn>}
 */
export const getWorkData = async function ({
  lang, fallbackLanguages, work, files, allowPlugins, basePath,
  languages, preferredLocale
}) {
  const filesObj = /** @type {FilesObject} */ (await getJSON(files));
  const localizationStrings =
    /**
     * @type {{
     *   "localization-strings": {
     *     [key: string]: {}
     *   }
     * }}
     */ (
      filesObj
    )?.['localization-strings'];

  const workI18n = await i18n({
    messageStyle: 'plainNested',
    locales: lang,
    defaultLocales: fallbackLanguages,
    // Todo: Could at least share this with `index.js`
    async localeStringFinder ({
      locales, defaultLocales
    } = {}) {
      const locale = [
        ...(/** @type {string[]} */ (locales)),
        ...(/** @type {string[]} */ (defaultLocales))
      ].find((language) => {
        return language in localizationStrings;
      });
      return {
        // eslint-disable-next-line object-shorthand -- TS
        locale: /** @type {string} */ (locale),
        strings: {
          head: {},
          body: localizationStrings[/** @type {string} */ (locale)]
        }
      };
    }
  });

  /** @type {FileData} */
  let fileData;
  const fileGroup = /** @type {FileGroup} */ (filesObj.groups.find((fg) => {
    fileData = /** @type {FileData} */ (fg.files.find((file) => {
      return work === workI18n(['workNames', fg.id, file.name]);
    }));
    return Boolean(fileData);
  }));
    // This is not specific to the work, but we export it anyways
  const groupsToWorks = filesObj.groups.map((fg) => {
    return {
      name: workI18n(fg.name.localeKey),
      workNames: fg.files.map((file) => {
        return workI18n(['workNames', fg.id, file.name]);
      }),
      shortcuts: fg.files.map((file) => file.shortcut)
    };
  });

  // @ts-expect-error Ok
  const fp = getFilePaths(filesObj, fileGroup, fileData);
  const {file} = fp;
  let {schemaFile, metadataFile} = fp;

  let schemaProperty = '', metadataProperty = '';

  if (!schemaFile) {
    schemaFile = file;
    schemaProperty = 'schema';
  }
  if (!metadataFile) {
    metadataFile = file;
    metadataProperty = 'metadata';
  }

  let getPlugins;
  /**
   * @type {[string, import('./Plugin.js').PluginInfo][]}
   */
  let pluginsInWork;

  /** @type {string[]} */
  let pluginPaths = [];
  /** @type {string[]} */
  let pluginFieldsForWork;

  /**
   * @type {import('./Plugin.js').PluginFieldMappingForWork[]}
   */
  let pluginFieldMappingForWork = [];
  if (allowPlugins) {
    const pluginFieldMapping = filesObj['plugin-field-mapping'];
    const pluginFieldMappingID = pluginFieldMapping[fileGroup.id];
    const possiblePluginFieldMappingForWork = pluginFieldMappingID[
      // @ts-expect-error Ok
      (fileData).name
    ];
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
  const metadataObj = /** @type {import('./Metadata.js').MetadataObj} */ (
    await getMetadata(metadataFile, metadataProperty, basePath)
  );
  /**
   * @param {string} field
   */
  const getFieldAliasOrName = function getFieldAliasOrName (field) {
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
    } else { // No alias
      fieldName = fieldObj.name;
      if (typeof fieldName === 'object') {
        fieldName = fieldName.localeKey;
        fieldName = getMetaProp(lang, metadataObj, fieldName.split('/'));
      }
    }
    return fieldName;
  };
  const pluginFieldMappings = pluginFieldMappingForWork;

  const cwd = (typeof process === 'undefined'
    ? location.href.slice(0, location.href.lastIndexOf('/') + 1)
    : process.cwd() + '/'
  );

  const schemaAndPluginObjects = await Promise.all([
    getMetadata(schemaFile, schemaProperty, basePath),
    getPlugins
      ? Promise.all(
        pluginPaths.map(async (pluginPath) => {
          // // eslint-disable-next-line no-unsanitized/method
          return /** @type {import('./Plugin.js').PluginObject} */ await (import(
            cwd +
            pluginPath
          ));
        })
      )
      : null
  ]);

  const schemaObj = /** @type {import('./Metadata.js').SchemaObj} */ (
    schemaAndPluginObjects[0]
  );
  const pluginObjects = schemaAndPluginObjects[1];

  const pluginsForWork = pluginObjects
    ? new PluginsForWork({
      // @ts-expect-error Ok
      pluginsInWork,
      pluginFieldMappings,
      pluginObjects
    })
    : null;
  const schemaItems = schemaObj.items.items;

  /** @type {FieldInfo} */
  const fieldInfo = schemaItems.map(({title: field}) => {
    return {
      field,
      fieldAliasOrName: getFieldAliasOrName(field) || field
    };
  });
  const metadata = new Metadata({metadataObj});
  if (languages && // Avoid all this processing if this is not the specific call requiring
        pluginsForWork
  ) {
    console.log('pluginsForWork', pluginsForWork);
    const {lang, namespace} = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      // plugin,
      pluginName, pluginLang,
      onByDefaultDefault,
      placement, applicableFields, meta
    }) => {
      /**
       * @param {{
       *   applicableField?: string,
       *   targetLanguage?: string,
       *   onByDefault?: boolean,
       *   metaApplicableField?: {
       *     [key: string]: string
       *   }
       * }} [cfg]
       */
      const processField = ({
        applicableField, targetLanguage, onByDefault, metaApplicableField
      } = {}) => {
        const plugin = pluginsForWork.getPluginObject(pluginName) || {};
        const applicableFieldLang = metadata.getFieldLang(
          /** @type {string} */
          (applicableField)
        );
        if (plugin.getTargetLanguage) {
          targetLanguage = plugin.getTargetLanguage({
            // eslint-disable-next-line object-shorthand -- TS
            applicableField: /** @type {string} */ (applicableField),
            // eslint-disable-next-line object-shorthand -- TS
            targetLanguage: /** @type {string} */ (targetLanguage),
            // Default lang for plug-in (from files.json)
            pluginLang,
            // Default lang when no target language or
            //   plugin lang; using the lang of the applicable
            //   field
            // eslint-disable-next-line object-shorthand -- TS
            applicableFieldLang: /** @type {string} */ (applicableFieldLang)
          });
        }
        const field = escapePlugin({
          pluginName,
          // eslint-disable-next-line object-shorthand -- TS
          applicableField: /** @type {string} */ (applicableField),
          targetLanguage: /** @type {string} */ (targetLanguage || pluginLang ||
                        applicableFieldLang)
        });
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        const applicableFieldI18N = getMetaProp(
          lang, metadataObj, ['fieldnames', /** @type {string} */ (applicableField)]
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
            metaApplicableField:
            /**
             * @type {{
             *   [key: string]: string
             * }}
             */ (metaApplicableField),
            targetLanguageI18N: languages.getLanguageFromCode(
              /** @type {string} */
              (targetLanguage)
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
            metaApplicableField:
            /**
             * @type {{
             *   [key: string]: string
             * }}
             */ (metaApplicableField)
          });
        fieldInfo.splice(
          // Todo: Allow default placement overriding for
          //    non-plugins
          placement === 'end'
            ? Number.POSITIVE_INFINITY // push
            : placement,
          0,
          {
            field: `${namespace}-plugin-${field}`,
            fieldAliasOrName,
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
            fieldLang: targetLanguage
          }
        );
      };
      if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
        processField();
      }
    });
  }
  return {
    // @ts-expect-error Ok
    // eslint-disable-next-line object-shorthand -- TS
    fileData: /** @type {FileData} */ (fileData),
    workI18n, getFieldAliasOrName, metadataObj,
    schemaObj, schemaItems, fieldInfo,
    pluginsForWork, groupsToWorks, metadata
  };
};
