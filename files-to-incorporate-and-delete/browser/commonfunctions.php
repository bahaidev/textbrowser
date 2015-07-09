<?php
// Requires a constant to be defined already (in the calling script)

if( defined( 'HAVEACCESS' ) ) {
	$noscript = $_GET['noscript'];
// Global variables for functions

// The following was taken from http://jehiah.com/archive/scrolling-in-select-box-fires-onchange
if (!$noscript) {
	$script = <<<HERE
<script type="text/javascript" src="behavior.js"></script>
		<script type="text/javascript">
			// <![CDATA[

				function switchfunctions(el){
				   el._scrolling = el.onchange;
				   el.onchange = null;
				}

				var scrollfix = {
				'select' : function (el){

				   if ( typeof(document.media)=='string'){// dom check for ie
				     // grab the real functions
				     el.scrollonchange = el.onchange ? el.onchange : function(){return true;};
				     el.scrollonclick = el.onclick ? el.onclick : function(){return true;};
				     el.scrollonblur = el.onblur ? el.onblur : function(){return true;};
				     el.scrollonfocus = el.onfocus ? el.onfocus : function(){return true;};

				     // make a new onchange which will switch if it's fired twice in a row before onclick or onblur
				     el.onchange = function(){
				        debug("new onchange");
        				if (this.scrolling && this.scrollingfix){switchfunctions(this);return false;}
				        if (this.scrollingfix){this.scrolling=true;}
				        el.scrollonchange();
				     }

				     // now set the flag so we know this happened between onchange()'s
				     el.onfocus = function(){
        				this.scrolling = false; // set flag
				        this.scrollingfix = true;
        				this.scrollonfocus();
				     }

				     // now set the flag so we know this happened between onchange()'s
				     el.onclick = function(){
				        this.scrolling = false; // set flag
        				this.scrollingfix = true;
				        this.scrollonclick();
     				}

				     // set flag so we know this happened between scrolling && re-set the onchange if needed
				     el.onblur = function(){
        				if (this._scrolling){
				           this.scrolling = false; // set flag so original onchange is happy
        				   this.onchange = this._scrolling; // unswitch functions
				           this.onchange();
				           this._scrolling = false;
        				}
				        this.scrolling = false; // set flag
        				this.scrollingfix = false;
				        this.scrollonblur(); // run original function
				     }
				   }
				}
				};
				Behaviour.register(scrollfix);
			// ]]></script>
HERE;
} // end if

// Frequent functions

// The following is a javascript that can be printed by PHP as HTML to pause and redirect the user back to the same page (when password is incorrect)...
function delaytime ($delayseconds, $redirectURL) {

/*
// Fix: When I used the following, sleep() did seem to delay the execution, but it did not provide the output printed before hand. Find a way to show the redirect information but also run the header.

//	sleep($delayseconds);
	header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']).'/'.$redirectURL.''); // This worked ok, but not with sleep()
	exit();
*/
	global $strings, $textdirec;

	$delaytime = <<<HERE
	<script type="text/javascript">

	var redirect="$redirectURL";
	var pausetime=$delayseconds;

	function delaying(){
		if (window.timer){;
			clearInterval(timer);
			clearInterval(timer_2);
		}
		window.location=redirect;
	}
	setTimeout("delaying()",pausetime*1000);

	</script>
HERE;

	print "<p dir='$textdirec'>".$strings['nofileyet']."<br /><br />".$strings['willberedirected']."<a href='$redirectURL'>".$strings['notwait']."</a>.</p>";

	print $delaytime;

	print "</body></html>";

	exit();
} // end function delaying


// With wrong password, remove cookies, print redirect notice, and redirect
// Used if password is not correct or not for right language
function assistant_wrongpass_redirect() {
	global $strings, $assistantfile;
	ob_start();
	setcookie("edit_language", ""); // Remove cookie
	setcookie("edit_pass", ""); // Remove cookie
	ob_end_clean();

	print $strings["assistantwrongpassword"].".<br /><br />".$strings["assistantredirecting"]." <a href='{$assistantfile}'>{$assistantfile}</a>...";

	delaytime(5, $assistantfile); // Delays 5 seconds and redirects
} // end function assistant_wrongpass_redirect


// Looks for a field shortcut; if none, uses the default
function localize_fields ($fieldkey, $fieldface) {
	global $file, $strings, $textdir, $default_lang_direction, $textdirec, $field_lang_code;
	global $fieldshortcut; // Used if input is fieldshortcut
	global $fieldalias; // Used if input is fieldalias
	
// get_field($fieldkey, $file); // Fix: Add this in some manner if and when allowing one to multilingually view field names (based on original language of the field); will need to do the same for the table listing in browse0.php
		
	if ($strings[$fieldface][$file][$fieldkey] != "") {
		$$fieldface = $strings[$fieldface][$file][$fieldkey];
		$textdirec = $textdir[$fieldface][$file][$fieldkey];

		// Fix: Note sure which of the following (if not both) would be necessary to tweak in here.
		// get_language($orig_lang_code); // Fix: Add this in some manner if and when allowing one to multilingually view field names (based on original language of the field); will need to do the same for the table listing in browse0.php
		//$field_lang_code = $field_lang_codes[$fieldface][$file][$fieldkey]; // See Fix: above

	} // end if (if there is a defined field shortcut, at least in the default language)
	
	elseif ($strings['fieldshortcut'][$file][$fieldkey] != "") {
		$$fieldface = $strings['fieldshortcut'][$file][$fieldkey];
		$textdirec = $textdir['fieldshortcut'][$file][$fieldkey];
	} // end elseif
	
	else {
		$$fieldface = $fieldkey;
		$textdirec = $default_lang_direction;
		//$field_lang_code = $lang_code; //See Fix: above
	} // end else (if there is no defined field shortcut or alias)
	
} // end function localize_fields


function max_min ($maxminbrws_fld, $maxminname="max", $value="") {
	global $file;
	global $hardcodeddb, $host, $dbuser, $passw;
	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));

	if ($maxminname=="max") {
		$query = "SELECT max(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
		$maxfield = mysql_query($query);
		$maxfield2 = mysql_fetch_row($maxfield);
		$maxmin = $maxfield2[0];

		$queryB = "SELECT min(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
		$minfieldB = mysql_query($queryB);
		$minfield2B = mysql_fetch_row($minfieldB);
		$min = $minfield2B[0];
		if ($min > 1) {
			$value = $min;
		} // If the minimum is greater than 1, set the default maximum value to the minimum's value
	}
	
	else {
		$query = "SELECT min(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
		$minfield = mysql_query($query);
		$minfield2 = mysql_fetch_row($minfield);
		$maxmin = $minfield2[0];
		$value = $maxmin;
	}
	return $value;
} // end function max_min


