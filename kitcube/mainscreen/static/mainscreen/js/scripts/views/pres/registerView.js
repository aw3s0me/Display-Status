define(['jquery', 'underscore', 'backbone', 'text!templates/pres/register.html', 'text!templates/pres/register_completed.html', 'models/userModel'], function($, _, Backbone, RegisterTemplate, RegisterComplatedTemplate, UserModel) {

	var registerView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		form: undefined,
		mailOAuthForm: undefined,
		initialize: function() {
			var self = this;
			this.render();

			$('#register-form').on('submit', function(event) {
				event.preventDefault();
				var pswdVal = $(this).find('.password').val();
				var usrVal = $(this).find('.username').val();
				var matchVal = $(this).find('.match').val();
				var emailVal = $(this).find('.email').val();

				var credential = {
					username: usrVal === 'Username'? "" : usrVal,
					password: pswdVal === 'Password'? "": pswdVal,
					match: matchVal === 'Password'? "": matchVal,
					email: emailVal === 'Email'? "": emailVal
				};

				var dataToSend = credential;

				dataToSend['group'] = $('meta[name="project"]').attr('content');
				dataToSend = JSON.stringify(dataToSend);

				var csrfToken = $('meta[name="csrf_token"]').attr('content');
				//console.log(csrfToken);
				$(document).ajaxSend(function(event, xhr, settings) {
					/* stuff to do before an AJAX request is sent */
					xhr.setRequestHeader('X-CSRFToken', csrfToken);
				});

				$.ajax({
					url: '/api-token/register/',
					type: 'POST',
					data: dataToSend,
					success: function(data){
						console.log(data);
						if (data === "Please activate user via mail") {
							self.onSuccessRegistration(data, emailVal);
						}
						else {
							self.onError(data);
						}
						
					}
				})
			});

			this.on('hide', function(event) {
				self.clear();
			});

			this.eventAggregator.trigger('onuseratregscreen');
/*
			$('#registerFacebook').click(function(event) {
				OAuth.popup('facebook', function(err, success) {
					if (err) {

					} else {
						var token = "Token " + success.access_token;
						console.log(token);
						$.ajax({
							url: '/api-token/register-oauth/facebook/',
							method: 'POST',
							data: {
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


				});
			});
			$('#registerGoogle').click(function(event) {
				OAuth.popup('google', function(err, success) {
					if (err) {

					} else {
						var token = "Token " + success.access_token;
						console.log(token);
						$.ajax({
							//url: '/api-token/login/google/',
							url: '/api-token/register-oauth/google-oauth2/',
							method: 'POST',
							data: {
								'Authorization': token
							},
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
			}); */

		},
		render: function() {
			var compiledTemplate = _.template(RegisterTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#register-container');
			this.form = this.el.find('#register-form');
			this.mailOAuthForm = this.el.find('#mailForm');
			//this.onSuccessRegistration({}, {email: 'akorovin00@gmail.com'});
		},
		onSuccessRegistration: function(data, email) {
			this.el.empty();
			var compiledTemplate = _.template(RegisterComplatedTemplate, {
				email: email
			});
			this.el.append(compiledTemplate);

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

			var errorEl = this.form.find('.input-sm').removeClass('invalid-sm').removeClass('valid-sm').hide();
		},
		clear: function() {
			this.el.remove();
		}
	})

	return registerView;
}); 
