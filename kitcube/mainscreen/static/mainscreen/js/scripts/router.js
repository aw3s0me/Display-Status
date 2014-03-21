// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'kit.sizeDetector',
	'views/board',
	'views/userPanel',
	'views/menuRight',
	'views/txtEditor'
], function($, _, Backbone, sizeDetector, BoardView, UserPanelView, MenuRightView, TextEditorView /*TxtBrdView*/ ) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'editor': 'showTextEditorView',
			'board': 'showBoardView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			// Default
			'*actions': 'defaultAction'
		},
		myTextEditorView: undefined,
		self: this,
		boardView : null,
		showTextEditorView: function() {
			if ($("#board-container").val() !== undefined)
				$("#board-container").hide();
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").show();
		},
		showMenuLeftView: function() {
			var myMenuLeftView = new MenuLeftView();
			myMenuLeftView.render();
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
		showMenuRightView: function() {
			var myMenuRightView = new MenuRightView();
			myMenuRightView.render();
		},
		showMenuLeftView: function() {
			var myMenuLeftView = new MenuLeftView();
			myMenuLeftView.render();
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
		app_router.boardView = new BoardView(/*{aceText : text, type: typeTxt}*/);
		//app_router.boardView.initialize(); //2times creates board SHIIT
		// As above, call render on our loaded module
		// 'views/users/list'

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});