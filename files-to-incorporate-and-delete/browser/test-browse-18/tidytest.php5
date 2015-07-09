<?php

$is_php5 = true;

$caching_off = true; // flag to turn caching off!!!!
require('/home/bahai/inc_files/basics.php5');
header('Content-Type: text/html; charset=UTF-8');


$query = "select * from \$catalogue where id >= 0 and id <= 100"; // title_this regexp '.*\<.*'

$t = 1;
$config = array(
'force-output' => true
, 'output-xhtml' => true
, 'clean' => true
, 'quote-nbsp' => false
, 'show-body-only'=> true
, 'char-encoding' => 'utf8'
, 'input-encoding' => 'utf8'
, 'output-encoding' => 'utf8'
, 'wrap' => 0

, 'bare' => true
, 'decorate-inferred-ul' => true
, 'doctype' => 'strict'
, 'drop-proprietary-attributes' => true
, 'enclose-block-text' => true
, 'enclose-text' => true
, 'literal-attributes' => true
, 'logical-emphasis' => true
, 'numeric-entities' => true
, 'word-2000' => true
); // 'output-xhtml' => true, 'show-body-only'=> true, 'clean' => true, 
// $config = array('clean' => true);
// $config["show-body-only"]=true;
// ????: add-xml-space, input-xml, merge-divs, output-xml, accessibility-check

$pre = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head>'."\n".'<title>Title</title></head><body><table 
bgcolor="#000000"><tr><td>text</td></tr></table>
'; // <html><head>
$post = "</body></html>";

$text = <<<HERE
<a href=http://cnn.com>CNN</a>
HERE;
$totaltext = $pre.$text.$post;
print $totaltext;

	$tidy = new tidy;
	$tidy->parseString($totaltext, $config, 'utf8');
	print tidy_error_count($tidy);
	print tidy_warning_count($tidy);
	print $tidy->errorBuffer;
	exit;
	
print "<table style='vertical-align:top;' border='1'>";
foreach ((array) $db_blo->get_results($query) as $row) {
	unset($tidy);
	$tidy = new tidy;
	$tidy->parseString($pre.$row->NOTES.$post, $config, 'utf8');
	if ((tidy_error_count($tidy) >= 0 || tidy_warning_count($tidy) >= 0) && $row->NOTES != '') { //  && $t == 1
//	if ($row->NOTES != '') {
		print "<tr><td>".$row->NOTES."</td><td>"; // <br /><hr /><br />\n\n";

		print "update catalogue_bznew set notes='".$db_blo->escape(trim(tidy_repair_string($pre.$row->NOTES.$post, $config, "utf8")))."' WHERE id = '{$row->id}'"."</td><td>"; // ."<br /><hr /><br />\n\n";
//		print htmlentities($row->NOTES)."<br /><hr /><br />";
//		print htmlentities(trim(tidy_repair_string($row->NOTES, $config, "utf8")));
		$error = $tidy->errorBuffer;
//		if ($error !== "line 1 column 1 - Warning: inserting missing 'title' element" && $error != '') {
/*
		&& $error !== "line 1 column 1 - Warning: missing <!DOCTYPE> declaration
line 1 column 1 - Warning: plain text isn't allowed in <head> elements
line 1 column 1 - Warning: inserting missing 'title' element"
*/
			print "<td>".tidy_config_count($tidy).':'.$row->id.$row->TITLE_THIS;
			print " failed"."</td><td>";
			print $error.htmlentities($tidy->errorBuffer)."</pre>\n\n"."</td></tr>"; // <pre>
//			break;
			$t++;
//		}
		
//		break;
	}
	elseif (tidy_error_count($tidy) > 0) {
		$t++;
	}
	// print tidy_is_xhtml($tidy)."<br />";
} // end foreach
print "</table>";
print $t;
print "<br />end";
?>