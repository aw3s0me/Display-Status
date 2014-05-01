define(['jquery', 'underscore', 'backbone', 'collections/alarmCollection'], function($, _, Backbone) {
	var AlarmList = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				type: "alarmlist",
				size: [],
				coords: [],
				cols: undefined,
				collection: undefined,
				cfgObj: null
			}
		},
		initialize: function() {
			//options || (options = {});
		},
		serToJSON: function() {
			var listClone = this.clone();
			listClone.unset('id', {silent: true});

			var jsonAttr = {
				type: this.get('type'),
				size: this.get('size'),
				coords: this.get('coords'),
				cols: this.get('cols')
			}

			var collModels = this.get('collection').models;

			for (var i = 0; i < collModels.length; i++) {
				var model = collModels[i];
				jsonAttr[model.get('id')] = model.serToJSON();
			}

			return jsonAttr;
		}
	});

	return AlarmList;

});
