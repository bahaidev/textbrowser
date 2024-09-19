export function getWorkFiles(files: string): Promise<string[]>;
export function getFilePaths(filesObj: FilesObject, fileGroup: FileGroup, fileData: FileData): {
    file: string;
    schemaFile: string;
    metadataFile: string;
};
export function getWorkData(this: import("../index.js").default, { lang, fallbackLanguages, work, files, allowPlugins, basePath, languages, preferredLocale }: GetWorkDataOptions): Promise<GetWorkDataReturn>;
export type Integer = number;
export type FieldInfo = {
    field: string;
    fieldAliasOrName: string | string[] | import("../../server/main.js").LocalizationStrings;
    onByDefault?: boolean;
    applicableField?: string;
    metaApplicableField?: {
        [key: string]: string;
    };
    fieldLang?: string;
}[];
export type WorkTableContainer = {
    schema: {
        $ref: string;
    };
    metadata: {
        $ref: string;
    };
    data: (Integer | string)[];
};
export type FileData = {
    file: {
        $ref: string;
    };
    schemaFile: string;
    metadataFile: string;
    name: string;
    shortcut: string;
};
export type FileGroup = {
    id: string;
    name: {
        localeKey: "string";
    };
    files: FileData[];
    baseDirectory?: string;
    schemaBaseDirectory?: string;
    metadataBaseDirectory?: string;
    directions: {
        localeKey: "string";
    };
};
/**
 * INCOMPLETE typing.
 */
export type FilesObject = {
    "localization-strings": {
        [key: string]: {};
    };
    groups: FileGroup[];
    plugins: {
        [key: string]: import("./Plugin.js").PluginInfo;
    };
    baseDirectory?: string;
    schemaBaseDirectory?: string;
    metadataBaseDirectory?: string;
    "plugin-field-mapping": PluginFieldMapping;
};
export type PluginFieldMapping = {
    [groups: string]: {
        [works: string]: {
            [fields: string]: import("./Plugin.js").PluginFieldMappingForWork;
        };
    };
};
export type GetWorkDataOptions = {
    lang: string[];
    fallbackLanguages: string[] | undefined;
    work: string;
    files: string;
    allowPlugins: boolean | undefined;
    basePath?: string;
    languages: import("./Languages.js").Languages;
    preferredLocale: string;
};
export type GetWorkDataReturn = {
    fileData: FileData;
    workI18n: import("intl-dom").I18NCallback;
    getFieldAliasOrName: (field: string) => string | string[] | import("../../server/main.js").LocalizationStrings;
    metadataObj: import("./Metadata.js").MetadataObj;
    schemaObj: import("./Metadata.js").SchemaObj;
    schemaItems: {
        title: string;
        type: string;
    }[];
    fieldInfo: FieldInfo;
    pluginsForWork: PluginsForWork | null;
    groupsToWorks: {
        name: string | Text | DocumentFragment;
        workNames: (string | Text | DocumentFragment)[];
        shortcuts: string[];
    }[];
    metadata: Metadata;
};
import { PluginsForWork } from './Plugin.js';
import { Metadata } from './Metadata.js';
//# sourceMappingURL=WorkInfo.d.ts.map