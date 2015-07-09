{*PHP Functions used in this file: explode, count, dividehalf (my own function)*}
{doc_raw target="css"}
	.heading {text-align:center;}
	.choosewritings {text-align:center;}
{/doc_raw}
{doc_raw target="css" file="/alt.css" rel="alternate stylesheet" title="orange"}
	.heading {color:orange;text-align:left;}
	.choosewritings {color:orange;text-align:left;}
{/doc_raw}
{doc_raw target="css" file="/alt2.css" rel="alternate stylesheet" title="green"}
	.heading {color:green;text-align:left;}
	.choosewritings {color:orange;text-align:left;}
{/doc_raw}

{include file='header.tpl'}
{include file='head1.tpl'}
							
<!--// Header 2 (Login, etc.) -->
	<div class="loginlinks">
{include file='login_links.tpl'}
</div>

<!--// Main heading -->
<div class="empty30col">&#160;</div>
<h2 class="width40col focus">{$browserfile}</h2>
<div class="empty_clear_col">&#160;</div>
<!--// Options -->

{doc_raw target=css}
	label.choosewritingsstring {font-weight:bold;}
{/doc_raw}

<div class="focus">
{section name=db loop=$m_arr}
<div class="writings">
<form action="{$browsetextfile}" method="get" id="browse{$m_arr[db]}">
	<p class="choosewritingsA" dir="{$choose_writings_dir[db]}">
		<label class="choosewritingsstring" {$accesskey_arr[db]} id="choosewritings{$m_arr[db]}" for="file{$m_arr[db]}">{$choose_writings_str[db]}:</label></p>
	<p class="choosewritingsA" dir="{$choose_writings_dir[db]}">

	{if $linkmode}
{section name=tbl loop=$option_mult_arr[db]}
	<div class="focus choosewritings{$m_arr[db]}">
		<a class="{$m_arr[db]}option" id="option{$m_arr[db]}-{$smarty.section.tbl.index}" href="{$browsetextfile}?set={$setdb_arr[db]}&amp;file={$option_mult_arr[db][tbl.index].value}" dir="{$option_mult_arr[db][tbl.index].dir}">{$option_mult_arr[db][tbl.index].text}</a></div>
{/section}
	{else}
	<select class="choosewritings{$m_arr[db]}" name="file" id="file{$m_arr[db]}" size="1" onchange="javascript:this.form.submit();">
{section name=tbl loop=$option_mult_arr[db]}
		<option class="{$m_arr[db]}option" id="option{$m_arr[db]}-{$smarty.section.tbl.index}" value="{$option_mult_arr[db][tbl.index].value}" {if $smarty.section.tbl.first}selected="selected" {/if}dir="{$option_mult_arr[db][tbl.index].dir}">{$option_mult_arr[db][tbl.index].text}</option>
{/section}</select>
	{/if}
	
	{if !$linkmode}
	<input name="set" type="hidden" value="{$setdb_arr[db]}" />
	<input name="langu" type="hidden" value="{$langu}" /></p>
	<p class="choosewritingsA" dir="{$textdir.submitgo}">
		<label {$advancedaccess_arr[db]} for="advancedmode{$m_arr[db]}">{$advancedmode}?:</label>
		<input name="showstat" id="advancedmode{$m_arr[db]}" {$checked_arr[db]} class="advancedmode" type="checkbox" value="inline" /><br />
		<input id="submit{$m_arr[db]}" {$accesskeybutton_arr[db]} type="submit" value="{$submitgo}" /></p><div><br /></div></form></div>
	{/if}
{/section}
</div>
{include file='foot.tpl'}
