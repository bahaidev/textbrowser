<?php
/////////////////
// This is version 0.5 of browse.php
// Search this document for "New Book Add:" to find sections which may need customization when adding a new book to the database
// Search this document for "Fix:" to find items to fix for better coding.
////////////////

define('HAVEACCESS', 1);

$no_tables = $_GET['no_tables'];
$nofmtopts = $_GET['nofmtopts'];

require ('headeradd.php');

// Define file variable
$file = $_GET['file'];

require_once ('access.php');
require_once ('commonfunctions.php');

// Define language cookie variable
$ck_language = $_COOKIE['ck_language'];

// Define language GET variable
$langu = $_GET['langu'];

if ($langu == "") {
	$langu = $ck_language;	
} // end if (if langu is not set)

// Add header preparation

require_once ('headerpreptoadd.php'); // Does localization too


///////////// Connect to books database //////////////

$connect = mysql_connect($host, $dbuser, $passw);
//mysql_query("SET NAMES utf8");
mysql_set_charset('utf8'); // SET NAMES utf8
mysql_select_db($localedb, $connect);


$query_a = "SELECT stringkey FROM `".mysql_real_escape_string($auto_field_data)."` WHERE tablekey='".mysql_real_escape_string($file)."' OR (tablekey='' AND tablekeyno NOT LIKE '%--".mysql_real_escape_string($file)."--%')";

$result_a = mysql_query($query_a);
$option_a = mysql_num_rows($result_a);

$query_b = "SELECT browse_field_A, browse_field_B, browse_field_C FROM table_options WHERE table_name = '".mysql_real_escape_string($file)."'";
$result_b = mysql_query($query_b);
$table_check = "";

while ($row = mysql_fetch_array($result_b)) {
	$browse_field_A = $row['browse_field_A'];
	$browse_field_B = $row['browse_field_B'];
	$browse_field_C = $row['browse_field_C'];
	$table_check = "ok";
} // end while

mysql_select_db($hardcodeddb, $connect);


///////////// The following only takes effect if the details above are not supplied. //////////////

if ($table_check == "") {
	$browse_levels = 1; // Not needed in browse.php
	$browse_options = 1;
	// The detailed nature of the following is to prevent a very large book from being loaded if the administrator here has not set default values in the SQL database
	$result = mysql_query("SELECT * FROM `".mysql_real_escape_string($file)."`");

	$browse_field_A = mysql_field_name($result, 0);

	$default_field = mysql_field_name($result, 0); // Could standardize with default of "Book", etc. if not default as first field.
	//$default_field2 = mysql_field_name($result, 1);// Could standardize with default of "Chapter", etc. if not default as second field.
	$default_field_value = 1;
	$default_field_value2 = 1;
	$orig_lang_code = $defaultlanguage; // Assumes book was originally in default language
	$orig_edit_lang = $defaultlanguage; // Assumes the editing of the field names, etc. was done originally in the default language.
} // end if (if the get_table function did not find a value in the table_data table)


///////////// Get results to obtain field names (if default field and value exists, will only return these results (since only need the fieldnames in this script)//////////////

if ($default_field == "") {
	$query = "SELECT * FROM `".mysql_real_escape_string($file)."`";
} // end if (no default field is defined for the file)

elseif ($default_field2 != "") {
	$query = "SELECT * FROM `".mysql_real_escape_string($file)."` WHERE `$default_field` = $default_field_value AND `$default_field2` =$default_field_value2";
} // end elseif (there is a secondary default field)

else {
	$query = "SELECT * FROM `".mysql_real_escape_string($file)."` WHERE `$default_field` = $default_field_value";
} // end else (if there is a default field specified)


$result = mysql_query($query);


// Add header script (to check/uncheck checkboxes all at once)
// Only the switchAll() script is being used presently, but the others in case it is desired to add the others (which only check or uncheck the boxes, respectively)
$i = mysql_num_fields($result);

if ($noscript != 1) {
	require('checkall.php'); // Contains the script in $scriptadd
	$script .= $scriptadd;
} // end if (if no script)

