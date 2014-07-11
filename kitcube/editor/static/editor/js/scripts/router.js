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
			'rerender': 'rerenderView',
			'board': 'showGuiEditor',
			'settings': 'showSettingsView',
			'logout': 'doLogout',
			'login': 'showLoginView',
			'register': 'showRegisterView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			'done': 'outputMsg',
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
				if (!(this.views.current instanceof LoginView) && !(this.views.current instanceof RegisterView)) {
					this.views.current.destroyView();
				}

				this.views.current = undefined;
				window.activeSessionUser.set({cur_view : undefined});
			}
			this.views.current = view;
			window.activeSessionUser.set({cur_view : view});
			$(this.views.current.el).show();
		},
		outputMsg: function() {
			console.log('done');
			if (this.views.current === undefined) {
				this.defaultAction();
			}
		},
		showTextEditorView: function() {
			window.activeSessionUser.checkData();
			
			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			if (this.views.current instanceof TextEditorView)
				return;

			//if (this.views.myTextEditorView === undefined) {
			//this.views.myTextEditorView = new TextEditorView();
			var newTextEditor = new TextEditorView();
			//}

			//this.showView(this.views.myTextEditorView);
			this.showView(newTextEditor);
			this.views.myPanelView.onEdit();
			//$('#guiEditor').css('margin', '0 auto');
			$('#guiEditor').css('width', '');
			$('#guiEditor').css('height', '');
			$('#guiEditor').show();
		},
		rerenderView: function() {
			console.log("RERENDERING");
			if (this.views.current === undefined) {
				this.defaultAction();
				return;
			}

			var newView = undefined;
			if (this.views.current instanceof SettingsView) {
				this.views.current.destroyView();
				newView = new SettingsView();
			}
			else if (this.views.current instanceof TextEditorView) {
				this.views.current.destroyView();
				newView = new TextEditorView();
			}
			else if (this.views.current instanceof GuiEditorView) {
				this.views.current.destroyView();
				this.views.current = undefined;
				newView = new GuiEditorView();
				newView.showControlPanel();
				//$('#guiEditor').css('margin-left', '220px');
				var canvWidth = $('#tabs').width() > $(document).width() - 5? $('#tabs').width() : $(document).width() - 5;
				var canvHeight = $('#tabs').height();
				$('#guiEditor').css('width', canvWidth);
				$('#guiEditor').css('height', canvHeight + 85);
				$('#guiEditor').css('margin', '0 auto');
			}

			this.views.current = newView;
			window.activeSessionUser.set({cur_view : newView});
			$(this.views.current.el).show();
			window.location.href = '#done';
		},
		showGuiEditor: function() {
			window.activeSessionUser.checkData();

			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			if (this.views.current instanceof GuiEditorView)
				return;

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
			var canvWidth = $('#tabs').width() > $(document).width() - 5? $('#tabs').width() : $(document).width() - 5;
			var canvHeight = $('#tabs').height();
			$('#guiEditor').css('width', canvWidth);
			$('#guiEditor').css('height', canvHeight + 85);
			$('#guiEditor').css('margin', '0 auto');
			$('#guiEditor').show();
		},
		showSettingsView: function() {
			window.activeSessionUser.checkData();

			if (this.views.myPanelView === undefined) {
				this.views.myPanelView = new ProjectPanelView();
			}

			if (this.views.current instanceof SettingsView)
				return;

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
			$('#guiEditor').css('height', '');
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
							window.location.href = "#login";
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

			$('#guiEditor').hide();
			$('#loginButton').hide();

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
				if (this.views.current instanceof GuiEditorView || this.views.current instanceof TextEditorView || this.views.current instanceof SettingsView)
					return;
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