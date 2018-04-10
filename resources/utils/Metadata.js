// Keep this as the last import for Rollup
import JsonRefs from 'json-refs/browser/json-refs-standalone-min.js';

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
export const getMetadata = async (file, property, cb) => {
    try {
        return (await JsonRefs
            .resolveRefsAt(
                getCurrDir() + file + (property ? '#/' + property : '')
            )).resolved;
    } catch (err) {
        throw err;
    }
};

export const getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, lang
}) {
    const fieldSchemaIndex = schemaItems.findIndex((item) =>
        item.title === field
    );
    const fieldSchema = schemaItems[fieldSchemaIndex];

    const ret = {
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
                        ).map((v) => v + ' (' + key + ')')
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
