/* globals TextBrowser, Templates, JsonRefs */
TextBrowser.prototype.resultsDisplay = function resultsDisplay ({
    l, lang, localeFromFileData, fallbackLanguages, $p, imfLocales, getMetaProp
}) {
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
            console.log('pppp', param, '::', p);
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
            this.getBrowseFieldData({metadataObj, getMetaProp, schemaItems, getFieldAliasOrName}, ({
                browseFields, presort
            }) => {
                presorts.push(presort);
                browseFieldSets.push(browseFields);
            });
            const fieldValueAliasMap = schemaItems.map(({title: field}) => {
                const {preferAlias, fieldValueAliasMap} = this.getFieldNameAndValueAliases({
                    field, schemaItems, metadataObj, getFieldAliasOrName, getMetaProp
                });
                if (fieldValueAliasMap) {
                    Object.entries(fieldValueAliasMap).forEach(([key, val]) => {
                        if (Array.isArray(val)) {
                            fieldValueAliasMap[key] = val.map((v) => v + ' (' + key + ')');
                            return;
                        }
                        if (val && typeof val === 'object') {
                            if (typeof preferAlias === 'string') {
                                fieldValueAliasMap[key] = val[preferAlias] + ' (' + key + ')';
                            } else {
                                Object.entries(val).forEach(([k, v]) => {
                                    fieldValueAliasMap[key][k] = v + ' (' + key + ')';
                                });
                            }
                            return;
                        }
                        fieldValueAliasMap[key] = val + ' (' + key + ')';
                    });
                    return preferAlias !== false ? fieldValueAliasMap : undefined;
                }
            });
            const localizedFieldNames = schemaItems.map((si) => getFieldAliasOrName(si.title));
            Templates.resultsDisplay.main({
                tableData, schemaItems, $p, $pRaw, $pRawEsc, $pEscArbitrary,
                escapeQuotedCSS, escapeCSS, escapeHTML,
                heading, l, browseFieldSets, presorts,
                localizedFieldNames, fieldValueAliasMap,
                interlinearSeparator: this.interlinearSeparator
            });
        });
    });
};
