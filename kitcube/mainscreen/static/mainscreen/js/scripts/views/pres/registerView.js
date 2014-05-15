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

				$.ajax({
					url: '/api-token/register/',
					type: 'POST',
					data: dataToSend,
					success: function(data){
						console.log(data);
						console.log('success registration!');
					}
				})
			});

		},

		render: function() {
			var compiledTemplate = _.template(RegisterTemplate, {});
			this.container.append(compiledTemplate);
			this.el = $('#registerFormDiv');
			this.form = this.el.find('#registerForm');
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
