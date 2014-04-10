define(['jquery', 'underscore', 'backbone', 'models/sensorTableModel'], function($, _, Backbone, SensorTableModel) {

	var sensorTableView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		//dataToTable: undefined,
		colAccess: undefined,
		groups: undefined,
		rendertype: "table",
		initialize: function(options) {
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			

			this.groups = this.model.get('groups');


			for (var i = 0; i < this.groups.length; i++) {
				var collection = this.groups[i];
				for (var j = 0 ; j < collection.models.length; j++) {
					collection.models[j].on('change:value', this.changeValue, this);
				}
			}

			if (this.model.get('render') === "grid") {
				rendertype = "grid";
				this.renderJqGrid();
				return;
			}

			this.renderTable();
		},
		renderJqGrid: function() {
			/*if (!this.model.get('collection')) {
				throw "Please init alarm collection";
				return;
			} */
			var sensorGroupCollection = this.model.get('groups');
			var sensorModel = this.model;
			var dataToTable = []; //data from collection of alarms
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;

			this.container = $("<div></div>");
			var dx = sensorModel.get('size')[0];
			var dy = sensorModel.get('size')[1];
			var px = sensorModel.get('coords')[0];
			var py = sensorModel.get('coords')[1];
			var name = sensorModel.get('id');
			var cols = sensorModel.get('cols');

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';

			var newTable = $("<table class='jqgridtable'></table>");
			/*SETTING DATA COLS/ROWS */
			var colNames = this.model.get('colnames');
			var colIds = this.model.get('colids');
			var colModel = [];

			var sensorCollection = sensorGroupCollection[0];

			for (var i = 0; i < colIds.length; i++) {
				colModel.push({
					name: colNames[i],
					index: colIds[i],
					width: elemWidth
				});
			}

			for (var i = 0; i < sensorGroupCollection.length; i++) {
				var sensorCollection = sensorGroupCollection[i];
				var colAccess = [];
				dataToTable.push(sensorCollection.getDataToTable(colIds));
			}



			
			/* APPENDING HTML */
			newTable.attr("id", name);
			this.container.append(newTable);

			this.grid.addUnit(dx, dy, px, py, scale, this.container, {
				border: 0,
				transparent: true
			}, this.model);

			/* INITIALIZE JQGRID */

			this.jqgridElem = newTable.jqGrid({
				datatype: 'local',
				data: dataToTable,
				colNames: colNames,
				shrinkToFit: true,
				autowidth: true,
				hidegrid: false,
				colModel: colModel,
				//rowNum: cols,
				caption: "name",
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

			console.log(this.jqgridElem);

			$('.ui-jqgrid .ui-jqgrid-htable th').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid tr.jqgrow td').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-view').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-pg-input').css('font-size', 14 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-titlebar').css('font-size', 14 * scale + 'px');
			//$('#pager_center').css('width', newElement.width() - 6); 
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('height', 25 * scale + 'px');
			$('.ui-jqgrid .ui-jqgrid-pager').css('width', this.container.width() - 6);
			$('.ui-jqgrid .ui-jqgrid-htable th div').css('height', 'auto');
			$('.ui-jqgrid .ui-jqgrid-pager').css('height', 25 * scale + 'px');
			$('th.ui-th-column div').css('height', 'auto !important');
			$('th.ui-th-column div').css('white-space', 'normal !important');

			

			var gboxHeight = $("#gbox_" + name).height() - $('#gbox_' + name + ' .ui-jqgrid-bdiv').height();
			this.prevGboxHeight = gboxHeight;
			var finalGridHeight = this.container.height() - gboxHeight - 2;
			var finalGridWidth = this.container.width() - 1;

			newTable.jqGrid('setGridHeight', finalGridHeight);
			newTable.jqGrid('setGridWidth', finalGridWidth, true);
			console.log(this.jqgridElem);


		},
		renderTable: function() {
			var sensorGroupCollection = this.model.get('groups');
			var sensorModel = this.model;
			var dataToTable = []; //data from collection of alarms
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;

			this.container = $("<div></div>");
			var dx = sensorModel.get('size')[0];
			var dy = sensorModel.get('size')[1];
			var px = sensorModel.get('coords')[0];
			var py = sensorModel.get('coords')[1];
			var name = sensorModel.get('id');
			var cols = sensorModel.get('cols');

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';

			var newTable = $("<table cellpadding='0' cellspacing='0' class='sensortable'></table>");
			var tableBody = $("<tbody></tbody>");

			/*SETTING DATA COLS/ROWS */
			var colNames = this.model.get('colnames');
			var colIds = this.model.get('colids');

			if (this.model.get('showheaders')) {
				var tablerow = $('<tr></tr>');
				tablerow.append($('<td></td>'));

				for (var i = 1; i < colNames.length; i++) {
					var tableheader = $('<th></th>');
					tableheader.text(colNames[i]);
					tablerow.append(tableheader);
				}
				tableBody.append(tablerow);
			}
			else {
				var tablerow = $('<tr></tr>');

				for (var i = 0; i < colNames.length; i++) {
					var tableheader = $('<th></th>');
					tableheader.text(colNames[i]);
					tablerow.append(tableheader);
				}
				tableBody.append(tablerow);
			}

			for (var i = 0; i < sensorGroupCollection.length; i++) {
				var collection = sensorGroupCollection[i];
				var tablerow = $("<tr></tr>");
				//appending groupname
				var groupheader = $('<th></th>');
				groupheader.text(collection.group);
				tablerow.append(groupheader);

				for (var j = 0; j < collection.models.length; j++) {
					var tablecell = $("<td></td>");
					var model = collection.models[j];
					tablecell.attr('id', model.get('id'));
					tablecell.text(model.get('valUnit'));
					tablerow.append(tablecell);
				}
				tableBody.append(tablerow);
			}
			newTable.append(tableBody);
			this.container = newTable;

			this.grid.addUnit(dx, dy, px, py, scale, this.container, null, this.model);

			//SETTING CSS

			newTable.css('background-color', 'white');
			newTable.parent().css('background-color', 'white');
			newTable.find('th').each( function() {
				$(this).css('background-color', '#ccccff');
			} );


		},
		reloadView: function() {
			this.container.find('table').trigger('reloadGrid');
		},
		changeValue: function(model) {
			var id = model.get('id');
			console.log(model.get('value'));
			console.log(model);
			this.container.find('table').jqGrid('setCell', 1, id, model.get('value') + " " + model.get('unit'));

			this.reloadView();

			//this.jqgridElem.setCell();
		},
		removeFromDom: function() {

		},
		onresize: function() {

		}


	});

	return sensorTableView;
});