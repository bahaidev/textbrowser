// Todo: Reimplement this with `formSerialize.deserialize` as possible

// @ts-expect-error Todo: Add types
import {serialize as formSerialize} from 'form-serialization';

/**
 * @param {URLSearchParams} paramsCopy
 */
export const replaceHash = (paramsCopy) => {
  return location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
};

/**
 * @param {{
*   l: import('intl-dom').I18NCallback,
*   lParam: (key: string) => string,
*   $p: import('./IntlURLSearchParams.js').default
* }} args
*/
export const getSerializeParamsAsURL = function (args) {
  const setter = getParamsSetter(args);
  /**
   * @param {{
   *   form: HTMLFormElement,
   *   random: {checked: boolean},
   *   checkboxes: HTMLInputElement[],
   *   type: string,
   *   fieldAliasOrNames?: string[],
   *   workName?: string
   * }} innerArg
   */
  return function (innerArg) {
    const paramsCopy = setter(innerArg);
    return replaceHash(paramsCopy);
  };
};

/**
 * @param {{
 *   l: import('intl-dom').I18NCallback,
 *   lParam: (key: string) => string,
 *   $p: import('./IntlURLSearchParams.js').default
 * }} cfg
 */
export const getParamsSetter = function ({l, lParam, $p}) {
  /**
   * @param {{
   *   form: HTMLFormElement,
   *   random: {checked: boolean},
   *   checkboxes: HTMLInputElement[],
   *   type: string,
   *   fieldAliasOrNames?: string[],
   *   workName?: string
   * }} cfg
   */
  return function ({form, random = {
    checked: false
  }, checkboxes, type, fieldAliasOrNames = [], workName}) {
    const paramsCopy = new URLSearchParams($p.params);
    const formParamsHash = formSerialize(form, {hash: true, empty: true});

    Object.keys(formParamsHash).forEach((key) => {
      paramsCopy.set(key, formParamsHash[key]);
    });

    // Follow the same style (and order) for checkboxes
    paramsCopy.delete(lParam('rand'));
    paramsCopy.set(
      lParam('rand'), /** @type {string} */ (
        random.checked ? l('yes') : l('no')
      )
    );

    // We want checkboxes to typically show by default, so we cannot use the
    //    standard serialization
    checkboxes.forEach((checkbox) => {
      // Let's ensure the checked items are all together (at the end)
      paramsCopy.delete(checkbox.name);
      if (checkbox.name) { // We don't want, e.g., preference controls added to URL
        paramsCopy.set(
          checkbox.name,
          /** @type {string} */
          (checkbox.checked ? l('yes') : l('no'))
        );
      }
    });

    /**
         *
         * @returns {void}
         */
    function removeStartsEndsAndAnchors () {
      let num = 1;
      let num2 = 1;
      while (paramsCopy.has(`${workName}-start${num}-${num2}`)) {
        while (paramsCopy.has(`${workName}-start${num}-${num2}`)) {
          paramsCopy.delete(`${workName}-start${num}-${num2}`);
          paramsCopy.delete(`${workName}-end${num}-${num2}`);
          paramsCopy.delete(`${workName}-anchor${num}-${num2}`);
          num2++;
        }
        num2 = 1;
        num++;
      }
    }

    switch (type) {
    case 'saveSettings': {
      // In case it was added previously on
      //    this page, let's remove it.
      paramsCopy.delete(lParam('rand'));
      break;
    }
    case 'shortcutResult': {
      paramsCopy.delete(lParam('rand'));
      let num = 1;
      while (paramsCopy.has(`anchorfield${num}`)) {
        paramsCopy.delete(`anchorfield${num}`);
        num++;
      }
      removeStartsEndsAndAnchors();

      num = 1;
      // Delete field-specific so we can add our own
      while (paramsCopy.has(`field${num}`)) {
        paramsCopy.delete(`field${num}`);
        paramsCopy.delete(`checked${num}`);
        paramsCopy.delete(`interlin${num}`);
        paramsCopy.delete(`css${num}`);
        num++;
      }
      fieldAliasOrNames.forEach((fieldAliasOrName, i) => {
        paramsCopy.set(`field${i + 1}`, fieldAliasOrName);
        // Todo: Restrict by content locale?
        paramsCopy.set(`checked${i + 1}`, /** @type {string} */ (l('yes')));
        paramsCopy.set(`interlin${i + 1}`, '');
        paramsCopy.set(`css${i + 1}`, '');
      });
      paramsCopy.delete('work');
    }
    // Fallthrough
    case 'startEndResult':
    case 'randomResult':
    case 'result': {
      if (type === 'startEndResult') {
        removeStartsEndsAndAnchors();
      }
      // In case it was added previously on this page,
      //    let's put random again toward the end.
      if (type === 'randomResult' || random.checked) {
        paramsCopy.delete(lParam('rand'));
        paramsCopy.set(lParam('rand'), /** @type {string} */ (l('yes')));
      }
      paramsCopy.set(lParam('result'), /** @type {string} */ (l('yes')));
      break;
    }
    default: {
      console.error('Unexpected type', type);
    }
    }
    return paramsCopy;
  };
};
