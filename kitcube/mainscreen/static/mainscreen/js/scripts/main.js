require.config({
  paths: {
    "jquery": "vendor/jquery/dist/jquery.min", //DO NOT SPECIFY EXTENSION 
    "jqueryui": "vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min",
    //MVC part
    "underscore": "vendor/underscore-amd/underscore",
    "backbone": "vendor/backbone-amd/backbone",
    //Flat-ui part
    "bootstrap": "vendor/bootstrap/dist/js/bootstrap",
    //There goes my helpers
    "kit.sizeDetector": "dev/kit.sizedetector/sizedetector",
    "parser": "dev/parser",
    'detect': 'dev/detect',
    //my grid part
    "kitgrid": "dev/kit.grid/kitGrid",
    "text" : "vendor/requirejs-text/text",
    //yaml part
    "yaml": "vendor/js-yaml/js-yaml.min",
    "jqgrid": "vendor/jqgrid/js/minified/jquery.jqGrid.min",
    //chart part
    "highcharts": "vendor/highcharts.com/js/highcharts.src",
    "highcharts-legend": "vendor/highcharts-legend",
    "highcharts-theme": "vendor/highcharts.com/js/themes/dark-unica",
    //colorpicker
    "minicolors": "vendor/jquery-minicolors/jquery.minicolors.min",
    "momentjs": "vendor/momentjs/min/moment.min",
    "oauthio": "vendor/oauth.io/dist/oauth.min",
    "cookie": "vendor/jquery-cookie/jquery.cookie",
    "modernizr": "vendor/modernizr/modernizr"
  },
  shim: {
    //jqueryui: "jquery",
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
    'detect': {
      deps: [
          'jquery'
      ]
    },
    "kit.sizeDetector": {
      deps: [
        "jquery"
      ]
    },
    "parser": {
      deps: [
        "jquery",
        "yaml"
      ]
    },
    kitgrid: {
      deps: [
        "jquery"
      ]
    },
    highcharts: {
      deps: [
        "jquery"
      ]
    },
    "highcharts-legend": {
      deps: [
        "highcharts"
      ]
    },
    "highcharts-theme": {
      deps: [
          "highcharts"
      ]
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
    },
    cookie: {
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