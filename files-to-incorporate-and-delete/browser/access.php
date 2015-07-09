<?php

////////// Note to self: Do not open source this with the password data!!!!!
// Requires a constant to be defined already (in the calling script) and then sets the password data (you'll need to fill these in for your own system)

if( defined( 'HAVEACCESS' ) ) {

//////// Define database access passwords (serves also as adminstrator access password for assistant.php5)

define('OTHER_LANGS', 1);

$host = 'localhost'; // Change this if your SQL host is not onsite; You could also change this to 'bahai-library.com' if you wanted to access the Bah‡'’ site's contents (read only)
$dbuser = 'brett'; // Fill in your MYSQL user here; If you want to access the Bah‡'’ site (read only), add 'bahai_public'
$passw = ''; // Fill in your password here; Also leave it blank (as is) for the Bah‡'’ site

$author = 'Brett Zamir'; // Used in generating meta tags; you can replace this.


$skipfilelocaliz = TRUE; // Make this false in order to allow localization of file data itself (affects localize_filedata.php)

 // Safeguard in case page doesn't include script/style reference (and register globals is on)
$script = '';
$style = '';


$assistantpass = array(
	'fa'=>'',
	'ar'=>'',
	'en'=>'',
	'zh'=>'',
	'de'=>'',
	'ru'=>''
); // Sets the passwords for assistant.php5 (add further ones here until passwords added to SQL database); Uncomment and add passwords into corresponding values


/////// Define files ///////

$browserfile = 'browse0.php';


$browsetextfile = 'browse.php';
$browseresultsfile = 'browse9.php';

$default_localiz_site = 'b9'; // Set as NULL if don't want to consider this; Other sites' localization data can be accessed by an explicit call to that alternate argument in the localize function

/////// Define default language //////////
$defaultlanguage = 'en'; // Sets the language translators will translate from (could make this dynamic in the future so that some files could be translated from other languages into other languages)

/////// Database and table names (if change)

$dictionarydb = 'dictionaries'; // Database for language dictionaries (used in automated fields to provide automated translations, etc.)
$localedb = 'locales'; // Database for locales, languages, etc.
$localetable = 'localization'; // Localization table
$languagestable = 'languages'; // Language listing table
$table_data_table = 'table_data'; // Meta-data pertaining to specific tables
$field_data_table = 'field_data'; // Meta-data pertaining to specific fields
$auto_field_data = 'auto_field_data'; // Meta-data pertaining to automated fields
$cell_data_table = 'cell_data'; // Fix: Not implemented at present-- should be Meta-data pertaining to specific cells (e.g., language differing from the given field)
$users = 'users';
$finance = 'finance';

// Fix: This is one last item that should not be hard-coded (i.e., the script should search for the file from all the available (non-excluded) databases (though this would require unique table names); This is also specific to the Bah‡'’ site (though it would still need to be hard-coded and differently for other sites)
if ($file == 'Collins') {
	$hardcodeddb = 'writingsotherdb';
}

elseif ($file == 'lights') {
	$hardcodeddb = 'writingsotherdb';
}

else {
	$hardcodeddb = 'writingsdb'; // Fix: Fill in the database with the books; Delete this if fix hard-coding problem
}

$reviewer_arr = array('OK_JW');

$browse_checkcols = ''; // $browse_checkcols should be set to true if it is necessary to check browse.php files (the approach in the required file worked all right before, but now, with greater database access, there are many databases to exclude and it is not necessary to have at this point (though it will be when allowing per book localization)
if ($browse_checkcols) {
	$dbslist = array('test', $localedb, $dictionarydb, 'wiki', 'wikidb'); // Don't add these to browse0.php listings
	$countdbexceptions = count($dbslist);
	for ($i=0; $i < $countdbexceptions; $i++) {
		$dbsNotToIgnore = ($dbname !== $dbslist[$i]);
		if (!$dbsNotToIgnore) {
			break;
		} // end if
	} // end for
} // end if
else { // apparently needed for browse0.php
    // Changing actual names here
    $dbsNotToIgnore = !in_array($dbname, array('test', 'information_schema', $localedb, 'dictionaries', 'dictionaries', 'wiki', 'wikidb')); // This is a listing of databases to ignore (titled 'NotToIgnore' since it is a test against them)
}


$excludefields = array('unique_id'); // Fields to exclude from display (e.g., used for performing database inserts, indexing?, etc.)

//////////// Miscellaneous ////////////

$dont_localiz_filenames = FALSE;

$browsehtml = '0'; // Comment this or change the value to null, 0, '', etc. if XHTML 1.1 is not desired for the output of the results file (such as if the SQL contents cannot be made XHTML compatible and must use HTML)

$maxstarting = 2000; // This may need to be increased if there are a lot of localizations; the number is used to prevent an assistant from changing the GET for the starting variable to an excessive number.

$cookieduration = 3600*24*31*5; // length of time for the language cookie

// Used for localization of file data (should be stored in database as q_{name}, e.g., stringkey = q_AU1_1ST (e.g., with 'en' = 'William', 'fr' = 'Guillame') and always with tablekey equal to the specific id of the file)
// Fix: Some can probably be removed (and should be since this will affect speed, especially for display of large amounts of data) if they would never be localized (though id.php5, and  localize_filedata.php (used by reference_view.php and responsibility_view.php which are in turn used by file.php5 via chapterparsing.php, etc.) should be checked to see the variables still need to be assigned to Smarty or dealt with in PHP in their raw form)

// DO NOT DELETE THIS!!! Used by upload.php5 to auto-delete old records (and for localization) !!!!
$query_array1 = array('AU1_1ST', 'AU1_2ND', 'AU2_1ST', 'AU2_2ND', 'AU3_1ST', 'AU3_2ND', 'AU4_1ST', 'AU4_2ND', 'CONTRIB1_1ST', 'CONTRIB1_2ND', 'CONTRIB1_JOB', 'CONTRIB2_1ST', 'CONTRIB2_2ND', 'CONTRIB2_JOB', 'TITLE_THIS', 'SUBTITLE_THIS', 'LG1_THIS', 'LG2_THIS', 'LG3_THIS', 'TITLE_PARENT', 'VOLUME', 'PAGE_RANGE', 'PAGE_TOTAL', 'PUB_THIS', 'CITY_THIS', 'DATE_THIS', 'ISBN_THIS', 'TITLE_1ST', 'LG1_1ST', 'LG2_1ST', 'LG3_1ST', 'PUB_1ST', 'CITY_1ST', 'DATE_1ST', 'ISBN_1ST', 'COLLECTION1', 'COLLECTION2', 'COLLECTION3', 'INPUT_BY', 'INPUT_DATE', 'PROOF_BY', 'PROOF_DATE', 'FORMAT_BY', 'FORMAT_DATE', 'POST_BY', 'POST_DATE', 'FILE_NAME', 'BLURB', 'NOTES', 'CROSSREF');
$cnt_qry_arr1 = count($query_array1);

$clc_prefix = 'clc_'; // Used for localizing short collection names (used in tree.php)
$collec_prefix = 'collec_'; // Used for localizing long collection names

$hardcoded_blo = true; // Mark this to false if you are not using our library's contents

$tidyon = TRUE;
$charset_tidy = 'UTF8';

} // end if defined HAVEACCESS
?>