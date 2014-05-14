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
	'views/pres/settingsView'
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
		curTab: undefined,
		loginView: undefined,
		controlPanelView: undefined,
		settingsView: undefined,
		boardView: undefined,
		showTextEditorView: function() {
			if ($("#board-container").val() !== undefined) {
				$("#board-container").hide();
				if (this.curTab) {
					var newText = this.curTab.serializeToJson();
					this.myTextEditorView.externEditor.getSession().setValue(newText);
				}
				
			}
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").show();
		},
		showSettingsView: function() {
			//show it
		},
		showBoardView: function(id) {
			this.boardView.container.show();
			if ($("#kitcube-console").val() !== undefined) //if console still opened
				$("#kitcube-console").hide();

			/*var numTab = (id === undefined)? 0 : parseInt(id);
			var text = this.myTextEditorView.externEditor.getSession().getValue();
			if (!this.boardViewTabs[numTab]) {
				//if tab doesnt exist so create
				console.log('doesnt exist');

				this.boardViewTabs.push({
					id: this.tabCount++,
					board: new BoardView({aceText : text}),
				});

				this.curTab = this.boardViewTabs[numTab].board; //get board obj

				var container = this.curTab.container; //get jquery container
				if ($("#kitcube-console").val() !== undefined) //if console still opened
					$("#kitcube-console").hide();
				if (container.val() !== undefined) { //show container
					container.show();
				}
			}
			else {
				//show board according to tab
				var curBoard = this.boardViewTabs[numTab].board;
				//console.log(curBoard);
				//curBoard.clear();
				var container = curBoard.container;
				//var tabContainer = curBoard.elContainer;
				//this.boardViewTabs[numTab].board = null;
				//tabContainer.remove();
				//this.boardViewTabs[numTab].board = new BoardView({aceText : text});
				console.log('exists');
				//curBoard.reinitWithOptions({aceText : text});
				if ($("#kitcube-console").val() !== undefined)
					$("#kitcube-console").hide();
				if (container.val() !== undefined) {
					container.show();
				}
			}	*/
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
		app_router.loginView = new LoginView();
		var text = app_router.myTextEditorView.externEditor.getSession().getValue();
		app_router.boardView = new BoardView({aceText : text})
		//app_router.boardView.initialize(); //2times creates board SHIIT
		/*
		app_router.controlPanelView = new ControlPanelView();
		app_router.settingsView = new SettingsView(); */

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});