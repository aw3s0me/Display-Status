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
				self.cleanAllErrors();
				var pswdVal = $(this).find('.password').val();
				var usrVal = $(this).find('.username').val();
				var credential = {
					username: usrVal === 'Username'? "" : usrVal,
					password: pswdVal === 'Password'? "": pswdVal
				};

				var dataToSend = credential;
				dataToSend['group'] = $('meta[name="project"]').attr('content');
				dataToSend = JSON.stringify(dataToSend);

				var csrfToken = $('meta[name="csrf_token"]').attr('content');
				$(document).ajaxSend(function(event, xhr, settings) {
					/* stuff to do before an AJAX request is sent */
					xhr.setRequestHeader('X-CSRFToken', csrfToken);
				});

				$.ajax({
					type: 'POST',
					url: '/api-token/login_reg/',
					data: dataToSend,
					success: function(data) {
						if (data.name !== undefined && data.id !== undefined)
							self.onSuccessLogin(data);
						else {
							self.onError(data);
						}
					}
				});
				return false;
			});

			this.el.find('.facebook-btn').click(function(event) {
				OAuth.popup('facebook', function(err, success) {
					if (err) {

					} else {
						var token = "Token " + success.access_token;
						var group = $('meta[name="project"]').attr('content');
						var dataToSend = {
							'Authorization': token,
							'group': group
						};
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

			this.el.find('.google-btn').click(function(event) {
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
								'Authorization': token
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

			this.eventAggregator.trigger('onuseratloginscreen');
		},
		render: function() {
			var compiledTemplate = _.template(LoginTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#login-container');
			this.form = this.el.find('#login-form');
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
					'Authorization': token
				},
				success: function(data) {
					user.trigger('logout');
				},
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
		},
		onSuccessLogin: function(loginInfo) {
			this.cleanAllErrors();

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
			for (var errorType in errorInfo) {
				var errorMsg = errorInfo[errorType];
				this.setError(errorMsg, errorType);
			}
		},
		setError: function(errorMsg, errorType) {
			var elem = this.form.find('#error-msg-' + errorType);
			elem.text(errorMsg).css({'right': -elem.width() - 20}).show();
			elem.siblings('.input-sm').addClass('invalid-sm').show();
		},
		cleanAllErrors: function () {
			var msgEl = this.form.find('.input-msg').each(function (index) {
				$(this).text('').hide();
			});

			var errorEl = this.form.find('.input-sm').removeClass('invalid-sm').hide();
		},
		clear: function() {
			this.el.remove();
		}


	});

	return loginView;
});