define(['jquery', 'underscore', 'backbone', 'jqgrid', 'highcharts', 'text!templates/board.html', 'models/sensorModel', 'models/alarmModel', 'collections/alarmCollection', 'models/chartModel', 'text!templates/sensor.html', 'views/sensorView', 'views/chartView', 'collections/sensorGroupCollection'], function($, _, Backbone, jqGrid, _Highcharts, boardTemplate, Sensor, Alarm, MyAlarmCollection, Chart, sensorTemplate, SensorView, ChartView, SensorGroupCollection) {
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
		maxSizeX: 0,
		maxSizeY: 0,
		nowCoordX: 0,
		nowCoordY: 0,
		grid: null,
		viewSizeDetector: null,
		tabs: [],
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
						//self.elements.sensors.push(newSensor);
						self.elements.sensors[_id] = newSensor;
						break;
					case "alarmlist":
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
								options.size[0] = attr[alarmKey][0];
								options.size[1] = attr[alarmKey][1];
								continue;
							} else if (alarmKey === "coords") {
								options.coords[0] = attr[alarmKey][0];
								options.coords[1] = attr[alarmKey][1];
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

						var newAlarmCollection = new MyAlarmCollection(alarmList, options);
						//console.log(newAlarmCollection.id);
						this.elements.alarms[_id] = newAlarmCollection;
						self.addAlarmList( /*size.dx, size.dy, coords.px, coords.py, 2, "alarmList1", */ newAlarmCollection);
						break;
					case "chart":
						var newChart = new Chart({
							id: _id,
							caption: attr["caption"],
							type: attr["charttype"],
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
						break;
					default:
						break;
				}
			}

			setInterval(function() {
				self.updateAllSensors();
			}, 12000); //the only way to pass param */
		},
		reinitWithOptions: function(options) {

			var textToParse = options.aceText;
			var myParser = new cfgParser('1');
			var prsObj = myParser.parseJson(textToParse);

			var self = this;
			for (var _id in prsObj) {
				var attr = prsObj[_id];
				switch (attr["type"]) {
					case "sensor":
						var sensorModel = this.elements.sensors[_id];
						if (sensorModel) {
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
							this.rerenderSensor(sensorModel);
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
								mask: attr["mask"]
							});
							self.addSensor(attr["size"][0], attr["size"][1], attr["coords"][0], attr["coords"][1], newSensor);
							self.elements.sensors[_id] = newSensor;
						}
						break;
					default:
						break;
				}
			}
		},
		serializeToJson: function() {
			var newJson = {};
			var serializeRes = undefined;
			console.log(this.elements);
			for (var elementId in this.elements) {
				var element = this.elements[elementId];
				for (var innerElId in element) {
					var inElem = element[innerElId];
					//console.log(inElem);
					if (!inElem.serToJSON) {
						console.log(inElem.model.serToJSON());
						newJson[inElem.model.get('id')] = inElem.model.serToJSON();
					} else {
						console.log(inElem.serToJSON());
						console.log(inElem.get('id'));
						newJson[inElem.get('id')] = inElem.serToJSON();
					}

				}
			}
			serializeRes = JSON.stringify(newJson);
			console.log(serializeRes);
			return serializeRes;

		},
		rerenderSensor: function(sensorModel) {
			console.log('rerender');
			var sensorDiv = $('#' + sensorModel.get('id'));
			var scale = this.grid.getScale();

			var tile = sensorDiv.parent();
			var grid = $("#tab1");

			this.grid.resizeTile(sensorModel.get('coords')[0], sensorModel.get('coords')[1], sensorModel.get('size')[0], sensorModel.get('size')[1], tile);
			//tile.css('left', sensorModel.get('coords')[0] * grid.data('gridUnitX') * scale + 'px');
			//tile.css('top', sensorModel.get('coords')[1] * grid.data('gridUnitY') * scale + 'px');
			//tile.css('width', sensorModel.get('size')[0] * grid.data('gridUnitX') * scale + 'px');
			//tile.css('height', sensorModel.get('size')[1] * grid.data('gridUnitY') * scale + 'px');

			var s0 = sensorDiv.find('.sensorName')[0];
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = sensorModel.get('name');
			s0.innerHTML += '<br>' + sensorModel.get('comment');

			var s1 = sensorDiv.find('.sensorVal')[0];
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			s1.innerHTML = (sensorModel.get('value') === undefined) ? 'NAN' : (sensorModel.get('value')).toFixed(1);

			var s2 = sensorDiv.find('.sensorUnit')[0];
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = sensorModel.get('unit');

			var s4 = sensorDiv.find('.sensorAlarm')[0];
			s4.style.fontSize = 10 * scale + 'px';
			s4.style.left = 5 * scale + 'px';
			s4.style.bottom = 2 * scale + 'px';
			s4.innerHTML = "min:" + sensorModel.get('min') + "<br>max:" + sensorModel.get('max') + "<br>alert:" + sensorModel.get('alert');

			var s3 = sensorDiv.find('.close')[0];
			s3.style.position = 'absolute';
			s3.style.fontSize = 12 * scale + 'px';
			s3.style.right = 5 * scale + 'px';
			s3.style.top = 4 * scale + 'px';
			s3.innerHTML = "<b>x</b>";
			console.log('updated');
		},
		rerenderChart: function() {

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
				sensorModel.set({
					'value': value
				});

			});

		},
		updateAllCharts: function() {
			var allCharts = this.elements.charts;
			var shift = false;
			//console.log('charts');
			for (var chart in allCharts) {
				var chartObject = allCharts[chart];
				for (var z = 0; z < chartObject.seriesArr.length; z++) {
					var elemId = chartObject.seriesArr[z][0];
					var sensorValue = this.elements.sensors[elemId].get('value');
					if (sensorValue === undefined) {
						continue;
					}
					var now = new Date;
					var x = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
						now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					var y = parseFloat(sensorValue);
					var Point = {
						x: x,
						y: y
					};
					//console.log(Point);
					/*if (this.elements.sensors[elemId].get('values').length > 10) {
						shift = true;
					}
					else {
						shift = false;
					}*/

					chartObject.chart.series[z].addPoint(Point, true, shift); //last point is for everyone
					//NO EQUAL POINTS ONLY IF REDRAW EVERYTIME. SHIIT
					//console.log(chartObject.chart.series[z]);
					//console.log(x, y);
					//console.log(i, chartObject.chart.series[i].data);
				}
				//chartObject.chart.yAxis[0].isDirty = true;
				//chartObject.chart.redraw();
			}

			/*for (var chart in allCharts) {
				var chartObject = allCharts[chart];
				chartObject.chart.yAxis[0].isDirty = true;
				chartObject.chart.redraw();
			} */

		},
		addAlarmList: function(alarmCollection) {
			if (!alarmCollection) {
				throw "Please init alarm collection";
				return;
			}
			var dataToTable = []; //data from collection of alarms
			var self = this; // to refering to jquery
			var scale = self.grid.getScale();
			var unitHeight = self.grid.getUnitSizes().height;
			var unitWidth = self.grid.getUnitSizes().width;
			var newElement = $("<div></div>");
			var dx = alarmCollection.size[0];
			var dy = alarmCollection.size[1];
			var px = alarmCollection.coords[0];
			var py = alarmCollection.coords[1];
			var name = alarmCollection.id;
			var cols = alarmCollection.cols;

			newElement.css('width', dx * unitHeight * scale + 'px');
			newElement.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';
			var noWidth = (dx * unitWidth * scale / 6) + 'px';

			var newTable = $("<table></table>");
			var newPager = $("<div id='pager'></div>");

			//bind id of alarmList
			newTable.attr("id", name);
			newElement.append(newTable);
			newElement.append(newPager);

			//create an array of object from models
			for (var i = 0; i < alarmCollection.models.length; i++) {
				dataToTable.push(alarmCollection.models[i].getProperties());
			}

			this.grid.addUnit(dx, dy, px, py, scale, newElement, {
				border: 0,
				transparent: true
			});

			newTable.jqGrid({
				datatype: 'local',
				data: dataToTable,
				colNames: ['No', 'Module', 'Group', 'App', 'LastDate', 'DelayedBy'],
				shrinkToFit: true,
				autowidth: true,
				//multiselect: true, //Appears checkboxes. Better to have beforeSelectRow
				//height: '200px',
				hidegrid: false,
				colModel: [{
					name: 'no',
					index: 'no',
					width: noWidth,
					sorttype: 'int'
				}, {
					name: 'module',
					index: 'module',
					width: elemWidth
				}, {
					name: 'group',
					index: 'group',
					width: elemWidth
				}, {
					name: 'app',
					index: 'app',
					width: elemWidth
				}, {
					name: 'lastDate',
					index: 'lastDate',
					width: elemWidth
					//sorttype: 'date'
				}, {
					name: 'delayedBy',
					index: 'delayedBy',
					width: elemWidth
					//sorttype: 'date'
				}],
				rowNum: cols,
				pager: "#pager",
				caption: name,
				loadComplete: function() {
					var grid = newTable;
					var ids = grid.getDataIDs();
					for (var i = 0; i < ids.length; i++) {
						grid.setRowData(ids[i], false, {
							height: 1 * scale + i * 2
						});
					}
				},
				beforeSelectRow: function(rowid, e) {
					var $tr;
					if (e.ctrlKey) {
						$tr = $(e.target).closest('tr.jqgrow');
						$tr.toggleClass("ui-state-highlight");
						return false;
					}
					return true;
				}
			});

			$('.ui-jqgrid .ui-jqgrid-htable th').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid tr.jqgrow td').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-view').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-pg-input').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-titlebar').css('font-size', 14 * scale + 'px');
			//$('#pager_center').css('width', newElement.width() - 6); 
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('height', 40 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('width', newElement.width() - 6);
			$('.ui-jqgrid .ui-jqgrid-htable th div').css('height', 'auto');
			$('.ui-jqgrid .ui-jqgrid-pager').css('height', 40 * scale + 'px');
			$('th.ui-th-column div').css('height', 'auto !important');
			$('th.ui-th-column div').css('white-space', 'normal !important');

			var gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();

			newTable.jqGrid('setGridHeight', newElement.height() - gboxHeight - 2);
			newTable.jqGrid('setGridWidth', newElement.width() - 1, true);

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
			this.container.empty();
			this.maxSizeX = 0;
			this.maxSizeY = 0;
			this.nowCoordX = 0;
			this.nowCoordY = 0;
			delete(this.grid);
			delete(this.viewSizeDetector);
			this.tabs = [];
			delete(this.elements.sensors);
			this.elements.sensors = {};
			for (var chartId in this.elements.charts) {
				var chart = this.elements.charts[chartId].chart;
				for (var i = 0; i < chart.series.length; i++) {
					chart.series[i].setData([]);
					//for(var j=0; j < chart.series[i].points.length; j++){
					//chart.series[i].points[j].remove()

					//}	

				}

				//chart.destroy();
				//while(chart.series.length > 0) {
				//chart.series[0].remove();
				//}

				//while(chart.series.length > 0)

				//chart.redraw();
			}
			delete(this.elements.charts);

			//this.container.remove();

		},
		reinitialize: function(options) {
			this.clear();
			this.initialize(options);
		}
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});