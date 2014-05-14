define(['jquery', 'underscore', 'backbone', 'text!templates/login.html'], function($, _, Backbone, LoginTemplate) {

	var loginView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		form: undefined,
		initialize: function() {
			var self = this;
			this.render();
			/*this.el.find('#password').click(function(event) {
				var credential = {
					username: self.el.find('#password').val(),
					password: this.val()
				}
				alert(credential);

				self.onLogin();
			});*/
			console.log(this.form);
			this.form.on('submit',function(event) {
				event.preventDefault();
				var credential = {
					username : $(this).find('#password').val(),
					password : $(this).find('#username').val()
				}
				//var user = new UserModel();
				var dataToSend = JSON.stringify($(this).serializeObject());
				/*if (user.validate(credential)) {
					throw "Credential error";
				}*/
				
				console.log(self.form.serialize())
				$.ajax({
					type: 'POST',
					url: '/api-token/login_reg/',
					data: dataToSend,
					success: function(data) {
						console.log(data);
						self.onSuccessLogin(data);
					}
				}) 
				return false;
			});
			$('#loginFacebook').click(function(event) {
				OAuth.popup('facebook', function(err, success) {
				  // handle error with err
				  // use result.access_token in your API request
					if (err) {
 
	                }
	                else {
	                    var token = "Token " + success.access_token;
	                    console.log(token);
	                    //var loginPromise = $http({method:'POST', url: '/api-token/login/' + backend + '/', headers: {'Authorization': token}});
	                    $.ajax({
	                    	url: '/api-token/login/facebook/',
	                    	method: 'POST',
	                    	data: {'Authorization': token},
	                    	success: function(data) {
	                    		console.log(data);
	                    		self.onSuccessLogin(data);
	                    	},
	                    	beforeSend: function(xhr, settings) { 
	                    		xhr.setRequestHeader('Authorization', token); 
	                    	} 
	                    })
	                     
	                }


				});
			});
			$('#loginGoogle').click(function(event) {
				OAuth.popup('google', function(err, success) {
					if (err) {
 
	                }
	                else {
	                    var token = "Token " + success.access_token;
	                    console.log(token);
	 
	                    //var loginPromise = $http({method:'POST', url: '/api-token/login/' + backend + '/', headers: {'Authorization': token}});
	                    $.ajax({
	                    	//url: '/api-token/login/google/',
	                    	url: '/api-token/login/google-oauth2/',
	                    	method: 'POST',
	                    	data: {'Authorization': token},
	                    	headers: {'Authorization': token, },
	                    	success: function(data) {
	                    		console.log(data);
	                    		self.onSuccessLogin(data);
	                    	},
	                    	beforeSend: function(xhr, settings) { 
	                    		xhr.setRequestHeader('Authorization', token); 
	                    	}
	                    })
	                     
	                }
				  //handle error with error
				  //use result.access_token in your API request
				});
			});

		},
		/*events: {
			'submit #loginForm': 'onLogin'
		},*/
		render: function() {
			var compiledTemplate = _.template(LoginTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#loginFormDiv');
			this.form = this.el.find('#loginForm');
			this.hide();
		},
		hide: function() {
			this.el.hide();
		},
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if (this.el.is(':hidden')) {
				return true;
			} else
				return false;
		},
		isShown: function() {
			if (this.el.is(':hidden')) {
				return false;
			} else
				return true;
		},
		onSuccessLogin: function(loginInfo) {
			user = window.activeSessionUser;
			user.set({
				username: loginInfo.name,
				//password: loginInfo.password,
				token: loginInfo.token,
				id: loginInfo.id,
				logged_in: true,
				role: loginInfo.userRole
			});
			$.cookie('access_token', user.get('token'));
			window.location.href = "#board";
		}


	})

	return loginView;
});