define(['jquery', 'underscore', 'backbone', 'text!templates/settings.html'], function($, _, Backbone, SettingsTemplate) {

	var settingsView = Backbone.View.extend({
		container: $('#container'),
		el: undefined,
		initialize: function() {
			this.render();
		},
		render: function() {
			var compiledTemplate = _.template(SettingsTemplate, {});
			this.container.append(compiledTemplate);
			$('#picker').minicolors();
			this.el = $("#settingsContainer");
			this.el.hide();
		},
		hide: function() {
			this.el.hide();
		},	
		show: function() {
			this.el.show();
		},
		isHidden: function() {
			if(this.el.is(':hidden')) {
				return true;
			}
			else 
				return false;
		},
		isShown: function() {
			if(this.el.is(':hidden')) {
				return false;
			}
			else 
				return true;
		},
		setlabel: function(text) {

		},
		getdata: function(url) {
			var self = this;
			var testUrl = 'static/mainscreen/tempcfg/empty.json';
			$.ajax({
				url: testUrl,
				async: true,
				dataType: 'text',
				success: function(data) {
					console.log(data);
					self.settext(data);
				}
			});
		},
		getProjectsOnStart: function() {
			var self = this;
			var testUrl = '';
			$.ajax({
				url: testUrl,
				type: 'GET',
				dataType: 'text',
				data: {param1: 'value1'},
			})
			.done(function(data) {
				console.log("success");
				self.projects = data;
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		},
		saveToServ: function() {
			var self = this;
			var testUrl = '';
			//var textToSave = //need write model
			$.ajax({
				url: testUrl,
				type: 'POST',
				dataType: 'text',
				data: textToSave,
			})
			.done(function(data) {
				console.log("success: " + data);
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		}
	})

	return settingsView;
}); 
