define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
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
	//var _defmiddlecolor = '#1bb2e2';
	var _defmiddlecolor = '#FFD700';
	//var _defmiddlecolor = '#75c6ef';

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
				server: undefined,
				//device: undefined,
				dbname: undefined,
				dbgroup: undefined,
				norender: false,
				mask: undefined,
				values: [],
				exp: false,
				size: [2, 2],
				coords: [0, 0],
				valcolor: '#20c62e',
				//bgcolor: '#1bb2e2',
				bgcolor: '#ffffff',
				valUnit: "VAL",
				link: undefined,
				factor: 1,
				linecolor: undefined,
				label: undefined,
				canberemoved: false,
				isdraggable: false,
				isresizable: false,
				cfgObj: null
			}
		},
		initialize: function() {
			//console.log("model created");
			_defvalcolor = this.get('valcolor');
		},
		getChartProperties: function() {
			var seriesName = this.get('name');

			var chartProp = {
				"data": this.get('values'),
				//"type": 'scatter',
				"id": this.get('id'),
				"yAxis": this.get('id') + '-axis' /*,
				marker: {
					radius: 4
				},
				lineWidth: 3 */
			}

			if (this.get('unit') !== "") {
				seriesName += " (" + this.get('unit') + ")"; 
			}

			chartProp.name = seriesName;
			
			return chartProp;
		},
		getChartAxisInfo: function(options) {
			var self = this;
			var axislabels = options.axislabels;
			var axisObj = {
				id: this.get('id') + '-axis',
				//title: {
					//text: ""//this.get('name')
					//align: 'middle',
					//offset: 35
					//y: -10
					/*,
					useHtml: true,
					formatter: function() {
						return ("<span class='datalabels'>" + this.y + "</span>");
					}*/
				//},
				lineWidth: 2
				//lineColor: this.get('valcolor')
			};

			if (axislabels === false) {
				axisObj.title = {
					text: ""
				}
			}
			else {
				var text = this.get('name');
				if (this.get('unit') !== "") {
					text += " (" + this.get('unit') + ")";
				}

				axisObj.title = {
					text: text
				}
			}

			if (this.get('exp') !== true) {
				if (this.get('precision') === undefined) {
					axisObj.labels =  {
						formatter: function() {
							return Highcharts.numberFormat(this.value, 2);
						}
					}
				}
				else {
					var precision = (self.get('precision') > 2 ) ? 2: self.get('precision');

					axisObj.labels = {
						formatter: function() {
							return Highcharts.numberFormat(this.value, precision);
						}
					}
				}
			}
			else {
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