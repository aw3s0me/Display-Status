define(['jquery', 'underscore', 'backbone', 'momentjs'], function($, _, Backbone, momentw) {
	var _minValve = -199.5;
	var _maxValve = 849.5;
	var _min2State = 0.5;
	var _minEndis = 5;
	var _min3State = 0.5;
	var _max3State = 1.5;
	var _minNoneState = 0;
	var _defbgcolor;
	var _defalarmcolor = '#E51400';
	//var _defokcolor = '#40bf40';
	var _defokcolor = '#20c62e';
	var _defmiddlecolor = '#1bb2e2';
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
		defaults: {
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
			bgcolor: '#1bb2e2',
			valUnit: "NaN",
			link: undefined,
			factor: 1,
			linecolor: undefined,
			cfgObj: null
		},
		initialize: function() {
			//console.log("model created");
			_defbgcolor = this.get('bgcolor');
			
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
								this.set({bgcolor: _defokcolor, valUnit: "YES"});
							}
							else {
								this.set({bgcolor: _defalarmcolor, valUnit: "NO"});
							}
							break;
						}
					case "valve":
						{
							var val = this.get('value');
							if (val > this.get('min')) {
								this.set({
									valUnit: "OPEN",
									bgcolor: _defokcolor
								});
							} else if (val < this.get('max')) {
								this.set({
									valUnit: "SHORT",
									bgcolor: _defokcolor
								});
							} else if (val === 0) {
								this.set({
									valUnit: "---",
									bgcolor: _defalarmcolor
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
									bgcolor: _defalarmcolor
								});
							} else if (val < this.get('max')) {
								value = "MID"; //Full = "MIDDLE"
								this.set({
									bgcolor: _defmiddlecolor
								});
							} else {
								value = (val > this.get('max')) ? "IN" : "OUT";
								this.set({
									bgcolor: _defokcolor
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
									bgcolor: _defalarmcolor
								});
							} else {
								this.set({
									valUnit: "ENAB", //Full = "ENABLED"
									bgcolor: _defokcolor
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
									bgcolor: _defalarmcolor
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
							var valueToInsert = "NaN";
							var exp = this.get('exp');

							if (this.get('name') === "XHV CP Jacket") {
								var a = 1;
								console.log(val);
								console.log(this.get('value'));
								console.log(_isNumber(val));
							}
							
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
										bgcolor: _defalarmcolor
									});		
								} else {
									this.set({
										bgcolor: _defbgcolor
									});
								}
							}

							break;
						}
				}

			});

			//this.updateModel();

		},
		getAdeiDataRange: function(range) {
			if (!_isNumber(range)){
				throw "range value should be timestamp";
			} 
			var now = new Date;
			var self = this;
			var tmpStampNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
			tmpStampNow = Math.floor(tmpStampNow/1000);
			range = Math.floor(range/1000);

			var url = this.getDbUrl().replace("window=-1", "window=" + range + "-" + tmpStampNow);
			//var url = this.getDbUrl().replace("window=-1", "window=" + from + "-" + to);
			console.log(url);
			$.ajax({
				type: "GET",
				url: url,
				async: false,
				success: function(data) {
					console.log(data);
					var arrayOfData = data.split('\n');
					arrayOfData.shift();
					console.log(arrayOfData)
					for (var i = 0; i < arrayOfData.length; i++) {
						if (arrayOfData[i] === "") {
							continue;
						}

						var values = arrayOfData[i].split(', ');
						var mom = moment.utc(values[0], "DD-MMM-YY HH:mm:ss.SSS");
						console.log(mom.valueOf());
						var x = mom.valueOf();
						console.log(x);

						/*var time = values[0].replace(/-/g,'/').replace(/\.\d*$/,'');
						//var time = values[0].replace(/-/g,'/');
						//console.log(time);
						//console.log((new Date()).getTime());
						var darr = values[0].split('.');
						var dat = new Date(darr[0]);
						var datestr = '';
						dat.setMilliseconds(Math.round(darr[1]/1000));
						//datestr = [ [dat.getFullYear(),dat.getMonth()+1,dat.getDate()].join('-') ,' ', [dat.getHours(),dat.getMinutes(),dat.getSeconds()].join(':') ,'.',dat.getMilliseconds()].join('');
						console.log(darr);
						//var parsed = _.clone(Date.UTC(dat.getFullYear(), dat.getMonth()+1, dat.getDate(), dat.getHours(), dat.getMinutes(), dat.getSeconds(), dat.getMilliseconds()));
						//console.log(parseInt(parsed));
						//var x = parseInt(parsed); */

						//var dateObj = new Date(parsed); //WRONG BEHAVIOUR
						var dateObj = new Date(values[0]);

						//console.log(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds(), dateObj.getUTCMilliseconds());
						//var x = Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours() + 2, dateObj.getUTCMinutes(), dateObj.getUTCSeconds(), dateObj.getUTCMilliseconds()); 
						console.log("x: " + x);
						var y = +parseFloat(values[1]).toFixed(7);
						console.log("y: " + y);
						self.get('values').push([x, y]);
					}

					var value = self.get('values')[self.get('values').length - 1][1];
					var lastTime = self.get('values')[self.get('values').length - 1][0];

					self.set({
						'value': value,
						'lastTime': lastTime
					});

				},
				error: function(jqXHR,error, errorThrown) {  
               		if(jqXHR.status && jqXHR.status == 400){
                    	console.log(jqXHR.responseText); 
               		} else {
                   		console.log("Error at getting data from adei at: " + self.get('id'));
                   		throw "Error at getting data from adei at: " + self.get('id');
               		}
         		}
			})

			console.log(self.get('values'))
		},
		updateModel: function() {
			var data = {};
			var self = this;

			$.ajax({
				type: "GET",
				url: self.getDbUrl(),
				success: function(data) {
					var values = data.split(',');
					if (values === "") {
						return;
					}
					var mom = moment.utc();
					var x = mom.valueOf();
					var y = parseFloat(values[values.length - 1]);
					//if (self.get('values').length > 10) {self.get('values').shift();}

					//var array = self.get('values').slice(0); //cloning of array, because backbone works with only one instance
					var valToPush = [x, y];
					var array = self.get('values');
					array.push(valToPush);
					self.set({
						'value': y,
						'lastTime': x,
						'values': array
					});

					self.trigger('addPoint', self);
				},
				error: function(jqXHR,error, errorThrown) {  
               		if(jqXHR.status && jqXHR.status == 400){
                    	console.log(jqXHR.responseText); 
               		} else {
                   		console.log("Error at getting data from adei at: " + self.get('id'));
                   		throw "Error at getting data from adei at: " + self.get('id');
               		}
         		},
         		beforeSend: function(xhr, settings) {
         			var csrfToken = $('meta[name="csrf_token"]').attr('content');
         			xhr.setRequestHeader('X-CSRFToken', csrfToken);
         		}
			})
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
				//lineColor: this.get('bgcolor')
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

			if (this.get('bgcolor') === '#338fff') {
				sensorClone.unset('bgcolor', {
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