define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

	var loginView = Backbone.View.extend({
		container: $('#conainer'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			
		}


	})

	return loginView;
});
