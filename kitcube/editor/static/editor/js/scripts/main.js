require.config({
  paths: {
    "jquery": "vendor/jquery/dist/jquery.min", //DO NOT SPECIFY EXTENSION 
    "jqueryui": "vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min",
    //MVC part
    "underscore": "vendor/underscore-amd/underscore",
    "backbone": "vendor/backbone-amd/backbone",
    //Flat-ui part
    "bootstrap": "vendor/bootstrap/dist/js/bootstrap",
    //"flatui-app": "vendor/flat-ui-official/js/application",
    //Text Editor part
    "ace": "vendor/ace/build/src-min/ace",
    //There goes my helpers
    "kit.sizeDetector": "dev/sizedetector",
    //my grid part
    "kitgrid": "dev/kitGrid",
    "text" : "vendor/requirejs-text/text",
    "jqgrid": "vendor/jqgrid/js/minified/jquery.jqGrid.min",
    //chart part
    "highcharts": "vendor/highcharts.com/js/highcharts.src",
    //colorpicker part
    "minicolors": "vendor/jquery-minicolors/jquery.minicolors.min",
    //"bigtext": "vendor/bigtext/src/bigtext",
    //"momentjs": "vendor/momentjs/min/moment.min",
    "chosen": "vendor/chosen_v1.1.0/chosen.jquery.min",
    "tabdrop": "vendor/bootstrap-tabdrop/build/js/bootstrap-tabdrop.min",
    "oauthio": "vendor/oauth.io/dist/oauth.min",
    "cookie": "vendor/jquery-cookie/jquery.cookie",
    "contextmenu": "vendor/contextmenu/jquery.contextMenu"
  },
  shim: {
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    jqueryui: {
      deps: [
        'jquery',
        "vendor/jquery-ui/ui/jquery-ui"
      ]
    },
    jqgrid: {
      deps: [
        'jquery',
        'vendor/jqgrid/js/i18n/grid.locale-en'
      ]
    },
    bootstrap: {
      deps: ["jquery"]
    },
    "kit.sizeDetector": {
      deps: [
      "jquery"
      ]
    },
    kitgrid: {
      deps: [
        "jquery"//,
       // "dev/kit.grid/widget"
      ]
    },
    ace: {
      deps: [
        "jquery",
      ]
    },
    highcharts: {
      deps: [
        "jquery"
      ]
    },
    minicolors: {
      deps: [
        "jquery",
        "bootstrap"
      ]
    },
    chosen: {
      deps: [
        "jquery"
      ]
    },
    tabdrop: {
      deps: [
        "jquery",
        "bootstrap"
      ]
    },
    cookie: {
    	deps: [
    		"jquery"
    	]
    },
    "contextmenu": {
      deps: [
        "jquery",
        "jqueryui"
      ]
    }
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});