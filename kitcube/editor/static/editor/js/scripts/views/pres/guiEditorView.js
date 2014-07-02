define(['jquery', 'underscore', 'backbone', 'text!templates/pres/guiEditorContainer.html', 'views/pres/controlPanelView', 'views/widgets/editorBoardView'], function($, _, Backbone, GuiEditorContainer, ControlPanelView, EditorBoardView) {

	var guiEditorView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		curTab: undefined,
		metaName: "guiEditorView",
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
			var curData = window.activeSessionUser.get('cur_data_cfg');
			//var firstData = dataReq.data[0].
			var compiledBoardTemplate = _.template(GuiEditorContainer, {});
			this.container.append(compiledBoardTemplate);
			this.el = $('#guiEditorContainer');
			this.el.hide();
			if (curData) {
				this.elemBoard = new EditorBoardView({
					initdata: curData
				});
				this.onConfigLoaded();
			}

			this.controlPanel = new ControlPanelView();
			//this.controlPanel.open();
			//var canvHeight = $('#container').height();
			//$('#controlPanel').css('min-height', canvHeight);
		},
		onConfigLoaded: function() {
			//$('#guiEditorMenuContainer').css('width', canvWidth);
			//$('#guiEditorContainer').css('width', canvWidth);
		},
		getCfg: function() {
			var serCfg = this.elemBoard.serialize();
			return JSON.stringify(serCfg);
		},
		destroyView: function() {
			this.elemBoard.destroyView();
			this.remove();
			this.el.remove();
			this.controlPanel.destroyView();
  			this.unbind();
  			this.el = undefined;
			this.curTab = undefined;
			this.controlPanel = undefined;
			this.elemBoard = undefined;
		}
	})

	return guiEditorView;
}); 
