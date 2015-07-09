<?php


$host = 'bahai-library.com'; // Change this if your SQL host is not onsite; You could also change this to 'bahai-library.com' if you wanted to access the Bah??site's contents (read only)
$dbuser = 'brett'; // Fill in your MYSQL user here; If you want to access the Bah??site (read only), add 'bahai_public'
$passw = ''; // Fill in your password here; Also leave it blank (as is) for the Bah??site


$link = mysql_connect($host, $dbuser, $passw)
   or die('Could not connect!: ' . mysql_error());
echo 'Connected successfully';
mysql_select_db('bahai_locales') or die('Could not select database');

// Performing SQL query
$query = "SELECT * FROM localization where stringkey = 'and'";
$result = mysql_query($query) or die('Query failed: ' . mysql_error());

while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
   foreach ($line as $col_value) {
       echo "\t\t$col_value\n";
   }
   echo "\t<br />\n";
}


print "hello, Brett";
// phpinfo();

?>