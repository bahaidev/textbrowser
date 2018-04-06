/* globals module, console, fetch, indexedDB */
var activateCallback; // eslint-disable-line no-unused-vars, no-var

(async () => {
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

activateCallback = async function activateCallback ({
    namespace, files, filesJSONPath = files
}) {
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
    return new Promise((resolve, reject) => {
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
        req.onsuccess = ({target: {result: db}}) => {
            console.log('database activation set-up complete', db);
            // Todo: Replace this with `ready()` check
            //   in calling code?
            resolve();
        };
        req.onblocked = req.onerror = ({error = new Error('dbError')}) => {
            error.dbError = true;
            reject(error);
        };
    });
};
if (typeof module !== 'undefined') {
    module.exports = activateCallback;
}
})();
