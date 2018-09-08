/* eslint-env browser */
import Templates from './templates/index.js';
import {escapeHTML} from './utils/sanitize.js';
import {
    getMetaProp, Metadata, getFieldNameAndValueAliases, getBrowseFieldData
} from './utils/Metadata.js';
import {getLangDir} from 'rtl-detect';
import {Languages} from './utils/Languages.js';
import {getWorkData} from './utils/WorkInfo.js';
// Keep this as the last import for Rollup
import JsonRefs from 'json-refs/browser/json-refs-standalone-min.js';
import {jml} from 'jamilih';

const fieldValueAliasRegex = /^.* \((.*?)\)$/;

const getRawFieldValue = (v) => typeof v === 'string'
    ? v.replace(fieldValueAliasRegex, '$1')
    : v;

const setAnchor = ({
    applicableBrowseFieldSet,
    fieldValueAliasMapPreferred, ilRaw, iil, max, $p
}) => {
    const applicableBrowseFieldSchemaIndexes = applicableBrowseFieldSet.map((abfs) =>
        abfs.fieldSchemaIndex
    );
    // Check if user added this (e.g., even to end of URL with
    //   other anchor params)
    const work = $p.get('work');
    let anchor;
    const anchorRowCol = ilRaw('anchorrowcol');
    if (anchorRowCol) {
        anchor = Templates.resultsDisplayClient.anchorRowCol({anchorRowCol});
    }
    if (!anchor) {
        const anchors = [];
        let anchorField = '';
        for (let i = 1, breakout; !breakout && !anchors.length; i++) {
            for (let j = 1; ; j++) {
                const anchorText = work + '-' + 'anchor' + i + '-' + j;
                const anchor = $p.get(anchorText, true);
                if (!anchor) {
                    if (i === max || // No more field sets to check
                        anchors.length // Already had anchors found
                    ) {
                        breakout = true;
                    }
                    break;
                }
                anchorField = $p.get(iil('anchorfield') + i, true);

                const x = applicableBrowseFieldSchemaIndexes[j - 1];
                const rawVal = getRawFieldValue(anchor);
                const raw = fieldValueAliasMapPreferred[x] &&
                    fieldValueAliasMapPreferred[x][rawVal];
                anchors.push(raw || anchor);
                // anchors.push({anchorText, anchor});
            }
        }
        if (anchors.length) {
            const escapeSelectorAttValue = (str) => (str || '').replace(/["\\]/g, '\\$&');
            const escapedRow = escapeSelectorAttValue(anchors.join('-'));
            const escapedCol = anchorField
                ? escapeSelectorAttValue(anchorField)
                : undefined;
            anchor = Templates.resultsDisplayClient.anchors({
                escapedRow, escapedCol
            });
        }
    }
    if (anchor) {
        anchor.scrollIntoView();
    }
};

export const resultsDisplayClient = async function resultsDisplayClient (args) {
    const persistent = await navigator.storage.persisted();
    const skipIndexedDB = this.skipIndexedDB || !persistent || !navigator.serviceWorker.controller;
    const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');

    const {
        fieldInfo, $p,
        browseFieldSets,
        applicableBrowseFieldSet,
        lang, metadataObj, fileData,
        fieldValueAliasMapPreferred, lf, iil, ilRaw,
        templateArgs
    } = await resultsDisplayServerOrClient.call(this, {
        ...args, skipIndexedDB, prefI18n
    });
    document.title = lf({
        key: 'browserfile-resultsdisplay',
        values: {
            work: fileData
                ? getMetaProp(lang, metadataObj, 'alias')
                : ''
        },
        fallback: true
    });
    Templates.resultsDisplayClient.main(templateArgs);
    setAnchor({
        applicableBrowseFieldSet,
        fieldValueAliasMapPreferred, iil, ilRaw,
        $p: args.$p,
        max: browseFieldSets.length
    });
    fieldInfo.forEach(({plugin, applicableField, meta, j}) => {
        if (!plugin) {
            return;
        }
        if (plugin.done) {
            plugin.done({$p, applicableField, meta, j, thisObj: this});
        }
    });
};

export const resultsDisplayServer = async function resultsDisplayServer (args) {
    const {
        templateArgs
    } = await resultsDisplayServerOrClient.call(this, {
        ...args
    });
    // Todo: Should really reconcile this with client-side output options
    //         (as should also have option there to get JSON, Jamilih, etc.
    //         output)
    switch (args.serverOutput) {
    case 'json': default:
        return templateArgs.tableData;
    case 'jamilih':
        return Templates.resultsDisplayServerOrClient.main(templateArgs);
    case 'html':
        const jamilih = Templates.resultsDisplayServerOrClient.main(templateArgs);
        return jml.toHTML(...jamilih);
    }
};

export const resultsDisplayServerOrClient = async function resultsDisplayServerOrClient ({
    l, lang, fallbackLanguages, imfLocales, $p, skipIndexedDB, noIndexedDB, prefI18n,
    files, allowPlugins, langData, basePath = '', dynamicBasePath = ''
}) {
    const languages = new Languages({langData});
    const getCellValue = ({
        fieldValueAliasMapPreferred, escapeColumnIndexes
    }) => ({
        tr, idx
    }) => {
        let tdVal = (fieldValueAliasMapPreferred[idx] !== undefined
            ? fieldValueAliasMapPreferred[idx][tr[idx]]
            : tr[idx]
        );
        if (tdVal && typeof tdVal === 'object') {
            tdVal = Object.values(tdVal);
        }
        if (Array.isArray(tdVal)) {
            tdVal = tdVal.join(l('comma-space'));
        }
        return ((escapeColumnIndexes[idx] || !this.trustFormatHTML) &&
            typeof tdVal === 'string')
            ? {tdVal: escapeHTML(tdVal), htmlEscaped: true}
            : {tdVal};
    };
    const getCanonicalID = ({
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        canonicalBrowseFieldNames
    }) => ({
        tr, foundState
    }) => {
        return canonicalBrowseFieldNames.map((fieldName) => {
            const idx = localizedFieldNames.indexOf(fieldName);
            // This works to put alias in anchor but this includes
            //   our ending parenthetical, the alias may be harder
            //   to remember and/or automated than original (e.g.,
            //   for a number representing a book); we may wish to
            //   switch this (and also for other browse field-based
            //   items).
            if (fieldValueAliasMap[idx] !== undefined) {
                return fieldValueAliasMapPreferred[idx][tr[idx]];
            }
            return tr[idx];
        }).join('-'); // rowID;
    };
    const determineEnd = ({
        fieldValueAliasMap, fieldValueAliasMapPreferred, localizedFieldNames,
        applicableBrowseFieldNames, startsTextOnly, endsTextOnly
    }) => ({
        tr, foundState
    }) => {
        const rowIDPartsPreferred = [];
        const rowIDParts = applicableBrowseFieldNames.map((fieldName) => {
            const idx = localizedFieldNames.indexOf(fieldName);
            // This works to put alias in anchor but this includes
            //   our ending parenthetical, the alias may be harder
            //   to remember and/or automated than original (e.g.,
            //   for a number representing a book), and there could
            //   be multiple aliases for a value; we may wish to
            //   switch this (and also for other browse field-based
            //   items).
            if (fieldValueAliasMap[idx] !== undefined) {
                rowIDPartsPreferred.push(fieldValueAliasMapPreferred[idx][tr[idx]]);
                const val = fieldValueAliasMap[idx][tr[idx]];
                if ( // The original is text so supplied as such in start value
                    typeof val === 'number' ||
                    (Array.isArray(val) && val.every((v) => typeof v === 'number'))
                ) {
                    return tr[idx];
                }
                return val;
            }
            rowIDPartsPreferred.push(tr[idx]);
            return tr[idx];
        });

        // Todo: Use schema to determine each and use `parseInt`
        //   on other value instead of `String` conversions
        if (!foundState.start) {
            if (startsTextOnly.some((part, i) => {
                const rowIDPart = rowIDParts[i];
                return Array.isArray(rowIDPart)
                    ? !rowIDPart.some((rip) => part === String(rip))
                    : (rowIDPart && typeof rowIDPart === 'object'
                        ? !Object.values(rowIDPart).some((rip) => part === String(rip))
                        : part !== String(rowIDPart)
                    );
            })) {
                // Trigger skip of this row
                return false;
            }
            foundState.start = true;
        }
        // This doesn't go in an `else` for the above in case the start is the end
        if (endsTextOnly.every((part, i) => {
            const rowIDPart = rowIDParts[i];
            return Array.isArray(rowIDPart)
                ? rowIDPart.some((rip) => part === String(rip))
                : (rowIDPart && typeof rowIDPart === 'object'
                    ? Object.values(rowIDPart).some((rip) => part === String(rip))
                    : part === String(rowIDPart)
                );
        })) {
            foundState.end = true;
        } else if (foundState.end) { // If no longer matching, trigger end of the table
            return true;
        }
        return rowIDPartsPreferred.join('-'); // rowID;
    };
    const getCheckedAndInterlinearFieldInfo = ({
        localizedFieldNames
    }) => {
        let i = 1;
        let field, checked;
        let checkedFields = [];
        do {
            field = $p.get('field' + i, true);
            checked = $p.get('checked' + i, true);
            i++;
            if (field && (
                checked === l('yes') || checked === null // Default to "on"
            )) {
                checkedFields.push(field);
            }
        } while (field);
        checkedFields = checkedFields.filter((cf) => localizedFieldNames.includes(cf));
        const checkedFieldIndexes = checkedFields.map((cf) => localizedFieldNames.indexOf(cf));
        const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
            const interlin = $p.get('interlin' + (cfi + 1), true);
            return interlin && interlin.split(/\s*,\s*/).map((col) =>
                // Todo: Avoid this when known to be integer or if string, though allow
                //    string to be treated as number if config is set.
                parseInt(col, 10) - 1
            ).filter((n) => !Number.isNaN(n));
        });
        return [checkedFields, checkedFieldIndexes, allInterlinearColIndexes];
    };
    const getCaption = ({starts, ends, applicableBrowseFieldNames, heading}) => {
        let caption;
        const hasCaption = $pRaw('caption') !== '0';
        if (hasCaption) {
            /*
            // Works but displays in parentheses browse fields which
            //  may be non-applicable
            const buildRangePoint = (startOrEnd) => escapeHTML(
                browseFieldSets.reduce((txt, bfs, i) =>
                    (txt ? txt + ' (' : '') + bfs.map((bf, j) =>
                        (j > 0 ? l('comma-space') : '') + bf + ' ' +
                            $pRaw(startOrEnd + (i + 1) + '-' + (j + 1))
                    ).join('') + (txt ? ')' : ''), '')
            );
            */
            /*
            // Works but overly long
            const buildRangePoint = (startOrEnd) => escapeHTML(
                applicableBrowseFieldSet.map((bf, j) =>
                    (j > 0 ? l('comma-space') : '') + bf + ' ' +
                        $pRaw(startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1))
                ).join('')
            );
            */
            const startSep = Templates.resultsDisplayServerOrClient.startSeparator({l});
            const innerBrowseFieldSeparator = Templates.resultsDisplayServerOrClient
                .innerBrowseFieldSeparator({l});

            const buildRanges = () => {
                const endVals = [];
                const startRange = starts.reduce((str, startFieldValue, i) => {
                    const ret = str + startFieldValue;
                    if (startFieldValue === ends[i]) { // We abbreviate as start/end share same Book, etc.
                        return ret +
                            (i > 0
                                ? innerBrowseFieldSeparator // e.g., for "Genesis 7, 5-8"
                                : ' ' // e.g., for 2nd space in "Surah 2 5-8"
                            );
                    }
                    endVals.push(ends[i]);
                    return ret + startSep;
                }, '').slice(0, -(startSep.length));

                const rangeNames = applicableBrowseFieldNames.join(innerBrowseFieldSeparator);
                return escapeHTML(
                    Templates.resultsDisplayServerOrClient.ranges({l, startRange, endVals, rangeNames})
                );
            };
            const ranges = buildRanges();
            caption = Templates.resultsDisplayServerOrClient.caption({heading, ranges});
        }
        return [hasCaption, caption];
    };
    const runPresort = ({presort, tableData, applicableBrowseFieldNames, localizedFieldNames}) => {
        // Todo: Ought to be checking against an aliased table
        if (presort) {
            tableData.sort((rowA, rowB) => {
                let precedence;
                applicableBrowseFieldNames.some((fieldName) => {
                    const idx = localizedFieldNames.indexOf(fieldName);
                    const rowAFirst = rowA[idx] < rowB[idx];
                    const rowBFirst = rowA[idx] > rowB[idx];
                    precedence = rowBFirst ? 1 : -1;
                    return rowAFirst || rowBFirst; // Keep going if 0
                });
                return precedence;
            });
        }
    };
    const getFieldValueAliasMap = ({
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias
    }) => {
        return fieldInfo.map(({field, plugin}) => {
            if (plugin) {
                return;
            }
            const {preferAlias, fieldValueAliasMap} = getFieldNameAndValueAliases({
                field, schemaItems, metadataObj, getFieldAliasOrName, lang
            });
            if (!usePreferAlias) {
                return preferAlias !== false ? fieldValueAliasMap : undefined;
            }
            if (fieldValueAliasMap) {
                Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        fieldValueAliasMap[key] = val.map((value) =>
                            Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value})
                        );
                        return;
                    }
                    if (val && typeof val === 'object') {
                        if (typeof preferAlias === 'string') {
                            fieldValueAliasMap[key] =
                                Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                    key, value: val[preferAlias]
                                });
                        } else {
                            Object.entries(val).forEach(([k, value]) => {
                                fieldValueAliasMap[key][k] =
                                    Templates.resultsDisplayServerOrClient.fieldValueAlias({
                                        key, value
                                    });
                            });
                        }
                        return;
                    }
                    fieldValueAliasMap[key] =
                        Templates.resultsDisplayServerOrClient.fieldValueAlias({key, value: val});
                });
                return preferAlias !== false ? fieldValueAliasMap : undefined;
            }
        });
    };
    const $pRaw = (param, avoidLog) => {
        // Todo: Should work with i18n=true (if names i18nized, need reverse look-up)
        let key;
        const p = $p.get(param, true);
        function reverseLocaleLookup (locale) {
            if (Array.isArray(locale)) {
                return locale.some(reverseLocaleLookup);
            }
            const localeValues = Object.values(locale);
            return localeValues.some((val, i) => {
                if (typeof val !== 'string') {
                    return reverseLocaleLookup(val);
                }
                if (val === p) {
                    key = Object.keys(locale)[i];
                    return true;
                }
            });
        }
        reverseLocaleLookup(imfLocales);
        if (!key && !avoidLog) {
            console.log('Bad param/value', param, '::', p);
        }
        return key; // || p; // $p.get(param, true);
    };
    const escapeQuotedCSS = (s) => s.replace(/"/g, '\\"');
    const escapeCSS = escapeHTML;
    const $pRawEsc = (param) => escapeHTML($pRaw(param));
    const $pEscArbitrary = (param) => escapeHTML($p.get(param, true));

    const {
        fileData, lf, getFieldAliasOrName, schemaObj, metadataObj,
        pluginsForWork
    } = await getWorkData({
        files: files || this.files,
        allowPlugins: allowPlugins || this.allowPlugins,
        lang, fallbackLanguages, $p,
        basePath
    });
    console.log('pluginsForWork', pluginsForWork);

    const heading = getMetaProp(lang, metadataObj, 'heading');
    const schemaItems = schemaObj.items.items;

    const setNames = [];
    const presorts = [];
    const browseFieldSets = [];
    getBrowseFieldData({
        metadataObj, schemaItems, getFieldAliasOrName, lang,
        callback ({setName, browseFields, presort}) {
            setNames.push(setName);
            presorts.push(presort);
            browseFieldSets.push(browseFields);
        }
    });

    const fieldInfo = schemaItems.map(({title: field, format}) => {
        return {
            field,
            fieldAliasOrName: getFieldAliasOrName(field) || field,
            escapeColumn: format !== 'html',
            fieldLang: metadataObj.fields[field].lang
        };
    });

    const [preferredLocale] = lang;
    const metadata = new Metadata({metadataObj});
    if (pluginsForWork) {
        console.log('pluginsForWork', pluginsForWork);
        const {lang} = this; // array with first item as preferred
        pluginsForWork.iterateMappings(({
            plugin,
            pluginName, pluginLang,
            onByDefaultDefault,
            placement, applicableFields, meta
        }) => {
            placement = placement === 'end'
                ? Infinity // push
                : placement;
            const processField = ({applicableField, targetLanguage, onByDefault, metaApplicableField} = {}) => {
                const plugin = pluginsForWork.getPluginObject(pluginName);
                const applicableFieldLang = metadata.getFieldLang(applicableField);
                if (plugin.getTargetLanguage) {
                    targetLanguage = plugin.getTargetLanguage({
                        applicableField,
                        targetLanguage,
                        // Default lang for plug-in (from files.json)
                        pluginLang,
                        // Default lang when no target language or
                        //   plugin lang; using the lang of the applicable
                        //   field
                        applicableFieldLang
                    });
                }
                if (targetLanguage === '{locale}') {
                    targetLanguage = preferredLocale;
                }
                const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
                const fieldAliasOrName = plugin.getFieldAliasOrName
                    ? plugin.getFieldAliasOrName({
                        locales: lang,
                        lf,
                        targetLanguage,
                        applicableField,
                        applicableFieldI18N,
                        meta,
                        metaApplicableField,
                        targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
                    })
                    : languages.getFieldNameFromPluginNameAndLocales({
                        pluginName,
                        locales: lang,
                        lf,
                        targetLanguage,
                        applicableFieldI18N,
                        // Todo: Should have formal way to i18nize meta
                        meta,
                        metaApplicableField
                    });
                fieldInfo.splice(
                    // Todo: Allow default placement overriding for
                    //    non-plugins
                    placement,
                    0,
                    {
                        plugin,
                        meta,
                        placement,
                        // field: `${this.namespace}-plugin-${field}`,
                        fieldAliasOrName,
                        escapeColumn: plugin.escapeColumn !== false,
                        // Plug-in specific (todo: allow specifying
                        //    for non-plugins)
                        onByDefault: typeof onByDefault === 'boolean'
                            ? onByDefault
                            : (onByDefaultDefault || false),
                        // Three conventions for use by plug-ins but
                        //     textbrowser only passes on (might
                        //     not need here)
                        applicableField,
                        metaApplicableField,
                        fieldLang: targetLanguage
                    }
                );
            };
            if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
                processField();
            }
        });
    }

    const localizedFieldNames = fieldInfo.map((fi) => fi.fieldAliasOrName);
    const escapeColumnIndexes = fieldInfo.map((fi) => fi.escapeColumn);
    const fieldLangs = fieldInfo.map(({fieldLang}) => {
        return fieldLang !== preferredLocale ? fieldLang : null;
    });
    const fieldValueAliasMap = getFieldValueAliasMap({
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: false
    });
    const fieldValueAliasMapPreferred = getFieldValueAliasMap({
        schemaItems, fieldInfo, metadataObj, getFieldAliasOrName, usePreferAlias: true
    });

    // Todo: Repeats some code in workDisplay; probably need to reuse
    //   these functions more in `Templates.resultsDisplayServerOrClient` too
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
        ? $p.get('i18n', true) === '1'
        : prefI18n === 'true' || (
            prefI18n !== 'false' && this.localizeParamNames
        );
    const il = localizeParamNames
        ? key => l(['params', key])
        : key => key;
    const iil = localizeParamNames
        ? key => l(['params', 'indexed', key])
        : key => key;
    const ilRaw = localizeParamNames
        ? (key, suffix = '') => $p.get(il(key) + suffix, true)
        : (key, suffix = '') => $p.get(key + suffix, true);
    const iilRaw = localizeParamNames
        ? (key, suffix = '') => $p.get($p.get('work') + '-' + iil(key) + suffix, true)
        : (key, suffix = '') => $p.get($p.get('work') + '-' + key + suffix, true);

    // Now that we know `browseFieldSets`, we can parse `startEnd`
    const browseFieldSetStartEndIdx = browseFieldSets.findIndex((item, i) =>
        typeof iilRaw('startEnd', (i + 1)) === 'string'
    );
    if (browseFieldSetStartEndIdx !== -1) {
        // Todo: i18nize (by work and/or by whole app?)
        const rangeSep = '-';
        const partSep = ':';

        // Search box functionality (Todo: not yet in UI)
        // Todo: At least avoid need for book text AND book number in Bible
        // Todo: Change query beginning at 0 to 1 if none present?
        // Todo: Support i18nized or canonical aliases (but don't
        //         over-trim in such cases)
        const rawSearch = (iilRaw('startEnd', browseFieldSetStartEndIdx + 1) || '').trim();
        const [startFull, endFull] = rawSearch.split(rangeSep);
        if (endFull !== undefined) {
            const startPartVals = startFull.split(partSep);
            const endPartVals = endFull.split(partSep);
            const startEndDiff = startPartVals.length - endPartVals.length;
            if (startEndDiff > 0) { // e.g., 5:42:7 - 8 only gets verses 7-8
                endPartVals.unshift(...startPartVals.slice(0, startEndDiff));
            } else if (startEndDiff < 0) { // e.g., 5 - 6:2:1 gets all of book 5 to 6:2:1
                // Todo: We should fill with '0' but since that often
                //    doesn't find anything, we default for now to '1'.
                startPartVals.push(...Array(-startEndDiff).fill('1'));
            }
            console.log('startPartVals', startPartVals);
            console.log('endPartVals', endPartVals);
            startPartVals.forEach((startPartVal, i) => {
                const endPartVal = endPartVals[i];
                $p.set(`start${browseFieldSetStartEndIdx + 1}-${i + 1}`, startPartVal, true);
                $p.set(`end${browseFieldSetStartEndIdx + 1}-${i + 1}`, endPartVal, true);
            });
        }
    }

    const browseFieldSetIdx = browseFieldSets.findIndex((item, i) =>
        typeof iilRaw('start', (i + 1) + '-1') === 'string'
    );
    const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
    const applicableBrowseFieldSetName = setNames[browseFieldSetIdx];
    const applicableBrowseFieldNames = applicableBrowseFieldSet.map((abfs) =>
        abfs.fieldName
    );

    const canonicalBrowseFieldSet = browseFieldSets[0];
    const canonicalBrowseFieldSetName = setNames[0];
    const canonicalBrowseFieldNames = canonicalBrowseFieldSet.map((abfs) =>
        abfs.fieldName
    );

    const fieldSchemaTypes = applicableBrowseFieldSet.map((abfs) => abfs.fieldSchema.type);
    const buildRangePoint = (startOrEnd) =>
        applicableBrowseFieldNames.map((bfn, j) =>
            $p.get(
                $p.get('work') + '-' + startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1),
                true
            )
        );
    const starts = buildRangePoint('start');
    const ends = buildRangePoint('end');

    const [hasCaption, caption] = getCaption({
        starts, ends, applicableBrowseFieldNames, heading
    });
    const showInterlinTitles = $pRaw('interlintitle') === '1';

    console.log('rand', ilRaw('rand') === 'yes');

    const stripToRawFieldValue = (v, i) => {
        let val;
        if (v.match(/^\d+$/) || v.match(fieldValueAliasRegex)) {
            val = getRawFieldValue(v);
        } else {
            const rawFieldValueAliasMap = applicableBrowseFieldSet[i].rawFieldValueAliasMap;
            let dealiased;
            if (rawFieldValueAliasMap) {
                // Look to dealias
                const fvEntries = Object.entries(rawFieldValueAliasMap);
                if (Array.isArray(fvEntries[0][1])) {
                    fvEntries.some(([key, arr]) => {
                        if (arr.includes(v)) {
                            dealiased = key;
                            return true;
                        }
                    });
                } else {
                    fvEntries.some(([key, obj]) => {
                        const arr = Object.values(obj);
                        if (arr.includes(v)) {
                            dealiased = key;
                            return true;
                        }
                    });
                }
            }
            val = dealiased === undefined ? v : dealiased;
        }
        return fieldSchemaTypes[i] === 'integer' ? parseInt(val, 10) : val;
    };

    const unlocalizedWorkName = fileData.name;

    const stripToTextOnly = (part) => {
        return part.replace(/ \(\d+\)$/, ''); // Remove that added to autocomplete aliases used for start/end values
    };
    const startsTextOnly = starts.map(stripToTextOnly);
    const endsTextOnly = ends.map(stripToTextOnly);

    const startsRaw = starts.map(stripToRawFieldValue);
    const endsRaw = ends.map(stripToRawFieldValue);

    let tableData, usingServerData = false;
    // Site owner may have configured to skip (e.g., testing)
    if (!skipIndexedDB &&
        // User may have refused, not yet agreed, or are visiting the
        //   results page directly where we don't ask for the permissions
        //   needed for persistent IndexedDB currently so that people can
        //   be brought to a results page without needing to agree to persist
        //   through notifications (or however)
        !noIndexedDB
    ) {
        tableData = await new Promise((resolve, reject) => {
            // Todo: Fetch the work in code based on the non-localized `datafileName`
            const dbName = this.namespace + '-textbrowser-cache-data';
            const req = indexedDB.open(dbName);
            req.onsuccess = ({target: {result: db}}) => {
                const storeName = 'files-to-cache-' + unlocalizedWorkName;
                const trans = db.transaction(storeName);
                const store = trans.objectStore(storeName);
                // Get among browse field sets by index number within URL params
                const index = store.index(
                    'browseFields-' + applicableBrowseFieldSetName
                );

                // console.log('dbName', dbName);
                // console.log('storeName', storeName);
                // console.log('applicableBrowseFieldSetName', 'browseFields-' + applicableBrowseFieldSetName);

                const r = index.getAll(IDBKeyRange.bound(startsRaw, endsRaw));
                r.onsuccess = ({target: {result}}) => {
                    const converted = result.map((r) => r.value);
                    resolve(converted);
                };
            };
        });
    } else {
        // No need for presorting in indexedDB, given indexes
        const presort = presorts[browseFieldSetIdx];
        // Given that we are not currently wishing to add complexity to
        //   our PHP code (though it is not a problem with Node.js),
        //   we retrieve the whole file and then sort where presorting is
        //   needed
        // if (presort || this.noDynamic) {
        if (this.noDynamic) {
            ({
                resolved: {data: tableData}
            } = await JsonRefs.resolveRefs(fileData.file));
            runPresort({presort, tableData, applicableBrowseFieldNames, localizedFieldNames});
        } else {
            /*
            const jsonURL = Object.entries({
                prefI18n, unlocalizedWorkName, startsRaw, endsRaw
            }).reduce((url, [arg, argVal]) => {
                return url + '&' + arg + '=' + encodeURIComponent((argVal));
            }, `${dynamicBasePath}textbrowser?`);
            */
            const jsonURL = `${dynamicBasePath}textbrowser?${$p.toString()}`;
            tableData = await (await fetch(jsonURL)).json();
            usingServerData = true;
        }
    }
    if (!usingServerData && pluginsForWork) {
        fieldInfo.forEach(({plugin, placement}, j) => {
            if (!plugin) {
                return;
            }
            tableData.forEach((tr, i) => {
                // Todo: We should pass on other arguments (like `meta` but on `applicableFields`)
                tr.splice(
                    placement,
                    0,
                    null // `${i}-${j}`);
                );
            });
        });
        fieldInfo.forEach(({plugin, applicableField, fieldLang, meta, metaApplicableField}, j) => {
            if (!plugin) {
                return;
            }
            const applicableFieldIdx = fieldInfo.findIndex(({field}) => {
                return field === applicableField;
            });
            // Now safe to pass (and set) `j` value as tr array expanded
            tableData.forEach((tr, i) => {
                const applicableFieldText = tr[applicableFieldIdx];
                tr[j] = plugin.getCellData({
                    tr, tableData, i, j, applicableField, fieldInfo,
                    applicableFieldIdx, applicableFieldText, fieldLang,
                    meta, metaApplicableField, $p, thisObj: this
                });
            });
            console.log('applicableFieldIdx', applicableFieldIdx);
        });
    }

    const localeDir = getLangDir(preferredLocale);
    const fieldDirs = fieldLangs.map((langCode) => {
        if (!langCode) {
            return null;
        }
        const langDir = getLangDir(langCode);
        return langDir !== localeDir ? langDir : null;
    });

    const templateArgs = {
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs, fieldDirs,
        caption, hasCaption, showInterlinTitles,
        determineEnd: determineEnd({
            applicableBrowseFieldNames,
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames,
            startsTextOnly, endsTextOnly
        }),
        canonicalBrowseFieldSetName,
        getCanonicalID: getCanonicalID({
            canonicalBrowseFieldNames,
            fieldValueAliasMap, fieldValueAliasMapPreferred,
            localizedFieldNames
        }),
        getCellValue: getCellValue({
            fieldValueAliasMapPreferred, escapeColumnIndexes, escapeHTML
        }),
        checkedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
            localizedFieldNames
        }),
        interlinearSeparator: this.interlinearSeparator
    };
    return {
        fieldInfo,
        $p,
        applicableBrowseFieldSet, fieldValueAliasMapPreferred,
        lf, iil, ilRaw, browseFieldSets,
        lang, metadataObj, fileData,
        templateArgs
    };
};
