# CHANGES to `textbrowser`

## 0.51.0

- feat: TS support
- fix: `rememberRefusal` was not checking properly
- fix: request permissions would have been erring out
- fix: ensure `showEmptyInterlinear` and `showTitleOnSingleInterlinear` are
    being passed on

## 0.50.0

- fix: revert apparent indexeddbshim regression

Versions past 12 have some apparent node-sqlite3 issues (after rollup, can't run server script)

## 0.49.1

- fix: apparent regression with `nodeActivate`

## 0.49.0

- fix: `exports` path
- fix: attempt to improve behavior in service-worker (use `skipWaiting()`)

## 0.48.2

- fix: offline files issue

## 0.48.1

- fix: add to offline files
- refactor: drop unused files
- refactor: use `intl-locale-textinfo-polyfill` over `rtl-detect`
- chore: update deps., devDeps. and lint

## 0.48.0

- feat: service worker helper

## 0.47.0

BREAKING CHANGES; see betas for changes

## 0.47.0 (beta 2)

- fix: update `simple-get-json` (and devDep.)

## 0.47.0 (beta 1)

- fix: path regression

## 0.47.0 (beta 0)

- BREAKING fix: drop schemas now moved to textbrowser-data-schemas
- fix: adjust paths per new expected locations

## 0.46.3

- fix: update `intl-dom` (affecting fallbacks for non-English locales)

## 0.46.2

- fix: ensure `fetch` is set on server for locale retrieval for `/textbrowser`

## 0.46.1

- fix: regression with live data

## 0.46.0

- BREAKING chore: require Node 14.19.1+
- feat: routine to utilize updated `json-refs`
- feat: `imf` -> `intl-dom`
- refactor: linting/TS fixes
- chore: update babel/core, indexeddbshim, jsdom, babel/core deps.
- chore: update devDeps.

## 0.45.2

- fix: issue with `next`

## 0.45.1

- fix: issue with `next`

## 0.45.0

- fix: proper use of `await`
- fix: avoid extra problematic static server call
- fix: allow for empty router
- fix: allow fall-through to express if http server fails to match
- fix: pass on `next` to express

## 0.44.0

- fix: allow passing on if middleware does not match

## 0.43.0

- feat: if Express route not detected and `httpServer` present, defer to that

## 0.42.6

- fix: remove logging

## 0.42.5

- fix: try fixing cwd for `import`

## 0.42.4

- fix: remove `node-serviceworker`

## 0.42.3

- fix: server import path fix

## 0.42.2

- fix: server import path fix

## 0.42.1

- fix: tweak for Node `import()` path
- fix: rollup issues with `import()`

## 0.42.0

- BREAKING CHANGE: refactor: Native ESM (plugins must be ESM also)
- chore: removes babel/register, `url-search-params-polyfill` and dialog-polyfill
- chore: bumps @babel/core (patch) and `simple-get-json` (minor), pins rtl-detect

## 0.41.2

- fix: fix dialog polyfill CSS link

## 0.41.1

- fix: fix dialog polyfill CSS link
- refactor: make array-of-arrays schema more precise
- refactor: make table.jsonschema more precise
- refactor: drop redundant locale file listing in sample service worker
- chore: update `.editorconfig`, devDeps. and deps. (babel-related,
    `command-line-args`)

## 0.41.0

- feat: factor out undocumented Bahá'í Writings-specific bookmark generator
    to new generic `preferencesPlugin` option

## 0.40.3

### User-facing

- fix: clear out extra query string, e.g., from Facebook when querying for
    metadata file
- chore: update deps.

### Dev-facing

- chore: lint and add ncurc.js
- chore: update devDeps.

## 0.40.2

- Fix: Add ESM `dist` versions for `activateCallback` and `WorkInfo`

## 0.40.1

- npm: Bump `indexeddbshim`

## 0.40.0

### User-facing

- Breaking change: Switch to ESM for service worker; remove CJS dependencies
- npm: Update `@babel/core` (patch), `@babel/register` (minor)

### Dev-facing

- npm: Update devDeps.

## 0.39.0

### User-facing

- Breaking change: Require Node 12
- Enhancement: Add `expressServer` option to allow injecting express server
    on top of static server for fallback
- npm: Update dep. babel/core (minor), babel/register (patch), jsdom (minor),
    rtl-detect (patch)

### Dev-facing

- Linting: As per latest ash-nazg
- npm: Update devDeps.
- npm: Add `lint` script

## 0.38.6

- Fix: Avoid race condition with language loading

## 0.38.5

- Fix: Don't fail if no `accept-language` header (e.g., with `curl`)

## 0.38.4

- Fix: Switch to `@brettz9/node-static` to fix vulnerabilities and strict error

## 0.38.3

### User-facing

- npm: Update deps. (`@babel/core`, `@babel/register`, `imf`, `indexeddbshim`,
    `jamilih`, `jsdom`, `load-stylesheets`, `url-search-params-polyfill`)

### Dev-facing

- Linting: As per latest ash-nazg (and switch to `overrides`)
- npm: Switch to updated `rollup-plugin-postprocess` fork
- npm: Switch from deprecated `babel-eslint`
- npm: Update devDeps. including changed `eslint-config-ash-nazg` peerDeps.

## 0.38.2

- Fix: `allowPlugins` behavior

## 0.38.1

- Fix: Add back `node-static` for programmatic use

## 0.38.0

- npm: Update `simple-get-json`, `imf`
- Dev securty: Switch to server (`http-server`) without reported
    vulnerabilities

## 0.37.0

- Fix: `nodeActivate` and base path
- Change: Drop core-js-bundle and regenerator-runtime
- npm: Update imf, dialog-polyfill, simple-get-json deps. and devDeps

## 0.36.1

- Fix: Properly encode stylesheets

## 0.36.0

- Breaking change: Explicitly require Node 10.11.0+
- Build: Update per latest devDeps.
- Linting: As per latest ash-nazg
- npm: Change to non-deprecated `@rollup/plugin-commonjs`
- npm: Update deps., peerDeps, devDeps., package-lock

## 0.35.0

- Build: Rename Babelrc to include "json" extension
- Build: Change Babel preset-env targets to Node 10
- Build: Make local server file executable for local testing
- Linting (ESLint): As per latest ash-nazg
- npm: Cleaner property ordering
- npm: Make separate script for test opening and run in parallel
  using `npm-run-all`
- npm: Add `server` script
- npm: Add `jsdom` as dep. now that removed from jamilih
- npm: Switch to non-deprecated `@rollup/plugin-node-resolve`
- npm: Update deps (`babel`-related, `indexeddbshim`,
  `url-search-param-polyfill`, `simple-get-json` and `jamilih`)
- npm: Updat peerDeps (`core-js-bundle`)
- npm: Update devDeps.

## 0.34.0

- Linting: Update per latest config (esp. jsdoc)
- Linting (ESLint): Lint any HTML/Markdown JS
- Linting (ESLint): Switch to 2sp.
- Maintenance: Add `.editorconfig`
- Testing: Switch from end-of-lifed nodeunit to mocha+chai
- Change @babel/polyfill in sample files
- npm: Update opn-cli -> open-cli
- npm: Update devDeps, deps, peerDeps

## 0.33.0

- npm: Update deps, devDeps
- npm: peerDeps - Move from deprecated @babel/polyfill to
    core-js/regenerator-runtime

## 0.32.0

- Linting (LGTM): Escape backslashes, escape globally useless var and
  argument
- npm: Update deps, devDeps

## 0.31.0

- Fix (server): Ensure user `namespace` can override default
- Change (server): Switch from "bahaiwritings"->"textbrowser"
    as default `namespace`
- Enhancement: Incorporate resolved stylesheet file names into
    service worker path so it may cache them automatically
    along with files in `userJSON` yet avoid fetching in sample
    SW/userJSON if not included
- Enhancement (server): Add `basePath` option
- Refactoring (server): Simplify default setting; properly group
    settings by type
- Build: Adjust node-resolve per update; apply babel updates
- npm: Update from `form-serialize` to `form-serialization`
- npm: Update devDeps

## 0.30.0

- Fix: Use consistent dialog-polyfill.css path so cached
- Fix (Accessibility): Set `lang` and `title` earlier; add landmark section
- Enhancement: Allow separate languages page title in `site.json`
- Refactoring: simplify; move some styling to CSS

## 0.29.2

- Fix (Server): Replace the dialog polyfill with our own noop
    polyfill for Node

## 0.29.1

- Update: In sample Service worker, point to new dialog-polyfill path

## 0.29.0

- Breaking change: `TextBrowser` must now be used with `new`
    (`IntlURLSearchParams` also refactored as class)
- Refactoring: Use modular form of dialog-polyfill
- Change: Add dialog stylesheet when `@builtin` stylesheet is used
- Linting: Add recommended extension to `.eslintrc` (.js); apply
    ash-nazg rules
- Docs: In todo comments, refer to `import.meta.url` (also apparently
    supported in Rollup; probably need to wait for service workers
    behaving as modules)
- Docs (README): Document server API, plugins, and `userJSON` property
- Docs (README): Clean-up/clarify; indicate `user.json` as recommended;
    document `{locale}` value, and `shortcut` and `meta` properties
- Testing: Add schema and tests for user-json schema
- npm: Update deps and devDeps

## 0.28.0

- npm: Update deps, devDeps

## 0.27.1

- Fix: Avoid need for `!important` with column color rules
- Fix: CSS for column was not working properly when intervening columns
    were omitted
- Fix: For `colorName` and `bgcolorName` (color pull-downs) and
    `fontstretch` pull-down, use reverse-localized value
- Fix: Row ID setting when aliases present (and thus fix anchor
    setting for such cases)
- Fix: Applicable field set was not being properly detected

## 0.27.0

- Enhancement: Expose `getLangDir` so plugins can set proper directionality

## 0.26.2

- npm: Restore `@babel/core` as dep

## 0.26.1

- npm: Make `@babel/register` a dep

## 0.26.0

- Breaking change: Update `babel-polyfill` to `@babel/polyfill`
- Breaking change: Update `indexeddbshim`
- Refactoring: Avoid deprecated `url.parse` in favor of `URL` constructor
- Testing: Fix script dep. path per new `simple-get-json`
- Build: Make CommonJS build for server to avoid need for `@babel/polyfill`
- npm: Upgrade to Babel 7; update other devDeps and deps recursively; fix
    `rtl-detect` as dep.
- npm: Update devDeps

## 0.25.4

- Fix: Allow form submission by hitting return (with updated Chrome?)
- Fix (minor): Avoid adding empty variable to query string

## 0.25.3

- Fix: Avoid form submission upon copy shortcut click

## 0.25.2

- Fix: Allow form submission by hitting return

## 0.25.1

- Fix: Accommodate server differences with plugins

## 0.25.0

- Enhancement: Bookmarks export
- Enhancement: Button to copy single shortcut URL (e.g., for Chrome)
- npm: Update Jamilih
- Refactoring: Make use of Jamilih's new `body` export

## 0.24.1

- Fix: `startEnd` setting issue

## 0.24.0

- Enhancement: Allow more flexibility within start/end params in
    undocumented `startEnd` feature--can still have the full
    text + number in parenthesis or also just number of just text;
    makes `startEnd` more appealing as target for browser keywords

## 0.23.2

- Fix: Update server code

## 0.23.1

- Fix: Update server code

## 0.23.0

- Fix: Get server working again by adding `log` function
- Enhancement: Allow detection of field names in start/end by alias
    alone (no parentheses with numeric value needed)
- Build: Use terser for Rollup minification
- Linting (ESLint): Overwrite new "standard" rule
- Refactoring: Use new Jamilih exports and format
- npm: Update Jamilih, url-search-params-polyfill and devDeps

## 0.22.1

- Fix: Update `dist` files (with applying empty field changes)

## 0.22.0

- yarn: Remove `yarn.lock`
- Fix: Serialize empty fields (ensuring state preserved to overwrite
    previous non-empty)

## 0.21.4

- Security fix: Avoid exposing `.git` directory in server

## 0.21.3

- Fix: Save checkbox enabled state

## 0.21.2

- Fix: Create server-side namespace

## 0.21.1

- Fix (work display): Selection of fields (noticeable on using back
    button to return to page (history state serialization))

## 0.21.0

- Enhancement: Pass on `fieldInfo` (plugins to grab from another column)
- Docs: Update user-sample.json
- Refactoring: Wrap table in `table-responsive` (not actually needed now, but using in bahaiwritings)

## 0.20.1

- Fix: font-variant/small-caps
- Fix: Show interlinear even when titles not chosen to be shown

## 0.20.0

- npm: Update jamilih (fixing security vulnerability), indexeddbshim,
    load-stylesheets, deps, and devDeps
- Testing: Use node-static server/opn-cli instead of our own
- Build: Update Rollup per new version's API
- Enhancement: Namespace textboxes by work to avoid caching of unused values
- i18n: Populate non-English locales with missing English fields for easier
    translation

## 0.19.0

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

## 0.18.4

- npm: Publishing issue

## 0.18.3

- Fix: Issue when plugins for work were absent

## 0.18.2

- Server: Ensure basePath and other user params are passed in
- npm: Move babel-register, babel-preset-env to being
    peer-dependencies (required for resolution of our dynamic,
    path-sensitive "import"->require) so user flagged of need
    to install
- npm: Move babel-plugin-dynamic-import-node to devDeps

## 0.18.1

- Fix for plug-ins run in Node (avoid running on client if
    already run on server)
- Update `yarn.lock`

## 0.18.0

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

## 0.17.1

- Change (server): Supply just `domain`, with `basePath` being derived

## 0.17.0

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

## 0.16.0

- Default to absence of `checked` params meaning present (must set
    explicitly to "No")
- Make `outputmode` check default to `table` (and avoid problems if
    user messes with value)
- Avoid Chrome DevTools error

## 0.15.0

- Fix: Multiple fixes for Node.js server
- Let Node.js server's `basePath` default to `localhost` and
    user-supplied or default port
- Enhancement: Make Node.js server a binary
- Enhancement: Provide server output options (Jamilih or HTML as well as JSON)

## 0.14.0

- Node.js server (untested)
- Change: If not persistent (e.g., as user revoked) but worker already set up,
    try asking again (until they refuse)
- Refactoring: Break out `requestPermissions`, `prepareForServiceWorker`,
    `registerServiceWorker`, and `getWorkFiles`/`getFilePaths` into own
    functions; split `resultsDisplay` into client and server-or-client
    versions; break out metadata functions to utility; split off
    `getIMFFallbackResults` to allow different server/client versions
- Refactoring: Minor optimizations, await/async, factor out common `escapeHTML`

## 0.13.3

- Fix: Don't continue past loading screen until service worker
    is fully activated

## 0.13.2

- Fix: `this` scoping issue for langData
- Fix: Sample service worker `async` issues
- Refactoring: Have `init` return now promise-based `displayLanguages`
    if we want it to signal everything rendered (incomplete)
- Refactoring: Use `async`/`await` with `getJSON`

## 0.13.1

- Fix: Ensure is doing a browser build (now that imf is fixed to do so)
- npm: Ensure ESLint and Rollup are run for Node tests

## 0.13.0

- Refactoring: `async`/`await`

## 0.12.6

- Upgrade `loadStylesheets`
- Docs: Document `stylesheets` in README

## 0.12.5

- Fix: Ensure paths are relative to this repo

## 0.12.4

- Fix: Ensure base URL is an absolute URL

## 0.12.3

- Fix: Replace `__dirname` with hard-coded `moduleURL` for now

## 0.12.2

- Enhancement: Use `loadStylesheets` to avoid user needing to hard-code ours
    (and theirs) non-modularly
- Enhancement: Have `init` return a Promise resolving when stylesheets loaded
- Enhancement: Use `__dirname` to be replaced by Rollup
    (`document.currentScript.src` would not necessarily be relative to this
    repo is bundled into another project)

## 0.12.1

- Build: Ensure rollup can complete and update builds

## 0.12.0

- Breaking change: Expect plugins to use dynamic `import`
- Linting: Switch to `babel-eslint` parser to handle `import`

## 0.11.1

- Update `package-lock.json`

## 0.11.0

- Fixes for user-sample file
- Testing: Fix to use babel-polyfill
- .gitignore: Add files that may be used for locally testing textbrowser
    within its folder
- Avoid builtins overhead and problems with Rollup by directly requiring
    json-refs browser file

## 0.10.0

- Use Rollup (with Babel and uglify), as can state dependencies more
    succinctly and convert json-refs (and use opportunity for applying Babel)
- Linting: Use `.eslintignore`

## 0.9.0

- Fix: Use JSONP as module
- Testing: Update tests to use babel-polyfill (not run automatically by
    simple-get-json)
- Testing: Use updated JSON Schema drafts (which apparently fix some bugs as
    tests now passing)
- npm: Update `package-lock.json`, `yarn.lock`
- npm: Add babel-polyfill to devDeps; bump simple-get-json version (no need
    to include babel-polyfill in repo ourselves)

## 0.8.2

- npm: Include changes in `package-lock.json` and `yarn.lock`

## 0.8.1

- npm: Bump simple-get-json to 3.2.2 (fix to use babel-polyfill)

## 0.8.0

- Update deps (and their imports)
- Use ES6 Modules/Rollup

## 0.7.0

- Refactoring (Breaking): Switch to ES6 Modules (except for some dependencies)
- Refactoring: Remove (mostly) no longer needed `URLSearchParams` polyfill
- Linting: ESLint (indents)
- npm: Fix ESLint script per https://github.com/eslint/eslint/issues/1663#issuecomment-240066799
- npm: Upgrade dev deps

## 0.6.1

- Fix interlinear and checked interaction issue
- Better caption display

## 0.6.0

- Enhancement: Add `showEmptyInterlinear` and `showTitleOnSingleInterlinear`
    for further control of interlinear behavior

## 0.5.0

- Fix: Interlinear content
- Fix: `lang` and anchor when interlinear are used
- Enhancement: Wrap interlinear segments in language-aware span
- Refactoring: Use abbreviated method forms

## 0.4.2

- Fix `anchor` to work with aliases (utilizing `prefer_alias`)

## 0.4.1

- Fix issue with aliases

## 0.4.0

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

## 0.3.1

- Proper version in package.json

## 0.3.0

- First minimally functioning version (all the way to the results
    page, though with slow performance due to current lack of caching)

## 0.2.0

- BREAKING: Change i18n in metadata, files, site, etc.

## 0.1.0

- Initial version
