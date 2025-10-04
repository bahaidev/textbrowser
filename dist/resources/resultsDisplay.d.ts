export function resultsDisplayClient(this: import("./index.js").default, args: Omit<ResultsDisplayServerOrClientArg, "skipIndexedDB" | "prefI18n">): Promise<void>;
export function resultsDisplayServer(this: import("../server/main.js").ResultsDisplayServerContext, args: ResultsDisplayServerOrClientArg & {
    serverOutput?: "jamilih" | "html" | "json" | null;
}): Promise<import("jamilih").JamilihArray | string | (string | number)[][]>;
export function resultsDisplayServerOrClient(this: import("./index.js").default | import("../server/main.js").ResultsDisplayServerContext, { l, lang, fallbackLanguages, locales, $p, skipIndexedDB, noIndexedDB, prefI18n, files, allowPlugins, langData, basePath, dynamicBasePath }: ResultsDisplayServerOrClientArg): Promise<{
    fieldInfo: FieldInfo;
    $p: import("./utils/IntlURLSearchParams.js").default;
    applicableBrowseFieldSet: import("./utils/Metadata.js").BrowseFields;
    fieldValueAliasMapPreferred: (import("./utils/Metadata.js").FieldValueAliases | null | undefined)[];
    workI18n: import("intl-dom").I18NCallback<string | Text | DocumentFragment>;
    lIndexedParam: (key: string) => string;
    lParamRaw: (key: string, suffix?: string) => string;
    browseFieldSets: import("./utils/Metadata.js").BrowseFields[];
    lang: string[];
    metadataObj: import("./utils/Metadata.js").MetadataObj;
    fileData: import("./utils/WorkInfo.js").FileData;
    templateArgs: {
        tableData: (string | number)[][];
        $p: import("./utils/IntlURLSearchParams.js").default;
        $pRaw: (param: string, avoidLog?: boolean) => string;
        $pRawEsc: (param: string) => string;
        $pEscArbitrary: (param: string) => string;
        escapeQuotedCSS: (s: string) => string;
        escapeCSS: (s: string) => string;
        escapeHTML: (s: string) => string;
        l: import("intl-dom").I18NCallback<string | Text | DocumentFragment>;
        localizedFieldNames: (string | string[] | import("../server/main.js").LocalizationStrings)[];
        fieldLangs: (string | null)[];
        fieldDirs: (string | null)[];
        caption: string | undefined;
        hasCaption: boolean;
        showInterlinTitles: boolean;
        showEmptyInterlinear: boolean | undefined;
        showTitleOnSingleInterlinear: boolean | undefined;
        determineEnd: ({ tr, foundState }: {
            tr: (string | Integer)[];
            foundState: {
                start: boolean;
                end: boolean;
            };
        }) => string | boolean;
        canonicalBrowseFieldSetName: string;
        getCanonicalID: ({ tr }: {
            tr: (string | Integer)[];
        }) => string;
        getCellValue: GetCellValue;
        checkedAndInterlinearFieldInfo: [string[], number[], ("" | number[] | null)[]];
        interlinearSeparator: string | undefined;
    };
}>;
export type GetCanonicalID = (cfg: {
    tr: (string | Integer)[];
}) => string;
export type DetermineEnd = (cfg: {
    tr: (string | Integer)[];
    foundState: {
        start: boolean;
        end: boolean;
    };
}) => string | boolean;
export type Plugin = import("./utils/Plugin.js").PluginObject;
export type FieldInfo = {
    field?: string;
    fieldAliasOrName: string | string[] | import("../server/main.js").LocalizationStrings;
    escapeColumn: boolean;
    fieldLang: string;
    plugin?: Plugin;
    applicableField?: string;
    meta?: {
        [key: string]: string;
    };
    j?: number;
    placement?: number;
    metaApplicableField?: {
        [key: string]: string;
    };
    onByDefault?: boolean;
}[];
export type FieldValueAliases = import("./utils/Metadata.js").FieldValueAliases;
export type AnyValue = any;
export type Integer = number;
export type GetCellValue = (info: {
    tr: (string | Integer)[];
    idx: number;
}) => {
    tdVal: string | Integer;
    htmlEscaped: boolean;
} | {
    tdVal: string | Integer;
    htmlEscaped?: undefined;
};
export type ResultsDisplayServerOrClientArg = {
    l: import("intl-dom").I18NCallback;
    lang: string[];
    fallbackLanguages: string[] | undefined;
    locales: {
        head?: AnyValue;
        body: AnyValue;
    };
    $p: import("./utils/IntlURLSearchParams.js").default;
    skipIndexedDB: boolean;
    noIndexedDB?: boolean;
    prefI18n: "true" | "false" | null;
    files?: string;
    allowPlugins?: boolean;
    langData: import("../server/main.js").LanguagesData;
    basePath: string;
    dynamicBasePath?: string;
};
//# sourceMappingURL=resultsDisplay.d.ts.map