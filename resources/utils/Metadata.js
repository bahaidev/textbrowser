/* eslint-env browser */
import {getPreferredLanguages} from './Languages.js';
// Keep this as the last import for Rollup
import JsonRefs from 'json-refs/dist/json-refs-min.js'; // eslint-disable-line import/order

const getCurrDir = () =>
    window.location.href.replace(/(index\.html)?#.*$/, '');

export const getMetaProp = function getMetaProp (lang, metadataObj, properties, allowObjects) {
    let prop;
    properties = typeof properties === 'string' ? [properties] : properties;
    lang.some((lan) => {
        const p = properties.slice(0);
        let strings = metadataObj['localization-strings'][lan];
        while (strings && p.length) {
            strings = strings[p.shift()];
        }
        // Todo: Fix this allowance for allowObjects (as it does not properly
        //        fallback if an object is returned from a language because
        //        that language is missing content and is only thus returning
        //        an object)
        prop = (allowObjects || typeof strings === 'string')
            ? strings
            : undefined;
        return prop;
    });
    return prop;
};

// Use the following to dynamically add specific file schema in place of
//    generic table schema if validating against files.jsonschema
//  filesSchema.properties.groups.items.properties.files.items.properties.
//      file.anyOf.splice(1, 1, {$ref: schemaFile});
// Todo: Allow use of dbs and fileGroup together in base directories?
export const getMetadata = async (file, property, basePath) => {
    return (await JsonRefs
        .resolveRefsAt(
            (basePath || getCurrDir()) + file + (property ? '#/' + property : ''),
            {
                loaderOptions: {
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
        )).resolved;
};

export const getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, lang
}) {
    const fieldSchemaIndex = schemaItems.findIndex((item) =>
        item.title === field
    );
    const fieldSchema = schemaItems[fieldSchemaIndex];

    const ret = {
        // field,
        fieldName: getFieldAliasOrName(field)
    };

    const fieldInfo = metadataObj.fields[field];
    let fieldValueAliasMap = fieldInfo && fieldInfo['fieldvalue-aliases'];
    if (fieldValueAliasMap) {
        if (fieldValueAliasMap.localeKey) {
            fieldValueAliasMap = getMetaProp(
                lang,
                metadataObj,
                fieldValueAliasMap.localeKey.split('/'),
                true
            );
        }
        ret.rawFieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
        ret.aliases = [];
        // Todo: We could use `prefer_alias` but algorithm below may cover
        //    needed cases
        if (fieldSchema.enum && fieldSchema.enum.length) {
            fieldSchema.enum.forEach((enm) => {
                ret.aliases.push(
                    getMetaProp(lang, metadataObj, ['fieldvalue', field, enm], true)
                );
                if (enm in fieldValueAliasMap &&
                    // Todo: We could allow numbers here too, but crowds
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
                }
                // We'll assume the longest version is best for auto-complete
                ret.aliases.push(
                    ...(
                        aliases.filter((v) =>
                            aliases.every((x) =>
                                x === v || !(
                                    x.toLowerCase().startsWith(v.toLowerCase())
                                )
                            )
                        ).map((v) => v + ' (' + key + ')') // Todo: i18nize
                    )
                );
            });
        }
        ret.fieldValueAliasMap = JSON.parse(JSON.stringify(fieldValueAliasMap));
        // ret.aliases.sort();
    }
    ret.fieldSchema = fieldSchema;
    ret.fieldSchemaIndex = fieldSchemaIndex;
    ret.preferAlias = fieldInfo.prefer_alias;
    ret.lang = fieldInfo.lang;
    return ret;
};

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
        // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
        //          as kind of fieldset

        const browseFields = fieldSets.map((field) =>
            getFieldNameAndValueAliases({
                lang,
                field, schemaItems, metadataObj,
                getFieldAliasOrName
            })
        );
        callback({setName, browseFields, i, presort}); // eslint-disable-line standard/no-callback-literal
    });
};

// Todo: Incorporate other methods into this class
export class Metadata {
    constructor ({metadataObj}) {
        this.metadataObj = metadataObj;
    }

    getFieldLang (field) {
        const {metadataObj} = this;
        const fields = metadataObj && metadataObj.fields;
        return fields && fields[field] && fields[field].lang;
    }

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
                Object.keys(localeStrings).some(lng => {
                    const fv = localeStrings[lng] &&
                        localeStrings[lng].fieldvalue;
                    return fv && fv[field];
                });

            return hasFieldValue ||
                (metaLang && preferredLanguages.includes(metaLang)) ||
                schemaItems.some(item =>
                    item.title === field && item.type !== 'string'
                );
        };
    }
}
