/*global TextBrowser*/
window.addEventListener('DOMContentLoaded', function () {'use strict';

    var tb = new TextBrowser({
        // languages: 'bower_components/bahaiwritings/appdata/languages.json', // Default
        // site: 'site.json' // Default
        files: 'files.json' // Change as needed to your files.json location
    });
    tb.init();

});
