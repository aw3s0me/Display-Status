define(['jquery', 'underscore', 'backbone', 'collections/sensorCollection'], function($, _, Backbone, SensorCollection) {
	var SensorGroupModel = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				name: undefined,
				type: "sensorgroup",
				size: [],
				coords: [],
				bgcolor: undefined,
				collection: undefined,
				diffsensors: true,
				dbgroup: undefined,
				dbname: undefined,
				server: undefined,
				canberemoved: false,
				isresizable: false,
				isdraggable: false,
				issortable: false,
				cfgObj: null
			}
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: value', function() {
				//do smth
			});
		},
		serialize: function() {
			var collection = this.get('collection').models;
			var defaults = this.defaults();
			var attrs = _.clone(this.attributes);

			var cfg = {};

			cfg['size'] = attrs['size'];
			cfg['coords'] = attrs['coords'];
			cfg['sensors'] = [];
			cfg['type'] = "sensorgroup";
			
			if (defaults['isresizable'] !== attrs['isresizable'])
				cfg['isresizable'] = attrs['isresizable'];
			if (defaults['isdraggable'] !== attrs['isdraggable'])
				cfg['isdraggable'] = attrs['isdraggable'];
			if (defaults['issortable'] !== attrs['issortable'])
				cfg['issortable'] = attrs['issortable'];
			if (defaults['canberemoved'] !== attrs['canberemoved'])
				cfg['canberemoved'] = attrs['canberemoved'];

			for (var i = 0; i < collection.length; i++) {
				var sensor = collection[i];
				var jsonSensorAttr = {};
				var options = {
					'diffsensors': this.get('diffsensors'),
					'type': 'group'
				}

				jsonSensorAttr = sensor.serToJSON(options);

				cfg['sensors'].push(jsonSensorAttr);
			}


			return cfg;
		},
		validate: function(attrs) {
			var errors = [];

			if (!attrs) {
				return false;
			}

			if (!attrs.sizex || !$.isNumeric(attrs.sizex)) {
				errors.push({
					name: 'sizex',
					message: 'Size on x coord param error.'
				});
			}

			if (!attrs.sizey || !$.isNumeric(attrs.sizey)) {
				errors.push({
					name: 'sizey',
					message: 'Size on y coord param error.'
				});
			}

			if (!attrs.coordx || !$.isNumeric(attrs.coordx)) {
				errors.push({
					name: 'coordx',
					message: 'Coordinate on x param error.'
				});
			}

			if (!attrs.coordy || !$.isNumeric(attrs.coordy)) {
				errors.push({
					name: 'coordy',
					message: 'Coordinate on y param error.'
				});
			}

			return errors.length > 0 ? errors : false;
		},
		addAttrs: function(attrs) {
			attrs['size'] = [attrs['sizex'], attrs['sizey']];
			attrs['coords'] = [attrs['coordx'], attrs['coordy']];
			delete attrs['coordx'];
			delete attrs['coordy'];
			delete attrs['sizex'];
			delete attrs['sizey'];

			this.set(attrs);
		}
	});

	return SensorGroupModel;

});