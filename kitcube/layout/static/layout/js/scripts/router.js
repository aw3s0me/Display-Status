// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'kit.sizeDetector',
	'views/boardView',
	'views/loginView',
	'views/controlPanelView',
	'views/txtEditorView',
	'views/settingsView',
	'views/boardViewContainer'
], function($, _, Backbone, sizeDetector, BoardView, LoginView, ControlPanelView, TextEditorView, SettingsView, BoardViewContainer ) {
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
		showLoginView: function() {
			if (this.myLoginView === undefined) {
				this.myLoginView = new LoginView();
			}
		},
		showTextEditorView: function() {
			if (this.myTextEditorView === undefined) {
				this.myTextEditorView = new TextEditorView();
			}
		},
		showSettingsView: function() {
			if (this.mySettingsView === undefined) {
				this.mySettingsView = new SettingsView();
			}
		},
		showBoardView: function(id) {
			if (this.myBoardViewContainer === undefined) {
				this.myBoardViewContainer = new BoardViewContainer();
				this.myControlPanelView = new ControlPanelView();
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
			console.log('No route:', actions);
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
			
		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});