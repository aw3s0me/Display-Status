/**
 * Created by aw3s0_000 on 21.02.2015.
 */
define(['jquery', 'underscore', 'backbone', 'views/widgets/baseWidgetView', 'models/baseWidgetModel', "heatmap"/*"d3heat" */], function($, _, Backbone, BaseWidgetView, BaseWidgetModel, HeatChart) {
	var HeatmapModel = BaseWidgetModel.extend({
		initialize: function (attr) {
			this.set({
				id: attr._id,
				size: attr["size"],
				coords: attr["coords"],
				cfgObj: attr
			});
		}
	});


	var HeatmapView = BaseWidgetView.extend({
		heatmap: null,
		chart: null,
		updSensorsInterval: null,
		initialize: function(attr) {
			var self = this;
			this.widgetController = attr.wc;
			this.grid = this.widgetController.getGrid(attr);

			this.model = new HeatmapModel(attr);
			//if (options.model) {
			//	this.model = options.model;
			//} else {
			//	throw "View needs model";
			//}

			this.render();

			this.updSensorsInterval = setInterval(function() {
                self.update();
            }, 3000);

			//this.model.on('resize', this.onresize, this);
			//this.model.on('change:value', this.onchangevalue, this);
		},
		update: function () {

		},
		render: function() {
			var model = this.model;
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.container = $('<div id= ' + this.model.get('id') + '  ></div>');

			this.grid.addUnit(this.container, {
				border: 0,
				transparent: true,
				draggable: this.model.get('isdraggable'),
				resizable: this.model.get('isresizable')
			}, this.model);
			this.chart = new Highcharts.Chart({
				chart: {
					type: 'heatmap',
					marginTop: 40,
					color: "#fff",
					marginBottom: 15,
					marginLeft: 15,
					renderTo: this.model.get('id')
				},
				title: {
					text: 'Main spectrometer heatmap'
				},
				xAxis: {
					categories: ['', '', '', '', '', '', '', '', '', '']
				},
				yAxis: {
					categories: [' ', ' ', ' ', ' ', ''],
					title: null
				},
				colorAxis: {
					min: 0,
					max: 1000,
					//minColor: '#FFFFFF',
					//minColor: '#2704F5',
					maxColor: '#F50F00',
					minColor: '#3866CE'
					//maxColor: '#C4463A'
					//maxColor: '#ff0000',
					//minColor: '#0000ff'
					//maxColor: Highcharts.getOptions().colors[0]
				},
				legend: {
					align: 'right',
					layout: 'vertical',
					margin: 0,
					verticalAlign: 'top',
					y: 25,
					symbolHeight: 280
				},
				tooltip: {
					formatter: function () {
						return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> degrees <br><b>' +
							this.point.value + '</b> celsiums<br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
					}
				},
				series: [{
					name: 'Sales per employee',
					borderWidth: 1,
					data: [
						[0, 0, 540], [0, 1, 554], [0, 2, 604], [0, 3, 538], [0, 4, 552],
						[1, 0, 551], [1, 1, 580], [1, 2, 610], [1, 3, 585], [1, 4, 548],
						[2, 0, 600], [2, 1, 600], [2, 2, 715], [2, 3, 601], [2, 4, 599],
						[3, 0, 593], [3, 1, 710], [3, 2, 723], [3, 3, 708], [3, 4, 590],
						[4, 0, 625], [4, 1, 723], [4, 2, 744], [4, 3, 715], [4, 4, 619],
						[5, 0, 735], [5, 1, 732], [5, 2, 726], [5, 3, 730], [5, 4, 700],
						[6, 0, 602], [6, 1, 718], [6, 2, 715], [6, 3, 715], [6, 4, 608],
						[7, 0, 604], [7, 1, 608], [7, 2, 712], [7, 3, 606], [7, 4, 601],
						[8, 0, 582], [8, 1, 592], [8, 2, 582], [8, 3, 592], [8, 4, 587],
						[9, 0, 535], [9, 1, 587], [9, 2, 564], [9, 3, 584], [9, 4, 545]],
					dataLabels: {
						enabled: true,
						color: '#000000'
					}
				}]
			});

			this.chart.setSize(width, height, false);
		},
		getHtml: function() {
			return this.container[0];
		},
		getContainer: function() {
			return this.container;
		},
		removeFromDom: function() {
			this.trigger('removing', this.model);
			this.container.remove();
			this.model.trigger('removing', this.model);
			this.remove();
			this.unbind();
		}
	});

	return HeatmapView;
});