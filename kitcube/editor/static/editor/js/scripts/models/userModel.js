define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var UserModel = Backbone.Model.extend({
		defaults: function() {
			return {
				id: 0,
				username: "",
				//password: "",
				token: "",
				role: "",
				logged_in: false,
				group: "",
				cur_proj: undefined,
				cur_conf: undefined,
				cur_data: undefined,
				cur_data_cfg: undefined,
				cur_view: undefined,
				cur_is_new: false
			}
		},
		initialize: function(){
			var self = this;
			this.on('logout', function() {
				self.onlogout();
			});
		},
		validate: function(attrs){
			if (attrs.username === "" || attrs.username === undefined || attrs.username.length < 4) {
				return "Please enter username. Length should be more than 4 symbols";
			}
			else if (attrs.password === "" || attrs.password === undefined || attrs.username.length < 5) {
				return "Please enter password. Length should be more than 4 symbols";
			}
			else
				return false;
		},
		isAuthorized: function(){
			return Boolean(this.get('token'));
		},
		url: function() {
			return 'user/';
		},
		onlogout: function() {
			this.resetSession();
		},
		onerror: function() {
			this.resetSession();
		},
		resetSession: function() {
			this.clear();
			this.set(this.defaults);
			$.removeCookie('access_token');
		},
		getTokenIfLogged: function() {
			var user = this;
			var token = user.get('token');
			var result = undefined;
			if (!user.get('logged_in') || !token.length) {
				return false;
			}

			return token;
		},
		getInitData: function() {
			var token = this.getTokenIfLogged();
			if (!token) {
				return;
			}
						
			$.ajax({
				url: '/initprojconf/',
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			});
			
			this.set({
				cur_data: result,
				cur_proj: result.data[0].title,
				cur_conf: result.data[0].configs[0].title,
				cur_data_cfg: result.data[0]['first_config_content']
			});
			
			return result;
		},
		isDataInitialized: function() {
			return (this.get('cur_data') !== undefined);
		},
		getConfig: function(projname, confname) {
			var token = this.getTokenIfLogged();
			if (!token) {
				return;
			}

			if (this.get('cur_proj') === projname && this.get('cur_conf') === confname) {
				return;
			}
						
			$.ajax({
				url: '/' + projname + '/configs/' + confname,
				type: 'GET',
				headers: {
					'Authorization': token,
				},
				async: false,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			})
			.done(function(data) {
				console.log("success");
				result = data;
			});
			this.set({
				cur_data: result,
				cur_data_cfg: result['content'],
				cur_proj: projname,
				cur_conf: confname
			});
			window.location.href = '#rerender';
			//this.get('cur_view').rerender();
			return result;	
		},
		saveConfig: function() {
			var curView = this.get('cur_view');
			if (curView === undefined) {
				return;
			} 
			var cfg = curView.saveCfg();
			var cur_cfg = undefined;
			var cfgToSave = "";
			if (!cfg) {
				alert('Cannot save configuration file');
			}
			switch(curView.metaName) {
				case "settingsView":
				{
					cur_cfg = JSON.parse(this.get('cur_data_cfg'));
					cur_cfg['datasource'] = cfg['datasource']; 
					cur_cfg['screen'] = cfg['screen'];
					cfgToSave = JSON.stringify(cur_cfg, undefined, 4);
					break;
				}
				case "guiEditorView": {
					cur_cfg = JSON.parse(this.get('cur_data_cfg'));
					if (cfg['tabs']) {
						cur_cfg['tabs'] = cfg['tabs'];
					}
					if (cfg['elements']) {
						cur_cfg['elements'] = cfg['elements'];
					}
					cfgToSave = JSON.stringify(cur_cfg, undefined, 4);
					break;
				}
				case "txtEditorView": {
					cfgToSave = cfg;
					break;
				}
				default: {
					alert('Error occured!');
					break;
				}
			}

			this.set({cur_data_cfg: cfgToSave});
		},
		checkData: function() {
			if (!this.isDataInitialized()) {
				this.getInitData();
			}
			else {
				this.saveConfig();
			}
		},
		sendCfgToServer: function() {
			var token = this.getTokenIfLogged();
			if (!token) {
				return;
			}

			var cfg = this.get('cur_data_cfg');
			var projname = this.get('cur_proj');
			var confname = this.get('cur_cfg');
			if (!projname || !confname) {
				alert('Error in sending configuration to server');
				return;
			}

			$.ajax({
				url: '/' + projname + '/configs/' + confname,
				type: 'POST',
				data: cfg,
				headers: {
					'Authorization': token,
				},
				async: true,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				}
			});
		}
	});

	return UserModel;
});