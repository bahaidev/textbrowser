/*global phantom, require*/
/*eslint-disable no-console*/

var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

var childArgs = [
    path.join(__dirname, 'phantomjs-script.js'),
    'some other argument (passed to phantomjs script)'
];

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {

});


var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        'appSpec.js',
        'requests/**/*[sS]pec.js',
        'utils/**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});
jasmine.onComplete(function(passed) {
  if(passed) {
      console.log('All specs have passed');
  }
  else {
      console.log('At least one spec has failed');
  }
});
/*
jasmine.configureDefaultReporter({
  timer: new this.jasmine.Timer(),
  print: function() {
      process.stdout.write(util.format.apply(this, arguments));
  },
  showColors: true,
  jasmineCorePath: this.jasmineCorePath
});
jasmine.addReporter(customReporter);
*/
jasmine.execute();


var page = require('webpage').create();
page.open('http://example.com', function (status) {'use strict';
    console.log("Status: " + status);
    if (status === "success") {
        page.render('example.png');
    }
    phantom.exit();
});
