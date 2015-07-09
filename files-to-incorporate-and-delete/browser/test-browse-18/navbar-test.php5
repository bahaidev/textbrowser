<?php

$strings['index_lnk'] = "index.php5";
$strings['author_lnk'] = "author.php5";
/*
phpinfo();
$sorted = get_loaded_extensions();
natcasesort($sorted);
print "<pre>";
print_r($sorted);
print "</pre>";
if (extension_loaded('xsl')) print "ok<br />";
else {print "nope";}
exit;
*/

// Includes independent method interfaces for:
// 1) Title, encoding, http_accept
// 2) Links Next/Prev & Metadata
// 3) Navbar (with alphabetical or hierarchical pulldowns)
// 4) Breadcrumbs
// 5) Sitemap (Alphabetical, Hierarchical (non-nested), Hierarchical (nested))

// Fix: Note that the hierarchical data is being assigned to Smarty as just one variable; this could be fixed to allow customization of the output within a template, rather than by modifying this class
// Fix: I've only tested the Smarty output fully; there may be some small kinks to work out when just printing out directly
// Some functions could also test not only whether the request variable exists, but whether it is correct (according to another attribute in the XML file); as far as security, though, presumably the XML file would be secure.
// Although it is already performed for Smarty, for the non-Smarty printing, one could also modify the code to localize other aspects of the sitemap fairly easily (just use the eval_print function--search the code for examples)


/* $Id: $ */
/**
+
 * Project:     LAF: the Lazy Abstract Framework
 *
 * @package     LAF
 * @author      brettz9 [brettz9 ~ yahoo com]
 * @version     0.0.1 2006-Sep-13 (@since 2006-Sep-13)
 * @copyright   brettz9, 2006
 * @license     LGPL 2.1
 */

$req_dir = '/home/bahai/inc_files/';
// require('smarty.php');

/*
$navbarcrumbs = new navbarcrumbs($req_dir.'sitemap.xml', $smarty);
$navbarcrumbs->getPageTitle();
$navbarcrumbs->getLinkMetaData();
// $navbarcrumbs->getBreadcrumbs();
$navbarcrumbs->getNextPrev(); // Gets the same data (unless not for Smarty) as a regular call to getBreadcrumbs at present (i.e., both next/prev's and breadcrumbs)
$navbarcrumbs->getNavbar();
$navbarcrumbs->getPullDown();
$navbarcrumbs->getPullDown('hier');
$navbarcrumbs->getSiteMap();
$navbarcrumbs->getSiteMap('hier');
$navbarcrumbs->getSiteMap('category');
*/

$navbarcrumbs2 = new navbarcrumbs($req_dir.'sitemap.xml');

print "<html><head>";
print <<<HERE
<style type="text/css">
	<!--
	.navigator {float: left; text-align:center; border-width: thin; border-style: solid; width: 8.5%; height: 20px;}
	.navigatorhead {width: 100%; border-width: thin; border-style: solid;}
	.navmenu {float: left; width: 8.5%;}
	.navmenuform {float:left;}
	.listhead, .listhead {list-style-type: disc;}
	.listitem, .listitem2 {list-style-type: circle;}
	.breadcrumbs {clear: both;}
	.sitemap {position:relative;}
	.sitemapheading {font-weight: bold;}
	.sitemapblockA, .sitemapblockB, .sitemapblockC {float:left; width:20%; padding-left: 10px; padding-right: 30px;}
	h2, h3, h4, h5, h6 {text-align:left;}
	--></style>
HERE;
print $navbarcrumbs2->getLinkMetaData();
print $navbarcrumbs2->getNextPrev();
print "<title>".$navbarcrumbs2->getPageTitle()."</title>";
print "</head><body>\n";
print $navbarcrumbs2->getNavbar();
print $navbarcrumbs2->getPullDown();
print $navbarcrumbs2->getPullDown('hier');
print $navbarcrumbs2->getBreadcrumbs()."<br /><br />";
print $navbarcrumbs2->getSiteMap();
print $navbarcrumbs2->getSiteMap('hier');
print $navbarcrumbs2->getSiteMap('category');
print "</body></html>";


class navbarcrumbs {

	private $crumbs_id = array();
	private $crumbs_name = array();
	private $crumbs_dir = array();
	private $crumbs_href = array();
	private $crumbs_tooltip = array();
	private $linkmeta_lm = array();
	private $linkmeta_href = array();
	private $linkmeta_title = array();
	private $nextprev_np = array();
	private $nextprev_href = array();
	private $nextprev_title = array();
	private $arr_baseurl = array();
	private $arr_file = array();
	private $arr_get = array();
	private $arr_wholeurl = array();
	private $arr_tooltip = array();
	private $arr_asXML = array();
	private $arr_show = array();
	private $crumbs_currtooltip;
	private $crumbs_currname;
	private $crumbs_currdir;
	private $xml; // The loaded XML string/file (a SimpleXMLElement object)
	private $path; // This is automatically determined

	public $hieroutput;
	public $semi_hieroutput;
	public $redirect_pg = 'redirect2.php'; // This is just an example

	public $separator = "&nbsp; > &nbsp;";
	public $indent = "\t";
	public $headnum = '2'; // Beginning head numbering for hierarchical Sitemap
	public $headnum2;
	public $HTTP_ACCEPT = "text/html";
	public $navwidthoffset = 4; // Used for adjusting the width by pixels
	public $navwidth;
	public $localiz_pref = '{$';
	public $localiz_suff = '}';
	public $localiz_var = 'strings';
	public $currget;
	public $currfile;
	public $baseurl;
	public $optgroup_dir = 'ltr';
	public $optgroup_out = '';


	public $opt_choosepage = 'chooseapage';
	public $opt_choosepg = 'Choose a page';
	public $opt_category = 'category';
	public $opt_hierarch = 'hierarchically';
	public $opt_hierar = 'hierarchical';
	public $opt_alph = 'alphabetically';
	public $opt_alphab = 'alphabetical';
	public $sitemap = 'sitemap';
/*
	public $opt_choosepage = 'chooseapage';
	public $opt_choosepg = 'Choose a page';
	public $opt_category = 'category';
	public $opt_hierarch = 'hierarchically';
	public $opt_hierar = 'hierarchical';
	public $opt_alph = 'alphabetically';
	public $opt_alphab = 'alphabetical';
	public $sitemap = 'sitemap';
*/	
	public $submitval = 'Submit';

