define(['jquery', 'underscore', 'backbone', 'models/chartModel', 'text!templates/widgets/chart.html', 'views/pres/widgetsSettPage'], function($, _, Backbone, ChartModel, ChartTemplate, WidgetSettWindow) {

	var _allSensors = undefined;
	var _isLegendShown = false;

	var ChartView = Backbone.View.extend({
		container: undefined,
		grid: undefined,
		chart: undefined,
		model: undefined,
		board: undefined,
		lookDiv: undefined,
		initialize: function(options) { //pass it as new SensorView({model: model, options: options})
			//this.model.on("change", this.render);
			var self = this;
			if (options.grid) {
				this.grid = options.grid;
			}
			if (options.model) {
				this.model = options.model;
			}
			if (options.allSensors) {
				_allSensors = options.allSensors;
			}
			if (options.board) {
				this.board = options.board;
				this.lookDiv = this.board.el;
			}

			this.model.on('resize', this.onresize, this);
			this.render();

		},
		formSensorElements: function() {
			var elems1Val = this.lookDiv.find('.activeSensor1');
			var elems2Val = this.lookDiv.find('.activeSensor2');
			var elemsVal = this.lookDiv.find('.activeSensor');
			elems = {};

			if (elemsVal)
				elems["0"] = elemsVal;
			if (elems2Val)
				elems["2"] = elems2Val;
			if (elems1Val)
				elems["1"] = elems1Val;

			for (var i = 0; i < elems1Val.length; i++) {
				var jqElement = elems1Val[i];
				$(jqElement).removeClass('activeSensor1');
			}

			for (var i = 0; i < elems2Val.length; i++) {
				var jqElement = elems2Val[i];
				$(jqElement).removeClass('activeSensor2');
			}

			for (var i = 0; i < elemsVal.length; i++) {
				var jqElement = elemsVal[i];
				$(jqElement).removeClass('activeSensor');
			}

			return elems;
		},
		addElements: function(typeObject) {
			var length = typeObject["1"].length + typeObject["2"].length + typeObject["0"].length;
			if (length + this.model.get('models').length > this.model.get('maxelementsize')) {
				alert('You can add only no more than: ' + this.model.get('maxelementsize') + ' elements');
				return;
			}

			if (typeObject["1"])
				this.setSensorInChart(typeObject["1"], 1);
			if (typeObject["2"])
				this.setSensorInChart(typeObject["2"], 2);
			if (typeObject["0"])
				this.setSensorInChart(typeObject["0"], 0);			
		},
		setSensorInChart: function(elems, type) {
			var self = this;
			for (var i = 0; i < elems.length; i++) {
				var jqElement = elems[i];
				var id;
				if (type === 2) {
					id = jqElement.getAttribute('id2');
				} else {
					id = jqElement.getAttribute('id');
				}

				if (this.model.isOnTheChartById(id)) {
					continue;
				}

				var sensorModel = _allSensors[id];
				sensorModel.on('deleteSensor', self.removeSeries, self);
				sensorModel.on('removing', self.onSensorRemoving, self);

				if (!this.model.isLinked(id)){
					self.model.get('link').push(sensorModel.get('id'));
				} 
				
				self.model.get('models').push(sensorModel);
				if (!sensorModel) {
					throw "Cant add sensor";
				}

				//addchart logic
				this.container.find('.sensorChartList').append('<li id="lblChart_' + id + '"><label>' + id + ': ' + sensorModel.get('name') + '</label></li>');
			}
		},
		render: function() {
			//load html template
			var self = this;
			var model = this.model;
			var scale = this.grid.getScale();
			var sizeCoeff = this.board.settings['sizecoeff'] / 2;
			var coeffScale = scale * sizeCoeff;
			var controlPanelHeight = 0;

			this.container = $(_.template(ChartTemplate, {
				id: this.model.get('id')
			}));
			//this.container = $(_.template(ChartTemplate, { id: model.get('id') }));

			this.grid.addUnit(this.container, {
				border: 0,
				transparent: true,
				draggable: true,
				resizable: true
			}, this.model)
			.css('background-color', 'rgb(255, 255, 255)')
			.css('border', '1px solid black');

			if (!model) {
				throw "Please, init model";
				return;
			}

			this.container.find('.chartIdLabel')
				.css('font-size', coeffScale * 20 + 'px')
				.css('margin-left', coeffScale * 14 + 'px');

			var controlPanel = this.container.find('.chartControlPanel');
			//controlPanelHeight = controlPanel.height();
			//controlPanel.css('height', controlPanelHeight);
			//controlPanel.css('top', 14 * scale + 'px')
			controlPanel.css('right', 35 * scale + 'px');
			//.css('top', 10 * scale + 'px');

			controlPanel.css('font-size', coeffScale * 12 + 'px');

			controlPanel.find('.goAdeiBtn').button()
				.click(function(event) {
					console.log(self.getUrlGoToAdei());
					window.open(self.getUrlGoToAdei(), '_blank');
				});

			controlPanel.find('.addChartBtn').button()
				.click(function(event) {
					var elems = self.formSensorElements();
					self.addElements(elems);
				});
			controlPanel.find('.legendChartBtn').button()
				.click(function(event) {
					if (!_isLegendShown) {
						self.chart.legendShow();
						_isLegendShown = true;
					} else {
						self.chart.legendHide();
						_isLegendShown = false;
					}
				});
			this.container.find('.close').css('font-size', coeffScale * 15 + 'px')
				.css('right', coeffScale * 10 + 'px')
				.css('top', coeffScale * 10 + 'px')
				.click(function(event) {
					self.removeFromDom();
				});

			//controlPanel.find('.chartBtn').css('margin-top', coeffScale * 10 + 'px');
			
			controlPanel.find('.resetChartBtn').button()
				.click(function(event) {
					self.resetChart();
				});

			controlPanel.find('.rangeDropdown')
			.css('font-size', coeffScale * 16 + 'px')
			.css('margin-top', coeffScale * 10 + 'px')
			.change(function() {
				var value = $(this).val();
				self.model.set({
					range: value
				});
			});

			this.container.css('height', '100%');

			this.container.find('.sensorChartList')
			.css('margin-top', coeffScale * 26 + 'px');

			this.initChartWhenStart();
			this.initializeContextMenu();
		},
		initializeContextMenu: function() {
            var self = this;
            $.contextMenu({
                selector: '#' + self.model.get('id'),
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    var modal = new WidgetSettWindow({
                    	type: "chart",
                    	model: self.model
                    });
                    console.log(m); 
                },
                items: {
                    "edit": {name: "Edit"}
                }
            });
        },
		initChartWhenStart: function() {
			var chartModel = this.model;
			var linkArr = chartModel.get('link');
			var typeLookup = this.board.sensorViewLookup;

			if (linkArr.length <= 0) {
				return;
			}

			for (var i = 0; i < linkArr.length; i++) {
				var model = _allSensors[linkArr[i]];
				var div = undefined;
				if (typeLookup[linkArr[i]]) {
					switch (typeLookup[linkArr[i]].type) {
						case 0:
							{ //not double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor');
								}
								break;
							}
						case 1:
							{ //first value of double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor1');
								}
								break;
							}
						case 2:
							{ //second value of double
								div = $('#' + typeLookup[linkArr[i]].viewId);
								if (div) {
									div.addClass('activeSensor2');
								}
								break;
							}
						default: //error
							throw "chart error";
					}
				} else {
					return;
				}

			}

			var elems = this.formSensorElements();
			this.addElements(elems);
		},
		removeSensor: function(model) {
			var id = model.get('id');
			model.off('deleteSensor', this.removeSeries);
			model.off('removing', this.onSensorRemoving);
			this.model.removeModel(model.get('id'));
			this.removeSensorFromChartList(model.get('id'));
		},
		removeSensorFromChartList: function(id) {
			this.container.find('.sensorChartList #lblChart_' + id).remove();
		},
		removeFromDom: function() {
			this.container.parent().remove();
			this.remove();
			this.unbind();
			this.model.trigger('removing', this.model);
		},
		onresize: function(model) {
			var dx = model.get('size')[0];
			var dy = model.get('size')[1];
			var unitHeight = this.grid.getUnitSizes().height;
			var unitWidth = this.grid.getUnitSizes().width;
			var scale = this.grid.getScale();

			var height = dy * unitWidth * scale;
			var width = dx * unitHeight * scale;

			//set size here
		},
		onSensorRemoving: function(model) {
			this.removeSensor(model);
		},
		resetChart: function() {
			//console.log('reset');
			var models = _.clone(this.model.get('models'));
			var length = models.length;
			for (var i = 0; i < models.length; i++) {
				models[i].trigger('removedFromChart');
				this.removeSensor(models[i]);
			}
		},
		getUrlGoToAdei: function() {
			var adeiurl = window.host;
			var windowObj = this.getWindow();
			var start = parseInt(windowObj.start / 1000);
			var end = parseInt(windowObj.end / 1000);
			var windowUrl = start + "-" + end;
			var srctree = this.model.getSrcTreeLink();

			adeiurl += "#module=graph&db_server=virtual&db_name=srctree&db_group=-3&contro_group=-3&db_mask=all&experiment=-";
			adeiurl += "&window=" + windowUrl;
			adeiurl += "&module=graph&virtual=srctree&srctree=" + srctree;

			return adeiurl;
		}
	});

	return ChartView;
});