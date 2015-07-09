<?php
///////////////////////////////////////////
// This is version 0.6 of browse0.php   ///
///////////////////////////////////////////

$is_php5 = true; // Used for setting Smarty compile_dir (called in basics.php5)
$caching_off = true; // Comment out when not testing
require('/home/bahai/inc_files/basics.php5'); // Repeated essentials for setup

require($req_dir.'languageget.php');



require($req_dir.'getlangu.php');
require($req_dir.'headeraddprep0.php');

$smarty->assign('content', $strings['content']); // Important; needed here?

if ($hardcoded_blo) { // needed here?
	$smarty->assign('hardcoded_blo', 1);
} // end if

// Call header function to add XHTML headers

$title = $strings['browserfile'];
$textdirection = $textdir['browserfile'];


// Header2

// Comes from cookie set in login.php5; not very secure, esp. with open source
if ($blo_userstatus == 'admin' || $blo_userstatus == 'superadmin') {

	$smarty->assign('admin_flag', 1);
	$usertype = 1;
} // end if
elseif ($blo_userid) {
	$smarty->assign('user_id_flag', 1);
	$smarty->assign('blo_userid', $blo_userid);
	$usertype = 2;
} // end elseif
else {
	$usertype = 3;
} // end else


// Fix: header should be done through Smarty

require($req_dir.'headerassigns.php');

$smarty->assign($strings); // Important
$smarty->assign('textdir', $textdir); // Important; requires call as array in Smarty (e.g., {$textdir.noscriptonchange} ) because it would otherwise conflict with the data from strings (above)

$smarty->assign('browsetextfile', $browsetextfile);
$smarty->assign('langu', $langu);
// Call header function to add XHTML headers



/////////////////// Get list of databases (must have user access to each one desired)... /////////////////

$db_locale->query("SHOW DATABASES;");

/*
print $db_locale->last_result[0]->Database."<br />";
print $db_locale->last_result[1]->Database."<br />";
print $db_locale->last_result[2]->Database."<br />";
*/

// $db_locale->debug();

$x = '';
$m = 0;
$accesskey_arr = array();
$m_arr = array();
$choose_writings_str = array();
$choose_writings_dir = array();
$checked_arr = array();
$advancedaccess_arr = array();
$accesskeybutton_arr = array();
$option_mult_arr = array();