	// Allow overriding of the various default variable names to be used in the Smarty templates (select a key and change its value)
	public $smarty_assigns = array(
		'navbar_currget' => 'navbar_currget',
		'navbar_currfile' => 'navbar_currfile',
		'navbar_currbaseurl' => 'navbar_currbaseurl',
		'linkmeta_lm' => 'linkmeta_lm',
		'linkmeta_href' => 'linkmeta_href',
		'linkmeta_title' => 'linkmeta_title',
		'this_pg_title' => 'this_pg_title',
		'this_pg_dir' => 'this_pg_dir',
		'this_pg_tooltip' => 'this_pg_tooltip',
		'crumbs_separator' => 'crumbs_separator',
		'crumbs_currname' => 'crumbs_currname',
		'crumbs_currdir' => 'crumbs_currdir',
		'crumbs_currtooltip' => 'crumbs_currtooltip',
		'crumbs_tooltip' => 'crumbs_tooltip',
		'crumbs_href' => 'crumbs_href',
		'crumbs_dir' => 'crumbs_dir',
		'crumbs_name' => 'crumbs_name',
		'crumbs_ind' => 'crumbs_ind',
		'crumbs_ind2' => 'crumbs_ind2',
		'nextprev_flag' => 'nextprev_flag',
		'nextprev_title' => 'nextprev_title',
		'nextprev_np' => 'nextprev_np',
		'nextprev_href' => 'nextprev_href',
		'navbar_baseurl' => 'navbar_baseurl',
		'navbar_file' => 'navbar_file',
		'navbar_get' => 'navbar_get',
		'navbar_show' => 'navbar_show',
		'navbar_wholeurl' => 'navbar_wholeurl',
		'navbar_tooltip' => 'navbar_tooltip',
		'navbar_content' => 'navbar_content',
		'navbar_width' => 'navbar_width',
		'pulldown_tooltip' => 'pulldown_tooltip',
		'pulldown_name' => 'pulldown_name',
		'pulldown_dir' => 'pulldown_dir',
		'pulldown_href' => 'pulldown_href',
		'pulldown_ind' => 'pulldown_ind',
		'pulldown_ind2' => 'pulldown_ind2',
		'pulldown_ind3' => 'pulldown_ind3',
		'sitemap_ind' => 'sitemap_ind',
		'sitemap_ind2' => 'sitemap_ind2',
		'sitemap_ind3' => 'sitemap_ind3',
		'sitemap_tooltip' => 'sitemap_tooltip',
		'sitemap_name' => 'sitemap_name',
		'sitemap_dir' => 'sitemap_dir',
		'sitemap_href' => 'sitemap_href',
		'select_dir' => 'select_dir',
		'input_dir' => 'input_dir',
		'http_accept' => 'http_accept',
		'head_ind' => 'head_ind',
		'navbar_ind' => 'navbar_ind',
		'navbar_ind2' => 'navbar_ind2',
		'navbar_ind3' => 'navbar_ind3',
		'navbar_ind4' => 'navbar_ind4',
		'optgroup_out' => 'optgroup_out',
		'hiermap_no_nesting' => 'hiermap_no_nesting',
		'hiermap_nesting' => 'hiermap_nesting'
	);

	public $metadata = array(
		'help' => 'Help', 
		'copyright' => 'Copyright',
		'start' => 'Start',
		'contents' => 'Contents',
		'bookmark' => 'Bookmark'
	);

	/**
	 * Constructor
	 *
	 */


	public function __construct($_xml, Render_SmartyDoc &$smarty = NULL) {

		//////// Current file processing
		$this->path = htmlentities($_SERVER['PHP_SELF']); // Get the current file (encapsulated by htmlentities for security)
		$query = strstr($this->path, '?'); // Get query
		$querypos = strpos($this->path, '?'); // Get position of query
		$fileurl = substr_replace($this->path, '', $querypos); // Get filename
		$filename = basename($fileurl);

		if ($smarty != NULL) {
			$this->smarty = &$smarty;
			$this->smarty->assign($this->smarty_assigns['navbar_currget'], $query);
			$this->smarty->assign($this->smarty_assigns['navbar_currfile'], $filename);
			$this->smarty->assign($this->smarty_assigns['navbar_currbaseurl'], $fileurl);
		// $this->smarty->assign('navbar_currwholeurl', $this->path);
		} // end if
		$this->currget = $query;
		$this->currfile = $filename;
		$this->baseurl = $fileurl;

		//////// XML File processing
				
		if (is_string($_xml)) {
			if (strrchr($_xml, '.') === '.xml') {
				// Had to use the following (instead of simplexml_load_file() since there is a bug in SimpleXML with default namespaces
				// $xml['xmlns'] = ''; // was supposed to help but didn't
				$xmltxt = file_get_contents($_xml);
				$xmltxt = str_replace('xmlns=', 'a=', $xmltxt);
				$xml = simplexml_load_string($xmltxt);

				if (!$xml) {
					print "Error loading XML file";
					exit;
				} // end if
			} // end if
			else {
				$xml = simplexml_load_string($_xml);
			} // end else
		} // end if
		else {
			print 'The first argument to class navbarcrumbs must be an XML file (as a string) or a file name (as a string).';
			exit;
		} // end else
		$this->xml = $xml;
	} // end construct


	protected function navcrumbs_is_a_page($baseplusfile, $pg_reqd, $pg_request) {
	
		if (strpos($this->path, $baseplusfile) === false) {
	//		explode(',', $reqdgets); // Could build on this to make sure any get calls (or request, post, etc.) were also matched
			$is_page = false;
		} // end if
		else {
			if ($pg_reqd === 'none') { // If the current page should not have the given request to be considered as that page (and avoid the link)
				if ($_REQUEST[$pg_request] == '') { // If there is in fact no request variable, then consider as a page and avoid the link
					$is_page = true;
				} // end if
				else { // If the request does exist (though the present page in the menu being cycled through requires it not to exist), then consider it as an external page 
					$is_page = false;
				} // end else
			} // end if
			elseif ($pg_request == '') { // If there is no required request to be considered that page (with the same path), then make it as that page (and thus don't show the link)
				$is_page = true;
			} // end elseif
			elseif ($_REQUEST[$pg_request] == '') { // If there is a required request, but it is blank, then consider it external (and show the link)
				$is_page = false;
			} // end elseif
			else { // If there is a required request, and it exists, then consider it as that page (and don't show its link)
				$is_page = true;
			} // end else
		} // end else
		return $is_page;
	} // end function navcrumbs_is_a_page


