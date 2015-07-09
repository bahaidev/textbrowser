<?php
/////////////////
// This is version 0.5 of browse.php
// Search this document for "New Book Add:" to find sections which may need customization when adding a new book to the database
// Search this document for "Fix:" to find items to fix for better coding.
////////////////

$is_php5 = true; // Used for setting Smarty compile_dir (called in basics.php5)
$caching_off = true; // Comment out when not testing

// Define file variable
$file = $_GET['file'];

$textbrowser = true; // Will ensure $db_blo is referring to Text Browser rather than BLO databases

require('/home/bahai/inc_files/basics.php5'); // Repeated essentials for setup

$no_tables = $_GET['no_tables'];
$nofmtopts = $_GET['nofmtopts'];

require($req_dir.'getlangu.php');
require($req_dir.'headeraddprep0.php');


///////////// Connect to books database //////////////



$query_a = "SELECT stringkey FROM `\$auto_field_data` WHERE tablekey='\$file' OR (tablekey='' AND tablekeyno NOT LIKE '%--\$file"."--%')";
$result_a = $db_locale->query($query_a);
$option_a = $db_locale->num_rows;


$query_b = "SELECT browse_field_A, browse_field_B, browse_field_C FROM table_options WHERE table_name = '\$file'";
$table_check = '';

foreach ((array) $db_locale->get_results($query_b) as $row) {
	$browse_field_A[] = $row->browse_field_A;
	$browse_field_B[] = $row->browse_field_B;
	$browse_field_C[] = $row->browse_field_C;
	$table_check = 'ok';
} // end foreach


///////////// The following only takes effect if the details above are not supplied. //////////////

if ($table_check == '') {
	$browse_levels = 1; // Not needed in browse.php
	$browse_options = 1;
	// The detailed nature of the following is to prevent a very large book from being loaded if the administrator here has not set default values in the SQL database
	$result = $db_blo->query("SELECT * FROM `\$file`");

	$browse_field_A[] = $db_blo->get_col_info('name', 0);

	$default_field = $browse_field_A[0]; // Could standardize with default of "Book", etc. if not default as first field.
	//$default_field2 = $db_blo->get_col_info('name', 1);// Could standardize with default of "Chapter", etc. if not default as second field.
	$default_field_value = 1;
	$default_field_value2 = 1;
	$orig_lang_code = $defaultlanguage; // Assumes book was originally in default language
	$orig_edit_lang = $defaultlanguage; // Assumes the editing of the field names, etc. was done originally in the default language.
} // end if (if the get_table function did not find a value in the table_data table)


///////////// Get results to obtain field names (if default field and value exists, will only return these results (since only need the fieldnames in this script)//////////////

if ($default_field == '') {
	$query = "SELECT * FROM `\$file`";
} // end if (no default field is defined for the file)

elseif ($default_field2 != '') {
	$query = "SELECT * FROM `\$file` WHERE `$default_field` = $default_field_value AND `$default_field2` =$default_field_value2";
} // end elseif (there is a secondary default field)

else {
	$query = "SELECT * FROM `\$file` WHERE `$default_field` = $default_field_value";
} // end else (if there is a default field specified)

$result = $db_blo->query($query);

// Add header script (to check/uncheck checkboxes all at once)
// Only the switchAll() script is being used presently, but the others in case it is desired to add the others (which only check or uncheck the boxes, respectively)
$i = $totalfields = $db_blo->num_fields;

/*
if ($noscript != 1) {
	require($req_dir.'checkall.php'); // Contains the script in $scriptadd
	$script .= $scriptadd;
} // end if (if no script)
*/

// Call header function to add XHTML headers


if (!$noscript) {
	$smarty->assign('script_yes_flag', 1);
} // end if (if no script)

$initialshowhide = $_GET['showstat'];
if ($initialshowhide != '') {
	$smarty->assign('initialshowhide', strip_tags($initialshowhide));
} // end else

