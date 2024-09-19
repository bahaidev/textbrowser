import {jml, $} from 'jamilih';
import Templates from './index.js';
import {dialogs} from '../utils/dialogs.js';

export default {
  /**
   * @param {{
   *   anchorRowCol: string
   * }} cfg
   */
  anchorRowCol ({anchorRowCol}) {
    return $('#' + anchorRowCol);
  },
  /**
   * @param {{
   *   escapedRow: string
   *   escapedCol: string|undefined
   * }} cfg
   */
  anchors ({escapedRow, escapedCol}) {
    const sel = 'tr[data-row="' + escapedRow + '"]' +
            (escapedCol
              ? ('> td[data-col="' + escapedCol + '"]')
              : '');
    return $(sel);
  },

  /**
   * @param {import('./resultsDisplayServerOrClient.js').ResultsDisplayServerOrClientArgs} args
   */
  main (args) {
    let html;
    try {
      html = /** @type {import('jamilih').JamilihArray} */ (
        Templates.resultsDisplayServerOrClient.main(args)
      );
    } catch (error) {
      const err = /** @type {Error} */ (error);
      if (err.message === 'JSON support is currently not available') {
        dialogs.alert(err.message);
      } else {
        console.error(err);
      }
      return;
    }
    jml(...html, $('#main'));
  }
};
