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
    "kit.parser": "dev/kit.parser/kit.cfgParser",
    //my grid part
    "kitgrid": "dev/kit.grid/kitGrid",
    "text" : "vendor/requirejs-text/text",
    //yaml part
    "yaml": "vendor/js-yaml/js-yaml.min",
    "jqgrid": "vendor/jqgrid/js/minified/jquery.jqGrid.min",
    //chart part
    "highcharts": "vendor/highcharts.com/js/highcharts.src",
    "highcharts-legend": "vendor/highcharts-legend",
    //colorpicker
    "minicolors": "vendor/jquery-minicolors/jquery.minicolors.min",
    "bigtext": "vendor/bigtext/src/bigtext",
    "momentjs": "vendor/momentjs/min/moment.min",
    "oauthio": "vendor/oauth.io/dist/oauth.min",
    "cookie": "vendor/jquery-cookie/jquery.cookie",
    "cacher": "dev/datacaching/webSockets"
    //"cacher": "dev/datacacher.min"
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
    /*jquerysort : {
      deps: [
        'jquery',
        'jqueryui'
      ]
    },*/
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
        "jquery",
        "dev/helpers"
      ]
    },
    "kit.parser": {
      deps: [
        "jquery",
        "dev/kit.parser/prshelpers",
        "yaml",
        "dev/helpers"
      ]
    },
    kitgrid: {
      deps: [
        "jquery"//,
       // "dev/kit.grid/widget"
      ]
    },
    /*highcharts: {
      deps: [
        "jquery"
        //"vendor/Highcharts-3.0.10/js/highcharts"
      ]
    }, */
    highcharts: {
      deps: [
        "jquery"
        //"vendor/Highcharts-3.0.10/js/highcharts"
      ]
    },
    "highcharts-legend": {
      deps: [
        "highcharts"
      ]
    },
    bigtext: {
      deps: [
        "jquery"
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
    }/*,
    regression: {
      deps: [
        "highcharts"
      ]
    } */
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});