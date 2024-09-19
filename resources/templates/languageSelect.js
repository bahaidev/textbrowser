import {jml, $} from 'jamilih';
import {deserialize as formDeserialize} from 'form-serialization';

export default {
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
          click ({target: {parentNode: {selectedOptions}}}) {
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
