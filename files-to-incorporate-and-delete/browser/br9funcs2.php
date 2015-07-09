<?php

/////////////// Define functions ///////////////////
// Note to self: Functions in PHP 4 and 5 do not need to be defined at the beginning. However, I am declaring all.
///////////////// 

// Note the functions below include alphabetic dummy placeholders since the calling function may vary in length and not all values will be used for each function; remember to list all fields, even if your user function doesn't use them all (and use this alphabetic convention for consistency and readability)
// Idea: Use "static" keyword in functions be build cumulative results for automated fields (e.g., word counts which were added up (and displayed) in successive cells)
@include('userfunctions.php');

function alias_fielding($a="", $b="", $c="", $d="", $e="", $f="", $g="", $h="", $j="", $k="", $l="", $m="", $n="", $o="", $p="", $alias_field_txt="", $lang="", $q="", $disablealias="") {

	global $file;
	global $localedb, $host, $dbuser, $passw;
	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
	$query = "SELECT alias1_".mysql_real_escape_string($lang).", alias2_".mysql_real_escape_string($lang)." FROM `".mysql_real_escape_string($file)."_data` WHERE number = '".mysql_real_escape_string($alias_field_txt)."'";
// print $query;
	$result = mysql_query($query);
	if (mysql_num_rows($result)) {
		while ($row = mysql_fetch_array($result)) {
			$alias1 = "alias1_".$lang;
			$alias2 = "alias2_".$lang;
			$alias1 = $row["$alias1"];
			$alias2 = $row["$alias2"];
//		print $alias1.":".$alias2."<br />\n";
		} // end while
		if ($alias2 != "" && $disablealias == "") {
			$alias1 = $alias1." (".$alias2.")";
		} // end if
	} // end if

	return $alias1;
} // end function alias_fielding

function wikilinks($number="", $number2="", $number3="", $a="", $b="", $num_field="", $num_field2="", $num_field3="", $id="", $heading, $brws_fld_A_txt="", $brws_fld_B_txt="", $brws_fld_C_txt="", $fieldtoggletxt="", $c="", $alias_field_txt="", $lang="") {

	if ($alias_field_txt != "") {
		$aliased_field = alias_fielding("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", $alias_field_txt, $lang, "", 1);
		if ($aliased_field != "") {
			$brws_fld_A_txt = $aliased_field;
		} // end if
	} // end if

	// Set up delimiters to ensure each cell is unique
	if ($fieldtoggletxt != "") {
		$fieldtoggletxt = "_".$fieldtoggletxt;
		if ($brws_fld_A_txt != "") {
			$brws_fld_A_txt = "-".$brws_fld_A_txt;
		} // end if
	} // end if
	elseif ($brws_fld_A_txt != "") {
		$brws_fld_A_txt = "_".$brws_fld_A_txt;
	} // end if

	if ($brws_fld_B_txt != "") {
		$brws_fld_B_txt = "-".$brws_fld_B_txt;
	} // end if
	if ($brws_fld_C_txt != "") {
		$brws_fld_C_txt = "-".$brws_fld_C_txt;
	} // end if

	$heading = str_replace(" ", "_", $heading);
	$urlencoded = urlencode($heading.$fieldtoggletxt.$brws_fld_A_txt.$brws_fld_B_txt.$brws_fld_C_txt);

	$redbluelink = "http://bahai9.com/index.php?title={$urlencoded}&action=brett2";
	$backforw_ifr = file_get_contents($redbluelink);
	
 	return $backforw_ifr;

} // end function wikilinks

function wikify($number="", $number2="", $number3="", $a="", $b="", $num_field="", $num_field2="", $num_field3="", $id="", $heading, $brws_fld_A_txt="", $brws_fld_B_txt="", $brws_fld_C_txt="", $fieldtoggletxt="", $c="", $alias_field_txt="", $lang="") {

/*
		$filename = "ifr/".$id."ifr.html";
//	if (is_writable($filename)) {

		if (!$handle = fopen($filename, 'w')) {
			echo "Cannot open file ($filename)";
			exit;
		}

		// Write $googlified to our opened file.
		if (fwrite($handle, $googlified) === FALSE) {
			echo "Cannot write to file ($filename)";
			exit;
		}
//		echo "Success, wrote ($googlified) to file ($filename)";
		fclose($handle);
*/

// commented the above before

/*
	} 
	else {
		echo "The file $filename is not writable";
	} // end else
*/

	if ($alias_field_txt != "") {
		$aliased_field = alias_fielding("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", $alias_field_txt, $lang, "", 1);
		if ($aliased_field != "") {
			$brws_fld_A_txt = $aliased_field;
		} // end if
	} // end if

	// Set up delimiters to ensure each cell is unique
	if ($fieldtoggletxt != "") {
		$fieldtoggletxt = "_".$fieldtoggletxt;
		if ($brws_fld_A_txt != "") {
			$brws_fld_A_txt = "-".$brws_fld_A_txt;
		}
	} // end if
	elseif ($brws_fld_A_txt != "") {
		$brws_fld_A_txt = "_".$brws_fld_A_txt;
	} // end if

	if ($brws_fld_B_txt != "") {
		$brws_fld_B_txt = "-".$brws_fld_B_txt;
	} // end if
	if ($brws_fld_C_txt != "") {
		$brws_fld_C_txt = "-".$brws_fld_C_txt;
	} // end if
	$heading = str_replace(" ", "_", $heading);
	

// See also headeradd.php
	if (strstr($_SERVER['HTTP_USER_AGENT'], "Firefox") && $_GET['ff'] !="1") {
		$id2 = $id;
	} // end if
	else { // Needs to be different from name in Safari at least
//		$id2 = $id."id";
		$id2 = $id;
	} // end else
		
	$heading = str_replace(" ", "_", $heading);
	$urlencoded = urlencode($heading.$fieldtoggletxt.$brws_fld_A_txt.$brws_fld_B_txt.$brws_fld_C_txt);
		
	$backforw_ifr .= <<<HERE
<a href="javascript:void(0)" onclick="backbutton('{$id}');" id="{$id}back" target="{$id}" style="display:none">&lt;--</a><div id="{$id}backtext" style="display:inline">&lt;--</div> &nbsp; 
<a href="javascript:void(0)" onclick="forwardbutton('{$id}');" id="{$id}forward" target="{$id}" style="display:none">--&gt;</a><div id="{$id}forwardtext" style="display:inline">--&gt;</div> &nbsp; <a href="javascript:void(0)" onclick="urlbackadd('{$id}')">URL</a>  &nbsp; <a href="javascript:void(0)" onclick="var locat = eval('window.frames.{$id}.document.location');
var reglocat = new RegExp('&amp;', 'g');locat = locat.toString();locat = locat.replace(reglocat, '&amp;amp;');document.getElementById('{$id}snap').style.display='inline';document.getElementById('{$id}snaptext').style.display='none';document.getElementById('{$id}s').innerHTML=locat;">Mark</a> &nbsp; <a id="{$id}snap" href="javascript:void(0)" onclick="var abcde=document.getElementById('{$id}s').innerHTML;document.getElementById('{$id2}').setAttribute('src', abcde);document.getElementById('{$id}snap').style.display='none';document.getElementById('{$id}snaptext').style.display='inline';" style="display:none">Snap-back</a><div id="{$id}snaptext" style="display:inline">Snap-back</div> &nbsp; <a href="javascript:void(0)" id="{$id}backhist" target="BackHistory{$id}" onclick="openRequestedPopup('', this.target, '{$id}', 1); return false;" title="This link will create a new window or will re-use an already opened one" style="display:none">Back History</a><div id="{$id}backhisttext" style="display:inline">Back History</div> &nbsp; <a href="javascript:void(0)" id="{$id}forwremaining" target="ForwRemaining{$id}" onclick="openRequestedPopup('', this.target, '{$id}', 0); return false;" title="This link will create a new window or will re-use an already opened one" style="display:none">Forward Remaining</a><div id="{$id}forwremainingtext" style="display:inline">Forward Remaining</div> &nbsp; <a id="href{$id}" href="javascript:void(0)" target="new{$id}">Open frame</a><!--Could have the preceding link immediately set by all the various functions rather than iframe onload -->	
<br />
<iframe height="*" width="*" onload="var locat = eval('window.frames.{$id}.document.location');var locat2 = locat.toString();var fphp = /^http:\/\/(www\.){0,1}bahai9\.com\/f\.php\?f=/;locat2 = locat2.replace(fphp, '');var fphpb = /&amp;action=brett/;locat2 = locat2.replace(fphpb, '');var reglocat = new RegExp('&amp;', 'g');locat2 = locat2.replace(reglocat, '&amp;amp;');locat2=decodeURIComponent(locat2);document.getElementById('href{$id}').setAttribute('href', locat2);fixlinks('{$id}');" name="{$id}" id="{$id2}" src="index.php?title={$urlencoded}&amp;action=brett"></iframe>
<textarea id="{$id}b" rows="10" style="display:none;"></textarea>
<textarea id="{$id}f" rows="10" style="display:none;"></textarea>
<textarea id="{$id}s" rows="10" style="display:none;"></textarea>
HERE;
// f.php?f= also doesn't fix the back/forward for Safari
// src="$filename"	
//	$backforw_ifr = $_SERVER['SERVER_ADDR']; // Just used this to find the server's IP address to permit it to access bahai9.com since offline
//	$wikitext = file_get_contents('http://www.bahai9.com/index.php/?title=HiddenWordArabic'.$number.'&action=brett');
// return $wikitext;

	return $backforw_ifr;

} // end function wikify

