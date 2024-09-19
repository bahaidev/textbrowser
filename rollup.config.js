import {appendFile, copyFile} from 'node:fs/promises';

import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import nodeGlobals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
// @ts-expect-error Missing types
import replace from 'rollup-plugin-re';
import terser from '@rollup/plugin-terser';
// @ts-expect-error Missing types
import postProcess from '@stadtlandnetz/rollup-plugin-postprocess';
// @ts-expect-error Missing types
import {importMetaAssets} from '@web/rollup-plugin-import-meta-assets';

/*
Because JsonRefs does not have an ESM version, and adding appears to be
difficult in that Rollup's ecosystem for polyfilling Node is apparently
less mature than for Webpack (though Webpack may now have ESM export),
we convert the global file to ESM which can be modularly imported by the
including files (yet safely tree-shaked, avoiding dupes).
*/
const jsonRefsTarget = new URL('resources/vendor/json-refs-min.js', import.meta.url);
await copyFile(
  new URL('node_modules/json-refs/dist/json-refs-min.js', import.meta.url),
  jsonRefsTarget
);
await appendFile(jsonRefsTarget, '\nexport default JsonRefs;');

const importerReplace = {
  // Temporarily hide this from parser (using the Babel
  //   syntax plugin or experimental Rollup flag didn't
  //   seem to work)
  include: ['resources/utils/WorkInfo.js', 'node_modules/simple-get-json/dist/index-polyglot.mjs'],
  test: 'import(',
  replace: 'window.xyz('
};
const importerRevert = [/window.xyz\(/, 'import('];

// Todo: Monitor https://github.com/rollup/rollup/issues/1978
//        to suppress (known) circular dependency warnings
/**
 * @external RollupConfig
 * @type {object}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {object} [config]
 * @param {boolean} [config.minifying]
 * @param {import('rollup').ModuleFormat} [config.format]
 * @returns {import('rollup').RollupOptions}
 */
function getRollupObject ({minifying, format = 'umd'} = {}) {
  const nonMinified = {
    input: 'resources/index.js',
    external: [
      // Not used in browser
      'node:path', 'node:stream', 'node:http', 'node:url', 'node:https',
      'node:zlib', 'node:child_process', 'node:fs', 'node:buffer',
      'node:util', 'node:net'
    ],
    output: {
      format,
      file: `dist/index-${format}${minifying ? '.min' : ''}.js`,
      name: 'TextBrowser' /* ,
            globals: {
                'json-refs': 'JsonRefs'
            } */
    },
    plugins: [
      // ... do replace before commonjs
      replace({
        // Switch to non-bundled ESM browser-friendly version
        patterns: [{
          include: ['resources/resultsDisplay.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from './vendor/json-refs-min.js';"
        }, {
          include: ['resources/utils/Metadata.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from '../vendor/json-refs-min.js';"
        }, importerReplace]
      }),
      json(),
      babel({
        babelHelpers: 'bundled'
      }),
      importMetaAssets(),
      // nodeGlobals(),
      nodeResolve({
        // exportConditions: ['module'],
        mainFields: ['module']
      }),
      commonjs(),
      postProcess([
        importerRevert
      ])
    ]
  };
  if (minifying) {
    nonMinified.plugins.push(terser());
  }
  return nonMinified;
}
// console.log('typeof', typeof getRollupObject); // Keep for ESLint when commenting out below
export default [
  /**/
  getRollupObject({minifying: false, format: 'es'}),
  getRollupObject({minifying: true, format: 'es'}),
  {
    input: 'resources/utils/WorkInfo.js',
    output: {
      format: 'esm',
      file: 'dist/WorkInfo-es.js',
      name: 'WorkInfo'
    },
    plugins: [
      // Switch to non-bundled ESM browser-friendly version
      replace({
        // ... do replace before commonjs
        patterns: [importerReplace, {
          include: ['resources/resultsDisplay.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from './vendor/json-refs-min.js';"
        }, {
          include: ['resources/utils/Metadata.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from '../vendor/json-refs-min.js';"
        }]
      }),
      nodeResolve(),
      commonjs(),
      postProcess([
        importerRevert
      ])
    ]
  },
  {
    input: 'resources/activateCallback.js',
    output: {
      format: 'esm',
      file: 'dist/activateCallback-es.js',
      name: 'activateCallback'
    }
  }
];
