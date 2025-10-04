export function escapePluginComponent(pluginName: string): string;
export function unescapePluginComponent(pluginName: string | undefined): string | undefined;
export function escapePlugin({ pluginName, applicableField, targetLanguage }: {
    pluginName: string;
    applicableField: string;
    targetLanguage: string;
}): string;
/**
 * @typedef {any} MetaValue
 */
/**
 * @todo Complete
 * @typedef {{
 *   path: string,
 *   onByDefault?: boolean,
 *   lang?: string,
 *   meta?: {[key: string]: string}
 *   getCellData?: (info: {
 *     tr: (string|Integer)[],
 *     tableData: (string|Integer)[][],
 *     i: number,
 *     j: number,
 *     applicableField?: string,
 *     fieldInfo: import('../resultsDisplay.js').FieldInfo,
 *     applicableFieldIdx: number,
 *     applicableFieldText: string|Integer,
 *     fieldLang: string,
 *     getLangDir: (locale: string) => string,
 *     meta: {
 *       [key: string]: string
 *     }|undefined,
 *     metaApplicableField?: {
 *       [key: string]: string
 *     },
 *     $p: import('./IntlURLSearchParams.js').default,
 *     thisObj: import('../index.js').default|import('../../server/main.js').ResultsDisplayServerContext
 *   }) => string|Integer,
 *   done: (info: {
 *     $p: import('./IntlURLSearchParams.js').default,
 *     applicableField: string|undefined,
 *     meta?: {[key: string]: string}
 *     thisObj: import('../index.js').default
 *     j?: number
 *   }) => void,
 *   getTargetLanguage: (info: {
 *     applicableField: string,
 *     targetLanguage?: string,
 *     pluginLang: string,
 *     applicableFieldLang?: string
 *   }) => string,
 *   escapeColumn?: boolean,
 *   getFieldAliasOrName: (info: {
 *     locales: string[],
 *     workI18n: import('intl-dom').I18NCallback,
 *     targetLanguage: string,
 *     applicableField: string,
 *     applicableFieldI18N: string|string[]|import("../../server/main.js").LocalizationStrings,
 *     meta: MetaValue,
 *     metaApplicableField: {
 *       [key: string]: string
 *     },
 *     targetLanguageI18N: string
 *   }) => string
 * }} PluginObject
 */
/**
 * @typedef {{
 *   path: string,
 *   lang: string,
 *   meta: MetaValue,
 *   onByDefault: boolean
 * }} PluginInfo
 */
/**
 * @typedef {{
 *   placement: "end"|number,
 *   'applicable-fields': {
 *     [field: string]: {
 *       targetLanguage: string|string[],
 *       onByDefault: boolean,
 *       meta: {
 *         [key: string]: string
 *       },
 *       [args: string]: {}
 *     }
 *   },
 *   [fieldArgs: string]: {
 *   }
 * }} PluginFieldMappingForWork
 */
