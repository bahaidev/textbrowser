<?php
///////////////////////////////////////////
// This is version 0.1 of browse0.php   ///
///////////////////////////////////////////

////////////////// Borrowed from Mediawiki index.php (for Security)--not sure if I need it, but...
unset( $IP );
@ini_set( 'allow_url_fopen', 0 ); # For security...

if ( isset( $_REQUEST['GLOBALS'] ) ) {
	die( '<a href="http://www.hardened-php.net/index.76.html">$GLOBALS overwrite vulnerability</a>');
} // end if of whether the globals request is set
//////////////////

// Defines a constant required for the password file to be accessed, then accesses the password file (with login, table, etc. data) and the file with commonly used functions; Note: access.php is accessed by require instead of require_once since it is being called for $dbsNotToIgnore which cannot be defined until later in this script (where the file is required again)
define( 'HAVEACCESS', true );
require ('access.php');
require ('commonfunctions.php');



// Define language cookie variable
$ck_language = $_COOKIE['ck_language'];


////////////////////////// Post a language-choice form if the form hasn't been submitted yet and if no cookie for it exists from a previous session

// ob_start() and ob_end_clean are needed to allow cookies to be set in the middle of the apge.

$removecookies = $_GET['removecookies'];
if ($removecookies == "yes") {
	ob_start();
	setcookie("ck_language", ""); // Remove cookie
	ob_end_flush();
	delaytime(0, $browserfile); // Redirects
} // end if (if user opted to remove cookies)

$charset = "UTF-8";


// Connect to localization database

// Fix: Have error handling for each connection in the scripts
if (!mysql_connect($host, $dbuser, $passw)) {
		echo 'Could not connect to mysql';
	exit;
} // end if (could not connect)

$connect = mysql_connect($host, $dbuser, $passw);

mysql_set_charset('utf8'); // SET NAMES utf8

mysql_select_db($localedb, $connect);


// Check that form has not already been submitted and that there is no pre-existing cookie (or that the user is for some reason submitting a blank get request), so that the choice of languages will be displayed.
if (((!isset ($_GET['langu'])) && (!isset($_COOKIE['ck_language']))) || ((isset ($_GET['langu'])) && $_GET['langu']=="")) {


// Get languages, direction and codes
	get_language($defaultlanguage, 1); // Add a "1" to indicate the language to be set is the default

// Call function to generate simple (and default) localization variables to be used for initial title
	localize();

	require_once ("navigbcs.php"); // Navigator and Breadcrumbs

// Call header function to add XHTML headers
	$title = $strings["browserfile"];

	require ('headeradd.php');
	
	$textdirection = $textdir["browserfile"];
	headerAdd($charset, $defaultlanguage, $title, $textdirection, $script);

	print <<<HERE
<noscript>
	<p class="noscript" dir="{$textdir["noscriptonchange"]}">{$strings["noscriptonchange"]}</p></noscript>
HERE;

print $bc_nv_print;

// Fix: This text could be more language-neutral by removing the instructions entirely ("browserfile", "chooselanguage" and even xml:lang="$defaultlanguage") or having them precede each language

// Find the total number of languages (to be used as the size of the select window)
    
    $languagestable = mysql_real_escape_string($languagestable);
	$query = "SELECT max(`id`) FROM `$languagestable`";
	$result = mysql_query($query);
	while ($row = mysql_fetch_row($result)) {
		$maxlangs = $row[0];
	} // end while (fetching language data)


// Print the beginning of the form.
// "browserfile" and "chooselanguage" technically do not really need to be localized, except for distributions to make it easier for an admin to simply set the default "defaultlanguage" in access.php and have their language's title and intro text appear on the "choose a language" page)

	print <<<HERE
\n<form action="$browserfile" id="languageform" method="get">
	<p class="langs" dir="{$textdir["chooselanguage"]}">
		<label accesskey="a" for="language">{$strings["chooselanguage"]}:<span><br /><br /></span></label>
HERE;


print <<<HERE
		<select name="langu" id="language" size="$maxlangs" onchange="javascript:this.form.submit();" dir="{$textdir["chooselanguage"]}">
HERE;

// Find and print the language information from the languages table of the localization database. Fix: This could be done as a list of links if desired (make a template?)

	$query = "SELECT id as lang_id, code as lang_code, direction as lang_direction, name as lang_name FROM `$languagestable` ORDER BY name";
	$result = mysql_query($query);


	$lang_counter = 0; // Used toward creating a default selected language.
	while ($row = mysql_fetch_assoc($result)) {
		print <<<HERE
\n			<option id="option$lang_counter" value="{$row['lang_code']}" 
HERE;

		if ($lang_counter == 0 ) {
			print "selected=\"selected\" ";
		} // end if (if the table is the first in the list, give it the selected value for accessibility purposes)
		$lang_counter++;
			
		print <<<HERE
dir="{$row['lang_direction']}" xml:lang="{$row['lang_code']}">{$row['lang_name']}</option>
HERE;
	} // end while (fetching all languages)

// Don't add an "id" to the submit button; doing so breaks the select's onchange script!
	print <<<HERE
</select></p>
	<p class="langs" dir="{$textdir["submitgo"]}">
		<input type="submit" accesskey="z" value="{$strings['submitgo']}" dir="{$textdir['submitgo']}" /></p></form>
HERE;
} // end if (if form not submitted already nor cookie already registered)


