/* eslint-env node */

import 'url-search-params-polyfill';
import IntlURLSearchParams from '../resources/utils/IntlURLSearchParams.js';
import {resultsDisplayServerOrClient} from '../resources/resultsDisplay.js';
import getIMFFallbackResults from '../resources/utils/getIMFFallbackResults.js';
import getJSON from 'simple-get-json';
import {setServiceWorkerDefaults} from '../resources/utils/ServiceWorker.js';
import setGlobalVars from 'indexeddbshim/src/setGlobalVars.js';
import fetch from 'node-fetch';

const domain = 'localhost';
const port = 8000;

// Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event

const optionDefinitions = [
    // Node-server-specific
    {name: 'nodeActivate', type: Boolean},

    // Results display (main)
    //      `namespace`: (but set below)
    //      `skipIndexedDB`: set to `false` below (and the default anyways)
    //      `noDynamic`: not used
    //      `prefI18n`: will instead be set dynamically per user query
    //      `files`: Already set below for service worker
    {name: 'interlinearSeparator', type: String},
    {name: 'localizeParamNames', type: Boolean},
    {name: 'trustFormatHTML', type: Boolean},
    {name: 'allowPlugins', type: Boolean},

    // Results display (template)
    {name: 'showEmptyInterlinear', type: Boolean},
    {name: 'showTitleOnSingleInterlinear', type: Boolean},

    // Service worker
    {name: 'serviceWorkerPath', type: String, defaultOption: true},
    {name: 'languages', type: String},
    {name: 'files', type: String},
    {name: 'namespace', type: String},
    {name: 'staticFilesToCache', type: String, multiple: true}
];
const userParams = require('command-line-args')(optionDefinitions);

const userParamsWithDefaults = setServiceWorkerDefaults(userParams, {
    files: `http://${domain}{port === 80 ? '' : ':' + port}/files.json`, // `files` must be absolute path for node-fetch
    nodeActivate: undefined,
    skipIndexedDB: false, // Not relevant here
    noDynamic: false, // Not relevant here
    logger: {
        addLogEntry ({text}) {
            console.log(`Log: ${text}`);
        },
        dbError ({
            errorType,
            escapedErrorMessage
        }) {
            throw new Error(`Worker aborted: error type ${errorType}; ${escapedErrorMessage}`);
        }
    }
});

if (userParams.nodeActivate) {
    global.fetch = fetch;
    setGlobalVars(); // Adds `indexedDB` and `IDBKeyRange` to global in Node
    const activateCallback = require('resources/activateCallback.js');
    activateCallback(userParamsWithDefaults);
}

const http = require('http');
const url = require('url');

global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const srv = http.createServer(async (req, res) => {
    const $p = new IntlURLSearchParams({
        params: url.parse(req.url).query
    });

    getIMFFallbackResults({
        $p,
        langData: await getJSON(userParamsWithDefaults.languages),
        resultsDisplay (resultsArgs, ...args) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            resultsArgs = {
                ...resultsArgs,
                skipIndexedDB: false,
                prefI18n: $p.get('prefI18n', true)
            };
            // Todo: Move sw-sample.js to bahaiwritings and test
            resultsDisplayServerOrClient.call(userParamsWithDefaults, resultsArgs, ...args);
            res.end('okay');
        }
    });
});
srv.listen(port);
