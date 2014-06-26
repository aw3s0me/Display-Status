define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var okayColor = '#20c62e';
	var warningColor = '#FFA500';
	var dangerColor = '#E51400';

	var Alarm = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				module: undefined,
				group: undefined,
				app: undefined,
				mask: undefined, //number
				lastDate: undefined,
				delayedBy: undefined,
				severity: undefined,
				description: "",
				inVal: undefined,
				outVal: undefined,
				name: "",
				count: undefined,
				firstseen: 0,
				lastseen: 0,
				color: okayColor
			}
		},
		initialize: function() {
			var self = this;
			//console.log("model created");
			if (this.get('lastseen') !== 'Active') {
				this.set({color: dangerColor});
			}
			else {
				this.set({color: okayColor});
			}

			this.on('change: lastseen', function() {
				if (self.get('lastseen') !== 'Active') {
					self.set({color: dangerColor});
				}
				else {
					self.set({color: okayColor});
				}
			});
		},
		//['severity', 'alarm', 'firstseen', 'lastseen', 'count', 'description']
		getData: function() {
			return {
				severity: this.get('severity'),
				name: this.get('name'),
				firstseen: this.get('firstseen'),
				lastseen: this.get('lastseen'),
				count: this.get('count'),
				description: this.get('description')
			};
		},
		serToJSON: function() {
			var alarmClone = this.clone();
			alarmClone.unset('id', {silent: true});
			return _.clone(alarmClone.attributes);
		}

	});

	return Alarm;

});