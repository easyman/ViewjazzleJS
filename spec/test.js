/*global window, describe, it, expect */
(function (window, $) {

    'use strict';

    var screen = {
        width: $(window).width(),
        height: $(window).height()
    },
        viewport = screen.width + 'x' + screen.height;

    // see viewjazzle-config.js for the viewports under test

    describe('Viewport tests ' + viewport, function () {
        it('Content is visible at different screen sizes', function () {

            if (screen.width < 768) { // small
                expect($('.small-screen').css('display')).toBe('block');
                expect($('.medium-screen').css('display')).toBe('none');
                expect($('.large-screen').css('display')).toBe('none');
            } else if (screen.width <= 768) { // medium
                expect($('.small-screen').css('display')).toBe('none');
                expect($('.medium-screen').css('display')).toBe('block');
                expect($('.large-screen').css('display')).toBe('none');
            } else if (screen.width >= 1024) { // large
                expect($('.small-screen').css('display')).toBe('none');
                expect($('.medium-screen').css('display')).toBe('none');
                expect($('.large-screen').css('display')).toBe('block');
            }
        });
    });
}(window, window.jQuery || window.$));