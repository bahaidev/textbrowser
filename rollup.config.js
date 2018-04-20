import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
// import nodeGlobals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-re';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';
import postProcess from 'rollup-plugin-postprocess';

const importerReplace = {
    // Temporarily hide this from parser (using the Babel
    //   syntax plugin or experimental Rollup flag didn't
    //   seem to work)
    include: ['resources/utils/WorkInfo.js'],
    test: 'return import(',
    replace: 'return window.importer('
};

// Todo: Monitor https://github.com/rollup/rollup/issues/1978
//        to suppress (known) circular dependency warnings
function getRollupObject ({minifying, format = 'umd'} = {}) {
    const nonMinified = {
        input: 'resources/index.js',
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
                patterns: [importerReplace, {
                    // regexp match with resolved path
                    match: /formidable(\/|\\)lib/,
                    // string or regexp
                    test: 'if (global.GENTLY) require = GENTLY.hijack(require);',
                    // string or function to replaced with
                    replace: ''
                }, {
                    include: ['node_modules/json-refs/browser/json-refs-standalone-min.js'],
                    test: '(1)});', // End of file
                    // replace: '$&\nexport default JsonRefs;'
                    replace: '(1)});export default JsonRefs;'
                }]
            }),
            json(),
            babel(),
            // nodeGlobals(),
            // builtins(),
            resolve({
                browser: true
            }),
            commonjs(),
            postProcess([ // Revert
                [/return window.importer\(/, 'return import(']
            ])
        ]
    };
    if (minifying) {
        nonMinified.plugins.push(uglify(null, minify));
    }
    return nonMinified;
};
// console.log('typeof', typeof getRollupObject); // Keep for ESLint
export default [
    /**/
    getRollupObject(),
    getRollupObject({minifying: true}),
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
        plugins: [
            replace({
                // ... do replace before commonjs
                patterns: [/* importerReplace, */ {
                    include: ['resources/resultsDisplay.js', 'resources/utils/Metadata.js'],
                    test: "import JsonRefs from 'json-refs/browser/json-refs-standalone-min.js';",
                    replace: "const JsonRefs = require('json-refs');"
                }]
            }),
            json(),
            babel({
                plugins: ['dynamic-import-node']
            }),
            builtins(),
            resolve(),
            commonjs()
        ]
    }
];
