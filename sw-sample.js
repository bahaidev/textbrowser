/* eslint-env browser, serviceworker */
/* globals activateCallback */
// Todo: Replace with ES6 modules once browsers support
importScripts('node_modules/textbrowser/resources/activateCallback.js');

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

self.addEventListener('message', async ({data: {
    type, namespace, // `install` and `activate`
    localeFiles, userDataFiles, userStaticFiles = defaultUserStaticFiles, // 'install' only
    filesJSONPath // 'activate' only
}}) => {
    if (type === 'install') {
        console.log('recd install message', typeof installCallback);
        installCallback && await installCallback({
            namespace, localeFiles, userDataFiles,
            userStaticFiles
        });
    } else if (type === 'activate') {
        console.log('recd activate message', typeof activateCallbackDynamic);
        if (activateCallbackDynamic) {
            await activateCallbackDynamic({namespace, filesJSONPath});
            return new Promise(async (resolve, reject) => {
                const clients = await self.clients.matchAll({
                    includeUncontrolled: true,
                    type: 'window'
                });
                if (clients && clients.length) {
                    const client = clients.pop();
                    client.postMessage('finishedActivate');
                    resolve();
                }
            });
        };
    }
});

let installCallback;
self.addEventListener('install', e => {
    console.log('--install beginning');
    e.waitUntil(
        new Promise((resolve, reject) => {
            // We start promise here so we can define `installCallback` early
            //     as the `installing` reference may otherwise have `postMessage`
            //     called on it in the main script before we can define the function.
            // (In addition to messaging, we could also get (lesser) info via worker URL.)
            installCallback = async ({
                namespace, localeFiles, userDataFiles, userStaticFiles
            }) => {
                const cache = await caches.open(namespace + '-static-v1');
                cache.addAll([
                    ...textbrowserStaticResourceFiles,
                    ...localeFiles,
                    ...userStaticFiles,
                    ...userDataFiles
                ]
                // .map((url) => url === 'index.html' ? new Request(url, {cache: 'reload'}) : url)
                );
                console.log('--install completing');
                resolve();
            };
        })
    );
});

let activateCallbackDynamic;
self.addEventListener('activate', e => {
    console.log('--activate beginning0');
    e.waitUntil(new Promise(async (resolve, reject) => {
        console.log('--activate beginning');

        // We only need this message during activation
        activateCallbackDynamic = activateCallback;
        const clients = await self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        });
        if (clients && clients.length) {
            const client = clients.pop();
            client.postMessage('send msg to main script: ready to finish activate');
            resolve();
        }
    }).catch(async ({type: errorType, name, dbError, message}) => {
        const clients = await self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        });
        if (clients && clients.length) {
            const client = clients.pop();
            client.postMessage({
                activationError: true, dbError, errorType: errorType || name, message
            });
        }
    }));
});

// We cannot make this async as `e.respondWith` must be called synchronously
self.addEventListener('fetch', (e) => {
    console.log('fetching');
    e.respondWith(
        (async () => (await caches.match(e.request)) || fetch(e.request))()
    );
});
