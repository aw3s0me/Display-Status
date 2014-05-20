// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'kit.sizeDetector',
	'views/pres/boardView',
	'views/pres/loginView',
	'views/pres/registerView'
	//'views/pres/controlPanelView',
	//'views/pres/txtEditorView',
	//'views/pres/settingsView'
], function($, _, Backbone, sizeDetector, BoardView, LoginView, RegisterView /*ControlPanelView,TextEditorView, SettingsView*/ ) {
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			//'editor': 'showTextEditorView',
			'board': 'showBoardView',
			//'settings': 'showSettingsView',
			//'control': 'showControlPanelView',
			'login': 'showLoginView',
			'logout': 'doLogout',
			'register': 'showRegisterView',
			'onresize/:x/ycoord:y': 'resizeBoard',
			'onchange/:x/ycoord:y': 'changeUnitNumber',
			'test': 'testPermissions',
			// Default
			'*actions': 'defaultAction'
		},
		self: this,
		tabCount: 0,
		boardViewTabs: [],
		curTab: undefined,
		views: {},
		testPermissions: function() {
			var user = window.activeSessionUser;
			if (!user.get('logged_in')) {
				return;
			}
			data = {
				title: "Katrein",
				description: "Katrein status display",
				username: user.get('username'),
				token: user.get('token')
			}
			data = JSON.stringify(data);

			$.ajax({
				url: 'http://localhost:8000/kitcube/projectinfo/',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(data) {
					console.log(data);
				}
			})
			
		},	
		getCfg: function() {
			var text;
			$.ajax({
				url: '../static/mainscreen/tempcfg/fullempty.json',
				async: false,
				dataType: 'text', //explicitly requesting the xml as text, rather than an xml document
				success: function(data){
					text = data;
				}
			});	
			return text;
		},
		showView: function(view) {
			if (this.views.current != undefined) {
				$(this.views.current.el).hide();
				this.views.current.trigger('hide');
			}
			this.views.current = view;
			$(this.views.current.el).show();
		},
		showBoardView: function(id) {
			if (this.views.myBoardViewContainer === undefined) {
				this.views.myBoardViewContainer = new BoardView({aceText: this.getCfg()});
			}

			this.showView(this.views.myBoardViewContainer);

			if (!window.activeSessionUser.get('logged_in')) {
				$('.loginHref').text('Login');
				$('.loginHref').attr('href', '#login');
			}
			else {
				var curUser = window.activeSessionUser;
				$('.loginHref').text('Logout');
				$('.loginHref').attr('href', '#logout');
				$('#userStatus').text('Welcome! ' + curUser.get('username') + ',');
			}
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
		showLoginView: function() {
			if (this.views.myLoginView === undefined) {
				this.views.myLoginView = new LoginView();
			}
			this.showView(this.views.myLoginView);

			$('.loginHref').text('Board');
			$('.loginHref').attr('href', '#board');
		},
		doLogout: function() {
			if (this.views.myLoginView !== undefined && window.activeSessionUser.get('logged_in')) {
				this.views.myLoginView.logout();
				var curUser = window.activeSessionUser;
				$('.loginHref').text('Login');
				$('.loginHref').attr('href', '#login');
				$('#userStatus').text('');
			}
		},
		showRegisterView: function(){
			if (this.views.myRegisterView === undefined) {
				this.views.myRegisterView = new RegisterView();
			}

			this.showView(this.views.myRegisterView);
		},
		changeUnitNumber: function(x, y) {
		},
		resizeBoard: function(x, y) {

		},
		defaultAction: function(actions) {
			// We have no matching route, lets just log what the URL was
			console.log('No route:', actions);
			this.showBoardView();
		}
	});

	var initialize = function() {
		var app_router = new AppRouter;

		//var start_url = 

		/*app_router.views = {
			myBoardViewContainer : new BoardView({aceText: app_router.getCfg()})
		} */

		Backbone.history.start();
	};
	return {
		initialize: initialize,

	};
});