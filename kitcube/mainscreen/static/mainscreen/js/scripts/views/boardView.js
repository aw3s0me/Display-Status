define(['jquery', 'underscore', 'backbone', 'jqgrid', 'highcharts', 'text!templates/board.html', 'models/sensorModel', 'models/alarmModel', 'models/chartModel', 'text!templates/sensor.html'], function($, _, Backbone, jqGrid, _Highcharts, boardTemplate, Sensor, Alarm, Chart, sensorTemplate) {
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
		sensors: {},
		charts: {},
		testChart: null,
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
			//this.addSensor(4, 2, this.grid.getScale());
			//this.addChart(7, 5, 5, 5, 'mytestchart');
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
							mask: attr["mask"]
						});
						//console.log(newSensor);
						self.addSensor(attr["size"][0], attr["size"][1], attr["coords"][0], attr["coords"][1], newSensor);
						//self.sensors.push(newSensor);
						self.sensors[_id] = newSensor;
						break;
					case "alarmlist":
						var alarmList = []; //collection of alarms
						var size = {
							dx: undefined,
							dy: undefined
						};
						var coords = {
							px: undefined,
							py: undefined
						};
						for (var alarmKey in attr) { //going from alarmlist object through elems
							if (alarmKey === "type") { //except type
								continue;
							} else if (alarmKey === "size") {
								size.dx = attr[alarmKey][0];
								size.dy = attr[alarmKey][1];
								continue;
							} else if (alarmKey === "coords") {
								coords.px = attr[alarmKey][0];
								coords.py = attr[alarmKey][1];
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
						self.addAlarmList(size.dx, size.dy, coords.px, coords.py, 2, "alarmList1", alarmList);
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
						//console.log(newChart);

						this.addChart(newChart.get('size')[0], newChart.get('size')[1], newChart.get('coords')[0], newChart.get('coords')[1], newChart);



						break;
					default:
						break;
				}
			}

			/*setInterval(function() {
				console.log(self.testChart);
				if (self.testChart) {
					for (var i = 0; i < 4; i++) {
						var now = new Date;
						var x = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
						var Point = {
							x: x,
							y: Math.floor((Math.random() * 10) + 1) //y
						};
						console.log(Point);
						console.log(this.testChart);
						self.testChart.series[i].addPoint(Point, false, false);
					}
					self.testChart.redraw();
				}

			}, 5000); */

			setInterval(function() {
				self.updateAllSensors();
			}, 5000); //the only way to pass param */
		},
		submitTest: function() {
			fncstring = $('#testfunction').val();
			var self = this;
			var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
			var args = /\(([^)]+)/.exec(fncstring);
			fncname = fncname[0];
			if (args !== null)
				args = args[1].split(/\s*,\s*/);

			switch (fncname) {
				case "drawText":
					args[4] = /[^'"]+/.exec(args[4]);
					var e = self.drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
					break;
				case "drawSensor":
					var e = self.addSensor(args[0], args[1], args[2], args[3]);
					break;
				case "addSensor":
					args[2] = /[^'"]+/.exec(args[2]);
					var _name = 0;
					var comment = 0;
					var url = 'http://katrin.kit.edu/adei/services/getdata.php?db_server=temp0&db_name=BakeOut2013&db_group=TempMon&db_mask=1&window=-1';
					$.get(url, function(data) {
						//console.log("data: " + data);
						var dataLines = data.split('\n');
						var arrayOfInfo = dataLines[0].split(',');
						var arrayOfValues = dataLines[1].split(',');
						_name = arrayOfInfo[1];
						//console.log(_name);
					});
					//console.log(_name);
					var newSensor = new Sensor({
						id: args[4],
						name: _name,
						comment: _name,
						unit: "C",
						max: 100,
						min: 0,
						server: "temp0",
						device: "HATPRO",
						dbname: "BakeOut2013",
						dbgroup: "TempMon",
						mask: 1
					});
					//console.log(newSensor.get('name'));
					var e = self.addSensor(args[0], args[1], args[2], args[3], newSensor);
					break;
				case "addAlarmList":
					args[2] = /[^'"]+/.exec(args[2]);
					var e = self.addAlarmList(args[0], args[1], args[2], args[3]);
					break;
				case "updatePage":
					//self.updatePage();
					break;
				default:
					alert('function "' + fncname + '" not defined');
			}
		},
		addSensor: function(dx, dy, px, py, newSensor) {
			var self = this;
			var scale = self.grid.getScale();
			//console.log(newSensor);
			//var compiledTemplate = _.template(sensorTemplate, { sensor: newSensor.toJSON() });
			//var jqDivTemplate = $(compiledTemplate);
			var myDiv = $('<div></div>');
			myDiv.attr('id', newSensor.get('id'));
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.innerHTML += '<br>' + newSensor.get('comment');
			s0.className = "sensorName";

			var s1 = document.createElement('div');
			//s1.id = newSensor.get('id');
			s1.style.position = 'absolute';
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			s1.innerHTML = (newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1);
			s1.className = "sensorVal";

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = newSensor.get('unit');
			s2.className = "sensorUnit";

			var s4 = document.createElement('div');
			s4.style.position = 'absolute';
			s4.style.fontSize = 10 * scale + 'px';
			s4.style.left = 5 * scale + 'px';
			s4.style.bottom = 2 * scale + 'px';
			s4.innerHTML = "min:" + newSensor.get('min') + "<br>max:" + newSensor.get('max') + "<br>alert:" + newSensor.get('alert');
			s4.className = "sensorAlarm";

			var s3 = document.createElement('div');
			s3.style.position = 'absolute';
			s3.style.fontSize = 12 * scale + 'px';
			s3.style.right = 5 * scale + 'px';
			s3.style.top = 4 * scale + 'px';
			s3.innerHTML = "<b>x</b>";
			s3.className = "close";
			myDiv.append(s0);
			myDiv.append(s1);
			myDiv.append(s2);
			myDiv.append(s3);
			myDiv.append(s4);

			this.grid.addUnit(dx, dy, px, py, scale, myDiv);
		},
		updateAllSensors: function() {
			for (var sensId in this.sensors) {
				this.updateSensor(this.sensors[sensId]);
			}
			//console.log("charts");
			this.updateAllCharts();
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
				var tempValue = [];
				var now = new Date;
				//tempValue.push(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
				//tempValue.push(value);
				//if (sensorModel.get('values').length < 10) {
				//sensorModel.get('values').push(tempValue);
				//} else {
				//sensorModel.get('values').shift();
				//sensorModel.get('values').push(tempValue);
				//}
				/*var sensorCharts = sensorModel.get('charts');
				for (var chart in sensorCharts) {
					sensorCharts[chart].
				} */

			});

		},
		updateAllCharts: function() {
			var allCharts = this.charts;
			console.log('charts');
			for (var chart in allCharts) {
				var chartObject = allCharts[chart];
				for (var z = 0; z < chartObject.seriesArr.length; z++) {
					var elemId = chartObject.seriesArr[z][0];
					var sensorValue = this.sensors[elemId].get('value');
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
					console.log(Point);
					chartObject.chart.series[z].addPoint(Point, true, false); //last point is for everyone
					//NO EQUAL POINTS ONLY IF REDRAW EVERYTIME. SHIIT
					console.log(chartObject.chart.series[z]);
					//console.log(x, y);
					//console.log(i, chartObject.chart.series[i].data);
				}
				//chartObject.chart.redraw();
			}
			/*
			for (var chart in allCharts) {
				var chartObject = allCharts[chart];
				chartObject.chart.redraw();
			} */

		},
		addAlarmList: function(dx, dy, px, py, cols, name, alarmCollection) {
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
			for (var i = 0; i < alarmCollection.length; i++) {
				dataToTable.push(alarmCollection[i].getProperties());
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
		addChart: function(dx, dy, px, py, model) {
			var self = this;
			var dataToChart = [];
			var chartEl = $("<div id='" + model.get('id') + "'></div>")
			var scale = this.grid.getScale();
			this.grid.addUnit(dx, dy, px, py, scale, chartEl, {
				border: 0,
				transparent: true
			}); 

			if (!model) {
				throw "Please, init model";
				return;
			}

			var linkArr = model.get('link');

			var seriesArr = []; // for updating our charts, 
			//contains index of 1 series model and id of sensor

			//console.log(linkArr);
			//console.log(self.sensors);
			if (linkArr) {
				for (var j = 0; j < linkArr.length; j++) {
					var linkId = linkArr[j];
					//console.log(linkId);
					var sensorModel = self.sensors[linkId];
					//console.log(sensorModel);
					dataToChart.push(sensorModel.getChartProperties());
					seriesArr.push([sensorModel.get('id'), sensorModel.get('name')]);

					sensorModel.get('charts');
				}
			}
			console.log(dataToChart);
			var newChart = new Highcharts.Chart({
				chart: {
					reflow: false,
					type: 'line',
					renderTo: model.get('id'),
					//marginRight: 130,
					//marginBottom: 25
				},
				title: {
					text: model.get('caption'),
					x: -20 //center
				},
				subtitle: {
					text: 'Source: WorldClimate.com',
					x: -20
				},
				xAxis: {
					type: 'datetime',
					dateTimeLabelFormats: {
						minute: '%H:%M'
					},
					tickInterval: 600 * 1000
				},
				yAxis: {
					title: {
						text: 'Values'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				/*tooltip: {
					valueSuffix: '°C'
				}, */
				//legend: model.get('legend'),
				series: //cache data, store it on the server side and pass here
				dataToChart
				//testData
			});
			this.testChart = newChart;
			//console.log(model.get('legend'));
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			newChart.setSize(width, height, true);

			this.charts[model.get('id')] = {
				seriesArr: seriesArr,
				chart: newChart
			}


			console.log(this.testChart);
			//console.log(seriesArr);
			//link sensor and chart
			/*for (var i = 0; i < linkArr.length; i++) {
				var elemId = linkArr[i];
				if (!self.sensors[elemId].get('charts')[self.sensors[elemId].get('id')]) {
					self.sensors[elemId].get('charts')[model.get('id')] = newChart;
				}
				console.log(self.sensors[elemId]);
			}*/



		},
		/*events: {
			'click #canvasButton': 'alert'
		}, */
		alert: function(e) {
			console.log(e);
		},
		render: function() {

		},
		resize: function(x, y) {

		},
		change: function(NumX, NumY) {}
	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});