	protected function find_breadcrumbs($prev) {
		static $ctr; $ctr++;
		$bcs = $this->xml->xpath("//pg[@id='$prev']");
		$bcs0 = $bcs[0];
		$crumb = (string) $bcs0['id'];
	
		if ($crumb != '' && $ctr < 25) { // just in case, avoid infinite recursion
	//		$crumbs_id[] = $crumb;
		
			if ($this->smarty == NULL) {
				$bcs00 = call_user_func(array(&$this, 'eval_print'), $bcs0);
			} // end if
			else {
				$bcs00 = $bcs0;
			} // end else
		
			$this->crumbs_name[] = (string) $bcs00; // Couldn't get asXML to work
			$this->crumbs_dir[] = (string) $bcs0['dir'];

			if ($this->smarty == NULL) {
				if (strstr($bcs0['file'], $this->localiz_pref)) {
					$bcs0['file'] = call_user_func(array(&$this, 'eval_print'), $bcs0['file']);
				} // end if
			} // end if
				
			$this->crumbs_href[] = (string) $bcs0['baseurl'].$bcs0['file'].$bcs0['get'];

			$this->crumbs_tooltip[] = (string) $bcs0['tooltip'];
	
	// This would also work:
	//		$prev = $this->xml->xpath("//pg[@id='$prev']/@prev");
	// call with (string) $prev[0]
	
			// Could make the following recursion conditional (don't need it if only doing a prev/next)
			$this->find_breadcrumbs((string) $bcs0['prev']);
		} // end if
	} // end function find_breadcrumbs


	public function getLinkMetaData() {
	
		foreach ($this->metadata as $k => $v) {
			$linkmeta = $this->xml->xpath("//pg[@{$k}='{$v}']");
			$linkmeta0 = $linkmeta[0];
			if ((string) $linkmeta0[$k] != '') {
				$this->linkmeta_lm[] = $v;
				if ($this->smarty == NULL) {
					if (strstr($linkmeta0['file'], $this->localiz_pref)) {
						$linkmeta0['file'] = call_user_func(array(&$this, 'eval_print'), $linkmeta0['file']);
					} // end if
				} // end if

				$this->linkmeta_href[] = (string) $linkmeta0['baseurl'].$linkmeta0['file'].$linkmeta0['get'];
				if ($this->smarty == NULL) {
					$linkmeta00 = call_user_func(array(&$this, 'eval_print'), $linkmeta0);
				} // end if
				else {
					$linkmeta00 = $linkmeta0;
				} // end else
				$this->linkmeta_title[] = (string) $linkmeta00;
			} // end if
		} // end foreach
		
		if ($this->smarty != NULL) {
			if ($this->HTTP_ACCEPT == 'text/html') { // If hasn't been manually set different than default, use SmartyDoc's automated version
				$this->HTTP_ACCEPT = $this->smarty->HTTP_ACCEPT;
			} // end if
			if ($this->indent == "\t") { // If hasn't been manually set different than default, use SmartyDoc's automated version
				$this->indent = $this->smarty->getIndent();
			} // end if
			$this->smarty->assign($this->smarty_assigns['linkmeta_lm'], $this->linkmeta_lm);
			$this->smarty->assign($this->smarty_assigns['linkmeta_href'], $this->linkmeta_href);
			$this->smarty->assign($this->smarty_assigns['linkmeta_title'], $this->linkmeta_title);
			$this->smarty->assign($this->smarty_assigns['head_ind'], $this->indent); // Useful with link metadata
			$this->smarty->assign($this->smarty_assigns['http_accept'], $this->HTTP_ACCEPT); // Useful with link metadata
			// could also add this to get the charset
			// $this->smarty->assign('charset', $this->smarty->encoding);
		} // end if
		else {
			$countlinkmeta = count($this->linkmeta_lm);
			$linkmetadata .= "\n";
			for ($i = 0; $i < $countlinkmeta; $i++) {
				$linkmetadata .= <<<HERE
{$this->indent}<link href="{$this->linkmeta_href[$i]}" rel="{$this->linkmeta_lm[$i]}" title="{$this->linkmeta_title[$i]}" type="{$this->HTTP_ACCEPT}" />\n
HERE;
			} // end for
			return $linkmetadata;
		} // end else		

	} // end function getLinkMetaData

	public function getPageTitle() {
		$allpgs = $this->xml->xpath("//pg");
		foreach ((array) $allpgs as $allpg) {
			$allpg_request = (string) $allpg['request'];
			$allpg_reqd = (string) $allpg['reqd'];
			if (strstr($allpg['file'], $this->localiz_pref)) {
				$allpg['file'] = call_user_func(array(&$this, 'eval_print'), $allpg['file']);
			} // end if
			$allbaseplusfile = $allpg['baseurl'].$allpg['file'];
			$is_page = $this->navcrumbs_is_a_page($allbaseplusfile, $allpg_reqd, $allpg_request);
			if ($is_page) {
				if ($this->smarty != NULL) {
					$this->smarty->assign($this->smarty_assigns['this_pg_dir'], $allpg['dir']);
					$this->smarty->assign($this->smarty_assigns['this_pg_tooltip'], $allpg['tooltip']);
					$this->smarty->assign($this->smarty_assigns['this_pg_title'], strip_tags($allpg->asXML())); // Can also be used as the page's title
					
/* This may no longer apply since localized above
{* Use this form within Smarty to get the page's title (and the like) if one is localizing *}
{capture assign=thispgtitle}
title: {$this_pg_title}<br />
{/capture}
{eval var=$thispgtitle}
*/
				} // end if
				else {
					$grouplabel = call_user_func(array(&$this, 'eval_print'), strip_tags($allpg->asXML()));
					return $grouplabel;
				} // end else
				break;
			} // end if
		} // end foreach
	} // end function getPageTitle


// Note that this function returns Next/Prev links, but also breadcrumbs in the process, as the two are closely interrelated. Fix: This could be made as a separate function (or at lesat conditional within the getBreadcrumbs function, so that the Smarty data is not being necessarily obtained for both).

