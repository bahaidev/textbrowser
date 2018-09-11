/* eslint-env browser */
import IMF from 'imf';
import {replaceHash, getParamsSetter, getSerializeParamsAsURL} from './utils/Params.js';
import getJSON from 'simple-get-json';

import {getMetaProp} from './utils/Metadata.js';
import {dialogs} from './utils/dialogs.js';

import Templates from './templates/index.js';

export default async function workDisplay ({
    l, languageParam,
    lang, preferredLocale, languages, fallbackLanguages, $p
}) {
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

    async function _displayWork ({
        lf, metadataObj, getFieldAliasOrName, schemaObj, schemaItems, fieldInfo,
        metadata, pluginsForWork, groupsToWorks
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
                fallback ({message}) {
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

        const fieldMatchesLocale = metadata.getFieldMatchesLocale({
            namespace: this.namespace,
            preferredLocale, schemaItems,
            pluginsForWork
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
        const paramsSetter = getParamsSetter({l, il, $p});

        const {groups} = await getJSON(this.files);

        // const arabicContent = ['test1', 'test2']; // Todo: Fetch dynamically
        const heading = getMetaProp(lang, metadataObj, 'heading');

        const getFieldAliasOrNames = (() => {
            // Avoid blocking but start now
            // Let this run in the background to avoid blocking
            const all = Promise.all(
                groupsToWorks.map(async ({name, workNames, shortcuts}) => {
                    const worksToFields = await Promise.all(workNames.map(async (workName, i) => {
                        return {
                            workName, shortcut: shortcuts[i],
                            fieldAliasOrNames: (await this.getWorkData({
                                lang, fallbackLanguages, preferredLocale,
                                languages, work: workName
                            })).fieldInfo.map(({fieldAliasOrName}) => fieldAliasOrName)
                        };
                    }));
                    return {
                        groupName: name,
                        worksToFields
                    };
                })
            );
            return async () => {
                return all; // May not be finished by now
            };
        })();

        Templates.workDisplay.main({
            languageParam,
            siteBaseURL: this.siteBaseURL, lang, lf,
            l, namespace: this.namespace, groups, heading,
            imfl, fallbackDirection,
            langs, fieldInfo, localizeParamNames,
            serializeParamsAsURL, paramsSetter, replaceHash,
            getFieldAliasOrNames,
            hideFormattingSection, $p,
            metadataObj, il, le, ld, iil,
            fieldMatchesLocale,
            preferredLocale, schemaItems, content
        });
    }

    try {
        const {lf, fileData, metadataObj, ...args} = await this.getWorkData({
            lang, fallbackLanguages, preferredLocale,
            languages, work: $p.get('work')
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
        await _displayWork.call(this, {lf, metadataObj, ...args});
    } catch (err) {
        dialogs.alert(err);
    }
};
