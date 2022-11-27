/* eslint-env browser */
import {jml, $} from 'jamilih';
import {deserialize as formDeserialize} from 'form-serialization';

export default {
  main ({langs, languages, followParams, $p}) {
    jml('form', {class: 'focus', id: 'languageSelectionContainer'}, [
      ['select', {
        name: 'lang',
        size: langs.length,
        $on: {
          click () {
            const option = this.options[this.selectedIndex];
            followParams('#languageSelectionContainer', () => {
              $p.set('lang', option.value, true);
            });
          }
        }
      }, langs.map(({code}) =>
        ['option', {value: code}, [languages.getLanguageFromCode(code)]]
      )]
    ], $('#main'));

    // Show the most recently chosen language if user hits back button
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
