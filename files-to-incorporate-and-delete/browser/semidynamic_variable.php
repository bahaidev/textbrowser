<?php
if( defined( 'HAVEACCESS' ) ) {

// Get the variables with the same prefix submitted before it (as POST or GET)
// Called by require('semidynamic_variable.php');
// Define previous to the require statment the following: 
// 		$semidynamic_variable = array ( , , , 0) // for GET
//		$semidynamic_variable = array ( , , , 1) // for POST
// Needs a $variable, $begin, $length, $post in $semidynamic_variable[] array format


// Define variables to be used in for loop
	$variable = $semidynamic_variable[0];
	$begin = $semidynamic_variable[1];
	$length = $semidynamic_variable[2];
	$post = $semidynamic_variable[3];

	for ($k = $begin; $k < $length; $k++) {
		$redone_variable = $variable.$k;
		if ($post) {
			$$redone_variable = $_POST["$redone_variable"];
		} // end if (if defining POST variables)
		else {
			$$redone_variable = $_GET["$redone_variable"];
		} // end else (if defining GET variables)

	} // end for loop to assign an indefinite number of variables with the same prefix

} // end if defined HAVEACCESS
?>