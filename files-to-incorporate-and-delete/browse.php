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