	public function getNextPrev() {
		if ($this->smarty != NULL) {
			return $this->getBreadcrumbs();		
		} // end if
		else {
			return $this->getBreadcrumbs(TRUE);
		} // end else
	} // end function getBreadcrumbs


	public function getSiteMap($type = 'alph') { // Can be 'alph', 'hier', or 'category' (nested is only relevant if hierarchical, in which case it is the default)
		if ($type === 'alph') {
			return $this->getPullDown(false, true); // TRUE = yes, invoke sitemap (though the function is for pulldown menus, the code can produce a sitemap conveniently)
		} // end if
		elseif ($type === 'hier') {
			$this->getSiteMapHier();
			// Fix: In order to give the fullest flexibility for easy customization, this could be assigned as various Smarty variables (as do the other functions) to be reconstructed using the recursive Smarty plugin (func and defunc) within a template (rather than only having the option of having the HTML being added within the function), but that would also require building a multidimensional array within getSiteMapHier
			if ($this->smarty != NULL) {
				$this->smarty->assign($this->smarty_assigns['hiermap_nesting'], $this->hieroutput);
				return true;
			} // end if
			else {
				$this->hieroutput .= "</div>";
				return $this->hieroutput;
			} // end else
		} // end elseif
		else { // Produces a categorized listing of headings and pages as subheadings, but no nesting
			$this->optgroup_out = '';
			$this->getOptGroup(TRUE);
			if ($this->smarty == NULL) {
				return $this->semi_hieroutput;
			} // end if
		} // end else
	} // end function 

	// Fix: If optgroups can become hierarchical, could conditionally call getSiteMapHier with that option (need to add the functionality first!)
	// Note: $sitemap is for a non-nested but partially hierarchical sitemap (could make all of the adds to semi_hieroutput as conditional)

	public function getOptGroup($sitemap = FALSE) {
		global ${$this->localiz_var};
			
		if ($this->opt_category != '') {
			if (${$this->localiz_var}[$this->opt_category] != '') {
				$categoraddit = '('.ucfirst(${$this->localiz_var}[$this->opt_category]).') ';
			} // end if
			else {
				$categoraddit = '('.ucfirst($this->opt_category).') ';
			} // end else
		} // end if
		else {
			$categoraddit = '';
		} // end else
		if ($this->sitemap != '') {
			$sitem = ucfirst(${$this->localiz_var}[$this->sitemap]);
			if ($sitem == '') {
				$sitem = ucfirst($this->sitemap);
			} // end if
		} // end if
		else {
			$sitem = '';
		} // end else
		$ind = $this->indent; // Fix: Could add this
		$this->semi_hieroutput = <<<HERE
<div class="sitemapblockB">
<div class="sitemapheading">{$categoraddit}{$sitem}:</div>
HERE;

		$this->semi_hieroutput .= '<ul>';
			
		if ($this->optgroup_out == '') {
		// Could add this to the select: dir="'.$this->optgroup_dir.'"
			$this->optgroup_out = '<div class="navmenu"><form action="'.$this->redirect_pg.'" id="navmenu2" method="post">'."\n".'<select class="navmenuform" name="navbar2" id="navbar2" size="1" onchange="javascript:getElementById('."'navmenu2'".').submit();">'."\n";

			if ($this->opt_choosepage != '') {
				$opt_choosepage = ${$this->localiz_var}[$this->opt_choosepage];
				if ($opt_choosepage == '') {
					$opt_choosepage = $this->opt_choosepg;
				} // end if
			} // end if
			else {
				$opt_choosepage = '';
			} // end else
			
			if ($this->opt_hierarch != '') {
				if (${$this->localiz_var}[$this->opt_hierarch] != '') {
					$hieradd = ' ('.${$this->localiz_var}[$this->opt_hierarch].')';
				} // end if
				else {
					$hieradd = ' ('.$this->opt_hierarch.')';
				} // end else
			} // end if
			else {
				$hieradd = '';
			} // end else
		} // end if
		$this->optgroup_out .= '<option selected="selected" value="">'.$opt_choosepage.$hieradd.'</option>'."\n";
		
		$groups = $this->xml->xpath("//group");
		
		foreach ((array) $groups as $group) {

			$showconditions = !in_array(
					 trim((string) $group['show']), array('no', 'nonentry')) && 
					 !strstr(trim((string) $group['show']), 'admin'
					);
			if ($showconditions) {
				// Fix: Make the optgroup eval localizable
				
				if ($this->smarty == NULL) {
					$group['label'] = call_user_func(array(&$this, 'eval_print'), $group['label']);
				} // end if
				// Could add the following within the optgroup: dir="'.$group['dir'].'"
				$this->optgroup_out .= '<optgroup label="'.$group['label'].'">'."\n";
				// Could add the following within the <h{$this->headnum}>'s: dir='".$group['dir']."'
				$this->semi_hieroutput .= '<li class="listhead">'."<h{$this->headnum}>".$group['label']."</h{$this->headnum}><ul>\n";

				$pgs = $this->xml->xpath("//group[@id='".trim((string) $group['id'])."']/pg");
				foreach ((array) $pgs as $pg) {
					$showconditions = !in_array(
							 trim((string) $pg['show']), array('no', 'nonentry')) && 
							 !strstr(trim((string) $pg['show']), 'admin'
							);
					if ($showconditions) {
					
						if ($this->smarty == NULL) {
							$pg2 = call_user_func(array(&$this, 'eval_print'), $pg);
						} // end if
						else {
							$pg2 = $pg;
						} // end else
						if (strstr($pg['file'], $this->localiz_pref)) {
							$pg['file'] = call_user_func(array(&$this, 'eval_print'), $pg['file']);
						} // end if

						// Could add the following within the option and list: dir="'.$pg['dir'].'"
						$this->optgroup_out .= '<option value="'.(string) $pg['baseurl'].$pg['file'].$pg['get'].'">'.$pg2."</option>\n";
						$this->semi_hieroutput .= '<li class="listitem"><a href="'.(string) $pg['baseurl'].$pg['file'].$pg['get'].'">'.$pg2."</a></li>\n";
					} // end if
				} // end foreach
				$this->optgroup_out .= "</optgroup>\n";
				$this->semi_hieroutput .= "</ul></li>\n";
			} // end if
		} // end foreach

		$this->optgroup_out .= "</select>\n<noscript><input class='navmenuform' type='submit' value='".$this->submitval."' /></noscript></form></div>\n";
		$this->semi_hieroutput .= "</ul></div>\n";
		
		// Fix: This could be added via various Smarty variables and a template
		if ($this->smarty != NULL && !$sitemap) {
			$this->smarty->assign($this->smarty_assigns['optgroup_out'], $this->optgroup_out);
		} // end if
		elseif ($this->smarty != NULL && $sitemap) {
			$this->smarty->assign($this->smarty_assigns['hiermap_no_nesting'], $this->semi_hieroutput);
		} // end else
		else {
			return $this->optgroup_out;
		} // end else

	} // end function getOptGroup

