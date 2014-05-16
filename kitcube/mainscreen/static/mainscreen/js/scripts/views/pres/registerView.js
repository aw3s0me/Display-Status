define(['jquery', 'underscore', 'backbone', 'text!templates/pres/register.html', 'models/userModel'], function($, _, Backbone, RegisterTemplate, UserModel) {

	var registerView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		form: undefined,
		initialize: function() {
			var self = this;
			this.render();

			$('#registerForm').on('submit', function(event) {
				event.preventDefault();
				//var dataToSend = self.form.serialize();
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
					url: '/api-token/register/',
					type: 'POST',
					data: dataToSend,
					success: function(data){
						console.log(data);
						if (data === "Please activate user via mail") {
							self.onSuccessRegistration(data);
						}
						else {
							self.onError(data);
						}
						
					}
				})
			});

		},
		render: function() {
			var compiledTemplate = _.template(RegisterTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#registerWrapper');
			this.form = this.el.find('#registerForm');
		},
		onSuccessRegistration: function(data) {
			var div = $('#registerValidationDiv');
			//this.form.hide();
			div.empty();
			div.text('Activation link sent to your mail!');
			div.removeClass('registerValidation');
			div.addClass('activationCompletedDiv');
			this.makeAllValid();
		},
		makeAllValid: function() {
			this.form.find('.username').addClass('valid_input');
			this.form.find('.email').addClass('valid_input');
			this.form.find('.password').addClass('valid_input');
			this.form.find('.confPassword').addClass('valid_input');
			this.form.find('.username').addClass('invalid_input');
			this.form.find('.email').addClass('invalid_input');
			this.form.find('.password').addClass('invalid_input');
			this.form.find('.confPassword').addClass('invalid_input');
		},
		onError: function(errorInfo) {
			var div = $('#registerValidationDiv');
			div.show();
			div.empty();
			for (var errorName in errorInfo) {
				var error = errorInfo[errorName];
				var errorLi = $('<li></li>');
				errorLi.text(error);
				div.append(errorLi);
			}
			div.addClass('registerValidation');
			div.removeClass('activationCompletedDiv');
			if (errorInfo.username !== undefined) {
				this.form.find('.username').addClass('invalid_input');
				this.form.find('.username').removeClass('valid_input');
			}
			else {
				this.form.find('.username').addClass('valid_input');
				this.form.find('.username').removeClass('invalid_input');
			}

			if (errorInfo.email !== undefined) {
				this.form.find('.email').addClass('invalid_input');
			}
			else {
				this.form.find('.email').addClass('valid_input');
			}

			if (errorInfo.password !== undefined || errorInfo.match !== undefined) {
				this.form.find('.password').addClass('invalid_input');
				this.form.find('.confPassword').addClass('invalid_input');
			}
			else {
				this.form.find('.password').addClass('valid_input');
				this.form.find('.confPassword').addClass('valid_input');
			}
		}

/*
if not Group.objects.filter(name=groupname).exists(): 
        raise 'Group hasnt been specified correctly'
    if len(data['password']) < 5:
        errors['password'] = 'Password length should be more than 5'
    if len(data['username']) < 5:
        errors['username'] = 'Username length should be more than 5'
    if data['password'] != data['confPassword']:
        errors['match'] = 'Passwords don\'t match'
    if User.objects.filter(username=data['username']).exists(): 
        errors['username'] = 'User is already exists'
    if not EMAIL_REGEX.match(data['email']):
        errors['email'] = 'Email should be similar to pattern <foo@example.com>'
    if User.objects.filter(email=data['email']).exists():
        errors['email'] = 'Email exists'

*/

	})

	return registerView;
}); 
