define(['jquery', 'underscore', 'backbone', 'text!templates/login.html', 'models/userModel'], function($, _, Backbone, LoginTemplate, UserModel) {

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

				var user = new UserModel();
				/*if (user.validate(credential)) {
					throw "Credential error";
				}*/
				user.set({
					username: credential.username,
					password: credential.password
				})
				var url = 'users/';
				/*var csrfToken = $('meta[name="csrf_token"]').attr('content');
				$.ajaxSetup({
					beforeSend: function(xhr, settings) {
						xhr.setRequestHeader("X-CSRFToken", csrfToken);
					}
				})
				$(document).ajaxSend(function(event, xhr, settings) {
					alert('ololo');
				    xhr.setRequestHeader("X-CSRFToken", csrfToken);
				}); */
				console.log(self.form.serialize())
				$.ajax({
					type: 'POST',
					url: url,
					data: self.form.serialize(),
					success: function(data) {
						console.log(data);
					}
				}) 
				return false;
			});
			/*
			$('#loginFacebook').click(function(event) {
				OAuth.popup('facebook', function(err, result) { // or OAuth.callback
				  // handle error with err
				  // call the API with the jQuery's $.ajax style:
				  result.get('/me').done(function(data) {
				    // data is the API call's response. e.g. data.name for your facebook's fullname.
				  });
				});
			}); */
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
	                    	//method: 'GET',
	                    	data: {'Authorization': token},
	                    	headers: {
	                    		'Authorization': token,
	                    		'authorization': token
	                    	},
	                    	success: function(data) {
	                    		console.log('SUCCESS!');
	                    		console.log(data);
	                    	},
	                    	//beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token); } 
	                    	beforeSend: function(xhr, settings) { 
	                    		xhr.setRequestHeader('Authorization', token); 
	                    		xhr.setRequestHeader('authorization', token); 
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
	                    	url: '/api-token/login/auth/',
	                    	method: 'POST',
	                    	data: {'Authorization': token},
	                    	headers: {'Authorization': token, },
	                    	success: function(data) {
	                    		console.log('SUCCESS!');
	                    		console.log(data);
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
		}


	})

	return loginView;
});