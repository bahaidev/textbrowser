/* eslint-env browser */
import IMF from 'imf';
import getSerializeParamsAsURL from './utils/getSerializeParamsAsURL.js';

import {getMetaProp, Metadata} from './utils/Metadata.js';
import {escapePlugin} from './utils/Plugin.js';

import Templates from './templates/index.js';

export default async function workDisplay ({
    l,
    lang, preferredLocale, languages, fallbackLanguages, $p
}) {
    const that = this;
    const langs = this.langData.languages;

    const fallbackDirection = this.getDirectionForLanguageCode(fallbackLanguages[0]);

    const prefI18n = localStorage.getItem(this.namespace + '-localizeParamNames');
    const localizeParamNames = $p.localizeParamNames = $p.has('i18n', true)
        ? $p.get('i18n', true) === '1'
        : prefI18n === 'true' || (
            prefI18n !== 'false' && this.localizeParamNames
        );

    const prefFormatting = localStorage.getItem(this.namespace + '-hideFormattingSection');
    const hideFormattingSection = $p.has('formatting', true)
        ? $p.get('formatting', true) === '0'
        : prefFormatting === 'true' || (
            prefFormatting !== 'false' && this.hideFormattingSection
        );

    function _displayWork ({
        lf, metadataObj, getFieldAliasOrName, schemaObj,
        pluginsForWork
    }) {
        const il = localizeParamNames
            ? key => l(['params', key])
            : key => key;
        const iil = localizeParamNames
            ? key => l(['params', 'indexed', key])
            : key => key;

        const localeFromLangData = languages.localeFromLangData.bind(languages);
        const imfLang = IMF({
            locales: lang.map(localeFromLangData),
            fallbackLocales: fallbackLanguages.map(localeFromLangData)
        }); // eslint-disable-line new-cap
        const imfl = imfLang.getFormatter();

        // Returns option element with localized option text (as Jamilih), with
        //   optional fallback direction
        const le = (key, el, attToLocalize, atts, children) => {
            atts[attToLocalize] = l({
                key,
                fallback: ({message}) => {
                    atts.dir = fallbackDirection;
                    return message;
                }
            });
            return [el, atts, children];
        };

        // Returns plain text node or element (as Jamilih) with fallback direction
        const ld = (key, values, formats) =>
            l({
                key,
                values,
                formats,
                fallback: ({message}) =>
                    Templates.workDisplay.bdo({fallbackDirection, message})
            });

        const schemaItems = schemaObj.items.items;

        const fields = schemaItems.map((schemaItem) => schemaItem.title);

        const fieldInfo = fields.map((field) => {
            return {
                field,
                fieldAliasOrName: getFieldAliasOrName(field) || field
            };
        });
        const metadata = new Metadata({metadataObj});

        const fieldMatchesLocale = metadata.getFieldMatchesLocale({
            namespace: this.namespace,
            preferredLocale, schemaItems,
            pluginsForWork
        });

        // Todo: In results, init and show plugin fields and anchor if they
        //         are chosen as (i18nized) anchor columns; remove any unused
        //         insert method already in plugin files
        if (pluginsForWork) {
            console.log('pluginsForWork', pluginsForWork);
            const {lang} = this; // array with first item as preferred
            pluginsForWork.iterateMappings(({
                plugin,
                pluginName, pluginLang,
                onByDefaultDefault,
                placement, applicableFields, meta
            }) => {
                const processField = ({applicableField, targetLanguage, onByDefault} = {}) => {
                    const plugin = pluginsForWork.getPluginObject(pluginName);
                    const applicableFieldLang = metadata.getFieldLang(applicableField);
                    if (plugin.getTargetLanguage) {
                        targetLanguage = plugin.getTargetLanguage({
                            applicableField,
                            targetLanguage,
                            // Default lang for plug-in (from files.json)
                            pluginLang,
                            // Default lang when no target language or
                            //   plugin lang; using the lang of the applicable
                            //   field
                            applicableFieldLang
                        });
                    }
                    const field = escapePlugin({
                        pluginName,
                        applicableField,
                        targetLanguage: targetLanguage || pluginLang ||
                            applicableFieldLang
                    });
                    if (targetLanguage === '{locale}') {
                        targetLanguage = preferredLocale;
                    }
                    const applicableFieldI18N = getMetaProp(lang, metadataObj, ['fieldnames', applicableField]);
                    const fieldAliasOrName = plugin.getFieldAliasOrName
                        ? plugin.getFieldAliasOrName({
                            locales: lang,
                            lf,
                            targetLanguage,
                            applicableField,
                            applicableFieldI18N,
                            meta,
                            targetLanguageI18N: languages.getLanguageFromCode(targetLanguage)
                        })
                        : languages.getFieldNameFromPluginNameAndLocales({
                            pluginName,
                            locales: lang,
                            lf,
                            targetLanguage,
                            applicableFieldI18N,
                            meta
                        });
                    fieldInfo.splice(
                        // Todo: Allow default placement overriding for
                        //    non-plugins
                        placement === 'end'
                            ? Infinity // push
                            : placement,
                        0,
                        {
                            field: `${this.namespace}-plugin-${field}`,
                            fieldAliasOrName,
                            // Plug-in specific (todo: allow specifying
                            //    for non-plugins)
                            onByDefault: typeof onByDefault === 'boolean'
                                ? onByDefault
                                : (onByDefaultDefault || false),
                            // Two conventions for use by plug-ins but
                            //     textbrowser only passes on (might
                            //     not need here)
                            applicableField,
                            targetLanguage
                        }
                    );
                };
                if (!pluginsForWork.processTargetLanguages(applicableFields, processField)) {
                    processField();
                }
            });
        }

        const content = [];
        this.getBrowseFieldData({
            metadataObj, schemaItems, getFieldAliasOrName,
            callback ({browseFields, i}) {
                Templates.workDisplay.addBrowseFields({
                    browseFields, fieldInfo,
                    ld, i, iil, $p, content
                });
            }
        });

        /*
        Templates.workDisplay.addRandomFormFields({
            il, l, ld, le, $p, serializeParamsAsURL, content
        });
        */
        const serializeParamsAsURL = getSerializeParamsAsURL({l, il, $p});

        // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        const heading = getMetaProp(lang, metadataObj, 'heading');
        Templates.workDisplay.main({
            l, namespace: that.namespace, heading,
            imfl, fallbackDirection,
            langs, fieldInfo, localizeParamNames,
            serializeParamsAsURL, hideFormattingSection, $p,
            metadataObj, il, le, ld, iil,
            fieldMatchesLocale,
            preferredLocale, schemaItems, content
        });
    }

    try {
        const {lf, fileData, metadataObj, ...args} = await this.getWorkData({
            lang, fallbackLanguages, $p
        });

        document.title = lf({
            key: 'browserfile-workdisplay',
            values: {
                work: fileData
                    ? getMetaProp(lang, metadataObj, 'alias')
                    : ''
            },
            fallback: true
        });
        _displayWork.call(this, {lf, metadataObj, ...args});
    } catch (err) {
        alert(err);
    }
};
