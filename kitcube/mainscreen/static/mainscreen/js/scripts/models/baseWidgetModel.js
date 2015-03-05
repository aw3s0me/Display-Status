/**
 * Created by aw3s0_000 on 21.02.2015.
 */

define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var BaseWidgetModel = Backbone.Model.extend({
		defaults: function() {
			return {
				id: "",
				type: "",
				size: [],
				coords: [],
                name: "",
                comment: "",
                canberemoved: false,
				isdraggable: false,
				isresizable: false,
				cfgObj: null
			}
		},
		initialize: function(options) {
			this.validate(options);
		},
		validate: function (options) {
			if (!options._id)
				throw "Please specify id of sensortable";
			if (!options.size)
				throw "Please specify size of sensortable";
			if (!options.coords)
				throw "Please specify coords of sensortable";
			if (!options.name)
				throw "Please specify name of sensortable";
		}
	});

	return BaseWidgetModel;
});

