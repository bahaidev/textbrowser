<?php

// Fix: Need to test to make sure will work with register globals off

/////////////////
// This is version 0.5 of browse9.php
// Search this document for "New Book Add:" to find sections which may need customization when adding a new book to the database
// Search this document for "Fix:" to find items to fix for better coding.
////////////////

$is_php5 = true; // Used for setting Smarty compile_dir (called in basics.php5)
$caching_off = true; // Comment out when not testing

// Define file variable
$file = $_GET['file'];

$textbrowser = true; // Will ensure $db_blo is referring to Text Browser rather than BLO databases

require('/home/bahai/inc_files/basics.php5'); // Repeated essentials for setup

require($req_dir.'getlangu.php');
require($req_dir.'headeraddprep0.php');

// $smarty->assign($strings);
// $smarty->assign('textdir', $textdir);


$fieldface = "fieldalias";

$trns = 0; // Table row numbering counter (for make_table function)

require($req_dir.'br9funcs.php');

$groupbytoggle = $_GET['gbt']; // This will cause the results to be sorted first according to the toggle field

// Define file variable
$file = $_GET['file'];

// Fix: This is also called in headerpreptoadd (remove the stuff from there, not here, as the localization is necessary for the auto field data array additions below, which are themselves necessary before going to colpercent
// Get languages, direction and codes
get_language($langu);
get_language($defaultlanguage, 1); // Add a "1" to indicate the language to be set is the default
// Call function to generate localization variables
localize(1);


