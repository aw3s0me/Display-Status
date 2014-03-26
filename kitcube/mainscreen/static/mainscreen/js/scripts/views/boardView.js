define(['jquery', 'underscore', 'backbone', 'jqgrid', 'text!templates/board.html', 'models/sensorModel', 'text!templates/sensor.html'], function($, _, Backbone, jqGrid, boardTemplate, Sensor, sensorTemplate) {
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
		sensors: [],
		initialize: function(options) {
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
			this.addAlarmList(10, 10, 2, "alarmList1");
			var self = this;
			$('#canvasButton').click(function(e) {
				self.submitTest();
			});
			$('#toggleButton').click(function(e) {
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
						self.sensors.push(newSensor);
						break;
					case "chart":

						break;
					default:
						break;
				}
			}
			setInterval(function() {
				self.updateAllSensors();
			}, 3000); //the only way to pass param
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
			//console.log(myDiv);

			this.grid.addUnit(dx, dy, px, py, scale, myDiv);

			//console.log($(compiledTemplate));
		},
		updateAllSensors: function() {
			for (var i = 0; i < this.sensors.length; i++) {
				this.updateSensor(this.sensors[i]);
			}
		},
		updateSensor: function(sensorModel) {
			var data = {};
			var sensorId = sensorModel.get('id');
			var sensor = $('#' + sensorId);
			$.get(sensorModel.getDbUrl(), function(data) {
				//console.log("data: " + data);
				//console.log(sensor);
				var arrayOfData = data.split(',');
				var value = parseFloat(
					arrayOfData[arrayOfData.length - 1]);
				var sensorDiv = sensor.find(".sensorVal")[0];
				sensorDiv.innerHTML = value.toFixed(1);
			});
		},
		addAlarmList: function(px, py, cols, name) {
			var self = this;
			var scale = self.grid.getScale();
			var unitHeight = self.grid.getUnitSizes().height;
			var unitWidth = self.grid.getUnitSizes().width;
			var newElement = $("<div></div>");

			var dx = 8;
			var dy = 6;
			newElement.css('width', dx * unitHeight * scale + 'px');
			newElement.css('height', dy * unitWidth * scale + 'px');
			newElement.css('position', 'relative');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';
			var noWidth = (dx * unitWidth * scale / 6) - 12 + 'px';
			var newTable = $("<table></table>");
			var newPager = $("<div id='pager'></div>");
			newTable.attr("id", name);
			newElement.append(newTable);
			newElement.append(newPager);
			var testData = [{
				no: 1,
				module: "T02",
				group: "DAS",
				app: "Reader",
				lastDate: "24.05.2012",
				delayedBy: "11 days"
			}, {
				no: 2,
				module: "T02",
				group: "",
				app: "sync",
				lastDate: "24.05.2012",
				delayedBy: "11 days"
			}, {
				no: 3,
				module: "T03",
				group: "",
				app: "sync",
				lastDate: "24.05.2012",
				delayedBy: "11 days"
			}, {
				no: 4,
				module: "T04",
				group: "DAS",
				app: "Reader",
				lastDate: "31.05.2012",
				delayedBy: "3 days"
			}, {
				no: 4,
				module: "T04",
				group: "",
				app: "sync",
				lastDate: "31.05.2012",
				delayedBy: "3 days"
			}];

			this.grid.addUnit(dx, dy, px, py, scale, newElement);

			newTable.jqGrid({
				datatype: 'local',
				data: testData,
				colNames: ['No', 'Module', 'Group', 'App', 'LastDate', 'DelayedBy'],
				shrinkToFit: false,
				autowidth: true,
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
				rowNum: 5,
				pager: "#pager",
				caption: name,
				loadComplete: function() {
					var grid = newTable;
					var ids = grid.getDataIDs();
					for (var i = 0; i < ids.length; i++) {
						grid.setRowData(ids[i], false,	 {
							height: 0*scale + i * 2
						});
					}
				}
			});

			newTable.jqGrid('setGridWidth', newElement.width() - 6, true);
			console.log();
			
			$('.ui-jqgrid .ui-jqgrid-htable th').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid tr.jqgrow td').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-view').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-pg-input').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-titlebar').css('font-size', 14 * scale + 'px');
			$('#pager_center').css('width', newElement.width() - 6); 
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('height', 42*scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('width', newElement.width() - 6);

			var gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();

			newTable.jqGrid('setGridHeight', newElement.height() - gboxHeight);
			//$('.ui-jqgrid .ui-jqgrid-htable th div').css('height', 'auto');
			
			//$('.ui-jqgrid-title').css('height', 20*scale + 'px' );

			//$('.grid .ui-jqgrid-htable th').css('height', 10*scale + 'em !important');
			//$('.grid .ui-jqgrid-btable .jqgrow td').css('height', 10*scale + 'em !important');
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