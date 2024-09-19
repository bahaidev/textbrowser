export { TextBrowser as default };
export type getJSONCallback = (jsonURL: string | string[], cb: SimpleJSONCallback, errBack: SimpleJSONErrback) => Promise<JSON>;
export type PromiseChainErrback = (value: any) => Promise<any> | any;
export type KeyCheckerConverterCallback = (key: string | string[], messageStyle: "plain" | "plainNested" | "rich" | "richNested" | any) => any;
export type Sort = any;
export type SortList = any;
export type List = any;
export type I18NCallback = any;
export type Integer = number;
/**
 * :FormSerialization.Serializer
 */
export type module = (result: PlainObject | string | any, key: string, value: string) => PlainObject | string | any;
export type ResultArray = GenericArray;
export type ChildrenToJMLCallback = (childNodeJML: JamilihArray | JamilihChildType | string, i: Integer) => void;
/**
 * Keep this in sync with `JamilihArray`'s first argument (minus `Document`).
 */
export type JamilihFirstArg = JamilihDoc | JamilihDoctype | JamilihTextNode | JamilihAttributeNode | JamilihOptions | ElementName | HTMLElement | JamilihDocumentFragment;
export type JamilihAppender = (childJML: JamilihArray | JamilihFirstArg | Node | TextNodeString) => void;
export type appender = (childJML: JamilihArray | JamilihFirstArg | Node | TextNodeString) => void;
export type JamilihReturn = HTMLElement | DocumentFragment | Comment | Attr | Text | Document | DocumentType | ProcessingInstruction | CDATASection;
/**
 * Can either be an array of:
 * 1. JamilihAttributes followed by an array of JamilihArrays or Elements.
 *     (Cannot be multiple single JamilihArrays despite TS type).
 * 2. Any number of JamilihArrays.
 */
export type TemplateJamilihArray = [(JamilihAttributes | JamilihArray | JamilihArray[] | HTMLElement), ...(JamilihArray | JamilihArray[] | HTMLElement)[]];
export type ShadowRootJamilihArrayContainer = (JamilihArray | HTMLElement)[];
export type JamilihShadowRootObject = {
    open?: boolean | ShadowRootJamilihArrayContainer;
    closed?: boolean | ShadowRootJamilihArrayContainer;
    template?: string | HTMLTemplateElement | TemplateJamilihArray;
    content?: ShadowRootJamilihArrayContainer | DocumentFragment;
};
export type XmlnsAttributeObject = {
    [key: string]: string;
};
export type XmlnsAttributeValue = null | XmlnsAttributeObject;
export type DatasetAttributeObject = {
    [key: string]: string | number | null | undefined | DatasetAttributeObject;
};
export type StyleAttributeValue = string | undefined | {
    [key: string]: string | null;
};
export type EventHandler = (this: HTMLElement, event: Event & {
    target: HTMLElement;
}) => void;
export type OnAttributeObject = {
    [key: string]: EventHandler | [EventHandler, boolean];
};
export type OnAttribute = {
    $on?: OnAttributeObject | null;
};
export type BooleanAttribute = boolean;
export type HandlerAttributeValue = ((this: HTMLElement, event?: Event) => void);
export type OnHandlerObject = {
    [key: string]: HandlerAttributeValue;
};
export type StringifiableNumber = number;
export type JamilihDocumentType = {
    name: string;
    systemId?: string;
    publicId?: string;
};
export type DefineOptions = string | {
    extends?: string;
};
export type DefineMixin = {
    [key: string]: string | number | boolean | ((this: DefineMixin, ...args: any[]) => any);
};
export type DefineConstructor = {
    new (): HTMLElement;
    prototype: HTMLElement & {
        [key: string]: any;
    };
};
export type DefineUserConstructor = (this: HTMLElement) => void;
export type DefineObjectArray = [DefineConstructor | DefineUserConstructor | DefineMixin, DefineOptions?] | [DefineConstructor | DefineUserConstructor, DefineMixin?, DefineOptions?];
export type DefineObject = DefineObjectArray | DefineConstructor | DefineMixin | DefineUserConstructor;
export type SymbolObject = {
    elem?: HTMLElement;
    [key: string]: any;
};
export type SymbolArray = [symbol | string, ((this: HTMLElement, ...args: any[]) => any) | SymbolObject];
export type NullableAttributeValue = null | undefined;
export type PluginValue = [string, object] | string | {
    [key: string]: any;
};
export type JamilihAttValue = (string | NullableAttributeValue | BooleanAttribute | JamilihArray | JamilihShadowRootObject | StringifiableNumber | JamilihDocumentType | JamilihDocument | XmlnsAttributeValue | OnAttributeObject | HandlerAttributeValue | DefineObject | SymbolArray | PluginReference | PluginValue);
export type DataAttributeObject = {
    [key: string]: string | number | ((this: HTMLElement, ...args: any[]) => any);
};
export type DataAttribute = {
    $data?: true | string[] | Map<any, any> | WeakMap<any, any> | DataAttributeObject | [undefined, DataAttributeObject] | [Map<any, any> | WeakMap<any, any> | undefined, DataAttributeObject];
};
export type DatasetAttribute = {
    dataset?: DatasetAttributeObject;
};
export type StyleAttribute = {
    style?: StyleAttributeValue;
};
export type JamilihShadowRootAttribute = {
    $shadow?: JamilihShadowRootObject;
};
export type DefineAttribute = {
    is?: string | null;
    $define?: DefineObject;
};
export type CustomAttribute = {
    $custom?: {
        [key: string]: any;
    };
};
export type SymbolAttribute = {
    $symbol?: SymbolArray;
};
export type XmlnsAttribute = {
    xmlns?: string | null | XmlnsAttributeObject;
};
/**
 * `OnHandlerObject &` wasn't working, so added `HandlerAttributeValue`.
 */