if ($file != "") {
	/////////// Explicitly declare static get globals ///////////
	// The following are mostly in the order they appear in browse.php (dynamically generated ones have been moved out of order into a separate section below)
	
	///////// Formatting get globals /////////
	$color2 = $_GET['color2'];
	$color = $_GET['color'];
	$bgcolor2 = $_GET['bgcolor2'];
	$bgcolor = $_GET['bgcolor'];
	///////////// Go with the pull-down menu of colors if the color field is blank or only includes the hash mark ///////////////
	if ($color == "" || $color == "#") {
		$color = $color2;
	} // end if (if color input field is blank, set it to the menu value)
	if ($bgcolor == "" || $bgcolor == "#") {
		$bgcolor = $bgcolor2;
	} // end if (if background-color input field is blank, set it to the menu value)
	
	$font = $_GET['font'];
	$fontstyle = $_GET['fontstyle'];
	$fontvariant = $_GET['fontvariant'];
	$fontweight = $_GET['fontweight'];
	$fontsize = $_GET['fontsize'];
	$fontstretch = $_GET['fontstretch']; // currently explicitly only using letterspacing since fontstretch is not well-supported and letter-spacing does the trick
	
	$letterspacing = $_GET['letterspacing'];
	$lineheight = $_GET['lineheight'];
	
	$headings = $_GET['headings'];


	$border = $_GET['border'];
	if ($border == "") {
		$border = "solid";
	} // end if (if there is no border code specified for some reason, add a border anyways) 
////////////////

	$nottoscroll = $_GET['nottoscroll'];
	$noscrolling = 1;
	// IE for Mac 5.23 doesn't support CSS for table scrolling
	if ((strstr($_SERVER['HTTP_USER_AGENT'], "MSIE 5.23; Mac")) || ($nottoscroll) || ($headings=="0")) { 
		$noscrolling = 0;
	} // end if (if it is an old browser which does not accept CSS (for table scrolling)


////// Find number of fields to determine the maximum cycle length for the option and field variables

	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));
	$result0 = mysql_query("SELECT * FROM `".mysql_real_escape_string($file)."`");
	$totalfields = mysql_num_fields($result0);


	// Get auto-field data for later use
	
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
	


	
	$query_auto = "SELECT stringkey, placement, lang_code, field_reference, field_reference2, field_reference3, param1, param2, funct_call, lang_category FROM `".mysql_real_escape_string($auto_field_data)."` WHERE tablekey='".mysql_real_escape_string($file)."' OR (tablekey='' AND tablekeyno NOT LIKE '%--".mysql_real_escape_string($file)."--%')";
	$result_auto = mysql_query($query_auto);
	
	while ($row_auto = mysql_fetch_assoc($result_auto)) {
		// The 'if' assumes there is a field_reference (the elseif and else do not)
		// Could add the following if desired: 	if ($row_auto['field_reference'] != "") {
		if ($row_auto['lang_category'] == "") { // No special language category, just applied to all books (minus any exceptions)--e.g., one wiki per book/table
			$stringkey = $row_auto['stringkey'];
			if (!get_magic_quotes_gpc()) {
				$stringkey2 = addslashes($stringkey);
			} // end if
			else {
				$stringkey2 = $stringkey;
			} // end else
			$auto_fld_stringkey[] = $row_auto['stringkey'];
			$auto_fld_string[] = $strings["$stringkey2"];
// print $stringkey2."<br />\n";
// print $strings["$stringkey2"]."<hr />\n";
			if ($row_auto['placement'] == "-1") {
				$auto_fld_placement[] = $totalfields;
			} // end if
			else {
				$auto_fld_placement[] = $row_auto['placement'];
			} // end else
			$auto_fld_lang_code[] = $row_auto['lang_code'];
			$auto_fld_reference[] = $row_auto['field_reference'];
			$auto_fld_reference2[] = $row_auto['field_reference2'];
			$auto_fld_reference3[] = $row_auto['field_reference3'];
			$auto_fld_funct_call[] = $row_auto['funct_call'];
	//print "1".$row_auto['placement'].":".$strings["$stringkey2"]."<br />\n";
			$auto_fld_param1[] = $row_auto['param1'];
			$auto_fld_param2[] = $row_auto['param2'];
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
					if (!get_magic_quotes_gpc()) {
						$stringkey2 = addslashes($stringkey);
					} // end if
					else {
						$stringkey2 = $stringkey;
					} // end else
					$auto_fld_stringkey[] = $row_auto['stringkey'];
					$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")";
					if ($row_auto['placement'] == "-1") {
						$auto_fld_placement[] = $totalfields;
					} // end if
					else {
						$auto_fld_placement[] = $row_auto['placement'];
					} // end else
					$auto_fld_lang_code[] = $row_auto['lang_code'];
					$auto_fld_reference[] = $row['fieldkey']; // Was $row_auto['field_reference'];
					$auto_fld_reference2[] = $row_auto['field_reference2'];
					$auto_fld_reference3[] = $row_auto['field_reference3'];
					$auto_fld_funct_call[] = $row_auto['funct_call'];
	//print "2".$row_auto['placement'].":".$strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")"."<br />\n";
					$auto_fld_param1[] = $row_auto['param1'];
					$auto_fld_param2[] = $row_auto['param2'];
				} // end if
				$fields_to_ignore[] = $row['fieldkey'];
			} // end while
			// Don't include fields like unique_id (from access.php)
			$fields_to_include = array();
			for ($i = 0; $i < $totalfields; $i++) {
				$temp_not_excl_fld = mysql_field_name($result0, $i);
				if (!in_array($temp_not_excl_fld, $excludefields)) {
					$fields_to_include[] = $temp_not_excl_fld;
	//print "include:".$temp_not_excl_fld."<br />\n";
				} // end if
			} // end for
	
			$fields_to_include_count = count($fields_to_include);
			$fields_to_include = array_diff($fields_to_include, $fields_to_ignore);
	
			for ($i = 0; $i < $fields_to_include_count; $i++) {
	//print "FTI:$i".$fields_to_include[$i]."<br />\n";
				if ($fields_to_include[$i] != "") {
					$stringkey = $row_auto['stringkey'];
					if (!get_magic_quotes_gpc()) {
						$stringkey2 = addslashes($stringkey);
					} // end if
					else {
						$stringkey2 = $stringkey;
					} // end else
					$auto_fld_stringkey[] = $row_auto['stringkey'];
					$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$fields_to_include[$i].")";
					if ($row_auto['placement'] == "-1") {
						$auto_fld_placement[] = $totalfields;
					} // end if
					else {
						$auto_fld_placement[] = $row_auto['placement'];
					} // end else
					$auto_fld_lang_code[] = $row_auto['lang_code'];
					$auto_fld_reference[] = $fields_to_include[$i]; // Was $row_auto['field_reference'];
					$auto_fld_reference2[] = $row_auto['field_reference2'];
					$auto_fld_reference3[] = $row_auto['field_reference3'];
					$auto_fld_funct_call[] = $row_auto['funct_call'];
	//print "3".$row_auto['placement'].":".$strings["$stringkey2"]." (".$strings['from']." ".$fields_to_include[$i].")"."<br />\n";
					$auto_fld_param1[] = $row_auto['param1'];
					$auto_fld_param2[] = $row_auto['param2'];
				} // end if
			} // end for
		
		} // end elseif
		else { // There is a language category, and it is not the default
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
				if (!get_magic_quotes_gpc()) {
					$stringkey2 = addslashes($stringkey);
				} // end if
				else {
					$stringkey2 = $stringkey;
				} // end else
				$auto_fld_stringkey[] = $row_auto['stringkey'];
				$auto_fld_string[] = $strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")"; // Added second part
				if ($row_auto['placement'] == "-1") {
					$auto_fld_placement[] = $totalfields;
				} // end if
				else {
					$auto_fld_placement[] = $row_auto['placement'];
				} // end else
	
				$auto_fld_lang_code[] = $row_auto['lang_code'];
				$auto_fld_reference[] = $row['fieldkey']; // Was $row_auto['field_reference'];
				$auto_fld_reference2[] = $row_auto['field_reference2'];
				$auto_fld_reference3[] = $row_auto['field_reference3'];
				$auto_fld_funct_call[] = $row_auto['funct_call'];
	//print "4".$row_auto['placement'].":".$strings["$stringkey2"]." (".$strings['from']." ".$row['fieldkey'].")"."<br />\n";
				$auto_fld_param1[] = $row_auto['param1'];
				$auto_fld_param2[] = $row_auto['param2'];
			} // end while
		} // end else
	} // end while


	$field_and_option_no = mysql_num_fields($result0);
	$semidynamic_variable = array ('option', 0, $field_and_option_no, 0);
	require($req_dir.'semidynamic_variable.php');
	$semidynamic_variable = array ('field', 0, $field_and_option_no, 0);
	require($req_dir.'semidynamic_variable.php');



	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));

