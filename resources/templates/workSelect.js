import jml from 'jamilih';

export default ({groups, lf, getNextAlias, $p, followParams}) =>
    jml(
        'div',
        {'class': 'focus'},
        groups.map((group, i) =>
            ['div', [
                i > 0 ? ['br', 'br', 'br'] : '',
                ['div', [
                    lf({key: group.directions.localeKey, fallback: true})
                ]],
                ['br'],
                ['select', {
                    'class': 'file',
                    dataset: {
                        name: group.name.localeKey
                    },
                    $on: {
                        change: ({target: {value}}) => {
                            /*
                            // If using click, but click doesn't always fire
                            if (e.target.nodeName.toLowerCase() === 'select') {
                                return;
                            }
                            */
                            $p.set('work', value);
                            followParams();
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
        document.body
    );
