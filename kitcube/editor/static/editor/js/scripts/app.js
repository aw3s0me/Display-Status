//The router will then load the correct dependencies depending on the current URL.
define([
  'jquery',
  'underscore',
  'backbone',
  //'flatui-app',
  'ace',
  'kitgrid',
  'yaml',
  "kit.sizeDetector",
  "kit.parser",
  "kit.dataDownloader",
  "oauthio",
  'minicolors',
  //'views/boardView',
  //'views/menuLeft',
  //'views/userPanel',
  //'views/menuRight',
  //'views/txtEditorView',
  'router', // Request router.js
], function($, _, Backbone, /*FlatUi,*/ ace, kitgrid, YAML, sizeDet, parser, dataDownloader, OAutha, minicolors2, Router) {
  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {
      var csrfToken = $('meta[name="csrf_token"]').attr('content');
      console.log(csrfToken);
      $(document).ajaxSend(function(event, xhr, settings) {
        /* stuff to do before an AJAX request is sent */
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
      });

      OAuth.initialize('4caAw7s25v0glGlJEoQgbBjCxkU');
      console.log(OAuth)


      Router.initialize();

      //document.location.href = '#login';

      //document.location.href = '#board';

      //document.location.href = '#settings';

      /*$("#btnBoard").click(function(){
          document.location.href = '#board/0';
      });

      $("#btnTxt").click(function(){
          document.location.href = '#editor';
      });

      $("#btnLogin").click(function(){
          document.location.href = '#login';
      }); */



    });
  }
  return {
    initialize: initialize
  };
});