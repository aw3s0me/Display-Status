define(['jquery', 'underscore', 'backbone', 'jqueryui', 'text!templates/pres/board.html', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'models/sensorGroupModel', 'models/alarmListModel', 'views/widgets/singleSensorView', 'views/widgets/doubleSensorView', 'views/widgets/emptySensorView', 'views/widgets/chartView', 'views/widgets/alarmListView', 'views/widgets/sensorGroupView', 'collections/sensorCollection', 'models/sensorTableModel', 'views/widgets/sensorTableView', 'views/widgets/trendSensorView', 'models/trendSensorModel', 'views/pres/tabView'], function($, _, Backbone, ui, boardTemplate, Sensor, Alarm, MyAlarmCollection, Chart, SensorGroupModel, AlarmListModel, SingleSensorView, DoubleSensorView, EmptySensorView, ChartView, AlarmListView, SensorGroupView, SensorCollection, SensorTableModel, SensorTableView, TrendSensorView, TrendSensorModel, TabView) {
	
	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		maxSizeX: 0,
		maxSizeY: 0,
		nowCoordX: 0,
		nowCoordY: 0,
		grid: null,
		viewSizeDetector: null,
		settings: {

		},
		tabs: [],
		sensors: {

		},
		sensorViewLookup: {

		},
		views: {
			singlesensors: {},
			charts: {},
			alarms: {},
			sensorgroups: {},
			tables: {}
		},
		elements: {
			singlesensors: {},
			charts: {},
			alarms: {},
			sensorgroups: {},
			tables: {}
		},
		updSensorsInterval: undefined,
		initialize: function(options) {
			var self = this; //for refering to this in jquery
			var textToParse = options.aceText;
			var myParser = new cfgParser('../static/cfg.json');
			var prsObj = myParser.parseJson(textToParse);
			this.detectSizes(50, 50, 21, '#banner', '#footer', prsObj['screen']);
			
			var data = {};

			if (!options.reinit) {
				var compiledTemplate = _.template(boardTemplate, data);
				this.container.append(compiledTemplate);
			}

			$('#canvasButton').click(function(e) {
				self.submitTest();
			});
			$('#toggleGridButton').click(function(e) {
				self.toggleGrid();
			});

			/* board insertion part */
			this.insertFromCfg(prsObj);
		},
		detectSizes: function(blockSize, xBlocks, yBlocks, bannerId, footerId, options) {
			try {
				this.viewSizeDetector = new sizeDetector(blockSize, xBlocks, yBlocks, bannerId, footerId);
				if (options) {
					if (options.fluid) {
						this.viewSizeDetector.detectSizesForFluidCanvas();
					}
					else {
						this.viewSizeDetector.detectSizesForFixedCanvas();
					}
				}
				else {
					this.viewSizeDetector.detectSizesForFixedCanvas();
				}
				
			} catch (err) {
			 	alert(err.message);
			}
		},
		establishStyle: function(canvas) {
			var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.maxGridSizesPx.height) / 3.4;
			canvas.css('margin-top', marginTop + 'px')
			.css('height', this.viewSizeDetector.boardSizePx.height  + 'px')
			.css('width', this.viewSizeDetector.boardSizePx.width + 'px')
			.data('height', this.viewSizeDetector.boardSizePx.height)
			.data('width', this.viewSizeDetector.boardSizePx.width)
			.data('gridUnitX', this.viewSizeDetector.unitSize)
			.data('gridUnitY', this.viewSizeDetector.unitSize)
			.data('gridSizeX', this.viewSizeDetector.gridSize.width)
			.data('gridSizeY', this.viewSizeDetector.gridSize.height)
			.data('scale', this.viewSizeDetector.scale)
			.data('scaledUnitSize', this.viewSizeDetector.scaledUnitSize);
		},
		toggleGrid: function() {
			var holder = this.el;
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
			var holder = this.el;

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
			var singleSensorsToAdd = [];
			var sensorGroupsToAdd = [];
			var sensorTablesToAdd = [];
			var alarmListsToAdd = [];
			var chartsToAdd = [];

			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch(_id) {
					case "datasource": {
						this.initSettings(attr);
						break;
					}
					case "tabs": {
						this.initTabs(attr);
						break;
					}
					case "elements": {
						for (var _elId in attr) {
							var elObj = attr[_elId];
							elObj._id = _elId;
							switch (elObj["type"]) {
								case "sensor":
									singleSensorsToAdd.push(elObj);
									break;
								case "sensortable":
									sensorTablesToAdd.push(elObj);
									break;
								case "sensorgroup":
									sensorGroupsToAdd.push(elObj);
									break;
								case "alarmlist":
									alarmListsToAdd.push(elObj);
									break;
								case "chart":
									chartsToAdd.push(elObj);
									break;
								default:
									break;
							}
						}
						break;
					}
				}
			}

			if (this.tabs.length === 0) {
				this.el = $("#tabs");
				this.establishStyle(this.el);
				this.grid = new kitGrid("#tabs");
			}

			this.addAllSingleSensors(singleSensorsToAdd);
			this.addAllSensorGroups(sensorGroupsToAdd);
			this.addAllTables(sensorTablesToAdd);
			this.addAllAlarmLists(alarmListsToAdd);
			this.addAllCharts(chartsToAdd);

			var self = this;
			this.updSensorsInterval = setInterval(function() {
				self.updateAllSensors();
			}, 10000); //the only way to pass param */

			self.updateAllSensors();

		},
		reinitWithOptions: function(options) {

			this.updSensorsInterval = window.clearInterval(this.updSensorsInterval);

			var textToParse = options.aceText;
			var myParser = new cfgParser('1');
			var prsObj = myParser.parseJson(textToParse);

			//console.log(prsObj);
			var self = this;

			var newElements = {
				singlesensors: {},
				charts: {},
				alarms: {},
				sensorgroups: {},
				tables: {}
			}

			var newViews = {
				singlesensors: {},
				charts: {},
				alarms: {},
				sensorgroups: {},
				tables: {}
			}

			for (var _id in prsObj) {
				var attr = prsObj[_id];

				switch (attr["type"]) {
					case "sensor":
						var sensorModel = this.elements.singlesensors[_id];
						var sensorView = this.views.singlesensors[_id];
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
							newElements.singlesensors[_id] = sensorModel;
							newViews.singlesensors[_id] = sensorView;
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
							newElements.singlesensors[_id] = newSensor;
							newViews.singlesensors[_id] = newSensorView;
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
		getUidList: function() {

		},
		updateAllSensors: function() {
			var dbname = this.settings['dbname'];
			var dbgroup = this.settings['dbgroup'];
			var server = this.settings['server'];
			var result = undefined;
			var self = this;

			if (dbname && dbgroup && server) {
				var masksToRequest = "";	
				var masks = [];


				for (var sensId in this.sensors) {
					var element = this.sensors[sensId];
					masks.push(element.get('mask'));
				}
				masksToRequest = masks.join();

				try
				{
					//http://katrin.kit.edu/adei/services/getdata.php?db_server=fpd&db_name=katrin_rep&db_group=0&db_mask=102,106,107,108,149,150,103,109,110,111,151,152,74,66,68,99,12,67,69,100,2,3,4,5,6,7,8,9,59,61,75,78,80,82,145,112,113,116,117,118,146,119,120,123,124,125,186,187,188,190,191,192,190,191,192&window=-1
					var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=-1';
					//window.db.httpGetCsv(url, function(data) {
					getDataFromAdei(url, function(data) {
						//var result = window.db.dataHandl.onMessageRecievedCsv(data);
						result = parseCSVForUpdating(data, masks.length);
						var time = moment(result.time[0] * 1000);
						window.lastUpdateTime = time.format('ddd MMM D YYYY HH:mm:ss') + ' GMT' + time.format('Z') + ', ' + time.fromNow();
						$('#lblFromNow').text(window.lastUpdateTime);
						//console.log(result)
						var index = 0;
						for (var sensId in self.sensors) {
							var element = self.sensors[sensId];

							element.updateModel(result.values[index++], time.valueOf());
						}
					})
					

					//window.db.getData(this.settings['server'], this.settings['dbname'], this.settings['dbgroup'], masksToRequest, '-1', 800, 'mean', function(obj)
					//{
						//console.log(obj);
					//})
		
				}
				catch(msg) {
					//console.log(msg)
				}
			}
			else {
				for (var sensId in this.sensors) {
					var element = this.sensors[sensId];
					this.updateSensor(element);
				}
			}

			for (var chartId in this.views.charts) {
				var chartView = this.views.charts[chartId];
				//chartView.redraw();
				//chartView.setExtremes();
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
			this.$el.empty();
		},
		submitTest: function() {
			fncstring = $('#testfunction').val();

			var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
			var args = /\(([^)]+)/.exec(fncstring);

			fncname = fncname[0];
			if (args !== null)
				args = args[1].split(/\s*,\s*/);

			switch (fncname) {
				case "drawText":
					args[4] = /[^'"]+/.exec(args[4]);
					//var e = drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
					break;
				case "drawSensor":
					//var e = drawSensor(args[0], args[1], args[2], args[3]);
					break;
				case "addSensor":
					args[2] = /[^'"]+/.exec(args[2]);
					//var e = addSensor(args[0], args[1], args[2], args[3]);
					break;
				case "updatePage":
					break;
				case "addSensorGroup":
					//addSensorGroup.call($('.canvas'), args[0], args[1], args[2], args[3], args[4]);
					break;
				case "loadCfg":
					this.loadCfg(args[0]);
					break;
				default:
					alert('function "' + fncname + '" not defined');
			}
		},
		loadCfg: function(filename) {
			var self = this;
			var _data = undefined;
			this.sensors = null;
			this.elements = null;

			for (var viewSectionName in this.views) {
				var viewSection = this.views[viewSectionName];
				for (var elemId in viewSection) {
					var view = viewSection[elemId];
					view.removeFromDom();

				}
				viewSection = {};
			} 
			this.views = null;

			$.ajax({
				url: 'static/mainscreen/tempcfg/' + filename.replace('\"', ""),
				async: false,
				dataType: 'text',
				success: function(data) {
					_data = data;
				}
			});

			this.sensors = {};
			this.views = {
				singlesensors: {},
				charts: {},
				alarms: {},
				sensorgroups: {},
				tables: {}
			};
			this.elements = {
				singlesensors: {},
				charts: {},
				alarms: {},
				sensorgroups: {},
				tables: {}
			}

			this.initialize({
				aceText: _data,
				reinit: true
			});
		},
		initSettings: function(attr) {
			if (!attr['dbgroup'] || !attr['dbname'] || !attr['server']) {
				console.log('Please specify fields dbgroup, dbname and server in configuration file');
			} 
			this.settings = attr;
		},
		initTabs: function(attr) {
			var tabs = this.tabs;
			for (var tabId in attr) {
				var tabAttr = attr[tabId];
				var newTabProperties = {
					name: tabAttr['name'],
					id: tabId,
					can_close: true,
					links: tabAttr['content']
				}
				var newTabView = new TabView(newTabProperties);
				tabs.push(newTabView);
			}
		},
		addSingleSensor: function(attr) {
			var newSensor = new Sensor({
				id: attr._id,
				name: attr["name"],
				comment: attr["comment"],
				unit: attr["unit"],
				//value: attr[n],
				sensorviewtype: "single",
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
				lastTime: new Date,
				cfgObj: attr
			});
			//console.log(newSensor);
			var newSensorView = new SensorView({
				model: newSensor,
				grid: this.grid
			});
			this.elements.singlesensors[attr._id] = newSensor;
			this.sensors[attr._id] = newSensor;
			this.views.singlesensors[attr._id] = newSensorView;
		},
		addSensorTable: function(attr) {
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
						sensorviewtype: "table",
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
						this.sensors[sensorInfoObj["id"]] = newSensor;
						newSensor.on('removing', function(){
							if (this.sensors) {
								delete this.sensors[sensorInfoObj["id"]];
							}
						}, this);
					}
				}

				newSensorCollection = new SensorCollection(sensorModelArr, {
					id: attr['sensors'][i]['name'],
					group: attr['sensors'][i]['name']
				});

				collectionGroups.push(newSensorCollection);
			}

			var newSensorTableModel = new SensorTableModel({
				id: attr._id,
				size: attr['size'],
				coords: attr['coords'],
				cols: undefined,
				groups: collectionGroups,
				colids: attr['colids'],
				colnames: attr['colnames'],
				showheaders: attr['showheaders'],
				name: attr['name'],
				render: attr['render'],
				cfgObj: attr
			});

			this.elements.tables[attr._id] = newSensorTableModel;

			var newSensorTableView = new SensorTableView({
				grid: this.grid,
				model: newSensorTableModel
			});

			this.views.tables[attr._id] = newSensorTableView;

			newSensorTableModel.on('removing', function() {
				if (this.elements) {
					this.elements.tables[attr._id] = null;
					this.views.tables[attr._id] = null;
				}
			}, this);
			$(window).trigger('resize'); //because big text works only after resize event
		},
		addChart: function(attr) {
			var newChart = new Chart({
				id: attr._id,
				caption: attr["caption"],
				charttype: attr["charttype"],
				type: attr["type"],
				link: attr["link"],
				legend: attr["legend"],
				linewidth: attr["width"],
				size: attr["size"],
				coords: attr["coords"],
				puredata: {},
				range: attr["startrange"],
				scale: this.grid.getScale(),
				cfgObj: attr,
				axislabels: attr['axislabels'],
				resolution: attr['resolution']
			});

			var newChartView = new ChartView({
				model: newChart,
				grid: this.grid,
				allSensors: this.sensors,
				board: this
			});

			newChart.on('removing', function() {
				if (this.elements) {
					delete this.elements.charts[attr._id];
					delete this.views.charts[attr._id];
				}
			}, this);

			this.elements.charts[attr._id] = newChart;
			this.views.charts[attr._id] = newChartView;
		},
		addSensorGroup: function(attr) {
			var sensorArr = attr['sensors'];
			var trendsArr = [];
			var groupArr = [];
			var sensorModelsArr = [];
			var emptyCount = attr['empties'];
			var dbname = undefined;
			var server = undefined;
			var dbgroup = undefined;

			if (attr['diffgroups']) {
				dbname = attr['dbname'];
				server = attr['server'];
				dbgroup = attr['dbgroup'];
			}
			else {
				dbname = this.settings['dbname'];
				server = this.settings['server'];
				dbgroup = this.settings['dbgroup'];
			}

			for (var i = 0; i < sensorArr.length; i++) {
				var sensorObj = sensorArr[i];

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
					sensorviewtype: "group",
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
					factor: sensorObj["factor"],
					cfgObj: sensorObj
				});

				if (this.sensors[sensorObj["id"]]) {
					throw "This sensor already exists" + sensorObj["id"];
				}

				this.sensors[sensorObj["id"]] = newSensor;

				newSensor.on('removing', function() {
					if (this.sensors) 
						delete this.sensors[newSensor.get('id')];
				}, this);
				sensorModelsArr.push(newSensor);
			}

			for (var sensorName in sensorModelsArr) {
				var sensor = sensorModelsArr[sensorName];
				var linkModel = undefined;
				var newSensorView;

				if (sensor.get('link') !== undefined) {
					linkModel = this.sensors[sensor.get('link')];
					if (!linkModel) {
						throw "Wrong link: " + sensor.get('link') + " at: " + sensor.get('id');
					}
					newSensorView = new DoubleSensorView({
						model: sensor,
						grid: this.grid,
						group: false,
						linkModel: linkModel
					});


					this.sensorViewLookup[linkModel.get('id')] = {
						type: 2,
						viewId: sensor.get('id')
					}
					this.sensorViewLookup[sensor.get('id')] = {
						type: 1,
						viewId: sensor.get('id')
					};
				}
				else {
					newSensorView = new SingleSensorView({
						model: sensor,
						grid: this.grid,
						group: false,
						linkModel: linkModel
					});

					if (!sensor.get('norender')) {
						this.sensorViewLookup[sensor.get('id')] = {
							type: 0,
							viewId: sensor.get('id')
						}
					}
				}

				if (!sensor.get('norender')) {
					//self.views.sensors[sensor.get('id')] = newSensorView;
					groupArr.push(newSensorView);
				}
			}

			var empties = undefined;

			if (emptyCount > 0) {
				empties = [];
				while (emptyCount--) {
					var newSensorView = new EmptySensorView({
						model: new Sensor({}),
						grid: this.grid,
						empty: true
					});
					empties.push(newSensorView);
				}
			}

			for (var trendName in trendsArr) {
				var trendObj = trendsArr[trendName];
				var sensorModelId = trendObj["sensor"];
				var sensorModel = this.sensors[sensorModelId];

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
				id: attr._id,
				name: attr['name'],
				size: attr['size'],
				coords: attr['coords'],
				diffsensors: attr['diffsensors'],
				collection: new SensorCollection(sensorModelsArr),
				cfgObj: attr,
				groupname1: attr["groupname1"],
				groupname2: attr["groupname2"]
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

			this.views.sensorgroups[attr._id] = newSensorGroupView;
			newSensorGroupView.on('removing', function() {
				//delete this.elements.sensorgroups[attr._id];
				if (this.views) {
					delete this.views.sensorgroups[attr._id];
				}
				
			}, this);

			this.elements.sensorgroups[attr._id] = newSensorGroupModel;
			$(window).trigger('resize'); //because big text works only after resize event
		},
		addAlarmList: function(attr) {
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
				id: attr._id,
				collection: newAlarmCollection,
				size: options.size,
				coords: options.coords,
				cols: options.cols,
				type: 'alarmlist',
				cfgObj: attr

			});

			//console.log(newAlarmCollection.id);
			this.elements.alarms[attr._id] = newAlarmListModel;
			var newAlarmListView = new AlarmListView({
				model: newAlarmListModel,
				grid: this.grid,
			});
			this.views.alarms[attr._id] = newAlarmListView;
		},
		//need refactoring
		addAllCharts: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addChart(attr);
			}
		},
		addAllSingleSensors: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addSingleSensor(attr);
			}
		},
		addAllAlarmLists: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addAlarmList(attr);
			}
		},
		addAllSensorGroups: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addSensorGroup(attr);
			}
		},
		addAllTables: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addSensorTable(attr);
			}
		}
	});

	// 'jquery ', 'underscore ', 'backbone ' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});