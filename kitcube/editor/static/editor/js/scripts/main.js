var editorPath = '/static/editor/js/scripts/';
var mainscreenPath = '/static/mainscreen/js/scripts/';

require.config({
  //baseUrl: '/static/mainscreen/js/scripts/',
  paths: {
    "jquery": mainscreenPath + "vendor/jquery/dist/jquery.min", //DO NOT SPECIFY EXTENSION
    "jqueryui": mainscreenPath + "vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min",
    //MVC part
    "underscore": mainscreenPath + "vendor/underscore-amd/underscore",
    "backbone": mainscreenPath + "vendor/backbone-amd/backbone",
    //Flat-ui part
    "bootstrap": mainscreenPath + "vendor/bootstrap/dist/js/bootstrap",
    //Text Editor part
    "ace": "vendor/ace/build/src-min/ace",
    //There goes my helpers
    "kit.sizeDetector": mainscreenPath + "dev/kit.sizedetector/sizedetector",
    //my grid part
    "kitgrid":  mainscreenPath + "dev/kit.grid/kitGrid",
    "text" : mainscreenPath + "vendor/requirejs-text/text",
    "jqgrid": mainscreenPath + "vendor/jqgrid/js/minified/jquery.jqGrid.min",
    //chart part
    "highcharts": mainscreenPath + "vendor/highcharts.com/js/highcharts.src",
    //colorpicker part
    "minicolors": "vendor/jquery-minicolors/jquery.minicolors.min",
    "chosen": "vendor/chosen_v1.1.0/chosen.jquery.min",
    "oauthio": mainscreenPath + "vendor/oauth.io/dist/oauth.min",
    "cookie": mainscreenPath + "vendor/jquery-cookie/jquery.cookie",
    //"app": editorPath + "app",
    "contextmenu": "vendor/contextmenu/jquery.contextMenu",
    "momentjs": mainscreenPath + "vendor/momentjs/min/moment.min"
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
        mainscreenPath + "vendor/jquery-ui/ui/jquery-ui.js"
      ]
    },
    jqgrid: {
      deps: [
        'jquery',
        mainscreenPath + 'vendor/jqgrid/js/i18n/grid.locale-en'
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
    cookie: {
    	deps: [
    		"jquery"
    	]
    },
    "contextmenu": {
      deps: [
        "jqueryui"
      ],
      exports: "jQuery.contextMenu"
    },
    momentjs: {
      deps: [
        "jquery"
      ]
    },
    oauthio: {
      deps: [
        "jquery"
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