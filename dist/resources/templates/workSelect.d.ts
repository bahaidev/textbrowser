export default workSelect;
/**
 * @param {{
 *   groups: import('../utils/WorkInfo.js').FileGroup[]
 *   workI18n: import('intl-dom').I18NCallback
 *   getNextAlias: () => string|string[]|import('../../server/main.js').LocalizationStrings
 *   $p: import('../utils/IntlURLSearchParams.js').default
 *   followParams: (formSelector: string, cb: () => void) => void
 * }} cfg
 */
declare function workSelect({ groups, workI18n, getNextAlias, $p, followParams }: {
    groups: import("../utils/WorkInfo.js").FileGroup[];
    workI18n: import("intl-dom").I18NCallback;
    getNextAlias: () => string | string[] | import("../../server/main.js").LocalizationStrings;
    $p: import("../utils/IntlURLSearchParams.js").default;
    followParams: (formSelector: string, cb: () => void) => void;
}): HTMLFormElement;
//# sourceMappingURL=workSelect.d.ts.map