//	if ($noscrolling) {
		// Fix: Get rid of hardcodeddb here and everywhere?

	$ncount = count($auto_fld_placement);
	$mcount = $field_and_option_no;
	$colpercent_counter = 0;
	$ticker = 0;
	$cssuser = "";
	for ($m = 0; $m < $mcount + 1; $m++) {

		for ($n = 0; $n < $ncount; $n++) {
			$optiona = "option".$m."_".$n;
			$$optiona = $_GET[$optiona];
			$fielda = "field".$m."_".$n;
			$$fielda = $_GET[$fielda];
			$cssflda = "cssfld".$m."_".$n;
			$$cssflda = $_GET[$cssflda];
			$searchflda = "searchfld".$m."_".$n;
			$$searchflda = $_GET[$searchflda];
			$interflda = "interfld".$m."_".$n;
			$$interflda = $_GET[$interflda];

			if ($$fielda != "") {
				$ticker++;
				$auto_keys = array_keys($auto_fld_placement, $m);
				$akq = $auto_keys[$n];
				$correl_akq[$ticker] = $akq;
				$auto_fld_str = $auto_fld_string[$akq];
				$correl_flds_sk[$ticker] = $auto_fld_stringkey[$akq];
				$correl_flds[$ticker] = $auto_fld_str;
				$correl_auto[$ticker] = '1'; // It is an auto field
			} // end if
			
			if ($$cssflda != 'CSS' && $$cssflda !='') {
				$$cssflda1 = strip_tags($$cssflda);
				$$cssflda1 = trim($$cssflda1);
				$$cssflda1 = trim($$cssflda1, '{}');
				$$cssflda1 = str_replace(array('http', 'expression', 'url', 'import'), '', $$cssflda1);
				$cssuser .= "\n\t\t\t\t.".$fielda." {".$$cssflda1."}";
			} // end if
				
			// Fix: Change (search terms) to $strings['searchterms']
			if ($$searchflda != "(search terms)" && $$searchflda !="") {
				$$searchflda = strip_tags($$searchflda);
				$$searchflda = trim($$searchflda);
			} // end if
			else { // Simplifies ignoring empty search fields
				$$searchflda = "";
			} // end else

			if ($$interflda != "n1, n2, ..." && $$interflda !="") {
				$$interflda = strip_tags($$interflda);
				$$interflda = trim($$interflda);
				$patt = "@([0-9]+)(,\s*([0-9]+))*?@";
				preg_match_all($patt, $$interflda, $matches);
				${$interflda} = $matches[0]; // Parses all numbers
			} // end if
			else { // Simplifies ignoring empty inter fields
				$$interflda = "";
			} // end else
		
			if ($$optiona == "yes") {
				$colpercent_counter++;
			} // end if (if field was opted for)
		} // end for
		
		if ($m != $mcount) {
		
			$optiona = "option".$m;
			$$optiona = $_GET[$optiona];
			$fielda = "field".$m;
			$$fielda = $_GET[$fielda];
			$cssflda = "cssfld".$m;
			$$cssflda = $_GET[$cssflda];
			$searchflda = "searchfld".$m;
			$$searchflda = $_GET[$searchflda];
			$interflda = "interfld".$m;
			$$interflda = $_GET[$interflda];
			if ($$fielda != "") {
				$ticker++;
				$fieldkey = mysql_field_name($result0, $$fielda);
				localize_fields($fieldkey, $fieldface);
				$correl_flds[$ticker] = $fieldalias;
				$correl_auto[$ticker] = "0";
			} // end if
			
			if ($$cssflda != "CSS" && $$cssflda !="") {
				$$cssflda1 = strip_tags($$cssflda);
				$$cssflda1 = trim($$cssflda1);
				$$cssflda1 = trim($$cssflda1, "{}");
				$cssuser .= "\n\t\t\t\t.".$fielda." {".$$cssflda1."}";
			} // end if
			// Fix: Change (search terms) to $strings['searchterms']
			if ($$searchflda != "(search terms)" && $$searchflda !="") {
				$$searchflda = strip_tags($$searchflda);
				$$searchflda = trim($$searchflda);
			} // end if
			else { // Simplifies ignoring empty search fields
				$$searchflda = "";
			} // end else

			if ($$interflda != "n1, n2, ..." && $$interflda !="") {
				$$interflda = strip_tags($$interflda);
				$$interflda = trim($$interflda);
				$patt = "@([0-9]+)(,\s*([0-9]+))*?@";
				preg_match_all($patt, $$interflda, $matches);
				${$interflda} = $matches[0]; // Parses all numbers
			} // end if
			else { // Simplifies ignoring empty inter fields
				$$interflda = "";
			} // end else
	
			if ($$optiona == "yes") {
				$colpercent_counter++;
			} // end if (if field was opted for)
		} // end if
	} // end for
	

	$tbody = $cssuser;

	if (!$noscrolling) {
						
		$colpercenttemp = 100/$colpercent_counter;
		$colpercent = "width: ".$colpercenttemp."%;";
		
		$toppercent = 30;
		
		// The following tries to compensate for larger font sizes
		if ((strpos($fontsize, "%")) != FALSE) {
			$toppercent *= $fontsize;
			$toppercent /= 100;
		} // end if
		
		
		$heightpercent = 96 - $toppercent; // Was 100 - $toppercent;
		
		$toppercent .= "%";
		$heightpercent .= "%";
	
		
		$tbody .= <<<HERE

				table.results, caption.results {
					background-color: white;
				}

				table.results {
					width: 100%;
					vertical-align: top;
					border-style: $border;
					border-width: 1px;
					border-collapse: collapse;
				}

				thead.results {
					display: table-header-group;
				}

				#top {
					width: 98%;
					float:left;
				}
				#top, #bottom, #right {
					background-repeat: repeat-y;
					background-attachment: fixed;
					background-color: white;
					background-image: url(http://bahai-library.com/graphics/bg_graystripes2.gif);
				  height: 97%;
				  max-height: 200%;
				}
				#right {
					background-attachment: fixed;
					background-repeat: repeat;
					height: 97%;
					max-height: 97%;
					float:left;
					width: 15px;
				}

				tbody.results {
				  top: $toppercent;
				  overflow:scroll;
				  position: absolute;
				  width: 90.8%; // was 98%;
				  height: $heightpercent; // 66% was good
				  max-height: $heightpercent;
				}

				td.cell {
					padding: 5px;
				}
				th.header {
					padding: 7px 4px;
				}

				td.cell, th.header {
					vertical-align: top;
					border-style: $border;
					border-width: 1px;

					$colpercent
HERE;

		$tbody .= <<<HERE
\n				}