export type JamilihAttributes = DataAttribute & StyleAttribute & JamilihShadowRootAttribute & DefineAttribute & DatasetAttribute & CustomAttribute & SymbolAttribute & OnAttribute & XmlnsAttribute & Partial<JamilihAttributeNode> & Partial<JamilihTextNode> & Partial<JamilihDoc> & Partial<JamilihDoctype> & {
    [key: string]: JamilihAttValue | HandlerAttributeValue;
};
export type JamilihDocument = {
    title?: string;
    childNodes?: JamilihChildType[];
    $DOCTYPE?: JamilihDocumentType;
    head?: JamilihChildren;
    body?: JamilihChildren;
};
export type JamilihDoc = {
    $document: JamilihDocument;
};
export type JamilihDoctype = {
    $DOCTYPE: JamilihDocumentType;
};
export type JamilihDocumentFragmentContent = JamilihArray | TextNodeString | HTMLElement;
export type JamilihDocumentFragment = {
    "#": JamilihDocumentFragmentContent[];
};
export type ElementName = string;
export type TextNodeString = string | number;
export type PluginReference = {
    [key: string]: string;
};
export type JamilihChildren = (JamilihArray | TextNodeString | HTMLElement | Comment | ProcessingInstruction | Text | DocumentFragment | JamilihProcessingInstruction | JamilihDocumentFragment | PluginReference)[];
export type JamilihFirstArgument = Document | ElementName | HTMLElement | DocumentFragment | JamilihDocumentFragment | JamilihDoc | JamilihDoctype | JamilihTextNode | JamilihAttributeNode;
/**
 * This would be clearer with overrides, but using as typedef.
 *
 * The optional 0th argument is an Jamilih options object or fragment.
 *
 * The first argument is the element to create (by lower-case name) or DOM element.
 *
 * The second optional argument are attributes to add with the key as the
 *   attribute name and value as the attribute value.
 * The third optional argument are an array of children for this element
 *   (but raw DOM elements are required to be specified within arrays since
 *   could not otherwise be distinguished from siblings being added).
 * The fourth optional argument are a sequence of sibling Elements, represented
 *   as DOM elements, or string/attributes/children sequences.
 * The fifth optional argument is the parent to which to attach the element
 *   (always the last unless followed by null, in which case it is the
 *   second-to-last).
 * The sixth last optional argument is null, used to indicate an array of elements
 *   should be returned.
 */
