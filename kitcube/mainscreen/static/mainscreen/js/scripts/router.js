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
			'board': 'showBoardView',
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
		boardView: undefined,
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
		showBoardView: function() {
			if (self.boardView) {
				return;
			}
			//self.boardView.initialize(text);
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").hide();
			if ($("#board-container").val() !== undefined) {
				$("#board-container").show();
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
		//app_router.myTextEditorView.initialize();
		//console.log("btn: " + { el: $('#canvasButton')});
		app_router.boardView = new BoardView({ el: $('#canvasButton')}/*{aceText : text, type: typeTxt}*/);
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