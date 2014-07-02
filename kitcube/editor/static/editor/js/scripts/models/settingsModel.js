define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	var hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

	var Settings = Backbone.Model.extend({
		defaults: function() {
			return {
				bgcolor: "",//"#DCDCDC",
				isfluid: false,
				isscrollable: false,
				sizecoeff: "", //2
				boardsize: ["", ""], //60 //25
				footerheight: "",//'8%',
 				bannerheight: "",//'15%',
				resolution: ["", ""],
				host: "",
				dbgroup: "",
				dbname: "",
				server: ""
			}
		},
		initialize: function() {
			
		},
		getCfg: function() {
			return "";
		},
		setAttrs: function(attrs) {
			if (!attrs)
				return;
			this.set(attrs);
		},
		formValues: function() {
			var attrs = this.attributes;
			var screen = {};
			var datasource = {};

			if (attrs.bgcolor) 
				screen['bgcolor'] = attrs.bgcolor;
			screen['isfluid'] = attrs.isfluid;
			screen['isscrollable'] = attrs.isscrollable;
			if (attrs.sizecoeff !== "") {
				screen['sizecoeff'] = attrs.sizecoeff;
			}
			if (attrs.boardsize[0] && attrs.boardsize[1])
				screen.boardsize = attrs.boardsize;
			if (attrs.footerheight)
				screen.footerheight = attrs.footerheight;
			if (attrs.bannerheight)
				screen.bannerheight = attrs.bannerheight;
			if (attrs.resolution[0] && attrs.resolution[1])
				screen.resolution = attrs.resolution;

			datasource.host = attrs.host;
			datasource.dbgroup = attrs.dbgroup;
			datasource.server = attrs.server;
			datasource.dbname = attrs.dbname;

			return {
				'datasource': datasource,
				'screen': screen
			}
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
		    	errors.push({name: 'bgcolor', message: 'Hex value should be similar to patter #FFFFFF.'});
		    }
		    if (attrs.isfluid && (typeof attrs.isfluid !== "boolean" )) {
		    	errors.push({name: 'isfluid', message: 'Fluid param should be boolean.'});
		    }
		    if (attrs.boardsize && $.isArray(attrs.boardsize) && !$.isNumeric(attrs.boardsize[1])) {
		    	errors.push({name: 'boardsizeheight', message: 'Boardsize height param should be number.'});
		    }
		    if (attrs.boardsize && $.isArray(attrs.boardsize) && !$.isNumeric(attrs.boardsize[0])) {
		    	errors.push({name: 'boardsizewidth', message: 'Boardsize width param should be number.'});
		    }
		    if (attrs.resolution && $.isArray(attrs.resolution) && !$.isNumeric(attrs.resolution[1])) {
		    	errors.push({name: 'resolutionheight', message: 'Resolution height param should be number.'});
		    }
		    if (attrs.resolution && $.isArray(attrs.resolution) && !$.isNumeric(attrs.resolution[0])) {
		    	errors.push({name: 'resolutionwidth', message: 'Resolution width param should be number.'});
		    }
		    if (attrs.sizecoeff && !$.isNumeric(attrs.sizecoeff)) {
		    	errors.push({name: 'sizecoeff', message: 'Sizecoeff param should be number.'});
		    }


		    return errors.length > 0 ? errors : false;
		}

	});

	return Settings;

});