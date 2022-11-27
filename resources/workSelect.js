/* eslint-env browser */
import {getJSON} from 'simple-get-json';
import {i18n} from 'intl-dom';

import {getMetaProp} from './utils/Metadata.js';
import {dialogs} from './utils/dialogs.js';
import Templates from './templates/index.js';

export default async function workSelect ({
  files, lang, namespace,
  fallbackLanguages, $p, l, followParams, prepareForServiceWorker
  /* , l, defineFormatter */
}) {
  // We use getJSON instead of JsonRefs as we do not necessarily need to
  //    resolve the file contents here
  try {
    const works = await getJSON(files);
    const localizationStrings = works['localization-strings'];

    const metadataObjs = await getJSON(works.groups.reduce((arr, fileGroup) => {
      const metadataBaseDir = (works.metadataBaseDirectory || '') +
                (fileGroup.metadataBaseDirectory || '') + '/';
      return fileGroup.files.reduce((ar, fileData) =>
        [...ar, metadataBaseDir + fileData.metadataFile],
      arr);
    }, []));

    const workI18n = await i18n({
      messageStyle: 'plainNested',
      locales: lang,
      defaultLocales: fallbackLanguages,
      // Todo: Could at least share this with `index.js`
      localeStringFinder ({
        locales, defaultLocales
      }) {
        const locale = [...locales, ...defaultLocales].find((language) => {
          return language in localizationStrings;
        });
        return {
          locale,
          strings: {
            head: {},
            body: localizationStrings[locale]
          }
        };
      }
    });

    document.title = workI18n('browserfile-workselect');
    /*
    // Would need adapting now that not using IMF
    function lDirectional (key, substitutions, formats) {
      return workI18n(
        key, substitutions,
        formats,
        fallback: ({message}) =>
          // Displaying as div with inline display instead of span since
          //    Firefox puts punctuation at left otherwise
          ['div', {
              style: 'display: inline;direction: ' + fallbackDirection
          }, [message]]
      });
    }
    */

    // See if we still want an iterator (we need two copies, so can't
    //  exhaust one)
    const metadataObjsIter = metadataObjs[Symbol.iterator]();
    const metadataObjValues = [...metadataObjsIter];
    const metaprops = [];
    metadataObjValues.forEach((metadataObjValue) => {
      metaprops.push(getMetaProp(lang, metadataObjValue, 'alias'));
    });
    let i = 0;
    const getNextAlias = () => {
      const metaprop = metaprops[i++];
      if (i === metaprops.length) {
        i = 0;
      }
      return metaprop;
    };

    const {groups} = works;

    Templates.workSelect.main({
      groups, workI18n, getNextAlias, $p, followParams,
      async worksToOffline () {
        dialogs.makeSubmitDialog({
          children: Templates.workSelect.children({
            groups, l, workI18n, getNextAlias
          }),
          async submit () {
            const works = Templates.workSelect.getCheckedWorks();
            // Already bound to `TextBrowser`
            await prepareForServiceWorker({
              works
            });
          }
        });
      }
    });
  } catch (err) {
    console.log('Error', err);
    dialogs.alert(err);
  }
}
