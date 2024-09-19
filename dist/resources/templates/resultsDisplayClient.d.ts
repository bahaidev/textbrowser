declare namespace _default {
    /**
     * @param {{
     *   anchorRowCol: string
     * }} cfg
     */
    function anchorRowCol({ anchorRowCol }: {
        anchorRowCol: string;
    }): HTMLElement | null;
    /**
     * @param {{
     *   escapedRow: string
     *   escapedCol: string|undefined
     * }} cfg
     */
    function anchors({ escapedRow, escapedCol }: {
        escapedRow: string;
        escapedCol: string | undefined;
    }): HTMLElement | null;
    /**
     * @param {import('./resultsDisplayServerOrClient.js').ResultsDisplayServerOrClientArgs} args
     */
    function main(args: import("./resultsDisplayServerOrClient.js").ResultsDisplayServerOrClientArgs): void;
}
export default _default;
//# sourceMappingURL=resultsDisplayClient.d.ts.map