$style = <<<HERE
#pageformat {text-align: right}
				#pageformat {float: right}

HERE;

include ("navigbcs.php"); // Navigator and Breadcrumbs



// Call header function to add XHTML headers

$initialshowhide = $_GET['showstat'];

if (!$noscript) {
	$initialscript = <<<HERE
javascript:changeObjectVisibility("pageformat", "options", "$initialshowhide");
HERE;
}
else {
	$initialscript = "";
} // end else

if ($initialshowhide != "inline" && $initialshowhide != "block") {
	$initialshowhide = "none";
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style, "", "1", $initialscript);
} // end if
else {
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style, "", "1");
}

//require ('../smarty.php');
require('../../smarty/libs/Smarty.class.php');
$smarty = new Smarty;

$smarty->assign($strings);
$smarty->assign('textdir', $textdir);

$smarty->assign('bc_nv_print', $bc_nv_print);

if ($noscript != 1) {
	$smarty->assign('noscript_flag', 1);
} // end if

$smarty->assign('bc_nv_print', $bc_nv_print);

///////////// Do form tag, table (book) heading, etc.////////////


$smarty->assign('heading', $heading);
$smarty->assign('headerdirection', $headerdirection);
$smarty->assign('browseresultsfile', $browseresultsfile);

/*
if ($table_check == "") {
	$browse_field_A = mysql_field_name($result, 0);
	//$browse_field_B = mysql_field_name($result, 1);
} // end if (if there is no table defined with metadata, set the first level to include column 0 and column 1 as browse parameters)
*/

// Set initial values for later use by (print_)verse_selection functions
$maxminbrws_fld_A = $browse_field_A;
$maxminbrws_fld_B = $browse_field_B;
$maxminbrws_fld_C = $browse_field_C;

// Look for a field shortcut; if none, use the default.
$fieldface = "fieldshortcut";
localize_fields($browse_field_A, $fieldface);
$browse_field_A = $fieldshortcut;
$textdirecA = $textdirec;
// $field_lang_codeA = $field_lang_code;
localize_fields($browse_field_B, $fieldface);
$browse_field_B = $fieldshortcut;
$textdirecB = $textdirec;
// $field_lang_codeB = $field_lang_code;
localize_fields($browse_field_C, $fieldface);
$browse_field_C = $fieldshortcut;
$textdirecC = $textdirec;
// $field_lang_codeC = $field_lang_code;


$printversecounter = 97; // Set accesskey to begin at "a"



// if ($_GET['ug']==1) {

mysql_select_db($localedb, $connect);

$query_full1 = "SELECT stringkey FROM `".mysql_real_escape_string($auto_field_data)."` WHERE funct_call='alias_fielding' AND (tablekey='".mysql_real_escape_string($file)."' OR (tablekey='' AND tablekeyno NOT LIKE '%--".mysql_real_escape_string($file)."--%'))";
$result_full1 = mysql_query($query_full1);
while ($row = mysql_fetch_array($result_full1)) {
	$alias_stringkey = $row['stringkey'];
} // end while


$query_full2 = "SELECT `".mysql_real_escape_string($langu)."` FROM `".mysql_real_escape_string($localetable)."` WHERE stringkey = '$alias_stringkey'";
$result_full2 = mysql_query($query_full2);
$aliasname = "";
while ($row = mysql_fetch_array($result_full2)) {
	$aliasname = $row[$langu];
} // end while

$fullinput_alph = $aliasname;
$fullinput_value = max_min($maxminbrws_fld_A, "min", 0);
$fullinput_value2 = max_min($maxminbrws_fld_A, "max", 1);

//$fullinput_value = "1";
//$fullinput_value2 = "4";

// $fullinput_alph = $browse_field_A;
if ($browse_field_B !="") {
	$fullinput_value .= ":".max_min($maxminbrws_fld_B, "min", 0);
	$fullinput_value2 .= ":".max_min($maxminbrws_fld_B, "max", 1);
//		$fullinput_value .= ":2";
//		$fullinput_value2 .= ":5";
	$fullinput_alph .= " ".$browse_field_B;
} // end if
if ($browse_field_C !="") {
	$fullinput_value .= ":".max_min($maxminbrws_fld_C, "min", 0);
	$fullinput_value2 .= ":".max_min($maxminbrws_fld_C, "max", 1);

//		$fullinput_value .= ":3";
//		$fullinput_value2 .= ":6";
	$fullinput_alph .= ":".$browse_field_C;
} // end if

