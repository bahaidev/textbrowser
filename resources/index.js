import JsonRefs from 'json-refs/browser/json-refs-standalone-min.js';
import getJSON from 'simple-get-json';
import IMF from 'imf';
import loadStylesheets from 'load-stylesheets';

import Templates from './templates/index.js';
import IntlURLSearchParams from './IntlURLSearchParams.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import resultsDisplay from './resultsDisplay.js';

function s (obj) { alert(JSON.stringify(obj)); } // eslint-disable-line no-unused-vars

function TextBrowser (options) {
    if (!(this instanceof TextBrowser)) {
        return new TextBrowser(options);
    }
    // Todo: Replace the `languages` default with `import.meta`
    //  (`new URL('../appdata/languages.json', moduleURL).href`?) once
    //  implemented; https://github.com/tc39/proposal-import-meta
    const moduleURL = new URL('node_modules/textbrowser/resources/index.js', location);
    this.languages = options.languages || new URL('../appdata/languages.json', moduleURL).href;
    this.serviceWorkerPath = options.serviceWorkerPath || 'sw.js';
    this.site = options.site || 'site.json';
    this.files = options.files || 'files.json';
    this.namespace = options.namespace || 'textbrowser';
    this.staticFilesToCache = options.staticFilesToCache; // Defaults in worker file
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

TextBrowser.prototype.workSelect = workSelect;
TextBrowser.prototype.workDisplay = workDisplay;
TextBrowser.prototype.resultsDisplay = resultsDisplay;

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

TextBrowser.prototype.getFilesData = async function () {
    const dbs = await getJSON(this.files);
    this.fileData = dbs;
    return dbs;
};

TextBrowser.prototype.getWorkFiles = async function () {
    const filesObj = await this.getFilesData();
    const dataFiles = [];
    filesObj.groups.forEach((fileGroup) => {
        fileGroup.files.forEach((fileData) => {
            const {file, schemaFile, metadataFile} =
                this.getFilePaths(filesObj, fileGroup, fileData);
            dataFiles.push(file, schemaFile, metadataFile);
        });
    });
    dataFiles.push(
        ...Object.values(filesObj['plugins']).map((pl) => pl.path)
    );
    return dataFiles;
};
TextBrowser.prototype.getFilePaths = function (filesObj, fileGroup, fileData) {
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

TextBrowser.prototype.getWorkData = async function ({
    lang, localeFromFileData, fallbackLanguages, $p, getMetaProp
}) {
    const getCurrDir = () =>
        window.location.href.replace(/(index\.html)?#.*$/, '');

    const filesObj = await this.getFilesData();
    const imfFile = IMF({
        locales: lang.map(localeFromFileData),
        fallbackLocales: fallbackLanguages.map(localeFromFileData)
    });
    const lf = imfFile.getFormatter();

    // Use the following to dynamically add specific file schema in place of
    //    generic table schema if validating against files.jsonschema
    //  filesSchema.properties.groups.items.properties.files.items.properties.
    //      file.anyOf.splice(1, 1, {$ref: schemaFile});
    // Todo: Allow use of dbs and fileGroup together in base directories?
    const getMetadata = async (file, property, cb) => {
        try {
            return (await JsonRefs
                .resolveRefsAt(
                    getCurrDir() + file + (property ? '#/' + property : '')
                )).resolved;
        } catch (err) {
            alert('catch:' + err);
            throw err;
        }
    };

    let fileData;
    const work = $p.get('work');
    const fileGroup = filesObj.groups.find((fg) => {
        fileData = fg.files.find((file) =>
            work === lf(['workNames', fg.id, file.name])
        );
        return Boolean(fileData);
    });

    const fp = this.getFilePaths(filesObj, fileGroup, fileData);
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
    if (this.allowPlugins) {
        const pluginFieldMapping = filesObj['plugin-field-mapping'];
        const pluginFieldMappingID = pluginFieldMapping[fileGroup.id];
        const possiblePluginFieldMappingForWork = pluginFieldMappingID[fileData.name];
        if (possiblePluginFieldMappingForWork) {
            pluginFieldsForWork = Object.keys(possiblePluginFieldMappingForWork);
            pluginsInWork = Object.keys(filesObj.plugins).filter((p) => {
                return pluginFieldsForWork.includes(p);
            });
            pluginFieldMappingForWork = pluginsInWork.map((p) => {
                return possiblePluginFieldMappingForWork[p];
            });
            pluginPaths = pluginsInWork.map((p) => filesObj.plugins[p].path);
            getPlugins = this.allowPlugins && pluginsInWork;
        }
    }
    const metadataObj = await getMetadata(metadataFile, metadataProperty);
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
        getPlugins ? Promise.all(
            pluginPaths.map((pluginPath) => {
                return import(pluginPath);
            })
        ) : null
    ]);
};

// Need for directionality even if language specified (and we don't want
//   to require it as a param)
TextBrowser.prototype.getDirectionForLanguageCode = function (code) {
    const langs = this.langData.languages;
    return langs.find((lang) =>
        lang.code === code
    ).direction;
};

TextBrowser.prototype.getFieldNameAndValueAliases = function ({
    field, schemaItems, metadataObj, getFieldAliasOrName, getMetaProp
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
                    getMetaProp(metadataObj, ['fieldvalue', field, enm], true)
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

TextBrowser.prototype.getBrowseFieldData = function ({
    metadataObj, getMetaProp, schemaItems, getFieldAliasOrName
}, cb) {
    metadataObj.table.browse_fields.forEach((browseFieldSetObject, i) => {
        if (typeof browseFieldSetObject === 'string') {
            browseFieldSetObject = {set: [browseFieldSetObject]};
        }
        if (!browseFieldSetObject.name) {
            browseFieldSetObject.name = browseFieldSetObject.set.join(',');
        }

        const setName = browseFieldSetObject.name;
        const fieldSets = browseFieldSetObject.set;
        const presort = browseFieldSetObject.presort;
        // Todo: Deal with ['td', [['h3', [ld(browseFieldObject.name)]]]]
        //          as kind of fieldset

        const browseFields = fieldSets.map((field) =>
            this.getFieldNameAndValueAliases({
                field, schemaItems, metadataObj,
                getFieldAliasOrName, getMetaProp
            })
        );
        cb({setName, browseFields, i, presort}); // eslint-disable-line standard/no-callback-literal
    });
};

// Todo: Break this up further
TextBrowser.prototype.paramChange = async function () {
    const langs = this.langData.languages;

    document.body.replaceWith(Templates.defaultBody());

    // Todo: Could give option to i18nize 'lang' or omit
    const $p = this.$p = new IntlURLSearchParams();

    const followParams = () => {
        location.hash = '#' + $p.toString();
    };
    const localePass = (lcl) =>
        langs.map(({code}) => code).includes(lcl) ? lcl : false;

    const languageParam = $p.get('lang', true);

    // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice
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
            prop = (allowObjects || typeof strings === 'string')
                ? strings
                : undefined;
            return prop;
        });
        return prop;
    }

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
    /* const persistent = */ await navigator.storage.persisted();
    console.log(
        'navigator.serviceWorker.controller',
        navigator.serviceWorker.controller
    );
    let siteI18n;
    if (
        // User may not want to persist, so comment out so we don't bother with dialog
        // !persistent // ||

        // User may have persistence via bookmarks, etc. but just not
        //     want commital on notification
        // Notification.permission === 'default' ||

        // We always expect a controller, so is probably first visit
        !localStorage.getItem(this.namespace + '-refused') && // Not show if refused before
        !navigator.serviceWorker.controller
    ) {
        siteI18n = await new Promise((resolve, reject) => {
            // Duplicated in resultsDisplay
            const escapeHTML = (s) => {
                return !s
                    ? ''
                    : s.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/, '&gt;');
            };
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
            const close = () => {
                // Easier not to use `await` here
                Promise.resolve().then(async () => {
                    if (!requestPermissionsDialog.returnValue) {
                        // Todo: We could go forward with worker, caching files, and
                        //    indexedDB regardless of permissions, but this way
                        //    we can continue to gauge performance differences for now
                        localStorage.setItem(
                            this.namespace + '-refused',
                            'true'
                        );
                        return;
                    }
                    Templates.permissions.addLogEntry({
                        text: 'Beginning install...'
                    });

                    // denied|default|granted
                    switch (requestPermissionsDialog.returnValue) {
                    case 'denied':
                        return;
                    case 'default':
                        return;
                    case 'granted':
                        const [userDataFiles, persistent] = await Promise.all([
                            this.getWorkFiles(),
                            // Note that it will convert prior caches to
                            //   persistent ones as well
                            navigator.storage.persist()
                        ]);
                        if (!persistent) {
                            return Templates.permissions.browserNotGrantingPersistence();
                        }
                        Templates.permissions.addLogEntry({
                            text: 'Received work files'
                        });

                        // Todo: We might wish to allow avoiding the other locale files
                        //   and if only one chosen, switch to the work selection page
                        //   in that language
                        /*
                        (Configurable) Strategy options

                        - Wait and put everything in an `install` `waitUntil` after we've retrieved
                        the user JSON, informing the user that they must wait for everything to
                        download and ensure they can go completely offline (especially for sites
                        which don't have that much offline content).
                        - A safer bet (especially for non-hardcore users) is to pre-cache the
                        necessary files for this app, and download the rest as available. However,
                        if the user attempts to download while they are offline before
                        they got all files, we'll need to show a notice. The *TextBrowser* source
                        files, the user's files list and locales should be enough.

                        For either option, we might possibly (and user-optionally) send a notice
                        (whose approval we've asked for already) when all files are complete,
                        */

                        console.log(
                            '--ready to register service worker',
                            this.serviceWorkerPath
                        );
                        // `persist` will grandfather non-persisted caches, so if we don't end up
                        //    using `install` event for dynamic items, we could put the service worker
                        //    registration at the beginning of the file without waiting for persistence
                        //    approval (or at least after rendering page to avoid "jankiness"); however,
                        //    as we want to show a dialog about permissions first, we wait until here.
                        const r = await navigator.serviceWorker.register(
                            this.serviceWorkerPath
                        );
                        const ready = await new Promise((resolve, reject) => {
                            Templates.permissions.addLogEntry({
                                text: 'Worker registered'
                            });
                            navigator.serviceWorker.onmessage = (e) => {
                                const {data} = e;
                                console.log('msg1', data, r);
                                if (data === 'finishedActivate') {
                                    Templates.permissions.addLogEntry({
                                        text: 'Finished activation...'
                                    });
                                    // Still not controlled even after activation is
                                    //    ready, so refresh page

                                    // Seems to be working (unlike `location.replace`),
                                    //  but if problems, could add `true` but as forces
                                    //  from server not cache, what will happen here?
                                    location.reload();
                                    // location.replace(location); // Avoids adding to browser history)
                                    // resolve(); // This will cause jankiness and unnecessarily show languages selection
                                    return;
                                }
                                if (data.activationError) {
                                    const {message, dbError, errorType} = data;
                                    const err = new Error(message);
                                    err.dbError = dbError;
                                    err.errorType = errorType;
                                    reject(err);
                                    return;
                                }
                                if (r.active) { // Just use `e.source`?
                                    Templates.permissions.addLogEntry({
                                        text: 'Finished caching'
                                    });
                                    Templates.permissions.addLogEntry({
                                        text: 'Beginning activation (database resources)...'
                                    });
                                    console.log('active1', e);
                                    r.active.postMessage({
                                        type: 'activate',
                                        namespace: this.namespace,
                                        filesJSONPath: this.files
                                    });
                                }
                            };
                            // No need to expect a message from the installing event,
                            //   as the `register` call seems to get called if ready
                            if (r.installing) {
                                console.log('installingggg');
                                const langPathParts = this.languages.split('/');
                                const localeFiles = langs.map(
                                    ({locale: {$ref}}) =>
                                        (langPathParts.length > 1
                                            ? langPathParts.slice(0, -1).join('/') + '/'
                                            : ''
                                        ) + $ref
                                );
                                Templates.permissions.addLogEntry({
                                    text: 'Beginning caching of files...'
                                });
                                r.installing.postMessage({
                                    type: 'install',
                                    namespace: this.namespace,
                                    localeFiles,
                                    userDataFiles, // including plugins, etc.
                                    userStaticFiles: this.staticFilesToCache
                                });
                                /*
                                const r = await navigator.serviceWorker.ready;
                                console.log('SWWWWW ready!', r.active);
                                r.active.postMessage({
                                    type: 'activate',
                                    namespace: this.namespace,
                                    filesJSONPath: this.files
                                });
                                */
                            }
                            // If activated, we'll continue
                            if (navigator.serviceWorker.controller) {
                                resolve();
                            }
                        });
                        return ready;
                        /*
                        const controller = navigator.serviceWorker.controller ||
                            (await navigator.serviceWorker.ready).active;
                        console.log('r', this.serviceWorkerPath);
                        const messageChannel = new MessageChannel();
                        messageChannel.port1.onmessage = (e) => {
                            if (e.data.error) {
                                console.log('err', e.data.error);
                            } else {
                                console.log('data', e.data);
                            }
                        };
                        controller.postMessage('test', [messageChannel.port2]);
                        */
                    }
                }).then(() => resolve(l))
                    .catch((err) => {
                        if (err && typeof err === 'object') {
                            const {message, errorType, dbError} = err;
                            if (message === 'versionchange') {
                                Templates.permissions.versionChange();
                                return;
                            }
                            if (dbError) {
                                Templates.permissions.dbError({
                                    errorType,
                                    escapedErrorMessage: escapeHTML(message)
                                });
                                return;
                            }
                        }
                        Templates.permissions.errorRegistering(
                            escapeHTML(err && err.message)
                        );
                    });
            };
            const l = getSiteI18n();
            const [requestPermissionsDialog, browserNotGrantingPersistenceAlert] = // , errorRegisteringNotice
                Templates.permissions.main({
                    l, ok, refuse, close, closeBrowserNotGranting
                });
            requestPermissionsDialog.showModal();
        });
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
            this.workSelect({
                lang, localeFromFileData, fallbackLanguages,
                getMetaProp, $p, followParams
            }, ...args);
            return;
        }
        if (!result) {
            this.workDisplay({
                lang, preferredLocale, localeFromFileData,
                fallbackLanguages, getMetaProp,
                $p, localeFromLangData
            }, ...args);
            return;
        }
        this.resultsDisplay({
            l: l10n,
            imfLocales: imf.locales,
            $p, lang,
            localeFromFileData, fallbackLanguages,
            getMetaProp
        }, ...args);
    };
    // Todo: Change to Promise and return!
    const imf = IMF({
        languages: lang,
        fallbackLanguages,
        localeFileResolver: (code) => {
            // Todo: For editing of locales, we might instead resolve all
            //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
            //    replace IMF() loadLocales behavior with our own now resolved
            //    locales; see https://github.com/jdorn/json-editor/issues/132
            return this.langData.localeFileBasePath + langs.find((l) =>
                l.code === code
            ).locale.$ref;
        },
        callback: localeCallback
    });
};

export default TextBrowser;
