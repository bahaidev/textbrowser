declare namespace _default {
    /**
     * @param {{
     *   langs: import('../../server/main.js').LanguageInfo[]
     *   languages: import('../utils/Languages.js').Languages
     *   followParams: (formSelector: string, cb: () => void) => void
     *   $p: import('../utils/IntlURLSearchParams.js').default
     * }} cfg
     */
    function main({ langs, languages, followParams, $p }: {
        langs: import("../../server/main.js").LanguageInfo[];
        languages: import("../utils/Languages.js").Languages;
        followParams: (formSelector: string, cb: () => void) => void;
        $p: import("../utils/IntlURLSearchParams.js").default;
    }): void;
}
export default _default;
//# sourceMappingURL=languageSelect.d.ts.map