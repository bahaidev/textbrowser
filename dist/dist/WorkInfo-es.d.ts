export type getJSONCallback = (jsonURL: string | string[], cb: SimpleJSONCallback, errBack: SimpleJSONErrback) => Promise<JSON>;
export type PromiseChainErrback = (value: any) => Promise<any> | any;
export type KeyCheckerConverterCallback = (key: string | string[], messageStyle: "plain" | "plainNested" | "rich" | "richNested" | any) => any;
export type Sort = any;
export type SortList = any;
export type List = any;
export type I18NCallback = any;
export type Integer = number;
export type JSON6 = any;
export type AnyValue = any;
export type BetweenMatches = (str: string) => void;
export type AfterMatch = (str: string) => void;
export type EscapeAtOne = (str: string) => void;
export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/**
 * Callback to give replacement text based on a substitution value.
 *
 * `value` - contains the value returned by the individual substitution.
 * `arg` - See `cfg.arg` of {@link SubstitutionCallback}.
 * `key` - The substitution key Not currently in use
 * `locale` - The locale.
 */
export type AllSubstitutionCallback = (info: {
    value: any;
    arg?: string;
    key?: string;
    locale?: string;
}) => string | Node;
/**
 * `arg` - By default, accepts the third portion of the
 *   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
 *   supply arguments back to the calling script.
 * `key` - The substitution key.
 */
export type SubstitutionCallback = (cfg: {
    arg: string;
    key: string;
}) => string | Element;
/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * The first value is the main value.
 * The second are the options related to the main value.
 * The third are any additional options.
 */
export type ValueArray = [string | number | Date, object?, object?];
export type ListValueArray = [string[], (((item: string, i: Integer) => Element) | object)?, object?, object?];
export type DateRangeValueArray = [Date | number, Date | number, Intl.DateTimeFormatOptions | undefined];
export type RelativeValueArray = [number, Intl.RelativeTimeFormatUnit, object?];
export type RelativeTimeInfo = {
    relative: RelativeValueArray;
};
export type ListInfo = {
    list: ListValueArray;
};
export type NumberInfo = {
    number: ValueArray | number;
};
export type DateInfo = {
    date: ValueArray;
};
export type DateTimeInfo = {
    datetime: ValueArray;
};
export type DateRangeInfo = {
    dateRange: DateRangeValueArray;
};
export type DatetimeRangeInfo = {
    datetimeRange: DateRangeValueArray;
};
export type RegionInfo = {
    region: ValueArray;
};
export type LanguageInfo = {
    language: ValueArray;
};
export type ScriptInfo = {
    script: ValueArray;
};
export type CurrencyInfo = {
    currency: ValueArray;
};
export type PluralInfo = {
    plural: ValueArray;
};
export type PlainLocaleStringBodyObject = {
    [key: string]: string;
};
export type PlainNestedLocaleStringBodyObject = {
    [key: string]: string | PlainNestedLocaleStringBodyObject;
};
export type SwitchCaseInfo = {
    /**
     * Whether this conditional is the default
     */
    default?: boolean | undefined;
};
/**
 * Contains the type, the message, and optional info about the switch case.
 */
export type SwitchCaseArray = [string, string, SwitchCaseInfo?];
export type SwitchArray = {
    [x: string]: SwitchCaseArray;
};
export type SwitchArrays = {
    [x: string]: SwitchArray;
};
export type SwitchCase = {
    /**
     * The locale message with any formatting
     * place-holders; defaults to use of any single conditional
     */
    message: string;
    /**
     * A description to add for translators
     */
    description?: string | undefined;
};
export type Switch = {
    [x: string]: SwitchCase;
};
export type Switches = {
    [x: string]: Switch;
};
export type RichLocaleStringSubObject = {
    /**
     * The locale message with any formatting
     * place-holders; defaults to use of any single conditional
     */
    message: string;
    /**
     * A description to add for translators
     */
    description?: string | undefined;
    /**
     * Conditionals
     */
    switches?: {
        [x: string]: {
            [x: string]: SwitchCase;
        };
    } | undefined;
};
export type RichLocaleStringBodyObject = {
    [key: string]: RichLocaleStringSubObject;
};
export type RichNestedLocaleStringBodyObject = {
    [key: string]: RichLocaleStringSubObject | RichNestedLocaleStringBodyObject;
};
/**
 * Takes a base path and locale and gives a URL.
 */
