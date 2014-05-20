define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var UserModel = Backbone.Model.extend({
		defaults: function() {
			return {
				id: 0,
				username: "",
				//password: "",
				token: "",
				role: "",
				logged_in: false,
				group: ""
			}
		},
		initialize: function(){
			var self = this;
			this.on('logout', function() {
				self.onlogout();
			})
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
		},
		isAuthorized: function(){
			return Boolean(this.get('token'));
		},
		url: function() {
			return 'user/';
		},
		onlogout: function() {
			this.resetSession();
		},
		onerror: function() {
			this.resetSession();
		},
		resetSession: function() {
			this.clear();
			this.set(this.defaults);
			$.removeCookie('access_token');
			//window.location.href = '#login';
		}
	});

	return UserModel;
});