/* eslint-env browser */
/* global URLSearchParams, formSerialize, JsonRefs, IMF, getJSON, IntlURLSearchParams, Templates */
/* exported TextBrowser */

const TextBrowser = (function () {
/* eslint-disable indent */
'use strict';

function s (obj) { alert(JSON.stringify(obj)); } // eslint-disable-line no-unused-vars

function TextBrowser (options) { // eslint-disable-line
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    this.languages = options.languages || 'bower_components/textbrowser/appdata/languages.json';
    this.site = options.site || 'site.json';
    this.files = options.files || 'files.json';
    this.namespace = options.namespace || 'textbrowser';
    this.localizeParamNames = options.localizeParamNames === undefined
        ? true
        : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
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

// Need for directionality even if language specified (and we don't want to require it as a param)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    const langs = this.langData.languages;
    return langs.find((lang) =>
        lang.code === code
    ).direction;
};

// Todo: Break this up further
TextBrowser.prototype.paramChange = function () {
    const that = this;
    const langs = this.langData.languages;

    document.body.parentNode.replaceChild(document.createElement('body'), document.body);

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = new IntlURLSearchParams();
    const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
    const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');

    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
        ? $p.get('i18n', true) === '1'
        : ( // eslint-disable-line no-nested-ternary
            prefI18n === 'true'
                ? true
                : (prefI18n === 'false'
                    ? false
                    : this.localizeParamNames) // eslint-disable-line no-nested-ternary
        );
    const hideFormattingSection = $p.has('formatting', true)
        ? $p.get('formatting', true) === '0'
        : ( // eslint-disable-line no-nested-ternary
            prefFormatting === 'true'
                ? true
                : (prefFormatting === 'false'
                    ? false
                    : this.hideFormattingSection) // eslint-disable-line no-nested-ternary
        );

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
    const lang = preferredLangs.concat(fallbackLanguages);
    const preferredLocale = lang[0];
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);
    document.dir = direction;

    const localeFromLangData = (lan) =>
        this.langData['localization-strings'][lan];

    const localeFromFileData = (lan) =>
        this.fileData['localization-strings'][lan];

    const getLanguageFromCode = (code) =>
        localeFromLangData(code).languages[code];

    const languageSelect = (l) => {
        $p.l10n = l;
        // Also can use l('chooselanguage'), but assumes locale as with page title
        document.title = l('browser-title');

        Templates.languageSelect({langs, getLanguageFromCode, followParams, $p});
    };

    const getCurrDir = () =>
        window.location.href.replace(/(index\.html)?#.*$/, '');

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
            prop = allowObjects || typeof strings === 'string' ? strings : false;
            return prop;
        });
        return prop;
    }

    function workSelect (/* l, defineFormatter */) {
        // We use getJSON instead of JsonRefs as we do not necessarily need to
        //    resolve the file contents here
        getJSON(that.files, (dbs) => {
            that.fileData = dbs;
            const imfFile = IMF({ // eslint-disable-line new-cap
                locales: lang.map(localeFromFileData),
                fallbackLocales: fallbackLanguages.map(localeFromFileData)
            });
            const lf = imfFile.getFormatter();
            document.title = lf({key: 'browserfile-workselect', fallback: true});

            /*
            function ld (key, values, formats) {
                return l({
                    key: key, values: values, formats: formats, fallback: ({message}) =>
                        // Displaying as div with inline display instead of span since
                        //    Firefox puts punctuation at left otherwise
                        ['div', {
                            style: 'display: inline;direction: ' + fallbackDirection
                        }, [message]]
                });
            }
            */

            getJSON(dbs.groups.reduce((arr, fileGroup) => {
                const metadataBaseDir = (dbs.metadataBaseDirectory || '') +
                    (fileGroup.metadataBaseDirectory || '') + '/';
                return fileGroup.files.reduce((ar, fileData) =>
                    ar.concat(metadataBaseDir + fileData.metadataFile),
                    arr);
            }, [])).then((metadataObjs) => {
                const metadataObjsIter = metadataObjs[Symbol.iterator]();
                const getNextAlias = () => {
                    const metadataObj = metadataObjsIter.next().value;
                    return getMetaProp(metadataObj, 'alias');
                };
                Templates.workSelect({dbs, lf, getNextAlias, $p, followParams});
            }, (err) => {
                alert('Error: ' + err);
            });
        }, (err) => {
            alert(err);
        });
    }

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

        const schemaItems = schemaObj.items.items;
        const content = [];

        function serializeParamsAsURL (cb) {
            const paramsCopy = new URLSearchParams($p.params);
            const formParamsHash = formSerialize(document.querySelector('form#browse'), {hash: true});

            Object.keys(formParamsHash).forEach((key) => {
                paramsCopy.set(key, formParamsHash[key]);
            });

            // Follow the same style (and order) for checkboxes
            paramsCopy.delete(il('rand'));
            paramsCopy.set(il('rand'), document.querySelector('#rand').checked ? l('yes') : l('no'));

            // We want checkboxes to typically show by default, so we cannot use the
            //    standard serialization
            Array.from(document.querySelectorAll('input[type=checkbox]')).forEach((checkbox) => {
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

            Templates.workDisplay.addBrowseFields({browseFields, content});
        });

        Templates.workDisplay.addEnumFieldValues({
            /* eslint-disable object-property-newline */
            enumFvs, enumerateds, iil, fallbackDirection,
            il, l, le, $p, serializeParamsAsURL, content
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
            getMetaProp, metadataObj, il, content, le
            /* eslint-enable object-property-newline */
        });
    }

    function workDisplay (l, defineFormatter) {
        getJSON(that.files, (dbs) => {
            that.fileData = dbs;
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
    }

    function resultsDisplay (/* l, defineFormatter */) {
        // Will need to retrieve fileData as above (abstract?)
        // document.title = l({key: 'browserfile-resultsdisplay', values: {work: fileData ?
        //    l({key: ['tablealias', $p.get('work')], fallback: true}) : ''
        // }, fallback: true});
    }

    const localeFromSiteData = (lan) =>
        this.siteData['localization-strings'][lan];

    function localeCallback (/* l, defineFormatter */) {
        const l10n = arguments[0];
        this.l10n = l10n;
        $p.l10n = l10n;

        const work = $p.get('work');
        const result = $p.get('result');
        if (!work) {
            workSelect.apply(this, arguments);
            return;
        }
        if (!result) {
            workDisplay.apply(this, arguments);
            return;
        }
        resultsDisplay.apply(this, arguments);
    }

    if (!languageParam) {
        const imfSite = IMF({ // eslint-disable-line new-cap
            locales: lang.map(localeFromSiteData),
            fallbackLocales: fallbackLanguages.map(localeFromSiteData)
        });
        languageSelect(imfSite.getFormatter());
        return;
    }
    IMF({ // eslint-disable-line new-cap
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
        callback: localeCallback.bind(this)
    });
};

return TextBrowser;
}());
