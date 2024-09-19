// Todo: remember this locales choice by cookie?

/**
 * @param {{
 *   namespace: string,
 *   preferredLocale: string
 * }} cfg
 */
export const getPreferredLanguages = ({namespace, preferredLocale}) => {
  // Todo: Add to this optionally with one-off tag input box
  // Todo: Switch to fallbackLanguages so can default to
  //    navigator.languages?
  const langCodes = localStorage.getItem(namespace + '-langCodes');
  const lngs = /** @type {string[]} */ (
    (langCodes && JSON.parse(langCodes)) || [preferredLocale]
  );

  /** @type {string[]} */
  const langArr = [];
  lngs.forEach((lng) => {
    // Todo: Check for multiple separate hyphenated
    //   groupings (for each supplied language)
    const higherLocale = lng.replace(/-.*$/, '');
    if (higherLocale === lng) {
      langArr.push(lng);
    } else {
      langArr.push(lng, higherLocale);
    }
  });
  return langArr;
};

/**
 * @classdesc Note that this should be kept as a polyglot client-server class.
 */
export class Languages {
  /**
   * @param {{
   *   langData: import('../../server/main.js').LanguagesData
   * }} cfg
   */
  constructor ({langData}) {
    this.langData = langData;
  }
  /**
   * @param {string} langCode
   * @returns {{
   *   languages: {
   *     [key: string]: string
   *   }
   * }}
   */
  localeFromLangData (langCode) {
    return (
      /**
       * @type {{
       *   languages: {
       *     [key: string]: string
       *   }
       * }}
       */ (
        this.langData['localization-strings'][langCode]
      )
    );
  }
  /**
   * @param {string} code
   * @returns {string}
   */
  getLanguageFromCode (code) {
    return this.localeFromLangData(code).languages[code];
    // Could add something like this in place or as fallback, though need to pass in locale
    // || new Intl.DisplayNames([locale], {type: 'language'}).of(code);
  }

  /**
   * @param {{
   *   pluginName: string,
   *   workI18n: import('intl-dom').I18NCallback,
   *   targetLanguage: string,
   *   applicableFieldI18N: string|string[],
   *   meta: {
   *     [key: string]: string
   *   },
   *   metaApplicableField: {
   *     [key: string]: string
   *   },
   * }} cfg
   * @returns {string}
   */
  getFieldNameFromPluginNameAndLocales ({
    pluginName,
    // locales,
    workI18n, targetLanguage, applicableFieldI18N, meta, metaApplicableField
  }) {
    return /** @type {string} */ (workI18n(['plugins', pluginName, 'fieldname'], {
      ...meta,
      ...metaApplicableField,
      applicableField: applicableFieldI18N,
      targetLanguage: targetLanguage
        ? this.getLanguageFromCode(targetLanguage)
        : ''
    }, {
      // We provide more than may be desired by the plugin
      throwOnExtraSuppliedFormatters: false
    }));
  }

  /**
   * @param {{$p: import('./IntlURLSearchParams.js').default}} cfg
   * @returns {{
   *   lang: string[],
   *   langs: import('../../server/main.js').LanguageInfo[],
   *   languageParam: string|null,
   *   fallbackLanguages: string[]
   * }}
   */
  getLanguageInfo ({$p}) {
    const langs = this.langData.languages;
    /**
     * @param {string} lcl
     */
    const localePass = (lcl) => {
      return langs.some(({code}) => code === lcl) ? lcl : false;
    };
    const languageParam = $p.get('lang', true);
    // Todo: We could (unless overridden by another button) assume the
    //         browser language based on fallbackLanguages instead
    //         of giving a choice
    const navLangs = navigator.languages.filter(localePass);
    const fallbackLanguages = navLangs.length
      ? navLangs
      : [localePass(navigator.language) || 'en-US'];
    // We need a default to display a default title
    const language = languageParam || fallbackLanguages[0];

    const preferredLangs = language.split('.');
    const lang = [...preferredLangs, ...fallbackLanguages];

    return {
      lang,
      langs,
      languageParam,
      fallbackLanguages
    };
  }
}