function googlify($input, $a="", $b="", $param1="", $d="", $e="", $f="", $g="", $id="", $heading, $h="", $j="", $k="", $l="", $function_field_txt="", $m="", $n="", $o="") {

	$function_field_txt = strip_tags($function_field_txt);
	$punct = array(',', '.', '!', '?', '*', '(', ')');
	$function_field_txt = str_replace($punct, "", $function_field_txt);
	$function_field_txt = trim($function_field_txt);
	$function_field_txt = preg_replace("/\s{2,}/", " ", $function_field_txt);

	$input_array = explode (" ", $function_field_txt);

	$countinput = count($input_array);
	$filename = "ifr/".$id."ifr.html";
	
// commented below before

	$googlified = <<<HERE
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head>
<title>iframe</title></head>
<body>
HERE;
	for ($i=0; $i < $countinput; $i++) {
		$input_ready = urlencode(htmlentities($input_array[$i]));
// Couldn't get following (giving Adsense credit) to work inside of own proxy (needed for accessing external files to make them backable/forwardable within iframes)
//		$googlified .= "<a href='http://www.google.com/custom?domains=bahai-library.com&q=".$param1.$input_ready."&sitesearch=&sa=Search&client=pub-9515729973633640&forid=1&ie=UTF-8&oe=UTF-8&safe=active&cof=GALT%3A%23008000%3BGL%3A1%3BDIV%3A%23336699%3BVLC%3A663399%3B%0D%0AAH%3Acenter%3BBGC%3AFFFFFF%3BLBGC%3A336699%3BALC%3A0000FF%3BLC%3A0000FF%3BT%3A000000%3BGFNT%3A0000FF%3BGIMP%3A%0D%0A0000FF%3BFORID%3A1%3B&hl=en'>".$input_array[$i]."</a> ";
		$googlified .= "<a href='http://www.google.com/search?q=".$param1.$input_ready."&amp;start=0&amp;ie=utf-8&amp;oe=utf-8&amp;client=firefox-a&amp;rls=org.mozilla:en-US:official'>".$input_array[$i]."</a> ";
		
	} // end for
	$googlified .= "</body>
</html>";
	
	
	
//	if (is_writable($filename)) {

		if (!$handle = fopen($filename, 'w')) {
			echo "Cannot open file ($filename)";
			exit;
		}

		// Write $googlified to our opened file.
		if (fwrite($handle, $googlified) === FALSE) {
			echo "Cannot write to file ($filename)";
			exit;
		}
//		echo "Success, wrote ($googlified) to file ($filename)";
		fclose($handle);

// commented the above before

/*
	} 
	else {
		echo "The file $filename is not writable";
	} // end else
*/

// See also headeradd.php
	if (strstr($_SERVER['HTTP_USER_AGENT'], "Firefox") && $_GET['ff'] !="1") {
		$id2 = $id;
	} // end if
	else { // Needs to be different from name in Safari at least
//		$id2 = $id."id";
		$id2 = $id;
	} // end else
	
	$backforw_ifr = <<<HERE
<a href="javascript:void(0)" onclick="backbutton('{$id}');" id="{$id}back" target="{$id}" style="display:none">&lt;--</a><div id="{$id}backtext" style="display:inline">&lt;--</div> &nbsp; 
<a href="javascript:void(0)" onclick="forwardbutton('{$id}');" id="{$id}forward" target="{$id}" style="display:none">--&gt;</a><div id="{$id}forwardtext" style="display:inline">--&gt;</div> &nbsp; <a href="javascript:void(0)" onclick="urlbackadd('{$id}')">URL</a>  &nbsp; 

<a href="javascript:void(0)" onclick="var locat = eval('window.frames.{$id}.document.location');
var reglocat = new RegExp('&amp;', 'g');locat = locat.toString();locat = locat.replace(reglocat, '&amp;amp;');document.getElementById('{$id}snap').style.display='inline';document.getElementById('{$id}snaptext').style.display='none';document.getElementById('{$id}s').innerHTML=locat;">Mark</a> &nbsp; <a id="{$id}snap" href="javascript:void(0)" onclick="var abcde=document.getElementById('{$id}s').innerHTML;document.getElementById('{$id2}').setAttribute('src', abcde);document.getElementById('{$id}snap').style.display='none';document.getElementById('{$id}snaptext').style.display='inline';" style="display:none">Snap-back</a><div id="{$id}snaptext" style="display:inline">Snap-back</div> &nbsp; <a href="javascript:void(0)" id="{$id}backhist" target="BackHistory{$id}" onclick="openRequestedPopup('', this.target, '{$id}', 1); return false;" title="This link will create a new window or will re-use an already opened one" style="display:none">Back History</a><div id="{$id}backhisttext" style="display:inline">Back History</div> &nbsp; <a href="javascript:void(0)" id="{$id}forwremaining" target="ForwRemaining{$id}" onclick="openRequestedPopup('', this.target, '{$id}', 0); return false;" title="This link will create a new window or will re-use an already opened one" style="display:none">Forward Remaining</a><div id="{$id}forwremainingtext" style="display:inline">Forward Remaining</div> &nbsp; <a id="href{$id}" href="javascript:void(0)" target="new{$id}">Open frame</a><!--Could have the preceding link immediately set by all the various functions rather than iframe onload -->
<br /><!-- 600 and 480 before-->
<iframe height="*" width="*" onload="var locat = eval('window.frames.{$id}.document.location');var locat2 = locat.toString();var fphp = /^http:\/\/(www\.){0,1}bahai9\.com\/f\.php\?f=/;locat2 = locat2.replace(fphp, '');var reglocat = new RegExp('&amp;', 'g');locat2 = locat2.replace(reglocat, '&amp;amp;');locat2=decodeURIComponent(locat2);document.getElementById('href{$id}').setAttribute('href', locat2);fixlinks('{$id}');" name="{$id}" id="{$id2}" src="$filename"></iframe>
<textarea id="{$id}b" rows="10" style="display:none;"></textarea>
<textarea id="{$id}f" rows="10" style="display:none;"></textarea>
<textarea id="{$id}s" rows="10" style="display:none;"></textarea>
HERE;
	
	return utf8_encode($backforw_ifr);
} // end function