HERE;
	} // end if (if the browser supports CSS for scrolling tables)

// Fix: Insert	td {vertical-align: top;} within the above td {} to make the button not mesh (probably is just to exclude width and border from being set)...Can remove this as an option to allow a fixed header at top which can still be visible with the appropriately squished together main body text, though not well aligned.


	else {
	
		$tbody .= <<<HERE

				table.results, caption.results {
					background-color: white;
				}

				thead.results {
					display: table-header-group;
				}

				table.results, tr.row, tr.row0, td.cell, th.cell {
					vertical-align: top;
					border-style: $border;
					border-width: 1px;
				}
HERE;
	} // end else (if the browser is old and doesn't support the CSS for a scrolling body)

	//////////////// Set styles according to user selections
	if ($headings == "y") {
		$headingstyles = "td, th, caption";
	} // end if (if the user opts for headings with styles, add th for headings to the CSS style declaration
	else { // ($headings == "n" || $headings == "0" || etc.etc. )
		$headingstyles = "td";
	} // end else (if the user does not want headings with styles (or headings at all)
	//removed following (from within HEREDOC and within $headingstyles) as aren't supported in browsers; did letter-spacing instead
	// font-stretch: $fontstretch;



// The following immediate variables could be changed in the future if the user opted for the display to instead show paragraphs (or Basic XHTML for mobile phone users), etc.

	$outputmode = $_GET['outputmode'];
	$outputtypes = array('pspan', 'li', 'span', 'p');

	$outputtypecount = count($outputtypes);

	if ($outputmode == "pspan") {

		// Required for headings
		$smarty->assign('tr1open', "<p");
		$smarty->assign('tr1close', "p");
		$smarty->assign('thopen', "<span");
		$smarty->assign('thclose', "span");
		// Optional
		$smarty->assign('tr1divider', "");
		$smarty->assign('thdivider', "---");
	
		// Required for body
		$tr2open = "p";
		$tr2close = "p";
		$tdopen = "span";
		$tdclose = "span";
		// Optional
		$tr2divider = "";
		$tddivider = "---";
		

	} // end if ()

	elseif ($outputmode == "li") {

		mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));
		$result0 = mysql_query("SELECT * FROM `".mysql_real_escape_string($file)."`");
		$colpercent_counter = 0;
		$ncount = count($auto_fld_placement);
		$mcount = mysql_num_fields($result0);

		for ($m = 0; $m < $mcount; $m++) {
			$optiona = "option".$m;
			if ($$optiona == "yes") {
				$colpercent_counter++;
			} // end if (if field was opted for)
			for ($n = 0; $n < $ncount; $n++) {
				$optiona = "option".$m."_".$n;
				if ($$optiona == "yes") {
					$colpercent_counter++;
				} // end if (if field was opted for)
			} // end for
		} // end for
		$colpercenttemp = 100/$colpercent_counter;
		$colpercent = "width: ".$colpercenttemp."%;";

		// Required for headings
		$tr1open = "<ul";
		$tr1close = "ul";
		$smarty->assign('thopen', "<li");
		$smarty->assign('thclose', "li");
		// Optional
		$smarty->assign('tr1divider', "");
		$smarty->assign('thdivider', "---");
	
		// Required for body
		$tr2open = "ul";
		$tr2close = "ul";
		$tdopen = "li";
		$tdclose = "li";
		// Optional
		$tr2divider = "";
		$tddivider = "---";
		

	} // end elseif

	elseif ($outputmode == "span") {

		// Required for headings
		$tr1open = "<span";
		$tr1close = "span";
		$smarty->assign('thopen', "<span");
		$smarty->assign('thclose', "span");
		// Optional
		$smarty->assign('tr1divider', "");
		$smarty->assign('thdivider', "---");
	
		// Required for body
		$tr2open = "span";
		$tr2close = "span";
		$tdopen = "span";
		$tdclose = "span";
		// Optional
		$tr2divider = "";
		$tddivider = "---";
		
		
	} // end elseif ()

	elseif ($outputmode == "p") {

		// Required for headings
		$smarty->assign('tr1open', "<div");
		$smarty->assign('tr1close', "div");
		$smarty->assign('thopen', "<p");
		$smarty->assign('thclose', "p");
	
		// Required for body
		$tr2open = "div";
		$tr2close = "div";
		$tdopen = "p";
		$tdclose = "p";

	} // end elseif ()

	else {
		// Could be optional (see also tableopen below)

//	The following are presently only for table, and as such, are being added statically to the template:

		$tableclose = "</table>";
		$theadopen = "<thead id='maintablehead'>";
		$theadclose = "</thead>";

/*
		if ($_GET['trnsps']=="1") { 
			$theadopen = "<td style='font-weight: bold;' id='maintablehead'>";
			$theadclose = "</td>";
		} // end if
		else {
			$theadopen = "<thead id='maintablehead'>";
			$theadclose = "</thead>";
		} // end else
*/
		$tbodyopen = "<tbody id='maintablebody'>";
		$tbodyclose = "</tbody>";

	
		// Required for headings
	
		$smarty->assign('tr1open', "<tr");
		$smarty->assign('tr1close', "tr");
		$smarty->assign('thopen', "<th");
		$smarty->assign('thclose', "th");
	
		// Required for body
		$tr2open = "tr";
		$tr2close = "tr";
		$tdopen = "td";
		$tdclose = "td";
	} // end else (default)


	$nocaption = $_GET['nocaption'];

	if (!strstr($_SERVER['HTTP_USER_AGENT'], "Firefox")) {
		$notffox_display = "display: inline-block;";
	} // end 
	else {
		$notffox_display = "";
	} // end else

	$style = <<<HERE
    <style type="text/css">
	/*<![CDATA[*/
				{$headingstyles}.cell {
					font-style: $fontstyle;
					font-variant: $fontvariant;
					font-weight: $fontweight;
					font-size: $fontsize;
					font-family: $font;
					background-color: $bgcolor !important;

					letter-spacing: $letterspacing;
					line-height: $lineheight;
					color: $color;
				}

				p.row, p.row0 {
					width: 100%;
				}

				li.cell, li.header {
					$colpercent
					min-width: 100px;
					display: -moz-inline-box;
					$notffox_display
					vertical-align: top;
				}

