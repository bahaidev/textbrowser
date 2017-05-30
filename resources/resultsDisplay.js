/* globals TextBrowser, Templates, JsonRefs, jml */
TextBrowser.prototype.resultsDisplay = function resultsDisplay ({
    l, lang, localeFromFileData, fallbackLanguages, $p
}) {
    this.getWorkData({lang, localeFromFileData, fallbackLanguages, $p}).then((
        [fileData, lf, schemaObj, metadataObj, pluginKeys, pluginFieldMappings, pluginObjects]
    ) => {
        console.log('pluginKeys', pluginKeys);
        console.log('pluginFieldMappings', pluginFieldMappings);
        console.log('pluginObjects', pluginObjects);

        // Todo: Needs to actually take params into account!
        JsonRefs.resolveRefs(fileData.file).then(({resolved: {data: tableData}}) => {
            jml('table', {border: '1'}, tableData.map((tr) => ['tr',
                tr.map((td) => ['td',
                    // [td] // Todo: For non-escaped!!!!
                    {innerHTML: td}
                ])
            ]), document.body);
        });

        document.title = l({
            key: 'browserfile-resultsdisplay',
            values: {
                work: this.fileData
                    ? l({key: ['tablealias', $p.get('work')], fallback: true})
                    : ''
            },
            fallback: true
        });
        Templates.resultsDisplay.main();
    });
};
