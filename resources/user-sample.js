/* global TextBrowser */
window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const tb = new TextBrowser({
        // languages: 'node_modules/bahaiwritings/appdata/languages.json', // Default
        // site: 'site.json' // Default
        files: 'files.json', // Change as needed to your `files.json` location
        namespace: 'myapp', // Used for namespacing localStorage
        allowPlugins: true // Enables `files.json`-specified plugins
    });
    tb.init();
});