// This function is used by verse_selection to print out the recurring input boxes.
function print_verse_selection ($fields_name, $textdirec, $a, $option_no, $value="", $maxminbrws_fld, $maxminname="max") {
	global $file;
	
	global $printversecounter;
	$versecounteralph = chr($printversecounter);
	$printversecounter++;

	global $strings, $textdir;
	global $hardcodeddb, $host, $dbuser, $passw;
	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));


	if ($maxminname=="max") {
		$query = "SELECT max(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
		$maxfield = mysql_query($query);
		$maxfield2 = mysql_fetch_row($maxfield);
		$maxmin = $maxfield2[0];

		$queryB = "SELECT min(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
		$minfieldB = mysql_query($queryB);
		$minfield2B = mysql_fetch_row($minfieldB);
		$min = $minfield2B[0];
		if ($min > 1) {
			$value = $min;
		} // If the minimum is greater than 1, set the default maximum value to the minimum's value
	}
	
	else {
		$query = "SELECT min(`$maxminbrws_fld`) FROM `$file` WHERE `$maxminbrws_fld` REGEXP '^[0-9]+\$'";
print $query;
		$minfield = mysql_query($query);
		$minfield2 = mysql_fetch_row($minfield);
		$maxmin = $minfield2[0];
		$value = $maxmin;
	}
	
	print <<<HERE
