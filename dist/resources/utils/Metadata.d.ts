export function getMetaProp(lang: string[], metadataObj: MetadataObj, properties: string | string[], allowObjects?: boolean): string | string[] | import("../../server/main.js").LocalizationStrings;
export function getMetadata(file: string, property: string, basePath?: string): Promise<MetadataObj | SchemaObj>;
export function getFieldNameAndValueAliases({ field, schemaItems, metadataObj, getFieldAliasOrName, lang }: GetFieldNameAndValueAliasesOptions): {
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
export function getBrowseFieldData({ metadataObj, schemaItems, getFieldAliasOrName, lang, callback }: GetBrowseFieldDataOptions): void;
export class Metadata {
    /**
     * @param {{
     *   metadataObj: MetadataObj
     * }} cfg
     */
    constructor({ metadataObj }: {
        metadataObj: MetadataObj;
    });
    metadataObj: MetadataObj;
    /**
     * @param {string} field
     * @returns {string|undefined}
     */
    getFieldLang(field: string): string | undefined;
    /**
     * @param {{
     *   namespace: string,
     *   preferredLocale: string,
     *   schemaItems: {
     *     title: string,
     *     type: string
     *   }[],
     *   pluginsForWork: import('./Plugin.js').PluginsForWork
     * }} cfg
     * @returns {(field: string) => boolean}
     */
    getFieldMatchesLocale({ namespace, preferredLocale, schemaItems, pluginsForWork }: {
        namespace: string;
        preferredLocale: string;
        schemaItems: {
            title: string;
            type: string;
        }[];
        pluginsForWork: import("./Plugin.js").PluginsForWork;
    }): (field: string) => boolean;
}
export type FieldValueAliases = {
    [key: string]: string | Integer | (string | Integer)[] | {
        [key: string]: string | Integer;
    };
};
export type MetadataObj = {
    "localization-strings": import("../../server/main.js").LocalizationStrings;
    table: {
        browse_fields: (string | {
            name?: string;
            set: string[];
            presort?: boolean;
        })[];
    };
    fields: {
        [key: string]: {
            prefer_alias: boolean | string;
            name: string | {
                localeKey: string;
            };
            alias: string | {
                localeKey: string;
            };
            lang: string;
            "fieldvalue-aliases": FieldValueAliases;
        };
    };
};
export type SchemaObj = {
    items: {
        items: {
            title: string;
            type: string;
            format?: string;
        }[];
    };
};
export type GetFieldNameAndValueAliasesOptions = {
    field: string;
    schemaItems: {
        title: string;
        type: string;
        enum?: string[];
    }[];
    metadataObj: MetadataObj;
    getFieldAliasOrName: (field: string) => string | string[] | import("../../server/main.js").LocalizationStrings;
    lang: string[];
};
export type Integer = number;
export type BrowseFields = {
    aliases: string[] | null;
    fieldValueAliasMap: FieldValueAliases | null;
    rawFieldValueAliasMap: FieldValueAliases | null;
    fieldName: string;
    fieldSchema: {
        title: string;
        type: string;
        minimum?: Integer;
        maximum?: Integer;
    };
    fieldSchemaIndex: number;
    preferAlias: boolean | string;
    lang: string;
}[];
export type GetBrowseFieldDataOptions = {
    metadataObj: MetadataObj;
    schemaItems: {
        title: string;
        type: string;
    }[];
    getFieldAliasOrName: (field: string) => string | string[] | import("../../server/main.js").LocalizationStrings;
    lang: string[];
    callback: (cfg: {
        setName: string;
        browseFields: BrowseFields;
        i: number;
        presort: boolean | undefined;
    }) => void;
};
//# sourceMappingURL=Metadata.d.ts.map