export type JamilihArray = [JamilihOptions | JamilihFirstArgument, (JamilihFirstArgument | JamilihAttributes | JamilihChildren | HTMLElement | ShadowRoot | null)?, (JamilihAttributes | JamilihChildren | HTMLElement | ShadowRoot | ElementName | null)?, ...(JamilihAttributes | JamilihChildren | HTMLElement | ShadowRoot | ElementName | null)[]];
export type JamilihArrayPostOptions = [(string | HTMLElement | ShadowRoot), (JamilihArray[] | JamilihAttributes | HTMLElement | ShadowRoot | null)?, ...(JamilihArray[] | HTMLElement | JamilihAttributes | ShadowRoot | null)[]];
export type MapWithRoot = {
    root: [Map<HTMLElement, any> | WeakMap<HTMLElement, any>, any];
    [key: string]: [Map<HTMLElement, any> | WeakMap<HTMLElement, any>, any];
};
export type TraversalState = "root" | "attributeValue" | "element" | "fragment" | "children" | "fragmentChildren";
export type JamilihOptions = {
    $state?: TraversalState | undefined;
    $plugins?: JamilihPlugin[] | undefined;
    $map?: [Map<HTMLElement, any> | WeakMap<HTMLElement, any>, any] | MapWithRoot | undefined;
};
export type Langs = PlainObject;
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
export type HTMLWindow = Window & {
    DocumentFragment: any;
};
export type ArbitraryValue = any;
export type PluginSettings = {
    element: Document | HTMLElement | DocumentFragment;
    attribute: {
        name: string | null;
        value: JamilihAttValue;
    };
    opts: JamilihOptions;
};
export type JamilihPlugin = {
    name: string;
    set: (opts: PluginSettings) => string | Promise<void>;
};
export type ValueOf<T> = T[keyof T];
/**
 * Configuration object.
 */
export type ToJmlConfig = {
    /**
     * Whether to output the Jamilih object as a string.
     */
    stringOutput?: boolean | undefined;
    /**
     * If true (the default), will report invalid state errors
     */
    reportInvalidState?: boolean | undefined;
    /**
     * Strip whitespace for text nodes
     */
    stripWhitespace?: boolean | undefined;
};
export type JamilihAttributeNodeValue = [namespace: string | null, name: string, value?: string];
export type JamilihAttributeNode = {
    $attribute: JamilihAttributeNodeValue;
};
export type JamilihTextNode = {
    $text: string;
};
export type JamilihCDATANode = ["![", string];
export type JamilihEntityReference = ["&", string];
export type JamilihProcessingInstruction = [code: "?", target: string, value: string];
export type JamilihComment = [code: "!", value: string];
export type Entity = {
    nodeType: number;
    nodeName: string;
};
export type JamilihChildType = JamilihArray | JamilihDoctype | JamilihCDATANode | JamilihEntityReference | JamilihProcessingInstruction | JamilihComment | JamilihDocumentFragment;
export type JamilihType = JamilihDoc | JamilihAttributeNode | JamilihChildType;
export type MapAndElementArray = [JamilihWeakMap | JamilihMap, HTMLElement];
export type MapCommand = ((elem: HTMLElement, ...args: any[]) => void) | {
    [key: string]: (elem: HTMLElement, ...args: any[]) => void;
};
declare class TextBrowser {
    constructor(options: any);
    site: any;
    stylesheets: any;
    allowPlugins: any;
    dynamicBasePath: any;
    trustFormatHTML: any;
    requestPersistentStorage: any;
    localizeParamNames: any;
    hideFormattingSection: boolean;
    preferencesPlugin: any;
    interlinearSeparator: any;
    showEmptyInterlinear: any;
    showTitleOnSingleInterlinear: any;
    noDynamic: any;
    skipIndexedDB: any;
    init(): Promise<void>;
    _stylesheetElements: HTMLLinkElement[] | undefined;
    langData: any;
    siteData: any;
    getWorkData(opts: any): Promise<{
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
    }> | undefined;
    getDirectionForLanguageCode(code: any): any;
    getFieldNameAndValueAliases(args: any): {
        aliases: null;
        fieldValueAliasMap: null;
        rawFieldValueAliasMap: null;
        fieldName: any;
        fieldSchema: any;
        fieldSchemaIndex: any;
        preferAlias: any;
        lang: any;
    };
    getBrowseFieldData(args: any): void;
    paramChange(): Promise<void>;
    $p: IntlURLSearchParams | undefined;
    lang: any[] | undefined;
    l10n: any;
    workDisplay: typeof workDisplay;
    resultsDisplayClient: (args: any) => Promise<void>;
}
/**
 * Element-aware wrapper for `WeakMap`.
 * @extends {WeakMap<any>}
 */
