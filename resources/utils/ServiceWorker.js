/* globals console, location, URL */
import {escapeHTML} from './sanitize.js';
import getJSON from 'simple-get-json';
import {getWorkFiles} from './WorkInfo.js';
import {dialogs} from './dialogs.js';

export const listenForWorkerUpdate = ({r}) => {
    r.addEventListener('updatefound', () => {
        // New service worker has appeared
        // r.installing now available
        const newWorker = r.installing;

        newWorker.addEventListener('statechange', () => {
            const {state} = newWorker;
            switch (state) {
            case 'installing': // install event has fired, but not yet complete
                console.log('Installing new worker');
                break;
            // Since not skipping waiting, this means waiting finished
            case 'installed': // install complete
                console.log('Installation status', state);
                dialogs.alert(`
A new version of this offlinable app has been downloaded.

If you have work to complete in this tab, you can dismiss
this dialog now and continue working with the old version.

However, when you are finished, you should close this tab
and any other old tabs for this site in order to be able to
begin using the new version.
`
                );
                break;
            case 'redundant': // discarded. Either failed install, or it's been
                //                replaced by a newer version
                // Shouldn't be replaced since we aren't skipping waiting/claiming,
                console.log('Installation status', state);
                // Todo: Try updating again if get redundant here
                dialogs.alert(`
There was an error during installation (to allow offline/speeded
cache use).

If you have work to complete in this tab, you can dismiss
this dialog now and continue working with the old version.

However, when you are finished, you may wish to close this tab
and any other old tabs for this site in order to try again
for offline installation.
`
                );
                break;
            // These shouldn't occur as we are not skipping waiting (?)
            case 'activating': // the activate event has fired, but not yet complete
                console.log('Activating new worker');
                break;
            case 'activated': // fully active
                console.log('Activated new worker');
                break;
            default:
                throw new Error(`Unknown worker update state: ${state}`);
            }
        });
    });
};

export const respondToState = async ({
    r, logger, languages, langs, namespace, files, userDataFiles, staticFilesToCache
}) => {
    ([langs, userDataFiles] = await Promise.all([
        langs || (await getJSON(languages)).languages,
        userDataFiles || await getWorkFiles(files)
    ]));

    // We use this promise for rejecting (inside a listener)
    //    to a common catch and to prevent continuation by
    //    failing to return
    return new Promise(async (resolve, reject) => {
        if (r.waiting) {
            await dialogs.alert(`
An update is in progress. After finishing any work
you have in them, please close any other existing tabs
running this web application and then hit ok here so
that the update may complete.
`
            );
            // We might just let the user go on without a reload, but
            //   as fetch operations would apparently wait to execute,
            //   it wouldn't be much use, so just reload (to get same
            //   message again until other tabs closed)
            // If state has changed, handle below
            if (!r.installing && !r.active) {
                location.reload();
                return;
            }
        }
        const worker = r.installing || r.waiting || r.active;
        if (worker && worker.state === 'redundant') {
            // Todo: We could call `register()` below instead (on a timeout)?
            await dialogs.alert(`
There was likely an error installing. Click "ok" to try again.
(Error code: Service worker is redundant)
`
            );
            location.reload();
            return;
        }
        // listenForWorkerUpdate({r});

        function finishInstall () {
            console.log('installingggg', r.installing);
            const langPathParts = languages.split('/');
            // Todo: We might give option to only download
            //        one locale and avoid language splash page
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
                userDataFiles, // Todo: This should include plugins
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
            // (Unless skipped in code, will wait between install
            //    of new and activation of new or existing if still
            //    some tabs open)
        }

        navigator.serviceWorker.onmessage = (e) => {
            const {data} = e;
            console.log('msg1', data, r);
            switch (data) {
            case 'finishedActivate':
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
            case 'finishActivate': // Just use `e.source`?
                console.log('activating', e);
                logger.addLogEntry({
                    text: 'Finished caching'
                });
                logger.addLogEntry({
                    text: 'Beginning activation (database resources)...'
                });

                // r.active is also available for mere "activating"
                //    as we are now
                r.active.postMessage({
                    type: 'activate',
                    namespace,
                    filesJSONPath: files
                });
                return;
            case 'finishInstall':
                finishInstall();
                return;
            }
            if (data && data.activationError) {
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
            }
        };

        // No need to expect a message from the installing event,
        //   as the `register` call seems to get called if ready
        if (r.installing) {
            finishInstall();
            return;
        }
        resolve();
    });
};

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
    // Todo: We might wish to allow avoiding the other locale files
    //   and if only one chosen, switch to the work selection page
    //   in that language
    /*
    Todo: (Configurable) Strategy options

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
    (whose approval we've asked for already) when all files are complete
    instead of just a dialog,
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
    let r;
    try {
        r = await navigator.serviceWorker.register(
            serviceWorkerPath
        );
    } catch (err) {
        await dialogs.alert(`
There was an error during registration (for offline ability).
Please refresh the page if you wish to reattempt.
`);
        return;
    }

    logger.addLogEntry({
        text: 'Worker registered'
    });

    return respondToState({
        r, logger, languages, langs, namespace, files, userDataFiles, staticFilesToCache
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
