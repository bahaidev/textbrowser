<?php

/////////////////
// This is version 0.1 of browse9.php
// Search this document for "New Book Add:" to find sections which may need customization when adding a new book to the database
// Search this document for "Fix:" to find items to fix for better coding.
// "testing code:" is for code to use when testing (can delete if desired)
// Remove the values from the following for open-source version!
////////////////
$host = "localhost"; // Change this if your SQL host is not onsite$dbuser = ""; // Fill in your MYSQL user here$passw = ""; // Fill in your password here$hardcodeddb = ""; // Fill in the database with the books; Delete this if fix hard-coding problem////////////////
//Fix: There could probably be a good amount of simplifying (and checking) for the range_type function, the if-then web preceding the rangetype switch (which also itself needs expanding of the possible permutations) and the rangetype switch itself. I did not rereview these carefullyl when adding comments.


/////////////// Define functions ///////////////////
// Note to self: Functions in PHP 4 and 5 do not need to be defined at the beginning (in browse.php I even defined them within a function)
// However, I am declaring all (except for semidynamic_variable (since it is small and not even potentially reusable within this file) at the beginning)
///////////////// 
// This function is called by the range_type function following (This could conceivably be included inside of range_type since I have read that user-defined functions are supposed to slow things down and should be omitted if they are not necessary--However, it does help with clarity, I think-- B.Z.)

function make_table ($result) {
	while ($row = mysql_fetch_array($result)) { // get all the records based on the selection statement determined in the range_type function
		print ("<tr>");
		for ($k = 0; $k < mysql_num_fields($result); $k++) { // Go through all the fields
			$option = "option".$k;
			global $$option;
			if ($$option == "yes") { // If the user opted to see that field
				$field = "field".$k;
//Fix: The number after arw should not be hard-coded here, but put in a for loop for future compatibility
				global $arabiccolumn, $arw0, $$field; // dynamically declare the field variables
//Fix: The number after arw should not be hard-coded here, but put in a for loop for future compatibility
				if ($arabiccolumn != "" && $arabiccolumn == $$field) { // && $arw0 != "" (if problem with no width being specified--but then need to deal with dir="rtl" for non-Arabic) -- print the cells with right-to-left directionality and column-width; Fix: make columns variable not only for Arabic

//Fix: The number after arw should not be hard-coded here, but put in a for loop for future compatibility
					print ("<td width='$arw0' valign='top' dir='rtl'>".$row[$$field]."</td>");
				}
				else { // print the cells with regular (left-to-right) directionality and no special width
					print ("<td valign='top'>".$row[$$field]."</td>");
				}
// } else {
// } //////// end else remove this if removing above
			} //end if (if the user opted to see the given field)
		} //end for to go through all the fields
	print ("</tr>\n");
	} //end while to get all the records
} //end function make_table



