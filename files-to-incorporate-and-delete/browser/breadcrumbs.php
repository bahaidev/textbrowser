<?php

// Fix: Could probably replace checkBreadcrumbs with built-in array_search function

// Preprocessing for Next/Prev in Link rel
function get_output($NextPrev, $file, $linkhref, $linktitle, $getdata="") {
	global $table_data_table;
	global $localedb, $host, $dbuser, $passw;
	global $merged;
	global $browseresultsfile;
	
	$outputhtmltype = "application/xhtml+xml";
	if ($linkhref == $browseresultsfile) {
		mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
		$query2 = "SELECT `table_name`, `outputhtml` FROM $table_data_table WHERE table_name = '$file'";
		$result2 = mysql_query($query2);

		// $tableoutput = array();
		while ($row = mysql_fetch_assoc($result2)) {
			$outputhtmltype = $row['outputhtml'];
			if ($outputhtmltype == 1) {
				$outputhtmltype = "text/html";
			} // end if
			// $table_name = $row['table_name'];
			// $tableoutput[$table_name] = $outputhtml; // (Would be used for going through all files)
			// {$tableoutput[$table_name]} (would put into link type)
		} // end while (finding table's details)
	} // end if (if the file is to display the results)
	
	$linkrels .= <<<HERE
\n		<link rel="$NextPrev" title="$linktitle"
			type="$outputhtmltype"
			href="$linkhref$getdata" />
HERE;
	return $linkrels;

} // end function get_output
	

// Adds a menu or a site map
function add_menu($navprint, $menu, $filestrings, $filetextdir, $files, $gets="", $gets2="", $hierarchy="", $tooltips="", $subitems=1, $main3name="", $main4name="") {

	global $main3, $main3dir, $main3tooltip, $main4, $main4dir, $main4tooltip, $strings, $textdir;

//	array_walk($files, create_function('', ''));

	$filecount = count($files);

	if ($strings[$hierarchy] != "" && $menu) {	
			$navprint .= <<<HERE
\n\t<optgroup label="{$strings[$hierarchy]}" dir="{$textdir[$hierarchy]}">
HERE;
	} // end if
	elseif (!$menu) {
		$navprint .= "<ul>";
	}
	$v=0;
	$w=0;
	for ($j=0; $j < $filecount; $j++) {
		if ($tooltips[$j] != "") {
			$tooltip = "title=\"".$tooltips[$j]."\"";
		} // end if
		else {
			$tooltip = "";
		} // end else

		$r=0;
		if ($gets[$v][0] != "") {
			$getdata = "?".$gets[$v][0]."=".$gets[$v][1];
			$r++;
		} // end if
		else {
			$getdata = ""; // Needed for resetting if for loop starts over and $gets is blank this time
		} // end else
		if ($r < 1 && $gets2[$v][0] != "") {
			$getdata = "?".$gets2[$v][0]."=".$gets2[$v][1];
		} // end if
		elseif ($r >=1 && $gets2[$v][0] != "") {
			$getdata .= "&amp;".$gets2[$v][0]."=".$gets2[$v][1];
		} // end elseif
		$v++;
		
		if ($menu) {
			$navprint .= <<<HERE
\n\t\t<option value="{$files[$j]}$getdata" dir="{$filetextdir[$j]}">{$filestrings[$j]}</option>
HERE;
		} // end if
		else {
			$filestrings = preg_replace('/^RSS$/', '<acronym title="Really Simple Syndication">RSS</acronym>', $filestrings);
			$navprint .= <<<HERE
\n\t\t<li><a href="{$files[$j]}$getdata" $tooltip dir="{$filetextdir[$j]}">{$filestrings[$j]}</a></li>
HERE;
		} // end else
		
		if ($menu != 1 && $j==1) {
			if ($menu) {
				if ($subitems) {
					for ($m=0; $m < 2; $m++) {
						$navprint .= <<<HERE
\n\t\t<option value="{$main4[$m]}$getdata" dir="{$main4dir[$m]}">{$main4name[$m]}</option>
HERE;
					} // end for
				} // end if
			} // end if
			else {
				if ($subitems) {
					$main4name = preg_replace('/^RSS$/', '<acronym title="Really Simple Syndication">RSS</acronym>', $main4name);
					if ($w == 0) {
						$navprint .= "<li><ul>";
					} // end if
					for ($m=0; $m < 2; $m++) {
						if ($main4tooltip != "") {
							$tooltip4 = "title='".$main4tooltip[$m]."'";
						} // end if
						else {
							$tooltip4 = "";
						} // end else
						$navprint .= <<<HERE
\n\t\t<li><a href="{$main4[$m]}$getdata" $tooltip4 dir="{$main4dir[$m]}">{$main4name[$m]}</a></li>
HERE;
					} // end for
					$navprint .= "</ul></li>";
				} // end if
			} // end else
		} // end if
		elseif ($menu !=1 && (($j==3) || ($j==4))) {
			if ($menu) {
				if ($subitems) {
					$navprint .= <<<HERE
\n\t\t<option value="{$main3[$w]}$getdata" dir="{$main3dir[$w]}">{$main3name[$w]}</option>
HERE;
				} // end if
			} // end if
			else {
				$main3name = preg_replace('/^RSS$/', '<acronym title="Really Simple Syndication">RSS</acronym>', $main3name);
				if ($main3tooltip != "") {
					$tooltip3 = "title='".$main3tooltip[$w]."'";
				} // end if
				else {
					$tooltip3 = "";
				} // end else
				if ($subitems) {
					$navprint .= "<li><ul>";
				} // end if
				if ($subitems) {
					$navprint .= <<<HERE
\n\t\t<li><a href="{$main3[$w]}$getdata" $tooltip3 dir="{$main3dir[$w]}">{$main3name[$w]}</a></li>
HERE;
				} // end if
				if ($subitems) {
					$navprint .= "</ul></li>";
				} // end if
			}	// end else
			$w++;
		} // end elseif
		
	} // end for

	if ($strings[$hierarchy] != "" && $menu) {	
		$navprint .= "</optgroup>";
	} // end if
	elseif (!$menu) {
		if ($subitems) { // $j != $filecount-1) && 
			$navprint .= "</ul>";
		} // end if
		else {
			$navprint .= "</ul>";
		} // end else
	} // end elseif
	return $navprint;	
} // end function add_menu


