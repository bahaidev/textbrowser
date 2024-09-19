declare namespace _default {
    /**
     * @param {{
     *   heading: string,
     *   ranges: string
     * }} cfg
     */
    function caption({ heading, ranges }: {
        heading: string;
        ranges: string;
    }): string;
    /**
     * @param {{
     *   l: import('intl-dom').I18NCallback
     * }} cfg
     * @returns {string}
     */
    function startSeparator({ l }: {
        l: import("intl-dom").I18NCallback;
    }): string;
    /**
     * @param {{
     *   l: import('intl-dom').I18NCallback
     * }} cfg
     */
    function innerBrowseFieldSeparator({ l }: {
        l: import("intl-dom").I18NCallback;
    }): string;
    /**
     * @param {{
    *   l: import('intl-dom').I18NCallback,
    *   startRange: string,
    *   endVals: string[],
    *   rangeNames: string
    * }} cfg
    */
    function ranges({ l, startRange, endVals, rangeNames }: {
        l: import("intl-dom").I18NCallback;
        startRange: string;
        endVals: string[];
        rangeNames: string;
    }): string;
    /**
     * @param {{
     *   key: string,
     *   value: string|number
     * }} cfg
     */
    function fieldValueAlias({ key, value }: {
        key: string;
        value: string | number;
    }): string;
    /**
     * @param {{
     *   lang?: string|null,
     *   dir?: string|null,
     *   html: string
     * }} cfg
     */
    function interlinearSegment({ lang, dir, html }: {
        lang?: string | null;
        dir?: string | null;
        html: string;
    }): string;
    /**
     * @param {{
    *   l: import('intl-dom').I18NCallback,
    *   val: string
    * }} cfg
    */
    function interlinearTitle({ l, val }: {
        l: import("intl-dom").I18NCallback;
        val: string;
    }): string;
    /**
     * @param {{
     *   $p: import('../utils/IntlURLSearchParams.js').default,
     *   $pRaw: (key: string, avoidLog?: boolean) => string,
     *   $pRawEsc: (str: string) => string,
     *   $pEscArbitrary: (str: string) => string,
     *   escapeCSS: (str: string) => string,
     *   tableWithFixedHeaderAndFooter: boolean,
     *   checkedFieldIndexes: number[],
     *   hasCaption: boolean
     * }} cfg
     * @returns {import('jamilih').JamilihArray}
     */
    function styles({ $p, $pRaw, $pRawEsc, $pEscArbitrary, escapeCSS, tableWithFixedHeaderAndFooter, checkedFieldIndexes, hasCaption }: {
        $p: import("../utils/IntlURLSearchParams.js").default;
        $pRaw: (key: string, avoidLog?: boolean) => string;
        $pRawEsc: (str: string) => string;
        $pEscArbitrary: (str: string) => string;
        escapeCSS: (str: string) => string;
        tableWithFixedHeaderAndFooter: boolean;
        checkedFieldIndexes: number[];
        hasCaption: boolean;
    }): import("jamilih").JamilihArray;
    /**
     * @param {ResultsDisplayServerOrClientArgs} args
     * @returns {import('jamilih').JamilihArray}
     */
    function main({ tableData, $p, $pRaw, $pRawEsc, $pEscArbitrary, escapeCSS, escapeHTML, l, localizedFieldNames, fieldLangs, fieldDirs, caption, hasCaption, showInterlinTitles, determineEnd, getCanonicalID, canonicalBrowseFieldSetName, getCellValue, checkedAndInterlinearFieldInfo, showEmptyInterlinear, showTitleOnSingleInterlinear, interlinearSeparator }: ResultsDisplayServerOrClientArgs): import("jamilih").JamilihArray;
}
export default _default;
export type Integer = number;
export type ResultsDisplayServerOrClientArgs = {
    interlinearSeparator?: string;
    showEmptyInterlinear?: boolean;
    showTitleOnSingleInterlinear?: boolean;
    tableData: (string | Integer)[][];
    $p: import("../utils/IntlURLSearchParams.js").default;
    $pRaw: (key: string, avoidLog?: boolean) => string;
    $pRawEsc: (str: string) => string;
    $pEscArbitrary: (str: string) => string;
    escapeQuotedCSS: (str: string) => string;
    escapeCSS: (str: string) => string;
    escapeHTML: (str: string) => string;
    l: import("intl-dom").I18NCallback;
    localizedFieldNames: (string | string[] | import("../../server/main.js").LocalizationStrings)[];
    fieldLangs: (string | null)[];
    fieldDirs: (string | null)[];
    caption?: string;
    hasCaption: boolean;
    showInterlinTitles: boolean;
    determineEnd: import("../resultsDisplay.js").DetermineEnd;
    getCanonicalID: import("../resultsDisplay.js").GetCanonicalID;
    canonicalBrowseFieldSetName: string;
    getCellValue: import("../resultsDisplay.js").GetCellValue;
    checkedAndInterlinearFieldInfo: [string[], number[], ("" | number[] | null)[]];
};
//# sourceMappingURL=resultsDisplayServerOrClient.d.ts.map