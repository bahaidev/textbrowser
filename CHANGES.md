# 0.13.0

- Refactoring: `async`/`await`

# 0.12.6

- Upgrade `loadStylesheets`
- Docs: Document `stylesheets` in README

# 0.12.5

- Fix: Ensure paths are relative to this repo

# 0.12.4

- Fix: Ensure base URL is an absolute URL

# 0.12.3

- Fix: Replace `__dirname` with hard-coded `moduleURL` for now

# 0.12.2

- Enhancement: Use `loadStylesheets` to avoid user needing to hard-code ours
    (and theirs) non-modularly
- Enhancement: Have `init` return a Promise resolving when stylesheets loaded
- Enhancement: Use `__dirname` to be replaced by Rollup
    (`document.currentScript.src` would not necessarily be relative to this
    repo is bundled into another project)

# 0.12.1

- Build: Ensure rollup can complete and update builds

# 0.12.0

- Breaking change: Expect plugins to use dynamic `import`
- Linting: Switch to `babel-eslint` parser to handle `import`

# 0.11.1

- Update `package-lock.json`

# 0.11.0

- Fixes for user-sample file
- Testing: Fix to use babel-polyfill
- .gitignore: Add files that may be used for locally testing textbrowser
    within its folder
- Avoid builtins overhead and problems with Rollup by directly requiring
    json-refs browser file

# 0.10.0

- Use Rollup (with Babel and uglify), as can state dependencies more
    succinctly and convert json-refs (and use opportunity for applying Babel)
- Linting: Use `.eslintignore`

# 0.9.0

- Fix: Use JSONP as module
- Testing: Update tests to use babel-polyfill (not run automatically by
    simple-get-json)
- Testing: Use updated JSON Schema drafts (which apparently fix some bugs as
    tests now passing)
- npm: Update `package-lock.json`, `yarn.lock`
- npm: Add babel-polyfill to devDeps; bump simple-get-json version (no need
    to include babel-polyfill in repo ourselves)

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
