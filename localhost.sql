
CREATE TABLE `auto_field_data` (
  `id` int(11) NOT NULL,
  `stringkey` text,
  `tablekey` text,
  `tablekeyno` text,
  `placement` smallint(6) NOT NULL DEFAULT '0',
  `lang_code` text,
  `field_reference` text,
  `field_reference2` text,
  `field_reference3` text,
  `param1` text,
  `param2` text,
  `lang_category` text,
  `checkbox` tinyint(4) NOT NULL DEFAULT '0',
  `funct_call` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `auto_field_data` (`id`, `stringkey`, `tablekey`, `tablekeyno`, `placement`, `lang_code`, `field_reference`, `field_reference2`, `field_reference3`, `param1`, `param2`, `lang_category`, `checkbox`, `funct_call`) VALUES
(1, 'wordbyword', '', '--alvah_va_Saya-yi_Mubarikih--Hidden Words--', -1, 'en', '', 'Note1: Put tablekey as specific book if want to limit it to a given book\r\nNote2: from tablekeyno Already cached so commenting this out for --Hidden Words--if need automation done on new proofread copy, remove the book\'s title', 'Note3: Put as Persian to limit to fields with this name; otherwise works on all regular fa (from lang_category) fields (in field_data)', 'Persian', 'English', 'fa', 0, 'wordbyword'),
(2, 'wordbyword1', '', '--alvah_va_Saya-yi_Mubarikih--Hidden Words--', -1, 'en', '', '', '', 'Persian', 'bcode', 'fa', 0, 'wordbyword'),
(3, 'googlify', '', '--Collins--alvah_va_Saya-yi_Mubarikih--wwtf--', -1, '', '', '', '', '', '', '', 0, 'googlify'),
(4, 'googledefine', '', '--alvah_va_Saya-yi_Mubarikih--wwtf--', -1, '', '', '', '', 'define:', '', '', 0, 'googlify'),
(5, 'wordbyword2', '', '--alvah_va_Saya-yi_Mubarikih--Hidden Words--', -1, 'fa', '', '', '', 'Persian', 'Persian', 'fa', 0, 'wordbyword'),
(6, 'wikify', '', '', -1, '', '', '', '', '', '', '', 0, 'wikify'),
(7, 'wikilinks', '', '', 0, '', '', '', '', '', '', '', 1, 'wikilinks'),
(8, 'alias_fielding1', 'Bible', '', 0, 'en', '', '', '', '', '', '', 1, 'alias_fielding'),
(9, 'alias_fielding2', 'quran', '', 0, 'en', '', '', '', '', '', '', 1, 'alias_fielding');

CREATE TABLE `table_data` (
  `table_name` text,
  `browse_levels` tinyint(4) NOT NULL DEFAULT '0',
  `browse_options` tinyint(4) NOT NULL DEFAULT '0',
  `browse_field_A` text,
  `browse_field_B` text,
  `browse_field_C` text,
  `browse_field_1` text,
  `browse_field_2` text,
  `browse_field_3` text,
  `default_field` text,
  `default_value` tinyint(4) NOT NULL DEFAULT '0',
  `default_field2` text,
  `default_field_value2` tinyint(4) NOT NULL DEFAULT '0',
  `toggle1` text,
  `toggle2` text,
  `toggleall` text,
  `fieldtoggle` text,
  `function_field` text,
  `alias_field` text,
  `escapehtml` tinyint(1) NOT NULL DEFAULT '0',
  `outputhtml` tinyint(1) NOT NULL DEFAULT '0',
  `orig_lang_code` text,
  `orig_edit_lang` text
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


INSERT INTO `table_data` (`table_name`, `browse_levels`, `browse_options`, `browse_field_A`, `browse_field_B`, `browse_field_C`, `browse_field_1`, `browse_field_2`, `browse_field_3`, `default_field`, `default_value`, `default_field2`, `default_field_value2`, `toggle1`, `toggle2`, `toggleall`, `fieldtoggle`, `function_field`, `alias_field`, `escapehtml`, `outputhtml`, `orig_lang_code`, `orig_edit_lang`) VALUES
('Bible', 3, 1, 'Book #', 'Chapter #', 'Verse #', '', '', '', 'Book #', 1, '', 0, '', '', '', '', 'King James Translation', 'Book #', 0, 0, '', ''),
('Hidden Words', 1, 1, 'Number', '', '', '', '', '', '', 0, '', 0, 'Persian', 'Arabic', '', 'Original Language', 'Text', '', 0, 0, '', ''),
('aqdas', 1, 1, 'Paragraph', '', '', '', '', '', 'Paragraph', 1, '', 0, '', '', '', '', 'Text', '', 0, 0, 'ar', ''),
('iqan', 2, 2, 'Paragraph', 'Page', '', 'Page', 'Paragraph', '', 'Paragraph', 1, '', 0, '', '', '', '', 'Text', '', 0, 1, 'fa', ''),
('peace', 1, 2, 'Par.', '', '', 'Section', '', '', '', 0, '', 0, '', '', '', '', 'Text (English)', '', 0, 0, 'en', ''),
('quran', 2, 2, 'Traditional Suráh #', 'Verse #', '', 'Rodwell Suráh #', 'Verse #', '', 'Traditional Suráh #', 1, '', 0, '', '', '', '', 'Rodwell Translation', 'Traditional Suráh #', 0, 0, 'ar', ''),
('Collins', 1, 2, 'Record ID', '', '', 'Date of Publication', '', '', 'Record ID', 1, '', 0, '', '', '', '', 'Abstract', '', 0, 0, 'en', ''),
('wwtf', 2, 0, 'Section', 'Paragraph', '', '', '', '', 'Section', 0, 'Paragraph', 0, '', '', '', '', 'Text (Chinese)', '', 0, 0, 'en', ''),
('alvah_va_Saya-yi_Mubarikih', 1, 0, 'Page', '', '', '', '', '', 'Page', 1, '', 0, '', '', '', '', 'Text', '', 0, 0, 'fa', 'fa'),
('gleanings', 1, 0, 'Section', '', '', '', '', '', 'Section', 1, '', 0, '', '', '', '', 'Text', '', 0, 0, '', ''),
('Epistle to the Son of the Wolf', 0, 0, 'Paragraph', '', '', '', '', '', 'Paragraph', 0, '', 0, '', '', '', '', 'Text', '', 0, 0, 'ar', ''),
('Gems of Divine Mysteries', 0, 0, 'Paragraph', '', '', '', '', '', 'Paragraph', 0, '', 0, '', '', '', '', 'Text', '', 0, 0, 'ar', ''),
('pm', 0, 0, 'Number', '', '', '', '', '', 'Number', 1, '', 0, '', '', '', '', 'Text', '', 0, 0, '', '');
