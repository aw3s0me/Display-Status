// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'kit.sizeDetector',
	'views/pres/boardView',
	'views/pres/loginView',
	'views/pres/controlPanelView',
	'views/pres/txtEditorView',
	'views/pres/settingsView',
	'views/pres/boardViewContainer',
	'views/pres/navPanelView'
], function($, _, Backbone, sizeDetector, BoardView, LoginView, ControlPanelView, TextEditorView, SettingsView, BoardViewContainer, NavPanelView) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'editor': 'showTextEditorView',
			'board/:id': 'showBoardView',
			'settings': 'showSettingsView',
			'control': 'showControlPanelView',
			'login': 'showLoginView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		myLoginView: undefined,
		myControlPanelView: undefined,
		myBoardViewContainer: undefined,
		myTextEditorView: undefined,
		mySettingsView: undefined,
		myNavPanel: undefined,
		showLoginView: function() {
			if (this.myLoginView.isHidden()) {
				this.myLoginView.show();
			}

			if (this.myTextEditorView.isShown()) {
				this.myTextEditorView.hide();
			} 

			if (this.myBoardViewContainer.isShown()) {
				this.myBoardViewContainer.hide();
			} 

			if (this.mySettingsView.isShown()) {
				this.mySettingsView.hide();
			}

		},
		showTextEditorView: function() {
			if (this.myLoginView.isShown()){
				this.myLoginView.hide();
			}

			if (this.myTextEditorView.isHidden()) {
				this.myTextEditorView.show();
			} 

			if (this.myBoardViewContainer.isShown()) {
				this.myBoardViewContainer.hide();
			} 

			if (this.mySettingsView.isShown()) {
				this.mySettingsView.hide();
			}

		},
		showSettingsView: function() {
			if (this.myLoginView.isShown()){
				this.myLoginView.hide();
			}

			if (this.mySettingsView.isHidden()) {
				this.mySettingsView.show();
			} 

			if (this.myBoardViewContainer.isShown()) {
				this.mySettingsView.hide();
			} 

			if (this.myTextEditorView.isShown()) {
				this.myTextEditorView.hide();
			}

		},
		showBoardView: function(id) {

			if (this.myLoginView.isShown()){
				this.myLoginView.hide();
			}

			if (this.myBoardViewContainer.isHidden()) {
				this.myBoardViewContainer.show();
			} 

			if (this.mySettingsView.isShown()) {
				this.mySettingsView.hide();
			} 

			if (this.myTextEditorView.isShown()) {
				this.myTextEditorView.hide();
			}


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
			}*/
		},
		changeUnitNumber: function(x, y) {

		},
		resizeBoard: function(x, y) {

		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			if (!this.myLoginView) {
				this.initialize();
			}
			this.showLoginView();
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
		app_router.myNavPanel = new NavPanelView();

		if (app_router.myLoginView === undefined) {
			app_router.myLoginView = new LoginView();
		}

		if (app_router.myTextEditorView === undefined) {
			app_router.myTextEditorView = new TextEditorView();
			app_router.myTextEditorView.hide();
		}

		if (app_router.myBoardViewContainer === undefined) {
			app_router.myBoardViewContainer = new BoardViewContainer();
			app_router.myBoardViewContainer.hide();
			app_router.myControlPanelView = new ControlPanelView();
			app_router.myControlPanelView.hide();
		}

		if (app_router.mySettingsView === undefined) {
			app_router.mySettingsView = new SettingsView();
			app_router.mySettingsView.hide();
		}

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});