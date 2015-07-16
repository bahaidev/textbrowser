<?php

// Fix: It seemed duplicates inserts were occurring in some cases

	/////////////////// Get list of databases (must have user access to each one desired)... /////////////////
		$assistantmode = true; // Used in conjunction with access.php but have since commented out the relevant lines in access.php as they should probably not be used as this file was in fact intended to localize writingsdb, etc.; however, they were used to avoid bugs from showing up (at least notifications) when this file was required by assistant.php5; I haven't yet tested what the bugs were when this file was included
		foreach ((array) $db_blo->get_col('SHOW DATABASES;') as $dbname) {
			
			require($req_dir.'access.php'); // Retrieving this again since the variable dbname has just been defined (and dbsNotToIgnore depends on it)		

			if ($dbsNotToIgnore) {

				$query2 = "SHOW TABLES FROM \$dbname";
				
				foreach ($db_locale->get_col($query2, 0) as $table_name) {

					$query3 = "SELECT \$lang_code, \$defaultlanguage, stringkey, tablekey, fieldkey, localization_id FROM `\$localetable` WHERE `tablekey`='\$table_name' AND `stringkey`='tableheading' ORDER BY localization_id";
					$query3b = "SELECT \$lang_code, \$defaultlanguage, stringkey, tablekey, fieldkey, localization_id FROM `\$localetable` WHERE `tablekey`='\$table_name' AND `stringkey`='tablealias' ORDER BY localization_id";

					$skipinsert = 0; // Not really necessary here, but...
					foreach ($db_locale->get_results($query3) as $row3sub) {
						if ($currentrowtest == $row3sub->tablekey) { // Could add a condition that $row3sub->$defaultlanguage != "" , but if an entry exists in the SQL table without a default, this is already a problem.
							 $skipinsert = 1;
						} // end if (if the table is the same as one of the localized table headings, set a variable to skip the insert below)
					} // end foreach (finding a tableheading amidst the languages)

					if (!$skipinsert) {
						$insert_command = "INSERT INTO `\$localetable` SET `\$defaultlanguage` = '\$table_name', `stringkey`='tableheading', `tablekey`='\$table_name'";
						
						if ($edit_pass == $passw) {
							$smarty->assign('insert_command1', $insert_command);
						} // if the editor is the administrator, show the insert commands
					} // end if (if content to be included (not skipped) because it is not already in localization, add it)
					$skipinsert = 0;

					foreach ($db_locale->get_results($query3b) as $row3bsub) { // If the table alias exists in the default
						if ($currentrowtest == $row3bsub->tablekey) {
							$skipinsert = 1;
						} // end if (if the table is the same as one of the localized table aliases, set a variable to skip the insert below)
					} // end foreach (finding a tablealias amidst the languages)

					if (!$skipinsert) {
							$insert_command = "INSERT INTO `\$localetable` SET `\$defaultlanguage` = '\$table_name', `stringkey`='tablealias', `tablekey`='\$table_name'";	

							if ($edit_pass == $passw) {
								$smarty->assign('insert_command2', $insert_command);
							} // if the editor is the administrator, show the insert commands
					} // end if (if content to be included (not skipped) because it is not already in localization, add it)

					$skipinsert = 0;


					$query4 = "SELECT * FROM `\$table_name`";
					$query5 = "SELECT \$lang_code, \$defaultlanguage, stringkey, tablekey, fieldkey, localization_id FROM `\$localetable` WHERE `tablekey`='\$table_name' AND `stringkey`='fieldshortcut' ORDER BY localization_id";

					$db_blo->get_results($query4);
					$num_fields = $db_blo->num_cols;
					for ($i = 0; $i < $num_fields; $i++) {
						$a = $db_blo->get_col_info('name', $i);

						foreach ($db_locale->get_results($query5) as $row3) {
							if ($a == $row3->fieldkey) {
								$skipinsert = 1;
							} // end if (if the table and field are the same as one of the localized fieldshortcuts, set a variable to skip the insert below)
						} // end foreach (finding a fieldkey amidst the languages)

						if (!$skipinsert) {
							$insert_command = "INSERT INTO `\$localetable` SET `\$defaultlanguage` = '\$a', `stringkey`='fieldshortcut', `tablekey`='\$table_name', `fieldkey`='\$a'";
							$insert_result = $db_locale->query($insert_command);
							if ($edit_pass == $passw) {
								$smarty->assign('insert_command3', $insert_command);
							} // if the editor is the administrator, show the insert commands
						} // end if (if content to be included (not skipped) because it is not already in localization, add it)
					} // end for (going through all the fields)
				} // end foreach (of all the tables)
			} // end if (if database is not "test" or the locale database)
		} // end foreach (of all the databases)

?>