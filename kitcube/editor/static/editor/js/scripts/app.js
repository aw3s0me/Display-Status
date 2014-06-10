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
  'cookie',
  //'views/boardView',
  //'views/menuLeft',
  //'views/userPanel',
  //'views/menuRight',
  //'views/txtEditorView',
  'router', // Request router.js
  'models/userModel',
], function($, _, Backbone, /*FlatUi,*/ ace, kitgrid, YAML, sizeDet, parser, dataDownloader, OAutha, minicolors2, Cookie, Router, UserModel) {
  var initialize_user = function() {
    var token = $.cookie('access_token');
    window.activeSessionUser = new UserModel();
    if (token && token.length > 0) {
      var username = $('#userStatus').find('span').text();
      var group = $('meta[name="projects"]').attr('content');
      if (!username.length || !group.length) {
        return;
      }
      window.activeSessionUser.set({
        username: username,
        token: token,
        logged_in: true,
        group: group
      })
      $('#banner').append(window.mainscrBtnTemplate);
    }
  }

  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {
      window.host = "http://katrin.kit.edu/adei/";

      window.openWindow = function() {
        window.location.href = '../editor/';
      }

      window.mainscrBtnTemplate = '<button onclick="window.openWindow()"; class="btn btn-default circle-btn" id="goMainscreenButton" data-toggle="tooltip" data-placement="bottom" title="Go to Mainscreen"><span class="glyphicon glyphicon-edit"></span></button>';
      var csrfToken = $('meta[name="csrf_token"]').attr('content');
      console.log(csrfToken);
      $(document).ajaxSend(function(event, xhr, settings) {
        /* stuff to do before an AJAX request is sent */
        //xhr.setRequestHeader('X-CSRFToken', csrfToken);
      });

      var body = document.body,
        html = document.documentElement;

      var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

      $('body').css('min-height', height);

      $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
          if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
          } else {
            o[this.name] = this.value || '';
          }
        });
        return o;
      };

      OAuth.initialize('4caAw7s25v0glGlJEoQgbBjCxkU');
      console.log(OAuth)

      initialize_user();
      $('#toggleGridButton').show();
      Router.initialize();
    });
  }
  return {
    initialize: initialize
  };
});