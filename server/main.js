/* eslint-env node */
import 'url-search-params-polyfill';
import {getJSON} from 'simple-get-json';
import IntlURLSearchParams from '../resources/utils/IntlURLSearchParams.js';
import {resultsDisplayServer} from '../resources/resultsDisplay.js';
import getIMFFallbackResults from '../resources/utils/getIMFFallbackResults.js';
import {setServiceWorkerDefaults} from '../resources/utils/ServiceWorker.js';
// import setGlobalVars from 'indexeddbshim/src/node-UnicodeIdentifiers.js';
import {Languages} from '../resources/utils/Languages.js';
// import activateCallback from '../resources/activateCallback.js';

/* eslint-disable import/no-commonjs */
const http = require('http');
const fetch = require('node-fetch'); // Problems as `import` since 2.1.2
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
  {name: 'domain', type: String},
  {name: 'basePath', type: String},

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
  {name: 'userJSON', type: String},
  {name: 'languages', type: String},
  {name: 'files', type: String},
  {name: 'namespace', type: String}
];
const userParams = require('command-line-args')(optionDefinitions);

const port = 'port' in userParams ? userParams.port : 8000;
const domain = userParams.domain || `localhost`;
const basePath = userParams.basePath || `http://${domain}${port ? ':' + port : ''}/`;

const userParamsWithDefaults = {
  ...setServiceWorkerDefaults({}, {
    namespace: 'textbrowser',
    files: `${basePath}files.json`, // `files` must be absolute path for node-fetch
    languages: `${basePath}node_modules/textbrowser/appdata/languages.json`,
    serviceWorkerPath: `${basePath}sw.js?pathToUserJSON=${encodeURIComponent(userParams.userJSON || '')}`
  }),
  ...userParams,
  log (...args) {
    console.log(...args);
  },
  nodeActivate: undefined,
  port: undefined,
  skipIndexedDB: false, // Not relevant here
  noDynamic: false // Not relevant here
  /*
    Not in use:
    logger: {
        addLogEntry ({text}) {
            console.log(`Log: ${text}`);
        },
        dbError ({
            type,
            escapedErrorMessage
        }) {
            throw new Error(`Worker aborted: error type ${type}; ${escapedErrorMessage}`);
        }
    } */
};
console.log('userParamsWithDefaults', userParamsWithDefaults);

setGlobalVars(null, {
  checkOrigin: false
}); // Adds `indexedDB` and `IDBKeyRange` to global in Node

if (userParams.nodeActivate) {
  global.fetch = fetch;
  // const activateCallback = require('../resources/activateCallback.js');
  const activateCallback = require('../dist/activateCallback-umd.js'); // eslint-disable-line node/global-require
  (async () => {
    await activateCallback({...userParamsWithDefaults, basePath});
    console.log('Activated');
  })();
}
console.log('past activate check');

global.DOMParser = require('dom-parser'); // potentially used within resultsDisplay.js

const statik = require('node-static');
/* eslint-enable import/no-commonjs */
const fileServer = new statik.Server(); // Pass path; otherwise uses current directory

let langData, languagesInstance;
(async () => {
langData = await getJSON(userParamsWithDefaults.languages);
languagesInstance = new Languages({langData});
})();

const srv = http.createServer(async (req, res) => {
  // console.log('URL::', new URL(req.url));
  const {pathname, search} = new URL(req.url, basePath);
  if (pathname !== '/textbrowser' || !search) {
    req.addListener('end', function () {
      if (pathname.includes('.git')) {
        req.url = '/index.html';
      }
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
    params: search
  });

  const {lang, langs, fallbackLanguages} = languagesInstance.getLanguageInfo({$p});

  getIMFFallbackResults({
    $p,
    basePath,
    lang, langs, fallbackLanguages,
    langData,
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
        langData,
        prefI18n: $p.get('prefI18n', true)
      };
      // Todo: Move sw-sample.js to bahaiwritings and test
      const result = await resultsDisplayServer.call(
        {
          ...userParamsWithDefaults, lang, langs, fallbackLanguages
        }, resultsArgs, ...args
      );
      res.end(isHTML ? result : JSON.stringify(result));
    }
  });
});
if (!userParams.domain) {
  srv.listen(port);
} else {
  srv.listen(port, userParams.domain);
}
