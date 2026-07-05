/**
 * @typedef {() => Promise<{
 *   groupName: string | Text | DocumentFragment,
 *   worksToFields: {
 *     workName: string | Text | DocumentFragment,
 *     shortcut: string,
 *     fieldAliasOrNames: (
 *       string|string[]|import('../server/main.js').LocalizationStrings
 *     )[]|undefined
 *   }[]
 * }[]>} GetFieldAliasOrNames
 */
/**
 * @typedef {(innerArg: {
 *   form: HTMLFormElement,
 *   random: {
 *     checked: boolean
 *   },
 *   checkboxes: HTMLInputElement[],
 *   type: string,
 *   fieldAliasOrNames?: string[],
 *   workName?: string,
 * }) => string} SerializeParamsAsURL
 */
/**
 * @typedef {(
 *   key: string|string[],
 *   substitutions?: Record<string, string>
 * ) => string|Text|DocumentFragment} LDirectional
 */
/**
 * @typedef {(
 *   key: string,
 *   tag: string,
 *   attr: string,
 *   atts: import('jamilih').JamilihAttributes,
 *   children?: import('jamilih').JamilihChildren
 * ) => import('jamilih').JamilihArray} LElement
 */
/**
 * @this {import('./index.js').default}
 * @param {{
 *   l: import('intl-dom').I18NCallback,
 *   languageParam: string,
 *   lang: string[],
 *   preferredLocale: string,
 *   languages: import('./utils/Languages.js').Languages,
 *   fallbackLanguages: string[],
 *   $p: import('./utils/IntlURLSearchParams.js').default
 * }} cfg
 */
export default function workDisplay(this: import("./index.js").default, { l, languageParam, lang, preferredLocale, languages, fallbackLanguages, $p }: {
    l: import("intl-dom").I18NCallback;
    languageParam: string;
    lang: string[];
    preferredLocale: string;
    languages: import("./utils/Languages.js").Languages;
    fallbackLanguages: string[];
    $p: import("./utils/IntlURLSearchParams.js").default;
}): Promise<void>;
export type GetFieldAliasOrNames = () => Promise<{
    groupName: string | Text | DocumentFragment;
    worksToFields: {
        workName: string | Text | DocumentFragment;
        shortcut: string;
        fieldAliasOrNames: (string | string[] | import("../server/main.js").LocalizationStrings)[] | undefined;
    }[];
}[]>;
export type SerializeParamsAsURL = (innerArg: {
    form: HTMLFormElement;
    random: {
        checked: boolean;
    };
    checkboxes: HTMLInputElement[];
    type: string;
    fieldAliasOrNames?: string[];
    workName?: string;
}) => string;
export type LDirectional = (key: string | string[], substitutions?: Record<string, string>) => string | Text | DocumentFragment;
export type LElement = (key: string, tag: string, attr: string, atts: import("jamilih").JamilihAttributes, children?: import("jamilih").JamilihChildren) => import("jamilih").JamilihArray;
//# sourceMappingURL=workDisplay.d.ts.map