if ($aliasname != "") {
	$or_input = " ".$strings['or']." [".$fullinput_alph."]";
} // end if
else {
	$or_input = "";
} // end else

// $versecounteralph = chr($printversecounter);
// $printversecounter++;
$smarty->assign_by_ref('printversecounter', $printversecounter);

$smarty->assign('fullinput_value', $fullinput_value);
$smarty->assign('fullinput_value2', $fullinput_value2);
$smarty->assign('or_input', $or_input);


// } // end if


/////////////////Call the function to display the input boxes for which range of verses one wishes to browse////////////////////



$levels = array('blevela', 'blevelb', 'blevelc', 'elevela', 'elevelb', 'elevelc');

$max_arr_all = array(verse_selection (array($browse_field_A, $browse_field_B, $browse_field_C), array($textdirecA, $textdirecB, $textdirecC), array($maxminbrws_fld_A, $maxminbrws_fld_B, $maxminbrws_fld_C), $levels, 1));

/// Fix: This was designed to add an indefinite number of "or" options if one were to give the option to browse by more than 2 fields (perhaps the Collins database could use this?). browse9.php also should be fixed when testing to see if these blevela2+ items exist already or not. Do this also for browse_levels 2 and 3 or if any more levels are ever needed (dynamically added?!?--I hope they are not necessary since it is rather complicated to delineate all the possibilities!!!)

// Look for a field shortcut; if none, use the default.


	$maxminbrws_fld_A = $browse_field_A;
	$maxminbrws_fld_B = $browse_field_B;
	$maxminbrws_fld_C = $browse_field_C;

	localize_fields($browse_field_A, $fieldface);
	$browse_field_A = $fieldshortcut;
	$textdirecA = $textdirec;
//	$field_lang_code1= $field_lang_code;
	localize_fields($browse_field_B, $fieldface);
	$browse_field_B = $fieldshortcut;
	$textdirecB= $textdirec;
//	$field_lang_code2= $field_lang_code;
	localize_fields($browse_field_C, $fieldface);
	$browse_field_C = $fieldshortcut;
	$textdirecC= $textdirec;
//	$field_lang_code3= $field_lang_code;

// Fix: If remove table structure, should add <fieldset> to end each row?

//	print <<<HERE
// HERE;
//		verse_selection ($browse_field_1, $browse_field_2, $browse_field_3, $textdirec1, $textdirec2, $textdirec3, $i, $maxminbrws_fld_1, $maxminbrws_fld_2, $maxminbrws_fld_3);
		
		$max_arr_all[] = verse_selection (array($browse_field_A, $browse_field_B, $browse_field_C), array($textdirecA, $textdirecB, $textdirecC), array($maxminbrws_fld_A, $maxminbrws_fld_B, $maxminbrws_fld_C), $levels, $i+1);
		

$smarty->assign('max_arr_all', $max_arr_all);



// New Book Add: This allows browsing for a major subset of the content (esp. if there would otherwise be duplicate numbers).
// If adding options which were toggling between more than 3 choices, an extra input and extra SQL entry would need to be added (and ids possibly made dynamic?).




if ($strings['tabletoggle1'][$file]) {

// Fix: This toggle could be automated to be larger, allowing three or more choices (e.g., for enumerated fields (auto-checking for these perhaps))

	$smarty->assign('toggle_flag', $toggle_flag);
 
	if (!$noscript) {
		$hideshownone = <<<HERE
onkeypress="javascript:hideshowObject('groupbytoggle', 'none')" onclick="javascript:hideshowObject('groupbytoggle', 'none')"
HERE;
		$hideshowinline = <<<HERE
onclick="javascript:hideshowObject('groupbytoggle', 'inline')" onkeypress="javascript:hideshowObject('groupbytoggle', 'inline')"
HERE;

	} // end if
	else {
		$hideshownone = "";
		$hideshowinline = "";
	} // end else
	
	$smarty->assign('hideshownone', $hideshownone);
	$smarty->assign('hideshowninline', $hideshowninline);
	
	$smarty->assign('file', $file);
	$smarty->assign('toggle1', $toggle1);
	$smarty->assign('toggle2', $toggle2);
	$smarty->assign('toggleall', $toggleall);

} // end if (if file has a toggle (e.g., between the Persian and Arabic of the Hidden Words)




