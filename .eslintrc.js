'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-node'],
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  settings: {
    polyfills: [
      'Array.isArray',
      'Blob',
      'console',
      'Date.now',
      'document.dir',
      'document.querySelector',
      'document.querySelectorAll',
      'DOMParser',
      'Error',
      'fetch',
      'history',
      'history.replaceState',
      'IDBKeyRange',
      'JSON',
      'location.hash',
      'location.href',
      'location.host',
      'location.protocol',
      'navigator',
      'navigator.clipboard',
      'navigator.serviceWorker',
      'Notification.requestPermission',
      'Number.isNaN',
      'Number.parseInt',
      'Object.entries',
      'Object.keys',
      'Object.values',
      'Promise',
      'Request',
      'ServiceWorker',
      'Set',
      'Symbol.iterator',
      'URL',
      'URLSearchParams',
      'XMLSerializer'
    ]
  },
  overrides: [{
    files: '.eslintrc.js',
    extends: ['plugin:node/recommended-script'],
    rules: {
      'import/no-commonjs': 0
    }
  }, {
    files: ['resources/user-sample.js'],
    rules: {
      'node/no-missing-import': 0,
      'import/no-unresolved': 0
    }
  }, {
    files: ['sw-sample.js'],
    rules: {
      'import/unambiguous': 0,
      strict: 0
    }
  }, {
    files: ['test/index.html'],
    globals: {
      mocha: false
    },
    rules: {
      'import/unambiguous': 0
    }
  }, {
    files: ['test/textbrowserTests.js'],
    globals: {
      require: true
    },
    rules: {
      'import/unambiguous': 0,
      'import/no-commonjs': 0
    }
  }, {
    files: ['server/**', 'resources/utils/WorkInfo.js'],
    globals: {
      require: true
    }
  }],
  rules: {
    // Disable for now
    'array-bracket-newline': 0,
    'no-console': 0,
    'require-unicode-regexp': 0,
    'max-len': 0,
    'no-shadow': 0,
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
    'class-methods-use-this': 0,
    'callback-return': 0,
    'multiline-ternary': 0,
    'consistent-return': 0,
    'arrow-parens': 0,
    'require-await': 0,
    'prefer-named-capture-group': 0,
    'jsdoc/require-jsdoc': 0,
    'promise/avoid-new': 0,
    'promise/prefer-await-to-callbacks': 0,
    'import/no-anonymous-default-export': 0,
    'unicorn/no-array-callback-reference': 0,
    'eslint-comments/require-description': 0
  }
};