	private function eval_print($a) {
		global ${$this->localiz_var};

		$a = preg_replace('@'.preg_quote($this->localiz_pref).'(.*?)'.preg_quote($this->localiz_suff).'@', "{\$".$this->localiz_var."['$1']}", $a);
		$a = '$b = "'.str_replace('"', '\"', $a).'";';

		eval($a);
		return $b;
	} // end function eval_print

	// The following could be performed probably much more easily with XSLT, but this is not a default extension
	// Fix: If groups have no elements, may cause problems? (however, a sitemap would presumably not have headings unless there were pages within the headings)
	// Note: Don't run this directly as it doesn't produce a return value
	public function getSiteMapHier($pages = '') {
		global ${$this->localiz_var};
		if ($pages == '') {
			$pages = $this->xml;
//			$dom = dom_import_simplexml($pages);
		} // end if
		if ($this->headnum2 == '') {
			$this->headnum2 = $this->headnum; // Start with default base
			if ($this->opt_hierar != '') {
				if (${$this->localiz_var}[$this->opt_hierar] != '') {
					$hieraddit = '('.ucfirst(${$this->localiz_var}[$this->opt_hierar]).') ';
				} // end if
				else {
					$hieraddit = '('.ucfirst($this->opt_hierar).') ';
				} // end else
			} // end if
			else {
				$hieraddit = '';
			} // end else
			$sitem = ucfirst(${$this->localiz_var}[$this->sitemap]);
			if ($sitem == '') {
				$sitem = ucfirst($this->sitemap);
			} // end if
			$ind = $this->indent; // Fix: Could add this
			$this->hieroutput = <<<HERE
<div class="sitemapblockC">
<div class="sitemapheading">{$hieraddit}{$sitem}:</div>
HERE;
			$this->hieroutput .= '<ul>';
		} // end if

		foreach($pages->children() as $elem => $page) {
			$showconditions = !in_array(
					 trim((string) $page['show']), array('no', 'nonentry')) && 
					 !strstr(trim((string) $page['show']), 'admin'
					);
			if ($this->smarty == NULL) {
				$page['label'] = call_user_func(array(&$this, 'eval_print'), $page['label']);
				$page2 = call_user_func(array(&$this, 'eval_print'), $page);
				if (strstr($page['file'], $this->localiz_pref)) {
					$page['file'] = call_user_func(array(&$this, 'eval_print'), $page['file']);
				} // end if

			} // end if
			else {
				$page2 = $page;
			} // end else
			if (trim((string) $elem) === 'group' && $showconditions) {
				// Could add the following within the <h{$this->headnum2}>'s: dir='".$page['dir']."'
				$this->hieroutput .= '<li class="listhead2">'."<h{$this->headnum2}>".$page['label']."</h{$this->headnum2}><ul>\n";
				++$this->headnum2;
			} // end if
			elseif ($showconditions && (trim((string) $page) != '')) {
				$this->hieroutput .= '<li class="listitem2">'."<a href='".$page['file']."'>".$page2."</a></li>\n";
			} // end if
			
			// Close group if last page in group and no subsequent group
			$test = $page->xpath("../pg[last()]/@id");

			$test2 = !count($page->xpath("following-sibling::group")); // SimpleXML (and possibly DOM extension) do not yet support the count function via XPath, as it doesn't return a nodeset

			if ((string) $test[0] === trim((string) $page['id']) && $showconditions && $test2) {
				// If recursive parent of last pg is last group (and no subseq. page) OR no pgs in grp, close it too

				// Get parent id
				$test4 = $page->xpath("..");
				$testA = trim((string) $test4[0]['id']);

				// Get grandparent
				//  and following-sibling != 'pg'
				$test5 = $page->xpath("../../group[last()]");
				$testB = trim((string) $test5[0]['id']);

				if (!is_object($test5[0])) {
					return;
				} // end if
		
				$testC = count($test5[0]->xpath("following-sibling::pg"));

				if ($testA === $testB && !$testC) {
					$this->hieroutput .= "</ul></li>\n";
					--$this->headnum2;
					$this->recursHier($test5[0]);
				} // end if
				else {
					$this->hieroutput .= "</ul></li>\n"; // Close group tags if on last page (and no subseq. group)
					--$this->headnum2;
				} // end else
			} // end if
			$this->getSiteMapHier($page);
		} // end foreach
		return;
	} // end function

	protected function recursHier($page) {
		// Get parent id
		static $ctr; $ctr++;
		if ($ctr > 10) {
			return;
		} // end if
		
		$test4 = $page->xpath("..");
		$testA = trim((string) $test4[0]['id']);

		// Get grandparent
		$test5 = $page->xpath("../../group[last()]");
		$testB = trim((string) $test5[0]['id']);

		if (!is_object($test5[0])) {
			$this->hieroutput .= '</ul>';
			return;
		} // end if
		$testC = count($test5[0]->xpath("following-sibling::pg"));

		if ($testA === $testB && !$testC) {
			$this->hieroutput .= "</ul></li>\n";
			--$this->headnum2;
			$this->recursHier($test5[0]);
		} // end if
	} // end function recursHier