function wordbyword($rawtext, $a="", $b="", $type, $target, $field="", $c="", $d="", $id="", $heading, $e="", $f="") {
	$_GET['input'] = $rawtext;
	$_GET['type'] = $type;
	$_GET['target'] = $target;

	$_GET['outputonly'] = "1"; // Used in Farsi.php file to indicate we don't want the surrounding XHTML
	
	include('farsi.php'); // returns $outputnow
	$autocellcontent = $outputnow;
	return $autocellcontent;
} // end function


// This function is called by the range_type function following (This could conceivably be included inside of range_type since I have read that user-defined functions are supposed to slow things down and should be omitted if they are not necessary--However, it does help with clarity, I think-- B.Z.)

function make_table ($result) {
	global $file, $orig_lang_code_field, $lang_direction, $default_lang_direction, $defaultlanguage;
	global $browse_field_A, $browse_field_B, $browse_field_C, $fieldtoggle;
	global $browse_field_1, $browse_field_2, $browse_field_3;
	global $toggle;
	global $function_field, $alias_field;
	global $trns;
	global $langu;
	$fieldface = "fieldalias";
	global $escapehtml;
	global $auto_fld_placement, $auto_fld_string, $auto_fld_lang_code, $auto_fld_reference, $auto_fld_reference2, $auto_fld_reference3;
	global $auto_fld_funct_call, $auto_fld_param1, $auto_fld_param2;
	global $countautofldplcmnt;
	global $hardcodeddb, $host, $dbuser, $passw;
	global $heading;
	
	global $tableheadarray, $count_tbl_hd_arr;
	

	get_language($defaultlanguage, 1); // Used for language direction below--could cause conflict if need default language for the given interface language (as opposed to the default of the whole site, and by assumption, of the contents)
	get_table($file); // Used to see whether escapehtml should be turned on (and used for $function_field -- could also do get_field to make something like $function_field to use information pertaining to a given field)
	
	while ($row = mysql_fetch_array($result)) { // get all the records based on the selection statement determined in the range_type function

		$brws_fld_A_txt= $row[$browse_field_A];
		$brws_fld_B_txt= $row[$browse_field_B];
		$brws_fld_C_txt= $row[$browse_field_C];

/*
// Not used now (see below) // Also should reconcile with same equivalent variables above
		$anchorA= $row[$browse_field_A];
		$anchorB= $row[$browse_field_B];
		$anchorC= $row[$browse_field_C];

		$anchorNoDefault = $row[mysql_field_name($result, 0)];
		$anchor1= $row[$browse_field_1];
		$anchor2= $row[$browse_field_2];
		$anchor3= $row[$browse_field_3];
*/


		$trns++; // Used for the cell id (row marker)
		// Deal with the toggle (fix it also elsewhere in this script so it is in SQL)

		$tablearray[$trns][] = $trns;

		$for_counter = 0;
		$cycleflds = mysql_num_fields($result);
		for ($k = 0; $k < $cycleflds+1; $k++) { // Go through all the fields


			if ($countautofldplcmnt) {
				$auto_keys = array_keys($auto_fld_placement, $k);
				$auto_keys_count = count($auto_keys);

				if (is_array($auto_keys)) {

					for ($q = 0; $q < $auto_keys_count; $q++) {
						$optionauto = "option".$k."_".$q;
						global $$optionauto;
						$fieldauto = "field".$k."_".$q;
						global $$fieldauto;

						$interflda = "interfld".$k."_".$q;
						global ${$interflda};
						global $correl_flds, $correl_flds_sk, $correl_auto, $correl_akq;
					
						$n = strtok($$fieldauto, "_"); // Get the placement (before the "-")
						$o = ltrim(strstr($$fieldauto, "_"),"_"); // Get the placement sequence after the "-"

						$auto_keys = array_keys($auto_fld_placement, $n);
						$akq = $auto_keys[$o];
					
						$auto_fld_str = $auto_fld_string[$akq];
						$fieldautoclass = str_replace('"', "'", $auto_fld_str);
						$fieldautoclass = htmlentities($fieldautoclass);


						if ($$optionauto == "yes" && (strpos($$fieldauto, "_", 1))) { // Hyphen will at least be after first number

							$functioncall = $auto_fld_funct_call[$akq];

							$fieldref = $auto_fld_reference[$akq];
							$fieldref2 = $auto_fld_reference2[$akq];
							$fieldref3 = $auto_fld_reference3[$akq];

							$param1 = $auto_fld_param1[$akq];
							$param2 = $auto_fld_param2[$akq];
							
							$textcontents = $row[$fieldref];
							$textcontents2 = $row[$fieldref2];
							$textcontents3 = $row[$fieldref3];

							$fieldtoggletxt = $row[$fieldtoggle];
							
							$function_field_txt = $row[$function_field];

/* // Can't add this (used for default when not specified in table_data) because it needs to stay blank for fields without any external alias tables
							if ($alias_field == "") {
								$alias_field = $browse_field_A;
							} // end if
*/
							$alias_field_txt = $row[$alias_field];
							
							$id = "id".$k."cyc".$q."field".$trns;


							$af_lang_code = $auto_fld_lang_code[$akq];

							if ($af_lang_code == "") {
								$auto_xmllang = $langu;
							} // end if
							else {
								$auto_xmllang = $af_lang_code;
							} // end else

							get_language($auto_xmllang);
							$textdirecauto = $lang_direction;

							
							$autocellcontent = $functioncall($textcontents, $textcontents2, $textcontents3, $param1, $param2, $fieldref, $fieldref2, $fieldref3, $id, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $fieldtoggletxt, $function_field_txt, $alias_field_txt, $auto_xmllang, $lang_direction, "");

//							if ($functioncall != "alias_fielding" && $alias_field != "") {

								array_push($tablearray[$trns], "cell", $id, $fieldautoclass, $fieldauto, $auto_xmllang, $textdirecauto);

								if ($_GET['trnsps']=="1") {
									$interlindivider = "<br />"; // Should be table inside table
								} // end if
								else {
									$interlindivider = "<br />";
								} // end else
								$td_interlin = "";
								$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";
								for ($c=0; $c < $interlinarrcount; $c++) {
									$correltemp = ${$interflda}[$c];
									$correltemp2 = $correl_flds[$correltemp];

									if (!$correl_auto[$correltemp]) {

										if ($correltemp2 != "" && $row[$correltemp2] != NULL && $row[$correltemp2] != "<br />") {
											$odd++;
											if ($odd % 2) {
												$colorspan = "color:red;";
											} // end if
											else {
												$colorspan = "color:blue;";
											} // end else
											if ($_GET['interlintitl'] != "y") {
												$correltemp3 = "";
											} // end if
											else {
												$correltemp3 = $correltemp2.": ";
											} // end else
											$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$row[$correltemp2]."</span>";
										} // end if
									} // end if
									else {
										$a_akq = $correl_akq[$correltemp];
										$a_functioncall = $auto_fld_funct_call[$a_akq];
										$a_fieldref = $auto_fld_reference[$a_akq];
										$a_fieldref2 = $auto_fld_reference2[$a_akq];
										$a_fieldref3 = $auto_fld_reference3[$a_akq];
										$a_param1 = $auto_fld_param1[$a_akq];
										$a_param2 = $auto_fld_param2[$a_akq];
										$a_textcontents = $row[$a_fieldref];
										$a_textcontents2 = $row[$a_fieldref2];
										$a_textcontents3 = $row[$a_fieldref3];
										$a_fieldtoggletxt = $row[$fieldtoggle];
										$a_function_field_txt = $row[$function_field];
										$a_alias_field_txt = $row[$alias_field];
										$a_id = "id".$k."cyc".$q."field".$trns;
										$a_af_lang_code = $auto_fld_lang_code[$a_akq];
										if ($a_af_lang_code == "") {
											$a_auto_xmllang = $langu;
										} // end if
										else {
											$a_auto_xmllang = $a_af_lang_code;
										} // end else
										get_language($a_auto_xmllang);
										$a_textdirecauto = $lang_direction;
										$a_autocellcontent = $a_functioncall($a_textcontents, $a_textcontents2, $a_textcontents3, $a_param1, $a_param2, $a_fieldref, $a_fieldref2, $a_fieldref3, $a_id, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $a_fieldtoggletxt, $a_function_field_txt, $a_alias_field_txt, $a_auto_xmllang, $lang_direction, "");
										if ($correltemp2 != "") {
											$odd++;
											if ($odd % 2) {
												$colorspan = "color:red;";
											} // end if
											else {
												$colorspan = "color:blue;";
											} // end else
											if ($_GET['interlintitl'] != "y") {
												$correltemp3 = "";
											} // end if
											else {
												$correltemp3 = $correltemp2.": ";
											} // end else
											$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$a_autocellcontent."</span>";
										} // end if
									} // end else
								} // end for
								$odd = 0;
								
								if (!$escapehtml) {
									array_push($tablearray[$trns], 0, $autocellcontent, $td_interlin);
								} // end if
								else {
									array_push($tablearray[$trns], 0, htmlspecialchars($autocellcontent, ENT_QUOTES, "UTF-8"), $td_interlin);
								} // end else
//							} // end if
							
/*
							if ($_GET['upd']=="y") {
								$escfile = mysql_real_escape_string($file);
								$escauto_fld_str = str_replace("`", "\`", $auto_fld_str);
								$escautocellcontent = mysql_real_escape_string($autocellcontent);
								// $escautocellcontent = htmlentities($escautocellcontent);
								$rowuniqueid = $row['unique_id'];
								mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));
								$query5 = "UPDATE `$escfile` SET `$escauto_fld_str`='$escautocellcontent' WHERE `unique_id`='$rowuniqueid'";
								print $query5;
								$result5 = mysql_query($query5);
							} // end if
*/

						} // if the user opted to print the automated field
					
						elseif ($$optionauto == "yes") {


							$for_counter++;
//							$field = "field".$k;
//							global $$field; // dynamically declare the field variables
							// print the cells
							// add xml:lang, lang, anchors, id, class


							$fieldkey = mysql_field_name($result, $$fieldauto);

							get_field($fieldkey, $file); // Gets $orig_lang_code_field, $lang_direction, etc.
							$fieldkeyclass = str_replace('"', "'", $fieldkey);
							$fieldkeyclass = str_replace(' ', "_", $fieldkeyclass);
							$fieldkeyclass = htmlentities($fieldkeyclass);
							
							array_push($tablearray[$trns], "cellfield", $k."_".$trns, $fieldkeyclass, $fieldauto, $orig_lang_code_field);

							if ($lang_direction != "") {
							
								$tablearray[$trns][] = $lang_direction; // This will be obtained from the latest get_language call (which was called above by get_field)
							} // end if (if there is a language direction for the given field)
							else {

								$tablearray[$trns][] = $default_lang_direction; // This will be the default of the whole site (not the user's interface choice) because the latest get_language default call was called above with the default language of the whole site
							} // end else (if there is no language direction for the field, use the default)

		
		/*
		// The following large section was used to add anchors which were fixed according to the database contents (including by optional browsing setting) rather than the current display options. This caused problems for XHTML validation (such as is required in Firefox) when the cells were not unique (or had incompatible values for an id) and were thus added as non-unique ids. It is also not necessary in XHTML1.1-compatible browsers since the cells already have their own ids. This could work in XHTML1.0 and less-compatible browsers if the id references below are removed (or if added to an array, non-unique items could be auto-distinguished such as by an additional sequenced number added).
		
							if ($for_counter==1) {
								if ($anchorC != "") {
									$anchor = $toggle.$anchorA."-".$anchorB."-".$anchorC;
								} // end if (if there is a third place for the anchor)
								elseif ($anchorB != "") {
									$anchor = $toggle.$anchorA."-".$anchorB;
								} // end elseif (if there is a second place for the anchor)
								elseif ($anchorA != "") {
									$anchor = $toggle.$anchorA;
								} // end else (if there is only a third place for the anchor)
								else {
									$anchor = $toggle.$anchorNoDefault;
								}
								print "<a name='".$anchor."' id='c".$anchor."'></a>";
			
								if ($anchor1 !="") {
									if ($anchor3 != "") {
										$anchoroption = $toggle."optionB-".$anchor1."-".$anchor2."-".$anchor3;
									} // end if (if there is a third place for the anchor)
									elseif ($anchor2 != "") {
										$anchoroption = $toggle."optionB-".$anchor1."-".$anchor2;
									} // end elseif (if there is a second place for the anchor)
									else {
										$anchoroption = $toggle."optionB-".$anchor1;
									} // end else (if there is only a third place for the anchor)
		
									print "<a name='".$anchoroption."' id='c".$anchoroption."'></a>";
		
								} // end if (if there are additional browsing options and anchors should be set for them)
							} // end if (if it is the first cell (to add cell-independent anchors to it))
		
							// Print cell-specific anchors
							if ($anchorC != "") {
								$anchorcell = "cell".($k+1)."-".$toggle.$anchorA."-".$anchorB."-".$anchorC;
							} // end if (if there is a third place for the anchor)
							elseif ($anchorB != "") {
								$anchorcell = "cell".($k+1)."-".$toggle.$anchorA."-".$anchorB;
							} // end elseif (if there is a second place for the anchor)
							elseif ($anchorA != "") {
								$anchorcell = "cell".($k+1)."-".$toggle.$anchorA;
							} // end else (if there is only a third place for the anchor)
							else {
								$anchorcell = "cell".($k+1)."-".$toggle.$anchorNoDefault;
							}
							print "<a name='".$anchorcell."' id='".$anchorcell."'></a>";
		
							if ($anchor1 !="") {
								if ($anchor3 != "") {
									$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1."-".$anchor2."-".$anchor3;
								} // end if (if there is a third place for the anchor)
								elseif ($anchor2 != "") {
									$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1."-".$anchor2;
								} // end elseif (if there is a second place for the anchor)
								else {
									$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1;
								} // end else (if there is only a third place for the anchor)
							print "<a name='".$anchorcelloption."' id='".$anchorcelloption."'></a>";
							} // end if (if there are additional browsing options and anchors should be set for them)
		*/
		
		// Collins: Replaced < and > in Record ID's. Best to have the following on by default (testing for compliance--one can use the convert.php script as a base to fix any problems), but best if don't need, so that processing will be faster (as I recall, this UTF-8 mode did not display everything correctly as UTF-8...)
		
							if ($_GET['trnsps']=="1") {
								$interlindivider = "<br />"; // Should be table inside table
							} // end if
							else {
								$interlindivider = "<br />";
							} // end else
							$td_interlin = "";
							$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";
							for ($c=0; $c < $interlinarrcount; $c++) {
								$correltemp = ${$interflda}[$c];
								$correltemp2 = $correl_flds[$correltemp];

								if (!$correl_auto[$correltemp]) {
									if ($correltemp2 != "" && $row[$correltemp2] != NULL && $row[$correltemp2] != "<br />") {
										$odd++;
										if ($odd % 2) {
											$colorspan = "color:red;";
										} // end if
										else {
											$colorspan = "color:blue;";
										} // end else
										if ($_GET['interlintitl'] != "y") {
											$correltemp3 = "";
										} // end if
										else {
											$correltemp3 = $correltemp2.": ";
										} // end else
										$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$row[$correltemp2]."</span>";
									} // end if
								} // end if
								else {
									$a_akq = $correl_akq[$correltemp];
									$a_functioncall = $auto_fld_funct_call[$a_akq];
									$a_fieldref = $auto_fld_reference[$a_akq];
									$a_fieldref2 = $auto_fld_reference2[$a_akq];
									$a_fieldref3 = $auto_fld_reference3[$a_akq];
									$a_param1 = $auto_fld_param1[$a_akq];
									$a_param2 = $auto_fld_param2[$a_akq];
									$a_textcontents = $row[$a_fieldref];
									$a_textcontents2 = $row[$a_fieldref2];
									$a_textcontents3 = $row[$a_fieldref3];
									$a_fieldtoggletxt = $row[$fieldtoggle];
									$a_function_field_txt = $row[$function_field];
									$a_alias_field_txt = $row[$alias_field];
									$a_id = "id".$k."cyc".$q."field".$trns;
									$a_af_lang_code = $auto_fld_lang_code[$a_akq];
									if ($a_af_lang_code == "") {
										$a_auto_xmllang = $langu;
									} // end if
									else {
										$a_auto_xmllang = $a_af_lang_code;
									} // end else
									get_language($a_auto_xmllang);
									$a_textdirecauto = $lang_direction;
									$a_autocellcontent = $a_functioncall($a_textcontents, $a_textcontents2, $a_textcontents3, $a_param1, $a_param2, $a_fieldref, $a_fieldref2, $a_fieldref3, $a_id, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $a_fieldtoggletxt, $a_function_field_txt, $a_alias_field_txt, $a_auto_xmllang, $lang_direction, "");
									if ($correltemp2 != "") {
										$odd++;
										if ($odd % 2) {
											$colorspan = "color:red;";
										} // end if
										else {
											$colorspan = "color:blue;";
										} // end else
										if ($_GET['interlintitl'] != "y") {
											$correltemp3 = "";
										} // end if
										else {
											$correltemp3 = $correltemp2.": ";
										} // end else
										$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$a_autocellcontent."</span>";
									} // end if
								} // end else
							} // end for
							$odd = 0;
	
							if ($fieldkey=="ISBN") {
								$pattern = '/([0-9]{10,13})/'; // Find the ISBN number
								$replace = '<a href="http://www.amazon.com/exec/obidos/redirect?link_code=ur2&amp;tag=brettsblog-20&amp;camp=1789&amp;creative=9325&amp;path=external-search%3Fsearch-type=ss%26index=blended%26keyword=${1}">${1}</a><img src="http://www.assoc-amazon.com/e/ir?t=brettsblog-20&amp;amp;l=ur2&amp;amp;o=1" alt="isbn" style="border:none !important; border-style: none !important; margin:0px !important; width: 1px !important; height: 1px !important;" />'; // ${1} are the back replacements
								$rowentry0 = preg_replace("/-/", "", $row[$$fieldauto]); // Need to replace the hyphens so that they do not appear in the URL, as Amazon doesn't handle them
								$rowentry = preg_replace($pattern, $replace, $rowentry0);

								array_push($tablearray[$trns], "isbn", $rowentry, $td_interlin);

							} // end if
							elseif ($fieldkey=="Location/URL") {
								$pattern = '/(http:\/\/([^.])+\.(\S|[^\n]){2,4}?([^\s])*)/';
								$replace = '<a href="${1}">${1}</a>';
								$rowentry = preg_replace($pattern, $replace, $row[$$fieldauto]);
								array_push($tablearray[$trns], "url", $rowentry, $td_interlin);														
							} // end elseif
							elseif (!$escapehtml) {
								array_push($tablearray[$trns], 0, $row[$$fieldauto], $td_interlin);					
							} // end elseif
							else {
								array_push($tablearray[$trns], 0, htmlspecialchars($row[$$fieldauto], ENT_QUOTES, "UTF-8"), $td_interlin);										} // end else
					
						} // end elseif (if it is a field to be printed, but not the default auto one)

					} // end for (go through possibly multiple auto fields at a given level)

				} // if there is a possible automated field header to print

			} // end if

			if ($k < $cycleflds) {

				$option = "option".$k;
				global $$option;

				$field = "field".$k;
				global $$field; // dynamically declare the field variables

				$interflda = "interfld".$k;
				global ${$interflda};
				global $correl_flds, $correl_flds_sk, $correl_auto, $correl_akq;
				

				if ($$option == "yes" && (strpos($$field, "_", 1))) {
					$for_counter++;

					$n = strtok($$field, "_"); // Get the placement (before the "_")
					$o = ltrim(strstr($$field, "_"),"_"); // Get the placement sequence after the "-"

					$auto_keys = array_keys($auto_fld_placement, $n);
					$akq = $auto_keys[$o];


					$auto_fld_str = $auto_fld_string[$akq];
					$fieldautoclass = str_replace('"', "'", $auto_fld_str);
					$fieldautoclass = htmlentities($fieldautoclass);

					$functioncall = $auto_fld_funct_call[$akq];

					$fieldref = $auto_fld_reference[$akq];
					$fieldref2 = $auto_fld_reference2[$akq];
					$fieldref3 = $auto_fld_reference3[$akq];

					$textcontents = $row[$fieldref];
					$textcontents2 = $row[$fieldref2];
					$textcontents3 = $row[$fieldref3];
					
					$param1 = $auto_fld_param1[$akq];
					$param2 = $auto_fld_param2[$akq];

					$fieldtoggletxt = $row[$fieldtoggle];
					$function_field_txt = $row[$function_field];
					$alias_field_txt = $row[$alias_field];

					$af_lang_code = $auto_fld_lang_code[$akq];



					if ($af_lang_code == "") {
						$auto_xmllang = $langu;
					} // end if
					else {
						$auto_xmllang = $af_lang_code;
					} // end else


					get_language($auto_xmllang);
					$textdirecauto = $lang_direction;


					$id2 = "id".$k."field".$trns;
					$autocellcontent = $functioncall($textcontents, $textcontents2, $textcontents3, $param1, $param2, $fieldref, $fieldref2, $fieldref3, $id2, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $fieldtoggletxt, $function_field_txt, $alias_field_txt, $auto_xmllang, $lang_direction, "");

					array_push($tablearray[$trns], "cell", $id2, $fieldautoclass, $field, $auto_xmllang, $textdirecauto);


					if ($_GET['trnsps']=="1") {
						$interlindivider = "<br />"; // Should be table inside table
					} // end if
					else {
						$interlindivider = "<br />";
					} // end else
					$td_interlin = "";
					$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";

					for ($c=0; $c < $interlinarrcount; $c++) {
						$correltemp = ${$interflda}[$c];
						$correltemp2 = $correl_flds[$correltemp];

						if (!$correl_auto[$correltemp]) {
							if ($correltemp2 != "" && $row[$correltemp2] != NULL && $row[$correltemp2] != "<br />") {
								$odd++;
								if ($odd % 2) {
									$colorspan = "color:red;";
								} // end if
								else {
									$colorspan = "color:blue;";
								} // end else
								if ($_GET['interlintitl'] != "y") {
									$correltemp3 = "";
								} // end if
								else {
									$correltemp3 = $correltemp2.": ";
								} // end else
								$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$row[$correltemp2]."</span>";
							} // end if
						} // end if
						else {
							$a_akq = $correl_akq[$correltemp];
							$a_functioncall = $auto_fld_funct_call[$a_akq];
							$a_fieldref = $auto_fld_reference[$a_akq];
							$a_fieldref2 = $auto_fld_reference2[$a_akq];
							$a_fieldref3 = $auto_fld_reference3[$a_akq];
							$a_param1 = $auto_fld_param1[$a_akq];
							$a_param2 = $auto_fld_param2[$a_akq];
							$a_textcontents = $row[$a_fieldref];
							$a_textcontents2 = $row[$a_fieldref2];
							$a_textcontents3 = $row[$a_fieldref3];
							$a_fieldtoggletxt = $row[$fieldtoggle];
							$a_function_field_txt = $row[$function_field];
							$a_alias_field_txt = $row[$alias_field];
							$a_id = "id".$k."cyc".$q."field".$trns;
							$a_af_lang_code = $auto_fld_lang_code[$a_akq];
							if ($a_af_lang_code == "") {
								$a_auto_xmllang = $langu;
							} // end if
							else {
								$a_auto_xmllang = $a_af_lang_code;
							} // end else
							get_language($a_auto_xmllang);
							$a_textdirecauto = $lang_direction;
							$a_autocellcontent = $a_functioncall($a_textcontents, $a_textcontents2, $a_textcontents3, $a_param1, $a_param2, $a_fieldref, $a_fieldref2, $a_fieldref3, $a_id, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $a_fieldtoggletxt, $a_function_field_txt, $a_alias_field_txt, $a_auto_xmllang, $lang_direction, "");
							if ($correltemp2 != "") {
								$odd++;
								if ($odd % 2) {
									$colorspan = "color:red;";
								} // end if
								else {
									$colorspan = "color:blue;";
								} // end else
								if ($_GET['interlintitl'] != "y") {
									$correltemp3 = "";
								} // end if
								else {
									$correltemp3 = $correltemp2.": ";
								} // end else
								$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$a_autocellcontent."</span>";
							} // end if
						} // end else
					} // end for
					$odd = 0;
					

					if (!$escapehtml) {
						array_push($tablearray[$trns], 0, $autocellcontent, $td_interlin);
					} // end if
					else {
						array_push($tablearray[$trns], 0, htmlspecialchars($autocellcontent, ENT_QUOTES, "UTF-8"), $td_interlin);
					} // end else
				
				} // end if
				
				elseif ($$option == "yes") { // If the user opted to see that field
					$for_counter++;
					// print the cells
					// add xml:lang, lang, anchors, id, class


					$fieldkey = mysql_field_name($result, $$field);

					get_field($fieldkey, $file); // Gets $orig_lang_code_field, $lang_direction, etc.
					$fieldkeyclass = str_replace('"', "'", $fieldkey);
					$fieldkeyclass = str_replace(' ', "_", $fieldkeyclass);
					$fieldkeyclass = htmlentities($fieldkeyclass);
					
					array_push($tablearray[$trns], "cellfield", $k."_".$trns, $fieldkeyclass, $field, $orig_lang_code_field);


					if ($lang_direction != "") {

						$tablearray[$trns][] = $lang_direction; // This will be obtained from the latest get_language call (which was called above by get_field)
					} // end if (if there is a language direction for the given field)
					else {
						$tablearray[$trns][] = $default_lang_direction; // This will be the default of the whole site (not the user's interface choice) because the latest get_language default call was called above with the default language of the whole site
					} // end else (if there is no language direction for the field, use the default)


/*
// The following large section was used to add anchors which were fixed according to the database contents (including by optional browsing setting) rather than the current display options. This caused problems for XHTML validation (such as is required in Firefox) when the cells were not unique (or had incompatible values for an id) and were thus added as non-unique ids. It is also not necessary in XHTML1.1-compatible browsers since the cells already have their own ids. This could work in XHTML1.0 and less-compatible browsers if the id references below are removed (or if added to an array, non-unique items could be auto-distinguished such as by an additional sequenced number added).

					if ($for_counter==1) {
						if ($anchorC != "") {
							$anchor = $toggle.$anchorA."-".$anchorB."-".$anchorC;
						} // end if (if there is a third place for the anchor)
						elseif ($anchorB != "") {
							$anchor = $toggle.$anchorA."-".$anchorB;
						} // end elseif (if there is a second place for the anchor)
						elseif ($anchorA != "") {
							$anchor = $toggle.$anchorA;
						} // end else (if there is only a third place for the anchor)
						else {
							$anchor = $toggle.$anchorNoDefault;
						}
						print "<a name='".$anchor."' id='c".$anchor."'></a>";
	
						if ($anchor1 !="") {
							if ($anchor3 != "") {
								$anchoroption = $toggle."optionB-".$anchor1."-".$anchor2."-".$anchor3;
							} // end if (if there is a third place for the anchor)
							elseif ($anchor2 != "") {
								$anchoroption = $toggle."optionB-".$anchor1."-".$anchor2;
							} // end elseif (if there is a second place for the anchor)
							else {
								$anchoroption = $toggle."optionB-".$anchor1;
							} // end else (if there is only a third place for the anchor)

							print "<a name='".$anchoroption."' id='c".$anchoroption."'></a>";

						} // end if (if there are additional browsing options and anchors should be set for them)
					} // end if (if it is the first cell (to add cell-independent anchors to it))

					// Print cell-specific anchors
					if ($anchorC != "") {
						$anchorcell = "cell".($k+1)."-".$toggle.$anchorA."-".$anchorB."-".$anchorC;
					} // end if (if there is a third place for the anchor)
					elseif ($anchorB != "") {
						$anchorcell = "cell".($k+1)."-".$toggle.$anchorA."-".$anchorB;
					} // end elseif (if there is a second place for the anchor)
					elseif ($anchorA != "") {
						$anchorcell = "cell".($k+1)."-".$toggle.$anchorA;
					} // end else (if there is only a third place for the anchor)
					else {
						$anchorcell = "cell".($k+1)."-".$toggle.$anchorNoDefault;
					}
					print "<a name='".$anchorcell."' id='".$anchorcell."'></a>";

					if ($anchor1 !="") {
						if ($anchor3 != "") {
							$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1."-".$anchor2."-".$anchor3;
						} // end if (if there is a third place for the anchor)
						elseif ($anchor2 != "") {
							$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1."-".$anchor2;
						} // end elseif (if there is a second place for the anchor)
						else {
							$anchorcelloption = "cell".($k+1)."-"."optionB-".$toggle.$anchor1;
						} // end else (if there is only a third place for the anchor)
					print "<a name='".$anchorcelloption."' id='".$anchorcelloption."'></a>";
					} // end if (if there are additional browsing options and anchors should be set for them)
*/

// Collins: Replaced < and > in Record ID's. Best to have the following on by default (testing for compliance--one can use the convert.php script as a base to fix any problems), but best if don't need, so that processing will be faster (as I recall, this UTF-8 mode did not display everything correctly as UTF-8...)


					if ($_GET['trnsps']=="1") {
						$interlindivider = "<br /><br />"; // Should be table inside table
					} // end if
					else {
						$interlindivider = "<br /><br />";
					} // end else
					$td_interlin = "";
					$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";
					for ($c=0; $c < $interlinarrcount; $c++) {
						$correltemp = ${$interflda}[$c];
						$correltemp2 = $correl_flds[$correltemp];

						if (!$correl_auto[$correltemp]) {
							if ($correltemp2 != "" && $row[$correltemp2] != NULL && $row[$correltemp2] != "<br />") {
								$odd++;
								if ($odd % 2) {
									$colorspan = "color:red;";
								} // end if
								else {
									$colorspan = "color:blue;";
								} // end else
								if ($_GET['interlintitl'] != "y") {
									$correltemp3 = "";
								} // end if
								else {
									$correltemp3 = $correltemp2.": ";
								} // end else
								$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$row[$correltemp2]."</span>";
							} // end if
						} // end if
						else {
							$a_akq = $correl_akq[$correltemp];
							$a_functioncall = $auto_fld_funct_call[$a_akq];
							$a_fieldref = $auto_fld_reference[$a_akq];
							$a_fieldref2 = $auto_fld_reference2[$a_akq];
							$a_fieldref3 = $auto_fld_reference3[$a_akq];
							$a_param1 = $auto_fld_param1[$a_akq];
							$a_param2 = $auto_fld_param2[$a_akq];
							$a_textcontents = $row[$a_fieldref];
							$a_textcontents2 = $row[$a_fieldref2];
							$a_textcontents3 = $row[$a_fieldref3];
							$a_fieldtoggletxt = $row[$fieldtoggle];
							$a_function_field_txt = $row[$function_field];
							$a_alias_field_txt = $row[$alias_field];
							$a_id = "id".$k."cyc".$q."field".$trns;
							$a_af_lang_code = $auto_fld_lang_code[$a_akq];
							if ($a_af_lang_code == "") {
								$a_auto_xmllang = $langu;
							} // end if
							else {
								$a_auto_xmllang = $a_af_lang_code;
							} // end else
							get_language($a_auto_xmllang);
							$a_textdirecauto = $lang_direction;
							$a_autocellcontent = $a_functioncall($a_textcontents, $a_textcontents2, $a_textcontents3, $a_param1, $a_param2, $a_fieldref, $a_fieldref2, $a_fieldref3, $a_id, $heading, $brws_fld_A_txt, $brws_fld_B_txt, $brws_fld_C_txt, $a_fieldtoggletxt, $a_function_field_txt, $a_alias_field_txt, $a_auto_xmllang, $lang_direction, "");
							if ($correltemp2 != "") {
								$odd++;
								if ($odd % 2) {
									$colorspan = "color:red;";
								} // end if
								else {
									$colorspan = "color:blue;";
								} // end else
								if ($_GET['interlintitl'] != "y") {
									$correltemp3 = "";
								} // end if
								else {
									$correltemp3 = $correltemp2.": ";
								} // end else
								$td_interlin = $td_interlin.$interlindivider."<span style='".$colorspan."'>".$correltemp3.$a_autocellcontent."</span>";
							} // end if
						} // end else
					} // end for
					$odd = 0;

					if ($fieldkey=="ISBN") {
						$pattern = '/([0-9]{10,13})/'; // Find the ISBN number
						$replace = '<a href="http://www.amazon.com/exec/obidos/redirect?link_code=ur2&amp;tag=brettsblog-20&amp;camp=1789&amp;creative=9325&amp;path=external-search%3Fsearch-type=ss%26index=blended%26keyword=${1}">${1}</a><img src="http://www.assoc-amazon.com/e/ir?t=brettsblog-20&amp;amp;l=ur2&amp;amp;o=1" style="border:none !important; border-style: none !important; margin:0px !important; width: 1px !important; height: 1px !important;" alt="isbn" />'; // ${1} are the back replacements
						$rowentry0 = preg_replace("/-/", "", $row[$$field]); // Need to replace the hyphens so that they do not appear in the URL, as Amazon doesn't handle them
						$rowentry = preg_replace($pattern, $replace, $rowentry0);

						array_push($tablearray[$trns], "isbn", $rowentry, $td_interlin);
					}
					elseif ($fieldkey=="Location/URL") {
						$pattern = '/(http:\/\/([^.])+\.(\S|[^\n]){2,4}?([^\s])*)/';
						$replace = '<a href="${1}">${1}</a>';
						$rowentry = preg_replace($pattern, $replace, $row[$$field]);
						array_push($tablearray[$trns], "url", $rowentry, $td_interlin);
					}
					elseif (!$escapehtml) {
						array_push($tablearray[$trns], 0, $row[$$field], $td_interlin);
					}
					else {
						array_push($tablearray[$trns], 0, htmlspecialchars($row[$$field], ENT_QUOTES, "UTF-8"), $td_interlin);
					}
				} //end elseif (if the user opted to see the given field)
			} // end if (if not the last cycle)
		} //end for to go through all the fields

	} //end while to get all the records

	$counttablearray = count($tablearray[1]); // Since a table, the count should be the same for any subarray; if not this count could be made dynamic between the i and j loop, but is not necessary (and of course would be cumbersome)

	if ($_GET['trnsps']=="1") { // Horizontal
		for ($j = 1; $j < $counttablearray-1; $j++) {
			print $tablearray[1][0]; // Row
			
			if ($headings != "0") {
				$q = $j+1;
				print $tableheadarray[$q];
			} // end if
			for ($i = 1; $i <= $trns; $i++) {
				print $tablearray[$i][$j];
			} // end for
			$counttablearray2 = $counttablearray-1;
			print $tablearray[1][$counttablearray2];
			print $tablearray[1][$counttablearray]; // end row
		} // end for
	} // end if
	else { // Normal vertical
		for ($i = 1; $i <= $trns; $i++) {
			for ($j = 0; $j < $counttablearray; $j++) {
				print $tablearray[$i][$j];
			} // end for
		} // end for
	} // end else

} //end function make_table

