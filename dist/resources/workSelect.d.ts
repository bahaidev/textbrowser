/**
 * @param {{
 *   files: string,
 *   lang: string[],
 *   fallbackLanguages: string[],
 *   $p: import('./utils/IntlURLSearchParams.js').default,
 *   followParams: (formSelector: string, cb: () => void) => void
 * }} cfg
 */
export default function workSelect({ files, lang, fallbackLanguages, $p, followParams }: {
    files: string;
    lang: string[];
    fallbackLanguages: string[];
    $p: import("./utils/IntlURLSearchParams.js").default;
    followParams: (formSelector: string, cb: () => void) => void;
}): Promise<void>;
//# sourceMappingURL=workSelect.d.ts.map