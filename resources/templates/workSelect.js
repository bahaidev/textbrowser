import {jml, $} from 'jamilih';

// @ts-expect-error -- Missing TS
import {deserialize as formDeserialize} from 'form-serialization';

/**
 * @param {{
 *   groups: import('../utils/WorkInfo.js').FileGroup[]
 *   workI18n: import('intl-dom').I18NCallback
 *   getNextAlias: () => string|string[]|import('../../server/main.js').LocalizationStrings
 *   $p: import('../utils/IntlURLSearchParams.js').default
 *   followParams: (formSelector: string, cb: () => void) => void
 * }} cfg
 */
const workSelect = function ({groups, workI18n, getNextAlias, $p, followParams}) {
  const form = jml(
    'form',
    {id: 'workSelect', class: 'focus', $on: {
      submit (e) {
        e.preventDefault();
      }
    }},
    groups.map((group, i) => {
      return /** @type {import('jamilih').JamilihArray} */ (['div', [
        i > 0 ? ['br', 'br', 'br'] : '',
        ['div', [
          workI18n(group.directions.localeKey)
        ]],
        ['br'],
        ['select', {
          class: 'file',
          name: 'work' + i,
          dataset: {
            name: group.name.localeKey
          },
          $on: {
            change (e) {
              // eslint-disable-next-line prefer-destructuring -- TS
              const value = /** @type {HTMLSelectElement} */ (e.target).value;
              /*
                            // If using click, but click doesn't always fire
                            if (e.target.nodeName.toLowerCase() === 'select') {
                                return;
                            }
                            */
              followParams('#workSelect', () => {
                $p.set('work', value);
              });
            }
          }
        }, [
          ['option', {value: ''}, ['--']],
          ...group.files.map(({name: fileName}) => {
            return ['option', {
              value: workI18n(['workNames', group.id, fileName])
            }, [getNextAlias()]];
          })
        ]]
        // Todo: Add in Go button (with 'submitgo' localization string) to
        //    avoid need for pull-down if using first selection?
      ]]);
    }),
    $('#main')
  );
  if (history.state && typeof history.state === 'object') {
    formDeserialize(document.querySelector('#workSelect'), history.state);
  }
  return form;
};

export default workSelect;
