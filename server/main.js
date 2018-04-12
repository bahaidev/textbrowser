/* eslint-env node */

import 'url-search-params-polyfill';
import IntlURLSearchParams from '../resources/utils/IntlURLSearchParams.js';
import {resultsDisplayServer} from '../resources/resultsDisplay.js';
import getIMFFallbackResults from '../resources/utils/getIMFFallbackResults.js';
import getJSON from 'simple-get-json';
import {setServiceWorkerDefaults} from '../resources/utils/ServiceWorker.js';
// import setGlobalVars from 'indexeddbshim/src/node-UnicodeIdentifiers.js';
import fetch from 'node-fetch';

const setGlobalVars = require('indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node.js');

// Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event

const optionDefinitions = [
    // Node-server-specific
    {name: 'nodeActivate', type: Boolean},
    {name: 'port', type: Number},

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
    {name: 'basePath', type: String},
    {name: 'serviceWorkerPath', type: String, defaultOption: true},
    {name: 'languages', type: String},
    {name: 'files', type: String},
    {name: 'namespace', type: String},
    {name: 'staticFilesToCache', type: String, multiple: true}
];
const userParams = require('command-line-args')(optionDefinitions);

const port = 'port' in userParams ? userParams.port : 8000;
const basePath = userParams.basePath || `http://localhost${port ? ':' + port : ''}/`;

const userParamsWithDefaults = setServiceWorkerDefaults({...userParams}, {
    basePath,
    files: userParams.files || `${basePath}files.json`, // `files` must be absolute path for node-fetch
    languages: userParams.languages || `${basePath}node_modules/textbrowser/appdata/languages.json`,
    serviceWorkerPath: userParams.serviceWorkerPath || `${basePath}sw.js`,
    nodeActivate: undefined,
    port: undefined,
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
console.log('userParamsWithDefaults', userParamsWithDefaults);

setGlobalVars(null, {
    checkOrigin: false
}); // Adds `indexedDB` and `IDBKeyRange` to global in Node

if (userParams.nodeActivate) {
    global.fetch = fetch;
    const activateCallback = require('../resources/activateCallback.js');
    (async () => {
        await activateCallback(userParamsWithDefaults);
        console.log('Activated');
    })();
}
console.log('past activate check');

const http = require('http');
const url = require('url');

global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const statik = require('node-static');
const fileServer = new statik.Server(); // Pass path; otherwise uses current directory

const srv = http.createServer(async (req, res) => {
    // console.log('URL::', url.parse(req.url));
    const {pathname, query} = url.parse(req.url);
    if (pathname !== '/textbrowser' || !query) {
        req.addListener('end', function () {
            fileServer.serve(req, res);
        }).resume();
        /*
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>File not found</h1>');
        */
        return;
    }
    const languages = req.headers['accept-language'].replace(/;q=.*?$/, '').split(',');
    global.navigator = {
        language: languages[0],
        languages
    };
    const $p = new IntlURLSearchParams({
        params: query
    });

    getIMFFallbackResults({
        $p,
        basePath: `${basePath}`,
        langData: await getJSON(userParamsWithDefaults.languages),
        async resultsDisplay (resultsArgs, ...args) {
            const serverOutput = $p.get('serverOutput', true);
            const isHTML = serverOutput === 'html';
            res.writeHead(200, {'Content-Type': isHTML
                ? 'text/html;charset=utf8'
                : 'application/json;charset=utf8'
            });
            resultsArgs = {
                ...resultsArgs,
                skipIndexedDB: false,
                serverOutput,
                prefI18n: $p.get('prefI18n', true)
            };
            // Todo: Move sw-sample.js to bahaiwritings and test
            const result = await resultsDisplayServer.call(
                userParamsWithDefaults, resultsArgs, ...args
            );
            res.end(isHTML ? result : JSON.stringify(result));
        }
    });
});
srv.listen(port);
