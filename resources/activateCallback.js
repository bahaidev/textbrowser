/**
 * @file Note that this should be kept as a polyglot client-server file
 *    (besides the server, it is to be invoked by the project service worker).
 */
/* eslint-env worker -- Worker environment */

/**
 * @typedef {import('./utils/Metadata.js')} MetadataFile
 */

/**
 * @typedef {number} Integer
 */
const {ceil} = Math;

/**
 * @param {any[]} arr
 * @param {number} size
 */
const arrayChunk = (arr, size) => {
  return Array.from({length: ceil(arr.length / size)}, (_, i) => {
    const offset = i * size;
    return arr.slice(offset, offset + size);
  });
};

// Todo: If fetching fails here (or in install), e.g., because activate event
//          never completed
//          to cache, de-register and re-register (?); how to detect if all
//          files in cache?
// Todo: Check `oldVersion` and run this first if still too old

/**
* @callback Logger
* @param {...any} args
* @returns {void}
*/

/**
 * @param {object} cfg
 * @param {string} cfg.namespace
 * @param {string} cfg.files The files.json path
 * @param {Logger} cfg.log
 * @param {string} [cfg.basePath]
 * @returns {Promise<void>}
 */
export default async function activateCallback ({
  namespace, files, log, basePath = ''
}) {
  // Now we know we have the files cached, we can postpone
  //  the `indexedDB` processing (which will work offline
  //  anyways); also important to avoid conflicts with
  //  already-running versions upon future sw updates
  log('Activate: Callback called');
  const r = await fetch(files);
  const {groups} = /** @type {import('./utils/WorkInfo.js').FilesObject} */ (
    await r.json()
  );

  /**
   * @param {any[]} arr
   * @param {string} path
   */
  const addJSONFetch = (arr, path) => {
    arr.push(
      (async () => (await fetch(basePath + path)).json())()
    );
  };

  /** @type {string[]} */
  const dataFileNames = [];

  /** @type {import('./utils/WorkInfo.js').WorkTableContainer[]} */
  const dataFiles = [];

  /**
   * @typedef {import('json-schema').JSONSchema4} SchemaFile
   */

  /** @type {SchemaFile[]} */
  const schemaFiles = [];

  /** @type {MetadataFile[]} */
  const metadataFiles = [];
  groups.forEach(
    ({files: fileObjs, metadataBaseDirectory, schemaBaseDirectory}) => {
      fileObjs.forEach(({file: {$ref: filePath}, metadataFile, schemaFile, name}) => {
        // We don't i18nize the name here
        dataFileNames.push(name);
        addJSONFetch(dataFiles, filePath);
        addJSONFetch(schemaFiles, schemaBaseDirectory + '/' + schemaFile);
        addJSONFetch(metadataFiles, metadataBaseDirectory + '/' + metadataFile);
      });
    }
  );
  const promises = await Promise.all([
    ...dataFiles, ...schemaFiles, ...metadataFiles
  ]);
  const chunked = arrayChunk(promises, dataFiles.length);
  const [
    , schemaFileResponses, metadataFileResponses
  ] = chunked;
  const dataFileResponses = /** @type {{data: (Integer|string)[][]}[]} */ (chunked[0]);

  log('Activate: Files fetched');
  const dbName = namespace + '-textbrowser-cache-data';
  indexedDB.deleteDatabase(dbName);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName);
    // @ts-expect-error Ok
    req.addEventListener('upgradeneeded', ({target: {result: db}}) => {
      db.onversionchange = () => {
        db.close();
        const err = /** @type {Error & {type: string}} */ (new Error('versionchange'));
        err.type = 'versionchange';
        reject(err);
      };
      dataFileResponses.forEach(({data: tableRows}, i) => {
        const dataFileName = dataFileNames[i];
        const store = db.createObjectStore('files-to-cache-' + dataFileName);

        const schemaFileResponse = schemaFileResponses[i];
        const metadataFileResponse = metadataFileResponses[i];
        const fieldItems = /** @type {{title: string}[]} */ (
          schemaFileResponse.items.items
        );

        /**
         * @typedef {{
         *   name?: string,
         *   presort?: boolean,
         *   set: string[]
         * }} NameSet
         */

        let browseFields =
          /**
           * @type {(string|NameSet)[]|NameSet}
           */ (
            metadataFileResponse.table.browse_fields
          );
        browseFields = Array.isArray(browseFields) ? browseFields : [browseFields];

        /** @type {string[]} */
        const columnIndexes = [];
        browseFields.forEach((browseFieldSetObj) => {
          if (typeof browseFieldSetObj === 'string') {
            browseFieldSetObj = {set: [browseFieldSetObj]};
          }
          if (!browseFieldSetObj.name) {
            browseFieldSetObj.name = browseFieldSetObj.set.join(',');
          }
          const browseFieldSetName = browseFieldSetObj.name;
          const browseFieldSetIndexes = browseFieldSetObj.set.map((browseField) => {
            // Need to convert to columns for numbers
            //      to become valid key paths
            return 'c' + (
              fieldItems.findIndex((item) => item.title === browseField)
            );
          });
          columnIndexes.push(...browseFieldSetIndexes);

          log(
            'Activate: Creating index:',
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

        tableRows.forEach((tableRow, j) => {
          // Todo: Optionally send notice when complete
          // To take advantage of indexes on our arrays, we
          //   need to transform them to objects! See https://github.com/w3c/IndexedDB/issues/209

          /**
           * The `value` property alone contains the latter
           *   `(Integer|string)[]` value.
           * @type {{
           *   [key: string]: string|Integer|(Integer|string)[]
           * }}
           */
          const objRow = {
            value: tableRow
          };
          uniqueColumnIndexes.forEach((colIdx) => {
            // Indexed like c0, c1, c2, etc.
            objRow[colIdx] = tableRow[Number.parseInt(colIdx.slice(1))];
          });
          // log('objRow', objRow);
          store.put(objRow, j);
        });
      });
    });

    // @ts-expect-error Ok
    req.addEventListener('success', ({target: {result: db}}) => {
      log('Activate: Database set-up complete', db);
      // Todo: Replace this with `ready()` check
      //   in calling code?
      resolve();
    });

    /**
     * @param {Event & {error?: Error}} ev
     */
    const onerr = (ev) => {
      const error = /** @type {Error & {type: string}} */ (
        ev.error ?? new Error('dbError')
      );
      error.type = 'dbError';
      reject(error);
    };
    req.addEventListener('blocked', onerr);
    req.addEventListener('error', onerr);
  });
}
