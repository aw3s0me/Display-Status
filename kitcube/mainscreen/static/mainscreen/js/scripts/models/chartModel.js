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
				case "2-min":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%H:%M'
						}
						break;
					}
				case "2-hours":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%H:%M'
						}
						break;
					}
				case "1-day":
					{
						xAxis.dateTimeLabelFormats = {
							hour: '%a %H:%M'
						}
						break;
					}
				case "10-days":
					{
						xAxis.dateTimeLabelFormats = {
							day: '%a'
						}
						break;
					}
				case "4-months":
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
				case "2-min":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "2-hours":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 2, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

						break;
					}
				case "1-day":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				case "10-days":
					{
						min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 10, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

						break;
					}
				case "4-months":
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
		}
	});

	return Chart;

});