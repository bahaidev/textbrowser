/* global TextBrowser */
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const tb = new TextBrowser({
        // languages: 'node_modules/bahaiwritings/appdata/languages.json', // Default
        // serviceWorkerPath: 'sw.js', // Default
        // site: 'site.json', // Default
        // localizeParamNames: true, // Not well-tested
        // hideFormattingSection: true,
        // requestPersistentStorage: false,
        // showEmptyInterlinear: false,
        // showTitleOnSingleInterlinear: false,
        files: 'files.json', // Change as needed to your `files.json` location
        namespace: 'myapp', // Used for namespacing localStorage
        allowPlugins: true, // Enables `files.json`-specified plugins
        trustFormatHTML: true, // Needed if allowing for raw HTML fields (don't use for untrusted schemas)
        // , interlinearSeparator: '<hr />' // Defaults to `<br /><br />`
        staticFilesToCache: [
            // Populate here your own (non-data) files to be made available
            //    offline (*TextBrowser*'s own will be added automatically)
            // The following are added by default
            'index.html',
            'files.json',
            'site.json',
            // Comment out if not using in index.html:
            'resources/user.js',
            'resources/user.css'
        ]
    });
    tb.init();
});
