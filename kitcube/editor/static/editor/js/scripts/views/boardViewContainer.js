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
			$(".nav-tabs").css('width', $('#boardContainer').width());
			this.el = $('#boardContainer');
		},
		addTab: function(newBoard) {
			tabs.push({
				id: tabCount++,
				board: newBoard
			});
		},
		openTab: function(id) {

		},
		hide: function() {
			this.el.hide();
		},
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if(this.el.is(':hidden')) {
				return true;
			}
			else 
				return false;
		},
		isShown: function() {
			if(this.el.is(':hidden')) {
				return false;
			}
			else 
				return true;
		}
	})

	return newBoardViewContainer;
}); 
