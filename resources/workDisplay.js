/* globals TextBrowser, Templates, IMF, formSerialize, getJSON, JsonRefs */

(function () {
/* eslint-disable indent */

const getCurrDir = () =>
    window.location.href.replace(/(index\.html)?#.*$/, '');

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

TextBrowser.prototype.workDisplay = function workDisplay ({
    lang, preferredLocale, localeFromLangData, fallbackLanguages, getMetaProp, $p,
    localeFromFileData
}, l, defineFormatter) {
    const that = this;
    const langs = this.langData.languages;

    const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);

    const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
        ? $p.get('i18n', true) === '1'
        : ( // eslint-disable-line no-nested-ternary
            prefI18n === 'true'
                ? true
                : (prefI18n === 'false'
                    ? false
                    : this.localizeParamNames) // eslint-disable-line no-nested-ternary
        );

    const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
    const hideFormattingSection = $p.has('formatting', true)
        ? $p.get('formatting', true) === '0'
        : ( // eslint-disable-line no-nested-ternary
            prefFormatting === 'true'
                ? true
                : (prefFormatting === 'false'
                    ? false
                    : this.hideFormattingSection) // eslint-disable-line no-nested-ternary
        );

    function _displayWork (l, defineFormatter, schemaObj, metadataObj) {
        const il = localizeParamNames
            ? key => l(['params', key])
            : key => key;
        const iil = localizeParamNames
            ? key => l(['params', 'indexed', key])
            : key => key;

        const imfLang = IMF({
            locales: lang.map(localeFromLangData),
            fallbackLocales: fallbackLanguages.map(localeFromLangData)
        }); // eslint-disable-line new-cap
        const imfl = imfLang.getFormatter();

        // Returns option element with localized option text (as Jamilih), with
        //   optional fallback direction
        const le = (key, el, attToLocalize, atts, children) => {
            atts[attToLocalize] = l({
                key: key,
                fallback: ({message}) => {
                    atts.dir = fallbackDirection;
                    return message;
                }
            });
            return [el, atts, children];
        };

        // Returns plain text node or element (as Jamilih) with fallback direction
        const ld = (key, values, formats) =>
            l({
                key,
                values,
                formats,
                fallback: ({message}) =>
                    // Displaying as div with inline display instead of span since
                    //    Firefox puts punctuation at left otherwise (bdo dir
                    //    seemed to have issues in Firefox)
                    ['div', {style: 'display: inline;direction: ' + fallbackDirection}, [message]]
            });

        const schemaItems = schemaObj.items.items;
        const content = [];

        function serializeParamsAsURL (cb) {
            const paramsCopy = new URLSearchParams($p.params);
            const formParamsHash = formSerialize($('form#browse'), {hash: true});

            Object.keys(formParamsHash).forEach((key) => {
                paramsCopy.set(key, formParamsHash[key]);
            });

            // Follow the same style (and order) for checkboxes
            paramsCopy.delete(il('rand'));
            paramsCopy.set(il('rand'), $('#rand').checked ? l('yes') : l('no'));

            // We want checkboxes to typically show by default, so we cannot use the
            //    standard serialization
            $$('input[type=checkbox]').forEach((checkbox) => {
                // Let's ensure the checked items are all together (at the end)
                paramsCopy.delete(checkbox.name);
                paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
            });

            cb(paramsCopy);
            return window.location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
        }
        function getFieldAliasOrName (field) {
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
                    fieldName = getMetaProp(metadataObj, fieldAlias.split('/'));
                }
            } else { // No alias
                fieldName = fieldObj.name;
                if (typeof fieldName === 'object') {
                    fieldName = fieldName.localeKey;
                    fieldName = getMetaProp(metadataObj, fieldName.split('/'));
                }
            }
            return fieldName;
        }
        const enumFvs = {};
        const enumerateds = {};
        metadataObj.table.browse_fields.forEach((browseFieldObject, i) => {
            if (typeof browseFieldObject === 'string') {
                browseFieldObject = {set: [browseFieldObject]};
            }

            const fieldSets = browseFieldObject.set;
            // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]] as kind of fieldset

            const browseFields = fieldSets.map((browseField, j) => {
                const fieldSchema = schemaItems.find((item) =>
                    item.title === browseField
                );

                // Todo: Check fieldSchema for integer or string?

                const enumerated = metadataObj.fields && metadataObj.fields[browseField] &&
                    metadataObj.fields[browseField].sequentialEnum && fieldSchema.enum;
                if (enumerated) {
                    enumerateds[j] = enumerated;
                    enumFvs[j] = getMetaProp(metadataObj, ['fieldvalue', browseField], true);
                }

                return getFieldAliasOrName(browseField);
            });

            Templates.workDisplay.addBrowseFields({browseFields, ld, i, iil, $p, content});
        });

        Templates.workDisplay.addEnumFieldValues({
            /* eslint-disable object-property-newline */
            enumFvs, enumerateds, iil, fallbackDirection,
            il, l, ld, le, $p, serializeParamsAsURL, content
            /* eslint-enable object-property-newline */
        });

        const fields = schemaItems.map((schemaItem) => schemaItem.title);

        // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        const heading = getMetaProp(metadataObj, 'heading');
        Templates.workDisplay.main({
            /* eslint-disable object-property-newline */
            l, namespace: that.namespace, heading,
            imfl, fallbackDirection,
            langs, fields, localizeParamNames,
            serializeParamsAsURL, hideFormattingSection, $p,
            getMetaProp, metadataObj, il, le, ld, iil,
            getFieldAliasOrName, preferredLocale, schemaItems, content
            /* eslint-enable object-property-newline */
        });
    }

    getJSON(this.files, (dbs) => {
        this.fileData = dbs;
        const imfFile = IMF({ // eslint-disable-line new-cap
            locales: lang.map(localeFromFileData),
            fallbackLocales: fallbackLanguages.map(localeFromFileData)
        });
        const lf = imfFile.getFormatter();

        // Use the following to dynamically add specific file schema in place of
        //    generic table schema if validating against files.jsonschema
        //  filesSchema.properties.groups.items.properties.files.items.properties.
        //      file.anyOf.splice(1, 1, {$ref: schemaFile});
        // Todo: Allow use of dbs and fileGroup together in base directories?
        function getMetadata (file, property, cb) {
            const currDir = getCurrDir();
            JsonRefs.resolveRefsAt(currDir + file + (property ? '#/' + property : ''))
                .then((rJson, metadata) => {
                    cb(rJson.resolved, metadata);
                }).catch((err) => {
                    alert('catch:' + err);
                    throw err;
                });
        }

        let fileData;
        const fileGroup = dbs.groups.find((fg) => {
            fileData = fg.files.find((file) =>
                $p.get('work') === lf(['workNames', fg.id, file.name])
            );
            return Boolean(fileData);
        });

        const baseDir = (dbs.baseDirectory || '') + (fileGroup.baseDirectory || '') + '/';
        const schemaBaseDir = (dbs.schemaBaseDirectory || '') +
            (fileGroup.schemaBaseDirectory || '') + '/';
        const metadataBaseDir = (dbs.metadataBaseDirectory || '') +
            (fileGroup.metadataBaseDirectory || '') + '/';

        const file = baseDir + fileData.file.$ref;
        let schemaFile = fileData.schemaFile ? schemaBaseDir + fileData.schemaFile : '';
        let metadataFile = fileData.metadataFile ? metadataBaseDir + fileData.metadataFile : '';

        let schemaProperty = '', metadataProperty = '';

        if (!schemaFile) {
            schemaFile = file;
            schemaProperty = 'schema';
        }
        if (!metadataFile) {
            metadataFile = file;
            metadataProperty = 'metadata';
        }

        getMetadata(schemaFile, schemaProperty, (schemaObj) => {
            getMetadata(metadataFile, metadataProperty, (metadataObj) => {
                document.title = lf({
                    key: 'browserfile-workdisplay',
                    values: {
                        work: fileData
                            ? getMetaProp(metadataObj, 'alias')
                            : ''
                    },
                    fallback: true
                });
                _displayWork(l, defineFormatter, schemaObj, metadataObj);
            });
        });
    }, (err) => {
        alert(err);
    });
};

/* eslint-enable indent */
}());
