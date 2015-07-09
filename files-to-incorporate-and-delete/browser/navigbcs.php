<?php

include("breadcrumbs.php");
$bc_nv_print = $navprint;
if ($bcprint !="") {
	$bc_nv_print .= "<p><br /></p>".$bcprint;
} // end if
elseif ($navigatoryes && !$breadcrumbs) {
	$bc_nv_print .= "<p><br /></p>";
}

?>