\n			<label accesskey="$versecounteralph" dir="$textdirec" for="$a$option_no">$fields_name</label>: 
			<input dir="{$textdir[$maxminname]}" title="{$strings[$maxminname]}: $maxmin" value="$value" id="$a$option_no" name="$a$option_no" type="text" size="7" /> &nbsp; 
HERE;
} // end function print_verse_selection


/////////////////Displays the input boxes for which range of verses one wishes to browse////////////////////
function verse_selection ($fields_name1, $fields_name2="", $fields_name3="", $textdirec1, $textdirec2="", $textdirec3="", $option_no=1, $maxminbrws_fld_A="", $maxminbrws_fld_B="", $maxminbrws_fld_C="") {

	global $strings, $textdir;

	// The following are hard-coded into the function, as no function calls needed to specify them; if they are ever needed, they should be taken out of here, added to the function call, and the function parameters above should be expanded to begin:   $a, $b="", $c="", $d, $e="", $f="",
	$a = "blevela";
	$b = "blevelb";
	$c = "blevelc";
	$d = "elevela";
	$e = "elevelb";
	$f = "elevelc";

	print <<<HERE
\n		<fieldset class="subverseselection" dir="{$textdir['numbersonly']}" title="{$strings['numbersonly']}
HERE;

	if ($fields_name2 !="") {
		print <<<HERE
; {$strings['versesendingdataoptional']}
HERE;
	} // end if (there is no second field)

	print "\">";
	
	print_verse_selection($fields_name1, $textdirec1, $a, $option_no, "0", $maxminbrws_fld_A, "min");
	if ($fields_name2 !="") {
		print_verse_selection($fields_name2, $textdirec2, $b, $option_no, "0", $maxminbrws_fld_B, "min");
	} // end if (there is no second field)
	if ($fields_name3 !="") {
		print_verse_selection($fields_name3, $textdirec3, $c, $option_no, "0", $maxminbrws_fld_C, "min");
	} // end if (there is no third field)
	print <<<HERE
\n			&nbsp; &nbsp; &nbsp;&nbsp;
			<b><span class="subverseselection" dir="{$textdir['to']}">{$strings['to']}:</span></b>
			&nbsp; &nbsp; &nbsp; 
HERE;
	print_verse_selection($fields_name1, $textdirec1, $d, $option_no, "1", $maxminbrws_fld_A);
	if ($fields_name2 !="") {
		print_verse_selection($fields_name2, $textdirec2, $e, $option_no, "1", $maxminbrws_fld_B);
	} // end if (there is no second field)
	if ($fields_name3 !="") {
		print_verse_selection($fields_name3, $textdirec3, $f, $option_no, "1", $maxminbrws_fld_C);
	} // end if (there is no third field)
	print "</fieldset>";
} // end function verse_selection


