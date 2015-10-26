/*global window, jasmine, require, phantom, console, openPage */
(function (phantom) {
    'use strict';

    var system = require('system'),
        args = system.args,
        params = ['-spec', '-viewports', '-url', '-userAgent', '-cookies', '-render', '-reporter'],
        config = require('./viewjazzle-config'),
        errorPrefix = 'ViewjazzleJS',
        index = 0,
        jsLibraryPath = config.jsLibraryPath,
        jasminePath = config.jasminePath,
        page,
        render = config.render,
        reporters = ['console', 'teamcity'],
        reporter = config.reporter,
        spec,
        testFailed = 'FAILED',
        testSuiteFinished = 'jasmineDone',
        timeout = config.timeout,
        url,
        userAgent,
        cookies,
        viewports = config.viewports,
        ignoreMessages = config.ignoreMessages,
        i,
        arg,
        value;

    if (!phantom) {
        console.log('PhantomJS is required to run ' + errorPrefix);
        return;
    }

    function arrayStringToArrayViewportObject(arrayString) {
        var array = arrayString.substring(1, arrayString.length - 1).split(/\]\s*,\s*\[/),
            arrayObject = [],
            subarray,
            obj,
            k;

        for (k = 0; k < array.length; k += 1) {
            array[k] = array[k].replace(/[\[\]']+/g, '');
            subarray = array[k].split(/\s*,\s*/);
            obj = {
                width: subarray[0],
                height: subarray[1]
            };
            arrayObject.push(obj);
        }

        return arrayObject;
    }

    function getDomain(location) {
        var domain,
            domainStart,
            domainEnd;

        domainStart = location.indexOf('//') + 2;
        domain = location.substring(domainStart, location.length);
        domainEnd = domain.indexOf('/') !== -1 ? domain.indexOf('/') : domain.length;
        return domain.substring(0, domainEnd);
    }

    function isLoggable(msg) {
        var j;

        for (j = 0; j < ignoreMessages.length; j += 1) {
            if (msg.indexOf(ignoreMessages[j]) !== -1) {
                // if this is a message we want to ignore from the array of defined messages
                return false;
            }
        }
        return true;
    }

    function closePage() {
        page.clearCookies();
        page.close();
    }

    function consoleMessage(msg) {
        var detailsStartPos, detailsEndPos, title;

        if (isLoggable(msg)) {
            console.log(msg);
        }

        // each test to run if not last
        if (index < viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            openPage();
        } else if (index === viewports.length && msg.indexOf(testSuiteFinished) !== -1) {
            closePage();
            phantom.exit();
        } else {
            if ((msg.indexOf(testFailed) !== -1) && render) { // output for image capture
                if (reporter === 'teamcity') {
                    detailsStartPos = msg.indexOf('details=') + 9;
                    detailsEndPos = msg.indexOf(']') - 1;
                    msg = msg.substring(detailsStartPos, detailsEndPos);
                }
                title = msg.replace('> FAILED : ', '').replace(/\W/g, '-');

                page.render(title.substring(0, 190) + '.png');
            }
        }
    }

    function openPage() {
        var cookie,
            domain,
            userString;

        page = require('webpage').create();

        if (cookies) {
            domain = getDomain(url);
            for (cookie = 0; cookie < cookies.length; cookie += 2) {
                phantom.addCookie({ 'name': cookies[cookie], 'value': cookies[cookie + 1], 'domain': domain });
            }
        }

        if (userAgent) {
            switch (userAgent) {
            case 'firefox':
                userString = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:34.0) Gecko/20100101 Firefox/34.0";
                break;
            case 'chrome':
                userString = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36";
                break;
            case 'ie':
                userString = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko";
                break;
            default:
                userString = userAgent;
                break;
            }
            page.settings.userAgent = userString;
        }

        page.onConsoleMessage = consoleMessage;
        page.viewportSize = viewports[index];

        page.open(url, function (status) {
            // load additional JS script/library file if specified
            if (!!jsLibraryPath) {
                page.injectJs(jsLibraryPath);
            }

            // load Jasmine test runner scripts and mock-ajax
            page.injectJs(jasminePath + 'jasmine.js');
            page.injectJs('lib/boot-vj.js');
            page.injectJs(jasminePath + 'mock-ajax.js');
            page.injectJs(jasminePath + 'jasmine-jquery.js');
            page.injectJs('lib/' + reporter + '-reporter.js');

            // load the spec script
            page.injectJs(spec);

            // evaluate the page and execute the jasmine tests with the specified reporter
            page.evaluate(function () {
                var env = jasmine.getEnv();
                env.addReporter(jasmine.customReporter);
                env.execute();
            });

            if (status !== 'success') {
                console.log('Unable to load the address!');
                phantom.exit();
            } else {
                window.setTimeout(function () {
                    var details = 'The spec file exceeded the configured timeout. Increase the viewjazzle-config timeout value, and ensure you configured the correct path and parameters.',
                        message = errorPrefix + ': FAILED on ' + spec;

                    if (reporter === 'teamcity') {
                        console.log("##teamcity[testStarted message='" + message + "' name='" + errorPrefix + "']");
                        console.log("##teamcity[" + testFailed + " message='" + message + "' name='" + errorPrefix + "' details='" + details + "']");
                        console.log("##teamcity[testFinished message='" + message + "' name='" + errorPrefix + "']");
                    } else if (reporter === 'console') {
                        console.log(message + ' - ' + details);
                    }
                    phantom.exit();
                }, timeout);
            }

        });
        index += 1;
    }

    for (i = 0; i < args.length; i += 1) {
        arg = args[i];

        if (params.indexOf(arg) !== -1) {
            value = args[i + 1];
            switch (arg) {
            case '-cookies':
                cookies = value.split(',');
                if (cookies.length % 2 !== 0) {
                    console.log(errorPrefix + ': Specify cookies as name-value pairs, seperated by commas.');
                    phantom.exit();
                }
                break;
            case '-render':
                render = (/^true$/i).test(value);
                break;
            case '-reporter':
                reporter = value;
                break;
            case '-spec':
                spec = value;
                break;
            case '-url':
                url = value;
                break;
            case '-userAgent':
                userAgent = value;
                break;
            case '-viewports':
                viewports = arrayStringToArrayViewportObject(value);
                break;
            default:
                break;
            }
        }
    }

    if (reporters.indexOf(reporter) === -1) {
        console.log(reporter + ' is not compatible with ' + errorPrefix + '. The reporter must conform to http://jasmine.github.io/2.1/custom_reporter.html spec.');
        phantom.exit();
    }

    if (undefined === viewports) {
        console.log(errorPrefix + ': Viewports array has not been defined - check the config.js file.');
        phantom.exit();
    }

    openPage();
}(phantom));