// Joins arrays together
function merge() {
	$numargs = func_num_args();
	$newarray = array();
	$arg_list = func_get_args();
	for ($i = 0; $i < $numargs; $i++) {
		$newarray = array_merge($newarray, $arg_list[$i]);
	} // end for
	return $newarray;
} // end function merge

// Removes duplicates from a multidimensional array
function remove_dups($array, $index) {
	$array_count = count($array);
	$array_count_inner = count($array[$index]);
	for ($i=0; $i<$array_count_inner; $i++) {
		for ($j=$i+1; $j<$array_count_inner; $j++) {
			if ($array[$index][$i]==$array[$index][$j]) {
				for ($k=0; $k<$array_count; $k++) {
					unset($array[$k][$i]);
				} // end for	
			} // end if
		} // end for	
	} // end for
	return $array;
} // end function remove_dups

// Check to see if current file ($matches[1]) is in the specified page array (whether a mere listing or a hierarchy)
function checkBreadcrumbs($pgs, $matches) {
	$count = count($pgs);
	for ($i=0; $i < $count; $i++) {
		if ($matches[1] == $pgs[$i]) {
			return $i+1; // Ensure it is always positive
		} // end if (if any item in the $pgs array matches the file ($matches[1]), indicate that there is a match)
	} // end for (going through page array)
	return 0;
} // end function checkBreadcrumbs

