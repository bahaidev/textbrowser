# TextBrowser

*Please note that this project, while now preliminarily functional,
is in its early stages. Its currently slow loading times (particularly
for large files) relates to the fact that the code is currently
downloading the files in full and then processing them; the next
step is for us, while informing the user we are downloading the files,
is to add them into IndexedDB; eventually, we also hope to provide an
option to pre-process live on the server (probably Node.js), but
we are attempting to follow the "offline first" motto, though even
full offline support is not yet completely available, as we are not
yet making use of the ServiceWorker API.*

*TextBrowser* supports power-user browsing of arbitrary multi-linear
texts.

The splash page for the texts is an internationalized interface
that allows for selection by the user of their desired interface language,
followed by a screen to choose from among designated texts, with each text
being given its own page to allow browsing of the contents of the text.

The text interface offers fine grained control to the *user* for how they
wish the output of that text to be displayed, both in terms of styling and
positioning, with its features particularly shining with multilinear/parallel
texts (e.g., multiple translations or commentaries that one views
side-by-side), allowing columns to be displayed in separated columns and/or
interlinearly (one verse vertically beneath the corresponding alternate).

Despite the name of the project referring to "text", this project
can be used for browsing any tabular data with sequential items.

It is designed to run solely with client-side JavaScript with the intent
that the web software will be able to work fully offline in the browser
as well as online. Currently, it must be run on a server though any static
server will do (it comes with a script to run the code on a simple Node.js
static file server--which can be easily set up on a local machine as well).
(It can't be run from a `file://` URL (at least in Chrome), however, due to
more recent browser-added file access restrictions in such an environment.)

The syntax used in the code currently only works in a modern browser and
to date has only been tested in Chrome.

## Features / Design Goals

The following are user-facing features/goals:

-  Have the interface be fully internationalized (i18n) to support translation
    into other languages and well localized (l10n) into such languages,
    including for right-to-left languages. Internationalization even
    optionally applies to parameter names, though this functionality
    (and some other i18n features in general are not thoroughly tested at
    present).
-  Allow texts to be grouped on a work selection page with separate
    introductory messages for each work.
-  Allow browsing by a range of verses
-  Allow browsing by alternate mechanisms (e.g., by different ordering schemes
    on the same text)
-  Allow precise and canonical pointing to a specific row or even cell
    within a work (designation of anchors) by graphical means (without the
    user needing to dig through HTML).
-  Provide enumerated choices as pull-downs and numeric choices within
    numerically-aware input fields (including for max and min values).
-  Ability to selectively disable any column
-  Ability to reorder (and even repeat) columns
-  In addition to parallel text functionality where different translations,
    commentaries, etc. are assigned their own separate columns in the results
    table, allow users to designate that any field have any other field(s)
    repeating within its cell (i.e., interlinear as opposed to parallel
    display). Also provides a styling option on whether to repeat column
    names and the option to style them (currently, the administrator can
    also choose exactly how to separate these within cells from one another,
    but we hope to provide user-facing preselected choices in the future).
-  Allow categorization of content by language so that users can quickly
    enable only such content languages in which they are interested
-  Allow user to not only bookmark/share links of the results page and even
    of a particular view of the work page. Functionality should be
    available as much as possible via URL parameters.
-  Allow column-specific styling
-  Allow generic page styling of text, as form controls or CSS for
    experienced users.
-  Allow fine-grained control of the table display beyond border styling
    (e.g., whether to show a caption summarizing the work/selection, whether
    to show a header and if so, whether it should be fixed and/or styled, or
    or whether the "table" is even an HTML table or instead HTML `<div>`'s,
    etc.--JSON export is hoped for the future).
-  Ease of navigation within a site (as via breadcrumbs) and accessibility
    (e.g., for the visually impaired) is also desired, but we are hoping
    for expertise to provide a review and ideally assistance. We do have
    some code begun internally.

The following are administrator-facing features/goals:

-  Allow most functionality to work for administrators out of the box via a
    declarative style (via well-used and readable JSON files) without need
    for custom scripting. Though the project originated to meet the need of
    Bahá'í texts, any document and even data with sequential fields
    that can be put into a tabular structure can be browsed.
-  Allow for translations within separate locale files
-  Allows for easy conversion of table structures (e.g., SQL, JSON) into our
    simple JSON array format
