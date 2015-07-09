{* Note that {$table}, etc. have to have a "<" sent here (they cannot be added here at the moment), due to a bug in smarty: http://www.phpinsider.com/smarty-forum/viewtopic.php?p=32428#32428 *}
{* although i could make the table head tags, etc. dynamic and remove the ifs (if they're blank, it won't break anything anyways); but the ifs help emphasize to the template designer that that section is not always going to be printed *}
<div id="top"></div>
{if $smarty.get.navgat}
{include file='header.tpl'}
{include file='head1.tpl'}
	

{* {doc_raw target=doctype}
<!ENTITY % xhtml-target.module "INCLUDE">
{/doc_raw}
*}
	
<!--// Header 2 (Login, etc.) -->
	<div class="loginlinks">
{include file='login_links.tpl'}
</div>

{/if}

<!--// Head -->

{if $table_output_flag}
<table class="results" summary="{$resultstablesummary}" dir="{$textdir.resultstablesummary}">
	{if $caption_flag}
<caption id='maintablecaption' class="results">{$caption}</caption>
	{/if}
	{if $heading_flag && !$trnsps}
<thead id='maintablehead' class="results">
			{else} {* Should probably use col/colgroup to force first column to be fixed in the event of a transposed table (but with a heading) and with the other columns scrollable, but couldn't get to work in Firefox *}
	{/if}
{/if}

{if !$trnsps}
{$tr1open} class='row0'>
{section name=colheads loop=$headfieldid}
{$thopen} id="head{$headfieldid[colheads]}" class="{$headfieldclass[colheads]|tonmtoken} header {$headfieldclass2[colheads]}" dir="{$headfielddir[colheads]}">{$headfield_txt[colheads]}{$headfield_extra[colheads]}{$thdivider}</{$thclose}>
{/section}
{$tr1divider}</{$tr1close}>
{/if}

{if $table_output_flag && $heading_flag && !$trnsps}
</thead>
{/if}

<!--// Body -->

{if $table_output_flag}
<tbody id='maintablebody' class="results">
{/if}

{$table_contents}

{if $table_output_flag}
</tbody>
</table>
{/if}
{if $smarty.get.navgat}
		
{/if}
</div>
<div id='right'>&#160;</div>
