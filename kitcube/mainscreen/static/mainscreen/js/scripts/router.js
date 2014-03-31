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
	'views/settingsView'
], function($, _, Backbone, sizeDetector, BoardView, LoginView, ControlPanelView, TextEditorView, SettingsView ) {
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
		myTextEditorView: undefined,
		self: this,
		tabCount: 0,
		boardViewTabs: [],
		loginView: undefined,
		controlPanelView: undefined,
		settingsView: undefined,
		showTextEditorView: function() {
			if ($("#board-container").val() !== undefined)
				$("#board-container").hide();
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").show();
		},
		showSettingsView: function() {
			//show it
		},
		showBoardView: function(id) {
			var numTab = (id === undefined)? 0 : parseInt(id);
			var text = this.myTextEditorView.externEditor.getSession().getValue();

			if (!this.boardViewTabs[numTab]) {
				//if tab doesnt exist so create
				this.boardViewTabs.push({
					id: this.tabCount++,
					board: new BoardView({aceText : text}),
				});

				var curBoard = this.boardViewTabs[numTab].board; //get board obj

				var container = curBoard.container; //get jquery container
				if ($("#kitcube-console").val() !== undefined) //if console still opened
					$("#kitcube-console").hide();
				if (container.val() !== undefined) { //show container
					container.show();
				}
			}
			else {
				//show board according to tab
				var curBoard = this.boardViewTabs[numTab].board;
				var container = curBoard.container;
				
				curBoard.reinitWithOptions({aceText : text});
				if ($("#kitcube-console").val() !== undefined)
					$("#kitcube-console").hide();
				if (container.val() !== undefined) {
					container.show();
				}
			}	
		},
		changeUnitNumber: function(x, y) {
			if (self.boardView !== undefined)
				self.boardView.change(x, y);
		},
		resizeBoard: function(x, y) {
			console.log('resizeBoard2');
			if (self.boardView !== undefined)
				self.boardView.resize(x, y);
		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log('No route:', actions);
			this.showBoardView();
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;
		app_router.myTextEditorView = new TextEditorView();

		//app_router.boardView.initialize(); //2times creates board SHIIT
		/*app_router.loginView = new LoginView();
		app_router.controlPanelView = new ControlPanelView();
		app_router.settingsView = new SettingsView(); */

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});