/*
if ($initialshowhide != "inline" && $initialshowhide != "block") {
	$initialshowhide = "none";
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style, "", "1", $initialscript);
} // end if
else {
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style, "", "1");
}
*/


////// The following section is from headerpreptoadd.php

if ($strings['tableheading'][$file] != '') {
	$heading = $strings['tableheading'][$file]; // Also used below for h2
	$headerdirection = $textdir['tableheading'][$file];
} // end if (if there is a heading for the table)
elseif ($strings['tablealias'][$file] != '') {
	$heading = $strings['tablealias'][$file]; // Also used below for h2
	$headerdirection = $textdir['tablealias'][$file];
} // end elseif (if there is at least a specified alias for the table)
else {
	$temp = $lang_code;
	localize(1); // Go for the defaults
	$lang_code = $temp;
	if ($strings['tableheading'][$file] != '') {
		$heading = $strings['tableheading'][$file]; // Also used below for h2
		$headerdirection = $textdir['tableheading'][$file];
	} // end if (if there is at least a specified heading for the table in the default language)
	elseif ($strings['tablealias'][$file] != '') {
		$heading = $strings['tablealias'][$file]; // Also used below for h2
		$headerdirection = $textdir['tablealias'][$file];
	} // end elseif (if there is at least a specified alias for the table in the default language)
	else {
		localize(1);
		$heading = $file; // Also used below for h2
		$headerdirection = $textdir['browserfile'];
		$dontlocalizeagain = 1; // Just spare the running of an extra function (since it was already (by necessity) run within this else)--see the "if" just below
	} // end else (if there is no heading or alias set for the specific table--having this option allows titles to appear with the table name (in some form at least), even if a localization was not set (or if it was not set because the name is intended to be the heading))
	if (!$dontlocalizeagain) {
		localize(1); // Go back to the localization for the user's choice of language
	} // end if (if need to localize again)
} // end else (if there is no heading or alias in the given language)

//////



$title = $strings['browserfile'].': '.strip_tags($heading);
$textdirection = $textdir['browserfile'];

require($req_dir.'headerassigns.php');
$smarty->assign($strings);
$smarty->assign('textdir', $textdir);


if ($noscript != 1) {
	$smarty->assign('noscript_flag', 1);
} // end if


///////////// Do form tag, table (book) heading, etc.////////////


$smarty->assign('heading', $heading);
$smarty->assign('headerdirection', $headerdirection);
$smarty->assign('browseresultsfile', $browseresultsfile);
$printversecounter = 97; // Set accesskey to begin at 'a'
$smarty->assign_by_ref('printversecounter', $printversecounter);

