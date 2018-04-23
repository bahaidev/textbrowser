/* eslint-env browser, serviceworker */
/* globals activateCallback */

// Todo: Replace with ES6 modules once browsers support
importScripts('node_modules/textbrowser/resources/activateCallback.js');

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

/*
(async () => {
const clients = await self.clients.matchAll({type: 'window'});
clients.forEach((client) => {
    console.log(client);
    client.postMessage('The service worker just started up.');
});
})();
*/

const defaultUserStaticFiles = [
    '/', // Needs a separate entry from `index.html` (at least in Chrome)
    'index.html',
    'files.json',
    'site.json',
    'resources/user.js',
    'resources/user.css'
];
// Todo: We could supply `new URL(fileName, moduleURL).href` to
//   get these as reliable full paths without hard-coding or needing to
//   actually be in `node_modules/textbrowser`; see `resources/index.js`
const textbrowserStaticResourceFiles = [
    'node_modules/babel-polyfill/dist/polyfill.js',
    'node_modules/dialog-polyfill/dialog-polyfill.css',
    'node_modules/dialog-polyfill/dialog-polyfill.js',

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

    'node_modules/textbrowser/resources/index.css',
    'node_modules/textbrowser/dist/index-es.js'
];

self.addEventListener('message', ({data: {
    type, namespace, // `install` and `activate`
    localeFiles, userDataFiles, userStaticFiles = defaultUserStaticFiles, // 'install' only
    filesJSONPath // 'activate' only
}}) => {
    switch (type) {
    case 'install':
        console.log('recd install message', typeof installCallback);
        if (!installCallback) {
            // Todo: if the `install` event has triggered, we will
            //        only get this message if `installing`. Do we
            //        need to handle a case where there is no
            //        `installCallback` (as by saving these values)?
            //        Presumably, `installing` only occurs after a
            //        synchronous run of an `install` handler, but
            //        I'll report here to see if it may ever come up.
            console.error('Unexpected error: the install callback does not yet exist');
            return;
        }
        installCallback({
            namespace, localeFiles, userDataFiles,
            userStaticFiles
        });
        return;
    case 'activate':
        console.log('recd activate message', typeof activateCallbackDynamic);
        if (!activateCallbackDynamic) {
            console.error('Unexpected error: the activate callback does not yet exist.');
            return;
        }
        activateCallbackDynamic({namespace, filesJSONPath});
        return;
    default:
        console.warning('Unexpected message type', type);
    }
});

let installCallback;
self.addEventListener('install', e => {
    const now = Date.now();
    console.log('--install beginning');
    e.waitUntil(
        new Promise((resolve, reject) => {
            // We start promise here so we can define `installCallback` early
            //     as the `installing` reference may otherwise have `postMessage`
            //     called on it in the main script before we can define the function.
            // (In addition to messaging, we could also get (lesser) info via worker URL.)
            let installInfoReceived = false;

            // Should expire much earlier than this, but we'll be safe
            const noCallbackTimeout = 1000 * 12;
            setTimeout(() => {
                // If callback invoked, we'll handle any problems there
                if (!installInfoReceived) {
                    const timeOutErr = `Service worker installation timed out (waiting for message from client).`;
                    console.error(timeOutErr);
                    // We want to reject in case a new one can be invoked (e.g.,
                    //    from another tab (?)).
                    reject(new Error(timeOutErr));
                }
            }, noCallbackTimeout);
            let installCompleted = false;
            installCallback = async ({
                namespace, localeFiles, userDataFiles, userStaticFiles
            }) => {
                if (installCompleted) { // In case another client triggers message
                    return;
                }
                installInfoReceived = true;
                const cache = await caches.open(namespace + CURRENT_CACHES.prefetch);
                const urlsToPrefetch = [
                    ...textbrowserStaticResourceFiles,
                    ...localeFiles,
                    ...userStaticFiles,
                    ...userDataFiles
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
                            console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                            return Promise.reject(error);
                        }
                    });
                    await Promise.all(cachePromises);
                    console.log('Pre-fetching complete.');

                    console.log('--install completing');

                    const clients = await self.clients.matchAll({
                        includeUncontrolled: false,
                        type: 'window'
                    });
                    if (!clients || !clients.length) {
                        // Should we wait instead for the next client?
                        throw new Error(
                            'No client present to provide arguments for install completion'
                        );
                    }
                    installCompleted = true;
                    resolve();
                } catch (error) {
                    console.error('Pre-fetching failed:', error);
                    // Failing gives chance for a new client to re-trigger install?
                    reject(error);
                }
            };
        })
    );
});

let activateCallbackDynamic;
self.addEventListener('activate', e => {
    console.log('--activate beginning0');
    const expectedCacheNames = Object.values(CURRENT_CACHES);
    e.waitUntil(new Promise(async (resolve, reject) => {
        try {
            console.log('--activate beginning');

            let activateInfoReceived = false;

            // Should expire much earlier than this, but we'll be safe
            const noCallbackTimeout = 1000 * 12;
            setTimeout(() => {
                // If callback invoked, we'll handle any problems there
                if (!activateInfoReceived) {
                    const timeOutErr = `Service worker installation timed out (waiting for message from client).`;
                    console.error(timeOutErr);
                    // We want to reject in case a new one can be invoked (e.g.,
                    //    from another tab (?)).
                    reject(new Error(timeOutErr));
                }
            }, noCallbackTimeout);

            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(async (cacheName) => {
                    if (!expectedCacheNames.includes(cacheName)) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        await caches.delete(cacheName);
                    }
                })
            );

            let activateCompleted = false;
            // We only need this message during activation
            activateCallbackDynamic = async (...args) => {
                if (activateCompleted) {
                    return;
                }
                activateInfoReceived = true;
                try {
                    await activateCallback(...args);
                    const clients = await self.clients.matchAll({
                        includeUncontrolled: false,
                        type: 'window'
                    });
                    if (clients && clients.length) {
                        clients.forEach((client) => {
                            // Get each tab to reload
                            client.postMessage('finishedActivate');
                        });
                    } else {
                        // This is not a problem as the script will only reload
                        //    the activating page if found
                        console.log('No client found to inform of activation');
                    }
                    activateCompleted = true;
                    resolve();
                } catch (err) {
                    console.error('Activation callback error:', err);
                    reject(err);
                }
            };
            const clients = await self.clients.matchAll({
                includeUncontrolled: false, // There shouldn't be any uncontrolled here by this time anyways (?)
                type: 'window'
            });
            if (!clients || !clients.length) {
                // Should we wait instead for the next client?
                throw new Error(
                    'No client found to inform of readiness for activation completion'
                );
            }
            clients.forEach((client) => {
                // Although we only need one client to which to send
                //   arguments, we want to signal phase complete to all
                client.postMessage('finishActivate');
            });
        } catch (err) {
            console.error('Error during activation message', err);

            const {type: errorType, name, dbError, message} = err;
            const clients = await self.clients.matchAll({
                includeUncontrolled: false,
                type: 'window'
            });
            if (!clients || !clients.length) {
                console.log('No client found to inform of activation error');
            } else {
                clients.forEach((client) => {
                    // Let each client show error message
                    client.postMessage({
                        activationError: true, dbError, errorType: errorType || name, message
                    });
                });
            }
            throw err;
        }
    }));
});

// We cannot make this async as `e.respondWith` must be called synchronously
self.addEventListener('fetch', (e) => {
    // DevTools opening will trigger these o-i-c requests
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
        return;
    }
    console.log('fetching');
    e.respondWith(
        (async () => {
            return (await caches.match(e.request)) || fetch(e.request);
        })()
    );
});
