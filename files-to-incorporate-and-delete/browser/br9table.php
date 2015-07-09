<?php
if( defined( 'HAVEACCESS' ) ) {


if ($outputhtml) {
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style, "html");
} // if default sets html (to avoid errors if SQL data is still in HTML)
else {
	headerAdd($charset, $langu, $title, $headerdirection, $script, $style);
} // set as XHTML

require ('../../smarty.php'); // already defined access with browse9.php

$smarty->assign($strings);
$smarty->assign('textdir', $textdir);

if ($_GET['trnsps'] == 1) {
	$smarty->assign('trnsps', 1);
} // end if
else {
	$smarty->assign('trnsps', 0);
} // end else

$smarty->assign('bc_nv_print', $bc_nv_print);
$smarty->assign('navbar_noscript', $navbar_noscript);



mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));

////////////// Print table and borders according to user selection //////////////

if ($outputmode == "" || $outputmode == NULL || $outputmode == "normal") { 

	$smarty->assign('table_output_flag', 1);

	if (!$nocaption) {
		$smarty->assign('caption_flag', 1);
		$smarty->assign('caption', $captiontitle);
	} // end if (if there is to be no caption)
} // end if (if output mode is for tables/not defined)

/////////////////// If there are to be headings, get ready to print the result (using number 1 for the book, chapter, and verse, etc. (if such fields exist in the database) to speed up (will it????) the query) //////////////
// Fix: Adjust WHERE commands in the future according to search preferences of user; Move this to-do...

$countautofldplcmnt = count($auto_fld_placement);

