/* globals jml, Templates */
Templates.workSelect = ({dbs, lf, getNextAlias, $p, followParams}) =>
    jml(
        'div',
        {'class': 'focus'},
        dbs.groups.map(({
            fileGroupFiles, fileGroupDirections: {
                localeKey: fileGroupDirections
            }, fileGroupName, fileGroupID
        }, i) =>
            ['div', [
                i > 0 ? ['br', 'br', 'br'] : '',
                ['div', [
                    lf({key: fileGroupDirections.localeKey, fallback: true})
                ]],
                ['br'],
                ['select', {
                    'class': 'file',
                    dataset: {
                        name: fileGroupName.localeKey
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
                    ...fileGroupFiles.map(({name: fileName}) =>
                        ['option', {
                            value: lf(['workNames', fileGroupID, fileName])
                        }, [getNextAlias()]]
                    )
                ]]
                // Todo: Add in Go button (with 'submitgo' localization string) to
                //    avoid need for pull-down if using first selection?
            ]]
        ),
        document.body
    );
