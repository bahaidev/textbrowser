{doc_raw target=css file="assistant.css"}
td.mainedittable {border-width: 1px; border-style:solid;}

table.entrytable {width: 100%; border-style: double;}
textarea.entrytable, textarea.entrytablereadonly {width: 100%;}
p.showentrylinks {
  width: 100%;
	text-align: left;
}
.langs, .savebutton {text-align: center;}
{/doc_raw}


{* PHP functions: none *}
{include file='header.tpl'}
{include file='head1.tpl'}
{include file='homelink.tpl'}
</td>
<!--// Header 2 (Login, etc.) -->
			<td style="text-align: right; vertical-align: top; width: 30%; font-size: smaller;">
{include file='login_links.tpl'}
</td></tr></table></td>
{include file='images_rt.tpl'}<td>

{if $showlangs_flag}

<form id="languageform" method="post" action="{$assistantfilelnk}">
	<p class="langs">
		<label for="language" accesskey="a">{$assistantlanguagetranslate}:</label>
		<br /><br />
		<select name="langu" id="language" size="{$maxlangs}">

{section name=num loop=$langno_arr}
			<option id="option{$langno_arr[num]}" value="{$langcode_arr[num]}" dir="{$langdir_arr[num]}" xml:lang="{$langcode_arr[num]}">{$langname_arr[num]}</option>
{/section}

</select>
		<br /><br /><br />
		<label accesskey="b" for="pass">{$assistantpassword}</label>: 
			<input size="8" id="pass" name="pass" type="password" />
			<br /><br />
			<input accesskey="z" type="submit" value="{$submitgo}" /></p></form>

{elseif $editform_flag}

<p class="showentrylinks" dir="{$default_lang_direction}" xml:lang="{$defaultlanguage}">
<br /><br />
	{if $showall_nolink_flag}
{$showall} {$showall_number} {$atonce}
	<br />
	{else}
	<a id="showall" href="?starting=1&amp;recordsatatime={$showall_number}{$nostringseq}">{$showall} {$showall_number} {$atonce}</a>
	<br />
	{/if}
{$show} {$recordsatatime} {$atatime}: &#160; &#160; 
{$furtherpages_links} {* Was too difficult to make this link section fully localizable *}
({$startingat} {$starting})
<br /><br /></p>


<!-- Form opening tag and localized edit form table headers -->
<form accept-charset="utf-8" id="saveedit" method="post" action="{$assistantfilelnk}">
	<table class="entrytable" style="width:100%;">
		<tr>
{if $stringkey_arr}
			<th dir="{$default_lang_direction}" xml:lang="{$defaultlanguage}">{$stringkey_tablekey_fieldkey}</th>
{/if}
			<th dir="{$default_lang_direction}" xml:lang="{$defaultlanguage}">{$assistant_original} {$default_lang_name}</th>
			<th dir="{$default_lang_direction}" xml:lang="{$defaultlanguage}">{$assistant_translation} ({$default_lang_name} {$assistant_shouldbechanged} <span dir="{$lang_direction}" xml:lang="{$lang_code}">{$lang_name}</span>)</th></tr>

{if $insert_command1}
<tr><td colspan="{$edittable_colspan}">
{$insert_command1}</td></tr>
{/if}
{if $insert_command2}
<tr><td colspan="{$edittable_colspan}">
{$insert_command2}</td></tr>
{/if}
{if $insert_command3}
<tr><td colspan="{$edittable_colspan}">
{$insert_command3}</td></tr>
{/if}




{section name=textboxrow loop=$textboxrow_arr}
<tr>
{* This cell only printed for admins (as regular translators don't need to be distracted by it *}
{if $stringkey_arr[textboxrow]}
<td class="mainedittable" style="width:10%">{$stringkey_arr[textboxrow]}
{if $tablekey_arr[textboxrow]}
 / {$tablekey_arr[textboxrow]}
{/if}
{if $fieldkey_arr[textboxrow]}
 / {$fieldkey_arr[textboxrow]}
{/if}
</td>
{/if}
<td class="mainedittable">

<textarea id='readonly{$textboxrow_arr[textboxrow]}' dir='{$default_lang_direction}' name='readonlytextarea' cols='20' rows='10' readonly='readonly' xml:lang='{$defaultlanguage}' class='entrytablereadonly'>{$localiz_def_content_arr[textboxrow]}</textarea></td>
<td>
<textarea id='edit{$textboxrow_arr[textboxrow]}' dir='{$lang_direction}' name='localization_id{$localiz_id_arr[textboxrow]}' cols='20' rows='10' xml:lang='{$lang_code}' class='entrytable'>{$localiz_lang_content_arr[textboxrow]}</textarea></td></tr>

{/section}

<tr>
			<td colspan="{$edittable_colspan}" class="savebutton">
				<input accesskey="z" type='submit' value='{$save}' /></td></tr></table>
<div>
	<input name="recordspertime" type="hidden" value="{$recordspertime}" />
	<input name="starting" type="hidden" value="{$starting}" /></div></form>

	<div>
	<br /><br />
	<a href='{$asstfile}?removecookies=yes'>{$assistant_choosedifferenteditlanguage}...</a> ({$assistant_changesignored})
	<br /></div>

{elseif $submitted_flag}
<p>
{section name=query loop=$query_arr}
{$assistant_ransqlcommand}:{$query_arr[query]};<br />
{/section}

<br /><br />
<a id="returnediting" href="{$asstfile}?starting={$starting}&amp;recordsatatime={$recordspertime}">{$assistant_returnediting}...</a>
<br /><br /><br />
<a id="choosedifferentlanguage" href='{$asstfile}?removecookies=yes'>{$assistant_choosedifferenteditlanguage}...</a>
<br /></p>

{/if}
</table>