$browse_field_Acount = count($browse_field_A);
for ($i=0; $i < $browse_field_Acount; $i++) {

// Set initial values for later use by (print_)verse_selection functions
	$maxminbrws_fld_A = $browse_field_A[$i];
	$maxminbrws_fld_B = $browse_field_B[$i];
	$maxminbrws_fld_C = $browse_field_C[$i];

// Look for a field shortcut; if none, use the default.
	$fieldface = 'fieldshortcut';
	localize_fields($browse_field_A[$i], $fieldface);
	$browse_field_1 = $fieldshortcut;
	$textdirecA = $textdirec;
// $field_lang_codeA = $field_lang_code;
	localize_fields($browse_field_B[$i], $fieldface);
	$browse_field_2 = $fieldshortcut;
	$textdirecB = $textdirec;
// $field_lang_codeB = $field_lang_code;
	localize_fields($browse_field_C[$i], $fieldface);
	$browse_field_3 = $fieldshortcut;
	$textdirecC = $textdirec;
// $field_lang_codeC = $field_lang_code;

// if ($_GET['ug']==1) {
	if ($i == 0) {

		$query_full1 = "SELECT stringkey FROM `\$auto_field_data` WHERE funct_call='alias_fielding' AND (tablekey='\$file' OR (tablekey='' AND tablekeyno NOT LIKE '%--\$file"."--%'))";
		$alias_stringkey = $db_locale->get_var($query_full1);

		$query_full2 = "SELECT `\$langu` FROM `\$localetable` WHERE stringkey = '\$alias_stringkey'";
		$aliasname = $db_locale->get_var($query_full2);

		$fullinput_alph = $aliasname;

		$fullinput_value = max_min($maxminbrws_fld_A, 'min', 0);
		$fullinput_value2 = max_min($maxminbrws_fld_A, 'max', 1);

//$fullinput_value = '1';
//$fullinput_value2 = '4';

// $fullinput_alph = $browse_field_A;
		if ($browse_field_2 != '') {
			$fullinput_value .= ':'.max_min($maxminbrws_fld_B, 'min', 0);
			$fullinput_value2 .= ':'.max_min($maxminbrws_fld_B, 'max', 1);
//		$fullinput_value .= ':2';
//		$fullinput_value2 .= ':5';
			$fullinput_alph .= ' '.$browse_field_2;
		} // end if
		if ($browse_field_3 != '') {
			$fullinput_value .= ':'.max_min($maxminbrws_fld_C, 'min', 0);
			$fullinput_value2 .= ':'.max_min($maxminbrws_fld_C, 'max', 1);

//		$fullinput_value .= ':3';
//		$fullinput_value2 .= ':6';
			$fullinput_alph .= ':'.$browse_field_3;
		} // end if

		if ($aliasname != '') {
			$or_input = ' '.$strings['or'].' ['.$fullinput_alph.']';
		} // end if
		else {
			$or_input = '';
		} // end else
	} // end if

// $versecounteralph = chr($printversecounter);
// $printversecounter++;

// } // end if

/////////////////Call the function to display the input boxes for which range of verses one wishes to browse////////////////////

	$levels = array('blevela', 'blevelb', 'blevelc', 'elevela', 'elevelb', 'elevelc');

	$max_arr_all[] = verse_selection(array($browse_field_1, $browse_field_2, $browse_field_3), array($textdirecA, $textdirecB, $textdirecC), array($maxminbrws_fld_A, $maxminbrws_fld_B, $maxminbrws_fld_C), $levels, $i+1);

} // end for

$smarty->assign('fullinput_value', $fullinput_value);
$smarty->assign('fullinput_value2', $fullinput_value2);
$smarty->assign('or_input', $or_input);

$smarty->assign('max_arr_all', $max_arr_all);



// New Book Add: This allows browsing for a major subset of the content (esp. if there would otherwise be duplicate numbers).
// If adding options which were toggling between more than 3 choices, an extra input and extra SQL entry would need to be added (and ids possibly made dynamic?).



