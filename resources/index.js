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
    lang, localeFromFileData, fallbackLanguages, $p
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

        return Promise.all([
            fileData, lf, // Pass on non-promises
            getMetadata(schemaFile, schemaProperty),
            getMetadata(metadataFile, metadataProperty),
            this.allowPlugins ? Object.keys(dbs.plugins) : null, // Non-promise
            this.allowPlugins ? JSONP(Object.values(dbs.plugins).map((p) => p.path)) : null
        ]);
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
            prop = allowObjects || typeof strings === 'string' ? strings : false;
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
                /* eslint-disable object-property-newline */
                lang, preferredLocale, localeFromFileData, fallbackLanguages, getMetaProp,
                $p, localeFromLangData
                /* eslint-enable object-property-newline */
            }, ...args);
            return;
        }
        this.resultsDisplay({l: l10n, $p, lang, localeFromFileData, fallbackLanguages}, ...args);
    };
    IMF({
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