export type LocaleResolver = (localesBasePath: string, locale: string) => string | false;
export type DateRange = [Date | number, Date | number, (Intl.DateTimeFormatOptions | undefined)?];
export type SubstitutionObjectValue = string | string[] | number | Date | DateRange | Element | Node | SubstitutionCallback | NumberInfo | PluralInfo | CurrencyInfo | LanguageInfo | ScriptInfo | DatetimeRangeInfo | DateRangeInfo | RegionInfo | DateTimeInfo | DateInfo | ListInfo | RelativeTimeInfo;
export type SubstitutionObject = {
    [key: string]: SubstitutionObjectValue;
};
export type Replace = (cfg: {
    str: string;
    substs?: any;
    formatter?: any | any | any;
}) => string;
export type ProcessSubstitutions = (cfg: {
    str: string;
    substs?: any;
    formatter?: any | any | any;
}) => (string | Node)[];
/**
 * Callback to return a string or array of nodes and strings based on
 *   a localized string, substitutions object, and other metadata.
 *
 * `string` - The localized string.
 * `dom` - If substitutions known to contain DOM, can be set
 *    to `true` to optimize.
 * `usedKeys` - Array for tracking which keys have been used. Defaults
 *   to empty array.
 * `substitutions` - The formatting substitutions object.
 * `allSubstitutions` - The
 *   callback or array composed thereof for applying to each substitution.
 * `locale` - The successfully resolved locale
 * `locals` - The local section.
 * `switches` - The switch section.
 * `maximumLocalNestingDepth` - Depth of local variable resolution to
 *   check before reporting a recursion error. Defaults to 3.
 * `missingSuppliedFormatters` - Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * `checkExtraSuppliedFormatters` - No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 */
export type InsertNodesCallback = (cfg: {
    string: string;
    dom?: boolean;
    usedKeys: string[];
    substitutions: any;
    allSubstitutions?: (any | any[]) | null;
    locale: string | undefined;
    locals?: any | undefined;
    switches: any | undefined;
    maximumLocalNestingDepth?: Integer;
    missingSuppliedFormatters: any;
    checkExtraSuppliedFormatters: any;
}) => string | (Node | string)[];
export type LocalObject = LocaleBody;
/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 */
export type LocaleHead = {
    locals?: LocalObject;
    switches?: any;
};
export type LocaleBody = any | any | any | any | object;
export type LocaleObject = {
    head?: LocaleHead | undefined;
    body: LocaleBody;
};
export type MessageStyleCallbackResult = {
    /**
     * Regardless of message style, will contain
     * the string result
     */
    value: string;
    /**
     * Full info on the localized item
     * (for rich message styles only)
     */
    info?: any;
};
export type MessageStyleCallback = (obj: LocaleObject, key: string) => false | MessageStyleCallbackResult;
export type CheckExtraSuppliedFormattersCallback = (substs: any | {
    substitutions: import("./defaultLocaleResolver.js").SubstitutionObject;
}) => any;
export type MissingSuppliedFormattersCallback = (cfg: {
    key: string;
    formatter: any | any | any;
}) => boolean;
export type LocaleObjectInfo = {
    /**
     * The successfully retrieved locale strings
     */
    strings: any;
    /**
     * The successfully resolved locale
     */
    locale: string;
};
export type LocaleStringArgs = {
    locales?: string[];
    defaultLocales?: string[];
    localesBasePath?: string;
    localeResolver?: any;
    localeMatcher?: "lookup" | LocaleMatcher;
};
/**
 * `locales` - BCP-47 language strings. Defaults to `navigator.languages`.
 * `defaultLocales` - Defaults to ["en-US"].
 * `localesBasePath` - Defaults to `.`.
 * `localeResolver` - Defaults to `defaultLocaleResolver`.
 */
export type LocaleStringFinder = (cfg?: LocaleStringArgs) => Promise<LocaleObjectInfo>;
export function getFilePaths(filesObj: any, fileGroup: any, fileData: any): {
    file: string;
    schemaFile: string;
    metadataFile: string;
};
export function getWorkData({ lang, fallbackLanguages, work, files, allowPlugins, basePath, languages, preferredLocale }: {
    lang: any;
    fallbackLanguages: any;
    work: any;
    files: any;
    allowPlugins: any;
    basePath: any;
    languages: any;
    preferredLocale: any;
}): Promise<{
    fileData: undefined;
    workI18n: any;
    getFieldAliasOrName: (field: any) => any;
    metadataObj: any;
    schemaObj: any;
    schemaItems: any;
    fieldInfo: any;
    pluginsForWork: PluginsForWork;
    groupsToWorks: any;
    metadata: Metadata;
}>;
/**
 * Imported by the `dist/sw-helper.js`
 * @param {string} files The files.json file path
 * @returns {PlainObject}
 */
export function getWorkFiles(files: string): PlainObject;
declare class PluginsForWork {
    constructor({ pluginsInWork, pluginFieldMappings, pluginObjects }: {
        pluginsInWork: any;
        pluginFieldMappings: any;
        pluginObjects: any;
    });
    pluginsInWork: any;
    pluginFieldMappings: any;
    pluginObjects: any;
    getPluginObject(pluginName: any): any;
    iterateMappings(cb: any): void;
    processTargetLanguages(applicableFields: any, cb: any): boolean;
    isPluginField({ namespace, field }: {
        namespace: any;
        field: any;
    }): any;
    getPluginFieldParts({ namespace, field }: {
        namespace: any;
        field: any;
    }): any[];
}
declare class Metadata {
    constructor({ metadataObj }: {
        metadataObj: any;
    });
    metadataObj: any;
    getFieldLang(field: any): any;
    getFieldMatchesLocale({ namespace, preferredLocale, schemaItems, pluginsForWork }: {
        namespace: any;
        preferredLocale: any;
        schemaItems: any;
        pluginsForWork: any;
    }): (field: any) => any;
}
export {};
//# sourceMappingURL=WorkInfo-es.d.ts.map