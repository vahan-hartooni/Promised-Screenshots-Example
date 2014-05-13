// Load modules
var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var phantomjs = require('phantomjs');
var Promise = require('es6-promise').Promise;
var binPath = phantomjs.path;

// Calling this function is the same as calling our command to
// generate a screenshot 
function captureWebsite (url, width, height, output) {
  return new Promise(function captureWebsite (resolve) {
    var resolution = width + 'x' + height;

    console.log('Capturing resolution: ' + resolution);

    var childArgs = [

      // Specify the PhantomJS script to run
      path.join(__dirname, 'screenshot.js'),

      // Specify the arguments
      url, width, height, output
    ];

    // Calls the PhantomJS command to capture the website
    var produceScreenshot = childProcess.spawn(binPath, childArgs);

    // The next two event listeners are here because the PhantomJS process can't
    // print to screen without node piping it's log to screen
    produceScreenshot.stderr.on('data', function (data) {
      console.log(resolution + ' stderr: ' + data);
    });

    produceScreenshot.on('close', function (code) {
      console.log('Finished capturing: ' + resolution + ' with exit code '+code);
      resolve();
    });
  });
}

// Create a folder to save my screenshots in
if(!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}
process.chdir('screenshots');

// List of resolutions our client would like to see
var resolutions = [
  {width: 1024, height: 768},
  {width: 568, height: 320},
  {width: 480, height: 320},
  {width: 1152, height: 768},
  {width: 720, height: 320},
  {width: 960, height: 480},
  {width: 768, height: 480},
  {width: 960, height: 540},
  {width: 1200, height: 960},
  {width: 1600, height: 1200}
];

resolutions.reduce(function captureResolutions (sequence, resolution, index) {

  // Return my sequence of promises
  return sequence.then(function captureResolution () {
    var width = resolution.width,
        height = resolution.height;

    // Return the individual promise
    return captureWebsite('http://www.html5zombo.com',
                          width,
                          height,
                          'screenshot' + index + '.png');
  });

   // Our first promise, already resolved, to start off our sequence of promises
}, Promise.resolve());