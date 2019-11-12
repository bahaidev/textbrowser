/* eslint-env browser, serviceworker */

'use strict';

/* globals getJSON, activateCallback, WorkInfo */
// Todo: Replace with ES6 modules (and remove Rollup routines) once browsers
//    support:
//    https://stackoverflow.com/a/45578811/271577
//    https://bugs.chromium.org/p/chromium/issues/detail?id=680046
// import getJSON from './node_modules/simple-get-json/dist/index-es.js';
// import activateCallback from 'node_modules/textbrowser/resources/activateCallback.js';
// import {getWorkFiles} from './WorkInfo.js';
importScripts('node_modules/core-js-bundle/minified.js');
importScripts('node_modules/regenerator-runtime/runtime.js');

importScripts('node_modules/simple-get-json/dist/index.js');
importScripts('node_modules/textbrowser/dist/WorkInfo-umd.js');
importScripts('node_modules/textbrowser/dist/activateCallback-umd.js');

const CACHE_VERSION = '0.34.0';
const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};
const minutes = 60 * 1000;

// Utilities

/**
 *
 * @param {PlainObject} args
 * @param {"log"|"error"|"beginInstall"|"finishedInstall"|"beginActivate"|"finishedActivate"} args.type
 * @param {string} [args.message=type}]
 * @returns {Promise<void>}
 */
async function post ({type, message = type}) {
  const clients = await self.clients.matchAll({
    // Are there any uncontrolled within activate anyways?
    includeUncontrolled: true,
    type: 'window'
  }) || [];
  if (message.includes('Posting finished')) {
    message += ` (count: ${clients.length})`;
  }
  clients.forEach((client) => {
    // Although we only need one client to which to send
    //   arguments, we want to signal phase complete to all
    client.postMessage({message, type});
  });
}

/**
 *
 * @param {string[]} messages
* @returns {Promise<void>}
 */
function log (...messages) {
  const message = messages.join(' ');
  console.log(message);
  return post({message, type: 'log'});
}

/**
 *
 * @param {Error} error
 * @param {string[]} messages
* @returns {Promise<void>}
 */
function logError (error, ...messages) {
  const message = messages.join(' ');
  console.error(error, message);
  return post({message, errorType: error.type, name: error.name, type: 'error'});
}

/**
 * @callback DelayCallback
 * @param {Float} time
 * @returns {void}
 */

/**
 *
 * @param {DelayCallback} cb
 * @param {PositiveInteger} timeout
 * @param {string} errMessage
 * @param {PositiveInteger} [time=0]
 * @returns {Promise<void>}
 */
async function tryAndRetry (cb, timeout, errMessage, time = 0) {
  time++;
  try {
    await cb(time);
    return undefined;
  } catch (err) {
    console.log('errrr', err);
    logError(err, err.message || errMessage);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(tryAndRetry(cb, timeout, errMessage, time));
      }, timeout);
    });
  }
}

/**
* @typedef {PlainObject} ConfigObject
* @todo Define this
*/

/**
 *
 * @param {ConfigObject} args
 * @returns {ConfigObject}
 * @todo Since some of these reused, move to external file (or
 *         use `setServiceWorkerDefaults`?)
 */
function getConfigDefaults (args) {
  return {
    namespace: 'textbrowser',
    basePath: '',
    languages: new URL(
      '../appdata/languages.json',
      // Todo: Substitute with `import.meta.url` once implemented in
      //   service workers
      new URL('node_modules/textbrowser/resources/index.js', location)
    ).href,
    files: 'files.json',
    userStaticFiles: defaultUserStaticFiles,
    // Opportunity to override
    ...args
  };
}

const defaultUserStaticFiles = [
  '/', // Needs a separate entry from `index.html` (at least in Chrome)
  'index.html',
  'files.json',
  'site.json',
  'resources/user.js'
  // We do not put the user.json here as that is obtained live with service worker
];
// Todo: We could supply `new URL(fileName, moduleURL).href` to
//   get these as reliable full paths without hard-coding or needing to
//   actually be in `node_modules/textbrowser`; see `resources/index.js`
const textbrowserStaticResourceFiles = [
  'node_modules/core-js-bundle/minified.js',
  'node_modules/regenerator-runtime/runtime.js',
  'node_modules/dialog-polyfill/dist/dialog-polyfill.esm.js',

  'node_modules/textbrowser/appdata/languages.json',

  /*
    // Only needed atm for browser validation
    'node_modules/textbrowser/general-schemas/files.jsonschema',
    'node_modules/textbrowser/general-schemas/languages.jsonschema',
    'node_modules/textbrowser/general-schemas/locale.jsonschema',
    'node_modules/textbrowser/general-schemas/metadata.jsonschema',
    'node_modules/textbrowser/general-schemas/table.jsonschema', // Not currently using for validation or meta-data
    */

  // Todo: Ought to make these locales only conditionally required and
  //      then only show those specified in languages menu or go directly
  //      to work selection
  'node_modules/textbrowser/locales/ar.json',
  'node_modules/textbrowser/locales/en-US.json',
  'node_modules/textbrowser/locales/fa.json',
  'node_modules/textbrowser/locales/ru.json',

  'node_modules/textbrowser/dist/index-es.js'
];

