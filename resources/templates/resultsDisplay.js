/* globals Templates, jml */
Templates.resultsDisplay = {
    styles: ({
        $pRaw, escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter, checkedFieldIndexes
    }) => {
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
            }[$pRaw('header')] + `{
    font-style: ${$pRaw('fontstyle')};
    font-variant: ${$pRaw('fontvariant')};
    font-weight: ${$pRaw('fontweight')};
    ${$pRaw('fontsize') ? `font-size: ${$pRaw('fontsize')};` : ''}
    font-family: ${escapeQuotedCSS($pRaw('fontSeq'))};

    font-stretch: ${$pRaw('fontstretch')};
    letter-spacing: ${$pRaw('letterspacing')};
    line-height: ${$pRaw('lineheight')};
    ${color ? `color: ${color};` : ''}
}
${escapeCSS($pRaw('pagecss') || '')}
` +
            (tableWithFixedHeaderAndFooter
                ? `
html, body, body > div {
    height: 100%; /* Needed to ensure descendent heights retain 100%; could be avoided if didn't want percent on table height */
}
.anchor-table-header {
    overflow-x: hidden; /* Not sure why we're getting extra here, but... */
    position: relative; /* Ensures we are still flowing, but provides anchor for absolutely positioned thead below (absolute positioning positions relative to nearest non-static ancestor; clear demo at https://www.w3schools.com/cssref/playit.asp?filename=playcss_position&preval=fixed ) */
    padding-top: 2em; /* Provides space for the header (the one that is absolutely positioned below relative to here) */
    padding-bottom: 2em; /* Provides space for the footer (the one that is absolutely positioned below relative to here) */
    background-color: white; /* Header background (not just for div text inside header, but for whole header area) */
    height: 90%; /* Percent of the whole screen taken by the table */
}
.anchor-table-body {
    overflow-y: auto; /* Provides scrollbars when text fills up beyond the height */
    height: 100%; /* If < 100%, the header anchor background color will seep below table */
}

.thead .th, .tfoot .th {
    line-height: 0; /* th div will have own line-height; reducing here avoids fattening it by an inner div */
    color: transparent; /* Hides the non-div duplicated header text */
    white-space: nowrap; /* Ensures column header text uses up full width without overlap (esp. wrap no longer seems to work); this must be applied outside of the div */
    border: none; /* We don't want a border for this invisible section */
}
.thead .th div.th-inner, .tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    position: absolute; /* Puts relative to nearest non-static ancestor (our relative header anchor) */
    color: initial; /* Header must have an explicit color or it will get transparent container color */
    line-height: normal; /* Revert ancestor line height of 0 */
}
.thead .th div.th-inner {
    top: 0; /* Ensures our header stays fixed at top outside of normal flow of table */
}
.tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    top: calc(100% - 2em); /* Ensures our header stays fixed at top outside of normal flow of table */
}
${checkedFieldIndexes.map((idx, i) => `
.td:nth-child(${i + 1}) {
    ${$pRaw('css' + (i + 1))}
}
`).join('')}

/* http://salzerdesign.com/test/fixedTable.html */
.interlintitle {
    ${escapeCSS($pRaw('interlintitle_css'))}
}
.zupa div.zupa1 {
    margin: 0 auto !important;
    width: 0 !important;
}
.zupa div.th-inner {
    width: 100%;
    margin-left: -50%;
    text-align: center;
}
`
                : '') +
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
        heading, l, browseFieldSets, localizedFieldNames,
        interlinearSeparator = '<br /><br />'
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
                        (j > 0 ? l('comma-space') : '') + bf + ' ' +
                            $pRaw(startOrEnd + (i + 1) + '-' + (j + 1))
                    ).join('') + (txt ? ')' : ''), '')
            );
            */
            /*
            // Works but overly long
            const buildRangePoint = (startOrEnd) => escapeHTML(
                applicableBrowseFieldSet.map((bf, j) =>
                    (j > 0 ? l('comma-space') : '') + bf + ' ' +
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

                const rangeNames = applicableBrowseFieldSet.map((abfs) =>
                    abfs.browseFieldName).join(l('comma-space'));
                return escapeHTML(
                    startStr +
                    // l('to').toLowerCase() + ' ' +
                    '-' +
                    endVals.join(':') + ' (' + rangeNames + ')'
                );
            };
            caption = heading + ' ' + buildRanges();
        }

        const tableElems = ({
            table: [
                ['table', {'class': 'table', border: $pRaw('border') || '0'}],
                ['tr', {'class': 'tr'}],
                ['td', {'class': 'td'}],
                ['th', {'class': 'th'}],
                ['caption', {'class': 'caption'}],
                ['thead', {'class': 'thead'}],
                ['tbody', {'class': 'tbody'}],
                ['tfoot', {'class': 'tfoot'}]
                // ['colgroup', {'class': 'colgroup'}],
                // ['col', {'class': 'col'}]
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
                // ['div', {'class': 'colgroup', style: 'display: table-column-group;'}],
                // ['div', {'class': 'col', style: 'display: table-column;'}]
            ],
            'json-array': 'json',
            'json-object': 'json'
        }[$pRaw('outputmode')]);
        if (tableElems === 'json') {
            alert('JSON support is currently not available');
            return;
        }
        const [
            tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem
        ] = tableElems; // colgroupElem, colElem

        let num = 1;
        let field, checked;
        let checkedFields = [];
        do {
            field = $pRaw('field' + num);
            checked = $p.get('checked' + num, true);
            num++;
            if (field && checked === l('yes')) {
                checkedFields.push(field);
            }
        } while (field);
        checkedFields = checkedFields.filter((cf) => localizedFieldNames.includes(cf));
        const checkedFieldIndexes = checkedFields.map((cf) => localizedFieldNames.indexOf(cf));
        const allInterlinearColIndexes = checkedFieldIndexes.map((cfi, i) => {
            const interlin = $pRaw('interlin' + (i + 1));
            return interlin && interlin.split(/\s*,\s*/).map((col) =>
                parseInt(col, 10) - 1
            );
        });

        const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';
        const tableWrap = (children) =>
            tableWithFixedHeaderAndFooter
                ? ['div', {'class': 'anchor-table-header zupa'}, [
                    ['div', {'class': 'anchor-table-body'}, children]
                ]]
                : ['div', children];

        const addChildren = (el, children) => {
            el = JSON.parse(JSON.stringify(el));
            el.push(children);
            return el;
        };
        const addAtts = (el, newAtts) => [el[0], Object.assign({}, el[1], newAtts)];

        jml('div', [
            Templates.resultsDisplay.styles({
                $pRaw, escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter, checkedFieldIndexes
            }),
            tableWrap([
                addChildren(tableElem, [
                    (caption ? addChildren(captionElem, [caption]) : ''),
                    /*
                    // Works but quirky, e.g., `color` doesn't work (as also confirmed per https://quirksmode.org/css/css2/columns.html)
                    addChildren(colgroupElem,
                        checkedFieldIndexes.map((idx, i) =>
                            addAtts(colElem, {style: $pRaw('css' + (i + 1))})
                        )
                    ),
                    */
                    ($pRaw('header') !== '0' ? addChildren(theadElem, [
                        addChildren(trElem,
                            checkedFields.map((cf, i) => {
                                const interlinearColIndexes = allInterlinearColIndexes[i];
                                cf = cf + (interlinearColIndexes
                                    ? l('comma-space') + interlinearColIndexes.map((idx) =>
                                        localizedFieldNames[idx]
                                    ).join(l('comma-space'))
                                    : ''
                                );
                                return addChildren(thElem, [
                                    cf,
                                    (tableWithFixedHeaderAndFooter ? ['div', {class: 'zupa1'}, [
                                        ['div', {class: 'th-inner'}, [
                                            ['span', [cf]]
                                        ]]
                                    ]] : '')
                                ]);
                            })
                        )
                    ]) : ''),
                    ($pRaw('footer') !== '0' ? addChildren(tfootElem, [
                        addChildren(trElem,
                            checkedFields.map((cf, i) => {
                                const interlinearColIndexes = allInterlinearColIndexes[i];
                                cf = cf + (interlinearColIndexes
                                    ? l('comma-space') + interlinearColIndexes.map((idx) =>
                                        localizedFieldNames[idx]
                                    ).join(l('comma-space'))
                                    : ''
                                );
                                return addChildren(thElem, [
                                    cf,
                                    (tableWithFixedHeaderAndFooter ? ['div', {class: 'zupa1'}, [
                                        ['div', {class: 'th-inner'}, [
                                            ['span', [cf]]
                                        ]]
                                    ]] : '')
                                ]);
                            })
                        )
                    ]) : ''),
                    addChildren(tbodyElem, [
                        /**/
                        ...tableData.map((tr, i) =>
                            addChildren(trElem,
                                checkedFieldIndexes.map((idx, j) => {
                                    const interlinearColIndexes = allInterlinearColIndexes[j];
                                    const showInterlinTitles = $pRaw('interlintitle') === '1' &&
                                        interlinearColIndexes;
                                    return addAtts(tdElem, {
                                        id: 'row' + (i + 1) + 'cell' + (j + 1),
                                        innerHTML:
                                            (showInterlinTitles
                                                ? '<span class="interlintitle">' +
                                                    localizedFieldNames[idx] +
                                                    '</span>' + l('colon-space')
                                                : ''
                                            ) +
                                            tr[idx] + (interlinearColIndexes
                                                ? interlinearSeparator +
                                                    interlinearColIndexes.map((idx) =>
                                                        (showInterlinTitles
                                                            ? '<span class="interlintitle">' +
                                                                localizedFieldNames[idx] +
                                                                '</span>' + l('colon-space')
                                                            : '') +
                                                        tr[idx]
                                                    ).join(interlinearSeparator)
                                                : ''
                                        )
                                    });
                                })
                        // */
                        /*
                                /*
                                // Todo: anchor1, etc. (and add to it to indicate
                                //     field no. too for horizontal anchoring)
                                // Todo: needs scroll into view for repeated anchor

                                // Todo: Add ranges within applicable browse field set
                                    (also need to cache JSON into IndexedDB or at
                                        least localStorage for now)
                                    start1-1, etc.
                                    end1-1, etc.
                                    rand
                                    context (highlight?)

                                // Todo: localizeParamNames (preference)?
                                // Todo: Later: Speech controls
                                // Todo: Later: search1, etc.
                                // Todo: Later: auto-fields
                                // Todo: Later: Handle transpose, in header, footer, and body
                                // Todo: Later: Support JSON types for `outputmode`, opening
                                //     new window with content-type set
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
                    /**/
                            )
                        )
                    // */
                    ])
                ])
            ])
        ], document.body);
    }
};