/////////////Start tables////////////////
// Fix: The table below is technically used for layout, and though its main body of cells do not currently vary in size since the selects will always include each field, there is a logical table heading here, and as these headings may vary since they are localizable, a fixed width would not be appropriate (except perhaps as a percent) to ensure that the header aligns with the body. (If it is in fact later removed, remove it then from the localization SQL table to avoid the need for translators to translate!)


if ($no_tables) {

	$smarty->assign('mainbox_summary', '');
	$smarty->assign('fields_summary', '');

	$smarty->assign('colspan', '');

	$smarty->assign('table', '<div');
	$smarty->assign('tr', '<div');
	$smarty->assign('th', '<div');
	$smarty->assign('td', '<div');
	$smarty->assign('tableclose', 'div');
	$smarty->assign('trclose', 'div');
	$smarty->assign('thclose', 'div');
	$smarty->assign('tdclose', 'div');

	
	$smarty->assign('outputmodep', 'selected="selected"');
	$smarty->assign('outputmodet', '');

} // end if

else {
	$smarty->assign('mainbox_summary', 'summary="'.$strings['mainboxsummary'].'"');
	$smarty->assign('fields_summary', 'summary="'.$strings['fieldtablesummary'].'"');

	$smarty->assign('colspan', 'colspan="3"');

	$smarty->assign('table', '<table');
	$smarty->assign('tr', '<tr');
	$smarty->assign('th', '<th');
	$smarty->assign('td', '<td');
	$smarty->assign('tableclose', 'table');
	$smarty->assign('trclose', 'tr');
	$smarty->assign('thclose', 'th');
	$smarty->assign('tdclose', 'td');

	$smarty->assign('outputmodet', 'selected="selected"');
	$smarty->assign('outputmodep', '');

} // end else




//Fix: Make the option work for Search for any text you wish to find in that field:</fieldset>

/////////////Get the (optional) fields listed in drop-down menus; although all options are available in each menu, one is chosen (by its sequence) to be initially selected/////////////


$totalfields = mysql_num_fields($result);


mysql_select_db($localedb, $connect);


$query_auto = "SELECT stringkey, placement, lang_code, field_reference, lang_category, checkbox FROM `".mysql_real_escape_string($auto_field_data)."` WHERE tablekey='".mysql_real_escape_string($file)."' OR (tablekey='' AND tablekeyno NOT LIKE '%--".mysql_real_escape_string($file)."--%')";
$result_auto = mysql_query($query_auto);


