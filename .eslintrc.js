module.exports = {
  "extends": "ash-nazg/sauron",
  "parser": "babel-eslint",
  "parserOptions": {
      "sourceType": "module"
  },
  "settings": {
    "polyfills": [
        "Array.isArray",
        "Blob",
        "console",
        "Date.now",
        "document.dir",
        "document.querySelector",
        "document.querySelectorAll",
        "DOMParser",
        "Error",
        "fetch",
        "history.replaceState",
        "IDBKeyRange",
        "JSON",
        "location.hash",
        "location.href",
        "location.host",
        "location.protocol",
        "navigator.clipboard",
        "navigator.serviceWorker",
        "Notification.requestPermission",
        "Number.isNaN",
        "Object.entries",
        "Object.keys",
        "Object.values",
        "Promise",
        "Request",
        "ServiceWorker",
        "Set",
        "Symbol.iterator",
        "URL",
        "URLSearchParams",
        "XMLSerializer"
    ]
  },
  "overrides": [{
    "files": ["resources/user-sample.js"],
    "rules": {
        "import/no-unresolved": 0
    }
  }, {
    "files": ["sw-sample.js"],
    "rules": {
        "import/unambiguous": 0,
        "strict": 0
    }
  }, {
    "files": ["test/textbrowserTests.js"],
    "rules": {
        "import/unambiguous": 0,
        "import/no-commonjs": 0
    }
  }],
  "rules": {
    "indent": ["error", 4, {"outerIIFEBody": 0}],
    "array-bracket-newline": 0,
    "no-console": 0,
    "require-jsdoc": 0,
    "require-unicode-regexp": 0,
    "max-len": 0,
    "no-shadow": 0,
    "implicit-arrow-linebreak": 0,
    "function-paren-newline": 0,
    "class-methods-use-this": 0,
    "callback-return": 0,
    "multiline-ternary": 0,
    "consistent-return": 0,
    "arrow-parens": 0,
    "require-await": 0,

    "unicorn/no-fn-reference-in-iterator": 0,
    "promise/avoid-new": 0,
    "promise/prefer-await-to-callbacks": 0,
    "import/no-anonymous-default-export": 0
  }
};
