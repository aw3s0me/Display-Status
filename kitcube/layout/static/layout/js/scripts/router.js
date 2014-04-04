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
		curTab: undefined,
		myLoginView: undefined,
		controlPanelView: undefined,
		mySettingsView: undefined,
		showLoginView: function() {
			if (this.myLoginView === undefined) {
				this.myLoginView = new LoginView();
			}
		},
		showTextEditorView: function() {
			/*if ($("#board-container").val() !== undefined) {
				$("#board-container").hide();
				if (this.curTab) {
					var newText = this.curTab.serializeToJson();
					this.myTextEditorView.externEditor.getSession().setValue(newText);
				}
				
			} */

			if (this.myTextEditorView === undefined) {
				this.myTextEditorView = new TextEditorView();
			}

			//if ($("#kitcube-console").val() !== undefined)
				//$("#kitcube-console").show();
		},
		showSettingsView: function() {
			if (this.mySettingsView === undefined) {
				this.mySettingsView = new SettingsView();
			}
		},
		showBoardView: function(id) {
			var numTab = (id === undefined)? 0 : parseInt(id);
			//var text = this.myTextEditorView.externEditor.getSession().getValue();
			if (!this.boardViewTabs[numTab]) {
				//if tab doesnt exist so create
				console.log('doesnt exist');

				//var textObj = {aceText : text};

				this.boardViewTabs.push({
					id: this.tabCount++,
					board: new BoardView()
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
				var container = curBoard.container;
				console.log('exists');
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
			
		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});