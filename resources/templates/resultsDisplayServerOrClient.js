import Templates from './index.js';

export default {
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
              Templates.resultsDisplayServerOrClient.startSeparator({l})
            ) + ' (' + rangeNames + ')';
  },
  fieldValueAlias ({key, value}) {
    return value + ' (' + key + ')';
  },
  interlinearSegment ({lang, dir, html}) {
    return `<span${
      lang ? ` lang="${lang}"` : ''
    }${
      dir ? ` dir="${dir}"` : ''
    }>${html}</span>`;
  },
  interlinearTitle ({l, val}) {
    const colonSpace = l('colon-space');
    return `<span class="interlintitle">${val}</span>${colonSpace}`;
  },
  styles ({
    $p, $pRaw, $pRawEsc, $pEscArbitrary, // escapeQuotedCSS,
    escapeCSS,
    tableWithFixedHeaderAndFooter, checkedFieldIndexes, hasCaption
  }) {
    const colorEsc = !$p.has('color', true) || $p.get('color', true) === '#'
      ? $pRawEsc('colorName')
      : $pEscArbitrary('color');
    const bgcolorEsc = !$p.has('bgcolor', true) || $p.get('bgcolor', true) === '#'
      ? $pRawEsc('bgcolorName')
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
      (tableWithFixedHeaderAndFooter
        ? `
html, body, #main, #main > div {
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
            ('.tbody td') + ` {
    vertical-align: top;
    font-style: ${$pRawEsc('fontstyle')};
    font-variant: ${$pRawEsc('fontvariant')};
    font-weight: ${$pEscArbitrary('fontweight')};
    ${$pEscArbitrary('fontsize') ? `font-size: ${$pEscArbitrary('fontsize')};` : ''}
    font-family: ${$pEscArbitrary('fontSeq')};

    font-stretch: ${$pRawEsc('fontstretch')};
    letter-spacing: ${$pEscArbitrary('letterspacing')};
    line-height: ${$pEscArbitrary('lineheight')};
    ${colorEsc ? `color: ${escapeCSS(colorEsc)};` : ''
    }
    ${bgcolorEsc ? `background-color: ${escapeCSS(bgcolorEsc)};` : ''
    }
}
${escapeCSS($pEscArbitrary('pagecss') || '')}
` +
            checkedFieldIndexes.map((idx, i) => {
              return ($pRaw('header') === 'y'
                ? (tableWithFixedHeaderAndFooter
                  ? `.thead .th:nth-child(${i + 1}) div.th-inner, `
                  : `.thead .th:nth-child(${i + 1}), `)
                : '') +
                ($pRaw('footer') === 'y'
                  ? (tableWithFixedHeaderAndFooter
                    ? `.tfoot .th:nth-child(${i + 1}) div.th-inner, `
                    : `.tfoot .th:nth-child(${i + 1}), `)
                  : '') +
                `.tbody td:nth-child(${i + 1}) ` +
`{
    ${$pEscArbitrary('css' + (idx + 1))}
}
`;
            }).join('') +

($pEscArbitrary('interlintitle_css')
  ? `
  /* http://salzerdesign.com/test/fixedTable.html */
  .interlintitle {
      ${escapeCSS($pEscArbitrary('interlintitle_css'))}
  }
  `
  : '') +
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
    // Todo: escaping should be done in business logic!
    escapeQuotedCSS, escapeCSS, escapeHTML,
    l, localizedFieldNames, fieldLangs, fieldDirs,
    caption, hasCaption, showInterlinTitles,
    determineEnd, getCanonicalID, canonicalBrowseFieldSetName,
    getCellValue, checkedAndInterlinearFieldInfo,
    interlinearSeparator = '<br /><br />'
  }) {
    const tableOptions = {
      table: [
        ['table', {class: 'table', border: $pRaw('border') || '0'}],
        ['tr', {class: 'tr'}],
        ['td'], // , {class: 'td'} // Too much data to add class to each
        ['th', {class: 'th'}],
        ['caption', {class: 'caption'}],
        ['thead', {class: 'thead'}],
        ['tbody', {class: 'tbody'}],
        ['tfoot', {class: 'tfoot'}]
        // ['colgroup', {class: 'colgroup'}],
        // ['col', {class: 'col'}]
      ],
      div: [
        ['div', {class: 'table', style: 'display: table;'}],
        ['div', {class: 'tr', style: 'display: table-row;'}],
        ['div', {class: 'td', style: 'display: table-cell;'}],
        ['div', {class: 'th', style: 'display: table-cell;'}],
        ['div', {class: 'caption', style: 'display: table-caption;'}],
        ['div', {class: 'thead', style: 'display: table-header-group;'}],
        ['div', {class: 'tbody', style: 'display: table-row-group;'}],
        ['div', {class: 'tfoot', style: 'display: table-footer-group;'}]
        // ['div', {class: 'colgroup', style: 'display: table-column-group;'}],
        // ['div', {class: 'col', style: 'display: table-column;'}]
      ],
      'json-array': 'json',
      'json-object': 'json'
    };
    const outputmode = $p.get('outputmode', true); // Why not $pRaw?

    switch (outputmode) {
    case 'json-object': // Can later fall through if supporting
    case 'json-array':
      // tableOptions[outputmode] = tableOptions.table;
      // break;
      throw new Error('JSON object support is currently not available');
    default:
      break;
    }

    const tableElems = tableOptions[
      Object.prototype.hasOwnProperty.call(tableOptions, outputmode)
        ? outputmode
        : 'table' // Default
    ];
    const [
      tableElem, trElem, tdElem, thElem, captionElem, theadElem, tbodyElem, tfootElem
    ] = tableElems; // colgroupElem, colElem

    const [checkedFields, checkedFieldIndexes, allInterlinearColIndexes] =
            checkedAndInterlinearFieldInfo;

    const tableWithFixedHeaderAndFooter = $pRaw('headerfooterfixed') === 'yes';
    const tableWrap = (children) => {
      return tableWithFixedHeaderAndFooter
        ? ['div', {class: 'table-responsive anchor-table-header zupa'}, [
          ['div', {class: 'table-responsive anchor-table-body'}, children]
        ]]
        : ['div', {class: 'table-responsive'}, children];
    };

    const addChildren = (el, children) => {
      // eslint-disable-next-line unicorn/prefer-structured-clone -- Need JSON
      el = JSON.parse(JSON.stringify(el));
      el.push(children);
      return el;
    };
    const addAtts = ([el, atts], newAtts) => [el, {...atts, ...newAtts}];

    const foundState = {
      start: false,
      end: false
    };
    const outArr = [];

    const {showEmptyInterlinear, showTitleOnSingleInterlinear} = this;

    const checkEmpty = (tdVal, htmlEscaped) => {
      if (!showEmptyInterlinear) {
        if (!htmlEscaped) {
          tdVal = new DOMParser().parseFromString(tdVal, 'text/html').body;
          [...tdVal.querySelectorAll('br')].forEach((br) => {
            br.remove();
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

      const canonicalID = getCanonicalID({tr});

      outArr.push(addChildren(
        addAtts(trElem, {
          dataset: {
            row: rowID,
            'canonical-type': canonicalBrowseFieldSetName,
            'canonical-id': canonicalID
          }
        }),
        checkedFieldIndexes.map((idx, j) => {
          const interlinearColIndexes = allInterlinearColIndexes[j];
          const showInterlins = interlinearColIndexes;
          const {tdVal, htmlEscaped} = getCellValue({tr, idx});
          const interlins = showInterlins && interlinearColIndexes.map((idx) => {
            // Need to get a new one
            const {tdVal, htmlEscaped} = getCellValue({tr, idx});
            console.log('showEmptyInterlinear', showEmptyInterlinear, htmlEscaped);
            const isEmpty = checkEmpty(tdVal, htmlEscaped);
            if (isEmpty) {
              return '';
            }

            return (showInterlins
              ? Templates.resultsDisplayServerOrClient.interlinearSegment({
                lang: fieldLangs[idx],
                dir: fieldDirs[idx],
                html: (showInterlinTitles
                  ? Templates.resultsDisplayServerOrClient.interlinearTitle({
                    l, val: localizedFieldNames[idx]
                  })
                  : '') + tdVal
              })
              : tdVal);
          }).filter((cell) => cell !== '');
          return addAtts(tdElem, {
            // We could remove these (and add to <col>) for optimizing delivery,
            //    but non-table output couldn't use unless on a hidden element
            // Can't have unique IDs if user duplicates a column
            id: 'row' + (i + 1) + 'col' + (j + 1),
            lang: fieldLangs[idx],
            dir: fieldDirs[idx],
            dataset: {
              col: localizedFieldNames[idx]
            },
            innerHTML:
                            (showInterlins && !checkEmpty(tdVal, htmlEscaped) &&
                                (showTitleOnSingleInterlinear || interlins.length)
                              ? Templates.resultsDisplayServerOrClient.interlinearSegment({
                                lang: fieldLangs[idx],
                                html: (showInterlinTitles
                                  ? Templates.resultsDisplayServerOrClient.interlinearTitle({
                                    l, val: localizedFieldNames[idx]
                                  })
                                  : '') + tdVal
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
      return false;
    });

    return ['div', [
      Templates.resultsDisplayServerOrClient.styles({
        $p, $pRaw, $pRawEsc, $pEscArbitrary,
        escapeQuotedCSS, escapeCSS, tableWithFixedHeaderAndFooter,
        checkedFieldIndexes, hasCaption
      }),
      tableWrap([
        addChildren(tableElem, [
          (caption
            ? addChildren(captionElem, [
              caption,
              tableWithFixedHeaderAndFooter
                ? ['div', {class: 'zupa1'}, [
                  ['div', {class: 'inner-caption'}, [
                    ['span', [caption]]
                  ]]
                ]]
                : ''
            ])
            : ''),
          /*
                    // Works but quirky, e.g., `color` doesn't work (as also
                    //  confirmed per https://quirksmode.org/css/css2/columns.html)
                    addChildren(colgroupElem,
                        checkedFieldIndexes.map((idx, i) =>
                            addAtts(colElem, {style: $pRaw('css' + (idx + 1))})
                        )
                    ),
                    */
          ($pRaw('header') !== '0'
            ? addChildren(theadElem, [
              addChildren(
                trElem,
                checkedFields.map((cf, i) => {
                  const interlinearColIndexes = allInterlinearColIndexes[i];
                  cf = escapeHTML(cf) + (interlinearColIndexes
                    ? l('comma-space') + interlinearColIndexes.map((idx) => {
                      return localizedFieldNames[idx];
                    }).join(l('comma-space'))
                    : ''
                  );
                  return addChildren(thElem, [
                    cf,
                    (tableWithFixedHeaderAndFooter
                      ? ['div', {class: 'zupa1'}, [
                        ['div', {class: 'th-inner'}, [
                          ['span', [cf]]
                        ]]
                      ]]
                      : ''
                    )
                  ]);
                })
              )
            ])
            : ''),
          ($pRaw('footer') && $pRaw('footer') !== '0'
            ? addChildren(tfootElem, [
              addChildren(
                trElem,
                checkedFields.map((cf, i) => {
                  const interlinearColIndexes = allInterlinearColIndexes[i];
                  cf = escapeHTML(cf) + (interlinearColIndexes
                    ? l('comma-space') + interlinearColIndexes.map((idx) => {
                      return localizedFieldNames[idx];
                    }).join(l('comma-space'))
                    : ''
                  );
                  return addChildren(thElem, [
                    cf,
                    (tableWithFixedHeaderAndFooter
                      ? ['div', {class: 'zupa1'}, [
                        ['div', {class: 'th-inner'}, [
                          ['span', [cf]]
                        ]]
                      ]]
                      : ''
                    )
                  ]);
                })
              )
            ])
            : ''),
          addChildren(tbodyElem, outArr)
        ])
      ])
    ]];
  }
};
