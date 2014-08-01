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
	"kit.sizeDetector",
	"kit.parser",
	'cookie',
	"models/userModel",
	"dev/helpers",
	'router' // Request router.js
], function($, _, Backbone, jQueryUI, kitgrid, YAML, jqGrid, OAuthio, HighchartsLeg, sizeDet, parser, JqCookie, UserModel, Helpers, Router) {
	var initialize_user = function() {
		var token = $.cookie('access_token');
		window.activeSessionUser = new UserModel();
		if (token && token.length > 0) {
			var username = $('#userName').text();
			var group = $('meta[name="project"]').attr('content');
			if (!username.length || !group.length) {
				return;
			}
			window.activeSessionUser.set({
				username: username,
				token: token,
				logged_in: true,
				group: group
			})
		}
	}

	var initialize_modernizr = function() {
		$('html').removeClass('canvas')
	}

	var checkBrowserCompatibility = function() {
		BrowserDetect.init();
		var isUpdateNeeded = BrowserDetect.isUpdateNeeded();

		if (isUpdateNeeded) {
			alert('Please, update your browser, it doesn\'t support needed features');
			throw new Error('Update needed');
		}
	}


	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		$(document).ready(function($) {
			checkBrowserCompatibility();

			window.lastUpdateTime = moment.utc();
			window.openWindow = function() {
				window.location.href = '../editor/';
			}

			initialize_modernizr();
			//so lazy
			var csrfToken = $('meta[name="csrf_token"]').attr('content');
			console.log(csrfToken);

			var body = document.body,
    		html = document.documentElement;

			var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

			$('body').css('min-height', height);

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

			OAuth.initialize('4caAw7s25v0glGlJEoQgbBjCxkU');
			console.log(OAuth)

			initialize_user();

			//Adding to all views triggering event function
			Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);
			Router.initialize();

		});
	}
	return {
		initialize: initialize
	};
});