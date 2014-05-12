define(['jquery', 'underscore', 'backbone', 'text!templates/pres/register.html', 'models/userModel'], function($, _, Backbone, RegisterTemplate, UserModel) {

	var registerView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		form: undefined,
		initialize: function() {
			var self = this;
			this.render();

			$('#registerForm').on('submit', function(event) {
				$.ajax({
					url: '/api-token/register/',
					type: 'POST',
					dataType: 'text',
					data: {param1: 'value1'},
				})
				.done(function() {
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
				
			});

		},

		render: function() {
			var compiledTemplate = _.template(RegisterTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#registerFormDiv');
			this.form = this.el.find('#registerForm');
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

	return registerView;
}); 
