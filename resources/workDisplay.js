/* eslint-env browser */
import {getJSON} from 'simple-get-json';

import {replaceHash, getParamsSetter, getSerializeParamsAsURL} from './utils/Params.js';
import {getMetaProp} from './utils/Metadata.js';
import {dialogs} from './utils/dialogs.js';

import Templates from './templates/index.js';

export default async function workDisplay ({
  l, languageParam,
  lang, preferredLocale, languages, fallbackLanguages, $p
}) {
  const {preferencesPlugin} = this;
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
    workI18n, metadataObj, getFieldAliasOrName, schemaObj, schemaItems,
    fieldInfo, metadata, pluginsForWork, groupsToWorks
  }) {
    const lParam = localizeParamNames
      ? key => l(['params', key])
      : key => key;
    const lIndexedParam = localizeParamNames
      ? key => l(['params', 'indexed', key])
      : key => key;

    // Returns element with localized option text (as Jamilih), with
    //   optional fallback direction
    const lElement = (key, el, attToLocalize, atts, children = []) => {
      atts[attToLocalize] = l(
        key
        // Restore this if `intl-dom` supports
        // fallback ({message}) {
        //   atts.dir = fallbackDirection;
        //   return message;
        // }
      );
      return [el, atts, children];
    };

    // Returns plain text node or element (as Jamilih) with fallback direction
    const lDirectional = (key, substitutions) =>
      l(
        key,
        substitutions
        // formats
        // Restore if `intl-dom` supports
        // fallback: ({message}) =>
        //   Templates.workDisplay.bdo({fallbackDirection, message})
      );

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
          lDirectional, i, lIndexedParam, $p, content
        });
      }
    });

    /*
      Templates.workDisplay.addRandomFormFields({
          lParam, l, lDirectional, lElement, $p, serializeParamsAsURL, content
      });
    */
    const serializeParamsAsURL = getSerializeParamsAsURL({l, lParam, $p});
    const paramsSetter = getParamsSetter({l, lParam, $p});

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

    const displayNames = new Intl.DisplayNames(
      [...lang, ...fallbackLanguages],
      {
        type: 'language',
        // Dialect: "American English"
        // Standard: "English (United States)"
        languageDisplay: 'standard' // 'dialect'
      }
    );
    const languageI18n = (code) => {
      return displayNames.of(code);
    };

    Templates.workDisplay.main({
      languageParam, lang, workI18n,
      l, namespace: this.namespace, groups, heading,
      languageI18n, fallbackDirection,
      langs, fieldInfo, localizeParamNames,
      serializeParamsAsURL, paramsSetter, replaceHash,
      getFieldAliasOrNames,
      hideFormattingSection, $p,
      metadataObj, lParam, lElement, lDirectional, lIndexedParam,
      fieldMatchesLocale,
      preferredLocale, schemaItems, content,
      preferencesPlugin
    });
  }

  try {
    const {workI18n, fileData, metadataObj, ...args} = await this.getWorkData({
      lang, fallbackLanguages, preferredLocale,
      languages, work: $p.get('work')
    });

    document.title = workI18n(
      'browserfile-workdisplay',
      {
        work: fileData
          ? getMetaProp(lang, metadataObj, 'alias')
          : ''
      }
    );
    await _displayWork.call(this, {workI18n, metadataObj, ...args});
  } catch (err) {
    console.log('err', err);
    dialogs.alert(err);
  }
}
