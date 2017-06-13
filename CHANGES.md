# 0.4.2

-   Fix `anchor` to work with aliases (utilizing `prefer_alias`)

# 0.4.1

-   Fix issue with aliases

# 0.4.0

-   Optimization: Add service worker code to cache files and use it and
    IndexedDB for performance (including `serviceWorkerPath`,
    `requestPersistentStorage`, and `staticFilesToCache` options
    as well as dialogs, including error dialogs)
-   Refactoring (Breaking): Remove array `includes` polyfill
    (relying on other modern features)
-   Fix: Stop hard-coding languages in check
-   Fix: Document titles
-   Enhancement: Support HTML `lang` on cells
-   npm: Update jamilih (`lang` treatment)
-   Docs (README): Better install instructions
-   Docs (README): Indicate third-party-facing features
-   Docs (README): Correct info on `site.json`
-   Docs (README): Todos

# 0.3.1

-   Proper version in package.json

# 0.3.0

-   First minimally functioning version (all the way to the results
    page, though with slow performance due to current lack of caching)

# 0.2.0

-   BREAKING: Change i18n in metadata, files, site, etc.

# 0.1.0

-   Initial version
