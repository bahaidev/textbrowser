import activateCallback from './activateCallback-es.js';
import {getWorkFiles} from './WorkInfo-es.js';

// VERSION 0.1.0

const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v'
};
const minutes = 60 * 1000;

// UTILITIES

/**
 * @typedef {number} PositiveInteger
 */

/**
 * @typedef {number} Float
 */

/**
 * @param {string} url
 */
async function getJSON (url) {
  const resp = await fetch(url);
  return await resp.json();
}

/**
 * @param {ServiceWorkerGlobalScope} self
 */
function swHelper (self) {
  // These could be made configurable by argument too
  const defaultUserStaticFiles = [
    '/', // Needs a separate entry from `index.html` (at least in Chrome)
    'index.html',
    'files.json',
    'site.json',
    'resources/user.js'
    // We do not put the user.json here as that is obtained live with this
    //   service worker via `pathToUserJSON`
  ];
  // Todo: We could supply `new URL(fileName, moduleURL).href` to
  //   get these as reliable full paths without hard-coding or needing to
  //   actually be in `node_modules/textbrowser`; see `resources/index.js`
  const textbrowserStaticResourceFiles = [
    'node_modules/textbrowser/appdata/languages.json',

    /*
      // Only needed atm for browser validation
      'node_modules/textbrowser/general-schemas/files.jsonschema',
      'node_modules/textbrowser/general-schemas/languages.jsonschema',
      'node_modules/textbrowser-data-schemas/schemas/locale.jsonschema',
      'node_modules/textbrowser-data-schemas/schemas/metadata.jsonschema',
      'node_modules/textbrowser-data-schemas/schemas/table.jsonschema', // Not currently using for validation or meta-data
      */

    'node_modules/intl-locale-textinfo-polyfill/lib/Locale.js',
    'node_modules/textbrowser/dist/assets/languages-1sAACTKG.json',
    'node_modules/textbrowser/dist/assets/index-_11XnUty.css',

    'node_modules/textbrowser/dist/index-es.js'
  ];

  /**
  * @typedef {object} ConfigObject
  * @property {string} namespace
  * @property {string} basePath
  * @property {string} languages
  * @property {string} files
  * @property {string[]} userStaticFiles
  */

  /**
   *
   * @param {Partial<ConfigObject>} args
   * @returns {Required<ConfigObject>}
   * @todo Since some of these reused, move to external file (or
   *         use `setServiceWorkerDefaults`?)
   */
  function getConfigDefaults (args) {
    return {
      namespace: 'textbrowser',
      basePath: '',
      languages: new URL('../appdata/languages.json', import.meta.url).href,
      files: 'files.json',
      userStaticFiles: defaultUserStaticFiles,
      // Opportunity to override
      ...args
    };
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
  * @returns {Promise<void>} Resolves to `undefined`
   */
  function logError (error, ...messages) {
    const message = messages.join(' ');
    console.error(error, message);
    return post({
      message,
      // errorType: error.type,
      // name: error.name,
      type: 'error'
    });
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
   * @param {PositiveInteger} [time]
   * @returns {Promise<void>}
   */
  async function tryAndRetry (cb, timeout, errMessage, time = 0) {
    time++;
    try {
      await cb(time); // eslint-disable-line n/callback-return -- Needed for retries
      return undefined;
    } catch (err) {
      console.log('errrr', err);
      logError(
        /** @type {Error} */
        (err),
        /** @type {Error} */
        (err).message || errMessage
      );
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(tryAndRetry(cb, timeout, errMessage, time));
        }, timeout);
      });
    }
  }

  /**
   *
   * @param {object} args
   * @param {"log"|"error"|"beginInstall"|"finishedInstall"|"beginActivate"|"finishedActivate"} args.type
   * @param {string} [args.message]
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
      // eslint-disable-next-line unicorn/require-post-message-target-origin -- In worker
      client.postMessage({message, type});
    });
  }

  /**
   *
   * @param {PositiveInteger} time
   * @throws {Error}
   * @returns {Promise<void>}
   */
  async function install (time) {
    post({type: 'beginInstall'});
    log(`Install: Trying, attempt ${time}`);
    const now = Date.now();
    const json = await getJSON(/** @type {string} */ (pathToUserJSON));

    const {
      namespace, languages, files, userStaticFiles
    } = getConfigDefaults(json);

    const {version} = await getJSON('./package.json');

    console.log('opening cache', namespace + CURRENT_CACHES.prefetch + version);
    const [
      cache,
      userDataFiles,
      {languages: langs}
    ] = await Promise.all([
      caches.open(namespace + CURRENT_CACHES.prefetch + version),
      getWorkFiles(files),
      getJSON(languages)
    ]);
    log('Install: Retrieved dependency values');

    const langPathParts = languages.split('/');

    // Todo: Ought to make these locales only conditionally required and
    //      then only show those specified in languages menu or go directly
    //      to work selection
    // Todo: We might give option to only download
    //        one locale and avoid language splash page
    const localeFiles =
    /**
     * @type {{
     *   code: string,
     *   direction: "rtl"|"ltr",
     *   locale: {$ref: string}
     * }[]}
     */ (langs).map(
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
        // This constructs a new URL object using the service worker's script
        //   location as the base for relative URLs.
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
          logError(
            /** @type {Error} */
            (error),
            `Not caching ${urlToPrefetch} due to ${error}`
          );
          throw error;
        }
      });
      await Promise.all(cachePromises);
      log('Install: Pre-fetching complete.');
    } catch (error) {
      logError(
        /** @type {Error} */
        (error),
        `Install: Pre-fetching failed: ${error}`
      );
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
      getJSON(/** @type {string} */ (pathToUserJSON)),
      caches.keys()
    ]);
    const {namespace, files, basePath} = getConfigDefaults(json);
    const {version} = await getJSON('./package.json');

    const expectedCacheNames = Object.values(CURRENT_CACHES).map((n) => namespace + n + version);
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

  // @ts-expect-error Ok
  const params = new URL(location).searchParams;
  const pathToUserJSON = params.get('pathToUserJSON');
  const stylesheets = JSON.parse(params.get('stylesheets') || '[]');

  console.log('sw info', pathToUserJSON);
  console.log('sw stylesheets', stylesheets);

  self.addEventListener('install', (e) => {
    self.skipWaiting();
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
    const {request} = e;
    const {cache, mode, url} = request;
    if (cache === 'only-if-cached' &&
          mode !== 'same-origin') {
      return;
    }
    console.log('fetching', url);
    e.respondWith((async () => {
      const cached = await caches.match(request);
      if (!cached) {
        console.log('no cached found', url);
      }
      return cached || fetch(request);
    })());
  });
}

export default swHelper;
