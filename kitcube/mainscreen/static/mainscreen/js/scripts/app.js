//The router will then load the correct dependencies depending on the current URL.
define([
  'jquery',
  'underscore',
  'backbone',
  'flatui-app',
  'ace',
  'kitgrid',
  'yaml',
  "kit.sizeDetector",
  "kit.parser",
  "kit.dataDownloader",
  'views/board',
  //'views/menuLeft',
  //'views/userPanel',
  //'views/menuRight',
  'views/txtEditor',
  'router', // Request router.js
], function($, _, Backbone, FlatUi, ace, kitgrid, YAML, sizeDet, parser, dataDownloader, BoardView, TextEditorView, Router) {
  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {

      Router.initialize();
      
      document.location.href = '#board';

    });
  }
  return {
    initialize: initialize
  };
});