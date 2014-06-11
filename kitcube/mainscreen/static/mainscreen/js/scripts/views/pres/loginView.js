define(['jquery', 'underscore', 'backbone', 'text!templates/pres/login.html'], function($, _, Backbone, LoginTemplate) {

	var loginView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		form: undefined,
		initialize: function() {
			var self = this;
			this.render();

			this.form.on('submit', function(event) {
				event.preventDefault();
				var credential = {
					username: $(this).find('#password').val(),
					password: $(this).find('#username').val()
				}
				var dataToSend = $(this).serializeObject();
				dataToSend['group'] = $('meta[name="project"]').attr('content');
				dataToSend = JSON.stringify(dataToSend);

				var csrfToken = $('meta[name="csrf_token"]').attr('content');
				console.log(csrfToken);
				$(document).ajaxSend(function(event, xhr, settings) {
					/* stuff to do before an AJAX request is sent */
					xhr.setRequestHeader('X-CSRFToken', csrfToken);
				});

				$.ajax({
					type: 'POST',
					url: '/api-token/login_reg/',
					data: dataToSend,
					success: function(data) {
						console.log(data);
						if (data.name !== undefined && data.id !== undefined)
							self.onSuccessLogin(data);
						else {
							self.onError(data);
						}
					}
				})
				return false;
			});
			$('#loginFacebook').click(function(event) {
				OAuth.popup('facebook', function(err, success) {
					if (err) {

					} else {
						var token = "Token " + success.access_token;
						var group = $('meta[name="project"]').attr('content');
						var dataToSend = {
							'Authorization': token,
							'group': group
						}
						dataToSend = JSON.stringify(dataToSend);
						$.ajax({
							url: '/api-token/login/facebook/',
							method: 'POST',
							data: dataToSend,
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

					} else {
						var token = "Token " + success.access_token;
						var group = $('meta[name="project"]').attr('content');
						var dataToSend = {
							'Authorization': token,
							'group': group
						}
						dataToSend = JSON.stringify(dataToSend);
						console.log(token);
						$.ajax({
							//url: '/api-token/login/google/',
							url: '/api-token/login/google-oauth2/',
							method: 'POST',
							data: dataToSend,
							headers: {
								'Authorization': token,
							},
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
			this.on('hide', function(event) {
				self.clear();
			});

		},
		render: function() {
			var compiledTemplate = _.template(LoginTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#loginFormDiv');
			this.form = this.el.find('#loginForm');
		},
		logout: function() {
			var user = window.activeSessionUser;
			var self = this;
			$.cookie("access_token", null, { path: '/' });
			if (!user.get('logged_in')) {
				return;
			}
			var token = user.get('token');
			//var dataToSend = JSON.stringify({'token': token});
			$.ajax({
				//url: '/api-token/login/google/',
				url: '/api-token/logout/',
				method: 'GET',
				//data: dataToSend,
				headers: {
					'Authorization': token,
				},
				success: function(data) {
					user.trigger('logout');
					self.form.find('#username').removeClass('valid_input');
					self.form.find('#username').removeClass('invalid_input');
					self.form.find('#password').removeClass('invalid_input');
					self.form.find('#password').removeClass('valid_input');
				},
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
		},
		onSuccessLogin: function(loginInfo) {
			$('#loginValidation').empty();
			$('#loginValidation').hide();
			user = window.activeSessionUser;
			user.set({
				username: loginInfo.name,
				//password: loginInfo.password,
				token: loginInfo.token,
				id: loginInfo.id,
				logged_in: true,
				role: loginInfo.userRole,
				group: loginInfo.group
			});
			this.eventAggregator.trigger('userloggedin');
			$.cookie('access_token', user.get('token'), { path: '/'});
			window.location.href = "#board";
		},
		onError: function(errorInfo) {
			var div = $('#loginValidation');
			div.show();
			div.empty();
			for (var errorName in errorInfo) {
				var error = errorInfo[errorName];
				var errorLi = $('<li></li>');
				errorLi.text(error);
				div.append(errorLi);
			}

			if (errorInfo.username !== undefined || errorInfo.group !== undefined) {
				this.form.find('#username').addClass('invalid_input');
				this.form.find('#password').addClass('invalid_input');
				return;
			}
			else {
				this.form.find('#username').addClass('valid_input');
			}

			if (errorInfo.password !== undefined) {
				this.form.find('#password').addClass('invalid_input');
			}
			else {
				this.form.find('#password').addClass('valid_input');
			}

			$('#goEditorButton').remove();

		},
		clear: function() {
			this.form.find('#username').removeClass('valid_input');
			this.form.find('#password').removeClass('valid_input');
			this.form.find('#username').removeClass('invalid_input');
			this.form.find('#password').removeClass('invalid_input');
			this.form.find('#username').val('');
			this.form.find('#password').val('');
			$('#loginValidation').empty();
			$('#loginValidation').hide();

		}


	})

	return loginView;
});