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
        pluginKeys, pluginFieldMappings, pluginObjects
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

        // Todo: Get automated working with fieldInfo, fieldMatchesLocale;
        //        splice plugins into fieldInfo and alternative for
        //        getting alias
        if (pluginObjects) {
            // console.log('aaap', pluginObjects[0].insertField());
            console.log('pluginKeys', pluginKeys);
            console.log('pluginFieldMappings', pluginFieldMappings);
            console.log('pluginObjects', pluginObjects);
            /*

            "plugins": {
                "synopsis": "plugins/synopsis.js"
            },
            */
        }
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
