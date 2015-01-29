// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/pres/boardView',
	'views/pres/loginView',
	'views/pres/registerView',
	'views/pres/userPanelView'
], function($, _, Backbone, BoardView, LoginView, RegisterView, UserPanelView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			'board': 'showBoard',
			'': 'showBoard',
			'login': 'showLogin',
			'logout': 'doLogout',
			'register': 'showRegister',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			'test': 'testPermissions',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		views: {},
		showBoard: function () {
			this.showView(new BoardView());
		},
		showLogin: function () {
			this.showView(new LoginView());
		},
		showRegister: function () {
			this.showView(new RegisterView());
		},
		testPermissions: function() {
			var user = window.activeSessionUser;
			if (!user.get('logged_in')) {
				return;
			}
			data = {
				title: "Katrein",
				description: "Katrein status display",
				username: user.get('username'),
				token: user.get('token')
			};
			data = JSON.stringify(data);

			$.ajax({
				url: 'http://localhost:8000/kitcube/projectinfo/',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(data) {
					console.log(data);
				}
			})

		},
		showView: function(view) {
			if (this.views.current != undefined) {
				this.views.current.clear();
				this.views.current = null;
			}
			this.views.current = view;
			$('.loader').hide();
			$(this.views.current.el).show();
		},
		doLogout: function() {
			if (this.views.current == undefined) {
				this.showLogin();
			}

			if (window.activeSessionUser.get('logged_in')) {
				$.cookie("access_token", null, {
					path: '/'
				});
				var user = window.activeSessionUser;
				var token = user.get('token');
				$.ajax({
					//url: '/api-token/login/google/',
					url: '/api-token/logout/',
					method: 'GET',
					//data: dataToSend,
					headers: {
						'Authorization': token
					},
					success: function (data) {
						user.trigger('logout');
					},
					beforeSend: function (xhr, settings) {
						xhr.setRequestHeader('Authorization', token);
					}
				})
			}

			if (this.views.userPanelView !== undefined) {
				this.views.userPanelView.onUserLogout();
			}

		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log('No route:', actions);
			//this.showBoardView();
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
		if (app_router.views.userPanelView === undefined) {
			app_router.views.userPanelView = new UserPanelView();
		}
		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});