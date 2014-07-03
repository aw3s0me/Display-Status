define(['jquery', 'underscore', 'backbone', 'jqueryui', 'text!templates/pres/board.html', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'models/sensorGroupModel', 'models/alarmListModel', 'views/widgets/singleSensorView', 'views/widgets/doubleSensorView', 'views/widgets/emptySensorView', 'views/widgets/chartView', 'views/widgets/alarmListView', 'views/widgets/sensorGroupView', 'collections/sensorCollection', 'models/sensorTableModel', 'views/widgets/sensorJqGridTableView', 'views/widgets/sensorCustomTableView', 'views/widgets/trendSensorView', 'models/trendSensorModel', 'views/pres/tabView'], function($, _, Backbone, ui, boardTemplate, Sensor, Alarm, MyAlarmCollection, Chart, SensorGroupModel, AlarmListModel, SingleSensorView, DoubleSensorView, EmptySensorView, ChartView, AlarmListView, SensorGroupView, SensorCollection, SensorTableModel, SensorJqGridTableView, SensorCustomTableView, TrendSensorView, TrendSensorModel, TabView) {

	var BoardView = Backbone.View.extend({
		container: $('#board-container'),
		el: undefined,
		grid: null,
		viewSizeDetector: null,
		curTab: null,
		settings: {
			size: [50, 21],
			blocksize: 50,
			sizecoeff: 2
		},
		axes: { //structure like

		},
		sensors: {

		},
		sensorViewLookup: { //lookup for initializing chart

		},
		tabViewLookup: { //dictionary for tabs

		},
		views: {
			singlesensors: {},
			charts: {},
			alarms: {},
			sensorgroups: {},
			tables: {},
			tabs: {}
		},
		elements: { //models
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
			//var myParser = new cfgParser('../static/cfg.json');
			//var prsObj = myParser.parseJson(textToParse);
			prsObj = textToParse;

			if (prsObj['screen']['nofooter']) {
				$('#banner').css('height', '0');
			}

			if (prsObj['screen']['nobanner']) {
				$('#footer').css('height', '0');
			}

			if (prsObj['screen']) {
				this.settings.blocksize = prsObj['screen']['blocksize'] ? prsObj['screen']['blocksize'] : this.settings.blocksize;
				this.settings.size[0] = prsObj['screen']['boardsize'][0] ? prsObj['screen']['boardsize'][0] : this.settings.size[0];
				this.settings.size[1] = prsObj['screen']['boardsize'][1] ? prsObj['screen']['boardsize'][1] : this.settings.size[1];
				this.settings['sizecoeff'] = prsObj['screen']['sizecoeff'] ? prsObj['screen']['sizecoeff'] : this.settings.sizecoeff;
			}
			
			this.detectSizes(this.settings.blocksize, this.settings.size[0], this.settings.size[1], '#banner', '#footer', prsObj['screen']);

			var data = {};

			//if (!options.reinit) {
			var compiledTemplate = _.template(boardTemplate, data);
			this.container.append(compiledTemplate);
			//}
			/* board insertion part */
			this.insertFromCfg(prsObj);
		},
		detectSizes: function(blockSize, xBlocks, yBlocks, bannerId, footerId, options) {
			try {
				this.viewSizeDetector = new sizeDetector(blockSize, xBlocks, yBlocks, bannerId, footerId, {
					//marginUDFactor: 0.01
				});
				if (options) {
					if (options.fluid) {
						this.viewSizeDetector.detectSizesForFluidCanvas();
					} else {
						this.viewSizeDetector.detectSizesForFixedCanvas();
					}
				} else {
					this.viewSizeDetector.detectSizesForFixedCanvas();
				}

			} catch (err) {
				alert(err.message);
			}
		},
		establishStyle: function(canvas, options) {
			console.log();
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
			if (!options || !options.portrait) {
				canvas.css('top', this.viewSizeDetector.marginTop + 'px');
				return;
			}

		},
		getGrid: function(attr) {
			var grid;
			if (!attr._tabId) {
				return this.grid;
			}
			if (this.views.tabs[attr._tabId])
				return this.views.tabs[attr._tabId].grid;
			return this.grid;
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
				switch (_id) {
					case "datasource":
						{
							this.initDatasources(attr);
							break;
						}
					case "tabs":
						{
							this.initTabs(attr);
							break;
						}
					case "elements":
						{
							for (var _elId in attr) {
								var elObj = attr[_elId];
								var tabId = this.tabOfElementIndex(_elId);
								elObj._id = _elId;
								if (tabId) {
									elObj._tabId = tabId;
								}
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

			this.el = $("#tabs")

			if ($.isEmptyObject(this.views.tabs)) {
				this.establishStyle(this.el);
				this.grid = new kitGrid(this.el);
				this.el.removeClass('canvas')
					.addClass('tab');
				$('#toggleGridButton').click(function(e) {
					self.grid.toggleGrid();
				});
			}
			else {
				this.el.css('top', '52px');
			}

			//getting adei metainfo
			if (chartsToAdd.length > 0)
				this.getAxes();

			this.addAllSingleSensors(singleSensorsToAdd);
			this.addAllSensorGroups(sensorGroupsToAdd);
			this.addAllTables(sensorTablesToAdd);
			this.addAllAlarmLists(alarmListsToAdd);
			this.addAllCharts(chartsToAdd);


			this.enableFetchingData();
			this.updateAllSensors();

		},
		disableFetchingData: function() {

		},
		enableFetchingData: function() {
			var self = this;
			this.updSensorsInterval = setInterval(function() {
				self.updateAllSensors();
			}, 2000); //the only way to pass param */
		},
		getAxes: function() {
			var dbname = this.settings['dbname'];
			var dbgroup = this.settings['dbgroup'];
			var server = this.settings['server'];
			var axes = this.axes;
			var url = window.host + "services/list.php?target=axes&db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup;
			try {
				getDataFromAdei(url, true, function(data) {
					xmldoc = $.parseXML(data);
					$xml = $(xmldoc);
					$values = $xml.find('Value').each(function(index) {
						var id = $(this).attr('value');
						var newAxes = {
							id: id,
							axis_units: $(this).attr('axis_units'),
							axis_name: $(this).attr('axis_name'),
							axis_mode: $(this).attr('axis_mode'),
							axis_range: $(this).attr('axis_range')
						}
						console.log(newAxes);
						axes[id] = newAxes;
					});	
					
					//xmldoc.find('result').each(function( ) {
					//	console.log($(this).text());
					//})

					//data = xmlToJson(data);

					//console.log(data);
				});
			}
			catch(msg) {
				alert('Error when getting axes');
			}
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

				try {
					//http://katrin.kit.edu/adei/services/getdata.php?db_server=fpd&db_name=katrin_rep&db_group=0&db_mask=102,106,107,108,149,150,103,109,110,111,151,152,74,66,68,99,12,67,69,100,2,3,4,5,6,7,8,9,59,61,75,78,80,82,145,112,113,116,117,118,146,119,120,123,124,125,186,187,188,190,191,192,190,191,192&window=-1
					var url = window.host + "services/getdata.php?db_server=" + server + '&db_name=' + dbname + '&db_group=' + dbgroup + '&db_mask=' + masksToRequest + '&window=-1';
					//window.db.httpGetCsv(url, function(data) {
					getDataFromAdei(url, true, function(data) {
						//var result = window.db.dataHandl.onMessageRecievedCsv(data);
						result = parseCSVForUpdating(data, masks.length);
						if (typeof(result) === "string") {
							console.log('Error occured: ' + result);
							var lastUpdatedTime = 'Error in getting data';
							self.eventAggregator.trigger('loadingfinished', {
								lastUpdatedTime: lastUpdatedTime
							});
							return;
						}
						var time = moment(result.time[0] * 1000);
						var lastUpdatedTime = time.format('ddd MMM D YYYY HH:mm:ss') + ' GMT' + time.format('Z') + ', ' + time.fromNow();
						//$('#lblFromNow').text();
						self.eventAggregator.trigger('loadingfinished', {
							lastUpdatedTime: lastUpdatedTime
						});
						//console.log(result)
						var index = 0;
						for (var sensId in self.sensors) {
							var element = self.sensors[sensId];

							element.updateModel(result.values[index++], time.valueOf());
						}
					});
					//window.db.getData(this.settings['server'], this.settings['dbname'], this.settings['dbgroup'], masksToRequest, '-1', 800, 'mean', function(obj)
					//{
					//console.log(obj);
					//})

				} catch (msg) {
					//console.log(msg)
				}
			} else {
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

		},
		updateSensor: function(sensorModel) {
			sensorModel.updateModel();
		},
		alert: function(e) {
			console.log(e);
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
		initDatasources: function(attr) {
			if (!attr['dbgroup'] || !attr['dbname'] || !attr['server']) {
				console.log('Please specify fields dbgroup, dbname and server in configuration file');
			}
			this.settings['dbgroup'] = attr['dbgroup'];
			this.settings['dbname'] = attr['dbname'];
			this.settings['server'] = attr['server'];
		},
		initScreenOptions: function(attr) {

		},
		getCurrentTab: function() {
			var activeTabIdx = $("#tabs").tabs('option', 'active');
			var activeTabID = $('#tabs > ul > li').eq(activeTabIdx).attr('aria-controls');
			//var activeTabID = $('div[id="tabs"] ul .ui-tabs-active a').attr("href").substring(1);
			return activeTabID;
		},
		tabOfElement: function(elemId) {
			var tabId = this.tabViewLookup[elemId]
			var tab = this.views.tabs[tabId];
			return tab;
		},
		tabOfElementIndex: function(elemId) {
			return this.tabViewLookup[elemId];
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
				this.establishStyle(newTabView.el, {portrait: true});
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
				console.log(tab.grid.getIdOfCanvas());
			}

			console.log(this.views.tabs);
			$('#tabs').tabs({
				collapsible: false
			}).css('width', this.viewSizeDetector.boardSizePx.width + 8 + 'px');
			//$('#tabs ul').css('padding', '0px !important')
				//.css('height', 50 * this.viewSizeDetector.scale)
				//.css('width', this.viewSizeDetector.boardSizePx.width + 'px');
			$('#tabs li').css('height', 40 * this.viewSizeDetector.scale)
				.css('font-size', 24 * this.viewSizeDetector.scale);

			//var marginTop = ($(window).height() - parseInt($('#banner').css('height')) - parseInt($('#footer').css('height')) - this.viewSizeDetector.maxGridSizesPx.height) / 5.5;
			//$('#tabs').css('margin-top', marginTop + 'px');

			var self = this;
			$('#toggleGridButton').click(function(e) {
				console.log('toggle: ')
				var id = self.getCurrentTab();
				console.log(id);
				var tab = self.views.tabs[id];
				tab.grid.toggleGrid();
			}).tooltip({});
		},
		addSingleSensor: function(attr) {
			//which tab will be there
			var grid = this.getGrid(attr);

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
				grid: grid
			});
			this.elements.singlesensors[attr._id] = newSensor;
			this.sensors[attr._id] = newSensor;
			this.views.singlesensors[attr._id] = newSensorView;
		},
		addSensorTable: function(attr) {
			var sensorgroups = attr['rows'];
			var collectionGroups = [];
			var dbname = undefined;
			var server = undefined;
			var dbgroup = undefined;
			var grid = this.getGrid(attr);
			var isheader = false;

			if (attr['diffgroups']) {
				dbname = attr['dbname'];
				server = attr['server'];
				dbgroup = attr['dbgroup'];
			} else {
				dbname = this.settings['dbname'];
				server = this.settings['server'];
				dbgroup = this.settings['dbgroup'];
			}

			for (var i = 0; i < sensorgroups.length; i++) {
				var sensors = sensorgroups[i]['columns'];
				if (sensorgroups[i]['header']) {
					isheader = true;
				}
				//which tab will be there

				var newSensorCollection = undefined;
				var sensorModelArr = [];

				for (var j = 0; j < sensors.length; j++) {
					var sensorInfoObj = sensors[j];

					var newSensor = new Sensor({
						id: sensorInfoObj["id"],
						name: sensorInfoObj["name"],
						unit: sensorInfoObj["unit"],
						max: sensorInfoObj["max"],
						min: sensorInfoObj["min"],
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

					if (sensorInfoObj["id"] === undefined) {
						throw "id hasnt been specified at table: " + attr._id + " at sensor with id: " +sensorInfoObj["id"];
					}

					sensorModelArr.push(newSensor);
					this.sensors[sensorInfoObj["id"]] = newSensor;

					newSensor.on('removing', function() {
						if (this.sensors) {
							delete this.sensors[sensorInfoObj["id"]];
						}
					}, this);
				}

				newSensorCollection = new SensorCollection(sensorModelArr, {
					group: attr['rows'][i]['header']
				});

				collectionGroups.push(newSensorCollection);
			}

			var newSensorTableModel = new SensorTableModel({
				id: attr._id,
				size: attr['size'],
				coords: attr['coords'],
				groups: collectionGroups,
				colnames: attr['colnames'],
				name: attr['name'],
				render: attr['render'],
				cfgObj: attr,
				isheader: isheader
			});

			this.elements.tables[attr._id] = newSensorTableModel;


			var newSensorTableView = undefined;

			if (attr['render'] === 'table') {
				newSensorTableView = new SensorCustomTableView({
					grid: grid,
					model: newSensorTableModel
				});
			}
			else {
				newSensorTableView = new SensorJqGridTableView({
					grid: grid,
					model: newSensorTableModel
				});
			}
			
			this.views.tables[attr._id] = newSensorTableView;

			newSensorTableModel.on('removing', function() {
				if (this.elements) {
					this.elements.tables[attr._id] = null;
					this.views.tables[attr._id] = null;
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
				linewidth: attr["width"],
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
			//which tab will be there
			var grid = this.getGrid(attr);
			var size = undefined;

			//if groups are not from diff sources
			if (attr['diffgroups']) {
				dbname = attr['dbname'];
				server = attr['server'];
				dbgroup = attr['dbgroup'];
			} else {
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
				} else {
					newSensorView = new SingleSensorView({
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
					grid: grid
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

			this.elements.sensorgroups[attr._id] = newSensorGroupModel;
		},
		addMeasurementList: function(attr) {

		},
		addAlarmList: function(attr) {
			var alarmList = []; //collection of alarms
			var newAlarmCollection = undefined;
			var dbname = undefined;
			var server = undefined;
			var control_group = attr['control_group'] ? attr['control_group']: undefined;
			//which tab will be there
			var grid = this.getGrid(attr);

			if (attr['diffgroups']) {
				dbname = attr['dbname'];
				server = attr['server'];
			} else {
				dbname = this.settings['dbname'];
				server = this.settings['server'];
			}

			if (attr['masks'] && (attr['masks'] instanceof Array)) {
					for (var alarmKey in attr['masks']) { //going from alarmlist object through elems
						//console.log(alarmKey);
						if (!$.isNumeric(alarmKey)) {
							var alarmAttr = attr['masks'][alarmKey];
							var newAlarm = new Alarm({
								id: alarmKey,
								module: alarmAttr["module"],
								group: alarmAttr["group"],
								app: alarmAttr["app"],
								dbname: alarmAttr["dbname"],
								mask: alarmAttr["mask"],
								cfgObj: alarmAttr
							});
						} 
						else {
							var newAlarm = new Alarm({
								id: "alarm_" + alarmKey,
								mask: alarmAttr["mask"]
							});
						}
						

						alarmList.push(newAlarm); //push to collection
					};
					newAlarmCollection = new MyAlarmCollection(alarmList);
				}

			var newAlarmListModel = new AlarmListModel({
				id: attr._id,
				collection: newAlarmCollection,
				size: attr['size'],
				name: attr['name'],
				coords: attr['coords'],
				target: attr['target']? attr['target'] : "all",
				server: server,
				dbname: dbname,
				control_group: control_group,
				cfgObj: attr
			});

			//console.log(newAlarmCollection.id);
			this.elements.alarms[attr._id] = newAlarmListModel;
			var newAlarmListView = new AlarmListView({
				model: newAlarmListModel,
				grid: grid,
				board: this
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
		addAllMeasurementLists: function(attr) {
			for (var i = 0; i < arr.length; i++) {
				var attr = arr[i];
				this.addMeasurementList(attr);
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
		},
		hide: function() {
			this.disableFetchingData();
			this.el.hide();
		}
	});

	// 'jquery ', 'underscore ', 'backbone ' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});