declare class JamilihWeakMap extends WeakMap<any, any> {
    constructor(entries?: readonly (readonly [any, any])[] | null | undefined);
    constructor(iterable: Iterable<readonly [any, any]>);
    /**
     * @param {HTMLElement} element
     * @param {ArbitraryValue} value
     * @returns {ArbitraryValue}
     */
    set(element: HTMLElement, value: ArbitraryValue): ArbitraryValue;
    /**
     * @param {string|HTMLElement} element
     * @param {string} methodName
     * @param {...ArbitraryValue} args
     * @returns {ArbitraryValue}
     */
    invoke(element: string | HTMLElement, methodName: string, ...args: ArbitraryValue[]): ArbitraryValue;
}
/**
 * Element-aware wrapper for `Map`.
 */
declare class JamilihMap extends Map<any, any> {
    constructor();
    constructor(entries?: readonly (readonly [any, any])[] | null | undefined);
    constructor();
    constructor(iterable?: Iterable<readonly [any, any]> | null | undefined);
    /**
     * @param {string|HTMLElement} element
     * @param {ArbitraryValue} value
     * @returns {ArbitraryValue}
     */
    set(element: string | HTMLElement, value: ArbitraryValue): ArbitraryValue;
    /**
     * @param {string|HTMLElement} element
     * @param {string} methodName
     * @param {...ArbitraryValue} args
     * @returns {ArbitraryValue}
     */
    invoke(element: string | HTMLElement, methodName: string, ...args: ArbitraryValue[]): ArbitraryValue;
}
declare class PluginsForWork {
    constructor(_ref2: any);
    pluginsInWork: any;
    pluginFieldMappings: any;
    pluginObjects: any;
    getPluginObject(pluginName: any): any;
    iterateMappings(cb: any): void;
    processTargetLanguages(applicableFields: any, cb: any): boolean;
    isPluginField(_ref6: any): any;
    getPluginFieldParts(_ref7: any): any[];
}
declare class Metadata {
    constructor(_ref4: any);
    metadataObj: any;
    getFieldLang(field: any): any;
    getFieldMatchesLocale(_ref5: any): (field: any) => any;
}
declare class IntlURLSearchParams {
    constructor(...args: any[]);
    l10n: any;
    params: any;
    get(param: any, skip: any): any;
    getAll(param: any, skip: any): any;
    has(param: any, skip: any): any;
    delete(param: any, skip: any): any;
    set(param: any, value: any, skip: any): any;
    append(param: any, value: any, skip: any): any;
    toString(): any;
}
declare function workDisplay(_ref: any): Promise<void>;
//# sourceMappingURL=index-es.d.ts.map