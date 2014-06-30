define(['jquery', 'underscore', 'backbone', 'text!templates/pres/guiEditorContainer.html', 'views/pres/controlPanelView', 'views/widgets/editorBoardView'], function($, _, Backbone, GuiEditorContainer, ControlPanelView, EditorBoardView) {

	var guiEditorView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		curTab: undefined,
		controlPanel: undefined,
		elemBoard: undefined,
		initialize: function() {
			var self = this;
			this.render();
		},
		hideControlPanel: function() {
			if (this.controlPanel) {
				$(this.controlPanel.el).hide();
			}
		},
		showControlPanel: function() {
			if (this.controlPanel) {
				$(this.controlPanel.el).show();
			}
		},
		render: function() {
			var dataReq = window.activeSessionUser.get('cur_data');
			var firstData = JSON.parse(dataReq.data[0]['first_config_content']);
			//var firstData = dataReq.data[0].
			var compiledBoardTemplate = _.template(GuiEditorContainer, {});
			this.container.append(compiledBoardTemplate);
			this.el = $('#guiEditorContainer');
			this.el.hide();
			if (firstData) {
				this.elemBoard = new EditorBoardView({
					initdata: firstData
				});
				this.onConfigLoaded();
			}

			this.controlPanel = new ControlPanelView();
			var canvHeight = $('#container').height();
			$('#controlPanel').css('min-height', canvHeight);
		},
		onConfigLoaded: function() {
			var canvWidth = $('#tabs').width();
			$('#guiEditorMenuContainer').css('width', canvWidth);
			$('#guiEditorContainer').css('width', canvWidth);
		},
		saveCfg: function() {
			var serCfg = this.elemBoard.serialize();
			console.log(serCfg);
		}
	})

	return guiEditorView;
}); 
