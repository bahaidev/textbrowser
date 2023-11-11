'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-node-overrides'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    },
    polyfills: [
      'Array.isArray',
      'Blob',
      'caches',
      'console',
      'Date.now',
      'document.dir',
      'document.querySelector',
      'document.querySelectorAll',
      'document.title',
      'DOMParser',
      'Error',
      'fetch',
      'history',
      'history.replaceState',
      'IDBKeyRange',
      'indexedDB',
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
    files: ['resources/user-sample.js'],
    rules: {
      'node/no-missing-import': 0,
      'import/no-unresolved': 0
    }
  }, {
    files: ['sw-sample.js'],
    rules: {
      'import/no-unresolved': 0,
      'import/unambiguous': 0,
      strict: 0
    }
  }, {
    files: ['test/index.html'],
    extends: ['ash-nazg/sauron-node-overrides'],
    globals: {
      mocha: false
    },
    rules: {
      'import/unambiguous': 0
    }
  }, {
    files: ['test/textbrowserTests.js'],
    extends: ['ash-nazg/sauron-node-overrides']
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
    '@stylistic/max-len': 0,
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
