#!/usr/bin/env node

/* eslint-env node -- Environment here */
import http from 'node:http';

// @ts-expect-error Todo: Needs Types
import statik from '@brettz9/node-static';
import fetch from 'node-fetch';
// @ts-expect-error Todo: Needs Types
import commandLineArgs from 'command-line-args';
import DOMParser from 'dom-parser';

// Why can't we just import `indexeddbshim` here? Because we need a UMD module?
// @ts-expect-error Todo: Needs Types
import setGlobalVars from 'indexeddbshim/dist/indexeddbshim-UnicodeIdentifiers-node.cjs';
import {getJSON} from 'simple-get-json';
import {setFetch} from 'intl-dom';

import IntlURLSearchParams from '../resources/utils/IntlURLSearchParams.js';
import {resultsDisplayServer} from '../resources/resultsDisplay.js';
import getLocaleFallbackResults from '../resources/utils/getLocaleFallbackResults.js';
import {setServiceWorkerDefaults} from '../resources/utils/ServiceWorker.js';
import {Languages} from '../resources/utils/Languages.js';
import activateCallback from '../resources/activateCallback.js';

// Todo: Should loosen this to not follow all of `fetch`'s API
// @ts-expect-error Todo: Needs types
setFetch(fetch);

// Todo (low): See
//   https://gist.github.com/brettz9/0993fbde6f7352b2bb05f38078cefb29
//   on idea for adapting node-serviceworker to consume entire service-worker
//   server-side and apply fetch listener as Node middleware to retrieve a
//   locally-saved copy of pre-fetched (cached) files during install event

/**
 * @typedef {{
 *   nodeActivate: boolean,
 *   port: number,
 *   domain: string,
 *   basePath: string,
 *   interlinearSeparator: string,
 *   localizeParamNames: boolean,
 *   trustFormatHTML: boolean,
 *   allowPlugins: boolean,
 *   showEmptyInterlinear: boolean,
 *   showTitleOnSingleInterlinear: boolean,
 *   serviceWorkerPath: string,
 *   userJSON: string,
 *   languages: string,
 *   files: string,
 *   namespace: string,
 *   httpServer: string,
 *   expressServer: string
 * }} UserOptions
 */

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
  {name: 'namespace', type: String},

  {name: 'httpServer', type: String},
  {name: 'expressServer', type: String}
];
const userParams = commandLineArgs(optionDefinitions);

const port = 'port' in userParams ? userParams.port : 8000;
const domain = userParams.domain || `localhost`;
const basePath = userParams.basePath || `http://${domain}${port ? ':' + port : ''}/`;

/**
 * @typedef {import('../resources/utils/ServiceWorker.js').ServiceWorkerConfig &
 *   UserOptions & {
 *     lang: string[],
 *     langs: LanguageInfo[],
 *     fallbackLanguages: string[],
 *     log: (...args: any[]) => void,
 *     nodeActivate?: boolean,
 *     port?: number,
 *     skipIndexedDB: false,
 *     noDynamic: false,
 *   }
 * } ResultsDisplayServerContext
 */

const userParamsWithDefaults = {
  ...setServiceWorkerDefaults({}, {
    namespace: 'textbrowser',
    files: `${basePath}files.json`, // `files` must be absolute path for node-fetch
    languages: `${basePath}node_modules/textbrowser/appdata/languages.json`,
    serviceWorkerPath: `${basePath}sw.js?pathToUserJSON=${encodeURIComponent(userParams.userJSON || '')}`
  }),
  ...userParams,
  /**
   * @param {...any} args
   */
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
  // @ts-expect-error Ok
  // eslint-disable-next-line n/no-unsupported-features/node-builtins -- node-fetch
  globalThis.fetch = /** @type {fetch} */ (fetch);
  setTimeout(async () => {
    await activateCallback({...userParamsWithDefaults, basePath});
  });
  console.log('Activated');
}
console.log('past activate check');

// @ts-expect-error Ok
globalThis.DOMParser = DOMParser; // potentially used within resultsDisplay.js

const fileServer = new statik.Server(); // Pass path; otherwise uses current directory

/**
 * @typedef {{
 *   code: string,
 *   direction: "ltr"|"rtl",
 *   locale: {
 *     $ref: string
 *   }
 * }} LanguageInfo
 */

/**
 * @typedef {{
 *   [key: string]: string|string[]|LocalizationStrings
 * }} LocalizationStrings
 */

