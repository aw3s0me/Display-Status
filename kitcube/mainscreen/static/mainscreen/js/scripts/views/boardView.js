define(['jquery', 'underscore', 'backbone', 'jqueryui', 'jqgrid', 'highcharts', 'text!templates/board.html', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'models/alarmListModel', 'text!templates/sensor.html', 'views/sensorView', 'views/chartView', 'views/alarmListView', 'collections/sensorGroupCollection'], function($, _, Backbone, ui, jqGrid, _Highcharts, boardTemplate, Sensor, Alarm, MyAlarmCollection, Chart, AlarmListModel, sensorTemplate, SensorView, ChartView, AlarmListView, SensorGroupCollection) {
	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		elContainer: undefined,
		maxSizeX: 0,
		maxSizeY: 0,
		nowCoordX: 0,
		nowCoordY: 0,
		grid: null,
		viewSizeDetector: null,
		tabs: [],
		views: {
			sensors: {},
			charts: {},
			alarms: {}
		},
		elements: {
			sensors: {},
			charts: {},
			alarms: {}
		},
		initialize: function(options) {
			var self = this; //for refering to this in jquery
			this.viewSizeDetector = new sizeDetector(50, 50, '#banner', '#footer');
			this.viewSizeDetector.detectBannerSize();
			this.viewSizeDetector.detectFooterSize();
			this.viewSizeDetector.detectBoardSize();

			var data = {};
			var compiledTemplate = _.template(boardTemplate, data);
			this.container.append(compiledTemplate);
			$('.canvas').attr("id", "tab1");

			var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizeMax.height) / 2;
			$('.canvas').css('margin-top', marginTop + 'px');
			$('.canvas').css('height', this.viewSizeDetector.boardSizeMax.height + 'px');
			$('.canvas').css('width', this.viewSizeDetector.boardSizeMax.width + 'px');
			$('.canvas').data('height', this.viewSizeDetector.boardSizeMax.height);
			$('.canvas').data('width', this.viewSizeDetector.boardSizeMax.width);
			$('.canvas').data('height-fullscreen', this.viewSizeDetector.boardSizeFullscreen.height);
			$('.canvas').data('width-fullscreen', this.viewSizeDetector.boardSizeFullscreen.width);

			$('.canvas').data('gridUnitX', this.viewSizeDetector.unitSize.width);
			$('.canvas').data('gridUnitY', this.viewSizeDetector.unitSize.height);
			$('.canvas').data('gridSizeX', this.viewSizeDetector.gridSize.width);
			$('.canvas').data('gridSizeY', this.viewSizeDetector.gridSize.height);
			$('.canvas').data('scale', this.viewSizeDetector.scale);

			this.grid = new kitGrid("#tab1");
			this.elContainer = $("#tab1");
			$('#canvasButton').click(function(e) {
				self.submitTest();
			});
			$('#toggleGridButton').click(function(e) {
				self.toggleGrid();
			});

			/* board insertion part */
			var textToParse = options.aceText;
			var myParser = new cfgParser('1');
			var prsObj = myParser.parseJson(textToParse);
			this.insertFromCfg(prsObj);
		},
		toggleGrid: function() {
			var holder = $("#tab1");
			var attr = holder.attr('grid');

			if (typeof attr !== 'undefined' && attr !== false) {
				holder.children('.grid').remove();
				holder.removeAttr('grid');
				return;
			}

			holder.attr('grid', 'grid');

			for (var i = 0; i < holder.data('gridSizeX'); i++)
				for (var j = 0; j < holder.data('gridSizeY'); j++) {
					var e = this.newWidget(1, 1, i, j);
					e.className = 'grid';
					holder.append(e.outerHTML);
				}
			return;
		},
		newWidget: function(dx, dy, px, py, scale) {
			var e = document.createElement('div');
			var holder = $('#tab1');

			scale = typeof scale !== 'undefined' ? scale : holder.data('scale');
			e.dataset.scale = scale;

			e.className = 'tile';
			e.style.left = px * holder.data('gridUnitX') * scale + 'px';
			e.style.top = py * holder.data('gridUnitY') * scale + 'px';
			e.style.width = dx * holder.data('gridUnitX') * scale + 'px';
			e.style.height = dy * holder.data('gridUnitY') * scale + 'px';

			return e;
		},
		insertFromCfg: function(prsObj) {
			var self = this;
			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch (attr["type"]) {
					case "sensor":
						var newSensor = new Sensor({
							id: _id,
							name: attr["name"],
							comment: attr["comment"],
							unit: attr["unit"],
							//value: attr[n],
							max: attr["max"],
							min: attr["min"],
							server: attr["server"],
							device: attr["device"],
							dbname: attr["dbname"],
							dbgroup: attr["group"],
							mask: attr["mask"],
							size: attr["size"],
							coords: attr["coords"]
						});
						//console.log(newSensor);
						var newSensorView = new SensorView({
							model: newSensor,
							grid: this.grid
						});
						self.elements.sensors[_id] = newSensor;
						self.views.sensors[_id] = newSensorView;
						break;
					case "alarmlist":
						var alarmList = []; //collection of alarms

						var options = {
							size: [],
							coords: [],
							cols: undefined
						};
						for (var alarmKey in attr) { //going from alarmlist object through elems
							//console.log(alarmKey);
							if (alarmKey === "type") { //except type
								continue;
							} else if (alarmKey === "size") {
								options.size.push(attr[alarmKey][0]);
								options.size.push(attr[alarmKey][1]);
								continue;
							} else if (alarmKey === "coords") {
								options.coords.push(attr[alarmKey][0]);
								options.coords.push(attr[alarmKey][1]);
								continue;
							} else if (alarmKey === "cols") {
								options.cols = attr[alarmKey];
								continue;
							}
							var alarmAttr = attr[alarmKey]; //get alarm element by key
							var newAlarm = new Alarm({
								id: alarmKey,
								no: alarmAttr["no"],
								module: alarmAttr["module"],
								group: alarmAttr["group"],
								app: alarmAttr["app"],
								server: alarmAttr["server"],
								dbname: alarmAttr["dbname"],
								mask: alarmAttr["mask"],
								lastDate: 'NAN', //not initialized, need to get from adei
								delayedBy: 'NAN',
								severity: 'NAN'
							});

							alarmList.push(newAlarm); //push to collection
						};

						var newAlarmCollection = new MyAlarmCollection(alarmList);
						var newAlarmListModel = new AlarmListModel({
							id: _id,
							collection: newAlarmCollection,
							size: options.size,
							coords: options.coords,
							cols: options.cols,
							type: 'alarmlist'

						});

						console.log(newAlarmListModel);
						//console.log(newAlarmCollection.id);
						this.elements.alarms[_id] = newAlarmListModel;
						var newAlarmListView = new AlarmListView({
							model: newAlarmListModel,
							grid: this.grid,
						});
						this.views.alarms[_id] = newAlarmListView;
						break;
					case "chart":
						var newChart = new Chart({
							id: _id,
							caption: attr["caption"],
							charttype: attr["charttype"],
							type: attr["type"],
							link: attr["link"],
							legend: attr["legend"],
							linewidth: attr["width"],
							size: attr["size"],
							coords: attr["coords"],
							puredata: {}
						});

						if (newChart.get('link')) {
							var linkArr = newChart.get('link');
							var sensArr = [];
							for (var j = 0; j < linkArr.length; j++) {
								var linkId = linkArr[j];
								var sensorModel = this.elements.sensors[linkId];
								if (sensorModel)
									sensArr.push(sensorModel);
							}
						}
						var sensCollection = new SensorGroupCollection(sensArr);
						var newChartView = new ChartView({
							model: newChart,
							grid: this.grid,
							elements: sensCollection
						});
						this.elements.charts[_id] = newChart;
						this.views.charts[_id] = newChartView;

						break;
					default:
						break;
				}
			}

			setInterval(function() {
				self.updateAllSensors();
			}, 5000); //the only way to pass param */
		},
		reinitWithOptions: function(options) {

			var textToParse = options.aceText;
			var myParser = new cfgParser('1');
			var prsObj = myParser.parseJson(textToParse);
			//console.log(prsObj);
			var self = this;

			var newElements = {
				sensors: {},
				alarms: {},
				charts: {}
			}

			var newViews = {
				sensors: {},
				alarms: {},
				charts: {}
			}

			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch (attr["type"]) {
					case "sensor":
						var sensorModel = this.elements.sensors[_id];
						var sensorView = this.views.sensors[_id];
						if (sensorModel && sensorView) {
							sensorModel.set({
								id: _id,
								name: attr["name"],
								comment: attr["comment"],
								unit: attr["unit"],
								max: attr["max"],
								min: attr["min"],
								server: attr["server"],
								device: attr["device"],
								dbname: attr["dbname"],
								dbgroup: attr["group"],
								mask: attr["mask"],
								size: attr["size"],
								coords: attr["coords"]
							});
							sensorView.rerender();
							//newElements.sensors[_id] = sensorModel;
							//newViews.sensors[_id] = sensorView;
						} else {
							var newSensor = new Sensor({
								id: _id,
								name: attr["name"],
								comment: attr["comment"],
								unit: attr["unit"],
								//value: attr[n],
								max: attr["max"],
								min: attr["min"],
								server: attr["server"],
								device: attr["device"],
								dbname: attr["dbname"],
								dbgroup: attr["group"],
								mask: attr["mask"],
								size: attr["size"],
								coords: attr["coords"]
							});
							var newSensorView = new SensorView({
								model: newSensor,
								grid: this.grid
							});
							//newElements.sensors[_id] = sensorModel;
							//newViews.sensors[_id] = sensorView;
						}
						break;
					case "alarmlist":
						var alarmListModel = this.elements.alarms[_id];
						var alarmListView = this.views.alarms[_id];

						if (alarmListModel && alarmListView) {
							var alarmList = []; //collection of alarms

							var options = {
								id: _id,
								type: "alarmlist",
								size: [],
								coords: [],
								cols: undefined
							};

							for (var alarmKey in attr) { //going from alarmlist object through elems
								if (alarmKey === "type") { //except type
									continue;
								} else if (alarmKey === "size") {
									options.size.push(attr[alarmKey][0]);
									options.size.push(attr[alarmKey][1]);
									continue;
								} else if (alarmKey === "coords") {
									options.coords.push(attr[alarmKey][0]);
									options.coords.push(attr[alarmKey][1]);
									continue;
								} else if (alarmKey === "cols") {
									options.cols = attr[alarmKey];
									continue;
								}
								var alarmAttr = attr[alarmKey]; //get alarm element by key
								var newAlarm = new Alarm({
									id: alarmKey,
									no: alarmAttr["no"],
									module: alarmAttr["module"],
									group: alarmAttr["group"],
									app: alarmAttr["app"],
									server: alarmAttr["server"],
									dbname: alarmAttr["dbname"],
									mask: alarmAttr["mask"],
									lastDate: 'NAN', //not initialized, need to get from adei
									delayedBy: 'NAN',
									severity: 'NAN'
								});

								alarmList.push(newAlarm); //push to collection
							};

							var newAlarmCollection = new MyAlarmCollection(alarmList);
							//this.elements.alarms[_id] = AlarmListModel;

							alarmListModel.set({
								id: _id,
								type: "alarmlist",
								size: options.size,
								coords: options.coords,
								cols: options.cols,
								collection: newAlarmCollection
							});

							//this.views.alarms[_id] = newAlarmList;
							//newElements.alarms[_id] = newAlarmListModel;
							console.log('start rerender');
							alarmListView.rerender();
							//newViews.alarms[_id] = newAlarmList;
						} else {
							var alarmList = []; //collection of alarms

							var options = {
								size: [],
								coords: [],
								cols: undefined
							};
							for (var alarmKey in attr) { //going from alarmlist object through elems
								//console.log(alarmKey);
								if (alarmKey === "type") { //except type
									continue;
								} else if (alarmKey === "size") {
									options.size.push(attr[alarmKey][0]);
									options.size.push(attr[alarmKey][1]);
									continue;
								} else if (alarmKey === "coords") {
									options.coords.push(attr[alarmKey][0]);
									options.coords.push(attr[alarmKey][1]);
									continue;
								} else if (alarmKey === "cols") {
									options.cols = attr[alarmKey];
									continue;
								}
								var alarmAttr = attr[alarmKey]; //get alarm element by key
								var newAlarm = new Alarm({
									id: alarmKey,
									no: alarmAttr["no"],
									module: alarmAttr["module"],
									group: alarmAttr["group"],
									app: alarmAttr["app"],
									server: alarmAttr["server"],
									dbname: alarmAttr["dbname"],
									mask: alarmAttr["mask"],
									lastDate: 'NAN', //not initialized, need to get from adei
									delayedBy: 'NAN',
									severity: 'NAN'
								});

								alarmList.push(newAlarm); //push to collection
							};

							var newAlarmCollection = new MyAlarmCollection(alarmList);
							var newAlarmListModel = new AlarmListModel({
								id: _id,
								collection: newAlarmCollection,
								size: options.size,
								coords: options.coords,
								cols: options.cols,
								type: 'alarmlist'

							});

							console.log(newAlarmListModel);
							//console.log(newAlarmCollection.id);
							newElements.alarms[_id] = newAlarmListModel;
							var newAlarmListView = new AlarmListView({
								model: newAlarmListModel,
								grid: this.grid,
							});
							newViews.alarms[_id] = newAlarmListView;
						}
						break;
					case "chart":
						var chartModel = this.elements.charts[_id];
						var chartView = this.views.charts[_id];
						console.log(chartModel, chartView);
						if (chartModel && chartView) {
							chartModel.set({
								id: _id,
								caption: attr["caption"],
								charttype: attr["charttype"],
								type: attr["type"],
								link: attr["link"],
								legend: attr["legend"],
								linewidth: attr["width"],
								size: attr["size"],
								coords: attr["coords"],
								puredata: {}
							});

							chartView.rerender();
							//newElements.charts[_id] = chartModel;
							//newViews.charts[_id] = chartView;
						} else {
							var newChart = new Chart({
								id: _id,
								caption: attr["caption"],
								charttype: attr["charttype"],
								type: attr["type"],
								link: attr["link"],
								legend: attr["legend"],
								linewidth: attr["width"],
								size: attr["size"],
								coords: attr["coords"],
								puredata: {}
							});

							if (newChart.get('link')) {
								var linkArr = newChart.get('link');
								var sensArr = [];
								for (var j = 0; j < linkArr.length; j++) {
									var linkId = linkArr[j];
									var sensorModel = this.elements.sensors[linkId];
									if (sensorModel)
										sensArr.push(sensorModel);
								}
							}
							var sensCollection = new SensorGroupCollection(sensArr);
							var newChartView = new ChartView({
								model: newChart,
								grid: this.grid,
								elements: sensCollection
							});
							//newElements.charts[_id] = newChart;
							//newViews.charts[_id] = newChartView;
						}

						break;
					default:
						break;
				}
				// If Models doesn 't exist - DELETE
				//this.elements = newElements;
				//this.views = newViews;

			}
		},
		serializeToJson: function() {
			var newJson = {};
			var serializeRes = undefined;
			for (var elementId in this.elements) {
				var element = this.elements[elementId];
				for (var innerElId in element) {
					var inElem = element[innerElId];
					if (!inElem.serToJSON) {
						newJson[inElem.model.get('id')] = inElem.model.serToJSON();
					} else {
						var modelToSave = inElem.clone();
						newJson[inElem.get('id')] = inElem.serToJSON();
					}
				}
			}
			//console.log(newJson);
			serializeRes = JSON.stringify(newJson, null, '\t ');
			//console.log(serializeRes);
			return serializeRes;

		},
		updateAllSensors: function() {
			for (var sensId in this.elements.sensors) {
				this.updateSensor(this.elements.sensors[sensId]);
			}
			//console.log("charts");
			//this.updateAllCharts();
		},
		updateSensor: function(sensorModel) {
			var data = {};
			var sensorId = sensorModel.get('id');

			var sensor = $('#' + sensorId);
			$.get(sensorModel.getDbUrl(), function(data) {
				var arrayOfData = data.split(',');
				var value = parseFloat(
					arrayOfData[arrayOfData.length - 1]);
				var sensorDiv = sensor.find(".sensorVal")[0];
				sensorDiv.innerHTML = value.toFixed(1);
				var now = new Date;
				var lastTime = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
				sensorModel.set({
					'value': value,
					'lastTime': lastTime
				});

			});

		},
		alert: function(e) {
			console.log(e);
		},
		render: function() {

		},
		resize: function(x, y) {

		},
		change: function(NumX, NumY) {},
		clear: function() {
			/*this.container.empty();
			this.maxSizeX = 0;
			this.maxSizeY = 0;
			this.nowCoordX = 0;
			this.nowCoordY = 0;
			this.grid = null;
			this.viewSizeDetector = null;
			this.elements.charts = {};
			this.elements.alarms = {};
			this.tabs = [];
			this.elements.sensors = {};
			for (var chartId in this.elements.charts) {
				var chart = this.elements.charts[chartId].chart;
				for (var i = 0; i < chart.series.length; i++) {
					chart.series[i].setData([]);
				}
			}*/


		}
	});

	// 'jquery ', 'underscore ', 'backbone ' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});