/*global exports */
/* define your viewjazzle configuration */
exports.consoleReporter = 'jasmine.teamcity_console_reporter.js';
exports.jasmineReporter = 'TeamcityReporter';
exports.testMessage = {
	testFailed: 'testFailed',
	testSuiteFinished: 'testSuiteFinished'
};
exports.jQueryPath = '';
exports.libPath = 'lib/jasmine-1.3.0/';
exports.render = false;
exports.viewports = [{ width: 1400, height: 768 }, { width: 1024, height: 768 }, { width: 768, height: 1024 }, { width: 320, height: 640 }];