function drawBreadcrumbs($matches, $separator, $others_in_hierarchy, $pgs, $names, $pgsdirs, $tooltips, $fixed="", $fixedname="", $fixeddir="", $fixedtooltip="", $mainsw="", $mainswname="", $mainswdir="", $mainswtooltip="", $gets="", $gets2="", $duplicate="") {
	global $bcprint, $linkrelprevs;
	
	$count = count($pgs);
	for ($i=0; $i < $count; $i++) {
		if ($matches[1] == $pgs[$i]) {
			$rank = $i;
			
			if ($duplicate != "") {
			}
			else {
				break; // just make this break?
			}
		} // end if
	} // end for
	
	$bcprint .= "\n<div class='breadcrumbs'> &nbsp; &nbsp; &nbsp; &nbsp;";

	if ($fixed != "") { // Makes links for a list of fixed sequential items always mandatory to that category (if any)
		$countall = count($fixed);
		for ($j=0; $j < $countall; $j++) {
			if ($fixedtooltip[$j] != "") {
				$tooltip = "title=\"".$fixedtooltip[$j]."\"";
			} // end if
			else {
				$tooltip = "";
			} // end else
			$bcprint .= <<<HERE
\n<a class="breadcrumbs" dir="{$fixeddir[$j]}" href="{$fixed[$j]}" $tooltip>{$fixedname[$j]}</a>
<span class="breadcrumbs">$separator</span>
HERE;
			if ($j == ($countall-1)) {
				$linkrelprevs = get_output("Prev", $pgs[$rank], $fixed[$j], $fixedname[$j]);
			} // end if
		} // end for
	} // end if
	
	if ($others_in_hierarchy==1) {
		$v=0;
		for ($i=0; $i < $rank; $i++) {
			$r=0;
			if ($tooltips[$i] != "") {
				$tooltip = "title=\"".$tooltips[$i]."\"";
			} // end if
			else {
				$tooltip = "";
			} // end else

			if ($gets[$v][0] != "") {
				$getdata = "?".$gets[$v][0]."=".$gets[$v][1];
				$r++;
			} // end if
			else {
				$getdata = ""; // Needed for resetting if for loop starts over and $gets is blank this time
			} // end else
			if ($r < 1 && $gets2[$v][0] != "") {
				$getdata = "?".$gets2[$v][0]."=".$gets2[$v][1];
			} // end if
			elseif ($r >=1 && $gets2[$v][0] != "") {
				$getdata .= "&amp;".$gets2[$v][0]."=".$gets2[$v][1];
			} // end elseif
			$v++;
			$bcprint .= <<<HERE
\n<a class="breadcrumbs" dir="{$pgsdirs[$i]}" href="{$pgs[$i]}$getdata" $tooltip>{$names[$i]}</a>
<span class="breadcrumbs">$separator</span>
HERE;
			if ($i == ($rank-1)) {
				$linkrelprevs = get_output("Prev", $pgs[$rank], $pgs[$i], $names[$i], $getdata);
			} // end if
		} // end for
	} // end if

	if ($mainsw[$rank] != "") {
		$tooltip = "title=\"".$mainswtooltip[$rank]."\"";
		$bcprint .= <<<HERE
\n<a class="breadcrumbs" dir="{$mainswdir[$rank]}" href="{$mainsw[$rank]}" $tooltip>{$mainswname[$rank]}</a>
<span class="breadcrumbs">$separator</span>
HERE;
		$linkrelprevs = get_output("Prev", $pgs[$rank], $mainsw[$rank], $mainswname[$rank], "");

	} // end if

	// Get ready to print the name of the current page (no need for a link)
	$bcprint .= <<<HERE
<span class="breadcrumbs" dir="{$pgsdirs[$rank]}">{$names[$rank]}</span>
HERE;
	$bcprint .= "</div>";
	return 1;

} // end drawBreadcrumbs



// Get current language and file (Text Browser site-specific requirements)
$langu = $_GET['langu'];

if ($langu == "" || $langu==NULL) {
	$langu = $_COOKIE['ck_language'];
	// Should it be? $langu = $ck_language;
	if ($langu == "" || $langu==NULL) {
		$langu = $defaultlanguage;
	} // end if (if langu is still blank, give it the value of the default language)
} // end if (if there is no GET value passed, assume it is the value of any existing cookie; in "headerpreptoadd.php", if the cookie is still blank, it will assign the default language value)


$file = $_GET['file'];

