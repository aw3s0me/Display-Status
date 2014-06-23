define(['jquery', 'underscore', 'backbone', 'models/sensorTableModel', 'text!templates/widgets/sensorjQGridTable.html'], function($, _, Backbone, SensorTableModel, TableTemplate) {

	var sensorJqGridTableView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		model: undefined,
		//dataToTable: undefined,
		colAccess: undefined,
		groups: undefined,
		lookuptable: {},
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
				for (var j = 0; j < collection.models.length; j++) {
					collection.models[j].on('change:value', this.onchangevalue, this);
					collection.models[j].on('change:valcolor', this.onchangevalcolor, this);
				}
			}

			this.render();
			this.model.on('resize', this.onresize, this);
		},
		formHeaders: function() {
			var colModel = [];
			var colNames = this.model.get('colnames');
			var dx = this.model.get('size')[0];
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();
			var elemWidth = parseInt((dx * unitWidth * scale / 6) - 2);
			var startindex = 0;
			
			if (this.model.get('isheader')) {
				startindex = 1;
				colModel.push({
					name: 'column_0',
					index: 'column_0',
					width: elemWidth
				})

				colNames.unshift('Group');
			}

			for (var i = startindex; i < colNames.length; i++) {
				colModel.push({
					name: 'column_' + String(i),
					index: 'column_' + String(i),
					width: elemWidth
				});
			}

			return colModel;
		},
		formDataToTable: function(sensorGroupCollection) {
			var dataToTable = [];

			for (var i = 0; i < sensorGroupCollection.length; i++) {
				var sensorCollection = sensorGroupCollection[i];
				dataToTable.push(sensorCollection.getDataToTable(this.model.get('isheader')));
				sensorCollection.rowIndex = i + 1;
				var tempLookupTable = sensorCollection.getLookupTable(this.model.get('isheader'));
				$.extend(true, this.lookuptable, tempLookupTable);
			}

			return dataToTable;
		},
		render: function() {
			var self = this;
			var sensorGroupCollection = this.model.get('groups');
			var model = this.model;
			var dataToTable = []; 
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var px = model.get('coords')[0];
			var py = model.get('coords')[1];

			var totalHeight = dy * unitHeight * scale;
			var hscale = totalHeight / $(window).height(); //scale font for header

			this.container = $(_.template(TableTemplate, {
				canberemoved: model.get('canberemoved'),
				id: model.get('id'),
				table_id: 'table_' + model.get('id')
			}));

			this.container.css('width', dx * unitHeight * scale + 'px');
			this.container.css('height', dy * unitWidth * scale + 'px');

			/*SETTING DATA COLS/ROWS */
			var colModel = this.formHeaders();
			var colNames = model.get('colnames');

			//var sensorCollection = sensorGroupCollection[0];

			var dataToTable = this.formDataToTable(sensorGroupCollection);

			this.grid.addUnit(this.container, {
				border: 0,
				transparent: true,
				//draggable: model.get('isdraggable'),
				//resizable: model.get('isresizable')
			}, this.model);

			/* INITIALIZE JQGRID */
			var newTable = this.container.find('table');

			this.jqgridElem = newTable.jqGrid({
				datatype: 'local',
				data: dataToTable,
				colNames: colNames,
				//height: 'auto',
				//height: '400',
				//width: '400',
				height: '100%',
				width: '100%',
				shrinkToFit: false,
				autowidth: true,
				hidegrid: false,
				colModel: colModel,
				scrollOffset: 0,
				//rowNum: cols,
				caption: this.model.get('name'),
				loadComplete: function() {
					var grid = newTable;
					var ids = grid.getDataIDs();
					for (var i = 0; i < ids.length; i++) {
						grid.setRowData(ids[i], false, {
							height: 14 * scale + i * 2
						});
					}
				},
				ondblClickRow: function(rowid, iRow, iCol, e) {
					if(document.selection && document.selection.empty) {
				        document.selection.empty();
				    } else if(window.getSelection) {
				        var sel = window.getSelection();
				        sel.removeAllRanges();
				    }

					$(e.target).toggleClass('activeSensorCell');
					//css for class doesnt work
					if ($(e.target).hasClass('activeSensorCell')) {
						$(e.target).css('background-color', 'yellow');
					}
					else {
						$(e.target).css('background-color', '');
					}					
					console.log(e.target);
				    return false;
				}
			}); 

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
			$('.ui-jqgrid tr.jqgrow td').css('height', 14 * scale + 'px');
			//$('.ui-jqgrid .ui-jqgrid-btable').css('table-layout', 'auto');
			$('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow', 'hidden');
			$('.ui-jqgrid .ui-jqgrid-bdiv').css('overflow-x', 'hidden');
			$('.ui-jqgrid .ui-jqgrid-bdiv')
			.css('overflow-y', 'hidden')
			.css('height', '');
			$('.ui-jqgrid .ui-jqgrid-hdiv').css('overflow', 'hidden');

			//$('.ui-jqgrid .ui-jqgrid-btable .jqgrow td').css('height', 0 * scale + 'px !important');

			this.container.find('.close').click(function(event) {
				self.removeFromDom();
			}); 
		},
		reloadView: function() {
			this.container.find('table').trigger('reloadGrid');
		},
		onchangevalue: function(model) {
			var id = model.get('id');
			var lookupObj = this.lookuptable[id];
			//console.log(model);
			this.container.find('table').jqGrid('setCell', lookupObj["row"], lookupObj["col"], model.get('valUnit'));
		},
		onchangevalcolor: function(model) {
			var id = model.get('id');
			var lookupObj = this.lookuptable[id];
			this.container.find('table').jqGrid('setCell', lookupObj["row"], lookupObj["col"], '', {
				//'background-color': model.get('valcolor')
				'color': model.get('valcolor')
			});
		},
		removeFromDom: function() {
			//if (this.rendertype === "grid")
			var sensorGroups = this.model.get('groups');
			for (var i = 0; i < sensorGroups.length; i++) {
				var models = sensorGroups[i].models;
				for (var j = 0; j < models.length; j++) {
					var sensor = models[j];
					sensor.trigger('removing', sensor);
					sensor.trigger('destroy', sensor);
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

	return sensorJqGridTableView;
});