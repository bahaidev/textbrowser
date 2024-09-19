export type LocaleObject = {
    submit: string;
    cancel: string;
    ok: string;
};
export type Locales = {
    [locale: string]: LocaleObject;
};
export class Dialog {
    /**
     * @param {{
     *  locale?: string,
     *  localeObject?: LocaleObject
     * }} [cfg]
     */
    constructor({ locale, localeObject }?: {
        locale?: string;
        localeObject?: LocaleObject;
    } | undefined);
    localeStrings: LocaleObject;
    /**
     * @param {{
     *  locale?: string,
     *  localeObject?: Partial<LocaleObject>
     * }} cfg
     * @returns {void}
     */
    setLocale({ locale, localeObject }: {
        locale?: string;
        localeObject?: Partial<LocaleObject>;
    }): void;
    /**
     * @typedef {{
     *   atts?: import('jamilih').JamilihAttributes,
     *   children?: import('jamilih').JamilihChildren,
     *   close?: () => void,
     *   remove?: boolean
     * }} MakeDialogCfg
     */
    /**
     * @typedef {MakeDialogCfg & {
     *   submit?: (
     *     this: HTMLElement, args: {e: Event, dialog: HTMLDialogElement}
     *   ) => void,
     *   cancel: (
     *     this: HTMLElement,
     *     args: {
     *       e: Event,
     *       dialog: HTMLDialogElement
     *     }
     *   ) => boolean|void,
     *   cancelClass?: string,
     *   submitClass?: string
     * }} CancelDialogCfg
     */
    /**
     * @param {MakeDialogCfg} cfg
     * @returns {HTMLDialogElement}
     */
    makeDialog({ atts, children, close, remove }: {
        atts?: import("jamilih").JamilihAttributes;
        children?: import("jamilih").JamilihChildren;
        close?: () => void;
        remove?: boolean;
    }): HTMLDialogElement;
    /**
     * @param {CancelDialogCfg} cfg
     * @returns {HTMLDialogElement}
     */
    makeSubmitDialog({ submit, submitClass, ...args }: {
        atts?: import("jamilih").JamilihAttributes;
        children?: import("jamilih").JamilihChildren;
        close?: () => void;
        remove?: boolean;
    } & {
        submit?: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => void;
        cancel: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => boolean | void;
        cancelClass?: string;
        submitClass?: string;
    }): HTMLDialogElement;
    /**
     * @param {CancelDialogCfg} cfg
     * @returns {HTMLDialogElement}
     */
    makeCancelDialog({ submit, cancel, cancelClass, submitClass, ...args }: {
        atts?: import("jamilih").JamilihAttributes;
        children?: import("jamilih").JamilihChildren;
        close?: () => void;
        remove?: boolean;
    } & {
        submit?: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => void;
        cancel: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => boolean | void;
        cancelClass?: string;
        submitClass?: string;
    }): HTMLDialogElement;
    /**
     * @param {string|{message: string, ok?: boolean, submitClass?: string}} message
     * @param {boolean|{ok: boolean}} [ok]
     * @returns {Promise<void>}
     */
    alert(message: string | {
        message: string;
        ok?: boolean;
        submitClass?: string;
    }, ok?: boolean | {
        ok: boolean;
    } | undefined): Promise<void>;
    /**
     * @param {string|Partial<CancelDialogCfg> & {
     *   message: string
     * }} message
     * @returns {Promise<string>}
     */
    prompt(message: string | (Partial<{
        atts?: import("jamilih").JamilihAttributes;
        children?: import("jamilih").JamilihChildren;
        close?: () => void;
        remove?: boolean;
    } & {
        submit?: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => void;
        cancel: (this: HTMLElement, args: {
            e: Event;
            dialog: HTMLDialogElement;
        }) => boolean | void;
        cancelClass?: string;
        submitClass?: string;
    }> & {
        message: string;
    })): Promise<string>;
    /**
     * @param {string|{message: string, submitClass?: string}} message
     * @returns {Promise<void>}
     */
    confirm(message: string | {
        message: string;
        submitClass?: string;
    }): Promise<void>;
}
export const dialogs: Dialog;
//# sourceMappingURL=dialogs.d.ts.map