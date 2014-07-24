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
	//'regression',
	//'vendor/momentjs/min/moment.min',
	//'momentjs',
	//'fittext',
	"kit.sizeDetector",
	"kit.parser",
	'cookie',
	//'switch',
	"models/userModel",
	//'cacher',
	//'modernizr',
	'router' // Request router.js
], function($, _, Backbone, jQueryUI, kitgrid, YAML, jqGrid, OAuthio, HighchartsLeg, /* momentJS,*/ sizeDet, parser, JqCookie, /*Switch,*/ UserModel, /*Cacher,*/ /*Modernizr,*/ Router) {
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

	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		$(document).ready(function($) {

			//window.db = new dataCacher('httpgetcsv', true, false, false, false);
			//window.host = "http://katrin.kit.edu/adei-detector/";
			window.host = "http://katrin.kit.edu/adei/";
			window.lastUpdateTime = moment.utc();
			window.openWindow = function() {
				window.location.href = '../editor/';
			}

			initialize_modernizr();
			//so lazy
			/*try
			{
				console.log(new Date(1400700000 * 1000), new Date(1401409791 * 1000));

				db.getData('fpd', 'katrin_rep', '0', '2', '1400700000-1401409791', 800, 'mean', function(obj)
				{
					var data = obj.data;
					var datetime = obj.dateTime;
					console.log(new Date(datetime[0] * 1000), new Date(datetime[datetime.length - 1] * 1000));
				})
	
			}
			catch(msg) {
				console.log(msg)
			} */
			var csrfToken = $('meta[name="csrf_token"]').attr('content');
			console.log(csrfToken);
			//$(document).ajaxSend(function(event, xhr, settings) {
				/* stuff to do before an AJAX request is sent. ERROR */
			//	xhr.setRequestHeader('X-CSRFToken', csrfToken);
			//});

			var body = document.body,
    		html = document.documentElement;

			var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

			$('body').css('min-height', height);

			//console.log($('#wrapper')[0].clientHeight)

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