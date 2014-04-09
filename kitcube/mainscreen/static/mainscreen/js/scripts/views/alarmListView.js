define(['jquery', 'underscore', 'backbone', 'models/alarmModel', 'collections/alarmCollection'], function($, _, Backbone, AlarmModel, alarmCollection) {
	var AlarmListView = Backbone.View.extend({
		container: undefined,
		model: undefined,
		grid: undefined,
		jqgridElem: undefined,
		tableId: undefined,
		prevGboxHeight: undefined, //fu
		initialize: function(options) { //pass it as new SensorView({collection: collection, options: options})
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			this.render();
			this.model.on('resize', this.onresize, this);
			//this.model.on("change", this.render);
		},
		render: function() {
			if (!this.model.get('collection')) {
				throw "Please init alarm collection";
				return;
			}
			var alarmCollection = this.model.get('collection');
			var alarmModel = this.model;
			console.log(alarmModel);
			var dataToTable = []; //data from collection of alarms
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			this.container = $("<div></div>");
			var dx = alarmModel.get('size')[0];
			var dy = alarmModel.get('size')[1];
			var px = alarmModel.get('coords')[0];
			var py = alarmModel.get('coords')[1];
			var name = alarmModel.get('id');
			var cols = alarmModel.get('cols');
			this.tableId = name;
			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';
			var noWidth = (dx * unitWidth * scale / 6) + 'px';

			var newTable = $("<table class='jqgridtable'></table>");
			var newPager = $("<div id='pager'></div>");

			//bind id of alarmList
			newTable.attr("id", name);
			this.container.append(newTable);
			this.container.append(newPager);

			//create an array of object from models
			for (var i = 0; i < alarmCollection.models.length; i++) {
				dataToTable.push(alarmCollection.models[i].getProperties());
			}

			this.grid.addUnit(dx, dy, px, py, scale, this.container, {
				border: 0,
				transparent: true
			}, this.model);

			this.jqgridElem = newTable.jqGrid({
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
			$('.ui-jqgrid .ui-jqgrid-pager').css('width', this.container.width() - 6);
			$('.ui-jqgrid .ui-jqgrid-htable th div').css('height', 'auto');
			$('.ui-jqgrid .ui-jqgrid-pager').css('height', 40 * scale + 'px');
			$('th.ui-th-column div').css('height', 'auto !important');
			$('th.ui-th-column div').css('white-space', 'normal !important');

			

			var gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();
			this.prevGboxHeight = gboxHeight;
			var finalGridHeight = this.container.height() - gboxHeight - 2;
			var finalGridWidth = this.container.width() - 1;

			newTable.jqGrid('setGridHeight', finalGridHeight);
			newTable.jqGrid('setGridWidth', finalGridWidth, true);
			console.log(finalGridHeight, finalGridWidth);
		},
		rerender: function() {
			console.log(this.model);
			if (!this.model.get('collection')) {
				throw "Please init alarm collection";
				return;
			}
			this.jqgridElem.clearGridData();

			var alarmCollection = this.model.get('collection');
			var alarmModel = this.model;
			var dataToTable = []; //data from collection of alarms
			var scale = this.grid.getScale();

			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;

			var dx = alarmModel.get('size')[0];
			var dy = alarmModel.get('size')[1];
			var px = alarmModel.get('coords')[0];
			var py = alarmModel.get('coords')[1];
			var cols = alarmModel.get('cols');
			var name = alarmModel.get('id');

			var tile = this.container.parent();
			this.grid.resizeTile(px, py, dx, dy, tile);

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';
			var noWidth = (dx * unitWidth * scale / 6) + 'px';

			//create an array of object from models
			for (var i = 0; i < alarmCollection.models.length; i++) {
				dataToTable.push(alarmCollection.models[i].getProperties());
			}

			var tableToChange = this.container.find('.jqgridtable');

			for (var i = 0; i < dataToTable.length; i++) {
				tableToChange.jqGrid('addRowData', i + 1, dataToTable[i]);
			}
			tableToChange.jqGrid('setGridParam',{ rowNum : cols });

			/*$('.ui-jqgrid .ui-jqgrid-htable th').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid tr.jqgrow td').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-view').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-pg-input').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-titlebar').css('font-size', 14 * scale + 'px');
			//$('#pager_center').css('width', newElement.width() - 6); 
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('height', 40 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('width', this.container.width() - 6);
			$('.ui-jqgrid .ui-jqgrid-htable th div').css('height', 'auto');
			$('.ui-jqgrid .ui-jqgrid-pager').css('height', 40 * scale + 'px');
			$('th.ui-th-column div').css('height', 'auto !important');
			$('th.ui-th-column div').css('white-space', 'normal !important'); */ 

			var gboxHeight = undefined;
			if (this.prevGboxHeight !== undefined) {
				gboxHeight = this.prevGboxHeight;
			}
			else {
				gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();
			}

			var finalGridHeight = this.container.height() - gboxHeight - 2;
			var finalGridWidth = this.container.width() - 1;

			tableToChange.jqGrid('setGridHeight', finalGridHeight);
			tableToChange.jqGrid('setGridWidth', finalGridWidth, true);
			this.jqgridElem.trigger('reloadGrid');
		},
		removeFromDom: function() {
			this.grid.removeUnit(this.container.parent());
			console.log('removed alarm');
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
			}
			else {
				gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();
			}

			var finalGridHeight = height - gboxHeight - 2;
			var finalGridWidth = width - 1;

			tableToChange.jqGrid('setGridHeight', finalGridHeight);
			tableToChange.jqGrid('setGridWidth', finalGridWidth, true);
			this.jqgridElem.trigger('reloadGrid');
		}
	});
	return AlarmListView;
});