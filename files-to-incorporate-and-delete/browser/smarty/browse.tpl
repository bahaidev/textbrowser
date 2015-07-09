{* PHP functions: chr,  add modifier*}
{* FYI: The {$table}, {$tr}, {$td} tags are being dynamically created so that the script could alternatively display the page with divs, etc. for people with visual disabilities. At present, out of necessity, we have to have PHP send the "<" as we cannot have these opening tags be embedded with the more clear <{$table}  etc.>, due to a bug in smarty: http://www.phpinsider.com/smarty-forum/viewtopic.php?p=32428#32428 *}

{doc_raw target="css"}
	#pageformat {text-align: right}
	#pageformat {float: right}


	.navmenu {float: left;}
	.navigator {float: left; border-width: thin; border-style: solid; width: 9.5%}
	.navigatorhead {width: 100%; border-width: thin; border-style: solid;}
	.breadcrumbs {clear: both;}
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
{/doc_raw}

{doc_raw target="code"}

				function changeObjectVisibility2(classN, newDisplay, cell1) {
				    // get a reference to the cross-browser style object and make sure the object exists
					var x = document.getElementById('fieldlist').rows;

					for (var i=0; i < x.length; i++) {
						    var styleObject = x[i].cells[5].style;
						    if(styleObject) {
								if (styleObject.display != 'none') {
									newDisplay = 'none';
								}
								else {
									newDisplay = 'inline';
								}
								styleObject.display = newDisplay;
							}
						    var styleObject = x[i].cells[4].style;
						    if(styleObject) {
								if (styleObject.display != 'none') {
									newDisplay = 'none';
								}
								else {
									newDisplay = 'inline';
								}
								styleObject.display = newDisplay;
							}
						    var styleObject = x[i].cells[3].style;
						    if(styleObject) {
								if (styleObject.display != 'none') {
									newDisplay = 'none';
								}
								else {
									newDisplay = 'inline';
								}
								styleObject.display = newDisplay;
							}
					}
//					return true;
				} // changeObjectVisibility2
{/doc_raw}

{doc_info code="switch.js"}

{capture assign=changevisib}javascript:changeObjectVisibility('pageformat', 'options', '{$initialshowhide}');{/capture}{* changeObjectVisibility2('css', '{$initialshowhide}', '4');changeObjectVisibility2('search', '{$initialshowhide}', '5'); *}
{if $script_yes_flag && !$initialshowhide}{doc_info body="$changevisib"}{/if}

{if $noscript_flag}
<!--// Noscript (for those without a scriptable browser) -->
<noscript>
	<p class="noscript" dir="{$textdir.noscriptuncheck}">{$noscriptuncheck} {$noscriptonchange}</p></noscript>
{/if}

{include file='header.tpl'}
{include file='head1.tpl'}

<!--// Header 2 (Login, etc.) -->
	<div class="loginlinks">
{include file='login_links.tpl'}
</div>
<!--// Main heading -->

<div><br /></div>
<form action="{$browseresultsfile}" method="get" id="browse">
	<div class="fileheading">
		<div class="empty20col">&#160;</div>
		<h2 class="fileheading width60col" dir="{$headerdirection}">{$heading}</h2>
		<div class="empty_clear_col"></div>
		</div>
	<div><br /></div>

	<!--// Verse selection -->
	<fieldset class="verseselection focus">
		<legend>{$verse_selection}</legend>
			<label accesskey="{$printversecounter++|chr}" dir="{$textdir.fullinputbox}" for="fullinput">{$fullinputbox}: </label>
			<input dir="{$textdir.fullinput}" title="{$fullinput}" value="{$fullinput_value}-{$fullinput_value2}{$or_input}" id="fullinput" name="fullinput" type="text" size="45" />
			<p dir="{$textdir.or}">{$or}:</p>


{section name=options loop=$max_arr_all}

	{if !$smarty.section.options.first}
		<div class="subverseselection"><br /><span dir="{$textdir.or}">{$or}:</span><br /><br /></div>
	{/if}

		<fieldset class="subverseselection" dir="{$textdir.numbersonly}" title="{$numbersonly} {$max_arr_all[options].verse_end_opt}">

	{section name=verses loop=$max_arr_all[options]}
{if $max_arr_all[options][verses].fields_name != ""}
			<label accesskey="{$printversecounter++|chr}" dir="{$max_arr_all[options][verses].textdirec}" for="{$max_arr_all[options][verses].level}{$max_arr_all[options][verses].option_no}">{$max_arr_all[options][verses].fields_name}</label>: 
			<input dir="{$max_arr_all[options][verses].textdir_maxmin}" title="{$max_arr_all[options][verses].strings_maxmin}: {$max_arr_all[options][verses].maxmin}" value="{$max_arr_all[options][verses].value}" id="{$max_arr_all[options][verses].level}{$max_arr_all[options][verses].option_no}" name="{$max_arr_all[options][verses].level}{$max_arr_all[options][verses].option_no}" type="text" size="7" /> &#160; 
{/if}

{if $smarty.section.verses.iteration eq (($smarty.section.verses.total-1)/2)}

			<div style="font-weight: bold;" class="subverseselection" dir="{$textdir.to}">{$to}:</div>

{/if}

	{/section}
</fieldset>
{/section}


{if $toggle_flag}

	<!--// Toggle options -->
{* Fix: Could be made to loop through more than 2 toggles, if stored that way *}
{* Fix: This and subsequent increases of the printversecounter may need to be limited in case for some reason all of the verse entries (and options and radio toggle buttons) add up to more than 26 (letters in the alphabet). *}

{if $hideshow_flag}
{capture assign=hideshownone}onkeypress="javascript:hideshowObject('groupbytoggle', 'none')" onclick="javascript:hideshowObject('groupbytoggle', 'none')"{/capture}
{capture assign=hideshowinline}onclick="javascript:hideshowObject('groupbytoggle', 'inline')" onkeypress="javascript:hideshowObject('groupbytoggle', 'inline')"{/capture}
{/if}

	<div class="toggleradio" dir="{$textdir.tabletoggle1.$file}">
		<fieldset class="toggleradio">
			<input {$hideshownone} accesskey="{$printversecounter++|chr}" id="radio1" type="radio" name="toggle" value="{$toggle1}" />
			<label for="radio1" dir="{$textdir.tabletoggle1.$file}">{$tabletoggle1.$file}</label> &#160; 

			<input {$hideshownone} accesskey="{$printversecounter++|chr}" id="radio2" type="radio" name="toggle" value="{$toggle2}" />
			<label for="radio2" dir="{$textdir.tabletoggle2.$file}">{$tabletoggle2.$file}</label> &#160; &#160; 
			
			<input {$hideshowinline} accesskey="{$printversecounter++|chr}" id="radio3" type="radio" name="toggle" value="{$toggleall}" checked="checked" />
			<label for="radio3" dir="{$textdir.tabletoggleall.$file}">{$tabletoggleall.$file}</label></fieldset>

			<fieldset id="groupbytoggle" class="groupbytoggle">
				<span dir="{$textdir.groupbytoggle.$file}">{$groupbytoggle.$file}: </span> &#160;
				<input accesskey="{$printversecounter++|chr}" id="groupbytoggle1" name="gbt" type="radio" value="1" dir="{$textdir.yes}" checked="checked" />
				<label for="groupbytoggle1">{$yes}</label> &#160; 

				<input accesskey="{$printversecounter++|chr}" id="groupbytoggle2" name="gbt" type="radio" value="0" dir="{$textdir.no}"/>
				<label for="groupbytoggle2">{$no}</label> &#160; 
</fieldset></div>
{/if}

			<!--// Random option -->
			<div class="subverseselection"><br />
				<span dir="{$textdir.or}">{$or}:</span><br /><br />
				<fieldset id="rndfld" class="verseselection rnd">
					<span dir="{$textdir.rnd}">{$rnd}: </span> &#160;
					<input accesskey="{$printversecounter++|chr}" id="rnd1" name="rnd" type="radio" value="1" dir="{$textdir.yes}" />
					<label for="rnd1">{$yes}</label>
					<input accesskey="{$printversecounter++|chr}" id="rnd2" name="rnd" type="radio" value="0" dir="{$textdir.no}" checked="checked" />
					<label for="rnd2">{$no}</label></fieldset></div>
</fieldset>



	{$table} {$mainbox_summary} class="mainbox">
		{$tr} class="mainbox">

			<!--// Field options -->
			{$td} class="fieldtable" style="vertical-align:top">
				{$table} border="1" {$fields_summary} id="fieldlist" dir="{$textdir.fieldtablesummary}" class="fields tablefields">
					{$tr}>
						{$th} class="fieldnos" dir="{$textdir.fieldno}">{$fieldno}</{$thclose}>
						{$th} class="fieldoptions" title="{$field_enabled_tips}" dir="{$textdir.field_enabled}">{$field_enabled}?</{$thclose}>
						{$th} class="fieldtitle" title="{$field_title_tips}" dir="{$textdir.field_title}">{$field_title}</{$thclose}>
						{$th} class="fieldinterlin" title="{$fieldinterlin_tips}" dir="{$textdir.fieldinterlin}">{$fieldinterlin}</{$thclose}>
						{$th} class="fieldcss css" title="{$fieldcss_tips}" dir="{$textdir.fieldcss}">{$fieldcss}</{$thclose}>
						{$th} class="fieldsearch search" title="{$fieldsearch_tips}" dir="{$textdir.fieldsearch}">{$fieldsearch}</{$thclose}></{$trclose}>


{* /* Test
<tr><td style="text-align:left !important">
{php}
global $fld_str;
print "<pre>";
var_dump($fld_str);
print "</pre>";
{/php}
</td></tr> 
 */ *}


{section name=fields loop=$fieldnos}

					{$tr} class="fieldrow">

							{$td} class="fieldnos">{$fieldnos[fields]}</{$tdclose}>
							{$td} class="fieldoptions">
								<label {$enabled_accesskeys[fields]}for="option{$optfieldnos[fields]}" title="{$field_enabled_tips}" dir="{$textdir.field_enabled}">&#160;</label>
								<input class="fieldtitle" name="option{$optfieldnos[fields]}" id="option{$optfieldnos[fields]}" type="checkbox" value="yes"{$checkboxeds[fields]} /></{$tdclose}>
							{$td} class="fields cellfields">
								<label style="float:left;" {$field_accesskeys[fields]}for="field{$optfieldnos[fields]}" title="{$field_title_tips}" dir="{$textdir.field_title}">

{if $autocolors[fields]}
								<span style="float:left; {$autocolors[fields]}" dir="{$autocolors_dirs[fields]}">{$auto_col_names[fields]}: </span>
{/if}
								&#160;</label>
								<select style="float:right;" name="field{$optfieldnos[fields]}" id="field{$optfieldnos[fields]}" size="1" dir="{$textdir.field_title}">


	{section name=fieldopts loop=$fieldnos}
<option value="{$optnos[fields][fieldopts]}" {$optselected[fields][fieldopts]}dir="{$opttextdirec[fields][fieldopts]}">{$fld_str[fields][fieldopts]}</option>
	{/section}



</select></{$tdclose}>

							{$td} class="interfld">
								<label dir="{$textdir.interfldlabel}" for="interfld{$optfieldnos[fields]}">{$interfldlabel}&#160;</label> 
								<input dir="{$textdir.interfld}" title="{$interfld}" value="n1, n2, ..." id="interfld{$optfieldnos[fields]}" name="interfld{$optfieldnos[fields]}" type="text" size="10" /></{$tdclose}>

							{$td} class="css">
								<label dir="{$textdir.csslabel}" for="cssfld{$optfieldnos[fields]}">{$csslabel}&#160;</label> 
								<input dir="{$textdir.css}" title="{$css}" value="CSS" id="cssfld{$optfieldnos[fields]}" name="cssfld{$optfieldnos[fields]}" type="text" size="10" /></{$tdclose}>

							{$td} class="search">
								<label dir="{$textdir.searchlabel}" for="searchfld{$optfieldnos[fields]}">{$searchlabel}&#160;</label> 
								<input dir="{$textdir.Search}" title="{$Search}" value="{$searchterms}" id="searchfld{$optfieldnos[fields]}" name="searchfld{$optfieldnos[fields]}" type="text" size="12" /></{$tdclose}></{$trclose}>

{/section}

{if $script_yes_flag}
{capture assign=uncheckallon}onkeypress="javascript:uncheckAll()" onclick="javascript:uncheckAll()"{/capture}
{capture assign=checkallon}onkeypress="javascript:checkAll()" onclick="javascript:checkAll()"{/capture}
{capture assign=switchallon}onkeypress="javascript:switchAll()" onclick="javascript:switchAll()"{/capture}
{/if}

	<!--// Check/uncheck/switch buttons -->
					{$tr}>
						{$td} class="uncheckbutton" {$colspan} >
							<input dir="{$textdir.check_all}" type="button" value="{$check_all}" {$checkallon} />
							<input dir="{$textdir.uncheck_all}" type="button" value="{$uncheck_all}" {$uncheckallon} />
							<input dir="{$textdir.switch_all}" type="button" value="{$switch_all}" accesskey="x" {$switchallon} />
							<input dir="{$textdir.switch_all}" type="reset" value="{$reset}" />
							
							</{$tdclose}></{$trclose}></{$tableclose}></{$tdclose}>



{if $formattingopts_flag}
	<!--// Advanced text formatting options -->
	{$td} class="formattingoptions formattingoptsmain" style="vertical-align:top">

				<!--// Page formatting options -->
				<input id="pageformat" class="formattingoptions" type="button" dir="ltr" value="{$show|ucfirst}" {if $script_yes_flag}onkeypress="{$changevisib}" onclick="{$changevisib}"{/if} />
				<div class="formattingoptions" id="options">
					<div class="formattingoptions" id="pageoptions">
						<h3 class="formattingoptions" title="{$pageformatting_tips}" dir="{$textdir.pageformatting}">{$pageformatting}</h3>
						
{*Fix: Could prepackage some of the following from PHP into arrays then do as arrays into html_options, but may be easier for designer to see it all laid out to make changes later*}
						<fieldset class="formattingoptions">
							<label title="{$outputmode_tips}" for="outputmode" dir="{$textdir.outputmode}">{$outputmode}: </label>
	
							<select title="{$outputmode_tips}" id="outputmode" name="outputmode" size="1" dir="ltr">
								<option value="normal" dir="ltr" {$outputmodet}>normal</option>
								<option value="pspan" dir="ltr">pspan</option>
								<option value="li" dir="ltr">li</option>
								<option value="span" dir="ltr">span</option>
								<option value="pspan" dir="ltr">pspan</option>
								<option value="p" dir="ltr" {$outputmodep} >p</option></select></fieldset>
								
	
						<fieldset class="formattingoptions">
							<label for="bgcolor2" dir="{$textdir.backgroundcolor}">{$backgroundcolor}: </label>
	
							<select id="bgcolor2" name="bgcolor2" size="1" dir="{$textdir.backgroundcolor}">
								<option value="aqua" dir="{$textdir.aqua}">{$aqua}</option>
								<option value="black" dir="{$textdir.black}">{$black}</option>
								<option value="blue" dir="{$textdir.blue}">{$blue}</option>
								<option value="fuchsia" dir="{$textdir.fuchsia}">{$fuchsia}</option>
								<option value="gray" dir="{$textdir.gray}">{$gray}</option>
								<option value="green" dir="{$textdir.green}">{$green}</option>
								<option value="lime" dir="{$textdir.lime}">{$lime}</option>
								<option value="maroon" dir="{$textdir.maroon}">{$maroon}</option>
								<option value="navy" dir="{$textdir.navy}">{$navy}</option>
								<option value="olive" dir="{$textdir.olive}">{$olive}</option>
								<option value="purple" dir="{$textdir.purple}">{$purple}</option>
								<option value="red" dir="{$textdir.red}">{$red}</option>
								<option value="silver" dir="{$textdir.silver}">{$silver}</option>
								<option value="teal" dir="{$textdir.teal}">{$teal}</option>
								<option value="white" selected="selected" dir="{$textdir.white}">{$white}</option>
								<option value="yellow" dir="{$textdir.yellow}">{$yellow}</option></select>
	
							<label for="bgcolor" dir="{$textdir.or_entercolor}">&#160; {$or_entercolor}: </label>
							<input name="bgcolor" id="bgcolor" type="text" value="#" size="7" maxlength="7" /></fieldset>
	
						<fieldset class="formattingoptions">
							<span dir="{$textdir.show}">{$show|ucfirst}: &#160; </span>
							<input name="navgat" id="navgat" class="formattingoptions" type="checkbox" value="1" checked="checked"  />
							<label for="navgat" dir="{$textdir.navbar}">{$navbar}</label> &#160; 
							<input name="bcs" id="bcs" class="formattingoptions" type="checkbox" value="1" checked="checked"  />
							<label for="bcs" dir="{$textdir.Breadcrumbs}">{$Breadcrumbs}</label>
	
							<!-- Could use this to include a site map in any page (with further script modification), but don't need
							<input name="sitemapyes" id="sitemapyes" class="formattingoptions" type="checkbox" value="1" checked="checked"  />
							<label for="sitemapyes" dir="{$textdir.Sitemap}">{$Sitemap}: </label>
							-->
							
							</fieldset></div>

					<!--// Table formatting options -->
					<div class="formattingoptions" id="tableoptions">
						<h3 class="formattingoptions" title="{$tableformatting_tips}" dir="{$textdir.tableformatting}">{$tableformatting}</h3>
						<fieldset class="formattingoptions">
							<span dir="{$textdir.table_wborder}">{$table_wborder}: </span> &#160; 
							<input name="border" id="border1" type="radio" value="solid" checked="checked" dir="{$textdir.yes}" />
							<label for="border1">{$yes}</label> &#160; 
							<input name="border" id="border2" type="radio" value="none" dir="{$textdir.no}" />
							<label for="border2">{$no}</label></fieldset>
						<fieldset class="formattingoptions">
							<span dir="{$textdir.wishcaption}">{$wishcaption}: </span> &#160; 
							<input id="wishcaption1" name="nocaption" type="radio" checked="checked" value="0" dir="{$textdir.yes}" />
							<label for="wishcaption1">{$yes}</label> &#160; 
							<input id="wishcaption2" name="nocaption" type="radio" value="1" dir="{$textdir.no}"/>
							<label for="wishcaption2">{$no}</label></fieldset>
						<fieldset class="formattingoptions">
							<span dir="{$textdir.wishtoscroll}">{$wishtoscroll}: </span> &#160; 
							<input id="nottoscroll1" name="nottoscroll" type="radio" checked="checked" value="1" dir="{$textdir.yes}" />
							<label for="nottoscroll1">{$yes}</label> &#160; 
							<input id="nottoscroll2" name="nottoscroll" type="radio" value="0" dir="{$textdir.no}"/>
							<label for="nottoscroll2">{$no}</label></fieldset>
						<fieldset class="formattingoptions">
							<span dir="{$textdir.headings_wstyles}">{$headings_wstyles}: </span> &#160;
							<input id="headings1" name="headings" type="radio" value="y" dir="{$textdir.yes}"/>
							<label for="headings1">{$yes}</label> &#160; 
							<input id="headings2" name="headings" type="radio" value="n" checked="checked" dir="{$textdir.no}"/>
							<label for="headings2">{$no}</label> &#160; 
							<input id="headings3" name="headings" type="radio" value="0" dir="{$textdir.none}"/>
							<label for="headings3">{$none}</label></fieldset>

							<fieldset class="formattingoptions">
							<span dir="{$textdir.trnsps}">{$trnsps}: </span> &#160;
							<input id="transpose1" name="trnsps" type="radio" value="1" dir="{$textdir.yes}"/>
							<label for="transpose1">{$yes}</label> &#160; 
							<input id="transpose2" name="trnsps" type="radio" value="0" checked="checked" dir="{$textdir.no}"/>
							<label for="transpose2">{$no}</label></fieldset>
							
							</div>

					<!--// Text formatting options -->
					<div class="formattingoptions" id="formattingoptions">
						<h3 class="formattingoptions" title="{$advancedformatting_tips}" dir="{$textdir.advancedformatting}">{$advancedformatting}</h3>
	
						<fieldset class="formattingoptions">
							<label accesskey="y" for="color2" dir="{$textdir.textcolor}">{$textcolor}: </label>
							<select id="color2" name="color2" size="1" dir="{$textdir.textcolor}">
								<option value="aqua" dir="{$textdir.aqua}">{$aqua}</option>
								<option value="black" selected="selected" dir="{$textdir.black}">{$black}</option>
								<option value="blue" dir="{$textdir.blue}">{$blue}</option>
								<option value="fuchsia" dir="{$textdir.fuchsia}">{$fuchsia}</option>
								<option value="gray" dir="{$textdir.gray}">{$gray}</option>
								<option value="green" dir="{$textdir.green}">{$green}</option>
								<option value="lime" dir="{$textdir.lime}">{$lime}</option>
								<option value="maroon" dir="{$textdir.maroon}">{$maroon}</option>
								<option value="navy" dir="{$textdir.navy}">{$navy}</option>
								<option value="olive" dir="{$textdir.olive}">{$olive}</option>
								<option value="purple" dir="{$textdir.purple}">{$purple}</option>
								<option value="red" dir="{$textdir.red}">{$red}</option>
								<option value="silver" dir="{$textdir.silver}">{$silver}</option>
								<option value="teal" dir="{$textdir.teal}">{$teal}</option>
								<option value="white" dir="{$textdir.white}">{$white}</option>
								<option value="yellow" dir="{$textdir.yellow}">{$yellow}</option></select>
	
							<label for="color" dir="{$textdir.or_entercolor}">&#160;  {$or_entercolor}: </label>
							<input name="color" id="color" type="text" value="#" size="7" maxlength="7" /></fieldset>
	
						<fieldset class="formattingoptions">
							<label for="font" dir="{$textdir.text_font}">{$text_font}: </label>
							<select id="font" name="font" size="1" dir="{$textdir.text_font}">
{* Fix: The following fonts (if they are relevant for other languages), could be translated here; otherwise the values should be also localized. Same with font-style and font-variant? *}
								<option value="Helvetica, sans-serif">Helvetica, sans-serif</option>
								<option value="Verdana, sans-serif">Verdana, sans-serif</option>
								<option value="Gill Sans, sans-serif">Gill Sans, sans-serif</option>
								<option value="Avantgarde, sans-serif">Avantgarde, sans-serif</option>
								<option value="Helvetica Narrow, sans-serif">Helvetica Narrow, sans-serif</option>
								<option value="sans-serif">sans-serif</option>
								<option value="Times, serif">Times, serif</option>
								<option value="Times New Roman, serif" selected="selected">Times New Roman, serif</option>
								<option value="Palatino, serif">Palatino, serif</option>
								<option value="Bookman, serif">Bookman, serif</option>
								<option value="New Century Schoolbook, serif">New Century Schoolbook, serif</option>
								<option value="serif">serif</option>
								<option value="Andale Mono, monospace">Andale Mono, monospace</option>
								<option value="Courier New, monospace">Courier New, monospace</option>
								<option value="Courier, monospace">Courier, monospace</option>
								<option value="Lucidatypewriter, monospace">Lucidatypewriter, monospace</option>
								<option value="Fixed, monospace">Fixed, monospace</option>
								<option value="monospace">monospace</option>
								<option value="Comic Sans, 'Comic Sans MS, cursive">Comic Sans, Comic Sans MS, cursive</option>
								<option value="Zapf Chancery, cursive">Zapf Chancery, cursive</option>
								<option value="Coronetscript, cursive">Coronetscript, cursive</option>
								<option value="Florence, cursive">Florence, cursive</option>
								<option value="Parkavenue, cursive">Parkavenue, cursive</option>
								<option value="cursive">cursive</option>
								<option value="Impact, fantasy">Impact, fantasy</option>
								<option value="Arnoldboecklin, fantasy">Arnoldboecklin, fantasy</option>
								<option value="Oldtown, fantasy">Oldtown, fantasy</option>
								<option value="Blippo, fantasy">Blippo, fantasy</option>
								<option value="Brushstroke, fantasy">Brushstroke, fantasy</option>
								<option value="fantasy">fantasy</option></select></fieldset>
	
						<fieldset class="formattingoptions">
							<label for="fontstyle" dir="{$textdir.font_style}">{$font_style}: </label>
							<select id="fontstyle" name="fontstyle" size="1" dir="{$textdir.font_style}">
								<option value="italic" dir="{$textdir.italic}">{$italic}</option>
								<option value="normal" selected="selected" dir="{$textdir.fontstyle_normal}">{$fontstyle_normal}</option>
								<option value="oblique" dir="{$textdir.oblique}">{$oblique}</option></select> &#160; 
	
	
							<label for="fontvariant" dir="{$textdir.font_variant}">{$font_variant}: </label>
							<select id="fontvariant" name="fontvariant" size="1" dir="{$textdir.font_variant}">
								<option value="normal" selected="selected" dir="{$textdir.fontvariant_normal}">{$fontvariant_normal}</option>
								<option value="small-caps" dir="{$textdir.smallcaps}">{$smallcaps}</option></select></fieldset>
	
						<fieldset class="formattingoptions">
							<label for="fontweight" dir="{$textdir.font_weight}">{$font_weight} 
								<span dir="ltr">(normal, bold, 100-900, etc.)</span>:</label>
							<input name="fontweight" id="fontweight" type="text" value="normal" size="7" maxlength="12" /></fieldset>
	
						<fieldset class="formattingoptions">
							<label for="fontsize" dir="{$textdir.font_size}">{$font_size} 
								<span dir="ltr">(14pt, 14px, small, 75%, etc.)</span>:</label>
							<input name="fontsize" id="fontsize" type="text" value="100%" size="7" maxlength="12" /></fieldset>
	
						<!-- This CSS attribute didn't work so it was removed in favor of letter-spacing (see the following) which can do the trick:
	
						<fieldset class="formattingoptions">
							<label for="fontstretch" dir="{$textdir.font_stretch}">{$font_stretch} 
								<span dir="ltr">(wider, narrower, semi-expanded, ultra-condensed, extra-expanded, etc.)</span>:</label>
							<input name="fontstretch" id="fontstretch" type="text" value="normal" size="12" maxlength="16" /></fieldset>
						-->
	
						<fieldset class="formattingoptions">
							<label for="letterspacing" dir="{$textdir.letter_spacing}">{$letter_spacing} 
								<span dir="ltr">(normal, .9em, -.05cm)</span>:</label>
							<input name="letterspacing" id="letterspacing" type="text" value="normal" size="7" maxlength="12" /></fieldset>
	
						<fieldset class="formattingoptions">
							<label for="lineheight" dir="{$textdir.line_height}">{$line_height} 
								<span dir="ltr">(normal, 1.5, 22px, 150%)</span>:</label>
							<input name="lineheight" id="lineheight" type="text" value="normal" size="7" maxlength="12" /></fieldset></div></div>

{else}
					{$td}><div><input name="outputmode" type="hidden" value="p" /></div>
{/if}

{* Hidden fields (see also the last "else" above) *}

					<input name="file" type="hidden" value="{$file}" />
					<input name="langu" type="hidden" value="{$langu}" /></{$tdclose}></{$trclose}></{$tableclose}>	
					<div><input name="set" type="hidden" value="{$setdb}" /></div>

	<p class="submit focus"><input accesskey="z" type="submit" value="{$submitgo}" dir="{$textdir.submitgo}" /></p></form>

{include file='foot.tpl'}
