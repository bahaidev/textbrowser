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
