import {jml, $} from 'jamilih';

// @ts-expect-error Missing TS types
import {deserialize as formDeserialize} from 'form-serialization';

export default {
  /**
   * @param {{
   *   langs: import('../../server/main.js').LanguageInfo[]
   *   languages: import('../utils/Languages.js').Languages
   *   followParams: (formSelector: string, cb: () => void) => void
   *   $p: import('../utils/IntlURLSearchParams.js').default
   * }} cfg
   */
  main ({langs, languages, followParams, $p}) {
    jml('form', {class: 'focus', id: 'languageSelectionContainer', $on: {
      submit (e) {
        e.preventDefault();
      }
    }}, [
      ['select', {
        name: 'lang',
        size: langs.length,
        $on: {
          click ({target: {parentNode: {
            // @ts-expect-error Ok
            selectedOptions
          }}}) {
            followParams('#languageSelectionContainer', () => {
              $p.set('lang', selectedOptions[0].value, true);
            });
          }
        }
      }, langs.map(({code}) => {
        return ['option', {value: code}, [languages.getLanguageFromCode(code)]];
      })]
    ], $('#main'));
    if (history.state && typeof history.state === 'object') {
      formDeserialize(document.querySelector('#languageSelectionContainer'), history.state);
    }
  }

  // Todo: Add in Go button (with 'submitgo' localization string) to
  //   avoid need for pull-down if using first selection?
  /* Works too:
    langs.map(({code, name}) =>
        ['div', [
            ['a', {href: '#', dataset: {code}}, [name]]
        ]]
    ), $('#main')
    */
};
