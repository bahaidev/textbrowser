export function getPreferredLanguages({ namespace, preferredLocale }: {
    namespace: string;
    preferredLocale: string;
}): string[];
/**
 * @classdesc Note that this should be kept as a polyglot client-server class.
 */
export class Languages {
    /**
     * @param {{
     *   langData: import('../../server/main.js').LanguagesData
     * }} cfg
     */
    constructor({ langData }: {
        langData: import("../../server/main.js").LanguagesData;
    });
    langData: import("../../server/main.js").LanguagesData;
    /**
     * @param {string} langCode
     * @returns {{
     *   languages: {
     *     [key: string]: string
     *   }
     * }}
     */
    localeFromLangData(langCode: string): {
        languages: {
            [key: string]: string;
        };
    };
    /**
     * @param {string} code
     * @returns {string}
     */
    getLanguageFromCode(code: string): string;
    /**
     * @param {{
     *   pluginName: string,
     *   workI18n: import('intl-dom').I18NCallback,
     *   targetLanguage: string,
     *   applicableFieldI18N: string|string[],
     *   meta: {
     *     [key: string]: string
     *   },
     *   metaApplicableField: {
     *     [key: string]: string
     *   },
     * }} cfg
     * @returns {string}
     */
    getFieldNameFromPluginNameAndLocales({ pluginName, workI18n, targetLanguage, applicableFieldI18N, meta, metaApplicableField }: {
        pluginName: string;
        workI18n: import("intl-dom").I18NCallback;
        targetLanguage: string;
        applicableFieldI18N: string | string[];
        meta: {
            [key: string]: string;
        };
        metaApplicableField: {
            [key: string]: string;
        };
    }): string;
    /**
     * @param {{$p: import('./IntlURLSearchParams.js').default}} cfg
     * @returns {{
     *   lang: string[],
     *   langs: import('../../server/main.js').LanguageInfo[],
     *   languageParam: string|null,
     *   fallbackLanguages: string[]
     * }}
     */
    getLanguageInfo({ $p }: {
        $p: import("./IntlURLSearchParams.js").default;
    }): {
        lang: string[];
        langs: import("../../server/main.js").LanguageInfo[];
        languageParam: string | null;
        fallbackLanguages: string[];
    };
}
//# sourceMappingURL=Languages.d.ts.map