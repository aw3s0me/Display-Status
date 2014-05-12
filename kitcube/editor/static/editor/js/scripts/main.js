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
    "highcharts": "vendor/highcharts.com/js/highcharts.src",
    //colorpicker part
    "minicolors": "vendor/jquery-minicolors/jquery.minicolors.min",
    "bigtext": "vendor/bigtext/src/bigtext",
    "momentjs": "vendor/momentjs/min/moment.min",
    "chosen": "vendor/chosen_v1.1.0/chosen.jquery.min",
    "tabdrop": "vendor/bootstrap-tabdrop/build/js/bootstrap-tabdrop.min",
    "oauthio": "vendor/oauth.io/dist/oauth.min",
    "cookie": "vendor/jquery-cookie/jquery.cookie"
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
    /*"flatui-app": {
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
    },*/
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