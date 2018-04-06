/* eslint-env browser */
import getJSON from 'simple-get-json';
import IMF from 'imf';
import getIMFFallbackResults from './utils/getIMFFallbackResults.js';
import loadStylesheets from 'load-stylesheets';

import {getFieldNameAndValueAliases, getBrowseFieldData} from './utils/Metadata.js';
import {getWorkFiles, getWorkData} from './utils/WorkInfo.js';
import {registerServiceWorker, setServiceWorkerDefaults} from './utils/ServiceWorker.js';

import {escapeHTML} from './utils/sanitize.js';
import getLanguageInfo from './utils/getLanguageInfo.js';

import Templates from './templates/index.js';
import IntlURLSearchParams from './utils/IntlURLSearchParams.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import {resultsDisplayClient} from './resultsDisplay.js';

function s (obj) { alert(JSON.stringify(obj)); } // eslint-disable-line no-unused-vars

async function prepareForServiceWorker (langs) {
    try {
        // Todo: No possible resolving after this point? (except
        //          to reload)
        Templates.permissions.addLogEntry({
            text: 'Beginning install...'
        });
        const persistent = await navigator.storage.persist();
        if (!persistent) {
            Templates.permissions.browserNotGrantingPersistence();
            return;
        }
        Templates.permissions.addLogEntry({
            text: 'Received work files'
        });
        await registerServiceWorker({
            serviceWorkerPath: this.serviceWorkerPath,
            namespace: this.namespace,
            files: this.files,
            languages: this.languages,
            staticFilesToCache: this.staticFilesToCache,
            langs,
            logger: Templates.permissions
        });
    } catch (err) {
        if (err && typeof err === 'object') {
            const {message} = err;
            if (message === 'versionchange') {
                Templates.permissions.versionChange();
                return;
            }
        }
        Templates.permissions.errorRegistering(
            escapeHTML(err && err.message)
        );
    }
}

async function requestPermissions (langs, l) {
    await new Promise((resolve, reject) => {
        // Todo: We could run the dialog code below for every page if
        //    `Notification.permission === 'default'` (i.e., not choice
        //    yet made by user), but user may avoid denying with intent
        //    of seeing how it goes. But for users who come directly to
        //    the work or results page, the slow performance will be
        //    unexplained so probably better to force a decision.
        const ok = async () => {
            // Notification request to be directly in response to user action for Chrome
            const permissionStatus = await Notification.requestPermission();
            requestPermissionsDialog.close(permissionStatus);
        };
        const refuse = () => {
            requestPermissionsDialog.close();
        };
        const closeBrowserNotGranting = (e) => {
            browserNotGrantingPersistenceAlert.close();
        };
        const close = async () => {
            function rememberRefusal () {
                // Todo: We could go forward with worker, caching files, and
                //    indexedDB regardless of permissions, but this way
                //    we can continue to gauge performance differences for now
                localStorage.setItem(
                    this.namespace + '-refused',
                    'true'
                );
            }
            try {
                if (!requestPermissionsDialog.returnValue) {
                    rememberRefusal();
                    return;
                }
            } catch (err) {
                Templates.permissions.errorRegistering(
                    escapeHTML(err && err.message)
                );
            }

            // denied|default|granted
            switch (requestPermissionsDialog.returnValue) {
            case 'denied':
                // User may not want notifications but may look into another way
                //   to persist (e.g., adding to bookmark), so we don't remember
                //   the refusal unless they refuse in *our* dialog
                // rememberRefusal();
                resolve();
                return;
            case 'default':
                resolve();
                return;
            case 'granted':
                if (navigator.serviceWorker.controller) {
                    resolve();
                    return;
                }
                // Has own error-handling
                await prepareForServiceWorker.call(this, langs);
            }
        };
        const [requestPermissionsDialog, browserNotGrantingPersistenceAlert] = // , errorRegisteringNotice
            Templates.permissions.main({
                l, ok, refuse, close, closeBrowserNotGranting
            });
        requestPermissionsDialog.showModal();
    });
}

function TextBrowser (options) {
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    // Todo: Replace the `languages` default with `import.meta`
    //  (`new URL('../appdata/languages.json', moduleURL).href`?) once
    //  implemented; https://github.com/tc39/proposal-import-meta
    const moduleURL = new URL('node_modules/textbrowser/resources/index.js', location);
    this.site = options.site || 'site.json';

    setServiceWorkerDefaults(this, options);

    this.allowPlugins = options.allowPlugins;
    this.trustFormatHTML = options.trustFormatHTML;
    this.requestPersistentStorage = options.requestPersistentStorage;
    this.localizeParamNames = options.localizeParamNames === undefined
        ? true
        : options.localizeParamNames;
    this.hideFormattingSection = Boolean(options.hideFormattingSection);
    this.interlinearSeparator = options.interlinearSeparator;
    // Todo: Make these user facing options
    this.showEmptyInterlinear = options.showEmptyInterlinear;
    this.showTitleOnSingleInterlinear = options.showTitleOnSingleInterlinear;
    this.noDynamic = options.noDynamic;
    this.skipIndexedDB = options.skipIndexedDB;
    this.stylesheets = (options.stylesheets || ['@builtin']).map((s) => {
        return s === '@builtin' ? new URL('index.css', moduleURL).href : s;
    });
}

