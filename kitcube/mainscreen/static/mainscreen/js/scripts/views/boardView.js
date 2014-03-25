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
		render: function() {

		},
		resize: function(x, y) {

		},
		change: function(NumX, NumY) {},
		initialize: function(options) {
			this.viewSizeDetector = new sizeDetector(50, 50, '#banner', '#footer');
			this.viewSizeDetector.detectBannerSize();
			this.viewSizeDetector.detectFooterSize();
			this.viewSizeDetector.detectBoardSize();
			//console.log('options: ' + options);


			//var textToParse = options.aceText;
			var data = {};
			var compiledTemplate = _.template(boardTemplate, data);
			this.container.append(compiledTemplate);
			$('.canvas').attr("id", "tab1");

			//console.log(this.grid);

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
			//console.log("sizedet: " + this.viewSizeDetector.scale);
			$('.canvas').data('scale', this.viewSizeDetector.scale);

			this.grid = new kitGrid("#tab1");
			this.addSensor(4, 2, this.grid.getScale());
			this.addAlarmList(10, 10, 2, "alarmList1");
			var self = this;
			$('#canvasButton').click(function(e) {
				self.submitTest();
			})
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
					var e = self.addSensor(args[0], args[1], args[2], args[3]);
					//console.log("" + args[0] + args[1] + args[2] + args[3]);
					break;
				case "addAlarmList":
					args[2] = /[^'"]+/.exec(args[2]);
					var e = self.addAlarmList(args[0], args[1], args[2], args[3]);
					//console.log("" + args[0] + args[1] + args[2] + args[3]);
					break;
				case "updatePage":
					//self.updatePage();
					break;
				default:
					alert('function "' + fncname + '" not defined');
			}
		},
		addSensor: function(px, py, sensorId) {
			var self = this;
			var scale = self.grid.getScale();
			var newSensor = new Sensor({
				id: "sensor1",
				name: "bright",
				comment: "doesnt work",
				unit: "km/h",
				value: 85,
				max: 100,
				min: 15,
				alarm: 4
			});
			//var compiledTemplate = _.template(sensorTemplate, { sensor: newSensor.toJSON() });
			//var jqDivTemplate = $(compiledTemplate);
			var myDiv = $('<div></div>');
			var s0 = document.createElement('div');
			s0.style.position = 'absolute';
			s0.style.fontSize = 13 * scale + 'px';
			s0.style.left = 5 * scale + 'px';
			s0.innerHTML = newSensor.get('name');
			s0.innerHTML += '<br>' + newSensor.get('comment');

			var s1 = document.createElement('div');
			s1.id = newSensor.get('id');
			s1.style.position = 'absolute';
			s1.style.fontSize = 50 * scale + 'px';
			s1.style.right = 6 * scale + 'px';
			s1.style.bottom = 0 * scale + 'px';
			s1.innerHTML = (newSensor.get('value') === undefined) ? 'NAN' : (newSensor.get('value')).toFixed(1);

			var s2 = document.createElement('div');
			s2.style.position = 'absolute';
			s2.style.fontSize = 12 * scale + 'px';
			s2.style.right = 5 * scale + 'px';
			s2.style.top = 20 * scale + 'px';
			s2.innerHTML = newSensor.get('unit');
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

			this.grid.addUnit(4, 2, px, py, scale, myDiv);

			//console.log($(compiledTemplate));
		},
		addAlarmList: function(px, py, cols, name) {
			var self = this;
			var scale = self.grid.getScale();
			var unitHeight = self.grid.getUnitSizes().height;
			var unitWidth = self.grid.getUnitSizes().width;
			var newElement = $("<div></div>");

			var dx = 12;
			var dy = 6;
			newElement.css('width', dx * unitHeight * scale + 'px');
			newElement.css('height', dy * unitWidth * scale + 'px');
			newElement.css('position', 'relative');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';
			var noWidth = (dx * unitWidth * scale / 6) - 4 + 'px';
			var newTable = $("<table></table>");
			var newPager = $("<div id='pager'></div>");
			newTable.attr("id", name);
			newElement.append(newTable);
			//newElement.append(newPager);
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
			newTable.jqGrid({
				datatype: 'local',
				data: testData,
				colNames: ['No', 'Module', 'Group', 'App', 'LastDate', 'DelayedBy'],
				shrinkToFit: false,
				autowidth: true,
				height: 'auto',
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
				//pager: "#pager",
				caption: name,
				/*loadComplete: function() {
					var grid = newTable;
					var ids = grid.getDataIDs();
					for (var i = 0; i < ids.length; i++) {
						grid.setRowData(ids[i], false, {
							height: 40 + i * 2 // here we set height of elements
						});
					}
					//grid.setGridHeight('auto');
				}*/
			});
			//$('.canvas').append(newElement);
			this.grid.addUnit(dx, dy, px, py, scale, newElement);
			newTable.jqGrid('setGridWidth', newElement.width() - 6, true);
			newTable.parents('div.ui-jqgrid-bdiv').css("max-height",newElement.height());
			/*function resize_grid(grid) {
				var container = grid.parents('.ui-layout-content:first');
				grid.jqGrid('setGridWidth', container.width() - 2); // -2 is border width?
				var h = grid.parents('.ui-jqgrid:first').height() - grid.parents('.ui-jqgrid-bdiv:first').height();
				grid.jqGrid('setGridHeight', container.height()- h - 2);
			} */

			/*function resizeGrid(elem, gridParent) {
				var $grid = elem,
					$gbox = $grid.closest(".ui-jqgrid"), // or $("gbox_theTable");
					outerHeight = $gbox.height() - $grid.jqGrid('getGridParam', 'height');
				$grid.jqGrid('setGridWidth', gridParent.width());
				$grid.jqGrid('setGridHeight', gridParent.height() - outerHeight);
				$grid.trigger('reloadGrid');
			} */

			//resizeGrid(newTable, newElement);
			//newTable.jqGrid('setGridHeight', newElement.height(), true);
			//$('.ui-jqgrid-bdiv').height(newElement.height());

		},

		updateSensor: function(sensor) {
			var data = {};
			var sensor = this;
			$.get(sensor.url, function(data) {
				var arrayOfData = data.split(',');
				var value = parseFloat(
					arrayOfData[arrayOfData.length - 1]);
				sensor.value = value;
			});
		},
		/*events: {
			'click #canvasButton': 'alert'
		}, */
		alert: function(e) {
			console.log(e);
		}



	});

	// 'jquery', 'underscore', 'backbone' will not be accessible in the global scope
	return BoardView;
	// What we return here will be used by other modules
});