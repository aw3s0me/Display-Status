// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'views/pres/loginView',
	'views/pres/userPanelView',
	'views/pres/txtEditorView',
	'views/pres/settingsView',
	'views/pres/guiEditorView',
	'views/pres/registerView',
	'views/pres/projectPanel',
], function($, _, Backbone, LoginView, UserPanelView, TextEditorView, SettingsView, GuiEditorView, RegisterView, ProjectPanelView) {
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
				
				//if (this.views.current instanceof GuiEditorView) {
					//this.views.current.hideControlPanel();
				//}
				//$(this.views.current.el).hide();
				if (!(this.views.current instanceof LoginView) || !(this.views.current instanceof RegisterView)) {
					this.views.current.destroyView();
				}

				this.views.current = undefined;
				window.activeSessionUser.set({cur_view : undefined});
			}
			this.views.current = view;
			window.activeSessionUser.set({cur_view : view});
			$(this.views.current.el).show();
		},
		showTextEditorView: function() {
			if (!window.activeSessionUser.isDataInitialized()) {
				window.activeSessionUser.getInitData();
			}

			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			//if (this.views.myTextEditorView === undefined) {
			//this.views.myTextEditorView = new TextEditorView();
			var newTextEditor = new TextEditorView();
			//}

			//this.showView(this.views.myTextEditorView);
			this.showView(newTextEditor);
			this.views.myPanelView.onEdit();
			//$('#guiEditor').css('margin', '0 auto');
			$('#guiEditor').css('width', '');
			$('#guiEditor').show();
		},
		showSettingsViewId: function(proj, confid) {
			console.log("id routing sett", proj, confid);
		},
		showTextEditorViewId: function(proj, confid) {
			console.log("id routing text", proj, confid);
		},
		showGuiEditor: function() {
			if (!window.activeSessionUser.isDataInitialized()) {
				window.activeSessionUser.getInitData();
			}

			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			//if (this.views.myGuiEditor === undefined) {
				//this.views.myGuiEditor = new GuiEditorView();
			//}
			var newGuiEditor = new GuiEditorView();

			//this.showView(this.views.myGuiEditor);
			this.showView(newGuiEditor);

			//this.views.myGuiEditor.showControlPanel();
			this.views.myPanelView.onGui();
			newGuiEditor.showControlPanel();
			//$('#guiEditor').css('margin-left', '220px');
			var canvWidth = $('#tabs').width();
			$('#guiEditor').css('width', canvWidth);
			$('#guiEditor').show();
		},
		showSettingsView: function() {
			if (!window.activeSessionUser.isDataInitialized()) {
				window.activeSessionUser.getInitData();
			}

			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			//if (this.views.mySettingsView === undefined) {
				//this.views.mySettingsView = new SettingsView();
			//}
			var newSettingsView = new SettingsView();

			//this.showView(this.views.mySettingsView);
			this.showView(newSettingsView);
			//this.views.myPanelView.onEdit();
			this.views.myPanelView.onEdit();
			//$('#guiEditor').css('margin', '0 auto');
			$('#guiEditor').css('width', '');
			$('#guiEditor').show();
		},
		showLoginView: function() {
			if (this.views.myLoginView === undefined) {
				this.views.myLoginView = new LoginView();
			}
			this.showView(this.views.myLoginView);
			this.views.myLoginView.eventAggregator.trigger('onuseratloginscreen');
			$('#guiEditor').hide();
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
			//app_router.showGuiEditor();
		}

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});