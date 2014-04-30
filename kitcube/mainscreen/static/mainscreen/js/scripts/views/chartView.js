define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'collections/sensorGroupCollection'], function($, _, Backbone, ChartModel, SensorGroupCollection) {

	var _seriesArr = [];
	var _allSensors = undefined;
	var _isLegendShown = false;


	var ChartView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		chart: undefined,
		elements: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			var self = this;
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.elements) {
				this.elements = options.elements;
			}
			if (options.allSensors) {
				_allSensors = options.allSensors;
			}

				(function(b,a){if(!b){return}var c=b.Chart.prototype,d=b.Legend.prototype;b.extend(c,{legendSetVisibility:function(h){var i=this,k=i.legend,e,g,j,m=i.options.legend,f,l;if(m.enabled==h){return}m.enabled=h;if(!h){d.destroy.call(k);e=k.allItems;if(e){for(g=0,j=e.length;g<j;++g){e[g].legendItem=a}}k.group={}}c.render.call(i);if(!m.floating){f=i.scroller;if(f&&f.render){l=i.xAxis[0].getExtremes();f.render(l.min,l.max)}}},legendHide:function(){this.legendSetVisibility(false)},legendShow:function(){this.legendSetVisibility(true)},legendToggle:function(){this.legendSetVisibility(this.options.legend.enabled^true)}})}(Highcharts));

			for (var i = 0; i < this.elements.length; i++) {
				this.elements.models[i].on('addPoint', this.addNewPoint, this);
			}
			this.model.on('resize', this.onresize, this);
			this.render();

			/*this.container.parent().click(function(event){
				var elems = $('.canvas').find('.activeSensor');
				for (var elem in elems) {
					console.log(elem);
				}
			});

			this.container.click(function(event){
				var elems = $('.canvas').find('.activeSensor');
				for (var elem in elems) {
					console.log(elem);
				}
			}); */
			this.container.find('.addChartBtn').click(function(event){
				var elems = $('.canvas').find('.activeSensor');
				var dataSeries = [];
				var index = undefined;
				var series = self.chart.series;
				console.log(elems);
				for (var i = 0; i < elems.length; i++) {
					var jqElement = elems[i];
					var circle = $(jqElement).find('.chartCircle');
					//var id = jqElement.attr('id');
					var id = jqElement.getAttribute('id');
					var sensorModel = _allSensors[id];
					sensorModel.on('addPoint', self.addNewPoint, self);
					sensorModel.on('deleteSensor', self.removeSeries, self);
					if (!sensorModel) {
						throw "Cant add sensor";
					} 
					var seriesObject = sensorModel.getChartProperties();
					var axisObject = sensorModel.getChartAxisInfo();
					var color = undefined;
					self.chart.addAxis(axisObject);
					self.chart.addSeries(seriesObject, false);

					for (var seriesName in series) {
						var seriesObject = series[seriesName];
						var id = seriesObject.userOptions.id;
						if (id === sensorModel.get('id')) {
							index = seriesObject._i;
							color = seriesObject.color;
							circle.css('background-color', color);

							$(jqElement).removeClass('activeSensor');
							$(jqElement).addClass('chartAdded');
							var axisId = seriesObject.yAxis.userOptions.id;
							for (var j = 0; j < self.chart.yAxis.length; j++) {
								var yaxis = self.chart.yAxis[j];
								if (yaxis.userOptions.id === axisId) {
									//yaxis.options.lineColor = color;
									yaxis.update({
										lineColor: color
									});


									break;
									//break;
								}
							} 
							break;
						}
					}


					
				}
				self.chart.redraw();

			});

			this.container.find('.legendChartBtn').click(function(event){
				if(!_isLegendShown) {
					self.chart.legendShow();
					_isLegendShown = true;
				}
				else {
					self.chart.legendHide();
					_isLegendShown = false;
				}
				
			});
			//this.container.parent().find().remove();
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
					_seriesArr.push([sensorModel.get('id'), sensorModel.get('name'), j]);
				}
			} 

			var xAxis = model.getXAxisObj();
			var chart = model.getChartOptions();

			this.chart = new Highcharts.Chart({
			//this.chart = new Highcharts.StockChart({
				chart: chart,
				title: {
					text: model.get('caption'),
				},
				xAxis: xAxis,
				/*yAxis: {
					title: {
						text: 'Values'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},*/
				series: dataToChart,
				tooltip: {
					shared: true,
					crosshairs: true
				},
				legend: {
					align: 'right',
					verticalAlign: 'top',
					y: 35 * scale,
					floating: true,
					borderWidth: 0
				},
				subtitle: {
					text: '',
					style: {
						display: 'none'
					}
				},
				credits: {
					enabled: false
				},
				yAxis: {
					title: {
						text: ''
					}
				},
				plotOptions: {
					series: {
						cursor: 'pointer',
						lineWidth: 2,
	                    turboThreshold: 0,
						threshold: null,
						marker: {
							enabled: false
						}/*,
						cursor: 'pointer',
	                    point: {
	                        events: {
	                            click: function() {
	                                hs.htmlExpand(null, {
	                                    pageOrigin: {
	                                        x: this.pageX,
	                                        y: this.pageY
	                                    },
	                                    headingText: this.series.name,
	                                    maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) +':<br/> '+
	                                        this.y,
	                                    width: 200
	                                });
	                            }
	                        }
	                    }, */
						//showInLegend : false
					}
				}
			});
			(function(b,a){if(!b){return}var c=b.Chart.prototype,d=b.Legend.prototype;b.extend(c,{legendSetVisibility:function(h){var i=this,k=i.legend,e,g,j,m=i.options.legend,f,l;if(m.enabled==h){return}m.enabled=h;if(!h){d.destroy.call(k);e=k.allItems;if(e){for(g=0,j=e.length;g<j;++g){e[g].legendItem=a}}k.group={}}c.render.call(i);if(!m.floating){f=i.scroller;if(f&&f.render){l=i.xAxis[0].getExtremes();f.render(l.min,l.max)}}},legendHide:function(){this.legendSetVisibility(false)},legendShow:function(){this.legendSetVisibility(true)},legendToggle:function(){this.legendSetVisibility(this.options.legend.enabled^true)}})}(Highcharts));

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			for (var i = 0; i < _seriesArr.length; i++) {
				var sensorModel = this.elements.models[i];
				var color = this.chart.series[i].color;
				sensorModel.set({ bgcolor: color });
				sensorModel.trigger('changebgcolor', sensorModel);
				console.log(color);
			}

			this.chart.legendHide();

			var s5 = $('<button>Add</button>');
			s5.css('top', 5 * scale + 'px');
			s5.css('left', 5 * scale + 'px');
			s5.css('font-size', 10 * scale + 'px');
			s5.button();
			s5.addClass('addChartBtn');

			this.container.append(s5);

			var s6 = $('<button>Legend</button>');
			s6.css('top', 5 * scale + 'px');
			s6.css('right', 17 * scale + 'px');
			s6.css('font-size', 10 * scale + 'px');
			s6.css('z-index', '2 !important');
			s6.button();
			s6.addClass('legendChartBtn');

			this.container.find('.highcharts-container').append(s6);

			var closeDiv = document.createElement('div');
			closeDiv.style.position = 'absolute';
			closeDiv.style.fontSize = 12 * scale + 'px';
			closeDiv.style.right = 5 * scale + 'px';
			closeDiv.style.top = 4 * scale + 'px';
			closeDiv.innerHTML = "<b>x</b>";
			closeDiv.className = "close";

			this.container.find('.highcharts-container').append(closeDiv);
			var self = this;

			$(closeDiv).click(function(event) {
				self.removeFromDom();
			});

			this.chart.setSize(width, height, true);

			this.setExtremes();


		},
		setExtremes: function() {
			var now = new Date;
			var min = this.model.getRangeToDate();
			var max = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

			this.chart.xAxis[0].setExtremes(min, max);
		},
		addNewPoint: function(model) {

			var chart = this.chart;
			var series = this.chart.series;
			//console.log(chart);
			var index = undefined; //index of series
			var shift = false;
			//console.log(model.get('id'));
			var sensorValue = model.get('value');

			/*if (model.get('values').length > 10) {
				shift = true;
			} */
			//console.log(model.get('values'));

			for (var seriesName in series) {
				var seriesObject = series[seriesName];
				var id = seriesObject.userOptions.id;
				if (id === model.get('id')) {
					index = seriesObject._i;
					break;
				}
			}

			var x = model.get('lastTime');
			var y = parseFloat(sensorValue);

			if (y === undefined || x === undefined) {
				return;
			}

			var Point = {
				x: x,
				y: y
			};

			if (chart.series[index])
				chart.series[index].addPoint(Point, false, shift); //last point is for everyone\

			shift = false;

			this.setExtremes();

		},
		removeSeries: function(model) {
			var chart = this.chart;
			var id = model.get('id');
			var series = chart.series;
			var index = undefined;
			for (var seriesName in series) {
				var seriesObject = series[seriesName];
				var id = seriesObject.userOptions.id;
				if (id === model.get('id')) {
					//seriesObject.isRemoving = true;
					var axisId = seriesObject.yAxis.userOptions.id;
					for (var i = 0; i < chart.yAxis.length; i++) {
						var yaxis = chart.yAxis[i];
						if (yaxis.userOptions.id === axisId) {
							yaxis.remove();
						}
					}
					seriesObject.remove();
					//index = seriesObject._i;
					break;
				}
			}
			chart.redraw();
		},
		rerender: function() {
			for (var i = 0; i < this.elements.length; i++) {
				this.elements.models[i].off('addPoint');
			}

			//console.log('rerender chart');
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
			_seriesArr = [];
			if (linkArr) {
				for (var j = 0; j < linkArr.length; j++) {
					//console.log(this.elements);
					var sensorModel = this.elements.models[j];
					//console.log(sensorModel);
					_seriesArr.push([sensorModel.get('id'), sensorModel.get('name'), j]);
				}
			} 
			(function(b,a){if(!b){return}var c=b.Chart.prototype,d=b.Legend.prototype;b.extend(c,{legendSetVisibility:function(h){var i=this,k=i.legend,e,g,j,m=i.options.legend,f,l;if(m.enabled==h){return}m.enabled=h;if(!h){d.destroy.call(k);e=k.allItems;if(e){for(g=0,j=e.length;g<j;++g){e[g].legendItem=a}}k.group={}}c.render.call(i);if(!m.floating){f=i.scroller;if(f&&f.render){l=i.xAxis[0].getExtremes();f.render(l.min,l.max)}}},legendHide:function(){this.legendSetVisibility(false)},legendShow:function(){this.legendSetVisibility(true)},legendToggle:function(){this.legendSetVisibility(this.options.legend.enabled^true)}})}(Highcharts));

			chart.setTitle({ text: model.get('caption')});

			while(chart.series.length > 0)
				chart.series[0].remove(false);

			for (var i = 0; i < dataToChart.length; i++) {
				//console.log(dataToChart[i]);
				chart.addSeries(dataToChart[i], false);
			}

			//console.log(chart.series);

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.chart.setSize(width, height, true);

			for (var i = 0; i < this.elements.length; i++) {
				this.elements.models[i].on('addPoint', this.addNewPoint, this);
				//console.log("CHANGED: " +i);
			}

			for (var i = 0; i < _seriesArr.length; i++) {
				var sensorModel = this.elements.models[i];
				var color = this.chart.series[i].color;
				sensorModel.set({ bgcolor: color });
				sensorModel.trigger('changebgcolor', sensorModel);
				console.log(color);
			}

			chart.legendHide();

			chart.redraw();

		},
		removeFromDom: function() {
			this.container.parent().remove();
			//this.grid.removeUnit(this.container.parent());
			//console.log('removed chart');
		},
		redraw: function() {
			this.chart.redraw();
		},
		changeRange: function() {

		},
		onresize: function(model) {
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();

			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.chart.setSize(width, height, true);

		}
	});

	return ChartView;
});