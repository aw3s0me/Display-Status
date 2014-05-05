define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var Chart = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				caption: "",
				type: "chart",
				charttype: undefined,
				link: [],
				models: [],
				seriesArr: [],
				legend: undefined,
				linewidth: undefined,
				size: [],
				coords: [],
				puredata: {},
				range: "2-min",
				rangeToDate: undefined,
				scale: 1,
				border: 1,
				radius: 0,
				cfgObj: null,
				axislabels: true
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
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds());
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
		serToJSON: function() {
			var cfg = this.get('cfgObj');
			delete cfg['_id'];
			cfg['size'] = this.get('size');
			cfg['coords'] = this.get('coords');

			if (cfg['range'] !== this.get('range') && cfg['range'] !== undefined) {
				cfg['range'] = this.get('range');
			}

			if (this.get('link') !== []) {
				cfg['link'] = this.get('link');
			}

			return cfg;
		},
		removeModel: function(modelId){
			var link = this.get('link');
			var models = this.get('models');

			for (var i = 0; i < link.length; i++) {
				if (modelId === link[i]) {
					link.splice(i, 1);
					break;
				} 
			}

			for (var i = 0; i < models.length; i++) {
				if (modelId === models[i].get('id')) {
					models.splice(i, 1);
					break;
				}
			}

			return;
		},
		isLinked: function(modelId) {
			var link = this.get('link');
			for (var i = 0; i < link.length; i++) {
				if (link[i] === modelId) {
					return true;
				}
			}

			return false;
		}
	});

	return Chart;

});