export class PluginsForWork {
    /**
     * @param {{
     *   pluginsInWork: [string, PluginInfo][],
     *   pluginFieldMappings: PluginFieldMappingForWork[],
     *   pluginObjects: PluginObject[]
     * }} cfg
     */
    constructor({ pluginsInWork, pluginFieldMappings, pluginObjects }: {
        pluginsInWork: [string, PluginInfo][];
        pluginFieldMappings: PluginFieldMappingForWork[];
        pluginObjects: PluginObject[];
    });
    pluginsInWork: [string, PluginInfo][];
    pluginFieldMappings: PluginFieldMappingForWork[];
    pluginObjects: PluginObject[];
    /**
     * @param {string} pluginName
     * @returns {PluginObject}
     */
    getPluginObject(pluginName: string): PluginObject;
    /**
     * @param {(cfg: {
     *   plugin: PluginObject,
     *   placement: "end"|number,
     *   applicableFields: {
     *     [applicableField: string]: {
     *       targetLanguage: string|string[],
     *       onByDefault: boolean,
     *       meta: MetaValue
     *     }
     *   },
     *   pluginName: string,
     *   pluginLang: string,
     *   onByDefaultDefault: boolean,
     *   meta: {}
     * }) => void} cb
     * @returns {void}
     */
    iterateMappings(cb: (cfg: {
        plugin: PluginObject;
        placement: "end" | number;
        applicableFields: {
            [applicableField: string]: {
                targetLanguage: string | string[];
                onByDefault: boolean;
                meta: MetaValue;
            };
        };
        pluginName: string;
        pluginLang: string;
        onByDefaultDefault: boolean;
        meta: {};
    }) => void): void;
    /**
     * @param {{
     *   [applicableField: string]: {
     *     targetLanguage: string|string[],
     *     onByDefault: boolean,
     *     meta: MetaValue
     *   }
     * }} applicableFields
     * @param {(cfg: {
     *   applicableField: string,
     *   targetLanguage: string,
     *   onByDefault: boolean,
     *   metaApplicableField: {
     *     [key: string]: string
     *   }
     * }) => void} cb
     * @returns {boolean}
     */
    processTargetLanguages(applicableFields: {
        [applicableField: string]: {
            targetLanguage: string | string[];
            onByDefault: boolean;
            meta: MetaValue;
        };
    }, cb: (cfg: {
        applicableField: string;
        targetLanguage: string;
        onByDefault: boolean;
        metaApplicableField: {
            [key: string]: string;
        };
    }) => void): boolean;
    /**
     * @param {{
     *   namespace: string,
     *   field: string
     * }} cfg
     * @returns {boolean}
     */
    isPluginField({ namespace, field }: {
        namespace: string;
        field: string;
    }): boolean;
    /**
     * @param {{
     *   namespace: string,
     *   field: string
     * }} cfg
     * @returns {[string, string|undefined, string|undefined]}
     */
    getPluginFieldParts({ namespace, field }: {
        namespace: string;
        field: string;
    }): [string, string | undefined, string | undefined];
}
export type Integer = number;
export type MetaValue = any;
export type PluginObject = {
    path: string;
    onByDefault?: boolean;
    lang?: string;
    meta?: {
        [key: string]: string;
    };
    getCellData?: (info: {
        tr: (string | Integer)[];
        tableData: (string | Integer)[][];
        i: number;
        j: number;
        applicableField?: string;
        fieldInfo: import("../resultsDisplay.js").FieldInfo;
        applicableFieldIdx: number;
        applicableFieldText: string | Integer;
        fieldLang: string;
        getLangDir: (locale: string) => string;
        meta: {
            [key: string]: string;
        } | undefined;
        metaApplicableField?: {
            [key: string]: string;
        };
        $p: import("./IntlURLSearchParams.js").default;
        thisObj: import("../index.js").default | import("../../server/main.js").ResultsDisplayServerContext;
    }) => string | Integer;
    done: (info: {
        $p: import("./IntlURLSearchParams.js").default;
        applicableField: string | undefined;
        meta?: {
            [key: string]: string;
        };
        thisObj: import("../index.js").default;
        j?: number;
    }) => void;
    getTargetLanguage: (info: {
        applicableField: string;
        targetLanguage?: string;
        pluginLang: string;
        applicableFieldLang?: string;
    }) => string;
    escapeColumn?: boolean;
    getFieldAliasOrName: (info: {
        locales: string[];
        workI18n: import("intl-dom").I18NCallback;
        targetLanguage: string;
        applicableField: string;
        applicableFieldI18N: string | string[] | import("../../server/main.js").LocalizationStrings;
        meta: MetaValue;
        metaApplicableField: {
            [key: string]: string;
        };
        targetLanguageI18N: string;
    }) => string;
};
export type PluginInfo = {
    path: string;
    lang: string;
    meta: MetaValue;
    onByDefault: boolean;
};
export type PluginFieldMappingForWork = {
    placement: "end" | number;
    "applicable-fields": {
        [field: string]: {
            targetLanguage: string | string[];
            onByDefault: boolean;
            meta: {
                [key: string]: string;
            };
            [args: string]: {};
        };
    };
    [fieldArgs: string]: {};
};
//# sourceMappingURL=Plugin.d.ts.map