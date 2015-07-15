Due to changes in PHP (and the code being very old), the
code currently in this repository is not working and needs a rewrite.

However, I have begun a rewrite in client-side JavaScript so that
it can work offline.

----

# Text Browser

This software currently allows for multilinear texts (represented in user-customizable JSON tables. These texts are accessible from a main interface (currently requiring a whitelist though it may be made customizable in the future for open-ended usage/dynamic server-side generation of available files), with each text being given its own customizable interface to allow browsing of the contents of the text, utilizing JSON Schema and metadata JSON associated with the files.

# Installation

`bower install`

# Usage

1. Copy the file `index-sample.html` as `index.html` and customize if required (this may not be required if the next step is followed).
1. Add `resources/user.js` and `resources/user.css` and customize as desired (one may just wish to add blank files for these or remove reference to them in `index.html`).
1. Add any new JSON data files to your own subfolder of `/bower_components` (along with JSON Schema and metadata files; see the "JSON Schema and metadata files and fields in use" section). If this data is contained within a Bower repository, you can naturally load this via Bower.
1. Add references to the JSON data files added in the previous step in a new file `appdata/files.json` (a sample can be copied from `appdata/files-sample.json`).
1. Copy the file `textbrowser-sample.appcache` as `textbrowser.appcache` and add any other files required by your application that you wish to be accessible in offline mode (including the user files added in the previous steps). (HTML currently only allows one cache file apparently as per <https://html.spec.whatwg.org/multipage/semantics.html#attr-html-manifest>.) In order to keep all of your content together, you may instead wish to add an AppCache file within your `bower_components` repository subfolder and modify `index.html` to point to it so that you can maintain all files needed for caching in that file.
1. New language information should be added to `/appdata/languages.json` and new translations to a new file in `/locales`. This information should be generic to the application, so please contribute back through pull requests if you have new locales to offer.

# JSON Schema and metadata files and fields in use

- (To document; for now, see the `/general-schemas` directory and for usage examples, as well as the subdirectories within `/data`)

# Todos

1. See also todos inside index.js
1. As with table/array-of-arrays schema, develop schema for outlines (and utilize)!
1. Separate formatting within Jamilih code to CSS
1. Node.js (or PHP) for serving JSON files immediately and then injecting config for index.js to avoid reloading
1. Make Node.js/PHP tools to build `languages.json` based on available locale files, and build `appdata/files.json` based on a target directory.
1. Add/Add back automated: Synopsis, Roman numerals, Chinese numbers, word-by-word translation, auto-romanized Persian/Arabic, Persian with English tooltips, English with Persian/Arabic tooltips, text-to-(Google search, Google define, Wikipedia, etc. edit pages); add Word-by-word/phrase mapping
    1. Reverse engineer missing work by using `bahai_locales` database (which contains more than localization info: automated column data, alternative field names, etc.)
    1. Metadata for default field column placement and table/field applicability
    1. Automated word-by-word translations, auto-links to Google, Amazon, etc.
    1. Auto-links by verse to relevant forums, wikis, blogs, or personal notes pertaining to a given verse...
        1. Built-in (including offline or only offline) note-taking (local/remote and wiki WYSIWYG with Git version control?); support loading from `bower_components`
    1. Add an "overlay" column like interlinear, but which overlays by tooltip if any data is present; can also use metadata if the overlay is within-cell (and this metadata can also be used for putting overlay data in its own column too, albeit with only partial mapping to the other columns, e.g., if our "Baha'i translation" had not already been put into its own column, a metadata mapping may only have been for two discontinuous sentences out of a paragraph, but could still show such sentences reassembled (with some kind of separator) in a paragraph-based cell)
        1. Deal with other metadata/automated (besides overlays) which is intended to allow collapsing of ranges (above paragraph cells, but may overlap); do as multiple tbodies but needs to be done dynamically since may wish alternate (and nestable) collapsing (e.g., collection->book->chapter, user-contributed metadata sections, etc.); allow collapsing/expanding of all fields by one click button outside table (or by level); allow automated collapsing based on sequentially exact values (e.g., until rows stop having a column with value "1")
        1. Allow collapsing even within cells (as with overlays) (like our "Baha'i Translation" could have been). Also make non-metadata regions collapsible so can hide them from view.
        1. Allow something to be prefixed to interlinear number to indicate the field should be treated as an overlay (tooltip); if so, may need tooltip to be in blocks in case multiple columns added. But also need to have section for automated fields separate from the regular fields for those fields which do not map exclusively by cell boundaries (or relatively within them).
        1. Allow types of overlays (or "mashes") such as underlays (adding invisible metadata), onlays/"mash ons" (replacing text in place), as well as regular overlays (adding text via mouseover); let these be alterable as possible by the user (e.g., text might be desirable to replace existing text or put it as a mouseover)
        1. Allow for dynamic addition of JSON overlay sources or metadata to work selection/work display files?
1. Optional links to go to previous/next results if only loading a subset of available content (allow customization of size of chunking in preferences as well as on the fly)
1. Hide advanced formatting options (make savable in preferences)
1. Support optional tfoot to repeat header info on bottom?
1. Make full preferences system for saved/favorite, recent searches/browses, etc.
1. Allow tables to be re-sortable via a JavaScript which allows sorting by multiple columns with various data, etc.
1. Figure out how to get rowspans (or even colspans) for additional columns (e.g., a field spanning by whole pages of a book and another field spanning only by paragraphs) - use some kind of counter and don't display the HTML until finished cycling??; also figure out how to reassemble if the minute fields are not needed (e.g., if the user only wants to see the text by paragraph and not anything related to by page)
1. Further localization of the interface
1. Support metadata to combine fields during browsing
1. filetypes.json (from WebAppFind) for app and schema association? (files.json for permitted files - a file which could be auto-created, e.g., if server permits all in a directory); especially potentially useful with JSONEditor to allow editing of these files, app types (replacing assistant.php):
    1. langs + locale / locale only
    1. files/dbs->file (supply language choice)->file contents
    1. schemas

# Todos (Lower priority)

1. Add link color (browse.php and browse9.php) as option to advanced formatting
1. Sort file selection listing per locale?
1. Node.js synchronization of locale files?
1. Might support arbitrary JSON and JSON Reference querying (if files.json configured to indicate a wildcard or something)
1. Update "about" text and utilize on popup or something?
1. Assistant file (for translating; needs server for password); work optionally with main locales, files, table, and field locale info
1. Add tooltips and table summaries, etc. back (see locale file for these and reapply any other unused) and add any missing ones describing how to use the elements
1. Change "Saving settings as URL" to a redirect if faithfully copying everything?
1. Provide option to skip over `langs.json` with a default language (though discourage since the UI translations may help some people).

# History

One PHP-based version was released in 2005-12-22 and was my first project used in aiding my learning programming.
