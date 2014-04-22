define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var _minValve = -199.5;
	var _maxValve = 849.5;
	var _min2State = 0.5;
	var _minEndis = 5;
	var _min3State = 0.5;
	var _max3State = 1.5;
	var _minNoneState = 0;
	var _defbgcolor;

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
			name: undefined,
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
			device: undefined,
			dbname: undefined,
			dbgroup: undefined,
			mask: undefined,
			values: undefined,
			size: [],
			coords: [],
			bgcolor: '#338fff',
			valUnit: "NaN",
			sibling: undefined,
			siblingvalue: undefined
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
								this.set({bgcolor: "#66D97B", valUnit: "YES"});
							}
							else {
								this.set({bgcolor: "#F5025B", valUnit: "NO"});
							}
							break;
						}
					case "valve":
						{
							var val = this.get('value');
							if (val > this.get('min')) {
								this.set({
									valUnit: "OPEN",
									bgcolor: "#66D97B"
								});
							} else if (val < this.get('max')) {
								this.set({
									valUnit: "SHORT",
									bgcolor: "#4280D6"
								});
							} else if (val === 0) {
								this.set({
									valUnit: "---",
									bgcolor: "#F5025B"
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
									bgcolor: "#F5025B"
								});
							} else if (val < this.get('max')) {
								value = "MID"; //Full = "MIDDLE"
								this.set({
									bgcolor: "#4280D6"
								});
							} else {
								value = (val > this.get('max')) ? "IN" : "OUT";
								this.set({
									bgcolor: "#66D97B"
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
									bgcolor: "#F5025B"
								});
							} else {
								this.set({
									valUnit: "ENAB", //Full = "ENABLED"
									bgcolor: "#66D97B"
								});
							}
							break;
						}
					case "noval":
						{
							var val = this.get('value');
							if (val === this.get('min')) {
								this.set({
									valUnit: "---",
									bgcolor: "#F5025B"
								});
							}
						}
					default:
						{
							var val = this.get('value');
							var valueToInsert = "NaN";
							if (this.get('name') === "HRC Heater") {
								var a = 1;
							}
							
							var type = this.get('sensorviewtype');
							if (type === "table") {
								if (_isNumber(precision)) {
									if (_isExponent(val)) {
										console.log('exp' + val);
										valueToInsert = val.toExponential(precision) + " " + this.get('unit');
									}
									else {
										valueToInsert = val.toExponential(precision) + " " + this.get('unit');
									}
									
								}
								else {
									valueToInsert = val + " " + this.get('unit');
								}
							}
							else {
								if (_isNumber(precision)) {
									if (_isExponent(val)) {
										console.log('exp' + val);
										valueToInsert = val.toPrecision(precision);
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
										bgcolor: "#F5025B"
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
		},
		getChartProperties: function() {
			return {
				"name": this.get('name'),
				"data": this.get('values')
			}
		},
		getDbUrl: function() {
			return 'http://katrin.kit.edu/adei/services/getdata.php?db_server=' + this.get('server') + '&db_name=' + this.get('dbname') + '&db_group=' + this.get('dbgroup') + '&db_mask=' + this.get('mask') + '&window=-1';
		},
		serToJSON: function() {
			var sensorClone = this.clone();
			sensorClone.unset('id', {
				silent: true
			});
			sensorClone.unset('values', {
				silent: true
			});
			sensorClone.unset('value', {
				silent: true
			});
			sensorClone.unset('lastTime', {
				silent: true
			});
			return _.clone(sensorClone.attributes);
		}
	});

	return Sensor;

});