Due to changes in PHP (and the code being very old), the
code currently in this repository is not working and needs a rewrite.

However, I have begun a rewrite in client-side JavaScript so that
it can work offline.

----

# Text Browser

This software currently allows for multilinear texts (represented in
user-customizable JSON tables. These texts are accessible from a main
interface (currently requiring a whitelist though it may be made
customizable in the future for open-ended usage/dynamic server-side
generation of available files), with each text being given its own
customizable interface to allow browsing of the contents of the text,
utilizing JSON Schema and metadata JSON associated with the files.

# Installation

The intent of this repository is for it to be used as a dependency.

Add the following to your application's `bower.json`:

```json
"dependencies": {
    "textbrowser": "git@github.com:brettz9/textbrowser.git#master"
}
```

If you instead merely wish to test the current repository, adding your
own data files within it, you can install its dependencies via:

```console
bower install
```

# Usage

NOTE: The following needs to be modified according to new usage, invoke
this file from `index.html` with locations for `files.json` and optionally
`languages.json`; also get rid of references to files-sample.json as
including it there; reference metadata and schema samples inside the
Baha'i repo too)

1.  Location: <https://bitbucket.org/brettz9/bahaiwritings>

The following instructions are aimed at those adding *TextBrowser* as a
bower dependency of their own project. Notes follow for those seeking to
add their files within this repository.

If you would like to see a sample package implementing the
following, see the
[bahaiwritings](https://bitbucket.org/brettz9/bahaiwritings)
project.

The recommended project directory structure (which works with the
default paths) is as follows:

-   ***bower.json*** - Should indicate `textbrowser` as a dependency as per
the "Installation" section above. See `bower-sample.json` for an example.

-   ***files.json*** - Points to your data files (e.g., any kept in `data/`).
Is an object with a `groups` property set to an array of file groups where
each group has the property `name` for a file group display name as a string
or localization key; an optional `directions` string or localization key;
an optional `baseDirectory`, `schemaBaseDirectory`, and
`metadataBaseDirectory` for base paths; and a `files` array property with
each file containing the properties, `name` for the file name as a string
or localization key; `file` for file contents (recommended as a
[JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03)
object which will be resolved relative to any `baseDirectory` properties);
and `schemaFile`, and `metadataFile` file paths (relative to the respective
base paths). The same base directory properties are also available at the
root of the file and if present will be prefixed to any file-group-specific
base paths and the file. You may wish to validate your `files.json` with
`general-schemas/files.jsonschema`, but this is not required.

-   ***index.html*** - The main application code. One can use
  `index-sample.html` as is or modified as desired. Note that it
  may be sufficient to modify `resources/user.css` and `resources/user.js`.

-   ***textbrowser.appcache*** - Offline AppCache manifest. You may base
this off of `textbrowser-sample.appcache`, being sure to add your
own data files for offline caching. If you are using `user.css` or
`user.js`, be sure to uncomment in the copied file (HTML currently
only allows one cache file apparently as per
<https://html.spec.whatwg.org/multipage/semantics.html#attr-html-manifest>,
so we apparently cannot add to this dynamically nor use data: URLs.)

-   ***.htaccess*** - If using Apache, you may wish to have this file
  copied from TextBrowser's `.htaccess-sample` in order to serve the
  proper Content Type for the AppCache file.

-   ***resources/user.css*** - Add any custom CSS you wish to apply
  for `index.html`.

-   ***resources/user.js*** - Add any JavaScript you wish to use. Unless
  already invoked in `index.html`, you should call the `TextBrowser`
  constructor here. See TextBrowser's `resources/user-sample.js` for
  a pattern you can copy and optionally adapt.

-   ***bower_components*** - *TextBrowser* and its dependencies will be
  added here via bower install as well as any dependencies you indicate
  within `bower.json`.

-   ***data/*** - Directory recommended as a convention for holding data
  files. It is also recommended that child directories be named for each
  file group, and within each file group, have the JSON data files
  (adhering to `general-schemas/table-container.jsonschema` and its
  subschema `array-of-arrays.jsonschema`) as well as "schema" and
  "metadata" directories containing the specific JSON schemas for each
  data file (adhering to `general-schemas/table.jsonschema`) and the
  TextBrowser-specific meta-data files (adhering to
  `general-schemas/metadata.jsonschema`). See the "JSON Schema and
  metadata files and fields in use" section.

New language information should be added to TextBrowser's
`/appdata/languages.json` (and the copy of this file,
`languages-tb.json`, which only differs in its `localeFileBasePath`)
and new translations to a new file in TextBrowser's `/locales`. This
information should be generic to the application, so please
contribute back through pull requests if you have new locales
to offer. However, you may also supply a `languages` property
pointing to a languages file of your own choosing. See
`general-schemas/languages.jsonschema` and
`general-schemas/locale.jsonschema` for the composition of these file(s).

For those wishing to test files within the TextBrowser project itself
(not generally recommended), you can follow the follow tweaks to
the above instructions:

1.  You should not need to alter `bower.json` though you may install Bower
    dependencies (e.g.,
    `bower install git@bitbucket.org:brettz9/bahaiwritings.git`)
    if you update paths accordingly. You may alternatively add data
    files to the reserved `data` directory at the root of TextBrowser.

1.  Change paths. The path prefix `bower_components/textbrowser` in your
  `index.html` and `textbrowser.appcache` will need to be stripped in
  this environment. You will also need to change the `languages` property
  in the `resources/user.js` call to the *TextBrowser* constructor to point
  to `languages-tb.json` instead of `languages.json` or otherwise supply
  a languages file which resolves to the correct path).

# API

The API can be adapted as needed. The file in `resources/user-sample.js`
shows its usage (assuming paths relative to a package containing
*TextBrowser* as a dependency).

-   ***TextBrowser(options)*** - Constructor which takes an options object
    with the optional properties, `files` and `languages`.

    -   `files` - Path for the `files.json` containing meta-data on the files
       to be made available via the interface. file Defaults to 'files.json'.

    -   `languages` - Path for the `languages.json` file containing meta-data
      on the languages to be displayed in the interface. Defaults to
      'bower_components/textbrowser/appdata/languages.json'.

-   ***init*** - Default implementation merely invokes `displayLanguages`.

-   ***displayLanguages*** - Retrieves the `options.language` JSON file
  of languages and set the `langData` property with the JSON retrieved.
  Also invokes `paramChange` and sets up an `onhashchange` listener to
  invoke `paramChange`.

-   ***getDirectionForLanguageCode*** - Utility for getting the directionality
  of a language code utilizing information in the JSON file supplied as
  `options.languages`. Utilized by `paramChange`.

-   ***paramChange*** - Contains the main code for handling display of
  languages, works, or results. Will probably be broken up further
  in the future.

# JSON Schema and metadata files and fields in use

-   (To document; for now, see the `/general-schemas` directory and for
  usage examples, as well as the subdirectories within <https://bitbucket.org/brettz9/bahaiwritings>)

# Todos

1.  WAITING (version update): Add and make use of updated json-refs to make
  single `resolveRemoteRef` call (or whatever the new API may become) and
  try new relative refs feature.

1.  Change to utilize history.pushState?
    <https://developer.mozilla.org/en-US/docs/Web/API/History_API>

1.  Check whether URLSearchParams.toString is still working

1.  Fix code to work with table-specific/field-specific locale data that
    has been moved to files.json (and languages.json) and metadata files
    for modularity; then avoid unchecking when clicking button re: matching
    current locale if `fieldvalue` is present (i.e., replace `hasFieldvalue`
    functionality)

    1.  Update README and metadata.jsonschema (or table.jsonschema?) to
      reflect new changes

1.  Rename localization strings, esp. auto-field ones; consider making
    some reusable, pointing to scripts, or how else to designate auto-field
    plugins?

    1.  Update README and files.jsonschema to reflect new changes

1.  Choose clearer naming/structure for locale table/field keys

    1.  Consider `tablealias` and default to `table` or something (as
          `fieldalias` defaults to `fieldname`); aliased heading (also used
          as the title of the page)

1.  Update schemas to reflect new localization-related file changes
    (languages.json, files.json, metadata files) and make one for
    site-sample.json (and move to bahaiwritings as site.json)

1.  Review code for readability, refactoring opportunities

1.  Aliases

    1.  Consider using `prefer_alias` for field alias use and optionally
       show both if not given (e.g., for Bible books with
       `prefer_alias`, show only the pull-down of books whereas
       with the Qur'an (where Surah numbers are more commonly
       used) link a pull-down of Surah names to a textbox
       allowing numbers)?

    1.  Remove locale info for "numbers only" string key (including
        from locale files?) if allowing for aliased searches
        (e.g., "Gen")

1.  Build library (for browser or Node) to utilize site.json file to add
    site-wide navigation bar headers, breadcrumbs,
    link rel=next/prev/contents/etc., sitemap, and page title (supplied
    argument of the current page)? Also about text and removecookies.

1.  Code to populate locale files with missing localization strings and
    report the missing ones (and sort as such in assistant file); put
    assistant localization keys in own file?

1.  Node.js delivery of HTML content by same URL so third parties can
    consume without JavaScript

1.  Incorporate speech synthesis from
    <http://bahai.works/MediaWiki:Common.js>

1.  Options to have range of context and range for highlighting
    (with own styles) and anchoring

1.  CORS and HTTPQuery headers?

1.  Add content language(s) multiple select option to always browse for
    those in the desired locale(s); utilize
    "localization-strings"/&lt;code>/languages/&lt;code> in language.json

1.  Schema-aware and metadata-aware column sorting options (e.g., sort by
      order and ASC/DESC) with user customizability (i.e., presorting along
      with dynamic client-side after-load sorting, with or without search
      filtering; use "search" in locale to add this filtering to UI)

1.  Get the automated fields listed in drop-down menus; also new overlay
    type (See README todos)

1.  For `browse9.php` equivalent

    1.  Handle defaults for empty boxes if not already
    1.  Test all locales and works and combos
    1.  Utilize `prefer_alias`

1.  Use validators with all JSON Schemas and instances to confirm
schemas are defined properly

1.  Once stabilized, target "textbrowser" dependency mentioned above
by tagged version instead of `master`.

1.  As with table/array-of-arrays schema, develop schema for
outlines (and utilize)!

1.  Separate formatting within Jamilih code to CSS; separate business
and design logic for own sake and also for unit testing and performance
by being able to use a natively stringifying version of Jamilih (once complete)

1.  Node.js (or PHP) for serving JSON files immediately and then
injecting config for `index.js` to avoid reloading

1.  Make Node.js/PHP tools to build `languages.json` based on available
locale files, and build `files.json` based on a target directory.

1.  Add/Add back automated: Synopsis, Roman numerals, Chinese numbers,
    word-by-word translation, auto-romanized Persian/Arabic, Persian with
    English tooltips, English with Persian/Arabic tooltips,
    text-to-(Google search, Google define, Wikipedia, etc. edit pages);
    add Word-by-word/phrase mapping; add back-links for index entries (which
    needs its own JSON Schema-based project for the hierarchical
    representations), including optionally merging them for different books

    1.  Reverse engineer missing work by using `bahai_locales` database (which
       contains more than localization info: automated column data,
       alternative field names, etc.)

    1.  Metadata for default field column placement and table/field
        applicability

    1.  Automated word-by-word translations, auto-links to Google, Amazon, etc.

    1.  Auto-links by verse to relevant forums, wikis, blogs, or personal
        notes pertaining to a given verse...

        1.  Built-in (including offline or only offline) note-taking
           (local/remote and wiki WYSIWYG with Git version control?);
           support loading from `bower_components`

    1.  Add an "overlay" column like interlinear, but which overlays by
        tooltip if any data is present; can also use metadata if the overlay
        is within-cell (and this metadata can also be used for putting
        overlay data in its own column too, albeit with only partial
        mapping to the other columns, e.g., if our "Baha'i translation"
        had not already been put into its own column, a metadata mapping
        may only have been for two discontinuous sentences out of a
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

1.  Optional links to go to previous/next results if only loading a subset
    of available content (allow customization of size of chunking in
    preferences as well as on the fly)

1.  Hide advanced formatting options (make savable in preferences)

1.  Support optional tfoot to repeat header info on bottom?

1.  Make full preferences system for saved/favorite, recent
    searches/browses, etc.

1.  Allow tables to be re-sortable via a JavaScript which allows
    sorting by multiple columns with various data, etc.

1.  Figure out how to get rowspans (or even colspans) for additional
columns (e.g., a field spanning by whole pages of a book and another
field spanning only by paragraphs) - use some kind of counter and
don't display the HTML until finished cycling??; also figure out
how to reassemble if the minute fields are not needed (e.g., if
the user only wants to see the text by paragraph and not anything
related to by page)

1.  Further localization of the interface

1.  Support metadata to combine fields during browsing

1.  filetypes.json (from WebAppFind) for app and schema association?
    (files.json for permitted files - a file which could be auto-created,
    e.g., if server permits all in a directory); especially potentially
    useful with JSONEditor to allow editing of these files, app types
    (replacing assistant.php):

    1.langs + locale / locale only
    1.files/dbs->file (supply language choice)->file contents
    1.schemas

# Todos (Lower priority)

1.  Add link color (browse.php and browse9.php) as option
to advanced formatting

1.  Sort file selection listing per locale?

1.  Node.js synchronization of locale files?

1.  Might support arbitrary JSON and JSON Reference querying
   (if files.json configured to indicate a wildcard or something)

1.  Update "about" text and utilize on popup or something?

1.  Assistant file (for translating; needs server for password);
    work optionally with main locales, files, table, and field
    locale info. Use already-existing localization strings.

1.  Add tooltips and table summaries, etc. back (see locale file for
    these and reapply any other unused) and add any missing ones
    describing how to use the elements

1.  Change "Saving settings as URL" to a redirect if faithfully
    copying everything?

1.  Provide option to skip over `langs.json` with a default language
    (though discourage since the UI translations may help some people).

1.  ES6 Modules import of JavaScript in place of script tags;
    dynamic or hierarchical loading of CSS too?

# History

One PHP-based version was released in 2005-12-22 and was my
first project used in aiding my learning programming.
