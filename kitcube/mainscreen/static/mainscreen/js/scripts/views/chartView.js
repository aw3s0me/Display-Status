define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'collections/sensorGroupCollection'], function($, _, Backbone, ChartModel, SensorGroupCollection) {

	var _seriesArr = [];

	var ChartView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		chart: undefined,
		elements: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.elements) {
				this.elements = options.elements;
			}
			for (var i = 0; i < this.elements.length; i++) {
				//this.elements.models[i].on('change', this.addNewPoint, {options: "ololo"});
				this.elements.models[i].on('change : value', this.addNewPoint, this);
			}
			
			this.render();
		},
		render: function() {
			//load html template
			var model = this.model;
			var dataToChart = this.elements.paramToChart();
			this.container = $("<div id='" + model.get('id') + "'></div>");
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var px = model.get('coords')[0];
			var py = model.get('coords')[1];

			var scale = this.grid.getScale();
			this.grid.addUnit(dx, dy, px, py, scale, this.container, {
				border: 0,
				transparent: true
			}, this.model);

			if (!model) {
				throw "Please, init model";
				return;
			}

			var linkArr = model.get('link');

			if (linkArr) {
				for (var j = 0; j < linkArr.length; j++) {
					//console.log(this.elements);
					var sensorModel = this.elements.models[j];
					//console.log(sensorModel);
					_seriesArr.push([sensorModel.get('id'), sensorModel.get('name')]);
				}
			} 
			//console.log(dataToChart);
			this.chart = new Highcharts.Chart({
				chart: {
					reflow: false,
					type: 'line',
					renderTo: model.get('id'),
				},
				title: {
					text: model.get('caption'),
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						minute: '%H:%M'
					},
					//tickInterval: 600 * 1000
				},
				yAxis: {
					title: {
						text: 'Values'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				/*tooltip: {
					valueSuffix: '°C'
				}, */
				//legend: model.get('legend'),
				series: //cache data, store it on the server side and pass here
				dataToChart
			});
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.chart.setSize(width, height, true);
			//model.set(seriesArr') = seriesArr;
		},
		addNewPoint: function(model) {
			var chart = this.chart;
			//console.log(chart);
			var index = undefined; //index of series

			var sensorValue = model.get('value');
			for (var i = 0; i < _seriesArr.length; i++) {
				var elem = _seriesArr[i][0];
				if (elem == model.get('id')) {
					index = i;
				}
			}

			var x = model.get('lastTime');
			var y = parseFloat(sensorValue);
			var Point = {
				x: x,
				y: y
			};
			if (chart.series[index])
			chart.series[index].addPoint(Point, true, false); //last point is for everyone

		},
		rerender: function() {
			console.log('rerender chart');
			var model = this.model;
			var chart = this.chart;
			var dataToChart = this.elements.paramToChart();
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var px = model.get('coords')[0];
			var py = model.get('coords')[1];

			var scale = this.grid.getScale();

			var tile = this.container.parent();
			this.grid.resizeTile(px, py, dx, dy, tile);

			var linkArr = model.get('link');

			if (linkArr) {
				for (var j = 0; j < linkArr.length; j++) {
					//console.log(this.elements);
					var sensorModel = this.elements.models[j];
					//console.log(sensorModel);
					_seriesArr.push([sensorModel.get('id'), sensorModel.get('name')]);
				}
			} 

			chart.setTitle({ text: model.get('caption')});

			while(chart.series.length > 0)
				chart.series[0].remove(true);

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.chart.setSize(width, height, true);
			
			chart.redraw();

		}
	});

	return ChartView;
});