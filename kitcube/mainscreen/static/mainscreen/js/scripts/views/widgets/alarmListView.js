define(['jquery', 'underscore', 'backbone', 'models/alarmListModel', 'text!templates/widgets/alarmjQGridList.html'], function($, _, Backbone, AlarmTableModel, TableTemplate) {
	var timeRegexPatter = /(\d{2})-(\d{3})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
	var alarmLastSeenSort = function(a, b, direction) {
		if (a === 'Active') {
			return 1;
		}
		else if (b === 'Active') {
			return -1;
		}
		var timeArrA = a.match(timeRegexPatter); //array A
		var timeArrB = b.match(timeRegexPatter); //Array B

		//here should be probably transform time regex into timestamp and compare it,
		//is there any predefined functions to do this
	}

	var AlarmListView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		alarms: undefined,
		board: undefined,
		updateInterval: undefined,
		lookuptable: {},
		jqgridHTML: undefined,
		initialize: function(options) {
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.board) {
				this.board = options.board;
			}

            //var alarmList = []; //collection of alarms
            //var newAlarmCollection = undefined;
            //var dbname = undefined;
            //var server = undefined;
            //var control_group = attr['control_group'] ? attr['control_group'] : undefined;
            ////which tab will be there
            //var grid = this.widgetController.getGrid(attr);
            //
            //if (attr['masks'] && (attr['masks'] instanceof Array)) {
            //    for (var alarmKey in attr['masks']) { //going from alarmlist object through elems
            //        //console.log(alarmKey);
            //        if (!$.isNumeric(alarmKey)) {
            //            var alarmAttr = attr['masks'][alarmKey];
            //            var newAlarm = new Alarm({
            //                id: alarmKey,
            //                module: alarmAttr["module"],
            //                group: alarmAttr["group"],
            //                app: alarmAttr["app"],
            //                dbname: alarmAttr["dbname"],
            //                mask: alarmAttr["mask"],
            //                cfgObj: alarmAttr
            //            });
            //        } else {
            //            var newAlarm = new Alarm({
            //                id: "alarm_" + alarmKey,
            //                mask: alarmAttr["mask"]
            //            });
            //        }
            //
            //        alarmList.push(newAlarm); //push to collection
            //    };
            //    newAlarmCollection = new MyAlarmCollection(alarmList);
            //}
            //
            //var newAlarmListModel = new AlarmListModel({
            //    id: attr._id,
            //    collection: newAlarmCollection,
            //    size: attr['size'],
            //    name: attr['name'],
            //    coords: attr['coords'],
            //    target: attr['target'] ? attr['target'] : "all",
            //    server: server,
            //    dbname: dbname,
            //    control_group: control_group,
            //    cfgObj: attr
            //});
            //
            ////console.log(newAlarmCollection.id);
            ////this.elements.alarms[attr._id] = newAlarmListModel;
            //var newAlarmListView = new AlarmListView({
            //    model: newAlarmListModel,
            //    grid: grid,
            //    board: this.widgetController.board
            //});
            //this.widgetController.addViewToLookup(newAlarmListModel.get('type'), newAlarmListView);


			this.model.on('onalarmsready', this.onalarmsready, this);
			this.model.on('onalarmsfinishedupdating', this.reloadGrid, this);
		},
		onalarmsready: function(model) {
			this.alarms = model.get('collection').models;

			for (var i = 0; i < this.alarms.length; i++) {
				var alarm = this.alarms[i];
				alarm.on('change:value', this.onchangevalue, this);
				alarm.on('change:valcolor', this.onchangevalcolor, this);
			}

			this.render();
			this.model.on('resize', this.onresize, this);
		},
		setUpdateInterval: function() {
			this.removeUpdateInterval();
			var self = this;
			this.updateInterval = setInterval(function() {
				self.model.updateAlarmData();
			}, 15000); //the only way to pass param */
		},
		removeUpdateInterval: function() {
			this.updateInterval = null;
		},
		formHeaders: function() {
			var colModel = [];
			var colNames = this.model.get('colnames');
			var colIds = this.model.get('colids');
			var dx = this.model.get('size')[0];
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();
			//var elemWidth = parseInt((dx * unitWidth * scale / 6) - 2);
			var elemWidthCoeff = unitWidth * scale * dx;

			/*for (var i = 0; i < colIds.length; i++) {
				colModel.push({
					//name: 'column_' + String(i),
					//index: 'column_' + String(i),
					name: colIds[i],
					index: colIds[i]
					//width: elemWidth
				});
			} */
			//'severity', 'name', 'firstseen', 'lastseen', 'count', 'description'
			colModel = [
				{
					name: 'severity',
					index: 'severity',
					width: 7.5 * elemWidthCoeff,
					sorttype: 'int'
				},
				{
					name: 'name',
					index: 'name',
					width: 25 * elemWidthCoeff
				},
				{
					name: 'firstseen',
					index: 'firstseen',
					width: 22.5 * elemWidthCoeff,
					sorttype: 'date',
					formatter: 'date',
					formatoptions: {srcformat: 'U', newformat: 'd-M-Y, H:i:s'},
					datefmt: 'd-M-Y, H:i:s'
				},
				{
					name: 'lastseen',
					index: 'lastseen',
					width: 22.5 * elemWidthCoeff
					//formatter: 'date',
					//formatoptions: {newformat: 'd-M-Y, H:i:s'},
					//datefmt: 'd-M-Y, H:i:s'
				},
				{
					name: 'count',
					index: 'count',
					width: 7.5 * elemWidthCoeff,
					sorttype: 'int'
				},
				{
					name: 'description',
					index: 'description',
					width: 15 * elemWidthCoeff,
					sortable: false
				},
			]

			return colModel;
		},
		formLookupTable: function() {
			var alarms = this.alarms;
			var pageIndex = 0;
			var pageNum = this.jqgridHTML.jqGrid('getGridParam','lastpage');
			var rowNum = this.jqgridHTML.jqGrid('getGridParam', 'rowNum');
			for (var i = 0; i < alarms.length; i++) {
				//if ()
				this.lookuptable[alarms[i].get('name')] = {
					alarm: alarms[i]
				}
			}
		},
		render: function() {
			var self = this;
			var model = this.model;
			var dataToTable = [];
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var px = model.get('coords')[0];
			var py = model.get('coords')[1];
			var colNames = model.get('colnames');
			var sizeCoeff = this.board.settings['sizecoeff'] / 2;
			var coeffScale = scale * sizeCoeff;

			var totalHeight = dy * unitHeight * scale;
			var hscale = totalHeight / $(window).height(); //scale font for header

			this.container = $(_.template(TableTemplate, {
				canberemoved: model.get('canberemoved'),
				id: model.get('id'),
				table_id: 'table_' + model.get('id'),
				pager_id: 'pager_' + model.get('id')
			}));

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			/*SETTING DATA COLS/ROWS */
			var colModel = this.formHeaders();

			var dataToTable = this.model.formDataToTable();

			this.grid.addUnit(this.container, {
				border: 0,
				transparent: true,
				//draggable: model.get('isdraggable'),
				//resizable: model.get('isresizable')
			}, this.model);

			/* INITIALIZE JQGRID */
			this.jqgridHTML = this.container.find('table');

			this.jqgridElem = this.jqgridHTML.jqGrid({
				datatype: 'local',
				data: dataToTable,
				colNames: colNames,
				//height: 'auto',
				//height: '400',
				//width: '400',
				height: '100%',
				width: '100%',
				shrinkToFit: true,
				autowidth: true,
				hidegrid: false,
				colModel: colModel,
				scrollOffset: 0,
				pager: '#' + 'pager_' + model.get('id'),
				//rowNum: cols,
				caption: this.model.get('name')
				/*onPaging: function() {
					var rows = self.jqgridHTML.getRowData();
					var rowNum = rows.length;
					var collection = self.model.get('collection');
					console.log(rowNum);
					for (var i = 0; i < rowNum; i++) {
						var alarmData = rows[i];
						//var alarm = collection.get(alarmData['name']);
						var alarm = self.lookuptable[alarmData['name']];
						var color = alarm['alarm'].attributes['color'];
						self.jqgridHTML.jqGrid('setCell', i + 1, 3, '', {
							'background-color': color
						});
					}

					console.log('page changed');
				}*/
			});
			this.jqgridHTML.jqGrid('filterToolbar', {stringResult: true, searchOnEnter: true});

			var gboxHeight = this.container.find("#gbox_" + name).height() - this.container.find('#gbox_' + name + ' .ui-jqgrid-bdiv').height() + 2 * this.container.find('.ui-jqgrid .ui-jqgrid-pager').height();
			this.container.find('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow-x', 'hidden');
			//this.container.find('.ui-jqgrid tr.jqgrow td').css('font-size', 18 * coeffScale + 'px');
			this.prevGboxHeight = gboxHeight;

			var finalGridHeight = this.container.height() - gboxHeight - 2;
			var finalGridWidth = this.container.width() - 1;

			this.jqgridHTML.jqGrid('setGridHeight', finalGridHeight);
			this.jqgridHTML.jqGrid('setGridWidth', finalGridWidth, true);
			//newTable.jqGrid('sortGrid', 'lastseen', true, 'desc');

			this.formLookupTable();

			this.container.find('.close').click(function(event) {
				self.removeFromDom();
			});

			//for (var modelName in this.alarms) {
				//var model = this.alarms[modelName];
				//this.onchangevalcolor(model);
			//}
			for (var modelName in this.alarms) {
				var model = this.alarms[modelName];
				this.onchangevalue(model);
			}

			console.log(this.jqgridHTML.jqGrid('getRowData', 22));

			this.setUpdateInterval();
		},
		reloadView: function() {
			this.container.find('table').trigger('reloadGrid');
		},
		onchangevalue: function(model) {
			var id = model.get('id');
			var lookupObj = this.lookuptable[id];
			var alarmData = model.getData();
			var data = this.jqgridHTML.jqGrid('getGridParam','data');
			data[lookupObj["row"]] = alarmData;
			this.jqgridHTML.jqGrid('setGridParam', 'data', data);
			this.jqgridHTML[0].refreshIndex();
			//console.log(model);
			//this.container.find('table').jqGrid('setRowData', lookupObj["row"], data);
			//this.container.find('table').jqGrid('setCell', lookupObj["row"], 3 , '', {
					//'background-color': model.get('valcolor')
			//	'background-color': model.get('color')
			//});
			//remember value row and change it here
		},
		onchangevalcolor: function(model) {
			var id = model.get('id');
			var lookupObj = this.lookuptable[id];
			
		},
		removeFromDom: function() {
			//if (this.rendertype === "grid")
			var alarmGroups = this.model.get('alarms');
			for (var i = 0; i < alarmGroups.length; i++) {
				var models = alarmGroups[i].models;
				for (var j = 0; j < models.length; j++) {
					var alarm = models[j];
					alarm.trigger('removing', sensor);
					alarm.trigger('destroy', sensor);
				}
			}
			this.container.parent().remove();
			this.model.trigger('removing', this.model);
			this.remove();
			this.unbind();
		},
		onresize: function(model) {
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;
			var tableToChange = this.container.find('.jqgridtable');
			var gboxHeight = undefined;

			if (this.prevGboxHeight !== undefined) {
				gboxHeight = this.prevGboxHeight;
			} else {
				gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();
			}

			var finalGridHeight = height - gboxHeight - 2;
			var finalGridWidth = width - 1;

			tableToChange.jqGrid('setGridHeight', finalGridHeight);
			tableToChange.jqGrid('setGridWidth', finalGridWidth, true);
			$('.ui-jqgrid tr.jqgrow td').css('height', 12 * scale + 'px');
			//this.jqgridElem.trigger('reloadGrid');
			$('.ui-jqgrid tr.jqgrow td').css('height', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-btable').css('table-layout', 'auto');
			$('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow', 'hidden');
			$('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow-x', 'hidden');
			$('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow-y', 'hidden');
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('overflow', 'hidden');
		}

	});

	return AlarmListView;
});