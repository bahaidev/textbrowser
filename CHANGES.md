# 0.19.0

- Fix: Add `dir` to results cells (if non-default)
- Fix (Service worker): Safer worker (imports info via URL to avoid (unstable)
    messaging into worker; retries rather than failing)
- Optimization: Add global `lang` and only override in cells if non-default
- Optimization: Avoid adding "td" class to each cell
- Enhancement (Service worker): Show dialog that waiting on an install
- Enhancement (Service worker): Try updating every hour
- Enhancement (Service worker): Log more details to clients
- Enhancement (Service worker): Handle other service worker eventualities (not
    well tested)
- Enhancement: Use dialog element over built-in alerts
- Refactoring (Dialogs): Allow object for `ok` argument
- npm: Update deps (jamilih, indexeddbshim, url-search-params-polyfill)
- npm: Add rtl-detect
- npm: Update devDeps

# 0.18.4

- npm: Publishing issue

# 0.18.3

- Fix: Issue when plugins for work were absent

# 0.18.2

- Server: Ensure basePath and other user params are passed in
- npm: Move babel-register, babel-preset-env to being
    peer-dependencies (required for resolution of our dynamic,
    path-sensitive "import"->require) so user flagged of need
    to install
- npm: Move babel-plugin-dynamic-import-node to devDeps

# 0.18.1

- Fix for plug-ins run in Node (avoid running on client if
    already run on server)
- Update `yarn.lock`

# 0.18.0

- Enhancement: Plugins!
- Enhancement: Add canonical ID and type to rows (usable by plugins,
    e.g., for consistent storage pertaining to verses)
- Optimization: Avoid adding `row` dataset property to each cell
- Schema enhancement: Accept array for plugin applicable-fields-keyed
    `targetLanguage`
- Schema enhancement: Support `{locale}` in place of a language code for
    `targetLanguage`
- Schema enhancement: Allow `meta` for passing arguments from plug-ins
    to localization-strings
- Sample worker: Fix offline when `index.html` omitted
- Refactoring: Misc. improvements

# 0.17.1

- Change (server): Supply just `domain`, with `basePath` being derived

# 0.17.0

- Change: Make footer off by default
- Change: Stop asking persistence permissions on results page (so users can
    be directed to specific Writings without needing to themselves confirm); in
    the future, a navigation bar and/or breadcrumbs may allow going to another
    page where that is possible
- Change: Avoid slow retrieval for presorts (unless `noDynamic`); Node.js can
    handle
- Fix (server): Allow `basePath` to be non-localhost
- Fix (client): Ensure babel-polyfill is cached by service worker in sample
- Enhancement: Search box parsing (without UI)
- Docs: Remove outdated/invalid to-dos

# 0.16.0

- Default to absence of `checked` params meaning present (must set
    explicitly to "No")
- Make `outputmode` check default to `table` (and avoid problems if
    user messes with value)
- Avoid Chrome DevTools error

# 0.15.0

- Fix: Multiple fixes for Node.js server
- Let Node.js server's `basePath` default to `localhost` and
    user-supplied or default port
- Enhancement: Make Node.js server a binary
- Enhancement: Provide server output options (Jamilih or HTML as well as JSON)

# 0.14.0

- Node.js server (untested)
- Change: If not persistent (e.g., as user revoked) but worker already set up,
    try asking again (until they refuse)
- Refactoring: Break out `requestPermissions`, `prepareForServiceWorker`,
    `registerServiceWorker`, and `getWorkFiles`/`getFilePaths` into own
    functions; split `resultsDisplay` into client and server-or-client
    versions; break out metadata functions to utility; split off
    `getIMFFallbackResults` to allow different server/client versions
- Refactoring: Minor optimizations, await/async, factor out common `escapeHTML`

# 0.13.3

- Fix: Don't continue past loading screen until service worker
    is fully activated

# 0.13.2

- Fix: `this` scoping issue for langData
- Fix: Sample service worker `async` issues
- Refactoring: Have `init` return now promise-based `displayLanguages`
    if we want it to signal everything rendered (incomplete)
- Refactoring: Use `async`/`await` with `getJSON`

# 0.13.1

- Fix: Ensure is doing a browser build (now that imf is fixed to do so)
- npm: Ensure ESLint and Rollup are run for Node tests

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
