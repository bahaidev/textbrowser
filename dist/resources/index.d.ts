export default TextBrowser;
export type SiteData = {
    "localization-strings": {
        [locale: string]: {
            [key: string]: string;
        };
    };
};
export type Langs = {
    code: string;
    direction: string;
    locale: object;
};
export type ServiceWorkerConfig = import("./utils/ServiceWorker.js").ServiceWorkerConfig;
/**
 * @typedef {import('./utils/ServiceWorker.js').ServiceWorkerConfig} ServiceWorkerConfig
 */
/**
 * @implements {ServiceWorkerConfig}
 */
declare class TextBrowser implements ServiceWorkerConfig {
    /**
     * @param {ServiceWorkerConfig & {
     *   site?: string,
     *   stylesheets?: string[],
     *   allowPlugins?: boolean,
     *   dynamicBasePath?: string,
     *   trustFormatHTML?: boolean,
     *   requestPersistentStorage?: boolean,
     *   localizeParamNames?: boolean,
     *   hideFormattingSection?: boolean,
     *   preferencesPlugin?: import('./templates/workDisplay.js').PreferencesPlugin,
     *   interlinearSeparator?: string,
     *   showEmptyInterlinear?: boolean,
     *   showTitleOnSingleInterlinear?: boolean,
     *   noDynamic?: boolean,
     *   skipIndexedDB?: boolean
     * }} options
     */
    constructor(options: ServiceWorkerConfig & {
        site?: string;
        stylesheets?: string[];
        allowPlugins?: boolean;
        dynamicBasePath?: string;
        trustFormatHTML?: boolean;
        requestPersistentStorage?: boolean;
        localizeParamNames?: boolean;
        hideFormattingSection?: boolean;
        preferencesPlugin?: import("./templates/workDisplay.js").PreferencesPlugin;
        interlinearSeparator?: string;
        showEmptyInterlinear?: boolean;
        showTitleOnSingleInterlinear?: boolean;
        noDynamic?: boolean;
        skipIndexedDB?: boolean;
    });
    site: string;
    stylesheets: string[];
    /** @type {SiteData} */
    siteData: SiteData;
    /** @type {import('../server/main.js').LanguagesData} */
    langData: import("../server/main.js").LanguagesData;
    /** @type {string[]} */
    lang: string[];
    userJSON: string;
    languages: string;
    serviceWorkerPath: string;
    files: string;
    namespace: string;
    allowPlugins: boolean | undefined;
    dynamicBasePath: string | undefined;
    trustFormatHTML: boolean | undefined;
    requestPersistentStorage: boolean | undefined;
    localizeParamNames: boolean;
    hideFormattingSection: boolean;
    preferencesPlugin: import("./templates/workDisplay.js").PreferencesPlugin | undefined;
    interlinearSeparator: string | undefined;
    showEmptyInterlinear: boolean | undefined;
    showTitleOnSingleInterlinear: boolean | undefined;
    noDynamic: boolean | undefined;
    skipIndexedDB: boolean | undefined;
    init(): Promise<void>;
    _stylesheetElements: HTMLLinkElement[] | undefined;
    /**
     * @template T
     * @template {keyof T} K
     * @typedef {Omit<T, K> & Partial<T>} PartialBy
     */
    /**
     * @param {PartialBy<
     *   import('./utils/WorkInfo.js').GetWorkDataOptions,
     *   "files"|"basePath"|"allowPlugins"
     * >} opts
     */
    getWorkData(opts: Omit<import("./utils/WorkInfo.js").GetWorkDataOptions, "files" | "basePath" | "allowPlugins"> & Partial<import("./utils/WorkInfo.js").GetWorkDataOptions>): Promise<import("./utils/WorkInfo.js").GetWorkDataReturn> | undefined;
    /**
     * @param {string} code
     */
    getDirectionForLanguageCode(code: string): import("../server/main.js").LanguageInfo | "ltr" | "rtl" | undefined;
    /**
     * @param {import('./utils/Metadata.js').GetFieldNameAndValueAliasesOptions} args
     */
    getFieldNameAndValueAliases(args: import("./utils/Metadata.js").GetFieldNameAndValueAliasesOptions): {
        aliases: string[] | null;
        fieldValueAliasMap: FieldValueAliases | null;
        rawFieldValueAliasMap: FieldValueAliases | null;
        fieldName: string;
        fieldSchema: {
            title: string;
            type: string;
        };
        fieldSchemaIndex: number;
        preferAlias: boolean | string;
        lang: string;
    };
    /**
     * @param {Omit<import('./utils/Metadata.js').GetBrowseFieldDataOptions, "lang">} args
     * @returns {void}
     */
    getBrowseFieldData(args: Omit<import("./utils/Metadata.js").GetBrowseFieldDataOptions, "lang">): void;
    paramChange(): Promise<void>;
    $p: IntlURLSearchParams | undefined;
    l10n: import("../node_modules/intl-dom/dist/i18n.js").I18NCallback | undefined;
    workDisplay: typeof workDisplay;
    resultsDisplayClient: (this: TextBrowser, args: Omit<ResultsDisplayServerOrClientArg, "skipIndexedDB" | "prefI18n">) => Promise<void>;
}
import IntlURLSearchParams from './utils/IntlURLSearchParams.js';
import workDisplay from './workDisplay.js';
//# sourceMappingURL=index.d.ts.map