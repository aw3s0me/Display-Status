define(['jquery', 'underscore', 'backbone', 'collections/alarmCollection'], function($, _, Backbone) {
	var AlarmList = Backbone.Model.extend({
		defaults: {
			id: undefined,
			type: undefined,
			size: [],
			coords: [],
			cols: undefined,
			collection: undefined
		},
		initialize: function(options) {
			//options || (options = {});
			if (options.id) {
				this.id = options.id;
			}
			if (options.type) {
				this.type = options.type;
			}
			if (options.size) {
				this.size = options.size;
			}
			if (options.coords) {
				this.coords = options.coords;
			}
			if (options.cols) {
				this.cols = options.cols;
			}
			if (options.collection) {
				this.collection = options.collection
			}
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

			var collModels = this.collection.models;

			for (var i = 0; i < collModels.length; i++) {
				var model = collModels[i];
				jsonAttr[model.get('id')] = model.serToJSON();
			}

			return jsonAttr;
		}
	});

	return AlarmList;

});
