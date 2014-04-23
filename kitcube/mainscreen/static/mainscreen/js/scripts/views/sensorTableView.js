define(['jquery', 'underscore', 'backbone', 'models/sensorTableModel'], function($, _, Backbone, SensorTableModel) {

	var sensorTableView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		//dataToTable: undefined,
		colAccess: undefined,
		groups: undefined,
		rendertype: "table",
		lookuptable: {},
		jqgridElem: undefined,
		prevGboxHeight: undefined,
		initialize: function(options) {
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			

			this.groups = this.model.get('groups');

			
			if (this.model.get('render') === "grid") {
				rendertype = "grid";
				for (var i = 0; i < this.groups.length; i++) {
					var collection = this.groups[i];
					for (var j = 0 ; j < collection.models.length; j++) {
						collection.models[j].on('change:value', this.changeGridValue, this);
					}
				}
				this.renderJqGrid();
				this.model.on('resize', this.onresizeGrid, this);


				return;
			}

			for (var i = 0; i < this.groups.length; i++) {
				var collection = this.groups[i];
				for (var j = 0 ; j < collection.models.length; j++) {
					collection.models[j].on('change:value', this.changeTableValue, this);
					collection.models[j].on('change:bgcolor', this.onchangebgcolortable, this);
				}
			}
			this.model.on('resize', this.onresizeTable, this);
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

			var totalHeight = dy * unitHeight * scale;
			var hscale = totalHeight/$(window).height(); //scale font for header

			this.container = $("<div></div>");
			var dx = sensorModel.get('size')[0];
			var dy = sensorModel.get('size')[1];
			var px = sensorModel.get('coords')[0];
			var py = sensorModel.get('coords')[1];
			var name = sensorModel.get('id');
			var cols = sensorModel.get('cols');

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			var elemWidth = parseInt((dx * unitWidth * scale / 6) - 2);

			var newTable = $("<table class='jqgridtable'></table>");
			/*SETTING DATA COLS/ROWS */
			var colNames = this.model.get('colnames');
			var colIds = this.model.get('colids');
			var colModel = [];

			var sensorCollection = sensorGroupCollection[0];

			for (var i = 0; i < colIds.length; i++) {
				colModel.push({
					name: colIds[i],
					index: colIds[i],
					width: elemWidth
				});
			}

			for (var i = 0; i < sensorGroupCollection.length; i++) {
				var sensorCollection = sensorGroupCollection[i];
				var colAccess = [];
				dataToTable.push(sensorCollection.getDataToTable(colIds));
				sensorCollection.rowId = i + 1;
				var tempLookupTable = sensorCollection.getLookupTable();
				$.extend(true, this.lookuptable ,tempLookupTable);
				
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
				height: '100%',
				shrinkToFit: true,
				autowidth: true,
				hidegrid: false,
				colModel: colModel,
				//rowNum: cols,
				caption: this.model.get('name'),
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

			var totalHeight = dy * unitHeight * scale;
			var hscale = totalHeight/$(window).height(); //scale font for header

			this.container.css('width', dx * unitWidth * scale + 'px');
			this.container.css('height', dy * unitHeight * scale + 'px');

			var elemWidth = (dx * unitWidth * scale / 6) - 2 + 'px';

			var tablecontainer = $("<div class='tablecontainer'></div>")

			var newTable = $("<table cellpadding='0' cellspacing='0' class='sensortable'></table>");
			//var newTable = $("<table cellpadding='0' cellspacing='0' class='bordered-table'></table>");

			var tableBody = $("<tbody></tbody>");

			/*SETTING DATA COLS/ROWS */
			var colNames = this.model.get('colnames');
			var colIds = this.model.get('colids');

			var tableheader = $("<div class='tblheader'></div>");
			tableheader.text(this.model.get('name'));
			//console.log(hscale);
			tableheader.css('font-size', 120 * hscale + 'px');
			this.container.append(tableheader);


			if (this.model.get('showheaders')) {
				//tableheader.

				var tablerow = $('<tr></tr>');
				tablerow.append($('<td></td>'));

				for (var i = 1; i < colNames.length; i++) {
					var colheader = $('<th></th>');
					colheader.text(colNames[i]);
					tablerow.append(colheader);
				}
				tableBody.append(tablerow);
			}
			else {
				var tablerow = $('<tr></tr>');

				for (var i = 0; i < colNames.length; i++) {
					var colheader = $('<th></th>');
					colheader.text(colNames[i]);
					tablerow.append(colheader);
				}
				tableBody.append(tablerow);
			}

			for (var i = 0; i < sensorGroupCollection.length; i++) {
				var collection = sensorGroupCollection[i];
				var tablerow = $("<tr></tr>");
				//appending groupname

				if (this.model.get('showheaders')) {
					var groupheader = $('<th></th>');
					groupheader.text(collection.group);
					tablerow.append(groupheader);
				}
				

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
			tablecontainer.append(newTable)
			this.container.append(tablecontainer)
			//this.container.append(newTable);

			newTable.parent().css('background-color', 'white');

			this.grid.addUnit(dx, dy, px, py, scale, this.container, {
				border: 0,
				transparent: true
			}, this.model);
			this.container.css('border', 'solid 1px')
			//SETTING CSS
			
			
			
		},
		reloadView: function() {
			this.container.find('table').trigger('reloadGrid');
		},
		changeGridValue: function(model) {
			var id = model.get('id');
			var lookupObj = this.lookuptable[id];
			console.log(model.get('value'));
			//console.log(model);
			this.container.find('table').jqGrid('setCell', lookupObj["row"], lookupObj["col"], model.get('valUnit'));

			this.reloadView();
			//this.jqgridElem.setCell();
		},
		changeTableValue: function(model) {
			var id = model.get('id');
			var tablecell = this.container.find("#" + id);
			var value = model.get('valUnit');
			tablecell.text(value);
		},
		onchangebgcolortable: function(model) {
			var id = model.get('id');
			var tablecell = this.container.find("#" + id);
			var value = model.get('valUnit');
			tablecell.css('background-color', model.get('bgcolor'));
		},
		removeFromDom: function() {

		},
		onresizeTable: function(model) {
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();
			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;
			console.log(height,width)

			this.container.css('height', height);
			this.container.css('width', width);

			var totalHeight = dy * unitHeight * scale;
			var hscale = totalHeight/$(window).height(); //scale font for header
			this.container.find(".tblheader").css('font-size', 120 * hscale + 'px');

		},
		onresizeGrid: function(model) {
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

	return sensorTableView;
});