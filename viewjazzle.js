/*global window, jasmine, require, phantom, console */
(function () {
    'use strict';

    var system = require('system'),
        args = system.args,
        config = require('./viewjazzle-config'),
        errorPrefix = 'viewjazzle',
        index = 0,
        jsLibraryPath = config.jsLibraryPath,
        jasminePath = config.jasminePath,
        page,
        render = config.render,
        reporterName = config.reporterName,
        reporterPath = config.reporterPath,
        spec,
        testFailed = config.testMessages.testFailed,
        testSuiteFinished = config.testMessages.testSuiteFinished,
        timeout = config.timeout,
        url,
        viewports = config.viewports;

    if (!phantom) {
        console.log('PhantomJS is required to run ' + errorPrefix);
        return;
    }

    if (reporterName === 'ConsoleReporter' || reporterName === 'TerminalReporter') {
        console.log(reporterName + ' is not compatible with ' + errorPrefix + '. The reporter must be capable of grouped output similar to the TeamCity Reporter.');
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

    function closePage() {
        page.close();
    }

    function consoleMessage(msg) {
        var sPos, ePos, title, isLogged = true;

        if (reporterName === 'TapReporter' && msg.indexOf(testSuiteFinished) !== -1) {
            isLogged = false; // don't log the custom Tap Reporter message 'testSuiteFinished'
        }

        if (isLogged) {
            console.log(msg);
        }

        if (index < viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            openPage();
        } else if (index === viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            phantom.exit();
        } else {
            if (msg.indexOf(testFailed) !== -1 && render) { // output for image capture
                if (reporterName === 'TeamcityReporter') {
                    sPos = msg.indexOf('name=') + 5;
                    ePos = msg.indexOf('message=') - 1;
                    msg =  viewports[index - 1].width + 'x' + viewports[index - 1].height + msg.substring(sPos, ePos);
                }
                title = msg.replace(/\W/g, '-');
                page.render(errorPrefix + '-' + title + '-failed' + '.png');
            }
        }
    }

    function openPage() {

        page = require('webpage').create();
        page.onConsoleMessage = consoleMessage;
        page.viewportSize = viewports[index];

        page.open(url, function (status) {
            page.injectJs(jasminePath + 'jasmine.js');
            page.injectJs(jasminePath + reporterPath);
            if (!!jsLibraryPath) {
                page.injectJs(jsLibraryPath);
            }
            page.injectJs(spec);
            page.evaluate(function (reporterName) {
                var jasmineEnv = jasmine.getEnv(),
                    jasmineReporter = jasmine[reporterName];
                jasmineEnv.addReporter(new jasmineReporter());
                jasmineEnv.execute();
            }, reporterName);

            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            } else {
                window.setTimeout(function () {
                    console.log('Timeout - maybe you specified and incorrect path/parameter or the server is down?');
                    phantom.exit();
                }, timeout);
            }

        });
        index += 1;
    }

    openPage();

}());