$tbody

				tfoot.results { 
					display: table-footer-group; 
				}
	/*]]>*/</style>
HERE;
// */

	$smarty->addRawHeader($style);

	// Fix: Was testing different possibilities that were supposed to help with thead/tfoot showing up on each page (was really looking for the browser to do this (a XUL "tree" might do the trick if we could get XULRunner or whatever going to use these elements) since frames do not allow tables in headers to align perfectly with the tables in text. I have added it anyways since it may be helpful (necessary in MSIE as I recall, though it should be the default) when printing copies. Other code below relates to this as well.
	
	
	///////// Structural get globals /////////
	
	$toggle = $_GET['toggle'];

	
	/////////// Explicitly declare dynamic get globals ///////////
	// The following are mostly in the order they appear in browse.php (these dynamically generated ones have been moved to here out of the sequence of static ones (see above))
	// They are done dynamically for convenience, but they are only semidynamic in order to declare variable names the script basically expects (I presume this may overcome the globals security issue, yet still allow the power of not having to predeclare globals (when the script could have any number depending on the database in question))
	//New Book Add: Change last parameter below if necessary
	// Fix: If the fields are ever allowed to be indefinitely large, the third parameter (length) should be dynamically generated--by another call to the database, using the "file" variable and a repeated if-then list here (or SQL list) to determine how many options (and thus variables) could be submitted
	
	$semidynamic_variable = array ('blevela', 1, 3, 0); // 3 is the length since the value starts at one and may cycle two times (no. 3 will not be run); if this is ever made indefinite, one could also use "field_and_option_no" since it is the maximum # of fields (yet not ridiculously large to small things down too much)
	require($req_dir.'semidynamic_variable.php');
	
	$semidynamic_variable = array ('elevela', 1, 3, 0);
	require($req_dir.'semidynamic_variable.php');
	
	$semidynamic_variable = array ('blevelb', 1, 3, 0);
	require($req_dir.'semidynamic_variable.php');
	
	$semidynamic_variable = array ('elevelb', 1, 3, 0);
	require($req_dir.'semidynamic_variable.php');
	
	$semidynamic_variable = array ('blevelc', 1, 3, 0);
	require($req_dir.'semidynamic_variable.php');
	
	$semidynamic_variable = array ('elevelc', 1, 3, 0);
	require($req_dir.'semidynamic_variable.php');



} // end if (if the file is not blank (set all of the rest of the GET variables)


