import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import builtins from 'rollup-plugin-node-builtins';
// import nodeGlobals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-re';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';
import postProcess from 'rollup-plugin-postprocess';

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
                patterns: [{
                    // Temporarily hide this from parser (using the Babel
                    //   syntax plugin or experimental Rollup flag didn't
                    //   seem to work)
                    include: ['resources/index.js'],
                    test: 'return import(',
                    replace: 'return window.importer('
                }, {
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
            resolve(),
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

export default [
    getRollupObject(),
    getRollupObject({minifying: true}),
    getRollupObject({minifying: false, format: 'es'}),
    getRollupObject({minifying: true, format: 'es'})
];