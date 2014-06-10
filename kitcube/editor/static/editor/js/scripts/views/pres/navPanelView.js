define(['jquery', 'underscore', 'backbone', 'text!templates/navPanel.html'], function($, _, Backbone, NavPanelTemplate) {

	var NavPanelView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
			this.on('logout', function() {
				if (this.el) {
					this.el.remove();
				}
			}, this);
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
			this.el = $('#navPanel');
			//$(element).chosen();
		}
	})

	return NavPanelView;
});