import getJSON from 'simple-get-json';
import IMF from 'imf';
import {getMetaProp, getMetadata} from './Metadata.js';
import {PluginsForWork} from './Plugin.js';

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
        ...Object.values(filesObj['plugins']).map((pl) => pl.path)
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
    lang, fallbackLanguages, $p, files, allowPlugins, basePath
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
    const work = $p.get('work');
    const fileGroup = filesObj.groups.find((fg) => {
        fileData = fg.files.find((file) =>
            work === lf(['workNames', fg.id, file.name])
        );
        return Boolean(fileData);
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
        pluginPaths, pluginFieldMappingForWork;
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
                    return import(pluginPath);
                })
            )
            : null
    ]);
    const pluginsForWork = new PluginsForWork({
        pluginsInWork, pluginFieldMappings, pluginObjects
    });
    return {
        fileData, lf, getFieldAliasOrName, metadataObj,
        schemaObj,
        pluginsForWork
    };
};
