export default IntlURLSearchParams;
declare class IntlURLSearchParams {
    /**
     * @param {object} [options]
     * @param {import('intl-dom').I18NCallback} [options.l10n]
     * @param {URLSearchParams|string} [options.params]
     */
    constructor({ l10n, params }?: {
        l10n?: import("intl-dom").I18NCallback<string | Text | DocumentFragment> | undefined;
        params?: string | URLSearchParams | undefined;
    } | undefined);
    l10n: import("intl-dom").I18NCallback<string | Text | DocumentFragment> | undefined;
    localizeParamNames: boolean;
    /** @type {URLSearchParams} */
    params: URLSearchParams;
    /**
     * @param {string} param
     * @param {boolean} [skip]
     * @returns {string|null}
     */
    get(param: string, skip?: boolean | undefined): string | null;
    /**
     * @param {string} param
     * @param {boolean} skip
     * @returns {string[]}
     */
    getAll(param: string, skip: boolean): string[];
    /**
     * @param {string} param
     * @param {boolean} [skip]
     * @returns {boolean}
     */
    has(param: string, skip?: boolean | undefined): boolean;
    /**
     * @param {string} param
     * @param {boolean} skip
     * @returns {void}
     */
    delete(param: string, skip: boolean): void;
    /**
     * @param {string} param
     * @param {string} value
     * @param {boolean} [skip]
     * @returns {void}
     */
    set(param: string, value: string, skip?: boolean | undefined): void;
    /**
     * @param {string} param
     * @param {string} value
     * @param {boolean} skip
     * @returns {void}
     */
    append(param: string, value: string, skip: boolean): void;
    toString(): string;
}
//# sourceMappingURL=IntlURLSearchParams.d.ts.map