declare namespace _default {
    /**
     * @param {{
     *   fallbackDirection: "ltr"|"rtl",
     *   message: string
     * }} cfg
     * @returns {import('jamilih').JamilihArray}
     */
    function bdo({ fallbackDirection, message }: {
        fallbackDirection: "ltr" | "rtl";
        message: string;
    }): import("jamilih").JamilihArray;
    function columnsTable({ lDirectional, fieldInfo, $p, lElement, lIndexedParam, l, fieldMatchesLocale }: {
        lDirectional: import("../workDisplay.js").LDirectional;
        fieldInfo: import("../utils/WorkInfo.js").FieldInfo;
        $p: import("../utils/IntlURLSearchParams.js").default;
        lElement: import("../workDisplay.js").LElement;
        lIndexedParam: (key: string) => string;
        l: import("intl-dom").I18NCallback;
        fieldMatchesLocale: (field: string) => boolean;
    }): import("jamilih").JamilihArray;
    function advancedFormatting({ lDirectional, lParam, l, lOption, lElement, $p, hideFormattingSection }: {
        lDirectional: import("../workDisplay.js").LDirectional;
        lParam: (key: string) => string;
        l: import("intl-dom").I18NCallback;
        lOption: LOption;
        lElement: import("../workDisplay.js").LElement;
        $p: import("../utils/IntlURLSearchParams.js").default;
        hideFormattingSection: boolean;
    }): import("jamilih").JamilihArray;
    /**
     * @param {{
     *   lParam: (key: string) => string,
     *   lDirectional: import('../workDisplay.js').LDirectional,
     *   l: import('intl-dom').I18NCallback,
     *   lElement: import('../workDisplay.js').LElement,
     *   $p: import('../utils/IntlURLSearchParams.js').default,
     *   serializeParamsAsURL: import('../workDisplay.js').SerializeParamsAsURL,
     *   content: import('jamilih').JamilihArray[]
     * }} cfg
     * @returns {void}
     */
    function addRandomFormFields({ lParam, lDirectional, l, lElement, $p, serializeParamsAsURL, content }: {
        lParam: (key: string) => string;
        lDirectional: import("../workDisplay.js").LDirectional;
        l: import("intl-dom").I18NCallback;
        lElement: import("../workDisplay.js").LElement;
        $p: import("../utils/IntlURLSearchParams.js").default;
        serializeParamsAsURL: import("../workDisplay.js").SerializeParamsAsURL;
        content: import("jamilih").JamilihArray[];
    }): void;
    function getPreferences({ paramsSetter, replaceHash, getFieldAliasOrNames, work, langs, languageI18n, l, localizeParamNames, namespace, hideFormattingSection, preferencesPlugin }: {
        paramsSetter: ParamsSetter;
        replaceHash: (paramsCopy: URLSearchParams) => string;
        getFieldAliasOrNames: import("../workDisplay.js").GetFieldAliasOrNames;
        work: string;
        langs: import("../../server/main.js").LanguageInfo[];
        languageI18n: (code: string) => string;
        l: import("intl-dom").I18NCallback;
        localizeParamNames: boolean;
        namespace: string;
        hideFormattingSection: boolean;
        preferencesPlugin?: PreferencesPlugin;
    }): import("jamilih").JamilihArray;
    /**
     * @param {{
     *   browseFields: import('../utils/Metadata.js').BrowseFields,
     *   fieldInfo: import('../utils/WorkInfo.js').FieldInfo,
     *   i: number,
     *   lDirectional: (
     *     key: string|string[],
     *     substitutions?: Record<string, string>
     *   ) => string|Text|DocumentFragment,
     *   lIndexedParam: (key: string) => string,
     *   $p: import('../utils/IntlURLSearchParams.js').default,
     *   content: import('jamilih').JamilihArray[]
     * }} cfg
     * @returns {void}
     */
    function addBrowseFields({ browseFields, fieldInfo, lDirectional, i, lIndexedParam, $p, content }: {
        browseFields: import("../utils/Metadata.js").BrowseFields;
        fieldInfo: import("../utils/WorkInfo.js").FieldInfo;
        i: number;
        lDirectional: (key: string | string[], substitutions?: Record<string, string>) => string | Text | DocumentFragment;
        lIndexedParam: (key: string) => string;
        $p: import("../utils/IntlURLSearchParams.js").default;
        content: import("jamilih").JamilihArray[];
    }): void;
    /**
     * @param {{
     *   workI18n: import('intl-dom').I18NCallback,
     *   languageParam: string,
     *   l: import('intl-dom').I18NCallback,
     *   namespace: string,
     *   heading: string,
     *   languageI18n: (code: string) => string,
     *   langs: import('../../server/main.js').LanguageInfo[],
     *   fieldInfo: import('../utils/WorkInfo.js').FieldInfo,
     *   localizeParamNames: boolean,
     *   serializeParamsAsURL: import('../workDisplay.js').SerializeParamsAsURL,
     *   paramsSetter: ParamsSetter,
     *   replaceHash: (paramsCopy: URLSearchParams) => string,
     *   getFieldAliasOrNames: import('../workDisplay.js').GetFieldAliasOrNames,
     *   hideFormattingSection: boolean,
     *   $p: import('../utils/IntlURLSearchParams.js').default,
     *   metadataObj: import('../utils/Metadata.js').MetadataObj,
     *   lParam: (key: string) => string,
     *   lElement: import('../workDisplay.js').LElement,
     *   lDirectional: import('../workDisplay.js').LDirectional,
     *   lIndexedParam: (key: string) => string,
     *   fieldMatchesLocale: (field: string) => boolean,
     *   preferredLocale: string,
     *   schemaItems: {
     *     title: string,
     *     type: string
     *   }[],
     *   content: import('jamilih').JamilihArray[],
     *   groups: import('../utils/WorkInfo.js').FileGroup[],
     *   preferencesPlugin?: PreferencesPlugin
     * }} cfg
     * @returns {void}
    */
    function main({ l, namespace, heading, languageI18n, langs, fieldInfo, localizeParamNames, serializeParamsAsURL, paramsSetter, replaceHash, getFieldAliasOrNames, hideFormattingSection, $p, lParam, lElement, lDirectional, lIndexedParam, fieldMatchesLocale, content, preferencesPlugin }: {
        workI18n: import("intl-dom").I18NCallback;
        languageParam: string;
        l: import("intl-dom").I18NCallback;
        namespace: string;
        heading: string;
        languageI18n: (code: string) => string;
        langs: import("../../server/main.js").LanguageInfo[];
        fieldInfo: import("../utils/WorkInfo.js").FieldInfo;
        localizeParamNames: boolean;
        serializeParamsAsURL: import("../workDisplay.js").SerializeParamsAsURL;
        paramsSetter: ParamsSetter;
        replaceHash: (paramsCopy: URLSearchParams) => string;
        getFieldAliasOrNames: import("../workDisplay.js").GetFieldAliasOrNames;
        hideFormattingSection: boolean;
        $p: import("../utils/IntlURLSearchParams.js").default;
        metadataObj: import("../utils/Metadata.js").MetadataObj;
        lParam: (key: string) => string;
        lElement: import("../workDisplay.js").LElement;
        lDirectional: import("../workDisplay.js").LDirectional;
        lIndexedParam: (key: string) => string;
        fieldMatchesLocale: (field: string) => boolean;
        preferredLocale: string;
        schemaItems: {
            title: string;
            type: string;
        }[];
        content: import("jamilih").JamilihArray[];
        groups: import("../utils/WorkInfo.js").FileGroup[];
        preferencesPlugin?: PreferencesPlugin;
    }): void;
}
export default _default;
export type LOption = (key: string[], atts: import("jamilih").JamilihAttributes) => import("jamilih").JamilihArray;
export type ParamsSetter = (info: {
    form: HTMLFormElement;
    random: {
        checked: boolean;
    };
    checkboxes: HTMLInputElement[];
    type: string;
    fieldAliasOrNames?: string[];
    workName: string;
}) => URLSearchParams;
export type PreferencesPlugin = (cfg: {
    $: typeof $;
    l: import("intl-dom").I18NCallback;
    jml: typeof jml;
    paramsSetter: ParamsSetter;
    getDataForSerializingParamsAsURL: () => {
        form: HTMLFormElement;
        random: HTMLInputElement;
        checkboxes: HTMLInputElement[];
    };
    work: string;
    replaceHash: (paramsCopy: URLSearchParams) => string;
    getFieldAliasOrNames: import("../workDisplay.js").GetFieldAliasOrNames;
}) => import("jamilih").JamilihArray;
import { $ } from 'jamilih';
import { jml } from 'jamilih';
//# sourceMappingURL=workDisplay.d.ts.map