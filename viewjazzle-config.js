/*global exports */
exports.reporter = 'console';
exports.ignoreMessages = ['jasmineDone', 'minimal-ui'];
exports.jsLibraryPath = 'lib/jquery-1.11.1/jquery-1.11.1.min.js'; // loads any other JavaScript library you may require
exports.jasminePath = 'lib/jasmine-2.1.0/';
exports.render = false; // render a test failure
exports.timeout = 60000;
exports.viewports = [{ width: 1400, height: 768 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 320, height: 640 }];