/*globals TextBrowser*/
window.addEventListener('DOMContentLoaded', function () {'use strict';

    var tb = new TextBrowser({
        // languages: 'appdata/languages.json', // Default
        files: 'appdata/files.json' // Change to your files.json location
    });
    tb.init();

});
