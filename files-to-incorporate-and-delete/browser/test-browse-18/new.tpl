{*PHP Functions used in this file: strtoupper *}

{include file='header.tpl'}
{include file='head1.tpl'}
</td>
<td style="width: 40%; vertical-align:top; text-align:center;">
<span style="font-style:italic; font-size:small;">
{$seealso}: &nbsp;  <a href="{$stats_popular_lnk}">{$mostpopular}</a> &nbsp; &#8212; &nbsp; <a href="{$prm_lnk_4}">{$RSS} {$feeds}</a></span>
</td><td style="width: 30%; vertical-align:top; text-align:right;">


<form action="{$collection_lnk}" method="post">
{include file='collec_choices.tpl'}
</form>

</td></tr></table></td>
{include file='images_rt.tpl'}

<td>
<form action="{$new_lnk}" method="get">
<h2>{$whatsnew}: {$docs_posted_past}
<select name="new" onchange="javascript:this.form.submit();">
<option value="{nocache}{$newdate}{/nocache}">{nocache}{$newdate}{/nocache}</option>
<option value="5">5</option>
<option value="15">15</option>
<option value="30">30</option>
<option value="60">60</option>
<option value="90">90</option>
<option value="180">180</option>
<option value="365">365</option></select>
 days</h2>
<noscript>
	<input type="submit" value="{$Go}"></noscript>
</form>

<ol>
{nocache}
{section name=row loop=$col_arr}
<li>{$pd_arr[row]} &nbsp; 
{* Fix: hard-coding this pre-formatted data in for now *}
{$col_arr[row]}
<span style="font-size: small;">
[<a href="javascript:record_window('{$id_lnk}?itemnew={$idarray[row]}');">more</a>]
<noscript>
 [<a href="{$id_lnk}?itemnew={$idarray[row]}">{$more}</a>]
</noscript>
{nocache}{if $admin_flag}
 <a href="{$upload_lnk}?id={$idarray[row]}">{$edit}</a>
{/if}{/nocache}
</span><br /><br />
</li>
{/section}
{/nocache}
</ol>

{include file='foot0.tpl'}
	<form action="{$collection_lnk}" method="post">
{include file='collec_choices.tpl'}
</form>

{include file='link1.tpl'}
</td></tr></table></td>
<td> </td>

<!--// Search -->
<td style="width:50%; text-align:center;">
{include file='search1.tpl'}
</td>

{include file='foot1.tpl'}
{include file='foot2.tpl'}
