define(['jquery', 'underscore', 'backbone', 'views/pres/tabView', 'models/sensorModel', 'models/sensorGroupModel', 'views/widgets/singleSensorView', 'views/widgets/sensorGroupView', 'collections/sensorCollection', 'views/widgets/emptySensorView', 'views/widgets/chartView', 'models/chartModel'], function($, _, Backbone, TabView, Sensor, SensorGroupModel, SingleSensorView, SensorGroupView, SensorCollection, EmptySensorView, ChartView, Chart){
	var editorBoardView = Backbone.View.extend({
		container: $('#tabs'),
		grid: null,
		viewSizeDetector: null,
		curTab: null,
		settings: {
			size: [50, 21],
			blocksize: 50,
			sizecoeff: 2
		},
		sensors: {},
		tabViewLookup: {},
		sensorViewLookup: {},
		tabs: {},
		views: {
			singlesensors: {},
			charts: {},
			sensorgroups: {},
			tables: {}
		},
		cfgObj: "",
		initialize: function(options) {
			var prsObj = "";
			if (options.initdata) {
				prsObj = options.initdata;
			}
			if (prsObj['screen']) {
				this.settings.blocksize = prsObj['screen']['blocksize'] ? prsObj['screen']['blocksize'] : this.settings.blocksize;
				this.settings.size[0] = prsObj['screen']['boardsizex'] ? prsObj['screen']['boardsizex'] : this.settings.size[0];
				this.settings.size[1] = prsObj['screen']['boardsizey'] ? prsObj['screen']['boardsizey'] : this.settings.size[1];
				this.settings['sizecoeff'] = prsObj['screen']['sizecoeff'] ? prsObj['screen']['sizecoeff'] : this.settings.sizecoeff;
			}

			console.log(this.settings['sizecoeff']);
			
			this.detectSizes(this.settings.blocksize, this.settings.size[0], this.settings.size[1], '#banner', '#footer', prsObj['screen']);

			this.insertFromCfg(prsObj);
			this.cfgObj = prsObj;
			console.log('init board view');
		},
		tabOfElementIndex: function(elemId) {
			return this.tabViewLookup[elemId];
		},
		insertFromCfg: function(prsObj) {
			var self = this;
			var singleSensorsToAdd = [];
			var sensorGroupsToAdd = [];
			var sensorTablesToAdd = [];
			var alarmListsToAdd = [];
			var chartsToAdd = [];

			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch(_id) {
					case "datasource": {
						//this.initSettings(attr);
						break;
					}
					case "tabs": {
						this.initTabs(attr);
						break;
					}
					case "elements": {
						for (var _elId in attr) {
							var elObj = attr[_elId];
							var tabId = this.tabOfElementIndex(_elId);
							elObj._id = _elId;
							if (tabId) {
								elObj._tabId = tabId;
							}
							switch (elObj["type"]) {
								case "sensor":
									//singleSensorsToAdd.push(elObj);
									break;
								case "sensortable":
									//sensorTablesToAdd.push(elObj);
									break;
								case "sensorgroup":
									sensorGroupsToAdd.push(elObj);
									break;
								case "alarmlist":
									//alarmListsToAdd.push(elObj);
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

			this.el = $("#tabs");

			if ($.isEmptyObject(this.tabs)) {
				this.establishStyle(this.el);
				var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.maxGridSizesPx.height) / 3.2; 
				this.grid = new kitGrid(this.el);
				this.el.removeClass('canvas')
				.addClass('tab')
				.css('margin-top', marginTop + 'px');
				$('#toggleGridButton').click(function(e) {
					self.grid.toggleGrid();
				});
			}

			//this.addAllSingleSensors(singleSensorsToAdd);
			this.addAllSensorGroups(sensorGroupsToAdd);
			//this.addAllTables(sensorTablesToAdd);
			//this.addAllAlarmLists(alarmListsToAdd);
			this.addAllCharts(chartsToAdd);
		},
		initTabs: function(attr) {
			$('#tabs').append('<ul></ul>');
			for (var tabId in attr) {
				var tabAttr = attr[tabId];
				var links = tabAttr['content'];
				var newTabProperties = {
					name: tabAttr['name'],
					id: tabId,
					can_close: true,
					links: links,
					container: $('#tabs')
				}
				var newTabView = new TabView(newTabProperties);
				this.establishStyle(newTabView.el);
				this.tabs[tabId] = newTabView;
				// initialize tab lookup dictionary
				for (var i = 0; i < links.length; i++) {
					this.tabViewLookup[links[i]] = tabId;
				}
				newTabView.initializeGrid(tabId);
			}
			/* ALL THE SAME STUPID ERROR */
			for (var tabId in this.tabs) {
				var tab = this.tabs[tabId];
				//console.log(tab.grid.getIdOfCanvas());
			}

			$('#tabs').tabs({
				collapsible: true
			}).css('width', this.viewSizeDetector.boardSizePx.width + 5 + 'px')
			.css('margin', '0 auto');
			$('#tabs ul').css('padding', '0px !important')
			.css('height', 50 * this.viewSizeDetector.scale)
			.css('width', this.viewSizeDetector.boardSizePx.width + 'px');
			$('#tabs li').css('height', 40 * this.viewSizeDetector.scale)
			.css('font-size', 24 * this.viewSizeDetector.scale);

			var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.maxGridSizesPx.height) / 5.5; 
			$('#tabs').css('margin-top', marginTop + 'px');

			var self = this;
			$('#toggleGridButton').click(function(e) {
				console.log('toggle: ')
				var id = self.getCurrentTab();
				console.log(id);
				var tab = self.views.tabs[id];
				tab.grid.toggleGrid();
			}).tooltip({});
		},
		establishStyle: function(canvas) {
			canvas.css('height', this.viewSizeDetector.boardSizePx.height + 'px')
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
		getGrid: function(attr) {
			var grid;
			if (this.tabs[attr._tabId]) {
				grid = this.tabs[attr._tabId].grid;
			}
			else {
				grid = this.grid;
			}
			return grid;
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
			//which tab will be there
			var grid = this.getGrid(attr);
			var size = undefined;
			
			//if groups are not from diff sources
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

			size = [this.settings['sizecoeff'], this.settings['sizecoeff']];

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

				if (!size) 
					size = sensorObj["size"];

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
					size: size,
					coords: sensorObj["coords"],
					values: new Array(),
					lastTime: new Date,
					factor: sensorObj["factor"],
					cfgObj: sensorObj
				});

				if (this.sensors[sensorObj["id"]]) {
					throw ("This sensor already exists" + sensorObj["id"]);
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
				var newSensorView = new SingleSensorView({
						model: sensor,
						grid: grid,
						group: false,
						linkModel: linkModel
					});

					if (!sensor.get('norender')) {
						this.sensorViewLookup[sensor.get('id')] = {
							type: 0,
							viewId: sensor.get('id')
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
					if (!size) 
						size = [2, 2];

					var newSensorView = new EmptySensorView({
						model: new Sensor({
							size: size,
						}),
						grid: grid,
						empty: true
					});
					empties.push(newSensorView);
				}
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
				grid: grid,
				group: groupArr,
				empties: empties
			});

			this.views.sensorgroups[attr._id] = newSensorGroupView;
			newSensorGroupModel.on('removing', function() {
				if (this.views) {
					delete this.views.sensorgroups[attr._id];
				}
				
			}, this);
		},
		addChart: function(attr) {
			//which tab will be there
			var grid = this.getGrid(attr);

			var newChart = new Chart({
				id: attr._id,
				caption: attr["caption"],
				charttype: attr["charttype"],
				type: attr["type"],
				link: attr["link"],
				legend: attr["legend"],
				linewidth: attr["linewidth"],
				size: attr["size"],
				coords: attr["coords"],
				puredata: {},
				range: attr["startrange"],
				scale: grid.getScale(),
				cfgObj: attr,
				axislabels: attr['axislabels'],
				resolution: attr['resolution']
			});

			var newChartView = new ChartView({
				model: newChart,
				grid: grid,
				allSensors: this.sensors,
				board: this
			});

			newChart.on('removing', function() {
				if (this.views)
					delete this.views.charts[attr._id];
			}, this);

			//this.elements.charts[attr._id] = newChart;
			this.views.charts[attr._id] = newChartView;
		},
		addAllSensorGroups: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addSensorGroup(attr);
			}
		},
		addAllCharts: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addChart(attr);
			}
		},
		serializeElements: function() {
			var elements = {};
			
			for (var sectionName in this.views) {
				var section = this.views[sectionName];
				for (var elemName in section) {
					var model = section[elemName].model;
					elements[model.get('id')] = model.serialize();
				}
			}

			return elements;
		},
		serialize: function() { //serialize all elements
			var cfg = this.cfgObj;
			var elements = this.serializeElements();
			cfg['elements'] = elements;
			return cfg;
		}
	});

	return editorBoardView;
});