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
				cur_proj: {
					name: undefined,
					title: undefined
				},
				cur_conf: {
					name: undefined,
					title: undefined
				},
				//cur_proj: undefined,
				//cur_conf: undefined,
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
				cur_proj: {name: result.data[0].name, title: result.data[0].title},
				cur_conf: {title: result.data[0].configs[0].title, name: result.data[0].configs[0].name},
				cur_data_cfg: result.data[0]['first_config_content']
			});
			
			return result;
		},
		isDataInitialized: function() {
			return (this.get('cur_data') !== undefined);
		},
		getConfig: function(info) {
			var projname = info.projname;
			var projtitle = info.projtitle;
			var confname = info.confname;
			var conftitle = info.conftitle;
			var token = this.getTokenIfLogged();
			if (!token) {
				return;
			}

			if (this.get('cur_proj')['name'] === projname && this.get('cur_conf')['title'] === confname) {
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
				cur_proj: {name: projname, title: projtitle },
				cur_conf: {name: confname, title: conftitle },
			});
			window.location.href = '#rerender';
			//this.get('cur_view').rerender();
			return result;	
		},
		saveConfig: function() {
			var curView = this.get('cur_view');
			if (curView === undefined) {
				self.trigger('error');
				return;
			} 
			var cfg = curView.saveCfg();
			var cur_cfg = undefined;
			var cfgToSave = "";
			if (!cfg) {
				self.trigger('error');
				return;
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
					self.trigger('error');
					break;
				}
			}

			this.set({cur_data_cfg: cfgToSave});
			return cfgToSave;
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
			var self = this;
			var token = this.getTokenIfLogged();
			if (!token) {
				console.log('token ne token')
				self.trigger('error');
			}

			var cfg = this.get('cur_data_cfg');
			var projname = this.get('cur_proj')['name'];
			var confname = this.get('cur_conf')['name'];
			if (!projname || !confname) {
				console.log('projname and confname is not init');
				self.trigger('error');
			}

			$.ajax({
				url: '/' + projname + '/configs/' + confname + '/',
				type: 'POST',
				data: cfg,
				headers: {
					'Authorization': token,
				},
				async: true,
				beforeSend: function(xhr, settings) {
					xhr.setRequestHeader('Authorization', token);
				},
				error: function() {
					self.trigger('error', self);
				},
				success: function() {
					self.trigger('success', self);
				}
			});
		}
	});

	return UserModel;
});