TextBrowser.prototype.workDisplay = workDisplay;
TextBrowser.prototype.resultsDisplayClient = resultsDisplayClient;

TextBrowser.prototype.init = async function () {
    this._stylesheetElements = await loadStylesheets(this.stylesheets);
    return this.displayLanguages();
};

TextBrowser.prototype.displayLanguages = async function () {
    // We use getJSON instead of JsonRefs as we do not need to resolve the locales here
    try {
        const [langData, siteData] = await getJSON([this.languages, this.site]);
        this.langData = langData;
        this.siteData = siteData;

        const p = this.paramChange();

        // INIT/ADD EVENTS
        window.addEventListener('hashchange', () => this.paramChange(), false);

        return p;
    } catch (err) {
        alert(err);
    }
};

TextBrowser.prototype.getWorkFiles = getWorkFiles;

TextBrowser.prototype.getWorkData = function (opts) {
    try {
        return getWorkData({
            ...opts,
            files: this.files,
            allowPlugins: this.allowPlugins
        });
    } catch (err) {
        alert('catch:' + err);
    }
};

// Need for directionality even if language specified (and we don't want
//   to require it as a param)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    const langs = this.langData.languages;
    return langs.find((lang) =>
        lang.code === code
    ).direction;
};

TextBrowser.prototype.getFieldNameAndValueAliases = function (args) {
    return getFieldNameAndValueAliases({...args, lang: this.lang});
};

TextBrowser.prototype.getBrowseFieldData = function (args) {
    return getBrowseFieldData({...args, lang: this.lang});
};

TextBrowser.prototype.paramChange = async function () {
    document.body.replaceWith(Templates.defaultBody());

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = new IntlURLSearchParams();

    const followParams = () => {
        location.hash = '#' + $p.toString();
    };

    const {
        lang, langs, languageParam, fallbackLanguages
    } = getLanguageInfo({$p, langData: this.langData});
    this.lang = lang;

    const [preferredLocale] = lang;
    const direction = this.getDirectionForLanguageCode(preferredLocale);
    document.dir = direction;

    const localeFromLangData = (lan) =>
        this.langData['localization-strings'][lan];

    const getLanguageFromCode = (code) =>
        localeFromLangData(code).languages[code];

    // This check goes further than `Notification.permission === 'granted'`
    //   to see whether the browser actually considers the notification
    //   sufficient to grant persistence (as it is supposed to do).
    const getSiteI18n = () => {
        const localeFromSiteData = (lan) =>
            this.siteData['localization-strings'][lan];
        const imfSite = IMF({
            locales: lang.map(localeFromSiteData),
            fallbackLocales: fallbackLanguages.map(localeFromSiteData)
        });
        return imfSite.getFormatter();
    };
    const persistent = await navigator.storage.persisted();
    /*
    console.log(
        'navigator.serviceWorker.controller',
        navigator.serviceWorker.controller
    );
    */
    let siteI18n;
    if (
        // User may have persistence via bookmarks, etc. but just not
        //     want commital on notification
        // Notification.permission === 'default' ||

        // We always expect a controller, so is probably first visit
        !localStorage.getItem(this.namespace + '-refused') && // Not show if refused before
        (!navigator.serviceWorker.controller || !persistent)
    ) {
        siteI18n = getSiteI18n();
        // Note: In Chrome on 127.0.0.1 (but not localhost!),
        //        this always appears to be `true`, despite having
        //        no notifications enabled or bookmarking 127.0.0.1,
        //        or being on the main page per
        //        https://developers.google.com/web/updates/2016/06/persistent-storage
        if (persistent) {
            // No need to ask permissions (e.g., if user bookmarked site instead),
            //   but we do need a worker
            Templates.permissions.main({l: siteI18n});
            await prepareForServiceWorker.call(this, langs);
        } else {
            await requestPermissions.call(this, langs, siteI18n);
        }
        Templates.permissions.exitDialogs();
    }
    /*
    try {
        await navigator.serviceWorker.ready;
        console.log('444');
    } catch (err) {
        console.log('123');
    }
    */
    if (!languageParam) {
        const languageSelect = (l) => {
            $p.l10n = l;
            // Also can use l('chooselanguage'), but assumes locale
            //   as with page title
            document.title = l('browser-title');
            Templates.languageSelect.main({
                langs, getLanguageFromCode, followParams, $p
            });
        };
        const l = siteI18n || getSiteI18n();
        languageSelect(l);
        return;
    }
    const localeCallback = (/* l, defineFormatter */ ...args) => {
        const [l10n] = args;
        this.l10n = l10n;
        $p.l10n = l10n;

        const work = $p.get('work');
        const result = $p.get('result');
        if (!work) {
            workSelect({
                files: this.files,
                lang, fallbackLanguages,
                $p, followParams
            }, ...args);
            return true;
        }
        if (!result) {
            this.workDisplay({
                lang, preferredLocale,
                fallbackLanguages,
                $p, localeFromLangData
            }, ...args);
            return true;
        }
        return false;
    };
    return getIMFFallbackResults({
        $p,
        lang, langs,
        langData: this.langData,
        fallbackLanguages,
        resultsDisplay: (opts) => {
            return this.resultsDisplayClient({
                ...opts,
                files: this.files,
                allowPlugins: this.allowPlugins
            });
        },
        localeCallback
    });
};

export default TextBrowser;
