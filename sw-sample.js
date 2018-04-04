/* eslint-env serviceworker */

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

const ceil = Math.ceil;
const arrayChunk = (arr, size) => {
    return Array.from(
        Array(ceil(arr.length / size)),
        (_, i) => {
            const offset = i * size;
            return arr.slice(offset, offset + size);
        }
    );
};

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
        console.log('recd activate message', typeof activateCallback);
        activateCallback && await activateCallback({namespace, filesJSONPath});
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

let activateCallback;
self.addEventListener('activate', e => {
    console.log('--activate beginning0');
    e.waitUntil(new Promise(async (resolve, reject) => {
        console.log('--activate beginning');

        // We only need this message during activation
        activateCallback = async ({
            namespace, filesJSONPath
        }) => {
            // Now we know we have the files cached, we can postpone
            //  the `indexedDB` processing (which will work offline
            //  anyways); also important to avoid conflicts with
            //  already-running versions upon future sw updates
            console.log('--activate callback called');
            const r = await fetch(filesJSONPath);
            const {groups} = await r.json();

            const addJSONFetch = (arr, path) => {
                arr.push(
                    (async () => (await fetch(path)).json())()
                );
            };

            const dataFileNames = [];
            const dataFiles = [];
            const schemaFiles = [];
            const metadataFiles = [];
            groups.forEach(
                ({files, metadataBaseDirectory, schemaBaseDirectory}) => {
                    files.forEach(({file: {$ref: filePath}, metadataFile, schemaFile, name}) => {
                        // We don't i18nize the name here
                        dataFileNames.push(name);
                        addJSONFetch(dataFiles, filePath);
                        addJSONFetch(metadataFiles, metadataBaseDirectory + '/' + metadataFile);
                        addJSONFetch(schemaFiles, schemaBaseDirectory + '/' + schemaFile);
                    });
                }
            );
            const promises = await Promise.all([
                ...dataFiles, ...schemaFiles, ...metadataFiles
            ]);
            const chunked = arrayChunk(promises, dataFiles.length);
            const [
                dataFileResponses, schemaFileResponses, metadataFileResponses
            ] = chunked;

            console.log('--files fetched');
            const dbName = namespace + '-textbrowser-cache-data';
            indexedDB.deleteDatabase(dbName);
            const req = indexedDB.open(dbName);
            req.onupgradeneeded = ({target: {result: db}}) => {
                db.onversionchange = () => {
                    db.close();
                    reject(new Error('versionchange'));
                };
                dataFileResponses.forEach(({data: tableRows}, i) => {
                    const dataFileName = dataFileNames[i];
                    const store = db.createObjectStore('files-to-cache-' + dataFileName);

                    const schemaFileResponse = schemaFileResponses[i];
                    const metadataFileResponse = metadataFileResponses[i];
                    const fieldItems = schemaFileResponse.items.items;

                    let browseFields = metadataFileResponse.table.browse_fields;
                    browseFields = Array.isArray(browseFields) ? browseFields : [browseFields];

                    const columnIndexes = [];
                    browseFields.forEach((browseFieldSetObj) => {
                        if (typeof browseFieldSetObj === 'string') {
                            browseFieldSetObj = {set: [browseFieldSetObj]};
                        }
                        if (!browseFieldSetObj.name) {
                            browseFieldSetObj.name = browseFieldSetObj.set.join(',');
                        }
                        const browseFieldSetName = browseFieldSetObj.name;
                        const browseFieldSetIndexes = browseFieldSetObj.set.map((browseField) =>
                            // Need to convert to columns for numbers
                            //      to become valid key paths
                            'c' + (
                                fieldItems.findIndex((item) => item.title === browseField)
                            )
                        );
                        columnIndexes.push(...browseFieldSetIndexes);

                        console.log(
                            dataFileName,
                            'browseFields-' + browseFieldSetName,
                            browseFieldSetIndexes
                        );

                        // No need for using `presort` as our index will sort anyways
                        store.createIndex(
                            'browseFields-' + browseFieldSetName,
                            browseFieldSetIndexes
                        );
                    });

                    const uniqueColumnIndexes = [...new Set(columnIndexes)];

                    tableRows.forEach((tableRow, i) => {
                        // Todo: Optionally send notice when complete
                        // To take advantage of indexes on our arrays, we
                        //   need to transform them to objects! See https://github.com/w3c/IndexedDB/issues/209
                        const objRow = {
                            value: tableRow
                        };
                        uniqueColumnIndexes.forEach((colIdx) => {
                            objRow[colIdx] = tableRow[colIdx.slice(1)];
                        });
                        // console.log('objRow', objRow);
                        store.put(objRow, i);
                    });
                });
            };
            req.onsuccess = async ({target: {result: db}}) => {
                console.log('database activation set-up complete', db);
                // Todo: Replace this with `ready()` check
                //   in calling code?
                const clients = await self.clients.matchAll({
                    includeUncontrolled: true,
                    type: 'window'
                });
                if (clients && clients.length) {
                    const client = clients.pop();
                    client.postMessage('finishedActivate');
                    resolve();
                }
            };
            req.onblocked = req.onerror = ({error = new Error('dbError')}) => {
                error.dbError = true;
                reject(error);
            };
        };
        const clients = await self.clients.matchAll({
            includeUncontrolled: true,
            type: 'window'
        });
        if (clients && clients.length) {
            const client = clients.pop();
            client.postMessage('send msg to main script: ready to finish activate');
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

self.addEventListener('fetch', (e) => {
    console.log('fetching');
    e.respondWith(
        (async () => (await caches.match(e.request)) || fetch(e.request))()
    );
});