	public function getPullDown($hier = FALSE, $sitemap = FALSE) { // The sitemap should not be set here, but is instead used for convenience within the getSiteMap function (which is what should be used to make a site map)
		if ($hier || $hier == 'hier') { // Allows option for specification of a hierarchical pulldown
			$this->optgroup_out = '';
			$this->getOptGroup();
			return $this->optgroup_out;
		} // end if
		global ${$this->localiz_var};

		$allpgs = $this->xml->xpath("//pg[not(@show='no') and not(@show='nonentry') and not(contains(@show, 'admin'))]");
		foreach ((array) $allpgs as $allpg) {
			
			$pulldownname[] = trim((string) strip_tags($allpg->asXML())); // Couldn't get asXML to work
			$pulldowndir[] = (string) $allpg['dir'];
			
			if ($this->smarty == NULL) {
				if (strstr($allpg['file'], $this->localiz_pref)) {
					$allpg['file'] = call_user_func(array(&$this, 'eval_print'), $allpg['file']);
				} // end if
			} // end if
			$pulldownhref[] = (string) $allpg['baseurl'].$allpg['file'].$allpg['get'];
			$pulldowntooltip[] = (string) $allpg['tooltip'];
		} // end foreach

		// Fix: Could perform this other variable processing on the other variables
		$pulldownname2 = array_map(array(&$this, 'eval_print'), $pulldownname);

		$arraykeys = array_keys($pulldownname); // Ensures multisort will not have subsorting
		array_multisort($pulldownname2, SORT_ASC, SORT_STRING, $arraykeys, SORT_ASC, SORT_NUMERIC, $pulldownname, $pulldowndir, $pulldownhref, $pulldowntooltip);


		$temparr = array_unique($pulldownname2);
		$temparr_condit = count($temparr) <= 1 && $temparr[0] == '';
		if ($sitemap) {
			if ($temparr_condit) { // This should only occur if there is a Smarty variable in the sitemap data but no localization translation data available (at least to the script via $this->localiz_var)
				array_multisort($pulldownname, SORT_ASC, SORT_STRING, $arraykeys, SORT_ASC, SORT_NUMERIC, $pulldownname, $pulldowndir, $pulldownhref, $pulldowntooltip);
				$this->sitemap_name = $pulldownname;
			} // end if
			else {
				$this->sitemap_name = $pulldownname2;
			} // end else
			$this->sitemap_dir = $pulldowndir;
			$this->sitemap_href = $pulldownhref;
			$this->sitemap_tooltip = $pulldowntooltip;
		} // end if
		else {
			if ($temparr_condit) { // This should only occur if there is a Smarty variable but no localization data
				array_multisort($pulldownname, SORT_ASC, SORT_STRING, $arraykeys, SORT_ASC, SORT_NUMERIC, $pulldownname, $pulldowndir, $pulldownhref, $pulldowntooltip);
				$this->pulldown_name = $pulldownname;
			} // end if
			else {
				$this->pulldown_name = $pulldownname2;
			} // end else
			$this->pulldown_dir = $pulldowndir;
			$this->pulldown_href = $pulldownhref;
			$this->pulldown_tooltip = $pulldowntooltip;
		} // end else
		if ($this->smarty != NULL && !$sitemap) {
			$this->smarty->assign($this->smarty_assigns['head_ind'], $this->indent);
			$this->smarty->assign($this->smarty_assigns['pulldown_ind'], $this->indent);
			$this->smarty->assign($this->smarty_assigns['pulldown_ind2'], $this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['pulldown_ind3'], $this->indent.$this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['pulldown_name'], $this->pulldown_name);
			$this->smarty->assign($this->smarty_assigns['pulldown_name'], $this->pulldown_name);
			$this->smarty->assign($this->smarty_assigns['pulldown_dir'], $this->pulldown_dir);
			$this->smarty->assign($this->smarty_assigns['pulldown_href'], $this->pulldown_href);
			$this->smarty->assign($this->smarty_assigns['pulldown_tooltip'], $this->pulldown_tooltip);
		} // end if
		elseif ($this->smarty != NULL) {
			$this->smarty->assign($this->smarty_assigns['head_ind'], $this->indent);
			$this->smarty->assign($this->smarty_assigns['sitemap_ind'], $this->indent);
			$this->smarty->assign($this->smarty_assigns['sitemap_ind2'], $this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['sitemap_ind3'], $this->indent.$this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['sitemap_name'], $this->sitemap_name);
			$this->smarty->assign($this->smarty_assigns['sitemap_dir'], $this->sitemap_dir);
			$this->smarty->assign($this->smarty_assigns['sitemap_href'], $this->sitemap_href);
			$this->smarty->assign($this->smarty_assigns['sitemap_tooltip'], $this->sitemap_tooltip);
		} // end elseif
		elseif ($sitemap) {
			$ind = $this->indent;
			
			if ($this->opt_alphab != '') {
				if (${$this->localiz_var}[$this->opt_alphab] != '') {
					$alphadd = '('.ucfirst(${$this->localiz_var}[$this->opt_alphab]).') ';
				} // end if
				else {
					$alphadd = '('.ucfirst($this->opt_alphab).') ';
				} // end else
			} // end if
			else {
				$alphadd = '';
			} // end else
			
			$sitem = ucfirst(${$this->localiz_var}[$this->sitemap]);
			if ($sitem == '') {
				$sitem = ucfirst($this->sitemap);
			} // end if
			$sitemapreturn .= <<<HERE
{$ind}<div class="sitemapblockA">
{$ind}{$ind}<div class="sitemapheading">{$alphadd}{$sitem}:</div>
{$ind}{$ind}<ul>\n
HERE;
			$countsitemap = count($this->sitemap_name);
			for ($i=0; $i < $countsitemap; $i++) {
				// Could add the following within the anchor: dir="{$this->sitemap_dir[$i]}"
				$sitemapreturn .= <<<HERE
{$ind}{$ind}{$ind}<li><a href="{$this->sitemap_href[$i]}" title="{$this->sitemap_tooltip[$i]}">{$this->sitemap_name[$i]}</a></li>\n
HERE;
			} // end for
			$sitemapreturn .= <<<HERE
{$ind}{$ind}</ul>\n
HERE;
			// Fix: Any additional columns should be sandwiched here
			$sitemapreturn .= <<<HERE
</div>
HERE;
			return $sitemapreturn;
		} // end elseif
		else {

			$ind = $this->indent;

			// Could add the following within the select: dir="{$this->select_dir}"
			$pulldown .= <<<HERE
{$ind}<div class="navmenu">
{$ind}{$ind}<form action="{$this->redirect_pg}" id="navmenu" method="post">
{$ind}{$ind}{$ind}<select class="navmenuform" name="navbar" id="navbar" size="1" onchange="javascript:getElementById('navmenu').submit();">
{$ind}{$ind}{$ind}{$ind}<option selected="selected" value="">
HERE;
			global ${$this->localiz_var};

			if ($this->opt_choosepage != '') {
				$opt_choosepage = ${$this->localiz_var}[$this->opt_choosepage];
				if ($opt_choosepage == '') {
					$opt_choosepage = $this->opt_choosepg;
				} // end if
			} // end if
			else {
				$opt_choosepage = '';
			} // end else

			if ($this->opt_alph != '') {
				if (${$this->localiz_var}[$this->opt_alph] != '') {
					$alphadd = ' ('.${$this->localiz_var}[$this->opt_alph].')';
				} // end if
				else {
					$alphadd = ' ('.$this->opt_alph.')';
				} // end else
			} // end if
			else {
				$alphadd = '';
			} // end else
			$pulldown .= $opt_choosepage.$alphadd."</option>\n";

			$countopts = count($this->pulldown_name);
			for ($i=0; $i < $countopts; $i++) {
				// Could add the following within the option: dir="{$this->pulldown_dir[$i]}"
				$pulldown .= <<<HERE
{$ind}{$ind}{$ind}{$ind}<option value="{$this->pulldown_href[$i]}">{$this->pulldown_name[$i]}</option>\n
HERE;
			} // end for
			// Could add the following: dir="{$this->input_dir}"
			$pulldown .= <<<HERE
</select>
<noscript><input class="navmenuform" type="submit" value="{$this->submitval}" /></noscript></form></div>\n
HERE;
			return $pulldown;
		} // end else			
	} // end function 


