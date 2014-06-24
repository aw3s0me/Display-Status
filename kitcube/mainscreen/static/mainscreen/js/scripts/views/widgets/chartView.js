define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'text!templates/widgets/chart.html'], function($, _, Backbone, ChartModel, ChartTemplate) {

	var _seriesArr = [];
	var _allSensors = undefined;
	var _isLegendShown = false;

	var ChartView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		chart: undefined,
		model: undefined,
		board: undefined,
		lookDiv: undefined,
		extremeInterval: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			var self = this;
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.allSensors) {
				_allSensors = options.allSensors;
			}
			if (options.board) {
				this.board = options.board;
				this.lookDiv = this.board.el;
			}

			this.model.on('resize', this.onresize, this);
			this.render();

		},
		setExtremesInterval: function() {
			this.removeExtremesInterval();
			this.setExtremes();
			var self = this;
			var interval = this.model.getExtremesInterval();
			this.extremeInterval = setInterval(function() {
				self.setExtremes();
			}, interval); //the only way to pass param */
		},
		removeExtremesInterval: function() {
			this.extremeInterval = null;
		},
		formSensorElements: function() {
			var elems1Val = this.lookDiv.find('.activeSensor1');
			var elems2Val = this.lookDiv.find('.activeSensor2');
			var elemsVal = this.lookDiv.find('.activeSensor');
			elems = {};

			if (elemsVal)
				elems["0"] = elemsVal;
			if (elems2Val)
				elems["2"] = elems2Val;
			if (elems1Val)
				elems["1"] = elems1Val;

			for (var i = 0; i < elems1Val.length; i++) {
				var jqElement = elems1Val[i];
				//$(jqElement).removeClass('activeSensor1');
				//$(jqElement).addClass('chartAdded1');
			}

			for (var i = 0; i < elems2Val.length; i++) {
				var jqElement = elems2Val[i];
				//$(jqElement).removeClass('activeSensor2');
				//(jqElement).addClass('chartAdded2');
			}

			for (var i = 0; i < elemsVal.length; i++) {
				var jqElement = elemsVal[i];
				//$(jqElement).removeClass('activeSensor');

			}

			/* OPTION 1
			for (var i = 0; i < elemsVal.length; i++) {
				var jqElement = elemsVal[i];
				$(jqElement).removeClass('activeSensor');
				$(jqElement).addClass('chartAdded');
			}*/

			return elems;
		},
		removeSelection: function() {
			var elems1Val = this.lookDiv.find('.activeSensor1');
			var elems2Val = this.lookDiv.find('.activeSensor2');
			var elemsVal = this.lookDiv.find('.activeSensor');

			for (var i = 0; i < elems1Val.length; i++) {
				$(jqElement).removeClass('activeSensor1');
				$(jqElement).addClass('chartAdded1');
			}

			for (var i = 0; i < elems2Val.length; i++) {
				var jqElement = elems2Val[i];
				$(jqElement).removeClass('activeSensor2');
				$(jqElement).addClass('chartAdded2');
			}

			for (var i = 0; i < elemsVal.length; i++) {
				var jqElement = elemsVal[i];
				$(jqElement).removeClass('activeSensor');

			}
		},
		addNewPoint: function(model) {

			var chart = this.chart;
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
				foundSeriesObj.addPoint(Point, true, shift);
			}

			//this.setExtremes(); 

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
				if (!this.model.isOnTheChartById(id)) {
					models.push(_allSensors[id]);
				}
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

				if (this.model.isOnTheChartById(id)) {
					continue;
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
				var axisId = seriesObject['yAxis'];
				
				var existedAxis = self.chart.get(axisId);
				if (!existedAxis) {
					var axisObject = sensorModel.getChartAxisInfo(this.grid.getScale(), {
						axislabels: self.model.get('axislabels'),
						adeiAxisInfo: self.board.axes[axisId],
						count: series
					});
					axisObject.lineColor = '#000';
					self.chart.addAxis(axisObject);
					var axis = self.chart.get(axisObject.id);
					//axis.update({

					//})
				}
				var color = undefined;
					
				//console.log(JSON.stringify(axisObject));
				self.chart.addSeries(seriesObject, false);
				//console.log(JSON.stringify(seriesObject));
				sensorModel.on('addPoint', self.addNewPoint, self);
				/*for (var seriesName in series) {
					var seriesObject = series[seriesName];
					var id = seriesObject.userOptions.id;
					if (id === sensorModel.get('id')) {
						index = seriesObject._i;
						color = seriesObject.color;
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
				}*/
			}

		},
		render: function() {
			//load html template
			var self = this;
			var model = this.model;
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			this.container = $('<div id= ' + this.model.get('id') + '  ></div>')

			var controlPanelTemplate = $(_.template(ChartTemplate, {
				canberemoved: model.get('canberemoved')
			}));
			//this.container = $(_.template(ChartTemplate, { id: model.get('id') }));

			this.grid.addUnit(this.container, {
				border: 0,
				transparent: true,
				draggable: model.get('isdraggable'),
				resizable: model.get('isresizable')
			}, this.model);

			if (!model) {
				throw "Please, init model";
				return;
			}

			var xAxis = model.getXAxisObj();
			var chart = model.getChartOptions();
			chart.marginTop = 47 * scale;
			this.chart = new Highcharts.Chart({
				//this.chart = new Highcharts.StockChart({
				chart: chart,
				title: {
					text: model.get('caption'),
				},
				xAxis: xAxis,
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
					}
				},
				events: {
					//redraw: function(event) {
					afterSetExtremes: function(e) {
		            //load: function(event) {
		                //When is chart ready?
		                self.chart.hideLoading();
		            }
		        }     
			});

			this.chart.legendHide();

			var controlPanel = controlPanelTemplate.find('.chartControlPanel');
			//controlPanel.css('top', 14 * scale + 'px')
			controlPanel.css('right', 35 * scale + 'px');
			//.css('top', 10 * scale + 'px');

			controlPanel.css('font-size', 12 * scale + 'px');

			controlPanel.find('.goAdeiBtn').button()
				.click(function(event) {
					console.log(self.getUrlGoToAdei());
					window.open(self.getUrlGoToAdei(), '_blank');
				});

			controlPanel.find('.addChartBtn').button()
				.click(function(event) {
					var elems = self.formSensorElements();
					self.getDataForElements(elems);
				});
			controlPanel.find('.legendChartBtn').button()
				.click(function(event) {
					if (!_isLegendShown) {
						self.chart.legendShow();
						_isLegendShown = true;
					} else {
						self.chart.legendHide();
						_isLegendShown = false;
					}
				});
			if (model.get('canberemoved')) {
				controlPanelTemplate.find('.close').css('font-size', 12 * scale + 'px')
				.css('right', 10 * scale + 'px')
				.css('top', 10 * scale + 'px')
				.click(function(event) {
					self.removeFromDom();
				});
			}

			controlPanel.find('.chartBtn').css('margin-top', -11 * scale + 'px');
			
			controlPanel.find('.resetChartBtn').button()
				.click(function(event) {
					self.resetChart();
				});
			//var selectElem = controlPanelTemplate.find('.rangeContainer').css('top', 10 * scale + 'px').css('left', 10 * scale + 'px');

			this.container.append(controlPanelTemplate);

			//selectElem.find('.rangeDropdown').change(function() {
			controlPanel.find('.rangeDropdown')
			.css('font-size', 16 * scale + 'px')
			.css('margin-top', 10 * scale + 'px')
			.change(function() {
				var value = $(this).val();
				self.model.set({
					range: value
				});
				self.onChangeTimeRange();

				//self.setExtremes();
			});

			this.chart.setSize(width, height, false);

			this.initChartWhenStart();
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
			//this.chart.xAxis[0].setExtremes(windowObj.start, null);
			//this.redraw();
		},
		initChartWhenStart: function() {
			var chartModel = this.model;
			var linkArr = chartModel.get('link');
			var htmlElements = []; //to init html elements and change css
			var typeLookup = this.board.sensorViewLookup;

			if (linkArr.length <= 0) {
				return;
			}

			for (var i = 0; i < linkArr.length; i++) {
				var model = _allSensors[linkArr[i]];
				var div = undefined;
				model.on('addPoint', this.addNewPoint, this);
				//chartModel.get('models').push(model);

				if (typeLookup[linkArr[i]]) {
					switch (typeLookup[linkArr[i]].type) {
						case 0:
							{ //not double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor');
								}
								break;
							}
						case 1:
							{ //first value of double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor1');
								}
								break;
							}
						case 2:
							{ //second value of double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor2');
								}
								break;
							}
						default: //error
							throw "chart error";
					}
				} else {
					return;
				}

			}

			var elems = this.formSensorElements();
			this.getDataForElements(elems);
			
		},
		getElementsMetaInfo: function(models) {
			var isRequestNeeded = false;
			var masks = [];
			var modelsToChange = [];

			for (var i = 0; i < models.length; i++) {
				var model = models[i];
				if (model.get('axisname') === undefined) {
					isRequestNeeded = true;
					masks.push(model.get('mask'));
					modelsToChange.push(model);
				}				
			}

			if (!isRequestNeeded) 
				return;

			var masksToRequest = masks.join();
			if (masksToRequest.length === 0) {
				return;
			}

			var server = this.board.settings['server'];
			var dbname = this.board.settings['dbname'];
			var dbgroup = this.board.settings['dbgroup'];
			var axes = this.board.axes;
			
			var url = window.host + "services/list.php?target=items&db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&info=1';
			
			try {
				getDataFromAdei(url, false, function(data) {
					console.log(data);
					xmldoc = $.parseXML(data);
					$xml = $(xmldoc);
					$values = $xml.find('Value').each(function(index) {
						var id = $(this).attr('value');
						var axis_id = $(this).attr('axis');
						if (!axis_id) {
							return true; //continue equivalent in jquery
						}
						var axis = axes[axis_id];
						var model = modelsToChange[parseInt(id)];
						model.set({'axisname': axis_id});
						
					});
				});
			}
			catch(msg) {
				alert('Error when getting axes');
			}
		},
		calculateSensorsPrecision: function(models) {
			/*for (var sensorName in models) {
				var model = models[sensorName];
				if (this.get('exp') !== true) {
					if (this.get('precision') === undefined) {
						axisObj.labels =  {
							formatter: function() {
								return Highcharts.numberFormat(this.value, 2);
							}
						}
					}
					else {
						var precision = (self.get('precision') > 2 ) ? 2: self.get('precision');

						axisObj.labels = {
							formatter: function() {
								return Highcharts.numberFormat(this.value, precision);
							}
						}
					}
				}
				else {
					axisObj.labels = {
						formatter: function() {
							return this.value.toExponential(self.get('precision'))//Highcharts.numberFormat(this.value, self.get('precision'));
						}
					}
				}


			}*/

			


		},
		getDataForElements: function(typeObject) {
			//console.log(model.get('id'));
			this.removeExtremesInterval();
			this.model.off('addPoint', this.addNewPoint, this);
			if (!typeObject) {
				return;
			}
			this.chart.showLoading();
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
			//console.log(new Date(windowObj.start), new Date(windowObj.end));
			var nubmerOfPoints = this.model.getNumberOfPoints();
			var resample = getResample(nubmerOfPoints, start, end);
			//console.log('resample: ' + resample)

			if (typeObject["1"])
				this.getIdsOfSensorType(typeObject["1"], models, 1);
			if (typeObject["2"])
				this.getIdsOfSensorType(typeObject["2"], models, 2);
			if (typeObject["0"])
				this.getIdsOfSensorType(typeObject["0"], models, 0);

			if (models.length + this.model.get('models').length > this.model.get('maxelementsize')) {
				alert('You can add only no more than: ' + this.model.get('maxelementsize') + ' elements');
				this.chart.hideLoading();
				return;
			}

			this.removeSelection();

			for (var i = 0; i < models.length; i++) {
				if (!this.model.isOnTheChartById(models[i].get('id'))) {
					masks.push(models[i].get('mask'));
				}
			}

			var masksToRequest = masks.join();
			if (masksToRequest.length === 0) {
				return;
			}
			//console.log(masksToRequest);

			/* TEST CODE
			db.getData('fpd', 'katrin_rep', '0', '0,1,2,3,4,5', '1400700000-1401409791', 800, 'mean', function(obj)
				{
					var data = obj.data;
					var datetime = obj.dateTime;
					console.log(new Date(datetime[0] * 1000), new Date(datetime[datetime.length - 1] * 1000));
				})	
			*/
			try {
				//window.db.getData(server, dbname, dbgroup, masksToRequest, windowUrl, this.getNumberOfPoints(), 'mean', function(obj) {
				//window.db.getData(server, dbname, dbgroup, masksToRequest, windowUrl, nubmerOfPoints, 'mean', function(obj) {
				//window.db.getData(server, dbname, dbgroup, masksToRequest, '1400700000-1401409791', nubmerOfPoints, 'mean', function(obj) {
				//window.db.getData('fpd', 'katrin_rep', '0', '3', '1400700000-1401409791', 800, 'mean', function(obj) {
				var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=' + windowUrl + '&resample=' + resample;
				//window.db.httpGetCsv(url, function(data) {
				getDataFromAdei(url, true, function(data) {
					obj = parseCSV(data, masks.length);
					//console.log(obj);
					if (!obj) {
						return;
					}

					var data = obj.data;
					var datetime = obj.dateTime;
					if (!data.length || !datetime.length) {
						alert('No data for: ' + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=' + windowUrl);
						return;
					}

					self.getElementsMetaInfo(models, masksToRequest);

					for (var i = 0; i < masks.length; i++) {
						if (data[i].length > 0) {
							models[i].setDataModel(data[i], datetime);
						}
					}

					if (typeObject["1"])
						self.setSensorDataInChart(typeObject["1"], 1);
					if (typeObject["2"])
						self.setSensorDataInChart(typeObject["2"], 2);
					if (typeObject["0"])
						self.setSensorDataInChart(typeObject["0"], 0);
					self.setExtremesInterval();
					self.chart.hideLoading();
				});
			} catch (msg) {
				console.log(msg);
			}
		},
		onChangeTimeRange: function() {
			var models = this.model.get('models');
			var self = this;
			var masks = [];
			var server = this.board.settings['server'];
			var dbname = this.board.settings['dbname'];
			var dbgroup = this.board.settings['dbgroup'];
			var windowObj = this.getWindow();
			//console.log(new Date(windowObj.start), new Date(windowObj.end));
			var start = parseInt(windowObj.start / 1000);
			var end = parseInt(windowObj.end / 1000);
			var windowUrl = start + "-" + end;
			var nubmerOfPoints = this.model.getNumberOfPoints();
			var series = this.chart.series;
			var resample = getResample(nubmerOfPoints, start, end);

			if (!models || !models.length) {
				return;
			}

			for (var i = 0; i < models.length; i++) {
				masks.push(models[i].get('mask'));
			}

			var masksToRequest = masks.join();
			if (masksToRequest.length === 0) {
				return;
			}

			this.chart.showLoading();
			this.removeExtremesInterval();
			this.stopAddPointEvent();
			try {
				//window.db.getData(server, dbname, dbgroup, masksToRequest, windowUrl, nubmerOfPoints, 'mean', function(obj) {
				//window.db.getData(server, dbname, dbgroup, masksToRequest, windowUrl, this.getNumberOfPoints(), 'mean', function(obj) {
				//db.getData('fpd', 'katrin_rep', '0', masksToRequest, '1400700000-1401409791', 800, 'mean', function(obj) {
				var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=' + windowUrl + '&resample=' + resample;
				getDataFromAdei(url, true, function(data) {
					obj = parseCSV(data, masks.length);
					if (!obj) {
						return;
					}
					var data = obj.data;
					var datetime = obj.dateTime;
					if (!data.length || !datetime.length) {
						alert('No data for: ' + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=' + windowUrl);
						return;
					}
					for (var i = 0; i < masks.length; i++) {
						var model = models[i];
						if (data[i].length > 0) {
							model.setDataModel(data[i], datetime);
						}
						for (var i = 0; i < series.length; i++) {
							var seriesObject = series[i];
							var id = seriesObject.userOptions.id;
							if (id === model.get('id')) {
								seriesObject.data = [];
								seriesObject.setData(model.get('values'));
								break;
							}
						}
						//console.log(JSON.stringify(models[i].get('values')));
					}

					self.setExtremesInterval();
					self.chart.hideLoading();
					self.startAddPointEvent();
					self.redraw();
					//console.log(self.chart);
				});
			} catch (msg) {
				//console.log(msg);
			}
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
			var seriesToRemove = chart.get(id);
			var seriesYAxis = seriesToRemove.yAxis;
			if (seriesYAxis.series.length === 1)
				seriesYAxis.remove();
			seriesToRemove.remove();
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
		stopAddPointEvent: function() {
			var models = this.model.get('models');
			for (var i = 0; i < models.length; i++) {
				models[i].off('addPoint', this.addNewPoint);
			}
		},
		startAddPointEvent: function() {
			var models = this.model.get('models');
			for (var i = 0; i < models.length; i++) {
				models[i].on('addPoint', this.addNewPoint, this);
			}
		},
		resetChart: function() {
			var models = _.clone(this.model.get('models'));

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
		},
		getUrlGoToAdei: function() {
			var adeiurl = window.host;
			var windowObj = this.getWindow();
			//console.log(new Date(windowObj.start), new Date(windowObj.end));
			var start = parseInt(windowObj.start / 1000);
			var end = parseInt(windowObj.end / 1000);
			var windowUrl = start + "-" + end;
			var srctree = this.model.getSrcTreeLink();

			adeiurl += "#module=graph&db_server=virtual&db_name=srctree&db_group=-3&contro_group=-3&db_mask=all&experiment=-";
			adeiurl += "&window=" + windowUrl;
			adeiurl += "&module=graph&virtual=srctree&srctree=" + srctree;

			return adeiurl;
		},
		getNumberOfPoints: function() {
			var width = this.chart.chartWidth;
			var resolution = this.model.get('resolution');
			return parseInt(width * resolution);
		}
	});

	return ChartView;
});