// Find current file name
$path = htmlentities($_SERVER['PHP_SELF']); // Get the current file (encapsulated by htmlentities for security)
$pattern = "/\/([^\/]*)$/"; // Pattern to obtain everything after the last slash (i.e., the file)
$pathpieces = preg_match($pattern, $path, $matches); // Get the pattern ($matches[1])

$breadcrumbs = $_GET['bcs'];
$navigatoryes = $_GET['navgat'];

if ($matches[1] != $browseresultsfile && $breadcrumbs == "") {
	$breadcrumbs = 1;
} // end if
if ($matches[1] != $browseresultsfile && $navigatoryes == "") {
	$navigatoryes = 1;
} // end if

$separator = " > "; // Defines the separator to appear in the breadcrumbs

if ($file == "") {$tablealiastooltip = $strings['Book'];}
// Checks for appropriate table (book) name (Text Browser specific); used in the tooltip for the browser pages below
else {
	if ($strings["tablealias"][$file] != "") {
		$tablealiastooltip = $strings["tablealias"][$file];
	} // end if
	else {
		localize(); // Go for the defaults
		if ($strings["tablealias"][$file] != "") {
			$tablealiastooltip = $strings["tablealias"][$file];
		} // end if
		else {
			$tablealiastooltip = $file;
		} // end else
		unset($strings);
		unset($textdir);
		localize(1); // Go back to the localization for the user's choice of language
	} // end else
} // end else

// The following are filenames (e.g., $browserfile is browse.php)--and should be without folder specifications (since $match[1] which it will be called against, will only be a file). These filenames are listed as variables here since the Text Browser software allows customization by the administrator in another location of the script of these particular files
$browserpgs = array($browserfile, $browserfile, $browsetextfile, $browseresultsfile);
//$browsernames = array ('Langs', 'Books', 'Book', 'Results');
$browsernames = array ($strings['Langs'], $strings['Books'], $tablealiastooltip, $strings['Results']); // Before had $strings['Book'] instead of $tablealiastooltip
// Sets the tooltips 
$browserdirs = array ($textdir['Langs'], $textdir['Books'], $textdir['Book'], $textdir['Results']);
$tooltips = array($strings["resetinterfacelang"], $langu, $tablealiastooltip, $tablealiastooltip." ".$strings['Results']);

// Provides the GET parameters to be added to the file name; they are separated here in order to make it possible to run a comparison with the $_SERVER['PHP_SELF'] extracted file name on the file name without these GET parameters
// Associative arrays wouldn't work below since duplicate values would be skipped over
$gets = array(
	array('removecookies', 'yes'),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu))
);
$gets2 = array(
	array('', ''),
	array('', ''),
	array('file', urlencode($file)),
	array('file', urlencode($file))
);


// Defines an enumerated list of possible pages just under the language choice and which serve as Navigation bar items
$mainpgnames = array ($strings['Books'], $strings['Download'], $strings['Accessibility'], $strings['Vision'], $strings['News'], $strings['Help'], $strings['Sitemap'], $strings['About']);	
// $mainpgnames = array ('Books', 'Download', 'Accessibility', 'Vision', 'News', 'Help', 'About');
$mainpgs = array ($browserfile, 'download.php', 'accessibility.php', 'vision.php', 'news.php', 'help.php', 'sitemap.php', 'about.php');
$mainpgtooltips = array ($langu, $langu, $langu, $langu, $langu, $langu, $langu, $langu); // Used in Navigation bar, but not breadcrumbs
$mainpgdirs = array ($textdir['Books'], $textdir['Download'], $textdir['Accessibility'], $textdir['Vision'], $textdir['News'], $textdir['Help'], $textdir['Sitemap'], $textdir['About']);	

// Fixes "Lang" as preceding all of the main page names (Navigation Bar items)
$fixed = array ($browserpgs[0]."?".$gets[0][0]."=".$gets[0][1]);
$fixedname = array ($browsernames[0]);
$fixedtooltip = array ($tooltips[0]);
$fixeddir = array ($browserdirs[0]);

