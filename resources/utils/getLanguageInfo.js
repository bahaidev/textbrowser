export default function ({langData, $p}) {
    const langs = langData.languages;
    const localePass = (lcl) =>
        langs.some(({code}) => code === lcl) ? lcl : false;
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
    const lang = preferredLangs.concat(fallbackLanguages);

    return {
        lang,
        langs,
        languageParam,
        fallbackLanguages
    };
};
