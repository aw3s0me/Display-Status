define(['jquery', 'underscore', 'backbone', 'text!templates/pres/projectPanel.html'], function($, _, Backbone, ProjectPanelTemplate) {

	var ProjectPanelView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		descDiv: undefined,
		projDrop: undefined,
		initialize: function() {
			this.render();
			var self = this;

			$('#guiEditorProjDropdown li ul li a').click(function() {
				var projEl = $(this).parent().parent().parent().children('a');
				var chosen_conf = $(this).text();
				var chosen_proj = projEl.text();
				var conf_id = $(this).attr('data');
				var proj_id = projEl.attr('data');
				self.descDiv.find('.proj').text(chosen_proj);
				self.descDiv.find('.conf').text(chosen_conf);
				
				window.activeSessionUser.getConfig({projname: proj_id, projtitle: chosen_proj, confname: conf_id, conftitle: chosen_conf});
			});

			this.listenTo(window.activeSessionUser, 'error', this.onError);
			this.listenTo(window.activeSessionUser, 'success', this.onSuccess);

			$('#saveCfgGuiButton').click(function(event) {
				window.activeSessionUser.saveConfig();
				window.activeSessionUser.sendCfgToServer();
			});	

			$('#newCfgButton').click(function(event) {
				alert('onnewcfg');
			});

		},
		onError: function() {
			this.el.find("#lblErrorPanel").fadeIn('slow').delay(3000).fadeOut('slow');
		},
		onSuccess: function() {
			this.el.find("#lblSavePanel").fadeIn('slow').delay(3000).fadeOut('slow');
		},
		render: function() {
			var dataReq = window.activeSessionUser.get('cur_data');

			var compiledTemplate = _.template(ProjectPanelTemplate, {
				items: dataReq.data,
				first_proj: dataReq.data[0].title,
				first_conf: dataReq.data[0].configs[0].title
			});

			this.container.append(compiledTemplate);
			this.el = $('#projectPanel');
			this.projDrop = $('#guiEditorProjDropdown');
			this.descDiv = $('#guiEditorProjectDesc');
			this.el.show();
		},
		onGui: function() {
			this.el.find('#showCntrlPanel').show();
			this.el.find('#toggleGridButton').show();
		},
		onEdit: function() {
			this.el.find('#showCntrlPanel').hide();
			this.el.find('#toggleGridButton').hide();
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
		destroyView: function() {
			$('#guiEditorProjDropdown li ul li a').unbind();
			$('#saveCfgGuiButton').unbind();
			$('#newCfgButton').unbind();
			this.remove();
  			this.unbind();
  			this.eventAggregator.unbind();
		}
	})

	return ProjectPanelView;
});