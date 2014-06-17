// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/pres/loginView',
	'views/pres/userPanelView',
	//'views/pres/controlPanelView',
	'views/pres/txtEditorView',
	'views/pres/settingsView',
	'views/pres/guiEditorView',
	'views/pres/navPanelView',
	'views/pres/registerView'
], function($, _, Backbone, LoginView, UserPanelView, TextEditorView, SettingsView, GuiEditorView, NavPanelView, RegisterView) {
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
				this.views.myGuiEditor = new GuiEditorView();
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

				
			} else {
				$.cookie("access_token", null, {
					path: '/'
				});
			}

			if (this.views.userPanelView !== undefined) {
				this.views.userPanelView.onUserLogout();
			}

		},
		showUserPanelView: function() {
			if (this.views.myUserPanelView === undefined) {
				this.views.myUserPanelView = new UserPanelView();
			}

			this.showView(this.views.myUserPanelView);
		},
		showRegisterView: function() {
			if (this.views.myRegisterView === undefined) {
				this.views.myRegisterView = new RegisterView();
			}

			this.showView(this.views.myRegisterView);
		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL 
			//this.showGuiEditor();
			if (!window.activeSessionUser.get('logged_in')) {
				console.log('default: ' + 'showLogin')
				this.showLoginView()
			} else {
				console.log('default: ' + 'showGui')
				this.showGuiEditor();
			}
			console.log("404: " + actions); 
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;

		//app_router.showGuiEditor();
		app_router.views.myUserPanelView = new UserPanelView();

		if (!window.activeSessionUser.get('logged_in')) {
			app_router.views = {
				myLoginView: new LoginView()
			}
			app_router.showView(app_router.views.myLoginView);
		} else {
			app_router.showGuiEditor();
		}

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});