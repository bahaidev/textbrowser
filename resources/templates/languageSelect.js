/* globals jml, Templates */
Templates.languageSelect = {
    main ({langs, getLanguageFromCode, followParams, $p}) {
        jml('div', {'class': 'focus', id: 'languageSelectionContainer'}, [
            ['select', {
                size: langs.length,
                $on: {
                    change: ({target: {selectedOptions}}) => {
                        $p.set('lang', selectedOptions[0].value, true);
                        followParams();
                    }
                }
            }, langs.map(({code}) =>
                ['option', {value: code}, [getLanguageFromCode(code)]]
            )]
        ], document.body);
    }

    // Todo: Add in Go button (with 'submitgo' localization string) to
    //   avoid need for pull-down if using first selection?
    /* Works too:
    langs.map(({code, name}) =>
        ['div', [
            ['a', {href: '#', dataset: {code}}, [name]]
        ]]
    ), document.body
    */
};
