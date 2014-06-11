// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/pres/boardView',
	'views/pres/loginView',
	'views/pres/registerView',
	'views/pres/userPanelView'
	//'views/pres/controlPanelView',
	//'views/pres/txtEditorView',
	//'views/pres/settingsView'
], function($, _, Backbone, BoardView, LoginView, RegisterView, UserPanelView /*ControlPanelView,TextEditorView, SettingsView*/ ) {

	var getCfg = function() {
		var text;
		var cfgType = 'default';
		var width = $(window).width();   // returns width of browser viewport
		var height = $(window).height();   // returns heightof browser viewport

		if (window.innerHeight > window.innerWidth) {
			//portrait orientation
			cfgType = 'portrait';
		}
		else {
			//cfgType = 'landscape';
			cfgType = 'default';
			//landscape orientation
		}

		/*if (width <= 320) {
			//
			cfgType = 'smportrait';
		}
		else if (width >= 768 && width <= 1024) {
			//tablet landscape
			cfgType = ''
		} */

		$.ajax({
			url: 'configs/' + cfgType + '/',
			method: 'GET',
			//url: '../static/mainscreen/tempcfg/empty.json',
			//url: '../static/mainscreen/tempcfg/katrin_final.json',
			//url: '../static/mainscreen/tempcfg/katrin_final_nodouble.json',
			//url: '../static/mainscreen/tempcfg/tabs.json',
			async: false,
			dataType: 'text', //explicitly requesting the xml as text, rather than an xml document
			success: function(data) {
				var parsed_unicode = JSON.parse(data);
				text = JSON.parse(parsed_unicode['content']);
				console.log(data);
			}
		});
		return text;
	}


	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			//'editor': 'showTextEditorView',
			'board': 'showBoardView',
			//'settings': 'showSettingsView',
			//'control': 'showControlPanelView',
			'login': 'showLoginView',
			'logout': 'doLogout',
			'register': 'showRegisterView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			'test': 'testPermissions',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		views: {},
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
			}
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
				$(this.views.current.el).hide();
				this.views.current.trigger('hide');
			}
			this.views.current = view;
			$(this.views.current.el).show();
		},
		showBoardView: function(id) {
			console.log($('#lblFromNow'));

			if (this.views.myBoardViewContainer === undefined) {
				this.views.myBoardViewContainer = new BoardView({
					aceText: getCfg()
				});
			}

			this.showView(this.views.myBoardViewContainer);
			this.views.myBoardViewContainer.eventAggregator.trigger('onuseratmainscreen');
		},
		showLoginView: function() {
			if (this.views.myLoginView === undefined) {
				this.views.myLoginView = new LoginView();
			}
			this.showView(this.views.myLoginView);
			this.views.myLoginView.eventAggregator.trigger('onuseratloginscreen');

		},
		doLogout: function() {
			if (window.activeSessionUser.get('logged_in')) {
				if (this.views.myLoginView === undefined) {
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
							'Authorization': token,
						},
						success: function(data) {
							user.trigger('logout');
						},
						beforeSend: function(xhr, settings) {
							xhr.setRequestHeader('Authorization', token);
						}
					})
					return;
				} else {
					this.views.myLoginView.logout();
				}

				if (this.views.userPanelView !== undefined) {
					this.views.userPanelView.onUserLogout();
				}
			} else {
				$.cookie("access_token", null, {
					path: '/'
				});
			}
		},
		showRegisterView: function() {
			if (this.views.myRegisterView === undefined) {
				this.views.myRegisterView = new RegisterView();
			}

			this.showView(this.views.myRegisterView);
		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log('No route:', actions);
			this.showBoardView();
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
		initialize: initialize,

	};
});