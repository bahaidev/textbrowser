<?php

if( defined( 'HAVEACCESS' ) ) {

//////////////// XHTML headings //////////////////

$charset = "UTF-8";

if ($langu == "") {
	$langu = $defaultlanguage;
} // end if (if langu is not set)


// Get languages, direction and codes
get_language($langu);
get_language($defaultlanguage, 1); // Add a "1" to indicate the language to be set is the default


// Call function to generate localization variables

localize(1);

/////////////////// 
// Taking precautions (as in browse0.php for the table (alias) listing) that if the admin hasn't defined table-specific headings for a given book, an appropriate title can still be printed; it is possible for these strings to be null even if there is a default since the localize function makes an exception for 'tablehading' and 'tablealias'.

if ($strings["tableheading"][$file] != "") {
	$heading = $strings["tableheading"][$file]; // Also used below for h2
	$headerdirection = $textdir["tableheading"][$file];
} // end if (if there is a heading for the table)

elseif ($strings["tablealias"][$file] != "") {
	$heading = $strings["tablealias"][$file]; // Also used below for h2
	$headerdirection = $textdir["tablealias"][$file];
} // end elseif (if there is at least a specified alias for the table)

else {
	$temp = $lang_code;
	localize(1); // Go for the defaults
	$lang_code = $temp;
	
	if ($strings["tableheading"][$file] != "") {
		$heading = $strings["tableheading"][$file]; // Also used below for h2
		$headerdirection = $textdir["tableheading"][$file];
	} // end if (if there is at least a specified heading for the table in the default language)

	elseif ($strings["tablealias"][$file] != "") {
		$heading = $strings["tablealias"][$file]; // Also used below for h2
		$headerdirection = $textdir["tablealias"][$file];
	} // end elseif (if there is at least a specified alias for the table in the default language)

	else {
		localize(1);

		$heading = $file; // Also used below for h2
		$headerdirection = $textdir["browserfile"];
		$dontlocalizeagain = 1; // Just spare the running of an extra function (since it was already (by necessity) run within this else)--see the "if" just below
	} // end else (if there is no heading or alias set for the specific table--having this option allows titles to appear with the table name (in some form at least), even if a localization was not set (or if it was not set because the name is intended to be the heading))

	if (!$dontlocalizeagain) {
		localize(1); // Go back to the localization for the user's choice of language
	} // end if (if need to localize again)

} // end else (if there is no heading or alias in the given language)

// This will be overwritten in browse9.php if there is a file defined
$title = $strings["browserfile"].": ".$heading;


// Call header function to add XHTML headers
// If no file is set, refer the user back to the main page.

if (!$file) {
	headerAdd($charset, $defaultlanguage, $title, $headerdirection, "", $style);
	delaytime (0, $browserfile);
} // end if (if there is no file defined, redirect the user back to the main page)

// Get table metadata such as:
////// 1) The number of levels (e.g., the Bible with book, chapter, verse has 3) and their fields
////// 2) The number of options (e.g., the Qur'an can be browsed by Rodwell or traditional numbering--Fix: (later?) Any other reasonable options should also be added (e.g., to Collins esp.). Once searching has been added, this might be merged with that.)
////// 3) The fields to comprise the above-mentioned browsing options
////// 4) A default field and default value if the user does not specify a range.
////// 5) The original language (by code) of the table (would be used if implement a multilingual feature to allow users to view the table names in their original language, if they (the main text--not necessarily notes, etc.) were written in that language.
////// 6) The original language (by code) in which the table name and fields were written.
///////////////////

get_table($file);

} // end if defined HAVEACCESS
?>