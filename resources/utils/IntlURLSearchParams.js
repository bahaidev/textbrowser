function _prepareParam (param, skip) {
    if (skip || !this.localizeParamNames) { // (lang)
        return param;
    }

    const endNums = /\d+(-\d+)?$/; // start, end, toggle
    const indexed = param.match(endNums);
    if (indexed) {
        // Todo: We could i18nize numbers as well
        return this.l10n(['params', 'indexed', param.replace(endNums, '')]) + indexed[0];
    }
    return this.l10n(['params', param]);
}

class IntlURLSearchParams {
    constructor ({l10n, params} = {}) {
        this.l10n = l10n;
        if (!params) {
            params = location.hash.slice(1); // eslint-disable-line no-undef
        }
        if (typeof params === 'string') {
            params = new URLSearchParams(params); // eslint-disable-line no-undef
        }
        this.params = params;
    }
    get (param, skip) {
        return this.params.get(_prepareParam.call(this, param, skip));
    }
    getAll (param, skip) {
        return this.params.getAll(_prepareParam.call(this, param, skip));
    }
    has (param, skip) {
        return this.params.has(_prepareParam.call(this, param, skip));
    }
    delete (param, skip) {
        return this.params.delete(_prepareParam.call(this, param, skip));
    }
    set (param, value, skip) {
        return this.params.set(_prepareParam.call(this, param, skip), value);
    }
    append (param, value, skip) {
        return this.params.append(_prepareParam.call(this, param, skip), value);
    }
    toString () {
        return this.params.toString();
    }
}
export default IntlURLSearchParams;
