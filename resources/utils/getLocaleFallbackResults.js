/**
 * @file Note that this should be kept as a polyglot client-server file.
 */
import {i18n} from 'intl-dom';

export default async function getLocaleFallbackResults ({
  $p,
  lang, langs, langData, fallbackLanguages,
  basePath = ''
}) {
  const l = await i18n({
    messageStyle: 'plainNested',
    locales: lang,
    defaultLocales: fallbackLanguages,
    localeResolver (localesBasePath, code) {
      // Todo: For editing of locales, we might instead resolve all
      //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
      //    replace `loadLocales` behavior with our own now resolved
      //    locales; see https://github.com/jdorn/json-editor/issues/132
      return basePath + (langData.localeFileBasePath) + langs.find((l) => {
        return l.code === code;
      }).locale.$ref;
    }
  });
  if (!$p.l10n) {
    $p.l10n = l;
  }
  return l;
}
