// Load modules
var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

// Calling this function is the same as calling our command to
// generate a screenshot 
function captureWebsite(url, width, height, output) {
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
  });
}

// Create a folder to save my screenshots in
if(!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}
process.chdir('screenshots');

// Randomly pick ten resolutions (between 100 and 1200 pixels) and
// take a screenshot Zombocom in that resolution
for(var i = 0; i < 100; i++) {
  var width = Math.random() * (1200 - 100) + 100,
      height = Math.random() * (1200 - 100) + 100;
  captureWebsite('http://www.dundermifflin.com/', width, height, 'screenshot' + i + '.png');
}