/* eslint-env browser */
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
      body.firstChild.remove();
    }
    return jml('div', {
      id: 'main', role: 'main'
    }, body);
  },
  permissions: {
    versionChange () {
      $('#versionChange').showModal();
    },
    addLogEntry ({text}) {
      const installationDialog = $('#installationLogContainer');
      try {
        installationDialog.showModal();
        const container = $('#dialogContainer');
        container.hidden = false;
      } catch (err) {
        // May already be open
      }
      $('#installationLog').append(text + '\n');
    },
    exitDialogs () {
      const container = $('#dialogContainer');
      if (container) {
        container.hidden = true;
      }
    },
    dbError ({type, escapedErrorMessage}) {
      if (type) {
        jml('span', [
          type, ' ',
          escapedErrorMessage
        ], $('#dbError'));
      }
      $('#dbError').showModal();
    },
    errorRegistering (escapedErrorMessage) {
      if (escapedErrorMessage) {
        jml('span', [escapedErrorMessage], $('#errorRegistering'));
      }
      $('#errorRegistering').showModal();
    },
    browserNotGrantingPersistence () {
      $('#browserNotGrantingPersistence').showModal();
    },
    /**
     * @param {PlainObject} cfg
     * @param {I18NCallback} cfg.siteI18n
     * @param {() => Promise<void>} cfg.ok
     * @param {() => void} cfg.refuse
     * @param {() => Promise<void>} cfg.close
     * @param {() => void} cfg.closeBrowserNotGranting
     * @returns {[
     *   HTMLDialogElement, HTMLDialogElement, HTMLDialogElement,
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
      let requestPermissionsDialog = '';
      if (ok) {
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
