/* eslint-env browser */
// Todo: remember this locales choice by cookie?
export const getPreferredLanguages = ({namespace, preferredLocale}) => {
  // Todo: Add to this optionally with one-off tag input box
  // Todo: Switch to fallbackLanguages so can default to
  //    navigator.languages?
  const langCodes = localStorage.getItem(namespace + '-langCodes');
  const lngs = (langCodes && JSON.parse(langCodes)) || [preferredLocale];
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

export class Languages {
  constructor ({langData}) {
    this.langData = langData;
  }
  localeFromLangData (lan) {
    return this.langData['localization-strings'][lan];
  }
  getLanguageFromCode (code) {
    return this.localeFromLangData(code).languages[code];
  }
  getFieldNameFromPluginNameAndLocales ({
    pluginName, locales, lf, targetLanguage, applicableFieldI18N, meta, metaApplicableField
  }) {
    return lf(['plugins', pluginName, 'fieldname'], {
      ...meta,
      ...metaApplicableField,
      applicableField: applicableFieldI18N,
      targetLanguage: targetLanguage
        ? this.getLanguageFromCode(targetLanguage)
        : ''
    });
  }
  getLanguageInfo ({$p}) {
    const langs = this.langData.languages;
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
