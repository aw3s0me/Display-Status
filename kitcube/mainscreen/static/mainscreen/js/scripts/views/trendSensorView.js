define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var TrendSensorView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		isTrend: true,
		chart: undefined,
		limit: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			else {
				throw "SensorView needs model";
			}
			if (options.group === true) {
				this.isGrouped = true;
				this.renderGrouped();
			}
			else {
				this.renderSingle();
			}
			
			this.model.on('resize', this.onresize, this);
			this.model.on('change:bgcolor', this.onchangebgcolor, this);
			this.model.get('model').on('addPoint', this.onaddpoint, this);

			this.on('chartInit', this.chartInit);
		},
		renderSingle: function() {
			/*//load html template
			var newSensor = this.model;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));
			
			this.grid.addUnit(dx, dy, px, py, scale, this.container, {}, this.model); */
			
		},
		renderGrouped: function() {
			console.log("RENDER");
			var newSensor = this.model;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];

			this.container = $('<div></div>');
			this.container.attr('id', newSensor.get('id'));

			this.container.css('background-color', 'white'); 

		},
		chartInit: function() {
			console.log("CHART INIT");
			var newSensor = this.model;
			var now = new Date;
			//console.log(this.model);
			var scale = this.grid.getScale();
			var dx = newSensor.get("size")[0];
			var dy = newSensor.get("size")[1];
			var px = newSensor.get("coords")[0];
			var py = newSensor.get("coords")[1];

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;
			console.log(newSensor.get('id'));
			newSensor.get('model').getAdeiDataRange(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds()))
			var dataToChart = [newSensor.get('model').getChartProperties()];
			console.log(dataToChart);
			
			var xAxis = {};
			xAxis.type = 'datetime';
			switch(newSensor.get('range')) {
				case "2-hours": {
					xAxis.dateTimeLabelFormats = {
						hour: '%H:%M'
					}
					//xAxis.minRange = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 2, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					break;
				}
				case "1-day": {
					xAxis.dateTimeLabelFormats = {
						hour: '%a %H:%M'
					}
					//xAxis.minRange = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					break;
				}
				case "10-days": {
					xAxis.dateTimeLabelFormats = {
						day: '%a'
					}
					//xAxis.minRange = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 10, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					break;
				}
				case "4-months": {
					xAxis.dateTimeLabelFormats = {
						month: '%b'
					}
					//xAxis.minRange = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					break;
				}
				default: {
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
					//xAxis.minRange = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds())
					xAxis.minRange = 1;
					break;
				}
			}

			//xAxis.minRange = 1;
			//xAxis.tickInterval = 2;
			/*this.chart = new Highcharts.StockChart({
				chart: {
					reflow: false,
					type: 'line',
					renderTo: newSensor.get('id')
				},
				title: {
					text: newSensor.get('name')
				},
				scrollbar: {
					enabled: false
				},
				xAxis: xAxis,
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
				series: dataToChart,
				plotOptions: {
					series: {
						lineWidth: 1,
	                    turboThreshold: 0,
						threshold: null
					}
				}
			}); */

			this.chart = new Highcharts.Chart({
				chart: {
					reflow: false,
					type: 'line',
					renderTo: newSensor.get('id')
				},
				title: {
					text: newSensor.get('name')
				},
				xAxis: xAxis,
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
				series: dataToChart,
				plotOptions: {
					series: {
						lineWidth: 1,
	                    turboThreshold: 0,
						threshold: null
					}
				}
			});

			(function(b,a){if(!b){return}var c=b.Chart.prototype,d=b.Legend.prototype;b.extend(c,{legendSetVisibility:function(h){var i=this,k=i.legend,e,g,j,m=i.options.legend,f,l;if(m.enabled==h){return}m.enabled=h;if(!h){d.destroy.call(k);e=k.allItems;if(e){for(g=0,j=e.length;g<j;++g){e[g].legendItem=a}}k.group={}}c.render.call(i);if(!m.floating){f=i.scroller;if(f&&f.render){l=i.xAxis[0].getExtremes();f.render(l.min,l.max)}}},legendHide:function(){this.legendSetVisibility(false)},legendShow:function(){this.legendSetVisibility(true)},legendToggle:function(){this.legendSetVisibility(this.options.legend.enabled^true)}})}(Highcharts));


			this.chart.legendHide(); 
			this.chart.setSize();
			console.log(this.chart);
			now = new Date;
			var max = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
			var min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 3, now.getUTCSeconds(), now.getUTCMilliseconds());

			this.chart.xAxis[0].setExtremes(min, max);
			this.chart.redraw();
		},
		getHtml: function() {
			return this.container[0];
		},
		getContainer: function() {
			return this.container;
		},
		rerender: function() {
			var sensorDiv = this.container;
			var scale = this.grid.getScale();
			var sensorModel = this.model;

			var tile = sensorDiv.parent();

			this.grid.resizeTile(sensorModel.get('coords')[0], sensorModel.get('coords')[1], sensorModel.get('size')[0], sensorModel.get('size')[1], tile);

		},
		removeFromDom: function() {
			//this.container.remove();
			this.grid.removeUnit(this.container.parent());
		},
		onresize: function(model) {

		},
		onchangebgcolor: function(model) {
			var sensorDiv = this.container;
			var sensorModel = model;

			sensorDiv.css('background-color', this.model.get('bgcolor'));
		},
		onaddpoint: function(model) {
			//console.log('ADDPOINT');
			var now = new Date;
			var sensorDiv = this.container;

			var chart = this.chart;
			var index = undefined;
			var shift = false;

			var sensorValue = model.get('value');

			var x = model.get('lastTime');
			var y = parseFloat(sensorValue);

			if (y === undefined || y === "NAN" || x === undefined || y === "NAN") {
				return;
			}

			var Point = [x, y];

			var limit;

			/*if (chart.series[0]) {
				var range = this.model.get('range');
				switch(range) {
					case "2-hours": {
						limit = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() - 2, now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
						break;
					}
					case "1-day": {
						lblFormat = {
							hour: '%a %H:%M'
						}
						limit = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())

						break;
					}
					case "10-days": {
						lblFormat = {
							day: '%a'
						}
						limit = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 10, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
						break;
					}
					case "4-months": {
						lblFormat = {
							month: '%b'
						}
						limit = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())
						break;
					}
					default: {
						lblFormat = {
							millisecond: '%H:%M:%S.%L',
							second: '%H:%M:%S',
							minute: '%H:%M',
							hour: '%H:%M',
							day: '%e. %b',
							week: '%e. %b',
							month: '%b \'%y',
							year: '%Y'
						}
						limit = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 4, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 2, now.getUTCSeconds(), now.getUTCMilliseconds());
						break;
					}
				}
			} */

			if (chart.series[0]) {
				//console.log('added');
				chart.series[0].addPoint(Point, true, shift); //last point is for everyone\
				console.log(chart.series[0].data);
			}

			var max = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
			var min = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes() - 3, now.getUTCSeconds(), now.getUTCMilliseconds());

			this.chart.xAxis[0].setExtremes(min, max);

			shift = false;

		}
	});

	return TrendSensorView;
});