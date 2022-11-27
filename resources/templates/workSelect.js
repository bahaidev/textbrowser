/* eslint-env browser */
import {jml, $, $$} from 'jamilih';
import {deserialize as formDeserialize} from 'form-serialization';

export const main = ({
  groups, workI18n, getNextAlias, $p, followParams, worksToOffline
}) => {
  const form = jml(
    'form',
    {id: 'workSelect', class: 'focus', $on: {
      submit (e) {
        e.preventDefault();
      }
    }},
    [
      ['button', {style: 'float: right;', $on: {
        click () {
          worksToOffline();
        }
      }}, [
        'Choose works to take offline'
      ]],
      ['br', {style: 'clear: right;'}],
      ...groups.map((group, i) => {
        return ['div', [
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
              change ({target: {value}}) {
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
            ...group.files.map(({name: fileName}) =>
              ['option', {
                value: workI18n(['workNames', group.id, fileName])
              }, [getNextAlias()]]
            )
          ]]
          // Todo: Add in Go button (with 'submitgo' localization string) to
          //    avoid need for pull-down if using first selection?
        ]];
      })
    ],
    $('#main')
  );
  if (history.state && typeof history.state === 'object') {
    formDeserialize(document.querySelector('#workSelect'), history.state);
  }
  return form;
};

export const children = ({
  groups, l, workI18n, getNextAlias
}) => {
  return [
    ['form', {id: 'workSelect', class: 'focus', $on: {
      submit (e) {
        e.preventDefault();
      }
    }}, [
      ['h2', [l('works_to_offline')]],
      ['i', [
        l('works_to_offline_explanation')
      ]],
      ['div', {style: 'height: 300px; overflow: auto;'}, groups.flatMap(
        (group, i) => {
          return [
            i > 0 ? ['br', 'br', 'br'] : '',
            ['fieldset', {style: 'text-align: left;'}, [
              ['legend', [
                workI18n(group.name.localeKey)
              ]],
              ...group.files.map(({name: fileName}) =>
                ['label', [
                  ['input', {
                    type: 'checkbox',
                    value: workI18n(['workNames', group.id, fileName])
                  }],
                  getNextAlias(),
                  ['br']
                ]]
              ).sort((a, b) => {
                // Sort by localized alias
                return a[1][1] < b[1][1] ? -1 : 1;
              })
            ]]
          ];
        })
      ],
      ['br', 'br'],
      ['button', {$on: {click () {
        $$('#workSelect input[type=checkbox]').forEach((checkbox) => {
          checkbox.checked = true;
        });
      }}}, [
        l('check_all')
      ]],
      ['button', {$on: {click () {
        $$('#workSelect input[type=checkbox]').forEach((checkbox) => {
          checkbox.checked = false;
        });
      }}}, [
        l('uncheck_all')
      ]]
    ]]
  ];
};

export const getCheckedWorks = () => {
  return $$('#workSelect input[type=checkbox]:checked').map(({value}) => {
    return value;
  });
};
