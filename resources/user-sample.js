/* global TextBrowser */
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const tb = new TextBrowser({
        // languages: 'node_modules/bahaiwritings/appdata/languages.json', // Default
        // site: 'site.json' // Default
        // localizeParamNames: true, // Not well-tested
        // hideFormattingSection: true,
        files: 'files.json', // Change as needed to your `files.json` location
        namespace: 'myapp', // Used for namespacing localStorage
        allowPlugins: true, // Enables `files.json`-specified plugins
        trustFormatHTML: true // Needed if allowing for raw HTML fields (don't use for untrusted schemas)
        // , interlinearSeparator: '<hr />' // Defaults to `<br /><br />`
    });
    tb.init();
});