$dbquerya = $db_locale->query("SHOW DATABASES");
foreach((array) $db_locale->last_result as $row) {

	$dbname = $row->Database;

/////////////////// Show a drop-down menu of the tables (i.e., the books) for each database...//////////////////////////////////

// Might add further "and" (&&) conditions into access.php file if one doesn't wish a database to appear here; the require condition is necessary at this point in the script (instead of the beginning) since the variables hadn't been defined at the beginning to be able to be defined in the access.php file at that time.

	require ($req_dir.'access.php'); // Retrieving this again since the variable dbname has just been defined (and dbsNotToIgnore depends on it)

// This will add localized text for each (non-excluded) database introduction


	if ($dbsNotToIgnore) { // Ignore the database "test" (is this automatic for everyone?) and locale database
		$m++;

		// Set the accesskeys to begin with "z" and go backwards in the alphabet for submit buttons
		$accesskeynobutton = 123-$m;
		$accesskeybutton = chr($accesskeynobutton);
		if ($accesskeynobutton >= 106) {
			$accesskeybutton = "accesskey=\"".$accesskeybutton."\"";
		} // end if (if the letters are still greater than the last possible ("j"), give an accesskey)
		else {
			$accesskeybutton = ''; // Don't make any more accesskey's after counting down to "a"
		} // end else (if the letters are exhausted, don't give an accesskey)

		if ($m >= 18) {
			$dontcontinue = 1;	
			$accesskeyno = '';
		} // end if (if end of numbers (not including 0) reached, and also reached "h" (the last letter possibile since the other cycle counting backwards from "z"), don't have any more accesskeys)
		elseif ($m >= 10) {
			$accesskeyno = 97;
		} // end elseif (if end of numbers (not including 0) reached, start over at the beginning of the alphabet)
		else {
			$accesskeyno = $m+48; 
		} // end else (if under m is under 10, set the accesskey to a numeral (beginning with "1"))

		// (if accesskey becomes non-alphabetic, reset it to an alphabetic value (at least until exhausting the whole alphabet!)
		if (!$dontcontinue) {
			$accesskey = chr($accesskeyno);
			$accesskey = "accesskey=\"".$accesskey."\"";
		} // end if (if not to continue with accesskeys)

		$accesskey_arr[] = $accesskey;
		$m_arr[] = $m;
		$temp_choose_writ = 'choosewritings'.$m;
		$choose_writings_str[] = $strings[$temp_choose_writ];
		$choose_writings_dir[] = $textdir[$temp_choose_writ];

		$sql = "SHOW TABLES FROM \$dbname";
//		$result = $db_locale->query($sql);

		$tablelist_counter = 0;
		$option_array = array();

		foreach ((array) $db_locale->get_results($sql, ARRAY_N) as $row2) {

			if (!strpos($row2[0], '_old')) { // exclude old copies

///////////////// Add aliases for Sacred Writings to localization table instead of here (be sure to include "tablealias" and the original table name/////////////////

				$tablealias = $strings['tablealias']["{$row2[0]}"];
				$tableheading = $strings['tableheading']["{$row2[0]}"];
				$textdirec = $textdir['tablealias']["{$row2[0]}"];


				// Begin setting of arrays for sorting
				$option_array[$tablelist_counter]['value'] = $row2[0];

				if ($tablealias != '') {
					$option_array[$tablelist_counter]['text'] = $tablealias;
					$option_array[$tablelist_counter]['dir'] = $textdirec;
				} // end if (if there is a table alias)
				elseif ($tableheading !='') {
					$option_array[$tablelist_counter]['text'] = $tableheading;
					$option_array[$tablelist_counter]['dir'] = $textdirec;					
				} // end elseif (if there is at least a table heading)
			
				else {
					$temp = $lang_code;
					localize(1); // Go for the defaults
					$lang_code = $temp;
					$tablealias = $strings['tablealias']["{$row2[0]}"];
					$tableheading = $strings['tableheading']["{$row2[0]}"];
					$textdirec = $textdir['tablealias']["{$row2[0]}"];
			
					if ($tablealias != '') {
						$option_array[$tablelist_counter]['text'] = $tablealias;
						$option_array[$tablelist_counter]['dir'] = $textdirec;
					} // end elseif (if there is at least a specified heading for the table in the default language)

					elseif ($tableheading != '') {
						$option_array[$tablelist_counter]['text'] = $tableheading;
						$option_array[$tablelist_counter]['dir'] = $textdirec;
					} // end elseif (if there is at least a specified alias for the table in the default language)

					else {
						$option_array[$tablelist_counter]['text'] = $row2[0];
						$option_array[$tablelist_counter]['dir'] = $default_lang_direction;
					} // end else (if there is no table alias)

					localize(1); // Go back to the localization for the user's choice of language

				} // end else (if there is no table alias or table heading in the user's language)
			
				$tablelist_counter++;
			} // end if
		} // end foreach (of all the tables being added to the drop-down menu)

		// Run function to sort a multidimensional array (the 2nd dimension only) by a specified field
		$option_mult_arr[] = fieldSort($option_array, 'text');

		$advancedaccessno = $accesskeynobutton - 1;
		$advancedaccess = chr($advancedaccessno);
		if ($advancedaccessno >= 106) {
			$advancedaccess = "accesskey=\"".$advancedaccess."\"";
		} // end if (if the letters are still greater than the last possible ("j"), give an accesskey)
		else {
			$advancedaccess = ''; // Don't make any more accesskey's after counting down to "a"
		} // end else (if the letters are exhausted, don't give an accesskey)

		$check = htmlentities($_GET['check']);

		if ($check) {
			$checked = "checked=\"checked\"";
		} // end if

		$checked_arr[] = $checked;
		$advancedaccess_arr[] = $advancedaccess;
		$accesskeybutton_arr[] = $accesskeybutton;

	} // end if (if database is not "test" or the locale database)
// $vvv++;
} // end while (of all the databases)

$smarty->assign('option_mult_arr', $option_mult_arr);
$smarty->assign('checked_arr', $checked_arr);
$smarty->assign('advancedaccess_arr', $advancedaccess_arr);
$smarty->assign('accesskeybutton_arr', $accesskeybutton_arr);
$smarty->assign('accesskey_arr', $accesskey_arr);
$smarty->assign('m_arr', $m_arr);
$smarty->assign('choose_writings_dir', $choose_writings_dir);
$smarty->assign('choose_writings_str', $choose_writings_str);

///////// Following is XHTML valid button

//$x .= "\n".$xhtmlvalidbutton; // from access.php

$smarty->displayDoc('textbrowse0.tpl', $language."|".$langu."|".$usertype."|".date("n"));

?>