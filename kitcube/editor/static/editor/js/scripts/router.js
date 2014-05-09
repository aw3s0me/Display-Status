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
], function($, _, Backbone, sizeDetector, BoardView, LoginView, /*ControlPanelView,*/ TextEditorView, SettingsView, BoardViewContainer, NavPanelView, RegisterView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'editor': 'showTextEditorView',
			'board/:id': 'showBoardView',
			'settings': 'showSettingsView',
			//'control': 'showControlPanelView',
			'login': 'showLoginView',
			'register': 'showRegisterView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		showView: function(view) {
			if (this.views.current != undefined) {
				//this.views.current.hide();
				this.views.current.hide();
			}
			this.views.current = view;
			//this.views.current.show();
			console.log(this.views);
			this.views.current.show();
		},
		hideView: function(view) {
			this.views.hide();
		},
		showTextEditorView: function(){
			if (this.views.myTextEditorView === undefined) {
				this.views.myTextEditorView = new TextEditorView();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.myTextEditorView);
		},
		showBoardView: function(){
			if (this.views.myBoardViewContainer === undefined) {
				this.views.myBoardViewContainer = new BoardViewContainer();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.myBoardViewContainer);
		},
		showSettingsView: function(){
			if (this.views.mySettingsView === undefined) {
				this.views.mySettingsView = new SettingsView();
			}

			if (this.views.myNavPanelView === undefined) {
				this.views.myNavPanelView = new NavPanelView();
			}

			this.showView(this.views.mySettingsView);

		},
		showControlPanelView: function(){


			this.showView(this.views.myControlPanelView);
		},
		showLoginView: function(){
			if (this.views.myLoginView === undefined) {
				this.views.myLoginView = new LoginView();
			}

			this.showView(this.views.myLoginView);
		},
		showRegisterView: function(){
			if (this.views.myRegisterView === undefined) {
				this.views.myRegisterView = new RegisterView();
			}

			this.showView(this.views.myRegisterView);

		},
			/*var tabs = this.myBoardViewContainer.tabs;
			var numTab = (id === undefined)? 0 : parseInt(id);
			if (!tabs[numTab]) {
				var newBoard = new BoardView();
				this.myBoardViewContainer.addTab(newBoard);

				this.curTab = this.boardViewTabs[numTab].board; //get board obj

			}
			else {
				//show board according to tab
				var curBoard = tabs[numTab];
			}
		},*/
		resizeBoard: function(x, y) {

		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log("404: " + actions);
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
		
		app_router.views = {
			myLoginView : new LoginView()
		}

		app_router.showView(app_router.views.myLoginView);

		app_router.views.myNavPanelView = new NavPanelView();

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});