// Fixes the GET items to be added (these are primarily used by the Navigation Bar, since Breadcrumbs normally doesn't add links to any of the files)
// Could add: if ($langu=="") {$langu=$defaultlanguage;}
$getsmain = array(
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu))
);
$gets2main = array(
	array('', ''),
	array('', ''),
	array('', ''),
	array('', ''),
	array('', ''),
	array('', ''),
	array('', ''),
	array('', '')
);

// Defines an enumerated list of possible pages under both the language choice level as well as under a specific main page/navigation page item (specifically Vision or News)
$main3 = array ('goals.php', 'rss.php'); // The RSS file is only included for Site Map, etc. purposes, as breadcrumbs, navigation bar, and meta data cannot legitimately be included within an RSS file
$main3name = array ($strings['Goals'], $strings['RSS']);
$main3dir = array ($textdir['Goals'], $textdir['RSS']);
$main3tooltip = array ($langu, $langu);

$getsmain3 = array(
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu))
);
$gets2main3 = array(
	array('', ''),
	array('', '')
);

// Adds the corresponding preceding item (Vision or News)
$main3switch = array ($mainpgs[3], $mainpgs[4]);
$main3switchname = array ($mainpgnames[3], $mainpgnames[4]);
$main3switchtooltip = array ($mainpgtooltips[3], $mainpgtooltips[4]);
$main3switchdir = array ($mainpgdirs[3], $mainpgdirs[4]);
// Also uses $fixed above to add the Lang link


// Defines an enumerated list of possible pages under both the language choice level as well as under Download
$main4 = array ('readme.php', 'administrator_documentation.php');
//$main4name = array ('Readme', 'Administrator Documentation');
$main4name = array ($strings['Readme'], $strings['Administrator Documentation']);
$main4dir = array ($textdir['Readme'], $textdir['Administrator Documentation']);
$main4tooltip = array ($langu, $langu);

$getsmain4 = array(
	array('langu', urlencode($langu)),
	array('langu', urlencode($langu))
);
$gets2main4 = array(
	array('', ''),
	array('', '')
);

// Fixes "Lang" and "Download" as preceding all Download subfiles (Readme and Admin. Documentation)
$fixed4 = array ($browserpgs[0]."?".$gets[0][0]."=".$gets[0][1], $mainpgs[1]."?".$getsmain[1][0]."=".$getsmain[1][1]);
$fixed4name = array ($browsernames[0], $mainpgnames[1]);
$fixed4tooltip = array ($tooltips[0], $langu);
$fixed4dir = array ($browserdirs[0], $mainpgdirs[1]);

// Joined (alphabetical) items
$pgnames = merge($browsernames, $mainpgnames, $main3name, $main4name);
$pgdirs = merge($browserdirs, $mainpgdirs, $main3dir, $main4dir);
$pgpgs = merge($browserpgs, $mainpgs, $main3, $main4);
$pggets = merge($gets, $getsmain, $getsmain3, $getsmain4);
$pggets2 = merge($gets2, $gets2main, $gets2main3, $gets2main4);
$pgtooltips = merge($tooltips, $mainpgtooltips, $main3tooltip, $main4tooltip);
$pgdata = array($pgnames, $pgdirs, $pgpgs, $pggets, $pggets2, $pgtooltips);
$pgdata = remove_dups($pgdata, 0);
array_multisort($pgdata[0], $pgdata[1], $pgdata[2], $pgdata[3], $pgdata[4], $pgdata[5]);
$merged = $pgdata;

//////////// The following creates the navigation bar ////////////

