import path from 'node:path';
import {fileURLToPath} from 'node:url';

import Ajv from 'ajv';
import JsonRefs from 'json-refs';
import {getJSON} from 'simple-get-json';

globalThis.path = path;
globalThis.Ajv = Ajv;
globalThis.JsonRefs = JsonRefs;
globalThis.getJSON = getJSON;
globalThis.appBase = '../../';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
globalThis.__dirname = __dirname;