/**
 * @typedef {{
 *   languages: LanguageInfo[],
 *   localeFileBasePath?: string,
 *   "localization-strings": LocalizationStrings
 * }} LanguagesData
 */

/**
 * @type {LanguagesData}
 */
let langData;

/** @type {Languages} */
let languagesInstance;

const srv = http.createServer(async (req, res) => {
  // console.log('URL::', new URL(req.url));
  const {pathname, search} = new URL(/** @type {string} */ (req.url), basePath);
  if (pathname !== '/textbrowser' || !search) {
    const staticServer = () => {
      if (pathname.includes('.git')) {
        req.url = '/index.html';
      }
      fileServer.serve(req, res);
    };

    const next = function () {
      req.addListener('end', staticServer).resume();
    };

    /**
     * @returns {Promise<void>}
     */
    const runHttpServer = async function () {
      const server = (await import(userParams.httpServer)).default();
      return await server(
        req,
        res,
        // For express, we'll first give a chance to other static servers
        //  they might supply
        userParams.expressServer
          ? () => {
            // Empty
          }
          : next
      );
    };
    if (userParams.expressServer) {
      /** @type {import('express').Application} */
      const app = (await import(userParams.expressServer)).default();

      if (userParams.httpServer && (!app._router || !app._router.stack.some(
        /** @type {(info: {regexp: RegExp}) => boolean} */
        ({regexp}) => {
          // Hack to ignore middleware like jsonParser (and hopefully
          //   not get any other)
          return regexp.source !== String.raw`^\/?(?=\\/|$)` &&
            regexp.test(/** @type {string} */ (req.url));
        }
      ))) {
        await runHttpServer();

        // Ideally we could use `next` here to serve as a back-up static
        //  server (i.e., for the bahaiwritings app proper), but the indexes
        //  app apparently tries to use it (and fails) after a single
        //  successful HTML page load. So we let the Express app handle
        // @ts-expect-error Ok
        app(req, res, () => {
          // Empty
        });
        return;
      }

      // app.get('*', staticServer);
      // @ts-expect-error Ok
      app(req, res, next);

      return;
    } else if (userParams.httpServer) {
      await runHttpServer();
      return;
    }

    next();
    /*
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>File not found</h1>');
    */
    return;
  }
  const languages = (req.headers['accept-language']?.replace(/;q=.*$/, '') ?? 'en-US').split(',');
  // @ts-expect-error Polyglot reasons
  // eslint-disable-next-line n/no-unsupported-features/node-builtins -- Polyglot reasons
  global.navigator = {
    language: languages[0],
    languages
  };
  const $p = new IntlURLSearchParams({
    params: search
  });

  if (!langData || !languagesInstance) {
    langData = /** @type {LanguagesData} */ (
      await getJSON(userParamsWithDefaults.languages)
    );
    languagesInstance = new Languages({langData});
  }

  const {lang, langs, fallbackLanguages} = languagesInstance.getLanguageInfo({$p});

  const l = await getLocaleFallbackResults({
    $p,
    lang, langs, langData, fallbackLanguages,
    basePath
  });

  const resultsDisplay = async function () {
    const serverOutput = /** @type {"html"|"jamilih"|"json"} */ (
      $p.get('serverOutput', true)
    );
    const allowPluginsParam = $p.get('allowPlugins', true);
    const allowPlugins = Boolean(allowPluginsParam && allowPluginsParam !== '0');

    const isHTML = serverOutput === 'html';
    res.writeHead(200, {'Content-Type': isHTML
      ? 'text/html;charset=utf8'
      : 'application/json;charset=utf8'
    });

    // Todo: Move sw-sample.js to bahaiwritings and test
    const result = await resultsDisplayServer.call(
      // Context
      /** @type {ResultsDisplayServerContext} */
      ({
        ...userParamsWithDefaults, lang, langs, fallbackLanguages
      }),
      // resultsArgs
      {
        l,
        lang,
        fallbackLanguages,
        locales: l.strings,
        $p,
        basePath,
        skipIndexedDB: false,
        allowPlugins,
        serverOutput,
        langData,
        prefI18n: /** @type {"true"|"false"|null} */ ($p.get('prefI18n', true))
      }
    );
    res.end(isHTML ? result : JSON.stringify(result));
  };

  await resultsDisplay();
});

if (!userParams.domain) {
  srv.listen(port);
} else {
  srv.listen(port, userParams.domain);
}
