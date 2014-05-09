define(['jquery', 'underscore', 'backbone', 'text!templates/navPanel.html'], function($, _, Backbone, NavPanelTemplate) {

	var NavPanelView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(NavPanelTemplate, {});
			this.container.append(compiledTemplate);
			$('#navPanel > li').hover(
				function() {
					$('a', $(this)).stop().animate({
						'marginLeft': '-2px'
					}, 200);
				},
				function() {
					$('a', $(this)).stop().animate({
						'marginLeft': '-40px'
					}, 200);
				}
			);
			//$(element).chosen();
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

	return NavPanelView;
});