function range_type ($ois1, $blevel, $endlevel, $fields_name, $fields_nameB="", $fields_nameC="", $bookvalue="", $chaptervalue="") { // Default values for the last four items are set as null (sometimes not set by the function call)
	global $toggle, $fieldtoggle; // This variable is obtained from get_table (e.g., only get results for the "Original Language"="Persian" Hidden Words)
	global $groupbytoggle;
	global $file;
	// See if the field names are blank or not
	global $langu;

	global $hardcodeddb, $host, $dbuser, $passw;
	mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));


	$blevel = mysql_real_escape_string($blevel);
	$endlevel = mysql_real_escape_string($endlevel);
	$fields_name = mysql_real_escape_string($fields_name);
	$fields_nameB = mysql_real_escape_string($fields_nameB);
	$fields_nameC = mysql_real_escape_string($fields_nameC);
	$bookvalue = mysql_real_escape_string($bookvalue);
	$chaptervalue = mysql_real_escape_string($chaptervalue);
	$file = mysql_real_escape_string($file);


	// Used for finding the maximum of the verse, chapter, or book
	if ($fields_nameC !== "") {$fieldsGeneric_name = $fields_nameC;}
	elseif ($fields_nameB !== "") {$fieldsGeneric_name = $fields_nameB;}
	else {$fieldsGeneric_name = $fields_name;}

	// If the beginning or ending levels are not set, give default values (0 for undefined beginnings, absolute last value for undefined endings)
	if ($blevel == "") {
		$blevel = 0;
	} // end if
	if ($endlevel == "") {
	
		$endlevelmax = mysql_query("SELECT max(`".mysql_real_escape_string($fieldsGeneric_name)."`) FROM `$file`"); // Finds the highest value for the lowest level field (e.g., for verse)
		$endlevelmax2 = mysql_fetch_row($endlevelmax);
		//$endlevelmax2[0] = $endlevelmax2[0] //add back "+ 1;" if it is necessary
		$endlevel = $endlevelmax2[0]; // If there are duplicates of the max, just choose one
	} // end if


