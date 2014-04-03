define(['jquery', 'underscore', 'backbone', 'text!templates/login.html'], function($, _, Backbone, LoginTemplate) {

	var loginView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
			
		},
		render: function() {
			var compiledTemplate = _.template(LoginTemplate, {});
			this.container.append(compiledTemplate);
		}


	})

	return loginView;
});
