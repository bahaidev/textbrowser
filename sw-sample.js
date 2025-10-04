/* eslint-env serviceworker -- Service worker */

// eslint-disable-next-line sonarjs/no-internal-api-use -- Demo
import swHelper from './node_modules/textbrowser/dist/sw-helper.js';

// IMPORTANT: Keep this comment and increment this number to trigger
//              a worker change: 1

swHelper(globalThis);
