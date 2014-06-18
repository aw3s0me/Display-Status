define(['jquery', 'underscore', 'backbone', 'views/pres/tabView', 'models/sensorModel', 'models/sensorGroupModel', 'views/widgets/singleSensorView', 'views/widgets/sensorGroupView', 'collections/sensorCollection', 'views/widgets/emptySensorView'], function($, _, Backbone, TabView, Sensor, SensorGroupModel, SingleSensorView, SensorGroupView, SensorCollection, EmptySensorView){
	var editorBoardView = Backbone.View.extend({
		container: $('#tabs'),
		grid: null,
		viewSizeDetector: null,
		curTab: null,
		settings: {

		},
		sensors: {},
		tabViewLookup: {},
		sensorViewLookup: {},
		views: {
			singlesensors: {},
			charts: {},
			sensorgroups: {},
			tables: {},
			tabs: {}
		},
		initialize: function(options) {
			var initCfg = "";
			if (options.initdata) {
				initCfg = options.initdata;
			}
			var blocksize = initCfg['screen'] && initCfg['screen']['blocksize'] ? initCfg['screen']['blocksize']: 50;
			var boardsizex = initCfg['screen'] && initCfg['screen']['boardsizex'] ? initCfg['screen']['boardsizex']: 50;
			var boardsizey = initCfg['screen'] && initCfg['screen']['boardsizey'] ? initCfg['screen']['boardsizey']: 21;
			this.detectSizes(blocksize, boardsizex, boardsizey, '#banner', '#footer', initCfg['screen']);

			this.insertFromCfg(initCfg);
			console.log('init board view');
		},
		tabOfElementIndex: function(elemId) {
			return this.tabViewLookup[elemId];
		},
		insertFromCfg: function(initCfg) {
			var prsObj = JSON.parse(initCfg);
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
									//chartsToAdd.push(elObj);
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

			if ($.isEmptyObject(this.views.tabs)) {
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
			//this.addAllCharts(chartsToAdd);
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
				this.views.tabs[tabId] = newTabView;
				// initialize tab lookup dictionary
				for (var i = 0; i < links.length; i++) {
					this.tabViewLookup[links[i]] = tabId;
				}
				newTabView.initializeGrid(tabId);
			}
			/* ALL THE SAME STUPID ERROR */
			for (var tabId in this.views.tabs) {
				var tab = this.views.tabs[tabId];
				//console.log(tab.grid.getIdOfCanvas());
			}

			console.log(this.views.tabs);
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
			canvas.css('height', this.viewSizeDetector.boardSizePx.height  + 'px')
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
			if (this.views.tabs[attr._tabId]) {
				grid = this.views.tabs[attr._tabId].grid;
			}
			else {
				grid = this.grid;
			}
			return grid;
		},
		addAllSensorGroups: function(arr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addSensorGroup(attr);
			}
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
					var newSensorView = new EmptySensorView({
						model: new Sensor({}),
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
			newSensorGroupView.on('removing', function() {
				//delete this.elements.sensorgroups[attr._id];
				if (this.views) {
					delete this.views.sensorgroups[attr._id];
				}
				
			}, this);
		},
		serialize: function() {
			
		}
	});

	return editorBoardView;
});