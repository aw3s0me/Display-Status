define(['jquery', 'underscore', 'backbone', 'text!templates/pres/settings.html', 'models/settingsModel'], function($, _, Backbone, SettingsTemplate, SettingsModel) {

	var settingsView = Backbone.View.extend({
		container: $('#guiEditor'),
		el: undefined,
		model: undefined,
		metaName: "settingsView",
		initialize: function() {
			this.render();
		},
		render: function() {
			//$(function() {
				//$("input, select").not("[type=submit]").jqBootstrapValidation();
			//});
			var curCfg = JSON.parse(window.activeSessionUser.get('cur_data_cfg'));
			var dataSources = curCfg['datasource'];
			var screenCfg = curCfg['screen'];
			var allProp = $.extend({}, dataSources, screenCfg);
			
			this.model = new SettingsModel();
			if (!this.model.validate(allProp)) {
				this.model.setAttrs(allProp);
			}
			else {
				alert('Wrong fields');
			}
			
			var compiledTemplate = _.template(SettingsTemplate, this.model.attributes);
			this.container.append(compiledTemplate);
			//$('#picker').minicolors();
			$('input[title=bgcolor]').minicolors({
				position: 'bottom left',
				theme: 'bootstrap'
			});
			this.el = $("#settingsContainer");
			this.el.hide();
			$('#settingsForm').on('submit', function(event) {
				event.preventDefault();
				console.log('submit sett form');
			});

		},
		getHtmlValues: function() {
			var values = {};
			$('.settval').each(function(index, val) {
				values[$(this).attr('title')] = $(this).val();
			});

			return values;
		},
		showErrors: function(errors) {
			var result = "";
			var self = this;
			_.each(errors, function(error) {
				var inpGroup = self.el.find('input[title=' + error.name + ']').parent('.input-group');
				inpGroup.addClass('has-error');
				self.el.find('span[help=' + error.name + ']').text(error.message);
				result += error.message + '\n';
			});
		},
		hideErrors: function() {
			this.el.find('.has-error').each(function() {
				$(this).removeClass('has-error');
			});
			this.el.find('.input-group-error').each(function() {
				$(this).text('');
			});
		},
		saveCfg: function() {
			$('#settingsForm').submit(); //to validate inputs
			var values = this.getHtmlValues();

			if (values['resolutionwidth'] && values['resolutionheight']) {
				values['resolution'] = [values['resolutionwidth'], values['resolutionheight']];
				delete values['resolutionwidth'];
				delete values['resolutionheight'];
			}
			
			if (values['boardsizewidth'] && values['boardsizeheight']) {
				values['boardsize'] = [values['boardsizewidth'], values['boardsizeheight']];
				delete values['boardsizewidth'];
				delete values['boardsizeheight'];
			}			

			var errors = this.model.validate(values);
			if (errors) {
				this.showErrors(errors);
				//this.hideErrors();
				return false;
			}
			this.model.setAttrs(values);
			return this.model.formValues();
		},
		destroyView: function() {

			this.remove();
			this.el.remove();
  			this.unbind();
		}
	})

	return settingsView;
}); 
