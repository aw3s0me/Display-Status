//The router will then load the correct dependencies depending on the current URL.
define([
  'jquery',
  'underscore',
  'backbone',
  'flatui-app',
  'ace',
  'gridster',
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
], function($, _, Backbone, FlatUi, ace, gridster, YAML, sizeDet, parser, dataDownloader, BoardView, TextEditorView, Router) {
  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {

      Router.initialize();
      var resizeTimer;
      
      $("#toggle-view").attr('type', 'canvas');
      document.location.href = '#board';

      $("#toggle-view").change(function() {
        if ($("#toggle-view").attr('type') === 'editor') {
          console.log('kitconsole');
          $("#toggle-view").attr('type', 'canvas');
          $("#toggle-view>div").removeClass("switch-on").addClass("switch-off switch-animate");
          document.location.href = '#board';
        } else if ($("#toggle-view").attr('type') === 'canvas') {
          console.log('kitcanvas');
          $("#toggle-view").attr('type', 'editor');
          $("#toggle-view>div").removeClass("switch-off").addClass("switch-on switch-animate");
          document.location.href = '#editor';
        }
      });
    });
  }
  return {
    initialize: initialize
  };
});