if ($headings != "0") { // should all !== be turned into != (or vice versa)?

	$smarty->assign('heading_flag', 1);

	if ($fields_name2 !== "" && $fields_name3 !== "" && (!$skipheadingquery)) { 

		$querya1 = "SELECT * FROM `".mysql_real_escape_string($file)."` WHERE `$fields_name1` = 1 AND `$fields_name2` = 1 AND `$fields_name3` = 1";
	} // end if (if the text uses 3 fields for verse browsing--e.g., book/chapter/verse)

	elseif ($fields_name2 !== "") {
		$querya1 = "SELECT * FROM `".mysql_real_escape_string($file)."` WHERE `$fields_name1` = 1 AND `$fields_name2` = 1";
	} // end elseif (if the text uses 2 fields for verse browsing--e.g., chapter/verse)

	else {
		$querya1 = "SELECT * FROM `".mysql_real_escape_string($file)."` WHERE `$fields_name1` = 1";
	} // end else (if the text uses only 1 field for verse browsing--e.g., verse)

	if (!$skipheadingquery) {
		$resulta1 = mysql_query($querya1);
	} // end if (if query does not need to be skipped, since it was set earlier when setting data for undefined table settings

/////////////////////// If the user opted to show a particular field, print the field (according to its number) that was selected by the user for that field. ///////////////////////

	
	$cyclefields = mysql_num_fields($resulta1);
	
	for ($m = 0; $m < $cyclefields+1; $m++) {


		if ($countautofldplcmnt) {
			$auto_keys = array_keys($auto_fld_placement, $m);
			$auto_keys_count2 = count($auto_keys);

			if (is_array($auto_keys)) {
				
				for ($q = 0; $q < $auto_keys_count2; $q++) {

					$optionauto = "option".$m."_".$q;
					$fieldauto = "field".$m."_".$q;

					$n = strtok($$fieldauto, "_"); // Get the placement (before the "_")
					$o = ltrim(strstr($$fieldauto, "_"),"_"); // Get the placement sequence after the "-"

					$auto_keys = array_keys($auto_fld_placement, $n);
					$akq = $auto_keys[$o];


					$auto_fld_str = $auto_fld_string[$akq];
					$fieldautoclass = str_replace('"', "'", $auto_fld_str);
					$fieldautoclass = htmlentities($fieldautoclass);

					$interflda = "interfld".$m."_".$q;
					$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";
					$extrafield = "";

					if ($_GET['interlinhead'] != "n") {
						for ($c=0; $c < $interlinarrcount; $c++) {
							$correltemp = ${$interflda}[$c];
							$correltemp2 = $correl_flds[$correltemp];
							if ($correltemp2 != "") {
								$extrafield .= " / ".$correltemp2;
							} // end if
						} // end for
					} // end if
					
					if ($$optionauto == "yes" && (strpos($$fieldauto, "_", 1))) { // Hyphen will at least be after first number
						$headfieldid[] = $fieldauto;
						$headfieldclass[] = $fieldautoclass;
						$headfieldclass2[] = $fieldauto;
						$headfielddir[] = $textdirec;
						$headfield_txt[] = $auto_fld_str;
						$headfield_extra[] = $extrafield;
						
					} // if the user opted to print the automated field header
					elseif ($$optionauto == "yes") {
						$fieldkey = mysql_field_name($resulta1, $$fieldauto);
						localize_fields($fieldkey, $fieldface);
						$fieldaliasclass = str_replace('"', "'", $fieldalias);
						$fieldaliasclass = htmlentities($fieldaliasclass);
						
						$headfieldid[] = $$fieldauto;
						$headfieldclass[] = $fieldaliasclass;
						$headfieldclass2[] = $fieldauto;
						$headfielddir[] = $textdirec;
						$headfield_txt[] = $fieldalias;
						$headfield_extra[] = $extrafield;
						
					} // end elseif (if it is a field to be printed, but not the default auto one)


				} // end for (go through possibly multiple auto fields at a given level)

			} // if there is a possible automated field header to print
		} // end if


		if ($m < $cyclefields) {

			$fielda = "field".$m;
			$optiona = "option".$m;

			$interflda = "interfld".$m;
			$interlinarrcount = count(${$interflda}); // counting array that has numbers parsed (but not yet correlated to fields)
//print "ct: ".$interlinarrcount."<br />";
			$extrafield = "";
			if ($_GET['interlinhead'] != "n") {
				for ($c=0; $c < $interlinarrcount; $c++) {
					$correltemp = ${$interflda}[$c];
					$correltemp2 = $correl_flds[$correltemp];
					if ($correltemp2 != "") {
						$extrafield .= " / ".$correltemp2;
					} // end if
				} // end for
			} // end if
			
			if ($$optiona == "yes" && (strpos($$fielda, "_", 1))) { // Hyphen will at least be after first number

				$n = strtok($$fielda, "_"); // Get the placement (before the "_")
				$o = ltrim(strstr($$fielda, "_"),"_"); // Get the placement sequence after the "_"

				$auto_keys = array_keys($auto_fld_placement, $n);
				$akq = $auto_keys[$o];

				$auto_fld_str = $auto_fld_string[$akq];
				$fieldautoclass = str_replace('"', "'", $auto_fld_str);
				$fieldautoclass = htmlentities($fieldautoclass);

				$headfieldid[] = $fielda;
				$headfieldclass[] = $fieldautoclass;
				$headfieldclass2[] = $fielda;
				$headfielddir[] = $textdirec;
				$headfield_txt[] = $auto_fld_str;
				$headfield_extra[] = $extrafield;


			} // if the user opted to print the automated field header

			elseif ($$optiona == "yes") {
			
				$fieldkey = mysql_field_name($resulta1, $$fielda);
				localize_fields($fieldkey, $fieldface);

				$fieldaliasclass = str_replace('"', "'", $fieldalias);
				$fieldaliasclass = htmlentities($fieldaliasclass);
				
				$headfieldid[] = $fielda;
				$headfieldclass[] = $fieldaliasclass;
				$headfieldclass2[] = $fielda;
				$headfielddir[] = $textdirec;
				$headfield_txt[] = $fieldalias;
				$headfield_extra[] = $extrafield;
				
			} //end elseif (if the user opted for a particular field)
		} // end if (if this is not the last cycle)
	} //end for (end loop of all the fields)

	// Assign the header arrays to the Smarty template
	$smarty->assign('headfieldid', $headfieldid);
	$smarty->assign('headfieldclass', $headfieldclass);
	$smarty->assign('headfieldclass2', $headfieldclass2);
	$smarty->assign('headfielddir', $headfielddir);
	$smarty->assign('headfield_txt', $headfield_txt);
	$smarty->assign('headfield_extra', $headfield_extra);

} //end if (if the user has not opted to omit headings)


// Fix: table See above on thead/tfoot for the following
// style='tableLayout:fixed'


// Fix: see fix above for details on this.
// style='position: absolute; overflow:scroll;'



//////////////////// Depending on whether certain book/chapter/verse beginnings or endings exist, give the selection a range type to be used below (in combination with a switch) to see which selection type to make ////////////////////