while ($row_auto = mysql_fetch_assoc($result_auto)) {
	// The 'if' assumes there is a field_reference (the elseif and else do not)
	// Could add the following if desired: 	if ($row_auto['field_reference'] != "") {
	if ($row_auto['lang_category'] == "") { // No special language category, just applied to all books (minus any exceptions)--e.g., one wiki per book/table
		$stringkey = $row_auto['stringkey'];
		$stringkey2 = addslashes($stringkey);
		$auto_fld_string[] = $strings["$stringkey2"];
		$auto_fld_checkbox[] = $row_auto['checkbox'];
		if ($row_auto['placement'] == "-1") {
			$auto_fld_placement[] = $totalfields;
		} // end if
		else {
			$auto_fld_placement[] = $row_auto['placement'];
		} // end else
		$auto_fld_lang_code[] = $row_auto['lang_code'];
		$auto_fld_reference[] = $row_auto['field_reference'];
	} // end if
	elseif ($row_auto['lang_category'] == $defaultlanguage) {

		if ($row_auto['field_reference'] != "") {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `".mysql_real_escape_string($field_data_table)."` WHERE tablekey='".mysql_real_escape_string($file)."' AND fieldkey='{$row_auto['field_reference']}'";
		} // end if
		else {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `".mysql_real_escape_string($field_data_table)."` WHERE tablekey='".mysql_real_escape_string($file)."'";
		} // end else
		$result2 = mysql_query($query2);

		$fields_to_ignore = array();
		while ($row = mysql_fetch_assoc($result2)) {
			if ($row['orig_lang_code'] == $defaultlanguage) {
				$stringkey = $row_auto['stringkey'];
				$stringkey2 = addslashes($stringkey);
				$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")";
				if ($row_auto['placement'] == "-1") {
					$auto_fld_placement[] = $totalfields;
				} // end if
				else {
					$auto_fld_placement[] = $row_auto['placement'];
				} // end else

				$auto_fld_checkbox[] = $row_auto['checkbox'];
				$auto_fld_lang_code[] = $row_auto['lang_code'];
				$auto_fld_reference[] = $row['fieldkey']; // Was $row_auto['field_reference'];
			} // end if
			$fields_to_ignore[] = $row['fieldkey'];
		} // end while
		// Don't include fields like unique_id (from access.php)
		$fields_to_include = array();
		for ($i = 0; $i < $totalfields; $i++) {
			$temp_not_excl_fld = mysql_field_name($result, $i);
			if (!in_array($temp_not_excl_fld, $excludefields)) {
				$fields_to_include[] = $temp_not_excl_fld;
			} // end if
		} // end for

		$fields_to_include_count = count($fields_to_include);
		$fields_to_include = array_diff($fields_to_include, $fields_to_ignore);

		for ($i = 0; $i < $fields_to_include_count; $i++) {
			if ($fields_to_include[$i] != "") {
				$stringkey = $row_auto['stringkey'];
				$stringkey2 = addslashes($stringkey);
				$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$fields_to_include[$i].")";
				$auto_fld_checkbox[] = $row_auto['checkbox'];
				if ($row_auto['placement'] == "-1") {
					$auto_fld_placement[] = $totalfields;
				} // end if
				else {
					$auto_fld_placement[] = $row_auto['placement'];
				} // end else
				$auto_fld_lang_code[] = $row_auto['lang_code'];
				$auto_fld_reference[] = $fields_to_include[$i]; // Was $row_auto['field_reference'];
			} // end if
		} // end for
	
	} // end elseif
	else { // There is a language category, and it is not the default
		$field_data_table = addslashes($field_data_table);
		// The following construct allows the admin to specify the field to apply the function to (or just to automatically take all fields with that language regardless of name)
		if ($row_auto['field_reference'] != "") {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `".mysql_real_escape_string($field_data_table)."` WHERE tablekey='".mysql_real_escape_string($file)."' AND fieldkey='{$row_auto['field_reference']}' AND orig_lang_code = '{$row_auto['lang_category']}'";
		} // end if
		else {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `".mysql_real_escape_string($field_data_table)."` WHERE tablekey='".mysql_real_escape_string($file)."' AND orig_lang_code = '{$row_auto['lang_category']}'";
		} // end else
		$result2 = mysql_query($query2);

		while ($row = mysql_fetch_assoc($result2)) {
			$stringkey = $row_auto['stringkey'];
			$stringkey2 = addslashes($stringkey);
			$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")"; // Added second part
			$auto_fld_checkbox[] = $row_auto['checkbox'];
			if ($row_auto['placement'] == "-1") {
				$auto_fld_placement[] = $totalfields;
			} // end if
			else {
				$auto_fld_placement[] = $row_auto['placement'];
			} // end else
			$auto_fld_lang_code[] = $row_auto['lang_code'];
			$auto_fld_reference[] = $row['fieldkey']; // Was $row_auto['field_reference'];
		} // end while
	} // end else
} // end while

