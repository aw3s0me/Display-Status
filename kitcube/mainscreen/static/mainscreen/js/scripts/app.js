//The router will then load the correct dependencies depending on the current URL.
define([
	'jquery',
	'underscore',
	'backbone',
	'jqueryui',
	'kitgrid',
	'yaml',
	'jqgrid',
	'oauthio',
	'highcharts-legend',
	'highcharts-theme',
	"kit.sizeDetector",
	"kit.parser",
	'cookie',
	"models/userModel",
	"dev/helpers",
	'router' // Request router.js
], function($, _, Backbone, jQueryUI, kitgrid, YAML, jqGrid, OAuthio, HighchartsLeg, HighchartsTheme, sizeDet, parser, JqCookie, UserModel, Helpers, Router) {
	var initializeUser = function() {
		var token = $.cookie('access_token');
		window.activeSessionUser = new UserModel();
		if (token && token.length > 0) {
			var username = $('#auth-username').text().trim();
			var group = $('meta[name="project"]').attr('content');
			if (!username.length || username === 'Not logged' || !group.length) {
				return;
			}
			window.activeSessionUser.set({
				username: username,
				token: token,
				logged_in: true,
				group: group
			})
		}
	};

	var initializeModernizr = function() {
		$('html').removeClass('canvas')
	};

	var initializeHeight = function () {
		var body = document.body,
			html = document.documentElement;

		var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
		initLoader(height);
		//$('body').css('min-height', height);
	};

	var initLoader = function (scrHeight) {
		//$('.loader').css({'top': scrHeight / 2 - 50}).show();
	};

	var checkBrowserCompatibility = function() {
		BrowserDetect.init();
		var isUpdateNeeded = BrowserDetect.isUpdateNeeded();

		if (isUpdateNeeded) {
			alert('Please, update your browser, it doesn\'t support needed features');
			throw new Error('Update needed');
		}
	}

	var addIterator = function () {
		$.fn.serializeObject = function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name] !== undefined) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		};
	};

	var addSvg = function () {
		/*
		 * Replace all SVG images with inline SVG
		 */
		$('img.svg').each(function(){
			var $img = jQuery(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
				// Get the SVG tag, ignore the rest
				var $svg = jQuery(data).find('svg');
				// Add replaced image's ID to the new SVG
				if(typeof imgID !== 'undefined') {
					$svg = $svg.attr('id', imgID);
				}
				// Add replaced image's classes to the new SVG
				if(typeof imgClass !== 'undefined') {
					$svg = $svg.attr('class', imgClass+' replaced-svg');
				}
				// Remove any invalid XML tags as per http://validator.w3.org
				$svg = $svg.removeAttr('xmlns:a');
				// Replace image with new SVG
				$img.replaceWith($svg);
			}, 'xml');
		});
	}

	var addMenuHandler = function () {
		$('.auth-button').click(function () {
			$(this).next('.auth-menu').slideToggle();
		});
	}

	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		$(document).ready(function($) {
			//addSvg();
			checkBrowserCompatibility();

			window.lastUpdateTime = moment.utc();
			window.openWindow = function() {
				window.location.href = '../editor/';
			}

			initializeModernizr();
			//so lazy
			var csrfToken = $('meta[name="csrf_token"]').attr('content');

			initializeHeight();

			addIterator();

			OAuth.initialize('4caAw7s25v0glGlJEoQgbBjCxkU');

			initializeUser();

			addMenuHandler();

			//Adding to all views triggering event function
			Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);
			Router.initialize();

		});
	}
	return {
		initialize: initialize
	};
});