if ($navigatoryes) {
	$navprint .= "\n<div class='navigatorhead'>\n\t";
	$v=0;
	$totalcells = count($mainpgnames);
	for($i=0; $i<$totalcells; $i++) {
		$r=0;
		if ($getsmain[$v][0] != "") {
			$getdatamain = "?".$getsmain[$v][0]."=".$getsmain[$v][1];
			$r++;
		} // end if
		else {
			$getdatamain = ""; // Needed for resetting if for loop starts over and $gets is blank this time
		} // end else
		if ($r < 1 && $gets2main[$v][0] != "") {
			$getdatamain = "?".$gets2main[$v][0]."=".$gets2main[$v][1];
		} // end if
		elseif ($r >=1 && $gets2main[$v][0] != "") {
			$getdatamain .= "&amp;".$gets2main[$v][0]."=".$gets2main[$v][1];
		} // end elseif
		$v++;
		
		if ($mainpgs[$i]==$matches[1]) {
			$navprint .= "<div class=\"navigator\" dir='{$mainpgdirs[$i]}'>".$mainpgnames[$i]."</div>";
		} // end if
		else {
			if ($mainpgtooltips[$i] !="") {
				$tooltip1 = "title='".$mainpgtooltips[$i]."'";
			} // end if (if tooltips are not blank (i.e., a language has had time to be set), make a title
			$navprint .= <<<HERE
<div class="navigator" dir='{$mainpgdirs[$i]}'><a $tooltip1 href="$mainpgs[$i]$getdatamain">$mainpgnames[$i]</a>
			</div>
HERE;
		} // end else
	} // end for

/*
	$navprint .= <<<HERE
\n<form action="redirect2.php" id="navmenu" method="post"><div class="navigator"><p class="navmenu"><select name="navbar" id="navbar" onchange="javascript:this.form.submit();" size="1" dir="{$textdir['Books']}">
<option selected="selected" value="">{$strings['chooseapage']} ({$strings['hierarchical']}ly)</option>
HERE;

	$navprint = add_menu($navprint, 1, $browsernames, $browserdirs, $browserpgs, $gets, $gets2, "Books", "", 1, $main3name, $main4name);
	$navprint = add_menu($navprint, 2, $mainpgnames, $mainpgdirs, $mainpgs, $getsmain, $gets2main, "Main pages", "", 1, $main3name, $main4name);

	$navprint .= <<<HERE
</select>
	<input type="submit" value="{$strings['submitgo']}" dir="{$textdir['submitgo']}" />
	</p>
	</div></form></div>\n
HERE;
*/

	$navprint .= <<<HERE
\n<form action="redirect2.php" id="navmenu2" method="post"><div class="navmenu2"><select class="navmenu" name="navbar2" id="navbar2" size="1" onchange="javascript:this.form.submit();" dir="{$textdir[$merged[0][0]]}">
<option selected="selected" value="">{$strings['chooseapage']} ({$strings['alphabetical']})</option>
HERE;

	$navprint = add_menu($navprint, 1, $merged[0], $merged[1], $merged[2], $merged[3], $merged[4], "", "", 0, $main3name, $main4name);

	$navprint .= <<<HERE
</select>
	<input class="navmenu" type="submit" value="{$strings['submitgo']}" dir="{$textdir['submitgo']}" />
	
	</div></form></div>\n
HERE;
	unset($v);
	unset($r);
} // end if (if there is to be a navigator)
////////////  End of Navigation bar ////////////

if ($alphsite && $hiersite) {
	$sitemapprint .= "\n<div style='margin-left: 30%;'>";
}

if ($alphsite) {
	
	$sitemapprint .= "\n\t<div style='float: left;'>\n\t\t<div style='font-weight: bold;'>".ucfirst($strings['alphabetical'])." ".$strings['sitemap'].":</div>";

	$sitemapprint = add_menu($sitemapprint, 0, $merged[0], $merged[1], $merged[2], $merged[3], $merged[4], "", $merged[5], 0, $main3name, $main4name);
	$sitemapprint .= "</div>";
	// May need to "clear:both;" in a div to get rid of the float?
} // end if


if ($hiersite) {
// Makes a site menu
	$sitemapprint .= "\n\t<div style='float: left; padding-left:50px;'>\n\t\t<div style='font-weight: bold;'>".ucfirst($strings['hierarchical'])." ".$strings['sitemap'].":</div>";

	$sitemapprint .= "<ul><li>".$strings['Books']."</li><li style='list-style-type:none;'>";
	$sitemapprint = add_menu($sitemapprint, 0, $browsernames, $browserdirs, $browserpgs, $gets, $gets2, $strings['Books'], $tooltips, 0, $main3name, $main4name);
	$sitemapprint .= "</li></ul><ul><li>".$strings['Main pages']."</li><li style='list-style-type:none;'>";
	$sitemapprint = add_menu($sitemapprint, 0, $mainpgnames, $mainpgdirs, $mainpgs, $getsmain, $gets2main, $strings['Main pages'], $mainpgtooltips, 1, $main3name, $main4name);
	$sitemapprint .= "</li></ul>";
	$sitemapprint .= "</div>";
} // end if

