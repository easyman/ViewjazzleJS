/*global window, jasmine, require, phantom, console */
(function () {
    'use strict';

    var system = require('system'),
        args = system.args,
        config = require('./viewjazzle-config'),
        consoleReporter = config.consoleReporter,
        errorPrefix = 'viewjazzle',
        index = 0,
        jQueryPath = config.jQueryPath,
        libPath = config.libPath,
        page,
        render = config.render,
        reporter = config.jasmineReporter,
        spec,
        testFailed = config.testMessage.testFailed,
        testSuiteFinished = config.testMessage.testSuiteFinished,
        url,
        viewports = config.viewports;

    if (!phantom) {
        console.log('PhantomJS is required to run ' + errorPrefix);
        return;
    }

	if (reporter === 'TapReporter' || reporter === 'ConsoleReporter' || reporter === 'TerminalReporter') {
	    console.log(reporter + ' is not compatible with ' + errorPrefix + '. The reporter must be capable of grouped output similar to the TeamCity Reporter.');
		console.log('Feel free to customise your own reporter!');
		phantom.exit();
    }

	if (args.length === 3) {
        spec = args[1].replace(/\\/g, '/');
        url = args[2].replace(/\\/g, '/');
    } else {
        console.log(errorPrefix + ': Jasmine spec file and target page URL parameters not present.');
        phantom.exit();
    }

    if (undefined === viewports) {
        console.log(errorPrefix + ': Viewports array has not been defined - check the config.js file.');
        phantom.exit();
    }

    function consoleMessage(msg) {
        var testFinished = false, sPos, ePos, title;

		console.log(msg);
		if (index < viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
			closePage();
			openPage();
        } else if (index === viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            phantom.exit();
		} else {
            if (msg.indexOf(testFailed) !== -1 && render) { // output for image capture
				if (reporter === 'TeamcityReporter') {
					sPos = msg.indexOf('name=') + 5;
					ePos = msg.indexOf('message=') - 1;
					msg =  viewports[index - 1].width + 'x' + viewports[index - 1].height + msg.substring(sPos, ePos);
				}
                title = msg.replace(/\W/g, '-');
                page.render(errorPrefix + '-' + title + '-failed' + '.png');
            }
        }
    }

    function closePage() {
        page.close();
    }

    function openPage() {

        page = require('webpage').create();
        page.onConsoleMessage = consoleMessage;
        page.viewportSize = viewports[index];

        page.open(url, function (status) {
            page.injectJs(libPath + 'jasmine.js');
            page.injectJs(libPath + consoleReporter);
            if (!!jQueryPath) {
                page.injectJs(jQueryPath);
            }
            page.injectJs(spec);
			page.evaluate(function (reporter) {
			    var jasmineEnv = jasmine.getEnv(),
				    jasmineReporter = eval('jasmine.' + reporter);
			    jasmineEnv.addReporter(new jasmineReporter());
                jasmineEnv.execute();
            }, reporter);

            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            } else {
                window.setTimeout(function () {
                    console.log('Timeout - maybe you specified and incorrect path/parameter or the server is down?');
                    phantom.exit();
                }, 10000);
            }

        });
        index += 1;
    }

    openPage();

}());