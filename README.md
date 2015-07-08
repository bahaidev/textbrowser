Due to changes in PHP, the code is no longer working and needs a rewrite.

However, I have begun to rewrite in client-side JavaScript so that
it can work offline.

----
2005-12-22

# Text Browser

This software currently allows one (through use of PHP and MySQL) to have multilinear texts (represented in SQL tables that you must yourself upload, though it is hoped that for our main version of this project--which is a Baha'i project--the addition of these tables (which are Scriptures) can also be automated) automatically be accessible from a main interface, with each text being given its own customizable interface to allow browsing of the contents of the text. Presently there is a large amount of manual customization required to make it work, but it is hoped that this problem can be overcome in the future.

If you would be willing to participate in the development of this software, please email brettz9@yahoo.com and/or visit http://bahai-library.com/browser for the latest code.


The "Text Browser" software was written by Brett Zamir.


The above developer holds the copyright to this work, and it is licensed under the terms of the GNU General Public License, version 2 (see http://www.fsf.org/licensing/licenses/gpl.html). Derivative works and later versions of the code will also be considered free software licensed under the same terms.

# Todos (old, from code)

## Intended significant future features of this browse system

1. See also todos inside index.js
1. Add/Add back automated: Synopsis, Roman numerals (pm, gwb), Chinese numbers, word-by-word translation (Persian/Arabic/German/English), auto-romanized Persian (Baha'i-style with help link to http://bahai9.com/wiki/Pronunciation ), Persian with English tooltips, English with Persian tooltips, text-to-(Google search, Google define, Wikipedia, bahai9.com edit pages); add Word-by-word/phrase mapping
    1. Reverse engineer missing work by using bahai_locales database (which contains more than localization info: automated column data, alternative field names, etc.)
    1. Metadata for default field column placement and table/field applicability
    1. Automated word-by-word translations, auto-links to Google, Amazon, etc.
    1. Auto-links by verse to relevant forums, wikis, blogs, or personal notes pertaining to a given verse...
    1. Add an "overlay" column like interlinear, but which overlays by tooltip if any data is present; can also use metadata if the overlay is within-cell (and this metadata can also be used for putting overlay data in its own column too, albeit with only partial mapping to the other columns, e.g., if the "Baha'i translation" had not already been put into its own column, a metadata mapping may only have been for two discontinuous sentences out of a paragraph, but could still show such sentences reassembled (with some kind of separator) in a paragraph-based cell)
1. As with table/array-of-arrays schema, develop schema for outlines (and utilize)
1. Go to previous/next results (allow customization of size on the fly as well as in preferences)
1. Hide advanced formatting options (make savable in preferences)
1. Give tooltips to tell how to use the elements
1. Make full preferences system for saved/favorite, recent searches/browses, etc.
1. Allow tables to be resortable via a Javascript which allows sorting by multiple columns with various data, etc.
1. Figure out how to get rowspans (or even colspans) for additional columns (e.g., a field spanning by whole pages of the Iqan and another field spanning only by paragraphs) - use some kind of counter and don't display the HTML until finished cycling??; also figure out how to reassemble if the minute fields are not needed (e.g., if the user only wants to see the text by paragraph and not anything related to by page)
1. Further localization of the interface (including column aliases, etc.)
1. Allow combined fields for browsing (Collins)
1. Separate formatting within Jamilih code

## Intended minor features

1. Add link color (browse.php and browse9.php) as option to advanced formatting

## Intended tweaks

1. Especially those variables that will be accessed by other scripts, it would make more sense (and take less space) to use an SQL database to store them rather than pass them between forms via hidden elements, etc. (there are a number of these)
1. Add Password, etc. into transcluded inc file to avoid duplication between files in the coding here - if truly duplicated)
1. Upload newer Collins and fix any bugs in formatting.
1. The base code of browse0.php, browse.php, browse9.php are all XHTML compliant, but there are a good number of invalid XHTML in the SQL databases Qur'an and Bible (links w/o quotes) that need to be replaced as well as the XHTML and link locations in the Iqan copy
