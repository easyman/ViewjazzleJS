/* global exports */
/* define your viewjazzle configuration */
exports.reporterPath = 'jasmine.vj_teamcity_console_reporter.js';
exports.reporterName = 'TeamcityReporter';
exports.testMessages = {
	testFailed: 'testFailed', // denotes a failed test
	testSuiteFinished: 'testSuiteFinished' // denotes a suite of tests has finished
};
exports.jsLibraryPath = ''; // loads any other JavaScript library you may require
exports.jasminePath = 'lib/jasmine-1.3.0/';
exports.render = false; // render a test failure
exports.timeout = 10000;
exports.viewports = [{ width: 1400, height: 768 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 320, height: 640 }];