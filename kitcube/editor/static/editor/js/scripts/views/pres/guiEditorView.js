define(['jquery', 'underscore', 'backbone', 'text!templates/pres/guiEditorContainer.html', 'views/pres/controlPanelView', 'views/widgets/editorBoardView'], function($, _, Backbone, GuiEditorContainer, ControlPanelView, EditorBoardView) {

	var guiEditorView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		curTab: undefined,
		projDrop: undefined,
		descDiv: undefined,
		controlPanel: undefined,
		elemBoard: undefined,
		initialize: function() {
			var self = this;
			this.render();
			$('#guiEditorProjDropdown li ul li a').click(function() {
				var chosen_conf = $(this).text();
				var chosen_proj = $(this).parent().parent().parent().children('a').text();
				self.descDiv.find('.proj').text(chosen_proj);
				self.descDiv.find('.conf').text(chosen_conf);
				console.log(chosen_conf);
			});
		},
		render: function() {
			var dataReq = this.getInitData();
			var firstData = dataReq.data[0]['first_config_content'];
			//var firstData = dataReq.data[0].
			var compiledBoardTemplate = _.template(GuiEditorContainer, {
				items: dataReq.data,
				first_proj: dataReq.data[0].title,
				first_conf: dataReq.data[0].configs[0].title
			});
			this.container.append(compiledBoardTemplate);
			this.projDrop = $('#guiEditorProjDropdown');
			this.descDiv = $('#guiEditorProjectDesc');
			//this.projDrop.css('margin-right', $('#loginPanel').width() + 5);
			//this.projDrop.find('button').css('height', $('#loginPanel').height());
			//$(".nav-tabs").css('width', $('#boardContainer').width());
			this.el = $('#guiEditorContainer');
			this.el.hide();
			if (firstData) {
				this.elemBoard = new EditorBoardView({
					initdata: firstData
				});
			}
		},
		getInitData: function() {
			var user = window.activeSessionUser;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return;
			}
						
			$.ajax({
				url: '/initprojconf/',
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			return result;
		},
		updateLists: function() {
			var user = window.activeSessionUser;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return;
			}
						
			$.ajax({
				url: '/updateprojconf/',
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			return result;
		},
		getConfig: function(projname, confname) {
			var user = window.activeSessionUser;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return;
			}
						
			$.ajax({
				url: '/' + projname + '/configs/' + confname,
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			return result;	
		}
	})

	return guiEditorView;
}); 
