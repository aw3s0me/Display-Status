//The router will then load the correct dependencies depending on the current URL.
define([
  'jquery',
  'underscore',
  'backbone',
  //'flatui-app',
  'ace',
  'kitgrid',
  "kit.sizeDetector",
  //"kit.parser",
  "oauthio",
  'minicolors',
  'cookie',
  'contextmenu',
  //'views/boardView',
  //'views/menuLeft',
  //'views/userPanel',
  //'views/menuRight',
  //'views/txtEditorView',
  'router', // Request router.js
  'models/userModel',
], function($, _, Backbone, /*FlatUi,*/ ace, kitgrid, sizeDet, OAutha, minicolors2, Cookie, Context, Router, UserModel) {
  var initialize_user = function() {
    var token = $.cookie('access_token');
    window.activeSessionUser = new UserModel();
    if (token && token.length > 0) {
      var username = $('#userName').text();
      var groups = $('meta[name="projects"]').attr('content').split(",");
      if (!username.length || !groups.length) {
        return;
      }
      window.activeSessionUser.set({
        username: username,
        token: token,
        logged_in: true,
        groups: groups
      })
    }
  }

  var initialize = function() {
    // Pass in our Router module and call it's initialize function
    $(document).ready(function($) {
      window.host = "http://katrin.kit.edu/adei/";

      window.openWindow = function() {
        window.location.href = '../editor/';
      }

      var csrfToken = $('meta[name="csrf_token"]').attr('content');
      console.log(csrfToken);
      $(document).ajaxSend(function(event, xhr, settings) {
        /* stuff to do before an AJAX request is sent */
          xhr.setRequestHeader('X-CSRFToken', csrfToken);
      });

      var body = document.body,
        html = document.documentElement;

      var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

      $('body').css('min-height', height + 400);
      $('#container').css('min-height', height + 400);

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
      //Adding to all views triggering event function
      Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

      //Adding to all models cfg saving func

      Router.initialize();
    });
  }
  return {
    initialize: initialize
  };
});