function range_type ($ois1, $blevel, $endlevel, $fields_name, $fields_nameB="", $fields_nameC="", $bookvalue="", $chaptervalue="") { // Default values for the last four items are set as null (sometimes not set by the function call)
	global $toggle; // This variable is obtained from browse.php (currently on the Hidden Words) where an additional column match is performed (e.g., only get results for the "Original Language"="Persian" Hidden Words)
	global $file;
	// See if the field names are blank or not
	if ($fields_nameC !== "") {$fieldsGeneric_name = $fields_nameC;}
	elseif ($fields_nameB !== "") {$fieldsGeneric_name = $fields_nameB;}
	else {$fieldsGeneric_name = $fields_name;}

	// If the beginning or ending levels are not set, give default values (0 for undefined beginnings, absolute last value for undefined endings)
	if ($blevel == "") {
		$blevel = 0;
	} // end if
	if ($endlevel == "") {
		$endlevelmax = mysql_query("SELECT max(`$fieldsGeneric_name`) FROM `$file`"); // Finds the highest value for the lowest level field (e.g., for verse)
		$endlevelmax2 = mysql_fetch_array($endlevelmax);
		//$endlevelmax2[0] = $endlevelmax2[0] //add back "+ 1;" if it is necessary
		$endlevel = $endlevelmax2[0]; // If there are duplicates of the max, just choose one
	} // end if

///////////////////////////// Depending on the number of levels, and the rangetype (which was also based on whether beginnings or endings existed or not), choose a select statement /////////////////////////////
	if ($fields_nameC !== "") {
		if ($ois1=="yes") {
			$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` = $chaptervalue AND `$fields_nameC` >= $blevel AND `$fields_nameC` < $endlevel");
		} // end if
		else {
		$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` = $chaptervalue AND `$fields_nameC` >= $blevel AND `$fields_nameC` <= $endlevel");
		//testing code: print "SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` = $chaptervalue AND `$fields_nameC` >= $blevel AND `$fields_nameC` <= $endlevel";
		} // end else
	} // end if
	elseif ($fields_nameB !== "") {
		if ($ois1=="yes") {
			$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` >= $blevel AND `$fields_nameB` < $endlevel");
		} // end if
		elseif ($ois1=="yes2") {
			$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` > $blevel AND `$fields_nameB` <= $endlevel");
		} // end elseif
		elseif ($ois1=="yes3") {
			$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` > $blevel AND `$fields_nameB` < $endlevel");
		} // end elseif
		else {
			$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` >= $blevel AND `$fields_nameB` <= $endlevel");
			//testing code: print "(SELECT * FROM `$file` WHERE `$fields_name` = $bookvalue AND `$fields_nameB` >= $blevel AND `$fields_nameB` <= $endlevel);";
		} // end else
	} // end elseif
	else {
		if ($toggle == "") { // See toggle declaration above in this function
			if ($ois1=="yes") {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` >= $blevel AND `$fields_name` < $endlevel");	
			} // end if
			elseif ($ois1=="yes2") {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` > $blevel AND `$fields_name` < $endlevel");	
			} // end elseif
			else {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fields_name` >= $blevel AND `$fields_name` <= $endlevel");
				//testing code: print "\$result = mysql_query(\"SELECT * FROM `$file` WHERE `$fields_name` >= $blevel AND `$fields_name` <= $endlevel\");";
			} // end else
		} // end if
		//testing code: print "$ois1, $blevel, $endlevel, $fields_name, $fields_nameB, $fields_nameC, $bookvalue, $chaptervalue";
		else {
			// New Book Add: If one wishes to toggle between one subset of columns and another (e.g., Persian or Arabic Hidden Words), hard-code that here
			if ($file == "Hidden Words") {
				$fieldtoggle = "Original Language";
			} // end if
			if ($ois1=="yes") {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` >= $blevel AND `$fields_name` < $endlevel");	
			} // end if
			elseif ($ois1=="yes2") {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` > $blevel AND `$fields_name` < $endlevel");	
			} // end elseif
			else {
				$result = mysql_query("SELECT * FROM `$file` WHERE `$fieldtoggle` = '$toggle' AND `$fields_name` >= $blevel AND `$fields_name` <= $endlevel");
			} // end else
		} // end else
	} // end else
make_table ($result);
} // end range_type function

/////////////// End function declarations ///////////////




///////////// Set X(HT)ML declaration and character encoding ////////////////////
///New Book Add: Add exceptions if the character encoding must be specified

if ($file=="peace") {
	print "<?xml version=\"1.0\" encoding=\"GB2312\" ?>\n"; // UTF-8 didn't work
}

///Fix: Is it better to go with UTF-8 for the rest (including Arabic, etc.)?

else {
	$pagecharset = "iso-8859-1";
	print <<<HERE
<?xml version="1.0" encoding="$pagecharset" standalone="no"?>
HERE;
}

/*
// Don't need this section; I thought I needed to set the encoding to iso-8859-6 for a fix for Mac Safari browser for Arabic (the letters appear disconnected), but the actual solution is simply to remove Times New Roman and Arial fonts from each user's ~/Library/Fonts directory (installed by Entourage 2004); manually setting the encoding here doesn't solve the problem (nor is it necessary).
elseif ($file=="aqdas" || $file=="Hidden Words") {
}
*/
?>


<?php
// XHTML declaration
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<?php
// Fix: Add xml:lang="en", etc. to the following?
?>

<html xmlns="http://www.w3.org/1999/xhtml">

<?php

/////////Fix: Need to fix this badly!!!!!!!!!!!!!!!!!


/////////// Explicitly declare static get globals ///////////
// The following are mostly in the order they appear in browse.php (dynamically generated ones have been moved out of order into a separate section below)

$toggle = $_GET['toggle'];
$color2 = $_GET['color2'];
$color = $_GET['color'];
$bgcolor2 = $_GET['bgcolor2'];
$bgcolor = $_GET['bgcolor'];
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
$levels = $_GET['levels'];
$file = $_GET['file'];

// If no file is set, refer the user back to the main page.
if (!$file) {
/*
// Fix: When I used the following, sleep() did seem to delay the execution, but it did not provide the output printed before hand. Find a way to show the redirect information but also run the header.
	print "You haven't specified a file yet.<br /><br />You will be redirected in a few seconds or you may visit <a href='browse0.php'>here</a> if you do not wish to wait.";
	sleep(10);
*/
	header('Location: browse0.php');
	exit();
}

$fields_name1 = $_GET['fields_name1'];
$fields_name2 = $_GET['fields_name2'];
$fields_name3 = $_GET['fields_name3'];
$fields_name7 = $_GET['fields_name7'];
$fields_name8 = $_GET['fields_name8'];
$fields_name9 = $_GET['fields_name9'];
$heading = $_GET['heading'];


/////////// Explicitly declare dynamic get globals ///////////
// The following are mostly in the order they appear in browse.php (these dynamically generated ones have been moved to here out of the sequence of static ones (see above))


function semidynamic_variable ($variable, $begin, $length) {
	for ($k = $begin; $k < $length; $k++) {
		$redone_variable = $variable.$k;
		$$redone_variable = $_GET['$redone_variable'];
	} // end for loop to assign an indefinite number of variables with the same prefix
} // end function semidynamic variable


//New Book Add: Change last parameter below if necessary
// Fix: If the fields are ever allowed to be indefinitely large, the third parameter (length) should be dynamically generated--by another call to the database, using the "file" variable and a repeated if-then list here (or SQL list) to determine how many options (and thus variables) could be submitted
semidynamic_variable ('blevela', 1, 3); // 3 is the length since the value starts at one and may cycle two times (no. 3 will not be run); if this is ever made indefinite, one could also use "field_and_option_no" since it is the maximum # of fields (yet not ridiculously large to small things down too much)
semidynamic_variable ('elevela', 1, 3);
semidynamic_variable ('blevelb', 1, 3);
semidynamic_variable ('elevelb', 1, 3);
semidynamic_variable ('blevelc', 1, 3);
semidynamic_variable ('elevelc', 1, 3);

////// Find number of fields to determine the maximum cycle length for the option and field variables
mysql_select_db($hardcodeddb, mysql_connect($host, $dbuser, $passw));
$result0 = mysql_query("SELECT * FROM `$file`");
$field_and_option_no = mysql_num_fields($result0);
semidynamic_variable ('option', 0, $field_and_option_no);
semidynamic_variable ('field', 0, $field_and_option_no);


//New Book Add: Change last parameter below if necessary
semidynamic_variable ('arw', 0, 2); // Currently the length is only 1, but the Hidden Words are expected to have two Arabic columns; However, this ought to be dynamic based again on an if-then list (or SQL list); or one could just use "field_and_option_no" since it is the maximum # of fields (yet not ridiculously large to small things down too much


/*
DO NOT ENABLE THIS...THIS IS ONLY TO KEEP FOR REFERENCE TO THE OLD (LESS SECURE) WAY OF DOING THINGS HERE
foreach($_GET as $key=>$value) {
	${$key} = $value;
} //end foreach getting superglobals
*/



/////////// Only if all of the first set of verse selection items is blank (but not the 2nd) will the 2nd be used (i.e., its fields will be copied to the a1/b1/c1 variables which are used in this script)--e.g., Rodwell's ordering instead of the Traditional
/// Fix: This should be expanded into a loop if browse.php allows for indefinite verse selection options (As stated in the comments there, this is not urgent.

if ($blevela1 == "" && $elevela1 == "" && $blevelb1 == "" && $elevelb1 == "" && $blevelc1 == "" && $elevelc1 == "" && $blevela2 == "" && $elevela2 == "" && $blevelb2 == "" && $elevelb2 == "" && $blevelc2 == "" && $elevelc2 == "") {
} // end if (if all verse selection fields are blank)

elseif ($blevela1 == "" && $elevela1 == "" && $blevelb1 == "" && $elevelb1 == "" && $blevelc1 == "" && $elevelc1 == "") {
	$fields_name1 = $fields_name7;
	$fields_name2 = $fields_name8;
	$fields_name3 = $fields_name9;
	$blevela1 = $blevela2;
	$elevela1 = $elevela2;
	$blevelb1 = $blevelb2;
	$elevelb1 = $elevelb2;
	$blevelc1 = $blevelc2;
	$elevelc1 = $elevelc2;
} // end elseif (if the first set of verse browsing options is blink)


//////////////// Set Arabic column width and indicate number


// Fix: The number after arw should not be hard-coded here, but put in a for loop for future compatibility
// Fix: All columns should actually allow variable column width
if ($arw0 == "") {
// $arw0 = 200; // any default width of Arabic field
}

/////New Book Add: If there is Arabic content (its column size is adjustable), indicate which column it is

if ($file == "aqdas") {
	$arabiccolumn = 2;
}

if ($file == "Hidden Words") {
	$arabiccolumn = 4;
}


///////////// Go with the pull-down menu of colors if the color field is blank or only includes the hash mark ///////////////

if ($color == "" || $color == "#") {
	$color = $color2;
}

if ($bgcolor == "" || $bgcolor == "#") {
	$bgcolor = $bgcolor2;
}


//////////////// Set styles according to user selections

print <<<HERE
<head>
<style type="text/css">
<!--
HERE;
print "\n\n";

if ($headings == "y") {
	$headingstyles = "td, th";
}
elseif ($headings == "n") {
	$headingstyles = "td";
}
elseif ($headings == "0") {
	$headingstyles = "td";
}
else {
	$headingstyles = "td";
}


print $headingstyles;

print " {
font-style: ";
print $fontstyle;
print ";

font-variant: ";
print $fontvariant;

print ";

font-weight: ";
print $fontweight;
print ";

font-size: ";
print $fontsize;
print ";

font-family: ";
print $font;


//Removed following as aren't supported in browsers; did letter-spacing instead
// print ";
// 
// font-stretch: ";
// print $fontstretch;


print ";

letter-spacing: ";
print $letterspacing;


print ";

line-height: ";
print $lineheight;

print ";

color: ";
print $color;

print ";
}

body {
background-color: ";
print $bgcolor;
print ";
}

-->
</style>";
$newheading = stripslashes($heading);
?>

<?php
///////////// Create page title and XHTML tags /////////////
?>

<title><?php print "Sacred Writings Browser results for: $newheading"; ?></title>
</head>
<body>

<?php
// Fix: Was testing different possibilities that were supposed to help with thead/tfoot showing up on each page (was really looking for the browser to do this (a XUL "tree" might do the trick if we could get XULRunner or whatever going to use these elements) since frames do not allow tables in headers to align perfectly with the tables in text. However, this code may still be useful to uncomment if it is necessary (maybe only in MSIE as I recall) when printing copies. This is not urgent to fix (other code below relates to this as well).
// thead { display: table-header-group; }
// tfoot { display: table-footer-group; }


////////////// Print table and borders according to user selection //////////////

if ($border == "") {
	$border = 1;
} // end if (if there is no border code specified for some reason, add a border anyways) 

print "<table border='".$border."' cellpadding='5'><thead>";

// Fix: See above on thead/tfoot for the following
// style='tableLayout:fixed'


/////////////////// If there are to be headings, get ready to print the result (using number 1 for the book, chapter, and verse, etc. (if such fields exist in the database) to speed up (will it????) the query) //////////////
// Fix: Adjust WHERE commands in the future according to search preferences of user; Move this to-do...

if ($headings !== "0") {
	print "<tr>";

	if ($fields_name2 !== "" && $fields_name3 !== "") { 
		$resulta1 = mysql_query("SELECT * FROM `$file` WHERE `$fields_name1` = 1 AND `$fields_name2` = 1 AND `$fields_name3` = 1");
	} // end if (if the text uses 3 fields for verse browsing--e.g., book/chapter/verse)

	elseif ($fields_name2 !== "") {
		$resulta1 = mysql_query("SELECT * FROM `$file` WHERE `$fields_name1` = 1 AND `$fields_name2` = 1");
	} // end elseif (if the text uses 2 fields for verse browsing--e.g., chapter/verse)

	else {
		$resulta1 = mysql_query("SELECT * FROM `$file` WHERE `$fields_name1` = 1");
	} // end else (if the text uses only 1 field for verse browsing--e.g., verse)


/////////////////////// If the user opted to show a particular column, print the field (according to its number) that was selected by the user for that column. ///////////////////////
// Fix: / New Book Add: Introduce the ability to add field aliases here.

	for ($m = 0; $m < mysql_num_fields($resulta1); $m++) {
		$optiona = "option".$m;
		if ($$optiona == "yes") {
			$fielda = "field".$m;
			print "<th valign='top'>".mysql_field_name($resulta1, $$fielda)."</th>";
		} //end if (if the user opted for a particular column)
	} //end for (end loop of all the fields)

	print "\n\n</tr></thead>\n\n";

///// Fix: see fix above for details on this.
// Used the following to test footer
/*
	print "</tr></thead><tfoot><tr>";
	for ($m = 0; $m < mysql_num_fields($resulta1); $m++) {
	$optiona = "option".$m;
	if ($$optiona == "yes") {
	$fielda = "field".$m;
	print "<th valign='top'>".mysql_field_name($resulta1, $$fielda)."</th>";
	} //end if (if the user opted for a particular column)
	} //end for (end loop of all the fields)
	print "</tr></tfoot>";
*/

} //end if (if the user has not opted to omit headings)


print "<tbody>";

// Fix: see fix above for details on this.
// style='position: absolute; overflow:scroll;'



//////////////////// Depending on whether certain book/chapter/verse beginnings or endings exist, give the selection a range type to be used below (in combination with a switch) to see which selection type to make ////////////////////

// If the first level verse selection options (e.g., book, though possibly chapter or even verse) are blank, set some (arbitrary) default beginning and ending values for the user...
// The following possibilities are not comprehensive and should be fixed (though not urgent since there is no problem if the user specifies all the information)

if ($blevela1 == "" && $elevela1 == "") {

	if ($fields_name3 !== "") {
		$blevela1 = 1;
		$elevela1 = 1;
		$blevelb1 = 0;
		$elevelb1 = 1;
		$rangetype = 5;
	} // end if (if there is a third level field)

	elseif ($fields_name2 !== "") {
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
		//testing code: print "range_type($ois1, $blevelb1, $elevela1, $fields_name1, $fields_name2, \"\", $blevela1);";
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
		//testing code: print "	range_type($ois1, $blevelb1, $elevela1, $fields_name1, $fields_name2, \"\", $blevela1);";
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

/////////////////// Finish XHTML tags ///////////////////

print "</tbody></table></body></html>";

?>