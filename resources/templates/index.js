import {jml, $, body} from 'jamilih';

import languageSelect from './languageSelect.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import resultsDisplayServerOrClient from './resultsDisplayServerOrClient.js';
import resultsDisplayClient from './resultsDisplayClient.js';

const Templates = {
  languageSelect,
  workSelect,
  workDisplay,
  resultsDisplayServerOrClient,
  resultsDisplayClient,
  defaultBody () {
    // We empty rather than `replaceWith` as our Jamilih `body`
    //   aliases expect the old instance
    while (body.hasChildNodes()) {
      body.firstChild?.remove();
    }
    return jml('div', {
      id: 'main', role: 'main'
    }, body);
  },
  permissions: {
    versionChange () {
      /** @type {HTMLDialogElement} */
      ($('#versionChange'))?.showModal();
    },

    /**
     * @param {{text: string}} cfg
     */
    addLogEntry ({text}) {
      const installationDialog = $('#installationLogContainer');
      try {
        /** @type {HTMLDialogElement} */
        (installationDialog).showModal();
        const container = /** @type {HTMLElement} */ ($('#dialogContainer'));
        container.hidden = false;
      // eslint-disable-next-line no-unused-vars -- Ok
      } catch (err) {
        // May already be open
      }
      /** @type {HTMLElement} */ ($('#installationLog')).append(text + '\n');
    },
    exitDialogs () {
      const container = $('#dialogContainer');
      if (container) {
        container.hidden = true;
      }
    },
    /**
     * @param {{
     *   type: string,
     *   escapedErrorMessage: string
     * }} cfg
     */
    dbError ({type, escapedErrorMessage}) {
      if (type) {
        jml('span', [
          type, ' ',
          escapedErrorMessage
        ], $('#dbError'));
      }
      /** @type {HTMLDialogElement} */
      ($('#dbError')).showModal();
    },

    /**
     * @param {string} escapedErrorMessage
     */
    errorRegistering (escapedErrorMessage) {
      if (escapedErrorMessage) {
        jml('span', [escapedErrorMessage], $('#errorRegistering'));
      }
      /** @type {HTMLDialogElement} */
      ($('#errorRegistering')).showModal();
    },
    browserNotGrantingPersistence () {
      /** @type {HTMLDialogElement} */
      ($('#browserNotGrantingPersistence')).showModal();
    },
    /**
     * @param {object} cfg
     * @param {import('intl-dom').I18NCallback} cfg.siteI18n
     * @param {() => Promise<void>} [cfg.ok]
     * @param {() => void} [cfg.refuse]
     * @param {() => Promise<void>} [cfg.close]
     * @param {() => void} [cfg.closeBrowserNotGranting]
     * @returns {[
     *   HTMLDialogElement, HTMLDialogElement|"", HTMLDialogElement|"",
     *   HTMLDialogElement, HTMLDialogElement, HTMLDialogElement
     * ]}
     */
    main ({siteI18n, ok, refuse, close, closeBrowserNotGranting}) {
      const installationDialog = jml('dialog', {
        style: 'text-align: center; height: 100%',
        id: 'installationLogContainer',
        class: 'focus'
      }, [
        ['p', [
          siteI18n('wait-installing')
        ]],
        ['div', {style: 'height: 80%; overflow: auto;'}, [
          ['pre', {id: 'installationLog'}, [
          ]]
        ]]
        // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
      ]);

      /** @type {""|HTMLDialogElement} */
      let requestPermissionsDialog = '';
      if (ok && refuse && close) {
        requestPermissionsDialog = jml(
          'dialog', {
            id: 'willRequestStoragePermissions',
            $on: {close}
          }, [
            ['section', [
              siteI18n('will-request-storage-permissions')
            ]],
            ['br'],
            ['div', {class: 'focus'}, [
              ['button', {$on: {click: ok}}, [
                siteI18n('OK')
              ]],
              ['br'], ['br'],
              ['button', {$on: {click: refuse}}, [
                siteI18n('refuse-request-storage-permissions')
              ]]
            ]]
          ]
        );
      }
      const errorRegisteringNotice = jml(
        'dialog', {
          id: 'errorRegistering'
        }, [
          ['section', [
            siteI18n('errorRegistering')
          ]]
        ]
      );

      /** @type {""|HTMLDialogElement} */
      let browserNotGrantingPersistenceAlert = '';
      if (closeBrowserNotGranting) {
        browserNotGrantingPersistenceAlert = jml(
          'dialog', {
            id: 'browserNotGrantingPersistence'
          }, [
            ['section', [
              siteI18n('browser-not-granting-persistence')
            ]],
            ['br'],
            ['div', {class: 'focus'}, [
              ['button', {$on: {click: closeBrowserNotGranting}}, [
                siteI18n('OK')
              ]]
            ]]
          ]
        );
      }
      const versionChangeNotice = jml(
        'dialog', {
          id: 'versionChange'
        }, [
          ['section', [
            siteI18n('versionChange')
          ]]
        ]
      );
      const dbErrorNotice = jml(
        'dialog', {
          id: 'dbError'
        }, [
          ['section', [
            siteI18n('dbError')
          ]]
        ]
      );
      jml('div', {id: 'dialogContainer', style: 'height: 100%'}, [
        installationDialog,
        requestPermissionsDialog,
        browserNotGrantingPersistenceAlert,
        errorRegisteringNotice,
        versionChangeNotice,
        dbErrorNotice
      ], $('#main'));

      return [
        installationDialog,
        requestPermissionsDialog,
        browserNotGrantingPersistenceAlert,
        errorRegisteringNotice, versionChangeNotice, dbErrorNotice
      ];
    }
  }
};
export default Templates;
