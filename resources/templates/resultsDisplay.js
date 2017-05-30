/* globals Templates, jml */
Templates.resultsDisplay = {
    styles: ({$pRaw, escapeQuotedCSS, escapeCSS}) => {
        const color = !$pRaw('color') || $pRaw('color') === '#'
            ? $pRaw('colorName')
            : $pRaw('color');
        const bgcolor = !$pRaw('bgcolor') || $pRaw('bgcolor') === '#'
            ? $pRaw('bgcolorName')
            : $pRaw('bgcolor');
        return ['style', [
            {
                'y': 'td, th',
                'n': 'td',
                '0': 'td',
                'undefined': 'td'
            }[$pRaw('headings')] + `{
    font-style: ${$pRaw('fontstyle')};
    font-variant: ${$pRaw('fontvariant')};
    font-weight: ${$pRaw('fontweight')};
    ${$pRaw('fontsize') ? `font-size: ${$pRaw('fontsize')};` : ''}
    font-family: "${escapeQuotedCSS($pRaw('fontSeq'))}";
    font-stretch: ${$pRaw('fontstretch')};
    letter-spacing: ${$pRaw('letterspacing')};
    line-height: ${$pRaw('lineheight')};
    ${color ? `color: ${color};` : ''}
    ${escapeCSS($pRaw('pagecss') || '')}
}` +
            (bgcolor
                ? `
body {
    background-color: ${bgcolor};
}
`
                : '')
        ]];
    },
    main: ({
        tableData, schemaItems, $p, $pRaw, escapeQuotedCSS, escapeCSS, escapeHTML,
        heading, l, browseFieldSets
    }) => {
        let caption;
        const browseFieldSetIdx = browseFieldSets.findIndex((item, i) =>
            typeof $pRaw('start' + (i + 1) + '-1') === 'string'
        );
        const applicableBrowseFieldSet = browseFieldSets[browseFieldSetIdx];
        /*
        outputmode
                        'table',
                        'div',
                        'json-array',
                        'json-object'

        border

        headings
        headerfixed
        tfoot
        */
        if ($pRaw('wishcaption') !== 'no') {
            /*
            // Works but displays in parentheses browse fields which
            //  may be non-applicable
            const buildRangePoint = (startOrEnd) => escapeHTML(
                browseFieldSets.reduce((txt, bfs, i) =>
                    (txt ? txt + ' (' : '') + bfs.map((bf, j) =>
                        (j > 0 ? ', ' : '') + bf + ' ' +
                            $pRaw(startOrEnd + (i + 1) + '-' + (j + 1))
                    ).join('') + (txt ? ')' : ''), '')
            );
            */
            /*
            // Works but overly long
            const buildRangePoint = (startOrEnd) => escapeHTML(
                applicableBrowseFieldSet.map((bf, j) =>
                    (j > 0 ? ', ' : '') + bf + ' ' +
                        $pRaw(startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1))
                ).join('')
            );
            */
            const buildRanges = () => {
                const buildRangePoint = (startOrEnd) =>
                    applicableBrowseFieldSet.map((bf, j) =>
                        $pRaw(
                            startOrEnd + (browseFieldSetIdx + 1) + '-' + (j + 1)
                        )
                    );
                const start = buildRangePoint('start');
                const end = buildRangePoint('end');
                const endVals = [];
                const startStr = start.reduce((str, fieldValue, i) => {
                    const ret = str + fieldValue;
                    if (fieldValue === end[i]) {
                        return ret +
                            (i > 0 ? ',' : '') + // e.g., for "Genesis 7, 5-8"
                            ' '; // e.g., for 2nd space in "Surah 2 5-8"
                    }
                    endVals.push(end[i]);
                    return ret + ':';
                }, '').slice(0, -1);

                const rangeNames = applicableBrowseFieldSet.join(', ');
                return escapeHTML(
                    startStr +
                    // l('to').toLowerCase() + ' ' +
                    '-' +
                    endVals.join(':') + ' (' + rangeNames + ')'
                );
            };
            caption = heading + ' ' + buildRanges();
        }
        jml('div', [
            Templates.resultsDisplay.styles({$pRaw, escapeQuotedCSS, escapeCSS}),
            ['table', {border: '1'}, [
                (caption ? ['div', [caption]] : '')
                // ...tableData.map((tr) => ['tr',
                /*
                // Todo: Add ranges within applicable browse field set
                    start1-1, etc.
                    end1-1, etc.
                // Todo: Handle the following
                    (field1, etc.) - and auto-fields
                    localizeParamNames (preference)
                    rand
                    context
                    transpose
                    checked1, etc.
                    anchor1, etc.
                    interlin1, etc.
                    css1, etc.
                    search1, etc.
                */
            /*
                schemaItems.map(({title}, i) => {
                    const fieldI = $pRaw('field' + (i + 1));
                    if (fieldI) {
                        const idx = schemaItems.findIndex(({title}) => title === fieldI);
                        console.log('iiii', title, i, idx, fieldI);
                        return idx === -1
                            ? ['td', ['(empty)' + title]]
                            : ['td', {
                                innerHTML: tr[idx] // Todo: Only do for non-escaped!!!!
                            }];
                    }
                    return 'ttt:' + title;
                })
            */
            /*
                    tr.map((td) => ['td',
                        // [td] // Todo: For non-escaped!!!!
                        {innerHTML: td}
                    ])
                ])*/
            ]]
        ], document.body);
    }
};