// Get the metadata pertaining to a particular table (book), such as field browsing priorities.
function get_table($file) {
	global $table_check; // Only used to check that a value exists
	global $table_data_table;
	global $browse_levels, $browse_options, $browse_field_A, $browse_field_B, $browse_field_C, $browse_field_1, $browse_field_2, $browse_field_3, $default_field, $default_field_value, $default_field2, $default_field_value2, $toggle1, $toggle2, $toggleall, $fieldtoggle, $function_field, $alias_field, $escapehtml, $outputhtml;
	global $orig_lang_code, $orig_edit_lang;
	
	global $localedb, $host, $dbuser, $passw;
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
	$table_data_table = addslashes($table_data_table);
$query = "SELECT `table_name`, `browse_levels`, `browse_options`, `browse_field_A`, `browse_field_B`, `browse_field_C`, `browse_field_1`, `browse_field_2`, `browse_field_3`, `default_field`, `default_value`, `default_field2`, `default_field_value2`, `toggle1`, `toggle2`, `toggleall`, `fieldtoggle`, `function_field`, `alias_field`, `orig_lang_code`, `orig_edit_lang`, `escapehtml`, `outputhtml` FROM $table_data_table WHERE table_name = '$file'";
	
	$result = mysql_query($query);
	while ($row = mysql_fetch_assoc($result)) {
		$table_check = $row['table_name']; // Only used to check that a value exists
		$browse_levels = $row['browse_levels'];
		$browse_options = $row['browse_options'];
		$browse_field_A = $row['browse_field_A'];
		$browse_field_B = $row['browse_field_B'];
		$browse_field_C = $row['browse_field_C'];
		$browse_field_1 = $row['browse_field_1'];
		$browse_field_2 = $row['browse_field_2'];
		$browse_field_3 = $row['browse_field_3'];
		$default_field = $row['default_field']; // If a browse range is not specified, this value will be used in conjunction with the next variable to select a default range.
		$default_field_value = $row['default_value']; // See default_field above
		$default_field2 = $row['default_field2'];
		$default_field_value2 = $row['default_field_value2'];
		$toggle1 = $row['toggle1'];
		$toggle2 = $row['toggle2'];
		$toggleall = $row['toggleall'];
		$fieldtoggle = $row['fieldtoggle'];
		$function_field = $row['function_field'];
		$alias_field = $row['alias_field'];
		$escapehtml = $row['escapehtml'];
		$outputhtml = $row['outputhtml'];
		$orig_lang_code = $row['orig_lang_code']; // To be used in the future to determine (in multilingual mode) what language and direction the table should be displayed in (alongside other tables)
		$orig_edit_lang = $row['orig_edit_lang']; // To be used to determine what the original language (and language direction) to table's fields were edited in
	} // end while (finding table's details)
} // end function get_table



// Get the metadata pertaining to a particular field (its original language)
function get_field($fieldkey, $tablekey) {
	// global $fieldkey; // (Don't need this, since $file is the same)
	global $field_data_table;
	global $orig_lang_code_field, $langdirection, $defaultlanguage;
	global $checkbox_field, $is_auto_field;
	global $localedb, $host, $dbuser, $passw;
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
	
	$field_data_table = addslashes($field_data_table);
	
	$query = "SELECT fieldkey, tablekey, orig_lang_code, checkbox, auto_field FROM `$field_data_table` WHERE fieldkey = '$fieldkey' AND tablekey = '$tablekey' OR (fieldkey = '$fieldkey' AND tablekey = '')";
	$result = mysql_query($query);
	$checkbox_field = "1";
	$orig_lang_code_field = $defaultlanguage; // In case it doesn't go through the loop below at all
	if ($result != "") {
		while ($row = mysql_fetch_assoc($result)) {
		// $fieldkey = $row['fieldkey']; (Don't need this, since submitted $fieldkey will be the same)
		// $tablekey = $row['tablekey']; (Don't need this, since submitted $tablekey will be the same)
			$orig_lang_code_field = $row['orig_lang_code'];
			$checkbox_field = $row['checkbox'];
			$is_auto_field = $row['auto_field'];
		} // end while (finding field's details)
	} // end if (if there is any data in the result)

	get_language($orig_lang_code_field);

} // end function get_field



