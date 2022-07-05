import TextBrowser from '../node_modules/textbrowser/dist/index-es.js';

const tb = new TextBrowser({
  // languages: 'node_modules/textbrowser/appdata/languages.json', // Default
  // serviceWorkerPath: 'sw.js', // Default
  // site: 'site.json', // Default
  // localizeParamNames: true, // Not well-tested
  // hideFormattingSection: true,
  // requestPersistentStorage: false,
  // showEmptyInterlinear: false,
  // showTitleOnSingleInterlinear: false,
  files: 'files.json', // Change as needed to your `files.json` location
  stylesheets: ['@builtin', 'resources/user.css'], // Add other paths for your CSS
  namespace: 'myapp', // Used for namespacing localStorage
  allowPlugins: true, // Enables `files.json`-specified plugins
  // dynamicBasePath: '',
  // skipIndexedDB: false,
  trustFormatHTML: true // Needed if allowing for raw HTML fields (don't use for untrusted schemas)
  // , interlinearSeparator: '<hr />' // Defaults to `<br /><br />`
});
await tb.init();