	public function getBreadcrumbs($return_nextprev = FALSE) { // The return_nextprev boolean is only relevant for non-Smarty returning (of next/prev links without breadcrumbs) and should, for clarity, be set via the getNextPrev function instead of directly here)

		if ($this->smarty != NULL) {
			$this->smarty->assign($this->smarty_assigns['crumbs_separator'], $this->separator);
		} // end if

		$allpgs = $this->xml->xpath("//pg");
		foreach ((array) $allpgs as $allpg) {
			$allpg_request = (string) $allpg['request'];
			$allpg_reqd = (string) $allpg['reqd'];
			if (strstr($allpg['file'], $this->localiz_pref)) {
					$allpg['file'] = call_user_func(array(&$this, 'eval_print'), $allpg['file']);
			} // end if
			$allbaseplusfile = $allpg['baseurl'].$allpg['file'];
			$is_page = $this->navcrumbs_is_a_page($allbaseplusfile, $allpg_reqd, $allpg_request);

			if ($is_page) {
			
				if ($this->smarty != NULL) {
					$this->smarty->assign($this->smarty_assigns['crumbs_currdir'], $allpg['dir']);
					$this->smarty->assign($this->smarty_assigns['crumbs_currtooltip'], $allpg['tooltip']);
					$this->smarty->assign($this->smarty_assigns['crumbs_currname'], strip_tags($allpg->asXML())); // Can also be used as the page's title
				} // end if
				$this->crumbs_currtooltip = $allpg['tooltip'];
				$this->crumbs_currdir = $allpg['dir'];
				
				if ($this->smarty == NULL) {
					$this->crumbs_currname = call_user_func(array(&$this, 'eval_print'), strip_tags($allpg->asXML()));
				} // end if
				else {
					$this->crumbs_currname = strip_tags($allpg->asXML());
				} // end else

				$this->find_breadcrumbs((string) $allpg['prev']);

				$crumbs_dir = $this->crumbs_dir = array_reverse($this->crumbs_dir);
				$crumbs_href = $this->crumbs_href = array_reverse($this->crumbs_href);

				$crumbs_tooltip = $this->crumbs_tooltip = array_reverse($this->crumbs_tooltip);
				$crumbs_name = $this->crumbs_name = array_reverse($this->crumbs_name);
				
				if ($this->smarty != NULL) {
					$this->smarty->assign($this->smarty_assigns['crumbs_ind'], $this->indent);
					$this->smarty->assign($this->smarty_assigns['crumbs_ind2'], $this->indent.$this->indent);
					$this->smarty->assign($this->smarty_assigns['crumbs_dir'], $this->crumbs_dir);

					$this->smarty->assign($this->smarty_assigns['crumbs_href'], $this->crumbs_href);
					$this->smarty->assign($this->smarty_assigns['crumbs_tooltip'], $this->crumbs_tooltip);
					$this->smarty->assign($this->smarty_assigns['crumbs_name'], $this->crumbs_name);
				} // end if
		
				// Next/Prev data
				if ($this->smarty != NULL) {
					$this->smarty->assign($this->smarty_assigns['nextprev_flag'], 1);
				} // end if
				$this->nextprev_np = $this->nextprev_href = $this->nextprev_title = array();
				if (end($this->crumbs_href) != '') {
					$this->nextprev_np[] = 'Prev';
					$this->nextprev_href[] = end($this->crumbs_href);
					$this->nextprev_title[] = end($this->crumbs_name);
				} // end if
				$this->crumbs_href = $this->crumbs_name = array();
				$this->find_breadcrumbs((string) $allpg['next']);
				if (end($this->crumbs_href) != '') {
					$this->nextprev_np[] = 'Next';
					$this->nextprev_href[] = end($this->crumbs_href);
					$this->nextprev_title[] = end($this->crumbs_name);
				} // end if

				if ($this->smarty != NULL) {
					$this->smarty->assign($this->smarty_assigns['nextprev_np'], $this->nextprev_np);
					$this->smarty->assign($this->smarty_assigns['nextprev_href'], $this->nextprev_href);
					$this->smarty->assign($this->smarty_assigns['nextprev_title'], $this->nextprev_title);
				} // end if
				elseif ($return_nextprev) {
					$countnextprev = count($this->nextprev_np);
					$nextprev .= "\n";
					for ($i = 0; $i < $countnextprev; $i++) {
						$nextprev .= <<<HERE
{$this->indent}<link href="{$this->nextprev_href[$i]}" rel="{$this->nextprev_np[$i]}" title="{$this->nextprev_title[$i]}" type="{$this->HTTP_ACCEPT}" />\n
HERE;
					} // end for
					return $nextprev;
				} // end elseif
				else {
					$breadcrumbs = <<<HERE
\n{$this->indent}<div class='breadcrumbs'> &nbsp; &nbsp; &nbsp; &nbsp; <br />\n
HERE;
					$countcrumbs = count($crumbs_name);
					for ($i=0; $i < $countcrumbs; $i++) {
						$breadcrumbs .= <<<HERE
{$this->indent}{$this->indent}<a class="breadcrumbs" href="{$crumbs_href[$i]}" title="{$crumbs_tooltip[$i]}">{$crumbs_name[$i]}</a>
{$this->indent}{$this->indent}<span class="breadcrumbs">{$this->separator}</span>\n
HERE;
					} // end for
					$breadcrumbs .= <<<HERE
{$this->indent}{$this->indent}<span class="breadcrumbs" title="{$this->crumbs_currtooltip}">{$this->crumbs_currname}</span></div>
HERE;
					return $breadcrumbs;
				} // end else
				break;
			} // end if
		} // end foreach
		
	} // end function getBreadcrumbs


