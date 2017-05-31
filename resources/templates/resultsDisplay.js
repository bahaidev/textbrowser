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

        // Todo: Support colgroup/col?
        const tableElems = ({
            table: [
                // Todo: Make border dynamic based on user selection (here and below)
                ['table', {'class': 'table', border: '1'}],
                ['tr', {'class': 'tr'}],
                ['td', {'class': 'td'}],
                ['th', {'class': 'th'}],
                ['caption', {'class': 'caption'}],
                ['thead', {'class': 'thead'}],
                ['tbody', {'class': 'tbody'}],
                ['tfoot', {'class': 'tfoot'}]
            ],
            div: [
                ['div', {'class': 'table', style: 'display: table;'}],
                ['div', {'class': 'tr', style: 'display: table-row;'}],
                ['div', {'class': 'td', style: 'display: table-cell;'}],
                ['div', {'class': 'th', style: 'display: table-cell;'}],
                ['div', {'class': 'caption', style: 'display: table-caption;'}],
                ['div', {'class': 'thead', style: 'display: table-header-group;'}],
                ['div', {'class': 'tbody', style: 'display: table-row-group;'}],
                ['div', {'class': 'tfoot', style: 'display: table-footer-group;'}]
            ],
            'json-array': 'json',
            'json-object': 'json'
        }[$pRaw('outputmode')]);
        if (tableElems === 'json') {
            alert('JSON support is currently not available');
            return;
        }
        const [tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem] = tableElems;
        console.log(tdElem, trElem, thElem, theadElem, tfootElem);

        const addChildren = (el, children) => {
            el = JSON.parse(JSON.stringify(el));
            el.push(children);
            return el;
        };
        console.log('schemaItems', schemaItems);
        jml('div', [
            Templates.resultsDisplay.styles({$pRaw, escapeQuotedCSS, escapeCSS}),
            addChildren(tableElem, [
                (caption ? addChildren(captionElem, [caption]) : ''),
                ($pRaw('headings') !== '0' ? addChildren(theadElem, [
                    // Header/footers: trElem, thElem

                    // Todo: thead content
                    /*
                    // interlin1, etc. should (optionally) get additional column names added too
                    (field1, etc.) - and auto-fields
                    checked1, etc.
                    transpose
                    */
                ]) : ''),
                ($pRaw('tfoot') === 'yes' ? addChildren(tfootElem, [
                    // Header/footers: trElem, thElem
                    // Todo: tfoot content
                ]) : ''),
                addChildren(tbodyElem, [
                    // 1.  Support JSON types for `outputmode`, opening new window
                    //     with content-type set
                    /*
                    // Styling todos:
                        $pRaw('headerfixed') === 'yes'
                        $pRaw('border') === '1'
                        $pRaw('headings') === 'y' or 'n' on whether to apply styles
                    */
                    /**
                    ...tableData.map((tr) =>
                        addChildren(trElem,
                            tr.map((td) =>
                                [tdElem[0], Object.assign({}, tdElem[1], {innerHTML: td})]
                                // addChildren(tdElem, [td]]) // Todo: For non-escaped!!!!
                            )
                    // */
                    /*
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
                                        ? [tdElem, ['(empty)' + title]]
                                        : [tdElem, {
                                            innerHTML: tr[idx] // Todo: Only do for non-escaped!!!!
                                        }];
                                }
                                return 'ttt:' + title;
                            })
                            */
                /**
                        )
                    )
                // */
                ])
            ])
        ], document.body);
    }
};
