define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

	var Settings = Backbone.Model.extend({
		defaults: function() {
			return {
				bgcolor: "#DCDCDC",
				isfluid: false,
				isscrollable: false,
				sizecoeff: 2,
				boardsizex: 60,
				boardsizey: 25,
				footerheight: '8%',
				bannerheight: '15%',
				resolution: [],
				host: undefined,
				dbgroup: undefined,
				dbname: undefined,
				server: undefined
			}
		},
		initialize: function() {
			
		},
		getCfg: function() {
			return "";
		},
		validate: function(attrs) {
			var errors = [];
 
		    if (!attrs.host) {
		        errors.push({name: 'host', message: 'Please fill host field (host should be without http://).'});
		    }
		    if (!attrs.dbname) {
		        errors.push({name: 'dbname', message: 'Please fill db name field.'});
		    }
		    if (!attrs.dbgroup) {
		        errors.push({name: 'dbgroup', message: 'Please fill db group field.'});
		    }
		    if (!attrs.server) {
		        errors.push({name: 'server', message: 'Please fill server name field.'});
		    }
		    if (attrs.bgcolor && !hexRegex.test(attrs.bgcolor)) {
		    	errors.push({name: 'server', message: 'Hex value should be similar to patter #FFFFFF.'});
		    }
		    if (attrs.isfluid &&) 

		 
		    return errors.length > 0 ? errors : false;
		}

	});

	return Settings;

});