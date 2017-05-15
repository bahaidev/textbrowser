/* global IMF, getJSON, IntlURLSearchParams, Templates */
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
        const imfSite = IMF({ // eslint-disable-line new-cap
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
                lang, localeFromFileData, fallbackLanguages, getMetaProp, $p, localeFromLangData
            }, ...args);
            return;
        }
        this.resultsDisplay({}, ...args);
    };
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
        callback: localeCallback
    });
};

return TextBrowser;
}());
