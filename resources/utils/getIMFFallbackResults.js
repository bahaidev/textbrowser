import IMF from 'imf';
import getLanguageInfo from './getLanguageInfo.js';

export default function getIMFFallbackResults ({
    $p,
    lang, langs, langData, fallbackLanguages,
    resultsDisplay,
    localeCallback = false
}) {
    if (!lang) {
        ({lang, langs, fallbackLanguages} = getLanguageInfo({$p, langData}));
    }
    return new Promise((resolve, reject) => {
        const resultsCallback = (...args) => {
            const [l10n] = args;
            if (!$p.l10n) {
                $p.l10n = l10n;
            }
            return resultsDisplay({
                l: l10n,
                lang,
                fallbackLanguages,
                imfLocales: imf.locales,
                $p
            }, ...args);
        };
        const imf = IMF({
            languages: lang,
            fallbackLanguages,
            localeFileResolver: (code) => {
                // Todo: For editing of locales, we might instead resolve all
                //    `$ref` (as with <https://github.com/whitlockjc/json-refs>) and
                //    replace IMF() loadLocales behavior with our own now resolved
                //    locales; see https://github.com/jdorn/json-editor/issues/132
                return langData.localeFileBasePath + langs.find((l) =>
                    l.code === code
                ).locale.$ref;
            },
            async callback (...args) {
                if (localeCallback && localeCallback(...args)) {
                    resolve();
                    return;
                }
                await resultsCallback(...args);
                resolve();
            }
        });
    });
};
