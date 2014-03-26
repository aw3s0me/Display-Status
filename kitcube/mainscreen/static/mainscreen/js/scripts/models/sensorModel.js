define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Sensor = Backbone.Model.extend({
		defaults: {
			id: undefined,
			name: undefined,
			comment: undefined,
			unit: undefined,
			value: undefined,
			max: undefined,
			min: undefined,
			alarm: undefined,
			server: undefined,
			device: undefined,
			dbname: undefined,
			dbgroup: undefined,
			mask: undefined
		},
		initialize: function() {
			//console.log("model created");
			this.on('change: module', function() {
				//do smth
			});
		},
		getProperties: function() {
			return {

			}
		},
		getDbUrl: function() {
			return 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + this.get('server') +'&db_name=' + this.get('dbname') + '&db_group='+ this.get('dbgroup') +'&db_mask='+ this.get('mask') +'&window=-1';
		}
	});

	return Sensor;

});