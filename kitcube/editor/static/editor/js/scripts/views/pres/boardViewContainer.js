define(['jquery', 'underscore', 'backbone', 'text!templates/pres/boardContainer.html', 'text!templates/pres/boardContainerProjects.html', 'views/pres/controlPanelView'], function($, _, Backbone, BoardViewContainer, DropDownProjects, ControlPanelView) {

	var newBoardViewContainer = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		tabCount: 0,
		tabs: [],
		curTab: undefined,
		projDrop: undefined,
		controlPanel: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledBoardTemplate = _.template(BoardViewContainer, {});
			this.container.append(compiledBoardTemplate);
			var dropDownTemplate = _.template(DropDownProjects, {});
			//$('#banner').append(dropDownTemplate);
			this.projDrop = $('#projDropdown');
			//this.projDrop.css('margin-right', $('#loginPanel').width() + 5);
			//this.projDrop.find('button').css('height', $('#loginPanel').height());
			//$(".nav-tabs").css('width', $('#boardContainer').width());
			this.el = $('#boardContainer');
			this.el.append($(dropDownTemplate));
			this.controlPanel = new ControlPanelView();
			this.el.hide();
			this.controlPanel.hide();
			$('#tabs').tabs();
		},
		addTab: function(newBoard) {
			tabs.push({
				id: tabCount++,
				board: newBoard
			});
		},
		openTab: function(id) {

		}
	})

	return newBoardViewContainer;
}); 
