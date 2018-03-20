# 0.8.2

- npm: Include changes in `package-lock.json` and `yarn.lock`

# 0.8.1

- npm: Bump simple-get-json to 3.2.2 (fix to use babel-polyfill)

# 0.8.0

- Update deps (and their imports)
- Use ES6 Modules/Rollup

# 0.7.0

- Refactoring (Breaking): Switch to ES6 Modules (except for some dependencies)
- Refactoring: Remove (mostly) no longer needed `URLSearchParams` polyfill
- Linting: ESLint (indents)
- npm: Fix ESLint script per https://github.com/eslint/eslint/issues/1663#issuecomment-240066799
- npm: Upgrade dev deps

# 0.6.1

- Fix interlinear and checked interaction issue
- Better caption display

# 0.6.0

- Enhancement: Add `showEmptyInterlinear` and `showTitleOnSingleInterlinear`
    for further control of interlinear behavior

# 0.5.0

- Fix: Interlinear content
- Fix: `lang` and anchor when interlinear are used
- Enhancement: Wrap interlinear segments in language-aware span
- Refactoring: Use abbreviated method forms

# 0.4.2

- Fix `anchor` to work with aliases (utilizing `prefer_alias`)

# 0.4.1

- Fix issue with aliases

# 0.4.0

- Optimization: Add service worker code to cache files and use it and
    IndexedDB for performance (including `serviceWorkerPath`,
    `requestPersistentStorage`, and `staticFilesToCache` options
    as well as dialogs, including error dialogs)
- Refactoring (Breaking): Remove array `includes` polyfill
    (relying on other modern features)
- Fix: Stop hard-coding languages in check
- Fix: Document titles
- Enhancement: Support HTML `lang` on cells
- npm: Update jamilih (`lang` treatment)
- Docs (README): Better install instructions
- Docs (README): Indicate third-party-facing features
- Docs (README): Correct info on `site.json`
- Docs (README): Todos

# 0.3.1

- Proper version in package.json

# 0.3.0

- First minimally functioning version (all the way to the results
    page, though with slow performance due to current lack of caching)

# 0.2.0

- BREAKING: Change i18n in metadata, files, site, etc.

# 0.1.0

- Initial version
