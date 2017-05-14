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

function IntlURLSearchParams (config) {
    config = config || {};
    this.l10n = config.l10n;
    let params = config.params;
    if (!params) {
        params = location.hash.slice(1);
    }
    if (typeof params === 'string') {
        params = new URLSearchParams(params);
    }
    this.params = params;
}
IntlURLSearchParams.prototype.get = function (param, skip) {
    return this.params.get(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.getAll = function (param, skip) {
    return this.params.getAll(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.has = function (param, skip) {
    return this.params.has(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.delete = function (param, skip) {
    return this.params.delete(_prepareParam.call(this, param, skip));
};
IntlURLSearchParams.prototype.set = function (param, value, skip) {
    return this.params.set(_prepareParam.call(this, param, skip), value);
};
IntlURLSearchParams.prototype.append = function (param, value, skip) {
    return this.params.append(_prepareParam.call(this, param, skip), value);
};
IntlURLSearchParams.prototype.toString = function () {
    return this.params.toString();
};
