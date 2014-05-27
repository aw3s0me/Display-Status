//The router will then load the correct dependencies depending on the current URL.
define([
	'jquery',
	'underscore',
	'backbone',
	//'flatui-app',
	'ace',
	'kitgrid',
	'yaml',
	'jqgrid',
	'chosen',
	//'jquerysort',
	//'fittext',
	//'slabtext',
	'bigtext',
	'highstock',
	//'regression',
	//'vendor/momentjs/min/moment.min',
	'momentjs',
	//'fittext',
	'oauthio',
	"kit.sizeDetector",
	"kit.parser",
	"kit.dataDownloader",
	"models/userModel",
	'cookie',
	'router', // Request router.js
], function($, _, Backbone, /*FlatUi,*/ ace, kitgrid, YAML, jqGrid, chosen, OAuthio,/*Sortable, fitText, slabText,*/ bigtext, Highstock, /* regression,*/ moment, sizeDet, parser, dataDownloader, UserModel, Cookie, Router) {
	var initialize_user = function() {
		var token = $.cookie('access_token');
		window.activeSessionUser = new UserModel();
		if (token && token.length > 0) {
			var username = $('#userStatus').find('span').text();
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

	var initialize = function() {
		// Pass in our Router module and call it's initialize function
		$(document).ready(function($) {

			window.db = new dataCacher('httpgetcsv', true, false, false, false);
			window.host = "http://katrin.kit.edu/adei/";
			/* test
			try
			{
				db.getData('fpd', 'katrin_rep', '0', '0,1,2,3,4,5', '1399896662-1401106262', 800, 'mean', function(obj)
				{
					console.log(obj);
				})
	
			}
			catch(msg) {
				console.log(msg)
			}

			*/

			var csrfToken = $('meta[name="csrf_token"]').attr('content');
			console.log(csrfToken);
			$(document).ajaxSend(function(event, xhr, settings) {
				/* stuff to do before an AJAX request is sent */
				//xhr.setRequestHeader('X-CSRFToken', csrfToken);
			});

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
			$('#toggleGridButton').show();
			Router.initialize();
			//document.location.href = '#board';

			$("#btnBoard").click(function() {
				document.location.href = '#board/0';
			});

			$("#btnTxt").click(function() {
				document.location.href = '#editor';
			});

			$("#btnLogin").click(function() {
				document.location.href = '#login';
			});



		});
	}
	return {
		initialize: initialize
	};
});