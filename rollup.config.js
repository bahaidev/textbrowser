import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import nodeGlobals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-re';
import terser from '@rollup/plugin-terser';
import postProcess from '@stadtlandnetz/rollup-plugin-postprocess';

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
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} [config = {}]
 * @param {boolean} [config.minifying]
 * @param {string} [config.format="umd"]
 * @returns {RollupConfig}
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
        // Switch to browser-friendly version
        patterns: [{
          include: ['resources/resultsDisplay.js', 'resources/utils/Metadata.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from 'json-refs/dist/json-refs-min.js';"
        }, {
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
      // Switch to browser-friendly version
      replace({
        // ... do replace before commonjs
        patterns: [importerReplace, {
          include: ['resources/resultsDisplay.js', 'resources/utils/Metadata.js'],
          test: "import JsonRefs from 'json-refs';",
          replace: "import JsonRefs from 'json-refs/dist/json-refs-min.js';"
        }]
      }),
      // Let's at least pretend there are no globals here
      replace({
        // ... do replace before commonjs
        patterns: [{
          include: ['node_modules/json-refs/dist/json-refs-min.js'],
          test: 'SCHEMES.urn.serialize(t,e)}}}]);', // End of file
          // replace: '$&\nexport default JsonRefs;'
          replace: 'SCHEMES.urn.serialize(t,e)}}}]);export default JsonRefs;'
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