// If the first level verse selection options (e.g., book, though possibly chapter or even verse) are blank, set some (arbitrary) default beginning and ending values for the user...
// The following possibilities are not comprehensive and should be fixed (though not urgent since there is no problem if the user specifies all the information)

if ($blevela1 == "" && $elevela1 == "") {

	if ($fields_name3 != "") {
		$blevela1 = 1;
		$elevela1 = 1;
		$blevelb1 = 0;
		$elevelb1 = 1;
		$rangetype = 5;
	} // end if (if there is a third level field)

	elseif ($fields_name2 != "") {
		$blevela1 = 1;
		$elevela1 = 1;
		$blevelb1 = 0;
		$rangetype = 5;
	} // end elseif (if there is only second level field)

	else {
		$blevela1 = 0;
		$elevela1 = 190;
		$rangetype = 1;
	} // end else (if there is only a first level field)

} // end if (if beginning and ending of the first level are blank)


// If there is something stated for the beginning and/or ending level 1 item (book (or chapter or verse))

else { //nothing hereinafter is totally blank or arbitrary; selected range won't change

	if ($elevela1 == "") { //end-missing; ranges in this if-section won't change
		$elevela1 = $blevela1;
		if ($blevelb1 == "") {
			$rangetype = 1;
		} // end if (if the 2nd level beginning is blank)
		elseif ($blevelc1 == "") {
			$rangetype = 5;
		} // end elseif (if the 3rd level beginning is blank)
		else {
			$rangetype = 9;
		} // end else (if the )
	} // end if (if there is only a beginning value given for the first level item, but not an ending)

// There is definitely an ending value for the first level (and possibly also a beginning level)

	else { //(Not an "end-missing")

		if ($blevela1 == "") { // beginning-missing; ranges in this if-section won't change
			$blevela1 = $elevela1;
			if ($elevelb1 == "") {
				$rangetype = 1;
			} // end if (if the second level endings are blank--but not first level beginning)
			elseif ($elevelc1 == "") {
				$rangetype = 5;
			} // end elseif (if (only) the third level ending is blank--but not first level beginning)
			else {
				$rangetype = 9;
			} //end else (if all endings are present--but not first level beginning)
		} // end if (if beginning first level item is blank (but there is an ending))

		else { //Not a "beginning-missing" (or "end-missing"))

			if ($blevelb1 == "") { // Cases 1-3
				if ($elevelb1 == "") { //Case 1
					$rangetype = 1;
				} // end if (if the second level item ending is blank)
				elseif ($elevelc1 == "") { //Case 2
					$rangetype = 2;
				} // end elseif (if the third level item ending is blank) 
				else { //Case 3
					$rangetype = 3;
				} // end else (if all endings (and the first level beginning) exist, but not the 2nd level beginning)
			} // end if (

			elseif ($blevelc1 == "") { // Cases 4-6
				if ($elevelb1 == "") { //Case 4
					$rangetype = 4;
				} // end if (if the second level item ending is blank)
				elseif ($elevelc1 == "") { //Case 5
					$rangetype = 5;
				} // end elseif (if the third level item ending is blank)
				else { //Case 6
					$rangetype = 6;
				} // end else (if all endings (and the first and second level beginnings) exist, but not the 3rd level beginning)
			} // end elseif (if the first and second level beginnings exist, but not the 3rd level beginning)

			else { // Cases 7-9
				if ($elevelb1 == "") { //Case 7
					$rangetype = 7;
				}
				elseif ($elevelc1 == "") { //Case 8
					$rangetype = 8;
				}
				else { //Case 9
					$rangetype = 9;
				} // end else (if beginnings and endings exist at all levels)
			} // end else (if beginnings exist at all levels)
		} // end else (if both beginnings and endings exist for the first level)
	} // end else (if there is a ending for the first level (but not a beginning) or both beginnings and endings exist for the first level)
} // end else (if the beginning and/or the ending of the first level item have values) 



// Set ois flag (acrononym?) which affects whether the item is <= or just <, etc.
/////////////////// Consider the above as well as whether the endings are greater than the beginnings, greater than one, etc. to see which range_type function (and thus selection and make_table) to run ///////////////////

$ois1 = "no";

// print "rt: ".$rangetype."<br />\n";

