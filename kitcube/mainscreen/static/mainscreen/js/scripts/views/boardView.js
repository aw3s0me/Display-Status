define(['jquery', 'underscore', 'backbone', 'jqueryui', 'jquerysort', 'jqgrid', 'highcharts', 'text!templates/board.html', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'models/sensorGroupModel','models/alarmListModel', 'text!templates/sensor.html', 'views/sensorView', 'views/chartView', 'views/alarmListView', 'views/sensorGroupView', 'collections/sensorCollection', 'models/sensorTableModel', 'views/sensorTableView', 'views/trendSensorView','models/trendSensorModel'], function($, _, Backbone, ui, Sortable, jqGrid, _Highcharts, boardTemplate, Sensor, Alarm, MyAlarmCollection, Chart, SensorGroupModel, AlarmListModel, sensorTemplate, SensorView, ChartView, AlarmListView, SensorGroupView, SensorCollection, SensorTableModel, SensorTableView, TrendSensorView, TrendSensorModel) {
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
			alarms: {},
			sensorgroups: {},
			tables: {}
		},
		elements: {
			sensors: {},
			charts: {},
			alarms: {},
			sensorgroups: {},
			tables: {}
		},
		updSensorsInterval: undefined,
		initialize: function(options) {
			var self = this; //for refering to this in jquery
			try {
				this.viewSizeDetector = new sizeDetector(50, 32, 18, '#banner', '#footer');
				this.viewSizeDetector.detectAllSizes();
			}
			catch (err) {
				alert(err.message);
			}
			

			var data = {};
			var compiledTemplate = _.template(boardTemplate, data);
			this.container.append(compiledTemplate);
			$('.canvas').attr("id", "tab1");

			var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.boardSizePx.height) / 2;
			$('.canvas').css('margin-top', marginTop + 'px');
			$('.canvas').css('height', this.viewSizeDetector.boardSizePx.height + 'px');
			$('.canvas').css('width', this.viewSizeDetector.boardSizePx.width + 'px');
			$('.canvas').data('height', this.viewSizeDetector.boardSizePx.height);
			$('.canvas').data('width', this.viewSizeDetector.boardSizePx.width);

			$('.canvas').data('gridUnitX', this.viewSizeDetector.unitSize);
			$('.canvas').data('gridUnitY', this.viewSizeDetector.unitSize);
			$('.canvas').data('gridSizeX', this.viewSizeDetector.gridSize.width);
			$('.canvas').data('gridSizeY', this.viewSizeDetector.gridSize.height);
			$('.canvas').data('scale', this.viewSizeDetector.scale);
			$('.canvas').data('scaledUnitSize', this.viewSizeDetector.scaledUnitSize);

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
			e.style.left = px * holder.data('scaledUnitSize') + 'px';
			e.style.top = py * holder.data('scaledUnitSize') + 'px';
			e.style.width = dx * holder.data('scaledUnitSize') + 'px';
			e.style.height = dy * holder.data('scaledUnitSize') + 'px';

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
							sensorviewtype : "single",
							max: attr["max"],
							min: attr["min"],
							precision: attr["precision"],
							exp: attr["exp"],
							server: attr["server"],
							device: attr["device"],
							dbname: attr["dbname"],
							dbgroup: attr["dbgroup"],
							mask: attr["mask"],
							size: attr["size"],
							coords: attr["coords"],
							values: new Array(),
							lastTime: new Date
						});
						//console.log(newSensor);
						var newSensorView = new SensorView({
							model: newSensor,
							grid: this.grid
						});
						self.elements.sensors[_id] = newSensor;
						self.views.sensors[_id] = newSensorView;
						break;
					case "sensortable":
						var sensorgroups = attr['sensors'];
						var collectionGroups = [];
						var dbname = attr['dbname'];
						var server = attr['server'];
						var dbgroup = attr['dbgroup'];

						for (var i = 0; i < sensorgroups.length; i++) {
							var sensors = sensorgroups[i]['sensors'];

							var newSensorCollection = undefined;
							var sensorModelArr = [];
							
							for (var j = 0; j < sensors.length; j++) {
								var sensorInfoObj = sensors[j];

								if (attr["diffsensors"]) {
									dbname = sensorInfoObj["dbname"];
									server = sensorInfoObj["server"];
									dbgroup = sensorInfoObj["dbgroup"];

								}
								var newSensor = new Sensor({
									id: sensorInfoObj["id"],
									name: sensorInfoObj["name"],
									unit: sensorInfoObj["unit"],
									max: sensorInfoObj["max"],
									min: sensorInfoObj["min"],
									sensorviewtype : "table",
									sensortype: sensorInfoObj["sensortype"],
									precision: sensorInfoObj["precision"],
									exp: sensorInfoObj["exp"],
									sibling: sensorInfoObj["sibling"],
									server: server,
									dbname: dbname,
									dbgroup: dbgroup,
									mask: sensorInfoObj["mask"],
									values: new Array(),
									lastTime: new Date
								});
								if (sensorInfoObj["id"] !== undefined) {
									sensorModelArr.push(newSensor);
									self.elements.sensors[sensorInfoObj["id"]] = newSensor;
								}
								
							}

							newSensorCollection = new SensorCollection(sensorModelArr, {
								id: attr['sensors'][i]['name'],
								group: attr['sensors'][i]['name']
							});

							collectionGroups.push(newSensorCollection);
						}

						var newSensorTableModel = new SensorTableModel({
							id: _id,
							size: attr['size'],
							coords: attr['coords'],
							cols: undefined,
							groups: collectionGroups,
							colids: attr['colids'],
							colnames: attr['colnames'],
							showheaders: attr['showheaders'],
							name: attr['name'],
							render: attr['render']
						});

						var newSensorTableView = new SensorTableView({
							grid: this.grid,
							model: newSensorTableModel

						});

						$(window).trigger('resize'); //because big text works only after resize event
						break;
					case "sensorgroup":
						var sensorArr = attr['sensors'];
						var trendsArr = [];
						var groupArr = [];
						var sensorModelsArr = [];
						var emptyCount = attr['empties'];

						var dbname = attr['dbname'];
						var server = attr['server'];
						var dbgroup = attr['dbgroup'];

						for (var i = 0 ; i < sensorArr.length; i++) {
							var sensorObj = sensorArr[i];

							if (sensorObj['type'] === 'empty') {
								var newSensor = new Sensor({});

								continue;
							}

							if (attr['diffsensors']) {
								dbname = sensorObj['dbname'];
								server = sensorObj['server'];
								dbgroup = sensorObj['dbgroup'];
							}

							if (sensorObj['type'] === "trend") {
								trendsArr.push(sensorObj);
								continue;
							}

							var newSensor = new Sensor({
								id: sensorObj["id"],
								name: sensorObj["name"],
								comment: sensorObj["comment"],
								sensortype: sensorObj["sensortype"],
								link: sensorObj["link"],
								sensorviewtype : "group",
								unit: sensorObj["unit"],
								max: sensorObj["max"],
								min: sensorObj["min"],
								precision: sensorObj["precision"],
								exp: sensorObj["exp"],
								server: server,
								device: sensorObj["device"],
								norender: sensorObj["norender"],
								dbname: dbname,
								dbgroup: dbgroup,
								mask: sensorObj["mask"],
								size: sensorObj["size"],
								coords: sensorObj["coords"],
								values: new Array(),
								lastTime: new Date,
								factor: sensorObj["factor"]
							});

							self.elements.sensors[sensorObj["id"]] = newSensor;
							sensorModelsArr.push(newSensor);
						}

						for (var sensorName in sensorModelsArr) {
							var sensor = sensorModelsArr[sensorName];
							var linkModel = undefined;

							if (sensor.get('link') !== undefined) {
								linkModel = self.elements.sensors[sensor.get('link')];
								if (!linkModel) {
									throw "Wrong link: " + sensor.get('link') + " at: " + sensor.get('id');
								}
							}

							var newSensorView = new SensorView({
								model: sensor,
								grid: this.grid,
								group: true,
								linkModel: linkModel
							});

							if (!sensor.get('norender')) {
								self.views.sensors[sensor.get('id')] = newSensorView;
								groupArr.push(newSensorView);
							}
						}

						var empties = undefined;

						if (emptyCount > 0) {
							empties = [];
							while(emptyCount--) {
								var newSensorView = new SensorView({
									model: new Sensor(),
									grid: this.grid,
									empty: true
								});
								empties.push(newSensorView);
							}
						}


						for (var trendName in trendsArr) {
							var trendObj = trendsArr[trendName];
							var sensorModelId = trendObj["sensor"];
							var sensorModel = self.elements.sensors[sensorModelId];

							if (!sensorModel) {
								throw "Sensor of trend: " + trendObj["id"] + " is not defined";
							}

							var trendModel = new TrendSensorModel({
								model: sensorModel,
								range: trendObj["range"],
								name: trendObj["name"],
								id: trendObj["id"]
							})
							

							var newTrendSensorView = new TrendSensorView({
								model: trendModel,
								group: true,
								grid: this.grid
							});

							groupArr.push(newTrendSensorView);
						}

						var newSensorGroupModel = new SensorGroupModel({
							id: _id,
							name: attr['name'],
							size: attr['size'],
							coords: attr['coords'],
							diffsensors: attr['diffsensors'],
							collection: new SensorCollection(sensorModelsArr)
						});

						if (attr['diffsensors'] === false) {
							newSensorGroupModel.set({
								dbname: attr['dbname'],
								dbgroup: attr['dbgroup'],
								server: attr['server']
							});
						}

						var newSensorGroupView = new SensorGroupView({
							model: newSensorGroupModel,
							grid: this.grid,
							group: groupArr,
							empties: empties
						});

						self.views.sensorgroups[_id] = newSensorGroupView;
						self.elements.sensorgroups[_id] = newSensorGroupModel;
						$(window).trigger('resize'); //because big text works only after resize event
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
						var sensCollection = new SensorCollection(sensArr);
						var newChartView = new ChartView({
							model: newChart,
							grid: this.grid,
							elements: sensCollection,
							allSensors: this.elements.sensors
						});
						this.elements.charts[_id] = newChart;
						this.views.charts[_id] = newChartView;

						break;
					default:
						break;
				}
			}
			//self.updateAllSensors();
			this.updSensorsInterval = setInterval(function() {
				self.updateAllSensors();
			}, 2000); //the only way to pass param */
		},
		reinitWithOptions: function(options) {
			//var PriorityQueue = require('queue');

			//var renderQueue = new PriorityQueue(function(a, b) {return a.priority - b.priority;});


			this.updSensorsInterval = window.clearInterval(this.updSensorsInterval);

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
								dbgroup: attr["dbgroup"],
								mask: attr["mask"],
								size: attr["size"],
								coords: attr["coords"],
								values: new Array(),
								lastTime: new Date,
								value: undefined
							});
							sensorView.rerender();
							newElements.sensors[_id] = sensorModel;
							newViews.sensors[_id] = sensorView;
							//queue.enq({sensorView.rerender});
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
								dbgroup: attr["dbgroup"],
								mask: attr["mask"],
								size: attr["size"],
								coords: attr["coords"],
								values: new Array(),
								lastTime: new Date
							});
							var newSensorView = new SensorView({
								model: newSensor,
								grid: this.grid
							});
							newElements.sensors[_id] = newSensor;
							newViews.sensors[_id] = newSensorView;
						}
						break;
					case "sensorlist":
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
							alarmListView.rerender();
							newElements.alarms[_id] = alarmListModel;
							newViews.alarms[_id] = alarmListView;
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

							//console.log(newAlarmCollection.id);

							var newAlarmListView = new AlarmListView({
								model: newAlarmListModel,
								grid: this.grid,
							});
							newElements.alarms[_id] = newAlarmListModel;
							newViews.alarms[_id] = newAlarmListView;
						}
						break;
					case "chart":
						var chartModel = this.elements.charts[_id];
						var chartView = this.views.charts[_id];
						//console.log(chartModel, chartView);
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

							if (chartModel.get('link')) {
								var linkArr = chartModel.get('link');
								var sensArr = [];
								for (var j = 0; j < linkArr.length; j++) {
									var linkId = linkArr[j];
									var sensorModel = newElements.sensors[linkId];
									if (sensorModel)
										sensArr.push(sensorModel);
								}
							}
							var sensCollection = new SensorCollection(sensArr);

							chartView.elements = sensCollection;

							chartView.rerender();
							newElements.charts[_id] = chartModel;
							newViews.charts[_id] = chartView;
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
							var sensCollection = new SensorCollection(sensArr);
							var newChartView = new ChartView({
								model: newChart,
								grid: this.grid,
								elements: sensCollection
							});
							newElements.charts[_id] = newChart;
							newViews.charts[_id] = newChartView;
						}
						break;
					default:
						break;
				}
				// If Models doesn 't exist - DELETE
				//this.updSensorsInterval = setInterval(function() {self.updateAllSensors();}, 5000);
			}

			for (var grpId in this.elements) {
				var group = this.elements[grpId];
				var newGroup = newElements[grpId];
				if (group === undefined) {
					continue;
				} else {
					for (var elemId in group) {
						var element = newGroup[elemId];
						if (!element) {
							delete(group[elemId]);
							//console.log('deleted' + elemId);
						}

					}
				}
			}

			this.elements = newElements;

			for (var grpId in this.views) {
				var group = this.views[grpId];
				var newGroup = newViews[grpId];
				if (group === undefined) {
					continue;
				} else {
					for (var viewId in group) {
						var view = newGroup[viewId];
						if (!view) {
							var viewToDelete = group[viewId];
							viewToDelete.removeFromDom();

							delete(group[viewId]);
							//console.log('deleted' + viewId);
						}
					}
				}
			}

			this.views = newViews;

			this.updSensorsInterval = setInterval(function() {
				self.updateAllSensors();
			}, 2000);
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
			serializeRes = JSON.stringify(newJson, null, '\t ');
			return serializeRes;

		},
		updateAllSensors: function() {
			for (var sensId in this.elements.sensors) {
				var element = this.elements.sensors[sensId];
				this.updateSensor(element);
			}
			
			for (var chartId in this.views.charts) {
				var chartView = this.views.charts[chartId];
				chartView.redraw();
			}

			$(window).trigger('resize'); //because big text works only after resize event
		},
		updateSensor: function(sensorModel) {
			sensorModel.updateModel();

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