//$auto_fld_string = array('a', 'b', 'Word-by-word "Auto-translation"', 'Test2', 'Index entries', 'c', 'd', 'e'); // Get these as localized
// $auto_fld_placement = array(0, 0, 1, 1, 3, 5, 6, 6); // Get these values from database
//$auto_fld_placement = array(0, 4, 1, 1, 3, 5, 2, 6); // Get these values from database

$countfields = count($auto_fld_string);
$countautofldplcmnt = count($auto_fld_placement);

$fieldface = "fieldalias";
$fieldcounter = 48; // Set to ASCII for "1"



$lettersused = $printversecounter - 96;
$countdownfields = 0;
$fieldno = 0;
// /*
for ($i = 0; $i < ($totalfields+1); $i++) { // All normal rows

	if ($countautofldplcmnt) {
		$auto_keys0 = array_keys($auto_fld_placement, $i);
		$auto_keys_count0 = count($auto_keys0);

		if (is_array($auto_keys0)) {

			for ($z = 0; $z < $auto_keys_count0; $z++) {

				if ($printversecounter > 119) {
					$enabled_accesskey = "";
				} // end if (if exhaust lower case letters, not including x,y,z which are used below)
				else {
					$versecounteralph = chr($printversecounter);
					$enabled_accesskey = "accesskey='".$versecounteralph."' ";
					$printversecounter++;
				} // end else (if printversecounter still hasn't exhausted the lower case letters)
				
				if ($fieldcounter > 56 && (($totalfields + $lettersused) < 24)) {
					$countdownfields++;
					$fieldcounter2 = 120 - $countdownfields;
			// The following could make the letters start in ascending order where the other accesskey (options) left off; if use this, comment the above line; the reason the above is currently chosen is that, though it counts backwards (more confusing), it always predictably starts with "w", so someone could know how to choose the next field (if available)
			//		$fieldcounter2 = $totalfields + $lettersused + 95 + $countdownfields;
	
					$fieldcounteralph = chr($fieldcounter2);
					$field_accesskey = "accesskey='".$fieldcounteralph."' ";
				} // end if (if exhausted 1-9 but not all possible letters)
				elseif ($fieldcounter > 56) {
					$field_accesskey = "";	
				} // end elseif (if exhausted 1-9 and)
				else {
					$fieldcounter++;
					$fieldcounteralph = chr($fieldcounter);
					$field_accesskey = "accesskey='".$fieldcounteralph."' ";
				} // end else (if numerals not yet exhausted)

	
				$akz = $auto_keys0[$z];
				if ($auto_fld_checkbox[$akz]) {
					$checkboxed = ' checked="checked"';
				} // end if
				else {
					$checkboxed = "";
				} // end else

				$autocolor = "color:red"; // Fix: Could make dynamic in the future (as with $auto_col_name)
				$auto_col_name = $strings['auto']; // This can simply be referenced in the Smarty template as {$auto}
				$autocolors_dir = $textdir['auto'];

				$fieldno++;
				
				$fieldnos[] = $fieldno;
				$enabled_accesskeys[] = $enabled_accesskey;
				$optfieldnos[] = $i."_".$z;
				$checkboxeds[] = $checkboxed;
				$field_accesskeys[] = $field_accesskey;
				$autocolors[] = $autocolor;
				$auto_col_names[] = $auto_col_name;

				for ($j = 0; $j < ($totalfields+1); $j++) { // Normal fields within special rows
	
					if ($countautofldplcmnt) {
						$auto_keys = array_keys($auto_fld_placement, $j);
						$auto_keys_count = count($auto_keys);

						if (is_array($auto_keys)) {

							for ($y = 0; $y < $auto_keys_count; $y++) {

// Each special field that matches (as they can be multiple, so have to go through and exclude the ones which are not matches)
						
		//						$fieldkey = $auto_fld_string[$y]; // Utilize this if using a database
		//						$fieldkey = mysql_field_name($result, $y); // Could utilize this if using a database
		//						localize_fields($fieldkey, $fieldface); // Could utilize this if using a database
		
								$akq = $auto_keys[$y];

								$auto_fld_str = $auto_fld_string[$akq];

								$optnos[$fieldno-1][] = $j."_".$y;
								$opttextdirec[$fieldno-1][] = $textdirec;
								$fld_str[$fieldno-1][] = $auto_fld_str;

								if ($j !== $i || $z !== $y) {
									// xml:lang="$field_lang_code" // Fix: add in later?

									$optselected[$fieldno-1][] = '';

								} // end if (if current option is not (yet) in line to be selected)
								else {
									// xml:lang="$field_lang_code" // Fix: add in later?

									$optselected[$fieldno-1][] = 'selected="selected" ';

								} // end else (if current option is in line to be selected)
							} // end for
						} // end if
					} // end if
					
	
					if ($j != $totalfields) {
	
						$fieldkey = mysql_field_name($result, $j);
						
						if (!in_array($fieldkey, $excludefields)) {
							localize_fields($fieldkey, $fieldface);
	
							$optnos[$fieldno-1][] = $j;
							$opttextdirec[$fieldno-1][] = $textdirec;
							$fld_str[$fieldno-1][] = $fieldalias;
							$optselected[$fieldno-1][] = ''; // Place-holder
						// xml:lang="$field_lang_code" // Fix: add in later?
						} // end if (if fieldkey is not solely for id purposes)
					} // end if
				} //end for (going through all the fields to be listed in the drop-down menu of field choices--used for seeing if the item is to be checked by default or not)

			} // end for	
		} // end if
	} // end if
	

	if ($i != $totalfields) {
		$unique_id = mysql_field_name($result, $i);

		if (!in_array($unique_id, $excludefields)) {
		// Normal rows

			get_field($unique_id, $file);

			if ($printversecounter > 119) {
				$enabled_accesskey = "";
			} // end if (if exhaust lower case letters, not including x,y,z which are used below)
			else {
				$versecounteralph = chr($printversecounter);
				$enabled_accesskey = "accesskey='".$versecounteralph."' ";
				$printversecounter++;
			} // end else (if printversecounter still hasn't exhausted the lower case letters)
		
			if ($fieldcounter > 56 && (($totalfields + $lettersused) < 24)) {
				$countdownfields++;
				$fieldcounter2 = 120 - $countdownfields;
	// The following could make the letters start in ascending order where the other accesskey (options) left off; if use this, comment the above line; the reason the above is currently chosen is that, though it counts backwards (more confusing), it always predictably starts with "w", so someone could know how to choose the next field (if available)
	//			$fieldcounter2 = $totalfields + $lettersused + 95 +$countdownfields;

				$fieldcounteralph = chr($fieldcounter2);
				$field_accesskey = "accesskey='".$fieldcounteralph."' ";
			} // end if (if exhausted 1-9 but not all possible letters)
			elseif ($fieldcounter > 56) {
				$field_accesskey = "";	
			} // end elseif (if exhausted 1-9 and)
			else {
				$fieldcounter++;
				$fieldcounteralph = chr($fieldcounter);
				$field_accesskey = "accesskey='".$fieldcounteralph."' ";
			} // end else (if numerals not yet exhausted)

	
			if ($checkbox_field) {
				$checkboxed = ' checked="checked"';
			} // end if
			else {
				$checkboxed = "";
			} // end else

			if ($is_auto_field) { // Normal fields labeled as auto (originally automatic)
				$auto_col_name = $strings['auto'];
				$autocolor = "color:red"; // Fix: Could make dynamic in the future (as with $auto_col_name)
				$autocolors_dir = $textdir['auto'];
			} // end if
			else {
				$auto_col_name = "";
				$autocolor = "";
//				$auto_col_name = $strings['normal'];
//				$autocolor = "color:blue";
//				$autocolors_dir = $textdir['normal'];
			} // end else

			$auto_col_name = $strings['auto']; // This can simply be referenced in the Smarty template as {$auto}

			$fieldno++;

			$fieldnos[] = $fieldno;
			$enabled_accesskeys[] = $enabled_accesskey;
			$optfieldnos[] = $i;
			$checkboxeds[] = $checkboxed;
			$field_accesskeys[] = $field_accesskey;
			$autocolors[] = $autocolor;
			$auto_col_names[] = $auto_col_name;


			for ($f = 0; $f < ($totalfields+1); $f++) { // Counter

				if ($countautofldplcmnt) {
					$auto_keys = array_keys($auto_fld_placement, $f);
					$auto_keys_count2 = count($auto_keys);

					if (is_array($auto_keys)) {

						for ($w = 0; $w < $auto_keys_count2; $w++) {

			
		//			$fieldkey = $auto_fld_string[$w]; // Utilize this if using a database
		//			$fieldkey = mysql_field_name($result, $w); // Could utilize this if using a database
		//			localize_fields($fieldkey, $fieldface); // Could utilize this if using a database
							$akq = $auto_keys[$w];

							$auto_fld_str = $auto_fld_string[$akq];

							$optnos[$fieldno-1][] = $f."_".$w;
							$opttextdirec[$fieldno-1][] = $textdirec;
							$fld_str[$fieldno-1][] = $auto_fld_str;
							$optselected[$fieldno-1][] = ''; // Place-holder
						// xml:lang="$field_lang_code" // Fix: add in later?
						} // end for
					} // end if
				} // end if

				if ($f != $totalfields) {
					$fieldkey = mysql_field_name($result, $f);

					if (!in_array($fieldkey, $excludefields)) {

						localize_fields($fieldkey, $fieldface);

						$optnos[$fieldno-1][] = $f;
						$opttextdirec[$fieldno-1][] = $textdirec;
						$fld_str[$fieldno-1][] = $fieldalias;

						if ($f !== $i) {
							// xml:lang="$field_lang_code" // Fix: add in later?
							$optselected[$fieldno-1][] = '';
						} // end if (if current option is not (yet) in line to be selected)
						else {
						// xml:lang="$field_lang_code" // Fix: add in later?
							$optselected[$fieldno-1][] = 'selected="selected" ';
						} // end else (if current option is in line to be selected)
					} // end if (if the field is not the unique id)
				} // end if

			} //end for (going through all the fields to be listed in the drop-down menu of field choices--used for seeing if the item is to be checked by default or not)

			
		} // end if
	} // end if
} //end for (going through all the fields to be listed in the drop-down menu of field choices--used for seeing if the item is to be checked by default or not)

