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
console.log(this.form);

		},
		/*events: {
			'submit #loginForm': 'onLogin'
		},*/
		render: function() {
			var compiledTemplate = _.template(LoginTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#loginFormDiv');
			this.form = this.el.find('#loginForm');
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