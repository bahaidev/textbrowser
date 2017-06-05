/* globals TextBrowser, Templates, JsonRefs */
TextBrowser.prototype.resultsDisplay = function resultsDisplay ({
    l, lang, localeFromFileData, fallbackLanguages, $p, imfLocales, getMetaProp
}) {
    const getCellValue = ({
        fieldValueAliasMap, escapeColumnIndexes
    }) => ({
        tr, idx
    }) => {
        let tdVal = (fieldValueAliasMap[idx] !== undefined
            ? fieldValueAliasMap[idx][tr[idx]]
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
            ? escapeHTML(tdVal)
            : tdVal;
    };
    const determineEnd = ({
        fieldValueAliasMap, localizedFieldNames, applicableBrowseFieldNames, starts, ends
    }) => ({
        tr, foundState
    }) => {
        const rowIDParts = applicableBrowseFieldNames.map((fieldName) => {
            const idx = localizedFieldNames.indexOf(fieldName);
            // This works to put alias in anchor but this includes
            //   our ending parenthetical, the alias may be harder
            //   to remember and/or automated than original (e.g.,
            //   for a number representing a book), and there could
            //   be multiple aliases for a value; we may wish to
            //   switch this (and also for other browse field-based
            //   items).
            return fieldValueAliasMap[idx] !== undefined
                ? fieldValueAliasMap[idx][tr[idx]]
                : tr[idx];
            // return tr[idx];
        });

        // Todo: Use schema to determine each and use `parseInt`
        //   on other value instead of `String` conversions
        if (!foundState.start) {
            if (starts.some((part, i) => {
                const rowIDPart = rowIDParts[i];
                return Array.isArray(rowIDPart)
                    ? !rowIDPart.some((rip) => starts[i] === String(rip))
                    : (rowIDPart && typeof rowIDPart === 'object'
                        ? !Object.values(rowIDPart).some((rip) => starts[i] === String(rip))
                        : starts[i] !== String(rowIDPart)
                    );
            })) {
                return false;
            }
            foundState.start = true;
        }
        // This doesn't go in an `else` for the above in case the start is the end
        if (ends.every((part, i) => {
            const rowIDPart = rowIDParts[i];
            return Array.isArray(rowIDPart)
                ? rowIDPart.some((rip) => ends[i] === String(rip))
                : (rowIDPart && typeof rowIDPart === 'object'
                    ? Object.values(rowIDPart).some((rip) => ends[i] === String(rip))
                    : ends[i] === String(rowIDPart)
                );
        })) {
            foundState.end = true;
        } else if (foundState.end) { // If no longer matching, return
            return true;
        }
        return rowIDParts.join('-'); // rowID;
    };
    const getCheckedAndInterlinearFieldInfo = ({
        localizedFieldNames
    }) => () => {
        let i = 1;
        let field, checked;
        let checkedFields = [];
        do {
            field = $p.get('field' + i, true);
            checked = $p.get('checked' + i, true);
            i++;
            if (field && checked === l('yes')) {
                checkedFields.push(field);
            }
        } while (field);
        checkedFields = checkedFields.filter((cf) => localizedFieldNames.includes(cf));
        const checkedFieldIndexes = checkedFields.map((cf) => localizedFieldNames.indexOf(cf));
        const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
            const interlin = $p.get('interlin' + (i + 1), true);
            return interlin && interlin.split(/\s*,\s*/).map((col) =>
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
            const startSep = Templates.resultsDisplay.startSeparator({l});
            const innerBrowseFieldSeparator = Templates.resultsDisplay.innerBrowseFieldSeparator({l});

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
                    Templates.resultsDisplay.ranges({l, startRange, endVals, rangeNames})
                );
            };
            const ranges = buildRanges();
            caption = Templates.resultsDisplay.caption({heading, ranges});
        }
        return [hasCaption, caption];
    };
    const setAnchor = ({ilRaw, iil, max}) => {
        // Check if user added this (e.g., even to end of URL with
        //   other anchor params)
        let anchor;
        const anchorRowCol = ilRaw('anchorrowcol');
        if (anchorRowCol) {
            anchor = Templates.resultsDisplay.anchorRowCol({anchorRowCol});
        }
        if (!anchor) {
            const anchors = [];
            let anchorField = '';
            for (let i = 1, breakout; !breakout && !anchors.length; i++) {
                for (let j = 1; ; j++) {
                    const anchorText = 'anchor' + i + '-' + j;
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
                    anchors.push(anchor);
                    // anchors.push({anchorText, anchor});
                }
            }

            if (anchors.length) {
                const escapeSelectorAttValue = (str) => (str || '').replace(/["\\]/g, '\\$&');
                const escapedRow = escapeSelectorAttValue(anchors.join('-'));
                const escapedCol = anchorField
                    ? escapeSelectorAttValue(anchorField)
                    : undefined;
                anchor = Templates.resultsDisplay.anchors({
                    escapedRow, escapedCol
                });
            }
        }
        if (anchor) {
            anchor.scrollIntoView();
        }
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
    const getFieldValueAliasMap = ({schemaItems, metadataObj, getFieldAliasOrName}) => {
        return schemaItems.map(({title: field}) => {
            const {preferAlias, fieldValueAliasMap} = this.getFieldNameAndValueAliases({
                field, schemaItems, metadataObj, getFieldAliasOrName, getMetaProp
            });
            if (fieldValueAliasMap) {
                Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
                    if (Array.isArray(val)) {
                        fieldValueAliasMap[key] = val.map((value) =>
                            Templates.resultsDisplay.fieldValueAlias({key, value})
                        );
                        return;
                    }
                    if (val && typeof val === 'object') {
                        if (typeof preferAlias === 'string') {
                            fieldValueAliasMap[key] =
                                Templates.resultsDisplay.fieldValueAlias({
                                    key, value: val[preferAlias]
                                });
                        } else {
                            Object.entries(val).forEach(([k, value]) => {
                                fieldValueAliasMap[key][k] =
                                    Templates.resultsDisplay.fieldValueAlias({
                                        key, value
                                    });
                            });
                        }
                        return;
                    }
                    fieldValueAliasMap[key] =
                        Templates.resultsDisplay.fieldValueAlias({key, value: val});
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
    const escapeHTML = (s) => !s ? '' : s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;');
    const escapeCSS = escapeHTML;
    const $pRawEsc = (param) => escapeHTML($pRaw(param));
    const $pEscArbitrary = (param) => escapeHTML($p.get(param, true));

    this.getWorkData({lang, localeFromFileData, fallbackLanguages, $p, getMetaProp}).then((
        [fileData, lf, getFieldAliasOrName, schemaObj, metadataObj, pluginKeys, pluginFieldMappings, pluginObjects]
    ) => {
        console.log('pluginKeys', pluginKeys);
        console.log('pluginFieldMappings', pluginFieldMappings);
        console.log('pluginObjects', pluginObjects);

        document.title = l({
            key: 'browserfile-resultsdisplay',
            values: {
                work: this.fileData
                    ? l({key: ['tablealias', $p.get('work')], fallback: true})
                    : ''
            },
            fallback: true
        });

        const heading = getMetaProp(metadataObj, 'heading');
        // Todo: Needs to actually take params into account!
        JsonRefs.resolveRefs(fileData.file).then(({resolved: {data: tableData}}) => {
            const schemaItems = schemaObj.items.items;
            const browseFieldSets = [];
            const presorts = [];
            this.getBrowseFieldData({
                metadataObj, getMetaProp, schemaItems, getFieldAliasOrName
            }, ({browseFields, presort}) => {
                presorts.push(presort);
                browseFieldSets.push(browseFields);
            });
            const fieldValueAliasMap = getFieldValueAliasMap({
                schemaItems, metadataObj, getFieldAliasOrName
            });

            const localizedFieldNames = schemaItems.map((si) => getFieldAliasOrName(si.title));
            const escapeColumnIndexes = schemaItems.map((si) => si.format !== 'html');

            // Todo: Repeats some code in workDisplay; probably need to reuse
            //   these functions more in `Templates.resultsDisplay` too
            const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
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
                ? (key, suffix = '') => $p.get(iil(key) + suffix, true)
                : (key, suffix = '') => $p.get(key + suffix, true);

            const browseFieldSetIdx = browseFieldSets.findIndex((item, i) =>
                typeof iilRaw('start', (i + 1) + '-1') === 'string'
            );
            const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
            const applicableBrowseFieldNames = applicableBrowseFieldSet.map((abfs) =>
                abfs.fieldName
            );
            const presort = presorts[browseFieldSetIdx];
            runPresort({presort, tableData, applicableBrowseFieldNames, localizedFieldNames});

            const buildRangePoint = (startOrEnd) =>
                applicableBrowseFieldNames.map((bfn, j) =>
                    // Todo: i18nize?
                    $p.get(
                        startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1),
                        true
                    )
                );
            const starts = buildRangePoint('start');
            const ends = buildRangePoint('end');

            const [hasCaption, caption] = getCaption({
                starts, ends, applicableBrowseFieldNames, heading
            });
            const showInterlinTitles = $pRaw('interlintitle') === '1';

            Templates.resultsDisplay.main({
                tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
                escapeQuotedCSS, escapeCSS, escapeHTML,
                l, localizedFieldNames,
                caption, hasCaption, showInterlinTitles,
                determineEnd: determineEnd({
                    fieldValueAliasMap, localizedFieldNames, applicableBrowseFieldNames,
                    starts, ends
                }),
                getCellValue: getCellValue({
                    fieldValueAliasMap, escapeColumnIndexes, escapeHTML
                }),
                getCheckedAndInterlinearFieldInfo: getCheckedAndInterlinearFieldInfo({
                    localizedFieldNames
                }),
                interlinearSeparator: this.interlinearSeparator
            });

            setAnchor({ilRaw, iil, max: browseFieldSets.length});
        });
    });
};