// Add header preparation
require_once ($req_dir.'headerpreptoadd.php');


get_table($file); // added 11/01/06

///////// Table-specific data

$fields_name1 = $brws_field_A[0];



if ($fields_name1 == "") {
		mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));
		$querya1 = "SELECT * FROM `".mysql_real_escape_string($file)."`";
		$resulta1 = mysql_query($querya1);
		$fields_name1 = mysql_field_name($resulta1, 0);
		$skipheadingquery = 1;
}

$fields_name2 = $brws_field_B[0];
$fields_name3 = $brws_field_C[0];
/*
$fields_name7 = $browse_field_1;
$fields_name8 = $browse_field_2;
$fields_name9 = $browse_field_3;
*/


/////////// Only if all of the first set of verse selection items is blank (but not the 2nd) will the 2nd be used (i.e., its fields will be copied to the a1/b1/c1 variables which are used in this script)--e.g., Rodwell's ordering instead of the Traditional
/// Fix: This should be expanded into a loop if browse.php allows for indefinite verse selection options (As stated in the comments there, this is not urgent.)

$fullinput = $_GET['fullinput'];
$fullinput = trim($fullinput);

if ($_GET['rnd'] == "1") {

	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));

	if ($toggle != "") {
		$toggling = "WHERE `$fieldtoggle` = '".mysql_real_escape_string($toggle)."'";
		$toggling2 = "AND `$fieldtoggle` = '".mysql_real_escape_string($toggle)."'";
	} // end if

	$rndmaxquery1 = "SELECT max(`".mysql_real_escape_string($fields_name1)."`) FROM `".mysql_real_escape_string($file)."` $toggling";
	$rndmax1 = mysql_query($rndmaxquery1); // Finds the highest value for the lowest level field (e.g., for verse)
	$rndmax1 = mysql_fetch_row($rndmax1);
	$rndmax1 = $rndmax1[0]; // If there are duplicates of the max, just choose one
	$rndmin1 = mysql_query("SELECT min(`".mysql_real_escape_string($fields_name1)."`) FROM `".mysql_real_escape_string($file)."` $toggling"); // Finds the highest value for the lowest level field (e.g., for verse)
	$rndmin1 = mysql_fetch_row($rndmin1);
	$rndmin1 = $rndmin1[0]; // If there are duplicates of the min, just choose one

	$blevela1 = rand($rndmin1, $rndmax1);
	if ($fields_name2 == "") {
//		$elevela1 = rand($blevela1, $rndmax1); // Uncomment this and comment the next line to allow random ranges
		$elevela1 = $blevela1;
		$blevelb1 = "";
		$blevelc1 = "";
		$elevelb1 = "";
		$elevelc1 = "";
	} // end if
	else {
		$elevela1 = $blevela1;
		
		$rndmax2 = mysql_query("SELECT max(`".mysql_real_escape_string($fields_name2)."`) FROM `".mysql_real_escape_string($file)."` WHERE `".mysql_real_escape_string($fields_name1)."` >= '".mysql_real_escape_string($blevela1)."' AND `".mysql_real_escape_string($fields_name1)."` <= '".mysql_real_escape_string($elevela1)."' $toggling2"); // Finds the highest value for the lowest level field (e.g., for verse)
		$rndmax2 = mysql_fetch_row($rndmax2);
		$rndmax2 = $rndmax2[0]; // If there are duplicates of the max, just choose one
		$rndmin2 = mysql_query("SELECT min(`".mysql_real_escape_string($fields_name2)."`) FROM `".mysql_real_escape_string($file)."` WHERE `".mysql_real_escape_string($fields_name1)."` >= '".mysql_real_escape_string($blevela1)."' AND `".mysql_real_escape_string($fields_name1)."` <= '".mysql_real_escape_string($elevela1)."' $toggling2"); // Finds the highest value for the lowest level field (e.g., for verse)
		$rndmin2 = mysql_fetch_row($rndmin2);
		$rndmin2 = $rndmin2[0]; // If there are duplicates of the min, just choose one

		$blevelb1 = rand($rndmin2, $rndmax2);
		if ($fields_name3 == "") {
//			$elevelb1 = rand($blevelb1, $rndmax2); // Uncomment this and comment the next line to allow random ranges
			$elevelb1 = $blevelb1;

			$blevelc1 = "";
			$elevelc1 = "";
		} // end if
		else {
			$elevelb1 = $blevelb1;
			
			$rndmax3 = mysql_query("SELECT max(`".mysql_real_escape_string($fields_name3)."`) FROM `".mysql_real_escape_string($file)."` WHERE `".mysql_real_escape_string($fields_name1)."` >= '".mysql_real_escape_string($blevela1)."' AND `".mysql_real_escape_string($fields_name1)."` <= '".mysql_real_escape_string($elevela1)."' AND `".mysql_real_escape_string($fields_name2)."` >= '".mysql_real_escape_string($blevelb1)."' AND `".mysql_real_escape_string($fields_name2)."` <= '".mysql_real_escape_string($elevelb1)."' $toggling2"); // Finds the highest value for the lowest level field (e.g., for verse)
			$rndmax3 = mysql_fetch_row($rndmax3);
			$rndmax3 = $rndmax3[0]; // If there are duplicates of the max, just choose one
			$rndmin3 = mysql_query("SELECT min(`".mysql_real_escape_string($fields_name3)."`) FROM `".mysql_real_escape_string($file)."` WHERE `".mysql_real_escape_string($fields_name1)."` >= '".mysql_real_escape_string($blevela1)."' AND `".mysql_real_escape_string($fields_name1)."` <= '".mysql_real_escape_string($elevela1)."' AND `".mysql_real_escape_string($fields_name2)."` >= '".mysql_real_escape_string($blevelb1)."' AND `".mysql_real_escape_string($fields_name2)."` <= '".mysql_real_escape_string($elevelb1)."' $toggling2"); // Finds the highest value for the lowest level field (e.g., for verse)
			$rndmin3 = mysql_fetch_row($rndmin3);
			$rndmin3 = $rndmin3[0]; // If there are duplicates of the min, just choose one

			$blevelc1 = rand($rndmin3, $rndmax3);

			if ($fields_name4 == "") {
			
//				$elevelc1 = rand($blevelc1, $rndmax3); // Uncomment this and comment the next line to allow random ranges
				$elevelc1 = $blevelc1;

				$bleveld1 = ""; // Not needed
				$eleveld1 = ""; // Not needed
			} // end if
			else { // Not needed
				$elevelc1 = $blevelc1;
				// Would need extra code here for level d (or better, make this process recursive)
			} // end else
		} // end else
	} // end else
} // end if

