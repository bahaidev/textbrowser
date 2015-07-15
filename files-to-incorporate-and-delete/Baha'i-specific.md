Move all of the below to its own non-open-source (Bitbucket?) repo (though denoting that its contents are under its own licenses): http://stackoverflow.com/questions/28070745/how-to-use-bower-with-private-bitbucket-repository

1. Baha'i todos
    1. Split Baha'i texts into a separate repo and add todo there: Suggest API to Baha'i World Centre to automatically (and periodically) parse their texts into JSON here to ensure we have the most up-to-date and corrected translations
        1. The base code of browse0.php, browse.php, browse9.php are all XHTML compliant, but there are a good number of invalid XHTML in the JSON databases Qur'an and Bible (links w/o quotes) that would ideally be replaced as well as the XHTML and link locations in the Iqan copy (just to be nice and clean)
        1. Upload newer Collins and fix any bugs in formatting.
        1. Add Collins language metadata for each field
    1. Add/Add back references for automated: Synopsis, Roman numerals (pm, gwb), Chinese numbers, word-by-word translation (Persian/Arabic/German/English), auto-romanized Persian (Baha'i-style with help link to http://bahai9.com/wiki/Pronunciation ), Persian with English tooltips, English with Persian tooltips, text-to-(Google search, Google define, Wikipedia, bahai9.com edit pages); add Word-by-word/phrase mapping
    1. Link from textbrowser project to the Baha'i project under a samples section
    1. Move "about" text in locales to files.json
    1. Waiting: It is hoped that the addition of these tables (which are Scriptures) can also be automatically generated from any possible future authoritative API
    1. Once implemented, apply `prefer_alias` to Qur'an and Bible
    1. Lower priority
        1. Add any other reasonable browse_options (e.g., to Collins esp.)
        1. Add "By page" for the Aqdas (once parsed by page)
        1. If implementing combining of fields, add Collins for this.
        1. Further localization including column aliases, etc.