if ($alphsite && $hiersite) {
	$sitemapprint .= "</div>";
}

if ($navigatoryes) {
	$navbar_noscript = "<noscript>
	<p class='noscript' dir='{$textdir['noscriptonchange']}'>{$strings['noscriptonchange']}</p>
</noscript>";
} // end if (if there is a navigator)

// book dupl.

//// the following checks the various arrays of file listings, and if there is a match, it draws the breadcrumbs according to the structural requirements of files of that type (within a given array)

// "1" in $others_in_hierarchy denotes there are others in the hierarchy


if ($breadcrumbs) {

	$checkbreadcs = checkBreadcrumbs($browserpgs, $matches);
	if ($checkbreadcs) { // checks if the page is one of the browser hierarchy
		drawBreadcrumbs($matches, $separator, 1, $browserpgs, $browsernames, $browserdirs, $tooltips, '', '', '', '', '', '', '', '', $gets, $gets2, $langu);

/*
// Attempts a "Next" link for browserpages; Since can't predict the exact choice, unless all choices are listed, this is nott possible (the set-up would need to be fixed for GET data anyhow)
		if ($browserpgs[$checkbreadcs] != "" && $browserpgs[$checkbreadcs] != NULL) {
			if ($gets2[$checkbreadcs][0] != "") {
				$getsparttwo = "&amp;".$gets2[$checkbreadcs][0]."=".$gets2[$checkbreadcs][1];
			} // end if
			$linkrelnexts = get_output("Next", $browserpgs[$checkbreadcs-1], $browserpgs[$checkbreadcs], $browsernames[$checkbreadcs], "?".$gets[$checkbreadcs][0]."=".$gets[$checkbreadcs][1].$getsparttwo);
		} // end if
*/

	} // end if

	else {

		$checkbreadcs2 = checkBreadcrumbs($mainpgs, $matches);
		if ($checkbreadcs2) { // checks if the page is one of the main (navigator) pages
			drawBreadcrumbs($matches, $separator, 0, $mainpgs, $mainpgnames, $mainpgdirs, $tooltips, $fixed, $fixedname, $fixeddir, $fixedtooltip);

			if (($checkbreadcs2 - 1) == 3) {
				$linkrelnexts = get_output("Next", $mainpgs[$checkbreadcs-1], $main3[0], $main3name[0], "?".$getsmain3[0][0]."=".$getsmain3[0][1]);
			} // end if
			elseif (($checkbreadcs2 - 1) == 4) {
				$linkrelnexts = get_output("Next", $mainpgs[$checkbreadcs-1], $main3[1], $main3name[1], "?".$getsmain3[1][0]."=".$getsmain3[1][1]);
			} // end elseif
		} // end if

		elseif (checkBreadcrumbs($main3, $matches)) { // checks if the page is goals or rss (i.e., under vision or news)
			drawBreadcrumbs($matches, $separator, 0, $main3, $main3name, $main3dir, $tooltips, $fixed, $fixedname, $fixeddir, $fixedtooltip, $main3switch, $main3switchname, $main3switchdir, $main3switchtooltip);
		} // end elseif

		elseif (checkBreadcrumbs($main4, $matches)) { // checks if the page is readme or admin.docum (i.e., under downloads)
			drawBreadcrumbs($matches, $separator, 0, $main4, $main4name, $main4dir, $main4tooltip, $fixed4, $fixed4name, $fixed4dir, $fixed4tooltip);
		// $main4, $main4name, $main4tooltip
		} // end elseif
	} // end else

} // end if (if breadcrumbs to be added)

$totalcells = count($mainpgnames);
$navwidth = 100/($totalcells);

?>