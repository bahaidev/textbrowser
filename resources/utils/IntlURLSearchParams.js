/**
 * @file Note that this should be kept as a polyglot client-server file.
 */
/**
 * @this {IntlURLSearchParams}
 * @param {string} param
 * @param {boolean} [skip]
 * @throws {Error}
 * @returns {string}
 */
function _prepareParam (param, skip) {
  if (skip || !this.localizeParamNames) { // (lang)
    return param;
  }

  // start, end, toggle
  const endNums = /\d+(-\d+)?$/;
  const indexed = param.match(endNums);
  if (!this.l10n) {
    throw new Error('l10n is not defined');
  }
  if (indexed) {
    // Todo: We could i18nize numbers as well
    return this.l10n(['params', 'indexed', param.replace(endNums, '')]) + indexed[0];
  }
  return /** @type {string} */ (this.l10n(['params', param]));
}

class IntlURLSearchParams {
  /**
   * @param {object} [options]
   * @param {import('intl-dom').I18NCallback} [options.l10n]
   * @param {URLSearchParams|string} [options.params]
   */
  constructor ({l10n, params} = {}) {
    this.l10n = l10n;
    this.localizeParamNames = false;
    if (!params) {
      params = location.hash.slice(1);
    }
    if (typeof params === 'string') {
      params = new URLSearchParams(params);
    }
    /** @type {URLSearchParams} */
    this.params = params;
  }
  /**
   * @param {string} param
   * @param {boolean} [skip]
   * @returns {string|null}
   */
  get (param, skip) {
    return this.params.get(_prepareParam.call(this, param, skip));
  }
  /**
   * @param {string} param
   * @param {boolean} skip
   * @returns {string[]}
   */
  getAll (param, skip) {
    return this.params.getAll(_prepareParam.call(this, param, skip));
  }
  /**
   * @param {string} param
   * @param {boolean} [skip]
   * @returns {boolean}
   */
  has (param, skip) {
    return this.params.has(_prepareParam.call(this, param, skip));
  }
  /**
   * @param {string} param
   * @param {boolean} skip
   * @returns {void}
   */
  delete (param, skip) {
    return this.params.delete(_prepareParam.call(this, param, skip));
  }
  /**
   * @param {string} param
   * @param {string} value
   * @param {boolean} [skip]
   * @returns {void}
   */
  set (param, value, skip) {
    return this.params.set(_prepareParam.call(this, param, skip), value);
  }
  /**
   * @param {string} param
   * @param {string} value
   * @param {boolean} skip
   * @returns {void}
   */
  append (param, value, skip) {
    return this.params.append(_prepareParam.call(this, param, skip), value);
  }
  toString () {
    return this.params.toString();
  }
}
export default IntlURLSearchParams;
