//The router will then load the correct dependencies depending on the current URL.
define([
  'jquery',
  'underscore',
  'backbone',
  'flatui-app',
  'ace',
  'kitgrid',
  'yaml',
  'jquerysort',
  'fittext',
  'slabtext',
  'bigtext',
  //'fittext',
  "kit.sizeDetector",
  "kit.parser",
  "kit.dataDownloader",
  'views/boardView',
  //'views/menuLeft',
  //'views/userPanel',
  //'views/menuRight',
  'views/txtEditorView',
  'router', // Request router.js
], function($, _, Backbone, FlatUi, ace, kitgrid, YAML, Sortable, fitText, slabText, bigtext, sizeDet, parser, dataDownloader, BoardView, TextEditorView, Router) {
  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {

      Router.initialize();

      document.location.href = '#board';

      $("#btnBoard").click(function(){
          document.location.href = '#board/0';
      });

      $("#btnTxt").click(function(){
          document.location.href = '#editor';
      });

      $("#btnLogin").click(function(){
          document.location.href = '#login';
      });



    });
  }
  return {
    initialize: initialize
  };
});