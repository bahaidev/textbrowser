/**
 * @param {{
 *   $p: import('./IntlURLSearchParams').default,
 *   lang: string[],
 *   langs: import('../../server/main.js').LanguageInfo[],
 *   langData: import('../../server/main.js').LanguagesData,
 *   fallbackLanguages?: string[],
 *   basePath?: string
 * }} options
 */
export default function getLocaleFallbackResults({ $p, lang, langs, langData, fallbackLanguages, basePath }: {
    $p: import("./IntlURLSearchParams").default;
    lang: string[];
    langs: import("../../server/main.js").LanguageInfo[];
    langData: import("../../server/main.js").LanguagesData;
    fallbackLanguages?: string[];
    basePath?: string;
}): Promise<import("../../node_modules/intl-dom/dist/i18n").I18NCallback>;
//# sourceMappingURL=getLocaleFallbackResults.d.ts.map