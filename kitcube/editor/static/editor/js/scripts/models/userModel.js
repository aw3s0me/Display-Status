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
				group: "",
				cur_proj: undefined,
				cur_conf: undefined,
				cur_data: undefined
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
		},
		getInitData: function() {
			var user = this;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return;
			}
						
			$.ajax({
				url: '/initprojconf/',
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			});
			
			this.set({
				cur_data: result,
				cur_proj: result.data[0].title,
				cur_conf: result.data[0].configs[0].title
			});
			
			return result;
		},
		isDataInitialized: function() {
			return (this.get('cur_data') !== undefined);
		},
		getConfig: function(projname, confname) {
			var user = this;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return;
			}
						
			$.ajax({
				url: '/' + projname + '/configs/' + confname,
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			});
			this.set({cur_data: result});
			return result;	
		},
		saveConfig: function(cfg) {
			var cfgToSave = JSON.stringify(cfg, null, '\t ');
			console.log(cfgToSave);
		}
	});

	return UserModel;
});