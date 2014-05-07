define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				username: undefined,
				password: undefined
			}
		},
		initialize: function(){
		},
		validate: function(attrs){
			if (attrs.username === "" || attrs.username === undefined || attrs.username.length < 4) {
				return "Please enter username. Length should be more than 4 symbols";
			}
			else if (attrs.password === "" || attrs.password === undefined || attrs.username.length < 5) {
				return "Please enter password. Length should be more than 4 symbols";
			}
			else
				return false;
		}
	});

	return User;
});