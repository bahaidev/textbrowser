<!--

/////////////// Intended significant future features of this browse system:///////////
// 1. Searching
// 2. Go to previous/next results (allow customization of size on the fly as well as in preferences)
// 3. Hide advanced formatting options (make savable in preferences)
// 4. Give tooltips to tell how to use the elements
// 5. Make full preferences system for saved/favorite, recent searches/browses, etc.
// 6. Baha'i texts: Coordination with official Baha'i World Centre XML (using TEI) if full XML is released to automatically (and periodically) parse their texts into SQL here to ensure we have the most up-to-date and corrected translations
// 7. Automated word-by-word translations, auto-links to Google, Amazon, etc.
// 8. Auto-links by verse to relevant forums, wikis, blogs, or personal notes pertaining to a given verse...
// 9. Allow tables to be resortable via a Javascript which allows sorting by multiple columns with various data, etc.
// 10. Figure out how to get rowspans (or even colspans) for additional columns (e.g., a field spanning by whole pages of the Iqan and another field spanning only by paragraphs) - use some kind of counter and don't display the HTML until finished cycling??; also figure out how to reassemble if the minute fields are not needed (e.g., if the user only wants to see the text by paragraph and not anything related to by page)
// 11. Allow data to be displayed interlinearly if desired or horizontally
// 12. Localization of the interface (including column aliases, etc.)
// 13. Allow combined fields for browsing (Collins)
// 14. Separate formatting
///////////////// Intended minor features /////////////////
// 1) Add link color (browse.php and browse9.php) as option to advanced formatting
/////////////////
///////////////// Intended tweaks //////////////////
// Todo: //
// 1) Especially those variables that will be accessed by other scripts, it would make more sense (and take less space) to use an SQL database to store them rather than pass them between forms via hidden elements, etc. (there are a number of these)
// 2) Add Password, etc. into transcluded inc file to avoid duplication between files in the coding here - if truly duplicated)
// 3) Upload newer Collins and fix any bugs in formatting.
// 4) The base code of browse0.php, browse.php, browse9.php are all XHTML compliant, but there are a good number of invalid XHTML in the SQL databases Qur'an and Bible (links w/o quotes) that need to be replaced as well as the XHTML and link locations in the Iqan copy

-->
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>

<script src="jml.js"></script>
<script>
document.title = "Sacred Writings Browser";

jml('div', {style: 'text-align:center'}, [
    ['div', ["Choose the Writings you wish to browse"]],
    ['br'],
    ['select', {id: 'file', {$on: {change: function () {
        // Submit
    }}}} [
        // Todo
    ]],
    ['p', [
        ['input', {value: "Go"}]
    ]]
]);

</script>

<?php

/////////////////// Get list of databases... (For some reason, I don't believe this worked when I had additional databases though I would think it should/////////////////

$db_list = mysql_list_dbs(mysql_connect($host, $dbuser, $passw));

while ($row = mysql_fetch_object($db_list)) {
	$dbname = $row->Database;
	if (!mysql_connect($host, $dbuser, $passw)) {
		echo 'Could not connect to mysql';
		exit;
	} // end if (could not connect)

/////////////////// Show a drop-down menu of the tables (i.e., the books) for each database (so far just one database)...//////////////////////////////////

	$sql = "SHOW TABLES FROM $dbname";
	$result = mysql_query($sql);

	while ($row2 = mysql_fetch_row($result)) {

	// sort ($result); // Don't seem to need to add this?...

/////////////////// New Book Add: Add more to the following "if" as necessary (tables (books) that shouldn't be added to the Sacred Writings section)--it would be better to add these tables to a different database (if possible), but for now I am hard-coding it://///////////////

		if ($row2[0] !== "Collins" && $row2[0] !== "Leiden") {

/////////////////New Book Add: Add aliases for Sacred Writings here/////////////////

			switch ($row2[0]) {
				case "iqan": $alias = "Kit&aacute;b-i-&Iacute;q&aacute;n"; break;
				case "quran": $alias = "Qur'&aacute;n"; break;
				case "peace": $alias = "Promise of World Peace"; break;
				case "aqdas": $alias = "Kit&aacute;b-i-Aqdas"; break;
				default: $alias = ""; break;
			} // end switch of aliases of Scriptures 
			if ($alias != "") {
				print <<<HERE
				<option value="$row2[0]">$alias</option>
HERE;
			} // end if (if there is an alias)

			else {
				print <<<HERE
				<option value="$row2[0]">$row2[0]</option>
HERE;
			} // end else (if there is no alias)

		} // end if (if the table/book is Scriptural)

	} // end while (of all the tables being added to the drop-down menu)

/// Todo: Need to move (to end of document?) to allow the Writings database not to need to be hard-coded...

} // end while (of all the databases)


///////////////// Further menu tags /////////////////

print <<<HERE
	</select>
	<p align="center"><input type="submit" value="Go" /></p>
	</form>
HERE;


print <<<HERE
	</td></tr><tr><td align="center"><br /><br />Or, choose one of the following: <br /><br />

	<form action="browse.php" method="get" name="browse2">

	<select name="file" id="file2" size="1" onchange="javascript:document.browse.submit();">
HERE;


///////////////// Second drop-down menu (here hard-coded for the specific database I am using/////////////////


/// Todo: See previous fix-- should be FROM $dbname instead?
$sql2 = "SHOW TABLES FROM $hardcodeddb";
$result2 = mysql_query($sql2);

while ($row3 = mysql_fetch_row($result2)) {

///////////////// New Book Add: Add items to this "if" as necessary (tables (books) that shouldn't be added to the Sacred Writings section)--it would be better to add these tables to a different database (if possible), but for now I am hard-coding it://///////////////

	if ($row3[0] == "Collins" || $row3[0] == "Leiden") {

/////////////////// New Book Add: Add aliases for non-Scriptures here/////////////////

		switch ($row3[0]) {
			case "Collins": $alias = "Collins bibliography"; break;
			case "Leiden": $alias = "Leiden"; break;
			default: $alias = ""; break;
		} // end switch of aliases of non-Scriptures

		if ($alias != "") {
			print <<<HERE
				<option value="$row3[0]">$alias</option>
HERE;
		} // end if (if there is an alias)

	} // end if (if the table/Book is non-Scriptural)

	else {
	} // end else (if there is no alias for the non-Scriptural item--so far all items need an alias)

} // end while (of all the tables being added to the drop-down menu)

?>


</body>
</html>