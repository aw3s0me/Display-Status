define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'collections/sensorGroupCollection'], function($, _, Backbone, ChartModel, SensorGroupCollection) {

	var _seriesArr = [];
	var _allSensors = undefined;
	var _isLegendShown = false;

	var ChartView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		chart: undefined,
		elements: undefined,
		model: undefined,
		board: undefined,
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
			if (options.board) {
				this.board = options.board;
			}

			(function(b, a) {
				if (!b) {
					return
				}
				var c = b.Chart.prototype,
					d = b.Legend.prototype;
				b.extend(c, {
					legendSetVisibility: function(h) {
						var i = this,
							k = i.legend,
							e, g, j, m = i.options.legend,
							f, l;
						if (m.enabled == h) {
							return
						}
						m.enabled = h;
						if (!h) {
							d.destroy.call(k);
							e = k.allItems;
							if (e) {
								for (g = 0, j = e.length; g < j; ++g) {
									e[g].legendItem = a
								}
							}
							k.group = {}
						}
						c.render.call(i);
						if (!m.floating) {
							f = i.scroller;
							if (f && f.render) {
								l = i.xAxis[0].getExtremes();
								f.render(l.min, l.max)
							}
						}
					},
					legendHide: function() {
						this.legendSetVisibility(false)
					},
					legendShow: function() {
						this.legendSetVisibility(true)
					},
					legendToggle: function() {
						this.legendSetVisibility(this.options.legend.enabled ^ true)
					}
				})
			}(Highcharts));

			for (var i = 0; i < this.elements.length; i++) {
				this.elements.models[i].on('addPoint', this.addNewPoint, this);
			}
			this.model.on('resize', this.onresize, this);
			this.render();

			this.container.find('.addChartBtn').click(function(event) {
				var elems1Val = $('.canvas').find('.activeSensor1');
				var elems2Val = $('.canvas').find('.activeSensor2');
				var elemsVal = $('.canvas').find('.activeSensor');
				elems = {};

				if (elemsVal) 
					elems["0"] = elemsVal;
				if (elems2Val)
					elems["2"] = elems2Val;
				if (elems1Val)
					elems["1"] = elems1Val;

				self.getDataForElements(elems);
			});

			this.container.find('.legendChartBtn').click(function(event) {
				if (!_isLegendShown) {
					self.chart.legendShow();
					_isLegendShown = true;
				} else {
					self.chart.legendHide();
					_isLegendShown = false;
				}

			});
		},
		addNewPoint: function(model) {

			/*var chart = this.chart;
			var series = this.chart.series;
			//console.log(chart);
			var index = undefined; //index of series
			var shift = false;
			//console.log(model.get('id'));
			var sensorValue = model.get('value');
			var foundSeriesObj = null;

			for (var seriesName in series) {
				var seriesObject = series[seriesName];
				var id = seriesObject.userOptions.id;
				if (id === model.get('id')) {
					index = seriesObject._i;
					foundSeriesObj = seriesObject;
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

			if (foundSeriesObj) {
				foundSeriesObj.addPoint(Point, false, shift);
			}

			shift = false;

			this.setExtremes(); */

		},
		getIdsOfSensorType: function(elems, models, type) {
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id;

				if (type === 2) {
					id = jqElement.getAttribute('id2');
				} else {
					id = jqElement.getAttribute('id');
				}
				models.push(_allSensors[id]);
			}
		},
		setSensorDataInChart: function(elems, type) {
			var chart = this.chart;

			var series = this.chart.series;
			//console.log(chart);
			var index = undefined; //index of series
			var shift = false;
			var self = this;
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id;
				if (type === 2) {
					id = jqElement.getAttribute('id2');
				} else {
					id = jqElement.getAttribute('id');
				}

				var sensorModel = _allSensors[id];
				//sensorModel.on('addPoint', self.addNewPoint, self);
				sensorModel.on('deleteSensor', self.removeSeries, self);
				sensorModel.on('removing', self.onSensorRemoving, self);
				self.model.get('link').push(sensorModel.get('id'));
				self.model.get('models').push(sensorModel);
				if (!sensorModel) {
					throw "Cant add sensor";
				}
				var seriesObject = sensorModel.getChartProperties();
				console.log(seriesObject);
				console.log(sensorModel.get('values'));
				var axisObject = sensorModel.getChartAxisInfo({
					axislabels: self.model.get('axislabels')
				});
				var color = undefined;
				self.chart.addAxis(axisObject);
				//console.log(JSON.stringify(axisObject));
				//self.chart.addSeries(seriesObject, false);
				self.chart.addSeries(seriesObject, false);
				//console.log(JSON.stringify(seriesObject));
				sensorModel.on('addPoint', self.addNewPoint, self);
				for (var seriesName in series) {
					var seriesObject = series[seriesName];
					var id = seriesObject.userOptions.id;
					if (id === sensorModel.get('id')) {
						index = seriesObject._i;
						color = seriesObject.color;
						//circle.css('background-color', color);

						switch (type) {
							case 0:
								$(jqElement).removeClass('activeSensor');
								$(jqElement).addClass('chartAdded');
								break;
							case 1:
								$(jqElement).removeClass('activeSensor1');
								$(jqElement).addClass('chartAdded1');
								break;
							case 2:
								$(jqElement).removeClass('activeSensor2');
								$(jqElement).addClass('chartAdded2');
								break;
							case 12:
								$(jqElement).removeClass('activeSensor1');
								$(jqElement).addClass('chartAdded1');
								$(jqElement).removeClass('activeSensor2');
								$(jqElement).addClass('chartAdded2');
								break;
							default:
								console.log('wrong type of a sensor at chartview');
								throw 'wrong type of a sensor at chartview';
								break;
						}

						var axisId = seriesObject.yAxis.userOptions.id;
						for (var j = 0; j < self.chart.yAxis.length; j++) {
							var yaxis = self.chart.yAxis[j];
							if (yaxis.userOptions.id === axisId) {
								//yaxis.options.lineColor = color;
								yaxis.update({
									lineColor: color
								});
								break;
							}
						}
						break;
					}
				}
			}

		},
		getDataForElements: function(typeObject) {
			//console.log(model.get('id'));

			if (!typeObject) {
				return;
			}

			var self = this;
			var masks = [];
			var server = this.board.settings['server'];
			var dbname = this.board.settings['dbname'];
			var dbgroup = this.board.settings['dbgroup'];
			var models = [];
			var windowObj = this.getWindow();
			var start = parseInt(windowObj.start / 1000);
			var end = parseInt(windowObj.end / 1000);
			var windowUrl = start + "-" + end;
			var nubmerOfPoints = this.model.getNumberOfPoints();

			this.getIdsOfSensorType(typeObject["1"], models, 1);
			this.getIdsOfSensorType(typeObject["2"], models, 2);
			this.getIdsOfSensorType(typeObject["0"], models, 0);


			for (var i = 0; i < models.length; i++) {
				masks.push(models[i].get('mask'));
			}

			var masksToRequest = masks.join();
			if (masksToRequest.length === 0) {
				return;
			}

			try
			{
				window.db.getData(server, dbname, dbgroup, masksToRequest, windowUrl, nubmerOfPoints, 'mean', function(obj) {
					console.log(obj);
					if (!obj) {
						return;
					}
					var data = obj.data;
					var datetime = obj.dateTime;
					for (var i = 0; i < models.length; i++) {
						if (data[i].length > 0) {
							models[i].setDataModel(data[i], datetime);
						}
						//console.log(JSON.stringify(models[i].get('values')));
					}

					if (typeObject["1"]) 
						self.setSensorDataInChart(typeObject["1"], 1);
					if (typeObject["2"]) 
						self.setSensorDataInChart(typeObject["2"], 2);
					if (typeObject["0"]) 
						self.setSensorDataInChart(typeObject["0"], 0); 
					//self.setExtremes();
					//self.redraw();
					console.log(self.chart);
				});
			}
			catch(msg) {
				console.log(msg);
			}


		},
		render: function() {
			//load html template
			var self = this;
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
			//console.log(JSON.stringify(xAxis));
			//console.log(JSON.stringify(chart));
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
						}
						/*,
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

			

			(function(b, a) {
				if (!b) {
					return
				}
				var c = b.Chart.prototype,
					d = b.Legend.prototype;
				b.extend(c, {
					legendSetVisibility: function(h) {
						var i = this,
							k = i.legend,
							e, g, j, m = i.options.legend,
							f, l;
						if (m.enabled == h) {
							return
						}
						m.enabled = h;
						if (!h) {
							d.destroy.call(k);
							e = k.allItems;
							if (e) {
								for (g = 0, j = e.length; g < j; ++g) {
									e[g].legendItem = a
								}
							}
							k.group = {}
						}
						c.render.call(i);
						if (!m.floating) {
							f = i.scroller;
							if (f && f.render) {
								l = i.xAxis[0].getExtremes();
								f.render(l.min, l.max)
							}
						}
					},
					legendHide: function() {
						this.legendSetVisibility(false)
					},
					legendShow: function() {
						this.legendSetVisibility(true)
					},
					legendToggle: function() {
						this.legendSetVisibility(this.options.legend.enabled ^ true)
					}
				})
			}(Highcharts));

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			for (var i = 0; i < _seriesArr.length; i++) {
				var sensorModel = this.elements.models[i];
				var color = this.chart.series[i].color;
				sensorModel.set({
					bgcolor: color
				});
				sensorModel.trigger('changebgcolor', sensorModel);
				console.log(color);
			}



			this.chart.legendHide();



			var chartControlPanel = $('<div></div>');
			chartControlPanel.addClass('chartControlPanel');
			chartControlPanel.css('top', 14 * scale + 'px');
			//chartControlPanel.css('width', '100%');
			chartControlPanel.css('right', 14 * scale + 'px');
			chartControlPanel.css('position', 'absolute');

			var addBtn = $('<button>Add</button>');
			addBtn.css('font-size', 10 * scale + 'px');
			addBtn.button();
			addBtn.addClass('addChartBtn');

			var legendBtn = $('<button>Legend</button>');
			legendBtn.css('font-size', 10 * scale + 'px');
			legendBtn.button();
			legendBtn.addClass('legendChartBtn');

			var closeBtn = document.createElement('div');
			closeBtn.style.position = 'absolute';
			closeBtn.style.fontSize = 12 * scale + 'px';
			closeBtn.style.right = 5 * scale + 'px';
			closeBtn.style.top = 4 * scale + 'px';
			closeBtn.innerHTML = "<b>x</b>";
			closeBtn.className = "close";

			this.container.find('.highcharts-container').append(closeBtn);


			$(closeBtn).click(function(event) {
				self.removeFromDom();
			});

			var resetBtn = $('<button>Reset</button>');
			resetBtn.addClass('resetChartBtn');
			resetBtn.css('fontSize', 10 * scale + 'px');
			resetBtn.button();
			$(resetBtn).click(function(event) {
				self.resetChart();
			});



			//var chooseRange = $('<select style="width: 100px;"></select>');
			var cntr = $('<div class="cntr"></div>');
			var chooseContainer = $('<div class="rangeContainer"></div>');
			chooseContainer.css('top', 10 * scale + 'px');
			chooseContainer.css('left', 10 * scale + 'px');
			//chooseContainer.css('position', 'absolute');
			//chooseContainer.css('z-index', '2');
			var chooseRange = $('<select class="rangeDropdown"></select>');
			chooseContainer.append(chooseRange);
			chooseRange.append('<option value="90d">90 day</option>');
			chooseRange.append('<option value="30d">30 day</option>');
			chooseRange.append('<option value="14d">14 day</option>');
			chooseRange.append('<option value="7d">7 day</option>');
			chooseRange.append('<option value="3d">3 day</option>');
			chooseRange.append('<option value="24h">24 hour</option>');
			chooseRange.append('<option value="8h">8 hour</option>');
			chooseRange.append('<option value="3h">3 hour</option>');
			chooseRange.append('<option value="1h">1 hour</option>');
			chooseRange.append('<option selected="selected" value="15m">15 min</option>');

			chooseRange.change(function() {
				var value = $(this).val();
				self.model.set({
					range: value
				});
				//self.setExtremes();
				console.log(value);
			});



			this.container.append(cntr);


			cntr.append(chooseContainer);

			chartControlPanel.append(addBtn);
			chartControlPanel.append(resetBtn);
			chartControlPanel.append(legendBtn);



			this.container.find('.highcharts-container').append(chartControlPanel);
			

			this.chart.setSize(width, height, false);
			/*var axisObject = {"id":"sensid41-axis","lineWidth":2,"title":{"text":"Bias (V)"}} ;
        	this.chart.addAxis(axisObject);
        	var data = [{"x":1401443324,"y":0},{"x":1401443334,"y":0},{"x":1401443344,"y":0},{"x":1401443354,"y":0},{"x":1401443364,"y":0},{"x":1401443374,"y":0},{"x":1401443384,"y":0},{"x":1401443394,"y":0},{"x":1401443404,"y":0},{"x":1401443414,"y":0},{"x":1401443424,"y":0},{"x":1401443434,"y":0},{"x":1401443444,"y":0},{"x":1401443454,"y":0},{"x":1401443464,"y":0},{"x":1401443474,"y":0},{"x":1401443484,"y":0},{"x":1401443494,"y":0},{"x":1401443504,"y":0},{"x":1401443514,"y":0},{"x":1401443524,"y":0},{"x":1401443534,"y":0},{"x":1401443544,"y":0},{"x":1401443554,"y":0},{"x":1401443564,"y":0},{"x":1401443574,"y":0},{"x":1401443584,"y":0},{"x":1401443594,"y":0},{"x":1401443604,"y":0},{"x":1401443614,"y":0},{"x":1401443624,"y":0},{"x":1401443634,"y":0},{"x":1401443644,"y":0},{"x":1401443654,"y":0},{"x":1401443664,"y":0},{"x":1401443674,"y":0},{"x":1401443684,"y":0},{"x":1401443694,"y":0},{"x":1401443704,"y":0},{"x":1401443714,"y":0},{"x":1401443724,"y":0},{"x":1401443734,"y":0},{"x":1401443744,"y":0},{"x":1401443754,"y":0},{"x":1401443764,"y":0},{"x":1401443774,"y":0},{"x":1401443784,"y":0},{"x":1401443794,"y":0},{"x":1401443804,"y":0},{"x":1401443814,"y":0},{"x":1401443824,"y":0},{"x":1401443834,"y":0},{"x":1401443844,"y":0},{"x":1401443854,"y":0},{"x":1401443864,"y":0}];
        	var seriesObject = {"data": data,"id":"sensid42","yAxis":"sensid41-axis","name":"Ramping"};
        	this.chart.addSeries(seriesObject);
        	this.chart.redraw(); */
			

			//this.setExtremes();
			//chooseRange.chosen();

			/*chooseRange.chosen({
				disable_search_threshold: 1,
				width: '80%'
			});*/

		},
		getWindow: function() {
			var now = new Date;
			var min = this.model.getRangeToDate();
			var max = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
			return {
				start: min,
				end: max
			}
		},
		setExtremes: function() {
			var windowObj = this.getWindow();
			this.chart.xAxis[0].setExtremes(windowObj.start, windowObj.end);
		},
		addAllSeries: function() {
			var allModels = this.elements;



		},
		removeSeries: function(model) {
			var chart = this.chart;
			var id = model.get('id');
			var series = chart.series;
			var index = undefined;
			model.off('addPoint', this.addNewPoint);
			model.off('deleteSensor', this.removeSeries);
			model.off('removing', this.onSensorRemoving);
			this.model.removeModel(model.get('id'));

			for (var i = 0; i < series.length; i++) {
				var seriesObject = series[i];
				var id = seriesObject.userOptions.id;
				if (id === model.get('id')) {
					seriesObject.isRemoving = true;
					var axisId = seriesObject.yAxis.userOptions.id;
					for (var i = 0; i < chart.yAxis.length; i++) {
						var yaxis = chart.yAxis[i];
						if (yaxis.userOptions.id === axisId) {
							yaxis.remove();
						}
					}
					seriesObject.remove();
					//index = seriesObject._i;
					//break;
				}
			}
			//chart.redraw();


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
			(function(b, a) {
				if (!b) {
					return
				}
				var c = b.Chart.prototype,
					d = b.Legend.prototype;
				b.extend(c, {
					legendSetVisibility: function(h) {
						var i = this,
							k = i.legend,
							e, g, j, m = i.options.legend,
							f, l;
						if (m.enabled == h) {
							return
						}
						m.enabled = h;
						if (!h) {
							d.destroy.call(k);
							e = k.allItems;
							if (e) {
								for (g = 0, j = e.length; g < j; ++g) {
									e[g].legendItem = a
								}
							}
							k.group = {}
						}
						c.render.call(i);
						if (!m.floating) {
							f = i.scroller;
							if (f && f.render) {
								l = i.xAxis[0].getExtremes();
								f.render(l.min, l.max)
							}
						}
					},
					legendHide: function() {
						this.legendSetVisibility(false)
					},
					legendShow: function() {
						this.legendSetVisibility(true)
					},
					legendToggle: function() {
						this.legendSetVisibility(this.options.legend.enabled ^ true)
					}
				})
			}(Highcharts));

			chart.setTitle({
				text: model.get('caption')
			});

			while (chart.series.length > 0)
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
				sensorModel.set({
					bgcolor: color
				});
				sensorModel.trigger('changebgcolor', sensorModel);
				console.log(color);
			}

			chart.legendHide();

			chart.redraw();

		},
		removeFromDom: function() {
			this.container.parent().remove();
			this.remove();
			this.unbind();
			this.model.trigger('removing', this.model);
		},
		redraw: function() {
			this.chart.redraw();
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

		},
		onSensorRemoving: function(model) {
			this.removeSeries(model);
		},
		resetChart: function() {
			//console.log('reset');
			var models = _.clone(this.model.get('models'));
			var length = models.length;

			/*for (var i = 0; i < length; i++) {
				this.removeSeries(models[i]);
			} */

			for (var i = 0; i < models.length; i++) {
				models[i].trigger('removedFromChart');
				models[i].off('addPoint', this.addNewPoint);
				models[i].off('deleteSensor', this.removeSeries);
				models[i].off('removing', this.onSensorRemoving);
				this.model.removeModel(models[i].get('id'));
			}

			while (this.chart.series.length > 0)
				this.chart.series[0].remove();

			while (this.chart.yAxis.length > 0)
				this.chart.yAxis[0].remove();

			console.log(this.chart);
			//this.chart.redraw();

		},
		addAdeiChart: function(models) {

		}
	});

	return ChartView;
});