elseif ($fullinput !="") { // If not random, and fullinput field not empty, assumes is fullinput
	$pattern = "@^([0-9]+?)(:[0-9]+?){0,1}(:[0-9]+?){0,1}(\s*-\s*([0-9]+?)(:[0-9]+?){0,1}(:[0-9]+?){0,1}){0,1}$@";
	if (preg_match($pattern, $fullinput)) {

		$blevela1 = preg_replace($pattern, "\\1", $fullinput);
		$blevelb1 = trim(preg_replace($pattern, "\\2", $fullinput), ':');
		$blevelc1 = trim(preg_replace($pattern, "\\3", $fullinput), ':');
		$elevela1 = preg_replace($pattern, "\\5", $fullinput);
		$elevelb1 = trim(preg_replace($pattern, "\\6", $fullinput), ':');
		$elevelc1 = trim(preg_replace($pattern, "\\7", $fullinput), ':');
//		print "number"."<br />\n";
	} // end if
	else {
//		print "not in number format"."<br />\n";

//Works:		$pattern = "@^((([1-3]\s*){0,1})([a-zA-Z]+?))((\s*[0-9]+?)(:[0-9]+?){0,1}){0,1}(\s*-\s*((([1-3]\s*){0,1})([a-zA-Z]+?)){0,1}((\s*[0-9]+?)(:[0-9]+?){0,1}){0,1}){0,1}$@";

		$fullinput = preg_replace("@^the\s+@i", "", $fullinput);
		$fullinput = preg_replace("@^a\s+@i", "", $fullinput);
		$fullinput = preg_replace("@^an\s+@i", "", $fullinput);
		$fullinput = preg_replace("@([a-zA-Z])\s+([a-zA-Z])@", "\\1\\2", $fullinput);

		$pattern = "@^((([1-3]\s*){0,1})([a-zA-Z]+?)\.{0,1})((\s*[0-9]+?)(:[0-9]+?){0,1}){0,1}(\s*-\s*((([1-3]\s*){0,1})([a-zA-Z]+?)\.{0,1}){0,1}((\s*[0-9]+?)(:[0-9]+?){0,1}){0,1}){0,1}$@";
		if (preg_match($pattern, $fullinput)) {

			// Added for the Qur'an
//print $fullinput;
			$blevela1 = str_replace(array(".", " "), "", strtolower(preg_replace($pattern, "\\1", $fullinput)));
			$blevelb1 = str_replace(" ", "", trim(preg_replace($pattern, "\\6", $fullinput), ':'));
			$blevelc1 = str_replace(" ", "", trim(preg_replace($pattern, "\\7", $fullinput), ':'));
			$elevela1 = str_replace(array(".", " "), "", strtolower(preg_replace($pattern, "\\9", $fullinput)));
			$elevelb1 = str_replace(" ", "", trim(preg_replace($pattern, "\${14}", $fullinput), ':'));
			$elevelc1 = str_replace(" ", "", trim(preg_replace($pattern, "\${15}", $fullinput), ':'));

			mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
			$query_abbrev = "SELECT * FROM ".mysql_real_escape_string($file)."_data ";
			$result_abbrev = mysql_query($query_abbrev);
			$abbrev_num_flds = mysql_num_fields($result_abbrev);
			$alias_array = array();
			while ($row = mysql_fetch_array($result_abbrev)) {
				for ($i=1; $i < $abbrev_num_flds; $i++) {
					$alias = "alias".$i."_".$langu;
					$abbrev = "abbrev".$i."_".$langu;
					$key1 = str_replace(" ", "", preg_replace("@^an{0,1} @", "", preg_replace("@^the @", "", strtolower(@$row[$alias]))));
					$key2 = str_replace(" ", "", preg_replace("@^an{0,1} @", "", preg_replace("@^the @", "", strtolower(@$row[$abbrev]))));
					$alias_array[$key1] = $row['number'];
					$alias_array[$key2] = $row['number'];
				} // end for
			} // end while

			if ($elevela1 == "") {
				$elevela1 = $blevela1;
			} // end if

			$blevela1 = $alias_array[$blevela1];
			$elevela1 = $alias_array[$elevela1];
	//		print "Text"."<br />\n";
		} // end if

		else {
	//		print "not in text format"."<br />\n";
		} // end else
	} // end else

} // end elseif

