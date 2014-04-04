define(['jquery', 'underscore', 'backbone', 'views/boardView', 'text!templates/boardContainer.html', 'views/controlPanelView'], function($, _, Backbone, BoardView, BoardViewContainer, ControlPanelView) {

	var newBoardViewContainer = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		tabCount: 0,
		tabs: [],
		curTab: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledBoardTemplate = _.template(BoardViewContainer, {});
			this.container.append(compiledBoardTemplate);

		},
		addTab: function(newBoard) {
			tabs.push({
				id: tabCount++,
				board: newBoard
			});
		}
	})

	return newBoardViewContainer;
}); 
