define(['jquery', 'underscore', 'backbone', 'momentjs'], function($, _, Backbone, momentw) {
	var _minValve = -199.5;
	var _maxValve = 849.5;
	var _min2State = 0.5;
	var _minEndis = 5;
	var _min3State = 0.5;
	var _max3State = 1.5;
	var _minNoneState = 0;
	var _defvalcolor;
	var _defalarmcolor = '#E51400';
	//var _defokcolor = '#40bf40';
	var _defokcolor = '#20c62e';
	var _defmiddlecolor = '#FFA500';
	//var _defmiddlecolor = '#1bb2e2';
	//var _defmiddlecolor = '#FFD700';
	//var _defmiddlecolor = '#75c6ef';
	var DEFAULT_ERROR = '-';

	function _isNumber(n) {
  		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function _isExponent(n) {
		//var reg = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?./;
		//return n.toString().test(reg);
		return (n.toString().indexOf('e') !== -1);
	}

	var Sensor = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				name: "",
				type: "sensor",
				sensortype: "default",
				sensorviewtype: undefined,
				comment: undefined,
				unit: "",
				precision: undefined,
				value: undefined,
				lastTime: undefined,
				max: undefined,
				min: undefined,
				alarm: undefined,
				datasource: "",
				norender: false,
				mask: undefined,
				values: [],
				exp: false,
				size: [3, 3],
				coords: [0, 0],
				valcolor: '#20c62e',
				//bgcolor: '#1bb2e2',
				bgcolor: '#ffffff',
				valUnit: DEFAULT_ERROR,
				link: undefined,
				factor: 1,
				linecolor: undefined,
				label: undefined,
				canberemoved: false,
				isdraggable: false,
				isresizable: false,
				axisname: undefined, //if not undefined, means adei sensor contains info about axis otherwise use temp axis
				cfgObj: null
			}
		},
		initialize: function() {
			_defvalcolor = this.get('valcolor');
			
			switch (this.get('sensortype')) {
				case "2-state":
					{
						if (this.get('min') === undefined) {
							this.set({
								min: _min2State
							})
						} else {
							this.set({
								min: +this.get('min')
							})
						}
						break;
					}
				case "valve":
					{
						if (this.get('min') === undefined) {
							this.set({
								min: _minValve
							})
						} else {
							this.set({
								min: +this.get('min')
							})
						}

						if (this.get('max') === undefined) {
							this.set({
								max: _maxValve
							})
						} else {
							this.set({
								max: +this.get('max')
							})
						}
						break;
					}
				case "3-state":
					{
						if (this.get('min') === undefined) {
							this.set({
								min: _min3State
							})
						} else {
							this.set({
								min: +this.get('min')
							})
						}

						if (this.get('max') === undefined) {
							this.set({
								max: _max3State
							})
						} else {
							this.set({
								max: +this.get('max')
							})
						}

						break;
					}
				case "endis":
					{
						if (this.get('min') === undefined) {
							this.set({
								min: _min2State
							})
						} else {
							this.set({
								min: +this.get('min')
							})
						}
						break;
					}
				case "noval":
					{
						if (this.get('min') === undefined) {
							this.set({
								min: _minNoneState
							});
						} else {
							this.set({
								min: +this.get('min')
							});
						}
						break;
					}
				default:
					{
						if (this.get('min') !== undefined) {
							this.set({
								min: +this.get('min')
							})
						}

						if (this.get('max') !== undefined) {
							this.set({
								max: +this.get('max')
							})
						}
						break;
					}
			}

			this.on('change:value', function() {
				var precision = this.get('precision');
				switch (this.get('sensortype')) {
					case "2-state":
						{

							var val = this.get('value'); 
							if (val > this.get('min')) {
								this.set({valcolor: _defokcolor, valUnit: "YES"});
							}
							else {
								this.set({valcolor: _defalarmcolor, valUnit: "NO"});
							}
							break;
						}
					case "valve":
						{
							var val = this.get('value');
							if (val > this.get('min')) {
								this.set({
									valUnit: "OPEN",
									valcolor: _defokcolor
								});
							} else if (val < this.get('max')) {
								this.set({
									valUnit: "SHORT",
									valcolor: _defokcolor
								});
							} else if (val === 0) {
								this.set({
									valUnit: "---",
									valcolor: _defalarmcolor
								});
							}
							break;
						}
					case "3-state":
						{
							var val = this.get('value');

							var value;
							if (val > this.get('min')) {
								value = "INV"; //"INVALID"
								this.set({
									valcolor: _defalarmcolor
								});
							} else if (val < this.get('max')) {
								value = "MID"; //Full = "MIDDLE"
								this.set({
									valcolor: _defmiddlecolor
								});
							} else {
								value = (val > this.get('max')) ? "IN" : "OUT";
								this.set({
									valcolor: _defokcolor
								});
							}
							this.set({
								valUnit: value
							});
							break;
						}
					case "endis":
						{
							var val = this.get('value');

							if (val > this.get('min')) {
								this.set({
									valUnit: "DIS", //Full = "DIS"
									valcolor: _defalarmcolor
								});
							} else {
								this.set({
									valUnit: "ENAB", //Full = "ENABLED"
									valcolor: _defokcolor
								});
							}
							break;
						}
					case "noval":
						{
							var val = this.get('value');
							var exp = this.get('exp');
							var precision = this.get('precision');
							if (val === this.get('min')) {
								this.set({
									valUnit: "---",
									valcolor: _defalarmcolor
								});
							}
							else {
								var valueToInsert = undefined;
								if (_isNumber(val) && _isNumber(precision)) {
									valueToInsert = exp? val.toExponential(precision) : val.toFixed(precision);
								}
								else {
									valueToInsert = val;
								}

								this.set({
									valUnit: valueToInsert
								});
							}
							break;
						}
					default:
						{
							var val = this.get('value') * this.get('factor');
							var valueToInsert = DEFAULT_ERROR;
							var exp = this.get('exp');
							
							var type = this.get('sensorviewtype');
							if (type === "table") {
								if (_isNumber(precision)) {
									if (exp) {
										valueToInsert = val.toExponential(precision) + " " + this.get('unit');
									}
									else {
										valueToInsert = val.toFixed(precision) + " " + this.get('unit');
									}
									
								}
								else {
									valueToInsert = val + " " + this.get('unit');
								}
							}
							else {
								if (_isNumber(precision)) {
									if (exp) {
										valueToInsert = val.toExponential(precision);
									}
									else {
										valueToInsert = val.toFixed(precision);
									}
									
								}
								else {
									valueToInsert = val;
								}
							}

							this.set({
								valUnit: valueToInsert
							});

							if (this.get('min') === undefined || this.get('max') === undefined) {
								return;
							} else {
								if (val < this.get('min') || val > this.get('max')) {
									this.set({
										valcolor: _defalarmcolor
									});		
								} else {
									this.set({
										valcolor: _defvalcolor
									});
								}
							}

							break;
						}
				}

			});

			//this.updateModel();

		},
		updateModel: function(value, time) {
			if (value === undefined || time === undefined)
				return;
			if (time === this.get('lastTime')) {
				return;
			}
			var array = this.get('values');
			var valToPush = [time, value];
			var valToPush = {
				x: time,
				y: value
			}
			array.push(valToPush);
			this.set({
				'value': value,
				'lastTime': time,
				'values': array
			});

			this.trigger('addPoint', this); 
		},
		setDataModel: function(values, datetime) {
			var self = this;
			var array = [];
			var mom = moment.utc();
			var x = mom.valueOf();
			for (var i = 0; i < values.length; i++) {
				var valToPush = [datetime[i] * 1000, values[i]];
				/*var timeToInsert = datetime[i] * 1000;
				var valToPush = {
					x: timeToInsert,
					//y: 0
					y: values[i]
				} */
				array.push(valToPush);
			}
			self.set({
				'value': values[values.length - 1],
				'lastTime': datetime[datetime.length - 1],
				'values': array
			});

		},
		getChartProperties: function() {
			var seriesName = this.get('name');
			var id = this.get('axisname') === undefined ? this.get('id') + '-axis' : this.get('axisname');
			var chartProp = {
				"data": this.get('values'),
				//"type": 'scatter',
				"id": this.get('id'),
				"yAxis": id
			}

			if (this.get('unit') !== "") {
				seriesName += " (" + this.get('unit') + ")"; 
			}

			chartProp.name = seriesName;
			
			return chartProp;
		},
		getChartAxisInfo: function(scale, options) {
			var self = this;
			var axislabels = options.axislabels;
			var id = this.get('axisname') === undefined ? this.get('id') + '-axis' : this.get('axisname');
			var axisObj = {
				id: id,
				lineWidth: 2
			};

			if (axislabels === false) {
				axisObj.title = {
					text: " "
				}
			}
			else if (this.get('axisname') === undefined) {
				var text = this.get('name');
				if (this.get('unit') !== "") {
					text += " (" + this.get('unit') + ")";
				}

				axisObj.title = {
					text: text
				}
			}
			else {
				var axesInfo = options.adeiAxisInfo;
				var text = axesInfo.axis_name;
				if (!axesInfo) {
					return;
				}
				if (axesInfo.axis_units) {
					text+= " (" + axesInfo.axis_units + ")";
				}

				axisObj.title = {
					text: text
				}
			}

			if (this.get('exp')) {
				axisObj.labels = {
					formatter: function() {
						return this.value.toExponential(self.get('precision'))//Highcharts.numberFormat(this.value, self.get('precision'));
					}
				}
			}

			return axisObj;
			
		},
		getDbUrl: function() {
			return 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + this.get('server') + '&db_name=' + this.get('dbname') + '&db_group=' + this.get('dbgroup') + '&db_mask=' + this.get('mask') + '&window=-1';
		},
		serToJSON: function(options) {
			var cfg = this.get('cfgObj');

			if (!cfg) 
				cfg = this.serFromModel(options);
			else {
				if (cfg['_id']) {
					delete cfg['_id'];
				}

				if (options) {
					if (options['type'] !== 'group') {
						cfg['size'] = this.get('size');
						cfg['coords'] = this.get('coords');
					}
				}
			}

			return cfg;
		},
		serFromModel: function(options) {
			var sensorClone = this.clone();

			if (options) {
				if (options['type'] !== 'group') {
					sensorClone.unset('id', {
						silent: true
					});
				}
				else {
					sensorClone.unset('id', {
						silent: true
					});
					sensorClone.unset('size', {
						silent: true
					});
					sensorClone.unset('coords', {
						silent: true
					});

					if (this.get('type') === 'sensor') {
						sensorClone.unset('type', {
							silent: true
						});
					}

				}

				if (options['diffsensors'] === false){
					sensorClone.unset('dbgroup', {
						silent: true
					});
					sensorClone.unset('dbname', {
						silent: true
					});
					sensorClone.unset('server', {
						silent: true
					});
				}
			}

			if (this.get('type') === 'trend') {
				sensorClone.unset('mask', {
					silent: true
				});
				sensorClone.unset('unit', {
					silent: true
				});
				sensorClone.unset('precision', {
					silent: true
				});
			}

			sensorClone.unset('values', {
				silent: true
			});
			sensorClone.unset('value', {
				silent: true
			});
			sensorClone.unset('lastTime', {
				silent: true
			});
			sensorClone.unset('valUnit', {
				silent: true
			});
			sensorClone.unset('sensorviewtype', {
				silent: true
			});

			if (this.get('factor') === 1) {
				sensorClone.unset('factor', {
					silent: true
				});
			}

			if (this.get('sensortype') === 'default') {
				sensorClone.unset('sensortype', {
					silent: true
				});
			}

			if (this.get('unit') === '') {
				sensorClone.unset('unit', {
					silent: true
				});
			}

			if (this.get('norender') === false) {
				sensorClone.unset('norender', {
					silent: true
				});
			}

			if (this.get('link') === undefined) {
				sensorClone.unset('link', {
					silent: true
				});
			}

			if (this.get('exp') === false) {
				sensorClone.unset('exp', {
					silent: true
				});
			}

			if (this.get('valcolor') === '#338fff') {
				sensorClone.unset('valcolor', {
					silent: true
				});
			}

			if (this.get('name') === undefined) {
				sensorClone.unset('name', {
					silent: true
				});
			}

			if (this.get('comment') === undefined) {
				sensorClone.unset('comment', {
					silent: true
				});
			}

			if (this.get('alarm') === undefined) {
				sensorClone.unset('alarm', {
					silent: true
				});
			}

			if (this.get('precision') === undefined) {
				sensorClone.unset('precision', {
					silent: true
				});
			}

			if (this.get('min') === undefined) {
				sensorClone.unset('min', {
					silent: true
				});
			}

			if (this.get('max') === undefined) {
				sensorClone.unset('max', {
					silent: true
				});
			}

			return _.clone(sensorClone.attributes);
		}
	});

	return Sensor;

});