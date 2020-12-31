import {getJSON} from 'simple-get-json';
import IMF from 'imf';
import {getMetaProp, getMetadata, Metadata} from './Metadata.js';
import {PluginsForWork, escapePlugin} from './Plugin.js';

let path, babelRegister;
if (typeof process !== 'undefined') {
  /* eslint-disable node/global-require */
  path = require('path');
  babelRegister = require('@babel/register');
  /* eslint-enable node/global-require */
}

export const getWorkFiles = async function getWorkFiles (files = this.files) {
  const filesObj = await getJSON(files);
  const dataFiles = [];
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

export const getWorkData = async function ({
  lang, fallbackLanguages, work, files, allowPlugins, basePath,
  languages, preferredLocale
}) {
  const filesObj = await getJSON(files);
  const localeFromFileData = (lan) =>
    filesObj['localization-strings'][lan];
  const imfFile = IMF({
    locales: lang.map(localeFromFileData),
    fallbackLocales: fallbackLanguages.map(localeFromFileData)
  });
  const lf = imfFile.getFormatter();

  let fileData;
  const fileGroup = filesObj.groups.find((fg) => {
    fileData = fg.files.find((file) =>
      work === lf(['workNames', fg.id, file.name])
    );
    return Boolean(fileData);
  });
    // This is not specific to the work, but we export it anyways
  const groupsToWorks = filesObj.groups.map((fg) => {
    return {
      name: lf({key: fg.name.localeKey, fallback: true}),
      workNames: fg.files.map((file) => {
        return lf(['workNames', fg.id, file.name]);
      }),
      shortcuts: fg.files.map((file) => file.shortcut)
    };
  });

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

  let getPlugins, pluginsInWork, pluginFieldsForWork,
    pluginPaths, pluginFieldMappingForWork = [];
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

  const [schemaObj, pluginObjects] = await Promise.all([
    getMetadata(schemaFile, schemaProperty, basePath),
    getPlugins
      ? Promise.all(
        pluginPaths.map((pluginPath) => {
          if (typeof process !== 'undefined') {
            pluginPath = path.resolve(path.join(
              process.cwd(), 'node_modules/textbrowser/server', pluginPath
            ));
            babelRegister({
              presets: ['@babel/env']
            });
            return Promise.resolve().then(() => {
              return require(pluginPath); // eslint-disable-line node/global-require, import/no-dynamic-require
            }).catch((err) => {
              // E.g., with tooltips plugin
              console.log('err', err);
            });
          }
          // eslint-disable-next-line node/no-unsupported-features/es-syntax, no-unsanitized/method
          return import(pluginPath);
        })
      )
      : null
  ]);
  const pluginsForWork = new PluginsForWork({
    pluginsInWork, pluginFieldMappings, pluginObjects
  });
  const schemaItems = schemaObj.items.items;
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
    const {lang} = this; // array with first item as preferred
    pluginsForWork.iterateMappings(({
      plugin,
      pluginName, pluginLang,
      onByDefaultDefault,
      placement, applicableFields, meta
    }) => {
      const processField = ({applicableField, targetLanguage, onByDefault, metaApplicableField} = {}) => {
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
          targetLanguage: targetLanguage || pluginLang ||
                        applicableFieldLang
        });
        if (targetLanguage === '{locale}') {
          targetLanguage = preferredLocale;
        }
        const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
        const fieldAliasOrName = plugin.getFieldAliasOrName
          ? plugin.getFieldAliasOrName({
            locales: lang,
            lf,
            targetLanguage,
            applicableField,
            applicableFieldI18N,
            meta,
            metaApplicableField,
            targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
          })
          : languages.getFieldNameFromPluginNameAndLocales({
            pluginName,
            locales: lang,
            lf,
            targetLanguage,
            applicableFieldI18N,
            // Todo: Should have formal way to i18nize meta
            meta,
            metaApplicableField
          });
        fieldInfo.splice(
          // Todo: Allow default placement overriding for
          //    non-plugins
          placement === 'end'
            ? Number.POSITIVE_INFINITY // push
            : placement,
          0,
          {
            field: `${this.namespace}-plugin-${field}`,
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
    fileData, lf, getFieldAliasOrName, metadataObj,
    schemaObj, schemaItems, fieldInfo,
    pluginsForWork, groupsToWorks, metadata
  };
};
