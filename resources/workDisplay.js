/* eslint-env browser */
import IMF from 'imf';
import getSerializeParamsAsURL from './utils/getSerializeParamsAsURL.js';

import {getPreferredLanguages} from './utils/getLanguageInfo.js';
import {getMetaProp, getFieldMatchesLocale} from './utils/Metadata.js';

import Templates from './templates/index.js';

export default async function workDisplay ({
    l,
    lang, preferredLocale, localeFromLangData, fallbackLanguages, $p
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
        metadataObj, getFieldAliasOrName, schemaObj,
        pluginsInWork, pluginFieldMappings, pluginObjects
    }) {
        const il = localizeParamNames
            ? key => l(['params', key])
            : key => key;
        const iil = localizeParamNames
            ? key => l(['params', 'indexed', key])
            : key => key;

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
        const fieldMatchesLocale = getFieldMatchesLocale({
            namespace: this.namespace,
            metadataObj, preferredLocale, schemaItems
        });

        // Todo: Test
        // Todo: Get automated working with fieldMatchesLocale;
        // Todo: Utilize onByDefault with enabled checkboxes
        // Todo: Utilize fieldInfo in result
        if (pluginObjects) {
            pluginFieldMappings.forEach((pluginFieldMapping, i) => {
                const {
                    placement,
                    /*
                    {fieldXYZ: {
                        targetLanguage: "en"|["en"], // E.g., translating from Persian to English
                        onByDefault: true // Overrides plugin default
                    }}
                    */
                    'applicable-fields': applicableFields
                } = pluginFieldMapping;
                const [pluginName, onByDefaultDefault] = pluginsInWork[i];
                const processField = ({applicableField, targetLanguage, onByDefault} = {}) => {
                    const {field = pluginName} = pluginObjects.getField
                        ? pluginObjects.getField({
                            applicableField,
                            targetLanguage
                        })
                        : pluginObjects;
                    const fieldAliasOrName = pluginObjects.getFieldAliasOrName
                        ? pluginObjects.getFieldAliasOrName({
                            lang: this.lang, // array with first item as preferred
                            applicableField,
                            targetLanguage
                        })
                        : field;
                    fieldInfo.splice(
                        // Todo: Allow default placement overriding for
                        //    non-plugins
                        placement === 'end'
                            ? Infinity // push
                            : placement,
                        0,
                        {
                            field,
                            fieldAliasOrName,
                            // Plug-in specific (todo: allow specifying
                            //    for non-plugins)
                            onByDefault: typeof onByDefault === 'boolean'
                                ? onByDefault
                                : onByDefaultDefault || false,
                            // Conventions for use by plug-ins but
                            //     textbrowser only passes on
                            applicableField,
                            targetLanguage
                        }
                    );
                };
                if (applicableFields) {
                    Object.entries(applicableFields).forEach(([applicableField, {
                        targetLanguage, onByDefault
                    }]) => {
                        if (Array.isArray(targetLanguage)) {
                            targetLanguage.forEach((targetLanguage) => {
                                processField({applicableField, targetLanguage, onByDefault});
                            });
                        } else {
                            processField({applicableField, targetLanguage, onByDefault});
                        }
                    });
                } else {
                    processField();
                }
            });
            // console.log('aaap', pluginObjects[0].insertField());
            console.log('pluginKeys', pluginsInWork);
            console.log('pluginFieldMappings', pluginFieldMappings);
            console.log('pluginObjects', pluginObjects);
            /*

            "plugins": {
                "synopsis": "plugins/synopsis.js"
            },
            */
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
            getPreferredLanguages, fieldMatchesLocale,
            getFieldAliasOrName, preferredLocale, schemaItems, content
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
        _displayWork.call(this, {metadataObj, ...args});
    } catch (err) {
        alert(err);
    }
};
