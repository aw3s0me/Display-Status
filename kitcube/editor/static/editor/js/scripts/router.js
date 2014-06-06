// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'kit.sizeDetector',
	'views/pres/boardView',
	'views/pres/loginView',
	//'views/pres/controlPanelView',
	'views/pres/txtEditorView',
	'views/pres/settingsView',
	'views/pres/boardViewContainer',
	'views/pres/navPanelView',
	'views/pres/registerView'
], function($, _, Backbone, sizeDetector, BoardView, LoginView, TextEditorView, SettingsView, BoardViewContainer, NavPanelView, RegisterView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'editor': 'showTextEditorView',
			//'editor/p:proj/conf/:confid': 'showTextEditorViewId',
			'editor/:proj/:conf': 'showTextEditorViewId',
			'board/:id': 'showBoardView',
			'settings': 'showSettingsView',
			'settings/:proj/:conf': 'showSettingsViewId',
			'logout': 'doLogout',
			//'control': 'showControlPanelView',
			'login': 'showLoginView',
			'register': 'showRegisterView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		views: {},
		showView: function(view) {
			if (this.views.current != undefined) {
				$(this.views.current.el).hide();
				this.views.current.trigger('hide');
			}
			this.views.current = view;
			$(this.views.current.el).show();
		},
		hideView: function(view) {
			this.views.hide();
		},
		showTextEditorView: function() {
			if (this.views.myTextEditorView === undefined) {
				this.views.myTextEditorView = new TextEditorView();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.myTextEditorView);
		},
		showSettingsViewId: function(proj, confid) {
			console.log("id routing sett", proj, confid);
		},
		showTextEditorViewId: function(proj, confid) {
			console.log("id routing text", proj, confid);
		},
		showGuiEditor: function() {
			if (this.views.myGuiEditor === undefined) {
				this.views.myGuiEditor = new BoardViewContainer();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.myGuiEditor);
		},
		showSettingsView: function() {
			if (this.views.mySettingsView === undefined) {
				this.views.mySettingsView = new SettingsView();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.mySettingsView);

		},
		showControlPanelView: function() {
			this.showView(this.views.myControlPanelView);
		},
		showLoginView: function() {
			if (this.views.myLoginView === undefined) {
				this.views.myLoginView = new LoginView();
			}
			this.showView(this.views.myLoginView);

			$('.loginHref').text('Board');
			$('.loginHref').attr('href', '#board');
		},
		doLogout: function() {
			if (window.activeSessionUser.get('logged_in')) {
				var user = window.activeSessionUser;
				if (!user.get('logged_in')) {
					return;
				}
				var token = user.get('token');
				//var dataToSend = JSON.stringify({'token': token});
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
				var curUser = window.activeSessionUser;
				$('.loginHref').text('Login');
				$('.loginHref').attr('href', '#login');
				$('#userStatus').text('');
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
			console.log("404: " + actions);
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;

		if (!window.activeSessionUser.get('logged_in')) {
			app_router.views = {
				myLoginView: new LoginView()
			}

			app_router.showView(app_router.views.myLoginView);
		} else {
			//app_router.showGuiEditor();
		}

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});