/* eslint-env browser */
import {getJSON} from 'simple-get-json';
import {IMF} from 'imf';

import {getMetaProp} from './utils/Metadata.js';
import {dialogs} from './utils/dialogs.js';
import Templates from './templates/index.js';

export default async function workSelect ({
  files, lang, fallbackLanguages, $p, followParams
  /* , l, defineFormatter */
}) {
  // We use getJSON instead of JsonRefs as we do not necessarily need to
  //    resolve the file contents here
  try {
    const dbs = await getJSON(files);
    const localeFromFileData = (lan) =>
      dbs['localization-strings'][lan];

    const metadataObjs = await getJSON(dbs.groups.reduce((arr, fileGroup) => {
      const metadataBaseDir = (dbs.metadataBaseDirectory || '') +
                (fileGroup.metadataBaseDirectory || '') + '/';
      return fileGroup.files.reduce((ar, fileData) =>
        [...ar, metadataBaseDir + fileData.metadataFile],
      arr);
    }, []));
    const imfFile = IMF({
      locales: lang.map(localeFromFileData),
      fallbackLocales: fallbackLanguages.map(localeFromFileData)
    });
    const lf = imfFile.getFormatter();
    document.title = lf({key: 'browserfile-workselect', fallback: true});
    /*
        function ld (key, values, formats) {
            return l({
                key: key, values: values, formats: formats, fallback: ({message}) =>
                    // Displaying as div with inline display instead of span since
                    //    Firefox puts punctuation at left otherwise
                    ['div', {
                        style: 'display: inline;direction: ' + fallbackDirection
                    }, [message]]
            });
        }
        */

    const metadataObjsIter = metadataObjs[Symbol.iterator]();
    const getNextAlias = () => {
      const metadataObj = metadataObjsIter.next().value;
      return getMetaProp(lang, metadataObj, 'alias');
    };
    Templates.workSelect({groups: dbs.groups, lf, getNextAlias, $p, followParams});
  } catch (err) {
    console.log('Error', err);
    dialogs.alert(err);
  }
}