switch ($rangetype) {

	case 1:
		range_type($ois1, $blevela1, $elevela1, $fields_name1);
		break;
	case 2:
		if ($elevela1 > $blevela1) {
			$ois1 = "yes";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		$ois1 = "no";
		range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		break;
	case 3:
		if ($elevela1 > $blevela1) {
			$ois1 = "yes";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		if ($elevelb1 > 1) {
			$ois1 = "yes";	
			range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		} // end if
		$ois1 = "no";
		range_type($ois1, $blevelc1, $elevelc1, $fields_name1, $fields_name2, $fields_name3, $elevela1, $elevelb1);
		break;
	case 4:
		$ois1 = "no";
		range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $blevela1);
		if ($elevela1-1 > $blevela1) {
			$ois1 = "yes2";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		break;
	case 5:
		$ois1 = "no";

		if ($elevela1 == $blevela1) {
			range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $blevela1);
		} // end if
		else {
			range_type($ois1, $blevelb1, "", $fields_name1, $fields_name2, "", $blevela1);
		} // end else

		if ($elevela1 - 1 > $blevela1) {
			$ois1 = "yes2";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		if ($elevela1 !== $blevela1) {
			$ois1 = "no";
			range_type($ois1, 0, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		} // end if
		break;
	case 6:
		$ois1 = "no";

		if ($elevela1 !== $blevela1) {
			range_type($ois1, $blevelb1, "", $fields_name1, $fields_name2, "", $blevela1);
		} // end if
		if ($elevela1 > $blevela1) {
			$ois1 = "yes2";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		if ($elevelb1 > $blevelb1 || $elevela1 > $blevela1) {
			$ois1 = "yes";
			range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		} // end if
		if ($elevela1 > $blevela1) {
			range_type($ois1, 0, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		} // end if
		$ois1 = "no";
		range_type($ois1, 0, $elevelc1, $fields_name1, $fields_name2, $fields_name3, $elevela1, $elevelb1);

		break;
	case 7:
		$ois1 = "no";
		range_type($ois1, $blevelc1, $elevelc1, $fields_name1, $fields_name2, $fields_name3, $blevela1, $blevelb1);
		$ois1 = "yes2";
		range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $blevela1);
		if ($elevela1-1 > $blevela1) {
			$ois1 = "yes2";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);
		} // end if
		break;

	case 8:
		$ois1 = "no";
		range_type($ois1, $blevelc1, "", $fields_name1, $fields_name2, $fields_name3, $blevela1, $blevelb1);
		if ($elevela1 > $blevela1 || $elevelb1 > $blevelb1) {
			$ois1 = "yes2";
			if ($blevela1 == $elevela1) {
				range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $blevela1);	
			} // end if
			else {
				range_type($ois1, $blevelb1, "", $fields_name1, $fields_name2, "", $blevela1);	
			} // end else
		} // end if
		if ($elevela1-1 > $blevela1) {
			$ois1 = "yes2";
			range_type($ois1, $blevela1, $elevela1, $fields_name1);	
		} // end if

		if ($elevela1 > $blevela1) {
			$ois1 = "no";
			range_type($ois1, 0, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
		} // end if
		break;
	case 9:
		$ois1 = "no";
		if ($elevela1 > $blevela1 || $elevelb1 > $blevelb1) {
			range_type($ois1, $blevelc1, "", $fields_name1, $fields_name2, $fields_name3, $blevela1, $blevelb1);
			if ($blevela1 == $elevela1) {
				$ois1 = "yes3";
				range_type($ois1, $blevelb1, $elevelb1, $fields_name1, $fields_name2, "", $blevela1);	
			} // end if
			else {
				$ois1 = "yes2";
				range_type($ois1, $blevelb1, "", $fields_name1, $fields_name2, "", $blevela1);	
			} // end else

			if ($elevela1-1 > $blevela1) {
				$ois1 = "yes2";
				range_type($ois1, $blevela1, $elevela1, $fields_name1);	
			} // end if

			if ($elevela1 > $blevela1) {
				$ois1 = "yes";
				range_type($ois1, 0, $elevelb1, $fields_name1, $fields_name2, "", $elevela1);
			} // end if
			$ois1 = "no";
			range_type($ois1, 0, $elevelc1, $fields_name1, $fields_name2, $fields_name3, $elevela1, $elevelb1);

		} // end if
		else {
			range_type($ois1, $blevelc1, $elevelc1, $fields_name1, $fields_name2, $fields_name3, $blevela1, $blevelb1);
		} // end else
		break;

	default: exit;
} //end rangetype switch


} // end if access defined
?>