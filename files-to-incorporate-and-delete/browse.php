<?php

// Todo: Add back interlinear columns, search, transposing table options!!!
// Todo: Reverse engineer missing work by using bahai_locales database (which contains more than localization info: automated column data, alternative field names, etc.)
// Todo: Create metadata file for column headers?

$file = $_GET['file'];

/////////////////// This section sets (in some cases):
////// 1) The aliased heading (also used as the title of the page)
////// 2) The number of levels (e.g., the Bible with book, chapter, verse has 3) and their columns
////// 3) The number of options (e.g., the Qur'an can be browsed by Rodwell or traditional numbering--Fix: (later?) Any other reasonable options should also be added (e.g., to Collins esp.). Once searching has been added, this might be merged with that.)
////// 4) A default column and default value (guessing that SQL will take less time to return the results (only need the field names in this script) if a small subset is selected--this might be false or even counterproductive?).
////// 5) A flag for any Arabic script content (Fix: This might need fixing when multiple columns exist to avoid name conflicts?) The number presently indicates the number of times some occurs.
///////////////////
//Fix: merge the heading with the alias from browse0.php? to avoid duplication
//New Book Add: Add scripture/book names here as needed:
///////////////////

switch ($file) {

	case "Bible":
		$heading = "The Bible";
		$levels = 3;
		$options = 1;
		$columnof1 = 0; // Book #
		$columnof2 = 1; // Chapter #
		$columnof3 = 2; // Verse #
		$defcolumn = "Book #";
		$defvalue = 1; // change this to a much shorter book when all books are uploaded
	break;
	
	case "Hidden Words":
		$levels = 1;
		$options = 1;
		$columnof1= 1; // Number
		$heading = "The Hidden Words";
		$arabiccontent = "1";
	break;
	
	case "aqdas":
		$heading = "The Kit&aacute;b-i-Aqdas";
		$levels = 1;
		$options = 1; //should be 2 in the future when "by page" exists
		$columnof1 = 0; // Paragraph
	//$columnof3 = 2; (add if page numbers enter into column 4 (index = 3)
		$defcolumn = "Paragraph";
		$defvalue = 1;
		$arabiccontent = "1";
	break;
	
	case "iqan": 
		$heading = "The Kit&aacute;b-i-&Iacute;q&aacute;n";
		$levels = 1;
		$options = 2;
		$columnof1 = 0; // Page
		$columnof3 = 1; // Paragraph
		$defcolumn = "Paragraph";
		$defvalue = 1;
	break;
	
	case "peace":
		$heading = "The Promise of World Peace";
		$levels = 1;
		$options = 2;
		$columnof1 = 0; // Par.
		$columnof3 = 3; // Section // (English)
		$defvalue = 1;
	break;
	
	case "quran": 
		$heading = "The Qur'&aacute;n";
		$levels = 2;
		$options = 2;
		$columnof1 = 2; //Traditional
		$columnof2 = 1; //Verse
		$columnof3 = 0; //Rodwell
		$columnof4 = 1; //Verse
		$defcolumn = "Traditional Sur‡h #";
		$defvalue = 1;
	break;
	
	case "Collins":
		$levels = 1;
		$options = 2;
		$columnof1= 1; //Number
		$columnof3= 21; //Year
		$heading = "Collins Bibliography";
	break;
	
	///////////// The following default switch only takes effect if the details above are not supplied (helpful if the coders are too lazy to find and update this section. :) ///////////////
	default:
		$levels = 1; 
		$options = 1;
		$columnof1= 0;
		$columnof3= 1;
		$heading = $file;
	
} //end switch (of file-specific header and field heading defaults)
?>

<?php

print '<table align="center">';

if ($levels == 2) {

	function verse_selection ($a, $b, $c, $d, $fields_name1, $fields_name2, $option_no) {
		print <<<HERE
		<tr>
		<td>$fields_name1: </td><td><input name="$a$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$b$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><b>TO</b>:&nbsp; &nbsp; &nbsp; </td><td>$fields_name1: </td><td><input name="$c$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$d$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td>(numbers only; verses and<br /> &nbsp; ending data optional)</td></tr>
HERE;
	}
	verse_selection ("blevela", "blevelb", "elevela", "elevelb", $aliasedfield, $aliasedfield2, 1);
} //end levels2
elseif ($levels == 3) {
//New Book Add: Add options into the following if, if there are three level files needing aliased columns as with Collins biblio for level one
	function verse_selection ($a, $b, $c, $d, $e, $f, $fields_name1, $fields_name2, $fields_name3, $option_no) {
		print <<<HERE
		<tr>
		<td>$fields_name1: </td><td><input name="$a$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$b$option_no" type="text" size="7" /></td><td>$fields_name3: </td><td><input name="$c$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><b>TO</b>:&nbsp; &nbsp; &nbsp; </td><td>$fields_name1: </td><td><input name="$d$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$e$option_no" type="text" size="7" /></td><td>$fields_name3: </td><td><input name="$f$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td>(numbers only; verses and<br /> &nbsp; ending data optional)</td></tr>
HERE;
	}
	verse_selection ("blevela", "blevelb", "blevelc", "elevela", "elevelb", "elevelc", $aliasedfield, $aliasedfield2, $aliasedfield3, 1);
} //end elseif (levels3)

print "</table>";
?>


<table border="1" cellpadding="5" align="center"><tr><th align="left" width="20">Enabled?</th><th>Column Title</th></tr>
<?php

//Fix: Add the following explanatory text?:  <u>Check the columns you wish to browse:</u>&nbsp;&nbsp;, Select the sequence (you can choose the same field twice if you wish)
//Fix: Add Javascript to check/uncheck all columns at once
//Fix: Add later option to <u>Search for any text you wish to find in that column:</u><br /><br />

/////////////Get the (optional) fields listed in drop-down menus; although all options are available in each menu, one is chosen (by its sequence) to be initially selected/////////////

for ($i = 0; $i < mysql_num_fields($result); $i++) {
	print <<<HERE
	<tr>
	<td><input name="option$i" type="checkbox" value="yes" checked="checked" /></td>
	<td><select name="field$i" id="field$i" size="1">
HERE;

	for ($j = 0; $j < mysql_num_fields($result); $j++) {
		$columnface = mysql_field_name($result, $j);
		if ($j !== $i) {
			print <<<HERE
			<option value="$j">$columnface</option>
HERE;
		} // end if (if current option is not (yet) in line to be selected)
		else {
			print <<<HERE
			<option value="$j" selected="selected">$columnface</option>
HERE;
		} // end else (if current option is in line to be selected)
	} //end for (going through all the fields to be listed in the drop-down menu of field choices--used for seeing if the item is to be checked by default or not)
	print "</select></td></tr>";
} //end for (going through all the fields to be listed in the drop-down menu of field choices--used for seeing if the item is to be checked by default or not)
?>
</table>