///////////////////////////// depending on the number of levels, and the rangetype (which was also based on whether beginnings or endings existed or not), choose a select statement /////////////////////////////
	if ($fields_nameC !== "") {
		if ($ois1=="yes") {
			$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` = $chaptervalue AND `$fields_nameC` >= $blevel AND `$fields_nameC` < $endlevel ORDER BY `$fields_name`, `$fields_nameB`, `$fields_nameC`";
		} // end if
		else {
		$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` = $chaptervalue AND `$fields_nameC` >= $blevel AND `$fields_nameC` <= $endlevel ORDER BY `$fields_name`, `$fields_nameB`, `$fields_nameC`";

		} // end else
	} // end if
	elseif ($fields_nameB !== "") {
		if ($ois1=="yes") {
			$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` >= $blevel AND `$fields_nameB` < $endlevel ORDER BY `$fields_name`, `$fields_nameB`";
		} // end if
		elseif ($ois1=="yes2") {
			$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` > $blevel AND `$fields_nameB` <= $endlevel ORDER BY `$fields_name`, `$fields_nameB`";
		} // end elseif
		elseif ($ois1=="yes3") {
			$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` > $blevel AND `$fields_nameB` < $endlevel ORDER BY `$fields_name`, `$fields_nameB`";
		} // end elseif
		else {
			$query = "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` >= $blevel AND `$fields_nameB` <= $endlevel ORDER BY `$fields_name`, `$fields_nameB`";
		} // end else
	} // end elseif
	else {
		if ($toggle == "" || $fieldtoggle=="") { // See toggle declaration above in this function
			if ($fieldtoggle != "" && ($groupbytoggle)) {
				$toggleorder = "`".$fieldtoggle."`, ";
			} // end if
				
			if ($ois1=="yes") {
				$query = "SELECT * FROM `$file` WHERE `$fields_name` >= $blevel AND `$fields_name` < $endlevel ORDER BY $toggleorder `$fields_name`";	
			} // end if
			elseif ($ois1=="yes2") {
				$query = "SELECT * FROM `$file` WHERE `$fields_name` > $blevel AND `$fields_name` < $endlevel ORDER BY $toggleorder `$fields_name`";	
			} // end elseif
			else {
				$query = "SELECT * FROM `$file` WHERE `$fields_name` >= $blevel AND `$fields_name` <= $endlevel ORDER BY $toggleorder `$fields_name`";
			} // end else
		} // end if
		else {
			if ($ois1=="yes") {
				$query = "SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` >= $blevel AND `$fields_name` < $endlevel ORDER BY `$fields_name`";
			} // end if
			elseif ($ois1=="yes2") {
				$query = "SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` > $blevel AND `$fields_name` < $endlevel ORDER BY `$fields_name`";
			} // end elseif
			else {
				$query = "SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` >= $blevel AND `$fields_name` <= $endlevel ORDER BY `$fields_name`";
			} // end else
		} // end else
	} // end else

//print $query;

	$result = mysql_query($query);


	
make_table ($result);
} // end range_type function

/////////////// End function declarations ///////////////
?>