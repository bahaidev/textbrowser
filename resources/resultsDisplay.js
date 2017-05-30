/* globals TextBrowser, Templates */
TextBrowser.prototype.resultsDisplay = function resultsDisplay ({
    l, lang, localeFromFileData, fallbackLanguages, $p
}) {
    this.getWorkData({lang, localeFromFileData, fallbackLanguages, $p}).then((
        [fileData, lf, schemaObj, metadataObj, pluginKeys, pluginObjects]
    ) => {
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
