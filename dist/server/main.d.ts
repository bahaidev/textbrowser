#!/usr/bin/env node
export type UserOptions = {
    nodeActivate: boolean;
    port: number;
    domain: string;
    basePath: string;
    interlinearSeparator: string;
    localizeParamNames: boolean;
    trustFormatHTML: boolean;
    allowPlugins: boolean;
    showEmptyInterlinear: boolean;
    showTitleOnSingleInterlinear: boolean;
    serviceWorkerPath: string;
    userJSON: string;
    languages: string;
    files: string;
    namespace: string;
    httpServer: string;
    expressServer: string;
};
export type AnyValue = any;
export type ResultsDisplayServerContext = import("../resources/utils/ServiceWorker.js").ServiceWorkerConfig & UserOptions & {
    lang: string[];
    langs: LanguageInfo[];
    fallbackLanguages: string[];
    log: (...args: AnyValue[]) => void;
    nodeActivate?: boolean;
    port?: number;
    skipIndexedDB: false;
    noDynamic: false;
};
export type LanguageInfo = {
    code: string;
    direction: "ltr" | "rtl";
    locale: {
        $ref: string;
    };
};
export type LocalizationStrings = {
    [key: string]: string | string[] | LocalizationStrings;
};
export type LanguagesData = {
    languages: LanguageInfo[];
    localeFileBasePath?: string;
    "localization-strings": LocalizationStrings;
};
//# sourceMappingURL=main.d.ts.map