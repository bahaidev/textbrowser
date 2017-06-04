/* global IMF, getJSON, JsonRefs, JSONP, IntlURLSearchParams, Templates */
/* exported TextBrowser */

(() => {
'use strict';

function s (obj) { alert(JSON.stringify(obj)); } // eslint-disable-line no-unused-vars

function TextBrowser (options) {
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    this.languages = options.languages || 'node_modules/textbrowser/appdata/languages.json';
    this.site = options.site || 'site.json';
    this.files = options.files || 'files.json';
    this.namespace = options.namespace || 'textbrowser';
    this.allowPlugins = options.allowPlugins;
    this.localizeParamNames = options.localizeParamNames === undefined
        ? true
        : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.interlinearSeparator = options.interlinearSeparator;
}

TextBrowser.prototype.init = function () {
    this.displayLanguages();
};

TextBrowser.prototype.displayLanguages = function () {
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    getJSON([this.languages, this.site], (langData, siteData) => {
        this.langData = langData;
        this.siteData = siteData;
        this.paramChange();

        // INIT/ADD EVENTS
        window.addEventListener('hashchange', this.paramChange.bind(this), false);
    }, (err) => {
        alert(err);
    });
};

TextBrowser.prototype.getFilesData = function () {
    return getJSON(this.files).then((dbs) => {
        this.fileData = dbs;
        return dbs;
    });
};

TextBrowser.prototype.getWorkData = function ({
    lang, localeFromFileData, fallbackLanguages, $p, getMetaProp
}) {
    const getCurrDir = () =>
        window.location.href.replace(/(index\.html)?#.*$/, '');

    return this.getFilesData().then((dbs) => {
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
        const getMetadata = (file, property, cb) =>
            JsonRefs
                .resolveRefsAt(getCurrDir() + file + (property ? '#/' + property : ''))
                .then(({resolved}) => resolved)
                .catch((err) => {
                    alert('catch:' + err);
                    throw err;
                });

        let fileData;
        const work = $p.get('work');
        const fileGroup = dbs.groups.find((fg) => {
            fileData = fg.files.find((file) =>
                work === lf(['workNames', fg.id, file.name])
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

        let getPlugins, pluginsInWork, pluginFieldsForWork, pluginPaths, pluginFieldMappingForWork;
        if (this.allowPlugins) {
            const possiblePluginFieldMappingForWork = dbs['plugin-field-mapping'][fileGroup.id][fileData.name];
            if (possiblePluginFieldMappingForWork) {
                pluginFieldsForWork = Object.keys(possiblePluginFieldMappingForWork);
                pluginsInWork = Object.keys(dbs.plugins).filter((p) => pluginFieldsForWork.includes(p));
                pluginFieldMappingForWork = pluginsInWork.map((p) => possiblePluginFieldMappingForWork[p]);
                pluginPaths = pluginsInWork.map((p) => dbs.plugins[p].path);
                getPlugins = this.allowPlugins && pluginsInWork;
            }
        }
        return getMetadata(metadataFile, metadataProperty).then((metadataObj) => {
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
            return Promise.all([
                fileData, lf, getFieldAliasOrName, // Pass on non-promises
                getMetadata(schemaFile, schemaProperty),
                metadataObj,
                getPlugins ? pluginsInWork : null, // Non-promise
                getPlugins ? pluginFieldMappingForWork : null, // Non-promise
                getPlugins ? JSONP(pluginPaths) : null
            ]);
        });
    });
};

// Need for directionality even if language specified (and we don't want to require it as a param)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    const langs = this.langData.languages;
    return langs.find((lang) =>
        lang.code === code
    ).direction;
};

TextBrowser.prototype.getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, getMetaProp
}) {
    const fieldSchema = schemaItems.find((item) =>
        item.title === field
    );

    const ret = {
        fieldName: getFieldAliasOrName(field)
    };

    let fieldValueAliasMap = metadataObj.fields && metadataObj.fields[field] &&
        metadataObj.fields[field]['fieldvalue-aliases'];
    if (fieldValueAliasMap) {
        if (fieldValueAliasMap.localeKey) {
            fieldValueAliasMap = getMetaProp(metadataObj, fieldValueAliasMap.localeKey.split('/'), true);
        }
        ret.aliases = [];
        // Todo: We could use `prefer_alias` but algorithm below may cover needed cases
        if (fieldSchema.enum && fieldSchema.enum.length) {
            fieldSchema.enum.forEach((enm) => {
                ret.aliases.push(
                    getMetaProp(metadataObj, ['fieldvalue', field, enm], true)
                );
                if (enm in fieldValueAliasMap &&
                    // Todo: We could allow numbers here too, but crowds pull-down
                    typeof fieldValueAliasMap[enm] === 'string') {
                    ret.aliases.push(...fieldValueAliasMap[enm]);
                }
            });
        } else {
            // Todo: We might iterate over all values (in case some not included in fv map)
            // Todo: Check `fieldSchema` for integer or string type
            Object.entries(fieldValueAliasMap).forEach(([key, aliases]) => {
                // We'll preserve the numbers since probably more useful if stored
                //   with data (as opposed to enums)
                if (!Array.isArray(aliases)) {
                    aliases = Object.values(aliases);
                }
                // We'll assume the longest version is best for auto-complete
                ret.aliases.push(
                    ...(
                        aliases.filter((v) =>
                            aliases.every((x) =>
                                x === v || !(x.toLowerCase().startsWith(v.toLowerCase()))
                            )
                        ).map((v) => v + ' (' + key + ')')
                    )
                );
            });
        }
        ret.fieldValueAliasMap = fieldValueAliasMap;
        // ret.aliases.sort();
    }
    ret.preferAlias = metadataObj.fields[field].prefer_alias;
    return ret;
};

TextBrowser.prototype.getBrowseFieldData = function ({
    metadataObj, getMetaProp, schemaItems, getFieldAliasOrName
}, cb) {
    metadataObj.table.browse_fields.forEach((browseFieldObject, i) => {
        if (typeof browseFieldObject === 'string') {
            browseFieldObject = {set: [browseFieldObject]};
        }

        const fieldSets = browseFieldObject.set;
        // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]] as kind of fieldset

        const browseFields = fieldSets.map((field) =>
            this.getFieldNameAndValueAliases({
                field, schemaItems, metadataObj, getFieldAliasOrName, getMetaProp
            })
        );
        cb({browseFields, i}); // eslint-disable-line standard/no-callback-literal
    });
};

// Todo: Break this up further
TextBrowser.prototype.paramChange = function () {
    const langs = this.langData.languages;

    document.body.parentNode.replaceChild(document.createElement('body'), document.body);

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = new IntlURLSearchParams();

    const followParams = () => {
        location.hash = '#' + $p.toString();
    };
    const localePass = (lcl) =>
        // Todo: Would be better to retrieve this data from language.json and then cache
        ['en-US', 'fa', 'ar', 'ru'].includes(lcl) ? lcl : false;

    const languageParam = $p.get('lang', true);

    // Todo: We could (unless overridden by another button) assume the browser language
    //         based on fallbackLanguages instead of giving a choice
    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length
        ? navLangs
        : [localePass(navigator.language) || 'en-US'];

    // We need a default to display a default title
    const language = languageParam || fallbackLanguages[0];

    const preferredLangs = language.split('.');
    const lang = this.lang = preferredLangs.concat(fallbackLanguages);
    const preferredLocale = lang[0];
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    document.dir = direction;

    const localeFromLangData = (lan) =>
        this.langData['localization-strings'][lan];

    const localeFromFileData = (lan) =>
        this.fileData['localization-strings'][lan];

    const getLanguageFromCode = (code) =>
        localeFromLangData(code).languages[code];

    function getMetaProp (metadataObj, properties, allowObjects) {
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
            prop = (allowObjects || typeof strings === 'string') ? strings : undefined;
            return prop;
        });
        return prop;
    }

    if (!languageParam) {
        const localeFromSiteData = (lan) =>
            this.siteData['localization-strings'][lan];
        const languageSelect = (l) => {
            $p.l10n = l;
            // Also can use l('chooselanguage'), but assumes locale as with page title
            document.title = l('browser-title');

            Templates.languageSelect({langs, getLanguageFromCode, followParams, $p});
        };
        const imfSite = IMF({
            locales: lang.map(localeFromSiteData),
            fallbackLocales: fallbackLanguages.map(localeFromSiteData)
        });
        languageSelect(imfSite.getFormatter());
        return;
    }
    const localeCallback = (/* l, defineFormatter */ ...args) => {
        const l10n = args[0];
        this.l10n = l10n;
        $p.l10n = l10n;

        const work = $p.get('work');
        const result = $p.get('result');
        if (!work) {
            this.workSelect({
                lang, localeFromFileData, fallbackLanguages, getMetaProp, $p, followParams
            }, ...args);
            return;
        }
        if (!result) {
            this.workDisplay({
                lang, preferredLocale, localeFromFileData, fallbackLanguages, getMetaProp,
                $p, localeFromLangData
            }, ...args);
            return;
        }
        this.resultsDisplay({
            l: l10n, imfLocales: imf.locales, $p, lang, localeFromFileData, fallbackLanguages,
            getMetaProp
        }, ...args);
    };
    const imf = IMF({
        languages: lang,
        fallbackLanguages: fallbackLanguages,
        localeFileResolver: (code) =>
            // Todo: For editing of locales, we might instead resolve all
            //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
            //    replace IMF() loadLocales behavior with our own now resolved
            //    locales; see https://github.com/jdorn/json-editor/issues/132
            this.langData.localeFileBasePath + langs.find((l) =>
                l.code === code
            ).locale.$ref,
        callback: localeCallback
    });
};

window.TextBrowser = TextBrowser;
})();
