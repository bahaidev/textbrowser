/* globals Templates, jml */
(() => {
const $ = (sel) => document.querySelector(sel);

Templates.resultsDisplay = {
    caption ({heading, ranges}) {
        return heading + ' ' + ranges;
    },
    startSeparator ({l}) {
        return l('colon');
    },
    innerBrowseFieldSeparator ({l}) {
        return l('comma-space');
    },
    ranges ({l, startRange, endVals, rangeNames}) {
        return startRange +
            // l('to').toLowerCase() + ' ' +
            '-' +
            endVals.join(
                Templates.resultsDisplay.startSeparator({l})
            ) + ' (' + rangeNames + ')';
    },
    fieldValueAlias ({key, value}) {
        return value + ' (' + key + ')';
    },
    anchorRowCol ({anchorRowCol}) {
        return $('#' + anchorRowCol);
    },
    anchors ({escapedRow, escapedCol}) {
        const sel = 'td[data-row="' + escapedRow + '"]' +
            (escapedCol
                ? ('[data-col="' + escapedCol + '"]')
                : '');
        return $(sel);
    },
    interlinearSegment ({lang, html}) {
        return `<span lang="${lang}">${html}</span>`;
    },
    interlinearTitle ({l, val}) {
        const colonSpace = l('colon-space');
        return '<span class="interlintitle">' +
            val +
            '</span>' + colonSpace;
    },
    styles ({
        $p, $pRaw, $pRawEsc, $pEscArbitrary, escapeQuotedCSS, escapeCSS,
        tableWithFixedHeaderAndFooter, checkedFieldIndexes, hasCaption
    }) {
        const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#'
            ? $pEscArbitrary('colorName')
            : $pEscArbitrary('color');
        const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#'
            ? $pEscArbitrary('bgcolorName')
            : $pEscArbitrary('bgcolor');

        const tableHeight = '100%';

        const topToCaptionStart = 1;
        const captionSizeDelta = (hasCaption ? 2 : 0) + 0;
        const topToHeadingsStart = topToCaptionStart + captionSizeDelta;
        const headingsDelta = 1;

        const topToBodyStart = (topToHeadingsStart + headingsDelta) + 'em';
        const footerHeight = '2em';
        const bodyToFooterPadding = '0.5em';
        const topToBodyEnd = `100% - ${topToBodyStart} - ${footerHeight} - ${bodyToFooterPadding}`;
        const topToBodyEndCalc = `calc(${topToBodyEnd})`;
        const topToFooter = `calc(${topToBodyEnd} + ${bodyToFooterPadding})`;
        return ['style', [
            ($pRaw('caption') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? '.caption div.inner-caption, '
                    : '.caption, ')
                : ''
            ) +
            ($pRaw('header') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? `` // `.thead .th, .thead .th div.th-inner, ` // Problems at least in Chrome
                    : `.thead .th, `)
                : '') +
            ($pRaw('footer') === 'y'
                ? (tableWithFixedHeaderAndFooter
                    ? `` // `.tfoot .th, .tfoot .th div.th-inner, ` // Problems at least in Chrome
                    : `.tfoot .th, `)
                : '') +
            ('.tbody .td') + ` {
    vertical-align: top;
    font-style: ${$pRawEsc('fontstyle')};
    font-variant: ${$pRawEsc('fontvariant')};
    font-weight: ${$pEscArbitrary('fontweight')};
    ${$pEscArbitrary('fontsize') ? `font-size: ${$pEscArbitrary('fontsize')};` : ''}
    font-family: ${$pEscArbitrary('fontSeq')};

    font-stretch: ${$pEscArbitrary('fontstretch')};
    letter-spacing: ${$pEscArbitrary('letterspacing')};
    line-height: ${$pEscArbitrary('lineheight')};
    ${colorEsc ? `color: ${escapeCSS(colorEsc)} !important;` : ''
        // Marked `!important` as will be overridden by default fixed table colors
    }
    ${bgcolorEsc ? `background-color: ${escapeCSS(bgcolorEsc)} !important;` : ''
        // Marked `!important` as will be overridden by default fixed table colors
    }
}
${escapeCSS($pEscArbitrary('pagecss') || '')}
` +
            (tableWithFixedHeaderAndFooter
                ? `
html, body, body > div {
    height: 100%; /* Needed to ensure descendent heights retain 100%; could be avoided if didn't want percent on table height */
    overflow-y: hidden; /* Not sure why we're getting extra here, but... */
}
.anchor-table-header {
    background-color: ${bgcolorEsc || 'white'}; /* Header background (not just for div text inside header, but for whole header area) */
    overflow-x: hidden; /* Not sure why we're getting extra here, but... */
    position: relative; /* Ensures we are still flowing, but provides anchor for absolutely positioned thead below (absolute positioning positions relative to nearest non-static ancestor; clear demo at https://www.w3schools.com/cssref/playit.asp?filename=playcss_position&preval=fixed ) */
    padding-top: ${topToBodyStart}; /* Provides space for the header (and caption) (the one that is absolutely positioned below relative to here) */
    height: ${tableHeight}; /* Percent of the whole screen taken by the table */
}
.anchor-table-body {
    overflow-y: auto; /* Provides scrollbars when text fills up beyond the height */
    height: ${topToBodyEndCalc}; /* If < 100%, the header anchor background color will seep below table */
}

.caption, .thead .th, .tfoot .th {
    line-height: 0; /* th div will have own line-height; reducing here avoids fattening it by an inner div */
    color: transparent; /* Hides the non-div duplicated header text */
    white-space: nowrap; /* Ensures column header text uses up full width without overlap (esp. wrap no longer seems to work); this must be applied outside of the div */
    border: none; /* We don't want a border for this invisible section */
}
div.inner-caption, .thead .th div.th-inner, .tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    position: absolute; /* Puts relative to nearest non-static ancestor (our relative header anchor) */
    color: initial; /* Header must have an explicit color or it will get transparent container color */
    line-height: normal; /* Revert ancestor line height of 0 */
}
.thead .th div.th-inner {
    top: ${topToHeadingsStart}em; /* Ensures our header stays fixed at top outside of normal flow of table */
}
div.inner-caption {
    top: ${topToCaptionStart}em;
}
.tfoot .th div.th-inner { /* divs are used as th is supposedly problematic */
    top: ${topToFooter}; /* Ensures our header stays fixed at top outside of normal flow of table */
}
.zupa div.zupa1 {
    margin: 0 auto !important;
    width: 0 !important;
}
.zupa div.th-inner, .zupa div.inner-caption {
    width: 100%;
    margin-left: -50%;
    text-align: center;
}
`
                : '') +
            checkedFieldIndexes.map((idx, i) =>
                ($pRaw('header') === 'y'
                    ? (tableWithFixedHeaderAndFooter
                        ? `.thead .th:nth-child(${i + 1}) div.th-inner, `
                        : `.thead .th:nth-child(${i + 1}), `)
                    : '') +
                ($pRaw('footer') === 'y'
                    ? (tableWithFixedHeaderAndFooter
                        ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, `
                        : `.tfoot .th:nth-child(${i + 1}), `)
                    : '') +
                `.tbody .td:nth-child(${i + 1}) ` +
`{
    ${$pEscArbitrary('css' + (i + 1))}
}
`).join('') +

($pEscArbitrary('interlintitle_css') ? `
/* http://salzerdesign.com/test/fixedTable.html */
.interlintitle {
    ${escapeCSS($pEscArbitrary('interlintitle_css'))}
}
` : '') +
            (bgcolorEsc
                ? `
body {
    background-color: ${bgcolorEsc};
}
`
                : '')
        ]];
    },
    main ({
        tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary,
        escapeQuotedCSS, escapeCSS, escapeHTML,
        l, localizedFieldNames, fieldLangs,
        caption, hasCaption, showInterlinTitles,
        determineEnd, getCellValue, getCheckedAndInterlinearFieldInfo,
        interlinearSeparator = '<br /><br />'
    }) {
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

        const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] =
            getCheckedAndInterlinearFieldInfo();

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

        const foundState = {
            start: false,
            end: false
        };
        const outArr = [];

        const showEmptyInterlinear = this.showEmptyInterlinear;
        const showTitleOnSingleInterlinear = this.showTitleOnSingleInterlinear;

        const checkEmpty = (tdVal, htmlEscaped) => {
            if (!showEmptyInterlinear) {
                if (!htmlEscaped) {
                    tdVal = new DOMParser().parseFromString(tdVal, 'text/html').body;
                    [...tdVal.querySelectorAll('br')].forEach((br) => {
                        br.parentNode.removeChild(br);
                    });
                    tdVal = tdVal.innerHTML;
                }
                if (!tdVal.trim()) {
                    return true;
                }
            }
        };

        tableData.some((tr, i) => {
            const rowID = determineEnd({tr, foundState});
            if (typeof rowID === 'boolean') {
                return rowID;
            }

            outArr.push(addChildren(trElem,
                checkedFieldIndexes.map((idx, j) => {
                    const interlinearColIndexes = allInterlinearColIndexes[j];
                    const showInterlins = showInterlinTitles &&
                        interlinearColIndexes;
                    const {tdVal, htmlEscaped} = getCellValue({tr, idx});
                    const interlins = showInterlins && interlinearColIndexes.map((idx) => {
                        const {tdVal, htmlEscaped} = getCellValue({tr, idx}); // Need to get a new one
                        let cellIsEmpty;
                        console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
                        const isEmpty = checkEmpty(tdVal, htmlEscaped);
                        if (isEmpty) {
                            return '';
                        }

                        return (showInterlins && !cellIsEmpty
                            ? Templates.resultsDisplay.interlinearSegment({
                                lang: fieldLangs[idx],
                                html: Templates.resultsDisplay.interlinearTitle({
                                    l, val: localizedFieldNames[idx]
                                }) + tdVal
                            })
                            : tdVal);
                    }).filter((cell) => cell !== '');
                    return addAtts(tdElem, {
                        id: 'row' + (i + 1) + 'col' + (j + 1), // Can't have unique IDs if user duplicates a column
                        lang: fieldLangs[idx],
                        dataset: {
                            col: localizedFieldNames[idx],
                            row: rowID
                        },
                        innerHTML:
                            (showInterlins && !checkEmpty(tdVal, htmlEscaped) &&
                                (showTitleOnSingleInterlinear || interlins.length)
                                ? Templates.resultsDisplay.interlinearSegment({
                                    lang: fieldLangs[idx],
                                    html: Templates.resultsDisplay.interlinearTitle({
                                        l, val: localizedFieldNames[idx]
                                    }) + tdVal
                                })
                                : tdVal
                            ) +
                            (interlinearColIndexes && interlins.length
                                ? interlinearSeparator +
                                    interlins.join(interlinearSeparator)
                                : ''
                        )
                    });
                })
            ));
        });

        jml('div', [
            Templates.resultsDisplay.styles({
                $p, $pRaw, $pRawEsc, $pEscArbitrary,
                escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter,
                checkedFieldIndexes, hasCaption
            }),
            tableWrap([
                addChildren(tableElem, [
                    (caption ? addChildren(captionElem, [
                        caption,
                        tableWithFixedHeaderAndFooter
                            ? ['div', {class: 'zupa1'}, [
                                ['div', {class: 'inner-caption'}, [
                                    ['span', [caption]]
                                ]]
                            ]]
                            : ''
                    ]) : ''),
                    /*
                    // Works but quirky, e.g., `color` doesn't work (as also
                    //  confirmed per https://quirksmode.org/css/css2/columns.html)
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
                                cf = escapeHTML(cf) + (interlinearColIndexes
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
                                cf = escapeHTML(cf) + (interlinearColIndexes
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
                    addChildren(tbodyElem, outArr)
                ])
            ])
        ], document.body);
    }
};
})();