// Get languages, direction and codes for the (default or ck_language (browse0.php) or edit (assistant.php)) language.
function get_language($codelang, $default=0) { // The second parameter is necessary since a condition testing whether codelang = defaultlanguage would only be able to test whether the value of codelang was equal to that of defaultlanguage (i.e., it could be a different variable, but with the same value) and not test whether the passed variable was in fact defaultlanguage
	global $languagestable;
	global $lang_direction, $lang_code, $lang_name, $charset; // Used by first while
	global $default_lang_direction, $default_lang_code, $default_lang_name, $default_charset; // Used by second while

	global $localedb, $host, $dbuser, $passw;
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));

	$languagestable = addslashes($languagestable);

	$query = "SELECT charset, direction as lang_direction, code as lang_code, name as lang_name FROM `$languagestable` WHERE code = '$codelang'";

	$result = mysql_query($query);
	if (!$default) {
		while ($row = mysql_fetch_assoc($result)) {
			$lang_direction = $row['lang_direction'];
			$lang_code = $row['lang_code'];
			$lang_name = $row['lang_name'];
			// $charset = $row['charset']; // Uncomment this line if specific languages codes are desired instead of UTF-8 (if not, one can remove "charset" as a field from the query, but for easiness in switching back-and-forth, one can just leave it); what is important is to ensure that one is using the right encoding when storing the SQL items (UTF-8 is probably easier since one can edit the langauges all at once without worry of accidentally converting them, and it is accepted in all modern browsers).
		} // end while (finding the language's details)
	} // end if (if the language to be set is not the default)
	else {
		while ($row = mysql_fetch_assoc($result)) {
			$default_lang_direction = $row['lang_direction'];
			$default_lang_code = $row['lang_code'];
			$default_lang_name = $row['lang_name'];
			// $default_charset = $row['charset']; // This line, even if uncommented, has no use at present; it is only presented for comprehensiveness or in the event that one wishes to use the default language's charset. See comments under the while above
		} // end while (finding the language's details)
	} // end else (if the language to be set is the default)
} // end function get_language



