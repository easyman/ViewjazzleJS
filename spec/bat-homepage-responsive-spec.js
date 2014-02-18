/*global window, describe, beforeEach, afterEach, it, spyOn, waits, expect */
(function ($) {

	'use strict';

    var viewportWidth = $(window).width(),
		viewportHeight = $(window).height(),
		size = viewportWidth + 'x' + viewportHeight;

	// see viewports.js for the sizes under test

    beforeEach(function () {
        // little pause to make sure the DOM and JS is all ready
		waits(20);
    });

    describe('Homepage responsive tests ' + size, function () {

		/*
			Menu displayed on smaller screens
		*/
		it('Menu icon', function () {
            if (viewportWidth <= 768) {
                expect($('header nav ul.small-screen').css('display')).toBe('block');
            } else {
                expect($('header nav ul.small-screen').css('display')).toBe('none');
            }
        });

		/*
			Tabs displayed on smaller screens
		*/
        it('List tabs', function () {
            if (viewportWidth <= 768) {
                expect($('.tabs.small-screen').css('display')).toBe('block');
            } else {
                expect($('.tabs.small-screen').css('display')).toBe('none');
            }
        });

		/*
			List headings displayed on larger screens
		*/
        it('List headings', function () {
            if (viewportWidth <= 768) {
                expect($('.restaurant-list h2').css('display')).toBe('none');
            } else {
                expect($('.restaurant-list h2').css('display')).toBe('block');
            }
        });

		/*
			Sign-up module switches position based on screen size
		*/
		it('Sign-up module in correct list', function () {
            if (viewportWidth <= 768) {
                expect($('#restaurant-list').find('.signup-module').length).toBe(1);
				expect($('#offer-list').find('.signup-module').length).toBe(0);
            } else {
				expect($('#restaurant-list').find('.signup-module').length).toBe(0);
                expect($('#offer-list').find('.signup-module').length).toBe(1);
            }
        });

		/*
			Restaurant list images only loaded on larger screens when in view
		*/
		it('Restaurant list image display', function () {
            if (viewportWidth <= 768) {
                expect($('#restaurant-list .item > img').length).toBe(0);
            } else {
                expect($('#restaurant-list .item > img').length).toBe(4);
            }
        });

    });
}(this.jQuery || this.$));