-  Allow for standard means (as with our use of
    [JSON Schema](http://json-schema.org/documentation.html))
    to designate type information that can be used by the program for
    automated display as well as optimization. Where a standard means
    does not exist, we provide a declarative meta-data file to house
    this information.
-  It is a goal for us to support plug-ins for extensibility, including
    declarative specification without need for scripting, but such support
    is currently lacking (though some work internally has begun).
-  It is a goal for us to support declarative means for indicating site
    hierarchy and navigation. This is not implemented, but we do have some
    code begun internally.

The following are third-party-site-facing features/goals:

-  The thorough use of query strings (even to customize the work selection
    page as well as the results page) allow for other tools to more easily
    tap into our API, and the control of styling (including of whether to show
    table headers) deliberately allows for third-party sites to embed
    content directly from *TextBrowser*-driven sites (including sites which
    might wish to provide up-to-date, proofread, canonical sources of data
    without duplicating or introducing the possibility of copy-paste error).
    Blogs, discussion forums, and wikis might, for example, provide widgets
    (a popup to our site especially once we may have implemented our to-do
    for canonical syntax selection available through `postMessage`?) which
    could be used to embed a specific range and/or styling of text in a post.
    These advantages of widely-used query strings also go for people sharing
    links or bookmarking for themselves.

The following are *TextBrowser*-developer-facing features/goals:

-  Strong separation of concerns, with "design logic" separate from
    "business logic". We are using [Jamilih](https://github.com/brettz9/jamilih)-based
    templating to allow for templating functions in Vanilla JavaScript (as
    well as avoiding ugly, angular HTML almost entirely!). While the results
    display for users leverages CSS classes, we still need to remove some
    inline styling for better structural (HTML) vs. styling (CSS) separation.
-  We aim to leverage modern syntax, especially JavaScript, allowing
    derivative projects to polyfill if they wish to support older browsers.
    Besides aiming for better forward-compatibility, this allows us to use
    standard, well-known patterns, as well as more readable, succinct code.
-  We hope for good test-driven development, but currently this is limited to
    schema validation. We are still in need of a choice of UI testing
    framework and tests (as well as for unit tests).

## Installation

The repository is intended to be used as a
[npm](https://www.npmjs.com/) dependency.

Run the following from your project root.

```install
npm install textbrower --save
```

You can also target the latest code in `master` with the following:

```json
"dependencies": {
    "textbrowser": "git@github.com:brettz9/textbrowser.git#master"
}
```

And then run `npm install` on your project path.

(To update, you can remove `node_modules/textbrowser/` from your project
and run `npm cache clean textbrowser`.)

## Usage

The following instructions are aimed at those adding *TextBrowser* as a
dependency of their own project.

If you would like to see a sample package implementing the
following, see the
[bahaiwritings](https://bitbucket.org/brettz9/bahaiwritings)
project.

Projects derivative to *TextBrowser* will need to adhere to the following:

1.  Add the *TextBrowser* dependency per the [Installation](#Installation) section.

1.  Prepare JSON data files, JSON Schema files, and JSON meta-data files
    to represent your texts. See the section
    [JSON Formats](#JSON Formats).
    To provide a common naming mechanism across projects and to avoid
    the need to tweak the default `TextBrowser` JavaScript class set-up, a
    [specific directory structure](#Recommended Project Directory Structure)
    is recommended for hosting these files.

1.  Prepare JSON files to indicate the specific grouping of files you wish
    to make available and optionally the interface languages you wish to
    make available (and for which you have locales), and after it may be
    ready, and if you wish, the JSON files to indicate your site hierarchy.
    See the
    [recommended directory structure](#Recommended Project Directory Structure)
    section for more.

1.  Create an HTML page (see `index-sample.html` for an example) which includes
    *TextBrowser*'s own project scripts and your own script to instantiate
    the `TextBrowser` class (and if you did not follow the
    [recommended directory structure](#Recommended Project Directory Structure),
    you will need to point to the above-mentioned JSON
    files). Page titles are set dynamically for each page, so there is no
    need to provide a `<title>`.

## Recommended Project Directory Structure

The recommended project directory structure (which are used by default by the
`TextBrowser` JavaScript API) is as follows:

-   ***package.json*** - Should indicate `textbrowser` as a dependency as per
    the [Installation](#Installation) section above.
-   ***node_modules*** - *TextBrowser* and its dependencies will be
    added here via npm install as well as any dependencies you indicate
    within `package.json`.
-   ***index.html*** - The main application code. One can use
    `index-sample.html` as is or modified as desired. Note that it
    may be sufficient to modify `resources/user.css` and `resources/user.js`.
-   ***resources/user.css*** - Add any custom CSS you wish to apply
    for `index.html`. (This convention allows you to get custom styling
    without modifying the sample index file.)
-   ***resources/user.js*** - Add any JavaScript you wish to use. (This
    convention allows you to get custom styling without modifying the
    sample index file.) Unless already invoked in `index.html`, you should
    call the `TextBrowser` constructor here. See *TextBrowser*'s
    `resources/user-sample.js` for a pattern you can copy and optionally
    adapt.
-   ***plugins/*** - While *not yet in use*, this is the convention we wish
    to begin enforcing for hosting plugins (e.g., for automated columns).
    <!-- See [Plugin Format](#Plugin Format) -->
-   ***sw.js*** - Although you can change the name of this file via
    `serviceWorkerPath` (see [JavaScript API](#JavaScript API)), this
    file should be at or higher than the files you are caching (including
    *TextBrowser*'s). Copying `sw-sample.js` as `sw.js` at your project
    root is the recommended approach.
-   ***data/*** - Directory recommended as a convention for holding JSON data
    files. It is also recommended that child directories be named for each
    file group, and within each file group, have the JSON data files
    as well as "schema" and "metadata" subdirectories containing the
    specific JSON schemas for each data file and the
    *TextBrowser*-specific meta-data files. See [JSON Formats](#JSON Formats).
-   ***files.json*** - See [JSON Formats](#JSON Formats).
-   ***site.json*** - See [JSON Formats](#JSON Formats).
-   ***locales/*** - Only needed if providing an alternate to *TextBrowser*'s
    own built-in `locales/`. It is recommended to rely on the default
    files and not add any custom files (contributing back here any
    localization fixes or additions you may have done!). See
    [JSON Formats](#JSON Formats).
-   ***languages.json*** - As with `locales/`, only needed if providing an
    alternate to *TextBrowser*'s own built-in `appdata/languages.json` file.
    It is recommended to rely on the default and not add any custom file. See
    [JSON Formats](#JSON Formats).

## JSON Formats

The sections below begin with where you can find the JSON schema which
defines the format and an example file. They then follow with a
plain language description of the format.

One meta-property shared among `files.json` and metadata files is
`localeKey` which is a non-standard means of pointing to a key
for substitution. It may be replaced in the future by the slightly
more cumbersome though standards-track [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)s.

### Work-Specific JSON

JSON data files, the individual JSON schema file against which the data
file can be validated (and enhanced in a standard manner with type
information), and our custom JSON metadata format file for indicating
information such as designating fields for browsing ranges, are covered
in this section.

#### JSON Data

JSON data files to represent your data (e.g.,
[this file](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/peace.json?at=master&fileviewer=file-view-default))
expect 3 fields (per the simple [schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table-container.jsonschema) and its simple [array-of-arrays subschema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/array-of-arrays.jsonschema) to which they adhere):

1. A `schema` JSON reference pointer to your data's JSON schema.
    See [JSON Schema](#JSON Schema).
2. A `metadata` JSON reference pointer to your data's JSON metadata.
    See [JSON Metadata](#JSON Metadata).
3. A `data` property which is an an array of arrays containing your tabular
    text itself. This property must adhere to the specific JSON schema
    referenced in the `schema` property above for this file.

#### JSON Schema

This document must itself be a valid
[JSON Schema](http://json-schema.org/documentation.html)
and must, moreover, adhere to the [table format schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table.jsonschema).

This simple document, besides including the text content, designates a more precise JSON schema to indicate precise column types (e.g.,
[this one](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/schemas/Bible.jsonschema?at=master&fileviewer=file-view-default)).

This schema is expected to designate an array of arrays, with the items
of the inner arrays being more flexible JSON schemas representing individual
fields of your works, but expecting a `type` and `title` in all cases.

It may, for integers, optionally also have `minimum` and `maximum` properties
which can be used to set numeric inputs (assuming the min or max is not
dependent on another value, as often will be paragraph numbers within
chapters).

For strings, an optional `"format": "html"` can be present, though raw HTML in
the so-designated fields will only be output in the results display as HTML
if the `TextBrowser` option `trustFormatHTML` is set to `true`. This
is for security reasons in case an untrusted schema is being deployed, but
one will probably normally wish to set this to `true` for trusted data.

Also for string type fields may one use `enum`, and its values are
currently used to determine field values (looking in the metadata
file under the localized `fieldvalue` object whose key is the column in which
the value occurs) which are used in place of the original content within
pull-down menus for selecting verse ranges and in the corresponding
column for the field of the results display. (The `fieldvalue-aliases`
property of the specific field key of the main `fields` property will
also be checked in that file for indicating optional aliases of the given
field value.)

#### JSON Metadata

[Meta-data JSON](https://github.com/brettz9/textbrowser/blob/master/general-schemas/metadata.jsonschema) (e.g.,
[this one](https://bitbucket.org/brettz9/bahaiwritings/src/6b07fb41d11ed76570f7da03ffc9d11aa8ff0a5d/data/writings/metadata/Bible.metadata?at=master&fileviewer=file-view-default))
is required so as for you to indicate for the app how the multilinear text
is to be browsed (e.g., which fields can be used as sequential
chapter/paragraph/verse numbers, how its columns should be translated, etc.).

This file has two main properties, `table` and `fields`.

`table` has two properties, `browse_fields` and `default_view`.

`browse_fields` is a name-set object or an array of string field names or
name-set objects. Name-set objects have an optional `name` string, a `set`
array of field name strings, and an optional `presort` boolean to
indicate whether the table must first sort the elements (in order of
listing); the default is to follow the original array order.

The keys of `default_view` are field names which point to a string or
integer, or array thereof. These are *not currently in use*, but are intended
to indicate the values that will be used for a default range when a user makes
a form submission without supplying a range.

For `fields`, the `lang` string property indicates the language code for the
content of this field. It is used for letting the user quickly enable
fields which match their desired locale language(s). It might be used for
HTML `lang` values in the future to properly display fonts for languages
that leverage it, such as the CJK languages.

One other set of types for `fields` are `name` and `alias` strings (or
`localeKey` pointing to strings). The `name` points to the regular
name for the column, whereas `alias` is currently used to point to an
alias name of the field (more specifically to an alternate name after
converting its values via `fieldvalue-aliases`). The boolean or string
`prefer_alias` property in turn determines whether this alias will be
used by default (currently if it is `false`, it is not used at all).
This functionality might be moved into a plug-in in the future.

Also in `fields`, `fieldvalue-aliases` can after any `localeKey` processing,
be an object of field name keys pointing to an array of alias names (as
strings or integers) or to an object whose keys indicating the type of
alias and string values. This can provide alternate values for what is
actually present in the data table (e.g., replacing numeric codes with
human-readable strings).

For `fields`, the `primary_text_field` and `orig_lang_field` booleans
and `orig_langs` array of string language codes are *not currently in use*
but intended to indicate the main work under consideration (as opposed
to translations), whether it is the source of translations or a target
translation, and what its source languages are (if not itself marked as
an original language).

The `roman` property of `fields` is intended to indicate Roman numerals.
It is *not currently in use* and where not automated from Arabic numerals,
it might be indicated in the future via a language code and more generic
`numeric` property (so as to support multiple non-Arabic counting systems
which are hard-coded as opposed to built via an automated plug-in).

As with other files, there is also a `localization-strings` key object, keyed
to language code, which is keyed to an object of keys (which can be strings
(e.g., `heading` or `alias`), arrays of strings, or other objects of keys,
including specifically for JSON metadata, `fieldnames`, `fieldaliases`,
`fieldvalue`, and `fieldvalue-aliases`).

### Application-Wide JSON files

Besides the JSON files directly representing your works, you will need the
following files to indicate behavior for the text-browsing application as a whole.

#### `files.json`

This format is defined by [this](https://github.com/brettz9/textbrowser/blob/master/general-schemas/files.jsonschema).
See [this file](https://bitbucket.org/brettz9/bahaiwritings/src/5f2602f122134d2013e013a477ae94ee29548a13/files.json?at=master&fileviewer=file-view-default) for an example.

It allows you to point the application to the data files you desire for inclusion (e.g., any kept in `data/`).

The optional string properties `schemaBaseDirectory` and
`metadataBaseDirectory` at root apply to all groups.

`groups` is a root array property whose items are file group objects whose
keys include the `id` string, the `name` string, the `directions` string
(for indicating instructions), as well as optional, group-scoped,
`schemaBaseDirectory` and `metadataBaseDirectory` properties.

The `files` array property contains object items with the following properties:
a `name` string or localization key (or a file group display name), `schemaFile` and `metadataFile` string file paths (resolved relative to the respective base path
properties), and `file` which is
an reference to a specific JSON data file [table-container.jsonschema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/table-container.jsonschema)).

As with other files, there is also a `localization-strings` key object, keyed
to language code, which is keyed to an object of keys (which can be strings,
arrays of strings, or other objects of keys, including specifically for
`files.json`, the object property `workNames` whose keys are work names, and
`plugins` whose keys are plugins and whose object values have a `fieldname`
key).

The `plugins` object property indicates scripts in metadata and is *not yet in use*.

Its keys are plug-in names and whose value objects have the required property `path`,
and the optional properties `onByDefault` boolean and `lang` language code string.
<!-- See [Plugin Format](#Plugin Format) for the structure of the plug-in pointed
to by the path. -->

The `plugin-field-mapping` object property similarly is *not yet in use*, but
whose keys are intended as groups and whose object key values include works as
keys and whose key values include field names as keys and whose key values
includes field arguments, namely:

- `placement` (the string `"end"` or a number to indicate placement relative
    to other properties; this might be changed to a string indicating field
    name)
- `applicable-fields` an object property whose properties are field names
    pointing to an object key value with properties that may vary with plug-in,
    but which specifically reserve a `targetLanguage` language code string property
    and a `onByDefault` boolean property.

#### `languages.json` and `locales/en-US.json`, etc.

Although we hope you may contribute back to our project any project-independent
changes you may need of the generic localizations within `locales/` and
`appdata/languages.json`, if you need to provide your own interface
localization, you may supply a `languages` property when creating the
`TextBrowser` object to point to a languages JSON file of your own
choosing (see the [JavaScript API](#JavaScript API)).

*TextBrowser* comes with the `languages.json` file at
[`appdata/languages.json`](https://github.com/brettz9/textbrowser/blob/master/appdata/languages.json) which, as mentioned, is used by default. It adheres to
[this schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/languages.jsonschema)

If you need to implement your own, the properties include the string
`localeFileBasePath` and the property `languages` which is an array
of objects containing the properties, `name`, `code`, `direction`,
and `locale` (the latter leads to a locale file).

As with other files, there is a `localization-strings` object, keyed to
language code, which is keyed to an object of keys (which can be strings,
arrays of strings, or other objects of keys).

The locale files referenced by the `locale` property within `languages.json`
(by default, those at `locales/`, e.g., `locales/en-US.json`), adhere to
[this schema](https://github.com/brettz9/textbrowser/blob/master/general-schemas/locale.jsonschema).

Locales are an object of keys (which may be strings, arrays of strings, or
are themselves objects).

Note that localization of specific file names and content, specific file
groups, and for your site navigation, on the other hand, are handled in
the other relevant sections of this document (see the `localization-strings`
property within metadata files, `files.json`, and `site.json`, respectively).

#### `site.json`

*(This file is not yet fully utilized in the app)*

This file expects a top-level `site` array property indicating nesting of the
site's page hierarchy (intended to be used for site map generation). The file
also expects a `navigation` property (with the same allowable values, or even
a [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
pointing to `site`) to indicate the subset of this site
available on the navigation bar (an array with strings or nested child
arrays of strings). Besides creating a navigation bar, it is
also intended to be used to generate breadcrumbs, `<link rel=next/prev>` links,
and a sitemap.

As with other files, there is a `localization-strings` object, keyed to language
code, which is keyed to an object of keys (which can be strings, arrays of
strings, or other objects of keys).

<!-- ## Plugin Format -->
<!-- Add once implemented; e.g., Each plugin file designated within `files.json` expects a JSONP call to `JSONP.executeCallback()` with an object with the following methods -->

## JavaScript API

The following indicates the JavaScript options that can tweak your
application's behavior beyond that determined by your JSON and schema files.

See `resources/user-sample.js` for an example (where the sample paths
are assumed to be relative to a package that contains *TextBrowser*
as a `npm` dependency).

-   ***TextBrowser(options)*** - Constructor which takes an options object
    with the following optional properties:

    -   `staticFilesToCache` - Array of files additional to those of *TextBrowser*
        which you will need offline. Defaults to the minimum recommended files:
        `['index.html', 'files.json', 'site.json', 'resources/user.js', 'resources/user.css']`

    -   `files` - Path for the `files.json` containing meta-data on the files
        to be made available via the interface. Defaults to `"files.json"`.

    -   `languages` - Path for the `languages.json` file containing meta-data
        on the languages to be displayed in the interface. Defaults to
        `"node_modules/textbrowser/appdata/languages.json"`.

    -   `site` - Path for the `site.json` containing meta-data on the site.
        (Only used currently for localization, but is intended for providing
        surrounding navigation information such as breadcrumbs.)

    -   `namespace` - Namespace to use as a prefix for all `localStorage`
        or `indexedDB` usage. Defaults to `"textbrowser"` but this could
        clash with other *TextBrowser* projects on the same origin, so you
        should change for your project. (This setting might be used in
        the future for any other namespacing.)

    -   `allowPlugins` - Enables `files.json`-specified plugins to be run.
        Defaults to `false` as it causes scripts to be run, but if you trust
        your JSON source files, you will presumably wish to enable this
        to get the full functionality designated within the JSON (and add
        the script files designated in `files.json` to your project).

    -   `trustFormatHTML` - If `true`, inserts fields designated by your
        JSON schema as `"format": "html"` as HTML without escaping; this
        option is off by default in case the source is untrusted,
        but if your `files.json`-indicated files are trusted, you will
        probably want to this set to `true`.

    -   `requestPersistentStorage` - Defaults to `true`. Set this to
        `false` if you don't want to even ask for permission to store
        the data files persistently. Note that this can really degrade
        performance, especially with large data files, as the whole data
        file must otherwise be downloaded for each result display.

    -   `localizeParamNames` - Boolean as to whether to localize parameter
        names by default (can be overridden by the user in preferences).
        (This has not been fully tested.)

    -   `hideFormattingSection` - Boolean as to whether to hide the formatting
        section by default (can be overridden by the user in preferences).
        This section might be changed to a plugin in the future in which case
        you'd just avoid designating it within `files.json`.

    -   `interlinearSeparator` - HTML code to be injected between each
        interlinear entry; this is not exposed to the user for
        security reasons (preventing [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)
        attacks); defaults to `<br /><br />` though one may set to
        another string such as `<hr />`. If you need greater control,
        you might consider monkey-patching the simple templating function
        `Templates.resultsDisplay.interlinearTitle` (and optionally
        setting `interlinearSeparator` to an empty string if you use that
        function to handle the separation), but please note that this API
        could change. It is also desired for us to allow users to have
        some predefined choices.

    -   `serviceWorkerPath` - Service worker path which defaults to
        `"sw.js"` (which, if you are including *TextBrowser* via npm,
        will be within your own project root). This should probably not
        be adjusted (and if you do want to adjust it, it may be better
        to file an issue or PR to allow us to provide choices among
        various default-available service worker/caching patterns).

    -   `showEmptyInterlinear` - Whether to show empty interlinear entries
        (with a title)

    -   `showTitleOnSingleInterlinear` - If only the main item is present in
        an interlinear-enabled column, this determines whether a title (if
        enabled) will be shown.

As per [semantic versioning](http://semver.org/) used by `npm`,
our API should continue to work until an increment in the major release
number.

The rest of the API used internally is unstable and should not be relied
upon for monkey-patching.

## To-dos (High Priority)

1.  Waiting ([JSON UI Schema](https://github.com/json-schema-org/json-schema-spec/issues/67)
    or [JSON Schema Annotation and Documentation Extension](https://github.com/json-schema-org/json-schema-spec/issues/136)):
    i18n: Utilize more standard mechanism instead of our `localeKey`; might also use
    substitutable JSON References (see <https://github.com/whitlockjc/json-refs/issues/54#issuecomment-169169276>
    and <https://github.com/json-schema-org/json-schema-spec/issues/53#issuecomment-257002517>).
1.  Waiting: ES6 Modules in browser: Switch to imports over script tags and
    functions passing main functions as arguments

1.  Document need of setting certain locale strings, including `sites.json`.
1.  Use schema-detection of type for sorting--integer
    parsing only on URL params per schema); see `resultsDisplay.js` with to-do
    by `parseInt` (and also see `String()` conversions)
1.  Get file names to be namespaced to group name to avoid name clashes
1.  Locales
    1.  Check `localizeParamNames` (preference)?
    1.  Test all locales and works and combos
1.  Default field(s) and default value(s) for when no text is entered and a reasonable
    sample is desired to be shown. Use `default_view` already spec'd in metadata schema
    and used in files.
1.  Add prior transpose functionality (affects header, footer, and body)
1.  Expose interlinear `showEmptyInterlinear` and `showTitleOnSingleInterlinear` to the
    user interface
1.  Uncomment and complete random code
    1. random within specific part of browse field range (e.g., within a specific book)?
        1. Have special meta-data for per book/chapter maximums (Bible/Qur'an) to allow accurate and also for random verses?
    1.  with context
    1.  Leverage this code for random to implement random feature across
        works within group or across all groups
1.  Optimize Jamilih to build strings (for performance and also for
    server) and utilize here; also to preprocess files like our templates
    to convert Jamilih to complete string concatenation as is somewhat faster
1.  Plugins/Automated fields
    1.  Include extensibility mechanism
        1.  Admin/files-driven and ideally user-driven (though security issue for
            additive approach); could let plugin itself accept user input
        1.  Additive or reductive (omitting/merging)
            1.  Columns or rows
                1.  Admin-controlled merging/omission of columns like interlinear
                1.  Merging rows with same number
                1.  Metadata for default field column placement and table/field
                    applicability
        1.  Browse fields or field list
        1.  Modifying existing content or not
            1.  Splitting columns (e.g., by line break)
            1.  Splitting rows by element (e.g., `<hr />`)
                1.  With optional `rowspan`/`colspan` for non-split portions of row/column
            1.  Overlays
        1.  Levels of applicability
            1.  Automated whole document/table-level or column-level
                changes (e.g., word counts) or even row-level/cell-level (including language code)
            1.  Spans across section
        1.  Provide example plugins of each type for this version if possible
        1.  Define all possible areas as plugins? e.g., Move search/CSS/interlinear, advanced
            formatting, or even browse fields and/or field lists and/or search as a whole to plugins?
            If doing so for individual fields in field lists, should support adding, e.g., pull-downs,
            even multiple ones for arguments (e.g., a web search plugin could specify the desired
            search engine)
    1.  Caching for automated field content like translations (with ability to rebuild)
    1.  Specific automated fields
        1. Previously implemented:
            1.  Option to show renamed fields (like "Book #" -> "Book Name" for Bible) before
                renaming (reimplement as additive plug-in but with one field on
                by default and the other off); already has placeholder in `files.json` - add to `field-alias.js`; already added to new version but need to reimplement as plugin
            1. Synopsis, Roman numerals, Chinese numbers, word-by-word translation,
                auto-romanized Persian/Arabic, Persian with English tooltips,
                English with Persian/Arabic tooltips, ISBN for Collins (use JSON Schema
                `format` for link detection--might also reimplement ISBN to make use of
                JSON Schema format);
                text-to-(Google search, Google define, Wikipedia, etc. edit pages)-links
        1.  Auto-links by verse to relevant forums, wikis, blogs, or personal
            notes pertaining to a given verse
            1.  Built-in (including offline or only offline) note-taking
               (local/remote and wiki WYSIWYG with Git version control?);
               modular loading of others' notes?
        1.  Back-links for index entries (which needs its own JSON Schema-based
            project for the hierarchical representations (see
            [TEI](http://www.tei-c.org/release/doc/tei-p5-doc/en/html/CO.html#CONOIX)
            for ideas)) including optionally merging them for different books
        1.  Support metadata to omit or combine fields during browsing (like
            checkboxes and interlinear field, but admin-set; also ensure, or
            add option for, no line breaks or indication of original source
            column within interlinear display so not bloating or surfacing
            internal column differences to users); increment counts despite
            some surfacing, as better ensures future compatibility/portability
        1.  Automated field to split up rows based on presence of `<hr />` or
            `<a id=>`, etc., with the ability to browse by such numbers (would
            ideally tap into browsing autocomplete code indicating min/max too).
            Optionally get `rowspan`s (or even `colspan`s) for additional
            columns (e.g., a field spanning by whole pages of a book and another
            field spanning only by paragraphs) - use some kind of counter and
            don't display the HTML until finished cycling??; also figure out
            how to reassemble if the minute fields are not needed (e.g., if
            the user only wants to see the text by paragraph and not anything
            related to by page); will provide a new browsing column and also
            divide certain existing one(s)
        1.  Allow automated algorithm to merge, remove rows (e.g., intro
            section of text with same "0" number)
        1.  Splitting columns by line break, etc.
        1.  Means on results display page to highlight (including
            discontiguous) selections and convert this into a new selection
            and/or syntax (generic to *TextBrowser* and/or canonical, ideally
            human-readable based on JSON-supplied information; e.g., for the
            Bible, `Matt. 5:10-12`); use with `postMessage` to-do to supply
            syntax back to another site
        1.  Add an "overlay" column like interlinear, but which overlays by
            tooltip if any data is present; can also use metadata if the overlay
            is within-cell (and this metadata can also be used for putting
            overlay data in its own column too, albeit with only partial
            mapping to the other columns, e.g., if our "Baha'i translation"
            had not already been put into its own column, a metadata mapping
            may only have been for two discontiguous sentences out of a
            paragraph, but could still show such sentences reassembled (with
            some kind of separator) in a paragraph-based cell)
            1.  Deal with other metadata/automated (besides overlays) which is
                intended to allow collapsing of ranges (above paragraph cells, but
                may overlap); do as multiple tbodies but needs to be done
                dynamically since may wish alternate (and nestable) collapsing
                (e.g., collection->book->chapter, user-contributed metadata
                sections, etc.); allow collapsing/expanding of all fields by one
                click button outside table (or by level); allow automated
                collapsing based on sequentially exact values (e.g., until
                rows stop having a column with value "1")
            1.  Allow collapsing even within cells (as with overlays) (like
                our "Baha'i Translation" could have been). Also make
                non-metadata regions collapsible so can hide them from view.
            1.  Allow something to be prefixed to interlinear number to
                indicate the field should be treated as an overlay (tooltip);
                if so, may need tooltip to be in blocks in case multiple
                columns added. But also need to have section for automated
                fields separate from the regular fields for those fields
                which do not map exclusively by cell boundaries (or
                relatively within them).
            1.  Allow types of overlays (or "mashes") such as underlays (adding
                invisible metadata), onlays/"mash ons" (replacing text in place),
                as well as regular overlays (adding text via mouseover); let
                these be alterable as possible by the user (e.g., text might
                be desirable to replace existing text or put it as a mouseover)
            1.  Allow for dynamic addition of JSON overlay sources or metadata
                to work selection/work display files?
            1.  See bahaiwritings project re: using Firefox's [Browser API](https://developer.mozilla.org/en-US/docs/Web/API/Using_the_Browser_API)
                to allow independent navigation controls for each iframe (and
                side-by-side viewing of verses/lines and commentary)
1.  As with table/array-of-arrays schema, develop schema for
    outlines (and utilize, e.g., with JSONEditor)!
1.  Develop footnote targeting mechanism to hide/reveal footnotes inline
    (based on a `data-footnote` attribute or the like). Utilize JSON
    Schema `links` for indicating footnote location in document then
    allow HTML `<a href>` to point to the scheme designated therein.
1.  Search/Sorting
    1.  Add to preferences system for saved/favorite, recent
        searches/browses, etc.
    1.  Specific filtering by textbox next to checked field selection
        (commented out in workDisplay as not working yet in resultsDisplay)
    1.  Schema-aware and metadata-aware column sorting options (e.g., sort by
        order and ASC/DESC) with user customizability (i.e., presorting along
        with dynamic client-side after-load sorting, with or without search
        filtering; use "search" in locale to add this filtering to UI)
    1.  Option for highlighting search terms (with own styles), and/or if context
        is specified, to highlight rows with search results and alternatively
        style context rows (distinguish from random context?)
    1.  Optional links to go to previous/next results if only loading a subset
        of available content (allow customization of size of chunking in
        preferences as well as on the fly)
    1.  Support user-driven or automated (expandable) ellipses for surrounding
        content with option for highlighting these (e.g., to highlight a
        parts of a sentence, including one spanning multiple rows/verses);
        consider range for highlighting if verse range + added context range
        not enough
    1.  Text box parsing? (for browsing ranges too)
        1.  Ensure browsing can be done through URL params, especially
            to use in conjunction with bookmark keywords (in which case
            it particularly ought to be available through a single param
            without need for system allowing expansion)
    1.  Ability to run XPath/`querySelector`-like queries against
        `format: "html"` fields relative to specific cells (or against
        original source HTML or XML document); also highlighting as
        part of page anchor ala original XPath schemes (e.g.,
        `&anchor=.myClass` with `text()` from [HTTPQuery](https://github.com/brettz9/httpquery)
        to identify by text content too if not a full blown query/transformation
        language)?

## To-dos (Medium Priority)

1.  Separate formatting within Jamilih code to CSS; unit test and performance
    by being able to use a natively stringifying version of Jamilih
    (once complete)
1.  Utilize meta-data properties, `primary_text_field`, `orig_lang_field`,
    `orig_langs`, e.g., to allow for user to display main language and
    originals but not others? Use `hasFieldvalue` and `roman` (for
    non-automated Roman fields--could designate as Latin language, but
    need a way to know are numerals for sorting if Arabic numerals not
    provided)?
1.  URL (sorted) params keyed to `outerHTML` of page for caching
1.  Incorporate speech synthesis from
    <http://bahai.works/MediaWiki:Common.js>, allowing different
    speech voices for different rows or columns (or just let user
    add CSS to columns to mark). Could optionally display speech
    controls on results display page
1.  Callback options to replace or receive the results from each screen for
    further manipulation (e.g., to add navigation, pending or different from
    the intended `sites.json` behavior).
1.  Allow tables to be re-sortable via JavaScript which allows
    sorting by multiple columns with various data, etc.
1.  Build library (for browser or Node) to utilize `site.json` file to add
    site-wide navigation bar headers, breadcrumbs,
    `<link rel=next/prev/contents/etc.>`, sitemap, and page title (supplied
    argument of the current page)? Also about text and removecookies/
    choose a different language, and ability to optionally turn off in
    results display (e.g., so a table's results can be embedded off-site).
1.  Support JSON types for `outputmode`, opening
    new window with content-type set
1.  Node.js (and/or PHP)
    1.  Optionally allow server push and/or WebSockets updates of
        content and software
        1.  Allow centralized copies or distributed versioning,
            including single copy storage
    1.  Delivery of HTML content by same URL so third parties can
        consume without JavaScript
    1.  [Progressive enhancement is faster](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)
    1.  Serve JSON files immediately and then
        inject config for `index.js` to avoid reloading?
    1.  Make tools to build `languages.json` based on available
        locale files, and build `files.json` based on a target directory.
    1.  [HTTPQuery](https://github.com/brettz9/httpquery) headers
1.  `filetypes.json` (from WebAppFind) for app and schema association?
    (files.json for permitted files - a file which could be auto-created,
    e.g., if server permits all in a directory); especially potentially
    useful with JSONEditor to allow editing of these files, app types
    (replacing assistant.php):
    1.  langs + locale / locale only
    1.  files/dbs->file (supply language choice)->file contents
    1.  schemas
1.  Code to populate locale files with missing localization strings and
    report the missing ones (and sort as such in assistant file); put
    assistant localization keys in own file?
    1.  Find translators to do further localization of the interface
    1.  Assistant file (for translating; needs server for password);
        work optionally with main locales, files, table, and field
        locale info. Use already-existing localization strings.
    1.  Add tooltips and table summaries, etc. back (see locale file for
        these and reapply any other unused) and add any missing ones
        describing how to use the elements
1.  Give option to user (as opposed to admin) for preset interlinear choices
    (e.g., separate by line breaks or page breaks)

## To-dos (Lower priority)

1.  Preferences
    1.  Change Preferences to be set before work or with work but specific to it
    1.  Change Preferences to disallow URL overriding
    1.  Change preferred languages preference to be dynamic with work column languages
        1.  Preference to remember enabled checkboxes and formatting
1.  Change to utilize history.pushState?
    <https://developer.mozilla.org/en-US/docs/Web/API/History_API>
1.  Use ES6 modules (babel)
    1.  dynamic or hierarchical loading of CSS too?
1.  Sort file selection listing per locale?
1.  Node.js synchronization of locale files?
1.  Could allow Node to built schemas, optionally allowing or disallowing
    unresolved JSON References.
1.  Might support arbitrary JSON and JSON Reference querying
   (if `files.json` configured to indicate a wildcard or something)
1.  Update "about" text and utilize on popup or something?
1.  Change "Saving settings as URL" to a redirect if faithfully
    copying everything?
1.  Provide option to skip over `langs.json` with a default language
    (though discourage since the UI translations may help some people).
1.  Allow user to pass array of language codes that can be checked
    at the beginning of the string without need for `lang=` (or for
    the i18n of "lang"?).
1.  `window.postMessage` API (since CORS is only for Ajax and
    `document.domain` is only for subdomains).
1.  `indexedDB` for JSON data
1.  Restore `tabindex` usage
1.  Restore option from work page to have a checkbox on whether to go to "Advanced mode",
    opening the styling options by default or not.
1.  Testing
    1.  Start browser testing: <https://www.npmjs.com/package/testcafe> (or
        possibly <http://nightwatchjs.org/>); headless Chrome?

## Testing

If you instead merely wish to test the current repository, you can:

1. Clone the repository. Note, however, that we may periodically
rebase the code, making it harder for one to keep up to date in this manner.
2. Install the package's dependencies via:
```shell
npm install
```
3. Test via:
```shell
npm test
```

Note, however, that much of testing will depend on a particular
application. The [bahaiwritings](https://bitbucket.org/brettz9/bahaiwritings/)
project hosts validation of specific files expected by TextBrowser, such as
`files.json` and specific schemas and meta-data files needed for that project.

If you merely wish to see the app running in a server, you can run:

```shell
npm start
```

If you do not wish to automatically open a tab each time the command is
run, use:

```shell
npm run start-no-open
```

You can also use this latter option to run the browser tests
(from <http://127.0.0.1:8080/test/>).

## Contributing

PRs are most welcome, including for additional languages/locales.

Tests will ideally be run before submission of a PR.

At present we only have schema validation and lack UI and unit
testing coverage (PR's welcome for this too!).

Note that we hope to create an extensible plug-in system, so
enhancements to the core ought to be confined to the
main project goals and be oriented toward reuse across all
projects, relegating any specialized tools to plugins (though
we can set up the wiki to point to your plugins once a plugin
system may be in place).

## History

One PHP/MySQL-based version was released in 2005-12-22 and was my
first project used in aiding my learning programming.

It was hosted at http://bahai-library.com/browser/ and https://bahai9.com/browse0.php

On Baha'i Libary Online, the Web Archive indicates its presence as far back as 17 May 2006:

- http://web.archive.org/web/20060517012851/http://bahai-library.com:80/browser/browse0.php
- http://web.archive.org/web/20060505010948/http://bahai-library.com:80/browser/browse0.php?langu=en
- http://web.archive.org/web/20060430170322/http://bahai-library.com:80/browser/browse.php?langu=en&file=Bible

## About

This initiative is associated with the
[BADI](https://groups.yahoo.com/neo/groups/badi/info)
mailing list created to foster collaboration among open source projects
and initiatives such as this which are Baha'i-inspired but will or may be
of interest to the wider software community as well.
