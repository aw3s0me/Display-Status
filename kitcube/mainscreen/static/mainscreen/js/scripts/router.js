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
], function($, _, Backbone, sizeDetector ,BoardView, UserPanelView, MenuRightView, TextEditorView /*TxtBrdView*/ ) {
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
			console.log('editor');
			//var myTextEditorView = new TextEditorView();
			//myTextEditorView.initialize();
			if ($("#kitcube-canvas").val() !== undefined)
				$("#kitcube-canvas").hide();
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").show();
		},
		showMenuLeftView: function() {
			var myMenuLeftView = new MenuLeftView();
			myMenuLeftView.render();
		},
		showBoardView: function() {
			// Call render on the module we loaded in via the dependency array
			// 'views/projects/list'
			//var text = this.myTextEditorView.externEditor.getValue();
			//console.log('showBoard text: ' + text);
			if ($("#kitcube-canvas").val() !== undefined) {
				$("#kitcube-canvas").remove();
			}


			self.boardView = new BoardView(/*{aceText : text, type: typeTxt}*/);
			//self.boardView.initialize(text);
			if ($("#kitcube-console").val() !== undefined)
				$("#kitcube-console").hide();
			if ($("#kitcube-canvas").val() !== undefined) {
				$("#kitcube-canvas").show();
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
		//app_router.myTextEditorView = new TextEditorView();
		//app_router.myTextEditorView.initialize();
		// As above, call render on our loaded module
		// 'views/users/list'

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});