/* eslint-env browser */
import jml from 'jamilih';

import languageSelect from './languageSelect.js';
import workSelect from './workSelect.js';
import workDisplay from './workDisplay.js';
import resultsDisplayServerOrClient from './resultsDisplayServerOrClient.js';
import resultsDisplayClient from './resultsDisplayClient.js';
import {$} from './utils/dom.js';

const Templates = {
    languageSelect,
    workSelect,
    workDisplay,
    resultsDisplayServerOrClient,
    resultsDisplayClient,
    defaultBody () {
        $('html').style.height = '100%'; // Todo: Set in CSS
        return jml('body', {style: 'height: 100%;'});
    }
};
Templates.permissions = {
    versionChange () {
        $('#versionChange').showModal();
    },
    addLogEntry ({text}) {
        const container = $('#installationLogContainer');
        container.hidden = false;
        $('#installationLog').append(text + '\n');
    },
    exitDialogs () {
        const container = $('#dialogContainer');
        console.log('container', container);
        if (container) {
            container.hidden = true;
        }
    },
    dbError ({errorType, escapedErrorMessage}) {
        if (errorType) {
            jml('span', [
                errorType, ' ',
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
    main ({l, ok, refuse, close, closeBrowserNotGranting}) {
        let requestPermissionsDialog = '';
        if (ok) {
            requestPermissionsDialog = jml(
                'dialog', {
                    id: 'willRequestStoragePermissions',
                    $on: {close}
                }, [
                    ['section', [
                        l('will-request-storage-permissions')
                    ]],
                    ['br'],
                    ['div', {class: 'focus'}, [
                        ['button', {$on: {click: ok}}, [
                            l('OK')
                        ]],
                        ['br'], ['br'],
                        ['button', {$on: {click: refuse}}, [
                            l('refuse-request-storage-permissions')
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
                    l('errorRegistering')
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
                        l('browser-not-granting-persistence')
                    ]],
                    ['br'],
                    ['div', {class: 'focus'}, [
                        ['button', {$on: {click: closeBrowserNotGranting}}, [
                            l('OK')
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
                    l('versionChange')
                ]]
            ]
        );
        const dbErrorNotice = jml(
            'dialog', {
                id: 'dbError'
            }, [
                ['section', [
                    l('dbError')
                ]]
            ]
        );
        jml('div', {id: 'dialogContainer', style: 'height: 100%'}, [
            ['div', {
                style: 'text-align: center; height: 100%',
                id: 'installationLogContainer',
                class: 'focus',
                hidden: true
            }, [
                ['p', [
                    l('wait-installing')
                ]],
                ['div', {style: 'height: 80%; overflow: auto;'}, [
                    ['pre', {id: 'installationLog'}, [
                    ]]
                ]]
                // ['textarea', {readonly: true, style: 'width: 80%; height: 80%;'}]
            ]],
            requestPermissionsDialog,
            browserNotGrantingPersistenceAlert,
            errorRegisteringNotice,
            versionChangeNotice,
            dbErrorNotice
        ], document.body);

        return [
            requestPermissionsDialog, browserNotGrantingPersistenceAlert,
            errorRegisteringNotice, versionChangeNotice, dbErrorNotice
        ];
    }
};
export default Templates;
