/* eslint-env browser */
import {jml, $} from 'jamilih';
import {deserialize as formDeserialize} from 'form-serialize';

export default ({groups, lf, getNextAlias, $p, followParams}) => {
    const form = jml(
        'form',
        {id: 'workSelect', class: 'focus', $on: {
            submit (e) {
                e.preventDefault();
            }
        }},
        groups.map((group, i) =>
            ['div', [
                i > 0 ? ['br', 'br', 'br'] : '',
                ['div', [
                    lf({key: group.directions.localeKey, fallback: true})
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
                            value: lf(['workNames', group.id, fileName])
                        }, [getNextAlias()]]
                    )
                ]]
                // Todo: Add in Go button (with 'submitgo' localization string) to
                //    avoid need for pull-down if using first selection?
            ]]
        ),
        $('#main')
    );
    if (history.state && typeof history.state === 'object') {
        formDeserialize(document.querySelector('#workSelect'), history.state);
    }
    return form;
};
