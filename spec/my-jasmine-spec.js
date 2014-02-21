/*global window, describe, it, expect */
(function (window, $) {

    'use strict';

    var screen = {
        width: $(window).width(),
        height: $(window).height()
    },
        viewport = screen.width + 'x' + screen.height;

    // see viewjazzle-config.js for the viewports under test

    describe('Homepage viewport tests ' + viewport, function () {
        it('Mobile menu visible', function () {
            if (screen.width <= 768) {
                expect($('header nav ul.small-screen').css('display')).toBe('block');
            } else {
                expect($('header nav ul.small-screen').css('display')).toBe('none');
            }
        });
    });
}(this, this.jQuery || this.$));