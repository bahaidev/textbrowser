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


<body>

<form action="browse9.php" method="get" name="browse">

<?php
///////////// Connect to database and get results to obtain field names (if default column and value exists, will only return these results (since only need the fieldnames in this script)//////////////

// New Book Add: Tweaks could be added here (as for the Hidden Words) to allow browsing for a major subset of the content (esp. if there would otherwise be duplicate numbers)

	if ($file == "Hidden Words") {
		print <<<HERE
		<br />
		<table align="center"><tr><td>
		Persian: <input type="radio" name="toggle" value="Persian" /> &nbsp; Arabic: <input type="radio" name="toggle" value="Arabic" /> &nbsp;&nbsp; Both: <input type="radio" name="toggle" value="" />
		</td></tr></table>
HERE;
	}

if ($levels == 2) {


	print <<<HERE

	<table align="center">
HERE;

	$fields_name1 = mysql_field_name($result, $columnof1);
	$fields_name2 = mysql_field_name($result, $columnof2);
	$fields_name7 = mysql_field_name($result, $columnof3);
	$fields_name8 = mysql_field_name($result, $columnof4);



//Add options into the following if, if there are two level files needing aliased columns as with Collins biblio for level one
	if ($file == "") {
	}
	else {
	$aliasedfield = $fields_name1;
	$aliasedfield2 = $fields_name2;
	$aliasedfield3 = $fields_name7;
	$aliasedfield4 = $fields_name8;
	}


	function verse_selection ($a, $b, $c, $d, $fields_name1, $fields_name2, $option_no) {

		print <<<HERE
		<tr>
		<td>$fields_name1: </td><td><input name="$a$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$b$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><b>TO</b>:&nbsp; &nbsp; &nbsp; </td><td>$fields_name1: </td><td><input name="$c$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$d$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td>(numbers only; verses and<br /> &nbsp; ending data optional)</td></tr>

HERE;
	}

	verse_selection ("blevela", "blevelb", "elevela", "elevelb", $aliasedfield, $aliasedfield2, 1);

	if ($options > 1) {
//for ($i = 2; $i < $options+1; $i++) {
		print <<<HERE
			<tr><td colspan="12" align="center"><br />OR:<br /><br /></td></tr> 
HERE;
		verse_selection ("blevela", "blevelb", "elevela", "elevelb", $aliasedfield3, $aliasedfield4, 2);
//} //end for
	} //end if
	print "</table>";
} //end levels2


elseif ($levels == 3) {


	print <<<HERE
	<table align="center">
HERE;

	$fields_name1 = mysql_field_name($result, $columnof1);
	$fields_name2 = mysql_field_name($result, $columnof2);
	$fields_name3 = mysql_field_name($result, $columnof3);

	$fields_name7 = mysql_field_name($result, $columnof4);
	$fields_name8 = mysql_field_name($result, $columnof5);
	$fields_name9 = mysql_field_name($result, $columnof6);


//New Book Add: Add options into the following if, if there are three level files needing aliased columns as with Collins biblio for level one
	if ($file == "") {
	}
	else {
		$aliasedfield = $fields_name1;
		$aliasedfield2 = $fields_name2;
		$aliasedfield3 = $fields_name3;
		$aliasedfield4 = $fields_name7;
		$aliasedfield5 = $fields_name8;
		$aliasedfield6 = $fields_name9;
	}


	function verse_selection ($a, $b, $c, $d, $e, $f, $fields_name1, $fields_name2, $fields_name3, $option_no) {

		print <<<HERE
		<tr>
		<td>$fields_name1: </td><td><input name="$a$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$b$option_no" type="text" size="7" /></td><td>$fields_name3: </td><td><input name="$c$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><b>TO</b>:&nbsp; &nbsp; &nbsp; </td><td>$fields_name1: </td><td><input name="$d$option_no" type="text" size="7" /></td><td>$fields_name2: </td><td><input name="$e$option_no" type="text" size="7" /></td><td>$fields_name3: </td><td><input name="$f$option_no" type="text" size="7" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td>(numbers only; verses and<br /> &nbsp; ending data optional)</td></tr>
HERE;
	}

	verse_selection ("blevela", "blevelb", "blevelc", "elevela", "elevelb", "elevelc", $aliasedfield, $aliasedfield2, $aliasedfield3, 1);

	if ($options > 1) {

	//for ($i = 2; $i < $options+1; $i++) { // (add i to the parameter call?)

		print <<<HERE
		<tr><td colspan="12" align="center"><br />OR:<br /><br /></td></tr> 
HERE;

	verse_selection ("blevela", "blevelb", "blevelc", "elevela", "elevelb", "elevelc", $aliasedfield4, $aliasedfield5, $aliasedfield6, 2);

	//} //end for
	} //end if options > 1

	print "</table>";

} //end elseif (levels3)

?>

<?php
/////////////Start tables////////////////
?>

<br /><blockquote><p></p><p></p>

<table border="1" align="center" cellpadding="5"><tr valign="top"><td>
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

<?php
//////////////Advanced formatting options/////////////
?>

</table></td><td><h3>Advanced Formatting Options</h3>


Text color:

