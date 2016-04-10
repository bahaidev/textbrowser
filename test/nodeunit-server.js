/*eslint-env node */
'use strict';
const open = require('open');
const ns = require('node-static');

const port = 8082;
const file = new ns.Server();

require('http').createServer(function (req, res) {
    req.addListener('end', function () {
        file.serve(req, res);
    }).resume();
}).listen(port);

console.log('Started server; opening http://localhost:8082/test/ in the browser. May take a while to load!'); // eslint-disable-line no-console

open('http://localhost:8082/test/');
