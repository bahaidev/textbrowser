import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import nodeGlobals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-re';
import {terser} from 'rollup-plugin-terser';
import postProcess from '@stadtlandnetz/rollup-plugin-postprocess';
import pkg from './package.json';

const importerReplace = {
  // Temporarily hide this from parser (using the Babel
  //   syntax plugin or experimental Rollup flag didn't
  //   seem to work)
  include: ['resources/utils/WorkInfo.js'],
  test: 'return import(',
  replace: 'return window.importer('
};
const importerRevert = [/window.importer\(/, 'import('];

// Todo: Monitor https://github.com/rollup/rollup/issues/1978
//        to suppress (known) circular dependency warnings
/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} [config = {}]
 * @param {boolean} [config.minifying]
 * @param {string} [config.format="umd"]
 * @returns {external:RollupConfig}
 */
function getRollupObject ({minifying, format = 'umd'} = {}) {
  const nonMinified = {
    input: 'resources/index.js',
    external: [
      // Not used in browser
      'path', 'stream', 'http', 'url', 'https', 'zlib',
      'child_process', 'fs'
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
      replace({
        // ... do replace before commonjs
        patterns: [{
          include: ['node_modules/json-refs/dist/json-refs-min.js'],
          test: 'SCHEMES.urn.serialize(t,e)}}}]);', // End of file
          // replace: '$&\nexport default JsonRefs;'
          replace: 'SCHEMES.urn.serialize(t,e)}}}]);export default JsonRefs;'
        }, importerReplace, {
          // regexp match with resolved path
          match: /formidable(\/|\\)lib/,
          // string or regexp
          test: 'if (global.GENTLY) require = GENTLY.hijack(require);',
          // string or function to replaced with
          replace: ''
        }]
      }),
      json(),
      babel({
        babelHelpers: 'bundled'
      }),
      // nodeGlobals(),
      resolve({
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
  getRollupObject({minifying: false, format: 'umd'}),
  getRollupObject({minifying: true, format: 'umd'}),
  getRollupObject({minifying: false, format: 'es'}),
  getRollupObject({minifying: true, format: 'es'}),
  /**/
  {
    input: 'server/main.js',
    output: {
      banner: '#!/usr/bin/env node',
      format: 'cjs',
      file: `server/main-cjs.js`
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      replace({
        // ... do replace before commonjs
        patterns: [/* importerReplace, */{
          include: ['resources/resultsDisplay.js', 'resources/utils/Metadata.js'],
          test: "import JsonRefs from 'json-refs/dist/json-refs-min.js';",
          replace: "const JsonRefs = require('json-refs');"
        }, {
          include: ['resources/utils/dialogs.js'],
          test: "import dialogPolyfill from 'dialog-polyfill';",
          replace: 'const dialogPolyfill = {registerDialog () {}};'
        }]
      }),
      json(),
      babel({
        babelHelpers: 'bundled',
        plugins: ['dynamic-import-node']
      }),
      resolve({
        preferBuiltins: true,
        mainFields: ['main']
      })
    ]
  }
];
