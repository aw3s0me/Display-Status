/*requirejs: {
  compile: {
    options: {
      paths: {
        'views/app':'empty:',
      }
    }
  }
} */
require.config({
  paths: {
    "jquery": "vendor/jquery/jquery.min", //DO NOT SPECIFY EXTENSION 
    "jqueryui": "vendor/jquery-ui/ui/jquery-ui",
    //MVC part
    "underscore": "vendor/underscore-amd/underscore",
    "backbone": "vendor/backbone-amd/backbone",
    //Flat-ui part
    "bootstrap": "vendor/bootstrap/dist/js/bootstrap",
    "flatui-app": "vendor/flat-ui-official/js/application",
    //Text Editor part
    "ace": "vendor/ace/build/src-min/ace",
    //There goes my helpers
    "kit.sizeDetector": "dev/kit.sizedetector/sizedetector",
    "kit.parser": "dev/kit.parser/kit.cfgParser",
    "kit.dataDownloader" : "dev/kit.dataDownloader/kit.dataDownloader",
    //my grid part
    "kitgrid": "dev/kit.grid/kitGrid",
    "text" : "vendor/requirejs-text/text",
    //yaml part
    "yaml": "vendor/js-yaml/js-yaml.min",
    "jqgrid": "vendor/jqgrid/js/minified/jquery.jqGrid.min",
    //chart part
    "highcharts": "vendor/Highcharts-3.0.10/js/modules/exporting"//"vendor/highcharts.com/js/modules/exporting.src"
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
        'jquery'
      ]
    },
    jqgrid: {
      deps: [
        'jquery',
        'vendor/jqgrid/js/i18n/grid.locale-en'
      ]
    },
    bootstrap: {
      deps: ["jquery"],
      exports: "$.fn.popover"
    },
    "kit.sizeDetector": {
      deps: [
      "jquery",
      "dev/helpers",
      "kit.dataDownloader"
      ]
    },
    "kit.parser": {
      deps: [
        "jquery",
        "dev/kit.parser/prshelpers",
        "yaml",
        "dev/helpers",
        "kit.dataDownloader"
      ]
    },
    "kit.dataDownloader" : {
      deps: [
        "jquery"
      ]
    },
    "flatui-app": {
      deps: [
        "jquery",
        "jqueryui",
        "bootstrap",
        "vendor/flat-ui-official/js/bootstrap-select",
        "vendor/flat-ui-official/js/bootstrap-switch",
        "vendor/flat-ui-official/js/flatui-checkbox",
        "vendor/flat-ui-official/js/flatui-radio",
        "vendor/flat-ui-official/js/jquery.placeholder",
        "vendor/flat-ui-official/js/jquery.tagsinput"
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
        "jquery",
        "vendor/Highcharts-3.0.10/js/highcharts"
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