// else {
	if ($blevela1 == "" && $elevela1 == "" && $blevelb1 == "" && $elevelb1 == "" && $blevelc1 == "" && $elevelc1 == "" && $blevela2 == "" && $elevela2 == "" && $blevelb2 == "" && $elevelb2 == "" && $blevelc2 == "" && $elevelc2 == "") {
	} // end if (if all verse selection fields are blank)
	
	elseif ($blevela1 == "" && $elevela1 == "" && $blevelb1 == "" && $elevelb1 == "" && $blevelc1 == "" && $elevelc1 == "") {
/*
		$fields_name1 = $fields_name7;
		$fields_name2 = $fields_name8;
		$fields_name3 = $fields_name9;
*/
		for ($i=1; $i < count($brws_field_A); $i++) {
			$fields_name1 = $brws_field_A[$i];
			$fields_name2 = $brws_field_B[$i];
			$fields_name3 = $brws_field_C[$i];
			$j = $i+1;
			$blevela1 = $blevela{$j};
			$elevela1 = $elevela{$j};
			$blevelb1 = $blevelb{$j};
			$elevelb1 = $elevelb{$j};
			$blevelc1 = $blevelc{$j};
			$elevelc1 = $elevelc{$j};
			if ($fields_name1 != '') break;
		} // end for
	} // end elseif (if the first set of verse browsing options is blank)
// } // end else

/*
print "blevela1 ".$blevela1."<br />\n";
print "elevela1 ".$elevela1."<br />\n";
print "blevelb1 ".$blevelb1."<br />\n";
print "elevelb1 ".$elevelb1."<br />\n";
print "blevelc1 ".$blevelc1."<br />\n";
print "elevelc1 ".$elevelc1."<br />\n";
*/


localize_fields($fields_name1, $fieldface);
$lclzd_fields_name1 = $$fieldface;
localize_fields($fields_name2, $fieldface);
$lclzd_fields_name2 = $$fieldface;
localize_fields($fields_name3, $fieldface);
$lclzd_fields_name3 = $$fieldface;

$toggleyes = "";
if ($toggle !== NULL && $toggle !== "") {
	$toggleyes = " (".$toggle.")";
} // end if

if ($blevelb1 !== NULL && $blevelb1 !== "") {
	$fieldnamegroup2 = "/".$lclzd_fields_name2;
	$blevelbgroup = ":".$blevelb1;
	$elevelbgroup = ":".$elevelb1;
} // end if

if ($blevelc1 !== NULL && $blevelc1 !== "") {
	$fieldnamegroup3 = "/".$lclzd_fields_name3;
	$blevelcgroup = ":".$blevelc1;
	$elevelcgroup = ":".$elevelc1;
} // end if
// $strings["tableheading"][$file]
$captiontitle = "\"".$heading."\"".$toggleyes.": ".htmlspecialchars($lclzd_fields_name1.$fieldnamegroup2.$fieldnamegroup3, ENT_QUOTES, "UTF-8")." ".htmlspecialchars($blevela1.$blevelbgroup.$blevelcgroup, ENT_QUOTES, "UTF-8")." ".strtolower($strings['to'])." ".htmlspecialchars($elevela1.$elevelbgroup.$elevelcgroup, ENT_QUOTES, "UTF-8");


// $captiontitle = "\"".$strings["tableheading"][$file]."\"".$toggleyes.": ".htmlspecialchars($fields_name1." ".$blevela1." ".$fields_name2." ".$blevelb1." ".$fields_name3." ".$blevelc1." ".strtolower($strings['to'])." ".$fields_name1." ".$elevela1." ".$fields_name2." ".$elevelb1." ".$fields_name3." ".$elevelc1, ENT_QUOTES, "UTF-8");

$title = $strings['browserfile'].' '.$strings['results_for'].' '.$captiontitle;

require($req_dir.'headerassigns.php');

// Uncomment this (and comment the following line) when SQL contents are all XML compliant: e.g., links (may need regexp to replace)

require ($req_dir.'br9table.php');

?>