const params = new URL(location).searchParams;
const pathToUserJSON = params.get('pathToUserJSON');
const stylesheets = JSON.parse(params.get('stylesheets') || []);

console.log('sw info', pathToUserJSON);
console.log('sw stylesheets', stylesheets);

/**
 *
 * @param {PositiveInteger} time
 * @returns {Promise<void>}
 */
async function install (time) {
  post({type: 'beginInstall'});
  log(`Install: Trying, attempt ${time}`);
  const now = Date.now();
  const response = await fetch(pathToUserJSON);
  const json = await response.json();

  const {
    namespace, languages, files, userStaticFiles
  } = getConfigDefaults(json);

  console.log('opening cache', namespace + CURRENT_CACHES.prefetch);
  const [
    cache,
    userDataFiles,
    {languages: langs}
  ] = await Promise.all([
    caches.open(namespace + CURRENT_CACHES.prefetch),
    WorkInfo.getWorkFiles(files),
    getJSON(languages)
  ]);
  log('Install: Retrieved dependency values');

  const langPathParts = languages.split('/');
  // Todo: We might give option to only download
  //        one locale and avoid language splash page
  const localeFiles = langs.map(
    ({locale: {$ref}}) => {
      return (langPathParts.length > 1
        ? langPathParts.slice(0, -1).join('/') + '/'
        : ''
      ) + $ref;
    }
  );

  const urlsToPrefetch = [
    ...textbrowserStaticResourceFiles,
    ...localeFiles,
    ...userStaticFiles,
    ...userDataFiles,
    ...stylesheets
  ];
    // .map((url) => url === 'index.html' ? new Request(url, {cache: 'reload'}) : url)
  try {
    const cachePromises = urlsToPrefetch.map(async (urlToPrefetch) => {
      // This constructs a new URL object using the service worker's script location as the base
      // for relative URLs.
      const url = new URL(urlToPrefetch, location.href);
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
      const request = new Request(url, {mode: 'no-cors'});
      try {
        const response = await fetch(request);
        if (response.status >= 400) {
          throw new Error('request for ' + urlToPrefetch +
                      ' failed with status ' + response.statusText);
        }
        return cache.put(urlToPrefetch, response);
      } catch (error) {
        logError(error, 'Not caching ' + urlToPrefetch + ' due to ' + error);
        return Promise.reject(error);
      }
    });
    await Promise.all(cachePromises);
    log('Install: Pre-fetching complete.');
  } catch (error) {
    logError(error, `Install: Pre-fetching failed: ${error}`);
    // Failing gives chance for a new client to re-trigger install?
    throw error;
  }

  // An install update event will not be reported until controlled,
  //    so we need to inform the clients
  log(`Install: Posting finished message to clients`);

  // Although we only need one client to which to send
  //   arguments, we want to signal phase complete to all
  post({type: 'finishedInstall'});
}

/**
 *
 * @param {PositiveInteger} time
 * @returns {Promise<void>}
 */
async function activate (time) {
  post({type: 'beginActivate'});
  log(`Activate: Trying, attempt ${time}`);
  const [json, cacheNames] = await Promise.all([
    (await fetch(pathToUserJSON)).json(),
    caches.keys()
  ]);
  const {namespace, files, basePath} = getConfigDefaults(json);

  const expectedCacheNames = Object.values(CURRENT_CACHES).map((n) => namespace + n);
  cacheNames.map(async (cacheName) => {
    if (!expectedCacheNames.includes(cacheName)) {
      log('Activate: Deleting out of date cache:', cacheName);
      await caches.delete(cacheName);
    }
  });

  await activateCallback({namespace, files, basePath, log});
  log('Activate: Database changes completed');

  log(`Activate: Posting finished message to clients`);
  // Signal phase complete to all clients
  post({type: 'finishedActivate'});
}

self.addEventListener('install', (e) => {
  e.waitUntil(tryAndRetry(install, 5 * minutes, 'Error installing'));
});

self.addEventListener('activate', (e) => {
  // Erring is of no present use here:
  //   https://github.com/w3c/ServiceWorker/issues/659#issuecomment-384919053
  e.waitUntil(tryAndRetry(activate, 5 * minutes, 'Error activating'));
});

// We cannot make this async as `e.respondWith` must be called synchronously
self.addEventListener('fetch', (e) => {
  // DevTools opening will trigger these o-i-c requests
  const {request: {cache, mode, url}} = e;
  if (cache === 'only-if-cached' &&
        mode !== 'same-origin') {
    return;
  }
  console.log('fetching', url);
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (!cached) {
      console.log('no cached found', url);
    }
    return cached || fetch(e.request);
  })());
});