// Function to turn localization database into conveniently accessed array
// Thanks to http://www.fuzzygroup.com/writing/php_localization_of_your_website.htm for the concept.
function localize($otherlang=0) {
	global $defaultlanguage, $localetable, $strings, $textdirection; // For either simple (and default) or complex localization
	global $lang_code, $lang_direction, $default_lang_direction, $textdir; // For complex (tabular, field, etc.) localization

	global $localedb, $host, $dbuser, $passw;
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));

	$localetable = addslashes($localetable);
		
	if ($lang_code == "" || $lang_code == $defaultlanguage) { // Fix: The first part of this "if" might need to be changed if this option is desired (i.e., the simple call, e.g., for the HTML title) and if $lang_code would be defined before (as from a previous non-default call to the get_language function)
		
		$query = "SELECT stringkey, tablekey, fieldkey, $defaultlanguage FROM `$localetable`";	
	} // end if (if only the default language is needed or if the default is the same as the additional language)
	else {
		$query = "SELECT stringkey, tablekey, fieldkey, $lang_code, $defaultlanguage FROM `$localetable`";
	} // end else (if the language is not the default)

    $query .= " ORDER BY fieldkey DESC, tablekey DESC, stringkey DESC";
    
	$result = mysql_query($query);

	if (!$otherlang) {
$strings = array();
		while ($row = mysql_fetch_array($result)) {
			$string = $row[$defaultlanguage];
			$stringkey = $row["stringkey"];
			$tablekey = $row["tablekey"];
			$fieldkey = $row["fieldkey"];
			$strings[$stringkey] = $string;
			$textdir[$stringkey] = $default_lang_direction;

			// Set localization for table key (if text is related to a particular book or not)
			if ($fieldkey != "" &&
                    (!$strings[$stringkey] || is_array($strings[$stringkey])) // Brett recently added this condition to avoid string offset error
                ) {
                if (!$strings[$stringkey]) {
                    $strings[$stringkey] = array();
                }
                if (!$strings[$stringkey][$tablekey]) {
                    $strings[$stringkey][$tablekey] = array();
                }
                
                $strings[$stringkey][$tablekey][$fieldkey] = $string;
                    
				$textdir[$stringkey][$tablekey][$fieldkey] = $default_lang_direction;
			} // end if (if there is a tablekey and fieldkey)--i.e., the text is related to a particular field of a particular book)
			elseif ($tablekey != "") {
				$strings[$stringkey][$tablekey] = $string;
				$textdir[$stringkey][$tablekey] = $default_lang_direction;
			} // end else (if there is a tablekey (but not a fieldkey)--i.e., the text is related to a particular book)
			else {
				$strings[$stringkey] = $string;
				$textdir[$stringkey] = $default_lang_direction;
			} // end else (if there is no fieldkey or tablekey--i.e., the text is not related to only a particular book or field)
			
			
		} // end while (fetching localization data)
	} // end if (if using simple mode (default language))

	else { // (Otherlanguage than the default)
		// Assume for now that data exists for a given language...
		while ($row = mysql_fetch_array($result)) {
			$string = $row[$lang_code];
			$textdirection = $lang_direction;

			$stringkey = $row["stringkey"];
			$tablekey = $row["tablekey"];
			$fieldkey = $row["fieldkey"];

			if ($tablekey=="tableheading" || $tablekey=="tablealias") {
				// Do nothing (besides avoid the elseif below--i.e., allow the string to be blank so that the script can check for acceptable alternatives to the current string within the same language before checking in the default)
			} // end if (if tablekey is for a table)

			// If there is no data for a given language (or if it is the same as the default (likely due to copying in the edit form)--this is a newly added condition to avoid strange directionality in as-yet-untranslated-but-form-submitted values), change the value to the default (and direction to left-to-right)--See also the fix: in assistant.php re: $lang_code
			// Note: if there is an edit_language being used here, but with the same value as the default, it will (harmlessly) pass this if condition also.
			elseif ($string=="" || $string == $row[$defaultlanguage]) {
				$string = $row[$defaultlanguage];
				// Get languages, direction and codes for the default language
				$textdirection = $default_lang_direction; // Obtained from above function
			} // end elseif (if no data for the given language, or it is duplicating the original due to an assistant/admin saving the page of edits without working on this particular translation)
	
	// Set localization for table key (if text is related to a particular book or not)
			if ($fieldkey != "") {
				$strings[$stringkey][$tablekey][$fieldkey] = $string;
				$textdir[$stringkey][$tablekey][$fieldkey] = $textdirection;
			} // end if (if there is a tablekey and fieldkey)--i.e., the text is related to a particular field of a particular book)
			elseif ($tablekey != "") {
				$strings[$stringkey][$tablekey] = $string;
				$textdir[$stringkey][$tablekey] = $textdirection;
			} // end else (if there is a tablekey (but not a fieldkey)--i.e., the text is related to a particular book)
			else {
				$strings[$stringkey] = $string;
				$textdir[$stringkey] = $textdirection;
			} // end else (if there is no fieldkey or tablekey--i.e., the text is not related to only a particular book or field)
		} // end while (going through all language localization values)
	} // end else (If using complex (in addition to the default) mode)

} // end function localize



// This is to sort multidimensional arrays
// Adapted from a function from Jeremy Swinborne on 21-Jul-2005 04:56 at http://php.liukang.com/manual/en/function.usort.php
function fieldSort($unsorted, $field) {
   $sorted = $unsorted;
   for ($i=0; $i < sizeof($sorted)-1; $i++) {
     for ($j=0; $j<sizeof($sorted)-1-$i; $j++)
       if ($sorted[$j][$field] > $sorted[$j+1][$field]) {
         $tmp = $sorted[$j];
         $sorted[$j] = $sorted[$j+1];
         $sorted[$j+1] = $tmp;
     } // end if (going through half of the array(?))
   } // end for (going through whole array)
   return $sorted;
} // end function fieldSort

} // end if defined HAVEACCESS
?>