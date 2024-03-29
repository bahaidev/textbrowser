import {jml, $} from 'jamilih';
import Templates from './index.js';
import {dialogs} from '../utils/dialogs.js';

export default {
  anchorRowCol ({anchorRowCol}) {
    return $('#' + anchorRowCol);
  },
  anchors ({escapedRow, escapedCol}) {
    const sel = 'tr[data-row="' + escapedRow + '"]' +
            (escapedCol
              ? ('> td[data-col="' + escapedCol + '"]')
              : '');
    return $(sel);
  },
  main (...args) {
    let html;
    try {
      html = Templates.resultsDisplayServerOrClient.main(...args);
    } catch (err) {
      if (err.message === 'JSON support is currently not available') {
        dialogs.alert(err.message);
      } else {
        console.error(err);
      }
    }
    jml(...html, $('#main'));
  }
};
