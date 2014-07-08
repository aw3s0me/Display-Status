define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Chart = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				caption: "",
				type: "chart",
				link: [],
				models: [],
				legend: undefined,
				linewidth: 1,
				size: [],
				coords: [],
				range: "15m",
				scale: 1,
				border: 1,
				radius: 0,
				cfgObj: null,
				axislabels: true,
				canberemoved: false,
				isresizable: false,
				isdraggable: false,
				resolution: 0.4,
				maxelementsize: 6
			}
		},
		initialize: function() {
			this.on('change: module', function() {
				//do smth
			});

		},
		getXAxisObj: function() {
			var xAxis = {};
			xAxis.type = 'datetime';


			switch (this.get('range')) {
				case "2m":
				case "15m":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%H:%M'
						}
						break;
					}
				case "1h":
				case "2h":
				case "3h":
				case "8h":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%H:%M'
						}
						break;
					}
				case "24h":
				case "1d":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%a %H:%M'
						}
						break;
					}
				case "30d":
				case "14d":
				case "7d":
				case "3d":
				case "10d":
					{
						xAxis.dateTimeLabelFormats = {
							day: '%a'
						}
						break;
					}
				case "3months":
				case "4months":
					{
						xAxis.dateTimeLabelFormats = {
							month: '%b'
						}
						break;
					}
				default:
					{
						xAxis.dateTimeLabelFormats = {
							millisecond: '%H:%M:%S.%L',
							second: '%H:%M:%S',
							minute: '%H:%M',
							hour: '%H:%M',
							day: '%e. %b',
							week: '%e. %b',
							month: '%b \'%y',
							year: '%Y'
						}
						break;
					}
			}

			return xAxis;
		},
		getNumberOfPoints: function() {
			var number = undefined;
			switch (this.get('range')) {
				case "2m":
					{
						number = 200;
						break;
					}
				case "15m":
					{
						number = 200;
						break;
					}
				case "1h":
					{
						number = 300;
						break;
					}
				case "2h":
					{
						number = 500;
						break;
					}
				case "3h":
					{
						number = 500;
						break;
					}
				case "8h":
					{
						number = 500;
						break;
					}
				case "24h":
				case "1d":
					{
						number = 500;
						break;
					}
				case "3d":
					{
						number = 560;
						break;
					}
				case "7d":
					{
						number = 560;
						break;
					}
				case "10d":
					{
						number = 570;
						break;
					}
				case "14d":
					{
						number = 670;
						break;
					}
				case "30d":
					{
						number = 700;
						break;
					}
				case "90d":
					{
						number = 800;
						break;
					}
				case "3months":
					{
						number = 900;
						break;
					}
				case "4months":
					{
						number = 1000;
						break;
					}
				default:
					{
						number = 500;
						break;
					}
			}
			return number;
		},
		getRangeToDate: function() {
			var now = new Date;
			var min = undefined;
			switch (this.get('range')) {
				case "2m":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "15m":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 15, now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "1h":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 1, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "2h":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 2, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "3h":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 3, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "8h":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 8, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "24h":
				case "1d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "3d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 3, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "7d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "10d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 10, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "14d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "30d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "90d":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 90, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "3months":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 3, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "4months":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				default:
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 15, now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
			}
			return min;
		},
		getChartOptions: function() {
			var chart = {
				reflow: false,
				type: 'line',
				//type: 'line',
				renderTo: this.get('id')
			}

			if (this.get('caption') === "") {
				chart.marginTop = 30 * this.get('scale');
			}

			chart.borderRadius = this.get('radius');
			chart.borderWidth = this.get('border');

			return chart;
		},
		getSrcTreeLink: function() {
			var models = this.get('models');
			var srctree = '';
			var srcarr = [];
			for (var i = 0; i < models.length; i++) {
				var model = models[i];
				var mask = model.get('mask');
				var server = model.get('server');
				var database = model.get('dbname');
				var group = model.get('dbgroup');
				srcarr.push(server + '__' + database + '__' + group + '__' + mask);
			}
			srctree = srcarr.join();

			return srctree;

		},
		serialize: function() {
			var cfg = {};
			var attrs = _.clone(this.attributes);
			var defaults = this.defaults();
			delete attrs['cfgObj'];
			delete attrs['radius'];
			delete attrs['models'];
			delete attrs['id'];
			delete attrs['scale'];

			for (var attrName in attrs) {
				var attr = attrs[attrName];
				var defParam = defaults[attrName];
				if (defParam !== attr && defParam !== +attr) {
					cfg[attrName] = attrs[attrName];
				}
			}

			cfg['startrange'] = attrs['range'];
			cfg['type'] = 'chart';
			delete attrs['range'];
			console.log(cfg);
			return cfg;
		},
		removeModel: function(modelId) {
			var link = this.get('link');
			var models = this.get('models');

			var linkIndex = link.indexOf(modelId);
			if (linkIndex !== -1)
				link.splice(linkIndex, 1);

			for (var i = 0; i < models.length; i++) {
				if (modelId === models[i].get('id')) {
					models.splice(i, 1);
					break;
				}
			}

			this.set({link: link, models: models});

			return;
		},
		isLinked: function(modelId) {
			var link = this.get('link');
			return link.indexOf(modelId) != -1;
		},
		isOnTheChartById: function(id) {
			var models = this.get('models');

			for (var j = 0; j < models.length; j++) {
				var model = models[j];
				if (model.get('id') === id) {
					return true;
				}	
			}
			return false;
		},
		validate: function(attrs) {
			var errors = [];

			if (!attrs) {
				return false;
			}

			if (attrs.resolution && !$.isNumeric(attrs.resolution)) { //number 
				errors.push({name: 'resolution', message: 'Resolution param should be number.'});
			}

			if (attrs.border && !$.isNumeric(attrs.border)) {
				errors.push({name: 'border', message: 'Border param should be number.'});
			}

			if (!attrs.maxelementsize || !$.isNumeric(attrs.maxelementsize)) {
				errors.push({name: 'maxelementsize', message: 'Max element capacity param should be number.'});
			}

			if (!attrs.sizex || !$.isNumeric(attrs.sizex)) {
				errors.push({name: 'sizex', message: 'Size on x coord param error.'});
			}

			if (!attrs.sizey || !$.isNumeric(attrs.sizey)) {
				errors.push({name: 'sizey', message: 'Size on y coord param error.'});
			}

			if (!attrs.coordx || !$.isNumeric(attrs.coordx)) {
				errors.push({name: 'coordx', message: 'Coordinate on x param error.'});
			}

			if (!attrs.coordy || !$.isNumeric(attrs.coordy)) {
				errors.push({name: 'coordy', message: 'Coordinate on y param error.'});
			}

			return errors.length > 0 ? errors : false;
		},
		addAttrs: function(attrs) {
			attrs['size'] = [attrs['sizex'], attrs['sizey']];
			attrs['coords'] = [attrs['coordx'], attrs['coordy']];
			attrs['caption'] = attrs['name'];
			delete attrs['coordx'];
			delete attrs['coordy'];
			delete attrs['sizex'];
			delete attrs['sizey'];
			delete attrs['name'];

			this.set(attrs);
		}
	});

	return Chart;

});