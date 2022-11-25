/* globals console, location, URL */
// import {escapeHTML} from './sanitize.js';
import {dialogs} from './dialogs.js';

/**
 * Note that this function be kept as a polyglot client-server file.
 * @param {PlainObject} target
 * @param {PlainObject} source
 * @returns {{
 *   userJSON: string,
 *   languages: string,
 *   serviceWorkerPath: string,
 *   files: string,
 *   namespace: string
 * }}
 */
export const setServiceWorkerDefaults = (target, source) => {
  target.userJSON = source.userJSON || 'resources/user.json';
  target.languages = source.languages || new URL(
    '../appdata/languages.json',
    // Todo: Substitute with `import.meta.url`
    new URL('node_modules/textbrowser/resources/index.js', location)
  ).href;
  target.serviceWorkerPath = source.serviceWorkerPath ||
        `sw.js?pathToUserJSON=${
          encodeURIComponent(target.userJSON)
        }&stylesheets=${
          encodeURIComponent(JSON.stringify(target.stylesheets || []))
        }`;
  target.files = source.files || 'files.json';
  target.namespace = source.namespace || 'textbrowser';
  return target;
};

// (Unless skipped in code, will wait between install
//    of new and activation of new or existing if still
//    some tabs open)

export const listenForWorkerUpdate = ({
  r, logger
}) => {
  r.addEventListener('updatefound', (e) => {
    // New service worker has appeared
    // r.installing now available (though r.active is also,
    //    apparently due to prior activation; but not r.waiting)
    console.log('update found', e);
    const newWorker = r.installing;

    // statechange won't catch this installing event as already installing

    newWorker.addEventListener('statechange', async () => {
      const {state} = newWorker;
      switch (state) {
      case 'installing':
        console.log('Installing new worker');
        break;
      case 'installed':
        console.log('Installation status', state);
        await dialogs.alert(`
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
        await dialogs.alert(`
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
      case 'activating':
        console.log('Activating new worker');
        break;
      case 'activated':
        console.log('Activated new worker');
        break;
      default:
        throw new Error(`Unknown worker update state: ${state}`);
      }
    });
  });
};

export const respondToState = async ({
  r, logger
}) => {
  // We use this promise for rejecting (inside a listener)
  //    to a common catch and to prevent continuation by
  //    failing to return
  return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
    navigator.serviceWorker.addEventListener('message', ({data}) => {
      const {message, type, name, errorType} = data;
      console.log('msg1', message, r);
      switch (type) {
      case 'log':
        logger.addLogEntry({
          text: message
        });
        return;
      case 'beginInstall':
        logger.addLogEntry({
          text: 'Install: Begun...'
        });
        return;
      case 'finishedInstall':
        logger.addLogEntry({
          text: 'Install: Finished...'
        });
        return;
      case 'beginActivate': // Just use `e.source`?
        logger.addLogEntry({
          text: 'Activate: Caching finished'
        });
        logger.addLogEntry({
          text: 'Activate: Begin database resources storage...'
        });
        // r.active is also available for mere "activating"
        //    as we are now
        return;
      case 'finishedActivate':
        logger.addLogEntry({
          text: 'Activate: Finished...'
        });
        // Still not controlled even after activation is
        //    ready, so refresh page

        // Seems to be working (unlike `location.replace`),
        //  but if problems, could add `true` but as forces
        //  from server not cache, what will happen here? (also
        //  `controller` may be `null` with force-reload)
        location.reload();
        // location.replace(location); // Avoids adding to browser history)

        // This will cause jankiness and unnecessarily show languages selection
        // resolve();
        return;
      case 'error':
        logger.addLogEntry({
          text: message + `${
            errorType === 'dbError' ? `Database error ${name}` : ''
          }; trying again...`
        });
        /*
                if (errorType === 'dbError') {
                    logger.dbError({
                        type: name || errorType,
                        escapedErrorMessage: escapeHTML(message)
                    });
                }
                */
        // Todo: auto-close any dbError dialog if retrying
        // No longer rejecting as should auto-retry
        /*
                const err = new Error(message);
                err.type = type;
                reject(err);
                */
        break;
      default:
        console.error('Unexpected type', type);
        break;
      }
    });
    const worker = r.installing || r.waiting || r.active;
    // Failed or new worker in use
    if (worker && worker.state === 'redundant') {
      // Todo: We could call `register()` below instead (on a timeout)?
      await dialogs.alert(`
There was likely an error installing. Click "ok" to try again.
(Error code: Service worker is redundant)
`
      );
      location.reload();
      // listenForWorkerUpdate({r, logger});
    } else if (r.installing) {
      // No need to expect a message from the installing event,
      //   as the `register` call seems to get called if ready
      console.log('INSTALLING');
    } else if (r.waiting) {
      // Todo: Any way to auto-refresh (didn't seem to work
      //    even as only tab)
      await dialogs.alert(`
An update is in progress. After finishing any work
you have in them, please close this and any other existing tabs
running this web application and then open the site again.
Please note it may take some time to install and may not show
any indication it is installing.
`, {ok: false}
      );
      // We might just let the user go on without a reload, but
      //   as fetch operations would apparently wait to execute,
      //   it wouldn't be much use, so just reload (to get same
      //   message again until other tabs closed)
      // If state has changed, handle below
      /*
            if (!r.installing && !r.active) {
                location.reload();
                return;
            }
            resolve();
            */
    }
  });
};

// Keep in this file as may wish to avoid using for server (while still
//   doing other service worker work)
export const registerServiceWorker = async ({
  serviceWorkerPath,
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
    instead of just a dialog. We could also skip waiting if we disabled offline
    on previously controlled clients (until refresh would get new app files
    and database queries wouldn't be broken)
    */

  console.log(
    '--ready to register service worker',
    serviceWorkerPath
  );
  // `persist` will grandfather non-persisted caches, so if we don't end up
  //    using `install` event for dynamic items, we could put the service worker
  //    registration at the beginning of the file without waiting for persistence
  //    approval (or at least after rendering page to avoid visual "jankiness"/
  //    competititon for network for low-bandwidth sites); however,
  //    as we want to show a dialog about permissions first, we wait until here.
  let r;
  try {
    r = await navigator.serviceWorker.register(
      serviceWorkerPath, {
        type: 'module'
      }
    );
  } catch (err) {
    console.log('serviceWorkerPath', serviceWorkerPath);
    await dialogs.alert(`
There was an error during registration (for offline ability).
Please refresh the page if you wish to reattempt.
`);
    return;
  }

  logger.addLogEntry({
    text: 'Worker registration: Complete'
  });

  // Todo: Catch errors?
  return respondToState({
    r, logger
  });
};
