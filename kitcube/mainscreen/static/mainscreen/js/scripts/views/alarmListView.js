define(['jquery', 'underscore', 'backbone', 'models/alarmModel', 'collections/alarmCollection'], function($, _, Backbone, AlarmModel, alarmCollection) {
	var AlarmListView = Backbone.View.extend({
		container: undefined,
		model: undefined,
		grid: undefined,
		elements: undefined,
		initialize: function(options) { //pass it as new SensorView({collection: collection, options: options})
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.elements) {
				this.elements = options.elements;
			}
			this.render();

			//this.model.on("change", this.render);
		},
		render: function() {
			if (!this.elements) {
				throw "Please init alarm collection";
				return;
			}
			var alarmModel = this.model;
			console.log(alarmModel);
			var dataToTable = []; //data from collection of alarms
			var scale = this.grid.getScale();
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var newElement = $("<div></div>");
			var dx = alarmModel.get('size')[0];
			var dy = alarmModel.size[1];
			var px = alarmModel.coords[0];
			var py = alarmModel.coords[1];
			var name = alarmModel.id;
			var cols = alarmModel.cols;

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

		}
	});
	return AlarmListView;
});