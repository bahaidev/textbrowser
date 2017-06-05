/* globals TextBrowser, Templates, IMF, formSerialize */

(() => {
TextBrowser.prototype.workDisplay = function workDisplay ({
    lang, preferredLocale, localeFromLangData, fallbackLanguages, getMetaProp, $p,
    localeFromFileData
}, l) {
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

    function _displayWork (l, schemaObj, metadataObj, getFieldAliasOrName) {
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

        // Todo: remember this locales choice by cookie?
        const getPreferredLanguages = (lngs) => {
            const langArr = [];
            lngs.forEach((lng) => {
                // Todo: Check for multiple separate hyphenated
                //   groupings (for each supplied language)
                const higherLocale = lng.replace(/-.*$/, '');
                if (higherLocale === lng) {
                    langArr.push(lng);
                } else {
                    langArr.push(lng, higherLocale);
                }
            });
            return langArr;
        };

        function fieldMatchesLocale (field) {
            const metaFieldInfo = metadataObj && metadataObj.fields &&
                metadataObj.fields[field];
            let metaLang;
            if (metaFieldInfo) {
                metaLang = metadataObj.fields[field].lang;
            }
            const localeStrings = metadataObj &&
                metadataObj['localization-strings'];

            // If this is a localized field (e.g., enum), we don't want
            //  to avoid as may be translated (should check though)
            const hasFieldValue = localeStrings &&
                Object.keys(localeStrings).some(lng => {
                    const fv = localeStrings[lng] &&
                        localeStrings[lng].fieldvalue;
                    return fv && fv[field];
                });

            // Todo: Add to this optionally with one-off tag input box
            // Todo: Switch to fallbackLanguages so can default to
            //    navigator.languages?
            const langCodes = localStorage.getItem(that.namespace + '-langCodes');
            const preferredLanguages = getPreferredLanguages(
                (langCodes && JSON.parse(langCodes)) || [preferredLocale]
            );
            return hasFieldValue ||
                (metaLang && preferredLanguages.includes(metaLang)) ||
                schemaItems.some(item =>
                    item.title === field && item.type !== 'string'
                );
        }

        const schemaItems = schemaObj.items.items;
        const content = [];

        function serializeParamsAsURL ({form, random, checkboxes}, type) {
            const paramsCopy = new URLSearchParams($p.params);
            const formParamsHash = formSerialize(form, {hash: true});

            Object.keys(formParamsHash).forEach((key) => {
                paramsCopy.set(key, formParamsHash[key]);
            });

            // Follow the same style (and order) for checkboxes
            paramsCopy.delete(il('rand'));
            paramsCopy.set(il('rand'), random.checked ? l('yes') : l('no'));

            // We want checkboxes to typically show by default, so we cannot use the
            //    standard serialization
            checkboxes.forEach((checkbox) => {
                // Let's ensure the checked items are all together (at the end)
                paramsCopy.delete(checkbox.name);
                paramsCopy.set(checkbox.name, checkbox.checked ? l('yes') : l('no'));
            });

            switch (type) {
            case 'saveSettings': {
                // In case it was added previously on
                //    this page, let's remove it.
                paramsCopy.delete(il('rand'));
                break;
            }
            case 'randomResult':
            case 'result': {
                // In case it was added previously on this page,
                //    let's put random again toward the end.
                if (type === 'randomResult' || random.checked) {
                    paramsCopy.delete(il('rand'));
                    paramsCopy.set(il('rand'), l('yes'));
                }
                paramsCopy.set(il('result'), l('yes'));
                break;
            }
            }
            return window.location.href.replace(/#.*$/, '') + '#' + paramsCopy.toString();
        }

        const fields = schemaItems.map((schemaItem) => schemaItem.title);
        this.getBrowseFieldData({
            metadataObj, getMetaProp, schemaItems, getFieldAliasOrName
        }, ({browseFields, i}) => {
            Templates.workDisplay.addBrowseFields({
                browseFields, fields, getFieldAliasOrName, ld, i, iil, $p, content
            });
        });

        Templates.workDisplay.addRandomFormFields({
            il, l, ld, le, $p, serializeParamsAsURL, content
        });

        // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        const heading = getMetaProp(metadataObj, 'heading');
        Templates.workDisplay.main({
            l, namespace: that.namespace, heading,
            imfl, fallbackDirection,
            langs, fields, localizeParamNames,
            serializeParamsAsURL, hideFormattingSection, $p,
            getMetaProp, metadataObj, il, le, ld, iil,
            getPreferredLanguages, fieldMatchesLocale,
            getFieldAliasOrName, preferredLocale, schemaItems, content
        });
    }

    this.getWorkData({lang, localeFromFileData, fallbackLanguages, $p, getMetaProp}).then((
        [fileData, lf, getFieldAliasOrName, schemaObj, metadataObj, pluginKeys, pluginFieldMappings, pluginObjects]
    ) => {
        if (pluginObjects) {
            // console.log('aaap', pluginObjects[0].insertField());
            /*
            console.log('pluginKeys', pluginKeys);
            console.log('pluginFieldMappings', pluginFieldMappings);
            console.log('pluginObjects', pluginObjects);

            "plugins": {
                "synopsis": "plugins/synopsis.js"
            },
            */
        }
        document.title = lf({
            key: 'browserfile-workdisplay',
            values: {
                work: fileData
                    ? getMetaProp(metadataObj, 'alias')
                    : ''
            },
            fallback: true
        });
        _displayWork.call(this, l, schemaObj, metadataObj, getFieldAliasOrName);
    }).catch((err) => {
        alert(err);
    });
};
})();
