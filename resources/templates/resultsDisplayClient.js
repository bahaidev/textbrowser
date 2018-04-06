/* eslint-env browser */
import {$} from './utils/dom.js';
import jml from 'jamilih';
import Templates from './index.js';

export default {
    anchorRowCol ({anchorRowCol}) {
        return $('#' + anchorRowCol);
    },
    anchors ({escapedRow, escapedCol}) {
        const sel = 'td[data-row="' + escapedRow + '"]' +
            (escapedCol
                ? ('[data-col="' + escapedCol + '"]')
                : '');
        return $(sel);
    },
    main (...args) {
        let html;
        try {
            html = Templates.resultsDisplayServerOrClient.main(...args);
        } catch (err) {
            if (err.message === 'JSON support is currently not available') {
                alert(err.message);
            }
        }
        jml(...html, document.body);
    }
};
