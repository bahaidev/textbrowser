import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-re';
import uglify from 'rollup-plugin-uglify';
import {minify} from 'uglify-es';

function getRollupObject ({minifying, format = 'umd'} = {}) {
    const nonMinified = {
        input: 'resources/index.js',
        output: {
            format,
            file: `dist/index-${format}${minifying ? '.min' : ''}.js`,
            name: 'TextBrowser'
        },
        plugins: [
            replace({
                // ... do replace before commonjs
                patterns: [{
                    // regexp match with resolved path
                    match: /formidable(\/|\\)lib/,
                    // string or regexp
                    test: 'if (global.GENTLY) require = GENTLY.hijack(require);',
                    // string or function to replaced with
                    replace: ''
                }]
            }),
            json(),
            babel(),
            // builtins(),
            resolve(),
            commonjs()
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
    getRollupObject({minifying: true, format: 'es'}),
    getRollupObject({minifying: false, format: 'es'})
];
