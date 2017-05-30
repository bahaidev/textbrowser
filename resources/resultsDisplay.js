/* globals TextBrowser, Templates, JsonRefs */
TextBrowser.prototype.resultsDisplay = function resultsDisplay ({
    l, lang, localeFromFileData, fallbackLanguages, $p, imfLocales
}) {
    const $pRaw = (param) => {
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
        return key || p; // $p.get(param, true);
    };
    const escapeQuotedCSS = (s) => s.replace(/"/g, '\\"');
    const escapeCSS = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/, '&gt;');
    this.getWorkData({lang, localeFromFileData, fallbackLanguages, $p}).then((
        [fileData, lf, schemaObj, metadataObj, pluginKeys, pluginFieldMappings, pluginObjects]
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

        // Todo: Needs to actually take params into account!
        JsonRefs.resolveRefs(fileData.file).then(({resolved: {data: tableData}}) => {
            const schemaItems = schemaObj.items.items;
            Templates.resultsDisplay.main({
                tableData, schemaItems, $p, $pRaw, escapeQuotedCSS, escapeCSS
            });
        });
    });
};