//////////////////// Post page of table options if a cookie is found or a form was just submitted ///////////////////

else {


// Set up cookie with value of just submitted form
// Possibilities at this stage:
//		1) No GET  |    cookie
//		2) GET     |    no cookie
//		3) GET     |    cookie (get is same or different than previous cookie)


	$langu = $_GET['langu'];
	if ($langu == "") {
		$langu = $_COOKIE['ck_language'];
	}
	
	if ((!isset($_COOKIE["ck_language"])) || ($langu != "" && $langu != $_COOKIE["ck_language"])) {  // If a cookie is not set already, or if there is a submitted GET value which is different from the existing cookie, set a new cookie with the submitted value (if there is no cookie and no get, it wouldn't get here (to this "else"))
		ob_start();
		setcookie("ck_language", "", time()-60);
		setcookie("ck_language", $langu, time()+$cookieduration);
		ob_end_flush();
	} // end if (if cookie is not set)


// If the cookie has sunk in already, set the variable to that cookie. If it hasn't sunk in (for the first time), use the form submission value.

// If there is no GET (but a cookie was set), $ck_language will still be the same as the cookie value, so it should skip this step (which relies on a GET value) (if the GET was set to null, it wouldn't get to this (else) stage)

	if ($langu !="") {
		$ck_language = $langu;
	} // end if (if GET value is not blank)


// Get languages, direction and codes

	get_language($ck_language);
	get_language($defaultlanguage, 1); // Add a "1" to indicate the language to be set is the default


// Set up the localization array to be used in this script from the localization database.

	localize(1); // "1" is for a complex localization (including tables, etc.) of a non-default language

	require_once ("navigbcs.php"); // Navigator and Breadcrumbs
	require ('headeradd.php');

	// Call header function to add XHTML headers
	$title = $strings["browserfile"];
	$textdirection = $textdir["browserfile"];
	headerAdd($charset, $lang_code, $title, $textdirection, $script);

	print <<<HERE
<noscript>
	<p class="noscript" dir="{$textdir["noscriptonchange"]}">{$strings["noscriptonchange"]}</p></noscript>
HERE;

print $bc_nv_print;

///////////////// Print option to remove cookies and start over with new choice of language interface
	print <<<HERE

<p class="removecookies" dir="{$textdir["removecookies"]}"><small><a title="{$strings["resetinterfacelang"]}" accesskey="0" href="$browserfile?removecookies=yes">{$strings["removecookies"]}</a></small></p>
<h2 class="fileheading">$title</h2>
<p><br /></p>
HERE;


/////////////////// Get list of databases (must have user access to each one desired)... /////////////////

	$db_list = mysql_list_dbs($connect);

    
	$m = 0;
	while ($row = mysql_fetch_object($db_list)) {
		$dbname = $row->Database;

/////////////////// Show a drop-down menu of the tables (i.e., the books) for each database...//////////////////////////////////

// Might add further "and" (&&) conditions into access.php file if one doesn't wish a database to appear here; the require condition is necessary at this point in the script (instead of the beginning) since the variables hadn't been defined at the beginning to be able to be defined in the access.php file at that time.

		require ('access.php'); // Retrieving this again since the variable dbname has just been defined (and dbsNotToIgnore depends on it)

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
				$accesskeybutton = ""; // Don't make any more accesskey's after counting down to "a"
			} // end else (if the letters are exhausted, don't give an accesskey)

			if ($m >= 18) {
				$dontcontinue = 1;	
				$accesskeyno = "";
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
					

			print <<<HERE
\n<div class="writings">
	<form action="$browsetextfile" method="get" id="browse$m">
		<p class="choosewritings" dir="{$textdir["choosewritings{$m}"]}">
			<label $accesskey id="choosewritings$m" for="file$m">{$strings["choosewritings{$m}"]}:</label></p>
		<p class="choosewritings" dir="{$textdir["choosewritings{$m}"]}">
HERE;


			print <<<HERE
			<select class="choosewritings$m" name="file" id="file$m" size="1" onchange="javascript:this.form.submit();">
HERE;

			$sql = "SHOW TABLES FROM $dbname";
			$result = mysql_query($sql);

			$tablelist_counter = 0;
			$option_array = array ();

			while ($row2 = mysql_fetch_row($result)) {

///////////////// Add aliases for Sacred Writings to localization table instead of here (be sure to include "tablealias" and the original table name/////////////////

				$tablealias = $strings["tablealias"]["{$row2[0]}"];
				$tableheading = $strings["tableheading"]["{$row2[0]}"];
				$textdirec = $textdir["tablealias"]["{$row2[0]}"];


				// Begin setting of arrays for sorting
				$option_array[$tablelist_counter]['value'] = $row2[0];

				if ($tablealias != "") {
					$option_array[$tablelist_counter]['text'] = $tablealias;
					$option_array[$tablelist_counter]['dir'] = $textdirec;
				} // end if (if there is a table alias)
				elseif ($tableheading !="") {
					$option_array[$tablelist_counter]['text'] = $tableheading;
					$option_array[$tablelist_counter]['dir'] = $textdirec;					
				} // end elseif (if there is at least a table heading)
				
				else {
					$temp = $lang_code;
					localize(1); // Go for the defaults
					$lang_code = $temp;
					$tablealias = $strings["tablealias"]["{$row2[0]}"];
					$tableheading = $strings["tableheading"]["{$row2[0]}"];
					$textdirec = $textdir["tablealias"]["{$row2[0]}"];
				
					if ($tablealias != "") {
						$option_array[$tablelist_counter]['text'] = $tablealias;
						$option_array[$tablelist_counter]['dir'] = $textdirec;
					} // end elseif (if there is at least a specified heading for the table in the default language)

					elseif ($tableheading != "") {
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

			} // end while (of all the tables being added to the drop-down menu)
	
			// Run function to sort a multidimensional array (the 2nd dimension only) by a specified field
			$option_array = fieldSort($option_array, 'text');

			for ($i=0; $i<$tablelist_counter; $i++) {
				print <<<HERE
\n				<option class="{$m}option" id="option{$m}-{$i}" value="{$option_array[$i]['value']}" 
HERE;
				if ($i == 0 ) {
					print "selected=\"selected\" ";
				} // end if (if the table is the first in the list, give it the selected value for accessibility purposes)

				print <<<HERE
dir="{$option_array[$i]['dir']}">{$option_array[$i]['text']}</option>
HERE;
			} // end for (looping through the now-sorted array to print out the menu options


			$langu = $ck_language; // Inversing language variables so that browse.php can receive "langu" as a GET variable
			
			
			
			$advancedaccessno = $accesskeynobutton - 1;
			$advancedaccess = chr($advancedaccessno);
			if ($advancedaccessno >= 106) {
				$advancedaccess = "accesskey=\"".$advancedaccess."\"";
			} // end if (if the letters are still greater than the last possible ("j"), give an accesskey)
			else {
				$advancedaccess = ""; // Don't make any more accesskey's after counting down to "a"
			} // end else (if the letters are exhausted, don't give an accesskey)

			$check = htmlentities($_GET['check']);

			if ($check) {
				$checked = "checked=\"checked\"";
			} // end if
			print <<<HERE
</select>
			<input name="langu" type="hidden" value="$langu" /></p>
		<p class="choosewritings" dir="{$textdir["submitgo"]}">
			<label $advancedaccess for="advancedmode">{$strings["advancedmode"]}?:</label>
			<input name="showstat" id="advancedmode" $checked class="advancedmode" type="checkbox" value="inline" /><div><br /></div>
			<input id="submit$m" $accesskeybutton type="submit" value="{$strings["submitgo"]}" /></p><div><br /></div>
</form></div>
HERE;

		} // end if (if database is not "test" or the locale database)

	} // end while (of all the databases)

///////// Following is XHTML valid button

//	print "\n".$xhtmlvalidbutton; // from access.php
} // end else (if form submitted already or cookie already registered from earlier)

print "\n\n\n\n	</body>\n</html>";

?>