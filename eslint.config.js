import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'resources/vendor',
      'dist/**',
      '!dist/sw-helper.js'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
  {
    files: ['resources/user-sample.js'],
    rules: {
      'n/no-missing-import': 0,
      'import/no-unresolved': 0
    }
  },
  {
    files: ['sw-sample.js'],
    rules: {
      'import/no-unresolved': 0,
      'import/unambiguous': 0,
      strict: 0
    }
  },
  {
    files: ['test/index.html', 'test/textbrowserTests.js'],
    languageOptions: {
      globals: {
        assert: false,
        mocha: false
      }
    },
    rules: {
      'import/unambiguous': 0
    }
  },
  {
    settings: {
      polyfills: [
        'navigator.serviceWorker',
        'Notification.requestPermission'
      ]
    },
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
      'unicorn/no-array-callback-reference': 0
    }
  }
];
