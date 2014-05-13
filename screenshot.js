// This phantomJS script takes these arguments:
//    [url] [pageWidth] [pageHeight] [output filename]

// System module so we can access the arguments
var system = require('system'),

    // Initialize webpage
    page = require('webpage').create(),

    // Set our arguments
    url = system.args[1] ? system.args[1] : 'http://www.html5zombo.com',
    pageWidth = system.args[2] ? parseInt(system.args[2], 10) : 960,
    pageHeight = system.args[3] ? parseInt(system.args[3], 10) : 720,
    output = system.args[4] ? system.args[4] : 'screenshot.png';

// Set the resolution
page.viewportSize = { width: pageWidth, height: pageHeight };

page.open(url, function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
    phantom.exit(1);
  } else {

    // Where the screenshot is actually created
    page.render(output);
    phantom.exit();
  }
});