if ($strings['tabletoggle1'][$file] != '') {

// Fix: This toggle could be automated to be larger, allowing three or more choices (e.g., for enumerated fields (auto-checking for these perhaps))

	$smarty->assign('toggle_flag', 1);
 
	if (!$noscript) {
		$smarty->assign('hideshow_flag', 1);
	} // end if
	
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

$query_auto = "SELECT stringkey, placement, lang_code, field_reference, lang_category, checkbox FROM `\$auto_field_data` WHERE tablekey='\$file' OR (tablekey='' AND tablekeyno NOT LIKE '%--\$file"."--%')";

foreach ((array) $db_locale->get_results($query_auto) as $row_auto) {
	// The 'if' assumes there is a field_reference (the elseif and else do not)
	// Could add the following if desired: 	if ($row_auto->field_reference != '') {
	if ($row_auto->lang_category == '') { // No special language category, just applied to all books (minus any exceptions)--e.g., one wiki per book/table
		$stringkey = $row_auto->stringkey;
		$stringkey2 = addslashes($stringkey);
		$auto_fld_string[] = $strings[$stringkey2];
		$auto_fld_checkbox[] = $row_auto->checkbox;
		if ($row_auto->placement == '-1') {
			$auto_fld_placement[] = $totalfields;
		} // end if
		else {
			$auto_fld_placement[] = $row_auto->placement;
		} // end else
		$auto_fld_lang_code[] = $row_auto->lang_code;
		$auto_fld_reference[] = $row_auto->field_reference;
	} // end if
	elseif ($row_auto->lang_category == $defaultlanguage) {

		if ($row_auto->field_reference != '') {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `\$field_data_table` WHERE tablekey='\$file' AND fieldkey='{$row_auto->field_reference}'";
		} // end if
		else {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `\$field_data_table` WHERE tablekey='\$file'";
		} // end else

		$fields_to_ignore = array();
		foreach ((array) $db_locale->get_results($query2) as $row) {
			if ($row->orig_lang_code == $defaultlanguage) {
				$stringkey = $row_auto->stringkey;
				$stringkey2 = addslashes($stringkey);
				$auto_fld_string[] = $strings[$stringkey2].' ('.$strings['from'].' '.$row->fieldkey.')';
				if ($row_auto->placement == '-1') {
					$auto_fld_placement[] = $totalfields;
				} // end if
				else {
					$auto_fld_placement[] = $row_auto->placement;
				} // end else

				$auto_fld_checkbox[] = $row_auto->checkbox;
				$auto_fld_lang_code[] = $row_auto->lang_code;
				$auto_fld_reference[] = $row->fieldkey; // Was $row_auto->field_reference;
			} // end if
			$fields_to_ignore[] = $row->fieldkey;
		} // end foreach
		// Don't include fields like unique_id (from access.php)
		$fields_to_include = array();
		for ($i = 0; $i < $totalfields; $i++) {
			$temp_not_excl_fld = $db_blo->get_col_info('name', $i);
			
			if (!in_array($temp_not_excl_fld, $excludefields)) {
				$fields_to_include[] = $temp_not_excl_fld;
			} // end if
		} // end for

		$fields_to_include_count = count($fields_to_include);
		$fields_to_include = array_diff($fields_to_include, $fields_to_ignore);

		for ($i = 0; $i < $fields_to_include_count; $i++) {
			if ($fields_to_include[$i] != '') {
				$stringkey = $row_auto->stringkey;
				$stringkey2 = addslashes($stringkey);
				$auto_fld_string[] = $strings[$stringkey2].' ('.$strings['from'].' '.$fields_to_include[$i].')';
				$auto_fld_checkbox[] = $row_auto->checkbox;
				if ($row_auto->placement == '-1') {
					$auto_fld_placement[] = $totalfields;
				} // end if
				else {
					$auto_fld_placement[] = $row_auto->placement;
				} // end else
				$auto_fld_lang_code[] = $row_auto->lang_code;
				$auto_fld_reference[] = $fields_to_include[$i]; // Was $row_auto->field_reference;
			} // end if
		} // end for
	
	} // end elseif
	else { // There is a language category, and it is not the default
		$field_data_table = addslashes($field_data_table);
		// The following construct allows the admin to specify the field to apply the function to (or just to automatically take all fields with that language regardless of name)
		if ($row_auto->field_reference != '') {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `\$field_data_table` WHERE tablekey='\$file' AND fieldkey='{$row_auto->field_reference}' AND orig_lang_code = '{$row_auto->lang_category}'";
		} // end if
		else {
			$query2 = "SELECT fieldkey, tablekey, orig_lang_code FROM `\$field_data_table` WHERE tablekey='\$file' AND orig_lang_code = '{$row_auto->lang_category}'";
		} // end else

		foreach ((array) $db_locale->get_results($query2) as $row) {
			$stringkey = $row_auto->stringkey;
			$stringkey2 = addslashes($stringkey);
			$auto_fld_string[] = $strings[$stringkey2].' ('.$strings['from'].' '.$row->fieldkey.')'; // Added second part
			$auto_fld_checkbox[] = $row_auto->checkbox;
			if ($row_auto->placement == '-1') {
				$auto_fld_placement[] = $totalfields;
			} // end if
			else {
				$auto_fld_placement[] = $row_auto->placement;
			} // end else
			$auto_fld_lang_code[] = $row_auto->lang_code;
			$auto_fld_reference[] = $row->fieldkey; // Was $row_auto->field_reference;
		} // end foreach
	} // end else
} // end foreach

//$auto_fld_string = array('a', 'b', 'Word-by-word "Auto-translation"', 'Test2', 'Index entries', 'c', 'd', 'e'); // Get these as localized
// $auto_fld_placement = array(0, 0, 1, 1, 3, 5, 6, 6); // Get these values from database
//$auto_fld_placement = array(0, 4, 1, 1, 3, 5, 2, 6); // Get these values from database

$countfields = count($auto_fld_string);
$countautofldplcmnt = count($auto_fld_placement);

$fieldface = 'fieldalias';
$fieldcounter = 48; // Set to ASCII for '1'



$lettersused = $printversecounter - 96;
$countdownfields = 0;
$fieldno = 0;
// /*

$db_blo->query("SELECT * FROM `\$file`");

for ($i = 0; $i < ($totalfields+1); $i++) { // All normal rows

	if ($countautofldplcmnt) {
		$auto_keys0 = array_keys($auto_fld_placement, $i);
		$auto_keys_count0 = count($auto_keys0);

		if (is_array($auto_keys0)) {

			for ($z = 0; $z < $auto_keys_count0; $z++) {

				if ($printversecounter > 119) {
					$enabled_accesskey = '';
				} // end if (if exhaust lower case letters, not including x,y,z which are used below)
				else {
					$versecounteralph = chr($printversecounter);
					$enabled_accesskey = "accesskey='".$versecounteralph."' ";
					$printversecounter++;
				} // end else (if printversecounter still hasn't exhausted the lower case letters)
				
				if ($fieldcounter > 56 && (($totalfields + $lettersused) < 24)) {
					$countdownfields++;
					$fieldcounter2 = 120 - $countdownfields;
			// The following could make the letters start in ascending order where the other accesskey (options) left off; if use this, comment the above line; the reason the above is currently chosen is that, though it counts backwards (more confusing), it always predictably starts with 'w', so someone could know how to choose the next field (if available)
			//		$fieldcounter2 = $totalfields + $lettersused + 95 + $countdownfields;
	
					$fieldcounteralph = chr($fieldcounter2);
					$field_accesskey = "accesskey='".$fieldcounteralph."' ";
				} // end if (if exhausted 1-9 but not all possible letters)
				elseif ($fieldcounter > 56) {
					$field_accesskey = '';	
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
					$checkboxed = '';
				} // end else

				$autocolor = 'color:red'; // Fix: Could make dynamic in the future (as with $auto_col_name)
				$auto_col_name = $strings['auto']; // This can simply be referenced in the Smarty template as {$auto}
				$autocolors_dir = $textdir['auto'];

				$fieldno++;
				
				$fieldnos[] = $fieldno;
				$enabled_accesskeys[] = $enabled_accesskey;
				$optfieldnos[] = $i.'_'.$z;
				$checkboxeds[] = $checkboxed;
				$field_accesskeys[] = $field_accesskey;
				$autocolors[] = $autocolor;
				$autocolors_dirs[] = $autocolors_dir;
				$auto_col_names[] = $auto_col_name;

				for ($j = 0; $j < ($totalfields+1); $j++) { // Normal fields within special rows
	
					if ($countautofldplcmnt) {
						$auto_keys = array_keys($auto_fld_placement, $j);
						$auto_keys_count = count($auto_keys);

						if (is_array($auto_keys)) {

							for ($y = 0; $y < $auto_keys_count; $y++) {

// Each special field that matches (as they can be multiple, so have to go through and exclude the ones which are not matches)
						
		//						$fieldkey = $auto_fld_string[$y]; // Utilize this if using a database
		//						$fieldkey = $db_blo->get_col_info('name', $y); // Could utilize this if using a database
		//						localize_fields($fieldkey, $fieldface); // Could utilize this if using a database
		
								$akq = $auto_keys[$y];

								$auto_fld_str = $auto_fld_string[$akq];

								$optnos[$fieldno-1][] = $j.'_'.$y;
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
						$fieldkey = $db_blo->get_col_info('name', $j);
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
		$unique_id = $db_blo->get_col_info('name', $i);

		if (!in_array($unique_id, $excludefields)) {
		// Normal rows
			get_field($unique_id, $file);

			if ($printversecounter > 119) {
				$enabled_accesskey = '';
			} // end if (if exhaust lower case letters, not including x,y,z which are used below)
			else {
				$versecounteralph = chr($printversecounter);
				$enabled_accesskey = "accesskey='".$versecounteralph."' ";
				$printversecounter++;
			} // end else (if printversecounter still hasn't exhausted the lower case letters)
		
			if ($fieldcounter > 56 && (($totalfields + $lettersused) < 24)) {
				$countdownfields++;
				$fieldcounter2 = 120 - $countdownfields;
	// The following could make the letters start in ascending order where the other accesskey (options) left off; if use this, comment the above line; the reason the above is currently chosen is that, though it counts backwards (more confusing), it always predictably starts with 'w', so someone could know how to choose the next field (if available)
	//			$fieldcounter2 = $totalfields + $lettersused + 95 +$countdownfields;

				$fieldcounteralph = chr($fieldcounter2);
				$field_accesskey = "accesskey='".$fieldcounteralph."' ";
			} // end if (if exhausted 1-9 but not all possible letters)
			elseif ($fieldcounter > 56) {
				$field_accesskey = '';	
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
				$checkboxed = '';
			} // end else

			if ($is_auto_field) { // Normal fields labeled as auto (originally automatic)
				$auto_col_name = $strings['auto'];
				$autocolor = "color:red"; // Fix: Could make dynamic in the future (as with $auto_col_name)
				$autocolors_dir = $textdir['auto'];
			} // end if
			else {
				$auto_col_name = '';
				$autocolor = '';
//				$auto_col_name = $strings['normal'];
//				$autocolor = 'color:blue';
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
			$autocolors_dirs[] = $autocolors_dir;
			$auto_col_names[] = $auto_col_name;


			for ($f = 0; $f < ($totalfields+1); $f++) { // Counter

				if ($countautofldplcmnt) {
					$auto_keys = array_keys($auto_fld_placement, $f);
					$auto_keys_count2 = count($auto_keys);

					if (is_array($auto_keys)) {

						for ($w = 0; $w < $auto_keys_count2; $w++) {

			
		//			$fieldkey = $auto_fld_string[$w]; // Utilize this if using a database
		//			$fieldkey = $db_blo->get_col_info('name', $w); // Could utilize this if using a database
		//			localize_fields($fieldkey, $fieldface); // Could utilize this if using a database
							$akq = $auto_keys[$w];

							$auto_fld_str = $auto_fld_string[$akq];

							$optnos[$fieldno-1][] = $f.'_'.$w;
							$opttextdirec[$fieldno-1][] = $textdirec;
							$fld_str[$fieldno-1][] = $auto_fld_str;
							$optselected[$fieldno-1][] = ''; // Place-holder
						// xml:lang="$field_lang_code" // Fix: add in later?
						} // end for
					} // end if
				} // end if

				if ($f != $totalfields) {
					$fieldkey = $db_blo->get_col_info('name', $f);

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
$smarty->assign('autocolors_dirs', $autocolors_dirs);
$smarty->assign('auto_col_names', $auto_col_names);
				
// Put these field (option)-related arrays to the template
$smarty->assign('optnos', $optnos);
$smarty->assign('optselected', $optselected);
$smarty->assign('opttextdirec', $opttextdirec);
$smarty->assign('fld_str', $fld_str);

// */

//////////////Advanced text formatting options/////////////

//////////// Add hidden fields and finish the table and page //////////////////

$smarty->assign('file', $file);
$smarty->assign('langu', $langu);

if (!$nofmtopts) {
	$smarty->assign('formattingopts_flag', 1);
} // end if


// Print the template (with all of the variables assigned above) out
$smarty->displayDoc('browse.tpl');

?>