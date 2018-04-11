/* globals console, location, URL */
import {escapeHTML} from './sanitize.js';
import getJSON from 'simple-get-json';
import {getWorkFiles} from './WorkInfo.js';

export const setServiceWorkerDefaults = (target, source) => {
    target.languages = source.languages || new URL(
        '../appdata/languages.json',
        // Todo: Substitute with moduleURL once implemented
        new URL('node_modules/textbrowser/resources/index.js', location)
    ).href;
    target.serviceWorkerPath = source.serviceWorkerPath || 'sw.js';
    target.files = source.files || 'files.json';
    target.namespace = source.namespace || 'textbrowser';
    target.staticFilesToCache = source.staticFilesToCache; // Defaults in worker file (as `userStaticFiles`)
    return target;
};

// Keep in this file as may wish to avoid using for server (while still
//   doing other service worker work)
// Todo: Avoid `this` below?
export const registerServiceWorker = async ({
    languages,
    langs,
    userDataFiles,
    files, staticFilesToCache,
    serviceWorkerPath, namespace,
    logger
}) => {
    ([langs, userDataFiles] = await Promise.all([
        langs || (await getJSON(languages)).languages,
        userDataFiles || await getWorkFiles(files)
    ]));
    // Todo: We might wish to allow avoiding the other locale files
    //   and if only one chosen, switch to the work selection page
    //   in that language
    /*
    (Configurable) Strategy options

    - Wait and put everything in an `install` `waitUntil` after we've retrieved
    the user JSON, informing the user that they must wait for everything to
    download and ensure they can go completely offline (especially for sites
    which don't have that much offline content).
    - A safer bet (especially for non-hardcore users) is to pre-cache the
    necessary files for this app, and download the rest as available. However,
    if the user attempts to download while they are offline before
    they got all files, we'll need to show a notice. The *TextBrowser* source
    files, the user's files list and locales should be enough.

    For either option, we might possibly (and user-optionally) send a notice
    (whose approval we've asked for already) when all files are complete,
    */

    console.log(
        '--ready to register service worker',
        serviceWorkerPath
    );
    // `persist` will grandfather non-persisted caches, so if we don't end up
    //    using `install` event for dynamic items, we could put the service worker
    //    registration at the beginning of the file without waiting for persistence
    //    approval (or at least after rendering page to avoid "jankiness"); however,
    //    as we want to show a dialog about permissions first, we wait until here.
    const r = await navigator.serviceWorker.register(
        serviceWorkerPath
    );
    // We use this promise for rejecting (inside a listener)
    //    to a common catch and to prevent continuation by
    //    failing to return
    /* const ready = */ await new Promise((resolve, reject) => {
        logger.addLogEntry({
            text: 'Worker registered'
        });
        navigator.serviceWorker.onmessage = (e) => {
            const {data} = e;
            console.log('msg1', data, r);
            if (data === 'finishedActivate') {
                logger.addLogEntry({
                    text: 'Finished activation...'
                });
                // Still not controlled even after activation is
                //    ready, so refresh page

                // Seems to be working (unlike `location.replace`),
                //  but if problems, could add `true` but as forces
                //  from server not cache, what will happen here?
                location.reload();
                // location.replace(location); // Avoids adding to browser history)

                // This will cause jankiness and unnecessarily show languages selection
                // resolve();
                return;
            }
            if (data.activationError) {
                const {message, dbError, errorType} = data;
                const err = new Error(message);
                err.errorType = errorType;
                if (dbError) {
                    logger.dbError({
                        errorType,
                        escapedErrorMessage: escapeHTML(message)
                    });
                }
                reject(err);
                return;
            }
            if (r.active) { // Just use `e.source`?
                logger.addLogEntry({
                    text: 'Finished caching'
                });
                logger.addLogEntry({
                    text: 'Beginning activation (database resources)...'
                });
                console.log('active1', e);
                r.active.postMessage({
                    type: 'activate',
                    namespace,
                    filesJSONPath: files
                });
            }
        };
        // No need to expect a message from the installing event,
        //   as the `register` call seems to get called if ready
        if (r.installing) {
            console.log('installingggg');
            const langPathParts = languages.split('/');
            // Todo: We might give option to only download
            //        one locale and avoid language splash
            //        page
            const localeFiles = langs.map(
                ({locale: {$ref}}) =>
                    (langPathParts.length > 1
                        ? langPathParts.slice(0, -1).join('/') + '/'
                        : ''
                    ) + $ref
            );
            logger.addLogEntry({
                text: 'Beginning caching of files...'
            });
            r.installing.postMessage({
                type: 'install',
                namespace,
                localeFiles,
                userDataFiles, // including plugins, etc.
                userStaticFiles: staticFilesToCache
            });
            /*
            const r = await navigator.serviceWorker.ready;
            console.log('SWWWWW ready!', r.active);
            r.active.postMessage({
                type: 'activate',
                namespace,
                filesJSONPath: files
            });
            */
        }
    });
    /*
    const controller = navigator.serviceWorker.controller ||
        (await navigator.serviceWorker.ready).active;
    console.log('r', serviceWorkerPath);
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (e) => {
        if (e.data.error) {
            console.log('err', e.data.error);
        } else {
            console.log('data', e.data);
        }
    };
    controller.postMessage('test', [messageChannel.port2]);
    */
};
