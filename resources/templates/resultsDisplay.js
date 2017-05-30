/* globals Templates, jml */
Templates.resultsDisplay = {
    main: ({tableData, schemaItems, $pRaw, escapeQuotedCSS}) => {
        schemaItems.forEach((itemInfo) => {
            console.log('itemInfo', itemInfo);
        });

        const color = !$pRaw('color') || $pRaw('color') === '#'
            ? $pRaw('colorName')
            : $pRaw('color');
        const bgcolor = !$pRaw('bgcolor') || $pRaw('bgcolor') === '#'
            ? $pRaw('bgcolorName')
            : $pRaw('bgcolor');

        jml('div', [
            ['style', [
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
    color: ${color};
}` +
                (bgcolor
                    ? `
body {
    background-color: ${bgcolor};
}
`
                    : '')
            ]],
            ['table', {border: '1'}, tableData.map((tr) => ['tr',
                tr.map((td) => ['td',
                    // [td] // Todo: For non-escaped!!!!
                    {innerHTML: td}
                ])
            ])]
        ], document.body);
    }
};
