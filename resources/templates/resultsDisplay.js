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
    main: ({tableData, schemaItems, $p, $pRaw, escapeQuotedCSS, escapeCSS, heading, l}) => {
        let caption;
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
            caption = heading + ': ' +
                // Todo: Finish...
                // htmlEscape($lclzd_fields_name1.$fieldnamegroup2.$fieldnamegroup3) + ' ' +
                // htmlEscape($blevela1.$blevelbgroup.$blevelcgroup) + ' ' +
                l('to').toLowerCase() + ' '; // + htmlEscape($elevela1.$elevelbgroup.$elevelcgroup);
        }
        jml('div', [
            Templates.resultsDisplay.styles({$pRaw, escapeQuotedCSS, escapeCSS}),
            ['table', {border: '1'}, [
                (caption ? ['caption', [caption]] : ''),
                ...tableData.map((tr) => ['tr',
                /*
                handle ranges
                (field1, etc.) - and auto-fields
                localizeParamNames (preference)
                rand
                context
                transpose
                start1-1, etc.
                end1-1, etc.
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
                    tr.map((td) => ['td',
                        // [td] // Todo: For non-escaped!!!!
                        {innerHTML: td}
                    ])
                ])
            ]]
        ], document.body);
    }
};
