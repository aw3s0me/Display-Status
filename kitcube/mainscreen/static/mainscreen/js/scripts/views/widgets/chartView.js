define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'highcharts-legend',
	'highcharts-theme', 'text!templates/widgets/chart.html', 'views/widgets/baseWidgetView'], function($, _, Backbone, ChartModel, HighchartsLeg, HighchartsTheme, ChartTemplate, BaseWidgetView) {

	var _seriesArr = [];
	var _allSensors = undefined;
	var _isLegendShown = false;

	var ChartView = BaseWidgetView.extend({
		chart: undefined,
		board: undefined,
		lookDiv: undefined,
		extremeInterval: undefined,
		deffereds: [],
		_draghoverClassAdded: false,
		initialize: function(attr) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			var self = this;

			this.widgetController = attr.wc;
			this.grid = this.widgetController.getGrid(attr);

			this.model = new ChartModel(attr);

			_allSensors = this.widgetController.sensors;

			this.board = this.widgetController.board;
			this.lookDiv = this.board.el;

			this.model.on('resize', this.onresize, this);
			this.model.on('removing', function() {
                this.widgetController.removeViewByType(newChart.get('type'), this.model.get('id'));
            }, this);

			this.render();

			this.widgetController.addViewToLookup(this.model.get('type'), this);
			this.container.bind('drop dragdrop', _.bind(this._onDrop, this));
			this.container.bind("dragover", _.bind(this._onDragOver, this))
			this.container.bind("dragenter", _.bind(this._onDragEnter, this))
			this.container.bind("dragleave", _.bind(this._onDragLeave, this))

		},
		//events: {
		//	'drop .dropable': '_onDrop'
		//},
		_onDrop: function (e) {
			console.log('DROP!');
			if (e.originalEvent) e = e.originalEvent;

			var id = e.dataTransfer.getData('text/html');

			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			this.container.css({'opacity': 1});

			var sensorModel = _allSensors[id];

			sensorModel.on('deleteSensor', this.removeSeries, this);
				sensorModel.on('removing', this.onSensorRemoving, this);
				this.model.get('link').push(sensorModel.get('id'));
				this.model.get('models').push(sensorModel);

				var seriesObject = sensorModel.getChartProperties();
				delete seriesObject['yAxis'];

				//seriesObject.data = [];
				var data = this.board.datasourceController.simulateDataForSensor(this.model.getWindow(), this.model.getNumberOfPoints(this.chart.chartWidth));
				console.log(data);
				sensorModel.setDataModel(data[0], data[1]);
				console.log(sensorModel.get('values'));
				//seriesObject.setData(model.get('values'));
				seriesObject.data = sensorModel.get('values');
				this.chart.addSeries(seriesObject, true);
				sensorModel.on('addPoint', this.addNewPoint, this);
		},
		_onDragEnter: function () {
			if (event.originalEvent) event = event.originalEvent;
			if (event.preventDefault) event = event.preventDefault();
			this.container.css({'opacity': 0.6});
		},
		_onDragOver: function () {
			this.container.css({'opacity': 0.6});
			event.preventDefault();
		},
		_onDragLeave: function () {
			if (event.originalEvent) event = event.originalEvent;
			this.container.css({'opacity': 1});
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
			return this.lookDiv.find('.activeSensor');
		},
		addNewPoint: function(model) {

			var chart = this.chart;
			var series = this.chart.series;
			var index = undefined; //index of series
			var shift = false;
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
		},
		getIdsOfSensorType: function(elems, models) {
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id = jqElement.getAttribute('id');

				if (!this.model.isOnTheChartById(id)) {
					models.push(_allSensors[id]);
				}
			}
		},
		setSensorDataInChart: function(elems) {
			var chart = this.chart;

			var series = this.chart.series;
			var index = undefined; //index of series
			var shift = false;
			var self = this;
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id = jqElement.getAttribute('id');

				if (this.model.isOnTheChartById(id)) {
					continue;
				}

				var sensorModel = _allSensors[id];

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
						adeiAxisInfo: self.board.datasourceController.getAxis(sensorModel.get('datasource'), axisId),//self.board.axes[axisId],
						count: series
					});
					axisObject.lineColor = '#000';
					self.chart.addAxis(axisObject);
					var axis = self.chart.get(axisObject.id);
				}
				var color = undefined;
				self.chart.addSeries(seriesObject, false);
				sensorModel.on('addPoint', self.addNewPoint, self);
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
			var sizeCoeff = this.widgetController.sizecoeff / 2;
			var coeffScale = scale * sizeCoeff;

			this.container = $('<div id= ' + this.model.get('id') + '  ></div>');

			var controlPanelTemplate = $(_.template(ChartTemplate, {
				canberemoved: model.get('canberemoved')
			}));

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
			chart.marginTop = 47 * coeffScale;
			this.chart = new Highcharts.Chart({
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

			//controlPanel.css('font-size', coeffScale * 12 + 'px');

			controlPanel.find('.goAdeiBtn')
				.click(function(event) {
					window.open(self.getUrlGoToAdei(), '_blank');
				});

			controlPanel.find('.addChartBtn')
				.click(function(event) {
					var elems = self.formSensorElements();
					self.getAllData(elems);
				});
			controlPanel.find('.legendChartBtn')
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
				controlPanelTemplate.find('.close').css('font-size', coeffScale * 12 + 'px')
					.css('right', coeffScale * 10 + 'px')
					.css('top', coeffScale * 10 + 'px')
					.click(function(event) {
						self.removeFromDom();
					});
			}

			controlPanel.find('.chart-btn').css('margin-top', coeffScale * -1 + 'px');

			controlPanel.find('.resetChartBtn')
				.click(function(event) {
					self.resetChart();
				});
			//var selectElem = controlPanelTemplate.find('.rangeContainer').css('top', 10 * scale + 'px').css('left', 10 * scale + 'px');

			this.container.append(controlPanelTemplate);

			//selectElem.find('.rangeDropdown').change(function() {
			controlPanel.find('.rangeDropdown')
				//.css('font-size', coeffScale * 16 + 'px')
				.css('margin-top', coeffScale * 10 + 'px')
				.change(function() {
					var value = $(this).val();
					self.model.set({
						range: value
					});
					self.onChangeTimeRange();
				});

			this.chart.setSize(width, height, false);

			this.initChartWhenStart();
		},
		setExtremes: function() {
			var windowObj = this.model.getWindow();
			this.chart.xAxis[0].setExtremes(windowObj.start, windowObj.end);
		},
		initChartWhenStart: function() {
			var chartModel = this.model;
			var linkArr = chartModel.get('link');
			var typeLookup = this.board.widgetController.sensorViewLookup;

			if (linkArr.length <= 0) {
				return;
			}

			for (var i = 0; i < linkArr.length; i++) {
				var model = _allSensors[linkArr[i]];
				model.on('addPoint', this.addNewPoint, this);

				if (!typeLookup[linkArr[i]]) {
					return;
				}

				var div = $('#' + typeLookup[linkArr[i]].viewId);
				div.addClass('activeSensor');
			}

			var elems = this.formSensorElements();
			if (this.board.settings.issimulation) {
				this.getAllDataForSimulation(elems);
			}
			else {
				this.getAllData(elems);
			}
		},
		getElementsMetaInfoDatasource: function(datasource, models) {
			var isRequestNeeded = false;
			var self = this;
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


			var server = datasource['server'];
			var dbname = datasource['dbname'];
			var dbgroup = datasource['dbgroup'];
			var url = formAdeiUrlMeta(window.host, server, dbname, dbgroup, masksToRequest);

			try {
				getDataFromAdei(url, false, function(data) {
					xmldoc = $.parseXML(data);
					$xml = $(xmldoc);
					$values = $xml.find('Value').each(function(index) {
						var id = $(this).attr('value');
						var axis_id = $(this).attr('axis');
						if (!axis_id) {
							return true; //continue equivalent in jquery
						}
						var axis = self.board.datasourceController.getAxis(datasource.id, axis_id);
						var model = modelsToChange[parseInt(id)];
						model.set({
							'axisname': axis_id
						});
					});
			
				});
			}
			catch(e) {
				throw new Error('Can\'t get data from ' + url);
			}
		},
		getElementsFromTypeObject: function(typeObject) {
			var models = [];

			this.getIdsOfSensorType(typeObject, models);

			return models;
		},
		getAllDataForDatasource: function(datasource, windowUrl, resampleUrl) {
			var self = this;
			var models = datasource.sensors;
			var masks = this.model.getMasks(models, false);
			if (!masks)
				return 
			var url = formAdeiUrl(window.host, datasource.server, datasource.dbname, datasource.dbgroup, masks, windowUrl, resampleUrl);
			var elementLength = Object.keys(models).length;
			this.deffereds.push($.ajax({
				type: 'GET',
				url: url,
				dataType: 'text',
				success: function(data) {
					obj = parseCSV(data, elementLength);
					if (!obj) {
						return;
					}

					var data = obj.data;

					var datetime = obj.dateTime;
					if (!data.length || !datetime.length) {
						alert('No data for: ' + url);
						return;
					}

					self.getElementsMetaInfoDatasource(datasource, models);

					for (var i = 0; i < elementLength; i++) {
						if (data[i].length > 0) {
							models[i].setDataModel(data[i], datetime);
						}
					}
				},
				error: function(xhr, ajaxOptions, thrownError) {
					throw new Error('Can\'t get data from ' + url);
				}
			}));
		},
		onDataLoaded: function(elems) {
			var self = this;
			if (elems)
				self.setSensorDataInChart(elems);
			self.setExtremesInterval();
			self.chart.hideLoading();
		},
		onDataUpdated: function() {

		},
		getAllDataForSimulation: function (elems) {
			//not finished
			var sensors = this.model.get('models');
			var seriesArr = this.model.get('seriesArr');
			var linkArr = this.model.get('link');

			for (var i = 0; i < linkArr.length; i++) {
				var model = _allSensors[linkArr[i]];
			}

			var chart = this.chart;

			var series = this.chart.series;
			var index = undefined; //index of series
			var shift = false;
			var self = this;
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id;
				id = jqElement.getAttribute('id');
				if (this.model.isOnTheChartById(id)) {
					continue;
				}
				var sensorModel = _allSensors[id];
				if (!sensorModel) {
					throw "Cant add sensor";
				}

				sensorModel.on('deleteSensor', self.removeSeries, self);
				sensorModel.on('removing', self.onSensorRemoving, self);
				self.model.get('link').push(sensorModel.get('id'));
				self.model.get('models').push(sensorModel);

				var seriesObject = sensorModel.getChartProperties();
				delete seriesObject['yAxis'];

				//seriesObject.data = [];
				var data = self.board.datasourceController.simulateDataForSensor(this.model.getWindow(), this.model.getNumberOfPoints(this.chart.chartWidth));
				console.log(data);
				sensorModel.setDataModel(data[0], data[1]);
				console.log(sensorModel.get('values'));
				//seriesObject.setData(model.get('values'));
				seriesObject.data = sensorModel.get('values');
				self.chart.addSeries(seriesObject, false);
				sensorModel.on('addPoint', self.addNewPoint, self);
			}
		},
		getAllData: function(typeObject) {
			this.removeExtremesInterval();
			this.model.off('addPoint', this.addNewPoint, this);
			if (!typeObject) {
				return;
			}
			this.chart.showLoading();

			var self = this;
			var dataSources = {};
			var windowUrl = this.model.getWindowUrl();
			var resampleUrl = this.model.getResample();
			var models = this.getElementsFromTypeObject(typeObject);
			
			if (models.length + this.model.get('models').length > this.model.get('maxelementsize')) {
				alert('You can add only no more than: ' + this.model.get('maxelementsize') + ' elements');
				this.chart.hideLoading();
				return;
			}

			var datasources = this.board.datasourceController.getDatasourcesForModels(models);

			$.each(datasources, function(datasourceName, datasource) {
				self.getAllDataForDatasource(datasource, windowUrl, resampleUrl);
			});

			$.when.apply($, self.deffereds).then(function() {
				self.onDataLoaded(typeObject);
				self.deffereds = [];
			}, function() {
				throw new Error('Can\'t get data from ' + url);
			});

		},
		onChangeTimeRange: function() {
			var self = this;
			var dataSources = {};
			var windowUrl = this.model.getWindowUrl();
			var resampleUrl = this.model.getResample();
			var series = this.chart.series;
			var allModels = this.model.get('models');
			var datasources = this.board.datasourceController.getDatasourcesForModels(allModels);

			this.chart.showLoading();
			this.removeExtremesInterval();
			this.stopAddPointEvent();

				$.each(datasources, function(datasourceName, datasource) {
					var models = datasource.sensors;
					var masks = self.model.getMasks(models, true);
					if (!masks)
						return 

					var url = formAdeiUrl(window.host, datasource.server, datasource.dbname, datasource.dbgroup, masks, windowUrl, resampleUrl);
					var elementLength = Object.keys(models).length;

					self.deffereds.push($.ajax({
						type: 'GET',
						url: url,
						dataType: 'text',
						success: function(data) {
							obj = parseCSV(data, masks.length);
							if (!obj) {
								return;
							}
							var data = obj.data;
							var datetime = obj.dateTime;
							if (!data.length || !datetime.length) {
								alert('No data for: ' + url);
								return;
							}
							for (var i = 0; i < elementLength; i++) {
								var model = models[i];
								if (data[i].length > 0) {
									model.setDataModel(data[i], datetime);
									var series = self.chart.get(model.get('id'));
									if (series) {
										series.data = [];
										series.setData(model.get('values'));
									}
								}
							}
						},
						error: function(xhr, ajaxOptions, thrownError) {
							throw new Error('Can\'t get data from ' + url);
						}
					}));
				});

				$.when.apply($, self.deffereds).then(function() {
					self.setExtremesInterval();
					self.chart.hideLoading();
					self.startAddPointEvent();
					self.redraw();

					self.deffereds = [];
				}, function() {
					throw new Error('Can\'t get data from ' + url);
				});
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
			var windowObj = this.model.getWindow();

			var start = parseInt(windowObj.start / 1000);
			var end = parseInt(windowObj.end / 1000);
			var windowUrl = start + "-" + end;
			var srctree = this.model.getSrcTreeLink();

			adeiurl += "#module=graph&db_server=virtual&db_name=srctree&db_group=-3&contro_group=-3&db_mask=all&experiment=-";
			adeiurl += "&window=" + windowUrl;
			adeiurl += "&module=graph&virtual=srctree&srctree=" + srctree;

			return adeiurl;
		}
	});

	return ChartView;
});