['select', {id: 'color2'}, [
    'Aqua',
    'Black',
    'Blue',
    'Fuchsia',
    'Gray',
    'Green',
    'Lime',
    'Maroon',
    'Navy',
    'Olive',
    'Purple',
    'Red',
    'Silver',
    'Teal',
    'White',
    'Yellow'
].map(function (color, i) {
    return i === 1 ? ['option', {selected: 'selected', value: color.toLowerCase()}, [color]] : ['option', {value: color.toLowerCase()}, [color]];
}),


Or enter a color code here: <input name="color" type="text" value="#" size="7" maxlength="7" />
<br /><br />

Background color:

['select', {id: 'bgcolor2'}, [
    'Aqua',
    'Black',
    'Blue',
    'Fuchsia',
    'Gray',
    'Green',
    'Lime',
    'Maroon',
    'Navy',
    'Olive',
    'Purple',
    'Red',
    'Silver',
    'Teal',
    'White',
    'Yellow'
].map(function (color, i) {
    return i === 14 ? ['option', {selected: 'selected', value: color.toLowerCase()}, [color]] : ['option', {value: color.toLowerCase()}, [color]];
}),

Or enter a color code here: <input name="bgcolor" type="text" value="#" size="7" maxlength="7" />
<br /><br />

Text font: ['select', {id: 'font'}, [
    ['Helvetica, sans-serif'],
	['Verdana, sans-serif'],
	['Gill Sans, sans-serif'],
	['Avantgarde, sans-serif'],
	['Helvetica Narrow, sans-serif'],
	['sans-serif'],
	['Times, serif'],
	['Times New Roman, serif'],
	['Palatino, serif'],
	['Bookman, serif'],
	['New Century Schoolbook, serif'],
	['serif'],
	['Andale Mono, monospace'],
	['Courier New, monospace'],
	['Courier, monospace'],
	['Lucidatypewriter, monospace'],
	['Fixed, monospace'],
	['monospace'],
	['Comic Sans, Comic Sans MS, cursive'],
	['Zapf Chancery, cursive'],
	['Coronetscript, cursive'],
	['Florence, cursive'],
	['Parkavenue, cursive'],
	['cursive'],
	['Impact, fantasy'],
	['Arnoldboecklin, fantasy'],
	['Oldtown, fantasy'],
	['Blippo, fantasy'],
	['Brushstroke, fantasy'],
	['fantasy']]
].map(function (fonts, i) {
    return (i === 7) ? ['option', {selected: 'selected'}, fonts] : ['option', fonts];
}),
['br', 'br']

Font style (normal, italic, oblique):  <input name="fontstyle" type="text" value="normal" size="7" maxlength="12" /><br />

Font variant (normal, small-caps):  <input name="fontvariant" type="text" value="normal" size="7" maxlength="12" /><br />

Font weight (normal, bold, 100-900, etc.):  <input name="fontweight" type="text" value="normal" size="7" maxlength="12" /><br />
Font size (14pt, 14px, small, 75%, etc.):  <input name="fontsize" type="text" value="" size="7" maxlength="12" /><br />

<!--
This CSS attribute didn't work so it was removed in favor of letter-spacing (see the following) which can do the trick:

Font stretch (wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc.):  <input name="fontstretch" type="text" value="normal" size="12" maxlength="16" /><br /><br />
-->

Letter-spacing (normal, .9em, -.05cm): 
<input name="letterspacing" type="text" value="normal" size="7" maxlength="12" /><br />

Line height (normal, 1.5, 22px, 150%): <input name="lineheight" type="text" value="normal" size="7" maxlength="12" /><br /><br />

Headings (with Styles?): &nbsp; <input name="headings" type="radio" value="y" />Yes &nbsp; <input name="headings" type="radio" value="n" checked="checked" />No &nbsp; <input name="headings" type="radio" value="0" />None<br /><br />

Table (with border?): &nbsp; <input name="border" type="radio" value="1" checked="checked" />Yes &nbsp; <input name="border" type="radio" value="0" />No<br /><br />

<?php
/////////////// If there is Arabic content, a text box will be created for each field with such content to allow the user to choose how wide the field should be (since the Arabic is smaller).//////////////////
//////Fix: Allow naming of the field differently for Persian? Allowing any column to be resized would probably be most consistent with this project's aim to not make arbitrary decisions on what should be customizable, but rather make as much as possible customizable. It may also be helpful for Chinese, etc.

if ($arabiccontent !== "") {
	for ($i = 0; $i<$arabiccontent; $i++) {
		print <<<HERE
		Width of Arabic column: <input name="arw$i" type="text" value="" size="7" maxlength="12" />
HERE;
	} // end for (each Arabic field needing a column)
} // end if (if there is any Arabic content at all)
?>

<?php
//////////// Add hidden fields and finish the table and page //////////////////
?>

<input name="levels" type="hidden" value="<?php echo $levels; ?>" />
<input name="file" type="hidden" value="<?php echo $file; ?>" />

<input name="fields_name1" type="hidden" value="<?php echo $fields_name1; ?>" />
<input name="fields_name2" type="hidden" value="<?php echo $fields_name2; ?>" />
<input name="fields_name3" type="hidden" value="<?php echo $fields_name3; ?>" />

<input name="fields_name7" type="hidden" value="<?php echo $fields_name7; ?>" />
<input name="fields_name8" type="hidden" value="<?php echo $fields_name8; ?>" />
<input name="fields_name9" type="hidden" value="<?php echo $fields_name9; ?>" />
<input name="heading" type="hidden" value="<?php echo $heading; ?>" />

</td></tr></table></blockquote>

<p align="center"><input type="submit" value="Go" /></p>
</form>