// Put these field-related arrays to the template
$smarty->assign('fieldnos', $fieldnos);
$smarty->assign('enabled_accesskeys', $enabled_accesskeys);
$smarty->assign('optfieldnos', $optfieldnos);
$smarty->assign('checkboxeds', $checkboxeds);
$smarty->assign('field_accesskeys', $field_accesskeys);
$smarty->assign('autocolors', $autocolors);
$smarty->assign('auto_col_names', $auto_col_names);

// Put these field (option)-related arrays to the template
$smarty->assign('optnos', $optnos);
$smarty->assign('optselected', $optselected);
$smarty->assign('opttextdirec', $opttextdirec);
$smarty->assign('fld_str', $fld_str);



// */
if (!$noscript) {
	$uncheckallon = 'onkeypress="javascript:uncheckAll()" onclick="javascript:uncheckAll()"';
	$checkallon = 'onkeypress="javascript:checkAll()" onclick="javascript:checkAll()"';
	$switchallon = 'onkeypress="javascript:switchAll()" onclick="javascript:switchAll()"';

	$smarty->assign('checkallon', $checkallon);
	$smarty->assign('uncheckallon', $uncheckallon);
} // end if (if no script)
else {
	$switchallon = "";
} // end else

$smarty->assign('switchallon', $switchallon);

//////////////Advanced text formatting options/////////////


if (!$noscript) {
	$hidingscript = "onkeypress='".$initialscript."' onclick='".$initialscript."'";
} // end if (if no script)
else {
	$hidingscript = "";
} // end else

$smarty->assign('hidingscript', $hidingscript);

//////////// Add hidden fields and finish the table and page //////////////////

$smarty->assign('file', $file);
$smarty->assign('langu', $langu);

if (!$nofmtopts) {
	$smarty->assign('formattingopts_flag', 1);
} // end if


// Print the template (with all of the variables assigned above) out
$smarty->display('browse.tpl');

?>