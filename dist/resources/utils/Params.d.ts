export function replaceHash(paramsCopy: URLSearchParams): string;
export function getSerializeParamsAsURL(args: {
    l: import("intl-dom").I18NCallback;
    lParam: (key: string) => string;
    $p: import("./IntlURLSearchParams.js").default;
}): (innerArg: {
    form: HTMLFormElement;
    random: {
        checked: boolean;
    };
    checkboxes: HTMLInputElement[];
    type: string;
    fieldAliasOrNames?: string[];
    workName?: string;
}) => string;
export function getParamsSetter({ l, lParam, $p }: {
    l: import("intl-dom").I18NCallback;
    lParam: (key: string) => string;
    $p: import("./IntlURLSearchParams.js").default;
}): ({ form, random, checkboxes, type, fieldAliasOrNames, workName }: {
    form: HTMLFormElement;
    random: {
        checked: boolean;
    };
    checkboxes: HTMLInputElement[];
    type: string;
    fieldAliasOrNames?: string[];
    workName?: string;
}) => URLSearchParams;
//# sourceMappingURL=Params.d.ts.map