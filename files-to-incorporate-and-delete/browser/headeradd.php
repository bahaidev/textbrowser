<?php
// Requires a constant to be defined already (in the calling script)

if( defined( 'HAVEACCESS' ) ) {

$xhtmlbasic1 = $_GET['xbasic1'];
//$iframescript = file_get_contents("iframe.js");

// See also browse9.php
if (strstr($_SERVER['HTTP_USER_AGENT'], "Firefox")) {
	$id3 = "ifr_name";
} // end if
else { // Needs to be different from name in Safari at least
//	$id3 = "ifr_name+'id'";
	$id3 = "ifr_name";
} // end else


$iframescript = <<<HERE
		<script type="text/javascript">
			// <![CDATA[

// When getting an object's location property, it seems one must get it via an eval and then (possibly necessary to convert toString()?) and then replace the ampersand with $amp; (and also when including URL's (such as those taken from the hidden textboxes for keeping back/forward history here) within a call to a change of location)
			
// If choose iframe's name and id as the same, can run iframeheight change; but causes problems for Safari (not Firefox)

// Following var and function adapted from http://developer.mozilla.org/en/docs/DOM:window.open
var WindowObjectReference = null; // global variable

function openRequestedPopup(strUrl, strWindowName, ifr_name, backw) {

  if(WindowObjectReference == null || WindowObjectReference.closed) {
    WindowObjectReference = window.open(strUrl, strWindowName,
           "resizable=yes,scrollbars=yes,status=yes");
  }
  else {
    WindowObjectReference.focus();
  };

	if (backw) {
		var backdata = document.getElementById(ifr_name+'b').innerHTML;
	}
	else {
		var backdata = document.getElementById(ifr_name+'f').innerHTML;
	}
	var b = /(http.*?)(?=;  )/g;
	var backlinks = "";
	var c = b.exec(backdata);
	
	// Could change the href into onclick in order to add JS to remove the link (and put back the plain text) for forward or forwardremaining; however, the back history might not be modifiable here
	while (c != null) {
		backlinks += "<a target='"+ifr_name+"' href='"+c[0]+"'>"+c[0]+"<\/a><br />";
		c = b.exec(backdata);
	}
	if (backw) {
		var title = "Back History of the";
	}
	else {
		var title = "Forward Remaining for the";
	}
	
	WindowObjectReference.document.writeln("<h1>"+title+" frame with id "+ifr_name+"<\/h1><p>"+backlinks+"<\/p>");
	// Note to self: can't seem to write (in Safari at least) without being within HTML tags
	
}



function changesrc(id, data) {
 document.getElementById(id).setAttribute('src', data);
}

function forwardbutton(ifr_name) {
	document.getElementById(ifr_name+'backtext').style.display='none';
	document.getElementById(ifr_name+'back').style.display='inline';
	document.getElementById(ifr_name+'backhisttext').style.display='none';
	document.getElementById(ifr_name+'backhist').style.display='inline';

	var locat = eval('window.frames.'+ifr_name+'.document.location');

	var reglocat = new RegExp('&', "g");
	locat = locat.toString();
	locat = locat.replace(reglocat, '&amp;');
	
	var backtempa = eval("document.getElementById('"+ifr_name+"b').innerHTML");
	var reglocatb = new RegExp('&', "g");
	backtempa = backtempa.toString();
	backtempa = backtempa.replace(reglocatb, '&amp;');
	eval("document.getElementById('"+ifr_name+"b').innerHTML='"+locat+";  ;"+backtempa+"';");

	var a = document.getElementById(ifr_name+'f').innerHTML;
	var b = new RegExp('^(.*?)(;  ;)');
	var c = b.exec(a);
	
		// The following fixes a break (bug?) in Firefox (important for wiki pages using &action= which would otherwise break)
	var c2 = c[1];
	var regc = new RegExp('&amp;', "g");
	c2 = c2.replace(regc, '&');
	
	var d = a.replace(b, '');
	document.getElementById(ifr_name+'f').innerHTML = d;
	if(d === '') {
		document.getElementById(ifr_name+'forward').style.display='none';
		document.getElementById(ifr_name+'forwardtext').style.display='inline';
		document.getElementById(ifr_name+'forwremaining').style.display='none';
		document.getElementById(ifr_name+'forwremainingtext').style.display='inline';
	}
	eval('window.frames.'+ifr_name+'.document.location=c2');
}

function urlbackadd(ifr_name) {
	// Could fix url var below to eliminate f.php?f=, but this would make the back/forward text fixing in the first part of this function unnecessary and would create problems for the back button (though not for auto-snapback if that were uncommented).
	var locat = eval('window.frames.'+ifr_name+'.document.location');
	
	var reglocat = new RegExp('&', "g");
	locat = locat.toString();
	locat = locat.replace(reglocat, '&amp;');

	var backtempa = eval("document.getElementById('"+ifr_name+"b').innerHTML");
	var reglocatb = new RegExp('&', "g");
	backtempa = backtempa.toString();
	backtempa = backtempa.replace(reglocatb, '&amp;');
	eval("document.getElementById('"+ifr_name+"b').innerHTML='"+locat+";  ;"+backtempa+"';");

	document.getElementById(ifr_name+'f').innerHTML = "";
	document.getElementById(ifr_name+'backtext').style.display='none';
	document.getElementById(ifr_name+'back').style.display='inline';
	document.getElementById(ifr_name+'forward').style.display='none';
	document.getElementById(ifr_name+'forwardtext').style.display='inline';
	document.getElementById(ifr_name+'forwremaining').style.display='none';
	document.getElementById(ifr_name+'forwremainingtext').style.display='inline';
	
	//document.getElementById(ifr_name+'s').innerHTML=locat; // Auto-sets snap-back to last visit before URL (may want to comment this line out in order to preserve any previously (manually) set-by-the-user snap-backs)
	var url = window.prompt('Enter a URL for this frame', 'http://'); // May need to restart Safari if this is not working!

	var urlexp = /^http:\/\/(www\.){0,1}bahai9\.com/;
	var urltest = urlexp.test(url);

	if (url !== null && url !== "") {
		if (urltest) {
			changesrc({$id3}, url);
		}
		else {
			changesrc({$id3}, 'f.php?f='+url);
		}
	} // end if


//	changesrc({$id3}, url);
//	eval('window.frames.'+ifr_name+'.document.location=c[1]');
}

function backbutton(ifr_name) {
	document.getElementById(ifr_name+'forwardtext').style.display='none';
	document.getElementById(ifr_name+'forward').style.display='inline';
	document.getElementById(ifr_name+'forwremainingtext').style.display='none';
	document.getElementById(ifr_name+'forwremaining').style.display='inline';
	
	var locat = eval('window.frames.'+ifr_name+'.document.location');

	var reglocat = new RegExp('&', "g");
	locat = locat.toString();
	locat = locat.replace(reglocat, '&amp;');

	var forwtempa = eval("document.getElementById('"+ifr_name+"f').innerHTML");
	var reglocatb = new RegExp('&', "g");
	forwtempa = forwtempa.toString();
	forwtempa = forwtempa.replace(reglocatb, '&amp;');
	eval("document.getElementById('"+ifr_name+"f').innerHTML='"+locat+";  ;"+forwtempa+"';");

// Fix:! Need to fix frmdoce.location in fixlinks to replace &'s?
// "javascript:parent.document.getElementById('"+ifr_name+"b').innerHTML='"+frmdoce.location+";  ;'+parent.document.getElementById('"+ifr_name+"b').innerHTML";

	
//	document.getElementById(ifr_name+'f').innerHTML=locat+';  ;'+document.getElementById(ifr_name+'f').innerHTML;
	var a = document.getElementById(ifr_name+'b').innerHTML;
	var b = new RegExp('^(.*?)(;  ;)');
	var c = b.exec(a);

	// The following fixes a break (bug?) in Firefox (important for wiki pages using &action= which would otherwise break)
	var c2 = c[1];
	var regc = new RegExp('&amp;', "g");
	c2 = c2.replace(regc, '&');
	
	var d = a.replace(b, '');
	document.getElementById(ifr_name+'b').innerHTML = d;
	if(d === '') {
		document.getElementById(ifr_name+'back').style.display='none';
		document.getElementById(ifr_name+'backtext').style.display='inline';
		document.getElementById(ifr_name+'backhist').style.display='none';
		document.getElementById(ifr_name+'backhisttext').style.display='inline';
	}
	eval('window.frames.'+ifr_name+'.document.location=c2');
}

function fixlinks(ifr_name) {

 setIframeHeight(ifr_name);
//document.links.length // 700 // 2500

	var frmdoce = eval('window.frames.'+ifr_name+'.document');

 for (var j = 0; j < frmdoce.links.length; j++) {

// Fix: Should add something here for area maps... 
		var z = frmdoce.body.getElementsByTagName('a')[j].getAttribute('href');
		frmdoce.body.getElementsByTagName('a')[j].setAttribute('href', "javascript:void(0)");
		
		var reglocat = new RegExp('&', "g");
		locat = frmdoce.location.toString();
		locat = locat.replace(reglocat, '&amp;');

		var abc = "javascript:parent.document.getElementById('"+ifr_name+"b').innerHTML='"+locat+";  ;'+parent.document.getElementById('"+ifr_name+"b').innerHTML;parent.document.getElementById('"+ifr_name+"backtext').style.display='none';parent.document.getElementById('"+ifr_name+"back').style.display='inline';parent.document.getElementById('"+ifr_name+"forward').style.display='none';parent.document.getElementById('"+ifr_name+"forwardtext').style.display='inline';parent.document.getElementById('"+ifr_name+"backhisttext').style.display='none';parent.document.getElementById('"+ifr_name+"backhist').style.display='inline';parent.document.getElementById('"+ifr_name+"forwremaining').style.display='none';parent.document.getElementById('"+ifr_name+"forwremainingtext').style.display='inline';";


// If move this to fix links?, then won't change d as it should
		var toslash = /^http:\/\/bahai9\.com\/f\.php\?f=http.+?\..+?%2F/;
		slashtest = toslash.test(z);
		if (slashtest) {
			z = z.replace(toslash, "");
		} // end if
		var slashexp = /^%2F/; // If begins with slash
		var slashbegin = slashexp.test(z);
		

		var a = new RegExp('^http');

		var b = /^http:\/\/(www\.){0,1}bahai9\.com/;
		var c = /^http:\/\/(www\.){0,1}bahai9\.org/;
		var d = a.test(z);
		var e = b.test(z);
		var f = c.test(z);
		var y = frmdoce.location;
		var g = new RegExp('bahai9\.com/f\.php');
		var h = g.test(y);


/*		var toslash = new RegExp('^http://bahai9\.com/f\.php\?f=http.+?%2F');
		var fromslash = ztest.replace(toslash, "");
		var slashexp = new RegExp('^%2F'); // If begins with slash
		var slashbegin = slashexp.test(fromslash);
*/

/*		var slashy = toslash.test(z);
		if (slashy) {
			console.debug("Z (link) %s", z);
			console.debug("Z-fromslash (link) %s", fromslash);
		} // end if
		var slashbegin = toslash.test(z);
*/


		
		var ystring = eval('window.frames.'+ifr_name+'.document.location');
		var ystring = y.toString();				
		ystring = ystring.replace(reglocat, '&amp;');



		if ((!e && !f && d) || h) { // If a link begins with http but not bahai9.com OR current page is proxy of bahai9.com, then proxify it
//			var xyz = "parent.document.getElementById('"+ifr_name+"s').innerHTML='"+ystring+"';parent.document.getElementById('"+ifr_name+"snaptext').style.display='none';parent.document.getElementById('"+ifr_name+"snap').style.display='inline';"; // Uncomment if want snap-back to auto-occur when such links as these are clicked; also fix below
			var xyz = ""; // This is just a dummy for the above (but necessary to avoid errors below in Firefox)
			
			var def = "http://bahai9.com/f.php?f=";
//			z = encodeURIComponent(z);

			var za = /^http:\/\/bahai9\.com\/f\.php\?f=/;
			z = z.replace(za, 'f.php?f=');


			if (!d) { // I.e., the current page is a proxy and the link doesn't begin with http;



				var ya = new RegExp('^http://bahai9\.com/f\.php\?f=');
//				var ya = new RegExp('http');
				ystring = ystring.replace(ya, 'f.php?f=');

//			var reglocat = new RegExp('&', "g"); // Commented out since defined above


				if (slashbegin) {
					console.debug("Z %s", z);
					var slashregexp = new RegExp('(^f\.php\?f=http)([^.]+?)(\.)([^%/]+?)');
					ystring = ystring.replace(slashregexp, '$1$2$3$4');
					console.log("YstringLOG: %s", ystring);
					console.debug("Ystring: %s", ystring);

				} // end if
				/*
				else if (ystring.charAt(ystring.length - 1) != "/") { // If the last character of the current (proxy) page is not a slash, make it a slash
					ystring = ystring+"/";
				} // end elseif
				*/
				abc = abc+xyz+"window.location='"+ystring+z+"';";
			}
			else {
				if (h) { // I.e., the current page is a proxy (with links already with f.php?...) and the link begins with http
					abc = abc+xyz+"window.location='"+z+"';";
				} // end if
				else { // Link begins with http but not bahai9.com (and current page is not a proxy)
					abc = abc+xyz+"window.location='"+def+z+"';";
				}
			}
		}
		else {
			abc = abc+"window.location='"+z+"';";		
		}

		frmdoce.body.getElementsByTagName('a')[j].setAttribute('onclick', abc);
	} // end for
} // end function fixlinks


function getDocHeight(doc) {
	var docHeight = 0;
	var sclHeight, offHeight;
	if (doc.height) docHeight = doc.height;
	else if (doc.body) {
		if (doc.body.scrollHeight) {
			docHeight = doc.body.scrollHeight;
			sclHeight = true;
		} // end if
		if (doc.body.offsetHeight) {
			docHeight = doc.body.offsetHeight;
			offHeight = true;
		} // end if
		if (sclHeight && offHeight) {
			docHeight = Math.max(doc.body.scrollHeight, doc.body.offsetHeight);
		} // end if
	} // end else if
	return docHeight;
}

function setIframeHeight(iframeName) {
	var iframeElem = document.getElementById ? document.getElementById(iframeName) : document.all ? document.all[iframeName] : null;
	if (window.frames[iframeName] && iframeElem) {
		iframeElem.style.height = "auto";
		var docHeight = getDocHeight(window.frames[iframeName].document);
		if (docHeight) iframeElem.style.height = docHeight + 45 + "px";
	} // end if
} // end function setIframeHeight



			// ]]></script>
HERE;

// The following adds the headers for an XHTML document
// Explorer doesn't accept the XHTML header, so allow an else condition for it.
// Javascript type needed for XHTML validation since this script has Javascript.
// Fix: Add media attribute to styles?
function headerAdd($charset, $default_language, $title, $titledir, $script="", $style="", $metatags="", $styleadd="", $bodyload="") {
	global $globalscript, $navwidth;
	global $outputtypes, $outputmode, $outputtypecount, $browseresultsfile, $browserfile;
	global $strings, $langu, $file;
	global $languagestable, $localedb, $host, $dbuser, $passw;
	global $no_tables;
	global $xhtmlbasic1;
	global $iframescript;
	global $table_data_table, $linkrelprevs, $linkrelnexts;
	global $author;
	$linktitle = str_replace('"', "'", $title);
	$fileurl = urlencode($file);
	$langcodeurl = urlencode($lang_code);
	
	
	$navwidth = $navwidth-3; // Needed to shrink the width a little to allow for the drop-down menu to fit in the nav bar
// Can remove the second clause from the "if" here if the header can only be xhtml

	if ((!stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) || ($metatags == "html")) {
		header("Content-type: text/html; charset=$charset");
	} // end if (if the browser can accept xhtml header)
	else {
		header("content-type: application/xhtml+xml; charset=$charset");
	} // end else (browser cannot accept xhtml header)
	header ("Content-Script-Type: text/javascript");

		$navwidth = "width: ".$navwidth."%";
		$style2 = <<<HERE
\n				.navmenu {float: left;}
				.navigator {float: left; border-width: thin; border-style: solid; $navwidth}
				.navigatorhead {width: 100%; border-width: thin; border-style: solid;}
				.breadcrumbs {clear: both;}
HERE;


	if ($style == "" || $styleadd) {
		$style .= <<<HERE
				$style2
				.XHTML {text-align: center;}
				.paypal {text-align: center;}
				.abouttext {width:55%; margin: auto;}
				.subverseselection {text-align:center;}
				.langs {text-align: center;}

				.removecookies {text-align: right;}
				.writings {text-align: center;}

				.fileheading {text-align: center;}
				.toggleradio {text-align: center; margin: auto;}

				fieldset {border-style: none;}
				fieldset.verseselection {text-align: center; margin: auto;}

				.uncheckbutton {text-align: center; padding: 5px; clear:both;}

				.mainbox {border-style: double; margin: auto; }
				.mainbox {vertical-align: top;}
				.fieldtable {padding: 10px;}
				.fields {border-style: none; vertical-align: top;}
				.fieldoptions {width:20px; text-align:left;}
				.fields, .fieldoptions {padding: 5px;}
				h3.formattingoptions {text-align: center;}
				div.fields {float:left; margin:auto;}
				div.fieldoptions {float:left; margin:auto;}
				div.fieldrow {clear:both;}
				.submit {text-align: center; clear:both;}
				div.fieldtable {position:absolute; left:0px; width:250px;}
HERE;
		if ($no_tables) {
			$style .= <<<HERE
				div.formattingoptions {margin-left:100px; }
				div.fieldtitle {position:absolute; margin-left:75px}
HERE;
		}
	} // end if (if there is no specified style, add the above)
	else {
		$style .= $style2;
	} // end else

// Can remove all the "if"'s here if the header can only be xhtml (just rejoin the xhtml header (in the "else") with the Javascript meta afterwards)

	$keywords = <<<HERE
{$strings['browserfile']}, {$strings['metakeywords']}, {$strings['Book']}, {$strings['tableheading'][$file]}, {$strings['tablealias'][$file]}, $file
HERE;

	// In "link", change stylesheet to "alternate stylesheet" or add a title for a preferred (but not required) sheet; could also add a "media=": http://www.w3.org/TR/REC-html40/types.html#type-media-descriptors
	// Shouldn't hard-code type as xhtml
	$metakeywords = <<<HERE

		<meta name="keywords" xml:lang="$langu" content="$keywords" />
		<meta name="description" xml:lang="$langu" content="{$strings['metadescription']}" />
		<meta name="author" content="$author" />		
		<link href="/dr_mainstyles.css" rel="stylesheet" type="text/css" />
HERE;

	// Find current file name
	$path = htmlentities($_SERVER['PHP_SELF']); // Get the current file (encapsulated by htmlentities for security)
	$pattern = "/\/([^\/]*)$/"; // Pattern to obtain everything after the last slash (i.e., the file)
	$pathpieces = preg_match($pattern, $path, $filematch); // Get the pattern ($filematch[1])

	mysql_select_db($localedb, mysql_connect($host, $dbuser, $passw));
	$languagestable = addslashes($languagestable);	
	$query = "SELECT charset, direction as lang_direction, code as lang_code, name as lang_name FROM `$languagestable`";
	$result = mysql_query($query);

	if ($metatags == "" || $metatags == "html") {
		if ($metatags == "html") {
			$metatype = "html";
			$metacontenttype = "text/html";
		} // end if (if metatags are defined as "html")
		else {
			$metacontenttype = "application/xhtml+xml";
		} // end else (metatags otherwised assumed to be xhtml by default)

		while ($row = mysql_fetch_assoc($result)) {
			// $lang_direction = $row['lang_direction']; // Don't need here
			$lang_code = urlencode($row['lang_code']);
			$lang_name = $row['lang_name'];
			$lang_name = addslashes($lang_name);
			// $charset2 = $row['charset']; // If use this, change $charset in $metakeywords to $charset2
			if ($lang_code != $langu) {
				$metakeywords .= <<<HERE
\n		<link title="$linktitle ($lang_name)"
			dir="$titledir"
			type="$metacontenttype"
			rel="alternate"
			charset="$charset"
			hreflang="$lang_code"
			href="{$filematch[1]}?langu=$langcodeurl&amp;file=$fileurl" />
HERE;
			} // end if
		} // end while

		$metatags .= <<<HERE

		<meta http-equiv="content-type" content="$metacontenttype; charset=$charset" />
HERE;
		
		// Add Javascript type content metatag
		$metatags .= <<<HERE

		<meta http-equiv="Content-Script-Type" content="text/javascript" />
HERE;
	} // end if (if there are no predefined metatags sent to the function)

	$metatags .= $metakeywords;

	$linkmedia = "";
	// Fix: Add in option here for XHTML Basic, media="all" (for all documents, not only browse9.php)
	
	//print $outputtypecount."-".$outputmode;
	
	if ($filematch[1] === $browseresultsfile) {
		for ($j=0; $j<$outputtypecount; $j++) {
			if ($outputtypes[$j] !== $outputmode) {
				$linkmedia .= <<<HERE
\n		<link media="all" title="$linktitle ($outputtypes[$j])"
			type="$metacontenttype"
			rel="alternate"
			href="{$filematch[1]}?langu=$langcodeurl&amp;file=$fileurl&amp;outputmode={$outputtypes[$j]}" />
HERE;
			} // end if
		} // end for
		if ($outputmode !="") {
				$linkmedia .= <<<HERE
\n		<link media="screen" title="$linktitle (table/normal)"
			type="$metacontenttype"
			rel="alternate"
			href="{$filematch[1]}?langu=$langcodeurl&amp;file=$fileurl" />
HERE;
		} // end if
		$metatags .= $linkmedia;
	} // end if
	
	// Add Index, Glossary, Appendix for browse.php as relevant
	// Add Chapter, Section, Subsection for browse9.php as relevent

	$linkrels = "";
	$helpfile = "help.php";
	$readmefile = "readme.php";
	
	if ($filematch[1] !== $helpfile) {
			$linkrels .= <<<HERE
\n		<link rel="Help" title="{$strings['Help']}"
			type="application/xhtml+xml"
			href="$helpfile?langu=$langu" />
HERE;
	} // end if

	if ($filematch[1] !== $readmefile) {
			$linkrels .= <<<HERE
\n		<link rel="Copyright" title="{$strings['Readme']}"
			type="application/xhtml+xml"
			href="$readmefile?langu=$langu" />
HERE;
	} // end if

	if ($filematch[1] !== $browserfile || $langu != "") {
		$linkrels .= <<<HERE
\n		<link rel="Start" title="{$strings['Langs']}"
			type="application/xhtml+xml"
			href="{$browserfile}?removecookies=yes" />
HERE;
	} // end if
	//  Took out the following since it can't read it without a cookie anyhow: || $langu == ""
	if ($filematch[1] !== $browserfile) {
		$linkrels .= <<<HERE
\n		<link rel="Contents Bookmark" title="{$strings['Books']}"
			type="application/xhtml+xml"
			href="$browserfile?langu=$langu" />
HERE;
	} // end elseif

	$file = addslashes($file);
	$table_data_table = addslashes($table_data_table);

	// Fix: Shouldn't entirely be able to hide all breadcrumbs data, as may need it for links here if user opts not to see the breadcrumbs, etc.; also would allow $filematch to be turned into (global) $matches (i.e., wouldn't need to repeat this pattern match)
	
	// Fix: Add to links too
	// Fix: Do RDF of Dublin Core (investigate OWL for future tagging purposes--add to todos)

	$metatags .= $linkrels;

	$metatags .= $linkrelprevs;
	$metatags .= $linkrelnexts;
	
// Would this work? <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
//    "http://www.w3.org/TR/html4/strict.dtd">
// Are the style comments ok for HTML?

// This was even too strict for the poor SQL HTML
// <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
//    "http://www.w3.org/TR/html4/loose.dtd">

// This was too outdated to support some of the elements I'm using:
// <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2//EN">

	if ($bodyload) {
		$bodyload = " onload='".$bodyload."'";
	}

	if ($metatype == "html") {
		print <<<HERE
<html lang="$default_language">
	<head>$metatags
		<title dir="$titledir">{$title}</title>
		$script
		$iframescript
		<script type="text/javascript" src="iframe.js"></script>
		$globalscript
		<style type="text/css">
			/*<![CDATA[*/
				$style
			/*]]>*/
			</style></head>
	<body $onload>
\n\n\n
HERE;
	} // end if (if metatags are HTML)

	else {
		print "<?xml version=\"1.0\" encoding=\"$charset\" standalone=\"no\"?>\n";
		if ($xhtmlbasic1) {
			print "<"."?xml-stylesheet type=\"text/xml\" href=\"xhtmlbasic1.xsl\"?".">";
		} // end if
		print <<<HERE
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="$default_language">
	<head>$metatags
		<title dir="$titledir">{$title}</title>
		$script
		$iframescript
		<style type="text/css">
			/*<![CDATA[*/
				$style
			/*]]>*/</style></head>
	<body $bodyload>
\n\n\n
HERE;

	} // end else (if metatags are XHTML)
} // end headerAdd function

} // end if defined HAVEACCESS
?>