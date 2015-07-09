<!--// Noscript (for those without a scriptable browser) -->
<noscript>
	<p class="noscript" dir="{$textdir.noscriptonchange}">{$noscriptonchange}</p></noscript>

{* Only a temporary solution to have breadcrumbs and navbar here (esp. without XHTML) *}
<!--// Breadcrumbs and Navigation Bar -->
{$bc_nv_print}

<!--// Language choices -->
<form action="{$blofile}" id="languageform" method="get">
	<p class="langs" dir="{$textdir.chooselanguage}">
		<label accesskey="a" for="language">{$chooselanguage}:<span><br /><br /></span></label>
		<select name="langu" id="language" size="{$maxlangs}" onchange="javascript:this.form.submit();" dir="{$textdir.chooselanguage}">

{section name=langs loop=$lgs_name}
	{if $smarty.section.langs.first}
		{assign var="opt_selected" value='selected="selected" '}
	{else}
		{assign var="opt_selected" value=""}
	{/if}
			<option id="option{$lang_counter++}" value="{$lgs_code[langs]}" {$opt_selected}dir="{$lgs_direction[langs]}" xml:lang="{$lgs_code[langs]}">{$lgs_name[langs]}</option>
{/section}
</select></p>

{* Don't add an "id" to the submit button; doing so breaks the select's onchange script! *}
	<p class="langs" dir="{$textdir.submitgo}">
		<input type="submit" accesskey="z" value="{$submitgo}" dir="{$textdir.submitgo}" /></p></form>

</body>
</html>