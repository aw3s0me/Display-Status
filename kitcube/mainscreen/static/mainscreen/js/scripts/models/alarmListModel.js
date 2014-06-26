define(['jquery', 'underscore', 'backbone', 'collections/alarmCollection', 'models/alarmModel'], function($, _, Backbone, AlarmCollection, AlarmModel) {
	var AlarmList = Backbone.Model.extend({
		defaults: function() {
			return {
				id: undefined,
				type: "alarmlist",
				size: [],
				name: "",
				coords: [],
				masks: [],
				server: undefined,
				dbname: undefined,
				control_group: undefined,
				target: "status",
				colnames: ['Severity', 'Alarm', 'First seen', 'Last seen', 'Count', 'Description'],
				colids: ['severity', 'name', 'firstseen', 'lastseen', 'count', 'description'],
				collection: undefined,
				cfgObj: null
			}
		},
		formDataToTable: function() {
			var dataToTable = [];
			var alarms = this.get('collection').models;
			for (var i = 0; i < alarms.length; i++) {
				dataToTable.push(alarms[i].getData());
			}
			return dataToTable;
		},
		initialize: function() {
			if (this.get('collection') === undefined) {
				this.initAlarmData();	
			}
		},
		getTarget: function() {
			var urlTarget = "alarms";
			switch(this.get('target')) {
				case "summary":
					urlTarget = "alarms_summary";
					break;
				case "current":
					urlTarget = "alarms_current";
					break;
				case "status":
					urlTarget = "status";
					break;
				case "all":
					urlTarget = "alarms";
					break;
				case "default":
					urlTarget = "alarms";
					break;
			}
			return urlTarget;
		},
		createAlarmUrl: function() {
			var dbserver = this.get('server');
			var dbname = this.get('dbname');
			var control_group = this.get('control_group');
			var dbgroup = this.get('dbgroup');
			var masksToRequest = "";
			var masks = this.get('masks');

			var url = window.host + "services/control.php?target=" + this.getTarget() + "&db_server=" + dbserver + '&db_name=' + dbname;
			
			if (dbgroup) {
				url = url + '&db_group=' + dbgroup;
			}

			if (control_group) {
				url = url + "&control_group=" + control_group;
			}

			if (masks.length > 0) {
				masksToRequest = masks.join(',');
				url = url + '&db_mask=' + masksToRequest;
			} 
			console.log(url);

			return url;
		},
		initAlarmData: function() {
			var self = this;
			var url = this.createAlarmUrl();
			var alarmArr = [];
			try {
				getDataFromAdei(url, true, function(data) {
					console.log(data);
					xmldoc = $.parseXML(data);
					$xml = $(xmldoc);
					$error = $xml.find('Error');
					if ($error[0]) {
						alert($error.html() + " at alarmlist: " + this.get('id'));
						return;
					}
					$values = $xml.find('alarms').find('Value').each(function(index) {
						var newAlarmModel = new AlarmModel({
							id : "alarm_" + $(this).attr('id'),
							mask : $(this).attr('id'),
							inVal : $(this).attr('in'),
							outVal : $(this).attr('out'),
							firstseen: $(this).attr('in'),//.format('DD-MMM-YYYY, HH:mm:ss'),
							//lastseen: $(this).attr('out') === "" ? 'Active' :  moment($(this).attr('out') * 1000).format('MMMM Do YYYY, HH:mm:ss'),
							lastseen: $(this).attr('out') === "" ? 'Active' :  moment($(this).attr('out') * 1000).format('DD-MMM-YYYY, HH:mm:ss'),
							name : $(this).attr('name'),
							severity : $(this).attr('severity'),
							count : $(this).attr('count')
						});
						alarmArr.push(newAlarmModel);
					});
					self.set({collection : new AlarmCollection(alarmArr)});
					self.trigger('onalarmsready', self);
				});
			}
			catch(msg) {
				alert('Error when getting axes');
			}
		},
		updateAlarmData: function() {
			var self = this;
			var url = this.createAlarmUrl();
			var models = this.get('collection').models;
			try {
				getDataFromAdei(url, true, function(data) {
					console.log(data);
					xmldoc = $.parseXML(data);
					$xml = $(xmldoc);
					$error = $xml.find('Error');
					if ($error[0]) {
						alert($error.html() + " at alarmlist: " + this.get('id'));
						return;
					}
					$values = $xml.find('Value').each(function(index) {
						var alarmModel = models[index]
						alarmModel.set({
							outVal : $(this).attr('out'),
							severity : $(this).attr('severity'),
							lastseen: $(this).attr('out') === "" ? 'Active' :  moment($(this).attr('out') * 1000).format('DD-MMM-YYYY, HH:mm:ss'),
							count : $(this).attr('count')
						});
					});

					self.trigger('onalarmsfinishedupdating', self);
				});
			}
			catch(msg) {
				alert('Error when getting axes');
			}
		},
		serToJSON: function() {
			var listClone = this.clone();
			listClone.unset('id', {silent: true});

			var jsonAttr = {
				type: this.get('type'),
				size: this.get('size'),
				coords: this.get('coords'),
				cols: this.get('cols')
			}

			var collModels = this.get('collection').models;

			for (var i = 0; i < collModels.length; i++) {
				var model = collModels[i];
				jsonAttr[model.get('id')] = model.serToJSON();
			}

			return jsonAttr;
		}
	});

	return AlarmList;

});