	public function getNavbar() {

		$pgs = $this->xml->xpath("//pg[@navbar='yes']");
		foreach ((array) $pgs as $pg) {
			$this->arr_baseurl[] = (string) $pg['baseurl'];

			if ($this->smarty == NULL) {
				if (strstr($pg['file'], $this->localiz_pref)) {
					$pg['file'] = call_user_func(array(&$this, 'eval_print'), $pg['file']);
				} // end if
			} // end if
			$this->arr_file[] = (string) $pg['file'];
			$this->arr_get[] = (string) $pg['get'];
		
			$pg_request = (string) $pg['request'];
			$pg_reqd = (string) $pg['reqd'];
			$baseplusfile = $pg['baseurl'].$pg['file'];
		
			$this->arr_wholeurl[] = $baseplusfile.$pg['get'];
		//	$this->arr_reqdurl[] = $baseplusfile;
			$this->arr_tooltip[] = (string) $pg['tooltip'];
			
			if ($this->smarty == NULL) {
				$arrasxml = call_user_func(array(&$this, 'eval_print'), strip_tags($pg->asXML()));
			} // end if
			else {
				$arrasxml = strip_tags($pg->asXML());
			} // end else
			$this->arr_asXML[] = $arrasxml;
		
			$is_page = $this->navcrumbs_is_a_page($baseplusfile, $pg_reqd, $pg_request);
			if ($is_page) {
				$this->arr_show[] = 0;
			} // end if
			else {
				$this->arr_show[] = 1;
			} // end else
		
	
		} // end foreach
		if ($this->smarty != NULL) {
			$this->smarty->assign($this->smarty_assigns['navbar_ind'], $this->indent);
			$this->smarty->assign($this->smarty_assigns['navbar_ind2'], $this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['navbar_ind3'], $this->indent.$this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['navbar_ind4'], $this->indent.$this->indent.$this->indent.$this->indent);
			$this->smarty->assign($this->smarty_assigns['navbar_baseurl'], $this->arr_baseurl);
			$this->smarty->assign($this->smarty_assigns['navbar_file'], $this->arr_file);
			$this->smarty->assign($this->smarty_assigns['navbar_get'], $this->arr_get);
			$this->smarty->assign($this->smarty_assigns['navbar_show'], $this->arr_show);
			//$this->smarty->assign($this->smarty_assigns['navbar_reqdurl'], $this->arr_reqdurl);
			$this->smarty->assign($this->smarty_assigns['navbar_wholeurl'], $this->arr_wholeurl);
			$this->smarty->assign($this->smarty_assigns['navbar_tooltip'], $this->arr_tooltip);
			$this->smarty->assign($this->smarty_assigns['navbar_content'], $this->arr_asXML);
		} // end if
		$totalcells = count($this->arr_file);
		$navwidth = 100/($totalcells);
		$navwidth -= $this->navwidthoffset; // Need to shrink the width a little to allow for the drop-down menu to fit in the nav bar
		$this->navwidth = $navwidth;
		if ($this->smarty != NULL) {
			$this->smarty->assign($this->smarty_assigns['navbar_width'], $this->navwidth);
		} // end if
		else {
			$countnavbarfile = count($this->arr_file);
			$navbar .= <<<HERE
{$this->indent}<div class="navigatorhead">\n
HERE;
			for ($i=0; $i < $countnavbarfile; $i++) {
				if (!$this->arr_show[$i]) {
					$navbar .= <<<HERE
{$this->indent}{$this->indent}<div class="navigator" title="{$this->arr_tooltip[$i]}">{$this->arr_asXML[$i]}</div>\n
HERE;
				} // end if
				else {
					$navbar .= <<<HERE
{$this->indent}{$this->indent}<div class="navigator">
{$this->indent}{$this->indent}{$this->indent}<a href="{$this->arr_wholeurl[$i]}" title="{$this->arr_tooltip[$i]}">{$this->arr_asXML[$i]}</a></div>\n
HERE;
				} // end else
			} // end for
			$navbar .= <<<HERE
{$this->indent}</div>\n
HERE;
			return $navbar;
		} // end else
		
	} // end function getNavbar

} // end class navbarcrumbs

?>